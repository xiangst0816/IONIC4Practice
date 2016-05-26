/**
 * Created by xiangsongtao on 16/3/16.
 * 登录 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('loginCtrl', ['$scope', 'verification', '$ionicLoading', '$ionicToast', '$login', '$getUserInfo','$rootScope','$localStorage', function ($scope, verification, $ionicLoading, $ionicToast, $login, $getUserInfo,$rootScope,$localStorage) {

            /**
             * 提交按钮
             */
            $scope.login = {
                telephone: '',
                password: ''
            };
            $scope.submitForm = function () {
                if (!verification.isMobile($scope.login.telephone)) {
                    $ionicToast.show('请填写正确的手机号码');
                    return;
                }
                if (verification.isEmpty($scope.login.password)) {
                    $ionicToast.show('请输入密码');
                    return;
                }
                $ionicLoading.show();
                $login({
                    "conditions": {
                        "mobile": $scope.login.telephone + "",
                        "password": $scope.login.password
                    }
                }).then(function (data) {
                    //并且有数据
                    if (!!data.length) {

                        //如果是app,那就将customerid放在localStorage中
                        //只在登陆进行此操作
                        if(Internal.isInApp){
                            $localStorage.userInfo ={
                                customerid:data[0].customerid.toString()
                            };
                        }

                        /**
                         * 用户信息查询
                         * */
                        $getUserInfo({
                            "method": "query",
                            "conditions": {
                                "customerid": data[0].customerid.toString()
                            }
                        }).finally(function () {
                            //第一页面一定时home,如果鉴权调到登录,那返回就好,不必跳转!
                            $rootScope.goBack();
                            // history.back();
                        });
                    } else {
                        $ionicToast.show('手机号或密码错误');
                        // $ionicToast.show('如果您在微信中已注册,请先修改密码');
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                });
            };
        }]);
})();
