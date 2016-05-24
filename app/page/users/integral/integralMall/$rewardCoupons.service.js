/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 卡券领取-积分兑换卡券(ok)
     * */
        .factory("$rewardCoupons", ['AJAX', 'api', '$q', '$ionicToast', '$log', function (AJAX, api, $q, $ionicToast, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "rewardCoupon",
                    "conditions": {
                        "custid": "",
                        "couponid": "",
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
                console.log(params)
                AJAX({
                    method: 'post',
                    url: api.couponUrl,
                    data: params,
                    success: function (data) {
                        console.log(data);
                        if (data.code == 7001) {
                            defer.resolve("您可在【会员中心】-【礼品卡券】中查看/更改订单详情。")
                        } else {
                            var errText;
                            switch (data.code) {
                                case 11004:
                                    errText = "超过最大发放数!";
                                    break;
                                case 11005:
                                    errText = "该卡券不能用于积分兑换!";
                                    break;
                                case 11006:
                                    errText = "超过该卡券可兑换的最大数量!";
                                    break;
                                case 11007:
                                    errText = "您的积分余额不足,无法兑换!";
                                    break;
                                case 11008:
                                    errText = "不在该卡券的适用渠道范围内!";
                                    break;
                                case 11009:
                                    errText = "卡券已过期!";
                                    break;
                                case 11022:
                                    errText = "积分不足，无法兑换!";
                                    break;
                                case 11023:
                                    errText = "您的会员卡类型不具备兑换条件!";
                                    break;
                                case 11034:
                                    errText = "您的积分数不满足卡券的规则设置!";
                                    break;
                                default:
                                    errText = "系统异常,请稍后再试!";
                                    break;
                            }
                            $log.debug('兑换失败,code:' + data.code);
                            defer.reject(errText)
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("系统繁忙,请稍后再试!");
                        $log.debug('兑换失败,code:' + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();