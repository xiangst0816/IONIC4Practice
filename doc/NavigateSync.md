浏览器导航栏与APP内导航栏同步
===============

##问题点： 

>ionic使用的导航方式永远都是在新增历史记录,而浏览器原生的导航则是在历史记录中有前有后的跳转,因而会在用户操作的过程出现不同步的现象

## 解决方案：

这里实现了"后退"和"返回首页"两个方法,方法挂载到mainCtrl根控制器的$rootScope下,这样的话在
别的controller中也可手动调用此方法。

```
 angular.module('smartac.controllers')
        .controller('mainCtrl', ['$scope', '$sessionStorage', '$state', '$ionicHistory', '$rootScope', '$log', '$timeout', '$window', '$location', function ($scope, $sessionStorage, $state, $ionicHistory, $rootScope, $log, $timeout, $window, $location) {
            /**
             * 定义后退和返回操作
             * */
            $rootScope.HistoryArr = [];
            $rootScope.$on("$locationChangeSuccess", function () {
                var currentPath = $location.path();
                //倒数第一个
                var back1Path = $rootScope.HistoryArr[$rootScope.HistoryArr.length-1];
                //如果是后退的情况,则不记录历史记录
                if($rootScope.HistoryArr.length>1){
                    //倒数第二个
                    var back2Path = $rootScope.HistoryArr[$rootScope.HistoryArr.length-2];
                    if(currentPath != back1Path){
                        if(currentPath != back2Path){
                            //前进状态
                            $rootScope.HistoryArr.push(currentPath);
                        }else{
                            //激活了浏览器的后退,这里只需要更新状态
                            $rootScope.HistoryArr.length = $rootScope.HistoryArr.length-1;
                        }
                    }else{
                        //当前状态就是数组的最后一个,这里不做处理
                    }
                }else{
                    if(back1Path != currentPath){
                        $rootScope.HistoryArr.push(currentPath);
                    }
                }
            });

            /**
             * backToHome
             * */
            $rootScope.backToHome = function () {
                var len = $rootScope.HistoryArr.length;
                //截断
                $rootScope.HistoryArr.length = 1;
                //直接回到第一个页面,一定是主页
                //如果不是home则转到home
                //因为bug,无奈之举
                if( $rootScope.HistoryArr[0] != "/home"){
                    $rootScope.HistoryArr.length = 0;
                    $location.path('/home');
                }else{
                    $window.history.go(1 - len);
                }
                angular.element(document.getElementById('member')).removeClass('showMember');
            };


            /**
             * 定义上一个视图,受体在subNavPage.html
             * */
            $rootScope.goBack = function (step) {
                !step && (step = 1);
                step = parseInt(step);
                if(isNaN(step)){
                    return "step must be a number";
                }
                //截断
                $rootScope.HistoryArr.length = $rootScope.HistoryArr.length-step;
                $window.history.go(-(step));
            };


        }]);
```