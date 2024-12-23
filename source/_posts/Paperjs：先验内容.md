---
title: Paperjs：先验内容
date: 2023-08-24 10:57:25
category: Paperjs专栏
---

### 本文主要介绍一些paperjs的先验知识（当然英文可以的，你也可以选择直接阅读官方原版文档）。

#### 1. 关于paperjs中的图形(path)，官方定义如下：
> In Paper.js, paths are represented by a sequence of segments that are connected by curves. A segment consists of a point and two handles, defining the location and direction of the curves.

<img src="/img/paperjs2_1.jpg" alt="">

在paperjs中，paths（路径，或者说是图形），是由一系列曲线(curves)连接的段(segments)，组成的。每个段segment都有一个点和两端的handler组成---->handleIn和handleOut（注意，这三个东西代码层面，都是一个东西，vector）。上图中0，1，2三个segment构成了当前的这个波浪path。handler的作用，用于定义两边的位置及方向。实质就是俩向量，确定该段的始端和末端。为了方便理解，**可以直接先将segments理解为点，curve是连接各种segment的边。**至于两个handle，源码解释：
```javascript
        /**
     * The handle point relative to the anchor point of the segment that
     * describes the in tangent of the segment.
     */
    handleIn: Point

    /** 
     * The handle point relative to the anchor point of the segment that
     * describes the out tangent of the segment.
     */
    handleOut: Point
```
<img src="/img/paperjs2_2.webp" alt="">

就是说，segment段(点)，在paperjs中，是组成图形的基本单位。上图中我们可以像二四的图形一样，展示每个segment点的handlein和handleout，像下面这样：
```javascript
this.wave.segments[0].selected = true
```

同时自己目前还有个疑问，就是矩形这种对象，从源码角度看，明明就是一个类，但是很奇怪，直接new是可以拿到的，就是显示不出来。只有通过new一个path类下的图形类才会显示，示例代码如下：
```javascript
    console.log('测试paperJS')
    this.mypath = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(400, 200))
    this.mypath.fillColor = 'blue'
    console.log('this.mypath------------->', this.mypath)
```
针对上面的问题，官方的文档中貌似给出了解释。paperjs中，貌似是只有通过new paper.Path的方式，才会显示出来，如果你单独的创建一个比如说点或者矩形，是不会显示的，尽管此时通过控制台打印能够看到其信息。（可能底层做了些额外的挂载步骤？）实践还发现，raster可以不通过 path显示出来，同时，通过new paper.Shape也能画出圆形矩形和椭圆形。

**创建各式各样的图形**
```javascript
        var aCircle = new Path.Circle(new Point(75, 75), 60);
        aCircle.strokeColor = 'black';
           
        var aRectangle = new Path.Rectangle(new Point(200, 15), new Point(400, 135));
        aRectangle.strokeColor = 'orange';
           
        var bRectangle = new Path.Rectangle(new Point(80, 215), new Size(400, 135));
        bRectangle.strokeColor = 'blue';
           
        var myRectangle = new Rectangle(new Point(450, 30), new Point(720, 170));
        var cornerSize = new Size(10, 60);
        var cRectangle = new Path.RoundRectangle(myRectangle, cornerSize);
        cRectangle.fillColor = 'lightgreen';
           
        var aTriangle = new Path.RegularPolygon(new Point(120, 500), 3, 110);
        aTriangle.fillColor = '#FFDDBB';
        aTriangle.selected = true;
         
        var aDodecagon = new Path.RegularPolygon(new Point(460, 490), 12, 100);
        aDodecagon.fillColor = '#CCAAFC';
        aDodecagon.selected = true;
```

**paperjs中，各个图形的点信息补充介绍**
我们已经知道，对于path而言，所有点数据都是存储在segments中的，那么他们的顺序是什么呢。对于**矩形**来讲，**以左下角开始，顺时针方向记录**，共四个点。而对于**圆形**来讲，**以左边顶点开始，逆时针方向记录**，也是四个点。最基本的circle、reactangle等图形，他们都是Path，还有一种就是compundPath。两者的区别在于，前者的点数据都是存储在segment中，而对于后者，可以看成是多个前者的一个集合，其数据都在children中。这种设计，是合理的。


#### 2. 关于paperjs中的点point类介绍
注意，在paperjs中，有两种方法获取点信息，一种是用tool类实例的onMouseDown等方法获取点信息，另一种通过绑定project的view下面的各种鼠标方法获取，这两种方式返回的点信息还不尽相同。准确点讲，应该算是事件的相关信息不尽相同。下面我们就以官方文档为准，看看一个小小的点类实例，究竟藏了多少信息。

