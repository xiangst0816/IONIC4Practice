/**
 * Created by xiangsongtao on 16/3/16.
 * 系统消息 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('noticeCtrl', ['$scope', '$ionicPopup', '$getMessage', '$ionicLoading', '$changeMessageStatus', '$log', '$ionicToast', function ($scope, $ionicPopup, $getMessage, $ionicLoading, $changeMessageStatus, $log, $ionicToast) {

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
                    "order_by": "createdtime",
                    "order_type": "desc",
                    "page_index": 1,
                    "page_size": 999
                }
            }).then(function (data) {
                for (var i = 0, len = data.length; len > i; i++) {
                    if (!data[i].statuscode) {
                        unReadNum++;
                    }
                }
                $log.debug('unReadNum');
                $log.debug(unReadNum);
                $scope.items = data;
                if ($scope.items > 50) {
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

        }]);

})();