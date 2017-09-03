#!/usr/bin/env node
let commander = require('commander')

function run(command, options) {
	let cmd = require('../commands/' + command)
	cmd(options)
}

commander
	.version('0.0.1')

commander
	.command('clean')
	.description('Clean build directory')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		run('clean', cmd.options)
	})

commander
	.command('watch')
	.description('Create development build and rebuild on change')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		process.env.GNOLL_WATCH = 1
		run('clean', cmd.options)
		run('watch', cmd.options)
	})

commander
	.command('build')
	.description('Create an optimized production build')
	.option('-c, --config [config]', 'Webpack config file')
	.option('--lib', 'Build as library')
	.option('--caching', 'Optimizes build for caching static assets')
	.action((cmd) => {
		process.env.NODE_ENV = 'production'
		if (cmd.lib) process.env.GNOLL_LIBRARY = 1
		if (cmd.caching) process.env.GNOLL_CACHING = 1
		run('clean', cmd.options)
		run('build', cmd.options)
	})

commander
	.command('start')
	.description('Start the development server')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		process.env.GNOLL_DEVSERVER = 1
		run('start', {config: cmd.config})
	})

commander
	.command('lint')
	.description('Check source code with ESLint')
	.action((cmd) => {
		run('lint', cmd.options)
	})

commander.parse(process.argv)

// TODO: WHY
/*
let command = process.argv[2]
if (!command) {
	commander.outputHelp()
} else if (COMMANDS.indexOf(command) === -1) {
	console.log()
	console.log("Error: unknown command '" + command + "'")
	console.log()
}
*/
