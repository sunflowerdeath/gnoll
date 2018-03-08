const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-assets-manifest')

const ENV = process.env.NODE_ENV
const TARGET = process.env.GNOLL_TARGET
const ASSETS_CACHING = process.env.GNOLL_ASSETS_CACHING
// const DEV_SERVER = process.env.GNOLL_DEV_SERVER

const paths = require('../utils/paths')
const getBabelConfig = require('../utils/getBabelConfig')

const babelConfig = getBabelConfig()

const STATIC_FILES_REGEXP = /\.(png|svg|jpg|jpeg|gif|webp|eot|ttf|woff|woff2|otf|mp4|ogg|webm|mp3)$/

const entry = [path.resolve(paths.root, 'src/index.js')]

const output = {
	path: path.join(paths.root, 'build'),
	filename: '[name].js',
	publicPath: '/'
}

const plugins = []

if (TARGET === 'node') {
	output.libraryTarget = 'commonjs'
}

// Optimizations for long term caching
if (TARGET === 'web' && ASSETS_CACHING) {
	output.filename = '[name].[chunkhash].js'
	plugins.push(
		new ManifestPlugin({ output: 'manifest.json', writeToDisk: true })
	)
}

if (TARGET === 'web' && ENV === 'production') {
	plugins.push(new webpack.HashedModuleIdsPlugin())
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
			cacheDirectory: path.join(paths.cache, 'babel-loader')
		}
	},
	{
		test: STATIC_FILES_REGEXP,
		loader: 'file-loader',
		options: {
			emitFile: TARGET === 'web'
		}
	}
]

module.exports = {
	entry,
	output,
	target: TARGET,
	mode: ENV === 'production' ? 'production' : 'development',
	plugins,
	module: {
		rules
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: [
			'node_modules',
			// when gnoll is installed with `npm link`,
			// webpack-dev-server entry is inside local node_modules
			path.resolve(__dirname, '..', 'node_modules')
		]
	},
	resolveLoader: {
		modules: [
			'node_modules',
			// when gnoll is installed with `npm link`,
			// loaders are inside local node_modules dir
			path.resolve(__dirname, '..', 'node_modules')
		]
	},
	devtool: ENV !== 'production' ? 'cheap-module-source-map' : undefined
}
