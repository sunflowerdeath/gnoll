const gulp = require('gulp')
const babel = require('gulp-babel')
const chalk = require('chalk')

const babelConfig = require('../config/babel')
const paths = require('../utils/paths')
const watchBabel = require('../utils/watchBabel')

const watch = () => {
	const watcher = watchBabel(paths.src, paths.lib, { babel: babelConfig })

	let ready = false
	let errors = false

	console.log('Starting watch...\n')

	watcher.on('ready', () => {
		ready = true
		if (errors) {
			console.log(chalk.red('Compiled with errors.\n'))
		} else {
			console.log(chalk.green('Compiled successfully.\n'))
		}
	})
	watcher.on('copy', filepath => {
		if (ready) console.log(`File '${filepath}' copied to dest dir`)
	})
	watcher.on('success', filepath => {
		if (ready) console.log(`File '${filepath}' compiled successfully`)
	})
	watcher.on('error', (filepath, error) => {
		if (!ready) errors = true

		console.log()
		console.log(error.toString())
		if (error.codeFrame) console.log(`\n${error.codeFrame}\n`)
	})
}

const build = () => {
	gulp.task('copy', () => (
		gulp
			.src('src/**/!(*.js)')
			.pipe(gulp.dest('lib'))
	))

	gulp.task('babel', () => (
		gulp
			.src('src/**/*.js')
			.pipe(babel(babelConfig))
			.pipe(gulp.dest('lib'))
	))

	gulp.start(['babel', 'copy'], () => {
		console.log(chalk.green('Compiled successfully.'))
	})
}

module.exports = function lib(cmd) {
	if (cmd.watch) {
		watch()
	} else {
		build()
	}
}
