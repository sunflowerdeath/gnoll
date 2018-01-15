const path = require('path')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const paths = require('gnoll/utils/paths')

const DEBUG = process.env.NODE_ENV !== 'production'
const ASSETS_CACHING = process.env.GNOLL_ASSETS_CACHING
const SERVER_RENDERING = process.env.GNOLL_SERVER_RENDERING

const findPostCssConfig = () => {
	const rootConfigPath = path.join(paths.root, 'postcss.config.js')
	if (fs.existsSync(rootConfigPath)) return rootConfigPath
	return '../config/postcss'
}

const getLoaders = ({ extraLoaders, modules }) => {
	// https://github.com/webpack-contrib/css-loader#importloaders
	const importLoaders = (extraLoaders ? extraLoaders.length : 0) + 1
	const loaders = [
		{
			loader: 'cache-loader',
			options: { cacheDirectory: path.join(paths.cache, 'css-loader') }
		},
		{
			loader: SERVER_RENDERING ? 'css-loader/locals' : 'css-loader',
			options: {
				importLoaders,
				modules,
				localIdentName: '[name]__[local]--[hash:base64:5]'
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				// eslint-disable-next-line import/no-dynamic-require, global-require
				...require(findPostCssConfig())
			}
		}
	]
	if (extraLoaders) loaders.push(...extraLoaders)

	if (SERVER_RENDERING) return loaders
	return ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: loaders
	})
}

module.exports = function gnollSass(options) {
	const modules = options && 'modules' in options ? options.modules : true

	return {
		module: {
			rules: [
				{
					test: /\.css/,
					use: getLoaders({ modules })
				},
				{
					test: /\.scss/,
					use: getLoaders({
						modules,
						extraLoaders: [{ loader: 'sass-loader' }]
					})
				},
				{
					test: /\.sass/,
					use: getLoaders({
						modules,
						extraLoaders: [
							{ loader: 'sass-loader', options: { indentedSyntax: true } }
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
				disable: Boolean(DEBUG || SERVER_RENDERING),
				filename: ASSETS_CACHING ? '[name].[contenthash].css' : '[name].css'
			})
		]
	}
}
