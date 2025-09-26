---
title: 借助AI的能力，实现本地知识库（非工具版）
date: 2025-09-26 10:35:58
category: AI

---

### 本文介绍
上一篇文章中，我们借助cherry stdio，实现了一个纯个人vip定制的本地向量知识库，本文中，我们将通过完整的**前端后端搭建 + 大模型**，实现该需求。

### 总体实现逻辑及技术选型

后端：**Python 3.8+**
前端: **React 18、Aceternity UI、Framer Motion**
AI模型： 
- **嵌入模型**: all-MiniLM-L6-v2 (384维向量)
- **推理模型**: gemma3:4b (Ollama本地部署)
- **Ollama**: 本地大语言模型服务

#### 模型工作流程
- 根据语料库文档，使用嵌入模型切分成块，生成语料库
- `文档输入 → 嵌入模型 → FAISS向量索引 → 语义搜索 → 获取相关结果片段 → 推理模型 → 输出结果`
 
### 最终界面演示

<img src="/img/ai2_1.gif" alt="图片描述">

注意，其中用到的模型`all-MiniLM-L6-v2`和` gemma3:4b`，需要本地自行下载。代码详情见[Vercel部署地址](https://github.com/didadida262/project_Local_Knowledge_Base)
