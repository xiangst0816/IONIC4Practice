(function () {
    angular.module('smartac.page', ['ui.router']);
    angular.module('smartac', [
        'ionic'
        , 'smartac.page'
        , 'ngStorage'
        , 'oc.lazyLoad'
        , 'btford.socket-io'
    ])
    /**
     * 全局设置
     * 在app配置阶段读取并设置,如果在app总,使用$ionicConfig
     * */
        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
            // $ionicConfigProvider.views.maxCache(5);
            $ionicConfigProvider.platform.android.views.maxCache(0);
            $ionicConfigProvider.platform.ios.views.maxCache(20);

            //用在非常卡的安卓机上
            //none: Do not perform  animated transitions.
            //android: Android style transition.
            // $ionicConfigProvider.views.transition('Android');

            // console.log($ionicConfigProvider);
            //所有平台,navBar的文字居中
            $ionicConfigProvider.navBar.alignTitle("center");
            // note that you can also chain configs

            //fullScreen([showFullScreen], [showStatusBar])
            // ionic.Platform.fullScreen(true, true);

            //Whether to use JS or Native scrolling
            // $ionicConfigProvider.scrolling.jsScrolling(false);
        }])
        /**
         * $ocLazyLoadProvider的配置
         * 设置lazloaded的资源清单
         * */
        .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                modules: [{
                    name: 'lazyLoadResource',
                    files: [
                        'js/lazyLoadMap.resource.js'
                    ]
                }, {
                    name: 'lazyLoadSocketIO',
                    files: [
                        'http://apps.bdimg.com/libs/socket.io/0.9.16/socket.io.min.js'
                    ]
                }]
            });
        }])
        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
            //navBar的显示控制,不显示文字
            $ionicConfigProvider.backButton.text("");
            $ionicConfigProvider.backButton.previousTitleText(false);

            //
            //$ionicConfigProvider.views.forwardCache(value)

            //禁止侧滑后退事件
            $ionicConfigProvider.views.swipeBackEnabled(false);
        }])
        /**
         * 拓展$log方法,为其加上时间戳
         * */
        .config(['$provide', function ($provide) {
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                var origDebug = $delegate.debug;
                $delegate.debug = function () {
                    var args = [].slice.call(arguments);
                    args[0] = [new Date().toString(), ': ', args[0]].join('');

                    // Send on our enhanced message to the original debug method.
                    origDebug.apply(null, args)
                };
                return $delegate;
            }]);
        }])
        /**
         * $log的debug方法显示开关
         * */
        .config(['$logProvider', function ($logProvider) {
            $logProvider.debugEnabled(true);

            // $log.log("log")
            // $log.info("info")
            // $log.warn("warn")
            // $log.error("error")
            // $log.debug("ello")
        }])



        .run(['$ionicPlatform', function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                // if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                //     cordova.plugins.Keyboard.disableScroll(true);
                // }
                // if (window.StatusBar) {
                //     StatusBar.styleLightContent();
                // }
            });
        }])
        /**
         * 挂在方法的地方,方法拓展
         * */
        .run([function () {
            /**
             * Array数组合并的方法申明,arrDst.extend(arrSrc),无返回值
             * argument 不确定参数数量,但必须都是array类型
             * */
            Array.prototype.extend = function () {
                for (var i = 0, len = arguments.length; len > i; i++) {
                    if (!angular.isArray(arguments[i])) {
                        console.log("extend method need Array type arguments!")
                        return
                    } else {
                        arguments[i].forEach(function (v) {
                            this.push(v)
                        }, this)
                    }
                }
            };

            /**
             * angular-对象深度合并
             * 对比angular.extend(dst,src)
             * */
            angular.deepExtend = function (dst) {
                angular.forEach(arguments, function (obj) {
                    if (obj !== dst) {
                        angular.forEach(obj, function (value, key) {
                            if (angular.isObject(dst[key]) || angular.isArray(dst[key])) {
                                angular.deepExtend(dst[key], value);
                            } else {
                                dst[key] = angular.copy(value);
                            }
                        });
                    }
                });
                return dst;
            };
        }])
        /**
         * 微信当前地址签名 及 设置 app 和 微信分享内容
         * */
        .run(['$setShareContent', function ($setShareContent) {

            $setShareContent();
        }])
        /**
         * 配置$ionicLoading组件,通用配置
         * */
        .constant('$ionicLoadingConfig', {
            //返回按钮
            hideOnStateChange: true,
            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
            '<br>' +
            '<div style="margin-top:0.2rem">正在进入</div>'
        })
})();