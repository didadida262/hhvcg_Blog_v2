---
title: Threejs的一些优化手段
date: 2023-12-10 09:08:26
category: 性能的考量
---


#### 本文主要介绍在threejs中的一些，优化手段

#### 场景中的物体数量巨大，该如何优化？
**核心优化：减少 Draw Call（绘制调用）**

#### 合并几何体（无独立交互需求
```javascript
import { BufferGeometryUtils } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [];
for (let i = 0; i < 1000; i++) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(Math.random() * 50, 0, Math.random() * 50);
  geometries.push(geo);
}
// 合并为1个几何体，仅1次Draw Call
const mergedGeo = BufferGeometryUtils.mergeBufferGeometries(geometries);
const mergedMesh = new THREE.Mesh(mergedGeo, new THREE.MeshLambertMaterial({ color: 0x0088ff }));
scene.add(mergedMesh);
```

#### 实例化渲染（需独立变换）
```javascript
const geo = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x0088ff });
const instancedMesh = new THREE.InstancedMesh(geo, material, 1000);
scene.add(instancedMesh);

const matrix = new THREE.Matrix4();
for (let i = 0; i < 1000; i++) {
  matrix.setPosition(Math.random() * 50, 0, Math.random() * 50);
  instancedMesh.setMatrixAt(i, matrix);
}
```
#### 帧缓冲
正常情况下，Three.js 的渲染流程是：
`场景(Scene) + 相机(Camera) → WebGL渲染器(Renderer) → 直接输出到<canvas>画布（屏幕）`
而所谓的`帧缓冲`,思路跟canvas的离屏渲染一样，本质是借助内存中的一块区域，把渲染结果暂存起来，不直接显示到屏幕。

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. 基础场景搭建
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. 创建帧缓冲（WebGLRenderTarget = Three.js封装的帧缓冲）
// 参数：宽度、高度、配置（颜色格式、深度缓冲区等）
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.LinearFilter, // 过滤方式
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat, // 颜色格式
  depthBuffer: true // 启用深度缓冲区（保证渲染有深度检测）
});

// 3. 创建一个立方体（待渲染的场景内容）
const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
const cubeMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

// 4. 创建“全屏平面”：用于显示帧缓冲的纹理
const planeGeo = new THREE.PlaneGeometry(2, 2); // 全屏平面（NDC坐标）
const planeMat = new THREE.MeshBasicMaterial({
  map: renderTarget.texture // 把帧缓冲的纹理作为贴图
});
const screenPlane = new THREE.Mesh(planeGeo, planeMat);
// 创建后处理场景（仅包含全屏平面）
const postScene = new THREE.Scene();
postScene.add(screenPlane);
// 正交相机（用于渲染全屏平面，无透视）
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
postCamera.position.z = 1;

// 5. 控制器和光源
const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
camera.position.z = 5;

// 6. 渲染循环（核心：先渲染到帧缓冲，再渲染到屏幕）
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 第一步：将场景渲染到帧缓冲（而非屏幕）
  renderer.setRenderTarget(renderTarget); // 切换渲染目标为帧缓冲
  renderer.render(scene, camera); // 渲染场景到帧缓冲

  // 第二步：将帧缓冲的纹理渲染到屏幕
  renderer.setRenderTarget(null); // 切换回屏幕渲染
  renderer.render(postScene, postCamera); // 渲染全屏平面（贴了帧缓冲纹理）

  controls.update();
}
animate();
```
可以直接把帧缓存看成是一个影子画布，按需要扔给页面的真实画布展示。
