/**
 * Created by xiangsongtao on 16/3/16.
 * 我的服务-线上缴费记录-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('tradeListCtrl', ['$scope','$getParkingHistory','$ionicLoading','$sessionStorage',function ($scope,$getParkingHistory,$ionicLoading,$sessionStorage) {
            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */

            var start = 1;
            var findNum = 15;
            $scope.findNum = findNum;


            /**
             * loadMore
             * 返回promise
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded && !$scope.isSearching) {
                    $scope.isSearching = true;
                    return getTradeHistory(start, findNum).then(function (data) {
                        //当返回数量不足或返回为空，则数据已全部加载完毕
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


            /**-----------------每次页面进入刷新列表-------------**/
            /**
             * 每次页面进入刷新列表
             * */
            reloadMore();


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
                $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    $ionicLoading.hide();
                });
            }



            function getTradeHistory(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);
                start++;
                return $getParkingHistory({
                    "condition": {
                        "custid": parseInt($sessionStorage.userInfo.customerid),
                        "page": {
                            "index": _start,
                            "num": _findNum
                        }
                    }
                })
            }
        }]);
})();
