// including plugins
var gulp = require('gulp');
var minifyCss = require("gulp-minify-css");
var concat = require("gulp-concat");
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;



// task
gulp.task('minify-css', function () {
    gulp.src('./public/css/*.css') // path to your css files
    .pipe(minifyCss())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('minify-js', function () {
   return gulp.src('./js/src/*.js')
      .pipe(jshint())
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build'));
});

gulp.task('build', ['minify-css', 'minify-js']);

gulp.task('watch', function () {
    gulp.watch('./js/src/*.js', ['minify-js']);
    gulp.watch('./public/css/*.css', ['minify-css']);

});


gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({script: './server.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});

/* Initializes the watch, which will recompile js and css files
*/
gulp.task('browser-sync', ['nodemon', 'watch'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000", // port of node server
        port:3001,
        notify:true,
        reloadDelay: 2000

    });
});

/*
 * If it notices a change in the build folder, which means that our
 * watch above has detected a change and recompiled the css or java file,
 * then we reload the browser
 */
gulp.task('default', ['browser-sync'], function() {
    gulp.watch(["./build/*"], reload);

});
