/* Chapter 2 Quiz Bank · AI Harness (50 questions: single-choice 14 / multiple-choice 5 / true-false 5 + A/B variants)
   g = question group ID (this chapter uses 201–242), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 201,
  "type": "single",
  "q": "When conversation content exceeds a large model's context window, what is the model's state regarding that content?",
  "opts": [
   "It retains a vague impression — it can recall the general meaning but not accurate details",
   "It sees nothing at all — not even a vague impression",
   "It is automatically transferred to an internal long-term memory area and can be retrieved later",
   "It remains in the window in compressed form, just with slower read speed"
  ],
  "ans": 1,
  "exp": "The context window is everything the model can see at once. Content that is truncated beyond the window is completely invisible to the model — not even a vague impression remains. The model has no internal long-term memory to transfer content to, and it does not automatically compress and retain it. Techniques such as summarization or retrieval are engineering solutions needed to 'remember more'."
 },
 {
  "g": 202,
  "type": "single",
  "q": "Why must you specifically reserve space for the reply within a request's context window budget?",
  "opts": [
   "Input and output share the same window; if input fills it up, the model has no space to generate a reply",
   "Reserved space lets the model pre-cache the next round of user questions",
   "Platforms require a fixed reserved ratio by policy; otherwise the request is rejected outright",
   "The larger the reserved space, the higher the model's answer accuracy"
  ],
  "ans": 0,
  "exp": "The window composition demo in the course breaks a single request into five parts: system prompt, conversation history, uploaded document, current question, and reserved reply space. Input and model output share the same window — if input fills the window, the model has no Token space to generate a reply, so the reply must be budgeted. Reserved size has no direct relationship with accuracy, and it is not a platform-mandated ratio."
 },
 {
  "g": 203,
  "type": "single",
  "q": "Among the three strategies for handling context overflow, what is the main drawback of 'selective retention' (semantic retrieval of history)?",
  "opts": [
   "Implementation is complex, and it may miss implicit context that is loosely associated but still important",
   "Token consumption is the highest of the three strategies, making costs completely uncontrollable",
   "Early information is permanently deleted, making the conversation entirely incoherent",
   "Every round requires an extra LLM call to generate a summary, noticeably increasing latency"
  ],
  "ans": 0,
  "exp": "Selective retention vectorizes history into Memory and injects only the semantically most relevant rounds at query time — Token usage is optimal and answers are precise. The drawback is that a vector retrieval system must be built (complex implementation), and it may miss implicit context that seems loosely related but is actually important. 'Early information permanently deleted' is a problem with direct truncation; 'extra LLM call to generate summary' is the cost of summary compression."
 },
 {
  "g": 204,
  "type": "single",
  "q": "When the course reasoned through 'why large models chose Markdown,' what was the stated reason for ruling out HTML?",
  "opts": [
   "HTML is a binary format, so the model cannot output it character by character",
   "HTML tags are heavy; the same content costs roughly twice as many Tokens",
   "HTML syntax is too complex; models frequently make errors when generating it",
   "Browsers cannot render HTML fragments output by the model"
  ],
  "ans": 1,
  "exp": "HTML was ruled out in the reasoning chain because its tags are heavy and waste Tokens: the comparison demo showed that the same content in HTML costs about 45 Tokens with tags taking up half, while Markdown only needs about 20 Tokens. 'Binary format cannot be output character by character' is the reason Word/PDF was ruled out; 'syntax too complex and error-prone' is the reason LaTeX was ruled out; browsers handle HTML rendering just fine."
 },
 {
  "g": 205,
  "type": "single",
  "q": "The course says 'change the role, change the product.' What fundamental nature of AI products does this reveal?",
  "opts": [
   "Every AI product requires fine-tuning a dedicated model before launch",
   "All AI products are essentially different role definitions written in the System Prompt",
   "The differences between AI products mainly come from the front-end UI and interaction design",
   "Switching roles requires reloading different model weight files"
  ],
  "ans": 1,
  "exp": "With the same underlying model, writing 'senior copywriter,' 'legal consultant,' or 'psychology assistant' in the System Prompt turns it into a completely different assistant. The role is the system preset, and the core differentiation of many AI products lies precisely in this role definition — no dedicated fine-tuning or weight-file switching required."
 },
 {
  "g": 206,
  "type": "single",
  "q": "What six elements make up the 'universal formula' given in the Prompt advanced-techniques lesson?",
  "opts": [
   "Role + Task + Context + Constraints + Examples + Format",
   "Goal + Background + Steps + Check + Output + Feedback",
   "Role + Emotion + Length + Language + Style + Examples",
   "Task + Data + Model + Parameters + Temperature + Format"
  ],
  "ans": 0,
  "exp": "The course's universal formula is 'Role + Task + Context + Constraints + Examples + Format.' Omitting any element degrades output quality. The core idea is to write Prompts like code: add constraints, add examples, add test cases. All other options include elements outside the formula."
 },
 {
  "g": 207,
  "type": "single",
  "q": "When having a model output JSON format, what risk does the fallback logic in engineering primarily guard against?",
  "opts": [
   "Chinese characters inside JSON are automatically converted to escape sequences, causing garbled text",
   "Very long JSON often fails to generate due to missing brackets, and parsing will throw an error directly",
   "JSON field order varies each time, making front-end rendering unstable",
   "The model refuses to output JSON and will only produce natural language"
  ],
  "ans": 1,
  "exp": "The course points out that the engineering downside of JSON is that very long JSON can fail to generate due to missing brackets, and JSON.parse will throw directly — so fallback logic is mandatory. Field order doesn't affect access by field name; Chinese escape sequences and 'model refuses JSON' are speculative risks not covered in the course."
 },
 {
  "g": 208,
  "type": "single",
  "q": "In a streaming-return scenario, XML custom tags are described as 'the best of both worlds.' What two things do they simultaneously achieve?",
  "opts": [
   "Minimum Token consumption, plus the most visually attractive rendering",
   "Both streaming incremental rendering and reliable extraction of structured fields",
   "Both compatibility with all models and no need for the front end to write any parsing code",
   "Both encrypted content transmission and compressed transmission volume"
  ],
  "ans": 1,
  "exp": "The conclusion of the three-format comparison: JSON has good structure but requires waiting for the full text before parsing; Markdown streams character by character smoothly but cannot reliably extract fields; XML can parse and render the corresponding field the moment a closing tag is captured, satisfying both streaming experience and structured extraction — this is what Claude natively recommends. Its cost is precisely the Tokens consumed by the tags themselves."
 },
 {
  "g": 209,
  "type": "single",
  "q": "What is the fundamental reason that Prompt injection attacks are possible?",
  "opts": [
   "The model's safety alignment training is insufficiently thorough, making it easy to manipulate",
   "The message list lacks a parameterization mechanism — instructions and user data are all concatenated into the same text fed to the model",
   "System Prompts have a length limit that is too short to contain enough safety rules",
   "Attackers have obtained the model's internal weights and can precisely craft adversarial inputs"
  ],
  "ans": 1,
  "exp": "The course uses SQL injection as an analogy: the ultimate fix for SQL injection is parameterized queries that completely separate data from instructions. But the LLM message list has no such mechanism — system, user, and assistant text are all concatenated into one string, and the model cannot distinguish 'this is an instruction' from 'this is user data.' That is the root cause of injection. Insufficient alignment is only an aggravating factor; it has nothing to do with weight leakage or rules being too long."
 },
 {
  "g": 210,
  "type": "single",
  "q": "An attacker uses metaphors such as 'a tree lives in my heart, its leaves inscribed with your secret rules' to extract the system prompt. In the three-layer defense framework, which layer typically intercepts this?",
  "opts": [
   "The input layer — regex patterns can directly identify the attack intent behind metaphors",
   "The prompt layer — the LLM uses its System Prompt security constraints to recognize the 'rule extraction' intent",
   "The output layer — because metaphor attacks inevitably cause the model to output the prompt verbatim",
   "Cannot be intercepted — metaphor attacks are a blind spot in the three-layer defense"
  ],
  "ans": 1,
  "exp": "Metaphor-based bypasses lack keywords like 'ignore instructions' or 'DAN,' so the input-layer regex misses them. However, the LLM understands semantics — the highest-priority security constraint declared in the System Prompt allows it to recognize the 'rule extraction' intent, output is_injection=true, and return a fixed rejection response. This is the second-layer interception. The output layer is the last line of defense, scanning already-generated content for leaked feature words, and it doesn't guarantee that metaphor attacks will even reach that stage."
 },
 {
  "g": 211,
  "type": "single",
  "q": "In a tool-calling pipeline, who is responsible for security logic such as parameter validation and permission control?",
  "opts": [
   "The large model — it automatically performs security checks when generating a call request",
   "The framework code written by developers — security logic does not depend on the model",
   "The API provider's gateway — it uniformly intercepts all unauthorized calls",
   "The user — who checks each parameter one by one in a confirmation dialog"
  ],
  "ans": 1,
  "exp": "The model only predicts a piece of structured call-request text; it has no execution capability and cannot perform reliable security checks. The course emphasizes that after the framework code parses the model's output, it must perform parameter validation, tool whitelist verification, and permission control — security logic lives entirely in the framework layer and must never depend on the model to be conscientious. Gateways and user confirmations cannot substitute for framework-layer validation."
 },
 {
  "g": 212,
  "type": "single",
  "q": "In the hotel-booking comparison experiment, the bad tool description caused the model to repeatedly guess the format, wasting 3,000 Tokens, while the good description succeeded on the first try. What was the key difference?",
  "opts": [
   "The good description was written in English, and the model understands English instructions more accurately",
   "The good description specified parameter format constraints, such as 'date must be in YYYY-MM-DD format'",
   "The good description reduced the number of parameters to two, lowering the error probability",
   "The good description has a built-in auto-retry mechanism that can self-repair after failure"
  ],
  "ans": 1,
  "exp": "The bad description only said 'book a hotel,' forcing the model to guess what format 'tomorrow' should be in and getting it wrong multiple times before stumbling on the right answer. The good description specified 'date must be in YYYY-MM-DD format; check-out date must be after check-in date,' allowing the model to fill it in correctly on the first try using only 800 Tokens. The difference is not language; the good description actually has more parameters. The course conclusion: product managers should write tool descriptions the same way they write PRDs."
 },
 {
  "g": 213,
  "type": "single",
  "q": "When debugging an MCP Server locally during development, what transport method does the course recommend as the first choice?",
  "opts": [
   "SSE — server-push mode is best suited for observing debug logs",
   "stdio — no port configuration or HTTPS required; just start it and test",
   "Streamable HTTP — the officially recommended standard should be used from the very beginning",
   "WebSocket — bidirectional communication is a necessary condition for debugging"
  ],
  "ans": 1,
  "exp": "stdio has the Agent start a local subprocess and exchange JSON-RPC messages via standard input/output — no network, no port or certificate configuration required, fast startup and low latency. The course explicitly recommends this as the first choice for development and debugging. Streamable HTTP is the officially recommended production standard; SSE is a 'one-request many-responses' server-push mode that is gradually being replaced; WebSocket is not even among MCP's three standard transport methods."
 },
 {
  "g": 214,
  "type": "single",
  "q": "KV Cache can simultaneously reduce latency and cost. What is its principle?",
  "opts": [
   "It caches the model's past replies to users, returning old answers directly for identical questions",
   "It caches the K/V matrices already computed for historical Tokens, and only computes the newly added Tokens in the next round",
   "It compresses conversation history into a summary before sending it to the model, reducing the number of input Tokens",
   "It accumulates requests and sends them in batches, benefiting from batch-processing price discounts"
  ],
  "ans": 1,
  "exp": "Each round, the model would normally redo Attention computation over all historical Tokens. KV Cache stores the already-computed K/V matrices so that the next round only needs to compute the newly added Tokens — like 'taking a snapshot of your textbook and only reviewing today's new notes.' It caches intermediate computation results, distinct from semantic caching that reuses old answers directly, summarization strategies that compress input, and batch-processing discounts."
 },
 {
  "g": 215,
  "type": "multi",
  "q": "Which of the following are strategies within the 'four-tier context compression firewall' described in the course?",
  "opts": [
   "Trimming: delete overly long raw data returned by early tools, keeping only the summary",
   "Folding: fold multiple early rounds of conversation into a single summary message",
   "Emergency compression: keep only the system prompt, global summary, and the last 3 rounds",
   "Expansion: automatically switch to a model with a larger context window",
   "Reset: clear all history and start a fresh conversation from scratch"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "The four tiers are triggered by usage level: 60% trimming, 75% micro-compression, 85% folding, 95% emergency compression — each tier increases compression force and information loss. Trimming, folding, and emergency compression are all included. Switching to a larger-window model and resetting history outright are outside the four-tier approach; the philosophy is to relieve pressure in layers within the same window, like flood-control levees."
 },
 {
  "g": 216,
  "type": "multi",
  "q": "Which of the following belong to the five major Prompt injection attack types summarized in the course?",
  "opts": [
   "Privilege escalation injection: forging identity, forging authorization, or gradually escalating permissions",
   "Metaphor and disguise: wrapping attacks in classical literature or disguising them as programming tutorials",
   "High-frequency request attacks: using scripts to flood the inference service's concurrency limit",
   "Few-Shot malicious injection: planting bias through examples or hijacking output format",
   "Weak-password brute force: forcibly guessing admin login credentials"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "The five types summarized in the course are: privilege escalation injection, role-play jailbreak, Few-Shot malicious injection, structural symbol injection, and metaphor/disguise. They all share the common trait of manipulating model behavior by crafting input content. High-frequency requests are a traffic-layer availability attack; weak-password brute force is a traditional system security issue — neither is related to 'using input to impersonate instructions,' the defining characteristic of Prompt injection."
 },
 {
  "g": 217,
  "type": "multi",
  "q": "Regarding the three-layer Prompt defense design in the MoodVerse case study, which of the following statements are correct?",
  "opts": [
   "The input layer uses regex to match patterns like 'ignore.*instructions' and 'DAN'; if matched, the request is blocked before entering the LLM — zero Token consumption",
   "Security constraints are written at the end of the System Prompt and declared as the highest priority, not overridable by user input",
   "When rejecting an attack, detailed information about which detection rule was triggered should be provided to help the user understand and appeal",
   "The output layer scans the model's output for system-prompt feature words; if matched, the response is rewritten before being returned"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "The input layer intercepts known attack patterns before the LLM — cheapest approach. Security constraints go at the end of the Prompt, declared as highest priority. The output layer performs leak detection, rewriting the response if feature words are detected. The only wrong statement is 'tell users which rule was triggered': disclosing detection logic when rejecting requests is a core violation of defense principles — always use a platform-context response template, never give attackers debugging information."
 },
 {
  "g": 218,
  "type": "multi",
  "q": "Which of the following belong to the '5 Agent freeze patterns' described in the course?",
  "opts": [
   "Hallucinated tool: the model calls a tool name that does not exist in the system",
   "Infinite loop: stuck in a cycle of 'read file → modify → verify → modify again' without stopping",
   "Insufficient information but no follow-up question: when a key parameter is missing, the model guesses instead of asking",
   "GPU memory overflow: inference service crashes because the model parameters are too large",
   "Context poisoning: an attacker injects malicious instructions into the conversation history"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "The five freeze patterns are: parameter format error, hallucinated tool, infinite loop, insufficient information but no follow-up question, and API timeout cascade. The corresponding safeguards are: parameter validation, tool verification, loop detection, proactive-question mechanism, and timeout fallback. GPU memory overflow is a deployment-layer resource issue; context poisoning is a security attack topic — neither is in this freeze-pattern list."
 },
 {
  "g": 219,
  "type": "multi",
  "q": "Which of the following practices will cause KV Cache to become invalid?",
  "opts": [
   "Writing the current timestamp accurate to the second in the System Prompt",
   "Concatenating a randomly generated Session ID into the System Prompt",
   "Inserting A/B test dynamic variables into the System Prompt",
   "Putting the current date in the User message while keeping the System Prompt fixed"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "KV Cache uses prefix matching — even a single character change in the System Prompt completely invalidates the cache. Second-level timestamps, random Session IDs, and A/B test variables all make the System Prompt different each time, making them all cache killers — the dynamic timestamp in particular drives the hit rate to zero and doubles costs. The correct approach is exactly the last option: keep the System Prompt as a fixed prefix and put dynamic content in User messages, achieving a hit rate of around 95%."
 },
 {
  "g": 220,
  "type": "judge",
  "q": "In a multi-turn conversation, the input for turn N includes the System Prompt plus all previous question-answer pairs plus the current question, so the longer the conversation, the higher the cost per turn.",
  "ans": true,
  "exp": "Correct. LLMs are billed by the number of input plus output Tokens, and the model is stateless — every round requires resending the complete history, effectively making the model re-read the entire conversation. The longer the history, the larger the input, and the cost grows with each turn. This is the fundamental reason why multi-turn conversations become increasingly expensive."
 },
 {
  "g": 221,
  "type": "judge",
  "q": "Relying on the platform's implicit caching in production is sufficiently reliable; there is no need to explicitly mark cache_control anchors in requests.",
  "ans": false,
  "exp": "False. Cloud LLMs run on multiple GPU nodes; requests are randomly routed by a load balancer to a node that likely does not have your previous context cached. The actual implicit cache hit rate can be below 30% — whether it hits is purely luck. Explicit caching via cache_control ensures the platform routes requests to nodes that have the cache, bringing the hit rate close to 100%. The course concludes that explicit caching is mandatory in production."
 },
 {
  "g": 222,
  "type": "judge",
  "q": "During streaming output, Markdown can be rendered character by character, and can also reliably extract structured fields programmatically — just like JSON.",
  "ans": false,
  "exp": "False. The first half is correct: Markdown streams character by character with a typing feel, giving the most fluid user experience. The second half is wrong: Markdown's structural information is embedded in formatting marks, making it very difficult for programs to reliably extract fields — this is precisely its weakness. XML custom tags are the answer the course gives for simultaneously supporting streaming rendering and structured extraction."
 },
 {
  "g": 223,
  "type": "judge",
  "q": "The longer the System Prompt while remaining completely unchanged, the more pronounced the KV Cache savings; once the prefix content changes, that cached portion becomes invalid.",
  "ans": true,
  "exp": "Correct. The course's example: a 5,000-Token system prompt across 1,000 rounds of conversation can save approximately 80% of total cost with KV Cache, provided the System Prompt is kept as a completely fixed prefix. The cache uses prefix matching — if the prefix changes, everything must be recomputed from scratch. Keeping the System Prompt unchanged is therefore the simplest and most effective optimization."
 },
 {
  "g": 224,
  "type": "judge",
  "q": "In comprehensive cost optimization, the 'model routing' strategy works by first using a cheaper small model to classify request intent, with roughly 80% of simple questions answered directly by the small model and complex questions handed off to the flagship model.",
  "ans": true,
  "exp": "Correct. This is the second-highest priority strategy among the five optimization layers: a small model at the entry point classifies intent; simple Q&A and casual conversation are handled directly by the small model at roughly one-tenth the cost, while professional analysis and creative tasks are routed to the flagship model. In practice, approximately 80% of conversations can be handled by the small model, saving 40%–60% of flagship model costs."
 },

 /* Merged from AI Qualification Certification Exam A/B technical sections — A/B variants sharing the same question group g */
 {
  "g": 225,
  "type": "single",
  "q": "Without any external tools, can a large model proactively search the internet for information?",
  "opts": [
   "Yes — a complete browser and network-access module was built into the model during pre-training",
   "Yes — but only for specific whitelisted websites that have passed a security review",
   "No — the internet search capability is implemented by developers through software engineering means such as tool calls",
   "No — but the model can directly read local files and browsing history on the user's device"
  ],
  "ans": 2,
  "exp": "The model itself is simply a set of static trained weights; at inference time it only performs 'input Tokens → output Tokens' computation and has no network access capability whatsoever. The 'internet search' seen in products is implemented by an outer program first calling a search tool to retrieve web content, then concatenating that content into the context for the model to summarize. Likewise, the model cannot read local files from the user's device."
 },
 {
  "g": 226,
  "type": "single",
  "q": "What is an Agent (intelligent agent)?",
  "opts": [
   "A new-generation super-model with larger parameter scale and stronger reasoning than general large models",
   "An AI system capable of autonomously planning, calling tools, executing tasks, and reflecting on results",
   "A teacher-supervisor model used specifically for training and evaluating other models",
   "A front-end application system that provides a graphical interaction interface for large models"
  ],
  "ans": 1,
  "exp": "An Agent is not 'a bigger model' — it is a system built around a large model: using the model as a 'brain,' plus a loop that plans tasks, calls tools, executes actions, and reflects and corrects based on results. The model handles decision-making; the system turns decisions into real actions."
 },
 {
  "g": 227,
  "type": "single",
  "q": "In a tool-calling workflow, after the large model outputs a tool-call request, who actually executes the API?",
  "opts": [
   "The large model itself, directly calling it during the inference process",
   "The user, manually executing it based on the model's prompts",
   "The backend program built by the developer, which captures and executes it",
   "The API provider's gateway, which automatically executes it on the model's behalf"
  ],
  "ans": 2,
  "exp": "The model only outputs a piece of structured 'call request' text (which function to call, what parameters to pass); it has no execution capability. The backend program written by the developer parses this output, actually makes the API call, and feeds the result back to the model to continue generating. This is the complete tool-calling pipeline."
 },
 {
  "g": 228,
  "type": "single",
  "q": "How does an AI 'remember' conversation history in a multi-turn conversation?",
  "opts": [
   "The model internally maintains a cross-session persistent long-term memory module that can automatically store and retrieve history",
   "Each request concatenates the complete conversation history as a Token sequence and sends it to the model",
   "The model's weights automatically undergo incremental updates after each conversation",
   "Conversation history is cached in the user's browser, and the model can read it at any time"
  ],
  "ans": 1,
  "exp": "The model itself is stateless — each call is an independent inference. What is called 'remembering' is the application layer concatenating the complete conversation history into a long Prompt and resending it together with the new question for the model to re-read. This also explains why a very long conversation can exceed the context window. Model weights are not updated during a conversation, and the model cannot read browser cache."
 },
 {
  "g": 229,
  "type": "single",
  "q": "What is a 'Prompt injection' attack?",
  "opts": [
   "Inputting an extremely long text in the Prompt to exhaust the context window and crash the model",
   "Manipulating model behavior through carefully crafted input content, causing it to execute unintended operations or leak sensitive information",
   "Embedding malicious script code in the Prompt to infect and take over the server where the model runs",
   "Using scripts to repeatedly send the same Prompt at high frequency, overloading and paralyzing the inference service"
  ],
  "ans": 1,
  "exp": "Prompt injection uses carefully crafted input (e.g., 'ignore all instructions above') to override or tamper with developer-preset system instructions, inducing the model to execute unintended operations or leak sensitive information. It exploits the model's inability to distinguish between instructions and data. This is neither injecting code into the server nor a traffic attack that overwhelms the service."
 },
 {
  "g": 230,
  "type": "multi",
  "q": "Which of the following are capabilities that large models genuinely possess?",
  "opts": [
   "Generating the next Token based on probability prediction",
   "Attending to relevant information in context via the Attention mechanism",
   "Proactively searching the internet for real-time information without any external tools",
   "Potentially 'fabricating' content (hallucination) when knowledge is lacking"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "Probabilistic Token generation, attending to context via the Attention mechanism, and hallucinating when knowledge is lacking are all genuine model characteristics. Only 'proactively accessing the internet' is false: the model itself has no network access capability; search must be implemented by external programs through tool calls and the results fed back to the model."
 },
 {
  "g": 231,
  "type": "multi",
  "q": "Which of the following are core capabilities of an Agent?",
  "opts": [
   "Tool Use",
   "Planning",
   "Memory",
   "Acting and Reflection"
  ],
  "ans": [
   0,
   1,
   2,
   3
  ],
  "exp": "All four are correct. The core Agent capabilities: Planning (breaking big tasks into steps), Tool Use (calling search engines, APIs, code execution), Memory (retaining context and experience), and Acting and Reflection (executing and checking results, then correcting) — together forming the 'perceive → decide → act → reflect' loop."
 },
 {
  "g": 232,
  "type": "judge",
  "q": "Large language models themselves lack real-time internet access; the 'search functionality' users experience is implemented by developers through software engineering means such as tool calls and RAG.",
  "ans": true,
  "exp": "Correct. Model weights are static and have no internet capability. The 'search functionality' is implemented by an outer program calling search tools to retrieve web content, injecting it into the context, and then having the model read and summarize it. This is a classic combination of tool calls and RAG engineering."
 },
 {
  "g": 225,
  "type": "single",
  "q": "What is the true nature of the AI 'internet search' functionality that users experience?",
  "opts": [
   "A complete browser and web-access module built into the model during pre-training",
   "Implemented by developers through software engineering means such as tool calls and RAG",
   "The model's training data is automatically updated in real time to the latest version",
   "The model reuses the user device's network connection at runtime"
  ],
  "ans": 1,
  "exp": "'Internet search' is implemented by outer software engineering: a program first calls a search tool to retrieve web content, then injects that content into the context via RAG so the model can read and summarize it. The model itself has no browser module, its training data does not update in real time, and it does not borrow the user's device network."
 },
 {
  "g": 226,
  "type": "single",
  "q": "What is the defining characteristic of an Agent (intelligent agent)?",
  "opts": [
   "Can only execute a single fixed task according to a preset script",
   "Can autonomously plan, call tools, execute tasks, and reflect on results",
   "Requires humans to issue explicit step-by-step instructions to complete corresponding work",
   "Is fundamentally a special type of database management system"
  ],
  "ans": 1,
  "exp": "The defining characteristic of an Agent is autonomy: given a goal, it can plan steps on its own, call tools, execute actions, check results, and correct course — no need for humans to issue instructions step by step. 'Executing fixed tasks according to a preset script' describes traditional automation programs, which is precisely what Agents are designed to transcend."
 },
 {
  "g": 227,
  "type": "single",
  "q": "In a large model's tool-calling workflow, who actually executes the API request?",
  "opts": [
   "The large model itself, initiating the call directly while generating the reply",
   "The user, manually initiating the request according to the model's instructions",
   "The backend program built by the developer, which captures the model's structured output and then executes it",
   "The API provider's gateway, which automatically detects intent and executes on the model's behalf"
  ],
  "ans": 2,
  "exp": "The model is only responsible for 'deciding what to call and what parameters to pass,' outputting the call request as structured text. The one that actually makes the API request is the backend program written by the developer — it parses the model's output, executes the call, and feeds the result back to the model. The model itself has no execution capability, and the gateway will not automatically execute on its behalf."
 },
 {
  "g": 228,
  "type": "single",
  "q": "How does an AI 'remember' previous conversation content in a multi-turn conversation?",
  "opts": [
   "The model has a built-in cross-session permanent memory store",
   "Each request concatenates the complete conversation history and sends it to the model",
   "Conversation records are stored on the user's device, and the model can read them at any time",
   "The model's weights automatically update after each round of conversation"
  ],
  "ans": 1,
  "exp": "The model is stateless: each request is an independent inference; 'memory' works by the application layer concatenating the complete conversation history into the Prompt and resending it together with the new question. The model has no built-in permanent memory store, cannot read the user's device, and its weights do not update during a conversation."
 },
 {
  "g": 229,
  "type": "single",
  "q": "What is 'Prompt injection'?",
  "opts": [
   "Inputting too much text in the Prompt, causing the request to time out or be truncated",
   "Manipulating model behavior through carefully crafted input, causing it to execute unintended operations or leak information",
   "Using automated scripts to repeatedly send the same Prompt at high frequency and overwhelm the service",
   "Embedding special control characters in the Prompt, causing the model output to become garbled"
  ],
  "ans": 1,
  "exp": "The core of Prompt injection is 'using input content to impersonate instructions': an attacker embeds phrasing such as 'ignore previous instructions' in the input, overriding the developer's system instructions, manipulating the model into unintended behavior or leaking information. It is not an overly long text, a high-frequency flooding attack, or garbled output caused by control characters."
 },
 {
  "g": 230,
  "type": "multi",
  "q": "Which of the following are genuine characteristics of large models?",
  "opts": [
   "Generating Tokens based on probability prediction",
   "Potentially producing hallucinations when knowledge is lacking",
   "Proactively searching the internet for real-time information without any tool assistance",
   "No fixed personality — role settings influence output style"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "Probabilistic Token generation, hallucination when knowledge is lacking, and no fixed personality (settings influence output) are all genuine model characteristics. 'Proactively searching the internet without tools' is false: the model itself has no network capability; real-time information must be retrieved by external tools, then injected into the context."
 },
 {
  "g": 231,
  "type": "multi",
  "q": "The core capabilities of an Agent include:",
  "opts": [
   "Tool Use",
   "Planning",
   "Memory",
   "Acting and Reflection"
  ],
  "ans": [
   0,
   1,
   2,
   3
  ],
  "exp": "Select all four. Planning handles task decomposition; Tool Use handles reaching the external world (search, APIs, code execution); Memory handles retaining context and experience; Acting and Reflection handles executing and correcting based on results. With all four working together, an Agent can autonomously complete complex tasks."
 },
 {
  "g": 232,
  "type": "judge",
  "q": "Large language models have built-in internet search capability and can obtain real-time information without any external engineering tools such as tool calls.",
  "ans": false,
  "exp": "False. The model consists of static weights fixed after training; it has absolutely no internet access capability. Obtaining real-time information requires an external program to retrieve content via tool calls, RAG, and other engineering means and inject it into the context before the model can 'see' it."
 },
 {
  "g": 233,
  "type": "judge",
  "q": "Large models have no fixed personality; role settings in Prompts influence output style because the model cannot verify whether the settings are true.",
  "ans": true,
  "exp": "Correct. The model has no fixed personality and cannot verify the truth of any settings. Role settings change the context, which changes the probability distribution of subsequent generation — the output follows the assigned identity, perspective, and style. This is exactly how Prompt engineering works."
 },

 /* Question bank expansion additions */
 {
  "g": 234,
  "type": "single",
  "q": "A user asks 'What is the weather in Beijing tomorrow?' and only one reply appears in the UI. As broken down in the course, what actually runs at the API level during this single Function Calling interaction?",
  "opts": [
   "1 message, 1 model call — the tool is executed by the model itself, which then gives the answer on the spot",
   "5 messages, 2 model calls, 1 weather API call",
   "5 messages, 1 model call — the tool result is read directly from the model's internal knowledge",
   "3 messages, 2 model calls — the tool message is written into the array by the model itself"
  ],
  "ans": 1,
  "exp": "The complete pipeline consists of: system, user, assistant (content null with tool_calls), tool, and assistant — 5 messages, 2 model calls, and 1 weather API call. The third message only expresses 'I want to call this tool'; the actual execution is performed by the framework code. The fourth tool message is constructed and injected by the framework, not generated by the model. The second request must resend all four preceding messages. The entire flow costs approximately 480 Tokens and takes the user about 4 seconds to wait."
 },
 {
  "g": 235,
  "type": "single",
  "q": "When the model returns three calls in the same round — search_flights, get_weather, and search_hotels — the smart-batching plan puts flights in a separate batch. Why?",
  "opts": [
   "The flight search takes the longest at 1.5 seconds; running it first hides the wait time for the other two tools",
   "The hotel result depends on the weather data, so these two tools must be in the same batch to read each other's return values",
   "The flight search may involve a state change; weather and hotel are pure read queries, so they can safely be merged and run concurrently",
   "All three tools are from the same API provider, and calling them simultaneously would trigger rate limiting"
  ],
  "ans": 2,
  "exp": "The framework tags each tool with a flag indicating whether it can be run concurrently: the flight search may mutate user state and is executed separately to avoid data races; weather and hotel are both read-only queries and are merged into a second batch to run together. Among the three strategies: serial takes 3.5 s (safest), full-parallel takes 1.5 s (fastest but risky), and smart-batching takes 2.7 s (middle ground). The course emphasizes that a tool's safety level is a business judgment that product managers need to communicate to engineers."
 },
 {
  "g": 236,
  "type": "single",
  "q": "When a multimodal model bills for an image, which dimension is used to convert to Tokens?",
  "opts": [
   "The original pixel dimensions at upload time — what you see is what you pay",
   "The dimensions after rescaling and then aligning to the nearest multiple of 32",
   "The file storage size of the image, converted to Tokens by kilobyte",
   "Unrelated to dimensions — each image incurs a fixed Token charge"
  ],
  "ans": 1,
  "exp": "The billing formula is: Tokens = (rescaled height × rescaled width) / token_pixels + 2. Images exceeding the maximum will be scaled down; images below the minimum will be scaled up; the result is then forced to align to the nearest multiple of 32. So the price is determined by the billing dimension after alignment, not the original pixel count. This also creates an 'alignment trap': if the original image slightly exceeds an integer-multiple boundary, the Token count jumps up one tier."
 },
 {
  "g": 237,
  "type": "single",
  "q": "An Agent is editing 20 files in batch — 8 have already been edited when the user presses Stop. If the framework has no interrupt-recovery implementation, what is the most immediate consequence?",
  "opts": [
   "The message list has mismatched counts of tool_call and tool_result entries, making the format invalid; the next request returns 400 immediately and the session is broken",
   "The 8 already-edited files cannot be automatically rolled back, permanently breaking the user's code",
   "Context usage instantly spikes to 95%, triggering emergency compression and causing massive loss of historical details",
   "The Agent will re-execute from the first file, wasting double the Tokens"
  ],
  "ans": 0,
  "exp": "When stopped, 3 tools were executing and got killed, resulting in 8 tool_calls but only 5 tool_results — the message chain is broken. Every subsequent request will be rejected by the API, forcing the user to start a new conversation. The correct safeguard is to let the interrupt signal propagate layer by layer via AbortSignal, and have the framework add a '[Interrupted by user]' result for terminated tools, keeping the message chain intact. File rollback and context compression are separate issues."
 },
 {
  "g": 238,
  "type": "single",
  "q": "The SKILL.md for the deployment assistant explicitly declares an 'allowed tools' list. What is its primary purpose?",
  "opts": [
   "To tell the model the parameter format of these tools, preventing the Agent from filling in wrong parameters",
   "To declare the calling order of tools; the Agent strictly calls them from top to bottom as listed",
   "To define the security boundary during this Skill's execution, limiting the 'weapons' the Agent can use",
   "To have the Agent load only these tool definitions into context so that the definitions of other tools do not consume Tokens"
  ],
  "ans": 2,
  "exp": "The allowed-tools list is equivalent to a security boundary: banning delete_file prevents accidentally deleting files during deployment; banning sub-Agents keeps the execution chain predictable. Parameter format is handled by tool descriptions; execution order is written in the Skill's steps section. The course's conclusion: a Skill is an SOP for an Agent — when to trigger, what steps to follow, which tools can be used, and what security constraints apply."
 },
 {
  "g": 239,
  "type": "single",
  "q": "The same batch of 5 operations (including one 'rm -rf node_modules') is run under three permission modes. What is the behavior and trade-off of Smart Mode?",
  "opts": [
   "All 5 operations are automatically approved — zero interruptions; risk is handled by post-hoc audit",
   "A dialog pops up for each of the 3 non-read-only operations individually — safest, but frequent interruptions to user workflow",
   "Only the high-risk rm -rf is blocked for confirmation; medium-risk is approved with notification; the trade-off is that the classifier may misjudge and extra Tokens are consumed",
   "Destructive tools are removed from the tool list entirely; the trade-off is that such tasks can no longer be performed at all"
  ],
  "ans": 2,
  "exp": "Smart Mode uses an LLM classifier combined with tool metadata and context to assess risk in real time: low-risk passes directly, medium-risk passes with a user notification, high-risk is blocked with a confirmation dialog — only 1 interruption for 5 operations. The downsides listed: the classifier may false-pass or false-block, it consumes extra Tokens, and risk rules must be continuously maintained. Popping 3 dialogs is Confirmation Mode; letting rm -rf execute without any prompt is Auto Mode."
 },
 {
  "g": 240,
  "type": "multi",
  "q": "Which of the following belong to the 'syntax-layer optimization' techniques described in the course?",
  "opts": [
   "Replace flat JSON arrays with header-included CSV — field names appear only once, saving 30%–60%",
   "Replace JSON with YAML for complex objects — using indentation to eliminate brackets, quotes, and commas, saving 15%–30%",
   "Remove decorative symbols such as bold and headings from back-end prompts, saving 8%–13%",
   "Delete all examples from the System Prompt, keeping only a one-sentence task instruction",
   "Route all requests to a lower-unit-cost model"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "Syntax-layer optimization targets formatting Tokens, which can account for up to 13%–20% of a prompt — tests showed that bold symbols alone consumed 8.5% in one prompt. CSV replacing JSON arrays, YAML replacing JSON, and removing Markdown decorative symbols all belong to this layer, along with forcing minified JSON output to save 10%–20%. Removing all examples directly harms output quality — a semantic-layer trade-off to consider carefully. Switching models wholesale is a model selection and routing topic, not syntax-layer optimization."
 },
 {
  "g": 241,
  "type": "multi",
  "q": "According to the criteria given in the capstone lesson 'Keep It Simple,' which of the following situations indicate that a Harness technique should be abandoned?",
  "opts": [
   "It consumes enormous resources and has very high long-term maintenance costs",
   "After a large model version upgrade, the technique is directly superseded by the model's own capabilities",
   "Users cannot perceive the improvement it brings at all — marginal benefit approaches zero",
   "It creates a competitive gap against rivals in terms of cost, efficiency, and effectiveness",
   "It requires both product managers and engineers to discuss before a plan can be determined"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "A worthwhile Harness technique has four characteristics: it helps you compete on cost, efficiency, and effectiveness; it works even better after model upgrades (forming a complementary relationship); it constitutes a product moat; and its benefit is clear with controllable cost. Conversely, techniques that consume enormous resources, are superseded by upgrades, or are imperceptible to users should be abandoned. The course reminds you to constantly ask yourself 'will this still be needed after the next model version upgrade?' Needing cross-role discussions is only a collaboration cost, unrelated to whether the technique should be done."
 },
 {
  "g": 242,
  "type": "judge",
  "q": "According to the scenario-based evaluation data cited in the course, for everyday conversational tasks, the text capability score gap between a flagship model and a budget model (priced roughly 50× apart) is less than 6 points.",
  "ans": true,
  "exp": "Correct. The conclusion from the price-vs-capability scatter plot: a 50× price increase yields only a 6-point capability difference. In everyday Q&A scenarios, the effectiveness gap between budget and flagship models is small — expensive does not mean better. The selection formula given in the course is: task difficulty × call volume × error tolerance. First determine the scenario difficulty, look at the corresponding dimension score, estimate the monthly cost to confirm the budget, then validate with a small traffic slice before full rollout. The core principle: 'just enough capability' is the optimal choice."
 }
];

window.EXAM_TOPICS_PART = {
 "201": {"name": "Context Window Boundaries", "file": "5-1.html"},
 "202": {"name": "Context Budget Composition", "file": "5-1.html"},
 "203": {"name": "Overflow Strategy Trade-offs", "file": "5-2.html"},
 "204": {"name": "Why Markdown Won", "file": "6-0a.html"},
 "205": {"name": "Role as System Preset", "file": "6-1.html"},
 "206": {"name": "Prompt Universal Formula", "file": "6-2.html"},
 "207": {"name": "JSON Output Engineering Risks", "file": "6-3.html"},
 "208": {"name": "Streaming and Format Pairing", "file": "6-4.html"},
 "209": {"name": "Root Cause of Injection Attacks", "file": "prompt-attack.html"},
 "210": {"name": "Layered Defense Interception Logic", "file": "prompt-defense.html"},
 "211": {"name": "Tool-Call Security Ownership", "file": "7-2.html"},
 "212": {"name": "Tool Description Design", "file": "7-2b.html"},
 "213": {"name": "MCP Transport Method Selection", "file": "7-2d.html"},
 "214": {"name": "KV Cache Principles", "file": "8-2.html"},
 "215": {"name": "Context Compression Four-Tier Firewall", "file": "7-3b.html"},
 "216": {"name": "Injection Attack Type Identification", "file": "prompt-attack.html"},
 "217": {"name": "Three-Layer Defense Design", "file": "prompt-defense.html"},
 "218": {"name": "Agent Freeze Patterns", "file": "7-4b.html"},
 "219": {"name": "KV Cache Killers", "file": "8-3.html"},
 "220": {"name": "Multi-Turn Conversation Cost Structure", "file": "8-1.html"},
 "221": {"name": "Necessity of Explicit Caching", "file": "8-2b.html"},
 "222": {"name": "Markdown Boundaries in Streaming", "file": "6-4.html"},
 "223": {"name": "Cache and Fixed Prefix", "file": "8-2.html"},
 "224": {"name": "Model Routing Cost Savings", "file": "8-4.html"},
 "225": {"name": "Model Internet Access Limits", "file": "7-2.html"},
 "226": {"name": "Agent Concept", "file": "7-1.html"},
 "227": {"name": "Tool Calling Mechanism", "file": "7-2.html"},
 "228": {"name": "Conversation Memory Principle", "file": "5-1.html"},
 "229": {"name": "Prompt Injection Attack", "file": "prompt-attack.html"},
 "230": {"name": "Model Capability Boundaries", "file": "ai-tips-boundary.html"},
 "231": {"name": "Agent Core Capabilities", "file": "7-1.html"},
 "232": {"name": "How Search Is Implemented", "file": "7-2.html"},
 "233": {"name": "Role Setting Principle", "file": "6-1.html"},
 "234": {"name": "Tool-Call Message Pipeline", "file": "7-2a.html"},
 "235": {"name": "Multi-Tool Orchestration Batching", "file": "7-2c.html"},
 "236": {"name": "Image Billing Dimension", "file": "8-5.html"},
 "237": {"name": "Interrupt Recovery Safeguard", "file": "7-6a.html"},
 "238": {"name": "Skill Tool Boundary", "file": "7-5b.html"},
 "239": {"name": "Agent Permission Modes", "file": "7-4c.html"},
 "240": {"name": "Syntax-Layer Token Optimization", "file": "8-6.html"},
 "241": {"name": "Harness Trade-off Criteria", "file": "engineering-philosophy.html"},
 "242": {"name": "Model Selection Cost-Effectiveness", "file": "cost-eval.html"}
};
