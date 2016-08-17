/**
 * Created by xiangsongtao on 16/4/21.
 * code代码值查询service
 */
(function () {
    angular.module('smartac.page')
    /**
     * 获取code通用方法
     * "keyname": "share"(查询分享至朋友圈所获得分值)
     * "keyname": "pointreset"(积分清零日期)
     * "keyname": "cardupgrade"(查询分享至朋友圈所获得分值)
     *              {"keyname": "cardupgrade_0","keyvalue": "升普卡消费金额","keycode": "200"}
     *             {"keyname": "cardupgrade_1","keyvalue": "升为VIP卡消费金额","keycode": "5000"}
     * "keyname": "carddegrade"(获取会员等级的降级积分界限)
     * "keyname": "integralexchange4pk"(获取积分抵扣规则(满XXX积分可抵扣XXX元))
     *             {"keyname": "integralexchange_1","keyvalue": "停车抵扣所需积分数","keycode": "500"}
     *             {"keyname": "integralexchange_2","keyvalue": "停车抵扣积分等效金额","keycode": "10"}
     * "keyname": "int4parkcanuse"(会员停车最多可使用积分数)
     * "keyname": "parkpriceprehour"((每小时的停车费)
     *              "parkpayprehour"(每小时的停车费（元）)
     *              "parkintprehour"(每小时的停车费（积分)
     *
     *  cache: 是否将数据存到session中  || 使用缓存数据
     * */
        .factory("$getCode", ['AJAX', '$q','$log','$sessionStorage', function (AJAX, $q,$log,$sessionStorage) {
            return function (options,cache) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "search",
                    "keyname": ""
                };

                //数据合并
                angular.deepExtend(params, options);
                if(cache === 'cache' && !!$sessionStorage[params.keyname]){
                    $log.debug(`codeKeyName: ${params.keyname} 使用缓存数据!该字段缓存状态为: ${!!cache}`);
                    defer.resolve($sessionStorage[params.keyname]);
                    return defer.promise;
                }
                $log.debug(`codeKeyName: ${params.keyname} 使用数据库的数据! 该字段缓存状态为: ${!!cache}`);
                AJAX({
                    url: API.codeUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == "9200" && data.content.codeList.length > 0) {
                            //标志执行成功
                            $log.debug("查询:"+params.keyname+",返回正确结果");
                            //如果缓存字段为true,则缓存到session中
                            if(cache === 'cache'){
                                $sessionStorage[params.keyname] = data.content.codeList;
                            }
                            defer.resolve(data.content.codeList);
                        } else {
                            var errText;
                            switch(parseInt(data.code)){
                                case 9001:
                                    errText = "系统间通信异常!";
                                    break;
                                default:
                                    errText = "系统错误!";
                                    break;
                            }
                            $log.debug("查询:"+params.keyname+",失败");
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        $log.debug("查询:"+params.keyname+",失败");
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])
})();
