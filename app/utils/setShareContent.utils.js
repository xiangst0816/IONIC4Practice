// /**
//  * Created by xiangsongtao on 16/5/11.
//  */
(function () {
    /**
     * app and 微信分享相关 $wxShare
     * @params: shareContent,directToState,stateParams
     * shareContent:title,desc,imgUrl,type,dataUrl,success,cancel
     * directToState: 进入home后跳转地址
     * stateParams: 跳转读写的参数 
     * */
    angular.module('smartac.utils')
        .factory("$setShareContent", ['$wxGetConfig', '$sessionStorage', 'baseInfo', '$log', function ($wxGetConfig, $sessionStorage, baseInfo, $log) {

            /**
             * 获取分享的URL,默认加上分享人id
             * @params:
             * directToState 跳转地址(state,ui-router),默认为注册页
             * stateParams 跳转会读取的参数 string
             * */
            function getShareUrl(directToState, stateParams) {

                if (!directToState) {
                    directToState = 'subNav.register';
                }
                var uri = "http://vivocity.smartac.co/webapp/index.html";
                uri = uri + "?directToState=" + directToState;

                //如果分享人未登陆,何来分享送积分? 获取分享人信息
                var userInfo = $sessionStorage.userInfo;
                if (!!userInfo && !!userInfo.customerid) {
                    uri = uri + "&sharedcustid=" + userInfo.customerid;
                }


                if (!!stateParams) {
                    uri = uri + "&stateParams=" + stateParams;
                }

                //编码
                var redirect_uri = encodeURIComponent(uri);

                var response_type = "code";
                var scope = "snsapi_base";
                var state = "index#wechat";
                return "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                    "appid=" + baseInfo.wxAppID +
                    "&redirect_uri=" + redirect_uri +
                    "&response_type=" + response_type +
                    "&scope=" + scope +
                    "&state=" + state;
            }

            /**
             * 设置分享
             * */
            function setShareContent(shareContent) {
                //当前地址签名,签名一次就好
                if (Internal.isInWeiXin) {
                    $wxGetConfig().then(function () {
                        nativePlugin.onMenuShareTimeline(shareContent);
                        nativePlugin.onMenuShareAppMessage(shareContent);
                        nativePlugin.onMenuShareQQ(shareContent);
                        nativePlugin.onMenuShareWeibo(shareContent);
                        nativePlugin.onMenuShareQZone(shareContent);
                        nativePlugin.shareWithPanel(shareContent)
                    });
                } else {
                    nativePlugin.onMenuShareTimeline(shareContent);
                    nativePlugin.onMenuShareAppMessage(shareContent);
                    nativePlugin.onMenuShareQQ(shareContent);
                    nativePlugin.onMenuShareWeibo(shareContent);
                    nativePlugin.onMenuShareQZone(shareContent);
                    nativePlugin.shareWithPanel(shareContent)
                }
            }

            return function (shareContent, directToState, stateParams) {
                //没有分享内容、跳转位置、跳转携带参数,则设置默认分享内容为注册页面分享
                if (!shareContent) {
                    var _shareRegisterPage = {
                        title: "成为怡丰城会员,尽享更多礼遇!",
                        desc: "分享后引导进入注册页面",
                        link: getShareUrl(),
                        imgUrl: "http://vivocity.smartac.co:82/img/other/default.png",
                        type: "link",
                        dataUrl: ""
                    };
                    setShareContent(_shareRegisterPage);
                    $log.debug("设置默认分享内容,分享注册页");
                } else {
                    //将传入值设置为分享内容
                    var _shareRightPage = {
                        title: shareContent.title,
                        desc: shareContent.desc,
                        link: getShareUrl(directToState, stateParams),
                        imgUrl: shareContent.imgUrl,
                        type: shareContent.type,
                        dataUrl: shareContent.dataUrl,
                        success: function (res) {
                            shareContent.success && shareContent.success();
                        },
                        cancel: function (res) {
                            shareContent.cancel && shareContent.cancel();
                        }
                    };
                    setShareContent(_shareRightPage);
                    $log.debug("设置定制化的注册页,跳转地址:" + directToState + ",参数:" + stateParams);
                }
            }
        }])
})();