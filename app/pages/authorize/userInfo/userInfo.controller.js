/**
 * Created by xiangsongtao on 16/3/16.
 * 会员中心-个人信息 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('memberInfoCtrl', ['$rootScope', '$scope', '$sessionStorage', '$http', 'verification', '$ionicLoading', 'AJAX', '$ionicToast',  '$updateUserInfo', '$log', '$ionicNavBarDelegate', '$getCode','$q','$getUserInfo', function ($rootScope, $scope, $sessionStorage, $http, verification, $ionicLoading, AJAX, $ionicToast, $updateUserInfo, $log, $ionicNavBarDelegate, $getCode,$q,$getUserInfo) {

            /**
             * 完善个人信息显示返回按钮
             * */
            $ionicNavBarDelegate.showBackButton(true);
            /**
             * 从sessionstorage中读取数据,并填充到表单中
             * API.imgDomainUrl + data.uuid
             * */


            $sessionStorage.userInfo.time = 0;
            $getUserInfo({
                "conditions": {
                    "customerid": $sessionStorage.userInfo.customerid.toString()
                }
            }).then(function () {

                //基本信息
                $scope.params = {
                    photo: $sessionStorage.userInfo.photo,
                    photoToShow: API.imgDomainUrl + $sessionStorage.userInfo.photo,
                    fullname: $sessionStorage.userInfo.fullname,
                    mobile: $sessionStorage.userInfo.mobile,
                    provincecode: $sessionStorage.userInfo.provincecode || '',
                    citycode: $sessionStorage.userInfo.citycode || '',
                    address: $sessionStorage.userInfo.address || '',
                    haschildren: "" + $sessionStorage.userInfo.haschildren + "" || '0'
                };
                //生日,$scope.year为得到的年2016,$scope.yearDisplayIndex为options的index
                if ($sessionStorage.userInfo.birthday) {
                    $scope.year = $sessionStorage.userInfo.birthday.substr(0, 4);
                    $scope.yearDisplayIndex = {
                        "id": "" + new Date().getFullYear() - $scope.year + ""
                    };
                    $scope.month = $sessionStorage.userInfo.birthday.substr(5, 2);
                    $scope.monthDisplayIndex = {
                        "id": "" + parseInt($scope.month) - 1 + ""
                    };
                    $scope.day = $sessionStorage.userInfo.birthday.substr(8, 2);
                    $scope.dayDisplayIndex = {
                        "id": "" + parseInt($scope.day) - 1 + ""
                    };
                }
                else {
                    $scope.year = '';
                    $scope.yearDisplayIndex = {
                        "id": ""
                    };
                    $scope.month = '';
                    $scope.monthDisplayIndex = {
                        "id": ""
                    };
                    $scope.day = '';
                    $scope.dayDisplayIndex = {
                        "id": ""
                    };
                }

                /**
                 * 查询省份
                 * */
                //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
                // $scope.getCityIndexArr = ['0', '0'];
                //城市数据库->module('services.tools')
                //省份
                $scope.cBox = {
                    provinceArr: [],//省份数据
                    cityArr: [] //城市数据
                };

                // init
                getCityArray($sessionStorage.userInfo.countrycode).then(function (arr) {
                    $scope.cBox.provinceArr = arr;

                    $scope.province={
                        name: $sessionStorage.userInfo.provincecode
                    }

                    if(!!$sessionStorage.userInfo.provincecode){
                        getCityArray($sessionStorage.userInfo.provincecode).then(function (arr) {
                            $scope.cBox.cityArr=arr;
                            $scope.city={
                                name: $sessionStorage.userInfo.citycode
                            }
                        },function () {
                            $scope.city={name: ''};
                            $scope.cBox.cityArr=[];
                        });
                    }else{
                        $scope.city={name: ''};
                        $scope.cBox.cityArr=[];
                    }
                });

                $scope.provinceChange = function (value) {
                    $scope.params.provincecode = value;
                    $scope.params.citycode = '请选择';
                    getCityArray(value).then(function (data) {
                        $scope.cBox.cityArr=data;
                    },function () {
                        $scope.cBox.cityArr=[];
                        $scope.city={name: ''};
                    })
                };
                $scope.cityChange = function (value) {
                    $scope.params.citycode = value;
                };

                /**
                 * 中国->返回省份
                 * 河南->返回市县
                 * */
                function getCityArray(value) {
                    let defer = $q.defer();
                    if (value !== '中国') {
                        value = '中国_' + value;
                    }
                    $getCode({
                        "keyname": value
                    }).then(function (data) {
                        let arr = [];
                        for (let item of data) {

                            arr.push({
                                key:item.keyvalue,
                                value:item.keyvalue,
                            })
                        }
                        defer.resolve(arr)
                    },function (err) {
                        defer.reject(err)
                    });
                    return defer.promise;
                }

                /**
                 * 录入生日-年-月-日,000-00-00
                 * */
                var date = {
                    // 初始化年,因为是生日,故从今天向后70年;
                    // 返回年的数组
                    getYearArr: function () {
                        var yearArr = [];
                        var year = new Date().getFullYear();
                        for (var i = 0; 70 > i; i++, year--) {
                            yearArr.push(year);
                        }
                        return yearArr;
                    },
                    // 初始化月,一共12个月
                    // 返回月的数组
                    getMonthArr: function () {
                        var monthArr = [];
                        for (var i = 0; 12 > i; i++) {
                            monthArr.push(i + 1);
                        }
                        return monthArr;
                    },
                    // 日的数组
                    getDayArr: function (year, month) {
                        var _month = parseInt(month);
                        var _year = parseInt(year);
                        var dayArr = [];
                        var lastDay;
                        var monthOf31Days = [1, 3, 5, 7, 8, 10, 12];
                        var monthOf30Days = [4, 6, 9, 11];
                        // 如果是闰年,则2月相应调整
                        if (_month == 2 && (0 == _year % 4 && (_year % 100 != 0 || _year % 400 == 0))) {
                            lastDay = 29;
                        } else {
                            lastDay = 28;
                        }
                        if (monthOf31Days.indexOf(_month) != -1) {
                            lastDay = 31;
                        } else if (monthOf30Days.indexOf(_month) != -1) {
                            lastDay = 30;
                        }
                        for (var i = 0; lastDay > i; i++) {
                            dayArr.push(i + 1);
                        }
                        return dayArr;
                    },
                    //更新生日
                    //$scope.year,$scope.month,$scope.day,有值才更新
                    //格式 0000-00-00
                    getBirthday: function () {
                        if ($scope.year && $scope.month && $scope.day) {
                            var month = $scope.month;
                            if (parseInt(month) < 10) {
                                month = "0" + parseInt(month);
                            }
                            var day = $scope.day;
                            if (parseInt(day) < 10) {
                                day = "0" + parseInt(day);
                            }
                            return $scope.year + "-" + month + "-" + day;
                        } else {
                            $log.debug('生日未保存:' + $scope.year + $scope.month + $scope.day)
                            return "";
                        }
                    }
                }
                $scope.yearArr = date.getYearArr();
                $scope.yearChange = function (index) {
                    $scope.year = new Date().getFullYear() - index;
                    // console.log($scope.year);
                };
                $scope.monthArr = date.getMonthArr();
                $scope.monthChange = function (index) {
                    $scope.month = parseInt(index) + 1;
                    $scope.dayArr = date.getDayArr($scope.year, $scope.month);
                    // console.log($scope.month);
                };
                $scope.dayArr = date.getDayArr($scope.year, $scope.month);
                $scope.dayChange = function (index) {
                    $scope.day = parseInt(index) + 1;
                    // console.log($scope.day);
                };
            });



            /**
             * 上传头像到服务器
             */
            $scope.uploadHeader = function (file) {
                var formdata = new FormData();
                formdata.append('upload', file);
                var url = API.imgDomainUrl + 'upload?type=2&filename=' + file.name + '&program_type=webapp';
                //loading
                $ionicLoading.show({
                    template: '正在上传请稍等...'
                });
                $http({
                    method: "POST",
                    url: url,
                    headers: {
                        'Content-Type': undefined,
                    },
                    transformRequest: angular.identity,
                    data: formdata
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.params.photo = data.uuid;
                    } else {
                        $ionicToast.show('上传出错,请稍后再试');
                        $log.error('上传资源服务器出错,返回码:' + data.code);
                    }
                }).error(function (response) {
                    $ionicToast.show('上传出错,请稍后再试');
                    $log.debug('上传出错:' + response);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            };

            /**
             * 保存用户更新信息
             * */
            $scope.saveUserInfo = function () {
                /**
                 * 为空判断
                 * */
                if (!verification.isMobile($scope.params.mobile)) {
                    $ionicToast.show('请填写正确的手机号码');
                    return;
                }
                if (!$scope.params.fullname) {
                    $ionicToast.show('请填写姓名');
                    return;
                }

                $ionicLoading.show();
                console.log( $scope.params)
                $updateUserInfo({
                    "customer": {
                        "customerid": $sessionStorage.userInfo.customerid,
                        "photo": $scope.params.photo || '',
                        "fullname": $scope.params.fullname,
                        "mobile": $scope.params.mobile,
                        "provincecode": $scope.params.provincecode || '',
                        "citycode": $scope.params.citycode || '',
                        "address": $scope.params.address || '',
                        "birthday": date.getBirthday(),
                        "haschildren": parseInt($scope.params.haschildren)
                    }
                }).then(function () {
                    $ionicToast.show("保存成功");
                    // $rootScope.photo =$scope.params.photo;

                }, function (errCode) {
                    $ionicToast.show("保存失败,请稍后再试");
                    $log.debug("保存失败,请稍后再试" + errCode);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }

        }]);
})();
