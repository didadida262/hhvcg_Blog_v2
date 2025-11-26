---
title: 发布自己的npm包
date: 2024-04-22 16:03:57
category: 前端剑气双修专栏
---


### 本文主要提一下，往公网上发布自己的npm包，大概的流程。

目前的公司，稍微正经点的，都会有贴合自身业务的一套组件库，封装成所谓的`“SDK层”`，这样能够极大的减少前端项目的代码量。当然，这需要业务自身足够的稳定，否则，懂得都懂。

#### 1. github创建一个仓库，npm初始化一下，完善包的一些必要字段。
#### 2. 假如自己想要复用的代码 
#### 3. 登陆发布
```javascript
    npm login
    npm publish
```

具体操作参考下面文章，写的非常详细

> https://juejin.cn/post/7039140144250617887

**整个流程还是很简单的，当然在实操过程中碰到一个小问题。**
`npm login 没有出现 username,反而是跳转到了cnpm注册...`,解决方案：`npm config set registry https://registry.npmjs.org/`

### 更新包的版本
```javascript
// patch：补丁号，修复bug，小变动，如 v1.0.0->v1.0.1
npm version patch

// minor：次版本号，增加新功能，如 v1.0.0->v1.1.0
npm version minor

// major：主版本号，不兼容的修改，如 v1.0.0->v2.0.0
npm version major

npm publish
```
在使用了包的项目中，更新目标包：
```javascript
npm update packageName (-D | -S)
```

文毕。


