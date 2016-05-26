/**
 * Created by xiangsongtao on 16/4/21.
 * 鉴权相关->登录,验证码,注册
 */
(function () {
    angular.module('smartac.page')

    /**
     * 手机验证码
     * */
        .factory("$getVerifyCode", ['AJAX', 'api', '$q', '$log', '$ionicToast', function (AJAX, api, $q, $log, $ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "mobileVerifyCode",
                    "mobile": "",
                    "type": "" //0注册 1 忘记密码
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //成功返回
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            defer.reject(data.code);
                            $ionicToast.show('发送失败，请重试!');
                            $log.debug('发送失败，请重试!' + data.code);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $ionicToast.show('发送失败，请重试!');
                        $log.debug('发送失败，请重试!' + JSON.stringify(errText));
                    }
                });
                return defer.promise;
            }
        }])


        /**
         * 登录
         * */
        .factory("$login", ['AJAX', 'api', '$q', '$log', '$ionicToast', function (AJAX, api, $q, $log, $ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": 'login',
                    "conditions": {
                        "mobile": "",
                        "password": ""
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //成功返回
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            $ionicToast.show("登录失败,请稍后再试!");
                            $log.debug("登录失败,返回code:" + data.code);
                            defer.reject(data.code)
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("登录失败,请稍后再试!");
                        $log.debug("登录失败,系统错误," + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

        /**
         * 注册
         * */
        .factory("$register", ['AJAX', 'api', '$q', '$log', '$ionicToast', '$rootScope', function (AJAX, api, $q, $log, $ionicToast, $rootScope) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "create",
                    "customer": {
                        "channelcode": "",  // channelcode 代表来源，目前5：app，  1：微信，  2：Portal
                        "channel": {
                            "validatecode": "",//验证码
                            "mobile": "",
                            "password": "",
                            "orgid": "",//商场id
                            "openid": "",//用户openid
                            "accountid": "",//cfid(和微信公众号还不太一样)
                            "mac": "",//mac地址
                            "deviceid":""//设备id,获取设备推送的令牌
                        }
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //成功返回
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 8001:
                                    errText = "验证码错误!";
                                    break;
                                case 8002:
                                    errText = "您已注册，请直接登录!";
                                    if (window.history.length == 2) {
                                        window.location.replace(window.document.location.href.split('#')[0].toString() + '#/subNav/login');
                                    } else {
                                        $rootScope.goBack();
                                    }
                                    break;
                                default:
                                    errText = "系统异常,请稍后重试!";
                                    break;
                            }
                            $ionicToast.show(errText);
                            $log.debug("注册失败:" + data.code);
                            defer.reject(data.code);
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("系统异常,请稍后重试!");
                        $log.debug("注册失败:" + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

        /**
         * 会员验证(修改密码时会用到)
         * */
        .factory("$customerValidate", ['AJAX', 'api', '$q', '$log','$ionicToast', function (AJAX, api, $q, $log,$ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "customerValidate",
                    "validatecode": "",
                    "mobile": "",
                    "typecode": ""//1 忘记密码重置 2 登录上限错误验证码/验证码登录
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //成功返回
                        if (data.code == 7001) {
                            if(!!data.content){
                                //返回用户custid
                                defer.resolve(data.content);
                            }else{
                                var errText = "验证码或手机号码错误,请检查";
                                $ionicToast.show(errText);
                                defer.reject(errText);
                                $log.debug("会员验证错误," + errText);
                            }
                        } else {
                            var errText;
                            switch (data.code) {
                                // case 8012:
                                //     errText = "验证码或手机号码错误,请检查";
                                //     break;
                                default:
                                    errText = "系统错误,请稍后再试";
                                    break;
                            }
                            $ionicToast.show(errText);
                            $log.debug("会员验证错误:" + data.code);
                            defer.reject(errText)
                        }
                    },
                    error: function (errText) {
                        $log.debug("会员验证错误:" + errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

        /**
         * 修改密码changePassword
         * */
        .factory("$changePassword", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "changePassword",
                    "customerid": "",
                    "newpassword": "",
                    "validatecode": ""
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        //成功返回
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                        } else {
                            $ionicToast.show('密码修改失败!');
                            $log.debug('密码修改失败:'+data.code);
                            defer.reject(data.code)
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

