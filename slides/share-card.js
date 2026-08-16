/* 课程分享卡片：顶栏「分享」→ 尖角浮层 + 本节海报
   —— 详见 PRD-share-card.md。

   对外只有一个入口：
     XueaiShareCard.mount({btn, getLesson, lang})
       btn       顶栏那颗「分享」按钮
       getLesson 返回当前课节对象（需含 file / title / tag / topicTitle / partNum / partTitle）
       lang      'zh' | 'en' | 'ko'

   海报走 canvas 单一渲染路径：预览用的 dataURL 和「下载图片」拿到的图片是同一张，
   不存在「看到的和存下来的不一样」。二维码依赖同目录的 qr.js；qr.js 缺失时海报照出，
   只是没有二维码区，不阻塞、不报错。

   Copyright (c) 2025 Miyang Tech (Zhuhai Hengqin) Co., Ltd. — MIT License */
(function () {
  'use strict';

  var MOBILE_MAX = 640;          /* 与 share-card.css 的断点保持一致 */
  var POSTER_W = 750;            /* 海报逻辑坐标系，3:4 竖图，微信预览不裁切 */
  var POSTER_H = 1000;
  var POSTER_SCALE = 2;          /* 输出 1500×2000 */
  /* 海报是「渐变底 + 斜线底纹」，PNG 存这种图要 2.2MB，同画面 JPEG q=.92 只要 460KB。
     体积差近五倍，而 1500px 宽下大字号文本看不出压缩痕迹，所以走 JPEG。 */
  var POSTER_MIME = 'image/jpeg';
  var POSTER_QUALITY = 0.92;
  var POSTER_EXT = 'jpg';
  var CACHE_MAX = 5;             /* dataURL 只驻内存，长会话不无限堆 */
  var CHROME_H = 120;            /* 浮层里除预览外的固定高度（标题+提示+动作+内边距+描边） */

  /* 海报底图是 Alice + 洛小山的邀请插画（暖奶油调），配色跟着它走，
     而不是站点那套蓝渐变——渐变底的海报太冷静，也压不住插画。
     插画上 42% 是刻意留出的空白，文字全部叠在那里；左下角留给二维码。 */
  var INK = '#2c2620';           /* 标题墨色，比纯黑更贴插画的暖调 */
  var INK_SOFT = '#95866f';      /* 篇章、落款的暖灰 */
  var PAPER = '#fdf6e6';         /* 插画没加载出来时的兜底底色 */

  /* 海报素材一律同源：站点图床没配 CORS，跨域取图会污染 canvas，
     toDataURL 直接抛 SecurityError。 */
  var ART = {
    logo: 'assets/logo.png',       /* 站点吉祥物小图标 */
    art: 'assets/poster-art.webp'  /* Alice + 洛小山，上部大片留白 */
  };

  /* 课程名沿用各语言页原有的分享文案，不取 course-data 里的标题——两者历史上就不一致，
     这里以「用户已经在用的那句」为准，保证剪贴板内容和改造前逐字相同。 */
  var I18N = {
    zh: {
      page: 'learn.html',
      course: '学 AI 产品，从入门到精通',
      quote: ['「', '」'],
      panelTitle: '分享这一节',
      hintDesktop: '右键图片可另存，或点下方按钮下载',
      hintMobile: '长按图片保存，发给朋友',
      download: '下载图片',
      copyLink: '复制链接',
      systemShare: '系统分享',
      close: '关闭',
      copied: '链接已复制，去粘贴给朋友吧',
      copyFail: '复制失败，请手动复制地址栏链接',
      downloading: '已开始下载，如未响应请长按图片保存',
      posterCta: '扫码继续学这一节',
      posterBrand: 'xueai.app · 小山学堂',
      fileTag: '小山学堂'
    },
    en: {
      page: 'learn.en.html',
      course: 'AI from Fundamentals to Mastery',
      quote: ['"', '"'],
      panelTitle: 'Share this lesson',
      hintDesktop: 'Right-click to save, or use the button below',
      hintMobile: 'Press and hold to save, then send it to a friend',
      download: 'Download image',
      copyLink: 'Copy link',
      systemShare: 'Share…',
      close: 'Close',
      copied: 'Link copied — share it with a friend!',
      copyFail: 'Copy failed — please copy the URL manually.',
      downloading: 'Download started — long-press the image if nothing happens',
      posterCta: 'Scan to keep learning',
      posterBrand: 'xueai.app · Xiaoshan Academy',
      fileTag: 'xueai'
    },
    ko: {
      page: 'learn.ko.html',
      course: 'AI 입문부터 마스터까지',
      quote: ['「', '」'],
      panelTitle: '이 강의 공유',
      hintDesktop: '이미지를 우클릭해 저장하거나 아래 버튼을 누르세요',
      hintMobile: '이미지를 길게 눌러 저장한 뒤 친구에게 보내세요',
      download: '이미지 저장',
      copyLink: '링크 복사',
      systemShare: '공유',
      close: '닫기',
      copied: '링크가 복사되었습니다. 친구에게 공유해보세요!',
      copyFail: '복사 실패. 주소창 링크를 직접 복사해 주세요.',
      downloading: '저장을 시작했습니다. 반응이 없으면 이미지를 길게 눌러 저장하세요',
      posterCta: '스캔해서 이어서 학습하기',
      posterBrand: 'xueai.app · 샤오산 아카데미',
      fileTag: 'xueai'
    }
  };

  /* Lucide：download / link-2 / share-2 / x */
  var ICONS = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"'
      + ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  /* ── 圆角矩形路径（canvas 没有原生 API，certificate/lei-test 里也是自己画） ── */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* 换行必须按语言分流：中文逐字断行是对的，但英韩逐字会把单词从中间劈开。
     韩文以空格分「어절」，与英文同路。 */
  function wrapLines(ctx, text, maxWidth, lang, maxLines) {
    var str = String(text || '').trim();
    if (!str) return [];
    var units = lang === 'zh' ? str.split('') : str.split(/(\s+)/);
    var lines = [];
    var line = '';
    var truncated = false;        /* 只有真有字没排进去才加省略号 */
    for (var i = 0; i < units.length; i++) {
      var u = units[i];
      if (lang !== 'zh' && /^\s+$/.test(u)) {          /* 空白只在行内保留 */
        if (line) line += u;
        continue;
      }
      var next = line + u;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line.replace(/\s+$/, ''));
        if (lines.length >= maxLines) { truncated = true; break; }
        line = u;
      } else {
        line = next;
      }
    }
    if (!truncated && line) lines.push(line.replace(/\s+$/, ''));
    /* 排不下就在最后一行收口，别把标题硬塞进版面 */
    if (truncated) {
      var last = lines[lines.length - 1];
      while (last && ctx.measureText(last + '…').width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[lines.length - 1] = last + '…';
    }
    return lines;
  }

  /* 单行超宽时截断加省略号（篇章名这类一行文本用） */
  function ellipsize(ctx, text, maxWidth) {
    var str = String(text || '');
    if (ctx.measureText(str).width <= maxWidth) return str;
    while (str && ctx.measureText(str + '…').width > maxWidth) str = str.slice(0, -1);
    return str + '…';
  }

  function fontStack(lang) {
    if (lang === 'ko') {
      return '"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",-apple-system,sans-serif';
    }
    return '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",'
      + 'Helvetica,Arial,sans-serif';
  }

  function mount(opts) {
    opts = opts || {};
    var btn = opts.btn;
    var getLesson = opts.getLesson;
    var lang = I18N[opts.lang] ? opts.lang : 'zh';
    var T = I18N[lang];
    if (!btn || typeof getLesson !== 'function') return null;

    var FONT = fontStack(lang);
    /* 韩文字形偏高，同字号下三行会挤在一起，行高与字号单独给值 */
    var KO = lang === 'ko';

    var pop = null, scrim = null, imgEl = null, previewEl = null, hintEl = null;
    var btnDl = null, btnCopy = null, btnSys = null;
    var isOpen = false;
    var current = null;          /* {lesson, url, text, dataUrl} */
    var cache = [];              /* [{key, dataUrl}]，LRU，最多 CACHE_MAX */

    /* 品牌标同源取，避免跨域把 canvas 污染成 toDataURL 抛 SecurityError。
       站点图床没配 CORS，这里只能用本地 assets。 */
    /* 海报素材统一预加载。加载失败的那张会被 drawPoster 跳过，海报照出。 */
    var art = {};
    var pending = 0;
    var artWaiters = [];
    Object.keys(ART).forEach(function (k) {
      var img = new Image();
      pending++;
      img.onload = img.onerror = function () {
        if (--pending === 0) flushArt();
      };
      img.src = ART[k];
      art[k] = img;
    });

    function flushArt() {
      var queue = artWaiters;
      artWaiters = [];
      queue.forEach(function (fn) { fn(); });
    }

    /* 素材没到就等，但最多等 1.5s——图挂了也不能让面板一直转圈 */
    function whenArtReady(cb) {
      if (pending === 0) { cb(); return; }
      var fired = false;
      function once() {
        if (fired) return;
        fired = true;
        cb();
      }
      artWaiters.push(once);
      setTimeout(once, 1500);
    }

    function usable(img) {
      return img && img.complete && img.naturalWidth > 0;
    }

    function lessonUrl(lesson) {
      return 'https://xueai.app/slides/' + T.page + '#' + encodeURIComponent(lesson.file);
    }

    function lessonText(lesson) {
      return T.quote[0] + lesson.title + T.quote[1] + ' — ' + T.course;
    }

    /* ── toast：复用 learn 页已有的 #shareToast，样式和位置不另起一套 ── */
    function toast(msg) {
      var t = document.getElementById('shareToast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'share-toast';
        t.id = 'shareToast';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(function () { t.classList.remove('show'); }, 2400);
    }

    function buildDom() {
      scrim = document.createElement('div');
      scrim.className = 'xsc-scrim';
      scrim.hidden = true;

      pop = document.createElement('div');
      pop.className = 'xsc-pop';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', T.panelTitle);
      pop.hidden = true;
      pop.innerHTML =
        '<div class="xsc-head"><span>' + esc(T.panelTitle) + '</span>'
        + '<button type="button" class="xsc-close" aria-label="' + esc(T.close) + '">'
        + svg('x') + '</button></div>'
        + '<div class="xsc-preview loading"><img class="xsc-img" alt="' + esc(T.panelTitle) + '"></div>'
        + '<div class="xsc-hint"></div>'
        + '<div class="xsc-acts">'
        + '<button type="button" class="xsc-btn primary" data-act="dl">' + svg('download')
        + '<span>' + esc(T.download) + '</span></button>'
        + '<button type="button" class="xsc-btn" data-act="copy">' + svg('link')
        + '<span>' + esc(T.copyLink) + '</span></button>'
        + '<button type="button" class="xsc-btn" data-act="sys" hidden>' + svg('share')
        + '<span>' + esc(T.systemShare) + '</span></button>'
        + '</div>';

      document.body.appendChild(scrim);
      document.body.appendChild(pop);

      imgEl = pop.querySelector('.xsc-img');
      previewEl = pop.querySelector('.xsc-preview');
      hintEl = pop.querySelector('.xsc-hint');
      btnDl = pop.querySelector('[data-act="dl"]');
      btnCopy = pop.querySelector('[data-act="copy"]');
      btnSys = pop.querySelector('[data-act="sys"]');

      pop.querySelector('.xsc-close').addEventListener('click', close);
      scrim.addEventListener('click', close);
      btnDl.addEventListener('click', download);
      btnCopy.addEventListener('click', copyLink);
      btnSys.addEventListener('click', systemShare);
    }

    /* ── 定位：桌面端贴按钮下方并让尖角对准按钮中心；移动端交给 CSS 贴底 ── */
    function position() {
      if (!pop || pop.hidden) return;
      if (isMobile()) {
        pop.style.top = '';
        pop.style.left = '';
        pop.style.setProperty('--xsc-img-h',
          Math.max(180, Math.min(320, Math.round(window.innerHeight * 0.42))) + 'px');
        return;
      }
      var r = btn.getBoundingClientRect();
      var popW = pop.offsetWidth || 288;
      var left = r.left + r.width / 2 - popW / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
      var top = r.bottom + 10;
      pop.style.left = Math.round(left) + 'px';
      pop.style.top = Math.round(top) + 'px';
      /* 矮屏别让浮层顶到视口外，预览高度按剩余空间收 */
      var avail = window.innerHeight - top - 14 - CHROME_H;
      pop.style.setProperty('--xsc-img-h',
        Math.max(160, Math.min(320, Math.round(avail))) + 'px');
      /* 尖角是绝对定位伪元素，起点是内边距框，要扣掉左边框那 1px */
      pop.style.setProperty('--xsc-caret',
        Math.round(r.left + r.width / 2 - left - pop.clientLeft) + 'px');
    }

    /* ── 海报绘制 ─────────────────────────────────────────────────────── */
    function drawPoster(lesson) {
      var cv = document.createElement('canvas');
      cv.width = POSTER_W * POSTER_SCALE;
      cv.height = POSTER_H * POSTER_SCALE;
      var ctx = cv.getContext('2d');
      if (!ctx) return null;
      ctx.scale(POSTER_SCALE, POSTER_SCALE);

      var W = POSTER_W, H = POSTER_H, PAD = 56;
      var innerW = W - PAD * 2;

      /* 底图：Alice + 洛小山的邀请插画。按宽度铺满、底边对齐——插画是竖长的，
         多出来的高度只能从顶上裁，那里本来就是留白，裁掉不心疼；反过来裁底边
         会把两个人的脚切了。插画没加载出来就退回纯色，版式不塌。 */
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      if (usable(art.art)) {
        var iw = art.art.naturalWidth, ih = art.art.naturalHeight;
        var dw = W, dh = W * ih / iw;
        ctx.drawImage(art.art, 0, H - dh, dw, dh);
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      /* 顶部品牌：本地 logo + 课程名。图没加载成功就只留文字，不阻塞出图 */
      var brandX = PAD;
      if (usable(art.logo)) {
        var lh = 36, lw = lh * art.logo.naturalWidth / art.logo.naturalHeight;
        ctx.save();
        roundRect(ctx, brandX, 46, lw, lh, 9);
        ctx.clip();
        ctx.drawImage(art.logo, brandX, 46, lw, lh);
        ctx.restore();
        brandX += lw + 12;
      }
      ctx.fillStyle = INK;
      ctx.font = '800 22px ' + FONT;
      ctx.fillText(ellipsize(ctx, T.course, W - brandX - PAD), brandX, 71);

      /* 篇章：num + title，是这一节在课程里的位置 */
      var partLine = [lesson.partNum, lesson.partTitle].filter(Boolean).join(' · ')
        || lesson.topicTitle || '';
      var partSize = KO ? 20 : 21;
      var tag = lesson.tag || '';
      var tagH = tag ? 38 : 0;

      /* 文字只能待在插画顶部那片留白里（约上 42%），越界就会压到 Alice 头发。
         下面这条 SKY_BOTTOM 是硬边界，标题字号和行数都按它反推。 */
      var SKY_TOP = 118, SKY_BOTTOM = Math.round(H * 0.41);

      /* 主视觉：本节标题。字号按字数自适应，最多 3 行 */
      var title = lesson.title || '';
      var size = KO ? 44 : 50;
      if (title.length > 30) size = KO ? 30 : 34;
      else if (title.length > 18) size = KO ? 34 : 38;
      else if (title.length > 12) size = KO ? 39 : 44;
      ctx.font = '800 ' + size + 'px ' + FONT;
      var lines = wrapLines(ctx, title, innerW, lang, 3);
      var lineH = Math.round(size * (KO ? 1.46 : 1.34));

      /* 整块（篇章 + 标签 + 标题）在留白带里垂直居中：
         单行标题不会孤零零吊在最上面，三行标题也不会顶到插画 */
      var GAP_PART = 18, GAP_TAG = tag ? 26 : 0;
      var blockH = partSize + GAP_PART + tagH + GAP_TAG + lines.length * lineH;
      var y = SKY_TOP + Math.max(0, (SKY_BOTTOM - SKY_TOP - blockH) / 2);

      ctx.fillStyle = INK_SOFT;
      ctx.font = '700 ' + partSize + 'px ' + FONT;
      y += partSize;
      ctx.fillText(ellipsize(ctx, partLine, innerW), PAD, y);
      y += GAP_PART;

      /* 标签胶囊：配色取站内 TAG_STYLE，与侧栏、面包屑一致。
         站内那套底色是给白底设计的浅色调，直接放奶油底上会糊成一片，
         所以先垫一层纯白再叠色。 */
      if (tag) {
        var style = (window.TAG_STYLE || {})[tag] || { bg: '#ffffff', fg: INK };
        ctx.font = '800 ' + (KO ? 19 : 20) + 'px ' + FONT;
        var tw = ctx.measureText(tag).width + 32;
        roundRect(ctx, PAD, y, tw, tagH, 11);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        roundRect(ctx, PAD, y, tw, tagH, 11);
        ctx.fillStyle = style.bg;
        ctx.fill();
        ctx.fillStyle = style.fg;
        ctx.fillText(tag, PAD + 16, y + 26);
        y += tagH + GAP_TAG;
      }

      ctx.fillStyle = INK;
      ctx.font = '800 ' + size + 'px ' + FONT;
      for (var i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], PAD, y + Math.round(size * 0.86) + i * lineH);
      }

      /* 左下角：二维码 + 引导语。插画把左下这块专门留空了，所以这里不需要
         整条白卡去盖插画——只给二维码本身一张小白卡当静默区就够。 */
      var qSize = 132, qPad = 11;
      var qCardX = PAD, qCardY = H - 296;
      var qCard = qSize + qPad * 2;

      ctx.save();
      ctx.shadowColor = 'rgba(88,70,40,0.16)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 5;
      roundRect(ctx, qCardX, qCardY, qCard, qCard, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      /* 二维码：qr.js 缺失或抛错就整块跳过，海报照出 */
      try {
        if (typeof window.qrcode === 'function') {
          var q = window.qrcode(0, 'M');
          q.addData(lessonUrl(lesson));
          q.make();
          var n = q.getModuleCount();
          var cell = qSize / n;
          /* 静默区由白卡的 11px 内边距提供，按 cell≈4px 算够 2.7 个模块；
             加上海报本身是浅底，实测扫码稳定 */
          ctx.fillStyle = '#1c1a17';
          for (var r2 = 0; r2 < n; r2++) {
            for (var c2 = 0; c2 < n; c2++) {
              if (q.isDark(r2, c2)) {
                ctx.fillRect(qCardX + qPad + c2 * cell, qCardY + qPad + r2 * cell,
                  cell + 0.5, cell + 0.5);
              }
            }
          }
        }
      } catch (e) {
        if (window.console) console.warn('[share-card] 二维码生成失败，海报降级为无码版', e);
      }

      /* 引导语和落款都压在二维码正下方那条空白里。宽度只敢给到 44%——
         再往右就是狐狸的靴子，英文文案本来就长，所以允许折成两行。 */
      var footMax = W * 0.44, footY = qCardY + qCard + 38;
      ctx.fillStyle = INK;
      ctx.font = '800 ' + (KO ? 21 : 23) + 'px ' + FONT;
      var ctaLines = wrapLines(ctx, T.posterCta, footMax, lang, 2);
      for (var k = 0; k < ctaLines.length; k++) {
        ctx.fillText(ctaLines[k], PAD, footY + k * 30);
      }
      ctx.fillStyle = INK_SOFT;
      ctx.font = '600 18px ' + FONT;
      ctx.fillText(ellipsize(ctx, T.posterBrand, footMax), PAD,
        footY + ctaLines.length * 30 + 4);

      try {
        return cv.toDataURL(POSTER_MIME, POSTER_QUALITY);
      } catch (e) {
        if (window.console) console.warn('[share-card] canvas 导出失败', e);
        return null;
      }
    }

    function cacheGet(key) {
      for (var i = 0; i < cache.length; i++) {
        if (cache[i].key === key) {
          var hit = cache.splice(i, 1)[0];
          cache.push(hit);
          return hit.dataUrl;
        }
      }
      return null;
    }

    function cachePut(key, dataUrl) {
      cache.push({ key: key, dataUrl: dataUrl });
      while (cache.length > CACHE_MAX) cache.shift();
    }

    /* 懒渲染：只在打开面板时画，页面加载阶段一张都不画 */
    function ensurePoster(lesson, done) {
      var key = lesson.file + '|' + lang;
      var hit = cacheGet(key);
      if (hit) { done(hit); return; }
      whenArtReady(function () {
        var url = drawPoster(lesson);
        if (url) cachePut(key, url);
        done(url);
      });
    }

    /* ── 动作 ─────────────────────────────────────────────────────────── */
    function download() {
      if (!current || !current.dataUrl) return;
      var name = (I18N[lang].fileTag + '-' + (current.lesson.title || 'lesson'))
        .replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 60);
      var a = document.createElement('a');
      a.href = current.dataUrl;
      a.download = name + '.' + POSTER_EXT;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast(T.downloading);
    }

    function copyLink() {
      if (!current) return;
      var full = current.text + ' ' + current.url;
      function legacy() {
        var tmp = document.createElement('textarea');
        tmp.value = full;
        tmp.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); toast(T.copied); }
        catch (e) { toast(T.copyFail); }
        document.body.removeChild(tmp);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(function () { toast(T.copied); }, legacy);
      } else legacy();
    }

    /* 优先把 PNG 本身交给系统分享；不支持文件就退回分享链接文本 */
    function systemShare() {
      if (!current || !navigator.share) return;
      var payload = { title: current.text, text: current.text, url: current.url };
      if (current.dataUrl && navigator.canShare) {
        try {
          var file = dataUrlToFile(current.dataUrl, 'xueai-lesson.' + POSTER_EXT);
          if (file && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: current.text, text: current.text })
              .catch(function () {});
            return;
          }
        } catch (e) {
          if (window.console) console.warn('[share-card] 文件分享不可用，退回链接分享', e);
        }
      }
      navigator.share(payload).catch(function () {});
    }

    function dataUrlToFile(dataUrl, name) {
      var parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      var bin = atob(parts[1]);
      var buf = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return new File([buf], name, { type: POSTER_MIME });
    }

    /* ── 开合 ─────────────────────────────────────────────────────────── */
    function open() {
      var lesson = getLesson();
      if (!lesson) return;
      if (!pop) buildDom();

      current = {
        lesson: lesson,
        url: lessonUrl(lesson),
        text: lessonText(lesson),
        dataUrl: null
      };

      hintEl.textContent = isMobile() ? T.hintMobile : T.hintDesktop;
      btnSys.hidden = !(isMobile() && navigator.share);
      pop.classList.remove('no-poster');
      previewEl.classList.add('loading');
      imgEl.removeAttribute('src');
      btnDl.disabled = true;

      pop.hidden = false;
      scrim.hidden = !isMobile();
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
      position();

      var token = current;
      ensurePoster(lesson, function (dataUrl) {
        if (!isOpen || current !== token) return;   /* 期间切了课或关了面板 */
        previewEl.classList.remove('loading');
        if (!dataUrl) {
          /* 出图失败：降级成只有复制链接，别留一块空白预览 */
          pop.classList.add('no-poster');
          return;
        }
        current.dataUrl = dataUrl;
        imgEl.src = dataUrl;
        btnDl.disabled = false;
      });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      current = null;
      if (pop) pop.hidden = true;
      if (scrim) scrim.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
      if (isOpen) close(); else open();
    }

    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });

    /* 关闭时机：点外部 / ESC / resize / 切课节 / 窗口失焦。
       失焦这条不是可选项——课件正文在 iframe 里，点 iframe 不会冒泡到本文档的
       pointerdown，只有 window blur 能捕获，否则浮层会一直赖在界面上。 */
    document.addEventListener('pointerdown', function (e) {
      if (!isOpen) return;
      if (pop && pop.contains(e.target)) return;
      /* 点按钮本身交给它自己的 click 做开合，这里插手会变成「关掉又立刻开回来」 */
      if (btn.contains(e.target)) return;
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { e.stopPropagation(); close(); }
    });
    window.addEventListener('resize', function () {
      if (isOpen) close();
    });
    window.addEventListener('blur', function () { close(); });
    window.addEventListener('hashchange', function () { close(); });

    return { open: open, close: close, toggle: toggle };
  }

  window.XueaiShareCard = { mount: mount };
})();
