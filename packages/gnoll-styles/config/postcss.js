const presetEnv = require('postcss-preset-env')
const cssNext = require('postcss-cssnext')
const cssnano = require('cssnano')

const DEBUG = process.env.NODE_ENV !== 'production'

const plugins = [
	presetEnv({
		browsers: ['last 2 versions', '>1%', 'ie 11']
	})
]
if (!DEBUG) plugins.push(cssnano())

module.exports = {
	plugins
}
