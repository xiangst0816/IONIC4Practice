/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券-controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('couponCtrl', ['$scope', 'AJAX', 'api', '$sessionStorage', '$ionicToast', '$filter', '$ionicPopover', '$q', '$ionicLoading', '$effectiveCouponList','$effectiveGiftList', function ($scope, AJAX, api, $sessionStorage, $ionicToast, $filter, $ionicPopover, $q, $ionicLoading, $effectiveCouponList,$effectiveGiftList) {

            /**
             * 类型配需相关
             * */
            $scope.typeName = '类型';
            $scope.typeCode = 'all';
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                $scope.typeCode = item.code;
                //改变后执行查询
                statusFilterFn();
            };
            $scope.typeNameArr = [
                {
                    name: "不限",
                    code: "all"
                }
                , {
                    name: "卡券",
                    code: "couponList"
                }
                , {
                    name: "礼品",
                    code: "giftList"
                }
            ];

            /**
             * 优惠券使用状态
             * 0, 全部; 2, 未使用; 1, 已使用; 3, 已过期;
             * */
            $scope.statusName = '状态';
            $scope.statusCode = 0;
            var statusFilter = {};
            $scope.setStatusName = function (item) {
                $scope.statusName = item.name;
                $scope.statusCode = item.code;
                //改变后执行查询
                statusFilterFn();
            };
            $scope.statusNameArr = [
                {
                    name: "不限",
                    code: 0
                }
                , {
                    name: "未使用",
                    code: 2
                }
                , {
                    name: "已使用",
                    code: 1
                }
                , {
                    name: "已过期",
                    code: 3
                }
            ];


            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];
            var giftArr = [];
            var effectiveCouponArr = [];
            var totalArr = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */
            var findNum = 7;
            var start = 0;
            // var totleHistoryRecord;
            $ionicLoading.show();
            statusFilterFn();

            /**
             * 优惠券立即使用 usedNow
             * */
            $scope.usedNow = function (code) {
                $scope.useGougon4Code = code;
                $scope.useGougon4CodeImg = '';
                $scope.useGougon4CodeImg = api.generateQrcodeUrl + api.scancodeVerificationUrl + code;
                $scope.popover.show();
            };

            $ionicPopover.fromTemplateUrl('tpl/useGoupon.comp.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            })

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
             * reloadMore,用再次调用
             * */
            function reloadMore() {
                //设置开始值
                start=0;
                //返回顶部
                // $ionicScrollDelegate.scrollTop(true);
                //清空结果
                $scope.dataToDisplay = [];
                //可加载
                $scope.moreDataCanBeLoaded = true;
                //执行
                $scope.loadMore();
            }

            /**
             * 查询某人的卡券列表
             * categorycode:string,卡券类型值，如有多个，以逗号区分，如‘1,2,4’;传null或者空，则会获取所有卡券类型
             * column:排序的字段名称
             * type:降序desc,升序asc
             * */
            function getEffectiveCouponList() {
                return $effectiveCouponList().then(function (data) {
                    // console.log('data')
                    // console.log(data)
                    effectiveCouponArr = data;
                    //为卡券添加标示字段
                    effectiveCouponArr.forEach(function (v) {
                        v.isCoupon = true;
                        if (v.is_used == 1) {
                            //1, 已使用
                            v.useState = 1;
                        } else if (v.is_expired == 0) {
                            //2, 未使用
                            v.useState = 2;
                        } else if (v.is_expired == 1) {
                            //3. 已过期
                            v.useState = 3;
                        }
                    });
                }, function () {
                    $ionicToast.show("获取会员卡券列表失败!")
                });
            };

            /**
             * 查询某人礼品的列表
             * */
            function getGiftList() {
                return $effectiveGiftList({
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "usestate": $scope.statusCode
                    }
                }).then(function (data) {
                    giftArr = data;
                    //为礼品添加标示字段
                    giftArr.forEach(function (v) {
                        v.isCoupon = false;
                    });
                });
            }

            /**
             * 选择tab后进行查询(子函数)
             * callback,可选,如果上述请求成功后执行回调
             * */
            function querySelected(callback) {
                $ionicLoading.show();
                function _couponList() {
                    return getEffectiveCouponList().then(function () {
                        totalArr.extend(effectiveCouponArr);
                    });
                }
                function _giftList() {
                    return getGiftList().then(function () {
                        totalArr.extend(giftArr);
                    });
                }
                totalArr = [];
                console.log($scope.typeCode)
                if ($scope.typeCode == 'all') {
                    $q.all([_giftList(),_couponList()]).then(function () {
                        callback && callback();
                        $ionicLoading.hide();
                    });
                } else if ($scope.typeCode == 'couponList') {
                    _couponList().finally(function () {
                        callback && callback();
                        $ionicLoading.hide();
                    });
                } else if ($scope.typeCode == 'giftList') {
                    _giftList().finally(function () {
                        callback && callback();
                        $ionicLoading.hide();
                    });

                }
            }


            /**
             * 状态过滤器(主函数)
             * 0, 全部; 2, 未使用; 1, 已使用; 3, 已过期;
             * */
            function statusFilterFn() {
                //查询当前的选择状态,成功后执行回调
                querySelected(function () {
                    //状态定义useState
                    if ($scope.statusCode == 0) {
                        statusFilter = {};
                    } else {
                        statusFilter = {
                            useState: $scope.statusCode
                        }
                    }
                    //有点复杂,在ionic.bundle.js的line:27022
                    //1. 找到名字为filter的函数
                    //2. 传入三个参数,第一个:传入过滤的数组,第二个:过滤的方式(fn/obj/string)
                    //3. 将结果展示出来
                    totalArr = $filter('filter')(totalArr, statusFilter);
                    //
                    reloadMore();
                });
            }



        }]);

})();