const rimrafSync = require('rimraf').sync

const getWebpackConfig = require('../utils/getWebpackConfig')

module.exports = function clean(options) {
	const config = getWebpackConfig(options)
	const dest = config.output.path
	console.log(`Cleaning directory ${dest}`)
	rimrafSync(`${dest}/*`)
}
