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
// var obfuscate = require('gulp-obfuscate');


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
var tplMap = {
    src:[
        path.src + '/tpl/**/*.html',
        path.src + '/index.html'
    ],
    tpl: [
        path.src + '/tpl/**/*.html'
    ],
    index: path.src + '/index.html',
    dist: path.dist + '/tpl'
};
gulp.task('move:tpl', function () {
    var tpl =  gulp.src(tplMap.tpl)
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(tplMap.dist));

    var base = gulp.src(tplMap.index)
        .pipe(gulp.dest(path.dist));
    return merge(tpl, base);
});
/**
 * ---根路径js文件--------------------------------------------------------------
 * (app,config,bridge)
 * */
var baseJs = {
    src:[
        path.src + '/app.js',
        path.src + '/config.js',
        path.src + '/bridge.js'
    ]
};
gulp.task('move:baseJs', function () {
    var stream = gulp.src(baseJs.src);
    if (ENV == "PRO") {
        return stream.pipe(uglify())
            // .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist));
    } else {
        return stream.pipe(gulp.dest(path.dist));
    }
});

/**
 * ---其余资源转移--------------------------------------------------------------
 * */
gulp.task('move:resource', function () {
    var moveLib = {
        src: [
            path.src + '/lib/ionic/js/*.min.js',
            path.src + '/lib/ngStorage.min.js',
            path.src + '/lib/ocLazyLoad.min.js',
            path.src + '/lib/socket.min.js',
            path.src + '/lib/socket.io.min.js',
            path.src + '/lib/jweixin-1.0.0.js'
        ],
        dist: path.dist + '/lib'
    };
    // var moveImg = {
    //     src: [
    //         path.src + '/img/**/*.{png,jpg,jpeg,gif,svg}'
    //     ],
    //     dist: path.dist + '/img'
    // };
    var moveFont = {
        src: [
            path.src + '/fonts/**/*.*'
        ],
        dist: path.dist + '/fonts'
    };


    var lib = gulp.src(moveLib.src)
        .pipe(gulp.dest(moveLib.dist));
    // var img = gulp.src(moveImg.src)
    //     .pipe(imagemin())
    //     .pipe(gulp.dest(moveImg.dist));
    var font = gulp.src(moveFont.src)
        .pipe(gulp.dest(moveFont.dist));
    return merge(lib, font);
});

/**
 * imgMin
 * */
gulp.task('img:min', function () {
    var moveImg = {
        src: [
            path.src + '/img/**/*.*'
        ],
        dist: path.dist + '/img'
    };
    if (ENV == "PRO") {
        return gulp.src(moveImg.src)
            .pipe(imagemin())
            .pipe(gulp.dest(moveImg.dist));
    }else{
        return gulp.src(moveImg.src).pipe(gulp.dest(moveImg.dist));
    }
    
});



// gulp.task('jsmin', function () {
//     return gulp.src('./app/lib/socket.io.js')
//         .pipe(concat('socket.io.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(path.dist + '/js'));
// });


/**
 * ---1. 需要按需加载到模块--------------------------------------------------------------
 * user/brandInfo
 * 上述需要关注公账号(微信)或者(登陆后)才能访问,
 * 故将此资源提取出来进行按需加载.
 * 触发动作为"鉴权操作".
 * */

/**
 * 定义lazyLoad资源的map
 * */
var lazyLoadMap = [
    path.src + '/tpl/users/**/*.controller.js',
    path.src + '/tpl/brandInfo/**/*.controller.js'
    // path.src + '/service/users/**/*.service.js',
    // path.src + '/service/brandInfo/**/*.service.js'
];
gulp.task('resource:lazyLoadMap', function () {
    var stream = gulp.src(lazyLoadMap).pipe(concat('lazyLoadMap.resource.js'));
    if (ENV == "PRO") {
        return stream.pipe(uglify())
            // .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/js'));
    } else {
        return stream.pipe(gulp.dest(path.dist + '/js'));
    }
});

