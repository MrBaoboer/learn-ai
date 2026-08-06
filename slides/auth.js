/**
 * auth.js — xueai.app 登录状态与登录 UI（home.html / learn.html 共用）
 *
 * 依赖后端 /auth/* 接口（米羊 OAuth）。
 * 本地预览没有该接口时静默降级为「未登录」，不影响页面其他功能。
 *
 * 对外暴露 window.XueaiAuth：
 *   ready        Promise<state>，state = {loggedIn, nickname}
 *   state        最近一次获取的登录状态
 *   isFree(file) 该课程文件是否免登录（每个篇章前 2 节，雷军创业课整章）
 *   openLoginModal(next) 弹出登录告知弹窗，确认后跳米羊登录
 *   mount(slotEl) 在指定节点渲染 登录按钮 / 昵称+退出
 */
(function(){
  /* 免登录规则要和服务端保持一致，否则侧边栏的锁
     和实际能不能打开会对不上：每个篇章前 2 节，外加雷军创业课整章放开 */
  var FREE_PER_PART = 2;
  var FREE_ALL_PREFIX = 'lei-';
  /* 三个联系渠道。二维码都放本地 assets，不走 CDN，弹窗才不会因为外域挂掉而开天窗 */
  var GROUP_QR = 'assets/group-qrcode.png';
  var GZH_QR = 'assets/qrcode.jpg';
  var X_QR = 'assets/x-qrcode.png';
  var X_URL = 'https://x.com/luoxiaoshan_ai';
  var X_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    + '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68'
    + 'l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

  var freeSet = {};
  if(window.COURSE && window.COURSE.parts){
    window.COURSE.parts.forEach(function(part){
      var files = [];
      part.topics.forEach(function(topic){
        topic.lessons.forEach(function(ls){ files.push(ls.file); });
      });
      files.slice(0, FREE_PER_PART).forEach(function(f){ freeSet[f] = 1; });
      files.forEach(function(f){
        if(f.indexOf(FREE_ALL_PREFIX) === 0) freeSet[f] = 1;
      });
    });
  }

  var state = { loggedIn:false, nickname:'' };
  var slots = [];

  var ready = fetch('/auth/me', {credentials:'same-origin'})
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d && d.logged_in){
        state = { loggedIn:true, nickname:d.nickname || '米羊用户' };
      }
      return state;
    })
    .catch(function(){ return state; });

  /* ── 样式 ── */
  var css = ''
    /* 遮罩 */
    + '.xa-scrim{position:fixed;inset:0;background:rgba(15,23,41,0.5);backdrop-filter:blur(4px);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px;}'

    /* 通用弹窗壳（窄型，给群二维码用） */
    + '.xa-modal{background:var(--card,#fff);border:1px solid var(--card-border,rgba(0,0,0,0.08));border-radius:20px;max-width:440px;width:100%;padding:34px 32px 28px;box-shadow:0 24px 80px rgba(0,0,0,0.25);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;}'
    + '[data-theme="dark"] .xa-modal{background:#16162a;border-color:rgba(255,255,255,0.1);}'
    + '.xa-modal h3{font-size:19px;font-weight:800;color:var(--text-h,#0f1729);letter-spacing:-0.3px;margin:0 0 14px;}'
    + '[data-theme="dark"] .xa-modal h3{color:#fff;}'

    /* ── 宽模态框：左图右内容 ── */
    + '.xa-wide{display:flex;border-radius:20px;overflow:hidden;max-width:760px;width:100%;padding:0;}'
    + '.xa-wide-left{width:280px;flex-shrink:0;position:relative;overflow:hidden;background:#1a1040 url("assets/login-hero.png") center/cover no-repeat;}'
    + '.xa-wide-left-overlay{position:absolute;bottom:0;left:0;right:0;padding:18px 20px 16px;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.35) 60%,transparent 100%);}'
    + '.xa-wide-left-overlay p{color:#fff;font-size:12.5px;font-weight:600;line-height:1.55;text-shadow:0 1px 4px rgba(0,0,0,0.5);margin:0;}'
    + '.xa-left-big{font-size:22px !important;font-weight:800 !important;letter-spacing:1px;margin-bottom:4px !important;}'
    + '.xa-wide-right{flex:1;min-width:0;display:flex;flex-direction:column;padding:28px 28px 24px;}'
    + '.xa-wide-right h3{margin-bottom:6px;}'
    + '.xa-wide-sub{font-size:12.5px;color:var(--text-f,#94a3b8);margin-bottom:18px;}'
    + '[data-theme="dark"] .xa-wide-sub{color:rgba(255,255,255,0.4);}'
    + '.xa-wide-foot{font-size:11.5px;color:var(--text-f,#94a3b8);line-height:1.6;margin-top:12px;text-align:center;}'
    + '[data-theme="dark"] .xa-wide-foot{color:rgba(255,255,255,0.4);}'

    /* 权益列表 */
    + '.xa-benefits{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}'
    + '.xa-benefit{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;background:rgba(79,123,255,0.06);border:1px solid rgba(79,123,255,0.12);transition:background .2s;}'
    + '.xa-benefit:hover{background:rgba(79,123,255,0.1);}'
    + '[data-theme="dark"] .xa-benefit{background:rgba(79,123,255,0.08);border-color:rgba(79,123,255,0.18);}'
    + '.xa-benefit-icon{width:32px;height:32px;border-radius:9px;background:rgba(79,123,255,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;}'
    + '.xa-benefit-icon svg{width:16px;height:16px;color:#4f7bff;}'
    + '[data-theme="dark"] .xa-benefit-icon{background:rgba(79,123,255,0.2);}'
    + '.xa-benefit-txt{min-width:0;}'
    + '.xa-benefit-title{font-size:13px;font-weight:700;color:var(--text-h,#0f1729);line-height:1.3;}'
    + '[data-theme="dark"] .xa-benefit-title{color:#fff;}'
    + '.xa-benefit-desc{font-size:11.5px;color:var(--text-s,#475569);line-height:1.3;margin-top:2px;}'
    + '[data-theme="dark"] .xa-benefit-desc{color:rgba(255,255,255,0.55);}'

    /* 二维码行 */
    + '.xa-qr-row{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;background:var(--pill-bg,#f1f5f9);border:1px solid var(--pill-border,#e2e8f0);margin-bottom:18px;}'
    + '[data-theme="dark"] .xa-qr-row{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);}'
    + '.xa-qr-img{width:110px;height:110px;border-radius:10px;background:#fff;padding:4px;border:1px solid var(--pill-border,#e2e8f0);flex-shrink:0;}'
    + '.xa-qr-title{font-size:13px;font-weight:700;color:var(--text-h,#0f1729);}'
    + '[data-theme="dark"] .xa-qr-title{color:#fff;}'
    + '.xa-qr-desc{font-size:11.5px;color:var(--text-s,#475569);margin-top:3px;line-height:1.4;}'
    + '[data-theme="dark"] .xa-qr-desc{color:rgba(255,255,255,0.55);}'

    /* 按钮 */
    + '.xa-actions{display:flex;gap:10px;margin-top:auto;}'
    + '.xa-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:12px;font-size:14.5px;font-weight:700;cursor:pointer;border:none;transition:all .2s;font-family:inherit;text-decoration:none;white-space:nowrap;}'
    + '.xa-btn.primary{background:#4f7bff;color:#fff;box-shadow:0 4px 16px rgba(79,123,255,0.35);}'
    + '.xa-btn.primary:hover{background:#3d6bff;}'
    + '.xa-btn.ghost{background:transparent;color:var(--text-s,#475569);border:1px solid var(--card-border,rgba(0,0,0,0.12));flex:0 0 auto;padding:12px 20px;}'
    + '[data-theme="dark"] .xa-btn.ghost{color:rgba(255,255,255,0.65);border-color:rgba(255,255,255,0.15);}'
    + '.xa-btn.ghost:hover{background:rgba(0,0,0,0.04);}'
    /* X 按钮沿用 X 自己的黑白配色，暗色主题下反色才有对比 */
    + '.xa-btn.xa-x{flex:0 0 auto;padding:12px 16px;background:#0f1419;color:#fff;}'
    + '.xa-btn.xa-x:hover{background:#000;}'
    + '.xa-btn.xa-x svg{width:15px;height:15px;flex-shrink:0;}'
    + '[data-theme="dark"] .xa-btn.xa-x{background:#fff;color:#0f1419;}'
    + '[data-theme="dark"] .xa-btn.xa-x:hover{background:#e2e8f0;}'

    /* 移动端 */
    + '@media(max-width:640px){.xa-wide{max-width:420px;}.xa-wide-left{display:none;}.xa-wide-right{padding:28px 24px 22px;}}'

    /* 顶栏登录区 */
    + '.xa-slot{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;}'
    + '.xa-login-btn{display:inline-flex;align-items:center;gap:6px;background:#4f7bff;color:#fff;font-weight:700;font-size:13px;padding:8px 16px;border-radius:10px;border:none;cursor:pointer;transition:all .2s;font-family:inherit;box-shadow:0 3px 12px rgba(79,123,255,0.3);}'
    + '.xa-login-btn:hover{background:#3d6bff;}'
    + '.xa-user{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:var(--text-h,#0f1729);text-decoration:none;cursor:pointer;transition:color .2s;}'
    + '.xa-user:hover{color:#4f7bff;}'
    + '[data-theme="dark"] .xa-user{color:#fff;}'
    + '[data-theme="dark"] .xa-user:hover{color:#7b9cff;}'
    + '.xa-user .xa-dot{width:7px;height:7px;border-radius:50%;background:#34d399;}'
    + '.xa-logout{font-size:12px;font-weight:600;color:var(--text-f,#94a3b8);cursor:pointer;background:none;border:none;padding:2px 4px;font-family:inherit;}'
    + '.xa-logout:hover{color:#ef4444;}'
    /* 交流群按钮 */
    + '.xa-group{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#059669;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:7px 14px;border-radius:10px;text-decoration:none;transition:all .2s;white-space:nowrap;}'
    + '.xa-group:hover{background:rgba(16,185,129,0.18);transform:translateY(-1px);}'
    + '.xa-group svg{width:14px;height:14px;}'
    + '@media(max-width:600px){.xa-group .xa-group-txt{display:none;}.xa-group{padding:7px 9px;}}'
    /* 交流群二维码弹窗 */
    + '.xa-qr-modal{text-align:center;max-width:580px;max-height:88vh;overflow-y:auto;}'
    + '.xa-qr-hint{font-size:13.5px;color:var(--text-s,#475569);line-height:1.7;margin:2px 0 18px;}'
    + '[data-theme="dark"] .xa-qr-hint{color:rgba(255,255,255,0.65);}'

    /* 三个渠道并排：交流群 / 公众号 / X。二维码统一白底，暗色下也扫得出 */
    + '.xa-chan{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}'
    + '.xa-chan-item{display:flex;flex-direction:column;align-items:center;gap:9px;padding:14px 10px;border-radius:14px;background:var(--pill-bg,#f8fafc);border:1px solid var(--pill-border,#e2e8f0);text-decoration:none;}'
    + '[data-theme="dark"] .xa-chan-item{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);}'
    + 'a.xa-chan-item{transition:background .2s,border-color .2s,transform .2s;}'
    + 'a.xa-chan-item:hover{background:rgba(79,123,255,0.08);border-color:rgba(79,123,255,0.3);transform:translateY(-2px);}'
    + '.xa-chan-item img{width:100%;max-width:140px;aspect-ratio:1;border-radius:10px;background:#fff;padding:6px;box-sizing:border-box;border:1px solid rgba(0,0,0,0.06);}'
    + '.xa-chan-txt{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;}'
    + '.xa-chan-name{display:flex;align-items:center;gap:5px;font-size:13.5px;font-weight:700;color:var(--text-h,#0f1729);}'
    + '[data-theme="dark"] .xa-chan-name{color:#fff;}'
    + '.xa-chan-name svg{width:13px;height:13px;}'
    + '.xa-chan-desc{font-size:11.5px;color:var(--text-s,#475569);line-height:1.45;overflow-wrap:break-word;}'
    + '[data-theme="dark"] .xa-chan-desc{color:rgba(255,255,255,0.55);}'
    /* 窄屏改横向单列：二维码要留够尺寸才能长按识别，宁可让弹窗滚动 */
    + '@media(max-width:560px){.xa-chan{grid-template-columns:1fr;gap:10px;}'
    + '.xa-chan-item{flex-direction:row;text-align:left;gap:14px;padding:12px;}'
    + '.xa-chan-item img{width:96px;max-width:96px;flex-shrink:0;}'
    + '.xa-chan-txt{align-items:flex-start;}}'

    /* 郑重声明：与登录邀请同款「左图右内容」骨架。
       配图自带深色背景，用 cover 铺满；图下三分之一是留白的暗区，正好压文字。
       正文宽度按最长那句「本站从未授权任何机构…任何形式的销售。」定：窄一点
       就会甩出「式的销售。」这种两三个字的孤行，所以整体给到 920px。 */
    + '.xa-notice{display:flex;max-width:920px;max-height:88vh;padding:0;overflow:hidden;}'
    + '.xa-notice-art{width:300px;flex-shrink:0;position:relative;background:'
    + 'url("assets/notice-guard.webp") center/cover no-repeat,#fef9f0;}'
    /* 配图是奶油浅底（底部实测 #fef9f0），所以这里反过来：浅色蒙版压深色字。
       两个字色都取自图里的赤陶／暖棕，对比度 4.7:1 与 6.5:1，够 WCAG。 */
    + '.xa-notice-art-overlay{position:absolute;bottom:0;left:0;right:0;padding:18px 20px 16px;'
    + 'background:linear-gradient(to top,rgba(254,249,240,0.96) 0%,rgba(254,249,240,0.7) 60%,rgba(254,249,240,0) 100%);}'
    + '.xa-notice-art-overlay p{font-size:12.5px;font-weight:600;line-height:1.55;margin:0;}'
    /* 配图不跟随主题，所以字色两套主题都写死；否则暗色下会被 .xa-notice p
       的白字规则（选择器权重更高）盖掉，浅底白字直接消失 */
    + '.xa-notice .xa-notice-art-overlay p,'
    + '[data-theme="dark"] .xa-notice .xa-notice-art-overlay p{color:#7a5236;}'
    + '.xa-notice .xa-notice-art-overlay .xa-left-big,'
    + '[data-theme="dark"] .xa-notice .xa-notice-art-overlay .xa-left-big{color:#b5551a;}'
    + '.xa-notice-main{flex:1;min-width:0;padding:28px 30px 24px;overflow-y:auto;}'
    + '.xa-notice-head{display:flex;align-items:center;gap:10px;margin-bottom:16px;}'
    + '.xa-notice-head svg{width:22px;height:22px;color:#b91c1c;flex-shrink:0;}'
    + '.xa-notice-head h3{margin:0;font-size:20px;}'
    /* 不用 justify：段里有 <br> 强制断行时，两端对齐会把断行前的整行字距拉开 */
    + '.xa-notice p{font-size:14px;line-height:1.85;color:var(--text-s,#334155);margin:0 0 13px;}'
    + '[data-theme="dark"] .xa-notice p{color:rgba(255,255,255,0.72);}'
    + '.xa-notice p strong{color:var(--text-h,#0f1729);font-weight:700;}'
    + '[data-theme="dark"] .xa-notice p strong{color:#fff;}'
    + '.xa-red{color:#dc2626;font-weight:700;}'
    + '[data-theme="dark"] .xa-red{color:#f87171;}'
    + '.xa-notice .xa-refund{padding:12px 14px;border-radius:10px;background:rgba(185,28,28,0.06);border:1px solid rgba(185,28,28,0.18);}'
    + '[data-theme="dark"] .xa-notice .xa-refund{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);}'
    + '.xa-refund a{color:#b91c1c;font-weight:700;text-decoration:underline;}'
    + '[data-theme="dark"] .xa-refund a{color:#f87171;}'
    + '.xa-nb{white-space:nowrap;}'
    + '.xa-notice .xa-vision{font-size:13px;color:var(--text-f,#64748b);border-top:1px solid var(--card-border,rgba(0,0,0,0.07));padding-top:13px;margin-top:3px;}'
    + '[data-theme="dark"] .xa-notice .xa-vision{color:rgba(255,255,255,0.5);border-color:rgba(255,255,255,0.1);}'
    + '.xa-notice .xa-actions{margin-top:18px;}'
    /* 窄屏与登录邀请同策略：收掉左图，内容独立成窄卡 */
    + '@media(max-width:640px){.xa-notice{max-width:440px;}.xa-notice-art{display:none;}'
    + '.xa-notice-main{padding:26px 24px 22px;}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function currentNext(){
    return location.pathname + location.hash;
  }

  /* SVG 图标 */
  var SVG_UNLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>';
  var SVG_PEOPLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  var SVG_BRIEFCASE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
  var SVG_ZAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';

  var SVG_CLOUD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>';

  var BENEFIT_ITEMS = [
    { icon: SVG_UNLOCK,    title: '解锁全部课程',         desc: '不花一分钱，所有章节完整学完' },
    { icon: SVG_CLOUD,     title: '学习进度云同步',       desc: '进度保存在云端，换设备也能接着学' },
    { icon: SVG_ZAP,       title: 'AI 实战技巧分享',      desc: '定期组织技术分享与交流会' },
    { icon: SVG_BRIEFCASE, title: '岗位机会推荐',         desc: '帮你对接有 AI 岗位需求的公司' }
  ];

  /* opts.browseHref：提供时左按钮变为「先看看」链接（直接去看免费课）。
     用于首页 CTA 等"先弹说明再放行"的场景。 */
  function openLoginModal(next, opts){
    opts = opts || {};
    if(document.querySelector('.xa-scrim')) return;
    var loginUrl = '/auth/login?next=' + encodeURIComponent(next || currentNext());

    var benefits = BENEFIT_ITEMS.map(function(item){
      return '<div class="xa-benefit">'
        + '<div class="xa-benefit-icon">' + item.icon + '</div>'
        + '<div class="xa-benefit-txt"><div class="xa-benefit-title">' + item.title + '</div>'
        + '<div class="xa-benefit-desc">' + item.desc + '</div></div></div>';
    }).join('');

    var scrim = document.createElement('div');
    scrim.className = 'xa-scrim';
    scrim.innerHTML =
      '<div class="xa-modal xa-wide" role="dialog" aria-modal="true">'

      + '<div class="xa-wide-left">'
      + '<div class="xa-wide-left-overlay">'
      + '<p class="xa-left-big">全部免费</p>'
      + '<p>登录即可解锁完整课程</p>'
      + '</div>'
      + '</div>'

      + '<div class="xa-wide-right">'
      + '<h3>登录后，你将获得</h3>'
      + '<div class="xa-wide-sub">一个账号，解锁全部学习资源</div>'

      + '<div class="xa-benefits">' + benefits + '</div>'

      + '<div class="xa-qr-row">'
      + '<img class="xa-qr-img" src="' + GROUP_QR + '" alt="交流群二维码">'
      + '<div class="xa-qr-info"><div class="xa-qr-title">扫码加入学习社群</div>'
      + '<div class="xa-qr-desc">技术分享 · 实战交流 · 岗位推荐</div></div>'
      + '</div>'

      + '<div class="xa-actions">'
      + (opts.browseHref
          ? '<a class="xa-btn ghost" data-xa="cancel" href="' + opts.browseHref + '" target="_top">先看看</a>'
          : '<button class="xa-btn ghost" data-xa="cancel">稍后再说</button>')
      + '<a class="xa-btn primary" href="' + loginUrl + '">快速登录，免费学习</a>'
      + '</div>'

      + '<div class="xa-wide-foot">要求登录也是为了防止内容被恶意贩卖。本站永久免费，'
      + '若你在任何付费课程里买到过它，请向对方申请退款。</div>'

      + '</div></div>';

    document.body.appendChild(scrim);
    scrim.addEventListener('click', function(e){
      if(e.target === scrim || e.target.getAttribute('data-xa') === 'cancel'){
        scrim.remove();
      }
    });
  }

  /* 一个渠道卡片。给了 href 就渲染成可点的 a（X 在电脑上扫码不方便，直接点开） */
  function channel(opts){
    var tag = opts.href ? 'a' : 'div';
    var attrs = opts.href
      ? ' href="' + opts.href + '" target="_blank" rel="noopener noreferrer"'
      : '';
    return '<' + tag + ' class="xa-chan-item"' + attrs + '>'
      + '<img src="' + opts.img + '" alt="' + opts.alt + '" loading="lazy">'
      + '<div class="xa-chan-txt">'
      + '<div class="xa-chan-name">' + (opts.icon || '') + opts.name + '</div>'
      + '<div class="xa-chan-desc">' + opts.desc + '</div>'
      + '</div></' + tag + '>';
  }

  function openGroupModal(){
    if(document.querySelector('.xa-scrim')) return;
    var scrim = document.createElement('div');
    scrim.className = 'xa-scrim';
    scrim.innerHTML =
      '<div class="xa-modal xa-qr-modal" role="dialog" aria-modal="true">'
      + '<h3>欢迎交流与关注</h3>'
      + '<div class="xa-qr-hint">微信扫一扫入群，或关注公众号与 X 获取更新</div>'
      + '<div class="xa-chan">'
      + channel({
          img: GROUP_QR, alt: '小山学 AI 交流群二维码',
          name: '交流群', desc: '微信扫码入群<br>聊课程与 AI 实战'
        })
      + channel({
          img: GZH_QR, alt: '小山学 AI 公众号二维码',
          name: '公众号', desc: '小山学 AI<br>文章与课程更新'
        })
      + channel({
          href: X_URL, img: X_QR, alt: 'X 主页二维码',
          name: '推特', icon: X_ICON, desc: '@luoxiaoshan_ai<br>点击直达主页'
        })
      + '</div>'
      + '<div class="xa-actions">'
      + '<button class="xa-btn ghost" data-xa="cancel">关闭</button>'
      + '</div></div>';
    document.body.appendChild(scrim);
    scrim.addEventListener('click', function(e){
      if(e.target === scrim || e.target.getAttribute('data-xa') === 'cancel'){
        scrim.remove();
      }
    });
  }

  /* 页面里的 .xa-group 按钮统一改为弹出二维码 */
  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('.xa-group');
    if(btn){
      e.preventDefault();
      openGroupModal();
    }
  });

  /* ── 郑重声明：首次打开站点弹一次 ──
     本站被人打包进付费课卖过。声明必须点「我明白了」才能关（不给点遮罩
     糊弄过去），确认记在 localStorage，之后不再打扰。 */
  var NOTICE_KEY = 'xa_notice_v1';
  var SVG_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>';

  function maybeShowNotice(){
    try{ if(localStorage.getItem(NOTICE_KEY)) return; }catch(e){ return; }
    if(document.querySelector('.xa-scrim')) return;
    var scrim = document.createElement('div');
    scrim.className = 'xa-scrim';
    scrim.innerHTML =
      '<div class="xa-modal xa-notice" role="dialog" aria-modal="true" aria-label="郑重声明">'
      + '<div class="xa-notice-art"><div class="xa-notice-art-overlay">'
      + '<p class="xa-left-big">免费公益</p>'
      + '<p>知识应该被更多人看到</p>'
      + '</div></div>'
      + '<div class="xa-notice-main">'
      + '<div class="xa-notice-head">' + SVG_SHIELD + '<h3>郑重声明</h3></div>'
      + '<p>xueai.app 是免费公益的 AI 学习网站，全部内容<span class="xa-red">永久免费</span>。<br>'
      + '本站从未授权任何机构或个人将站内内容用于收费课程、付费社群或任何形式的销售。</p>'
      + '<p class="xa-refund"><strong>如果你是在培训机构、付费课程或课包里拿到本网站的，'
      + '说明你为免费内容付了钱。<br>请尽快向对方申请退款，并保留付款凭证。</strong><br>'
      + '你也可以访问米羊官网 <a href="https://miyang.cn" target="_blank" rel="noopener">miyang.cn</a>，'
      + '或邮件 <a href="mailto:connect@miyang.cn">connect@miyang.cn</a> '
      /* 末尾整句不许断开，否则窄一点就甩出「报。」这种两字孤行 */
      + '<span class="xa-nb">向我们举报。</span></p>'
      + '<p>本站要求登录，仅用于同步学习进度与防止内容被恶意贩卖，不收取任何费用。<br>'
      + '欢迎关注公众号「小山学 AI」，我们也会录制教学视频，免费开放给你学习！</p>'
      + '<p class="xa-vision">米羊科技的愿景，是让<span class="xa-red">更多人享受到 AI 的便利</span>。<br>'
      + '我们愿意做一件不那么聪明的事：把我们掌握的知识开源出来。<br>'
      + '但开源精神，绝不是商业化倒卖的理由。</p>'
      + '<div class="xa-actions">'
      + '<a class="xa-btn xa-x" href="' + X_URL + '" target="_blank" rel="noopener noreferrer">'
      + X_ICON + '到 X 支持一下小山！</a>'
      + '<button class="xa-btn primary" data-xa="ack">我明白了！</button>'
      + '</div></div></div>';
    document.body.appendChild(scrim);
    scrim.addEventListener('click', function(e){
      if(e.target.getAttribute && e.target.getAttribute('data-xa') === 'ack'){
        try{ localStorage.setItem(NOTICE_KEY, String(Date.now())); }catch(err){}
        scrim.remove();
      }
    });
  }
  maybeShowNotice();

  function renderSlot(el){
    if(state.loggedIn){
      el.innerHTML =
        '<a class="xa-user" href="https://miyang.cn/profile" target="_blank" rel="noopener" title="米羊个人中心 · AI 学习进展"><span class="xa-dot"></span>'
        + escapeHtml(state.nickname)
        + '</a><button class="xa-logout" type="button">退出</button>';
      el.querySelector('.xa-logout').addEventListener('click', function(){
        location.href = '/auth/logout?next=' + encodeURIComponent(currentNext());
      });
    }else{
      el.innerHTML = '<button class="xa-login-btn" type="button">登录</button>';
      el.querySelector('.xa-login-btn').addEventListener('click', function(){
        openLoginModal();
      });
    }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function mount(el){
    if(!el) return;
    el.classList.add('xa-slot');
    slots.push(el);
    renderSlot(el);
    ready.then(function(){ renderSlot(el); });
  }

  window.XueaiAuth = {
    ready: ready,
    get state(){ return state; },
    isFree: function(file){ return !!freeSet[file]; },
    openLoginModal: openLoginModal,
    openGroupModal: openGroupModal,
    mount: mount
  };
})();
