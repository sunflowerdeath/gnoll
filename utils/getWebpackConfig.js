let path = require('path')
let fs = require('fs')

let paths = require('./paths')

module.exports = function getWebpackConfig(options) {
	if (options.config) {
		return require(path.resolve(paths.root, options.config))
	}
	
	let rootConfigPath = path.join(paths.root, 'webpack.config.js')
	if (fs.existsSync(rootConfigPath)) {
		return require(rootConfigPath)
	}

	return require('../config/webpack')
}
