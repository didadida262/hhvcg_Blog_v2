---
title: 纯前端处理yml文件数据
date: 2023-09-12 14:29:31
category:
---



```javascript
import yaml from 'js-yaml'
// 处理文件输出sql能接受的数据
async getFileToSqliteData(file) {
      const rrr = await this.readFile(new Blob([file.raw]))
      const parsedData = yaml.load(rrr) // 输出为 json 格式
      return parsedData
},
async readFile(blob) {
      const reader = new FileReader(blob)
      const promise = new Promise((resolve, reject) => {
            reader.onload = function() {
            resolve(reader.result)
            }
            reader.onerror = function(e) {
            reader.abort()
            reject(e)
            }
      })
      reader.readAsText(blob, 'UTF-8') // 将文件读取为文本
      return promise
},
```