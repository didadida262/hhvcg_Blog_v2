---
title: CSS系列：基础内容
date: 2023-09-06 22:22:00
category: css专栏

---

1. **页面视图相关**
网页可见区域宽： document.body.clientWidth
网页可见区域高： document.body.clientHeight
网页可见区域宽： document.body.offsetWidth (包括边线的宽)
网页可见区域高： document.body.offsetHeight (包括边线的高)
网页正文全文宽： document.body.scrollWidth
网页正文全文高： document.body.scrollHeight
网页被卷去的高： document.body.scrollTop
网页被卷去的左： document.body.scrollLeft
网页正文部分上： window.screenTop
网页正文部分左： window.screenLeft
屏幕物理分辨率的高： window.screen.height
屏幕物理分辨率的宽： window.screen.width
屏幕可用工作区高度： window.screen.availHeight
屏幕可用工作区宽度： window.screen.availWidth
屏幕缩放因子：window.devicePixelRatio
屏幕逻辑分辨率：window.screen.width * window.devicePixelRatio (缩放因子与物理分辨率的乘积)

2. **rem和em。**
   rem是相对于根元素（html）的font-size属性进行设置的，如果body的font-size:16px;那么，在指定任何元素的px时，1rem就是16px；em和其类似，只不过，em是相对于其父元素的。一般的pc端默认font-size为16px。


3. **mixin**
这玩意类似于c语言中的宏，对，就是那个#define那玩意儿。
```css
    @mixin left($value: 10px) {
    　　　　float: left;
    　　　　margin-right: $value;
    　　}
      ...
      ...
    /* 上面的代码类似于我们事先声明了一个代码片段，可带可不带参数。 */
    /* 使用方式如下： */
    .div {
      @include left(100px)
    }
```

这种方式，将css这门语言，在某种程度上，变成了稍微正规点的代码语言。

4. **animation**
   自己曾经做过一个音乐播放器的组件，其中，当歌曲播放的时候，中间的大logo需要有一个旋转的效果，该功能，就用到了animation。
   ```css
       /* logo图标设置 */
    #logo {
      position: absolute;
      top: 10px;
      left: 140px;
      animation: App-logo-spin infinite 20s linear;
      animation-play-state: paused
    }
    @keyframes App-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
   ```
   我们只需要给img标签，绑定一个logo的样式。然后设置样式的animation属性即可。其中需要给出动画名称，通过@keyframes定义即可。在上面的代码中，我们给animation属性绑定了一个App-logo-spin名称的动画。那么这个动画具体做了啥呢？很简单清晰，从0度旋转到360度。根据animation中的设定可知，该动画是无限循环的，同时20s完成一个动画周期.
<img src="/img/css1_1.jpg" alt="">

5. **盒子模型**
   - 标准盒模型（默认）： content-box
   - 怪异模型： border-box
  box-sizing确定

**文毕。**