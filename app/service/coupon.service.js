/**
 * Created by xiangsongtao on 16/4/16.
 * 礼品卡券 相关的services层
 */
(function () {
    angular.module('smartac.services')
        /**
         * 查询卡券和礼品的列表(all),options为发送的参数,返回promise()
         * */
        .factory("$couponList", ['AJAX', 'api', '$q','$ionicToast', function (AJAX, api, $q,$ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryListVivo",
                    "conditions": {
                        "categorycode": "",//卡券类型值 "1,2,3"
                        "class_code": null,
                        "orgid": "",
                        "area": null,
                        "typecode":null,//1,卡券 2,礼品 int
                        "applicablechannel": 0,//适用渠道 1 积分商城 2活动（摇一摇，抽奖，围栏...）3奖赏引擎 4推送 int
                        "querytype": "main",
                        "page": {
                            "index": 1,
                            "num": 10
                        },
                        "sort": {
                            "column": "point",
                            "type": "desc"
                        },
                        "min_points": null,
                        "max_points": null,
                        "key_name": "",
                        "has_left": 1
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                console.log(params)
                AJAX({
                    url: api.couponUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        console.log('queryListVivo')
                        console.log(data)
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("列表获取失败,请稍后再试!");
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("系统繁忙,请稍后再试!");
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])



        /**
         * 用户的卡券和礼品列表(users)
         * */
        .factory("$userCouponList", ['AJAX', 'api', '$q','$ionicToast','$sessionStorage', function (AJAX, api, $q,$ionicToast,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryCoupon",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid.toString(),
                        "categorycode": "",
                        "typecode": 0,
                        "statuscode": 0,
                        "querytype": "main",
                        "page": {
                            "index": 1,
                            "num": 10
                        },
                        "sort": {
                            "column": "id",
                            "type": "desc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                console.log(params)
                AJAX({
                    url: api.couponUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        console.log('$userCouponList');
                        console.log(data);
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("列表获取失败,请稍后再试!");
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $ionicToast.show("系统繁忙,请稍后再试!");
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

        /**
         * 礼品卡券详情
         * */
        .factory("$couponDetail", ['AJAX', 'api', '$q','$ionicToast','$sessionStorage', function (AJAX, api, $q,$ionicToast,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryInfoVivo",
                    "conditions": {
                        "couponid": null,
                        "typecode":null
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.couponUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        // console.log('$couponDetail');
                        // console.log(data.content);
                        if (data.code == 7001 && !!data.content) {
                            defer.resolve(data.content);
                        } else {
                            $ionicToast.show("明细获取失败,请稍后再试!");
                            defer.reject(null);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $ionicToast.show("系统繁忙,请稍后再试!");
                    }
                });
                return defer.promise;
            }
        }])



})();