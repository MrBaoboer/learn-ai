/**
 * track.js — xueai.app 用户行为埋点 SDK
 *
 * 背景：原埋点只有 nav-inject.js 里一发 /api/visit（只记路径，且阅读器
 * iframe 内完全不上报），看不到行为链路和停留时长。本脚本参考
 * miyang_alice BP 页面的埋点设计，把「谁、按什么顺序看了哪些页、每页
 * 停了多久」完整上报给管理后台。
 *
 * 设计意图：
 *   - visitor_id（localStorage 持久）标识匿名访客；session_id 30 分钟
 *     无活动过期重建；view_id 每次页面加载一个，是停留记录的幂等键。
 *   - 停留时长只累计页面可见时间（visibilitychange 暂停/恢复计时），
 *     切走标签页不算「在学习」。
 *   - 页面进入立即上报一发（带屏幕/来源/语言等环境信息），此后每 15 秒
 *     心跳一发，pagehide 时 sendBeacon 补发最终时长。
 *   - 阅读器 learn.html 的 iframe 内（embed 模式）照常上报并带 embed
 *     标记；learn.html 外壳自身不引入本脚本，避免时长算两遍。
 *
 * 关键约束：埋点绝不能影响浏览——所有入口都包 try/catch，localStorage
 * 不可用（隐私模式）时降级为内存 ID，本次会话仍可跟踪。
 * 服务端从 xueai_sess Cookie 关联登录用户，前端不传身份信息。
 */
(function () {
  'use strict';

  var API = '/api/track';
  var SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  var HEARTBEAT_MS = 15 * 1000;
  var VISITOR_KEY = 'xa_visitor_id';
  var SESSION_KEY = 'xa_session';

  // ── 安全存储：隐私模式下 localStorage 会抛异常，降级为内存对象 ──
  var memStore = {};
  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return memStore[key] || null; }
  }
  function lsSet(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { memStore[key] = val; }
  }

  function randomId() {
    try {
      var buf = new Uint8Array(16);
      window.crypto.getRandomValues(buf);
      var out = '';
      for (var i = 0; i < buf.length; i++) out += (buf[i] + 256).toString(16).slice(1);
      return out;
    } catch (e) {
      return 'f' + Date.now().toString(16) + Math.random().toString(16).slice(2, 12);
    }
  }

  function getVisitorId() {
    var id = lsGet(VISITOR_KEY);
    if (!id) {
      id = randomId();
      lsSet(VISITOR_KEY, id);
    }
    return id;
  }

  /**
   * 背景：行为链路要求同一次浏览（含 learn.html 内 iframe 翻页）共享
   * 一个 session_id，MPA 架构下每次换页都是全新的 JS 环境。
   * 设计意图：session 存 localStorage（同源共享，iframe 也读得到），
   * 结构 {id, last}；距上次活动超过 30 分钟即视为新会话。
   * 约束：每次心跳都要 touchSession 续期，否则长时间停留会被误切会话。
   */
  function getSessionId() {
    var now = Date.now();
    try {
      var raw = lsGet(SESSION_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.id && (now - (s.last || 0)) < SESSION_TIMEOUT_MS) {
          return s.id;
        }
      }
    } catch (e) { /* 解析失败当作无会话，走新建 */ }
    var id = randomId();
    lsSet(SESSION_KEY, JSON.stringify({ id: id, last: now }));
    return id;
  }

  function touchSession(sessionId) {
    lsSet(SESSION_KEY, JSON.stringify({ id: sessionId, last: Date.now() }));
  }

  // ── embed 模式检测（与 nav-inject.js 同逻辑）──
  var IS_EMBED = (function () {
    try {
      if (/[?&]embed=1\b/.test(location.search)) return true;
      if (window.self !== window.top) return true;
    } catch (e) { return true; }
    return false;
  })();

  var visitorId = getVisitorId();
  var sessionId = getSessionId();
  var viewId = randomId();

  // ── 可见时长计时器：只累计 visibilityState === 'visible' 的时间 ──
  var accumMs = 0;
  var visibleSince = (document.visibilityState === 'visible') ? Date.now() : null;

  function currentDurationMs() {
    return accumMs + (visibleSince ? (Date.now() - visibleSince) : 0);
  }

  function buildPayload() {
    return {
      sessionId: sessionId,
      visitorId: visitorId,
      viewId: viewId,
      path: location.pathname,
      title: (document.title || '').slice(0, 128),
      durationMs: Math.round(currentDurationMs()),
      embed: IS_EMBED,
      screenW: (window.screen && window.screen.width) || 0,
      screenH: (window.screen && window.screen.height) || 0,
      viewportW: window.innerWidth || 0,
      viewportH: window.innerHeight || 0,
      referrer: (document.referrer || '').slice(0, 512),
      language: (navigator.language || '').slice(0, 32)
    };
  }

  /**
   * 背景：页面关闭瞬间 fetch 会被浏览器取消，最后一发时长必须送达。
   * 设计意图：优先 sendBeacon（关页也保证发出），不可用时 fetch
   * keepalive 兜底；同源请求 Cookie 自动携带，服务端据此关联登录用户。
   * 约束：上报失败静默吞掉（catch 后放弃），绝不打扰用户。
   */
  function send() {
    try {
      touchSession(sessionId);
      var body = JSON.stringify(buildPayload());
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          credentials: 'same-origin',
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) { /* 埋点失败不影响浏览 */ }
  }

  document.addEventListener('visibilitychange', function () {
    try {
      if (document.visibilityState === 'hidden') {
        if (visibleSince) {
          accumMs += Date.now() - visibleSince;
          visibleSince = null;
        }
        send(); // 切走时补发一次，防止用户不再回来导致时长丢失
      } else if (!visibleSince) {
        visibleSince = Date.now();
      }
    } catch (e) { /* 计时异常不影响浏览 */ }
  });

  // pagehide 比 unload 可靠（iOS Safari 不触发 unload）
  window.addEventListener('pagehide', function () {
    try {
      if (visibleSince) {
        accumMs += Date.now() - visibleSince;
        visibleSince = null;
      }
      send();
    } catch (e) { /* 同上 */ }
  });

  // 进入立即上报（建会话/建页面记录），此后心跳仅在页面可见时发
  send();
  setInterval(function () {
    if (document.visibilityState === 'visible') send();
  }, HEARTBEAT_MS);
})();
