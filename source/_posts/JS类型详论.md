---
title: JS类型详论
category: 前端剑气双修专栏
date: 2023-08-03 14:47:06
tags:
---

### 本文主旨： 极尽一切可能的，详细介绍js类型相关内容

#### 主要数据类型两类
- 基本类型： 变量存储值
数字、布尔、undefined、null、字符串、Symbol
- 引用类型：变量存储地址，类似于c语言中的指针
函数、数组、对象

#### 判断数据类型
1. typeof： 能够判断除了null和数组的所有数据类型
```javascript
console.log(typeof 'a')
console.log(typeof true)
console.log(typeof Symbol())
console.log(typeof undefined)
console.log(typeof null)
console.log(typeof {})
console.log(typeof function() {})
console.log(typeof [])
// 结果
string
boolean
symbol
undefined
object
object
function
object
```

2. instanceof: 实话讲，该方法用的并不多，因为他明显没有typeof用的舒服，且他并不是用来做类型判断的。判断一个对象是否为另一个构造函数的实例。那么因为数组既是对象类型也是数组类型，因此，下面代码均会返回true
```javascript
    console.log(a instanceof Object)
    console.log(a instanceof Array)
```

3. constructor: 判断变量的构造器
```javascript
console.log('a'.constructor)
console.log(true.constructor)
console.log(Symbol().constructor)
// console.log(undefined.constructor)
// console.log(null.constructor)
console.log({}.constructor)
console.log(function() {}.constructor)
console.log([].constructor)
// 结果
[Function: String]
[Function: Boolean]
[Function: Symbol]
[Function: Object]
[Function: Function]
[Function: Array] //打印出来等同于 Array
除了undefined和null没有constructor，其他均打印出了各自的原型对象，包括数组。
```
4. Object.prototype.toString.call: 该方法最为彻底。能够打印变量的真实原型对象
```javascript
console.log(Object.prototype.toString.call('123'))
console.log(Object.prototype.toString.call(123))
console.log(Object.prototype.toString.call(true))
console.log(Object.prototype.toString.call(undefined))
console.log(Object.prototype.toString.call(null))
console.log(Object.prototype.toString.call(Symbol(123)))
console.log(Object.prototype.toString.call(function() {}))
console.log(Object.prototype.toString.call([1, 2, 3, 4]))
console.log(Object.prototype.toString.call({}))
// 结果
[object String]
[object Number]
[object Boolean]
[object Undefined]
[object Null]
[object Symbol]
[object Function]
[object Array]
[object Object]
```
**总结**：typeof最为便捷，若要判断数组，可以用constructor、tostring和Array.isArray(item)、instance方法。关于null，可以使用if(typeof x !== undefined && !x)结合判断。

5. 事实上上面我们列举的九种数据类型并不是全部。比如还有类数组（能够像数组哪像通过下标获取值，也有length就是没有数组的那些api），NaN（一种不知道为何存在的值， (NaN === NaN) 输出false）等。同时还有与ts的强类型加持，还有什么any、never等等等。

6. 以为精通了数据类型？来小试牛刀一下：
```javascript
let x = '123'
console.log(x instanceof String)
```
猜一猜输出会是啥？
答案是false。原因我们之前说过，instanceof方法是用来判断一个对象是否为另一个构造函数的实例。那么此处怎么让他输出true呢？很简单：
let x = new String('123')

7. js中值为false的情况：
数字0、false、undefined、null、NaN和空字符串''。注意是空字符串，哪怕多一个空格字符都不行。

8. console.log('3' + 3)的输出是啥？
'33'。js会默认将数字3转换成字符串。

9. 又觉得自己很懂了？再来看一个例子：
```javascript
  // jsone.js
  import { change } from './jstwo'

  let obj = {
    name: 'hhvcg'
  }
  change(obj)
  console.log('obj:', obj)

// jstwo.js
  const change = (obj) => {
      obj.name = 'chnaged'
      return 1
  }

  export { change }
  // 输出：
  obj: {name: 'chnaged'}
```
有没有被无语到。。。。。。

事实上，通过本文上面的知识，这种情况我们已经能够解释，因为obj是一个对象，可以看成是指针，把这个对象通过参数传递出去，在change中做的改变就是改变的原来的obj，因为不管change定义的参数名是啥，他都是跟obj一样的指针，指向的是同一个数据。
**但是，我必须说但是，这种骚操作，实在让我暂时无法接受。我想，学过c/c++或者其他主流语言的同学，看到这一幕，可能会一脸懵逼吧。。。这个东西类似于c语言中的指针，但是，也太随便了。**


10. map和对象

```javascript
// 对象示例
const obj = {
  name: "Alice",
  age: 30
};

// Map示例
const map = new Map();
map.set("name", "Alice");
map.set("age", 30);
map.set({}, "这是一个对象作为键"); // 合法
```
表现形式都是一个对象，有稍微的区别。map的键可以是任意类型，甚至是‘{}’，对象则只能是字符串/Symbol

11. 最后一点补充： 对象的属性值判断方法。

in和hasOwnProperty都可以用来判断一个属性是否在对象中存在但是，前者能够判断自有属性和原型属性，而后者，只专注于自有属性。所以，hasOwnProperty更加的专业。自行测试下面代码。
```javascript
const obj = {
  name: 'dddd'
}
console.log(obj.hasOwnProperty('constructor'))
console.log('constructor' in obj)
```


### js的深拷贝与浅拷贝
这个话题是因为引用类型触发的。所谓深拷贝，就是完全复制，而浅拷贝，是创建一个新的对象或者数组，新对象或者新数组与原对象或者数组的引用相同。
直接上代码：
```javascript

const obj = {
    a: 100,
    b: {
        x: 1000
    },
    c: [1,2,3,4]
}

// 浅拷贝
// 方1 扩展运算符号
const obj2 = {
    ...obj
}

obj2.b.x = 10
console.log(obj)
{ a: 100, b: { x: 10 }, c: [ 1, 2, 3, 4 ] }

// 方2
const shallowCopy = Object.assign({}, originalObject);


// 深拷贝
const deepClone = (obj) => {
    const res = {}
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue
        // 还有Date、正则等特殊类型
        if (Array.isArray(obj[key])) {
            res[key] = obj[key].map((item) => {
                if (typeof item === 'object') {
                    if (!obj[key]) {
                        return null
                    } else {
                        return deepClone(item)
                    }
                } else {
                    return item
                }
            })
        } else if (typeof obj[key] === 'object') {
            if (!obj[key]) {
                res[key] = null
            } else {
                res[key] = deepClone(obj[key])
            }
        } else {
            res[key] = obj[key]
        }
    }
    return res
}

const res = deepClone(obj)
res.c[0] = 222222222222222222
console.log('res',res)
console.log(obj)
// res {
//     a: 100,
//     b: { x: 222222222222222200 },
//     c: { '0': 1, '1': 2, '2': 3, '3': 4 }
//   }
//   { a: 100, b: { x: 1000 }, c: [ 1, 2, 3, 4 ] }
```


当然，最最简单粗暴的深拷贝：`JSON的序列化反序列化大法。`


