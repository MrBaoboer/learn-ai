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
      title: '用 AI 畫畫、寫詩同寫散文',
      lessons: [
        { file: 'elder-ai-tool.html', title: '講出一個畫面，等 AI 寫出嚟、畫出嚟' },
        { file: 'elder-ai-tool-2.html', title: '用 AI 寫一首屬於你嘅小詩' },
        { file: 'elder-ai-tool-3.html', title: '唔滿意就繼續講，改到似自己' },
        { file: 'elder-ai-tool-4.html', title: '用 AI 將一段往事寫成散文' }
      ]
    },
    {
      num: '02',
      title: 'AI 講得啱唔啱',
      lessons: [
        { file: 'elder-ai-verify.html', title: 'AI 講到好似真，都可能係錯' },
        { file: 'elder-ai-verify-2.html', title: '先搵出處' },
        { file: 'elder-ai-verify-3.html', title: 'AI 記得嘅，唔一定係而家嘅' },
        { file: 'elder-ai-verify-4.html', title: '返去原文核對' },
        { file: 'elder-ai-verify-5.html', title: '高風險答案再核對多一次' }
      ]
    },
    {
      num: '03',
      title: '認得出夾雜 AI 嘅騙局',
      lessons: [
        { file: 'elder-scam-official.html', title: 'AI 寫成嘅「官方通知」' },
        { file: 'elder-scam-sms.html', title: '呢條短訊，係咪 AI 寫嘅' },
        { file: 'elder-scam-family.html', title: 'AI 合成嘅仔女把聲' },
        { file: 'elder-scam-face.html', title: 'AI 換臉影片來電' },
        { file: 'elder-scam-qr.html', title: 'AI 整出嚟嘅海報同 QR Code' },
        { file: 'elder-scam-investment.html', title: '羣裏面嘅「AI 薦股老師」' },
        { file: 'elder-scam-check.html', title: '喺中國，你淨係要記住呢幾個核實動作' }
      ]
    },
    {
      num: '04',
      title: '等 AI 幫手睇健康資訊',
      lessons: [
        { file: 'elder-health-report.html', title: 'AI 將箭頭講成咗病' },
        { file: 'elder-health-report-2.html', title: '問 AI 嗰陣，四樣資料要一齊畀' },
        { file: 'elder-health-report-3.html', title: '等 AI 整理問題，帶去問醫生' },
        { file: 'elder-health-report-4.html', title: '等 AI 比較兩次報告嗰陣要小心' },
        { file: 'elder-health-report-5.html', title: 'AI 可以解釋詞，唔可以替你診斷' },
        { file: 'elder-health-report-6.html', title: '急症唔好等 AI 答' }
      ]
    },
    {
      num: '05',
      title: '唔好當 AI 係神醫',
      lessons: [
        { file: 'elder-medical-scam.html', title: 'AI 講「三天逆轉血糖」' },
        { file: 'elder-medical-scam-2.html', title: '假嘅「AI 醫生」帳號' },
        { file: 'elder-medical-scam-3.html', title: 'AI 編出嚟嘅康復案例' },
        { file: 'elder-medical-scam-4.html', title: 'AI 將藥同保健品講成一樣' },
        { file: 'elder-medical-scam-5.html', title: '唔好因為 AI 句說話停藥' },
        { file: 'elder-medical-scam-6.html', title: '保存 AI 嘅原話再去核實' },
        { file: 'elder-medical-check.html', title: '睇病同用藥，你可以咁核實' }
      ]
    },
    {
      num: '06',
      title: '等 AI 改語氣，唔好替我作決定',
      lessons: [
        { file: 'elder-communication.html', title: '將有火氣嘅說話交畀 AI 改寫' },
        { file: 'elder-communication-2.html', title: '等 AI 分開事實、感受、請求' },
        { file: 'elder-communication-3.html', title: 'AI 草稿唔好即刻發到家庭羣' },
        { file: 'elder-communication-4.html', title: '等 AI 寫，但唔好等佢催人' },
        { file: 'elder-communication-5.html', title: 'AI 調整語氣，決定仍然係你嘅' },
        { file: 'elder-communication-6.html', title: '發出前檢查 AI 有冇改事實' }
      ]
    },
    {
      num: '07',
      title: '等 AI 整理故事，唔好改我嘅原話',
      lessons: [
        { file: 'elder-life-create.html', title: '等 AI 整理舊相故事' },
        { file: 'elder-life-create-2.html', title: '留低原話，唔好等 AI 偷偷改寫' },
        { file: 'elder-life-create-3.html', title: '等 AI 將唔確定嘅標成待確認' },
        { file: 'elder-life-create-4.html', title: '等 AI 一次淨係追問一個細節' },
        { file: 'elder-life-create-5.html', title: '等 AI 排相冊，唔好編新情節' },
        { file: 'elder-life-create-6.html', title: 'AI 寫祝福語，都要似你自己講嘅' }
      ]
    },
    {
      num: '08',
      title: '咩嘢唔可以發畀 AI',
      lessons: [
        { file: 'elder-privacy.html', title: '身份證相唔好發畀 AI' },
        { file: 'elder-privacy-2.html', title: '驗證碼唔好貼畀 AI' },
        { file: 'elder-privacy-3.html', title: '「AI 客服」要遠端控制嗰陣即刻停' },
        { file: 'elder-privacy-4.html', title: 'AI 應用扣費前先問清四件事' },
        { file: 'elder-privacy-5.html', title: '陌生 AI 訂閲扣費，點處理？' },
        { file: 'elder-privacy-check.html', title: '扣費同遠端控制，你可以咁處理' }
      ]
    },
    {
      num: '09',
      title: '學完喇：AI 去魅',
      lessons: [
        { file: 'elder-closing.html', title: '識用 AI，亦識分辨' }
      ]
    }
  ];

  /*
   * 首屏不先讲工具和操作，而先回答“学这个对我的生活有什么用”。
   * 数组顺序依次为：价值标题、生活价值、今天只做的一件事、安心提示。
   */
  var valueCards = {
    'elder-ai-tool.html': [
      '將記喺心裏面嘅畫面留低，畀屋企人睇',
      '唔識寫文章都冇所謂。你淨係講幾句，AI 就可以幫你整理成文字。之後諗起老伴、家鄉或者一段往事，都唔使怕唔記得。',
      '對住手機講出一個畫面',
      '冇標準答案，亦都唔使一次過講完整。'
    ],
    'elder-ai-tool-2.html': [
      '將自己嘅心情寫成一首小詩',
      '掛住一個人、鍾意一處景色嗰陣，唔使識押韻。將心裏話講出嚟，AI 就可以幫你整理成一首可以留低嘅小詩。',
      '講出一個畫面同一種心情',
      '唔識寫詩都可以學，你嘅真話最重要。'
    ],
    'elder-ai-tool-3.html': [
      '等 AI 寫得更似你自己',
      'AI 第一遍寫得太花、太客氣都冇所謂。你可以繼續提要求，直至文字聽落似自己平時講嘢。',
      '指出一句唔鍾意嘅地方',
      '唔滿意就改，決定權一直喺你手裏。'
    ],
    'elder-ai-tool-4.html': [
      '將一段往事整理成可以珍藏嘅文章',
      '零散嘅回憶唔使一次過講晒。AI 可以先幫你排清順序，等屋企啲仔女之後都讀到呢段經歷。',
      '按先後講出一段往事',
      '諗起幾多講幾多，細節之後都可以補。'
    ],
    'elder-ai-verify.html': [
      '唔好俾 AI 一本正經嘅錯說話呃住',
      'AI 有時會將猜測講得好肯定。學識先停一停，就可以少傳一條假消息，亦少作一次錯誤決定。',
      '認得出一句可疑嘅肯定說話',
      '唔使判斷晒所有細節，先學識唔好急住信。'
    ],
    'elder-ai-verify-2.html': [
      '搵到出處，再決定信唔信',
      '見到養生、政策或者新聞講法嗰陣，先問「由邊度嚟」，就可以幫你避開冇根據嘅內容。',
      '向 AI 追問原始出處',
      '搵唔到出處，唔等於你睇唔明。'
    ],
    'elder-ai-verify-3.html': [
      '知舊答案幾時唔可以再用',
      '政策、價格同門診安排都會變。睇清資訊日期，就可以避免攞住舊答案處理今日嘅事。',
      '檢查答案講嘅係邊一日',
      '只要多睇一眼日期，就已經穩陣啲。'
    ],
    'elder-ai-verify-4.html': [
      '學識返去原文搵真正意思',
      'AI 嘅轉述可能漏咗條件。返去通知、報告或者説明書原文，就可以睇到佢冇同你講嗰句。',
      '將 AI 嘅說話同原文對照一次',
      '唔使讀完整篇，淨係核對關鍵嗰句。'
    ],
    'elder-ai-verify-5.html': [
      '重要嘅事，多一道放心嘅核驗',
      '牽涉錢、健康同家人安全嗰陣，唔好等一個 AI 答案替你拍板，多搵一個可靠來源更安心。',
      '為高風險答案再搵一個來源',
      '慢少少唔係落後，係保護緊自己。'
    ],
    'elder-scam-official.html': [
      '睇穿好似真嘅假通知',
      '騙子會用 AI 寫出好似官方嘅通知。記住核實渠道，就唔會因為蓋章、紅頭同催促語氣即刻照做。',
      '搵到通知裏面一個危險信號',
      '睇唔準就先唔好撳、唔好轉帳，已經做啱。'
    ],
    'elder-scam-sms.html': [
      '收到可疑短訊嗰陣唔好慌、唔好撳',
      '中獎、扣費同逾期短訊越催越急，就越要先停。學識辨認，就可以護住手機裏面嘅帳號同錢。',
      '判斷一條短訊應唔應該撳',
      '唔使證明佢係假，只要先唔好撳連結。'
    ],
    'elder-scam-family.html': [
      '聽到「孩子求救」就先保住錢',
      'AI 可以模仿家人把聲。遇到喊住借錢，先用平時號碼回撥同暗號確認，就可以擋住最令人慌嘅騙局。',
      '練習一次回撥核實',
      '先掛斷再確認，唔會耽誤真正嘅家人。'
    ],
    'elder-scam-face.html': [
      '影片裏面見到熟人都唔好急住轉帳',
      '換臉影片可能連表情同把聲都好似。多問一個淨係家人才知嘅問題，就多一道保護。',
      '搵出影片來電嘅核實辦法',
      '見到張臉唔代表已經確認咗本人。'
    ],
    'elder-scam-qr.html': [
      '海報同 QR Code 再靚都要先核實',
      'AI 可以好快整出精美海報，QR Code 卻可能去到假頁面。掃碼前睇來源，就可以少一次誤付款。',
      '判斷一個 QR Code 可唔可以掃',
      '唔確定就等家人一齊睇，唔使自己硬估。'
    ],
    'elder-scam-investment.html': [
      '唔好俾「AI 薦股老師」帶住走',
      '羣裏面嘅盈利截圖、老師頭像同熱鬧傾偈都可能係假。睇清承諾同收款方式，就可以守住養老錢。',
      '搵出薦股羣裏面一個騙局信號',
      '錯過所謂機會，都仲易過追返啲錢。'
    ],
    'elder-scam-check.html': [
      '記住幾步，遇到騙局可以自保',
      '將分散嘅防騙方法收成一張清單。之後遇到陌生通知、求救電話或者轉帳要求，就可以跟住逐項核實。',
      '記住「停、掛、撥、問」四步',
      '唔使背好多理論，記住動作就夠。'
    ],
    'elder-health-report.html': [
      '睇明體檢箭頭，唔好俾一個符號嚇住',
      '報告上面嘅高低箭頭唔一定代表生病。等 AI 解釋詞義，再結合醫生意見，就可以少啲無謂擔心。',
      '分清「指標異常」同「已經確診」',
      '先睇明個詞，唔好急住幫自己下結論。'
    ],
    'elder-health-report-2.html': [
      '等 AI 少啲估，解釋得更可靠',
      '年齡、單位、參考範圍同完整上下文缺一項，AI 都可能估錯。將資料畀齊，回答先更有用。',
      '搵齊報告裏面四樣資料',
      '唔識打字可以影清楚，再遮住私隱。'
    ],
    'elder-health-report-3.html': [
      '將想問醫生嘅說話提前理清',
      '門診時間短，好容易一緊張就唔記得。AI 可以將擔心整理成幾條問題，等你睇醫生嗰陣問得更清楚。',
      '整理三句要問醫生嘅說話',
      '淨係做提問清單，唔好等 AI 代替醫生。'
    ],
    'elder-health-report-4.html': [
      '比較兩次報告嗰陣，唔好俾假變化嚇親',
      '唔同醫院、單位同參考範圍可能唔一樣。先確認可唔可以直接比較，先至唔會俾數字變化嚇親。',
      '核對兩份報告嘅單位同日期',
      '比唔到就先問醫生，唔使勉強得出結論。'
    ],
    'elder-health-report-5.html': [
      '用 AI 睇明個詞，唔好等佢替醫生診斷',
      'AI 擅長將術語講得簡單，但睇唔到你嘅完整病情。分清解釋同診斷，既可以聽明，亦唔會耽誤睇病。',
      '將一個醫學詞換成白話',
      'AI 負責解釋，診斷仍然交畀醫生。'
    ],
    'elder-health-report-6.html': [
      '知幾時應該即刻去醫院',
      '胸痛、呼吸困難等急症唔可以等 AI 慢慢答。記住危險信號，關鍵時刻可以為自己同家人爭取時間。',
      '認得出需要即刻求助嘅信號',
      '寧願多問一次急救，都唔好自己一個等。'
    ],
    'elder-medical-scam.html': [
      '睇穿「幾天治好」嘅神醫話術',
      '「三天逆轉」「保證根治」聽落好省心，卻常常係賣貨套路。睇明誇張承諾，就可以少花冤枉錢。',
      '搵出一句唔可信嘅療效承諾',
      '真正治療好少靠一句保證。'
    ],
    'elder-medical-scam-2.html': [
      '分清真醫生同冒牌 AI 帳號',
      '頭像、白大褂同專業回答都可以偽造。核對醫院同執業資料，就可以避免將健康交畀陌生帳號。',
      '核實一個「醫生帳號」嘅身分',
      '查唔到身分就唔好諮詢、唔好付款。'
    ],
    'elder-medical-scam-3.html': [
      '唔好俾編出嚟嘅康復故事打動',
      'AI 可以寫出好感人嘅康復經歷。睇清故事有冇可以核實嘅資料，就可以避免將個案當成療效證明。',
      '搵出康復故事裏面缺少嘅證據',
      '感人唔等於真實，更加唔等於適合你。'
    ],
    'elder-medical-scam-4.html': [
      '分清藥品、保健品同廣告',
      '包裝上面嘅「科技」「AI 配方」唔等於藥品。睇批准資料同用途，就可以避免將保健品當治療。',
      '判斷一件產品係唔係藥',
      '睇唔明包裝嗰陣，帶去問藥劑師就得。'
    ],
    'elder-medical-scam-5.html': [
      '唔好等 AI 動搖醫生開嘅用藥方案',
      'AI 唔了解你嘅完整病史，隨便停藥可能更危險。遇到唔同講法，先保留原方案再問醫生。',
      '練習一句向醫生核實嘅說話',
      '冇醫生確認，就唔好自己停藥換藥。'
    ],
    'elder-medical-scam-6.html': [
      '留低證據，等家人同醫生一齊核實',
      '將 AI 嘅原話、帳號同商品頁面留低，家人或者醫生先睇得清發生咗咩事，亦更容易幫你判斷。',
      '保存一條可疑回答嘅原文',
      '唔識截圖都冇所謂，可以請家人幫手。'
    ],
    'elder-medical-check.html': [
      '睇病用藥嗰陣有一套穩陣核實法',
      '將帳號、療效、藥品同停藥風險放進一張清單。之後碰到醫療講法，就可以按順序檢查。',
      '記住睇病用藥嘅核實順序',
      '清單係提醒，唔係等你自己一個診斷。'
    ],
    'elder-communication.html': [
      '有火氣都可以將說話講明白',
      '生氣嗰陣唔使假裝冇事。AI 可以幫你將說話講到更容易聽見，同時留低你嘅感受同底線。',
      '將一句氣話改成講得出口嘅說話',
      '唔係消咗情緒，而係等對方聽明。'
    ],
    'elder-communication-2.html': [
      '將嘈成一團嘅說話理出頭緒',
      '將事實、感受同請求分開，家人更容易知發生咗咩事，亦知你希望跟住點做。',
      '將一句說話分成三部分',
      '唔使講得靚，只要講清楚。'
    ],
    'elder-communication-3.html': [
      '發家庭羣之前留一次反悔機會',
      'AI 草稿睇落好順口，都可能替你加重語氣。先停一停再讀多一次，就可以少一次羣裏面嘅誤會。',
      '搵出草稿裏面一句唔應該直接發嘅說話',
      '草稿淨係草稿，最後由你決定。'
    ],
    'elder-communication-4.html': [
      '表達需要，但唔好靠內疚催人',
      '想等家人幫手嗰陣，可以講清需要同時間，唔使靠「你都不管我」令大家更難受。',
      '將一句催促改成清楚嘅請求',
      '温和唔等於退讓，要求仍然可以明確。'
    ],
    'elder-communication-5.html': [
      '等 AI 改語氣，唔好替你作主',
      'AI 可以畀幾種講法，但唔可以替你答應、拒絕或者透露病情。守住決定權，句說話先仍然係你嘅。',
      '刪走草稿裏面一個越界決定',
      '任何承諾都要由你本人確認。'
    ],
    'elder-communication-6.html': [
      '發出之前守住事實同本意',
      '語氣變順之後，仲要檢查人名、時間、事實同承諾。咁樣既可以少衝突，亦唔會將意思改錯。',
      '完成一次發送前核對',
      '淨係核對四項，唔使由頭再寫過。'
    ],
    'elder-life-create.html': [
      '等舊相背後嘅故事留低',
      '相片會褪色，記憶亦會慢慢模糊。講出當時嘅人同埋事，AI 就可以幫你整理成家人睇得明嘅故事。',
      '為一張相講三句說話',
      '諗起咩就講咩，唔使有文采。'
    ],
    'elder-life-create-2.html': [
      '留低你自己嘅講法同口氣',
      '整理唔等於改寫人生。同 AI 講邊啲原話一定要留低，文章讀落先似你本人。',
      '圈出一句一定要留低嘅原話',
      '樸素嘅講法都值得照原樣留低。'
    ],
    'elder-life-create-3.html': [
      '唔確定嘅地方唔好等 AI 亂補',
      '年代、人名記唔清好正常。等 AI 標成「待確認」，總好過編一個完整答案，更加尊重真實記憶。',
      '將一個唔確定細節標出嚟',
      '記唔清可以寫「記唔清」，呢個都係事實。'
    ],
    'elder-life-create-4.html': [
      '一次問一個細節，回憶唔使咁辛苦',
      '問題太多好容易攰。等 AI 一次淨係問一件小事，你可以慢慢諗，亦更容易將畫面講清。',
      '等 AI 淨係追問一個細節',
      '答唔出可以跳過，唔影響繼續整理。'
    ],
    'elder-life-create-5.html': [
      '將相冊排清楚，唔好編新故事',
      'AI 可以按時間或者人物排列相片，但不應該補上冇發生過嘅情節。相冊清楚，都要保持真實。',
      '畀三張相排一個順序',
      '淨係用已有資料，唔夠嘅地方先空住。'
    ],
    'elder-life-create-6.html': [
      '寫出似你本人講嘅祝福',
      '節日祝福唔使華麗套話。同 AI 講對方係邊個、你真心想講咩，就可以得到更似自己嘅版本。',
      '講出一句真心祝福',
      '短少少、平常少少，都可以好温暖。'
    ],
    'elder-privacy.html': [
      '保護身份證，唔好等方便變成風險',
      '身份證相一發出，好難知會點樣被保存同使用。學識先遮擋，就可以減少冒用風險。',
      '判斷身份證相邊啲地方唔可以發',
      '拿唔準就先唔好上傳，唔會耽誤學習。'
    ],
    'elder-privacy-2.html': [
      '守住驗證碼，就係守住錢同帳號',
      '驗證碼等於臨時鎖匙，真正客服都唔會要。記住呢一點，就可以擋住好多盜號同轉帳騙局。',
      '認得出一次要驗證碼嘅危險請求',
      '邊個嚟催都唔好講，先掛斷再核實。'
    ],
    'elder-privacy-3.html': [
      '遇到遠端控制要求即刻停手',
      '「AI 客服」叫你共享螢幕或者安裝遠控軟件嗰陣，對方可能而家睇緊密碼同操作手機。及時停低最重要。',
      '練習關閉一次遠端控制請求',
      '唔識退出就斷網、關機，再搵家人。'
    ],
    'elder-privacy-4.html': [
      '扣費前先問清楚，唔好花糊塗錢',
      '免費試用可能會自動續費。付款前睇清價格、週期、取消辦法同客服渠道，心裏先有數。',
      '訂閲前問清四件事',
      '未睇明就先唔好撳確認。'
    ],
    'elder-privacy-5.html': [
      '發現陌生扣費，知點樣止住損失',
      '見到唔認得嘅 AI 訂閲扣費嗰陣，先保存記錄、關閉續費，再聯絡平台，就可以避免繼續被扣。',
      '按順序處理一筆陌生扣費',
      '先止住之後嘅扣款，再慢慢申訴。'
    ],
    'elder-privacy-check.html': [
      '遇到扣費同遠控就跟住做',
      '將私隱、驗證碼、遠控同訂閲處理收成一張清單。緊張嗰陣唔使靠記憶，跟住動作做就得。',
      '記住「停、截、關、問」四步',
      '清單可以留給家人一齊用。'
    ],
    'elder-closing.html': [
      '識用 AI，亦知幾時唔好用',
      '學完唔係要相信 AI 每一句，而係等佢幫手嗰陣心裏有數：識創作、識核實、守住錢同健康。',
      '回顧自己最想帶走嘅一個動作',
      '記住一兩件真正有用嘅事，就已經好好。'
    ]
  };

  var flat = [];
  chapters.forEach(function (chapter, chapterIndex) {
    chapter.lessons.forEach(function (lesson, lessonIndex) {
      var value = valueCards[lesson.file] || [
        lesson.title,
        '先睇睇呢件事可以為生活帶來咩，再跟住白艾莉一步一步練。',
        lesson.title,
        '唔使一次做啱，慢慢嚟就得。'
      ];
      flat.push({
        file: lesson.file,
        title: lesson.title,
        chapterNum: chapter.num,
        chapterTitle: chapter.title,
        chapterIndex: chapterIndex,
        lessonIndex: lessonIndex,
        value: {
          benefitLabel: '呢一課可以幫到你',
          duration: '大大約 6 分鐘',
          valueTitle: value[0],
          valueBody: value[1],
          oneThing: value[2],
          reassurance: value[3],
          startLabel: '開始呢一課'
        }
      });
    });
  });

  window.ELDER_COURSE = chapters;
  window.ELDER_COURSE_FLAT = flat;
})();
