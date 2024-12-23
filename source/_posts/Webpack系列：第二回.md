---
title: Webpack系列：第二回(前端模块化迭代史)
category: Webpack系列
date: 2023-07-24 22:23:35
tags:
---

### 前端模块化的演进历程
模块化是webpack的基石，本文就尝试着缕一缕。

####  阶段一：文件划分
最原始的方法就是文件划分。其具体操作就是第一回中我们举的a、b、c三个js文件的例子。

``` js
//  文件内部结构：
var x = 100

function A() {
    ...
}

function B() {
    ...
}
```
然后通过script标签引入：
```js
    <script src="./moduaA.js"></script>
    <script src="./moduaB.js"></script>
    <script src="./moduaC.js"></script>
```
该方法的弊端显而易见，所有模块共用全局作用域，变量全局污染，命名冲突在所难免。，且模块之间的依赖关系难以控制。

#### 阶段二：命名空间
同样还是三个文件，只是文件内部的所有内容，都是用一个对象包裹，对外使用时则通过这个对象。
```js
var modulA = {
    x = 100,
    methodA: function A() {
        ...
    },
    methodB: function B() {
        ...
    }
}
```
相比较第一种，极大避免了变量的全局污染，但是，外部依然可以随意改变模块内部的值。

#### 阶段三： IIFE:立即函数表达
通过闭包，实现模块内部的变量方法的私有化。隐藏该隐藏的，暴露该暴露的。
```js
const obj = (function () {
    let name = 'hhvcg'
    let old = 11
    return {
        tell: function() {
            console.log('i am--->:', name)
        }
    }
})()
obj.tell()
console.log(obj.name)

// 标准早期写法
(function (window) {
    let name = 'hhvcg'
    let old = 11
    function tell() {
        console.log('i am--->:', name)
    }
    window.modulA = { tell }
})(window)
```

##### 上述的三种方案基本被淘汰。目前的实际开发中，前端基本是遵循es6标准，后端如果是nodejs的话，使用的就是commonjs。

#### 阶段四：ES6 Module终极方案
大家应该都很熟悉了，就不举例了

那么为什么webpack系列文章，要提一提前端模块的发展史呢？`原因在于`，注意阶段三的`IIFE`实现的模块机制。大家可以留意一下webpack打包出来的bundle.js代码，**尽管很乱但是，重点在于，webpack的打包js产物，实质就是一个IIFE。**
