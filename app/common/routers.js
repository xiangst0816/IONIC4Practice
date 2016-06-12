/**
 * Created by xiangsongtao on 16/3/14.
 */
(function () {
    angular.module('smartac.page')
    //路由配置
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/home');
            $stateProvider

            /*
             * 顶级页面-无导航栏
             * */
                .state('home', {
                    url: '/home',
                    templateUrl: 'tpl/home.tpl.html',
                    controller: 'homeCtrl'
                })

                /*
                 * 二级导航
                 * */
                .state('subNav', {
                    url: '/subNav',
                    templateUrl: 'tpl/subNavPage.tpl.html'
                })

                /*
                 * 会员中心-子页面二级导航Nav
                 * */
                //会员中心-我的积分
                .state('subNav.memberIntegral', {
                    url: '/memberIntegral',
                    templateUrl: 'tpl/integral.tpl.html',
                    controller: 'integralCtrl'
                })
                //会员中心-自助积分
                .state('subNav.memberSelfIntegral', {
                    url: '/memberSelfIntegral',
                    templateUrl: 'tpl/selfIntegral.tpl.html',
                    controller: 'selfIntegralCtrl'
                })
                // //会员中心-自助积分-扫码积分
                // .state('subNav.scannerIntegral', {
                //     url: '/scannerIntegral',
                //     templateUrl: 'tpl/member/member.selfIntegral.scanner.tpl.html',
                //     controller:'scannerIntegral'
                // })
                //会员中心-自助积分-扫码积分
                .state('subNav.photoIntegral', {
                    url: '/photoIntegral',
                    templateUrl: 'tpl/selfIntegral.photoIntegral.tpl.html',
                    controller: 'photoIntegral'
                })
                //会员中心-积分查询
                .state('subNav.memberIntegralQuery', {
                    url: '/memberIntegralQuery',
                    templateUrl: 'tpl/integralQuery.tpl.html',
                    controller: 'integralQueryCtrl'
                })
                //会员中心-积分商城
                .state('subNav.memberIntegralMall', {
                    url: '/memberIntegralMall',
                    templateUrl: 'tpl/integralMall.list.tpl.html',
                    controller: 'integralMallCtrl'
                })
                //会员中心-积分商城-详情
                .state('subNav.memberIntegralMallDetail', {
                    params: {
                        'couponid': null,
                        'typecode': null
                    },
                    url: '/memberIntegralMallDetail',
                    templateUrl: 'tpl/integralMall.detail.tpl.html',
                    controller: 'integralMallDetailCtrl'
                })


                //会员中心-礼品卡券
                .state('subNav.memberCoupon', {
                    url: '/memberCoupon',
                    templateUrl: 'tpl/coupon.list.tpl.html',
                    controller: 'couponCtrl'
                })
                //会员中心-礼品卡券-detail
                .state('subNav.memberCouponDetail', {
                    params: {
                        'detail': null
                    },
                    url: '/memberCouponDetail',
                    templateUrl: 'tpl/coupon.detail.tpl.html',
                    controller: 'couponDetailCtrl'
                })



                //会员中心-我的服务
                .state('subNav.memberServices', {
                    url: '/memberServices',

                    templateUrl: 'tpl/myServices.tpl.html'
                })
                //会员中心-我的服务-列表
                .state('subNav.memberServicesList', {
                    url: '/memberServicesList',
                    templateUrl: 'tpl/tradeHistory.list.tpl.html',
                    controller: 'tradeListCtrl'
                })
                //会员中心-我的服务-详情
                .state('subNav.memberServicesDetail', {
                    url: '/memberServicesDetail',
                    params: {
                        'detail': null
                    },
                    templateUrl: 'tpl/tradeHistory.detail.tpl.html',
                    controller: 'tradeDetailCtrl'
                })
                //会员中心-关注商户
                .state('subNav.memberCollection', {
                    url: '/memberCollection',
                    templateUrl: 'tpl/collection.tpl.html',
                    controller: 'collectionCtrl'
                })
                //会员中心-个人资料
                .state('subNav.memberInfo', {
                    url: '/memberInfo',
                    templateUrl: 'tpl/userInfo.tpl.html',
                    controller: 'memberInfoCtrl'
                })
                //会员中心-修改密码
                .state('subNav.memberChangePassword', {
                    url: '/memberChangePassword',
                    templateUrl: 'tpl/changePassword.tpl.html',
                    controller: 'changePasswordCtrl'
                })
                // //会员中心-退出登录
                // .state('subNav.memberLogout', {
                //   url: '/memberLogout',
                //   templateUrl: 'tpl/member/member.logout.tpl.html'
                // })

                //客服
                .state('subNav.chat', {
                    url: '/chat',
                    templateUrl: 'tpl/chat.tpl.html',
                    controller: 'chatCtrl'
                })
                //消息
                .state('subNav.notice', {
                    url: '/notice',
                    templateUrl: 'tpl/notice.tpl.html',
                    controller: 'noticeCtrl'
                })
                //会员卡
                .state('subNav.memberCard', {
                    url: '/memberCard',
                    templateUrl: 'tpl/card.tpl.html',
                    controller: 'cardCtrl'
                })
                //会员权益
                .state('subNav.memberRights', {
                    url: '/memberPrivilege',
                    templateUrl: 'tpl/rights.tpl.html',
                    controller: 'rightsCtrl'
                })

                /**
                 * 注册/登录/-子页面二级导航Nav
                 * 密码相关授权验证
                 * controller:'verificationCtrl'
                 * */
                //登录
                .state('subNav.login', {
                    url: '/login',
                    templateUrl: 'tpl/login.tpl.html',
                    controller: 'loginCtrl'
                })
                //注册
                .state('subNav.register', {
                    url: '/register',
                    templateUrl: 'tpl/register.tpl.html',
                    controller: 'registerCtrl'
                })
                //忘记密码
                .state('subNav.forgotPassword', {
                    url: '/forgotPassword',
                    templateUrl: 'tpl/forgotPassword.tpl.html',
                    controller: 'changePasswordCtrl'
                })
                //注册成功
                .state('subNav.registerSuccess', {
                    url: '/registerSuccess',
                    templateUrl: 'tpl/registerSuccess.tpl.html',
                    controller: 'registerSuccessCtrl'
                })
                // //个人资料
                // .state('subNav.userInfo', {
                //   url: '/userInfo',
                //   templateUrl: 'tpl/member/member.info.tpl.html',
                //   controller:'memberInfoCtrl'
                // })

                /**
                 * 品牌资讯,商户资讯
                 * */
                .state('subNav.brandInfo', {
                    url: '/brandInfo',
                    templateUrl: 'tpl/brandInfo.shopList.tpl.html'
                    , controller: 'shopListCtrl'
                })
                .state('subNav.brandDetail', {
                    params: {
                        'detail': null
                    },
                    url: '/brandDetail',
                    templateUrl: 'tpl/brandInfo.shopdetail.tpl.html'
                    , controller: 'shopDetailCtrl'
                })

                /**
                 * 丰树资讯
                 * subNav.fengshuNews
                 * */
                .state('subNav.fengshuNews', {
                    url: '/fengshuNews',
                    templateUrl: 'tpl/mallNews.fenshu.list.tpl.html'
                })
                .state('subNav.fengshuNewsDetail', {
                    url: '/fengshuNewsDetail',
                    templateUrl: 'tpl/mallNews.fenshu.detail.tpl.html'
                })

                /**
                 * 推广活动
                 * subNav.activities
                 * */
                .state('subNav.activities', {
                    url: '/activities',
                    templateUrl: 'tpl/activity.list.tpl.html',
                    controller: 'activitiesCtrl'
                })
                .state('subNav.activeDetail', {
                    url: '/activeDetail',
                    templateUrl: 'tpl/activity.detail.tpl.html',
                    controller: 'activeDetailCtrl'
                })

                /**
                 * 导航至怡丰城
                 * subNav.NavigateToFenshu
                 * */
                .state('subNav.navigateToFenshu', {
                    url: '/navigateToFenshu',
                    templateUrl: 'tpl/navigateTo.tpl.html'
                })

                /**
                 * 商场导航
                 * subNav.mallNavigate
                 * */
                .state('subNav.mallNavigate', {
                    url: '/mallNavigate',
                    templateUrl: 'tpl/mallNavigate.tpl.html',
                    controller: 'mallNavigateCtrl'
                })
                //导航路径
                .state('subNav.mallNavigateLine', {
                    url: '/mallNavigateLine',
                    templateUrl: 'tpl/mallNavigate.lineSelect.tpl.html',
                    controller: 'mallNavigateLineCtrl'
                })
                //地图选点
                .state('subNav.mallNavigatePoint', {
                    url: '/mallNavigatePoint',
                    templateUrl: 'tpl/mallNavigate.selectPoint.tpl.html',
                    controller: 'mallNavigatePointCtrl'
                })

                /**
                 * 自助停车
                 * subNav.selfPark
                 * */
                .state('subNav.selfPark', {
                    url: '/selfPark',
                    templateUrl: 'tpl/selfPark.tpl.html',
                    controller: 'selfParkCtrl'
                })
                //找回爱车
                .state('subNav.findCar', {
                    url: '/findCar',
                    templateUrl: 'tpl/findCar.tpl.html',
                    controller: 'findCarCtrl'
                })
                //查看地图
                .state('subNav.findMap', {
                    url: '/findMap',
                    templateUrl: 'tpl/findMap.tpl.html',
                    controller: 'findMapCtrl'
                })
                //自助缴费
                .state('subNav.selfPay', {
                    url: '/selfPay',
                    templateUrl: 'tpl/selfPay.tpl.html',
                    controller: 'selfPayCtrl'
                })
                // //自助缴费-scanner
                // .state('subNav.selfPayToScanner', {
                //     url: '/selfPayToScanner',
                //     templateUrl: 'tpl/selfPark/selfPark.scanner.tpl.html',
                //     controller:'selfPayToScannerCtrl'
                // })
                //自助缴费-支付
                .state('subNav.selfPayToPay', {
                    params: {
                        'data': null
                    },
                    url: '/selfPayToPay',
                    templateUrl: 'tpl/selfPay.pay.tpl.html',
                    controller: 'selfPayToPayCtrl'
                })


        }]);


})();