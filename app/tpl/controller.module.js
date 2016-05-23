/**
 * Created by xiangsongtao on 16/3/16.
 * 定义starter.controllers,总Controller控制器
 * 运行gulp.watch,如果js/controllers文件夹中的js文件发生改变,则将所有的controller打包合并放到js目录下.
 * index.html只引用js根目录下的controllers.js文件
 */

angular.module('smartac.controllers', ['smartac.services']);

(function () {
    // angular.module('smartac.controllers')
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
                // console.log($rootScope.HistoryArr);
                // console.log($rootScope.HistoryArr.length);
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
})();