// var userMap = [
//     path.src + '/tpl/users/**/*.controller.js',
//     path.src + '/service/users/**/*.service.js'
// ];
// gulp.task('resource:users', function () {
//     var stream = gulp.src(userMap).pipe(concat('users.resource.js'));
//     if (ENV == "PRO") {
//         return stream.pipe(uglify())
//             // .pipe(md5(10, path.dist + '/index.html'))
//             .pipe(gulp.dest(path.dist + '/js'));
//     } else {
//         return stream.pipe(gulp.dest(path.dist + '/js'));
//     }
// });

/**
 * 定义brandInfo资源的map
 * */
// var brandInfoMap = [
//     path.src + '/tpl/brandInfo/**/*.controller.js',
//     path.src + '/service/brandInfo/**/*.service.js'
// ];
// gulp.task('resource:brandInfo', function () {
//     var stream = gulp.src(brandInfoMap).pipe(concat('brandInfo.resource.js'));
//     if (ENV == "PRO") {
//         return stream.pipe(uglify())
//             // .pipe(md5(10, path.dist + '/index.html'))
//             .pipe(gulp.dest(path.dist + '/js'))
//     } else {
//         return stream.pipe(gulp.dest(path.dist + '/js'));
//     }
// });

// /**
//  * 定义selfPark资源的map
//  * */
// var selfParkMap = [
//     path.src + '/tpl/selfPark/controller.selfPark.module.js',
//     path.src + '/tpl/selfPark/**/*.controller.js',
//     path.src + '/service/selfPark/parking.service.module.js',
//     path.src + '/service/selfPark/**/*.service.js'
// ];
// gulp.task('resource:selfPark', function () {
//     var stream = gulp.src(selfParkMap).pipe(concat('selfPark.resource.js'));
//     if (ENV == "PRO") {
//         return stream.pipe(uglify())
//             // .pipe(md5(10, path.dist + '/index.html'))
//             .pipe(gulp.dest(path.dist + '/js'));
//     } else {
//         return stream.pipe(gulp.dest(path.dist + '/js'));
//     }
// });

/**
 * ---2. 其余首屏就加载的模块--------------------------------------------------------------
 * filter/directives/utils/routers
 * 定义其余资源的map(首屏加载部分)
 * */

