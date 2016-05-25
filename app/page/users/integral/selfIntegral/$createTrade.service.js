/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 交易补录(扫码积分这块)
     * */
        .factory("$createTrade", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "create",
                    "custid": null,//是
                    "tradeno": "",//是
                    "orgid": "",
                    "shopid": "1",
                    "tradeamount": null,//是
                    "typeid": 1,//1 交易 ，2 退货  	Int32	是
                    "createdtime": "",//创建时间	String	否
                    "createid": "",//创建人	String 否
                    "remark": "",
                    "tradetime": ""
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.tradeUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //
                        // alert(JSON.stringify(data))
                        //

                        if (data.code == 7001) {
                            defer.resolve(data.id);
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 10002:
                                    errText = "系统异常!";
                                    break;
                                case 10003:
                                    errText = "会员不存在!";
                                    break;
                                case 10004:
                                    errText = "交易单号已存在!";
                                    break;
                                case 10005:
                                    errText = "新增小票明细失败!";
                                    break;
                                case 10006:
                                    errText = "系统异常!";
                                    break;
                                default:
                                    errText = data.code;
                                    break;
                            }
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        defer.reject("系统错误,请稍后再试!");
                    }
                });
                return defer.promise;
            }

        }])

})();