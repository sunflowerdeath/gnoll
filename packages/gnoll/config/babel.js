// If gnoll is installed with `npm link`, presets and plugins are
// inside local node_modules, so need to use require() instead of string names
const presetEnv = require('@babel/preset-env').default
const presetReact = require('@babel/preset-react').default

const getTargets = require('../utils/getTargets')

const LIBRARY = process.env.GNOLL_LIBRARY

module.exports = {
	presets: [
		[
			presetEnv,
			{
				targets: getTargets(),
				modules: LIBRARY ? 'commonjs' : false
			}
		],
		presetReact
	]
}
