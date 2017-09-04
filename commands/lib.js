let gulp = require('gulp')
let babel = require('gulp-babel')
let chalk = require('chalk')

let babelConfig = require('../config/babel')

gulp.task('copy', function() {
	return gulp.src('src/**/!(*.js)')
		.pipe(gulp.dest('lib'))
})

gulp.task('babel', function() {
	return gulp.src('src/**/*.js')
		.pipe(babel(babelConfig))
		.pipe(gulp.dest('lib'))
})

gulp.start(['babel', 'copy'], function() {
	console.log(chalk.green('Compiled successfully.'))
})
