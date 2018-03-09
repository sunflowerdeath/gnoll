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
	return './config/postcss'
}

const getLoaders = ({ extraLoaders, cssModules }) => {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const postCssConfig = require(findPostCssConfig())

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
				modules: cssModules,
				localIdentName: '[name]__[local]--[hash:base64:5]',
				sourceMap: DEBUG
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				...postCssConfig,
				sourceMap: DEBUG
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
	const cssModules =
		options && 'modules' in options ? options.cssModules : true

	return {
		module: {
			rules: [
				{
					test: /\.css/,
					use: getLoaders({ cssModules })
				},
				{
					test: /\.scss/,
					use: getLoaders({
						cssModules,
						extraLoaders: [
							{
								loader: 'sass-loader',
								options: {
									sourceMap: DEBUG
								}
							}
						]
					})
				},
				{
					test: /\.sass/,
					use: getLoaders({
						cssModules,
						extraLoaders: [
							{
								loader: 'sass-loader',
								options: { indentedSyntax: true }
							}
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
				filename: ASSETS_CACHING
					? '[name].[contenthash].css'
					: '[name].css'
			})
		]
	}
}
