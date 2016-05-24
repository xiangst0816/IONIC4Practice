/**
 * Created by xiangsongtao on 16/3/16.
 * 商场导航 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('mallNavigateCtrl', ['$scope','$ionicToast', function ($scope, $ionicToast) {
            $scope.demo = function () {
                $ionicToast.show("此功能未开放,抱歉!");
            }
        }]);
})();
