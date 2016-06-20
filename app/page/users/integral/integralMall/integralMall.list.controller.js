/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分-积分商城 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('integralMallCtrl', ['$scope', '$sessionStorage', '$ionicToast', '$ionicLoading', '$integralInfo', '$couponList', function ($scope, $sessionStorage, $ionicToast, $ionicLoading, $integralInfo, $couponList) {

            /**
             * 数据显示Arr
             * */
            $scope.dataToDisplay = [];

            var start = 0;
            var findNum = 10;
            $scope.findNum = findNum;


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
                if ($scope.moreDataCanBeLoaded && !$scope.isSearching) {
                    $scope.isSearching = true;
                    return getCouponList(start, findNum).then(function (data) {
                        if (!data.length) {
                            $scope.moreDataCanBeLoaded = false;
                        } else if(data.length < findNum){
                            $scope.moreDataCanBeLoaded = false;
                            $scope.dataToDisplay.extend(data);
                        }else{
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
             * reloadMore,用再次调用
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
             * 获取我的积分值
             * */
            $integralInfo().then(function (data) {
                $scope.currenttotalnum = $sessionStorage.integralInfo.currenttotalnum;
            }, function (errText) {
                $ionicToast.show("积分信息获取失败,请稍后再试!");
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
        }]);

})();