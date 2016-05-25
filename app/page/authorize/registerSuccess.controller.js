/**
 * Created by xiangsongtao on 16/3/16.
 * 注册成功 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('registerSuccessCtrl', ['$scope', '$timeout', '$ionicNavBarDelegate', '$ionicBackdrop', '$setShareContent', function ($scope, $timeout, $ionicNavBarDelegate, $ionicBackdrop, $setShareContent) {
            //注册成功后不显示返回按钮
            $ionicNavBarDelegate.showBackButton(false);

            /**
             * 点击分享按钮,微信和app操作不同
             * */
            $scope.shareBtn = function () {
                //设置分享
                $setShareContent({
                    title: "成为怡丰城会员,尽享更多礼遇!",
                    desc: "分享后引导进入注册页面",
                    imgUrl: "http://vivocity.smartac.co:82/img/other/default.png",
                    type: "link",
                    dataUrl: ""
                }, "subNav.register", null);
            };
        }]);
})();
