/**
 * Created by xiangsongtao on 16/3/16.
 * 我的服务-线上缴费记录-详情-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('tradeDetailCtrl', ['$scope', '$stateParams','$getParkingCouponInfo','$ionicLoading', function ($scope, $stateParams,$getParkingCouponInfo,$ionicLoading) {
            // console.log("tradeDetailCtrl");
            $scope.item = $stateParams.detail;
            // console.log($scope.item)
            // if(!$scope.item){
            //     $scope.item = {
            //         "id": 117,
            //         "custid": 261,
            //         "seqNumber": "123000678",
            //         "ticketNumber": "1234.1234.ssss",
            //         "couponAmount": null,
            //         "wechatAmount": 20,
            //         "alipayAmount": 30,
            //         "pointPayNum": 1000,
            //         "pointPayAmount": 20,
            //         "fullname": "向松涛",
            //         "entryTime": "2016-04-22 08:50:00",
            //         "paymentTime": "2016-06-16 15:45:58"
            //     }
            // }
            $ionicLoading.show({
                //返回按钮
                hideOnStateChange: true,
                template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                '<br>' +
                '<div style="margin-top:0.2rem">正在进入</div>'
            });
            $getParkingCouponInfo({
                "condition": {
                    "id":  $scope.item.id
                }
            }).then(function (couponList) {
                $scope.couponList = couponList;
            }).finally(function () {
                $ionicLoading.hide();
            });
        }]);
})();
