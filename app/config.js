/**
 * Created by xiangsongtao on 16/4/11.
 * 定义基础配置文件
 */
(function () {
    angular.module('smartac.config', [])

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
                wxAppID: "wx1f9f586691e432d2",
                //微信公众号的原始ID(公众号ID)
                accountid: "gh_4144bdb0571b",
                // wxAppID: "HEDV35FASG-DGW423A-34TGGW53AAD66",
                cfid: "HEDV35FASG-DGW423A-34TGGW53AAD66",


                /**
                 * 商场id(商场->商户)
                 */
                orgid: "1",


                /**
                 * 客服电话
                 * */
                serviceTel:"1234567890",


                /**
                 * 分享配置
                 * */
                shareInfo:{
                    //app地址
                    url:"http://vivocity.smartac.co/webapp/index.html"
                },

                /**
                 * 微信默认分享,分享注册页,进入home后自动跳转到注册
                 * */
                defalutShareContent:{
                    directToState:"subNav.register",
                    content:{
                        title: "成为怡丰城会员,尽享更多礼遇!",
                        desc: "分享后引导进入注册页面",
                        imgUrl: "http://vivocity.smartac.co:82/img/other/default.png",
                        type: "link",
                        dataUrl: ""
                    }
                }
            }
        })

        /**
         * 连接基础地址, 接口根路径  
         * */
        .factory("baseUrl", [function () {
            return {
                // webAppDomain:"",
                // indexUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1f9f586691e432d2&redirect_uri=http%3A%2F%2Fvivocity.smartac.co%2Fwebapp%2Findex.html&response_type=code&scope=snsapi_base&state=index#wechat", //webapp的首页地址
                //分享公用的域名
                // sharedImgUrl:"http://vivocity.smartac.co:82/img/other/default.png",
             
                // domain: "http://115.29.249.215:3300",   //接口地址
                // domain: "http://127.0.0.1:3300",   //接口地址,本机
                // domain: "http://172.16.6.4:3300",   //接口地址,映射的地址
                domain: "http://vivocity.smartac.co:3300",   //接口地址,映射的地址
                socketChatUrl: "115.29.249.215:8087",  //客服聊天地址
                resourceDomain: "http://192.168.99.111:8000/resource/"  //图片资源地址
            }
        }])


        /**
         * 卡等级的图片
         * */
        .factory("cardLevelImg", function () {
            return {
                cardLevelImg1: "img/card/card-type1.png",
                cardLevelImg2: "img/card/card-type2.png",
                cardLevelImg3: "img/card/card-type3.png"
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





