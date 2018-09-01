const browserslist = require('browserslist')

const PATHS = require('./paths')

const TARGET = process.env.GNOLL_TARGET

const web = ['last 2 versions', '>1%', 'ie 11', 'not dead']
const node = ['node 8']

const getTargets = () => {
	// Default value is used only if the user has not redefined the value
	// by any of the methods
	browserslist.defaults =
		TARGET === 'web' ? web : TARGET === 'node' ? node : [...web, ...node]
	return browserslist(null, { path: PATHS.root, env: process.env })
}

module.exports = getTargets
