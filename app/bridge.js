/**
 * @class Internal
 * @description bridge.js内部使用的工具类
 * @brief
 *      内部使用工具类,对使用环境判断,wx or smartApp
 *      通过相同接口更具环境实现不同方法
 * @private
 */


/**
 * 当前设备环境参数
 * */
var Internal = {
    isIOS: false,
    isAndroid: false,
    isWinOS: false,
    isInApp: false,
    isInWeiXin: false,
    appVersion: "",
    osVersion: "",

    /**
     * @brief 判断版本大小
     * @description 判断当前版本号是否大于传入的版本号
     * @param {String} verStr 版本号
     */
    isAppVersionGreatThan: function (verStr) {
        if ((typeof verStr == "string") && (verStr.length > 0)) {
            var inVer = parseFloat(verStr);
            var nowVer = parseFloat(Internal.appVersion);
            if (isNaN(nowVer) || nowVer - inVer >= 0) {
                return true;
            }
        }
        return false;
    }
};

/**
 * JSsdk(微信和smartApp通用接口api)
 */
var nativePlugin = {

    // 1. 判断当前版本是否支持指定 JS 接口
    getAppVersion: function () {
        if (Internal.isInWeiXin) {
        } else if (Internal.isInApp && !!smartApp) {
            alert("此功能需要检查,bridge.js")
            return Internal.appVersion;
        }
    },

    //选择图片
    chooseImage: function (successCB) {
        if (Internal.isInWeiXin) {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // alert('res')
                    // alert(JSON.stringify(res))
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    successCB && successCB(localIds);
                }
            });
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.selectImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    successCB && successCB(localIds);
                }
            });
        }
    },


    //预览图片
    previewImage: function (current, urls) {
        if (Internal.isInWeiXin) {
            wx.previewImage({
                current: current || '',  // 当前显示的图片链接
                urls: urls || []  // 需要预览的图片链接列表
            });
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.previewImage({
                current: current || '',
                urls: urls || []
            });
        }
    },


    // 2. 判断当前客户端版本是否支持指定JS接口
    checkJSAvailability: function (callback) {
        if (Internal.isInWeiXin) {
            wx.checkJsApi({
                jsApiList: ['chooseImage','onMenuShareTimeline','onMenuShareQZone','scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    alert(JSON.stringify(res));
                }
            })
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.checkJSAvailability({
                success: function (res) {
                    callback(res);
                    //alert(JSON.stringify(res));
                }
            })
        }
    },

    // 3. 调起扫一扫接口
    scanQRCode: function (callback) {
        if (Internal.isInWeiXin) {
            wx.scanQRCode({
                needResult: 1, // 扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    // alert(JSON.stringify(res));
                    // alert((res.resultStr.toString()));
                    callback && callback(res.resultStr.toString());
                }
            });
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.scanBarCode({
                scanType: ['qrCode'],
                success: function (res) {
                    // alert(JSON.stringify(res));
                    // alert((res.result.toString()));
                    callback && callback(res.result.toString());
                }
            });
        }
    },

    scanBARCode: function (callback) {
        if (Internal.isInWeiXin) {
            wx.scanQRCode({
                needResult: 1, // 扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    // alert(JSON.stringify(res));
                    var barCode = res.resultStr.toString().split(',')[1];
                    // alert(barCode);
                    callback && callback(barCode);
                }
            });
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.scanBarCode({
                scanType: ['barCode'],
                success: function (res) {
                    // alert(JSON.stringify(res));
                    // alert((res.result.toString()));
                    callback && callback(res.result.toString());
                }
            });
        }
    },








    // scanBarCode: function (callback) {
    //     if (Internal.isInWeiXin) {
    //         wx.scanQRCode({
    //             needResult: 1, // 扫描结果由微信处理，1则直接返回扫描结果，
    //             scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //             success: function (res) {
    //                 //alert(JSON.stringify(res));
    //                 callback && callback(res);
    //             }
    //         });
    //     } else if (Internal.isInApp) {
    //         smartApp.scanBarCode({
    //             scanType: ['qrCode', 'barCode'],
    //             success: function (res) {
    //                 //alert(JSON.stringify(res));
    //                 callback && callback(res);
    //             }
    //         });
    //     }
    // },


    // 4. 打印接口
    print: function (obj) {
        if (Internal.isInWeiXin) {
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.print(JSON.stringify(obj));
        }
    },


    //5. 打开数字键盘
    showKeyboard: function (callback) {
        if (Internal.isInWeiXin) {
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.showKeyboard(callback)
        }
    },


    //6. 蓝牙配置API
    configBluetooth: function () {
        if (Internal.isInWeiXin) {
        } else if (Internal.isInApp && !!smartApp) {
            smartApp.configBluetooth();
        }
    },


    /**
     * 分享
     * @params shareContent定义:
     * {
                title: "", // 分享标题
                desc: "", // 分享描述
                link: "", // 分享链接
                imgUrl: "", // 分享图标
                type: shareContent.type, // 分享类型,music、video或link，不填默认为link
                dataUrl: shareContent.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            }
     * */
    // 分享到朋友圈
    onMenuShareTimeline: function (shareContent) {
        if (Internal.isInWeiXin) {
            wx.onMenuShareTimeline({
                title: shareContent.title, // 分享标题
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            });
        }
    },

    // 分享给朋友
    onMenuShareAppMessage: function (shareContent) {
        if (Internal.isInWeiXin) {
            wx.onMenuShareAppMessage({
                title: shareContent.title, // 分享标题
                desc: shareContent.desc, // 分享描述
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                type: shareContent.type, // 分享类型,music、video或link，不填默认为link
                dataUrl: shareContent.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            })
        }
    },

    // 分享到QQ
    onMenuShareQQ: function (shareContent) {
        if (Internal.isInWeiXin) {
            wx.onMenuShareQQ({
                title: shareContent.title, // 分享标题
                desc: shareContent.desc, // 分享描述
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            });
        }
    },

    //分享到腾讯微博
    onMenuShareWeibo: function (shareContent) {
        if (Internal.isInWeiXin) {
            wx.onMenuShareWeibo({
                title: shareContent.title, // 分享标题
                desc: shareContent.desc, // 分享描述
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            });
        }
    },

    //分享到QQ空间
    onMenuShareQZone: function (shareContent) {
        if (Internal.isInWeiXin) {
            wx.onMenuShareQZone({
                title: shareContent.title, // 分享标题
                desc: shareContent.desc, // 分享描述
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            });
        }
    },

    //分享（app专用）
    shareWithPanel: function (shareContent) {
        if (Internal.isInApp && !!smartApp) {
            smartApp.shareWithPanel({
                platformList: shareContent.platformList,
                title: shareContent.title, // 分享标题
                desc: shareContent.desc, // 分享描述
                link: shareContent.link, // 分享链接
                imgUrl: shareContent.imgUrl, // 分享图标
                type: shareContent.type, // 分享类型,music、video或link，不填默认为link
                dataUrl: shareContent.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareContent.success && shareContent.success();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareContent.cancel && shareContent.cancel();
                }
            });
        } else {
            (function () {
                var _log = console.log;
                _log.call(console, '%c' + [].slice.call(arguments).join(' '), 'color: red;')
            })('smartApp链接的js当前不可用,请注意!!');
        }
    },

    //获取正在使用语言
    getLanguage: function (successCallback, errorCallback) {
        if (Internal.isInApp && !!smartApp) {
            //alert(smartApp.getLanguage)
            smartApp.getLanguage({
                success: function (res) {
                    successCallback && successCallback(res);
                },
                error: function () {
                    errorCallback && errorCallback();
                }
            })
        }
    },

    //设置正在使用语言(切换语言)
    setLanguage: function (param) {
        if (Internal.isInApp && !!smartApp) {
            smartApp.setLanguage(param)
        }
    },


    //注册登录时的传入的设备id(注册登录(deviceid)),自执行直接返回结果
    registerPushService: function (callback) {
        if (Internal.isInApp && !!smartApp) {
            try {
                smartApp.registerPushService({
                    success: function (res) {
                        //{"deviceToken":"123123123123"}
                        callback(res.deviceToken);
                    }
                })
            } catch (e) {
                callback(null);
            }
        }
    },


    //获取设备无线网络接口MAC地址,主要是mac地址(地图)
    wifiMac: function (callback) {
        if (Internal.isInApp && !!smartApp) {
            smartApp.wifiMac({
                success: function (res) {
                    //{"mac":"123123:112:3:433"}
                    callback(res.mac);
                }
            })
        }
    },
    // //开启左滑回到上个页面功能
    // enableBackGesture: function () {
    //     if (Internal.isInApp) {
    //         smartApp.enableBackGesture();
    //     }
    // }
};


