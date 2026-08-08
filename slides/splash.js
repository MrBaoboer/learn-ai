/**
 * splash.js
 * 站内推荐弹层（内容由管理后台下发，后台称「拍脸图」）
 *
 * ⚠️ 命名约束（2026-08-07 血的教训，改名前务必读完）
 * 本文件的前身叫 interstitial-ad.js，走 /api/ad/active 取数、/ad/track 埋点、
 * 图片放 /uploads/ad/、DOM 用 xueai-iad-* 前缀。结果整条链路被浏览器广告
 * 拦截插件按 EasyList 规则逐层拦截（`-ad.js` 命中文件名、`/ad/` 命中路径、
 * `[id*=ad]` 命中元素），弹层对绝大多数访客根本不存在：当日 nav-inject.js
 * 被请求 23,039 次，本脚本只被请求 141 次。
 * 因此：文件名、URL 路径、DOM id/class、localStorage 键里都**不得**出现
 * ad / ads / banner / promo / sponsor / popup 等字样。splash 一词已在真实
 * 装有 AdBlock Pro 的浏览器上验证可通过。
 *
 * 逻辑：
 * 1. 页面加载后请求 /api/splash/active 获取当前启用的一条（后台没启用则不弹）
 * 2. 按后台配置的 show_mode 检查是否需要展示：
 *    always=每次访问都弹；daily=每天一次（UTC+8 日期隔离）；once=仅弹一次
 * 3. 未展示则延迟 800ms 弹出（避开页面初始化）
 * 4. 点击图片 / 标题 / 按钮：新标签跳转链接 + 关闭弹窗 + 记录今日已展示
 * 5. 点击关闭按钮：仅关闭弹窗 + 记录今日已展示
 * 6. 弹窗后方页面背景模糊
 *
 * 下架方式：在管理后台把它「下线」即可，无需改代码。
 */
