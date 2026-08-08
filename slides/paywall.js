/**
 * paywall.js — 未登录访客的正文预览限制
 *
 * 页面 HTML 始终包含完整正文，供搜索引擎与 AI 引擎抓取；未登录访客在客户端
 * 只看到前一段，其余隐藏并引导登录。受限范围由构建时打在正文元素上的
 * paywall-locked 类界定，并在页面 JSON-LD 中以
 * isAccessibleForFree 声明——这是 Google Flexible Sampling 的标准做法，
 * 与 cloaking 的区别就在于这份声明，改动时不要把它拆掉。
 *
 * 隐藏与淡出的样式跟着 HTML 一起下发（seo-build.py 的 HEAD_INLINE），本脚本
 * 只负责两件事：插入登录引导、用 /auth/me 校正登录态。会话 Cookie 是
 * HttpOnly，JS 读不到，首屏只能先按 localStorage 猜，再由接口纠正。
 *
 * 注意这里不放过 iframe。阅读器 slides/learn.html 正是用 iframe 装课程页，
 * 而它是绝大多数人读课的入口——早先「iframe 内不拦」的写法等于把墙拆了。
 */
(function () {
  var LOCK = 'xa-locked';
  var KEY = 'xa_auth';

  var wrap = document.querySelector('.paywall-locked');
  if (!wrap) return;

  var inFrame = window.top !== window.self;

  /* ── 语言检测：与 auth.js 同一套口径，优先读 i18n.js 注入的 lang ── */
  var _lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang)
    || (location.pathname.match(/\.(en)\.html?$/) ? 'en'
       : location.pathname.match(/\.(ko)\.html?$/) ? 'ko' : 'zh');

  /* 措辞与 auth.js 的登录弹窗保持一致，同一个站里两处引导不该各说各的 */
  var _T = {
    zh: {
      artAlt:        '小山学 AI',
      gateTitle:     '登录后继续免费阅读',
      gateSub:       '本节还没有结束。登录即可解锁余下内容与全部课程，完全免费，不花一分钱。',
      b0Title:       '解锁全部课程',
      b0Desc:        '所有章节完整学完，不花一分钱',
      b1Title:       'AI 实战技巧分享',
      b1Desc:        '定期组织技术分享与交流会',
      b2Title:       '岗位机会推荐',
      b2Desc:        '帮你对接有 AI 岗位需求的公司',
      gateBtn:       '快速登录，免费学习',
      gateFoot:      '还没有账号？登录页可直接注册，一分钟搞定。<br>'
                     + '要求登录也是为了防止内容被恶意贩卖。本站是免费公益站，'
                     + '若你在任何付费课程里买到它，请申请退款。',
      noteText:      '本节为部分预览，登录后可免费阅读全文',
      noteLink:      '登录后继续免费阅读'
    },
    en: {
      artAlt:        'Learn AI with Xiaoshan',
      gateTitle:     'Log in to keep reading — free',
      gateSub:       'This lesson is not over yet. Log in to unlock the rest and every other course, '
                     + 'completely free of charge.',
      b0Title:       'Unlock all courses',
      b0Desc:        'Every lesson, completely free of charge',
      b1Title:       'Hands-on AI tips',
      b1Desc:        'Regular tech talks and practice exchanges',
      b2Title:       'Job referrals',
      b2Desc:        'We connect you with companies hiring for AI roles',
      gateBtn:       'Log in free — start learning',
      gateFoot:      'No account yet? You can sign up right on the login page in about a minute.<br>'
                     + 'Login is required to prevent content from being resold. This site is a free '
                     + 'public resource. If you paid for it anywhere, please request a refund.',
      noteText:      'This is a partial preview. Log in to read the full lesson for free.',
      noteLink:      'Log in to keep reading'
    },
    ko: {
      artAlt:        '샤오산과 함께 배우는 AI',
      gateTitle:     '로그인하고 무료로 계속 읽기',
      gateSub:       '이 강의는 아직 끝나지 않았습니다. 로그인하면 나머지 내용과 전체 강의를 '
                     + '완전 무료로 이용할 수 있습니다.',
      b0Title:       '전체 강의 잠금 해제',
      b0Desc:        '모든 챕터를 무료로 완주하세요',
      b1Title:       'AI 실전 노하우 공유',
      b1Desc:        '정기적인 기술 공유회와 교류회를 진행합니다',
      b2Title:       '채용 기회 추천',
      b2Desc:        'AI 인재를 찾는 기업과 연결해 드립니다',
      gateBtn:       '무료 로그인 · 학습 시작',
      gateFoot:      '아직 계정이 없으신가요? 로그인 페이지에서 바로 가입할 수 있고, 1분이면 끝납니다.<br>'
                     + '로그인은 콘텐츠의 무단 판매를 방지하기 위한 조치입니다. 이 사이트는 무료 '
                     + '공익 사이트이며, 유료로 구입하셨다면 환불을 요청하시기 바랍니다.',
      noteText:      '이 강의는 부분 미리보기입니다. 로그인하면 전문을 무료로 읽을 수 있습니다',
      noteLink:      '로그인하고 무료로 계속 읽기'
    }
  };
  var T = _T[_lang] || _T.zh;

  /* ── 样式 ──
     配图走 background-image 而不是 <img>：面板在已登录时是 display:none，
     背景图不会发起请求，换成 <img> 则登录用户也要白下一张图。 */
  var css = ''
    /* 中性灰蓝描边：课程页底色不统一，比写死白卡片更不容易在暖底页上突兀。
       课程页没有暗色主题，故不做 prefers-color-scheme 分支，否则系统深色时
       面板会自己变暗，跟浅色正文打架 */
    + '.xa-gate{display:none;margin:2px 0 44px;overflow:hidden;'
    + 'border:1px solid rgba(120,130,150,.2);border-radius:18px;background:#fff;'
    + 'box-shadow:0 1px 3px rgba(15,23,41,.04),0 8px 28px rgba(15,23,41,.05);}'
    + 'html.xa-locked .xa-gate{display:flex;}'
    + '.xa-gate-art{flex:0 0 208px;align-self:stretch;min-height:318px;'
    + 'background:#1a1040 url("assets/login-hero.webp") center 18% / cover no-repeat;}'
    + '.xa-gate-main{flex:1 1 auto;min-width:0;padding:30px 32px 28px;}'
    + '.xa-gate h2{margin:0 0 7px;font-size:20px;line-height:1.4;'
    + 'color:#0f1729;font-weight:650;letter-spacing:-.2px;}'
    + '.xa-gate-sub{margin:0 0 18px;font-size:14px;line-height:1.7;color:#5b6577;}'
    + '.xa-gate-list{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}'
    + '.xa-gate-li{display:flex;align-items:center;gap:11px;padding:9px 13px;'
    + 'border-radius:11px;background:rgba(31,111,235,.05);'
    + 'border:1px solid rgba(31,111,235,.1);}'
    + '.xa-gate-ico{flex:0 0 30px;height:30px;border-radius:9px;display:flex;'
    + 'align-items:center;justify-content:center;background:rgba(31,111,235,.11);'
    + 'color:#1f6feb;}'
    + '.xa-gate-ico svg{width:15px;height:15px;}'
    + '.xa-gate-t{font-size:13px;font-weight:600;color:#0f1729;line-height:1.35;}'
    + '.xa-gate-d{font-size:11.5px;color:#6b7688;margin-top:1px;line-height:1.4;}'
    /* 内容区可能有七百多像素宽，按钮铺满会显得笨重，收窄居中；
       窄屏放开成满宽，指头点得着更要紧 */
    + '.xa-gate-btn{display:flex;align-items:center;justify-content:center;gap:8px;'
    + 'max-width:264px;margin:0 auto;padding:13px 24px;border-radius:11px;'
    + 'background:#1f6feb;color:#fff;font-size:15px;font-weight:600;'
    + 'text-decoration:none;transition:background .15s;'
    + 'box-shadow:0 4px 14px rgba(31,111,235,.26);}'
    + '.xa-gate-btn:hover{background:#1a5fd0;}'
    + '.xa-gate-foot{margin:12px 0 0;font-size:12.5px;color:#8b95a7;text-align:center;}'
    /* 顶部提示条：引导面板在正文下方，读者要滚很久才撞见。开头先说明白这节
       是部分预览，省得读到一半才发现，也免得误以为课程就这么短 */
    + '.xa-note{display:none;align-items:center;gap:9px;margin:0 0 20px;'
    + 'padding:10px 14px;border-radius:11px;background:rgba(31,111,235,.055);'
    + 'border:1px solid rgba(31,111,235,.13);font-size:13.5px;color:#3d4756;'
    + 'line-height:1.5;}'
    + 'html.xa-locked .xa-note{display:flex;}'
    + '.xa-note svg{width:15px;height:15px;color:#1f6feb;flex:0 0 auto;}'
    + '.xa-note-link{margin-left:auto;flex:0 0 auto;color:#1f6feb;font-weight:600;'
    + 'text-decoration:none;white-space:nowrap;}'
    + '.xa-note-link:hover{text-decoration:underline;}'
    /* 窄屏改成配图横幅在上：竖图挤在侧边只剩一条，看不出画的是什么 */
    + '@media(max-width:680px){'
    + 'html.xa-locked .xa-gate{display:block;}'
    /* 横幅只有 132px 高，取图要对着主体：狐狸头大约在原图 46% 处，
       用默认的 center 会切到上方星空，看不出画的是什么 */
    + '.xa-gate-art{min-height:138px;background-position:center 45%;}'
    + '.xa-gate-main{padding:22px 20px 24px;}'
    + '.xa-gate h2{font-size:18px;}'
    + '.xa-gate-btn{max-width:none;}'
    /* 窄屏一行放不下，链接换行到下方并让出左侧图标的位置 */
    + '.xa-note{flex-wrap:wrap;font-size:13px;}'
    + '.xa-note-link{margin-left:24px;}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ── 登录引导 ── */
  function benefit(path, title, desc) {
    return '<div class="xa-gate-li"><div class="xa-gate-ico">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path
      + '</svg></div><div><div class="xa-gate-t">' + title
      + '</div><div class="xa-gate-d">' + desc + '</div></div></div>';
  }

  var gate = document.createElement('div');
  gate.className = 'xa-gate';
  gate.innerHTML = ''
    + '<div class="xa-gate-art" role="img" aria-label="' + T.artAlt + '"></div>'
    + '<div class="xa-gate-main">'
    + '<h2>' + T.gateTitle + '</h2>'
    + '<p class="xa-gate-sub">' + T.gateSub + '</p>'
    + '<div class="xa-gate-list">'
    + benefit('<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 '
             + '7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
             T.b0Title, T.b0Desc)
    + benefit('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
             T.b1Title, T.b1Desc)
    + benefit('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>'
             + '<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
             T.b2Title, T.b2Desc)
    + '</div>'
    + '<a class="xa-gate-btn" id="xaGateBtn" href="/auth/login">'
    + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>'
    + '<polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>'
    + T.gateBtn + '</a>'
    + '<p class="xa-gate-foot">' + T.gateFoot + '</p>'
    + '</div>';

  // 引导要落在渐隐块之后，读者的视线才是「内容淡出 → 这里被挡住了」。
  // 切点落在某个板块内部时（正文集中在单个大块时会下钻切分），该板块还有可见
  // 的前半段，所以往上找到 host 的直接子元素，把引导放在整块之后。
  var host = document.querySelector('article.lesson, main.lesson, .slide-container');
  var anchor = wrap;
  if (host) {
    while (anchor.parentNode && anchor.parentNode !== host) anchor = anchor.parentNode;
  }
  anchor.parentNode.insertBefore(gate, anchor.nextSibling);

  /* ── 开篇提示 ── */
  var note = document.createElement('div');
  note.className = 'xa-note';
  note.innerHTML = ''
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>'
    + '<path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
    + '<span>' + T.noteText + '</span>'
    + '<a class="xa-note-link" href="/auth/login">' + T.noteLink + '</a>';

  // 落在标题那一块之后：插到 host 最前面会顶在大标题上方，像条系统横幅，
  // 跟正文没关系。h1 通常裹在 header 里，所以要往上找到 host 的直接子元素。
  if (host) {
    var h1 = host.querySelector('h1');
    var head = h1;
    while (head && head.parentNode && head.parentNode !== host) head = head.parentNode;
    if (head && head.parentNode === host) host.insertBefore(note, head.nextSibling);
    else host.insertBefore(note, host.firstChild);
  }

  // iframe 里跳登录要顶掉整个窗口，否则登录页被塞进阅读器的内容区。
  // 落地也该回阅读器的对应课程，而不是把人丢在裸课程页上；
  // 阅读器分语言，英韩课程要回各自那份，否则登录一趟就被切回中文站。
  var file = location.pathname.split('/').pop();
  var reader = _lang === 'zh' ? 'learn.html' : 'learn.' + _lang + '.html';
  var next = (inFrame && file) ? '/slides/' + reader + '#' + file : location.pathname;
  var href = '/auth/login?next=' + encodeURIComponent(next);
  [gate.querySelector('#xaGateBtn'), note.querySelector('.xa-note-link')]
    .forEach(function (a) {
      a.href = href;
      if (inFrame) a.setAttribute('target', '_top');
    });

  /* ── 用真实登录态校正 ── */
  fetch('/auth/me', { credentials: 'same-origin' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var on = !!(d && d.logged_in);
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
      document.documentElement.classList.toggle(LOCK, !on);
    })
    .catch(function () {
      /* 接口不可用（如本地预览）时不额外拦截，交给 head 内联脚本的判断 */
    });
})();
