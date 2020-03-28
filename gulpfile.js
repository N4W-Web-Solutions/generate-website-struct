const gulp                      = require('gulp')
const sass                      = require('gulp-sass')
const typescript                = require('gulp-typescript')
const concat                    = require('gulp-concat')
const minifycss                 = require('gulp-minify-css')
const minifyjs                  = require('gulp-minify')
const merge                     = require('merge-stream')
const rename                    = require('gulp-rename')
const browserSync               = require('browser-sync').create()


function copyNecessaryFiles(cb) {
    gulp.src('./node_modules/requirejs/require.js')
        .pipe(minifyjs({
            ext: '.min.js',
            noSource: true
        }))
        .pipe(gulp.dest('./dist/assets/js/'));

    cb()
}

function copyHTMLFiles(cb) {
    gulp.src('./src/html/**/*.html')
        .pipe(gulp.dest('./dist/'));

    cb()
}

function generateJSFiles(cb) {
    gulp.src('src/**/*.ts')
        .pipe(typescript({
            module: 'amd',
            noImplicitAny: true,
            outFile: 'script.js'
        }))
        .pipe(minifyjs({
            ext: '.min.js',
            noSource: true
        }))
        .pipe(gulp.dest('./dist/assets/js'))

    cb()
}

function generateCSSFiles(cb) {
    let scssStream = gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .pipe(concat('style.scss'))

    merge(scssStream)
        .pipe(concat('styles.css'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'))

    cb()
}

function openBrowser(cb) {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
    })

    cb()
}

function watch() {
    gulp.watch('./src/sass/**/*.scss', generateCSSFiles)
    gulp.watch('./src/classes/**/*.ts', generateJSFiles)
    gulp.watch('./src/html/**/*.html', copyHTMLFiles)
    gulp.watch('./dist/**/*.css').on('change', browserSync.reload)
    gulp.watch('./dist/**/*.js').on('change', browserSync.reload)
    gulp.watch('./dist/**/*.html').on('change', browserSync.reload)
}

function _default() {
    copyNecessaryFiles(()=>{
        copyHTMLFiles(()=>{
            generateJSFiles(()=>{
                generateCSSFiles(()=>{
                    openBrowser(()=>{
                        watch()          
                    })
                })
            })
        })
    })
}

exports.default                 = _default
exports.copyNecessaryFiles      = copyNecessaryFiles
exports.copyHTMLFiles           = copyHTMLFiles
exports.generateJSFiles         = generateJSFiles
exports.generateCSSFiles        = generateCSSFiles
exports.openBrowser             = openBrowser
exports.watch                   = watch