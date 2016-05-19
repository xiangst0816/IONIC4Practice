/**
 * Created by xiangsongtao on 16/4/17.
 * 首页行星自定义组件(指令)
 */
(function () {
    angular.module('smartac.directives')
    //ionPlanetBox外层总容器
        .directive('ionPlanet', [function () {
            return {
                restrict: 'E',
                // scope: {
                //     planetNum: '@',
                //     circleWidth:'@'
                // },
                controller: ['$scope', '$element', '$attrs','$ionicScrollDelegate', function ($scope, $element, $attrs,$ionicScrollDelegate) {
                    /**
                     * 每个行星定位
                     * */
                    var swiperInnerBox = document.querySelectorAll('.index-bottom-swiper-eachBox');
                    //html的font-size值
                    var baseFontSize = document.documentElement.style.fontSize;
                    //虚线轨迹直径(rem),
                    var circleWidth = 8.62;//rem
                    circleWidth = parseFloat(circleWidth) * parseFloat(baseFontSize);
                    var circleRadius =  Math.floor((circleWidth / 2)*100)/100;
                    //导航栏目个数
                    var itemCount = 6;
                    var regEach = 2 * Math.PI / itemCount;
                    var reg = Math.PI;

                    //确定每一个行星的位置
                    for (var i = 0; itemCount > i; i++) {
                        //如果特别小,在手机端会出现bug,保留2位小数
                        var sinx = Math.floor(Math.sin(reg) * circleRadius * 100) / 100;
                        var cosx = Math.floor(Math.cos(reg) * circleRadius * 100) / 100;

                        //每个行星的宽度 = 设定的rem值 * html的font-size值
                        var swiperEachBoxWidth = 1.85;//rem
                        swiperEachBoxWidth = parseFloat(swiperEachBoxWidth) * parseFloat(baseFontSize);
                        cssText =
                            'left:' + (circleRadius + sinx - swiperEachBoxWidth / 2) + 'px;' +
                            'top:' + (circleRadius + cosx - swiperEachBoxWidth / 2) + 'px;';
                        swiperInnerBox[i].style.cssText = cssText;
                        reg = reg - regEach;
                    }


                    /**
                     * 控制每个行星旋转
                     * */
                    var swiperEachBoxi = document.querySelectorAll('.index-bottom-swiper-eachBox-i');
                    //滑动处理函数
                    var rotateNow = 0;
                    //找到行星轨迹的虚线DOM
                    var swiperInner = document.getElementById('index-bottom-swiper-inner');
                    $scope.swipeRight = function () {
                        // document.ontouchmove = function(e){e.preventDefault(); };
                        rotateNow = rotateNow + 360 / itemCount;
                        //console.log(rotateNow)
                        swiperInner.style.webkitTransform = "rotate(" + parseFloat(rotateNow) + "deg)";
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.webkitTransform = "rotate(" + parseFloat(rotateNow * -1) + "deg)";
                        }
                        showORNot();
                    };
                    $scope.swipeLeft = function () {
                        // document.ontouchmove = function(e){e.preventDefault(); };
                        rotateNow = rotateNow - 360 / itemCount;
                        //console.log(rotateNow)
                        swiperInner.style.webkitTransform = "rotate(" + parseFloat(rotateNow) + "deg)";
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.webkitTransform = "rotate(" + parseFloat(rotateNow * -1) + "deg)";
                        }
                        showORNot();
                    };
                    /**
                     * 兼容微信那套
                     * */
                    $scope.onTouch = function () {
                        document.ontouchmove = function(e){e.preventDefault(); };
                    };
                    $scope.onRelease = function () {
                        document.ontouchmove = angular.noop();
                    };

                    //隐藏底部的三个行星不显示
                    showORNot();
                    /**
                     * 隐藏底部的三个行星不显示
                     * */
                    function showORNot() {
                        var a = rotateNow / (360 / itemCount);
                        var whichTop;

                        //向右转,角度为正
                        if (a > 0 || a == 0) {
                            if (a > itemCount - 1) {
                                whichTop = a % itemCount;
                            } else {
                                whichTop = a;
                            }
                        } else {
                            //  向左转,角度为负
                            if (Math.abs(a) > itemCount) {
                                whichTop = itemCount + a % (itemCount);
                                if (whichTop == itemCount) {
                                    whichTop = 0;
                                }
                            } else {
                                whichTop = itemCount + a;
                            }
                        }
                        //隐藏底部的三个元素
                        var a, b, c;
                        //whichTop
                        switch (whichTop) {
                            case 0:
                                a = 2;
                                b = 3;
                                c = 4;
                                break;
                            case 1:
                                a = 1;
                                b = 2;
                                c = 3;
                                break;
                            case 2:
                                a = 0;
                                b = 1;
                                c = 2;
                                break;
                            case 3:
                                a = 5;
                                b = 0;
                                c = 1;
                                break;
                            case 4:
                                a = 4;
                                b = 5;
                                c = 0;
                                break;
                            case 5:
                                a = 3;
                                b = 4;
                                c = 5;
                                break;
                        }
                        for (var i = 0; swiperInnerBox.length > i; i++) {
                            swiperInnerBox[i].style.opacity = 1;
                        }
                        swiperInnerBox[a].style.opacity = 0;
                        swiperInnerBox[b].style.opacity = 0;
                        swiperInnerBox[c].style.opacity = 0;

                        console.log(whichTop)
                    }

                }]
            }
        }])
})();