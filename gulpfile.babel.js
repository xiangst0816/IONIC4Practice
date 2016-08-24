// var gulp = require('gulp');
'use strict';
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import bs from "browser-sync";
import {path} from "./build/config";
import {clean, basic} from "./build/others";
import {loadingCss, index} from "./build/index";
import {template} from "./build/template";
import {image} from "./build/image";
import {coreJs, commonJs, pageJs} from "./build/script";
import {pageCss, commonCss} from "./build/style";
const $ = gulpLoadPlugins();
const browserSync = bs.create();
// const path = {
//     src: "app",
//     tmp: "tmp",
//     dest: "www"
// };

/**
 * 设置自动构建环境(默认)
 * DEV;源码
 * TES;文件名打码
 * PRO;文件打码压缩
 * */
// let ENV = "PRO";


/**
 * ---清理dist--------------------------------------------------------------
 * */
gulp.task('clean', clean);


/**
 * ---index处理--------------------------------------------------------------
 * */
gulp.task('index', ['loadingCss'], index);
gulp.task('loadingCss', loadingCss);


/**
 * ---template模板转移--------------------------------------------------------------
 * */
gulp.task('template', template);

/**
 * ---根路径文件--------------------------------------------------------------
 * (config,bridge)
 * */
gulp.task('basic', basic);


/**
 * imgMin
 * */
gulp.task('image', image);


/**
 * ---其余资源转移--------------------------------------------------------------
 * */
/*!
 * ionic.bundle.js is a concatenation of:
 * ionic.js, angular.js, angular-animate.js,
 * angular-sanitize.js, angular-ui-router.js,
 * and ionic-angular.js
 * app.bundle.js
 */
gulp.task('coreJs', coreJs);


/**
 * ---2. 公共模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('commonJs', commonJs);
/**
 * ---3. 页面模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('pageJs', pageJs);


/**
 * ---css文件--------------------------------------------------------------
 * */
//编译sass文件,将raw文件转到dist中
gulp.task('pageCss', pageCss);
gulp.task('commonCss', commonCss);

//浏览器同步
gulp.task('browserSync:server', function () {
    browserSync.init({
        notify: false,
        server: {
            //开启的目录
            baseDir: [path.tmp]
        },
        port: 3000,
        // files: [
        //     `${path.tmp}/**/*.*`
        // ]
    });
});


gulp.task("watch", function () {
    // gulp.watch(pageCssMap.src, ['pageCss']).on('change', browserSync.reload);
    // gulp.watch(ionicCssMap.src, ['commonCss']).on('change', browserSync.reload);
    // gulp.watch([path.src + '/common/**/*.js'], ['commonjs']).on('change', browserSync.reload);
    // gulp.watch([path.src + '/pages/**/*.js'], ['pagejs']).on('change', browserSync.reload);
    // gulp.watch([path.src + '/index.html'], ['index']).on('change', browserSync.reload);
    // gulp.watch([path.src + '/*.*'], ['basic']);
    // gulp.watch([path.src + '/pages/**/*.html'], ['template']).on('change', browserSync.reload);
    // // gulp.watch(moveImg.src, ['image']).on('change', browserSync.reload);

    //watch目录
    gulp.watch([
        `${path.src}/pages/**/*.scss`,
        `${path.src}/theme/app.pages.scss`,
        `${path.src}/theme/common/**/*.scss`,
    ], ['pageCss']);
    // gulp.watch([
    //     `${path.src}/theme/app.ionic.scss`
    // ], ['commonCss']);


    gulp.watch([
        `${path.src}/pages/**/*.js`,
    ], ['pageJs']).on('change', browserSync.reload);
    gulp.watch([
        `${path.src}/js/**/*.js`,
    ], ['commonJs']).on('change', browserSync.reload);

    // gulp.watch([
    //     `${path.src}/loading/*.js`,
    //     `${path.src}/loading/*.scss`,
    //     `${path.src}/index.html`,
    // ], ['index']);

    gulp.watch([
        `${path.src}/*.js`,
        `${path.src}/*.ico`,
        `${path.src}/*.png`,
        `${path.src}/lib/lazy/*.js`,
    ], ['basic']).on('change', browserSync.reload);

    gulp.watch([
        `${path.src}/pages/**/*.html`,
    ], ['template']).on('change', browserSync.reload);

    // gulp.watch([
    //     `${path.src}/img/**/*.*`,
    // ], ['image']);


});


/**
 * --default task--------------------------------------------------------------
 * */
gulp.task('default', $.sequence(
    //清理dist目录
    'clean',
    [
        //index准备
        'index',
        //移动tpl
        'template',
    ], [
        //移动根目录文件
        'basic',
        // 'move:font',
    ], [
        //移动准备必须的资源
        'coreJs',
        //css合并
        'pageCss',
        'commonCss',
        //首次加载的js资源(service/routers/filters/utils/dierctives)
        'commonJs',
        //延迟加载部分
        'pageJs',
        'image'
    ]
));

// /**
//  * 设置自动构建环境
//  * DEV;源码
//  * TES;文件名打码
//  * PRO;文件打码压缩,发布
//  * */
// gulp.task("SetDevEnv", function () {
//     SetEnv("DEV");
// });
// gulp.task("SetTesEnv", function () {
//     SetEnv("TES");
// });
// gulp.task("SetProEnv", function () {
//     SetEnv("PRO");
// });

gulp.task("DEVELOPMENT", $.sequence('default', 'browserSync:server', 'watch'));
gulp.task("TESTONLINE", $.sequence('default'));
gulp.task("PRODUCTION", $.sequence('default'));
