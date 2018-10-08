const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('gnoll/utils/paths')

const DEBUG = process.env.NODE_ENV !== 'production'
const ASSETS_CACHING = process.env.GNOLL_ASSETS_CACHING
const SERVER_RENDERING = process.env.GNOLL_SERVER_RENDERING

const findPostCssConfig = () => {
	const rootConfigPath = path.join(paths.root, 'postcss.config.js')
	if (fs.existsSync(rootConfigPath)) return rootConfigPath
	return './config/postcss'
}

const getLoaders = ({ extraLoaders, cssModules } = {}) => {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const postCssConfig = require(findPostCssConfig())

	// https://github.com/webpack-contrib/css-loader#importloaders
	const importLoaders = (extraLoaders ? extraLoaders.length : 0) + 1

	const cssLoaderOptions = {
		importLoaders,
		modules: cssModules,
		localIdentName: '[name]__[local]--[hash:base64:5]',
		sourceMap: DEBUG
	}

	const loaders = []
	if (SERVER_RENDERING) {
		loaders.push(
			{
				loader: require.resolve('cache-loader'),
				options: {
					cacheDirectory: path.join(paths.cache, 'css-loader-ssr')
				}
			},
			{
				loader: require.resolve('css-loader') + '/locals',
				options: cssLoaderOptions
			}
		)
	} else {
		loaders.push(
			{
				loader: DEBUG
					? require.resolve('style-loader')
					: MiniCssExtractPlugin.loader
			},
			{
				loader: require.resolve('cache-loader'),
				options: {
					cacheDirectory: path.join(paths.cache, 'css-loader')
				}
			},
			{ loader: require.resolve('css-loader'), options: cssLoaderOptions }
		)
	}

	loaders.push({
		loader: require.resolve('postcss-loader'),
		options: {
			ident: 'postcss',
			...postCssConfig,
			sourceMap: DEBUG
		}
	})

	if (extraLoaders) loaders.push(...extraLoaders)

	return loaders
}

const scssLoader = {
	loader: require.resolve('sass-loader'),
	options: {
		sourceMap: DEBUG
	}
}

const sassLoader = {
	loader: require.resolve('sass-loader'),
	options: { indentedSyntax: true }
}

module.exports = {
	module: {
		rules: [
			// css
			{
				test: /\.css$/,
				exclude: /\.module\.css$/,
				use: getLoaders()
			},
			{
				test: /\.module\.css$/,
				use: getLoaders({ cssModules: true })
			},
			// scss
			{
				test: /\.scss$/,
				exclude: /\.module\.scss$/,
				use: getLoaders({ extraLoaders: [scssLoader] })
			},
			{
				test: /\.module\.scss$/,
				use: getLoaders({
					cssModules: true,
					extraLoaders: [scssLoader]
				})
			},
			// sass
			{
				test: /\.sass$/,
				exclude: /\.module\.sass$/,
				use: getLoaders({
					cssModules: true,
					extraLoaders: [sassLoader]
				})
			},
			{
				test: /\.module\.sass$/,
				use: getLoaders({ extraLoaders: [sassLoader] })
			}
		]
	},
	resolveLoader: {
		modules: [path.resolve(__dirname, 'node_modules')]
	},
	plugins: [
		!DEBUG &&
			new MiniCssExtractPlugin({
				filename: ASSETS_CACHING
					? '[name].[contenthash].css'
					: '[name].css'
			})
	].filter(Boolean)
}
