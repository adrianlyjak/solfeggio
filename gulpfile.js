'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var child_process = require('child_process')
var debug = require('gulp-debug');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', ['assets', 'sass', 'js', 'index']);
gulp.task('default', ['build']);
gulp.task('watch', function() {
  function watch(source,task) {
    try {
      gulp.watch(srcFolder(source), task);
    } catch (e) {
      console.log("CAUGHT ERROR FOR " + task)
      console.log(e, e.printStackTrace());
      watch(source,task);
    }
  }
  watch('scss/**/*.scss', ['sass']);
  watch('**/*.js', ['js']);
  watch('index.html', ['index']);
  watch(['/**/*.html', 'img/**/*.*'], ['index', 'assets']);
});

var paths = {
  src: 'src',
  dist: 'www'
}

function exec(string, cb) {
  child_process.exec(string, function (error, stdout, stderr) {
    if (error) {
      gutil.log('ERROR: `' + string + '`: ' + stderr);
    } else {
      gutil.log('`' + string + '` ' + stdout);
      if (cb) cb()
    }
  });
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

function srcFolder(pathStrings) {
  return withPrefix(paths.src, pathStrings);
}

gulp.task('sass', () => {
  return gulp.src(srcFolder('scss/*.scss'))
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(concat('index.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('index', () => {
  return gulp.src(srcFolder('index.html'))
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', () => {
  // TODO I think browserify needs to happen after babelify for `import '...' to work`
  return browserify({entries: paths.src + '/index.js', extensions: ['.js'], debug: true})
      .transform(babelify)
      .bundle()
      .pipe(source('index.js'))
      .pipe(gulp.dest(paths.dist));
});

gulp.task('assets', () => {
  exec('mkdir -p www/bower_components && cp -r bower_components www/');
  exec('mkdir -p www/img && cp -r src/img www/');
  exec('mkdir -p www/templates && cp -r src/templates www/');
  
});