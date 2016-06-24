/**
 * base64编码解码模块
 * 编码:
 * $base64.encode("string)
 * 解码:
 * $base64.decode("string)
 * */
(function () {
    angular.module('smartac.page')
        .factory("$base64", [function () {
       
            return {
                encode: base64encode,
                decode: base64decode
            }
        }])
})();





