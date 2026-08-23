/* challenge.js — 7 天学习挑战（learn 壳页专用，见 PRD-7day-challenge.md）
   职责：顶栏入口注入 + 游戏面板/说明卡/结算卡渲染 + 领取动效。
   前端只展示不判断：资格、金额、切日全部以 /auth/challenge* 返回为准。 */
(function () {
  'use strict';

  var slot = document.getElementById('authSlot');
  if (!slot) return; // 只在 learn 壳页生效

  /* ────────────── 三语文案 ────────────── */

  var LANG = /\.en\.html/.test(location.pathname) ? 'en'
    : /\.ko\.html/.test(location.pathname) ? 'ko' : 'zh';

  var I18N = {
    zh: {
      title: 'Alice 伴学计划',
      // 缎带标题字号，单位是底图 1536×1024 坐标系里的像素。
      // 缎带主体只有 330px 宽（x 460~790），各语种长度不同必须各配一个值，
      // 排出去就会落到两端的燕尾和下垂尾段上。实测占宽见各语种注释。
      titleSize: 39,
      titleDy: 0,
      entryName: '伴学',
      entryCta: '伴学计划',
      entryDay: function (d, c, q) { return 'Day ' + d + ' · 今日 ' + c + '/' + q; },
      entryClaim: function (amt) { return '可领 ' + amt; },
      entryDone: function (d) { return 'Day ' + d + ' ✓'; },
      entryReport: '伴学战报',
      // 窄屏顶栏短文案：完整文案会把入口挤出视口
      sCta: '伴学', sDay: function (d, c, q) { return 'D' + d + ' ' + c + '/' + q; },
      sClaim: function (amt) { return '领 ' + amt; }, sDone: function (d) { return 'D' + d + ' ✓'; },
      sReport: '战报',
      day: function (d) { return '第 ' + d + ' 天'; },
      bonusBadge: '+700 全勤',
      paybackBadge: '回本',
      paybackTick: '回本',
      paybackNote: function (day, acc) {
        return '撑到<strong>第 ' + day + ' 天</strong>累计 ' + acc + ' 米粒，本金已经赚回来，之后全是净赚';
      },
      paybackHit: '本金已赚回！之后全是净赚',
      totalBarDone: function (got, max) { return '已回本 · 已领 ' + got + ' / 全勤 ' + max; },
      lockedTip: '待解锁',
      missedTip: '已错过',
      claimTip: '点击领取',
      activeTip: function (c, q) { return q > 0 ? '已学 ' + c + '/' + q + ' 节' : '今日免任务'; },
      claimedTip: '已到账',
      countdown: function (h, m) { return '今日截止：凌晨 4:00（剩 ' + h + ' 小时 ' + m + ' 分）'; },
      totalBar: function (got, max) { return '已领 ' + got + ' / 全勤 ' + max + ' 米粒'; },
      introSub: '小小的投入，奖励自己的回报 · 7 天最多拿回 2800',
      ladderBonus: '全勤奖',
      rules: [
        ['book-open', '每天学 <b>5</b> 节课（标记「已学」），当天补贴就解锁'],
        ['hand-coins', '补贴要<strong>当天自己领</strong>，次日凌晨 4 点截止'],
        ['calendar-x', '断一天只作废当天，后面照常领；<strong>7 天全勤再加 700</strong>'],
        ['sunrise', '加入后<strong>今天就是第 1 天</strong>（每天凌晨 4 点刷新）'],
        ['wallet', '米粒是<strong>米羊通用余额</strong>，旗下各应用通用；也能在 Cherry Studio 等客户端里调用 Alice 的模型'],
        ['shield-alert', '每节课都需要真实学习时间：<strong>刷课行为会被服务端记录，核实后取消伴学资格</strong>，已投入的 800 米粒不退还。'],
      ],
      enrollCta: '投入 800 米粒，开启伴学',
      loginCta: '登录后加入伴学计划',
      enrollNote: '米粒从你的米羊账户扣除 · 每人仅可参加一次<br>这 800 米粒不仅能悉数返还，更是我们与你共同坚持、学有所得的约定',
      enrollDeadline: function (m, d) { return '本期报名截止 ' + m + ' 月 ' + d + ' 日，之后不定期开放'; },
      enrollClosedMsg: '本期伴学计划的报名已截止，之后会不定期开放，请关注公众号消息。',
      lateConfirm: '现在是凌晨（4 点前算前一天），加入后第 1 天只剩几小时。\n建议白天再来，确定现在开启吗？',
      insufficient: '米粒余额不足 800，去米羊充值后再来？',
      claimFail: { task_not_done: '今日任务还没完成', already_claimed: '今日已领过了', expired: '伴学计划已结束', disqualified: '伴学资格已被取消', upstream: '网络开小差了，稍后再试' },
      phoneTitle: '还差一步：绑定手机号',
      phoneBody: '伴学计划发放真金白银的补贴，仅对<strong>绑定手机号</strong>的账号开放。你当前用邮箱登录，到米羊个人中心绑定手机号后就能参加。',
      phoneCta: '去绑定手机号',
      phoneLater: '先不参加',
      entryDq: '资格已取消', sDq: '已取消',
      dqTitle: '伴学资格已取消',
      dqBody: '经核查存在刷课行为，伴学资格已取消。已投入的米粒不予退还，已领取的补贴不受影响。<br>如认为是误判，进交流群找洛小山申诉即可。',
      dqWhy: '判定依据',
      dqAppeal: '我要申诉',
      settleFull: '全勤达成！',
      settleEnd: '伴学计划结束',
      settleTotalUnit: '米粒已到账',
      settleNote: '米粒是米羊通用余额，旗下各应用通用；也能在 Cherry Studio 等客户端里调用 Alice 的模型',
      settleCta: '继续学习',
      claimSuccess: '领取成功！',
      claimSuccessSub: '恭喜获得',
      claimSuccessCta: '开心收下',
      unitName: '米粒',
      bonusClaimed: '全勤奖',
    },
    en: {
      title: 'Learn with Alice',
      titleSize: 32,
      titleDy: -8,
      entryName: 'Plan',
      entryCta: 'Alice Plan',
      entryDay: function (d, c, q) { return 'Day ' + d + ' · ' + c + '/' + q; },
      entryClaim: function (amt) { return 'Claim ' + amt; },
      entryDone: function (d) { return 'Day ' + d + ' ✓'; },
      entryReport: 'Study Report',
      sCta: 'Alice', sDay: function (d, c, q) { return 'D' + d + ' ' + c + '/' + q; },
      sClaim: function (amt) { return '+' + amt; }, sDone: function (d) { return 'D' + d + ' ✓'; },
      sReport: 'Report',
      day: function (d) { return 'Day ' + d; },
      bonusBadge: '+700 Bonus',
      paybackBadge: 'Break even',
      paybackTick: 'Break even',
      paybackNote: function (day, acc) {
        return 'Reach <strong>Day ' + day + '</strong> and you are at ' + acc + ' rice — stake earned back, the rest is pure profit';
      },
      paybackHit: 'Stake earned back! Everything from here is profit',
      totalBarDone: function (got, max) { return 'Stake back · ' + got + ' / ' + max + ' rice'; },
      lockedTip: 'Locked',
      missedTip: 'Missed',
      claimTip: 'Tap to claim',
      activeTip: function (c, q) { return q > 0 ? c + '/' + q + ' lessons' : 'Free pass today'; },
      claimedTip: 'Claimed',
      countdown: function (h, m) { return 'Ends 4:00 AM (' + h + 'h ' + m + 'm left)'; },
      totalBar: function (got, max) { return got + ' / ' + max + ' rice claimed'; },
      introSub: 'A small stake, a reward you give yourself · up to 2800 back in 7 days',
      ladderBonus: 'Bonus',
      rules: [
        ['book-open', 'Learn <b>5</b> lessons a day (mark as done) to unlock that day\'s subsidy'],
        ['hand-coins', 'Claim it <strong>yourself, same day</strong> — window closes 4:00 AM next morning'],
        ['calendar-x', 'Miss a day and only that day is void; <strong>all 7 days adds +700</strong>'],
        ['sunrise', '<strong>Today counts as Day 1</strong> (days reset at 4:00 AM)'],
        ['wallet', 'Rice is your <strong>Miyang balance</strong> — good across every Miyang app, and for calling Alice models from clients like Cherry Studio'],
        ['shield-alert', 'Each lesson takes real study time: <strong>abusive marking is recorded server-side and costs you your place once reviewed</strong>. The 800 rice stake is not refunded.'],
      ],
      enrollCta: 'Put in 800 rice & start',
      loginCta: 'Sign in to join',
      enrollNote: 'Rice is deducted from your Miyang account · one entry per person<br>These 800 rice grains are not a fee, but a commitment to help you stay motivated and succeed',
      enrollDeadline: function (m, d) { return 'Enrollment closes ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] + ' ' + d + '; future rounds TBA'; },
      enrollClosedMsg: 'Enrollment for this round has closed. Future rounds will be announced.',
      lateConfirm: 'It is past midnight (before 4 AM counts as yesterday). Day 1 would only last a few hours.\nStart anyway?',
      insufficient: 'You need 800 rice. Top up on miyang.cn?',
      claimFail: { task_not_done: 'Finish today\'s lessons first', already_claimed: 'Already claimed today', expired: 'This plan has ended', disqualified: 'You have been disqualified', upstream: 'Network hiccup, try again' },
      phoneTitle: 'One more step: verify your phone',
      phoneBody: 'This plan pays out real rice, so it is only open to accounts with a <strong>verified phone number</strong>. You signed in with email; bind a phone number in your Miyang profile to join.',
      phoneCta: 'Bind phone number',
      phoneLater: 'Maybe later',
      entryDq: 'Disqualified', sDq: 'DQ',
      dqTitle: 'Disqualified from the plan',
      dqBody: 'A review found abusive lesson marking, so your place has been withdrawn. The stake is not refunded; subsidies already claimed are unaffected.<br>If you believe this is a mistake, reach Luo Xiaoshan via the community group to appeal.',
      dqWhy: 'What the review found',
      dqAppeal: 'Appeal',
      settleFull: 'All 7 Days Done!',
      settleEnd: 'Plan Complete',
      settleTotalUnit: 'rice credited',
      settleNote: 'Rice is your Miyang balance — good across every Miyang app, and for calling Alice models from clients like Cherry Studio',
      settleCta: 'Keep learning',
      claimSuccess: 'Claim Successful!',
      claimSuccessSub: 'Congratulations! You received',
      claimSuccessCta: 'Awesome',
      unitName: 'rice',
      bonusClaimed: 'Attendance Bonus',
    },
    ko: {
      title: 'Alice 학습 플랜',
      titleSize: 41,
      titleDy: 0,
      entryName: '플랜',
      entryCta: '학습 플랜',
      entryDay: function (d, c, q) { return 'Day ' + d + ' · 오늘 ' + c + '/' + q; },
      entryClaim: function (amt) { return amt + ' 받기'; },
      entryDone: function (d) { return 'Day ' + d + ' ✓'; },
      entryReport: '학습 리포트',
      sCta: '플랜', sDay: function (d, c, q) { return 'D' + d + ' ' + c + '/' + q; },
      sClaim: function (amt) { return '+' + amt; }, sDone: function (d) { return 'D' + d + ' ✓'; },
      sReport: '리포트',
      day: function (d) { return d + '일차'; },
      bonusBadge: '+700 개근',
      paybackBadge: '원금 회수',
      paybackTick: '원금',
      paybackNote: function (day, acc) {
        return '<strong>' + day + '일차</strong>에 누적 ' + acc + ' 미리로 원금을 회수, 이후는 전부 순이익';
      },
      paybackHit: '원금 회수 완료! 이제부터는 전부 순이익',
      totalBarDone: function (got, max) { return '원금 회수 · ' + got + ' / ' + max + ' 미리'; },
      lockedTip: '잠김',
      missedTip: '놓침',
      claimTip: '눌러서 받기',
      activeTip: function (c, q) { return q > 0 ? '학습 ' + c + '/' + q : '오늘은 자동 달성'; },
      claimedTip: '지급 완료',
      countdown: function (h, m) { return '오늘 마감: 새벽 4시 (' + h + '시간 ' + m + '분 남음)'; },
      totalBar: function (got, max) { return '받은 미리 ' + got + ' / 개근 ' + max; },
      introSub: '작은 투자로 스스로에게 주는 보상 · 7일 최대 2800 회수',
      ladderBonus: '개근 보너스',
      rules: [
        ['book-open', '매일 <b>5</b>개 레슨 학습(「학습 완료」 표시)하면 그날 지원금 해제'],
        ['hand-coins', '지원금은 <strong>당일 직접 수령</strong> — 다음날 새벽 4시 마감'],
        ['calendar-x', '하루 놓치면 그날만 무효, 이후는 정상 진행; <strong>7일 개근 시 +700</strong>'],
        ['sunrise', '참여한 <strong>오늘이 바로 1일차</strong> (매일 새벽 4시 리셋)'],
        ['wallet', '미리는 <strong>미양 공용 잔액</strong>으로 산하 모든 앱에서 쓰이고, Cherry Studio 같은 클라이언트에서 Alice 모델 호출에도 사용 가능'],
        ['shield-alert', '각 레슨에는 실제 학습 시간이 필요합니다: <strong>어뷰징 행위는 서버에 기록되며 확인 후 자격이 취소</strong>되고, 투입한 800 미리는 반환되지 않습니다.'],
      ],
      enrollCta: '미리 800 넣고 시작하기',
      loginCta: '로그인 후 참여',
      enrollNote: '미리는 미양 계정에서 차감 · 1인 1회 참여<br>이 800 미리는 단순한 예치가 아닌, 끝까지 포기하지 않고 함께 완주하겠다는 약속입니다',
      enrollDeadline: function (m, d) { return '이번 기수 신청 마감: ' + m + '월 ' + d + '일 · 이후 비정기 오픈'; },
      enrollClosedMsg: '이번 기수 신청이 마감되었습니다. 다음 기수는 추후 공지됩니다.',
      lateConfirm: '지금은 새벽(4시 이전은 전날로 계산)이라 1일차가 몇 시간밖에 남지 않습니다.\n그래도 시작할까요?',
      insufficient: '미리가 800 부족합니다. miyang.cn에서 충전할까요?',
      claimFail: { task_not_done: '오늘 미션을 먼저 완료하세요', already_claimed: '오늘은 이미 받았어요', expired: '학습 플랜이 종료되었습니다', disqualified: '플랜 자격이 취소되었습니다', upstream: '네트워크 오류, 잠시 후 다시 시도' },
      phoneTitle: '한 단계 남았어요: 휴대폰 인증',
      phoneBody: '이 플랜은 실제 미리를 지급하므로 <strong>휴대폰 번호가 인증된</strong> 계정만 참여할 수 있습니다. 현재 이메일 로그인 상태입니다. 미양 프로필에서 휴대폰 번호를 등록한 뒤 참여해 주세요.',
      phoneCta: '휴대폰 번호 등록',
      phoneLater: '나중에 할게요',
      entryDq: '자격 취소됨', sDq: '취소',
      dqTitle: '플랜 자격이 취소되었습니다',
      dqBody: '확인 결과 어뷰징 행위가 있어 자격이 취소되었습니다. 투입한 미리는 반환되지 않으며, 이미 받은 보조금은 그대로 유지됩니다.<br>오판이라고 생각되면 커뮤니티 그룹에서 뤄샤오산에게 이의를 제기해 주세요.',
      dqWhy: '판정 근거',
      dqAppeal: '이의 신청',
      settleFull: '개근 달성!',
      settleEnd: '학습 플랜 종료',
      settleTotalUnit: '미리 지급 완료',
      settleNote: '미리는 미양 공용 잔액으로 산하 모든 앱에서 쓰이고, Cherry Studio 같은 클라이언트에서 Alice 모델을 호출할 때도 쓸 수 있어요',
      settleCta: '계속 학습하기',
      claimSuccess: '수령 성공!',
      claimSuccessSub: '축하합니다! 획득 완료:',
      claimSuccessCta: '기쁘게 받기',
      unitName: '미리',
      bonusClaimed: '개근 보너스',
    },
  };
  var T = I18N[LANG];

  /* ────────────── 常量与状态 ────────────── */

  var ASSET = 'assets/challenge/';
  var COIN = ASSET + 'milli-coin-192.png';
  var GIFT = ASSET + 'challenge-gift-box.png';

  // Lucide 图标（本地内联 path，不依赖 CDN）
  var ICONS = {
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'hand-coins': '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
    'calendar-x': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
    'sunrise': '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
    'wallet': '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    'shield-alert': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };
  /* width/height 必须显式给：内联 SVG 缺尺寸时按默认 300×150 撑开，
     会把奖励格挤变形（CSS 里另有一道兜底，两处都保留）。 */
  function icon(name, cls, size) {
    var s = size || 16;
    return '<svg class="' + (cls || '') + '" width="' + s + '" height="' + s + '" ' +
      'viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }

  var view = null;        // /auth/challenge 最近一次返回
  var loggedIn = false;
  var gated = false;      // 灰度名单外（含灰度期的匿名访客）：入口整个不渲染
  var enrollClosed = false; // 报名窗口已关：没报过名的人不再渲染入口
  var entry = null;
  var overlay = null;
  var countdownTimer = null;
  var floatMQ = window.matchMedia('(max-width: 640px)');
  var footObserver = null;
  var aliceWatch = null;  // Alice 球是异步露出的，换课时 iframe 还会整个重载，只能轮询

  function log() {
    try { console.log.apply(console, ['[challenge]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  /* ────────────── API ────────────── */

  function api(path, method) {
    log('request', method || 'GET', path);
    return fetch(path, {
      method: method || 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        log('response', path, r.status, data);
        return { status: r.status, data: data };
      });
    }).catch(function (err) {
      log('network error', path, err);
      throw err;
    });
  }

  /* ────────────── 入口（宽屏在顶栏，窄屏右下角悬浮） ────────────── */

  function ensureEntry() {
    if (entry) return entry;
    entry = document.createElement('button');
    entry.type = 'button';
    entry.className = 'ch-entry';
    entry.addEventListener('click', openOverlay);
    mountEntry();
    return entry;
  }

  /* 窄屏把入口迁到 body 做右下角悬浮：顶栏在 390px 视口下内容宽 685px，
     入口留在里面会被挤出屏幕外，而文档没有横向滚动，用户根本滚不到。
     只改样式不迁节点也不行——顶栏 z-index: 100 自成层叠上下文，悬浮球无法独立排序，
     将来顶栏一加 filter / transform 就会变成包含块，fixed 定位当场错位。 */
  function mountEntry() {
    if (!entry) return;
    var floating = floatMQ.matches;
    var target = floating ? document.body : slot.parentNode;
    /* 顶栏里排在「交流群」左边（2026-08-16 用户要求）：伴学是每天要看一眼的东西，
       交流群是一次性动作，越靠右越接近账号那一档。群按钮不在时退回账号槽之前。 */
    var before = floating ? null :
      (target.querySelector('.xa-group') || slot);
    if (entry.parentNode !== target || (before && entry.nextElementSibling !== before)) {
      if (floating) target.appendChild(entry);
      else target.insertBefore(entry, before);
    }
    entry.classList.toggle('ch-entry--float', floating);
    if (floating) {
      syncFootGap();
      // 每次量的只是两个 getBoundingClientRect，2.5 秒一次可以忽略不计
      if (!aliceWatch) aliceWatch = setInterval(syncFootGap, 2500);
    } else if (aliceWatch) {
      clearInterval(aliceWatch);
      aliceWatch = null;
    }
  }

  /* learn 页是固定视口布局（文档本身不滚动，内容区内部滚），底部那条
     「上一节 / 学会了 / 下一节」常驻屏幕最下方，悬浮球必须落在它上面，
     否则正好压住右侧的「下一节」。栏高随断点变，按实测值写进 CSS 变量而不写死。 */
  function syncFootGap() {
    var foot = document.querySelector('.lesson-foot');
    var gap = 0;
    if (foot) {
      var r = foot.getBoundingClientRect();
      if (r.height > 0 && r.top < window.innerHeight) gap = Math.round(r.height);
    }
    document.documentElement.style.setProperty('--ch-foot-gap', gap + 'px');
    document.documentElement.style.setProperty('--ch-alice-gap', aliceGap(gap) + 'px');
    if (!footObserver && window.ResizeObserver && foot) {
      footObserver = new ResizeObserver(syncFootGap);
      footObserver.observe(foot);
    }
  }

  /* Alice 头像球（#alice-fab）跑在课件 iframe 里（nav-inject.js 给每节课注入
     ask-alice.js），fixed 在 iframe 右下角——落到整屏上正好和本悬浮球同一个位置，
     手机上两个叠成一团。iframe 同源，直接伸进去量：fab 已过灰度且可见时，
     算出把悬浮球抬到它上方 8px 需要的额外高度。 */
  function aliceGap(footGap) {
    try {
      var frame = document.getElementById('lessonFrame');
      var fab = frame && frame.contentDocument &&
        frame.contentDocument.getElementById('alice-fab');
      if (!fab || fab.classList.contains('hidden')) return 0;
      var fr = fab.getBoundingClientRect();
      if (fr.height <= 0) return 0;
      var fabTopInViewport = frame.getBoundingClientRect().top + fr.top;
      var needBottom = window.innerHeight - fabTopInViewport + 8;
      return Math.max(0, Math.round(needBottom - 12 - footGap));
    } catch (e) { return 0; }
  }

  /* 顶栏空间在窄屏很紧张：长短两版都渲染出来，由 challenge.css 的断点决定显示哪版。
     只渲染一版的话要监听 resize，得不偿失。
     「伴学」两个字常驻在最前面（2026-08-16 用户反馈：只有一枚金币，认不出点开是什么）；
     报名 CTA 的短文案本身就是「伴学」，那一处传 false 免得重复成「伴学 伴学」。 */
  function entryTxt(full, brief, withName) {
    var name = withName === false ? '' :
      '<span class="ch-entry-name">' + T.entryName + '</span>';
    return name +
      '<span class="ch-entry-txt">' + full + '</span>' +
      '<span class="ch-entry-txt-s">' + brief + '</span>';
  }

  /* 「战报看过了没」。按 day1_date 存，下一轮报名换了日期，红点自然重新亮起来；
     纯本地状态，服务端没有必要为一颗点多存一个字段。localStorage 不可用
     （无痕、被禁）时一律当作没看过——宁可多亮一次，也别把战报藏了。 */
  var REPORT_SEEN_KEY = 'xueai_challenge_report_seen';

  function reportRunId() {
    return (view && view.day1_date) || '';
  }

  function reportSeen() {
    var id = reportRunId();
    if (!id) return false;
    try { return localStorage.getItem(REPORT_SEEN_KEY) === id; } catch (e) { return false; }
  }

  function markReportSeen() {
    var id = reportRunId();
    if (!id) return;
    try { localStorage.setItem(REPORT_SEEN_KEY, id); } catch (e) {}
  }

  /* 隐藏走 class 不走 inline style：壳页顶栏把控件统一成 36px 图标时
     用了 display:inline-flex !important，inline 的 display:none 压不过它。 */
  function hideEntry(el) {
    el.classList.add('ch-entry--off');
    el.style.display = 'none';
  }

  function renderEntry() {
    var el = ensureEntry();
    // 灰度名单外：整个入口不出现。看得见却参加不了比没看见更糟
    if (gated) { hideEntry(el); return; }
    /* 展示窗口过了（Day7 + 2 起，由服务端的 entry_open 说）：不论什么状态，
       入口整个消失。战报只在刚结束那天还有人想翻，资格取消的交代同理，
       再往后留着就只是一个点开看旧账的按钮。 */
    if (view && view.entry_open === false) { hideEntry(el); return; }
    el.style.display = '';
    el.className = 'ch-entry';
    mountEntry();   // 补回被上一行整句重置擦掉的 ch-entry--float
    var coin = '<img class="ch-coin" src="' + COIN + '" alt="">';
    if (!loggedIn || !view || view.state === 'none') {
      // 报名窗口关了：没报过名的人（含匿名）不再种草；已报名的走下面的分支不受影响
      if (enrollClosed) { hideEntry(el); return; }
      el.classList.add('ch-entry--cta');
      el.title = T.entryCta;
      el.innerHTML = coin + entryTxt(T.entryCta, T.sCta, false);
      return;
    }
    if (view.state === 'disqualified') {
      // 窗口内不静默消失：用户得知道资格没了、为什么没了，入口点开有完整交代
      el.classList.add('ch-entry--done');
      el.title = T.entryDq;
      el.innerHTML = coin + entryTxt(T.entryDq, T.sDq);
      return;
    }
    if (view.state === 'settled') {
      /* 看过一次就永久藏起来太急：计划刚结束那天还得能翻回战报（收窗时机见上面 entry_open）。
         但也不能一直催——原先这里套的是 --claimable，连脉冲带红点，
         学满七天、无事可领之后那颗点还亮着不走（吐槽 #41）。
         现在红点只表示战报还没翻过，翻过就摘掉。 */
      el.classList.add('ch-entry--report');
      if (!reportSeen()) el.classList.add('ch-entry--unread');
      el.title = T.entryReport;
      el.innerHTML = coin + entryTxt(T.entryReport, T.sReport);
      return;
    }
    var today = view.today || {};
    var dn = view.day_no;
    if (today.status === 'claimable') {
      el.classList.add('ch-entry--claimable');
      el.title = T.entryClaim(today.amount);
      el.innerHTML = coin + entryTxt(T.entryClaim(today.amount), T.sClaim(today.amount));
    } else if (today.status === 'claimed') {
      el.classList.add('ch-entry--done');
      el.title = T.entryDone(dn);
      el.innerHTML = coin + entryTxt(T.entryDone(dn), T.sDone(dn));
    } else {
      el.classList.add('ch-entry--progress');
      el.title = T.entryDay(dn, today.count, today.quota);
      el.innerHTML = coin + entryTxt(T.entryDay(dn, today.count, today.quota), T.sDay(dn, today.count, today.quota));
    }
  }

  /* ────────────── 弹层骨架 ────────────── */

  function closeOverlay() {
    if (overlay) { overlay.remove(); overlay = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }

  function showOverlay(inner, preventAutoClose) {
    closeOverlay();
    overlay = document.createElement('div');
    overlay.className = 'ch-overlay';
    /* 关闭键挂在与内容同级的包装层上，不能塞进 inner：说明卡是 overflow:auto，
       按钮定位在卡片外沿会被裁成半个，还会把卡片撑出一条横向滚动条。 */
    var modal = document.createElement('div');
    modal.className = 'ch-modal';
    modal.appendChild(inner);
    if (!preventAutoClose) {
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'ch-close';
      close.innerHTML = icon('x');
      close.addEventListener('click', closeOverlay);
      modal.appendChild(close);
    }
    overlay.appendChild(modal);
    if (!preventAutoClose) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target === modal) closeOverlay();
      });
    }
    document.body.appendChild(overlay);
  }

  function renderOverlay() {
    if (!loggedIn || !view || view.state === 'none') { showIntro(); return; }
    if (view.state === 'disqualified') { showDisqualified(); return; }
    if (view.state === 'settled') {
      // 战报翻开了，顶栏那颗红点就该摘掉——它的含义就是「这个你还没看」
      markReportSeen();
      renderEntry();
      showSettle();
      return;
    }
    showBoard();
  }

  /* ────────────── 资格取消卡 ────────────── */

  /* 判定依据要给到本人：他自己的行为记录他本来就清楚，说不清楚才显得武断，
     也没法申诉。reason 是后台自由输入的文本，只能用 textContent 填。
     manual / fast_marking 是没填原因时的内部占位值，摆出来反而更费解。 */
  function dqWhyText() {
    var why = (view && view.disqualified_reason) || '';
    return (why === 'manual' || why === 'fast_marking') ? '' : why;
  }

  function showDisqualified() {
    var why = dqWhyText();
    var card = document.createElement('div');
    card.className = 'ch-card';
    card.innerHTML =
      '<h3>' + T.dqTitle + '</h3>' +
      '<ul class="ch-rules">' +
        '<li class="ch-rule--warn">' + icon('shield-alert') +
          '<span>' + T.dqBody +
          (why ? '<br><br><b>' + T.dqWhy + '</b><br><span id="chDqWhy"></span>' : '') +
          '</span></li>' +
      '</ul>' +
      '<div class="ch-btn-row">' +
        '<button type="button" class="ch-cta ch-cta--ghost" id="chDqAppealBtn">' + T.dqAppeal + '</button>' +
        '<button type="button" class="ch-cta" id="chDqBtn">' + T.settleCta + '</button>' +
      '</div>';
    showOverlay(card);
    if (why) card.querySelector('#chDqWhy').textContent = why;
    card.querySelector('#chDqBtn').addEventListener('click', closeOverlay);
    // 申诉走人不走客服：弹交流群/公众号二维码（auth.js 的现成模态框），进群找洛小山
    card.querySelector('#chDqAppealBtn').addEventListener('click', function () {
      closeOverlay();
      if (window.XueaiAuth && window.XueaiAuth.openGroupModal) {
        window.XueaiAuth.openGroupModal();
      }
    });
  }

  /* view 是上一次拉取的快照，可能落后于刚标记的已学（进度 POST 有防抖）。
     先用快照把面板打开保证响应，再补拉一次，数据变了就重绘。 */
  function openOverlay() {
    renderOverlay();
    var sig = viewSig();
    refresh().then(function () {
      if (!overlay || viewSig() === sig) return;
      // 领取动效和成功卡都不能被后台刷新打断——成功卡必须由用户自己收下
      if (overlay.querySelector('.ch-cell.is-just-claimed, .ch-card--success')) return;
      renderOverlay();
    });
  }

  function viewSig() {
    if (!view) return 'none';
    var t = view.today || {};
    return [view.state, view.day_no, t.status, t.count, t.quota,
            view.claimed_total].join('|');
  }

  /* ────────────── 回本线（曲线的核心心理锚点） ────────────── */

  /* 回本日不写死 Day 4：按奖励曲线累加，取累计首次追平本金的那天。
     金额表以后调整（比如前几天调低），角标和注解会自己迁移到新的回本日。 */
  function paybackAt(rewards, cost) {
    var acc = 0;
    for (var i = 0; i < rewards.length; i++) {
      acc += rewards[i];
      if (acc >= cost) return { day: i + 1, acc: acc };
    }
    return null;
  }

  function paybackOf(v) {
    var rewards = (v && v.rewards) || [];
    var cost = (v && v.enroll_cost) || 0;
    return (rewards.length && cost) ? paybackAt(rewards, cost) : null;
  }

  /* ────────────── 活动说明卡（报名前 / 未登录） ────────────── */

  function ladderHtml(rewards, bonus, pbDay) {
    var max = bonus;
    var html = '<div class="ch-ladder">';
    rewards.forEach(function (amt, i) {
      html += '<div class="ch-bar' + (i + 1 === pbDay ? ' ch-bar--payback' : '') + '">' +
        '<b>' + amt + '</b>' +
        '<i style="height:' + Math.round(amt / max * 100) + '%"></i>' +
        '<span>D' + (i + 1) + '</span></div>';
    });
    html += '<div class="ch-bar ch-bar--bonus"><b>+' + bonus + '</b>' +
      '<i style="height:100%"></i><span>' + T.ladderBonus + '</span></div>';
    return html + '</div>';
  }

  function showIntro() {
    var v = view || {};
    var rewards = v.rewards || [150, 200, 250, 300, 350, 400, 450];
    var bonus = v.bonus || 700;
    var card = document.createElement('div');
    card.className = 'ch-card';
    /* 反作弊条走冷静的中性色：混进上面几条红色高亮里会被当成卖点，
       而且警告说得越平静越像真会执行 */
    var rulesHtml = T.rules.map(function (r) {
      var cls = r[0] === 'shield-alert' ? ' class="ch-rule--warn"' : '';
      return '<li' + cls + '>' + icon(r[0]) + '<span>' + r[1] + '</span></li>';
    }).join('');
    /* 报名前就把回本日说清楚：用户掏 800 之前最想知道的是「要撑几天才不亏」 */
    var pb = paybackAt(rewards, v.enroll_cost || 800);
    card.innerHTML =
      '<h3>' + T.title + '</h3>' +
      '<div class="ch-card-sub">' + T.introSub + '</div>' +
      ladderHtml(rewards, bonus, pb && pb.day) +
      (pb ? '<div class="ch-payback-note">' + icon('trending-up') +
        '<span>' + T.paybackNote(pb.day, pb.acc) + '</span></div>' : '') +
      '<ul class="ch-rules">' + rulesHtml + '</ul>' +
      '<button type="button" class="ch-cta" id="chEnrollBtn">' +
      '<img src="' + COIN + '" alt="">' +
      (loggedIn ? T.enrollCta : T.loginCta) + '</button>' +
      '<div class="ch-note">' + T.enrollNote + deadlineNote() + '</div>';
    showOverlay(card);
    card.querySelector('#chEnrollBtn').addEventListener('click', onEnrollClick);
  }

  /* 截止日跟着后端的 enroll_last_day 走（"2026-08-31"），改期限只动服务端 */
  function deadlineNote() {
    var d = view && view.enroll_last_day;
    if (!d || !T.enrollDeadline) return '';
    var parts = d.split('-');
    return '<br><strong>' + T.enrollDeadline(+parts[1], +parts[2]) + '</strong>';
  }

  function onEnrollClick() {
    if (!loggedIn) {
      location.href = '/auth/login?next=' + encodeURIComponent(location.pathname + location.hash);
      return;
    }
    // 凌晨 0-4 点报名：Day1 只剩几小时，二次确认（UTC+8 判定）
    var hourUtc8 = new Date(Date.now() + 8 * 3600e3).getUTCHours();
    if (hourUtc8 < 4 && !confirm(T.lateConfirm)) return;

    var btn = overlay && overlay.querySelector('#chEnrollBtn');
    if (btn) btn.disabled = true;
    api('/auth/challenge/enroll', 'POST').then(function (res) {
      if (res.status === 402) {
        if (confirm(T.insufficient)) location.href = '/auth/handoff?target=recharge';
        if (btn) btn.disabled = false;
        return;
      }
      // 纯邮箱账号（没绑手机号）：入口照常可见，报名这一步才拦，
      // 专门的提示卡讲清原因并给「去绑定」的路
      if (res.data && res.data.error === 'phone_required') {
        showPhoneRequired();
        return;
      }
      // 报名窗口在打开弹层后恰好关闭（跨过凌晨 4 点切日）的边缘情况
      if (res.data && res.data.error === 'enrollment_closed') {
        alert(T.enrollClosedMsg);
        closeOverlay();
        enrollClosed = true;
        renderEntry();
        return;
      }
      if (!res.data.ok) {
        log('enroll failed', res);
        if (btn) btn.disabled = false;
        return;
      }
      view = res.data;
      renderEntry();
      showBoard();
    }).catch(function () { if (btn) btn.disabled = false; });
  }

  /* ────────────── 手机号门槛卡（纯邮箱账号报名被拒） ────────────── */

  function showPhoneRequired() {
    var card = document.createElement('div');
    card.className = 'ch-card';
    card.innerHTML =
      '<h3>' + T.phoneTitle + '</h3>' +
      '<ul class="ch-rules">' +
        '<li class="ch-rule--warn">' + icon('shield-alert') +
          '<span>' + T.phoneBody + '</span></li>' +
      '</ul>' +
      '<div class="ch-btn-row">' +
        '<button type="button" class="ch-cta ch-cta--ghost" id="chPhoneLaterBtn">' + T.phoneLater + '</button>' +
        '<button type="button" class="ch-cta" id="chPhoneBindBtn">' + T.phoneCta + '</button>' +
      '</div>';
    showOverlay(card);
    card.querySelector('#chPhoneBindBtn').addEventListener('click', function () {
      // handoff 用站内会话续接米羊登录态，落在个人中心的绑定手机号入口
      location.href = '/auth/handoff?target=profile';
    });
    card.querySelector('#chPhoneLaterBtn').addEventListener('click', closeOverlay);
  }

  /* ────────────── 游戏面板（进行中） ────────────── */

  function cellHtml(d) {
    var cls = 'ch-cell ch-cell--d' + d.day + (d.day === 7 ? ' ch-cell--final' : '');
    var status = d.status; // locked / active / claimable / claimed / missed
    cls += ' is-' + status;
    /* 每格都摆礼盒：七个待拆的盒子才是「游戏关卡」的观感，只在可领取那一刻
       才出现礼盒的话，平时整面板就是一排锁，既冷清也撑不满格子。
       未解锁/已错过靠 CSS 去饱和表达「还没到手」，不换图。 */
    var gift = '<img class="ch-cell-icon" src="' + GIFT + '" alt="">';
    var amount = '<div class="ch-cell-amount"><img src="' + COIN + '" alt="">' + d.amount + '</div>';
    var inner = '<div class="ch-cell-day">' + T.day(d.day) + '</div>' + gift + amount;
    if (status === 'claimable') {
      inner += '<div class="ch-cell-status">' + T.claimTip + '</div>';
    } else if (status === 'claimed') {
      inner = '<span class="ch-cell-check">' + icon('check') + '</span>' + inner +
        '<div class="ch-cell-status">' + T.claimedTip + '</div>';
    } else if (status === 'missed') {
      inner += '<div class="ch-cell-status">' + icon('x') + T.missedTip + '</div>';
    } else if (status === 'active') {
      inner += '<div class="ch-cell-status">' + T.activeTip(d.count, d.quota) + '</div>';
    } else {
      inner += '<div class="ch-cell-status">' + T.lockedTip + '</div>';
    }
    if (d.day === 7) inner += '<span class="ch-cell-bonus">' + T.bonusBadge + '</span>';
    /* 回本格挂角标：这一格是「不亏」的分界线，第 3～4 天正是流失最凶的位置，
       让用户一眼看到再撑一天本金就回来了。配色与全勤金标错开，不抢权重。 */
    var pb = paybackOf(view);
    if (pb && d.day === pb.day) {
      cls += ' ch-cell--payback';
      inner += '<span class="ch-cell-payback">' + T.paybackBadge + '</span>';
    }
    return '<div class="' + cls + '" data-day="' + d.day + '">' + inner + '</div>';
  }

  function countdownText() {
    if (!view || !view.deadline_ts) return '';
    var left = Math.max(0, view.deadline_ts * 1000 - Date.now());
    var h = Math.floor(left / 3600e3);
    var m = Math.floor(left % 3600e3 / 60e3);
    return T.countdown(h, m);
  }

  /* 缎带标题：文字沿底图缎带排版。逐列扫缎带上下两条暗轮廓线（主体米白 g>=205，
     轮廓 g<205）得到中轴：主体是 x 460~790、中心 625、中轴 104.5→75.8→105.5。
     再往外厚度就从 100 掉到 69——那已经是蓝色燕尾和斜向下垂的尾段，文字排到那里
     会既偏右又贴着下沿（上一版排到 x=856 就是这个毛病）。
     拱高取缎带实际拱高（29）的一半 15：完全贴合会让首尾两字倾斜 19°，压到 15 后
     只剩 11°，而端部文字中心也才比缎带中轴高 11px，缎带端部厚 107 完全兜得住。
     中轴下移 0.36em（中文字号 46 约 16.6px）再补 4px 视觉修正作为基线——
     汉字字形只占 0.86em，纯按几何中心算会显得偏上。
     一页可能同时存在多块面板，path 的 id 必须唯一，否则 textPath 会全指向第一条。 */
  var titleSeq = 0;

  /* titleDy：上面那条基线是按汉字（字形中心在基线上方 0.36em）定的，拉丁字母的
     视觉中心更靠近基线，同一条路径下英文实测偏下 7.8px，需要整体上提。
     偏移必须做进路径的 y 值——<textPath> 上的 dy 属性 Chrome 直接忽略。 */
  function ribbonPath() {
    var d = T.titleDy || 0;
    return 'M 472 ' + (111.4 + d) + ' Q 625 ' + (81.4 + d) + ' 779 ' + (111.4 + d);
  }

  function arcText(id, cls) {
    return '<text class="' + cls + '" style="font-size:' + T.titleSize + 'px">' +
      '<textPath href="#' + id + '" startOffset="50%" text-anchor="middle">' +
      T.title + '</textPath></text>';
  }

  function titleHtml() {
    var id = 'chRibbon' + (++titleSeq);
    return '<div class="ch-title">' +
      '<svg class="ch-title-arc" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><path id="' + id + '" d="' + ribbonPath() + '" fill="none"/></defs>' +
      arcText(id, 'ch-t-out') + arcText(id, 'ch-t-in') +
      '</svg>' +
      '<span class="ch-title-flat">' + T.title + '</span></div>';
  }

  /* 累计条上钉一枚本金刻度：领取过程中始终看得见自己离「不亏」还有多远，
     跨过之后刻度与文案一起转成已回本态。刻度线画在条内（条是 overflow:hidden），
     文字标签只能挂在条外层，否则会被裁掉。 */
  function totalBarHtml(got) {
    var cost = view.enroll_cost || 0;
    var max = view.total_max || 0;
    var pct = max ? Math.round(got / max * 100) : 0;
    var paid = cost > 0 && got >= cost;
    var tick = (cost > 0 && max) ? (cost / max * 100).toFixed(1) : null;
    return '<div class="ch-total' + (paid ? ' is-paid-back' : '') + '">' +
      '<div class="ch-total-bar"><i style="width:' + pct + '%"></i>' +
      '<span>' + (paid ? T.totalBarDone(got, max) : T.totalBar(got, max)) + '</span>' +
      (tick ? '<em class="ch-total-tick" style="left:' + tick + '%"></em>' : '') +
      '</div>' +
      (tick ? '<em class="ch-total-mark" style="left:' + tick + '%">' +
        T.paybackTick + '</em>' : '') +
      '</div>';
  }

  function showBoard() {
    var board = document.createElement('div');
    board.className = 'ch-board';
    var cells = (view.days || []).map(cellHtml).join('');
    var got = view.claimed_total || 0;
    var pct = Math.round(got / view.total_max * 100);
    board.innerHTML =
      titleHtml() +
      '<div class="ch-grid">' + cells + '</div>' +
      '<div class="ch-meta">' +
      '<div class="ch-countdown" id="chCountdown">' + countdownText() + '</div>' +
      totalBarHtml(got) +
      '</div>';
    showOverlay(board);

    board.querySelectorAll('.ch-cell.is-claimable').forEach(function (cell) {
      cell.addEventListener('click', function () { onClaimClick(cell); });
    });
    countdownTimer = setInterval(function () {
      var el = document.getElementById('chCountdown');
      if (el) el.textContent = countdownText();
    }, 30e3);
  }

  function onClaimClick(cell) {
    cell.style.pointerEvents = 'none';
    var before = view.claimed_total || 0;
    var cost = view.enroll_cost || 0;
    api('/auth/challenge/claim', 'POST').then(function (res) {
      if (!res.data.ok) {
        var msg = T.claimFail[res.data.error] || T.claimFail.upstream;
        var cd = document.getElementById('chCountdown');
        if (cd) { cd.innerHTML = '<strong>' + msg + '</strong>'; }
        cell.style.pointerEvents = '';
        // 状态可能已被服务端纠正（如已过期），带回视图就同步
        if (res.data.days) { view = res.data; renderEntry(); }
        return;
      }
      var amount = res.data.amount || 0;
      var bonus = res.data.bonus_amount || 0;
      view = res.data;
      log('claimed', amount, 'bonus', bonus);
      cell.classList.remove('is-claimable');
      cell.classList.add('is-just-claimed');
      // 累计跨过本金线的那一次给个即时反馈，这是整条曲线上最值得庆祝的节点
      var justPaidBack = cost > 0 && before < cost && (view.claimed_total || 0) >= cost;
      flyCoins(cell, amount >= 400 ? 8 : 5, function () {
        renderEntry();   // 金币落进顶栏的那一刻入口就该是新数字
        showSuccess(amount, bonus, justPaidBack);
      });
    }).catch(function () { cell.style.pointerEvents = ''; });
  }

  /* 米粒金币从格子飞向顶栏入口 */
  function flyCoins(fromEl, n, done) {
    var from = fromEl.getBoundingClientRect();
    var target = entry ? entry.getBoundingClientRect() : { left: innerWidth - 60, top: 10, width: 30, height: 30 };
    var finished = 0;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var img = document.createElement('img');
        img.src = COIN;
        img.className = 'ch-fx-coin';
        var sx = from.left + from.width / 2 - 13 + (Math.random() * 40 - 20);
        var sy = from.top + from.height / 2 - 13 + (Math.random() * 30 - 15);
        img.style.transform = 'translate(' + sx + 'px,' + sy + 'px) scale(1)';
        img.style.opacity = '1';
        document.body.appendChild(img);
        var tx = target.left + target.width / 2 - 13;
        var ty = target.top + target.height / 2 - 13;
        setTimeout(function () {
          img.style.transition = 'transform 0.7s cubic-bezier(.35,-0.2,.65,1), opacity 0.7s ease';
          img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(0.35)';
          img.style.opacity = '0.1';
        }, 60 + i * 70);
        setTimeout(function () {
          img.remove();
          if (++finished === n && done) done();
        }, 900 + i * 70);
      })(i);
    }
  }

  /* ────────────── 领取成功弹窗 ────────────── */

  function showSuccess(amount, bonus, justPaidBack) {
    var card = document.createElement('div');
    card.className = 'ch-card ch-card--success';

    var confetti = '';
    var colors = ['#eab545', '#e8795a', '#44609f', '#8fbf6a', '#f2c9a0'];
    for (var i = 0; i < 30; i++) {
      confetti += '<i style="left:' + (Math.random() * 96 + 2) + '%;' +
        'background:' + colors[i % colors.length] + ';' +
        'animation-delay:' + (Math.random() * 1.5).toFixed(2) + 's;' +
        'animation-duration:' + (1.8 + Math.random() * 1.2).toFixed(2) + 's"></i>';
    }
    var confettiHtml = '<div class="ch-confetti">' + confetti + '</div>';

    var totalAmount = amount + bonus;

    var bonusHtml = '';
    if (bonus > 0) {
      bonusHtml = '<div class="ch-success-bonus-badge">' + T.bonusClaimed + ' +' + bonus + '</div>';
    }

    var paybackHtml = '';
    if (justPaidBack) {
      paybackHtml = '<div class="ch-success-payback-badge">' + T.paybackHit + '</div>';
    }

    card.innerHTML =
      confettiHtml +
      '<h3>' + T.claimSuccess + '</h3>' +
      '<div class="ch-success-sub">' + T.claimSuccessSub + '</div>' +
      '<div class="ch-success-hero-wrapper">' +
        '<div class="ch-success-light-ray"></div>' +
        '<img class="ch-success-hero-coin" src="' + COIN + '" alt="">' +
      '</div>' +
      '<div class="ch-success-total">' +
        '<b>+' + totalAmount + '</b><span>' + T.unitName + '</span>' +
      '</div>' +
      bonusHtml +
      paybackHtml +
      '<button type="button" class="ch-cta ch-cta--gold ch-success-cta-btn" id="chSuccessCtaBtn">' + T.claimSuccessCta + '</button>' +
      '<div class="ch-note">' + T.settleNote + '</div>';

    showOverlay(card, true);

    card.querySelector('#chSuccessCtaBtn').addEventListener('click', function () {
      if (view.state === 'settled') {
        showSettle();
      } else {
        showBoard();
      }
    });
  }

  /* ────────────── 结算卡 ────────────── */

  function showSettle() {
    var full = view.full_attendance && view.bonus_claimed;
    var card = document.createElement('div');
    card.className = 'ch-card';
    var daysHtml = (view.days || []).map(function (d) {
      var ok = d.status === 'claimed';
      return '<i class="' + (ok ? '' : 'miss') + '">' + (ok ? '✓' : '✗') + '</i>';
    }).join('');
    var confetti = '';
    if (full) {
      var colors = ['#eab545', '#e8795a', '#44609f', '#8fbf6a', '#f2c9a0'];
      for (var i = 0; i < 26; i++) {
        confetti += '<i style="left:' + (Math.random() * 96 + 2) + '%;' +
          'background:' + colors[i % colors.length] + ';' +
          'animation-delay:' + (Math.random() * 2.4).toFixed(2) + 's;' +
          'animation-duration:' + (2.2 + Math.random() * 1.6).toFixed(2) + 's"></i>';
      }
      confetti = '<div class="ch-confetti">' + confetti + '</div>';
    }
    card.innerHTML =
      confetti +
      '<h3>' + (full ? T.settleFull : T.settleEnd) + '</h3>' +
      '<div class="ch-settle-hero"><img src="' + GIFT + '" alt=""></div>' +
      '<div class="ch-settle-total"><img src="' + COIN + '" width="30" height="30" alt="">' +
      '<b>' + (view.claimed_total || 0) + '</b><span>' + T.settleTotalUnit + '</span></div>' +
      '<div class="ch-settle-days">' + daysHtml + '</div>' +
      '<button type="button" class="ch-cta ch-cta--gold" id="chSettleBtn">' + T.settleCta + '</button>' +
      '<div class="ch-note">' + T.settleNote + '</div>';
    showOverlay(card);
    card.querySelector('#chSettleBtn').addEventListener('click', function () {
      closeOverlay();
      renderEntry();
    });
  }

  /* ────────────── 启动 ────────────── */

  function refresh() {
    return api('/auth/challenge').then(function (res) {
      loggedIn = res.status !== 401;
      // 403 = 已登录但不在名单；401 带 gated = 灰度期的匿名访客
      gated = res.status === 403 || !!(res.data && res.data.gated);
      enrollClosed = !!(res.data && res.data.enroll_open === false);
      view = res.status === 200 ? res.data : null;
      renderEntry();
    }).catch(function () { /* 顶栏入口保持缺省 CTA */ renderEntry(); });
  }

  /* 标记与撤销都收在底部这一颗「学会了！」上（#learnedBtn，内含 span，
     只比对 e.target.id 会漏）。顶栏那个 #markDone 撤销图标已于 2026-08-17 撤除。
     两种操作都改进度，改完 learn.html 延迟 1.5s 才 POST，刷新必须排在防抖之后。 */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('#learnedBtn')) {
      setTimeout(refresh, 2200);
    }
  });

  // 旋屏 / 缩放跨过断点时把入口挪到该去的地方
  if (floatMQ.addEventListener) floatMQ.addEventListener('change', mountEntry);
  else if (floatMQ.addListener) floatMQ.addListener(mountEntry);   // Safari < 14

  refresh();
})();
