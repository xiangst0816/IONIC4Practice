将WebApp打造成NativeApp的体验模式
===============

## 需求场景： 

这里主要是正对针对IOS平台,将WebApp添加到手机桌面的流程如下:  

1. 获得WebApp的访问地址;
2. 用Safari打开连接;
3. 选择下方中间的【导出】->【添加到主屏幕】即可;


以上全部的操作都是对meta进行添加修改,具体如下:


## 参数描述： 

- 在meta中取消电话邮箱的识别。

```
<meta name="format-detection" content="telephone=no email=no" />
```

- 去掉导航栏和菜单栏并全屏显示

```
<meta name="apple-mobile-web-app-capable" content="yes">
``` 

- 设置最上部状态栏,系统顶栏的颜色(白色、黑色)：

```
<meta name="apple-mobile-web-app-status-bar-style" content="white">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

```
其中，content="black"代表顶部状态栏为黑色不透明且独占顶部位置

- 设置桌面图标(如果不设置，则图标会显示网页的截图)


```
<link rel="apple-touch-icon" href="vivoCity.png">
```

但是，iOS会自作多情的给这个图标加上高光，如果想图标不被高光，可以这样：
```
<link rel="apple-touch-icon-precomposed" href="vivoCity.png">
```
如果想给不同的设备匹配不同的icon，可以加上size属性：

```
<link rel="apple-touch-icon" size="72x72" href="icon-ipad.png" />
<link rel="apple-touch-icon" size="114x114" href="icon-iphone4.png" />
```

- 设置启动画面

程序启动的过程中，需要指定启动画面，否则，白屏或者截图是让人很不愉悦的。

iOS有ipad和iPhone/ipod touch之分。  
ipad的启动画面是横竖屏分开的，画面的尺寸必须是1024*768、768*1024。  
iPhone和ipod touch虽然都是竖屏的，但是却有Retina屏幕和非Retina屏幕之分；另外它们启动画面的尺寸并不是屏幕的大小，而是(屏幕宽度)*(屏幕高度-20)。也就是说，非Retina的尺寸为320*460，Retina屏幕的尺寸为640*920。  
引入启动画面是支持媒体查询的。  
因此，可以通过media query给ipad的横竖屏引入不同的图：  

```
<link rel="apple-touch-start-image" href="landScape.png" madia="screen and (min-device-width:481px) and (max-device-width:1024px) and (orientation:landscape)" />
<link rel="apple-touch-start-image" href="portait.png" madia="screen and (min-device-width:481px) and (max-device-width:1024px) and (orientation:portait)" />

```





- 强制竖屏代码


```
	<!-- uc强制竖屏 -->
	<!-- uc强制竖屏 -->
	<meta name="screen-orientation" content="portrait">
	<!-- QQ强制竖屏 -->
	<meta name="x5-orientation" content="portrait">
	<!-- UC强制全屏 -->
	<meta name="full-screen" content="yes">
	<!-- QQ强制全屏 -->
	<meta name="x5-fullscreen" content="true">
	<!-- UC应用模式 -->
	<meta name="browsermode" content="application">
	<!-- QQ应用模式 -->
	<meta name="x5-page-mode" content="app">
```



