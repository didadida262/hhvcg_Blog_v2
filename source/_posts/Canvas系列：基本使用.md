---
title: 'Canvas系列: 基本使用'
date: 2023-11-23 19:17:53
category: 前端游戏杂谈
---
### 本文记录一些基本的操作

#### 基本图形绘制
<img src="/img/canvas基本绘制.png" alt="图片描述">

具体代码：
```javascript
      c.beginPath()
      c.arc(300, 200, 100, 0, 2 * Math.PI)
      const g = c.createLinearGradient(0, 0, 600, 400)
      g.addColorStop(0, 'green')
      g.addColorStop(1, 'red')
      c.fillStyle = g
      c.fill()
      c.stroke()
      c.closePath()

      c.beginPath()
      c.arc(250, 150, 20, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.arc(350, 150, 20, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.ellipse(300, 200, 10, 30, 0, 0, 2 * Math.PI)
      c.stroke()
      c.closePath()

      c.beginPath()
      c.moveTo(250, 300)
      c.lineTo(350, 300)
      c.stroke()
      c.closePath()
```

2. 动画实现
**定时器版本**
<!-- 效果如下：
<img src="/img/canvas基本绘制.png" alt="图片描述"> -->

思路： 原图包含小人的走路姿势，用一个定时器，每次平移即可实现小人走动的动画效果，当然，注意时间。
```javascript
    const draw = () => {
      const img = new Image()
      img.src = require('./只狼.jpeg')
      img.onload = () => {
        let setup = 0
        setInterval(() => {
          c.clearRect(0, 0, WIDTH, HEIGHT)
          c.drawImage(img, 184 * setup, 0, 184, 325, 0, 0, 184, 325)
          setup++
          setup = setup % 8
        }, 10)
      }
    }
```

**raf**
详见坦克炮弹文档

3. 变换相关。
- `translate: 位移`，本质上是原点偏移
```javascript
    c.translate(200, 200)
```
- `rotate`
- `scale`
- `transform`: 变换矩阵
四个参数： 水平缩放、垂直倾斜、水平倾斜、垂直缩放、水平移动、垂直移动

4. save、restore
存储释放canvas的画笔配置


<!-- 3. 图片操作 -->
