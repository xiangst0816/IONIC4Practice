/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 如果错误则后退一页
     * */
        .factory("$goBackWhenError",["$timeout",function ($timeout) {
            return function () {
                $timeout(function () {
                    window.history.go(-1);
                },1300,false)
            }
        }])
})();