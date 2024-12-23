---
title: Threejs系列：光线投射（捕获点击目标）
date: 2023-12-05 21:23:23
category: 前端三维系列
---

### 本文介绍threejs中的光线投射

我们都知道，threejs是一个三维场景，但是在前端页面中，三维的场景，是画在二维的canvas画布中的，那么问题来了，`在二维画布上的点击事件,需要到三维场景中获取点击目标`，如何实现？`光线投射`。

实现思路： 先要`归一化`，针对坐标系，将通过点击事件获取的坐标值，转换成`笛卡尔坐标系（右正上正）`的数值，且区间范围控制在[-1, 1]。然后通过`光线投射`，由转换后的坐标点及相机位置点，得到一条线，`这条线穿过的空间中的物体`，就是我们的点击目标。

**1. 归一化：坐标转换**
通过点击事件，获取当前画布的x、y。然后根据视图区域的宽高，归一化坐标数据到下图的坐标系中。

<img src="/img/threejs_光线1.png" alt="图片描述">

具体代码：
```javascript
let mouse = new THREE.Vector2()
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerWidth) * 2 - 1)
})
```
`y的正负需要注意一下。`



**2. 生成射线，捕获目标**
根据点击点信息及camera，生成射线，捕获目标。
```javascript
const raycater = new THREE.Raycaster()
  raycater.setFromCamera(mouse, camera)
  const targtes = raycater.intersectObjects([cube1, cube2, cube3])
  console.log('targtes', targtes)
```
<img src="/img/threejs_光线2.png" alt="图片描述">

**3. 测试效果**

<img src="/img/threejs_光线3.gif" alt="图片描述">





完整代码如下：
```javascript
let mouse = new THREE.Vector2()
const raycater = new THREE.Raycaster()
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerWidth) * 2 - 1)
  console.log('mouse>>', mouse)
  raycater.setFromCamera(mouse, camera)
  const targtes = raycater.intersectObjects([cube1, cube2, cube3])
  console.log('targtes', targtes)
  if (!targtes.length) return
  const t = targtes[0]
  if (t.object.setColor) {
    t.object.material.color.set(t.object._origincolor)
    targtes[0].object.setColor = false
  } else {
    t.object._origincolor = t.object.material.color.getHex()
    t.object.setColor = true
    t.object.material.color.set('orange')
  }
})

```


