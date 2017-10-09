const GNOLL_LIBRARY = Boolean(process.env.GNOLL_LIBRARY)

module.exports = {
	presets: [
		[
			'env',
			{
				targets: {
					browsers: ['last 2 versions', '>1%', 'ie 11']
				},
				modules: GNOLL_LIBRARY ? 'commonjs' : false
			}
		],
		'stage-0',
		'react'
	],
	plugins: ['transform-decorators-legacy']
}
