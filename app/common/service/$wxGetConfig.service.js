/**
 * Created by xiangsongtao on 16/4/21.
 * 微信相关的service
 */
(function () {
    angular.module('smartac.page')

    /**
     * 获取微信config
     * */
        .factory("$wxGetConfig", ['AJAX', 'api', '$q', 'baseInfo', '$ionicToast', '$sessionStorage', '$log','$ionicPopup', function (AJAX, api, $q, baseInfo, $ionicToast, $sessionStorage, $log,$ionicPopup) {

            /**
             * 配置微信环境
             * */
            function setENV(data, CallBack) {
                wx.ready(function () {

                    //设置分享按钮显示
                    // 要显示的菜单项，所有menu项见附录3
                    wx.hideMenuItems({
                        menuList: [
                            "menuItem:share:qq",
                            "menuItem:share:facebook",
                            // "menuItem:share:weiboApp",
                            "menuItem:share:appMessage",
                            "menuItem:share:email",
                            // "menuItem:openWithSafari"
                        ]
                    });
                    !!CallBack && CallBack();
                });


                //如果错误
                wx.error(function (res) {
                    $ionicPopup.show({
                        title: "错误提示",
                        cssClass: 'noticePopup text-center',
                        subTitle: '',
                        template: "微信配置信息出错,请根据以下信息检查错误代码!<br>errMsg:" + res.errMsg,
                        buttons: [{
                            text: '确定',
                            type: 'noticePopupBtn',
                            onTap: function (e) {
                            }
                        }]
                    });
                    $log.debug('微信JSSDK获取失败,' + res);
                    defer.reject(false);
                });

                //设置config
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
                                setENV(data.content, function () {
                                    defer.resolve(true);
                                });
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

    //    /**
    //     * 由code和微信公众号id获取微信用户的信息
    //     * 用于判断用户是否关注
    //     * */
    // .factory("$wxGetUserInfo", ['AJAX', 'api', '$q','$log','$ionicToast', function (AJAX, api, $q,$log,$ionicToast) {
    //     return function (options) {
    //         if (!angular.isObject(options)) {
    //             options = {};
    //         }
    //         var defer = $q.defer();
    //         var params = {
    //             "method": "queryVivo",
    //             "conditions": {
    //                 "wechatcode":"",
    //                 "accountid":""
    //             }
    //         };
    //         //数据合并
    //         angular.deepExtend(params, options);
    //         AJAX({
    //             url: api.customerUrl,
    //             method: "post",
    //             data: params,
    //             success: function (data) {
    //                 $log.debug("微信用户的信息结果:"+JSON.stringify(data));
    //                 if (data.code == "7001") {
    //                     defer.resolve(data.members[0]);
    //                 } else {
    //                     defer.reject(data.code);
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




