/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券 detail-controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('couponDetailCtrl', ['$scope', 'AJAX', 'api', '$sessionStorage', '$stateParams', '$ionicPopover', '$timeout', '$rootScope', '$couponDetail','$ionicLoading', function ($scope, AJAX, api, $sessionStorage, $stateParams, $ionicPopover, $timeout, $rootScope, $couponDetail,$ionicLoading) {

            var couponid = $stateParams.couponid;
            var typecode = $stateParams.typecode;
            var statuscode = $stateParams.statuscode;
            var customerid = $stateParams.customerid;
            var code = $stateParams.code;
            console.log('$stateParams')
            console.log($stateParams.couponid)
            console.log($stateParams.typecode)
            console.log($stateParams.statuscode)
            console.log($stateParams.customerid)
            console.log($stateParams.code)

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


            $ionicLoading.show();
            $couponDetail({
                "conditions": {
                    "couponid": couponid,
                    "typecode":typecode
                }
            }).then(function (data) {
                data.status_code = statuscode;
                data.customer_id = customerid;
                data.code = code;
                console.log(data);

                $scope.item = data;
            }, function () {
                $timeout(function () {
                    $rootScope.goBack();
                }, 1300, false);
            }).finally(function () {
                $ionicLoading.hide();
            });


        }]);
})();
