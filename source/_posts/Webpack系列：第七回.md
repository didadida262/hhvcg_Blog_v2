---
title: Webpack系列：第七回
date: 2024-04-15 10:33:35
category: Webpack系列

---

### 本文杂记，记录一些webpack使用过程中碰到的奇奇怪怪的问题和知识点
1. react18初始化项目时，没有**webpack**
默认是隐藏的，仔细观察可以发现，项目如下方式启动

```javascript
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  },
```
此时需要暴露：

```javascript
    npm run eject
```
2. `Sourcemap`（源映射）是一种文件，用于将编译后的代码映射回原始源代码。说白了就是在开发模式时，在浏览器中调试代码时，看到的是源码而不是杂乱无章的变异之后的代码
