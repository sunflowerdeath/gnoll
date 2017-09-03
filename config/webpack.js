let path = require('path')
let webpack = require('webpack')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin')

let paths = require('../utils/paths')
let babelConfig = require('./babel')

let DEBUG = process.env.NODE_ENV !== 'production'
let LIBRARY = process.env.GNOLL_LIBRARY
let DEVSERVER = process.env.GNOLL_DEVSERVER
let CACHING = process.env.GNOLL_CACHING

let STATIC_FILES_REGEXP = /\.(png|jpg|webp)$/
let STATIC_FILES_GLOB = '**/*.+(png|jpg|webp)'

let entry = [
	path.join(paths.src, 'index')
]

let output = {
	path: paths.dest,
	filename: '[name].js'
}

let plugins = [
	new webpack.DefinePlugin({
		DEBUG,
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	})
]

let externals = []

if (CACHING) {
	output.filename = '[name].[chunkhash].js'
	plugins.push(new ManifestPlugin({
		filter: ({isInitial}) => isInitial
	}))
	plugins.push(new webpack.HashedModuleIdsPlugin())
	plugins.push(new webpack.optimize.CommonsChunkPlugin({
		name: 'runtime',
		minChunks: Infinity
	}))
}

if (!DEBUG) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {warnings: false}
	}))
}

if (LIBRARY) {
	output.libraryTarget = 'commonjs2'

	// do not resolve import of static files
	externals.push((context, request, callback) => {
		if (STATIC_FILES_REGEXP.test(request)) {
			return callback(null, 'commonjs ' + request);
		}
		callback()
	})

	// copy static files as it
	plugins.push(new CopyWebpackPlugin([{
		context: paths.src,
		from: STATIC_FILES_GLOB
	}]))
}

if (DEVSERVER) {
	plugins.push(new HtmlWebpackPlugin({
		template: path.join(paths.src, 'index.html')
	}))
	plugins.push(new webpack.HotModuleReplacementPlugin())
}

let rules = [
	{
		test: /\.js$/,
		include: [
			path.join(paths.root, 'src')
		],
		loader: 'babel-loader',
		options: babelConfig
	},
	{
		test: /\.(png|jpg|webp)$/,
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
	devtool: DEBUG ? 'cheap-module-source-map' : undefined
}

