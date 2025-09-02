---
title: Games104-现代游戏引擎*
date: 2025-01-15 19:43:34
category: 游戏杂谈

---

<!-- ### 前言
1. 现代战争，是系统与系统之间的对抗
2. 数字孪生：将现实转换为虚拟
3. 游戏引擎的教父：John Carmack，卡神
4. 任何一个游戏引擎，都有一个uptick，
5. 关联课程：games 101


### 游戏引擎架构 -->



<!-- class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.runningTasks = 0;
    this.queue = [];
  }

  add(promiseCreator) {
    // TODO
  }
}

// 使用示例 
const timeout = (time) => new Promise(resolve => setTimeout(resolve, time));
const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// 1. 1, 2 开始执行 (并发2)
// 2. 500ms后，2完成，输出2，3开始执行
// 3. 300ms后，3完成，输出3，4开始执行
// 4. 400ms后，4完成，输出4
// 5. 1000ms后，1完成，输出1
// 所以最终顺序是 3, 2, 4, 1 -->