/**
 * 课程结构化数据 —— 门户首页 (home.html) 与 Wiki 学习页 (learn.html) 的统一数据源。
 * 维护一处即可，新增/调整课程内容只改这里。
 *
 * 结构：篇章(part) → 主题(topic) → 知识点(lesson)
 * lesson.file 对应 slides/ 下的某个 .html
 * lesson.tag  用于显示彩色标签（交互/动画/概念/案例/安全 等）
 */
window.COURSE = {
  meta: {
    title: '學 AI 產品，從入門到精通',
    subtitle: '從大模型底層原理到 AI Agent Harness',
    brand: '小山學堂',
    author: '洛小山',
    authorUrl: 'https://luoxiaoshan.cn/',
    github: 'https://github.com/itshen/learn-ai',
  },
  parts: [
    /* 开篇：课程的第一站，先定位自己再讲怎么学。放在零基础入门篇之前，新访客默认落地
       在这里（learn.html 取 FLAT[0]）。暂时复用 prologue 标记，首页会渲染成 INTRO
       徽章，与零基础入门篇重复；待 Ask Alice 分支落地后换成专用的 preface 样式。 */
    {
      id: 'p-start',
      num: '課程開篇',
      title: '開始之前',
      desc: '四節開篇小課：先按目標挑一條學習路線，再用達克曲線找到自己現在的位置，講清怎麼學才能真的過腦子，以及為什麼值得先花時間弄懂原理。原理通了，後面所有方案你都能自己看懂。',
      color: '#64748b',
      group: 'main',
      routes: ['use', 'pro', 'pm', 'build'],
      prologue: true,
      topics: [
        {
          id: 't-intro',
          title: '入門與定位',
          desc: '先搞清楚我們在哪裡、為什麼要打基礎',
          lessons: [
            /* 路线选择放在全课第一节：五条路线最后都汇到「入门与定位」，
               所有人必经此处。注册成课时它才有阅读器外壳，也才进得了翻页序列。 */
            { file: 'roadmap.html', title: '先選一條適合你的路', desc: '五檔學習路線按目標劃好範圍：只想會用 AI、把 AI 用到專業、做 AI 產品、自己動手搭、全都要。選完課程目錄自動精簡，隨時能改', tag: '開篇' , navTitle: '選學習路線'},
            { file: '0-intro.html', title: '我們在哪裡？達克效應', desc: '用達克曲線定位學員當前位置，明確課程目標：從愚昧之巔走向平穩高原', tag: '開篇' , navTitle: '我們在哪裡'},
            { file: '0-how.html', title: '怎樣學，知識才能過腦子', desc: '看完 ≠ 學到：每個案例都要停下來反思、代入自己的業務場景、嘗試輸出', tag: '開篇' , navTitle: '怎樣學才有效'},
            { file: '0-why.html', title: '為什麼要花時間講原理', desc: 'AI 所有 Harness 操作本質都是對 message list 的處理。理解它，才能看懂所有方案', tag: '開篇' , navTitle: '為什麼要打基礎'},
          ],
        },
      ],
    },
    /* 学习方法专题：开篇讲了「怎样学才过脑子」，这一章把那一节展开成三十五节可操作的做法。
       标 prologue，所以不占主线编号，后面篇章的序号不变；四条路线都可见，因为提问、验证、
       留住知识这三件事跟学员想走哪条路无关。

       2026-08 重构：原来十一节，每节塞三到四个方法、两千多字，读者反馈晦涩。改成一页只讲
       一件事、四百到六百字、讲解责任交给演示，于是十一节展开成三十二节正文加三节收尾。
       字数与结构的闸门在 codex-course/check_page.py 的 learn 专题口径里。 */
    {
      id: 'p-learn',
      num: '學習方法',
      title: 'AI 教我學習：把它當老師用',
      desc: '知識隨手就能問出來之後，學得好不好取決於三件事：問得準、驗得住、留得下。三十五節課，一節只講一個動作，四百字左右加一個能上手的演示：提問該帶哪四個部件、它最容易在哪五處編、讀不下去的條款怎麼分四步拆開、帶 AI 精讀幾十萬行原始碼時怎麼讓每個論斷都回到具體行、怎麼讓它出新題而不是出名詞解釋、外部記憶該分哪三層寫、怎麼確認自己真會了而不是讀得順、怎麼把這些動作排進自己的周曆，以及把站內側邊欄的 Alice 用成隨時在場的助教。最後三節收尾：三十二個動作的彙總表、今天十分鐘能填完的三行、用 30 道題找出我沒學會的地方。',
      color: '#b45309',
      group: 'main',
      routes: ['use', 'pro', 'pm', 'build'],
      prologue: true,
      topics: [
        {
          id: 't-learn-open',
          title: '開篇：稀缺的是判斷',
          desc: '答案變便宜之後，漲價的是什麼',
          lessons: [
            { file: 'learn-1.html', title: '讓 AI 幫我判斷：這個建議適合我嗎', desc: 'AI 說年卡划算，可能只是對經常去的人划算。把時間、距離和真實習慣說清楚，答案才是在幫你做決定。', tag: '認知', navTitle: '建議適合我嗎' },
            { file: 'learn-2.html', title: '讓 AI 幫我找到下一步該問什麼', desc: '能問出答案、能指出可疑處、能問出下一問，這三層是分界。讀完能認出自己停在哪一層。', tag: '認知', navTitle: '找到下一問' },
          ],
        },
        {
          id: 't-learn-ask',
          title: '提問：把講義變成考卷',
          desc: '一句提問裡該帶什麼',
          lessons: [
            { file: 'learn-3.html', title: '讓 AI 按我的情況講清楚', desc: '錨點、場景、出題、預警，每缺一個，回答就少一塊。四句模板可以直接抄走。', tag: '提問', navTitle: '按我的情況講' },
            { file: 'learn-4.html', title: '讓 AI 用我熟悉的東西打比方', desc: '它不知道你熟悉什麼，只能從公共題庫裡抽一個源領域。在提問裡空出這一格，填你已經會的東西。', tag: '提問', navTitle: '用熟悉的東西類比' },
            { file: 'learn-5.html', title: '讓 AI 一次只問我一個問題', desc: '把下一步推理變成一個問句交還給你，往下想的活兒留在你這邊。讀完能看出自己卡在第幾問。', tag: '提問', navTitle: '一次只問一個' },
          ],
        },
        {
          id: 't-learn-guard',
          title: '防幻覺：三道防線',
          desc: '它會用同一種語氣說錯',
          lessons: [
            { file: 'learn-6.html', title: '讓 AI 標出最可能編錯的五類資訊', desc: '一段讀起來很順的回答裡，有五個位置預設該當可疑。讀完能指出它們在哪。', tag: '驗證', navTitle: '標出五類可疑資訊' },
            { file: 'learn-7.html', title: '讓 AI 的回答先過三道檢查', desc: '要出處、交叉驗證、標註不確定。同一段回答過三道閘，每開一道篩掉的不一樣，三道全開還剩一條得自己翻原文。', tag: '驗證', navTitle: '回答過三道檢查' },
            { file: 'learn-8.html', title: '這次回答，我要不要去查原文', desc: '按後果決定查不查。越是它答得流暢完整的地方，越值得抽一處去對原文。', tag: '驗證', navTitle: '這次要查原文嗎' },
          ],
        },
        {
          id: 't-learn-hard',
          title: '啃硬材料：從條款到原始碼',
          desc: '讀不下去的東西怎麼拆開',
          lessons: [
            { file: 'learn-9.html', title: '讓 AI 幫我拆開一段看不懂的條款', desc: '先要地圖，再定位卡點，補那一層前置，最後回到原文。四步走完，那一句能用沒有術語的話說出來。', tag: '閱讀', navTitle: '拆開難懂條款' },
            { file: 'learn-10.html', title: '讓 AI 先告訴我必須懂哪五個概念', desc: '按目錄、摘要、結論、圖表、正文的順序給它，開工先問要先懂哪五個概念。', tag: '閱讀', navTitle: '先列五個概念' },
            { file: 'learn-11.html', title: '讓 AI 只根據我貼出的原文回答', desc: '轉述會先丟掉限定條件、例外情況、指向別處的定義，而那正是花錢的部分。', tag: '閱讀', navTitle: '只根據原文' },
            { file: 'learn-12.html', title: '讓 AI 給每條判斷標出原文位置', desc: 'AI 的每一條判斷都要能指回原文的確切位置。指不回去的那幾條，先別拿來做決定。', tag: '閱讀', navTitle: '標出原文位置' },
            { file: 'learn-13.html', title: '讓 AI 先確認我手上是哪一版', desc: '同一個檔名下可能是兩份不同的東西。先確認手上這份的日期和來源，後面的判斷只認這一版。', tag: '閱讀', navTitle: '確認是哪一版' },
            { file: 'learn-14.html', title: '讓 AI 改稿時保住關鍵資訊', desc: '檢查項全過，也可能是因為最難解釋的那段被直接刪掉了。既看留下的，也看少了什麼。', tag: '閱讀', navTitle: '改稿保住關鍵資訊' },
          ],
        },
        {
          id: 't-learn-keep',
          title: '讓知識留下來',
          desc: '取出來，以及寫在對話外面',
          lessons: [
            { file: 'learn-15.html', title: '合上材料，讓 AI 考我一次', desc: '取出來這個動作本身在加固記憶，重讀加固的是眼熟。', tag: '記憶', navTitle: '合上材料考一次' },
            { file: 'learn-16.html', title: '讓 AI 每次換一道沒見過的新題', desc: '固定的舊題會被背熟。AI 的獨特價值是能無限次出新題，而複習要放在快忘的時候。', tag: '記憶', navTitle: '每次換一道新題' },
            { file: 'learn-17.html', title: '讓 AI 找出我在哪一步想錯了', desc: '答錯之後先別看答案，把當時的想法說給它，讓它指出思路在哪一步偏了。', tag: '記憶', navTitle: '找到想錯的一步' },
            { file: 'learn-18.html', title: '讓 AI 在新對話裡接著上次聊', desc: '上下文視窗是這一次會話的工作區，對話一關就空了。留下的那層得寫在外面。', tag: '上下文', navTitle: '新對話接著聊' },
            { file: 'learn-19.html', title: '分三層告訴 AI：我是誰、在做什麼', desc: '一句話自我介紹、專案背景、能被檢索的筆記，各寫什麼、寫在哪。', tag: '上下文', navTitle: '分三層介紹自己' },
            { file: 'learn-20.html', title: '讓 AI 幫我把筆記寫得以後找得到', desc: '一條筆記一個主題，開頭一句話說清結論，帶上當時的困惑。讀完知道每次該挑哪幾條餵進去。', tag: '上下文', navTitle: '筆記以後找得到' },
          ],
        },
        {
          id: 't-learn-check',
          title: '自查與避坑',
          desc: '怎麼知道自己真會了，以及三個坑',
          lessons: [
            { file: 'learn-21.html', title: '讓 AI 像外行一樣追問我', desc: '讓它只帶初中知識來追問。讀完能拿一個概念跑一遍，看自己卡在第幾問。', tag: '自查', navTitle: '像外行一樣追問' },
            { file: 'learn-22.html', title: '讓 AI 改一個條件，再考我一次', desc: '一道原題加三種變體，看同一套背下來的步驟在哪一步失去依據。', tag: '自查', navTitle: '改條件再考一次' },
            { file: 'learn-23.html', title: '讓 AI 等我寫完三行，再給答案', desc: '預測它在邊界上會怎麼走，再讓它故意講錯、你來指。', tag: '自查', navTitle: '寫完三行再給答案' },
            { file: 'learn-24.html', title: '讓 AI 幫我檢查：我是真的懂了嗎', desc: '好的閱讀體驗和知識進腦是兩件事。蓋住那段讀得很順的解釋說三個要點，缺的那條就露出來。', tag: '避坑', navTitle: '我是真的懂了嗎' },
            { file: 'learn-25.html', title: '讓 AI 把推理過程還給我', desc: '結論可以借，推演借走了下次還得再借。讀完能用一句話判斷自己剛才是學會了還是只完成了。', tag: '避坑', navTitle: '把推理過程還給我' },
            { file: 'learn-26.html', title: '收藏之前，先用自己的話說一遍', desc: '擁有資訊和擁有能力之間沒有自動兌換。讀完你會在點星之前多做一步。', tag: '避坑', navTitle: '先用自己的話說' },
          ],
        },
        {
          id: 't-learn-plan',
          title: '給自己設計一門課',
          desc: '把這些動作排進自己的路徑',
          lessons: [
            { file: 'learn-27.html', title: '讓 AI 按我的目標篩掉暫時用不上的材料', desc: '材料按知識完整性編排，你的時間按自己的目標編排。讀完能寫出一句別人看得見的目標，拿它篩材料。', tag: '規劃', navTitle: '按目標篩材料' },
            { file: 'learn-28.html', title: '讓 AI 用一個成品檢查我會不會', desc: '里程碑到期那天要交一個別人看得見的東西，開工之前先跑一次前置自測。', tag: '規劃', navTitle: '用成品檢查' },
            { file: 'learn-29.html', title: '讓 AI 幫我先留出複習時間', desc: '排周曆的時候先扣掉複習位，再往剩下的空裡放新內容。讀完能看出複習位是怎麼被一格一格佔掉的。', tag: '規劃', navTitle: '先留複習時間' },
          ],
        },
        {
          id: 't-learn-alice',
          title: '把側邊欄的 Alice 用起來',
          desc: '站內這個助手怎麼用',
          lessons: [
            { file: 'learn-30.html', title: '直接指著這一頁問 AI', desc: '當前頁正文會自動帶給她，輸入框裡打六個字就夠，不用先把這段複製過去。', tag: '助教', navTitle: '指著這頁問 AI' },
            { file: 'learn-31.html', title: '讓 AI 現在就考我', desc: '空態第五道模擬面試圍繞本頁標題出題，一次一道，由淺入深。讀完會用它看出哪一句取不出來。', tag: '助教', navTitle: '現在就考我' },
            { file: 'learn-32.html', title: '讓 AI 下次主動想起我摘抄的內容', desc: '收藏是把那句話挪到另一個地方等你想起來。摘抄進筆記的那條，下一次你問相關的問題，它自己到她手上。', tag: '助教', navTitle: '下次想起摘抄' },
          ],
        },
        {
          id: 't-learn-end',
          title: '收尾',
          desc: '彙總、今天能做什麼、自測',
          lessons: [
            { file: 'learn-33.html', title: '從 32 個動作裡選出我的下一步', desc: '前面三十二頁各講一件事。勾出現在最缺的那兩三項，這一頁給出該走的頁碼順序。', tag: '彙總', navTitle: '選出我的下一步' },
            { file: 'learn-34.html', title: '今天先完成這三行', desc: '三個動作，十分鐘以內做得完。這一頁不講新東西，填完帶走自己那三行。', tag: '落地', navTitle: '今天完成三行' },
            { file: 'learn-35.html', title: '用 30 道題找出我沒學會的地方', desc: '三十道題覆蓋前面三十二頁。每一道先自己答一遍再翻答案，沒答上的那幾條，末尾按頁碼排成一張補課清單。', tag: '自測', navTitle: '找出沒學會的地方' },
          ],
        },
      ],
    },
    {
      id: 'p0',
      num: '零基礎入門',
      title: '寫給第一次接觸 AI 的你',
      desc: '不講術語、不講數學，用八節互動小課建立對 AI 的正確直覺：它能幹哪些神奇的活、為什麼會一本正經地胡說、怎麼和它說話、什麼能放心交給它。另附「小白三千問」：一頁一問，把新手最常見的疑惑一次說清。零基礎的家人朋友也能看懂，全章免登入開放。',
      color: '#0891b2',
      group: 'main',
      routes: ['use', 'pro', 'pm', 'build'],
      prologue: true,
      topics: [
        {
          id: 't-zero-what',
          title: 'AI 是個什麼東西',
          desc: '先看它的能力，再看穿它的底牌',
          lessons: [
            { file: 'zero-0.html', title: 'AI 能幹哪些神奇的活', desc: '六個真實使用現場：整理紀要、看懂報告、給任何人講任何事、陪練面試、做小工具、生成海報。以前是人學軟體，現在是軟體聽人話', tag: '互動' },
            { file: 'zero-1.html', title: '它其實在玩「接話茬」', desc: '不需要任何基礎：AI 每次只做一件事——猜下一個字。兩個小遊戲，建立你對 AI 的第一個正確直覺', tag: '互動' },
            { file: 'zero-2.html', title: '它不是搜尋引擎', desc: '搜尋給書架，AI 給結論。理解「憑記憶回答」的三個後果：會記串、知識有截止日期、沒有出處可查', tag: '概念' },
            { file: 'zero-3.html', title: '它會一本正經地胡說', desc: '三個找茬遊戲：親手從 AI 的回答裡抓出編造的句子，再帶走三個實用的小習慣', tag: '互動' },
          ],
        },
        {
          id: 't-zero-talk',
          title: '怎麼和它說話',
          desc: '兩個立刻能用的說話技巧',
          lessons: [
            { file: 'zero-4.html', title: '把它當不了解你的新同事', desc: '三檔提問對比 + 提示詞積木組裝器：背景、要求、限制——資訊給一分，它答一分', tag: '互動' },
            { file: 'zero-5.html', title: '萬能開場白：先問我幾個問題', desc: '說不清需求沒關係，讓它來問你。點選式對話演示，親手體驗回答品質翻倍的瞬間', tag: '互動' , navTitle: '萬能開場白：先問我'},
          ],
        },
        {
          id: 't-zero-faq-usage',
          title: '小白三千問 · 會用篇',
          desc: '一頁一問：怎麼用得更好、工具怎麼選',
          lessons: [
            { file: 'zero-q-prompt.html', title: '提示詞到底怎麼寫才好？', desc: '一個萬能骨架（背景+要求+限制）+ 拼圖組裝器：親手拼不同的提示詞，即時看 AI 回答品質的變化', tag: '互動' , navTitle: '提示詞到底怎麼寫才好'},
            { file: 'zero-q-prompt-engineering.html', title: '「提示詞工程」有什麼意義？', desc: '你的一次聊天 vs 產品團隊的一百萬次呼叫：拖動滑塊，親眼看一段廢話被放大成多大的帳單', tag: '互動' , navTitle: '提示詞工程有什麼意義'},
            { file: 'zero-q-model-agent-app.html', title: '模型、Agent、應用是什麼關係？', desc: '發動機、整車、網約車的三層類比 + 對號入座小遊戲：聽到新聞就知道說的是哪一層', tag: '互動' , navTitle: '模型、Agent、應用的關係'},
            { file: 'zero-q-agent.html', title: 'Agent 到底強在哪？', desc: '同一件報銷的事，聊天 AI 和 Agent 幹起來完全不同——點開播放，看 Agent 一步步把活幹完', tag: '互動' , navTitle: 'Agent 到底強在哪'},
            { file: 'zero-q-skill.html', title: '最近很火的 Skill 是什麼？', desc: '一張寫給 AI 的「經驗小抄」。對比播放：沒帶小抄的管家來回跑 4 趟，帶了小抄的一趟搞完', tag: '互動' , navTitle: '最近很火的 Skill 是什麼'},
            { file: 'zero-q-vibe-coding.html', title: 'Vibe Coding 是什麼？不會寫程式碼也能做軟體嗎？', desc: '點選一個生活需求，看「一句話描述 → AI 生成 → 改兩輪 → 能用了」的全過程；學三個月 vs 描述十分鐘的時間對比', tag: '互動' , navTitle: 'Vibe Coding 是什麼'},
            { file: 'zero-q-china-models.html', title: '國產大模型有哪些？該怎麼選？', desc: '通義、Kimi、DeepSeek、豆包、GLM……點選你的場景，對號入座。資料基於全球盲測榜', tag: '互動' , navTitle: '國產大模型怎麼選'},
            { file: 'zero-q-companies.html', title: '還有哪些重要的 AI 公司？', desc: 'OpenAI、Anthropic、Google、Meta、xAI……配對小遊戲把公司和代表作對上號，再看一份友好圖鑑', tag: '互動' , navTitle: '還有哪些重要的 AI 公司'},
          ],
        },
        {
          id: 't-zero-faq-basics',
          title: '小白三千問 · 概念掃盲',
          desc: '一頁一問：新聞高頻詞的零基礎版',
          lessons: [
            { file: 'zero-q-token.html', title: 'Token 是什麼？為什麼 AI 按它收費？', desc: '互動分詞器：點一句話看它被切成多少顆 Token，帳單即時跳動；中英文消耗差異一目瞭然', tag: '互動' , navTitle: 'Token 是什麼'},
            { file: 'zero-q-context-window.html', title: '為什麼聊久了它會「忘事」？', desc: 'AI 的工作臺就那麼大：拖動對話輪數，看臺面放滿後最早的紙條怎麼掉下去，掉的那一刻它開始答非所問', tag: '互動' , navTitle: '為什麼聊久了會忘事'},
            { file: 'zero-q-reasoning.html', title: '「推理模型」「深度思考」是什麼？', desc: '同一道題兩種模式對比：秒答 vs 先想再答；時間和費用差多少、什麼問題值得開思考，四題小測幫你建立手感', tag: '互動' , navTitle: '推理模型是什麼'},
            { file: 'zero-q-parameters.html', title: '參數越多越聰明嗎？', desc: '「千億參數」是什麼概念？拖動規模滑塊建立直覺，再看小模型贏在哪：速度、成本、專精場景', tag: '互動' , navTitle: '參數越多越聰明嗎'},
            { file: 'zero-q-multimodal.html', title: '為什麼有的 AI 看不懂圖片？', desc: '「會說話」和「會看」是兩套本事。給兩個模型各發一張貓圖，親眼看差別，再講清「眼睛」的原理', tag: '互動' , navTitle: '為什麼有的 AI 看不懂圖'},
            { file: 'zero-q-finetune-vs-rag.html', title: '微調是什麼？和「喂資料」有什麼區別？', desc: '重新上課 vs 開卷考試：兩種讓 AI 懂你的路子並排演示，四個真實場景點選對號入座', tag: '互動' , navTitle: '微調和喂資料的區別'},
            { file: 'zero-q-knowledge-base.html', title: '企業都在建的「知識庫」是什麼？', desc: '三步動畫：檔案切塊入庫 → 提問時檢索 → 塞進上下文再回答；同一個問題有無知識庫的回答對比', tag: '互動' , navTitle: '企業知識庫是什麼'},
            { file: 'zero-q-acronyms.html', title: 'GPT、LLM、AIGC…這些縮寫怎麼分？', desc: '配對小遊戲把縮寫和人話解釋連上線，通關後送一張「誰包含誰」的關係圖', tag: '互動' , navTitle: 'AI 縮寫怎麼分'},
            { file: 'zero-q-nvidia-gpu.html', title: '英偉達為什麼那麼值錢？', desc: 'AI 時代的賣鏟人：一個博士逐題算 vs 一萬個小學生同時算，看懂顯示卡為什麼是搶手貨', tag: '互動' , navTitle: '英偉達為什麼值錢'},
          ],
        },
        {
          id: 't-zero-faq-myth',
          title: '小白三千問 · 祛魅打假',
          desc: '一頁一問：拆穿吹牛話術與常見誤解',
          lessons: [
            { file: 'zero-q-train-or-prompt.html', title: '「我訓了個模型」到底訓了什麼？', desc: '四層梯子：改提示詞、掛知識庫、微調、從頭預訓練，每層標註真實成本；聽五句吹牛，判斷說話人到底在哪層', tag: '互動' , navTitle: '訓模型還是改提示詞'},
            { file: 'zero-q-jargon-translator.html', title: 'AI 圈黑話翻譯器', desc: '自研、套殼、數字員工、賦能…點選發表會原話翻譯成人話，附含金量分級和三個當場問出底細的追問', tag: '互動' , navTitle: 'AI 圈黑話翻譯器'},
            { file: 'zero-q-opensource-free.html', title: '「開源模型」等於免費嗎？', desc: '權重、資料、方法三件套逐項檢查主流模型開放了什麼；滿血版 vs 蒸餾版對比，你本地跑的多半是小號', tag: '互動' , navTitle: '開源模型等於免費嗎'},
            { file: 'zero-q-benchmark.html', title: '「跑分第一」的模型，為什麼用起來不行？', desc: '榜單分和真實好用度的反轉演示 + 三個原因：刷榜、過擬合題庫、場景不匹配；順便說清什麼榜更可信', tag: '互動' , navTitle: '跑分第一為什麼不行'},
            { file: 'zero-q-ai-learning.html', title: 'AI 越聊越懂我，是它在學習嗎？', desc: '你以為模型在長大，實際是一張筆記被塞回對話：雙畫面對比動畫 + 新開對話「失憶」演示', tag: '互動' , navTitle: 'AI 是在學習嗎'},
            { file: 'zero-q-ai-detector.html', title: 'AI 檢測器說「這是 AI 寫的」，可信嗎？', desc: '六段文字猜檢測器判定，親手體驗誤傷名場面；為什麼原理上就做不準，被冤枉了怎麼辦', tag: '互動' , navTitle: 'AI 檢測器可信嗎'},
            { file: 'zero-q-prompt-course.html', title: '「提示詞秘籍」值得買嗎？', desc: '把付費課賣點逐條拆開：哪些本站免費教過、哪些是正確的常識、哪些純屬包裝。骨架免費，功夫在多用', tag: '互動' , navTitle: '提示詞秘籍值得買嗎'},
            { file: 'zero-q-randomness.html', title: '同一個問題，為什麼每次答案不一樣？', desc: '同題連問三次看三種回答，配「下一個字」機率骰子動畫；這是設計而非故障，什麼場景需要穩定輸出', tag: '互動' , navTitle: '為什麼每次答案不一樣'},
            { file: 'zero-q-ai-customer-service.html', title: 'AI 客服為什麼那麼蠢？', desc: '同一句投訴發給聊天 AI 和客服機器人，差距一目瞭然；三個原因：省錢用小模型、護欄鎖死、老技術冒充新 AI', tag: '互動' , navTitle: 'AI 客服為什麼蠢'},
            { file: 'zero-q-siri-vs-chatgpt.html', title: 'Siri 和 ChatGPT 是一種東西嗎？', desc: '同一句話兩代助手的處理路徑動畫：命令匹配聽不懂就道歉，生成式什麼說法都接得住', tag: '互動' , navTitle: 'Siri 和 ChatGPT 的區別'},
          ],
        },
        {
          id: 't-zero-faq-money',
          title: '小白三千問 · 花錢與安全',
          desc: '一頁一問：費用、帳號與隱私',
          lessons: [
            { file: 'zero-q-free-vs-paid.html', title: '免費的 AI 夠用嗎？什麼時候值得付費？', desc: '免費版透視：模型檔位、次數、上下文、高峰排隊四項逐個點亮；三類人對號入座，各給一句結論', tag: '互動' , navTitle: '免費的 AI 夠用嗎'},
            { file: 'zero-q-api-vs-membership.html', title: 'API 是什麼？和開會員有什麼區別？', desc: '包月自助餐 vs 按量散稱：拖動用量滑塊算兩種方式各花多少錢，找到你的分界點', tag: '互動' , navTitle: 'API 和會員的區別'},
            { file: 'zero-q-image-cost.html', title: '生成一張圖為什麼貴幾十倍？', desc: '一次問答幾釐錢，一張圖兩三毛。成本條動畫 + 三個原因：畫素多、要畫幾十遍、顯示卡被獨佔', tag: '互動' , navTitle: '生成一張圖為什麼貴'},
            { file: 'zero-q-video-cost.html', title: 'AI 影片為什麼按秒收費？', desc: '拖動滑塊看看：10 秒影片 = 240 幀連貫的圖 + 物理合理 + 音畫同步。省錢順序也一併分享', tag: '互動' , navTitle: 'AI 影片為什麼按秒收費'},
            { file: 'zero-q-relay.html', title: '什麼是 API 中轉站？', desc: '三折價格背後：你的每句話都要經過一個無法核實的中間人。路徑動畫講清三個結構性風險', tag: '互動' , navTitle: '什麼是 API 中轉站'},
            { file: 'zero-q-reverse-proxy.html', title: '「拼車號」「共享號」是什麼？', desc: '9.9 的 Plus 拼車 = 三十人合租單人間。動畫演示：記錄互看、封號連坐、鑰匙在別人手裡', tag: '互動' , navTitle: '拼車號、共享號是什麼'},
            { file: 'zero-q-privacy.html', title: '我的聊天記錄會被拿去訓練嗎？', desc: '一句話發出去之後經過哪些環節、哪步可能進語料；訓練開關怎麼關，免費版和企業版差在哪', tag: '互動' , navTitle: '聊天記錄會被拿去訓練嗎'},
          ],
        },
        /* 放在小白三千问之后：本主题的「你的下一步」是零基础入门篇的收官分流页，
           要紧挨大模型原理篇，才接得上它「进入大模型原理篇」的按钮。 */
        {
          id: 't-zero-trust',
          title: '什麼能放心交給它',
          desc: '一套三秒鐘的信任判斷法',
          lessons: [
            { file: 'zero-6.html', title: '放心用，還是要核實？', desc: '八道判斷題小遊戲 + 信任四象限：有標準答案嗎？錯了後果大嗎？健康錢法律三條紅線', tag: '互動' , navTitle: '放心用，還是要核實'},
            { file: 'zero-final.html', title: '你的下一步', desc: '六個直覺行囊盤點 + 三道題分流測試，找到最適合你的學習路徑', tag: '收官' },
          ],
        },
      ],
    },
    {
      id: 'p1',
      num: '大模型原理',
      title: '大模型是怎麼來的',
      desc: '從訓練資料、Token 到 GPT 躍進，再到大模型幻覺的成因與四種應對方案，建立對大模型底層原理的完整認知。',
      color: '#0066ff',
      group: 'main',
      routes: ['pro', 'pm', 'build'],   // 原理整章進「用到專業」：知道它為什麼會編，用起來才有判斷力
      topics: [
        {
          id: 't-basic',
          title: '基礎原理',
          desc: '訓練資料、訓練 vs 推理、詞表與注意力',
          lessons: [
            { file: 'training-data.html', title: 'AI 的食物：訓練資料', desc: '15T Token 是什麼概念？語料構成視覺化 + 資料規模直覺滑塊', tag: '互動' , navTitle: '訓練資料規模'},
            { file: 'train-vs-infer.html', title: '訓練 vs 推理：兩個不同的過程', desc: '對話不是學習，參數凍結，按 Token 計費，這些是 AI 產品必懂的底層邏輯', tag: '概念' , navTitle: '訓練 vs 推理'},
            { file: '1-2-vocab.html', title: '詞表與訓練', desc: '從語料到詞間矩陣，Token 化 + 注意力權重互動演示', tag: '互動' },
            { file: '1-2-base.html', title: 'Base 模型：Token 推 Token 機器', desc: '訓練結束後得到什麼？逐步生成 + 機率分佈即時更新', tag: '動畫' , navTitle: 'Base 模型'},
            { file: '1-2-gpt.html', title: 'GPT 的躍進：PreTraining 改變一切', desc: 'CNN / RNN / BERT / GPT 四種演算法可互動對比，記憶衰減視覺化', tag: '互動' , navTitle: 'GPT 的躍進'},
          ],
        },
        {
          id: 't-chat',
          title: '從補全到對話',
          desc: '補全機器是如何變成聊天機器人的',
          lessons: [
            { file: '1-2-api.html', title: 'chat/completions 之謎', desc: '明明是對話，為什麼 API 叫「補全」？打字機動畫解讀', tag: '動畫' },
            { file: '1-2-fake-chat.html', title: '偽造聊天記錄', desc: 'OpenAI 最初的實驗：把補全機器變成聊天機器人', tag: '動畫' },
            { file: '1-2-sft.html', title: 'Chat Template + SFT', desc: 'Jinja 格式、指令微調，大模型終於學會說話', tag: '概念' },
            { file: '1-2-prompt-power.html', title: '上下文視窗是關鍵', desc: '提示詞為什麼夠用？Token 截斷視覺化，無需重新訓練', tag: '互動' },
          ],
        },
        {
          id: 't-hallucination',
          title: '幻覺與四種應對',
          desc: '幻覺成因，以及 Prompt / RAG / Temperature / 評測四種緩解方案',
          lessons: [
            { file: '1-2-hallucination.html', title: '大模型幻覺演示', desc: '三類典型幻覺：事實錯誤 / 自信編造 / 知識截止', tag: '案例' , navTitle: '大模型幻覺'},
            { file: '1-2-mitigation-prompt.html', title: '應對 1：Prompt Engineering', desc: '約束指令 + 侷限性：模型不知道自己不知道什麼', tag: '概念' , navTitle: 'Prompt Engineering'},
            { file: '1-2-mitigation-rag.html', title: '應對 2：RAG 檢索增強生成', desc: '真實文件注入上下文，5 步互動流程動畫，對比有無 RAG 的差異', tag: '互動' , navTitle: 'RAG 檢索增強'},
            { file: 'rag-advanced.html', title: 'RAG 的代價與優化策略', desc: '成本分析表 + 關鍵詞觸發 / 模型路由 / 語義快取 / 精準切塊四種策略', tag: 'PM 進階' , navTitle: 'RAG 代價與優化'},
            { file: '1-2-mitigation-temp.html', title: '應對 3：Temperature & Top-P', desc: '拖動滑塊，即時看機率分佈和輸出變化', tag: '互動' , navTitle: 'Temperature & Top-P'},
            { file: '1-2-mitigation-eval.html', title: '應對 4：評測 + 人工審核', desc: '外部糾錯層，冷啟動階段兜底策略（HITL）', tag: '概念' , navTitle: '評測 + 人工審核'},
          ],
        },
        {
          id: 't-summary1',
          title: '篇章彙總',
          desc: '大模型原理篇核心知識回顧',
          lessons: [
            { file: 'summary-1.html', title: '彙總（上）· 大模型是什麼 + 幻覺', desc: '訓練本質 / Token / Base→SFT→Chat / 四種幻覺型別與根因', tag: '彙總' , navTitle: '大模型原理篇彙總（上）'},
            { file: 'summary-1b.html', title: '彙總（下）· 緩解策略 + 決策框架', desc: '四種緩解策略對比 / 常見誤區清單 / 方案選擇判斷矩陣', tag: '彙總' , navTitle: '大模型原理篇彙總（下）'},
          ],
        },
        {
          id: 't-build1',
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-1.html', title: '把那件事定下來', desc: '需求收斂四段演示；三檔任務：寫四行需求、用五個真實輸入試它、劃一條人機分界線', tag: '實戰' },
          ],
        },
        {
          id: 't-interview1',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-1.html', title: '大模型基礎 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：機率預測 / message list / 幻覺解釋 / RAG vs 重訓 / Temperature / 上下文視窗', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p2',
      num: 'Harness 核心',
      title: 'AI Harness',
      desc: '上下文工程、Prompt 進階與安全、Agent 設計與工具呼叫、五層成本優化體系，把大模型真正落地為可用產品。',
      color: '#7c3aed',
      group: 'main',
      routes: ['use', 'pro', 'pm', 'build'],   // Harness 核心篇有三個主題任何人都用得上，篇章並集含 use
      topics: [
        {
          id: 't-context',
          title: '上下文工程',
          desc: 'AI 的工作記憶與溢位處理',
          lessons: [
            { file: '5-1.html', title: '上下文視窗：AI 的工作記憶', desc: '視窗構成視覺化，拖動模擬溢位效果，主流模型容量對比', tag: '互動' , navTitle: '上下文視窗'},
            { file: '5-2.html', title: '上下文溢位：三種處理策略', desc: '直接截斷 / 摘要壓縮 / 選擇性保留，視覺化對比每種策略的利弊', tag: '互動' , navTitle: '上下文溢位策略'},
          ],
        },
        {
          id: 't-prompt',
          title: 'Prompt 工程',
          desc: 'Markdown、角色扮演、進階技巧與輸出格式',
          lessons: [
            { file: '6-0a.html', title: '為什麼大模型選擇 Markdown', desc: '純文字模型 + 排版需求 = MD 成為首選，逐步推演 HTML/Word/LaTeX 為何不行', tag: '動畫' , navTitle: '為什麼選 Markdown'},
            { file: '6-0b.html', title: 'Markdown 語法與渲染 Pipeline', desc: '常用語法速查 + 即時編輯器 + marked.js / markdown-it 渲染方案', tag: '互動' , navTitle: 'MD 語法與工程渲染'},
            { file: '6-1.html', title: '你說什麼，它就變什麼', desc: '五種角色即時切換，輸出格式控制，System Prompt 核心原理', tag: '互動' , navTitle: 'Prompt 角色扮演'},
            { file: '6-2.html', title: 'Prompt 進階技巧', desc: 'Few-Shot / CoT / 約束條件 / 任務拆解，好壞對比互動演示', tag: '互動' },
            { file: '6-3.html', title: '輸出格式取捨', desc: '純文字 / JSON / Markdown / YAML / XML，場景適配度對比與權衡', tag: '互動' },
            { file: '6-4.html', title: '流式返回與格式配合', desc: 'JSON 全文才能解析 / MD 逐字顯示 / XML 捕獲標籤即渲染，動態演示', tag: '互動' , navTitle: '流式返回與格式'},
          ],
        },
        {
          id: 't-security',
          title: 'Prompt 安全',
          routes: ['pm', 'build'],   // Prompt 注入與防護，做產品才需要
          desc: 'Prompt Injection 原理、案例與防禦實戰',
          lessons: [
            { file: 'prompt-attack.html', title: 'Prompt Injection：為什麼會被攻擊', desc: 'SQL 注入類比 → Message List 本質 → 缺乏參數化 → 5 大攻擊型別概覽', tag: '安全' , navTitle: 'Prompt 注入原理'},
            { file: 'prompt-attack-cases.html', title: 'Prompt Injection：12 個攻擊案例', desc: '越權指令 / 角色扮演 / Few-Shot / 結構注入 / 隱喻偽裝，中招版 vs 防禦版', tag: '安全' , navTitle: '12 個攻擊案例'},
            { file: 'prompt-defense.html', title: 'Prompt 防禦：三層攔截實戰', desc: '輸入層正則 → 提示詞層約束 → 輸出層洩漏檢測 → 二次審核，可模擬攻擊全鏈路', tag: '實戰' , navTitle: 'Prompt 防禦實戰'},
            { file: 'ai-safety-redlines.html', title: 'AI 安全紅線：四條底線', desc: '不能做的事、做了會怎樣，產品經理必須守住的四類安全邊界', tag: '安全' , navTitle: 'AI 安全紅線'},
            { file: 'ai-safety-governance.html', title: '風險分級與責任：誰來管、怎麼管', desc: 'AI 輸出的風險分級模型，各角色的責任分工與治理框架', tag: '安全' , navTitle: '風險分級與責任'},
          ],
        },
        {
          id: 't-agent',
          title: 'Agent 工程',
          routes: ['pm', 'build'],   // Agent 工程，產品路線要懂能力邊界
          desc: 'Agent 能力、工具呼叫、ReAct、記憶、Skill 與腳手架',
          lessons: [
            { file: '7-1.html', title: 'Agent：能幹活的 AI', desc: '四大能力 Plan / Tool / Memory / Act，點選查看真實案例', tag: '互動' , navTitle: 'Agent 概念'},
            { file: '7-2.html', title: '工具呼叫的秘密', desc: '模型輸出 JSON → 框架解析執行 → 結果注回，四步流程視覺化', tag: '互動' , navTitle: '工具呼叫'},
            { file: '7-2a.html', title: '一次對話背後的 5 條訊息', desc: '拆解 Function Calling 真實鏈路：使用者看到 1 條回覆，背後是 5 條 API 訊息', tag: '深入' , navTitle: '一次對話背後的5條訊息'},
            { file: '7-2b.html', title: '工具描述的學問', desc: '同樣功能，好描述 vs 壞描述成功率差 3 倍，對比實驗', tag: '深入' },
            { file: '7-2c.html', title: '多工具編排：併發 vs 序列', desc: 'isConcurrencySafe 決定工具能否並行，排程策略視覺化', tag: '深入' , navTitle: '多工具編排'},
            { file: '7-2d.html', title: 'MCP 協議：工具的 USB 介面', desc: 'stdio / SSE / Streamable HTTP 三種傳輸方式對比，資料流動畫', tag: '深入' , navTitle: 'MCP 協議'},
            { file: '7-3.html', title: 'ReAct 實戰：查詢天氣完整鏈路', desc: 'Thought / Action / Observation 逐步演示，7 步完整 Agent 鏈路', tag: '動畫' , navTitle: 'ReAct 實戰'},
            { file: '7-3a.html', title: '短期記憶 = 上下文視窗', desc: '訊息列表視覺化，每條訊息的 Token 佔用和角色標記', tag: '深入' , navTitle: '上下文視窗'},
            { file: '7-3b.html', title: '上下文壓縮：四層防線', desc: '60% 裁剪 → 75% 微壓縮 → 85% 摺疊 → 95% 緊急，拖動滑塊看壓縮過程', tag: '深入' , navTitle: '上下文壓縮四層策略'},
            { file: '7-3c.html', title: '長期記憶：向量檢索', desc: 'Embedding → 向量資料庫 → 語義搜尋，topK 與 minScore 的設計決策', tag: '深入' , navTitle: '長期記憶'},
            { file: 'vector-db-1.html', title: '從 Embedding 到 Milvus', desc: '語義相似度、ANN 與向量資料庫的職責邊界', tag: '深入' },
            { file: 'vector-db-2.html', title: 'Milvus 心智模型', desc: 'Collection、Schema、Entity、Index、Search、Query 與 Load', tag: '深入' },
            { file: 'vector-db-3.html', title: 'Milvus 實操', desc: '連線、建表、批次寫入、索引、搜尋、查詢和刪除', tag: '實戰' },
            { file: 'vector-db-4.html', title: '從檢索到 RAG', desc: '切分、過濾、混合檢索、RRF、重排與評測', tag: '深入' },
            { file: '7-4a.html', title: 'ReAct 迴圈：思考→行動→觀察', desc: '一個刪除 console.log 的任務經歷 14 輪迴圈，含自我糾錯', tag: '深入' , navTitle: 'ReAct 迴圈'},
            { file: '7-4b.html', title: 'Agent 卡死的 5 種模式', desc: '參數格式錯誤、幻覺工具、無限遞迴、資訊不足、API 異常', tag: '深入' , navTitle: 'Agent 卡死的5種模式'},
            { file: '7-4c.html', title: '權限與安全', desc: '5 種權限模式 + LLM 風險分級 + Human-in-the-loop 設計', tag: '深入' },
            { file: '7-5.html', title: 'Skill：讓 Agent 少走彎路', desc: 'Skill = 流程說明 + 工具呼叫指引，用「陽臺收衣服」類比好迴圈 vs 差迴圈', tag: '互動' , navTitle: 'Skill 技能'},
            { file: '7-5a.html', title: 'Skill 的本質', desc: '好迴圈 vs 差迴圈升級版，Skill 如何改變 Agent 執行路徑', tag: '深入' },
            { file: '7-5b.html', title: '解剖一個真實 Skill', desc: '從真實原始碼學 SKILL.md 的結構設計', tag: '深入' },
            { file: '7-4.html', title: '腳手架工程：從試驗品到產品', desc: '模擬 Agent 查機票訂酒店，無腳手架 vs 有腳手架完整對比，5 大能力詳解', tag: '互動' , navTitle: '腳手架工程'},
            { file: '7-6a.html', title: '5 道工程護欄', desc: '迭代上限、輸出截斷、超時控制、中斷恢復、上下文急救', tag: '深入' , navTitle: '5道工程護欄'},
            { file: '7-6b.html', title: '多 Agent 協作', desc: '子 Agent 排程、Worker Thread、並行 vs 序列執行策略', tag: '深入' },
            { file: '7-6c.html', title: '可觀測性', desc: '事件流視覺化、Token 追蹤、OpenTelemetry 整合', tag: '深入' },
            { file: '7-summary.html', title: 'Agent 工程全景圖', desc: '從四大能力到工程落地，一頁看清 Agent 的完整知識地圖', tag: '彙總' },
          ],
        },
        {
          id: 't-cost',
          title: '成本優化與選型',
          routes: ['pm', 'build'],   // 成本與選型，產品路線的剛需
          desc: 'KV Cache、快取、圖片 Token、語法/語義/輸出層優化與模型選型',
          lessons: [
            { file: '8-1.html', title: '多輪對話為什麼越來越貴', desc: 'Token 累積成本視覺化，拖動輪次檢視費用如何指數增長', tag: '互動' , navTitle: '多輪對話成本'},
            { file: '8-2.html', title: 'KV Cache：用空間換時間（和錢）', desc: '類比理解 + 節省效果計算器，拖動輪次檢視節省比例', tag: '互動' , navTitle: 'KV Cache'},
            { file: '8-2b.html', title: '顯式快取：實戰對比', desc: 'cache_control 寫法、快取命中判斷、價格折扣對比，真實省錢效果演示', tag: '互動' , navTitle: '顯式快取'},
            { file: '8-3.html', title: '動態時間戳：最貴的 System Prompt', desc: '錯誤設計 vs 正確設計，三種時間處理方案對比切換', tag: '反例' , navTitle: '動態時間戳'},
            { file: '8-4.html', title: '綜合成本優化：從系統角度省錢', desc: '5 層優化策略，成本構成視覺化，節省 70-90% 的系統設計', tag: '系統設計' , navTitle: '綜合成本優化'},
            { file: '8-5.html', title: '圖片 Token：畫素也在燒錢', desc: '圖片計費公式、縮放機制、解析度陷阱、按任務分級策略', tag: '多模態' , navTitle: '圖片 Token 計費'},
            { file: '8-5b.html', title: '按任務匹配解析度', desc: '高/中/低三檔解析度策略，不同場景的 Token 消耗對比與選型建議', tag: '多模態' },
            { file: '8-6.html', title: '語法層優化：寫給機器的提示詞', desc: 'YAML vs JSON、CSV vs 陣列、壓縮 JSON 輸出，格式性 Token 省 10-30%', tag: '提示詞工程' , navTitle: '語法層優化'},
            { file: '8-7.html', title: '語義層優化：不要把上下文當垃圾桶', desc: '動態 Few-Shot、LLMLingua-2 壓縮、關鍵資訊放首尾，提升資訊密度', tag: 'RAG' , navTitle: '語義層優化'},
            { file: '8-8.html', title: '輸出層 + KV Cache 進階', desc: '負向約束、Diff 潤色、停止序列；KV Cache 的工具陷阱與滑動視窗問題', tag: '架構' , navTitle: '輸出層+KV進階'},
            { file: 'cost-eval.html', title: '模型選型：能力 vs 成本', desc: '主流模型能力/成本矩陣、選型決策樹、不同場景的模型匹配策略', tag: '選型' },
            { file: 'engineering-philosophy.html', title: '大道至簡：堅守第一性原理', desc: 'AI Harness 的本質 / 做 vs 不做的取捨 / 會被時代淘汰的 Harness / 終極問題', tag: '收官' , navTitle: '大道至簡'},
          ],
        },
        {
          id: 't-tips',
          title: '實用技巧',
          desc: '人機邊界、提問方式、迭代方法、場景判斷與幻覺驗證，一份用 AI 的日常指南',
          lessons: [
            { file: 'ai-tips-boundary.html', title: '人機知識邊界：四象限策略', desc: '什麼交給 AI、什麼自己來，用四象限快速判斷任務分配', tag: '技巧' , navTitle: '人機知識邊界'},
            { file: 'ai-tips-context.html', title: '好提問 vs 壞提問', desc: '上下文決定輸出品質，同一個問題好壞對比演示', tag: '技巧' },
            { file: 'ai-tips-verify.html', title: 'AI 說的能信嗎？找出幻覺', desc: '三種快速驗證方法，識別 AI 自信說錯的場景', tag: '技巧' , navTitle: 'AI 說的能信嗎'},
            { file: 'ai-tips-iterate.html', title: '迭代的藝術：知道何時收手', desc: '從粗到精的迭代節奏，以及何時該停止追問 AI', tag: '技巧' , navTitle: '迭代的藝術'},
            { file: 'ai-tips-scenarios.html', title: '場景速查：什麼時候放心用', desc: '高可信 / 需驗證 / 慎用 / 不用，AI 適用場景四分類', tag: '技巧' , navTitle: '場景速查'},
          ],
        },
        {
          id: 't-summary2',
          title: '課程收官',
          routes: ['pm', 'build'],   // 篇章收官，跟著正課走
          desc: 'Harness 核心篇回顧 + 完整課程總結',
          lessons: [
            { file: 'summary-2.html', title: '彙總（上）· Prompt 工程 + Agent', desc: '上下文溢位策略 / Prompt 六要素 / 工具呼叫真相 / Skill + 腳手架', tag: '彙總' , navTitle: 'Harness 核心篇彙總（上）'},
            { file: 'summary-2b.html', title: '彙總（下）· 成本優化 + PM 視角', desc: '五層成本體系 / KV Cache 原理 / 圖片 Token / 課程完整能力清單', tag: '彙總' , navTitle: 'Harness 核心篇彙總（下）'},
            { file: 'summary-final.html', title: '課程總結 · 產品經理的第一節 AI 課', desc: '從大模型原理到工程落地，完整課程一頁回顧', tag: '彙總' , navTitle: '課程總結'},
            { file: 'summary-final-1.html', title: '總結（上）· 原理 + Harness', desc: '大模型認知框架 / 幻覺應對 / Prompt 與 Agent 核心要點', tag: '彙總' , navTitle: '總結（上）'},
            { file: 'summary-final-2.html', title: '總結（下）· 實戰 + 成本', desc: '安全防禦 / 成本優化 / 用 AI 的正確姿勢 / 下一步學習路徑', tag: '彙總' , navTitle: '總結（下）'},
          ],
        },
        {
          id: 't-build2',
          title: '你現在能做什麼',
          routes: ['pm', 'build'],   // 落地清單，跟著正課走
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-2.html', title: '讓它連跑五次都能用', desc: '同一輸入五連跑演示；三檔任務：寫第一版提示詞、給不穩定歸類、加示例與違禁項重跑對比', tag: '實戰' },
          ],
        },
        {
          id: 't-interview2',
          title: '他們會這樣考你',
          routes: ['pm', 'build'],   // 面試題，跟著正課走
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-2.html', title: 'AI Harness · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：上下文溢位 / Prompt 工程 / 注入防禦 / 工具呼叫 / 成本帳單 / KV Cache / 輸出格式', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p3',
      num: '動手實戰',
      title: '實戰 · 從 Demo 到產品',
      desc: '以真實 AI Agent 桌面應用為例，拆解生圖產品化、Agent 迴圈控制、上下文壓縮、長期記憶、Prompt Harness、多 Agent 協作、權限安全與 MCP 生態，走完從「調通 API」到「使用者能用」的完整實戰路徑。',
      color: '#059669',
      group: 'main',
      prereq: '建議先學過 Harness 核心',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-alice-intro',
          title: '開篇',
          desc: '本章從哪來：一個真實產品的開發實錄',
          lessons: [
            { file: '9-0.html', title: '本章從哪來：Alice 開發實錄', desc: '本章是作者開發 AI Agent 桌面應用 Alice 的經驗總結：約 50 萬行程式碼、132 個工具、8 大模組與本章 8 個小節一一對應', tag: '開篇' , navTitle: 'Alice 開發實錄'},
          ],
        },
        {
          id: 't-imagegen',
          title: 'AI 生圖',
          desc: '文生圖、墊圖、角色一致性、多模型降級與產品化',
          lessons: [
            { file: '9-1.html', title: '文生圖 vs 墊圖：兩種完全不同的事', desc: '一個從文字出發，一個從圖片出發。產品經理要分清什麼時候用哪種', tag: '概念' , navTitle: '文生圖 vs 墊圖'},
            { file: '9-2.html', title: '用 AI 給 AI 寫 Prompt', desc: '使用者說「畫個夕陽下的貓」，生圖模型需要的是完全不同的描述，解法是用 LLM 做翻譯', tag: '實戰' },
            { file: '9-3.html', title: '角色一致性：最難的產品問題', desc: '同一個 IP 每次畫都長不一樣。為什麼難、產品上怎麼思考這個問題', tag: '案例' , navTitle: '角色一致性'},
            { file: '9-4.html', title: '模型會掛，然後呢？', desc: '多模型降級鏈的產品邏輯：優先順序、白名單、探活、全掛時的體驗兜底', tag: '實戰' , navTitle: '模型會掛，然後呢'},
            { file: '9-5.html', title: '生圖的產品化清單', desc: '從「調通了 API」到「使用者能用」之間還差哪些東西，一張 checklist 數清楚', tag: '系統設計' , navTitle: '生圖產品化清單'},
          ],
        },
        {
          id: 't-agentloop',
          title: 'Agent Loop',
          routes: ['build'],   // Agent Loop 實現細節
          desc: '生產級迴圈的控制、防護與流式體驗',
          lessons: [
            { file: '9-6.html', title: '教科書的 3 步 vs 真實的 N 步', desc: 'ReAct 不止 Think-Act-Observe 三步，生產環境每輪還要做什麼', tag: '概念' , navTitle: '教科書 vs 真實 N 步'},
            { file: '9-7.html', title: '為什麼 Agent 會卡死', desc: '真實場景中迴圈掛掉的幾種典型模式，以及使用者會看到什麼', tag: '案例' , navTitle: 'Agent 為什麼會卡死'},
            { file: '9-8.html', title: '防呆設計：怎麼讓迴圈自己停下來', desc: '上限、檢測、降級三類策略的思路，產品經理該在哪裡畫線', tag: '實戰' , navTitle: '防呆設計'},
            { file: '9-9.html', title: '流式體驗：別讓使用者乾等', desc: '工具在後臺跑 30 秒，使用者看到的應該是什麼？進度感設計', tag: '互動' , navTitle: '流式體驗'},
            { file: '9-10.html', title: '一條訊息背後的真實成本', desc: '使用者發一句話，底層可能跑 10+ 輪迴圈、幾十條 API 訊息，由此建立成本意識', tag: '深入' , navTitle: '一條訊息的真實成本'},
          ],
        },
        {
          id: 't-ctxmgmt',
          title: '上下文管理',
          routes: ['build'],   // 上下文管理實現細節
          desc: '對話越長越貴越笨：壓縮的藝術與取捨',
          lessons: [
            { file: '9-11.html', title: '對話越長越貴、越長越笨', desc: '費用遞增 + 注意力衰減 + 視窗有限，三個必須管理上下文的理由', tag: '概念' , navTitle: '越長越貴越笨'},
            { file: '9-12.html', title: '壓縮是一門取捨的藝術', desc: '有的能刪、有的不能刪、有的要花錢壓，這是產品經理的決策框架', tag: '實戰' , navTitle: '壓縮的藝術'},
            { file: '9-13.html', title: '使用者說的話能不能刪？', desc: '「聖物」問題：AI 的輸出可以壓縮，但使用者的原話刪了就回不來', tag: '概念' , navTitle: '使用者的話能刪嗎'},
            { file: '9-14.html', title: '本地壓縮 vs LLM 壓縮', desc: '零成本快但粗 vs 有成本慢但精，什麼時候用哪種', tag: '深入' , navTitle: '本地 vs LLM 壓縮'},
          ],
        },
        {
          id: 't-memory',
          title: '長期記憶',
          routes: ['build'],   // 長期記憶實現細節
          desc: '讓 AI 認識你：記憶的提取、衝突與注入',
          lessons: [
            { file: '9-15.html', title: '上下文 ≠ 記憶', desc: '白板（上下文視窗）和筆記本（長期記憶）的區別，為什麼需要兩套系統', tag: '概念' },
            { file: '9-16.html', title: '什麼值得記、什麼不值得記', desc: '不是所有對話都有價值：守門員思路與篩選邏輯', tag: '實戰' , navTitle: '什麼值得記'},
            { file: '9-17.html', title: '記憶衝突：使用者改了主意怎麼辦', desc: '新舊記憶衝突的四種處理策略：新增 / 合併 / 衝突標記 / 跳過', tag: '案例' , navTitle: '記憶衝突'},
            { file: '9-18.html', title: '記憶注入的成本問題', desc: '記了 1000 條，每次全塞進去？還是按需檢索？兩種策略的代價', tag: '深入' , navTitle: '記憶注入的成本'},
          ],
        },
        {
          id: 't-prompteng',
          title: 'Prompt Harness',
          routes: ['build'],   // Prompt Harness 實現細節
          desc: '從字串到架構：分層、按需載入與 Skill 模組化',
          lessons: [
            { file: '9-19.html', title: 'System Prompt 不是一坨文字', desc: '分層管理的必要性：身份、環境、工具指引各自獨立，互不干擾', tag: '架構' , navTitle: 'System Prompt 分層'},
            { file: '9-20.html', title: '不用的東西別給 AI 看', desc: '100 個工具全塞 system？Token 爆炸。這就需要按需載入的設計思路', tag: '實戰' , navTitle: '按需載入'},
            { file: '9-21.html', title: 'Skill：可營運的 Prompt 模組', desc: '檔案即配置、版本可追溯，讓 Prompt 也能像程式碼一樣管理', tag: '實戰' , navTitle: 'Skill 模組化'},
            { file: '9-22.html', title: '提示詞和快取的微妙關係', desc: '改一個字 System Prompt，整條 KV Cache 作廢。怎麼減少手抖的成本', tag: '深入' , navTitle: '提示詞與快取'},
          ],
        },
        {
          id: 't-multiagent',
          title: '多 Agent',
          routes: ['build'],   // 多 Agent 實現細節
          desc: '並行、腦暴、定時任務與協作成本',
          lessons: [
            { file: '9-23.html', title: '什麼時候需要多個 Agent', desc: '並行加速、角色分工、風險隔離，三種真實場景', tag: '概念' , navTitle: '何時需要多 Agent'},
            { file: '9-24.html', title: '併發的代價：誰能同時跑', desc: '「看」可以並行，「改」必須排隊，為什麼以及怎麼判斷', tag: '實戰' , navTitle: '併發的代價'},
            { file: '9-25.html', title: '腦暴：讓多個 AI 吵架', desc: '同一問題多角度獨立思考，彙總共識與分歧，這是群體智慧的 AI 版', tag: '互動' , navTitle: '腦暴模式'},
            { file: '9-26.html', title: '定時任務的成本陷阱', desc: 'Agent 定時跑任務，上下文是累積還是重建？一個選擇差 10 倍成本', tag: '反例' , navTitle: '定時任務成本'},
          ],
        },
        {
          id: 't-security',
          title: '權限與安全',
          routes: ['build'],   // 權限與安全的落地實現
          desc: 'Agent 的韁繩：權限分級、審批與可觀測性',
          lessons: [
            { file: '9-27.html', title: 'AI 該有多大的自由', desc: '完全自主 vs 每步審批，五種權限模式和適用場景', tag: '概念' , navTitle: 'AI 的自由度'},
            { file: '9-28.html', title: '彈窗太多使用者煩，不彈又不安全', desc: 'Human-in-the-loop 的平衡點：風險分級思路', tag: '實戰' , navTitle: '彈窗與安全平衡'},
            { file: '9-29.html', title: 'Agent 幹了什麼你知道嗎', desc: '事件流與 Token 追蹤。不看日誌你永遠不知道出了什麼錯', tag: '架構' , navTitle: '可觀測性'},
          ],
        },
        {
          id: 't-mcp',
          title: 'MCP 實戰',
          routes: ['build'],   // MCP 實戰程式碼
          desc: '工具生態的雙向連線：消費、提供與自配置',
          lessons: [
            { file: '9-30.html', title: 'MCP 不只是「調工具」', desc: '同一個協議兩個方向：消費別人的工具 vs 把自己暴露給別人', tag: '概念' , navTitle: 'MCP 雙向協議'},
            { file: '9-31.html', title: '懶連線：不用別連', desc: '註冊了 10 個 MCP 服務，啟動時全連一遍？還是用到再連？', tag: '實戰' , navTitle: '懶連線'},
            { file: '9-32.html', title: 'AI 自己加工具', desc: 'Agent 執行時發現需要新工具，自己配置 MCP 連線，這就是自配置思路', tag: '深入' , navTitle: 'AI 自加工具'},
          ],
        },
        {
          id: 't-summary3',
          title: '實戰收官',
          desc: '全景回顧與核心洞察',
          lessons: [
            { file: '9-summary.html', title: '實戰全景圖', desc: '生圖、迴圈、記憶、Prompt、多 Agent、安全、MCP，一張圖串起來', tag: '彙總' },
            { file: '9-final.html', title: '聊天套殼 vs 真正的 Agent 產品', desc: '同一個 Loop 支撐 N 種場景，差異不在程式碼，在產品決策', tag: '收官' , navTitle: '聊天套殼 vs Agent 產品'},
          ],
        },
        {
          id: 't-build3',
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-3.html', title: '接上第一個真工具', desc: '工具呼叫閉環四段演示；三檔任務：選定工具、寫三行描述、跑通閉環並故意搞一次破壞', tag: '實戰' },
          ],
        },
        {
          id: 't-interview3',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-3.html', title: '實戰 · 從 Demo 到產品 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：Demo 到上線的差距 / Agent 卡死 / 上下文壓縮 / 記憶設計 / 多 Agent / MCP / 成本帳單', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p4',
      num: '工程進階',
      title: '進階 · AI 工程設計模式',
      desc: '基於 Anthropic 公開的 Claude Code 原始碼與工程部落格，深入拆解生產級 Agent 的設計模式：上下文工程、工具設計、評測方法論、長執行 Agent、腦手分離架構與安全容器化。',
      color: '#dc2626',
      group: 'main',
      prereq: '建議先學過動手實戰',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-agent-patterns',
          title: 'Agent 設計模式',
          desc: 'Anthropic 官方總結的五種 Workflow + 自主 Agent',
          lessons: [
            { file: '10-1.html', title: 'Workflow vs Agent：先搞清楚你要什麼', desc: '預定義流程 vs 模型自主決策，Anthropic 定義的兩大類 Agent 系統', tag: '設計模式' , navTitle: 'Workflow vs Agent'},
            { file: '10-2.html', title: '五種 Workflow 模式', desc: 'Prompt Chaining / Routing / Parallelization / Orchestrator-Workers / Evaluator-Optimizer', tag: '設計模式' },
            { file: '10-3.html', title: '從 Prompt 工程到上下文工程', desc: '在每一輪推理時策展最優的 Token 組合，寫好提示詞只是其中一環', tag: '方法論' , navTitle: '上下文工程方法論'},
            { file: '10-4.html', title: '上下文的三板斧', desc: 'Compaction、結構化筆記、子 Agent 架構，長任務的三種上下文管理策略', tag: '方法論' , navTitle: '上下文三板斧'},
          ],
        },
        {
          id: 't-tool-design',
          title: '工具設計的藝術',
          desc: '如何為 Agent 寫出好工具：命名、描述、參數與 ACI',
          lessons: [
            { file: '10-5.html', title: 'ACI：Agent-Computer Interface', desc: '工具是 Agent 和世界之間的契約。像設計人機介面一樣設計 Agent 介面', tag: '設計模式' , navTitle: 'ACI 工具介面設計'},
            { file: 'vector-db-5.html', title: 'Milvus 作為 Agent 知識庫工具', desc: '把向量檢索封成 search_knowledge：ToolMessage、記憶分層與呼叫/不呼叫的測試', tag: '實戰' , navTitle: 'Agent 知識庫工具'},
            { file: '10-6.html', title: 'Think Tool：讓 AI 先想後做', desc: '在複雜工具鏈中給 Agent 一個暫停思考的空間，τ-bench 效能提升 54%', tag: '深入' , navTitle: 'Think Tool'},
            { file: '10-7.html', title: '用 Agent 優化 Agent 的工具', desc: 'Claude Code 實踐：用 AI 寫工具描述、跑評測、自動迭代優化', tag: '實戰' , navTitle: '用 Agent 優化工具'},
          ],
        },
        {
          id: 't-evals',
          title: 'Agent 評測',
          desc: '不評測就是在裸奔。如何系統化驗證 Agent 品質',
          lessons: [
            { file: '10-8.html', title: '為什麼評測比訓練更重要', desc: '沒有評測，修一個 bug 製造三個。Anthropic 的 Eval 方法論', tag: '方法論' , navTitle: '評測方法論'},
            { file: '10-9.html', title: '三種 Grader：程式碼、模型、人工', desc: '靜態斷言 vs LLM-as-Judge vs 人工校準，每種適合什麼場景', tag: '實戰' , navTitle: '三種 Grader'},
            { file: '10-10.html', title: '評測的坑：噪音、作弊與退化', desc: '基礎設施噪音可造成 6pp 誤差、模型會識別考試、改 Prompt 可能讓 Eval 掉 3%', tag: '案例' , navTitle: '評測的坑'},
          ],
        },
        {
          id: 't-long-running',
          title: '長執行 Agent',
          desc: '從一輪對話到跑幾小時：Harness 的設計與演進',
          routes: ['build'],   // 工程實現細節，產品路線跳過
          lessons: [
            { file: '10-11.html', title: '為什麼 Agent 跑不了長任務', desc: '一口氣做太多、做完就收工，兩種典型失敗模式', tag: '案例' , navTitle: '長任務失敗模式'},
            { file: '10-12.html', title: 'Initializer + Coding Agent', desc: '初始化 Agent 搭環境、編碼 Agent 增量推進，雙角色 Harness 設計', tag: '設計模式' , navTitle: '雙角色 Harness'},
            { file: '10-13.html', title: 'Managed Agent：腦手分離', desc: '把思考和執行拆到不同程序，像作業系統一樣虛擬化 Agent', tag: '架構' , navTitle: 'Managed Agent'},
            { file: '10-14.html', title: 'Session ≠ Context Window', desc: '會話日誌是持久的事件流、上下文視窗是臨時的工作記憶，兩者必須分離', tag: '深入' , navTitle: 'Session vs Context'},
          ],
        },
        {
          id: 't-security-advanced',
          title: '安全與容器化',
          desc: 'Anthropic 如何在產品中約束 Claude',
          routes: ['build'],   // 工程實現細節，產品路線跳過
          lessons: [
            { file: '10-15.html', title: '三類風險：濫用、失控、外部攻擊', desc: 'Anthropic 的安全分類框架：使用者濫用 / 模型 Misbehavior / Prompt Injection', tag: '安全' , navTitle: '三類安全風險'},
            { file: '10-16.html', title: '沙箱與憑證隔離', desc: '生成的程式碼和金鑰永遠不在同一個容器裡。結構性安全比靠提示詞更可靠', tag: '安全' },
          ],
        },
        {
          id: 't-summary4',
          title: '進階收官',
          desc: '全景回顧與核心設計原則',
          lessons: [
            { file: '10-17.html', title: 'Contextual Retrieval：更好的 RAG', desc: '在檢索前先給 Chunk 加上下文，Anthropic 的 RAG 升級方案', tag: '深入' , navTitle: 'Contextual Retrieval'},
            { file: '10-summary.html', title: '進階全景圖', desc: '設計模式、工具、評測、長執行、安全，一張圖串起來', tag: '彙總' },
            { file: '10-final.html', title: '做最簡單的、能跑的東西', desc: 'Anthropic 的核心工程哲學："Do the simplest thing that works"', tag: '收官' , navTitle: 'Do the simplest thing'},
          ],
        },
        {
          id: 't-build4',
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-4.html', title: '搭你的第一個評測集', desc: '改動前後跑分對比演示；三檔任務：攢十條真實用例、寫透過標準跑基線、用分數說話', tag: '實戰' },
          ],
        },
        {
          id: 't-interview4',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-4.html', title: 'AI 工程設計模式 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：上下文工程 / 長任務 / grep vs RAG / ACI 工具設計 / 評測基建 / LLM-as-Judge / 沙箱隔離', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p5',
      num: '自我改進',
      title: 'Harness 與自我改進',
      desc: '從 Harness 設計模式到遞迴自我改進：當 Agent 開始優化自己的腳手架，AI 工程進入新階段。基於 Lilian Weng 2026 年前沿綜述。',
      color: '#7c3aed',
      group: 'main',
      prereq: '建議先學過工程進階',
      routes: ['build'],
      topics: [
        {
          id: 't-harness-intro',
          title: 'Harness 概論',
          desc: '遞迴自我改進與 Harness 的核心地位',
          lessons: [
            { file: '11-1.html', title: '從腳手架到自我改進系統', desc: '遞迴自我改進（RSI）的歷史與近期路徑：模型改進 Harness，不直接改寫權重', tag: '前沿' , navTitle: '從腳手架到自我改進'},
            { file: '11-2.html', title: 'Harness 三大設計模式', desc: '工作流自動化 / 檔案系統持久記憶 / 子 Agent 與後臺任務，構建 Agent 執行時的三個基石', tag: '設計模式' },
          ],
        },
        {
          id: 't-harness-optimize',
          title: 'Harness 優化',
          desc: '從上下文工程到工作流自動搜尋',
          lessons: [
            { file: '11-3.html', title: '上下文工程：從手寫到自動進化', desc: 'ACE → MCE → Meta-Harness：優化物件從 prompt 內容演進到管理機制程式碼', tag: '前沿' , navTitle: '上下文工程自動進化'},
            { file: '11-4.html', title: '工作流設計：從手工到自動搜尋', desc: 'AI Scientist / ADAS / AFlow，用 MCTS 和 Meta-Agent 搜尋最優工作流', tag: '前沿' , navTitle: '工作流自動搜尋'},
          ],
        },
        {
          id: 't-harness-self',
          title: '自我改進與進化',
          desc: '讓 Harness 改進自己、用進化演算法搜尋設計空間',
          lessons: [
            { file: '11-5.html', title: '讓 Harness 改進自己', desc: 'STOP 遞迴改善器 + Self-Harness 的 propose-evaluate-accept 迴圈', tag: '前沿' },
            { file: '11-6.html', title: '進化搜尋：讓最強 Harness 存活', desc: 'AlphaEvolve / DGM / SIA，用進化演算法在龐大設計空間中發現最優 Agent', tag: '前沿' , navTitle: '進化搜尋'},
          ],
        },
        {
          id: 't-harness-future',
          title: '未來與反思',
          desc: '自我改進面臨的根本挑戰',
          lessons: [
            { file: '11-7.html', title: '未來挑戰：自我改進的七道關', desc: '弱評估器 / 記憶退化 / 獎勵駭客 / 多樣性坍縮 / 人類角色，通往完整 RSI 的瓶頸', tag: '前沿' , navTitle: '未來挑戰七道關'},
          ],
        },
        {
          id: 't-build5',
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-5.html', title: '立三條長跑規矩', desc: '上下文佔用曲線與壓縮閾值演示；三檔任務：找到失憶輪次、寫三條規矩、跑通落盤再讀回', tag: '實戰' },
          ],
        },
        {
          id: 't-interview5',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-5.html', title: 'Harness 與自我改進 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：Harness 本質 / 設計模式 / 上下文自動進化 / 獎勵駭客 / RSI 進展與風險', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p7',
      num: '協作方法論',
      title: 'Vibe Coding 方法論',
      desc: '產品五連的第一章，也是後面四章的地基：手上沒有一套穩定的協作流程，談好看、好用、使用者覺得好用都是空的。基於作者開源的 xs_vibe_rules 倉庫，把多個真實專案沉澱出的 AI 協作規範拆成課程：流程控制、品質底線、文件沉澱、安全閘門與寫作風格，讓 AI 寫得快也寫得穩。',
      color: '#0d9488',
      group: 'indie',
      cluster: 'chain',
      routes: ['use', 'pro', 'pm', 'build'],   // 一個人做產品就要自己指揮 AI 寫程式碼；兩個主題任何人都用得上，篇章並集含 use
      topics: [
        {
          id: 't-vibe-why',
          routes: ['use', 'pro', 'pm', 'build'],   // AI 為什麼會寫崩，跟 AI 打交道的人都該知道
          title: '理念與入門',
          desc: '為什麼 AI 寫得快反而容易搞砸，Rules 為什麼是最穩的約束方式',
          lessons: [
            { file: 'vibe-1.html', title: '為什麼要給 AI 立規矩', desc: 'Vibe Coding 的四類典型事故，以及 Rule 是最穩上下文注入方式的原理', tag: '互動' },
          ],
        },
        {
          id: 't-vibe-flow',
          routes: ['pro', 'pm', 'build'],   // 四步流程與 PlayGround，偏動手
          title: '流程控制',
          desc: '在 AI 動手之前設好人工斷點',
          lessons: [
            { file: 'vibe-2.html', title: '四步流程：複述、PRD、確認、編碼', desc: '把需求確認環節搬進人機協作，批次修改先列計劃，新功能先查重', tag: '互動' , navTitle: '四步流程'},
            { file: 'vibe-3.html', title: 'PlayGround：元件的試衣間', desc: '簡化版 Storybook 思路：先做獨立 demo 調好再整合，demo 只增不刪', tag: '互動' , navTitle: 'PlayGround 試衣間'},
          ],
        },
        {
          id: 't-vibe-quality',
          routes: ['pro', 'pm', 'build'],   // 註釋、除錯、交付粒度，偏程式碼
          title: '品質底線',
          desc: '樣式複用、註釋、除錯與完整實現的硬性要求',
          lessons: [
            { file: 'vibe-3b.html', title: '樣式收斂：一個按鈕不要八套 CSS', desc: '樣式為什麼會增殖、怎麼分批收進 token，以及哪些差異該留著', tag: '互動' , navTitle: '樣式收斂'},
            { file: 'vibe-4.html', title: '註釋三要素與程式碼保護', desc: '背景、設計意圖、關鍵約束缺一不可；禁止靜默刪除程式碼與依賴', tag: '互動' },
            { file: 'vibe-5.html', title: '除錯鐵律：先 Log 再改碼', desc: '禁止猜測性修復，修復前回答三個問題，改完宣告影響範圍', tag: '互動' , navTitle: '除錯鐵律'},
            { file: 'vibe-6.html', title: '不接受分期交付', desc: 'AI 愛做「先上簡版」的真實原因，以及為什麼要打破這個模式', tag: '互動' },
          ],
        },
        {
          id: 't-vibe-docs',
          routes: ['pro', 'pm', 'build'],   // 三份文件與方法論沉澱，做產品要懂
          title: '文件與沉澱',
          desc: '讓決策跨越對話和時間留存下來',
          lessons: [
            { file: 'vibe-7.html', title: '三份文件與方法論沉澱', desc: 'FEATURES / CHANGELOG / RELEASE_NOTES 各管一個維度，METHODOLOGY 沉澱產品品味', tag: '互動' },
          ],
        },
        {
          id: 't-vibe-env',
          routes: ['pro', 'pm', 'build'],   // 環境事實與破壞性操作，偏工程
          title: '環境與安全',
          desc: '把環境事實寫死，給破壞性操作上閘',
          lessons: [
            { file: 'vibe-8.html', title: '把環境事實寫進 Rule', desc: '模型配置、技術棧鎖定、資料格式三分法與 isComposing 這類必踩的坑', tag: '互動' },
            { file: 'vibe-9.html', title: '破壞性操作的三道閘', desc: '資料庫先備份、不可逆操作先給回退方案、發版前做 diff 審查', tag: '互動' },
          ],
        },
        {
          id: 't-vibe-comm',
          routes: ['use', 'pro', 'pm', 'build'],   // 長對話不跑偏、去 AI 腔，不寫程式碼也天天用
          title: '溝通與寫作',
          desc: '對抗上下文漂移，消滅 AI 腔',
          lessons: [
            { file: 'vibe-10.html', title: '長對話錨定與寫作規範', desc: '超過 10 輪強制複述目標；違禁句式清單讓文案擺脫 AI 腔', tag: '互動' },
          ],
        },
        {
          id: 't-vibe-final',
          routes: ['use', 'pro', 'pm', 'build'],   // 規則全景與怎麼改成自己的，和理念、溝通兩節湊成不寫程式碼也能看的小閉環
          title: '專題收官',
          desc: '把這套規則改造成你自己的',
          lessons: [
            { file: 'vibe-final.html', title: '規則的價值：每條解決一個真實問題', desc: '全景圖回顧 + 使用方法 + 適配自己專案的四個動作', tag: '收官' , navTitle: '規則的價值'},
          ],
        },
        {
          id: 't-build6',
          routes: ['pro', 'pm', 'build'],   // 動手任務，跟著這章走
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'build-6.html', title: '沉澱你自己的協作規範', desc: '四步流程對比演示；三檔任務：寫第一條 Rule、真需求走一遍流程、匯出建造日誌整理成規範 v1', tag: '實戰' },
          ],
        },
        {
          id: 't-interview7',
          routes: ['pro', 'pm', 'build'],   // 面試題，跟著這章走
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-7.html', title: 'Vibe Coding 方法論 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：為什麼立規矩 / 品質責任 / 程式碼合入把關 / 拒絕分期 / 決策沉澱 / 安全閘門', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p-taste',
      num: '專題篇章',
      title: '審美工程：讓 AI 做出有品味的東西',
      desc: '協作流程立住之後，第一個卡住你的是審美。AI 把執行門檻打掉之後，人人都能十分鐘做出能用的東西，「能用」本身開始貶值，品味成了新的分水嶺。這一章教兩項可訓練的技能：識別美，四個抓手（層級、留白、剋制、一致性）每個配 A/B 找茬互動；把審美翻譯給 AI 聽，審美詞彙表、生 UI 與生圖的提示詞寫法、墊圖與參考庫。天賦型的「創造美」教不了，但「看出哪裡不對」和「說清要什麼」，練了就會。',
      color: '#db2777',
      group: 'indie',
      cluster: 'chain',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-taste-why',
          title: '品味成了新瓶頸',
          desc: '執行能力被拉平之後，判斷力開始漲價',
          lessons: [
            { file: 'taste-1.html', title: '執行免費了，判斷力開始漲價', desc: '當人人都能十分鐘做出能用的東西，「能用」就開始貶值。三個介面先憑直覺投一票，學完這章回來再投一次，看你的眼睛變了沒有', tag: '開篇' , navTitle: '判斷力開始漲價'},
            { file: 'taste-2.html', title: '「AI 味兒」是怎麼來的', desc: '紫色漸變、毛玻璃、圓角卡片三件套：AI 預設輸出訓練資料的平均值，平均值就是平庸。在一張典型的 AI 生成頁面上點出「AI 味」特徵，集齊揭曉成因', tag: '互動' , navTitle: 'AI 味兒從哪來'},
          ],
        },
        {
          id: 't-taste-eye',
          title: '識別美的四個抓手',
          desc: '層級、留白、剋制、一致性，每個都配找茬',
          lessons: [
            { file: 'taste-3.html', title: '層級：一屏只有一個主角', desc: '什麼都想強調等於什麼都沒強調。字號、字重、顏色三根槓桿怎麼分配注意力，A/B 找茬揪出搶戲的介面', tag: '互動' , navTitle: '層級：唯一主角'},
            { file: 'taste-4.html', title: '留白與對齊：大多數醜都醜在間距', desc: '說不上哪裡醜的介面，問題多半在間距。拖動滑塊看呼吸感怎麼來的，再學 8pt 網格這個偷懶神器', tag: '互動' , navTitle: '留白與對齊'},
            { file: 'taste-5.html', title: '剋制：給顏色和字型做預算', desc: '一個主色、兩種字重、一套圓角。往介面里加顏色看它變成年會海報，再一鍵做減法，感受高階感回來的瞬間', tag: '互動' , navTitle: '剋制：做預算'},
            { file: 'taste-6.html', title: '一致性：系統感從哪來', desc: '好看的站點背後都有一套設計變數。拆開本站真實的 CSS：控制項高度、圓角、配色為什麼全站只有一檔，改一處全站生效', tag: '案例' , navTitle: '一致性與系統感'},
          ],
        },
        {
          id: 't-taste-speak',
          title: '把審美翻譯給 AI 聽',
          desc: '審美詞彙量決定 AI 產出品質',
          lessons: [
            { file: 'taste-7.html', title: '「好看」的一百種具體說法', desc: '資訊密度、視覺噪音、呼吸感、對比度層級…點選審美詞彙看釋義與正反案例。說得出名字，才指揮得動 AI', tag: '互動' , navTitle: '審美詞彙表'},
            { file: 'taste-8.html', title: '生 UI：從形容詞到規格書', desc: '「做個好看的頁面」和「參考 Linear 的資訊密度、只用一個主色」差出一個檔次。三檔提示詞對比產出，現場看差距', tag: '實戰' , navTitle: '生 UI 提示詞'},
            { file: 'taste-9.html', title: '生圖：構圖、光影、色彩的語言', desc: '生圖提示詞的審美三件套：構圖、光影、色彩。三組對比圖建立直覺，再從四張候選圖裡挑出對的那張', tag: '實戰' , navTitle: '生圖三件套'},
          ],
        },
        {
          id: 't-taste-library',
          title: '建立自己的參考庫',
          desc: '會看，然後讓 AI 照著你的參考出活',
          lessons: [
            { file: 'taste-10.html', title: '怎麼看設計才算看進去了', desc: '收藏一百個網站沒用，要按順序拆：先看層級，再量間距，最後數顏色。用這套流程現場拆一個好設計', tag: '方法' , navTitle: '把設計看進去'},
            { file: 'taste-11.html', title: '把參考餵給 AI', desc: '光靠嘴描述風格太低效。墊圖、風格描述、設計變數三種喂法的適用場景與話術模板，讓 AI 照著你的參考庫出活', tag: '實戰' , navTitle: '把參考餵給 AI'},
          ],
        },
        {
          id: 't-taste-final',
          title: '專題收官',
          desc: '點頭之前，過一遍清單',
          lessons: [
            { file: 'taste-final.html', title: '驗收清單：點頭之前過一遍', desc: 'AI 交付的介面和圖片，按清單逐項檢查：層級、間距、剋制、一致性、細節。互動式清單可勾選，附延伸閱讀', tag: '收官' , navTitle: '審美驗收清單'},
          ],
        },
      ],
    },
    {
      id: 'p-ixd',
      num: '專題篇章',
      title: '互動工程：讓 AI 做出好用的東西',
      desc: '好不好看一眼能看出來，好不好用要用起來才知道，所以互動的病比審美的病更隱蔽。AI 預設交付的互動是「能跑通」級別：空態一片空白、報錯彈 alert、刪除不帶確認、五步向導一步不少。這一章接著審美工程往下走：先學識別（狀態三件套、防錯與可逆、流程剋制、習慣用法），再摳介面細節（控制項怎麼選、文案怎麼說），最後把互動要求翻譯給 AI 聽（目標導向描述需求、狀態機與邊界寫進提示詞）。素材整理自互動設計的經典教材《About Face 4》。',
      color: '#2563eb',
      group: 'indie',
      cluster: 'chain',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-ixd-why',
          title: '好用也成了瓶頸',
          desc: '「能跑通」和「好用」隔著一整章',
          lessons: [
            { file: 'ixd-1.html', title: '能跑通了，然後呢？', desc: '把「體貼軟體」的特質清單反過來用，就是 AI 預設互動的找茬清單。在一個能跑通的應用裡逐個點出五處不體貼，看看你平時都默默忍了什麼', tag: '開篇' , navTitle: '能跑通不等於好用'},
          ],
        },
        {
          id: 't-ixd-spot',
          title: '識別好互動的四個抓手',
          desc: '狀態、防錯、流程、習慣用法',
          lessons: [
            { file: 'ixd-2.html', title: '狀態三件套：loading、空態、錯誤態', desc: '介面的三種非正常時刻恰恰是體驗分水嶺。空態該教下一步，loading 該報進度，錯誤該說人話給出路。三組 A/B 對決親手挑', tag: '互動' , navTitle: '狀態三件套'},
            { file: 'ixd-3.html', title: '防錯與可逆：讓使用者敢點', desc: '與其事後報錯，先讓錯誤發生不了；撤銷讓探索變安全，確認彈窗是最弱的防錯。親手改造三個危險按鈕', tag: '互動' , navTitle: '防錯與可逆'},
            { file: 'ixd-4.html', title: '流程剋制：每多一步掉一批人', desc: '不直接服務目標的操作都是負擔。把一個五步註冊流程逐步砍到兩步，看漏斗裡的人怎麼留下來', tag: '互動' , navTitle: '流程剋制'},
            { file: 'ixd-5.html', title: '習慣用法：別讓 AI 發明新互動', desc: '使用者靠習慣用法操作軟體，學一次到處用。識別哪個控制項在裝創新，哪個長得像按鈕的不是按鈕', tag: '互動' , navTitle: '習慣用法與能供性'},
          ],
        },
        {
          id: 't-ixd-detail',
          title: '介面的細節',
          desc: '控制項怎麼選，文案怎麼說',
          lessons: [
            { file: 'ixd-6.html', title: '控制項選對了嗎：單選、多選、開關與下拉', desc: '互斥選一個用單選鈕，可勾多個用核取方塊，立即生效用開關，選項超過一屏才配用下拉。六個場景連連看，配一張能抄進提示詞的速查表', tag: '互動' , navTitle: '控制項怎麼選'},
            { file: 'ixd-7.html', title: '介面會說話：使用者怎麼理解你的文案', desc: '「刪除這 3 條」比「確定」誠實。按鈕動詞要說清後果，標籤用使用者的詞，別把資料庫欄位名端給使用者。親手改寫一個彈窗的三處文案', tag: '互動' , navTitle: '介面文案'},
          ],
        },
        {
          id: 't-ixd-translate',
          title: '把互動翻譯給 AI 聽',
          desc: '目標導向 + 狀態機，AI 才知道你要什麼',
          lessons: [
            { file: 'ixd-8.html', title: '目標導向：用目標描述需求，別用功能清單', desc: '給 AI「小美要三分鐘交完報銷單」比給它「要有上傳、表單、按鈕」產出好得多。兩種提示詞對決，再練習把功能清單改寫成場景', tag: '實戰' , navTitle: '目標導向提需求'},
            { file: 'ixd-9.html', title: '把狀態機和邊界寫進提示詞', desc: '每個介面把狀態列全，把邊界情況說死，把防錯要求寫明。狀態機補全器 + 邊界輪盤，配可複製的驗收話術模板', tag: '實戰' , navTitle: '狀態機寫進提示詞'},
          ],
        },
        {
          id: 't-ixd-final',
          title: '專題收官',
          desc: '上線前的第二張清單',
          lessons: [
            { file: 'ixd-final.html', title: '互動驗收清單：上線前的第二張清單', desc: '狀態齊不齊、危險操作可逆嗎、流程還能砍嗎、控制項選對了嗎、文案說人話嗎。互動式清單可勾選，與審美、心理學兩張清單配成一套', tag: '收官' , navTitle: '互動驗收清單'},
          ],
        },
      ],
    },
    {
      id: 'p-psy',
      num: '專題篇章',
      title: 'AI 產品心理學：讓使用者覺得好用',
      desc: '審美和互動解決了做得好看、做得好用，還剩第三件事：讓使用者覺得好用。AI 產品天生慢、會錯、不透明，這三個毛病工程上短期都只能緩解，但使用者的評價由感知決定，感知可以設計。這一章沿使用者旅程鋪十六個心理效應：等待焦慮、勞動錯覺、峰終定律、信任校準、演算法厭惡、防禦心理、蜜月懸崖、AI 標籤折扣、認知卸載、情感依戀，一路講到付費疼痛、定價錨點和沉默偏差。每一課都是一個心理效應加一組當場能撥的工程開關。',
      color: '#0d9488',
      group: 'indie',
      cluster: 'chain',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-psy-perceive',
          title: '感知效能',
          desc: '使用者的秒錶和伺服器的秒錶走得不一樣',
          lessons: [
            { file: 'psy-1.html', title: '工程指標及格了，使用者為什麼還罵慢？', desc: '同一個 5 秒請求，空白凍結、轉圈、流式、步驟外顯四種呈現並排跑，親身體驗物理時長相同、體感差三倍；再認識使用者秒錶的三個走時怪癖', tag: '開篇' , navTitle: '感知效能 ≠ 真實效能'},
          ],
        },
        {
          id: 't-psy-wait',
          title: '等待與過程設計',
          desc: '難受的從來不是那 5 秒本身',
          lessons: [
            { file: 'psy-2.html', title: '等待心理學：難受的從來不是那 5 秒', desc: '排隊研究三條定律配迪士尼與休斯頓機場案例；拖動耗時滑塊看三檔呈現決策：1 秒內直接出、10 秒內必須流式、超 10 秒轉非同步', tag: '互動' , navTitle: '等待心理學三定律'},
            { file: 'psy-3.html', title: '勞動錯覺：讓 AI 把努力演出來', desc: '哈佛實驗：展示工作過程讓使用者多等反而更滿意。秒回 vs 過程外顯的 A/B 投票實驗，思考外顯與檢索來源的一魚三吃，外加三條不能越過的邊界', tag: '互動' , navTitle: '勞動錯覺'},
            { file: 'psy-4.html', title: '峰終定律：使用者只記得峰值和結尾', desc: '四種會話劇本對比平均分與記憶分怎麼背離；冷水實驗的產品版：旗艦模型花在第一印象、校驗前置護住最後一步、中段放心省錢', tag: '互動' , navTitle: '峰終定律'},
          ],
        },
        {
          id: 't-psy-trust',
          title: '信任與防禦',
          desc: '既不能全信，也不能不敢用',
          lessons: [
            { file: 'psy-5.html', title: '信任校準：最好的使用者是半信半疑的', desc: '全信的把編造判例抄進法庭文書，不信的把 AI 變成擺設。六個場景親手判斷信任狀態；可點開的引用、置信度代理訊號、有條件的警告', tag: '互動' , navTitle: '信任校準'},
            { file: 'psy-9.html', title: '演算法厭惡：AI 犯一次錯，就被永久拉黑', desc: 'Dietvorst 實驗：人看到演算法犯一次錯就棄用，哪怕它整體比人準。先投票親測自己的偏心，再玩歸因翻譯器和微調權開關，看棄用率儀表怎麼被四個槓桿拉回來', tag: '互動' , navTitle: '演算法厭惡'},
            { file: 'psy-6.html', title: '防禦心理：使用者不是不會用，是不敢用', desc: '資料、能力、責任三種防禦，控制感、可逆性、透明三板斧；三個高防禦設計親手改造，小心埋著的安慰劑陷阱；轉人工按鈕的悖論', tag: '互動' , navTitle: '防禦心理三板斧'},
          ],
        },
        {
          id: 't-psy-mind',
          title: '心智模型與擬人化',
          desc: '使用者拿錯說明書，怪不到使用者頭上',
          lessons: [
            { file: 'psy-7.html', title: '心智模型：使用者拿錯了說明書', desc: '把 AI 當搜尋引擎、當資料庫、當會學習的學徒、當計算器，四種錯配四類差評。四段對話找茬，再給空狀態示例、邊界前置、記憶外顯三個糾正手段', tag: '互動' , navTitle: '心智模型錯配'},
            { file: 'psy-8.html', title: '擬人化的度，與 AI 道歉的藝術', desc: 'CASA 典範：使用者必然把 AI 當人，你只能選檔位。五類產品對號入座；同一個錯誤四種道歉文案對比，三要素配方與服務補救悖論', tag: '互動' , navTitle: '擬人化與道歉'},
          ],
        },
        {
          id: 't-psy-longterm',
          title: '長期使用',
          desc: '蜜月期過了，關係才剛開始',
          lessons: [
            { file: 'psy-10.html', title: '蜜月懸崖：宣傳拉高的期望，要用留存來還', desc: '期望確認理論：滿意度等於體驗減期望。先玩抽卡機看懂「演示是 P99、使用者拿到 P50」，再拖宣傳強度滑塊看註冊轉化和三十日留存此消彼長，最後在期望曲線編輯器上撥三個槓桿', tag: '互動' , navTitle: '蜜月懸崖'},
            { file: 'psy-11.html', title: 'AI 標籤折扣：同樣的內容，標上 AI 就掉價', desc: '標註 AI 生成後評價系統性下降，用 AI 幹活的人還怕被同事看見。雙盲評分實驗親測折扣，五個場景判斷標籤亮不亮，措辭梯子看折扣差，最後選出使用者敢分享的匯出頁', tag: '互動' , navTitle: 'AI 標籤折扣'},
            { file: 'psy-12.html', title: '認知卸載：使用者一邊用你，一邊怕自己廢掉', desc: '谷歌效應證明人會把「能查到的」從腦子裡刪掉，AI 把外包範圍從記憶擴大到思考。選外包清單看哪些解除安裝危險，拖 Copilot 到 Autopilot 的定位滑塊，撥開關把回答從「替你想」改成「帶你想」', tag: '互動' , navTitle: '認知卸載'},
            { file: 'psy-13.html', title: '情感依戀：使用者愛上你的產品之後', desc: '依戀是真實的，Replika 2023 事件證明了深度和風險。依戀訊號分級器給六條使用者訊息判級，點開 Replika 四幕時間線，再撥三層安全閥：身份提醒、脆弱話題轉介、無常性披露', tag: '互動' , navTitle: '情感依戀'},
          ],
        },
        {
          id: 't-psy-money',
          title: '付費與定價',
          desc: '收錢也是一門心理設計',
          lessons: [
            { file: 'psy-14.html', title: '付費心理：為一個機率商品掏錢，痛在哪', desc: '打表焦慮模擬器親手體驗按量計費怎麼讓每次追問都疼一下，切到包月看同一段對話的心情差；心理帳戶四題看同一筆錢換框架痛感差多少；三個額度開關把免費額度從成本變成轉化器', tag: '互動' , navTitle: '付費心理'},
            { file: 'psy-15.html', title: '定價心理：錨點、誘餌與體面的價格歧視', desc: '復刻經濟學人的誘餌實驗：沒人選的檔位撤掉後銷量大變；撥開關搭自己的定價頁錨點；判斷五種價格歧視哪些體面哪些找死；最後選出不捱罵的漲價郵件', tag: '互動' , navTitle: '定價心理'},
          ],
        },
        {
          id: 't-psy-feedback',
          title: '回饋設計',
          desc: '壞訊息怎麼才能聽得見',
          lessons: [
            { file: 'psy-16.html', title: '回饋心理：使用者為什麼不點踩', desc: '一千個不滿意的使用者，點踩的只有十幾個。回饋漏斗模擬器看沉默偏差怎麼層層吃掉訊號，六種使用者行為判讀隱性訊號（重新生成、複製、編輯），點踩後的體驗對決：回饋要有即時回報', tag: '互動' , navTitle: '回饋心理'},
          ],
        },
        {
          id: 't-psy-books',
          title: '延伸書單',
          desc: '這章的規律都有出處',
          lessons: [
            { file: 'psy-books.html', title: '九本書，把這一章讀厚', desc: '卡尼曼、諾曼、西奧迪尼、塞勒到《媒體等同》，九本書拆出十九條 PM 必須懂的心理學原理，每條標註 AI 產品落點與回看課節；按你產品當前的困惑選書，讀完做一輪原理連線小測', tag: '書單' , navTitle: 'PM 心理學書單'},
          ],
        },
        {
          id: 't-psy-final',
          title: '專題收官',
          desc: '十六個效應一張對照表',
          lessons: [
            { file: 'psy-final.html', title: '收官 · 十六個效應一張表，外加上線前十四問', desc: '從感知效能到沉默偏差，十六個心理效應 × 工程槓桿完整對照，右列全是學過的開關；可勾選的上線前十四問檢查清單，附十一份延伸閱讀', tag: '收官' , navTitle: '心理學篇收官'},
          ],
        },
        {
          id: 't-psy-interview',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'psy-interview.html', title: 'AI 產品心理學 · 40 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：感知效能 / 峰終取捨 / 信任校準 / 防禦拆除 / 演算法厭惡 / 標籤折扣 / 情感依戀 / 付費與定價 / 沉默偏差 / 體驗指標怎麼寫進 OKR', tag: '考察' , navTitle: '他們會這樣考你 · 40 問'},
          ],
        },
      ],
    },
    {
      id: 'p-cost',
      num: '專題篇章',
      title: 'Token 降本增效：AI 應用的成本工程',
      desc: '前面三章都在讓使用者滿意，這一章問另一個問題：這筆帳劃不划算。產品用得越好，使用者用得越多，利潤反而越薄——AI 商業化是一場和使用者的對賭。這一章基於作者的團隊內部分享整理：先看懂 Token 怎麼數、報價表裡的梯隊與跳檔陷阱（輸出 200 斷崖、輸入 32k 紅線、圖片畫素稅、Agent 的輸入主導），再沿語法、語義、架構、輸出四層把成本一層層摳下來。省 Token 的本質是提高資訊密度：高訊雜比 = 高智慧。',
      color: '#16a34a',
      group: 'indie',
      cluster: 'chain',
      routes: ['pm', 'build'],
      topics: [
        {
          id: 't-cost-why',
          title: '定價即架構',
          desc: '成本構成、Token 怎麼數、報價表怎麼讀',
          lessons: [
            { file: 'cost-1.html', title: '和使用者對賭的生意', desc: '看到消費帳單會窒息嗎？Token 成本不只是財務帳單，更是延遲與吞吐量的直接對映。這一章講怎麼把它摳下來', tag: '開篇' , navTitle: '和使用者對賭的生意'},
            { file: 'cost-2.html', title: 'Token 怎麼數：BPE 與隱形的 Token 稅', desc: '從字元到子詞的演進、BPE 的合併規則，以及中文為什麼天生貴 2 倍；「給主人留下些什麼吧」的詭異合併', tag: '互動' , navTitle: 'BPE 與 Token 稅'},
            { file: 'cost-3.html', title: '報價錶速覽與三大梯隊', desc: 'T0 旗艦 / T1 主力 / T2 走量怎麼分工；光知道哪個貴不夠，要盯住價格跳變的邊界線', tag: '選型' , navTitle: '報價表與三大梯隊'},
          ],
        },
        {
          id: 't-cost-cliff',
          title: '三大跳檔陷阱',
          desc: '藏在價格邊界線裡的帳單刺客',
          lessons: [
            { file: 'cost-4.html', title: 'GLM 的短輸出博弈：200 Token 斷崖', desc: '輸出 199 和 201 是兩種價格，連輸入都回溯漲價；拖動滑塊看帳單跳變，四種應對策略', tag: '互動' , navTitle: '200 Token 斷崖'},
            { file: 'cost-5.html', title: 'Qwen 的階梯逃逸：32k 紅線', desc: '多 1k Token 整單翻倍的全量結算邏輯；預算感知截斷，別再為 RAG 垃圾付雙倍的錢', tag: '互動' , navTitle: '32k 紅線'},
            { file: 'cost-6.html', title: '圖片 Token：畫素也要交稅', desc: '輸入解析度即時算 Token 的計算器；32 畫素對齊跳檔、解析度詛咒與圖片成本三條紅線', tag: '互動' , navTitle: '圖片 Token'},
          ],
        },
        {
          id: 't-cost-agent',
          title: 'Agent 的帳單',
          desc: '迴圈執行讓成本累積膨脹',
          lessons: [
            { file: 'cost-7.html', title: '輸入主導：62:1 的 I/O Ratio', desc: 'Agent 每一輪都要重讀全部歷史。逐輪點開一個 Excel 任務，看 Input 怎麼滾到 31,460 Token', tag: '互動' , navTitle: '輸入主導的 Agent'},
            { file: 'cost-8.html', title: 'Agent 四大成本陷阱與熔斷', desc: '工具返回爆炸、思考稅、死迴圈、歷史雪球：每個陷阱配一個能落地的策略，外加三條紅線', tag: '深入' , navTitle: 'Agent 四大陷阱'},
          ],
        },
        {
          id: 't-cost-practice',
          title: '四層實戰優化',
          desc: '語法、語義、架構、輸出，一層層摳',
          lessons: [
            { file: 'cost-9.html', title: '語法層：Prompt 是寫給機器的', desc: '加粗的 ** 就吃掉 8.5% Token；複雜物件用 YAML、扁平列表用 CSV、後臺輸出強制 Minified JSON', tag: '實戰' , navTitle: '語法層：詞法稅'},
            { file: 'cost-10.html', title: '語義層：雙重蒸餾', desc: '中段迷失效應：塞得越多越抓不住重點。動態 Few-Shot 從 4000 砍到 500，LLMLingua-2 壓縮 5-20 倍', tag: '實戰' , navTitle: '語義層：雙重蒸餾'},
            { file: 'cost-11.html', title: '架構層：KV Cache 的注意事項', desc: '字首匹配最高省 90%；動態切換工具為什麼把快取全打穿，滑動視窗 vs 章節快取', tag: '實戰' , navTitle: '架構層：KV Cache'},
            { file: 'cost-12.html', title: '輸出層：管住模型的嘴', desc: '明確的負向約束砍掉 30% 廢話；潤色用 Diff 別重寫整段；停止序列做物理截斷', tag: '實戰' , navTitle: '輸出層：管住嘴'},
          ],
        },
        {
          id: 't-cost-final',
          title: '專題收官',
          desc: '省錢的盡頭是資訊密度',
          lessons: [
            { file: 'cost-final.html', title: '算力時代的極簡主義', desc: '每一個 Token 都在為最終結果貢獻價值嗎？全景清單回顧 + 十八份按主題分類的延伸閱讀', tag: '收官' , navTitle: '算力極簡主義'},
          ],
        },
      ],
    },
    {
      id: 'p-ds',
      num: '程式設計基礎篇',
      title: '資料結構：AI 世界的骨架',
      desc: '不背定義、不手寫連結串列。用你已經學過的 AI 概念當例子——message list 是陣列、KV Cache 是快取、RAG 檢索是近鄰搜尋——把八種核心資料結構一次看懂。學完你能看懂 AI 生成的程式碼在用什麼結構，也能看懂大模型肚子裡裝的是什麼。',
      color: '#0284c7',
      group: 'indie',
      cluster: 'hardcore',
      routes: ['use', 'pro', 'pm', 'build'],   // 科普主題（為什麼要懂、線性結構）全路線可見，工程主題只在 build
      topics: [
        {
          id: 't-ds-why',
          routes: ['use', 'pro', 'pm', 'build'],   // 為什麼要懂 + 收納隱喻，人人該看
          title: '為什麼 AI 時代還要懂',
          desc: '你可以不寫程式碼，但要會驗收 AI 寫的程式碼',
          lessons: [
            { file: 'ds-1.html', title: '都 2026 年了，為什麼還要懂資料結構？', desc: '一個貫穿全章的隱喻：資料結構 = 收納方式。親手玩一局「找鑰匙」，體會選錯收納有多慢；再看不懂結構的人怎麼把 AI 寫的慢程式碼直接上線', tag: '互動' , navTitle: '為什麼還要懂資料結構'},
          ],
        },
        {
          id: 't-ds-linear',
          routes: ['use', 'pro', 'pm', 'build'],   // 對話陣列、撤銷、排隊，零程式碼也看得懂
          title: '線性結構：你天天在用',
          desc: '陣列、棧、佇列，AI 對話和 Agent 排程的地基',
          lessons: [
            { file: 'ds-2.html', title: '陣列：你聊的每句話都躺在裡面', desc: 'message list 就是一個陣列：對話歷史怎麼排隊、上下文截斷為什麼掐頭不掐尾；順便看陣列中間插一條資料有多貴', tag: '互動' , navTitle: '陣列與 message list'},
            { file: 'ds-3.html', title: '棧：Cmd+Z 和「爆棧」的秘密', desc: '後進先出：撤銷鍵、函式呼叫、Agent 的子任務都靠它。親手壓棧彈棧，再看一次沒寫終止條件的遞迴是怎麼把棧壓爆的', tag: '互動' , navTitle: '棧：撤銷與呼叫'},
            { file: 'ds-4.html', title: '佇列：Agent 的活是排著隊乾的', desc: '先進先出：任務佇列、訊息佇列、生產者消費者。拖動生產和消費的速度，看佇列什麼時候積壓、什麼時候空轉', tag: '互動' , navTitle: '佇列與任務排程'},
          ],
        },
        {
          id: 't-ds-hash',
          routes: ['pm', 'build'],   // 快取與帳單直覺，產品路線剛需
          title: '雜湊與快取：空間換時間',
          desc: '查得快和省錢，背後是同一招',
          lessons: [
            { file: 'ds-5.html', title: '雜湊表：為什麼它找東西快到不講理', desc: '把 key 親手塞進桶裡，看雜湊函式怎麼把「翻一遍」變成「直達」；再看兩個 key 撞進同一個桶時怎麼收場', tag: '互動' , navTitle: '雜湊表'},
            { file: 'ds-6.html', title: '快取：AI 帳單的隱形折扣', desc: 'KV Cache 和語義快取都是同一招：算過的別再算。拖動命中率滑塊即時看帳單變化——Harness 核心篇成本優化的底層原理', tag: '互動' , navTitle: '快取與 KV Cache'},
          ],
        },
        {
          id: 't-ds-tree',
          routes: ['build'],   // AST 與圖遍歷，動手才需要
          title: '樹與圖：AI 的主場',
          desc: 'Coding Agent 和知識圖譜眼裡的世界',
          lessons: [
            { file: 'ds-7.html', title: '樹：Coding Agent 眼裡全是它', desc: '檔案目錄、JSON、網頁 DOM、程式碼語法樹——AI 讀你的專案時看到的是一棵棵樹。點開一段程式碼，親眼看它變成 AST', tag: '互動' , navTitle: '樹與 AST'},
            { file: 'ds-8.html', title: '圖：從知識圖譜到多 Agent 協作', desc: '節點加關係就是圖：社交網路、知識圖譜、Agent 工作流 DAG。點一個節點，看關係怎麼一層層擴散出去', tag: '互動' , navTitle: '圖與 DAG'},
          ],
        },
        {
          id: 't-ds-llm',
          routes: ['pro', 'pm', 'build'],   // 分詞與向量檢索底層，講 RAG 方案要用
          title: '大模型肚子裡的資料結構',
          desc: '前面章節埋的伏筆，這裡揭底',
          lessons: [
            { file: 'ds-9.html', title: '詞表與 Trie：Tokenizer 的切詞秘密', desc: '大模型原理篇見過分詞，這次看底層：一棵字首樹怎麼把「五花肉」整塊認出來。親手沿著 Trie 走一次分詞', tag: '互動' , navTitle: '詞表與 Trie'},
            { file: 'ds-10.html', title: '向量：RAG 檢索是在「找最近的鄰居」', desc: 'Embedding 把語義變成座標，相似度就是距離。在平面上拖動查詢點看最近鄰怎麼變，再看 HNSW 為什麼能在億級向量裡瞬間找到', tag: '互動' , navTitle: '向量與近鄰搜尋'},
          ],
        },
        {
          id: 't-ds-summary',
          routes: ['build'],   // 彙總跟完整章走
          title: '篇章彙總',
          desc: '資料結構篇核心知識回顧',
          lessons: [
            { file: 'ds-summary.html', title: '彙總 · 八種結構一張決策表', desc: '陣列/棧/佇列/雜湊表/快取/樹/圖/向量各自的強項弱項與 AI 裡的真身；點選場景，看該用哪種收納方式', tag: '彙總' , navTitle: '資料結構篇彙總'},
          ],
        },
        {
          id: 't-ds-build',
          routes: ['build'],   // 動手任務
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'ds-build.html', title: '把 AI 寫的程式碼「驗收」一遍', desc: '三檔任務：讓 AI 解釋它選的資料結構、要求換一種實現對比利弊、給你自己的專案挑一次收納方式', tag: '實戰' , navTitle: '實戰：驗收 AI 的程式碼'},
          ],
        },
        {
          id: 't-ds-interview',
          routes: ['build'],   // 面試題跟完整章走
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'ds-interview.html', title: '資料結構 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：陣列 vs 連結串列 / 雜湊碰撞 / 樹的遍歷 / 快取設計 / 向量檢索 / 場景選型', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p-algo',
      num: '程式設計基礎篇',
      title: '演算法：AI 的思考方式',
      desc: '從「這段程式碼要跑多久」的直覺開始，把複雜度、查詢排序、遞迴分治、圖搜尋、貪心取樣五類經典思想講透——每一類都對應大模型裡的一個真實機制：注意力是 O(n²)、Rerank 是排序、Compaction 是分治、解碼是貪心與取樣。最後回答那個終極問題：AI 都會做題了，還要不要刷 LeetCode。',
      color: '#db2777',
      group: 'indie',
      cluster: 'hardcore',
      routes: ['use', 'pro', 'pm', 'build'],   // Big-O 直覺與學習觀全路線可見，其餘只在 build
      topics: [
        {
          id: 't-algo-bigo',
          routes: ['use', 'pro', 'pm', 'build'],   // 複雜度直覺 + 上下文帳單，人人該看
          title: '複雜度：一眼看穿程式碼值不值',
          desc: '不用數學，建立對「快慢」的直覺',
          lessons: [
            { file: 'algo-1.html', title: 'Big-O：一眼看穿程式碼要跑多久', desc: '拖動資料量滑塊，看 O(1)、O(log n)、O(n)、O(n²) 四條曲線怎麼分道揚鑣；資料翻十倍，誰不動聲色、誰當場爆炸', tag: '互動' , navTitle: 'Big-O 複雜度直覺'},
            { file: 'algo-2.html', title: '為什麼上下文越長越貴？O(n²) 的帳單', desc: '注意力機制要讓每個 Token 看所有 Token：拖動上下文長度，看計算量和帳單按平方往上躥——長對話變卡變貴的根源', tag: '互動' , navTitle: '注意力的 O(n²) 帳單'},
          ],
        },
        {
          id: 't-algo-sort',
          routes: ['build'],
          title: '查詢與排序',
          desc: '砍一半的藝術，和排序在 AI 裡的真身',
          lessons: [
            { file: 'algo-3.html', title: '二分查詢：猜數字遊戲的最優解', desc: '玩一局 1 到 100 猜數字，體會每猜一次範圍砍一半；十億條資料 30 次就能找到——log n 快到什麼程度', tag: '互動' , navTitle: '二分查詢'},
            { file: 'algo-4.html', title: '排序：冒泡和快排的賽跑', desc: '兩種排序同場競技的視覺化動畫：看冒泡怎麼一步步挪、快排怎麼分割槽跳躍；資料量一大差距有多懸殊', tag: '動畫' , navTitle: '排序演算法賽跑'},
            { file: 'algo-5.html', title: '排序在 AI 裡的真身：Rerank', desc: 'RAG 檢索回來的段落不能直接用：先粗排再精排。親手調整權重，看候選段落怎麼重新洗牌——推薦流和搜尋結果同理', tag: '互動' , navTitle: 'Rerank 重排序'},
          ],
        },
        {
          id: 't-algo-recur',
          routes: ['build'],
          title: '遞迴與分治',
          desc: '把大事拆成同一件小事',
          lessons: [
            { file: 'algo-6.html', title: '遞迴：把大事拆成同一件小事', desc: '遍歷目錄、拆解任務、畫分形樹，套路都一樣：自己呼叫自己。看 Agent 怎麼把「做個官網」遞迴拆成能動手的小任務', tag: '互動' , navTitle: '遞迴'},
            { file: 'algo-7.html', title: '分治：上下文壓縮的演算法原理', desc: '動手實戰篇的 Compaction 其實是分治：把長對話切段、各自摘要、再合併。親手跑一次遞迴摘要，看資訊怎麼被層層壓縮', tag: '互動' , navTitle: '分治與遞迴摘要'},
          ],
        },
        {
          id: 't-algo-search',
          routes: ['build'],
          title: '搜尋與決策',
          desc: '走迷宮、擲骰子、往前多看幾步',
          lessons: [
            { file: 'algo-8.html', title: 'BFS 與 DFS：Agent 在程式碼庫裡找檔案', desc: '走迷宮動畫看兩種搜尋的性格：一層層掃 vs 一條道走到黑；Coding Agent 的 grep 檢索、網路爬蟲都是它們的變體', tag: '互動' , navTitle: 'BFS 與 DFS'},
            { file: 'algo-9.html', title: '貪心與取樣：AI 選詞時的兩種性格', desc: '每步都挑最大的就是貪心解碼，按機率擲骰子就是取樣——Temperature 背後的演算法學。親手對比兩種策略生成的句子', tag: '互動' , navTitle: '貪心與取樣'},
            { file: 'algo-10.html', title: 'Beam Search：往前多看幾步再選', desc: '貪心一步錯步步錯，Beam Search 同時留幾條候選路往前探。互動對比兩種策略走出的句子，理解「先想再答」的直覺來源', tag: '互動' , navTitle: 'Beam Search'},
          ],
        },
        {
          id: 't-algo-learn',
          routes: ['use', 'pro', 'pm', 'build'],   // 還要不要刷題、怎麼用 AI 學，人人該看
          title: 'AI 時代的演算法學習觀',
          desc: '還要不要刷題，以及怎麼用 AI 學',
          lessons: [
            { file: 'algo-11.html', title: 'AI 都會做題了，還要刷 LeetCode 嗎？', desc: '面試現狀實話實說：什麼崗位還在考、考到什麼檔位、什麼崗位早就不看了。點選你的目標崗位，對號入座', tag: '互動' , navTitle: '還要刷 LeetCode 嗎'},
            { file: 'algo-12.html', title: '用 AI 學演算法的正確姿勢', desc: '讓它出題、讓它當考官、讓它逐行講複雜度——三個立刻能用的提示詞模板，把 AI 從「替你做題」變成「陪你練題」', tag: '實戰' , navTitle: '用 AI 學演算法'},
          ],
        },
        {
          id: 't-algo-summary',
          routes: ['build'],
          title: '篇章彙總',
          desc: '演算法篇核心知識回顧',
          lessons: [
            { file: 'algo-summary.html', title: '彙總 · 五類演算法思想對照表', desc: '複雜度/查詢排序/遞迴分治/圖搜尋/貪心取樣，每類對應 AI 裡的一個真實機制；一張表帶走全章', tag: '彙總' , navTitle: '演算法篇彙總'},
          ],
        },
        {
          id: 't-algo-build',
          routes: ['build'],
          title: '你現在能做什麼',
          desc: '學完這章，你今天能動手做什麼',
          lessons: [
            { file: 'algo-build.html', title: '給 AI 寫的程式碼做一次複雜度體檢', desc: '三檔任務：讓 AI 自報複雜度、要求優化一檔並說清代價、用大資料量實測驗證它沒吹牛', tag: '實戰' , navTitle: '實戰：複雜度體檢'},
          ],
        },
        {
          id: 't-algo-interview',
          routes: ['build'],
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'algo-interview.html', title: '演算法 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：Big-O 直覺 / 二分的前提 / 遞迴的風險 / BFS vs DFS / 取樣策略 / AI 時代還考演算法嗎', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p6',
      num: '專題篇章',
      title: '解剖 Grok Build：Rust 寫的生產級 Coding Agent',
      desc: '這一章要讀 Rust 原始碼，不看不影響任何後續內容。適合想自己動手寫一個 Coding Agent 的人：基於 xAI 公開的 Grok Build 原始碼，沿著 79 個 Workspace 成員拆解執行時、工具、記憶、安全與擴充套件設計。其中八個不依賴原始碼也成立的結論，已經提煉進工程進階篇，那邊看不過癮再回來這裡深潛。',
      color: '#f59e0b',
      group: 'indie',
      cluster: 'hardcore',
      routes: [],   // 進階選修，只在完整目錄裡
      hardcore: true,
      topics: [
        {
          id: 't-grok-map',
          title: '系統地圖',
          desc: '79 個 Workspace 成員的分層架構與 Rust 選型',
          lessons: [
            { file: '12-1.html', title: '79 個 Workspace 成員如何組成產品', desc: '按入口、Agent 執行時、工具和基礎設施還原 Cargo Workspace 的真實分層', tag: '架構' , navTitle: '79 個 Workspace 成員'},
            { file: '12-2.html', title: 'Rust 技術選型：事實與推斷', desc: '從原始碼可驗證事實出發，分析型別系統、併發安全和分發方式帶來的工程取捨', tag: '概念' , navTitle: 'Rust 技術選型'},
            { file: '12-3.html', title: '從真實 main() 到第一輪取樣', desc: '追蹤入口、會話建立、提示詞渲染、模型取樣與流式返回的完整呼叫鏈', tag: '深入' , navTitle: '從 main() 到首輪取樣'},
          ],
        },
        {
          id: 't-grok-core',
          title: 'Agent 核心迴圈',
          desc: 'Session Actor、Compaction 與 System Prompt',
          lessons: [
            { file: '12-4.html', title: 'Session Actor：執行緒、狀態與取消邊界', desc: '梳理會話狀態所有權、訊息流轉、後臺任務與 CancellationToken 的中斷路徑', tag: '深入' , navTitle: 'Session Actor'},
            { file: '12-5.html', title: 'Compaction：85% 閾值與可選 two-pass', desc: '核對自動壓縮閾值、memory flush、two-pass 和超時預算的真實配置', tag: '互動' , navTitle: 'Compaction 閾值'},
            { file: '12-6.html', title: 'PromptContext：可檢查的渲染輸入', desc: '拆解可序列化上下文、TemplateOverride 和 TemplateRenderer 的模板渲染邊界', tag: '概念' , navTitle: 'PromptContext'},
          ],
        },
        {
          id: 't-grok-tools',
          title: '工具系統',
          desc: '登錄檔、分類學與內建工具集',
          lessons: [
            { file: '12-7.html', title: '程序級外部 Toolset Preset 登錄檔', desc: '理解構建函式、Public 與 Internal 可見性，以及晚註冊對後續解析的影響', tag: '架構' , navTitle: 'Toolset 登錄檔'},
            { file: '12-8.html', title: 'ToolKind 提供預設只讀語義', desc: '從列舉與 is_read_only() 追蹤只讀預設值和能力過濾邊界', tag: '設計模式' , navTitle: 'ToolKind 只讀語義'},
            { file: '12-9.html', title: '實現族、登錄檔與動態 MCP', desc: '區分內建工具實現族、靜態登錄檔與執行時發現的 MCP 工具', tag: '深入' , navTitle: '實現族與動態 MCP'},
            { file: '12-10.html', title: 'Canonical input 是穩定投影', desc: '用 CanonicalToolMeta 和輸入投影解釋跨工具實現的穩定合約', tag: '案例' , navTitle: 'Canonical input'},
          ],
        },
        {
          id: 't-grok-memory',
          title: '上下文與記憶',
          desc: 'Token 估算、混合檢索與 Dream 機制',
          lessons: [
            { file: '12-11.html', title: '估算、百分比與嚴格閾值', desc: '區分 Token 估算、使用率計算和 exceeds_threshold 的嚴格比較語義', tag: '互動' , navTitle: 'Token 估算與閾值'},
            { file: '12-12.html', title: '從檔案變更到混合排序', desc: '追蹤 FTS、向量檢索、時間衰減和 MMR 重排組成的記憶召回流水線', tag: '深入' , navTitle: '混合檢索排序'},
            { file: '12-13.html', title: 'Dream 的真實機制', desc: '核對空閒門控、DreamLock、後臺整理和記憶寫回的實際邊界', tag: '前沿' , navTitle: 'Dream 機制'},
          ],
        },
        {
          id: 't-grok-subagent',
          title: '子 Agent 與多 Agent',
          desc: 'Agent 定義 + Persona 疊加的兩層體系',
          lessons: [
            { file: '12-14.html', title: 'AgentDefinition 與 Persona 如何合併', desc: '拆解 Agent 定義、Persona 覆蓋與最終會話行為的合併順序', tag: '設計模式' , navTitle: 'Agent 與 Persona 合併'},
            { file: '12-15.html', title: '子 Agent 的四個隔離維度', desc: '從上下文來源、恢復模式、工作樹和任務狀態分析隔離邊界', tag: '深入' , navTitle: '子 Agent 隔離維度'},
            { file: '12-16.html', title: '多 Agent 的組織方式', desc: '基於公開證據比較 Agent、Persona、協調者與並行任務的組織方式', tag: '案例' , navTitle: '多 Agent 組織方式'},
          ],
        },
        {
          id: 't-grok-security',
          title: '權限、沙箱與安全',
          desc: '核心級沙箱、權限演進與 Hooks 攔截',
          lessons: [
            { file: '12-17.html', title: '五種沙箱 Profile', desc: '比較 workspace、devbox、read-only、strict、off 與自訂 Profile 的邊界', tag: '安全' },
            { file: '12-18.html', title: '從工具請求到受限執行', desc: '沿 ToolKind、權限決策和平臺沙箱追蹤完整授權鏈', tag: '安全' , navTitle: '工具授權鏈'},
            { file: '12-19.html', title: 'Hooks：明確 deny 才阻斷', desc: '核對生命週期事件、matcher、PreToolUse 阻斷和故障 fail-open 語義', tag: '實戰' , navTitle: 'Hooks 阻斷語義'},
          ],
        },
        {
          id: 't-grok-eco',
          title: 'MCP 與生態',
          desc: 'MCP 客戶端、OAuth、連線恢復與外掛信任',
          lessons: [
            { file: '12-20.html', title: 'MCP 連線、發現與恢復', desc: '確認客戶端角色，拆解 OAuth、工具命名、能力發現、狀態合併與重連', tag: '深入' , navTitle: 'MCP 連線與恢復'},
            { file: '12-21.html', title: 'Plugin Marketplace 的發現與信任', desc: '區分目錄、安裝、執行時發現、啟用狀態與外掛根信任', tag: '架構' , navTitle: 'Marketplace 信任'},
          ],
        },
        {
          id: 't-grok-beyond',
          title: '超越原始碼',
          desc: '完整對照、經驗教訓與設計啟示',
          lessons: [
            { file: '12-22.html', title: 'Grok Build 與 Claude Code 證據化對照', desc: '按原始碼、倉庫文件和公開產品行為完成多維比較，保留未知項', tag: '彙總' , navTitle: 'Grok vs Claude 對照'},
            { file: '12-23.html', title: 'Grok Build 工程覆盤與證據邊界', desc: '用型別、狀態機、測試和倉庫政策覆盤工程優點與適用限制', tag: '收官' , navTitle: '工程覆盤與邊界'},
            { file: '12-24.html', title: 'Coding Agent 設計工作臺', desc: '圍繞九個系統維度輸出架構決定、故障路徑、驗證方式和結課成果', tag: '收官' , navTitle: '設計工作臺'},
          ],
        },
        {
          id: 't-interview6',
          title: '他們會這樣考你',
          desc: '面試官、老闆、技術同事會怎樣考察本章內容',
          lessons: [
            { file: 'interview-6.html', title: 'Grok Build 專題 · 30 道靈魂拷問', desc: '每題附考察意圖、答題框架與加分點：執行時迴圈 / Compaction / 工具權限 / 記憶檢索 / 沙箱安全 / MCP 整合', tag: '考察' , navTitle: '他們會這樣考你 · 30 問'},
          ],
        },
      ],
    },
    {
      id: 'p-dsh',
      num: '專題篇章',
      title: '解剖 DeepSeek Harness：一切皆外掛的 Agent 底座',
      desc: '這一章要讀 TypeScript 原始碼，不看不影響任何後續內容。DeepSeek 在 2026 年開源的 Agent Harness 把模型、工具、會話、沙箱、UI 全部做成可替換的 Cordis 外掛，還立了一條執行時不變數：模型看到的一切必須能從會話日誌逐字重建。本章沿原始碼拆解它的外掛核心、Turn/Step 迴圈、雙佇列 Inbox、Compaction 雙路徑與 Code Mode 沙箱，並逐課與 Claude Code、Grok Build 做證據化對照。',
      color: '#4d6bfe',
      group: 'indie',
      cluster: 'hardcore',
      routes: [],   // 進階選修，只在完整目錄裡
      hardcore: true,
      topics: [
        {
          id: 't-dsh-map',
          title: '系統地圖',
          desc: 'Cordis 外掛核心與配置三層結構',
          lessons: [
            { file: 'dsh-1.html', title: '一切皆外掛：官宣與原始碼對照', desc: '把釋出文案裡的四種模式、會話日誌、外掛生態逐條對到倉庫裡的 YAML 預設與包結構', tag: '架構' , navTitle: '一切皆外掛' },
            { file: 'dsh-6.html', title: 'Profile / Bundle / Patch：使用者能把產品改到什麼程度', desc: '配置三層結構怎麼讓使用者不改原始碼就換掉深層能力', tag: '架構' , navTitle: 'Profile 與 Bundle' },
          ],
        },
        {
          id: 't-dsh-loop',
          title: '會話與迴圈',
          desc: '日誌不變數、雙佇列 Inbox、取消恢復與 Goal',
          lessons: [
            { file: 'dsh-2.html', title: 'Model-visible ⟺ logged：一條會崩給你看的不變數', desc: '從 invariant.ts 的逐位元組比對講起：為什麼模型看到的一切必須能從日誌重建', tag: '深入' , navTitle: '日誌重建不變數' },
            { file: 'dsh-3.html', title: 'followup / steer / inject：雙佇列 Inbox', desc: '拆解 next-turn 與 next-step 兩條佇列的入隊、claim 與喚醒語義，對照 Claude Code 的中斷模型', tag: '互動' , navTitle: '雙佇列 Inbox' },
            { file: 'dsh-7.html', title: 'Esc 之後發生了什麼：取消、崩潰恢復與重入', desc: '每輪一個 AbortSignal，中斷也要寫回日誌，崩潰重啟還能接著跑', tag: '深入' , navTitle: '取消與崩潰恢復' },
            { file: 'dsh-8.html', title: 'Goal：訊息溯源即權限', desc: '長期目標怎麼存、誰有權改，鑑權看訊息來源', tag: '設計模式' , navTitle: 'Goal 與溯源鑑權' },
          ],
        },
        {
          id: 't-dsh-context',
          title: '上下文工程',
          desc: 'Compaction 雙路徑、計量、Spill 與檢索',
          lessons: [
            { file: 'dsh-4.html', title: 'Compaction 雙路徑與 replaceGeneration', desc: '壓力觸發與溢位恢復兩條正交路徑，以及用世代號證明「壓縮確實發生過」才允許重試', tag: '深入' , navTitle: 'Compaction 雙路徑' },
            { file: 'dsh-9.html', title: 'Token 計量：決策用重放，展示用投影', desc: '兩套計量各幹各的，壓縮決策從不信 UI 上那個數', tag: '概念' , navTitle: 'Token 計量' },
            { file: 'dsh-10.html', title: 'Spill：工具輸出太大怎麼辦', desc: '超限輸出落盤存檔，給模型留一張取回憑證', tag: '實戰' , navTitle: 'Spill 落盤' },
            { file: 'dsh-11.html', title: '會話檢索與跨會話引用', desc: '舊會話是可檢索的資料庫，引用還能帶出處', tag: '深入' , navTitle: '會話檢索' },
          ],
        },
        {
          id: 't-dsh-tools',
          title: '工具系統',
          desc: '三段瀑布、輸出契約、檔案編輯與獨有工具面',
          lessons: [
            { file: 'dsh-12.html', title: '工具執行流水線：三段瀑布與單調 Guard', desc: 'pre-execute 到 post-execute 的三段管線，Guard 只能收緊不能放行', tag: '架構' , navTitle: '工具流水線' },
            { file: 'dsh-13.html', title: '工具輸出契約：值與展示分離', desc: '同一個結果，模型看的和人看的可以不一樣', tag: '設計模式' , navTitle: 'render intent' },
            { file: 'dsh-14.html', title: '檔案編輯的工程學：先讀後寫', desc: 'read / edit / write 三件套，沒讀過的檔案不許改', tag: '實戰' , navTitle: '先讀後寫' },
            { file: 'dsh-17.html', title: 'DSH 獨有的工具面：terminal / lsp / jobs', desc: '別家沒有的幾個工具各解決什麼問題', tag: '案例' , navTitle: '獨有工具面' },
          ],
        },
        {
          id: 't-dsh-security',
          title: '審批與沙箱',
          desc: '兩個獨立旋鈕與可整體替換的執行世界',
          lessons: [
            { file: 'dsh-15.html', title: '審批與權限：兩個旋鈕，一個下拉框', desc: '沙箱模式和審批策略是兩個獨立旋鈕，預設只是常用組合', tag: '安全' , navTitle: '審批與權限預設' },
            { file: 'dsh-16.html', title: '沙箱：從 seatbelt 到執行世界', desc: 'ctx.fs 和 ctx.subprocess 同享一個路徑名稱空間，執行環境可以整體換掉', tag: '安全' , navTitle: '執行世界' },
          ],
        },
        {
          id: 't-dsh-code',
          title: '程式碼模式',
          desc: '讓模型寫程式來編排工具呼叫',
          lessons: [
            { file: 'dsh-5.html', title: 'Code Mode：一段程式碼頂多輪工具呼叫', desc: '官宣叫 PTC，原始碼叫 code mode：worker 沙箱的隔離、通訊協議與雙重記帳', tag: '前沿' , navTitle: 'Code Mode 沙箱' },
          ],
        },
        {
          id: 't-dsh-orch',
          title: '編排與子 Agent',
          desc: 'Subagent 接縫與四種編排原語',
          lessons: [
            { file: 'dsh-18.html', title: 'Subagent 是一個 seam：從程序內到委派 Claude Code', desc: '子 Agent 是能力接縫，程序內、遠端、別家產品都能接', tag: '架構' , navTitle: 'Subagent seam' },
            { file: 'dsh-19.html', title: 'workflow / schedule / plan / todo：編排原語的取捨', desc: '四種編排原語各管什麼，為什麼沒做成一個大而全', tag: '概念' , navTitle: '編排原語' },
            { file: 'dsh-20.html', title: 'Skill、Preset 與自我修改', desc: 'cordis_define 讓 Agent 在執行時改寫自己的執行時', tag: '前沿' , navTitle: 'Skill 與自我修改' },
          ],
        },
        {
          id: 't-dsh-integration',
          title: '模型與外部接入',
          desc: 'LLM 適配層、MCP 與測試基礎設施',
          lessons: [
            { file: 'dsh-21.html', title: 'MCP 與 Extensions：外部工具接入的兩條路', desc: '橋接生態標準與原生擴充套件怎麼分工', tag: '深入' , navTitle: 'MCP 與擴充套件' },
            { file: 'dsh-22.html', title: 'LLM 適配層：單次嘗試、顯式重試、雙流持久', desc: '推理流與正文流分開存，重試是顯式事件', tag: '深入' , navTitle: 'LLM 適配層' },
            { file: 'dsh-26.html', title: '測試一個非確定性系統', desc: '確定性回放、性質測試、專門騙 LLM 客戶端的故障伺服器', tag: '實戰' , navTitle: '測試基礎設施' },
          ],
        },
        {
          id: 't-dsh-persist',
          title: '持久化與基建',
          desc: '日誌治理、憑據儲存與多入口核心',
          lessons: [
            { file: 'dsh-23.html', title: '持久化治理：版本、fork 邊界與拒絕解讀', desc: '日誌格式怎麼演進，分叉邊界怎麼定，讀不懂的資料寧可拒絕', tag: '架構' , navTitle: '持久化治理' },
            { file: 'dsh-24.html', title: '憑據、設定、儲存與遙測', desc: '不起眼但全是坑：憑據每次現取、配置不落盤', tag: '實戰' , navTitle: '憑據與儲存' },
            { file: 'dsh-25.html', title: '多入口與 Typert：一個核心，五張面孔', desc: 'Web、headless、ACP、SDK、HTTP 共享同一個核心', tag: '架構' , navTitle: '多入口' },
          ],
        },
        {
          id: 't-dsh-method',
          title: '工程方法論',
          desc: '用 AI 開發 AI 的規訓體系',
          lessons: [
            { file: 'dsh-27.html', title: 'Agent Notes 與 AGENTS.md：用 AI 開發 AI 的規訓', desc: '四狀態設計筆記和給 AI 看的編碼規範，團隊立刻能抄', tag: '彙總' , navTitle: 'Agent Notes' },
            { file: 'dsh-28.html', title: 'KV Cache 是介面', desc: 'prompt 字首穩定性當成相容性承諾來維護', tag: '前沿' , navTitle: 'KV Cache 紀律' },
          ],
        },
        {
          id: 't-dsh-final',
          title: '超越原始碼',
          desc: '五種工程觀與最小可抄清單',
          lessons: [
            { file: 'dsh-29.html', title: '終章：五種工程觀，我們該抄什麼', desc: '五家 harness 設計哲學總表，附最小可抄清單和體量陷阱清單', tag: '收官' , navTitle: '終章 · 該抄什麼' },
          ],
        },
      ],
    },
    {
      id: 'p-codex',
      num: '專題篇章',
      title: '解剖 OpenAI Codex：把安全觀寫進型別系統',
      desc: '這一章要讀 Rust 原始碼，不看不影響任何後續內容。Codex 面對的問題和別家一樣：模型要讀檔案、跑命令、改程式碼，而這些動作沒有人逐條審過。它的答案是把約束儘量往前推，能讓編譯器管的交給型別，型別管不了的寫進 code review，執行時管不了的交給沙箱和審批。本章沿原始碼拆解上下文注入的型別系統、Windows 上的三道關卡、自帶測試用例的命令策略、用模型審批模型的 Guardian，以及給模型專門設計的 diff 與程式碼模式，逐課與 DeepSeek Harness、Claude Code 做證據化對照。',
      color: '#414b5a',
      group: 'indie',
      cluster: 'hardcore',
      routes: [],   // 進階選修，只在完整目錄裡
      hardcore: true,
      topics: [
        {
          id: 't-codex-loop',
          title: '治理與迴圈',
          desc: '一輪對話在內部轉幾圈，誰有資格喊停',
          lessons: [
            { file: 'codex-01.html', title: '新功能先找落腳的 crate，core 是最後一檔', desc: '開啟倉庫，第一反應是往 core 里加。倉庫把這件事寫成禁令：先找現有的非 core crate，否則新建一個。依賴方向會把葉子型別擋在核心之外。', tag: '工程', navTitle: 'crate 治理' },
            { file: 'codex-02.html', title: '三層 Turn Loop：誰有資格決定繼續', desc: '你看到的是一輪對話。內部疊了任務殼、輪次、取樣三層迴圈。各層只回答自己那一個問題，控制權每次只在一層。', tag: '架構', navTitle: '三層 Turn Loop' },
            { file: 'codex-03.html', title: '流還在走，工具已經開工', desc: '模型還在打字，讀檔案的聲音已經響了。取樣迴圈的時序是：流內建 future，流後統一 drain。先 persist，再等結果。', tag: '架構', navTitle: 'SSE 與工具迴圈' },
            { file: 'codex-04.html', title: '中途插話：這句話進本輪、下一輪，還是被拒', desc: 'Agent 正在改第三個檔案，你看見方向偏了，補了一句：配置用 YAML。回車之後，這句話是開工、插進當前輪，還是當場被拒，Core 當場拍板，不等模型開口。', tag: '架構', navTitle: 'Turn 輸入與 Inbox' },
            { file: 'codex-05.html', title: '按下取消之後，各層怎麼收手', desc: '工具失敗回給模型，使用者按 Esc 才停 turn。取消令牌從任務傳到取樣再傳到工具。已完成的結果留在歷史裡，100 毫秒之後的硬拆不可逆。', tag: '架構', navTitle: '取消與錯誤' },
          ],
        },
        {
          id: 't-codex-context',
          title: '上下文',
          desc: '往模型上下文裡塞東西，誰來管',
          lessons: [
            { file: 'codex-06.html', title: '往模型上下文裡塞東西，先給它造一個型別', desc: '每一種注入都是一個型別，自己知道 role、marker 和 body；組裝按欄位分揀，事後靠同一對 marker 認回', tag: '上下文', navTitle: '上下文碎片' },
            { file: 'codex-07.html', title: '把上下文治理寫進 code review', desc: '長度、頻率、字首穩定這些編譯器證明不了的事，用六條禁令加評審規則守住', tag: '工程', navTitle: '上下文治理' },
            { file: 'codex-08.html', title: '滿窗之後，砍哪一段留哪一段', desc: '三個時機共用一個分發器，三種實現由開關選中。同一份摘要在中途必須停在歷史最後一項。', tag: '上下文', navTitle: '上下文壓縮' },
            { file: 'codex-09.html', title: 'JSONL 是真相，SQLite 是映象', desc: '昨天關了終端，今天列表還在，對話也能接著改。這兩件事看起來像同一份儲存，落盤時卻走兩條軌。上軌按行追加，下軌只抄封面。中途拔電之後，能撿回來的永遠是已經過了閘門的那幾行。', tag: '儲存', navTitle: 'JSONL 與 SQLite' },
          ],
        },
        {
          id: 't-codex-tools',
          title: '工具',
          desc: '模型能調什麼，怎麼併發，從哪個門出去',
          lessons: [
            { file: 'codex-10.html', title: '模型看見的工具清單，是一次取樣算出來的', desc: '同一段對話、同一份配置，下一輪取樣卻可能多出 MCP 名字、協作入口或 tool_search。變的是這一次允許廣告哪些 handler。', tag: '工具', navTitle: '工具清單' },
            { file: 'codex-11.html', title: '對模型說隨便並行，底下用鎖管住', desc: '模型看見的、實際執行的、歷史記錄的，是三套順序。一面旗允許一次發多個呼叫，一把讀寫鎖決定誰能疊著進。', tag: '工具', navTitle: '並行工具與鎖' },
            { file: 'codex-12.html', title: '統一入口：一條命令按特徵分叉', desc: '模型只看見 exec_command 和 write_stdin。進門之後，tty、遠端環境和 150 毫秒視窗會把同一條命令送到 PTY、pipe、exec-server，或者送進重試門。', tag: '執行', navTitle: '統一執行入口' },
          ],
        },
        {
          id: 't-codex-sandbox',
          title: '沙箱',
          desc: '命令跑起來之前，攔在哪幾道關',
          lessons: [
            { file: 'codex-13.html', title: '沙箱管理器：把權限檔案編譯成一行命令', desc: '工作區可寫，網路收緊。同一條 git status，Mac 套上 sandbox-exec，Linux 套上 helper，Windows 可能原樣出門。差別出在編譯器。', tag: '沙箱', navTitle: '沙箱管理器' },
            { file: 'codex-14.html', title: 'macOS：把安全策略拼成一個字串', desc: 'Seatbelt 吃的是一段文字。文字由靜態基線加現拼的讀寫網段組成。路徑不進這段文字，走旁邊的參數列。', tag: '沙箱', navTitle: 'macOS Seatbelt' },
            { file: 'codex-15.html', title: 'Linux：先建檢視，再上 seccomp，最後 exec', desc: '同一條讀取，Mac 上回 Operation not permitted，Linux 上回 No such file or directory。差別在於 Linux 先換程序能看見的檔案樹，再收緊它能呼叫的系統介面。', tag: '沙箱', navTitle: 'Linux 沙箱' },
            { file: 'codex-16.html', title: 'Windows：受限令牌、防火牆過濾器與兩個專用系統使用者', desc: '沒有 seatbelt 和 bubblewrap 的平臺怎麼疊出沙箱，以及 AppContainer 為什麼被否掉', tag: '沙箱', navTitle: 'Windows 沙箱' },
            { file: 'codex-17.html', title: 'execpolicy：讓策略檔案自帶測試用例', desc: '正反例寫進規則本身，載入期就跑一遍；字首精確匹配，多規則取最嚴', tag: '策略', navTitle: 'execpolicy' },
          ],
        },
        {
          id: 't-codex-approval',
          title: '審批與網路',
          desc: '攔不住的交給人，或者交給另一個模型',
          lessons: [
            { file: 'codex-18.html', title: '審批策略：同一條命令，問不問看哪兩顆旋鈕', desc: '預設問不問跟沙箱種類綁在一起。問過一次之後，記住的是完整命令，還是一段字首。', tag: '審批', navTitle: '審批策略' },
            { file: 'codex-19.html', title: 'Guardian：讓一個模型去審批另一個模型', desc: '四步法、失敗關閘、超時與拒絕分帳，以及按 turn 計數的熔斷器', tag: '審批', navTitle: 'Guardian' },
            { file: 'codex-20.html', title: '網路與憑證代理：模型看不見的那把鑰匙', desc: '出站要過幾道門。真 token 不進子程序。模型看見的是假值和一句 403。', tag: '網路', navTitle: '網路與憑證代理' },
          ],
        },
        {
          id: 't-codex-modelapi',
          title: '給模型設計的介面',
          desc: '讓模型好用的格式，和跑不完時的收場',
          lessons: [
            { file: 'codex-21.html', title: 'apply-patch，給模型設計一種 diff', desc: '一份沒有行號的補丁語言：定位靠上下文錨點，應用靠四級匹配，單檔案對不上就不寫盤', tag: '工具', navTitle: 'apply-patch' },
            { file: 'codex-22.html', title: 'exec 與 wait：跑不完的程式怎麼收場', desc: '能力做減法的 V8 isolate，以及跑不完就讓出 cell、用 wait 續跑的長任務協議', tag: '程式碼模式', navTitle: 'exec 與 wait' },
            { file: 'codex-23.html', title: '宿主拆分：程式掛在誰身上', desc: '上一課講 exec 和 wait 的語義。這一課問另一件事：這段 JavaScript 到底掛在誰身上，掛點換了之後，故障域和狀態歸屬怎麼變。', tag: '程式碼模式', navTitle: 'Code Mode 宿主' },
          ],
        },
        {
          id: 't-codex-extend',
          title: '擴充套件',
          desc: '把別人的能力接進來，把自己的能力派出去',
          lessons: [
            { file: 'codex-24.html', title: '多 Agent 是一張要持久化的圖', desc: '派出去的是節點，邊一出生就是 Open。信先入隊，followup 才叫醒。關掉的是邊，歷史還在。', tag: '多 Agent', navTitle: '多 Agent 圖' },
            { file: 'codex-25.html', title: '掛鉤點能改什麼，由事件合同決定', desc: '一次 turn 會經過十一個掛鉤。協議認四種處理器，執行表只裝命令和 MCP。超時預設放行，拆卸期丟掉 stdout。', tag: '擴充套件', navTitle: 'Hooks' },
            { file: 'codex-26.html', title: 'MCP 接進來：模型看見翻譯過的名字', desc: '外部 server 的工具要先過一層翻譯才進模型眼睛。skill 目錄常在，缺 MCP 時另問人。', tag: '擴充套件', navTitle: 'MCP 與 Skills' },
            { file: 'codex-27.html', title: '搬家只搬對得上的欄位', desc: '換到 Codex 的第一週，最怕去年攢的 hook、MCP 和外掛還在不在。檢測會列出一份清單。匯入只收下能對映的那一部分。', tag: '擴充套件', navTitle: '外掛遷移' },
          ],
        },
        {
          id: 't-codex-protocol',
          title: '協議與介面',
          desc: '核心和外殼之間說什麼話，終端上怎麼顯示',
          lessons: [
            { file: 'codex-28.html', title: 'SQ 進、EQ 出：同一件事兩副面孔', desc: '命令走程序內的 Submission Queue。事件走能寫成 JSON 的 Event Queue。Rust 名叫 TurnStarted，磁碟上仍寫 task_started。', tag: '協議', navTitle: 'SQ/EQ 事件語言' },
            { file: 'codex-29.html', title: '對外協議是投影', desc: 'IDE 看見的是 Thread / Turn / Item，不是核心 EventMsg。一次 turn/start 先回響應，再推事件流；審批是反向請求，不回包這一輪就停住。', tag: '協議', navTitle: 'app-server 協議' },
            { file: 'codex-30.html', title: '流式輸出怎麼在終端兩區之間定稿', desc: '模型按 token 往外推，終端卻是一個寫出去就改不了的字元網格。已經不會變的行交給 scrollback，還可能變的尾巴留在活動 cell，表格沒閉合之前整段扣住。', tag: '介面', navTitle: 'TUI 流式渲染' },
          ],
        },
        {
          id: 't-codex-closing',
          title: '收束',
          desc: '把架構寫成檢查項，再回看兩套安全觀',
          lessons: [
            { file: 'codex-31.html', title: '把架構決策寫成 lint', desc: '同一份 AGENTS.md 裡，有命令的規則會在三臺作業系統上亮紅。只有路徑的那條，重新命名之後沒人發現。', tag: '工程', navTitle: '架構即 lint' },
            { file: 'codex-32.html', title: '兩種安全視角：同一條命令，兩套判詞', desc: '出事之前有沒有門可以拒絕，出事之後能不能復原模型當時看見的世界。同一條危險命令上，這兩套視角會一致，也會給出相反結論。', tag: '安全', navTitle: '兩種安全視角' },
          ],
        },
      ],
    },
    {
      id: 'p-oss',
      num: '專題篇章',
      title: '開源、蒸餾與本地部署',
      desc: '新聞裡天天說某某模型開源了，開源的到底是什麼？這一章從權重講起，教你自己看懂一張許可證，搞清楚各家開源背後的商業算盤。再往下是模型如何從大變小：湧現、蒸餾，以及蒸餾帶來的同質化代價。最後動手，算清楚自己的電腦能跑多大的模型，用 Ollama 或 LM Studio 真正跑起來。',
      color: '#4f46e5',
      group: 'indie',
      cluster: 'hardcore',
      routes: [],   // 進階選修，只在完整目錄裡
      topics: [
        {
          id: 't-oss-what',
          title: '開源到底開的是什麼',
          desc: '權重、許可證與各家的商業算盤',
          lessons: [
            { file: 'oss-1.html', title: '權重是什麼？一個模型的全部本事', desc: '訓練幾個月最後凝結成的那個檔案：它長什麼樣、多大、為什麼說擁有權重就是擁有控制權', tag: '概念' , navTitle: '權重是什麼'},
            { file: 'oss-2.html', title: '真開源 vs 假開源：怎麼看懂一張許可證', desc: '三個問題定位開放程度；用同一套尺子橫量 Qwen、Mistral、DeepSeek、Llama 與只給 API 的模型', tag: '選型' , navTitle: '真開源 vs 假開源'},
            { file: 'oss-3.html', title: '開源是一門生意：各家在圖什麼', desc: '六家廠商的開源策略與變現路徑；衍生模型數量為什麼比下載量更能說明問題', tag: '案例' , navTitle: '開源是一門生意'},
          ],
        },
        {
          id: 't-oss-small',
          title: '大模型如何變小',
          desc: '湧現、蒸餾，以及必須付出的代價',
          lessons: [
            { file: 'oss-4.html', title: '湧現：能力為什麼會突然出現', desc: '跨過某個規模閾值後能力階躍式跳升；以及這個現象在學術上尚存的爭議', tag: '概念' , navTitle: '湧現'},
            { file: 'oss-5.html', title: '為什麼要把模型做小', desc: '成本、速度、私有化三個現實動機，和小模型做不到的那些事', tag: '方法論' },
            { file: 'oss-6.html', title: '蒸餾是怎麼做的：從老師到學生', desc: '五步流程、軟標籤與溫度係數；用 DeepSeek-R1 同批開源的六個蒸餾模型做樣本', tag: '案例' , navTitle: '蒸餾是怎麼做的'},
            { file: 'oss-7.html', title: '蒸餾的代價：模型正在變得越來越像', desc: '口癖、格式怪癖與身份混淆的整批繼承；為什麼多模型交叉驗證可能是假的', tag: '深入' , navTitle: '蒸餾的代價'},
          ],
        },
        {
          id: 't-oss-local',
          title: '在自己的機器上跑起來',
          desc: '算清楚，再裝上',
          lessons: [
            { file: 'oss-8.html', title: '你的電腦能跑多大的模型', desc: '選顯示卡或 Mac 型號即時出結論；顯存換算公式、量化檔位與 MoE 的顯存速度錯位', tag: '互動' },
            { file: 'oss-9.html', title: 'Ollama 與 LM Studio 怎麼上手', desc: '從安裝到跑通的完整命令、模型標籤的讀法、量化檔位怎麼選，以及三個最常見的坑', tag: '實戰' , navTitle: 'Ollama 與 LM Studio'},
          ],
        },
      ],
    },
    {
      id: 'p-exam',
      num: '自測中心',
      title: '七套篇章自測 · 350 道題',
      desc: '六個正課篇章各配一套 50 道題的卷子，Grok Build 專題另有一套，全部依據對應內容編寫。模擬考試從題庫隨機抽 25 題、選項打亂，刷兩遍也不重樣；順序刷題則逐題即時判定並展開解析。全部學完還有一份全站綜合考，從 350 題裡按卷均攤抽 35 題，專治跨章節的概念混淆。答錯的考點會記進個人中心的薄弱點，直接給出補課連結。',
      color: '#7c3aed',
      group: 'extra',
      routes: ['pm', 'build'],
      exam: true,
      topics: [
        {
          id: 't-exam-entry',
          title: '怎麼用這七套卷',
          desc: '兩種模式的區別與使用建議',
          lessons: [
            { file: 'exam.html', title: '自測中心 · 七套篇章自測', desc: '模擬考試與順序刷題的差別、七套卷子的考點分佈、成績與薄弱點是怎麼記錄的', tag: '互動' , navTitle: '自測中心'},
          ],
        },
        {
          id: 't-exam-base',
          title: '基礎與 Harness',
          desc: '第一、二篇章的自測卷',
          lessons: [
            { file: 'exam-1.html', title: '大模型基礎 · 篇章自測', desc: '50 題：訓練三階段 / Token 與分詞 / 參數凍結 / Temperature / 幻覺四型 / RAG 與四種緩解策略', tag: '互動' , navTitle: '大模型原理篇自測 · 50 題'},
            { file: 'exam-2.html', title: 'AI Harness · 篇章自測', desc: '50 題：上下文溢位 / Prompt 工程 / 注入攻防 / 工具呼叫與 MCP / KV Cache 與成本優化', tag: '互動' , navTitle: 'Harness 核心篇自測 · 50 題'},
          ],
        },
        {
          id: 't-exam-build',
          title: '實戰與工程設計',
          desc: '第三、四篇章的自測卷',
          lessons: [
            { file: 'exam-3.html', title: '實戰 · 從 Demo 到產品 · 篇章自測', desc: '50 題：生圖產品化 / Agent 卡死與防呆 / 上下文壓縮 / 長期記憶 / 多 Agent / MCP 生態', tag: '互動' , navTitle: '動手實戰篇自測 · 50 題'},
            { file: 'exam-4.html', title: 'AI 工程設計模式 · 篇章自測', desc: '50 題：Workflow vs Agent / 上下文三板斧 / ACI 工具設計 / 評測與 Grader / 沙箱隔離', tag: '互動' , navTitle: '工程進階篇自測 · 50 題'},
          ],
        },
        {
          id: 't-exam-deep',
          title: '前沿、方法論與原始碼專題',
          desc: '第五、協作方法論篇與 Grok 專題的自測卷',
          lessons: [
            { file: 'exam-5.html', title: 'Harness 與自我改進 · 篇章自測', desc: '50 題：Harness 三大模式 / 上下文自動進化 / 工作流搜尋 / 遞迴自我改進與七道關', tag: '互動' , navTitle: '自我改進篇自測 · 50 題'},
            { file: 'exam-7.html', title: 'Vibe Coding 方法論 · 篇章自測', desc: '50 題：流程控制與人工斷點 / 品質底線 / 拒絕分期 / 文件沉澱 / 破壞性操作三道閘', tag: '互動' , navTitle: '協作方法論篇自測 · 50 題'},
            { file: 'exam-6.html', title: 'Grok Build 專題 · 篇章自測', desc: '50 題：執行時迴圈 / Compaction / 工具審批 / 雙路記憶檢索 / 五種沙箱 / MCP 整合', tag: '互動' , navTitle: 'Grok 專題自測 · 50 題'},
          ],
        },
        {
          id: 't-exam-all',
          title: '學完整門課再來',
          desc: '跨全站的綜合驗收',
          lessons: [
            { file: 'exam-all.html', title: '全站綜合考 · 七卷抽 35 題', desc: '從 350 題裡每卷均攤抽 5 題，專考跨章節容易串的概念：壓縮與記憶的邊界 / Workflow 與 Agent 選型 / Harness 與提示詞工程的關係', tag: '互動' , navTitle: '全站綜合考 · 35 題'},
          ],
        },
      ],
    },
    {
      id: 'p9',
      num: '課後甜點',
      title: '一人公司 OPC',
      desc: 'AI 讓一個人就能做出產品，也讓能被搶走的東西變多了。這一章講確權與合規：商標、軟著、專利、域名、備案、註冊資本、股權。每一節都有法條出處和真實案例，做早了是投入，做晚了是損失。前兩節免登入，其餘登入後學習。',
      color: '#b45309',
      group: 'extra',
      routes: ['use', 'pro', 'pm', 'build'],
      bonus: true,
      topics: [
        {
          id: 't-opc-basics',
          routes: ['use', 'pro', 'pm', 'build'],
          title: '確權的地基',
          desc: '給每樣資產配對的那把鎖',
          lessons: [
            { file: 'opc-1.html', title: '六種武器：給每樣資產配對的鎖', desc: '商標鎖名字、軟著鎖程式碼、專利鎖技術方案、商業秘密鎖訣竅、著作權鎖內容、域名鎖入口', tag: '開篇' , navTitle: '六種武器'},
            { file: 'opc-2.html', title: '確權要趁早：做早了是投入，做晚了是損失', desc: '兩條時間線對照：同一件事早做幾百塊、晚做幾十萬，還有些損失根本補不回來', tag: '互動' , navTitle: '確權要趁早'},
          ],
        },
        {
          id: 't-opc-tm',
          routes: ['use', 'pro', 'pm', 'build'],
          title: '商標與域名',
          desc: '品牌的戶籍和入口',
          lessons: [
            { file: 'opc-3.html', title: '商標一個不夠：35、42、41 一起拿', desc: '35 類是商業變現的許可證，42 類管軟體平臺，41 類管課程內容；附類別清單生成器', tag: '互動' , navTitle: '商標類別'},
            { file: 'opc-4.html', title: '被駁回之後：把擋路的商標拿掉', desc: '真實案例覆盤：駁回、撤三、複審三步怎麼走，舉證責任在誰身上，十五日複審期限', tag: '案例' , navTitle: '商標被駁回'},
            { file: 'opc-5.html', title: '域名全拿下：十萬的報價怎麼談到五千', desc: '真實議價過程覆盤：手上握著多少字尾，談判桌上就有多少籌碼', tag: '案例' , navTitle: '域名議價'},
          ],
        },
        {
          id: 't-opc-code',
          routes: ['pm', 'build'],
          title: '程式碼、內容與技術',
          desc: '版權自動產生，證據要自己掙',
          lessons: [
            { file: 'opc-6.html', title: '軟著與備案：版權自動產生，證據要自己掙', desc: '軟著登記、著作權備案、可信時間戳的分工；外包開發的著作權歸屬陷阱', tag: '互動' , navTitle: '軟著與備案'},
            { file: 'opc-7.html', title: '專利還是商業秘密：先申請，後公開', desc: '公開換獨佔還是保密換無限期；新穎性一旦丟失不可逆，順序錯了沒有補救', tag: '互動' , navTitle: '專利或商業秘密'},
          ],
        },
        {
          id: 't-opc-entity',
          routes: ['pm', 'build'],
          title: '主體與上線合規',
          desc: '備案、許可、註冊資本',
          lessons: [
            { file: 'opc-8.html', title: 'ICP 備案是地基，ICP 證是收費執照', desc: '備案管能不能開門，ICP 證管能不能收錢：註冊資本 100 萬加第二類增值電信業務', tag: '互動' , navTitle: 'ICP 備案與證'},
            { file: 'opc-9.html', title: '註冊資本別亂寫：五年內要真金白銀繳足', desc: '新公司法五年實繳；一人公司要能證明公司財產獨立於自己的財產，證明不了就連帶', tag: '互動' , navTitle: '註冊資本'},
          ],
        },
        {
          id: 't-opc-equity',
          routes: ['pm', 'build'],
          title: '合夥與股權',
          desc: '互補、控制權、代持與退出',
          lessons: [
            { file: 'opc-10.html', title: '合夥人要互補：能力重疊的兩個人別合夥', desc: '互補排在志同道合前面；做不到極致互信寧可不合夥；先用專案跑一段試婚期', tag: '互動' , navTitle: '合夥人'},
            { file: 'opc-11.html', title: '三個人各 1/3 是最貴的公平', desc: '過半數與三分之二兩條表決線；股權結構模擬器算給你看，核心創始人為什麼要 70%', tag: '互動' , navTitle: '平均分配的陷阱'},
            { file: 'opc-12.html', title: '股權別靠感覺分：五個維度算一遍', desc: '綜合能力、出資額、機會成本、idea 來源、責任擔當；最容易漏掉的兩項佔四成', tag: '互動' , navTitle: '股權五維度'},
            { file: 'opc-13.html', title: '先簽代持協議，成熟了再動工商登記', desc: '離職不簽字為什麼能鎖死公司；代持協議的效力與邊界、分期成熟、退出與回購', tag: '互動' , navTitle: '代持與退出'},
          ],
        },
        {
          id: 't-opc-strategy',
          routes: ['pm', 'build'],
          title: '戰略與收官',
          desc: '出海、選型和新創業公式',
          lessons: [
            { file: 'opc-14.html', title: '伺服器放哪不重要，使用者在哪才關鍵', desc: '假出海躲不掉境內義務，法規看的是向誰提供服務；真出海是一個獨立專案', tag: '互動' , navTitle: '真出海與假出海'},
            { file: 'opc-15.html', title: '大廠看不上的長尾，才是一個人的機會', desc: 'ROI 門檻幫你擋掉了最強的對手；國產模型能力差距已小、價格差距還大，按場景選型', tag: '互動' , navTitle: '長尾與選型'},
            { file: 'opc-final.html', title: '新創業公式：先找買單的人，再用 AI 做出來', desc: '15 節全景圖、確權合規自查十五條、七字真言與止損，以及本週就做的三件事', tag: '收官' , navTitle: '新創業公式'},
          ],
        },
      ],
    },
    {
      id: 'p-seo',
      num: '課後甜點',
      title: '被搜到：SEO 與 GEO',
      desc: '產品做出來了、確權了，接下來的問題是有沒有人找得到。這一章講兩件事：SEO 的最低可行清單（能被抓、能被讀懂、能被收錄），以及 GEO 這個新戰場（讓 ChatGPT、Perplexity、Kimi、豆包在回答問題時願意引用你）。全章用小山學堂自己的一次真實改造當案例，不教黑帽，不承諾排名，只給能自己動手核對的清單。前兩節免登入，其餘登入後學習。',
      color: '#4338ca',
      group: 'extra',
      routes: ['use', 'pro', 'pm', 'build'],
      bonus: true,
      topics: [
        {
          id: 't-seo-why',
          routes: ['use', 'pro', 'pm', 'build'],
          title: '先搞清被發現這件事',
          desc: '做完不等於有人來',
          lessons: [
            { file: 'seo-1.html', title: '做出來了，為什麼沒人來', desc: '三條流量入口各有各的脾氣：搜尋引擎主動搜、AI 引擎直接問、社交傳播替你說。先玩一遍收錄漏斗，看你的產品卡在哪一層', tag: '開篇' , navTitle: '為什麼沒人來'},
          ],
        },
        {
          id: 't-seo-field',
          routes: ['use', 'pro', 'pm', 'build'],
          title: '兩個戰場',
          desc: '搜尋引擎給連結，AI 引擎給答案',
          lessons: [
            { file: 'seo-2.html', title: 'SEO 最低可行清單：能被抓、能被讀懂、能被收錄', desc: '只講做了就有效的部分：一頁一個主題、title 說人話、正文別全靠 JS 渲染、sitemap 與站長平臺提交。抓取模擬器親手切兩態，看爬蟲到底拿到了什麼', tag: '實戰' , navTitle: 'SEO 最低可行清單'},
            { file: 'seo-3.html', title: 'GEO：讓 AI 引擎願意引用你', desc: '使用者不再只搜，還在問。自包含段落、FAQ 結構化資料、llms.txt 與新鮮度訊號，四個槓桿各配一個當場能玩的教具，附 AI 爬蟲點名冊', tag: '互動' , navTitle: 'GEO 讓 AI 引用你'},
          ],
        },
        {
          id: 't-seo-case',
          routes: ['pm', 'build'],
          title: '拆一個真實案例',
          desc: '用本站的改造記錄當解剖臺',
          lessons: [
            { file: 'seo-4.html', title: '拆本站：Google 收錄 693 頁，Bing 只有 50 頁', desc: '小山學堂 2026 年 8 月真實審計覆盤：sitemap 漏了全部英韓頁、Q&A 頁白扔了 FAQ 引用、日誌把爬蟲全丟棄。每個缺口講清怎麼發現、改了什麼、拿什麼驗收', tag: '案例' , navTitle: '拆本站真實改造'},
          ],
        },
        {
          id: 't-seo-final',
          routes: ['pm', 'build'],
          title: '優先順序與收官',
          desc: '一個人沒有 SEO 團隊，只有排序能力',
          lessons: [
            { file: 'seo-5.html', title: '一個人的優先順序：先寫能被搜到的問題', desc: '先寫使用者真的會打出來的那句問題，再堆功能；用真實經歷換可信度。反面清單也在這一節：買外鏈、關鍵詞堆砌、AI 批次灌水頁，哪些是找死', tag: '實戰' , navTitle: '一個人的優先順序'},
            { file: 'seo-final.html', title: '被搜到驗收清單：上線前再過一遍', desc: '十二項可勾選清單：一頁一主題、正文服務端可見、sitemap、一句話答案塊、FAQ 結構化資料、llms.txt。附「怎麼知道有效」的四個度量口徑', tag: '收官' , navTitle: '被搜到驗收清單'},
          ],
        },
      ],
    },
    {
      id: 'p8',
      num: '課後甜點',
      title: '雷軍創業課',
      desc: '這不是 AI 課，是正課學完後的一道甜點：整理自雷軍的創業公開課口述，涵蓋產品、口碑、找錢、估值、股權與現金流。給想靠 AI 做一人公司（OPC）的你，補上「做生意」的方法論。全章免登入開放。',
      color: '#f97316',
      group: 'extra',
      routes: ['pm', 'build'],
      bonus: true,
      freeAll: true,
      topics: [
        {
          id: 't-lei-mind',
          title: '創業者的自我修養',
          desc: '決心、勇氣與向死而生的心理建設',
          lessons: [
            { file: 'lei-1.html', title: '誰適合創業：莫名其妙的自信', desc: '創業不是人乾的事：面對困難的勇氣、描繪藍圖的能力，與金山對抗微軟十六年的信念', tag: '開篇' , navTitle: '誰適合創業'},
            { file: 'lei-2.html', title: '心理準備：第一天就想好怎麼死', desc: '90% 的創業公司都會死；靜悄悄地幹、早死早超生、只給自己四年。危機感才是護身符', tag: '互動' , navTitle: '心理準備'},
          ],
        },
        {
          id: 't-lei-dir',
          title: '方向與起點',
          desc: '喜歡的、能幹的、市場足夠大的',
          lessons: [
            { file: 'lei-3.html', title: '選方向：Go Big Market', desc: '興趣是第一驅動力，但天花板由市場決定：毒霸與詞霸、多玩與 YY 的兩次教訓', tag: '互動' , navTitle: '選方向'},
            { file: 'lei-4.html', title: '起名：贏在起跑線', desc: '有商標、有域名、含義不錯、朗朗上口；從大米到小米的取名全過程', tag: '互動' , navTitle: '起名'},
          ],
        },
        {
          id: 't-lei-product',
          title: '產品與口碑',
          desc: '專注、極致、口碑、快',
          lessons: [
            { file: 'lei-5.html', title: '網際網路七字訣', desc: '一年只出一款手機的自信、把自己逼瘋的極致，與一夜應戰價格戰的快', tag: '互動' },
            { file: 'lei-6.html', title: '口碑的本質是超出預期', desc: '金碧輝煌的帆船酒店為什麼輸給海底撈：預期管理，與用心可以被使用者感知', tag: '互動' , navTitle: '口碑的本質'},
          ],
        },
        {
          id: 't-lei-money',
          title: '找錢與融資',
          desc: '信用是融資的全部前提',
          lessons: [
            { file: 'lei-7.html', title: '第一筆錢：從身邊人開始', desc: '天使投資的本質是熟人信用；商業計劃書沒那麼重要，一句話說清生意才重要', tag: '互動' , navTitle: '第一筆錢'},
            { file: 'lei-8.html', title: '融資時機：有錢才能融到錢', desc: '錢花掉一半就啟動融資；讓投資人來找你；VC 憑什麼要賺十倍', tag: '互動' , navTitle: '融資時機'},
            { file: 'lei-9.html', title: '估值的藝術：融資賣的是信心', desc: '先找不可能投你的人問價、從中間價往上走；做價過高的三種副作用', tag: '互動' , navTitle: '估值的藝術'},
          ],
        },
        {
          id: 't-lei-equity',
          title: '股權與合夥人',
          desc: '創業是一場分享 100% 夢想的拼圖',
          lessons: [
            { file: 'lei-10.html', title: '股權就是拼圖：切忌均分', desc: '50/50 的隱患、三人各 1/3 的死局；極左極右都不行，團隊裡必須有權威', tag: '互動' , navTitle: '股權就是拼圖'},
            { file: 'lei-11.html', title: '合夥人：先分夢想，再分股份', desc: '股份鎖定四年、退出機制提前談；換合夥人的機率高達三分之一', tag: '互動' , navTitle: '合夥人'},
          ],
        },
        {
          id: 't-lei-ops',
          title: '經營基本功',
          desc: '現金流和人是公司的命',
          lessons: [
            { file: 'lei-12.html', title: '現金流與報酬包', desc: '沒有收入你能活幾個月；工資股票自選的 package 制度讓報酬不再攀比', tag: '互動' },
          ],
        },
        {
          id: 't-lei-final',
          title: '專題收官',
          desc: '把雷軍的課變成 OPC 的行動清單',
          lessons: [
            { file: 'lei-final.html', title: '寫給 AI 時代的一人公司', desc: '22 段口述的全景回顧，對映成 OPC 創業自查清單：方向、口碑、現金、股權', tag: '收官' , navTitle: '寫給一人公司'},
            { file: 'lei-test.html', title: '測一測你的 AI 創業成功率', desc: '12 道題綜合全篇章的核心判斷，算出成功率、六維雷達畫像和回爐處方', tag: '互動' , navTitle: '創業成功率測試'},
          ],
        },
      ],
    },
  ],
};

