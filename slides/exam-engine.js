/* 自测页共享引擎：模式选择 / 抽题 / 判分 / 错题回顾 / 成绩上报 / 题目报错。
   页面需在引入本文件前定义：
     window.EXAM_BANK   题库数组（exam-data*.js）
     window.EXAM_CONFIG 页面配置：
       lsKey     刷题进度的 localStorage 键（每个题库必须唯一）
       examId    考试标识，随成绩上报（服务端暂不消费，先带上）
       pickPlan  模拟考试抽题数 { single, multi, judge }，在整个题库里抽
       pickPerPart 改为按篇章均摊，每章各抽 { single, multi, judge } 道，
                 篇章由考点组编号的百位推导（1xx 是第一篇章，依此类推）。
                 全站综合卷用它保证七章都考到，不会整章漏掉。设了它就不看 pickPlan
       drill     false 表示这份卷子不提供顺序刷题（全站综合卷用不上，
                 想逐题刷解析该去各篇章自测页）
       verdicts  判分文案 [{ min, tier, title, desc }]，按 min 降序匹配 */

(function(){
var CFG = window.EXAM_CONFIG || {};
var PICK = CFG.pickPlan || { single: 11, multi: 5, judge: 4 };
var LS_KEY = CFG.lsKey || 'exam-drill-v1';

/* ── 引擎 UI 多语言（题库内容与 verdicts 由各语言版页面自带） ── */
var EX_LANG = (window.XUEAI_I18N && window.XUEAI_I18N.lang) || 'zh';
var EX_STR_ALL = {
  zh: {
    typeSingle: '单选题', typeMulti: '多选题（错选漏选不得分）', typeJudge: '判断题',
    examLabel: '模拟考试 · 交卷后统一判分', drillLabel: '顺序刷题 · 即时判定',
    drillContinue: function(n, total){ return '继续 · 第 ' + n + ' / ' + total + ' 题'; },
    drillFromStart: '从头开始',
    btnSubmit: '交卷 →', btnFinish: '完成 →', btnNext: '下一题 →',
    optTrue: '正确', optFalse: '错误',
    fbRight: '✓ 回答正确', fbWrong: '✗ 回答错误 · 正确答案：',
    expLabel: '解析',
    resultExam: '考试结果', resultDrill: '刷题总结',
    yourAns: '你的答案：', rightAns: '｜ 正确答案：',
    reportBtn: '⚑ 这道题有问题？点此报错',
    reportEmpty: '请先描述一下问题，哪怕一句话也行。',
    reportOk: '✓ 已收到，感谢反馈！我们会尽快核实这道题。',
    reportFail: '提交失败，请确认已登录后重试。'
  },
  en: {
    typeSingle: 'Single choice', typeMulti: 'Multiple choice (no partial credit)', typeJudge: 'True / False',
    examLabel: 'Mock Exam · graded after submission', drillLabel: 'Drill Mode · instant feedback',
    drillContinue: function(n, total){ return 'Continue · Q' + n + ' / ' + total; },
    drillFromStart: 'Start from the beginning',
    btnSubmit: 'Submit →', btnFinish: 'Finish →', btnNext: 'Next →',
    optTrue: 'True', optFalse: 'False',
    fbRight: '✓ Correct', fbWrong: '✗ Incorrect · Correct answer: ',
    expLabel: 'Explanation',
    resultExam: 'Exam Result', resultDrill: 'Drill Summary',
    yourAns: 'Your answer: ', rightAns: ' | Correct answer: ',
    reportBtn: '⚑ Something wrong with this question? Report it',
    reportEmpty: 'Please describe the issue first — even one sentence helps.',
    reportOk: '✓ Received, thanks for the feedback! We will verify this question soon.',
    reportFail: 'Submission failed. Please make sure you are signed in and try again.'
  },
  ko: {
    typeSingle: '단일 선택', typeMulti: '복수 선택（부분 점수 없음）', typeJudge: 'O / X',
    examLabel: '모의고사 · 제출 후 일괄 채점', drillLabel: '순차 풀이 · 즉시 채점',
    drillContinue: function(n, total){ return '이어서 풀기 · ' + n + ' / ' + total + '번'; },
    drillFromStart: '처음부터 시작',
    btnSubmit: '제출 →', btnFinish: '완료 →', btnNext: '다음 문제 →',
    optTrue: '맞음', optFalse: '틀림',
    fbRight: '✓ 정답입니다', fbWrong: '✗ 오답입니다 · 정답: ',
    expLabel: '해설',
    resultExam: '시험 결과', resultDrill: '풀이 요약',
    yourAns: '내 답안: ', rightAns: ' | 정답: ',
    reportBtn: '⚑ 이 문제에 오류가 있나요? 신고하기',
    reportEmpty: '문제점을 먼저 간단히 설명해 주세요. 한 문장이면 충분합니다.',
    reportOk: '✓ 접수되었습니다. 피드백 감사합니다! 빠르게 확인하겠습니다.',
    reportFail: '제출에 실패했습니다. 로그인 상태를 확인한 후 다시 시도해 주세요.'
  }
};
var EX = EX_STR_ALL[EX_LANG] || EX_STR_ALL.zh;
var VERDICTS = CFG.verdicts || [
  { min: 95, tier: '优秀', title: '基础扎实，可以放心进阶了',
    desc: '这份题库对你已经没有难度。<b>接着往后学 Agent 实战和 Harness 设计</b>，或者去雷军创业课看看怎么把技术变成生意。' },
  { min: 80, tier: '良好', title: '概念体系已经成型',
    desc: '只剩少数细节考点。建议用「顺序刷题」把题库全量过一遍，<b>查漏补缺后再考一次冲满分</b>。' },
  { min: 60, tier: '及格', title: '及格了，但边界类考点容易翻车',
    desc: '大部分概念你有印象，错的多半是边界题。<b>过一遍错题，把模糊的概念钉死。</b>' },
  { min: 0,  tier: '回炉', title: '基础还没打牢，先回对应章节',
    desc: '错题集中在哪个考点，就回哪一章重学。<b>先看错题回顾</b>，搞懂再来重考，题目会重新随机抽取。' }
];

var TYPE_NAME = { single: EX.typeSingle, multi: EX.typeMulti, judge: EX.typeJudge };

var mode = null;          /* 'exam' | 'drill' */
var quiz = [];            /* 本轮题目 */
var cur = 0;
var answers = [];         /* 用户作答 */
var multiPick = [];       /* 多选暂存 */
var singlePick = null;    /* 模拟考试模式下单选/判断暂存 */
var locked = false;

/* ── 抽题 ── */
function sample(arr, n){
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i+1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a.slice(0, n);
}
/* 选项乱序：打乱 opts 顺序并同步重映射答案索引，防止靠位置或长度规律猜题 */
function shuffleOpts(q){
  if (q.type === 'judge') return q;
  var order = sample(q.opts.map(function(_, i){ return i; }), q.opts.length);
  var copy = { g: q.g, type: q.type, q: q.q, exp: q.exp, opts: order.map(function(i){ return q.opts[i]; }) };
  if (q.type === 'single'){
    copy.ans = order.indexOf(q.ans);
  } else {
    copy.ans = q.ans.map(function(a){ return order.indexOf(a); }).sort(function(a, b){ return a - b; });
  }
  return copy;
}
/* 同一考点组只出一题：组里有 A/B 变体时随机取一个，重考不会撞到同一份卷子 */
function oneFromEachGroup(pool, type){
  var groups = {};
  pool.forEach(function(q){ if (q.type === type){ (groups[q.g] = groups[q.g] || []).push(q); } });
  return Object.keys(groups).map(function(g){ return sample(groups[g], 1)[0]; });
}
function pickByGroup(type, n){
  return sample(oneFromEachGroup(window.EXAM_BANK, type), n);
}
/* 按篇章均摊：每章各抽固定题数，再把同题型的题跨章打乱，
   避免出现前几题清一色第一篇章 */
function pickPerPart(plan){
  var parts = {};
  window.EXAM_BANK.forEach(function(q){
    var p = Math.floor(q.g / 100);
    (parts[p] = parts[p] || []).push(q);
  });
  var keys = Object.keys(parts).sort(function(a, b){ return a - b; });
  var out = [];
  ['single', 'multi', 'judge'].forEach(function(type){
    var n = plan[type] || 0;
    if (!n) return;
    var bucket = [];
    keys.forEach(function(p){ bucket = bucket.concat(sample(oneFromEachGroup(parts[p], type), n)); });
    out = out.concat(sample(bucket, bucket.length));
  });
  return out;
}

function startExam(){
  mode = 'exam';
  var raw = CFG.pickPerPart
    ? pickPerPart(CFG.pickPerPart)
    : pickByGroup('single', PICK.single).concat(pickByGroup('multi', PICK.multi)).concat(pickByGroup('judge', PICK.judge));
  quiz = raw.map(shuffleOpts);
  cur = 0; answers = [];
  document.getElementById('quizLabel').textContent = EX.examLabel;
  enterQuiz();
}
function startDrill(){
  mode = 'drill';
  quiz = window.EXAM_BANK.map(shuffleOpts);
  var saved = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
  cur = (saved >= 0 && saved < quiz.length) ? saved : 0;
  answers = [];
  document.getElementById('quizLabel').textContent = EX.drillLabel;
  enterQuiz();
}
function enterQuiz(){
  document.getElementById('modeSec').style.display = 'none';
  document.getElementById('resultSec').classList.remove('show');
  document.getElementById('quizSec').classList.add('show');
  renderQ();
  document.getElementById('quizSec').scrollIntoView({behavior:'smooth', block:'start'});
}
function quitQuiz(){
  if (mode === 'drill') localStorage.setItem(LS_KEY, String(cur));
  backToMode();
}
function backToMode(){
  document.getElementById('quizSec').classList.remove('show');
  document.getElementById('resultSec').classList.remove('show');
  document.getElementById('modeSec').style.display = '';
  updateDrillMeta();
  window.scrollTo({top:0, behavior:'smooth'});
}
function updateDrillMeta(){
  var el = document.getElementById('drillMeta');
  if (!el) return;                                   /* 没开顺序刷题的卷子没有这个元素 */
  var saved = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
  el.textContent = (saved > 0 && saved < window.EXAM_BANK.length) ? EX.drillContinue(saved+1, window.EXAM_BANK.length) : EX.drillFromStart;
}

/* ── 渲染 ── */
function renderQ(){
  var q = quiz[cur];
  locked = false; multiPick = []; singlePick = null;
  document.getElementById('qType').textContent = TYPE_NAME[q.type];
  document.getElementById('qTitle').textContent = 'Q' + (cur+1) + ' ' + q.q;
  document.getElementById('qCount').textContent = (cur+1) + ' / ' + quiz.length;
  document.getElementById('qFill').style.width = (cur / quiz.length * 100) + '%';
  document.getElementById('qFb').className = 'q-fb';
  document.getElementById('qExp').className = 'q-exp';
  document.getElementById('qReport').className = 'q-report show';
  document.getElementById('qConfirm').className = 'q-btn';
  document.getElementById('qNext').className = 'q-btn';
  document.getElementById('qNext').textContent = (cur === quiz.length-1) ? (mode==='exam' ? EX.btnSubmit : EX.btnFinish) : EX.btnNext;

  var box = document.getElementById('qOpts');
  box.innerHTML = '';
  var opts = (q.type === 'judge') ? [EX.optTrue, EX.optFalse] : q.opts;
  var letters = ['A','B','C','D','E','F'];
  opts.forEach(function(o, i){
    var btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.setAttribute('data-i', i);
    btn.innerHTML = '<span class="ol">' + ((q.type==='judge') ? (i===0?'√':'×') : letters[i]) + '</span><p>' + o + '</p>';
    btn.onclick = function(){ pick(i, btn); };
    box.appendChild(btn);
  });
}

function pick(i, btn){
  if (locked) return;
  var q = quiz[cur];
  if (q.type === 'multi'){
    var idx = multiPick.indexOf(i);
    if (idx >= 0){ multiPick.splice(idx, 1); btn.classList.remove('picked'); }
    else { multiPick.push(i); btn.classList.add('picked'); }
    if (mode === 'exam'){
      document.getElementById('qNext').className = multiPick.length ? 'q-btn show' : 'q-btn';
    } else {
      document.getElementById('qConfirm').className = multiPick.length ? 'q-btn show' : 'q-btn';
    }
    return;
  }
  /* 单选 / 判断 */
  document.querySelectorAll('.q-opt').forEach(function(o){ o.classList.remove('picked'); });
  btn.classList.add('picked');

  if (mode === 'exam'){
    singlePick = { ans: q.type === 'judge' ? (i === 0) : i };
    document.getElementById('qNext').className = 'q-btn show';
  } else {
    submitAnswer(q.type === 'judge' ? (i === 0) : i);
  }
}
function confirmMulti(){
  if (locked || !multiPick.length) return;
  submitAnswer(multiPick.slice().sort(function(a,b){ return a-b; }));
}

function isCorrect(q, a){
  if (q.type === 'single') return a === q.ans;
  if (q.type === 'judge') return a === q.ans;
  var want = q.ans.slice().sort(function(x,y){ return x-y; });
  return a.length === want.length && a.every(function(v, i){ return v === want[i]; });
}
function fmtAns(q, a){
  var letters = ['A','B','C','D','E','F'];
  if (q.type === 'judge') return a ? EX.optTrue : EX.optFalse;
  if (q.type === 'single') return letters[a];
  return a.map(function(i){ return letters[i]; }).join('');
}

function submitAnswer(a){
  locked = true;
  var q = quiz[cur];
  var ok = isCorrect(q, a);
  answers.push({ q:q, a:a, ok:ok });
  document.getElementById('qConfirm').className = 'q-btn';
  document.getElementById('qFill').style.width = ((cur+1) / quiz.length * 100) + '%';

  if (mode === 'drill'){
    var opts = document.querySelectorAll('.q-opt');
    opts.forEach(function(o){
      var i = parseInt(o.getAttribute('data-i'), 10);
      o.classList.add('lock');
      var inAns = (q.type==='single') ? (i === q.ans) : (q.type==='judge') ? ((i===0) === q.ans) : (q.ans.indexOf(i) >= 0);
      var inPick = (q.type==='multi') ? (a.indexOf(i) >= 0) : o.classList.contains('picked');
      if (inAns) o.classList.add('right');
      else if (inPick) o.classList.add('wrong');
    });
    var fb = document.getElementById('qFb');
    fb.innerHTML = ok ? EX.fbRight : (EX.fbWrong + fmtAns(q, q.ans));
    fb.className = 'q-fb ' + (ok ? 'ok' : 'no');
    if (q.exp){
      var ex = document.getElementById('qExp');
      ex.innerHTML = '<b>' + EX.expLabel + '</b> · ' + q.exp;
      ex.className = 'q-exp show';
    }
    localStorage.setItem(LS_KEY, String(Math.min(cur+1, quiz.length-1)));
  }
  document.getElementById('qNext').className = 'q-btn show';
}

function nextQ(){
  if (mode === 'exam' && !locked){
    var q = quiz[cur];
    if (q.type === 'multi' && multiPick.length){
      submitAnswer(multiPick.slice().sort(function(a,b){ return a-b; }));
    } else if (singlePick){
      submitAnswer(singlePick.ans);
    }
  }
  cur++;
  if (cur < quiz.length){ renderQ(); window.scrollTo({top:document.getElementById('quizSec').offsetTop - 20, behavior:'smooth'}); }
  else if (mode === 'exam') showResult();
  else {
    localStorage.setItem(LS_KEY, '0');
    showResult();
  }
}

/* ── 结果 ── */
function showResult(){
  document.getElementById('quizSec').classList.remove('show');
  var rs = document.getElementById('resultSec');
  rs.classList.add('show');

  var right = answers.filter(function(x){ return x.ok; }).length;
  var score = Math.round(right / answers.length * 100);

  /* 成绩上报：按考点组聚合对错，米羊个人中心据此展示薄弱点。
     未登录到不了这页；上报失败静默，不影响本地看成绩。
     刷题中途退出再续时 answers 只含本次做过的题，服务端按组累加，不失真。 */
  var gstat = {};
  answers.forEach(function(x){
    var k = String(x.q.g);
    var s = gstat[k] = gstat[k] || { right: 0, total: 0 };
    s.total++;
    if (x.ok) s.right++;
  });
  try {
    fetch('/auth/exam', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode, score: score, right: right,
                             total: answers.length, groups: gstat,
                             exam: CFG.examId || '' })
    })['catch'](function(){});
  } catch (e) {}

  var v = VERDICTS.filter(function(x){ return score >= x.min; }).sort(function(a,b){ return b.min - a.min; })[0] || VERDICTS[VERDICTS.length-1];
  document.getElementById('rTier').textContent = v.tier;
  document.getElementById('rTitle').textContent = v.title;
  document.getElementById('rDesc').innerHTML = v.desc;
  document.querySelector('#resultSec .sec-label').textContent = (mode === 'exam') ? EX.resultExam : EX.resultDrill;

  var C = 2 * Math.PI * 68;
  var fg = document.getElementById('rrFg');
  fg.style.strokeDasharray = C;
  fg.style.strokeDashoffset = C;
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ fg.style.strokeDashoffset = C * (1 - score/100); }); });
  var numEl = document.getElementById('rNum'), t0 = null;
  function tick(ts){
    if (!t0) t0 = ts;
    var p = Math.min((ts - t0)/1300, 1);
    numEl.textContent = Math.round(score * (1 - Math.pow(1-p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* 错题回顾 */
  var wrong = answers.filter(function(x){ return !x.ok; });
  var ws = document.getElementById('wrongSec');
  var wl = document.getElementById('wrongList');
  wl.innerHTML = '';
  if (!wrong.length){ ws.style.display = 'none'; }
  else {
    ws.style.display = '';
    wrong.forEach(function(x){
      var card = document.createElement('div');
      card.className = 'w-card';
      var optsHtml = '';
      if (x.q.type !== 'judge'){
        var letters = ['A','B','C','D','E','F'];
        optsHtml = '<div class="desc" style="font-size:13px;margin-top:8px">' + x.q.opts.map(function(o,i){ return letters[i] + '. ' + o; }).join('<br>') + '</div>';
      }
      var expHtml = x.q.exp ? ('<div class="w-exp"><b>' + EX.expLabel + '</b> · ' + x.q.exp + '</div>') : '';
      card.innerHTML = '<div class="wq">' + x.q.q + '</div>' + optsHtml +
        '<div class="wa">' + EX.yourAns + '<span class="bad">' + fmtAns(x.q, x.a) + '</span>' + EX.rightAns + '<span class="good">' + fmtAns(x.q, x.q.ans) + '</span></div>' +
        expHtml + '<button class="q-report">' + EX.reportBtn + '</button>';
      card.querySelector('.q-report').onclick = function(){ openReport(x.q); };
      wl.appendChild(card);
    });
  }
  rs.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ── 题目报错 ── */
var reportTarget = null;

function openReport(q){
  reportTarget = q;
  document.getElementById('rpQ').textContent = q.q;
  document.getElementById('rpText').value = '';
  document.getElementById('rpMsg').className = 'rp-msg';
  document.getElementById('rpSubmit').disabled = false;
  document.getElementById('rpMask').classList.add('show');
  document.getElementById('rpText').focus();
}
function closeReport(){
  document.getElementById('rpMask').classList.remove('show');
  reportTarget = null;
}
function submitReport(){
  if (!reportTarget) return;
  var detail = document.getElementById('rpText').value.trim();
  var msg = document.getElementById('rpMsg');
  if (!detail){
    msg.textContent = EX.reportEmpty;
    msg.className = 'rp-msg err';
    return;
  }
  var btn = document.getElementById('rpSubmit');
  btn.disabled = true;
  fetch('/auth/exam-report', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      g: reportTarget.g,
      type: reportTarget.type,
      q: reportTarget.q,
      detail: detail.slice(0, 500),
      mode: mode || ''
    })
  }).then(function(r){
    if (!r.ok) throw new Error(r.status);
    msg.textContent = EX.reportOk;
    msg.className = 'rp-msg ok';
    setTimeout(closeReport, 1600);
  })['catch'](function(){
    btn.disabled = false;
    msg.textContent = EX.reportFail;
    msg.className = 'rp-msg err';
  });
}

/* 页面 onclick 依赖的全局符号 */
window.startExam = startExam;
window.startDrill = startDrill;
window.quitQuiz = quitQuiz;
window.backToMode = backToMode;
window.confirmMulti = confirmMulti;
window.nextQ = nextQ;
window.openReport = openReport;
window.closeReport = closeReport;
window.submitReport = submitReport;
/* 错题回顾里 openReport(quiz[cur]) 需要读 quiz/cur */
Object.defineProperty(window, 'quiz', { get: function(){ return quiz; } });
Object.defineProperty(window, 'cur', { get: function(){ return cur; } });

updateDrillMeta();

/* 从自测中心带着 ?mode= 进来的直接开考，省掉再选一次模式。
   未登录时正文被遮罩挡着，自动开考只会看到空白，所以锁着就先不开。
   注意 head 内联脚本只按本地缓存的登录标记抢先上锁，paywall.js 要等
   /auth/me 回来才解锁，比这里晚。所以锁着时得等它解锁再开，
   不能当场判定成未登录，否则已登录的人也开不了。 */
(function(){
  var m = /[?&]mode=(exam|drill)/.exec(location.search);
  if (!m) return;
  var root = document.documentElement;
  function go(){
    if (m[1] === 'exam') startExam();
    else if (CFG.drill !== false) startDrill();
  }
  if (!root.classList.contains('xa-locked')){ go(); return; }
  if (!window.MutationObserver) return;
  var ob = new MutationObserver(function(){
    if (root.classList.contains('xa-locked')) return;
    ob.disconnect(); clearTimeout(timer); go();
  });
  ob.observe(root, { attributes: true, attributeFilter: ['class'] });
  /* 一直没解锁说明确实没登录，别一直挂着 */
  var timer = setTimeout(function(){ ob.disconnect(); }, 8000);
})();
})();
