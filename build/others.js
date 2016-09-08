/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import {env, path} from "./config";
let ENV = env();
const $ = gulpLoadPlugins();
var merge = require('merge-stream');





// import {_ENV} from "../abc.js";
// console.log('other')
// console.log(_ENV())

/**
 * 清理dist
 * */
export const clean = function () {
    switch (ENV) {
        case 'DEV':
            return gulp.src(path.tmp, {read: false})
                .pipe($.clean({force: true}));
            break;
        case 'TES':
            return gulp.src(path.dest, {read: false})
                .pipe($.clean({force: true}));
            break;
        case 'PRO':
            return gulp.src(path.dest, {read: false})
                .pipe($.clean({force: true}));
            break;
    }
};


/**
 * 附属文件转移(不需要处理的部分,可以压缩,但不用改名字)
 * */
export const basic = function () {
    // js
    var stream_js = gulp.src(`${path.src}/*.js`);
    switch (ENV) {
        case 'DEV':
            stream_js.pipe(gulp.dest(path.tmp));
            break;
        case 'TES':
            stream_js.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe(gulp.dest(path.dest));
            break;
        case 'PRO':
            stream_js.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(path.dest));
            break;
    }

    // icon
    var stream_icon = gulp.src([`${path.src}/*.png`, `${path.src}/*.ico`]);
    switch (ENV) {
        case 'DEV':
            stream_icon.pipe(gulp.dest(`${path.tmp}`));
            break;
        case 'TES':
            stream_icon.pipe(gulp.dest(`${path.dest}`));
            break;
        case 'PRO':
            stream_icon.pipe(gulp.dest(`${path.dest}`));
            break;
    }


    //lazy lib
    var stream_lazyjs = gulp.src(`${path.src}/lib/lazy/*.js`);
    switch (ENV) {
        case 'DEV':
            stream_lazyjs.pipe(gulp.dest(`${path.tmp}/js`));
            break;
        case 'TES':
            stream_lazyjs.pipe(gulp.dest(`${path.dest}/js`));
            break;
        case 'PRO':
            stream_lazyjs.pipe($.uglify()).pipe(gulp.dest(`${path.dest}/js`));
            break;
    }


    return merge(stream_js, stream_icon, stream_lazyjs);

};


