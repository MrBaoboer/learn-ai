/**
 * watermark.js — 登录用户的页面追溯水印 + 反调试（课程页 / learn / jd 共用）
 *
 * 目的：本站是免费公益站，有人把内容打包进付费课包倒卖。给登录用户的
 * 页面铺上与账号绑定的水印，泄露的截图 / 录屏就能追溯到具体账号。
 *
 * 两层水印，内容都是服务端 /auth/me 下发的追溯码（uid 的 HMAC，
 * 明文 uid 不出现在页面上）：
 *   明水印  很淡但肉眼可辨，同时也是「此页可追溯」的告示，本身就有威慑力
 *   暗水印  透明度低到肉眼不可辨，盗版方即使 P 掉明水印，原始截图提高
 *           对比度后暗水印仍能显形（alpha 0.03 在 8bit 通道上约差 7 个
 *           灰阶；实测 0.02 会被细字抗锯齿稀释到无法稳定恢复）
 *
 * 反调试（仅登录 + 非触屏设备）：
 *   快捷键  F12 与 Ctrl/Cmd + Shift/Alt + I/J/C/K 一律拦截并把页面销毁成
 *           空白（覆盖 Chrome/Firefox/Safari 打开 DevTools、控制台、审查
 *           元素的各种组合）
 *   兜底    定时跑一条 debugger 语句并计时：DevTools 若已打开（含从菜单
 *           打开、独立窗口停靠等快捷键拦不到的路径）会在断点上停住，恢复
 *           后耗时远超正常值，即销毁。窗口尺寸差值检测没有用——浏览器
 *           缩放会让 outer/inner 差值失真，误伤放大页面的正常读者
 *   豁免    触屏设备（手机 / iPad / 触屏笔记本）完全跳过：这些设备上没有
 *           本地 DevTools，而误伤代价高；同时输入框内不拦字母组合键，
 *           避免 AltGr（= Ctrl+Alt）输入法在个别键盘布局下打字被误杀
 *
 * 未登录不挂：未登录本来只能看每篇章前两节的公开内容，无从追溯也无需追溯。
 * 防线止于「删节点重建 + 开 DevTools 销毁」，在 DevTools 里停用断点就能
 * 绕过——但编程能力足以绕过它的人，也伪造不出别人的追溯码，追责链路仍闭环。
 */
(function(){
  'use strict';
  var IN_FRAME = window.top !== window.self;
  /* 触屏设备一律豁免反调试。maxTouchPoints 覆盖 iPad（报 5）和触屏本，
     pointer:coarse 兜底旧设备；两者都宁可漏掉可疑桌面，不误伤真实触屏用户 */
  var TOUCH = (navigator.maxTouchPoints || 0) > 0
    || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var LIGHT_ID = 'xa-wm';
  var DARK_ID = 'xa-wm2';
  var info = null;

  /* 销毁到近似 about:blank：先清空 DOM（瞬时），再导航离开（彻底）。
     iframe 里触发时销毁的是整个顶层页面，而不是只干掉自己这一格 */
  function nuke(){
    try { window.top.document.documentElement.innerHTML = ''; } catch(e){}
    try { window.top.location.replace('about:blank'); }
    catch(e){ location.replace('about:blank'); }
  }

  function armAntiDebug(){
    if(TOUCH) return;
    document.addEventListener('keydown', function(e){
      if(e.key === 'F12'){ e.preventDefault(); e.stopPropagation(); nuke(); return; }
      var t = e.target;
      var editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
        || t.isContentEditable);
      if(editable) return; /* AltGr 打字会带上 ctrl+alt，输入场景交给兜底检测 */
      var mod = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey);
      var c = e.code;
      if(mod && (c === 'KeyI' || c === 'KeyJ' || c === 'KeyC' || c === 'KeyK')){
        e.preventDefault(); e.stopPropagation();
        nuke();
      }
    }, true);
    /* debugger 计时兜底只跑在顶层：iframe 里再跑一份只是重复销毁同一页 */
    if(!IN_FRAME && typeof performance !== 'undefined'){
      setInterval(function(){
        var t = performance.now();
        debugger;
        if(performance.now() - t > 120) nuke();
      }, 2400);
    }
  }

  function esc(s){
    return String(s).replace(/[&<>'"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  }

  /* 平铺一块斜排文字的 SVG 作为背景。透明度写死在 fill 里而不是层的
     opacity 上，想调掉得改背景图本身，比划掉一个 style 属性多几步 */
  function tile(text, w, h, deg, fill, size){
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>"
      + "<text x='" + (w / 2) + "' y='" + (h / 2) + "' text-anchor='middle' "
      + "transform='rotate(" + deg + " " + (w / 2) + " " + (h / 2) + ")' "
      + "font-family='-apple-system,PingFang SC,sans-serif' font-size='" + size + "' "
      + "fill='" + fill + "'>" + esc(text) + "</text></svg>";
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")";
  }

  function layer(id, bg, pos){
    var el = document.createElement('div');
    el.id = id;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;'
      + 'pointer-events:none;background-image:' + bg + ';background-repeat:repeat;'
      + (pos ? 'background-position:' + pos + ';' : '');
    return el;
  }

  function mount(){
    if(!info || !info.wm || !document.body) return;
    /* 明水印只放站名 + 追溯码。昵称不进水印：追溯靠码就够了，昵称只会
       把每条文字拉长、让整页更花 */
    var label = 'xueai.app \u00b7 ' + info.wm;
    if(!document.getElementById(LIGHT_ID)){
      document.body.appendChild(layer(
        LIGHT_ID, tile(label, 520, 360, -22, 'rgba(100,116,139,0.05)', 12.5)));
    }
    /* 暗水印与明水印同角度：观感上是同一套稀疏纹理，而不是两个方向的
       字交错成网。tile 尺寸差得远，重叠只是零星交叠，不会出摩尔纹；
       字号加大减少抗锯齿对本就极低的对比度的稀释，alpha 0.03 是截图
       提对比度后还能稳定显形的下限，别再往下调 */
    if(!document.getElementById(DARK_ID)){
      document.body.appendChild(layer(
        DARK_ID, tile(info.wm, 460, 300, -22, 'rgba(110,110,110,0.03)', 16),
        '230px 150px'));
    }
  }

  function ensure(){
    var a = document.getElementById(LIGHT_ID);
    var b = document.getElementById(DARK_ID);
    if(!a || !b){
      if(a) a.remove();
      if(b) b.remove();
      mount();
    }
  }

  fetch('/auth/me', {credentials: 'same-origin'})
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d || !d.logged_in || !d.wm) return;
      info = d;
      /* 反调试在顶层和 iframe 里都要装：阅读器里键盘焦点在课程 iframe 内，
         只装外层会收不到按键 */
      armAntiDebug();
      /* 水印层只铺顶层：learn.html 阅读器已覆盖全屏，iframe 里再铺一份
         就是两套纹理叠加，密度翻倍还错位。直接打开课程页时自己就是顶层 */
      if(IN_FRAME) return;
      if(document.body){ mount(); }
      else { document.addEventListener('DOMContentLoaded', mount); }
      setInterval(ensure, 4000);
      if(window.MutationObserver){
        new MutationObserver(ensure)
          .observe(document.documentElement, {childList: true, subtree: true});
      }
    })
    .catch(function(){ /* 本地预览无 /auth 接口，静默 */ });
})();
