const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const DEBUG = process.env.NODE_ENV !== 'production'
const CACHING = process.env.GNOLL_CACHING
const ROOT_PATH = process.env.PWD

module.exports = function gnollSass(options) {
	const modules = options && 'modules' in options ? options.modules : true
	const cacheDirectory = path.join(ROOT_PATH, 'node_modules', '.cache', 'css-loader')

	return {
		module: {
			rules: [
				{
					test: /\.css/,
					use: ExtractTextPlugin.extract({
						disable: DEBUG,
						fallback: 'style-loader',
						use: [
							{
								loader: 'cache-loader',
								options: { cacheDirectory }
							},
							{
								loader: 'css-loader',
								options: {
									modules,
									localIdentName: '[name]__[local]--[hash:base64:5]'
								}
							}
						]
					})
				},
				{
					test: /\.sass/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'cache-loader',
								options: { cacheDirectory }
							},
							{
								loader: 'css-loader',
								options: {
									modules,
									localIdentName: '[name]__[local]--[hash:base64:5]'
								}
							},
							{ loader: 'sass-loader' }
						]
					})
				}
			]
		},
		resolveLoader: {
			modules: [path.resolve(__dirname, 'node_modules')]
		},
		plugins: [
			new ExtractTextPlugin({
				disable: DEBUG,
				filename: CACHING ? '[name].[contenthash].css' : '[name].css'
			})
		]
	}
}
