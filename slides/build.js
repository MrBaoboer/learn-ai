/* ═══════════════════════════════════════════════════════════
   build.js —— 实战主线「你的第一个能干活的 Agent」交互逻辑

   服务 build-1~6、build-log.html、roadmap.html 与 learn.html 的锚点横幅，
   PlayGround（playground/build.html）用的是同一份，改这里两边一起变。

   对外只暴露 window.BuildKit，各页面按需调用。
   所有状态存 localStorage，不依赖登录，未登录也能用。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LS_TASKS = 'ai_build_tasks_v1';   // { 页面key: [已完成任务的 id] }
  var LS_LOG = 'ai_build_log_v1';       // { 里程碑id: { 字段名: 值 } }
  var LS_ROUTE = 'ai_build_route_v1';   // 选中的路线 id

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 面向用户的文案一律走 i18n，否则英韩译文页一交互就冒出中文。
     i18n.js 未加载时按中文兜底，与 taste.js / lesson.js 同一套口径。
     vars 用于 '{n} 节' 这类带占位符的模板。 */
  function T(key, zh, vars) {
    var i18n = window.XUEAI_I18N;
    var s = i18n ? i18n.t(key) : zh;
    for (var k in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, k)) {
        s = s.replace('{' + k + '}', String(vars[k]));
      }
    }
    return s;
  }

  // ── localStorage 读写：隐私模式下会抛异常，静默降级成不持久化 ──
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('[build] 读取本地进度失败，本次不恢复', { key: key, error: e });
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[build] 保存本地进度失败，刷新后会丢', { key: key, error: e });
      return false;
    }
  }

  /* ───────────────────────────────────────────
     一、任务清单：勾选 + 进度环 + 持久化
     用法：<div class="bd-tasks" data-build-tasks="build-1"> 内含若干 .bd-task[data-task-id]
     进度环容器：同页 [data-build-progress="build-1"]
     ─────────────────────────────────────────── */
  function initTasks(scope) {
    var groups = (scope || document).querySelectorAll('[data-build-tasks]');
    Array.prototype.forEach.call(groups, function (group) {
      var pageKey = group.getAttribute('data-build-tasks');
      var tasks = group.querySelectorAll('.bd-task');
      var store = read(LS_TASKS, {});
      var done = store[pageKey] || [];

      function idOf(el, i) { return el.getAttribute('data-task-id') || String(i); }

      function paint() {
        var count = 0;
        Array.prototype.forEach.call(tasks, function (el, i) {
          var on = done.indexOf(idOf(el, i)) >= 0;
          el.classList.toggle('done', on);
          el.setAttribute('aria-pressed', on ? 'true' : 'false');
          if (on) count++;
        });
        paintProgress(pageKey, count, tasks.length);
      }

      Array.prototype.forEach.call(tasks, function (el, i) {
        var id = idOf(el, i);
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');

        function toggle(e) {
          // 展开验收标准、点链接时不要顺手把任务勾掉
          if (e && e.target.closest && e.target.closest('summary, a, .bd-accept-body')) return;
          var at = done.indexOf(id);
          if (at >= 0) done.splice(at, 1); else done.push(id);
          store[pageKey] = done;
          write(LS_TASKS, store);
          paint();
          console.info('[build] 任务勾选', { page: pageKey, task: id, done: done.length + '/' + tasks.length });
        }

        el.addEventListener('click', toggle);
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
        });
      });

      paint();
    });
  }

  function paintProgress(pageKey, count, total) {
    var box = document.querySelector('[data-build-progress="' + pageKey + '"]');
    if (!box) return;
    var ring = box.querySelector('.bd-ring-fg');
    var label = box.querySelector('[data-progress-label]');
    var all = total > 0 && count === total;

    box.classList.toggle('all', all);

    if (ring) {
      var r = Number(ring.getAttribute('r'));
      var c = 2 * Math.PI * r;
      var ratio = total ? count / total : 0;
      ring.setAttribute('stroke-dasharray', String(c));
      // 关掉动画偏好时直接跳到终态，跳过 0.5s 的补间
      if (REDUCED) ring.style.transition = 'none';
      ring.style.strokeDashoffset = String(c * (1 - ratio));
    }
    if (label) {
      label.textContent = all
        ? T('buildAllDone', '全部完成，这一章的东西你真的能用了')
        : T('buildProgress', '{done} / {total} 已完成', { done: count, total: total });
    }
  }

  /* ───────────────────────────────────────────
     二、里程碑轨道：按已填写的里程碑点亮节点并推进进度条
     用法：<div class="bd-track" data-build-track> 内含 .bd-node[data-node-id]
     ─────────────────────────────────────────── */
  function paintTrack(doneIds, currentId) {
    var track = document.querySelector('[data-build-track]');
    if (!track) return;
    var nodes = track.querySelectorAll('.bd-node');
    var fill = track.querySelector('.bd-track-fill');
    var lastOn = -1;

    Array.prototype.forEach.call(nodes, function (node, i) {
      var id = node.getAttribute('data-node-id');
      var on = doneIds.indexOf(id) >= 0;
      node.classList.toggle('on', on);
      node.classList.toggle('cur', id === currentId && !on);
      if (on) lastOn = i;
    });

    if (fill) {
      // 进度条画到最后一个已完成节点的圆心，节点在各段中点上
      var total = nodes.length;
      var pct = lastOn < 0 ? 0 : ((lastOn + 0.5) / total) * 100;
      if (REDUCED) fill.style.transition = 'none';
      fill.style.width = pct + '%';
    }
  }

  /* 各 build-N 页顶部的主线定位条：按建造日志里真填过的里程碑点亮，
     再把本章对应的那个标成「当前」。没填过就整条是灰的，只有当前节点带光圈。 */
  function paintTrackFromLog(currentId) {
    var data = read(LS_LOG, {});
    var done = Object.keys(data).filter(function (id) {
      var v = data[id];
      return v && Object.keys(v).some(function (k) { return String(v[k]).trim() !== ''; });
    });
    paintTrack(done, currentId);
    return done;
  }

  /* ───────────────────────────────────────────
     三、建造日志：展开/收起、填写、自动保存、导出 Markdown
     ─────────────────────────────────────────── */
  function initLog(spec) {
    var data = read(LS_LOG, {});
    var cards = document.querySelectorAll('.bd-ms[data-ms-id]');
    if (!cards.length) return;

    function filled(id) {
      var v = data[id];
      if (!v) return false;
      return Object.keys(v).some(function (k) { return String(v[k]).trim() !== ''; });
    }

    function refresh() {
      var doneIds = [], currentId = null;
      Array.prototype.forEach.call(cards, function (card) {
        var id = card.getAttribute('data-ms-id');
        var ok = filled(id);
        card.classList.toggle('on', ok);
        if (ok) doneIds.push(id);
        else if (!currentId) currentId = id;
      });
      paintTrack(doneIds, currentId);
      var counter = document.querySelector('[data-log-count]');
      if (counter) counter.textContent = doneIds.length + ' / ' + cards.length;
      var exportBtn = document.querySelector('[data-log-export]');
      if (exportBtn) exportBtn.disabled = doneIds.length === 0;
      return doneIds.length;
    }

    var saveTimer = null;
    function flagSaved() {
      var flag = document.querySelector('[data-log-saved]');
      if (!flag) return;
      flag.classList.add('show');
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { flag.classList.remove('show'); }, 1600);
    }

    Array.prototype.forEach.call(cards, function (card) {
      var id = card.getAttribute('data-ms-id');
      var head = card.querySelector('.bd-ms-head');

      if (head) {
        head.addEventListener('click', function () { card.classList.toggle('open'); });
      }

      var fields = card.querySelectorAll('[data-field]');
      Array.prototype.forEach.call(fields, function (input) {
        var name = input.getAttribute('data-field');
        if (data[id] && data[id][name] != null) input.value = data[id][name];

        input.addEventListener('input', function () {
          if (!data[id]) data[id] = {};
          data[id][name] = input.value;
          write(LS_LOG, data);
          refresh();
          flagSaved();
        });
      });
    });

    var exportBtn = document.querySelector('[data-log-export]');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        exportMarkdown(spec, data);
      });
    }

    var resetBtn = document.querySelector('[data-log-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm(T('buildLogClearAsk',
          '清空建造日志？填过的内容会全部删掉，这一步撤不回来。'))) return;
        data = {};
        write(LS_LOG, data);
        Array.prototype.forEach.call(document.querySelectorAll('.bd-ms [data-field]'), function (i) { i.value = ''; });
        refresh();
        console.info('[build] 建造日志已清空');
      });
    }

    refresh();
  }

  function exportMarkdown(spec, data) {
    // 导出的时间戳也跟着页面语言走，中文页拿到中式格式，英韩页拿到各自的
    var locale = { en: 'en-US', ko: 'ko-KR' }[window.XUEAI_I18N && window.XUEAI_I18N.lang] || 'zh-CN';
    var lines = [
      '# ' + T('buildLogHeading', '我的 Agent 建造日志'), '',
      '> ' + T('buildLogExportedAt', '导出时间：') + new Date().toLocaleString(locale),
      '> ' + T('buildLogSource', '来自 xueai.app 实战主线'), ''
    ];
    var written = 0;

    (spec || []).forEach(function (ms) {
      var v = data[ms.id];
      if (!v) return;
      var body = (ms.fields || []).filter(function (f) {
        return v[f.name] != null && String(v[f.name]).trim() !== '';
      });
      if (!body.length) return;
      written++;
      lines.push('## ' + ms.no + ' · ' + ms.title, '');
      body.forEach(function (f) {
        lines.push('**' + f.label + '**', '', String(v[f.name]).trim(), '');
      });
    });

    if (!written) {
      window.alert(T('buildLogEmpty', '还没有填写任何里程碑，先写一条再导出。'));
      return;
    }

    var blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'agent-build-log.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    console.info('[build] 已导出建造日志', { milestones: written });
  }

  /* ───────────────────────────────────────────
     四、路线切换：选中路线时在缩略地图上高亮覆盖的篇章
     用法：.bd-route[data-route-id]，地图容器 .bd-map[data-route-map]

     地图行和节数都从 course-data.js 现算，不写死。路线标记下沉到 topic 级之后，
     一个篇章可能只进来一半（动手实战篇对产品路线是 10/37），写死的数字撑不住这种
     部分覆盖，而且改一次课程结构就得记得回来同步一次。
     ─────────────────────────────────────────── */
  var ROUTE_ALL_KEYS = ['use', 'pro', 'pm', 'build'];

  function topicRoutes(part, topic) {
    return topic.routes || part.routes || ROUTE_ALL_KEYS;
  }
  function routeCount(routeId) {
    var course = window.COURSE;
    if (!course) return 0;
    var n = 0;
    course.parts.forEach(function (p) {
      p.topics.forEach(function (t) {
        if (routeId === 'all' || topicRoutes(p, t).indexOf(routeId) >= 0) n += t.lessons.length;
      });
    });
    return n;
  }
  function partCoverage(part, routeId) {
    var total = 0, kept = 0;
    part.topics.forEach(function (t) {
      total += t.lessons.length;
      if (routeId === 'all' || topicRoutes(part, t).indexOf(routeId) >= 0) kept += t.lessons.length;
    });
    return { total: total, kept: kept };
  }

  function renderRouteMap(box, routeId) {
    var course = window.COURSE;
    if (!course) return;
    box.innerHTML = course.parts.map(function (p) {
      var c = partCoverage(p, routeId);
      var state = c.kept === 0 ? 'dim' : (c.kept < c.total ? 'part' : 'hit');
      var count = state === 'part'
        ? T('buildLessonsPart', '{kept} / {total} 节', { kept: c.kept, total: c.total })
        : T('buildLessons', '{n} 节', { n: c.total });
      var title = p.title
        + (p.hardcore ? '<em>' + T('buildHardcore', '硬核选修') + '</em>' : '');
      return '<div class="bd-map-row ' + state + '">'
        + '<div class="bd-map-no">' + p.num + '</div>'
        + '<div class="bd-map-title">' + title + '</div>'
        + '<div class="bd-map-count">' + count + '</div>'
        + '</div>';
    }).join('');
  }

  function initRoutes() {
    var routes = document.querySelectorAll('.bd-route[data-route-id]');
    if (!routes.length) return;
    var mapBox = document.querySelector('.bd-map[data-route-map]');

    // 卡片上的节数与课时同样现算，避免和目录对不上
    Array.prototype.forEach.call(routes, function (r) {
      var slot = r.querySelector('[data-route-count]');
      if (!slot || !window.COURSE) return;
      var n = routeCount(r.getAttribute('data-route-id'));
      slot.textContent = T('buildLessons', '{n} 节', { n: n });
      var hours = r.querySelector('[data-route-hours]');
      if (hours) hours.textContent = T('buildHours', '约 {n} 小时', { n: Math.round(n / 6) });
    });

    function apply(routeId, persist) {
      Array.prototype.forEach.call(routes, function (r) {
        r.classList.toggle('on', r.getAttribute('data-route-id') === routeId);
      });
      if (mapBox) renderRouteMap(mapBox, routeId);
      var summary = document.querySelector('[data-route-summary="' + routeId + '"]');
      Array.prototype.forEach.call(document.querySelectorAll('[data-route-summary]'), function (s) {
        s.hidden = s !== summary;
      });
      if (persist) write(LS_ROUTE, routeId);
      console.info('[build] 切换学习路线', { route: routeId });
    }

    Array.prototype.forEach.call(routes, function (r) {
      var id = r.getAttribute('data-route-id');
      r.addEventListener('click', function (e) {
        // 点「开始学」按钮：路线落盘（learn 目录靠它精简）后放行跳转
        if (e.target.closest && e.target.closest('.bd-route-cta')) { write(LS_ROUTE, id); return; }
        apply(id, true);
      });
      r.addEventListener('mouseenter', function () {
        if (!document.querySelector('.bd-route.on')) apply(id, false);
      });
    });

    apply(read(LS_ROUTE, routes[0].getAttribute('data-route-id')), false);
  }

  /* ───────────────────────────────────────────
     五、通用：进入视口播放一次，可重放
     用法：BuildKit.onView(el, fn)；重放按钮 [data-replay="选择器"]
     ─────────────────────────────────────────── */
  function onView(el, fn) {
    if (!el) return;
    if (typeof window.lessonOnView === 'function') { window.lessonOnView(el, fn); return; }
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fn(); io.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  function initReplay(scope) {
    var btns = (scope || document).querySelectorAll('[data-replay]');
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener('click', function () {
        var target = document.querySelector(btn.getAttribute('data-replay'));
        if (!target) return;
        // 抽掉再加回同一个类，强制重跑 CSS 动画
        target.classList.remove('play');
        void target.offsetWidth;
        target.classList.add('play');
        var fn = target.__bdReplay;
        if (typeof fn === 'function') fn();
      });
    });
  }

  /* ───────────────────────────────────────────
     六、模拟台：三种可复用的交互演示
     都遵守同一套规矩——进视口才播、随时能重放、
     prefers-reduced-motion 下直接给终态不做补间。
     ─────────────────────────────────────────── */

  // 排队执行一串带间隔的动作，重放时能整串取消，避免两次动画打架
  function sequence(steps, gap) {
    var timers = [];
    function run() {
      cancel();
      steps.forEach(function (fn, i) {
        timers.push(setTimeout(fn, REDUCED ? 0 : i * gap));
      });
    }
    function cancel() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    return { run: run, cancel: cancel };
  }

  /* 6a. 流水线：步骤逐段点亮，可指定在第几段被拒
     用法：<div class="bd-chain" data-chain data-fail-at="3"> 内含 .bd-chain-step */
  function initChain(scope) {
    var chains = (scope || document).querySelectorAll('[data-chain]');
    Array.prototype.forEach.call(chains, function (chain) {
      var steps = chain.querySelectorAll('.bd-chain-step');
      var arrows = chain.querySelectorAll('.bd-chain-arrow');
      var verdict = document.querySelector('[data-chain-verdict="' + chain.getAttribute('data-chain') + '"]');
      var seq = null; // 常驻同一个队列实例，重放先取消上一轮，否则残留的定时器会污染新一轮

      function reset() {
        Array.prototype.forEach.call(steps, function (s) { s.classList.remove('on', 'fail', 'skip'); });
        Array.prototype.forEach.call(arrows, function (a) { a.classList.remove('on'); });
        if (verdict) verdict.classList.remove('show');
      }

      function play() {
        if (seq) seq.cancel();
        reset();
        // data-fail-at 是 1 基的段号，不设就是一路走到底
        var failAt = Number(chain.getAttribute('data-fail-at') || 0);
        var stop = failAt > 0 ? failAt : steps.length;
        var acts = [];

        for (var i = 0; i < stop; i++) {
          (function (idx) {
            acts.push(function () {
              var last = idx === stop - 1;
              steps[idx].classList.add(failAt > 0 && last ? 'fail' : 'on');
              if (arrows[idx] && !(failAt > 0 && last)) arrows[idx].classList.add('on');
            });
          })(i);
        }
        // 被拒时后面的段落变灰，明确「后面根本没跑」
        if (failAt > 0) {
          acts.push(function () {
            for (var k = stop; k < steps.length; k++) steps[k].classList.add('skip');
          });
        }
        acts.push(function () { if (verdict) verdict.classList.add('show'); });

        seq = sequence(acts, 420);
        seq.run();
      }

      chain.__bdReplay = play;
      onView(chain, play);
    });
  }

  /* 6b. 多次运行：同一输入跑 N 次，逐行揭示，最后给一致性判定
     用法：<div class="bd-runs" data-runs="stability"> 内含 .bd-run[data-flag="ok|bad"] */
  function initRuns(scope) {
    var groups = (scope || document).querySelectorAll('[data-runs]');
    Array.prototype.forEach.call(groups, function (group) {
      var rows = group.querySelectorAll('.bd-run');
      var score = document.querySelector('[data-runs-score="' + group.getAttribute('data-runs') + '"]');
      var seq = null;

      function play() {
        if (seq) seq.cancel();
        Array.prototype.forEach.call(rows, function (r) { r.classList.remove('show'); });
        if (score) score.style.opacity = '0';

        var acts = [];
        Array.prototype.forEach.call(rows, function (row) {
          acts.push(function () {
            row.classList.add('show');
            row.classList.add(row.getAttribute('data-flag') === 'bad' ? 'bad' : 'ok');
          });
        });
        acts.push(function () { if (score) score.style.opacity = '1'; });
        seq = sequence(acts, 380);
        seq.run();
      }

      group.__bdReplay = play;
      onView(group, play);
    });
  }

  /* 6c. 曲线：把一串数值画成折线，越过阈值的点标红
     用法：<div class="bd-curve" data-curve='{"points":[...],"threshold":85}'> */
  function initCurve(scope) {
    var boxes = (scope || document).querySelectorAll('[data-curve]');
    Array.prototype.forEach.call(boxes, function (box) {
      // 每次都重读属性再画，模式切换换掉 data-curve 后直接调 __bdReplay 就能换数据
      function render() {
        var conf;
        try {
          conf = JSON.parse(box.getAttribute('data-curve'));
        } catch (e) {
          console.warn('[build] 曲线配置解析失败', { error: e });
          return;
        }

        var W = 640, H = 168, PAD_L = 34, PAD_R = 10, PAD_T = 12, PAD_B = 26;
        var pts = conf.points || [];
        var max = conf.max || 100;
        var thresh = conf.threshold;

        function x(i) { return PAD_L + (i / Math.max(pts.length - 1, 1)) * (W - PAD_L - PAD_R); }
        function y(v) { return PAD_T + (1 - v / max) * (H - PAD_T - PAD_B); }

        var line = pts.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(v); }).join(' ');
        var area = line + ' L' + x(pts.length - 1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z';

        var svg = ''
          + '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="'
          + (conf.alt || T('buildCurveAlt', '用量曲线')) + '">'
          + '<line class="bd-curve-grid" x1="' + PAD_L + '" y1="' + y(0) + '" x2="' + (W - PAD_R) + '" y2="' + y(0) + '"/>'
          + '<path class="bd-curve-area" d="' + area + '"/>'
          + '<path class="bd-curve-line" d="' + line + '"/>';

        if (thresh != null) {
          svg += '<line class="bd-curve-thresh" x1="' + PAD_L + '" y1="' + y(thresh) + '" x2="' + (W - PAD_R) + '" y2="' + y(thresh) + '"/>'
               + '<text class="bd-curve-mark" x="0" y="' + (y(thresh) + 4) + '">' + thresh + '%</text>';
        }
        (conf.marks || []).forEach(function (m) {
          svg += '<text class="bd-curve-mark" x="' + x(m.at) + '" y="' + (H - 8) + '" text-anchor="middle">' + m.label + '</text>';
        });
        svg += '</svg>';

        box.innerHTML = svg;

        var path = box.querySelector('.bd-curve-line');
        var areaEl = box.querySelector('.bd-curve-area');
        if (!path) return;
        if (REDUCED) return;

        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        areaEl.style.opacity = '0';
        // 读一次布局，逼浏览器把上面的初值落下去，否则过渡会被合并掉
        void path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 1.5s ease-out';
        path.style.strokeDashoffset = '0';
        areaEl.style.transition = 'opacity .9s ease-out .35s';
        areaEl.style.opacity = '1';
      }

      box.__bdReplay = render;
      onView(box, render);
    });
  }

  /* 6d. 模式切换：一组按钮切换同一演示的两种配置 */
  function initModes(scope) {
    var groups = (scope || document).querySelectorAll('[data-modes]');
    Array.prototype.forEach.call(groups, function (group) {
      var btns = group.querySelectorAll('.bd-mode');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(btns, function (b) { b.classList.remove('on'); });
          btn.classList.add('on');

          var targetSel = group.getAttribute('data-modes');
          var target = document.querySelector(targetSel);
          if (!target) return;

          // 模式自带的属性覆盖到演示容器上，再重放一次
          var patch = btn.getAttribute('data-set');
          if (patch) {
            patch.split(';').forEach(function (pair) {
              var kv = pair.split('=');
              if (kv.length === 2) target.setAttribute(kv[0].trim(), kv[1].trim());
            });
          }
          var rows = btn.getAttribute('data-rows');
          if (rows) {
            Array.prototype.forEach.call(target.querySelectorAll('.bd-run'), function (row, i) {
              var flags = rows.split(',');
              row.setAttribute('data-flag', (flags[i] || 'ok').trim());
              row.classList.remove('ok', 'bad');
              var out = row.getAttribute('data-out-' + btn.getAttribute('data-mode-id'));
              if (out) row.querySelector('.bd-run-out').textContent = out;
              var flagText = row.getAttribute('data-flagtext-' + btn.getAttribute('data-mode-id'));
              if (flagText) row.querySelector('.bd-run-flag').textContent = flagText;
            });
          }
          var scoreSel = btn.getAttribute('data-score');
          if (scoreSel) {
            var scoreBox = document.querySelector(group.getAttribute('data-score-box'));
            if (scoreBox) {
              scoreBox.querySelector('b').textContent = scoreSel;
              scoreBox.className = 'bd-score ' + (btn.getAttribute('data-score-tone') || '');
            }
          }
          // 流水线的结论条：换了模式，「四段都过」这种话也得跟着换
          var vd = btn.getAttribute('data-verdict');
          if (vd) {
            var vbox = document.querySelector('[data-chain-verdict="' + target.getAttribute('data-chain') + '"]');
            if (vbox) {
              vbox.textContent = vd;
              vbox.className = 'bd-verdict ' + (btn.getAttribute('data-verdict-tone') || 'pass');
            }
          }

          var note = btn.getAttribute('data-note');
          var noteBox = document.querySelector(group.getAttribute('data-note-box'));
          if (note && noteBox) noteBox.innerHTML = note;

          if (typeof target.__bdReplay === 'function') target.__bdReplay();
          console.info('[build] 切换演示模式', { mode: btn.getAttribute('data-mode-id') });
        });
      });
    });
  }

  function init(scope) {
    initTasks(scope);
    initRoutes();
    initReplay(scope);
    initChain(scope);
    initRuns(scope);
    initCurve(scope);
    initModes(scope);
  }

  window.BuildKit = {
    init: init,
    initTasks: initTasks,
    initLog: initLog,
    initRoutes: initRoutes,
    initReplay: initReplay,
    initChain: initChain,
    initRuns: initRuns,
    initCurve: initCurve,
    initModes: initModes,
    paintTrack: paintTrack,
    paintTrackFromLog: paintTrackFromLog,
    onView: onView,
    reduced: REDUCED
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
})();
