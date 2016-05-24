/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分-积分商城 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('integralMallCtrl', ['$scope', '$ionicPopup', '$q', 'api', '$sessionStorage', 'AJAX', '$ionicToast', '$ionicLoading', '$integralInfo', '$couponList', '$rewardCoupons', '$rewardGifts', function ($scope, $ionicPopup, $q, api, $sessionStorage, AJAX, $ionicToast, $ionicLoading, $integralInfo, $couponList, $rewardCoupons, $rewardGifts) {

            /**
             * 数据显示Arr
             * */
            $scope.dataToDisplay = [];

            var start = 0;
            var findNum = 10;


            //类型配需相关
            $scope.typeName = '类型';
            var typeCode = 0;
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                typeCode = item.code;
                //改变后执行查询
                reloadMore();
            };
            $scope.typeNameArr = [
                {
                    name: "不限",
                    code: 0
                }
                , {
                    name: "卡券",
                    code: 1
                }
                , {
                    name: "礼品",
                    code: 2
                }
            ];
            //状态
            $scope.orderName = '积分排序';
            var orderCode = 'desc';
            $scope.setOrderName = function (item) {
                $scope.orderName = item.name;
                orderCode = item.code;
                //改变后执行查询
                reloadMore();
            };
            $scope.orderNameArr = [
                {
                    name: "默认",
                    code: "desc"
                }
                , {
                    name: "降序",
                    code: "desc"
                }
                , {
                    name: "升序",
                    code: "asc"
                }
            ];

            /**
             * 兑换弹出框
             * */
            $scope.rewardCouponBtn = function (detail) {
                //判断title
                if (detail.category_name && detail.category_name.indexOf('coupon') > -1) {
                    var title = '礼券';
                    var suffix = '张';
                } else {
                    var title = '礼品';
                    var suffix = '个';
                }
                //兑换请求
                $scope.data = {
                    title: title,
                    suffix: suffix,
                    detail: detail
                };

                //默认为1
                $scope.data.convertNum || ($scope.data.convertNum = 1);

                var convertRequest = {
                    title: "兑换" + title,
                    cssClass: 'noticePopup convertRequestBox',
                    subTitle: '',
                    templateUrl: 'tpl/convertRequest.comp.html',
                    scope: $scope,
                    buttons: [{
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function (e) {
                            var convertNum = $scope.data.convertNum;
                            if (!convertNum) {
                                $ionicToast.show("请输入兑换数量!");
                                //如果没输入兑换数量则保持不动
                                e.preventDefault();
                            } else {
                                $ionicLoading.show({
                                    //返回按钮
                                    hideOnStateChange: true,
                                    template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                                    '<br>' +
                                    '<div style="margin-top:0.2rem">正在处理请求</div>'
                                });
                                //发送数据
                                if (detail.category_name && detail.category_name.indexOf('coupon') > -1) {
                                    //如果是兑换礼券
                                    rewardCoupons(detail, convertNum).then(function (codeText) {
                                        $ionicLoading.hide();
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        $ionicLoading.hide();
                                        angular.extend(convertResult, {title: "兑换失败", template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                } else {
                                    //如果是兑换礼品

                                    rewardGifts(detail, convertNum).then(function (codeText) {
                                        $ionicLoading.hide();
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        $ionicLoading.hide();
                                        // console.log(code)
                                        angular.extend(convertResult, {title: "兑换失败", template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                }

                            }
                        }
                    }, {
                        text: '取消', type: 'noticePopupBtn', onTap: function (e) {
                        }
                    }
                    ]
                };
                //显示兑换请求
                $ionicPopup.show(convertRequest);

                //定义返回结果的兑换消息参数结构
                var convertResult = {
                    title: "",
                    cssClass: 'noticePopup convertRequestBox',
                    template: "",
                    buttons: [{
                        text: '确定', type: 'noticePopupBtn', onTap: function (e) {
                        }
                    }]
                };
            };


            /**
             * 每次页面进入刷新列表
             * */
            $scope.$on("$stateChangeSuccess", function (event, toState) {
                if (toState.name == 'subNav.memberIntegralMall') {
                    reloadMore();
                }
            });



            /**
             * loadMore
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded) {
                    return getCouponList(start, findNum).then(function (data) {
                        if (!data.length) {
                            $scope.moreDataCanBeLoaded = false;
                        } else {
                            $scope.dataToDisplay.extend(data);
                        }
                    }, function () {
                        //如果错误
                        $scope.moreDataCanBeLoaded = false;
                    }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $ionicLoading.hide();
                    });
                }

            };

            /**
             * reloadMore,用再次调用
             * */
            function reloadMore() {
                //设置开始值
                start = 1;
                //清空结果
                $scope.dataToDisplay = [];
                //可加载
                $scope.moreDataCanBeLoaded = true;

                $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    $ionicLoading.hide();
                });
            }


            /**
             * 获取我的积分值
             * */
            // function getIntegral() {
            $integralInfo().then(function (data) {
                $scope.currenttotalnum = $sessionStorage.integralInfo.currenttotalnum;
            }, function (errText) {
                $ionicToast.show("积分信息获取失败," + errText);
            });

            /**
             * 获取卡券列表
             * */
            function getCouponList(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);
                start++;
                return $couponList({
                    "conditions": {
                        "typecode": parseInt(typeCode),
                        "page": {
                            "index": _start,
                            "num": _findNum
                        },
                        "sort": {
                            "column": "point",
                            "type": orderCode
                        }
                    }
                })
            }



            /**
             * 卡券领取-积分兑换卡券
             * detail:obj,传入兑换卡券的信息对象
             * quantity,数量
             * */
            function rewardCoupons(detail, quantity) {
                return $rewardCoupons({
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "couponid": detail.couponid,
                        "quantity": quantity,
                        "point": detail.point
                    }
                });
            }

            /**
             * 礼品兑换-积分兑换礼品
             * detail:obj传入兑换卡券的信息对象
             * quantity,数量
             * */
            function rewardGifts(detail, quantity) {
                return $rewardGifts({
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "giftid": detail.couponid,
                        "quantity": quantity,
                        "point": detail.point
                    }
                });
            }

        }]);

})();