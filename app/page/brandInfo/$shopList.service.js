/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 查询店铺列表(all),options为发送的参数,返回promise
     * */
        .factory("$shopList", ['AJAX', 'api', '$q', '$ionicToast', '$log','$sessionStorage', function (AJAX, api, $q, $ionicToast, $log,$sessionStorage) {

            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                if (!!$sessionStorage.userInfo && !!$sessionStorage.userInfo.customerid) {
                    var custid = $sessionStorage.userInfo.customerid;
                } else {
                    var custid = null;
                }
                var params = {
                    "method": "query",
                    "conditions": {
                        "orgid": "",
                        "shopid": "",
                        "custid": custid,
                        "industryname": "",
                        "industryid": null,
                        "shopname": "",
                        "floor": null,
                        "page": {
                            "index": 1,
                            "num": 20
                        },
                        "sort": {
                            "column": "name",
                            "type": "asc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log(params);
                AJAX({
                    url: api.shopUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {

                            defer.resolve(data.content);
                            console.log(data.content);
                            $log.debug("商铺列表获取成功,数据:" + data.content.length + "条")
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("获取商户列表失败,稍后再试!");
                            $log.debug("商铺列表获取失败," + data.code);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $log.debug("商铺列表获取失败" + errText)
                    }
                });
                return defer.promise;
            }
        }])

})();