---
title: React系列：第十回(commit)
date: 2024-05-15 10:42:13
category: React系列
---

### 在前文中，我们介绍了基于所谓的fiber架构及requestIdleCallback实现的react快速渲染逻辑。本文中，我们介绍react的`commit`机制。

#### 1. 存在的问题
仔细观察下面的代码：
```javascript
const performUniteOfWork = (fiber) => {
  console.log('<<<<<<<<<<<<<<<<performUniteOfWork>>>>>>>>>>>>>')
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

fiber结构的生成及dom挂载，是同步进行的。这直接导致一个现象：`页面的渲染内容，实际上是按次序挂在到页面上的。` 但是很显然，我们希望可以等待点时间然后看到全部内容，而不是看到页面子啊一点一点的呈现。如何实现？`append隔离--commit`

#### 2. commit阶段
思路： `用一个wiproot变量，存储整个fiber，等待生成完成后，统一遍历这个wiproot，一次性生成`
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
const performUniteOfWork = (fiber) => {
  console.log('<<<<<<<<<<<<<<<<performUniteOfWork>>>>>>>>>>>>>')
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
    nextUniteWork = performUniteOfWork(nextUniteWork)
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

总体逻辑： **将fiber结构生成的过程及挂在阶段分隔开，先生成，在批量挂载**