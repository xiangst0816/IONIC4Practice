/**
 * Created by xiangsongtao on 16/4/14.
 * 积分 相关的services层
 */
(function () {
    angular.module('smartac.page')


        /**
         * 获得个人积分信息
         * (状态数据->设置缓存期限30s+localStorage存储+预先写死当前用户 5.4)
         * */
        .factory("$integralInfo", ['AJAX', 'api', '$q','$sessionStorage','$log','$ionicToast', function (AJAX, api, $q,$sessionStorage,$log,$ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {options = {};}
                var defer = $q.defer();
                var integralInfo = $sessionStorage.integralInfo;
                //设定保存30秒,30s内有效
                if((integralInfo)&&(((new Date().getTime() - parseInt(integralInfo.time)) / 1000) < (30))){
                    defer.resolve(integralInfo);
                    $log.debug("$integralInfo使用缓存数据");
                    return defer.promise;
                }
                var params = {
                    "method": "getCustPointMain",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.pointUrl,
                    method: 'post',
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            //设置时间戳
                            data.content.time = new Date().getTime();

                            //状态数据存储
                            $sessionStorage.integralInfo = angular.copy(data.content);
                            $log.debug("$integralInfo使用服务器数据");
                            //返回数据
                            defer.resolve(data.content);
                        } else {
                            $log.debug("$integralInfo获取失败:"+data.code);
                            $ionicToast.show("服务异常,请稍后再试!");
                            defer.reject(data.code);
                        }
                    },
                    error: function (errText) {
                        $ionicToast.show("服务异常,请稍后再试!");
                        $log.debug("$integralInf获取失败:"+errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            };
        }])


        /**
         * 增加积分接口
         * */
        .factory("$addIntegral", ['AJAX', 'api', '$q', function (AJAX, api, $q) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "addPoint",
                    "points": {
                        "addednum":"",
                        "custid":"",
                        "typeid":1,//积分增加
                        "channelcode":"",//11奖赏引擎
                        "remark":""//分享获得积分
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    url: api.pointUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if(data && data.content){
                            defer.resolve(data.content);
                        }else{
                            defer.reject("系统错误!");
                        }
                    },
                    error: function () {
                        defer.reject("系统错误!")
                    }
                });
                return defer.promise;
            }
        }])
})();