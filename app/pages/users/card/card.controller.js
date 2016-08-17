/**
 * Created by xiangsongtao on 16/3/16.
 * 会员卡 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('cardCtrl', ['$scope', '$sessionStorage',  function ($scope, $sessionStorage) {

            // $ionicLoading.show();
            $scope.params = {
                cardno: $sessionStorage.userInfo.cardno,
                fullname: $sessionStorage.userInfo.fullname,
                cardImg: CARDLEVEL['cardLevelImg' + $sessionStorage.userInfo.levelid],
                card2DCode: URL.generateQrcodeUrl + $sessionStorage.userInfo.cardno
            };


            /**
             * 监听图片全部加载完成的函数
             * img:array,图片的array
             * callback:成功回调;
             * */
            // function imgLoad(img, callback) {
            //     var idLoaded = false;
            //     var timer = setInterval(function () {
            //         //监听complete结果，如果出现false则break
            //         for (var i = 0; img.length > i; i++) {
            //             if (img[i].complete) {
            //                 idLoaded = true;
            //             } else {
            //                 idLoaded = false;
            //                 break;
            //             }
            //         }
            //         //如果所有都true，则执行回调
            //         if (idLoaded) {
            //             callback(img)
            //             clearInterval(timer)
            //         }
            //     }, 50)
            // }

            // /**
            //  * 启动监听
            //  * */
            // imgLoad(document.querySelectorAll(".memberCard img"), function () {
            //     $ionicLoading.hide();
            // })

        }]);

})();