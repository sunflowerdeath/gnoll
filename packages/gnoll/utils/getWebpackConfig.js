const path = require('path')
const fs = require('fs')

const paths = require('./paths')

const findConfig = options => {
	if (options.config) return path.resolve(paths.root, options.config)
	const rootConfigPath = path.join(paths.root, 'webpack.config.js')
	if (fs.existsSync(rootConfigPath)) return rootConfigPath
	return '../config/webpack'
}

// eslint-disable-next-line import/no-dynamic-require, global-require
module.exports = options => require(findConfig(options))
