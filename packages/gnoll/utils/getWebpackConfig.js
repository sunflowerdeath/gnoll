const path = require('path')
const fs = require('fs')
const decache = require('decache')

const paths = require('./paths')

getConfigPath = options => {
	if (options.config) return path.resolve(paths.root, options.config)

	const rootConfigPath = path.join(paths.root, 'webpack.config.js')
	if (fs.existsSync(rootConfigPath)) return rootConfigPath

	return '../config/webpack'
}

module.exports = function getWebpackConfig(options) {
	let configPath = getConfigPath(options)
	decache(configPath)
	return require(configPath)
}
