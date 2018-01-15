const rimrafSync = require('rimraf').sync

module.exports = config => {
	const dest = config.output.path
	console.log(`Cleaning directory ${dest}`)
	rimrafSync(`${dest}/*`)
}
