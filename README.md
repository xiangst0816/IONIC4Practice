Ionic4Practice
===

这个项目使用IONIC1.x构建，适用于微信app+IOS+Android项目，该项目主要进行会员管理、活动展示、客服、地图、导航、店铺展示、积分礼品卡券等数据展示，故使用WebApp的方式构建能实现快速开发。到目前为止未引用IONIC之外的组件库，自身已完全够用，考虑到项目整体大小，能使用到jQuery的地方都使用原生js实现；需要组件的能自己写的不引入额外库。

关于显示效果及兼容性： IOS手机微信及APP显示效果极佳，能媲美原生应用；安卓微信则会有些卡顿，针对安卓我将进行降级处理，关闭动画及动效。一年内新出的安卓机能在微信中流程运行。

这篇博文是汇总篇，需要长篇介绍的部分将会在链接中继续，如果你遇到的开发问题能在我这里找到，请注意我实现的方法，而不是我怎么写的代码！因为问题解决思路大同小异，但是代码千变万化。

>题外话：记得在做这些模块的时候，是有些费劲，因为第一次做，而且没人指导，虽然有不会的语法技巧什么的可以问问，但是大多数时间都是自己在琢磨。现在项目的第一期已快完成，剩余的小bug都不事儿。而且第二期也轻车熟路不构成威胁，可以不用再加班了，吼吼！现在再回看自己做的这些，感觉好简单，会者不难难者不会！

## 项目启动

如果你熟悉gulp及npm的话你会知道项目怎么初始化启动的，因为该项目在你的电脑上运行配置等问题可能很多，不建议安装node包测试运行，如果有开发问题请向下阅读，或者根据项目结构找组件js文件，里面的注解我写的很详细！

> 另外，如果对项目不熟悉，请不要进行二次开发，因为使用场景比较特殊，而且还在不停的更新迭代！


## 项目结构

项目的目录结构兼顾了以下需求场景：

- 以页面场景对项目进行分割，实现多人协同开发，保证互不干扰
- 相同组件实现复用
- 配置约定为主
- 整体结构尽量简单，让不熟悉的人快速上手
- 使用gulp打包将相关资源整合到一起
- 期望在现有框架下，15天左右完成整体前端WebApp项目开发，其中项目总值100W+

**你所看的目录结构是重构第四次的结果，前几次惨不忍睹！**

```
|-app  				开发目录
|-----common  		开发目录
|-----css 
|-----img 
|-----index  		loading页面信息
|-----lib  			库文件
|-----page  		页面
|---------page1  	页面
|-------------*.html  	
|-------------*.js  	js
|-------------*.scss  	样式
|-----app.js  		app入口文件
|-----bridge.js  	桥接文件
|-----index.html  	主页
|-----config.js  	配置文件
|-doc  				帮助文档 
|-tmp  				开发模式下的临时目录 
|-www  				目标目录
```

page目录根据页面进行层级划分,将与当前页面相关的且独有的tpl、scss、controller、service、directive、filter等放在一起。

## MVC结构说明

**MVC结构如下：**

![vivo-Structure](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/vivo-structure.png "vivo-structure")


- 因为项目采用了token验证，故需要对$http进行一次封装
- $factory为数据层，通过api访问特定的接口返回特定的数据，$factory处理返回的信息，如果成功则返回数据(resolve(data))，如果不成功则返回错误状态(reject(errCode))。一般返回数据有两类：
	- 状态类，比如用户信息、积分状态、代码配置数值等，这些在$factory中**返回对象**；状态类信息随时间的变化可能非常小，这个会设置过期时间，在时间内则使用缓存数据。
	- list列表类，比如积分记录、卡券列表等，这些在$factory中**返回数组**，每次访问返回实时数据。

**$factory的设计如下：**