/* ── 标签配色 ── */
window.TAG_STYLE = {
  '互動':   { bg: '#dcfce7', fg: '#15803d' },
  '動畫':   { bg: '#dcfce7', fg: '#166534' },
  '概念':   { bg: '#fef9c3', fg: '#a16207' },
  '案例':   { bg: '#fef2f2', fg: '#dc2626' },
  '開篇':   { bg: '#fef2f2', fg: '#dc2626' },
  '安全':   { bg: '#fef2f2', fg: '#dc2626' },
  '反例':   { bg: '#fef2f2', fg: '#dc2626' },
  '實戰':   { bg: '#dbeafe', fg: '#1d4ed8' },
  'PM 進階':{ bg: '#dbeafe', fg: '#1d4ed8' },
  '系統設計':{ bg: '#dbeafe', fg: '#1d4ed8' },
  '深入':   { bg: '#ffedd5', fg: '#ea580c' },
  '多模態': { bg: '#fef3c7', fg: '#92400e' },
  '選型':   { bg: '#fef3c7', fg: '#d97706' },
  '提示詞工程': { bg: '#e0f2fe', fg: '#0369a1' },
  'RAG':    { bg: '#f3e8ff', fg: '#7e22ce' },
  '架構':   { bg: '#dcfce7', fg: '#166534' },
  '彙總':   { bg: '#ede9fe', fg: '#6d28d9' },
  '收官':   { bg: '#fef9c3', fg: '#a16207' },
  '技巧':   { bg: '#ecfdf5', fg: '#065f46' },
  '設計模式':{ bg: '#fef2f2', fg: '#dc2626' },
  '方法論': { bg: '#fff7ed', fg: '#c2410c' },
  '規範':   { bg: '#ccfbf1', fg: '#0f766e' },
  '前沿':   { bg: '#f3e8ff', fg: '#7c3aed' },
  '考察':   { bg: '#fee2e2', fg: '#b91c1c' },
};

/* ── 工具：扁平化所有 lesson，便于上一节/下一节导航 ── */
window.COURSE_FLAT = (function () {
  const flat = [];
  window.COURSE.parts.forEach(function (part) {
    part.topics.forEach(function (topic) {
      topic.lessons.forEach(function (lesson) {
        flat.push(Object.assign({}, lesson, {
          partId: part.id, partTitle: part.title, partNum: part.num,
          topicId: topic.id, topicTitle: topic.title,
        }));
      });
    });
  });
  return flat;
})();
