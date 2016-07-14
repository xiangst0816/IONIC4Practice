使用Gulp
===============

 
因为我gulp用的比较熟，而且很简单，真的！另外，我的项目很依赖gulp。app设计的文件夹是“app”，gulp生成的文件夹为“www”，开发过程中的临时文件放到tmp中，这样文件不重复，方便对目标清理，干爽。内文中我会附上我常用的插件，因为踩过坑，所以比较真切，希望对你有用。

### 常用gulp插件介绍

-  gulp-load-plugins gulp插件加载工具  
如果不再使用这个插件，则我们会在gulpfile.js的头部写很多 import引入语句，这个工具可以让我们省去写多余import的麻烦，直接在任务中使用，具体方法如下：

```
import gulpLoadPlugins from "gulp-load-plugins";
const $ = gulpLoadPlugins();

gulp.task('clean:dist', function () {
		return gulp.src(path.tmp, {read: false}).pipe($.clean({force: true}));
    }
});
```

其中，应用的插件名字叫gulp-clean,这样你就能找到规律了吧，其将gulp用$替换，但是对于非gulp打头的插件则不管用了。

-  gulp-autoprefixer css前缀补齐
-  gulp-sass scss编译
-  gulp-base64 图片编码为base64格式
-  gulp-name 重命名

```
gulp.task('loadingCss', function () {
    return gulp.src(`${path.src}/index/loading.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.base64({maxImageSize: 100 * 100 * 1024}))//100mb以内转化为base64
        .pipe($.autoprefixer({
            browsers: ['Android >=2.1', 'last 2 versions'],
            cascade: false
        }))
        .pipe($.rename('loading.css')).pipe(gulp.dest(`${path.src}/index`));
});
```

- gulp-inline-source html内引用的资源改成内联资源（用在index.html中合并loading等相关资源） ,js/css自动压缩


```
gulp.task('move:index', ['loadingCss'], function () {
   return gulp.src([`${path.src}/index.html`]).pipe($.inlineSource()).pipe($.base64({
        maxImageSize: 100 * 1024, // bytes
    })).pipe(gulp.dest(path.tmp));
});
```

- gulp-uglify js压缩合并
- gulp-imagemin img压缩
- gulp-htmlmin html压缩
- gulp-clean-css css压缩




- gulp-sequence 队列化任务。因为gulp的任务都是异步执行的，但是有些任务需要前置条件，这样方便管理。例如：

```
gulp.task('default', $.sequence(
    //清理dist目录
    'clean:dist',
    [
        //index准备
        'move:index',
        //移动tpl
        'move:tpl',
    ], [
        //移动根目录文件
        'move:basejs',
    ], [
        //移动准备必须的资源
        'move:lib',
        //css合并
        'pageCss',
        'ionicCss',
        //首次加载的js资源(service/routers/filters/utils/dierctives)
        'commonJS',
        //延迟加载部分
        'pageJS',
        'img:min'
    ]
));

```

- merge-stream 流合并，即在一个任务中处理多个流。

- gulp-babel es6转码
- gulp-md5-plus 资源打码防止缓存
- gulp-concat 将不同的js、css文件合并


```
gulp.task('commonJS', function () {
    return gulp.src(`${path.src}/common/**/*.js`).pipe($.concat('commonJS.js'))
        .pipe($.babel({presets: ['es2015']})).pipe($.md5Plus(10, `${path.dest}/index.html`)).pipe($.uglify()).pipe(gulp.dest(`${path.dest}/js`))
    }
});
```






