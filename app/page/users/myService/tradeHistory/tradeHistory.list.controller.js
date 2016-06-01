/**
 * Created by xiangsongtao on 16/3/16.
 * 我的服务-线上缴费记录-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('tradeListCtrl', ['$scope','$getTradeHistory','$ionicLoading','$sessionStorage',function ($scope,$getTradeHistory,$ionicLoading,$sessionStorage) {

            console.log("获取线上缴费记录")
            /**
             * 获取线上缴费记录
             * */
            $scope.dataToDisplay;

            getTradeHistory();


            // console.log($filter("during_HHmm_cn")(3600*2 + 12*60));


            /**-----------------参数-------------**/
            /**
             * 向外显示的列表
             * */
            $scope.dataToDisplay = [];

            /**
             * 页面进入的时候,查询会员的卡券列表和礼品列表
             * */

            var start = 1;
            var findNum = 7;
            $scope.findNum = findNum;





            // $scope.$on("$stateChangeSuccess", function (event, toState) {
            //     if (toState.name == 'subNav.memberCoupon') {
            //         reloadMore();
            //     }
            // });


            /**----------------loadMore-------------------**/
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
                $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    $ionicLoading.hide();
                });
            }



            /**-----------getCouponList----------------------**/
            /**
             * 查询某人的卡券列表
             * categorycode:string,卡券类型值，如有多个，以逗号区分，如‘1,2,4’;传null或者空，则会获取所有卡券类型
             * column:排序的字段名称
             * type:降序desc,升序asc
             * */
            function getTradeHistory(_start, _findNum) {
                _start || (_start = 1);
                _findNum || (_findNum = 999);
                start++;
                return $getTradeHistory({
                    "condition": {
                        "custid": parseInt($sessionStorage.userInfo.customerid),
                        "page": {
                            "index": _start,
                            "num": _findNum
                        }
                    }
                })
            }



            // function getTradeHistory(){
            //     return $getTradeHistory({
            //         "condition": {
            //             // "custid": $sessionStorage.userInfo.customerid
            //             "custid": 123,
            //             "page": {
            //                 "index": 1,
            //                 "num": 999
            //             }
            //         }
            //     }).then(function (data) {
            //         console.log('queryPayment')
            //         console.log(data);
            //         $scope.dataToDisplay = data;
            //     },function (errText) {
            //         $ionicToast.show("获取线上缴费记录失败," + errText)
            //     })
            // }




































        }]);
})();
