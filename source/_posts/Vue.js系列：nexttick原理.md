---
title: Vue.js系列：nexttick原理
date: 2023-11-17 16:44:57
category: 前端剑气双修
---

### 本文尝试梳理在vue中，nextTick方法的实现原理
使用：在下次dom更新结束之后，执行nextTick中的回调，这样我们就能拿到dom。

谈到nextTick就不得不说一说js执行环境的`事件循环机制`。js引擎首先会执行全局代码，并将其中的同步任务放入执行栈中执行。当遇到异步任务时，会将该根据任务类型放入不同的事件队列。比如settimeout、settimeinterval就放入宏任务队列。微任务塞入微任务队列。主执行栈执行完毕后，会按照微任务事件队列优先原则，取出任务执行。微任务空再去宏任务队列中拿。直到最后清空。

具体来说，当我们调用Vue的nextTick方法时，Vue会将回调函数放入一个回调队列中。在当前执行栈执行完毕后，Vue会检查是否存在微任务队列，如果存在，则将回调函数放入微任务队列中。

```javascript
Vue.nextTick = function (callback) {
  if (typeof Promise !== 'undefined') {
    // 使用Promise的then方法作为微任务
    Promise.resolve().then(callback);
  } else {
    // 使用MutationObserver作为微任务
    var observer = new MutationObserver(callback);
    var textNode = document.createTextNode('1');
    observer.observe(textNode, {
      characterData: true
    });
    textNode.data = '2';
  }
};
```






