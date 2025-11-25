---
title: Typescript备忘录
date: 2023-08-28 23:57:30
category: 前端气宗专栏
---

#### 本文纯属ts的内容备忘录
**ts能干嘛？**将弱类型的js，变为强类型的语言。
举例:
```javascript
const fn = (str: string) => {
    console.log(str)
}
fn([1,2,3,4])
// err
```
示例代码中，我们声明的msg是一个数组，但是我们通过类型注解，规定fn的参数应该是一个字符串，配合一些插件工具，显示报错。

那么ts还有其他什么特性吗？
#### 接口，一种声明的约束
```javascript
interface Role {
    name: string,
    blood: number
}
interface Role2 {
    name: string,
    old?: number,
    readonly sex: string
}
const role: Role = {
    name: 'hhvcg',
    blood: 100
}
```
同一类似，如果role的某些字段，类型同接口定义的不一致，会报错。同时写代码的时候，有字段提示的功能。如果说需要某些字段是可选的，加？即可。如果需要某些字段是只读的，加readonly。

#### 数组与元组类型
```javascript
// 数组
const arr: number[] = [1,2,3,4]
const arr2: Array<number> = [1,2,3,4]

// 元组,跟python很像
const tuple: [number, string] = [1, 's']
```
元组类型，跟对象有毛区别？？？感觉有点脱裤子那啥的味道

#### 枚举
```javascript
enum Role {
    police,
    army,
    soldir,
    nurse
}
console.log(Role.police)
```
没啥好说的，Role.police的值是0，默认0，1，2......

#### implements
这个东西的作用,个人觉得就是一种约束，如下所示：
```javascript
interface Role {
    say()
}

interface Role2 {
    say2()
}

class test implements Role, Role2 {
    say() {
        console.log('1')
    }
    say2() {
        console.log('2')
    }
}
```
简写形式

```javascript
interface all extends Role2, Role {}
class test2 implements all {
    say() {

    }
    say2() {}
}
```

#### 继承
```javascript
class Person {
    name: string
    old:number
    constructor(name: string, old: number) {
        this.name = name
        this.old = old
    }
    say() {
        console.log('父类方法')
    }
}
// 子类调用父类用super
class Student extends Person {
    constructor(name: string, old: number) {
        super(name, old)
    }
    say() {
        super.say()
    }
}
```
#### type
```javascript
// 联合类型
type some = number | string
const x: some = 1
...
...
...
// 接口交叉：同时具备 User 和 Contact 的所有属性
interface User {
  id: number;
  username: string;
}

interface Contact {
  phone: string;
  email: string;
}

type UserWithContact = User & Contact; // 交叉类型：User 且 Contact
```
`其与接口的区别，后者只能够定义对象类型，而前者除了对象类型，还能用来定义交叉、联合类型等`

#### 同js的区别

增加了新的数据类型： 
any： 任意类型
void：没有返回值，例如函数
enum：
```javascript
enum Color { red, green, blue }
const x: Color = Color.red
```
never: 通常用来声明错误
```javascript
let a:never
a = (() => {
    throw new Error('err)
})()
```
tuple:
```javascript
const arr: [string, boolean] = ['asd', true]
```