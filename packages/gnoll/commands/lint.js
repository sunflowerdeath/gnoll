const chalk = require('chalk')
const emoji = require('node-emoji')
const { CLIEngine } = require('eslint')

const paths = require('../utils/paths')
const config = require('../config/eslint')

module.exports = function lint(/* options */) {
	console.log(emoji.get('memo'), ' Checking source with ESLint')

	const cli = new CLIEngine({
		baseConfig: config
	})
	const report = cli.executeOnFiles([paths.src])
	const formatter = cli.getFormatter()

	console.log(formatter(report.results))

	if (report.errorCount === 0) console.log(chalk.green('No errors found'))

	const exitCode = report.errorCount > 0 ? '1' : '0'
	process.exit(exitCode)
}
