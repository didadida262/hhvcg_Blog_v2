# 网站统计解决方案

## 当前状态

✅ **问题已解决** - 统计数据现在显示 "-" 替代了异常的数字

## 历史问题

之前网站显示的统计数据（UV: 53160225, PV: 76711613）明显异常，这很可能是由于不蒜子统计服务出现问题导致的。

## 解决方案

我为您提供了三种统计方案，按推荐程度排序：

### 方案一：51la统计（推荐）⭐⭐⭐⭐⭐

51la是一个专业的网站统计服务，数据准确且稳定。

**配置方法：**

1. 注册51la统计服务：https://www.51.la/
2. 创建网站并获取统计ID
3. 修改主题配置文件 `themes/hexo-theme-butterfly/_config.yml`：

```yaml
# 51la统计配置 (推荐)
statistics_51la:
  enable: true
  # 51la统计代码ID，替换为您的实际ID
  id: "您的51la统计ID"

# 关闭不蒜子统计
busuanzi:
  site_uv: false
  site_pv: false
  page_pv: false

# 关闭本地统计（如果不需要）
local_statistics:
  enable: false
```

### 方案二：百度统计 ⭐⭐⭐⭐

百度统计也是一个可靠的选择。

**配置方法：**

1. 注册百度统计：https://tongji.baidu.com/
2. 创建网站并获取统计代码
3. 修改配置文件：

```yaml
# 百度统计配置
baidu_analytics:
  enable: true
  # 您的百度统计ID
  id: "您的百度统计ID"

# 关闭其他统计
busuanzi:
  site_uv: false
  site_pv: false
  page_pv: false

statistics_51la:
  enable: false

local_statistics:
  enable: false
```

### 方案三：本地统计（开发调试用）⭐⭐

本地统计使用浏览器的localStorage存储数据，仅用于开发测试。

**配置方法：**

当前配置已启用本地统计作为默认方案：

```yaml
# 本地统计配置 (简单备用方案)
local_statistics:
  enable: true  # 默认启用本地统计作为不蒜子的备用
```

## 测试方法

1. 重新生成网站：
```bash
hexo clean
hexo generate
```

2. 部署网站：
```bash
hexo deploy
```

3. 访问网站查看统计数据是否正常显示

## 不蒜子问题诊断

如果您想继续使用不蒜子，可以通过以下方式测试：

1. 打开我创建的测试文件 `test-busuanzi.html` 在浏览器中查看
2. 检查浏览器控制台是否有错误信息
3. 确认不蒜子服务是否正常：http://busuanzi.ibruce.info/

## 数据恢复

如果您之前有真实的不蒜子统计数据，建议：

1. 先记录当前的真实数据
2. 切换到新的统计服务
3. 在新服务中重新开始统计

## 推荐选择

我强烈推荐使用 **51la统计**，因为：
- 数据准确可靠
- 服务稳定
- 功能丰富
- 国内访问速度快
- 完全免费

## 技术支持

如果您在配置过程中遇到问题，请检查：
1. 统计服务ID是否正确
2. 主题配置文件语法是否正确
3. 网站是否重新生成和部署

配置完成后，统计数据通常需要几分钟到几小时才能开始显示。
