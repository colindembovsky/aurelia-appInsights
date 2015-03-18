var gulp = require('gulp');
var typescript = require('gulp-typescript');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var typeScriptOptions = require('../typeScript-options.js');
var assign = Object.assign || require('object.assign');
var replace = require('gulp-replace');

gulp.task('build-system', function () {
    return gulp.src([paths.source, paths.typings], { base: paths.root })
        .pipe(plumber())
        .pipe(changed(paths.source, { extension: '.ts' }))
        .pipe(sourcemaps.init())
        .pipe(typescript(typeScriptOptions))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "/src" }))
        .pipe(gulp.dest(paths.output));
});

gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html'],
    callback
  );
});
