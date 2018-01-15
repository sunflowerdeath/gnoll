#!/usr/bin/env node
const commander = require('commander')

function run(command, ...args) {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const cmd = require(`../commands/${command}`)
	return cmd(...args)
}

commander.version('0.0.1')

commander
	.command('clean')
	.description('Clean build directory')
	.option('-c, --config [config]', 'Webpack config file')
	.action(cmd => run('clean', cmd.options))

commander
	.command('watch')
	.description('Create development build and rebuild on change')
	.option('-c, --config [config]', 'Webpack config file')
	.option('--caching', 'Optimizes build for caching static assets')
	.option('--server', 'Generates bundle for server-side rendering')
	.option('--no-progress', 'No progress')
	.action(cmd => run('watch', cmd))

commander
	.command('build')
	.description('Create an optimized production build')
	.option('-c, --config [config]', 'Webpack config file')
	.option('--caching', 'Optimizes build for caching static assets')
	.option('--module', 'Generates bundle for modern browsers')
	.option('--server', 'Generates bundle for server-side rendering')
	.action(cmd => run('build', cmd))

commander
	.command('start')
	.description('Start the development server')
	.option('-c, --config [config]', 'Webpack config file')
	.action(cmd => run('start', cmd))

commander
	.command('lib')
	.description('Build as library')
	.option('--watch', 'Compile source with babel and rebuild on change')
	.option('--source-maps', 'Embed source maps into compiled files')
	.action(cmd => run('lib', cmd))

commander
	.command('lint')
	.description('Check source code with ESLint')
	.action(cmd => {
		run('lint', cmd)
	})

commander
	.command('link')
	.description('Link gnoll executable to child packages of the lerna project')
	.action(cmd => {
		run('link', cmd)
	})

commander.parse(process.argv)

const COMMANDS = ['clean', 'watch', 'build', 'start', 'lib', 'lint', 'link']
const command = process.argv[2]
if (!command) {
	commander.outputHelp()
} else if (COMMANDS.indexOf(command) === -1) {
	console.log(`Error: unknown command "${command}"`)
}
