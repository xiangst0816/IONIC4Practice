/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分 拍照积分 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('photoIntegral', ['$rootScope', '$scope', '$ionicPopup',  '$ionicLoading', '$http', '$filter', '$sessionStorage', 'AJAX', '$ionicToast', '$log', '$q', '$imgUpload', '$imgChoose', '$submitTradeImg', function ($rootScope, $scope, $ionicPopup,  $ionicLoading, $http, $filter, $sessionStorage, AJAX, $ionicToast, $log, $q, $imgUpload, $imgChoose, $submitTradeImg) {

            /**
             * imgData存放每次的图片uuid数据,如果为空则说明未进行上传操作
             * */
            var imgArr = [];

            /**
             * 读取图片文件信息并更新到views中
             * 传入input的id
             * */
            var $addedImgArea = angular.element(document.getElementById("addedImgArea"));
            $imgChoose('addImgToUpload', function (imgData) {
                $addedImgArea.prepend('<div class="prependedImg"><img src="' + imgData.code + '" alt=""></div>');
                //上传图片
                uploadImg(imgData.file);
            }, function (errText) {
                $ionicToast.show(errText);
            });


            /**
             * 点击确认上传小票信息(不是图片)
             * */
            $scope.showNoticeInfo = function () {
                var len = imgArr.length;
                if (!len) {
                    $ionicToast.show("请先选择小票图片!");
                    return
                }
                $ionicLoading.show({});
                submitTradeImg(imgArr.pop()).finally(function () {
                    $ionicLoading.hide();
                });
            };


            $scope.$on("$destroy", function () {
                $addedImgArea.remove();
                imgArr = [];
            });

            /**
             * 新增小票图片
             */
            function submitTradeImg(sourceid) {
                return $submitTradeImg({
                    "method": "uploadImage",
                    "detail": {
                        "custid": $sessionStorage.userInfo.customerid,
                        "sourceid": sourceid,
                        "createdtime": "" + $filter('yyyyMMdd_HHmmss_minus')(new Date()) + ""
                    }
                }).then(function () {
                    if (!!imgArr.length) {
                        submitTradeImg(imgArr.pop());
                    } else {
                        //上传成功提示
                        showPopupSuccess();
                        return true;
                    }
                }, function (err) {
                    //上传失败提示
                    showPopupErr();
                });
            }

            /**
             * 显示对话框
             * */
            function showPopupSuccess() {
                $ionicPopup.show({
                    title: '积分成功',
                    cssClass: 'noticePopup text-center',
                    template: '您可于7个工作日内，在【会员中心】-【积分查询】中查看此积分',
                    buttons: [{
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function () {
                            $rootScope.goBack();
                        }
                    }]
                });
            }
            function showPopupErr() {
                $ionicPopup.show({
                    title: '积分失败',
                    cssClass: 'noticePopup text-center',
                    template: '请重新进行积分操作!',
                    buttons: [{
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function (e) {
                            //清除
                            angular.element(document.querySelectorAll(".prependedImg")).remove();
                        }
                    }]
                });
            }

            /**
             * 上传头像到图片服务器,并将图片uuid上传到CMS
             * 传入图片的File信息
             */
            function uploadImg(file) {
                $ionicLoading.show({
                    template: '正在上传请稍等...'
                });
                $imgUpload(file).then(function (data) {
                    imgArr.push(data);
                    // console.log(imgArr)
                }, function (errText) {
                    $ionicToast.show(errText);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }


        }]);

})();