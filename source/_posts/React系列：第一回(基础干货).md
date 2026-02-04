---
title: 'React系列: 第一回(基础干货)'
date: 2023-10-24 23:13:23
category: React系列
---

**自本文开始，我们将逐步介绍react相关的所有内容。**

#### 是啥
一个标准的`数据驱动视图`的前端开发框架。`整体逻辑如下：`
<img src="/img/react1_1.png" alt="">

#### 带来了啥？
- `声明式编码 + 虚拟dom + diff算法`，一种编程范式，关注的是你要做什么，而不是如何做。主要区别之前jquery时代的开发模式，专注功能逻辑的开发，而无需关注dom实现。
- 组件化开发。基本标准：**可组合、可维护、可复用**
- react-native中，使用js开发`移动端应用`

#### jsx语法
`JavaScript 中夹杂着 HTML 的语句在其中`,称之为jsx语法，它是对 JavaScript 语法的扩展，jsx代码经过babel编译后，会生成React.createElement的调用，本质是React.createElement的语法糖。为了生成虚拟dom，两种写法：

```javascript
// jsx
const element = <h1 className="title">Hello, React</h1>; 
 + babel转换后，等同于下方 ↓

// React.createElement
const element = React.createElement(
  'h1',                // 标签名/组件
  { className: 'title' },  // 属性（props）
  'Hello, React'       // 子元素（children）
);
```
其中的React.createElement做的事情很清晰，他有三个参数type、config和children。顾名思义，分别代表节点类型如`div`、节点所有属性如`className`和节点的子节点。就是说以jsx文件代码为输入，编译生成虚拟dom，然后通过render方法生成真实的dom节点。

#### 渲染逻辑
贴一张react的渲染逻辑图。
<img src="/img/react1_2.png" alt="">

- `初始渲染`：JSX 编译 → React.createElement调用 → 执行调用生成虚拟 DOM → 基于虚拟 DOM 构建 Fiber 树 → 提交（Commit）阶段：根据 Fiber 树创建真实 DOM 挂载到页面 → 执行副作用。
- `更新渲染`：状态变化，触发重渲染 → 生成新的虚拟 DOM → 进入调和阶段：基于新虚拟 DOM 和旧 Fiber 树做 Fiber Diff（对比新旧节点，标记 “副作用”） → 构建出新的 Fiber 树（workInProgress 树） → 提交阶段：仅将 Fiber 树中标记的差异部分更新到真实 DOM → 执行副作用


#### 条件渲染
类似于vue中的v-if，jsx 中的写法如下：
```javascript
const Example = () => {
  // 条件判断，随机显示男女
  const greater = Math.random() * 10 > 5;
  return (
    {greater > 5 ? (
      <div style={{ color: 'green' }}>我是男生</div>
    ) : (
      <div style={{ color: 'red' }}>我是女生</div>
    )}
  );
}
```

#### React函数组件
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
// 定义 App 组件 props 的类型
type Props = {
  name?: string;
}
// 定义一个叫App 的组件
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name || '未知名字'}
      </h1>
    </div>
  );
}
// 找到组件将要渲染的 html tag 位置（使一个 id ="root" 的标签）
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/*大家关注下面的一行，渲染上面写的组件App */}
    <App name={"xx"} />
  </React.StrictMode>
);

export default App;

```
react中的组件实际有两种方式：`函数组件和类组件`，目前公司业务普遍选择前者，后者默认已成历史。
**两者的区别**
1. 两者作为组件一致，
2. 类组件的根基时oop，面向对象编程，函数组件的根基时fp，即函数式编程,前者有this，后者无；前者可以访问生命周期方法，后者不能。
3. 类组件通过`shouldComponentUpdate`阻断渲染，函数组件通过React.memo
4. `组合优于继承`，函数组件低耦合逻辑代码包括生命周期，更加的灵活。


几个函数组件的错误案例：
```javascript

