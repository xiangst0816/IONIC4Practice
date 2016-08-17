/**
 * Created by xiangsongtao on 16/3/31.
 */

(function () {
    angular.module('smartac.page')
    /**
     * 给图片的uuid加前缀地址
     * $filter("addImgPrefix")(data)
     * */
        .filter("addImgPrefix", [ function () {
            return function (uuid) {
                if (!!uuid && uuid.indexOf('http') !== -1) {
                    return uuid;
                } else if(!uuid){
                    //如果为空则传入空白图片
                    return 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
                }else{
                    return API.imgDomainUrl + uuid;
                }
            };
        }])
})();
