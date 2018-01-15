const getWebpackConfig = require('../utils/getWebpackConfig')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')

module.exports = options => {
	const config = getWebpackConfig(options)
	cleanWebpackOutputDir(config)
}
