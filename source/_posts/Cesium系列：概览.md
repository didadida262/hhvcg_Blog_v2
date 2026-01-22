---
title: Cesium系列：概览
date: 2026-01-20 14:52:50
category: 前端三维系列
---

#### 本文作为cesium系列的第一回，主要介绍些基础的且尽可能全面地内容。

#### 坐标系
`地心为原点`，x：坐标点在地球质心到本初子午线（0° 经度）、赤道平面的投影距离（米）y：坐标点在地球质心到东经 90°、赤道平面的投影距离（米）z：坐标点到地球赤道平面的垂直距离（米）

<img src="/img/cesium1_1.png" alt="">

#### Entity 和 Primitive
Entity的底层就是Primitive，可以理解为房子和瓦片的关系。创建一个cube，可以用entity，也可以用Primitive。但是，如果上量的时候，性能优化的方案之一就是Primitive，示例代码如下所示。

```javascript

// 【Entity 示例】单一点/少量点快速创建，封装完整，一行配置即可带样式/描述
// 适合：标记点、简单动画，开发效率优先（内部自动生成Primitive）
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.3972, 39.9075, 100),
  point: { color: Cesium.Color.RED, pixelSize: 10 },
  label: { text: "Entity点", font: "12px sans-serif", pixelOffset: new Cesium.Cartesian2(0, -15) } // 内置样式，无需手动处理
});

// 【Primitive 示例】批量创建1000个点，手动管理集合，性能优势显著
// 适合：海量数据渲染，性能优先（减少对象创建开销，降低Draw Call）
const points = new Cesium.PointPrimitiveCollection({
  frustumCulling: true, // 额外性能优化：视口外点自动剔除
  pixelSize: 8 // 统一设置样式，减少重复配置
});
// 模拟批量场景（1000个点），Primitive批量添加效率远高于循环创建Entity
for (let i = 0; i < 1000; i++) {
  points.add({
    position: Cesium.Cartesian3.fromDegrees(116.3972 + i/1000, 39.9075, 100),
    color: Cesium.Color.BLUE // 支持单个点差异化配置
  });
}
viewer.scene.primitives.add(points);

// 核心差异体现：
// 1. 性能：循环创建1000个Entity会生成1000个Primitive，卡顿明显；PrimitiveCollection批量管理，仅1个集合对象
// 2. 封装：Entity内置label、billboard等组件，无需手动关联；Primitive需自己组合几何体/材质
// 3. 控制：Primitive可直接操作WebGL状态，Entity无此权限（如自定义Shader需额外配置）

```
创建的1000个点，可以当成一个集合来处理。

#### 3D Tiles
研究了下这个东西之后猛然发现，刚毕业那会做的晶圆系统的那个项目中，很多工作，都是在造这方面的轮子。tiles（瓦片）就是分层分块二进制格式，支持 LOD 优化大规模 3D 数据。通过 tileset.json 入口，按相机视角动态加载/卸载瓦片，减少资源占用。高德地图等各种地图的项目都是这逻辑，`远粗近细，瓦片加载`。

