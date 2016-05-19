/**
 * Created by xiangsongtao on 16/4/19.
 * 交易信息
 */
(function () {
    angular.module('smartac.services')
        /**
         * 交易补录(扫码积分这块)
         * */
        .factory("$createWithInvoice", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "createWithInvoice",
                    "detail": {
                        "custid": null,//是
                        "tradeno": "",//是
                        "orgid": "",
                        "shopid": "1",
                        "tradeamount": null,//是
                        "typeid": 1,//1 交易 ，2 退货  	Int32	是
                        "apptradeid": null,//小票记录表主键	int	是
                        "tradetime": "2016-1-25",
                        "remark": "",
                        "createid": "",//创建人	String 否
                        "createdtime": "",//创建时间	String	否
                        "cumulativeamount": null //累计金额	Double	否
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.tradeUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //

                        alert(JSON.stringify(data))
                        //

                        if (data.code == 7001) {
                            defer.resolve(data.content);
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
                                    errText = "小票无效!";
                                    break;
                                default:
                                    errText = code;
                                    break;
                            }
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }

        }])

        /**
         * 获取停车缴费记录
         * */
        .factory("$getTradeHistory", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryPayment",
                    "condition": {
                        "queryType": "main",//是
                        "custid": "",//是
                        "page": {
                            "index": 1,
                            "num": 999
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.parkingUrl,
                    method: "post",
                    data: params,
                    success: function (data) {

                        if (data.code == 7001) {
                            defer.resolve(data.list);
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                // case 10002:
                                //     errText = "系统异常!";
                                //     break;
                                default:
                                    errText = "系统内部错误!";
                                    break;
                            }
                            defer.reject(errText);
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