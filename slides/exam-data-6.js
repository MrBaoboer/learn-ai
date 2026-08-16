/* Grok Build 专题自测题库（24 题：单选 14 / 多选 5 / 判断 5）
   g=考点组编号（本卷使用 601-624），exp=答案解析
   注：文件名沿用 exam-data-6 是为了不打断学员的历史成绩与薄弱点记录。
   Grok Build 已从原协作方法论篇降级为选修专题，Vibe Coding（exam-data-7）补位，即现在的协作方法论篇。 */
window.EXAM_BANK = [
 {
  "g": 601,
  "type": "single",
  "q": "根 Cargo.toml 显示 Grok Build 的 workspace 共有 79 个成员。关于这套源码的组织方式，下列哪项符合课程内容？",
  "opts": [
   "79 个成员平均分布在入口、界面、工具、基础设施四个顶层目录，每个目录约 20 个 crate",
   "主体的 62 个成员集中在 crates/codegen/ 下，阅读时沿组合入口、TUI、Shell 宿主、领域能力、推理与状态五条主轴展开",
   "79 个成员全部是可独立发布的二进制程序，产品通过进程间通信把它们组合起来",
   "根 Cargo.toml 由维护者手工维护，任何 crate 的增删都需要人工同步成员清单"
  ],
  "ans": 1,
  "exp": "79 个成员是 workspace 事实，其中 62 个集中在 crates/codegen/，另有 build、common、prod 与 third_party。课程强调用五条主轴阅读，避免套用虚构的四层目录。根 Cargo.toml 首行注明它是自动生成的 workspace root，并非手工维护。"
 },
 {
  "g": 602,
  "type": "single",
  "q": "Session 运行时里三个核心 Actor 的分工，下列哪项描述正确？",
  "opts": [
   "SessionActor 直接持有 conversation 与 token 状态，ChatStateActor 只负责把状态持久化到磁盘",
   "SessionActor 负责 turn 编排，ChatStateActor 专属拥有对话与 token 状态，SamplerActor 负责模型请求与流式事件",
   "SamplerActor 拥有完整对话历史，因为它需要全部上下文才能发起采样请求",
   "三个 Actor 通过共享内存锁并发读写同一份会话状态，以减少消息传递开销"
  ],
  "ans": 1,
  "exp": "SessionActor 通过 run_session 接收命令与事件并推进 turn loop；ChatStateActor 专属拥有 conversation、token、配置与 persistence，经 mpsc 串行处理命令，没有共享锁；SamplerActor 为请求创建流式采样任务。状态各有唯一拥有者是这套 Actor 设计的关键。"
 },
 {
  "g": 603,
  "type": "single",
  "q": "关于 Grok Build 的真实程序入口与运行分支，下列哪项正确？",
  "opts": [
   "TUI、headless、stdio Agent、leader 各自拥有独立的 main 二进制，没有统一入口",
   "真实入口是 xai-grok-shell 的 run_leader，其余模式都从 leader 进程再分发",
   "真实入口位于 xai-grok-pager-bin/src/main.rs，由它分发 headless、stdio Agent、leader 与交互 TUI 四种分支",
   "入口在 xai-grok-sampler 中，先建立模型连接，再启动界面与会话宿主"
  ],
  "ans": 2,
  "exp": "同一个组合入口 main() 解析命令与交互模式：run_headless 进入无头宿主、run_stdio_agent 走 ACP stdio、run_leader 承载长生命周期 Agent、默认交互分支进入 pager 的 app::run。随后由 connect_or_spawn、MvpAgent、spawn_session_on_thread 一路走到 SessionActor 与 SamplerActor。"
 },
 {
  "g": 604,
  "type": "single",
  "q": "关于会话的取消机制与 Agent 的可变性，下列哪项符合源码事实？",
  "opts": [
   "取消通过高优先级消息插入队首实现，能立即抢占正在执行的工具调用",
   "取消依靠 CancellationToken 驱动协作式收尾，全部 handle 被丢弃也会结束 Actor 循环；Agent 构建后有效不可变，但保留 finalize_prompt 显式重渲染入口",
   "Agent 构建后绝对不可变，包括 system prompt 在内的任何字段都无法再更新",
   "取消由操作系统直接终止 Session 线程完成，无须 Actor 协作配合"
  ],
  "ans": 1,
  "exp": "取消是协作式的：CancellationToken 触发退出，handle 全部丢弃也会结束循环，源码没有「高优先级消息插入队首」的通用设计，也没有强杀线程。Agent 的注释说它「effectively immutable」，但 finalize_prompt(&mut self) 仍可更新构建时间并重新渲染 prompt，因此不能说成绝对不可变。"
 },
 {
  "g": 605,
  "type": "single",
  "q": "CompactionPolicy 的默认配置，下列哪组是正确的？",
  "opts": [
   "阈值 80%，memory flush 默认开启，two-pass 默认开启，墙钟预算 600 秒",
   "阈值 85%，memory flush 默认关闭，two-pass 默认关闭，墙钟预算 300 秒",
   "阈值 85%，memory flush 默认开启，two-pass 默认关闭，墙钟预算 300 秒",
   "阈值 90%，memory flush 默认关闭，two-pass 默认开启，墙钟预算 300 秒"
  ],
  "ans": 1,
  "exp": "Default 实现里 auto_compact_threshold_percent 为 85、wall_clock_budget_secs 为 300，memory_flush_enabled 与 two_pass_enabled 均为 false，compact_model 为 None（未指定时用当前 Session 模型）。memory flush 与 two-pass 都是显式开启后才进入对应流程。"
 },
 {
  "g": 606,
  "type": "single",
  "q": "context_window 为 1,000、阈值为 85 时，exceeds_threshold 的判断结果哪项正确？",
  "opts": [
   "used = 850 返回 false，必须严格大于 850 才触发",
   "used = 849 与 850 都返回 true，因为浮点舍入会让触发点提前",
   "used = 850 返回 true，等号即触发；used = 849 返回 false",
   "context_window 为 0 时返回 true，以最保守的方式强制压缩"
  ],
  "ans": 2,
  "exp": "判断使用整数饱和乘法交叉相乘：used × 100 >= context_window × threshold_percent，等于阈值时立即为 true，850 × 100 恰好等于 1000 × 85。整数运算避免了浮点舍入改变边界；context_window 为 0 时函数直接返回 false。"
 },
 {
  "g": 607,
  "type": "single",
  "q": "关于 ToolKind::is_read_only() 的默认分类，下列哪项正确？",
  "opts": [
   "Task 属于只读分支，因为子任务本身并不直接修改文件",
   "WebFetch 属于非只读分支，因为它会访问外部网络产生副作用",
   "Task 位于 false 分支；Read、Search、WebFetch、AskUser 等位于 true 分支",
   "源码提供 TaskOutput 这个 kind，专门表示任务产物写回"
  ],
  "ans": 2,
  "exp": "tool_taxonomy.rs 中 Read、Search、Lsp、ListDir、MemorySearch、WebSearch、WebFetch、EnterPlan、AskUser 等返回 true；Edit、Write、Execute、Task 等返回 false，Task 明确在 false 分支。源码中没有 TaskOutput 这个 kind，Execute 的显示标签是 Run Command。"
 },
 {
  "g": 608,
  "type": "single",
  "q": "外部 Toolset preset 注册表中 Public 与 Internal 的差别，下列哪项正确？",
  "opts": [
   "Internal preset 无法通过任何方式解析，仅供 crate 内部单元测试使用",
   "Public 与 Internal 的核心差异是能否进入公开枚举；Internal 不进入 preset_names，但仍能按名称解析",
   "Internal preset 注册后会自动回写到所有已经解析完成的 ToolServerConfig",
   "Public preset 需要管理员权限批准后才能被会话配置引用"
  ],
  "ans": 1,
  "exp": "注册表保存「名称到构建函数与可见性」的映射，visibility 只管枚举范围：Public 进入 preset_names 与公开集合，Internal 不公开枚举但 toolset_for_preset 仍可按名解析。晚注册不会回写已解析的配置，只有后续解析才能查到新条目。"
 },
 {
  "g": 609,
  "type": "single",
  "q": "面对运行时发现的大量 MCP 工具，Grok Build 用什么机制让模型的工具列表跨轮次保持稳定？",
  "opts": [
   "把所有 MCP 工具定义全部注入 system prompt，让模型自行挑选",
   "由 SearchTool 按 BM25 发现工具与 input_schema，再由固定入口 UseTool 携带 tool_name 与 tool_input 分发调用",
   "每发现一个新 MCP 工具就重启会话，重建完整的工具注册表",
   "MCP 工具只能在会话启动前静态注册，运行时发现的工具会被直接丢弃"
  ],
  "ans": 1,
  "exp": "SearchTool 在 ToolIndex 中按 BM25 检索 MCP 工具，返回描述与 input_schema；UseTool 接收 tool_name（通常为 server__tool）与按 schema 构造的 tool_input，经 InnerDispatch 或 managed gateway 执行。两个固定元工具让大量 MCP 工具无须常驻提示词。"
 },
 {
  "g": 610,
  "type": "single",
  "q": "记忆检索过程中 query embedding 失败，系统的行为是下列哪项？",
  "opts": [
   "整次搜索立即报错返回，提示用户稍后重试",
   "记录 warning 后传入 None 继续，FTS 候选仍进入合并流程，检索降级为 FTS-only",
   "自动切换到备用 embedding provider 重试三次后才放弃",
   "跳过本次查询前的脏文件同步，直接返回上一次的缓存结果"
  ],
  "ans": 1,
  "exp": "hybrid_search 中 embed_batch 报错时只记录 tracing::warn，把 query_embedding 置为 None 继续走 hybrid_search_merge，FTS5 BM25 始终提供基础候选。embedding 故障不等于整次搜索失败，这就是流水线的降级保障。"
 },
 {
  "g": 611,
  "type": "single",
  "q": "关于 Dream 记忆整理的触发方式，下列哪项符合源码？",
  "opts": [
   "只要进程空闲就必然自动运行，无须任何配置",
   "源码支持会话结束与 /dream 命令触发；默认 check_interval_secs 为 None，配置检查间隔后 session actor 才做周期性门控检查",
   "Dream 只能由用户手动执行 /dream 命令触发，会话结束不会进入门控",
   "子 Agent 会话结束时也会触发 Dream，以便及时合并子任务记忆"
  ],
  "ans": 1,
  "exp": "入口有 session end、可选周期检查与手动 /dream 三类，默认 check_interval_secs 为 None 代表不启用周期检查，因此不能概括为「空闲时必然自动运行」。触发后还要过三道门控：enabled 默认 true、min_hours 默认 4、min_sessions 默认 3；子 Agent 会话直接跳过 Dream。"
 },
 {
  "g": 612,
  "type": "single",
  "q": "关于五种沙箱 Profile 的真实能力边界，下列哪项正确？",
  "opts": [
   "workspace Profile 禁止读取工作区以外的任何文件",
   "strict Profile 连 workspace 也不可写，是完全只读的档位",
   "strict 关闭全局默认读并限制子进程网络，但 workspace 仍可写；read-only 不可写 workspace，却保留 GROK_HOME 与临时目录等必要写路径",
   "off 可以作为 custom profile 的 extends 基类，用于从零开始定义规则"
  ],
  "ans": 2,
  "exp": "课程强调两个易误读点：workspace 仍允许读取工作区外文件，strict 仍允许写 workspace。read-only 保留运行所需的最小写目录。Profile 名称只提供方向，真实边界要看解析后的 capability set；off 接受别名 none，且不能作为 custom extends 的基类。"
 },
 {
  "g": 613,
  "type": "single",
  "q": "一个 PreToolUse Hook 进程超时未返回结果，这次工具调用会怎样？",
  "opts": [
   "被阻断，超时按最保守的拒绝处理",
   "一直挂起等待，直到 Hook 进程返回结果或用户手动取消",
   "放行并记录警告，Hook 自身执行失败按 fail-open 处理",
   "转交用户弹窗确认，由用户决定是否继续执行"
  ],
  "ans": 2,
  "exp": "dispatcher 只在拿到明确 Deny（有效 JSON decision = deny，或无有效 JSON 且退出码为 2）时阻断；超时、崩溃、退出码非 0 非 2、stdout 无效都归入 HookRunResult::Failed，放行并记录警告。源码注释明确要求 Hook 故障不能破坏工具可用性，强制保证要靠权限层与沙箱。"
 },
 {
  "g": 614,
  "type": "single",
  "q": "关于子 Agent 的隔离与恢复，下列哪项符合源码？",
  "opts": [
   "SubagentIsolationMode 提供 None、Worktree、Sandbox 三种隔离模式",
   "IsolationMode 为 None 时，子 Agent 与父会话共享同一个上下文窗口",
   "SubagentIsolationMode 只有 None 与 Worktree 两种；worktree 路径被移除后若存在 snapshot_ref，可从持久 git ref 重新水化",
   "Resumed 恢复时允许请求方任意切换模型，以便用更强的模型继续任务"
  ],
  "ans": 2,
  "exp": "枚举只有 None 与 Worktree，没有 sandbox 成员。None 描述文件工作空间隔离，子会话的上下文窗口依然独立。恢复时优先复用 source worktree，路径已移除且有 snapshot_ref 时可重建；请求中的 model override 会被软忽略并 pin 到 source model。"
 },
 {
  "g": 615,
  "type": "multi",
  "q": "关于从工具请求到受限执行的完整授权链，下列哪些说法正确？（多选）",
  "opts": [
   "工具输入先被解析成 AccessKind，携带路径、命令或域名等细节，决策输入比 ToolKind 更具体",
   "权限规则评估的优先级为 deny 大于 ask 大于 allow，与规则来源顺序无关",
   "只要沙箱处于 active 状态，所有写操作都会被自动批准，无须任何弹窗",
   "Bash 脚本会用 tree-sitter 分段，每个非 setup 段都要独立通过检查，防止 ls && rm 借首段放行",
   "权限层的 Allow 会同步扩大沙箱的 OS capability，两层共享同一份能力表"
  ],
  "ans": [0, 1, 3],
  "exp": "授权链从 AccessKind 解析开始，途经 plan gate、hooks、策略规则与会话授权，规则优先级固定为 deny > ask > allow。「沙箱内所有写操作自动批准」是误读：sandbox fast path 专门检查 Bash，且受 policy_forced_prompt 与 auto_forced_prompt 约束。权限层只决定「能否尝试」，Allow 不会扩大沙箱的 OS capability。"
 },
 {
  "g": 616,
  "type": "multi",
  "q": "关于 Compaction 的 two-pass 机制，下列哪些说法正确？（多选）",
  "opts": [
   "two_pass_enabled 默认为 false，未显式开启时走 single-pass 路径",
   "Pass 1 可在接近阈值时投机地在后台总结历史前缀，产出 NOTE₁",
   "Pass 2 丢弃 NOTE₁，只对最近的对话尾部做一次快速摘要",
   "开启 two-pass 后，正式压缩会把 NOTE₁ 与 recent tail 组合后再次总结",
   "开启 two-pass 会把自动压缩阈值从 85% 下调到 70%，以便更早预热"
  ],
  "ans": [0, 1, 3],
  "exp": "two-pass 是显式配置能力：Pass 1 预先摘要历史前缀得到 NOTE₁，Pass 2 把 NOTE₁ 与近期尾部组合后再次总结，配置为 false 时保留原有 single-pass 路径。开启它改变的是压缩路径，不会修改 85% 这个默认触发阈值，Pass 2 也不会丢弃 NOTE₁。"
 },
 {
  "g": 617,
  "type": "multi",
  "q": "关于记忆混合检索流水线，下列哪些说法正确？（多选）",
  "opts": [
   "查询开始前先同步 watcher 累积的脏 Markdown 路径，重新索引新增或修改文件，并删除已移除文件的旧 chunk",
   "合并分数经过时间衰减、来源权重与访问增益调整；session 记忆按半衰期指数衰减，global 与 workspace 视为 evergreen",
   "MMR 多样性重排默认开启，lambda 固定为 0.7 且不可配置",
   "FTS5 BM25 与向量检索必须同时可用，否则整条流水线拒绝执行",
   "MMR 是 opt-in 能力，MmrConfig 默认 enabled 为 false"
  ],
  "ans": [0, 1, 4],
  "exp": "sync-on-search 保证外部 Markdown 修改在下一次查询前进入索引；打分先归一化再按衰减、来源权重与访问增益调整。MMR 默认关闭（enabled: false），0.7 的 lambda 只在显式开启后生效；向量路径按可用性增强，FTS 始终提供基础候选，二者并无「必须同时可用」的约束。"
 },
 {
  "g": 618,
  "type": "multi",
  "q": "关于 custom 沙箱 Profile 与平台执行机制，下列哪些说法正确？（多选）",
  "opts": [
   "custom profile 默认从 workspace 开始，可以 extends 四种内置基类，但不能 extends off 或另一个 custom",
   "项目 .grok/sandbox.toml 声明与全局同名的 profile 时，merge 使用 entry.or_insert，全局定义保持生效",
   "restrict_network 会一并切断主进程网络，因此开启后进程无法访问模型 API",
   "沙箱 apply 失败时进程立即退出，保证不会出现未受限的执行",
   "macOS 的 deny 通过 Seatbelt 规则实现，Linux 的子路径 read-deny 还需要 bwrap bind-over"
  ],
  "ans": [0, 1, 4],
  "exp": "custom 的 extends 规则与 entry.or_insert 合并策略防止项目悄悄削弱同名全局策略。主进程网络保持开放以访问模型 API，restrict_network 通过子进程过滤表达。平台不支持或 apply 失败时源码记录警告并继续运行，要用 is_active() 判断沙箱是否实际生效，因此不能承诺「无法绕过」。"
 },
 {
  "g": 619,
  "type": "multi",
  "q": "关于 MCP 集成的工程细节，下列哪些说法正确？（多选）",
  "opts": [
   "工具注册名由服务端名、保留分隔符 __ 与原始工具名组成，完整名称要求恰好出现一次分隔符",
   "OAuth 凭据保存在 $GROK_HOME/mcp_credentials.json，通过文件锁与原子保存支持多进程并发写入",
   "mcp_dispatcher 对每条状态事件都立即推送 ACP 通知，以保证 UI 实时性",
   "移除 dead client 前会比较 client_id，旧连接迟到的断线事件不会误删已替换的新客户端",
   "stdio 与 HTTP 断线采用完全相同的恢复策略，共用一个指数退避计时器"
  ],
  "ans": [0, 1, 3],
  "exp": "server__tool 命名让两个 Server 的同名工具拥有不同 ToolId；凭据走文件锁加原子保存。状态事件以 (server_name, event_kind) 为键在 50 ms tumbling window 内 last-write-wins 合并，高频 tools/list_changed 最终只推一次。stdio 自动重启用 1 秒、4 秒、16 秒的固定退避，HTTP 先尝试客户端内恢复且退避独立，两者策略不同。"
 },
 {
  "g": 620,
  "type": "judge",
  "q": "ToolKind::is_read_only() 返回 true 的工具会跳过权限检查直接自动执行。",
  "ans": false,
  "exp": "is_read_only 只是工具种类层的默认副作用分类，具体工具还可以通过自己的元数据覆盖它。是否最终执行要继续经过命令规则、工作区权限、沙箱、Hook 与用户交互批准等多层控制，只读分类单独推不出「自动执行」。"
 },
 {
  "g": 621,
  "type": "judge",
  "q": "estimate_tokens 的本地粗估使用 UTF-8 字节长度除以 4，单张低分辨率图片的固定估值为 765 token。",
  "ans": true,
  "exp": "本地估算就是 bytes/4 的粗估，服务于请求前和工具输出加入后的快速预测；单张低分辨率图片固定估为 765 token。它与服务端 usage 观测是两回事：百分比与阈值函数只处理调用方传入的数值，不判断数据来源。"
 },
 {
  "g": 622,
  "type": "judge",
  "q": "插件根信任与 Hook 一样采用 fail-open：插件路径解析失败时默认视为可信，以保证插件可用。",
  "ans": false,
  "exp": "两者的失败策略正好相反。插件信任是 fail-closed：trust.rs 中 canonicalize 失败直接返回 false，路径解析失败默认未信任，未信任插件的 hooks、MCP servers 与 scripts 会被阻断。fail-open 是 Hook 自身执行故障的策略，用于优先保证工具可用性。"
 },
 {
  "g": 623,
  "type": "judge",
  "q": "DreamLock 是最佳努力锁，源码注释明确它并非严格互斥，因此 Dream 的 consolidation 过程必须设计成可容忍重复执行。",
  "ans": true,
  "exp": ".dream-lock 保存 PID 并用 mtime 兼作上次成功时间，写后复读只能降低竞争概率，仍可能有两个进程都认为自己获胜，所以 consolidation 必须幂等。配合写入失败 rollback、成功后才清理 session、索引只移除实际删掉的路径，共同构成失败可恢复的设计。"
 },
 {
  "g": 624,
  "type": "judge",
  "q": "在与 Claude Code 的对照中，Claude 一侧的结论基于对其内部源码实现的逆向分析。",
  "ans": false,
  "exp": "两列证据分辨率不同：Grok Build 一侧可以下钻源码，Claude Code 一侧只记录官方公开文档描述的可观察行为，不推断其内部实现，空白项刻意保留空白。这种证据分级正是本节要训练的方法论。"
 },

 /* 题库扩容增补 */
 {
  "g": 625,
  "type": "single",
  "q": "课程把 Rust 选型的依据分成「源码事实」与「课程推断」两类。下列哪项属于源码可验证事实？",
  "opts": [
   "xAI 选择 Rust 的首要目标是降低运行时内存占用",
   "workspace.package 中 edition 设为 2024，workspace 依赖使用启用 full feature 的 Tokio 1",
   "多线程 runtime 让 Grok Build 在所有场景下都比同类产品更快",
   "强类型建模让团队的缺陷率下降到可量化的水平"
  ],
  "ans": 1,
  "exp": "课程列出的四条事实是 Rust 2024 edition、启用 full feature 的 Tokio 1、广泛用于边界建模的强类型，以及 xai-grok-pager-bin 定义的 bin target。性能收益与组织动机没有写进源码，只能标为课程推断并接受验证。把合理解释写成 xAI 官方动机正是本节要避免的做法。"
 },
 {
  "g": 626,
  "type": "single",
  "q": "关于 Grok Build 里两级 Tokio runtime 的分工，下列哪项符合源码？",
  "opts": [
   "入口与 Session 共用同一个多线程 runtime，Session 只是其中一个普通 task",
   "入口构建多线程 runtime；每个 Session 在独立 OS 线程上运行 current-thread runtime 与 LocalSet，线程栈设为 8 MB",
   "入口使用 current-thread runtime，Session 反过来升级为多线程 runtime 以提升工具并发",
   "Session 线程不创建自己的 runtime，直接复用调用方线程的执行器"
  ],
  "ans": 1,
  "exp": "入口用 tokio::runtime::Builder::new_multi_thread().enable_all() 构建 runtime；spawn_session_on_thread 用 std::thread::Builder 命名线程、设置 8 * 1024 * 1024 的栈，再建 current-thread runtime 与 LocalSet。两级 runtime 让会话状态留在单线程内，配合 Actor 划分避免跨线程共享。"
 },
 {
  "g": 627,
  "type": "single",
  "q": "关于 PromptContext 的可序列化能力与字段来源，下列哪项正确？",
  "opts": [
   "它靠一组手写的 to_json 与 from_json 方法完成序列化",
   "它的字段清单由 TemplateRenderer 在运行时动态决定",
   "它的序列化能力来自 Serialize 与 Deserialize derive，字段清单以结构体定义为准",
   "它只实现了 Serialize，无法从磁盘反序列化回来"
  ],
  "ans": 2,
  "exp": "结构体带 Debug、Clone、Serialize、Deserialize 四个 derive，可序列化能力就来自 derive 本身，源码没有额外定义专用 JSON 转换方法。字段以结构体定义为准，分为版本与模板、配置与身份、用户运行环境三组。ToolBridge 与 TemplateRenderer 负责渲染，它们不改变字段清单。"
 },
 {
  "g": 628,
  "type": "single",
  "q": "TemplateOverride 的真实变体与默认值，下列哪项正确？",
  "opts": [
   "只有 Default 与 Custom(String) 两个变体，Default 指向标准 base template",
   "变体为 None、Codex、Custom(String)，其中 None 带 #[default] 标注",
   "变体为 None、Codex、Subagent、Custom(String)，Subagent 用于紧凑模板",
   "变体只有 None 与 Codex，自定义模板要通过配置文件路径传入"
  ],
  "ans": 1,
  "exp": "枚举定义为 None、Codex 与 Custom(String)，None 上带 #[default]。取 None 时，Primary 使用标准 base template、Subagent 使用对应紧凑模板，紧凑模板由 audience 决定，枚举里没有 Subagent 这个变体。Codex 是注释中定义的 apply-patch profile prompt template，Custom 由调用方给出完整模板字符串。"
 },
 {
  "g": 629,
  "type": "single",
  "q": "关于 canonical fields 的清单，下列哪项正确？",
  "opts": [
   "共八个：path、offset、limit、command、description、cwd、directory、pattern",
   "共九个，另有 content 用于承载写入内容",
   "共八个，其中 file_path 是读取类工具的统一字段名",
   "字段清单由每个 harness 自行扩展，源码没有固定常量"
  ],
  "ans": 0,
  "exp": "field 模块中的常量恰好是 path、offset、limit、command、description、cwd、directory、pattern 八个。源码中不存在 content 这个 canonical field，编辑前后文本与完整写入内容属于大字段，留在 raw_input 里。归一化层把各 harness 的 file_path 等原始名映射到 path，因此 file_path 属于原始输入名。"
 },
 {
  "g": 630,
  "type": "single",
  "q": "关于 CanonicalToolMeta 的字段与 input 的省略规则，下列哪项正确？",
  "opts": [
   "version 是字符串 v1，input 为必填字段",
   "七个字段是 version、name、kind、namespace、label、read_only、input；version 是数字 1，没有稳定投影时 input 会整体省略",
   "input 是 raw_input 的完整镜像，任何工具参数都能在其中找到",
   "read_only 由调用方在每次调用时传入，与工具分类无关"
  ],
  "ans": 1,
  "exp": "TOOL_META_VERSION 是 u32 类型的 1，结构体字段恰好是 version、name、kind、namespace、label、read_only 与 input，其中 input 为 Option<serde_json::Value>。它是 canonical projection，grep flags、replace_all 这类非共享字段可能被丢弃，完整原始输入仍由 raw_input 承载。read_only 来自工具分类，不由调用方逐次传入。"
 },
 {
  "g": 631,
  "type": "single",
  "q": "EffectiveRuntimeConfig 的真实字段，下列哪项正确？",
  "opts": [
   "它包含 model、temperature、max_tokens 与 tools，用于覆盖子会话的采样参数",
   "它只保存 persona 与 role_prompt，模型选择完全交给父会话决定",
   "它包含 model、reasoning_effort、capability_mode、persona、persona_instructions、role_prompt、role_prompt_warning、role_name、persona_error 与 isolation",
   "它与 AgentDefinition 的字段完全一致，只是换了个类型名"
  ],
  "ans": 2,
  "exp": "这十个字段就是解析结果的全部内容，源码中没有 temperature、max_tokens 或 tools。role_prompt_warning 与 persona_error 专门承载软降级与失败关闭的诊断信息。AgentDefinition 是另一层结构，负责 prompt_mode、tool_config、capability_mode、permission_mode、tools、isolation、model 等 Agent 骨架。"
 },
 {
  "g": 632,
  "type": "single",
  "q": "spawn 只指定了 persona=reviewer，role 给出 model=A 与 capability=read-only，Persona 给出 model=B。按合并优先级，最终 model 与 capability_mode 是哪一组？",
  "opts": [
   "model=B，capability=read-only，Persona 的运行时默认值优先级最高",
   "model=A，capability=read-only，model 命中 role 默认值，capability 不读取 Persona",
   "model=A，capability 为空，capability 只能由 spawn 显式给出",
   "model 为空，capability=read-only，未由 spawn 指定的 model 一律回落到父会话"
  ],
  "ans": 1,
  "exp": "优先级逐字段级联：spawn override 高于 role default，role default 高于 persona default，都未命中才保留 None 交给下游继承。本例 spawn 没有指定 model，role 的 A 先于 Persona 的 B 命中。Persona 只提供 model、reasoning 与 isolation，不提供 capability_mode，因此 capability 取 role 的 read-only。"
 },
 {
  "g": 633,
  "type": "single",
  "q": "子 Agent 解析时 Persona 的 instructions file 读取失败，与 role 的 prompt_file 读取失败，两者结果有什么差别？",
  "opts": [
   "两者都只写 warning 并继续，子 Agent 照常创建",
   "两者都中止创建，因为提示词缺失会让子会话行为不可控",
   "Persona 失败写入 persona_error 并被 spawn 侧中止创建；role prompt 失败只产生 role_prompt_warning，其余字段继续解析",
   "Persona 失败自动回退到默认 Persona，role prompt 失败才中止创建"
  ],
  "ans": 2,
  "exp": "Persona 采用失败关闭：请求了 Persona 后找不到、内容为空或读取文件失败都会写入 persona_error，文件 I/O 失败还会提前返回默认化结果，spawn 侧看到错误后中止创建。role prompt 采用软降级，读取失败只记 role_prompt_warning，model、reasoning、capability 与 isolation 仍继续解析。区分这两条策略正是本节的重点。"
 },
 {
  "g": 634,
  "type": "single",
  "q": "关于 SubagentCoordinator 的启动方式与并行能力，下列哪项符合源码？",
  "opts": [
   "start_subagent_coordinator 只启动一次 drain task，每个 Spawn 事件再进入 spawn_local 启动本地异步任务",
   "每收到一个 Spawn 事件就启动一个新的 drain task，用来隔离该子 Agent 的事件流",
   "协调器串行执行子 Agent，同一时刻只允许一个子任务在跑",
   "并行子 Agent 的数量上限等于已定义的 Persona 数量"
  ],
  "ans": 0,
  "exp": "drain task 只启动一次，循环 recv 事件并按 Spawn、Query、Cancel、ListActive、Completions 等变体分派。并行能力来自 spawn_local 出来的异步任务，与 Persona 数量无关。协调器负责登记 pending、active 与 completed 状态，并淘汰过期的 completed 记录。"
 },
 {
  "g": 635,
  "type": "single",
  "q": "关于插件的来源优先级与启用默认值，下列哪项正确？",
  "opts": [
   "所有来源发现到的插件默认都进入 enabled 列表，用户需要手动关闭",
   "CLI override 优先级最高；项目与用户范围默认加入 disabled 列表，CLI override 与 config path 默认加入 enabled",
   "项目 .grok/plugins 的优先级高于 CLI override，因为项目配置更贴近当前仓库",
   "启用状态由 plugin.json 中的字段声明，发现配置不参与判断"
  ],
  "ans": 1,
  "exp": "来源顺序为 CLI override、项目 .grok/plugins、用户 $GROK_HOME/plugins、registry provenance 与配置 paths，其中 CLI override 优先级最高。发现配置维护 enabled 与 disabled 两个列表，项目或用户范围默认进 disabled，CLI override 与 config path 默认进 enabled，用户仍可显式调整。可发现、已安装、已启用、受信任是四种独立状态。"
 },
 {
  "g": 636,
  "type": "single",
  "q": "关于 Marketplace 扫描与插件 manifest 的解析，下列哪项符合源码？",
  "opts": [
   "扫描器只读 plugin-index.json，索引缺失时直接返回空目录",
   "manifest 必须位于插件根目录的 plugin.json，其他位置一律忽略",
   "扫描器先读索引，缺失或无效时扫描 plugins/*/；plugin.json 是首选 manifest，.grok-plugin 与 .claude-plugin 下的同名文件是后备位置",
   "manifest 声明的路径可以指向插件根目录以外，用于复用共享组件"
  ],
  "ans": 2,
  "exp": "索引优先加文件系统回退是发现链的基本形态，default-skills 还能作为虚拟插件加入结果。manifest 有一个首选位置与两个后备位置，PluginManifest 可覆盖 skills、commands、agents、hooks、MCP 与 LSP 路径。解析之后源码还要验证这些路径仍包含在插件根目录内，越界路径会被拒绝。"
 },
 {
  "g": 637,
  "type": "single",
  "q": "结课设计工作台的 100 分评审量表中，分值最高的一项是哪个？",
  "opts": [
   "边界与 ADR，占 20 分",
   "合约与状态机，占 20 分",
   "安全与恢复，占 25 分",
   "演示与证据，占 15 分"
  ],
  "ans": 2,
  "exp": "量表为边界与 ADR 20 分、合约与状态机 20 分、安全与恢复 25 分、测试与可观测 20 分、演示与证据 15 分，安全与恢复权重最高。这与九维决策卡的取向一致：失败路径和信任边界比功能清单更能体现完成度。量表另设四条否决项，任一命中即不通过。"
 },
 {
  "g": 638,
  "type": "single",
  "q": "一次显式 resume 请求中，source transcript 已经占到目标模型上下文窗口的 90%。系统会怎么处理？",
  "opts": [
   "先对 transcript 自动做一次压缩，再继续恢复",
   "拒绝恢复，源码在 transcript 超过目标模型上下文窗口 80% 时就不再继续",
   "照常恢复，超出部分在第一轮采样时由服务端截断",
   "降级为 ContextSource::New，丢弃历史后继续执行任务"
  ],
  "ans": 1,
  "exp": "恢复限制里明确写了 80% 这条线，超过即拒绝恢复。复制 transcript 或读取失败时，显式 resume 同样失败关闭。恢复会复制 tool state，不复制 plan state、plan mode state 与 signals，因此恢复并不等于对原会话的完整克隆。"
 },
 {
  "g": 639,
  "type": "single",
  "q": "一个 MCP 工具完成注册后，决定它能否出现在模型工具列表里的是哪一项？",
  "opts": [
   "只要服务端在 tools/list 中返回它，模型就一定能看到",
   "由 model_visible 决定；被禁用的工具存入 disabled_tool_registrations，带 ui.resourceUri 的工具可单独走 UI 通知",
   "由 BM25 索引的命中分数决定，分数过低的工具会被隐藏",
   "由 mcp_initialized 决定，该标志为 true 时全部工具进入模型侧"
  ],
  "ans": 1,
  "exp": "发现与可见性是两件事：注册后要 model_visible 为真才进入模型侧 Tool Bridge，禁用工具落进 disabled_tool_registrations，带 ui.resourceUri 的工具面向 App 一侧。BM25 索引服务于 search_tool 的检索，mcp_initialized 只告诉搜索层能力发现是否完成，两者都不充当可见性开关。"
 },
 {
  "g": 640,
  "type": "single",
  "q": "源码枚举的 15 个 Hook 事件中，哪一类事件具备阻断主流程的能力？",
  "opts": [
   "PreToolUse、PostToolUse 与 PermissionDenied 三个事件",
   "所有带 Pre 前缀的事件，包括 PreToolUse 与 PreCompact",
   "只有 PreToolUse，它的 is_blocking() 为真",
   "全部 15 个事件都能通过返回 deny 阻断后续流程"
  ],
  "ans": 2,
  "exp": "事件枚举负责定义触发点，is_blocking() 单独声明阻断能力，其中只有 PreToolUse 为真。PreCompact、PostToolUse、PermissionDenied 等事件会被触发并收到信封，却无法让主流程停下。读事件列表时要同时追踪结果如何回到调用方，「事件被触发」推不出「能控制主流程」。"
 },
 {
  "g": 641,
  "type": "multi",
  "q": "关于 canonical input 这层稳定投影，下列哪些说法正确？（多选）",
  "opts": [
   "它的目的是让展示、遥测和跨工具分析拥有共同词汇，不同 harness 的原始参数名可以各不相同",
   "投影可能丢弃字段，grep flags 与 replace_all 这类非共享字段不一定出现在 input 中",
   "编辑前后文本与完整写入内容会完整保留在 input 里，便于回放整次调用",
   "没有稳定投影可写时，input 会整体省略",
   "启用 canonical 投影后 raw_input 就不再保存，以避免重复存储"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "canonical 层追求跨 harness 的公共语义，因此只保留少量稳定、轻量的字段。大字段与非共享字段被排除在投影外，完整原始输入仍由 raw_input 承载，两者并存。input 是 Option 类型，没有可写内容时整体省略，所以它不能当作 raw input 的镜像来读。"
 },
 {
  "g": 642,
  "type": "multi",
  "q": "关于 Grok Build 的多 Agent 组织方式，下列哪些说法正确？（多选）",
  "opts": [
   "定义层由 AgentDefinition 与 Persona 组成，前者给出 prompt、工具、权限、模型与可 spawn 类型等合同",
   "协调层的事件包含 Spawn、Query、Cancel、ListActive、Completions 与 Outstanding",
   "Query 只能返回即时快照，无法等待子 Agent 完成",
   "Completions 会 drain 待通知的完成项，并按 suppress_ids 过滤",
   "课程把 Coordinator 与 Swarm 都当作 Claude Code 源码中的内部类型，用于对照两边的调度实现"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "定义层负责子 Agent 的可观察身份与能力边界，协调层用事件管理其生命周期。Query 既可以立即返回快照，也可以注册 block wait slot 并轮询状态，因此它并非只支持快照。Claude 一侧只使用公开行为，课程明确不把 Coordinator 或 Swarm 当作它的源码内部类型，也不推断其调度器实现。"
 },
 {
  "g": 643,
  "type": "multi",
  "q": "关于插件从可见走向可执行的三道门与证据边界，下列哪些说法正确？（多选）",
  "opts": [
   "MarketplaceRelativePath 拒绝绝对路径、父目录穿越与越界 join，远程条目可用 git ref 或 SHA 定位内容",
   "信任粒度是整个 marketplace 来源，同一来源安装的插件共享一条信任记录",
   "未信任插件的 skills 与 agents 仍可列出元数据，hooks、MCP servers 与 scripts 则被阻断",
   "位于用户 home 下的 config path 也必须逐个显式信任，源码不提供任何自动信任路径",
   "当前源码能证明官方源常量、多个来源、目录索引与安装流程，却无法单独证明插件数量、活跃作者与审核覆盖率"
  ],
  "ans": [
   0,
   2,
   4
  ],
  "exp": "路径约束、启用状态与执行信任是三道独立的门。信任粒度是单个插件根，项目插件按 canonical plugin root 授权，记录写入 ~/.grok/trusted-plugins。CLI override 与用户范围在源码中标记为 trusted，config path 位于用户 home 下时可自动信任，其他位置仍需授权。机制可证明，生态规模不可证明，这条证据边界同样要写清楚。"
 },
 {
  "g": 644,
  "type": "multi",
  "q": "关于五种内置沙箱 Profile 的具体能力，下列哪些说法正确？（多选）",
  "opts": [
   "workspace 是默认 Profile，default_read 为 true 且不限制子进程网络",
   "devbox 枚举根目录并广泛授予写权限，但 /data 保持可读，在 Linux 通过 bwrap 做写保护",
   "read-only 的 restrict_network 为 true，workspace 不可写，GROK_HOME 与临时目录仍可写",
   "strict 的 default_read 为 true，它与 workspace 的差别只是多了几条 deny 规则",
   "off 会跳过 capability set 应用并记录一条 Sandbox disabled，它不接受任何别名"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "前三项分别对应 workspace、devbox 与 read-only 在源码里的 capability 描述，注意 read-only 保留了运行所需的最小写目录。strict 的关键差异是关闭全局默认读，只开放系统运行目录与 workspace，所以 default_read 为 false。off 除了跳过应用并记录 Sandbox disabled，还接受别名 none，同时不能作为 custom extends 的基类。"
 },
 {
  "g": 645,
  "type": "multi",
  "q": "关于 Dream 的执行边界与清理规则，下列哪些说法正确？（多选）",
  "opts": [
   "构建消息时有 32K 的输入上限，模型调用设有 30 分钟超时",
   "模型返回空、NO_REPLY 或没有 Markdown 标题时，既不写入也不删除 session",
   "只要模型调用成功返回，就可以立即清理本次读取的全部 session 文件",
   "写 MEMORY.md 失败时调用 rollback(prior) 恢复旧锁状态",
   "搜索索引会整体重建，把所有历史 session 的 chunk 一并清空"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "32K 输入上限与 30 分钟超时是流程中标注的真实约束。成功边界决定清理边界：写入成功之后才清理已读取的 session，且 5 分钟内仍活跃的文件会跳过，所以清理不以模型返回成功为准。索引只移除实际删掉的路径，再为新的 MEMORY.md 重建索引与 embedding。"
 },
 {
  "g": 646,
  "type": "judge",
  "q": "「入口创建 Tokio 多线程 runtime」有仓库直接证据，「xAI 为降低内存占用而选择 Rust」缺少仓库直接证据，只能标为课程推断。",
  "ans": true,
  "exp": "前者能在入口源码里读到 new_multi_thread().enable_all() 的构建调用，属于源码事实。后者涉及技术选型的组织动机，源码没有任何记录，课程只给出基于代码形态的解释，并注明它不代表 xAI 官方披露的原因。给每条结论贴上证据标签正是本节的训练目标。"
 },
 {
  "g": 647,
  "type": "judge",
  "q": "结课评审量表把「引用源码时无法给出文件路径」列为否决项。",
  "ans": true,
  "exp": "四条否决项分别是提交物未说明敏感数据落点、高风险工具缺少权限路径、崩溃后声称可恢复但没有测试，以及引用源码时无法给出文件路径。它与九维决策卡上的源码锚点要求一致：每个设计决定都要能回到一个真实分支，方案也要写清无法读取策略、无法解析结果、无法恢复 checkpoint 时的失败默认值。"
 },
 {
  "g": 648,
  "type": "judge",
  "q": "README 声明 macOS、Linux 与 Windows 都是受支持的构建主机。",
  "ans": false,
  "exp": "README 只把 macOS 与 Linux 列为受支持的构建主机，Windows 构建属于 best-effort，并且当前未从此源码树测试过。这条限制与周期同步、不接收外部补丁、根 Cargo 由生成流程产出共同构成公开仓库的边界，读源码时要把仓库边界与产品能力分开陈述。"
 },
 {
  "g": 649,
  "type": "judge",
  "q": "exceeds_threshold_with_headroom 会在百分比阈值前预留固定 token 空间把触发点提前，并且 context_window 为 0 时仍返回 false。",
  "ans": true,
  "exp": "该函数在窗口乘阈值的结果上做 saturating_sub，减去 headroom 乘 100，因此触发点比纯百分比更早。窗口 100,000、阈值 85%、headroom 4,000 时会提前到 81,000 触发。窗口为 0 的短路分支与 exceeds_threshold 保持一致，都直接返回 false。"
 },
 {
  "g": 650,
  "type": "judge",
  "q": "xai-grok-tools 的 namespace 枚举只覆盖内置实现族，运行时发现的 MCP 工具不在这个枚举中。",
  "ans": false,
  "exp": "namespace 枚举除了 grok_build、grok_build_concise、grok_build_hashline、codex、opencode 以及 memory、lsp、skills 这些内置实现族，还包含 MCP，专门用于运行时外部工具。ToolBridge 的 register_mcp_tools 会把 MCP 工具连同 input_schema 一起注册进 registry，它们与内置工具共享同一套注册与分发路径。"
 }
];

window.EXAM_TOPICS_PART = {
 "601": {"name": "工作区成员与主轴", "file": "12-1.html"},
 "602": {"name": "三大Actor分工", "file": "12-4.html"},
 "603": {"name": "入口与运行分支", "file": "12-3.html"},
 "604": {"name": "取消边界与不可变", "file": "12-4.html"},
 "605": {"name": "压缩策略默认值", "file": "12-5.html"},
 "606": {"name": "阈值等号边界", "file": "12-11.html"},
 "607": {"name": "工具只读默认值", "file": "12-8.html"},
 "608": {"name": "预设注册可见性", "file": "12-7.html"},
 "609": {"name": "动态MCP元工具", "file": "12-9.html"},
 "610": {"name": "检索降级策略", "file": "12-12.html"},
 "611": {"name": "记忆整理触发门控", "file": "12-13.html"},
 "612": {"name": "沙箱五种档位", "file": "12-17.html"},
 "613": {"name": "钩子失败语义", "file": "12-19.html"},
 "614": {"name": "子Agent隔离恢复", "file": "12-15.html"},
 "615": {"name": "工具授权链路", "file": "12-18.html"},
 "616": {"name": "两段式压缩机制", "file": "12-5.html"},
 "617": {"name": "混合检索流水线", "file": "12-12.html"},
 "618": {"name": "自定义沙箱规则", "file": "12-17.html"},
 "619": {"name": "MCP工程细节", "file": "12-20.html"},
 "620": {"name": "只读与审批边界", "file": "12-8.html"},
 "621": {"name": "Token本地估算", "file": "12-11.html"},
 "622": {"name": "插件信任边界", "file": "12-23.html"},
 "623": {"name": "梦境锁与幂等", "file": "12-13.html"},
 "624": {"name": "对照证据口径", "file": "12-22.html"},
 "625": {"name": "事实与推断分界", "file": "12-2.html"},
 "626": {"name": "两级运行时边界", "file": "12-4.html"},
 "627": {"name": "上下文序列化来源", "file": "12-6.html"},
 "628": {"name": "模板覆盖三变体", "file": "12-6.html"},
 "629": {"name": "归一化字段清单", "file": "12-10.html"},
 "630": {"name": "元数据合约版本", "file": "12-10.html"},
 "631": {"name": "有效运行时字段", "file": "12-14.html"},
 "632": {"name": "逐字段合并优先级", "file": "12-14.html"},
 "633": {"name": "人格失败关闭", "file": "12-14.html"},
 "634": {"name": "协调器启动方式", "file": "12-16.html"},
 "635": {"name": "插件来源与启用", "file": "12-21.html"},
 "636": {"name": "目录扫描与清单", "file": "12-21.html"},
 "637": {"name": "结课评审权重", "file": "12-24.html"},
 "638": {"name": "恢复的上下文上限", "file": "12-15.html"},
 "639": {"name": "工具模型可见性", "file": "12-20.html"},
 "640": {"name": "钩子阻断能力", "file": "12-19.html"},
 "641": {"name": "稳定投影取舍", "file": "12-10.html"},
 "642": {"name": "多Agent协调层", "file": "12-16.html"},
 "643": {"name": "插件三道门槛", "file": "12-21.html"},
 "644": {"name": "沙箱档位能力差异", "file": "12-17.html"},
 "645": {"name": "梦境成功边界", "file": "12-13.html"},
 "646": {"name": "选型证据分级", "file": "12-2.html"},
 "647": {"name": "结课评审否决项", "file": "12-24.html"},
 "648": {"name": "构建主机边界", "file": "12-23.html"},
 "649": {"name": "预留空间阈值", "file": "12-11.html"},
 "650": {"name": "命名空间覆盖面", "file": "12-9.html"}
};
