/**
 * Created by xiangsongtao on 16/3/16.
 * 客服 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('chatCenterCtrl', ['$scope', '$sessionStorage','$log','$allQuestionList', function ($scope, $sessionStorage,$log,$allQuestionList) {

            $allQuestionList({
                "conditions": {
                    "statuscode": 1,//问题状态 1 待处理 2 已处理(由后台处理)
                    "isopen": 1,//1 公开 0 不公开
                    "querytype": "main",
                    "page": {
                        "index": 0,
                        "num": 999
                    },
                    "sort": {
                        "column": "createdtime",
                        "type": "desc"
                    }
                }
            }).then(function (dataList) {
                $scope.dataList = dataList;

            })
        }]);

})();