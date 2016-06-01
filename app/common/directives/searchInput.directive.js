/**
 * Created by xiangsongtao on 16/4/18.
 * 搜索组件
 * 事件:
 * "$changeHistoryBoxStatus":设置HistoryBox显示结果,发送数据:"show","hide"
 * "$cleanInput":清理搜索框的事件
 * "$searchNow":发起搜索事件,发送的数据:$scope.searchFor
 * 状态:
 * $rootScope.isHistoryBoxOpen:boolean,true:开启
 */
(function () {
    angular.module('smartac.page')
        .directive("smartSearchBox", [function () {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    ele.addClass('searchBox');
                }
            }
        }])
        /**
         * 搜索组件,当点击搜索框的时候,
         * */
        .directive("smartSearchInput", [function () {
            return {
                restrict: 'E',
                compile: function (ele) {
                    ele.addClass('searchBoxInput');
                    return {
                        pre: function ($scope, $element) {
                            /**
                             * 点击搜索出现搜索历史记录
                             * */
                            $element.find('input').on('touchstart', function () {
                                $scope.$broadcast("$changeHistoryBoxStatus", "show");
                            });
                        }
                    }
                }
            }
        }])

        /**
         *  clean input btn
         *  将同级(上一个)的input元素内容清空
         *  正确设置:ng-model="searchFor"
         *  input和此组件在同一级
         * */
        .directive("smartCleanInput", [function () {
            return {
                restrict: 'E',
                controller: ['$scope', '$element', function ($scope, $element) {
                    $element.on('touchstart', function () {
                        //清空input
                        $scope.searchFor = null;
                        $scope.$broadcast("$cleanInput");
                        $scope.$digest();
                    })
                }]
            }
        }])
        /**
         *  搜索btn
         *  将同级(上一个)的input元素内容清空
         *  正确设置:ng-model="searchFor"
         *  input和此组件在同一级
         *   $scope.dataToDisplay表示要显示的数据列表
         * */
        .directive("smartSearchBtn", [function () {
            return {
                restrict: 'E',
                controller: ['$scope', '$element', function ($scope, $element) {
                    /**
                     * 点击搜索按钮; 添加历史记录
                     * 1. 如果input有值,则搜索
                     * 2. 没值则返回
                     * */
                    $element.on("touchstart", function () {
                        if ($scope.searchFor) {
                            $scope.$broadcast("$searchNow");
                            $scope.$broadcast("$changeHistoryBoxStatus", "hide");
                            $scope.$digest();
                        } else {
                            $scope.$broadcast("$changeHistoryBoxStatus", "hide");
                        }
                    });
                }]
            }
        }])
        /**
         * 搜索的Box
         * */
        .directive("smartHistoryBox", [function () {
            return {
                restrict: 'E',
                controller: ['$scope', '$element', '$attrs', '$localStorage', '$timeout', '$rootScope', '$debounce', function ($scope, $element, $attrs, $localStorage, $timeout, $rootScope, $debounce) {
                    /**
                     * 获取存储历史记录的$localStorage字段的名字
                     * */
                    var storageName = $attrs.storageName;
                    if (!storageName) {
                        console.log("请添加storage-name属性,否则历史记录显示会出错!")
                        return
                    }
                    if (!$localStorage[storageName]) {
                        $localStorage[storageName] = {"dataArr": []};
                    }
                    $scope.historyList = $localStorage[storageName].dataArr;
                    $scope.$on("$changeHistoryBoxStatus", function (event, status) {
                        if (status == 'show') {
                            $rootScope.isHistoryBoxOpen = true;
                            $element.addClass("active");
                            $element.addClass("beforeActive");
                        } else if (status == 'hide') {
                            $element.removeClass("active");
                            $timeout(function () {
                                $element.removeClass("beforeActive");
                            }, 200, false)
                            $rootScope.isHistoryBoxOpen = false;
                        }
                    });

                    /**
                     * 在历史记录列表上点击历史搜索记录,触发快捷搜索
                     * */
                    $scope.searchThis = function (value) {
                        $scope.searchFor = value;
                        $scope.$broadcast("$searchNow");
                        $scope.$broadcast("$changeHistoryBoxStatus", "hide");
                    };

                    /**
                     * 删除history记录
                     * */
                    $scope.deleteHistory = function (id) {
                        if (id == -1) {
                            // console.log("clean all")
                            //删除dataArr中的所有数据
                            delete $localStorage[storageName].dataArr.splice(0);
                        } else {
                            // console.log("clean just: " + id);
                            //将第id个元素干掉
                            $localStorage[storageName].dataArr.splice(id, 1);
                        }
                    };

                    /**
                     * 添加历史记录
                     * */
                    $scope.$on("$searchNow", function () {
                        var _dataArr = $localStorage[storageName].dataArr;
                        if (_dataArr.indexOf($scope.searchFor) === -1) {
                            $localStorage[storageName].dataArr.unshift($scope.searchFor);
                            //最多显示6条
                            if (_dataArr.length > 6) {
                                $localStorage[storageName].dataArr.pop();
                            }
                        }
                    });

                    // /**
                    //  * 历史记录分为两种状态
                    //  * 监听input的值,如果!=null,则为联想状态;如果为空,则为历史记录状态
                    //  * */
                    // $scope.$watch('searchFor', function () {
                    //     if (!!$scope.searchFor) {
                    //         //进入联想状态
                    //         $scope.isHistoryStatus = false;
                    //         $debounce(lenovo,1000);
                    //     }
                    // });

                    // /**
                    //  * 执行联想
                    //  * */
                    // function lenovo() {
                    //     $scope.$broadcast("$lenovoNow");
                    // }

                }]
            }
        }])

})();