/**
 * @brief 初始化当前环境
 * @description  判断当前H5页面是否是在微信还是smartApp中
 * @since v7.0
 * @method appInit
 * @return bool, true代表在app环境，false表示不在app环境
 */
~(function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { //在微信环境中
        Internal.isInWeiXin = true;
        // Internal.isInApp = false;
    } else if (ua.match(/smartapp/i) == 'smartapp') {     //在smartApp环境中（注：未提供ua判端）
        Internal.isInApp = true;
        // Internal.isInWeiXin = false;

    } else {
        (function () {
            var _log = console.log;
            _log.call(console, '%c' + [].slice.call(arguments).join(' '), 'color: red;')
        })('非法操作 \n当前环境不支持 \n请在微信中或smartApp中使用');
        Internal.isInApp = true;
        Internal.isInDesktop = true;
    }

    // console.log('当前环境:')
    // console.log(Internal)
    // console.log(window.navigator.userAgent)
    var u = window.navigator.userAgent;
    Internal.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    Internal.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //配置app

    // nativePlugin.checkJSAvailability();

    /**
     * 代码容错,进入判断是否有smartAPP变量
     * */
    if (Internal.isInApp && Internal.isIOS) {
        try {
            if (!!smartApp && smartApp.availability()) {
                appInit()
            }
        } catch (e) {
            (function () {
                var _log = console.log;
                _log.call(console, '%c' + [].slice.call(arguments).join(' '), 'color: yellow;')
            })('smartApp当前不可用,请检查使用环境!');
            smartApp = null;
            document.addEventListener("SmartAppReady", function () {
                appInit();
            })
        }
    }else if(Internal.isInApp && Internal.isAndroid){
        appInit();
    }

    function appInit() {
        //滑动返回
        smartApp.enableBackGesture();
        //隐藏导航栏
        // alert("setBarHidden")
        smartApp.setBarHidden({
            hidden: true
        });
    }

})();



