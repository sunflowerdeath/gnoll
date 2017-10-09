const CLIEngine = require('eslint').CLIEngine

const paths = require('../utils/paths')
const config = require('../config/eslint')

module.exports = function lint(/* options */) {
	const cli = new CLIEngine({
		baseConfig: config
	})
	const report = cli.executeOnFiles([paths.src]) // TODO custom path
	const formatter = cli.getFormatter()
	console.log(formatter(report.results))
}
