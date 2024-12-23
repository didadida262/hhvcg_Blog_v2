---
title: Down视频资源时的偶然发现
category: 网络杂谈
date: 2023-08-03 10:28:44
tags:
---

鄙人关于互联网上的资源，向来的主张都是：`但凡挂到了网上的资源，都应该免费共享。`这也是伯纳斯李那些前辈们的初衷。但是目下很多站点尤其视频站点以版权为由，在制造各种障碍阻挠我们去获取到。我觉得吧，版权固然要保护，对于那些利用有版权的东西获利的人必须严厉打击但是，向我们这种纯粹想down下来收藏的人，是不是太过不友好？

关于视频资源的处理，各有千秋。有直接暴露src的，也有通过blob伪加密的，也有片段加载的，总体来讲，手段低劣，都不用自己去写工具，稍微懂点搜索常识的小白，也可以很容易的找到对应的工具达到目的。比如`b站的you-get，油管的seg`等。

最近碰到个手段风骚的站点。起因出于自己想借重温一遍《Big Bang》听力，但是翻了半天几乎没有可用的，即使可用但是字幕糟糕。索性就找了个在线的站点。看着看着老毛病又犯了，**这么好的资源down下来岂不美哉？**

**但是，当我打开控制台懵逼了。**
- 快捷键打开控制台：弹框“你知道的太多了”,直接无法打开...
<img src="/img/你知道的太多了.jpg" alt="图片描述" width="500">

- 页面一直死循环debugger!!!。
<img src="/img/debugger.png" alt="图片描述" width="800">

手段真骚。仔细看下代码（图片有点模糊）：

```javascript
<script type="text/javascript">
    document.onkeydown = function() {
        var e = window.event || arguments[0];
        if (e.keyCode == 123) {
            alert('你知道的太多了！');
            return false;
        }
        if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
            alert('你知道的太多了！');
            return false;
        }
        if ((e.ctrlKey) && (e.keyCode == 85)) {
            alert('你知道的太多了！');
            return false;
        }
        if ((e.ctrlKey) && (e.keyCode == 83)) {
            alert('你知道的太多了！');
            return false;
        }
    }
    ;
    var threshold = 160;
    window.setInterval(function() {
        if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
            function disableDebugger() {
                debugger ;
            }
            $(document).ready(function() {
                disableDebugger();
            });
        }
    }, 1e3);
</script>
```

**手法1：**
设置按键监听函数，纯按键操作连控制台都打不开，还给了个温馨的提示“你知道的太多了！”真是谢谢他全家。`这种方式很low，我大不了就不用快捷键打开，直接右击检查，完美攻破。`

**手法2：**
除了video标签直接暴露视频地址的方式，针对其他情况，我们一般的操作时勾选media资源刷新页面查看数据传输的方式，再根据具体方式具体处理。那么这骚操作骚就骚在那个dubugger。
页面设置了一个定时器，一直处于运行状态。作用执行disableDebugger函数，就是触发debugger。判断的条件很清晰，`当window.innerWidth 与window.outerWidth 的差值大于一定阈值的时候，这边设置的160，就会触发。pc我看了下貌似最小273。因此默认打开控制台就会debugger。`这一番骚操作，直接导致我们只要打开了控制台，直接进入debugger模式，等同于没打开。
**所以怎么破呢？**
很简单：**用第三方抓包工具暴力抓取。这是明摆着逼我们去用wireshark啊**