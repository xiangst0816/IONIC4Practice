/**
 * Created by xiangsongtao on 16/5/25.
 * 设置app首次进入时,首页silder页和使用引导页
 * 只在home页显示,如果进入后跳转到其余页则隐藏,但是返回home还是会显示
 *
 */
(function () {
    angular.module('smartac.page')
        .directive('firstInGuide', ['$localStorage', '$timeout', '$state','$ionicSlideBoxDelegate', function ($localStorage, $timeout, $state,$ionicSlideBoxDelegate) {
            return {
                restrict: 'E',
                // template: '<div id="firstGuideBox" class="firstGuideBox"><div class="userGuideBox"><img src="img/loading/usercenterGuide.png" alt=""></div><div class="planetGuideBox"><img src="img/loading/planetGuide.png" alt=""></div>',
                templateUrl:'tpl/firstInGuide.html',
                replace: true,
                compile:function ($element) {
                    var guideInfo = $localStorage.guideInfo;
                    $timeout(function () {
                        if ($state.is("home") && (!guideInfo || guideInfo.isFirstTime)) {
                            $element.addClass("beforeActive active");
                        }
                    },0,false);
                },
                controller: ['$scope', '$element', function ($scope, $element) {
                    $scope.$on("$stateChangeSuccess", function () {
                        //必须放到异步队列中
                        $timeout(function () {
                            var guideInfo = $localStorage.guideInfo;
                            //只在主页显示
                            if ($state.is("home") && (!guideInfo || guideInfo.isFirstTime)) {
                                //满足显示条件
                                // $element.addClass("beforeActive active");
                                var $userSilder = $element.children("#userSilder");
                                $scope.silderEnd = function () {
                                    removeObj($userSilder);
                                };
                                $scope.closeGuide = function () {
                                    removeObj($element);
                                    $timeout(function () {
                                        $element.remove();
                                    }, 300, true);
                                    //设置已读
                                    $localStorage.guideInfo = {
                                        isFirstTime: false
                                    };
                                };
                            } else {
                                removeObj($element);
                            }
                        }, 20, true);
                    });

                    /**
                     * 设置背景颜色
                     * */
                    $scope.onSlideChange = function ($event) {
                        var currentIndex = $ionicSlideBoxDelegate.currentIndex();
                        var $userSilderBox = angular.element(document.getElementById('userSilderBox'));
                        if(currentIndex == 0){
                            $userSilderBox.css({"background": "#1898d2"})
                        }else if(currentIndex == 2){
                            $userSilderBox.css({"background": "#e8ad3f"})
                        }
                    };

                    /**
                     * 移除active类
                     * */
                    function removeObj($obj) {
                        $obj.removeClass("active");
                        $timeout(function () {
                            $obj.removeClass("beforeActive");
                        }, 300, false);
                    }
                }]
            };
        }])
})();