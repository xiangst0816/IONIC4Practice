/**
 * Created by xiangsongtao on 16/3/16.
 * 用户中心-关注商户 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('collectionCtrl', ["$scope", "$q", "$sessionStorage", 'AJAX', 'api', '$ionicLoading', '$ionicToast', '$userCollectedShopList', '$shopCollect', '$filter', '$shopFloor','$quickSort', function ($scope, $q, $sessionStorage, AJAX, api, $ionicLoading, $ionicToast, $userCollectedShopList, $shopCollect, $filter, $shopFloor,$quickSort) {
            //类型配需相关
            //楼层
            $scope.levelName = '楼层';
            $scope.setLevelName = function (item) {
                $scope.levelName = item.name;
                $scope.levelCode = item.code;
            };
            $scope.levelArr = [{name: "不限", code: ''}];
            //筛选出 楼层/类型 信息,返回楼层arr
            $shopFloor().then(function (levelArr) {
                if (!levelArr) {
                    $ionicToast.show("获取楼层信息出错!");
                } else {
                    $scope.levelArr.extend(levelArr);
                    // $scope.levelArr = levelArr;
                }
            },function (errText) {
                $ionicToast.show("获取楼层信息出错!");
            });
            //类型
            $scope.typeName = '类型';
            $scope.typeCode = '';
            $scope.setTypeName = function (item) {
                $scope.typeName = item.name;
                $scope.typeCode = item.code;
                statusFilterFn();
            };
            $scope.typeArr = [
                {name: $filter('industryCodeToName')(''), code: ''}
                , {name: $filter('industryCodeToName')('sc_industry_1'), code: 1}
                , {name: $filter('industryCodeToName')('sc_industry_2'), code: 2}
                , {name: $filter('industryCodeToName')('sc_industry_3'), code: 3}
                , {name: $filter('industryCodeToName')('sc_industry_4'), code: 4}
                , {name: $filter('industryCodeToName')('sc_industry_5'), code: 5}
            ];
            //收藏时间
            $scope.orderName = '收藏时间';
            $scope.orderCode = 'asc';
            $scope.setOrderName = function (item) {
                $scope.orderName = item.name;
                $scope.orderCode = item.code;
                statusFilterFn();
            };
            $scope.orderArr = [
                {name: "默认", code: "asc"},
                {name: "升序", code: "asc"},
                {name: "降序", code: "desc"}
            ];

            /**
             * tab筛选对象(这部分只能通过在总列表中筛选)
             * */
            function statusFilterFn() {
                var datafilter = {
                    // industryid:$scope.typeCode
                };
                getShopList().then(function () {
                    // console.log(collectedList)
                    collectedList = $filter('filter')(collectedList,datafilter);
                    // console.log(collectedList)
                    collectedList = $quickSort(collectedList,$scope.orderCode,"collectdate");
                    $scope.dataToDisplay = collectedList;
                    // console.log($scope.dataToDisplay)
                })
            }


            /**
             * 取消收藏,收藏按钮操作
             * 第一次查找的时候,默认加载收藏的店铺
             * */
            $scope.changeCollectionState = function ($event, item) {
                $ionicLoading.show();
                var $target =  angular.element($event.target);
                $shopCollect($target, item).finally(function () {
                    $ionicLoading.hide();
                });
            };

            /**
             * 获取个人收藏列表
             * */
            $scope.dataToDisplay = [];
            var collectedList = [];

            function getShopList() {
                $ionicLoading.show();
                return $userCollectedShopList().then(function (data) {
                    collectedList = data;
                    angular.forEach(collectedList, function (value, index) {
                        value.iscollect = 1;
                    });
                }, function (errText) {
                    $ionicToast.show("获取个人收藏列表失败!")
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }

            /**
             * 每次页面切换刷新列表
             * */
            $scope.$on("$stateChangeSuccess", function (event,toState, toParams, fromState, fromParams, error) {
                if(toState.name == 'subNav.memberCollection'){
                    statusFilterFn();
                }
            });


        }]);

})();