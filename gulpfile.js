// You are required
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


// Build it all
gulp.task('build', ['clean:dist', 'sass', 'useref', 'images', 'fonts'], function (){
  console.log('Building files');
})

// Define sequence of build tasks
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

// Sassy
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
	    stream: true
	}))
});

// I'm watching you
gulp.task('watch',['browserSync', 'sass'],function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
})

// Auto-update browser
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// Concatenate and minify
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

// Squish images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// Move fonts to /dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Clean up /dist
gulp.task('clean:dist', function() {
  return del.sync('dist');
})


// Learned this stuff here: https://css-tricks.com/gulp-for-beginners/