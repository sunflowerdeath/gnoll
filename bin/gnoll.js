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
		run('clean', cmd)
		run('watch', cmd)
	})

commander
	.command('build')
	.description('Create an optimized production build')
	.option('-c, --config [config]', 'Webpack config file')
	.option('--caching', 'Optimizes build for caching static assets')
	.action((cmd) => {
		process.env.NODE_ENV = 'production'
		if (cmd.caching) process.env.GNOLL_CACHING = 1
		run('clean', cmd)
		run('build', cmd)
	})

commander
	.command('start')
	.description('Start the development server')
	.option('-c, --config [config]', 'Webpack config file')
	.action((cmd) => {
		process.env.GNOLL_DEVSERVER = 1
		run('start', cmd)
	})

commander
	.command('lib')
	.description('Build library')
	.action((cmd) => {
		// TODO clean
		run('lib', cmd)
	})

commander
	.command('lint')
	.description('Check source code with ESLint')
	.action((cmd) => {
		run('lint', cmd)
	})

commander.parse(process.argv)

const COMMANDS = ['clean', 'watch', 'build', 'start', 'lib', 'lint']
let command = process.argv[2]
if (!command) {
	commander.outputHelp()
} else if (COMMANDS.indexOf(command) === -1) {
	console.log(`Error: unknown command "${command}"`)
}
