---
title: Vue.js系列：Diff（patch）算法
date: 2023-09-06 00:48:13
category: 前端剑气双修专栏
---

### 本文尝试尽可能详细的介绍Diff(patch)算法的核心原理
#### 首先我们要知道,diff用来干嘛的？
比较新旧两节点的差异, 尽可能少的操作dom, 更新视图。


**更新页面的策略有两种**
- 其一：频繁操作dom
- 其二：将页面的所有节点，转化成AST，又称为虚拟dom表示，本质就是js的对象。然后通过一些算法，找出前后两者的差异，更新差异之后，再还原成真实的dom节点render。
区别在于： 第一种，改数据，render，改数据，render....第二种，改数据，改数据，改数据，改数据，改数据，render。

代码举例验证一个事实：频繁的操作数据，远快于频繁的操作dom，因为后者会增加一个额外的开销：**渲染**
```javascript
// 第一组
<script>
    const div = document.getElementById('123')
    console.time('1')
    for (let i = 0; i < 100000; i++) {
        div.innerHTML = i
    }
    console.timeEnd('1')
</script>
// 耗时：1: 126.406005859375 ms
// 第二组
<script>
    const div = document.getElementById('123')
    console.time('1')
    let content = 0
    for (let i = 0; i < 100000; i++) {
        content = i
    }
    div.innerHTML = content
    console.timeEnd('1')
</script>
// 耗时: 1: 0.6298828125 ms
```
性能比对，立竿见影。
**基于上面小实验的结论，我们知道了为啥要用diff算法，实际上就是尽可能少的操作真实dom，下面，我们就深入的聊聊。**

- **虚拟DOM**。DOM元素有元素节点（div）、文本节点（text）、注释节点等。vnode实际上就是这些节点的ADT（抽象数据类型）。
举例解释：
```javascript
<p>asdasdasd</p>
const vnode = {
  tag: 'p',
  data: {...} // 比如class、style等
  children: [...], // 儿子节点
  ....
}

// 注释节点
{
  text: '注释节点',
  isComment: true
}


// 文本节点
{
  text: '一段文本'
}
...
...
```
vnode就是一个类，这个类拥有比如tag、text、children等属性来描述实例化的vnode。仅此而已。
至此我们明白了虚拟DOM和真实DOM之间的映射关系，完成了第一步.


#### 触发时机： 组件创建时，以及依赖的属性或者数据变化时触发watcher，watcher运行一个函数，其会做两件事情：
1. 运行_render生成一个新的虚拟dom树
2. 运行_update，对新旧两节点作比较

```javascript
  const updateComponent = () => {
    this._update(this._render())
  }
```
到此，我们有了新旧两个虚拟dom对象。

**进入diff(patch)流程。**对比新旧节点的过程。

1. 判断两个根节点是否为`相同`节点
注释：`相同`的定义：`标签名称及key`是否相同~
当两个根节点不相同，就是标签名称和key不一致，以新节点为基准，删除旧dom创建新dom

2. 当两个根节点是同一节点
   将旧节点的真实dom赋值到新节点，对比新旧节点的属性，有变化的更新到真实dom，然后开始对比子节点

3. **对比子节点**
**双指针 + 递归**,原则就是：尽量移动而不是删除和创建
比对过程就是： 新前旧前、新后旧后、新后旧前、新前旧后。需要注意的是，如果四种都走完还没结束，那么此时，会以新节点的头指针所指节点为主，暴力的去旧节点中去找，是否存在。


<img src="/img/diff.image" alt="">
