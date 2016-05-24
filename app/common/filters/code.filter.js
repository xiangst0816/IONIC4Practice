/**
 * Created by xiangsongtao on 16/3/31.
 */
(function () {

    angular.module('smartac.page')
    /**
     * 会员卡等级
     * */
        .filter('cardLevelIDToName', [function () {
            return function (levelid) {
                //电子卡,普卡,VIP,对应1,2,3
                levelid = parseInt(levelid);
                var name = '';
                switch (levelid) {
                    case 1:
                        name = "电子卡";
                        break;
                    case 2:
                        name = "普卡";
                        break;
                    case 3:
                        name = "VIP卡";
                        break;
                    default:
                        return "火星卡";

                }
                return name;
            };
        }])

        /**
         * 积分获得方式
         * */
        .filter('pointChannelCode', [function () {
            return function (pointChannelCode) {
                switch (pointChannelCode) {
                    case "point_channelcode_1":
                        return "交易";
                        break;
                    case "point_channelcode_2":
                        return "手动调整";
                        break;
                    case "point_channelcode_3":
                        return "会员中心";
                        break;
                    case "point_channelcode_4":
                        return "奖励推送";
                        break;
                    case "point_channelcode_5":
                        return "兑换";
                        break;
                    case "point_channelcode_6":
                        return "退货";
                        break;
                    case "point_channelcode_7":
                        return "导入";
                        break;
                    case "point_channelcode_8":
                        return "标签";
                        break;
                    case "point_channelcode_9":
                        return "微信";
                        break;
                    case "point_channelcode_10":
                        return "计划任务";
                        break;
                    case "point_channelcode_11":
                        return "奖赏引擎";
                        break;
                    case "point_channelcode_12":
                        return "分享";
                        break;
                    default:
                        return "火星";
                }
            }
        }])

        /**
         * 积分获得方式:增加,减少
         * */
        .filter('pointTypecode', [function () {
            return function (pointypecode) {
                switch (pointypecode) {
                    case "point_typecode_1":
                        return "+";
                        break;
                    case "point_typecode_2":
                        return "";
                        break;
                    default:
                        return "";
                }
            }
        }])


        /**
         * 卡券分类code变中文
         */
        .filter("couponCategoryToName", [function () {
            return function (couponCategoryCode) {
                switch (couponCategoryCode) {
                    case 'coupon_category_all':
                        return "不限";
                        break;
                    case 'coupon_category_1':
                        return "折扣券";
                        break;
                    case 'coupon_category_2':
                        return "抵用券";
                        break;
                    case 'coupon_category_3':
                        return "现金券";
                        break;
                    case 'coupon_category_4':
                        return "兑换券";
                        break;
                    default:
                        return "其他券";
                }
            };
        }])

        /**
         * 商品种类code变中文
         * */
        .filter("goodTypeToName", [function () {
            return function (goodTypeCode) {
                switch (goodTypeCode) {
                    case 'coupon_goodtype_all':
                        return "不限";
                        break;
                    case 'coupon_goodtype_1':
                        return "服饰类";
                        break;
                    case 'coupon_goodtype_2':
                        return "数码类";
                        break;
                    case 'coupon_goodtype_3':
                        return "餐饮类";
                        break;
                    case 'coupon_goodtype_4':
                        return "其他";
                        break;
                    default:
                        return "其他";
                }
            };
        }])


        /**
         * 店铺业态变中文
         */
        .filter("industryCodeToName", [function () {
            return function (industrycode) {
                if (industrycode && !isNaN(industrycode)) {
                    industrycode = "sc_industry" + industrycode;
                }
                switch (industrycode) {
                    case "":
                        return "不限";
                        break;
                    case "sc_industry_1":
                        return "餐饮";
                        break;
                    case "sc_industry_2":
                        return "服装";
                        break;
                    case "sc_industry_3":
                        return "娱乐";
                        break;
                    case "sc_industry_4":
                        return "酒店";
                        break;
                    case "sc_industry_5":
                        return "零售";
                        break;
                }
            };
        }])




        // /**
        //  * 积分兑换卡券的返回code转化为错误提示
        //  * */
        // .filter("rewardCouponCode2Name", function () {
        //     return function (code) {
        //         switch (code) {
        //             case 7001:
        //                 return "您可在【会员中心】-【礼品卡券】中查看/更改订单详情。";
        //                 break;
        //             case 11004:
        //                 return "超过最大发放数!";
        //                 break;
        //             case 11005:
        //                 return "该卡券不能用于积分兑换!";
        //                 break;
        //             case 11006:
        //                 return "超过该卡券可兑换的最大数量!";
        //                 break;
        //             case 11007:
        //                 return "您的积分余额不足,无法兑换!";
        //                 break;
        //             case 11008:
        //                 return "不在该卡券的适用渠道范围内!";
        //                 break;
        //             case 11009:
        //                 return "卡券已过期!";
        //                 break;
        //             case 11022:
        //                 return "积分不足，无法兑换!";
        //                 break;
        //             case 11023:
        //                 return "您的会员卡类型不具备兑换条件!";
        //                 break;
        //             case 11034:
        //                 return "您的积分数不满足卡券的规则设置!";
        //                 break;
        //             default:
        //                 return "其他异常,code:" + code;
        //                 break;
        //         }
        //     }
        //
        // })

        // /**
        //  * 积分兑换礼品的返回code转化为错误提示
        //  * */
        // .filter("rewardGiftCode2Name", function () {
        //     return function (code) {
        //         switch (code) {
        //             case 7001:
        //                 return "您可在【会员中心】-【礼品卡券】中查看/更改订单详情。";
        //                 break;
        //             case 30001:
        //                 return "系统异常!";
        //                 break;
        //             case 30002:
        //                 return "会员不存在!";
        //                 break;
        //             case 30003:
        //                 return "礼品不存在!";
        //                 break;
        //             case 30004:
        //                 return "库存不足!";
        //                 break;
        //             case 30005:
        //                 return "您的积分不足!";
        //                 break;
        //             case 30006:
        //                 return "该礼品不可以使用积分兑换!";
        //                 break;
        //             default:
        //                 return "其他异常,code:" + code;
        //                 break;
        //         }
        //     }
        //
        // })






        /**
         * 过滤掉html代码片段中的style属性
         * 删除style字段及其内部属性
         * */
        .filter("withoutStyle", function () {
            return function (htmlSegment) {
                if (!htmlSegment) {
                    return ""
                } else {
                    htmlSegment = htmlSegment.replace(/style/ig, "data-style");
                    htmlSegment = htmlSegment.replace(/href/ig, "data-href");
                    htmlSegment = htmlSegment.replace(/src/ig, "data-src");
                    htmlSegment = htmlSegment.replace(/ol|ul|li|blockquote/ig, "p");
                    htmlSegment = htmlSegment.replace(/strong|em|img/ig, "span");
                    htmlSegment = htmlSegment.replace(/<a/ig, "<span");
                    htmlSegment = htmlSegment.replace(/<\/a>/ig, "<\/span>");
                }
                return htmlSegment;
            }
        })

})();