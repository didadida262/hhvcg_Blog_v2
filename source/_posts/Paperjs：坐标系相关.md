---
title: Paperjs：坐标系相关
date: 2023-09-22 15:43:18
category: Paperjs专栏
---

### 本文将详细介绍paperjs坐标相关的点

在paperjs的坐标体系中，默认方向为`右正下正`，没记错的话，应该是同opencv一致。我们通常见到的`右正上正`的坐标系，是标准的`笛卡尔坐标系`。这是一点区别。
那么如果现在我们要做一件事情，**就是将paperjs的坐标系转换成标准笛卡尔坐标系，该如何实现呢？即使实现，对那些事件点击的操作有什么影响呢**

#### 首先我们老样子初始化那一套，然后把标准的缩放拖拽操作`随意`的加上，同时`随意`的加上图片、文本等：
<img src="/img/paperjs坐标1.png" alt="">

图片、文本和矩形框位置信息如下：
```javascript
    showImg(new paper.Point(-200, -200), '@/assets/Sam.webp')
    showText(new paper.Point(200, -200), '测试')
    showRect(new paper.Point(-200, 200))
```
从坐标数据结合实际效果看出，这确实是标准的`右正下正`结构。

### 在上面的基础之上，我们借助matrix，将坐标系变更为标准的笛卡尔坐标系。
`关键代码`:
```javascript
    this.project.view.matrix = new paper.Matrix().scale(1, -1)
```
结果如下：
<img src="/img/paperjs坐标2.png" alt="">

**前后对比，发现了啥？**坐标系翻转后，坐标确实变成了标准笛卡尔坐标系，右正上正但是，发现了新的问题：
- project视图的zoom没了，直接导致缩放挂掉
- 图片文字这样的内容，被镜像翻转

#### zoom为0怎么处理？
查看view发现如下：
<img src="/img/paperjs坐标3.png" alt="">
确实应用matrix后zoom变成了0，且始终为0。所以，缩放的逻辑就不能再用zoom。那改用谁呢？还是`Matrix`

```javascript
export const setProjectZoom = (pro, zoom) => {
  const currentZoom = pro.view.matrix.a
  const matrix1 = new paper.Matrix().scale(1 / currentZoom, 1 / currentZoom)
  const matrix2 = new paper.Matrix().scale(zoom, zoom)
  pro.view.transform(matrix1)
  pro.view.transform(matrix2)
}
```
**先复位，后赋值期望的zoom**

#### 文本图片内容发生了镜像变化，如何处理？
- 针对文本。
```javascript
export const modifyDirection = (path: any) => {
  path.rotate(180)
  path.scaling = new paper.Point(-1, 1)
}
```

- 针对图片。
图片跟文本一样，完全y方向上倒了过来，处理思路是一致的，所以直接复用原来代码，发现了坑。`图片变得巨大`

我们加载图片的代码如下：
```javascript
export const showImg = (point: paper.Point, Img: string) => {
  const container = new paper.Path.Rectangle({
    position: point,
    size: new paper.Size(200, 400)
  })
  const raster = new paper.Raster({
    source: require('@/assets/Sam.webp')
  })
  raster.onLoad = () => {
    raster.fitBounds(container.bounds, false)
    // modifyDirectionPic(raster)
  }
}


```
注意上面代码中的`fitBounds`函数。我们已经让其fitBound了一个容器，所以此时raster的scale就不是默认的1了，那么这时你在`modifyDirection`中，将其`scaling`设置为1，可不就得是原来的大小了嘛。那么为了达到我们要的效果，应该设置为几呢？很简单，手动获取一下raster的scaling不就好了？
代码：
```javascript
// 纠正由于坐标系翻转导致文本的镜像效果
export const modifyDirectionPic = (raster: any) => {
  raster.rotate(180)
  const newScaling = new paper.Point(-raster.scaling.x, raster.scaling.y)
  raster.scaling = newScaling
}
```

最终效果：

<img src="/img/paperjs坐标4.png" alt="">


#### 插个坑-设备像素比
在用paperjs开发时，基本操作挂载设置中点。这个过程有个细节：`devicePixelRatio`.我们需要手动将这个值设置为1，否则就会出问题，这里只介绍为什么。devicePixelRatio决定了我们呢写的像素值，在屏幕上画出来的时候，到底是多大。通常情况下为1，但有些设备比如我的mac，他是2，也就是说，当我想要换一个半径10px的圆，实际要x2...


**文over**
