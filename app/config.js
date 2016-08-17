/**
 * Created by xiangsongtao on 16/4/11.
 * 定义基础配置文件
 */
//基础
var BASE = {
    //AppID
    appid: "1",
    appsecret: "123",

    //设置->通过分享链接进入是否能对分享人加分的开关,
    // true: 分享链接进来后注册成功则进行加分
    // false: no
    canGetIntegralFromShare:false,
    // 此过程分享人获得积分数配置,这部分后台api返回不了,只能现在这里配置(和后台人员沟通此值,默认50积分)
    registerReward:50,

    //商场
    orgid: "1",
    //客服电话
    serviceTel: "010-22334455",
    //项目地址
    url: "http://vivouat.smartac.co",
    urlIP: "172.16.1.5",
    urlDomain: "vivouat.smartac.co",//no http domain
    //停车场对应的商铺id,用于支付
    parkingID: "parkingIDDemo",

    //微信
    wxAppID: "wx9587233d8b1a1869",
    accountid: "gh_50ea738284f4",
    cfid: "HEDV35FASG-DGW423A-34TGGW53AAD66",
    //
};



//API地址
var URL = {
    //分享配置
    shareInfo: {
        //app地址
        url: BASE.url + "/webapp/index.html"
    },
    //微信默认分享,分享注册页,进入home后自动跳转到注册
    defalutShareContent: {
        directToState: "subNav.register",
        content: {
            title: "成为怡丰城会员,尽享更多礼遇!",
            desc: "分享后进入注册页面",
            imgUrl: BASE.url + "/webapp/img/home/default.png",
            type: "link",
            dataUrl: ""
        }
    },


    //外链进入微信的地址(需要转码)
    indexUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9587233d8b1a1869&redirect_uri=http%3A%2F%2Fvivouat.smartac.co%2Fwebapp%2Findex.html&response_type=code&scope=snsapi_base&state=index#wechat_redirect",
    domain: BASE.url + "/api",   //API接口地址,映射的地址
    socketChatUrl: BASE.urlIP + ":8087",  //客服聊天地址
    resourceDomain: BASE.url + ":8000/resource/",  //图片资源地址
    //二维码的生成地址
    generateQrcodeUrl: BASE.url + ":15433/barcode?symbology=58&size=645&s_fg_color=000000&s_bg_color=ffffff&margin=0&level=2&ecc_level=1&hint=1&ver=0&transparent=0&txt="
};

//各个子项目具体API地址
var API = {
    signatureUrl: URL.domain + "/signature",
    authenticateUrl: URL.domain + "/authenticate",
    couponUrl: URL.domain + "/coupons",
    giftUrl: URL.domain + "/gifts",
    pointUrl: URL.domain + "/point",
    customerUrl: URL.domain + "/customers",
    codeUrl: URL.domain + "/code",
    shopUrl: URL.domain + "/shops",
    parkingUrl: URL.domain + "/sbp",
    tradeUrl: URL.domain + "/trade",
    messageUrl: URL.domain + "/message",
    feedbackUrl: URL.domain + "/feedback",
    imgDomainUrl: URL.resourceDomain,
    //支付
    reqPayUrl: URL.domain + "/api/spay.server/req_pay",
    reqQueryPayUrl: URL.domain + "/api/spay.server/req_query_pay"
};
//会员卡图片
var CARDLEVEL = {
    cardLevelImg1: "img/home/card.png",
    cardLevelImg2: "img/home/card.png",
    cardLevelImg3: "img/home/card.png"
};





