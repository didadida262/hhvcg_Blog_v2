---
title: Threejs系列：补间动画
date: 2023-12-07 09:14:06
category: 前端三维系列
---

### 本文介绍threejs中的补间动画

#### 什么是补间动画？
物体从a位置移动到b位置，移动过程中的展现形式，就是`补间动画`。

**1. 导入tween库**

```javascript
// threejs自带了，无需安装
import * as TWEEN from 'three/examples/jsm/libs/tween.module'
```

```javascript
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(2,2,2),
  new THREE.MeshBasicMaterial({color: 'black'})
)
scene.add( cube1 );
const tween1 = new TWEEN.Tween(cube1.position)
tween1.to({ x: -10}, 3000)
tween1.easing(TWEEN.Easing.Bounce.InOut)
tween1.start()
const tween2 = new TWEEN.Tween(cube1.position)
tween2.to({ x: 0}, 3000)
tween2.easing(TWEEN.Easing.Bounce.InOut)
tween1.chain(tween2)
...
...
// raf中加上更新
    TWEEN.update()
```

`简单效果展示：`

<img src="/img/threejs_补间动画.gif" alt="图片描述">

当然，为了实现`补间动画`， 还有其他的库，例如`gsap`等




