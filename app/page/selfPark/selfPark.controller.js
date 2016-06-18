/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-controller
 */
(function () {
    // angular.module('selfPark.controllers', ['selfPark.service']);
    angular.module('smartac.page')
        .controller('selfParkCtrl', ['$scope', '$ionicModal', '$getTotalSpaceNum', '$getFreeSpaceNum', '$getCode', '$q', '$ionicLoading', '$ionicToast', '$goBackWhenError','$checkAuthorize','$state', function ($scope, $ionicModal, $getTotalSpaceNum, $getFreeSpaceNum, $getCode, $q, $ionicLoading, $ionicToast, $goBackWhenError,$checkAuthorize,$state) {
            // alert("selfParkCtrl")

            /**
             * 缴费详情
             * */
            $scope.parkBtn = function () {
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            $ionicModal.fromTemplateUrl('my-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            /**
             * 进入自助缴费需要鉴权(需要关注需要注册)
             * */
            $scope.enterSelfPay4Parking = function () {
                $checkAuthorize("wxLevel_Att&Reg").then(function () {
                    $state.go("subNav.selfPay");
                })
            };



            /**
             * 获取显示的条件
             * */
            $ionicLoading.show();
            $q.all([
                // getTotalSpaceNum(),
                // getFreeSpaceNum(),
                getLimitIntInfo(),
                getLimitIntInfo(),
                getFeePreHour()
            ]).then(function (data) {

            }, function (err) {
                $ionicToast.show("服务器错误,请稍后再试!")
                // $goBackWhenError();
            }).finally(function () {
                $ionicLoading.hide();
            });


            //////////////////////////////////////////////
            /**
             * 获得总车位
             * */
            function getTotalSpaceNum() {
                return $getTotalSpaceNum().then(function (totalSpaceNum) {
                    $scope.totalSpaceNum = totalSpaceNum;
                });
            }


            /**
             * 查询空余车位数量
             * */
            function getFreeSpaceNum() {
                return $getFreeSpaceNum().then(function (freeSpaceNum) {
                    $scope.freeSpaceNum = freeSpaceNum;
                });
            }


            /**
             * 获得会员停车最多可使用积分数
             * */
            function getLimitIntInfo() {
                return $getCode({
                    "keyname": "int4parkcanuse"
                }).then(function (data) {
                    $scope.limitIntegral = data[0].keycode
                }, function (err) {

                });
            }


            /**
             * 每小时的停车费
             * */
            function getFeePreHour() {
                return $getCode({
                    "keyname": "parkpriceprehour"
                }).then(function (data) {
                    angular.forEach(data, function (value) {
                        if (value.keyname == "parkpayprehour") {
                            $scope.feePreHour = Number.parseFloat(value.keycode).toFixed(2);
                        } else if (value.keyname == "parkintprehour") {
                            $scope.intPreHour = Number.parseFloat(value.keycode);
                        }
                    });
                })
            }

        }]);



})();
