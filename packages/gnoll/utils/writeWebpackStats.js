const fs = require('fs')
const path = require('path')

const paths = require('./paths')

module.exports = stats => {
	fs.writeFileSync(
		path.join(paths.root, 'stats.json'),
		JSON.stringify(stats.toJson())
	)
}