(function () {
  'use strict';

  /* ── 语言检测：优先读 i18n.js 注入的 window.XUEAI_I18N.lang，
     其次从文件名后缀判断，默认中文 ── */
  var _lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang)
    || (location.pathname.match(/\.(en)\.html?$/) ? 'en'
       : location.pathname.match(/\.(ko)\.html?$/) ? 'ko' : 'zh');

  /* ── 三语字典（仅 aria-label 等用户可见字符串） ── */
  var _SP_T = {
    zh: { overlayLabel: '推荐', closeLabel: '关闭' },
    en: { overlayLabel: 'Recommended', closeLabel: 'Close' },
    ko: { overlayLabel: '추천',        closeLabel: '닫기'  }
  };
  var SP_T = _SP_T[_lang] || _SP_T.zh;

  // 由 /api/splash/active 填充：{ key, title, body, cta, tag, notice, image_url, link_url, show_mode }
  var SP = null;

  var STORAGE_KEY_PREFIX = 'xueai_sp_shown_';
  var DELAY_MS = 800;

  function getStorageKey() {
    // once：不带日期，永久生效；daily：按 UTC+8 日期隔离，跨天失效
    if (SP.show_mode === 'once') return STORAGE_KEY_PREFIX + SP.key;
    var utc8 = new Date(Date.now() + 8 * 60 * 60 * 1000);
    return STORAGE_KEY_PREFIX + SP.key + '_' + utc8.toISOString().slice(0, 10);
  }

  function isShown() {
    if (SP.show_mode === 'always') return false;
    try {
      return !!localStorage.getItem(getStorageKey());
    } catch (e) {
      return false;
    }
  }

  function markShown() {
    if (SP.show_mode === 'always') return;
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

  function closeSplash() {
    var overlay = document.getElementById('xueai-sp-overlay');
    if (!overlay) return;
    overlay.classList.remove('xueai-sp-visible');
    markShown();
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 350);
  }

  function trackEvent(eventType) {
    try {
      var body = 'ad_id=' + encodeURIComponent(SP.key) + '&event=' + encodeURIComponent(eventType);
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/splash/event', new Blob([body], { type: 'application/x-www-form-urlencoded' }));
      } else {
        fetch('/api/splash/event', {
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
    window.open(SP.link_url, '_blank', 'noopener,noreferrer');
    closeSplash();
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
    if (document.getElementById('xueai-sp-styles')) return;
    var style = document.createElement('style');
    style.id = 'xueai-sp-styles';
    style.textContent = [
      '#xueai-sp-overlay {',
      '  position: fixed; inset: 0; z-index: 99999;',
      '  display: flex; align-items: center; justify-content: center;',
      '  padding: 20px;',
      '  opacity: 0; pointer-events: none;',
      '  transition: opacity 0.3s ease;',
      '}',
      '#xueai-sp-overlay.xueai-sp-visible { opacity: 1; pointer-events: auto; }',
      '.xueai-sp-backdrop {',
      '  position: absolute; inset: 0;',
      '  background: rgba(15, 23, 42, 0.45);',
      '  backdrop-filter: blur(10px);',
      '  -webkit-backdrop-filter: blur(10px);',
      '}',
      '.xueai-sp-card {',
      '  position: relative;',
      '  background: #ffffff;',
      '  border-radius: 18px;',
      '  overflow: hidden;',
      '  width: 100%; max-width: 560px;',
      '  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);',
      '  transform: translateY(18px) scale(0.95);',
      '  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);',
      '}',
      '#xueai-sp-overlay.xueai-sp-visible .xueai-sp-card { transform: translateY(0) scale(1); }',
      '.xueai-sp-close {',
      '  position: absolute; top: 12px; right: 12px;',
      '  width: 34px; height: 34px; border-radius: 50%; border: none;',
      '  background: rgba(0, 0, 0, 0.4); color: #fff;',
      '  display: flex; align-items: center; justify-content: center;',
      '  cursor: pointer; z-index: 2;',
      '  backdrop-filter: blur(4px); transition: background 0.2s;',
      '}',
      '.xueai-sp-close:hover { background: rgba(0, 0, 0, 0.62); }',
      '.xueai-sp-image-wrap {',
      '  width: 100%; overflow: hidden; display: block; cursor: pointer; line-height: 0;',
      '  aspect-ratio: 3 / 2;',
      '  background: linear-gradient(135deg, #fdf0e4 0%, #f7e3d4 100%);',
      '}',
      '.xueai-sp-image-wrap:hover .xueai-sp-image { transform: scale(1.03); }',
      '.xueai-sp-image { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 0.4s ease; }',
      '.xueai-sp-content { padding: 18px 22px 20px; }',
      '.xueai-sp-tag {',
      '  display: inline-block; font-size: 11px; font-weight: 600;',
      '  color: #b45309; background: #fef3c7;',
      '  padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;',
      '}',
      '.xueai-sp-title {',
      '  font-size: 20px; font-weight: 800; color: #1e293b;',
      '  line-height: 1.4; margin: 0 0 10px; cursor: pointer;',
      '  transition: color 0.15s;',
      '}',
      '.xueai-sp-title:hover { color: #ea580c; }',
      '.xueai-sp-body {',
      '  font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 16px;',
      '}',
      '.xueai-sp-cta {',
      '  display: block; width: 100%; box-sizing: border-box;',
      '  text-align: center; text-decoration: none;',
      '  font-size: 15px; font-weight: 700; color: #fff;',
      '  padding: 13px 16px; border-radius: 12px; border: none; cursor: pointer;',
      '  background: linear-gradient(135deg, #f59e0b 0%, #ef6f47 100%);',
      '  box-shadow: 0 8px 24px rgba(239, 111, 71, 0.35);',
      '  transition: transform 0.15s ease, box-shadow 0.15s ease;',
      '}',
      '.xueai-sp-cta:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(239, 111, 71, 0.45); }',
      '.xueai-sp-cta:active { transform: translateY(0); }',
      '.xueai-sp-notice {',
      '  margin-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;',
      '}',
      '@media (max-width: 480px) {',
      '  .xueai-sp-card { border-radius: 14px; }',
      '  .xueai-sp-content { padding: 16px 18px 18px; }',
      '  .xueai-sp-title { font-size: 18px; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'xueai-sp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', SP_T.overlayLabel);

    overlay.innerHTML = [
      '<div class="xueai-sp-backdrop"></div>',
      '<div class="xueai-sp-card">',
      '  <button class="xueai-sp-close" aria-label="' + SP_T.closeLabel + '" id="xueai-sp-close-btn">',
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      '  </button>',
      '  <div class="xueai-sp-image-wrap" id="xueai-sp-img-wrap">',
      '    <img src="' + escapeAttr(SP.image_url) + '" alt="' + escapeAttr(SP.title) + '" class="xueai-sp-image">',
      '  </div>',
      '  <div class="xueai-sp-content">',
      (SP.tag ? '    <span class="xueai-sp-tag">' + escapeHtml(SP.tag) + '</span>' : ''),
      '    <div class="xueai-sp-title" id="xueai-sp-title">' + escapeHtml(SP.title) + '</div>',
      (SP.body ? '    <p class="xueai-sp-body">' + escapeHtml(SP.body).replace(/\n/g, '<br>') + '</p>' : ''),
      '    <button class="xueai-sp-cta" id="xueai-sp-cta">' + escapeHtml(SP.cta) + '</button>',
      (SP.notice ? '    <div class="xueai-sp-notice">' + escapeHtml(SP.notice) + '</div>' : ''),
      '  </div>',
      '</div>',
    ].join('');

    return overlay;
  }

  function showSplash() {
    injectStyles();
    var overlay = buildOverlay();
    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('xueai-sp-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSplash();
      });
    }

    ['xueai-sp-img-wrap', 'xueai-sp-title', 'xueai-sp-cta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', goLink);
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('xueai-sp-visible');
        trackEvent('view');
      });
    });
  }

  function init() {
    // 同一页面只跑一次：老版 nav-inject.js 缓存里加载的 interstitial-ad.js
    // 会委托到本脚本，若新旧两条路径同时命中，这里兜住重复弹层。
    if (window.__xueaiSplashInit) return;
    window.__xueaiSplashInit = true;

    fetch('/api/splash/active', { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok || !data.ad || !data.ad.key || !data.ad.link_url) return;
        SP = data.ad;
        if (isShown()) return;
        setTimeout(showSplash, DELAY_MS);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
