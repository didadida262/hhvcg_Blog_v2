# Cloudflare Web Analytics 真实数据集成指南

## 问题说明

当前博客显示的 UV 和 PV 数据为 "-"，需要集成 Cloudflare Web Analytics 的真实访问数据。

## 解决方案

已为您创建了 Cloudflare Web Analytics 集成方案，支持两种方式获取真实数据：

### 方式 1：使用 Cloudflare Web Analytics（推荐 - 最简单）

**步骤**：

1. **启用 Cloudflare Web Analytics**：
   - 登录 Cloudflare Dashboard
   - 进入您的 Pages 项目
   - 点击 **Analytics** → **Web Analytics**
   - 如果未启用，点击 **Enable Web Analytics**
   - 复制显示的 **Token**

2. **配置主题**：
   - 编辑 `themes/hexo-theme-butterfly/_config.yml`
   - 找到 `cloudflare_analytics` 配置部分
   - 设置：
     ```yaml
     cloudflare_analytics:
       enable: true
       token: "您的 Cloudflare Web Analytics Token"
       worker_url: ""  # 留空，使用本地统计作为备用
     ```

3. **重新构建和部署**：
   ```bash
   hexo clean
   hexo generate
   # 推送到 GitHub，Cloudflare Pages 会自动部署
   ```

**注意**：Cloudflare Web Analytics 免费版**不提供 API 访问**，所以必须创建 Cloudflare Worker 来通过 API 获取统计数据。如果没有配置 Worker URL，将显示 "-"。

### 方式 2：使用 Cloudflare Workers API（获取真实数据）

如果需要显示真实的 Cloudflare 统计数据，需要创建 Cloudflare Worker：

1. **创建 Cloudflare Worker**：
   - 在 Cloudflare Dashboard 中创建新的 Worker
   - 使用以下代码：

```javascript
export default {
  async fetch(request, env) {
    // 使用 Cloudflare Analytics API 获取数据
    const accountId = 'YOUR_ACCOUNT_ID';
    const apiToken = 'YOUR_API_TOKEN';
    const zoneTag = 'YOUR_ZONE_TAG';
    
    const query = `
      query {
        viewer {
          zones(filter: {zoneTag: "${zoneTag}"}) {
            httpRequests1dGroups(
              limit: 1
              filter: {
                date_geq: "${getDateString(-30)}"
              }
              orderBy: [date_DESC]
            ) {
              sum {
                pageViews
                requests
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    // 处理并返回数据
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

2. **配置 Worker URL**：
   - 在 `_config.yml` 中设置 `worker_url: "https://your-worker.your-subdomain.workers.dev"`

## 当前实现

当前实现**仅使用 Cloudflare 真实数据**：
- ✅ 必须配置 Cloudflare Worker URL 才能获取数据
- ⚠️ 如果没有配置 Worker URL，将显示 "-"
- ✅ 显示的是真实的全局统计数据

## 推荐方案

**必需步骤**：
1. 启用 Cloudflare Web Analytics（用于数据收集）
2. 创建 Cloudflare Worker 来通过 API 获取统计数据
3. 配置 Worker URL 到主题配置中

**或者使用其他统计服务**：
- 51la 统计（推荐，免费且简单）
- 百度统计
- Google Analytics

## 配置示例

```yaml
# themes/hexo-theme-butterfly/_config.yml

# 关闭其他统计服务
busuanzi:
  site_uv: false
  site_pv: false

statistics_51la:
  enable: false

local_statistics:
  enable: false

# 启用 Cloudflare Analytics
cloudflare_analytics:
  enable: true
  token: "您的 Token"
  worker_url: ""  # 可选：Worker URL
```

## 获取 Cloudflare Web Analytics Token

1. 登录 Cloudflare Dashboard
2. 进入 **Analytics** → **Web Analytics**
3. 找到您的网站
4. 点击 **Settings**
5. 复制 **Token**（格式类似：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）

## 测试

配置完成后：
1. 重新构建网站
2. 访问网站
3. 查看侧边栏的统计数据是否显示

如果显示数字而不是 "-"，说明配置成功！

