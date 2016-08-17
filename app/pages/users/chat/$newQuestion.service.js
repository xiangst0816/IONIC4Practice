/**
 * Created by xiangsongtao on 16/6/20.
 * 客服-提问
 */
(function () {
    angular.module('smartac.page')
        .factory("$newQuestion", ['AJAX',  '$q', '$sessionStorage', '$log', function (AJAX,  $q, $sessionStorage, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "add",
                    "detail": {
                        "name": "如何注册账号?",
                        "detail": "sdf23sdf2323",
                        "contactInfo": $sessionStorage.userInfo.mobile,
                        "custid": parseInt($sessionStorage.userInfo.customerid)
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log('params');
                // console.log(params);
                AJAX({
                    method: "post",
                    url: API.feedbackUrl,
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve(true);
                        } else {
                            defer.reject("服务器异常!");
                            $log.debug("向客服提问错误,返回code:" + data.code);
                        }
                    },
                    error: function () {
                        $log.debug("向客服提问错误,系统异常!");
                        defer.reject("系统异常!");
                    }
                });
                return defer.promise;
            }
        }])

})();