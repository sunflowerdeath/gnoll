const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = function build(options) {
	const config = getWebpackConfig(options)
	const compiler = createWebpackCompiler(config)
	console.log('Creating development build and rebuilding on changes...')
	console.log()
	compiler.watch({}, () => {})
}
