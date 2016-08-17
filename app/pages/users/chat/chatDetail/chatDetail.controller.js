/**
 * Created by xiangsongtao on 16/3/16.
 * 客服 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('chatDetailCtrl', ['$scope','$stateParams', function ($scope,$stateParams) {
            $scope.detail = $stateParams.detail;
           
            // console.log($scope.detail)
            //用于测试
            if(!$scope.detail){
                $scope.detail = {
                    "id": 9,
                    "custid": 1,
                    "name": "如何注册账号如何注册账号如何注册账号如何注册账号如何注册账号?",
                    "detail": "通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册",
                    "reply": "通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册通过注册页面进行注册",
                    "statuscode": 1,
                    "isopen": 0,
                    "contactinfo": "18761938554"
                }
            }

        }]);

})();