/**
 * Created by xiangsongtao on 16/4/17.
 * 首页行星自定义组件(指令)
 */
(function () {
    angular.module('smartac.page')
    //ionPlanetBox外层总容器
        .directive('ionPlanet', ['$timeout',function ($timeout) {
            return {
                restrict: 'E',
                // scope: {
                //     planetNum: '@',
                //     circleWidth:'@'
                // },
                controller: ['$scope', '$log', function ($scope, $log) {
                    /**
                     * 每个行星定位
                     * */
                    var swiperInnerBox = document.querySelectorAll('.index-bottom-swiper-eachBox');
                    //html的font-size值
                    var baseFontSize = document.documentElement.style.fontSize;
                    //虚线轨迹直径(rem),
                    var circleWidth = 7.8;//rem
                    circleWidth = parseFloat(circleWidth) * parseFloat(baseFontSize);//px
                    var circleRadius = Math.floor((circleWidth / 2) * 100) / 100;
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

                        swiperInner.style.webkitTransform = "rotate(" + parseFloat(rotateNow) + "deg)";
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.webkitTransform = "rotate(" + parseFloat(rotateNow * -1) + "deg)";
                        }
                        // showORNot();
                    };

                    //转动之前的状态
                    var rotateBefore = 0;
                    //转动之后的状态
                    var rotateNext = 0;
                    //正在转动的状态
                    var rotateNow = 0;
                    //当前转动百分比
                    var percent = 0;
                    //每次转动的固定角度(6个行星60度)
                    var rotateEachDeg = 360 / itemCount;
                    //滑动速度
                    var velocityX

                    $scope.onTouch = function () {
                        document.ontouchmove = function (e) {
                            e.preventDefault();
                        };
                    }

                    $scope.onDrag = function (e) {
                        percent = parseFloat(e.gesture.deltaX * 2 / circleWidth);
                        rotateNow = parseInt(rotateBefore + rotateEachDeg * percent);
                        velocityX = e.gesture.velocityX;
                        requestAnimationFrame(move);
                    }
                    $scope.onRelease = function () {
                        $timeout(function () {
                            document.ontouchmove = angular.noop();
                        },300,false);
                        //
                        if (parseInt(Math.abs(percent * 100)) < 90 || velocityX >0.6) {
                            moveBack();
                        } else {
                            moveNext();
                        }
                    }

                    function move() {
                        swiperInner.style.cssText = 'transform: rotate(' + parseFloat(rotateNow) + 'deg)';
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.cssText = 'transform: rotate(' + parseFloat(-rotateNow) + 'deg)';
                        }
                    }

                    function moveNext() {
                        //判断下一个的位置,是左边还是右边
                        if (rotateNow > rotateBefore) {
                            //右边
                            console.log("右边");
                            rotateNext = rotateBefore + rotateEachDeg;

                        } else {
                            //左边
                            console.log("左边");
                            rotateNext = rotateBefore - rotateEachDeg;
                        }
                        animate(rotateNext);
                        rotateBefore = rotateNext;
                    }

                    function moveBack() {
                        animate(rotateBefore);
                    }

                    function animate(rotate) {
                        swiperInner.style.cssText = 'transform: rotate(' + parseFloat(rotate) + 'deg);transition-duration: 300ms';
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.cssText = 'transform: rotate(' + parseFloat(-rotate) + 'deg);transition-duration: 300ms';
                        }
                        $timeout(function () {
                            rotateNext = 0;
                            rotateNow = 0;
                            percent = 0;
                        },300,false);
                    }


                    //隐藏底部的三个行星不显示
                    // showORNot();
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

                        $log.debug("index为" + whichTop + "的行星在中间");

                        applyAnimation(whichTop);
                    }

                    /**
                     * 增加顶上元素果冻动画效果
                     *
                     */
                    function applyAnimation(whichTop) {

                        var which;

                        //计算出顶上元素在数组中的位置
                        if (whichTop === 0) {
                            which = 0
                        } else {
                            which = 6 - whichTop
                        }

                        //将NodeList转成真正数组
                        var swiperInnerBoxArr = Array.prototype.slice.call(swiperInnerBox);

                        //增加动画类
                        swiperInnerBoxArr.forEach(function (box, i) {
                            i === which ? box.classList.add("animation-jelly") : box.classList.remove("animation-jelly")
                        })
                    }
                }]
            }
        }])
})();