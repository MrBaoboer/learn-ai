/* Chapter 7 Exam Bank · Vibe Coding Methodology (50 questions: single 30 / multi 10 / judge 10)
   g = topic group number (this chapter uses 701-750), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 701,
  "type": "single",
  "q": "The course identifies four recurring accident types in AI collaboration: misunderstood requirements rework, tech-stack drift, well-intentioned damage, and permanent technical debt. What is their shared root cause?",
  "opts": [
   "Insufficient AI model capability — switching to a larger model would prevent these accidents",
   "The user's requirements are inherently vague, and the AI merely faithfully executes ambiguous instructions",
   "Constraints never make it into the context — AI may forget everything you've told it each new conversation",
   "AI lacks internet access and cannot look up the project's latest coding standards in real time"
  ],
  "ans": 2,
  "exp": "The four accident types look varied, but they all share one root cause: constraints never made it into the context. The tech stack drifts because it was never hard-coded; 'well-intentioned damage' happens because no rule against deleting code was established. Switching to a larger model or clarifying requirements only mitigates the problem — as long as constraints don't enter the context of each conversation round, accidents will repeat."
 },
 {
  "g": 702,
  "type": "single",
  "q": "For the same constraint 'use PostgreSQL for the database,' why is writing it in a Cursor Rule more reliable than stating it ad hoc in a conversation?",
  "opts": [
   "Text in a Rule file has higher weight, and the model prioritizes higher-weight instructions",
   "Conversation content is only saved locally, while Rules automatically sync to the cloud and won't be lost",
   "Rules are compiled into the model weights, becoming part of the model's long-term memory",
   "Rules are auto-loaded into context at the start of every conversation — they survive long chats and new sessions"
  ],
  "ans": 3,
  "exp": "Constraints stated in a conversation travel with that conversation: by round 30 they may be squeezed out by context truncation, and a new conversation resets them to zero. The advantage of Rules lies in the injection mechanism: auto-loaded before every conversation round, immune to truncation, and no need to restate them in new sessions. Rules do not modify model weights, nor do they relate to cloud sync."
 },
 {
  "g": 703,
  "type": "single",
  "q": "Why should rules specify concrete actions like 'write a PRD, wait for permission' instead of just 'confirm understanding before coding'?",
  "opts": [
   "Because a PRD is an industry-standard document, and writing one demonstrates process professionalism",
   "Under vague instructions, AI decides 'I already understand' and starts coding immediately — specific actions make it actually pause",
   "Because abstract phrases like 'confirm understanding' are beyond the AI's language comprehension",
   "Because only a written PRD can serve as accountability evidence if something goes wrong"
  ],
  "ans": 1,
  "exp": "'Confirm understanding first' puts the judgment call in the AI's hands — it assumes it understands and starts writing. Specifying checkable concrete actions like 'write a PRD, wait for permission' creates a real pause point. This is the underlying logic of the entire ruleset: turning vague expectations into executable, concrete actions."
 },
 {
  "g": 704,
  "type": "single",
  "q": "What exactly does the rule say about the breakpoint for batch modifications?",
  "opts": [
   "When modifying more than 3 files, AI must list a modification plan and wait for user confirmation before proceeding",
   "Before modifying any file, AI must list a modification plan — no exceptions, even for a single-line change",
   "Only when modifying more than 10 files does AI need to pause; under 10 is left to AI's judgment",
   "Only modifications involving databases and config files require a plan before confirmation"
  ],
  "ans": 0,
  "exp": "The rule's threshold is 3 files: reaching it triggers a modification plan first, and execution only begins after human confirmation. Simple small changes are allowed through directly — the rule's purpose is risk control, not ceremony for trivial edits. 3 is the author's empirical value from their own project; cautious projects can lower it to 1, and rapid-prototype projects can relax it to 5."
 },
 {
  "g": 705,
  "type": "single",
  "q": "What is the relationship between PlayGround and Storybook in this course?",
  "opts": [
   "Both share the same philosophy, but Storybook's setup is too heavy — PlayGround achieves isolated component debugging with a single static page at near-zero cost",
   "PlayGround is an official lightweight version of Storybook, maintained by the same team",
   "PlayGround handles back-end API debugging while Storybook handles front-end component debugging — each covers one layer",
   "PlayGround's feature set has superseded Storybook, and production projects should replace Storybook with it entirely"
  ],
  "ans": 0,
  "exp": "PlayGround is a simplified take on the Storybook philosophy: arrange all component demos on a single static page to tune them in a 'fitting room' before integrating into the real page. Storybook is the industry-standard solution, but its setup is too heavy — overkill for AI-assisted rapid-prototype projects. The two have no official relationship, nor is there any front-end/back-end division between them."
 },
 {
  "g": 706,
  "type": "single",
  "q": "The three-element comment structure (background, design intent, key constraints) is meant to solve what core problem?",
  "opts": [
   "Restating what a function does so that non-programmers can understand every line of code",
   "Preserving decision information that code cannot express — so future maintainers understand why it was implemented this way",
   "Meeting hard coverage-rate metrics imposed by static analysis tools",
   "Adding formality to code so it looks more impressive when shown to management"
  ],
  "ans": 1,
  "exp": "Code only expresses 'what was done.' Why it exists, why it was implemented this way, and what callers need to be aware of — this information can only be preserved across time through comments. AI defaults to writing functional-restatement comments, which provide the same information as a quick glance at the code and offer no real value. The three-element structure gives a fixed template so AI can write genuinely useful decision information."
 },
 {
  "g": 707,
  "type": "single",
  "q": "When a bug's root cause cannot be confirmed, what does the debugging golden rule require as the first step?",
  "opts": [
   "Make a quick fix based on the most likely cause first, then switch to the next hypothesis if it doesn't work",
   "Roll back to the last working version first, then slowly investigate the problem",
   "Rewrite the entire related section of code to bypass possibly buggy old implementation",
   "Add logs first to validate the hypothesis: detailed backend logs in the terminal, frontend logs in the browser Console"
  ],
  "ans": 3,
  "exp": "The core rule is: no speculative fixes. When the root cause cannot be confirmed, hypotheses must first be validated through logs, breakpoints, or test scripts — 'try changing it and see' is prohibited. The course compared two paths: speculative fixes changed 47 lines over three rounds and the bug was still there while the original scene was destroyed; logging first located the root cause in one round, cleaned up in 4 lines."
 },
 {
  "g": 708,
  "type": "single",
  "q": "When developing a feature that calls an AI model but the user hasn't provided an API Key yet, what is the rule-compliant approach?",
  "opts": [
   "Hard-code a mock response to get the UI running, then swap it out once the Key is available",
   "Use a local mock service to replace the API response, then switch to real calls after delivery",
   "Stop and ask the user for the Key; once received, send one test request to verify it works, then continue development",
   "Skip this feature for now and prioritize completing parts that don't depend on the model"
  ],
  "ans": 2,
  "exp": "This is a hard production delivery check: for any feature involving AI model calls, the interface must be confirmed actually accessible before delivery — hard-coding mock responses or bypassing real calls with local mocks is prohibited. Without a Key you must stop and ask for one; once received, send one test request to verify it works, then continue."
 },
 {
  "g": 709,
  "type": "single",
  "q": "According to the course's analysis, what is AI's true motivation for often proposing 'do a simple version first, fill it out later'?",
  "opts": [
   "The requirements are genuinely too complex and the AI's context window can't fit the complete solution",
   "AI is trained to prioritize saving the user's token costs, and a simple version consumes fewer tokens",
   "It wants to quickly deliver something that runs to get positive feedback — often unrelated to actual complexity",
   "Simple-version code appears more frequently in training data, making it higher-confidence to generate"
  ],
  "ans": 2,
  "exp": "The practical observation is: when AI says 'do a simple version first,' it's often unrelated to complexity — it wants to quickly deliver something running to earn positive feedback. 'Use a temporary solution,' 'mock it for now,' 'handle it simply' all reflect the same pattern. Once you break this pattern, AI actually gives more careful thought to the complete solution."
 },
 {
  "g": 710,
  "type": "single",
  "q": "In a large project, a feature genuinely requires 2,000 lines of code and writing it all at once is unrealistic. Under the 'no phased delivery' rule, what is the correct approach?",
  "opts": [
   "Make an exception and accept AI's phased plan — in large projects, rules must give way to reality",
   "Trim the requirements to ensure every feature can be written within a single conversation",
   "Switch to a model with a larger context window to generate all the code at once",
   "Have AI produce the complete plan and actual workload estimate — let humans decide whether and how to split the work"
  ],
  "ans": 3,
  "exp": "The rule's key distinction is: splitting is a human decision, downgrading is AI acting unilaterally. When a feature is genuinely too complex, the correct action still holds: AI provides the complete plan, realistic workload, and a list of prerequisite decisions humans need to make first — returning control to human hands. This has nothing to do with trimming requirements or switching models."
 },
 {
  "g": 711,
  "type": "single",
  "q": "'Refactored the message rendering module, external behavior completely unchanged' — which document should this go into?",
  "opts": [
   "RELEASE_NOTES, so users know the product is actively iterating",
   "FEATURES, because every code change should sync to the feature list",
   "METHODOLOGY, because refactoring decisions are part of product methodology distillation",
   "CHANGELOG, because technical changes of type REFACTOR go here — changes invisible to users must not appear in RELEASE_NOTES"
  ],
  "ans": 3,
  "exp": "The four documents each cover one dimension: CHANGELOG answers 'what changed this time,' and REFACTOR-type technical changes belong to it. RELEASE_NOTES faces real users, with an explicit red line forbidding user-invisible changes and technical details. FEATURES tracks feature lifecycles; METHODOLOGY tracks product decisions and preferences — neither accepts this entry."
 },
 {
  "g": 712,
  "type": "single",
  "q": "In the data format trifecta, Agent tool-call inputs, requests, and responses all use XML. What is the primary reason?",
  "opts": [
   "Tag closure is intuitive, reducing errors when LLMs generate token by token, and nested structures within strings require no escaping",
   "XML is a W3C standard with a more complete type system than JSON",
   "XML parsing is faster than JSON, significantly reducing tool-call latency",
   "All major models' function calling natively supports only XML format"
  ],
  "ans": 0,
  "exp": "Deep JSON nesting is error-prone with mismatched brackets and quotes; embedding JSON inside strings creates escape hell, with backslashes doubling at every nesting level. XML's tag closure is intuitive, and models make fewer errors generating it token by token. The course also notes the boundary: projects using only the GPT series can switch back to JSON since its function calling is natively JSON; 'Agent uses XML' is the lowest common denominator choice for multi-model mixed environments."
 },
 {
  "g": 713,
  "type": "single",
  "q": "What problem does the pre-release diff review primarily solve?",
  "opts": [
   "Checking whether code style is consistent and naming follows team conventions",
   "Counting lines changed this release to estimate release workload",
   "Separating 'what I thought I changed' from 'what I actually changed' — catching unrelated changes that slipped into the diff",
   "Verifying that new code meets performance benchmarks in production"
  ],
  "ans": 2,
  "exp": "Release Notes describe expected changes, but actual commits may contain leftover temporary changes from last week's debugging, or even accidental deletions. Diff review has a SubAgent independently compare the actual diff against the Release Notes and flag deviations — pausing the release if risks are found. The design intent is to add a reviewer step for solo developers who skip PR review."
 },
 {
  "g": 714,
  "type": "single",
  "q": "In conversation round 1, you set 'use PostgreSQL for the database.' In round 30, the AI suddenly suggests switching to SQLite. What does the course identify as the cause?",
  "opts": [
   "The model actively forgets old information in long conversations to free up compute for new content",
   "The early constraint was squeezed out by context window truncation — AI simply made a 'reasonable' inference from what it could see",
   "Long conversations trigger incremental training of the model, and old constraints are overwritten by new data",
   "AI detected project data volume changes and proactively optimized the tech stack selection"
  ],
  "ans": 1,
  "exp": "The cause is context window truncation combined with attention decay at the end of long texts: once the constraint slides out of the window, AI simply cannot see it and makes a seemingly reasonable suggestion based on visible information. The remedy is anchoring: after more than 10 rounds, before modifying code, configs, or deployments, AI must recite the current goal and key constraints in a fixed format."
 },
 {
  "g": 715,
  "type": "multi",
  "q": "When a modification triggers the 3-file breakpoint, what elements must the AI's modification plan include? (Multiple choice)",
  "opts": [
   "A complete list of files to be changed",
   "Exactly what changes are being made to each file",
   "Estimated line counts for each change",
   "Dependencies between changes: which to modify first, which second, what depends on what",
   "The last three commit records for each file"
  ],
  "ans": [0, 1, 3],
  "exp": "The three required elements of a modification plan: the file list lets people check scope first — the list itself can surface anomalies; per-file change content prevents AI from sneaking in unrelated refactoring cleanup; dependency order prevents discovering a flawed approach after a chain of changes, making rollback prohibitively expensive. Estimated line counts and commit history are not required."
 },
 {
  "g": 716,
  "type": "multi",
  "q": "Regarding code protection and dependency changes, which of the following practices comply with the rules? (Multiple choice)",
  "opts": [
   "When AI thinks a code section should be removed, mark it with a TODO explaining why, then delete only after obtaining user permission",
   "When comments are out of sync with implementation after refactoring, delete the outdated comments directly to avoid misleading future readers",
   "Before changing package.json, declare three things: what dependency is changed, why it's needed, and the version selection rationale",
   "Comment out the code to be deleted and leave it in place — don't touch it"
  ],
  "ans": [0, 2],
  "exp": "Code deletion requires first marking 'TODO: suggested removal + reason' and informing the user — deletion only happens after obtaining permission. Silent deletion under the guise of 'tidying up' or 'looks unused' is prohibited. Dependency changes similarly require declaring three things first. The correct action for outdated comments is to update their content — deleting them loses decision information. Leaving commented-out code heaped in place is also not encouraged."
 },
 {
  "g": 717,
  "type": "multi",
  "q": "According to the debugging standard, what three questions must be answered before fixing a bug? (Multiple choice)",
  "opts": [
   "Which developer introduced this bug and in which commit",
   "What is the complete business flow of the feature containing this bug",
   "What other modules would be affected by modifying this",
   "How many lines of code the bug fix is estimated to require",
   "Whether similar issues exist elsewhere in the codebase"
  ],
  "ans": [1, 2, 4],
  "exp": "The pre-fix three questions: the complete business flow lets you see the entire chain beyond just the error point; impact scope lets you understand upstream/downstream dependencies to avoid whack-a-mole — the rule also suggests launching a SubAgent for parallel investigation; similar issue checks are needed because the same trap often exists in more than one place, so fix them all this time. Attribution and estimated line counts are unrelated to the three questions."
 },
 {
  "g": 718,
  "type": "multi",
  "q": "Regarding the four documents FEATURES, CHANGELOG, RELEASE_NOTES, and METHODOLOGY, which statements are correct? (Multiple choice)",
  "opts": [
   "FEATURES records the lifecycle state transitions and history of features — cancelled features are marked ⚪ and kept, not deleted",
   "RELEASE_NOTES should include module names and file paths so users can understand the change details",
   "CHANGELOG timestamps must be populated by reading the system's current time — filling from memory or accumulating entries to write later are both prohibited",
   "Design decisions can be written in Notion or Feishu — AI will automatically read external documents",
   "METHODOLOGY is actively written by AI when it identifies decisions and preferences in conversations — new conversations automatically inherit it"
  ],
  "ans": [0, 2, 4],
  "exp": "FEATURES is the single source of truth for feature points — cancelled features are marked ⚪ with reason noted, not deleted. CHANGELOG timestamps must read system time. METHODOLOGY is written directly by AI upon recognition, with a brief notification — no permission needed each time. RELEASE_NOTES explicitly prohibits technical details and module paths; external documents are not readable by AI, so decisions must be in Markdown files within the project repository."
 },
 {
  "g": 719,
  "type": "multi",
  "q": "What exactly are the 'three gates' for destructive operations? (Multiple choice)",
  "opts": [
   "Run a full load test before release to confirm there is no performance regression",
   "Back up the database first for any database changes — migrate, drop, alter, or delete operations are forbidden without a backup",
   "Before irreversible operations, state the rollback plan clearly: how to restore, what backup files are needed, estimated recovery time",
   "Perform a diff review before release, comparing actual changes against Release Notes — pause release if risks are found",
   "Delete backup files immediately after the operation to avoid wasting disk space"
  ],
  "ans": [1, 2, 3],
  "exp": "All three gates are set before execution: the backup gate prevents data loss — backups are timestamped and placed under the project root's backups/ directory; the rollback gate prevents unrecoverable situations — inability to describe the three rollback elements means the operation hasn't been fully thought through; the review gate prevents releasing with bugs. Load testing is not among the three gates; deleting backups after the operation is the exact opposite of the rule."
 },
 {
  "g": 720,
  "type": "judge",
  "q": "Demo components in the PlayGround should be deleted when the corresponding feature requirement is cancelled, to keep the page clean.",
  "ans": false,
  "exp": "The maintenance rule is clear: demo components are only added or modified — never deleted. Even if the feature requirement is cancelled, the corresponding demo must be kept; it is a historical archive of the design process, available to pick back up if the requirement is revived. Moving it to a 'deprecated' folder or delaying deletion is still effectively deletion."
 },
 {
  "g": 721,
  "type": "judge",
  "q": "Beyond rejecting phrases like 'use a temporary solution' and 'mock it for now,' the rules also prohibit AI from proactively planning phases, MVPs, or stage-one-two-three.",
  "ans": true,
  "exp": "The rule explicitly prohibits simplified implementations for any reason, and also prohibits AI from proactively planning phases, MVPs, or stage-one-two-three. Every implementation must be complete, correct, and debt-free. When something is genuinely too complex, the correct action is for AI to list the prerequisite decisions humans need to make, returning the choice to human hands."
 },
 {
  "g": 722,
  "type": "judge",
  "q": "If a chat input box only checks whether the key is Enter to send, Chinese IME users pressing Enter to confirm a candidate character will accidentally send half-typed pinyin as a message.",
  "ans": true,
  "exp": "Confirming candidate characters in a Chinese IME also fires an Enter event, at which point isComposing is true. The standard approach requires simultaneously checking isComposing — the rule explicitly prohibits checking only for the Enter key without checking it. This pitfall has low coverage in AI training data, so without writing it into the Rule, it will definitely be forgotten."
 },
 {
  "g": 723,
  "type": "judge",
  "q": "If an API Key was accidentally committed to git history, the exposure risk is resolved by simply removing it from the latest version of the code.",
  "ans": false,
  "exp": "Once a Key enters git history, it is permanently exposed — anyone browsing past commits can retrieve it. Removing it from the latest code does not solve the problem; the only correct response is to revoke and reissue the Key. This is why credential management rules require all Keys to go through environment variables or a secrets manager — hard-coding in code or config files is prohibited."
 },
 {
  "g": 724,
  "type": "judge",
  "q": "xs_vibe_rules is a ready-to-use template — copying all 14 chapters of rules as-is into your own project produces the best results.",
  "ans": false,
  "exp": "The course's conclusion explicitly states these rules are not a ready-to-use template. They should be adapted through four actions: delete chapters you won't use, swap out tech stack declarations, adjust confirmation thresholds, and add new rules for pitfalls you've hit. Copying all 14 chapters is worse than carefully selecting 5. Rules, like code, will rot without maintenance."
 },
 {
  "g": 725,
  "type": "single",
  "q": "For writing-style rule files like writing-style.mdc, why should alwaysApply be set to false in the frontmatter?",
  "opts": [
   "Writing rules have lower priority than coding rules — setting false lets them automatically yield when the two conflict",
   "false means on-demand inclusion — it won't be loaded in coding conversations, preventing irrelevant content from polluting the context",
   "Setting false causes Cursor to cache the file, making it load faster each conversation round",
   "Writing rules are too long — setting false prevents them from overflowing the context window's capacity limit"
  ],
  "ans": 1,
  "exp": "alwaysApply: true means the rule is automatically active in all conversations, suitable for global coding standards. Writing rules are only manually referenced when writing copy or Prompts — setting false avoids polluting coding conversation context. This has nothing to do with priority, cache speed, or length limits."
 },
 {
  "g": 726,
  "type": "single",
  "q": "Among the three files in the xs_vibe_rules repository, what role does secrets.mdc serve?",
  "opts": [
   "The main development standard — 14 chapters covering the full workflow from requirements to release",
   "A Chinese writing style checklist, manually referenced as needed when writing copy",
   "An API Key and credentials template, with content provided as placeholders",
   "A storage location for the project's actual secret keys — placing it in the rules directory lets AI use them directly"
  ],
  "ans": 2,
  "exp": "Each of the three files has its own domain: rule-opensource.mdc is the main development standard, covering 14 chapters end-to-end; writing-style.mdc is the Chinese writing style guide, referenced manually as needed; secrets.mdc is the API Key and credentials template, containing only placeholders. Real secret keys must go through environment variables or a secrets manager — putting them in rule files is equivalent to putting them in the repository."
 },
 {
  "g": 727,
  "type": "single",
  "q": "The rules require AI to search the project for similar existing implementations before adding a new feature. What problem does this rule address?",
  "opts": [
   "AI's context only covers the current conversation — it can't see utility functions written in another conversation three months ago, so the same formatDate gets written four times",
   "Searching first helps AI quickly understand the directory structure, reducing the need to read files later",
   "Old implementations in the project often contain bugs — finding them allows fixing them at the same time",
   "Search results help AI judge whether a requirement is worth implementing at all"
  ],
  "ans": 0,
  "exp": "AI cannot see what was written in past conversations. Without a constraint, the same utility function gets implemented repeatedly, with slight behavioral differences each time. The rule's action is specific: first search relevant directories for function names, class names, and utility methods — if an existing implementation is found, prioritize reusing or extending it."
 },
 {
  "g": 728,
  "type": "single",
  "q": "A user says 'add a report export feature.' According to the five-step flow demonstrated in the course, what is AI's first action?",
  "opts": [
   "Restate the requirement in AI's own words to confirm its understanding matches the user's",
   "Think first, then ask questions — clarify the blanks like export format, data volume limit, and whether filtering is needed",
   "Produce PRD.md first, marking uncertain parts as TBD",
   "Open a branch first, then confirm details with the user while writing"
  ],
  "ans": 1,
  "exp": "The flow order is: think and ask, restate requirement, write PRD, wait for permission, start development. The first step is AI coming back with questions to fill in the blanks — export format, data volume, filtering conditions. Restating and writing the PRD both build on those answers; reversing the order defeats the purpose."
 },
 {
  "g": 729,
  "type": "single",
  "q": "What does the rule say about when a PlayGround must be created first?",
  "opts": [
   "A PlayGround must be created before adding any UI component — no exceptions, even for a single button",
   "When page animations are involved, a static PlayGround page must be created first and fine-tuned there before the component may be written into the real page",
   "A PlayGround is only needed when the number of components being modified exceeds 3; under 3, write directly into the page",
   "AI decides on its own — it creates one if it judges the component sufficiently complex"
  ],
  "ans": 1,
  "exp": "The rule's trigger condition is animations: when page animations are involved, a static PlayGround page must first be created for free adjustment and component testing before integration into the real page. Animations are the hardest to iterate on in a live page — isolating them first incurs the lowest cost."
 },
 {
  "g": 730,
  "type": "single",
  "q": "For projects involving AI conversation features, why must all Prompts be listed in the PlayGround?",
  "opts": [
   "So Prompts can be printed out and reviewed by other team members for wording",
   "AI can only read Prompts on the page — it cannot read ones stored as code strings",
   "Prompts are the core asset of an AI product — buried in code strings they can't be debugged; laid out on a page they can be quickly compared and adjusted",
   "Putting Prompts on the page saves one database query, making conversation responses faster"
  ],
  "ans": 2,
  "exp": "This is a special requirement for AI conversation projects: the PlayGround must include both a simple conversation test page and a listing of all Prompts used in the project. Prompts are the core asset of an AI product — scattered in code strings, finding one version to modify takes forever; laid out on one page, they can be quickly compared and adjusted."
 },
 {
  "g": 731,
  "type": "single",
  "q": "According to the error handling standard, which of the following is a prohibited silent error swallow?",
  "opts": [
   "Log after catching and show the user a visible error message",
   "After catching, apply fallback logic and return cached data to keep the feature working",
   "Write only console.log(e) in the catch block and take no other action",
   "Retry once after catching a database timeout; log and prompt the user to try again if it still fails"
  ],
  "ans": 2,
  "exp": "Empty catch is prohibited: all try/catch and error branches must have substantive handling — log plus a user-visible notification, or reasonable fallback logic. Writing only console.log(e), pass, or // ignore all count as silent swallowing and are universally prohibited."
 },
 {
  "g": 732,
  "type": "single",
  "q": "In the three-element comment structure, what should the 'design intent' section specifically contain?",
  "opts": [
   "The input/output parameter types and the meaning of each parameter",
   "Why this implementation approach was chosen, and which alternative approaches were rejected",
   "What business problem this function solves and in what context it is called",
   "Side effects, dependencies, and boundary conditions that callers must be aware of"
  ],
  "ans": 1,
  "exp": "Each of the three elements covers one area: background explains why it exists and in what context it's called; design intent explains why it was implemented this way and which alternatives were rejected — this information can't be found in git log and comments are its only carrier; key constraints cover side effects, dependencies, and boundary conditions callers must know. Type signatures are already in the code itself and don't need to be restated in comments."
 },
 {
  "g": 733,
  "type": "single",
  "q": "After fixing a bug, the debugging standard requires AI to do one more thing. What is it?",
  "opts": [
   "Declare the impact scope in a fixed format — '⚡ Impact Scope: XXX, YYY, ZZZ' — so people know what to regression-test",
   "Append the fixed code snippet to METHODOLOGY.md for archiving",
   "Keep all the debug logs added during debugging in the code for easier future reproduction",
   "Release a version immediately to prevent the fix from being overwritten by subsequent changes"
  ],
  "ans": 0,
  "exp": "Fixing the bug only completes half the work. After the fix, the impact scope must be declared in a fixed format — for example, 'All input-box components with Enter-to-send, suggest regression testing chat box and comment box.' Its purpose is to hand off the regression testing scope so people know which spots to verify, rather than waiting for users to stumble upon them."
 },
 {
  "g": 734,
  "type": "single",
  "q": "What does the unit testing delivery checklist specifically require?",
  "opts": [
   "Core business logic must have tests; API interfaces and edge cases can be added later",
   "Test files go in the tests/ directory, named test_{module_name}.py; Python projects use pytest; temporary debug scripts must be deleted after use",
   "Test code and the module under test are written in the same file for easy side-by-side reference",
   "Test coverage must reach 100% — delivery is not allowed below that threshold"
  ],
  "ans": 1,
  "exp": "The delivery checklist requires coverage of core business logic, API interfaces, data processing functions, and edge cases. Test files go in tests/, named test_{module_name}.py, and Python projects use pytest. Temporary scripts written during debugging must be deleted after use and not left in the repository. The course does not impose a hard 100% coverage metric."
 },
 {
  "g": 735,
  "type": "single",
  "q": "The course uses a 90-day timeline to illustrate the fate of a simplified login implementation. What is the assessment at day 90?",
  "opts": [
   "4 modules start depending on the simplified interface, and the completion cost triples",
   "Dependencies have calcified — 9 modules coupled to the simplified version, completion cost at 8x, exceeding the cost of rewriting",
   "The simplified interface has been gradually replaced cleanly, with only scattered calls remaining",
   "Dependency count stops growing and completion cost falls back to 0.5x the original"
  ],
  "ans": 1,
  "exp": "The timeline has three stages: Day 1 — simplified version goes live, completing it now costs only 0.5x; Day 30 — session, permissions, payment, and notifications modules start depending directly on it, cost rises to 3x; Day 90 — 9 modules coupled, cost at 8x and exceeding the cost of rewriting, at which point the 'simplified version' has become permanent."
 },
 {
  "g": 736,
  "type": "single",
  "q": "According to the 'implementation quality requirements,' what should AI answer when evaluating a feature?",
  "opts": [
   "First produce the smallest working version, then go back to evaluate the remaining workload",
   "What is needed and how complex it is to do it completely; for approaches with known defects, give the correct version directly",
   "Break the feature into stages one, two, and three, and report workload and timeline segment by segment",
   "Evaluate which points the user cares about most and leave the rest blank for now"
  ],
  "ans": 1,
  "exp": "Evaluation only needs to answer two things: what is needed and how complex to complete it fully. For approaches with known defects, give the correct version directly — don't start with a makeshift one. When something is genuinely too complex, explicitly list the prerequisite decisions humans need to make, returning the choices to human hands. This is distinct from AI itself planning stage-one-two-three."
 },
 {
  "g": 737,
  "type": "single",
  "q": "Each change in CHANGELOG is recorded in a fixed-field table. Which of the following is NOT one of the template's fields?",
  "opts": [
   "Issue/Requirement: the reason triggering this change — user feedback, bug behavior, or new requirement",
   "Root Cause / Solution: root cause analysis for bugs, technical approach overview for features",
   "Impact Scope: which existing features this change may affect",
   "Man-hours: how many hours were actually spent on this change"
  ],
  "ans": 3,
  "exp": "The template has five fields: Issue/Requirement, Root Cause/Solution, Change Scope, Impact Scope, and Status — plus a type label in the title with values BUG, FEAT, REFACTOR, PERF, and DOCS. Man-hours is not among them. The advantage of fixed fields is that AI just fills in the blanks without needing to decide what to write each time."
 },
 {
  "g": 738,
  "type": "single",
  "q": "The rules require writing the HTTP timeout value for image generation API calls into the Rule. How much, and why?",
  "opts": [
   "30 seconds, to match the default value of most HTTP clients",
   "At least 120–180 seconds, because image APIs frequently fail with the default 30-second timeout, and AI will repeatedly retry the same broken configuration",
   "10 seconds — retry immediately on timeout, and total elapsed time will actually be shorter",
   "Don't hard-code a specific value — have AI dynamically estimate it each time based on image size"
  ],
  "ans": 1,
  "exp": "Image generation is inherently slow — a 30-second timeout will fail repeatedly. Even worse, AI will keep trying the same broken configuration over and over. Writing a timeout of at least 120–180 seconds into the Rule means it's automatically applied each conversation round — this class of problem is solved once and for all."
 },
 {
  "g": 739,
  "type": "single",
  "q": "When a network request fails, what does the rule require AI to do?",
  "opts": [
   "Report to the user directly that the network is unavailable and let the user investigate the environment",
   "Automatically switch to a backup service provider's endpoint and continue",
   "First try retrying through a proxy at 127.0.0.1:7890 by default; only report to the user if that also fails",
   "Silently retry three times, then skip the feature if all three attempts fail"
  ],
  "ans": 2,
  "exp": "Proxy fallback is an environment fact hard-coded in the Rule: network request failures must first attempt a proxy retry at the default address 127.0.0.1:7890 — only report to the user after that also fails. Jumping past the proxy to report errors directly is prohibited. Switching service providers is a selection decision that belongs to humans, not AI."
 },
 {
  "g": 740,
  "type": "single",
  "q": "What does the rule specifically require regarding code release and server deployment?",
  "opts": [
   "Must go through GitHub; servers pull via git pull or CI/CD. Emergency hotfixes are an exception — a commit must be backfilled to sync afterward",
   "Small changes can be scp'd directly to the server; only major version releases go through GitHub",
   "All deployments must go through GitHub under any circumstances without exception",
   "AI chooses the deployment method based on the size of the current change"
  ],
  "ans": 0,
  "exp": "There is only one release channel: code releases, version releases, and server deployments all go through GitHub — servers retrieve code via git pull or CI/CD. Emergency hotfixes are the one allowed exception, but a commit must be backfilled to sync afterward. Copying files directly bypasses version control, making it impossible to trace or roll back."
 },
 {
  "g": 741,
  "type": "multi",
  "q": "Regarding the writing principles of METHODOLOGY.md, which of the following statements are correct? (Multiple choice)",
  "opts": [
   "Distill the essence, merge similar items, annotate new entries with the date, avoid copying conversation verbatim",
   "Technical implementation details should also be recorded for future reference",
   "When a user overrules a proposal and gives a reason, that is one of the triggers for writing an entry",
   "One-time temporary decisions need not be recorded",
   "Permission must be sought from the user before each write — only proceed after the user approves"
  ],
  "ans": [0, 2, 3],
  "exp": "The writing principle is to distill the essence, merge similar items, and annotate with dates — no technical implementation details (that belongs to CHANGELOG) and no one-time temporary decisions. Triggers include: user explains why something is done this way, user overrules a proposal with a reason, user expresses a clear UI/UX preference, or lessons learned in a retrospective. AI writes directly upon recognition and briefly notifies — no permission required each time."
 },
 {
  "g": 742,
  "type": "multi",
  "q": "Regarding tech stack lock-in and taste rules, which of the following match the rule text? (Multiple choice)",
  "opts": [
   "Avoid port 5000 — assign randomly from 8000–9000, so multiple simultaneous projects don't conflict",
   "Emoji icons for buttons are prohibited — icons must use SVG and be downloaded locally",
   "Once a tech selection is made, it is no longer up for discussion. AI's role is to write good code within the decided stack",
   "Port is fixed at 5000 for all projects — easy for team members to remember and debug across machines",
   "Icons should be loaded via CDN to reduce repository size"
  ],
  "ans": [0, 1, 2],
  "exp": "Port rules, icon rules, and tech-stack lock-in are all hard-coded facts in the Rule: avoid port 5000 and assign randomly from 8000–9000; icons use SVG downloaded locally, no CDN dependency; once tech selection is made, alternative options are no longer discussed. Icon sets are chosen by product tone — SaaS uses Lucide, warm tone uses Tabler Icons."
 },
 {
  "g": 743,
  "type": "multi",
  "q": "This release's Notes only say 'added dark mode.' According to the diff review judgment standard, which of the following changes should be flagged as risky? (Multiple choice)",
  "opts": [
   "Added src/theme/darkTheme.css, defining color variables and component styles for the dark theme",
   "Modified src/utils/messageParser.ts, rewriting the branch logic of an existing message parsing function",
   "Modified package.json, upgrading axios from 0.27.2 to 1.6.0",
   "Modified src/App.tsx, mounting the theme toggle component and reading user theme preferences",
   "Modified src/styles/tokens.css, adding a new set of color variables for the dark theme to reference"
  ],
  "ans": [1, 2],
  "exp": "The judgment standard is whether the change can be explained by the Release Notes. Rewriting existing message parsing logic is unrelated to dark mode — it's likely a temporary debugging change that slipped in from last week. The axios major version upgrade introduces breaking changes affecting all network requests, and it's not mentioned in the Release Notes. Adding theme styles, mounting the toggle component, and adding-only color variables all serve the current release theme — they're expected."
 },
 {
  "g": 744,
  "type": "multi",
  "q": "According to the self-review checklist in writing-style.mdc, which of the following are prohibited patterns? (Multiple choice)",
  "opts": [
   "Contrast sentences that first negate one claim, then elevate another",
   "Full-width em-dashes and full-width ellipses",
   "Adding the comment 'very insightful' when paraphrasing someone else's words",
   "Breaking a long sentence into two shorter sentences",
   "Opening a paragraph with a concrete number to state the conclusion"
  ],
  "ans": [0, 1, 2],
  "exp": "The prohibited patterns called out in the self-review checklist include: these contrast constructions, full-width em-dashes, full-width ellipses, English quotation marks and curly quotes, pulp-fiction emotional words, evaluating others' words, and pre-conclusion preambles. The fix is also direct: replace contrast constructions with a direct conclusion, replace dashes with commas/periods or split into two sentences, and use only half an ellipsis. Breaking long sentences and leading with numbers are actually practices the style guide encourages."
 },
 {
  "g": 745,
  "type": "multi",
  "q": "For installing xs_vibe_rules in your own project and keeping it useful long-term, which of the following practices are correct? (Multiple choice)",
  "opts": [
   "Place .mdc files in the project's .cursor/rules/ directory — Cursor will auto-detect them",
   "Replace model configuration, tech stack, and port rules with your own choices; fill the secrets file with placeholders and exclude it from git",
   "Use it in a real project for a full week, delete rules that were never triggered, and write new rules for pitfalls you actually hit",
   "To ensure all rules are definitely active, set alwaysApply: true on all rule files",
   "Once rule files are finalized, never change them again — stability is paramount"
  ],
  "ans": [0, 1, 2],
  "exp": "The three steps to install it in a project are: place in rules directory, configure alwaysApply activation mode, and replace environment facts. The secrets file uses only placeholders and must be excluded from git. Activation modes should be set differently — writing-style rules should be set to false for on-demand inclusion. The final assignment also requires using it for a week, then deleting rules that never triggered and adding new rules for pitfalls actually encountered. Rules, like code, will rot without maintenance."
 },
 {
  "g": 746,
  "type": "judge",
  "q": "The history log in FEATURES only appends entries when the plan changes — features whose plan never changed don't need a history log.",
  "ans": false,
  "exp": "The history log must record the initial requirement, any plan changes and their reasons, and the final implementation. The rule explicitly requires writing at least one 'initial requirement' entry even for features whose plan never changed. It grows automatically through state transitions — every status change or plan adjustment appends a dated record, with the date read from system time and filling from memory prohibited."
 },
 {
  "g": 747,
  "type": "judge",
  "q": "Under the model configuration rules, all AI model responses visible to the front end must use Streaming responses — only back-end internal calls may be non-streaming.",
  "ans": true,
  "exp": "This is an environment fact hard-coded in the Rule: front-end-visible AI model responses must always be streaming; back-end internal calls may be non-streaming. Along with timeout values and proxy fallback, this belongs to the same class of information — written into the Rule once, automatically applied every conversation round, and no need to restate in new sessions."
 },
 {
  "g": 748,
  "type": "judge",
  "q": "When the release diff review finds a risky change, the release must be paused. Until the user explicitly confirms, tagging, pushing, and deploying are all prohibited.",
  "ans": true,
  "exp": "Once the review report surfaces a risk, the action is to pause the release and wait for user confirmation — tagging, pushing, and deploying are all prohibited until confirmation. This gate is set before execution, and combined with the GitHub-only release channel, it gives solo developers who skip PR review a reviewer step equivalent."
 },
 {
  "g": 749,
  "type": "judge",
  "q": "When a user changes the goal mid-conversation, AI's subsequent restatement should list both the old and new goals side by side for the user to compare.",
  "ans": false,
  "exp": "The anchoring rule requires recitation based on the most recent goal, with the change explicitly noted, to avoid mixing old and new goals together. The recitation also follows a fixed format, making it easy to confirm at a glance. Placing both goals side by side would only cause AI to keep wavering in subsequent implementation."
 },
 {
  "g": 750,
  "type": "judge",
  "q": "When multiple SubAgents or multiple edits touch the same file, subsequent edits must re-read the file's current state first — editing based on cached or remembered old content is prohibited.",
  "ans": true,
  "exp": "This is the third key point of the anchoring rules — the course calls it the optimistic lock of the multi-Agent era. When the same file is being modified in parallel, working from remembered old content directly overwrites what someone else just wrote. Re-reading once first is the only reliable approach."
 }
];

window.EXAM_TOPICS_PART = {
 "701": {"name": "Concept & Accident Root Cause", "file": "vibe-1.html"},
 "702": {"name": "Rule Injection Mechanism", "file": "vibe-1.html"},
 "703": {"name": "Four-Step Flow & Breakpoints", "file": "vibe-2.html"},
 "704": {"name": "Batch Modification Breakpoint", "file": "vibe-2.html"},
 "705": {"name": "PlayGround Positioning", "file": "vibe-3.html"},
 "706": {"name": "Three-Element Comments", "file": "vibe-4.html"},
 "707": {"name": "Debugging: Log First", "file": "vibe-5.html"},
 "708": {"name": "Real API Delivery Checklist", "file": "vibe-5.html"},
 "709": {"name": "Motivation Behind Rejecting Simple Versions", "file": "vibe-6.html"},
 "710": {"name": "Split Decision Ownership", "file": "vibe-6.html"},
 "711": {"name": "Document Triage Boundary", "file": "vibe-7.html"},
 "712": {"name": "Data Format Trifecta", "file": "vibe-8.html"},
 "713": {"name": "Diff Review Intent", "file": "vibe-9.html"},
 "714": {"name": "Context Drift Cause", "file": "vibe-10.html"},
 "715": {"name": "Modification Plan Three Elements", "file": "vibe-2.html"},
 "716": {"name": "Code Protection Rules", "file": "vibe-4.html"},
 "717": {"name": "Pre-Fix Three Questions", "file": "vibe-5.html"},
 "718": {"name": "Four Document Division", "file": "vibe-7.html"},
 "719": {"name": "Destructive Operation Three Gates", "file": "vibe-9.html"},
 "720": {"name": "Demo: Add Only Never Delete", "file": "vibe-3.html"},
 "721": {"name": "Prohibit Phase Planning", "file": "vibe-6.html"},
 "722": {"name": "IME Accidental Send Pitfall", "file": "vibe-8.html"},
 "723": {"name": "Credential Exposure Handling", "file": "vibe-9.html"},
 "724": {"name": "Rule Adaptation", "file": "vibe-final.html"},
 "725": {"name": "Rule Activation Mode Config", "file": "vibe-1.html"},
 "726": {"name": "Three Rule Files Division", "file": "vibe-1.html"},
 "727": {"name": "New Feature Dedup Rule", "file": "vibe-2.html"},
 "728": {"name": "Flow First Step: Think & Ask", "file": "vibe-2.html"},
 "729": {"name": "Animation PlayGround Timing", "file": "vibe-3.html"},
 "730": {"name": "Prompts Laid Out for Tuning", "file": "vibe-3.html"},
 "731": {"name": "No Empty Catch", "file": "vibe-4.html"},
 "732": {"name": "What Design Intent Contains", "file": "vibe-4.html"},
 "733": {"name": "Declare Impact Scope After Fix", "file": "vibe-5.html"},
 "734": {"name": "Unit Test Delivery Checklist", "file": "vibe-5.html"},
 "735": {"name": "Tech Debt Cost Curve", "file": "vibe-6.html"},
 "736": {"name": "Complete Implementation Evaluation", "file": "vibe-6.html"},
 "737": {"name": "Change Record Table Fields", "file": "vibe-7.html"},
 "738": {"name": "Image Generation Timeout Config", "file": "vibe-8.html"},
 "739": {"name": "Network Failure Proxy Fallback", "file": "vibe-8.html"},
 "740": {"name": "Release Channel via GitHub", "file": "vibe-9.html"},
 "741": {"name": "Methodology Write Principles", "file": "vibe-7.html"},
 "742": {"name": "Tech Stack & Taste Rules", "file": "vibe-8.html"},
 "743": {"name": "Diff Risk Judgment", "file": "vibe-9.html"},
 "744": {"name": "Prohibited Pattern Checklist", "file": "vibe-10.html"},
 "745": {"name": "Rule Adoption & Maintenance", "file": "vibe-final.html"},
 "746": {"name": "History Log Initial Entry", "file": "vibe-7.html"},
 "747": {"name": "Streaming Response Requirement", "file": "vibe-8.html"},
 "748": {"name": "Pause Release on Risk", "file": "vibe-9.html"},
 "749": {"name": "Goal: Use Latest Version", "file": "vibe-10.html"},
 "750": {"name": "Re-read Before Parallel Edits", "file": "vibe-10.html"}
};
