/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-自助缴费-缴费-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('selfPayToPayCtrl',
            ['$scope', '$state', '$stateParams', '$filter', '$integralInfo', '$sessionStorage', '$getCode', '$ionicLoading', '$payForParking', '$ionicToast', '$timeout', '$effectiveCouponList', '$q', '$ionicScrollDelegate', '$goBackWhenError','$rootScope',
                function ($scope, $state, $stateParams, $filter, $integralInfo, $sessionStorage, $getCode, $ionicLoading, $payForParking, $ionicToast, $timeout, $effectiveCouponList, $q, $ionicScrollDelegate, $goBackWhenError,$rootScope) {
                    //选择微信支付
                    $scope.wxSelected = false;
                    $scope.selectWXToPay = function () {
                        $scope.wxSelected = !$scope.wxSelected;
                        $scope.zfbSelected = false;
                        calculate();
                    };
                    // 选择支付宝支付
                    $scope.zfbSelected = false;
                    $scope.selectZFBToPay = function () {
                        $scope.wxSelected = false;
                        $scope.zfbSelected = !$scope.zfbSelected;
                        calculate();
                    };


                    var payInfo = $stateParams.data;
                    // 假数据
                    var payInfo = {
                        discount: 5,
                        entryTime: "2016-04-22 08:50",
                        paymentNumber: 1,
                        price: 7000,
                        seqNumber: "123000678",
                        ticketNumber: "1234.1234.1234",
                        time: 20
                    };
                    //数据增补
                    var payInfo_otherInfo = {
                        entryTime: $filter('yyyyMMdd_HHmmss_minus')(payInfo.entryTime),
                        nowTime: $filter('yyyyMMdd_HHmmss_minus')(new Date()),
                        price: parseFloat(payInfo.price) - parseFloat(payInfo.discount),
                        finalPrice: ""
                    };
                    //对象更新
                    angular.extend(payInfo, payInfo_otherInfo);
                    //更新view
                    $scope.payInfo = payInfo;
                    // 可用积分
                    $scope.integralCanUse;
                    //积分抵扣信息(满XXX积分可抵扣XXX元)
                    $scope.needIntegral;
                    $scope.relatedMoney;

                    //可用卡券列表
                    $scope.finnalCouponArr = [];

                    //停车最多可兑换的积分数
                    var limitIntegral;

                    /**
                     * 页面初始化逻辑
                     * 1. 获得积分抵扣规则
                     * 2. 获得可用卡券
                     * 3. 获取当前积分对象
                     * */
                    $q.all([
                            getRelatedCoupon(payInfo.price),
                            getExchangeCode(),
                            integralInfo(),
                            getLimitIntInfo()])
                        .then(function () {
                            //计算积分数
                            calculate();
                        }, function (err) {
                            $goBackWhenError()
                        });


                    /**
                     * 显示停车的卡券列表
                     * */
                    $scope.showParkingCoupon = function () {
                        if (!$scope.finnalCouponArr.length) {
                            $ionicToast.show("暂无卡券可用!")
                            return false
                        }

                        //激活dom
                        var $couponItem = angular.element(document.getElementById('couponItem'));
                        if ($couponItem.hasClass('active')) {
                            $couponItem.removeClass("active")
                        } else {
                            $couponItem.addClass("active")
                        }
                        $ionicScrollDelegate.resize();
                    };


                    /**
                     * 点击选择卡券
                     * */
                    $scope.selectedCouponValue = 0;
                    var selectCoupon;
                    $scope.selectParkingCoupon = function ($event, coupon) {
                        var $couponList_i = angular.element(document.querySelectorAll('.couponList i'));
                        //如果选择之前的那个,即再次点击取消选择
                        if (selectCoupon == coupon) {
                            $scope.selectedCouponValue = 0;
                            selectCoupon = {};
                            //全部取消
                            $couponList_i.removeClass("icon-select");
                        } else {
                            $scope.selectedCouponValue = coupon.face_value;
                            selectCoupon = coupon;
                            //全部取消
                            $couponList_i.removeClass("icon-select")
                            //选择当前
                            angular.element($event.target).find("i").addClass("icon-select")
                        }
                        calculate();
                    };


                    /**
                     * 确认支付按钮
                     * */
                    $scope.confirmToPay = function () {
                        if ($scope.finalPrice && !$scope.wxSelected) {
                            $ionicToast.show("请选择余额支付方式!")
                            return
                        }
                        $ionicLoading.show({template: "正在支付"});
                        $payForParking({
                            "paymentInfo": {
                                "custid": 25,
                                "seqNumber": "123000678",
                                "ticketNumber": "1234.1234.1234",
                                "couponid": 1211,//优惠券id
                                "couponAmount": 5,// 优惠券支付金额
                                "wechatAmount": 10,//微信支付金额
                                "alipayAmount": 0,//支付宝支付金额
                                "pointPayNum": 500,//积分支付的积分数量
                                "pointPayAmount": 5//积分支付的抵扣金额
                            }
                        }).then(function (data) {
                            $timeout(function () {
                                $ionicToast.show("支付成功!")

                                $timeout(function () {
                                    $rootScope.goBack(2)
                                    // history.go(-2)
                                }, 700, false);

                            }, 1000, false);

                        }, function (errText) {
                            $ionicToast.show("支付失败," + errText);
                        }).finally(function () {
                            $timeout(function () {
                                $ionicLoading.hide();
                            }, 700)
                        })
                    }


                    /**
                     * 费用计算
                     * */
                    function calculate() {
                        //使用的积分数
                        $scope.integralUsed = 0;
                        //计算最终价格
                        $scope.finalPrice = parseFloat(payInfo.price) - parseFloat($scope.selectedCouponValue);
                        //用户最终可用积分数
                        var finalIntegral = parseInt($scope.integralCanUse);
                        while ($scope.finalPrice > 0) {
                            if ((finalIntegral > $scope.needIntegral) && (($scope.integralUsed + $scope.needIntegral) < limitIntegral)) {
                                $scope.finalPrice = $scope.finalPrice - parseFloat($scope.relatedMoney);
                                $scope.integralUsed += $scope.needIntegral;
                                finalIntegral -= $scope.needIntegral;
                            } else {
                                //积分不够兑换
                                break;
                            }
                        }
                        // console.log($scope.finalPrice)
                        if ($scope.finalPrice < 0) {
                            $scope.finalPrice = 0;
                            $scope.wxSelected = false;
                            $scope.zfbSelected = false;
                        }
//积分兑换的钱数
                        $scope.exchengedMoney = ($scope.integralUsed / $scope.needIntegral) * $scope.relatedMoney;
                        // console.log($scope.finalPrice)
                        // console.log($scope.integralUsed)
                        //
                        // console.log($scope.integralCanUse)
                        // console.log($scope.exchengedMoney)
                        // console.log(finalIntegral)
                    }

                    /**
                     * 获取当前积分对象
                     * */
                    function integralInfo() {
                        return $integralInfo({
                            "method": "getCustPointMain",
                            "conditions": {
                                "custid": $sessionStorage.userInfo.customerid
                            }
                        }).then(function (data) {
                            $scope.integralCanUse = data.currenttotalnum;
                        }, function (errText) {
                            $ionicToast.show("积分查询失败," + errText)
                        }).finally(function () {

                        })
                    }

                    /**
                     * 获取积分抵扣信息(满XXX积分可抵扣XXX元)
                     * */
                    function getExchangeCode() {
                        return $getCode({
                            "keyname": "integralexchange4pk"
                        }).then(function (data) {
                            angular.forEach(data, function (value) {
                                if (value.keyname == "integralexchange_1") {
                                    $scope.needIntegral = parseInt(value.keycode);
                                }
                                if (value.keyname == "integralexchange_2") {
                                    $scope.relatedMoney = parseFloat(value.keycode).toFixed(2);
                                }
                            });
                        }, function (errText) {
                            $ionicToast.show("获取积分抵扣信息失败," + errText)
                        })
                    }

                    /**
                     * 获取能抵扣的电子卡券(抵用券)
                     * 抵用券有最低 抵用金额,如果传入数小于抵用金额则此卡不可用
                     * @params:fee 传入金额
                     * */
                    function getRelatedCoupon(fee) {
                        return $effectiveCouponList({
                            "conditions": {
                                "custid": $sessionStorage.userInfo.customerid.toString(),
                                "categorycode": "2",//2,抵扣券;3,现金券
                                "querytype": "main",
                                "page": {
                                    "index": 1,
                                    "num": 999
                                },
                                "sort": {
                                    "column": "point",
                                    "type": "desc"
                                }
                            }
                        }).then(function (data) {
                            var finnalCouponArr = [];
                            angular.forEach(data, function (obj) {
                                //满XX可用
                                // console.log(obj.limit_fee)
                                if (fee > obj.limit_fee) {
                                    this.push(obj)
                                }
                            }, finnalCouponArr);
                            // console.log(data);
                            // console.log(finnalCouponArr);
                            $scope.finnalCouponArr = finnalCouponArr;
                        }, function (errText) {

                        })
                    }

                    /**
                     * 获得会员停车最多可使用积分数
                     * */
                    function getLimitIntInfo() {
                        return $getCode({
                            "keyname": "int4parkcanuse"
                        }).then(function (data) {
                            limitIntegral = parseInt(data[0].keycode);
                            console.log(limitIntegral)
                        }, function (err) {

                        });
                    }

                }]);
})();
