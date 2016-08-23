/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */

export const ENV = function () {
    return "DEV"
}

export const pageCssMap = function () {
    return {
        src: [
            path.src + '/pages/**/*.scss',
            path.src + '/theme/common/**/*.scss'
        ],
        main: path.src + '/theme/app.pages.scss'
    }
}


export const path = {
    src: "app",
    tmp: "tmp",
    dest: "www"
};