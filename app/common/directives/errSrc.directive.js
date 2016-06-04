/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.page')

    /**
     * 图片加载失败的时候进行处理
     * <img height="100%" ng-src="{{video.imgUrl}}" err-src="images/video-img-404.png">
     *  如果err-src不传入数据,则计算使用最近尺寸比例匹配的图片
     * */
        .directive('errSrc', ['placeHolderImg',function (placeHolderImg) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.css({"opacity": 0});

                    var emptyTransparent = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";

                    //如果失败
                    element.on('error', function () {
                        if (!!attrs.errSrc && attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }else{
                            // console.log(getPlaceHolderImgUrl())
                            attrs.$set('src', emptyTransparent);
                        }
                        element.css({"opacity": 1,"transition":"opacity ease 300ms"});
                    });
                    //如果成功
                    element.on('load', function () {
                        element.css({"opacity": 1,"transition":"opacity ease 300ms"});
                    });

                    //获取最佳匹配的图片url地址,由placeHolderImg服务提供数据
                    // function getPlaceHolderImgUrl(){
                    //     var _imgHeight = element[0].height;
                    //     var _imgWidth = element[0].width;
                    //     var ratio = parseFloat(_imgWidth)/parseFloat(_imgHeight);
                    //     //1:1 17:8 4:3 16:9 17:5
                    //     var src = [
                    //         {w:1,h:1},
                    //         {w:17,h:8},
                    //         {w:4,h:3},
                    //         {w:16,h:9},
                    //         {w:17,h:5}
                    //     ];
                    //     var arr = [];
                    //     angular.forEach(src,function (value, key) {
                    //         this.push(value.w/value.h);
                    //     },arr);
                    //     var diff = [];
                    //     angular.forEach(arr,function (value, key) {
                    //         this.push(Math.abs(value-ratio));
                    //     },diff);
                    //     //找到最接近的尺寸
                    //     var nearestIndex;
                    //     var near = diff[0];
                    //     angular.forEach(diff,function (value, key) {
                    //         if(parseFloat(value) <= parseFloat(near)){
                    //             near = value;
                    //             nearestIndex = key;
                    //         }
                    //     });
                    //     // // console.log(ratio)
                    //     // console.log('nearestIndex')
                    //     // console.log(nearestIndex)
                    //     return placeHolderImg['placeholderImg_'+src[nearestIndex].w + src[nearestIndex].h];
                    //     // element.css({"background":"url(" +imgUrl + ") no-repeat center center/cover"});
                    // }

                }
            };
        }])
})();
