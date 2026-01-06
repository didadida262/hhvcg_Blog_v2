---
title: Threejs系列：物体
date: 2023-12-03 17:22:26
category: 前端三维系列
---

### 本文介绍Threejs中物体(geometory)相关内容

threejs中常见几何体包括：`平面体、立方体、圆、锥体、柱体、圆环、四面、八面、十二面缓冲、挤压缓冲体、形状缓冲几何体、圆环扭结、管道体`等等

**1. 空间的中的物体由一个个三维的点构成**（我们常说的物体有一个个小三角形构成，指的是-->三角形是 “渲染的基本单元”）
- **直接给点**

```javascript
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0, // v0
        1.0, -1.0,  1.0, // v1
        1.0,  1.0,  1.0, // v2

         1.0,  1.0,  1.0, // v3
        -1.0,  1.0,  1.0, // v4
        -1.0, -1.0,  1.0  // v5
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

```

- **索引给点**
```javascript
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0, // v0
        1.0, -1.0,  1.0, // v1
        1.0,  1.0,  1.0, // v2

        //  1.0,  1.0,  1.0, // v3
        -1.0,  1.0,  1.0, // v4
        // -1.0, -1.0,  1.0  // v5
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const indexs = new Uint16Array(
    [
        0, 1,2,2, 3, 0
    ]
    )
    geometry.index = new THREE.BufferAttribute(indexs, 1)
```