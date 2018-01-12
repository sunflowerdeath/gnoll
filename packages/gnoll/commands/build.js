const emoji = require('node-emoji')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	const config = getWebpackConfig(options)
	const compiler = createWebpackCompiler(config)
	console.log(
		emoji.get('building_construction'),
		` Creating an optimized production build...\n`
	)
	compiler.run((err, stats) => {
		if (stats.hasErrors()) process.exit(1)

		if (PROFILE) {
			const time = new Date() - start
			console.log(chalk.blue(`PROFILE: ${time}ms`))
			console.log()
		}
	})
}
