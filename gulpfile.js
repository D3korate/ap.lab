// gulpfile.js
const { watch, series, src, dest } = require("gulp");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var autoprefixer = require('autoprefixer');
const imagemin = require("gulp-imagemin");

// Task for compiling our CSS files using PostCSS
function cssTask(cb) {
    return src("./src/*.css")
        .pipe(sourcemaps.init())
        .pipe(postcss([
            autoprefixer()
            ]
        ))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("./assets/css"))
        .pipe(browserSync.stream());
    cb();
}
function jsTask(cb){
    return src("./src/*.js")
        // .pipe(rigger())
        .pipe(uglify())
        .pipe(dest("./assets/js"))
        .pipe(browserSync.stream());
    cb();
}
// Task for minifying images
function imageminTask(cb) {
    return src("./assets/images/*")
        .pipe(imagemin())
        .pipe(dest("./assets/images"));
    cb();
}

// Serve from browserSync server
function browsersyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();
}

// Watch Files & Reload browser after tasks
function watchTask() {
    watch("./**/*.html", browsersyncReload);
    watch(["./src/*.js"], series(jsTask, browsersyncReload));
    watch(["./src/*.css"], series(cssTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(jsTask, cssTask, watchTask); //browsersyncServe
exports.css = cssTask;
exports.js = jsTask;
exports.images = imageminTask;