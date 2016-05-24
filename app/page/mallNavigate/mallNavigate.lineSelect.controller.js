/**
 * Created by xiangsongtao on 16/3/16.
 * 商场导航-路径选择 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('mallNavigateLineCtrl', ['$scope','$ionicToast', function ($scope, $ionicToast) {

            $scope.demo = function () {
                $ionicToast.show("此功能未开放,抱歉!");
            }

            $scope.active = false;
            $scope.status = 2;
            $scope.youxianSelect = function (data) {

                if($scope.status == data){
                    return
                }
                $scope.status = data;
                console.log("当前选择:"+$scope.status)
            }

        }]);
})();
