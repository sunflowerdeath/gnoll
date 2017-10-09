const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const paths = require('../utils/paths')
const babelConfig = require('./babel')

const DEBUG = process.env.NODE_ENV !== 'production'
const DEVSERVER = process.env.GNOLL_DEVSERVER
const CACHING = process.env.GNOLL_CACHING

const STATIC_FILES_REGEXP = /\.(png|jpg|jpeg|gif|webp|eot|ttf|woff|woff2|mp4|ogg|webm|mp3)$/

const entry = [path.join(paths.src, 'index')]

const output = {
	path: paths.dest,
	filename: '[name].js'
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
	output.filename = '[name].[chunkhash].js'
	plugins.push(
		new ManifestPlugin({ filter: ({ isInitial }) => isInitial }),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
			minChunks: Infinity
		})
	)
}

if (!DEBUG) {
	plugins.push(
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
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
		test: /\.js$/,
		exclude: [path.join(paths.root, 'node_modules')],
		loader: 'babel-loader',
		options: babelConfig
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
	devtool: DEBUG ? 'cheap-module-source-map' : undefined
}
