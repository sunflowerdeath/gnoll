const path = require('path')
const fs = require('fs')
const decache = require('decache')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const SERVER_RENDERING = process.env.GNOLL_SERVER_RENDERING

const paths = require('./paths')

const findConfig = options => {
	if (options.config) return path.resolve(paths.root, options.config)
	const rootConfigPath = path.join(paths.root, 'webpack.config.js')
	if (fs.existsSync(rootConfigPath)) return rootConfigPath
	return '../config/webpack'
}

const getTemplate = options => {
	if (process.env.GNOLL_SERVER_RENDERING) return null
	if (options.html === false) return null // --no-html
	if (typeof options.html === 'string') {
		return path.resolve(paths.root, options.html)
	}
	const defaultTemplate = path.join(paths.root, 'src/index.html')
	if (fs.existsSync(defaultTemplate)) return defaultTemplate
	return null
}

const mergeWithOptions = (config, options) => {
	const optionsConfig = {}
	if (options.entry) {
		// webpack-serve works only with full format
		optionsConfig.entry = { main: [options.entry] }
	}
	if (options.out) {
		optionsConfig.output = { path: path.resolve(paths.root, options.out) }
	}
	const template = getTemplate(options)
	if (template) optionsConfig.plugins = [new HtmlWebpackPlugin({ template })]
	return merge(config, optionsConfig)
}

module.exports = options => {
	const configPath = findConfig(options)
	decache(configPath)
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const config = require(configPath)
	return mergeWithOptions(config, options)
}
