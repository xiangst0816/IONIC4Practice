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
 * image处理
 * */
var moveImg = {
    src: [
        `${path.src}/img/**/*.*`,
    ],
    tmp: `${path.tmp}/img`,
    dist: `${path.dest}/img`
};
export const image = function () {
    var stream = gulp.src(moveImg.src);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(moveImg.tmp));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(moveImg.dist));
            break;
        case 'PRO':
            return stream.pipe($.cached($.imagemin())).pipe(gulp.dest(moveImg.dist));
            break;
    }
};





