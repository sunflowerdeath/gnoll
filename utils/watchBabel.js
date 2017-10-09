const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

const mkdirp = require('mkdirp')
const minimatch = require('minimatch')
const babel = require('babel-core')
const chokidar = require('chokidar')

const DEFAULT_OPTIONS = {
	persistent: true,
	delete: true,
	babel: {},
	glob: '**/*.js'
}

class BabelWatcher extends EventEmitter {
	constructor(src, dest, options) {
		super()

		options = Object.assign({}, DEFAULT_OPTIONS, options)

		this.src = src
		this.dest = dest
		this.options = options
		this.ready = false

		mkdirp.sync(dest)

		const chokidarOptions = {
			cwd: src,
			persistent: options.persistent
		}

		this.watcher = chokidar
			.watch('**/*.*', chokidarOptions)
			.on('all', (e, p, s) => this.onWatchEvent(e, p, s))
			.on('error', e => this.onError(e))
			.on('ready', () => this.onReady())
	}

	close() {
		this.watcher.close()
		this.removeAllListeners()
	}

	onWatchEvent(event, filepath) {
		if (!filepath.length) filepath = '.'

		const srcPath = path.join(this.src, filepath)
		const destPath = path.join(this.dest, filepath)

		switch (event) {
			case 'add':
			case 'change':
				if (minimatch(filepath, this.options.glob)) {
					let result
					try {
						result = babel.transformFileSync(srcPath, this.options.babel)
					} catch (error) {
						this.emit('error', filepath, error)
						return
					}
					fs.writeFileSync(destPath, result.code)
					this.emit('success', filepath)
				} else {
					fs.copyFileSync(srcPath, destPath)
					this.emit('copy', filepath)
				}
				break
			case 'unlink':
				if (this.options.delete) return
				fs.removeSync(destPath)
				this.emit('delete', filepath)
				break
			case 'unlinkDir':
				if (!this.options.delete) return
				fs.removeSync(destPath)
				break
		}
	}

	onReady() {
		this.ready = true
		this.emit('ready')
	}

	onError(e) {
		this.emit('error', e)
	}
}

module.exports = function watchBabel(src, dest, opts) {
	return new BabelWatcher(src, dest, opts)
}
