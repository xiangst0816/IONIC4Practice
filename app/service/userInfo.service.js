/**
 * Created by xiangsongtao on 16/4/14.
 * user 相关的services层
 */
(function () {
    angular.module('smartac.services')



        /**
         * 获取用户信息(微信和app通用), 已做缓存处理
         * */
        .factory("$getUserInfo", ['AJAX', 'api', '$q','$sessionStorage','$log','$ionicToast','$setShareContent', function (AJAX, api, $q,$sessionStorage,$log,$ionicToast,$setShareContent) {
            return function (options) {
                !angular.isObject(options) && (options = {});
                var defer = $q.defer();
                var userInfo = $sessionStorage.userInfo;
                //设定保存20秒,20s内有效
                if((userInfo)&&(!!userInfo.customerid)&&(((new Date().getTime() - parseInt(userInfo.time)) / 1000) < (20))){
                    defer.resolve(userInfo);
                    $log.debug("userInfo使用缓存数据!时间:" + ((new Date().getTime() - parseInt(userInfo.time)) / 1000) + "s");
                    return defer.promise;
                }
                $log.debug("userInfo使用最新数据!");
                var params = {
                    "method": "query",
                    "conditions": {
                        "customerid": "",//会员id	String	否
                        "mobile": "",//手机号码	String	否
                        "openid": "",//微信openid	String	否
                        "mac": "",//设备Mac	String	否
                        "custcardno": "",//会员卡号	String	否
                        "wechatcode": "",//微信code值	String	否
                        "accountid": ""//公众号	String	否
                    }
                };
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: angular.deepExtend(params, options),
                    success: function (data) {
                        if (data.code == "7001" && angular.isArray(data.members) && data.members.length) {
                            //设置时间戳
                            data.members[0].time = new Date().getTime();
                            //状态数据存储
                            $sessionStorage.userInfo = angular.copy(data.members[0]);
                            //设置分享内容
                            $setShareContent();
                            //返回数据
                            defer.resolve(data.members[0]);
                            $log.debug("获取用户信息成功");
                        } else {
                            $ionicToast.show("无法获取您的信息,请稍后再试!");
                            $log.debug("获取用户信息出错,"+data.code);
                            defer.reject("系统错误!");
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("无法获取您的信息,请稍后再试!");
                        $log.debug("获取用户信息出错,"+JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])

        /**
         * 用户信息更新
         * 执行$getUserInfo,同步更新到$sessionStorage中
         * */
        .factory("$updateUserInfo", ['AJAX', 'api', '$q','$getUserInfo','$sessionStorage','$log','$ionicToast', function (AJAX, api, $q,$getUserInfo,$sessionStorage,$log,$ionicToast){
            return function (options) {
                !angular.isObject(options) && (options = {});
                var defer = $q.defer();
                var params = {
                    "method": "update",
                    "customer": {
                        "customerid": "",
                        "photo": "",
                        "fullname": "",
                        "mobile": "",
                        "provincecode": "",
                        "citycode": "",
                        "address": "",
                        "birthday":"",
                        "haschildren": ""
                    }
                };
                AJAX({
                    url: api.customerUrl,
                    method: "post",
                    data: angular.deepExtend(params, options),
                    success: function (data) {
                        if (data.code == "7001") {
                            //获取最新数据
                            $sessionStorage.userInfo.time = 0;
                            $getUserInfo({
                                "conditions": {
                                    "customerid": params.customer.customerid.toString()
                                }
                            }).finally(function () {
                                defer.resolve();
                            })
                        } else {
                            $ionicToast.show("信息更新失败,请稍后再试!");
                            $log.debug("用户信息更新失败,code:"+data.code);
                            defer.reject(data.code)
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("信息更新失败,请稍后再试!");
                        $log.debug("用户信息更新失败,"+JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])
})();
