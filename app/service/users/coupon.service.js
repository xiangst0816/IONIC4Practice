/**
 * Created by xiangsongtao on 16/4/16.
 * 卡券 相关的services层
 */
(function () {
    angular.module('smartac.services')
        /**
         * 查询卡券列表(all),options为发送的参数,返回promise() (ok)
         * */
        .factory("$couponList", ['AJAX', 'api', '$q','$ionicToast', function (AJAX, api, $q,$ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryList",
                    "conditions": {
                        "categorycode": "",//卡券类型值 "1,2,3"
                        "class_code": null,
                        "orgid": "",
                        "area": null,
                        "applicablechannel": 1,//适用渠道 1 积分商城 2活动（摇一摇，抽奖，围栏...）3奖赏引擎 4推送 int
                        "querytype": "main",
                        "page": {
                            "index": 1,
                            "num": 500
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
                AJAX({
                    url: api.couponUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("卡券列表获取失败,请稍后再试!");
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
         * 用户的卡券列表(users)(ok)
         * */
        .factory("$effectiveCouponList", ['AJAX', 'api', '$q','$ionicToast','$sessionStorage', function (AJAX, api, $q,$ionicToast,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "effectiveCoupon",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid.toString(),
                        "categorycode": null,
                        "querytype": "main",
                        "page": {
                            "index": 1,
                            "num": 500
                        },
                        "sort": {
                            "column": "point",
                            "type": "desc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.couponUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        console.log('$effectiveCouponList');
                        console.log(data);
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("卡券列表获取失败,请稍后再试!");
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