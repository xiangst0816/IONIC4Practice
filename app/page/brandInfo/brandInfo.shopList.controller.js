/**
 * Created by xiangsongtao on 16/3/16.
 * 品牌资讯 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('shopListCtrl', ['$rootScope', '$sessionStorage', '$scope', '$shopList', '$ionicLoading', '$shopCollect', '$filter', '$shopFloor', '$checkAuthorize', '$log','$debounce', function ($rootScope, $sessionStorage, $scope, $shopList, $ionicLoading, $shopCollect, $filter, $shopFloor, $checkAuthorize, $log,$debounce) {



            // var search = $getUrlParams();
            // console.log(search);

            //总数据
            $scope.dataToDisplay = [];
            //分页显示开始index
            var start = 1;
            //分页显示条数
            var findNum = 5;
            $scope.findNum = findNum;

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
             * 每次页面进入刷新列表
             * */
            $scope.$on("$stateChangeSuccess", function (event, toState) {
                if (toState.name == 'subNav.brandInfo') {
                    reloadMore();
                }
            });


            /**
             * 监听search组件发出的信息
             * */
            $scope.$on("$searchNow", function () {
                reloadMore();
            });

            // /**
            //  * 监听联想请求
            //  * */
            // $scope.$on("$lenovoNow", function () {
            //
            //     // getShopList(1,6).then(function (list) {
            //     //     $scope.lenovoList = list;
            //     // })
            // });

            /**
             * 历史记录分为两种状态
             * 监听input的值,如果!=null,则为联想状态;如果为空,则为历史记录状态
             * */
            $scope.$watch('searchFor', function () {
                $scope.lenovoList = [];
                if (!!$scope.searchFor) {

                    //进入联想状态
                    $scope.isHistoryStatus = false;
                    $debounce(lenovo,500);
                }
            });
            /**
             * 执行联想
             * */
            function lenovo() {
                // $scope.$broadcast("$lenovoNow");
                getShopList(1,6).then(function (list) {
                    $scope.lenovoList = list;
                })
            }

            /***
             * 退出清理
             */
            $scope.$on("$destroy",function () {
                $scope.searchFor = null;
            });

            /**
             * 清空searchBox的话,也进行列表刷新
             * */
            $scope.$on("$cleanInput", function () {
                $log.debug("isHistoryBoxOpen:"+$rootScope.isHistoryBoxOpen);
                if (!$rootScope.isHistoryBoxOpen) {
                    reloadMore();
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
                if ($scope.moreDataCanBeLoaded && !$scope.isSearching) {
                    $scope.isSearching = true;
                    return getShopList(start, findNum).then(function (data) {
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
                // $ionicLoading.show();
                //再次进入此页面时,加载动画不显示的bug修复
                document.getElementById('infiniteScroll').classList.add("active");
                //执行
                return $scope.loadMore().finally(function () {
                    // $ionicLoading.hide();
                });
            }

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

                return $shopList({
                    "conditions": {
                        // "custid": custid,
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