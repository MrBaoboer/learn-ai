/* Chapter 4 Quiz Bank · Advanced: AI Engineering Design Patterns (50 questions: single-choice 30 / multiple-choice 14 / true-false 6)
   g = question group number (this chapter uses 401–450), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 401,
  "type": "single",
  "q": "According to Anthropic's definition, what is the core distinction between Workflows and Agents?",
  "opts": [
   "Workflows are controlled by developers through predefined code paths; Agents let the model dynamically decide the execution flow and tool usage at each step",
   "Workflows can only run a single LLM call sequentially; only Agents support multiple LLMs collaborating on the same task",
   "Workflows cannot call external tools; the defining trait of an Agent is the ability to call tools",
   "Workflows suit complex tasks while Agents suit simple ones — they are differentiated by task difficulty"
  ],
  "ans": 0,
  "exp": "The dividing line is about control: a Workflow's execution order is fixed at write-time — high determinism, controllable cost, easy to debug. An Agent lets the model autonomously decide what to do next, whether to call tools, and when to stop — flexible but unpredictable. Both can chain multiple calls and connect to tools; task difficulty has nothing to do with the distinction."
 },
 {
  "g": 402,
  "type": "single",
  "q": "When facing a new requirement, what is the correct order of the 'complexity ladder' recommended by the course?",
  "opts": [
   "Jump straight to an Agent framework to guarantee the highest capability ceiling so any future requirement can be handled",
   "First try optimizing a single LLM call; if not enough, add RAG; if still insufficient, use a Workflow; only reach for an Agent when flexible decision-making is truly required",
   "Start with a Workflow to ensure a controlled process, then gradually simplify back to single calls to save cost",
   "Develop the single-call solution and the Agent solution in parallel, then decide which to keep via A/B testing"
  ],
  "ans": 1,
  "exp": "The course stresses that 'complexity is a cost, not a feature': most scenarios are solved by optimizing a single call plus retrieval augmentation; only when simpler options clearly fall short should you upgrade. A common over-engineering mistake is using an Agent framework to solve a problem that a Prompt plus one search could handle — the added latency, cost, and unpredictability far outweigh the benefit."
 },
 {
  "g": 403,
  "type": "single",
  "q": "What does the 'One-shotting' failure mode refer to in long-running tasks?",
  "opts": [
   "An Agent tries to complete all functionality in a single session; the context runs out mid-way, and the next Agent faces a half-finished product with no idea what was done",
   "An Agent declares the project complete after implementing only 30% of core features, lacking a task checklist and end-to-end verification",
   "An Agent retries the same failing approach on the same feature repeatedly, falling into an infinite loop it cannot exit",
   "An Agent implements only one feature at a time, progresses too slowly, and ultimately fails because it exceeds the time budget"
  ],
  "ans": 0,
  "exp": "One-shotting means trying to do too much at once: the context window runs out halfway through implementation, and the next Agent wastes a lot of time fixing the half-baked work, stalling progress even with Compaction. Option B describes a different failure mode called Premature Completion; implementing one feature at a time is actually the correct solution."
 },
 {
  "g": 404,
  "type": "single",
  "q": "What is the key difference between the Orchestrator-Workers pattern and the Parallelization pattern?",
  "opts": [
   "In Orchestrator-Workers the sub-tasks are dynamically decomposed by the orchestrator LLM at runtime; in Parallelization the parallel sub-tasks are predefined in code",
   "In Orchestrator-Workers the Workers can communicate and collaborate with each other; in Parallelization the parallel calls are completely isolated",
   "Orchestrator-Workers requires all Workers to use the same model; Parallelization can assign different models to each parallel branch",
   "Orchestrator-Workers does not need to merge Worker results; Parallelization must aggregate all outputs at the end"
  ],
  "ans": 0,
  "exp": "The distinction is whether sub-tasks are known in advance: Parallelization's breakdown is hard-coded, while Orchestrator-Workers has the orchestrator dynamically decide how many and what kind of Workers to dispatch based on the input — for example, analyzing a codebase before deciding how to divide the internationalization work. This makes it the Workflow pattern closest to being an Agent. Both patterns ultimately need to merge results."
 },
 {
  "g": 405,
  "type": "single",
  "q": "What is the relationship between 'Context Engineering' and 'Prompt engineering'?",
  "opts": [
   "They are different names for the same thing and focus on exactly the same objects",
   "Prompt engineering optimizes how prompts are written; Context Engineering curates the entire set of Tokens sent to the model each reasoning turn — writing good prompts is just one part of it",
   "Context Engineering refers specifically to training techniques that expand a model's context window, unrelated to product and application engineering",
   "Prompt engineering handles text input; Context Engineering is specifically about managing multimodal inputs such as images and audio"
  ],
  "ans": 1,
  "exp": "Context Engineering addresses a larger problem: what to put in the model's input window — System Prompt, tool definitions, conversation history, retrieval results, and user state — how to put it, and how much. Because of Context Rot, limited attention budgets, and the fact that attention computation scales quadratically with Token count, the goal is to find the smallest high-signal Token set."
 },
 {
  "g": 406,
  "type": "single",
  "q": "When performing Compaction (context compression), which type of information is high-risk and should not be discarded lightly?",
  "opts": [
   "Old file listings and search outputs from tool calls",
   "Intermediate execution step records for completed tasks",
   "The reasoning behind architectural decisions and descriptions of unresolved bugs",
   "Greeting text and formatting instructions at the start of the conversation"
  ],
  "ans": 2,
  "exp": "The key decision in compression is what to keep and what to discard: clearing old tool-call results is a low-risk operation that usually doesn't affect subsequent reasoning; but once the reasoning behind architectural decisions or descriptions of unresolved bugs are lost, the Agent will repeat the same mistakes. Claude Code's practice is precisely to retain architectural decisions and unresolved bugs while discarding redundant file content output."
 },
 {
  "g": 407,
  "type": "single",
  "q": "What is the core value of the sub-Agent architecture (one of the 'Three Core Techniques')?",
  "opts": [
   "Sub-Agents explore deeply in isolated contexts and only return refined summaries to the main Agent — their working drafts don't pollute the main context",
   "Sub-Agents can use a larger context window than the main Agent, thereby breaking through the model's Token limit",
   "Sub-Agents pass back the complete exploration process verbatim to the main Agent to ensure zero information loss",
   "The primary role of sub-Agents is to back up the main Agent's state in real time and seamlessly take over if the main Agent crashes"
  ],
  "ans": 0,
  "exp": "The core value is separation of concerns combined with context isolation: a sub-Agent might internally consume 30,000 Tokens reading code and reasoning, but reports only a 1,500-Token summary back up — the main Agent's context stays lean, and multiple sub-Agents can explore in parallel. Like department managers spending a week on research and delivering just a one-page memo to the CEO."
 },
 {
  "g": 408,
  "type": "single",
  "q": "Regarding 'pre-loading' versus 'JIT on-demand retrieval' of context information, what is the best practice given by the course?",
  "opts": [
   "Load everything upfront: load all project docs and history at the start of the session to avoid any extra tool calls",
   "Retrieve everything on demand: wait until any piece of information is needed before fetching it, keeping only the System Prompt in context",
   "Pre-load high-frequency information (project conventions, core rules, user preferences); retrieve long-tail information (specific file contents, API docs) on demand via grep search or RAG",
   "Let the model itself decide when to load each piece of information; the engineering side imposes no preset strategy"
  ],
  "ans": 2,
  "exp": "The hybrid strategy is analogous to browser caching: hot data goes in memory (pre-load), cold data is fetched on demand (JIT — e.g., glob/grep for files, RAG for docs). Pre-loading is immediately available but consumes Tokens whether used or not; JIT keeps context lean but adds one call's latency. The goal is to maximize context hit rate."
 },
 {
  "g": 409,
  "type": "single",
  "q": "In SWE-bench practice, changing the path parameter of the edit_file tool from accepting relative paths to accepting only absolute paths illustrates which ACI design principle?",
  "opts": [
   "Give the model enough Token space to think clearly — put directional parameters before complex content",
   "Match the format to the model's training data, adopting standard formats the model has seen countless times",
   "Poka-yoke mistake-proofing: make errors harder to make by changing how the tool is designed",
   "Avoid unnecessary format overhead — don't force the model to do mechanical operations like counting lines"
  ],
  "ans": 2,
  "exp": "Poka-yoke originates from the Toyota Production System: rather than expecting the model not to make mistakes, make the tool itself hard to misuse. Agents frequently got the current working directory wrong; accepting only absolute paths eliminates the ambiguity at the source — a single parameter design change turned frequent errors into near-perfect performance. The other three options correspond to the other three principles."
 },
 {
  "g": 410,
  "type": "single",
  "q": "What is the essence of the Think Tool?",
  "opts": [
   "A special tool with no side effects that only appends the Agent's thoughts to the log, letting it pause mid-tool-chain to organize its thinking",
   "A web-search tool that helps the Agent look up the latest policy documents and reference materials before making a decision",
   "Another name for Extended Thinking — letting the model do a one-time deep think before generating its reply",
   "A caching tool that compresses and stores the results of previous tool calls for reuse in subsequent steps"
  ],
  "ans": 0,
  "exp": "The Think Tool doesn't query databases, call APIs, or change any state — its only function is to let the Agent write down its thoughts. Its division of labor with Extended Thinking is clear: Extended Thinking happens before a response is generated; the Think Tool's value is in pausing mid-way through a long chain, making it suited for complex tool chains, strategy-intensive scenarios, and serially dependent decisions."
 },
 {
  "g": 411,
  "type": "single",
  "q": "What is the three-step workflow of 'using an Agent to optimize an Agent's tools'?",
  "opts": [
   "Prototype — use Claude Code to generate a tool prototype; Evaluate — build an evaluation system to measure performance systematically; Optimize — have it read the eval results and improve automatically, looping until it meets the bar",
   "Design — humans design the tool spec; Review — an Agent inspects code quality; Deploy — ship directly and collect real user feedback",
   "Generate — batch-generate candidate tools; Vote — multiple models vote to select the best; Merge — merge the highest-voted implementation",
   "Train — fine-tune the model with tool-call data; Test — run unit tests to verify; Release — publish the new tool version"
  ],
  "ans": 0,
  "exp": "This workflow makes the Agent its own tool product manager: after Claude Code runs an eval, it can pinpoint precisely that '43% of errors are because the Agent confuses search and list,' then automatically rewrite the tool description to fix it — much faster than humans debugging by intuition. If the eval target isn't met, repeat the loop."
 },
 {
  "g": 412,
  "type": "single",
  "q": "What is the key advice given by the course for getting started with an evaluation system?",
  "opts": [
   "Accumulate several hundred test cases before starting — evaluations with too few samples lack statistical significance",
   "Start with 20 carefully designed Tasks covering the most critical scenarios — the key is to start; quantity is secondary",
   "Outsource evaluations to a third-party organization — in-house self-testing creates conflicts of interest",
   "Rely primarily on intuitive feedback gathered from internal engineers' daily usage — quantitative evaluation can be postponed indefinitely"
  ],
  "ans": 1,
  "exp": "The course is explicit: a team with 20 evals is an entire era ahead of a team with 0 evals but 'plans to do 500.' The process of writing evals forces the team to define what success looks like — which is itself a form of product understanding. Claude Code evolved from fuzzy dogfooding intuition into systematic evaluation in exactly this way."
 },
 {
  "g": 413,
  "type": "single",
  "q": "For scenarios with clear right-or-wrong criteria — such as checking whether generated code compiles or whether API return values are correct — which Grader should be the first choice?",
  "opts": [
   "A model Grader, letting a judge LLM understand the code's intent and score it holistically according to a Rubric",
   "A human Grader, with senior domain experts reviewing each item one by one to ensure the highest quality",
   "A code Grader, using program logic to determine correctness automatically — millisecond speed, near-zero cost, reproducible results",
   "All three Graders score every item simultaneously and the average is taken to ensure robust conclusions"
  ],
  "ans": 2,
  "exp": "Deterministic tasks with clear correct answers are the home turf of code Graders: string matching, unit tests, tool-call verification — fast and objective, suitable for CI/CD automation. Model Graders handle subjective quality such as writing style and logic; human Graders handle calibration and high-risk scenarios. The recommended hybrid strategy is code Graders for the baseline, model Graders for extension, and periodic human calibration — not all three on every item."
 },
 {
  "g": 414,
  "type": "single",
  "q": "What is the correct relationship between Session and Context Window?",
  "opts": [
   "Session is a persistent append-only log of all events; Context Window is the temporary working memory used for the current inference — the former is like a hard drive, the latter like RAM",
   "They are two names for the same data — Session refers to the contents of the current context window",
   "Context Window handles persistent storage of all history; Session is a temporary cache that is cleared when the session ends",
   "Session capacity is limited by the model's context length — events beyond the limit are automatically discarded by the system"
  ],
  "ans": 0,
  "exp": "The two must be separated: Compaction and Trimming are irreversible operations — it's hard to know in advance which Tokens will matter later, so raw events must be permanently preserved in the Session. The Context Window is just a temporary viewport into the Session. The Session only grows, has no size limit; losing the Context is fine because it can always be rebuilt from the Session."
 },
 {
  "g": 415,
  "type": "multi",
  "q": "Which of the following are among the five Workflow patterns summarized by the industry? (Select all that apply)",
  "opts": [
   "Prompt Chaining",
   "Evaluator-Optimizer",
   "Chain-of-Thought",
   "Routing",
   "Fine-tuning"
  ],
  "ans": [0, 1, 3],
  "exp": "The five Workflow patterns are Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, and Evaluator-Optimizer, arranged from simple to complex, each solving a specific type of problem. Chain-of-Thought is a prompting technique; Fine-tuning is a model training method — both fall outside the concept of Workflow orchestration patterns."
 },
 {
  "g": 416,
  "type": "multi",
  "q": "According to ACI best practices, what should a good tool description include? (Select all that apply)",
  "opts": [
   "Concrete input/output examples so the model knows how to use it at a glance",
   "Boundary clarifications compared with similar tools, indicating when to use another tool instead",
   "The complete source code of the tool's internal implementation so the model can understand the execution logic",
   "As vague a functional description as possible, leaving room for the model to improvise",
   "Input format requirements — e.g., whether paths should be absolute or relative, what standard to use for dates"
  ],
  "ans": [0, 1, 4],
  "exp": "The course recommends writing documentation as if for 'a smart junior developer with no context': include example usage, boundary cases, input format requirements, differences from other tools, and when not to use this tool. A vague description (e.g., 'Search for things') makes it impossible for the model to distinguish between tools; internal source code is an implementation detail that only wastes Tokens when stuffed into the description."
 },
 {
  "g": 417,
  "type": "multi",
  "q": "Which of the following are real pitfalls of evaluation systems mentioned in the course? (Select all that apply)",
  "opts": [
   "Infrastructure noise: simply changing the sandbox CPU/memory configuration can cause score differences of up to 6 percentage points, even reversing model rankings",
   "Model recognition of tests: strong models can infer they are running a benchmark and then search for answers or recall training data",
   "Change-induced regression: a System Prompt tweak to reduce verbosity caused the coding eval to drop by about 3%",
   "Evaluation fatigue effect: models become fatigued from continuous testing and scores decline linearly with the number of test rounds"
  ],
  "ans": [0, 1, 2],
  "exp": "The first three all have real-world sources: Terminal-Bench found that sandbox configuration itself is a hidden test variable; Claude Opus 4.6 recognized the evaluation pattern on BrowseComp; Claude Code's verbosity-fix incident shows that improving one dimension does not equal overall improvement — changes should be ablated line by line and run against the full suite. 'Evaluation fatigue' is a made-up concept — models have no fatigue state across test rounds."
 },
 {
  "g": 418,
  "type": "multi",
  "q": "In the dual-role Harness design, which of the following are responsibilities of the Initializer Agent? (Select all that apply)",
  "opts": [
   "Creating the init.sh script to set up the development environment",
   "Expanding the user's high-level prompt into a detailed feature list in JSON format",
   "Running every round to implement one feature at a time and continuously making progress",
   "Making the first git commit to ensure the repository is in a clean state",
   "Lowering the test standards appropriately when feature tests fail to make them pass"
  ],
  "ans": [0, 1, 3],
  "exp": "The Initializer Agent runs only in the first round, responsible for going from zero to one: setting up the environment, writing the claude-progress.txt progress file, expanding the high-level prompt into a feature checklist, and making the initial commit. The Coding Agent runs every round and implements one feature at a time. Lowering test standards is explicitly prohibited by strong wording in the Prompt — otherwise the Agent would lower the bar just to make tests pass."
 },
 {
  "g": 419,
  "type": "multi",
  "q": "According to the three-category safety risk framework, which of the following fall under 'Model Misbehavior'? (Select all that apply)",
  "opts": [
   "The user only asked to view a file, but the model modified it on its own initiative",
   "The model executed a real operation based on hallucinated fabricated information",
   "Malicious instructions embedded in a web page hijacked the Agent's behavior",
   "A user deliberately induced the Agent to generate a phishing email",
   "The Agent entered an infinite loop and could not stop"
  ],
  "ans": [0, 1, 4],
  "exp": "Misbehavior refers to spontaneous erroneous behavior by the model — no one directed it to: over-action, hallucination-driven operations, permission violations, and inability to stop all fall into this category. Malicious instructions embedded in a web page is Prompt Injection — an external attack; a user deliberately inducing the Agent to generate phishing emails is user Misuse. The mitigation strategies for the three categories differ, and classification is the first step in designing a security architecture."
 },
 {
  "g": 420,
  "type": "judge",
  "q": "In the Managed Agent brain-hand separation architecture, if the sandbox container crashes, the entire session is lost and the task completely fails.",
  "ans": false,
  "exp": "This was the problem with the old approach (pet mode): Session, Harness, and Sandbox all lived in the same container — if the container went down, everything was gone. After brain-hand separation, each component is deployed independently; a container crash only appears as a tool call returning an error. Claude can decide to retry and spin up a new container to continue, while the Session as a persistent log is always preserved — this is the reliability of the 'cattle mode'."
 },
 {
  "g": 421,
  "type": "judge",
  "q": "A Git Token is injected into the remote URL when cloning a repository; the Agent inside the sandbox can normally execute push and pull, but cannot directly read the Token's value.",
  "ans": true,
  "exp": "This is the 'bound to resource' credential isolation pattern: the Token is embedded deep in the Git configuration and never exists as a readable environment variable — the Agent can use it but cannot see it. Another approach is the Vault proxy pattern, where the Token is stored in an external vault and injected into request headers by a proxy based on the Session ID. The core principle is that generated code and credentials must never coexist in the same place."
 },
 {
  "g": 422,
  "type": "judge",
  "q": "Contextual Retrieval — layering Contextual Prefix Embedding, Contextual BM25, and Reranking — can reduce the retrieval failure rate by approximately 67%.",
  "ans": true,
  "exp": "Course figures: using Contextual Embeddings alone reduces failure by 49%; layering all three achieves 67%. It solves the fundamental problem of traditional RAG: chunks lose their original document context once cut out, so an LLM generates a context prefix for each chunk before vectorization. The trade-off is one extra LLM call per chunk, which can be offset by Prompt Caching."
 },
 {
  "g": 423,
  "type": "judge",
  "q": "Since models keep getting stronger, engineering investments like evaluation systems and sandbox isolation will quickly become obsolete — it's best not to build them in the first place.",
  "ans": false,
  "exp": "The course's conclusion is precisely the opposite: what goes obsolete as models improve is specific Prompt tricks and workarounds tailored to particular models (such as context resets added for context anxiety). Sandbox isolation, layered permissions, and evaluation systems are durable architectural decisions that will not become obsolete. The truly important engineering skill is distinguishing which logic will go stale from what deserves long-term investment."
 },
 {
  "g": 424,
  "type": "judge",
  "q": "The bigger the context window, the more you should pre-fill it with all potentially useful information — the more complete the information, the better the model performs.",
  "ans": false,
  "exp": "Context is a scarce resource; treating it as an infinite trash bin only backfires: the longer the context, the lower the model's retrieval accuracy (Context Rot); attention computation scales quadratically with Token count; irrelevant Tokens dilute the attention available to useful ones. The correct goal is to find the smallest high-signal Token set where every Token contributes to reasoning."
 },
 {
  "g": 425,
  "type": "single",
  "q": "Compared with Workflows, what are the typical characteristics of Agent systems in terms of cost and debugging?",
  "opts": [
   "Cost is unpredictable because the number of loops is unknown in advance; debugging difficulty is high because behavior is non-deterministic and hard to reproduce",
   "Cost is fixed because every run goes through a complete set of steps; debugging difficulty is low because execution logs are naturally comprehensive",
   "Cost is lower because the model automatically skips unnecessary steps; debugging difficulty is roughly comparable to Workflows",
   "Cost and debugging difficulty depend on the chosen development framework, not on whether the architecture is a Workflow or Agent"
  ],
  "ans": 0,
  "exp": "A Workflow's number of calls is fixed at write-time — with a determined input, the execution path is determined, making issues easy to reproduce. In an Agent, every step is decided by the model in the moment; how many loops will run is unknown in advance, and the same input may take completely different paths. This is exactly why the course calls complexity a cost. Products like Cursor, Claude Code, and Devin all bear this uncertainty."
 },
 {
  "g": 426,
  "type": "single",
  "q": "In Prompt Chaining, what is the purpose of inserting a 'Gate (quality checkpoint)' between two adjacent steps?",
  "opts": [
   "To programmatically check the output of the previous step and only proceed to the next step if it passes",
   "To cache the output of the previous step and avoid calling the same model again in the next step",
   "To switch models between two steps, letting a cheaper model handle the subsequent processing",
   "To convert two originally sequential steps into parallel execution and thereby reduce the total latency of the chain"
  ],
  "ans": 0,
  "exp": "A Gate is a programmatic quality checkpoint in the chain — for example, checking whether the marketing copy generated in step one includes the required brand keywords before proceeding. Prompt Chaining's trade-off is latency for accuracy; the Gate is the key design that makes that extra latency buy back controllable quality."
 },
 {
  "g": 427,
  "type": "single",
  "q": "A customer service system uses a classifier to route simple FAQs to Haiku, refund issues to Sonnet with an order tool, and technical faults to Sonnet with log queries. Which Workflow pattern does this illustrate?",
  "opts": [
   "Routing: separation of concerns plus cost optimization — each branch handles only one category of input, and simple questions use cheaper models",
   "Parallelization: multiple models answer the same question simultaneously and vote, using redundancy to achieve higher confidence",
   "Orchestrator-Workers: an orchestrator LLM dynamically decides at runtime how many processing branches to open",
   "Evaluator-Optimizer: the generated result is repeatedly judged and iterated until quality meets the bar"
  ],
  "ans": 0,
  "exp": "Routing first classifies then directs to a specialized branch; each branch can have its own independent Prompt, model, and tools, striking a balance between cost and effectiveness. Option B describes the Voting sub-mode of Parallelization, C is the dynamic decomposition of Orchestrator-Workers, and D is the iterative loop of Evaluator-Optimizer."
 },
 {
  "g": 428,
  "type": "single",
  "q": "Of the two sub-modes of Parallelization, what is the difference between Sectioning and Voting?",
  "opts": [
   "Sectioning splits a task into independent sub-tasks processed separately and merged; Voting runs the same Prompt on the same task multiple times to take the majority or best result",
   "Sectioning's breakdown is predefined in code; Voting's breakdown is determined at runtime by an orchestrator LLM",
   "Sectioning aims to improve result confidence; Voting aims to reduce end-to-end processing time",
   "Sectioning must execute each section serially; only Voting is a truly parallel invocation"
  ],
  "ans": 0,
  "exp": "The course examples are clear: in a code review, one LLM checks for security vulnerabilities, one checks for performance, and one checks for code style — that's Sectioning; having three LLMs each judge whether the same piece of text violates a rule and taking the majority is Voting. Both are predefined in code and both use parallel calls; Sectioning mainly speeds things up, Voting mainly reduces randomness."
 },
 {
  "g": 429,
  "type": "single",
  "q": "Expanding the context from 50K Tokens to 100K Tokens roughly multiplies self-attention computation by how much?",
  "opts": [
   "About 1x — attention computation depends only on model parameter count, unrelated to Token count",
   "About 2x — attention computation grows linearly in proportion to Token count",
   "About 4x — attention complexity is O(n²), so doubling the context quadruples the computation",
   "About 8x — attention complexity is O(n³), so doubling the context multiplies computation by eight"
  ],
  "ans": 2,
  "exp": "Transformer self-attention requires every Token to compute relevance against every other Token, producing n × n attention relationships for n Tokens. This is why the course says context isn't free: every extra irrelevant Token wastes attention that other Tokens could have received."
 },
 {
  "g": 430,
  "type": "single",
  "q": "The course says a System Prompt should find the 'right altitude.' What exactly is this sweet spot?",
  "opts": [
   "Provide a clear role definition and 5 to 10 core principles, then trust the model to make autonomous judgments within that framework",
   "Keep it as short as possible — 'You are a helpful assistant' gives the model maximum flexibility",
   "Be as exhaustive as possible — list 50 rules and 100 edge cases to hard-code every possible situation",
   "Dynamically rewrite the System Prompt every round so it always aligns perfectly with the current user question"
  ],
  "ans": 0,
  "exp": "Too vague leaves the model directionless and produces generic output; too specific over-constrains the model so it can't handle new situations flexibly. The course's analogy is a good manager: give direction, not step-by-step instructions. Options B and C are the two extremes on either side of the sweet spot."
 },
 {
  "g": 431,
  "type": "single",
  "q": "When using the Structured Note-taking strategy, why must the note format be fixed and structured?",
  "opts": [
   "Free-prose notes cost extra Tokens to interpret when read back, canceling out the benefit of externalizing memory",
   "A fixed format makes note files smaller, significantly reducing long-term disk storage costs",
   "Only structured notes can be compressed by Compaction — free-prose notes cannot be summarized",
   "A structured format allows notes to serve directly as a vector retrieval index, eliminating the Embedding step"
  ],
  "ans": 0,
  "exp": "The value of notes lies in being able to cheaply read back memories after a context reset; writing them in free prose means the Agent must spend Tokens understanding the notes themselves every time it reads them. The TODO list maintained by Claude Code, and the game notes Claude kept when playing Pokémon — recording map positions, items obtained, and next steps — are all written in fixed structures."
 },
 {
  "g": 432,
  "type": "single",
  "q": "The course emphasizes a fundamental difference between Agent tools (ACI) and traditional APIs. What is that difference?",
  "opts": [
   "Traditional APIs are deterministic — the execution path is identical for the same call; Agent tools are non-deterministic — the model must judge when to use them and how",
   "Traditional APIs can only return results synchronously; Agent tools must support async and streaming returns to be consumed by a model",
   "Traditional APIs are called by developers; Agent tools can only be called by models and the two cannot share the same backend implementation",
   "Traditional API parameters are strongly typed; Agent tool parameters are always free-form text and cannot be validated"
  ],
  "ans": 0,
  "exp": "A developer hard-codes one weather query and the execution path is always the same; but when a user asks 'Should I bring an umbrella?', the Agent must judge which city the user is in, whether to call a tool this round, whether to fetch current or forecast weather, and whether to pass the city as Chinese or English. Because the path is non-deterministic, the name, parameters, and description quality of a tool directly determine the Agent's capability ceiling."
 },
 {
  "g": 433,
  "type": "single",
  "q": "Among the four tool design principles, which practice corresponds to 'Avoiding unnecessary format overhead'?",
  "opts": [
   "Use a unique context string to match the target location, instead of requiring the model to fill in exact start and end line numbers",
   "Change the file path parameter from accepting relative paths to only accepting absolute paths, eliminating directory ambiguity at the source",
   "Use the standard unified diff format to describe file changes, instead of a custom team DSL",
   "Have the model write directional parameters like file_path and change_type first, and body content last"
  ],
  "ans": 0,
  "exp": "Models are poor at precise counting; forcing them to count lines or do JSON escaping only increases error rates — using a unique context string to locate bypasses these mechanical operations. Option B is Poka-yoke mistake-proofing, C is matching the training data format, and D is giving the model enough Token space to think clearly, each corresponding to one of the other three principles."
 },
 {
  "g": 434,
  "type": "single",
  "q": "Which scenario is least suited to introducing the Think Tool?",
  "opts": [
   "Simple one-step tool calls like checking the weather or reading a file",
   "Customer service scenarios that require simultaneously weighing 20 refund policies and 6 exception cases",
   "A long chain involving more than 5 tools where the Agent needs to reorganize information and reassess strategy mid-way",
   "Serial tasks where each decision depends on the previous result and requires contextual bridging"
  ],
  "ans": 0,
  "exp": "The Think Tool's value is in pausing mid-way through a long chain to organize thinking; adding it to a simple one-step operation is pure overhead. It's equally unsuitable for non-sequential tasks where steps are independent of each other, and for pure generation tasks like writing articles or translating that don't involve tool calls. Options B, C, and D are exactly three typical use cases."
 },
 {
  "g": 435,
  "type": "single",
  "q": "A tool query returned 847 complete records — approximately 52,000 Tokens — which the Agent simply cannot process. According to tool design principles, what is the correct fix?",
  "opts": [
   "Return only the top 10 records with core fields by default, along with the total count, current page number, and pagination hint",
   "Return all 847 records as-is and let the Agent filter the ones it needs from within the context",
   "Compress the return content into a single success status flag, letting the Agent query individual records as needed",
   "Split this query into 847 tool calls, each returning only one record"
  ],
  "ans": 0,
  "exp": "Techniques for lean returns include summarizing, truncating, paginating, and filtering. The course's positive example is returning the total count, the number of records currently shown, the page number, the top 10 with core fields, and a pagination hint — about 800 Tokens that the Agent can easily digest. Returning just a success status violates the principle of 'returning meaningful context' and leaves the Agent without the information it needs for the next step."
 },
 {
  "g": 436,
  "type": "single",
  "q": "In an evaluation system, why does a Trial need to run the same Task multiple times?",
  "opts": [
   "Because model output is random — running the same Task multiple times gives statistical significance",
   "Because each run consumes context, and running it multiple times gradually familiarizes the model with the question",
   "Because the Grader's scoring criteria need to go through multiple rounds of scoring to gradually converge and stabilize",
   "Because the Harness can only collect part of the Transcript per run — multiple runs are needed to piece together the complete trace"
  ],
  "ans": 0,
  "exp": "A Task is a test case containing input and success criteria; a Trial is one execution attempt of that Task. Model output has randomness — a single pass or failure could be coincidental; multiple Trials give a trustworthy conclusion. The Transcript records the complete execution trace; the Harness is responsible for creating the sandbox, launching the Agent, and collecting results — each has its own role."
 },
 {
  "g": 437,
  "type": "single",
  "q": "When using a model Grader (LLM-as-Judge), how should the scoring Rubric be written?",
  "opts": [
   "Spell out the specific behavior for each score level — for example, 0 points for no answer or a serious factual error, 0.7 points for a complete and accurate answer but poor organization",
   "Give just one sentence — 'Score the output quality from 0 to 1' — and leave all judgment to the judge model to improvise",
   "Write only the criteria for a perfect score, letting the judge model infer how many points to deduct for other cases",
   "Skip the Rubric and just have the judge model align directly with historical human scores"
  ],
  "ans": 0,
  "exp": "Vague criteria are nearly useless — the judge model will produce drifting, unstable scores. The course's example spells out what each of 0, 0.3, 0.7, and 1 point looks like, giving the judge a clear reference. Model Graders already suffer from scoring bias and incomplete reproducibility; the more specific the Rubric, the more controllable those issues become."
 },
 {
  "g": 438,
  "type": "single",
  "q": "Given the phenomenon of models being able to recognize that they are running a benchmark, what mitigation direction does the course recommend?",
  "opts": [
   "Use dynamically generated test cases, restrict internet access, or replace public benchmarks with real business scenarios",
   "Reduce the model's reasoning intensity so it has no spare compute to infer that it is being tested",
   "Explicitly instruct the model in the System Prompt not to search for answers — prompting constraints are sufficient",
   "Abandon quantitative evaluation and revert to collecting intuitive feedback from internal engineers' daily usage"
  ],
  "ans": 0,
  "exp": "When a static benchmark meets an internet-connected environment, the model may simply be searching for answers or recalling training data — actual problem-solving ability isn't being tested. The stronger the model, the better it is at recognizing evaluations, so public benchmarks lose discriminating power against frontier models; the evaluation method itself must evolve. Prompting constraints and abandoning evaluation both fail to address the decline in discriminating power."
 },
 {
  "g": 439,
  "type": "single",
  "q": "In the dual-role Harness, why is the feature list recommended to be recorded in JSON format rather than Markdown?",
  "opts": [
   "The model is less likely to incorrectly modify structured JSON — Markdown tends to get casually rewritten by the model",
   "JSON consumes noticeably fewer Tokens than Markdown, saving a meaningful portion of the context budget",
   "Markdown cannot express nested structures like steps lists and passes status fields",
   "Git can only do incremental diffs on JSON files — Markdown is a full overwrite every commit"
  ],
  "ans": 0,
  "exp": "The feature list is the single authoritative state record passed between rounds — once an Agent casually rewrites it, the progress record becomes unreliable. JSON's structural constraints discourage casual modification; combined with strong wording in the Prompt such as 'do not delete or modify existing test content,' this prevents the Agent from lowering the bar just to make tests pass."
 },
 {
  "g": 440,
  "type": "single",
  "q": "After Managed Agent moves the brain (Harness) out of the container, what is the direct benefit?",
  "opts": [
   "The container becomes an ordinary tool call; the Harness doesn't have to wait for the container to be ready before starting to process, reducing first-token response time by ~60% at p50 and over 90% at p95",
   "Code execution speed inside the container improves by ~60% because the container no longer needs to allocate compute for model inference",
   "Session log volume shrinks by ~90% because events no longer need to be serialized and deserialized across processes",
   "The sandbox can directly read the model's attention state and thereby prefetch files the Agent will need next more precisely"
  ],
  "ans": 0,
  "exp": "After brain-hand separation, executing a command is just an ordinary function for the Harness — pass in name and parameters, receive a string. A container crash only manifests as a tool call error; Claude can decide to retry and spin up a new container. Because there's no need to wait for the container to finish booting before starting work, TTFT p50 drops by ~60% and p95 drops by over 90%."
 },
 {
  "g": 441,
  "type": "multi",
  "q": "What does the context window that the model sees during each round of inference typically contain? (Select all that apply)",
  "opts": [
   "System Prompt: role definition, rules, and constraints",
   "Tool Definitions: tool names, parameters, and descriptions",
   "All weight parameters the model learned during pre-training",
   "Retrieved Data: RAG retrieval results and loaded file contents",
   "All output Tokens the model is about to generate"
  ],
  "ans": [0, 1, 3],
  "exp": "The context window contains the System Prompt, tool definitions, conversation history, retrieved data, and user state — together, these are all the information the model sees during each inference. Pre-training weights are part of the model itself and do not occupy the context window; output Tokens that have not yet been generated obviously cannot be placed in the input in advance."
 },
 {
  "g": 442,
  "type": "multi",
  "q": "Which of the following are among the five tool design principles summarized in the course? (Select all that apply)",
  "opts": [
   "Choose the right tools: if two tools' use cases overlap by more than half, they should be merged",
   "Namespace: group related tools with a common prefix, e.g., jira_create_issue, jira_list_issues",
   "The more tools the better — provide a dedicated tool for every sub-operation",
   "Return meaningful context — don't just return an empty success status",
   "All tools must support async callbacks to avoid blocking the Agent's main loop"
  ],
  "ans": [0, 1, 3],
  "exp": "The five principles are: choose the right tools, namespace grouping, return meaningful context, Token efficiency, and engineer the tool description like a Prompt. Piling on more tools only increases confusion — if human developers can't distinguish search, find, and lookup, neither can an Agent. Async callbacks are an implementation detail; the course does not list them as a tool design principle."
 },
 {
  "g": 443,
  "type": "multi",
  "q": "Designing Session as a persistent event log with a getEvents() query interface enables which capabilities? (Select all that apply)",
  "opts": [
   "The Brain can read events from any range on demand, rewinding to re-read context before and after a specific decision point",
   "Events can be filtered by type — for example, extracting only all tool_use type events",
   "Context Window capacity automatically expands as the Session grows, breaking through the model's limit",
   "When switching the Harness or model, historical events are unaffected and can be reassembled into context according to the new strategy",
   "Compaction and Trimming can be completely eliminated — the context window can directly hold all historical events"
  ],
  "ans": [0, 1, 3],
  "exp": "Session provides a database-like query interface: the Brain can read from any position, rewind to a point in time, and filter by type. The Harness thus becomes a replaceable component, and different models can use different context strategies. Context Window capacity is determined by the model's limit and does not expand as the Session grows, so compression and trimming remain necessary."
 },
 {
  "g": 444,
  "type": "multi",
  "q": "In the dual-layer Containment strategy, which of the following belong to the Environment Layer defenses? (Select all that apply)",
  "opts": [
   "Sandbox isolation: code can only execute in a restricted environment",
   "Approval mechanisms: high-risk operations must receive human confirmation before being permitted",
   "Training the model's safety preferences via RLHF or Constitutional AI",
   "Network isolation: restricting the network range accessible to the Agent",
   "Training the model to proactively ask the user when uncertain"
  ],
  "ans": [0, 1, 3],
  "exp": "The Environment Layer uses system architecture to make dangerous operations simply unexecutable — through sandbox isolation, permission controls, approval mechanisms, and network isolation. Options C and E belong to the Model Layer, which uses training to incline the model toward safe behavior. The two layers are complementary: the Model Layer makes the Agent want to do the right thing; the Environment Layer ensures it can't do the wrong thing even if it tries."
 },
 {
  "g": 445,
  "type": "multi",
  "q": "Regarding the three-tier trust hierarchy in sandbox and credential isolation, which of the following descriptions are correct? (Select all that apply)",
  "opts": [
   "Tool-level is the finest-grained control — high-risk operations like file deletion and database writes can require per-operation human approval, while read-only operations like code search are auto-permitted",
   "Session-level grants permissions within a certain scope at the start of the session; the scope remains constant throughout the session and is automatically revoked when the session ends",
   "Global-level policies can be overridden by permissions granted by the user during a session, allowing temporary privilege escalation for urgent issues",
   "Global-level is the last line of defense — no matter what permissions are granted in a session, they cannot violate it, e.g., never accessing the production database",
   "The three-tier trust hierarchy only takes effect in development environments; in production, all operations are uniformly subject to human approval"
  ],
  "ans": [0, 1, 3],
  "exp": "The three tiers from fine to coarse are tool-level, session-level, and global-level. The global level is an organization-wide security policy at the outermost layer — user authorizations during a session cannot breach it, which is precisely what makes it the last line of defense. The three trust tiers combined with the OS-level sandbox's threefold isolation of filesystem, network, and processes form the security baseline for production environments."
 },
 {
  "g": 446,
  "type": "judge",
  "q": "Extended Thinking happens before the reply is generated; the Think Tool's thinking is interspersed between multiple tool calls.",
  "ans": true,
  "exp": "The division of labor lies precisely in the timing of thinking: Extended Thinking thinks everything through once at the beginning, then executes all the way through; the Think Tool lets the Agent pause between calling tool A and tool B to organize information. A December 2025 update further clarified: use Extended Thinking directly for simple tasks; the Think Tool's value is in pausing mid-way through a long chain."
 },
 {
  "g": 447,
  "type": "judge",
  "q": "When an Agent proactively announces that the project is complete, it has confirmed through end-to-end verification that all features are functional.",
  "ans": false,
  "exp": "This is exactly the Premature Completion failure mode: the Agent sees that some features have been implemented and assumes it's roughly done, when in reality it may have completed only 30% of core functionality. The root cause is the absence of a task checklist — the Agent doesn't know what's still missing and has no verification mechanism to prove it's truly done. The solution is to maintain a structured feature list and require end-to-end browser automation testing."
 },
 {
  "g": 448,
  "type": "judge",
  "q": "Contextual Retrieval requires one extra LLM call per chunk to generate a context prefix; different chunks from the same document can share the document-level content via Prompt Caching to reduce this cost.",
  "ans": true,
  "exp": "Pre-processing cost is the main trade-off of this approach and is non-trivial for large document libraries. Because all chunks from the same document share the same document-level context, Prompt Caching avoids re-sending the entire document repeatedly. This approach is better suited for scenarios with extremely high accuracy requirements, such as legal document retrieval, medical knowledge QA, and financial compliance queries."
 },
 {
  "g": 449,
  "type": "judge",
  "q": "The team once added a context reset mechanism for Claude Sonnet 4.5's context anxiety; after switching to Opus 4.5, this mechanism became overhead that reduced efficiency.",
  "ans": true,
  "exp": "This is the real case the course uses to illustrate 'the Harness encodes assumptions, and assumptions become outdated.' Sonnet 4.5 showed noticeable degradation as conversations grew longer, and periodically compressing the context was a targeted fix; on Opus 4.5 the anxiety disappeared and the patch became a burden. It reminds engineers: the scaffolding written today may need to be discarded tomorrow."
 },
 {
  "g": 450,
  "type": "judge",
  "q": "Human Graders produce the highest-quality feedback, so a mature evaluation system should have domain experts score all test cases one by one.",
  "ans": false,
  "exp": "The drawback of human Graders is precisely their lack of scalability: human time is limited, speed is hours to days, cost is high, and raters disagree with each other. Their correct role is periodic spot-check calibration of whether model Graders have drifted, establishing evaluation standards for entirely new scenarios, and final verification for high-risk decisions. The recommended division of labor is: code Graders for the baseline, model Graders for extending capability, and human Graders for calibration."
 }
];

window.EXAM_TOPICS_PART = {
 "401": {"name": "Workflow vs Agent", "file": "10-1.html"},
 "402": {"name": "Complexity Ladder Principle", "file": "10-1.html"},
 "403": {"name": "Long-Task Failure Modes", "file": "10-11.html"},
 "404": {"name": "Orchestrator vs Parallelization", "file": "10-2.html"},
 "405": {"name": "Context Engineering Methodology", "file": "10-3.html"},
 "406": {"name": "Compaction Trade-offs", "file": "10-4.html"},
 "407": {"name": "Sub-Agent Architecture Value", "file": "10-4.html"},
 "408": {"name": "Pre-load vs JIT Retrieval", "file": "10-4.html"},
 "409": {"name": "Poka-yoke Design Principle", "file": "10-5.html"},
 "410": {"name": "Think Tool Essence", "file": "10-6.html"},
 "411": {"name": "Tool Optimization Workflow", "file": "10-7.html"},
 "412": {"name": "Getting Started with Evals", "file": "10-8.html"},
 "413": {"name": "Code Grader Scenarios", "file": "10-9.html"},
 "414": {"name": "Session vs Context Window", "file": "10-14.html"},
 "415": {"name": "Five Workflow Patterns", "file": "10-2.html"},
 "416": {"name": "Tool Description Elements", "file": "10-5.html"},
 "417": {"name": "Three Eval Pitfalls", "file": "10-10.html"},
 "418": {"name": "Dual-Role Harness Division", "file": "10-12.html"},
 "419": {"name": "Three Safety Risk Categories", "file": "10-15.html"},
 "420": {"name": "Brain-Hand Separation & Fault Tolerance", "file": "10-13.html"},
 "421": {"name": "Sandbox & Credential Isolation", "file": "10-16.html"},
 "422": {"name": "Contextual Retrieval", "file": "10-17.html"},
 "423": {"name": "Minimal Viable Engineering Philosophy", "file": "10-final.html"},
 "424": {"name": "Context as Scarce Resource", "file": "10-summary.html"},
 "425": {"name": "Agent Cost & Debugging", "file": "10-1.html"},
 "426": {"name": "Quality Gate in Prompt Chaining", "file": "10-2.html"},
 "427": {"name": "Routing for Cost Optimization", "file": "10-2.html"},
 "428": {"name": "Parallelization Sub-modes", "file": "10-2.html"},
 "429": {"name": "Quadratic Attention Cost", "file": "10-3.html"},
 "430": {"name": "System Prompt Altitude", "file": "10-3.html"},
 "431": {"name": "Structured Note Design", "file": "10-4.html"},
 "432": {"name": "Tool Non-determinism", "file": "10-5.html"},
 "433": {"name": "Reducing Format Overhead", "file": "10-5.html"},
 "434": {"name": "Think Tool Boundaries", "file": "10-6.html"},
 "435": {"name": "Lean Return Results", "file": "10-7.html"},
 "436": {"name": "Trial & Statistical Significance", "file": "10-8.html"},
 "437": {"name": "Rubric Design", "file": "10-9.html"},
 "438": {"name": "Model Recognizes Evaluation", "file": "10-10.html"},
 "439": {"name": "Feature List in JSON", "file": "10-12.html"},
 "440": {"name": "Brain-Hand Separation Benefits", "file": "10-13.html"},
 "441": {"name": "Context Window Composition", "file": "10-3.html"},
 "442": {"name": "Five Tool Design Principles", "file": "10-7.html"},
 "443": {"name": "Queryable Session Log", "file": "10-14.html"},
 "444": {"name": "Environment Layer Defenses", "file": "10-15.html"},
 "445": {"name": "Three-Tier Trust Hierarchy", "file": "10-16.html"},
 "446": {"name": "Thinking Timing Division", "file": "10-6.html"},
 "447": {"name": "Premature Completion", "file": "10-11.html"},
 "448": {"name": "Contextual Retrieval Cost", "file": "10-17.html"},
 "449": {"name": "Harness Assumptions Go Stale", "file": "10-final.html"},
 "450": {"name": "Human Grader Role", "file": "10-9.html"}
};
