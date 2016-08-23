/**
 * Created by xiangsongtao on 16/5/26.
 */
(function () {
    /**
     * 防抖函数(此方法被触发时:click,在设定的时间后执行回调函数,
     * 但是如果在等待期间被再次触发,则从新计时等待)
     *
     * 示例:
     * $scope.inc = function() {
     * $debounce(increase, 300);
     * };
     * */
    angular.module('smartac.page')
    .factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
      function($rootScope,   $browser,   $q,   $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
          var deferred = $q.defer(),
              promise = deferred.promise,
              skipApply = (angular.isDefined(invokeApply) && !invokeApply),
              timeoutId, cleanup,
              methodId, bouncing = false;

          // check we dont have this method already registered
          angular.forEach(methods, function(value, key) {
            if(angular.equals(methods[key].fn, fn)) {
              bouncing = true;
              methodId = key;
            }
          });

          // not bouncing, then register new instance
          if(!bouncing) {
            methodId = uuid++;
            methods[methodId] = {fn: fn};
          } else {
            // clear the old timeout
            deferreds[methods[methodId].timeoutId].reject('bounced');
            $browser.defer.cancel(methods[methodId].timeoutId);
          }

          var debounced = function() {
            // actually executing? clean method bank
            delete methods[methodId];

            try {
              deferred.resolve(fn());
            } catch(e) {
              deferred.reject(e);
              $exceptionHandler(e);
            }

            if (!skipApply) $rootScope.$apply();
          };

          timeoutId = $browser.defer(debounced, delay);

          // track id with method
          methods[methodId].timeoutId = timeoutId;

          cleanup = function(reason) {
            delete deferreds[promise.$$timeoutId];
          };

          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          promise.then(cleanup, cleanup);

          return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };

        return debounce;
      }]);
})();