**下图是通过tool获得的一个示例，仅供参考：**
<img src="/img/paperjs2_3.jpg" alt="">

x,y是他的坐标信息，这就不说了。


- 首先关于**length、angle、angleInRadians、angleInDegrees**，一个point实例拥有length长度属性。后三个都是角度信息，除**angleInRadians**弧度，另外两个都可看成是我们常说的角度。
估计很多人已经懵了，点就是点嘛，哪来的什么长度。事实上，在paperjs的世界中，点就是向量,向量就是点。官方解释如下:
```javascript
    /** 
     * The length of the vector that is represented by this point's coordinates.
     * Each point can be interpreted as a vector that points from the origin (`x
     * = 0`, `y = 0`) to the point's location. Setting the length changes the
     * location but keeps the vector's angle.
     * 改变其长度，但能保持其角度
     */
```
看懂了吗？每一个点，都能看成是该位置到坐标原点（0，0）点的向量，因此，length当然就是该点到坐标原点的距离。为了更加的直观，我们来写个山寨版“见缝插针”。思路就是，每次鼠标点击时，我们就把该点到坐标原点的线画出来，代码及效果如下：
```javascript
    // 全视图的mousedown事件
    onMouseDown(e) {
      // console.log('点击坐标----->', e.point)
      this.x = new paper.Path.Line(e.point, new paper.Point(0,0))
      this.x.strokeColor = 'black'
    },
```
<img src="/img/paperjs2_4.webp" alt="">

- **关于quadrant**
这个其实就是象限，在paperjs的坐标体系中，以中心点为坐标原点来算，画面分成四块，以右下角开始顺时针方向，分别是1234共四个象限.

- **讲完了基础xy、角度、向量等，下面来讲讲另外几个很重要其他类型的点：lastPoint、middlePoint、point及delta。**
为了直观的看清楚他们到底置于何处，我们以完整触发点击、拖动到最后抬起的过程举例，在最后的onMouseUp事件中，画出各个点的位置信息，结果如下：
<img src="/img/paperjs2_5.jpg" alt="">

point就不必赘述了，就是当前鼠标抬起的点，从画面中出现的lastPoint和middlePoint点出现的位置来看，我们不难看出，lastPoint可以暴力的看成是donw点，而middlePoint则很显然是当前事件点point和down点的中点。
关于点类的组成，大概就是这样，很基础，但是点和各种事件的各个属性方法结合起来，才是paperjs的精华，我们慢慢讲。


#### 3. paperjs中的向量
关于向量的定义，官方解释如下：
> Vectors contain relative information. All a vector tells us is in which direction and how far to move.

白话讲就是，向量能帮助我们，将一个点以某个方向且以某个距离移动。这同我们所学过的几何数学中的概念一致。向量在代码层面看，也是一个点Point实例，硬要说区别的话，就是官方的定义，向量包含的是相对信息，她告诉你方向和距离。注意：在paperjs中，vector是妥妥的一等公民。因为他实在是太过重要。在后面的”小蝌蚪军团“开发中，这个东西，起着巨大的作用。
向量的直观表现形式如下图所示：
<img src="/img/paperjs2_6.webp" alt="">

#### 4. 关于tool套件

paperjs的toolapi也是相当强大，尤其针对要开发类似于标注平台的项目。该函数拥有鼠标点击、拖动、抬起等等一众好用的事件捕捉handler。具体详见官方文档，这里顺带提一下一开始令我无法理解的两个概念：maxDistance和minDistance。两者都是针对拖拽事件设定的。
拿最小距离minDistance举例，官方注解：
> The maximum distance the mouse has to drag before firing the onMouseDrag，event, since the last onMouseDrag event.

翻译一下：从上次触发drag事件开始，触发本次drag所需的最大距离。（最小同理)
这个东西，我一直很纳闷。为什么会存在两个距离？本次拖拽能否触发，我们只需要一个阈值不就好了？最大最小这两个概念，不是很奇怪？

#### 5. Raster
这东西说白了就是用来显示图片的。虽然用的很多，但是一直有个苦恼，就是这玩意的中文翻译到底是啥。这两天一段介绍电子游戏简史的youtube视频给了我答案。**raster和vector是一对儿，前者就是位图，后者就是矢量图。**两者的区别，我想接受过九年义务教育的同学立马顿悟。图像放大失真与否。
注释：需要关注一下raster的onLoad方法，有些譬如设置size这样的操作，需要在onLoad中做，也就是图片加载完成之后再做。
#### 6. fitBounds
其中第二个参数表示填充完整。两者都不会改变图片的宽高比例


**毕。**