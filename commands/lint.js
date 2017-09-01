let CLIEngine = require('eslint').CLIEngine

let paths = require('../utils/paths')

let cli = new CLIEngine()

module.exports = function lint(options) {
	let report = cli.executeOnFiles([paths.src]) // TODO
	let formatter = cli.getFormatter()
	console.log(formatter(report.results))
}
