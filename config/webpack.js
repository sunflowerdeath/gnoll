let path = require('path')
let webpack = require('webpack')

let paths = require('../utils/paths')
let babelConfig = require('./babel')

let DEBUG = process.env.NODE_ENV !== 'production'

let entry = [
	path.join(paths.src, 'index')
]

let output = {
	path: paths.dest,
	filename: 'bundle.js'
}

let plugins = [
	new webpack.DefinePlugin({
		DEBUG,
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	})
]

if (!DEBUG) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {warnings: false}
	}))
}

let rules = [
	{
		test: /\.jsx?$/,
		include: [
			path.resolve(paths.root, 'src')
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
	devtool: DEBUG ? 'source-map' : undefined
}
