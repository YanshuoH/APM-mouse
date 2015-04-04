var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');

var styles = 'css/*.scss';
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

gulp.task('watch', function () {
  gulp.watch(styles, ['styles']);
  gulp.watch(models, ['jsx']);
});

gulp.task('default', ['watch', 'styles', 'jsx']);

gulp.task('build', ['styles', 'jsx']);
