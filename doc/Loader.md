快速进入微信Loading页面
===============

## 需求场景： 

因为项目是使用ionic组件库及样式库的，首次加载会需要下载核心资源，故！需要一个loading页，给这些资源一个加载提示。有人说，恩，将loading的html放在index.html中不就行了吗？但是这样，页面会有很长时间的白屏，然后突然跳到loading，然后突然跳到主页。这个并没有达到我们的预期，因为浏览器在加载页内script中的资源时会阻塞页面的渲染。最佳的做法是将我们的资源使用一个资源加载器加载，首页index.html中只放加载器，这样，就愉快的看到loading示数不断到100%了。

具体详情见
[高性能JavaScript](https://github.com/xiangsongtao/FrontEndSummary/blob/master/%E9%AB%98%E6%80%A7%E8%83%BDJavaScript%E5%AE%9E%E8%B7%B5%E6%80%BB%E7%BB%93.md)
这本书！连接是我的总结。


## 模块描述

- 将js/css/png等资源进行懒加载
- 因为css不阻塞但是为了避免app在进入时样式短暂的错乱，最后决定还是将css列入加载队列。
- index.html中的资源压缩，图片全部转为base64编码，为了避免图片跳出体验不好（需要gulp支持，见gulp的使用）


## 实现$addTags模块：

方法可以加载js/css/图片等资源，具体参数说明下注释

```
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
```