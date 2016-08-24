/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import {env, path} from "./config";
let ENV = env();
const $ = gulpLoadPlugins();



/**
 * loadingCss
 * */
export const loadingCss = function () {
    return gulp.src(`${path.src}/loading/loading.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.base64({maxImageSize: 100 * 100 * 1024}))
        .pipe($.autoprefixer({
            browsers: [
                'last 2 versions',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11'],
            cascade: false
        }))
        .pipe($.rename('loading.css')).pipe(gulp.dest(`${path.src}/loading`));
};

/**
 * index处理
 * */
export const index = function () {
    var stream = gulp.src([`${path.src}/index.html`]).pipe($.inlineSource()).pipe($.base64({
        maxImageSize: 100 * 1024, // bytes
    }));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(path.tmp));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(path.dest));
            break;
        case 'PRO':
            return stream.pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest(path.dest));
            break;
    }
};









