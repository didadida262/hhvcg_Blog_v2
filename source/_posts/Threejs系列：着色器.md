---
title: Threejs系列：着色器
date: 2023-11-28 17:42:43
category: 前端三维系列
---

### 本文研究下threejs中，着色器的相关内容及使用方法

Shader（着色器）的功能如其名称： **上色用的**。分为两种： `顶点着色器`和`片段着色器`
- 顶点着色器： 用来确定输入的点数据在屏幕上的具体位置,即：`定位`
- 片段着色器： 确定点的颜色，并上色.即：`着色`

**编写着色器规范**
编写着色器需要用到`glsl`语言，即：opengl shader language.一种类似于c的东东。

1. **首先分别创建顶点着色器和片段着色器文件，在main.js中引入**

```javascript
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'
...
...
// 创建着色器材质
const geo = new THREE.PlaneGeometry(1, 1)
const shaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: vertexShader, 
  fragmentShader: fragmentShader
})
const myzhuo = new THREE.Mesh(geo, shaderMaterial)
scene.add(myzhuo)
```

顶点着色器代码：
```c
uniform mat4 modelViewMatrix; // 模型视图矩阵
uniform mat4 viewMatrix; // 投影矩阵
uniform mat4 projectionMatrix; // 投影矩阵

attribute vec3 position; // 顶点位置

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelViewMatrix * vec4(position, 1.0); // 计算顶点在视图空间中的位置
}
```

片段着色器代码：
```c
precision mediump float;
varying float vColor;
void main(){
    gl_FragColor = vec4(1.0, 0, 1.0, 1.0);
}
```

最终效果：
<img src="/img/threejs_着色器.gif" alt="parser">



