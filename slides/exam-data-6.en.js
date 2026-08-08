/* Chapter 6 Quiz Bank · Dissecting Grok Build (50 questions: single 14 / multi 5 / judge 5 → expanded to single 26 / multi 10 / judge 14)
   g = topic group number (this chapter uses 601–650), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 601,
  "type": "single",
  "q": "The root Cargo.toml shows Grok Build's workspace has 79 members. Which of the following best describes the source organization according to the course?",
  "opts": [
   "The 79 members are evenly distributed across four top-level directories — entry, UI, tools, and infrastructure — with about 20 crates each",
   "The bulk of the 62 members is concentrated under crates/codegen/, and reading should follow five main axes: composition entry, TUI, shell host, domain capabilities, and inference & state",
   "All 79 members are independently publishable binary programs; the product assembles them via inter-process communication",
   "The root Cargo.toml is maintained manually; adding or removing any crate requires a manual update to the member list"
  ],
  "ans": 1,
  "exp": "79 members is a workspace fact, with 62 concentrated in crates/codegen/ and the rest in build, common, prod, and third_party. The course emphasizes reading along five main axes and warns against imposing a fictional four-layer directory structure. The first line of the root Cargo.toml states it is auto-generated — not manually maintained."
 },
 {
  "g": 602,
  "type": "single",
  "q": "Which description of the three core Actors in the Session runtime is correct?",
  "opts": [
   "SessionActor directly owns conversation and token state; ChatStateActor only persists that state to disk",
   "SessionActor orchestrates turns; ChatStateActor exclusively owns conversation and token state; SamplerActor handles model requests and streaming events",
   "SamplerActor holds the full conversation history because it needs full context to issue a sampling request",
   "The three Actors concurrently read and write the same session state through a shared-memory lock to reduce message-passing overhead"
  ],
  "ans": 1,
  "exp": "SessionActor receives commands and events via run_session and drives the turn loop; ChatStateActor exclusively owns conversation, token, config, and persistence, processing commands serially through mpsc with no shared lock; SamplerActor creates streaming sampling tasks for each request. Each piece of state having a single owner is the key design principle."
 },
 {
  "g": 603,
  "type": "single",
  "q": "Which of the following is correct regarding Grok Build's actual program entry point and runtime branches?",
  "opts": [
   "TUI, headless, stdio Agent, and leader each have their own independent main binary with no unified entry point",
   "The real entry point is run_leader in xai-grok-shell; all other modes are dispatched from the leader process",
   "The real entry point is in xai-grok-pager-bin/src/main.rs, which dispatches headless, stdio Agent, leader, and interactive TUI branches",
   "The entry point is in xai-grok-sampler, which first establishes a model connection and then starts the UI and session host"
  ],
  "ans": 2,
  "exp": "A single combined-entry main() parses the command and interaction mode: run_headless enters the headless host, run_stdio_agent goes through ACP stdio, run_leader hosts the long-lived Agent, and the default interactive branch enters pager's app::run. From there, connect_or_spawn, MvpAgent, and spawn_session_on_thread lead to SessionActor and SamplerActor."
 },
 {
  "g": 604,
  "type": "single",
  "q": "Which of the following matches source-code facts about session cancellation and Agent mutability?",
  "opts": [
   "Cancellation is implemented by inserting a high-priority message at the front of the queue, immediately preempting an in-progress tool call",
   "Cancellation is driven cooperatively by CancellationToken; dropping all handles also ends the Actor loop. The Agent is effectively immutable after construction but retains finalize_prompt as an explicit re-render entry point",
   "The Agent is absolutely immutable after construction — no field including the system prompt can be updated",
   "Cancellation is accomplished by the OS forcibly terminating the Session thread with no Actor cooperation required"
  ],
  "ans": 1,
  "exp": "Cancellation is cooperative: CancellationToken triggers exit, and dropping all handles also ends the loop. The source has no general 'high-priority queue-front insertion' design, nor forcible thread termination. Agent comments say it is 'effectively immutable', but finalize_prompt(&mut self) can still update the build timestamp and re-render the prompt, so it cannot be called absolutely immutable."
 },
 {
  "g": 605,
  "type": "single",
  "q": "Which set of default values for CompactionPolicy is correct?",
  "opts": [
   "Threshold 80%, memory flush on by default, two-pass on by default, wall-clock budget 600 s",
   "Threshold 85%, memory flush off by default, two-pass off by default, wall-clock budget 300 s",
   "Threshold 85%, memory flush on by default, two-pass off by default, wall-clock budget 300 s",
   "Threshold 90%, memory flush off by default, two-pass on by default, wall-clock budget 300 s"
  ],
  "ans": 1,
  "exp": "The Default implementation sets auto_compact_threshold_percent to 85 and wall_clock_budget_secs to 300; both memory_flush_enabled and two_pass_enabled default to false; compact_model defaults to None (uses the current session model when unspecified). Both memory flush and two-pass must be explicitly enabled before their respective paths are taken."
 },
 {
  "g": 606,
  "type": "single",
  "q": "With context_window = 1,000 and threshold = 85, which statement about exceeds_threshold is correct?",
  "opts": [
   "used = 850 returns false; it must be strictly greater than 850 to trigger",
   "used = 849 and 850 both return true because floating-point rounding causes early triggering",
   "used = 850 returns true (equals threshold triggers immediately); used = 849 returns false",
   "When context_window = 0, the function returns true to conservatively force compaction"
  ],
  "ans": 2,
  "exp": "The check uses integer saturating cross-multiplication: used × 100 >= context_window × threshold_percent, so equality triggers immediately — 850 × 100 equals 1000 × 85 exactly. Integer arithmetic avoids floating-point rounding shifting the boundary. When context_window = 0, the function returns false directly."
 },
 {
  "g": 607,
  "type": "single",
  "q": "Which of the following correctly describes the default classification of ToolKind::is_read_only()?",
  "opts": [
   "Task falls in the read-only branch because subtasks do not directly modify files",
   "WebFetch falls in the non-read-only branch because it accesses an external network producing side effects",
   "Task is in the false branch; Read, Search, WebFetch, AskUser, etc. are in the true branch",
   "The source provides a TaskOutput kind specifically to represent task output written back"
  ],
  "ans": 2,
  "exp": "In tool_taxonomy.rs, Read, Search, Lsp, ListDir, MemorySearch, WebSearch, WebFetch, EnterPlan, AskUser, etc. return true; Edit, Write, Execute, Task, etc. return false — Task is explicitly in the false branch. The source has no TaskOutput kind; Execute's display label is 'Run Command'."
 },
 {
  "g": 608,
  "type": "single",
  "q": "Which of the following correctly describes the difference between Public and Internal in the external Toolset preset registry?",
  "opts": [
   "An Internal preset cannot be resolved by any means and is only used in intra-crate unit tests",
   "The core difference between Public and Internal is whether they appear in the public enumeration; Internal presets are not listed in preset_names but can still be resolved by name",
   "After an Internal preset is registered, it is automatically written back to all already-resolved ToolServerConfigs",
   "A Public preset requires administrator approval before a session configuration can reference it"
  ],
  "ans": 1,
  "exp": "The registry maps names to builder functions and visibility. Visibility only governs enumeration scope: Public enters preset_names and the public collection; Internal is not publicly enumerated but toolset_for_preset can still resolve it by name. Late registration does not write back to already-resolved configurations; only subsequent resolutions see the new entry."
 },
 {
  "g": 609,
  "type": "single",
  "q": "Faced with a large number of MCP tools discovered at runtime, what mechanism does Grok Build use to keep the model's tool list stable across turns?",
  "opts": [
   "All MCP tool definitions are injected into the system prompt and the model selects from them",
   "SearchTool discovers tools and their input_schemas via BM25, then the fixed-entry UseTool carries tool_name and tool_input to dispatch calls",
   "Every newly discovered MCP tool triggers a session restart to rebuild the complete tool registry",
   "MCP tools can only be registered statically before session start; tools discovered at runtime are discarded"
  ],
  "ans": 1,
  "exp": "SearchTool searches the ToolIndex via BM25 for MCP tools and returns descriptions and input_schemas; UseTool receives tool_name (usually server__tool) and tool_input constructed per the schema, then executes via InnerDispatch or the managed gateway. These two fixed meta-tools let a large number of MCP tools remain out of the prompt."
 },
 {
  "g": 610,
  "type": "single",
  "q": "If query embedding fails during memory retrieval, what does the system do?",
  "opts": [
   "The entire search fails immediately and the user is prompted to retry later",
   "A warning is logged and None is passed forward; FTS candidates still enter the merge pipeline — the retrieval degrades to FTS-only",
   "The system automatically switches to a backup embedding provider and retries three times before giving up",
   "The dirty-file sync before the query is skipped and the last cached result is returned directly"
  ],
  "ans": 1,
  "exp": "In hybrid_search, when embed_batch returns an error, only tracing::warn is logged and query_embedding is set to None; the code continues to hybrid_search_merge where FTS5 BM25 always provides baseline candidates. An embedding failure does not mean the entire search fails — this is the pipeline's graceful degradation guarantee."
 },
 {
  "g": 611,
  "type": "single",
  "q": "Which of the following matches source-code facts about how Dream memory consolidation is triggered?",
  "opts": [
   "It always runs automatically whenever the process is idle, requiring no configuration",
   "The source supports session-end and /dream command triggers; the default check_interval_secs is None, and the session actor only does periodic gating checks when a check interval is configured",
   "Dream can only be triggered manually by the user running the /dream command; session end does not enter the gate",
   "Sub-Agent session end also triggers Dream to promptly merge subtask memory"
  ],
  "ans": 1,
  "exp": "Entry points include session end, an optional periodic check, and manual /dream — three types. The default check_interval_secs of None means periodic checks are not enabled, so 'automatically runs when idle' is incorrect. After triggering, three gates must pass: enabled (default true), min_hours (default 4), min_sessions (default 3). Sub-Agent sessions skip Dream entirely."
 },
 {
  "g": 612,
  "type": "single",
  "q": "Which of the following correctly describes the real capability boundaries of the five sandbox Profiles?",
  "opts": [
   "The workspace Profile prohibits reading any file outside the workspace",
   "The strict Profile disallows writing even to the workspace — it is a fully read-only mode",
   "strict disables global default reads and restricts subprocess networking, but the workspace is still writable; read-only disallows workspace writes yet retains necessary write paths such as GROK_HOME and temp directories",
   "off can be used as the extends base class for a custom Profile to define rules from scratch"
  ],
  "ans": 2,
  "exp": "The course highlights two common misreadings: workspace still allows reading files outside the workspace, and strict still allows writing to the workspace. read-only retains the minimum write directories needed for operation. Profile names only indicate direction; true boundaries require inspecting the resolved capability set. off accepts the alias 'none' and cannot be used as an extends base for custom profiles."
 },
 {
  "g": 613,
  "type": "single",
  "q": "A PreToolUse Hook process times out without returning a result. What happens to this tool call?",
  "opts": [
   "It is blocked; timeout is treated as the most conservative denial",
   "It hangs indefinitely until the Hook process returns or the user manually cancels",
   "It is allowed through and a warning is logged; Hook execution failures are treated as fail-open",
   "It is handed to a user popup for confirmation, where the user decides whether to continue"
  ],
  "ans": 2,
  "exp": "The dispatcher only blocks when it receives a clear Deny (valid JSON with decision = deny, or exit code 2 with no valid JSON). Timeouts, crashes, non-0/non-2 exit codes, and invalid stdout all fall into HookRunResult::Failed — they are allowed through with a warning logged. Source comments explicitly require Hook failures not to break tool availability; enforcement must rely on the permission layer and sandbox."
 },
 {
  "g": 614,
  "type": "single",
  "q": "Which of the following matches source-code facts about Sub-Agent isolation and resumption?",
  "opts": [
   "SubagentIsolationMode provides three isolation modes: None, Worktree, and Sandbox",
   "When IsolationMode is None, the Sub-Agent shares the same context window with the parent session",
   "SubagentIsolationMode has only None and Worktree; if the worktree path is removed but a snapshot_ref exists, it can be re-hydrated from the persisted git ref",
   "On Resumed resumption, the requester may freely switch models to continue the task with a stronger model"
  ],
  "ans": 2,
  "exp": "The enum has only None and Worktree — no Sandbox member. None describes file-workspace isolation; the sub-session's context window remains independent. On resumption the source worktree is reused if available; if the path is gone but snapshot_ref exists, it can be rebuilt. Model overrides in the request are soft-ignored and pinned to the source model."
 },
 {
  "g": 615,
  "type": "multi",
  "q": "Which of the following statements about the full authorization chain from tool request to restricted execution are correct? (Select all that apply)",
  "opts": [
   "Tool input is first parsed into AccessKind, carrying path, command, or domain details — the decision input is more specific than ToolKind",
   "Permission-rule evaluation priority is deny > ask > allow, regardless of rule source order",
   "Whenever the sandbox is active, all write operations are automatically approved without any prompt",
   "Bash scripts are segmented with tree-sitter; each non-setup segment must independently pass the check to prevent ls && rm from riding the first segment's approval",
   "A permission-layer Allow also expands the sandbox's OS capabilities; the two layers share the same capability table"
  ],
  "ans": [0, 1, 3],
  "exp": "The authorization chain starts from AccessKind parsing, then passes through the plan gate, hooks, policy rules, and session authorization. Rule priority is fixed as deny > ask > allow. 'All writes auto-approved in sandbox' misreads the code: the sandbox fast path specifically checks Bash and is also constrained by policy_forced_prompt and auto_forced_prompt. The permission layer only determines 'whether to attempt'; Allow does not expand the sandbox's OS capabilities."
 },
 {
  "g": 616,
  "type": "multi",
  "q": "Which of the following statements about the Compaction two-pass mechanism are correct? (Select all that apply)",
  "opts": [
   "two_pass_enabled defaults to false; the single-pass path is taken when it is not explicitly enabled",
   "Pass 1 can speculatively summarize the historical prefix in the background when approaching the threshold, producing NOTE₁",
   "Pass 2 discards NOTE₁ and only does a quick summary of the recent conversation tail",
   "When two-pass is enabled, the actual compaction combines NOTE₁ and the recent tail for a second summarization pass",
   "Enabling two-pass lowers the auto-compaction threshold from 85% to 70% to allow earlier warm-up"
  ],
  "ans": [0, 1, 3],
  "exp": "Two-pass is an explicit configuration option: Pass 1 pre-summarizes the historical prefix into NOTE₁; Pass 2 combines NOTE₁ with the recent tail for a second summarization. With the flag false, the original single-pass path is retained. Enabling it changes the compaction path but does not modify the 85% default threshold, and Pass 2 does not discard NOTE₁."
 },
 {
  "g": 617,
  "type": "multi",
  "q": "Which of the following statements about the memory hybrid retrieval pipeline are correct? (Select all that apply)",
  "opts": [
   "Before querying, dirty Markdown paths accumulated by the watcher are synced first — newly added or modified files are re-indexed and chunks from removed files are deleted",
   "Merged scores are adjusted by time decay, source weights, and access gain; session memory decays exponentially by half-life, while global and workspace memories are treated as evergreen",
   "MMR diversity re-ranking is on by default with a fixed lambda of 0.7 that cannot be configured",
   "FTS5 BM25 and vector retrieval must both be available; otherwise the entire pipeline refuses to execute",
   "MMR is an opt-in capability; MmrConfig defaults enabled to false"
  ],
  "ans": [0, 1, 4],
  "exp": "Sync-on-search ensures external Markdown changes enter the index before the next query. Scores are first normalized, then adjusted by decay, source weights, and access gain. MMR defaults to off (enabled: false); the 0.7 lambda only takes effect when explicitly enabled. The vector path is an enhancement when available; FTS always provides baseline candidates — there is no constraint that both must be available."
 },
 {
  "g": 618,
  "type": "multi",
  "q": "Which of the following statements about custom sandbox Profiles and platform execution mechanisms are correct? (Select all that apply)",
  "opts": [
   "A custom profile defaults to extending workspace; it can extend the four built-in base classes but cannot extend off or another custom",
   "When a project .grok/sandbox.toml declares a profile with the same name as a global one, the merge uses entry.or_insert, keeping the global definition in effect",
   "restrict_network also cuts the main process network, so enabling it prevents access to the model API",
   "If sandbox apply fails, the process exits immediately, ensuring no unrestricted execution occurs",
   "On macOS, deny is implemented via Seatbelt rules; Linux sub-path read-deny additionally requires bwrap bind-over"
  ],
  "ans": [0, 1, 4],
  "exp": "The custom extends rules and the entry.or_insert merge strategy prevent projects from quietly weakening a same-named global policy. The main process network remains open for model API access; restrict_network is expressed through subprocess filtering. When the platform is unsupported or apply fails, the source logs a warning and continues — is_active() must be used to check whether the sandbox is actually in effect, so 'cannot be bypassed' cannot be guaranteed."
 },
 {
  "g": 619,
  "type": "multi",
  "q": "Which of the following statements about MCP integration engineering details are correct? (Select all that apply)",
  "opts": [
   "The registered tool name is composed of the server name, the reserved separator __, and the original tool name; the full name must contain exactly one separator",
   "OAuth credentials are stored in $GROK_HOME/mcp_credentials.json, using a file lock and atomic saves for multi-process concurrent writes",
   "mcp_dispatcher immediately pushes an ACP notification for every status event to ensure UI real-time updates",
   "Before removing a dead client, the client_id is compared so stale disconnect events from old connections do not accidentally delete a newly replaced client",
   "stdio and HTTP disconnection use exactly the same recovery strategy sharing a single exponential backoff timer"
  ],
  "ans": [0, 1, 3],
  "exp": "The server__tool naming ensures two servers' identically named tools have different ToolIds; credentials use file lock plus atomic save. Status events are merged last-write-wins within a 50 ms tumbling window keyed by (server_name, event_kind), so high-frequency tools/list_changed events result in only one push. stdio auto-restart uses fixed 1s/4s/16s backoff; HTTP first tries client-side recovery with independent backoff — the two strategies differ."
 },
 {
  "g": 620,
  "type": "judge",
  "q": "Tools for which ToolKind::is_read_only() returns true skip permission checks and execute automatically.",
  "ans": false,
  "exp": "is_read_only is only the default side-effect classification at the tool-kind layer; individual tools can override it with their own metadata. Whether a tool actually executes still requires passing through command rules, workspace permissions, sandbox, hooks, and user approval — read-only classification alone does not imply automatic execution."
 },
 {
  "g": 621,
  "type": "judge",
  "q": "The local rough estimate in estimate_tokens uses UTF-8 byte length divided by 4; the fixed estimate for a single low-resolution image is 765 tokens.",
  "ans": true,
  "exp": "The local estimate is exactly the bytes/4 heuristic, serving quick predictions before requests and after tool output is added. A single low-resolution image is fixed at 765 tokens. This is separate from server-side usage observations: the percentage and threshold functions only process the values passed in by the caller, not their origin."
 },
 {
  "g": 622,
  "type": "judge",
  "q": "Plugin root trust, like Hooks, is fail-open: if plugin path resolution fails, it defaults to trusted to ensure plugin availability.",
  "ans": false,
  "exp": "The two failure strategies are opposite. Plugin trust is fail-closed: in trust.rs, canonicalize failure returns false directly — resolution failure defaults to untrusted, and an untrusted plugin's hooks, MCP servers, and scripts are blocked. Fail-open is the strategy for Hook execution failures themselves, to preserve tool availability."
 },
 {
  "g": 623,
  "type": "judge",
  "q": "DreamLock is a best-effort lock; source comments explicitly state it is not strictly mutually exclusive, so Dream's consolidation process must be designed to tolerate duplicate execution.",
  "ans": true,
  "exp": ".dream-lock saves a PID and uses mtime as the last-success time; a write-then-re-read can only reduce race probability but two processes may still both believe they won. Therefore consolidation must be idempotent. Combined with write-failure rollback, post-success-only session cleanup, and index removal only of actually-deleted paths, this forms a failure-recoverable design."
 },
 {
  "g": 624,
  "type": "judge",
  "q": "In the comparison with Claude Code, the Claude-side conclusions are based on reverse-engineering its internal source code implementation.",
  "ans": false,
  "exp": "The two columns of evidence have different resolution: on the Grok Build side, source code can be drilled into; on the Claude Code side, only observable behaviors described in official public documentation are recorded — no internal implementation is inferred, and intentional blanks are preserved. This evidence grading is the methodology the section trains."
 },
 {
  "g": 625,
  "type": "single",
  "q": "The course categorizes Rust selection rationale into 'source-verifiable facts' and 'course inferences'. Which of the following is a source-verifiable fact?",
  "opts": [
   "xAI's primary goal in choosing Rust was to reduce runtime memory footprint",
   "workspace.package sets edition to 2024, and the workspace dependency uses Tokio 1 with the full feature enabled",
   "The multi-threaded runtime makes Grok Build faster than similar products in all scenarios",
   "Strong-type modeling brought the team's defect rate down to a quantifiable level"
  ],
  "ans": 1,
  "exp": "The four facts listed by the course are: Rust 2024 edition, Tokio 1 with full features enabled, strong types widely used for boundary modeling, and the bin target defined in xai-grok-pager-bin. Performance gains and organizational motivation are not recorded in the source and can only be marked as course inferences subject to verification. Writing reasonable interpretations as official xAI motivation is exactly what this section warns against."
 },
 {
  "g": 626,
  "type": "single",
  "q": "Which of the following matches source-code facts about the two-level Tokio runtime division of responsibilities in Grok Build?",
  "opts": [
   "The entry point and Session share one multi-threaded runtime; Session is just an ordinary task within it",
   "The entry point builds a multi-threaded runtime; each Session runs a current-thread runtime and LocalSet on a dedicated OS thread with a stack size of 8 MB",
   "The entry point uses a current-thread runtime; Session upgrades to a multi-threaded runtime to improve tool concurrency",
   "Session threads do not create their own runtime and directly reuse the caller thread's executor"
  ],
  "ans": 1,
  "exp": "The entry uses tokio::runtime::Builder::new_multi_thread().enable_all(); spawn_session_on_thread uses std::thread::Builder to name the thread, set a stack of 8 * 1024 * 1024 bytes, then builds a current-thread runtime and LocalSet. The two-level runtime keeps session state on a single thread, complementing the Actor division to avoid cross-thread sharing."
 },
 {
  "g": 627,
  "type": "single",
  "q": "Which of the following correctly describes PromptContext's serialization capability and field origins?",
  "opts": [
   "It uses a set of hand-written to_json and from_json methods for serialization",
   "Its field list is dynamically determined by TemplateRenderer at runtime",
   "Its serialization capability comes from Serialize and Deserialize derives; the field list is defined by the struct definition",
   "It only implements Serialize and cannot be deserialized from disk"
  ],
  "ans": 2,
  "exp": "The struct carries Debug, Clone, Serialize, and Deserialize derives — serialization capability comes from the derives themselves; no specialized JSON conversion methods are defined. The field list follows the struct definition, divided into three groups: version and template, config and identity, and user runtime environment. ToolBridge and TemplateRenderer handle rendering; they do not change the field list."
 },
 {
  "g": 628,
  "type": "single",
  "q": "Which of the following correctly describes the real variants and default value of TemplateOverride?",
  "opts": [
   "Only Default and Custom(String), where Default points to the standard base template",
   "Variants are None, Codex, and Custom(String), with None marked #[default]",
   "Variants are None, Codex, Subagent, and Custom(String), where Subagent uses the compact template",
   "Only None and Codex; custom templates are passed in via a config file path"
  ],
  "ans": 1,
  "exp": "The enum is defined as None, Codex, and Custom(String), with #[default] on None. When None, Primary uses the standard base template and Subagent uses its corresponding compact template determined by audience — there is no Subagent variant in the enum. Codex is the apply-patch profile prompt template defined in comments; Custom takes a full template string from the caller."
 },
 {
  "g": 629,
  "type": "single",
  "q": "Which of the following correctly describes the list of canonical fields?",
  "opts": [
   "Eight fields: path, offset, limit, command, description, cwd, directory, pattern",
   "Nine fields, with an additional content field for carrying write content",
   "Eight fields, where file_path is the unified field name for read-type tools",
   "The field list is extended by each harness independently; the source has no fixed constants"
  ],
  "ans": 0,
  "exp": "The constants in the field module are exactly: path, offset, limit, command, description, cwd, directory, pattern — eight fields. The source has no content canonical field; before/after text and full write content are large fields left in raw_input. The normalization layer maps each harness's raw names like file_path to path, so file_path is a raw input name."
 },
 {
  "g": 630,
  "type": "single",
  "q": "Which of the following correctly describes the fields of CanonicalToolMeta and the omission rule for input?",
  "opts": [
   "version is the string 'v1'; input is a required field",
   "Seven fields: version, name, kind, namespace, label, read_only, input; version is the number 1; input is omitted entirely when there is no stable projection",
   "input is a complete mirror of raw_input; any tool parameter can be found in it",
   "read_only is passed by the caller on each invocation and is unrelated to tool classification"
  ],
  "ans": 1,
  "exp": "TOOL_META_VERSION is a u32 value of 1; the struct fields are exactly version, name, kind, namespace, label, read_only, and input, where input is Option<serde_json::Value>. It is a canonical projection — non-shared fields like grep flags or replace_all may be dropped; the full raw input remains in raw_input. read_only comes from tool classification, not the caller at each invocation."
 },
 {
  "g": 631,
  "type": "single",
  "q": "Which of the following correctly describes the real fields of EffectiveRuntimeConfig?",
  "opts": [
   "It contains model, temperature, max_tokens, and tools, used to override sampling parameters for sub-sessions",
   "It only stores persona and role_prompt; model selection is entirely left to the parent session",
   "It contains model, reasoning_effort, capability_mode, persona, persona_instructions, role_prompt, role_prompt_warning, role_name, persona_error, and isolation",
   "It has identical fields to AgentDefinition — just a different type name"
  ],
  "ans": 2,
  "exp": "These ten fields are the complete parsing result; the source has no temperature, max_tokens, or tools. role_prompt_warning and persona_error specifically carry diagnostics for soft degradation and fail-closed scenarios. AgentDefinition is a separate layer handling Agent skeleton elements like prompt_mode, tool_config, capability_mode, permission_mode, tools, isolation, and model."
 },
 {
  "g": 632,
  "type": "single",
  "q": "A spawn specifies only persona=reviewer; the role provides model=A and capability=read-only; the Persona provides model=B. Under the merge priority, what are the final model and capability_mode?",
  "opts": [
   "model=B, capability=read-only — Persona's runtime defaults have the highest priority",
   "model=A, capability=read-only — model hits the role default; capability is not read from Persona",
   "model=A, capability is empty — capability can only be provided explicitly by spawn",
   "model is empty, capability=read-only — model not specified by spawn always falls back to the parent session"
  ],
  "ans": 1,
  "exp": "Priority cascades field by field: spawn override > role default > persona default; if none match, None is kept for downstream inheritance. In this example spawn does not specify model, so the role's A wins over Persona's B. Persona only provides model, reasoning, and isolation — not capability_mode — so capability takes the role's read-only."
 },
 {
  "g": 633,
  "type": "single",
  "q": "During Sub-Agent resolution, what is the difference between a Persona's instructions file read failure and a role's prompt_file read failure?",
  "opts": [
   "Both only log a warning and continue; the Sub-Agent is created normally",
   "Both abort creation because missing prompt text would make the sub-session behavior uncontrollable",
   "Persona failure writes persona_error and is aborted by the spawn side; role prompt failure only produces role_prompt_warning and the remaining fields continue parsing",
   "Persona failure falls back to the default Persona; role prompt failure aborts creation"
  ],
  "ans": 2,
  "exp": "Persona is fail-closed: requesting a Persona that cannot be found, is empty, or fails to read a file writes persona_error; file I/O failure also returns early with a default result; the spawn side aborts on error. Role prompt uses soft degradation: read failure only logs role_prompt_warning while model, reasoning, capability, and isolation continue parsing. Distinguishing these two policies is a key point of this section."
 },
 {
  "g": 634,
  "type": "single",
  "q": "Which of the following matches source-code facts about SubagentCoordinator's startup method and parallel capability?",
  "opts": [
   "start_subagent_coordinator starts only one drain task; each Spawn event then enters spawn_local to start a local async task",
   "A new drain task is started for each Spawn event received, to isolate that Sub-Agent's event stream",
   "The coordinator runs Sub-Agents serially, allowing only one subtask at a time",
   "The maximum number of parallel Sub-Agents equals the number of defined Personas"
  ],
  "ans": 0,
  "exp": "The drain task starts only once, looping to recv events and dispatching on Spawn, Query, Cancel, ListActive, Completions, and other variants. Parallel capability comes from tasks launched via spawn_local, unrelated to the number of Personas. The coordinator tracks pending, active, and completed states and evicts stale completed records."
 },
 {
  "g": 635,
  "type": "single",
  "q": "Which of the following correctly describes plugin source priority and default enabled state?",
  "opts": [
   "All plugins discovered from any source default to the enabled list; users must manually disable them",
   "CLI override has the highest priority; project- and user-scoped plugins default to the disabled list; CLI override and config path default to the enabled list",
   "Project .grok/plugins has higher priority than CLI override because project config is closer to the current repository",
   "Enabled state is declared by a field in plugin.json; the discovery configuration plays no role"
  ],
  "ans": 1,
  "exp": "Source order is: CLI override, project .grok/plugins, user $GROK_HOME/plugins, registry provenance, and config paths — CLI override has the highest priority. The discovery config maintains enabled and disabled lists; project- or user-scoped plugins default to disabled; CLI override and config path default to enabled, though users can still explicitly adjust. Discoverable, installed, enabled, and trusted are four independent states."
 },
 {
  "g": 636,
  "type": "single",
  "q": "Which of the following matches source-code facts about Marketplace scanning and plugin manifest parsing?",
  "opts": [
   "The scanner only reads plugin-index.json; if the index is missing it returns an empty directory",
   "The manifest must be at plugin.json in the plugin root; any other location is ignored",
   "The scanner reads the index first; if missing or invalid it scans plugins/*/; plugin.json is the preferred manifest location and .grok-plugin and .claude-plugin contain fallback files of the same name",
   "A manifest can declare paths outside the plugin root to reuse shared components"
  ],
  "ans": 2,
  "exp": "Index-first with filesystem fallback is the basic shape of the discovery chain; default-skills can also be added as a virtual plugin. The manifest has one preferred location and two fallback locations. PluginManifest can override paths for skills, commands, agents, hooks, MCP, and LSP. After parsing, the source validates that those paths still reside within the plugin root; out-of-bounds paths are rejected."
 },
 {
  "g": 637,
  "type": "single",
  "q": "In the 100-point evaluation rubric of the capstone design workbench, which item carries the highest weight?",
  "opts": [
   "Boundaries & ADR, 20 points",
   "Contracts & State Machines, 20 points",
   "Security & Recovery, 25 points",
   "Demo & Evidence, 15 points"
  ],
  "ans": 2,
  "exp": "The rubric is: Boundaries & ADR 20 pts, Contracts & State Machines 20 pts, Security & Recovery 25 pts, Testing & Observability 20 pts, Demo & Evidence 15 pts — Security & Recovery carries the highest weight. This aligns with the nine-dimension decision card orientation: failure paths and trust boundaries reflect completion more than feature lists. The rubric also includes four veto items — any one hit is an automatic fail."
 },
 {
  "g": 638,
  "type": "single",
  "q": "In an explicit resume request, the source transcript already occupies 90% of the target model's context window. What does the system do?",
  "opts": [
   "Automatically compacts the transcript first, then continues the resumption",
   "Refuses the resumption; the source refuses when the transcript exceeds 80% of the target model's context window",
   "Resumes normally; the excess is truncated server-side on the first sampling turn",
   "Degrades to ContextSource::New, discarding history and continuing the task"
  ],
  "ans": 1,
  "exp": "The resumption limit explicitly states the 80% threshold — exceeding it means the resumption is refused. Explicit resume also fails closed when copying the transcript or reading fails. Resumption copies tool state but not plan state, plan-mode state, or signals — resumption is not a complete clone of the original session."
 },
 {
  "g": 639,
  "type": "single",
  "q": "After an MCP tool is registered, what determines whether it can appear in the model's tool list?",
  "opts": [
   "If the server returns it in tools/list, the model will always see it",
   "It is determined by model_visible; disabled tools are stored in disabled_tool_registrations; tools with ui.resourceUri can independently send UI notifications",
   "It is determined by the BM25 index hit score; tools with scores too low are hidden",
   "It is determined by mcp_initialized; when that flag is true, all tools enter the model side"
  ],
  "ans": 1,
  "exp": "Discovery and visibility are separate concerns: after registration, model_visible must be true to enter the model-side Tool Bridge; disabled tools go into disabled_tool_registrations; tools with ui.resourceUri face the App side. The BM25 index serves search_tool retrieval; mcp_initialized only tells the search layer whether capability discovery is complete — neither acts as a visibility switch."
 },
 {
  "g": 640,
  "type": "single",
  "q": "Among the 15 Hook events enumerated in the source, which type of event has the ability to block the main flow?",
  "opts": [
   "PreToolUse, PostToolUse, and PermissionDenied — three events",
   "All events with a Pre prefix, including PreToolUse and PreCompact",
   "Only PreToolUse, whose is_blocking() returns true",
   "All 15 events can block subsequent flow by returning deny"
  ],
  "ans": 2,
  "exp": "The event enum defines trigger points; is_blocking() separately declares blocking capability — only PreToolUse returns true. Events like PreCompact, PostToolUse, and PermissionDenied are triggered and receive envelopes but cannot halt the main flow. When reading the event list, you must also trace how the result gets back to the caller — 'event is triggered' does not imply 'can control main flow'."
 },
 {
  "g": 641,
  "type": "multi",
  "q": "Which of the following statements about the canonical input stable projection are correct? (Select all that apply)",
  "opts": [
   "Its purpose is to give display, telemetry, and cross-tool analysis a shared vocabulary; different harnesses' raw parameter names can vary",
   "The projection may drop fields; non-shared fields like grep flags and replace_all do not necessarily appear in input",
   "Before/after edit text and full write content are preserved in full in input to enable call replay",
   "When there is no stable projection to write, input is omitted entirely",
   "Once canonical projection is enabled, raw_input is no longer saved to avoid duplicate storage"
  ],
  "ans": [0, 1, 3],
  "exp": "The canonical layer pursues shared semantics across harnesses, retaining only a small number of stable, lightweight fields. Large fields and non-shared fields are excluded from the projection; the full raw input remains in raw_input — both coexist. input is an Option type and is omitted entirely when there is nothing to write, so it cannot be read as a mirror of raw input."
 },
 {
  "g": 642,
  "type": "multi",
  "q": "Which of the following statements about Grok Build's multi-Agent organization are correct? (Select all that apply)",
  "opts": [
   "The definition layer consists of AgentDefinition and Persona; the former provides the contract for prompt, tools, permissions, model, and spawnable types",
   "Coordination-layer events include Spawn, Query, Cancel, ListActive, Completions, and Outstanding",
   "Query can only return an immediate snapshot; it cannot wait for a Sub-Agent to complete",
   "Completions drains pending notification completion items and filters by suppress_ids",
   "The course treats both Coordinator and Swarm as internal types in Claude Code's source for comparing scheduling implementations"
  ],
  "ans": [0, 1, 3],
  "exp": "The definition layer is responsible for the observable identity and capability boundary of Sub-Agents; the coordination layer manages their lifecycle via events. Query can both return an immediate snapshot and register a block-wait slot to poll status — it is not snapshot-only. On the Claude side, only public behaviors are used; the course explicitly does not treat Coordinator or Swarm as its source-code internal types and does not infer its scheduler implementation."
 },
 {
  "g": 643,
  "type": "multi",
  "q": "Which of the following statements about the three gates from plugin visibility to executability, and evidence boundaries, are correct? (Select all that apply)",
  "opts": [
   "MarketplaceRelativePath rejects absolute paths, parent-directory traversal, and out-of-bounds joins; remote entries can use git ref or SHA to locate content",
   "Trust granularity is the entire marketplace source; plugins installed from the same source share one trust record",
   "An untrusted plugin's skills and agents can still have their metadata listed; hooks, MCP servers, and scripts are blocked",
   "Config paths under the user's home directory must also be individually explicitly trusted; the source provides no auto-trusted paths",
   "Current source code can prove official-source constants, multiple sources, directory indexing, and the installation flow, but cannot alone prove plugin count, active authors, or review coverage"
  ],
  "ans": [0, 2, 4],
  "exp": "Path constraints, enabled state, and execution trust are three independent gates. Trust granularity is a single plugin root; project plugins are authorized by canonical plugin root with records written to ~/.grok/trusted-plugins. CLI override and user-scoped plugins are marked trusted in the source; config paths under the user's home can be auto-trusted — other locations still require authorization. Mechanisms can be proven; ecosystem scale cannot — this evidence boundary must also be stated clearly."
 },
 {
  "g": 644,
  "type": "multi",
  "q": "Which of the following statements about the specific capabilities of the five built-in sandbox Profiles are correct? (Select all that apply)",
  "opts": [
   "workspace is the default Profile; default_read is true and subprocess networking is unrestricted",
   "devbox enumerates root directories and grants broad write permissions, but keeps /data readable; on Linux write protection is implemented via bwrap",
   "read-only has restrict_network set to true; workspace is not writable; GROK_HOME and temp directories are still writable",
   "strict has default_read set to true; its difference from workspace is only a few extra deny rules",
   "off skips the capability-set application and logs 'Sandbox disabled'; it does not accept any aliases"
  ],
  "ans": [0, 1, 2],
  "exp": "The first three items correspond to the capability descriptions of workspace, devbox, and read-only in the source — note that read-only retains the minimum write directories needed for operation. The key difference in strict is that global default reads are disabled; only system operation directories and workspace are opened, so default_read is false. off, in addition to skipping apply and logging 'Sandbox disabled', also accepts the alias 'none' and cannot be used as an extends base for custom profiles."
 },
 {
  "g": 645,
  "type": "multi",
  "q": "Which of the following statements about Dream's execution boundaries and cleanup rules are correct? (Select all that apply)",
  "opts": [
   "Message construction has a 32K input limit; the model call has a 30-minute timeout",
   "If the model returns empty, NO_REPLY, or no Markdown headings, neither writing nor session deletion occurs",
   "As soon as the model call returns successfully, all session files read in this run can be cleaned up",
   "If writing MEMORY.md fails, rollback(prior) is called to restore the previous lock state",
   "The search index is rebuilt entirely, clearing all historical session chunks at once"
  ],
  "ans": [0, 1, 3],
  "exp": "The 32K input limit and 30-minute timeout are real constraints annotated in the flow. The success boundary determines the cleanup boundary: session cleanup only occurs after a successful write, and files still active within the last 5 minutes are skipped — so cleanup is not triggered merely by a successful model return. The index only removes actually-deleted paths and then rebuilds the index and embedding for the new MEMORY.md."
 },
 {
  "g": 646,
  "type": "judge",
  "q": "'The entry creates a Tokio multi-threaded runtime' has direct repository evidence; 'xAI chose Rust to reduce memory footprint' lacks direct repository evidence and can only be labeled a course inference.",
  "ans": true,
  "exp": "The former can be read directly from the entry source as new_multi_thread().enable_all() — a source-code fact. The latter concerns the organizational motivation for technology selection; the source records nothing about it. The course only provides an interpretation based on code shape and notes that it does not represent xAI's officially disclosed reasons. Attaching evidence labels to every conclusion is the training goal of this section."
 },
 {
  "g": 647,
  "type": "judge",
  "q": "The capstone evaluation rubric lists 'citing source code without being able to provide the file path' as a veto item.",
  "ans": true,
  "exp": "The four veto items are: submission does not explain where sensitive data lands; high-risk tools lack a permission path; the submission claims recovery after a crash but has no tests; and citing source code without being able to provide the file path. This aligns with the source-anchor requirement on the nine-dimension decision card: every design decision must trace back to a real branch, and the proposal must state the failure default when policy cannot be read, result cannot be parsed, or checkpoint cannot be recovered."
 },
 {
  "g": 648,
  "type": "judge",
  "q": "The README declares macOS, Linux, and Windows as supported build hosts.",
  "ans": false,
  "exp": "The README lists only macOS and Linux as supported build hosts; Windows builds are best-effort and currently untested from this source tree. This limitation, together with periodic-sync-only, no external patches accepted, and the auto-generated root Cargo, forms the boundary of the public repository. When reading source code, repository boundaries and product capabilities should be stated separately."
 },
 {
  "g": 649,
  "type": "judge",
  "q": "exceeds_threshold_with_headroom reserves a fixed token space before the percentage threshold to advance the trigger point, and returns false when context_window is 0.",
  "ans": true,
  "exp": "The function performs a saturating_sub on the result of window × threshold, subtracting headroom × 100, so the trigger point is earlier than the plain percentage. With window 100,000, threshold 85%, and headroom 4,000, it triggers at 81,000. The short-circuit branch for window = 0 matches exceeds_threshold and returns false directly."
 },
 {
  "g": 650,
  "type": "judge",
  "q": "The namespace enum in xai-grok-tools only covers built-in implementation families; MCP tools discovered at runtime are not in this enum.",
  "ans": false,
  "exp": "In addition to built-in implementation families like grok_build, grok_build_concise, grok_build_hashline, codex, opencode, memory, lsp, and skills, the namespace enum also includes MCP, specifically for runtime external tools. ToolBridge's register_mcp_tools registers MCP tools along with their input_schemas into the registry; they share the same registration and dispatch path as built-in tools."
 }
];

