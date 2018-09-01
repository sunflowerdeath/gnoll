const chalk = require('chalk')
const emoji = require('node-emoji')
const serve = require('webpack-serve')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = options => {
	process.env.GNOLL_ENTRY = options.entry
	process.env.GNOLL_TARGET = 'web'
	process.env.GNOLL_ENV = 'browser'
	process.env.GNOLL_DEVSERVER = 1

	const { serve: serveConfig, ...webpackConfig } = getWebpackConfig(options)

	const port = (serveConfig && serveConfig.port) || 3000
	const host = (serveConfig && serveConfig.host) || '0.0.0.0'

	console.log(emoji.get('rocket'), ' Starting the development server...')
	console.log(`The app is running at http://${host}:${port}/\n`)

	const compiler = createWebpackCompiler(webpackConfig)

	let start

	serve(
		{},
		{
			...serveConfig,
			host,
			port,
			compiler,
			hotClient: { logLevel: 'silent' },
			devMiddleware: { logLevel: 'silent' },
			logLevel: 'silent'
		}
	)
}
