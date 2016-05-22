// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


(function () {
    angular.module('smartac', [
        'ionic'
        , 'smartac.config'
        , 'smartac.services'
        , 'smartac.directives'
        , 'smartac.filters'
        , 'smartac.utils'
        , 'smartac.routers'
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
            $ionicConfigProvider.platform.android.views.maxCache(5);

            //用在非常卡的安卓机上
            //none: Do not perform  animated transitions.
            //android: Android style transition.
            // $ionicConfigProvider.views.transition('Android');

            // console.log($ionicConfigProvider);
            //所有平台,navBar的文字居中
            $ionicConfigProvider.navBar.alignTitle("center")
            // note that you can also chain configs
            // $ionicConfigProvider.backButton.text('返回').icon('icon-nav-back');


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
                        'lib/socket.io.min.js'
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
        }])

        .run(['$ionicPlatform', function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    // StatusBar.styleDefault();
                    StatusBar.styleLightContent();
                }

                //监听代码是否加载完毕
                // fileFirstLoadedSuccess = true;
                // alert("全部加载完毕")


                // $log.log("log")
                // $log.info("info")
                // $log.warn("warn")
                // $log.error("error")
                // $log.debug("ello")

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
             * 给angular.element挂在siblings方法
             * 用法:
             * var selectBox = angular.element().siblings(obj)
             * */
            // angular.element.prototype.siblings = function (obj) {
            //     var a = [];//定义一个数组，用来存o的兄弟元素
            //     var p = obj.previousSibling;
            //     while (p) {//先取o的哥哥们 判断有没有上一个哥哥元素，如果有则往下执行 p表示previousSibling
            //         if (p.nodeType === 1) {
            //             a.push(p);
            //         }
            //         p = p.previousSibling//最后把上一个节点赋给p
            //     }
            //     a.reverse()//把顺序反转一下 这样元素的顺序就是按先后的了
            //     var n = obj.nextSibling;//再取o的弟弟
            //     while (n) {//判断有没有下一个弟弟结点 n是nextSibling的意思
            //         if (n.nodeType === 1) {
            //             a.push(n);
            //         }
            //         n = n.nextSibling;
            //     }
            //     return a//最后按从老大到老小的顺序，把这一组元素返回
            // };

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