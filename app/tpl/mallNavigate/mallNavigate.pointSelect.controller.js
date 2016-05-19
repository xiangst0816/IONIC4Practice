/**
 * Created by xiangsongtao on 16/3/16.
 * 商场导航-路径选择 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('mallNavigatePointCtrl', ['$scope','$ionicToast', function ($scope, $ionicToast) {
            $scope.demo = function () {
                $ionicToast.show("此功能未开放,抱歉!");
            }


        }]);
})();
