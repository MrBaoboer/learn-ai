/* Chapter 3 Quiz Bank · From Demo to Product (50 questions: Single 14 / Multi 5 / True-False 5 + expansions)
   g = topic group ID (this chapter uses 301-350), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 301,
  "type": "single",
  "q": "What is the core difference between Text-to-Image generation and Image-to-Image (img2img)?",
  "opts": [
   "Text-to-Image creates from scratch based purely on the model's imagination; img2img uses a reference image as an anchor to vary scene and action while preserving the character's appearance",
   "Text-to-Image can only output low-resolution sketches, while img2img is required to produce publication-quality high-resolution images",
   "The main difference is generation speed: img2img skips inference because it has a reference, so it renders faster",
   "Text-to-Image suits scenes with characters, while img2img suits pure backgrounds, food, and non-character subjects"
  ],
  "ans": 0,
  "exp": "Text-to-Image creates something from nothing — the model imagines the character differently every time. Img2img anchors to a reference image, locking the character's appearance so the model only varies scene and action within that constraint. Neither technique is related to resolution or speed, and the use-case split is actually the opposite of option D: character continuity requires img2img, while pure backgrounds and product close-ups work fine with text-to-image."
 },
 {
  "g": 302,
  "type": "single",
  "q": "In an AI image-generation product, why add a layer that uses an LLM to write Prompts for the image model between user input and the image model?",
  "opts": [
   "Because image models only accept English input, so this layer mainly handles Chinese-to-English translation",
   "Users don't know how to write image-generation Prompts — vague intents like 'daydreaming' need to be translated into precise visual descriptions, and each image model has its own preferred Prompt style",
   "To compress the user's long input into a short command, reducing the per-token cost charged by the image model",
   "This layer only filters prohibited content and has no bearing on generation quality"
  ],
  "ans": 1,
  "exp": "The course gives three reasons: users don't know to specify details like 'golden hour lighting'; a phrase like 'daydreaming' has no visual meaning for an image model; and Midjourney, DALL-E, and Stable Diffusion each have their own 'dialect'. So every image generation involves an LLM expanding a single sentence into a detailed visual description of several hundred tokens. This is necessary architecture — it has nothing to do with translation language, cost savings, or content moderation."
 },
 {
  "g": 303,
  "type": "single",
  "q": "In an AI image-generation product, what is the core solution to ensuring 'the same character looks identical every time'?",
  "opts": [
   "Lower sampling parameters like Temperature on the image model to make outputs more stable",
   "Write the character's appearance in sufficient detail in the Prompt — pure text description is enough to lock in the visual identity",
   "Include a standardized Character Reference Sheet with every generation to anchor key features like facial structure, body proportions, and hairstyle",
   "Fix the same image model and lock the random seed — this completely solves consistency"
  ],
  "ans": 2,
  "exp": "The course demonstrates with an experiment: generating four times with the same text description yields different facial structure, hairstyle, and body shape each time — pure text cannot lock a character's visual identity. Character consistency is a product design problem, not solvable by tweaking parameters. The solution used in the course is to include a standardized Character Reference Sheet with every generation, so the model has something to look at."
 },
 {
  "g": 304,
  "type": "single",
  "q": "Which statement about a multi-model fallback chain for image-generation products is correct?",
  "opts": [
   "When the primary model fails, it automatically switches to a backup model transparently to the user; if all models fail, a friendly message is shown and the request is queued",
   "When the primary model fails, display an error page immediately, clearly telling the user which provider is down",
   "The fallback chain requires all backup models to have identical capabilities — models that don't support img2img cannot enter the chain",
   "The health-check mechanism distributes requests evenly across all models to achieve load balancing"
  ],
  "ans": 0,
  "exp": "Users only care whether the image is produced: model A times out, model B is rate-limited, model C steps in — all of this is completely transparent to the user. Even if all models fail, the user receives only a friendly 'service busy, you've been queued' message, never a cold error page. When a backup model doesn't support img2img, it can degrade to text-to-image — quality drops but at least an image is produced. Health-checking periodically tests model availability and skips downed models; it is unrelated to load balancing."
 },
 {
  "g": 305,
  "type": "single",
  "q": "In production environments, what does the 'diminishing returns' stuck loop mode for an Agent refer to?",
  "opts": [
   "The Agent calls the same tool three consecutive times with identical parameters, spinning in place",
   "The Agent runs dozens of loop iterations, but each round only performs safe but useless minor actions like reformatting or re-confirming, with almost no progress toward the core goal",
   "The model regenerates exactly what it said before, producing repetitive output",
   "After one tool times out, the Agent retries frantically, bringing down other tools that depend on it"
  ],
  "ans": 1,
  "exp": "Diminishing returns means the Agent appears busy, but each round only does safe, low-value micro-actions. After 50 iterations, almost nothing of value has been produced — the user experience is 'I waited two minutes for this?' The other three options correspond to the other three stuck-loop patterns described in the course: same-parameter loops, text repetition, and tool-failure cascades."
 },
 {
  "g": 306,
  "type": "single",
  "q": "Agent failsafe design includes three strategy categories: hard limits, detection, and degradation. What is the correct layering relationship?",
  "opts": [
   "Hard limits force a stop first, then detection analyzes the cause, then degradation handles cleanup",
   "Degradation tries to self-recover first; if that fails, detection escalates; hard limits act as the unconditional last-resort safety net",
   "Only one of the three categories can be deployed — using all three simultaneously causes conflicts",
   "Detection is the last line of defense, unconditionally terminating the loop when anomalies occur"
  ],
  "ans": 1,
  "exp": "Failsafes aren't a single wall — they're a three-layer net. The design principle is: degradation self-rescues first (inject correction prompts, disable broken tools, force progress summary); detection monitors anomaly patterns and triggers degradation; hard limits (iteration cap, total timeout, per-tool call limit) act as the final unconditional brake. Brute-force termination is a last resort — returning with partial results is better than returning with nothing."
 },
 {
  "g": 307,
  "type": "single",
  "q": "An Agent task running in the background for 30 seconds — what is the core idea behind a good streaming UX?",
  "opts": [
   "Show a countdown timer accurate to the second; if precise estimation is impossible, show nothing at all",
   "Let users see the process, make progress perceptible, let output appear incrementally — give users the sense that the AI is actively working",
   "Replace all text explanations with a spinning loader; the simpler the UI the better",
   "Print the complete backend call log to the user; the more information, the better the experience"
  ],
  "ans": 1,
  "exp": "Three principles of progress-sense design: show what's being done (searching, analyzing); make progress perceptible with numbered status like 'found 3 results'; let text stream out token by token — streaming output is itself the best progress bar. Users can tolerate waiting, but not 'not knowing what they're waiting for'. Even without precise estimates, showing stage-by-stage progress beats a single spinner."
 },
 {
  "g": 308,
  "type": "single",
  "q": "A user sends a single sentence to an Agent, which may run 10+ loop iterations behind the scenes. Where does most of the cost come from?",
  "opts": [
   "The user's input sentence itself — more words means higher cost",
   "The System Prompt sent repeatedly every iteration, long tool return texts, and context snowballing with each round",
   "The model's final response text — the output token price determines the majority of the cost",
   "Network transfer and image storage fees, largely unrelated to token count"
  ],
  "ans": 1,
  "exp": "The course names three major cost drivers: the System Prompt is resent every iteration — the more iterations, the greater the repeated consumption; tool returns are typically very long (entire file contents, search results); later iterations must include all previous messages, growing in a snowball effect. Agent costs grow far super-linearly with iteration count — a single user sentence can correspond to dozens of API messages."
 },
 {
  "g": 309,
  "type": "single",
  "q": "What is the mechanism behind 'the longer the conversation, the dumber the AI'?",
  "opts": [
   "As conversations grow longer, model parameters degrade and reasoning ability physically declines",
   "The model's attention distribution is hot at both ends and cold in the middle — information in the middle of a conversation is most easily overlooked",
   "Long conversations trigger the provider to automatically switch to a lower-tier model to save compute",
   "Once context exceeds half the window, the model randomly discards the second half of the input"
  ],
  "ans": 1,
  "exp": "Attention is highest near the System Prompt and the most recent messages, and lowest in the middle. If the user mentioned an important requirement in turn 3, by turn 8 the AI has very likely already ignored it. This is unrelated to model parameters or provider switching. Window overflow discards the earliest messages (not random), and only happens after the window is truly full — a different mechanism from 'getting dumber'."
 },
 {
  "g": 310,
  "type": "single",
  "q": "What is the correct priority order when compressing context?",
  "opts": [
   "First delete raw tool output; then summarize and compress long AI responses; never touch the user's original messages",
   "User messages are usually the longest, so compress them first for maximum savings",
   "The System Prompt is the most wasteful since it's resent every round, so delete it first",
   "Treat all messages equally and delete strictly from oldest to newest"
  ],
  "ans": 0,
  "exp": "Compression priority from high to low: tool output (search results, API-returned JSON — useless once processed) can be deleted directly; long AI responses can be replaced with summaries; user messages are sacred — delete them and you can never get them back, and the user will notice ('I clearly said X — why did you forget?'). It's better to delete 1,000 words the AI said than to touch 10 words the user said."
 },
 {
  "g": 311,
  "type": "single",
  "q": "How should local compression and LLM compression work together?",
  "opts": [
   "Do zero-cost local truncation and template replacement first; only if the window is still over capacity afterward should you spend money calling an LLM for summarization",
   "Use LLM summarization first to ensure semantic quality, then apply local truncation to the remainder",
   "The two approaches are mutually exclusive — using both simultaneously corrupts semantics",
   "Local compression is more precise; LLM compression is just a rough, zero-cost fallback"
  ],
  "ans": 0,
  "exp": "The recommended process is four steps: local truncation (delete tool output, truncate long JSON), template replacement, check if sufficient, and only if still over capacity should you invoke LLM summarization. Use free methods to compress as much as possible; only pay for AI help when truly necessary — this order must not be reversed. Their properties are also opposite: local compression is zero-cost and fast but coarse; LLM compression costs money and adds latency but is semantically precise."
 },
 {
  "g": 312,
  "type": "single",
  "q": "Which statement correctly describes the relationship between the context window and long-term memory?",
  "opts": [
   "Context is like a whiteboard — gets full, gets erased when the conversation ends; long-term memory is like a notebook — persists across sessions, accessible next time",
   "Context capacity is nearly unlimited; long-term memory is what's constrained by the window size limit",
   "They are different names for the same storage — no real difference",
   "Long-term memory reads/writes faster than context, so information should be written to memory whenever possible"
  ],
  "ans": 0,
  "exp": "Context is a temporary workspace during a conversation — always available and very fast, but limited in capacity and erased when the session ends. Long-term memory persists across sessions with expandable capacity, but requires a write decision and extra retrieval steps. Good AI products need both systems working together: context for remembering right now, memory for remembering long-term."
 },
 {
  "g": 313,
  "type": "single",
  "q": "Old memory says 'early riser'. Today the user says 'I've been exhausted lately and keep sleeping in'. Which memory strategy should the system use?",
  "opts": [
   "Overwrite: replace the sleep habit directly with 'sleeping in'",
   "Merge & extend: rewrite as 'sometimes an early riser, sometimes sleeps in'",
   "Flag conflict: keep both entries and mark as pending confirmation",
   "Skip: temporary state does not overwrite a long-term habit — keep 'early riser' unchanged"
  ],
  "ans": 3,
  "exp": "'I've been exhausted lately' is a temporary state, not evidence that the user has changed a long-term habit — the correct action is to skip and not write. Each of the four strategies has its place: overwrite when there's a clear new-versus-old relationship (switched from coffee to tea); merge when the new and old complement each other (lives in Beijing but often goes to Shanghai); flag conflict when it's unclear who is right (birthday on the 15th or 16th?); skip when the information is not confirmed enough."
 },
 {
  "g": 314,
  "type": "single",
  "q": "A product registers hundreds of tools. What is the correct way to 'lazy-load' tool descriptions?",
  "opts": [
   "The first round only provides the tool name plus a one-line description; when the AI decides to call a specific tool, inject the full description dynamically, then retract it after use",
   "Write every tool's full description into the System Prompt — the more complete the information, the smarter the AI",
   "Rotate a subset of tool descriptions each round in alphabetical order so every tool gets exposure",
   "Let users manually check which tools are available for this conversation in settings — the AI doesn't participate in selection"
  ],
  "ans": 0,
  "exp": "Loading 100 tools at full capacity consumes tens of thousands of tokens just for descriptions. Lazy-loading puts only a name list in the first round (about 28 tokens each), injects the full description (about 350 tokens) only when needed, and retracts it after use — saving about 90% of the overhead. Like a company directory: you only need names and titles normally; you look at the full profile when you actually need to collaborate. Giving too much information overwhelms both AI and humans."
 },
 {
  "g": 315,
  "type": "multi",
  "q": "From 'getting the image-generation API working' to 'users can actually use it', what does the productization work include? (Select all that apply)",
  "opts": [
   "Experience layer: generation progress feedback, one-click retry on failure, result preview and history",
   "Engineering layer: model fallback chain, timeout/retry strategy, per-user cost limits",
   "Safety layer: bidirectional input/output content moderation, copyright risk and privacy protection",
   "Display the image API's raw error messages directly to users, in the name of transparency",
   "Switch to a larger image model — if the model is strong enough, no productization is needed"
  ],
  "ans": [0, 1, 2],
  "exp": "The course checklist covers experience, quality, engineering, and safety dimensions — 16 items total. Getting the API working is only 10%; the remaining 90% is productization, which took three months in the course example. Throwing raw error messages at users is exactly what should be avoided (use fallback chains and friendly messages instead). Switching to a larger model doesn't replace the engineering work around experience and safety."
 },
 {
  "g": 316,
  "type": "multi",
  "q": "Regarding the trade-off framework for context compression, which statements are correct? (Select all that apply)",
  "opts": [
   "Old tool call results and completed intermediate steps fall into the 'can be deleted' category",
   "Long AI responses and multi-turn discussion conclusions fall into 'can be compressed' — preserve the core with a summary",
   "The user's original messages, System Prompt, and key preference settings fall into 'must not be touched'",
   "The goal of compression is to get the context as short as possible — information value can be a secondary concern"
  ],
  "ans": [0, 1, 2],
  "exp": "The decision framework has three tiers: can delete (old tool output, processed intermediate steps, repeated confirmations); can compress (long AI responses, discussion conclusions, query details); must not touch (user's exact words, System Prompt, key preferences). Compression is finding a balance between information value and token cost — like an experienced editor who knows what's filler and what must stay. Chasing brevity at all costs will delete critical information."
 },
 {
  "g": 317,
  "type": "multi",
  "q": "Which types of content would the long-term memory system's 'gatekeeper' consider worth remembering? (Select all that apply)",
  "opts": [
   "User preferences, e.g. 'doesn't like bubble tea, prefers coffee'",
   "Important facts, e.g. profession, city, names of their two cats",
   "Filler words, e.g. 'uh-huh', 'okay', 'hahaha'",
   "One-off questions, e.g. 'what time does work end this afternoon?'",
   "Long-term habits, e.g. 'uses Markdown for documentation; wants concise writing style'"
  ],
  "ans": [0, 1, 4],
  "exp": "What's worth remembering: preferences, important facts, long-term habits, and clearly expressed need patterns. Filler words, one-off questions, content-free small talk, and stale temporary information are not worth remembering. If everything gets stored, the memory bank quickly becomes a junk pile — the gatekeeper matters more than memory capacity: knowing what to remember is more important than how much you can remember."
 },
 {
  "g": 318,
  "type": "multi",
  "q": "Which scenarios genuinely warrant introducing multiple Agents? (Select all that apply)",
  "opts": [
   "Parallel speedup: 5 independent searches running simultaneously, compressing a 25-second task to 5 seconds",
   "Role division: a Writer Agent writes code while a Reviewer Agent independently reviews it, providing mutual checks",
   "Risk isolation: PDF parsing delegated to a sub-Agent so a parsing failure doesn't crash the main task",
   "Any moderately complex task should be split into multiple Agents — the more Agents, the stronger the overall capability"
  ],
  "ans": [0, 1, 2],
  "exp": "The course explicitly states that a single Agent suffices in most cases; only parallel speedup, role division, and risk isolation justify splitting. Before adding a second Agent, ask: can a single Agent truly not handle it (often it's just a poorly written Prompt)? Is the added coordination cost worth it? Is there a simpler alternative like parallel tool calls?"
 },
 {
  "g": 319,
  "type": "multi",
  "q": "Regarding the balance design between 'too many popups annoy users' and 'no popups is unsafe', which statements are correct? (Select all that apply)",
  "opts": [
   "Low-risk, read-only operations like reading files or searching information execute automatically without a popup",
   "Irreversible or high-impact operations like deleting files, sending messages, and processing payments must prompt for confirmation",
   "For absolute safety, every single Agent action should prompt the user for confirmation",
   "Risk levels can be predefined by the product manager, assessed by the AI based on context, or customized by the user"
  ],
  "ans": [0, 1, 3],
  "exp": "The solution is risk tiering: low risk executes automatically, high risk requires confirmation. Prompting on every single step is precisely what the course argues against — after clicking 'Allow' five times, users will want to uninstall. Three approaches to defining risk levels: product manager predefines (most common), AI judges by context (more flexible but not always accurate), user customizes (most flexible but adds configuration cost)."
 },
 {
  "g": 320,
  "type": "judge",
  "q": "A production-level System Prompt is best written as a single continuous block of text, mixing identity, environment, tools, and behavior together — the model understands it more naturally this way.",
  "ans": false,
  "exp": "Exactly the opposite. A monolithic text means changing one part may affect everything else, and no one can tell which section influences which behavior. The production approach is to manage it in four layers: the identity layer changes almost never; the environment layer may differ each session; the tool layer changes with feature iterations; the behavior layer iterates most frequently. After layering, changing one layer doesn't affect the others, multi-person collaboration doesn't conflict, A/B tests have a single variable, and debugging can proceed layer by layer."
 },
 {
  "g": 321,
  "type": "judge",
  "q": "In multi-Agent concurrent scenarios, read-only operations can run in parallel; write operations should in principle be queued. However, if two write operations modify different resources (different files, different database tables), they can also run in parallel.",
  "ans": true,
  "exp": "The rule is: 'does executing this operation change the world?' Read operations like searching, reading files, and querying APIs don't interfere with each other — 10 can run simultaneously with no conflict. Write operations like writing files, sending emails, and payments change external state; modifying the same resource concurrently causes data overwrite. The essence of conflict is multiple operations modifying the same resource — if the write targets are different, write operations can also run in parallel."
 },
 {
  "g": 322,
  "type": "judge",
  "q": "As long as the Agent ultimately completes the task, there's no need to log which tools it called, how many tokens it consumed, or whether any errors occurred during execution.",
  "ans": false,
  "exp": "Observability is a fundamental productization requirement: without logs you can never know what went wrong with an Agent, and you can't answer basic questions — it's a black box. For developers, logs are used to locate problems and identify wasted loops and tokens. For product managers, they're used to understand real user paths, quantify the cost of each feature, and provide data for iteration. Even apparent task completion can hide retries and waste."
 },
 {
  "g": 323,
  "type": "judge",
  "q": "The MCP protocol is bidirectional: the same application can act as a Client to call tools provided by others, and also act as a Server to expose its own capabilities to external clients like Cursor.",
  "ans": true,
  "exp": "Most people understand MCP as 'letting AI call external tools', but it's two directions of the same protocol: as a Client, actively connecting to services like calendar and email to gain capabilities; as a Server, being called by Cursor, Claude Desktop, and automation scripts. One-way integration is no different in essence from a regular API. Bidirectionality means AI can not only use tools but become a tool — this is what enables multiple Agents to call each other and form an ecosystem."
 },
 {
  "g": 324,
  "type": "judge",
  "q": "AI self-configuration of tools means: when an Agent discovers it lacks a certain tool, it can directly install and connect a new MCP service without needing user consent.",
  "ans": false,
  "exp": "The four key design principles of self-configuration explicitly include user authorization: AI cannot secretly connect to new services. It must inform the user ('I'd like to connect to service X'), and only proceed after explicit user approval — this is the baseline of trust. Tools involving sensitive data require even stricter approval. Self-configuration's value is automating complex configuration processes, lowering the barrier from 'can configure' to 'can speak', while preserving user decision-making authority."
 },

 /* Question bank expansion */
 {
  "g": 325,
  "type": "single",
  "q": "Textbooks describe the Agent loop as three steps: Think, Act, Observe. A real production single-round loop actually has eleven steps. What are the additional steps mainly about?",
  "opts": [
   "Context trimming and token budget check, permission validation and parameter compliance, timeout monitoring and error fallback, result write-back and security audit logging",
   "Having the model think a few more rounds before acting — repeating the same Think step three times to improve reasoning quality",
   "Rewriting user input in different phrasings and sending each version to the model, then having the model vote on the best answer",
   "Inserting fixed wait intervals between every two steps to give external services recovery time and avoid triggering rate limits"
  ],
  "ans": 0,
  "exp": "The course's actual single-round flow has eleven steps: receive and parse intent; context trimming and token budget; inject system instructions and constraints; Think; permission validation and parameter compliance; Act with concurrent dispatch; timeout monitoring and error fallback; Observe; result write-back and state update; security audit logging; decide whether to continue. The textbook's three steps are just the skeleton — the additional parts are the core engineering work that makes Agents stable, safe, and usable. Repeated reasoning, multi-path voting, and inserted waits are not in the course's flow."
 },
 {
  "g": 326,
  "type": "single",
  "q": "A user's long-term memory accumulates 1,000 entries. The product still loads all memories into the System Prompt every round. What happens?",
  "opts": [
   "Approximately 40K tokens directly consume one-third of the context window, costs spike, and about 85% of the injected memories are irrelevant to the current conversation",
   "More memories means more accurate understanding — the only trade-off is a slightly slower first response",
   "The system automatically keeps only the most recently written dozen entries; all other memories silently expire, keeping costs unchanged",
   "The injected memories count as a cached prefix, so repeated sending incurs no extra cost — the cost is the same as with 10 entries"
  ],
  "ans": 0,
  "exp": "The course's calculation: injecting 1,000 entries in full takes about 40K tokens, directly filling one-third of the window, with noise occupying about 85% — full injection is no longer viable. Full injection is fine with 10 memories, but as memories grow, on-demand retrieval is the only scalable approach. More memories actually make it harder for the model to find the key points; the system won't automatically trim on behalf of the product."
 },
 {
  "g": 327,
  "type": "single",
  "q": "In a Prompt Harness, what does each of System Prompt, Tool, and Skill manage?",
  "opts": [
   "System Prompt manages global identity; Tool manages capability registration; Skill manages how to execute a specific task step by step",
   "System Prompt manages behavior rules; Tool manages persona; Skill manages tool parameter formats and call restrictions",
   "The three are different ways to write the same configuration — pick any one and fill it in completely; mixing them causes overrides",
   "System Prompt manages single calls; Tool manages global identity; Skill manages session-level environment injection"
  ],
  "ans": 0,
  "exp": "The course contrast: System Prompt defines who the AI is — global scope, rarely changed, lifespan is the entire product. Tool tells the AI what capabilities are available — it's the capability menu, scoped to a single call. Skill is a complete task execution plan, specifying when to trigger, which tools to use, and what steps to follow — the most frequently iterated with independent versioning. The three have different scopes, modification frequencies, and lifecycles, and cannot substitute for each other."
 },
 {
  "g": 328,
  "type": "single",
  "q": "The same Skill content — written into the System Prompt versus appended as an independent message after the System — how does cache performance differ?",
  "opts": [
   "Written into System Prompt, switching Skills changes the prefix, hitting ~20% cache rate; appended as a separate message keeps the System prefix unchanged, hitting ~90%",
   "The two approaches have essentially the same cache hit rate; the only difference is how much weight the model gives the instruction",
   "Written into System Prompt achieves higher hit rate because longer prefixes are more likely to be recognized and reused by the cache",
   "Appending as a separate message forces the full request to be recomputed every round, actually resulting in a lower hit rate"
  ],
  "ans": 0,
  "exp": "The KV Cache rule: if the prefix is byte-for-byte identical, it's a cache hit; one character different and everything is recomputed. With Skill inserted into the System Prompt, every Skill switch changes the prefix fingerprint — simulation results show about 20% hit rate. With Skill placed after the System as a separate message, the System prefix is always stable, hitting about 90%. The cache only cares whether the prefix is character-for-character identical — it has nothing to do with prefix length or how much weight the model gives the instruction."
 },
 {
  "g": 329,
  "type": "single",
  "q": "When using brainstorm mode to have multiple Agents answer the same question, what is the most critical practice?",
  "opts": [
   "Each Agent must think independently without seeing other Agents' answers; a facilitator then synthesizes consensus and divergence at the end",
   "Have Agents speak in sequence, each referencing the previous answer to progressively refine and converge on a single conclusion",
   "The more Agents the better — as long as compute allows, add more for broader coverage",
   "When consolidating, keep only the parts all three Agents agree on; discard anything that shows disagreement"
  ],
  "ans": 0,
  "exp": "The course explicitly states that each Agent must think independently and cannot see other Agents' answers — like human brainstorming's 'write separately first, then discuss together'. If Agent B can see A's answer, it gets anchored and the brainstorm loses its purpose. Divergence should not be discarded: when three Agents agree, the direction is clear; when they diverge, that topic warrants deeper discussion — divergence itself is the value."
 },
 {
  "g": 330,
  "type": "single",
  "q": "An Agent summarizes news every hour for 24 consecutive runs. What is the difference between reusing the same session versus creating a new session each time?",
  "opts": [
   "Reusing the session, context accumulates with each run — the 24th run costs about 48,000 tokens; creating a new session, the 24th run costs exactly the same as the 1st",
   "Reusing the session lets the Agent remember what was summarized before — costs only slightly more than new sessions, making it overall more economical",
   "Total cost is similar either way; the difference only shows up as slightly higher response latency when reusing sessions",
   "Creating a new session requires reloading the model and system configuration each time — startup overhead makes it actually more expensive"
  ],
  "ans": 0,
  "exp": "Reusing old sessions causes context snowballing: run 1 costs about 2,000 tokens, run 10 about 20,000 tokens, run 24 about 48,000 tokens — every request pays for all that history. Total cost over 24 hours is about $7.20. Creating a new session starts from zero each time at about $0.03 per run — about $0.72 over 24 hours, a 10x difference. Most scheduled tasks don't need context memory; summarizing the current news is sufficient."
 },
 {
  "g": 331,
  "type": "single",
  "q": "Among the five permission modes, which correctly describes 'Suggestion Mode'?",
  "opts": [
   "The AI analyzes and provides suggestions and plans without executing directly; the user reviews and chooses to accept, modify, or reject — suitable for scenarios like code review suggestions and investment analysis",
   "The AI completes most operations automatically, pausing only for high-risk operations like delete, send, or payment to ask the user",
   "The AI can only read information, analyze data, and answer questions — no write or execute permissions at all, zero risk but limited capability",
   "Every AI action, including reading files, requires individual user approval — highest security but users quickly experience fatigue"
  ],
  "ans": 0,
  "exp": "Suggestion Mode positions AI as proposer and human as decider. Advantages: human keeps control, AI provides expert support. Trade-off: slower pace and the user needs domain expertise to review. Typical scenarios: code review suggestions, investment analysis, medical diagnosis assistance. The other three options correspond to 'auto with high-risk confirmation' (currently most mainstream), 'read-only mode', and 'fully manual' — each occupying different positions on the permission spectrum."
 },
 {
  "g": 332,
  "type": "single",
  "q": "A product registers 10 MCP services using 'lazy connection'. What is the correct meaning of lazy connection?",
  "opts": [
   "At startup, only register which tools are available without establishing network connections; only connect when actually needed for the first time; if a service goes down, only that one tool is affected",
   "Still connect all services at startup, but with shorter timeouts; services that don't connect are retried at the next startup",
   "Connect in registration order — wait for each one to succeed before connecting the next, to avoid concurrent connections overwhelming the network",
   "Only connect services the user has checked in the settings page; unchecked services are completely invisible to the AI"
  ],
  "ans": 0,
  "exp": "Three principles of lazy connection: registration doesn't equal connection; connect on first use; fault isolation. If all 10 services are connected at startup and 3 time out, startup blocks for 30 seconds. With lazy connection, startup goes from 30 seconds to 0.2 seconds — users experience instant loading. Fault isolation means a downed service only affects that one tool; other tools continue working normally."
 },
 {
  "g": 333,
  "type": "single",
  "q": "Using the iceberg model to compare 'chat-wrapper apps' and true Agent products, what are the eight layers below the surface?",
  "opts": [
   "Loop control, context compression, memory system, Prompt architecture, multi-Agent coordination, permissions and security, MCP integration, observability",
   "UI design, color guidelines, animation rhythm, copy tone, icon style, typography hierarchy, responsive layout, accessibility support",
   "Model selection, parameter tuning, fine-tuning data, distillation compression, quantized deployment, inference acceleration, VRAM management, kernel optimization",
   "User growth, retention analysis, paid conversion, channel advertising, community operations, brand communication, competitive monitoring, pricing strategy"
  ],
  "ans": 0,
  "exp": "Users only see the chat interface, AI image generation, and smart replies. Below the surface lie eight layers of product decisions: loop control, context compression, memory system, Prompt architecture, multi-Agent coordination, permissions and security, MCP integration, observability. Taking loop control as an example: a chat-wrapper runs a single while loop until tokens run out; a real Agent has step limits, timeout circuit breakers, and automatic anomaly termination. These eight layers are all product decisions — distinct from UI details, model training, and growth operations."
 },
 {
  "g": 334,
  "type": "single",
  "q": "In Agent failsafe design, what are the three unconditional stops in the 'hard limits' category?",
  "opts": [
   "Iteration cap, total timeout, per-tool call limit",
   "Same-parameter detection, same-tool-name detection, diminishing-returns detection",
   "Inject correction prompts, disable broken tools, force-summarize current progress",
   "Scheduled health checks, priority ordering, tool whitelist"
  ],
  "ans": 0,
  "exp": "Hard limits are unconditional stops, comprising: iteration cap (e.g. 50 rounds), total timeout (e.g. 3 minutes), and per-tool call limit (e.g. the same API endpoint at most 5 times). The second option is the detection category's tools; the third option is the degradation category's tools. All three together form the complete three-layer net. Scheduled health checks and priority whitelists belong to the multi-model fallback chain for image generation — they're not part of the failsafe strategies."
 },
 {
  "g": 335,
  "type": "single",
  "q": "The four Agent stuck-loop patterns covered in the course (same-parameter loop, diminishing returns, text repetition, tool-failure cascade) share one common characteristic. What is it?",
  "opts": [
   "They typically don't throw errors — users only notice the AI has become slower or dumber; the problem is very difficult to detect directly",
   "They all throw clear exception stack traces; you can immediately see the failed tool and reason in the logs",
   "They only occur in the first few turns when a conversation starts; the longer the context, the less likely they are to trigger",
   "They can all be solved by raising the iteration cap — given enough rounds, the Agent will find its own way out"
  ],
  "ans": 0,
  "exp": "What these four patterns share is that they don't throw errors: the Agent appears to be working normally — the user's experience is just 'why is this so slow', 'it's saying the same thing again', 'I waited two minutes for this?'. Precisely because there's no clear error signal, proactive detection and failsafe design are needed. Text repetition actually occurs in the later stages of long conversations when context is approaching the window limit; raising the iteration cap only makes the waste worse."
 },
 {
  "g": 336,
  "type": "single",
  "q": "In the same Agent product, a user says 'check the weather for me' versus 'refactor this module's code'. Where does the difference in billing show up?",
  "opts": [
   "Weather check: about 2 loop iterations, just over 1,000 tokens, about $0.003; code refactor: about 12 loop iterations, nearly 8,000 tokens, about $0.08",
   "Both sentences only call the model once; cost difference mainly comes from the length of the model's output text",
   "Code refactor has more iterations, but each round only sends incremental messages, so total cost is only slightly higher than the weather check",
   "Cost is mainly determined by the number of characters in the user's input; the two sentences are similar in length, so the final bill is roughly the same"
  ],
  "ans": 0,
  "exp": "The course simulation shows the weather check as 2 loop iterations, 6 API messages, 1,035 tokens, about $0.003; code refactoring as 12 loop iterations, about 7,971 tokens total, about $0.08 — more than 20x the difference. Agent costs grow far super-linearly with iteration count because every round must resend all previous content to the model. The user's input characters represent a tiny fraction — tool returns and context accumulation are the main drivers."
 },
 {
  "g": 337,
  "type": "single",
  "q": "Regarding the three reasons why 'context must be managed', which statement is correct?",
  "opts": [
   "Every round resends the full history — the single-call cost in round 8 is about 20x that of round 1; once the window is full, the earliest messages are discarded directly",
   "Cost is only related to the latest round's input length; historical messages are stored server-side and not billed again",
   "Once the window is full, the system automatically applies summary compression; no design work is needed on the product side",
   "The most serious of the three reasons is slower response time; cost and attention degradation effects can be ignored"
  ],
  "ans": 0,
  "exp": "The three reasons are: gets more expensive, gets dumber, gets more dangerous. On cost: round 1 is about 500 tokens, round 8 is about 9,800 tokens — the single-call cost grows from $0.01 to $0.196, about 20x. On danger: the window has a hard limit; once full, the earliest information is discarded forever — the user's earlier statements can no longer be seen by the AI. Summary compression must be designed by the product itself; historical messages are resent every round."
 },
 {
  "g": 338,
  "type": "single",
  "q": "Before adding a second Agent to a product, the course suggests asking yourself three questions first. What are they?",
  "opts": [
   "Can a single Agent truly not handle this; is the added complexity worth it; is there a simpler solution",
   "Which model to use; how much token budget to allocate; which region to deploy in",
   "Which Agent leads and which assists; what communication format to use; where to write the logs",
   "Will users be willing to wait a few extra seconds; should a progress bar be added; how to notify on failure"
  ],
  "ans": 0,
  "exp": "The course's three self-check criteria: can a single Agent truly not handle this (often it's just a poorly written Prompt); is the added complexity worth it (multi-Agent means more coordination cost and failure possibilities); is there a simpler solution (e.g. parallel tool calls can often solve it). Only with clear needs for parallel speedup, role division, or risk isolation is it worth introducing multiple Agents. The other three option groups are all implementation details for after you've decided to split."
 },
 {
  "g": 339,
  "type": "single",
  "q": "A task includes 3 searches (taking 2s, 3s, and 2s respectively) and 1 write (1s). Scheduled according to concurrency rules, what is the approximate total time?",
  "opts": [
   "About 4 seconds: 3 searches run in parallel, taking the slowest one; the write runs separately after the searches",
   "About 8 seconds: all operations can only execute sequentially and must be added up",
   "About 3 seconds: searches and write all run in parallel, total time is the slowest one",
   "About 6 seconds: searches must run in pairs serially; only the write can run in parallel with searches"
  ],
  "ans": 0,
  "exp": "There's one rule for determining whether operations can be concurrent: does executing this operation change the world? Searches are read-only — 3 in parallel, taking the slowest at 3s. The write changes external state, so it runs separately afterward at 1s — total about 4s. Running the same batch serially would take about 8s. Write operations that modify different resources can also run in parallel, but the dependency ordering of read-before-write must still be respected."
 },
 {
  "g": 340,
  "type": "single",
  "q": "When managing the System Prompt in four layers, which layers do 'user's language preference and timezone' and 'output format and safety guardrails' respectively belong to?",
  "opts": [
   "The former belongs to the environment layer; the latter belongs to the behavior layer",
   "The former belongs to the identity layer; the latter belongs to the tool layer",
   "The former belongs to the behavior layer; the latter belongs to the environment layer",
   "Both belong to the identity layer, because both describe who the AI is facing"
  ],
  "ans": 0,
  "exp": "The environment layer provides current runtime information — including user language preference, timezone, OS, and session context — characterized by varying each session. The behavior layer specifies response style and format, decision priorities, and safety guardrails — the most frequently iterated layer in product development. The identity layer manages name, personality, and capability boundaries (rarely changed), while the tool layer manages tool names, parameter formats, and usage limits. Layering means changing one layer doesn't affect the others."
 },
 {
  "g": 341,
  "type": "multi",
  "q": "Regarding the 'on-demand retrieval' injection strategy for long-term memory, which statements are correct? (Select all that apply)",
  "opts": [
   "After the user sends a message, perform a semantic search first to find 3 to 10 relevant memories",
   "Only inject the retrieved relevant memories precisely into the System Prompt; leave all other memories out",
   "The value of memory lies in being able to surface the most relevant few entries each time; how many total entries exist is less important",
   "On-demand retrieval is simpler to implement than full injection because it doesn't require an additional retrieval system",
   "The number of memory entries is the core quality metric — the more entries, the better the product experience"
  ],
  "ans": [0, 1, 2],
  "exp": "Recommended flow: user sends message; semantic search finds 3–10 relevant entries; inject precisely; model responds with context. This keeps injected tokens stable at a few hundred, noise at about 10%, and cost barely grows with total memory count. On-demand retrieval is significantly more complex to implement, requiring a retrieval system; full injection is trivially simple but expensive and noisy. Entry count alone is not a quality metric — stuffing 1,000 entries in actually makes it harder for the AI to find key points."
 },
 {
  "g": 342,
  "type": "multi",
  "q": "When choosing a permission mode for a feature, what judgment dimensions does the course provide? (Select all that apply)",
  "opts": [
   "Reversibility of the operation: sending a message is irreversible; reading a file is reversible",
   "Cost of error: deleting data has high cost; searching information has low cost",
   "User trust level: new users tend toward caution; experienced users are more willing to grant autonomy",
   "Model parameter scale: the larger the model, the more autonomy it should be given",
   "The same product must use a single permission mode globally — different features cannot mix modes"
  ],
  "ans": [0, 1, 2],
  "exp": "Permission mode selection depends on three dimensions: reversibility of the operation, cost of error, and user trust level. The course also explicitly states that different features within the same product can use different permission modes — global uniformity is not required. Model parameter scale has no bearing on how much permission to grant. How much freedom to give AI is fundamentally a product question: if this goes wrong, who is responsible?"
 },
 {
  "g": 343,
  "type": "multi",
  "q": "The hands-on overview groups Chapter 3 into eight themes. Which of the following belong to those eight themes? (Select all that apply)",
  "opts": [
   "Agent loop: real loops far exceed textbook versions, anti-infinite-loop mechanisms, multi-step state management",
   "Permissions & security: five-level permission spectrum, risk tiering strategy, observability dashboard",
   "MCP in practice: bidirectional protocol integration, lazy connection startup, AI self-configuration of tools",
   "Model training: data labeling pipeline, fine-tuning and distillation, quantized deployment and inference acceleration",
   "Growth operations: channel advertising, community management, paid conversion and pricing strategy"
  ],
  "ans": [0, 1, 2],
  "exp": "The eight themes are: AI image generation, Agent loop, context management, memory system, Prompt engineering, multi-Agent, permissions and security, MCP in practice — all answering one question: what does it actually take to go from Demo to product? Model training and growth operations are both outside this chapter's scope. The course's conclusion: going from Demo to product isn't just one feature — it's thinking across eight dimensions."
 },
 {
  "g": 344,
  "type": "multi",
  "q": "What content does a standardized Character Reference Sheet anchor for image generation? (Select all that apply)",
  "opts": [
   "Facial structure and body type: locking facial proportions, body contours, and hairstyle length",
   "Expression style: providing multiple expression variations so the model understands this character's expression range",
   "Outfit style: signature clothing so that when outfits change, only the clothes change, not the face",
   "Scene and composition: fixing background, camera angle, and lighting together so every image's scene is identical",
   "Sampling parameters: writing Temperature and random seed into the reference image to eliminate randomness at the source"
  ],
  "ans": [0, 1, 2],
  "exp": "The reference sheet anchors the character's visual identity: facial structure and body type, expression style, and outfit style. With this sheet, the same character Alice has identical facial structure, hair color, and body proportions across four scenes — study room, kitchen, balcony, office — with only scene and action changing. So scenes are exactly what should vary freely. Character consistency is a product design problem; adjusting sampling parameters cannot solve it."
 },
 {
  "g": 345,
  "type": "multi",
  "q": "Regarding Skills as operable Prompt modules, which statements are correct? (Select all that apply)",
  "opts": [
   "A Skill file specifies trigger conditions, an allowed tool list, an execution flow, and output format requirements",
   "Skills load on demand — only injected when trigger conditions are matched, without polluting other tasks' behavior",
   "Skills are independent files that can be version-controlled separately — who changed what and when can be traced",
   "Skills are modified less frequently than the System Prompt — once written, they rarely change",
   "Skills have global scope — modifying one Skill affects responses across all scenarios"
  ],
  "ans": [0, 1, 2],
  "exp": "A Skill's structure includes trigger conditions, an allowed tool list, execution flow, and output format requirements — the allowed tools are controlled with a whitelist to manage risk. The lifecycle is: write, register, trigger, iterate — changing the file equals changing behavior, traceable with Git. Skills are high-frequency iterates with task-specific scope; global identity is managed by the System Prompt. So the last two options swap the properties of the two — they are incorrect."
 },
 {
  "g": 346,
  "type": "judge",
  "q": "As long as the total length of the System Prompt stays the same, putting dynamic content like the current timestamp inside it won't affect the KV Cache hit rate.",
  "ans": false,
  "exp": "The cache checks whether the prefix is character-for-character identical — not whether the length changes. A timestamp is different every second, so the fingerprint is different every second, the cache never hits, and everything is recomputed from scratch — doubling costs. Any dynamic content — Skill identifier, user ID, session tag — placed inside the System Prompt has the same effect. The correct approach is to put anything that changes after the System Prompt."
 },
 {
  "g": 347,
  "type": "judge",
  "q": "In brainstorm mode with three Agents thinking simultaneously, the total time equals the slowest Agent's time — it does not become three times a single Agent's time.",
  "ans": true,
  "exp": "Thinking tasks are naturally parallelizable — three Agents run simultaneously, and total time is the slowest one. Additional value from brainstorming includes avoiding groupthink, discovering blind spots no single Agent would cover, and treating divergence itself as a signal worth deeper discussion."
 },
 {
  "g": 348,
  "type": "judge",
  "q": "The trade-off of lazy connection is slower startup: because it needs to probe each MCP service's availability one by one at startup, startup time increases from 0.2 seconds to 30 seconds.",
  "ans": false,
  "exp": "This description is exactly backwards. Connecting all services at startup — where 3 of 10 time out — is what causes 30-second startup blocks. Lazy connection only registers capabilities at startup without establishing network connections, reducing startup from 30 seconds to 0.2 seconds. It also brings fault isolation as a bonus: if a service goes down, only that one tool is affected; the overall system is unaffected."
 },
 {
  "g": 349,
  "type": "judge",
  "q": "The hardest part of building AI products is getting the model API working. The trade-offs hidden beneath the interface are engineering implementation details that product managers don't need to be heavily involved in.",
  "ans": false,
  "exp": "The course's conclusion is exactly the opposite: the hard part is making 100 correct product decisions in places users can't see. Users only see the chat interface, AI image generation, and smart replies. Beneath the surface are eight layers: loop control, context compression, memory system, Prompt architecture, multi-Agent coordination, permissions and security, MCP integration, observability. Every one of these eight layers is a product decision — and the quality of those decisions determines whether the product can truly be used."
 },
 {
  "g": 350,
  "type": "judge",
  "q": "In a five-step task — read calendar, search documents, summarize notes, send email to team, update project status — only sending the email is a high-risk operation. After risk tiering, the user's confirmation clicks can be reduced from 5 to 1.",
  "ans": true,
  "exp": "Reading the calendar, searching documents, summarizing notes, and updating project status either don't change external state or have minimal impact — they can execute automatically. Sending an email to the team is irreversible and has wide impact — it must prompt for confirmation. Without tiering, every step prompts and the user clicks 5 times; with risk tiering, only 1 click is needed. Good permission design is precise control over when to prompt and for what."
 }
];

