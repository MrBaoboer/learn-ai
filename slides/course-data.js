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
    title: 'AI 产品从入门到精通',
    subtitle: '从大模型底层原理到 AI Agent Harness',
    brand: '米羊科技 · AI 课程',
    author: '洛小山',
    authorUrl: 'https://luoxiaoshan.cn/',
    github: 'https://github.com/itshen/learn-ai',
  },
  parts: [
    {
      id: 'p1',
      num: '第一篇章',
      title: '大模型是怎么来的',
      desc: '从训练数据、Token 到 GPT 跃进，再到大模型幻觉的成因与四种应对方案，建立对大模型底层原理的完整认知。',
      color: '#0066ff',
      topics: [
        {
          id: 't-intro',
          title: '入门与定位',
          desc: '先搞清楚我们在哪里、为什么要打基础',
          lessons: [
            { file: '0-intro.html', title: '我们在哪里？达克效应', desc: '用达克曲线定位学员当前位置，明确课程目标：从愚昧之巅走向平稳高原', tag: '开篇' },
            { file: '0-how.html', title: '怎样学，知识才能过脑子', desc: '看完 ≠ 学到——每个案例都要停下来反思、代入自己的业务场景、尝试输出', tag: '开篇' },
            { file: '0-why.html', title: '为什么要花时间讲原理', desc: 'AI 所有 Harness 操作本质都是对 message list 的处理——理解它，才能看懂所有方案', tag: '开篇' },
          ],
        },
        {
          id: 't-basic',
          title: '基础原理',
          desc: '训练数据、训练 vs 推理、词表与注意力',
          lessons: [
            { file: 'training-data.html', title: 'AI 的"食物"：训练数据', desc: '15T Token 是什么概念？语料构成可视化 + 数据规模直觉滑块', tag: '交互' },
            { file: 'train-vs-infer.html', title: '训练 vs 推理：两个不同的过程', desc: '对话不是学习，参数冻结，按 Token 计费——AI 产品必懂的底层逻辑', tag: '概念' },
            { file: '1-2-vocab.html', title: '词表与训练', desc: '从语料到词间矩阵，Token 化 + 注意力权重交互演示', tag: '交互' },
            { file: '1-2-base.html', title: 'Base 模型：Token 推 Token 机器', desc: '训练结束后得到什么？逐步生成 + 概率分布实时更新', tag: '动画' },
            { file: '1-2-gpt.html', title: 'GPT 的跃进：PreTraining 改变一切', desc: 'CNN / RNN / BERT / GPT 四种算法可交互对比，记忆衰减可视化', tag: '交互' },
          ],
        },
        {
          id: 't-chat',
          title: '从补全到对话',
          desc: '补全机器是如何变成聊天机器人的',
          lessons: [
            { file: '1-2-api.html', title: 'chat/completions 之谜', desc: '明明是对话，为什么 API 叫"补全"？打字机动画解读', tag: '动画' },
            { file: '1-2-fake-chat.html', title: '伪造聊天记录', desc: 'OpenAI 最初的实验：把补全机器变成聊天机器人', tag: '动画' },
            { file: '1-2-sft.html', title: 'Chat Template + SFT', desc: 'Jinja 格式、指令微调，大模型终于学会"说话"', tag: '概念' },
            { file: '1-2-prompt-power.html', title: '上下文窗口是关键', desc: '提示词为什么够用？Token 截断可视化，无需重新训练', tag: '交互' },
          ],
        },
        {
          id: 't-hallucination',
          title: '幻觉与四种应对',
          desc: '幻觉成因，以及 Prompt / RAG / Temperature / 评测四种缓解方案',
          lessons: [
            { file: '1-2-hallucination.html', title: '大模型幻觉演示', desc: '三类典型幻觉：事实错误 / 自信编造 / 知识截止', tag: '案例' },
            { file: '1-2-mitigation-prompt.html', title: '应对 1：Prompt Engineering', desc: '约束指令 + 局限性：模型不知道自己不知道什么', tag: '概念' },
            { file: '1-2-mitigation-rag.html', title: '应对 2：RAG 检索增强生成', desc: '真实文档注入上下文，5 步交互流程动画，对比有无 RAG 的差异', tag: '交互' },
            { file: 'rag-advanced.html', title: 'RAG 的代价与优化策略', desc: '成本分析表 + 关键词触发 / 模型路由 / 语义缓存 / 精准切块四种策略', tag: 'PM 进阶' },
            { file: '1-2-mitigation-temp.html', title: '应对 3：Temperature & Top-P', desc: '拖动滑块，实时看概率分布和输出变化', tag: '交互' },
            { file: '1-2-mitigation-eval.html', title: '应对 4：评测 + 人工审核', desc: '外部纠错层，冷启动阶段兜底策略（HILT）', tag: '概念' },
          ],
        },
        {
          id: 't-summary1',
          title: '篇章汇总',
          desc: '第一篇章核心知识回顾',
          lessons: [
            { file: 'summary-1.html', title: '汇总（上）· 大模型是什么 + 幻觉', desc: '训练本质 / Token / Base→SFT→Chat / 四种幻觉类型与根因', tag: '汇总' },
            { file: 'summary-1b.html', title: '汇总（下）· 缓解策略 + 决策框架', desc: '四种缓解策略对比 / 常见误区清单 / 方案选择判断矩阵', tag: '汇总' },
          ],
        },
      ],
    },
    {
      id: 'p2',
      num: '第二篇章',
      title: 'AI Harness',
      desc: '上下文工程、Prompt 进阶与安全、Agent 设计与工具调用、五层成本优化体系——把大模型真正落地为可用产品。',
      color: '#7c3aed',
      topics: [
        {
          id: 't-context',
          title: '上下文工程',
          desc: 'AI 的工作记忆与溢出处理',
          lessons: [
            { file: '5-1.html', title: '上下文窗口：AI 的工作记忆', desc: '窗口构成可视化，拖动模拟溢出效果，主流模型容量对比', tag: '交互' },
            { file: '5-2.html', title: '上下文溢出：三种处理策略', desc: '直接截断 / 摘要压缩 / 选择性保留，可视化对比每种策略的利弊', tag: '交互' },
          ],
        },
        {
          id: 't-prompt',
          title: 'Prompt 工程',
          desc: 'Markdown、角色扮演、进阶技巧与输出格式',
          lessons: [
            { file: '6-0a.html', title: '为什么大模型选择 Markdown', desc: '纯文本模型 + 排版需求 = MD 成为首选，逐步推演 HTML/Word/LaTeX 为何不行', tag: '动画' },
            { file: '6-0b.html', title: 'Markdown 语法与渲染 Pipeline', desc: '常用语法速查 + 实时编辑器 + marked.js / markdown-it 渲染方案', tag: '交互' },
            { file: '6-1.html', title: '你说什么，它就变什么', desc: '五种角色实时切换，输出格式控制，System Prompt 核心原理', tag: '交互' },
            { file: '6-2.html', title: 'Prompt 进阶技巧', desc: 'Few-Shot / CoT / 约束条件 / 任务拆解，好坏对比交互演示', tag: '交互' },
            { file: '6-3.html', title: '输出格式取舍', desc: '纯文本 / JSON / Markdown / YAML / XML — 场景适配度对比与权衡', tag: '交互' },
            { file: '6-4.html', title: '流式返回与格式配合', desc: 'JSON 全文才能解析 / MD 逐字显示 / XML 捕获标签即渲染，动态演示', tag: '交互' },
          ],
        },
        {
          id: 't-security',
          title: 'Prompt 安全',
          desc: 'Prompt Injection 原理、案例与防御实战',
          lessons: [
            { file: 'prompt-attack.html', title: 'Prompt Injection：为什么会被攻击', desc: 'SQL 注入类比 → Message List 本质 → 缺乏参数化 → 5 大攻击类型概览', tag: '安全' },
            { file: 'prompt-attack-cases.html', title: 'Prompt Injection：12 个攻击案例', desc: '越权指令 / 角色扮演 / Few-Shot / 结构注入 / 隐喻伪装，中招版 vs 防御版', tag: '安全' },
            { file: 'prompt-defense.html', title: 'Prompt 防御：三层拦截实战', desc: '输入层正则 → 提示词层约束 → 输出层泄漏检测 → 二次审核，可模拟攻击全链路', tag: '实战' },
            { file: 'ai-safety-redlines.html', title: 'AI 安全红线：四条底线', desc: '不能做的事、做了会怎样，产品经理必须守住的四类安全边界', tag: '安全' },
            { file: 'ai-safety-governance.html', title: '风险分级与责任：谁来管、怎么管', desc: 'AI 输出的风险分级模型，各角色的责任分工与治理框架', tag: '安全' },
          ],
        },
        {
          id: 't-agent',
          title: 'Agent 工程',
          desc: 'Agent 能力、工具调用、ReAct、记忆、Skill 与脚手架',
          lessons: [
            { file: '7-1.html', title: 'Agent：能干活的 AI', desc: '四大能力 Plan / Tool / Memory / Act，点击查看真实案例', tag: '交互' },
            { file: '7-2.html', title: '工具调用的秘密', desc: '模型输出 JSON → 框架解析执行 → 结果注回，四步流程可视化', tag: '交互' },
            { file: '7-2a.html', title: '一次对话背后的 5 条消息', desc: '拆解 Function Calling 真实链路：用户看到 1 条回复，背后是 5 条 API 消息', tag: '深入' },
            { file: '7-2b.html', title: '工具描述的学问', desc: '同样功能，好描述 vs 坏描述成功率差 3 倍，对比实验', tag: '深入' },
            { file: '7-2c.html', title: '多工具编排：并发 vs 串行', desc: 'isConcurrencySafe 决定工具能否并行，调度策略可视化', tag: '深入' },
            { file: '7-2d.html', title: 'MCP 协议：工具的 USB 接口', desc: 'stdio / SSE / Streamable HTTP 三种传输方式对比，数据流动画', tag: '深入' },
            { file: '7-3.html', title: 'ReAct 实战：查询天气完整链路', desc: 'Thought / Action / Observation 逐步演示，7 步完整 Agent 链路', tag: '动画' },
            { file: '7-3a.html', title: '短期记忆 = 上下文窗口', desc: '消息列表可视化，每条消息的 Token 占用和角色标记', tag: '深入' },
            { file: '7-3b.html', title: '上下文压缩：四层防线', desc: '60% 裁剪 → 75% 微压缩 → 85% 折叠 → 95% 紧急，拖动滑块看压缩过程', tag: '深入' },
            { file: '7-3c.html', title: '长期记忆：向量检索', desc: 'Embedding → 向量数据库 → 语义搜索，topK 与 minScore 的设计决策', tag: '深入' },
            { file: '7-4a.html', title: 'ReAct 循环：思考→行动→观察', desc: '一个删除 console.log 的任务经历 14 轮循环，含自我纠错', tag: '深入' },
            { file: '7-4b.html', title: 'Agent 卡死的 5 种模式', desc: '参数格式错误、幻觉工具、无限递归、信息不足、API 异常', tag: '深入' },
            { file: '7-4c.html', title: '权限与安全', desc: '5 种权限模式 + LLM 风险分级 + Human-in-the-loop 设计', tag: '深入' },
            { file: '7-5.html', title: 'Skill：让 Agent 少走弯路', desc: 'Skill = 流程说明 + 工具调用指引，用"阳台收衣服"类比好循环 vs 差循环', tag: '交互' },
            { file: '7-5a.html', title: 'Skill 的本质', desc: '好循环 vs 差循环升级版，Skill 如何改变 Agent 执行路径', tag: '深入' },
            { file: '7-5b.html', title: '解剖一个真实 Skill', desc: '从真实源码学 SKILL.md 的结构设计', tag: '深入' },
            { file: '7-4.html', title: '脚手架工程：从试验品到产品', desc: '模拟 Agent 查机票订酒店，无脚手架 vs 有脚手架完整对比，5 大能力详解', tag: '交互' },
            { file: '7-6a.html', title: '5 道工程护栏', desc: '迭代上限、输出截断、超时控制、中断恢复、上下文急救', tag: '深入' },
            { file: '7-6b.html', title: '多 Agent 协作', desc: '子 Agent 调度、Worker Thread、并行 vs 串行执行策略', tag: '深入' },
            { file: '7-6c.html', title: '可观测性', desc: '事件流可视化、Token 追踪、OpenTelemetry 集成', tag: '深入' },
            { file: '7-summary.html', title: 'Agent 工程全景图', desc: '从四大能力到工程落地，一页看清 Agent 的完整知识地图', tag: '汇总' },
          ],
        },
        {
          id: 't-cost',
          title: '成本优化与选型',
          desc: 'KV Cache、缓存、图片 Token、语法/语义/输出层优化与模型选型',
          lessons: [
            { file: '8-1.html', title: '多轮对话为什么越来越贵', desc: 'Token 累积成本可视化，拖动轮次查看费用如何指数增长', tag: '交互' },
            { file: '8-2.html', title: 'KV Cache：用空间换时间（和钱）', desc: '类比理解 + 节省效果计算器，拖动轮次查看节省比例', tag: '交互' },
            { file: '8-2b.html', title: '显式缓存：实战对比', desc: 'cache_control 写法、缓存命中判断、价格折扣对比，真实省钱效果演示', tag: '交互' },
            { file: '8-3.html', title: '动态时间戳：最贵的 System Prompt', desc: '错误设计 vs 正确设计，三种时间处理方案对比切换', tag: '反例' },
            { file: '8-4.html', title: '综合成本优化：从系统角度省钱', desc: '5 层优化策略，成本构成可视化，节省 70-90% 的系统设计', tag: '系统设计' },
            { file: '8-5.html', title: '图片 Token：像素也在烧钱', desc: '图片计费公式、缩放机制、分辨率陷阱、按任务分级策略', tag: '多模态' },
            { file: '8-5b.html', title: '按任务匹配分辨率', desc: '高/中/低三档分辨率策略，不同场景的 Token 消耗对比与选型建议', tag: '多模态' },
            { file: '8-6.html', title: '语法层优化：写给机器的提示词', desc: 'YAML vs JSON、CSV vs 数组、压缩 JSON 输出，格式性 Token 省 10-30%', tag: '提示词工程' },
            { file: '8-7.html', title: '语义层优化：不要把上下文当垃圾桶', desc: '动态 Few-Shot、LLMLingua-2 压缩、关键信息放首尾，提升信息密度', tag: 'RAG' },
            { file: '8-8.html', title: '输出层 + KV Cache 进阶', desc: '负向约束、Diff 润色、停止序列；KV Cache 的工具陷阱与滑动窗口问题', tag: '架构' },
            { file: 'cost-eval.html', title: '模型选型：能力 vs 成本', desc: '主流模型能力/成本矩阵、选型决策树、不同场景的模型匹配策略', tag: '选型' },
            { file: 'engineering-philosophy.html', title: '大道至简：坚守第一性原理', desc: 'AI Harness 的本质 / 做 vs 不做的取舍 / 会被时代淘汰的 Harness / 终极问题', tag: '收官' },
          ],
        },
        {
          id: 't-tips',
          title: '实用技巧',
          desc: '人机边界、提问方式、迭代方法、场景判断与幻觉验证——用 AI 的日常指南',
          lessons: [
            { file: 'ai-tips-boundary.html', title: '人机知识边界：四象限策略', desc: '什么交给 AI、什么自己来——用四象限快速判断任务分配', tag: '技巧' },
            { file: 'ai-tips-context.html', title: '好提问 vs 坏提问', desc: '上下文决定输出质量，同一个问题好坏对比演示', tag: '技巧' },
            { file: 'ai-tips-verify.html', title: 'AI 说的能信吗？找出幻觉', desc: '三种快速验证方法，识别 AI 自信说错的场景', tag: '技巧' },
            { file: 'ai-tips-iterate.html', title: '迭代的艺术：知道何时收手', desc: '从粗到精的迭代节奏，以及何时该停止追问 AI', tag: '技巧' },
            { file: 'ai-tips-scenarios.html', title: '场景速查：什么时候放心用', desc: '高可信 / 需验证 / 慎用 / 不用——AI 适用场景四分类', tag: '技巧' },
          ],
        },
        {
          id: 't-summary2',
          title: '课程收官',
          desc: '第二篇章回顾 + 完整课程总结',
          lessons: [
            { file: 'summary-2.html', title: '汇总（上）· Prompt 工程 + Agent', desc: '上下文溢出策略 / Prompt 六要素 / 工具调用真相 / Skill + 脚手架', tag: '汇总' },
            { file: 'summary-2b.html', title: '汇总（下）· 成本优化 + PM 视角', desc: '五层成本体系 / KV Cache 原理 / 图片 Token / 课程完整能力清单', tag: '汇总' },
            { file: 'summary-final.html', title: '课程总结 · 产品经理的第一节 AI 课', desc: '从大模型原理到工程落地，完整课程一页回顾', tag: '汇总' },
            { file: 'summary-final-1.html', title: '总结（上）· 原理 + Harness', desc: '大模型认知框架 / 幻觉应对 / Prompt 与 Agent 核心要点', tag: '汇总' },
            { file: 'summary-final-2.html', title: '总结（下）· 实战 + 成本', desc: '安全防御 / 成本优化 / 用 AI 的正确姿势 / 下一步学习路径', tag: '汇总' },
          ],
        },
      ],
    },
    {
      id: 'p3',
      num: '第三篇章',
      title: '实战 · 从 Demo 到产品',
      desc: '以真实 AI Agent 桌面应用为例，拆解生图产品化、Agent 循环控制、上下文压缩、长期记忆、Prompt Harness、多 Agent 协作、权限安全与 MCP 生态——从"调通 API"到"用户能用"的完整实战路径。',
      color: '#059669',
      topics: [
        {
          id: 't-imagegen',
          title: 'AI 生图',
          desc: '文生图、垫图、角色一致性、多模型降级与产品化',
          lessons: [
            { file: '9-1.html', title: '文生图 vs 垫图：两种完全不同的事', desc: '一个从文字出发，一个从图片出发——产品经理要分清什么时候用哪种', tag: '概念' },
            { file: '9-2.html', title: '用 AI 给 AI 写 Prompt', desc: '用户说"画个夕阳下的猫"，生图模型需要的是完全不同的描述——用 LLM 做翻译', tag: '实战' },
            { file: '9-3.html', title: '角色一致性：最难的产品问题', desc: '同一个 IP 每次画都长不一样——为什么难、产品上怎么思考这个问题', tag: '案例' },
            { file: '9-4.html', title: '模型会挂，然后呢？', desc: '多模型降级链的产品逻辑：优先级、白名单、探活、全挂时的体验兜底', tag: '实战' },
            { file: '9-5.html', title: '生图的产品化清单', desc: '从"调通了 API"到"用户能用"之间，还差哪些东西——一张 checklist', tag: '系统设计' },
          ],
        },
        {
          id: 't-agentloop',
          title: 'Agent Loop',
          desc: '生产级循环的控制、防护与流式体验',
          lessons: [
            { file: '9-6.html', title: '教科书的 3 步 vs 真实的 N 步', desc: 'ReAct 不止 Think-Act-Observe 三步，生产环境每轮还要做什么', tag: '概念' },
            { file: '9-7.html', title: '为什么 Agent 会卡死', desc: '真实场景中循环挂掉的几种典型模式——以及用户会看到什么', tag: '案例' },
            { file: '9-8.html', title: '防呆设计：怎么让循环自己停下来', desc: '上限、检测、降级——三类策略的思路，产品经理该在哪里画线', tag: '实战' },
            { file: '9-9.html', title: '流式体验：别让用户干等', desc: '工具在后台跑 30 秒，用户看到的应该是什么？进度感设计', tag: '交互' },
            { file: '9-10.html', title: '一条消息背后的真实成本', desc: '用户发一句话，底层可能跑 10+ 轮循环、几十条 API 消息——成本意识', tag: '深入' },
          ],
        },
        {
          id: 't-ctxmgmt',
          title: '上下文管理',
          desc: '对话越长越贵越笨——压缩的艺术与取舍',
          lessons: [
            { file: '9-11.html', title: '对话越长越贵、越长越笨', desc: '费用递增 + 注意力衰减 + 窗口有限——三个必须管理上下文的理由', tag: '概念' },
            { file: '9-12.html', title: '压缩是一门取舍的艺术', desc: '有的能删、有的不能删、有的要花钱压——产品经理的决策框架', tag: '实战' },
            { file: '9-13.html', title: '用户说的话能不能删？', desc: '"圣物"问题：AI 的输出可以压缩，但用户的原话删了就回不来', tag: '概念' },
            { file: '9-14.html', title: '本地压缩 vs LLM 压缩', desc: '零成本快但粗 vs 有成本慢但精——什么时候用哪种', tag: '深入' },
          ],
        },
        {
          id: 't-memory',
          title: '长期记忆',
          desc: '让 AI "认识"你——记忆的提取、冲突与注入',
          lessons: [
            { file: '9-15.html', title: '上下文 ≠ 记忆', desc: '白板（上下文窗口）和笔记本（长期记忆）的区别——为什么需要两套系统', tag: '概念' },
            { file: '9-16.html', title: '什么值得记、什么不值得记', desc: '不是所有对话都有价值——"守门员"思路与筛选逻辑', tag: '实战' },
            { file: '9-17.html', title: '记忆冲突：用户改了主意怎么办', desc: '新旧记忆冲突的四种处理策略：新增 / 合并 / 冲突标记 / 跳过', tag: '案例' },
            { file: '9-18.html', title: '记忆注入的成本问题', desc: '记了 1000 条，每次全塞进去？还是按需检索？两种策略的代价', tag: '深入' },
          ],
        },
        {
          id: 't-prompteng',
          title: 'Prompt Harness',
          desc: '从字符串到架构——分层、按需加载与 Skill 模块化',
          lessons: [
            { file: '9-19.html', title: 'System Prompt 不是一坨文本', desc: '分层管理的必要性：身份、环境、工具指引各自独立，互不干扰', tag: '架构' },
            { file: '9-20.html', title: '不用的东西别给 AI 看', desc: '100 个工具全塞 system？Token 爆炸——按需加载的设计思路', tag: '实战' },
            { file: '9-21.html', title: 'Skill：可运营的 Prompt 模块', desc: '文件即配置、版本可追溯——让 Prompt 也能像代码一样管理', tag: '实战' },
            { file: '9-22.html', title: '提示词和缓存的微妙关系', desc: '改一个字 System Prompt，整条 KV Cache 作废——怎么减少"手抖"的成本', tag: '深入' },
          ],
        },
        {
          id: 't-multiagent',
          title: '多 Agent',
          desc: '并行、脑暴、定时任务与协作成本',
          lessons: [
            { file: '9-23.html', title: '什么时候需要多个 Agent', desc: '并行加速、角色分工、风险隔离——三种真实场景', tag: '概念' },
            { file: '9-24.html', title: '并发的代价：谁能同时跑', desc: '"看"可以并行，"改"必须排队——为什么以及怎么判断', tag: '实战' },
            { file: '9-25.html', title: '脑暴：让多个 AI 吵架', desc: '同一问题多角度独立思考，汇总共识与分歧——群体智慧的 AI 版', tag: '交互' },
            { file: '9-26.html', title: '定时任务的成本陷阱', desc: 'Agent 定时跑任务，上下文是累积还是重建？一个选择差 10 倍成本', tag: '反例' },
          ],
        },
        {
          id: 't-security',
          title: '权限与安全',
          desc: 'Agent 的缰绳——权限分级、审批与可观测性',
          lessons: [
            { file: '9-27.html', title: 'AI 该有多大的自由', desc: '完全自主 vs 每步审批——五种权限模式和适用场景', tag: '概念' },
            { file: '9-28.html', title: '弹窗太多用户烦，不弹又不安全', desc: 'Human-in-the-loop 的平衡点——风险分级思路', tag: '实战' },
            { file: '9-29.html', title: 'Agent 干了什么你知道吗', desc: '事件流与 Token 追踪——不看日志你永远不知道出了什么错', tag: '架构' },
          ],
        },
        {
          id: 't-mcp',
          title: 'MCP 实战',
          desc: '工具生态的双向连接——消费、提供与自配置',
          lessons: [
            { file: '9-30.html', title: 'MCP 不只是"调工具"', desc: '同一个协议两个方向：消费别人的工具 vs 把自己暴露给别人', tag: '概念' },
            { file: '9-31.html', title: '懒连接：不用别连', desc: '注册了 10 个 MCP 服务，启动时全连一遍？还是用到再连？', tag: '实战' },
            { file: '9-32.html', title: 'AI 自己加工具', desc: 'Agent 运行时发现需要新工具，自己配置 MCP 连接——"自配置"思路', tag: '深入' },
          ],
        },
        {
          id: 't-summary3',
          title: '实战收官',
          desc: '全景回顾与核心洞察',
          lessons: [
            { file: '9-summary.html', title: '实战全景图', desc: '生图、循环、记忆、Prompt、多 Agent、安全、MCP——一张图串起来', tag: '汇总' },
            { file: '9-final.html', title: '聊天套壳 vs 真正的 Agent 产品', desc: '同一个 Loop 支撑 N 种场景——差异不在代码在产品决策', tag: '收官' },
          ],
        },
      ],
    },
    {
      id: 'p4',
      num: '第四篇章',
      title: '进阶 · AI 工程设计模式',
      desc: '基于 Anthropic 公开的 Claude Code 源码与工程博客，深入拆解生产级 Agent 的设计模式——上下文工程、工具设计、评测方法论、长运行 Agent、脑手分离架构与安全容器化。',
      color: '#dc2626',
      topics: [
        {
          id: 't-agent-patterns',
          title: 'Agent 设计模式',
          desc: 'Anthropic 官方总结的五种 Workflow + 自主 Agent',
          lessons: [
            { file: '10-1.html', title: 'Workflow vs Agent：先搞清楚你要什么', desc: '预定义流程 vs 模型自主决策——Anthropic 定义的两大类 Agent 系统', tag: '设计模式' },
            { file: '10-2.html', title: '五种 Workflow 模式', desc: 'Prompt Chaining / Routing / Parallelization / Orchestrator-Workers / Evaluator-Optimizer', tag: '设计模式' },
            { file: '10-3.html', title: '从 Prompt 工程到上下文工程', desc: '不再只是写好提示词——而是在每一轮推理时策展最优的 Token 组合', tag: '方法论' },
            { file: '10-4.html', title: '上下文的三板斧', desc: 'Compaction、结构化笔记、子 Agent 架构——长任务的三种上下文管理策略', tag: '方法论' },
          ],
        },
        {
          id: 't-tool-design',
          title: '工具设计的艺术',
          desc: '如何为 Agent 写出好工具——命名、描述、参数与 ACI',
          lessons: [
            { file: '10-5.html', title: 'ACI：Agent-Computer Interface', desc: '工具是 Agent 和世界之间的契约——像设计人机界面一样设计 Agent 界面', tag: '设计模式' },
            { file: '10-6.html', title: 'Think Tool：让 AI 先想后做', desc: '在复杂工具链中给 Agent 一个"暂停思考"的空间——τ-bench 性能提升 54%', tag: '深入' },
            { file: '10-7.html', title: '用 Agent 优化 Agent 的工具', desc: 'Claude Code 实践：用 AI 写工具描述、跑评测、自动迭代优化', tag: '实战' },
          ],
        },
        {
          id: 't-evals',
          title: 'Agent 评测',
          desc: '不评测就是在裸奔——如何系统化验证 Agent 质量',
          lessons: [
            { file: '10-8.html', title: '为什么评测比训练更重要', desc: '没有评测，修一个 bug 制造三个——Anthropic 的 Eval 方法论', tag: '方法论' },
            { file: '10-9.html', title: '三种 Grader：代码、模型、人工', desc: '静态断言 vs LLM-as-Judge vs 人工校准——每种适合什么场景', tag: '实战' },
            { file: '10-10.html', title: '评测的坑：噪音、作弊与退化', desc: '基础设施噪音可造成 6pp 误差、模型会识别考试、改 Prompt 可能让 Eval 掉 3%', tag: '案例' },
          ],
        },
        {
          id: 't-long-running',
          title: '长运行 Agent',
          desc: '从一轮对话到跑几小时——Harness 的设计与演进',
          lessons: [
            { file: '10-11.html', title: '为什么 Agent 跑不了长任务', desc: '一口气做太多、做完就收工——两种典型失败模式', tag: '案例' },
            { file: '10-12.html', title: 'Initializer + Coding Agent', desc: '初始化 Agent 搭环境、编码 Agent 增量推进——双角色 Harness 设计', tag: '设计模式' },
            { file: '10-13.html', title: 'Managed Agent：脑手分离', desc: '把"思考"和"执行"拆到不同进程——像操作系统一样虚拟化 Agent', tag: '架构' },
            { file: '10-14.html', title: 'Session ≠ Context Window', desc: '会话日志是持久的事件流、上下文窗口是临时的工作记忆——两者必须分离', tag: '深入' },
          ],
        },
        {
          id: 't-security-advanced',
          title: '安全与容器化',
          desc: 'Anthropic 如何在产品中"约束" Claude',
          lessons: [
            { file: '10-15.html', title: '三类风险：滥用、失控、外部攻击', desc: 'Anthropic 的安全分类框架：用户滥用 / 模型 Misbehavior / Prompt Injection', tag: '安全' },
            { file: '10-16.html', title: '沙箱与凭证隔离', desc: '生成的代码和密钥永远不在同一个容器里——结构性安全比靠提示词更可靠', tag: '安全' },
          ],
        },
        {
          id: 't-summary4',
          title: '进阶收官',
          desc: '全景回顾与核心设计原则',
          lessons: [
            { file: '10-17.html', title: 'Contextual Retrieval：更好的 RAG', desc: '在检索前先给 Chunk 加上下文——Anthropic 的 RAG 升级方案', tag: '深入' },
            { file: '10-summary.html', title: '进阶全景图', desc: '设计模式、工具、评测、长运行、安全——一张图串起来', tag: '汇总' },
            { file: '10-final.html', title: '做最简单的、能跑的东西', desc: 'Anthropic 的核心工程哲学："Do the simplest thing that works"', tag: '收官' },
          ],
        },
      ],
    },
    {
      id: 'p5',
      num: '第五篇章',
      title: 'Harness 与自我改进',
      desc: '从 Harness 设计模式到递归自我改进：当 Agent 开始优化自己的脚手架，AI 工程进入新阶段。基于 Lilian Weng 2026 年前沿综述。',
      color: '#7c3aed',
      topics: [
        {
          id: 't-harness-intro',
          title: 'Harness 概论',
          desc: '递归自我改进与 Harness 的核心地位',
          lessons: [
            { file: '11-1.html', title: '从脚手架到自我改进系统', desc: '递归自我改进（RSI）的历史与近期路径：模型改进 Harness 而非直接改写权重', tag: '前沿' },
            { file: '11-2.html', title: 'Harness 三大设计模式', desc: '工作流自动化 / 文件系统持久记忆 / 子 Agent 与后台任务——构建 Agent 运行时的三个基石', tag: '设计模式' },
          ],
        },
        {
          id: 't-harness-optimize',
          title: 'Harness 优化',
          desc: '从上下文工程到工作流自动搜索',
          lessons: [
            { file: '11-3.html', title: '上下文工程：从手写到自动进化', desc: 'ACE → MCE → Meta-Harness：优化对象从 prompt 内容演进到管理机制代码', tag: '前沿' },
            { file: '11-4.html', title: '工作流设计：从手工到自动搜索', desc: 'AI Scientist / ADAS / AFlow——用 MCTS 和 Meta-Agent 搜索最优工作流', tag: '前沿' },
          ],
        },
        {
          id: 't-harness-self',
          title: '自我改进与进化',
          desc: '让 Harness 改进自己、用进化算法搜索设计空间',
          lessons: [
            { file: '11-5.html', title: '让 Harness 改进自己', desc: 'STOP 递归改善器 + Self-Harness 的 propose-evaluate-accept 循环', tag: '前沿' },
            { file: '11-6.html', title: '进化搜索：让最强 Harness 存活', desc: 'AlphaEvolve / DGM / SIA——用进化算法在庞大设计空间中发现最优 Agent', tag: '前沿' },
          ],
        },
        {
          id: 't-harness-future',
          title: '未来与反思',
          desc: '自我改进面临的根本挑战',
          lessons: [
            { file: '11-7.html', title: '未来挑战：自我改进的七道关', desc: '弱评估器 / 记忆退化 / 奖励黑客 / 多样性坍缩 / 人类角色——通往完整 RSI 的瓶颈', tag: '前沿' },
          ],
        },
      ],
    },
    {
      id: 'p6',
      num: '第六篇章',
      title: '解剖 Grok Build：Rust 写的生产级 Coding Agent',
      desc: '基于 xAI 公开的 Grok Build Rust 源码，沿着 79 个 Workspace 成员拆解 Coding Agent 的运行时、工具、记忆、安全与扩展设计。',
      color: '#f59e0b',
      topics: [
        {
          id: 't-grok-map',
          title: '系统地图',
          desc: '79 个 Workspace 成员的分层架构与 Rust 选型',
          lessons: [
            { file: '12-1.html', title: '79 个 Workspace 成员如何组成产品', desc: '按入口、Agent 运行时、工具和基础设施还原 Cargo Workspace 的真实分层', tag: '架构' },
            { file: '12-2.html', title: 'Rust 技术选型：事实与推断', desc: '从源码可验证事实出发，分析类型系统、并发安全和分发方式带来的工程取舍', tag: '概念' },
            { file: '12-3.html', title: '从真实 main() 到第一轮采样', desc: '追踪入口、会话创建、提示词渲染、模型采样与流式返回的完整调用链', tag: '深入' },
          ],
        },
        {
          id: 't-grok-core',
          title: 'Agent 核心循环',
          desc: 'Session Actor、Compaction 与 System Prompt',
          lessons: [
            { file: '12-4.html', title: 'Session Actor：线程、状态与取消边界', desc: '梳理会话状态所有权、消息流转、后台任务与 CancellationToken 的中断路径', tag: '深入' },
            { file: '12-5.html', title: 'Compaction：85% 阈值与可选 two-pass', desc: '核对自动压缩阈值、memory flush、two-pass 和超时预算的真实配置', tag: '交互' },
            { file: '12-6.html', title: 'PromptContext：可检查的渲染输入', desc: '拆解可序列化上下文、TemplateOverride 和 TemplateRenderer 的模板渲染边界', tag: '概念' },
          ],
        },
        {
          id: 't-grok-tools',
          title: '工具系统',
          desc: '注册表、分类学与内置工具集',
          lessons: [
            { file: '12-7.html', title: '进程级外部 Toolset Preset 注册表', desc: '理解构建函数、Public 与 Internal 可见性，以及晚注册对后续解析的影响', tag: '架构' },
            { file: '12-8.html', title: 'ToolKind 提供默认只读语义', desc: '从枚举与 is_read_only() 追踪只读默认值和能力过滤边界', tag: '设计模式' },
            { file: '12-9.html', title: '实现族、注册表与动态 MCP', desc: '区分内置工具实现族、静态注册表与运行时发现的 MCP 工具', tag: '深入' },
            { file: '12-10.html', title: 'Canonical input 是稳定投影', desc: '用 CanonicalToolMeta 和输入投影解释跨工具实现的稳定合约', tag: '案例' },
          ],
        },
        {
          id: 't-grok-memory',
          title: '上下文与记忆',
          desc: 'Token 估算、混合检索与 Dream 机制',
          lessons: [
            { file: '12-11.html', title: '估算、百分比与严格阈值', desc: '区分 Token 估算、使用率计算和 exceeds_threshold 的严格比较语义', tag: '交互' },
            { file: '12-12.html', title: '从文件变更到混合排序', desc: '追踪 FTS、向量检索、时间衰减和 MMR 重排组成的记忆召回流水线', tag: '深入' },
            { file: '12-13.html', title: 'Dream 的真实机制', desc: '核对空闲门控、DreamLock、后台整理和记忆写回的实际边界', tag: '前沿' },
          ],
        },
        {
          id: 't-grok-subagent',
          title: '子 Agent 与多 Agent',
          desc: 'Agent 定义 + Persona 叠加的两层体系',
          lessons: [
            { file: '12-14.html', title: 'AgentDefinition 与 Persona 如何合并', desc: '拆解 Agent 定义、Persona 覆盖与最终会话行为的合并顺序', tag: '设计模式' },
            { file: '12-15.html', title: '子 Agent 的四个隔离维度', desc: '从上下文来源、恢复模式、工作树和任务状态分析隔离边界', tag: '深入' },
            { file: '12-16.html', title: '多 Agent 的组织方式', desc: '基于公开证据比较 Agent、Persona、协调者与并行任务的组织方式', tag: '案例' },
          ],
        },
        {
          id: 't-grok-security',
          title: '权限、沙箱与安全',
          desc: '内核级沙箱、权限演进与 Hooks 拦截',
          lessons: [
            { file: '12-17.html', title: '五种沙箱 Profile', desc: '比较 workspace、devbox、read-only、strict、off 与自定义 Profile 的边界', tag: '安全' },
            { file: '12-18.html', title: '从工具请求到受限执行', desc: '沿 ToolKind、权限决策和平台沙箱追踪完整授权链', tag: '安全' },
            { file: '12-19.html', title: 'Hooks：明确 deny 才阻断', desc: '核对生命周期事件、matcher、PreToolUse 阻断和故障 fail-open 语义', tag: '实战' },
          ],
        },
        {
          id: 't-grok-eco',
          title: 'MCP 与生态',
          desc: 'MCP 客户端、OAuth、连接恢复与插件信任',
          lessons: [
            { file: '12-20.html', title: 'MCP 连接、发现与恢复', desc: '确认客户端角色，拆解 OAuth、工具命名、能力发现、状态合并与重连', tag: '深入' },
            { file: '12-21.html', title: 'Plugin Marketplace 的发现与信任', desc: '区分目录、安装、运行时发现、启用状态与插件根信任', tag: '架构' },
          ],
        },
        {
          id: 't-grok-beyond',
          title: '超越源码',
          desc: '完整对照、经验教训与设计启示',
          lessons: [
            { file: '12-22.html', title: 'Grok Build 与 Claude Code 证据化对照', desc: '按源码、仓库文档和公开产品行为完成多维比较，保留未知项', tag: '汇总' },
            { file: '12-23.html', title: 'Grok Build 工程复盘与证据边界', desc: '用类型、状态机、测试和仓库政策复盘工程优点与适用限制', tag: '收官' },
            { file: '12-24.html', title: 'Coding Agent 设计工作台', desc: '围绕九个系统维度输出架构决定、故障路径、验证方式和结课成果', tag: '收官' },
          ],
        },
      ],
    },
  ],
};

