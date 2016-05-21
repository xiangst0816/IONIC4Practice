// /**
//  * Created by xiangsongtao on 16/5/20.
//  */
// (function () {
//     angular.module('smartac.directives')
//     //ionPlanetBox外层总容器
//         .directive('rewardCoupon', ['$rewardCoupons','$rewardGifts','$ionicPopup','$sessionStorage','$ionicLoading',function ($rewardCoupons,$rewardGifts,$ionicPopup,$sessionStorage,$ionicLoading) {
//             return {
//                 restrict: 'A',
//                 scope: {
//                     detail: '='
//                 },
//                 compile: function (ele, attr) {
//                     // ele.on('touchstart',function);
//                     return {
//                         // post: postFn
//                     };
//                 },
//                 // link:function () {
//                 //
//                 // }
//                 controller: ['$scope', '$element', function ($scope, $element) {
//                     // alert("fdfe");
//                     // console.log('JSON.stringify($scope.detail)');
//                     // console.log(JSON.stringify($scope.detail));
//
//                     var detail = $scope.detail;
//
//                     // $element.onclick(rewardCouponBtn($scope.detail))
//                     $element.on("click",function () {
//                         //判断title
//                         if (detail.type_code == 1) {
//                             var title = '礼券';
//                             var suffix = '张';
//                         } else {
//                             var title = '礼品';
//                             var suffix = '个';
//                         }
//                         //兑换请求
//                         $scope.data = {
//                             title: title,
//                             suffix: suffix,
//                             detail: detail
//                         };
//
//                         //默认为1
//                         $scope.data.convertNum || ($scope.data.convertNum = 1);
//
//                         var convertRequest = {
//                             title: "兑换" + title,
//                             cssClass: 'noticePopup convertRequestBox',
//                             subTitle: '',
//                             templateUrl: 'tpl/convertRequest.comp.html',
//                             scope: $scope,
//                             buttons: [{
//                                 text: '确定',
//                                 type: 'noticePopupBtn',
//                                 onTap: function (e) {
//                                     var convertNum = $scope.data.convertNum;
//                                     if (!convertNum) {
//                                         $ionicToast.show("请输入兑换数量!");
//                                         //如果没输入兑换数量则保持不动
//                                         e.preventDefault();
//                                     } else {
//                                         $ionicLoading.show({
//                                             //返回按钮
//                                             hideOnStateChange: true,
//                                             template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner>' +
//                                             '<br>' +
//                                             '<div style="margin-top:0.2rem">正在处理请求</div>'
//                                         });
//                                         //发送数据
//                                         if (detail.type_code == 1) {
//                                             //如果是兑换礼券
//                                             rewardCoupons(detail, convertNum).then(function (codeText) {
//                                                 $ionicLoading.hide();
//                                                 //兑换成功,这里返回7001
//                                                 // console.log(code)
//                                                 angular.extend(convertResult, {
//                                                     title: "兑换成功",
//                                                     template: codeText
//                                                 });
//                                                 $ionicPopup.show(convertResult);
//                                             }, function (codeText) {
//                                                 $ionicLoading.hide();
//                                                 angular.extend(convertResult, {title: "兑换失败", template: codeText});
//                                                 $ionicPopup.show(convertResult);
//                                             })
//                                         } else {
//                                             //如果是兑换礼品
//
//                                             rewardGifts(detail, convertNum).then(function (codeText) {
//                                                 $ionicLoading.hide();
//                                                 //兑换成功,这里返回7001
//                                                 // console.log(code)
//                                                 angular.extend(convertResult, {
//                                                     title: "兑换成功",
//                                                     template: codeText
//                                                 });
//                                                 $ionicPopup.show(convertResult);
//                                             }, function (codeText) {
//                                                 $ionicLoading.hide();
//                                                 // console.log(code)
//                                                 angular.extend(convertResult, {title: "兑换失败", template: codeText});
//                                                 $ionicPopup.show(convertResult);
//                                             })
//                                         }
//
//                                     }
//                                 }
//                             }, {
//                                 text: '取消', type: 'noticePopupBtn', onTap: function (e) {
//                                 }
//                             }
//                             ]
//                         };
//                         //显示兑换请求
//                         $ionicPopup.show(convertRequest);
//
//                         //定义返回结果的兑换消息参数结构
//                         var convertResult = {
//                             title: "",
//                             cssClass: 'noticePopup convertRequestBox',
//                             template: "",
//                             buttons: [{
//                                 text: '确定', type: 'noticePopupBtn', onTap: function (e) {
//                                 }
//                             }]
//                         };
//                     });
//
//
//
//
//                     /**
//                      * 卡券领取-积分兑换卡券
//                      * detail:obj,传入兑换卡券的信息对象
//                      * quantity,数量
//                      * */
//                     function rewardCoupons(detail, quantity) {
//                         return $rewardCoupons({
//                             "conditions": {
//                                 "custid": $sessionStorage.userInfo.customerid,
//                                 "couponid": detail.couponid,
//                                 "quantity": quantity,
//                                 "point": detail.point
//                             }
//                         });
//                     }
//
//                     /**
//                      * 礼品兑换-积分兑换礼品
//                      * detail:obj传入兑换卡券的信息对象
//                      * quantity,数量
//                      * */
//                     function rewardGifts(detail, quantity) {
//                         return $rewardGifts({
//                             "conditions": {
//                                 "custid": $sessionStorage.userInfo.customerid,
//                                 "giftid": detail.couponid,
//                                 "quantity": quantity,
//                                 "point": detail.point
//                             }
//                         });
//                     }
//
//
//
//
//
//
//
//
//
//                 }]
//
//             }
//         }])
// })();