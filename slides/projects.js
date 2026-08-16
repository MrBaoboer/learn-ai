/* projects.js — 开源项目墙前端（PRD-oss-showcase v2）。
 *
 * 一份脚本服务 zh/en/ko 三个壳页面：语言从文件名后缀判断（与 splash.js 同约定），
 * 静态文案走下方字典，项目简介按语言取 desc_zh/en/ko。
 * 列表与详情同页切换：?p={id} 进详情，返回即列表——没有路由器，只有 URL 参数。
 * 写操作（点赞/评价）遇 401 一律唤起 XueaiAuth 登录弹窗，成功后用户重试即可。
 */
(function () {
  'use strict';

  var LANG = location.pathname.match(/\.en\.html?$/) ? 'en'
    : location.pathname.match(/\.ko\.html?$/) ? 'ko' : 'zh';

  var T = {
    zh: {
      all: '全部', sortFeatured: '综合推荐', sortStars: 'Star 最多',
      sortRating: '评分最高', sortNewest: '最新上墙',
      submit: '登记我的项目', by: '登记：', empty: '这个分类下还没有项目，来当第一个吧',
      loadFail: '加载失败，请刷新重试', back: '← 返回项目墙',
      viewOnGithub: '去 GitHub 看看', reviews: '用户评价', noReviews: '还没有评价，写下第一条吧',
      myReviewTitle: '我的评价', reviewPlaceholder: '用起来怎么样？说说真实感受（可留空只打分）…',
      submitReview: '提交评价', updateReview: '更新评价', reviewOk: '评价已提交',
      reviewPending: '评价已提交，内容将在人工审核通过后公开显示',
      loginToReview: '登录后就能打分和评价', loginToLike: '登录后可以点赞',
      ratings: '条评分', noRating: '暂无评分，来打第一个分',
      anonymous: '米羊用户', likeFail: '操作失败，请重试',
      badgeTip: '项目作者可把评分徽章挂进 README：',
      langLabel: { zh: '简介', en: 'EN', ko: 'KO' }
    },
    en: {
      all: 'All', sortFeatured: 'Featured', sortStars: 'Most Stars',
      sortRating: 'Top Rated', sortNewest: 'Newest',
      submit: 'Submit Your Project', by: 'Listed by ', empty: 'No projects here yet — be the first!',
      loadFail: 'Failed to load, please refresh', back: '← Back to Showcase',
      viewOnGithub: 'View on GitHub', reviews: 'User Reviews', noReviews: 'No reviews yet — write the first one',
      myReviewTitle: 'My Review', reviewPlaceholder: 'How is it in practice? Honest thoughts (rating-only is fine)…',
      submitReview: 'Submit Review', updateReview: 'Update Review', reviewOk: 'Review submitted',
      reviewPending: 'Submitted — your review will appear after moderator approval',
      loginToReview: 'Log in to rate and review', loginToLike: 'Log in to like',
      ratings: 'ratings', noRating: 'No ratings yet — be the first',
      anonymous: 'Miyang user', likeFail: 'Action failed, please retry',
      badgeTip: 'Project authors can embed the rating badge in README:',
      langLabel: { zh: 'ZH', en: 'About', ko: 'KO' }
    },
    ko: {
      all: '전체', sortFeatured: '추천', sortStars: 'Star 순',
      sortRating: '평점 순', sortNewest: '최신 순',
      submit: '내 프로젝트 등록', by: '등록: ', empty: '아직 프로젝트가 없습니다 — 첫 번째가 되어보세요!',
      loadFail: '불러오기 실패, 새로고침해 주세요', back: '← 목록으로',
      viewOnGithub: 'GitHub에서 보기', reviews: '사용자 리뷰', noReviews: '아직 리뷰가 없습니다 — 첫 리뷰를 남겨보세요',
      myReviewTitle: '내 리뷰', reviewPlaceholder: '실제로 써보니 어떤가요? (별점만도 가능)…',
      submitReview: '리뷰 등록', updateReview: '리뷰 수정', reviewOk: '리뷰가 등록되었습니다',
      reviewPending: '제출되었습니다 — 검토 승인 후 공개됩니다',
      loginToReview: '로그인 후 평가할 수 있습니다', loginToLike: '로그인 후 좋아요 가능',
      ratings: '개 평점', noRating: '아직 평점이 없습니다 — 첫 평가를 남겨보세요',
      anonymous: '미양 사용자', likeFail: '실패했습니다. 다시 시도해 주세요',
      badgeTip: '프로젝트 작성자는 README에 평점 배지를 넣을 수 있습니다:',
      langLabel: { zh: 'ZH', en: 'EN', ko: '소개' }
    }
  }[LANG];

  var $root = document.getElementById('oss-root');
  var categories = [];
  var state = { category: '', sort: 'featured' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function descOf(item) {
    return (LANG === 'en' && item.desc_en) || (LANG === 'ko' && item.desc_ko)
      || item.desc_zh || '';
  }

  function catLabel(key) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].key === key) return categories[i][LANG] || categories[i].zh;
    }
    return key;
  }

  function api(path, opts) {
    return fetch(path, Object.assign({ credentials: 'same-origin' }, opts || {}))
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); });
  }

  function requireLogin(tip) {
    var xa = window.XueaiAuth;
    if (xa && xa.openLoginModal) xa.openLoginModal(location.pathname + location.search);
    else alert(tip);
  }

  function stars(avg) {
    var full = Math.round(avg);
    var out = '';
    for (var i = 1; i <= 5; i++) out += i <= full ? '★' : '☆';
    return out;
  }

  /* ────────── 列表 ────────── */

  function renderTabs() {
    var tabs = ['<button class="oss-tab' + (state.category ? '' : ' on') + '" data-cat="">' + esc(T.all) + '</button>'];
    categories.forEach(function (c) {
      tabs.push('<button class="oss-tab' + (state.category === c.key ? ' on' : '') +
        '" data-cat="' + esc(c.key) + '">' + esc(c[LANG] || c.zh) + '</button>');
    });
    var sorts = [['featured', T.sortFeatured], ['stars', T.sortStars],
                 ['rating', T.sortRating], ['newest', T.sortNewest]]
      .map(function (s) {
        return '<option value="' + s[0] + '"' + (state.sort === s[0] ? ' selected' : '') + '>' + esc(s[1]) + '</option>';
      }).join('');
    return '<div class="oss-toolbar"><div class="oss-tabs">' + tabs.join('') +
      '</div><select class="oss-sort" id="ossSort">' + sorts + '</select></div>';
  }

  function card(item) {
    var rating = item.rating_count
      ? '<span class="oss-rate">★ ' + item.rating.toFixed(1) + ' <i>(' + item.rating_count + ')</i></span>' : '';
    return '<a class="oss-card" href="?p=' + item.id + '">' +
      '<div class="oss-cover"><img src="' + esc(item.cover_url) + '" alt="" loading="lazy"' +
      ' onerror="this.src=\'https://opengraph.githubassets.com/1/' + esc(item.owner) + '/' + esc(item.repo) + '\'"></div>' +
      '<div class="oss-card-body">' +
      '<div class="oss-card-top"><span class="oss-name">' + esc(item.owner) + '/<b>' + esc(item.repo) + '</b></span>' +
      (item.featured ? '<span class="oss-feat">✦</span>' : '') + '</div>' +
      '<p class="oss-desc">' + esc(descOf(item)) + '</p>' +
      '<div class="oss-card-meta">' +
      '<span class="oss-star">★ ' + fmtNum(item.stars) + '</span>' +
      (item.language ? '<span class="oss-lang"><i style="background:' + langColor(item.language) + '"></i>' + esc(item.language) + '</span>' : '') +
      rating +
      '<span class="oss-like-n">♥ ' + item.likes + '</span>' +
      '<span class="oss-cat-pill">' + esc(catLabel(item.category)) + '</span>' +
      '</div></div></a>';
  }

  function fmtNum(n) {
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  }

  var LANG_COLORS = { Python: '#3572A5', TypeScript: '#3178c6', JavaScript: '#f1e05a',
    Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', C: '#555555',
    Swift: '#F05138', Kotlin: '#A97BFF', Ruby: '#701516', PHP: '#4F5D95',
    'Jupyter Notebook': '#DA5B0B', HTML: '#e34c26', Shell: '#89e051' };
  function langColor(l) { return LANG_COLORS[l] || '#8b949e'; }

  function loadList() {
    $root.innerHTML = renderTabs() + '<div class="oss-grid" id="ossGrid"><div class="oss-loading"></div></div>';
    bindToolbar();
    api('/api/projects/list?category=' + encodeURIComponent(state.category) +
        '&sort=' + encodeURIComponent(state.sort))
      .then(function (res) {
        var grid = document.getElementById('ossGrid');
        if (!res.data.ok) { grid.innerHTML = '<p class="oss-empty">' + esc(T.loadFail) + '</p>'; return; }
        var items = res.data.items;
        grid.innerHTML = items.length ? items.map(card).join('')
          : '<p class="oss-empty">' + esc(T.empty) + '</p>';
      })
      .catch(function () {
        document.getElementById('ossGrid').innerHTML = '<p class="oss-empty">' + esc(T.loadFail) + '</p>';
      });
  }

  function bindToolbar() {
    $root.querySelectorAll('.oss-tab').forEach(function (el) {
      el.addEventListener('click', function () {
        state.category = el.getAttribute('data-cat');
        loadList();
      });
    });
    var sortEl = document.getElementById('ossSort');
    if (sortEl) sortEl.addEventListener('change', function () {
      state.sort = sortEl.value;
      loadList();
    });
  }

  /* ────────── 详情（仓库介绍在上，评价紧随其下） ────────── */

  function enterDetailMode() {
    // 详情页只留一个返回入口：顶栏左上角改为「返回项目墙」，大标题区整体隐藏
    var header = document.querySelector('.oss-header');
    if (header) header.style.display = 'none';
    var home = document.querySelector('.oss-home');
    if (home) { home.href = location.pathname; home.textContent = T.back; }
  }

  function loadDetail(id) {
    enterDetailMode();
    $root.innerHTML = '<div class="oss-loading"></div>';
    api('/api/projects/detail?id=' + encodeURIComponent(id))
      .then(function (res) {
        if (!res.data.ok) {
          $root.innerHTML = '<p class="oss-empty">' + esc(T.loadFail) + '</p>';
          return;
        }
        renderDetail(res.data.item);
      })
      .catch(function () {
        $root.innerHTML = '<p class="oss-empty">' + esc(T.loadFail) + '</p>';
      });
  }

  function reviewRow(r) {
    return '<div class="oss-review">' +
      '<div class="oss-review-top"><span class="oss-review-stars">' + stars(r.rating) + '</span>' +
      '<span class="oss-review-name">' + esc(r.user_name || T.anonymous) + '</span>' +
      '<span class="oss-review-date">' + esc(r.created_at) + '</span></div>' +
      (r.content ? '<p class="oss-review-body">' + esc(r.content) + '</p>' : '') +
      '</div>';
  }

  function renderDetail(item) {
    var ghUrl = item.repo_url + '?utm_source=xueai';
    // 星数 / 协议 / 分类都放右侧信息卡，标题下只留语言与协议等轻量 chips
    var chips = [
      item.language ? '<span class="oss-chip"><i style="background:' + langColor(item.language) + '"></i>' + esc(item.language) + '</span>' : '',
      item.license ? '<span class="oss-chip">' + esc(item.license) + '</span>' : '',
      '<span class="oss-chip">' + esc(catLabel(item.category)) + '</span>'
    ].filter(Boolean).join('');

    var topics = (item.topics || []).map(function (t) {
      return '<span class="oss-topic">' + esc(t) + '</span>';
    }).join('');

    // 右侧评分区：大号均分 + 星 + 条数（设计稿 mock-detail 的核心焦点）
    var sideRating = item.rating_count
      ? '<div class="oss-side-rating">' +
        '<div class="oss-side-rating-num">' + item.rating.toFixed(1) + '</div>' +
        '<div class="oss-side-rating-stars">' + stars(item.rating) + '</div>' +
        '<div class="oss-side-rating-count">' + item.rating_count + ' ' + esc(T.ratings) + '</div>' +
        '</div>'
      : '<div class="oss-side-rating">' +
        '<div class="oss-side-rating-num">—</div>' +
        '<div class="oss-side-rating-count">' + esc(T.noRating) + '</div>' +
        '</div>';

    var sideRows =
      '<div class="oss-side-rows">' +
      '<div class="oss-side-row"><span class="k">GitHub Stars</span><span class="v">★ ' + fmtNum(item.stars) + '</span></div>' +
      (item.language ? '<div class="oss-side-row"><span class="k">Language</span>' +
        '<span class="v"><i style="background:' + langColor(item.language) + '"></i>' + esc(item.language) + '</span></div>' : '') +
      (item.license ? '<div class="oss-side-row"><span class="k">License</span><span class="v">' + esc(item.license) + '</span></div>' : '') +
      '<div class="oss-side-row"><span class="k">Category</span><span class="v">' + esc(catLabel(item.category)) + '</span></div>' +
      '</div>' +
      '<div class="oss-side-by"><span>' + esc(T.by) + esc(item.submitter_name || T.anonymous) + '</span>' +
      '<span>' + esc(item.approved_at) + '</span></div>';

    var html =
      '<div class="oss-detail"><div class="oss-detail-split">' +

      '<div class="oss-detail-main">' +
      '<h1>' + esc(item.owner) + ' / ' + esc(item.repo) + '</h1>' +
      '<div class="oss-chips">' + chips + '</div>' +
      (topics ? '<div class="oss-topics">' + topics + '</div>' : '') +
      '<div class="oss-detail-cover"><img src="' + esc(item.cover_url) + '" alt=""' +
      ' onerror="this.src=\'https://opengraph.githubassets.com/1/' + esc(item.owner) + '/' + esc(item.repo) + '\'"></div>' +
      '<p class="oss-detail-desc">' + esc(descOf(item)) + '</p>' +

      '<h2 class="oss-h2">' + esc(T.reviews) + '</h2>' +
      '<div class="oss-review-form" id="ossReviewForm">' +
      '<div class="oss-review-form-title">' + esc(T.myReviewTitle) + '</div>' +
      '<div class="oss-star-input" id="ossStarInput">' +
      [1, 2, 3, 4, 5].map(function (n) {
        var on = item.my_review && item.my_review.rating >= n;
        return '<button data-n="' + n + '" class="' + (on ? 'on' : '') + '">★</button>';
      }).join('') + '</div>' +
      '<textarea id="ossReviewText" maxlength="500" placeholder="' + esc(T.reviewPlaceholder) + '">' +
      esc(item.my_review ? item.my_review.content : '') + '</textarea>' +
      '<button class="oss-review-submit" id="ossReviewSubmit">' +
      esc(item.my_review ? T.updateReview : T.submitReview) + '</button>' +
      '</div>' +
      '<div class="oss-reviews" id="ossReviews">' +
      (item.reviews.length ? item.reviews.map(reviewRow).join('')
        : '<p class="oss-empty">' + esc(T.noReviews) + '</p>') +
      '</div>' +
      '</div>' +

      '<div class="oss-detail-sidebar">' +
      '<div class="oss-side-card">' + sideRating + sideRows + '</div>' +
      '<a class="oss-gh-btn" href="' + esc(ghUrl) + '" target="_blank" rel="noopener">' + esc(T.viewOnGithub) + ' →</a>' +
      '<button class="oss-like-btn' + (item.liked ? ' on' : '') + '" id="ossLike">♥ <span>' + item.likes + '</span></button>' +
      '</div>' +

      '</div></div>';

    $root.innerHTML = html;
    bindDetail(item);
  }

  function bindDetail(item) {
    var rating = item.my_review ? item.my_review.rating : 0;

    document.getElementById('ossLike').addEventListener('click', function () {
      var btn = this;
      api('/api/projects/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      }).then(function (res) {
        if (res.status === 401) return requireLogin(T.loginToLike);
        if (!res.data.ok) return alert(res.data.error || T.likeFail);
        btn.classList.toggle('on', res.data.liked);
        btn.querySelector('span').textContent = res.data.likes;
      }).catch(function () { alert(T.likeFail); });
    });

    var starBtns = document.querySelectorAll('#ossStarInput button');
    starBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        rating = parseInt(b.getAttribute('data-n'), 10);
        starBtns.forEach(function (x) {
          x.classList.toggle('on', parseInt(x.getAttribute('data-n'), 10) <= rating);
        });
      });
    });

    document.getElementById('ossReviewSubmit').addEventListener('click', function () {
      if (!rating) return alert(LANG === 'zh' ? '先点星星打个分' : 'Pick a star rating first');
      var content = document.getElementById('ossReviewText').value.trim();
      api('/api/projects/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, rating: rating, content: content })
      }).then(function (res) {
        if (res.status === 401) return requireLogin(T.loginToReview);
        if (!res.data.ok) return alert(res.data.error || T.likeFail);
        if (res.data.pending) alert(T.reviewPending);
        loadDetail(item.id);   // 重新拉详情：均分、列表、按钮文案一次刷新到位
      }).catch(function () { alert(T.likeFail); });
    });
  }

  /* ────────── 入口 ────────── */

  var submitBtn = document.getElementById('ossSubmitBtn');
  if (submitBtn) {
    submitBtn.textContent = T.submit;
    submitBtn.addEventListener('click', function () {
      // 提交向导是中文页（投稿以中文社区为主），三语墙都跳同一处
      location.href = 'projects-submit.html';
    });
  }

  api('/api/projects/categories').then(function (res) {
    categories = (res.data && res.data.items) || [];
    var pid = new URLSearchParams(location.search).get('p');
    if (pid) loadDetail(pid); else loadList();
  }).catch(function () {
    $root.innerHTML = '<p class="oss-empty">' + esc(T.loadFail) + '</p>';
  });
})();
