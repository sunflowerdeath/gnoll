let getPrettierConfig = require('../utils/getPrettierConfig')
let prettierConfig = getPrettierConfig()

module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module'
	},
	env: {
		browser: true,
		es6: true
	},
	extends: [
		'airbnb',
		'plugin:react/recommended',
		'prettier',
		'prettier/react'
	],
	plugins: [
		'react',
		'prettier'
	],
	rules: {
		'prettier/prettier': ['error', prettierConfig]
	}
}
