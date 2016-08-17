/**
 * Created by xiangsongtao on 16/4/16.
 * 店铺 相关的services层
 */
(function () {
    angular.module('smartac.page')
        /**
         * 店铺收藏操作
         * */
        .factory("$shopCollect", ['AJAX', '$q', '$checkAuthorize', '$sessionStorage', '$ionicToast','$log', function (AJAX, $q, $checkAuthorize, $sessionStorage, $ionicToast,$log) {
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
                        url: API.customerUrl,
                        data: params,
                        success: function (data) {
                            if (data.code == 7001) {
                                if (type == 1) {
                                    $target.addClass("collected");
                                    //更改item的字段
                                    item.iscollect = 1;
                                    // $ionicToast.show("收藏成功!");
                                    $log.debug("收藏成功!");
                                } else {
                                    $target.removeClass("collected");
                                    //更改item的字段
                                    item.iscollect = 0;
                                    $log.debug("已取消收藏!");
                                    // $ionicToast.show("已取消收藏!");
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
})();
