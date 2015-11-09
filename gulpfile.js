'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var exec = require('child_process').exec
var debug = require('gulp-debug');


var paths = {
  src: 'src',
  dist: 'www'
}

function withPrefix(prefixString, _paths) {
  function prefix(pre, path) {
    if (typeof path !== 'string') return prefix(pre, '');
    if (path[0] === '!') return prefix('!' + pre, path.slice(1));
    if (path[0] === '/') return prefix(pre, path.slice(1));
    return pre + '/' + path;
  }
  var paths = typeof _paths === 'string' ? [_paths] : _paths;
  return paths.map((path) => prefix(prefixString, path))
}

function srcIn(paths, options) {
  return gulp.src(withPrefix('src', paths), options);
}

gulp.task('default', ['sass', 'js', 'inject-bower', 'images']);

gulp.task('sass', function() {
  return srcIn('scss/*.scss')
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(concat('index.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('inject-bower', function() {
  return srcIn('index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function() {
  return srcIn('**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('images', function() {
  exec('cp -r src/images www/images');
});