type Props = { // 不了解ts的话，可以忽略下面的Props
  name?: string;
}
// 变量声明写在了return中
function App(props: Props) {
  return (
    const tmp = '123';
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
}
// 函数写在了return中
function App(props: Props) {
  return (
    function tmp() {};
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
}
// 同1
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name}
      </h1>
    </div>
  );
  // 这个跟其他语言一样，return 之后不会执行
  const a = 123;
}
```

更进一步的看个样例，让页面交互起来：
```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

type Props = {
  name?: string;
}
function App(props: Props) {
  return (
    <div className="App">
      <h1 style={{ color: 'red', textAlign: 'center' }}>
        Hello {props.name || '未知名字'}
      </h1>
    </div>
  );
}
type CounterProps = {
  start?: number;
}
const Counter = (props: CounterProps) => {
  // 设置内部状态的初始值，初始值是外部传进来的，当然，如果不传，那就使用默认值 0
  const [count, setCount] = useState(props.start || 0);
  const plus = () => {
    // 更新数据
    setCount(count + 1);
  }
  // return 返回的就是 UI，也是所见即所得，你看到的 dom 结构就是页面渲染后看到内容
  return (
    <div style={{ textAlign: 'center' }}>
      Count: {count}
      <button onClick={plus}>点我加1</button>
    </div>
  );
}
// 找到组件将要渲染的 html tag 位置（使一个 id ="root" 的标签）
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    {/*大家关注下面的一行，渲染上面写的组件 */}
    <App name={"xx"} />
    <Counter start={10} />
  </React.StrictMode>
);

export default App;
```
实际就是一个计数器，点击++。

#### Hook
`hook的本质，就是对逻辑的抽象。`拿一个组件显隐的功能举例：

原始版本：
```javascript
import React, { useState, useRef, useEffect } from 'react'
import './style.css'
interface IProps {
  uids: Array<number>
}

export default function ComputerComponent(props: IProps) {
  const [show, setshow] = useState(true)
  const handleClick = () => {
    setshow(!show)
  }
  return (<div>
    { show && <div className='test'>我是div</div>}
    <button onClick={handleClick}>toggle</button>
  </div>) 
}
```
效果：
<img src="/img/react_hook1.gif" alt="图片描述">


抽象化之后：
```javascript
import React, { useState, useRef, useEffect } from 'react'
import './style.css'
interface IProps {
  uids: Array<number>
}
function useShow() {
  const [show, setshow] = useState(true)
  const handleClick = () => {
    setshow(!show)
  }
  return {
    show,
    setshow,
    handleClick
  }
}
export default function ComputerComponent(props: IProps) {
  const { show, handleClick, setshow } = useShow()
  return (<div>
    { show && <div className='test'>我是div</div>}
    <button onClick={handleClick}>toggle</button>
  </div>) 
}
```
**这种抽象，就是自定义hook，下面介绍几个常用的官方hook**

`useState`

```javascript
import React, { useState } from 'react';
function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
在这里，useState 就是一个 Hook （通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。useState 会返回一对值：**当前状态和一个让你更新它的函数**，你可以在事件处理函数中或其他一些地方调用这个函数。你可以简单把它理解成调用这个函数会更新 state 的状态，然后这组件重新渲染。在上面的例子中，我们的计数器是从零开始的，所以初始 state 就是 0。值得注意的是，这里的 state 不一定要是一个对象，可以是任意值。这个初始 state 参数只有在第一次渲染时会被用到。

你可以在一个组件中多次使用 State Hook:
```javascript
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [name, setName] = useState('chaochao');
  const [friends, setFriends] = useState([{ name: 'lulu' }]);
  // ...
}
```
`注意`:
state的变量不能直接修改，这是规则

