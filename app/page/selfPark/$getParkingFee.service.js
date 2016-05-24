/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 查询停车费用
     * */
        .factory("$getParkingFee", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "getParkingFee",
                    "ticketInfo": ""//停车小票扫码出来的信息
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.parkingUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            //直接返回数据
                            defer.resolve(data.content)
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 19001:
                                    errText = "停车场接口异常!";
                                    break;
                                case 19003:
                                    errText = "系统内部异常!";
                                    break;
                                default:
                                    errText = "系统错误!";
                                    break;
                            }
                            defer.reject(errText)
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