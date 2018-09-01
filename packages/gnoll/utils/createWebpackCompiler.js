const webpack = require('webpack')
const readline = require('readline')
const chalk = require('chalk')
const defaults = require('lodash/defaults')

const formatWebpackMessage = require('./formatWebpackMessage')
const writeWebpackStats = require('./writeWebpackStats')

const { CI, PROFILE } = process.env

const DEFAULT_OPTIONS = {
	progress: true
}

module.exports = function createCompiler(config, options) {
	options = defaults(options, DEFAULT_OPTIONS)

	const compiler = webpack(config)

	if (options.progress && !CI) {
		new webpack.ProgressPlugin((progress, message) => {
			readline.clearLine(process.stdout)
			readline.cursorTo(process.stdout, 0)
			const percents = `${Math.round(progress * 100)}%`
			process.stdout.write(`Compiling ${percents}`)
		}).apply(compiler)
	}

	let start
	if (PROFILE) {
		compiler.hooks.run.tap('gnoll', () => {
			start = new Date()
		})
		compiler.hooks.watchRun.tap('gnoll', () => {
			start = new Date()
		})
	}

	const logTime = () => {
		if (PROFILE) {
			const time = new Date() - start
			console.log(chalk.cyan('Time:'), `${time}ms`)
		}
	}

	compiler.hooks.done.tap('gnoll', stats => {
		// errorDetails prevents duplication of errors
		// https://github.com/webpack/webpack/issues/3008#issuecomment-258636306
		const jsonStats = stats.toJson({ errorDetails: false })
		const hasErrors = stats.hasErrors()
		const hasWarnings = stats.hasWarnings()

		if (PROFILE) writeWebpackStats(stats)

		console.log('\n')

		if (!hasErrors && !hasWarnings) {
			console.log(chalk.green('Compiled successfully!'))
			logTime()
			console.log()
			return
		}

		if (hasErrors) {
			console.log(chalk.red('Failed to compile.'))
			logTime()
			console.log()
			jsonStats.errors.forEach(message => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
			return
		}

		if (hasWarnings) {
			console.log(chalk.yellow('Compiled with warnings.'))
			logTime()
			console.log()
			jsonStats.warnings.forEach(message => {
				console.log(formatWebpackMessage(message))
				console.log()
			})
		}
	})

	return compiler
}
