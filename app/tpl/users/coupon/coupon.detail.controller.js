/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券 detail-controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('couponDetailCtrl', ['$scope','AJAX','api','$sessionStorage','$stateParams','$ionicPopover', function ($scope,AJAX,api,$sessionStorage,$stateParams,$ionicPopover) {
            $scope.item = $stateParams.detail;
            console.log($stateParams.detail)

            /**
             * 优惠券立即使用 usedNow
             * */
            $scope.usedNow = function (code) {
                // console.log(code)
                $scope.useGougon4Code = code;
                $scope.useGougon4CodeImg = api.generateQrcodeUrl + api.scancodeVerificationUrl + code;
                $scope.popover.show();
            };

            $ionicPopover.fromTemplateUrl('tpl/useGoupon.comp.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

        }]);
})();
