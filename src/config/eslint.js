module.exports = {
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
		'prettier/prettier': 'error'
	},
	parserOptions: {
		ecmaVersion: 8
	},
	env: {
		es6: true
	}
}
