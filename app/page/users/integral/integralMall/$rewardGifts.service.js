/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 礼品兑换-积分兑换礼品()
     * */
        .factory("$rewardGifts", ['AJAX', 'api', '$q', '$ionicToast', '$log', function (AJAX, api, $q, $ionicToast, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "exchangebypoint",
                    "conditions": {
                        "custid": "",
                        "giftid": "",
                        "quantity": "",
                        "activityname": "",
                        "sendchannelcode": 6,
                        "applicablechannelcode": 1,
                        "isexchangedbypoint": 1,
                        "point": ""
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    method: 'post',
                    url: api.giftUrl,
                    data: params,
                    success: function (data) {
                        console.log(data);
                        if (data.errcode == 7001) {
                            defer.resolve("您可在【会员中心】-【礼品卡券】中查看/更改订单详情。")
                        } else {
                            var errText;
                            switch (data.errcode) {
                                case 30001:
                                    errText = "系统异常!";
                                    break;
                                case 30002:
                                    errText = "会员不存在!";
                                    break;
                                case 30003:
                                    errText = "礼品不存在!";
                                    break;
                                case 30004:
                                    errText = "库存不足!";
                                    break;
                                case 30005:
                                    errText = "您的积分不足!";
                                    break;
                                case 30006:
                                    errText = "该礼品不可以使用积分兑换!";
                                    break;
                                default:
                                    errText = "系统异常,请稍后再试!";
                                    break;
                            }
                            $log.debug("兑换失败,code:" + data.errcode);
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        // $ionicToast.show("系统繁忙,请稍后再试!");
                        $log.debug("兑换失败,code:" + JSON.stringify(errText));
                        defer.reject("系统繁忙,请稍后再试!");
                    }
                });
                return defer.promise;
            }
        }])

})();