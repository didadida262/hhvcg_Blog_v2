---
title: Vue.js系列：实现一个自己的vue续篇
category: 前端剑气双修专栏
date: 2023-08-09 10:30:11
tags:
---

在前文中，我们已经实现了**模板编译**的功能。即用我们自己写的vue，已经能够自动的解析页面中的变量，给予展示。那么接下来，我们要更进一步：**当变量的值变化的时候，我们能够感知到这种变化，并同步更新到视图。**
目标拆分： **感知变化,更新视图**

#### 感知变化
通俗点说，我们需要知道变量值改变的时刻。如何实现？借助defineProperty将目标变量变成响应式。写一个类实现之：
```javascript
class Obsever {
    constructor(vm) {
        this.vm = vm
        this.data = vm.$data
        this.obsever()
    }
    obsever() {
        const dep = new Dep()
        for (let key in this.data) {
            let val = this.data[key]
            Object.defineProperty(this.data, key, {
                enumerable: true,
                get() {
                    Dep.target && dep.addSub(Dep.target)
                    console.log('搜集依赖')
                    return val
                },
                set(newVal) {
                    console.log('触发以来')
                    val = newVal
                    dep.notify()
                }
            })
        }
    }
}
```
关于这个前面有文章详细介绍过，不赘述。总之一句话：**在get中搜集依赖，在set中触发依赖。**

#### 更新视图
我们捕捉到了值变化的时刻，然后就需要更新视图。很简单，无非就是模板编译那一套再拿来套一套。在模板编译代码中加几行，以compileText为例：
```javascript
    compileText(node) {
        const con = node.textContent
        // const con = '{{msg}}---{{info}}'
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            const newVal = con.replace(reg, (...arg) => {
                // arg[1]就是data中的变量名，此处为msg、info
                new Watcher(this.vm, arg[1], () => {
                    const xx = con.replace(reg, (...arg) => {
                        return this.vm.$data[arg[1]]
                     })
                    node.textContent = xx
                })
                return this.vm.$data[arg[1]]
            })
            node.textContent = newVal
        }
    }
```
在用正则匹配出模板中我们写的变量名时，new一个watcher。这个watcher的作用，就是当监听到变量改变时，执行update更新回调，代码如下:
```javascript
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.cb = cb
        this.oldVaL = this.getOldVal(key, vm)
    }
    getOldVal(key, vm) {
        Dep.target = this
        const oldVal = compileUtil.getValue(key, vm)
        Dep.target = null
        return oldVal
    }
    update() {
        this.cb()
    }
```
我们看到，watcher的私有变量三个，分别是vm、回调函数cb和旧值oldVaL 。getOldVal函数的执行，会触发目标对象属性的get函数，等同于订阅的动作。Dep.target赋值为this，这里的this，就是当前的watcher实例。注意obsever方法中的一行关键代码：
```javascript
Dep.target && dep.addSub(Dep.target)
```
**Dep.target暂存了wather实例对象，意思就是，订阅动作的触发，会把这个watcher实例塞入订阅者数组中。然后当我们改变变量值的时候，notify所有订阅者，所有的的订阅者会调用update也就是回调函数，更新页面内容。其中的dep也是一个类，如下所示：**
```javascript
class Dep{
    constructor() {
        this.subList = []
    }
    addSub(watcher) {
        console.log(watcher)
        this.subList.push(watcher)
    }
    notify() {
        console.log('当前的总wacther>>>', this.subList)
        this.subList.forEach((sub) => {
            sub.update()
        })
    }
}
```
实现我们改变变量值，更新视图的需求。本文毕。