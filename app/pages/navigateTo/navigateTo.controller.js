'use strict';

/**
 * Created by xiangsongtao on 16/6/16.
 * 导航至 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('navigateToCtrl', ['$scope', '$ionicLoading', '$log', '$ionicToast', '$timeout', '$interval', '$q', function ($scope, $ionicLoading, $log, $ionicToast, $timeout, $interval, $q) {


            /**
             * 基本信息
             * */
            const destination = {
                currentLatitude: 31.136867,
                currentLongitude: 121.370142,
                name: "VivoCity怡丰城",
                region: "上海",
            };
            const BMapSecretAK = "yFKaMEQnAYc1hA0AKaNyHGd4HTQgTNvO";


            /**
             * hack在微信等webview中无法修改document.title的情况
             * */
            let title = document.title;
            const stopTime = $interval(function () {
                if (document.title !== title) {
                    let hack_wx_title_html = '<iframe class="hide" src="/favicon.ico"></iframe>';
                    const $iframe = angular.element(hack_wx_title_html);
                    document.title = 'VivoCity怡丰城';
                    angular.element(document.body).append($iframe);
                    $iframe.on('load', function () {
                        $timeout(function () {
                            $iframe.off('load').remove()
                        }, 0, false)
                    });
                    $interval.cancel(stopTime);
                }
            }, 10);




            $ionicLoading.show({
                //返回按钮
                hideOnStateChange: true,
                template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                '<br>' +
                '<div style="margin-top:0.2rem">正在准备地图</div>'
            });
            //获取当前设备经纬度
            const iframe = document.getElementById('ifreamMapBox');
            getAddress(({currentLatitude, currentLongitude})=> {
                //拼装百度URI地址
                let src = `http://api.map.baidu.com/direction?origin=latlng:${currentLatitude},${currentLongitude}|name:我的位置&destination=latlng:${destination.currentLatitude},${destination.currentLongitude}|name:${destination.name}&mode=driving&region=${destination.region}&output=html`;
                iframe.src = src;
                //iframe的onload事件监听
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function() {
                        $ionicLoading.hide();
                        whenIframeLoaded();
                    });
                } else {
                    iframe.onload = function() {
                        $ionicLoading.hide();
                        whenIframeLoaded();
                    };
                }
            });

            /**
             * 手动隐藏左上角的返回按钮
             * */
            function whenIframeLoaded() {
                // document.getElementById('block_map_left_btn').style.background = "#f2f2f2";
                // document.getElementById('block_map_right_btn').style.background = "#f2f2f2";
                iframe.onload = angular.noop;
            }


            /**
             * 获取地理位置
             * */
            function getAddress(locationGetSuccessCallback) {
                if (navigator.geolocation) {
                    //取得我当前的地理位置
                    navigator.geolocation.getCurrentPosition(
                        //获取当前的地理位置成功是进行处理
                        function (position) {
                            translateGPSLocation2BMapLocation({
                                currentLatitude: position.coords.latitude,
                                currentLongitude: position.coords.longitude,
                            }).then(function (data) {
                                !!locationGetSuccessCallback && locationGetSuccessCallback(data);
                            },function () {
                                //如果失败了,就传未转化的坐标
                                !!locationGetSuccessCallback && locationGetSuccessCallback({
                                    currentLatitude: position.coords.latitude,
                                    currentLongitude: position.coords.longitude,
                                });
                            });
                        },
                        //获取当前的地理位置失败时进行处理
                        function (error) {
                            var errorTypes = {
                                1: '位置服务被拒绝',
                                2: '获取不到位置信息',
                                3: '获取信息超时'
                            };
                            //返回终点
                            !!locationGetSuccessCallback && locationGetSuccessCallback(destination);
                            whenErr();
                            $log.debug(error.code + "-" + errorTypes[error.code] + ": 不能确定你当前的位置！正跳转至目标终点!");
                        },
                        //可选参数
                        {
                            //是否要求高精度地理位置信息
                            enableHighAccuracy: true,
                            //设置缓存时间为1s，1s后重新获取地理位置信息
                            maximumAge: 0,//ms
                            //5s未返回信息则返回错误
                            timeout: 3000
                        });
                } else {
                    //返回终点
                    !!locationGetSuccessCallback && locationGetSuccessCallback(destination);
                    whenErr();
                    $log.debug("获取不到地理位置信息，浏览器不支持!正跳转至目标终点!");
                }
                // 获取位置失败的处理
                function whenErr() {
                    $timeout(function () {
                        $ionicToast.show("无法获取您的位置,导航失败!");
                    }, 6000, false);
                }
            }

            /**
             * 将GPS左边转化成BMap坐标
             * */
            function translateGPSLocation2BMapLocation({currentLatitude, currentLongitude}) {

                var defer = $q.defer();
                let _TagObjs = document.createElement("script");
                _TagObjs.setAttribute('type', 'text/javascript');
                _TagObjs.setAttribute('src', `http://api.map.baidu.com/getscript?v=2.0&ak=${BMapSecretAK}`);
                const head = document.getElementsByTagName("head")[0].appendChild(_TagObjs);
                _TagObjs.onload = function () {
                    $log.debug("将百度bMap的script写入head中");
                    var convertor = new BMap.Convertor();
                    var poi = new BMap.Point(currentLongitude, currentLatitude);
                    var pointArr = [];
                    pointArr.push(poi);
                    //开始转换
                    convertor.translate(pointArr, 1, 5, function (data) {
                        if (data.status === 0) {
                            let location = data.points[0];
                            defer.resolve({
                                currentLatitude: location.lat,
                                currentLongitude: location.lng,
                            });
                        } else {
                            defer.reject();
                        }
                    })
                };
                // $scope.$on("$destroy", function () {
                //     head.removeChild(_TagObjs);
                // });
                return defer.promise;
            }

        }]);
})();
