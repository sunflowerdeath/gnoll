const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = function build(options) {
	const config = getWebpackConfig(options)
	const compiler = createWebpackCompiler(config)
	console.log('Creating an optimized production build...')
	console.log()
	compiler.run((err, stats) => {
		if (stats.hasErrors()) process.exit(1)
	})
}
