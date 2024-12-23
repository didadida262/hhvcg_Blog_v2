---
title: CSS系列：常见问题
date: 2023-11-20 15:22:04
category: css专栏

---

### 本文用于记录常见css面试题

1. 前端响应式的策略？
- 媒体查询@media。根据设备的不同宽高数据，使用不同的样式代码
- 百分比
- vm、vh
- rem。


2. 两栏布局，右侧自适应？
- `flex: 1`
- `calc(100% - 左侧宽度)`
- `左侧浮动，右侧margin-left`

3. **盒子水平垂直居中几种方案**
 - 3.1 flex
  ```html
    <div class="father">
      <div class="child"></div>
    </div>
  ```
  ```css
        .father {
            margin: 100px auto;
            width: 1000px;
            height: 500px;
            border: 1px solid red;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .child {
            border: 1px solid green;
            width: 500px;
            height: 100px;
        }
  ```
  - 3.2 定位
    ```css
        .father {
            margin: 100px auto;
            width: 1000px;
            height: 500px;
            border: 1px solid red;
            position: relative;
        }
        .child {
            border: 1px solid green;
            width: 500px;
            height: 100px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    ```

  - 3.3 display: table-cell
    ```css
          .father {
            margin: 100px auto;
            width: 1000px;
            height: 500px;
            border: 1px solid red;
            display: table-cell;
            text-align: center;
            vertical-align: middle;
        }
        .child {
            display: inline-block;
            border: 1px solid green;
            width: 500px;
            height: 100px;
        }
    ```
  - 3.4 marign
    ```css
        .father {
            margin: 100px auto;
            width: 1000px;
            height: 500px;
            border: 1px solid red;
        }
        .child {
            border: 1px solid green;
            width: 500px;
            height: 100px;
            margin-top: 200px;
            margin-left: 250px;
        }
    ```
  - 3.5 grid(写法同flex一致)
```css
    .test {
        display: grid;
        justify-content: center;
        align-items: center;
        border: 1px solid red;
        width: 100px;
        height: 50px;

    }
    .testchild {
        width: 60px;
        height: 20px;
        border: 1px solid red;
    }
```


4. 三栏布局，中间自适应？
- `flex`
- `gird`。父元素定义子元素宽度大小。grid-template-columns: 宽度 auto 宽度
- `absolute，中间使用margin`
  
5. css的选择器有哪些？他们的优先级？
important > 行内 > id > class > 元素标签选择器

6. 隐藏相关。
- dispaly: none
看不见摸不着
- visibility: hidden.
看不见摸得着。但无法响应事件。
- opacity： 0
看不见摸得着，可以响应事件。
- clip-path: 剪切路径。
```css
clip-path: polygon(点坐标....)
```
css3的能力加持，是我们能够仅仅用css就能裁剪出想要的图案。同时还能隐藏
看不见摸得着，无法响应事件

7. 如何处理单行/多行文本省略溢出？
- 单行文本：
```css
    overflow: hidden;
    text-overflow: ellipsis(溢出部分省略号)
    white-space: nowrap
```

- 多行文本
利用伪元素的content。
```css
/* 元素 */
position: relative
/* 伪元素 */
.main:after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0;
}
```

8. 画一个三角形？
```css
.main {
    width: 0;
    height: 0;
    border-width: 200px 200px 200px 200px;
    border-color: transparent transparent transparent red;
    border-style: solid
}
```

9. flex
- flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

10. 来个冷门但是还蛮核心的：width:100%;height:100%什么时候生效？
- 父元素有明确宽高的
- 父元素是相对定位或绝对定位的
- 父元素是 `flex` 或 `grid` 容器

