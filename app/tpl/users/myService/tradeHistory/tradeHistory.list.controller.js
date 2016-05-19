/**
 * Created by xiangsongtao on 16/3/16.
 * 我的服务-线上缴费记录-controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('tradeListCtrl', ['$scope','$getTradeHistory','$ionicToast','$sessionStorage',function ($scope,$getTradeHistory,$ionicToast,$sessionStorage) {

            console.log("获取线上缴费记录")
            /**
             * 获取线上缴费记录
             * */
            $scope.dataToDisplay;

            getTradeHistory();

            function getTradeHistory(){
                return $getTradeHistory({
                    "condition": {
                        "custid": $sessionStorage.userInfo.customerid
                    }
                }).then(function (data) {
                    console.log('queryPayment')
                    console.log(data);
                    $scope.dataToDisplay = data;
                },function (errText) {
                    $ionicToast.show("获取线上缴费记录失败," + errText)
                })
            }


        }]);
})();
