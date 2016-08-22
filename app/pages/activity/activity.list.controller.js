/**
 * Created by xiangsongtao on 16/3/16.
 * 活动列表 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('activitiesCtrl', ['$scope','$ionicSlideBoxDelegate',function ($scope,$ionicSlideBoxDelegate) {
            $scope.status = 0;
            // console.log("activitiesCtrl")


            // $scope.test = {
            //     "2016":"asdfasdfsd"
            // }
            // console.log( $scope.test)

            $scope.status = 0;
            $scope.onSlideChange = function ($index) {
                //切换上部tab
                $scope.status = $index;
            };
            $scope.changeTo = function ($index) {
                $scope.status = $index;
                $ionicSlideBoxDelegate.$getByHandle('activitySlide').slide($index);
            }


        }]);
})();
