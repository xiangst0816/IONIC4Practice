/**
 * Created by xiangsongtao on 16/3/16.
 * 注册成功 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('registerSuccessCtrl', ['$scope', '$timeout', '$ionicNavBarDelegate', '$ionicBackdrop', function ($scope, $timeout, $ionicNavBarDelegate, $ionicBackdrop) {
            //注册成功后不显示返回按钮
            $ionicNavBarDelegate.showBackButton(false);

            /**
             * 点击分享按钮,微信和app操作不同
             * */
            $scope.shareBtn = function () {
                if (Internal.isInWeiXin) {
                    $ionicBackdrop.retain();
                    angular.element(document.getElementById('showShareDark')).addClass('action');
                } else if (Internal.isInApp) {
                    alert("在app中分享")
                }
            };
            /**
             * 点击分享图片消失提示
             * */
            document.getElementById('showShareDark').addEventListener("touchstart", function () {
                $ionicBackdrop.release();
                angular.element(document.getElementById('showShareDark')).removeClass('action');
                // $miniDOM.removeClass(document.getElementById('showShareDark'), "action");
            })

        }]);
})();
