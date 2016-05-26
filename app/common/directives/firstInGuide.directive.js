/**
 * Created by xiangsongtao on 16/5/25.
 */
(function () {
    angular.module('smartac.page')
        .directive('firstInGuide', ['$ionicBackdrop', '$localStorage', function ($ionicBackdrop, $localStorage) {
            return {
                restrict: 'A',
                compile: function (ele) {
                    var guideInfo = $localStorage.guideInfo;
                    if (!guideInfo || guideInfo.isFirstTime) {
                        var $body = angular.element(document.getElementsByTagName('body')[0]);
                        $body.append('<div id="firstGuideBox" first-in class="firstGuideBox"><div class="userGuideBox"><img src="img/loading/usercenterGuide.png" alt=""></div><div class="planetGuideBox"><img src="img/loading/planetGuide.png" alt=""></div>');
                        $ionicBackdrop.retain();

                        //记录
                        $localStorage.guideInfo = {
                            isFirstTime:false
                        };

                        //移除
                        var $showShareDark = angular.element(document.getElementById('firstGuideBox'));
                        $showShareDark.on("touchend", function () {
                            $showShareDark.remove();
                            // 必须release两次
                            $ionicBackdrop.release();
                            $ionicBackdrop.release();
                        });
                    }
                }
            };
        }])
})();