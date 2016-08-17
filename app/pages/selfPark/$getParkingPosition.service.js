/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 查询车辆停放位置
     * */
        .factory("$getParkingPosition", ['AJAX',  '$q', function (AJAX,  $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                // var parkingInfo = $sessionStorage.parkingInfo;
                // if (parkingInfo && parkingInfo.freeSpaceNum) {
                //     defer.resolve(parkingInfo.freeSpaceNum);
                //     return defer.promise;
                // }
                var params = {
                    "method": "getParkingPosition",
                    "plateNo": "苏E66666"
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: API.parkingUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            // //数据存储
                            // if ($sessionStorage.parkingInfo) {
                            //     angular.extend($sessionStorage.parkingInfo, data.content)
                            // } else {
                            //     $sessionStorage.parkingInfo = data.content;
                            // }
                            //直接返回数据
                            defer.resolve(data.content)
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 19001:
                                    errText = "停车场接口异常!";
                                    break;
                                case 19003:
                                    errText = "系统内部异常!";
                                    break;
                                default:
                                    errText = "系统错误!";
                                    break;
                            }
                            defer.reject(errText)
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