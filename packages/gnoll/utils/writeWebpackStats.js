const fs = require('fs')
const path = require('path')

const paths = require('./paths')

module.export = stats => {
	fs.writeFileSync(path.join(paths.root, 'stats.json'), JSON.stringify(stats.toJson()))
}
