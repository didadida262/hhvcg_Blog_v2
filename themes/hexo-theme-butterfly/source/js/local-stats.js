// 本地统计数据处理 - 简单的访客统计
(function() {
  'use strict';

  // 本地存储键名
  const STORAGE_KEY = 'site_stats';
  const VISITOR_KEY = 'site_visitor_id';
  const VISIT_COUNT_KEY = 'visit_count';

  // 获取或创建访客ID
  function getVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
  }

  // 获取统计数据
  function getStats() {
    const stats = localStorage.getItem(STORAGE_KEY);
    return stats ? JSON.parse(stats) : {
      totalVisitors: 0,
      totalVisits: 0,
      dailyVisitors: {},
      dailyVisits: {},
      visitors: new Set(),
      visits: new Set()
    };
  }

  // 保存统计数据
  function saveStats(stats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  // 获取今天日期字符串
  function getTodayString() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }

  // 更新统计数据
  function updateStats() {
    const visitorId = getVisitorId();
    const today = getTodayString();
    const now = Date.now();

    const stats = getStats();

    // 更新总访客数和访问量
    if (!stats.visitors.has(visitorId)) {
      stats.totalVisitors++;
      stats.visitors.add(visitorId);
    }

    stats.totalVisits++;

    // 更新今日统计
    if (!stats.dailyVisitors[today]) {
      stats.dailyVisitors[today] = new Set();
    }
    if (!stats.dailyVisits[today]) {
      stats.dailyVisits[today] = 0;
    }

    if (!stats.dailyVisitors[today].has(visitorId)) {
      stats.dailyVisitors[today].add(visitorId);
    }
    stats.dailyVisits[today]++;

    // 清理过期数据（保留30天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const date in stats.dailyVisitors) {
      if (new Date(date) < thirtyDaysAgo) {
        delete stats.dailyVisitors[date];
        delete stats.dailyVisits[date];
      }
    }

    saveStats(stats);

    return {
      uv: stats.totalVisitors,
      pv: stats.totalVisits,
      todayUV: stats.dailyVisitors[today] ? stats.dailyVisitors[today].size : 0,
      todayPV: stats.dailyVisits[today] || 0
    };
  }

  // 显示统计数据
  function displayStats() {
    const stats = updateStats();

    // 更新UV显示
    const uvElement = document.getElementById('local_site_uv');
    if (uvElement) {
      uvElement.textContent = stats.uv.toLocaleString();
    }

    // 更新PV显示
    const pvElement = document.getElementById('local_site_pv');
    if (pvElement) {
      pvElement.textContent = stats.pv.toLocaleString();
    }

    console.log('本地统计数据已更新:', stats);
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点时间以确保页面完全加载
    setTimeout(displayStats, 100);
  });

  console.log('本地统计脚本已加载');
})();
