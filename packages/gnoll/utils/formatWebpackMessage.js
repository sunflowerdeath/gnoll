const chalk = require('chalk')

module.exports = messageObj => {
	let { moduleName, loc, message } = messageObj
	
	let location
	if (moduleName) {
	    location = chalk.magenta(moduleName + (loc ? ` at ${loc}` : ''))
	}

	// Cleans up verbose "module not found" messages for files and packages
	if (message.indexOf('Module not found: ') === 0) {
		message = message
			.replace("Cannot resolve 'file' or 'directory' ", '')
			.replace('Cannot resolve module ', '')
			.replace('Error: ', '')
	}

	// Cleans up syntax error messages
	if (message.indexOf('Module build failed: ') === 0) {
		message = message.replace('Module build failed: SyntaxError:', 'Syntax error:')
	}

	return [location, message].filter(item => item !== undefined).join('\n')
}
