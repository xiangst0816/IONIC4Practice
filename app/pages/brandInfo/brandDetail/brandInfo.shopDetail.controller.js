/**
 * Created by xiangsongtao on 16/3/16.
 * 品牌资讯 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('shopDetailCtrl', ['$sessionStorage', '$scope', '$stateParams', '$ionicBackdrop', '$ionicLoading', 'AJAX',  '$ionicToast', '$shopCollect', '$checkAuthorize', '$shopList', '$setShareContent', '$getUrlParams', '$timeout', function ($sessionStorage, $scope, $stateParams, $ionicBackdrop, $ionicLoading, AJAX,  $ionicToast, $shopCollect, $checkAuthorize, $shopList, $setShareContent, $getUrlParams, $timeout) {


            var shopID = $stateParams.detail;
            //test
            // shopID = '44fbba54-2921-491a-a2d1-54ad5268ab7e';
            //如果不是从list中来的
            if (!shopID) {
                //如果url中携带参数
                var stateParams = $getUrlParams().stateParams;
                if (!!stateParams) {
                    shopID = stateParams;
                } else {
                    $ionicToast.show("抱歉,未查到此店铺信息");
                    $timeout(function () {
                        window.history.back();
                    }, 1300, false);
                    return false;
                }
            }
            /**
             * 获取店铺详情
             * */
            $ionicLoading.show();
            $shopList({
                "conditions": {
                    "shopid": shopID
                }
            }).then(function (data) {
                $scope.item = data[0];
                // alert(JSON.stringify(data[0]));


                /**
                 * 进入页面进行分享
                 * */
                if(Internal.isInWeiXin){
                    $setShareContent({
                        title: $scope.item.name,
                        desc: $scope.item.desc,
                        imgUrl: $scope.item.logourl,
                        type: 'link',
                        dataUrl: ""
                    }, 'subNav.brandDetail', $scope.item.shopid);
                }

            }).finally(function () {
                $ionicLoading.hide();
            });

            /**
             * 点赞按钮
             * */
            $scope.wowBtn = function () {
                $ionicToast.show("功能正在开发")
            };


            /**
             * 点击收藏前判断是否有权限
             * */
            // $scope.beforeCollection = function ($event, item) {
            //     //微信需要关注,app需要登录
            //     $checkAuthorize("wxLevel_AttOnly").then(function () {
            //         changeCollectionState($event, item);
            //     })
            // };

            /**
             * 分享按钮(微信+app)
             * */
            $scope.shareBtn = function () {
                //设置分享当前页面
                $setShareContent({
                    title: $scope.item.name,
                    desc: $scope.item.desc,
                    imgUrl: $scope.item.logourl,
                    type: 'link',
                    dataUrl: ""
                }, 'subNav.brandDetail', $scope.item.shopid);
            };
            /**
             * 页面退出后,恢复默认分享设置
             * */
            $scope.$on("$destroy", function () {
                //恢复分享默认进入注册页
                $setShareContent()
            });





            // /**
            //  * 取消收藏,收藏按钮操作
            //  * var $target = angular.element($event.target.childNodes[1]);
            //  * */
            // function changeCollectionState($event, item) {
            //     $ionicLoading.show();
            //     var $target = angular.element($event.target.childNodes[1]);
            //     $shopCollect($target, item).finally(function () {
            //         $ionicLoading.hide();
            //     })
            // }
        }]);
})();