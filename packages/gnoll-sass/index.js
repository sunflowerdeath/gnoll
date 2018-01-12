const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const cssNext = require('postcss-cssnext')
const cssnano = require('cssnano')

const DEBUG = process.env.NODE_ENV !== 'production'
const ASSETS_CACHING = process.env.GNOLL_ASSETS_CACHING
const SERVER_RENDERING = process.env.GNOLL_SERVER_RENDERING
const ROOT_PATH = process.env.PWD

const cacheDirectory = path.join(ROOT_PATH, 'node_modules', '.cache', 'css-loader')

const getLoaders = ({ extraLoaders, modules }) => {
	const postCssPlugins = [
		cssNext({
			browsers: ['last 2 versions', '>1%', 'ie 11'],
			// wrong warning
			warnForDuplicates: false
		})
	]
	if (!DEBUG) postCssPlugins.push(cssnano())

	const loaders = [
		{
			loader: 'cache-loader',
			options: { cacheDirectory }
		},
		{
			loader: SERVER_RENDERING ? 'css-loader/locals' : 'css-loader',
			options: {
				modules,
				localIdentName: '[name]__[local]--[hash:base64:5]'
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: postCssPlugins
			}
		},
		...(extraLoaders || [])
	]

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
