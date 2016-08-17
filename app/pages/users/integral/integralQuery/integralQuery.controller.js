/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分-积分查询 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('integralQueryCtrl', ['$scope', '$ionicToast', 'AJAX',  '$sessionStorage', '$state', '$ionicLoading', '$q', '$filter', '$integralQuery', '$getCode', '$log', '$integralInfo', '$toDayBegin', '$toDayEnd', '$rootScope','$getDuePoint', function ($scope, $ionicToast, AJAX,  $sessionStorage, $state, $ionicLoading, $q, $filter, $integralQuery, $getCode, $log, $integralInfo, $toDayBegin, $toDayEnd, $rootScope,$getDuePoint) {

            //查询起止日期
            $scope.params = {
                datefrom: '',
                dateto: ''
            };
            //只是显示的部分记录
            $scope.dataToDisplay = [];
            //一次显示积分条数
            var findNum = 10;
            $scope.findNum = findNum;
            //start
            var start = 1;


            /**
             * 查询积分记录
             * */
            $scope.searchIntegralHistory = function () {

                if (!$scope.params.datefrom) {
                    $ionicToast.show("亲~搜索前请完善开始日期!");
                    return
                }
                if (!$scope.params.dateto) {
                    $ionicToast.show("亲~搜索前请完善结束日期!");
                    return
                }
                //自动将起止日期兑换,如果起始日期大于终止日期
                if ($scope.params.datefrom > $scope.params.dateto) {
                    var tpl = $scope.params.datefrom;
                    $scope.params.datefrom = $scope.params.dateto;
                    $scope.params.dateto = tpl;
                }
                //终止日期需要延长到当天23点59分
                //开始日期的零点到终止日期的24点
                $scope.params.datefrom = $toDayBegin($scope.params.datefrom);
                $scope.params.dateto = $toDayEnd($scope.params.dateto);
                //查询
                $ionicLoading.show();
                reloadMore().finally(function () {
                    $ionicLoading.hide();
                })
            };


            /**
             * 获得页面显示的数据,使用$q方法
             * */
            //获得积分过期时间
            $scope.deadline = {
                year: '',
                month: '',
                day: ''
            };


            $scope.$on("$stateChangeSuccess", function () {
                if ($state.is("subNav.memberIntegralQuery")) {
                    $log.debug("页面进入进行积分记录列表查询");

                    init();
                }
            });


            /**
             * 首次加载需要确定数据获取成功,使用$q函数
             * */
            function init(){
                $ionicLoading.show();
                $q.all([getIntegralDeadline(), totalIntegral()]).then(function () {
                    //预设时间,四个月前
                    var datefrom = new Date((parseInt((new Date().getTime() / 1000) - parseInt(60 * 60 * 24 * 30 * 4))) * 1000);
                    var dateto = new Date();
                    $scope.params.datefrom = $toDayBegin(datefrom);
                    $scope.params.dateto = $toDayEnd(dateto);
                    //查询
                    reloadMore();
                }, function () {
                    //如果失败
                    $scope.moreDataCanBeLoaded = false;
                    $rootScope.goBack();
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }


            /**
             * loadMore
             * */
            $scope.loadMore = function () {
                if ($scope.moreDataCanBeLoaded && !$scope.isSearching) {
                    $scope.isSearching = true;
                    return getIntegralHistory(start, findNum).then(function (data) {
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
                document.getElementById('infiniteScroll').classList.add("active");
                // $ionicLoading.show();
                //执行
                return $scope.loadMore().finally(function () {
                    // $ionicLoading.hide();
                });
            }


            /**
             * 获取积分列表
             *
             * 传入起始值和查找值
             * */
            function getIntegralHistory(_start, _findNum) {
                var defer = $q.defer();
                start++;
                $integralQuery({
                    "conditions": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "begindate": $filter('yyyyMMdd_HHmmss_minus')($scope.params.datefrom),
                        "enddate": $filter('yyyyMMdd_HHmmss_minus')($scope.params.dateto),
                        "querytype": "main",
                        "page": {
                            "index": _start,
                            "num": _findNum
                        },
                        "sort": {
                            "column": "gettime",
                            "type": "desc"
                        }
                    }
                }).then(function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }

            /**
             * 获取当前可用积分
             * */
            function totalIntegral() {
                return $integralInfo().then(function (data) {
                    $scope.totalIntegral = data.currenttotalnum
                })
            }

            /**
             * 获得积分过期时间
             * */
            function getIntegralDeadline() {
                return $getDuePoint().then(function (data) {

                    $scope.duepoint = parseInt(data.duepoint);
                    $scope.duedate = data.duedate;
                    // $scope.deadline.year = data.duepoint;
                    // $scope.deadline.month = data.duepoint;
                    // $scope.deadline.day = data.duepoint;


                    // if (codeList.length > 0) {
                    //     for (var i = 0, len = codeList.length; len > i; i++) {
                    //         if (codeList[i].keyname == 'pointreset_date') {
                    //             var deadline = codeList[i].keycode.toString();
                    //             break;
                    //         }
                    //     }
                    //     //处理月日
                    //     if (deadline.length == 3) {
                    //         //203的情况2月3日
                    //         $scope.deadline.month = parseInt(deadline.substr(0, 1));
                    //         $scope.deadline.day = parseInt(deadline.substr(1, 2));
                    //     } else {
                    //         //1203的情况12月3日
                    //         $scope.deadline.month = parseInt(deadline.substr(0, 2));
                    //         $scope.deadline.day = parseInt(deadline.substr(2, 2));
                    //     }
                    //     //处理年
                    //     var monthNow = parseInt(new Date().getMonth() + 1);
                    //     var dayNow = parseInt(new Date().getDate());
                    //     if ($scope.deadline.month >= monthNow && $scope.deadline.day >= dayNow) {
                    //         $scope.deadline.year = parseInt(new Date().getFullYear());
                    //     } else {
                    //         $scope.deadline.year = parseInt(new Date().getFullYear()) + 1;
                    //     }
                    //
                    // } else {
                    //     //默认值
                    //     $scope.deadline.year = new Date().getFullYear();
                    //     $scope.deadline.month = 12;
                    //     $scope.deadline.day = 30;
                    //     $log.debug("获得积分过期时间失败,当前使用默认日期,12.30");
                    // }
                }, function (err) {
                    $ionicToast.show("积分过期时间获取失败,请稍后再试!");
                });
            }
        }]);

})();
