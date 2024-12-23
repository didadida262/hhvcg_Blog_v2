---
title: canvas离屏渲染详解
date: 2024-10-16 10:29:55
category: 性能的考量
---

### 本文通过实例介绍下，针对canvas，如何通过离屏渲染做性能优化

#### 业务场景
某些场景下，我们需要在canvas进行诸多的绘制渲染的操作，当渲染量达到一定程度时，例如绘制的图形个数巨大，渲染耗时大到页面处于暂时性卡死，该如何破？**离屏渲染**

#### 实现思路
在主线程中，通过`transferControlToOffscreen`,将渲染的工作给到worker处理，以此规避卡死主线程的目的。

#### 演示
##### react核心代码
```javascript

  const drawCanvasOne = () => {
    if (!canvasOneRef.current || !canvasTwoRef.current) return
    const canvas:HTMLCanvasElement = canvasOneRef.current
    const ctx = canvas.getContext('2d');
    if (!ctx) return
    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(150, 150, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
      ctx.fill();
      animationFrameId = window.requestAnimationFrame(render);
    }
    render();
  }
  const drawCanvasTwo = () => {
    const transfercanvasWorker = canvasTwoRef.current.transferControlToOffscreen();
    canvasWorker.postMessage({ canvas: transfercanvasWorker }, [transfercanvasWorker]);
  }
  useEffect(() => {
    drawCanvasOne()
    drawCanvasTwo()
    return () => {
        window.cancelAnimationFrame(animationFrameId);
    }
  }, [])
    return (
    <div className="container flex justify-between items-center w-full h-full">
        <div>
            <canvas ref={canvasOneRef} width={300} height={200} />
            <span>正常渲染Canvas</span>
        </div>
        <div>
            <canvas ref={canvasTwoRef} width={300} height={200} />
            <span>离屏渲染Canvas</span>
      </div>
      <ButtonCommon
        type={EButtonType.PRIMARY}
        onClick={
          () => {
            alert('弹框......')
          }
        }>
        <span>测试按钮</span>
        
      </ButtonCommon>
    </div>
)
```

##### worker文件代码
```javascript
let canvasB = null;
let ctxWorker = null;
let frameId = null;

self.onmessage = e => {
  canvasB = e.data.canvas;
  ctxWorker = canvasB.getContext("2d");
  drawCanvas();
};

let frameCount = 0;
function drawCanvas() {
  frameCount++;
  ctxWorker.clearRect(0, 0, ctxWorker.canvas.width, ctxWorker.canvas.height);
  ctxWorker.fillStyle = "#FFFFFF";
  ctxWorker.beginPath();
  ctxWorker.arc(
    150,
    150,
    20 * Math.sin(frameCount * 0.05) ** 2,
    0,
    2 * Math.PI
  );
  ctxWorker.fill();
  frameId = self.requestAnimationFrame(
    drawCanvas
  ); /* 之后可以通过cancelAnimationFrame将动画取消 */
}

```

##### 效果

<img src="/img/canvas_offscreen.gif" alt="parser">

文毕.




