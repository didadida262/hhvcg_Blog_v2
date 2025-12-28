# Cloudflare Pages 配置指南

## ⚠️ 重要配置

### 1. 构建设置（Build Settings）

在 Cloudflare Pages 项目设置中，**Builds & deployments** 部分：

- **Build command（构建命令）**: `npm run build`
  - ✅ 正确：`npm run build`
  - ❌ 错误：`yarn run build`、`npm run deploy`、`hexo deploy`

- **Build output directory（构建输出目录）**: `public`
  - 这是 Hexo 生成静态文件的目录

- **Root directory（根目录）**: 留空（或 `/`）

### 2. 环境变量（Environment Variables）

在 **Variables and Secrets** 中添加：

- **NODE_VERSION**: `20`
  - 必须设置，因为 Wrangler 和某些依赖需要 Node.js 20+

### 3. 关键点

1. **不要运行 deploy 命令**
   - Cloudflare Pages 会自动部署 `public` 目录中的文件
   - 不需要运行 `npm run deploy` 或 `hexo deploy`
   - 只需要运行 `npm run build` 生成静态文件

2. **构建流程**
   ```
   npm install → npm run build → Cloudflare 自动部署 public 目录
   ```

3. **package-lock.json**
   - 必须提交到 Git 仓库
   - 这样 Cloudflare Pages 才能使用 npm 而不是 yarn

## 验证清单

- [ ] 构建命令设置为 `npm run build`
- [ ] 输出目录设置为 `public`
- [ ] 环境变量 `NODE_VERSION=20` 已设置
- [ ] `package-lock.json` 已提交到 Git
- [ ] `yarn.lock` 已重命名或删除（避免冲突）

## 常见错误

### 错误 1: Wrangler 部署错误
```
If you are uploading a directory of assets...
```
**原因**: 运行了 `deploy` 命令或配置了错误的构建后命令
**解决**: 确保构建命令是 `npm run build`，不是 `npm run deploy`

### 错误 2: Node.js 版本错误
```
Wrangler requires at least Node.js v20.0.0
```
**原因**: Node.js 版本太低
**解决**: 设置环境变量 `NODE_VERSION=20`

### 错误 3: Yarn 锁文件冲突
```
The lockfile would have been modified by this install
```
**原因**: 同时存在 `yarn.lock` 和 `package-lock.json`
**解决**: 删除或重命名 `yarn.lock`，只保留 `package-lock.json`

