---
title: Threejs系列：第二回
date: 2023-11-16 09:49:12
category: 前端三维系列
---

### 本文继续探索threejs，简单介绍几个基础组件,及如何将第三方软件绘制的模型导入。

**1. 我们希望他能够跟随鼠标的方向进行转动，如何实现？**

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
...
...   
 // 设置轨道,实现鼠标拖动效果
    setOrbit() {
      this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
// 搭配阻尼，效果更佳
      this.orbit.enableDamping = true
    },
```

**2. 为了直观的研究坐标体系，我们就得先直观的看到。如何实现？代码如下：**

```javascript
    // 添加坐标轴
    setAxes() {
      this.axesHelper = new Three.AxesHelper(500)
      this.axesHelper.setColors('red','green','orange')
      this.scene.add(this.axesHelper)
    },
```
调用一下AxesHelper即可。效果图如下：
<img src="/img/threejs2_1.webp" alt="图片描述">

**3. 添加网格地面**
threejs官方提供了一个现成的网格地面，我们可以直接拿来用.

```javascript
// grid
const gridHelper = new THREE.GridHelper(50,50)
scene.add(gridHelper)
```

<img src="/img/threejs2_2.gif" alt="图片描述">

**4. dat库的使用**

  ```javascript
  import * as dat from 'dat.gui'
  // ...
  // ...
  // 配置gui
  const gui = new dat.GUI()
  // datGUI
  gui.add(cube.position, "x")
    .min(0)
    .max(10)
    .step(0.01)
    .name('移动x')
    .onChange((val) => {
    })
    .onFinishChange((val) => {
    })
  gui.add(cube.position, "y")
    .min(0)
    .max(10)
    .step(0.01)
    .name('移动y')
    .onChange((val) => {
    })
    .onFinishChange((val) => {
      // 防抖版本...
    })
  gui.add(cube.position, "z")
    .min(0)
    .max(10)
    .step(0.01)
    .name('移动z')
    .onChange((val) => {
    })
    .onFinishChange((val) => {
      // 防抖版本...
    })
  const params = {
    color: '#000000',
    fn: () => {
      gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repeat: -1})
    }
  }


  gui.add(cube, "visible").name('show')
  // add fn
  gui.add(params, "fn").name("run") 
  // set folder
  const folder = gui.addFolder("设置立方体")
  folder.add(cube.material, "wireframe")
  folder.addColor(params, "color")
    .onChange((val) => {
      cube.material.color.set(val)
    })

  ```

**5. 导入用第三方建模软件如blender等制作的模型**
用过懂车帝的同学都应该看过，懂车帝的3d炫酷的车模型。那么那样的东西，是如何实现的呢？准确的疑问描述：我们怎么在页面端或者手机的app上，实现那么炫酷的东西呢？
<img src="/img/threejs2_3.webp" alt="图片描述">

我们需要搞明白两个点：1.模型的开发 2. 把模型塞入浏览器的页面中。前者对于前端工程师而言，可以不必去刨根问底，因为那是3d建模同学们的工作，不管他们是用了blender或者3dmax我们均无需关心。我们只需要模型的结果文件。而对于后者的实现。我们就需要借助threejs，导入模型到页面即可。那么，具体怎么导入的呢？

如下代码：
```javascript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.preload()
dracoLoader.setDecoderPath("./draco/")
loader.setDRACOLoader(dracoLoader)
// loader.load("https://threejs.org/examples/models/gltf/LittlestTokyo.glb", function(gltf) {
  loader.load("air.glb", function(gltf) {
  console.log('success!!!')
  const air = gltf.scene
  scene.add(air)
})
```

但是吧，出现了报错。
<img src="/img/threejs2_6.jpg" alt="图片描述">

我的小飞机模型，怎么都加载不出来。网上能查的方法，都试了，还是不行。尬...经过一番艰难的查找，终于找到了原因---parcel打包工具的锅。上述错误出现的原因在于，打包产物的文件夹中并没有包含模型的glb文件。因此等同于无资源。怎么解决？我们需要安装一个包：

```javascript
parcel-plugin-static-files-copy
```

然后在package.json中做一下静态目录文件的配置：
```javascript
...
  "staticFiles": {
    "staticPath": "static"
  }
```

其中的static就是我的静态目录文件。完美解决，效果如下：

<img src="/img/threejs2_4.jpg" alt="图片描述">

<img src="/img/threejs2_5.jpg" alt="图片描述">

当然还需要对灯光等做些微调，逃。

