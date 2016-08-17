/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.page')

    /**
     * 图片预览功能（上传图片时使用）
     */
        .directive("fileChange", [function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('change', function (event) {
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
                                    //imageType: f.type,
                                    //name: f.name,
                                    //size: f.size
                                }
                                var file = imgData.file;
                                if (file.size / 1000 > 3000) { //file.size的单位为字节
                                    alert('图片大小过大，请上传3M以内的头像')
                                    //modal.show({text: "图片大小过大，请上传3M以内的头像"});
                                    // $timeout(function() {
                                    //   toaster.pop('error', "", "图片大小过大，请上传3M以内的头像");
                                    // }, 0);
                                } else {
                                    // console.log(element)
                                    element.parent().find('img').attr("src", imgData.code);
                                    // $this.img = imgData;
                                }
                            };
                            reader.readAsDataURL(file);
                            // uploadHeader(file);
                            scope.uploadHeader(file);
                        }
                    })
                }
            }
        }])
})();

  