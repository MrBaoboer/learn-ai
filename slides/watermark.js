/**
 * watermark.js — 登录用户的页面追溯水印（全站课程页 / learn / home / jd 共用）
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
 * 未登录不挂：未登录本来只能看每篇章前两节的公开内容，无从追溯也无需追溯。
 * 防移除只做到「从 DevTools 删掉节点或改样式会立即重建」，编程能力足以
 * 绕过它的人，也伪造不出别人的追溯码——追责链路仍然闭环。
 */
(function(){
  'use strict';
  var LIGHT_ID = 'xa-wm';
  var DARK_ID = 'xa-wm2';
  var info = null;

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

  function layer(id, bg){
    var el = document.createElement('div');
    el.id = id;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;'
      + 'pointer-events:none;background-image:' + bg + ';background-repeat:repeat;';
    return el;
  }

  function mount(){
    if(!info || !info.wm || !document.body) return;
    var label = 'xueai.app \u00b7 ' + (info.nickname || '') + ' \u00b7 ' + info.wm;
    if(!document.getElementById(LIGHT_ID)){
      document.body.appendChild(layer(
        LIGHT_ID, tile(label, 360, 240, -24, 'rgba(100,116,139,0.055)', 13)));
    }
    /* 暗水印错开尺寸和角度，避免与明水印重叠成摩尔纹；字号加大减少
       抗锯齿对本就极低的对比度的稀释 */
    if(!document.getElementById(DARK_ID)){
      document.body.appendChild(layer(
        DARK_ID, tile(info.wm, 250, 160, -12, 'rgba(110,110,110,0.03)', 16)));
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
