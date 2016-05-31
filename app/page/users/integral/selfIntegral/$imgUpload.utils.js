/**
 * Created by xiangsongtao on 16/5/31.
 * 图片上传组件
 */
(function () {
    angular.module('smartac.page')
        .factory("$imgUpload", ['$http', '$ionicToast', '$log', '$q','api', function ( $http, $ionicToast, $log, $q,api) {
            /**
             * 上传头像到图片服务器,并将图片uuid上传到CMS
             */
            return function (file) {
                var defer = $q.defer();
                var formdata = new FormData();
                formdata.append('upload', file);
                $http({
                    method: "POST",
                    url: api.imgDomainUrl + 'upload?type=2&filename=' + file.name + '&program_type=webapp',
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