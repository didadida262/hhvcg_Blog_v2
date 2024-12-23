---
title: Threejs系列：雾
date: 2023-12-05 20:33:20
category: 前端三维系列
---

### Thresj支持雾气的效果，本文简单介绍下

1. 首先创建一个物体，`巨长的长方体`

```javascript
const geometry = new THREE.BoxGeometry( 1, 1,100 ); 
const texttureLoader = new THREE.TextureLoader()
  const material = new THREE.MeshBasicMaterial( {
  color: 'green'
} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );
```

<img src="/img/threejs_fog1.png" alt="图片描述">

2. `添加线性雾`
```javascript
// 雾
scene.fog = new THREE.Fog(0x999999, 0, 50)
scene.background = new THREE.Color(0x999999);
```

<img src="/img/threejs_fog2.png" alt="图片描述">

3. `添加指数雾`
```javascript
scene.fog = new THREE.FogExp2(0x999999, 0.1)
```

<img src="/img/threejs_fog3.png" alt="图片描述">

**线性顾名思义，就是线性递减。从图片对比中明显看出，指数雾比线性雾气浓烈些许。**

