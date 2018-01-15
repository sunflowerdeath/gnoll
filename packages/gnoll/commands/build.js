const emoji = require('node-emoji')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	if (options.caching) process.env.GNOLL_ASSETS_CACHING = 1
	if (options.server) process.env.GNOLL_SERVER_RENDERING = 1
	if (options.module) process.env.GNOLL_SCRIPT_TYPE_MODULE = 1
	if (!options.server) process.env.NODE_ENV = 'production'

	const config = getWebpackConfig(options)
	cleanWebpackOutputDir(config)

	const compiler = createWebpackCompiler(config, options)
	console.log(
		emoji.get('building_construction'),
		` Creating an optimized production build...\n`
	)
	compiler.run((err, stats) => {
		if (stats.hasErrors()) process.exit(1)
		if (PROFILE) {
			const time = new Date() - start
			console.log(chalk.cyan('Time:'), `${time}ms`)
		}
	})
}
