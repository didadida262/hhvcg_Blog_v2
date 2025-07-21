---
title: React系列：诡异的点
date: 2024-03-15 00:21:20
category: React系列
---

### 本文重点罗列一些react中，令人诡异的点

1. **setstate改变值后，打印出来的，居然还是旧的值**
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
**...写了两三年vue的我表示：what？**
解释： `在组件生命周期或者react合成事件中，状态的更新是异步的，在settimeout或者原生dom事件中，setState是同步的。setcount的调用是同步的，所以打印出来的count的值，还是0`
注意：同时多次调用setstate修改状态值，取最后一次的执行结果，因为是批量更新的。定时器中状态变更后可以同步显示，但是react18中，也被设计为异步。这是react的一个特性，也是react的坑。

那么为什么要设计出这种坑呢？`避免多次render`。可以将setstate这种操作看成是异步的，比如通过setstate改变了某个状态，但是这个改变的任务，会被塞入一个异步队列中，然后继续执行后面的代码，当所有代码执行完毕之后，再从队列中批量执行更新的操作，最后render页面。

那么现在我有个强烈的需求，我就是要在更新完state之后，获取最新的值，怎么破？
1. 函数式组件中，可以给setstate一个回调作为其第二个参数，在回调中可以获取更新之后的值
2. 官方建议的方式，setstate给一个函数作为参数，如下面的方式：
```javascript
    setcount((prev) => {
      const res = prev + 1
      console.log('res', res)
      return res
    })
```


**2. 父子组件通信问题**
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
