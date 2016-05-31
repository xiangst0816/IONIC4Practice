/**
 * Created by xiangsongtao on 16/5/31.
 * 图片选择组件
 * 传入input的id用于找到这个input
 * 如果图片选择成功,则进行promise->success
 */
(function () {
    angular.module('smartac.page')
        .factory("$imgChoose", ['$q','$log', function ($q,$log) {
            return function (InputID,successCB,errorCB) {
                // var defer = $q.defer();
                angular.element(document.getElementById(InputID)).on('change', function (event) {
                    var input = event.target;
                    if (input.files && input.files[0]) {
                        var file = input.files[0];
                        if (!input.files[0].type.match('image.*')) {
                            return null;
                        }
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (e) {
                            var imgData = {
                                code: e.target.result,
                                file: event.target.files[0]
                            };
                            if (imgData.file.size / 1000 > 3000) { //file.size的单位为字节
                                // defer.reject("图片大小过大，请上传3M以内的图片");
                                $log.debug("图片大小过大,请上传3M以内的图片");
                                errorCB && errorCB("图片大小过大,请上传3M以内的图片");
                            } else {
                                successCB && successCB(imgData);
                                $log.debug("图片选择成功:" + JSON.stringify(imgData));
                                // defer.resolve(imgData);
                            }
                        };
                    }
                });
                // return defer.promise;
            }
        }])
})();