/* Chapter 5 Quiz Bank · Harness & Self-Improvement (50 questions: single 26 / multi 11 / judge 13)
   g = topic group number (this chapter uses 501-550), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 501,
  "type": "single",
  "q": "According to the RSI evolution timeline in the course, what is the core practical path of recursive self-improvement during 2025–2026?",
  "opts": [
   "Models directly rewrite their own weights to upgrade cognitive mechanisms in-place",
   "Model improvement focuses on the deployment systems, workflows, and context management surrounding the model — without directly rewriting weights",
   "Relying on self-play and synthetic data to continuously expand training corpora, letting models improve their own training data",
   "Temporarily updating parameters during inference through test-time training for instant self-improvement"
  ],
  "ans": 1,
  "exp": "The course timeline states that during 2025–2026, Harness engineering becomes the core RSI path: models do not directly rewrite weights, but instead improve the deployment systems, workflows, and context management that surround them. Self-play and synthetic data belong to the early attempts of 2023–2024; directly rewriting weights has no practical path at present."
 },
 {
  "g": 502,
  "type": "single",
  "q": "How does the course define Harness?",
  "opts": [
   "A set of special weight layers deployed inside the model that translate user instructions into vectors the model can understand",
   "The data cleaning and annotation pipeline used during training that determines what knowledge the model ultimately learns",
   "The runtime system surrounding the base model that determines how the model thinks, plans, calls tools, manages context, stores artifacts, and evaluates results",
   "An independent module at the inference output stage that performs safety filtering and compliance review on content"
  ],
  "ans": 2,
  "exp": "Harness equals everything in the orchestration system around the model: it is the runtime system surrounding the base model that determines how the model thinks and plans, calls tools and acts, perceives and manages context, stores artifacts, and evaluates results. It is neither inside the model weights, nor the same as the training data pipeline or safety filtering module."
 },
 {
  "g": 503,
  "type": "single",
  "q": "What is the core idea of the Harness design pattern called 'workflow automation'?",
  "opts": [
   "Design the Agent as a script that runs once and terminates, ensuring each call is lightweight and results are predictable",
   "The Agent is a goal-directed loop where failure is a trigger for self-correction, and improvement happens at runtime",
   "Humans write static templates in advance that cover all situations, and the Agent strictly follows them step by step",
   "Repeat the same Prompt multiple times each round, sampling multiple outputs and selecting the best one"
  ],
  "ans": 1,
  "exp": "Workflow automation emphasizes that the Agent is a goal-directed loop (Plan → Execute → Observe → Improve → Execute again) and must not be treated as a one-shot script. Failed tests and command errors are all triggers for self-correction; improvement happens during Agent execution, not relying on static templates written in advance by humans, and repeating the same Prompt must also be avoided."
 },
 {
  "g": 504,
  "type": "single",
  "q": "According to the course's recommended 'context vs. files' division of responsibilities, what type of information should be stored in the file system?",
  "opts": [
   "Current task instructions being processed and immediate tool call results",
   "Conversation content from the most recent 2–3 turns that needs immediate reference",
   "Historical experiment results, accumulated error logs, summaries of completed sub-tasks, and other long-term state",
   "All work history, compressed and injected into every Prompt as a whole"
  ],
  "ans": 2,
  "exp": "The course's key principle is: context is working memory, and the file system is long-term memory. Task instructions that need immediate reference, tool results, and the most recent few rounds of conversation go into context; historical experiment results, error logs, and sub-task summaries — information that needs to be persistently stored but does not need to always be in view — go into the file system. Compressing all history into the Prompt is exactly what should be avoided."
 },
 {
  "g": 505,
  "type": "single",
  "q": "In the ACE (Agentic Context Engineering) framework, what is the Curator's responsibility?",
  "opts": [
   "Execute tasks and generate trajectories, using the bullet points in the playbook as guidance",
   "Distill insights from successful and failed trajectories, extracting lessons learned",
   "Update structured context with incremental itemized entries and periodically refine and deduplicate",
   "Evaluate the quality of final outputs and decide whether a task needs to be re-executed"
  ],
  "ans": 2,
  "exp": "ACE has three components collaborating to maintain a structured playbook: the Generator executes tasks and generates trajectories, the Reflector distills insights from successful and failed trajectories, and the Curator updates the structured context with incremental itemized entries and periodically refines and deduplicates. Options A and B are the responsibilities of the Generator and Reflector respectively; there is no such setting for quality scoring."
 },
 {
  "g": 506,
  "type": "single",
  "q": "What key design does ACE use to prevent context collapse and brevity bias caused by iterative rewrites?",
  "opts": [
   "Have the model rewrite the entire Prompt block each round to keep content always fresh",
   "The Curator outputs structured (identifier, description) entries and merges them into the playbook using deterministic logic, never rewriting the entire Prompt block",
   "Set a strict length cap on context, automatically truncating overflow in chronological order",
   "Periodically clear all context and rebuild the playbook from scratch to eliminate accumulated errors"
  ],
  "ans": 1,
  "exp": "ACE's key design is that the Curator outputs structured (identifier, description) entries and uses deterministic logic to incrementally merge them into the playbook, never rewriting the entire Prompt blob. It is precisely by avoiding 'having the model rewrite the whole thing' that context collapse and brevity bias during iterative rewrites are prevented. Truncation and periodic clearing both directly lose information, which is unrelated to this design."
 },
 {
  "g": 507,
  "type": "single",
  "q": "What is the core idea of MCE (Meta Context Engineering) that goes a step further than ACE?",
  "opts": [
   "Using a larger context window to accommodate more historical information, reducing retrieval needs",
   "Separating the mechanism of 'how to manage context' from the content of 'what is in context,' optimizing at both levels simultaneously",
   "Eliminating the Reflector stage, letting the Generator summarize its own experience during execution",
   "Converting all context into code form for more precise structured parsing by the model"
  ],
  "ans": 1,
  "exp": "MCE builds on ACE by separating mechanism (Skill) from content, doing dual-layer optimization: the inner level finds the optimal context for a given skill, and the outer level finds the optimal skill on a validation set. ACE's update rules are still manually designed; MCE allows the management mechanism itself to evolve. It does not eliminate the reflection stage, nor is it related to simply expanding the window size."
 },
 {
  "g": 508,
  "type": "single",
  "q": "What is the optimization target of Meta-Harness (Lee et al. 2026)?",
  "opts": [
   "Specific knowledge entries in the context playbook",
   "The code itself that determines what information should be stored, retrieved, and presented to the model",
   "The weight parameters and attention structure of the base model",
   "The wording and format of raw user input instructions"
  ],
  "ans": 1,
  "exp": "Meta-Harness goes one layer deeper than ACE and MCE: what is being optimized has gone beyond context content, pointing directly at the code that determines how information is stored, retrieved, and presented to the model — it is a Harness that optimizes the Harness. Its Proposer itself is a coding Agent that outputs a Pareto-frontier set of Harness candidates; it is the most powerful but also the most computationally expensive."
 },
 {
  "g": 509,
  "type": "single",
  "q": "How does AFlow achieve automatic workflow search?",
  "opts": [
   "Representing workflows as directed graphs (nodes are LLM call actions, edges are logical operations) and using Monte Carlo Tree Search to find optimal solutions in the graph space",
   "Having multiple human experts vote on candidate workflows, with the highest-voted approach winning",
   "Using gradient descent to directly differentiate over workflow structural parameters and iteratively optimize",
   "Randomly generating massive numbers of workflows and executing them all, retaining the best-performing one"
  ],
  "ans": 0,
  "exp": "AFlow represents workflows as directed graphs: nodes are LLM call actions, edges are conditional branches, loops, and other logical operations. It then uses MCTS to search the graph space, selecting nodes for expansion using a soft mix of scores and uniform exploration, having LLMs generate variants, executing and evaluating them, and adding improvements back to the search tree. Workflow structures are discrete and cannot be directly optimized with gradients; pure random enumeration would also far exceed the computational budget."
 },
 {
  "g": 510,
  "type": "single",
  "q": "What signal does Autodata use to determine whether a piece of synthetic data is worth keeping?",
  "opts": [
   "Whether the length of the question text and vocabulary diversity meet the standard",
   "The difficulty gap where a strong solver can solve it but a weak solver cannot",
   "Human annotators score each item individually, keeping only those above a threshold",
   "Semantic similarity to the existing training set — the closer, the better"
  ],
  "ans": 1,
  "exp": "Autodata synthesizes data through multi-role collaboration of Challenger, Weak Solver, Strong Solver, and Verifier, using the difficulty gap as a quality signal: only questions that the strong solver can answer but the weak solver cannot are kept, ensuring data difficulty is just right and most valuable for model improvement. The entire process runs automatically without relying on manual item-by-item annotation."
 },
 {
  "g": 511,
  "type": "single",
  "q": "What is the core idea of STOP (Self-Taught Optimizer)?",
  "opts": [
   "Repeatedly refining the initial solution directly until the utility function score reaches optimal",
   "Continuously improving the 'improver' that produces better solutions, because the improver itself is text and the improvement logic can be applied to itself",
   "Training a dedicated small evaluator model to replace humans in judging the quality of improvement proposals",
   "Freezing the improver unchanged and relying only on swapping in a stronger base model to improve results"
  ],
  "ans": 1,
  "exp": "STOP does not directly improve a solution s — it continuously improves the improver I that produces better solutions. The key insight is that the improver itself is text (a Prompt or code), so the same improvement logic can be applied to the improver itself, forming a recursion: I_t = I_{t-1}(û, I_{t-1}; M). In experiments, it also automatically discovered classic optimization strategies such as genetic algorithms, simulated annealing, and Beam Search."
 },
 {
  "g": 512,
  "type": "single",
  "q": "How does Self-Harness decide whether to accept a Harness edit in the Proposal Validation stage?",
  "opts": [
   "Accept immediately as long as there is improvement on the held-in dataset, ensuring iteration speed",
   "Validate candidate edits with both held-in and held-out datasets, accepting only edits that show no regression",
   "Have human engineers review each item individually and manually merge approved configurations",
   "Accept some edits randomly with a certain probability to maintain diversity among candidates"
  ],
  "ans": 1,
  "exp": "The third stage of Self-Harness validates candidate edits with both held-in and held-out datasets, accepting only edits that show no regression, ensuring improvements do not come at the cost of sacrificing existing capabilities. Looking only at held-in improvement risks overfitting the validation set; the entire propose-evaluate-accept loop is completed autonomously by the Agent without requiring human review of each item."
 },
 {
  "g": 513,
  "type": "single",
  "q": "What is the key difference between DGM (Darwin Gödel Machine) and AlphaEvolve?",
  "opts": [
   "DGM replaces evolutionary algorithms with gradient descent for faster convergence",
   "DGM explicitly targets the Agent's own harness code repository for evolution, and the Agent is allowed to modify its own harness code",
   "DGM only evolves Prompt text without touching any code-level changes",
   "DGM requires human review and approval after each mutation before moving to the next generation"
  ],
  "ans": 1,
  "exp": "AlphaEvolve maintains a pool of candidate programs and uses a frozen LLM to generate code diffs to improve target programs. DGM is more aggressive: the evolution target is the Agent's own harness code repository. The parent agent examines its own evaluation logs, proposes improvements, and mutates into a new agent — only if performance is high enough does it get added back to the pool. Based on Claude 3.5 Sonnet, experiments raised SWE-bench Verified from 20% to 50%, all without human intervention."
 },
 {
  "g": 514,
  "type": "single",
  "q": "Against the risk of reward hacking in self-improvement loops, what does the course identify as the key line of defense?",
  "opts": [
   "Placing evaluators and permission controls outside the evolution loop, maintained by independent mechanisms",
   "Greatly increasing the number of unit tests so the Agent cannot overfit test cases",
   "Switching to a larger base model, naturally eliminating cheating incentives through capability improvement",
   "Limiting optimization rounds so the Agent does not have time to find loopholes in the evaluation system"
  ],
  "ans": 0,
  "exp": "Optimizing unit tests risks overfitting cases, optimizing evaluator models enables reward hacking, and optimizing benchmark scores exploits loopholes. Therefore, the course emphasizes that evaluators and permission controls should be outside the evolution loop, maintained by independent mechanisms — just as the exam-setter and grader must never be the student themselves. Adding tests, switching models, and reducing rounds all fail to address the root cause that 'the target being optimized can itself be gamed.'"
 },
 {
  "g": 515,
  "type": "multi",
  "q": "Which of the following are among the three Harness design patterns summarized by the course?",
  "opts": [
   "Workflow automation: building feedback loops into the system",
   "File system as persistent memory: breaking through context window limitations",
   "Sub-agents and background tasks: replacing serial waiting with parallelism",
   "Online fine-tuning of model weights: letting the model continuously update parameters with tasks",
   "Output safety filtering: performing content review on each round of generation"
  ],
  "ans": [0, 1, 2],
  "exp": "The three design patterns distilled by Lilian Weng are: workflow automation, file system as persistent memory, and sub-agents and background tasks — three layers stacked on top of each other: the loop provides the execution backbone, the file system provides the hard drive, and sub-agents provide multi-core processing. Online weight fine-tuning and output safety filtering have no such setting; Harness-layer design does not involve changing model parameters."
 },
 {
  "g": 516,
  "type": "multi",
  "q": "Which of the following steps are included in the working mechanism of ADAS's Meta-Agent Search?",
  "opts": [
   "The Meta-Agent first generates high-level descriptions of agent architecture, tool use, and reasoning strategies",
   "Implementing the high-level descriptions as executable code, using code to represent the design search space",
   "Checking novelty through self-refine to ensure proposals do not simply repeat existing designs",
   "Using Monte Carlo Tree Search to expand and prune nodes on the workflow graph",
   "Human experts write review comments for each candidate design before evaluation"
  ],
  "ans": [0, 1, 2],
  "exp": "ADAS has the Meta-Agent automatically search the design space: first generate a high-level description, then implement it as executable code, then check novelty through self-refine, and finally evaluate on benchmark tasks and retain the best design. MCTS is AFlow's search strategy; ADAS uses self-refine. The entire process is automated, requiring no human review comments."
 },
 {
  "g": 517,
  "type": "multi",
  "q": "The course argues that evolutionary search is especially suitable for Harness optimization. Which of the following are cited as evidence?",
  "opts": [
   "Harness consists of Prompt, code logic, and tool configurations, forming a large and highly discrete combination space",
   "Gradients cannot be computed for Prompt text, but candidate solutions can easily be scored on benchmarks",
   "Different tasks may require different styles of Harness, and evolution naturally maintains population diversity",
   "Evolutionary search consumes almost no computational resources — evaluation cost is negligible",
   "Evolutionary algorithms theoretically guarantee convergence to the global optimal solution"
  ],
  "ans": [0, 1, 2],
  "exp": "Three conditions of fit: large search space with a strange shape, gradients unavailable but evaluation easy, and diversity valuable. Problems where you can score but not solve analytically are exactly right for 'raise a population, keep the strongest.' However, the computational overhead of evolutionary search is not negligible — each round involves LLM inference plus code execution plus benchmarking; the balance between efficiency and effectiveness remains an open problem, let alone guaranteeing global optimality."
 },
 {
  "g": 518,
  "type": "multi",
  "q": "Which of the following are among the 'Seven Challenges of Self-Improvement' listed in the course?",
  "opts": [
   "Weak and ambiguous evaluators: many studies claim no fast and accurate verifier exists",
   "Diversity collapse: candidate solutions collapse into minor variants of the same approach, stopping innovation",
   "Reward hacking: optimizing tests, evaluator models, or benchmark scores all get gamed",
   "Insufficient model parameter scale: the base model is too small for adequate reasoning capability",
   "Inference speed too slow: single-generation latency too high, dragging down overall throughput"
  ],
  "ans": [0, 1, 2],
  "exp": "The seven challenges include: weak and ambiguous evaluators, context and memory lifecycle, negative results, diversity collapse, reward hacking, long-term success, and the role of humans — these are fundamental system design challenges. Parameter scale and inference speed are model and engineering performance issues; the course does not list them among the seven challenges."
 },
 {
  "g": 519,
  "type": "multi",
  "q": "Which of the following are among the six failure modes of automated research summarized by Trehan & Chopra (2026)?",
  "opts": [
   "Memory and context degradation: gradually losing key details in long-term projects, with inconsistencies between earlier and later content",
   "Over-optimism: claiming experiments significantly outperform baselines when actual results are full of noise",
   "Implementation drift under execution pressure: switching to simpler alternatives when hitting a complexity wall, deviating from the original design",
   "Computational budget exhaustion: experiments forced to terminate midway due to resource shortage",
   "Refusal to answer: models refusing to draw conclusions on sensitive scientific questions"
  ],
  "ans": [0, 1, 2],
  "exp": "The six failure modes are: training data default preference bias, implementation drift under execution pressure, memory and context degradation, over-optimism, insufficient domain intelligence, and weak scientific taste. They are structural bottlenecks of current automated research. Computational exhaustion and refusal to answer are resource or alignment issues, not in this list."
 },
 {
  "g": 520,
  "type": "judge",
  "q": "The course states that a mediocre model with an excellent Harness often outperforms a stronger model running bare.",
  "ans": true,
  "exp": "Correct. Successful products such as Claude Code, Codex, and Cursor have already proven that the Harness layer is as important as raw model intelligence: an excellent runtime orchestration system can enable a mediocre model to outperform a bare stronger model in actual performance. This is also the core reason why Harness engineering has received so much attention."
 },
 {
  "g": 521,
  "type": "judge",
  "q": "Simply appending all tool responses and model generations to the context will quickly spiral out of control as Agent task duration increases.",
  "ans": true,
  "exp": "Correct. This is exactly the context bloat problem the course identifies: simple appending equals loss of control — the window quickly fills up and the Agent starts forgetting early information, causing output quality to plummet. Context management thus becomes a critical layer for building structured, concise context under LLMs' limited attention spans, and this is the core problem that methods like ACE and MCE aim to solve."
 },
 {
  "g": 522,
  "type": "judge",
  "q": "STOP's recursive structure guarantees continuous improvement on any base model; model strength only affects the speed of improvement.",
  "ans": false,
  "exp": "Incorrect. Experiments show that GPT-4 can continuously improve, but GPT-3.5 and Mixtral actually regress. The recursive structure only provides the possibility of improvement without guaranteeing convergence: weak models lack sufficient programming intuition for meta-level operations, amplifying noise and going backward rather than forward. The base model must be strong enough to support meta-level optimization."
 },
 {
  "g": 523,
  "type": "judge",
  "q": "SIA has proven that joint optimization of Harness and model weights is stable and reliable, and can be directly used in production systems.",
  "ans": false,
  "exp": "Incorrect. The course evaluates the SIA direction as interesting, but the evidence is preliminary: training stability and the Goodhart effect (optimizing proxy metrics causes degradation of true objectives) remain open challenges. Like simultaneously tuning a race car's engine and modifying the track — two things changing at once is prone to going out of control — it is far from mature enough for direct production deployment."
 },
 {
  "g": 524,
  "type": "judge",
  "q": "The course believes that fully autonomous AI is the ultimate goal of self-improvement, and humans should gradually exit the loop.",
  "ans": false,
  "exp": "Incorrect. The course explicitly states that humans should move upward in the stack and continue to stay in the loop: providing supervision at the right time and right level of abstraction, setting goals, judging direction, and holding the line. Fully autonomous AI is not the ultimate goal — the quality of human-AI collaboration is; humans are an indispensable steering wheel in the system."
 },
 {
  "g": 525,
  "type": "single",
  "q": "According to the 'five-level ladder of optimization targets' in the course, what does Level 5 optimize?",
  "opts": [
   "Instruction Prompt",
   "Structured context",
   "Harness code",
   "Optimizer code"
  ],
  "ans": 3,
  "exp": "The five-level ladder in order is: instruction Prompt, structured context, workflow, Harness code, and optimizer code — Level 5 has already optimized the code that writes the optimizer. The course's pattern is: the more intelligent and powerful the model, the more complex the target we can optimize and the more general the methods become."
 },
 {
  "g": 526,
  "type": "single",
  "q": "The course uses the history of Prompt Engineering as an analogy for Harness. What judgment does it intend to convey?",
  "opts": [
   "Harness will completely disappear like manual Prompt techniques, eventually being entirely handled inside the model",
   "Many Harness improvements will be internalized as model behavior, but the interface with external context and tools will always exist",
   "The value of Harness only holds in the era of weak models — once stronger models are widespread, the external orchestration layer can be removed",
   "Prompt techniques and Harness are capabilities at the same layer and can substitute for each other"
  ],
  "ans": 1,
  "exp": "The course calls this a softer version: as instruction fine-tuning and reasoning capabilities improve, manual Prompt techniques become less central, but the need to specify goals, constraints, context, and evaluation has not disappeared. Similarly, many Harness improvements will eventually be internalized as model behavior, but the interface with external context and tools will always exist. The Harness layer will transform — it will not disappear."
 },
 {
  "g": 527,
  "type": "single",
  "q": "In the 'sub-agents and background tasks' pattern, what role does the parent Agent play?",
  "opts": [
   "Tallying the token consumption of each sub-agent and performing cost accounting",
   "Incorporating all intermediate outputs from sub-agents into its own context in real time to maintain a complete view",
   "Acting as a process manager: launching sub-tasks, checking logs and progress, canceling failed branches, and merging successful results",
   "Sharing the same memory state among multiple sub-agents to reduce communication overhead"
  ],
  "ans": 2,
  "exp": "The course summarizes this pattern as operating system-level thinking: the parent Agent is a process manager, responsible for launching sub-tasks, checking logs and progress, canceling failed branches, and merging successful results. Merging all intermediate outputs back into the parent context would re-create context bloat; successful implementations also deliberately avoid memory sharing."
 },
 {
  "g": 528,
  "type": "single",
  "q": "What concurrency coordination principle do successful sub-agent implementations cited in the course (such as Cursor's Task system and Claude Code's sub-processes) follow?",
  "opts": [
   "Sub-agents share a memory area and the parent Agent coordinates via locking for reads and writes",
   "Each sub-agent works in an independent sandbox, outputting to a clear file path, with the parent Agent coordinating via file status polling",
   "The parent Agent fires and forgets, collecting results all at once only after all sub-tasks finish",
   "Sub-agents directly communicate to negotiate task boundaries; the parent Agent only handles final acceptance"
  ],
  "ans": 1,
  "exp": "These implementations follow the same principle: each sub-agent works in an independent sandbox, outputs to a clear file path, and the parent Agent coordinates by polling file status — no memory sharing, which greatly simplifies concurrency control. The course also emphasizes that parallelism must be explicit and inspectable; fire-and-forget is explicitly something to be avoided."
 },
 {
  "g": 529,
  "type": "single",
  "q": "In MCE's context function c = F(x; ρ), what do ρ and F each represent?",
  "opts": [
   "ρ is the model weights, F is the decoding strategy",
   "ρ is the raw user input, F is the post-processing rules at the output stage",
   "ρ is dynamically retrieved fragments, F is a fixed immutable template rendering function",
   "ρ is static components (Prompts, knowledge bases, code bases), F is dynamic operators (search, selection, filtering, formatting)"
  ],
  "ans": 3,
  "exp": "An MCE Skill defines the context function c = F(x; ρ): ρ is the static components, containing Prompts, knowledge bases, and code bases; F is the dynamic operators, containing search, selection, filtering, and formatting. This decomposition is the formal basis for MCE separating mechanism from content and performing dual-layer optimization."
 },
 {
  "g": 530,
  "type": "single",
  "q": "When Meta-Harness lets the coding agent use the vast execution history, what approach does it take?",
  "opts": [
   "Compress all history into a summary and inject it into the Prompt all at once",
   "Store execution history in the file system, with the coding agent using grep and cat to read on demand",
   "Build a vector database for semantic retrieval, automatically recalling the top-k fragments each round",
   "Keep only the most recent execution result, directly discarding all earlier history"
  ],
  "ans": 1,
  "exp": "Meta-Harness stores execution history in the file system, with the coding agent using grep and cat to read on demand, explicitly avoiding cramming everything into the Prompt. Each proposed harness is a dictionary in the file system containing source code, scores, trajectories, and state updates — consistent with the design pattern of using the file system as persistent memory."
 },
 {
  "g": 531,
  "type": "single",
  "q": "Under what conditions does AFlow's MCTS search stop?",
  "opts": [
   "Stop as soon as the first variant better than the initial workflow is found",
   "When the search tree depth reaches a pre-set number of levels",
   "When the top-k average score stabilizes or the computational budget is reached",
   "When no new nodes have been generated for three consecutive rounds"
  ],
  "ans": 2,
  "exp": "AFlow's loop is: initialize the root node, use a soft mix of scores and uniform exploration to select nodes for expansion, have the LLM generate workflow variants, execute and evaluate them, add improvements back to the search tree, and repeat until the top-k average score stabilizes or the computational budget is reached. Stopping at the first improvement wastes the search space, and the course does not set tree depth or empty rounds as stopping conditions."
 },
 {
  "g": 532,
  "type": "single",
  "q": "In the AI Scientist pipeline, what accomplishes quality control in the peer review step?",
  "opts": [
   "Submitting the paper to a real academic conference review system",
   "Introducing LLM-as-judge for quality control",
   "Having Autodata's Verifier role arbitrate across systems",
   "Directly using benchmark scores as a substitute for review conclusions"
  ],
  "ans": 1,
  "exp": "AI Scientist hands the entire research pipeline — proposing research ideas, writing code, running experiments, analyzing results, writing papers, and peer review — to an Agent system, driven by LLMs at each step, with the review stage introducing LLM-as-judge for quality control. The Verifier belongs to Autodata's role system and is unrelated to this pipeline."
 },
 {
  "g": 533,
  "type": "single",
  "q": "What three inputs does STOP's seed improver I₀ accept?",
  "opts": [
   "Training data, loss function, optimizer state",
   "Meta-utility û, validation set, candidate solution pool",
   "Initial solution s, utility function u, black-box language model M",
   "Task description, tool list, historical trajectory"
  ],
  "ans": 2,
  "exp": "The seed improver I₀ accepts the initial solution s, utility function u, and black-box language model M, and returns an improved solution s'. The meta-utility û appears in the recursive update formula I_t = I_{t-1}(û, I_{t-1}; M), measuring the quality of the improver itself — belonging to an outer layer of measurement."
 },
 {
  "g": 534,
  "type": "single",
  "q": "What does Self-Harness's Weakness Mining stage produce?",
  "opts": [
   "Clustered verifier-grounded failure patterns, each record containing the terminal verifier-level cause, causal state of related behaviors, and abstract mechanisms exposed by trajectories",
   "A set of candidate harness source code ranked by score",
   "A newly constructed held-out validation dataset",
   "Patch code generated individually for each failing sample"
  ],
  "ans": 0,
  "exp": "Weakness Mining clusters failing trajectories into verifier-grounded failure patterns. Each failure record needs to include the terminal verifier-level cause, the causal state of related Agent behaviors, and the abstract Agent mechanisms exposed by the trajectories. Proposing candidate edits belongs to the second stage, Harness Proposal; validation is in the third stage."
 },
 {
  "g": 535,
  "type": "single",
  "q": "What is the difference between Self-Harness and STOP in terms of what they improve?",
  "opts": [
   "Self-Harness directly operates on the Agent's runtime orchestration system, including system prompt, tool scheduling strategy, and validation rules",
   "Self-Harness likewise only improves improvers in pure text form, completely consistent with STOP",
   "Self-Harness modifies base model weights while STOP modifies Prompts",
   "Self-Harness requires humans to propose candidate edits each round while STOP is fully automated"
  ],
  "ans": 0,
  "exp": "The course makes an explicit comparison: STOP improves the improver in pure text form, while Self-Harness directly operates on the Agent's runtime orchestration system, covering the system prompt, tool scheduling strategy, validation rules, and so on. Neither modifies model weights; Self-Harness's three-stage loop is also completed autonomously by the Agent."
 },
 {
  "g": 536,
  "type": "single",
  "q": "What strategy does DGM use when selecting parent agents?",
  "opts": [
   "Always selecting the currently highest-performing agent as the parent each round",
   "Completely random sampling from the pool to ensure absolute fairness",
   "Human engineers specify the parent agent each round",
   "Selecting by performance probability, with probability inversely proportional to the number of children the agent already has, to encourage exploration"
  ],
  "ans": 3,
  "exp": "DGM selects parent agents by performance probability, while also making the probability inversely proportional to the number of children, to avoid always breeding around the same high-scoring individual, thereby encouraging exploration. The selected parent agent examines its own benchmark evaluation logs, proposes harness improvements, and mutates into a new agent — only new agents with sufficiently high performance are added back to the pool."
 },
 {
  "g": 537,
  "type": "single",
  "q": "What is Promptbreeder's key innovation?",
  "opts": [
   "Directly computing gradients over Prompt embedding representations and performing gradient descent",
   "The mutation Prompts themselves are also improved through evolution, forming meta-evolution",
   "Introducing human experts to rank each generation of Prompts",
   "Compiling Prompts into code and then handing them to MCTS for tree search"
  ],
  "ans": 1,
  "exp": "Promptbreeder uses rich mutation operations to evolve task-specific Prompts. The key innovation is that the mutation Prompts themselves are also improved through evolution, forming meta-evolution. Another Prompt evolution pioneer, GEPA, takes a different path: first reflecting on the shortcomings of the current Prompt using reflection-based prompting, then producing candidate improvements through evolutionary operators."
 },
 {
  "g": 538,
  "type": "single",
  "q": "Among the three roles in SIA, what is the Feedback-Agent responsible for?",
  "opts": [
   "Proposing new harness designs for subsequent evaluation",
   "Executing specific tasks under the new harness and producing trajectories",
   "Deciding whether to update the harness or the model weights next based on results",
   "Performing safety and compliance review on final outputs"
  ],
  "ans": 2,
  "exp": "SIA puts harness improvement and model parameter updates into the same optimization loop: the Meta-Agent proposes new harness designs, the Task-Specific Agent executes tasks under the new harness, and the Feedback-Agent decides based on results whether to update the harness or the model weights next. The course evaluates this direction as interesting, but training stability and the Goodhart effect remain open challenges."
 },
 {
  "g": 539,
  "type": "single",
  "q": "What does 'long-term success' refer to among the seven challenges?",
  "opts": [
   "Self-improvement systems running too long causing computational costs to spiral out of control",
   "Agents failing to remember project details across days and weeks, leading to inconsistencies",
   "Candidate solutions in the population gradually collapsing into minor variants of the same approach",
   "Current optimization objectives are too short-term; standard sandbox RLVR training rarely captures maintainability, ownership boundaries, migration costs, and backward compatibility"
  ],
  "ans": 3,
  "exp": "The 'long-term success' challenge refers to: coding Agents can complete the task at hand but are not clear enough on how to protect the long-term health of the repository. Standard sandbox RLVR training rarely captures maintainability, ownership boundaries, migration costs, and backward compatibility — Agents that only chase passing tests may bury technical debt like time bombs. Failing to remember details belongs to memory and context degradation; candidate solution collapse belongs to diversity collapse — both are separate challenges."
 },
 {
  "g": 540,
  "type": "single",
  "q": "Regarding the challenge of 'negative results,' what requirement does the course place on research Harnesses?",
  "opts": [
   "Filter out failed trajectories to prevent negative samples from contaminating subsequent learning",
   "Make failed attempts and dead ends easy to store and retrieve",
   "Only allow recording negative conclusions after human confirmation",
   "Use a stronger verifier to automatically convert negative results into usable positive conclusions"
  ],
  "ans": 1,
  "exp": "Scientific literature is heavily biased toward success stories, and LLMs may also be poor at deciding when to abandon hypotheses or honestly report negative results. The course therefore requires research Harnesses to make failed attempts and dead ends easy to store and retrieve — because knowing what doesn't work is just as important as knowing what does. Filtering out failures discards exactly this value."
 },
 {
  "g": 541,
  "type": "multi",
  "q": "Which of the following are among the design elements of AlphaEvolve cited in the course?",
  "opts": [
   "Evolution Prompts are composed of the parent program, evaluation results, instructions, and meta-information",
   "Using MCTS to expand and prune nodes on a search tree composed of candidate programs",
   "Using EVOLVE-BLOCK-START and EVOLVE-BLOCK-END to explicitly mark improvable regions",
   "Instructions and context themselves also participate in co-evolution and are not fixed",
   "Each generation of candidate programs requires human engineer approval before proceeding to the next round"
  ],
  "ans": [0, 2, 3],
  "exp": "AlphaEvolve maintains a pool of candidate programs and uses a frozen LLM to generate code diffs to improve programs: evolution Prompts are composed of the parent program, evaluation results, instructions, and meta-information; improvable regions are explicitly demarcated with EVOLVE-BLOCK markers; the meta-prompt also participates in co-evolution, with ablation experiments proving each component has an independent contribution. MCTS is AFlow's search strategy, and the entire evolution process does not rely on human round-by-round review."
 },
 {
  "g": 542,
  "type": "multi",
  "q": "According to the course's scope of applicability, in which situations is evolutionary search unsuitable for Harness optimization?",
  "opts": [
   "Each evaluation takes hours to obtain results",
   "Fitness can be quantified as a clear numerical metric",
   "Evaluation criteria are ambiguous or subjective, relying mainly on heuristic judgment",
   "Computational budget is limited and human review steps must be retained in the process",
   "Candidate solutions can be automatically evaluated and quickly scored"
  ],
  "ans": [0, 2, 3],
  "exp": "Evolutionary search is suitable for scenarios where candidate solutions can be automatically evaluated and fitness is easy to quantify, such as matrix multiplication acceleration, GPU kernel optimization, algorithm competitions, and data center scheduling. It is unsuitable when evaluation is slow, criteria are ambiguous or subjective, budget is limited, or human review must be inserted — because evolution depends on large quantities of fast and objective evaluation rounds; AlphaEvolve and DGM each require LLM inference plus code execution plus benchmarking per round."
 },
 {
  "g": 543,
  "type": "multi",
  "q": "In Self-Harness's Harness Proposal stage, what inputs does the model receive?",
  "opts": [
   "Editable surface",
   "Failure pattern summary",
   "Gradient information of the base model",
   "History of passing behaviors and previously attempted edits",
   "Complete annotated answers from the held-out dataset"
  ],
  "ans": [0, 1, 3],
  "exp": "Harness Proposal proposes bounded Harness edits based on mined failure patterns. The model receives the editable surface, failure pattern summary, history of passing behaviors, and previously attempted edits, prioritizing addressable repeating error patterns. Gradient information is unrelated to this process; the held-out dataset is reserved for validation in the third stage, and answers are not given to the proposal stage in advance."
 },
 {
  "g": 544,
  "type": "multi",
  "q": "Regarding MCE's engineering implementation, which of the following descriptions match the course content?",
  "opts": [
   "A context function is instantiated as a set of files in a dedicated directory",
   "skill.md serves as a static file storing the most important knowledge for the task",
   "Dynamic files store context data and rollout records",
   "The optimization process runs in a specially customized reinforcement learning training framework",
   "Once a Skill is determined it is fixed, with only the content layer continuing to iterate"
  ],
  "ans": [0, 1, 2],
  "exp": "MCE instantiates the context function as a set of files in a dedicated directory: skill.md is a static file storing the most important knowledge for the task, and dynamic files store context data and rollout records. Both meta-level and base-level optimization run in standard coding environments using common tools like Read, Write, Edit, Bash, Glob, Grep, and TodoWrite. The Skill itself evolves through dual-layer optimization — precisely what distinguishes MCE from ACE."
 },
 {
  "g": 545,
  "type": "multi",
  "q": "Regarding the design pattern of 'file system as persistent memory,' which of the following key points does the course give?",
  "opts": [
   "All work history should be compressed and written into the Prompt all at once to ensure no information is lost",
   "Artifacts such as experiment logs, code diffs, paper summaries, and error tracking records quickly exceed the context window",
   "File read/write is a foundational LLM skill requiring no complex external toolchain, and benefits from improvements in core model capabilities",
   "Good Agents maintain their own scratchpad, to-do lists, and experiment records, managing their workspace like human programmers",
   "The file system is only used for archiving final deliverables; all intermediate state must remain in context"
  ],
  "ans": [1, 2, 3],
  "exp": "Long-running Agents produce large quantities of artifacts such as experiment logs, code diffs, paper summaries, and error tracking records that cannot fit in context, so they go into the file system for on-demand reading and writing. The course also emphasizes that file read/write is a foundational LLM skill — the smarter the model, the more efficient the file management — and good Agents maintain their own scratchpad, to-do lists, and experiment records like human programmers. Compressing all history into the Prompt or only archiving final deliverables both contradict this pattern."
 },
 {
  "g": 546,
  "type": "judge",
  "q": "The course predicts that mature Harness and intelligent models will form a positive feedback loop: better Harness fosters stronger models, and stronger models make it unnecessary to over-engineer Harness.",
  "ans": true,
  "exp": "Correct. This is the third step of the near-term RSI three-step prediction. The first two steps are: models will not directly rewrite their own weights, but can improve training pipelines and deployment systems to make the next generation stronger; and Harness engineering moves toward meta-methodology, with Harness itself becoming an optimization target. Together, the three steps form the continuous improvement flywheel the course describes."
 },
 {
  "g": 547,
  "type": "judge",
  "q": "The Meta-Harness experiment on TerminalBench-2 searched from a blank harness starting from scratch.",
  "ans": false,
  "exp": "Incorrect. The course specifically notes in a figure caption that the TerminalBench-2 experiment was initialized from an already-strong harness. This detail is critical: the reported gains are built on a solid starting point, and readers should not interpret this as the same results being achievable when searching from scratch."
 },
 {
  "g": 548,
  "type": "judge",
  "q": "DGM's experiments raised the score on Polyglot from 14.2% to 30.7%.",
  "ans": true,
  "exp": "Correct. The DGM experiments based on Claude 3.5 Sonnet give two sets of numbers: SWE-bench Verified from 20% to 50%, and Polyglot from 14.2% to 30.7%. The entire process required no human intervention — the Agent autonomously evolved a stronger harness design using only bash plus editor (view / create / edit) as its tool set."
 },
 {
  "g": 549,
  "type": "judge",
  "q": "The course believes that context engineering has already become a core component of intelligence itself, with only engineering implementation remaining.",
  "ans": false,
  "exp": "Incorrect. The course's judgment is precisely the opposite: current context engineering is mostly still at the software systems layer, and it should become a core part of intelligence itself. Memory needs grow explosively with Agent autonomy, and an Agent that cannot manage its own memory cannot complete complex research tasks spanning days and weeks — this challenge remains unsolved."
 },
 {
  "g": 550,
  "type": "judge",
  "q": "In a pure loop architecture with no file system offloading, the Agent starts losing early information due to context overflow from around round 4.",
  "ans": true,
  "exp": "Correct. The three-architecture comparison in the course concludes that the pure loop mode starts losing information from round 4: all tool returns and historical trajectories are crammed into context, the window fills up quickly, and the Agent forgets early information with output quality plummeting. After adding a file system, each completed round writes to file to free up context, and the next round reads only the needed fragments — context usage can remain stable over the long term."
 }
];

window.EXAM_TOPICS_PART = {
 "501": {"name": "RSI core path", "file": "11-1.html"},
 "502": {"name": "Definition of Harness", "file": "11-1.html"},
 "503": {"name": "Workflow automation pattern", "file": "11-2.html"},
 "504": {"name": "Context vs. file division", "file": "11-2.html"},
 "505": {"name": "ACE three-component collaboration", "file": "11-3.html"},
 "506": {"name": "ACE incremental update design", "file": "11-3.html"},
 "507": {"name": "MCE dual-layer optimization", "file": "11-3.html"},
 "508": {"name": "Meta-Harness optimization target", "file": "11-3.html"},
 "509": {"name": "AFlow tree search", "file": "11-4.html"},
 "510": {"name": "Autodata difficulty signal", "file": "11-4.html"},
 "511": {"name": "STOP recursive improver", "file": "11-5.html"},
 "512": {"name": "Self-Harness validation", "file": "11-5.html"},
 "513": {"name": "DGM self-evolution", "file": "11-6.html"},
 "514": {"name": "Reward hacking defense", "file": "11-7.html"},
 "515": {"name": "Three Harness patterns", "file": "11-2.html"},
 "516": {"name": "ADAS meta-search mechanism", "file": "11-4.html"},
 "517": {"name": "Evolutionary search fit conditions", "file": "11-6.html"},
 "518": {"name": "Seven challenges list", "file": "11-7.html"},
 "519": {"name": "Automated research failure modes", "file": "11-7.html"},
 "520": {"name": "Value of Harness layer", "file": "11-1.html"},
 "521": {"name": "Context bloat risk", "file": "11-3.html"},
 "522": {"name": "STOP base model threshold", "file": "11-5.html"},
 "523": {"name": "SIA joint optimization risk", "file": "11-6.html"},
 "524": {"name": "Human role positioning", "file": "11-7.html"},
 "525": {"name": "Five-level optimization ladder", "file": "11-3.html"},
 "526": {"name": "Prompt engineering analogy", "file": "11-1.html"},
 "527": {"name": "Parent Agent process management", "file": "11-2.html"},
 "528": {"name": "Sub-agent concurrency coordination", "file": "11-2.html"},
 "529": {"name": "MCE context function", "file": "11-3.html"},
 "530": {"name": "Meta-Harness history access", "file": "11-3.html"},
 "531": {"name": "AFlow search stopping condition", "file": "11-4.html"},
 "532": {"name": "AI Scientist review stage", "file": "11-4.html"},
 "533": {"name": "STOP seed improver inputs", "file": "11-5.html"},
 "534": {"name": "Weakness Mining output", "file": "11-5.html"},
 "535": {"name": "Self-Harness improvement target", "file": "11-5.html"},
 "536": {"name": "DGM parent selection strategy", "file": "11-6.html"},
 "537": {"name": "Promptbreeder meta-evolution", "file": "11-6.html"},
 "538": {"name": "SIA role division", "file": "11-6.html"},
 "539": {"name": "Long-term success challenge", "file": "11-7.html"},
 "540": {"name": "Negative result storage requirement", "file": "11-7.html"},
 "541": {"name": "AlphaEvolve design elements", "file": "11-6.html"},
 "542": {"name": "Evolutionary search inapplicable scenarios", "file": "11-6.html"},
 "543": {"name": "Harness Proposal inputs", "file": "11-5.html"},
 "544": {"name": "MCE engineering implementation", "file": "11-3.html"},
 "545": {"name": "File system memory key points", "file": "11-2.html"},
 "546": {"name": "Harness positive feedback loop", "file": "11-1.html"},
 "547": {"name": "Meta-Harness experiment starting point", "file": "11-3.html"},
 "548": {"name": "DGM experiment numbers", "file": "11-6.html"},
 "549": {"name": "Context engineering positioning", "file": "11-7.html"},
 "550": {"name": "Pure loop architecture failure point", "file": "11-2.html"}
};
