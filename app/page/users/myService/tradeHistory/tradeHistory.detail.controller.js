/**
 * Created by xiangsongtao on 16/3/16.
 * 我的服务-线上缴费记录-详情-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('tradeDetailCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
            // console.log("tradeDetailCtrl");
            $scope.item = $stateParams.detail;
            console.log( $scope.item);




        }]);
})();
