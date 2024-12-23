---
title: React系列：第七回(组件的设计模式)
date: 2024-03-22 18:21:32
category: React系列
---

### 本文我们聊聊react组件的设计模式(逻辑复用)

**一. render props**
在前面讲解登陆态持久化的文章中，我们实际上已经实践了render props：

```javascript
const AuthRoute = ({ children}) => {
    const token = getToken()
    if (token) {
        return <>{children}</>
    } else {
        return <Navigate to='/login' replace />
    }
}
```
通过打印props我们能够看到，包裹着内容，实际上会在props中，以`children`的属性传递给AuthRoute组件。
在`AuthRoute`中，我们将token的判断逻辑扔在了该组件中，其中包裹着目标组件。若有token，跳转到目标页面，否则，跳转到login。高效复用逻辑代码。


**二. 高阶组件**
函数包裹组件，之前提到的memo就是一个实例，下面写一个HOC，以做示范：

```javascript
const HOC = (ChildComponent) => {
  const res = (props) => {
    return (
      <div>
        <span>我是高阶</span>
        <ChildComponent {...props}></ChildComponent>
      </div>
    )
  }
  return res
}
const TT = HOC(Child)
...
...
<TT />
```

**三. 自定义hook**
这就不多说了,讲了太多，大势所趋之术也...


