# Cloudflare Pages 部署配置说明

## 问题
Cloudflare Pages 默认使用 `yarn run build` 作为构建命令，但项目已配置为使用 npm。

## 解决方案

### 1. 在 Cloudflare Pages 中配置构建设置

登录 Cloudflare Dashboard，进入您的 Pages 项目设置：

1. 进入 **Settings** → **Builds & deployments**
2. 找到 **Build configuration** 部分
3. 修改以下设置：
   - **Build command**: 改为 `npm run build`（或使用 `bash build.sh`）
   - **Build output directory**: `public`
   - **Root directory**: 留空（或设置为项目根目录）

### 2. 环境变量配置（可选）

在 **Settings** → **Environment variables** 中添加：

- `NODE_VERSION`: `18`
- `NPM_FLAGS`: `--legacy-peer-deps`（如果需要）

### 3. 已完成的配置

项目已包含以下配置文件：
- ✅ `package-lock.json` - npm 锁文件
- ✅ `.npmrc` - npm 配置文件
- ✅ `.nvmrc` - Node.js 版本指定（18）
- ✅ `build.sh` - 构建脚本（使用 npm）
- ✅ `package.json` - 已添加 engines 字段

### 4. 构建命令选项

您可以选择以下任一构建命令：

**选项 1（推荐）**：
```
npm run build
```

**选项 2**：
```
bash build.sh
```

**选项 3**：
```
npm install && npm run build
```

## 验证

配置完成后，重新部署项目。构建日志应该显示：
- 使用 npm 安装依赖
- 执行 `hexo generate` 生成静态文件
- 构建成功

