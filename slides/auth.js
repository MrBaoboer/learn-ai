/**
 * auth.js — xueai.app 登录状态与登录 UI（home.html / learn.html 共用）
 *
 * 依赖后端 /auth/* 接口（米羊 OAuth）。
 * 本地预览没有该接口时静默降级为「未登录」，不影响页面其他功能。
 *
 * 对外暴露 window.XueaiAuth：
 *   ready        Promise<state>，state = {loggedIn, nickname, avatarUrl}
 *   state        最近一次获取的登录状态
 *   isFree(file) 该课程文件是否免登录（每个篇章前 2 节，另有整章开放的篇章，
 *                见 FREE_ALL_PREFIXES；判定口径必须与服务端一致）
 *   openLoginModal(next) 弹出登录告知弹窗，确认后跳米羊登录
 *   mount(slotEl) 在指定节点渲染登录按钮或头像账号菜单
 */
(function(){
  /* ── 语言检测：优先读 i18n.js 注入的 window.XUEAI_I18N.lang，
     其次从文件名后缀判断，默认中文 ── */
  var _lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang)
    || (location.pathname.match(/\.(en)\.html?$/) ? 'en'
       : location.pathname.match(/\.(ko)\.html?$/) ? 'ko' : 'zh');

  /* ── 三语字典 ── */
  var _T = {
    zh: {
      defaultNickname:    '米羊用户',
      loginBtn:           '登录',
      logoutBtn:          '退出',
      userTitle:          '米羊个人中心 · AI 学习进展',
      accountLabel:       '账号菜单',
      signedInLabel:      '已登录米羊账号',
      profileBtn:         '个人中心',
      /* 登录邀请弹窗 */
      heroTitle:          '全部免费',
      heroSub:            '登录即可解锁完整课程',
      modalTitle:         '登录后，你将获得',
      modalSub:           '一个账号，解锁全部学习资源',
      qrTitle:            '扫码加入学习社群',
      qrDesc:             '技术分享 · 实战交流 · 岗位推荐',
      groupQrAlt:         '交流群二维码',
      btnBrowse:          '先看看',
      btnCancel:          '稍后再说',
      btnLogin:           '快速登录，免费学习',
      footNote:           '要求登录也是为了防止内容被恶意贩卖。本站永久免费，若你在任何付费课程里买到过它，请向对方申请退款。',
      /* 权益列表 */
      benefit0Title:      '解锁全部课程',
      benefit0Desc:       '不花一分钱，所有章节完整学完',
      benefit1Title:      '学习进度云同步',
      benefit1Desc:       '进度保存在云端，换设备也能接着学',
      benefit2Title:      'AI 实战技巧分享',
      benefit2Desc:       '定期组织技术分享与交流会',
      benefit3Title:      '岗位机会推荐',
      benefit3Desc:       '帮你对接有 AI 岗位需求的公司',
      /* 交流群弹窗 */
      groupModalTitle:    '欢迎交流与关注',
      groupHint:          '微信扫一扫入群，或关注公众号与 X 获取更新',
      chan0Name:          '交流群',
      chan0Desc:          '微信扫码入群<br>聊课程与 AI 实战',
      chan0Alt:           '小山学堂 交流群二维码',
      chan1Name:          '公众号',
      chan1Desc:          '洛小山<br>文章与课程更新',
      chan1Alt:           '洛小山公众号二维码',
      chan2Name:          '推特',
      chan2Desc:          '@luoxiaoshan_ai<br>点击直达主页',
      chan2Alt:           'X 主页二维码',
      btnClose:           '关闭',
      /* 郑重声明弹窗 */
      noticeAriaLabel:    '郑重声明',
      noticeHeroTitle:    '永久免费',
      noticeHeroSub:      '知识应该被更多人看到',
      noticeHeading:      '郑重声明',
      noticePara1:        'xueai.app 是免费公益的 AI 学习网站，全部内容<span class="xa-red">永久免费</span>。<br>本站从未授权任何机构或个人将站内内容用于收费课程、付费社群或任何形式的销售。',
      noticePara2a:       '如果你是在培训机构、付费课程或课包里拿到本网站的，说明你为免费内容付了钱。<br>请尽快向对方申请退款，并保留付款凭证。',
      noticePara2b:       '你也可以访问米羊官网 <a href="https://miyang.cn" target="_blank" rel="noopener">miyang.cn</a>，或邮件 <a href="mailto:connect@miyang.cn">connect@miyang.cn</a> <span class="xa-nb">向我们举报。</span>',
      noticePara3:        '本站要求登录，仅用于同步学习进度与防止内容被恶意贩卖，不收取任何费用。<br>欢迎关注公众号「洛小山」，我们也会录制教学视频，免费开放给你学习！',
      noticeVision:       '米羊科技的愿景，是让<span class="xa-red">更多人享受到 AI 的便利</span>。<br>我们愿意做一件不那么聪明的事：把我们掌握的知识开源出来。<br>但开源精神，绝不是商业化倒卖的理由。',
      btnX:               '到 X 支持一下小山！',
      btnAck:             '我明白了！'
    },
    en: {
      defaultNickname:    'Miyang User',
      loginBtn:           'Log in',
      logoutBtn:          'Log out',
      userTitle:          'Miyang Profile · My Learning Progress',
      accountLabel:       'Account menu',
      signedInLabel:      'Signed in with Miyang',
      profileBtn:         'Profile',
      heroTitle:          'Totally Free',
      heroSub:            'Log in to unlock the full course',
      modalTitle:         'What you get after logging in',
      modalSub:           'One account. All learning resources unlocked.',
      qrTitle:            'Join our study community',
      qrDesc:             'Tech talks · Practice exchanges · Job referrals',
      groupQrAlt:         'Study group QR code',
      btnBrowse:          'Browse first',
      btnCancel:          'Maybe later',
      btnLogin:           'Log in free — start learning',
      footNote:           'Login is required to prevent content from being resold. This site is permanently free. If you paid for it anywhere, please request a refund.',
      benefit0Title:      'Unlock all courses',
      benefit0Desc:       'Every lesson, completely free of charge',
      benefit1Title:      'Cloud sync your progress',
      benefit1Desc:       'Pick up right where you left off on any device',
      benefit2Title:      'AI practice sharing',
      benefit2Desc:       'Regular tech talks and hands-on sessions',
      benefit3Title:      'Job opportunity referrals',
      benefit3Desc:       'We connect you with companies hiring for AI roles',
      groupModalTitle:    'Connect with us',
      groupHint:          'Scan to join the group, or follow us on WeChat Official Account & X for updates',
      chan0Name:          'Study Group',
      chan0Desc:          'Scan with WeChat to join<br>Discuss courses & AI practice',
      chan0Alt:           'Xiaoshan Academy study group QR code',
      chan1Name:          'WeChat Official Account',
      chan1Desc:          'Luo Xiaoshan<br>Articles & course updates',
      chan1Alt:           'Luo Xiaoshan WeChat Official Account QR code',
      chan2Name:          'X (Twitter)',
      chan2Desc:          '@luoxiaoshan_ai<br>Click to visit profile',
      chan2Alt:           'X profile QR code',
      btnClose:           'Close',
      noticeAriaLabel:    'Important Notice',
      noticeHeroTitle:    'Always Free',
      noticeHeroSub:      'Knowledge should be accessible to all',
      noticeHeading:      'Important Notice',
      noticePara1:        'xueai.app is a free, public-benefit AI learning site. All content is <span class="xa-red">permanently free</span>.<br>Miyang has never authorized any individual or organization to resell the content here in paid courses, paid communities, or any other commercial form.',
      noticePara2a:       'If you received this site through a training program, paid course, or course bundle, you paid for something that should be free.<br>Please request a refund immediately and keep your payment records.',
      noticePara2b:       'You can also visit the Miyang website at <a href="https://miyang.cn" target="_blank" rel="noopener">miyang.cn</a> or email <a href="mailto:connect@miyang.cn">connect@miyang.cn</a> <span class="xa-nb">to report the issue.</span>',
      noticePara3:        'Login is only used to sync your learning progress and prevent content from being resold. We charge nothing.<br>Follow "Luo Xiaoshan" on WeChat Official Account — we also publish free tutorial videos there!',
      noticeVision:       'Miyang\'s mission is to <span class="xa-red">make AI accessible to more people</span>.<br>We choose to open-source what we know, even if it\'s not the smartest business move.<br>But open source is never a license for commercial resale.',
      btnX:               'Support Luo Xiaoshan on X!',
      btnAck:             'Got it!'
    },
    ko: {
      defaultNickname:    '미양 사용자',
      loginBtn:           '로그인',
      logoutBtn:          '로그아웃',
      userTitle:          '미양 프로필 · 학습 현황',
      accountLabel:       '계정 메뉴',
      signedInLabel:      '미양 계정으로 로그인됨',
      profileBtn:         '프로필',
      heroTitle:          '완전 무료',
      heroSub:            '로그인하면 전체 강의를 이용할 수 있습니다',
      modalTitle:         '로그인 후 이용할 수 있는 혜택',
      modalSub:           '계정 하나로 모든 학습 자료를 이용하세요',
      qrTitle:            'QR코드로 학습 커뮤니티에 참여하세요',
      qrDesc:             '기술 공유 · 실전 교류 · 채용 추천',
      groupQrAlt:         '스터디 그룹 QR코드',
      btnBrowse:          '먼저 살펴보기',
      btnCancel:          '나중에 하기',
      btnLogin:           '무료 로그인 · 학습 시작',
      footNote:           '로그인은 콘텐츠의 무단 판매를 방지하기 위한 조치입니다. 이 사이트는 영구 무료입니다. 유료로 구입하셨다면 환불을 요청하시기 바랍니다.',
      benefit0Title:      '전체 강의 잠금 해제',
      benefit0Desc:       '모든 챕터를 무료로 완주하세요',
      benefit1Title:      '학습 진도 클라우드 동기화',
      benefit1Desc:       '어느 기기에서든 이어서 학습할 수 있습니다',
      benefit2Title:      'AI 실전 기술 공유',
      benefit2Desc:       '정기적인 기술 공유 및 교류 세션을 진행합니다',
      benefit3Title:      '채용 기회 추천',
      benefit3Desc:       'AI 직무 채용 기업과 연결해 드립니다',
      groupModalTitle:    '함께 교류하고 팔로우하세요',
      groupHint:          '위챗으로 스캔하여 그룹에 참여하거나, 위챗 공식 계정과 X를 팔로우하여 업데이트를 받으세요',
      chan0Name:          '스터디 그룹',
      chan0Desc:          '위챗으로 스캔하여 참여<br>강의와 AI 실전 토론',
      chan0Alt:           '샤오산 아카데미 스터디 그룹 QR코드',
      chan1Name:          '위챗 공식 계정',
      chan1Desc:          '뤄샤오산<br>아티클 및 강의 업데이트',
      chan1Alt:           '뤄샤오산 위챗 공식 계정 QR코드',
      chan2Name:          'X (트위터)',
      chan2Desc:          '@luoxiaoshan_ai<br>클릭하여 프로필 방문',
      chan2Alt:           'X 프로필 QR코드',
      btnClose:           '닫기',
      noticeAriaLabel:    '중요 공지',
      noticeHeroTitle:    '영구 무료',
      noticeHeroSub:      '지식은 더 많은 사람들에게 닿아야 합니다',
      noticeHeading:      '중요 공지',
      noticePara1:        'xueai.app은 무료 공익 AI 학습 사이트로, 모든 콘텐츠는 <span class="xa-red">영구 무료</span>입니다.<br>미양은 어떠한 기관이나 개인에게도 사이트 콘텐츠를 유료 강의, 유료 커뮤니티 또는 기타 상업적 형태로 판매하도록 허가한 적이 없습니다.',
      noticePara2a:       '교육 기관, 유료 강의 또는 강의 패키지를 통해 이 사이트를 접하셨다면, 무료 콘텐츠에 비용을 지불하신 것입니다.<br>즉시 환불을 요청하시고 결제 증빙을 보관하시기 바랍니다.',
      noticePara2b:       '미양 공식 웹사이트 <a href="https://miyang.cn" target="_blank" rel="noopener">miyang.cn</a>을 방문하시거나, <a href="mailto:connect@miyang.cn">connect@miyang.cn</a>으로 이메일을 보내 <span class="xa-nb">신고하실 수 있습니다.</span>',
      noticePara3:        '로그인은 학습 진도 동기화와 콘텐츠 무단 판매 방지를 위한 것으로, 어떠한 비용도 청구하지 않습니다.<br>위챗 공식 계정 「뤄샤오산」을 팔로우하세요. 무료 강의 영상도 제공합니다!',
      noticeVision:       '미양의 비전은 <span class="xa-red">더 많은 사람들이 AI의 편리함을 누리는 것</span>입니다.<br>우리가 알고 있는 지식을 오픈소스로 공개하는 일을 기꺼이 합니다.<br>하지만 오픈소스 정신은 결코 상업적 재판매의 구실이 될 수 없습니다.',
      btnX:               'X에서 뤄샤오산 응원하기!',
      btnAck:             '알겠습니다!'
    }
  };
  var T = _T[_lang] || _T.zh;
  /* 免登录规则要和服务端保持一致，否则侧边栏的锁
     和实际能不能打开会对不上：每个篇章前 2 节，外加雷军创业课整章放开 */
  var FREE_PER_PART = 2;
  /* 整章免登录的篇章前缀，必须与 ops/auth-service.py 的 CHAPTER_FREE_OVERRIDE
     逐项一致。这里漏一个，侧边栏就会给服务端明明放行的课程画上锁——零基础入门篇
     17 节曾因此一直带锁。tests/test_auth_js_free_sync.py 会比对两边。 */
  var FREE_ALL_PREFIXES = ['lei-', 'zero-', '0-'];
  /* 三个联系渠道。二维码都放本地 assets，不走 CDN，弹窗才不会因为外域挂掉而开天窗 */
  var GROUP_QR = 'assets/group-qrcode.png?v=20260817a';
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
        FREE_ALL_PREFIXES.forEach(function(p){
          if(f.indexOf(p) === 0) freeSet[f] = 1;
        });
      });
    });
  }

  var state = { loggedIn:false, nickname:'', avatarUrl:'' };
  var slots = [];

  /* 首帧用上次缓存的登录态渲染账号插槽，避免 /auth/me 返回后
     「登录」按钮突然换成更宽的头像胶囊、把整排导航项往左推（顶栏伸缩感的来源）。
     /auth/me 返回后仍以服务器为准重渲染并刷新缓存。 */
  var ME_CACHE_KEY = 'xa_me_v1';
  try{
    var cachedMe = JSON.parse(localStorage.getItem(ME_CACHE_KEY) || 'null');
    if(cachedMe && cachedMe.loggedIn === true){
      state = {
        loggedIn:true,
        nickname:String(cachedMe.nickname || ''),
        avatarUrl:safeAvatarUrl(cachedMe.avatarUrl)
      };
    }
  }catch(e){}

  var ready = fetch('/auth/me', {credentials:'same-origin'})
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d && d.logged_in){
        state = {
          loggedIn:true,
          nickname:d.nickname || T.defaultNickname,
          avatarUrl:safeAvatarUrl(d.avatar_url)
        };
      }else{
        state = { loggedIn:false, nickname:'', avatarUrl:'' };
      }
      try{ localStorage.setItem(ME_CACHE_KEY, JSON.stringify(state)); }catch(e){}
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
    /* 高度与圆角取顶栏变量：交流群、登录、账号按钮和宿主页面自己的主题/语言按钮
       同处一行，尺寸只能有一个来源，否则每加一个按钮就多一档高度 */
    + '.xa-login-btn{height:var(--xa-ctl-h,38px);display:inline-flex;align-items:center;gap:6px;background:#4f7bff;color:#fff;font-weight:700;font-size:13px;padding:0 16px;border-radius:var(--xa-ctl-r,11px);border:none;cursor:pointer;transition:all .2s;font-family:inherit;box-shadow:0 3px 12px rgba(79,123,255,0.3);}'
    + '.xa-login-btn:hover{background:#3d6bff;}'
    + '.xa-account{position:relative;}'
    + '.xa-account-btn{height:var(--xa-ctl-h,38px);max-width:168px;display:inline-flex;align-items:center;gap:8px;padding:3px 9px 3px 4px;border:1px solid var(--card-border,rgba(0,0,0,.1));border-radius:var(--xa-ctl-r,11px);background:var(--card,#fff);color:var(--text-h,#0f1729);font:700 13px/1 inherit;cursor:pointer;box-shadow:0 2px 10px rgba(15,23,42,.06);transition:border-color .18s,background .18s,box-shadow .18s;}'
    + '.xa-account-btn:hover,.xa-account.open .xa-account-btn{border-color:rgba(79,123,255,.38);background:var(--pill-bg,#f8fafc);box-shadow:0 4px 16px rgba(15,23,42,.09);}'
    /* 头像跟着按钮高度缩放：写死 30px 时按钮一变矮就被头像顶破 */
    + '.xa-avatar{position:relative;overflow:hidden;width:calc(var(--xa-ctl-h,38px) - 8px);height:calc(var(--xa-ctl-h,38px) - 8px);border-radius:9px;display:inline-flex;align-items:center;justify-content:center;flex:none;background:linear-gradient(135deg,#4f7bff,#8b5cf6);color:#fff;font-size:13px;font-weight:800;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);}'
    + '.xa-avatar svg{width:16px;height:16px;stroke-width:2.2;}'
    + '.xa-avatar-img{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;border-radius:inherit;background:inherit;}'
    + '.xa-account-name{min-width:0;max-width:92px;overflow:hidden;text-overflow:ellipsis;}'
    + '.xa-account-caret{width:12px;height:12px;flex:none;opacity:.48;transition:transform .18s;}'
    + '.xa-account.open .xa-account-caret{transform:rotate(180deg);}'
    + '.xa-account-menu{position:absolute;right:0;top:calc(100% + 8px);width:224px;padding:7px;background:var(--card,#fff);border:1px solid var(--card-border,rgba(0,0,0,.09));border-radius:15px;box-shadow:0 18px 48px rgba(15,23,42,.18);display:none;z-index:10020;text-align:left;}'
    + '.xa-account.open .xa-account-menu{display:block;animation:xa-account-in .14s ease-out;}'
    + '@keyframes xa-account-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'
    + '.xa-account-head{display:flex;align-items:center;gap:10px;padding:9px 9px 11px;border-bottom:1px solid var(--card-border,rgba(0,0,0,.08));margin-bottom:5px;}'
    + '.xa-account-head .xa-avatar{width:34px;height:34px;border-radius:10px;}'
    + '.xa-account-meta{min-width:0;}'
    + '.xa-account-meta strong{display:block;color:var(--text-h,#0f1729);font-size:13px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;}'
    + '.xa-account-meta span{display:block;color:var(--text-f,#94a3b8);font-size:10.5px;line-height:1.5;margin-top:1px;}'
    + '.xa-account-item{width:100%;height:38px;display:flex;align-items:center;gap:9px;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--text-s,#475569);font:600 12.5px/1 inherit;text-decoration:none;cursor:pointer;text-align:left;}'
    + '.xa-account-item:hover{background:var(--pill-bg,#f1f5f9);color:var(--text-h,#0f1729);}'
    + '.xa-account-item svg{width:16px;height:16px;flex:none;}'
    + '.xa-account-logout:hover{background:rgba(239,68,68,.08);color:#dc2626;}'
    + '[data-theme="dark"] .xa-account-btn,[data-theme="dark"] .xa-account-menu{background:#16162a;border-color:rgba(255,255,255,.11);color:#fff;}'
    + '[data-theme="dark"] .xa-account-btn:hover,[data-theme="dark"] .xa-account.open .xa-account-btn,[data-theme="dark"] .xa-account-item:hover{background:rgba(255,255,255,.07);}'
    + '[data-theme="dark"] .xa-account-meta strong{color:#fff;}'
    + '[data-theme="dark"] .xa-account-item{color:rgba(255,255,255,.7);}'
    + '[data-theme="dark"] .xa-account-item:hover{color:#fff;}'
    /* 手机上收成正方形图标键：宽高仍读顶栏变量，头像由 .xa-avatar 的 calc 跟着缩 */
    + '@media(max-width:600px){.xa-account-btn{width:var(--xa-ctl-h,38px);padding:3px;box-shadow:none;}.xa-account-btn .xa-avatar{border-radius:8px;}.xa-account-name,.xa-account-caret{display:none;}.xa-account-menu{position:fixed;right:max(12px,env(safe-area-inset-right));top:62px;width:min(224px,calc(100vw - 24px));}}'
    /* 交流群按钮 */
    + '.xa-group{height:var(--xa-ctl-h,38px);display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#059669;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:0 14px;border-radius:var(--xa-ctl-r,11px);text-decoration:none;transition:all .2s;white-space:nowrap;}'
    + '.xa-group:hover{background:rgba(16,185,129,0.18);transform:translateY(-1px);}'
    + '.xa-group svg{width:14px;height:14px;}'
    + '@media(max-width:600px){.xa-group .xa-group-txt{display:none;}.xa-group{padding:0 9px;}}'
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
    { icon: SVG_UNLOCK,    title: T.benefit0Title, desc: T.benefit0Desc },
    { icon: SVG_CLOUD,     title: T.benefit1Title, desc: T.benefit1Desc },
    { icon: SVG_ZAP,       title: T.benefit2Title, desc: T.benefit2Desc },
    { icon: SVG_BRIEFCASE, title: T.benefit3Title, desc: T.benefit3Desc }
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
      + '<p class="xa-left-big">' + T.heroTitle + '</p>'
      + '<p>' + T.heroSub + '</p>'
      + '</div>'
      + '</div>'

      + '<div class="xa-wide-right">'
      + '<h3>' + T.modalTitle + '</h3>'
      + '<div class="xa-wide-sub">' + T.modalSub + '</div>'

      + '<div class="xa-benefits">' + benefits + '</div>'

      + '<div class="xa-qr-row">'
      + '<img class="xa-qr-img" src="' + GROUP_QR + '" alt="' + T.groupQrAlt + '">'
      + '<div class="xa-qr-info"><div class="xa-qr-title">' + T.qrTitle + '</div>'
      + '<div class="xa-qr-desc">' + T.qrDesc + '</div></div>'
      + '</div>'

      + '<div class="xa-actions">'
      + (opts.browseHref
          ? '<a class="xa-btn ghost" data-xa="cancel" href="' + opts.browseHref + '" target="_top">' + T.btnBrowse + '</a>'
          : '<button class="xa-btn ghost" data-xa="cancel">' + T.btnCancel + '</button>')
      + '<a class="xa-btn primary" href="' + loginUrl + '">' + T.btnLogin + '</a>'
      + '</div>'

      + '<div class="xa-wide-foot">' + T.footNote + '</div>'

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
      + '<h3>' + T.groupModalTitle + '</h3>'
      + '<div class="xa-qr-hint">' + T.groupHint + '</div>'
      + '<div class="xa-chan">'
      + channel({
          img: GROUP_QR, alt: T.chan0Alt,
          name: T.chan0Name, desc: T.chan0Desc
        })
      + channel({
          img: GZH_QR, alt: T.chan1Alt,
          name: T.chan1Name, desc: T.chan1Desc
        })
      + channel({
          href: X_URL, img: X_QR, alt: T.chan2Alt,
          name: T.chan2Name, icon: X_ICON, desc: T.chan2Desc
        })
      + '</div>'
      + '<div class="xa-actions">'
      + '<button class="xa-btn ghost" data-xa="cancel">' + T.btnClose + '</button>'
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
      '<div class="xa-modal xa-notice" role="dialog" aria-modal="true" aria-label="' + T.noticeAriaLabel + '">'
      + '<div class="xa-notice-art"><div class="xa-notice-art-overlay">'
      + '<p class="xa-left-big">' + T.noticeHeroTitle + '</p>'
      + '<p>' + T.noticeHeroSub + '</p>'
      + '</div></div>'
      + '<div class="xa-notice-main">'
      + '<div class="xa-notice-head">' + SVG_SHIELD + '<h3>' + T.noticeHeading + '</h3></div>'
      + '<p>' + T.noticePara1 + '</p>'
      + '<p class="xa-refund"><strong>' + T.noticePara2a + '</strong><br>'
      /* 末尾整句不许断开，否则窄一点就甩出「报。」这种两字孤行 */
      + T.noticePara2b + '</p>'
      + '<p>' + T.noticePara3 + '</p>'
      + '<p class="xa-vision">' + T.noticeVision + '</p>'
      + '<div class="xa-actions">'
      + '<a class="xa-btn xa-x" href="' + X_URL + '" target="_blank" rel="noopener noreferrer">'
      + X_ICON + T.btnX + '</a>'
      + '<button class="xa-btn primary" data-xa="ack">' + T.btnAck + '</button>'
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
      var nickname = state.nickname || T.defaultNickname;
      el.innerHTML =
        '<div class="xa-account">' +
          '<button class="xa-account-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="' + escapeHtml(T.accountLabel) + '" title="' + escapeHtml(T.userTitle) + '">' +
            accountAvatarHtml() +
            '<span class="xa-account-name">' + escapeHtml(nickname) + '</span>' +
            '<svg class="xa-account-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>' +
          '</button>' +
          '<div class="xa-account-menu" role="menu">' +
            '<div class="xa-account-head">' +
              accountAvatarHtml() +
              '<div class="xa-account-meta"><strong>' + escapeHtml(nickname) + '</strong><span>' + escapeHtml(T.signedInLabel) + '</span></div>' +
            '</div>' +
            '<a class="xa-account-item" href="/auth/handoff?target=profile" target="_blank" rel="noopener" role="menuitem">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>' +
              escapeHtml(T.profileBtn) +
            '</a>' +
            '<button class="xa-account-item xa-account-logout" type="button" role="menuitem">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>' +
              escapeHtml(T.logoutBtn) +
            '</button>' +
          '</div>' +
        '</div>';
      var account = el.querySelector('.xa-account');
      var accountBtn = el.querySelector('.xa-account-btn');
      accountBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = !account.classList.contains('open');
        closeAccountMenus();
        setAccountOpen(account, open);
      });
      el.querySelector('.xa-account-logout').addEventListener('click', function(){
        location.href = '/auth/logout?next=' + encodeURIComponent(currentNext());
      });
      el.querySelectorAll('.xa-avatar-img').forEach(function(img){
        img.addEventListener('error', function(){ img.remove(); }, {once:true});
      });
    }else{
      el.innerHTML = '<button class="xa-login-btn" type="button">' + T.loginBtn + '</button>';
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

  function safeAvatarUrl(value){
    if(!value) return '';
    try{
      var url = new URL(String(value), location.origin);
      return url.protocol === 'https:' ? url.href : '';
    }catch(e){
      return '';
    }
  }

  function accountAvatarHtml(){
    var avatarUrl = safeAvatarUrl(state.avatarUrl);
    return '<span class="xa-avatar" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>' +
      '</svg>' +
      (avatarUrl
        ? '<img class="xa-avatar-img" src="' + escapeHtml(avatarUrl) + '" alt="" decoding="async" referrerpolicy="no-referrer">'
        : '') +
      '</span>';
  }

  function setAccountOpen(account, open){
    if(!account) return;
    account.classList.toggle('open', !!open);
    var btn = account.querySelector('.xa-account-btn');
    if(btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeAccountMenus(){
    slots.forEach(function(slot){
      setAccountOpen(slot.querySelector('.xa-account'), false);
    });
  }

  document.addEventListener('click', function(e){
    var inside = e.target.closest && e.target.closest('.xa-account');
    if(!inside) closeAccountMenus();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAccountMenus();
  });

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
