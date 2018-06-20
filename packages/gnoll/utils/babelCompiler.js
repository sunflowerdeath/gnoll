const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

const mkdirp = require('mkdirp')
const minimatch = require('minimatch')
const babel = require('@babel/core')
const chokidar = require('chokidar')

const DEFAULT_OPTIONS = {
	persistent: true,
	delete: true,
	babel: {},
	glob: '**/*.js'
}

const SOURCE_MAP_PREFIX = '//# sourceMappingURL=data:application/json;base64,'

const btoa = str => new Buffer(str, 'binary').toString('base64')

class BabelCompiler extends EventEmitter {
	constructor(src, dest, options) {
		super()

		const optionsWithDefault = Object.assign({}, DEFAULT_OPTIONS, options)

		this.src = src
		this.dest = dest
		this.options = optionsWithDefault
		this.ready = false

		mkdirp.sync(dest)

		const chokidarOptions = {
			cwd: src,
			persistent: optionsWithDefault.persistent
		}

		this.watcher = chokidar
			.watch('**/*.*', chokidarOptions)
			.on('all', (event, filepath) => this.onWatchEvent(event, filepath))
			.on('error', e => this.onError(e))
			.on('ready', () => this.onReady())
	}

	onWatchEvent(event, filepath = '.') {
		const srcPath = path.join(this.src, filepath)
		const destPath = path.join(this.dest, filepath)

		if (event === 'add' || event === 'change') {
			mkdirp.sync(path.dirname(destPath))
			if (minimatch(filepath, this.options.glob)) {
				this.compileJsFile(filepath, srcPath, destPath)
			} else {
				this.copyFile(filepath, srcPath, destPath)
			}
		}

		if (event === 'unlink') {
			if (this.options.delete) return
			fs.removeSync(destPath)
			this.emit('delete', filepath)
		}

		if (event === 'unlinkDir') {
			if (!this.options.delete) return
			fs.removeSync(destPath)
		}
	}

	onReady() {
		this.emit('ready')
	}

	onError(e) {
		this.emit('error', e)
	}

	compileJsFile(filepath, srcPath, destPath) {
		const babelOptions = this.options.sourceMaps
			? {
					...this.options.babel,
					sourceMaps: true,
					sourceFileName: srcPath
				}
			: this.options.babel

		let result
		try {
			result = babel.transformFileSync(srcPath, babelOptions)
		} catch (error) {
			this.emit('error', filepath, error)
			return
		}

		let content
		if (this.options.sourceMaps) {
			const sourceMap = btoa(JSON.stringify(result.map))
			content = `${result.code}\n${SOURCE_MAP_PREFIX}${sourceMap}`
		} else {
			content = result.code
		}

		fs.writeFileSync(destPath, content)
		this.emit('success', filepath)
	}

	copyFile(filepath, srcPath, destPath) {
		fs.copyFileSync(srcPath, destPath)
		this.emit('copy', filepath)
	}

	close() {
		this.watcher.close()
		this.removeAllListeners()
	}
}

module.exports = BabelCompiler
