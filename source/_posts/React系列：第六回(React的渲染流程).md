---
title: React系列：第六回(React的渲染流程)
date: 2024-03-22 13:57:57
category: React系列
---

### 本文简单聊聊React的渲染流程

在前面介绍vue的系列文章中，我们通过手写vue类的方式，将vue的渲染流程基本介绍了，其框架底层的逻辑如下：
- `初次加载时`， 数据的响应式处理和模版编译，完成初始化页面的显示。所谓`数据的响应式`就是让我们能够知道，什么地方用到了数据，然后在数据变化时，通知那些用到该数据的地方重新编译。而模版编译则是将模版代码转换成html代码，让页面能够显示
- `状态数据变化时`， 以更新数据后的新虚拟dom和旧的虚拟dom为输入，经过diff和patch，找出差异， 更新差异，最后重新渲染

**一. 那么在react中， 这个过程又是如何的呢？**
实际上无论什么前端框架，其渲染的逻辑都是一致的，只是实现的方式不同，react亦是如此。
- `初次加载时`，JSX代码解析 --> 生成虚拟dom --> 挂载显示页面
- `状态数据变化时`，修改状态setstate --> 生成新的虚拟dom --> update(旧Vnode 新Vnode) --> diff + patch  --> 挂载显示页面

**二. Fiber**
react16.8之后，用`fiber`取代了`stack reconciler`，同时还引入了`hook`。核心设计是增量渲染，将渲染工作分割为多区块，将其分散到多个帧中去执行。

reconciler diff VDOM --> create DOM `同步`



react16.8提供的新的架构， fiber.
<img src="/img/react第六回_1.png" alt="">

- `同步不可中断的执行--> 异步可中断`
- `新增scheduler 任务优先级`

**1. 初始化阶段**
输出链表结构fiber树

**2. render阶段**
找出界面中需要处理的更新

**3. commit阶段**
1. compelteWork： 负责处理fiber节点到dom节点的映射逻辑，人话就是，根据虚拟dom，生成真实dom
- 创建dom节点
- 将节点插入到dom树中
- 为dom节点设置属性
- appendAllChildren函数完成插入操作

创建好的dom节点元素会被复制到workInprogress节点的stateNode属性，子节点的插入，实际上就是插入到父节点的stateNode中




<!-- 

1. `Stack Reconciler`

2. `Fiber Reconciler`

一. 官方团队通过fiber，对react底层的算法进行了重写
fiber节点， 实际上就是虚拟dom，用来描述真实dom的一种ast。

 `ReactDOM.createRoot开启异步渲染`
1. stack reconciler（栈调和）被fiber（纤程）取代
reconciler（diff）负责找不同，render负责渲染不同

2. 所谓`纤程`，是指比线程更加细小的单位

3. Fiber的核心： `可中断、可恢复与优先级`

4. react.render之后发生了啥

5. react的setstate之后， 发生了啥？
6. current树及workinprogress树
fiber结构的虚拟dom结构，说他是一个树结构，不如说是一个链表结构。通过child、return、sibling指向儿子、父亲和兄弟节点





**二. 事件切片和优先级**

1. `双缓冲模式`
两个舞台，无缝切换
`current树`和`workInprogres树`无缝切换

2. `时间切片`
通过schedule将long任务切片处理，以免任务阻塞渲染进程。


react的渲染流程

