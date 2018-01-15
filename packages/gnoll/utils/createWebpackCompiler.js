const webpack = require('webpack')
const readline = require('readline')
const chalk = require('chalk')
const defaults = require('lodash/defaults')

const formatWebpackMessage = require('./formatWebpackMessage')

const { CI } = process.env
const DEFAULT_OPTIONS = {
	progress: true
}

module.exports = function createCompiler(config, options) {
	options = defaults(options, DEFAULT_OPTIONS)

	const compiler = webpack(config)

	if (options.progress && !CI) {
		compiler.apply(
			new webpack.ProgressPlugin(progress => {
				readline.clearLine(process.stdout)
				readline.cursorTo(process.stdout, 0)
				const percents = `${Math.round(progress * 100)}%`
				process.stdout.write(`Compiling ${percents}.`)
			})
		)
	}

	compiler.plugin('done', stats => {
		// errorDetails prevents duplication of errors
		// https://github.com/webpack/webpack/issues/3008#issuecomment-258636306
		const jsonStats = stats.toJson({ errorDetails: false })
		const hasErrors = stats.hasErrors()
		const hasWarnings = stats.hasWarnings()

		console.log()

		if (!hasErrors && !hasWarnings) {
			console.log(chalk.green('Compiled successfully!\n'))
			return
		}

		if (hasErrors) {
			console.log(chalk.red('Failed to compile.'))
			console.log()
			jsonStats.errors.forEach(message => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
			return
		}

		if (hasWarnings) {
			console.log(chalk.yellow('Compiled with warnings.'))
			console.log()
			jsonStats.warnings.forEach(message => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
		}
	})

	return compiler
}
