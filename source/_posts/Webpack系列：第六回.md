---
title: Webpack系列：第六回
date: 2023-11-15 00:32:54
category: Webpack系列
---

### 本文浅谈webpack的热更新机制

**啥是热更新？**
当我们对已经在运行的程序代码做些许修改时，页面能够自动的局部刷新，这就是**热更新机制**

如何实现的？
1. 初次打包： 编译打包，生成bundle.js，然后开启一个静态资源服务器，根据对应的地址打开页面
2. 开启热更新时改动代码：webpack重新编译 > 根据变化的内容生成俩文件：manifest.js及chunk.js，通过HMRserver主动推送给浏览器（本质一个websocket通信），浏览器根据manifest.js文件获取变化的内容，重新render。

注： bundlejs中除了自己写的模块代码，还包含了HMR-runtime