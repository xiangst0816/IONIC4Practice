/**
 * Created by xiangsongtao on 16/5/31.
 * 图片选择组件
 * 传入input的id用于找到这个input
 * 如果图片选择成功,则进行promise->success
 */
(function () {
    angular.module('smartac.page')
        .factory("$imgChoose", ['$q', '$log', '$ocLazyLoad', function ($q, $log, $ocLazyLoad) {

            function _fixImage(_file) {
                // console.log(_file)
                var defer = $q.defer();
                // 只对ios优化处理
                if (Internal.isIOS) {
                    //加载资源
                    $ocLazyLoad.load('FixImage').then(function () {
                        canvasResize(_file, {
                            width: 710,//最大的尺寸,如果比这小是不会出现放大的情况的,文章宽度为710px
                            height: 0,
                            crop: false,
                            quality: 80,
                            //rotate: 90,
                            callback: function (data, width, height) {
                                // 将图片改为二进制文件,准备上传
                                var _blob = canvasResize('dataURLtoBlob', data);
                                // console.log(_blob)
                                defer.resolve(_blob);
                            }
                        });
                    })

                } else {
                    defer.resolve(_file);
                }
                return defer.promise;
            }

            return function (InputID, successCB, errorCB) {
                angular.element(document.getElementById(InputID)).on('change', function (event) {
                    var input = event.target;
                    if (input.files && input.files[0]) {
                        var file = input.files[0];
                        if (!input.files[0].type.match('image.*')) {
                            return null;
                        }

                        _fixImage(file).then(function (_file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var imgData = {
                                    code: e.target.result,
                                    file: _file
                                };
                                successCB && successCB(imgData);
                                $log.debug("图片选择成功,执行成功回调!" );
                            };
                            reader.readAsDataURL(_file);
                        })


                        // var reader = new FileReader();
                        // reader.onload = function (e) {
                        //     var imgData = {
                        //         code: e.target.result,
                        //         file: _fixImage(file)
                        //     };
                        //     console.log(imgData)
                        //     if (imgData.file.size / 1000 > 13000) { //file.size的单位为字节
                        //         // defer.reject("图片大小过大，请上传3M以内的图片");
                        //         $log.debug("图片大小过大,请上传3M以内的图片");
                        //         errorCB && errorCB("图片大小过大,请上传3M以内的图片");
                        //     } else {
                        //         successCB && successCB(imgData);
                        //         $log.debug("图片选择成功:" + JSON.stringify(imgData));
                        //         // defer.resolve(imgData);
                        //     }
                        // };
                        // reader.readAsDataURL(file);
                    }
                });
                // return defer.promise;
            }
        }])
})();