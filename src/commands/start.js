let webpack = require('webpack')
let WebpackDevServer = require('webpack-dev-server')
let chalk = require('chalk')

let paths = require('../utils/paths.js')
let config = require(paths.webpackConfig)
let webpackOutput = require('../utils/webpackOutput.js')

module.exports = function start() {
	let port = 3000

	// entry config - https://webpack.github.io/docs/configuration.html#entry 
	// auto refresh - https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api 
	let devServerEntry = 'webpack-dev-server/client?http://localhost:' + port + '/'

	function addDevServerEntry(entry) {
		if (Array.isArray(entry)) {
			return [...entry, devServerEntry]
		} else {
			return [entry, devServerEntry]
		}
	}

	if (typeof config.entry === 'string' || Array.isArray(config.entry)) {
		config.entry = addDevServerEntry(config.entry)
	} else {
		// when entry is object
		for (let i in config.entry) config.entry[i] = addDevServerEntry(config.entry[i])
	}

	config.output.publicPath = '/' // TODO: why

	let compiler = webpack(config)
	webpackOutput(compiler, function() {
		console.log('The app is running at http://localhost:' + port + '/')
		console.log()
	})

	console.log('Starting the development server...')

	let server = new WebpackDevServer(compiler, {
		contentBase: config.output.path,
		quiet: true
	})
	server.listen(port)
}
