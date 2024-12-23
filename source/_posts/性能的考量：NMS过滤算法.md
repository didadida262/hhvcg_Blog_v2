---
title: 性能的考量：NMS过滤算法
date: 2023-11-13 11:21:02
category: 性能的考量
---

### 本文将详细的介绍一个算法思路NMS。

`详细的业务场景：`

我们需要把后端返回的点数据，画到canvas中的大圆上。数据量较少的情况下比如几千个，那完全不需要用算法去做筛减。但是设想一下。后端返回了数万甚至是百万级别的点数据如何？在之前介绍浏览器图形化编程极限的时候，我们详细测试过，目下的谷歌浏览器，10000个图形绘制几近极限（注意,是需要支持拖拽缩放等操作时页面流畅的最大图形个数）。这个时候，我们就需要对点数据作筛减。

**理由： 没必要显示那么多，同时目下浏览器也扛不住。**

具体实现：
<img src="/img/性能考量nms.jpg" alt="图片描述">

我们会给画布上图形个数，设定一个阈值K。将w*h区域划分成一个个格子区域。为了最终限制在500，即w*h / 500 = T，每个区域面积T中，最多输出1个。即可保证总输出的个数<= 500。

根据宽高数值，将画布按照一定的尺寸网格化，最后输出一个grid三维数组。分别表示行、列及各自一块区域内的所有缺陷得集合数组。

`业务场景代码举例：`
```javascript
  console.log('过滤前>>>', defects)
  console.log('viewRange>>>', viewRange)
  const maxNum = 400
  if (defects.length <= maxNum) return defects
  const seg_num = Math.sqrt(maxNum)
  const seg_w = Math.max(Math.exp(-6),viewRange.width / seg_num)
  const seg_h = Math.max(Math.exp(-6),viewRange.height / seg_num)
  // const gridSize = Math.max(1, Math.floor(Math.sqrt(viewRange.width * viewRange.height / maxNum)))
  console.log('seg_w>>', seg_w)
  console.log('seg_h>>', seg_h)
  console.log('每边的小格子数目>>', seg_num)
  const [row, col] = [Math.ceil(seg_num), Math.ceil(seg_num)]
  console.log('row>>', row)
  console.log('col>>', col)
  const grids = new Array(row).fill(0).map(() => new Array(col).fill(0).map(() => []))
```

根据阈值的大小，计算出每边的格子数目。再根据宽高得出格子的宽高。然后生成一个三维的grid对象，分别代表行列及每个格子中的缺陷。上述代码初始化了grid。为了搜集每个格子中的缺陷，需要遍历得出：
```javascript
  const index = ([x, y]) => [Math.floor((x - viewRange.x) / seg_w) , Math.floor((y - viewRange.y) / seg_h)]
  defects.forEach(defect => {
    const [x, y] = index([defect.pos_x, defect.pos_y])
    if (x < 0 || x >= row || y < 0 || y >= col) return
    grids[x][y].push(defect)
  })
```

index函数的输入是该缺陷的坐标信息，输出该缺陷所隶属的格子x、y。最后塞入grid中。

至此，我们已经获得了我们想要的格子数组。下面要做的，就是遍历每一个格子，按照一定的规则去选择格子中的点----`filterDefects函数`.

```javascript
  const result = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      result.push(...filterDefects(grids[i][j]))
    }
  }
  return result
```
注意这个filterDefects函数只会输出一个点。这样保证总输出数目最大就是我们设定的阈值数。关于如何选取，按照自己的思路。比如如果没有什么特别的需求，我就默认选择第一个元素作为输出即可。又比如我们优先选择某个特定缺陷类别。那就再做一个过滤。这种思路实现得NMS算法，很明显是区域优先。下一篇文章，我们呢会介绍另一种实现得思路：面积优先。

文毕。


