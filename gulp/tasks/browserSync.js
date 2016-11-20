var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../../config/gulp').browserSync;

gulp.task('browserSync', ['build'], function() {
  browserSync.init(null, config);
});
