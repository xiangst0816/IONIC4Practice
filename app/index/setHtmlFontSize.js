/**
 * Created by xiangsongtao on 16/5/29.
 * 设置html的Root Font-Size
 */
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            var clientHeight = docEl.clientHeight;
            if (!clientWidth) return;
            var tmp;
            (clientWidth < clientHeight) ? (tmp = clientWidth) : (tmp = clientHeight);
            //
            if (tmp > 500) {
                tmp = 500;
            }
            //横屏时,高度为基准;竖屏时,宽度为基准
            docEl.dataset.width = tmp;
            docEl.dataset.percent = 100 * (tmp / 750);
            //由屏幕宽度得到basefont大小,并将其写入html标签中,文档总的尺寸由rem确定
            docEl.style.fontSize = 100 * (tmp / 750) + 'px';
            doc.getElementsByTagName('html')[0].removeAttribute('class');
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);