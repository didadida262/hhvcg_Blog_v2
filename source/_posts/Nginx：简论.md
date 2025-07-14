---
title: Nginx--简论
category: 网络杂谈
date: 2023-08-21 10:01:48
tags:
---

### 本文会帮你解答一个问题，nginx 这玩意儿是干嘛的

Nginx 是啥，官方说法，一种高性能的 http 与反向代理的 web 服务器。什么叫高性能？说白了就是响应尽可能地快。
一般的项目后端配置 tomcat 即可满足需求，因为一个站点在某个时刻不可能会有大量的请求达到。tomcat 最高同时能够满足 5、600 的请求响应，所以说一般场景下基本 hold 住。但是总有些热门的站点。在某一时刻会有数以万计的请求，这个时候，tomcat 就扛不住了，服务器直接飘红。为了解决这一问题，nginx 就来了（最大支持 50000 请求）。
<img src="/img/nginx.jpg" alt="nginx" width="500">

**反向代理、负载均衡、动静分离、打包预览**

#### 反向代理

先说明什么是正向代理。玩吃鸡这类游戏的时候，我们往往要挂个加速器（vpn），不然就很慢。关于为什么慢甚至无法访问，请移步"梯子"那篇文章。这里的加速器，就是**正向代理**，开启代理，我们触发的任何请求均是由加速器代替我们的客户端发出去的。即：**代理客户端就是正向代理**。
而反向代理的典型就是 nginx。当客户端的请求发送给服务端的时候，实际上被 nginx 拦截，代替服务端返回响应。即：**代理服务端就叫做反向代理。**两者的效果是一样的，就是在 c 端和 s 端之间加了一层。实际的操作区别在于，一个装在 c 端一个跑在 s 端，如此而已。同一个站点的服务器，往往不会是一台，可能会有很多台。通过 nginx 这层中间层，即可实现高性能的需求。**顺带说一句，从架构的层面来做考量，没有什么，是加一层中间层解决不了的。如果有，那就再加一层。**

#### 负载均衡

上面实际已经提到了。某个时刻发送了 4 个请求，如果此时只有一台服务器，那么这四个请求会被这台服务器挨个处理，挨个儿响应，假设一个请求耗时 N，总耗时就是 4N。那么如果此时服务器端有四台服务器，四个请求被四台服务器同时处理并返回，耗时为 N。这就叫负载均衡。注意，默认情况下是通过轮询的方式把四个请求依次给到四台服务器。但是我们也可以通过“weight”权重关键字灵活配置，也就是所谓的加权轮询。

#### 动静分离

实际就是其字面意义。不赘述。

```javascript
// 常用命令：
开启nginx
start nginx

关闭nginx，快速停止nginx，可能并不保存相关信息
nginx -s stop

重新载入nginx，当配置信息修改需要重新加载配置是使用
nginx -s reload

```

#### 打包预览

抛开自动化部署的项目不谈，有时候我们会碰到一些还是刀耕火种般的项目。就是前端手动打个包，发给后端去部署。这时候，可能会遇到一个场景：本地开发好好的，打完包扔给后端，后端部署完，自己去看线上的项目懵逼了。尼玛本地好好的，线上怎么出问题了？这边央视怎么不对了？glb 的模型怎么加载不出来了？等等。

为了解决上述问题，你首先要做的应该是在本地复现。因为你不可能每次实验的修改，都扔给后端的同学部署，太麻烦。
`此时，就到了nginx出场的时候了。`
我们可以利用 nginx 在本地做个代理，使用打包后的产物，模拟后端部署。主要就是他的 config 配置 文件。基本配置如下：

```javascript
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        // # 在 location / 之前添加，优先匹配 /models/ 路径
        // location ^~ /models/ {
        //     alias D:/nginx-1.26.3/html/dist/models/;
        //     add_header Content-Type model/gltf-binary;
        // }
        # 前端静态文件配置
        location / {
            root   html/dist;  # 指向你的打包目录
            index  index.html;
            try_files $uri $uri/ /index.html;  # 单页应用路由支持
        }

        # 如果需要代理API接口
        location /api/ {
            proxy_pass http://192.168.0.7:15006;  # 替换为你的真实API地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }


        # 错误页面配置
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

对于前端同学们而言，上面的内容中，除了`打包预览`比较实用，其他的嘛，听个响足矣，知道这个东西干嘛用的。需要的时候，找找相关配置即可。毕竟，大家各司其职。
