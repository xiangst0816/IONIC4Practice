/**
 * Created by xiangsongtao on 16/3/16.
 * 礼品礼券 detail-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('couponDetailCtrl', ['$scope', '$stateParams', '$timeout', '$rootScope', '$couponDetail','$ionicLoading','$log', function ($scope, $stateParams, $timeout, $rootScope, $couponDetail,$ionicLoading,$log) {

            // var detail = $stateParams.detail;
            // var couponid = detail.couponid;
            // var typecode = detail.typecode;
            // var statuscode = detail.statuscode;
            // var customerid = $stateParams.customerid;
            // var code = $stateParams.code;
            // $log.debug("$stateParams:"+JSON.stringify($stateParams))



            $scope.item= $stateParams.detail;
            //为空则后退
            if(!$scope.item){
                $timeout(function () {
                    $rootScope.goBack();
                }, 1300, false);
                return
            }



            console.log($stateParams.detail);


            // $ionicLoading.show();
            // $couponDetail({
            //     "conditions": {
            //         "couponid": couponid,
            //         "typecode":typecode
            //     }
            // }).then(function (data) {
            //     data.status_code = statuscode;
            //     // data.customer_id = customerid;
            //     data.code = code;
            //     console.log(data)
            //     // $log.debug(JSON.stringify(data));
            //
            //     $scope.item = data;
            // }, function () {
            //     $timeout(function () {
            //         $rootScope.goBack();
            //     }, 1300, false);
            // }).finally(function () {
            //     $ionicLoading.hide();
            // });


        }]);
})();
