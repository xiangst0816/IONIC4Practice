/**
 * Created by xiangsongtao on 16/3/31.
 * 时间转换 filter
 * 时间转换-时间戳转化成显示时间
 */
(function () {

    angular.module('smartac.filters')
        /**
         * 统一输入格式
         * 输入:时间戳(毫秒)/时间戳(秒)/日期/日期+时间
         * 输出:Date对象
         * */
        .factory("$toDateFormat", [function () {
            return function (value) {
                if (!value) {
                    value = new Date();
                    return value;
                }

                if (angular.isDate(value)) {
                    return value;
                }

                if (angular.isNumber(value)) {
                    value = value + "";
                }

                if(value.indexOf("-")){
                    value = value.replace(/-/g,"/");
                }

                var t= /^\d+$/;
                if (t.test(value)) {
                    //纯数字->时间戳
                    value = parseInt(value);
                    if (value.toString().length == 10) {
                        //时间戳(秒)
                        return new Date(value * 1000);
                    } else if (value.toString().length == 13) {
                        //时间戳(毫秒)
                        return new Date(value);
                    } else {
                        console.log("这个不是有效的时间戳,返回诡异值->2222-02-02 22:22:22")
                        return new Date(7955158942000)
                    }
                } else {
                    //如果是日期对象
                    return new Date(value);
                }
            }
        }])
        /**
         * 给value前加0,并保持总位数长度为length
         * */
        .factory("$zeroize", [function () {
            return function (value, length) {
                if (!length) length = 2;
                value = String(value);
                for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                    zeros += '0';
                }
                return zeros + value;
            }
        }])

        /**
         * 时间->2016.04.01
         * */
        .filter("yyyyMMdd_dot", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "." +
                    $zeroize(date.getMonth() + 1) + "." +
                    $zeroize(date.getDate());
            };
        }])
        /**
         * 时间->2016.04.01 23:12:01
         * */
        .filter("yyyyMMdd_HHmmss_dot", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "." +
                    $zeroize(date.getMonth() + 1) + "." +
                    $zeroize(date.getDate()) + " " +
                    $zeroize(date.getHours()) + ":" +
                    $zeroize(date.getMinutes()) + ":" +
                    $zeroize(date.getSeconds());
            };
        }])
        /**
         * 时间->2016.4.1
         * */
        .filter("yyyyMd_dot", ['$toDateFormat', function ($toDateFormat) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "." +
                    (date.getMonth() + 1) + "." +
                    date.getDate();
            };
        }])


        /**
         * 时间->2016-04-01
         * */
        .filter("yyyyMMdd_minus", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "-" +
                    $zeroize(date.getMonth() + 1) + "-" +
                    $zeroize(date.getDate());
            };
        }])
        /**
         * 时间->2016-04-01 06:12:01
         * */
        .filter("yyyyMMdd_HHmmss_minus", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "-" +
                    $zeroize(date.getMonth() + 1) + "-" +
                    $zeroize(date.getDate()) + " " +
                    $zeroize(date.getHours()) + ":" +
                    $zeroize(date.getMinutes()) + ":" +
                    $zeroize(date.getSeconds());
            };
        }])
        /**
         * 时间->2016-4-1 06:12:01
         * */
        .filter("yyyyMd_HHmmss_minus", ['$toDateFormat', function ($toDateFormat) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "-" +
                    (date.getMonth() + 1) + "-" +
                    (date.getDate()) + " " +
                    (date.getHours()) + ":" +
                    (date.getMinutes()) + ":" +
                    (date.getSeconds());
            };
        }])
        /**
         * 时间->2016-4-1
         * */
        .filter("yyyyMd_minus", ['$toDateFormat', function ($toDateFormat) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "-" +
                    (date.getMonth() + 1) + "-" +
                    date.getDate();
            };
        }])


        /**
         * 时间->2016/04/01
         * */
        .filter("yyyyMMdd_slash", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "/" +
                    $zeroize(date.getMonth() + 1) + "/" +
                    $zeroize(date.getDate());
            };
        }])
        /**
         * 时间->2016/04/01 06:12:01
         * */
        .filter("yyyyMMdd_HHmmss_slash", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "/" +
                    $zeroize(date.getMonth() + 1) + "/" +
                    $zeroize(date.getDate()) + " " +
                    $zeroize(date.getHours()) + ":" +
                    $zeroize(date.getMinutes()) + ":" +
                    $zeroize(date.getSeconds());
            };
        }])
        /**
         * 时间->2016/4/1
         * */
        .filter("yyyyMd_slash", ['$toDateFormat', function ($toDateFormat) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "/" +
                    (date.getMonth() + 1) + "/" +
                    date.getDate();
            };
        }])



        /**
         * 时间->2016年4月1日
         * */
        .filter("yyyyMd_cn", ['$toDateFormat', function ($toDateFormat) {
            return function (value) {
                var date = $toDateFormat(value);
                // alert((date))
                // alert(JSON.stringify(date))
                return date.getFullYear() + "年" +
                    (date.getMonth() + 1) + "月" +
                    date.getDate() + "日";
            };
        }])

        /**
         * 时间->2016年4月1日 12:30:23
         * */
        .filter("yyyyMd_HHmmss_cn", ['$toDateFormat', '$zeroize', function ($toDateFormat, $zeroize) {
            return function (value) {
                var date = $toDateFormat(value);
                return date.getFullYear() + "年" +
                    (date.getMonth() + 1) + "月" +
                    date.getDate() + "日" + " " +
                    $zeroize(date.getHours()) + ":" +
                    $zeroize(date.getMinutes()) + ":" +
                    $zeroize(date.getSeconds());
            };
        }])







        /**
         * 时间转换-时间戳转化成显示时间
         * 时间->2016.04.01
         * */
        .filter("timestamp2yyyymmddDot", ['$toDateFormat', function ($toDateFormat) {
            return function (timestamp) {

                var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
                var date = (d.getFullYear()) + "." +
                    (d.getMonth() + 1) + "." +
                    (d.getDate())
                return date;
            };
        }])


        /**
         * 时间转换-时间戳转化成显示时间
         * 1459481906->2016年4月1日
         * */
        .filter("timestamp2yyyymmddCN", [function () {
            return function (timestamp) {
                var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
                var date = (d.getFullYear()) + "年" +
                    (d.getMonth() + 1) + "月" +
                    (d.getDate()) + "日"
                return date;
            };
        }])


        /**
         * 时间转换-时间戳转化成显示时间
         * 1459481906->2016-4-1
         * */
        .filter("timestamp2yyyymmddLine", [function () {
            return function (timestamp) {
                var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
                var addZero = function (data) {
                    if (parseInt(data) < 10) {
                        return "0" + data;
                    } else {
                        return data;
                    }
                };
                var date = (d.getFullYear()) + "-" +
                    addZero(d.getMonth() + 1) + "-" +
                    addZero(d.getDate())
                return date;
            };
        }])

        /**
         * 时间转换-时间戳转化成显示时间
         * 1459481906->2016-4-1 12:12:12
         * */
        .filter("timestamp2yyyymmddhhmmss", [function () {
            return function (timestamp) {
                var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
                var addZero = function (data) {
                    if (parseInt(data) < 10) {
                        return "0" + data;
                    } else {
                        return data;
                    }
                };
                // addZero()
                var date = (d.getFullYear()) + "-" +
                    addZero(d.getMonth() + 1) + "-" +
                    addZero(d.getDate()) + " " +
                    addZero(d.getHours()) + ":" +
                    addZero(d.getMinutes()) + ":" +
                    addZero(d.getSeconds());
                return date;
            };
        }])

})();