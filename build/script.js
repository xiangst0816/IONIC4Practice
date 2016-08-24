/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import {env, path} from "./config";
let ENV = env();
const $ = gulpLoadPlugins();

export const coreJs = function () {
    var stream = gulp.src([
        path.src + '/lib/core/ionic.bundle.min_1.1.1_.js',
        // path.src + '/lib/ionic.bundle_1.3.1_.js',
        path.src + '/lib/core/ngStorage.min.js',
        path.src + '/lib/core/ocLazyLoad.min.js',
        path.src + '/lib/core/socket.min.js',
    ]).pipe($.concat('core.js'));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/js`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe(gulp.dest(`${path.dest}/js`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(`${path.dest}/js`));
            break;
    }
};
//打包ionic.bundle.min.js,用于对此模块精简
// gulp.task('create:ionic.bundle', function () {
//     var stream = gulp.src([
//         path.src + '/lib/ionic.js',
//         path.src + '/lib/angular.js',
//         path.src + '/lib/angular-animate.js',
//         path.src + '/lib/angular-sanitize.js',
//         path.src + '/lib/angular-ui-router.js',
//         path.src + '/lib/ionic-angular.js',
//         path.src + '/lib/ngStorage.min.js',
//         path.src + '/lib/ocLazyLoad.min.js',
//         path.src + '/lib/socket.min.js',
//     ]).pipe($.concat('ionic.bundle.min.js'));
//     return stream.pipe($.uglify()).pipe(gulp.dest(`${path.src}/lib`));
// });



export const commonJs = function () {
    var stream = gulp.src([
        `${path.src}/js/app.js`,
        `${path.src}/js/routers.js`,
        `${path.src}/js/bridge.js`,
        `${path.src}/js/directives/*.js`,
        `${path.src}/js/filters/*.js`,
        `${path.src}/js/service/*.js`,
        `${path.src}/js/utils/*.js`,
    ]).pipe($.concat('common.js'))
        .pipe($.babel({presets: ['es2015']}));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/js`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe(gulp.dest(`${path.dest}/js`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(`${path.dest}/js`));
            break;
    }
}

export const pageJs = function () {
    var stream = gulp.src(`${path.src}/pages/**/*.js`).pipe($.concat('page.js'))
        // .pipe($.babel({presets: ['es2015']}));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/js`));
            break;
        case 'TES':
            return stream.pipe($.babel({presets: ['es2015']})).pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe(gulp.dest(`${path.dest}/js`));
            break;
        case 'PRO':
            return stream.pipe($.babel({presets: ['es2015']})).pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(`${path.dest}/js`));
            break;
    }
}

