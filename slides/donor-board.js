/**
 * donor-board.js — 首页「爱心榜」：已捐赠者名单 + 自助上传证书上榜。
 *
 * 挂载点：首页公益区块里的 <div id="donorBoard"></div>，骨架、样式、弹窗
 * 全由这里生成。做成独立文件而不是像贡献者那样内联，是因为三个语言版本的
 * 首页会各复制一份——这块有上传、识别、表单三段状态机，复制三份必然走样。
 *
 * 与后端的约定见 routes_donation.py。要点：
 * - 榜单永远不含金额，鼠标悬停只出项目名和日期；
 * - 用户改不了识别结果，提交时只回传服务端签发的 ticket 加展示名与头像；
 * - 头像必须是本站地址（上传或抓取转存），外链会被后端拒掉。
 */
(function () {
  'use strict';
  if (window.__DONOR_BOARD_LOADED__) return;
  window.__DONOR_BOARD_LOADED__ = true;

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
      heading: '已经献出爱心的朋友',
      sub: '谢谢你们，让这份善意继续传下去',
      add: '我也捐了',
      empty: '还没有人上榜，欢迎你做第一个',
      modalTitle: '把你的爱心记在这里',
      modalSub: '上传你在腾讯公益的捐赠证书截图，识别通过后由站长确认上榜。\n榜上只显示名字和项目，不显示金额。',
      dropTitle: '点击或拖拽上传捐赠证书截图',
      dropHint: '腾讯公益捐赠成功后，在证书页点「保存图片」即可 · 支持 jpg / png，8MB 以内',
      recognizing: '正在识别证书…',
      recognized: '识别成功，确认一下信息',
      fProject: '捐赠项目',
      fProjectPh: '请照证书上的项目名填写',
      fProjectHint: '这张截图上没露出项目名，麻烦你补一句',
      fDate: '捐赠时间',
      fName: '想显示在榜上的名字',
      fNamePh: '例如：白川',
      fAvatar: '头像（可选）',
      avatarUpload: '上传图片',
      avatarFetchPh: '或粘贴 GitHub / X 主页',
      avatarFetch: '抓取',
      submit: '提交上榜',
      submitting: '提交中…',
      doneTitle: '收到了，谢谢你',
      doneSub: '站长核对证书后就会把你放上爱心榜，通常一天之内。',
      close: '关闭',
      checking: '正在确认登录状态…',
      loginTip: '登录米羊账号后就能上传证书',
      loginBtn: '登录米羊账号',
      errPick: '请先选一张证书截图',
      errNet: '网络不太顺，请稍后再试',
      errBig: '这张图太大了，换一张小一点的截图试试',
      errName: '请填一个想显示在榜上的名字',
      errProject: '请填写这笔捐赠的项目名称'
    },
    en: {
      heading: 'People who gave',
      sub: 'Thank you for passing the kindness on',
      add: 'I donated too',
      empty: 'Nobody here yet — be the first',
      modalTitle: 'Add your name to the wall',
      modalSub: 'Upload the donation certificate from Tencent Charity.\nOnce verified, the site owner adds you to the wall.\nOnly your name and the project are shown, never the amount.',
      dropTitle: 'Click or drop your certificate screenshot',
      dropHint: 'Save it from the certificate page after donating · jpg / png, up to 8MB',
      recognizing: 'Reading the certificate…',
      recognized: 'Got it — please confirm',
      fProject: 'Project',
      fProjectPh: 'Type the project name as printed',
      fProjectHint: "The project name isn't visible in this screenshot — please add it",
      fDate: 'Donated on',
      fName: 'Name to show on the wall',
      fNamePh: 'e.g. Alex',
      fAvatar: 'Avatar (optional)',
      avatarUpload: 'Upload',
      avatarFetchPh: 'or paste a GitHub / X profile',
      avatarFetch: 'Fetch',
      submit: 'Submit',
      submitting: 'Submitting…',
      doneTitle: 'Received — thank you',
      doneSub: 'The site owner will check the certificate and add you, usually within a day.',
      close: 'Close',
      checking: 'Checking your sign-in…',
      loginTip: 'Sign in with your Miyang account to upload',
      loginBtn: 'Sign in',
      errPick: 'Please choose a certificate screenshot first',
      errNet: 'Network hiccup, please try again',
      errBig: 'That image is too large — try a smaller screenshot',
      errName: 'Please enter a name to show',
      errProject: 'Please enter the project you donated to'
    },
    ko: {
      heading: '마음을 나눈 분들',
      sub: '이 선의를 이어가 주셔서 고맙습니다',
      add: '저도 기부했어요',
      empty: '아직 아무도 없어요. 첫 번째가 되어 주세요',
      modalTitle: '기부 기록 남기기',
      modalSub: '텐센트 공익에서 받은 기부 증서 스크린샷을 올려 주세요.\n확인 후 운영자가 명단에 추가합니다.\n이름과 프로젝트만 표시되며 금액은 표시하지 않습니다.',
      dropTitle: '증서 스크린샷을 클릭 또는 드래그해서 올리기',
      dropHint: '기부 후 증서 화면에서 이미지 저장 · jpg / png, 8MB 이하',
      recognizing: '증서를 읽는 중입니다…',
      recognized: '인식 완료, 내용을 확인해 주세요',
      fProject: '기부 프로젝트',
      fProjectPh: '증서에 적힌 프로젝트명을 입력해 주세요',
      fProjectHint: '이 스크린샷에는 프로젝트명이 보이지 않아요. 직접 적어 주세요',
      fDate: '기부일',
      fName: '명단에 표시할 이름',
      fNamePh: '예: 백천',
      fAvatar: '프로필 사진 (선택)',
      avatarUpload: '업로드',
      avatarFetchPh: '또는 GitHub / X 주소 붙여넣기',
      avatarFetch: '가져오기',
      submit: '제출하기',
      submitting: '제출 중…',
      doneTitle: '접수되었습니다. 감사합니다',
      doneSub: '운영자가 증서를 확인한 뒤 명단에 추가합니다. 보통 하루 안에 처리됩니다.',
      close: '닫기',
      checking: '로그인 상태를 확인하는 중…',
      loginTip: '미양 계정으로 로그인하면 업로드할 수 있어요',
      loginBtn: '로그인',
      errPick: '먼저 증서 스크린샷을 선택해 주세요',
      errNet: '네트워크가 불안정합니다. 잠시 후 다시 시도해 주세요',
      errBig: '이미지가 너무 큽니다. 더 작은 스크린샷으로 시도해 주세요',
      errName: '표시할 이름을 입력해 주세요',
      errProject: '기부한 프로젝트명을 입력해 주세요'
    }
  };
  var T = DICT[LANG] || DICT.zh;

  var CSS = [
    '.donor-board{max-width:1060px;margin:64px auto 0;}',
    '.donor-head{text-align:center;margin-bottom:22px;}',
    '.donor-head h3{font-size:17px;font-weight:800;color:var(--text-h);margin:0;letter-spacing:-0.2px;}',
    '.donor-head p{font-size:13px;color:var(--text-f);margin:6px 0 0;}',
    '.donor-cta{display:flex;justify-content:center;margin-top:26px;}',
    '.donor-add{',
    '  display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:999px;',
    '  border:1px solid rgba(226,96,61,0.32);background:rgba(226,96,61,0.08);',
    '  color:#c94e2e;font-size:13.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:all .2s;}',
    '.donor-add:hover{background:rgba(226,96,61,0.16);transform:translateY(-1px);}',
    '.donor-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;}',
    '.donor-item{',
    '  position:relative;display:inline-flex;align-items:center;gap:9px;',
    '  padding:7px 15px 7px 7px;border-radius:999px;background:var(--card);',
    '  border:1px solid var(--card-border);text-decoration:none;cursor:default;transition:all .2s;}',
    '.donor-item:hover,.donor-item:focus-visible{transform:translateY(-2px);border-color:rgba(226,96,61,0.36);outline:none;}',
    /* 留了主页的那几位才是链接（渲染成带 href 的 a），光标得跟着变，
       否则一整块看着都不像能点的 */
    '.donor-item[href]{cursor:pointer;}',
    '.donor-avatar{width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0;background:var(--section-alt);display:block;}',
    '.donor-initial{',
    '  display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;',
    '  color:#fff;background:linear-gradient(135deg,#e2603d,#c94e2e);}',
    '.donor-name{font-size:13.5px;font-weight:700;color:var(--text-h);white-space:nowrap;}',
    /* 浮层：hover 才出。用 visibility 而不是 display，才能有淡入 */
    '.donor-pop{',
    '  position:absolute;left:50%;bottom:calc(100% + 10px);transform:translate(-50%,4px);',
    '  min-width:248px;max-width:340px;padding:11px 14px;border-radius:11px;',
    '  background:var(--card);border:1px solid var(--card-border);box-shadow:var(--card-shadow-hover);',
    '  opacity:0;visibility:hidden;transition:all .18s ease;z-index:20;pointer-events:none;text-align:left;}',
    '.donor-item:hover .donor-pop,.donor-item:focus-visible .donor-pop{opacity:1;visibility:visible;transform:translate(-50%,0);}',
    '.donor-pop-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:3px 0;}',
    '.donor-pop-p{font-size:12.5px;font-weight:700;color:var(--text-h);line-height:1.5;}',
    '.donor-pop-d{font-size:11px;color:var(--text-f);white-space:nowrap;flex-shrink:0;}',
    '.donor-empty{text-align:center;font-size:13px;color:var(--text-f);margin:0;}',
    /* ── 弹窗 ── */
    '.dnm-mask{',
    '  position:fixed;inset:0;background:rgba(15,18,24,0.58);backdrop-filter:blur(3px);',
    '  display:flex;align-items:center;justify-content:center;padding:20px;z-index:9998;',
    '  opacity:0;transition:opacity .2s;}',
    '.dnm-mask.on{opacity:1;}',
    '.dnm{',
    '  width:100%;max-width:468px;max-height:90vh;overflow-y:auto;padding:30px;',
    '  border-radius:18px;background:var(--card);border:1px solid var(--card-border);',
    '  box-shadow:0 24px 70px rgba(0,0,0,0.3);position:relative;',
    '  transform:translateY(8px);transition:transform .2s;}',
    '.dnm-mask.on .dnm{transform:translateY(0);}',
    '.dnm-x{',
    '  position:absolute;top:14px;right:14px;width:30px;height:30px;border:0;padding:0;',
    '  border-radius:50%;background:var(--section-alt);color:var(--text-s);',
    '  font-size:17px;line-height:1;cursor:pointer;font-family:inherit;}',
    '.dnm-x:hover{background:var(--pill-border);}',
    '.dnm h4{font-size:18px;font-weight:800;color:var(--text-h);margin:0 0 8px;letter-spacing:-0.2px;}',
    /* pre-line 让文案里的换行生效：说明分两句，一句一行比挤成一坨好读 */
    '.dnm-sub{font-size:12.5px;color:var(--text-f);line-height:1.75;margin:0 0 20px;',
    '  white-space:pre-line;}',
    '.dnm-drop{',
    '  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;',
    '  padding:32px 24px 26px;border-radius:14px;border:1.5px dashed rgba(226,96,61,0.3);',
    '  background:var(--section-alt);cursor:pointer;text-align:center;transition:all .2s;}',
    '.dnm-drop:hover,.dnm-drop.over{border-color:#e2603d;background:rgba(226,96,61,0.06);}',
    '.dnm-drop svg{margin-bottom:10px;}',
    '.dnm-drop-t{font-size:14px;font-weight:700;color:var(--text-h);}',
    '.dnm-drop-h{font-size:11.5px;color:var(--text-f);line-height:1.7;}',
    '.dnm-busy{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px 0;font-size:13.5px;color:var(--text-s);}',
    '.dnm-spin{width:16px;height:16px;border:2px solid var(--pill-border);border-top-color:#e2603d;border-radius:50%;animation:dnmspin .7s linear infinite;}',
    '@keyframes dnmspin{to{transform:rotate(360deg);}}',
    '.dnm-field{margin-bottom:15px;}',
    '.dnm-label{display:block;font-size:11.5px;font-weight:700;color:var(--text-f);margin-bottom:6px;}',
    '.dnm-static{font-size:14px;font-weight:700;color:var(--text-h);line-height:1.5;}',
    /* 只读的证书信息用分隔线串起来，和下面可填的字段区分开 */
    '.dnm-readonly{margin-bottom:20px;}',
    '.dnm-readonly .dnm-field{margin:0;padding:11px 0;border-bottom:1px solid var(--card-border);}',
    '.dnm-readonly .dnm-field:first-child{padding-top:2px;}',
    '.dnm-input{',
    '  width:100%;box-sizing:border-box;padding:10px 13px;border-radius:10px;',
    '  border:1px solid var(--card-border);background:var(--section-alt);',
    '  color:var(--text-h);font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;}',
    '.dnm-input:focus{border-color:#e2603d;}',
    /* 补填项目名时的一句说明。放在输入框下方，解释「为什么轮到你来填」 */
    '.dnm-hint{display:block;margin-top:6px;font-size:11.5px;color:var(--text-f);line-height:1.5;}',
    '.dnm-row{display:flex;gap:8px;align-items:center;}',
    '.dnm-btn{',
    '  padding:10px 15px;border-radius:10px;border:1px solid var(--card-border);',
    '  background:var(--section-alt);color:var(--text-s);font-size:12.5px;font-weight:700;',
    '  font-family:inherit;cursor:pointer;white-space:nowrap;transition:all .2s;}',
    '.dnm-btn:hover{border-color:#e2603d;color:#c94e2e;}',
    '.dnm-preview{width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;background:var(--section-alt);}',
    /* 占位圆一直占着位，选完头像原地换成图，这一行不会跳 */
    '.dnm-ava{',
    '  width:38px;height:38px;border-radius:50%;flex-shrink:0;background:var(--section-alt);',
    '  display:flex;align-items:center;justify-content:center;color:var(--text-f);}',
    '.dnm-submit{',
    '  width:100%;margin-top:8px;padding:14px;border-radius:13px;border:0;',
    '  background:linear-gradient(135deg,#e2603d,#c94e2e);color:#fff;',
    '  font-size:14.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:all .2s;}',
    '.dnm-submit:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(226,96,61,0.3);}',
    '.dnm-submit:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none;}',
    '.dnm-err{margin-top:12px;padding:10px 13px;border-radius:10px;background:rgba(226,96,61,0.1);color:#c94e2e;font-size:12.5px;line-height:1.6;}',
    '.dnm-done{text-align:center;padding:10px 0 4px;}',
    /* 光晕不画进 SVG 而用 CSS 径向渐变：暗色主题下浅桃色的实心圆会变成一块脏斑 */
    '.dnm-heart{',
    '  display:inline-flex;align-items:center;justify-content:center;',
    '  background:radial-gradient(circle,rgba(226,96,61,0.14) 0%,rgba(226,96,61,0) 68%);}',
    '.dnm-heart svg{display:block;filter:drop-shadow(0 6px 14px rgba(201,78,46,0.28));}',
    '.dnm-done .dnm-heart{width:150px;height:150px;margin-bottom:6px;}',
    '.dnm-drop .dnm-heart{width:104px;height:104px;}',
    '.dnm-drop:hover .dnm-heart svg,.dnm-drop.over .dnm-heart svg{transform:scale(1.06);}',
    '.dnm-heart svg{transition:transform .25s ease;}',
    '@media(max-width:560px){',
    '  .donor-board{margin-top:48px;}',
    '  .dnm{padding:22px 18px;}',
    '  .donor-pop{min-width:170px;}',
    '}'
  ].join('\n');

  function injectCSS() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /**
   * 设计稿里那颗爱心：左上偏亮、右下压深的圆润心形，周围几点碎光。
   * 用矢量而不是切图，一来暗色主题下不用另做一张，二来上传区和成功页
   * 尺寸差一倍，位图放大会糊。
   */
  function heartMarkup(size, sparkles) {
    var spark = sparkles ? [
      '<circle cx="14" cy="16" r="1.7" fill="#f0a183" opacity=".85"/>',
      '<circle cx="60" cy="46" r="1.4" fill="#f0a183" opacity=".7"/>',
      '<circle cx="10" cy="40" r="1.2" fill="#f0a183" opacity=".6"/>',
      '<path d="M56 10.5 57 13l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#f0a183" opacity=".9"/>',
      '<path d="M17.5 52 18.3 54l2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#f0a183" opacity=".75"/>'
    ].join('') : '';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 72 72" ' +
      'fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="dnHeartG" x1="18" y1="14" x2="56" y2="58" ' +
      'gradientUnits="userSpaceOnUse">' +
      '<stop stop-color="#f4854f"/><stop offset="1" stop-color="#c94e2e"/>' +
      '</linearGradient></defs>' + spark +
      '<path d="M36 60.5 15.6 39.8a12.9 12.9 0 0 1 0-18.2 12.5 12.5 0 0 1 17.9 0L36 24l2.5-2.4a12.5 12.5 0 0 1 17.9 0 12.9 12.9 0 0 1 0 18.2L36 60.5Z" ' +
      'fill="url(#dnHeartG)"/></svg>';
  }

  function heartNode(size, sparkles) {
    var w = document.createElement('span');
    w.className = 'dnm-heart';
    w.innerHTML = heartMarkup(size, sparkles);
    return w;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function loginUrl() {
    return '/auth/login?next=' + encodeURIComponent(location.pathname + location.search);
  }

  // ── 榜单 ────────────────────────────────────────────────────────────────
  var grid, empty;

  function renderBoard(list) {
    grid.textContent = '';
    if (!list.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    list.forEach(function (d) {
      var item = el(d.link_url ? 'a' : 'div', 'donor-item');
      if (d.link_url) {
        item.href = d.link_url;
        item.target = '_blank';
        item.rel = 'noopener';
      }
      item.tabIndex = 0;
      if (d.avatar_url) {
        var img = el('img', 'donor-avatar');
        img.src = d.avatar_url;
        img.alt = '';
        img.loading = 'lazy';
        item.appendChild(img);
      } else {
        // 没头像也得站得住，用名字首字符做个色块，比空框体面
        item.appendChild(el('span', 'donor-avatar donor-initial',
          (d.name || '?').trim().charAt(0)));
      }
      item.appendChild(el('span', 'donor-name', d.name));

      var pop = el('div', 'donor-pop');
      (d.donations || []).forEach(function (g) {
        var row = el('div', 'donor-pop-row');
        row.appendChild(el('span', 'donor-pop-p', g.project));
        // 捐赠成功页里嵌的半截证书看不到日期，这时别塞一个空 span 进来白占
        // 一个 flex 位——space-between 会把项目名挤得莫名其妙。
        if (g.date) row.appendChild(el('span', 'donor-pop-d', g.date));
        pop.appendChild(row);
      });
      item.appendChild(pop);
      grid.appendChild(item);
    });
  }

  function loadBoard() {
    fetch('/api/gongyi/donors', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) { renderBoard((d && d.ok && d.donors) || []); })
      .catch(function (e) { console.log('[donors] 名单加载失败:', e); });
  }

  // ── 上传弹窗 ────────────────────────────────────────────────────────────
  var mask, body, headEl, subEl, ticket = '', avatarUrl = '', linkUrl = '';

  /**
   * 给手填项目名的输入框喂候选：首页这会儿正挂着的那几个腾讯公益项目。
   *
   * 用 datalist 而不是下拉选择，是因为「本站挂的项目」和「用户捐的项目」
   * 只是常常重合，不是必然——腾讯公益上任何项目的证书这里都认。做成选择框
   * 会把捐了别处的人堵死，做成提示则两边都顺。
   *
   * 拉不到就算了：没有候选只是要多打几个字，不该让它拦住提交。
   */
  function fillProjectOptions() {
    var dl = document.getElementById('dnmProjects');
    if (dl) return;
    dl = el('datalist');
    dl.id = 'dnmProjects';
    document.body.appendChild(dl);
    fetch('/api/gongyi/projects', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        ((d && d.projects) || []).forEach(function (p) {
          if (!p || !p.title) return;
          var o = el('option');
          o.value = p.title;
          dl.appendChild(o);
        });
      })
      .catch(function (e) { console.log('[donors] 项目候选加载失败:', e); });
  }

  function closeModal() {
    if (!mask) return;
    mask.classList.remove('on');
    setTimeout(function () { if (mask) { mask.remove(); mask = null; } }, 200);
  }

  function openModal() {
    ticket = '';
    avatarUrl = '';
    linkUrl = '';
    mask = el('div', 'dnm-mask');
    var box = el('div', 'dnm');
    var x = el('button', 'dnm-x', '\u00d7');
    x.type = 'button';
    x.setAttribute('aria-label', T.close);
    x.onclick = closeModal;
    box.appendChild(x);
    headEl = el('h4', null, T.modalTitle);
    subEl = el('p', 'dnm-sub', T.modalSub);
    box.appendChild(headEl);
    box.appendChild(subEl);
    body = el('div');
    box.appendChild(body);
    mask.appendChild(box);
    mask.addEventListener('click', function (e) { if (e.target === mask) closeModal(); });
    document.body.appendChild(mask);
    // 强制重排来起步入场动画，不用 requestAnimationFrame：
    // 页面在后台标签时 rAF 不触发，弹窗会一直停在 opacity:0 上
    void mask.offsetWidth;
    mask.classList.add('on');
    stepGate();
  }

  /**
   * 登录墙放在弹窗一打开就问，而不是等识别完再由 401 弹回来：让人先挑图、
   * 再等十几秒识别、最后才被告知要登录，白等的不只是他的耐心，还有一次模型调用。
   *
   * 以 auth.js 的 /auth/me 为准，与站内 paywall / 水印同一口径，别在这儿另判一套。
   * 首页加载时就查过了，state 通常已经有值，所以多数情况下直接进上传页、不闪。
   * 页面上没有 auth.js（本地静态预览）时不拦——那种环境识别接口本来也不在，
   * 而线上真正把关的是服务端的 401，这里只是不让人白跑一趟。
   */
  function stepGate() {
    var xa = window.XueaiAuth;
    if (!xa) return stepPick();
    if (xa.state && xa.state.loggedIn) return stepPick();
    stepBusy(T.checking);
    xa.ready
      .then(function (s) { if (s && s.loggedIn) stepPick(); else stepLogin(); })
      .catch(function () { stepPick(); });
  }

  function showErr(msg) {
    var old = body.querySelector('.dnm-err');
    if (old) old.remove();
    var e = el('div', 'dnm-err', msg);
    body.appendChild(e);
  }

  function stepPick() {
    body.textContent = '';
    // 识别失败退回这一步时，把被确认页改过的说明文案还原
    headEl.hidden = false;
    subEl.hidden = false;
    subEl.textContent = T.modalSub;
    var drop = el('div', 'dnm-drop');
    drop.appendChild(heartNode(76, false));
    drop.appendChild(el('div', 'dnm-drop-t', T.dropTitle));
    drop.appendChild(el('div', 'dnm-drop-h', T.dropHint));
    var input = el('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.hidden = true;
    drop.onclick = function () { input.click(); };
    input.onchange = function () { if (input.files[0]) verify(input.files[0]); };
    ['dragenter', 'dragover'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault();
        drop.classList.add('over');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault();
        drop.classList.remove('over');
      });
    });
    drop.addEventListener('drop', function (e) {
      var f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) verify(f);
    });
    body.appendChild(drop);
    body.appendChild(input);
  }

  function stepBusy(text) {
    body.textContent = '';
    var w = el('div', 'dnm-busy');
    w.appendChild(el('span', 'dnm-spin'));
    w.appendChild(el('span', null, text));
    body.appendChild(w);
  }

  function stepLogin() {
    body.textContent = '';
    subEl.textContent = T.loginTip;
    var a = el('a', 'dnm-submit', T.loginBtn);
    a.href = loginUrl();
    a.style.display = 'block';
    a.style.textAlign = 'center';
    a.style.textDecoration = 'none';
    a.style.boxSizing = 'border-box';
    body.appendChild(a);
  }

  // 手机截屏动辄三五兆，直传会被 Nginx 的请求体上限挡成 413（返回的还是
  // 一张 HTML 错误页，接不出 JSON）。证书上要读的就是几行字，长边 1600 足够
  // 让 OCR 认清编号，压完通常只剩几百 KB：413 没了，上传和识别也都更快。
  var SHRINK_EDGE = 1600;

  /**
   * 缩图后交给 cb。任一环节不成就把原文件原样交回去——宁可让服务端按 8MB
   * 上限判，也不能因为压缩失败就不让人上传。
   */
  function shrink(file, cb) {
    if (!window.URL || !window.HTMLCanvasElement) return cb(file);
    var url = URL.createObjectURL(file);
    var img = new Image();
    var done = false;
    function finish(out) {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      cb(out || file);
    }
    img.onerror = function () { finish(null); };
    img.onload = function () {
      try {
        var scale = Math.min(1, SHRINK_EDGE / Math.max(img.width, img.height));
        if (scale === 1 && file.size <= 900 * 1024) return finish(null);
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * scale);
        cv.height = Math.round(img.height * scale);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob(function (blob) {
          // 压完反而更大就用原图：截图里大片纯色时 PNG 能赢过 JPEG
          finish(blob && blob.size < file.size
            ? new File([blob], 'cert.jpg', { type: 'image/jpeg' })
            : null);
        }, 'image/jpeg', 0.85);
      } catch (e) {
        finish(null);
      }
    };
    img.src = url;
  }

  function verify(file) {
    stepBusy(T.recognizing);
    shrink(file, function (img) { postCert(img); });
  }

  function postCert(file) {
    var fd = new FormData();
    fd.append('file', file, file.name || 'cert.png');
    fetch('/api/gongyi/donation/verify', {
      method: 'POST', body: fd, credentials: 'same-origin'
    })
      // 不能直接 r.json()：413 之类由 Nginx 自己回的错误是 HTML，解析会抛,
      // 于是「图太大」被报成「网络不太顺」，用户换十张图也没用。
      .then(function (r) {
        return r.text().then(function (t) {
          var d = null;
          try { d = JSON.parse(t); } catch (e) {}
          return { s: r.status, d: d, raw: t };
        });
      })
      .then(function (res) {
        if (res.s === 401) return stepLogin();
        if (!res.d || !res.d.ok) {
          if (!res.d) console.log('[donors] 证书识别返回非 JSON:', res.s, res.raw.slice(0, 200));
          stepPick();
          showErr(res.d && res.d.error ? res.d.error
            : (res.s === 413 ? T.errBig : T.errNet));
          return;
        }
        ticket = res.d.ticket;
        stepConfirm(res.d);
      })
      .catch(function (e) {
        // 「网络不太顺」是给用户看的，真实原因得留给控制台，
        // 否则接口 404 或返回了 HTML 错误页时，两边都只能靠猜
        console.log('[donors] 证书识别请求失败:', e);
        stepPick();
        showErr(T.errNet);
      });
  }

  function stepConfirm(info) {
    body.textContent = '';
    // 到这一步「怎么上传」已经不用再讲了，换成一句确认引导，省掉一段重复说明
    subEl.textContent = T.recognized;

    // 识别到的项目和日期只读展示：以服务端为准，改也没用，索性不给编辑。
    // 但项目名没识别出来时（证书卡片被折叠、感谢语截断）得让用户自己写一句，
    // 否则一张真证书会卡在这里上不了榜。日期缺了不影响，留个「—」就好。
    var projectInput = null;
    var ro = el('div', 'dnm-readonly');
    if (info.needs_project) {
      var pf = el('div', 'dnm-field');
      pf.appendChild(el('span', 'dnm-label', T.fProject));
      projectInput = el('input', 'dnm-input');
      projectInput.type = 'text';
      projectInput.maxLength = 120;
      projectInput.placeholder = T.fProjectPh;
      projectInput.setAttribute('list', 'dnmProjects');
      pf.appendChild(projectInput);
      pf.appendChild(el('span', 'dnm-hint', T.fProjectHint));
      body.appendChild(pf);
      fillProjectOptions();
    } else {
      var f0 = el('div', 'dnm-field');
      f0.appendChild(el('span', 'dnm-label', T.fProject));
      f0.appendChild(el('div', 'dnm-static', info.project));
      ro.appendChild(f0);
    }
    var df = el('div', 'dnm-field');
    df.appendChild(el('span', 'dnm-label', T.fDate));
    df.appendChild(el('div', 'dnm-static', info.date || '—'));
    ro.appendChild(df);
    body.appendChild(ro);

    var nf = el('div', 'dnm-field');
    nf.appendChild(el('span', 'dnm-label', T.fName));
    var name = el('input', 'dnm-input');
    name.type = 'text';
    name.maxLength = 64;
    name.placeholder = T.fNamePh;
    name.value = info.suggested_name || '';
    nf.appendChild(name);
    body.appendChild(nf);

    var af = el('div', 'dnm-field');
    af.appendChild(el('span', 'dnm-label', T.fAvatar));
    var row = el('div', 'dnm-row');
    var placeholder = el('span', 'dnm-ava');
    placeholder.innerHTML = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    var preview = el('img', 'dnm-preview');
    preview.alt = '';
    preview.hidden = true;

    function setAvatar(url) {
      avatarUrl = url;
      preview.src = url;
      preview.hidden = false;
      placeholder.hidden = true;
    }
    var fileInput = el('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;
    var upBtn = el('button', 'dnm-btn', T.avatarUpload);
    upBtn.type = 'button';
    upBtn.onclick = function () { fileInput.click(); };
    fileInput.onchange = function () {
      if (!fileInput.files[0]) return;
      var fd = new FormData();
      fd.append('file', fileInput.files[0], fileInput.files[0].name || 'a.png');
      upBtn.disabled = true;
      fetch('/api/gongyi/donation/avatar', {
        method: 'POST', body: fd, credentials: 'same-origin'
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          upBtn.disabled = false;
          if (d && d.ok) setAvatar(d.url);
          else showErr((d && d.error) || T.errNet);
        })
        .catch(function () { upBtn.disabled = false; showErr(T.errNet); });
    };
    var link = el('input', 'dnm-input');
    link.type = 'text';
    link.placeholder = T.avatarFetchPh;
    var fetchBtn = el('button', 'dnm-btn', T.avatarFetch);
    fetchBtn.type = 'button';
    fetchBtn.onclick = function () {
      if (!link.value.trim()) return;
      fetchBtn.disabled = true;
      fetch('/api/gongyi/donation/avatar-fetch', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.value.trim() })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          fetchBtn.disabled = false;
          if (d && d.ok) {
            setAvatar(d.avatar_url);
            // 抓头像用的那个主页地址要留住：榜上的头像就靠它变成可点的链接，
            // 丢了的话「点头像去看看这人是谁」这条路就断了
            linkUrl = d.link_url || '';
            if (!name.value.trim() && d.name) name.value = d.name;
          } else showErr((d && d.error) || T.errNet);
        })
        .catch(function () { fetchBtn.disabled = false; showErr(T.errNet); });
    };
    row.appendChild(placeholder);
    row.appendChild(preview);
    row.appendChild(upBtn);
    row.appendChild(link);
    row.appendChild(fetchBtn);
    af.appendChild(row);
    af.appendChild(fileInput);
    body.appendChild(af);

    var submit = el('button', 'dnm-submit', T.submit);
    submit.type = 'button';
    submit.onclick = function () {
      var project = projectInput ? projectInput.value.trim() : '';
      if (projectInput && !project) return showErr(T.errProject);
      if (!name.value.trim()) return showErr(T.errName);
      submit.disabled = true;
      submit.textContent = T.submitting;
      fetch('/api/gongyi/donation/submit', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket: ticket, name: name.value.trim(), project: project,
          avatar_url: avatarUrl, link_url: linkUrl, website: ''
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.ok) return stepDone();
          submit.disabled = false;
          submit.textContent = T.submit;
          showErr((d && d.error) || T.errNet);
        })
        .catch(function () {
          submit.disabled = false;
          submit.textContent = T.submit;
          showErr(T.errNet);
        });
    };
    body.appendChild(submit);
  }

  function stepDone() {
    body.textContent = '';
    headEl.hidden = true;
    subEl.hidden = true;
    var w = el('div', 'dnm-done');
    w.appendChild(heartNode(112, true));
    w.appendChild(el('h4', null, T.doneTitle));
    w.appendChild(el('p', 'dnm-sub', T.doneSub));
    var btn = el('button', 'dnm-submit', T.close);
    btn.type = 'button';
    btn.onclick = closeModal;
    w.appendChild(btn);
    body.appendChild(w);
  }

  // ── 装配 ────────────────────────────────────────────────────────────────
  function init() {
    var root = document.getElementById('donorBoard');
    if (!root) return;
    injectCSS();
    root.className = 'donor-board';

    var head = el('div', 'donor-head');
    head.appendChild(el('h3', null, T.heading));
    head.appendChild(el('p', null, T.sub));
    root.appendChild(head);

    grid = el('div', 'donor-grid');
    root.appendChild(grid);
    empty = el('p', 'donor-empty', T.empty);
    empty.hidden = true;
    root.appendChild(empty);

    // 按钮单独占一行放在名单之后：先看见谁捐了，再看见「我也捐了」，
    // 挤在标题右边既压不住那行字，也把号召说小了
    var cta = el('div', 'donor-cta');
    var add = el('button', 'donor-add');
    add.type = 'button';
    add.innerHTML = '<svg width="14" height="14" viewBox="0 0 72 72" fill="currentColor" ' +
      'aria-hidden="true"><path d="M36 60.5 15.6 39.8a12.9 12.9 0 0 1 0-18.2 12.5 12.5 0 0 1 ' +
      '17.9 0L36 24l2.5-2.4a12.5 12.5 0 0 1 17.9 0 12.9 12.9 0 0 1 0 18.2L36 60.5Z"/></svg>';
    add.appendChild(el('span', null, T.add));
    add.onclick = openModal;
    cta.appendChild(add);
    root.appendChild(cta);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mask) closeModal();
    });
    loadBoard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
