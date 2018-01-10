const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const DEBUG = process.env.NODE_ENV !== 'production'
const DEVSERVER = process.env.GNOLL_DEVSERVER
const CACHING = process.env.GNOLL_CACHING
const MODULE = process.env.GNOLL_MODULE

const paths = require('../utils/paths')
const babelConfig = require('./babel')(MODULE)

const STATIC_FILES_REGEXP = /\.(png|svg|jpg|jpeg|gif|webp|eot|ttf|woff|woff2|otf|mp4|ogg|webm|mp3)$/

const CACHE_ROOT = path.join(paths.root, 'node_modules', '.cache')

const entry = [path.join(paths.src, 'index')]

const output = {
	path: paths.dest,
	filename: MODULE ? '[name].module.js' : '[name].js',
	publicPath: '/'
}

const plugins = [
	new webpack.DefinePlugin({
		DEBUG,
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	})
]

const externals = []

if (CACHING) {
	output.filename = MODULE ? '[name].module.[chunkhash].js' : '[name].[chunkhash].js'
	plugins.push(
		new ManifestPlugin({
			filter: ({ isInitial }) => isInitial,
			fileName: MODULE ? 'manifest.module.json' : 'manifest.json'
		}),
		new webpack.HashedModuleIdsPlugin()
	)
}

if (!DEBUG) {
	plugins.push(
		new webpack.optimize.ModuleConcatenationPlugin(),
		new UglifyJsPlugin({
			cache: path.join(CACHE_ROOT, MODULE ? 'uglify-js-module' : 'uglify-js')
		})
	)
}

if (DEVSERVER) {
	const index = path.join(paths.src, 'index.html')
	if (fs.existsSync(index)) {
		plugins.push(new HtmlWebpackPlugin({ template: index }))
	}
	plugins.push(new webpack.HotModuleReplacementPlugin()) // TODO is it needed?
}

const rules = [
	{
		test: /\.jsx?$/,
		use: ['source-map-loader'],
		enforce: 'pre'
	},
	{
		test: /\.jsx?$/,
		include: [path.join(paths.root, 'src')],
		loader: 'babel-loader',
		options: {
			...babelConfig,
			cacheDirectory: path.join(CACHE_ROOT, 'babel-loader')
		}
	},
	{
		test: STATIC_FILES_REGEXP,
		loader: 'file-loader'
	}
]

module.exports = {
	entry,
	output,
	plugins,
	module: {
		rules
	},
	externals,
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			'node_modules',
			// when gnoll is installed with `npm link`, it's required for webpack-dev-server entry
			path.resolve(__dirname, '..', 'node_modules')
		]
	},
	resolveLoader: {
		modules: [
			'node_modules',
			// when gnoll is installed with `npm link`, loaders are inside local node_modules dir
			path.resolve(__dirname, '..', 'node_modules')
		]
	},
	devtool: DEBUG ? 'cheap-module-source-map' : undefined
}
