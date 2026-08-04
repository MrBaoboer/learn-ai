/**
 * interstitial-ad.js
 * 拍脸图广告弹窗（动态配置版：内容由管理后台下发）
 *
 * 逻辑：
 * 1. 页面加载后请求 /api/ad/active 获取当前启用的拍脸图（后台没启用则不弹）
 * 2. 按后台配置的 show_mode 检查是否需要展示：
 *    always=每次访问都弹；daily=每天一次（UTC+8 日期隔离）；once=仅弹一次
 * 3. 未展示则延迟 800ms 弹出（避开页面初始化）
 * 4. 点击图片 / 标题 / 按钮：新标签跳转链接 + 关闭弹窗 + 记录今日已展示
 * 5. 点击关闭按钮：仅关闭弹窗 + 记录今日已展示
 * 6. 弹窗后方页面背景模糊
 *
 * 下架方式：在管理后台把拍脸图「下线」即可，无需改代码。
 */
(function () {
  'use strict';

  var AD = null; // 由 /api/ad/active 填充：{ key, title, body, cta, tag, notice, image_url, link_url, show_mode }

  var STORAGE_KEY_PREFIX = 'xueai_iad_shown_';
  var DELAY_MS = 800;

  function getStorageKey() {
    // once：不带日期，永久生效；daily：按 UTC+8 日期隔离，跨天失效
    if (AD.show_mode === 'once') return STORAGE_KEY_PREFIX + AD.key;
    var utc8 = new Date(Date.now() + 8 * 60 * 60 * 1000);
    return STORAGE_KEY_PREFIX + AD.key + '_' + utc8.toISOString().slice(0, 10);
  }

  function isShown() {
    if (AD.show_mode === 'always') return false;
    try {
      return !!localStorage.getItem(getStorageKey());
    } catch (e) {
      return false;
    }
  }

  function markShown() {
    if (AD.show_mode === 'always') return;
    try {
      var key = getStorageKey();
      localStorage.setItem(key, '1');
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(STORAGE_KEY_PREFIX) === 0 && k !== key) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {}
  }

  function closeAd() {
    var overlay = document.getElementById('xueai-iad-overlay');
    if (!overlay) return;
    overlay.classList.remove('xueai-iad-visible');
    markShown();
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 350);
  }

  function trackEvent(eventType) {
    try {
      var body = 'ad_id=' + encodeURIComponent(AD.key) + '&event=' + encodeURIComponent(eventType);
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/ad/track', new Blob([body], { type: 'application/x-www-form-urlencoded' }));
      } else {
        fetch('/ad/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body,
          keepalive: true,
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function goLink() {
    trackEvent('click');
    window.open(AD.link_url, '_blank', 'noopener,noreferrer');
    closeAd();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function injectStyles() {
    if (document.getElementById('xueai-iad-styles')) return;
    var style = document.createElement('style');
    style.id = 'xueai-iad-styles';
    style.textContent = [
      '#xueai-iad-overlay {',
      '  position: fixed; inset: 0; z-index: 99999;',
      '  display: flex; align-items: center; justify-content: center;',
      '  padding: 20px;',
      '  opacity: 0; pointer-events: none;',
      '  transition: opacity 0.3s ease;',
      '}',
      '#xueai-iad-overlay.xueai-iad-visible { opacity: 1; pointer-events: auto; }',
      '.xueai-iad-backdrop {',
      '  position: absolute; inset: 0;',
      '  background: rgba(15, 23, 42, 0.45);',
      '  backdrop-filter: blur(10px);',
      '  -webkit-backdrop-filter: blur(10px);',
      '}',
      '.xueai-iad-card {',
      '  position: relative;',
      '  background: #ffffff;',
      '  border-radius: 18px;',
      '  overflow: hidden;',
      '  width: 100%; max-width: 560px;',
      '  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);',
      '  transform: translateY(18px) scale(0.95);',
      '  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);',
      '}',
      '#xueai-iad-overlay.xueai-iad-visible .xueai-iad-card { transform: translateY(0) scale(1); }',
      '.xueai-iad-close {',
      '  position: absolute; top: 12px; right: 12px;',
      '  width: 34px; height: 34px; border-radius: 50%; border: none;',
      '  background: rgba(0, 0, 0, 0.4); color: #fff;',
      '  display: flex; align-items: center; justify-content: center;',
      '  cursor: pointer; z-index: 2;',
      '  backdrop-filter: blur(4px); transition: background 0.2s;',
      '}',
      '.xueai-iad-close:hover { background: rgba(0, 0, 0, 0.62); }',
      '.xueai-iad-image-wrap {',
      '  width: 100%; overflow: hidden; display: block; cursor: pointer; line-height: 0;',
      '  aspect-ratio: 3 / 2;',
      '  background: linear-gradient(135deg, #fdf0e4 0%, #f7e3d4 100%);',
      '}',
      '.xueai-iad-image-wrap:hover .xueai-iad-image { transform: scale(1.03); }',
      '.xueai-iad-image { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 0.4s ease; }',
      '.xueai-iad-content { padding: 18px 22px 20px; }',
      '.xueai-iad-tag {',
      '  display: inline-block; font-size: 11px; font-weight: 600;',
      '  color: #b45309; background: #fef3c7;',
      '  padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;',
      '}',
      '.xueai-iad-title {',
      '  font-size: 20px; font-weight: 800; color: #1e293b;',
      '  line-height: 1.4; margin: 0 0 10px; cursor: pointer;',
      '  transition: color 0.15s;',
      '}',
      '.xueai-iad-title:hover { color: #ea580c; }',
      '.xueai-iad-body {',
      '  font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 16px;',
      '}',
      '.xueai-iad-cta {',
      '  display: block; width: 100%; box-sizing: border-box;',
      '  text-align: center; text-decoration: none;',
      '  font-size: 15px; font-weight: 700; color: #fff;',
      '  padding: 13px 16px; border-radius: 12px; border: none; cursor: pointer;',
      '  background: linear-gradient(135deg, #f59e0b 0%, #ef6f47 100%);',
      '  box-shadow: 0 8px 24px rgba(239, 111, 71, 0.35);',
      '  transition: transform 0.15s ease, box-shadow 0.15s ease;',
      '}',
      '.xueai-iad-cta:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(239, 111, 71, 0.45); }',
      '.xueai-iad-cta:active { transform: translateY(0); }',
      '.xueai-iad-notice {',
      '  margin-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;',
      '}',
      '@media (max-width: 480px) {',
      '  .xueai-iad-card { border-radius: 14px; }',
      '  .xueai-iad-content { padding: 16px 18px 18px; }',
      '  .xueai-iad-title { font-size: 18px; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'xueai-iad-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '推广弹窗');

    overlay.innerHTML = [
      '<div class="xueai-iad-backdrop"></div>',
      '<div class="xueai-iad-card">',
      '  <button class="xueai-iad-close" aria-label="关闭" id="xueai-iad-close-btn">',
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      '  </button>',
      '  <div class="xueai-iad-image-wrap" id="xueai-iad-img-wrap">',
      '    <img src="' + escapeAttr(AD.image_url) + '" alt="' + escapeAttr(AD.title) + '" class="xueai-iad-image">',
      '  </div>',
      '  <div class="xueai-iad-content">',
      (AD.tag ? '    <span class="xueai-iad-tag">' + escapeHtml(AD.tag) + '</span>' : ''),
      '    <div class="xueai-iad-title" id="xueai-iad-title">' + escapeHtml(AD.title) + '</div>',
      (AD.body ? '    <p class="xueai-iad-body">' + escapeHtml(AD.body).replace(/\n/g, '<br>') + '</p>' : ''),
      '    <button class="xueai-iad-cta" id="xueai-iad-cta">' + escapeHtml(AD.cta) + '</button>',
      (AD.notice ? '    <div class="xueai-iad-notice">' + escapeHtml(AD.notice) + '</div>' : ''),
      '  </div>',
      '</div>',
    ].join('');

    return overlay;
  }

  function showAd() {
    injectStyles();
    var overlay = buildOverlay();
    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('xueai-iad-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAd();
      });
    }

    ['xueai-iad-img-wrap', 'xueai-iad-title', 'xueai-iad-cta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', goLink);
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('xueai-iad-visible');
        trackEvent('view');
      });
    });
  }

  function init() {
    fetch('/api/ad/active', { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok || !data.ad || !data.ad.key || !data.ad.link_url) return;
        AD = data.ad;
        if (isShown()) return;
        setTimeout(showAd, DELAY_MS);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
