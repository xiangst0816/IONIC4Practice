/**
 * Created by xiangsongtao on 16/3/16.
 * 活动详情 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('activeDetailCtrl', ['$scope','$ionicHistory',function ($scope,$ionicHistory) {
            $scope.back = function () {
                $ionicHistory.goBack(-1);
            }
        }]);
})();