/* ── 标签配色 ── */
window.TAG_STYLE = {
  '交互':   { bg: '#dcfce7', fg: '#15803d' },
  '动画':   { bg: '#dcfce7', fg: '#166534' },
  '概念':   { bg: '#fef9c3', fg: '#a16207' },
  '案例':   { bg: '#fef2f2', fg: '#dc2626' },
  '开篇':   { bg: '#fef2f2', fg: '#dc2626' },
  '安全':   { bg: '#fef2f2', fg: '#dc2626' },
  '反例':   { bg: '#fef2f2', fg: '#dc2626' },
  '实战':   { bg: '#dbeafe', fg: '#1d4ed8' },
  'PM 进阶':{ bg: '#dbeafe', fg: '#1d4ed8' },
  '系统设计':{ bg: '#dbeafe', fg: '#1d4ed8' },
  '深入':   { bg: '#ffedd5', fg: '#ea580c' },
  '多模态': { bg: '#fef3c7', fg: '#92400e' },
  '选型':   { bg: '#fef3c7', fg: '#d97706' },
  '提示词工程': { bg: '#e0f2fe', fg: '#0369a1' },
  'RAG':    { bg: '#f3e8ff', fg: '#7e22ce' },
  '架构':   { bg: '#dcfce7', fg: '#166534' },
  '汇总':   { bg: '#ede9fe', fg: '#6d28d9' },
  '收官':   { bg: '#fef9c3', fg: '#a16207' },
  '技巧':   { bg: '#ecfdf5', fg: '#065f46' },
  '设计模式':{ bg: '#fef2f2', fg: '#dc2626' },
  '方法论': { bg: '#fff7ed', fg: '#c2410c' },
  '前沿':   { bg: '#f3e8ff', fg: '#7c3aed' },
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
