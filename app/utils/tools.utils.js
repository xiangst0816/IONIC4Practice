(function () {
  angular.module('smartac.utils')

  /**
   * 字符串验证方法
   * */
      .factory('verification', function () {
        return {
          //是否是手机号码
          isMobile: function (e) {
            return /^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9])|(17[0-9]))\d{8}$/.test(e);
          },
          //是否为 NaN, undefined, null , 0 , '', false
          isEmpty: function (value) {
            if (value) {
              return false;
            }
            return true;
          },
          //是否为空对象，包括空数组
          isEmptyObject: function (e) {
            for (var t in e) return !1;
            return !0
          },
          isNum: function (e) {
            var t = /^\d+$/;
            return t.test(e);
          },
          islargeLength: function (str, len) {
            if (str.length >= len) {
              return true;
            }
            return false;
          },
          //是否是邮政编码
          isZip: function (str) {
            var e = /^\d{6}$/;
            return e.test(str)
          },
          /**
           *
           * @descrition:判断输入的参数是否是个合格的QQ号码
           * @param->str:待验证的参数
           * @return: true验证成功
           */
          isQQ: function (str) {
            /**
             *@descrition:规则
             * 1-9开头，最少5位。
             */
            var pattern = /^[1-9][0-9]{4,}$/
            return pattern.test(str);
          },
          /**
           * @descrition:判断输入的参数是否是个合格的固定电话号码。
           * @param:str->待验证的固定电话号码。
           * @return : true表示验证合格。
           *
           **/
          isfixedphone: function (str) {
            /**
             *
             * @desctition:规则->区号3-4位，号码7-8位,可以有分机号，分机号为3-4为，格式如下："0775-85333333-123"
             *
             */
            var e = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
            return e.test(str);
          },

          /**
           * 是否是昵称:  4-30个字符，可由中英文字母、数字、"-"、"_"组成。
           */
          isNickname: function (str) {
            var e = /^[\u4e00-\u9fa5_a-zA-Z0-9-\s]+$/;
            return e.test(str);
          },
          /**
           * 是否是密码
           * @param i
           * @returns {boolean}
           */
          isPassword: function (i) {
            var e = /^[a-zA-Z0-9]{6,20}$/;
            return e.test(i)
          },
          /**
           *
           * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
           * @param:str ->待验证的参数。
           * @return -> true表示合格的邮箱。
           *
           */
          isEmail: function (str) {
            /**
             * @descrition:邮箱规则
             * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
             * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
             * 3.@符号是必填项
             * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
             * 5.邮件提供商域可以包含特殊字符-、_、.
             */
            var e = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //var e = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;

            return e.test(str);
          },
          /**
           *
           * @descrition: 判断输入的参数是否是一个合格的身份证号码。这个函数对输入的参数检查时候是合格的身份证号码，其身份证有效性无法判断。检测的颗粒度可以定制。
           * @param->str : 待验证的参数
           * @return : true是合格的身份证   false为不合法的身份证
           *
           */
          isCard: function (num) {
            num = num.toUpperCase();

            var cityCode = {
              11: "北京",
              12: "天津",
              13: "河北",
              14: "山西",
              15: "内蒙古",
              21: "辽宁",
              22: "吉林",
              23: "黑龙江 ",
              31: "上海",
              32: "江苏",
              33: "浙江",
              34: "安徽",
              35: "福建",
              36: "江西",
              37: "山东",
              41: "河南",
              42: "湖北 ",
              43: "湖南",
              44: "广东",
              45: "广西",
              46: "海南",
              50: "重庆",
              51: "四川",
              52: "贵州",
              53: "云南",
              54: "西藏 ",
              61: "陕西",
              62: "甘肃",
              63: "青海",
              64: "宁夏",
              65: "新疆",
              71: "台湾",
              81: "香港",
              82: "澳门",
              91: "国外 "
            };

            if (!cityCode[num.substr(0, 2)]) {
              //alert("地址编码错误");
              return false;
            }
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
              //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
              return false;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            //下面分别分析出生日期和校验位
            var len, re;
            len = num.length;
            if (len == 15) {
              re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
              var arrSplit = num.match(re);

              //检查生日日期是否正确
              var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
              var bGoodDay;
              bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
              if (!bGoodDay) {
                //alert('输入的身份证号里出生日期不对！');
                return false;
              }
              else {
                //将15位身份证转成18位
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, k;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (k = 0; k < 17; k++) {
                  nTemp += num.substr(k, 1) * arrInt[k];
                }
                num += arrCh[nTemp % 11];
                return true;
              }
            }
            if (len == 18) {
              re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
              var arrSplit = num.match(re);

              //检查生日日期是否正确
              var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
              var bGoodDay;
              bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
              if (!bGoodDay) {
                //alert(dtmBirth.getYear());
                //alert(arrSplit[2]);
                //alert('输入的身份证号里出生日期不对！');
                return false;
              }
              else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, k;
                for (k = 0; k < 17; k++) {
                  nTemp += num.substr(k, 1) * arrInt[k];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                  //alert('18位身份证的校验码不正确！应该为：' + valnum);
                  return false;
                }
                return true;
              }
            }
            return false;
          }
        };
      })

      /**
       * 时间倒计时
       * @param {Number} duration 倒计时的时间，单位为s
       * @param {Function} onTick 正在倒计时时执行的函数,传入(secondsLeft:剩余秒数)
       * @param {Function} onComplete 倒计时完成后执行的函数
       * @return {Object} abort 清除定时器，倒计时停止；  getRemainingTime 获取剩余的秒数
       */


      .factory('Countdown', ['$interval', function ($interval) {
        return function (duration, onTick, onComplete) {
          var secondsLeft = Math.round(duration),
              tick = function () {
                if (secondsLeft > 0) {
                  onTick(secondsLeft);
                  secondsLeft -= 1;
                } else {
                  //clearInterval(interval);
                  $interval.cancel(interval);
                  onComplete();
                }
              },
              interval = $interval(
                  (function (self) {
                    return function () {
                      tick.call(self);
                    }
                  })(this),
                  1000
              );

          return {
            abort: function (callback) {
              $interval.cancel(interval);
              callback && callback();
              //clearInterval(interval);
            },
            getRemainingTime: function () {
              return secondsLeft;
            }
          };
        };
      }])


  /**
   * 防抖函数(此方法被触发时:click,在设定的时间后执行回调函数,
   * 但是如果在等待期间被再次触发,则从新计时等待)
   *
   * 示例:
   * $scope.inc = function() {
     * $debounce(increase, 300);
     * };
   * */
  // .factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
  //   function($rootScope,   $browser,   $q,   $exceptionHandler) {
  //     var deferreds = {},
  //         methods = {},
  //         uuid = 0;
  //
  //     function debounce(fn, delay, invokeApply) {
  //       var deferred = $q.defer(),
  //           promise = deferred.promise,
  //           skipApply = (angular.isDefined(invokeApply) && !invokeApply),
  //           timeoutId, cleanup,
  //           methodId, bouncing = false;
  //
  //       // check we dont have this method already registered
  //       angular.forEach(methods, function(value, key) {
  //         if(angular.equals(methods[key].fn, fn)) {
  //           bouncing = true;
  //           methodId = key;
  //         }
  //       });
  //
  //       // not bouncing, then register new instance
  //       if(!bouncing) {
  //         methodId = uuid++;
  //         methods[methodId] = {fn: fn};
  //       } else {
  //         // clear the old timeout
  //         deferreds[methods[methodId].timeoutId].reject('bounced');
  //         $browser.defer.cancel(methods[methodId].timeoutId);
  //       }
  //
  //       var debounced = function() {
  //         // actually executing? clean method bank
  //         delete methods[methodId];
  //
  //         try {
  //           deferred.resolve(fn());
  //         } catch(e) {
  //           deferred.reject(e);
  //           $exceptionHandler(e);
  //         }
  //
  //         if (!skipApply) $rootScope.$apply();
  //       };
  //
  //       timeoutId = $browser.defer(debounced, delay);
  //
  //       // track id with method
  //       methods[methodId].timeoutId = timeoutId;
  //
  //       cleanup = function(reason) {
  //         delete deferreds[promise.$$timeoutId];
  //       };
  //
  //       promise.$$timeoutId = timeoutId;
  //       deferreds[timeoutId] = deferred;
  //       promise.then(cleanup, cleanup);
  //
  //       return promise;
  //     }
  //
  //
  //     // similar to angular's $timeout cancel
  //     debounce.cancel = function(promise) {
  //       if (promise && promise.$$timeoutId in deferreds) {
  //         deferreds[promise.$$timeoutId].reject('canceled');
  //         return $browser.defer.cancel(promise.$$timeoutId);
  //       }
  //       return false;
  //     };
  //
  //     return debounce;
  //   }]);
})();