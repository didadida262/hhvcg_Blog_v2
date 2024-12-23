---
title: Vue.js系列：深入理解生命周期
date: 2023-08-13 15:32:14
tags:
category: 前端剑宗专栏

---

我tm今天才知道，路由跳转时，旧页面的beforeDestroy，居然是在新页面的created之后。。。。
理由很简单，倘若新页面的created逻辑太多导致页面空白。所以如此操作。。。。。
