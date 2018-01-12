const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const glob = require('glob')
const flatten = require('lodash/flatten')
const mkdirp = require('mkdirp')

module.exports = () => {
	const configPath = path.join(process.env.PWD, 'lerna.json')

	if (!fs.existsSync(configPath)) {
		console.log('Error: file "lerna.json" not found')
		console.log('Command should be run from the lerna project root.')
		process.exit(-1)
	}

	const config = JSON.parse(fs.readFileSync(configPath))
	const globs = config.packages.map(globStr => globStr + '/')
	const packages = flatten(globs.map(globStr => glob.sync(globStr)))

	const gnoll = path.join(process.env.PWD, 'node_modules', '.bin', 'gnoll')
	packages.forEach(package => {
		const bin = path.join(package, 'node_modules', '.bin')
		const link = path.join(bin, 'gnoll')
		if (fs.existsSync(link)) return
		mkdirp.sync(bin)
		fs.symlinkSync(gnoll, link)
	})
}
