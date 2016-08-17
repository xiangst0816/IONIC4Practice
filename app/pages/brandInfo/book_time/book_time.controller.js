// /**
//  * Created by xiangsongtao on 16/6/24.
//  * 店铺 预定
//  */
// (function () {
//     angular.module('smartac.page')
//         .controller('bookTimeCtrl', ['$scope', '$timeout', '$filter', '$toDateFormat', function ($scope, $timeout, $filter, $toDateFormat) {
//
//
//             // $scope.selected = {
//             //     month: new Date().getMonth(),
//             //     day: new Date().getDate()
//             // };
//
//             //选择日期 月 日
//             $scope.selected = {
//                 month: new Date('2016-6-27 5:00:00').getMonth(),
//                 day: new Date('2016-6-27 5:00:00').getDate()
//             };
//
//             //当前时间
//             let DATENOW = new Date('2016-6-27 1:1:1').getTime();
//
//             //显示时间规律
//             let timeDuringArr = [
//                 {
//                     timeFrom: new Date('2016-6-27 7:00:00').getTime(),//2016-6-27 7:00:00
//                     timeTo: new Date('2016-6-27 10:00:00').getTime(),//2016-6-27 10:00:00
//                 },
//                 {
//                     timeFrom: new Date('2016-6-27 12:00:00').getTime(),//2016-6-27 12:00:00
//                     timeTo: new Date('2016-6-27 13:00:00').getTime(),//2016-6-27 13:00:00
//                 },
//                 {
//                     timeFrom: new Date('2016-6-27 16:00:00').getTime(),//2016-6-27 16:00:00
//                     timeTo: new Date('2016-6-27 20:00:00').getTime(),//2016-6-27 20:00:00
//                 },
//                 {
//                     timeFrom: new Date('2016-6-27 22:00:00').getTime(),//2016-6-27 16:00:00
//                     timeTo: new Date('2016-6-27 24:00:00').getTime(),//2016-6-27 24:00:00
//                 }
//             ];
//
//
//             //可预订起始时间
//             const START = 7;
//             //可预订终止时间
//             const END = 24;
//             //间隔30min
//             const INTERVAL = 30;
//             //显示一排放5个
//             const RowCount = 5;
//             //总共计数
//             const COUNT = 2 * (24 - 7) + 1;//35
//
//
//             let dateArr = [];
//             let rowArr = [];
//             for (let i = 0, rowRecord = null; COUNT > i; i++) {
//                 //Math.floor(i/RowCount) 0,1,2,3,4,5,6
//                 //i%RowCount 每行的列计数 0,1,2,3,4
//                 let rowNow = Math.floor(i / RowCount);
//                 if (rowRecord !== rowNow) {
//                     if (rowRecord !== null) {
//                         dateArr.push(rowArr);
//                     }
//                     rowRecord = rowNow;
//                     rowArr = [];
//                     rowArr.push(timeBox(i));
//                     if (COUNT === i + 1) {
//                         dateArr.push(rowArr);
//                     }
//                 } else {
//                     rowArr.push(timeBox(i));
//                     if (COUNT === i + 1) {
//                         dateArr.push(rowArr);
//                     }
//                 }
//             }
//
//             $scope.dateArr = dateArr;
//
//
//             $scope.chooseThisTime = function (this_time, $event) {
//                 let $canUseAll = angular.element(document.querySelectorAll(".can_use"));
//                 $canUseAll.removeClass("active");
//                 angular.element($event.target).addClass("active");
//                 console.log("当前选择的时间是:" + new Date(this_time));
//             };
//
//             $scope.chooseThisDate = function ($event) {
//                 //chooseDate__dateBox-each
//                 let $chooseDateEach = angular.element(document.querySelectorAll(".chooseDate__dateBox-each"));
//                 $chooseDateEach.removeClass("active");
//                 angular.element($event.target).addClass("active");
//                 console.log("当前选择的日期是:" + new Date());
//             };
//
//
//             //传入时间信息生成时间戳
//             function calcDate2Timestamp(year, month, day, hours, minutes) {
//                 let time = new Date();
//                 time.setFullYear(year);//0000
//                 time.setMonth(month);//0-11
//                 time.setDate(day);//1-31
//                 time.setHours(hours);//0-24
//                 time.setMinutes(minutes);//0-59
//                 time.setSeconds(0);//0-59
//                 time.setMilliseconds(0);//0-59
//                 return time.getTime();
//             }
//
//
//             //传入当前的index->i,得到每个盒子的时间对象,及是否显示字段
//             function timeBox(i) {
//                 let year = new Date().getFullYear();
//                 let month = $scope.selected.month;
//                 let day = $scope.selected.day;
//                 let hours = parseInt(Math.floor(i / 2) + START);
//                 let minutes = parseInt((i % 2) * INTERVAL);
//                 let time_in_this_box = calcDate2Timestamp(year, month, day, hours, minutes);
//                 return {
//                     isActivated: isTimeActivated(time_in_this_box),
//                     this_time: time_in_this_box,
//                     hours: hours.toString(),
//                     minutes: (minutes === 0) ? "00" : minutes.toString()
//                 }
//             }
//
//
//             //判断盒子的时间是否在timeDuringArr数组指定的时间内
//             function isTimeActivated(time_in_this_box) {
//                 let isctivated = false;
//                 for (let timebox of timeDuringArr) {
//                     if (timebox.timeTo >= time_in_this_box && time_in_this_box >= timebox.timeFrom && DATENOW < time_in_this_box) {
//                         isctivated = true;
//                     }
//                 }
//                 return isctivated;
//             }
//         }]);
//
// })();