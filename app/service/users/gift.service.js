/**
 * Created by xiangsongtao on 16/4/16.
 * 礼品 相关的services层
 */
(function () {
    angular.module('smartac.services')
        /**
         * 查询礼品列表,options为发送的参数,返回promise(ok)
         * */
        .factory("$giftList", ['AJAX', 'api', '$q','$ionicToast', function (AJAX, api, $q,$ionicToast){
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryList",
                    "conditions": {
                        "categorycode": "",
                        "class_code": null,
                        "orgid": "",
                        "area": null,
                        "applicablechannel": 1,
                        "querytype": 1,
                        "page": {
                            "index": 1,
                            "num": 100
                        },
                        "sort": {
                            "column": "quantity",
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
                    url: api.giftUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        // console.log('$GiftList');;
                        // console.log(data)
                        if (data.errcode == 7001) {
                            defer.resolve(data.giftinstance);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("礼品列表获取失败,请稍后再试!");
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
         * 用户的礼品列表(users)(ok)
         * */
        .factory("$effectiveGiftList", ['AJAX', 'api', '$q','$ionicToast','$sessionStorage', function (AJAX, api, $q,$ionicToast,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "exchangegiftslistbycustid",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid.toString(),
                        "usestate": "0",
                        "page": {
                            "index": 1,
                            "num": 100
                        },
                        "sort": {
                            "column": "",
                            "type": "desc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    method: "post",
                    url: api.giftUrl,
                    data: params,
                    success: function (data) {
                        console.log('$effectiveGiftList');;
                        console.log(data)
                        if (data.errcode == 7001) {
                            defer.resolve(data.ExchangeGifts);
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("礼品列表获取失败,请稍后再试!");
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
})();
