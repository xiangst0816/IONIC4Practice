/**
 * Created by xiangsongtao on 16/3/16.
 * 登录 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('loginCtrl', ['$scope', 'verification', '$ionicLoading', '$ionicToast', '$login', '$getUserInfo', '$rootScope', function ($scope, verification, $ionicLoading, $ionicToast, $login, $getUserInfo, $rootScope) {

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
                }).then(function () {

                    //登陆成功返回主页
                    $rootScope.backToHome();

                },function (errText) {
                    $ionicToast.show(errText);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            };


        }]);
})();
