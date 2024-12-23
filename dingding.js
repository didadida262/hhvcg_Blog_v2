// 题目1 现有 Connect 连接 WebSocket 的函数。但在实际应用中，部分用户连接速度很慢。
// 要求实现 “复合建连”，连接规则：
// 1. 调用连接函数后，先发起一个 WebSocket 连接
// 2. 如果 200 毫秒后连接仍未返回，那么再发起第二个连接
// 3. 如果仍未返回，500 毫秒后发起第三个连接
// 4. 任意一个连接发起成功，则返回成功连接，并关闭其他连接 ws.close()
// 5. 所有连接全部失败，返回失败（返回任意一次连接的失败即可）
// ps：不要一次性发起多条连接，只有前一条在一定时间还没返回结果时，再发起新的连接
// Connect 函数
// function Connect(url) { //readme: 这个函数reject不返回ws，好像没办法closews
//     return new Promise((resolve, reject) => {

//         const ws1 = new WebSocket(url);
           let ws2 
           let ws3

//         ws1.onopen = () => {
//             resolve(ws);
                ws2.close()
                ws3.close()
//         }
//         ws1.onerror = (err) => {
               if (ws2.onerror || ws3.onerror) {
//              reject(err)

               }
//         }
          setTimeOut(() => {
            if (!ws.onopen) {
              ws2 = new WebSocket(url)
              ws2.onopen = () => {
                resolve(ws2);
                ws1.close()
                ws3.close()
              }
              ws2.onerror = (err) => {
                  if (ws1.onerror || ws3.onerror) {
                    reject(err)

                  }
              }
              setTimeOut(() => {
                if (!ws2.onopen) {
                  ws3 = new WebSocket(url)
                  const ws3 = new WebSocket(url)
                  ws3.onopen = () => {
                    resolve(ws3);
                    ws1.close()
                    ws2.close()
                  }
                  ws3.onerror = (err) => {
                      if (ws1.onerror || ws2.onerror) {
                        return ws2
                      reject(err)
                      }
                  }
                }
              }, 500)
            }
          }, 200)
//     })
// }

// 题目1  现在有一个 js 函数，接受一个参数：uid 的数组，数组长度最长 100 ，批量去服务端查询用户 profile：
// const getUserProfileByUids = async (uidList) => {
//    return fetch(`/user/get?uidlist=${encodeURIComponent(uidList.join('.'))}`).then((res) => {
//        return res.json();
//    });
// }
// 服务端的返回值的结构是：  [{uid: "001", nick: 'xx', age: 18},{uid: "002", nick: 'xx', age: 18}]
// 如果传入的 uid 在服务端不存在，在返回值里就没这个 uid 的相关数据

// 现在要求实现一个新的查询方法，接受单个 uid，返回一个 Promise ，查询成功，resolve 这个 uid 的 profile，否则 reject。
// 要求合并 100ms 内的单个查询，只去服务端批量查询一次，不允许使用任何三方库，批量查询直接使用 getUserProfileByUids
// 输入输出样例
// 100ms 内的单个请求能够被合并
// 请求成功和失败都能正确派发请求的结果，对应 promise 的 resove 和 reject
// 窗口内超过 100 个请求，能确保每次批量请求的 ID 个数不超过 100

const getUserProfiledByUid = (uid) => {

};

// 题目2 实现一个函数，找出一段字符串里面连续重复最多的字符，并返回它的位置，如果是有相同的则返回第一个结果
function findRepeatStr(str) {
    const arr = str.split('')
    let max = 0
    let target = null
    for (let i = 0; i < arr.length - 1; i++) {
      const curChar = arr[i]
      let size = 0

    //   // 方案一
    //   for (let j = i; j < arr.length; j++) {
    //     if (arr[j] === curChar) {
    //       size++
    //     } else {
    //       if (max < size) {
    //         target = curChar
    //         max = size
    //         break
    //       }
    //     }
    //   }

      // 方案二
      const targetIndex = arr.slice(i).findIndex((item) => item !== curChar) + i + 1
      if (targetIndex === -1) {
        size = arr.length - i + 1
      } else {
        size = targetIndex - i - 1
      }
      
      if (max < size) {
        target = curChar
        max = size
      }

    }

    console.log('max', max)
    const start = arr.findIndex((item) => item === target)
    return {
      char: target,
      startIndex: start,
      endIndex: start + max - 1
    }
  }
const str = 'abcdefggghhhhiiijjjj';
console.log(findRepeatStr(str)); // 输出 {char: 'h', startIndex: 9, endIndex: 12}