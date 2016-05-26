/**
 * Created by xiangsongtao on 16/4/21.
 * 获取url中的GET参数对象
 * query: 传入http://....:3000?..=..&..=..#/...?..=..&..=..这样格式的url
 * 如果没传入值,则获取当前地址的url值
 * 返回包含参数的对象
 */
(function () {
    angular.module('smartac.page')
        .factory("$getUrlParams", [function () {
            return function (query) {
                if (!query) {
                    query = window.document.location.href.toString();
                }
                var pairs = [];
                var map;
                var search;
                var params = {};
                search = query.split('?');
                //元素整理
                for (var i = 0; search.length > i; i++) {
                    //将没有'='特征的元素干掉,因为里面没参数
                    if (search[i].indexOf('=') == -1) {
                        search.splice(i, 1);
                        i--;
                    } else {
                        //将具有'#'特征的元素干掉,干掉第二个,因为后面没需要的参数
                        search[i] = search[i].split('#')[0];
                        pairs.extend(search[i].split('&'));
                    }
                }
                for (var i = 0, len = pairs.length; i < len; i++) {
                    map = pairs[i].split('=');

                    if (map[0] in params) {
                        if (angular.isArray(params[map[0]])) {    // 第三次或更多插入
                            params[map[0]].push(map[1]);
                        } else {    // 第二次插入
                            params[map[0]] = [params[map[0]], map[1]];
                        }
                    } else {    // 第一次插入
                        params[map[0]] = map[1];
                    }
                }
                return params;
            }
        }])

})();