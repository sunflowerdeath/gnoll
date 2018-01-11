const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const cssNext = require('postcss-cssnext')
const cssnano = require('cssnano')

const DEBUG = process.env.NODE_ENV !== 'production'
const CACHING = process.env.GNOLL_CACHING
const ROOT_PATH = process.env.PWD

const cacheDirectory = path.join(ROOT_PATH, 'node_modules', '.cache', 'css-loader')

const getLoaders = ({ extraLoaders, modules }) =>
	ExtractTextPlugin.extract({
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
			},
			{
				loader: 'postcss-loader',
				options: {
					plugins: [
						cssNext({
							browsers: ['last 2 versions', '>1%', 'ie 11'],
							// wrong warning
							warnForDuplicates: false
						}),
						!DEBUG && cssnano()
					]
				}
			},
			...(extraLoaders || [])
		]
	})

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
				disable: DEBUG,
				filename: CACHING ? '[name].[contenthash].css' : '[name].css'
			})
		]
	}
}
