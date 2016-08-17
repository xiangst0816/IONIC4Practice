/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.page')

    /**
     * 用$ionicLoading改造出$ionicToast提示
     * */
        .factory("$ionicToast", ['$timeout', '$rootScope', '$log', function ($timeout, $rootScope, $log) {
            //传入参数有两种情况
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

            function showToast(argsArray) {
                //1. 字符串,表示toast要显示的
                //2. 配置参数options,表示需要对options进行配置
                var _during = (angular.isArray(argsArray) && argsArray.length > 1 && !!argsArray[1]) ? argsArray[1] : 1300;
                var _interval = (angular.isArray(argsArray) && argsArray.length > 2 && !!argsArray[2]) ? argsArray[2] : 300;
                //拿牌
                _token = false;
                //取第一个
                var noticeToShow = _contentBox.shift();
                //填入
                _innerHtml = '<div class="toaster"><span>' + noticeToShow + '</span></div>';
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
                    }, _interval)
                }, _during);
            };
            //设置监听 事件请求
            $rootScope.$on("toastRequest", function (event, data) {
                //将消息推到末尾
                _contentBox.push(data[0]);
                if (_token) {
                    showToast(data);
                }
            });
            //设置监听 事件完成
            $rootScope.$on("toastComplete", function () {
                if (_contentBox.length > 0) {
                    showToast();
                }
            });
            // $rootScope.$on("$locationChangeSuccess",function () {
            //     console.log("$locationChangeSuccess");
            //     console.log(_contentBox)
            //
            // });
            //
            // $rootScope.$on("toastAbandon",function () {
            //
            // });

            return {
                show: function () {
                    if (arguments[0] && angular.isString(arguments[0])) {
                        var argsArray = Array.prototype.slice.call(arguments);
                        $log.debug("$ionicToast:" + argsArray);
                        //如果第一个参数是字符串,则显示
                        $rootScope.$broadcast("toastRequest", argsArray);

                    } else {
                        $rootScope.$broadcast("toastRequest", "操作失败!");
                        $log.error('注意使用方法: $ionicToast.show("string")!');
                        // console.log('注意使用方法: $ionicToast.show("string")!');
                        return false
                    }
                }
            }
        }])
})();
