let gulp = require('gulp');
let postcss = require('gulp-postcss');
let	autoprefixer = require('gulp-autoprefixer');
let	nesting = require('postcss-nesting');
let cssnano = require('cssnano');
let sourcemaps = require('gulp-sourcemaps');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let	nested = require('postcss-nested');


// Watcher
gulp.task('watch', function (done) {
	//Waching on PCSS file 
	gulp.watch('./src/*.pcss', gulp.parallel('pcss'));

    done();
});

// Compile MAIN POSTCSS
gulp.task('pcss', function (done) {
    return gulp.src('./src/*.pcss')
    .pipe(sourcemaps.init())
    .pipe(postcss([nesting, nested, autoprefixer, cssnano]))
    .pipe(concat('main.css'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("./src"))
    done();
});

// Main command to run Gulp
gulp.task('start', gulp.parallel('pcss', 'watch'), function(done) {
    done();
});