module.exports = {
	presets: [
		['env', {
			targets: {
				browsers: ['last 2 versions', 'safari >= 7']
			}
		}],
		'stage-0',
		'react'
	],
	plugins: ['transform-decorators-legacy']
}
