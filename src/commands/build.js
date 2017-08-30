let webpack = require('webpack')

let paths = require('../utils/paths')
let getWebpackConfig = require('../utils/getWebpackConfig')
let createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = function build(options) {
	let config = getWebpackConfig(options.config)
	let compiler = createWebpackCompiler(config)
	console.log('Creating an optimized production build...')
	console.log()
	compiler.run((err, stats) => {
		if (stats.hasErrors()) process.exit(1)
	})
}
