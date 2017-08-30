let fs = require('fs')
let path = require('path')

const ROOT_PATH = process.env.PWD
// path.resolve(__dirname, '../../../..')

module.exports = {
	root: ROOT_PATH,
	src: path.join(ROOT_PATH, 'src'),
	dest: path.join(ROOT_PATH, 'dest')
}
