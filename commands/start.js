const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

const PORT = 3000

module.exports = function start(options) {
	const config = getWebpackConfig(options)

	// entry config - https://webpack.js.org/configuration/entry-context/#entry
	// auto refresh (couldn't find it in the new webpack docs) -
	//     https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api
	const devServerEntry = `webpack-dev-server/client?http://localhost:${PORT}/`

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
		config.entry.forEach((entry, i) => {
			config.entry[i] = addDevServerEntry(entry)
		})
	}

	console.log('Starting the development server...')

	const compiler = createWebpackCompiler(config)

	// Webpack startup recompilation fix. Remove when @sokra fixes the bug.
	// https://github.com/webpack/webpack/issues/2983
	// https://github.com/webpack/watchpack/issues/25
	const timefix = 11000
	compiler.plugin('watch-run', (watching, callback) => {
		watching.startTime += timefix
		callback()
	})
	compiler.plugin('done', stats => {
		stats.startTime -= timefix
	})

	const server = new WebpackDevServer(compiler, {
		...config.devServer,
		contentBase: config.output.path,
		quiet: true
	})
	server.listen(PORT, () => {
		console.log(`The app is running at http://localhost:${PORT}/`)
		console.log()
	})
}
