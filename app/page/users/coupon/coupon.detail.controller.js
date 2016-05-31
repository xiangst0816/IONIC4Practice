/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券 detail-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('couponDetailCtrl', ['$scope', '$stateParams', '$timeout', '$rootScope', function ($scope, $stateParams, $timeout, $rootScope) {
            $scope.item= $stateParams.detail;
            //为空则后退
            if(!$scope.item){
                $timeout(function () {
                    $rootScope.goBack();
                }, 1300, false);
                return
            }
            console.log($stateParams.detail);
        }]);
})();
