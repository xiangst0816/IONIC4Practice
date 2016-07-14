浏览器导航栏与APP内导航栏同步
===============

###  遇到的问题：

在开发微信微官网的时候，会同时存在两个导航栏的情况：

微信自带导航栏和WebApp内建导航栏。按照常理两者导航结果要同步才能达到体验一致的效果。但是，ionic使用的导航方式永远都是在新增历史记录，比如`ionicHistory.goBack(-1)`或者`$state.go('somewhere')`。而浏览器原生的导航则是在历史记录中有前有后的跳转,因而使用$ionicHistory会在用户操作的过程出现导航不同步的现象。

其中， "返回上一页"可以将`history.go(-1)`绑定到返回按钮上，但是“返回首页”的问题就有些棘手，你必须在历史记录中找，究竟哪个页面是你的主页，头疼！

###  解决方案：

考虑到webapp进入的特殊性，即每次进入都是主页的情况。这里，内建一个记录历史信息的数组`HistoryArr`，监听路由变化`$locationChangeSuccess`，将主页的路由放到第一位。`goBack`操作时，使用`history.go(-1)`；而`backToHome`操作时，`history.go(whereHomeIs)`，这样思路就比较清晰了。

上面两个方法我会挂载到mainCtrl根控制器的$rootScope下,这样的话在别的controller中也可手动调用此方法。

### 实现代码


```
 angular.module('controllers')
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