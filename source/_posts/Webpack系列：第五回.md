---
title: Webpack系列：第五回(性能优化)
date: 2023-09-06 02:28:21
category: Webpack系列

---
### 本文中，我们会借助一个项目，展示webpack的各个优化手段，对项目的优化效果**

### 代码分割
#### 🔴 优化前（单个 Bundle）
```
bundle.js: 315 KB
总文件数: 1 个
首屏加载: 需要下载全部 315 KB
缓存效率: 低（任何代码变化都会重新下载整个文件）
```
#### 🟢 优化后（代码分割）
```
main.xxx.js: 71.8 KB (应用代码)
vendors.xxx.js: 552 KB (第三方库)
总文件数: 2 个
首屏加载: 只需下载 71.8 KB 的应用代码
缓存效率: 高（第三方库代码变化少，缓存效果好）
```

#### 配置内容：
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: 10,
      },
      common: {
        name: 'common',
        minChunks: 2,
        // 即被至少 2 个模块引用的代码
        chunks: 'all',
        priority: 5,
        reuseExistingChunk: true,
      }
    }
  }
}
```
#### 分割策略：
1. **vendor 组**：所有 node_modules 中的第三方库
2. **common 组**：被多个模块引用的公共代码
3. **main 组**：应用的主要代码。注意这个main是默认的无需手动配置。只要没有被`common、vender`匹配到的，统统都在main中.


### 路由组件分割（懒加载）

#### 🔴 路由分割前（所有组件打包在一起）
```
main.js: 71.8 KB
vendors.js: 552 KB
总文件数: 2 个
首屏加载: 需要下载所有页面组件代码
```

#### 🟢 路由分割后（按需加载）
```
main.js: 50.3 KB (减少 30%)
vendors.js: 552 KB (不变)
306.xxx.js: 4.25 KB (HelloPage)
937.xxx.js: 6.42 KB (AboutPage)
801.xxx.js: 6.98 KB (ProfilePage)
793.xxx.js: 7.86 KB (SettingsPage)
总文件数: 6 个
首屏加载: 只需下载 main.js + vendors.js
```

#### 🎯 路由分割实现

#### React.lazy 配置：
```javascript
// 路由级别的懒加载组件
const HelloPage = React.lazy(() => import('./components/HelloPage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const ProfilePage = React.lazy(() => import('./components/ProfilePage'));
const SettingsPage = React.lazy(() => import('./components/SettingsPage'));
```

### 持久化缓存
本质上就是，将构建过程中的中间结果保存到磁盘，下次构建时直接复用这些结果，避免重复计算
#### 🔴 缓存优化前
```
首次构建: 6,136 ms
二次构建: 6,136 ms (无缓存，完全重新构建)
构建时间: 无改善
```

#### 🟢 缓存优化后
```
首次构建: 6,136 ms (建立缓存)
二次构建: 838 ms (使用缓存)
构建时间提升: 86.3% (减少 5,298 ms)
```

#### 🎯 持久化缓存配置

#### 核心配置：
```javascript
cache: {
  type: 'filesystem',                    // 使用文件系统缓存
  buildDependencies: {
    config: [__filename],               // 配置文件变化时失效缓存
  },
  cacheDirectory: path.resolve(__dirname, '.webpack_cache'),
  compression: 'gzip',                  // 压缩缓存文件
  profile: true,                        // 启用缓存性能分析
  maxAge: 1000 * 60 * 60 * 24 * 7,     // 缓存有效期 7 天
}
```

#### 额外优化配置：
```javascript
optimization: {
  moduleIds: 'deterministic',           // 稳定的模块 ID
  chunkIds: 'deterministic',            // 稳定的 chunk ID
  runtimeChunk: 'single'               // 分离运行时代码
}
```
**总结：**磁盘空间换时间

### 并行构建（配置 thread-loader 实现多线程编译）

#### 🔴 并行构建前（单线程构建）
```
首次构建: 6,136 ms
缓存构建: 838 ms
CPU 利用率: 单核心，利用率低
编译方式: 串行编译所有模块
压缩方式: 单线程压缩代码
```

#### 🟢 并行构建后（多线程构建）
```
首次构建: 4,663 ms (提升 24%)
缓存构建: 756 ms (提升 10%)
CPU 利用率: 多核心并行，利用率高
编译方式: 27 个 worker 并行编译
压缩方式: 多线程并行压缩
```

#### 🎯 并行构建实现

##### 1. Thread-loader 配置（并行编译）
```javascript
{
  loader: 'thread-loader',
  options: {
    workers: os.cpus().length - 1,  // 使用 CPU 核心数 - 1 = 27
    workerParallelJobs: 50,         // 每个 worker 最多处理 50 个任务
    poolTimeout: 2000,              // worker 池超时时间
  },
}
```

##### 2. ts-loader 配置（配合并行）
```javascript
{
  loader: 'ts-loader',
  options: {
    happyPackMode: true,    // 配合 thread-loader 使用
    transpileOnly: true,    // 只转译不类型检查，提升速度
  },
}
```

##### 3. TerserPlugin 配置（并行压缩）
```javascript
new TerserPlugin({
  parallel: true,           // 启用并行压缩
  terserOptions: {
    compress: {
      drop_console: true,   // 生产环境移除 console
    },
  },
})
```

### Bundle 分析
借助该工具，完美查看各个包的大小。这个就不用展开了。
```javascript

# 安装 bundle 分析工具
npm install --save-dev webpack-bundle-analyzer

# 分析构建结果
npx webpack-bundle-analyzer dist/bundle.js
```


### 资源压缩
这边针对不同的资源（js、css、image等等等），都有很多对应的插件实现。
#### 🎯 优化结果一览

| 指标 | 数值 |
|------|------|
| **传输大小减少（Brotli）** | **75.8%** ↓ |
| **传输大小减少（Gzip）** | **71.9%** ↓ |
| **优化前总大小** | 604.32 KB |
| **Brotli压缩后** | ~146 KB |
| **Gzip压缩后** | ~170 KB |
| **节省带宽** | 458+ KB |

---

#### ⚡ 实施的7大压缩优化

##### 🔧 JavaScript 压缩（增强版）
- 并行压缩，多核加速
- 移除 console 和 debugger
- 2次压缩优化
- Safari 10 兼容性修复

**效果：** vendors.js 压缩后 548 KB → Brotli 131 KB（**76%减少**）

---

##### 🎨 CSS 提取和压缩
- 独立CSS文件，支持并行加载
- 移除注释和冗余代码
- 压缩颜色值、选择器、字体值

**效果：** main.css 20.86 KB → Brotli 3.77 KB（**82%减少**）

---

##### 📄 HTML 压缩
- 移除注释和空白
- 压缩内联 JS/CSS
- 移除冗余属性

**效果：** index.html 优化至 1.88 KB

---

##### 📦 Gzip 压缩
- 自动压缩 JS、CSS、HTML、SVG
- 阈值：10 KB
- 生成 .gz 文件

**压缩率：** 平均 72% 减少

---

##### 🚀 Brotli 压缩（更优）
- 比 Gzip 压缩率更高
- 现代浏览器支持
- 生成 .br 文件

**压缩率：** 平均 76% 减少  
**比 Gzip 额外节省：** 14%+

---

##### 🖼️ 图片压缩
- GIF：gifsicle 渐进式
- JPEG：jpegtran 渐进式
- PNG：optipng Level 5
- SVG：svgo 优化

**效果：** 无损/有损智能压缩

---

##### 🎯 资源内联优化
- 图片 < 8 KB → base64 内联
- 字体 < 4 KB → base64 内联
- 减少 HTTP 请求数

**效果：** 关键资源更快加载

---



### Tree Shaking
#### Bundle 体积对比
| 指标 | 优化前 | 优化后 | 减少 |
|------|--------|--------|------|
| **vendors.js** | 548.43 KB | 241.67 KB | **306.76 KB (56%)** ↓ |
| **main.js** | 4.42 KB | 4.45 KB | +3 B (添加演示代码) |
| **总体 JS** | 604 KB | 298 KB | **306 KB (51%)** ↓ |

#### 关键改进
- vendor bundle 减少 56%  
- 未使用代码完全移除  
- Scope Hoisting 优化  
- 导出名称混淆
---


#### 实施内容
```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "*.sass",
    "*.less",
    "src/index.tsx"
  ]
}
```

**作用：**
- 告诉 Webpack 哪些文件有副作用
- CSS 文件必须保留（样式副作用）
- 入口文件必须保留（应用初始化）
- 其他所有 JS 文件可以安全地 Tree Shaking

**效果：**
- Webpack 可以安全地移除未使用的纯函数和类
- 提升 Tree Shaking 的准确性和效率

---

更加详细的配置，移步项目仓库https://github.com/didadida262/project_webpack
**此文终结。**


