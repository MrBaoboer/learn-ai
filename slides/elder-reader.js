/**
 * 功能：敬老版课程阅读器的 hash 路由、目录、翻页、字号与本地进度。
 * 作者：Cursor
 * 日期：2026-08-25
 * 版本：1.0.0
 */
(function () {
  'use strict';

  var COURSE = window.ELDER_COURSE || [];
  var FLAT = window.ELDER_COURSE_FLAT || [];
  if (!FLAT.length) return;

  var PROGRESS_KEY = 'xueai_elder_progress_v1';
  var FONT_KEY = 'xueai_elder_font_size';
  var SIDEBAR_KEY = 'xueai_elder_sidebar_collapsed';
  var SIDEBAR_WIDTH_KEY = 'xueai_elder_sidebar_width_v1';
  var SIDEBAR_WIDTH_DEFAULT = 320;
  var SIDEBAR_WIDTH_MIN = 260;
  var SIDEBAR_WIDTH_MAX = 640;
  var SIDEBAR_COLLAPSE_AT = 210;
  var FONT_MODES = ['small', 'standard', 'large', 'xlarge'];
  var localeMatch = location.pathname.match(/\.(tw|hk)\.html$/);
  var localeSuffix = localeMatch ? '.' + localeMatch[1] : '';
  var byFile = Object.create(null);
  FLAT.forEach(function (lesson, index) {
    byFile[lesson.file] = { index: index, lesson: lesson };
  });

  var root = document.documentElement;
  var chapterTree = document.getElementById('chapterTree');
  var catalogButton = document.getElementById('catalogButton');
  var scrim = document.getElementById('scrim');
  var lessonFrame = document.getElementById('lessonFrame');
  var previousButton = document.getElementById('previousLesson');
  var nextButton = document.getElementById('nextLesson');
  var routeAnnouncer = document.getElementById('routeAnnouncer');
  var searchInput = document.getElementById('readerSearch');
  var searchClear = document.getElementById('readerSearchClear');
  var aliceSearchButton = document.getElementById('aliceSearchButton');
  var lessonFooter = document.querySelector('.lesson-footer');
  var readerSidebar = document.getElementById('courseSidebar');
  var sidebarResizer = document.getElementById('readerSidebarResizer');
  var mobileQuery = window.matchMedia('(max-width: 900px)');
  var progress = loadProgress();
  var currentIndex = 0;
  var fontMode = loadFontMode();
  var aliceReady = false;
  var aliceSideOn = false;
  var aliceAnimationReady = false;
  var currentVisitReady = false;

  function maxSidebarWidth() {
    return Math.max(
      SIDEBAR_WIDTH_MIN,
      Math.min(SIDEBAR_WIDTH_MAX, window.innerWidth - 560)
    );
  }

  function clampSidebarWidth(width) {
    return Math.min(
      maxSidebarWidth(),
      Math.max(SIDEBAR_WIDTH_MIN, Math.round(width))
    );
  }

  function applySidebarWidth(width, persist) {
    var next = clampSidebarWidth(width);
    root.style.setProperty('--reader-sidebar-w', next + 'px');
    if (sidebarResizer) {
      sidebarResizer.setAttribute('aria-valuemax', String(maxSidebarWidth()));
      sidebarResizer.setAttribute('aria-valuenow', String(next));
    }
    if (persist !== false) {
      try {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, String(next));
      } catch (_) {}
    }
    return next;
  }

  function loadSidebarWidth() {
    try {
      var saved = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
      return Number.isFinite(saved) ? saved : SIDEBAR_WIDTH_DEFAULT;
    } catch (_) {
      return SIDEBAR_WIDTH_DEFAULT;
    }
  }

  function setupSidebarResize() {
    if (!sidebarResizer || !readerSidebar) return;
    var startX = 0;
    var startWidth = 0;
    var currentWidth = loadSidebarWidth();
    var rawWidth = currentWidth;
    var pointerId = null;

    function finishResize(shouldCollapse) {
      document.body.classList.remove('reader-sidebar-resizing');
      pointerId = null;
      if (shouldCollapse) {
        root.classList.add('sidebar-collapsed');
        try {
          localStorage.setItem(SIDEBAR_KEY, '1');
        } catch (_) {}
        syncCatalogButton();
        return;
      }
      currentWidth = applySidebarWidth(currentWidth, true);
    }

    sidebarResizer.addEventListener('pointerdown', function (event) {
      if (
        event.button !== 0 ||
        mobileQuery.matches ||
        aliceSideOn ||
        root.classList.contains('sidebar-collapsed')
      ) return;
      startX = event.clientX;
      startWidth = readerSidebar.getBoundingClientRect().width;
      currentWidth = startWidth;
      rawWidth = startWidth;
      pointerId = event.pointerId;
      document.body.classList.add('reader-sidebar-resizing');
      try {
        sidebarResizer.setPointerCapture(pointerId);
      } catch (_) {}
      event.preventDefault();
    });

    sidebarResizer.addEventListener('pointermove', function (event) {
      if (pointerId !== event.pointerId) return;
      rawWidth = startWidth + event.clientX - startX;
      currentWidth = applySidebarWidth(rawWidth, false);
      event.preventDefault();
    });

    sidebarResizer.addEventListener('pointerup', function (event) {
      if (pointerId !== event.pointerId) return;
      var shouldCollapse = rawWidth <= SIDEBAR_COLLAPSE_AT;
      try {
        sidebarResizer.releasePointerCapture(pointerId);
      } catch (_) {}
      finishResize(shouldCollapse);
    });

    sidebarResizer.addEventListener('pointercancel', function (event) {
      if (pointerId !== event.pointerId) return;
      finishResize(false);
    });

    sidebarResizer.addEventListener('dblclick', function () {
      currentWidth = applySidebarWidth(SIDEBAR_WIDTH_DEFAULT, true);
    });

    sidebarResizer.addEventListener('keydown', function (event) {
      var next = parseInt(
        getComputedStyle(root).getPropertyValue('--reader-sidebar-w'),
        10
      ) || SIDEBAR_WIDTH_DEFAULT;
      var step = event.shiftKey ? 40 : 20;
      if (event.key === 'ArrowLeft') next -= step;
      else if (event.key === 'ArrowRight') next += step;
      else if (event.key === 'Home') next = SIDEBAR_WIDTH_DEFAULT;
      else return;
      event.preventDefault();
      currentWidth = applySidebarWidth(next, true);
    });
  }

  function loadProgress() {
    var merged = {};
    [PROGRESS_KEY, 'xueai_elder_lesson_progress_v1'].forEach(function (key) {
      try {
        var saved = JSON.parse(localStorage.getItem(key) || '{}');
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
        Object.keys(saved).forEach(function (file) {
          var entry = saved[file];
          if (entry === true || entry === 1 || (entry && typeof entry === 'object')) merged[file] = 1;
        });
      } catch (_) {}
    });
    return merged;
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (_) {}
  }

  function loadFontMode() {
    try {
      var saved = localStorage.getItem(FONT_KEY);
      return FONT_MODES.indexOf(saved) >= 0 ? saved : 'standard';
    } catch (_) {
      return 'standard';
    }
  }

  function makeIconCaret() {
    var span = document.createElement('span');
    span.className = 'chapter-caret';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
    return span;
  }

  function buildTree() {
    var fragment = document.createDocumentFragment();

    COURSE.forEach(function (chapter, chapterIndex) {
      var section = document.createElement('section');
      section.className = 'chapter collapsed';
      section.dataset.chapterIndex = String(chapterIndex);

      var listId = 'elder-chapter-' + chapter.num;
      var toggle = document.createElement('button');
      toggle.className = 'chapter-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', listId);
      toggle.setAttribute('aria-label', '第 ' + chapter.num + ' 章，' + chapter.title + '，展开课题');

      var number = document.createElement('span');
      number.className = 'chapter-number';
      number.textContent = chapter.num;

      var name = document.createElement('span');
      name.className = 'chapter-name';
      name.textContent = chapter.title;

      var count = document.createElement('span');
      count.className = 'chapter-count';
      count.textContent = '0 / ' + chapter.lessons.length;

      toggle.appendChild(number);
      toggle.appendChild(name);
      toggle.appendChild(count);
      toggle.appendChild(makeIconCaret());

      var list = document.createElement('ul');
      list.className = 'lesson-list';
      list.id = listId;

      chapter.lessons.forEach(function (lesson) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.className = 'lesson-link';
        link.href = '#' + encodeURIComponent(lesson.file);
        link.dataset.file = lesson.file;

        var status = document.createElement('span');
        status.className = 'lesson-status';
        status.setAttribute('aria-hidden', 'true');

        var title = document.createElement('span');
        title.textContent = lesson.title;

        link.appendChild(status);
        link.appendChild(title);
        item.appendChild(link);
        list.appendChild(item);
      });

      toggle.addEventListener('click', function () {
        var collapsed = section.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute(
          'aria-label',
          '第 ' + chapter.num + ' 章，' + chapter.title + '，' + (collapsed ? '展开课题' : '收起课题')
        );
      });

      section.appendChild(toggle);
      section.appendChild(list);
      fragment.appendChild(section);
    });

    chapterTree.replaceChildren(fragment);
    chapterTree.addEventListener('click', function (event) {
      var link = event.target.closest('.lesson-link');
      if (link && mobileQuery.matches) closeMobileDrawer(false);
    });
  }

  function completed(file) {
    return progress[file] === true || progress[file] === 1;
  }

  function refreshProgress() {
    var done = FLAT.reduce(function (total, lesson) {
      return total + (completed(lesson.file) ? 1 : 0);
    }, 0);
    var total = FLAT.length;
    var percent = total ? Math.round(done / total * 100) : 0;

    document.getElementById('progressText').textContent = done + ' / ' + total;
    document.getElementById('progressBar').style.width = percent + '%';
    var track = document.getElementById('progressTrack');
    track.setAttribute('aria-valuemax', String(total));
    track.setAttribute('aria-valuenow', String(done));
    track.setAttribute('aria-valuetext', '已完成 ' + done + ' 课，共 ' + total + ' 课');

    chapterTree.querySelectorAll('.lesson-link').forEach(function (link) {
      var isDone = completed(link.dataset.file);
      link.classList.toggle('done', isDone);
      var lesson = byFile[link.dataset.file].lesson;
      link.setAttribute('aria-label', (isDone ? '已完成：' : '未完成：') + lesson.title);
    });

    chapterTree.querySelectorAll('.chapter').forEach(function (section) {
      var chapter = COURSE[Number(section.dataset.chapterIndex)];
      var chapterDone = chapter.lessons.reduce(function (sum, lesson) {
        return sum + (completed(lesson.file) ? 1 : 0);
      }, 0);
      section.querySelector('.chapter-count').textContent = chapterDone + ' / ' + chapter.lessons.length;
    });

    refreshLessonNavigation();
  }

  function syncSearch() {
    var query = searchInput.value.trim().toLowerCase();
    var hasQuery = query.length > 0;
    searchClear.hidden = !hasQuery;

    chapterTree.querySelectorAll('.chapter').forEach(function (section) {
      var chapter = COURSE[Number(section.dataset.chapterIndex)];
      var chapterMatch = chapter.title.toLowerCase().indexOf(query) >= 0;
      var matchedLessons = 0;

      section.querySelectorAll('.lesson-link').forEach(function (link) {
        var lesson = byFile[link.dataset.file].lesson;
        var match = !hasQuery || chapterMatch ||
          lesson.title.toLowerCase().indexOf(query) >= 0;
        link.closest('li').hidden = !match;
        if (match) matchedLessons += 1;
      });

      section.hidden = hasQuery && matchedLessons === 0;
      if (hasQuery && matchedLessons) {
        section.classList.remove('collapsed');
        section.querySelector('.chapter-toggle').setAttribute('aria-expanded', 'true');
      }
    });

    aliceSearchButton.hidden = !(aliceReady && query.length >= 2);
    if (!aliceSearchButton.hidden) {
      aliceSearchButton.textContent = '让白艾莉搜一搜“' +
        searchInput.value.trim().slice(0, 16) + '”';
    }
  }

  function refreshLessonNavigation() {
    var file = FLAT[currentIndex].file;
    var isDone = completed(file);
    nextButton.classList.toggle('ready', currentVisitReady);
    nextButton.dataset.lessonComplete = isDone ? 'true' : 'false';
    nextButton.dataset.visitReady = currentVisitReady ? 'true' : 'false';
  }

  function decodeHash() {
    var raw = (location.hash || '').replace(/^#/, '');
    if (!raw) return '';
    try {
      return decodeURIComponent(raw).trim();
    } catch (_) {
      return '';
    }
  }

  function routeFile() {
    var file = decodeHash();
    return byFile[file] ? file : FLAT[0].file;
  }

  function lessonUrl(file) {
    var localized = localeSuffix
      ? file.replace(/(?:\.(?:tw|hk))?\.html$/, localeSuffix + '.html')
      : file.replace(/\.(?:tw|hk)\.html$/, '.html');
    return localized + (localized.indexOf('?') >= 0 ? '&' : '?') + 'embed=1';
  }

  function normalizeHash() {
    var file = routeFile();
    if (decodeHash() !== file) {
      history.replaceState(null, '', '#' + encodeURIComponent(file));
    }
    return file;
  }

  function setStepButton(button, titleElementId, lesson, edgeText) {
    var title = document.getElementById(titleElementId);
    if (!lesson) {
      button.classList.add('disabled');
      button.removeAttribute('href');
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
      title.textContent = edgeText;
      return;
    }
    button.classList.remove('disabled');
    button.href = '#' + encodeURIComponent(lesson.file);
    button.removeAttribute('aria-disabled');
    button.removeAttribute('tabindex');
    title.textContent = lesson.title;
  }

  function highlightCurrent(lesson) {
    chapterTree.querySelectorAll('.chapter').forEach(function (section) {
      section.classList.toggle('current', Number(section.dataset.chapterIndex) === lesson.chapterIndex);
    });

    chapterTree.querySelectorAll('.lesson-link').forEach(function (link) {
      var active = link.dataset.file === lesson.file;
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        var section = link.closest('.chapter');
        var toggle = section.querySelector('.chapter-toggle');
        section.classList.remove('collapsed');
        toggle.setAttribute('aria-expanded', 'true');
        link.scrollIntoView({ block: 'nearest' });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function loadLesson(file) {
    var found = byFile[file] || byFile[FLAT[0].file];
    currentIndex = found.index;
    var lesson = found.lesson;
    currentVisitReady = false;

    window.__ELDER_ALICE_PAGE__ = {
      file: lesson.file,
      title: lesson.title
    };
    lessonFrame.src = lessonUrl(lesson.file);
    lessonFrame.title = '课程正文：' + lesson.title;
    document.getElementById('currentTitle').textContent =
      '第 ' + lesson.chapterNum + ' 章 · ' + lesson.title;
    document.title = lesson.title + '｜白艾莉小姐爸妈版';

    highlightCurrent(lesson);
    setStepButton(previousButton, 'previousTitle', FLAT[currentIndex - 1], '已经是第一课');
    setStepButton(nextButton, 'nextTitle', FLAT[currentIndex + 1], '已经是最后一课');
    refreshLessonNavigation();
    routeAnnouncer.textContent =
      '已打开第 ' + (currentIndex + 1) + ' 课，共 ' + FLAT.length + ' 课：' + lesson.title;

    if (mobileQuery.matches) closeMobileDrawer(false);
  }

  function applyFontMode(mode, persist) {
    if (FONT_MODES.indexOf(mode) < 0) mode = 'standard';
    fontMode = mode;
    root.dataset.elderFontSize = mode;

    document.querySelectorAll('#fontControls button[data-font-size]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.fontSize === mode));
    });

    if (persist !== false) {
      try {
        localStorage.setItem(FONT_KEY, mode);
      } catch (_) {}
    }
    syncFrameFont();
  }

  function syncFrameFont() {
    try {
      var frameRoot = lessonFrame.contentDocument && lessonFrame.contentDocument.documentElement;
      if (frameRoot) frameRoot.dataset.elderFontSize = fontMode;
      if (lessonFrame.contentWindow && lessonFrame.contentWindow.ElderFontSize) {
        lessonFrame.contentWindow.ElderFontSize.apply(fontMode, false);
      }
    } catch (_) {}
  }

  function pushAliceInset() {
    if (!lessonFrame.contentWindow) return;
    try {
      lessonFrame.contentWindow.postMessage({
        type: 'xueai-reader-inset',
        top: 0,
        bottom: lessonFooter ? lessonFooter.offsetHeight : 0
      }, location.origin);
    } catch (_) {}
  }

  function applyAliceLayout(detail) {
    var width = Math.max(0, parseInt(detail.w, 10) || 0);
    aliceSideOn = width > 0;
    root.style.setProperty('--alice-side-w', width + 'px');
    document.body.classList.toggle('alice-side-on', aliceSideOn);
    document.body.classList.toggle('alice-mobile-on', !!detail.mobile);
    document.body.classList.toggle('alice-live', !!detail.live);
    if (!aliceSideOn) {
      document.body.classList.remove('drawer-open');
    }
    syncCatalogButton();
    if (!aliceAnimationReady) {
      aliceAnimationReady = true;
      requestAnimationFrame(function () {
        document.body.classList.add('alice-anim');
      });
    }
    requestAnimationFrame(pushAliceInset);
  }

  function desktopSidebarCollapsed() {
    try {
      var saved = localStorage.getItem(SIDEBAR_KEY);
      return saved === null ? true : saved === '1';
    } catch (_) {
      return true;
    }
  }

  function sidebarVisible() {
    return (mobileQuery.matches || aliceSideOn)
      ? document.body.classList.contains('drawer-open')
      : !root.classList.contains('sidebar-collapsed');
  }

  function syncCatalogButton() {
    var visible = sidebarVisible();
    catalogButton.setAttribute('aria-expanded', String(visible));
    catalogButton.title = visible ? '收起课程目录' : '展开课程目录';
  }

  function closeMobileDrawer(restoreFocus) {
    document.body.classList.remove('drawer-open');
    syncCatalogButton();
    if (restoreFocus) catalogButton.focus();
  }

  function toggleSidebar() {
    if (mobileQuery.matches || aliceSideOn) {
      var open = !document.body.classList.contains('drawer-open');
      document.body.classList.toggle('drawer-open', open);
      syncCatalogButton();
      if (open) {
        requestAnimationFrame(function () {
          var active = chapterTree.querySelector('.lesson-link.active');
          if (active) active.focus({ preventScroll: true });
        });
      }
      return;
    }

    var collapsed = !root.classList.contains('sidebar-collapsed');
    root.classList.toggle('sidebar-collapsed', collapsed);
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
    } catch (_) {}
    syncCatalogButton();
  }

  function applyResponsiveSidebar() {
    document.body.classList.remove('drawer-open');
    if (mobileQuery.matches) {
      root.classList.remove('sidebar-collapsed');
    } else {
      root.classList.toggle('sidebar-collapsed', desktopSidebarCollapsed());
    }
    syncCatalogButton();
  }

  function goByKeyboard(direction) {
    var target = FLAT[currentIndex + direction];
    if (target) location.hash = '#' + encodeURIComponent(target.file);
  }

  function handleKeyboard(event) {
    if (event.key === 'Escape' && mobileQuery.matches && document.body.classList.contains('drawer-open')) {
      event.preventDefault();
      closeMobileDrawer(true);
      return;
    }
    if (!event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goByKeyboard(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  buildTree();
  applySidebarWidth(loadSidebarWidth(), false);
  setupSidebarResize();
  applyResponsiveSidebar();
  applyFontMode(fontMode, false);
  refreshProgress();
  loadLesson(normalizeHash());

  catalogButton.addEventListener('click', toggleSidebar);
  scrim.addEventListener('click', function () {
    closeMobileDrawer(true);
  });
  searchInput.addEventListener('input', syncSearch);
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    syncSearch();
    searchInput.focus();
  });
  aliceSearchButton.addEventListener('click', function () {
    var query = searchInput.value.trim();
    if (!aliceReady || query.length < 2 || !lessonFrame.contentWindow) return;
    lessonFrame.contentWindow.postMessage({
      type: 'xueai-alice-search',
      q: query
    }, location.origin);
    if (mobileQuery.matches) closeMobileDrawer(false);
  });

  document.getElementById('fontControls').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-font-size]');
    if (button) applyFontMode(button.dataset.fontSize, true);
  });

  lessonFrame.addEventListener('load', function () {
    syncFrameFont();
    aliceReady = false;
    syncSearch();
    try {
      lessonFrame.contentWindow.postMessage({ type: 'xueai-alice-hello' }, location.origin);
    } catch (_) {}
    pushAliceInset();
    try {
      lessonFrame.contentDocument.addEventListener('keydown', handleKeyboard);
    } catch (_) {}
  });

  window.addEventListener('message', function (event) {
    if (event.source !== lessonFrame.contentWindow || event.origin !== location.origin) return;
    var detail = event.data;
    if (!detail) return;
    if (detail.type === 'xueai-alice-side') {
      applyAliceLayout(detail);
      return;
    }
    if (detail.type === 'xueai-alice-ready') {
      aliceReady = !!detail.enabled;
      syncSearch();
      return;
    }
    if (detail.type === 'xueai-alice-goto') {
      var targetFile = String(detail.file || '');
      if (byFile[targetFile]) location.hash = '#' + encodeURIComponent(targetFile);
      return;
    }
    if (!detail || !byFile[detail.file]) return;
    if (detail.type !== 'elder-lesson-complete' &&
        detail.type !== 'elder-lesson-state' &&
        detail.type !== 'elder-lesson-progress') return;
    if (detail.file === FLAT[currentIndex].file &&
        (detail.type === 'elder-lesson-complete' ||
         (detail.type === 'elder-lesson-progress' && detail.atEnd))) {
      currentVisitReady = true;
      refreshLessonNavigation();
    }
    if (detail.completed && !completed(detail.file)) {
      progress[detail.file] = 1;
      saveProgress();
      refreshProgress();
    }
  });

  window.addEventListener('hashchange', function () {
    loadLesson(normalizeHash());
  });
  window.addEventListener('storage', function (event) {
    if (event.key === FONT_KEY) applyFontMode(loadFontMode(), false);
    if (event.key === SIDEBAR_WIDTH_KEY) {
      applySidebarWidth(loadSidebarWidth(), false);
    }
    if (event.key === PROGRESS_KEY || event.key === 'xueai_elder_lesson_progress_v1') {
      progress = loadProgress();
      refreshProgress();
    }
  });
  document.addEventListener('keydown', handleKeyboard);
  if (window.ResizeObserver && lessonFooter) {
    new ResizeObserver(pushAliceInset).observe(lessonFooter);
  }
  window.addEventListener('resize', function () {
    applySidebarWidth(loadSidebarWidth(), false);
    pushAliceInset();
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', applyResponsiveSidebar);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(applyResponsiveSidebar);
  }
})();
