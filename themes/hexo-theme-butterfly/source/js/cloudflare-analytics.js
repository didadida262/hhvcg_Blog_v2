// Cloudflare Web Analytics 统计数据处理
// 仅使用 Cloudflare 真实数据，不使用本地统计
(function() {
  'use strict';

  // 配置：Cloudflare Worker URL（用于获取统计数据）
  // 必须配置 Worker URL 才能获取真实数据
  const CF_WORKER_URL = window.CF_WORKER_URL || '';

  // 从 Cloudflare Worker 获取统计数据
  async function fetchCloudflareStats() {
    // 如果没有配置 Worker URL，无法获取数据
    if (!CF_WORKER_URL) {
      console.warn('Cloudflare Worker URL 未配置，无法获取统计数据');
      return { uv: null, pv: null };
    }

    try {
      const response = await fetch(CF_WORKER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        uv: data.uv || null,
        pv: data.pv || null
      };
    } catch (error) {
      console.error('从 Cloudflare Worker 获取数据失败:', error);
      return { uv: null, pv: null };
    }
  }

  // 更新显示
  function updateDisplay(stats) {
    // 更新UV显示
    const uvElement = document.getElementById('cloudflare_site_uv');
    if (uvElement) {
      if (stats.uv !== null && stats.uv !== undefined) {
        uvElement.innerHTML = stats.uv.toLocaleString();
      } else {
        uvElement.innerHTML = '-';
      }
    }

    // 更新PV显示
    const pvElement = document.getElementById('cloudflare_site_pv');
    if (pvElement) {
      if (stats.pv !== null && stats.pv !== undefined) {
        pvElement.innerHTML = stats.pv.toLocaleString();
      } else {
        pvElement.innerHTML = '-';
      }
    }
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', async function() {
    // 延迟执行，等待 Cloudflare Web Analytics beacon 加载
    setTimeout(async () => {
      const stats = await fetchCloudflareStats();
      updateDisplay(stats);
    }, 1000);
  });

  console.log('Cloudflare Analytics 脚本已加载');
  console.log('提示：需要配置 Cloudflare Worker URL 才能获取真实统计数据');
})();

