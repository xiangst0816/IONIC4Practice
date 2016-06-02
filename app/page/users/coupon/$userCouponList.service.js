/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
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
                            "column": "get_time",
                            "type": "desc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log(params)
                AJAX({
                    url: api.couponUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        // console.log('$userCouponList');
                        // console.log(data);
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

})();