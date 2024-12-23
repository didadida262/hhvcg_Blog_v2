---
title: Webpack系列：第五回(性能优化)
date: 2023-09-06 02:28:21
category: Webpack系列

---
**本文作为一个备忘录，主要记录一些常用打包优化的方法**

1. **productionSourceMap: false**
   禁止生成map文件
2. **启用多线程来提高构建速度**： Teser
3. **Treeshaking**， 打包时删除未使用代码
 - usedExports： 未被使用的模块代码，打包时被自动删除
 - sideEffects： 指定有副作用的模块代码，为false时可以直接删除
4. `compressionPlugin`代码压缩
5. `图片压缩`，如image-webpack-loader、file-loader等
6. `SplitChunks`: 代码拆分。将公共模块打包成单独的文件，减少每个页面的初始加载时间 
7. elementui组件库按需加载
