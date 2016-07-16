// var gulp = require('gulp');
'use strict';
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import bs from "browser-sync";
const $ = gulpLoadPlugins();
const browserSync = bs.create();

const path = {
    src: "app",
    tmp: "tmp",
    dest: "www"
};

/**
 * 设置自动构建环境(默认)
 * DEV;源码
 * TES;文件名打码
 * PRO;文件打码压缩
 * */
var ENV = "DEV";


/**
 * ---清理dist--------------------------------------------------------------
 * */
gulp.task('clean:dist', function () {
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
});


gulp.task('move:index', ['loadingCss'], function () {
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
});
//loading的scss转化为css
gulp.task('loadingCss', function () {
    return gulp.src(`${path.src}/index/loading.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.base64({maxImageSize: 100 * 100 * 1024}))
        .pipe($.autoprefixer({
            browsers: ['Android >=2.1', 'last 2 versions'],
            cascade: false
        }))
        .pipe($.rename('loading.css')).pipe(gulp.dest(`${path.src}/index`));
});


/**
 * ---tpl模板转移--------------------------------------------------------------
 * */
gulp.task('move:tpl', function () {
    var stream = gulp.src(`${path.src}/page/**/*.html`).pipe($.rename({dirname: ''}));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${path.tmp}/tpl`));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(`${path.dest}/tpl`));
            break;
        case 'PRO':
            return stream.pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest(`${path.dest}/tpl`));
            break;
    }
});

/**
 * ---根路径文件--------------------------------------------------------------
 * (app,config,bridge,index)
 * */
gulp.task('move:basejs', function () {
    var stream = gulp.src(`${path.src}/*.js`);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(path.tmp));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe(gulp.dest(path.dest));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(path.dest));
            break;
    }
});


/**
 * ---其余资源转移--------------------------------------------------------------
 * */
/*!
 * ionic.bundle.js is a concatenation of:
 * ionic.js, angular.js, angular-animate.js,
 * angular-sanitize.js, angular-ui-router.js,
 * and ionic-angular.js
 */
gulp.task('move:lib', function () {
    var stream = gulp.src([
        path.src + '/lib/ionic.bundle.min.js',
        path.src + '/lib/ngStorage.min.js',
        path.src + '/lib/ocLazyLoad.min.js',
        path.src + '/lib/socket.min.js',
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
});


//打包ionic.bundle.min.js,用于对此模块精简
gulp.task('create:ionic.bundle', function () {
    var stream = gulp.src([
        path.src + '/lib/ionic.js',
        path.src + '/lib/angular.js',
        path.src + '/lib/angular-animate.js',
        path.src + '/lib/angular-sanitize.js',
        path.src + '/lib/angular-ui-router.js',
        path.src + '/lib/ionic-angular.js',
        path.src + '/lib/ngStorage.min.js',
        path.src + '/lib/ocLazyLoad.min.js',
        path.src + '/lib/socket.min.js',
    ]).pipe($.concat('ionic.bundle.min.js'));
    return stream.pipe($.uglify()).pipe(gulp.dest(`${path.src}/lib`));
});


/**
 * imgMin
 * */
var moveImg = {
    src: [
        `${path.src}/img/**/*.*`,
        `${path.src}/*.png`,
        `${path.src}/*.ico`,
    ],
    tmp: `${path.tmp}/img`,
    dist: `${path.dest}/img`
};
gulp.task('img:min', function () {
    var stream = gulp.src(moveImg.src);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(moveImg.tmp));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(moveImg.dist));
            break;
        case 'PRO':
            return stream.pipe($.imagemin()).pipe(gulp.dest(moveImg.dist));
            break;
    }
});


/**
 * ---2. 公共模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('commonJS', function () {
    var stream = gulp.src(`${path.src}/common/**/*.js`).pipe($.concat('commonJS.js'))
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
});
/**
 * ---3. 页面模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('pageJS', function () {
    var stream = gulp.src(`${path.src}/page/**/*.js`).pipe($.concat('pageJS.js'))
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
});


/**
 * ---css文件--------------------------------------------------------------
 * */
/**
 * 定义css资源的map
 * */
var pageCssMap = {
    src: [
        path.src + '/css/style.scss',
        path.src + '/css/pages/**/*.scss',
        path.src + '/css/common/**/*.scss'
    ],
    main: path.src + '/css/style.scss'
};
var ionicCssMap = {
    src: [
        path.src + '/css/ionic.scss',
        path.src + '/css/ionic/**/*.scss'
    ],
    main: path.src + '/css/ionic.scss'
};
//编译sass文件,将raw文件转到dist中
gulp.task('pageCss', function () {
    var stream = gulp.src(pageCssMap.main).pipe($.sass().on('error', $.sass.logError)).pipe($.base64())
        .pipe($.autoprefixer({
            // browsers: ['IE 7'],
            browsers: [
                'last 2 versions',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11'],
            cascade: false
        }));

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
});


gulp.task('ionicCss', function () {
    var stream = gulp.src(ionicCssMap.main).pipe($.sass().on('error', $.sass.logError))
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
        }));

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
});

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

    //watch目录
    gulp.watch(pageCssMap.src, ['pageCss']).on('change', browserSync.reload);
    gulp.watch(ionicCssMap.src, ['ionicCss']).on('change', browserSync.reload);
    gulp.watch(moveImg.src, ['img:min']).on('change', browserSync.reload);

    gulp.watch([path.src + '/page/**/*.html'], ['move:tpl']).on('change', browserSync.reload);
    gulp.watch([path.src + '/*.*'], ['move:basejs']);
    gulp.watch([path.src + '/index.html'], ['move:index']).on('change', browserSync.reload);

    gulp.watch([path.src + '/common/**/*.js'], ['commonJS']).on('change', browserSync.reload);
    gulp.watch([path.src + '/page/**/*.js'], ['pageJS']).on('change', browserSync.reload);
    gulp.watch([path.src + '/index.html', path.src + '/index/*.*'], ['move:index']).on('change', browserSync.reload);

});


/**
 * --default task--------------------------------------------------------------
 * */
gulp.task('default', $.sequence(
    //清理dist目录
    'clean:dist',
    [
        //index准备
        'move:index',
        //移动tpl
        'move:tpl',
    ], [
        //移动根目录文件
        'move:basejs',
        // 'move:font',
    ], [
        //移动准备必须的资源
        'move:lib',
        //css合并
        'pageCss',
        'ionicCss',
        //首次加载的js资源(service/routers/filters/utils/dierctives)
        'commonJS',
        //延迟加载部分
        'pageJS',
        'img:min'
    ]
));

/**
 * 设置自动构建环境
 * DEV;源码
 * TES;文件名打码
 * PRO;文件打码压缩,发布
 * */
gulp.task("SetDevEnv", function () {
    ENV = "DEV";
});
gulp.task("SetTesEnv", function () {
    ENV = "TES";
});
gulp.task("SetProEnv", function () {
    ENV = "PRO";
});

gulp.task("DEVELOPMENT", $.sequence('SetDevEnv', 'default', 'browserSync:server'));
gulp.task("TESTONLINE", $.sequence('SetTesEnv', 'default'));
gulp.task("PRODUCTION", $.sequence('SetProEnv', 'default'));

