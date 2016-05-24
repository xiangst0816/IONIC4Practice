/**
 * Created by xiangsongtao on 16/3/16.
 * 品牌资讯 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('shopListCtrl', ['$rootScope', '$sessionStorage', '$scope', 'baseInfo', 'AJAX', 'api', '$q', '$shopList', '$ionicLoading', '$shopCollect', '$ionicToast', '$filter', '$shopFloor', '$ionicScrollDelegate', '$checkAuthorize', function ($rootScope, $sessionStorage, $scope, baseInfo, AJAX, api, $q, $shopList, $ionicLoading, $shopCollect, $ionicToast, $filter, $shopFloor, $ionicScrollDelegate, $checkAuthorize) {

            //总数据
            $scope.dataToDisplay = [];
            //分页显示开始index
            var start = 1;
            //分页显示条数
            var findNum = 5;

            /**
             * 筛选定义
             * */
            //楼层
            $scope.levelName = '楼层';
            $scope.levelCode = null;
            $scope.setLevelName = function (item) {
                $scope.levelName = item.name;
                $scope.levelCode = item.code;
                //搜索
                reloadMore();
            };
            $scope.levelArr = [{name: "不限", code: null}];
            /**
             * 筛选出 楼层/类型 信息,返回楼层arr
             * */
            $shopFloor().then(function (levelArr) {
                $scope.levelArr.extend(levelArr);
            });

            //类型
            $scope.typeName = '类型';
            $scope.typeCode = null;
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                $scope.typeCode = item.code;
                //搜索
                reloadMore();
            };
            $scope.typeArr = [
                {name: $filter('industryCodeToName')(''), code: null}
                , {name: $filter('industryCodeToName')('sc_industry_1'), code: 1}
                , {name: $filter('industryCodeToName')('sc_industry_2'), code: 2}
                , {name: $filter('industryCodeToName')('sc_industry_3'), code: 3}
                , {name: $filter('industryCodeToName')('sc_industry_4'), code: 4}
                , {name: $filter('industryCodeToName')('sc_industry_5'), code: 5}
            ];

            $scope.orderName = '店名排序';
            $scope.orderCode = 'asc';
            $scope.setOrderName = function (item) {
                $scope.orderName = item.name;
                $scope.orderCode = item.code;
                //搜索
                reloadMore();
            };
            $scope.orderArr = [
                {name: "升序", code: "asc"},
                {name: "降序", code: "desc"}
            ];


            /**
             * 获取商户列表
             * 商场id:baseInfo.orgid
             * 获取商户列表之后执行操作
             * 筛选数据得到tab中的可用选项
             * */
            function getShopList(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);

                start++;

                if (!!$sessionStorage.userInfo && !!$sessionStorage.userInfo.customerid) {
                    var custid = $sessionStorage.userInfo.customerid;
                } else {
                    var custid = null;
                }
                return $shopList({
                    "conditions": {
                        "custid": custid,
                        "shopname": $scope.searchFor,
                        "floor": parseInt($scope.levelCode),
                        "industryid": parseInt($scope.typeCode),
                        "page": {
                            "index": _start,
                            "num": _findNum
                        },
                        "sort": {
                            "column": "name",
                            "type": $scope.orderCode
                        }
                    }
                })
            }

            /**
             * 每次页面进入刷新列表
             * */
            $scope.$on("$stateChangeSuccess", function (event, toState) {
                if (toState.name == 'subNav.brandInfo') {
                    // $ionicLoading.show();
                    // $scope.moreDataCanBeLoaded = true;
                    $ionicLoading.show();
                    reloadMore().finally(function () {
                        $ionicLoading.hide();
                    })
                }
            });


            /**
             * 监听search组件发出的信息
             * */
            $scope.$on("$searchNow", function () {
                $ionicLoading.show();
                reloadMore().finally(function () {
                    $ionicLoading.hide();
                })
            });

            /**
             * 清空searchBox的话,也进行列表刷新
             * */
            $scope.$on("$cleanInput", function () {
                console.log($rootScope.isHistoryBoxOpen)
                if (!$rootScope.isHistoryBoxOpen) {
                    $ionicLoading.show();
                    reloadMore().finally(function () {
                        $ionicLoading.hide();
                    });
                }
            });


            /**
             * 点击收藏前判断是否有权限
             * */
            $scope.beforeCollection = function ($event, item) {
                //微信需要关注,app需要登录
                $checkAuthorize("wxLevel_AttOnly").then(function () {
                    changeCollectionState($event, item);
                })
            };


            /**
             * loadMore
             * 返回promise
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded) {
                    return getShopList(start, findNum).then(function (data) {
                        if (!data.length) {
                            $scope.moreDataCanBeLoaded = false;
                        } else {
                            $scope.dataToDisplay.extend(data);
                        }
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
             * 取消收藏,收藏按钮操作
             * 第一次查找的时候,默认加载收藏的店铺
             * */
            function changeCollectionState($event, item) {
                $ionicLoading.show();
                var $target = angular.element($event.target);
                return $shopCollect($target, item).finally(function () {
                    $ionicLoading.hide();
                });
            }


        }]);

})();