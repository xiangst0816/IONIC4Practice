/**
 * Created by xiangsongtao on 16/5/26.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 优惠券立即使用 usedNow
     * */
        .directive("clickToUseCoupon", ['$ionicPopover', '$log', 'baseUrl', function ($ionicPopover, $log, baseUrl) {
            return {
                restrict: 'A',
                scope: {
                    item: '='
                },
                controller: function ($scope, $element) {
                    //弹出的模板
                    var template = '<ion-popover-view class="showCode2D"> ' +
                        '<div class=showCode2DInnerBox> ' +
                        '<div class="imgBox"> ' +
                        '<ion-spinner icon="lines" class="imgLoadSpinner"></ion-spinner>' +
                        '<img ng-src="{{useGougon.codeImg}}" alt="">' +
                        '</div>' +
                        '<p><span ng-if="useGougon.type == 1">卡券</span><span ng-if="useGougon.type == 2">礼品</span><span>编号:</span><span ng-bind="useGougon.code"></span></p>' +
                        '</div>' +
                        '</ion-popover-view>';

                    //创建pop
                    $scope.popover = $ionicPopover.fromTemplate(template, {
                        scope: $scope
                    });

                    //点击事件
                    $element.on("touchstart", function () {
                        var code = $scope.item.code;
                        $log.debug("显示的code为:" + code);
                        $scope.useGougon = {
                            code: code,
                            type:$scope.item.type_code,
                            codeImg: baseUrl.generateQrcodeUrl + code + "|" + $scope.item.type_code
                        };
                        $scope.popover.show();
                    });

                    /**
                     * 页面退出销毁不用的部分
                     * */
                    $scope.$on('$destroy', function () {
                        $scope.popover.remove();
                    });


                }
            }
        }])
})();