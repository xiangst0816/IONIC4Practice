/**
 * Created by xiangsongtao on 16/3/16.
 * 注册成功 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('registerSuccessCtrl', ['$scope', '$timeout', '$ionicNavBarDelegate', '$ionicBackdrop', '$setShareContent','$getCode', function ($scope, $timeout, $ionicNavBarDelegate, $ionicBackdrop, $setShareContent,$getCode) {
            //注册成功后不显示返回按钮
            $ionicNavBarDelegate.showBackButton(false);

            /**
             * 给分享人加分
             * */
            $scope.shareIntegral;
            $getCode({
                "keyname": "shareGetIntegral"
            }).then(function (data) {
                $scope.shareIntegral = data[0].keycode;
            }, function (err) {
                $log.debug("分享获得积分值的规则获取失败,请检查code->shareGetIntegral," + err);
            });

            /**
             * 点击分享按钮,微信和app操作不同
             * */
            $scope.shareBtn = function () {
                //设置分享
                $setShareContent({
                    title: "成为怡丰城会员,尽享更多礼遇!",
                    desc: "分享后引导进入注册页面",
                    imgUrl: "http://vivocity.smartac.co:82/img/home/default.png",
                    type: "link",
                    dataUrl: ""
                }, "subNav.register", null);
            };

            // $scope.registerReward = 50;
            $scope.registerReward = BASE.registerReward;
        }]);
})();
