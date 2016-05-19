/**
 * Created by xiangsongtao on 16/3/31.
 */

(function () {
    angular.module('smartac.filters')
    /**
     * 给图片的uuid加前缀地址
     * $filter("addImgPrefix")(data)
     * */
        .filter("addImgPrefix", ['api', function (api) {
            return function (uuid) {
                if (uuid && uuid.indexOf('http') !== -1) {
                    return uuid;
                } else {
                    return api.imgDomainUrl + uuid;
                }
            };
        }])
})();