/**
 * Created by xiangsongtao on 16/4/17.
 * 首页行星自定义组件(指令)
 */
(function () {
    angular.module('smartac.page')
    //ionPlanetBox外层总容器
        .directive('ionPlanet', ['$timeout', function ($timeout) {
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
                    var itemCount = swiperInnerBox.length;
                    //每一个的角度
                    var regEach = 2 * Math.PI / itemCount;
                    var reg = Math.PI;
                    //每个行星的宽度 = 设定的rem值 * html的font-size值
                    var swiperEachBoxWidth = 1.85;//rem
                    swiperEachBoxWidth = parseFloat(swiperEachBoxWidth) * parseFloat(baseFontSize);
                    //确定每一个行星的位置
                    for (var i = 0; itemCount > i; i++) {
                        //如果特别小,在手机端会出现bug,保留2位小数
                        var sinx = Math.floor(Math.sin(reg) * circleRadius * 100) / 100;
                        var cosx = Math.floor(Math.cos(reg) * circleRadius * 100) / 100;
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
                    var velocityX;
                    //判断是否在动画中
                    var isAnimate = false;

                    //动触摸时
                    $scope.onTouchPlanet = function () {
                        document.ontouchmove = function (e) {
                            e.preventDefault();
                        };
                    };
                    //当拖动时
                    $scope.onDrag = function (e) {
                        if (!isAnimate && Internal.isIOS) {
                            percent = parseFloat(e.gesture.deltaX * 1 / circleWidth);
                            rotateNow = parseFloat(rotateBefore + rotateEachDeg * percent);
                            // requestAnimationFrame(move);
                            move(rotateNow)
                        } else {
                            e.preventDefault();
                            // console.log("正在animate:" + isAnimate)
                            return false;
                        }

                    };
                    //当停止触控
                    $scope.onReleasePlanet = function (e) {
                        if (!isAnimate && Internal.isIOS) {
                            velocityX = e.gesture.velocityX;
                            //移动距离不会超过100%,大于50%就进入下一个
                            var min_velocityX = 0.2;
                            var max_velocityX = 1.4;
                            if (parseInt(Math.abs(percent * 100)) < 50) {
                                if (velocityX > min_velocityX && velocityX <= max_velocityX) {
                                    moveNext(1);
                                } else if (velocityX > max_velocityX) {
                                    moveNext(2);
                                } else {
                                    moveBack();
                                }
                            } else {
                                if (velocityX <= max_velocityX) {
                                    moveNext(1);
                                } else if (velocityX > max_velocityX) {
                                    moveNext(2);
                                }
                            }
                        }
                        $timeout(function () {
                            document.ontouchmove = angular.noop();
                        }, 300, false);
                    };

                    //正对安卓,不适用随手动画
                    $scope.swipeRight = function () {
                        if(Internal.isAndroid){
                            rotateNow = rotateBefore + rotateEachDeg;
                            moveNext(1);
                            showORNot();
                        }
                    };
                    $scope.swipeLeft = function () {
                        if(Internal.isAndroid){
                            rotateNow = rotateBefore - rotateEachDeg;
                            moveNext(1);
                            showORNot();
                        }
                    };

                    //转动输入的角度
                    function move(rotate) {
                        swiperInner.style.cssText = 'transform: rotate(' + (rotate) + 'deg)';
                        for (var i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.cssText = 'transform: rotate(' + (rotate * -1) + 'deg)';
                        }
                    }

                    function moveNext(a) {
                        // console.log(rotateNow + ":" + rotateBefore);
                        //判断下一个的位置,是左边还是右边
                        if (rotateNow > rotateBefore) {
                            //右边
                            // console.log("右边");
                            rotateNext = rotateBefore + rotateEachDeg * a;

                        } else {
                            //左边
                            // console.log("左边");
                            rotateNext = rotateBefore - rotateEachDeg * a;
                        }
                        // console.log('rotateNext')
                        // console.log(rotateNext)
                        animate(rotateNext);
                        rotateBefore = rotateNext;
                        showORNot();
                    }


                    function moveBack() {
                        animate(rotateBefore);
                        showORNot();
                    }

                    function animate(rotate) {
                        isAnimate = true;
                        $timeout(function () {

                            // console.log(rotate)
                            swiperInner.style.cssText = 'transform: rotate(' + (rotate) + 'deg);transition-duration: 300ms';
                            for (var i = 0; swiperEachBoxi.length > i; i++) {
                                swiperEachBoxi[i].style.cssText = 'transform: rotate(' + (rotate * -1) + 'deg);transition-duration: 300ms';
                            }
                            $timeout(function () {
                                isAnimate = false;
                                rotateNext = 0;
                                rotateNow = 0;
                                percent = 0;
                                // console.log("animate Done")
                            }, 300, false);


                        });


                    }


                    //隐藏底部的三个行星不显示
                    showORNot();
                    /**
                     * 隐藏底部的三个行星不显示
                     * */
                    function showORNot() {
                        var a = rotateBefore / rotateEachDeg;
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
                        swiperInnerBox[a].style.cssText += 'opacity:0;transition-duration: 300ms;';
                        swiperInnerBox[b].style.cssText += 'opacity:0;transition-duration: 300ms;';
                        swiperInnerBox[c].style.cssText += 'opacity:0;transition-duration: 300ms;';
                        $log.debug("index为" + whichTop + "的行星在中间");
                        // console.log("index为" + whichTop + "的行星在中间");

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