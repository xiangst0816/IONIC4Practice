/**
 * Created by xiangsongtao on 16/5/25.
 * 设置app首次进入时,首页silder页和使用引导页
 * 只在home页显示,如果进入后跳转到其余页则隐藏,但是返回home还是会显示
 *
 */
(function () {
    angular.module('smartac.page')
        .directive('firstInGuide', ['$localStorage', '$timeout', '$state', '$ionicSlideBoxDelegate', function ($localStorage, $timeout, $state, $ionicSlideBoxDelegate) {
            return {
                restrict: 'E',
                // template: '<div id="firstGuideBox" class="firstGuideBox"><div class="userGuideBox"><img src="img/loading/usercenterGuide.png" alt=""></div><div class="planetGuideBox"><img src="img/loading/planetGuide.png" alt=""></div>',
                templateUrl: 'tpl/firstInGuide.html',
                replace: true,
                compile: function ($element) {
                    $timeout(function () {
                        var guideInfo = $localStorage.guideInfo;
                        if ($state.is("home") && (!guideInfo || guideInfo.isFirstTime)) {
                            $element.addClass("beforeActive active");
                        }
                        if (!!guideInfo && !guideInfo.isFirstTime) {
                            $element.remove();
                        }
                    }, 0, false);
                },
                controller: ['$scope', '$element', function ($scope, $element) {
                    $scope.$on("$stateChangeSuccess", function () {
                        //必须放到异步队列中
                        $timeout(function () {
                            var guideInfo = $localStorage.guideInfo;
                            //只在主页显示
                            if ($state.is("home") && (!guideInfo || guideInfo.isFirstTime)) {
                                //满足显示条件
                                $element.addClass("beforeActive active");
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
                                $element.removeClass("beforeActive active");
                            }

                            /**
                             * 移除active类
                             * */
                            function removeObj($obj) {
                                $obj.removeClass("active");
                                $timeout(function () {
                                    $obj.removeClass("beforeActive");
                                }, 300, false);
                            }

                        }, 200, false);
                    });


                    /**
                     * 页面首次进入,则对第一个进行动画,因为页面进入会有1s延迟,故1000ms后进行动画
                     * */
                    let animated;
                    let $animated;
                    $timeout(function () {
                        animated = document.querySelectorAll('.animated');
                        $animated = Array.prototype.slice.call(animated);
                        animateBox(0);
                    }, 1000, false);

                    /**
                     * 设置页面切换动作(背景颜色,进行动画)  firstGuideBoxSlide
                     * */
                    // let animated = document.querySelectorAll('.animated');
                    // let $animated = Array.prototype.slice.call(animated);
                    $scope.onSlideChange = ($index)=> {
                        //当前第$index个盒子想要进行动画


                        let currentIndex = $ionicSlideBoxDelegate.$getByHandle('firstGuideBoxSlide').currentIndex();
                        animateBox($index);

                        // var $animated_index = angular.element(document.querySelectorAll('.animated')[$index]);
                        //
                        // $animated_index.addClass('show');
                        // $timeout(function () {
                        //     $animated.removeClass('show');
                        // },300,false);
                        //
                        // let currentIndex = $ionicSlideBoxDelegate.$getByHandle('firstGuideBoxSlide').currentIndex();
                        // var $userSilderBox = document.getElementById('userSilderBox');
                        // if (parseInt(currentIndex) === 0) {
                        //     $userSilderBox.style.background = "#1898d2";
                        // } else if (parseInt(currentIndex) === 2) {
                        //     $userSilderBox.style.background = "#e8ad3f";
                        // }
                    };

                    //当前第$index个盒子想要进行动画

                    let timeouts = [] ;
                    let timeout;
                    function animateBox($index) {
                        // console.log($index)
                        // console.log($animated)

                        // console.log("timeout运行:"+isTimeoutRunning(timeouts))
                        // 如果进入这里,意味着我需要出发当前页面的动画,但是,如果进入
                        // 这个页面时,这个页面有timeout还未执行,则此页进入后加上show类,但是随后
                        // timeout会将show类取消,也就不显示,现在这样做是为了修复此bug
                        // 如果用户快速进入第二页,但是timeout时间还未到,则删除上一页留下的状态,
                        // 页面重新动画
                        if(!!isTimeoutRunning(timeouts)){
                            for(let timeoutEach of timeouts){
                                $timeout.cancel(timeoutEach);
                            }
                            $animated.forEach(function (box,i) {
                                box.classList.remove("show");
                            })
                        }
                        timeouts = [];
                        $animated.forEach(function (box, i) {
                            if (i === $index) {
                                box.classList.add("show");
                            } else {
                                timeout = $timeout(function () {
                                    box.classList.remove("show");

                                }, 300, false);
                                timeouts.push(timeout);
                            }
                        });

                        function isTimeoutRunning(timeouts) {
                            //timeout.$$state.status
                            // 0: timeout正在进行; 1: timeout已完成
                            for(let timeout of timeouts){
                                // console.log(timeout.$$state.status);
                                if(!timeout.$$state.status){
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }]
            };
        }])
})();