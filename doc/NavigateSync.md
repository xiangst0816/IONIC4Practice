浏览器导航栏与APP内导航栏同步
===============

##问题点： 

- 在开发微信微官网的时候，会同时存在两个导航栏的情况：微信自带导航栏和WebApp内建导航栏。按照常理两者导航结果要同步才能达到体验一致的效果。
- ionic使用的导航方式永远都是在新增历史记录（$ionicHistory.goBack(-1)）,而浏览器原生的导航则是在历史记录中有前有后的跳转,因而使用$ionicHistory会在用户操作的过程出现导航不同步的现象
- "返回"可以用history.go(-1)解决，但是“返回首页”的问题就有些棘手，因为返回首页的另一个意思就是，返回历史记录的第一个页面，如果第一个页面不是“home”，那就将第一个页面换成“home”。

## 解决方案：

- 内建历史记录的数组，path改变就对内建历史记录进行更新，东西不难拿笔画画流程就清楚了。
- 方法backToHome返回首页，goBack后退，HistoryArr维护历史记录。 
- 上面两个方法挂载到mainCtrl根控制器的$rootScope下,这样的话在别的controller中也可手动调用此方法。


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