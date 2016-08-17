/**
 * Created by xiangsongtao on 16/3/16.
 * 投诉建议 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('adviseCtrl', ['$scope', '$sessionStorage','$ionicToast','$newQuestion','$ionicLoading','verification', function ($scope, $sessionStorage,$ionicToast,$newQuestion,$ionicLoading,verification) {
            $scope.serviceTel = BASE.serviceTel;

            //新建反馈数据
            $scope.newQuestion = {
                name:"",
                detail:"",
                contactinfo:$sessionStorage.userInfo.mobile
            };
            /**
             * 提交按钮
             * */
            $scope.submit = function () {
                if (!$scope.newQuestion.name) {
                    $ionicToast.show('标题不能为空!');
                    return
                }
                if ($scope.newQuestion.name.length >= 50) {
                    $ionicToast.show('标题不能大于50个字符');
                    return
                }
                if (!$scope.newQuestion.detail) {
                    $ionicToast.show('内容不能为空!');
                    return
                }
                if ($scope.newQuestion.name.length >= 100) {
                    $ionicToast.show('内容不能大于100个字符');
                    return
                }
                if (!$scope.newQuestion.contactinfo) {
                    $ionicToast.show('联系方式不能为空!');
                    return
                }
                if (!verification.isMobile($scope.newQuestion.contactinfo)) {
                    $ionicToast.show('电话号码格式不正确,请检查!');
                    return
                }

                $ionicLoading.show({
                    //返回按钮
                    hideOnStateChange: true,
                    template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                    '<br>' +
                    '<div style="margin-top:0.2rem">正在发布</div>'
                });
                $newQuestion({
                    detail: {
                        name: $scope.newQuestion.name,
                        detail: $scope.newQuestion.detail
                    }
                }).then(function () {
                    $ionicToast.show("发布成功,请在【我的反馈】查看!", 2000);
                    //查询
                    // getMyQuestionList();
                    // $timeout(function () {
                    //     $scope.modal.hide();
                    // }, 2000, false);
                },function (errTest) {
                    $ionicToast.show("发布失败,"+errTest);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            };
        }]);
})();