//filters
var filterMap = {
    src: [
        path.src + '/filters/filters.module.js',
        path.src + '/filters/**/*.filter.js'
    ],
    dist: path.dist + '/js'
};
//directives
var directiveMap = {
    src: [
        path.src + '/directives/directive.module.js',
        path.src + '/directives/**/*.directive.js'
    ],
    dist: path.dist + '/js'
};
//utils
var utilsMap = {
    src: [
        path.src + '/utils/utils.module.js',
        path.src + '/utils/**/*.utils.js'
    ],
    dist: path.dist + '/js'
};
//routers
var routerMap = {
    src: [
        path.src + '/routers/routers.module.js',
        path.src + '/routers/**/*.routers.js'
    ],
    dist: path.dist + '/js'
};
//service
var serviceMap = {
    src: [
        path.src + '/service/services.module.js',
        path.src + '/service/**/*.service.js'
    ],
    dist: path.dist + '/js'
};
//controller
//检查controller不生效是因为这个嘛?
var controllerMap = {
    src: [
        path.src + '/tpl/controller.module.js',
        path.src + '/tpl/**/*.controller.js',
        // path.src + '/tpl/activity/**/*.controller.js',
        // path.src + '/tpl/authorize/**/*.controller.js',
        // path.src + '/tpl/home/**/*.controller.js',
        // path.src + '/tpl/mallNavigate/**/*.controller.js',
        // path.src + '/tpl/mallNews/**/*.controller.js',
        // path.src + '/tpl/navigateTo/**/*.controller.js',
        // path.src + '/tpl/selfPark/**/*.controller.js'
    ],
    dist: path.dist + '/js'
};
gulp.task('resource:otherJS', function () {
    var filter = (function () {
        var stream = gulp.src(filterMap.src).pipe(concat('filters.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(filterMap.dist));
        } else {
            return stream.pipe(gulp.dest(filterMap.dist));
        }
    })();

    var directive = (function () {
        var stream = gulp.src(directiveMap.src).pipe(concat('directives.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(directiveMap.dist));
        } else {
            return stream.pipe(gulp.dest(directiveMap.dist));
        }
    })();

    var utils = (function () {
        var stream = gulp.src(utilsMap.src).pipe(concat('utils.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(utilsMap.dist));
        } else {
            return stream.pipe(gulp.dest(utilsMap.dist));
        }
    })();

    var router = (function () {
        var stream = gulp.src(routerMap.src).pipe(concat('routers.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(routerMap.dist));
        } else {
            return stream.pipe(gulp.dest(routerMap.dist));
        }
    })();

    var service = (function () {
        var stream = gulp.src(serviceMap.src).pipe(concat('services.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(serviceMap.dist));
        } else {
            return stream.pipe(gulp.dest(serviceMap.dist));
        }
    })();

    var controller = (function () {
        var stream = gulp.src(controllerMap.src).pipe(concat('controllers.js'));
        if (ENV == "PRO") {
            return stream.pipe(uglify())
                .pipe(md5(10, path.dist + '/index.html'))
                .pipe(gulp.dest(controllerMap.dist));
        } else {
            return stream.pipe(gulp.dest(controllerMap.dist));
        }
    })();

    return merge(filter, directive, utils, router, service, controller);
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
    var stream = gulp.src(pageCssMap.main).pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            // browsers: ['IE 7'],
            browsers: ['Android >=2.1','last 2 versions'],
            cascade: false
        }));
    if (ENV == "PRO") {
        return stream.pipe(cleanCSS())
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/css'))
    } else {
        return stream.pipe(gulp.dest(path.dist + '/css'))
    }
});
gulp.task('ionicCss', function () {
    var stream = gulp.src(ionicCssMap.main)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            // browsers: ['IE 7'],
            browsers: ['Android >=2.1','last 2 versions'],
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
            .pipe(md5(10, path.dist + '/index.html'))
            .pipe(gulp.dest(path.dist + '/css'))
    } else {
        return stream
        // .pipe(rename('ionic.css'))
            .pipe(gulp.dest(path.dist + '/css'))
    }
});


/**
 * --default task--------------------------------------------------------------
 * */
gulp.task('default', gulpSequence(
    //清理dist目录
    'clean:dist',
    [
        //移动tpl
        'move:tpl',
        //移动根目录js文件
        'move:baseJs',
        //移动准备必须的资源
        'move:resource',
        //css合并
        'pageCss',
        'ionicCss',
        //首次加载的js资源(service/routers/filters/utils/dierctives)
        'resource:otherJS',
        //延迟加载部分(user,brandInfo,selfPark)
        'resource:lazyLoadMap',
        'img:min'
        // 'resource:brandInfo',
        // 'resource:selfPark'
    ],
    //watch
    'watch'));


/**
 * --watch task--------------------------------------------------------------
 * */
gulp.task('watch', function () {
    //css
    gulp.watch(pageCssMap.src, ['pageCss']);
    gulp.watch(ionicCssMap.src, ['ionicCss']);

    gulp.watch(tplMap.src, ['move:tpl']);
    gulp.watch(baseJs.src, ['move:baseJs']);

    gulp.watch(lazyLoadMap, ['resource:lazyLoadMap']);
    // gulp.watch(brandInfoMap, ['resource:brandInfo']);
    // gulp.watch(selfParkMap, ['resource:selfPark']);

    gulp.watch(filterMap.src, ['resource:otherJS']);
    gulp.watch(directiveMap.src, ['resource:otherJS']);
    gulp.watch(utilsMap.src, ['resource:otherJS']);
    gulp.watch(routerMap.src, ['resource:otherJS']);
    gulp.watch(serviceMap.src, ['resource:otherJS']);
    gulp.watch(controllerMap.src, ['resource:otherJS']);

});