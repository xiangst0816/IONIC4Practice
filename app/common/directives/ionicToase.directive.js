/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.page')

    /**
     * 用$ionicLoading改造出$ionicToast提示
     * */
        .factory("$ionicToast", ['$timeout','$rootScope', function ($timeout,$rootScope) {
            //传入参数有两种情况
            var _params = {
                during:1300,//ms
                interval:300//ms
            };
            //1. 字符串,表示toast要显示的
            //2. 配置参数options,表示需要对options进行配置
            var _during = _params.during;//ms
            var _interval = _params.interval;//ms
            var _contentBox = [];
            var _token = true;
            //将内容布置好
            //<div id="toaster-container"><div class="toaster"><span>text</span></div></div>
            var _outerHtml = '<div id="toaster-container"></div>';
            var _innerHtml;
            //上传
            angular.element(document.body).append(_outerHtml);
            //定位
            var $toasterContainer = angular.element(document.getElementById('toaster-container'));
            var showToast = function () {
                //拿牌
                _token = false;
                //取第一个
                var noticeToShow = _contentBox.shift();
                //填入
                _innerHtml = '<div class="toaster"><span>'+noticeToShow + '</span></div>';
                //清空 上膛
                $toasterContainer.empty().append(_innerHtml).addClass('visible active');
                //定时后取消显示
                $timeout(function () {
                    $toasterContainer.removeClass("active");
                    $timeout(function () {
                        $toasterContainer.removeClass('visible');
                        //归还牌子
                        _token = true;
                        //广播事件
                        $rootScope.$broadcast("toastComplete");
                    },_interval)
                },_during);
            };
            //设置监听 事件请求
            $rootScope.$on("toastRequest",function (event,data) {
                //将消息推到末尾
                _contentBox.push(data);
                if(_token){showToast();}
            });
            //设置监听 事件完成
            $rootScope.$on("toastComplete",function () {
                if(_contentBox.length > 0){showToast();}
            });

            return {
                show: function () {
                    if(arguments[0] && angular.isString(arguments[0])){
                        //如果第一个参数是字符串,则显示
                        $rootScope.$broadcast("toastRequest",arguments[0]);
                    }else {
                        $rootScope.$broadcast("toastRequest","操作失败!");
                        console.log('注意使用方法: $ionicToast.show("string")!');
                        // console.log('注意使用方法: $ionicToast.show("string")!');
                        return false
                    }
                }
            }
        }])
})();
