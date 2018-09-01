const emoji = require('node-emoji')
const EventEmitter = require('events')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	process.env.GNOLL_ENTRY = options.entry
	process.env.GNOLL_TARGET = options.target
	process.env.GNOLL_ENV = options.env
	if (options.caching) process.env.GNOLL_ASSETS_CACHING = 1

	const emitter = new EventEmitter()
	const config = getWebpackConfig(options)

	cleanWebpackOutputDir(config)

	const compiler = createWebpackCompiler(config, options)
	console.log(
		emoji.get('eyes'),
		chalk.bold(' Creating development build and rebuilding on changes...\n')
	)
	compiler.watch({}, () => {})

	return emitter
}
