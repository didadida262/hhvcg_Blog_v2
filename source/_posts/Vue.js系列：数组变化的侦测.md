---
title: Vue.js系列：数组变化的侦测
date: 2023-08-10 23:53:01
category: 前端剑宗专栏
tags:
---
**本文详细介绍vue2，对于数组变化的侦测**
vue2中针对数组的响应式，跟对象的响应式还是有些区别的，总的原则还是那句话：**getter中搜集依赖，setter中触发依赖。**，但是数组可以调用push等这些能够添加删除数据的api，变更数据。再介绍对象的属性监听时说过，这种操作无法捕捉到，所以vue单独用$set和$delete处理。那么针对数组，vue2又是如何处理的呢？

vue2针对数组，做了一层拦截器。即：当通过那些api变更数据时，实际触发的是我们自己写的函数，然后再走原生方法，这样，每次变更，走我们自己的方法时，就可以执行触发依赖的操作。
示例代码如下：
```javascript
const data = [1,2,3,4]
for (let key in data) {
  let val = data[key]
  Object.defineProperty(data, key, {
      enumerable: true,
      get() {
          console.log('搜集以来')
          return val
      },
      set(newVal) {
          console.log('触发以来')
          val = newVal
      }
  })
}
const oldProto = Array.prototype
const newProto = Object.create(Array.prototype)

;['push', 'pop'].forEach(method => {
  newProto[method] = function(...args) {
    console.log('gengxing')
    oldProto[method].apply(this, args)
  } 
});
data.__proto__ = newProto

data.pop()
```
可以清楚地看到：
**第一步：** 还是通过defineProperty响应化数组已经存在的值。
**第二步：** 以Array的原型对象创建了一个新的原型对象。然后遍历所有支持的方法，将其改成我们自己能够控制的function。
在该function中，除了通过apply复用原生方法，还可以做一些我们想做的事情：比如**通知依赖**
**最后：** 当然最重要的，就是将data数组数据的原型改成我们自己的新的原型，就是我们开篇说的拦截器。
