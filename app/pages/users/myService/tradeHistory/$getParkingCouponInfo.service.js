/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取停车缴费记录
     * */
        .factory("$getParkingCouponInfo", ['AJAX',  '$q', '$log','$sessionStorage', function (AJAX,  $q, $log,$sessionStorage) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryParkingCoupon",
                    "condition": {
                        "id": 0,
                        "custid":parseInt($sessionStorage.userInfo.customerid)
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: API.parkingUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (parseInt(data.code) === 7001) {
                            defer.resolve(data.coupons.coupons);
                            // console.log(data.coupons.coupons)
                            $log.debug("停车缴费当前记录的卡券信息获取成功");
                        } else {
                            $log.debug("停车缴费记录获取失败,data.code =" + data.code);
                            defer.reject("服务异常!");
                        }
                    },
                    error: function (errText) {
                        $log.debug("停车缴费记录获取失败,errText =" + errText);
                        defer.reject("系统错误!");
                    }
                });
                return defer.promise;
            }
        }])

})();