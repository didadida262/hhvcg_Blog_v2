---
title: Webpack系列：第三回
date: 2023-07-24 22:39:47
tags:
category: Webpack系列
---
### 本文可以看成是我们开始diyWebapck前的开胃内容，介绍一些必备的知识点，为之后做铺垫。

#### babel相关api的功能。
- **@babel/parser：能够将通过readfile读取的文件内容，转化为ast数据。**
使用方式: const parser = require("@babel/parser");

借助`https://astexplorer.net/`, 查看结果。示例代码中的四段代码分别对应body中的四种类型。
<img src="/img/webpack3_1.png" alt="parser">

重点关注body字段。由图中能清楚的看到，左侧完整的四段代码块，解析出来的ast数据，对应着body中的四个不同类型节点。 
- **@babel/traverse：遍历ast中所有节点，根据需求，重写节点内容**
- **@babel/types: 构建新的babel的ast类型数据**
- **@babel/generator：与parser为互逆操作，ast--> 字符串数据**
- **ejs： 模板生成。**

从总体的逻辑，大概介绍下webpack最终的产物`bundle.js`生成的逻辑
`generateCode`入参就是我们已经处理好的ast，还有个入口文件地址。读取模板文件内容，然后调用ejs.render，作为其参数。另一个参数则是模板中可能会用到的变量。
```javascript
// 生成bundle.js文件代码
const  generateCode = (allAst, entry) =>  {
    const temlateFile = fs.readFileSync(
      path.join(__dirname, "./template.js"),
      "utf-8"
    );
  
    const codes = ejs.render(temlateFile, {
      __TO_REPLACE_WEBPACK_MODULES__: allAst,
      __TO_REPLACE_WEBPACK_ENTRY__: entry,
    });
  
    return codes;
}
```


