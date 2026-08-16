/* ═══════════════════════════════════════════════════════════
   taste.js —— 专题篇章「审美工程」共用交互组件
   背景：本章多页反复用到「A/B 对决找茬」和「点选题」两种玩法，
   逐页手写会复制大量事件绑定代码并各自漂移。
   设计意图：只抽真正跨页复用的两个组件；页面独有的滑块、
   开关类演示留在各页 <script> 里，避免过度抽象。
   约束：依赖 taste.css 的 .duel / .quiz-* 类名；
   必须在 DOM 就绪后调用（各页脚本置于 </main> 之后天然满足）。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 判词与标签走 i18n，否则英韩译文页一交互就冒出中文。
     i18n.js 未加载时按中文兜底，与 build.js / lesson.js 同一套口径。 */
  function T(key, zh) {
    var i18n = window.XUEAI_I18N;
    return i18n ? i18n.t(key) : zh;
  }

  /* A/B 对决：两块内容选出更好的那块。
     背景：识别美的教学模式是「先动手判断，再听理论」（沿用 zero-3 找茬），
     本章四个抓手页每页至少一局。
     设计意图：答案揭晓后不锁死页面，双方标签换成「更好/欠佳」并给判词，
     选错也给判词但语气区分——教学目标是看懂差异，不是考倒读者。
     约束：cfg.winner 为更好一侧的索引（0 左 1 右）；
     verdictWin / verdictMiss 支持 HTML；onDone 可选，用于页内进度统计。 */
  window.tasteDuel = function (rootId, cfg) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var duel = root.querySelector('.duel');
    var verdict = root.querySelector('.duel-verdict');
    var badge = root.querySelector('.toy-badge');
    var sides = duel.querySelectorAll('.duel-side');
    duel.addEventListener('click', function (e) {
      var side = e.target.closest('.duel-side');
      if (!side || duel.classList.contains('done')) return;
      var idx = Array.prototype.indexOf.call(sides, side);
      duel.classList.add('done');
      sides[cfg.winner].classList.add('win');
      sides[1 - cfg.winner].classList.add('lose');
      sides[cfg.winner].querySelector('.duel-tag').textContent = T('tasteBetter', '✓ 更好');
      sides[1 - cfg.winner].querySelector('.duel-tag').textContent = T('tasteWorse', '✗ 欠佳');
      var hit = idx === cfg.winner;
      verdict.className = 'duel-verdict show ' + (hit ? 'good' : 'miss');
      verdict.innerHTML = (hit
        ? T('tasteDuelHit', '<b>眼力不错。</b>')
        : T('tasteDuelMiss', '<b>这局看走眼了，正常，学完这节回来就能看出来。</b>')) + cfg.verdict;
      if (badge) { badge.textContent = T('tasteRevealed', '✓ 已揭晓'); badge.classList.add('solved'); }
      if (typeof cfg.onDone === 'function') cfg.onDone(hit);
    });
  };

  /* 点选题：多个选项挑一个对的。
     背景：审美词汇、提示词写法这类知识点，选一次比读三遍记得牢。
     设计意图：选错立即标红并给「为什么不对」，允许继续选直到命中，
     命中后整题锁定——试错本身就是教学过程。
     约束：容器内选项需带 data-k（0 起）；cfg.answer 为正确索引；
     cfg.why 数组给每个选项的判词，支持 HTML。 */
  window.tasteQuiz = function (rootId, cfg) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var fb = root.querySelector('.quiz-fb');
    var badge = root.querySelector('.toy-badge');
    root.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz-opt');
      if (!opt || root.classList.contains('done')) return;
      var k = +opt.dataset.k;
      if (k === cfg.answer) {
        root.classList.add('done');
        opt.classList.add('right');
        fb.className = 'quiz-fb show good';
        fb.innerHTML = T('tasteQuizRight', '<b>对。</b>') + cfg.why[k];
        if (badge) { badge.textContent = T('tasteSolved', '✓ 已解决'); badge.classList.add('solved'); }
        if (typeof cfg.onDone === 'function') cfg.onDone();
      } else if (!opt.classList.contains('wrong')) {
        opt.classList.add('wrong');
        fb.className = 'quiz-fb show miss';
        fb.innerHTML = cfg.why[k] + T('tasteQuizRetry', ' 再挑一个。');
      }
    });
  };
})();