`useEffect`
这个 hook 的核心作用就是在组件渲染完毕之后，你想做点别的事情（我们统一把这些别的事情称为`副作用`）。
比如你想渲染完之后立即进行数据获取、事件订阅或者手动修改过 DOM，这些都是副作用，都可以在 useEffect 中执行。
useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount(组件第一次渲染结束后触发)、componentDidUpdate（组件每次更新结束后触发） 和 componentWillUnmount（组件将要卸载的时候触发） 具有相同的用途，只不过被合并成了一个 API。
即 useEffect 可以根据参数的不同配置，在组件不同的渲染时机被调用。useEffect 接受两个参数：`副作用函数`,`依赖项，类型是数组`
```javascript
// 依赖项是空数组，仅在组件首次挂载（mount）后执行一次，组件卸载时执行清理函数
useEffect(() => {
    ...
},[]);

// 依赖项有值（不论个数），组件第一次渲染结束后，调用一次。后面检测到依赖发生变化的时候，自动调用，每变一次调用一次
useEffect(() => {
    ...
},[依赖1,依赖2]);

// 没有填依赖项，则组件每次渲染结束后，都调用一次，不限次数
useEffect(() => {
    ...
});
```
**你可以在组件中多次使用 useEffect，每个 effect 关注自己的事情即可。**
```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  // 一个组件中可以使用多个useEffect,
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    // 这里假设有个 ChatAPI 的服务
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
```
`关于useEffect查一个场景题`：现在有一个页面，有三个子组件的div，分别是a、b、c，那如果我现在通过代码改变了他们的顺序，比如b、a、c，子组件中useEffect(() => { ... }, [])会触发吗？
答案有两种，不触发。useEffect(() => { ... }, []) 只有在组件挂载时触发,react底层执行判断是否为同一组件的条件是：`标签名和key`。a、b、c无key时，react会默认加一个列表索引作为key，不触发。如果有key，就更不会触发。


`useReducer`
类似于useState，代码如下：

```javascript
import React from "react"
import { useState, useReducer } from "react"
import { Button } from 'antd'

const testreducer = (state, action) =>{
  switch (action) {
    case "-":
      return state - 1
    case "+":
      return state + 1
  }
}
const AboutComponent = () => {
  const [count, dispatch] = useReducer(testreducer, 0)
  const handleClick = (type) => {
    dispatch(type)
    console.log('count>>>',count)
  }
  return (
    <div>
      <span>about</span>
      <Button onClick={ () => handleClick('-')}>--</Button>
      <span>{ count }</span>
      <Button onClick={() => handleClick('+')}>++</Button>
    </div>
  )
}

export default AboutComponent
```
个人感觉，其功能在于抽逻辑代码。

`useRef`
跟dom元素相关，例如我们需要等待页面渲染完dom后做一些其他的事情，如挂载canvas画布等，就可以这么玩：

```javascript
import Me from '@/components/Me'
import { useEffect, useRef } from 'react';


export default function HomeComponent() {
  const child = useRef(null)

  useEffect(() => {
    if(child.current) {
      console.log('child>>>>', child)
    }

  }, [child])
  return <div ref={child} className="w-full h-full text-[50px] bg-gradient-to-t from-[#243b55] to-[#141e30]">
    <Me/>
  </div>;
}

```


`useMemo`
对函数值的缓存，只有当依赖的值（第二个参数）发生变化时，才会重新计算。避免重复计算，缓存计算结果。代码如下：
```javascript
import React, { useState, useMemo } from 'react';

const TestPage = () => {
  const [number, setNumber] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // 使用useMemo缓存计算结果
  // 只有当number变化时，才会重新计算
  const squaredNumber = useMemo(() => {
    console.log('进行了昂贵的计算...');
    // 模拟一个计算开销较大的操作
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result = number * number;
    }
    return result;
  }, [number]); // 依赖数组，只有number变化时才重新计算

  // 切换主题的样式
  const themeStyles = {
    backgroundColor: darkMode ? 'black' : 'white',
    color: darkMode ? 'white' : 'black',
    padding: '20px',
    margin: '20px'
  };

  return (
    <div style={themeStyles}>
      <h1>使用useMemo优化计算</h1>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <button onClick={() => setDarkMode(!darkMode)}>
        切换主题
      </button>
      <p>数字的平方: {squaredNumber}</p>
    </div>
  );
};

export default TestPage;
```
当我们点击 "切换主题" 按钮时，虽然组件会重新渲染，但由于 number 没有变化，useMemo 会直接返回缓存的结果，避免了不必要的计算.

