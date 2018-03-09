const baseConfig = require('gnoll/config/babel')

module.exports = {
	...baseConfig,
	plugins: [
		'@babel/plugin-proposal-decorators',
		['@babel/plugin-proposal-class-properties', { loose: true }]
	]
}
