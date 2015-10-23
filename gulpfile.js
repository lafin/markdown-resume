'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const base64 = require('gulp-base64');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const chalk = require('chalk');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const path = require('path');
const less = require('gulp-less');

const isProd = process.env.PRODUCTION === 'true' ? true : false;

function errorHandler(error) {
  return console.log(chalk.red(error.message));
}

gulp.task('js', () => {
  browserify({
    entries: path.join(__dirname, '/public/js/app.jsx'),
    extensions: ['.jsx', '.js'],
    debug: true,
    ignore: [],
  })
  .transform(babelify.configure({
    loose: 'all',
  }))
  .bundle().on('error', errorHandler)
  .pipe(source('script.js'))
  .pipe(gulpif(isProd, streamify(uglify())))
  .pipe(gulp.dest('build/js'));
});

const styles = (path, file) => {
  gulp.src(path)
    .pipe(concat(file))
    .pipe(less().on('error', errorHandler))
    .pipe(base64().on('error', errorHandler))
    .pipe(csso().on('error', errorHandler))
    .pipe(gulp.dest('build/css'));
};

gulp.task('less', () => {
  return styles(['public/less/**/*.less'], 'style.css');
});

gulp.task('vendor', () => {
  gulp.src(['vendor/js/*.js', 'node_modules/marked/marked.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
  return styles(['node_modules/elemental/less/**/*.less'], 'vendor.css');
});

gulp.task('watch', () => {
  gulp.watch(['public/js/**/*.{js,jsx}', '*.{js,jsx}'], ['js']);
  gulp.watch(['public/less/*.less', '*.less'], ['less']);
});

gulp.task('default', ['js', 'less', 'watch']);
gulp.task('prod', ['vendor', 'js', 'less']);
