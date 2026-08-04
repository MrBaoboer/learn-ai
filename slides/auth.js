/**
 * auth.js — xueai.app 登录状态与登录 UI（home.html / learn.html 共用）
 *
 * 依赖后端 /auth/* 接口（米羊 OAuth）。
 * 本地预览没有该接口时静默降级为「未登录」，不影响页面其他功能。
 *
 * 对外暴露 window.XueaiAuth：
 *   ready        Promise<state>，state = {loggedIn, nickname}
 *   state        最近一次获取的登录状态
 *   isFree(file) 该课程文件是否免登录（每个主题前 2 节）
 *   openLoginModal(next) 弹出登录告知弹窗，确认后跳米羊登录
 *   mount(slotEl) 在指定节点渲染 登录按钮 / 昵称+退出
 */
(function(){
  var FREE_PER_TOPIC = 2;
  var GROUP_QR = 'assets/group-qrcode.png';

  var freeSet = {};
  if(window.COURSE && window.COURSE.parts){
    window.COURSE.parts.forEach(function(part){
      part.topics.forEach(function(topic){
        topic.lessons.slice(0, FREE_PER_TOPIC).forEach(function(ls){
          freeSet[ls.file] = 1;
        });
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
    + '.xa-qr-modal{text-align:center;}'
    + '.xa-qr-modal img{width:220px;height:220px;border-radius:14px;background:#fff;padding:10px;border:1px solid var(--card-border,rgba(0,0,0,0.08));box-shadow:0 4px 20px rgba(0,0,0,0.08);}'
    + '.xa-qr-hint{font-size:13.5px;color:var(--text-s,#475569);line-height:1.7;margin:16px 0 20px;}'
    + '[data-theme="dark"] .xa-qr-hint{color:rgba(255,255,255,0.65);}';
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

      + '</div></div>';

    document.body.appendChild(scrim);
    scrim.addEventListener('click', function(e){
      if(e.target === scrim || e.target.getAttribute('data-xa') === 'cancel'){
        scrim.remove();
      }
    });
  }

  function openGroupModal(){
    if(document.querySelector('.xa-scrim')) return;
    var scrim = document.createElement('div');
    scrim.className = 'xa-scrim';
    scrim.innerHTML =
      '<div class="xa-modal xa-qr-modal" role="dialog" aria-modal="true">'
      + '<h3>欢迎加入交流群</h3>'
      + '<img src="' + GROUP_QR + '" alt="小山学 AI 交流群二维码">'
      + '<div class="xa-qr-hint">微信扫一扫，加入「小山学 AI」交流群<br>一起讨论课程与 AI 实战</div>'
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
