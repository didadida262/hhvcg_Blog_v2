---
title: Threejs系列：相机
date: 2023-11-24 14:10:43
category: 前端三维系列
---

### 本文主要研究一下threejs中的相机

threejs中的相机：
- `ArrayCamera`：包含着一组子摄像机，常用于多人同屏的渲染，更好地提升VR场景的渲染性能
- `StereoCamera`：双透视摄像机（立体相机），常用于创建 3D 立体影像，比如 3D 电影之类或 VR
- `CubeCamera`：有6个渲染，分别是立方体的6个面，常用于渲染环境、反光等
- `OrthographicCamera`：正交相机，在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。这对于渲染2D场景或者UI元素是非常有用的。
- `PerspectiveCamera`：透视相机，这一投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。


1. **透视相机**
语法：`PerspectiveCamera( fov, aspect, near, far )`
`fov`：摄像机视锥体垂直视野角度
`aspect`：摄像机视锥体长宽比，一般设置为Canvas画布宽高比width / height
`near`：摄像机视锥体近端面
`far`：摄像机视锥体远端面，far-near构成了视锥体高度方向
```javascript
// 样例代码
const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
```
透视视角：
<img src="/img/threejs_camera_透视.png" alt="parser">

2. **正交相机**
语法：`OrthographicCamera( left, right, top, bottom, near, far )`
`left`：摄像机视锥体左侧面。
`right`：摄像机视锥体右侧面。
`top`：摄像机视锥体上侧面。
`bottom`：摄像机视锥体下侧面。
`near`：摄像机视锥体近端面。表示从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值0.1
`far`：摄像机视锥体远端面。表示距离相机多远的位置截止渲染，如果设置的值偏小小，会有部分场景看不到。 默认值2000

```javascript
const s = 5; // 假设一个范围
const k = window.innerWidth / window.innerHeight; // 视图的长宽比(canvas画布的长宽比)
const camera = new THREE.OrthographicCamera( -s*k, s*k, s , -s, 0.1,2000)
scene.add( camera );const s = 5; // 假设一个范围
const k = window.innerWidth / window.innerHeight; // 视图的长宽比(canvas画布的长宽比)
const camera = new THREE.OrthographicCamera( -s*k, s*k, s , -s, 0.1,2000)
scene.add( camera );
```
正交视角：
<img src="/img/threejs_camera_正交.png" alt="parser">

再补一个直观的

`透视`
<img src="/img/threejs_camera2.png" alt="parser">

`正交`
<img src="/img/threejs_camera1.png" alt="parser">


**透视相机和正交的区别：前者模拟人眼观察的效果，用于相机漫游等场景，后者通常用于全图总览等场景**
