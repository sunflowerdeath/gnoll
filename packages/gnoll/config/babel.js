// If gnoll is installed with `npm link`, presets and plugins are inside local node_modules
const presetEnv = require('babel-preset-env')
const presetStage0 = require('babel-preset-stage-0')
const presetReact = require('babel-preset-react')
const decoratorsPlugin = require('babel-plugin-transform-decorators-legacy').default

const GNOLL_LIBRARY = Boolean(process.env.GNOLL_LIBRARY)

const COMMON_BROWSERS = ['last 2 versions', '>1%', 'ie 11']

// browsers supporting <script type="module">
const MODERN_BROWSERS = [
	'edge >= 15',
	'safari >= 10.1',
	'last 2 firefox versions',
	'last 2 chrome versions'
]

module.exports = module => ({
	presets: [
		[
			presetEnv,
			{
				targets: {
					browsers: module ? MODERN_BROWSERS : COMMON_BROWSERS
				},
				modules: GNOLL_LIBRARY ? 'commonjs' : false // TODO is it needed?
			}
		],
		presetStage0,
		presetReact
	],
	plugins: [decoratorsPlugin]
})
