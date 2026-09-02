/* Grok Build 专题自测题库（24 题：单选 14 / 多选 5 / 判断 5）
   g=考点组编号（本卷使用 601-624），exp=答案解析
   注：文件名沿用 exam-data-6 是为了不打断学员的历史成绩与薄弱点记录。
   Grok Build 已从原协作方法论篇降级为选修专题，Vibe Coding（exam-data-7）补位，即现在的协作方法论篇。 */
window.EXAM_BANK = [
 {
  "g": 601,
  "type": "single",
  "q": "根 Cargo.toml 顯示 Grok Build 的 workspace 共有 79 個成員。關於這套原始碼的組織方式，下列哪項符合課程內容？",
  "opts": [
   "79 個成員平均分佈在入口、介面、工具、基礎設施四個頂層目錄，每個目錄約 20 個 crate",
   "主體的 62 個成員集中在 crates/codegen/ 下，閱讀時沿組合入口、TUI、Shell 宿主、領域能力、推理與狀態五條主軸展開",
   "79 個成員全部是可獨立釋出的二進位程式，產品透過程序間通訊把它們組合起來",
   "根 Cargo.toml 由維護者手工維護，任何 crate 的增刪都需要人工同步成員清單"
  ],
  "ans": 1,
  "exp": "79 個成員是 workspace 事實，其中 62 個集中在 crates/codegen/，另有 build、common、prod 與 third_party。課程強呼叫五條主軸閱讀，避免套用虛構的四層目錄。根 Cargo.toml 首行註明它是自動生成的 workspace root，並非手工維護。"
 },
 {
  "g": 602,
  "type": "single",
  "q": "Session 執行時裡三個核心 Actor 的分工，下列哪項描述正確？",
  "opts": [
   "SessionActor 直接持有 conversation 與 token 狀態，ChatStateActor 只負責把狀態持久化到磁碟",
   "SessionActor 負責 turn 編排，ChatStateActor 專屬擁有對話與 token 狀態，SamplerActor 負責模型請求與流式事件",
   "SamplerActor 擁有完整對話歷史，因為它需要全部上下文才能發起取樣請求",
   "三個 Actor 透過共享記憶體鎖併發讀寫同一份會話狀態，以減少訊息傳遞開銷"
  ],
  "ans": 1,
  "exp": "SessionActor 透過 run_session 接收命令與事件並推進 turn loop；ChatStateActor 專屬擁有 conversation、token、配置與 persistence，經 mpsc 序列處理命令，沒有共享鎖；SamplerActor 為請求建立流式取樣任務。狀態各有唯一擁有者是這套 Actor 設計的關鍵。"
 },
 {
  "g": 603,
  "type": "single",
  "q": "關於 Grok Build 的真實程式入口與執行分支，下列哪項正確？",
  "opts": [
   "TUI、headless、stdio Agent、leader 各自擁有獨立的 main 二進位，沒有統一入口",
   "真實入口是 xai-grok-shell 的 run_leader，其餘模式都從 leader 程序再分發",
   "真實入口位於 xai-grok-pager-bin/src/main.rs，由它分發 headless、stdio Agent、leader 與互動 TUI 四種分支",
   "入口在 xai-grok-sampler 中，先建立模型連線，再啟動介面與會話宿主"
  ],
  "ans": 2,
  "exp": "同一個組合入口 main() 解析命令與互動模式：run_headless 進入無頭宿主、run_stdio_agent 走 ACP stdio、run_leader 承載長生命週期 Agent、預設互動分支進入 pager 的 app::run。隨後由 connect_or_spawn、MvpAgent、spawn_session_on_thread 一路走到 SessionActor 與 SamplerActor。"
 },
 {
  "g": 604,
  "type": "single",
  "q": "關於會話的取消機制與 Agent 的可變性，下列哪項符合原始碼事實？",
  "opts": [
   "取消透過高優先順序訊息插入隊首實現，能立即搶佔正在執行的工具呼叫",
   "取消依靠 CancellationToken 驅動協作式收尾，全部 handle 被丟棄也會結束 Actor 迴圈；Agent 構建後有效不可變，但保留 finalize_prompt 顯式重渲染入口",
   "Agent 構建後絕對不可變，包括 system prompt 在內的任何欄位都無法再更新",
   "取消由作業系統直接終止 Session 執行緒完成，無須 Actor 協作配合"
  ],
  "ans": 1,
  "exp": "取消是協作式的：CancellationToken 觸發退出，handle 全部丟棄也會結束迴圈，原始碼沒有「高優先順序訊息插入隊首」的通用設計，也沒有強殺執行緒。Agent 的註釋說它「effectively immutable」，但 finalize_prompt(&mut self) 仍可更新構建時間並重新渲染 prompt，因此不能說成絕對不可變。"
 },
 {
  "g": 605,
  "type": "single",
  "q": "CompactionPolicy 的預設配置，下列哪組是正確的？",
  "opts": [
   "閾值 80%，memory flush 預設開啟，two-pass 預設開啟，牆鐘預算 600 秒",
   "閾值 85%，memory flush 預設關閉，two-pass 預設關閉，牆鐘預算 300 秒",
   "閾值 85%，memory flush 預設開啟，two-pass 預設關閉，牆鐘預算 300 秒",
   "閾值 90%，memory flush 預設關閉，two-pass 預設開啟，牆鐘預算 300 秒"
  ],
  "ans": 1,
  "exp": "Default 實現裡 auto_compact_threshold_percent 為 85、wall_clock_budget_secs 為 300，memory_flush_enabled 與 two_pass_enabled 均為 false，compact_model 為 None（未指定時用當前 Session 模型）。memory flush 與 two-pass 都是顯式開啟後才進入對應流程。"
 },
 {
  "g": 606,
  "type": "single",
  "q": "context_window 為 1,000、閾值為 85 時，exceeds_threshold 的判斷結果哪項正確？",
  "opts": [
   "used = 850 返回 false，必須嚴格大於 850 才觸發",
   "used = 849 與 850 都返回 true，因為浮點舍入會讓觸發點提前",
   "used = 850 返回 true，等號即觸發；used = 849 返回 false",
   "context_window 為 0 時返回 true，以最保守的方式強制壓縮"
  ],
  "ans": 2,
  "exp": "判斷使用整數飽和乘法交叉相乘：used × 100 >= context_window × threshold_percent，等於閾值時立即為 true，850 × 100 恰好等於 1000 × 85。整數運算避免了浮點舍入改變邊界；context_window 為 0 時函式直接返回 false。"
 },
 {
  "g": 607,
  "type": "single",
  "q": "關於 ToolKind::is_read_only() 的預設分類，下列哪項正確？",
  "opts": [
   "Task 屬於只讀分支，因為子任務本身並不直接修改檔案",
   "WebFetch 屬於非只讀分支，因為它會訪問外部網路產生副作用",
   "Task 位於 false 分支；Read、Search、WebFetch、AskUser 等位於 true 分支",
   "原始碼提供 TaskOutput 這個 kind，專門表示任務產物寫回"
  ],
  "ans": 2,
  "exp": "tool_taxonomy.rs 中 Read、Search、Lsp、ListDir、MemorySearch、WebSearch、WebFetch、EnterPlan、AskUser 等返回 true；Edit、Write、Execute、Task 等返回 false，Task 明確在 false 分支。原始碼中沒有 TaskOutput 這個 kind，Execute 的顯示標籤是 Run Command。"
 },
 {
  "g": 608,
  "type": "single",
  "q": "外部 Toolset preset 登錄檔中 Public 與 Internal 的差別，下列哪項正確？",
  "opts": [
   "Internal preset 無法透過任何方式解析，僅供 crate 內部單元測試使用",
   "Public 與 Internal 的核心差異是能否進入公開列舉；Internal 不進入 preset_names，但仍能按名稱解析",
   "Internal preset 註冊後會自動回寫到所有已經解析完成的 ToolServerConfig",
   "Public preset 需要管理員權限批准後才能被會話配置引用"
  ],
  "ans": 1,
  "exp": "登錄檔儲存「名稱到構建函式與可見性」的對映，visibility 只管列舉範圍：Public 進入 preset_names 與公開集合，Internal 不公開列舉但 toolset_for_preset 仍可按名解析。晚註冊不會回寫已解析的配置，只有後續解析才能查到新條目。"
 },
 {
  "g": 609,
  "type": "single",
  "q": "面對執行時發現的大量 MCP 工具，Grok Build 用什麼機制讓模型的工具列表跨輪次保持穩定？",
  "opts": [
   "把所有 MCP 工具定義全部注入 system prompt，讓模型自行挑選",
   "由 SearchTool 按 BM25 發現工具與 input_schema，再由固定入口 UseTool 攜帶 tool_name 與 tool_input 分發呼叫",
   "每發現一個新 MCP 工具就重啟會話，重建完整的工具登錄檔",
   "MCP 工具只能在會話啟動前靜態註冊，執行時發現的工具會被直接丟棄"
  ],
  "ans": 1,
  "exp": "SearchTool 在 ToolIndex 中按 BM25 檢索 MCP 工具，返回描述與 input_schema；UseTool 接收 tool_name（通常為 server__tool）與按 schema 構造的 tool_input，經 InnerDispatch 或 managed gateway 執行。兩個固定元工具讓大量 MCP 工具無須常駐提示詞。"
 },
 {
  "g": 610,
  "type": "single",
  "q": "記憶檢索過程中 query embedding 失敗，系統的行為是下列哪項？",
  "opts": [
   "整次搜尋立即報錯返回，提示使用者稍後重試",
   "記錄 warning 後傳入 None 繼續，FTS 候選仍進入合併流程，檢索降級為 FTS-only",
   "自動切換到備用 embedding provider 重試三次後才放棄",
   "跳過本次查詢前的髒檔案同步，直接返回上一次的快取結果"
  ],
  "ans": 1,
  "exp": "hybrid_search 中 embed_batch 報錯時只記錄 tracing::warn，把 query_embedding 置為 None 繼續走 hybrid_search_merge，FTS5 BM25 始終提供基礎候選。embedding 故障不等於整次搜尋失敗，這就是流水線的降級保障。"
 },
 {
  "g": 611,
  "type": "single",
  "q": "關於 Dream 記憶整理的觸發方式，下列哪項符合原始碼？",
  "opts": [
   "只要程序空閒就必然自動執行，無須任何配置",
   "原始碼支援會話結束與 /dream 命令觸發；預設 check_interval_secs 為 None，配置檢查間隔後 session actor 才做週期性門控檢查",
   "Dream 只能由使用者手動執行 /dream 命令觸發，會話結束不會進入門控",
   "子 Agent 會話結束時也會觸發 Dream，以便及時合併子任務記憶"
  ],
  "ans": 1,
  "exp": "入口有 session end、可選週期檢查與手動 /dream 三類，預設 check_interval_secs 為 None 代表不啟用週期檢查，因此不能概括為「空閒時必然自動執行」。觸發後還要過三道門控：enabled 預設 true、min_hours 預設 4、min_sessions 預設 3；子 Agent 會話直接跳過 Dream。"
 },
 {
  "g": 612,
  "type": "single",
  "q": "關於五種沙箱 Profile 的真實能力邊界，下列哪項正確？",
  "opts": [
   "workspace Profile 禁止讀取工作區以外的任何檔案",
   "strict Profile 連 workspace 也不可寫，是完全只讀的檔位",
   "strict 關閉全域預設讀並限制子程序網路，但 workspace 仍可寫；read-only 不可寫 workspace，卻保留 GROK_HOME 與臨時目錄等必要寫路徑",
   "off 可以作為 custom profile 的 extends 基類，用於從零開始定義規則"
  ],
  "ans": 2,
  "exp": "課程強調兩個易誤讀點：workspace 仍允許讀取工作區外檔案，strict 仍允許寫 workspace。read-only 保留執行所需的最小寫目錄。Profile 名稱只提供方向，真實邊界要看解析後的 capability set；off 接受別名 none，且不能作為 custom extends 的基類。"
 },
 {
  "g": 613,
  "type": "single",
  "q": "一個 PreToolUse Hook 程序超時未返回結果，這次工具呼叫會怎樣？",
  "opts": [
   "被阻斷，超時按最保守的拒絕處理",
   "一直掛起等待，直到 Hook 程序返回結果或使用者手動取消",
   "放行並記錄警告，Hook 自身執行失敗按 fail-open 處理",
   "轉交使用者彈窗確認，由使用者決定是否繼續執行"
  ],
  "ans": 2,
  "exp": "dispatcher 只在拿到明確 Deny（有效 JSON decision = deny，或無有效 JSON 且退出碼為 2）時阻斷；超時、崩潰、退出碼非 0 非 2、stdout 無效都歸入 HookRunResult::Failed，放行並記錄警告。原始碼註釋明確要求 Hook 故障不能破壞工具可用性，強制保證要靠權限層與沙箱。"
 },
 {
  "g": 614,
  "type": "single",
  "q": "關於子 Agent 的隔離與恢復，下列哪項符合原始碼？",
  "opts": [
   "SubagentIsolationMode 提供 None、Worktree、Sandbox 三種隔離模式",
   "IsolationMode 為 None 時，子 Agent 與父會話共享同一個上下文視窗",
   "SubagentIsolationMode 只有 None 與 Worktree 兩種；worktree 路徑被移除後若存在 snapshot_ref，可從持久 git ref 重新水化",
   "Resumed 恢復時允許請求方任意切換模型，以便用更強的模型繼續任務"
  ],
  "ans": 2,
  "exp": "列舉只有 None 與 Worktree，沒有 sandbox 成員。None 描述檔案工作空間隔離，子會話的上下文視窗依然獨立。恢復時優先複用 source worktree，路徑已移除且有 snapshot_ref 時可重建；請求中的 model override 會被軟忽略並 pin 到 source model。"
 },
 {
  "g": 615,
  "type": "multi",
  "q": "關於從工具請求到受限執行的完整授權鏈，下列哪些說法正確？（多選）",
  "opts": [
   "工具輸入先被解析成 AccessKind，攜帶路徑、命令或域名等細節，決策輸入比 ToolKind 更具體",
   "權限規則評估的優先順序為 deny 大於 ask 大於 allow，與規則來源順序無關",
   "只要沙箱處於 active 狀態，所有寫操作都會被自動批准，無須任何彈窗",
   "Bash 腳本會用 tree-sitter 分段，每個非 setup 段都要獨立透過檢查，防止 ls && rm 借首段放行",
   "權限層的 Allow 會同步擴大沙箱的 OS capability，兩層共享同一份能力表"
  ],
  "ans": [0, 1, 3],
  "exp": "授權鏈從 AccessKind 解析開始，途經 plan gate、hooks、策略規則與會話授權，規則優先順序固定為 deny > ask > allow。「沙箱內所有寫操作自動批准」是誤讀：sandbox fast path 專門檢查 Bash，且受 policy_forced_prompt 與 auto_forced_prompt 約束。權限層只決定「能否嘗試」，Allow 不會擴大沙箱的 OS capability。"
 },
 {
  "g": 616,
  "type": "multi",
  "q": "關於 Compaction 的 two-pass 機制，下列哪些說法正確？（多選）",
  "opts": [
   "two_pass_enabled 預設為 false，未顯式開啟時走 single-pass 路徑",
   "Pass 1 可在接近閾值時投機地在後臺總結歷史字首，產出 NOTE₁",
   "Pass 2 丟棄 NOTE₁，只對最近的對話尾部做一次快速摘要",
   "開啟 two-pass 後，正式壓縮會把 NOTE₁ 與 recent tail 組合後再次總結",
   "開啟 two-pass 會把自動壓縮閾值從 85% 下調到 70%，以便更早預熱"
  ],
  "ans": [0, 1, 3],
  "exp": "two-pass 是顯式配置能力：Pass 1 預先摘要歷史字首得到 NOTE₁，Pass 2 把 NOTE₁ 與近期尾部組合後再次總結，配置為 false 時保留原有 single-pass 路徑。開啟它改變的是壓縮路徑，不會修改 85% 這個預設觸發閾值，Pass 2 也不會丟棄 NOTE₁。"
 },
 {
  "g": 617,
  "type": "multi",
  "q": "關於記憶混合檢索流水線，下列哪些說法正確？（多選）",
  "opts": [
   "查詢開始前先同步 watcher 累積的髒 Markdown 路徑，重新索引新增或修改檔案，並刪除已移除檔案的舊 chunk",
   "合併分數經過時間衰減、來源權重與訪問增益調整；session 記憶按半衰期指數衰減，global 與 workspace 視為 evergreen",
   "MMR 多樣性重排預設開啟，lambda 固定為 0.7 且不可配置",
   "FTS5 BM25 與向量檢索必須同時可用，否則整條流水線拒絕執行",
   "MMR 是 opt-in 能力，MmrConfig 預設 enabled 為 false"
  ],
  "ans": [0, 1, 4],
  "exp": "sync-on-search 保證外部 Markdown 修改在下一次查詢前進入索引；打分先歸一化再按衰減、來源權重與訪問增益調整。MMR 預設關閉（enabled: false），0.7 的 lambda 只在顯式開啟後生效；向量路徑按可用性增強，FTS 始終提供基礎候選，二者並無「必須同時可用」的約束。"
 },
 {
  "g": 618,
  "type": "multi",
  "q": "關於 custom 沙箱 Profile 與平臺執行機制，下列哪些說法正確？（多選）",
  "opts": [
   "custom profile 預設從 workspace 開始，可以 extends 四種內建基類，但不能 extends off 或另一個 custom",
   "專案 .grok/sandbox.toml 宣告與全域同名的 profile 時，merge 使用 entry.or_insert，全域定義保持生效",
   "restrict_network 會一併切斷主程序網路，因此開啟後程序無法訪問模型 API",
   "沙箱 apply 失敗時程序立即退出，保證不會出現未受限的執行",
   "macOS 的 deny 透過 Seatbelt 規則實現，Linux 的子路徑 read-deny 還需要 bwrap bind-over"
  ],
  "ans": [0, 1, 4],
  "exp": "custom 的 extends 規則與 entry.or_insert 合併策略防止專案悄悄削弱同名全域策略。主程序網路保持開放以訪問模型 API，restrict_network 透過子程序過濾表達。平臺不支援或 apply 失敗時原始碼記錄警告並繼續執行，要用 is_active() 判斷沙箱是否實際生效，因此不能承諾「無法繞過」。"
 },
 {
  "g": 619,
  "type": "multi",
  "q": "關於 MCP 整合的工程細節，下列哪些說法正確？（多選）",
  "opts": [
   "工具註冊名由服務端名、保留分隔符 __ 與原始工具名組成，完整名稱要求恰好出現一次分隔符",
   "OAuth 憑據儲存在 $GROK_HOME/mcp_credentials.json，透過檔案鎖與原子儲存支援多程序併發寫入",
   "mcp_dispatcher 對每條狀態事件都立即推送 ACP 通知，以保證 UI 即時性",
   "移除 dead client 前會比較 client_id，舊連線遲到的斷線事件不會誤刪已替換的新客戶端",
   "stdio 與 HTTP 斷線採用完全相同的恢復策略，共用一個指數退避計時器"
  ],
  "ans": [0, 1, 3],
  "exp": "server__tool 命名讓兩個 Server 的同名工具擁有不同 ToolId；憑據走檔案鎖加原子儲存。狀態事件以 (server_name, event_kind) 為鍵在 50 ms tumbling window 內 last-write-wins 合併，高頻 tools/list_changed 最終只推一次。stdio 自動重啟用 1 秒、4 秒、16 秒的固定退避，HTTP 先嚐試客戶端內恢復且退避獨立，兩者策略不同。"
 },
 {
  "g": 620,
  "type": "judge",
  "q": "ToolKind::is_read_only() 返回 true 的工具會跳過權限檢查直接自動執行。",
  "ans": false,
  "exp": "is_read_only 只是工具種類層的預設副作用分類，具體工具還可以透過自己的中繼資料覆蓋它。是否最終執行要繼續經過命令規則、工作區權限、沙箱、Hook 與使用者互動批准等多層控制，只讀分類單獨推不出「自動執行」。"
 },
 {
  "g": 621,
  "type": "judge",
  "q": "estimate_tokens 的本地粗估使用 UTF-8 位元組長度除以 4，單張低解析度圖片的固定估值為 765 token。",
  "ans": true,
  "exp": "本地估算就是 bytes/4 的粗估，服務於請求前和工具輸出加入後的快速預測；單張低解析度圖片固定估為 765 token。它與服務端 usage 觀測是兩回事：百分比與閾值函式只處理呼叫方傳入的數值，不判斷資料來源。"
 },
 {
  "g": 622,
  "type": "judge",
  "q": "外掛根信任與 Hook 一樣採用 fail-open：外掛路徑解析失敗時預設視為可信，以保證外掛可用。",
  "ans": false,
  "exp": "兩者的失敗策略正好相反。外掛信任是 fail-closed：trust.rs 中 canonicalize 失敗直接返回 false，路徑解析失敗預設未信任，未信任外掛的 hooks、MCP servers 與 scripts 會被阻斷。fail-open 是 Hook 自身執行故障的策略，用於優先保證工具可用性。"
 },
 {
  "g": 623,
  "type": "judge",
  "q": "DreamLock 是最佳努力鎖，原始碼註釋明確它並非嚴格互斥，因此 Dream 的 consolidation 過程必須設計成可容忍重複執行。",
  "ans": true,
  "exp": ".dream-lock 儲存 PID 並用 mtime 兼作上次成功時間，寫後復讀只能降低競爭機率，仍可能有兩個程序都認為自己獲勝，所以 consolidation 必須冪等。配合寫入失敗 rollback、成功後才清理 session、索引只移除實際刪掉的路徑，共同構成失敗可恢復的設計。"
 },
 {
  "g": 624,
  "type": "judge",
  "q": "在與 Claude Code 的對照中，Claude 一側的結論基於對其內部原始碼實現的逆向分析。",
  "ans": false,
  "exp": "兩列證據解析度不同：Grok Build 一側可以下鑽原始碼，Claude Code 一側只記錄官方公開文件描述的可觀察行為，不推斷其內部實現，空白項刻意保留空白。這種證據分級正是本節要訓練的方法論。"
 },

 /* 题库扩容增补 */
 {
  "g": 625,
  "type": "single",
  "q": "課程把 Rust 選型的依據分成「原始碼事實」與「課程推斷」兩類。下列哪項屬於原始碼可驗證事實？",
  "opts": [
   "xAI 選擇 Rust 的首要目標是降低執行時記憶體佔用",
   "workspace.package 中 edition 設為 2024，workspace 依賴使用啟用 full feature 的 Tokio 1",
   "多執行緒 runtime 讓 Grok Build 在所有場景下都比同類產品更快",
   "強型別建模讓團隊的缺陷率下降到可量化的水平"
  ],
  "ans": 1,
  "exp": "課程列出的四條事實是 Rust 2024 edition、啟用 full feature 的 Tokio 1、廣泛用於邊界建模的強型別，以及 xai-grok-pager-bin 定義的 bin target。效能收益與組織動機沒有寫進原始碼，只能標為課程推斷並接受驗證。把合理解釋寫成 xAI 官方動機正是本節要避免的做法。"
 },
 {
  "g": 626,
  "type": "single",
  "q": "關於 Grok Build 裡兩級 Tokio runtime 的分工，下列哪項符合原始碼？",
  "opts": [
   "入口與 Session 共用同一個多執行緒 runtime，Session 只是其中一個普通 task",
   "入口構建多執行緒 runtime；每個 Session 在獨立 OS 執行緒上執行 current-thread runtime 與 LocalSet，執行緒棧設為 8 MB",
   "入口使用 current-thread runtime，Session 反過來升級為多執行緒 runtime 以提升工具併發",
   "Session 執行緒不建立自己的 runtime，直接複用呼叫方執行緒的執行器"
  ],
  "ans": 1,
  "exp": "入口用 tokio::runtime::Builder::new_multi_thread().enable_all() 構建 runtime；spawn_session_on_thread 用 std::thread::Builder 命名執行緒、設定 8 * 1024 * 1024 的棧，再建 current-thread runtime 與 LocalSet。兩級 runtime 讓會話狀態留在單執行緒內，配合 Actor 劃分避免跨執行緒共享。"
 },
 {
  "g": 627,
  "type": "single",
  "q": "關於 PromptContext 的可序列化能力與欄位來源，下列哪項正確？",
  "opts": [
   "它靠一組手寫的 to_json 與 from_json 方法完成序列化",
   "它的欄位清單由 TemplateRenderer 在執行時動態決定",
   "它的序列化能力來自 Serialize 與 Deserialize derive，欄位清單以結構體定義為準",
   "它只實現了 Serialize，無法從磁碟反序列化回來"
  ],
  "ans": 2,
  "exp": "結構體帶 Debug、Clone、Serialize、Deserialize 四個 derive，可序列化能力就來自 derive 本身，原始碼沒有額外定義專用 JSON 轉換方法。欄位以結構體定義為準，分為版本與模板、配置與身份、使用者執行環境三組。ToolBridge 與 TemplateRenderer 負責渲染，它們不改變欄位清單。"
 },
 {
  "g": 628,
  "type": "single",
  "q": "TemplateOverride 的真實變體與預設值，下列哪項正確？",
  "opts": [
   "只有 Default 與 Custom(String) 兩個變體，Default 指向標準 base template",
   "變體為 None、Codex、Custom(String)，其中 None 帶 #[default] 標註",
   "變體為 None、Codex、Subagent、Custom(String)，Subagent 用於緊湊模板",
   "變體只有 None 與 Codex，自訂模板要透過配置檔案路徑傳入"
  ],
  "ans": 1,
  "exp": "列舉定義為 None、Codex 與 Custom(String)，None 上帶 #[default]。取 None 時，Primary 使用標準 base template、Subagent 使用對應緊湊模板，緊湊模板由 audience 決定，列舉裡沒有 Subagent 這個變體。Codex 是註釋中定義的 apply-patch profile prompt template，Custom 由呼叫方給出完整模板字串。"
 },
 {
  "g": 629,
  "type": "single",
  "q": "關於 canonical fields 的清單，下列哪項正確？",
  "opts": [
   "共八個：path、offset、limit、command、description、cwd、directory、pattern",
   "共九個，另有 content 用於承載寫入內容",
   "共八個，其中 file_path 是讀取類工具的統一欄位名",
   "欄位清單由每個 harness 自行擴充套件，原始碼沒有固定常量"
  ],
  "ans": 0,
  "exp": "field 模組中的常量恰好是 path、offset、limit、command、description、cwd、directory、pattern 八個。原始碼中不存在 content 這個 canonical field，編輯前後文字與完整寫入內容屬於大欄位，留在 raw_input 裡。歸一化層把各 harness 的 file_path 等原始名對映到 path，因此 file_path 屬於原始輸入名。"
 },
 {
  "g": 630,
  "type": "single",
  "q": "關於 CanonicalToolMeta 的欄位與 input 的省略規則，下列哪項正確？",
  "opts": [
   "version 是字串 v1，input 為必填欄位",
   "七個欄位是 version、name、kind、namespace、label、read_only、input；version 是數字 1，沒有穩定投影時 input 會整體省略",
   "input 是 raw_input 的完整映象，任何工具參數都能在其中找到",
   "read_only 由呼叫方在每次呼叫時傳入，與工具分類無關"
  ],
  "ans": 1,
  "exp": "TOOL_META_VERSION 是 u32 型別的 1，結構體欄位恰好是 version、name、kind、namespace、label、read_only 與 input，其中 input 為 Option<serde_json::Value>。它是 canonical projection，grep flags、replace_all 這類非共享欄位可能被丟棄，完整原始輸入仍由 raw_input 承載。read_only 來自工具分類，不由呼叫方逐次傳入。"
 },
 {
  "g": 631,
  "type": "single",
  "q": "EffectiveRuntimeConfig 的真實欄位，下列哪項正確？",
  "opts": [
   "它包含 model、temperature、max_tokens 與 tools，用於覆蓋子會話的取樣參數",
   "它只儲存 persona 與 role_prompt，模型選擇完全交給父會話決定",
   "它包含 model、reasoning_effort、capability_mode、persona、persona_instructions、role_prompt、role_prompt_warning、role_name、persona_error 與 isolation",
   "它與 AgentDefinition 的欄位完全一致，只是換了個型別名"
  ],
  "ans": 2,
  "exp": "這十個欄位就是解析結果的全部內容，原始碼中沒有 temperature、max_tokens 或 tools。role_prompt_warning 與 persona_error 專門承載軟降級與失敗關閉的診斷資訊。AgentDefinition 是另一層結構，負責 prompt_mode、tool_config、capability_mode、permission_mode、tools、isolation、model 等 Agent 骨架。"
 },
 {
  "g": 632,
  "type": "single",
  "q": "spawn 只指定了 persona=reviewer，role 給出 model=A 與 capability=read-only，Persona 給出 model=B。按合併優先順序，最終 model 與 capability_mode 是哪一組？",
  "opts": [
   "model=B，capability=read-only，Persona 的執行時預設值優先順序最高",
   "model=A，capability=read-only，model 命中 role 預設值，capability 不讀取 Persona",
   "model=A，capability 為空，capability 只能由 spawn 顯式給出",
   "model 為空，capability=read-only，未由 spawn 指定的 model 一律回落到父會話"
  ],
  "ans": 1,
  "exp": "優先順序逐欄位級聯：spawn override 高於 role default，role default 高於 persona default，都未命中才保留 None 交給下游繼承。本例 spawn 沒有指定 model，role 的 A 先於 Persona 的 B 命中。Persona 只提供 model、reasoning 與 isolation，不提供 capability_mode，因此 capability 取 role 的 read-only。"
 },
 {
  "g": 633,
  "type": "single",
  "q": "子 Agent 解析時 Persona 的 instructions file 讀取失敗，與 role 的 prompt_file 讀取失敗，兩者結果有什麼差別？",
  "opts": [
   "兩者都只寫 warning 並繼續，子 Agent 照常建立",
   "兩者都中止建立，因為提示詞缺失會讓子會話行為不可控",
   "Persona 失敗寫入 persona_error 並被 spawn 側中止建立；role prompt 失敗只產生 role_prompt_warning，其餘欄位繼續解析",
   "Persona 失敗自動回退到預設 Persona，role prompt 失敗才中止建立"
  ],
  "ans": 2,
  "exp": "Persona 採用失敗關閉：請求了 Persona 後找不到、內容為空或讀取檔案失敗都會寫入 persona_error，檔案 I/O 失敗還會提前返回預設化結果，spawn 側看到錯誤後中止建立。role prompt 採用軟降級，讀取失敗只記 role_prompt_warning，model、reasoning、capability 與 isolation 仍繼續解析。區分這兩條策略正是本節的重點。"
 },
 {
  "g": 634,
  "type": "single",
  "q": "關於 SubagentCoordinator 的啟動方式與並行能力，下列哪項符合原始碼？",
  "opts": [
   "start_subagent_coordinator 只啟動一次 drain task，每個 Spawn 事件再進入 spawn_local 啟動本地非同步任務",
   "每收到一個 Spawn 事件就啟動一個新的 drain task，用來隔離該子 Agent 的事件流",
   "協調器序列執行子 Agent，同一時刻只允許一個子任務在跑",
   "並行子 Agent 的數量上限等於已定義的 Persona 數量"
  ],
  "ans": 0,
  "exp": "drain task 只啟動一次，迴圈 recv 事件並按 Spawn、Query、Cancel、ListActive、Completions 等變體分派。並行能力來自 spawn_local 出來的非同步任務，與 Persona 數量無關。協調器負責登記 pending、active 與 completed 狀態，並淘汰過期的 completed 記錄。"
 },
 {
  "g": 635,
  "type": "single",
  "q": "關於外掛的來源優先順序與啟用預設值，下列哪項正確？",
  "opts": [
   "所有來源發現到的外掛預設都進入 enabled 列表，使用者需要手動關閉",
   "CLI override 優先順序最高；專案與使用者範圍預設加入 disabled 列表，CLI override 與 config path 預設加入 enabled",
   "專案 .grok/plugins 的優先順序高於 CLI override，因為專案配置更貼近當前倉庫",
   "啟用狀態由 plugin.json 中的欄位宣告，發現配置不參與判斷"
  ],
  "ans": 1,
  "exp": "來源順序為 CLI override、專案 .grok/plugins、使用者 $GROK_HOME/plugins、registry provenance 與配置 paths，其中 CLI override 優先順序最高。發現配置維護 enabled 與 disabled 兩個列表，專案或使用者範圍預設進 disabled，CLI override 與 config path 預設進 enabled，使用者仍可顯式調整。可發現、已安裝、已啟用、受信任是四種獨立狀態。"
 },
 {
  "g": 636,
  "type": "single",
  "q": "關於 Marketplace 掃描與外掛 manifest 的解析，下列哪項符合原始碼？",
  "opts": [
   "掃描器只讀 plugin-index.json，索引缺失時直接返回空目錄",
   "manifest 必須位於外掛根目錄的 plugin.json，其他位置一律忽略",
   "掃描器先讀索引，缺失或無效時掃描 plugins/*/；plugin.json 是首選 manifest，.grok-plugin 與 .claude-plugin 下的同名檔案是後備位置",
   "manifest 宣告的路徑可以指向外掛根目錄以外，用於複用共享元件"
  ],
  "ans": 2,
  "exp": "索引優先加檔案系統回退是發現鏈的基本形態，default-skills 還能作為虛擬外掛加入結果。manifest 有一個首選位置與兩個後備位置，PluginManifest 可覆蓋 skills、commands、agents、hooks、MCP 與 LSP 路徑。解析之後原始碼還要驗證這些路徑仍包含在外掛根目錄內，越界路徑會被拒絕。"
 },
 {
  "g": 637,
  "type": "single",
  "q": "結課設計工作臺的 100 分評審量表中，分值最高的一項是哪個？",
  "opts": [
   "邊界與 ADR，佔 20 分",
   "合約與狀態機，佔 20 分",
   "安全與恢復，佔 25 分",
   "演示與證據，佔 15 分"
  ],
  "ans": 2,
  "exp": "量表為邊界與 ADR 20 分、合約與狀態機 20 分、安全與恢復 25 分、測試與可觀測 20 分、演示與證據 15 分，安全與恢復權重最高。這與九維決策卡的取向一致：失敗路徑和信任邊界比功能清單更能體現完成度。量表另設四條否決項，任一命中即不透過。"
 },
 {
  "g": 638,
  "type": "single",
  "q": "一次顯式 resume 請求中，source transcript 已經佔到目標模型上下文視窗的 90%。系統會怎麼處理？",
  "opts": [
   "先對 transcript 自動做一次壓縮，再繼續恢復",
   "拒絕恢復，原始碼在 transcript 超過目標模型上下文視窗 80% 時就不再繼續",
   "照常恢復，超出部分在第一輪取樣時由服務端截斷",
   "降級為 ContextSource::New，丟棄歷史後繼續執行任務"
  ],
  "ans": 1,
  "exp": "恢復限制裡明確寫了 80% 這條線，超過即拒絕恢復。複製 transcript 或讀取失敗時，顯式 resume 同樣失敗關閉。恢復會複製 tool state，不復制 plan state、plan mode state 與 signals，因此恢復並不等於對原會話的完整克隆。"
 },
 {
  "g": 639,
  "type": "single",
  "q": "一個 MCP 工具完成註冊後，決定它能否出現在模型工具列表裡的是哪一項？",
  "opts": [
   "只要服務端在 tools/list 中返回它，模型就一定能看到",
   "由 model_visible 決定；被禁用的工具存入 disabled_tool_registrations，帶 ui.resourceUri 的工具可單獨走 UI 通知",
   "由 BM25 索引的命中分數決定，分數過低的工具會被隱藏",
   "由 mcp_initialized 決定，該標誌為 true 時全部工具進入模型側"
  ],
  "ans": 1,
  "exp": "發現與可見性是兩件事：註冊後要 model_visible 為真才進入模型側 Tool Bridge，禁用工具落進 disabled_tool_registrations，帶 ui.resourceUri 的工具面向 App 一側。BM25 索引服務於 search_tool 的檢索，mcp_initialized 只告訴搜尋層能力發現是否完成，兩者都不充當可見性開關。"
 },
 {
  "g": 640,
  "type": "single",
  "q": "原始碼列舉的 15 個 Hook 事件中，哪一類事件具備阻斷主流程的能力？",
  "opts": [
   "PreToolUse、PostToolUse 與 PermissionDenied 三個事件",
   "所有帶 Pre 字首的事件，包括 PreToolUse 與 PreCompact",
   "只有 PreToolUse，它的 is_blocking() 為真",
   "全部 15 個事件都能透過返回 deny 阻斷後續流程"
  ],
  "ans": 2,
  "exp": "事件列舉負責定義觸發點，is_blocking() 單獨宣告阻斷能力，其中只有 PreToolUse 為真。PreCompact、PostToolUse、PermissionDenied 等事件會被觸發並收到信封，卻無法讓主流程停下。讀事件列表時要同時追蹤結果如何回到呼叫方，「事件被觸發」推不出「能控制主流程」。"
 },
 {
  "g": 641,
  "type": "multi",
  "q": "關於 canonical input 這層穩定投影，下列哪些說法正確？（多選）",
  "opts": [
   "它的目的是讓展示、遙測和跨工具分析擁有共同詞彙，不同 harness 的原始參數名可以各不相同",
   "投影可能丟棄欄位，grep flags 與 replace_all 這類非共享欄位不一定出現在 input 中",
   "編輯前後文字與完整寫入內容會完整保留在 input 裡，便於回放整次呼叫",
   "沒有穩定投影可寫時，input 會整體省略",
   "啟用 canonical 投影後 raw_input 就不再儲存，以避免重複儲存"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "canonical 層追求跨 harness 的公共語義，因此只保留少量穩定、輕量的欄位。大欄位與非共享欄位被排除在投影外，完整原始輸入仍由 raw_input 承載，兩者並存。input 是 Option 型別，沒有可寫內容時整體省略，所以它不能當作 raw input 的映象來讀。"
 },
 {
  "g": 642,
  "type": "multi",
  "q": "關於 Grok Build 的多 Agent 組織方式，下列哪些說法正確？（多選）",
  "opts": [
   "定義層由 AgentDefinition 與 Persona 組成，前者給出 prompt、工具、權限、模型與可 spawn 型別等合同",
   "協調層的事件包含 Spawn、Query、Cancel、ListActive、Completions 與 Outstanding",
   "Query 只能返回即時快照，無法等待子 Agent 完成",
   "Completions 會 drain 待通知的完成項，並按 suppress_ids 過濾",
   "課程把 Coordinator 與 Swarm 都當作 Claude Code 原始碼中的內部型別，用於對照兩邊的排程實現"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "定義層負責子 Agent 的可觀察身份與能力邊界，協調層用事件管理其生命週期。Query 既可以立即返回快照，也可以註冊 block wait slot 並輪詢狀態，因此它並非只支援快照。Claude 一側只使用公開行為，課程明確不把 Coordinator 或 Swarm 當作它的原始碼內部型別，也不推斷其排程器實現。"
 },
 {
  "g": 643,
  "type": "multi",
  "q": "關於外掛從可見走向可執行的三道門與證據邊界，下列哪些說法正確？（多選）",
  "opts": [
   "MarketplaceRelativePath 拒絕絕對路徑、父目錄穿越與越界 join，遠端條目可用 git ref 或 SHA 定位內容",
   "信任粒度是整個 marketplace 來源，同一來源安裝的外掛共享一條信任記錄",
   "未信任外掛的 skills 與 agents 仍可列出中繼資料，hooks、MCP servers 與 scripts 則被阻斷",
   "位於使用者 home 下的 config path 也必須逐個顯式信任，原始碼不提供任何自動信任路徑",
   "當前原始碼能證明官方源常量、多個來源、目錄索引與安裝流程，卻無法單獨證明外掛數量、活躍作者與稽核覆蓋率"
  ],
  "ans": [
   0,
   2,
   4
  ],
  "exp": "路徑約束、啟用狀態與執行信任是三道獨立的門。信任粒度是單個外掛根，專案外掛按 canonical plugin root 授權，記錄寫入 ~/.grok/trusted-plugins。CLI override 與使用者範圍在原始碼中標記為 trusted，config path 位於使用者 home 下時可自動信任，其他位置仍需授權。機制可證明，生態規模不可證明，這條證據邊界同樣要寫清楚。"
 },
 {
  "g": 644,
  "type": "multi",
  "q": "關於五種內建沙箱 Profile 的具體能力，下列哪些說法正確？（多選）",
  "opts": [
   "workspace 是預設 Profile，default_read 為 true 且不限制子程序網路",
   "devbox 列舉根目錄並廣泛授予寫權限，但 /data 保持可讀，在 Linux 透過 bwrap 做防寫",
   "read-only 的 restrict_network 為 true，workspace 不可寫，GROK_HOME 與臨時目錄仍可寫",
   "strict 的 default_read 為 true，它與 workspace 的差別只是多了幾條 deny 規則",
   "off 會跳過 capability set 應用並記錄一條 Sandbox disabled，它不接受任何別名"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "前三項分別對應 workspace、devbox 與 read-only 在原始碼裡的 capability 描述，注意 read-only 保留了執行所需的最小寫目錄。strict 的關鍵差異是關閉全域預設讀，只開放系統執行目錄與 workspace，所以 default_read 為 false。off 除了跳過應用並記錄 Sandbox disabled，還接受別名 none，同時不能作為 custom extends 的基類。"
 },
 {
  "g": 645,
  "type": "multi",
  "q": "關於 Dream 的執行邊界與清理規則，下列哪些說法正確？（多選）",
  "opts": [
   "構建訊息時有 32K 的輸入上限，模型呼叫設有 30 分鐘超時",
   "模型返回空、NO_REPLY 或沒有 Markdown 標題時，既不寫入也不刪除 session",
   "只要模型呼叫成功返回，就可以立即清理本次讀取的全部 session 檔案",
   "寫 MEMORY.md 失敗時呼叫 rollback(prior) 恢復舊鎖狀態",
   "搜尋索引會整體重建，把所有歷史 session 的 chunk 一併清空"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "32K 輸入上限與 30 分鐘超時是流程中標註的真實約束。成功邊界決定清理邊界：寫入成功之後才清理已讀取的 session，且 5 分鐘內仍活躍的檔案會跳過，所以清理不以模型返回成功為準。索引只移除實際刪掉的路徑，再為新的 MEMORY.md 重建索引與 embedding。"
 },
 {
  "g": 646,
  "type": "judge",
  "q": "「入口建立 Tokio 多執行緒 runtime」有倉庫直接證據，「xAI 為降低記憶體佔用而選擇 Rust」缺少倉庫直接證據，只能標為課程推斷。",
  "ans": true,
  "exp": "前者能在入口原始碼裡讀到 new_multi_thread().enable_all() 的構建呼叫，屬於原始碼事實。後者涉及技術選型的組織動機，原始碼沒有任何記錄，課程只給出基於程式碼形態的解釋，並註明它不代表 xAI 官方披露的原因。給每條結論貼上證據標籤正是本節的訓練目標。"
 },
 {
  "g": 647,
  "type": "judge",
  "q": "結課評審量表把「引用原始碼時無法給出檔案路徑」列為否決項。",
  "ans": true,
  "exp": "四條否決項分別是提交物未說明敏感資料落點、高風險工具缺少權限路徑、崩潰後聲稱可恢復但沒有測試，以及引用原始碼時無法給出檔案路徑。它與九維決策卡上的原始碼錨點要求一致：每個設計決定都要能回到一個真實分支，方案也要寫清無法讀取策略、無法解析結果、無法恢復 checkpoint 時的失敗預設值。"
 },
 {
  "g": 648,
  "type": "judge",
  "q": "README 宣告 macOS、Linux 與 Windows 都是受支援的構建主機。",
  "ans": false,
  "exp": "README 只把 macOS 與 Linux 列為受支援的構建主機，Windows 構建屬於 best-effort，並且當前未從此原始碼樹測試過。這條限制與週期同步、不接收外部補丁、根 Cargo 由生成流程產出共同構成公開倉庫的邊界，讀原始碼時要把倉庫邊界與產品能力分開陳述。"
 },
 {
  "g": 649,
  "type": "judge",
  "q": "exceeds_threshold_with_headroom 會在百分比閾值前預留固定 token 空間把觸發點提前，並且 context_window 為 0 時仍返回 false。",
  "ans": true,
  "exp": "該函式在視窗乘閾值的結果上做 saturating_sub，減去 headroom 乘 100，因此觸發點比純百分比更早。視窗 100,000、閾值 85%、headroom 4,000 時會提前到 81,000 觸發。視窗為 0 的短路分支與 exceeds_threshold 保持一致，都直接返回 false。"
 },
 {
  "g": 650,
  "type": "judge",
  "q": "xai-grok-tools 的 namespace 列舉只覆蓋內建實現族，執行時發現的 MCP 工具不在這個列舉中。",
  "ans": false,
  "exp": "namespace 列舉除了 grok_build、grok_build_concise、grok_build_hashline、codex、opencode 以及 memory、lsp、skills 這些內建實現族，還包含 MCP，專門用於執行時外部工具。ToolBridge 的 register_mcp_tools 會把 MCP 工具連同 input_schema 一起註冊進 registry，它們與內建工具共享同一套註冊與分發路徑。"
 }
];

window.EXAM_TOPICS_PART = {
 "601": {"name": "工作區成員與主軸", "file": "12-1.html"},
 "602": {"name": "三大Actor分工", "file": "12-4.html"},
 "603": {"name": "入口與執行分支", "file": "12-3.html"},
 "604": {"name": "取消邊界與不可變", "file": "12-4.html"},
 "605": {"name": "壓縮策略預設值", "file": "12-5.html"},
 "606": {"name": "閾值等號邊界", "file": "12-11.html"},
 "607": {"name": "工具只讀預設值", "file": "12-8.html"},
 "608": {"name": "預設註冊可見性", "file": "12-7.html"},
 "609": {"name": "動態MCP元工具", "file": "12-9.html"},
 "610": {"name": "檢索降級策略", "file": "12-12.html"},
 "611": {"name": "記憶整理觸發門控", "file": "12-13.html"},
 "612": {"name": "沙箱五種檔位", "file": "12-17.html"},
 "613": {"name": "鉤子失敗語義", "file": "12-19.html"},
 "614": {"name": "子Agent隔離恢復", "file": "12-15.html"},
 "615": {"name": "工具授權鏈路", "file": "12-18.html"},
 "616": {"name": "兩段式壓縮機制", "file": "12-5.html"},
 "617": {"name": "混合檢索流水線", "file": "12-12.html"},
 "618": {"name": "自訂沙箱規則", "file": "12-17.html"},
 "619": {"name": "MCP工程細節", "file": "12-20.html"},
 "620": {"name": "只讀與審批邊界", "file": "12-8.html"},
 "621": {"name": "Token本地估算", "file": "12-11.html"},
 "622": {"name": "外掛信任邊界", "file": "12-23.html"},
 "623": {"name": "夢境鎖與冪等", "file": "12-13.html"},
 "624": {"name": "對照證據口徑", "file": "12-22.html"},
 "625": {"name": "事實與推斷分界", "file": "12-2.html"},
 "626": {"name": "兩級執行時邊界", "file": "12-4.html"},
 "627": {"name": "上下文序列化來源", "file": "12-6.html"},
 "628": {"name": "模板覆蓋三變體", "file": "12-6.html"},
 "629": {"name": "歸一化欄位清單", "file": "12-10.html"},
 "630": {"name": "中繼資料合約版本", "file": "12-10.html"},
 "631": {"name": "有效執行時欄位", "file": "12-14.html"},
 "632": {"name": "逐欄位合併優先順序", "file": "12-14.html"},
 "633": {"name": "人格失敗關閉", "file": "12-14.html"},
 "634": {"name": "協調器啟動方式", "file": "12-16.html"},
 "635": {"name": "外掛來源與啟用", "file": "12-21.html"},
 "636": {"name": "目錄掃描與清單", "file": "12-21.html"},
 "637": {"name": "結課評審權重", "file": "12-24.html"},
 "638": {"name": "恢復的上下文上限", "file": "12-15.html"},
 "639": {"name": "工具模型可見性", "file": "12-20.html"},
 "640": {"name": "鉤子阻斷能力", "file": "12-19.html"},
 "641": {"name": "穩定投影取捨", "file": "12-10.html"},
 "642": {"name": "多Agent協調層", "file": "12-16.html"},
 "643": {"name": "外掛三道門檻", "file": "12-21.html"},
 "644": {"name": "沙箱檔位能力差異", "file": "12-17.html"},
 "645": {"name": "夢境成功邊界", "file": "12-13.html"},
 "646": {"name": "選型證據分級", "file": "12-2.html"},
 "647": {"name": "結課評審否決項", "file": "12-24.html"},
 "648": {"name": "構建主機邊界", "file": "12-23.html"},
 "649": {"name": "預留空間閾值", "file": "12-11.html"},
 "650": {"name": "名稱空間覆蓋面", "file": "12-9.html"}
};
