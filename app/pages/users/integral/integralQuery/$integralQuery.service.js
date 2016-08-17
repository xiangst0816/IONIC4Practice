/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 个人积分历史记录查询,options为发送的参数,返回promise
     * */
        .factory("$integralQuery", ['AJAX',  '$q','$log','$sessionStorage', function (AJAX,  $q,$log,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                //默认参数
                var params = {
                    "method": "getCustPointDetail",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "begindate": "",
                        "enddate": "",
                        "querytype": "main",
                        "page": {
                            "index": 1,
                            "num": 10
                        },
                        "sort": {
                            "column": "gettime",
                            "type": "desc"
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log(params)
                AJAX({
                    url: API.pointUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            //标志执行成功
                            defer.resolve(data.content.data);
                            $log.debug("积分历史列表获取成功,数据"+ data.content.data.length + "条")
                        } else {
                            $ionicToast.show("记录获取失败,请稍后再试!");
                            $log.debug("积分历史列表获取失败:"+data.code);
                            defer.reject();
                        }
                    },
                    error: function (errText) {
                        // $ionicToast.show("积分历史记录获取失败!");
                        $log.debug("积分历史列表获取失败:"+errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();