window.EXAM_TOPICS_PART = {
 "301": {"name": "Text-to-Image vs Img2img", "file": "9-1.html"},
 "302": {"name": "LLM Prompt Translation Layer", "file": "9-2.html"},
 "303": {"name": "Character Consistency & Reference Sheet", "file": "9-3.html"},
 "304": {"name": "Model Fallback Chain", "file": "9-4.html"},
 "305": {"name": "Agent Stuck Loop Modes", "file": "9-7.html"},
 "306": {"name": "Three-Layer Failsafe", "file": "9-8.html"},
 "307": {"name": "Streaming Progress UX", "file": "9-9.html"},
 "308": {"name": "Cost of One Message", "file": "9-10.html"},
 "309": {"name": "Longer = More Expensive & Dumber", "file": "9-11.html"},
 "310": {"name": "User Messages Are Sacred", "file": "9-13.html"},
 "311": {"name": "Local vs LLM Compression", "file": "9-14.html"},
 "312": {"name": "Context vs Long-Term Memory", "file": "9-15.html"},
 "313": {"name": "Four Memory Conflict Strategies", "file": "9-17.html"},
 "314": {"name": "Lazy-Load Tool Descriptions", "file": "9-20.html"},
 "315": {"name": "Image-Gen Productization Checklist", "file": "9-5.html"},
 "316": {"name": "Compression Trade-off Framework", "file": "9-12.html"},
 "317": {"name": "Memory Gatekeeper Filtering", "file": "9-16.html"},
 "318": {"name": "When Multi-Agent Makes Sense", "file": "9-23.html"},
 "319": {"name": "Risk-Tiered Confirmation Dialogs", "file": "9-28.html"},
 "320": {"name": "System Prompt Four-Layer Architecture", "file": "9-19.html"},
 "321": {"name": "Concurrent Read/Write Rules", "file": "9-24.html"},
 "322": {"name": "Agent Observability", "file": "9-29.html"},
 "323": {"name": "MCP Bidirectional Protocol", "file": "9-30.html"},
 "324": {"name": "AI Self-Configuration of Tools", "file": "9-32.html"},
 "325": {"name": "Production Single-Round Loop", "file": "9-6.html"},
 "326": {"name": "Cost of Full Memory Injection", "file": "9-18.html"},
 "327": {"name": "Skill Role & Responsibility", "file": "9-21.html"},
 "328": {"name": "Skill Injection & Cache", "file": "9-22.html"},
 "329": {"name": "Brainstorm Independent Thinking", "file": "9-25.html"},
 "330": {"name": "Scheduled Task — New Session Each Time", "file": "9-26.html"},
 "331": {"name": "Five Permission Modes", "file": "9-27.html"},
 "332": {"name": "MCP Lazy Connection Principle", "file": "9-31.html"},
 "333": {"name": "Iceberg Model — Eight Layers", "file": "9-final.html"},
 "334": {"name": "Three Hard-Limit Stops", "file": "9-8.html"},
 "335": {"name": "Stuck Loops Don't Throw Errors", "file": "9-7.html"},
 "336": {"name": "Task Complexity vs Cost", "file": "9-10.html"},
 "337": {"name": "Three Costs of Long Conversations", "file": "9-11.html"},
 "338": {"name": "Three Questions Before Splitting Agents", "file": "9-23.html"},
 "339": {"name": "Read/Write Concurrency Timing", "file": "9-24.html"},
 "340": {"name": "Four-Layer Responsibilities", "file": "9-19.html"},
 "341": {"name": "On-Demand Memory Retrieval", "file": "9-18.html"},
 "342": {"name": "Permission Mode Selection Dimensions", "file": "9-27.html"},
 "343": {"name": "Chapter 3 Eight Themes", "file": "9-summary.html"},
 "344": {"name": "Character Reference Sheet Anchors", "file": "9-3.html"},
 "345": {"name": "Skill Structure & Advantages", "file": "9-21.html"},
 "346": {"name": "Dynamic Content & Cache", "file": "9-22.html"},
 "347": {"name": "Brainstorm Parallel Timing", "file": "9-25.html"},
 "348": {"name": "Lazy Connection Startup Time", "file": "9-31.html"},
 "349": {"name": "The Real Hard Part of AI Products", "file": "9-final.html"},
 "350": {"name": "Risk Tiering Confirmation Count", "file": "9-28.html"}
};