```
(function () {
    angular.module('smartac.page')
    /**
     * 获取code通用方法
     * */
        .factory("$getCode", ['AJAX', 'api', '$q','$log','$sessionStorage', function (AJAX, api, $q,$log,$sessionStorage) {
            return function (options,cache) {
                if (!angular.isObject(options)) {
                    options = {};
                }
                var defer = $q.defer();
                var params = {
                    "method": "search",
                    "keyname": ""
                };

                //数据合并
                angular.deepExtend(params, options);
                if(cache === 'cache' && !!$sessionStorage[params.keyname]){
                    $log.debug(`codeKeyName: ${params.keyname} 使用缓存数据!该字段缓存状态为: ${!!cache}`);
                    defer.resolve($sessionStorage[params.keyname]);
                    return defer.promise;
                }
                $log.debug(`codeKeyName: ${params.keyname} 使用数据库的数据! 该字段缓存状态为: ${!!cache}`);
                AJAX({
                    url: api.codeUrl,
                    method: "post",
                    data: params,
                    success: function (data) {
                        if (data.code == "9200" && data.content.codeList.length > 0) {
                            //标志执行成功
                            $log.debug("查询:"+params.keyname+",返回正确结果");
                            //如果缓存字段为true,则缓存到session中
                            if(cache === 'cache'){
                                $sessionStorage[params.keyname] = data.content.codeList;
                            }
                            defer.resolve(data.content.codeList);
                        } else {
                            var errText;
                            switch(parseInt(data.code)){
                                case 9001:
                                    errText = "系统间通信异常!";
                                    break;
                                default:
                                    errText = "系统错误!";
                                    break;
                            }
                            $log.debug("查询:"+params.keyname+",失败");
                            defer.reject(errText);
                        }
                    },
                    error: function (errText) {
                        $log.debug("查询:"+params.keyname+",失败");
                        defer.reject(errText);
                    }
                });
                return defer.promise;
            }
        }])
})();
```

**使用方法：**


```
$getCode({
    "keyname": "integralexchange4pk"
 }).then(function (data) {
       angular.forEach(data, function (value) {
           if (value.keyname == "integralexchange_3") {
                 $scope.parkingHour2money = parseFloat(value.keycode);
                 $log.debug(`每小时停车等效金额:${$scope.parkingHour2money}`);
           }
       });
     }, function (errText) {
        $ionicToast.show("获取积分抵扣信息失败," + errText)
})
```







## 功能说明
以下功能是我在开发过程中遇到的坑及总结，内容会不断更新，可以star一下，以便持续关注。


### [微信导航栏与APP导航栏同步](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/NavigateSync.md)

ionic使用的导航方式永远都是在新增历史记录,而浏览器原生的导航则是在历史记录中有前有后的跳转,因而会在用户操作的过
程出现不同步的现象,这里实现了"后退"和"返回首页"两个方法,方法挂载到mainCtrl根控制器的$rootScope下,这样的话在
别的controller中也可手动调用此方法。


### [鉴权模块](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/checkAuthorize.md)

这里主要是针对微信这块。当用户进入我们的app时,如果进入的页面和用户相关,业务要求用户先关注,关注之后才能浏览;如果涉及到会员卡相关,则需要用户注册填写手机号和密码。

模块设计不算难,如果没进入则进行登录操作，如果已登录则进行字段检查。

### [微信分享模块](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/setShareContent.md)

微信分享，一般是和获取微信config绑定到一起的，而且一旦获取就设置分享内容，因为无法预期用户何时点击了分享按钮，so，还是设置一个默认的分享比较好。我这里设置的默认分享配置在config中，内容是邀请用户注册，并进入后跳转到注册页面。因为还要考虑到不同的设备环境（微信和app），具体看内文。

### bridge作为不同设备的中间层

这里说明下，因为公司使用的不是主要是调用同一个接口方法实现功能，具体的使用哪个方法由当时的设备环境判断。保证接口一致！

### [移动端最佳CSS实践(SCSS)](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/CSS4Mobile.md)

