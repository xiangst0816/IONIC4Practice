/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.page')
        .directive('smartTapBox', ["$ionicScrollDelegate", function ($ionicScrollDelegate) {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    //点击tap后,返回顶部,如果不这样做,点击背景会出现错误
                    ele.on('click', function () {
                        $ionicScrollDelegate.scrollTop(true);
                        $ionicScrollDelegate.resize();
                    });
                    ele.addClass('tapBox');
                }
            }
        }])
        //tap后出现下拉选项选择
        .directive('tapSelect', ['$timeout',function ($timeout) {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    ele.addClass('selectBox');
                    return {
                        pre: preFun
                    };
                    function preFun(scope, ele) {
                        var _scrollContent = angular.element(document.querySelectorAll(".scroll-content")[0]);
                        var _tapSelectBox = angular.element(document.querySelectorAll("tap-select"));
                        var _tapTimeOut;
                        ele.on('click', function () {
                            var _this = angular.element(this);
                            $timeout.cancel(_tapTimeOut);

                            if (_this.hasClass('showList')) {
                                _scrollContent.removeClass("active");
                                _this.removeClass('showList');
                                $timeout(function () {
                                    _this.removeClass('beforeShowList');
                                },200,false)

                            } else {
                                _tapSelectBox.removeClass('showList');
                                _tapSelectBox.removeClass('beforeShowList');

                                _this.addClass('showList');
                                _this.addClass('beforeShowList');
                                _scrollContent.addClass("active");

                                _tapTimeOut = $timeout(function () {
                                    _tapSelectBox.removeClass('showList');
                                    $timeout(function () {
                                        _this.removeClass('beforeShowList');
                                    },200,false)
                                },7000,false)
                            }
                            _scrollContent.on('click', function () {
                                _scrollContent.removeClass("active");
                                ele.removeClass('showList');
                                $timeout(function () {
                                    ele.removeClass('beforeShowList');
                                },200,false)
                            });
                        });
                    }


                }
            };
        }])

        //tap header
        .directive('tapHeader', [function () {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    ele.addClass('tapHeader');
                }
            };
        }])

        //tap list
        .directive('tapList', [function () {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    ele.addClass('tapList');
                }
            };
        }])

        //tap item
        .directive('tapItem', [function () {
            return {
                restrict: 'E',
                compile: function (ele, attr) {
                    ele.addClass('tapItem');
                }
            };
        }])

})();




