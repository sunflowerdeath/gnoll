const chalk = require('chalk')
const emoji = require('node-emoji')
const WebpackDevServer = require('webpack-dev-server')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

const { PROFILE } = process.env

module.exports = options => {
	const start = new Date()

	process.env.GNOLL_DEVSERVER = 1

	const config = getWebpackConfig(options)

	const port = (config.devServer && config.devServer.port) || 3000
	const host = (config.devServer && config.devServer.host) || '0.0.0.0'

	// entry config - https://webpack.js.org/configuration/entry-context/#entry
	// auto refresh (couldn't find it in the new webpack docs) -
	//   https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api
	const devServerEntry = `webpack-dev-server/client?http://${host}:${port}/`

	function addDevServerEntry(entry) {
		if (Array.isArray(entry)) {
			return [...entry, devServerEntry]
		}
		return [entry, devServerEntry]
	}

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

	// Webpack startup recompilation fix. Remove when @sokra fixes the bug.
	// https://github.com/webpack/webpack/issues/2983
	// https://github.com/webpack/watchpack/issues/25
	const timefix = 11000
	let initialCompilation = true
	compiler.plugin('watch-run', (watching, callback) => {
		// eslint-disable-next-line no-param-reassign
		watching.startTime += timefix
		callback()
	})
	compiler.plugin('done', stats => {
		// eslint-disable-next-line no-param-reassign
		stats.startTime -= timefix
		if (PROFILE && initialCompilation) {
			const time = new Date() - start
			console.log(chalk.cyan('Time:'), `${time}ms`)
		}
		initialCompilation = false
	})

	const server = new WebpackDevServer(compiler, {
		disableHostCheck: true,
		historyApiFallback: true,
		...config.devServer,
		contentBase: config.output.path,
		quiet: true
	})
	server.listen(port, host, () => {})
}
