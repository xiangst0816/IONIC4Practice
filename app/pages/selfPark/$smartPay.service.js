/**
 * Created by xiangsongtao on 16/6/14.
 */
(function () {
    angular.module('smartac.page')

    /**
     * smartpay支付接口
     * $smartPay
     * 1. 获取smartPay的支付信息,
     * 2. 由返回信息配置微信支付config
     * 3.
     * */
        .factory("$smartPay", ['AJAX',  '$q', '$log', '$sessionStorage',  function (AJAX,  $q, $log, $sessionStorage) {
            /**
             * 微信配置成功后需要不断轮训查找此订单的支付状态
             * */
            function orderStatus(trade_no, successCB, errorCB) {
                AJAX({
                    url: API.reqQueryPayUrl,
                    method: "post",
                    data: {
                        "trade_no": trade_no
                    },
                    success: function (d) {
                        // console.log("SmartPay上的订单查询结果(轮询):");
                        // console.log(d);
                        if (d.errcode == 0) {
                            if (d.trade_info.status == 1) {
                                orderStatus(trade_no, callback);
                            } else if (d.trade_info.status == 2) {
                                !!successCB && successCB("支付完成");
                                defer.resolve("支付完成");
                            } else if (d.trade_info.status == 4) {
                                !!errorCB && errorCB("订单已过期");
                                $log.debug("SmartPay:订单已过期")
                            } else if (d.trade_info.status == 5) {
                                !!errorCB && errorCB("订单已取消");
                                $log.debug("SmartPay:订单已取消");
                            } else if (d.trade_info.status == 6) {
                                !!errorCB && errorCB("付款失败");
                                $log.debug("SmartPay:付款失败");
                            }
                        } else {
                            !!errorCB && errorCB("系统错误");
                            $log.debug("SmartPay:查询订单出错:" + d.responseText);
                        }
                    },
                    error: function () {
                        !!errorCB && errorCB("系统错误");
                        $log.debug("SmartPay:查询订单出错,系统错误!");
                    }
                });
            }


            /**
             * 入口
             * */
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "shop_id": "",//string 店铺id
                    "trade_type": 1,//int  交易类型;1 微信公众号(H5支付),2 微信扫码,3 微信app(APP支付)
                    "original_fee": 0,//int 原始金额
                    "total_fee": 0,//int 实付金额
                    "pay_source": 1,//int 支付数据来源;1 微信支付, 3 阿里支付
                    "openid": "",//string 客户标示(微信)

                    "customer_id": $sessionStorage.userInfo.customerid.toString(),//string 会员id
                    "customer_name": $sessionStorage.userInfo.fullname.toString(),//string 客户名称
                    "staff_id": "",//string 收银员id
                    "auth_code": "",//string 授权码
                    "discountable_fee": 0,//int 可打折金额
                    "comment": "移动端WebAPP支付",//string 备注
                    "list_coupon_code": [],//Array 优惠券编号列表
                    "third_party_id": ""//string 第三方ID
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log('向SmartPay提出支付请求并获得支付信息:');
                // console.log(params);

                AJAX({
                    // url: 'http://172.16.0.142:10010/api/spay.server/req_pay',
                    // url: API.reqPayUrl,
                    url: 'http://localhost:3000/data/test.json',
                    // method: "post",
                    method: "get",
                    data: params,
                    success: function (d) {
                        // console.log("1.支付前的订单信息结果:");
                        // console.log(d);
                        if (d.errcode === 0) {
                            //进行下一步,设置支付的config(微信、app)

                            if (Internal.isInWeiXin) {
                                WeixinJSBridge.invoke(
                                    'getBrandWCPayRequest', {
                                        "appId": BASE.wxAppID,
                                        "timeStamp": d.pay_req_param.time_stamp.toString(),
                                        "nonceStr": d.pay_req_param.nonce_str,
                                        "package": d.pay_req_param.package,
                                        "signType": d.pay_req_param.sign_type,
                                        "paySign": d.pay_req_param.pay_sign
                                    },
                                    function (res) {
                                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                                            orderStatus(d.trade_no, function (statusText) {
                                                $log.debug("支付完成(微信支付->smartPay收到账单)");
                                                defer.resolve(statusText);
                                            }, function (statusText) {
                                                defer.reject(statusText);
                                                $log.error("SmartPay未收到账单:" + statusText);
                                            });
                                        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                            $log.debug("微信支付失败");
                                            defer.reject("微信支付失败");
                                        } else {
                                            $log.debug("微信支付已取消");
                                            defer.reject("微信支付已取消");
                                        }
                                    }
                                );
                            } else if (Internal.isInApp) {
                                if (params.pay_source === 1) {
                                    smartApp.wxpay({
                                        partnerId: d.pay_req_param.partnerid,
                                        prepayId: d.pay_req_param.prepay_id,
                                        packageValue: d.pay_req_param.package,
                                        nonce: d.pay_req_param.nonce_str,
                                        timeStamp: d.pay_req_param.time_stamp.toString(),
                                        sign: d.pay_req_param.pay_sign
                                    });
                                    orderStatus(d.trade_no, function (statusText) {
                                        $log.debug("支付完成(SmartAPP_微信支付->smartPay收到账单)")
                                        defer.resolve(statusText)
                                    }, function (statusText) {
                                        defer.reject(statusText);
                                        $log.error("SmartAPP_微信支付_未收到账单:" + statusText);
                                    });
                                } else if (params.pay_source === 3) {
                                    smartApp.alipay({
                                        "orderString": d.pay_url.replace(/\"/g, '"')
                                    });
                                    orderStatus(d.trade_no, function (statusText) {
                                        defer.resolve(statusText);
                                        $log.error("支付完成(支付宝支付->smartPay收到账单)");
                                    }, function (statusText) {
                                        defer.reject(statusText);
                                        $log.error("SmartPay_支付宝_未收到账单:" + statusText);
                                    });
                                } else {
                                    alert("请选择支付方式,当前支付方式:" + params.pay_source);
                                    defer.reject();
                                }
                            } else {
                                alert("请在微信APP或者SmartAPP中打开该链接");
                                defer.reject();
                            }


                        } else {
                            $log.error("支付失败,支付前的订单信息错误,data.errcode:" + d.errcode);
                            defer.reject(d.errcode);
                        }
                    },
                    error: function (errText) {
                        $log.error("支付失败,支付前的订单信息错误:" + JSON.stringify(errText));
                        defer.reject("系统错误");
                    }
                });
                return defer.promise;
            }
        }])

})();