/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('couponCtrl', ['$scope', 'AJAX', 'api', '$sessionStorage', '$ionicToast', '$filter', '$ionicPopover', '$q', '$ionicLoading', '$userCouponList', function ($scope, AJAX, api, $sessionStorage, $ionicToast, $filter, $ionicPopover, $q, $ionicLoading, $userCouponList) {

            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */
            var findNum = 7;
            $scope.findNum = findNum;
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
             * loadMore
             * 返回promise
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded && !$scope.isSearching) {
                    $scope.isSearching = true;
                    return getCouponList(start, findNum).then(function (data) {
                        if (!data.length) {
                            $scope.moreDataCanBeLoaded = false;
                        } else if (data.length < findNum) {
                            $scope.moreDataCanBeLoaded = false;
                            $scope.dataToDisplay.extend(data);
                        } else {
                            $scope.dataToDisplay.extend(data);
                        }
                    }, function () {
                        //如果错误
                        $scope.moreDataCanBeLoaded = false;
                    }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.isSearching = false;
                        $ionicLoading.hide();
                    });
                }
            };


            /**
             * 每次页面进入刷新列表
             * */
            reloadMore();
            // $scope.$on("$stateChangeSuccess", function (event, toState) {
            //     if (toState.name == 'subNav.memberCoupon') {
            //         reloadMore();
            //     }
            // });


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
                //正在搜索?
                $scope.isSearching = false;
                document.getElementById('infiniteScroll').classList.add("active");
                // $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    // $ionicLoading.hide();
                });
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
        }]);

})();