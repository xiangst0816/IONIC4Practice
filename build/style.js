/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */

import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import {env, path} from "./config";
let ENV = env();
const $ = gulpLoadPlugins();


//编译sass文件,将raw文件转到dist中
export const pageCss = function () {
    var stream = gulp.src(`${path.src}/theme/app.pages.scss`).pipe($.sass().on('error', $.sass.logError))
        .pipe($.base64())
        .pipe($.autoprefixer({
            browsers: [
                'last 2 versions',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11'],
            cascade: false
        }))
        .pipe($.rename('page.css'));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/css`))
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, path.dest + '/index.html')).pipe(gulp.dest(`${path.dest}/css`))
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, path.dest + '/index.html')).pipe($.cleanCss()).pipe(gulp.dest(`${path.dest}/css`));
            break;
    }
};



export const commonCss = function () {
    var stream = gulp.src(`${path.src}/theme/app.ionic.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            // browsers: ['IE 7'],
            browsers: [
                'last 2 versions',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11'],
            cascade: false
        }))
        .pipe($.px3rem({
            baseDpr: 2,             // base device pixel ratio (default: 2)
            threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
            remVersion: true,       // whether to generate rem version (default: true)
            remUnit: 50,            // rem unit value (default: 75; 1rem==50px)
            remPrecision: 6         // rem precision (default: 6)
        })).pipe($.rename('common.css'));

    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/css`))
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, path.dest + '/index.html')).pipe(gulp.dest(`${path.dest}/css`))
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, path.dest + '/index.html')).pipe($.cleanCss()).pipe(gulp.dest(`${path.dest}/css`));
            break;
    }
}