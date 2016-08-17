/**
 * Created by xiangsongtao on 16/5/31.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 交易补录(选择图片上传并积分)
     * */
        .factory("$submitTradeImg", ['AJAX',  '$q','$log', function (AJAX,  $q,$log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "uploadImage",
                    "detail": {
                        "custid": null,
                        "sourceid": null,
                        "createdtime": null
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: API.tradeUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve();
                        } else {
                            defer.reject(data.code);
                            $log.debug("小票信息提交失败,code" + data.code);
                        }
                    },
                    error: function (errText) {
                        $log.debug("小票信息提交失败," + JSON.stringify(errText));
                        defer.reject("系统错误,请稍后再试!");
                    }
                });
                return defer.promise;
            }

        }])

})();