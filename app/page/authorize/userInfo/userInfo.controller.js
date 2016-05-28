/**
 * Created by xiangsongtao on 16/3/16.
 * 会员中心-个人信息 controller
 */
(function () {
    angular.module('smartac.page')
        .controller('memberInfoCtrl', ['$rootScope', '$scope', '$sessionStorage', 'api', '$http', 'verification', '$ionicLoading', 'AJAX', '$ionicToast', 'cityInfo','$updateUserInfo','$log','$ionicNavBarDelegate', function ($rootScope, $scope, $sessionStorage, api, $http, verification, $ionicLoading, AJAX, $ionicToast, cityInfo,$updateUserInfo,$log,$ionicNavBarDelegate) {

            /**
             * 完善个人信息显示返回按钮
             * */
            $ionicNavBarDelegate.showBackButton(true);
            /**
             * 从sessionstorage中读取数据,并填充到表单中
             * photo
             * api.imgDomainUrl + data.uuid
             * */

            $rootScope.photo =$sessionStorage.userInfo.photo;

            //基本信息
            $scope.params = {
                photo: $sessionStorage.userInfo.photo,
                photoToShow: api.imgDomainUrl + $sessionStorage.userInfo.photo,
                fullname: $sessionStorage.userInfo.fullname,
                mobile: $sessionStorage.userInfo.mobile,
                provincecode: $sessionStorage.userInfo.provincecode || '',
                citycode: $sessionStorage.userInfo.citycode || '',
                address: $sessionStorage.userInfo.address || '',
                haschildren: ""+$sessionStorage.userInfo.haschildren+"" || '0'
            };
            //生日,$scope.year为得到的年2016,$scope.yearDisplayIndex为options的index
            if($sessionStorage.userInfo.birthday){
                $scope.year = $sessionStorage.userInfo.birthday.substr(0,4);
                $scope.yearDisplayIndex = {
                    "id":"" + new Date().getFullYear() - $scope.year + ""
                };
                $scope.month = $sessionStorage.userInfo.birthday.substr(5,2);
                $scope.monthDisplayIndex = {
                    "id":"" + parseInt($scope.month)-1 + ""
                };
                $scope.day = $sessionStorage.userInfo.birthday.substr(8,2);
                $scope.dayDisplayIndex = {
                    "id":"" + parseInt($scope.day)-1 + ""
                };
            }
            else{
                $scope.year = '';
                $scope.yearDisplayIndex = {
                    "id":""
                };
                $scope.month = '';
                $scope.monthDisplayIndex = {
                    "id":""
                };
                $scope.day = '';
                $scope.dayDisplayIndex = {
                    "id":""
                };
            }


            /**
             * 查询省份
             * */
            //这个是索引数组，根据切换得出切换的索引就可以得到省份及城市
            $scope.getCityIndexArr = ['0', '0'];
            //城市数据库->module('services.tools')
            //省份
            $scope.cBox = {
                provinceArr: cityInfo.provinceArr,//省份数据
                cityArr: cityInfo.cityArr //城市数据
            };

            //1. 初始化
            //将省份字符串转换成index
            var provinceIndex = $scope.cBox.provinceArr.indexOf($sessionStorage.userInfo.provincecode);
            if (provinceIndex == -1) {
                provinceIndex = 0;
            }
            //初始化省份
            $scope.getCityIndexArr[0] = "" + provinceIndex + "";
            $scope.province = {
                "id": "" + provinceIndex + ""
            };
            //初始化市,如果省份为空,则市也为空
            if (provinceIndex == 0) {
                $scope.getCityArr = $scope.cBox.cityArr[0];
                $scope.getCityIndexArr[1] = "0";
                $scope.city = {
                    "id": "0"
                };
            } else {
                $scope.getCityArr = $scope.cBox.cityArr[provinceIndex];
                $scope.getCityIndexArr[1] = $scope.getCityArr.indexOf($sessionStorage.userInfo.citycode);
                $scope.city = {
                    "id": "" + $scope.getCityIndexArr[1] + ""
                };
            }
            //2. 城市库选择触发
            //改变省份触发的事件 [根据索引更改城市数据]
            $scope.provinceChange = function (index) {
                $scope.getCityArr = $scope.cBox.cityArr[index]; //根据索引写入城市数据
                $scope.getCityIndexArr[1] = '0'; //清除残留的数据
                $scope.getCityIndexArr[0] = index;
                //输出查看数据
                // console.log($scope.getCityIndexArr,
                //     $scope.cBox.provinceArr[$scope.getCityIndexArr[0]],
                //     $scope.cBox.cityArr[$scope.getCityIndexArr[0]][$scope.getCityIndexArr[1]]);
                //数据更新
                //选择省份后自动选择城市,此时保存省份和城市的信息
                $scope.params.provincecode = $scope.cBox.provinceArr[$scope.getCityIndexArr[0]];
                $scope.params.citycode = $scope.cBox.cityArr[$scope.getCityIndexArr[0]][$scope.getCityIndexArr[1]];
            }
            //改变城市触发的事件
            $scope.cityChange = function (index) {
                $scope.getCityIndexArr[1] = index;
                //输出查看数据
                // console.log($scope.getCityIndexArr,
                //     $scope.cBox.provinceArr[$scope.getCityIndexArr[0]],
                //     $scope.cBox.cityArr[$scope.getCityIndexArr[0]][$scope.getCityIndexArr[1]]);
                //数据更新
                $scope.params.citycode = $scope.cBox.cityArr[$scope.getCityIndexArr[0]][$scope.getCityIndexArr[1]];
            };


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
                getBirthday:function () {
                    if($scope.year && $scope.month && $scope.day){
                        var month = $scope.month;
                        if(parseInt(month) < 10){
                            month = "0" + parseInt(month);
                        }
                        var day = $scope.day;
                        if(parseInt(day) < 10){
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
                $scope.dayArr = date.getDayArr($scope.year,$scope.month);
                // console.log($scope.month);
            };
            $scope.dayArr = date.getDayArr($scope.year,$scope.month);
            $scope.dayChange = function (index) {
                $scope.day = parseInt(index) + 1;
                // console.log($scope.day);
            };


            /**
             * 上传头像到服务器
             */
            $scope.uploadHeader = function (file) {
                var formdata = new FormData();
                formdata.append('upload', file);
                var url = api.imgDomainUrl + 'upload?type=2&filename=' + file.name + '&program_type=webapp';
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
                $updateUserInfo({
                    "customer":{
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
                    $rootScope.photo =$scope.params.photo;

                },function (errCode) {
                    $ionicToast.show("保存失败,请稍后再试");
                    $log.debug("保存失败,请稍后再试"+ errCode);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }
        }]);
})();
