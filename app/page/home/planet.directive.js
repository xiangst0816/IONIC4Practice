'use strict';
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
                controller: ['$scope', '$log', function ($scope, $log) {
                    /**
                     * 每个行星定位
                     * */
                    let swiperInnerBox = document.querySelectorAll('.index-bottom-swiper-eachBox');
                    //html的font-size值
                    let baseFontSize = document.documentElement.style.fontSize;
                    //虚线轨迹直径(rem),
                    let circleWidth = 7.8;//rem
                    circleWidth = Number.parseFloat(circleWidth) * Number.parseFloat(baseFontSize);//px
                    let circleRadius = Math.floor((circleWidth / 2) * 100) / 100;
                    //导航栏目个数
                    let itemCount = swiperInnerBox.length;
                    //每一个的角度
                    let regEach = 2 * Math.PI / itemCount;
                    let reg = Math.PI;
                    //每个行星的宽度 = 设定的rem值 * html的font-size值
                    let swiperEachBoxWidth = 1.85;//rem
                    swiperEachBoxWidth = Number.parseFloat(swiperEachBoxWidth) * Number.parseFloat(baseFontSize);
                    //确定每一个行星的位置
                    for (let i = 0; itemCount > i; i++) {
                        //如果特别小,在手机端会出现bug,保留2位小数
                        let sinx = Math.floor(Math.sin(reg) * circleRadius * 100) / 100;
                        let cosx = Math.floor(Math.cos(reg) * circleRadius * 100) / 100;
                        let cssText =
                            'left:' + (circleRadius + sinx - swiperEachBoxWidth / 2) + 'px;' +
                            'top:' + (circleRadius + cosx - swiperEachBoxWidth / 2) + 'px;';
                        swiperInnerBox[i].style.cssText = cssText;
                        reg = reg - regEach;
                    }


                    /**
                     * 控制每个行星旋转
                     * */
                    let swiperEachBoxi = document.querySelectorAll('.index-bottom-swiper-eachBox-i');

                    //找到行星轨迹的虚线DOM
                    let swiperInner = document.getElementById('index-bottom-swiper-inner');

                    //转动之前的状态
                    let rotateBefore = 0;
                    //转动之后的状态
                    let rotateNext = 0;
                    //正在转动的状态
                    let rotateNow = 0;
                    //当前转动百分比
                    let percent = 0;
                    //每次转动的固定角度(6个行星60度)
                    let rotateEachDeg = 360 / itemCount;
                    //滑动速度
                    let velocityX;
                    //判断是否在动画中
                    let isAnimate = false;

                    //动触摸时
                    $scope.onTouchPlanet = ()=> {
                        document.ontouchmove = function (e) {
                            e.preventDefault();
                        };
                    };
                    //当拖动时
                    $scope.onDrag = (e) => {
                        if (!isAnimate && Internal.isIOS) {
                            percent = Number.parseFloat(e.gesture.deltaX * 1 / circleWidth);
                            rotateNow = Number.parseFloat(rotateBefore + rotateEachDeg * percent);
                            // requestAnimationFrame(move);
                            move(rotateNow)
                        } else {
                            e.preventDefault();
                            // console.log("正在animate:" + isAnimate)
                            return false;
                        }

                    };
                    //当停止触控
                    $scope.onReleasePlanet = (e) => {
                        if (!isAnimate && Internal.isIOS) {
                            velocityX = e.gesture.velocityX;
                            //移动距离不会超过100%,大于50%就进入下一个
                            let min_velocityX = 0.2;
                            let max_velocityX = 1.4;
                            if (Number.parseInt(Math.abs(percent * 100)) < 50) {
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
                        $timeout(() => {
                            document.ontouchmove = angular.noop();
                        }, 300, false);
                    };

                    //正对安卓,不适用随手动画
                    $scope.swipeRight = ()=> {
                        if (Internal.isAndroid) {
                            rotateNow = rotateBefore + rotateEachDeg;
                            moveNext(1);
                            showORNot();
                        }
                    };
                    $scope.swipeLeft = ()=> {
                        if (Internal.isAndroid) {
                            rotateNow = rotateBefore - rotateEachDeg;
                            moveNext(1);
                            showORNot();
                        }
                    };

                    //转动输入的角度
                    function move(rotate) {
                        swiperInner.style.cssText = `transform: rotate(${rotate}deg);-webkit-transform: rotate(${rotate}deg);`;
                        for (let i = 0; swiperEachBoxi.length > i; i++) {
                            swiperEachBoxi[i].style.cssText = `transform: rotate(${rotate* -1}deg);-webkit-transform: rotate(${rotate* -1}deg);`;
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
                            swiperInner.style.cssText = `transform: rotate(${rotate}deg);-webkit-transform: rotate(${rotate}deg);transition-duration: 300ms;-webkit-transition-duration: 300ms;`;
                            for (let i = 0; swiperEachBoxi.length > i; i++) {
                                swiperEachBoxi[i].style.cssText = `transform: rotate(${rotate* -1}deg);-webkit-transform: rotate(${rotate* -1}deg);transition-duration: 300ms;-webkit-transition-duration: 300ms;`;
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
                        let rate = rotateBefore / rotateEachDeg;
                        let whichTop;

                        //向右转,角度为正
                        if (rate > 0 || rate == 0) {
                            if (rate > itemCount - 1) {
                                whichTop = rate % itemCount;
                            } else {
                                whichTop = rate;
                            }
                        } else {
                            //  向左转,角度为负
                            if (Math.abs(rate) > itemCount) {
                                whichTop = itemCount + rate % (itemCount);
                                if (whichTop == itemCount) {
                                    whichTop = 0;
                                }
                            } else {
                                whichTop = itemCount + rate;
                            }
                        }
                        //隐藏底部的三个元素
                        let a, b, c;
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
                        for (let i = 0; swiperInnerBox.length > i; i++) {
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

                        let which;

                        //计算出顶上元素在数组中的位置
                        if (whichTop === 0) {
                            which = 0
                        } else {
                            which = 6 - whichTop
                        }

                        //将NodeList转成真正数组

                        let swiperInnerBoxArr = Array.from(swiperInnerBox);

                        //增加动画类
                        swiperInnerBoxArr.forEach((box, i) => {
                            i === which ? box.classList.add("animation-jelly") : box.classList.remove("animation-jelly")
                        })
                    }
                }]
            }
        }])
})();