/**
 * Created by xiangsongtao on 16/5/24.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 礼品卡券领取逻辑,将下面的两个逻辑进行整合
     * 放在directive中方便管理
     * 进行信息弹出确认及兑换工作
     * */
        .directive("clickToReward", ['$rewardCoupons', '$rewardGifts', '$ionicPopup', '$ionicToast', '$log', '$ionicLoading', '$sessionStorage', '$q', function ($rewardCoupons, $rewardGifts, $ionicPopup, $ionicToast, $log, $ionicLoading, $sessionStorage, $q) {
            return {
                restrict: 'A',
                scope: {
                    rewardDetail: '='
                },
                controller: ['$scope','$element',function ($scope, $element) {
                    $element.on("touchend", function () {
                        var couponDetail = $scope.rewardDetail;
                        if (couponDetail.type_code == 1) {
                            var title = '礼券';
                            var suffix = '张';
                        } else {
                            var title = '礼品';
                            var suffix = '个';
                        }
                        //兑换请求
                        $scope.data = {
                            title: title,
                            suffix: suffix,
                            detail: couponDetail,
                            convertNum: 1
                        };
                        var template = '<div class="convertRequestBox" ng-switch="data.detail.valid_type_code">' +
                            '<p class="title">确认兑换该{{data.title}}&ensp;<input id="convertNum" min="0" ng-model="data.convertNum" type="number">&ensp;{{data.suffix}}?</p>' +
                            '<div ng-if="data.detail.type_code == 1" ng-switch-when="1" class="subTitle">(使用有效期截止 <span ng-bind="data.detail.valid_end_time | yyyyMd_cn"></span>)</div>' +
                            '<div ng-if="data.detail.type_code == 1" ng-switch-when="2" class="subTitle">(从兑换开始: <span ng-bind="data.detail.valid_days"></span>天内有效)</div>' +
                            '<div ng-if="data.detail.type_code == 2" class="subTitle">(使用有效期截止 <span ng-bind="data.detail.valid_end_time | yyyyMd_cn"></span>)</div>' +
                            '</div>';

                        //定义返回结果的兑换消息参数结构
                        var convertResult = {
                            title: "",
                            cssClass: 'noticePopup convertRequestBox',
                            template: "",
                            buttons: [{
                                text: '确定', type: 'noticePopupBtn', onTap: function (e) {
                                }
                            }]
                        };

                        var vipLevel = $sessionStorage.userInfo.levelid;
                        var custCardTypeLimit = couponDetail.cust_card_type_limit;
                        $log.debug("会员等级-限制列表:" + vipLevel + "-" + custCardTypeLimit);
                        //限制会员等级兑换
                        if (!!custCardTypeLimit && custCardTypeLimit.indexOf(vipLevel) == -1) {
                            angular.extend(convertResult, {
                                title: "兑换失败",
                                template: "您的会员等级不能此次进行兑换!"
                            });
                            $ionicPopup.show(convertResult);
                            return
                        }

                        //显示兑换请求
                        $ionicPopup.show({
                            title: "兑换" + title,
                            cssClass: 'noticePopup convertRequestBox',
                            subTitle: '',
                            template: template,
                            scope: $scope,
                            buttons: [{
                                text: '确定',
                                type: 'noticePopupBtn',
                                onTap: function (e) {
                                    var convertNum = $scope.data.convertNum;
                                    if (!convertNum) {
                                        $ionicToast.show("请输入兑换数量!");
                                        //如果没输入兑换数量则保持不动
                                        e.preventDefault();
                                    } else {
                                        $ionicLoading.show({
                                            //返回按钮
                                            hideOnStateChange: true,
                                            template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
                                            '<br>' +
                                            '<div style="margin-top:0.2rem">正在处理请求</div>'
                                        });
                                        //发送数据
                                        if (couponDetail.type_code == 1) {
                                            //如果是兑换礼券
                                            rewardCoupons(couponDetail, convertNum).then(function (codeText) {
                                                $ionicLoading.hide();
                                                //兑换成功,这里返回7001
                                                angular.extend(convertResult, {
                                                    title: "兑换成功",
                                                    template: codeText
                                                });
                                            }, function (codeText) {
                                                $ionicLoading.hide();
                                                angular.extend(convertResult, {
                                                    title: "兑换失败",
                                                    template: codeText
                                                });
                                            }).finally(function () {
                                                $ionicPopup.show(convertResult);
                                            });
                                        } else {
                                            //如果是兑换礼品
                                            rewardGifts(couponDetail, convertNum).then(function (codeText) {
                                                $ionicLoading.hide();
                                                //兑换成功,这里返回7001
                                                angular.extend(convertResult, {
                                                    title: "兑换成功",
                                                    template: codeText
                                                });
                                            }, function (codeText) {
                                                $ionicLoading.hide();
                                                angular.extend(convertResult, {
                                                    title: "兑换失败",
                                                    template: codeText
                                                });
                                            }).finally(function () {
                                                $ionicPopup.show(convertResult);
                                            });
                                        }

                                    }
                                }
                            }, {
                                text: '取消', type: 'noticePopupBtn', onTap: function (e) {
                                }
                            }
                            ]
                        });
                    });

                    /**
                     * 卡券领取-积分兑换卡券
                     * detail:obj,传入兑换卡券的信息对象
                     * quantity,数量
                     * */
                    function rewardCoupons(detail, quantity) {
                        var defer = $q.defer();
                        //参数
                        var totalNum = quantity;
                        var successNum = 0;
                        var paramsParts = {
                            "conditions": {
                                "custid": $sessionStorage.userInfo.customerid,
                                "couponid": detail.couponid,
                                // "quantity": quantity,
                                "point": detail.point
                            }
                        };
                        sendReuest(paramsParts);
                        /**
                         * 发送请求
                         * */
                        function sendReuest(paramsParts) {
                            $rewardCoupons(paramsParts).then(function (codeText) {
                                successNum++;
                                $log.debug('successNum:totalNum');
                                $log.debug(successNum + " : " + totalNum);
                                if (successNum == totalNum) {
                                    defer.resolve(codeText);
                                } else {
                                    sendReuest(paramsParts);
                                }
                            }, function (errText) {
                                var text;
                                if ((totalNum == 1) && (successNum == 0)) {
                                    text = errText;
                                } else {
                                    text = errText + "<br>剩余" + (totalNum - successNum) + "张兑换失败!";
                                }
                                $log.debug("总共兑换卡券:" + totalNum + ",成功:" + successNum + "。失败查原因:" + errText);
                                defer.reject(text);
                            });
                        }

                        return defer.promise;
                    }

                    /**
                     * 礼品兑换-积分兑换礼品
                     * detail:obj传入兑换卡券的信息对象
                     * quantity,数量
                     * */
                    function rewardGifts(detail, quantity) {
                        return $rewardGifts({
                            "conditions": {
                                "custid": $sessionStorage.userInfo.customerid,
                                "giftid": detail.couponid,
                                "quantity": quantity,
                                "point": detail.point
                            }
                        });
                    }
                }]
            }
        }])
        /**
         * 卡券领取-积分兑换卡券(ok)
         * */
        .factory("$rewardCoupons", ['AJAX', 'api', '$q', '$log', function (AJAX, api, $q, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "rewardCoupon",
                    "conditions": {
                        "custid": "",
                        "couponid": "",
                        "quantity": "",
                        "activityname": "",
                        "sendchannelcode": 6,
                        "applicablechannelcode": 1,
                        "isexchangedbypoint": 1,
                        "point": ""
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                // console.log(params)
                AJAX({
                    method: 'post',
                    url: api.couponUrl,
                    data: params,
                    success: function (data) {
                        // console.log(data);
                        if (parseInt(data.code) == 7001) {
                            defer.resolve("您可在【会员中心】-【礼品卡券】中查看/更改订单详情。")
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 11004:
                                    errText = "超过最大发放数!";
                                    break;
                                case 11005:
                                    errText = "该卡券不能用于积分兑换!";
                                    break;
                                case 11006:
                                    errText = "超过该卡券可兑换的最大数量!";
                                    break;
                                case 11007:
                                    errText = "您的积分余额不足,无法兑换!";
                                    break;
                                case 11008:
                                    errText = "不在该卡券的适用渠道范围内!";
                                    break;
                                case 11009:
                                    errText = "卡券已过期!";
                                    break;
                                case 11022:
                                    errText = "积分不足，无法兑换!";
                                    break;
                                case 11023:
                                    errText = "您的会员卡类型不具备兑换条件!";
                                    break;
                                case 11034:
                                    errText = "您的积分数不满足卡券的规则设置!";
                                    break;
                                default:
                                    errText = "系统异常,请稍后再试!";
                                    break;
                            }
                            $log.debug('兑换失败,code:' + data.code);
                            defer.reject(errText)
                        }
                    },
                    error: function (errText) {
                        // $ionicToast.show("系统繁忙,请稍后再试!");
                        $log.debug('兑换失败,code:' + JSON.stringify(errText));
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])
        /**
         * 礼品兑换-积分兑换礼品()
         * */
        .factory("$rewardGifts", ['AJAX', 'api', '$q', '$log', function (AJAX, api, $q, $log) {
            return function (options) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "exchangebypoint",
                    "conditions": {
                        "custid": "",
                        "giftid": "",
                        "quantity": "",
                        "activityname": "",
                        "sendchannelcode": 6,//1注册 2.积分 3.交易 4.打标签 5.围栏活动 6.兑换 7.大屏 8.海报 9.活动 10.SR后台
                        "applicablechannelcode": 1,
                        "isexchangedbypoint": 1,
                        "point": ""
                    }
                };
                //数据合并
                angular.deepExtend(params, options);
                AJAX({
                    method: 'post',
                    url: api.giftUrl,
                    data: params,
                    success: function (data) {
                        // console.log(data);
                        if (parseInt(data.errcode) == 7001) {
                            defer.resolve("您可在【会员中心】-【礼品卡券】中查看/更改订单详情。")
                        } else {
                            var errText;
                            switch (parseInt(data.errcode)) {
                                case 30001:
                                    errText = "系统异常!";
                                    break;
                                case 30002:
                                    errText = "会员不存在!";
                                    break;
                                case 30003:
                                    errText = "礼品不存在!";
                                    break;
                                case 30004:
                                    errText = "库存不足!";
                                    break;
                                case 30005:
                                    errText = "您的积分不足!";
                                    break;
                                case 30006:
                                    errText = "该礼品不可以使用积分兑换!";
                                    break;
                                case 30007:
                                    errText = "超过最大兑换数量!";
                                    break;
                                default:
                                    errText = "系统异常,请稍后再试!";
                                    break;
                            }
                            $log.debug("兑换失败,code:" + data.errcode);
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        // $ionicToast.show("系统繁忙,请稍后再试!");
                        $log.debug("兑换失败,code:" + JSON.stringify(errText));
                        defer.reject("系统繁忙,请稍后再试!");
                    }
                });
                return defer.promise;
            }
        }])

})();
