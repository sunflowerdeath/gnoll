// If gnoll is installed with `npm link`, presets and plugins are inside local node_modules
const presetEnv = require('babel-preset-env')
const presetStage0 = require('babel-preset-stage-0')
const presetReact = require('babel-preset-react')
const decoratorsPlugin = require('babel-plugin-transform-decorators-legacy').default

const { GNOLL_LIBRARY, GNOLL_SERVER, GNOLL_SCRIPT_TYPE_MODULE } = process.env

const browsers = {
	common: ['last 2 versions', '>1%', 'ie 11'],
	// browsers supporting <script type="module">
	modern: [
		'edge >= 15',
		'safari >= 10.1',
		'last 2 firefox versions',
		'last 2 chrome versions'
	]
}

module.exports = {
	presets: [
		[
			presetEnv,
			{
				targets: GNOLL_SERVER
					? { node: '8.9.0' }
					: {
							browsers: GNOLL_SCRIPT_TYPE_MODULE
								? browsers.modern
								: browsers.common
						},
				modules: GNOLL_LIBRARY ? 'commonjs' : false
			}
		],
		presetStage0,
		presetReact
	],
	plugins: [decoratorsPlugin]
}
