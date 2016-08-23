/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */

import path from "./config";
import ENV from "./config";


var pageCssMap = {
    src: [
        path.src + '/pages/**/*.scss',
        path.src + '/theme/common/**/*.scss'
    ],
    main: path.src + '/theme/app.pages.scss'
};


//编译sass文件,将raw文件转到dist中
module.exports = function pageCss() {
    var stream = gulp.src(pageCssMap.main).pipe($.sass().on('error', $.sass.logError))
        .pipe($.base64())
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

