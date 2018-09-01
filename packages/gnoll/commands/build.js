const emoji = require('node-emoji')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')
const writeWebpackStats = require('../utils/writeWebpackStats')

module.exports = options => {
	const start = new Date()

	if (options.ssr) process.env.GNOLL_SERVER_RENDERING = 1
	process.env.GNOLL_TARGET = options.ssr ? 'node' : options.target
	process.env.NODE_ENV = options.env
	if (options.assetsCaching) process.env.GNOLL_ASSETS_CACHING = 1

	const config = getWebpackConfig(options)
	cleanWebpackOutputDir(config)

	const compiler = createWebpackCompiler(config, options)
	console.log(
		emoji.get('building_construction'),
		` Creating an optimized production build...\n`
	)

	compiler.run((err, stats) => {
		if (stats.hasErrors()) process.exit(1)
	})
}
