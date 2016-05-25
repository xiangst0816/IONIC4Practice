/**
 * Created by xiangsongtao on 16/5/24.
 */
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
        } else if(/.png$|.jpg$|.gif$/.test(tagUrl[i])){
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