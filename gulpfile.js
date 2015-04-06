var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

var styles = 'css/main.scss';
var models = 'js/*.js';

gulp.task('styles', function () {
  return gulp.src(styles)
    .pipe(sass())
    .pipe(gulp.dest('built'));
});

gulp.task('jsx', function () {
  return gulp.src(models)
    .pipe(react())
    .pipe(gulp.dest('built'));
});

gulp.task('compressJS', function () {
  return gulp.src(models)
    .pipe(react())
    .pipe(uglify())
    .pipe(gulp.dest('built'));
})

gulp.task('compressCss', function () {
  return gulp.src(styles)
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest('built'))
})

gulp.task('watch', function () {
  gulp.watch(styles, ['styles']);
  gulp.watch(models, ['jsx']);
});

gulp.task('default', ['watch', 'styles', 'jsx']);

gulp.task('build', ['compressCss', 'compressJS']);
