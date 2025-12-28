---
title: Threejs系列：贴图
date: 2023-12-05 13:57:11
category: 前端三维系列
---

**本文重点介绍threejs迷惑大法的基石：贴图**
在前面的文章中，我们实际上已经用到了贴图。
比如这种：
<img src="/img/uv偏移1.gif" alt="图片描述">

这种：
<img src="/img/threejs3_2.jpg" alt="图片描述">

当然了，还有这种高端的：
<img src="/img/threejs3_4.jpg" alt="图片描述">

我们呢平时看到的那些炫酷的效果，其本质，就是各种贴图的叠加。玩过早期的游戏例如`cs`的同学，应该深有体会。那么借助本文，我们尝试缕一缕threejs的，各种贴图

- **物体贴图**
创建一个球体，贴出了一个`地球仪`
```javascript
const geometry = new THREE.SphereGeometry( 4 ); 
const texttureLoader = new THREE.TextureLoader()
const pi = texttureLoader.load('./earth.jpg')
const material = new THREE.MeshBasicMaterial( {
  map: pi,
} ); 
const cube = new THREE.Mesh( geometry, material ); 
cube.position.x = 1
cube.position.y = 1
cube.position.z = 1
scene.add( cube );
```
<img src="/img/贴图1.gif" alt="图片描述">


- **环境贴图**
```javascript
// 给场景背景贴图
const path = './textures/cube/pisa/';
const format = '.png';
const urls = [
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format
];

const envMapTexture = new THREE.CubeTextureLoader().load( urls );
scene.background = envMapTexture;
```



