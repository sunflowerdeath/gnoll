const cssNext = require('postcss-cssnext')
const cssnano = require('cssnano')
const globalImport = require('postcss-global-import')

const DEBUG = process.env.NODE_ENV !== 'production'

const plugins = [
	globalImport(),
	cssNext({
		browsers: ['last 2 versions', '>1%', 'ie 11'],
		// wrong warning
		warnForDuplicates: false
	})
]
if (!DEBUG) plugins.push(cssnano())

module.exports = {
	plugins
}
