/**
 * Created by xiangsongtao on 16/3/16.
 * 我的积分 拍照积分 controller
 */
(function () {
    angular.module('smartac.controllers')
        .controller('photoIntegral', ['$rootScope', '$scope', '$ionicPopup', 'api', '$ionicLoading', '$http', '$filter', '$sessionStorage', 'AJAX', '$ionicToast', '$log', '$q', function ($rootScope, $scope, $ionicPopup, api, $ionicLoading, $http, $filter, $sessionStorage, AJAX, $ionicToast, $log, $q) {

            /**
             * imgData存放每次的图片uuid数据,如果为空则说明未进行上传操作
             * */
            var imgArr = [];
            var count = 0;

            /**
             * 读取图片文件信息并更新到views中
             * */
            var $addImgToUpload = document.getElementById("addImgToUpload");
            var $addedImgArea = angular.element(document.getElementById("addedImgArea"));
            // console.log($addedImgArea)
            $addImgToUpload.addEventListener('change', function (event) {
                var input = event.target;
                if (input.files && input.files[0]) {
                    var file = input.files[0];
                    if (!input.files[0].type.match('image.*')) {
                        return null;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var imagecode = e.target.result;
                        var imgData = {
                            code: imagecode,
                            file: event.target.files[0]
                        }
                        var file = imgData.file;
                        if (file.size / 1000 > 3000) { //file.size的单位为字节
                            alert('图片大小过大，请上传3M以内的头像')
                        } else {
                            $addedImgArea.prepend('<div class="prependedImg"><img src="' + imgData.code + '" alt=""></div>');
                        }
                    };
                    reader.readAsDataURL(file);
                    uploadImg(file);
                }
            });


            /**
             * 上传头像到图片服务器,并将图片uuid上传到CMS
             */
            function uploadImg(file) {
                var formdata = new FormData();
                formdata.append('upload', file);
                var url = api.imgDomainUrl + 'upload?type=2&filename=' + file.name + '&program_type=webapp';
                //loading
                $ionicLoading.show({
                    template: '正在上传请稍等...'
                });
                $http({
                    method: "POST",
                    url: url,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    data: formdata
                }).success(function (data) {
                    if (data.code == 0) {
                        imgData = data.uuid;
                        imgArr.push(imgData);
                        addNewTrade(imgData);

                        $ionicLoading.hide();
                    }
                }).error(function (response) {
                    $ionicToast.show('上传出错,请稍后再试');
                    $log.debug('上传出错,请稍后再试' + response);
                    $ionicLoading.hide();
                });
            }


            /**
             * 新增小票图片
             */
            function addNewTrade(sourceid) {
                var defer = $q.defer();
                AJAX({
                    url: api.tradeUrl,
                    method: 'post',
                    data: {
                        "method": "uploadImage",
                        "detail": {
                            "custid": $sessionStorage.userInfo.customerid,
                            "sourceid": sourceid,
                            "createdtime": "" + $filter('yyyyMMdd_HHmmss_minus')(new Date()) + ""
                        }
                    },
                    success: function (data) {
                        if (data.code == 7001) {
                            $ionicToast.show("小票信息提交成功");
                            count++;
                            defer.resolve();
                        } else {
                            defer.reject(data.code);
                            $ionicToast.show("小票信息提交失败,请稍后再试");
                            $log.debug("小票信息提交失败,code" + data.code);

                        }
                    },
                    error: function (errText) {
                        defer.reject(errText);
                        $ionicToast.show("小票信息提交失败,系统错误!");
                        $log.debug("小票信息提交失败," + JSON.stringify(errText));
                    }
                });
                return defer.promise;
            }

            $scope.showNoticeInfo = function () {
                var len = imgArr.length;
                if (!len) {
                    $ionicToast.show("请先选择小票图片!");
                    return
                }
                showPopupSuccess();
            };

            /**
             * 显示对话框
             * */
            function showPopupSuccess() {
                $ionicPopup.show({
                    title: '积分成功',
                    cssClass: 'noticePopup text-left',
                    template: '您可于7个工作日内，在【会员中心】-【积分查询】中查看此积分',
                    buttons: [{
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function () {
                            if (window.history.length <= 2) {
                                $rootScope.backToHome();
                            }
                            $rootScope.goBack(2);
                            //清除
                            angular.element(document.querySelectorAll(".prependedImg")).remove();
                        }
                    }]
                });
            }

            function showPopupErr() {
                $ionicPopup.show({
                    title: '积分失败',
                    cssClass: 'noticePopup text-left',
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

            $scope.$on("$destroy", function () {
                imgArr = [];
                count = 0;
            })


        }]);

})();