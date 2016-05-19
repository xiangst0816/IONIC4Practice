/**
 * Created by xiangsongtao on 16/5/3.
 * errCode转化为文字的服务类
 */
// (function () {
//     angular.module('smartac.services')
//         .factory("$errCode2Str", [function () {
//             return function (code) {
//                 var errText;
//                 switch(parseInt(code)){
//                     /**
//                      * 积分信息
//                      * */
//                     case 12004:
//                         errText = "传入参数错误!";
//                         break;
//                     case 12005:
//                         errText = "配置文件异常!";
//                         break;
//                     case 12006:
//                         errText = "RPC连接异常!";
//                         break;
//                     case 12007:
//                         errText = "发送请求失败!";
//                         break;
//                     case 12008:
//                         errText = "PB协议转换失败!";
//                         break;
//                     case 12009:
//                         errText = "无数据!";
//                         break;
//
//                     case 9003:
//                         errText = "服务器间通信异常!";
//                         break;
//                     case 9007:
//                         errText = "无数据!";
//                         break;
//
//                     /**
//                      * 卡券列表(all)
//                      * */
//                     case 11002:
//                         errText = "服务器异常!";
//                         break;
//                     case 11033:
//                         errText = "服务器间通讯异常!";
//                         break;
//                     // /**
//                     //  * 卡券兑换
//                     //  * */
//                     // case 11004:
//                     //     errText = "超过最大发放数!";
//                     //     break;
//                     // case 11005:
//                     //     errText = "该卡券不能用于积分兑换!";
//                     //     break;
//                     // case 11006:
//                     //     errText = "超过该卡券可兑换的最大数量!";
//                     //     break;
//                     // case 11007:
//                     //     errText = "您的积分余额不足,无法兑换!";
//                     //     break;
//                     // case 11008:
//                     //     errText = "不在该卡券的适用渠道范围内!";
//                     //     break;
//                     // case 11009:
//                     //     errText = "卡券已过期!";
//                     //     break;
//                     // case 11022:
//                     //     errText = "积分不足，无法兑换!";
//                     //     break;
//                     // case 11023:
//                     //     errText = "您的会员卡类型不具备兑换条件!";
//                     //     break;
//                     // case 11034:
//                     //     errText = "您的积分数不满足卡券的规则设置!";
//                     //     break;
//                     // /**
//                     //  * 礼品兑换
//                     //  * */
//                     // case 30001:
//                     //     errText = "系统异常!";
//                     //     break;
//                     // case 30002:
//                     //     errText = "会员不存在!";
//                     //     break;
//                     // case 30003:
//                     //     errText = "礼品不存在!";
//                     //     break;
//                     // case 30004:
//                     //     errText = "库存不足!";
//                     //     break;
//                     // case 30005:
//                     //     errText = "您的积分不足!";
//                     //     break;
//                     // case 30006:
//                     //     errText = "该礼品不可以使用积分兑换!";
//                     //     break;
//                     /**
//                      * 礼品列表(all)
//                      * */
//                     case 30007:
//                         errText = "服务器异常!";
//                         break;
//                     /**
//                      * 个人店铺收藏列表
//                      * */
//                     case 15001:
//                         errText = "服务器异常!";
//                         break;
//                     case 150002:
//                         errText = "服务器间通讯异常!";
//                         break;
//
//                     /**
//                      * 微信
//                      * */
//                     case 7003:
//                         errText = "Token无效!";
//                         break;
//                     case 8007:
//                         errText = "服务器异常!";
//                         break;
//
//                     default:
//                         errText = "code未找到,请添加"+code;
//                         break;
//                 }
//                 return errText;
//             }
//         }])
// })();
