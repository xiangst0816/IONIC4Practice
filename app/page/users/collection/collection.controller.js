/**
 * Created by xiangsongtao on 16/3/16.
 * 用户中心-关注商户 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('collectionCtrl', ["$scope", "$q", "$sessionStorage", 'AJAX', 'api', '$ionicLoading', '$ionicToast', '$userCollectedShopList', '$shopCollect', '$filter', '$shopFloor', '$quickSort', function ($scope, $q, $sessionStorage, AJAX, api, $ionicLoading, $ionicToast, $userCollectedShopList, $shopCollect, $filter, $shopFloor, $quickSort) {

            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */
            var findNum = 6;
            $scope.findNum = findNum;
            var start = 1;


            //类型配需相关
            //楼层
            $scope.levelName = '楼层';
            var levelCode = null;
            $scope.setLevelName = function (item) {
                $scope.levelName = item.name;
                levelCode = item.code;
                reloadMore();
            };
            $scope.levelArr = [{name: "不限", code: null}];
            //筛选出 楼层/类型 信息,返回楼层arr
            $shopFloor().then(function (levelArr) {
                $scope.levelArr.extend(levelArr);
            });
            //类型
            $scope.typeName = '类型';
            var typeCode = null;
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                typeCode = item.code;
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
            //收藏时间
            $scope.orderName = '收藏时间';
            var orderCode = 'asc';
            $scope.setOrderName = function (item) {
                $scope.orderName = item.name;
                orderCode = item.code;
                reloadMore();
            };
            $scope.orderArr = [
                {name: "默认", code: "asc"},
                {name: "升序", code: "asc"},
                {name: "降序", code: "desc"}
            ];



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
                        } else if(data.length < findNum){
                            $scope.moreDataCanBeLoaded = false;
                            $scope.dataToDisplay.extend(data);
                        }else{
                            $scope.dataToDisplay.extend(data);
                        }
                    },function () {
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
                document.getElementById('infiniteScroll').classList.add("active");
                // $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    // $ionicLoading.hide();
                });

            }

            /**
             * 取消收藏,收藏按钮操作
             * 第一次查找的时候,默认加载收藏的店铺
             * */
            $scope.changeCollectionState = function ($event, item) {
                $ionicLoading.show();
                var $target = angular.element($event.target);
                $shopCollect($target, item).finally(function () {
                    $ionicLoading.hide();
                });
            };


            /**
             * 查询某人的卡券列表
             * categorycode:string,卡券类型值，如有多个，以逗号区分，如‘1,2,4’;传null或者空，则会获取所有卡券类型
             * column:排序的字段名称
             * type:降序desc,升序asc
             * */
            function getShopList(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);
                start++;
                return $userCollectedShopList({
                    "conditions":{
                        "floor":levelCode,
                        "industryid":typeCode,
                        "sort": {
                            "column": "collectdate",
                            "type": orderCode
                        },
                        "page": {
                            "index": _start,
                            "num": _findNum
                        }
                    }
                })
            }

            /**
             * 每次页面切换刷新列表
             * */
            reloadMore();
            // $scope.$on("$stateChangeSuccess", function (event, toState) {
            //     if (toState.name == 'subNav.memberCollection') {
            //
            //         reloadMore();
            //     }
            // });
            // $scope.$on("destroy",function () {
            //     $scope.moreDataCanBeLoaded = true;
            //     $scope.dataToDisplay = [];
            //     alert("dfe")
            // })


        }]);

})();