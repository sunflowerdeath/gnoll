const cosmiconfig = require('cosmiconfig')

const paths = require('./paths')

module.exports = () => {
	const configLoader = cosmiconfig('babel', {
		packageProp: 'babel',
		rc: '.babelrc',
		rcStrintJson: true,
		js: 'babel.config.js',
		sync: true,
		root: paths.root
	})
	const result = configLoader.load(paths.root)
	if (result) return result.config
	// eslint-disable-next-line global-require
	return require('../config/babel')
}
