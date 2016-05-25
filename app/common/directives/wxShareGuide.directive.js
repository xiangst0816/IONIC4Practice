/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
        .directive('wxShareguide', ['$ionicBackdrop', function ($ionicBackdrop) {
            return {
                restrict: 'A',
                compile: function (ele) {
                    ele.on("touchend", function () {
                        if (Internal.isInWeiXin) {
                            //添加
                            var $body =  angular.element(document.getElementsByTagName('body')[0]);
                            $body.append('<div id="showShareDark" class="action"><img src="img/other/share.png" alt=""></div>');
                            $ionicBackdrop.retain();
                            //移除
                            var $showShareDark = angular.element(document.getElementById('showShareDark'));
                            $showShareDark.on("touchend", function () {
                                $showShareDark.remove();
                                // 必须release两次
                                $ionicBackdrop.release();
                                $ionicBackdrop.release();
                            });
                        }
                    });
                }
            };
        }])
})();