/**
 * Created by xiangsongtao on 16/3/16.
 * 注册 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('registerCtrl', ['$scope', 'verification', '$ionicLoading', '$state', 'api', 'AJAX', '$sessionStorage', 'Countdown', '$ionicToast', '$q', '$getVerifyCode', '$addIntegral', '$getCode', '$getUrlParams', '$getUserInfo', '$register', 'baseInfo', '$changePassword', '$log', '$timeout', '$ionicPopup', '$rootScope','$ionicModal', function ($scope, verification, $ionicLoading, $state, api, AJAX, $sessionStorage, Countdown, $ionicToast, $q, $getVerifyCode, $addIntegral, $getCode, $getUrlParams, $getUserInfo, $register, baseInfo, $changePassword, $log, $timeout, $ionicPopup, $rootScope,$ionicModal) {

            //点击用户协议
            $scope.ischecked = true;
            $scope.checked = function () {
                $scope.ischecked = !$scope.ischecked;
            };
            /**
             * 注册信息搜集
             * */
            $scope.register = {
                telephone: '',
                verificationCode: '',
                password: '',
                pswRept: ''
            };
            /**
             *获取验证码
             * */
            $scope.disableCodeBtn = false;
            $scope.getVerificationCode = function () {
                if ($scope.disableCodeBtn) return;
                if (!verification.isMobile($scope.register.telephone)) {
                    $ionicToast.show('请填写正确的手机号码');
                    return;
                }
                //设置进入flag
                $scope.disableCodeBtn = true;

                /**
                 * 时间倒计时
                 * @param {Number} duration 倒计时的时间，单位为s
                 * @param {Function} onTick 正在倒计时时执行的函数,传入(secondsLeft)
                 * @param {Function} onComplete 倒计时完成后执行的函数
                 * @return {Object} abort 清除定时器，倒计时停止；  getRemainingTime 获取剩余的秒数
                 */
                var countdown = new Countdown(59, function (seconds) {
                    $scope.codeBtnText = '剩余' + seconds + "s";
                }, function () {
                    $scope.codeBtnText = '发送验证码';
                    $scope.disableCodeBtn = false;
                });

                //发送验证码
                $getVerifyCode({
                    "mobile": $scope.register.telephone + "",
                    "type": "0" //0注册 1 忘记密码
                }).then(function (data) {
                }, function (err) {
                    countdown.abort(function () {
                        $scope.codeBtnText = '获取验证码';
                        $scope.disableCodeBtn = false;
                    });
                });
            };


            /**
             * 注册提交按钮
             */
            $scope.submitForm = function () {
                /**
                 * 为空判断
                 * */
                if (!verification.isMobile($scope.register.telephone)) {
                    $ionicToast.show('请填写正确的手机号码');
                    return;
                }

                if (verification.isEmpty($scope.register.verificationCode)) {
                    $ionicToast.show('请输入验证码');
                    return;
                }

                if (verification.isEmpty($scope.register.password)) {
                    $ionicToast.show('请输入密码');
                    return;
                }

                if (verification.isEmpty($scope.register.pswRept)) {
                    $ionicToast.show('请输入密码');
                    return;
                }

                if ($scope.register.password != $scope.register.pswRept) {
                    $ionicToast.show('两次输入的密码不同,请再确认!');
                    return;
                }

                if (!$scope.ischecked) {
                    $ionicToast.show('请确认用户协议!');
                    return;
                }

                //显示loading
                $ionicLoading.show();
                //设置发送参数
                // alert(Internal.isInWeiXin)
                var params = {};
                if (Internal.isInWeiXin) {
                    params = {
                        "customer": {
                            "channelcode": "1",  // channelcode 代表来源，目前5：app，  1：微信，  2：Portal
                            "channel": {
                                "validatecode": $scope.register.verificationCode,
                                "mobile": $scope.register.telephone,
                                // 微信用户的密码之后添加
                                // "password": $scope.register.password,
                                "orgid": baseInfo.orgid,
                                "openid": $sessionStorage.userInfo.openid,
                                "accountid": baseInfo.cfid
                            }
                        }
                    }
                } else if (Internal.isInApp) {
                    params = {
                        "customer": {
                            "channelcode": "5",  // channelcode 代表来源，目前5：app，  1：微信，  2：Portal
                            "channel": {
                                "validatecode": $scope.register.verificationCode,
                                "mobile": $scope.register.telephone,
                                "password": $scope.register.password,
                                "orgid": baseInfo.orgid
                            }
                        }
                    }
                }
                // alert(JSON.stringify(params))
                $register(params).then(function (customerid) {
                    //data.content == 会员的id
                    var sharedUserID = isRegistedFromShare();
                    if (sharedUserID && Internal.isInWeiXin) {

                        /**
                         * 给分享人加分
                         * */
                        $getCode({
                            "keyname": "shareGetIntegral"
                        }).then(function (data) {
                            addPoint(parseInt(data[0].keycode), sharedUserID);
                        }, function (err) {
                            $log.debug("分享获得积分值的规则获取失败,请检查code->shareGetIntegral," + err);
                        });
                    }
                    /**
                     * 注册后获得会员id,通过id查找会员具体信息
                     * */
                    $getUserInfo({
                        "conditions": {
                            "customerid": customerid
                        }
                    }).then(function (data) {
                        /**
                         * 微信用户需要添加密码
                         * */
                        if (Internal.isInWeiXin) {
                            $changePassword({
                                "customerid": parseInt(data.customerid),
                                "newpassword": $scope.register.password,
                                "validatecode": $scope.register.verificationCode
                            }).then(function (data) {
                                // $ionicToast.show("密码设置成功!")
                                $state.go('subNav.registerSuccess');
                            }, function (err) {
                                $ionicToast.show('密码添加失败,请手动重置!');
                            }).finally(function () {
                                //最终隐藏loading
                                $ionicLoading.hide();
                            });
                        } else {
                            $state.go('subNav.registerSuccess');
                            $ionicLoading.hide();
                        }
                    }, function (err) {
                        // $ionicToast.show("无法获取您的信息,请稍后再试!");
                        $ionicLoading.hide();
                    });
                }, function (errCode) {

                    // var errText;
                    // switch (parseInt(errCode)) {
                    //     case 8001:
                    //         errText = "验证码错误!";
                    //         break;
                    //     case 8002:
                    //         errText = "此手机号已注册过会员了，请直接登录!";
                    //         break;
                    //     case 8003:
                    //         errText = "当前微信号已被绑定!";
                    //         break;
                    //     case 8004:
                    //         errText = "系统内部异常,请稍后重试!";
                    //         break;
                    //     case 8007:
                    //         errText = "系统内部异常,请稍后重试!";
                    //         break;
                    //     default:
                    //         errText = "系统内部异常,请稍后重试!";
                    //         break;
                    // }
                    // $ionicToast.show(errText);
                }).finally(function () {
                    $ionicLoading.hide();
                });


            };
            
            /**
             * 用户协议的modal
             * */
            $scope.custRight = function () {
                $scope.modal.show();
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            $ionicModal.fromTemplateUrl('my-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            /**
             * 微信用户是否关注的判断
             * */
            $timeout(function () {
                var userInfo = $sessionStorage.userInfo;
                if (!!userInfo && !userInfo.isattention) {
                    //用户存在单没关注
                    $ionicPopup.show({
                        title: "提示!",
                        template: "您需要关注微信公众号后才能访问!",
                        cssClass: 'doubleBtnPopup text-center',
                        buttons: [{
                            text: '返回',
                            type: 'btnfor2',
                            onTap: function (e) {
                                $rootScope.backToHome()
                                // history.go(-(history.length - 1)); // Return at the beginning
                                return
                            }
                        }, {
                            text: '现在关注',
                            type: 'btnfor2',
                            onTap: function (e) {
                                //弹出长按二维码关注公众号
                                $ionicPopup.show({
                                    title: "长按识别二维码",
                                    template: "<img width='100%' src='img/fastAttention.png'>",
                                    cssClass: 'noticePopup text-center',
                                    buttons: [{
                                        text: '返回',
                                        type: 'noticePopupBtn',
                                        onTap: function (e) {
                                            return
                                        }
                                    }]
                                });
                            }
                        }]
                    });
                }
            }, 2000, false);

            /**
             * 判断是否从分享的页面注册而来
             * */
            function isRegistedFromShare() {
                // alert("in")
                var paramsObjs = $getUrlParams();
                // alert(JSON.stringify(paramsObjs))
                if (paramsObjs && paramsObjs.sharedcustid) {
                    $log.debug("该链接从分享而来,分享人id:" + sharedcustid);
                    return paramsObjs.sharedcustid;
                } else {
                    return false;
                }
            }


            /**
             * 加分接口
             * */
            // addPoint(300,55);
            function addPoint(pointValue, customerid) {
                return $addIntegral({
                    "points": {
                        "addednum": pointValue,
                        "custid": customerid,
                        "typeid": 1,//积分增加
                        "channelcode": 11,//11奖赏引擎
                        "remark": "分享获得积分"
                    }
                }).then(function (data) {
                    $ionicToast.show("感谢您的注册!")
                }, function (err) {
                    $log.debug("给分享人增加积分失败!");
                });
            }


        }]);
})();
