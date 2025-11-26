---
title: 前端数据库？sql.js
date: 2023-09-18 09:25:52
category: 前端剑气双修专栏
---

### 本文尽可能详细介绍sql.js。


<img src="/img/大前端剑宗sql.jpg" alt="parser">


sql.js为何方神圣？一个专门用于处理sqlite文件的前端数据处理库。它可以根据sqlite文件， 在内存中构造一个对象（虚拟数据库），然后我们可以使用类似sql语句的查询方式，输出我们想要的方式。
示例代码如下：

```javascript
import initSqlJs from 'sql.js'
export function openLocalSqliteDB(sqliteFileData, callback) {
  const SQL = initSqlJs({
    // TODO: replace with local file path
    // locateFile: file => `https://sql.js.org/dist/${file}`
    // should put `sql-wasm.wasm` to `public/dist/` folder
    locateFile: file => `/dist/${file}`
  }).then((SQL) => {
    // 生成该文件的url
    const dbFile = obtainLocalUrlByFileData(sqliteFileData)
    // Ajax请求
    const xhr = new XMLHttpRequest()
    xhr.open('GET', dbFile, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = e => {
      const uInt8Array = new Uint8Array(xhr.response)
      const db = new SQL.Database(uInt8Array)
      callback(db)
    }
    xhr.send()
  })
}

// ....
// ....调用方式 + 回调
// 其中sqliteFileData为sqlite文件
openLocalSqliteDB(sqliteFileData, (db) => {
    // 拿到根据生成的db对象，进行后续操作
})

// 获取某张表的数据
const getTableAllData = (sqlite_db, tableName) => {
  const sql_statement_str = `SELECT * FROM ${tableName}`
  const sql_statement = sqlite_db.prepare(sql_statement_str)
  const result_list = []
  while (sql_statement.step()) {
    const result = sql_statement.getAsObject()
    result_list.push(result)
  }
  return result_list
}

// 获取某张表的所有key
const getTableAllKey = (sqlite_db, tableName) => {
  const sql_statement_str =  `
      SELECT *
      FROM ${tableName}
    `
  const sql_statement = sqlite_db.prepare(sql_statement_str)
  const res = sql_statement.getAsObject()
  return Object.keys(res)
}

// 删除表
const delTable = (sqlite_db, tableName) => {
  // 使用 SQL 的 DROP TABLE 语句删除表
  const sql_statement_str = `DROP TABLE IF EXISTS ${tableName}`
  sqlite_db.run(sql_statement_str)
}

// 创建表
const createDefectTable = (sqlite_db, tableName) => {
  // INDEX INTEGER,
  const sql_statement_str = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    old INTEGER,
    name TEXT
  )
`
  sqlite_db.run(sql_statement_str)
}
// 向创建的表中插入数据
const insertQuery = `
    INSERT INTO people (old, name)
    VALUES (?,?)
`
db.run(insertQuery, [12, 'hhvcg'])
// ...
// ...
// ...
```

接触该库时看到公司项目的某个功能是用这玩意儿实现的，觉得蛮有意思的但是，这东西仅仅只是个玩具罢了。从上面代码中能得知，db应该是存在机器内存中的，那就很尴尬了。
**其定位到底是啥？极度阉割版本的前端仿数据库？有这时间，不如后端处理。**