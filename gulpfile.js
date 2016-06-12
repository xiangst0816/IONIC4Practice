var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var px2rem = require('gulp-px3rem');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var md5 = require('gulp-md5-plus');
var imagemin = require('gulp-imagemin');
var inlinesource = require('gulp-inline-source');
var cssBase64 = require('gulp-css-base64');
var base64 = require('gulp-base64');
// var obfuscate = require('gulp-obfuscate');
var htmlmin = require('gulp-htmlmin');

var path = {
    src: "app",
    dist: "www"
};

/**
 * 设置自动构建环境
 * DEV;PRO
 * */
var ENV = "DEV";


/**
 * ---清理dist--------------------------------------------------------------
 * */
gulp.task('clean:dist', function () {
    return gulp.src(path.dist, {read: false})
        .pipe(clean({force: true}));
});

/**
 * ---tpl模板转移--------------------------------------------------------------
 * */
gulp.task('move:tpl', function () {
    return gulp.src(path.src + '/page/**/*.html')
        .pipe(rename({dirname: ''}))
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.dist + '/tpl'));
});

/**
 * ---根路径文件--------------------------------------------------------------
 * (app,config,bridge,index)
 * */

gulp.task('move:basejs', function () {
    var stream = gulp.src([path.src + '/*.js']);
    if (ENV == "PRO") {
        return stream.pipe(uglify())

            .pipe(gulp.dest(path.dist));
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist));
    }
});

gulp.task('move:ico', function () {
    return gulp.src([path.src + '/vivoCity.ico', path.src + '/vivoCity.png']).pipe(gulp.dest(path.dist));
});

gulp.task('move:index', function () {
    var stream = gulp.src([path.src + '/index.html']).pipe(inlinesource()).pipe(base64({
        maxImageSize: 100 * 1024, // bytes
    }));
    if (ENV == "PRO") {
        return stream
        // .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(path.dist));
    } else {
        return stream.pipe(gulp.dest(path.dist));
    }
});


gulp.task('move:font', function () {
    return gulp.src([path.src + '/fonts/*.*']).pipe(gulp.dest(path.dist + '/fonts'));
});
/**
 * ---其余资源转移--------------------------------------------------------------
 * */
gulp.task('move:lib', function () {
    var stream = gulp.src(path.src + '/lib/*.min.js').pipe(concat('core.js'));
    if (ENV == "PRO") {
        return stream.pipe(uglify())
            .pipe(gulp.dest(path.dist + '/js'));
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/js'));
    }
});

/**
 * imgMin
 * */
var moveImg = {
    src: [
        path.src + '/img/**/*.*', path.src + '/*.png', path.src + '/*ico'
    ],
    dist: path.dist + '/img'
};
gulp.task('img:min', function () {
    if (ENV == "PRO") {
        return gulp.src(moveImg.src)
        // .pipe(imagemin())
            .pipe(gulp.dest(moveImg.dist));
    } else {
        return gulp.src(moveImg.src).pipe(gulp.dest(moveImg.dist));
    }

});


/**
 * ---2. 公共模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('commonJS', function () {
    var stream = gulp.src(path.src + '/common/**/*.js').pipe(concat('commonJS.js'));
    if (ENV == "PRO") {
        return stream.pipe(uglify())

            .pipe(gulp.dest(path.dist + '/js'));
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/js'));
    }
});
/**
 * ---3. 页面模块--------------------------------------------------------------
 * controller/filter/directives/utils/routers
 * */
gulp.task('pageJS', function () {
    var stream = gulp.src(path.src + '/page/**/*.js').pipe(concat('pageJS.js'));
    if (ENV == "PRO") {
        return stream.pipe(uglify())
            .pipe(gulp.dest(path.dist + '/js'));
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/js'));
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
    var stream = gulp.src(pageCssMap.main).pipe(sass().on('error', sass.logError)).pipe(base64())
        .pipe(autoprefixer({
            // browsers: ['IE 7'],
            browsers: ['Android >=2.1', 'last 2 versions'],
            cascade: false
        }));
    if (ENV == "PRO") {
        return stream.pipe(cleanCSS())

            .pipe(gulp.dest(path.dist + '/css'))
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/css'))
    }
});

// gulp.task('loadingCss', function () {
//     var stream = gulp.src("app/index/loading.scss").pipe(base64({maxImageSize: 100 * 1024}))
//         .pipe(autoprefixer({
//             // browsers: ['IE 7'],
//             browsers: ['Android >=2.1', 'last 2 versions'],
//             cascade: false
//         })).pipe(rename('loading_final.scss'));
//     return stream.pipe(gulp.dest('app/index/'));
// });

gulp.task('ionicCss', function () {
    var stream = gulp.src(ionicCssMap.main)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            // browsers: ['IE 7'],
            browsers: ['Android >=2.1', 'last 2 versions'],
            cascade: false
        }))
        .pipe(px2rem({
            baseDpr: 2,             // base device pixel ratio (default: 2)
            threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
            remVersion: true,       // whether to generate rem version (default: true)
            remUnit: 50,            // rem unit value (default: 75; 1rem==50px)
            remPrecision: 6         // rem precision (default: 6)
        }));
    if (ENV == "PRO") {
        return stream.pipe(cleanCSS())

            .pipe(gulp.dest(path.dist + '/css'))
    } else {
        return stream
            .pipe(md5(10, path.dist + '/index.html'))
        // .pipe(rename('ionic.css'))
            .pipe(gulp.dest(path.dist + '/css'))
    }
});

// cssBase64
// gulp.task('cssBase64', function () {
//     return gulp.src('www/css/style.css')
//         .pipe(cssBase64())
//         .pipe(gulp.dest('www/css'));
// });

/**
 * --default task--------------------------------------------------------------
 * */
gulp.task('default', gulpSequence(
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
        'move:ico',
        'move:font',
    ], [
        //移动准备必须的资源
        'move:lib',
        //css合并
        'pageCss',
        'ionicCss',
        //首次加载的js资源(service/routers/filters/utils/dierctives)
        'commonJS',
        //延迟加载部分(user,brandInfo,selfPark)
        'pageJS',
        'img:min'
        // 'resource:brandInfo',
        // 'resource:selfPark'
    ],
    //watch
    'watch'
));


/**
 * --watch task--------------------------------------------------------------
 * */
gulp.task('watch', function () {
    //css
    gulp.watch(pageCssMap.src, ['pageCss']);
    gulp.watch(ionicCssMap.src, ['ionicCss']);
    gulp.watch(moveImg.src, ['img:min']);

    gulp.watch([path.src + '/page/**/*.html'], ['move:tpl']);
    gulp.watch([path.src + '/*.*'], ['move:basejs']);
    gulp.watch([path.src + '/index.html'], ['move:index']);

    gulp.watch([path.src + '/common/**/*.js'], ['commonJS']);
    gulp.watch([path.src + '/page/**/*.js'], ['pageJS']);
    gulp.watch([path.src + '/index.html', path.src + '/index/*.*'], ['move:index']);


});
