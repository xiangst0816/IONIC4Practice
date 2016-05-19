/**
 * Created by xiangsongtao on 16/4/16.
 * 店铺 相关的services层
 */
(function () {
    angular.module('smartac.services')
        /**
         * 查询店铺列表(all),options为发送的参数,返回promise
         * */
        .factory("$shopList", ['AJAX', 'api', '$q', '$ionicToast', '$log', function (AJAX, api, $q, $ionicToast, $log) {

            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                // alert(custid)
                var params = {
                    "method": "query",
                    "conditions": {
                        "orgid": "",
                        "shopid": "",
                        "custid": null,
                        "industryname": "",
                        "industryid": null,
                        "shopname": "",
                        "floor": null,
                        "page": {
                            "index": 1,
                            "num": 20
                        },
                        "sort": {
                            "column": "name",
                            "type": "asc"
                        }
                    }
                };
                //数据合并 
                angular.deepExtend(params, options);
                console.log(params)
                AJAX({
                    url: api.shopUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                            console.log(data.content)
                            $log.debug("商铺列表获取成功,数据:" + data.content.length + "条")
                        } else {
                            defer.resolve([]);
                            $ionicToast.show("获取商户列表失败,稍后再试!");
                            $log.debug("商铺列表获取失败," + data.code);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $log.debug("商铺列表获取失败" + errText)
                    }
                });
                return defer.promise;
            }
        }])


        /**
         * 查询用户收藏的店铺列表(users),options为发送的参数,返回promise
         * */
        .factory("$userCollectedShopList", ['AJAX', 'api', '$q', '$sessionStorage', '$log', function (AJAX, api, $q, $sessionStorage, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "queryCollection",
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    method: "post",
                    url: api.customerUrl,
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            defer.resolve(data.content);
                            $log.debug("$userCollectedShopList获取成功,共" + data.content.length + "条")
                        } else {
                            // console.log(data);
                            defer.reject("请稍后再试!");
                            $log.debug("$userCollectedShopList获取失败");
                        }
                    },
                    error: function (errText) {
                        $log.debug("$userCollectedShopList获取失败," + errText);
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])


        /**
         * 店铺收藏操作
         * */
        .factory("$shopCollect", ['AJAX', 'api', '$q', '$checkAuthorize', '$sessionStorage', '$ionicToast', function (AJAX, api, $q, $checkAuthorize, $sessionStorage, $ionicToast) {
            return function ($target, item) {
                var defer = $q.defer();
                $checkAuthorize("wxLevel_AttOnly").then(function () {
                    var shopID = item.shopid;
                    var type;
                    // console.log($target)
                    if ($target.hasClass("collected")) {
                        type = 2;
                    } else {
                        type = 1;
                    }
                    var params = {
                        "method": "collectShop",
                        "detail": {
                            "custid": $sessionStorage.userInfo.customerid,
                            "shopid": shopID,
                            "type": type
                        }
                    };
                    AJAX({
                        method: "post",
                        url: api.customerUrl,
                        data: params,
                        success: function (data) {
                            if (data.code == 7001) {
                                if (type == 1) {
                                    $target.addClass("collected");
                                    //更改item的字段
                                    item.iscollect = 1;
                                    $ionicToast.show("收藏成功!");
                                } else {
                                    $target.removeClass("collected");
                                    //更改item的字段
                                    item.iscollect = 0;
                                    $ionicToast.show("已取消收藏!");
                                }
                                defer.resolve();
                            } else {
                                $ionicToast.show("收藏出错,请稍后再试!")
                                defer.reject();
                            }
                        },
                        error: function () {
                            $ionicToast.show("收藏出错,请稍后再试!")
                            defer.reject();
                        }
                    });
                });
                return defer.promise;
            }
        }])

        /**
         * 获取楼层信息,当次访问有效$sessionStorage
         * */
        .factory("$shopFloor", ['AJAX', 'api', '$q', '$quickSort', 'baseInfo', '$sessionStorage', '$log','$ionicToast', function (AJAX, api, $q, $quickSort, baseInfo, $sessionStorage, $log,$ionicToast) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                //如果存在数据则返回数据
                var floorInfo = $sessionStorage.floorInfo;

                //设定保存20秒,20s内有效
                if((floorInfo)&&(((new Date().getTime() - parseInt(floorInfo.time)) / 1000) < (20))){
                    defer.resolve(floorInfo.data);
                    $log.debug("floorInfo使用缓存数据!时间:" + ((new Date().getTime() - parseInt(floorInfo.time)) / 1000) + "s");
                    return defer.promise;
                }

                $log.debug("获取floorInfo的最新数据!");
                var params = {
                    "method": "queryFloor",
                    "conditions": {
                        "orgid": baseInfo.orgid
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    method: "post",
                    url: api.shopUrl,
                    data: params,
                    success: function (data) {
                        if (data.code == 7001) {
                            var result = data.content;
                            /**
                             * floorArr,使用在选择楼层的商铺页面
                             * 数据格式:
                             * {
                     *      name:"B1",
                     *      code:"-1"
                     * }
                             * */
                            var floorArr = {
                                data:[],
                                time:0
                            };
                            //data排序,floor字段
                            result = $quickSort(result, 'asc', 'floor');
                            //数据提取
                            angular.forEach(result, function (element) {
                                floorArr.data.push({
                                    name: element.name,
                                    code: element.floor
                                })
                            });
                            floorArr.time = new Date().getTime();
                            $sessionStorage.floorInfo = floorArr;
                            defer.resolve(floorArr.data);
                            $log.debug("获取楼层信息成功,共" + floorArr.data.length + "条");
                        } else {
                            defer.resolve(false);
                            $ionicToast.show("获取楼层信息出错,请稍后再试!")
                            $log.debug("获取楼层信息失败," + data.code);
                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $ionicToast.show("获取楼层信息出错,请稍后再试!")
                        $log.debug("获取楼层信息失败" + errText);
                    }
                });
                return defer.promise;
            }

        }])
})();
