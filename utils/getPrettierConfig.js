let fs = require('fs')
let path = require('path')
// let prettier = require('prettier')

let paths = require('./paths')

module.exports = function getPrettierConfig() {
	// TODO wait for release
	// https://github.com/prettier/prettier/commit/088aa71b07bc25bc3640b1e188ec906ef6d17b1b
	// prettier.resolveConfig.sync(paths.root)

	let rootConfigPath = path.join(paths.root, 'prettier.config.js')
	if (fs.existsSync(rootConfigPath)) {
		return require(rootConfigPath)
	}

	let rootRcConfigPath = path.join(paths.root, '.prettierrc')
	if (fs.existsSync(rootConfigPath)) {
		return JSON.parse(fs.readFileSync(rootRcConfigPath))
	}

	return {}
}
