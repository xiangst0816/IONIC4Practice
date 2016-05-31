/**
 * Created by xiangsongtao on 16/3/16.
 * 系统消息 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('noticeCtrl', ['$scope', '$ionicPopup', '$getMessage', '$ionicLoading', '$changeMessageStatus', '$log', '$ionicToast', '$state','$rootScope', function ($scope, $ionicPopup, $getMessage, $ionicLoading, $changeMessageStatus, $log, $ionicToast, $state,$rootScope) {

            /**
             * 获取列表
             * */
            var unReadNum = 0;
            $ionicLoading.show();
            $getMessage({
                "method": "query",
                "querytype": "main",//count
                "message": {
                    "statuscode": null//#状态：0未读/1已读/2删除
                },
                "dsc": {
                    "order_by": "statuscode",
                    "order_type": "asc",
                    "page_index": 1,
                    "page_size": 50
                }
            }).then(function (data) {
                for (var i = 0, len = data.length; len > i; i++) {
                    if (!data[i].statuscode) {
                        unReadNum++;
                    }
                }
                $log.debug('unReadNum:' + unReadNum);
                $scope.items = data;
                if ($scope.items > 20) {
                    $ionicToast.show("亲,过期的消息请及时清理");
                }
            }).finally(function () {
                $ionicLoading.hide();
            });


            $scope.data = {
                showDelete: false
            };

            /**
             * 消息删除
             * */
            $scope.delete = function (item) {
                //update
                updateUnreadNum(item);

                return $changeMessageStatus({
                    "method": "update",
                    "message": {
                        "id": item.id,
                        "statuscode": 2
                    }
                }).then(function () {
                    //更新本地列表
                    $scope.items.splice($scope.items.indexOf(item), 1);
                })

            };

            /**
             * 消息显示
             * */
            $scope.showNoticeInfo = function (item) {
                //update
                updateUnreadNum(item);

                //如果是卡券发放,则跳转到礼品卡券
                if (parseInt(item.typecode) == 8) {
                    $state.go("subNav.memberCoupon")

                } else {
                    $ionicPopup.show({
                        title: item.title,
                        cssClass: 'noticePopup',
                        subTitle: '',
                        template: item.content,
                        buttons: [{
                            text: '确定',
                            type: 'noticePopupBtn',
                            onTap: function (e) {
                            }
                        }]
                    });
                }


                //列表更新
                if (!item.statuscode) {
                    return $changeMessageStatus({
                        "method": "update",
                        "message": {
                            "id": item.id,
                            "statuscode": 1
                        }
                    }).then(function () {
                        //更新本地列表
                        $scope.items[$scope.items.indexOf(item)].statuscode = 1;
                    })
                }
            };

            /**
             * update
             * 查看和删除都会减少未读数量,操作前判断
             * */
            function updateUnreadNum(item){
                !item.statuscode && (unReadNum--);

                if(!unReadNum){
                    $log.debug("当前没有未读消息");
                    $rootScope.messageNum = false;
                }
            }

        }]);

})();