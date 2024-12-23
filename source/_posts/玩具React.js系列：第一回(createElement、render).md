---
title: 玩具React.js系列：第一回(createElement、render)
date: 2024-04-14 21:48:26
category: React系列

---

**本系列文章的目标，就一个，类似于vue的学习过程，我们尝试手写react的重要组成部分，以便更为彻底的理解其底层实现。**
涉及的内容包括：`createElement、render、cocurrent mode、fiber、render commit、reconcilliation及function components。`

**文本介绍createElement和render**

### 先看看react的使用
```javascript
    const content = React.createElement(
        'div',
        {
        title: 'title',
        id: 'id',
        },
        '川崎重工'
    )
    console.log('content>>>', content)
    const root = ReactDOM.createRoot(
        document.getElementById('root')
    );
    root.render(content)
```

从上面代码不难看出，通过调用`createElement`，会生成一种dom的数据结构，具体长啥样根据入参决定。这一块的内容我们之前在介绍vue底层时有提到过，他们都是根基于一个库`snabbdom`.**就是通过结构化的数据， 去描述dom节点**。然后做的事情就是`render`, 将结构化的数据转换成真实的dom，挂载到页面中去。具体长这样：
<img src="/img/reactjs系列1_0.jpg" alt="">

效果：
<img src="/img/reactjs系列1_1.gif" alt="">


### 了解了其所做的事情，那么接下来，我们来diy实现之
`createElement`实现很简单，根据入参，生成一个对象并返回，这个对象我们称之为**虚拟dom**
```javascript
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
    const VNode = myCreateElement(
      'div',
      {
        title: 'title',
        id: 'id'
      },
      '一段文本....川崎重工'
    )
    console.log(VNode)
    
```

`render`

```javascript
    const myRender = (element, container) => {
      const dom = element.type === 'text'? document.createTextNode(element.props.nodeValue): document.createElement(element.type)
      Object.keys(element.props).filter((item) => item !== 'children').forEach((item) => dom[item] = element.props[item])
      element?.props?.children?.forEach((child) => myRender(child, dom))
      container.appendChild(dom)
    }
```

效果如下：

<img src="/img/react_toy1_2.gif" alt="">

文毕。

<!-- `代数效应`: 看了tm一圈，愣是没看懂。 -->





