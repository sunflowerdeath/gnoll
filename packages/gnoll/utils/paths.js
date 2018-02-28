const path = require('path')

const ROOT_PATH = process.env.PWD

module.exports = {
	root: ROOT_PATH,
	cache: path.join(ROOT_PATH, 'node_modules', '.cache')
}
