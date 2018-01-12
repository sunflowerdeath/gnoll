const path = require('path')

const ROOT_PATH = process.env.PWD

module.exports = {
	root: ROOT_PATH,
	src: path.join(ROOT_PATH, 'src'),
	dest: path.join(ROOT_PATH, 'dest'),
	lib: path.join(ROOT_PATH, 'lib'),
	cache: path.join(ROOT_PATH, 'node_modules', '.cache')
}
