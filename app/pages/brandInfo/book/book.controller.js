/**
 * Created by xiangsongtao on 16/6/24.
 * 店铺 预定
 */
(function () {
    angular.module('smartac.page')
        .controller('bookCtrl', ['$scope', '$ionicModal', '$ionicToast', '$filter', '$toDateFormat', function ($scope, $ionicModal, $ionicToast, $filter, $toDateFormat) {


            $ionicModal.fromTemplateUrl('my-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });


            let chooseDate = '';
            $scope.chooseDate = '用餐时间';
            $scope.dateConfirm = function () {
                if (!chooseDate) {
                    $ionicToast.show("请选择预订时间!");
                    return false;
                }
                $scope.chooseDate = $filter("yyyyMd_HHmmss_cn")(chooseDate);
                $scope.modal.hide();
            };


            /////////////////////////////////////////////////
            // $scope.selected = {
            //     month: new Date().getMonth(),
            //     day: $toDateFormat().getDate()
            // };

            //选择日期 月 日,这个通过上部的日期选择进行设置,这里默认使用设定值
            $scope.selected = {
                month: $toDateFormat('2016.06.30 00:00:00').getMonth(),
                day: $toDateFormat('2016.06.30 00:00:00').getDate()
            };

            // alert($toDateFormat('2016/06/30 00:00:00'));
            // alert($toDateFormat('2016.06.30 00:00:00'));
            // alert($toDateFormat('2016-06-30 00:00:00'));
            // alert(JSON.stringify($scope.selected));

            //当前时间
            let DATENOW = $toDateFormat('2016.06.30 0:00:00').getTime();

            //显示时间规律
            let timeDuringArr = [
                {
                    timeFrom: $toDateFormat('2016.06.30 7:00:00').getTime(),//2016.06.30 7:00:00
                    timeTo: $toDateFormat('2016.06.30 10:00:00').getTime(),//2016.06.30 10:00:00
                },
                {
                    timeFrom: $toDateFormat('2016.06.30 12:00:00').getTime(),//2016.06.30 12:00:00
                    timeTo: $toDateFormat('2016.06.30 13:00:00').getTime(),//2016.06.30 13:00:00
                },
                {
                    timeFrom: $toDateFormat('2016.06.30 16:00:00').getTime(),//2016.06.30 16:00:00
                    timeTo: $toDateFormat('2016.06.30 20:00:00').getTime(),//2016.06.30 20:00:00
                },
                {
                    timeFrom: $toDateFormat('2016.06.30 22:00:00').getTime(),//2016.06.30 16:00:00
                    timeTo: $toDateFormat('2016.06.30 24:00:00').getTime(),//2016.06.30 24:00:00
                }
            ];


            //可预订起始时间
            const START = 7;
            //可预订终止时间
            const END = 24;
            //间隔30min
            const INTERVAL = 30;
            //显示一排放5个
            const RowCount = 5;
            //总共计数
            const COUNT = 2 * (END - START) + 1;//35


            let dateArr = [];
            let rowArr = [];
            for (let i = 0, rowRecord = null; COUNT > i; i++) {
                //Math.floor(i/RowCount) 0,1,2,3,4,5,6
                //i%RowCount 每行的列计数 0,1,2,3,4
                let rowNow = Math.floor(i / RowCount);
                if (rowRecord !== rowNow) {
                    if (rowRecord !== null) {
                        dateArr.push(rowArr);
                    }
                    rowRecord = rowNow;
                    rowArr = [];
                    // alert(JSON.stringify(timeBox(i)));
                    rowArr.push(timeBox(i));
                    if (COUNT === i + 1) {
                        dateArr.push(rowArr);
                    }
                } else {
                    rowArr.push(timeBox(i));
                    if (COUNT === i + 1) {
                        dateArr.push(rowArr);
                    }
                }
            }

            $scope.dateArr = dateArr;


            $scope.chooseThisDate = function ($event) {
                //chooseDate__dateBox-each
                let $chooseDateEach = angular.element(document.querySelectorAll(".chooseDate__dateBox-each"));
                $chooseDateEach.removeClass("active");
                angular.element($event.target).addClass("active");
                // console.log("当前选择的日期是:" + $toDateFormat());
            };

            $scope.chooseThisTime = function (this_time, $event) {
                let $canUseAll = angular.element(document.querySelectorAll(".can_use"));
                $canUseAll.removeClass("active");
                angular.element($event.target).addClass("active");
                chooseDate = $toDateFormat(this_time);
                // console.log("当前选择的时间是:" + $toDateFormat(this_time));
            };


            // let time = new Date();
            // time.setFullYear('2011');//0000
            // time.setMonth('0');//0-11
            // time.setDate(1);//1-31
            // time.setHours(1);//0-24
            // time.setMinutes(1);//0-59
            // time.setSeconds(0);//0-59
            // time.setMilliseconds(0);//0-59
            // // alert(time);

            //传入时间信息生成时间戳
            function calcDate2Timestamp(year, month, day, hours, minutes) {
                let time = new Date();
                time.setFullYear(year);//0000
                time.setMonth(month);//0-11
                time.setDate(day);//1-31
                time.setHours(hours);//0-24
                time.setMinutes(minutes);//0-59
                time.setSeconds(0);//0-59
                time.setMilliseconds(0);//0-59
                return time.getTime();
            }


            //传入当前的index->i,得到每个盒子的时间对象,及是否显示字段
            function timeBox(i) {
                let year = new Date().getFullYear();
                let month = $scope.selected.month;
                let day = $scope.selected.day;
                let hours = parseInt(Math.floor(i / 2) + START);
                let minutes = parseInt((i % 2) * INTERVAL);
                // alert(`${year}:${month}:${day}:${hours}:${minutes}`);
                let time_in_this_box = calcDate2Timestamp(year, month, day, hours, minutes);
                return {
                    isActivated: isTimeActivated(time_in_this_box),
                    this_time: time_in_this_box,
                    hours: hours.toString(),
                    minutes: (minutes === 0) ? "00" : minutes.toString()
                }
            }


            //判断盒子的时间是否在timeDuringArr数组指定的时间内
            function isTimeActivated(time_in_this_box) {
                let isActivated = false;
                // for (let i = 0, len = timeDuringArr.length; len > i; i++) {
                //     if (timeDuringArr[i].timeTo >= time_in_this_box && time_in_this_box >= timeDuringArr[i].timeFrom && DATENOW < time_in_this_box) {
                //         isActivated = true;
                //     }
                // }
                for (let timebox of timeDuringArr) {
                    if (timebox.timeTo >= time_in_this_box && time_in_this_box >= timebox.timeFrom && DATENOW < time_in_this_box) {
                        isActivated = true;
                    }
                }
                return isActivated;
            }

        }]);

})();