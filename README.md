Ionic4Practice
=====================

这个Practice使用IONIC 1.x构建，适用于微信app+IOS+Android项目，该项目主要进行数据展示的功能，故使用WebApp
的方式构建完全够用。希望我在其中总结的方法对你有用！

## 项目初始化

一般拿到项目是没有node_modules目录的,这里需要安装node及npm,安装方法这里就不再赘述,

安装完后,进入该项目目录,输入

```bash
$ gulp default
```

稍等片刻,新鲜出炉的可运行的index.html就在www目录下,关于配置的问题,可参考gulpfiles.js


## 项目启动

方法1: 项目启动使用的IONIC Lab软件, 使用前需要配置文件路径，完成后选择当前项目然后选择server即可启动项目。    

方法2: 在www/index.html上右键选择"run 'index.html'"即可。

## 功能说明
以下功能是我在开发过程中遇到的坑及总结，内容会不断更新，可以star一下，以便持续关注。


### 关于全局结构
思路：因为项目需要在微信环境下运行，如果将所有资源打包后丢给浏览器，会导致浏览器因为等待下载会长时间的白屏，所以
这里会需要使用依赖加载的模式，也就是当进入该页面的时候才加载改页面的资源。因此，按照页面模块功能划分资源位置会方
便管理！

```
|-app    
|---css                 
|------common       项目公共样式        
|------ionic        ionic样式     
|------pages        页面样式  
|------ionic.scss   ionic样式主文件        
|------style.css    页面样式主文件
|---filters         公共过滤器
|---directives      公共组件库
|---fonts           字体
|---img             图片
|---lib             Angualr外部资源文件
|---routers         公共路由层
|---service         公共服务层(数据层)
|---tpl             页面模块
|---utils           通用方法模块
|---app.js          主程序
|---bridge.js       桥接文件
|---config.js       配置文件
|---index.html      主index文件
|-hooks
|-platforms
|-plugins
|-readme            说明
|-resources
|-www               dist文件
```

其中tpl将根据页面进行层级划分,将与当前页面相关的HTML、controller、service、directive、filter等放在一起。

### 微信导航栏与APP导航栏同步

ionic使用的导航方式永远都是在新增历史记录,而浏览器原生的导航则是在历史记录中有前有后的跳转,因而会在用户操作的过
程出现不同步的现象,这里实现了"后退"和"返回首页"两个方法,方法挂载到mainCtrl根控制器的$rootScope下,这样的话在
别的controller中也可手动调用此方法。

```

```




### 鉴权模块

### 微信分享模块
策略：点击分享按钮才设置分享内容！

### bridge作为不同设备的中间层

### 移动端最佳CSS实践(SCSS)

### 快速进入微信Loading页面

### 微信端OcLazyLoad终极解决方案(使用懒函数)

### 关于数据缓存策略

### Service/Factory(数据层)构建策略


### 是否使用requirejs？

### 建议使用Gulp

### 关于页面进入自动跳转(适用于分享特定页面)

