/**
 * Created by xiangsongtao on 16/5/16.
 */
(function () {
    angular.module('smartac.services')

    /**
     * 礼品兑换-积分兑换礼品(ok)
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
                        $ionicToast.show("系统繁忙,请稍后再试!");
                        $log.debug("兑换失败,code:" + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])


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
        /**
         * 礼品卡券兑换操作
         * */
        .factory("$rewardCouponGift", ['AJAX', 'api', '$q', '$ionicToast', '$rewardGifts', '$rewardCoupons', '$ionicPopup', '$sessionStorage', function (AJAX, api, $q, $ionicToast, $rewardGifts, $rewardCoupons, $ionicPopup, $sessionStorage) {
            return function (detail, convertNum) {
                //判断title
                if (detail.category_name && detail.category_name.indexOf('coupon') > -1) {
                    var title = '礼券';
                    var suffix = '张';
                } else {
                    var title = '礼品';
                    var suffix = '个';
                }
                //兑换请求
                $scope.data = {
                    title: title,
                    suffix: suffix,
                    detail: detail
                };

                //默认为1
                convertNum || (convertNum = 1);

                var convertRequest = {
                    title: "兑换" + title,
                    cssClass: 'noticePopup convertRequestBox',
                    subTitle: '',
                    templateUrl: 'tpl/convertRequest.comp.html',
                    scope: $scope,
                    buttons: [{
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function (e) {
                            if (!convertNum) {
                                $ionicToast.show("请输入兑换数量!");
                                //如果没输入兑换数量则保持不动
                                e.preventDefault();
                            } else {
                                //发送数据
                                if (detail.category_name && detail.category_name.indexOf('coupon') > -1) {
                                    //如果是兑换礼券
                                    rewardCoupons(detail, convertNum).then(function (codeText) {
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        angular.extend(convertResult, {title: "兑换失败", template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                } else {
                                    //如果是兑换礼品
                                    rewardGifts(detail, convertNum).then(function (codeText) {
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        // console.log(code)
                                        angular.extend(convertResult, {title: "兑换失败", template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                }

                            }
                        }
                    }, {
                        text: '取消', type: 'noticePopupBtn', onTap: function (e) {
                        }
                    }
                    ]
                };
                //显示兑换请求
                $ionicPopup.show(convertRequest);

                //定义返回结果的兑换消息参数结构
                var convertResult = {
                    title: "",
                    cssClass: 'noticePopup convertRequestBox',
                    template: "",
                    buttons: [{
                        text: '确定', type: 'noticePopupBtn', onTap: function (e) {
                        }
                    }]
                };


                /**
                 * 卡券领取-积分兑换卡券
                 * detail:obj,传入兑换卡券的信息对象
                 * quantity,数量
                 * */
                function rewardCoupons(detail, quantity) {
                    return $rewardCoupons({
                        "conditions": {
                            "custid": $sessionStorage.userInfo.customerid,
                            "couponid": detail.couponid,
                            "quantity": quantity,
                            "point": detail.point
                        }
                    });
                }

                /**
                 * 礼品兑换-积分兑换礼品
                 * detail:obj传入兑换卡券的信息对象
                 * quantity,数量
                 * */
                function rewardGifts(detail, quantity) {
                    return $rewardGifts({
                        "conditions": {
                            "custid": $sessionStorage.userInfo.customerid,
                            "giftid": detail.innerid,
                            "quantity": quantity,
                            "point": detail.quantity
                        }
                    });
                }
            }

        }])
})();