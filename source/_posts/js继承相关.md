---
title: JS继承相关
category: 前端剑气双修专栏
date: 2023-08-21 11:04:11
tags:
---

### 本文介绍js继承的几种方法

#### 1. 原型链继承
利用js的原型链，访问实例对象上不存在但是原型对象中存在的属性和方法。缺点就是假继承。父类的引用属性是共享的。
```javascript
const Parent = function () {
    this.name = 'parent'
    this.children = ['son1', 'son2']
}
Parent.prototype.getChildren = function() {
    console.log('儿子们:', this.children)
}

const Children = function () {
    
}

Children.prototype = new Parent()
const child = new Children()
child.children.push('bitch')
child.getChildren()
const child2 = new Children()
child2.children.push('bitch2')
child2.getChildren()
child.getChildren()

// 儿子们: [ 'son1', 'son2', 'bitch' ]
// 儿子们: [ 'son1', 'son2', 'bitch', 'bitch2' ]
// 儿子们: [ 'son1', 'son2', 'bitch', 'bitch2' ]
```
创建的child实例是通过new Children得到的，new操作符的内部会做两件事，基于构造函数原型创建一个空对象，然后改变this指向让属性私有化。因为我们将Children构造函数的原型对象改成了Parent的一个实例，那么，当我们通过new Children得到的对象，其_proto_实际指向Parent的原型对象。即：new Children得到的所有实例，继承得到的该属性都是Parent构造函数的原型对象拥有的，仅此一份，大家共有。
**缺点**：通过原型链实现继承，缺点显而易见，祖父对象的引用类型属性值，都是子孙公共访问与更改的。因为子孙对象不管是使用祖先的方法还是属性，改的都是祖先构造函数的原型对象。**注意：原型对象的方法能够访问，但是引用类型共享**


#### 2. 构造函数继承

```javascript
// 2. 借用构造函数：子构造函数call到父类
const Parent = function () {
    this.name = 'baba'
    this.children = ['son1', 'son2']
    this.getChildren = function () {
        console.log('儿子们：', this.children)
    }
}

const Children = function(...args) {
    //call等方法，类似于class中的constructor函数，自动初始化
    Parent.call(this, ...args)
}

const child1 = new Children()
child1.children.push('bitch1')
child1.getChildren()
const child2 = new Children()
child2.children.push('bitch2')
child2.getChildren()
child1.getChildren()
```
该方法，实际上通过调用call方法改变了this指向。避免了引用类型的属性被所有实例共享。缺点：该方法得到的实例对象，无法访问父类原型对象上的方法


#### 3. 组合继承
**利用原型链继承获得父类原型对象上的方法，通过构造函数继承实例化私有属性**
```javascript
    const Parent = function(){
        this.children = ['son1', 'son2']
    }

    Parent.prototype.getChildren = function () {
      return this.children
    }
    const Children = function (...args) {
      Parent.call(this, ...args)
    }
    Children.prototype = Parent.prototype
    const child = new Children()
    const child2 = new Children()
    console.log('child.__proto__', child.__proto__)
    child.children.push('nima')
    child2.children.push('nima2')
    console.log('child.getName():', child.getChildren())
```
缺点：
1.通过打印发现实例的构造函数不是Children，而是Parent
2.调用两次Parent，据说影响性能

#### 4.组合继承改进版本--寄生继承
```javascript
    const Parent = function(){
        this.children = ['son1', 'son2']
    }

    Parent.prototype.getChildren = function () {
      return this.children
    }
    const Children = function (...args) {
      Parent.call(this, ...args)
    }
    Children.prototype = Object.create(Parent.prototype)
    Children.prototype.constructor = Children
    const child = new Children()
    const child2 = new Children()
    console.log('child.__proto__', child.__proto__)
    child.children.push('nima')
    child2.children.push('nima2')
    console.log('child.getName():', child.getChildren())
```
主要是当我们打印实例的构造器constructor，能够返回Children而不是Parent。

#### 5. es6继承
```javascript
class Parent {
    constructor (props) {
        this.name = props
    }

    getName () {
        console.log(this.name)
    }
}

class Children extends Parent {
    constructor (name, old) {
        super(name)
        this.old = old
    }

    getOld () {
        console.log(this.old)
    }
}
const child = new Children('hhvcg', 12)
child.getName()
child.getOld()
```
**完结散花**