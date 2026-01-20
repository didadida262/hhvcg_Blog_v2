---
title: 基于cesium开发应用之问题
date: 2025-7-22 12:37:32
category: 性能的考量
---

#### 本文主要记录cesium开发过程中的坑

#### 加载模型太多导致卡顿
加载上千个地标、模型、轨迹线等 Cesium Entity 时，页面帧率（FPS）骤降，操作视角卡顿，甚至浏览器内存溢出。
**原因**：Cesium 默认对每个 Entity 单独渲染，海量实体导致 DrawCall（绘制调用）激增；
**解决方案**：
- 数据分块 + 视域剔除：基于Cesium.ScreenSpaceCameraController监听视角变化，仅渲染当前视域内的实体，远距实体暂存 / 销毁；
```javascript
// 批量点优化（10万+点）
const pointCollection = new Cesium.PointPrimitiveCollection({
  frustumCulling: true, // 开启视口剔除
});
```
- 开启性能优化配置
```javascript
viewer.scene.fog.enabled = true; // 开启雾效，远距模型自动淡化
viewer.scene.debugShowFramesPerSecond = true; // 监控帧率
viewer.scene.maximumAliasedLineWidth = 1; // 降低线条渲染开销
```



#### 3D 模型（GLB/GLTF）加载异常 / 显示不全
**原因**： 坐标不兼容
**解决方案**：
```javascript
// 经纬度转Cesium坐标系，设置模型位置
const position = Cesium.Cartesian3.fromDegrees(116.4, 39.9, 50);
const model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
  url: 'model.glb',
  modelMatrix: Cesium.Transforms.headingPitchRollToModelMatrix(position, new Cesium.HeadingPitchRoll())
}));
```
