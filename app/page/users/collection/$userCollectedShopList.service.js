/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 查询用户收藏的店铺列表(users),options为发送的参数,返回promise
     * */
        .factory("$userCollectedShopList", ['AJAX', 'api', '$q', '$sessionStorage', '$log', function (AJAX, api, $q, $sessionStorage, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryCollection",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "floor":null,
                        "industryid_code":null,
                        "sort": {
                            "column": "",
                            "type": "desc"
                        },
                        "page": {
                            "index": 1,
                            "num": 10
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                console.log('params');
                console.log(params);
                AJAX({
                    method: "post",
                    url: api.customerUrl,
                    data: params,
                    success: function (data) {
                        if (data.code == 7001 && !!data.content) {
                            var collectedList = data.content;
                            angular.forEach(collectedList, function (value, index) {
                                value.iscollect = 1;
                            });
                            console.log(collectedList)
                            defer.resolve(collectedList);
                            $log.debug("$userCollectedShopList获取成功,共" + collectedList.length + "条")
                        } else {
                            // console.log(data);
                            defer.resolve([]);
                            $log.debug("$userCollectedShopList获取失败,返回空");
                        }
                    },
                    error: function (errText) {
                        $log.debug("$userCollectedShopList获取失败," + errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();