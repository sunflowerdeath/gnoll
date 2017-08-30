#!/usr/bin/env node
let commander = require('commander')

// let COMMANDS = ['build', 'watch', 'start']

function run(command, options) {
	let cmd = require('../src/commands/' + command)
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
		process.env.NODE_WATCH = 'true'
		run('clean', cmd.options)
		run('watch', cmd.options)
	})

commander
	.command('build')
	.description('Create an optimized production build')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		process.env.NODE_ENV = 'production'
		run('clean', cmd.options)
		run('build', cmd.options)
	})

commander
	.command('start')
	.description('Start the development server')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		run('start', {config})
	})

commander
	.command('lint')
	.description('Eslint source code')
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
