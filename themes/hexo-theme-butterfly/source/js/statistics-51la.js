// 51la统计数据处理
(function() {
  'use strict';

  // 51la统计数据处理函数
  function update51laStats() {
    // 51la统计代码会在全局变量中存储数据
    // 通常51la会提供以下数据：
    // _51la_site_uv: 网站访客数
    // _51la_site_pv: 网站访问量

    // 检查51la数据是否可用
    if (typeof _51la_site_uv !== 'undefined' && typeof _51la_site_pv !== 'undefined') {
      // 更新UV显示
      const uvElement = document.getElementById('51la_site_uv');
      if (uvElement) {
        uvElement.textContent = _51la_site_uv;
      }

      // 更新PV显示
      const pvElement = document.getElementById('51la_site_pv');
      if (pvElement) {
        pvElement.textContent = _51la_site_pv;
      }

      console.log('51la统计数据已更新:', {
        uv: _51la_site_uv,
        pv: _51la_site_pv
      });
    }
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 等待51la脚本加载完成
    setTimeout(update51laStats, 2000);

    // 如果51la数据在后续更新，可以通过轮询检查
    let checkCount = 0;
    const checkInterval = setInterval(function() {
      update51laStats();
      checkCount++;

      // 10秒后停止检查
      if (checkCount >= 10) {
        clearInterval(checkInterval);
      }
    }, 1000);
  });

  // 如果51la脚本动态加载完成，也会触发更新
  if (typeof _51la_site_uv !== 'undefined') {
    document.addEventListener('51laDataReady', update51laStats);
  }

  console.log('51la统计脚本已加载');
})();
