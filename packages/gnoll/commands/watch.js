const emoji = require('node-emoji')
const EventEmitter = require('events')
const chalk = require('chalk')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')
const cleanWebpackOutputDir = require('../utils/cleanWebpackOutputDir')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	process.env.GNOLL_WATCH = 1
	if (options.caching) process.env.GNOLL_ASSETS_CACHING = 1
	if (options.server) process.env.GNOLL_SERVER_RENDERING = 1

	const emitter = new EventEmitter()
	const config = getWebpackConfig(options)

	cleanWebpackOutputDir(config)

	const compiler = createWebpackCompiler(config, options)
	console.log(
		emoji.get('eyes'),
		' Creating development build and rebuilding on changes...\n'
	)
	compiler.watch({}, () => {})
	let initialCompilation = true
	compiler.plugin('done', stats => {
		emitter.emit('done', stats)
		if (PROFILE && initialCompilation) {
			const time = new Date() - start
			console.log(chalk.cyan('Time:'), `${time}ms`)
		}
		initialCompilation = false
	})

	return emitter
}