这里主要是为了兼容低端安卓微信浏览器而进行的阐述。因为这样的设备对新版flex布局不兼容，导致样式问题，但是他们对旧版的flex-box可行，故需要对flex加前缀的同时，引入另一套旧flex布局。我们一般的思路是使用autoprefixer做，但是有坑！具体见内文。

### [快速进入微信Loading页面](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/Loader.md)

因为项目是使用ionic组件库及样式库的，首次加载会需要下载核心资源，故！需要一个loading页，给这些资源一个加载提示。有人说，恩，将loading的html放在index.html中不就行了吗？但是这样，页面会有很长时间的白屏，然后突然跳到loading，然后突然跳到主页。这个并没有达到我们的预期，因为浏览器在加载页内script中的资源时会阻塞页面的渲染。最佳的做法是将我们的资源使用一个资源加载器加载，首页index.html中只放加载器、资源列表、loading图片（base64）及样式，首次加载总大小为50kb，2G模式下100ms进入loading页。这样，就跟快的看到loading示数不断到100%了。对于用户二次登录，则使用缓存数据。具体见内文。

### 微信端OcLazyLoad终极解决方案(使用懒函数)

### 关于数据缓存策略

这里不再展开，只在这里说说。我的项目是根据不同的设备环境做不同的处理。

- 微信：将所有信息存到sessionStorage中，因为微信用户每次进入都会有不同的code，其场景和session是一致的。当然factory或者service也可以做，但是我找不到足够的性能瓶颈让我这么去做。
- APP：用户ID存到Localstorage中，其余存到sessionStorage中。如果用户退出app，则先检查localstorage中是否有用户id（^.^!），如果有数据则自动登录；暂时还没遇到什么问题，先酱紫。



### 是否使用requirejs？

当然不使用,因为angular就能自己管理模块。再加上ocLoazload和Gulp的打包,requirejs在项目中已无存在的意义。如果nb，用webpack吧。

### [建议使用Gulp](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/useGulp.md)

因为我gulp用的比较熟，而且很简单，真的！另外，我的项目很依赖gulp。app设计的文件夹是“app”，gulp生成的文件夹为“www”，开发过程中的临时文件放到tmp中，这样文件不重复，方便对目标清理，干爽。内文中我会附上我常用的插件，因为踩过坑，所以比较真切，希望对你有用，当前时间2016/5/31，如果超过3个月，不保证以上内容可用。链接内我介绍下我使用到的gulp工具。

### [关于页面进入自动跳转(适用于分享特定页面)](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/directiveTo.md)
这部分用于微信公众号内微官网的部分，因为在微信公众号下部的导航栏可以跳转到webapp的不同部分，方便快速进入的作用（用户中心、积分查询、优惠券列表），但是如果直接进入有些很强势，打破了既有规则。既然是规则，那就维护一套比较好，遵守规则！

我现在的规则，是将所有中途进入的页面的首页必须是Home，之后再此基础上跳转。恩，规则！就这么定了！进入的时候会在url中配置参数，根据参数判断是否鉴权、跳转目的地、携带参数等信息。

### 异步代码的循环输出

主要是遇到了本不该前端去做的工作：兑换多张卡券的情景，现有的接口只能兑换一张，不支持多张兑换，因为后台没人写，这个只能前端异步循环请求兑换！晕死。

根据异步代码对后续循环产生的影响的不同,在这里分为两种情况：

1. 对后续代码无影响,比如打印输出,结果只有一种,使用闭包即可;
2. 循环请求数据,如果成功继续请求,如果失败则stop,并返回错误结果。这种情况使用迭代方法。

具体实现见内文。

### [在IOS下,如何将webapp打造成和Native App一样的体验?](https://github.com/xiangsongtao/IONIC4Practice/blob/master/doc/lookLikeNativeApp.md)

只是对meta标签进行的加工，参照内文的代码即可，或者网上找找，这部分很简单。

```
<link rel="apple-touch-icon-precomposed" href="img/vivoCity.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">

```

>方便在手机上调试app模式，嘿！


