/**
 * Created by xiangsongtao on 16/4/11.
 * 定义基础配置文件
 */
(function () {
    angular.module('smartac.page')

    /**
     * 基础配置信息(微信,app)
     * */
        .factory("baseInfo", function () {
            return {
                //AppID(应用ID)
                appid: "1",
                appsecret: "123",
                /**
                 * 微信配置, 微信公众号的AppID(应用ID)
                 * */
                // wxAppID: "wx1f9f586691e432d2",
                wxAppID: "wx9587233d8b1a1869",
                //微信公众号的原始ID(公众号ID)
                accountid: "gh_50ea738284f4",
                cfid: "HEDV35FASG-DGW423A-34TGGW53AAD66",


                /**
                 * 商场id(商场->商户)
                 */
                orgid: "1",


                /**
                 * 客服电话
                 * */
                serviceTel: "18761938554",


                /**
                 * 项目地址
                 * */
                url: "http://vivouat.smartac.co",

                /**
                 * 分享配置
                 * */
                shareInfo: {
                    //app地址
                    url: "http://vivouat.smartac.co/webapp/index.html"
                },

                /**
                 * 微信默认分享,分享注册页,进入home后自动跳转到注册
                 * */
                defalutShareContent: {
                    directToState: "subNav.register",
                    content: {
                        title: "成为怡丰城会员,尽享更多礼遇!",
                        desc: "分享后进入注册页面",
                        imgUrl: "http://vivouat.smartac.co/webapp/img/home/default.png",
                        type: "link",
                        dataUrl: ""
                    }
                }
            }
        })

        /**
         * 连接基础地址, 接口根路径
         * */
        .factory("baseUrl", ['baseInfo', function (baseInfo) {
            return {
                // indexUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1f9f586691e432d2&redirect_uri=http%3A%2F%2Fvivocity.smartac.co%2Fwebapp%2Findex.html&response_type=code&scope=snsapi_base&state=index#wechat", //webapp的首页地址
                // domain: "http://vivocity.smartac.co:3300",   //接口地址,映射的地址
                // socketChatUrl: "192.168.99.111:8087",  //客服聊天地址
                // resourceDomain: "http://192.168.99.111:8000/resource/",  //图片资源地址

                indexUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9587233d8b1a1869&redirect_uri=http%3A%2F%2Fvivouat.smartac.co%2Fwebapp%2Findex.html&response_type=code&scope=snsapi_base&state=index#wechat_redirect", //webapp的首页地址
                domain: baseInfo.url + "/api",   //接口地址,映射的地址
                socketChatUrl: baseInfo.url + ":8087",  //客服聊天地址
                resourceDomain: baseInfo.url + ":8000/resource/",  //图片资源地址

                //二维码的生成地址
                generateQrcodeUrl: baseInfo.url + ":15433/barcode?symbology=58&size=645&s_fg_color=000000&s_bg_color=ffffff&margin=0&level=2&ecc_level=1&hint=1&ver=0&transparent=0&txt="
                // generateBarcodeUrl: "http://srdemo1.smartac.co/dqcodegen?symbology=20&size=1&case=1&txt=",
                // scancodeVerificationUrl: 'http://vivocity.smartac.co:3300/api/rewardsprogram/customerusecoupon_xc/',
            }
        }])

        /**
         * api接口地址
         * */
        .factory('api', ['baseUrl', function (baseUrl) {
            var domain = baseUrl.domain;
            return {
                signatureUrl: domain + "/signature",
                authenticateUrl: domain + "/authenticate",
                couponUrl: domain + "/coupons",
                giftUrl: domain + "/gifts",
                pointUrl: domain + "/point",
                customerUrl: domain + "/customers",
                codeUrl: domain + "/code",
                shopUrl: domain + "/shops",
                parkingUrl: domain + "/sbp",
                tradeUrl: domain + "/trade",
                messageUrl: domain + "/message",
                imgDomainUrl: baseUrl.resourceDomain
            }
        }
        ])
        /**
         * 卡等级的图片
         * */
        .factory("cardLevelImg", function () {
            return {
                cardLevelImg1: "img/home/card.png",
                cardLevelImg2: "img/home/card.png",
                cardLevelImg3: "img/home/card.png"
            }
        })

        /**
         * 图片placeholder背景图片
         * @1x:高度为100px;
         * @2x:高度为200px;
         * @3x:高度为300px;
         * */
        .factory("placeHolderImg", function () {
            return {
                placeholderImg_11: "img/other/placeholder/placeholder1-1@2x.png",
                placeholderImg_178: "img/other/placeholder/placeholder17-8@2x.png",
                placeholderImg_43: "img/other/placeholder/placeholder4-3@2x.png",
                placeholderImg_169: "img/other/placeholder/placeholder16-9@2x.png",
                placeholderImg_175: "img/other/placeholder/placeholder17-5@2x.png"
            }
        })
})();





