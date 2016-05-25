/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
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
                        "applicablechannel": 1,//适用渠道 1 积分商城 2活动（摇一摇，抽奖，围栏...）3奖赏引擎 4推送 int
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


})();