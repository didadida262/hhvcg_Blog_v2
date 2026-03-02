---
title: React系列：第九回(concurrentmode、fiber)
date: 2024-04-23 00:18:07
category: React系列

---

#### 本文介绍，react快速渲染的基石：concurrentmode、fiber

#### 上一代版本存在的问题
在第一回中，我们通过手撕`myCreateElement`和`myRender`实现了基本的功能，但是仔细观察下之前写的render，是否存在什么问题？

```javascript
    const myRender = (element, container) => {
      const dom = element.type === 'text'? document.createTextNode(element.props.nodeValue): document.createElement(element.type)
      Object.keys(element.props).filter((item) => item !== 'children').forEach((item) => dom[item] = element.props[item])
      element?.props?.children?.forEach((child) => myRender(child, dom))
      container.appendChild(dom)
    }
```

render做的事情很清晰，**首先创建该节点本身，然后更新props参数，递归儿子节点，最后统一挂载**。现在设想一下，如果我们传入的是一个巨深的虚拟dom，那么会发生什么？render这个函数,`一旦开始执行，就会执行到底`。即：从首次执行render开始到最终挂载结束，期间的浏览器都是处于阻塞的状态。此时是无法响应任何用户的操作的，俗称`卡死`。而且，如果足够深，可能都走不到卡死，控制台直接`调用栈溢出`报错。

那么react底层是如何做优化的呢？答案也很清晰，利用一个类似api`requestIdleCallback`的效果，异步执行.

#### 打碎任务：requestIdleCallback
该函数的作用，就是能够观察浏览器在处理完每帧的工作之后，是否存在空余时间。如果有，就执行requestIdleCallback的回调，没有，则忽略。注意，这个就是大名鼎鼎的`Scheduler`的基石。 

因此，react能够做到快速的底层思路就有了：**把render的操作变成一个个的任务单元。**这些任务单元执行的前提条件是：**当前帧存在空余时间且存在任务单元，满足则执行，不满足下一帧继续判断执行。**

#### 题外话穿插：RAF
既然提到了`requestIdleCallback`,那就不得不再提一下另一个api：`requestAnimationFrame`。这个api我们之前讲屏幕刷新率的时候也提到过。那么两者有什么区别呢？
两者都会在每一帧执行注册任务，本质区别在于优先级：`raf注册的任务属于高优先级，尽力保证每一帧都会执行一次。而requestIdleCallback注册的任务则属于低优先级，只有当前帧存在剩余时间才会执行，有可能永远不执行。`

测试优先级：
```javascript
    const workLoop2 = () => {
      console.log('requestIdleCallback')
      requestIdleCallback(workLoop2)
    }
    requestIdleCallback(workLoop2)
    const workLoop1 = () => {
      console.log('requestAnimationFrame')
      requestAnimationFrame(workLoop1)
    }
    requestAnimationFrame(workLoop1)
```
效果如下：

<img src="/img/玩具react系列2_1.gif" alt="">

从实测效果来看，即使`raf`代码后执行，注册的任务优先级仍然高于`requestIdleCallback`,甚至还出现了raf执行了四次之后才执行了一次requestIdleCallback.

顺便提一下的这俩的一个细节：`deadline参数`

```javascript
    const workLoop2 = (deadline) => {
      console.log('requestIdleCallback')
      console.log('requestIdleCallback-deadline>>2', deadline)
      console.log('requestIdleCallback-deadline>>2-----', deadline.timeRemaining())

      requestIdleCallback(workLoop2)
    }
    requestIdleCallback(workLoop2)
    const workLoop1 = (deadline) => {
      console.log('requestAnimationFrame')
      console.log('requestAnimationFrame-deadline>>1', deadline)

      requestAnimationFrame(workLoop1)
    }
    requestAnimationFrame(workLoop1)
```

打印如下：
<img src="/img/玩具react系列2_2.jpeg" alt="">

