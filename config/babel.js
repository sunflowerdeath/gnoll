module.exports = {
	presets: [
		['env', {
			targets: {
				browsers: ['last 2 versions, >1%']
			}
		}],
		'stage-0',
		'react'
	],
	plugins: ['transform-decorators-legacy']
}
