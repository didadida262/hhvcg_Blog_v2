---
title: electron系列：第一回
date: 2023-11-16 16:49:08
category: 前端的客户端化
---

### 本系列开始，将逐步介绍前端的客户端经典框架--electron（系列文章）
本文主要讲解electron的通信机制

首先祭出一张经典的图：
<img src="/img/electron1_1.webp" alt="">

electron有且只有一个`主进程`,由`package.json`中的`main`字段定义，Electron 使用 Chromium 来展示 web 页面，每个页面运行在自己的`渲染进程`中。

#### 一. 为什么这么划分
根本逻辑：主进程拥有服务器端的能力，例如读写文件资源，渲染进程负责页面呈现。

#### 二. 基本配置
**1. 创建app，主进程设置ipcMain，用来监听渲染进程事件**
```javascript
import { app, BrowserWindow, ipcMain } from 'electron'
import { handleGetAllCates, handleGetAllItems, handleGetVideo, getVideoContentVersionTwo } from '../src/utils/videoApi'

const fs = require('fs')
let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners () {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (event: any, message: any) => {
    console.log('main-get>>', message)
    switch(message.type) {
      case 'getAllCates':
        handleGetAllCates(event, message)
        break;
      case 'getAllVideosInCate':
        handleGetAllItems(event, message)
        break;
      case 'getVideoContent':
        handleGetVideo(event, message)
        // getVideoContentVersionTwo(event, message)
        break;
      default:
        break;
    }
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```
通过上面code，我们创建了一个app，关注其中的重点`ipcMain`, 这是用来前后通信的关键。我们在`registerListeners`中注册了`on`事件，用来接收渲染器进程的请求。

**2. ipcRenderer设置监听响应函数，并挂载到全局window上**
    
```javascript
import { contextBridge, ipcRenderer } from 'electron'
import { IPCInfo } from '../src/utils'
export const api = {
  sendMessage: (message: IPCInfo) => {
    ipcRenderer.send('message', message)
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  }
}

contextBridge.exposeInMainWorld('Main', api)
```
之后渲染进程的消息收发均通过window.Main

**3. 主进程接收到渲染进程的请求， 读取对应资源，再通过`event.sender.send`接口返回读取的内容，完成一次资源请求。**
```javascript
export const handleGetVideo = (event: any, message: any) => {
  console.log('handleGetVideo>>>', message)
    const path = message.data.path
    // console.log('path>>', path)
    fs.readFile(path, (err: Error, data: any) => {
      // console.log('读取文件内容>>>', data)
      event.sender.send('getVideoContent_back', {
        name: message.data.name,
        file: data
      })
    })
}
```

总而言之， electron能够让我们具备这样一种能力： **整合前后端的能力， 开发客户端软件。**
