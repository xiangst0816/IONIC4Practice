/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取停车缴费记录
     * */
        .factory("$getTradeHistory", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryPayment",
                    "condition": {
                        "queryType": "main",//是
                        "custid": "",//是
                        "page": {
                            "index": 1,
                            "num": 999
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.parkingUrl,
                    method: "post",
                    data: params,
                    success: function (data) {

                        if (data.code == 7001) {
                            defer.resolve(data.list);
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                // case 10002:
                                //     errText = "系统异常!";
                                //     break;
                                default:
                                    errText = "系统内部错误!";
                                    break;
                            }
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();