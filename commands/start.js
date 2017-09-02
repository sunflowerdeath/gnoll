let webpack = require('webpack')
let WebpackDevServer = require('webpack-dev-server')

let getWebpackConfig = require('../utils/getWebpackConfig')
let createWebpackCompiler = require('../utils/createWebpackCompiler')

const PORT = 3000

module.exports = function start(options) {
	let config = getWebpackConfig(options)

	// entry config - https://webpack.js.org/configuration/entry-context/#entry 
	// auto refresh (couldn't find it in the new webpack docs) -
	//     https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api 
	let devServerEntry = 'webpack-dev-server/client?http://localhost:' + PORT + '/'

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

	console.log('Starting the development server...')

	let compiler = createWebpackCompiler(config)
	let server = new WebpackDevServer(compiler, {
		contentBase: config.output.path,
		quiet: true
	})
	server.listen(PORT, () => {
		console.log(`The app is running at http://localhost:${PORT}/`)
		console.log()
	})
}
