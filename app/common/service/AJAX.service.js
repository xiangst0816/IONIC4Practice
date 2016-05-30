/**
 * Created by xiangsongtao on 16/4/20.
 */
(function () {
    angular.module('smartac.page')
    /**
     * AJAX方法
     * httpParams:为正常发送请求的参数对象($http)
     * */
        .factory("AJAX", ['$q', '$http', '$sessionStorage', 'api', 'baseInfo',
            function ($q, $http, $sessionStorage, api, baseInfo) {

                /**
                 * OAuth2.0
                 * getToken获得,返回promise
                 */
                function getToken() {
                    var req = {
                        method: 'POST',
                        url: api.authenticateUrl,
                        data: {
                            "app_id": baseInfo.appid,
                            "app_secret": baseInfo.appsecret
                        }
                    };
                    var defer = $q.defer();
                    $http(req).then(function (response) {
                        var data = response.data;
                        if (data.code == 7001) {
                            //用户信息写入locastorage中
                            $sessionStorage.authInfo = {
                                token: data.token,
                                time: new Date().getTime()
                            };
                            defer.resolve();
                        } else {
                            var errText;
                            switch (parseInt(data.code)) {
                                case 7004:
                                    errText = "AppID或AppSecret错误!";
                                    break;
                                default:
                                    errText = data.code;
                                    break;
                            }
                            defer.reject(errText);
                        }
                    }, function () {
                        defer.reject("Token获取失败!");
                    });
                    return defer.promise;
                }

                /**
                 * 真正发送请求的函数
                 * */
                function sendRequest(httpParams) {
                    //post方式提交参数设置
                    var dataFormat = {};
                    //默认使用get方式
                    if (httpParams.method) {
                        if (httpParams.method.toLocaleLowerCase() == 'post') {
                            dataFormat.data = httpParams.data;
                        } else if (httpParams.params) {
                            dataFormat.params = httpParams.params;
                        }
                    }

                    var params = {
                        method: httpParams.method || "GET",
                        url: httpParams.url,
                        cache: httpParams.cache || false,
                        timeout: httpParams.timeout || 15000,
                        success: httpParams.success || angular.noop(),
                        error: httpParams.error || angular.noop(),
                        notify: httpParams.notify || angular.noop(),
                        complete: httpParams.complete || angular.noop(),
                        headers: {
                            authorization: "token " + $sessionStorage.authInfo.token
                        }
                    };
                    params = angular.extend(params, dataFormat);
                    return $http(params).then(
                        //success
                        function (response) {
                            //对于返回7003的处理,再次刷新token
                            if (response && response.data && response.data.code && (response.data.code == 7003)) {
                                // alert(7003);
                                getToken();
                            }
                            httpParams.success && httpParams.success(response.data)
                        },
                        //error
                        function (response) {

                            httpParams.error && httpParams.error(response);
                            // httpParams.error && httpParams.error("系统错误");
                        },
                        //notify
                        function (response) {
                            httpParams.notify && httpParams.notify(response);
                        })
                        .catch(function (e) {
                            httpParams.catch && httpParams.catch(e);
                        })
                        .finally(function (value) {
                            httpParams.complete && httpParams.complete(value);
                        });
                }

                return function (httpParams) {
                    //发送之前确认权限
                    var authInfo = $sessionStorage.authInfo;
                    if (authInfo) {
                        if (((new Date().getTime() - parseInt(authInfo.time)) / 1000) < (3600 * 1.95 )) {
                            return sendRequest(httpParams)
                        } else {
                            return getToken().then(function () {
                                sendRequest(httpParams)
                            }, function () {
                                httpParams.error && httpParams.error("Token获取失败!");
                            });
                        }
                    } else {
                        return getToken().then(function () {
                            sendRequest(httpParams)
                        }, function () {
                            httpParams.error && httpParams.error("Token获取失败!");
                        });
                    }
                };
            }
        ])
})();
