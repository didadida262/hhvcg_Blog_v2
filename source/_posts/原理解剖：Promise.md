---
title: 原理解剖：Promise
date: 2023-09-11 10:42:59
category: 前端剑气双修

---

### 本文从原理层面介绍Promise（期约），同时通过手撕一个promise加深对其的理解

1. **首先我们要明白，这个promise到底是个啥？能用他来干嘛。**

Promise是一个类，因为他保证未来的某个时间点返回一个特定的不可更改的状态：成功或者失败，然后调用对应的then或者catch回调函数。
```javascript
const p = new Promise((resolve, reject) => {
    console.log('promise-start')
    resolve('asdasd')
    reject('xxx')
})

p.then((res) => {
    console.log('res>>', res)
})

p.catch((err) => {
    console.log('err>>', err)
})
```
本质上跟我们new一个对象是一样的，但是总感觉看着很变扭。从代码中可知，该类的入参是一个回调函数。new的时候，该回调函数立即执行。好了，既然是一个类，那我们就照葫芦画瓢，写一个类，同时在constructor立即执行回调。

```javascript
class MyPromise {
    constructor(exector) {
        exector()
    }
    
}
const p = new MyPromise((resolve, reject) => {
    console.log('promise-start')
    // resolve('asdasd')
    // reject('xxx')
})
// 打印结果
// promise-start

```

2. **resolve和reject**
两者分别对应成功和失败的状态。resolve就会走then的回调，reject就会走catch的回调。`注意，状态一旦确定，不可变更`
将resolve和reject给到callback,执行入参函数.然后调用then和catch方法时直接执行callback即可.
我们的diyPromise完整代码如下所示:

```javascript
class MyPromise {
    constructor(exector) {
        this.initData()
        this.initBind()
        exector(this.resolve, this.reject)
    }
    initData() {
        this.promiseResult = ''
        this.promiseStatus = 'pending'
    }
    initBind () {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }
    resolve(data) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'resolve'
            this.promiseResult = data
        }
    }
    reject(data) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'reject'
            this.promiseResult = data
        }
    }
    then(callback) {
        callback(this.promiseResult)
    }
    catch(callback) {
        callback(this.promiseResult)
    }
    
}

const p = new MyPromise((resolve, reject) => {
    console.log('promise-start')
    // resolve('asdasd')
    reject('xxx')
})
p.then((res) => {
    console.log('res>>>', res)
})
```

**3. 小试牛刀**
发起一个请求，如果1s内没有响应，发起第二个请求，3s内没有响应，发起第三个请求，这三个请求中，有一个请求响应成功则返回响应成功的结果

版本1: 回调地狱版

```javascript

let p1, p2, p3
p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      p2 = new Promise((resolve2, reject2) => {
        setTimeout(() => {
          p3 = new Promise((resolve3, reject3) => {
            fetchData(resolve3, reject3)
          })
        }, 3000)
      fetchData(resolve2, reject2)
      })
    }, 1000)
    fetchData(resolve, reject)
})

const fn = () => {
    return Promise.race([p1, p2, p3])
}
const fetchData = (resolve, reject) => {
    fetch('/api/getData')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
}
fn()
```
文毕。