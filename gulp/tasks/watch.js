
/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 - gulp/tasks/browserSync.js watches and reloads compiled files
 */

var gulp   = require('gulp');
var config = require('../../config/gulp');

gulp.task('watch', function() {
    global.isWatching = true;

    gulp.watch(config.sass.src, ['sass']);
});
