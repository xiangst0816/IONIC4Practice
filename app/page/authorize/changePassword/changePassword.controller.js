/**
 * Created by xiangsongtao on 16/3/16.
 * 注册 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('changePasswordCtrl', ['$scope', 'verification', '$ionicLoading', '$state', '$sessionStorage', 'Countdown', '$ionicToast', '$timeout', '$getVerifyCode', '$customerValidate', '$changePassword', '$rootScope','$log','$login','$zeroize', function ($scope, verification, $ionicLoading, $state, $sessionStorage, Countdown, $ionicToast, $timeout, $getVerifyCode, $customerValidate, $changePassword, $rootScope,$log,$login,$zeroize) {
            /**
             * params
             * */
            var userInfo = $sessionStorage.userInfo;
            $scope.params = {
                telephone: !!userInfo && !!userInfo.mobile && userInfo.mobile || "",
                verificationCode: '',
                password: '',
                pswRept: ''
            };

            /**
             * 放在异步队列中,否则不生效
             * */
            // console.log($ionicNavBarDelegate)
            $timeout(function () {
                if ($state.is("subNav.forgotPassword")) {
                    //忘记密码1
                    $log.debug("忘记密码");
                    // $ionicNavBarDelegate.title("密码更改");
                    //设置input为disable,不可修改
                    document.getElementById("telephone").disabled = false;
                } else if ($state.is("subNav.memberChangePassword")) {
                    $log.debug("修改密码");
                    //修改密码1
                    // $ionicNavBarDelegate.title("密码更改");
                    document.getElementById("telephone").disabled = true;
                }
            }, 0, true);


            /**
             *获取验证码
             * */
            $scope.disableCodeBtn = false;
            $scope.getVerificationCode = function () {
                if ($scope.disableCodeBtn) return;
                if (!verification.isMobile($scope.params.telephone)) {
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

                /**
                 * 发送获取验证码请求
                 * */
                $getVerifyCode({
                    "mobile": $scope.params.telephone,
                    "type": "1"
                }).then(function (data) {
                }, function (err) {
                    countdown.abort(function () {
                        $scope.codeBtnText = '获取验证码';
                        $scope.disableCodeBtn = false;
                    });
                });
            };


            /**
             * 密码修改确认按钮
             */
            $scope.submitForm = function () {
                /**
                 * 为空判断
                 * */
                if (!verification.isMobile($scope.params.telephone)) {
                    $ionicToast.show('请填写正确的手机号码');
                    return;
                }

                if (verification.isEmpty($scope.params.verificationCode)) {
                    $ionicToast.show('请输入验证码');
                    return;
                }

                if (verification.isEmpty($scope.params.password)) {
                    $ionicToast.show('请输入密码');
                    return;
                }

                if (!verification.isPassword($scope.params.password)) {
                    $ionicToast.show('密码至少6位，由英文字母或数字组成!');
                    return;
                }

                if (verification.isEmpty($scope.params.pswRept)) {
                    $ionicToast.show('请输入密码');
                    return;
                }

                if ($scope.params.password != $scope.params.pswRept) {
                    $ionicToast.show('两次输入的密码不同,请再确认!');
                    return;
                }


                //显示loading
                $ionicLoading.show();
                $customerValidate({
                    "validatecode": $zeroize($scope.params.verificationCode,6).toString(),
                    "mobile": $scope.params.telephone.toString(),
                    "typecode": "1"//修改密码
                }).then(function (data) {
                    // changePassword(data.content);
                    /**
                     * 执行修改密码
                     * */
                    $changePassword({
                        "customerid": parseInt(data),
                        "newpassword": $scope.params.password.toString(),
                        "validatecode": $zeroize($scope.params.verificationCode,6).toString()
                    }).then(function (data) {
                        if ($state.is("subNav.forgotPassword")) {
                            $ionicToast.show("密码找回成功,即将自动登录!");
                            /**
                             * 执行登陆
                             * */
                            $login({
                                "conditions": {
                                    "mobile": $scope.params.telephone.toString(),
                                    "password": $scope.params.password.toString()
                                }
                            });
                        } else if ($state.is("subNav.memberChangePassword")) {
                            $ionicToast.show("密码重置成功!");
                        }
                        $timeout(function () {
                            $rootScope.backToHome();
                        }, 1700, false);
                    }).finally(function () {
                        //最终隐藏loading
                        $ionicLoading.hide();
                    });

                }, function (err) {
                    // $ionicToast.show('验证码错误!');
                    $ionicLoading.hide();
                });
            };


        }]);
})();
