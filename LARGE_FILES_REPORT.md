# 大文件报告 - Cloudflare Pages 部署限制

## ⚠️ 问题说明

**Cloudflare Pages 限制**：
- 单个文件最大大小：**25 MiB**
- 这个限制**无法屏蔽或绕过**，是 Cloudflare Pages 的硬性限制

## 📊 超出限制的文件

发现以下文件超过 25 MiB 限制：

| 文件路径 | 大小 | 超出限制 |
|---------|------|---------|
| `img/threejs_md2_1.gif` | 40.87 MB | +15.87 MB |
| `img/贴图2.gif` | 35.68 MB | +10.68 MB |

**源文件位置**：
- `themes/hexo-theme-butterfly/source/img/贴图2.gif` (35.68 MB)
- `threejs_md2_1.gif` (40.87 MB) - 需要查找源文件位置

## 🔧 解决方案

### 方案 1：压缩 GIF 文件（推荐）

使用工具压缩 GIF 文件，减小文件大小：

**在线工具**：
- https://ezgif.com/optimize
- https://www.iloveimg.com/compress-image/compress-gif

**命令行工具**：
```bash
# 使用 gifsicle (需要安装)
gifsicle -O3 --colors 256 input.gif -o output.gif
```

**目标**：将文件压缩到 25 MB 以下

### 方案 2：转换为视频格式

将 GIF 转换为 MP4 或 WebM 格式（通常更小）：

```bash
# 使用 ffmpeg
ffmpeg -i input.gif -vf "fps=10,scale=800:-1" -c:v libx264 -crf 23 output.mp4
```

然后在 HTML 中使用 `<video>` 标签替代 `<img>` 标签。

### 方案 3：使用外部存储（CDN）

将大文件上传到外部存储服务，然后在博客中引用：

**推荐服务**：
- Cloudflare R2（与 Pages 集成良好）
- AWS S3
- 阿里云 OSS
- 腾讯云 COS

### 方案 4：删除或替换

如果这些文件不是必需的，可以考虑：
- 删除这些文件
- 使用更小的替代图片
- 使用占位图

## 📝 处理步骤

1. **压缩文件**：
   - 使用在线工具或命令行工具压缩 GIF
   - 确保压缩后文件小于 25 MB

2. **替换源文件**：
   - 将压缩后的文件替换源文件
   - 提交到 Git

3. **重新部署**：
   - 推送代码到 GitHub
   - Cloudflare Pages 会自动重新构建和部署

## ⚡ 快速处理命令

如果需要快速处理，可以使用以下 PowerShell 命令查找所有大文件：

```powershell
Get-ChildItem -Path . -Recurse -File -Exclude node_modules | 
  Where-Object { $_.Length -gt 25MB } | 
  Select-Object FullName, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

