/**
 * Created by xiangsongtao on 16/6/20.
 * 客服-我的提问列表
 */
(function () {
    angular.module('smartac.page')
        .factory("$myQuestionList", ['AJAX',  '$q', '$sessionStorage', '$log', function (AJAX,  $q, $sessionStorage, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryByCustId",
                    "conditions": {
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
                            defer.resolve(data.content);
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