let CLIEngine = require("eslint").CLIEngine;

let cli = new CLIEngine()

let paths = require('../utils/paths')
// let eslintConfig = require('../config/eslint')

module.exports = function lint(options) {
	let report = cli.executeOnFiles([paths.src]) // TODO
	let formatter = cli.getFormatter()
	console.log(formatter(report.results))
}
