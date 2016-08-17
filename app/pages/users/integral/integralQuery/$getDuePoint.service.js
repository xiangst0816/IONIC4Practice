/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 个人积分过期时间,options为发送的参数,返回promise
     * */
        .factory("$getDuePoint", ['AJAX',  '$q', '$log', '$sessionStorage', function (AJAX,  $q, $log, $sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                //默认参数
                var params = {
                    "method": "getDuePoint",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: API.pointUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            //标志执行成功
                            $log.debug("积分过期信息获取成功!");
                            defer.resolve(data.content);
                        } else {
                            $log.debug("积分过期信息获取失败" + data.code);
                            defer.reject(false);
                        }
                    },
                    error: function (errText) {
                        $log.debug("积分过期信息获取失败:" + errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();