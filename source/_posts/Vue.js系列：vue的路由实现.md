---
title: Vue.js系列：vue的路由实现
date: 2023-08-11 00:45:40
category: 前端剑气双修专栏
tags:
---

vue-router存在的目的，就是实现纯前端的路由跳转，需要满足两点：**无刷新、内容切换**
目下就是两种模式：**hash模式和history模式**

#### Hash模式：
#后面跟着路径（hash值），浏览器向后端发请求时， #后头的字段不会给到后段。因为#只是一个标识符。例如：http://www.xxx.com/#/info.html，后段只会收到`http://www.xxx.com`
**实现原理：**
通过监听hashchange,获悉当前url，显示对应视图内容。
```javascript
window.addEventListener('hashchange', updateView)
```

#### History
h5新增的api，通过`history.pushstate`、`history.popstate`跳转到对应路由，显示对应视图,也能实现一样的功能，但是因为少个#，所以更加的美观.例如：http://www.xxx.com/info.html

但该方法准确的讲，是能够实现当用户没有刷新整个页面的情况下，实现视图的更新。如果`强制刷新了页面`，请求会带上路由中所有字段，后端收到该地址，匹配不到对应地址，`出现404`，因为没有匹配到任何资源.
**如何解决呢？**
1. 后端安装类似`connect-history-api-fallback`的以来，use一下
2. nginx代理：nginx去判断路由是否为前端路由
如果要细究vue-router的底层逻辑，实质还是一个类，具体实现还是响应式的那一套，区别在于，vue-router监听的是地址栏里的url，而MVVM监听的是页面数据，仅此而已。

#### 一些钩子
```javascript
    beforeEnter(to,form,next)
    beforeLeave(to,from,next)
    ...
```