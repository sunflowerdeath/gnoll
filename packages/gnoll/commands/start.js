const chalk = require('chalk')
const emoji = require('node-emoji')
const WebpackDevServer = require('webpack-dev-server')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

const { PROFILE } = process.env

module.exports = options => {

	process.env.GNOLL_ENTRY = options.entry
	process.env.GNOLL_TARGET = 'web'
	process.env.GNOLL_ENV = 'browser'
	process.env.GNOLL_DEVSERVER = 1

	const config = getWebpackConfig(options)

	const port = (config.devServer && config.devServer.port) || 3000
	const host = (config.devServer && config.devServer.host) || '0.0.0.0'

	// add entry for auto refresh (couldn't find it in the new webpack docs) -
	// https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api
	const devServerPath = require.resolve('webpack-dev-server/client')
	const devServerEntry = `${devServerPath}?http://${host}:${port}/`

	const addDevServerEntry = entry =>
		Array.isArray(entry)
			? [...entry, devServerEntry]
			: [entry, devServerEntry]

	if (typeof config.entry === 'string' || Array.isArray(config.entry)) {
		config.entry = addDevServerEntry(config.entry)
	} else {
		// when entry is object
		Object.entries(config.entry).forEach(([key, entry]) => {
			config.entry[key] = addDevServerEntry(entry)
		})
	}

	console.log(emoji.get('rocket'), ' Starting the development server...')
	console.log(`The app is running at http://${host}:${port}/\n`)
	const compiler = createWebpackCompiler(config)
	const server = new WebpackDevServer(compiler, {
		disableHostCheck: true,
		historyApiFallback: true,
		...config.devServer,
		contentBase: config.output.path,
		quiet: true
	})
	server.listen(port, host, () => {})
}
