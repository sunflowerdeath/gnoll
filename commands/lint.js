let CLIEngine = require('eslint').CLIEngine

let paths = require('../utils/paths')
let config = require('../config/eslint')

module.exports = function lint(options) {
	let cli = new CLIEngine({
		baseConfig: config
	})
	let report = cli.executeOnFiles([paths.src]) // TODO custom path
	let formatter = cli.getFormatter()
	console.log(formatter(report.results))
}
