/**
 * 功能：定义敬老版课程的章节、课题与固定阅读顺序。
 * 作者：Cursor
 * 日期：2026-08-25
 * 版本：1.0.0
 */
(function () {
  'use strict';

  var chapters = [
    {
      num: '01',
      title: '用 AI 畫畫、寫詩、寫散文',
      lessons: [
        { file: 'elder-ai-tool.html', title: '說出一個畫面，讓 AI 寫出來、畫出來' },
        { file: 'elder-ai-tool-2.html', title: '用 AI 寫一首屬於您的小詩' },
        { file: 'elder-ai-tool-3.html', title: '不滿意就繼續說，改到像自己' },
        { file: 'elder-ai-tool-4.html', title: '用 AI 把一段往事寫成散文' }
      ]
    },
    {
      num: '02',
      title: 'AI 說得對不對',
      lessons: [
        { file: 'elder-ai-verify.html', title: 'AI 說得像真的，也可能是錯的' },
        { file: 'elder-ai-verify-2.html', title: '先找出處' },
        { file: 'elder-ai-verify-3.html', title: 'AI 記得的，不一定是現在的' },
        { file: 'elder-ai-verify-4.html', title: '回到原文核對' },
        { file: 'elder-ai-verify-5.html', title: '高風險答案再核對一次' }
      ]
    },
    {
      num: '03',
      title: '辨認帶 AI 的騙局',
      lessons: [
        { file: 'elder-scam-official.html', title: 'AI 寫成的“官方通知”' },
        { file: 'elder-scam-sms.html', title: '這條簡訊，是 AI 寫的嗎' },
        { file: 'elder-scam-family.html', title: 'AI 合成的子女聲音' },
        { file: 'elder-scam-face.html', title: 'AI 換臉影片來電' },
        { file: 'elder-scam-qr.html', title: 'AI 生成的海報和 QR 碼' },
        { file: 'elder-scam-investment.html', title: '群組裡的“AI 薦股老師”' },
        { file: 'elder-scam-check.html', title: '在中國，您只要記住這幾個核實動作' }
      ]
    },
    {
      num: '04',
      title: '讓 AI 幫忙讀健康資料',
      lessons: [
        { file: 'elder-health-report.html', title: 'AI 把箭頭說成了病' },
        { file: 'elder-health-report-2.html', title: '問 AI 時，四樣資料要一起給' },
        { file: 'elder-health-report-3.html', title: '讓 AI 整理問題，帶去問醫生' },
        { file: 'elder-health-report-4.html', title: '讓 AI 比較兩次報告時要小心' },
        { file: 'elder-health-report-5.html', title: 'AI 可以解釋詞，不能替您診斷' },
        { file: 'elder-health-report-6.html', title: '急症不要等 AI 回答' }
      ]
    },
    {
      num: '05',
      title: '別把 AI 當成神醫',
      lessons: [
        { file: 'elder-medical-scam.html', title: 'AI 說“三天逆轉血糖”' },
        { file: 'elder-medical-scam-2.html', title: '假的“AI 醫生”帳號' },
        { file: 'elder-medical-scam-3.html', title: 'AI 編出來的康復案例' },
        { file: 'elder-medical-scam-4.html', title: 'AI 把藥和保健食品說成一樣' },
        { file: 'elder-medical-scam-5.html', title: '不要因為 AI 的話停藥' },
        { file: 'elder-medical-scam-6.html', title: '留下 AI 的原話再去核實' },
        { file: 'elder-medical-check.html', title: '看病和用藥，您可以這樣核實' }
      ]
    },
    {
      num: '06',
      title: '讓 AI 改語氣，不替我做決定',
      lessons: [
        { file: 'elder-communication.html', title: '把有火氣的話交給 AI 改寫' },
        { file: 'elder-communication-2.html', title: '讓 AI 分開事實、感受、請求' },
        { file: 'elder-communication-3.html', title: 'AI 草稿先別直接發到家庭群組組' },
        { file: 'elder-communication-4.html', title: '讓 AI 寫，但別讓它催人' },
        { file: 'elder-communication-5.html', title: 'AI 調整語氣，決定仍是您的' },
        { file: 'elder-communication-6.html', title: '發出前檢查 AI 有沒有改事實' }
      ]
    },
    {
      num: '07',
      title: '讓 AI 整理故事，不改我的原話',
      lessons: [
        { file: 'elder-life-create.html', title: '讓 AI 整理老照片故事' },
        { file: 'elder-life-create-2.html', title: '保留原話，不讓 AI 悄悄改寫' },
        { file: 'elder-life-create-3.html', title: '讓 AI 把不確定標成待確認' },
        { file: 'elder-life-create-4.html', title: '讓 AI 一次只追問一個細節' },
        { file: 'elder-life-create-5.html', title: '讓 AI 排相簿，不編新情節' },
        { file: 'elder-life-create-6.html', title: 'AI 寫祝福語，也要像您自己說的' }
      ]
    },
    {
      num: '08',
      title: '什麼不能發給 AI',
      lessons: [
        { file: 'elder-privacy.html', title: '身分證照片不要發給 AI' },
        { file: 'elder-privacy-2.html', title: '驗證碼不要貼給 AI' },
        { file: 'elder-privacy-3.html', title: '“AI 客服”要遠端控制時立刻停' },
        { file: 'elder-privacy-4.html', title: 'AI 應用程式扣款前先問四件事' },
        { file: 'elder-privacy-5.html', title: '陌生 AI 訂閱扣款要怎麼處理' },
        { file: 'elder-privacy-check.html', title: '扣款和遠端控制，您可以這樣處理' }
      ]
    },
    {
      num: '09',
      title: '學完了：看清楚 AI',
      lessons: [
        { file: 'elder-closing.html', title: '會用 AI，也會分辨' }
      ]
    }
  ];

  /*
   * 首屏不先讲工具和操作，而先回答“学这个对我的生活有什么用”。
   * 数组顺序依次为：价值标题、生活价值、今天只做的一件事、安心提示。
   */
  var valueCards = {
    'elder-ai-tool.html': [
      '把記在心裡的畫面留下來，給家人看',
      '不會寫文章也沒關係。您只要說幾句，AI 能幫您整理成文字。以後想起老伴、家鄉或一段往事，都不怕忘了。',
      '對著手機說出一個畫面',
      '沒有標準答案，也不用一次說完整。'
    ],
    'elder-ai-tool-2.html': [
      '把自己的心情寫成一首小詩',
      '想念一個人、喜歡一處景色時，不必會押韻。把心裡話說出來，AI 能幫您整理成一首可以留下來的小詩。',
      '說出一個畫面和一種心情',
      '不會寫詩也能學，您的真話最重要。'
    ],
    'elder-ai-tool-3.html': [
      '讓 AI 寫得更像您自己',
      'AI 第一遍寫得太華麗、太客套都沒關係。您可以繼續提要求，直到文字聽起來像自己平常說的話。',
      '指出一句不喜歡的地方',
      '不滿意就改，決定權一直在您手上。'
    ],
    'elder-ai-tool-4.html': [
      '把一段往事整理成可珍藏的文章',
      '零散的回憶不用一次講完。AI 可以先幫您把順序排好，讓家裡的孩子以後還能讀到這段經歷。',
      '按先後說出一段往事',
      '想起多少說多少，細節以後還能補。'
    ],
    'elder-ai-verify.html': [
      '別被 AI 一本正經的錯話騙住',
      'AI 有時會把猜測說得很肯定。學會先停一下，能少傳一條假訊息，也少做一次錯誤決定。',
      '認出一句可疑的肯定話',
      '不用判斷所有細節，先學會先別急著相信。'
    ],
    'elder-ai-verify-2.html': [
      '找到出處，再決定信不信',
      '看到養生、政策或新聞說法時，先問“從哪裡來的”，能幫您避開沒有根據的內容。',
      '向 AI 追問原始出處',
      '找不到出處，不等於您沒看懂。'
    ],
    'elder-ai-verify-3.html': [
      '知道舊答案什麼時候不能再用',
      '政策、價格和門診時間都會變化。看清楚資料日期，能避免拿著過去的答案處理今天的事。',
      '檢查答案說的是哪一天',
      '只要多看一眼日期，就已經更穩當。'
    ],
    'elder-ai-verify-4.html': [
      '學會回原文找真正的意思',
      'AI 的轉述可能漏掉條件。回到通知、報告或說明書原文，能看見它沒有告訴您的那一句。',
      '把 AI 的話和原文對照一次',
      '不用讀完整篇，只核對關鍵那一句。'
    ],
    'elder-ai-verify-5.html': [
      '重要的事，多一道放心的核對',
      '牽涉錢、健康和家人安全時，不讓一個 AI 答案替您做決定，多找一個可靠來源更安心。',
      '為高風險答案再找一個來源',
      '慢一點不是落後，是在保護自己。'
    ],
    'elder-scam-official.html': [
      '看穿看起來很正式的假通知',
      '騙子會用 AI 寫出很像官方的通知。記住核實管道，就不會因為蓋章、紅頭和催促語氣立刻照做。',
      '找到通知裡的一個危險跡象',
      '看不準時先不點、不轉帳，就做對了。'
    ],
    'elder-scam-sms.html': [
      '收到可疑簡訊時不慌不點',
      '中獎、扣款和逾期簡訊越催越急，越需要先停。學會辨認，能守住手機裡的帳號和錢。',
      '判斷一條簡訊該不該點',
      '不用證明它是假，只要先不點連結。'
    ],
    'elder-scam-family.html': [
      '聽到“孩子求救”先保住錢',
      'AI 能模仿家人的聲音。遇到哭喊借錢，先用平常的號碼打回去，再用暗號確認，能擋住最讓人慌的騙局。',
      '練習一次打回去核對',
      '先結束通話再確認，不會耽誤真正的家人。'
    ],
    'elder-scam-face.html': [
      '影片裡看見熟人也不急著轉帳',
      '換臉影片可能連表情和聲音都很像。多問一個只有家人才知道的問題，就多一道保護。',
      '找出影片來電的核實辦法',
      '看見臉不代表已經確認了本人。'
    ],
    'elder-scam-qr.html': [
      '海報和 QR 碼再漂亮也先核對',
      'AI 能快速做出精美海報，QR 碼卻可能通往假頁面。掃碼前看來源，能少付錯一次錢。',
      '判斷一個 QR 碼能不能掃',
      '不確定就讓家人一起看，不必自己亂猜。'
    ],
    'elder-scam-investment.html': [
      '不被“AI 薦股老師”帶著走',
      '群組裡的獲利截圖、老師頭像和熱鬧聊天都可能是假的。看清承諾和收款方式，能守住養老的錢。',
      '找出薦股群組裡的一個騙局跡象',
      '錯過所謂機會，也比追回錢容易。'
    ],
    'elder-scam-check.html': [
      '記住幾步，遇到騙局能自保',
      '把分散的防騙方法收成一張清單。以後遇到陌生通知、求救電話或轉帳要求，可以照著逐項核實。',
      '記住“停、掛、撥、問”四步',
      '不用背很多理論，記住動作就夠。'
    ],
    'elder-health-report.html': [
      '看懂健檢箭頭，不被一個符號嚇住',
      '報告上的高低箭頭不一定代表生病。讓 AI 解釋詞義，再結合醫生意見，能少一點不必要的擔心。',
      '分清“指標異常”和“已經確診”',
      '先看懂詞，不急著給自己下結論。'
    ],
    'elder-health-report-2.html': [
      '讓 AI 少猜，解釋得更可靠',
      '年齡、單位、參考範圍和完整前後文缺一項，AI 都可能猜錯。把資料給齊，回答才更有用。',
      '找齊報告裡的四樣資料',
      '不會打字可以拍清楚，再遮住隱私。'
    ],
    'elder-health-report-3.html': [
      '把想問醫生的話提前理清',
      '門診時間短，容易一緊張就忘記。AI 可以把擔心整理成幾條問題，讓您看診時問得更清楚。',
      '整理三句要問醫生的話',
      '只做提問清單，不讓 AI 取代醫生。'
    ],
    'elder-health-report-4.html': [
      '比較兩次報告時不被假變化嚇到',
      '不同醫院、單位和參考範圍可能不一樣。先確認能不能直接比較，才不會被數字變化嚇到。',
      '核對兩份報告的單位和日期',
      '比不了就先問醫生，不必勉強得結論。'
    ],
    'elder-health-report-5.html': [
      '用 AI 看懂詞，不讓它替醫生診斷',
      'AI 擅長把術語說簡單，卻看不到您的完整病情。分清解釋和診斷，既能聽懂，也不耽誤看診。',
      '把一個醫學詞換成白話',
      'AI 負責解釋，診斷仍交給醫生。'
    ],
    'elder-health-report-6.html': [
      '知道什麼時候該立刻去醫院',
      '胸痛、呼吸困難等急症不能等 AI 慢慢回答。記住危險跡象，關鍵時刻能為自己和家人爭取時間。',
      '認出需要立刻求助的跡象',
      '寧可多問一次急救，也不要獨自等待。'
    ],
    'elder-medical-scam.html': [
      '看穿“幾天治好”的神醫話術',
      '“三天逆轉”“保證根治”聽著省心，卻常常是賣東西的話術。看懂誇張承諾，能少花冤枉錢。',
      '找出一句不可信的療效承諾',
      '真正治療很少靠一句保證。'
    ],
    'elder-medical-scam-2.html': [
      '分清真醫生和冒牌 AI 帳號',
      '頭像、白袍和專業回答都能偽造。核對醫院與執業資料，能避免把健康交給陌生帳號。',
      '核實一個“醫生帳號”的身份',
      '查不到身份就不詢問、不付款。'
    ],
    'elder-medical-scam-3.html': [
      '不被編出來的康復故事打動',
      'AI 可以寫出很感人的康復經歷。看清故事有沒有能核對的資料，能避免把個案當成療效證明。',
      '找出康復故事裡缺少的證據',
      '感人不等於真實，更不等於適合您。'
    ],
    'elder-medical-scam-4.html': [
      '分清藥品、保健食品和廣告',
      '包裝上的“科技”“AI 配方”不等於藥品。看核准字號和用途，能避免把保健食品當治療。',
      '判斷一件產品是不是藥',
      '看不懂包裝時，帶去問藥師就好。'
    ],
    'elder-medical-scam-5.html': [
      '不讓 AI 動搖醫生開的用藥方案',
      'AI 不了解您的完整病史，隨意停藥可能更危險。遇到不同說法，先保留原方案再問醫生。',
      '練習一句向醫生核實的話',
      '沒有醫生確認，不要自己停藥或換藥。'
    ],
    'elder-medical-scam-6.html': [
      '保留證據，讓家人醫生一起核實',
      '把 AI 的原話、帳號和商品頁面留下來，家人或醫生才能看清發生了什麼，也更容易幫您判斷。',
      '留下一條可疑回答的原文',
      '不會截圖也沒關係，可以請家人協助。'
    ],
    'elder-medical-check.html': [
      '看病用藥時有一套穩當核實法',
      '把帳號、療效、藥品和停藥風險放進一張清單。以後碰到醫療說法，可以按順序檢查。',
      '記住看病用藥的核實順序',
      '清單是提醒，不是讓您獨自診斷。'
    ],
    'elder-communication.html': [
      '有火氣也能把話說明白',
      '生氣時不必假裝沒事。AI 可以幫您把話說得更容易聽見，同時保留您的感受和底線。',
      '把一句氣話改成能說出口的話',
      '不是消掉情緒，而是讓對方聽懂。'
    ],
    'elder-communication-2.html': [
      '把吵成一團的話理出頭緒',
      '把事實、感受和請求分開，家人更容易知道發生了什麼，也知道您希望接下來怎麼做。',
      '把一句話分成三部分',
      '不用說得漂亮，只要說清楚。'
    ],
    'elder-communication-3.html': [
      '發到家庭群組前留一次反悔機會',
      'AI 草稿看起來順口，也可能替您加重語氣。先停一下再讀一遍，能少一次群組裡的誤會。',
      '找出草稿裡一句不該直接發的話',
      '草稿只是草稿，最後由您決定。'
    ],
    'elder-communication-4.html': [
      '表達需要，但不靠內疚催人',
      '想讓家人幫忙時，可以說清需要和時間，不必用“你都不管我”讓彼此更難受。',
      '把一句催促改成清楚的請求',
      '溫和不等於退讓，要求仍然可以明確。'
    ],
    'elder-communication-5.html': [
      '讓 AI 改語氣，不替您做主',
      'AI 可以給幾種說法，卻不能替您答應、拒絕或透露病情。守住決定權，話才仍是您的。',
      '刪掉草稿裡一個越界決定',
      '任何承諾都要由您本人確認。'
    ],
    'elder-communication-6.html': [
      '發出去前守住事實和本意',
      '語氣變順以後，還要檢查人名、時間、事實和承諾。這樣既少衝突，也不會把意思改錯。',
      '送出前核對一次',
      '只核對四項，不需要從頭重寫。'
    ],
    'elder-life-create.html': [
      '讓老照片背後的故事留下來',
      '照片會褪色，記憶也會慢慢模糊。說出當時的人和事，AI 能幫您整理成家人看得懂的故事。',
      '為一張照片說三句話',
      '想起什麼說什麼，不需要文采。'
    ],
    'elder-life-create-2.html': [
      '保留您自己的說法和口氣',
      '整理不等於改寫人生。告訴 AI 哪些原話必須保留，文章讀起來才像您本人。',
      '圈出一句必須保留的原話',
      '樸素的說法也值得原樣留下。'
    ],
    'elder-life-create-3.html': [
      '不確定的地方不讓 AI 亂補',
      '年代、人名記不清很正常。讓 AI 標成“待確認”，比編一個完整答案更尊重真實記憶。',
      '把一個不確定細節標出來',
      '記不清可以寫“記不清”，這也是事實。'
    ],
    'elder-life-create-4.html': [
      '一次問一個細節，回憶不受累',
      '問題太多容易疲憊。讓 AI 一次只問一件小事，您可以慢慢想，也更容易把畫面說清。',
      '讓 AI 只追問一個細節',
      '答不上來可以跳過，不影響繼續整理。'
    ],
    'elder-life-create-5.html': [
      '把相簿排清楚，不編新故事',
      'AI 可以按時間或人物排列照片，但不該補上沒發生的情節。相簿清楚，也要保持真實。',
      '給三張照片排一個順序',
      '只用已有的資料，不夠的地方先空著。'
    ],
    'elder-life-create-6.html': [
      '寫出像您本人說的祝福',
      '節日祝福不用華麗套話。告訴 AI 對方是誰、您真心想說什麼，就能得到更像自己的版本。',
      '說出一句真心祝福',
      '短一點、平常一點，也可以很溫暖。'
    ],
    'elder-privacy.html': [
      '保護身分證，不讓方便變成風險',
      '身分證照片一旦發出，很難知道會被怎樣保存和使用。學會先遮擋，能減少冒用風險。',
      '判斷身分證照片哪些地方不能發',
      '不確定就先不上傳，不會耽誤學習。'
    ],
    'elder-privacy-2.html': [
      '守住驗證碼，就是守住錢和帳號',
      '驗證碼相當於臨時鑰匙，真正客服也不會跟您要。記住這一點，能擋住很多盜用帳號和轉帳騙局。',
      '辨認一次有人跟您要驗證碼的危險請求',
      '誰來催都不說，先結束通話再核實。'
    ],
    'elder-privacy-3.html': [
      '遇到遠端控制要求馬上停手',
      '“AI 客服”讓您分享螢幕或安裝遠端控制軟體時，對方可能正在看密碼和操作手機。及時停下最重要。',
      '練習關閉一次遠端控制請求',
      '不會退出就把網路關掉、把手機關機，並找家人。'
    ],
    'elder-privacy-4.html': [
      '扣款前先問清楚，不花不明不白的錢',
      '免費試用可能會自動續訂。付款前看清價格、週期、取消方式和客服管道，心裡才有數。',
      '在訂閱前問清四件事',
      '沒看懂就先不點確認。'
    ],
    'elder-privacy-5.html': [
      '發現陌生扣款，知道怎麼先停住損失',
      '看到不認識的 AI 訂閱扣款時，先留下紀錄、關掉自動續訂，再聯絡平台，能避免繼續被扣。',
      '按順序處理一筆陌生扣款',
      '先止住後續扣款，再慢慢申訴。'
    ],
    'elder-privacy-check.html': [
      '遇到扣款和遠端控制時照著做',
      '把隱私、驗證碼、遠端控制和訂閱處理收成一張清單。緊張時不用回憶，照著動作做就行。',
      '記住“停、截、關、問”四步',
      '清單可以留給家人一起使用。'
    ],
    'elder-closing.html': [
      '會用 AI，也知道什麼時候不用',
      '學完不是要相信 AI 的每句話，而是讓它幫忙時心裡有數：能創作、會核實、守住錢和健康。',
      '回顧自己最想帶走的一個動作',
      '記住一兩件真正有用的事，就很好。'
    ]
  };

  var flat = [];
  chapters.forEach(function (chapter, chapterIndex) {
    chapter.lessons.forEach(function (lesson, lessonIndex) {
      var value = valueCards[lesson.file] || [
        lesson.title,
        '先看看這件事對生活有什麼幫助，再跟著白艾莉一步一步練習。',
        lesson.title,
        '不用一次做對，慢慢來就好。'
      ];
      flat.push({
        file: lesson.file,
        title: lesson.title,
        chapterNum: chapter.num,
        chapterTitle: chapter.title,
        chapterIndex: chapterIndex,
        lessonIndex: lessonIndex,
        value: {
          benefitLabel: '這一課能幫您',
          duration: '大大約 6 分鐘',
          valueTitle: value[0],
          valueBody: value[1],
          oneThing: value[2],
          reassurance: value[3],
          startLabel: '開始這一課'
        }
      });
    });
  });

  window.ELDER_COURSE = chapters;
  window.ELDER_COURSE_FLAT = flat;
})();
