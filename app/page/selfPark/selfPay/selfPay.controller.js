/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-自助缴费-说明页-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('selfPayCtrl', ['$scope', '$state', '$getParkingFee','$ionicToast','$ionicLoading', function ($scope, $state, $getParkingFee,$ionicToast,$ionicLoading) {
            console.log("selfPayCtrl-说明页")

            /**
             * 点击扫码支付
             * */
            $scope.scannerBtn = function () {
                nativePlugin.scanQRCode(function (barCode) {
                    alert(JSON.stringify(barCode))
                    alert(JSON.stringify(barCode.resultStr))
                    //查找
                    $ionicLoading.show({template: "正在提交信息!"})
                    /**
                     * 由baCode查找停车信息
                     * */
                    $getParkingFee({
                        "ticketInfo": barCode.resultStr//停车小票扫码出来的信息
                    }).then(function (data) {
                        //成功
                        alert(JSON.stringify(data))
                        $state.go('subNav.selfPayToPay', data)
                    }, function (errText) {
                        //失败
                        $ionicToast.show("扫码失败," + errText)
                    }).finally(function () {
                        $ionicLoading.hide();
                    })
                });

                /**
                 * 测试
                 * */
                // $getParkingFee({
                //     "ticketInfo": ""//停车小票扫码出来的信息
                // }).then(function (result) {
                //     // alert(JSON.stringify(result))
                //     console.log(JSON.stringify(result))
                //     $state.go('subNav.selfPayToPay', {
                //         data: result
                //     })
                // }, function (errText) {
                //     $ionicToast.show("扫码失败," + errText)
                // }).finally(function () {
                //     $ionicLoading.hide();
                // })
            }


        }]);

})();