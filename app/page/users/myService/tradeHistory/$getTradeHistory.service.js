/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取停车缴费记录
     * */
        .factory("$getTradeHistory", ['AJAX', 'api', '$q', '$log','$duringSeconds','$filter', function (AJAX, api, $q, $log,$duringSeconds,$filter) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryPayment",
                    "condition": {
                        "queryType": "main",//是
                        "custid": null,//是
                        "page": {
                            "index": 1,
                            "num": 100
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
                        console.log(data)

                        if (data.code == 7001) {
                            var result = data.list;
                            angular.forEach(result,function (value,index) {
                                value.during = $filter("during_HHmm_cn")($duringSeconds(value.entryTime,value.paymentTime));
                            });
                            defer.resolve(result);
                            console.log(result);
                            $log.debug("停车缴费记录获取成功,共" + result.length + "条记录");
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
                            $log.debug("停车缴费记录获取失败,errText =" + errText);
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        $log.debug("停车缴费记录获取失败,errText =" + errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();