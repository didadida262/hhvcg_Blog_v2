// 51la统计数据处理 (新版本 SDK)
// 注意：51la 新版本 SDK 主要用于数据收集，统计数据需要在 51la 后台查看
// 前端显示需要通过 51la API 获取，但免费版可能不提供 API 访问
(function() {
  'use strict';

  // 配置：51la 统计 ID（从主题配置获取）
  const LA_ID = window.LA_ID || '';

  // 从 51la API 获取统计数据
  async function fetch51laStats() {
    // 注意：51la 可能不提供公开的 API 来获取统计数据
    // 免费版通常只能在后台查看数据
    
    // 尝试方法1: 通过 51la 可能的 API 端点（需要验证）
    // 注意：这可能需要认证或可能不存在
    
    // 尝试方法2: 检查 LA 对象是否有获取数据的方法
    if (typeof LA !== 'undefined') {
      // 新版本 SDK 可能不直接提供统计数据获取方法
      // 统计数据主要在 51la 后台查看
      console.log('51la SDK 已加载，统计数据请在 51la 后台查看');
    }

    // 如果无法通过 API 获取，返回 null
    return { uv: null, pv: null };
  }

  // 更新显示
  function updateDisplay(stats) {
    // 更新UV显示
    const uvElement = document.getElementById('51la_site_uv');
    if (uvElement) {
      if (stats.uv !== null && stats.uv !== undefined) {
        uvElement.textContent = typeof stats.uv === 'number' ? stats.uv.toLocaleString() : stats.uv;
      } else {
        uvElement.textContent = '-';
      }
    }

    // 更新PV显示
    const pvElement = document.getElementById('51la_site_pv');
    if (pvElement) {
      if (stats.pv !== null && stats.pv !== undefined) {
        pvElement.textContent = typeof stats.pv === 'number' ? stats.pv.toLocaleString() : stats.pv;
      } else {
        pvElement.textContent = '-';
      }
    }
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', async function() {
    // 等待51la SDK 加载完成
    setTimeout(async () => {
      const stats = await fetch51laStats();
      updateDisplay(stats);
    }, 3000);
  });

  console.log('51la统计脚本已加载');
  console.log('提示：51la 统计数据主要在后台查看，前端显示可能需要 API 访问权限');
})();
