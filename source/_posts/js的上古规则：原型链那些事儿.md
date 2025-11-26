---
title: js的上古规则:原型链那些事儿
category: 前端剑气双修专栏
date: 2023-08-03 15:39:41
tags:
---
### 本文目标：捋清原型链那一套
在《JS类型详论》的那篇文章中，我们有提到过`自有属性`和`原型属性`的概念。二者的区别，就是原型链存在的意义。
```javascript
const obj = {
  name: 'dddd'
}
console.log(obj.hasOwnProperty('constructor'))
console.log('constructor' in obj)
```
在上面的代码中，我们创建了一个对象obj，含有一个name属性。随后用两种方式打印constructor，很显然我们并没有看到constructor属性，但是，通过in的方式，打印出了true。为什么？我们说过in能够扫描的属性不单单是对象上显式写出来的属性`（自有属性）`，还包括了对象原型链上的`（原型属性）`。而此处的constructor，就存在于obj的原型对象中，所以打印出了true。
**具体查找流程**：发现自有属性没有，然后沿着obj的__proto__属性找到其原型对象，发现目标输出。倘若依旧没有，那就继续沿着原型对象的原型对象找。`直到世界尽头`。这，就是原型链。

### __proto__和prototype
首先我们需要搞清楚，这俩兄弟的关系。简单明了的说：**前者是实例对象的属性，指向其原型对象。而后者是构造函数的属性，指向该构造函数的原型对象。**

### new的时候，到底发生了啥？
此时，再思考一个面试必问的千年烂题，**当我们执行new的时候，到底发生了啥？**。关键就是两步：首先基于构造函数的原型对象，创建一个空对象，{}，此时该空对象的__proto___指向原型对象。然后调用call或apply执行构造函数的属性初始化，最后返回。详情见见代码：
```javascript
    const Parent = function(name, age) {
      this.name = name
      this.age = age
    }

    const myNew = function(...args) {
// 此处可以直接通过隐形arguments获取参数
      const target = args[0]
      const child = Object.create(target.prototype)
      let res = target.call(child, ...args.slice(1))
      return typeof res === 'object'? res: child
    }

    const child = new Parent('alice', 12)
    const child2 = myNew(Parent, 'alice', 12)
    console.log('child:', child)
    console.log('child2:', child2)
```

### 关于this指向问题
**简言之：谁调用它，就指向谁**
- 对象的方法调用： 指向对象
```javascript
const obj = {
  name: 'hhvcg',
  getName: function() {
    return this.name
  }
}
console.log(obj.getName())
```

- 普通函数调用: 只想全局window
```javascript
 window.name = 'hhvcg'
const f = function() {
  return this.name
}
console.log(f())
```

- 构造函数调用：指向构造函数的实例对象
```javascript
const f = function(name) {
  this.name = name
}

const child = new f('hhvcg')
console.log(child.name)
```
- apply、call。给的谁，指向谁

### 闭包的那些个事儿
**以最经典的防抖和节流功能为例。**
1. **防抖**： 不停的触发事件，我们这里具体指不停点击按钮，事件只执行一次。
```javascript
// html
    <a-button @click="debounce">click</a-button>
// js
    const f = function () {
      let timer = null as any
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
          log('click')
        }, 2000)
      }
    }
    const debounce = f()
```
不管我们点击多少次，清除之前点击设置的定时器，再次声明一个，只有当点击结束，才会执行最后的定时器。

2. **节流**：一个事件，鼠标不停点击，该事件会以固定时间执行。
```javascript
    // js
    const f = function () {
      let flag = true
      return function () {
        if (!flag) {
          return null
        }
        flag = false
        setTimeout(() => {
          log('click')
          flag = true
        }, 2000)
      }
    }
    const throttle = f()

// html
    <a-button @click="throttle">click</a-button>
```

我们把f函数的执行给到throttle，此时的throttle就是一个闭包函数。具体点讲，相当于在全局作用域上首先声明了一个flag，同时还有一个返回的函数。每当我们点击按钮时，都会执行返回的那个函数。

3. **IIFE**

**文章末尾祭出终极原理图，仅供参考**
<img src="/img/js原型链.webp" alt="js原型链" width="500">

