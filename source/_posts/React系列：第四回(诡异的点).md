---
title: React系列：第四回(诡异的点)
date: 2024-03-15 00:21:20
category: React系列
---

#### 本文重点罗列一些react中，令人诡异的点

#### setState改变值后，打印出来的，居然还是旧的值
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
点击按钮变更count， 打印出来的count的值: count>> 0。**写了两三年vue的我表示：what？setState到底是同步的，还是异步的，开始一波调研**

<img src="/img/reactgui_1.png" alt="">


通过setState改变了某个状态，但是这个改变的任务，会被塞入一个异步队列中，然后继续执行后面的代码，当所有代码执行完毕之后，再从队列中批量执行更新的操作，最后render页面。`简而言之，setState是异步更新的，这就是为什么改变值后立刻打印，显示的是更新前的值。`

那么现在我有个强烈的需求，我就是要在更新完state之后，获取最新的值，执行一些逻辑，怎么破？官方建议的方式，setState给一个函数作为参数，如下面的方式：
```javascript
    setcount((prev) => {
      const res = prev + 1
      console.log('res', res)
      return res
    })
```
**区别补充**：
```javascript
  const handleStateClick = () => {
    console.log('handleStateClick')
    setCount(count + 1)
    // 函数式更新
    setCount((prev) => prev + 1)
    console.log('count>>>', count)
  }
```
setCount(count + 1)：拿你当前作用域里 count 的值，加 1 后设置状态；
setCount(prev => prev + 1)：等到 React 执行这个 updater 函数的时候，再把“那时的最新状态”作为 prev 传入，返回新的状态值。`记住：`更新函数不会在调用 setCount 时立刻运行，而是被 React 暂存到更新队列中；


