/**
 * Created by xiangsongtao on 16/3/16.
 * 商场导航 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('mallNavigateCtrl', ['$scope', '$ionicToast', function ($scope, $ionicToast) {
            $scope.demo = function () {
                $ionicToast.show("此功能未开放,抱歉!");
            }


            // $scope.clickDemo = function () {
            //     var src = angular.element(document.getElementById('demoImg')).prop('src');
            //     if(src.indexOf('detail-1') != -1){
            //         angular.element(document.getElementById('demoImg')).prop('src', `img/mallNavigate/detail-2.png`);
            //     }else{
            //         angular.element(document.getElementById('demoImg')).prop('src', `img/mallNavigate/detail-1.png`);
            //     }
            // }


        }]);
})();
