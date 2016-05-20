/**
 * Created by xiangsongtao on 16/4/25.
 * 检查是否具有权限(微信完成自动登陆,app默认需要登录,wx默认需要关注+注册)
 * info:
 * 1. 检查设备环境,
 * 2. 检查是否有用户信息,
 * 3. 微信如果没登录,由code和cfid自动登陆
 * 4. 没有转到登陆/注册,登陆/注册后会查询用户信息
 * 5. 只有进入才是resolve状态,其余为reject状态,返回状态码
 * 6.   resolve->wx_in:微信准许进入
 * 6.   resolve->wx_noRegister:微信准许进入,但是没注册
 *      reject->wx_noCode:进入没有微信code(故无法继续向下进行)
 *      reject->wx_needRegister:微信需要注册(完善电话号码和密码)
 *      reject->wx_needAttention:微信需要关注
 *      resolve->app_in:app准许进入
 *      reject->app_needLogin:app需要登陆
 *      sys_err->系统错误,获取用户信息失败
 * 7. 鉴权等级level(微信)
 *      "" :默认为Att&Reg
 *      "wxLevel_Att&Reg":需要关注,需要注册
 *      "wxLevel_AttOnly":需要关注,不需注册
 */
(function () {
    angular.module('smartac.utils').factory("$checkAuthorize", ['$q', '$getUserInfo', 'baseInfo', '$sessionStorage', '$ionicLoading', '$getUrlParams', '$ionicPopup', '$state', '$ionicToast', '$ocLazyLoad','$timeout','$log','$wxGetUserInfo', function ($q, $getUserInfo, baseInfo, $sessionStorage, $ionicLoading, $getUrlParams, $ionicPopup, $state, $ionicToast, $ocLazyLoad,$timeout,$log,$wxGetUserInfo) {
        return function (level) {
            $ionicLoading.show({
                hideOnStateChange: true,
                template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                '<br>' +
                '<div style="margin-top:0.2rem">正在授权</div>'
            });
            var defer = $q.defer();
            $ocLazyLoad.load('lazyLoadResource').then(function () {
                //微信用户
                if (Internal.isInWeiXin) {
                    var userInfo = $sessionStorage.userInfo;
                    //openid信息不存在
                    if (!userInfo || !userInfo.customerid || !userInfo.openid || userInfo.isattention == 0) {
                        var code = $getUrlParams().code;
                        if (!code) {
                            $ionicPopup.show({
                                title: "提示!",
                                template: "进入链接出错, 请在微信中打开!",
                                cssClass: 'doubleBtnPopup text-center',
                                buttons: [{
                                    text: '返回',
                                    type: 'btnfor2',
                                    onTap: function (e) {
                                        return
                                    }
                                }]
                            });
                            $log.debug("wx_noCode");
                            $ionicLoading.hide();
                            defer.reject("wx_noCode");
                            return defer.promise;
                        }
                        $getUserInfo({
                            "conditions": {
                                "wechatcode": code,//微信code值	String	否
                                //oyCF1juy6VC1xhD-tNXIdU4CFbPA
                                // "openid": 'oyCF1juy6VC1xhD-tNXIdU4CFbPA'//微信code值	String	否
                                "accountid": baseInfo.cfid//公众号	String	否
                            }
                        }).then(function (data) {
                            // data && ($sessionStorage.userInfo = data);
                            wx_registerCheck();
                        }, function (errText) {
                            $ionicToast.show("服务异常,请稍后再试");
                            $log.debug("您的信息获取失败," + errText);
                            $ionicLoading.hide();
                        })
                    } else {
                        $getUserInfo({
                            "conditions": {
                                "customerid": userInfo.customerid.toString()
                            }
                        }).then(function () {
                            wx_registerCheck();
                            $log.debug("wx_in");
                            defer.resolve("wx_in");
                            $ionicLoading.hide();
                        },function (errText) {
                            //查无此人的情况
                            $log.debug("wx_needLogin");
                            $ionicToast.show("请登录");
                            $timeout(function () {
                                $state.go('subNav.login');
                            },1300,false);
                            $log.debug("wx_needLogin");
                            defer.reject("wx_needLogin");
                            $ionicLoading.hide();
                        });

                    }
                } else if (Internal.isInApp) {    //app用户
                    var userInfo = $sessionStorage.userInfo;
                    if(userInfo && userInfo.customerid){
                        $getUserInfo({
                            "conditions": {
                                "customerid": userInfo.customerid.toString()
                            }
                        }).then(function () {
                            $ionicLoading.hide();
                            $log.debug("app_in");
                            defer.resolve("app_in");
                        },function (errText) {
                            //查无此人的情况
                            $log.debug("app_needLogin");
                            $ionicToast.show("请登录");
                            $timeout(function () {
                                $state.go('subNav.login');
                            },1300,false);
                            defer.reject("app_needLogin");
                        })
                    }else {
                        $log.debug("app_needLogin");
                        $ionicToast.show("请登录");
                        $timeout(function () {
                            $state.go('subNav.login');
                        },1300,false);
                        $ionicLoading.hide();
                        defer.reject("app_needLogin");
                    }
                }
            },function () {
                $log.debug("加载用户相关资源'lazyLoadResource'失败,请检查!")
            });
            /**
             * 微信用户子权限判断
             * */
            function wx_registerCheck() {
                //鉴权level判断
                //设置默认值,需要关注需要注册
                level || (level = "wxLevel_Att&Reg");

                var userInfo = $sessionStorage.userInfo;
                //是否关注(这个是必须的)
                if (userInfo && userInfo.isattention) {
                    //是否注册
                    if (userInfo.mobile) {
                        defer.resolve("wx_in");
                    } else {
                        // console.log('level')
                        // console.log(level);
                        if (level.indexOf("wxLevel_Att&Reg") != -1) {
                            defer.reject("wx_needRegister");
                            $ionicPopup.show({
                                title: "提示!",
                                template: "访问内容需要注册!",
                                cssClass: 'doubleBtnPopup text-center',
                                buttons: [{
                                    text: '返回',
                                    type: 'btnfor2',
                                    onTap: function (e) {
                                        return
                                    }
                                }, {
                                    text: '注册',
                                    type: 'btnfor2',
                                    onTap: function (e) {
                                        $state.go('subNav.register');
                                    }
                                }]
                            });
                        } else if (level.indexOf('wxLevel_AttOnly') != -1) {
                            defer.resolve("wx_noRegister");
                        }
                    }
                } else {
                    defer.reject("wx_needAttention");
                    $ionicPopup.show({
                        title: "提示!",
                        template: "您需要关注微信公众号才能访问!",
                        cssClass: 'doubleBtnPopup text-center',
                        buttons: [{
                            text: '返回',
                            type: 'btnfor2',
                            onTap: function (e) {
                                return
                            }
                        }, {
                            text: '现在关注',
                            type: 'btnfor2',
                            onTap: function (e) {
                                //弹出长按二维码关注公众号
                                $ionicPopup.show({
                                    title: "长按识别二维码",
                                    template: "<img width='100%' src='img/fastAttention.png'>",
                                    cssClass: 'noticePopup text-center',
                                    buttons: [{
                                        text: '返回',
                                        type: 'noticePopupBtn',
                                        onTap: function (e) {
                                            return
                                        }
                                    }]
                                });
                            }
                        }]
                    });
                }
                $ionicLoading.hide();
            }

            return defer.promise;
        }
    }])

})();