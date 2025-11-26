---
title: Vue.js系列：序章
category: 前端剑气双修专栏
date: 2023-08-07 22:30:17
tags:
---
毕业到现在快两年了，职业生涯中的项目基本都是基于vue2开发的。一直以来，注重的都是业务功能的实现，却很少关注其底层的逻辑特性。从本文开始，我会通过手头的资料，对vue2以及vue3，做一些备忘录，重点记录下其实现的基本逻辑，以及自己对其的思考。同时，因为我们也都知道，vue2.0版本，将于本年年底，也就是2023年的12月份停止维护，也算是个人对其的一个致敬吧。

vue这种框架出现的结果，就是将以前jquery那样的**命令式操作dom**的方式--->**声明式的操作dom**，翻译成人话就是：**数据驱动视图，数据变，视图自动的变。同时视图由于用户的操作变化，也会更新数据。**至于怎么生成节点插入节点等dom操作，不再关心，也无需关心。

举例说明：
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <button id="add">+</button>
    <button id="sub">-</button>
    <span id="count">0</span>
</body>
<script>
    let count = 0
    document.getElementById('add').addEventListener('click', () => {
        count++
        document.getElementById('count').innerText = count
    })
    document.getElementById('sub').addEventListener('click', () => {
        count--
        document.getElementById('count').innerText = count
    })
</script>
</html>
```
上述代码用最原始的操作dom方式，实现一个简单功能，加减数字，页面如下：
<img src="/img/vue1.png" alt="加一减一">
加则加一，减则减一。思路很清晰：获取按钮节点绑定事件，根据不同事件，改变目标文本内容。

**vue的方式：**
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <div id="app">
        <button id="add" @click="() => {count++}">+</button>
        <button id="sub" @click="() => {count--}">-</button>
        <span id="count">{{ count }}</span>
    </div>
</body>
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>

  const { createApp } = Vue
  
  createApp({
    data() {
      return {
        count: 0
      }
    }
  }).mount('#app')
</script>
</html>
```
**无需手动获取dom，数据变化，视图自动更新。**代码体验的提升，立竿见影。
**历史小知识：**

2015年10月26日，vue1.0版本发布，代号**新世纪福音战士（Evangelion）**

2016年10月1日，vue2.0版本发布，代号“**攻壳机动队（The Ghost in the Shell）**“。奠定了框架本身的四大能力：`视图层渲染、组件机制、路由机制（router）和状态管理（vuex）`。该版本支持`JSX、TS以及流式服务端渲染`。

2020年9月18日发布vue3版本,代号**one piece(海贼王)**