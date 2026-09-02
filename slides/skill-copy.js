/* ── 复制 Skill 卡片（跨章共享组件的渲染器）──
   背景：seo-2 首创的「复制 Skill」按钮反响好，各专题收官页的验收清单本质上都是
   可以打包给 Agent 执行的巡检任务，与其每页各写一份 CSS/JS，不如收进一个注册表
   统一注入。
   设计意图：按当前页面文件名查注册表，命中就在 .lesson-header 末尾插一条卡片
   （说明在左、大按钮在右）；主题色走 var(--ct) 并给无章色页面兜底；复制成功按钮
   变绿两秒，剪贴板不可用时降级 textarea + execCommand。

   数据与渲染分离：正文 / 默认文案 / 注册表在 skill-data.js（中文）、
   skill-data.en.js、skill-data.ko.js 里，本文件只管渲染，三种语言共用。
   页面要引「一份数据 + 本文件」两个脚本，顺序不限（本文件在 DOM 就绪后才读数据）。
   新增页面只需在对应语言的数据文件 REG 里加一条。 */
(function () {
  'use strict';

  /* 按钮与提示语走 i18n，否则英韩译文页一点按钮就冒出中文。
     i18n.js 未加载时按中文兜底，与 build.js / taste.js 同一套口径。 */
  function T(key, zh) {
    var i18n = window.XUEAI_I18N;
    return i18n ? i18n.t(key) : zh;
  }

  var DATA = window.SKILL_DATA;
  if (!DATA) return;
  var SKILLS = DATA.SKILLS, META = DATA.META, REG = DATA.REG;

  /* 注册表的键是中文页文件名去掉 .html。译文页文件名多一段语言后缀
     （seo-2.en.html），不剥掉就查不到，卡片会在 192 个译文页上静默消失。 */
  var page = (location.pathname.split('/').pop() || '')
    .replace(/\.html$/, '')
    .replace(/\.(en|ko|tw|hk)$/, '');
  var conf = REG[page];
  if (!conf) return;
  if (typeof conf === 'string') conf = { skill: conf };
  if (!conf.cap) { conf.cap = META[conf.skill].cap; conf.sub = META[conf.skill].sub; }
  var header = document.querySelector('.lesson-header');
  if (!header) return;

  var css = [
    '.skc-bar{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-radius:14px;',
    'background:var(--ct-soft,rgba(0,102,255,.05));border:1.5px solid var(--ct-line,rgba(0,102,255,.2));}',
    '.skc-cap{font-size:14px;font-weight:700;color:var(--text,#1f2937);line-height:1.6;}',
    '.skc-cap small{display:block;font-size:12px;font-weight:400;color:var(--sub,#6b7280);margin-top:2px;}',
    '.skc-btn{flex-shrink:0;display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:12px;',
    'border:1.5px solid var(--ct,var(--accent,#0066ff));background:var(--ct,var(--accent,#0066ff));color:#fff;font-size:15px;font-weight:800;',
    'cursor:pointer;transition:transform .15s ease,background .2s ease,border-color .2s ease;font-family:inherit;box-shadow:0 4px 14px rgba(0,0,0,.16);}',
    '.skc-btn svg{width:17px;height:17px;}',
    '.skc-btn:hover{transform:translateY(-1px);}',
    '.skc-btn:active{transform:translateY(0);}',
    '.skc-btn.done{background:var(--good,#16a34a);border-color:var(--good,#16a34a);box-shadow:none;}',
    '@media (max-width:600px){.skc-bar{flex-direction:column;align-items:stretch;text-align:center;}.skc-btn{justify-content:center;}}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  var bar = document.createElement('div');
  bar.className = 'skc-bar';
  var cap = document.createElement('span');
  cap.className = 'skc-cap';
  cap.innerHTML = conf.cap + '<small>' + conf.sub + '</small>';
  var btn = document.createElement('button');
  btn.className = 'skc-btn';
  btn.type = 'button';
  btn.innerHTML = ICON + T('skillCopy', '复制 Skill');
  bar.appendChild(cap);
  bar.appendChild(btn);
  header.appendChild(bar);

  var LABEL = btn.innerHTML;
  var text = SKILLS[conf.skill];
  function ok() {
    btn.textContent = T('skillCopied', '已复制，去贴给你的 Agent');
    btn.classList.add('done');
    setTimeout(function () { btn.innerHTML = LABEL; btn.classList.remove('done'); }, 2200);
  }
  function fallback() {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      ok();
    } catch (e) {
      window.prompt(T('skillCopyManual', '自动复制失败，手动全选复制：'), text);
    }
    document.body.removeChild(ta);
  }
  btn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else {
      fallback();
    }
  });
})();
