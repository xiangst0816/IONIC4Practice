/**
 * Created by xiangsongtao on 16/5/24.
 */


(function () {
    var core = ['js/core.js'];
    var resource = [
        './jweixin-1.0.0.js',
        './bridge.js',
        './app.js',
        "css/ionic.debug.css",
        "css/style.css",
        // "css/style1.css",
        "img/home/home_banner_1_hd.png",
        "img/home/home_banner_2_hd.png",
        "img/home/home_banner_3_hd.png",
        "img/home/home_banner_4_hd.png",
        "img/home/logo-bm.png",
        "img/home/bg-yellow.png",
        "img/home/bg-red.png",
        "img/home/bg-blue.png",
        "img/home/xuxian.png",
        "img/home/member-bg.png",
        "img/home/card.png",
        "img/home/default.png",
        "img/home/logo-vivocity.png",
        "img/home/white-bg.png"
    ];
    var rest = [
        './config.js',
        'js/commonJS.js',
        'js/pageJS.js',
        // 'js/pageJS.js1'
    ];
    var ngAppModule = 'smartac';

    //loading的DOM位置id
    var loadingPosition = document.getElementById("wx-loading-js");
    //percent位置的id
    var whereToNotice = document.getElementById("wave-js");
    var totalLoadedNum = core.length + resource.length + rest.length;
    var restNum = totalLoadedNum;
    var fontSize = parseFloat(document.documentElement.style.fontSize);
    var size = parseFloat(fontSize * 2.6);
    /**
     * 执行
     * */
    $addTags(core, function () {
        refresher();
    }, function () {
        $addTags(resource, function () {
            refresher();
        }, function () {
            $addTags(rest, function () {
                refresher();
            }, function () {
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [ngAppModule]);
                });
                setTimeout(function () {
                    loadingPosition.style.cssText = "opacity:0;";
                    setTimeout(function () {
                        loadingPosition.style.cssText += "z-index:0;display:none;";
                    }, 300);
                }, 1000);
            })
        });
    });

    /**
     * 刷新loading percent
     * */
    function refresher() {
        restNum--;
        var percent = Math.floor(((totalLoadedNum - restNum) / totalLoadedNum * 100));
        var top = size * percent / (-100);


        whereToNotice.style.cssText += 'transform: translateY(' + top + 'px);-webkit-transform: translateY(' + top + 'px);';
    }

    /**
     * @title: addTags动态加载js标签
     * @params:
     * tagUrl: js资源的数组
     * eachLoadedCB: 每个资源加载完毕的回调
     * allLoadedCB: 所有资源加载完毕的回调
     * */
    function $addTags(tagUrl, eachLoadedCB, allLoadedCB) {
        if (!(tagUrl instanceof Array)) {
            alert("first arguments must be array of urls");
            return false;
        }
        //tag插入位置
        var head = document.getElementsByTagName("head")[0];
        var totalResource = tagUrl.length;
        var restResource = totalResource;
        var downLoadPercent;
        for (var i = 0, len = tagUrl.length; len > i; i++) {
            //标签对象
            var _TagObjs;
            if (/.js$/.test(tagUrl[i])) {
                _TagObjs = document.createElement("script");
                _TagObjs.setAttribute('type', 'text/javascript');
                _TagObjs.setAttribute('src', tagUrl[i]);
                head.appendChild(_TagObjs);
            } else if (/.css$/.test(tagUrl[i])) {
                _TagObjs = document.createElement("link");
                _TagObjs.setAttribute('rel', "stylesheet");
                _TagObjs.setAttribute('type', "text/css");
                _TagObjs.setAttribute('href', tagUrl[i]);
                head.appendChild(_TagObjs);
            } else if (/.png$|.jpg$|.gif$/.test(tagUrl[i])) {
                _TagObjs = new Image();
                _TagObjs.src = tagUrl[i];
            }
            _TagObjs.onload = function () {
                restResource--;
                downLoadPercent = Math.round((totalResource - restResource) / totalResource * 100);
                !!eachLoadedCB && eachLoadedCB(totalResource, restResource, downLoadPercent);
                !!!restResource && allLoadedCB && allLoadedCB();
            };

        }
    }
})();