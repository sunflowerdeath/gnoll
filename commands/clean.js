let rimrafSync = require('rimraf').sync

let paths = require('../utils/paths.js')
let getWebpackConfig = require('../utils/getWebpackConfig')

module.exports = function clean(options) {
	let config = getWebpackConfig(options.config)
	let dest = config.output.path
	console.log('Cleaning directory ' + dest)
	rimrafSync(dest + '/*')
}
