/**
 * Created by xiangsongtao on 16/3/16.
 * 注册 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('registerCtrl', ['$scope', 'verification', '$ionicLoading', '$state', '$sessionStorage', 'Countdown', '$ionicToast', '$q', '$getVerifyCode', '$addIntegral', '$getCode', '$getUrlParams', '$getUserInfo', '$register', 'baseInfo', '$changePassword', '$log', '$timeout', '$rootScope', '$ionicModal', '$checkAuthorize', function ($scope, verification, $ionicLoading, $state, $sessionStorage, Countdown, $ionicToast, $q, $getVerifyCode, $addIntegral, $getCode, $getUrlParams, $getUserInfo, $register, baseInfo, $changePassword, $log, $timeout, $rootScope, $ionicModal, $checkAuthorize) {

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
             * 获取设备id
             * */
            var deviceid;
            nativePlugin.registerPushService(function (id) {
                deviceid = id;
            });


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

                if (!verification.isPassword($scope.register.password)) {
                    $ionicToast.show('密码至少6位，由英文字母或数字组成');
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

                if (!deviceid && Internal.isInApp && !!smartApp) {
                    $ionicToast.show('未获取到设备id!');
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
                                "validatecode": $scope.register.verificationCode.toString(),
                                "mobile": $scope.register.telephone.toString(),
                                // 微信用户的密码之后添加
                                "password": $scope.register.password.toString(),
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
                                "validatecode": $scope.register.verificationCode.toString(),
                                "mobile": $scope.register.telephone.toString(),
                                "password": $scope.register.password.toString(),
                                "orgid": baseInfo.orgid,
                                "deviceid": deviceid
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
                     * 获取最新
                     * */
                    $sessionStorage.userInfo.time = null;
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

            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            /**
             * 微信用户是否关注的判断,如果没关注,则跳出关注pop,并后退
             * */
            if (Internal.isInWeiXin) {
                // alert("微信用户是否关注的判断")
                $timeout(function () {
                    //当前用户权限验证
                    $checkAuthorize("wx_needAttention").then(function () {
                        $ionicToast.show("您已注册,即将进入首页");
                        $timeout(function () {
                            $rootScope.backToHome();
                        }, 1300, false);
                    }, function (result) {
                        // $ionicToast.show("您的权限不对!!!!!" + result)
                    });

                }, 0, false);
            }
            /**
             * 判断是否从分享的页面注册而来
             * */
            function isRegistedFromShare() {
                // alert("in")
                var paramsObjs = $getUrlParams();
                // alert(JSON.stringify(paramsObjs))
                if (paramsObjs && paramsObjs.sharedcustid) {
                    $log.debug("该链接从分享而来,分享人id:" + paramsObjs.sharedcustid);
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
                        "custid": parseInt(customerid),
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
