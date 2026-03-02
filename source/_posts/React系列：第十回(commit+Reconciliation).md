---
title: React系列：第十回(commit+Reconciliation)
date: 2024-05-15 10:42:13
category: React系列
---

#### 本文将介绍隔离fiber两个阶段：`Reconciliation、Commit`

#### 前文的瑕疵
在上一篇文章中，我们介绍了基于fiber架构及requestIdleCallback，实现react快速渲染的demo.但是存在一点问题。仔细观察下面的代码：
```javascript
const performUnitOfWork = (fiber) => {
  console.log('<<<<<<<<<<<<<<<<performUnitOfWork>>>>>>>>>>>>>')
  console.log('fiber>>>', fiber)
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  const elements = fiber?.props?.children
    ...
    ...
    ...
}
```

fiber结构的生成及dom挂载，是同步进行的。这直接导致一个现象：`页面的渲染内容，实际上是按次序挂在到页面上的。` 但是很显然，我们希望可以等待点时间然后看到全部内容，而不是看到页面子啊一点一点的呈现。如何实现？`隔离commit阶段统一提交`。

#### Commit逻辑
`思路`： 用一个wiproot变量，存储整个fiber，等待生成完成后，统一遍历这个wiproot，一次性挂载
改造后的完整代码:
```javascript

let nextUniteWork = null
let wiproot = null
const createTextNode = (child) => {
  return {
    type: 'text',
    props: {
      nodeValue: child,
      children: []
    }
  }
}
const myCreateElement = (type, props, ...children) => {
    return {
      type: type,
      props: {
        ...props,
        children: children.map((child) => typeof child === 'object'? child: createTextNode(child))
      },
    }
  }
const createDom = (fiber) => {
    const dom = fiber.type === 'text'? document.createTextNode(fiber.props.nodeValue): document.createElement(fiber.type)
  return dom
}
const performUnitOfWork = (fiber) => {
  console.log('<<<<<<<<<<<<<<<<performUnitOfWork>>>>>>>>>>>>>')
  console.log('fiber>>>', fiber)
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }
  const elements = fiber?.props?.children
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
const commitWorker = (fiber) => {
  if (!fiber) return
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWorker(fiber.child)
  commitWorker(fiber.sibling)
}
const commitRoot = () => {
  commitWorker(wiproot.child)
  wiproot = null
}
const workLoop = (deadline) => {
  let shouldYield = true
  console.warn('执行>>>loop')
  while (nextUniteWork && shouldYield) {
    console.log('执行>>>任务')
    nextUniteWork = performUnitOfWork(nextUniteWork)
    shouldYield = deadline.timeRemaining() > 100
  }
  if (!nextUniteWork && wiproot) {
    console.log('wiproot>>>>', wiproot)
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

const myRender = (element, container) => {
  console.log('element>>', element)
  wiproot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  nextUniteWork = wiproot
}

```

总体逻辑： **将fiber结构生成的过程及挂载阶段分隔开，先生成，再批量挂载。**


如果细看代码会发现，首先，本版本中我们只是把挂载放到commit阶段，且截止到目前为止的三个版本中，还没有涉及到调和阶段。下一章中，我们将对该阶段进行补充。

#### Reconciliation
所谓Reconciliation（调和），就是`数据更新后生成「新的虚拟 DOM」，React 以这个新虚拟 DOM 为 “数据源”，对比「旧 Fiber 树（current 树）」来构建「新 Fiber 树（workInProgress 树）」，并在构建过程中标记差异`。这个定义是我目前看到的最准确的定义，没有之一。每次fiber节点的对比，会根据情况给fiber打上对应的tag，就是所谓的effectTag，例如`placement、update、deletion`等，然后在commit阶段，根据对应的effecttag，修改真实的dom。


