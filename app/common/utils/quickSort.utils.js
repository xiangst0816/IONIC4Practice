/**
 * Created by xiangsongtao on 16/4/20.
 */
(function () {
    angular.module('smartac.page')
    /**
     * 快速排序算法
     * 如果是对 对象array排序[{},{},{}]
     * params_1: 排序array
     * params_2: order(asc升序/默认,desc降序)
     * params_3: 排序字段key(只限一级)
     * return result
     *
     * 如果是对 简单array排序[1,1,1,1]
     * params_1: 排序array
     * params_2: order(asc升序/默认,desc降序)
     * */
        .factory("$quickSort",[function () {
            return function () {
                //params
                var arr = arguments[0];
                var order = arguments[1];
                var key = arguments[2];
                //isArray
                if(!angular.isArray(arr)){return arr;}
                //array length>1
                if (arr.length <= 1) { return arr; }

                var pivotIndex = Math.floor(arr.length / 2) ;
                var pivot = arr.splice(pivotIndex, 1)[0];
                var left = [];
                var right = [];

                //element is object
                if(angular.isObject(arr[0])){
                    //default
                    order || (order = 'asc');
                    if(order == 'asc'){
                        for (var i = 0; i < arr.length; i++) {
                            arr[i][key] < pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
                        }
                    }else if(order == 'desc'){
                        for (var i = 0; i < arr.length; i++) {
                            arr[i][key] > pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
                        }
                    }
                }else{
                    //default
                    order || (order = 'asc');
                    if(order == 'asc'){
                        for (var i = 0; i < arr.length; i++){
                            arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
                        }
                    }else if(order == 'desc'){
                        for (var i = 0; i < arr.length; i++){
                            arr[i] > pivot ? left.push(arr[i]) : right.push(arr[i]);
                        }
                    }
                }
                return arguments.callee(left,order,key).concat([pivot], arguments.callee(right,order,key));
            }
        }])

})();