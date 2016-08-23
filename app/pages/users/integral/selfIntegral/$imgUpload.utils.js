/**
 * Created by xiangsongtao on 16/5/31.
 * 图片上传组件
 */
(function () {
    angular.module('smartac.page')
        .factory("$imgUpload", ['$http', '$ionicToast', '$log', '$q', function ( $http, $ionicToast, $log, $q) {
            /**
             * 上传头像到图片服务器
             */
            return function (file) {
                var defer = $q.defer();
                var formdata = new FormData();
                formdata.append('upload', file);

                var name = '';
                (!!file && !!file.name) ? (name = file.name) : (name == '');
                if (name.length > 20) {
                    name = name.substr(-10);
                }


                $http({
                    method: "POST",
                    url: API.imgDomainUrl + 'upload?type=2&filename=' + name + '&program_type=webapp',
                    // url: API.imgDomainUrl + 'upload?type=2&filename=' + file.name + '&program_type=BASE',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    data: formdata
                }).success(function (data) {
                    if (data.code == 0) {
                        defer.resolve(data.uuid);
                        $log.debug('上传成功,图片uuid:'+data.uuid);
                    }
                }).error(function (err) {
                    defer.reject('上传出错,请稍后再试');
                    $log.debug('上传出错,请稍后再试' + err);
                });
                return defer.promise;
            }
        }])
})();