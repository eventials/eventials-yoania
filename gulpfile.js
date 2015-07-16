var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('minify', function () {
  return gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
    return gulp.src('./src/*.js')
        .pipe(jshint({
            browser: true,
            devel: true,
            undef: true,
            unused: true,
            strict: true,
            curly: true,
            eqeqeq: true,
            eqnull: true,
            expr: true,
            latedef: true,
            onevar: true,
            noarg: true,
            node: true,
            trailing: true,
            globals: { 'klass': true }
        }))
        .pipe(jshint.reporter("default"));
});

gulp.task('default', ['lint', 'minify']);
