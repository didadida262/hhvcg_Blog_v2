---
title: Threejs系列：材质
date: 2023-12-03 17:04:08
category: 前端三维系列
---

### 本文介绍材质相关内容

我们说threejs中，一个个的物体都是`网格（cube）`，由`物体（geometory）`和`材质（material）`构成。物体决定其长啥样，而材质，决定了物体表面显示啥样。

**创建一个简单的立方体**

```javascript
const geometry = new THREE.BoxGeometry( 4, 4, 4 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
const cube = new THREE.Mesh( geometry, material ); 
cube.position.x = 1
cube.position.y = 1
cube.position.z = 1
scene.add( cube );
```
<img src="/img/threejs_材质1.gif" alt="图片描述">

**一个标准的立方体。**
其表面材质就是代码中的`material`。需要注意的是，我们的`Mesh`关于材质的参数，可以是一个材质，也可以是一组。
```javascript
const material1 = new THREE.MeshBasicMaterial( {color: 'black'} ); 
const material2 = new THREE.MeshBasicMaterial( {color: 'red'} ); 
const material3 = new THREE.MeshBasicMaterial( {color: 'green'} ); 
const material4 = new THREE.MeshBasicMaterial( {color: 'blue'} ); 
const material5 = new THREE.MeshBasicMaterial( {color: 'orange'} ); 
const material6 = new THREE.MeshBasicMaterial( {color: 'gray'} ); 
const cube = new THREE.Mesh( geometry, [material1,material2,material3,material4,material5,material6 ] ); 
```
<img src="/img/threejs_材质2.gif" alt="图片描述">

**改动uv设置贴图**
uv有自己的坐标系规则，右x正上y正，几个点数据的分别对应上左，上右，下左，下右
```javascript
    // // 物体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.MeshPhongMaterial({
        map: pi,
        color: 0xffffff,
        transparent:true,
        side: THREE.DoubleSide
    })
    const uv = new Float32Array([
        // 顺序： 
        0, 0.5,
        0.5, 0.5,
        0, 0,
        0.5, 0,
    ])
    geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)
    const cube = new THREE.Mesh(geometry, mesh)
```
偏移前：
<img src="/img/uv偏移1.gif" alt="图片描述">

偏移后：
<img src="/img/uv偏移2.gif" alt="图片描述">


