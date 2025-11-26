---
title: js的奇奇怪怪那些事儿
date: 2023-11-16 15:46:39
category: 前端气宗专栏
---

 ### 本文主要是记录一些关于js的奇奇怪怪的特性，题目为主

1. **原型链**
 ```javascript
function F() {}
Object.prototype.a = function() {
   console.log('a')
}
Function.prototype.b = function() {
  console.log('b')
}
const f = new F()
f.a()
f.b()
// 输出
// a
// Uncaught TypeError: f.b is not a function
 ```
解答：
- 因为f首先是一个对象，通过原型链找到a方法输出a
- 通过new方法出来的f，本质上是基于F构造函数的原型对象{}生成，所以无b方法

2. **js中的代码，是按顺序执行的吗** 
先说结论：作为单线程的语言，当然是一行行按顺序执行，但也并不完全是，为什么？因为有个叫变量提升的骚操作。

```javascript
// 事例1
showName()
console.log(myname)
var myname = '极客时间'
function showName() {
    console.log('函数showName被执行');
}
// 输出
// 函数showName被执行
// undefined

// 等价于：
var myname
function showName() {
    console.log('函数showName被执行');
}
showName()
console.log(myname)
vmyname = '极客时间'

```
解释：函数和myname都会被提升，但是var的提升只是告诉你有这么个变量，至于具体什么值，需要赋值阶段才知道。


```javascript
// 事例2
var name = 'World';
(function() {
  if (typeof name === 'undefined') {
    var name = 'Jack'
    console.log('Goodbay ' + name)
  } else {
    console.log('Hello ' + name)
  }
})()
// 输出结果：Goodbye Jack
```
解释： 立即执行函数执行时，内部定义的name发生了变量声明的提升，单位定义。倘若内部没有```var name = 'Jack'```这种骚操作，就会获取到外部的name走else。 

```javascript
// 事例3
function showName() {
    console.log('极客邦');
}
showName();
function showName() {
    console.log('极客时间');
}
showName(); 
// 输出：
// 极客时间
// 极客时间
```
解释：发生覆盖，以最新的为准。

```javascript
// 事例4
showName()
var showName = function() {
    console.log(2)
}
function showName() {
    console.log(1)
}
showName()
// 1 → 2
```
无需解释了吧。

```javascript
function bar() {
    console.log(myName)
}
function foo() {
    var myName = "极客邦"
    bar()
}
var myName = "极客时间"
foo()
// 输出：极客时间
```
解释： 作用域链。

**所谓的变量提升，是指在JavaScript代码执行过程中，JavaScript引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的undefined。**




3. **异步**
```javascript
async function async1() {
  console.log('A')
  await async2()
  console.log('B')
}
async function async2() {
  console.log('C')
}
console.log('D')
setTimeout(function() {
  console.log('E')
})
async1()
new Promise(function(resolve) {
  console.log('F')
}).then(function() {
  console.log('G')
})
console.log('H')
//输出顺序如下
// D → A → C → F → H → B → undefined → E


```
`注意`
- async/await 的本质是 Promise 的语法糖 ——await xxx 会先执行 xxx，然后将后续代码（await 之后的内容）放入微任务队列，暂停当前 async 函数，先执行后续同步代码。
- 并没有打印出`G`的原因在于，没有`resolve`

