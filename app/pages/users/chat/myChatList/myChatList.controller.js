/**
 * Created by xiangsongtao on 16/3/16.
 * 客服 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('myChatListCtrl', ['$scope', '$myQuestionList', function ($scope, $myQuestionList) {
            //开始进入显示"待处理"
            $scope.statuscode = 1;
            let dataList = [];
            //查询
            getMyQuestionList();

            $scope.$watch('statuscode', function () {
                $scope.dataToDisplay = [];
                dataList.forEach(function (value, index) {
                    if (value.statuscode === $scope.statuscode) {
                        $scope.dataToDisplay.push(value);
                    }
                })
            });
            $scope.$on("$stateChangeSuccess",function (event, toState) {
                if (toState.name == 'subNav.myChatList') {
                    getMyQuestionList();
                }
            });


            // /**
            //  * modal
            //  * */
            // $ionicModal.fromTemplateUrl('newQuestion.temp.html', {
            //     scope: $scope,
            //     animation: 'slide-in-up'
            // }).then(function (modal) {
            //     $scope.modal = modal;
            // });
            // $scope.openModal = function () {
            //     $scope.modal.show();
            //     //新建反馈数据
            //     $scope.newQuestion = {
            //         name:"",
            //         detail:"",
            //         contactinfo:$sessionStorage.userInfo.mobile
            //     };
            // };
            // $scope.closeModal = function () {
            //     $scope.modal.hide();
            // };
            // //Cleanup the modal when we're done with it!
            // $scope.$on('$destroy', function () {
            //     $scope.modal.remove();
            // });


            /**
             * 提交按钮
             * */
            // $scope.submit = function () {
            //     if (!$scope.newQuestion.name) {
            //         $ionicToast.show('标题不能为空!');
            //         return
            //     }
            //     if ($scope.newQuestion.name.length >= 50) {
            //         $ionicToast.show('标题不能大于50个字符');
            //         return
            //     }
            //     if (!$scope.newQuestion.detail) {
            //         $ionicToast.show('内容不能为空!');
            //         return
            //     }
            //     if ($scope.newQuestion.name.length >= 100) {
            //         $ionicToast.show('内容不能大于100个字符');
            //         return
            //     }
            //     if (!$scope.newQuestion.contactinfo) {
            //         $ionicToast.show('联系方式不能为空!');
            //         return
            //     }
            //     if (!verification.isMobile($scope.newQuestion.contactinfo)) {
            //         $ionicToast.show('电话号码格式不正确,请检查!');
            //         return
            //     }
            //
            //     $ionicLoading.show({
            //         //返回按钮
            //         hideOnStateChange: true,
            //         template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
            //         '<br>' +
            //         '<div style="margin-top:0.2rem">正在发布</div>'
            //     });
            //     $newQuestion({
            //         detail: {
            //             name: $scope.newQuestion.name,
            //             detail: $scope.newQuestion.detail,
            //             contactInfo: $scope.newQuestion.contactinfo
            //         }
            //     }).then(function () {
            //         $ionicToast.show("发布成功,请在【我的反馈】查看!", 2000);
            //         //查询
            //         getMyQuestionList();
            //         $timeout(function () {
            //             $scope.modal.hide();
            //         }, 2000, false);
            //     },function (errTest) {
            //         $ionicToast.show("发布失败,"+errTest);
            //     }).finally(function () {
            //         $ionicLoading.hide();
            //     });
            // };

            /**
             * 查询我的记录
             * */
            function getMyQuestionList() {
                $scope.dataToDisplay = [];
                dataList = [];
                return $myQuestionList().then(function (data) {
                    dataList = data;
                    dataList.forEach(function (value, index) {
                        if (value.statuscode === $scope.statuscode) {
                            $scope.dataToDisplay.push(value);
                        }
                    })
                });
            }



        }]);

})();