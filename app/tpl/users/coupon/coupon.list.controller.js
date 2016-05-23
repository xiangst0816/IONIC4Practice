/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券-controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('couponCtrl', ['$scope', 'AJAX', 'api', '$sessionStorage', '$ionicToast', '$filter', '$ionicPopover', '$q', '$ionicLoading', '$userCouponList', function ($scope, AJAX, api, $sessionStorage, $ionicToast, $filter, $ionicPopover, $q, $ionicLoading, $userCouponList) {

            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */
            var findNum = 7;
            var start = 1;


            /**
             * 类型配需相关
             * */
            $scope.typeName = '类型';
            $scope.typeCode = 0;
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                $scope.typeCode = item.code;
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

            /**
             * 优惠券使用状态
             * 0, 全部; 1, 已使用; 2, 未使用; 3, 已过期;
             * */
            $scope.statusName = '使用状态';
            $scope.statusCode = 0;
            $scope.setStatusName = function (item) {
                $scope.statusName = item.name;
                $scope.statusCode = item.code;
                //改变后执行查询
                reloadMore();
            };
            $scope.statusNameArr = [
                {
                    name: "不限",
                    code: 0
                }
                , {
                    name: "已使用",
                    code: 1
                }
                , {
                    name: "未使用",
                    code: 2
                }
                , {
                    name: "已过期",
                    code: 3
                }
            ];


            /**
             * 每次页面进入刷新列表
             * */
            $scope.$on("$stateChangeSuccess", function (event, toState) {
                if (toState.name == 'subNav.memberCoupon') {
                    // $ionicLoading.show();
                    // $scope.moreDataCanBeLoaded = true;
                    $ionicLoading.show();
                    reloadMore().finally(function () {
                        $ionicLoading.hide();
                    })
                }
            });


            /**
             * 优惠券立即使用 usedNow
             * */
            $scope.usedNow = function (code) {
                $scope.useGougon4Code = code;
                $scope.useGougon4CodeImg = null;
                $scope.useGougon4CodeImg = api.generateQrcodeUrl + api.scancodeVerificationUrl + code;
                $scope.popover.show();
            };

            $ionicPopover.fromTemplateUrl('tpl/useGoupon.comp.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

            /**
             * loadMore
             * 返回promise
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded) {
                    return getCouponList(start, findNum).then(function (data) {
                        if (!data.length) {
                            $scope.moreDataCanBeLoaded = false;
                        } else {
                            $scope.dataToDisplay.extend(data);
                        }
                    },function () {
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
             * 返回promise
             * */
            function reloadMore() {
                //设置开始值
                start = 1;
                //清空结果
                $scope.dataToDisplay = [];
                //可加载
                $scope.moreDataCanBeLoaded = true;
                //执行
                return $scope.loadMore();
            }

            /**
             * 查询某人的卡券列表
             * categorycode:string,卡券类型值，如有多个，以逗号区分，如‘1,2,4’;传null或者空，则会获取所有卡券类型
             * column:排序的字段名称
             * type:降序desc,升序asc
             * */
            function getCouponList(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);
                start++;
                return $userCouponList({
                    "conditions": {
                        "typecode": parseInt($scope.typeCode),
                        "statuscode": parseInt($scope.statusCode),
                        "page": {
                            "index": _start,
                            "num": _findNum
                        }
                    }
                })
            }


            // /**
            //  * 选择tab后进行查询(子函数)
            //  * callback,可选,如果上述请求成功后执行回调
            //  * */
            // function querySelected(callback) {
            //     $ionicLoading.show();
            //     function _couponList() {
            //         return getEffectiveCouponList().then(function () {
            //             totalArr.extend(effectiveCouponArr);
            //         });
            //     }
            //     function _giftList() {
            //         return getGiftList().then(function () {
            //             totalArr.extend(giftArr);
            //         });
            //     }
            //     totalArr = [];
            //     console.log($scope.typeCode)
            //     if ($scope.typeCode == 'all') {
            //         $q.all([_giftList(),_couponList()]).then(function () {
            //             callback && callback();
            //             $ionicLoading.hide();
            //         });
            //     } else if ($scope.typeCode == 'couponList') {
            //         _couponList().finally(function () {
            //             callback && callback();
            //             $ionicLoading.hide();
            //         });
            //     } else if ($scope.typeCode == 'giftList') {
            //         _giftList().finally(function () {
            //             callback && callback();
            //             $ionicLoading.hide();
            //         });
            //
            //     }
            // }


            // /**
            //  * 状态过滤器(主函数)
            //  * 0, 全部; 2, 未使用; 1, 已使用; 3, 已过期;
            //  * */
            // function statusFilterFn() {
            //     //查询当前的选择状态,成功后执行回调
            //     querySelected(function () {
            //         //状态定义useState
            //         if ($scope.statusCode == 0) {
            //             statusFilter = {};
            //         } else {
            //             statusFilter = {
            //                 useState: $scope.statusCode
            //             }
            //         }
            //         //有点复杂,在ionic.bundle.js的line:27022
            //         //1. 找到名字为filter的函数
            //         //2. 传入三个参数,第一个:传入过滤的数组,第二个:过滤的方式(fn/obj/string)
            //         //3. 将结果展示出来
            //         totalArr = $filter('filter')(totalArr, statusFilter);
            //         //
            //         reloadMore();
            //     });
            // }



        }]);

})();