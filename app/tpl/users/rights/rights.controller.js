/**
 * Created by xiangsongtao on 16/3/16.
 * 会员权益 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('rightsCtrl',
            ['$scope', '$ionicHistory', '$sessionStorage', '$state',
                function ($scope, $ionicHistory, $sessionStorage, $state) {
                    var levelid = $sessionStorage.userInfo.levelid;
                    $scope.params = {
                        vipLevel: levelid,
                        nextLevel: levelid + 1
                    };


                    var VIP_Right_1 =
                        '<p>1、免费注册就可获得超值专柜礼品；推荐会员免费注册即可获取超值大礼包，' +
                        '<a href="#/subNav/memberInfo">马上更新个人资料>></a>' +
                        '</p>' +
                        '<p>2、无限累积推荐会员免费注册（注册信息真实有效）达到“VIP会员感恩回报奖励表”中相应数量，可获得感恩回报奖PV积分，' +
                        '<a href="#/subNav/memberIntegralQuery">积分查询>></a>' +
                        '<p>' +
                        '<p>3、以上是电子卡会员权益的内容!' +
                        '<p>';

                    var VIP_Right_2 =
                        '<p>1、首创VIP会员消费美金积分奖励的网站；倡导蓝海战略经营消费的理念与方法，真正的帮助会员省钱又赚钱！会员可超低价格购买专柜商品、航空机票、手机话费、福利彩票等，同时还可获得消费美金积分，' +
                        '<a href="#/subNav/memberIntegralMall">积分商城>></a>' +
                        '<p>' +
                        '<p>2、VIP会员还可享受更多增值服务，且这些增值服务涉及面将越来越广泛。如，VIP客户可享受星级酒店VIP低价格预订积分、飞机票预定积分、手机充值积分……' +
                        '<a href="#/subNav/memberSelfIntegral">自助积分>></a>' +
                        '<p>' +
                        '<p>3、会员除了可以累积获得礼品以外，还可享受商户优惠活动，' +
                        '<a href="#/subNav/memberCoupon">礼品卡券>></a>' +
                        '<p>' +
                        '<p>4、VIP会员消费经营权不可转让。</p>' +
                        '<p>5、以上是普通卡卡会员权益的内容。</p>';

                    var VIP_Right_3 =
                        '<p>1、首创VIP会员消费美金积分奖励的网站；倡导蓝海战略经营消费的理念与方法，真正的帮助会员省钱又赚钱！会员可超低价格购买专柜商品、航空机票、手机话费、福利彩票等，同时还可获得消费美金积分，' +
                        '<a href="#/subNav/memberIntegralMall">积分商城>></a>' +
                        '<p>' +
                        '<p>2、VIP会员还可享受更多增值服务，且这些增值服务涉及面将越来越广泛。如，VIP客户可享受星级酒店VIP低价格预订积分、飞机票预定积分、手机充值积分……' +
                        '<a href="#/subNav/memberSelfIntegral">自助积分>></a>' +
                        '<p>' +
                        '<p>3、会员除了可以累积获得礼品以外，还可享受商户优惠活动，' +
                        '<a href="#/subNav/memberCoupon">礼品卡券>></a>' +
                        '<p>' +
                        '<p>4、VIP会员消费经营权不可转让。</p>' +
                        '<p>5、以上是VIP卡会员权益的内容。</p>';


                    var VIP_Right = [VIP_Right_1, VIP_Right_2, VIP_Right_3];


                    $scope.VIP_Right = VIP_Right[levelid - 1];


                }]);
})();
