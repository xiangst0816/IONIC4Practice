/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-自助缴费-说明页-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('selfPayCtrl', ['$scope', '$state', '$getParkingFee', '$ionicToast', '$ionicLoading', function ($scope, $state, $getParkingFee, $ionicToast, $ionicLoading) {
            console.log("selfPayCtrl-说明页")


            /**
             * 点击扫码支付
             * */
            $scope.scannerBtn = function () {


                nativePlugin.scanBARCode(function (a) {
                    // alert(JSON.stringify(a));
                    var barCode = a.split(',')[1];
                    // alert(JSON.stringify(barCode));
                    //查找
                    $ionicLoading.show({template: "正在提交信息!"})
                    /**
                     * 由baCode查找停车信息
                     * */
                    $getParkingFee({
                        "ticketInfo": barCode//停车小票扫码出来的信息
                    }).then(function (result) {
                        // alert(JSON.stringify(result));
                        if(parseInt(result.price) === 0){
                            $ionicToast.show("支付金额为0元,无需支付!");
                        }else{
                            $state.go('subNav.selfPayToPay', {
                                data: result
                            })
                        }
                    }, function (errText) {
                        $ionicToast.show("扫码失败," + errText)
                    }).finally(function () {
                        $ionicLoading.hide();
                    })
                });

                /**
                 * 测试
                 * */
                if (Internal.isInDesktop) {
                    // 假数据
                    $state.go('subNav.selfPayToPay', {
                        data: {
                            discount: 5,
                            entryTime: "2016-04-22 08:50",
                            paymentNumber: 1,
                            price: 20,
                            seqNumber: "123000678",
                            ticketNumber: "1234.1234.ssss",
                            time: 20
                        }
                    })
                }
            }
        }]);

})();