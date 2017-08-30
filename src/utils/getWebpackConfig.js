let path = require('path')
let fs = require('fs')

let paths = require('./paths')
let rootConfigPath = path.join(paths.root, 'webpack.config.js')
let localConfigPath = path.resolve(__dirname, '../config/webpack.js')

module.exports = function getWebpackConfig(customConfigPath) {
	let configPath
	if (customConfigPath) {
		configPath = path.resolve(__dirname, customConfigPath)
	} else if (fs.existsSync(rootConfigPath)) {
		configPath = rootConfigPath
	} else {
		configPath = localConfigPath
	}
	return require(configPath)
}
