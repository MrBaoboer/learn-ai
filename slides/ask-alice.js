// ── 问问 Alice v2：常驻头像 + 划词提问 + Alice 风悬浮窗 ────────────────
// 由 nav-inject.js 动态加载，覆盖全部课件页（含 learn.html iframe 嵌入模式）。
// 后端：/alice/*（ops/alice-service.py v2，Nginx 反代 127.0.0.1:7895）。
// v2 要点（PRD-ask-alice.md v2）：
//   - 对话权威存储在 Alice 服务器（本脚本只与 xueai 的 /alice/* 交互）；
//   - 回答生成 detached：切页/刷新不打断，用 gen_id 重连观看流续看；
//   - ReAct 工具过程以胶囊卡实时可见；
//   - 渲染层照客户端走：蛐蛐（~> 行）按 QUQU_RE 拆、可散落正文任意位置，
//     Markdown 覆盖 GFM 表格/引用/分割线/标题，气泡尺寸色值抄 tokens.css；
//   - 视觉逐项对照 Alice 客户端（白底、深色用户气泡、28px 圆角方头像、
//     无气泡 Alice 正文、大圆角输入卡 + 卡内工具栏 + 圆形深色发送钮）；
//   - 右下角头像必须用 Alice 官方 avatar（与客户端/落地页同源），禁止另造一张「老师脸」；
//   - 吐槽/问答双模式在输入卡工具栏切换（对照客户端「探讨」选择器位）。
(function () {
  'use strict';
  if (window.__ASK_ALICE_LOADED__) return;
  window.__ASK_ALICE_LOADED__ = true;

  // ── i18n ──────────────────────────────────────────────────────────────
  var LANG = (function () {
    try {
      if (window.XUEAI_I18N && window.XUEAI_I18N.lang) return window.XUEAI_I18N.lang;
      var f = location.pathname.split('/').pop();
      if (/\.en\.html$/.test(f)) return 'en';
      if (/\.ko\.html$/.test(f)) return 'ko';
    } catch (e) {}
    return 'zh';
  })();

  var DICT = {
    zh: {
      ask: '问问 Alice', copy: '复制', copied: '已复制', popFb: '吐槽',
      title: 'Alice', subtitle: '课程助教',
      fabNudge: '有不懂的，欢迎点击这里问我～',
      tabChat: '对话', tabDiscover: '朋友圈',
      mYou: '你', mLoading: '正在翻她的朋友圈…',
      mEmpty: '她的朋友圈还没有内容。在 Alice 桌面版登录同一账号，她的日常动态、你们的互动都会同步到这里。',
      mMore: function (n) { return '网页展示最近 ' + n + ' 条。更早的动态，请在 Alice 客户端查看。'; },
      mLike: '点赞', mComment: '评论', mReply: '回复', mSend: '发送',
      mCmtPh: '说点什么…', mReplyPh: '回复 {name}…',
      mLikeMore: '等 {n} 人', mCmtFail: '发送失败，稍后再试',
      mBanned: '账号暂时不能发言',
      tabNotes: '笔记',
      popClip: '摘抄', clipSaved: '已存入笔记', clipDup: '笔记里已有这条',
      clipFail: '没存上，再试一次？', saveAnswer: '存入笔记',
      ntLoading: '正在翻你的笔记本…',
      ntEmpty: '还没有笔记。划选课件里的内容点「摘抄」，或在 Alice 的回答下点「存入笔记」，把值得记住的都收进来。',
      ntAnswer: 'Alice 的回答', ntClip: '摘抄',
      ntDelConfirm: '删除这条笔记？',
      ntHint: '这些笔记 Alice 在以后的对话里会记得；登录 Alice 桌面版后，它们还会出现在 Wiki 的「学习」目录。',
      ntLoginTip: '登录米羊账号后，划词摘抄和 Alice 的回答都能存进笔记，她以后聊天也会记得它们。',
      newChat: '新对话', sessions: '历史对话', noSessions: '还没有历史对话',
      send: '发送', placeholder: '有什么不懂的，尽管问我…',
      quoteLabel: '划选内容',
      // 划选后点「问问 Alice」预填一句通用提问，用户直接点发送就行，也能改
      quoteAsk: '这段话是什么意思？帮我讲讲。',
      loginTip: '登录米羊账号即可提问，对话用你账户里的米粒计费，并保存在 Alice 的服务器里，换设备也不会丢。',
      loginBtn: '登录米羊账号',
      riceLabel: function (n) { return '米粒 ' + n; },
      noRice: '米粒快用完啦，充值后就能继续和我聊。',
      banned: function (d) { return '由于多次发送恶意内容，这个账号暂时不能和 Alice 对话了，' + d + ' 后自动恢复。'; },
      rechargeBtn: '去充值',
      netErr: 'Alice 暂时联系不上，请稍后再试。',
      del: '删除', delConfirm: '删除这个对话？',
      toolSearch: function (q) { return '正在搜索：' + q; },
      toolRead: '正在阅读网页',
      toolSummary: function (n) { return '查阅了 ' + n + ' 次资料'; },
      greetings: {
        night: ['夜深了，有什么心事吗?', '夜深了，还在学习吗？'],
        morning: ['早上好，今天想学点什么？', '新的一天，从一个好问题开始吧'],
        noon: ['午后了，来聊聊课程吧', '吃过饭了吗？我们继续'],
        afternoon: ['下午好，学到哪里了？', '有什么想深挖的吗？'],
        evening: ['晚上好，今晚想弄懂什么？', '晚间是学习的好时候']
      },
      qFallback: function (t) {
        return ['用一个例子解释「' + t + '」', '「' + t + '」里最重要的概念是什么？', '这一页最容易被误解的地方是哪里？'];
      },
      qImage: '用一张图向我解释这一页。',
      discoverIntro: 'Alice 不只是课程助教。在 Alice 桌面版里，她是一个有自己生活的 AI 伙伴——会发朋友圈、写游记、搭配衣橱，还能帮你干活。',
      dGallery: 'Alice 画廊', dGalleryDesc: '看看大家和 Alice 一起创作的作品',
      dMoments: '朋友圈 · 游记 · 衣橱', dMomentsDesc: 'Alice 的生活系统，在桌面版里体验',
      dDownload: '下载 Alice 桌面版', dDownloadDesc: '手机号账号首次登录送 1000 米粒 · 这里的对话记忆会跟着你',
      downloadFull: '下载体验完整版 Alice',
      scopeCtaTitle: '想聊点课程之外的？',
      scopeCtaDesc: '去 Alice 客户端找我。生活、工作、心事，都可以在那里慢慢聊。',
      scopeCtaButton: '去 Alice 客户端继续聊',
      feedback: '我要吐槽',
      feedbackTip: '对课件有意见？跟我吐槽',
      fbMode: '吐槽模式',
      fbGuide: '好呀，我在听。哪里写错了、哪句没讲明白、想看什么内容，直接说；截图可以粘贴进来，最多 5 张。想留名的话把 GitHub 或 X 主页链接一起发我——被采纳会把你挂上首页贡献者墙。',
      fbPlaceholder: '想吐槽什么？截图直接粘进来…',
      fbThanks: '收到，我帮你转交给作者了，每一条他都会看。因为你是登录提交的，有进展他能直接回访你；被采纳的话你的头像会出现在首页贡献者墙。还想吐槽，随时在输入框下方切回吐槽模式。',
      fbLoginTip: '吐槽也是在给我发消息呀——先登录米羊账号，我才知道是谁在说。记在你名下的吐槽，作者有进展能直接回访你，被采纳还会把你的头像挂上首页贡献者墙。写了一半的内容我会帮你留着，登录回来接着说。',
      fbSendErr: '没送出去……稍等一下再发一次试试？',
      fbImgErr: '这张图没传上去，再试一次？',
      fbTooMany: '最多带 5 张图哦',
      fbAttach: '贴图（也可以直接粘贴截图）',
      modeChat: '问答',
      modeFb: '吐槽',
      aiNote: '以上内容均由 AI 生成，请注意甄别',
      expandSide: '展开为侧边栏', dockFloat: '收回悬浮窗',
      resizeSide: '拖动调整侧边栏宽度，双击恢复默认',
      resizeFloat: '拖动调整窗口大小，双击恢复默认',
      yesterday: '昨天',
      // 引用块的 callout 标记（> [!tip] 等），标签沿用客户端 BlockquoteBlock
      callout: { note: '注意', info: '提示', tip: '技巧', success: '成功', warning: '警告', danger: '危险' },
      loggedInAs: function (n) { return n; }
    },
    en: {
      ask: 'Ask Alice', copy: 'Copy', copied: 'Copied', popFb: 'Report',
      title: 'Alice', subtitle: 'Course TA',
      fabNudge: 'Anything unclear? Tap here and ask me!',
      tabChat: 'Chat', tabDiscover: 'Moments',
      mYou: 'You', mLoading: 'Loading her moments…',
      mEmpty: 'No moments yet. Sign in to Alice for desktop with the same account and her daily posts will sync here.',
      mMore: function (n) { return 'Showing the latest ' + n + ' posts. Open Alice for desktop for earlier moments.'; },
      mLike: 'Like', mComment: 'Comment', mReply: 'Reply to', mSend: 'Send',
      mCmtPh: 'Say something…', mReplyPh: 'Reply to {name}…',
      mLikeMore: 'and {n} people', mCmtFail: 'Failed to send, try again',
      mBanned: 'Your account is temporarily muted',
      tabNotes: 'Notes',
      popClip: 'Clip', clipSaved: 'Saved to notes', clipDup: 'Already in your notes',
      clipFail: 'Couldn\'t save, try again?', saveAnswer: 'Save to notes',
      ntLoading: 'Opening your notebook…',
      ntEmpty: 'No notes yet. Select text in a lesson and hit “Clip”, or save one of Alice\'s answers — keep whatever is worth remembering.',
      ntAnswer: 'Alice\'s answer', ntClip: 'Clip',
      ntDelConfirm: 'Delete this note?',
      ntHint: 'Alice recalls these notes in future chats. Sign in to Alice for desktop and they also appear in your Wiki under “学习 (Study)”.',
      ntLoginTip: 'Sign in with miyang to clip lesson text and Alice\'s answers into notes — she will remember them in future chats.',
      newChat: 'New chat', sessions: 'History', noSessions: 'No conversations yet',
      send: 'Send', placeholder: 'Ask me anything about this lesson…',
      quoteLabel: 'Selection',
      quoteAsk: 'What does this mean? Explain it to me.',
      loginTip: 'Sign in with miyang to ask — chats are billed with your own rice and stored on Alice\'s server, following you across devices.',
      loginBtn: 'Sign in with miyang',
      riceLabel: function (n) { return 'Rice ' + n; },
      noRice: 'You\'re running low on rice. Top up to keep chatting with me.',
      banned: function (d) { return 'This account is temporarily suspended from chatting with Alice due to repeated abusive messages. Access resumes after ' + d + '.'; },
      rechargeBtn: 'Top up',
      netErr: 'Alice is unreachable right now. Please try again later.',
      del: 'Delete', delConfirm: 'Delete this conversation?',
      toolSearch: function (q) { return 'Searching: ' + q; },
      toolRead: 'Reading a webpage',
      toolSummary: function (n) { return 'Looked up ' + n + ' source' + (n > 1 ? 's' : ''); },
      greetings: {
        night: ['It\'s late. What\'s on your mind?'],
        morning: ['Good morning. What shall we learn today?'],
        noon: ['Good afternoon. Shall we continue?'],
        afternoon: ['Good afternoon. Where were we?'],
        evening: ['Good evening. What would you like to figure out tonight?']
      },
      qFallback: function (t) {
        return ['Explain "' + t + '" with an example', 'What\'s the key idea of "' + t + '"?', 'What\'s most commonly misunderstood here?'];
      },
      qImage: 'Explain this page to me with one image.',
      discoverIntro: 'Alice is more than a course TA. In the Alice desktop app she\'s an AI companion with a life of her own — moments, travel journals, a wardrobe — and she gets real work done.',
      dGallery: 'Alice Gallery', dGalleryDesc: 'Artwork created together with Alice',
      dMoments: 'Moments · Journals · Wardrobe', dMomentsDesc: 'Alice\'s life system, in the desktop app',
      dDownload: 'Get Alice for desktop', dDownloadDesc: '1000 rice on first sign-in with a phone-registered account · your chats here follow you',
      downloadFull: 'Try the full Alice',
      scopeCtaTitle: 'Want to talk beyond the course?',
      scopeCtaDesc: 'Find me in the Alice app. Life, work, or whatever is on your mind—we can talk there.',
      scopeCtaButton: 'Continue in Alice',
      feedback: 'Send feedback',
      feedbackTip: 'Spotted an issue? Tell me',
      fbMode: 'Feedback',
      fbGuide: 'I\'m listening. What\'s wrong, unclear, or missing? Just tell me — paste in screenshots too (up to 5). Include your GitHub or X profile link if you\'d like credit: adopted feedback puts your avatar on the home page.',
      fbPlaceholder: 'What\'s bugging you? Paste screenshots right here…',
      fbThanks: 'Got it — I\'ve passed it on to the author. He reads every one, and since you\'re signed in he can follow up with you directly. If it ships, your avatar goes on the home page contributors. More to report? Switch back to Feedback below the input anytime.',
      fbLoginTip: 'Feedback is a message to me too — sign in with miyang so I know who\'s talking. Filed under your name, the author can follow up with you directly, and adopted feedback puts your avatar on the home page. I\'ll keep your draft safe while you sign in.',
      fbSendErr: 'That didn\'t go through… give it another try in a moment?',
      fbImgErr: 'That image didn\'t upload — try again?',
      fbTooMany: 'Up to 5 images',
      fbAttach: 'Attach image (or just paste a screenshot)',
      modeChat: 'Q&A',
      modeFb: 'Feedback',
      aiNote: 'AI-generated content — double-check important details',
      expandSide: 'Expand to sidebar', dockFloat: 'Back to floating window',
      resizeSide: 'Drag to resize sidebar; double-click to reset',
      resizeFloat: 'Drag to resize window; double-click to reset',
      yesterday: 'Yesterday',
      callout: { note: 'Note', info: 'Info', tip: 'Tip', success: 'Success', warning: 'Warning', danger: 'Danger' },
      loggedInAs: function (n) { return n; }
    },
    ko: {
      ask: 'Alice에게 질문', copy: '복사', copied: '복사됨', popFb: '제보',
      title: 'Alice', subtitle: '코스 조교',
      fabNudge: '궁금한 점이 있으면 여기를 눌러 물어보세요!',
      tabChat: '대화', tabDiscover: '모멘트',
      mYou: '나', mLoading: '모멘트를 불러오는 중…',
      mEmpty: '아직 모멘트가 없어요. 데스크톱 Alice에 같은 계정으로 로그인하면 그녀의 일상이 여기로 동기화됩니다.',
      mMore: function (n) { return '웹에서는 최근 ' + n + '개를 표시합니다. 이전 모멘트는 Alice 데스크톱에서 확인해 주세요.'; },
      mLike: '좋아요', mComment: '댓글', mReply: '답글', mSend: '보내기',
      mCmtPh: '댓글을 남겨보세요…', mReplyPh: '{name}님에게 답글…',
      mLikeMore: '등 {n}명', mCmtFail: '전송 실패, 다시 시도해 주세요',
      mBanned: '계정이 일시적으로 제한되었습니다',
      newChat: '새 대화', sessions: '기록', noSessions: '아직 대화가 없습니다',
      send: '전송', placeholder: '이 강의에 대해 무엇이든 물어보세요…',
      quoteLabel: '선택한 내용',
      quoteAsk: '이 문장이 무슨 뜻인지 설명해 주세요.',
      loginTip: 'miyang 계정으로 로그인하면 질문할 수 있어요. 대화는 내 쌀로 결제되며 Alice 서버에 저장되어 어디서든 이어집니다.',
      loginBtn: 'miyang 계정으로 로그인',
      riceLabel: function (n) { return '쌀 ' + n; },
      noRice: '쌀이 얼마 남지 않았어요. 충전하면 계속 대화할 수 있어요.',
      banned: function (d) { return '악성 메시지를 반복해서 보내 이 계정은 잠시 Alice와 대화할 수 없습니다. ' + d + ' 이후 자동으로 복구됩니다.'; },
      rechargeBtn: '충전하기',
      netErr: '지금은 Alice에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      del: '삭제', delConfirm: '이 대화를 삭제할까요?',
      toolSearch: function (q) { return '검색 중: ' + q; },
      toolRead: '웹페이지 읽는 중',
      toolSummary: function (n) { return '자료 ' + n + '회 조회'; },
      greetings: {
        night: ['밤이 깊었네요. 무슨 생각 하세요?'],
        morning: ['좋은 아침이에요. 오늘은 뭘 배워볼까요?'],
        noon: ['점심 잘 드셨어요? 이어서 해볼까요?'],
        afternoon: ['좋은 오후예요. 어디까지 봤어요?'],
        evening: ['좋은 저녁이에요. 오늘 밤엔 뭘 이해해 볼까요?']
      },
      qFallback: function (t) {
        return ['"' + t + '"를 예시로 설명해줘', '"' + t + '"의 핵심 개념은?', '여기서 가장 오해하기 쉬운 부분은?'];
      },
      qImage: '이 페이지를 그림 한 장으로 설명해 주세요.',
      discoverIntro: 'Alice는 단순한 조교가 아닙니다. 데스크톱 앱에서는 모멘트, 여행 일기, 옷장까지 가진 AI 동반자예요.',
      dGallery: 'Alice 갤러리', dGalleryDesc: 'Alice와 함께 만든 작품들',
      dMoments: '모멘트 · 여행기 · 옷장', dMomentsDesc: '데스크톱 앱에서 Alice의 생활 시스템 체험',
      dDownload: 'Alice 데스크톱 다운로드', dDownloadDesc: '휴대폰 가입 계정은 첫 로그인 시 쌀 1000개 · 대화 기억이 이어집니다',
      downloadFull: 'Alice 전체 버전 체험',
      scopeCtaTitle: '강의 밖의 이야기를 나누고 싶나요?',
      scopeCtaDesc: 'Alice 앱에서 만나요. 일상, 일, 고민까지 그곳에서는 천천히 이야기할 수 있어요.',
      scopeCtaButton: 'Alice에서 계속 대화하기',
      feedback: '피드백 보내기',
      feedbackTip: '강의에 의견이 있나요? 저에게 말해주세요',
      fbMode: '피드백 모드',
      fbGuide: '네, 듣고 있어요. 틀린 곳, 이해 안 되는 곳, 보고 싶은 내용을 말씀해 주세요. 스크린샷은 붙여넣으면 돼요(최대 5장). GitHub나 X 프로필 링크를 함께 보내주시면, 반영될 때 홈페이지 기여자에 올려드립니다.',
      fbPlaceholder: '무엇이 불편했나요? 스크린샷도 붙여넣으세요…',
      fbThanks: '잘 받았어요. 작가에게 전달했고, 로그인 상태로 보내주셨으니 진행되면 직접 연락드릴 수 있어요. 반영되면 홈페이지 기여자에 프로필이 올라갑니다. 더 있으면 입력창 아래에서 피드백 모드로 전환해 주세요.',
      fbLoginTip: '피드백도 저에게 보내는 메시지예요 — 누가 말하는지 알 수 있게 먼저 miyang 계정으로 로그인해 주세요. 이름으로 기록되면 작가가 직접 연락드릴 수 있고, 반영되면 홈페이지 기여자에 올라가요. 쓰던 내용은 제가 보관해 둘게요.',
      fbSendErr: '전송이 안 됐어요… 잠시 후 다시 보내볼까요?',
      fbImgErr: '이미지 업로드에 실패했어요. 다시 시도해 주세요.',
      fbTooMany: '이미지는 최대 5장까지요',
      fbAttach: '이미지 첨부 (스크린샷 붙여넣기도 가능)',
      modeChat: '질문',
      modeFb: '피드백',
      aiNote: 'AI가 생성한 내용입니다. 중요한 내용은 확인해 주세요',
      expandSide: '사이드바로 펼치기', dockFloat: '플로팅 창으로 되돌리기',
      resizeSide: '드래그해서 너비 조절, 더블클릭하면 기본값으로',
      resizeFloat: '드래그해서 창 크기 조절, 더블클릭하면 기본값으로',
      yesterday: '어제',
      callout: { note: '참고', info: '정보', tip: '팁', success: '성공', warning: '경고', danger: '위험' },
      loggedInAs: function (n) { return n; }
    }
  };
  var T = DICT[LANG] || DICT.zh;

  var ALICE_SITE = 'https://alice.miyang.cn';
  var RECHARGE_URL = 'https://miyang.cn/console/recharge';   // 米粒充值页
  // 与 miyang_alice/src/public/avatars/avatar_512.png 同源：黑微卷 + 淡金发带 + 星星项链。
  // 曾用 Image2 另生「老师脸」会漂成另一个人，不合规；UI 圆裁由 CSS border-radius 完成。
  var AVATAR_SRC = 'alice-teacher.png?v=20260808j';
  var PAGE_FILE = location.pathname.split('/').pop();
  var PAGE_TITLE = (document.title || '').replace(/\s*\|\s*xueai\.app\s*$/, '');
  // 上报 IANA 时区：后端给每条消息注【消息时间】，韩文学员按首尔报时
  var TZ_NAME = '';
  try { TZ_NAME = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}

  // ── 状态 ─────────────────────────────────────────────────────────────
  var state = {
    open: false,
    side: false,              // 侧边栏形态（展开后把正文推开，跨页保持）
    tab: 'chat',
    loggedIn: false,
    meOk: false,              // /alice/me 是否成功答复过（区分「未登录」与「没连上」）
    enabled: false,           // 灰度白名单：false=不渲染入口（fab/划词/窗）
    hasAliceClient: null,     // 服务端权威状态；未知时下载 CTA 保持隐藏，避免向老用户闪烁
    accountKey: '',           // 服务端下发的 uid 摘要，只用于隔离账号级 localStorage
    nickname: '',
    rice: null,               // 米粒余额（计费走学员本人的米羊账号）
    feedbackMode: false,      // 吐槽模式：消息不进 LLM，收集后转交 /api/feedback
    fbImages: [],             // 吐槽配图（已上传的 URL）
    fbUploading: false,
    sessionId: null,          // 登录用户的云端会话 id
    messages: [],             // [{role, content, ts, toolCount?}]
    pendingQuote: '',
    streaming: false,
    sessionsOpen: false,
    pageQuestions: null       // 本页推荐问题（null=未加载）
  };

  var SID_KEY = 'alice_session_id';   // localStorage：登录用户上次会话
  var OPEN_KEY = 'alice_win_open';    // localStorage：悬浮窗开合（切页保持）
  var SIDE_KEY = 'alice_win_side';    // localStorage：侧边栏形态（切页保持）
  var SIDE_W_KEY = 'alice_side_w';   // localStorage：侧边栏宽度（px）
  var SIDE_W_MIN = 300;
  var SIDE_W_MAX = 720;
  var SIDE_W_DEF = 360;             // 比旧默认（约 36vw）更克制，正文先喘口气
  var FLOAT_W_KEY = 'alice_float_w';
  var FLOAT_H_KEY = 'alice_float_h';
  var FLOAT_W_DEF = 420;
  var FLOAT_H_DEF = 660;
  var FLOAT_W_MIN = 340;
  var FLOAT_H_MIN = 420;
  var MSGS_KEY = 'alice_msgs_cache';  // localStorage：当前会话消息快照（切页秒显）
  var MOMENTS_KEY = 'alice_moments_cache'; // localStorage：朋友圈快照（跨课件/语言页秒显）
  var NOTES_KEY = 'alice_notes_cache';     // localStorage：学习笔记快照（同上，本地秒开）
  var SESSIONS_KEY = 'alice_sessions_cache'; // localStorage：历史会话目录（点历史秒开）
  var DL_CARD_DAY_KEY = 'alice_download_card_day'; // 下载好处卡：每账号每天至多主动展示一次
  var GEN_KEY = 'alice_gen_pending';  // localStorage：进行中的生成 {gen_id,session_id,ts}
  var EN_KEY = 'alice_enabled';       // localStorage：上次 /alice/me 的 enabled（切页秒显用）
  var LOW_RICE_KEY = 'alice_low_rice'; // 上次余额不足；下次进入强制刷新余额而非吃 60 秒缓存
  var FAB_NUDGE_DAY_KEY = 'alice_fab_nudge_day'; // 头像引导气泡：每个浏览器每天至多一次
  var LOW_RICE_THRESHOLD = 20;
  var pageUnloading = false;          // 刷新/翻页导致断流时绝不能删掉待恢复任务
  function markPageUnloading() { pageUnloading = true; }
  window.addEventListener('beforeunload', markPageUnloading, true);
  window.addEventListener('pagehide', markPageUnloading, true);

  // ── 样式：逐项对照 Alice 客户端截图（白底黑白极简系）────────────────
  // 参照物：客户端对话页（用户深色胶囊气泡 / Alice 圆头像 + 无气泡直排正文 /
  // 蛐蛐灰字在正文上方 / 居中时间线）与首页（衬线大问候 / 大圆角输入卡 +
  // 卡内工具栏 + 圆形深色发送钮 / 推荐 chips / AI 生成声明）。
  var style = document.createElement('style');
  style.textContent = [
    ':root{--al-bg:#fff;--al-soft:#f4f4f5;--al-accent:#1a1a1a;--al-border:#e4e4e7;--al-line:#d9d9de;--al-text:#1a1a1a;--al-sub:#6b6b70;--al-faint:#a8a8ad;--al-user:#3a3a3a;--al-serif:Georgia,"Songti SC","Noto Serif SC",serif;--al-sans:-apple-system,"PingFang SC","Noto Sans KR",sans-serif;--al-side-w:360px;--al-float-w:420px;--al-float-h:660px}',
    // 划词浮层
    '#alice-pop{position:fixed;z-index:100001;display:none;align-items:center;background:rgba(28,28,30,.94);backdrop-filter:blur(10px);border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.25);overflow:hidden;font-family:var(--al-sans);animation:alice-pop-in .12s ease}',
    '@keyframes alice-pop-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}',
    '#alice-pop button{background:transparent;border:none;color:#fff;font-size:13px;font-weight:600;padding:8px 14px;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}',
    '#alice-pop button:hover{background:rgba(255,255,255,.12)}',
    '#alice-pop .al-sep{width:1px;height:16px;background:rgba(255,255,255,.18)}',
    '#alice-pop .al-dot{width:16px;height:16px;border-radius:50%;background:var(--al-soft);display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#666;flex-shrink:0;overflow:hidden}',
    '#alice-pop .al-dot img{width:100%;height:100%;object-fit:cover}',
    // 常驻头像按钮（右下角，Image2 垫图生成的 Alice 老师形象）
    '#alice-fab{position:fixed;right:22px;bottom:26px;width:58px;height:58px;border-radius:50%;z-index:99999;background:#fff;border:1px solid var(--al-border);box-shadow:0 8px 28px rgba(0,0,0,.16);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:transform .18s,box-shadow .18s;overflow:hidden}',
    '#alice-fab:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 36px rgba(0,0,0,.22)}',
    '#alice-fab img{width:100%;height:100%;object-fit:cover;object-position:top}',
    '#alice-fab .al-fab-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--al-serif);font-size:24px;font-weight:700;color:#fff;background:#3a3a3c}',
    '#alice-fab.hidden{display:none}',
    // 停在头像左上角：那个 6px 的小圆角就是指向头像的尾巴，所以右下角要压在头像左上角上方
    '#alice-fab-nudge{position:fixed;right:68px;bottom:88px;z-index:99998;display:none;',
      'max-width:min(238px,calc(100vw - 88px));padding:11px 15px;border:1px solid rgba(255,255,255,.12);',
      'border-radius:18px 18px 6px 18px;background:rgba(20,20,20,.78);color:#fff;',
      'font-family:var(--al-sans);font-size:13px;font-weight:600;line-height:1.55;text-align:left;',
      'box-shadow:0 10px 28px rgba(0,0,0,.2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
      'cursor:pointer;appearance:none;-webkit-appearance:none}',
    '#alice-fab-nudge.show{display:block;animation:al-fab-nudge-in .2s cubic-bezier(.3,.9,.4,1)}',
    '#alice-fab-nudge:hover{background:rgba(20,20,20,.88)}',
    '@keyframes al-fab-nudge-in{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}',
    '@media(max-width:640px){#alice-fab{right:14px;bottom:18px;width:52px;height:52px}#alice-fab-nudge{right:54px;bottom:74px;max-width:min(220px,calc(100vw - 74px))}}',
    // 悬浮窗
    '#alice-win{position:fixed;right:20px;bottom:20px;width:var(--al-float-w);max-width:calc(100vw - 24px);height:var(--al-float-h);max-height:calc(100vh - 40px);z-index:100000;background:var(--al-bg);border:1px solid var(--al-border);border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:var(--al-sans)}',
    '#alice-win.open{display:flex;animation:al-win-in .22s cubic-bezier(.3,.9,.4,1)}',
    '@keyframes al-win-in{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}',
    // 悬浮窗左边调宽、上边调高；左上角一次调两边。热区透明，只在悬停时
    // 露一条克制的深色提示，不往界面里永久塞“把手”。
    '#alice-win .al-float-rz{position:absolute;z-index:8;display:block;touch-action:none}',
    '#alice-win .al-float-rz-l{left:0;top:14px;bottom:14px;width:8px;cursor:col-resize}',
    '#alice-win .al-float-rz-t{top:0;left:14px;right:14px;height:8px;cursor:row-resize}',
    '#alice-win .al-float-rz-nw{left:0;top:0;width:16px;height:16px;cursor:nwse-resize}',
    '#alice-win .al-float-rz-l::after{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:transparent;transition:background .15s}',
    '#alice-win .al-float-rz-t::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:transparent;transition:background .15s}',
    '#alice-win .al-float-rz-nw::after{content:"";position:absolute;left:0;top:0;width:9px;height:9px;border-left:2px solid transparent;border-top:2px solid transparent;border-radius:8px 0 0 0;transition:border-color .15s}',
    '#alice-win .al-float-rz-l:hover::after,html.al-float-rz-w #alice-win .al-float-rz-l::after{background:var(--al-accent)}',
    '#alice-win .al-float-rz-t:hover::after,html.al-float-rz-h #alice-win .al-float-rz-t::after{background:var(--al-accent)}',
    '#alice-win .al-float-rz-nw:hover::after,html.al-float-rz-nw #alice-win .al-float-rz-nw::after{border-color:var(--al-accent)}',
    '#alice-win.side .al-float-rz{display:none}',
    'html.al-float-resizing,html.al-float-resizing *{user-select:none!important}',
    'html.al-float-rz-w,html.al-float-rz-w *{cursor:col-resize!important}',
    'html.al-float-rz-h,html.al-float-rz-h *{cursor:row-resize!important}',
    'html.al-float-rz-nw,html.al-float-rz-nw *{cursor:nwse-resize!important}',
    'html.al-float-resizing body,html.al-float-resizing #alice-win{transition:none!important}',
    // 切页恢复出来的窗口不播入场动画，也不播正文让位的过渡：翻一页飞一次
    // 就成了「每页都在重启 Alice」，而它本该看起来一直待在那儿没动过
    '#alice-win.open.restored{animation:none}',
    'html.alice-boot body{transition:none}',
    // 侧边栏形态：贴右满高，正文由 html.alice-side 让位（见下），不遮挡阅读
    // 阴影与左边线克制一点——三栏同屏时大阴影最容易把界面「吵」起来
    '#alice-win.side{right:0;bottom:0;top:0;width:var(--al-side-w);height:100vh;max-height:100vh;border-radius:0;border:none;border-left:1px solid var(--al-border);box-shadow:none}',
    // 左侧拖拽热区（对齐课件目录 sidebar-resizer 手感）
    '#alice-win .al-side-rz{display:none}',
    '#alice-win.side .al-side-rz{display:block;position:absolute;left:0;top:0;bottom:0;width:8px;cursor:col-resize;z-index:6}',
    '#alice-win.side .al-side-rz::after{content:"";position:absolute;top:0;bottom:0;left:0;width:2px;background:transparent;transition:background .15s}',
    '#alice-win.side .al-side-rz:hover::after,html.al-side-resizing #alice-win.side .al-side-rz::after{background:var(--al-accent)}',
    'html.al-side-resizing,html.al-side-resizing *{cursor:col-resize!important;user-select:none!important}',
    'html.al-side-resizing body,html.al-side-resizing #alice-win{transition:none!important}',
    // 侧栏展开时头部略收：少占垂直空间，对话区多喘一口气
    '#alice-win.side .al-head{padding:10px 12px 8px}',
    '#alice-win.side .al-tabs{padding:4px 12px 0}',
    '#alice-win.side .al-body{padding:14px 14px}',
    // 阅读器里 Alice 撑满整个内容区，面包屑条与翻页条是浮在课件之上的，
    // 得按外壳报来的两条高度让出上下空间，才不会把正文的开头结尾压掉一截。
    // 让位挂在根元素上而不是 body：课件自己的上下留白照旧生效，两者相加。
    'html.alice-side{padding-top:var(--al-inset-top,0px);padding-bottom:var(--al-inset-bottom,0px)}',
    'html.alice-side body{padding-right:var(--al-side-w);transition:padding-right .22s ease}',
    // 顶部浮条与翻页条是 left:50% 居中的 fixed 元素，body 的 padding 管不到它们，
    // 侧边栏展开时得自己往左挪半个栏宽，否则会被压在栏下面
    'html.alice-side #nav-top-bar,html.alice-side #slide-nav{margin-left:calc(var(--al-side-w) / -2)}',
    'html.alice-side #slide-nav-trigger{right:var(--al-side-w)}',
    // 贴右上角的语言切换器同理：用 margin-right 往左推，不必知道它原本的 right
    'html.alice-side #lang-switcher{margin-right:var(--al-side-w)}',
    '@media(max-width:640px){#alice-win,#alice-win.side{right:0;bottom:0;top:auto;width:100vw;height:100vh;max-height:100vh;border-radius:0;border:none;box-shadow:none}',
      '#alice-win .al-float-rz{display:none}',
      '#alice-win.side .al-side-rz{display:none}',
      'html.alice-side{padding-top:0;padding-bottom:0}',
      'html.alice-side body{padding-right:0}',
      'html.alice-side #nav-top-bar,html.alice-side #slide-nav{margin-left:0}',
      'html.alice-side #slide-nav-trigger{right:0}',
      'html.alice-side #lang-switcher{margin-right:0}',
      '#al-btn-side{display:none}}',   // 窄屏本来就全屏，没有侧边栏可言
    // 头部
    '.al-head{display:flex;align-items:center;gap:10px;padding:12px 14px 10px;border-bottom:1px solid var(--al-soft);background:#fff;flex-shrink:0}',
    '.al-avatar{width:36px;height:36px;border-radius:50%;background:var(--al-soft);display:flex;align-items:center;justify-content:center;color:#666;font-weight:700;font-size:15px;font-family:var(--al-serif);flex-shrink:0;overflow:hidden}',
    '.al-avatar img{width:100%;height:100%;object-fit:cover;object-position:top}',
    '.al-head-info{flex:1;min-width:0}',
    '.al-head-name{font-size:15px;font-weight:700;color:var(--al-text);line-height:1.2;font-family:var(--al-serif);letter-spacing:.3px}',
    // 下载不再塞进图标组，挪到 tabs 右侧并直接说人话；头部只留会话/窗口操作。
    // 420px 窄悬浮窗里副标题必须
    // 单行截断，否则会把头部撑高
    '.al-head-sub{font-size:11px;color:var(--al-faint);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.al-rice-link{color:inherit;text-decoration:none;border-bottom:1px solid rgba(134,134,139,.35);cursor:pointer}',
    '.al-rice-link:hover{color:var(--al-text);border-bottom-color:currentColor}',
    '.al-iconbtn{background:transparent;border:none;cursor:pointer;color:var(--al-sub);padding:5px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:inherit;text-decoration:none}',
    '.al-iconbtn:hover{background:var(--al-soft);color:var(--al-text)}',
    // 吐槽已并入输入卡「问答/吐槽」切换；头部再放一枚只会和右边四个按钮抢宽度
    '#al-btn-fb{display:none}',
    // Tabs
    '.al-tabs{display:flex;align-items:center;gap:2px;padding:6px 14px 0;background:#fff;flex-shrink:0;border-bottom:1px solid var(--al-soft)}',
    '.al-tab{flex:none;background:transparent;border:none;font-size:12.5px;font-weight:700;color:var(--al-faint);padding:5px 11px 9px;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit}',
    '.al-tab.active{color:var(--al-text);border-bottom-color:var(--al-accent)}',
    '.al-download-cta{margin-left:auto;margin-bottom:6px;display:inline-flex;align-items:center;gap:4px;',
      'min-width:0;padding:6px 10px;border-radius:999px;',
      'background:linear-gradient(135deg,#10b981,#059669);color:#fff;',
      'box-shadow:0 4px 12px rgba(16,185,129,.22);',
      'font-size:10.5px;font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;',
      'transition:transform .15s,box-shadow .15s,filter .15s}',
    '.al-download-cta:hover{color:#fff;filter:saturate(1.12);transform:translateY(-1px);box-shadow:0 6px 16px rgba(16,185,129,.3)}',
    '.al-download-cta svg{width:13px;height:13px;flex-shrink:0}',
    // 消息区
    '.al-body{flex:1;overflow-y:auto;padding:16px 16px;display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch;background:#fff}',
    '.al-time{align-self:center;font-size:11px;color:var(--al-faint);padding:4px 0}',
    // 用户消息：圆角照客户端 MessageBubble——整体 24px，右上角只有 6px（那个
    // 角是气泡的「尖」，收得比其它角紧）；单行短消息整体 18px，padding 也小一号
    '.al-msg-user{align-self:flex-end;max-width:min(36rem,82%);background:var(--al-user);color:#fff;font-size:14px;line-height:1.8;letter-spacing:.015em;padding:12px 16px;border-radius:24px 6px 24px 24px;white-space:pre-wrap;word-break:break-word}',
    '.al-msg-user.short{padding:10px 14px;border-radius:18px 6px 18px 18px}',
    // Alice 消息：客户端同款 28px 圆角方头像 + 无气泡直排正文
    '.al-msg-alice{align-self:flex-start;display:flex;gap:12px;max-width:96%}',
    '.al-msg-alice .al-mini{width:28px;height:28px;border-radius:8px;flex-shrink:0;overflow:hidden;background:var(--al-soft);display:flex;align-items:center;justify-content:center;color:#666;font-family:var(--al-serif);font-size:13px;font-weight:700;margin-top:2px}',
    '.al-msg-alice .al-mini img{width:100%;height:100%;object-fit:cover;object-position:top}',
    '.al-msg-alice .al-mini.ghost{visibility:hidden}',
    '.al-msg-alice .al-mtext{flex:1;min-width:0;font-size:14px;line-height:1.8;letter-spacing:.015em;color:var(--al-text);word-break:break-word;padding-top:4px}',
    '.al-mtext p{margin:0 0 10px}.al-mtext p:last-child{margin:0}',
    '.al-mtext code{background:var(--al-soft);color:#3a3a3c;padding:1px 5px;border-radius:4px;font-size:13px;font-family:"SF Mono",Menlo,monospace}',
    '.al-mtext pre{background:#1f1f21;color:#eee;padding:10px 12px;border-radius:10px;overflow-x:auto;font-size:12px;line-height:1.6;margin:8px 0}',
    '.al-mtext pre code{background:transparent;color:inherit;padding:0}',
    '.al-mtext ul,.al-mtext ol{margin:6px 0;padding-left:20px}',
    '.al-mtext li ul,.al-mtext li ol{margin:3px 0}',
    '.al-mtext li{margin:3px 0}',
    // 任务列表：勾选框顶掉项目符号，与客户端（remark-gfm 原生 checkbox）一致
    '.al-mtext li.al-task{list-style:none;margin-left:-16px}',
    '.al-mtext li.al-task input{margin:0 6px 0 0;vertical-align:baseline;accent-color:var(--al-accent)}',
    '.al-mtext mark{background:rgba(201,150,46,.22);color:inherit;padding:0 2px;border-radius:3px}',
    '.al-mtext sup,.al-mtext sub{font-size:.75em}',
    '.al-mtext a{color:var(--al-text);text-decoration:underline;text-underline-offset:2px}',
    '.al-mtext b,.al-mtext strong{font-weight:700}',
    '.al-mtext em{font-style:italic}',
    '.al-mtext del{opacity:.55}',
    '.al-mtext h3,.al-mtext h4,.al-mtext h5{margin:14px 0 6px;font-weight:700;line-height:1.45;color:var(--al-text)}',
    '.al-mtext h3{font-size:1.2em}.al-mtext h4{font-size:1.08em}.al-mtext h5{font-size:1em}',
    '.al-mtext h3:first-child,.al-mtext h4:first-child,.al-mtext h5:first-child{margin-top:0}',
    '.al-mtext blockquote{margin:8px 0;padding:2px 0 2px 12px;border-left:2px solid var(--al-line);color:var(--al-sub)}',
    '.al-mtext hr{border:none;border-top:1px solid var(--al-border);margin:14px 0}',
    // 非课程话题分流卡：正文负责礼貌收住，卡片把「去客户端继续聊」变成清晰动作。
    '.al-client-card{margin:12px 0 4px;padding:13px;border:1px solid #e8e3d8;border-radius:16px;',
      'background:linear-gradient(145deg,#fbfaf7 0%,#f4f1ea 100%);box-shadow:0 8px 24px rgba(68,58,42,.08)}',
    '.al-client-card-head{display:flex;align-items:center;gap:10px}',
    '.al-client-card-ava{width:38px;height:38px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#fff;border:1px solid rgba(0,0,0,.06)}',
    '.al-client-card-ava img{width:100%;height:100%;object-fit:cover;object-position:top}',
    '.al-client-card-copy{min-width:0;flex:1}',
    '.al-client-card-title{font-size:13px;font-weight:700;line-height:1.4;color:var(--al-text)}',
    '.al-client-card-desc{font-size:11.5px;line-height:1.55;color:var(--al-sub);margin-top:2px}',
    '.al-client-card-btn{margin-top:11px;display:flex;align-items:center;justify-content:center;gap:6px;',
      'padding:8px 12px;border-radius:10px;background:#242424;color:#fff!important;',
      'font-size:12px;font-weight:650;text-decoration:none!important;transition:transform .15s,background .15s}',
    '.al-client-card-btn:hover{background:#111;transform:translateY(-1px)}',
    '.al-client-card-btn svg{width:14px;height:14px;flex-shrink:0}',
    // callout：客户端 BlockquoteBlock 同款六种提示卡（> [!tip] 之类）
    '.al-callout{margin:10px 0;border:1px solid;border-radius:12px;padding:10px 12px}',
    '.al-cal-h{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;margin-bottom:4px}',
    '.al-cal-b{font-size:13.5px;line-height:1.75;color:var(--al-text)}',
    '.al-cal-note,.al-cal-info{background:rgba(58,58,58,.06);border-color:rgba(58,58,58,.2)}',
    '.al-cal-note .al-cal-h,.al-cal-info .al-cal-h{color:#3a3a3c}',
    '.al-cal-tip,.al-cal-success{background:rgba(16,185,129,.09);border-color:rgba(16,185,129,.28)}',
    '.al-cal-tip .al-cal-h,.al-cal-success .al-cal-h{color:#0f766e}',
    '.al-cal-warning{background:rgba(201,150,46,.12);border-color:rgba(201,150,46,.32)}',
    '.al-cal-warning .al-cal-h{color:#9a6f14}',
    '.al-cal-danger{background:rgba(192,57,43,.09);border-color:rgba(192,57,43,.28)}',
    '.al-cal-danger .al-cal-h{color:#c0392b}',
    // 代码块头部（语种 + 复制）与表格复制钮：都是客户端有、这里补齐的
    '.al-code{margin:8px 0;border:1px solid var(--al-border);border-radius:10px;overflow:hidden}',
    '.al-code-h{display:flex;align-items:center;justify-content:space-between;padding:4px 6px 4px 12px;background:var(--al-soft)}',
    // 语种标签与复制钮不可选中：划词复制整段时不该把「PYTHON 复制」也捎上
    '.al-code-lang{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--al-faint);font-family:"SF Mono",Menlo,monospace;user-select:none;-webkit-user-select:none}',
    '.al-code pre{margin:0;border-radius:0}',
    '.al-cp{border:none;background:transparent;font-family:inherit;font-size:11px;color:var(--al-faint);padding:3px 6px;border-radius:6px;cursor:pointer;user-select:none;-webkit-user-select:none;transition:color .15s,opacity .15s}',
    '.al-cp:hover{color:var(--al-text);background:rgba(0,0,0,.04)}',
    '.al-cp.done{color:#0f766e}',
    '.al-tb-cp{position:absolute;top:3px;right:3px;background:rgba(255,255,255,.92);border:1px solid var(--al-border);opacity:0}',
    '.al-tablewrap:hover .al-tb-cp,.al-tb-cp.done{opacity:1}',
    // 表格：客户端 TableBlock 同款细边框 + 表头浅底，窄面板里横向滚动而不是压扁
    '.al-tablewrap{position:relative;overflow-x:auto;margin:10px 0;-webkit-overflow-scrolling:touch}',
    '.al-mtext table{border-collapse:collapse;width:100%;font-size:12.5px;line-height:1.6}',
    '.al-mtext th,.al-mtext td{border:1px solid var(--al-border);padding:6px 12px;text-align:left;vertical-align:top}',
    '.al-mtext thead th{background:var(--al-soft);font-weight:700;white-space:nowrap}',
    '.al-cursor{display:inline-block;width:1px;height:1em;background:var(--al-text);vertical-align:-2px;margin-left:1px;animation:al-cursor-blink .9s step-end infinite}',
    '@keyframes al-cursor-blink{50%{opacity:0}}',
    // 小声蛐蛐：客户端 .ququ-line 同款——💭 前缀的暖灰小字，可出现在正文任意位置
    '.al-whisper{display:block;width:fit-content;max-width:100%;font-size:12px;line-height:1.6;color:#7a7268;opacity:.7;margin:8px 0}',
    '.al-whisper:first-child{margin-top:0}',
    '.al-whisper .al-whisper-ico{margin-right:4px}',
    // 工具胶囊
    '.al-tool{align-self:flex-start;margin-left:40px;display:inline-flex;align-items:center;gap:8px;background:var(--al-soft);border:none;border-radius:999px;padding:5px 13px;font-size:12px;color:var(--al-sub);max-width:86%}',
    '.al-tool .al-tool-ico{flex-shrink:0}',
    '.al-tool.running .al-tool-ico{animation:al-pulse 1.1s ease-in-out infinite}',
    '@keyframes al-pulse{0%,100%{opacity:.35}50%{opacity:1}}',
    '.al-tool .al-tool-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    // 划选引用（用户消息上方）：与输入框里的引用 chip 同一副长相——图标 +
    // 来源标签 + 三行以内的原文。flex-shrink:0 不能省：它是消息区里唯一带
    // overflow:hidden 的项，自动最小尺寸归零，列表一溢出就会被压成一条缝
    '.al-quote{align-self:flex-end;flex-shrink:0;max-width:min(36rem,82%);background:var(--al-soft);border-radius:14px;padding:8px 12px;margin-bottom:-4px;font-size:12px;color:var(--al-sub)}',
    '.al-quote-h{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--al-faint);margin-bottom:3px}',
    '.al-quote-h svg{flex-shrink:0}',
    '.al-quote-t{line-height:1.65;word-break:break-word;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}',
    // 三点等待
    '.al-thinking{align-items:flex-start}',
    '.al-thinking .al-dots{display:flex;align-items:center;gap:6px;height:28px;margin-top:2px}',
    '.al-thinking i{width:6px;height:6px;border-radius:50%;background:#c9c9ce;animation:al-bounce 1.2s infinite}',
    '.al-thinking i:nth-child(2){animation-delay:.15s}.al-thinking i:nth-child(3){animation-delay:.3s}',
    '@keyframes al-bounce{0%,60%,100%{transform:none;opacity:.35}30%{transform:translateY(-4px);opacity:1}}',
    // 空态：衬线大问候居中 + 推荐 chips（对照截图首页）
    '.al-empty{margin:auto 0;padding:28px 14px;display:flex;flex-direction:column;align-items:stretch}',
    '.al-greet{font-family:var(--al-serif);font-size:24px;font-weight:700;line-height:1.5;color:var(--al-text);text-align:center;margin:0 0 22px;letter-spacing:.5px}',
    '.al-qs{display:flex;flex-direction:column;gap:8px}',
    '.al-q{background:#fff;border:1px solid var(--al-border);border-radius:12px;padding:10px 14px;font-size:13px;line-height:1.6;color:var(--al-sub);cursor:pointer;text-align:left;font-family:inherit;transition:border-color .15s,color .15s}',
    '.al-q:hover{border-color:#b8b8bd;color:var(--al-text)}',
    '.al-fb-link{align-self:center;display:inline-flex;align-items:center;margin-top:16px;',
      'background:var(--al-soft);border:1px solid var(--al-border);border-radius:999px;cursor:pointer;',
      'font-family:inherit;font-size:11px;line-height:1;color:var(--al-faint);text-align:center;',
      'padding:6px 10px;transition:color .15s,border-color .15s,background .15s}',
    '.al-fb-link:hover{color:var(--al-text);border-color:#c8c8cc;background:#fff}',
    // 提示条
    '.al-note{margin:0 14px 8px;padding:10px 12px;border-radius:12px;background:var(--al-soft);border:none;font-size:12px;line-height:1.7;color:var(--al-sub);flex-shrink:0}',
    '.al-note a{color:var(--al-text);font-weight:700;text-decoration:underline;text-underline-offset:2px}',
    '.al-rice-msg{margin-top:4px}',
    '.al-rice-msg .al-mtext{display:flex;flex-direction:column;align-items:flex-start;gap:10px}',
    '.al-recharge-cta{display:inline-flex;align-items:center;padding:7px 13px;border-radius:999px;',
      'background:linear-gradient(135deg,#10b981,#059669);color:#fff!important;text-decoration:none!important;',
      'font-size:12px;font-weight:700;line-height:1;box-shadow:0 4px 12px rgba(16,185,129,.2)}',
    '.al-recharge-cta:hover{filter:saturate(1.12);transform:translateY(-1px)}',
    // 输入区：大圆角输入卡 + 卡内工具栏 + 圆形深色发送钮（对照截图）
    // 生成声明放输入卡上方，输入卡本身就是 composer 最后一项；卡底只留安全边距，
    // 不再被一行声明垫高，看起来像悬在半空。
    '.al-composer{background:#fff;padding:0 12px calc(10px + env(safe-area-inset-bottom));flex-shrink:0}',
    '.al-inputcard{border:1px solid var(--al-line);border-radius:22px;background:#fff;padding:11px 12px 8px 16px;transition:border-color .15s}',
    '.al-inputcard:focus-within{border-color:#a8a8ad}',
    '.al-input{width:100%;border:none;padding:0;font-size:14.5px;line-height:1.6;font-family:inherit;resize:none;max-height:120px;outline:none;background:transparent;color:var(--al-text);display:block}',
    '.al-input::placeholder{color:#b8b8bd}',
    '.al-toolbar{display:flex;align-items:center;gap:4px;margin-top:7px}',
    '.al-tbtn{background:transparent;border:none;color:var(--al-sub);width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:inherit;transition:background .15s,color .15s}',
    '.al-tbtn:hover{background:var(--al-soft);color:var(--al-text)}',
    '.al-mode{background:transparent;border:none;color:var(--al-sub);font-size:12.5px;font-weight:600;padding:5px 9px;border-radius:999px;cursor:pointer;display:flex;align-items:center;gap:4px;font-family:inherit;transition:background .15s,color .15s}',
    '.al-mode:hover{background:var(--al-soft)}',
    '.al-mode.fb{background:var(--al-accent);color:#fff}',
    '.al-tb-spacer{flex:1}',
    '.al-send{background:var(--al-accent);color:#fff;border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}',
    '.al-send:hover{opacity:.85}',
    '.al-send:disabled{opacity:.3;cursor:not-allowed}',
    '.al-ai-note{font-size:10.5px;color:#c2c2c7;text-align:center;margin:0 0 7px}',
    // 模式菜单（问答 / 吐槽）：位置由 anchorPopover 现算，尖角朝下指着「问答」钮
    '.al-mode-menu{position:absolute;box-sizing:border-box;background:#fff;border:1px solid var(--al-border);border-radius:12px;box-shadow:0 12px 36px rgba(0,0,0,.14);padding:5px;z-index:12;animation:al-pop-up .16s cubic-bezier(.3,.9,.4,1)}',
    '.al-mode-menu::before,.al-mode-menu::after{content:"";position:absolute;left:var(--al-caret,50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;margin-left:-7px}',
    '.al-mode-menu::before{bottom:-7px;border-top:7px solid var(--al-border)}',
    '.al-mode-menu::after{bottom:-6px;border-top:7px solid #fff}',
    '@keyframes al-pop-up{from{opacity:0;transform:translateY(6px) scale(.97)}to{opacity:1;transform:none}}',
    '.al-mode-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:13px;color:var(--al-text);cursor:pointer;font-family:inherit;border:none;background:transparent;width:100%;text-align:left}',
    '.al-mode-item:hover{background:var(--al-soft)}',
    '.al-mode-item.cur{font-weight:700}',
    // 引用 chip / 吐槽配图
    '.al-chip{display:flex;align-items:flex-start;gap:8px;background:var(--al-soft);border:none;border-radius:12px;padding:8px 12px;margin-bottom:8px;font-size:12px;color:var(--al-sub)}',
    '.al-chip .al-chip-label{display:inline-flex;align-items:center;gap:4px;color:var(--al-text);font-weight:700;flex-shrink:0;line-height:1.5}',
    '.al-chip .al-chip-text{flex:1;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.5}',
    '.al-chip button{background:transparent;border:none;color:var(--al-faint);cursor:pointer;padding:1px 2px 0;flex-shrink:0;font-family:inherit;display:flex}',
    '.al-chip button svg{width:14px;height:14px}',
    '.al-chip button:hover{color:var(--al-text)}',
    '.al-fb-imgs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}',
    '.al-fb-thumb{position:relative;width:44px;height:44px;border-radius:10px;overflow:hidden;border:1px solid var(--al-border);flex-shrink:0}',
    '.al-fb-thumb img{width:100%;height:100%;object-fit:cover;display:block}',
    '.al-fb-thumb button{position:absolute;top:1px;right:1px;width:15px;height:15px;border-radius:50%;background:rgba(26,26,26,.72);color:#fff;border:none;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;font-family:inherit}',
    '.al-fb-thumb button svg{width:9px;height:9px;stroke-width:2.6}',
    '.al-fb-up{width:44px;height:44px;border-radius:10px;border:1.5px dashed var(--al-line);color:var(--al-faint);display:flex;align-items:center;justify-content:center;font-size:16px}',
    '.al-msg-imgs{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;margin:6px 0 2px}',
    '.al-msg-imgs img{width:96px;height:96px;object-fit:cover;border-radius:12px;border:1px solid var(--al-border)}',
    // 会话列表：从「历史」钮长出来的气泡卡（尖角对准钮心，宽度按内容收，不通栏）。
    // 尖角要露在卡外面，所以滚动交给内层 .al-sess-list，外层不能 overflow:hidden。
    '.al-sessions{position:absolute;z-index:10;box-sizing:border-box;background:#fff;border:1px solid var(--al-border);border-radius:14px;box-shadow:0 14px 44px rgba(0,0,0,.16);animation:al-pop .16s cubic-bezier(.3,.9,.4,1)}',
    '.al-sessions::before,.al-sessions::after{content:"";position:absolute;left:var(--al-caret,80%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;margin-left:-7px}',
    '.al-sessions::before{top:-7px;border-bottom:7px solid var(--al-border)}',
    '.al-sessions::after{top:-6px;border-bottom:7px solid #fff}',
    '@keyframes al-pop{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}',
    '.al-sess-list{max-height:min(50vh,340px);overflow-y:auto;padding:6px;border-radius:inherit;-webkit-overflow-scrolling:touch}',
    '.al-sess-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:9px;cursor:pointer;font-size:13px;color:var(--al-text)}',
    '.al-sess-item:hover{background:var(--al-soft)}',
    '.al-sess-item.cur{background:#ececee}',
    '.al-sess-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
    '.al-sess-meta{font-size:11px;color:var(--al-faint);flex-shrink:0}',
    '.al-sess-del{background:transparent;border:none;color:#c9c9ce;cursor:pointer;padding:2px;flex-shrink:0;font-family:inherit;display:flex;border-radius:6px}',
    '.al-sess-del svg{width:12px;height:12px}',
    '.al-sess-del:hover{color:#c0524f;background:rgba(192,82,79,.1)}',
    // 每行都挂一个叉太吵；能悬停的设备上等鼠标过去再露（触屏没有悬停，照常显示）
    '@media (hover:hover){.al-sess-del{opacity:0;transition:opacity .12s}',
      '.al-sess-item:hover .al-sess-del,.al-sess-del:focus-visible{opacity:1}}',
    '.al-sess-empty{padding:18px;text-align:center;font-size:12px;color:var(--al-faint)}',
    // 发现 tab
    '.al-discover{flex:1;overflow-y:auto;padding:16px 14px;background:#fff}',
    '.al-disc-intro{font-size:13px;line-height:1.9;color:var(--al-sub);background:var(--al-soft);border:none;border-radius:14px;padding:14px 16px;margin-bottom:12px}',
    '.al-disc-card{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--al-border);border-radius:14px;padding:14px 16px;margin-bottom:10px;text-decoration:none;transition:border-color .15s,box-shadow .15s}',
    '.al-disc-card:hover{border-color:#b8b8bd;box-shadow:0 4px 16px rgba(0,0,0,.06)}',
    '.al-disc-ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:var(--al-soft)}',
    '.al-disc-txt{flex:1;min-width:0}',
    '.al-disc-t{font-size:14px;font-weight:700;color:var(--al-text)}',
    '.al-disc-d{font-size:12px;color:var(--al-faint);margin-top:2px;line-height:1.5}',
    '.al-disc-arrow{color:#c9c9ce;font-size:16px;flex-shrink:0}',
    // 学习笔记页签：摘抄卡片列表。文本默认 5 行截断，点卡片展开
    '.al-notes{flex:1;overflow-y:auto;padding:14px;background:#fff}',
    '.al-nt{border:1px solid var(--al-border);border-radius:14px;padding:12px 14px;margin-bottom:10px;cursor:default;transition:border-color .15s}',
    '.al-nt:hover{border-color:#c9c9ce}',
    '.al-nt-head{display:flex;align-items:center;gap:8px;margin-bottom:6px}',
    '.al-nt-kind{font-size:11px;font-weight:700;color:var(--al-sub);background:var(--al-soft);border-radius:6px;padding:2px 7px;flex-shrink:0}',
    '.al-nt-kind.answer{color:#7a5c1e;background:#f7efdd}',
    '.al-nt-date{font-size:11px;color:var(--al-faint);flex:1}',
    '.al-nt-del{background:none;border:none;color:#c9c9ce;cursor:pointer;padding:2px;border-radius:6px;display:flex;flex-shrink:0}',
    '.al-nt-del:hover{color:#c0392b;background:var(--al-soft)}',
    '.al-nt-text{font-size:13px;line-height:1.75;color:var(--al-text);word-break:break-word;white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}',
    '.al-nt.open .al-nt-text{display:block;-webkit-line-clamp:none}',
    // 回答类笔记走 renderMd（PRD 24l）：块级元素自带段落间距，pre-wrap 会把
    // 源码换行叠上去变成双倍空行，得关掉；配图缩一点别把折叠卡撑爆
    '.al-nt-text.md{white-space:normal}',
    '.al-nt-text.md>:first-child{margin-top:0}',
    '.al-nt-text.md>:last-child{margin-bottom:0}',
    '.al-nt-text.md .al-mdimg{max-height:180px;width:auto;max-width:100%}',
    '.al-nt-src{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--al-faint);margin-top:8px}',
    '.al-nt-hint{font-size:12px;line-height:1.8;color:var(--al-faint);text-align:center;padding:10px 18px 18px}',
    // Alice 回答下的「存入笔记」：随消息组缩进，浅灰小钮，存好后变对勾态
    '.al-msg-act{align-self:flex-start;margin:-4px 0 0 40px}',
    '.al-nt-save{display:inline-flex;align-items:center;gap:5px;background:none;border:none;color:var(--al-faint);font-size:11.5px;font-family:inherit;cursor:pointer;padding:3px 8px;border-radius:8px}',
    '.al-nt-save:hover{color:var(--al-sub);background:var(--al-soft)}',
    '.al-nt-save.done{color:#3d7a4f;cursor:default}',
    // 朋友圈 feed（读云端 sync_moments，与桌面版同一条时间线）
    '.al-mdimg{max-width:100%;border-radius:12px;display:block;margin:8px 0;border:1px solid var(--al-soft);cursor:zoom-in}',
    '.al-mo{border-bottom:1px solid var(--al-soft);padding:14px 2px}',
    '.al-mo:last-of-type{border-bottom:none}',
    '.al-mo-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}',
    '.al-mo-ava{width:34px;height:34px;border-radius:10px;overflow:hidden;flex-shrink:0;background:var(--al-soft);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#666}',
    '.al-mo-ava img{width:100%;height:100%;object-fit:cover;object-position:top}',
    '.al-mo-name{font-size:13px;font-weight:700;color:var(--al-text)}',
    '.al-mo-time{font-size:11px;color:var(--al-faint);margin-top:1px}',
    '.al-mo-text{font-size:13.5px;line-height:1.75;color:var(--al-text);white-space:pre-wrap;word-break:break-word}',
    // 图片网格照客户端 MomentCard：单图最宽 240、多图方格 gap 4，
    // 2 张和 4 张走两列（四宫格），3 张和 5 张以上走三列
    '.al-mo-imgs{display:grid;gap:4px;margin-top:8px}',
    '.al-mo-imgs.g2{grid-template-columns:repeat(2,1fr);max-width:200px}',
    '.al-mo-imgs.g3{grid-template-columns:repeat(3,1fr);max-width:260px}',
    '.al-mo-img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:6px;background:var(--al-soft);cursor:zoom-in;display:block}',
    '.al-mo-imgs.g1{display:block}',
    '.al-mo-imgs.g1 .al-mo-img{width:auto;max-width:240px;max-height:300px;aspect-ratio:auto;border-radius:12px}',
    // 点赞行：心 + 点赞者头像 + 名字，与客户端一致（最多 6 个头像、3 个名字）
    '.al-mo-likes{display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-top:9px;font-size:12px;color:var(--al-sub)}',
    '.al-mo-heart{color:#c0392b;flex-shrink:0}',
    '.al-mo-lava{width:18px;height:18px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid #fff;background:var(--al-soft)}',
    '.al-mo-lini{width:18px;height:18px;border-radius:50%;flex-shrink:0;background:var(--al-soft);color:#666;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}',
    '.al-mo-cmts{background:transparent;border-top:1px solid var(--al-border);border-radius:0;padding:8px 0 0;margin-top:8px}',
    '.al-mo-cmt{font-size:12.5px;line-height:1.7;color:var(--al-sub);cursor:pointer;border-radius:5px;padding:1px 3px;margin:0 -3px}',
    '.al-mo-cmt:hover{background:rgba(0,0,0,.035)}',
    '.al-mo-cmt b{color:var(--al-text);font-weight:600}',
    '.al-mo-cmt .al-mo-rt{color:var(--al-faint);font-weight:400;margin:0 3px}',
    // 操作行对齐客户端：放在点赞名单和所有评论的下面；图标是 14px 的空心
    // Heart / MessageSquare，不抢正文。评论为 0 时显示「评论」，否则显示数量。
    '.al-mo-act{display:flex;justify-content:flex-start;align-items:center;gap:20px;margin-top:10px}',
    '.al-mo-act button{display:inline-flex;align-items:center;gap:6px;background:transparent;border:none;',
      'font-family:inherit;font-size:12px;color:var(--al-sub);cursor:pointer;padding:3px 2px;border-radius:6px}',
    '.al-mo-act button:hover{color:var(--al-text)}',
    '.al-mo-act button:disabled{opacity:.45;cursor:default}',
    '.al-mo-act svg{width:14px;height:14px}',
    '.al-mo-lbtn.liked{color:#c0392b}',
    '.al-mo-box{display:flex;align-items:center;gap:6px;margin-top:8px}',
    '.al-mo-box input{flex:1;min-width:0;font-family:inherit;font-size:12.5px;color:var(--al-text);background:var(--al-soft);border:1px solid transparent;border-radius:9px;padding:7px 10px;outline:none}',
    '.al-mo-box input:focus{border-color:var(--al-border);background:#fff}',
    '.al-mo-box button{flex-shrink:0;font-family:inherit;font-size:12px;color:#fff;background:var(--al-user);border:none;border-radius:9px;padding:7px 12px;cursor:pointer}',
    '.al-mo-box button:disabled{opacity:.4;cursor:default}',
    '.al-mo-end{padding:18px 8px 6px;text-align:center;font-size:11px;line-height:1.6;color:var(--al-faint)}',
    // 大图灯箱会 Portal 到 learn.html 顶层 document；样式由 ensureLightboxStyle
    // 注入顶层，不能写在当前课件 iframe 的 style 里。
  ].join('\n');
  document.head.appendChild(style);

  // ── 工具 ─────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function avatarHtml(cls) {
    return '<div class="' + cls + '"><img src="' + AVATAR_SRC + '" alt="Alice" ' +
      'onerror="this.parentNode.textContent=\'A\'"></div>';
  }

  // 蛐蛐行：与客户端 markdownUtils.ts 的 QUQU_RE 同款——整行匹配，容忍模型
  // 误加的列表/引用前缀。注意此处比对的是转义后的文本，故 > 写作 &gt;
  var QUQU_RE = /^(?:\s*(?:[-*+]|&gt;+)\s*)?~&gt;(.+)$/;

  // 行内解析。代码与链接一律先扣成占位符再做强调：客户端走 remark，`a**b**`
  // 里的星号是不解析的，链接的 href 也不会被后面的规则二次改写，这里必须一致
  function mdInline(s) {
    var holds = [];
    function hold(html) { holds.push(html); return '\u0001' + (holds.length - 1) + '\u0001'; }
    function link(href, label) {
      return hold('<a href="' + href + '" target="_blank" rel="noopener">' + label + '</a>');
    }
    return s
      .replace(/`([^`\n]+)`/g, function (_, code) { return hold('<code>' + code + '</code>'); })
      // 图片先于链接解析（![..](..) 包含 [..](..)）；只认站内生成图与 https
      .replace(/!\[([^\]]*)\]\(((?:\/alice\/img\/|https?:)[^)\s]+)\)/g,
        function (_, alt, src) {
          return hold('<img class="al-mdimg" src="' + src + '" alt="' + alt +
            '" loading="lazy">');
        })
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
        function (_, label, href) { return link(href, label); })
      // 课件互链：模型按目录写 [《标题》](learn.html#文件名)（或裸文件名），
      // 统一落到阅读器外壳并新标签打开；对方页面会自己恢复当前对话
      .replace(/\[([^\]]+)\]\(((?:learn\.html#)?[\w][\w.-]*\.html)\)/g,
        function (_, label, target) {
          return link('learn.html#' + target.replace(/^learn\.html#/, ''), label);
        })
      // GFM autolink literals：显式链接已经扣走，剩下的裸地址才在这里成链。
      // 结尾的中英文标点不吃进 URL，否则「见 https://x.com。」会连句号一起跳
      .replace(/(^|[\s(（【「])((?:https?:\/\/|www\.)[^\s<>()（）【】「」，。、；：！？"']+)/g,
        function (_, pre, url) {
          return pre + link(url.indexOf('www.') === 0 ? 'https://' + url : url, url);
        })
      .replace(/==([^=\n]+)==/g, '<mark>$1</mark>')
      // 客户端 fixCjkBold 会把 `** 文字 **` 收成 `**文字**`，这里直接吃掉内侧空格
      .replace(/\*\*([^*]+)\*\*/g,
        function (_, t) { return '<strong>' + t.trim() + '</strong>'; })
      .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      // 删除线在下标之前：~~x~~ 与 ~x~ 共用波浪号，顺序反了就会咬掉一半
      .replace(/~~([^~\n]+)~~/g, '<del>$1</del>')
      .replace(/\^([^\s^]+)\^/g, '<sup>$1</sup>')
      .replace(/~([^\s~]+)~/g, '<sub>$1</sub>')
      .replace(/\u0001(\d+)\u0001/g, function (_, i) { return holds[+i]; });
  }

  // GFM 表格的 |---|:--:| 分隔行，它的上一行才是表头
  function isTableSep(s) {
    return s.indexOf('|') >= 0 &&
      /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(s);
  }
  function splitRow(s) {
    return s.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
      .map(function (c) { return c.trim(); });
  }
  // 列表缩进量：tab 按 4 格算，跟编辑器和 remark 的默认一致
  function indentOf(s) { return s.replace(/\t/g, '    ').length; }

  // 引用块的 callout 标记：客户端 BlockquoteBlock 支持这六种，> [!tip] 这类
  // 写法会变成带图标的提示卡，不再是一条灰竖线
  var CALLOUTS = {
    note: '📝', info: 'ℹ️', tip: '💡', success: '✅', warning: '⚠️', danger: '🚨'
  };
  var CALLOUT_RE = /^\s*\[!(note|info|tip|success|warning|danger)\]\s*/i;
  var SCOPE_CTA_RE =
    /^\[[^\]]+\]\(https:\/\/alice\.miyang\.cn\/download\?from=xueai-scope\)$/;

  function scopeDownloadCard() {
    return '<div class="al-client-card">' +
      '<div class="al-client-card-head">' + avatarHtml('al-client-card-ava') +
        '<div class="al-client-card-copy">' +
          '<div class="al-client-card-title">' + esc(T.scopeCtaTitle) + '</div>' +
          '<div class="al-client-card-desc">' + esc(T.scopeCtaDesc) + '</div>' +
        '</div>' +
      '</div>' +
      '<a class="al-client-card-btn" href="' + ALICE_SITE +
        '/download?from=xueai-scope" target="_blank" rel="noopener">' +
        svg('download') + esc(T.scopeCtaButton) + '</a>' +
      '</div>';
  }

  // 极简 markdown 渲染（先转义再变换，天然防 XSS）。覆盖面对齐客户端
  // react-markdown + remark-gfm/mark/supersub 的可见能力：表格、代码块、引用与
  // callout、分割线、多级列表与任务列表、标题、粗斜体删除线高亮上下标、
  // 链接与裸链接；~> 行按 QUQU_RE 拆成蛐蛐，可散落任意位置
  function renderMd(src) {
    var text = esc(src);
    // 代码块先抽走，免得块里的 | # - 被当成表格/标题/列表
    var blocks = [];
    text = text.replace(/```([\s\S]*?)```/g, function (_, raw) {
      var m = /^([\w+.#-]*)[ \t]*\n([\s\S]*)$/.exec(raw);
      var lang = m ? m[1] : '';
      var code = (m ? m[2] : raw).replace(/\n+$/, '');
      // 头部的语种标签与复制钮对齐客户端 CodeBlock（那边还有行号与高亮，
      // 窄面板里没必要，也不值得为它拖一个 hljs 进来）
      blocks.push('<div class="al-code"><div class="al-code-h">' +
        '<span class="al-code-lang">' + (lang || 'code') + '</span>' +
        '<button type="button" class="al-cp" data-cp="code">' + T.copy + '</button>' +
        '</div><pre><code>' + code + '</code></pre></div>');
      return '\u0000B' + (blocks.length - 1) + '\u0000';
    });
    var lines = text.split('\n');
    var html = [], para = [], quote = [];
    // 列表按缩进分层，与 remark 一致：每层记住它的标签与缩进量，
    // 栈里每一层都有一个「还开着」的 <li>，嵌套列表就长在那个 li 里面
    var listStack = [];
    function flushPara() {
      if (para.length) { html.push('<p>' + para.map(mdInline).join('<br>') + '</p>'); para = []; }
    }
    function closeList(toIndent) {
      while (listStack.length &&
             listStack[listStack.length - 1].indent > toIndent) {
        html.push('</li></' + listStack.pop().tag + '>');
      }
    }
    function closeAllLists() { closeList(-1); }
    function flushQuote() {
      if (!quote.length) return;
      var body = quote, cal = CALLOUT_RE.exec(quote[0]);
      if (cal) {
        var kind = cal[1].toLowerCase();
        body = quote.slice();
        body[0] = body[0].slice(cal[0].length);
        if (!body[0].trim()) body.shift();
        html.push('<div class="al-callout al-cal-' + kind + '">' +
          '<div class="al-cal-h"><span>' + CALLOUTS[kind] + '</span><span>' +
          esc(T.callout[kind]) + '</span></div>' +
          (body.length ? '<div class="al-cal-b">' +
            body.map(mdInline).join('<br>') + '</div>' : '') + '</div>');
      } else {
        html.push('<blockquote>' + quote.map(mdInline).join('<br>') + '</blockquote>');
      }
      quote = [];
    }
    function flushAll() { flushPara(); closeAllLists(); flushQuote(); }
    // 列表项：ind 是缩进量，tag 决定有序无序
    function pushItem(ind, tag, content) {
      flushPara();
      closeList(ind);
      var top = listStack[listStack.length - 1];
      if (!top || ind > top.indent) {
        html.push('<' + tag + '>');            // 开新一层，长在上一项的 li 里
        listStack.push({ tag: tag, indent: ind });
      } else if (top.tag !== tag) {
        html.push('</li></' + top.tag + '>');  // 同层换了有序/无序：另起一列表
        listStack.pop();
        html.push('<' + tag + '>');
        listStack.push({ tag: tag, indent: ind });
      } else {
        html.push('</li>');                    // 同层同类：接着排
      }
      // 任务列表（remark-gfm）：渲染成禁用态勾选框，与客户端一致
      var task = /^\[([ xX])\]\s+(.*)$/.exec(content);
      if (task) {
        html.push('<li class="al-task"><input type="checkbox" disabled' +
          (task[1] === ' ' ? '' : ' checked') + '>' + mdInline(task[2]));
      } else {
        html.push('<li>' + mdInline(content));
      }
    }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i], t = ln.trim();
      var mB = /^\u0000B(\d+)\u0000$/.exec(t);
      if (mB) { flushAll(); html.push(blocks[+mB[1]]); continue; }
      if (SCOPE_CTA_RE.test(t)) {
        flushAll();
        html.push(scopeDownloadCard());
        continue;
      }
      var mW = QUQU_RE.exec(ln);
      if (mW) {
        flushAll();
        html.push('<div class="al-whisper"><span class="al-whisper-ico">💭</span>' +
          '<span>' + mdInline(mW[1].trim()) + '</span></div>');
        continue;
      }
      if (t.indexOf('|') >= 0 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        flushAll();
        var head = splitRow(t), rows = [];
        for (i += 2; i < lines.length; i++) {
          var rt = lines[i].trim();
          if (!rt || rt.indexOf('|') < 0) break;
          rows.push(splitRow(rt));
        }
        i--;
        // 复制钮对齐客户端 TableBlock：悬浮才出现，复制出来是 TSV
        var tb = ['<div class="al-tablewrap">' +
          '<button type="button" class="al-cp al-tb-cp" data-cp="table">' +
          T.copy + '</button><table><thead><tr>'];
        for (var h = 0; h < head.length; h++) tb.push('<th>' + mdInline(head[h]) + '</th>');
        tb.push('</tr></thead><tbody>');
        for (var r = 0; r < rows.length; r++) {
          tb.push('<tr>');
          for (var c = 0; c < head.length; c++) tb.push('<td>' + mdInline(rows[r][c] || '') + '</td>');
          tb.push('</tr>');
        }
        tb.push('</tbody></table></div>');
        html.push(tb.join(''));
        continue;
      }
      var mQ = /^\s{0,3}&gt;\s?(.*)$/.exec(ln);
      if (mQ) { flushPara(); closeAllLists(); quote.push(mQ[1]); continue; }
      flushQuote();
      if (/^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(ln)) { flushAll(); html.push('<hr>'); continue; }
      var mH = /^(#{1,6})\s+(.*)$/.exec(ln);
      if (mH) {
        flushAll();
        // 面板窄，再大的标题也没意义，一律压到三级以内
        var tag = 'h' + (Math.min(3, mH[1].length) + 2);
        html.push('<' + tag + '>' + mdInline(mH[2]) + '</' + tag + '>');
        continue;
      }
      var mUl = /^([ \t]*)[-*+]\s+(.*)$/.exec(ln);
      if (mUl) { pushItem(indentOf(mUl[1]), 'ul', mUl[2]); continue; }
      var mOl = /^([ \t]*)\d+[.、]\s+(.*)$/.exec(ln);
      if (mOl) { pushItem(indentOf(mOl[1]), 'ol', mOl[2]); continue; }
      closeAllLists();
      if (t === '') { flushPara(); } else { para.push(ln); }
    }
    flushAll();
    return html.join('');
  }

  // 图标一律照抄 Lucide 原始 path，与客户端 src/components/icons/* 同源，
  // stroke-width 统一 1.5——手搓的近似图形摆在客户端旁边一眼就是两家的东西。
  // 键名后的注释是对应的 Lucide 图标名，要换图标去 lucide.dev 取 path，别手改。
  var ICON_PATHS = {
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',   // x
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',   // file-text：引用来源，同客户端 NoteRefChip
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',   // book-open
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',   // bookmark：存入笔记
    feedback: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v2"/><path d="M12 13h.01"/>',   // message-square-warning
    image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',   // 发送钮：圆形深底上箭头
    comment: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', // message-square
    heartOutline: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    chevron: '<polyline points="6 9 12 15 18 9"/>',   // chevron-down
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    panelSide: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>',   // panel-right
    panelFloat: '<path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><rect width="10" height="7" x="12" y="13" rx="2"/>'   // picture-in-picture-2
  };
  var ICON_SIZE = { doc: 12, book: 13, search: 13, comment: 18, heartOutline: 18, chevron: 11, arrowUp: 16, bookmark: 13 };

  // cls 可选：挂到根 <svg> 上（点赞行那颗心要上色，不能靠外层包一层）
  function svg(name, cls) {
    // 点赞的心是实心的（Lucide heart 的 path 直接填色）：13px 下描边版会糊成一团
    if (name === 'heart') {
      return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' width="13" height="13" ' +
        'viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    }
    var d = ICON_PATHS[name];
    if (!d) return '';
    var s = ICON_SIZE[name] || 17;
    return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' width="' + s + '" height="' + s + '" ' +
      'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  function fmtTime(ts) {
    var d = new Date(ts * 1000);
    var now = new Date();
    var hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    var dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (d.getTime() >= dayStart) return hm;
    if (d.getTime() >= dayStart - 86400000) return T.yesterday + ' ' + hm;
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + hm;
  }

  function pickGreeting() {
    var h = new Date().getHours();
    var pool = h < 5 ? T.greetings.night
      : h < 11 ? T.greetings.morning
      : h < 14 ? T.greetings.noon
      : h < 18 ? T.greetings.afternoon
      : T.greetings.evening;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── DOM：划词浮层 ────────────────────────────────────────────────────
  var pop = document.createElement('div');
  pop.id = 'alice-pop';
  pop.innerHTML =
    '<button id="alice-pop-ask">' + avatarHtml('al-dot') + esc(T.ask) + '</button>' +
    '<div class="al-sep"></div>' +
    '<button id="alice-pop-clip">' + esc(T.popClip) + '</button>' +
    '<div class="al-sep"></div>' +
    '<button id="alice-pop-fb">' + esc(T.popFb) + '</button>' +
    '<div class="al-sep"></div>' +
    '<button id="alice-pop-copy">' + esc(T.copy) + '</button>';
  document.body.appendChild(pop);

  var lastSelText = '';

  function hidePop() { pop.style.display = 'none'; }

  function maybeShowPop() {
    if (!state.enabled) { hidePop(); return; }
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { hidePop(); return; }
    var text = sel.toString().trim();
    if (!text || text.length < 2) { hidePop(); return; }
    var node = sel.anchorNode;
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (el && el.closest && el.closest('#alice-win,#alice-pop')) { hidePop(); return; }
    lastSelText = text.slice(0, 2000);
    var rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) { hidePop(); return; }
    pop.style.display = 'flex';
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    // 侧边栏展开时可用宽度只到栏的左边缘，否则靠右的选区会把浮层顶到栏底下
    var avail = window.innerWidth;
    if (state.open && state.side) avail -= win.getBoundingClientRect().width;
    var x = rect.left + rect.width / 2 - pw / 2;
    x = Math.max(8, Math.min(x, avail - pw - 8));
    var y = rect.top - ph - 8;
    if (y < 8) y = rect.bottom + 8;
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
  }

  document.addEventListener('mouseup', function (e) {
    if (pop.contains(e.target)) return;
    setTimeout(maybeShowPop, 10);
  });
  document.addEventListener('touchend', function () {
    setTimeout(maybeShowPop, 150);
  }, { passive: true });
  document.addEventListener('mousedown', function (e) {
    if (!pop.contains(e.target)) hidePop();
  });
  document.addEventListener('scroll', hidePop, { passive: true, capture: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { hidePop(); if (state.open) closeWin(); }
  });

  pop.querySelector('#alice-pop-copy').addEventListener('click', function () {
    var btn = this;
    function done() {
      btn.textContent = T.copied;
      setTimeout(function () { btn.textContent = T.copy; hidePop(); }, 700);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastSelText).then(done, done);
    } else {
      try { document.execCommand('copy'); } catch (err) {}
      done();
    }
  });

  pop.querySelector('#alice-pop-ask').addEventListener('click', function () {
    state.pendingQuote = lastSelText;
    hidePop();
    try { window.getSelection().removeAllRanges(); } catch (e) {}
    if (state.feedbackMode) exitFeedbackMode();
    openWin();
    showTab('chat');   // 停在「朋友圈」页时点问问，得先把人带回对话页
    renderChip();
    // 划选带引用时预填一句通用提问：用户直接点发送就能问，也可以改字
    if (inputEl && !inputEl.value.trim()) {
      inputEl.value = T.quoteAsk;
      autoGrow();
      inputEl.focus();
      inputEl.select();   // 整句选中，想换问法时打字即覆盖
    } else if (inputEl) {
      inputEl.focus();
    }
  });

  // 划词摘抄：原地完成，不打断阅读。按钮短暂变「已存入笔记」再收起浮层。
  pop.querySelector('#alice-pop-clip').addEventListener('click', function () {
    var btn = this;
    var text = lastSelText;
    if (!state.loggedIn) {
      // 未登录看不出是谁的笔记本：带他进面板的笔记页签，那里有登录入口
      hidePop();
      try { window.getSelection().removeAllRanges(); } catch (e) {}
      openWin();
      showTab('notes');
      return;
    }
    if (btn.disabled) return;
    btn.disabled = true;
    saveNote('selection', text, function (dup) {
      btn.textContent = dup ? T.clipDup : T.clipSaved;
      setTimeout(function () {
        btn.textContent = T.popClip;
        btn.disabled = false;
        hidePop();
      }, 900);
      try { window.getSelection().removeAllRanges(); } catch (e) {}
    }, function () {
      btn.textContent = T.clipFail;
      setTimeout(function () {
        btn.textContent = T.popClip;
        btn.disabled = false;
      }, 1500);
    });
  });

  pop.querySelector('#alice-pop-fb').addEventListener('click', function () {
    var sel = lastSelText;
    hidePop();
    try { window.getSelection().removeAllRanges(); } catch (e) {}
    enterFeedbackMode(sel);
  });

  // ── DOM：常驻头像按钮 ────────────────────────────────────────────────
  var fab = document.createElement('button');
  fab.id = 'alice-fab';
  fab.title = T.ask;
  fab.className = 'hidden';   // 等 /alice/me 确认 enabled 再露；灰度外用户永远不出现
  fab.innerHTML = '<img src="' + AVATAR_SRC + '" alt="Alice" ' +
    'onerror="this.outerHTML=\'<div class=&quot;al-fab-fallback&quot;>A</div>\'">';
  document.body.appendChild(fab);
  fab.addEventListener('click', function () { if (state.enabled) openWin(); });

  var fabNudge = document.createElement('button');
  fabNudge.id = 'alice-fab-nudge';
  fabNudge.type = 'button';
  fabNudge.textContent = T.fabNudge;
  document.body.appendChild(fabNudge);

  function nudgeDay() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' + ('0' + d.getDate()).slice(-2);
  }

  function hideFabNudge() {
    fabNudge.classList.remove('show');
  }

  function consumeFabNudgeToday() {
    hideFabNudge();
    try { localStorage.setItem(FAB_NUDGE_DAY_KEY, nudgeDay()); } catch (e) {}
  }

  function maybeShowFabNudge() {
    if (!state.enabled || state.open || fab.classList.contains('hidden')) {
      hideFabNudge();
      if (state.open) consumeFabNudgeToday();
      return;
    }
    var seen = '';
    try { seen = localStorage.getItem(FAB_NUDGE_DAY_KEY) || ''; } catch (e) {}
    // 同一页里 /alice/me 会再确认一次 enabled；如果气泡刚刚已经露出，
    // 这次确认不能把它误当成“今天已看过的旧气泡”关掉。
    if (seen === nudgeDay()) {
      if (!fabNudge.classList.contains('show')) hideFabNudge();
      return;
    }
    // “每天显示一次”按真正露出时记账；翻课件不能重复轰炸。
    fabNudge.classList.add('show');
    try { localStorage.setItem(FAB_NUDGE_DAY_KEY, nudgeDay()); } catch (e) {}
  }

  fabNudge.addEventListener('click', function () {
    consumeFabNudgeToday();
    if (state.enabled) openWin();
  });
  // 页面跨过午夜但没有刷新，也要按新的一天重新判定。
  setInterval(function () {
    if (state.open) consumeFabNudgeToday();
    else maybeShowFabNudge();
  }, 60 * 1000);

  // ── DOM：悬浮窗 ──────────────────────────────────────────────────────
  var win = document.createElement('div');
  win.id = 'alice-win';
  win.innerHTML =
    '<div class="al-float-rz al-float-rz-l" data-rz="w" title="' + esc(T.resizeFloat) + '"></div>' +
    '<div class="al-float-rz al-float-rz-t" data-rz="h" title="' + esc(T.resizeFloat) + '"></div>' +
    '<div class="al-float-rz al-float-rz-nw" data-rz="nw" title="' + esc(T.resizeFloat) + '"></div>' +
    '<div class="al-side-rz" id="al-side-rz" role="separator" aria-orientation="vertical" title="' + esc(T.resizeSide) + '"></div>' +
    '<div class="al-head">' +
      avatarHtml('al-avatar') +
      '<div class="al-head-info">' +
        '<div class="al-head-name">' + esc(T.title) + '</div>' +
        '<div class="al-head-sub" id="al-sub">' + esc(T.subtitle) + '</div>' +
      '</div>' +
      '<button class="al-iconbtn" id="al-btn-new" title="' + esc(T.newChat) + '">' + svg('plus') + '</button>' +
      '<button class="al-iconbtn" id="al-btn-hist" title="' + esc(T.sessions) + '" style="display:none">' + svg('history') + '</button>' +
      '<button class="al-iconbtn" id="al-btn-fb" title="' + esc(T.feedback) + '">' + svg('feedback') + '</button>' +
      '<button class="al-iconbtn" id="al-btn-side" title="' + esc(T.expandSide) + '">' + svg('panelSide') + '</button>' +
      '<button class="al-iconbtn" id="al-btn-close">' + svg('close') + '</button>' +
    '</div>' +
    '<div class="al-tabs">' +
      '<button class="al-tab active" data-tab="chat">' + esc(T.tabChat) + '</button>' +
      '<button class="al-tab" data-tab="notes">' + esc(T.tabNotes) + '</button>' +
      '<button class="al-tab" data-tab="discover">' + esc(T.tabDiscover) + '</button>' +
      '<a class="al-download-cta" id="al-btn-dl" style="display:none" href="' + ALICE_SITE + '/download" target="_blank" ' +
        'rel="noopener" title="' + esc(T.downloadFull) + '">' +
        svg('download') + '<span>' + esc(T.downloadFull) + '</span></a>' +
    '</div>' +
    '<div class="al-body" id="al-body"></div>' +
    '<div class="al-discover" id="al-discover" style="display:none">' +
      '<div class="al-disc-intro">' + esc(T.discoverIntro) + '</div>' +
      '<a class="al-disc-card" href="' + ALICE_SITE + '/gallery" target="_blank" rel="noopener">' +
        '<div class="al-disc-ico">🎨</div><div class="al-disc-txt">' +
        '<div class="al-disc-t">' + esc(T.dGallery) + '</div>' +
        '<div class="al-disc-d">' + esc(T.dGalleryDesc) + '</div></div>' +
        '<div class="al-disc-arrow">›</div></a>' +
      '<a class="al-disc-card" href="' + ALICE_SITE + '" target="_blank" rel="noopener">' +
        '<div class="al-disc-ico">📸</div><div class="al-disc-txt">' +
        '<div class="al-disc-t">' + esc(T.dMoments) + '</div>' +
        '<div class="al-disc-d">' + esc(T.dMomentsDesc) + '</div></div>' +
        '<div class="al-disc-arrow">›</div></a>' +
    '</div>' +
    '<div class="al-notes" id="al-notes" style="display:none"></div>' +
    '<div class="al-note" id="al-note" style="display:none"></div>' +
    // 生成声明在卡上方；输入卡是最后一项，才能真正贴近面板底部。
    // 卡内仍是多行输入在上、工具栏在下（+ / 模式切换），右侧圆形上箭头。
    '<div class="al-composer" id="al-composer">' +
      '<div id="al-chip-wrap"></div>' +
      '<div class="al-ai-note">' + esc(T.aiNote) + '</div>' +
      '<div class="al-inputcard">' +
        '<textarea class="al-input" rows="1" placeholder="' + esc(T.placeholder) + '"></textarea>' +
        '<div class="al-toolbar">' +
          '<button class="al-tbtn" id="al-attach" title="' + esc(T.fbAttach) + '">' + svg('plus') + '</button>' +
          '<button class="al-mode" id="al-mode" type="button">' +
            '<span id="al-mode-label">' + esc(T.modeChat) + '</span>' + svg('chevron') +
          '</button>' +
          '<div class="al-tb-spacer"></div>' +
          '<button class="al-send" title="' + esc(T.send) + '">' + svg('arrowUp') + '</button>' +
        '</div>' +
      '</div>' +
      '<input type="file" id="al-file" accept="image/png,image/jpeg,image/gif,image/webp" multiple style="display:none">' +
    '</div>';
  document.body.appendChild(win);

  var bodyEl = win.querySelector('#al-body');
  var noteEl = win.querySelector('#al-note');
  var inputEl = win.querySelector('.al-input');
  var sendBtn = win.querySelector('.al-send');
  var chipWrap = win.querySelector('#al-chip-wrap');
  var discoverEl = win.querySelector('#al-discover');
  var notesEl = win.querySelector('#al-notes');
  var composerEl = win.querySelector('#al-composer');
  // 空态兜底：保留原「发现」介绍 + 三张卡（没登录/没同步过的用户看这个）
  var discoverFallbackHtml = discoverEl.innerHTML;

  // 代码块与表格的复制钮（对齐客户端 CodeBlock / TableBlock）+ 生成图灯箱。
  // 消息是整段 innerHTML 重绘的，流式期每来一个 delta 就换一批节点，只能事件
  // 委托；笔记卡里「Alice 的回答」走同一套 renderMd，所以这段逻辑两处共用。
  // 返回 true 表示这次点击已被富内容消费，调用方别再当普通卡片点击处理。
  function richContentClick(e) {
    var mdImg = e.target.closest && e.target.closest('.al-mdimg');
    if (mdImg) {
      openLightbox([mdImg.currentSrc || mdImg.src], 0);
      return true;
    }
    var btn = e.target.closest && e.target.closest('.al-cp');
    if (!btn) return false;
    var text = '';
    if (btn.getAttribute('data-cp') === 'code') {
      var code = btn.closest('.al-code').querySelector('pre code');
      text = code ? code.textContent : '';
    } else {
      // 表格复制成 TSV，跟客户端一样，粘进表格软件就是一张表
      var rows = btn.closest('.al-tablewrap').querySelectorAll('tr');
      text = Array.prototype.map.call(rows, function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll('th,td'), function (c) {
          return c.innerText.trim();
        }).join('\t');
      }).join('\n');
    }
    if (!text) return true;
    (navigator.clipboard ? navigator.clipboard.writeText(text)
      : Promise.reject()).then(function () {
        btn.textContent = T.copied;
        btn.classList.add('done');
        setTimeout(function () {
          btn.textContent = T.copy;
          btn.classList.remove('done');
        }, 1500);
      }, function () {});
    return true;
  }
  bodyEl.addEventListener('click', richContentClick);

  // ── 朋友圈 feed（云端 sync_moments，与桌面版同一条时间线）──────────────
  // 排版规则全部照客户端 MomentCard 抄：同一条动态在网页和桌面端看到的
  // 图片网格、点赞行、「A 回复 B：」都得长一样，不然像两个产品。
  var momentsFetchedAt = 0;
  var momentsCache = [];
  var momentsHasMore = false;
  var momentsVisibleLimit = 20;
  var downloadCardVisible = false;
  var MOMENTS_FRESH_TTL = 5 * 60 * 1000;
  var MOMENTS_MAX_TTL = 24 * 60 * 60 * 1000;
  var momentReply = null;       // { mid, cid, name } 正在回复谁

  // NPC 朋友：名字与客户端 DATA_I18N.tts.agentVoiceInfo 同源，头像取自
  // 客户端 src/public/agents 压到 96px 的副本（slides/friends/）
  var FRIENDS = {
    alice:      { zh: '白艾莉', en: 'Alice', ko: '백아이리' },
    researcher: { zh: '陈知远', en: 'Ken', ko: '첸즈위안', av: 'researcher' },
    translator: { zh: '林晓雨', en: 'Sherry', ko: '린샤오위', av: 'translator' },
    writer:     { zh: '方以南', en: 'Yinan', ko: '팡이난', av: 'writer' },
    voice:      { zh: '苏墨', en: 'Mo', ko: '수모', av: 'voice' },
    designer:   { zh: '周念', en: 'Nina', ko: '주녠', av: 'designer' },
    artist:     { zh: '叶初', en: 'Chu', ko: '예초', av: 'artist' },
    analyst:    { zh: '魏博', en: 'Bo', ko: '웨이보', av: 'analyst' },
    quant:      { zh: '邢斐', en: 'Faye', ko: '싱페이', av: 'quant' },
    novelist:   { zh: '沈遥', en: 'Yao', ko: '선야오', av: 'novelist' },
    developer:  { zh: '张予', en: 'Ray', ko: '장위', av: 'developer' },
    docsmith:   { zh: '陆析', en: 'Lu Xi', ko: '루시', av: 'docsmith' },
    critic:     { zh: '顾辛', en: 'Xin', ko: '고신', av: 'critic' },
    scholar:    { zh: '谢清', en: 'Qing', ko: '셰칭', av: 'scholar' }
  };

  function momentAuthorName(a) {
    if (a === 'user') return state.nickname || T.mYou;
    if (!a) a = 'alice';
    var f = FRIENDS[a];
    return f ? (f[LANG] || f.zh) : a;
  }

  // 点赞行的小头像：Alice 用她本人的图，NPC 用朋友头像，用户和未知 id 落回首字
  function momentAvatar(a, cls) {
    var src = a === 'alice' || !a ? AVATAR_SRC
      : (FRIENDS[a] && FRIENDS[a].av ? 'friends/avatar_' + FRIENDS[a].av + '.webp' : '');
    if (!src) {
      return '<div class="' + cls.replace('lava', 'lini') + '">' +
        esc(momentAuthorName(a).slice(0, 1)) + '</div>';
    }
    return '<img class="' + cls + '" src="' + esc(src) + '" alt="" loading="lazy">';
  }

  function likesRow(m) {
    var list = (m.liked_by || []).filter(function (l) { return l && l.author; });
    var n = m.likes || list.length;
    if (!n) return '';
    var avas = list.slice(0, 6).map(function (l) {
      return momentAvatar(l.author, 'al-mo-lava');
    }).join('');
    var names = list.slice(0, 3).map(function (l) {
      return momentAuthorName(l.author);
    }).join('、');
    if (list.length > 3) {
      names += ' ' + T.mLikeMore.replace('{n}', String(list.length));
    }
    return '<div class="al-mo-likes">' + svg('heart', 'al-mo-heart') + avas +
      '<span>' + esc(names || String(n)) + '</span></div>';
  }

  // 「A 回复 B：内容」只在父评论确实在同一条动态里时才成立，找不到就退回
  // 「A：内容」——和客户端 MomentCard 的判定完全一致
  function commentsBlock(m) {
    var list = m.comments || [];
    if (!list.length) return '';
    var byId = {};
    list.forEach(function (c) { if (c && c.id) byId[c.id] = c; });
    return '<div class="al-mo-cmts">' + list.map(function (c) {
      var parent = c.replyTo ? byId[c.replyTo] : null;
      return '<div class="al-mo-cmt" data-cid="' + esc(c.id || '') + '">' +
        '<b>' + esc(momentAuthorName(c.author)) + '</b>' +
        (parent ? '<span class="al-mo-rt">' + esc(T.mReply) + '</span><b>' +
          esc(momentAuthorName(parent.author)) + '</b>' : '') +
        '：' + esc(c.text || '') + '</div>';
    }).join('') + '</div>';
  }

  function momentActions(m) {
    var liked = (m.liked_by || []).some(function (l) {
      return l && l.author === 'user';
    });
    var count = Math.max(0, +(m.likes || 0));
    var commentCount = (m.comments || []).length;
    return '<div class="al-mo-act">' +
      '<button type="button" class="al-mo-lbtn' + (liked ? ' liked' : '') +
        '" aria-label="' + esc(T.mLike || 'Like') + '">' +
        svg('heartOutline') + '<span>' + count + '</span></button>' +
      '<button type="button" class="al-mo-cbtn">' +
        svg('comment') + '<span>' +
        esc(commentCount ? String(commentCount) : T.mComment) + '</span></button></div>';
  }

  function momentCard(m) {
    var pics = m.images || [];
    var grid = pics.length === 1 ? 'g1' : (pics.length === 2 || pics.length === 4 ? 'g2' : 'g3');
    var imgs = pics.map(function (u, i) {
      return '<img class="al-mo-img" loading="lazy" data-i="' + i + '" src="' +
        esc(u) + '" alt="">';
    }).join('');
    var replying = momentReply && momentReply.mid === m.id;
    return '<div class="al-mo" data-mid="' + esc(m.id || '') + '">' +
      '<div class="al-mo-head">' + momentHeadAvatar(m.author) +
        '<div><div class="al-mo-name">' + esc(momentAuthorName(m.author)) + '</div>' +
        '<div class="al-mo-time">' + esc(fmtTime(Math.floor((m.created_at || 0) / 1000))) +
        (m.mood ? ' · ' + esc(m.mood) : '') + '</div></div></div>' +
      '<div class="al-mo-text">' + esc(m.text || '') + '</div>' +
      (imgs ? '<div class="al-mo-imgs ' + grid + '">' + imgs + '</div>' : '') +
      likesRow(m) + commentsBlock(m) +
      (replying
        ? '<div class="al-mo-box">' +
            '<input type="text" maxlength="300" placeholder="' +
              esc(momentReply.cid
                ? T.mReplyPh.replace('{name}', momentReply.name)
                : T.mCmtPh) + '">' +
            '<button type="button" class="al-mo-send">' + esc(T.mSend) + '</button></div>'
        : '') + momentActions(m) +
      '</div>';
  }

  function momentHeadAvatar(a) {
    if (a === 'user') {
      return '<div class="al-mo-ava">' + esc((state.nickname || T.mYou).slice(0, 1)) + '</div>';
    }
    if (a && a !== 'alice' && FRIENDS[a] && FRIENDS[a].av) {
      return '<div class="al-mo-ava"><img src="friends/avatar_' + FRIENDS[a].av +
        '.webp" alt=""></div>';
    }
    return avatarHtml('al-mo-ava');
  }

  function downloadBenefitCard() {
    // 只给服务端确认“从未登录过客户端”的账号看；未知状态不闪广告，老用户不打扰。
    if (!downloadCardVisible || !state.loggedIn || state.hasAliceClient !== false) return '';
    return '<a class="al-disc-card dl" href="' + ALICE_SITE +
      '/download" target="_blank" rel="noopener">' +
      '<div class="al-disc-ico">✨</div><div class="al-disc-txt">' +
      '<div class="al-disc-t">' + esc(T.dDownload) + '</div>' +
      '<div class="al-disc-d">' + esc(T.dDownloadDesc) + '</div></div>' +
      '<div class="al-disc-arrow">›</div></a>';
  }

  function renderMoments(list) {
    if (list) momentsCache = list;
    if (!momentsCache.length) {
      discoverEl.innerHTML =
        '<div class="al-disc-intro">' + esc(T.mEmpty) + '</div>' +
        downloadBenefitCard() + discoverFallbackHtml;
      return;
    }
    discoverEl.innerHTML = momentsCache.map(momentCard).join('') +
      (momentsHasMore
        ? '<div class="al-mo-end">' + esc(T.mMore(momentsVisibleLimit)) + '</div>'
        : '') + downloadBenefitCard();
    if (momentReply) {
      var box = discoverEl.querySelector('.al-mo[data-mid="' + momentReply.mid + '"] input');
      if (box) box.focus();
    }
  }

  function stashMoments() {
    try {
      localStorage.setItem(MOMENTS_KEY, JSON.stringify({
        ts: momentsFetchedAt || Date.now(),
        has_more: momentsHasMore,
        limit: momentsVisibleLimit,
        moments: momentsCache.slice(0, 50)
      }));
    } catch (e) {}
  }

  function restoreMoments() {
    var c = null;
    try { c = JSON.parse(localStorage.getItem(MOMENTS_KEY) || 'null'); } catch (e) {}
    if (!c || !Array.isArray(c.moments) || !c.moments.length) return false;
    if (Date.now() - (c.ts || 0) > MOMENTS_MAX_TTL) return false;
    momentsFetchedAt = c.ts || 0;
    momentsHasMore = c.has_more === true;
    momentsVisibleLimit = +(c.limit || 20);
    renderMoments(c.moments);
    return true;
  }

  function loadMoments(force) {
    if (!state.loggedIn) { momentsCache = []; renderMoments([]); return; }
    if (!momentsFetchedAt) restoreMoments();
    // 切课件、切语言页时先复用同一账号的本地时间线；五分钟内没有必要重新拉。
    if (!force && momentsFetchedAt &&
        Date.now() - momentsFetchedAt < MOMENTS_FRESH_TTL) return;
    if (!momentsCache.length) {
      discoverEl.innerHTML = '<div class="al-disc-intro">' + esc(T.mLoading) + '</div>';
    }
    fetch('/alice/moments?lang=' + encodeURIComponent(LANG), {
      credentials: 'same-origin'
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error('bad moments response');
        // 服务降级时不能拿一个空数组覆盖仍可阅读的本地快照。
        if (d.degraded && !(d.moments || []).length && momentsCache.length) return;
        momentsFetchedAt = Date.now();
        momentsHasMore = d.has_more === true;
        momentsVisibleLimit = +(d.limit || 20);
        renderMoments((d && d.moments) || []);
        stashMoments();
      })
      .catch(function () {
        if (momentsCache.length) renderMoments();
        else renderMoments([]);
      });
  }

  // ── 学习笔记（权威在 Alice 服务器 xueai_study_notes，桌面端镜像进 Wiki）──
  // 与朋友圈同一套「本地秒开 + 后台静默刷新」：快照进 localStorage，
  // 5 分钟内不重拉；摘抄/删除走乐观更新，失败回滚重拉。
  var notesCache = [];
  var notesFetchedAt = 0;
  var NOTES_FRESH_TTL = 5 * 60 * 1000;
  var NOTES_MAX_TTL = 24 * 60 * 60 * 1000;

  function stashNotes() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify({
        ts: notesFetchedAt || Date.now(),
        account: state.accountKey,
        notes: notesCache.slice(0, 100)
      }));
    } catch (e) {}
  }

  function restoreNotes() {
    var c = null;
    try { c = JSON.parse(localStorage.getItem(NOTES_KEY) || 'null'); } catch (e) {}
    if (!c || !Array.isArray(c.notes) || !state.accountKey ||
        c.account !== state.accountKey) return false;
    if (Date.now() - (c.ts || 0) > NOTES_MAX_TTL) return false;
    notesFetchedAt = c.ts || 0;
    renderNotes(c.notes);
    return true;
  }

  function renderNotes(list) {
    if (Array.isArray(list)) notesCache = list;
    if (!state.loggedIn) {
      notesEl.innerHTML = '<div class="al-disc-intro">' + esc(T.ntLoginTip) +
        ' <a href="' + loginUrl() + '">' + esc(T.loginBtn) + '</a></div>';
      return;
    }
    if (!notesCache.length) {
      notesEl.innerHTML = '<div class="al-disc-intro">' + esc(T.ntEmpty) + '</div>';
      return;
    }
    var html = notesCache.map(function (n) {
      var isAnswer = n.kind === 'answer';
      return '<div class="al-nt" data-nid="' + esc(String(n.id || '')) + '">' +
        '<div class="al-nt-head">' +
          '<span class="al-nt-kind' + (isAnswer ? ' answer' : '') + '">' +
            esc(isAnswer ? T.ntAnswer : T.ntClip) + '</span>' +
          '<span class="al-nt-date">' +
            esc(n.created_at ? fmtTime(n.created_at) : '') + '</span>' +
          '<button class="al-nt-del" title="' + esc(T.del) + '">' + svg('trash') + '</button>' +
        '</div>' +
        '<div class="al-nt-text' + (isAnswer ? ' md' : '') + '"></div>' +
        (n.page_title
          ? '<div class="al-nt-src">' + svg('doc') + '<span></span></div>' : '') +
      '</div>';
    }).join('');
    notesEl.innerHTML = html + '<div class="al-nt-hint">' + esc(T.ntHint) + '</div>';
    // 两档渲染（PRD 24l）：Alice 的回答是 Markdown，走对话同一套 renderMd
    // （renderMd 先转义再变换，与聊天气泡同等安全）；划词摘抄是用户从页面划的
    // 任意文本，保持 textContent 纯文本，不解析不执行。
    notesEl.querySelectorAll('.al-nt').forEach(function (card, i) {
      var n = notesCache[i];
      if (!n) return;
      var textEl = card.querySelector('.al-nt-text');
      if (n.kind === 'answer') textEl.innerHTML = renderMd(n.content || '');
      else textEl.textContent = n.content || '';
      var src = card.querySelector('.al-nt-src span');
      if (src) src.textContent = n.page_title;
    });
  }

  function loadNotes(force) {
    if (!state.loggedIn) { notesCache = []; renderNotes([]); return; }
    if (!notesFetchedAt) restoreNotes();
    if (!force && notesFetchedAt &&
        Date.now() - notesFetchedAt < NOTES_FRESH_TTL) { renderNotes(); return; }
    if (!notesCache.length) {
      notesEl.innerHTML = '<div class="al-disc-intro">' + esc(T.ntLoading) + '</div>';
    }
    fetch('/alice/notes', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error('bad notes response');
        // 服务降级时不能拿空数组覆盖仍可阅读的本地快照
        if (d.degraded && !(d.notes || []).length && notesCache.length) return;
        notesFetchedAt = Date.now();
        renderNotes(d.notes || []);
        stashNotes();
      })
      .catch(function () { renderNotes(notesCache.length ? undefined : []); });
  }

  // 摘抄 / 存回答共用：写权威库成功后乐观进本地快照，笔记页签立即可见
  function saveNote(kind, content, onDone, onFail) {
    fetch('/alice/notes', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: kind, content: content, file: PAGE_FILE, title: PAGE_TITLE
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error((d && d.error) || 'save failed');
        if (!d.duplicate) {
          notesCache.unshift({
            id: d.id, kind: kind, content: content,
            page_file: PAGE_FILE, page_title: PAGE_TITLE,
            created_at: Math.floor(Date.now() / 1000)
          });
          notesFetchedAt = notesFetchedAt || Date.now();
          stashNotes();
          if (state.tab === 'notes') renderNotes();
        }
        onDone(d.duplicate === true);
      })
      .catch(function () { if (onFail) onFail(); });
  }

  // 删除：确认后乐观移除，服务端失败再重拉纠正
  notesEl.addEventListener('click', function (e) {
    // 回答类笔记里的配图灯箱、代码/表格复制钮与对话区共用一套委托；
    // 点链接走默认跳转——这三种都不该把卡片折叠状态一起切了
    if (richContentClick(e)) return;
    if (e.target.closest && e.target.closest('a')) return;
    var del = e.target.closest('.al-nt-del');
    if (del) {
      var card = del.closest('.al-nt');
      var nid = card.dataset.nid;
      if (!nid || !window.confirm(T.ntDelConfirm)) return;
      notesCache = notesCache.filter(function (n) { return String(n.id) !== nid; });
      stashNotes();
      renderNotes();
      fetch('/alice/notes/' + encodeURIComponent(nid), {
        method: 'DELETE', credentials: 'same-origin'
      }).then(function (r) { return r.json(); })
        .then(function (d) { if (!d || !d.ok) loadNotes(true); })
        .catch(function () { loadNotes(true); });
      return;
    }
    var cardEl = e.target.closest('.al-nt');
    if (cardEl) cardEl.classList.toggle('open');
  });

  // 点图、点赞、评论回复：一处委托，重渲染后不用重新绑事件
  discoverEl.addEventListener('click', function (e) {
    var pic = e.target.closest('.al-mo-img');
    if (pic) {
      var card = pic.closest('.al-mo');
      var m = momentsCache.filter(function (x) { return x.id === card.dataset.mid; })[0];
      if (m) openLightbox(m.images || [], +pic.dataset.i || 0);
      return;
    }
    var lbtn = e.target.closest('.al-mo-lbtn');
    if (lbtn) {
      sendMomentLike(lbtn.closest('.al-mo'), lbtn);
      return;
    }
    var cbtn = e.target.closest('.al-mo-cbtn');
    if (cbtn) {
      momentReply = { mid: cbtn.closest('.al-mo').dataset.mid, cid: '', name: '' };
      renderMoments();
      return;
    }
    var cmt = e.target.closest('.al-mo-cmt');
    if (cmt) {
      var mid = cmt.closest('.al-mo').dataset.mid;
      var m2 = momentsCache.filter(function (x) { return x.id === mid; })[0];
      var target = ((m2 && m2.comments) || []).filter(function (c) {
        return c.id === cmt.dataset.cid;
      })[0];
      momentReply = {
        mid: mid, cid: cmt.dataset.cid,
        name: target ? momentAuthorName(target.author) : ''
      };
      renderMoments();
      return;
    }
    if (e.target.closest('.al-mo-send')) sendMomentComment(e.target.closest('.al-mo'));
  });

  discoverEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.closest('.al-mo-box')) {
      e.preventDefault();
      sendMomentComment(e.target.closest('.al-mo'));
    } else if (e.key === 'Escape' && e.target.closest('.al-mo-box')) {
      momentReply = null;
      renderMoments();
    }
  });

  function sendMomentComment(card) {
    if (!card) return;
    var input = card.querySelector('.al-mo-box input');
    var btn = card.querySelector('.al-mo-send');
    var text = (input.value || '').trim();
    if (!text || btn.disabled) return;
    var mid = card.dataset.mid;
    var replyTo = momentReply && momentReply.mid === mid ? momentReply.cid : '';
    btn.disabled = true;
    fetch('/alice/moments/' + encodeURIComponent(mid) + '/comment', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, reply_to: replyTo })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error(d && d.error);
        momentsCache.forEach(function (m) {
          if (m.id === mid) m.comments = d.comments || m.comments;
        });
        momentsFetchedAt = Date.now();
        stashMoments();
        momentReply = null;
        renderMoments();
      })
      .catch(function (err) {
        btn.disabled = false;
        toast(String(err && err.message) === 'banned' ? T.mBanned : T.mCmtFail);
      });
  }

  function sendMomentLike(card, btn) {
    if (!card || !btn || btn.disabled) return;
    var mid = card.dataset.mid;
    btn.disabled = true;
    fetch('/alice/moments/' + encodeURIComponent(mid) + '/like', {
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error(d && d.error);
        momentsCache.forEach(function (m) {
          if (m.id !== mid) return;
          m.likes = d.likes;
          m.liked_by = d.liked_by || [];
        });
        momentsFetchedAt = Date.now();
        stashMoments();
        renderMoments();
      })
      .catch(function () {
        btn.disabled = false;
        toast(T.netErr);
      });
  }

  // ── 看大图 ────────────────────────────────────────────────────────────
  // ask-alice.js 跑在课件 iframe 里。fixed 只盖 iframe 会把左侧目录、顶栏留在遮罩外，
  // 看起来不是全屏；灯箱必须 Portal 到同源 learn.html 的顶层 document。
  // 遮罩动画照 Alice modal-overlay：独立遮罩节点 + 注册长度变量，从 0px 平滑到
  // 6px，不能一挂载就 blur(6px) 再只动画 opacity（Chromium 不会插值 filter）。
  var lb = null, lbPics = [], lbIdx = 0, lbPrevOverflow = '';

  function lightboxDocument() {
    try {
      if (window.top && window.top.document) return window.top.document;
    } catch (e) {}
    return document;
  }

  function ensureLightboxStyle(doc) {
    if (doc.getElementById('alice-lightbox-style')) return;
    var st = doc.createElement('style');
    st.id = 'alice-lightbox-style';
    st.textContent = [
      '@property --overlay-blur{syntax:"<length>";inherits:false;initial-value:0px}',
      '.al-lb{position:fixed;inset:0;z-index:2147483646;display:none;overflow:hidden;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}',
      '.al-lb-overlay{position:absolute;inset:0;--overlay-blur:0px;opacity:0;background-color:rgba(0,0,0,.45);backdrop-filter:blur(var(--overlay-blur));-webkit-backdrop-filter:blur(var(--overlay-blur));transition:opacity .2s ease-out,--overlay-blur .2s ease-out}',
      '.al-lb.on .al-lb-overlay{opacity:1;--overlay-blur:6px}',
      // 图片舞台占满真实浏览器视口；16px 只是避免像素贴边，不再套 600px / 78vh 小卡片。
      '.al-lb-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}',
      '.al-lb-stage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;border-radius:12px;box-shadow:0 24px 64px rgba(0,0,0,.4);object-fit:contain;user-select:none;opacity:0;transform:scale(.985);transition:opacity .2s ease-out,transform .2s ease-out}',
      '.al-lb.on .al-lb-stage img{opacity:1;transform:scale(1)}',
      '.al-lb-btn{position:absolute;z-index:2;background:rgba(0,0,0,.42);color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
      '.al-lb-btn:hover{background:rgba(0,0,0,.62)}',
      '.al-lb-btn svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}',
      '.al-lb-x{top:14px;right:14px}.al-lb-x svg{width:18px;height:18px}',
      '.al-lb-prev{left:12px;top:50%;transform:translateY(-50%)}',
      '.al-lb-next{right:12px;top:50%;transform:translateY(-50%)}',
      '.al-lb-n{position:absolute;z-index:2;left:50%;transform:translateX(-50%);bottom:16px;color:rgba(255,255,255,.85);font-size:12px;letter-spacing:.04em}',
      '@media(max-width:600px){.al-lb-stage{padding:8px}.al-lb-stage img{border-radius:8px}.al-lb-prev{left:6px}.al-lb-next{right:6px}}'
    ].join('\n');
    (doc.head || doc.documentElement).appendChild(st);
  }

  function openLightbox(pics, idx) {
    if (!pics.length) return;
    lbPics = pics;
    lbIdx = Math.max(0, Math.min(idx, pics.length - 1));
    var doc = lightboxDocument();
    ensureLightboxStyle(doc);
    if (lb && lb.ownerDocument !== doc) { lb.remove(); lb = null; }
    if (!lb) {
      lb = doc.createElement('div');
      lb.className = 'al-lb';
      lb.innerHTML = '<div class="al-lb-overlay"></div>' +
        '<div class="al-lb-stage"><img alt=""></div>' +
        '<button type="button" class="al-lb-btn al-lb-x">' + svg('close') + '</button>' +
        '<button type="button" class="al-lb-btn al-lb-prev">' + svg('chevronLeft') + '</button>' +
        '<button type="button" class="al-lb-btn al-lb-next">' + svg('chevronRight') + '</button>' +
        '<div class="al-lb-n"></div>';
      lb.addEventListener('click', function (e) {
        if (e.target.closest('.al-lb-prev')) stepLightbox(-1);
        else if (e.target.closest('.al-lb-next')) stepLightbox(1);
        else if (e.target.closest('.al-lb-x') ||
                 e.target.classList.contains('al-lb-overlay') ||
                 e.target.classList.contains('al-lb-stage')) closeLightbox();
      });
      doc.body.appendChild(lb);
    }
    lb.style.display = 'block';
    lbPrevOverflow = doc.documentElement.style.overflow;
    doc.documentElement.style.overflow = 'hidden';
    paintLightbox();
    (doc.defaultView || window).requestAnimationFrame(function () { lb.classList.add('on'); });
    doc.addEventListener('keydown', lbKey, true);
    // 打开动作发生在 iframe，键盘焦点通常仍留在 iframe 内；顶层 document 收不到
    // 这类 Esc/方向键，所以两层都监听（同一 document 时不要重复注册）。
    if (doc !== document) document.addEventListener('keydown', lbKey, true);
  }

  function paintLightbox() {
    var many = lbPics.length > 1;
    lb.querySelector('img').src = lbPics[lbIdx];
    lb.querySelector('.al-lb-prev').style.display = many ? 'flex' : 'none';
    lb.querySelector('.al-lb-next').style.display = many ? 'flex' : 'none';
    lb.querySelector('.al-lb-n').textContent =
      many ? (lbIdx + 1) + ' / ' + lbPics.length : '';
  }

  function stepLightbox(d) {
    lbIdx = (lbIdx + d + lbPics.length) % lbPics.length;
    paintLightbox();
  }

  function closeLightbox() {
    if (!lb) return;
    var doc = lb.ownerDocument;
    lb.classList.remove('on');
    doc.removeEventListener('keydown', lbKey, true);
    if (doc !== document) document.removeEventListener('keydown', lbKey, true);
    doc.documentElement.style.overflow = lbPrevOverflow;
    setTimeout(function () {
      if (lb && !lb.classList.contains('on')) lb.style.display = 'none';
    }, 200);
  }

  function lbKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); closeLightbox(); }
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
  }

  // ── 悬浮窗 ⇄ 侧边栏 ──────────────────────────────────────────────────
  // 侧边栏不是「更大的悬浮窗」：它把正文推开（html.alice-side → body padding），
  // 这样长回答摊得开、课件也照样能看能划词。窄屏本来就全屏，切换无意义。
  var sideBtn = win.querySelector('#al-btn-side');
  var sideRz = win.querySelector('#al-side-rz');

  // 悬浮窗尺寸独立于侧边栏宽度：左边缘、上边缘、左上角分别控制 w / h / w+h。
  // 用 CSS 变量而不是 inline width，切到 side 时不会压过侧边栏的满高样式。
  var floatW = FLOAT_W_DEF;
  var floatH = FLOAT_H_DEF;
  function clampFloatW(w) {
    return Math.max(FLOAT_W_MIN, Math.min(Math.round(w), window.innerWidth - 24));
  }
  function clampFloatH(h) {
    return Math.max(FLOAT_H_MIN, Math.min(Math.round(h), window.innerHeight - 40));
  }
  function paintFloatSize() {
    var st = document.documentElement.style;
    st.setProperty('--al-float-w', clampFloatW(floatW) + 'px');
    st.setProperty('--al-float-h', clampFloatH(floatH) + 'px');
  }
  function saveFloatSize() {
    try {
      localStorage.setItem(FLOAT_W_KEY, String(clampFloatW(floatW)));
      localStorage.setItem(FLOAT_H_KEY, String(clampFloatH(floatH)));
    } catch (e) {}
  }
  function resetFloatSize(axis) {
    if (axis === 'w' || axis === 'nw') floatW = FLOAT_W_DEF;
    if (axis === 'h' || axis === 'nw') floatH = FLOAT_H_DEF;
    paintFloatSize();
    saveFloatSize();
  }
  try {
    floatW = parseInt(localStorage.getItem(FLOAT_W_KEY), 10) || FLOAT_W_DEF;
    floatH = parseInt(localStorage.getItem(FLOAT_H_KEY), 10) || FLOAT_H_DEF;
  } catch (e) {}
  paintFloatSize();

  win.querySelectorAll('.al-float-rz').forEach(function (handle) {
    var axis = handle.getAttribute('data-rz');
    handle.addEventListener('pointerdown', function (e) {
      if (state.side || window.innerWidth <= 640 || e.button !== 0) return;
      var rect = win.getBoundingClientRect();
      var sx = e.clientX, sy = e.clientY;
      var sw = rect.width, sh = rect.height;
      var root = document.documentElement;
      root.classList.add('al-float-resizing', 'al-float-rz-' + axis);
      closeSessionsMenu();
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      function move(ev) {
        if (axis === 'w' || axis === 'nw') {
          floatW = clampFloatW(sw + sx - ev.clientX);
        }
        if (axis === 'h' || axis === 'nw') {
          floatH = clampFloatH(sh + sy - ev.clientY);
        }
        paintFloatSize();
        ev.preventDefault();
      }
      function done() {
        root.classList.remove('al-float-resizing', 'al-float-rz-' + axis);
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', done);
        handle.removeEventListener('pointercancel', done);
        saveFloatSize();
      }
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', done);
      handle.addEventListener('pointercancel', done);
      e.preventDefault();
    });
    handle.addEventListener('dblclick', function (e) {
      if (!state.side && window.innerWidth > 640) resetFloatSize(axis);
      e.preventDefault();
    });
  });
  window.addEventListener('resize', paintFloatSize);

  // 侧栏宽度：必须给正文留可读宽度（约 480px），否则三栏同屏正文会被挤没
  function sideMaxW() {
    return Math.max(SIDE_W_MIN, Math.min(SIDE_W_MAX, window.innerWidth - 480));
  }
  function clampSideW(w) {
    return Math.min(sideMaxW(), Math.max(SIDE_W_MIN, Math.round(w)));
  }

  var sideW = SIDE_W_DEF;      // 当前侧栏宽度（px），供告知外壳用
  var sideDragging = false;

  // 阅读器（learn.html）里课件跑在 iframe 中，Alice 的 fixed 只能覆盖 iframe 那一段。
  // 要让她真的顶天立地，外壳会把 iframe 撑满整个内容区、把面包屑条与翻页条浮到
  // 课件上方只占她左边（见 learn*.html 的 alice-side-on）。这里把当前占宽报过去。
  function notifyHost() {
    if (window.self === window.top) return;
    var on = state.enabled && state.open && state.side && window.innerWidth > 640;
    try {
      parent.postMessage({
        type: 'xueai-alice-side',
        w: on ? sideW : 0,
        live: sideDragging      // 拖拽中让外壳关掉过渡，否则跟手会发飘
      }, location.origin);
    } catch (e) {}
  }

  // 外壳的回信：那两条横条各有多高。Alice 撑满之后它们浮在课件上，
  // 正文照这个数让出上下内边距，开头结尾才不会被压掉一截。
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var d = e.data;
    if (!d || d.type !== 'xueai-reader-inset') return;
    var st = document.documentElement.style;
    st.setProperty('--al-inset-top', (parseInt(d.top, 10) || 0) + 'px');
    st.setProperty('--al-inset-bottom', (parseInt(d.bottom, 10) || 0) + 'px');
  });

  function applySideW(w) {
    sideW = clampSideW(w);
    document.documentElement.style.setProperty('--al-side-w', sideW + 'px');
    notifyHost();
  }
  function loadSideW() {
    var w = SIDE_W_DEF;
    try {
      var saved = parseInt(localStorage.getItem(SIDE_W_KEY), 10);
      if (saved) w = saved;
    } catch (e) {}
    applySideW(w);
  }
  loadSideW();

  function applySide() {
    win.classList.toggle('side', state.side);
    document.documentElement.classList.toggle('alice-side', state.side && state.open);
    sideBtn.innerHTML = svg(state.side ? 'panelFloat' : 'panelSide');
    sideBtn.title = state.side ? T.dockFloat : T.expandSide;
    notifyHost();
  }

  sideBtn.addEventListener('click', function () {
    state.side = !state.side;
    try {
      if (state.side) localStorage.setItem(SIDE_KEY, '1');
      else localStorage.removeItem(SIDE_KEY);
    } catch (e) {}
    applySide();
    closeSessionsMenu();
  });

  // 拖拽调宽（手感对齐课件目录 sidebar-resizer；拖的是左缘，方向与左栏相反）
  (function bindSideResize() {
    if (!sideRz) return;
    var startX = 0, startW = 0, curW = 0;
    function pointX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
    function onMove(e) {
      // 左边热区：鼠标往左 → 栏变宽
      curW = clampSideW(startW + (startX - pointX(e)));
      applySideW(curW);
      if (e.cancelable) e.preventDefault();
    }
    function onUp() {
      sideDragging = false;
      document.documentElement.classList.remove('al-side-resizing');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      try { if (curW) localStorage.setItem(SIDE_W_KEY, String(curW)); } catch (e) {}
      notifyHost();
    }
    function onDown(e) {
      if (!state.side || !state.open) return;
      sideDragging = true;
      startX = pointX(e);
      startW = win.getBoundingClientRect().width;
      curW = startW;
      document.documentElement.classList.add('al-side-resizing');
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      e.preventDefault();
    }
    sideRz.addEventListener('mousedown', onDown);
    sideRz.addEventListener('touchstart', onDown, { passive: false });
    sideRz.addEventListener('dblclick', function () {
      applySideW(SIDE_W_DEF);
      try { localStorage.setItem(SIDE_W_KEY, String(SIDE_W_DEF)); } catch (e) {}
    });
    window.addEventListener('resize', function () {
      if (!state.side) return;
      applySideW(sideW);   // 窗口变窄时按新上限收一收，并同步告知外壳
    });
  })();

  // restore=true：切页后按上一页的状态原样恢复（无动画），不是用户主动打开
  function openWin(restore) {
    if (!state.enabled) return;
    // 手动点头像、划词「问问 Alice」和跨页恢复都算今天已经使用过面板。
    consumeFabNudgeToday();
    if (!state.open) {
      state.open = true;
      win.classList.toggle('restored', !!restore);
      win.classList.add('open');
      fab.classList.add('hidden');
      applySide();
      try { localStorage.setItem(OPEN_KEY, '1'); } catch (e) {}
      if (!state.messages.length) renderMessages();
      autoGrow();   // 关窗期间存的草稿（吐槽/预填提问）现在才量得到高度
    }
  }
  function closeWin() {
    // 面板若跨过午夜仍开着，第二天关掉时也不能突然补弹引导气泡。
    consumeFabNudgeToday();
    state.open = false;
    win.classList.remove('open', 'restored');
    // 未授权时 fab 也保持隐藏；授权时才露出来
    if (state.enabled) fab.classList.remove('hidden');
    else fab.classList.add('hidden');
    document.documentElement.classList.remove('alice-side');   // 关窗即还正文宽度
    try { localStorage.removeItem(OPEN_KEY); } catch (e) {}
    closeSessionsMenu();
    notifyHost();
  }
  win.querySelector('#al-btn-close').addEventListener('click', closeWin);

  // 灰度闸门：enabled=false 时整套 UI 消失（含已打开的窗与划词浮层）
  function applyEnabled(on) {
    var was = state.enabled;
    state.enabled = !!on;
    try {
      if (state.enabled) localStorage.setItem(EN_KEY, '1');
      else localStorage.removeItem(EN_KEY);
    } catch (e) {}
    if (!state.enabled) {
      hidePop();
      hideFabNudge();
      if (state.open) {
        state.open = false;
        win.classList.remove('open', 'restored');
        document.documentElement.classList.remove('alice-side');
        try { localStorage.removeItem(OPEN_KEY); } catch (e) {}
      }
      fab.classList.add('hidden');
      notifyHost();
      return;
    }
    // 刚从「不可见」变成「可见」：若上一页留着开窗标记，同步恢复
    if (!was && !state.open) {
      var reopen = false;
      try { reopen = localStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}
      if (reopen) { openWin(true); return; }
    }
    if (!state.open) {
      fab.classList.remove('hidden');
      maybeShowFabNudge();
    }
  }

  // ── 吐槽（对话式，2026-08-08 裁决）───────────────────────────────────
  // 独立表单面板下线，吐槽由 Alice 在对话里引导完成：引导语、配图、致谢都是
  // 本地即时消息——不调 LLM、不入 Alice 服务器会话、不耗米粒，收集完转交
  // /api/feedback（admin-service 吐槽队列）。必须登录：身份由服务端从 Cookie
  // 解出挂在记录上，作者能回访跟进，被采纳能把贡献记到提交者名下。
  var attachBtn = win.querySelector('#al-attach');
  var fileEl = win.querySelector('#al-file');

  // 服务端按文件名后缀白名单校验，而粘贴 blob 的文件名不可靠（Safari 常为
  // 空串），一律按 MIME 现造合法文件名；落盘时服务端会重命名成随机串。
  var MIME_EXT = {
    'image/png': '.png', 'image/jpeg': '.jpg', 'image/jpg': '.jpg',
    'image/gif': '.gif', 'image/webp': '.webp'
  };
  var FB_MAX_IMAGES = 5;

  // 本地即时消息：只进 state.messages 供本页渲染，刷新/重拉会话后消失
  function pushLocalMsg(role, content, extra) {
    var m = { role: role, content: content, ts: Math.floor(Date.now() / 1000), local: true };
    if (extra) for (var k in extra) m[k] = extra[k];
    var hadEmpty = !state.messages.length;
    state.messages.push(m);
    if (hadEmpty) { renderMessages(); return; }
    var prev = state.messages[state.messages.length - 2];
    bodyEl.appendChild(messageNodes(m, prev && prev.role, prev && prev.ts));
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // ── 气泡浮层（历史列表 / 模式菜单）─────────────────────────────────────
  // 两处共用一套规矩，少一条都会退化成「一块赖在界面上的白卡片」：
  //   1. 尖角对准触发它的那枚钮——看得出是谁弹出来的；
  //   2. 宽度按内容收、夹在面板内，不通栏；
  //   3. 点别处、按 Esc、面板失焦都收起（Esc 只收最上面那层，不连面板一起关）。
  var floaters = [];   // {isOpen, close, btn, el}

  // offsetParent 链一路加到 win：不假设中间没有别的定位祖先，加个 position
  // 就把尖角挪歪这种事查起来很费劲
  function offsetIn(el) {
    var x = 0, y = 0;
    for (var n = el; n && n !== win; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x: x, y: y };
  }

  // above=true 时贴在钮上方（模式菜单在输入卡里，只能往上开）
  // 用 offset* 而不是 getBoundingClientRect：入场动画带 scale，量的是变形后的值
  function anchorPopover(el, btn, maxW, above) {
    var pw = win.clientWidth, ph = win.clientHeight;
    var b = offsetIn(btn);
    var cx = b.x + btn.offsetWidth / 2;
    var w = Math.min(maxW, pw - 24);
    var left = Math.min(Math.max(12, cx - w / 2), Math.max(12, pw - 12 - w));
    el.style.width = w + 'px';
    el.style.left = left + 'px';
    if (above) {
      el.style.top = 'auto';
      el.style.bottom = (ph - b.y + 8) + 'px';
    } else {
      el.style.bottom = 'auto';
      el.style.top = (b.y + btn.offsetHeight + 8) + 'px';
    }
    // 尖角是绝对定位的伪元素，起点是气泡的内边距框，得扣掉左边框那 1px
    el.style.setProperty('--al-caret', (cx - left - el.clientLeft) + 'px');
  }

  document.addEventListener('pointerdown', function (e) {
    floaters.forEach(function (f) {
      if (!f.isOpen()) return;
      if (f.el() && f.el().contains(e.target)) return;
      if (f.btn.contains(e.target)) return;   // 交给钮自己的 toggle，别关了又开
      f.close();
    });
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var hit = floaters.filter(function (f) { return f.isOpen(); });
    if (!hit.length) return;
    e.stopPropagation();   // 面板的 Esc-关窗在后面，这一下不该传到它那儿
    hit.forEach(function (f) { f.close(); });
  }, true);
  // 课件跑在 learn.html 的 iframe 里：点外壳（顶栏、翻页条）不冒泡进来，
  // 只能靠 iframe 自己的 blur 收尾
  window.addEventListener('blur', function () {
    floaters.forEach(function (f) { if (f.isOpen()) f.close(); });
  });
  window.addEventListener('resize', function () {
    floaters.forEach(function (f) { if (f.isOpen()) f.close(); });
  });

  // 模式在输入卡工具栏体现（对照 Alice 客户端的「探讨」模型选择器位）：
  // 问答=默认灰字，吐槽=深色胶囊。切模式即 enter/exitFeedbackMode。
  var modeBtn = win.querySelector('#al-mode');
  var modeLabel = win.querySelector('#al-mode-label');

  function updateComposerMode() {
    inputEl.placeholder = state.feedbackMode ? T.fbPlaceholder : T.placeholder;
    modeLabel.textContent = state.feedbackMode ? T.modeFb : T.modeChat;
    modeBtn.classList.toggle('fb', state.feedbackMode);
  }

  var modeMenu = null;
  function closeModeMenu() {
    if (modeMenu) { modeMenu.remove(); modeMenu = null; }
  }
  floaters.push({
    btn: modeBtn,
    el: function () { return modeMenu; },
    isOpen: function () { return !!modeMenu; },
    close: closeModeMenu
  });
  modeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (modeMenu) { closeModeMenu(); return; }
    modeMenu = document.createElement('div');
    modeMenu.className = 'al-mode-menu';
    modeMenu.innerHTML =
      '<button type="button" class="al-mode-item' + (state.feedbackMode ? '' : ' cur') + '" data-mode="chat">' + esc(T.modeChat) + '</button>' +
      '<button type="button" class="al-mode-item' + (state.feedbackMode ? ' cur' : '') + '" data-mode="fb">' + esc(T.modeFb) + '</button>';
    win.appendChild(modeMenu);
    anchorPopover(modeMenu, modeBtn, 160, true);
    modeMenu.querySelectorAll('.al-mode-item').forEach(function (b) {
      b.addEventListener('click', function () {
        closeModeMenu();
        var fb = b.getAttribute('data-mode') === 'fb';
        if (fb && !state.feedbackMode) enterFeedbackMode('');
        else if (!fb && state.feedbackMode) exitFeedbackMode();
        inputEl.focus();
      });
    });
  });

  // silent=true：恢复草稿时不强行弹窗、不抢焦点（上次没开着窗就保持关着）
  function enterFeedbackMode(quote, silent) {
    if (!silent) openWin();
    if (!silent) showTab('chat');
    if (quote) state.pendingQuote = quote.slice(0, 2000);
    if (!state.feedbackMode) {
      state.feedbackMode = true;
      state.fbImages = [];
      pushLocalMsg('assistant', T.fbGuide);
    }
    renderChip();
    updateComposerMode();
    // 未登录不等到发送时才拦：进来就说清「你在给我发消息，所以要登录」，
    // 且草稿会一直暂存，登录跳转回来自动恢复，用户不会因为登录丢内容。
    if (!state.loggedIn) renderFbLoginNote();
    stashFbDraft();
    if (!silent) inputEl.focus();
  }

  function exitFeedbackMode() {
    state.feedbackMode = false;
    state.fbImages = [];
    state.fbUploading = false;
    clearFbDraft();
    renderChip();
    updateComposerMode();
    renderNote();   // 把吐槽登录提示换回普通提示（或清掉）
  }

  // ── 吐槽草稿：跨登录跳转/翻页存续 ───────────────────────────────────
  // 登录要跳去米羊 OAuth 再跳回来，页面会整个重载；不存草稿的话，引导登录
  // 就等于让用户把刚写的槽点重打一遍——没人会照做。
  var FBDRAFT_KEY = 'xueai_alice_fbdraft';
  function stashFbDraft() {
    if (!state.feedbackMode) return;
    try {
      localStorage.setItem(FBDRAFT_KEY, JSON.stringify({
        quote: state.pendingQuote || '',
        text: inputEl.value || '',
        images: state.fbImages.slice(),
        ts: Date.now()
      }));
    } catch (e) {}
  }
  function clearFbDraft() {
    try { localStorage.removeItem(FBDRAFT_KEY); } catch (e) {}
  }
  function restoreFbDraft() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(FBDRAFT_KEY) || 'null'); } catch (e) {}
    if (!d || Date.now() - (d.ts || 0) > 15 * 60 * 1000) {
      if (d) clearFbDraft();
      return;
    }
    enterFeedbackMode(d.quote || '', !state.open);
    state.fbImages = (d.images || []).slice(0, FB_MAX_IMAGES);
    if (d.text) { inputEl.value = d.text; autoGrow(); }
    renderChip();
  }

  win.querySelector('#al-btn-fb').addEventListener('click', function () {
    enterFeedbackMode('');
  });

  function renderFbLoginNote() {
    noteEl.innerHTML = esc(T.fbLoginTip) +
      ' <a href="' + loginUrl() + '">' + esc(T.loginBtn) + '</a>';
    noteEl.dataset.show = '1';
    if (state.tab === 'chat') noteEl.style.display = '';
  }

  // 配图：文件选择与粘贴共用；逐张串行上传（并发对限流不友好，失败也难定位）
  function addFbFiles(list) {
    if (!state.feedbackMode || state.fbUploading) return;
    if (!state.loggedIn) { renderFbLoginNote(); return; }
    var files = Array.prototype.slice.call(list || [])
      .filter(function (f) { return f && MIME_EXT[f.type]; });
    if (!files.length) return;
    var room = FB_MAX_IMAGES - state.fbImages.length;
    if (files.length > room) {
      pushLocalMsg('assistant', T.fbTooMany);
      files = files.slice(0, room);
    }
    if (!files.length) return;
    state.fbUploading = true;
    renderChip();
    files.reduce(function (chain, f) {
      return chain.then(function () {
        var fd = new FormData();
        fd.append('file', f, 'fb-' + Date.now() + (MIME_EXT[f.type] || '.png'));
        return fetch('/api/feedback/image', {
          method: 'POST', body: fd, credentials: 'same-origin'
        }).then(function (r) {
          if (r.status === 401) { state.loggedIn = false; throw { code: 'login' }; }
          return r.json();
        }).then(function (d) {
          if (d && d.ok && d.url) state.fbImages.push(d.url);
          else pushLocalMsg('assistant', T.fbImgErr);
        });
      });
    }, Promise.resolve()).catch(function (err) {
      if (err && err.code === 'login') renderFbLoginNote();
      else pushLocalMsg('assistant', T.fbImgErr);
    }).then(function () {
      state.fbUploading = false;
      renderChip();
      stashFbDraft();
    });
  }

  // + 常驻（对照客户端输入卡）：配图只用于吐槽，问答态点 + 先切到吐槽模式
  attachBtn.addEventListener('click', function () {
    if (!state.feedbackMode) enterFeedbackMode('');
    fileEl.click();
  });
  fileEl.addEventListener('change', function () {
    var files = fileEl.files;
    fileEl.value = '';   // 允许连选同一张图
    addFbFiles(files);
  });
  // 粘贴监听挂整个悬浮窗：吐槽时焦点未必在输入框（刚点过消息区/缩略图），
  // 挂在输入区容器上会漏掉这些粘贴。只认图片文件；粘文本不拦。
  win.addEventListener('paste', function (e) {
    if (!state.feedbackMode) return;
    var items = (e.clipboardData || {}).items;
    if (!items) return;
    var files = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && /^image\//.test(items[i].type)) {
        var f = items[i].getAsFile();
        if (f) files.push(f);
      }
    }
    if (!files.length) return;
    e.preventDefault();
    addFbFiles(files);
  });

  // GitHub / X 主页：从正文里认出来就抽成 social_url 并记住，下次提交默认带上
  var SOCIAL_KEY = 'xueai_fb_social';
  function extractSocial(text) {
    var m = /https?:\/\/(?:www\.)?(?:github\.com|x\.com|twitter\.com)\/[^\s)】」]+/.exec(text);
    if (m) {
      try { localStorage.setItem(SOCIAL_KEY, m[0]); } catch (e) {}
      return m[0];
    }
    try { return localStorage.getItem(SOCIAL_KEY) || ''; } catch (e) { return ''; }
  }

  function sendFeedback(text) {
    if (!state.loggedIn) { renderFbLoginNote(); return; }
    var quote = state.pendingQuote;
    var images = state.fbImages.slice();
    state.pendingQuote = '';
    state.fbImages = [];
    inputEl.value = '';
    autoGrow();
    renderChip();

    pushLocalMsg('user',
      quote ? '【划选内容】\n' + quote + '\n\n【我的问题】\n' + text : text,
      { images: images });

    var thinkingEl = appendThinking();
    state.streaming = true;
    sendBtn.disabled = true;

    function rollback() {
      state.messages.pop();
      state.pendingQuote = quote;
      state.fbImages = images;
      inputEl.value = text;
      autoGrow();
      renderChip();
      renderMessages();
      stashFbDraft();
    }
    function unlock() {
      thinkingEl.remove();
      state.streaming = false;
      sendBtn.disabled = false;
    }

    fetch('/api/feedback', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: quote ? '【划词吐槽】\n' + quote + '\n\n' + text : text,
        images: images,
        social_url: extractSocial(text),
        page_path: location.pathname,
        page_title: PAGE_TITLE,
        lang: LANG,
        website: ''
      })
    }).then(function (r) {
      if (r.status === 401) throw { code: 'login' };
      return r.json();
    }).then(function (d) {
      unlock();
      if (d && d.ok) {
        pushLocalMsg('assistant', T.fbThanks);
        exitFeedbackMode();
      } else {
        rollback();
        pushLocalMsg('assistant', (d && d.error) || T.fbSendErr);
      }
    }).catch(function (err) {
      unlock();
      rollback();
      if (err && err.code === 'login') {
        state.loggedIn = false;
        renderFbLoginNote();
      } else {
        pushLocalMsg('assistant', T.fbSendErr);
      }
    });
  }

  // Tabs
  function syncDownloadCta() {
    var eligible = !state.loggedIn || state.hasAliceClient === false;
    // 朋友圈里已有一张解释具体好处的卡片时，tabs 右侧不再放重复下载按钮。
    var explainedInFeed = state.tab === 'discover' &&
      downloadCardVisible && state.loggedIn && state.hasAliceClient === false;
    win.querySelector('#al-btn-dl').style.display =
      (eligible && !explainedInFeed) ? '' : 'none';
  }

  function showTab(name) {
    var btn = win.querySelector('.al-tab[data-tab="' + name + '"]');
    if (!btn) return;
    if (name === 'discover') {
      var today = new Date().toISOString().slice(0, 10);
      var cardStamp = (state.accountKey || 'legacy') + ':' + today;
      try {
        downloadCardVisible = state.loggedIn && state.hasAliceClient === false &&
          localStorage.getItem(DL_CARD_DAY_KEY) !== cardStamp;
        if (downloadCardVisible) localStorage.setItem(DL_CARD_DAY_KEY, cardStamp);
      } catch (e) {
        downloadCardVisible = state.loggedIn && state.hasAliceClient === false;
      }
    } else {
      downloadCardVisible = false;
    }
    state.tab = name;
    syncDownloadCta();
    win.querySelectorAll('.al-tab').forEach(function (b) {
      b.classList.toggle('active', b === btn);
    });
    var chat = name === 'chat';
    bodyEl.style.display = chat ? '' : 'none';
    composerEl.style.display = chat ? '' : 'none';
    noteEl.style.display = (chat && noteEl.dataset.show === '1') ? '' : 'none';
    notesEl.style.display = name === 'notes' ? '' : 'none';
    discoverEl.style.display = name === 'discover' ? '' : 'none';
    if (chat) {
      autoGrow();   // 隐藏期间量不到高度，露出来补一次
      syncRicePrompt();
    }
    else if (name === 'notes') loadNotes();
    else {
      renderMoments();
      loadMoments();
    }
    closeSessionsMenu();
  }
  win.querySelectorAll('.al-tab').forEach(function (btn) {
    btn.addEventListener('click', function () { showTab(btn.getAttribute('data-tab')); });
  });

  // ── 登录态 / 额度 ─────────────────────────────────────────────────────
  function loginUrl() {
    return '/auth/login?next=' + encodeURIComponent(location.pathname + location.search);
  }

  function rememberedLowRice() {
    try { return localStorage.getItem(LOW_RICE_KEY) === '1'; } catch (e) { return false; }
  }

  function rememberLowRice(low) {
    try {
      if (low) localStorage.setItem(LOW_RICE_KEY, '1');
      else localStorage.removeItem(LOW_RICE_KEY);
    } catch (e) {}
  }

  function refreshMe(forceRice) {
    return fetch('/alice/me' + (forceRice ? '?fresh_rice=1' : ''),
      { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        state.meOk = true;      // 服务端答复过了，loggedIn 才是权威结论
        state.loggedIn = !!d.logged_in;
        state.hasAliceClient = d.has_alice_client === true ? true
          : (d.has_alice_client === false ? false : null);
        var nextAccountKey = d.account_key || '';
        if (state.accountKey && nextAccountKey !== state.accountKey) {
          // 同浏览器切换账号后，内存中的前一账号笔记也必须立刻丢弃。
          notesCache = [];
          notesFetchedAt = 0;
        }
        state.accountKey = nextAccountKey;
        state.nickname = d.nickname || '';
        state.rice = (typeof d.rice === 'number') ? d.rice : null;
        if (state.rice !== null) {
          rememberLowRice(state.rice <= LOW_RICE_THRESHOLD);
        }
        // enabled 缺省兼容旧后端：登录即开；新后端按白名单精确控制
        var en = (typeof d.enabled === 'boolean') ? d.enabled
          : (d.logged_in ? true : false);
        applyEnabled(en);
        win.querySelector('#al-btn-hist').style.display =
          (state.loggedIn && state.enabled) ? '' : 'none';
        // 匿名或服务端确认从未登录客户端才展示；状态未知也先隐藏，杜绝老用户
        // 每次刷新先看到绿色下载广告、随后又消失的闪烁。
        syncDownloadCta();
        if (state.tab === 'discover') renderMoments();
        if (state.loggedIn) {
          var sub = esc(T.subtitle);
          if (state.nickname) sub += ' · ' + esc(T.loggedInAs(state.nickname));
          if (state.rice !== null) {
            sub += ' · <a class="al-rice-link" href="' + RECHARGE_URL +
              '" target="_blank" rel="noopener" title="' + esc(T.rechargeBtn) + '">' +
              esc(T.riceLabel(state.rice)) + '</a>';
          }
          win.querySelector('#al-sub').innerHTML = sub;
        }
        renderNote();
        syncRicePrompt();
      })
      .catch(function () { state.meOk = false; });
  }

  function renderNote() {
    var html = '';
    if (!state.loggedIn) {
      html = esc(T.loginTip) + ' <a href="' + loginUrl() + '">' + esc(T.loginBtn) + '</a>';
    }
    noteEl.innerHTML = html;
    noteEl.dataset.show = html ? '1' : '0';
    noteEl.style.display = (html && state.tab === 'chat') ? '' : 'none';
  }

  function syncRicePrompt() {
    var old = bodyEl.querySelector('.al-rice-msg');
    if (old) old.remove();
    if (!state.loggedIn || state.rice === null ||
        state.rice > LOW_RICE_THRESHOLD || state.tab !== 'chat') return;
    var row = document.createElement('div');
    row.className = 'al-msg-alice al-rice-msg';
    row.innerHTML = avatarHtml('al-mini') +
      '<div class="al-mtext"><span>' + esc(T.noRice) + '</span>' +
      '<a class="al-recharge-cta" href="' + RECHARGE_URL +
      '" target="_blank" rel="noopener">' + esc(T.rechargeBtn) + '</a></div>';
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function markLowRice() {
    state.rice = 0;
    rememberLowRice(true);
    syncRicePrompt();
  }

  // ── 推荐问题（本页）──────────────────────────────────────────────────
  var questionsPromise = null;

  function finishQuestions(qs) {
    qs = Array.isArray(qs) ? qs.filter(function (q) {
      return typeof q === 'string' && q && q !== T.qImage;
    }) : [];
    // 固定保留三条页面理解题，第四条交给讲解配图；所有语言都要有。
    state.pageQuestions = qs.slice(0, 3).concat([T.qImage]);
    return state.pageQuestions;
  }

  function loadQuestions() {
    if (state.pageQuestions !== null) return Promise.resolve(state.pageQuestions);
    // openWin + 初始化可能在同一帧各 render 一次。复用进行中的请求，否则两个
    // Promise 都往当前 #al-qs 追加，换一页就会从 3 条膨胀成 6 条。
    if (questionsPromise) return questionsPromise;
    questionsPromise = fetch('/alice/questions?file=' + encodeURIComponent(PAGE_FILE),
      { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var qs = (d && d.questions && d.questions.length)
          ? d.questions
          : (PAGE_TITLE ? T.qFallback(PAGE_TITLE.slice(0, 30)) : []);
        return finishQuestions(qs);
      })
      .catch(function () {
        return finishQuestions(PAGE_TITLE ? T.qFallback(PAGE_TITLE.slice(0, 30)) : []);
      });
    return questionsPromise;
  }

  // ── 消息渲染 ─────────────────────────────────────────────────────────
  // Alice 回答下方的「存入笔记」行。历史渲染（messageNodes）和流式收尾
  // 共用：流式气泡不走 messageNodes，收尾时单独补一行，否则刚生成的回答
  // 要等重进会话才能存。
  function noteSaveAction(content) {
    var act = document.createElement('div');
    act.className = 'al-msg-act';
    var btn = document.createElement('button');
    btn.className = 'al-nt-save';
    btn.type = 'button';
    btn.innerHTML = svg('bookmark') + '<span>' + esc(T.saveAnswer) + '</span>';
    btn.addEventListener('click', function () {
      if (btn.classList.contains('done') || btn.disabled) return;
      btn.disabled = true;
      saveNote('answer', content, function (dup) {
        btn.classList.add('done');
        btn.disabled = false;
        btn.querySelector('span').textContent = dup ? T.clipDup : T.clipSaved;
      }, function () {
        btn.disabled = false;
        btn.querySelector('span').textContent = T.clipFail;
        setTimeout(function () {
          btn.querySelector('span').textContent = T.saveAnswer;
        }, 1500);
      });
    });
    act.appendChild(btn);
    return act;
  }

  function messageNodes(m, prevRole, prevTs) {
    var frag = document.createDocumentFragment();
    // 客户端每组消息顶部都有居中时间线：首条（prevTs 空）或间隔 ≥5 分钟时出
    if (m.ts && (!prevTs || m.ts - prevTs >= 300)) {
      var tEl = document.createElement('div');
      tEl.className = 'al-time';
      tEl.textContent = fmtTime(m.ts);
      frag.appendChild(tEl);
      prevRole = null; // 分隔线之后重新出头像
    }
    if (m.role === 'user') {
      var q = /^【划选内容】\n([\s\S]*?)\n\n【我的问题】\n([\s\S]*)$/.exec(m.content);
      if (q) {
        var qEl = document.createElement('div');
        qEl.className = 'al-quote';
        qEl.innerHTML = '<div class="al-quote-h">' + svg('doc') +
          '<span>' + esc(T.quoteLabel) + '</span></div>' +
          '<div class="al-quote-t"></div>';
        qEl.querySelector('.al-quote-t').textContent = q[1];
        frag.appendChild(qEl);
      }
      var uEl = document.createElement('div');
      var uText = q ? q[2] : m.content;
      // 与客户端同一条判定：单行且不超过 6 个字算短消息，用小一号的圆角
      uEl.className = 'al-msg-user' +
        (uText.indexOf('\n') < 0 && uText.length <= 6 ? ' short' : '');
      uEl.textContent = uText;
      frag.appendChild(uEl);
      if (m.images && m.images.length) {
        var ig = document.createElement('div');
        ig.className = 'al-msg-imgs';
        m.images.forEach(function (u) {
          var img = document.createElement('img');
          img.src = u;
          img.alt = '';
          ig.appendChild(img);
        });
        frag.appendChild(ig);
      }
    } else {
      if (m.toolCount) {
        var cap = document.createElement('div');
        cap.className = 'al-tool';
        cap.innerHTML = '<span class="al-tool-ico">' + svg('search') + '</span>' +
          '<span class="al-tool-label">' + esc(T.toolSummary(m.toolCount)) + '</span>';
        frag.appendChild(cap);
      }
      var row = document.createElement('div');
      row.className = 'al-msg-alice';
      var sameGroup = prevRole === 'assistant';
      row.innerHTML = avatarHtml('al-mini' + (sameGroup ? ' ghost' : '')) +
        '<div class="al-mtext">' + renderMd(m.content) + '</div>';
      frag.appendChild(row);
      // 本地即时消息（问候语、吐槽引导）不值得进笔记，服务器消息才带存钮
      if (!m.local && m.content) frag.appendChild(noteSaveAction(m.content));
    }
    return frag;
  }

  function renderMessages() {
    bodyEl.innerHTML = '';
    if (!state.messages.length) {
      var empty = document.createElement('div');
      empty.className = 'al-empty';
      empty.innerHTML = '<h3 class="al-greet">' + esc(pickGreeting()) + '</h3>' +
        '<div class="al-qs" id="al-qs"></div>' +
        '<button type="button" class="al-fb-link" id="al-fb-link">' + esc(T.feedbackTip) + ' &rarr;</button>';
      bodyEl.appendChild(empty);
      empty.querySelector('#al-fb-link').addEventListener('click', function () {
        enterFeedbackMode('');
      });
      loadQuestions().then(function (qs) {
        var wrap = bodyEl.querySelector('#al-qs');
        if (!wrap || state.messages.length) return;
        // 即使旧 render 注册的回调稍后才回来，也只替换当前四条，不做累加。
        wrap.innerHTML = '';
        qs.forEach(function (q) {
          var b = document.createElement('button');
          b.className = 'al-q';
          b.textContent = q;
          b.addEventListener('click', function () {
            inputEl.value = q;
            send();
          });
          wrap.appendChild(b);
        });
      });
      syncRicePrompt();
      return;
    }
    var prevRole = null, prevTs = null;
    state.messages.forEach(function (m) {
      bodyEl.appendChild(messageNodes(m, prevRole, prevTs));
      prevRole = m.role;
      prevTs = m.ts || prevTs;
    });
    syncRicePrompt();
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function appendThinking() {
    // 等回答的这几秒也要有人在场：头像照常占位，三点只是替换了那段还没写出的话，
    // 之后 ensureMsgEl 接上真正的气泡，头像位置不跳
    var el = document.createElement('div');
    el.className = 'al-msg-alice al-thinking';
    el.innerHTML = avatarHtml('al-mini') + '<div class="al-dots"><i></i><i></i><i></i></div>';
    bodyEl.appendChild(el);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return el;
  }

  function renderChip() {
    // 吐槽/问答的模式状态不再用 chip，改在输入卡工具栏体现（al-mode 按钮）
    var html = '';
    if (state.pendingQuote) {
      html += '<div class="al-chip">' +
        '<span class="al-chip-label">' + svg('doc') + esc(T.quoteLabel) + '</span>' +
        '<span class="al-chip-text">' + esc(state.pendingQuote) + '</span>' +
        '<button id="al-chip-x">' + svg('close') + '</button></div>';
    }
    if (state.feedbackMode && (state.fbImages.length || state.fbUploading)) {
      html += '<div class="al-fb-imgs">';
      state.fbImages.forEach(function (u, i) {
        html += '<span class="al-fb-thumb"><img src="' + esc(u) + '" alt="">' +
          '<button data-i="' + i + '">' + svg('close') + '</button></span>';
      });
      if (state.fbUploading) html += '<span class="al-fb-up">…</span>';
      html += '</div>';
    }
    chipWrap.innerHTML = html;
    var x = chipWrap.querySelector('#al-chip-x');
    if (x) x.addEventListener('click', function () {
      state.pendingQuote = '';
      // 输入框还是那句预填通用提问、用户没改过，就一并清掉，别留着空壳
      if (inputEl && inputEl.value === T.quoteAsk) {
        inputEl.value = '';
        autoGrow();
      }
      renderChip();
    });
    chipWrap.querySelectorAll('.al-fb-thumb button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.fbImages.splice(parseInt(b.getAttribute('data-i'), 10), 1);
        renderChip();
        stashFbDraft();
      });
    });
  }

  // ── Session 管理（登录用户）──────────────────────────────────────────
  var sessMenu = null, sessList = null;
  var histBtn = win.querySelector('#al-btn-hist');
  var sessionsCache = [];
  var sessionsFetchedAt = 0;
  var sessionsRequest = null;
  var SESSIONS_FRESH_TTL = 5 * 60 * 1000;
  var SESSIONS_MAX_TTL = 24 * 60 * 60 * 1000;

  function closeSessionsMenu() {
    if (sessMenu) { sessMenu.remove(); sessMenu = null; sessList = null; }
    state.sessionsOpen = false;
  }
  floaters.push({
    btn: histBtn,
    el: function () { return sessMenu; },
    isOpen: function () { return state.sessionsOpen; },
    close: closeSessionsMenu
  });

  function stashSessions() {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify({
        ts: sessionsFetchedAt || Date.now(),
        sessions: sessionsCache.slice(0, 50)
      }));
    } catch (e) {}
  }

  function restoreSessions() {
    var c = null;
    try { c = JSON.parse(localStorage.getItem(SESSIONS_KEY) || 'null'); } catch (e) {}
    if (!c || !Array.isArray(c.sessions)) return false;
    if (Date.now() - (c.ts || 0) > SESSIONS_MAX_TTL) return false;
    sessionsCache = c.sessions;
    sessionsFetchedAt = c.ts || 0;
    return true;
  }

  function renderSessions() {
    if (!sessList) return;
    if (!sessionsCache.length) {
      sessList.innerHTML = '<div class="al-sess-empty">' + esc(T.noSessions) + '</div>';
      return;
    }
    sessList.innerHTML = '';
    sessionsCache.forEach(function (s) {
      var item = document.createElement('div');
      item.className = 'al-sess-item' + (s.id === state.sessionId ? ' cur' : '');
      var dt = new Date(s.updated_at * 1000);
      item.innerHTML =
        '<span class="al-sess-title">' + esc(s.title || '…') + '</span>' +
        '<span class="al-sess-meta">' + (dt.getMonth() + 1) + '/' + dt.getDate() + '</span>' +
        '<button class="al-sess-del" title="' + esc(T.del) + '">' + svg('trash') + '</button>';
      item.querySelector('.al-sess-del').addEventListener('click', function (e) {
        e.stopPropagation();
        if (!confirm(T.delConfirm)) return;
        fetch('/alice/sessions/' + s.id, {
          method: 'DELETE', credentials: 'same-origin'
        }).then(function () {
          sessionsCache = sessionsCache.filter(function (x) { return x.id !== s.id; });
          sessionsFetchedAt = Date.now();
          stashSessions();
          renderSessions();
          if (s.id === state.sessionId) startNewChat();
        });
      });
      item.addEventListener('click', function () {
        loadSession(s.id);
        closeSessionsMenu();
      });
      sessList.appendChild(item);
    });
  }

  function loadSessions(force) {
    if (!state.loggedIn) return Promise.resolve();
    if (!sessionsFetchedAt) restoreSessions();
    if (!force && sessionsFetchedAt &&
        Date.now() - sessionsFetchedAt < SESSIONS_FRESH_TTL) {
      if (state.sessionsOpen) renderSessions();
      return Promise.resolve(sessionsCache);
    }
    if (sessionsRequest) return sessionsRequest;
    sessionsRequest = fetch('/alice/sessions', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw new Error('bad sessions response');
        // Alice 存储短暂不可达时保留仍可用的本地目录，不能用降级空数组覆盖它。
        if (d.degraded && !(d.sessions || []).length && sessionsFetchedAt) return sessionsCache;
        sessionsCache = d.sessions || [];
        sessionsFetchedAt = Date.now();
        stashSessions();
        if (state.sessionsOpen) renderSessions();
        return sessionsCache;
      })
      .catch(function () {
        if (state.sessionsOpen) {
          if (sessionsFetchedAt) renderSessions();
          else if (sessList) sessList.innerHTML =
            '<div class="al-sess-empty">' + esc(T.netErr) + '</div>';
        }
        return sessionsCache;
      })
      .then(function (result) {
        sessionsRequest = null;
        return result;
      });
    return sessionsRequest;
  }

  function refreshSessionsAfterChat() {
    // 如果登录后的预取还没结束，等它收尾后再强刷一次，避免新会话被较早的响应覆盖。
    var pending = sessionsRequest;
    return pending ? pending.then(function () { return loadSessions(true); }) : loadSessions(true);
  }

  histBtn.addEventListener('click', function () {
    if (state.sessionsOpen) { closeSessionsMenu(); return; }
    state.sessionsOpen = true;
    sessMenu = document.createElement('div');
    sessMenu.className = 'al-sessions';
    sessMenu.innerHTML = '<div class="al-sess-list"><div class="al-sess-empty">…</div></div>';
    win.appendChild(sessMenu);
    sessList = sessMenu.firstChild;
    anchorPopover(sessMenu, histBtn, 320);
    if (!sessionsFetchedAt) restoreSessions();
    if (sessionsFetchedAt) renderSessions();
    loadSessions(false);
  });

  // quiet=true：切页后的静默校正——已经用本地快照把历史画出来了，拉回来的
  // 内容一样就别重画，否则用户刚往上翻的历史会被拽回底部
  function loadSession(sid, quiet) {
    return fetch('/alice/sessions/' + sid + '/messages', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) return;
        if (state.feedbackMode) exitFeedbackMode();
        state.sessionId = sid;
        try { localStorage.setItem(SID_KEY, sid); } catch (e) {}
        var next = (d.messages || []).map(function (m) {
          var toolCount = 0;
          try { toolCount = (JSON.parse(m.tool_trace || '[]') || []).length; } catch (e) {}
          return { role: m.role, content: m.content, ts: m.created_at, toolCount: toolCount };
        });
        var unchanged = quiet && sameMessages(state.messages, next);
        state.messages = next;
        if (!unchanged) renderMessages();
        stashMessages();
      })
      .catch(function () {});
  }

  function sameMessages(a, b) {
    var left = a.filter(function (m) { return !m.local; });
    if (left.length !== b.length) return false;
    for (var i = 0; i < left.length; i++) {
      if (left[i].role !== b[i].role || left[i].content !== b[i].content) return false;
    }
    return true;
  }

  function startNewChat() {
    state.sessionId = null;
    state.messages = [];
    if (state.feedbackMode) exitFeedbackMode();
    try { localStorage.removeItem(SID_KEY); } catch (e) {}
    stashMessages();
    renderMessages();
  }
  win.querySelector('#al-btn-new').addEventListener('click', function () {
    startNewChat();
    closeSessionsMenu();
    inputEl.focus();
  });

  // ── SSE 读取（POST /alice/chat 与 GET /alice/chat/stream 共用）───────
  function readSSE(resp, onEvent) {
    var reader = resp.body.getReader();
    var decoder = new TextDecoder();
    var buf = '';
    function pump() {
      return reader.read().then(function (r) {
        if (r.done) return;
        buf += decoder.decode(r.value, { stream: true });
        var parts = buf.split('\n\n');
        buf = parts.pop();
        parts.forEach(function (part) {
          var line = part.trim();
          if (line.indexOf('data:') !== 0) return;
          try { onEvent(JSON.parse(line.slice(5).trim())); } catch (e) {}
        });
        return pump();
      });
    }
    return pump();
  }

  // ── 消息快照：切页后先画本地缓存，再等接口静默校正 ────────────────────
  // 课件是多页站点，翻页即整页导航，窗口 DOM 每页重建。没有快照的话，历史要
  // 等会话接口回来才出现，观感上就是「每翻一页 Alice 都清空重来」。
  // 只缓存入库过的消息：吐槽引导那类本地即时消息本来就是一次性的。
  var MSGS_TTL = 24 * 3600 * 1000;
  var MSGS_FRESH_TTL = 5 * 60 * 1000;
  var messagesFetchedAt = 0;

  function stashMessages() {
    try {
      var keep = state.messages.filter(function (m) { return !m.local; });
      if (!keep.length) { localStorage.removeItem(MSGS_KEY); return; }
      messagesFetchedAt = Date.now();
      localStorage.setItem(MSGS_KEY, JSON.stringify({
        sid: state.sessionId || '', ts: messagesFetchedAt, messages: keep.slice(-40)
      }));
    } catch (e) {}
  }

  function restoreMessages() {
    var c = null, sid = null;
    try {
      c = JSON.parse(localStorage.getItem(MSGS_KEY) || 'null');
      sid = localStorage.getItem(SID_KEY);
    } catch (e) {}
    if (!c || !c.messages || !c.messages.length) return false;
    if (Date.now() - (c.ts || 0) > MSGS_TTL) return false;
    if ((c.sid || '') !== (sid || '')) return false;   // 会话已换，快照作废
    state.messages = c.messages;
    state.sessionId = sid || null;
    messagesFetchedAt = c.ts || 0;
    return true;
  }

  // ── 多页/多标签同步 ──────────────────────────────────────────────────
  // 同一对话可能在几个课件页同时开着。storage 事件只在「别的标签页」写
  // localStorage 时触发：那边完成一轮对话写回快照，这边发现是同一会话且
  // 内容变了，就静默重拉。服务器按时间追加、是唯一权威，重拉天然实现
  // 「上下文冲突以后发生的那次为准」；本页正在生成时跳过——本页这轮才是
  // 更晚的那次，完成后写快照反向同步过去。
  window.addEventListener('storage', function (e) {
    if (e.key === SESSIONS_KEY && e.newValue) {
      var sc = null;
      try { sc = JSON.parse(e.newValue); } catch (errS) { return; }
      if (!sc || !Array.isArray(sc.sessions)) return;
      sessionsCache = sc.sessions;
      sessionsFetchedAt = sc.ts || Date.now();
      if (state.sessionsOpen) renderSessions();
      return;
    }
    if (e.key === NOTES_KEY && e.newValue) {
      var nc = null;
      try { nc = JSON.parse(e.newValue); } catch (errN) { return; }
      if (!nc || !Array.isArray(nc.notes) ||
          !state.accountKey || nc.account !== state.accountKey) return;
      notesCache = nc.notes;
      notesFetchedAt = nc.ts || Date.now();
      if (state.tab === 'notes') renderNotes();
      return;
    }
    if (e.key === MOMENTS_KEY && e.newValue) {
      var mc = null;
      try { mc = JSON.parse(e.newValue); } catch (err0) { return; }
      if (!mc || !Array.isArray(mc.moments) || !mc.moments.length) return;
      momentsCache = mc.moments;
      momentsFetchedAt = mc.ts || Date.now();
      momentsHasMore = mc.has_more === true;
      momentsVisibleLimit = +(mc.limit || 20);
      if (state.tab === 'discover') renderMoments();
      return;
    }
    if (e.key !== MSGS_KEY || !e.newValue || state.streaming) return;
    var c = null;
    try { c = JSON.parse(e.newValue); } catch (err) { return; }
    if (!c || !c.sid || c.sid !== (state.sessionId || '')) return;
    if (sameMessages(state.messages, c.messages || [])) return;
    // 写入快照的另一个页签刚完成了服务端生成，这份本地数据已是最新，不再多
    // 发一次 messages 请求；跨设备的变化仍由五分钟后的静默校正兜底。
    state.messages = c.messages || [];
    messagesFetchedAt = c.ts || Date.now();
    renderMessages();
  });

  function saveGenPending(genId) {
    try {
      localStorage.setItem(GEN_KEY, JSON.stringify({
        gen_id: genId, session_id: state.sessionId, ts: Date.now()
      }));
    } catch (e) {}
  }
  function clearGenPending() {
    try { localStorage.removeItem(GEN_KEY); } catch (e) {}
  }

  // ── 发送 & 流式接收 ──────────────────────────────────────────────────
  function autoGrow() {
    // 不可见时 scrollHeight 恒为 0（窗关着、或停在「朋友圈」页 composer 被隐藏），
    // 照量照写就把输入框锁成 0 高——回到对话页看着还在，其实点不进也打不了字。
    // 所以隐藏期间不量，由 openWin / showTab 在露出来之后补量一次。
    if (!inputEl.offsetParent) return;
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  }
  inputEl.addEventListener('input', function () {
    autoGrow();
    stashFbDraft();   // 吐槽模式下边写边存，登录跳转回来不丢字
  });
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send();
    }
  });
  sendBtn.addEventListener('click', send);

  // 一次流式接收的 UI 状态机：thinking 点、工具胶囊、正文光标
  function makeStreamUI() {
    var thinkingEl = appendThinking();
    var msgRow = null, msgText = null;
    var toolEls = [];
    var acc = '';
    var toolCount = 0;

    function ensureMsgEl() {
      if (thinkingEl) { thinkingEl.remove(); thinkingEl = null; }
      if (!msgRow) {
        msgRow = document.createElement('div');
        msgRow.className = 'al-msg-alice';
        var prev = state.messages[state.messages.length - 1];
        var sameGroup = prev && prev.role === 'assistant';
        msgRow.innerHTML = avatarHtml('al-mini' + (sameGroup ? ' ghost' : '')) +
          '<div class="al-mtext"></div>';
        bodyEl.appendChild(msgRow);
        msgText = msgRow.querySelector('.al-mtext');
      }
    }

    return {
      handleEvent: function (obj) {
        if (obj.session_id) {
          state.sessionId = obj.session_id;
          try { localStorage.setItem(SID_KEY, obj.session_id); } catch (e) {}
        }
        if (obj.gen_id) saveGenPending(obj.gen_id);
        if (obj.tool) {
          if (thinkingEl) { thinkingEl.remove(); thinkingEl = null; }
          if (obj.tool.status === 'running') {
            var cap = document.createElement('div');
            cap.className = 'al-tool running';
            cap.innerHTML = '<span class="al-tool-ico">' +
              svg((obj.tool.name === 'web_read' || obj.tool.name === 'read_lesson') ? 'book'
                : (obj.tool.name === 'image_gen' || obj.tool.name === 'alice_selfie' || obj.tool.name === 'post_moment') ? 'image'
                : 'search') + '</span>' +
              '<span class="al-tool-label">' + esc(obj.tool.label || '') + '</span>';
            bodyEl.appendChild(cap);
            toolEls.push(cap);
            toolCount++;
            bodyEl.scrollTop = bodyEl.scrollHeight;
          } else {
            var last = toolEls[toolEls.length - 1];
            if (last) last.classList.remove('running');
          }
        }
        if (obj.delta) {
          ensureMsgEl();
          acc += obj.delta;
          msgText.innerHTML = renderMd(acc) + '<span class="al-cursor"></span>';
          bodyEl.scrollTop = bodyEl.scrollHeight;
        }
        if (obj.error) {
          ensureMsgEl();
          acc = acc || obj.error;
          msgText.textContent = obj.error;
        }
      },
      finalize: function () {
        if (thinkingEl) { thinkingEl.remove(); thinkingEl = null; }
        if (msgText) msgText.innerHTML = renderMd(acc);
        // 工具胶囊折叠为一条摘要
        if (toolEls.length) {
          toolEls.forEach(function (el) { el.remove(); });
          if (msgRow && toolCount) {
            var sum = document.createElement('div');
            sum.className = 'al-tool';
            sum.innerHTML = '<span class="al-tool-ico">' + svg('search') + '</span>' +
              '<span class="al-tool-label">' + esc(T.toolSummary(toolCount)) + '</span>';
            bodyEl.insertBefore(sum, msgRow);
          }
        }
        bodyEl.scrollTop = bodyEl.scrollHeight;
        return { text: acc, toolCount: toolCount };
      }
    };
  }

  function send() {
    if (state.streaming) return;
    var text = inputEl.value.trim();
    if (!text) return;
    if (state.feedbackMode) { sendFeedback(text); return; }
    if (!state.loggedIn) {
      renderNote();   // 未登录：只引导登录，不发请求（计费要用学员本人的米粒）
      if (noteEl.dataset.show === '1' && state.tab === 'chat') noteEl.style.display = '';
      return;
    }
    var quote = state.pendingQuote;
    state.pendingQuote = '';
    renderChip();
    inputEl.value = '';
    autoGrow();

    var userContent = quote
      ? '【划选内容】\n' + quote + '\n\n【我的问题】\n' + text
      : text;
    var hadEmpty = !state.messages.length;
    state.messages.push({ role: 'user', content: userContent, ts: Math.floor(Date.now() / 1000) });
    if (hadEmpty) {
      renderMessages();   // 清掉问候语空态
    } else {
      var prev = state.messages[state.messages.length - 2];
      bodyEl.appendChild(messageNodes(state.messages[state.messages.length - 1],
        prev && prev.role, prev && prev.ts));
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }
    stashMessages();   // 提问先落快照：回答生成中切页也不会丢掉这一问

    var body = {
      message: text,
      context: { file: PAGE_FILE, title: PAGE_TITLE, selection: quote, lang: LANG, tz: TZ_NAME }
    };
    if (state.sessionId) body.session_id = state.sessionId;

    state.streaming = true;
    sendBtn.disabled = true;
    var ui = makeStreamUI();
    var sawNoRice = false;

    fetch('/alice/chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (resp) {
      if (resp.status === 401) throw { code: 'login' };
      if (resp.status === 402) throw { code: 'no_rice' };
      if (resp.status === 403) {
        return resp.json().then(function (d) {
          throw { code: 'banned', until: (d && d.until) || 0 };
        });
      }
      if (!resp.ok || !resp.body) throw new Error('http ' + resp.status);
      return readSSE(resp, function (obj) {
        if (obj.error_code === 'no_rice') sawNoRice = true;
        ui.handleEvent(obj);
      });
    }).then(function () {
      if (sawNoRice) markLowRice();
      finish();
    }).catch(function (err) {
      // 刷新会主动掐断当前 fetch；后台任务仍在生成，保留 GEN_KEY 给新页面重连。
      if (pageUnloading) return;
      var out = ui.finalize();
      if (err && err.code === 'login') {
        state.messages.pop();     // 回滚未发送成功的提问
        state.loggedIn = false;
        renderNote();
        renderMessages();
        cleanup(out);
        return;
      }
      if (err && err.code === 'no_rice') {
        state.messages.pop();
        markLowRice();
        renderMessages();
        cleanup(out);
        return;
      }
      if (err && err.code === 'banned') {
        state.messages.pop();
        var when = err.until ? new Date(err.until * 1000).toLocaleString() : '';
        pushLocalMsg('assistant', T.banned(when));
        renderMessages();
        cleanup(out);
        return;
      }
      if (!out.text) {
        var el = document.createElement('div');
        el.className = 'al-msg-alice';
        el.innerHTML = avatarHtml('al-mini') +
          '<div class="al-mtext">' + esc(T.netErr) + '</div>';
        bodyEl.appendChild(el);
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
      cleanup(out);
    });

    function finish() {
      var out = ui.finalize();
      cleanup(out);
      refreshSessionsAfterChat();
    }
    function cleanup(out) {
      state.streaming = false;
      sendBtn.disabled = false;
      clearGenPending();
      if (out && out.text) {
        state.messages.push({
          role: 'assistant', content: out.text,
          ts: Math.floor(Date.now() / 1000), toolCount: out.toolCount || 0
        });
        // 流式气泡不经 messageNodes，收尾补上「存入笔记」行
        bodyEl.appendChild(noteSaveAction(out.text));
      }
      stashMessages();
      refreshMe();
    }
  }

  // ── 切页恢复：未看完的生成流重连 ─────────────────────────────────────
  function attachPendingGen(rec) {
    // 历史里最后一条是刚问的问题，重连把回答和画图工具状态续上
    state.streaming = true;
    sendBtn.disabled = true;
    var ui = makeStreamUI();
    fetch('/alice/chat/stream?msg=' + encodeURIComponent(rec.gen_id),
      { credentials: 'same-origin' })
      .then(function (resp) {
        if (!resp.ok || !resp.body) throw new Error('gone');
        return readSSE(resp, ui.handleEvent);
      })
      .then(function () {
        var out = ui.finalize();
        state.streaming = false;
        sendBtn.disabled = false;
        clearGenPending();
        if (out.text) {
          // 已经完整入库；本地补一条以免等重新拉取
          var last = state.messages[state.messages.length - 1];
          if (!last || last.role !== 'assistant' || last.content !== out.text) {
            state.messages.push({
              role: 'assistant', content: out.text,
              ts: Math.floor(Date.now() / 1000), toolCount: out.toolCount || 0
            });
            bodyEl.appendChild(noteSaveAction(out.text));
          }
          stashMessages();
        }
        refreshSessionsAfterChat();
      })
      .catch(function () {
        if (pageUnloading) return;
        // 流已过期：回答可能已经入库，重拉会话即可
        ui.finalize();
        state.streaming = false;
        sendBtn.disabled = false;
        clearGenPending();
        if (state.sessionId) loadSession(state.sessionId);
      });
  }

  function resumePendingGen() {
    var rec = null;
    try { rec = JSON.parse(localStorage.getItem(GEN_KEY) || 'null'); } catch (e) {}
    if (rec && rec.gen_id && Date.now() - (rec.ts || 0) <= 30 * 60 * 1000) {
      attachPendingGen(rec);
      return;
    }
    if (rec) clearGenPending();

    // 即使刷新发生在首个 SSE 包（gen_id）到达前，也可按会话从服务端找回任务。
    var last = state.messages[state.messages.length - 1];
    if (!state.sessionId || !last || last.role !== 'user') return;
    discoverPendingGen(last, 0);
  }

  function discoverPendingGen(last, attempt) {
    var url = '/alice/chat/pending?session_id=' + encodeURIComponent(state.sessionId) +
      '&after=' + encodeURIComponent(last.ts || 0);
    fetch(url,
      { credentials: 'same-origin' })
      .then(function (resp) {
        if (resp.status === 404) throw { code: 'not_found' };
        if (!resp.ok) throw new Error('pending lookup failed');
        return resp.json();
      })
      .then(function (data) {
        if (!data || !data.gen_id) throw new Error('not found');
        saveGenPending(data.gen_id);
        attachPendingGen(data);
      })
      .catch(function (err) {
        // 原 POST 可能还在换 Key/组上下文，后台任务尚未来得及注册；短暂重试。
        if (err && err.code === 'not_found' && attempt < 11 && !pageUnloading) {
          setTimeout(function () { discoverPendingGen(last, attempt + 1); }, 500);
          return;
        }
        // 服务重启等场景下内存任务已不在；权威历史仍可能已有最终回答。
        if (!pageUnloading && state.sessionId) loadSession(state.sessionId, true);
      });
  }

  // ── 初始化 ───────────────────────────────────────────────────────────
  // 翻页是整页导航，这段决定「切页后 Alice 看起来有没有重启」。所以形态和
  // 历史全部**同步**恢复：不等 /alice/me、更不等会话接口。等网络的话，正文
  // 会先全宽亮再猛地收窄，窗口也会缺席一段再带动画飞回来。
  // 灰度：用上次 me 缓存的 enabled 做首帧决策；权威结论仍以本次 me 为准。
  var bootOpen = false, bootEnabled = false;
  try {
    state.side = localStorage.getItem(SIDE_KEY) === '1';
    bootOpen = localStorage.getItem(OPEN_KEY) === '1';
    bootEnabled = localStorage.getItem(EN_KEY) === '1';
  } catch (e) {}
  var fromCache = restoreMessages();
  document.documentElement.classList.add('alice-boot');   // 首帧不播让位过渡
  applySide();
  if (bootEnabled) {
    state.enabled = true;
    if (bootOpen) openWin(true);
    else {
      fab.classList.remove('hidden');
      maybeShowFabNudge();
    }
  }
  renderMessages();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('alice-boot');
    });
  });

  // 余额不足时从充值页切回来立即复查；只对低余额用户强刷，普通翻页仍走缓存。
  window.addEventListener('focus', function () {
    if (rememberedLowRice() && !state.streaming) refreshMe(true);
  });

  refreshMe(rememberedLowRice()).then(function () {
    if (!state.enabled) return;   // 不在白名单：入口已拆掉，后面的会话恢复不必跑
    var loaded = Promise.resolve();
    if (state.loggedIn) {
      // 登录态确认后立即在后台预取目录；用户稍后点历史按钮时直接读内存/本地快照。
      loadSessions(false);
      var sid = null;
      try { sid = localStorage.getItem(SID_KEY); } catch (e) {}
      // 刚完成/刚同步过的本地快照就是当前浏览器的最新副本，翻一页课件不应
      // 再拉同一段历史。超过五分钟才静默校正，以接住其他设备产生的变化。
      var cacheFresh = fromCache && messagesFetchedAt &&
        Date.now() - messagesFetchedAt < MSGS_FRESH_TTL;
      if (sid && !cacheFresh) loaded = loadSession(sid, fromCache) || Promise.resolve();
    } else if (fromCache && state.meOk) {
      // 只有服务端明确答「未登录」才丢快照。请求失败不算——那多半是网络抖动，
      // 把人家的对话历史清成空态，比晚几秒校正糟糕得多。
      state.messages = [];
      state.sessionId = null;
      stashMessages();
      renderMessages();
    }
    Promise.resolve(loaded).then(function () {
      if (state.loggedIn) resumePendingGen();
      restoreFbDraft();   // 登录跳转/翻页回来，接着上次的吐槽写
    });
  });
})();
