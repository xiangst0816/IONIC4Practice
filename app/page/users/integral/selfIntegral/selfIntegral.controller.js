/**
 * Created by xiangsongtao on 16/3/16.
 * 自助积分 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('selfIntegralCtrl', ['$scope', '$ionicActionSheet', '$state', '$ionicSlideBoxDelegate', '$ionicPopup', '$toDateFormat', '$filter','$createTrade','$sessionStorage','$ionicLoading','$ionicToast','$base64','baseInfo', function ($scope, $ionicActionSheet, $state, $ionicSlideBoxDelegate, $ionicPopup, $toDateFormat, $filter,$createTrade,$sessionStorage,$ionicLoading,$ionicToast,$base64,baseInfo) {
           // console.log( $base64.encode("10000"))

            /**
             * 左右两个箭头切换silder
             * */
            var selfIntegralInfoSilder = $ionicSlideBoxDelegate.$getByHandle('selfIntegralInfo');
            $scope.showSilderLeft = function () {
                selfIntegralInfoSilder.slide(0)
            };
            $scope.showSilderRight = function () {
                selfIntegralInfoSilder.slide(1)
            };


            /**
             * 初始化显示第1个标题
             * */
            $scope.isShown = 0;

            /**
             * Swiper切换时触发函数
             * */
            $scope.silderChange = function ($index) {
                $scope.isShown = $index;
            };

            /**
             * actionSheet函数配置
             * */
            $scope.showActionSheet = function () {
                var hideActionSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '扫码积分'},
                        {text: '图片积分'}
                    ],
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                scanNow();
                                break;
                            case 1:
                                $state.go('subNav.photoIntegral');
                                break;
                        }
                        return true;
                    }
                });
            }

            /**
             * 微信扫一扫测试
             *
             * 数据格式: cardno|tradeno|shopid|tradetime|tradeamount
             * 数据格式：会员卡号|交易号|商铺id|交易时间(时间戳-不限单位)|交易金额
             * demo: 0000507915|234234234990|1|1473394332000|88888
             * 位数为4,第三个和第四个为数字
             * */
            function scanNow() {
                nativePlugin.scanQRCode(function (result) {
                    // var data = '051301|20160513171601|02a2411d-cde6-4bcb-9f6a-e7433436df19|4444444444444|500';
                    // alert("如果测试请记录数据");
                    // alert("扫出来的数据:"+JSON.stringify(result));
                    data = result.resultStr;
                    var arr = data.split('|');
                    if (arr.length !== 5) {
                        alert("二维码数据格式出错,请联系开发人员!");
                        return
                    }
                    var params = {
                        "cardno": $base64.encode(arr[0]),//是
                        "tradeno": arr[1],//是
                        "shopid": arr[2],
                        "tradetime": $filter('yyyyMMdd_HHmmss_minus')(arr[3]),
                        "tradeamount": $base64.encode(arr[4]),//是
                        "typeid": 1,//1 交易 ，2 退货  	Int32	是
                        "orgid": baseInfo.orgid,
                        "remark": "来自APP【扫码积分】的交易补录信息",
                        "createid":$sessionStorage.userInfo.customerid.toString(),//创建人	String 否
                        "createdtime":$filter('yyyyMMdd_HHmmss_minus')(new Date())//创建时间	String	否
                    };
                    // alert("发送到数据:"+JSON.stringify(params));
                    //交易消息补录 数据操作
                    $ionicLoading.show();
                    $createTrade(params).then(function (data) {
                        showNoticeInfo({
                            title:"积分成功",
                            template:"您已成功积分,请到【积分查询】查看结果!"
                        });
                    }, function (errText) {
                        showNoticeInfo({
                            title:"积分失败",
                            // template:"您已小票已积分,此操作无效!" + errText
                            template: errText
                        });
                    }).finally(function () {
                        $ionicLoading.hide();
                    })
                })
            }




            /**
             * 扫码积分,对话框
             * 收银小票已累积积分，此次操作不成功
             * 您已成功积分200积分
             * */
            function showNoticeInfo(options) {
                // var integralNum = 200;
                var alertPopup = $ionicPopup.show({
                    title: options.title, // String. The title of the popup.
                    cssClass: 'noticePopup text-center', // String, The custom CSS class name
                    subTitle: '', // String (optional). The sub-title of the popup.
                    template: options.template, // String (optional). The html template to place in the popup body.
                    //templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
                    //scope: $scope, // Scope (optional). A scope to link to the popup content.
                    buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                        text: '确定',
                        type: 'noticePopupBtn',
                        onTap: function (e) {
                            // $ionicHistory.goBack(-1);
                            // e.preventDefault() will stop the popup from closing when tapped.
                            //e.preventDefault();
                        }
                    }]
                });
                //alertPopup.then(function(res) {
                //  console.log('Thank you for not eating my delicious ice cream cone');
                //});
            }


        }]);

})();