/**
 * Created by xiangsongtao on 16/4/9.
 * 我的积分-积分商城-详情 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('integralMallDetailCtrl', ['$scope','$stateParams','$couponDetail','$ionicLoading','$timeout','$rootScope','$log', function ($scope,$stateParams,$couponDetail,$ionicLoading,$timeout,$rootScope,$log) {
            var couponid = $stateParams.couponid;
            var typecode = $stateParams.typecode;
            $log.debug('$stateParams')
            $log.debug("couponid:"+couponid);
            $log.debug("typecode:"+typecode);

            $ionicLoading.show();
            $couponDetail({
                "conditions": {
                    "couponid": couponid,
                    "typecode":typecode
                }
            }).then(function (data) {
                // $log.debug(JSON.stringify(data))
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