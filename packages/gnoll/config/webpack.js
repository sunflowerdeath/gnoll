const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const DEBUG = process.env.NODE_ENV !== 'production'
const DEVSERVER = process.env.GNOLL_DEVSERVER
const ASSETS_CACHING = process.env.GNOLL_ASSETS_CACHING
const SCRIPT_TYPE_MODULE = process.env.GNOLL_SCRIPT_TYPE_MODULE
const SERVER_RENDERING = process.env.GNOLL_SERVER_RENDERING

const paths = require('../utils/paths')
const babelConfig = require('./babel')

const STATIC_FILES_REGEXP = /\.(png|svg|jpg|jpeg|gif|webp|eot|ttf|woff|woff2|otf|mp4|ogg|webm|mp3)$/

const CACHE_ROOT = path.join(paths.root, 'node_modules', '.cache')

const entry = [path.join(paths.src, 'index')]

const output = {
	path: paths.dest,
	filename: SCRIPT_TYPE_MODULE ? '[name].module.js' : '[name].js',
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

if (SERVER_RENDERING) {
	output.libraryTarget = 'umd'
}

// Optimizations for long term caching
if (ASSETS_CACHING) {
	if (!SERVER_RENDERING) {
		output.filename = SCRIPT_TYPE_MODULE
			? '[name].module.[chunkhash].js'
			: '[name].[chunkhash].js'
		plugins.push(
			new ManifestPlugin({
				filter: ({ isInitial }) => isInitial,
				fileName: SCRIPT_TYPE_MODULE ? 'manifest.module.json' : 'manifest.json'
			})
		)
	}
}

// Optimizations for production
if (!DEBUG && !SERVER_RENDERING) {
	plugins.push(new webpack.optimize.ModuleConcatenationPlugin())

	if (!SERVER_RENDERING) {
		plugins.push(new webpack.HashedModuleIdsPlugin())
		plugins.push(
			new UglifyJsPlugin({
				cache: path.join(CACHE_ROOT, 'uglify-js')
			})
		)
	}
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
		loader: 'file-loader',
		options: {
			emitFile: !SERVER_RENDERING && !SCRIPT_TYPE_MODULE
		}
	}
]

module.exports = {
	entry,
	output,
	target: SERVER_RENDERING ? 'node' : 'web',
	plugins,
	module: {
		rules
	},
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
