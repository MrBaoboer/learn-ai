/**
 * interstitial-ad.js — 已废弃，仅为兼容浏览器里缓存的旧版 nav-inject.js。
 *
 * 实现已整体迁到 splash.js：本文件名命中广告拦截插件的 `-ad.js` 规则，
 * 装了插件的访客根本请求不到它（详见 splash.js 头部注释与 CHANGELOG
 * BUG-SPLASH-INVISIBLE）。这里只留一层委托，让缓存了旧 nav-inject.js
 * 的**未装插件**访客在缓存过期前仍能正常看到弹层；装了插件的访客本来
 * 就加载不到本文件，行为不变。
 *
 * 待线上不再出现对本文件的请求后即可删除（观察 nginx access.log）。
 */
(function () {
  if (window.__xueaiSplashInit) return;
  var s = document.createElement('script');
  s.src = 'splash.js?v=20260807';
  s.async = true;
  document.head.appendChild(s);
})();
