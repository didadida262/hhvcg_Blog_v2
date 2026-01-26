---
title: Paperjs：view和tool事件注解
date: 2023-09-01 13:55:57
category: Paperjs系列
---

**在前面介绍点类的时候，我们有提到过，tool类的实例有鼠标的各种事件，view类的实例也有相关的一些方法。但是，似乎又有些不同。本文将尽可能详细介绍**

拿onMouseDown事件举例，我们分别绑定触发点击的函数事件，如下图所示：
<img src="/img/paperjs3_1.jpg" alt="parser">


从上图中我们能够嗅到一些信息，首先view的优先级高于tool的，且名称还是有点区别的，在view中叫做MouseEvent，而在tool中，叫做ToolEvent事件。其次，很明显，MouseEvent有的ToolEvent都有除了target，基本属于包含于的关系。下面，我们就一个个看这些属性，究竟能干嘛。

关于delta。在view的事件中delta为空，而在tool中是以一个各个属性值均为0的点实例，两者其实等价，那么这个属性是用来干嘛的？
对于tool中的delta，官方解释：
> The difference between the current position and the last position of the mouse when the event was fired. In case of the mouseup event, the difference to the mousedown position is returned.

简单讲，就是当前触发事件的点同上一次触发该事件的点的向量。即：
```javascript
delta = point.subtract(lastPoint)
```
那么为什么上图中显示delta为空？因为那是我们在页面加载后第一次触发的点。

<img src="/img/paperjs3_2.jpg" alt="parser">

上图的结果，部分验证了文档解释。原本我以为两者的delta只是表现形式不同，发现错了。文档解释只适用于view的事件，并不适用于tool，因为我们发现，tool中的delta，各项属性依旧为0.
<img src="/img/paperjs3_3.jpg" alt="parser">
...

