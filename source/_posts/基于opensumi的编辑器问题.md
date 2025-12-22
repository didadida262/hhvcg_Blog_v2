---
title: 基于opensumi的编辑器问题
date: 2024-9-25 05:42:20
category: 性能的考量
---

#### 本文简单整理下，公司编辑器项目遇到的坑，及对应的解决方案

这段时间在整公司的一个web3的编辑器，基于opensumi开发的，主要是支持编写各种合约语言然后编译、部署的一整套流程。总结下过程中遇到的问题。

#### 性能问题
这是绝对的大头。比如一个文件10MB+，用户需要编辑，但是用 OpenSumi 打开后，就会出现明显的卡顿（输入文字时光标滞后 0.5-1 秒）、滚动不流畅，甚至偶尔白屏。
`方案`：
##### Monaco Editor 层优化
- `开启「增量渲染」`：设置 editor.maxTokenizationLineLength = 500（超过 500 行的文件仅渲染可视区域，滚动时再渲染其他区域）；
- `禁用大文件语法高亮`：通过 OpenSumi 的 IEditorService 扩展，判断文件大小 > 5MB 时，自动切换为「纯文本模式」，关闭语法高亮和代码补全；

##### OpenSumi层 文件缓存策略优化
重写 IFileService 的 readFile 方法，大文件采用「流式读取」（createReadStream），而非一次性读取全量内容,类似视频流。

#### 自定义插件与第三方插件加载顺序冲突（依赖未就绪）
开发一款IDE，自定义插件 A 需依赖 VS Code 第三方插件 B的 API，但启动时频繁出现「插件 B 未激活，插件 A 调用 API 失败」的报错。
`方案`:
##### 在自定义插件 A 的 package.json 中，添加 activationEvents 依赖，明确插件 A 需在插件 B 激活后再激活。
```javascript
{
  "name": "api-import-plugin",
  "activationEvents": [
    "onPluginActivated:vscode.swagger-plugin" // 插件 B 的 ID
  ],
  "main": "./out/extension.js"
}
```
##### 预加载依赖插件
在 OpenSumi 应用初始化时，通过 IPluginService 主动激活依赖插件 B，确保在插件 A 激活前完成初始化.
```javascript
// 应用启动时执行（在 App 层扩展）
async function preloadPlugins() {
  const pluginService = getInjectable(IPluginService);
  const swaggerPlugin = pluginService.getPlugin('vscode.swagger-plugin');
  if (swaggerPlugin && !swaggerPlugin.isActive) {
    await pluginService.activatePlugin('vscode.swagger-plugin');
  }
}
```

