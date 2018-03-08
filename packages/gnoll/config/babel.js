// If gnoll is installed with `npm link`, presets and plugins are
// inside local node_modules
const presetEnv = require('@babel/preset-env')
const presetStage0 = require('@babel/preset-stage-0')
const presetReact = require('@babel/preset-react')

const LIBRARY = process.env.GNOLL_LIBRARY
const TARGET = process.env.GNOLL_TARGET

const browsers = ['last 2 versions', '>1%', 'ie 11']

module.exports = {
	presets: [
		[
			presetEnv,
			{
				targets: TARGET === 'node' ? { node: '8.9.0' } : { browsers },
				modules: LIBRARY ? 'commonjs' : false
			}
		],
		presetStage0,
		presetReact
	]
}
