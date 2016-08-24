/**
 * Created by xiangsongtao on 16/8/23.
 * Description:
 */

/**
 * 设置自动构建环境(默认)
 * DEV;源码
 * TES;文件名打码
 * PRO;文件打码压缩
 * */
let _env = "PRO";
export let env = function () {
    return _env
};
export const SetEnv = function (str) {
    _env = str;
};


export const path = {
    src: "app",
    tmp: "tmp",
    dest: "www"
};



