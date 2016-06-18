/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取会员消息列表
     * */
        .factory("$getMessage", ['AJAX', 'api', '$q', '$sessionStorage', '$log', '$ionicToast', function (AJAX, api, $q, $sessionStorage, $log, $ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "query",
                    "querytype": "main",//count
                    "message": {
                        "custid": Number.parseInt($sessionStorage.userInfo.customerid),
                        "statuscode": null,//#状态：0未读/1已读/2删除
                    },
                    "dsc": {
                        "order_by": "statuscode",
                        "order_type": "desc",
                        "page_index": 1,
                        "page_size": 999
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log(params);
                AJAX({
                    url: api.messageUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        // console.log(data)
                        if (data.code == 7001) {
                            //list
                            if (params.querytype == 'main') {
                                defer.resolve(data.item);
                                $log.debug("获取用户消息列表成功,共:" + data.item.length);
                            } else if (params.querytype == 'count') {
                                $log.debug("获取用户消息数量成功,共:" + data.content.totalnum);
                                defer.resolve(data.content.totalnum);
                            }
                        } else {
                            var errText;
                            switch (Number.parseInt(data.code)) {
                                default:
                                    errText = "系统内部错误!";
                                    break;
                            }
                            $ionicToast.show("消息获取失败,请稍后再试");
                            defer.reject(errText);
                            $log.debug("获取用户消息失败," + errText);
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("消息获取失败,系统错误");
                        $log.debug("获取用户消息失败," + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();