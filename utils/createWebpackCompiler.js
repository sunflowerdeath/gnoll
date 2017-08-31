let webpack = require('webpack')
let readline = require('readline')
let chalk = require('chalk')

let formatWebpackMessage = require('./formatWebpackMessage')

module.exports = function createCompiler(config) {
	let compiler = webpack(config)

	compiler.apply(new webpack.ProgressPlugin((progress) => {
		readline.clearLine(process.stdout)
		readline.cursorTo(process.stdout, 0)
		let percents = Math.round(progress * 100) + '%'
		process.stdout.write(`Compiling ${percents}.`)
	}))

	compiler.plugin('done', (stats) => {
		let jsonStats = stats.toJson()
		let hasErrors = stats.hasErrors()
		let hasWarnings = stats.hasWarnings()

		console.log()

		if (!hasErrors && !hasWarnings) {
			console.log(chalk.green('Compiled successfully!\n'))
			return
		}

		if (hasErrors) {
			console.log(chalk.red('Failed to compile.'))
			console.log()
			jsonStats.errors.forEach((message) => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
			return
		}

		if (hasWarnings) {
			console.log(chalk.yellow('Compiled with warnings.'))
			console.log()
			jsonStats.warnings.forEach((message) => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
		}
	})

	return compiler
}
