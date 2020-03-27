const gulp          = require('gulp');
const sass          = require('gulp-sass');
const typescript    = require('gulp-typescript');
const concat        = require('gulp-concat');
const minify        = require('gulp-minify-css');
const merge         = require('merge-stream');
const rename        = require('gulp-rename');

const copyNecessaryFiles = (cb) => {
    gulp.src('./node_modules/requirejs/require.js')
        .pipe(gulp.dest('./dist/assets/js/'));

    cb()
}

const copyHTMLFiles = (cb) => {
    gulp.src('./src/html/**/*.html')
        .pipe(gulp.dest('./dist/'));

    cb()
}

const generateJSFiles = (cb) => {
    gulp.src('src/**/*.ts')
        .pipe(typescript({
            // typescript: require('typescript'),
            // target: 'ES6',
            // module: 'system',
            // experimentalDecorators: false,
            // emitDecoratorMetadata: false,
            // outFile: 'script.js'
            module: 'amd',
            noImplicitAny: true,
            outFile: 'script.js'
        }))
        .pipe(gulp.dest('./dist/assets/js'))    
    cb()
}

const generateCSSFiles = (cb) => {
    let scssStream = gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .pipe(concat('style.scss'))

    merge(scssStream)
        .pipe(concat('styles.css'))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'))
    
    cb()
}

exports.default = (done) => {
    copyNecessaryFiles(() => {
        copyHTMLFiles(() => {
            generateJSFiles(()=>{
                generateCSSFiles(()=>{
                    done()
                })
            })
        })
    })
}