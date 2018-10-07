#!/usr/bin/env node
const commander = require('commander')

function run(command, ...args) {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const cmd = require(`../commands/${command}`)
	return cmd(...args)
}

const options = {
	entry: [
		'-e, --entry <entry>',
		'Webpack entry file (default: src/index.js)'
	],
	output: ['-o, --out <output>', 'Output path (default: build)'],
	html: ['--html <file>', 'Html page (default: src/index.html)'],
	noHtml: ['--no-html', 'Disable building html'],
	config: ['-c, --config <config>', 'Webpack config file'],
	env: [
		'--env <value>',
		'Set value of the NODE_ENV variable',
		/^(development|production)$/
	],
	target: [
		'--target <value>',
		'Prepare bundle for running in server or browser',
		/^(node|web|universal)$/
	],
	assetsCaching: [
		'--assets-caching',
		'Optimize build for caching static assets'
	]
}

commander.version(require('../package.json').version)

commander
	.command('build')
	.description('Create an optimized production build')
	.option(...options.entry)
	.option(...options.output)
	.option(...options.html)
	.option(...options.noHtml)
	.option(...options.config)
	.option(...options.env, 'production')
	.option(...options.target, 'web')
	.option(...options.assetsCaching)
	.option('--ssr', 'Server side rendering')
	.action(cmd => run('build', cmd))

commander
	.command('start')
	.description('Start the development server')
	.option(...options.entry)
	.option(...options.output)
	.option(...options.html)
	.option(...options.noHtml)
	.option(...options.config)
	.action(cmd => run('start', cmd))

commander
	.command('watch')
	.description('Create development build and rebuild on change')
	.option(...options.entry)
	.option(...options.output)
	.option(...options.html)
	.option(...options.noHtml)
	.option(...options.config)
	.option(...options.env, 'production')
	.option(...options.target, 'web')
	.option(...options.assetsCaching)
	.action(cmd => run('watch', cmd))

commander
	.command('lib')
	.description('Build as library')
	.option(...options.env, 'production')
	.option(...options.target, 'web')
	.option(...options.entry)
	.option('--watch', 'Compile source with babel and rebuild on change')
	.option('--source-maps', 'Embed source maps into compiled files')
	.action(cmd => run('lib', cmd))

commander
	.command('link')
	.description('Link gnoll executable to child packages of the lerna project')
	.action(cmd => run('link', cmd))

commander.parse(process.argv)

const COMMANDS = ['watch', 'build', 'start', 'lib', 'link']
const command = process.argv[2]
if (!command) {
	commander.outputHelp()
} else if (COMMANDS.indexOf(command) === -1) {
	console.log(`Error: unknown command "${command}"`)
}
