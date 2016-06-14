/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-自助缴费-缴费-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('selfPayToPayCtrl',
            ['$scope', '$state', '$stateParams', '$filter', '$integralInfo', '$sessionStorage', '$getCode', '$ionicLoading', '$whenPaiedPark', '$ionicToast', '$timeout', '$q', '$ionicScrollDelegate', '$goBackWhenError', '$rootScope', '$userCouponList', '$log', '$smartPay', 'baseInfo',
                function ($scope, $state, $stateParams, $filter, $integralInfo, $sessionStorage, $getCode, $ionicLoading, $whenPaiedPark, $ionicToast, $timeout, $q, $ionicScrollDelegate, $goBackWhenError, $rootScope, $userCouponList, $log, $smartPay, baseInfo) {


                    //环境判断
                    $scope.isInWeiXin = false;
                    if (Internal.isInWeiXin) {
                        $scope.isInWeiXin = true;
                    }


                    var payInfo = $stateParams.data;

                    // 假数据
                    var payInfo = {
                        discount: 5,
                        entryTime: "2016-04-22 08:50",
                        paymentNumber: 1,
                        price: 48,
                        seqNumber: "123000678",
                        ticketNumber: "1234.1234.1234",
                        time: 20
                    };
                    //数据增补
                    var payInfo_otherInfo = {
                        entryTime: $filter('yyyyMMdd_HHmmss_minus')(payInfo.entryTime),
                        nowTime: $filter('yyyyMMdd_HHmmss_minus')(new Date()),
                        price: parseFloat(payInfo.price) - parseFloat(payInfo.discount)
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
                    $scope.limitIntegral;

                    //每小时停车费
                    $scope.parkingHour2money;
                    //积分抵扣钱数
                    $scope.intergal2money = 0;
                    //所使用的积分抵扣数
                    $scope.integal2paied = 0;
                    //停车券抵扣钱数
                    $scope.coupon2money = 0;

                    //积分分组列表(让用户能选择的积分等级)
                    $scope.intergalGroupArr = [];

                    //最后结余金额,初始化为总金额
                    $scope.finalPrice = payInfo.price;
                    /**
                     * 页面初始化逻辑
                     * 1. 获得积分抵扣规则
                     * 2. 获得可用卡券
                     * 3. 获取当前积分对象
                     * */
                    $ionicLoading.show({
                        hideOnStateChange: true,
                        template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                        '<br>' +
                        '<div style="margin-top:0.2rem">正在准备</div>'
                    });
                    $q.all([
                        getRelatedCoupon(),
                        getExchangeCode(),
                        integralInfo()
                    ]).then(function () {
                        //计算积分数
                        calculate();
                    }, function (err) {
                        $goBackWhenError()
                    }).finally(function () {
                        $ionicLoading.hide();
                    });


                    //选择微信支付
                    $scope.wxSelected = false;
                    $scope.selectWXToPay = function () {
                        if (!$scope.finalPrice) {
                            $ionicToast.show("已抵扣全部停车费,请确认支付!", 2000)
                        } else {
                            $scope.wxSelected = !$scope.wxSelected;
                            $scope.zfbSelected = false;
                            calculate();
                        }
                    };
                    // 选择支付宝支付
                    $scope.zfbSelected = false;
                    $scope.selectZFBToPay = function () {
                        if (!$scope.finalPrice) {
                            $ionicToast.show("已抵扣全部停车费,请确认支付!", 2000)
                        } else {
                            $scope.wxSelected = false;
                            $scope.zfbSelected = !$scope.zfbSelected;
                            calculate();
                        }
                    };


                    /**
                     * 显示停车的卡券标题
                     * */
                    $scope.showCouponDetail = false;
                    $scope.showParkingCoupon = function () {
                        if (!$scope.finnalCouponArr.length) {
                            $ionicToast.show("暂无卡券可用!")
                            return false
                        }
                        $scope.showCouponDetail = !$scope.showCouponDetail;
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollTop(true);
                    };
                    //点击选择卡券
                    // $scope.selectedCouponValue = 0;
                    $scope.selectParkingCoupon = function (coupon, $event) {
                        //face_value为小时数
                        $scope.couponFaceValue = coupon.face_value;
                        $scope.couponCode = coupon.code;
                        $scope.couponID = coupon.id;

                        //添加标示
                        var target = $event.target;
                        var all = target.parentNode.children;
                        if (target.classList.contains("active")) {
                            target.classList.remove("active");
                            $scope.coupon2money = 0;
                            calculate();
                        } else {
                            for (var i = 1, len = all.length; len > i; i++) {
                                all[i].classList.remove("active")
                            }
                            target.classList.add("active");
                            //停车券抵扣钱数
                            $scope.coupon2money = $scope.parkingHour2money * $scope.couponFaceValue;
                            calculate();

                        }
                        $scope.showCouponDetail = false;
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollTop(true);
                    };

                    /**
                     * 选择积分标题
                     * */
                    $scope.showIntergalDetail = false;
                    $scope.showIntergalGroup = function () {
                        if (!$scope.intergalGroupArr.length) {
                            $ionicToast.show("当前暂无积分可用!");
                            return false
                        }
                        $scope.showIntergalDetail = !$scope.showIntergalDetail;
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollTop(true);
                    };
                    //选择积分菜单明细
                    $scope.selectIntergral = function (index, $event) {
                        //添加标示
                        var target = $event.target;
                        var all = target.parentNode.children;
                        if (target.classList.contains("active")) {
                            target.classList.remove("active");
                            $scope.intergal2money = 0;
                            calculate();
                        } else {
                            for (var i = 0, len = all.length; len > i; i++) {
                                all[i].classList.remove("active")
                            }
                            target.classList.add("active");
                            //停车券抵扣钱数
                            $scope.integal2paied = $scope.needIntegral * (index + 1);
                            // $scope.integal2paied =
                            $scope.intergal2money = $scope.relatedMoney * (index + 1);
                            $log.debug("intergal=" + $scope.integal2paied + "; money=" + $scope.intergal2money);
                            calculate();
                        }

                        $scope.showIntergalDetail = false;
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollTop(true);
                    };


                    /**
                     * 确认支付按钮
                     * */
                    $scope.confirmToPay = function () {
                        // if ($scope.finalPrice && (!$scope.wxSelected)) {
                        if ($scope.finalPrice && Internal.isInWeiXin && !$scope.wxSelected) {
                            $ionicToast.show("请选择余额支付方式!");
                            return
                        } else if ($scope.finalPrice && !$scope.wxSelected && !$scope.zfbSelected) {
                            $ionicToast.show("请选择余额支付方式!");
                            return
                        }
                        // 进行支付
                        $ionicLoading.show({template: "正在支付"});


                        $smartPay({
                            "shop_id": baseInfo.parkingID.toString(),//string 店铺id
                            "trade_type": Internal.isInWeiXin ? 1 : 3,//int  交易类型;1 微信公众号(H5支付),2 微信扫码,3 微信app(APP支付)
                            "original_fee": parseFloat($scope.finalPrice).toFixed(2),//int 原始金额
                            "total_fee": parseFloat($scope.finalPrice).toFixed(2),//int 实付金额
                            "pay_source": $scope.wxSelected ? 1 : ($scope.zfbSelected ? 3 : 9),//int 支付数据来源;1 微信支付, 3 阿里支付
                        }).then(function (data) {
                            //支付成功后写入后台并核销
                            whenPaied4Park();
                        }, function (errText) {
                            $ionicToast.show("支付失败," + errText);
                        }).finally(function () {

                            $whenPaiedPark().then(function () {
                                $log.warn("测试支付信息提交功能:状态->成功");
                            },function () {
                                $log.warn("测试支付信息提交功能:状态->失败");
                            });

                            $ionicLoading.hide();
                        })
                    };


                    /**
                     * 将成功缴费的信息传导后台
                     *  $scope.wxSelected = false;zfbSelected
                     * */
                    function whenPaied4Park() {
                        $whenPaiedPark({
                            "paymentInfo": {
                                "custid": parseInt($sessionStorage.userInfo.customerid),
                                "seqNumber": payInfo.seqNumber.toString(),
                                "ticketNumber": payInfo.ticketNumber.toString(),
                                "couponid": parseInt($scope.couponID),//优惠券id,但是这里是code值,
                                "couponno": $scope.couponCode.toString(),//优惠券 number
                                "couponAmount": parseFloat($scope.coupon2money),// 优惠券支付金额
                                "wechatAmount": parseFloat(0).toFixed(2),//微信支付金额
                                "alipayAmount": parseFloat(0).toFixed(2),//支付宝支付金额
                                "pointPayNum": parseInt($scope.integal2paied),//积分支付的积分数量
                                "pointPayAmount": parseFloat($scope.intergal2money)//积分支付的抵扣金额
                            }
                        }).then(function (data) {
                            $timeout(function () {
                                $ionicToast.show("支付信息提交成功!")
                                $timeout(function () {
                                    if ($rootScope.HistoryArr.length > 2) {
                                        $rootScope.goBack(2);
                                    } else {
                                        $rootScope.backToHome();
                                    }
                                }, 700, false);

                            }, 1000, false);

                        }, function (errText) {
                            $ionicToast.show("支付信息提交失败," + errText);
                        }).finally(function () {
                            $timeout(function () {
                                $ionicLoading.hide();
                            }, 700);
                        })
                    }

                    /**
                     * 费用计算
                     * */
                    function calculate() {

                        $scope.intergalGroupArr = [];

                        // //max
                        // $scope.limitIntegral
                        // //only500
                        // $scope.needIntegral
                        // //500->10yuan
                        // $scope.relatedMoney
                        // //my integral
                        // $scope.integralCanUse

                        //coupon -> money
                        // $scope.coupon2money

                        //intergal -> money
                        // $scope.intergal2money

                        //final money need to pay = total-intergal2money-coupon2money
                        $scope.finalPrice = payInfo.price - $scope.coupon2money - $scope.intergal2money;
                        if ($scope.finalPrice < 0) {
                            $scope.finalPrice = 0;
                            $scope.wxSelected = false;
                            $scope.zfbSelected = false;
                        }

                        // //max
                        // $scope.limitIntegral
                        // //only500
                        // $scope.needIntegral
                        // //500->10yuan
                        // $scope.relatedMoney
                        // //my integral
                        // $scope.integralCanUse

                        //finalPrice
                        //如果当前积分能将剩余停车费支付,则显示最高可使用积分等级即可,而不是将全部可用积分等级列出
                        var finalPrice2Intergal = (payInfo.price / $scope.relatedMoney + 1) * $scope.needIntegral;
                        if ($scope.integralCanUse > finalPrice2Intergal) {
                            $scope.integralCanUse = finalPrice2Intergal;
                        }
                        var count;
                        if ($scope.limitIntegral > $scope.integralCanUse) {
                            count = Math.floor($scope.integralCanUse / $scope.needIntegral);
                        } else {
                            count = Math.floor($scope.limitIntegral / $scope.needIntegral);
                        }
                        for (var i = 1; count > i - 1; i++) {
                            $scope.intergalGroupArr.push($scope.needIntegral * i)
                        }
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
                                    $log.debug("停车抵扣所需积分数(整数倍):" + $scope.needIntegral);
                                }
                                if (value.keyname == "integralexchange_2") {
                                    $scope.relatedMoney = parseFloat(value.keycode).toFixed(2);
                                    $log.debug("停车抵扣积分等效金额:" + $scope.relatedMoney);
                                }
                                if (value.keyname == "integralexchange_3") {
                                    $scope.parkingHour2money = parseFloat(value.keycode);
                                    $log.debug("每小时停车等效金额:" + $scope.parkingHour2money);
                                }
                                if (value.keyname == "integralexchange_4") {
                                    $scope.limitIntegral = parseFloat(value.keycode);
                                    $log.debug("会员停车最多可使用积分数:" + $scope.limitIntegral);
                                }
                            });
                            $log.debug("获取积分抵扣信息(满" + $scope.needIntegral + "积分可抵扣" + $scope.relatedMoney + "元)");
                        }, function (errText) {
                            $ionicToast.show("获取积分抵扣信息失败," + errText)
                        })
                    }

                    /**
                     * 获取能抵扣的电子卡券(抵用券)
                     * 抵用券有最低 抵用金额,如果传入数小于抵用金额则此卡不可用
                     * @params:fee 传入金额
                     * */
                    function getRelatedCoupon() {
                        return $userCouponList({
                            "conditions": {
                                "custid": $sessionStorage.userInfo.customerid.toString(),
                                "categorycode": "",//2,抵扣券;3,现金券,5停车券
                                "typecode": 1,//1 卡券 ;2 礼品
                                "statuscode": 2,//1 已使用;2 未使用;3 已过期
                                "querytype": "main",
                                "page": {
                                    "index": 1,
                                    "num": 999
                                },
                                "sort": {
                                    "column": "get_time",
                                    "type": "desc"
                                }
                            }
                        }).then(function (data) {
                            console.log(data)
                            $scope.finnalCouponArr = data;
                        }, function (errText) {

                        })
                    }


                }]);
})();
