/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 停车付款
     * */
        .factory("$payForParking", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "pay",
                    "paymentInfo": {
                        "custid": 25,
                        "seqNumber": "123000678",
                        "ticketNumber": "1234.1234.1234",
                        "couponid": 1211,//优惠券id
                        "couponAmount": 5,// 优惠券支付金额
                        "wechatAmount": 10,//微信支付金额
                        "alipayAmount": 0,//支付宝支付金额
                        "pointPayNum": 500,//积分支付的积分数量
                        "pointPayAmount": 5//积分支付的抵扣金额
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
                            //直接返回数据
                            defer.resolve(data.content)
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 19001:
                                    errText = "系统异常!";
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