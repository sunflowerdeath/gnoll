const prettierConfig = require('./prettier.config')

module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module'
	},
	env: {
		node: true,
		es6: true
	},
	extends: [
		'airbnb-base',
		'prettier',
	],
	plugins: [
		'prettier'
	],
	rules: {
		'prettier/prettier': ['error', prettierConfig]
	}
}
