---
title: Vue.js系列：对象的变化侦测
category: 前端剑气双修专栏
date: 2023-08-07 22:39:40
tags:
---
对于对象属性的变化侦测，是vue响应式的核心。其本质需要实现的功能：**当改变对象某属性值的时候，我们需要捕捉到这个变化。**那么vue是怎么做到的？**defineProperty**

前端目前三大框架三分天下，实现响应式的方式却各有不同。angular、react属于”pull（拉）“，而vue则属于”push（推）“。两者的区别在于，拉的方式是被动的，推的方式则是主动的。当我们改变了某个对象的某个值之后,`对于前者而言，框架能够知道,某些状态发生了变化但是不知道具体谁发生了变化，所以此时会暴力的对比找出变化的状态，而对于后者而言，当属性值改变后，会把这个改变了的状态主动告诉框架。然后框架去通知这个状态的所有依赖`。这就是为什么vue的响应式被称之为“**细粒度**”的响应式。

具体实现：
```javascript
const definePropertyReactive = (obj, key, val) => {
  Object.defineProperty(obj, key, {
    get() {
      console.log('val>>', val)
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      console.log('name值被改变')
    }
  })

}
const obj = {
  name: 'hhvcg'
}
const val = obj.name
definePropertyReactive(obj, 'name', val)
obj.name = 'asdasd'
// obj.name = 'asdasdasd'
```
我们给defineProperty的外层包了一层definePropertyReactive，用来存储val。对于任何一个对象，都可以用defineProperty来定义get和set。当我们读取某个对象的某个属性值时会触发get。改变该值的时候就会触发set。因此，为了实现响应式，本质就是“**在get中搜集依赖，在set中通知依赖**”。

上面所说的依赖有点抽象，实质就是使用了该值的地方，比如某个组件，某个watch监听。这些依赖，我们可以简单地用一个数组来存储，于是有了下面的版本：
```javascript
const definePropertyReactive = (obj, key, val) => {
  let dep = []
  Object.defineProperty(obj, key, {
    get() {
      console.log('val>>', val)
      dep.push('张三')
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      dep.forEach((suber) => {
        suber.notify()
      })
      console.log('name值被改变')
    }
  })
}
```
当然，vue2的实现，并不是简单的如上面所示的用个数组去存储所有的依赖，然后遍历通知(notify)。实际上在这中间加了一层watcher中转层。**就是由watcher搜集变化，然后挨个通知所有的依赖**。

我想稍微懂点设计模式的同学已经看出来，这里的实现，实际上就是一个典型的发布订阅模式。
好了，我们目前为止，只是实现了对象的某个属性的响应式，下面要做的很显然，就是将对象的所有属性变成响应式的。方法很清晰：遍历执行上述操作。如下代码所示：
```javascript
class Observer {
  constructor(obj) {
    this.obj = obj
    if (!Array.isArray(obj)) {
      this.walk(obj)
    }
  }
  walk(obj) {
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      definePropertyReactive(obj, key, obj[key])
    })
  }
  
}

const definePropertyReactive = (obj, key, val) => {
  if (typeof obj[key] === 'object') {
    new Observer(obj[key])
  }
  let dep = []
  Object.defineProperty(obj, key, {
    get() {
      console.log('val>>', val)
      dep.push('张三')
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      dep.forEach((suber) => {
        suber.notify()
      })
      console.log('name值被改变')
    }
  })

}

const obj = {
  name: 'hhvcg'
}
const val = obj.name
definePropertyReactive(obj, 'name', val)
obj.name = 'asdasd'
// obj.name = 'asdasdasd'
```
注意两点，我们在Observer中需要加一个非数组的判断。同时在definePropertyReactive中判断属性值是否也为对象，是则递归walk处理。

**vue2的问题：**
我们都知道vue3版本与2版本很大的一个变动就是响应式。vue3用proxy取代了defineProperty。为什么？
**其一**: 就是你需要提前确定好key。这导致了删除和新增属性的操作，无法监听到。官方的解决方案$set和$delete
**其二**：如果监听的某个对象很深，如下面所示，为了监听就需要递归的处理，这会带来性能的问题。
```javascript
const obj = {
  a: {
    b: {
      c: {
        d: {
          ...
        }
      }
    }
  }
}
```
**文毕**

