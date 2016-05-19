/**
 * Created by xiangsongtao on 16/4/21.
 * 微信相关的service
 */
(function () {
    angular.module('smartac.services')

    /**
     * 获取微信config
     * */
        .factory("$wxGetConfig", ['AJAX', 'api', '$q', 'baseInfo', '$ionicToast', '$sessionStorage', '$log', function (AJAX, api, $q, baseInfo, $ionicToast, $sessionStorage, $log) {

            /**
             * 配置微信config
             * */
            function setConfig(data) {
                wx.config({
                    debug: false,
                    // debug: true,
                    appId: baseInfo.wxAppID,
                    timestamp: data.timestamp,
                    nonceStr: data.noncestr,
                    signature: data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'onVoicePlayEnd',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                });
                wx.error(function (res) {
                    defer.reject(false);
                    $log.debug('微信JSSDK获取失败,' + res);
                });
            }

            /**
             * 微信config信息存入$sessionStorage中
             * */
            return function () {
                var defer = $q.defer();
                if (Internal.isInWeiXin) {
                    if (!!$sessionStorage.wxConfig) {
                        defer.resolve(true);
                        return defer.promise;
                    }
                    AJAX({
                        url: api.signatureUrl,
                        method: "post",
                        data: {
                            "method": "sign",
                            "url": window.document.location.href.split('#')[0].toString()
                        },
                        success: function (data) {
                            if (data.code == "7001") {
                                $sessionStorage.wxConfig = data.content;
                                setConfig(data.content);
                                defer.resolve(true);
                            } else {
                                defer.reject(data.code);
                                $log.debug('微信配置失败,code:' + data.code);
                                $ionicToast.show("微信配置失败,请稍后再试!");
                            }
                        },
                        error: function (errText) {
                            defer.reject(errText);
                            $log.debug('微信配置失败,' + JSON.stringify(errText));
                            $ionicToast.show("微信配置失败,请稍后再试!");
                        }
                    });
                    return defer.promise;
                } else {
                    defer.reject("WeiXin Only");
                    return defer.promise;
                }
            }
        }])


        // /**
        //  * 由用户进入的code值查询openid
        //  * */
        // .factory("$wxGetOpenid", ['AJAX', 'api', '$q', '$errCode2Str', function (AJAX, api, $q, $errCode2Str) {
        //     return function (options) {
        //         if (!angular.isObject(options)) {
        //             options = {};
        //         }
        //         var defer = $q.defer();
        //         var params = {
        //             "method": "getWebAccess_token",
        //             "code": ""//code(用户进入公众号会携带这个code,由此查询openid)
        //         };
        //         //数据合并
        //         angular.deepExtend(params, options);
        //         alert(JSON.stringify(params))
        //         AJAX({
        //             url: api.signatureUrl,
        //             method: "post",
        //             data: params,
        //             success: function (data) {
        //                 if (data.code == "7001") {
        //                     //标志执行成功
        //                     defer.resolve(data.content);
        //                 } else {
        //                     defer.reject($errCode2Str(data.code));
        //                 }
        //             },
        //             error: function (errText) {
        //                 defer.reject(errText);
        //             }
        //         });
        //         return defer.promise;
        //     }
        // }])

        //    /**
        //     * 由openid获取微信用户的信息
        //     * $wxGetUserInfo({
        // *     "openid": openid//微信openid
        // * }).then(function (data) {
        // *     console.log('wx userinfo data')
        // *    console.log(data)
        // * }, function (err) {
        // *
        // * })
        //     * */
        // .factory("$wxGetUserInfo", ['AJAX', 'api', '$q', '$errCode2Str', function (AJAX, api, $q, $errCode2Str) {
        //     return function (options) {
        //         if (!angular.isObject(options)) {
        //             options = {};
        //         }
        //         var defer = $q.defer();
        //         var params = {
        //             "method": "userinfo",
        //             "openid": ""//微信openid
        //         };
        //         //数据合并
        //         angular.deepExtend(params, options);
        //         AJAX({
        //             url: api.signatureUrl,
        //             method: "post",
        //             data: params,
        //             success: function (data) {
        //                 console.log('$wxGetUserInfo data')
        //                 // alert(JSON.stringify(data));
        //                 if (data.code == "7001") {
        //                     //标志服务器返回消息成功
        //                     if (data.content.errcode) {
        //                         //返回错误码,表示openid错误
        //                         defer.reject(data.content.errcode)
        //                     } else {
        //                         //返回正常数据,包含订阅与否和微信用户信息
        //                         defer.resolve(data.content);
        //                     }
        //                 } else {
        //                     defer.reject($errCode2Str(data.code));
        //                 }
        //             },
        //             error: function (errText) {
        //                 defer.reject(errText);
        //             }
        //         });
        //         return defer.promise;
        //     }
        // }])


       
})();




