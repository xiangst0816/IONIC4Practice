/**
 * Created by xiangsongtao on 16/3/16.
 * 自助停车-找回爱车-controller
 */
(function () {
    angular.module('smartac.page')
        .controller('findCarCtrl', ['$getParkingPosition',function ($getParkingPosition) {
            console.log("findCarCtrl")

            /**
             * 查询车辆停放位置
             * */
            $getParkingPosition().then(function (data) {
                console.log(data)
            })


        }]);
})();
