---
title: 'JS的转折分界: ES6'
category: 前端剑气双修
date: 2023-08-07 17:03:48
tags:
---

不管有没有系统的去学习ES6相关的概念，但我相信，在日常开发中，都或多或少的使用到了相关方法。笔者一直很纳闷，事实上ES6从发布至今也蛮长时间了，但是面试的时候总会有面试官问这么个问题：ES6有什么新的特性。。。。事实上这是因为该版本,对于js这门语言而言,具有里程碑的意义.**那么本文尝试着将最重大的改动梳理梳理.**

- 1. **首当其冲的必定是let、const块级作用域声明方式。**同var相比两个不同。块级作用域能够屏蔽var的变量提升，将变量的生命周期局限在块中。本质讲，var所谓的变量提升指的是用其声明的变量，会自动提升到作用域的顶部。
```javascript
const f = function () {
    if (false) {
        let name = '1234'
        //var name = '1234'
    }
    console.log('name:', name)
}
f()
```
**用var声明的name，打印是undefined，而用let打印的是not defined，error**

- 2. **模板字面量。**简单地讲，就是可以在字符串中灵活插入变量。如下面代码所示。变量用${}插入。同时需要注意的是` `中间的空格及换行，也会真实的展示出来。
```javascript
  const log = console.log.bind(console)
  let s = '123456'
  log(`number is ${s}`)
  log(`this is
  test`)
  // this is
  // test
```
- 3. **箭头函数。**这个概念也是面试必问的点。稍微总结一下他与普通函数的区别：(1)： 没有arguments、this、super等。(2)：不能通过new方法创建实例。因为没有consturct，也就不存在原型。
**箭头函数尤其需要注意的一点，就是函数内部的this指向。其实很简单，有最近一层非箭头函数决定。以我目前看，箭头函数的实质，乃代码装x之大杀器。**


- 4. **Object.is()。**这个方法提供了判断两值是否相等的终极大杀器。我们知道，在js中，判断相等通常会使用“==”和“===”。其中后者较为普遍，因为前者涉及隐含的类型转换，出现bug。但即使是“===”强等于判断，依然有问题。举例，NaN === NaN，实质上是一个东西，但返回的确实false。对于-0与+0，两者在js中是不同的，但返回的却是true。而用Object.is()来判断，完美符合真实情况。写到这里，笔者想说，在几乎所有的开发中，“===”基本能满足需求。而Object.is()这个方法的出现，我认为是js这门语言不断优化进步的体现。

- 5. **promise。**这东西实质上就是利用回调函数自己做了封装，看起来舒服点。

- 6. **关于proxy代理的理解（vue3中响应式数据原理）**
```javascript
const proxyUser = new Proxy(user, {
    get (target, prop) {
        console.log('get....')
        return Reflect.get(target, prop)
    },
    set (target, prop, val) {
        console.log('set....')
        return Reflect.set(target, prop, val)
    }
})
```
这里需要分清楚两个概念，上面代码中的目标对象user，和代理对象proxyUser，代理对象的改动就是改动目标对象。使用proxy对目标对象的内部数据劫持，并通过reflect操作对象的内部数据。

- 7. **生成器Generator**
直接说就是一种能够暂停、继续执行的函数。
```javascript
function* gen() {
    yield 'hello'
    yield 'hhvcg'
    return 'last'
}

const res = gen()
console.log(res.next())
console.log(res.next())
console.log(res.next())
console.log(res.next())

// 输出
{ value: 'hello', done: false }
{ value: 'hhvcg', done: false }
{ value: 'last', done: true }
{ value: undefined, done: true }

```
通过next执行，遇到yield停止。

**具体应用：**每隔一秒输出一个数字
- `定时器`
```javascript
// 每隔一秒输出一个数字

const f = () => {
    let i = 0
    setInterval(() => {
        console.log(i)
        i++
    }, 1000)
}

f()

- `generator`
function* printNumber() {
    let count = 0
    while (true) {
        count++
        yield count
    }
}

const iterator = printNumber()
setInterval(() => {
    const { value, done } = iterator.next()
    console.log(value)
}, 1000)
```

- 8. **装饰器decorator**
```javascript
function Strong(target) {
    target.AK = 'asdasd' 
}
@Strong
class Solider {
    constructor(info) {
        this.name = info.name
    }
}


const p = new Solider({name: 'hhvcg'})

console.log(p)

```
士兵拥有了ak属性

- 9. **Set、WeakSet、Map和WeakMap**
- `Set`: 无重复元素的集合，类似于数组
- `WeakSet`: 成员只能是引用类型，外部引用消失，WeakSet中的即消失。
- `Map`: 键值字典
  跟object差不多，打印出来就是一个对象，使用层面的区别在于，object的键只能是字符串、数字和符号，而Map可以是任意类型。工程级别的应用区别在于`性能`.首先`内存方面`，给定固定大小的内存，Map能够比object多存储50%的键值对。其次`插入、查找、删除`操作性能都优于object。
  
- `WeakMap`: Map的二弟
  与Map的区别在于这个Weak（弱）字儿，这种映射结构表示键是`弱弱的拿着`, 就是只要键不存在任何引用，就会被垃圾回收。其键只能是Object类型。没看懂？举个栗子：

  ```javascript
  const map = new Map()
  const dom = document.getElementById('#test')
  map.set(dom, { adisabled: true})

  const wmap = new WeakMap()
  const dom = document.getElementById('#test')
  wmap.set(dom, { adisabled: true})

  ```
  上面代码中，对于map而言，即使dom被删除了，map中依旧保留着数据，而对于wmap而言，一旦dom被删除没有任何其他地方引用，wmap中的内存就会立即释放。
