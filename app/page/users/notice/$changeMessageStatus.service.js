/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取会员消息列表
     * */
        .factory("$changeMessageStatus", ['AJAX', 'api', '$q', '$sessionStorage', '$log', '$ionicToast', function (AJAX, api, $q, $sessionStorage, $log, $ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "update",
                    "message": {
                        "id": null,
                        "statuscode": 1
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                console.log(params)
                AJAX({
                    url: api.messageUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve(true);
                            $log.debug("更改消息状态成功:" + params.message.statuscode);
                        } else {
                            defer.reject(data.code);
                            $log.debug("更改消息状态失败," + data.code);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

})();