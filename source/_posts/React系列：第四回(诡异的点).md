---
title: React系列：第四回(诡异的点)
date: 2024-03-15 00:21:20
category: React系列
---

#### 本文重点罗列一些react中，令人诡异的点

#### setstate改变值后，打印出来的，居然还是旧的值
看如下代码：
```javascript
const AboutComponent = () => {
  const [count, setcount] = useState(0)
  const handleClick = (type) => {
    setcount(count + 1)
    console.log('count>>', count)
  }

  return (
    <div>
      <span>{count}</span>
      <Button onClick={handleClick}>React点击</Button>
    </div>
  )
}
```
点击按钮变更count， 打印出来的count的值: count>> 0
**...写了两三年vue的我表示：what？setstate到底是同步的，还是异步的，开始一波调研**

<img src="/img/reactgui_1.png" alt="">


通过setstate改变了某个状态，但是这个改变的任务，会被塞入一个异步队列中，然后继续执行后面的代码，当所有代码执行完毕之后，再从队列中批量执行更新的操作，最后render页面。`简而言之，setstate是一部批量更新的，这就是为什么改变值后立刻打印，显示的是更新前的值。`

那么现在我有个强烈的需求，我就是要在更新完state之后，获取最新的值，怎么破？
官方建议的方式，setstate给一个函数作为参数，如下面的方式：
```javascript
    setcount((prev) => {
      const res = prev + 1
      console.log('res', res)
      return res
    })
```

再来一段：
```javascript
this.setState({ x: 5 });
console.log(this.state.x);  // 输出：5
...
...
setTimeout(() => {
  this.setState({ x: 10 });
  console.log(this.state.x);  // 输出：10
});

```
setState是否是“异步批量更新”，取决于执行上下文是否被 React 控制。它仅在「React 可控的同步执行上下文」中（如事件处理函数、生命周期函数）才会批量延迟更新；若在「React 不可控的异步上下文」中（如 setTimeout、Promise.then、原生事件回调），setState 会 同步执行，立即更新状态。



**小细节的补充**：下面代码的两种写法的区别？
```javascript
  const handleStateClick = () => {
    console.log('handleStateClick')
    setCount(count + 1)
    setCount((prev) => prev + 1)
    console.log('count>>>', count)
  }
```
setCount(count + 1)：拿你当前作用域里 count 的值，加 1 后设置状态；
setCount(prev => prev + 1)：等到 React 执行这个 updater 函数的时候，再把“那时的最新状态”作为 prev 传入，返回新的状态值。


#### 父子组件通信问题
`场景`： 子组件A通过props获取父组件传过来的data数据渲染页面。同时，另一个子组件B通过事件告知父组件更新data数据，子组件A更新视图。
`出现的问题`：第一次在b组件触发更新数据的操作，没问题。之后就不行。

`排查`：通过打印发现，父组件的数据，一直都是空。目测应该是在添加完数据后，在什么地方把数据又给清掉了.经过一番打点发现，问题部分出在下面代码：
```javascript
    // setcategories([...categories, data])
    setcategories((prevItems) => [...prevItems, data]);
```
用方式1，不报错且现象依旧。用方式2，没有问题。看似问题解决了实则不然。发现子组件B调用父组件方法，更新数据，子组件A确实按照预期渲染但是，在父组件的方法中打印数据，居然一直都是空。用useEffect查看发现数据缺失是变了的。所以问题变成了：**为啥数据确实更新了，但是打印一直都是空？**又经过一番查找找出了原因，问题代码如下：
```javascript
      addPath(Math.random())
```
改造成如下代码即可解决：
```javascript
       <Button onClick={() => addPath(Math.random())}>测试</Button>
```
前者是触发子组件的某些事件时直接调用，后者则是标准的onClick事件触发。这就是问题点。目测是react的事件机制导致的。

`解决方案`: 为了实现我们需求，我们可以借助副作用，即监听数据变化再去执行对应的逻辑
