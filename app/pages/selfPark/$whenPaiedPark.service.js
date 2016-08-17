/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 停车付款成功后,进行卡券和积分核销的接口
     * $whenPaiedPark
     * */
        .factory("$whenPaiedPark", ['AJAX',  '$q','$log', function (AJAX,  $q,$log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "pay",
                    "paymentInfo": {
                        "custid": 0,
                        "seqNumber": "",
                        "ticketNumber": "",
                        "coupon": [],//优惠券多张[{"id":0,"no":"01","amount":10,"name":"停车券"}]
                        "wechatAmount": 10,//微信支付金额
                        "alipayAmount": 0,//支付宝支付金额
                        "pointPayNum": 500,//积分支付的积分数量
                        "pointPayAmount": 5,//积分支付的抵扣金额
                        "entryTime":"",//进场时间
                        "paytime":"",//支付时间
                        "amount": 0,//原实金额
                        "disamount": 0,//原始打折金额
                        "bepaidtime": 0,//停车时间支付有效期min
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log('发送到后台的支付参数,用于核销卡券和积分:')
                // console.log(params)
                AJAX({
                    url: API.parkingUrl,
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
                                    errText = "停车场服务异常!";
                                    break;
                                case 19003:
                                    errText = "系统异常!";
                                    break;
                                default:
                                    errText = "系统错误!";
                                    break;
                            }
                            $log.error("支付信息提交后台失败:"+19001);
                            defer.reject(errText)
                        }
                    },
                    error: function (errText) {
                        $log.error("支付信息提交后台失败:"+JSON.stringify(errText));
                        defer.reject("系统错误");
                    }
                });
                return defer.promise;
            }
        }])
})();