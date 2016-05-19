/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('smartac.directives')
    //toggleClass切换Class
        .directive('toggleClass', [function () {
            return {
                restrict: 'E',
                scope: {
                    tcClass: '@'
                },
                link: function ($scope, $element, $attr) {
                    // console.log($scope.tcClass);
                    $element.on('touchend', function () {
                        $element.toggleClass($scope.tcClass);
                    })
                }
            };
        }])
})();
   