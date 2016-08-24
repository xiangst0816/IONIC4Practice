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
 * template
 * */
export const template = function () {
    var stream = gulp.src(`${path.src}/pages/**/*.html`).pipe($.cached('template')).pipe($.rename({dirname: ''}));
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
};



