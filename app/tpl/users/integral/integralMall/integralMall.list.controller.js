/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分-积分商城 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('integralMallCtrl', ['$scope', '$ionicPopup', '$q', 'api', '$sessionStorage', 'AJAX', '$ionicToast', '$ionicLoading','$integralInfo','$couponList','$rewardCoupons','$rewardGifts','$ionicScrollDelegate', function ($scope, $ionicPopup, $q, api, $sessionStorage, AJAX, $ionicToast, $ionicLoading,$integralInfo,$couponList,$rewardCoupons,$rewardGifts,$ionicScrollDelegate) {

            /**
             * 数据显示Arr
             * */
            var getCouponArr = [];
            var getGiftArr = [];
            var totalArr = [];
            $scope.dataToDisplay = [];

            var start = 0;
            var findNum = 10;



            //类型配需相关
            $scope.typeName = '类型';
            var typeCode = null;
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                typeCode = item.code;
                //改变后执行查询
                querySelected();
            };
            $scope.typeNameArr = [
                {
                    name: "不限",
                    code: null
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
                querySelected();
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
                    title:title,
                    suffix:suffix,
                    detail:detail
                };

                //默认为1
                $scope.data.convertNum || ($scope.data.convertNum = 1);

                var convertRequest = {
                    title: "兑换"+title,
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
                                //发送数据
                                if(detail.category_name && detail.category_name.indexOf('coupon') > -1){
                                    //如果是兑换礼券
                                    rewardCoupons(detail, convertNum).then(function (codeText) {
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        angular.extend(convertResult, {title: "兑换失败",template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                } else{
                                    //如果是兑换礼品
                                    rewardGifts(detail, convertNum).then(function (codeText) {
                                        //兑换成功,这里返回7001
                                        // console.log(code)
                                        angular.extend(convertResult, {
                                            title: "兑换成功",
                                            template: codeText
                                        });
                                        $ionicPopup.show(convertResult);
                                    }, function (codeText) {
                                        // console.log(code)
                                        angular.extend(convertResult, {title: "兑换失败",template: codeText});
                                        $ionicPopup.show(convertResult);
                                    })
                                }

                            }
                        }
                    }, {text: '取消', type: 'noticePopupBtn', onTap: function (e) {}}
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
             * 页面进入需要准备项目:获取我的积分值
             * */
            $ionicLoading.show();

            $scope.moreDataCanBeLoaded = true;
            $q.all([getIntegral(), getCouponList()]).then(function () {
                //卡券和礼品数据汇总$scope.dataToDisplay
                totalArr.extend(getCouponArr, getGiftArr);

                //需要手动启动一次
                reloadMore();
                $ionicLoading.hide();
            });


            /**
             * loadMore
             * */
            $scope.loadMore = function () {
                if($scope.moreDataCanBeLoaded){
                    var totleHistoryRecord = totalArr.length;

                    //一次加载数量
                    var findNumInArr = findNum;
                    if (totleHistoryRecord < (start * findNumInArr + findNumInArr)) {
                        // console.log(totleHistoryRecord)
                        findNumInArr = totleHistoryRecord - ((start - 1) * findNumInArr + findNumInArr);
                        //最后一次加载
                        $scope.moreDataCanBeLoaded = false;
                    }
                    for (var i = start * findNumInArr; (start * findNumInArr + findNumInArr) > i; i++) {
                        $scope.dataToDisplay.push(totalArr[i]);
                    }
                    start++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            };

            /**
             * 获取我的积分值
             * */
            function getIntegral() {
                return $integralInfo().then(function (data) {
                    $scope.currenttotalnum = $sessionStorage.integralInfo.currenttotalnum;
                },function (errText) {
                    $ionicToast.show("积分信息获取失败," +errText);
                });
            }

            /**
             * 获取卡券列表
             * */
            function getCouponList() {
                var defer = $q.defer();
                $couponList({
                    "sort": {
                        "column": "point",
                        "type": orderCode
                    }
                }).then(function (data) {
                    getCouponArr = data;
                    //为卡券添加标示字段
                    getCouponArr.forEach(function (v) {
                        v.isCoupon = true;
                    });
                    defer.resolve(getCouponArr);
                });
                return defer.promise;
            }

            /**
             * 获取礼品列表
             * */
            function getGiftList() {
                var defer = $q.defer();
                $giftList({
                    "sort": {
                        "column": "quantity",
                        "type": orderCode
                    }
                }).then(function (data) {
                    // console.log(data)
                    getGiftArr = data;
                    //为卡券添加标示字段
                    getGiftArr.forEach(function (v) {
                        v.isCoupon = false;
                    });
                    defer.resolve(getGiftArr);
                });
                return defer.promise;
            }

            /**
             * 选择tab后进行查询
             * */
            function querySelected() {
                $ionicLoading.show();
                totalArr = [];
                if (typeCode == 'all') {
                    $q.all([getCouponList(), getGiftList()])
                        .then(function () {
                            totalArr.extend(getCouponArr);
                            totalArr.extend(getGiftArr);
                        }).finally(function () {
                        reloadMore();
                    })
                } else if (typeCode == 'couponList') {
                    getCouponList()
                        .then(function () {
                            totalArr.extend(getCouponArr);
                        }).finally(function () {
                        reloadMore();
                    })

                } else if (typeCode == 'giftList') {
                    getGiftList()
                        .then(function () {
                            totalArr.extend(getGiftArr);
                            // console.log(totalArr)
                        }).finally(function () {
                        reloadMore();
                    })
                }
                $ionicLoading.hide();
            }



            /**
             * reloadMore,用再次调用
             * */
            function reloadMore() {
                //设置开始值
                start=0;
                //返回顶部
                $ionicScrollDelegate.scrollTop(true);
                //清空结果
                $scope.dataToDisplay = [];
                //可加载
                $scope.moreDataCanBeLoaded = true;
                //执行
                $scope.loadMore();
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
                        "giftid": detail.innerid,
                        "quantity": quantity,
                        "point": detail.quantity
                    }
                });
            }

        }]);

})();