window.EXAM_TOPICS_PART = {
 "601": {"name": "Workspace Members & Axes", "file": "12-1.html"},
 "602": {"name": "Three Actor Roles", "file": "12-4.html"},
 "603": {"name": "Entry & Runtime Branches", "file": "12-3.html"},
 "604": {"name": "Cancellation & Immutability", "file": "12-4.html"},
 "605": {"name": "Compaction Default Values", "file": "12-5.html"},
 "606": {"name": "Threshold Equality Boundary", "file": "12-11.html"},
 "607": {"name": "Tool Read-Only Defaults", "file": "12-8.html"},
 "608": {"name": "Preset Registry Visibility", "file": "12-7.html"},
 "609": {"name": "Dynamic MCP Meta-Tools", "file": "12-9.html"},
 "610": {"name": "Retrieval Degradation", "file": "12-12.html"},
 "611": {"name": "Memory Consolidation Gates", "file": "12-13.html"},
 "612": {"name": "Five Sandbox Profiles", "file": "12-17.html"},
 "613": {"name": "Hook Failure Semantics", "file": "12-19.html"},
 "614": {"name": "Sub-Agent Isolation & Resume", "file": "12-15.html"},
 "615": {"name": "Tool Authorization Chain", "file": "12-18.html"},
 "616": {"name": "Two-Pass Compaction", "file": "12-5.html"},
 "617": {"name": "Hybrid Retrieval Pipeline", "file": "12-12.html"},
 "618": {"name": "Custom Sandbox Rules", "file": "12-17.html"},
 "619": {"name": "MCP Engineering Details", "file": "12-20.html"},
 "620": {"name": "Read-Only & Approval Boundary", "file": "12-8.html"},
 "621": {"name": "Token Local Estimate", "file": "12-11.html"},
 "622": {"name": "Plugin Trust Boundary", "file": "12-23.html"},
 "623": {"name": "Dream Lock & Idempotency", "file": "12-13.html"},
 "624": {"name": "Evidence Calibration", "file": "12-22.html"},
 "625": {"name": "Fact vs. Inference", "file": "12-2.html"},
 "626": {"name": "Two-Level Runtime Boundary", "file": "12-4.html"},
 "627": {"name": "Context Serialization Origin", "file": "12-6.html"},
 "628": {"name": "Template Override Variants", "file": "12-6.html"},
 "629": {"name": "Canonical Field List", "file": "12-10.html"},
 "630": {"name": "Metadata Contract Version", "file": "12-10.html"},
 "631": {"name": "Effective Runtime Fields", "file": "12-14.html"},
 "632": {"name": "Field-Level Merge Priority", "file": "12-14.html"},
 "633": {"name": "Persona Fail-Closed", "file": "12-14.html"},
 "634": {"name": "Coordinator Startup", "file": "12-16.html"},
 "635": {"name": "Plugin Source & Enabled State", "file": "12-21.html"},
 "636": {"name": "Directory Scan & Manifest", "file": "12-21.html"},
 "637": {"name": "Capstone Rubric Weights", "file": "12-24.html"},
 "638": {"name": "Resume Context Limit", "file": "12-15.html"},
 "639": {"name": "Tool Model Visibility", "file": "12-20.html"},
 "640": {"name": "Hook Blocking Capability", "file": "12-19.html"},
 "641": {"name": "Canonical Projection Trade-offs", "file": "12-10.html"},
 "642": {"name": "Multi-Agent Coordination Layer", "file": "12-16.html"},
 "643": {"name": "Plugin Three Gates", "file": "12-21.html"},
 "644": {"name": "Sandbox Profile Capabilities", "file": "12-17.html"},
 "645": {"name": "Dream Success Boundary", "file": "12-13.html"},
 "646": {"name": "Selection Evidence Grading", "file": "12-2.html"},
 "647": {"name": "Capstone Veto Items", "file": "12-24.html"},
 "648": {"name": "Build Host Boundary", "file": "12-23.html"},
 "649": {"name": "Headroom Threshold", "file": "12-11.html"},
 "650": {"name": "Namespace Coverage", "file": "12-9.html"}
};
