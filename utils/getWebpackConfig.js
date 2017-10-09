const path = require('path')
const fs = require('fs')

const paths = require('./paths')

module.exports = function getWebpackConfig(options) {
	if (options.config) {
		return require(path.resolve(paths.root, options.config))
	}

	const rootConfigPath = path.join(paths.root, 'webpack.config.js')
	if (fs.existsSync(rootConfigPath)) {
		return require(rootConfigPath)
	}

	return require('../config/webpack')
}
