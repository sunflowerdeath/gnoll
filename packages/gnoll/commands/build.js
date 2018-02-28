const emoji = require('node-emoji')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')
const writeWebpackStats = require('../utils/writeWebpackStats')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	process.env.GNOLL_TARGET = options.target
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
		if (PROFILE) {
			const time = new Date() - start
			console.log(chalk.cyan('Time:'), `${time}ms`)
			writeWebpackStats(stats)
		}
	})
}
