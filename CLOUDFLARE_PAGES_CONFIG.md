# Cloudflare Pages 配置指南

## ⚠️ 重要：项目类型选择

**关键区别**：
- **Cloudflare Pages**：用于部署静态网站（如 Hexo 博客）
  - 不需要 "Deploy command"
  - 自动部署构建输出目录中的静态文件
  - 适合：Hexo、Next.js 静态导出、Vue/React 静态站点等

- **Cloudflare Workers**：用于运行服务器端代码
  - **需要** "Deploy command"（必填）
  - 需要 Wrangler 部署
  - 适合：API、边缘函数、动态服务等

**您的项目是静态 Hexo 博客，应该使用 Pages，不是 Workers！**

## ⚠️ 重要配置

### 1. 构建设置（Build Settings）

在 Cloudflare Pages 项目设置中，**Builds & deployments** 部分：

- **Build command（构建命令）**: `npm run build`
  - ✅ 正确：`npm run build`
  - ❌ 错误：`yarn run build`、`npm run deploy`、`hexo deploy`

- **Build output directory（构建输出目录）**: `public`
  - 这是 Hexo 生成静态文件的目录

- **Root directory（根目录）**: 留空（或 `/`）

- **⚠️ 重要：检查是否有 Deploy command 或 Post-build command**
  - 如果有这些字段，**必须留空**或删除
  - Cloudflare Pages 会自动部署，不需要任何 deploy 命令
  - 如果配置了 deploy 命令，会导致 Wrangler 错误

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
Failed: error occurred while running deploy command
```
**原因**: 
- 配置了 "Deploy command" 或 "Post-build command"
- 项目被错误识别为 Workers 项目
- 构建命令配置错误（使用了 `deploy` 命令）

**解决步骤**:

#### 情况 A: "Deploy command" 是可选的（可以删除）
1. 在 Cloudflare Pages 设置中，检查 **Builds & deployments** → **Build configuration**
2. **删除或清空**以下字段：
   - "Deploy command"（部署命令）
   - "Non-production branch deploy command"（非生产分支部署命令）
3. 确保 **Build command** 是 `npm run build`
4. 确保 **Build output directory** 是 `public`

#### 情况 B: "Deploy command" 显示为必填（Required）⚠️
这说明项目被创建为 **Workers 项目**，而不是 **Pages 项目**。

**这是错误的项目类型！静态站点应该使用 Pages，不是 Workers。**

**正确解决方案**：

1. **删除当前的 Workers 项目**（如果已创建）

2. **创建新的 Pages 项目**：
   - 在 Cloudflare Dashboard 左侧菜单，点击 **"Pages"**（不是 "Workers"）
   - 点击 **"Create a project"** 或 **"Connect to Git"**
   - 选择 **"Connect to Git"**
   - 选择您的 GitHub 仓库：`didadida262/hhvcg_Blog_v2`
   - 在配置页面中：
     - **Project name**: `milesblog`（或您喜欢的名称）
     - **Build command**: `npm run build`
     - **Build output directory**: `public`
     - **Framework preset**: 选择 "None" 或 "Hexo"（如果有）
     - **⚠️ 重要**：Pages 项目**不会**有 "Deploy command" 字段（这是正常的！）

3. **环境变量设置**：
   - 在项目创建后，进入 **Settings** → **Environment variables**
   - 添加 `NODE_VERSION` = `20`

4. **完成**：
   - 点击 "Save and Deploy"
   - Cloudflare Pages 会自动构建和部署您的静态站点

**注意**：如果您看到 "Configure your Worker project" 这样的标题，说明您进入了错误的创建流程。请确保选择的是 **Pages**，不是 **Workers**。

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