**dealine用来提供额外的时间信息, 其中requestIdleCallback的deadline存在一个timeRemaining方法获取当前帧剩余时间**
react的底层并未通过`timeRemaining`获取剩余时间，而是自创了一套`schedule`,这个暂且不谈。

#### 借助requestIdleCallback改造实现
流程：
<img src="/img/玩具react2_3.png" alt="">

**总体思路**: 为了避免渲染时dom过深，导致渲染耗时过长甚至卡死， 借助requestIdleCallback，将之前render做的事情，分开执行。当前浏览器是否空闲（即有无剩余时间），有，则判断当前是否存在下一个任务单元，有则执行。执行过程中，无时间了，打断，有则继续执行。直至最后完毕。

#### Fiber
优势：可中断、可恢复、优先级。`Fiber架构对生命周期的影响`
<img src="/img/react9_1.png" alt="">

fiber本质也是一种数据结构，类似vnode。在vue中，`vnode --> 真实dom`，在react中， `vnode（ReactElement） --> fiber ---> 真实dom`。大概长下面这样：
<img src="/img/玩具react2_fiber.jpg" alt="">

#### 代码

```javascript

let nextUniteWork = null
const myCreateElement = (type, props, ...children) => {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => typeof child === 'object'? child: createTextNode(child))
    },
  }
}
const createTextNode = (child) => {
  return {
    type: 'text',
    props: {
      nodeValue: child,
      children: []
    }
  }
}
const createDom = (fiber) => {
  const dom = fiber.type === 'text'? document.createTextNode(fiber.props.nodeValue): document.createElement(fiber.type)
return dom
}
const performUniteOfWork = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
    console.log('fiber>>>',fiber)
    console.log('fiber.dom>>>',fiber.dom)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  const elements = fiber?.props?.children
  console.log('elements>>', elements)
  let preSibling = null
  elements?.forEach((childElement, index) => {
    const newFiber = {
      parent: fiber,
      props: childElement.props,
      type: childElement.type,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      preSibling.sibling = newFiber
    }
    preSibling = newFiber
  });
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

}
const workLoop = (deadline) => {
  let shouldYield = true
  console.warn('执行>>>loop')
  while (nextUniteWork && shouldYield) {
    console.log('执行>>>任务')
    nextUniteWork = performUniteOfWork(nextUniteWork)
    shouldYield = deadline.timeRemaining() > 100
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

const myRender = (element, container) => {
  console.log('element>>', element)
  nextUniteWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

```

#### 效果如下
  
<img src="/img/玩具react2_5.gif" alt="">


总体的逻辑就是：**深度递归的规则，一个节点一个节点的往深处走，然后不停会退直至扫完所有节点。在扫的过程中，创建fiber，创建dom，并立即将当前节点的 DOM 挂载到父节点的 DOM 上,更新，sibling，递归子节点**
注意：
- 1. react的底层实现中，因为存在兼容性的问题，并没有用**requestIdleCallback**，而是用的自己实现了的一套工具。
- 2. 这一版本，实际上把调和阶段和commit阶段混在了一起，事实上挂载dom是在最终的commit阶段才执行的。


#### **补充题：fiber的本质解决了什么问题？同样的问题，vue中是如何解决的？**

我发现上海那边很喜欢问这问题。fiber本质解决了长任务阻塞主线程的问题。在 Fiber 出现前，React 的协调（Reconciliation）过程是同步且不可中断的。当组件树庞大时，递归比对虚拟 DOM 会占用主线程较长时间，导致页面卡顿（无法及时响应用户输入、动画等）。

Vue 2：`通过异步更新队列`。数据变化后，DOM 更新不会立即执行，而是缓冲到队列中。在下一个事件循环（microtask）中批量处理，减少 DOM 操作次数。本质是优化更新频率，避免短时间内多次渲染
Vue 3：`引入基于 Proxy 的响应式系统 + 时间切片（Time Slicing）`。运行时采用类似 Fiber 的策略：将渲染任务分解，利用 requestIdleCallback 在浏览器空闲时执行，支持优先级调度，优先处理用户交互等关键任务