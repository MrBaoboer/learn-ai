/* challenge-playground.js — PlayGround 的 demo 数据与渲染。
   组件类名与实装 challenge.js 完全一致，样式改动直接在这里可视化验证。 */
(function () {
  'use strict';

  var ASSET = '../assets/challenge/';
  var COIN = ASSET + 'milli-coin-192.png';
  var GIFT = ASSET + 'challenge-gift-box.png';
  var REWARDS = [150, 200, 250, 300, 350, 400, 450];
  var BONUS = 700;
  var TOTAL_MAX = 2800;
  var ENROLL = 800;

  /* 回本日与实装同构：累计首次追平本金的那天，不写死 Day 4 */
  var PAYBACK = (function () {
    var acc = 0;
    for (var i = 0; i < REWARDS.length; i++) {
      acc += REWARDS[i];
      if (acc >= ENROLL) return { day: i + 1, acc: acc };
    }
    return null;
  })();

  var ICONS = {
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'hand-coins': '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
    'shield-alert': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    'calendar-x': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
    sunrise: '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
    wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" width="16" height="16">' + ICONS[name] + '</svg>';
  }

  /* ─── 与实装同构的格子渲染 ─── */

  function cellHtml(d, extraClass) {
    var cls = 'ch-cell ' + (extraClass || 'ch-cell--d' + d.day) + (d.day === 7 ? ' ch-cell--final' : '') + ' is-' + d.status;
    var gift = '<img class="ch-cell-icon" src="' + GIFT + '" alt="">';
    var amount = '<div class="ch-cell-amount"><img src="' + COIN + '" alt="">' + REWARDS[d.day - 1] + '</div>';
    var inner = '<div class="ch-cell-day">第 ' + d.day + ' 天</div>' + gift + amount;
    if (d.status === 'claimable') {
      inner += '<div class="ch-cell-status">点击领取</div>';
    } else if (d.status === 'claimed') {
      inner = '<span class="ch-cell-check">' + icon('check') + '</span>' + inner +
        '<div class="ch-cell-status">已到账</div>';
    } else if (d.status === 'missed') {
      inner += '<div class="ch-cell-status">' + icon('x') + '已错过</div>';
    } else if (d.status === 'active') {
      inner += '<div class="ch-cell-status">已学 ' + d.count + '/' + d.quota + ' 节</div>';
    } else {
      inner += '<div class="ch-cell-status">待解锁</div>';
    }
    if (d.day === 7) inner += '<span class="ch-cell-bonus">+700 全勤</span>';
    if (PAYBACK && d.day === PAYBACK.day) {
      cls += ' ch-cell--payback';
      inner += '<span class="ch-cell-payback">回本</span>';
    }
    return '<div class="' + cls + '" data-day="' + d.day + '">' + inner + '</div>';
  }

  /* 与实装 challenge.js 的 titleHtml 同构：文字沿缎带拱形排版，id 逐块唯一 */
  var RIBBON_PATH = 'M 472 111.4 Q 625 81.4 779 111.4';
  var titleSeq = 0;

  function arcText(id, cls) {
    return '<text class="' + cls + '" style="font-size:39px">' +
      '<textPath href="#' + id + '" startOffset="50%" text-anchor="middle">' +
      'Alice 伴学计划</textPath></text>';
  }

  function titleHtml() {
    var id = 'pgRibbon' + (++titleSeq);
    return '<div class="ch-title">' +
      '<svg class="ch-title-arc" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><path id="' + id + '" d="' + RIBBON_PATH + '" fill="none"/></defs>' +
      arcText(id, 'ch-t-out') + arcText(id, 'ch-t-in') +
      '</svg>' +
      '<span class="ch-title-flat">Alice 伴学计划</span></div>';
  }

  /* 与实装 totalBarHtml 同构：条内钉本金刻度，标签挂在条外层 */
  function totalBarHtml(claimedTotal) {
    var pct = Math.round(claimedTotal / TOTAL_MAX * 100);
    var paid = claimedTotal >= ENROLL;
    var tick = (ENROLL / TOTAL_MAX * 100).toFixed(1);
    return '<div class="ch-total' + (paid ? ' is-paid-back' : '') + '">' +
      '<div class="ch-total-bar"><i style="width:' + pct + '%"></i>' +
      '<span>' + (paid ? '已回本 · 已领 ' + claimedTotal + ' / 全勤 ' + TOTAL_MAX
        : '已领 ' + claimedTotal + ' / 全勤 ' + TOTAL_MAX + ' 米粒') + '</span>' +
      '<em class="ch-total-tick" style="left:' + tick + '%"></em>' +
      '</div>' +
      '<em class="ch-total-mark" style="left:' + tick + '%">回本</em>' +
      '</div>';
  }

  function boardHtml(days, claimedTotal, countdown) {
    return '<div class="ch-board">' +
      titleHtml() +
      '<div class="ch-grid">' + days.map(function (d) { return cellHtml(d); }).join('') + '</div>' +
      '<div class="ch-meta">' +
      '<div class="ch-countdown">' + countdown + '</div>' +
      totalBarHtml(claimedTotal) +
      '</div></div>';
  }

  function day(no, status, count, quota) {
    return { day: no, status: status, count: count || 0, quota: quota == null ? 5 : quota };
  }

  /* ─── 1. 主对照面板 ─── */

  document.getElementById('demoBoardMain').innerHTML = boardHtml(
    [day(1, 'claimed'), day(2, 'claimed'), day(3, 'claimable', 5),
     day(4, 'locked'), day(5, 'locked'), day(6, 'locked'), day(7, 'locked')],
    350, '今日截止：凌晨 4:00（剩 9 小时 24 分）'
  );

  /* ─── 2. 单格 5 状态 ─── */

  var states = [
    ['未来锁定 is-locked', day(5, 'locked')],
    ['今日进行中 is-active', day(3, 'active', 2)],
    ['可领取 is-claimable', day(3, 'claimable', 5)],
    ['已领取 is-claimed', day(2, 'claimed')],
    ['已作废 is-missed', day(1, 'missed')],
    ['回本格 · 未解锁', day(4, 'locked')],
    ['回本格 · 今日进行中', day(4, 'active', 3)],
  ];
  document.getElementById('demoCells').innerHTML = states.map(function (s) {
    return '<div class="pg-cell-demo">' + cellHtml(s[1], 'ch-cell--demo') +
      '<div class="pg-label">' + s[0] + '</div></div>';
  }).join('');

  /* ─── 2b. 累计条本金刻度（未回本 / 刚回本 / 已远超） ─── */

  document.getElementById('demoTotals').innerHTML = [
    ['未回本（已领 600 < 800）', 600],
    ['刚跨过本金线（已领 900）', 900],
    ['全勤到账（2800）', 2800],
  ].map(function (t) {
    return '<div class="pg-total-demo">' + totalBarHtml(t[1]) +
      '<div class="pg-label">' + t[0] + '</div></div>';
  }).join('');

  /* ─── 3. 入口按钮 ─── */

  var coinImg = '<img class="ch-coin" src="' + COIN + '" alt="">';
  var entries = [
    ['未参加 CTA（呼吸光）', 'ch-entry--cta', coinImg + '<span>伴学计划</span>'],
    ['进行中 · 今日未完成', 'ch-entry--progress', coinImg + '<span>Day 3 · 今日 2/5</span>'],
    ['进行中 · 可领取（金光+红点）', 'ch-entry--claimable', coinImg + '<span>可领 250</span>'],
    ['今日已领 · 静默', 'ch-entry--done', coinImg + '<span>Day 3 ✓</span>'],
    ['已结算 · 战报未看（红点）', 'ch-entry--report ch-entry--unread', coinImg + '<span>伴学战报</span>'],
    ['已结算 · 战报看过（无红点）', 'ch-entry--report', coinImg + '<span>伴学战报</span>'],
  ];
  document.getElementById('demoEntries').innerHTML = entries.map(function (e) {
    return '<div class="pg-entry-demo">' +
      '<button type="button" class="ch-entry ' + e[1] + '">' + e[2] + '</button>' +
      '<div class="pg-label">' + e[0] + '</div></div>';
  }).join('');

  /* ─── 3b. 窄屏悬浮入口（模拟机身，把 fixed 换成 absolute 才能内嵌展示） ─── */

  var floats = [
    ['未参加 CTA', 'ch-entry--cta', coinImg + '<span>伴学计划</span>', 82],
    ['进行中 · 今日未完成', 'ch-entry--progress', coinImg + '<span>D1 2/5</span>', 82],
    ['可领取（金光+红点）', 'ch-entry--claimable', coinImg + '<span>+150</span>', 82],
    ['底栏不在视口 · 贴底', 'ch-entry--progress', coinImg + '<span>D1 2/5</span>', 0],
  ];
  document.getElementById('demoFloats').innerHTML = floats.map(function (e) {
    return '<div class="pg-phone-demo">' +
      '<div class="pg-phone" style="--ch-foot-gap:' + e[3] + 'px">' +
      '<div class="pg-phone-bar">顶栏（放不下入口）</div>' +
      '<button type="button" class="ch-entry ch-entry--float ' + e[1] + '">' + e[2] + '</button>' +
      (e[3] ? '<div class="pg-phone-foot"><span>‹ 上一节</span><span class="pg-phone-cta">✓ 学会了！</span><span>下一节 ›</span></div>' : '') +
      '</div>' +
      '<div class="pg-label">' + e[0] + '</div></div>';
  }).join('');

  /* ─── 4. 活动说明卡 ─── */

  var ladder = '<div class="ch-ladder">' + REWARDS.map(function (amt, i) {
    var pb = PAYBACK && i + 1 === PAYBACK.day ? ' ch-bar--payback' : '';
    return '<div class="ch-bar' + pb + '"><b>' + amt + '</b><i style="height:' +
      Math.round(amt / BONUS * 100) + '%"></i><span>D' + (i + 1) + '</span></div>';
  }).join('') +
    '<div class="ch-bar ch-bar--bonus"><b>+700</b><i style="height:100%"></i><span>全勤奖</span></div></div>';

  var rules = [
    ['book-open', '每天学 <b>5</b> 节课（标记「已学」），当天补贴就解锁'],
    ['hand-coins', '补贴要<strong>当天自己领</strong>，次日凌晨 4 点截止'],
    ['calendar-x', '断一天只作废当天，后面照常领；<strong>7 天全勤再加 700</strong>'],
    ['sunrise', '加入后<strong>今天就是第 1 天</strong>（每天凌晨 4 点刷新）'],
    ['wallet', '米粒是<strong>米羊通用余额</strong>，旗下各应用通用；也能在 Cherry Studio 等客户端里调用 Alice 的模型'],
    ['shield-alert', '为维护公平诚信的学习氛围，请保持真实学习。系统若检测到恶意刷课、多账号等作弊行为，将终止计划并限制账号。'],
  ].map(function (r) {
    var cls = r[0] === 'shield-alert' ? ' class="ch-rule--warn"' : '';
    return '<li' + cls + '>' + icon(r[0]) + '<span>' + r[1] + '</span></li>';
  }).join('');

  document.getElementById('demoIntro').innerHTML =
    '<div class="ch-card">' +
    '<h3>Alice 伴学计划</h3>' +
    '<div class="ch-card-sub">小小的投入，奖励自己的回报 · 7 天最多拿回 2800</div>' +
    ladder +
    '<div class="ch-payback-note">' + icon('trending-up') + '<span>撑到<strong>第 ' +
    PAYBACK.day + ' 天</strong>累计 ' + PAYBACK.acc +
    ' 米粒，本金已经赚回来，之后全是净赚</span></div>' +
    '<ul class="ch-rules">' + rules + '</ul>' +
    '<button type="button" class="ch-cta"><img src="' + COIN + '" alt="">投入 800 米粒，开启伴学</button>' +
    '<div class="ch-note">米粒从你的米羊账户扣除 · 每人仅可参加一次<br>这 800 米粒不仅能悉数返还，更是我们与你共同坚持、学有所得的约定</div>' +
    '</div>';

  /* ─── 5. 日历卡状态组合 ─── */

  var boards = [
    ['全勤进行中（Day 4 未完成）', [day(1, 'claimed'), day(2, 'claimed'), day(3, 'claimed'),
      day(4, 'active', 3), day(5, 'locked'), day(6, 'locked'), day(7, 'locked')], 600,
      '今日截止：凌晨 4:00（剩 5 小时 12 分）'],
    ['有断签（Day 2 已错过，全勤奖失效）', [day(1, 'claimed'), day(2, 'missed'), day(3, 'claimed'),
      day(4, 'active', 0), day(5, 'locked'), day(6, 'locked'), day(7, 'locked')], 400,
      '今日截止：凌晨 4:00（剩 12 小时 3 分）'],
    ['今日可领（Day 7 全勤压轴）', [day(1, 'claimed'), day(2, 'claimed'), day(3, 'claimed'),
      day(4, 'claimed'), day(5, 'claimed'), day(6, 'claimed'), day(7, 'claimable', 5)], 2100,
      '今日截止：凌晨 4:00（剩 2 小时 40 分）'],
    ['今日已领（Day 5）', [day(1, 'claimed'), day(2, 'claimed'), day(3, 'claimed'),
      day(4, 'claimed'), day(5, 'claimed'), day(6, 'locked'), day(7, 'locked')], 1250,
      '今日已完成，明天凌晨 4:00 解锁 Day 6'],
  ];
  document.getElementById('demoBoards').innerHTML = boards.map(function (b) {
    return '<div class="pg-board-demo"><div class="pg-label">' + b[0] + '</div>' +
      boardHtml(b[1], b[2], b[3]) + '</div>';
  }).join('');

  /* ─── 6. 领取动效（可反复触发） ─── */

  var fxCell = document.getElementById('fxCell');
  var fxTarget = document.getElementById('fxTarget');
  fxCell.addEventListener('click', function () {
    fxCell.classList.remove('is-just-claimed');
    void fxCell.offsetWidth; // 重置动画
    fxCell.classList.add('is-just-claimed');
    var from = fxCell.getBoundingClientRect();
    var to = fxTarget.getBoundingClientRect();
    for (var i = 0; i < 6; i++) {
      (function (i) {
        var img = document.createElement('img');
        img.src = COIN;
        img.className = 'ch-fx-coin';
        var sx = from.left + from.width / 2 - 13 + (Math.random() * 40 - 20);
        var sy = from.top + from.height / 2 - 13 + (Math.random() * 30 - 15);
        img.style.transform = 'translate(' + sx + 'px,' + sy + 'px) scale(1)';
        img.style.opacity = '1';
        document.body.appendChild(img);
        setTimeout(function () {
          img.style.transition = 'transform 0.7s cubic-bezier(.35,-0.2,.65,1), opacity 0.7s ease';
          img.style.transform = 'translate(' + (to.left + to.width / 2 - 13) + 'px,' +
            (to.top + to.height / 2 - 13) + 'px) scale(0.35)';
          img.style.opacity = '0.1';
        }, 60 + i * 70);
        setTimeout(function () { img.remove(); }, 950 + i * 70);
      })(i);
    }
  });

  /* ─── 7. 结算卡 ─── */

  function settleHtml(full, total, dayFlags, title) {
    var days = dayFlags.map(function (ok) {
      return '<i class="' + (ok ? '' : 'miss') + '">' + (ok ? '✓' : '✗') + '</i>';
    }).join('');
    var confetti = '';
    if (full) {
      var colors = ['#eab545', '#e8795a', '#44609f', '#8fbf6a', '#f2c9a0'];
      for (var i = 0; i < 26; i++) {
        confetti += '<i style="left:' + (Math.random() * 96 + 2) + '%;background:' +
          colors[i % colors.length] + ';animation-delay:' + (Math.random() * 2.4).toFixed(2) +
          's;animation-duration:' + (2.2 + Math.random() * 1.6).toFixed(2) + 's"></i>';
      }
      confetti = '<div class="ch-confetti">' + confetti + '</div>';
    }
    return '<div class="ch-card">' + confetti +
      '<h3>' + title + '</h3>' +
      '<div class="ch-settle-hero"><img src="' + GIFT + '" alt=""></div>' +
      '<div class="ch-settle-total"><img src="' + COIN + '" width="30" height="30" alt="">' +
      '<b>' + total + '</b><span>米粒已到账</span></div>' +
      '<div class="ch-settle-days">' + days + '</div>' +
      '<button type="button" class="ch-cta ch-cta--gold">继续学习</button>' +
      '<div class="ch-note">米粒是米羊通用余额，旗下各应用通用；也能在 Cherry Studio 等客户端里调用 Alice 的模型</div>' +
      '</div>';
  }
  document.getElementById('demoSettles').innerHTML =
    settleHtml(true, 2800, [1, 1, 1, 1, 1, 1, 1], '全勤达成！') +
    settleHtml(false, 1500, [1, 0, 1, 1, 0, 1, 1], '伴学计划结束');

  /* ─── 8. 领取成功弹窗 ─── */

  function successHtml(amount, bonus, justPaidBack) {
    var confetti = '';
    var colors = ['#eab545', '#e8795a', '#44609f', '#8fbf6a', '#f2c9a0'];
    for (var i = 0; i < 30; i++) {
      confetti += '<i style="left:' + (Math.random() * 96 + 2) + '%;background:' +
        colors[i % colors.length] + ';animation-delay:' + (Math.random() * 1.5).toFixed(2) +
        's;animation-duration:' + (1.8 + Math.random() * 1.2).toFixed(2) + 's"></i>';
    }
    var confettiHtml = '<div class="ch-confetti">' + confetti + '</div>';

    var totalAmount = amount + bonus;

    var bonusHtml = '';
    if (bonus > 0) {
      bonusHtml = '<div class="ch-success-bonus-badge">全勤奖 +' + bonus + '</div>';
    }

    var paybackHtml = '';
    if (justPaidBack) {
      paybackHtml = '<div class="ch-success-payback-badge">本金已赚回！之后全是净赚</div>';
    }

    return '<div class="ch-card ch-card--success">' + confettiHtml +
      '<h3>领取成功！</h3>' +
      '<div class="ch-success-sub">恭喜获得</div>' +
      '<div class="ch-success-hero-wrapper">' +
        '<div class="ch-success-light-ray"></div>' +
        '<img class="ch-success-hero-coin" src="' + COIN + '" alt="">' +
      '</div>' +
      '<div class="ch-success-total">' +
        '<b>+' + totalAmount + '</b><span>米粒</span>' +
      '</div>' +
      bonusHtml +
      paybackHtml +
      '<button type="button" class="ch-cta ch-cta--gold ch-success-cta-btn">开心收下</button>' +
      '<div class="ch-note">米粒是米羊通用余额，旗下各应用通用；也能在 Cherry Studio 等客户端里调用 Alice 的模型</div>' +
      '</div>';
  }

  document.getElementById('demoSuccesses').innerHTML =
    successHtml(150, 0, false) +
    successHtml(300, 0, true) +
    successHtml(450, 700, false);
})();
