---
title: CSS系列：渐进式展示文本效果的实现
date: 2024-04-22 13:43:10
category: css专栏

---

### 本文主要介绍一下渐进式的展示文本效果实现

先给一张最终效果图：
<img src="/img/css系列：渐进式展示文本效果.gif" alt="">

这个效果的实现，主要是借助`animate`和`framer-motion`库的几个钩子函数`useTransform、useMotionValue`。


#### 1. html部分

```javascript
  return <motion.h2 className={className}>{displayText}</motion.h2>;
```

#### 2. useTransform、useMotionValue
```javascript
  // text为props传入的值
  const textIndex = useMotionValue(0);
  const baseText = useTransform(textIndex, () => text);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const displayText = useTransform(
  rounded,
  (latest) => `${baseText.get().slice(0, latest)}`
  );
```
最终展示的文本`displayText`是一个`useTransform`的返回。

useTransform是用来干嘛的？可以将它看成一个vue中的computed属性，拿上述rounded举例，两个入惨，一个是被监听变量，另一个则是一个回调，返回自己期望返回的值。`rounded始终等于Math.round(count)`。注意，需要搭配useTransform一同食用。

#### 3. 绑定动画

```javascript
  animate(count, 60, {
    type: 'tween',
    delay: 1,
    duration: 5,
    ease: 'easeIn',
    repeat: Infinity,
    repeatDelay: 2,
    onUpdate(latest) {
      if (updatedThisRound.get() === true && latest > 0) {
        console.warn(1)
        updatedThisRound.set(false);
      } else if (updatedThisRound.get() === false && latest === 0) {
        console.warn(2)
        updatedThisRound.set(true);
      }
    }
  });
```
**循环更新count， count变化，rounded跟着变化，round变化，displayText截片展示，实现渐进式的显示文本效果。**
文毕。



