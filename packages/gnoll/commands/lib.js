const path = require('path')

const emoji = require('node-emoji')
const chalk = require('chalk')
const rimrafSync = require('rimraf').sync

const getBabelConfig = require('../utils/getBabelConfig')
const paths = require('../utils/paths')
const BabelCompiler = require('../utils/babelCompiler')

module.exports = cmd => {
	process.env.GNOLL_LIBRARY = 1
	const babelConfig = getBabelConfig()

	console.log(`Cleaning directory ${paths.lib}`)
	rimrafSync(`${paths.lib}/*`)

	const src = path.resolve(paths.root, cmd.entry)
	const compiler = new BabelCompiler(src, paths.lib, {
		babel: babelConfig,
		watch: cmd.watch,
		sourceMaps: cmd.sourceMaps
	})

	let ready = false
	let errors = false

	if (cmd.watch) {
		console.log(emoji.get('eyes'), ' Starting watch...\n')
	} else {
		console.log(emoji.get('package'), ' Compiling files...\n')
	}

	compiler.on('copy', filepath => {
		if (ready) console.log(`File '${filepath}' copied to build dir`)
	})
	compiler.on('success', filepath => {
		if (ready) console.log(`File '${filepath}' compiled successfully`)
	})
	compiler.on('error', (filepath, error) => {
		if (!ready) errors = true

		console.log()
		console.log(error.toString())
		if (error.codeFrame) console.log(`\n${error.codeFrame}\n`)
	})
	compiler.on('ready', () => {
		ready = true
		if (errors) {
			console.log(chalk.red('Compiled with errors.\n'))
		} else {
			console.log(chalk.green('Compiled successfully.\n'))
		}
		if (!cmd.watch) {
			compiler.close()
			process.exit(errors ? 1 : 0)
		}
	})
}