**每次切换主题都进行计算的版本**

```javascript
import React, { useState, useMemo, useEffect } from 'react';

const TestPage = () => {
  const [number, setNumber] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // 直接在组件渲染过程中执行计算
  // 每次组件重新渲染时都会执行，包括切换主题时
  console.log('进行计算...');
  let result = 0;
  // 模拟一个计算开销较大的操作
  for (let i = 0; i < 100000000; i++) {
    result = number * number;
  }
  const squaredNumber = result;

  const themeStyles = {
    backgroundColor: darkMode ? 'black' : 'white',
    color: darkMode ? 'white' : 'black',
    padding: '20px',
    margin: '20px',
    minHeight: '200px'
  };

  return (
    <div style={themeStyles}>
      <h1>不使用useMemo和useEffect的情况</h1>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <button 
        onClick={() => setDarkMode(!darkMode)}
        style={{ padding: '5px 10px', marginBottom: '10px' }}
      >
        切换主题
      </button>
      <p>数字的平方: {squaredNumber}</p>
      <p>注意: 每次点击切换主题按钮都会触发重新计算</p>
    </div>
  );
};

export default TestPage;
```

`useCallback`
对函数方法的缓存，减少不必要的函数创建，优化性能

```javascript
import React, { useCallback,useRef, forwardRef, useImperativeHandle, useState, useMemo, memo } from "react"
// import { useState, useReducer } from "react"
import { Button } from 'antd'

const Child = memo((props: any) => {
  const { onClick } = props
  console.log('zi组建更新', onClick)
  return <button onClick={onClick}>子组建按钮</button>
})

const AboutComponent = () => {
  const [count, setcount] = useState(0)
  const [value, setvalue] = useState('hhvcg')
  console.log('父组建更新')

  const handleClick = (type) => {
    console.log('执行>>>')
    setcount(count+1)
  }
  const handleClick2 = useCallback((type) => {
    setcount(count+1000)
  }, [])

  return (
    <div>
      <span>{ count }</span>
      <Button onClick={ handleClick }></Button>
      <Child onClick={ handleClick2 }/>
    </div>
  )
}

export default AboutComponent
```
配合memo使用

`总结一下`：usecallback、useMemo，useCallback主要用于避免在每次渲染时都重新创建函数，而useMemo用于避免在每次渲染时都进行复杂的计算和重新创建对象。useCallback返回一个函数，当依赖项改变时才会更新；而useMemo返回一个值，用于缓存计算结果，减少重复计算。

`useLayoutEffect`
同useEffect几乎一摸一样，但稍有些区别。官方建议： 大多数场景下直接使用`useEffect`，但代码引起页面闪烁就推荐使用`useLayoutEffect`处理。useLayoutEffect 在 DOM 挂载 / 更新后、浏览器绘制前执行；useEffect 在 DOM 挂载 / 更新后、浏览器绘制完成后执行。

### 通信
  - react中的通信，同vue有点类似，子组建通过props获取父组建的值，但是因为reat是单向数据流，子组建无法直接修改父组建的值。所以子组建通过调用父组建的方法把值传过去
  - 无关组件之间传值，`context，redux`。其中context通常用于小型的项目，组件树中的传值，redux相比之则更适用于大型项目的全局状态管理。


`useAsyncFn`
无需手动管理 loading、error 等状态,简化异步操作的处理逻辑,同时还可以自动处理并发请求（新请求会取消旧请求）
```javascript
  const [loading, test] = useAsyncFn(async () => {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("1");
      }, 3000);
    });
    p.then(res => {
      console.log("res>>", res);
    });
  }, []);
```


注： 本文大量参考平台内部某同学的文章，请留意。




**文毕**

