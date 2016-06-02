/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 礼品卡券详情
     * */
        .factory("$couponDetail", ['AJAX', 'api', '$q','$ionicToast','$filter', function (AJAX, api, $q,$ionicToast,$filter) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryInfoVivo",
                    "conditions": {
                        "couponid": null,
                        "typecode":null
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.couponUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        // console.log('$couponDetail');
                        // console.log(data.content);
                        if (data.code == 7001 && !!data.content) {
                            var result = data.content;

                            //判断兑换起始日期是否大于今天,如果大于今天意味着不能兑换(canConvert)
                            if (parseInt(result.valid_type_code) != 2) {
                                result.canConvert = !!($filter('isDateIn')(null, result.valid_start_time, result.valid_end_time));
                            } else {
                                result.canConvert = true;
                            }
                            
                            defer.resolve(result);
                        } else {
                            $ionicToast.show("明细获取失败,请稍后再试!");
                            defer.reject(null);
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