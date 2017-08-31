let fs = require('fs')
let path = require('path')

let paths = require('./paths')

module.exports = function getPrettierConfig() {
	let rootConfigPath = path.join(paths.root, 'prettier.config.js')
	if (fs.existsSync(rootConfigPath)) {
		return require(rootConfigPath)
	}

	let rootRcConfigPath = path.join(paths.root, '.prettierrc')
	if (fs.existsSync(rootConfigPath)) {
		return JSON.parse(fs.readFileSync(rootRcConfigPath))
	}
}
