/**
 * Created by xiangsongtao on 16/3/16.
 * 用户的预定信息 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('userBookCtrl', ['$scope', '$ionicSlideBoxDelegate', function ($scope, $ionicSlideBoxDelegate) {
            $scope.status = 0;
            $scope.onSlideChange = function ($index) {
                //切换上部tab
                $scope.status = $index;
            };
            $scope.changeTo = function ($index) {
                $scope.status = $index;
                $ionicSlideBoxDelegate.$getByHandle('useBookSlide').slide($index);
            }


        }]);
})();
