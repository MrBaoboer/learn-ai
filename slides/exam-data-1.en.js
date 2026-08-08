/* Chapter 1 Question Bank · How Large Language Models Are Made (24 questions: 14 single-choice / 5 multiple-choice / 5 true-or-false)
   g = topic group number (this chapter uses 101–124), exp = answer explanation */
window.EXAM_BANK = [
 {
  "g": 101,
  "type": "single",
  "q": "In the large model training pipeline, what problem does the SFT (Supervised Fine-Tuning) stage primarily solve?",
  "opts": [
   "Injecting more world knowledge into the model to expand coverage and compensate for gaps in pre-training data",
   "Teaching the model to respond as an assistant in a dialogue format — shifting from text completion to question answering",
   "Adjusting the model's values through large-scale human feedback scoring to make outputs safer and more compliant",
   "Compressing the model's parameter count to reduce compute consumption and response latency per inference"
  ],
  "ans": 1,
  "exp": "SFT continues training the model on large volumes of 'formatted dialogue + high-quality answers', which is still Token prediction at its core — just with different data. The model learns to produce proper responses after the <|im_start|>assistant token, rather than continuing text in the style of the training corpus. World knowledge primarily comes from the pre-training stage; SFT solves the 'learning to converse' problem."
 },
 {
  "g": 102,
  "type": "single",
  "q": "If you send 'Who is Zixia Fairy? (紫霞仙子, a beloved character from the 1995 Hong Kong film A Chinese Odyssey)' directly to a Base model that has not undergone SFT, what is the most likely result?",
  "opts": [
   "It gives a well-structured character introduction as an assistant, including the character's origin and actor",
   "It continues in the style of the training data, producing dialogue-like text — completely failing to answer the question",
   "It politely declines and notes that it is merely a text completion model",
   "It outputs a format error, because a Base model cannot process question-type inputs"
  ],
  "ans": 1,
  "exp": "A Base model does only one thing: given prior text, predict the most likely next Token. In the course demo, it continues with lines like 'Zixia Fairy is my elder brother, brother do you like me…' in the style of the training corpus. Knowing 'what an answer looks like' and responding as an assistant is a capability that only emerges after SFT."
 },
 {
  "g": 103,
  "type": "single",
  "q": "What is the purpose of special tokens such as <|im_start|> and <|im_end|> in a Chat Template?",
  "opts": [
   "They mark the role and boundary of each message, concatenating system, user, and assistant turns into a single piece of text awaiting completion",
   "They encrypt and obfuscate message content to prevent prompt injection attacks",
   "They trigger the model's built-in dialogue mode switch, routing it to a chat-specific inference channel",
   "They compress-encode message content to reduce the Token count charged against the context window"
  ],
  "ans": 0,
  "exp": "Chat Templates, inspired by the Jinja templating language, use special tokens to wrap each message and mark role and boundaries, then concatenate system, user, and assistant turns into a single continuous text fed to the model. Combined with SFT training, the model learns to begin its response after the assistant marker. These tokens have no encryption, compression, or inference-channel-switching functions."
 },
 {
  "g": 104,
  "type": "single",
  "q": "Even though it's a conversational product, why is OpenAI's API path called /chat/completions (completion)?",
  "opts": [
   "It is a naming mistake left over from an early version, and the new API has completely deprecated it",
   "The model concatenates all messages into a single block of text and generates from the end — conversation is fundamentally completion",
   "The endpoint simultaneously supports two independent feature modules: chat and code completion",
   "To differentiate its endpoint naming from Anthropic's /v1/messages in the market"
  ],
  "ans": 1,
  "exp": "OpenAI's implicit logic: the essence of a large model is completion — give it some text, and it continues writing. Every message you send is concatenated into a block, and the model predicts Tokens starting after the [assistant] marker until a stop token. 'Chat' is a shell humans added for convenience; this name reflects an understanding of the underlying nature."
 },
 {
  "g": 105,
  "type": "single",
  "q": "How did OpenAI originally make a Base model that only knew how to do completion behave like a chatbot?",
  "opts": [
   "By attaching an independent dialogue management module that specialized in understanding user intent",
   "By constructing a 'fake chat transcript' with the assistant's turn left blank, letting the model continue from the blank",
   "By redesigning the model architecture to turn unidirectional generation into bidirectional understanding plus generation",
   "By pre-writing a standard answer library for common questions and returning answers directly on a match"
  ],
  "ans": 1,
  "exp": "This is the 'fake chat transcript' experiment: concatenate a piece of text ending with 'Assistant:' (left blank) and feed it to the Base model. It starts completing from the end, and what it completes is exactly the assistant's response. When the user says something new, the previous response and new question are re-concatenated into a longer pending-completion text and sent again. No architectural changes to the model at all."
 },
 {
  "g": 106,
  "type": "single",
  "q": "Regarding large model training and inference, which statement is correct?",
  "opts": [
   "Each user conversation slightly updates the model's parameters, making the model smarter over time",
   "Training is a one-time large-scale investment; parameters are completely frozen during inference and billing is per Token",
   "Training and inference consume the same amount of compute; the only difference is the data source",
   "During inference, the model writes new knowledge from the conversation into its parameters for use in future conversations"
  ],
  "ans": 1,
  "exp": "Training adjusts tens of billions of parameters on massive data — requiring thousands to tens of thousands of GPUs, taking weeks to months, costing hundreds of millions of dollars — and it is a one-time investment. Inference uses fixed parameters to generate responses to inputs; parameters are completely unchanged per conversation, requiring 1 to a few GPUs, and billed per Token. Conversational content is never written into parameters."
 },
 {
  "g": 107,
  "type": "single",
  "q": "The course uses a 'two books' metaphor for a model's two types of information sources. Which mapping is correct?",
  "opts": [
   "Model parameters are dynamic knowledge that can be updated in real time during inference; the context window is static reference material that is sealed and unchanged",
   "Model parameters are compressed knowledge written during training and read-only during inference; the context window is precise information dynamically injected during conversation",
   "Both are read-only during inference; the only difference is their capacity",
   "The context window stores the model's long-term memory; model parameters store the current conversation content"
  ],
  "ans": 1,
  "exp": "Model parameters are like an 'encyclopedia that is sealed once written': written during training, read-only during inference, with a knowledge cutoff date — knowledge is stored in compressed form, imprecise and cannot be updated. The context window is like 'reference materials placed on the desk': dynamically injected during conversation, precise and trustworthy, containing system prompts, documents, and the current conversation history. A and D have the roles exactly backwards."
 },
 {
  "g": 108,
  "type": "single",
  "q": "After PreTraining, why is it enough to write a prompt to switch tasks — without retraining the model?",
  "opts": [
   "The model instantly learns the new knowledge in the prompt and writes it into its parameters",
   "The prompt triggers a corresponding pre-configured task plugin inside the model, which outputs according to plugin logic",
   "The model predicts subsequent text from prior text; a large context window can hold task descriptions, rules, and examples — high-quality prior text produces high-quality subsequent text",
   "The prompt temporarily adjusts some of the model's weights, equivalent to a small-scale fine-tuning"
  ],
  "ans": 2,
  "exp": "The inference chain: the model's mechanism is Token-by-Token prediction; the prompt is high-quality prior text — good prior text leads to good subsequent text. The larger the window, the more instructions, rules, and examples can fit. Pack the task description entirely into the prior text, and the model predicts accordingly, with results equivalent to dedicated training. No weights are modified throughout this process, and there is no plugin mechanism."
 },
 {
  "g": 109,
  "type": "single",
  "q": "Where and how exactly does the Temperature parameter operate during the generation process?",
  "opts": [
   "It proportionally scales logits before softmax — lower T makes the distribution sharper; higher T makes it flatter",
   "It filters the complete response by quality after generation — at low temperature, low-quality sentences are automatically discarded",
   "It directly controls the number of candidate words for sampling — lower temperature means fewer words enter the candidate set",
   "It adjusts the activation intensity of model parameters — at low temperature, only high-confidence neurons are activated"
  ],
  "ans": 0,
  "exp": "At each Token prediction step, the model first computes logits for candidate words, then applies softmax to get a probability distribution. Temperature proportionally scales logits before softmax: lower T amplifies differences, making the distribution sharper and nearly locking in the highest-probability word; higher T flattens the distribution, giving lower-probability words a chance to be selected. Controlling the candidate word range is the job of Top-P."
 },
 {
  "g": 110,
  "type": "single",
  "q": "A legal compliance review assistant is integrating a large model API. What sampling parameter configuration is most appropriate?",
  "opts": [
   "T=1.2, Top-P=1.0 — let the model diverge freely to cover more possible legal viewpoints",
   "T=0.7, Top-P=0.95 — balance accuracy with natural fluency",
   "T=0.1, Top-P=0.8 — low temperature plus narrow candidates for stable, predictable output",
   "Parameter configuration doesn't matter — as long as RAG is integrated, any settings can guarantee accuracy"
  ],
  "ans": 2,
  "exp": "Course scenario recommendations: legal/compliance/customer-service T=0.1, Top-P=0.8; report summaries T=0.3, Top-P=0.9; general conversation T=0.7, Top-P=0.95; creative writing T=1.2, Top-P=1.0. Scenarios with high factual-accuracy requirements call for consistently low temperature throughout. But low temperature only controls randomness — RAG and human review are still needed. Option D treats RAG as a universal safeguard, which is incorrect."
 },
 {
  "g": 111,
  "type": "single",
  "q": "The model calls a parameter combination in the generated code that doesn't exist in pandas at all. What type of hallucination is this?",
  "opts": [
   "Factual hallucination",
   "Source hallucination",
   "Reasoning hallucination",
   "Code hallucination"
  ],
  "ans": 3,
  "exp": "The course classifies hallucinations into four types: factual hallucinations fabricate facts and data that don't exist; source hallucinations cite non-existent papers, links, or authors; reasoning hallucinations have correct premises but flawed reasoning steps; code hallucinations call non-existent APIs or functions. The code looks real, but the API has no such usage — this is a textbook example of code hallucination."
 },
 {
  "g": 112,
  "type": "single",
  "q": "What was GPT's key leap forward compared to CNN, RNN, and BERT?",
  "opts": [
   "Parameters exceeded the billion scale for the first time, achieving overwhelming performance through sheer compute",
   "It used massive corpora for pre-training first, so the capabilities from one training run could transfer to any task",
   "It pioneered bidirectional attention, able to see the full context on both sides simultaneously",
   "It introduced a sliding window mechanism that could capture longer-range word relationships than before"
  ],
  "ans": 1,
  "exp": "Previous models first determined the task and then trained — switching tasks meant switching models. GPT reversed this: it pre-trained on almost all internet text using Token prediction, so grammar, common sense, and logic became by-products of predicting the next word, with capabilities transferable to any task. This is the core idea of Foundation Models. Option C describes BERT's characteristic, but BERT's pre-training objective is fill-in-the-blank, which is not good at generation. Option D describes CNN's mechanism."
 },
 {
  "g": 113,
  "type": "single",
  "q": "Regarding Tokens and tokenization, which statement is correct?",
  "opts": [
   "Tokens correspond strictly one-to-one with Chinese characters — one character always takes exactly one Token",
   "Tokenization splits continuous text into the basic units a model can process; each Chinese character corresponds to roughly 1 to 2 Tokens",
   "Tokenization only happens during training; at inference time the model reads raw text characters directly",
   "The larger the vocabulary, the greater the model's knowledge — the two are strictly proportional"
  ],
  "ans": 1,
  "exp": "Tokenization is the first step in text processing: splitting continuous text into basic units called Tokens. Tokens and characters are not equivalent — each Chinese character corresponds to roughly 1 to 2 Tokens, and each English word to roughly 1 Token. Both training and inference require tokenization first. The vocabulary determines granularity; knowledge quantity mainly depends on training data scale and parameter count."
 },
 {
  "g": 114,
  "type": "single",
  "q": "According to the course, what is the most critical cost optimization for a production-grade RAG system?",
  "opts": [
   "Splitting knowledge base documents into the smallest possible chunks to reduce the Token count injected into context each time",
   "Performing intent recognition first to determine whether retrieval is needed — about 70% of conversations don't require the RAG pipeline at all",
   "Switching entirely to smaller models to answer questions and completely avoiding the cost of flagship model calls",
   "Raising the vector similarity threshold so that each retrieval returns the minimum number of documents"
  ],
  "ans": 1,
  "exp": "The course explicitly points out that the most critical optimization is first judging whether the question requires RAG: about 70% of conversations don't need to retrieve documents — answering directly with the LLM is faster and cheaper. The core of production-grade RAG is thinking clearly about 'when not to use RAG'. Chunking also requires semantic completeness; cutting too fine actually loses context, making option A's direction incorrect."
 },
 {
  "g": 115,
  "type": "multi",
  "q": "Regarding Prompt constraint instructions like 'say you don't know if you are unsure', which statements are correct?",
  "opts": [
   "The constraint words become part of the context, raising the probability of the 'admitting uncertainty' sequence — essentially intervening in the probability distribution",
   "Constraints are effective when the model has some degree of uncertainty; they work well for questions beyond its knowledge or with time-sensitive content",
   "When the model is highly confident in an incorrect answer, that wrong answer is the top candidate token and constraint words cannot intervene",
   "Constraint instructions temporarily modify model weights during the conversation, permanently teaching the model to be cautious",
   "As long as constraint clauses are written strictly and comprehensively enough, the model can be completely prevented from fabricating content"
  ],
  "ans": [0, 1, 2],
  "exp": "The essence of constraint instructions is using carefully designed prior text to directionally intervene in the posterior probability distribution, raising the probability of the 'I'm not sure' sequence. The prerequisite is that the model itself has some uncertainty. When there are systematic errors in the training data and the model answers incorrectly with high confidence, the constraints fail. They do not modify any weights, and cannot completely prevent fabrication — high-risk domains still require RAG or human review."
 },
 {
  "g": 116,
  "type": "multi",
  "q": "In an 'evaluation + human review' solution, which stages does a PM need to design?",
  "opts": [
   "Before launch, test the model with a batch of questions with known correct answers, quantify the hallucination rate, and set an acceptance threshold",
   "After launch, automatically route by risk level — high-risk content goes through human review before being sent to users",
   "Collect hallucination cases discovered during review as Bad Cases to feed back into model optimization and Prompt tuning",
   "Schedule a full model retraining weekly, writing the week's review conclusions directly into model parameters",
   "Fix Temperature at 0 and use sampling parameter configuration to replace the entire human review stage"
  ],
  "ans": [0, 1, 2],
  "exp": "The course outlines three stages: build a hallucination test set before launch to establish an evaluation baseline; implement tiered review after launch with human oversight for high-risk content; establish an error feedback loop for ongoing optimization. Full retraining is extremely costly and completely unnecessary; low temperature just makes outputs more consistent — it cannot replace human review as an external error-correction layer."
 },
 {
  "g": 117,
  "type": "multi",
  "q": "Regarding large model training data, which statements are correct?",
  "opts": [
   "Pre-training corpora for large models can reach approximately 15T Tokens in scale",
   "The quality and diversity of training data determines the upper bound of the model's world knowledge",
   "Small-parameter models facing questions beyond their capabilities are more prone to severe hallucinations",
   "Training corpora are stored word-for-word in parameters in their original form and can be precisely retrieved during inference",
   "New content generated in user conversations is supplemented into training data in real time and synchronously updates model parameters"
  ],
  "ans": [0, 1, 2],
  "exp": "Small models train on roughly 1B to 2B Tokens; large models reach approximately 15T or even 20T+. What a model has read is what it can speak about; data quality and diversity determine the upper bound of world knowledge. In the course demo, a 270M small model showed severe hallucinations when introducing people. Parameters store compressed statistical patterns — original text cannot be precisely retrieved; conversations also do not enter training data in real time."
 },
 {
  "g": 118,
  "type": "multi",
  "q": "Regarding the additional costs of RAG and optimization strategies, which statements are correct?",
  "opts": [
   "Each query requires injecting approximately 500 to 2000 Tokens of document fragments, significantly increasing LLM costs",
   "Document vectorization is a one-time cost at ingestion — once done, it can be reused continuously",
   "Semantic caching lets highly similar questions reuse the same retrieval results, bypassing the entire RAG pipeline",
   "The smaller the document chunks, the more precise the retrieval — best practice is to cut by single sentences or even phrases",
   "The vector retrieval step consumes no compute resources at all — its cost is negligible at any scale"
  ],
  "ans": [0, 1, 2],
  "exp": "RAG's main cost is the larger Prompt: injecting 500 to 2000 Tokens per query can double LLM costs. Document vectorization is a one-time run at ingestion that can be reused; semantic caching directly returns cached results when question vector similarity reaches the threshold. Best practice for chunking is approximately 512 to 800 Tokens per chunk while preserving semantic integrity — cutting too small loses context. Vector retrieval has significant latency at large-scale knowledge bases and is not negligible."
 },
 {
  "g": 119,
  "type": "multi",
  "q": "According to the course's decision framework, which 'problem type → solution' pairings are correct?",
  "opts": [
   "Unsatisfactory output format, style, or tone — prioritize Prompt Engineering",
   "Needing a private knowledge base, real-time data, or content beyond the knowledge cutoff — choose RAG",
   "High-risk output scenarios like medical or legal — HITL human review is required as a safety net",
   "Model answered a question incorrectly — first choice is to retrain the model to fix the error at the parameter level",
   "To make the model output smarter — just set Temperature to the highest level"
  ],
  "ans": [0, 1, 2],
  "exp": "Decision framework: if the knowledge is in the training data and it's only a format or style issue, a Prompt is sufficient; private knowledge and time-sensitive content require RAG injection; high-risk, compliance-heavy scenarios must have HITL human oversight. Retraining costs 100× more than trying a Prompt first — it is usually the last resort. Raising Temperature only increases randomness and has nothing to do with intelligence."
 },
 {
  "g": 120,
  "type": "judge",
  "q": "Telling the model 'your name is Xiao Ming' in a conversation does not modify any of its parameters. If you start a new conversation tomorrow, it won't remember, because this information only exists in the context window.",
  "ans": true,
  "exp": "Correct. Parameters are completely frozen during inference — what you say to the AI doesn't modify any weights. Conversational content only enters the context window, which serves as working memory. When a new conversation starts, the context is cleared and the information naturally disappears. This is the meaning of 'conversation is not learning'."
 },
 {
  "g": 121,
  "type": "judge",
  "q": "The main purpose of SFT (Supervised Fine-Tuning) is to inject new world knowledge into the model to compensate for gaps in pre-training data.",
  "ans": false,
  "exp": "Incorrect. SFT is still Token prediction at its core — just the training data is changed to 'formatted dialogue + high-quality answers'. What the model learns is how to respond as an assistant in Chat Template format, shifting from continuing training corpus to answering questions. World knowledge is primarily written into parameters during pre-training; SFT solves the conversational capability problem."
 },
 {
  "g": 122,
  "type": "judge",
  "q": "For events that occurred after the model's knowledge cutoff date, setting Temperature to 0 can make the model give accurate answers.",
  "ans": false,
  "exp": "Incorrect. Temperature only affects the randomness of sampling at each step — it cannot inject knowledge the model doesn't have. Things the model doesn't know, it will still fabricate at low temperature, just more consistently and stably. Content beyond the knowledge cutoff requires techniques like RAG to inject accurate information into the context."
 },
 {
  "g": 123,
  "type": "judge",
  "q": "All large models have hallucinations. A PM's goal is to keep the hallucination rate within a business-acceptable threshold and write it into the PRD as an acceptance criterion, just like a performance metric.",
  "ans": true,
  "exp": "Correct. Hallucinations are an inevitable product of probabilistic prediction — completely eliminating them is unrealistic. The course recommends making 'hallucination rate < 3%' a quantifiable acceptance criterion just like 'load time < 2s'. In high-risk scenarios like medical, legal, and financial, AI should only produce a first draft — final confirmation must have a human sign off."
 },
 {
  "g": 124,
  "type": "judge",
  "q": "When RAG retrieval returns incorrect document fragments, the model treats them as authentic evidence when answering — and the hallucination is now dressed up with an authoritative source.",
  "ans": true,
  "exp": "Correct. The quality ceiling of RAG equals the quality of the knowledge base: when retrieval goes wrong, responses generated based on incorrect documents carry the illusion of being 'well-sourced', making them harder for users to identify than pure hallucinations. This is why retrieval hit-rate evaluation must be established, and citing sources must be enforced so users can verify."
 },

 /* The following questions are merged from the A/B variant technical section of the AI Usage Qualification Exam; A/B variants for the same topic share a g value */
 {
  "g": 125,
  "type": "single",
  "q": "What is the core mechanism by which a large language model (LLM) generates a response?",
  "opts": [
   "It retrieves the most similar historical answer from a built-in training database and returns it verbatim",
   "Based on a probability distribution, it predicts and generates the next Token (word piece) one by one",
   "It queries the internet through a built-in real-time search engine and summarizes the results",
   "It matches user input to a pre-written fixed answer template and outputs the result"
  ],
  "ans": 1,
  "exp": "The essence of a large model is 'next Token prediction': given the existing context, it calculates the probability of every Token in the vocabulary appearing next, outputs one, appends it back to the context, and continues predicting — looping until generation ends. There is no 'answer database' inside the model to search, it doesn't query the internet in real time, and it doesn't use fixed templates."
 },
 {
  "g": 126,
  "type": "single",
  "q": "What is the fundamental cause of 'hallucinations' in large models?",
  "opts": [
   "The model's parameter count is insufficient, leaving its knowledge base unable to cover the niche domain in the question",
   "The user's question is not clear enough, causing the model to misunderstand",
   "The model generates content based on probabilistic prediction, and when knowledge is missing it still stitches together a seemingly reasonable answer",
   "The model's Temperature parameter is set too high, making output too random"
  ],
  "ans": 2,
  "exp": "The root cause of hallucinations lies in the generation mechanism itself: the model continues writing 'the most human-sounding content' by probability and does not fact-check. When the training data lacks the corresponding knowledge, it will still produce a grammatically fluent, seemingly reasonable answer. Increasing parameter size, refining questions, or lowering Temperature can only alleviate symptoms — none of them changes the root cause of probabilistic continuation."
 },
 {
  "g": 127,
  "type": "single",
  "q": "What is the core function of RAG (Retrieval-Augmented Generation)?",
  "opts": [
   "It completely replaces the large model with a retrieval system to generate answers, eliminating hallucinations at the root",
   "It injects retrieved external knowledge into the context before generation, letting the model generate answers based on facts",
   "It incrementally retrains the large model to write the latest knowledge into model weights",
   "It automatically detects and filters erroneous information in model responses at the output stage"
  ],
  "ans": 1,
  "exp": "RAG's approach is 'retrieve first, then generate': before answering, retrieve relevant material from an external knowledge base, inject it into the Prompt as reference context, and let the model answer based on the given facts. It doesn't modify model weights (that's fine-tuning/retraining), it's not an output-stage filter, and it can't completely eliminate hallucinations."
 },
 {
  "g": 128,
  "type": "single",
  "q": "After using RAG, can hallucinations in large models be completely eliminated?",
  "opts": [
   "Yes — the knowledge injected by RAG can completely replace the model's own judgment",
   "Yes — as long as the knowledge base is comprehensive enough and the retrieval algorithm is precise enough",
   "No — if no relevant information is retrieved, the model can still produce hallucinations",
   "No — injecting external material actually interferes with the model's existing knowledge"
  ],
  "ans": 2,
  "exp": "Hallucinations cannot be completely eliminated. RAG only significantly reduces the probability of hallucinations: when retrieval hits, the model has facts to rely on; once retrieval fails, the model returns to 'fabricating by probability'. The model may also misread or ignore the retrieved results. So hallucinations cannot be zeroed out. Note that option D's reasoning is wrong — injecting relevant material generally helps, not hinders."
 },
 {
  "g": 129,
  "type": "single",
  "q": "When Temperature is set low (close to 0), what characteristics does model output have?",
  "opts": [
   "Output becomes more random, diverse, and creative",
   "Output is more stable and consistent, biased toward high-probability answers",
   "The model refuses to respond due to abnormal parameters",
   "The model's inference speed slows noticeably, increasing response latency"
  ],
  "ans": 1,
  "exp": "Temperature controls sampling randomness: lowering it makes the probability distribution 'sharper' — the model almost always selects the highest-probability Token, producing stable and reproducible output, suitable for fact Q&A and other serious scenarios. Randomness and diversity are what higher Temperature produces. Lowering temperature doesn't make the model refuse to answer, nor does it mean quality declines."
 },
 {
  "g": 130,
  "type": "single",
  "q": "What is the principle behind 'Prompt Engineering' being able to guide model output?",
  "opts": [
   "It temporarily fine-tunes the model's internal weights during each conversation, thereby changing the output direction",
   "It exploits the model's inability to distinguish truth from fiction — role-setting and scene construction guide the output",
   "It pre-plants a fixed response rule set inside the model, outputting according to established rules upon matching a trigger word",
   "It gains higher privileges through underlying encrypted instructions, forcing the model to comply"
  ],
  "ans": 1,
  "exp": "The model has no fixed persona and cannot verify the truth of settings in the Prompt. Role-setting and scene construction change the context, which changes the probability distribution of subsequent Tokens — output naturally 'plays along' with the setting. Prompts don't modify model weights; the model has no trigger rule set or so-called encrypted privilege instructions inside it."
 },
 {
  "g": 131,
  "type": "single",
  "q": "What is the correct statement about the relationship between hallucinations and creativity in large models?",
  "opts": [
   "Hallucinations are purely erroneous output caused by insufficient training data and have no positive value for any use case",
   "Both hallucinations and creativity stem from probabilistic continuation — in contexts that don't rely entirely on factual statements, hallucinations can also become a source of creativity",
   "Hallucinations only have value in literary creation scenarios like poetry and fiction; they are universally harmful in all other scenarios",
   "As long as the hallucination rate is reduced to below 5% through engineering measures, it can be completely ignored"
  ],
  "ans": 1,
  "exp": "Hallucinations and creativity are two sides of the same coin, both arising from the 'free improvisation' of probabilistic continuation. In scenarios like writing stories, brainstorming, and naming — where factual accuracy isn't required — this 'fabrication' is exactly creativity. It only becomes a defect to control in factual Q&A scenarios. Option C limits the scope too narrowly to literature; option D's view that reducing below a threshold means it can be ignored is too absolute."
 },
 {
  "g": 132,
  "type": "single",
  "q": "What is the most foundational mechanism at the bottom of the large model technology stack?",
  "opts": [
   "RAG retrieval augmentation for knowledge injection",
   "The planning-execution loop of Agent intelligent systems",
   "Probabilistic continuation via Token-by-Token prediction",
   "A hierarchically designed Prompt engineering template and invocation specification system"
  ],
  "ans": 2,
  "exp": "The technology stack from bottom to top: the lowest layer is Token-by-Token probabilistic continuation; above that is dialogue templates and Prompt engineering; then RAG and tool calls; the top layer is Agent. RAG and Agent are engineering wrappers built on top of probabilistic continuation — they don't replace it."
 },
 {
  "g": 133,
  "type": "multi",
  "q": "Which of the following are effective means of reducing hallucinations in large models?",
  "opts": [
   "Injecting external knowledge through RAG to provide factual grounding",
   "Requiring the model to 'only answer based on provided materials' in the Prompt",
   "Through alignment training, teaching the model to say 'I don't know' when uncertain",
   "Having all questions answered by humans instead and completely stopping AI use"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "The first three options address hallucination mitigation from three levels respectively: knowledge injection (RAG), behavioral constraints (Prompt restricting answers to provided material), and model training (alignment to produce 'I don't know' behavior). They are commonly used in combination in practice. 'Completely stopping AI use' is avoiding the problem, not a means of reducing hallucinations."
 },
 {
  "g": 134,
  "type": "multi",
  "q": "Which of the following statements about large models are correct?",
  "opts": [
   "Large models are essentially probability-based 'chain completion'",
   "Large models have no fixed persona — role-setting in Prompts affects output",
   "Large models can actively access the internet without any tools to get real-time information",
   "The 'search capability' of large models is implemented by developers through tool calls"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "The three correct ones: the essence is probabilistic chain completion; no fixed persona (role-setting changes context and thereby affects output); search is implemented through tool calls. 'Can actively go online without tools' is incorrect — and it directly contradicts 'search relies on tool calls', so the two cannot both be true."
 },
 {
  "g": 135,
  "type": "multi",
  "q": "Which steps are included in the complete RAG workflow?",
  "opts": [
   "After the user asks a question, the system executes retrieval to obtain reference material",
   "The reference material is prepended to the Prompt as context",
   "The large model generates a response based on the reference material",
   "Generated results are automatically written back to the knowledge base for continuous updates"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "RAG's three steps correspond exactly to its name: Retrieval → Augmented (material inserted into Prompt) → Generation. Generated results are not automatically written back to the knowledge base. Knowledge base updates are a separate maintenance process; automatically feeding model output back would contaminate the knowledge base with hallucinations."
 },
 {
  "g": 136,
  "type": "judge",
  "q": "Hallucinations in large models are an inherent characteristic of probabilistic continuation — any model of any scale can produce hallucinations when knowledge is missing.",
  "ans": true,
  "exp": "Correct. Hallucinations are an inherent byproduct of the probabilistic generation mechanism, unrelated to model scale. Even the largest model will 'confidently fabricate' when encountering a knowledge gap. RAG, alignment training, and similar techniques can only mitigate — not eliminate — hallucinations."
 },
 {
  "g": 137,
  "type": "judge",
  "q": "RAG can significantly reduce the hallucination rate by injecting external knowledge, but if no relevant information can be retrieved, the model may still produce hallucinations.",
  "ans": true,
  "exp": "Correct. This is exactly RAG's value and its boundary: when retrieval hits, the model has facts to rely on and the hallucination rate drops significantly; when retrieval misses or quality is poor, the model returns to fabricating by probability."
 },

 /* B-variant questions for the same topics (g values shared with A-variant above) */
 {
  "g": 125,
  "type": "single",
  "q": "Which of the following most accurately describes how a large language model works?",
  "opts": [
   "The model retrieves the best-matching answer from a built-in large-scale Q&A database and returns it verbatim",
   "The model incrementally predicts the next most likely Token (word piece), continuing to generate in a loop until done",
   "The model queries the internet in real time through a built-in search engine and aggregates the results",
   "The model first translates the user's input into executable code, runs it, and returns the result"
  ],
  "ans": 1,
  "exp": "A large model works by 'probabilistic continuation': it predicts the next most likely Token based on context, appends the output back to the context, and keeps predicting in a loop until done. There is no Q&A database inside to search, no built-in search engine, and it doesn't translate input into runnable code."
 },
 {
  "g": 126,
  "type": "single",
  "q": "What is the fundamental cause of 'hallucinations' in large models — outputting content that seems plausible but is actually wrong?",
  "opts": [
   "During internet retrieval, the model retrieved outdated or incorrect third-party reference information",
   "The user's question was not stated clearly enough, exceeding the model's range of understanding",
   "The model generates content based on probabilistic prediction, and when knowledge is missing it still stitches together a seemingly plausible answer",
   "The hardware configuration of the model's deployment environment is insufficient, degrading inference accuracy"
  ],
  "ans": 2,
  "exp": "The fundamental cause of hallucinations is the generation mechanism: the model continues writing 'the most human-sounding content' by probability without fact-checking, and it still produces fluent, plausible-sounding answers even when knowledge is absent. This has nothing to do with retrieving wrong information (the base model doesn't connect to the internet), nor with question phrasing or hardware configuration."
 },
 {
  "g": 127,
  "type": "single",
  "q": "What is the core principle of RAG (Retrieval-Augmented Generation)?",
  "opts": [
   "Periodically perform full retraining of the large model to update its internal knowledge",
   "Before generating, retrieve and inject external knowledge into the context so the model answers based on facts",
   "At the output stage, check each sentence and automatically filter out the model's erroneous answers",
   "Continuously increase the model's parameter count to gain higher accuracy"
  ],
  "ans": 1,
  "exp": "RAG's core is 'retrieve first, then generate': before answering, retrieve relevant material from an external knowledge base, inject it into the Prompt context, and let the model answer based on the given facts. Compared to retraining, it is cheaper and knowledge can be updated in real time as the knowledge base changes. It is not an output-stage checking filter, and it has nothing to do with increasing parameter count."
 },
 {
  "g": 128,
  "type": "single",
  "q": "After using RAG, can large model hallucinations be completely eliminated?",
  "opts": [
   "Yes — as long as the knowledge base's coverage and update frequency are sufficient",
   "Yes — RAG fundamentally changes the model's generation mechanism",
   "No — if no relevant information is retrieved, the model may still produce hallucinations",
   "No — injecting external material actually amplifies the model's hallucinations"
  ],
  "ans": 2,
  "exp": "They cannot be completely eliminated. RAG does not change the model's probabilistic continuation mechanism — it only supplements it with reference material. When retrieval fails, retrieval is inaccurate, or the model doesn't faithfully follow the given material, hallucinations still appear. Note that option D's reasoning is wrong — injecting relevant material generally reduces hallucinations, not amplifies them."
 },
 {
  "g": 129,
  "type": "single",
  "q": "When Temperature is set lower (close to 0), what characteristics does model output have?",
  "opts": [
   "Output becomes more random, diverse, and more divergent",
   "Output is more stable and consistent, biased toward high-probability answers",
   "The model stops working due to parameters being too low",
   "The quality of output content drops sharply"
  ],
  "ans": 1,
  "exp": "Lower Temperature means more conservative sampling: the probability distribution becomes 'sharper', the model almost always selects the highest-probability Token, and the same question produces highly consistent output — suitable for accuracy-critical scenarios. Randomness and divergence are what higher temperature produces. Lowering temperature doesn't make the model stop working, nor does it mean quality declines."
 },
 {
  "g": 130,
  "type": "single",
  "q": "In Prompt engineering, role-setting (e.g. 'You are a doctor') can guide model output. What is the principle?",
  "opts": [
   "Role-setting temporarily modifies the model's internal weights for the corresponding domain",
   "The model cannot distinguish the truth of a role-setting and generates content from the assigned perspective",
   "Role-setting activates the corresponding pre-built domain knowledge module inside the model",
   "Role-setting only changes the tone and format of output, not the actual content"
  ],
  "ans": 1,
  "exp": "The model cannot verify the truth of the setting. Role-setting changes the context, so subsequent Token probability distributions align with the 'doctor' perspective and voice. It doesn't modify weights; the model has no pre-built 'knowledge modules' divided by profession to activate; and the setting affects not just tone but also the substance of the content."
 },
 {
  "g": 131,
  "type": "single",
  "q": "Someone says hallucinations are purely a technical defect and should be eliminated at any cost. Where does this judgment go wrong?",
  "opts": [
   "It underestimates the difficulty — hallucinations can actually be completely eliminated after just two more model generations",
   "It splits apart two sides of the same mechanism — hallucinations and creativity both come from probabilistic continuation, which becomes valuable in a different scenario",
   "It's wrong in scope — hallucinations only appear in small-parameter models; flagship models already eliminated them long ago",
   "It has the direction wrong — what should really be eliminated is prompts that aren't long enough"
  ],
  "ans": 1,
  "exp": "Hallucinations and creativity share the same origin — both arise from the free improvisation of probabilistic continuation. In creative writing, brainstorming, and similar scenarios, 'fabricating' is itself the value; it only becomes a defect in factual Q&A scenarios. A and C are factually wrong — hallucinations can't be completely eliminated and flagship models still have them. D attributes the problem to prompt length, which has nothing to do with the mechanism."
 },
 {
  "g": 132,
  "type": "single",
  "q": "Where do RAG and Agent sit in the large model technology stack?",
  "opts": [
   "They are two additional bottom-layer mechanisms parallel to probabilistic continuation",
   "They are engineering wrappers built on top of probabilistic continuation",
   "They replaced probabilistic continuation, so output is no longer determined by probability",
   "They belong to the model training phase and have nothing to do with inference time"
  ],
  "ans": 1,
  "exp": "The technology stack from bottom to top: the lowest layer is Token-by-Token probabilistic continuation; above that is dialogue templates and Prompt engineering; then RAG and tool calls; the top layer is Agent. RAG and Agent are engineering wrappers around probabilistic continuation — they haven't replaced it, so when the model is inclined to fabricate, it still does."
 },
 {
  "g": 133,
  "type": "multi",
  "q": "Effective means of reducing large model hallucinations include:",
  "opts": [
   "Injecting external knowledge through RAG to provide factual grounding",
   "Requiring 'only answer based on provided materials' in the Prompt",
   "Through alignment training, teaching the model to say 'I don't know' when uncertain",
   "Completely banning large model usage in the business to eradicate hallucinations"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "The first three options address hallucination mitigation from three levels: knowledge injection (RAG), behavioral constraint (Prompt restricting to material range), and model training (aligning the model to admit 'I don't know'). They are often combined in practice. 'Completely banning large model usage' is avoiding the problem, not reducing hallucinations."
 },
 {
  "g": 134,
  "type": "multi",
  "q": "Which of the following statements about large models are correct?",
  "opts": [
   "A large model is essentially probability-based 'chain continuation'",
   "Models have no fixed persona — Prompt role-setting affects output",
   "Large models can actively access the internet without any tools",
   "'Search capability' is implemented by developers through tool calls"
  ],
  "ans": [
   0,
   1,
   3
  ],
  "exp": "The three correct ones: the essence is probabilistic chain continuation; no fixed persona (role-setting changes context and thereby affects output); search is implemented via tool calls. 'Actively accessing the internet without tools' is wrong — and it directly contradicts 'search relies on tool calls', so they can't both be true."
 },
 {
  "g": 135,
  "type": "multi",
  "q": "Which steps are included in the RAG workflow?",
  "opts": [
   "After the user asks a question, the system executes retrieval",
   "The reference material is appended to the Prompt",
   "The large model generates an answer based on the reference material",
   "Generated results are automatically written back to the knowledge base to form a closed-loop update"
  ],
  "ans": [
   0,
   1,
   2
  ],
  "exp": "RAG's three-step sequence: Retrieval → material Augmented into Prompt → Generation. Automatically writing generated results back to the knowledge base is not part of the RAG workflow. Model output may carry hallucinations — auto-feeding it back would contaminate the knowledge base. Knowledge base updates must go through a separate maintenance process."
 },
 {
  "g": 136,
  "type": "judge",
  "q": "As long as the model's parameter count is large enough and training data is sufficient, hallucinations can be fundamentally eliminated.",
  "ans": false,
  "exp": "Incorrect. Hallucinations stem from the probabilistic continuation mechanism itself, not from insufficient parameter count or data volume. Scaling up can reduce hallucination frequency, but any model at any scale will still 'confidently fabricate' in knowledge gaps — it can be mitigated, not eliminated."
 },
 {
  "g": 137,
  "type": "judge",
  "q": "As long as RAG is integrated and the knowledge base is comprehensive enough, hallucinations in large models can be completely eliminated.",
  "ans": false,
  "exp": "Incorrect. RAG can dramatically reduce the hallucination rate, but cannot completely eliminate it: retrieval can fail or return inaccurate results, the model may misread or ignore the given material, and 'a sufficiently comprehensive knowledge base' is practically impossible to guarantee in the real world."
 }
];

window.EXAM_TOPICS_PART = {
 "101": {"name": "Problem SFT Solves", "file": "1-2-sft.html"},
 "102": {"name": "Base Model Behavior", "file": "1-2-base.html"},
 "103": {"name": "Chat Template Structure", "file": "1-2-sft.html"},
 "104": {"name": "Conversation as Completion", "file": "1-2-api.html"},
 "105": {"name": "Fake Chat Transcript Experiment", "file": "1-2-fake-chat.html"},
 "106": {"name": "Training vs Inference", "file": "train-vs-infer.html"},
 "107": {"name": "Parameters vs Context Window", "file": "1-2-hallucination.html"},
 "108": {"name": "Prompt as Equivalent Training", "file": "1-2-prompt-power.html"},
 "109": {"name": "Temperature Scaling Mechanism", "file": "1-2-mitigation-temp.html"},
 "110": {"name": "Scenario-based Sampling Params", "file": "1-2-mitigation-temp.html"},
 "111": {"name": "Hallucination Type Identification", "file": "summary-1.html"},
 "112": {"name": "GPT Pre-training Leap", "file": "1-2-gpt.html"},
 "113": {"name": "Tokens and Tokenization", "file": "1-2-vocab.html"},
 "114": {"name": "RAG Intent-filter Optimization", "file": "rag-advanced.html"},
 "115": {"name": "Prompt Constraint Boundaries", "file": "1-2-mitigation-prompt.html"},
 "116": {"name": "Evaluation and Review Stages", "file": "1-2-mitigation-eval.html"},
 "117": {"name": "Training Data Scale Awareness", "file": "training-data.html"},
 "118": {"name": "RAG Costs and Optimization", "file": "rag-advanced.html"},
 "119": {"name": "Mitigation Strategy Matching", "file": "summary-1b.html"},
 "120": {"name": "Frozen Parameters and Conversation", "file": "train-vs-infer.html"},
 "121": {"name": "SFT Capability Boundary", "file": "1-2-sft.html"},
 "122": {"name": "Temperature and Knowledge Boundary", "file": "1-2-mitigation-temp.html"},
 "123": {"name": "Hallucination Rate Metric Management", "file": "1-2-mitigation-eval.html"},
 "124": {"name": "RAG Retrieval Risk", "file": "1-2-mitigation-rag.html"},
 "125": {"name": "Token Probability Generation", "file": "1-2-base.html"},
 "126": {"name": "Cause of Hallucinations", "file": "1-2-hallucination.html"},
 "127": {"name": "Core Function of RAG", "file": "1-2-mitigation-rag.html"},
 "128": {"name": "Limitations of RAG", "file": "1-2-mitigation-rag.html"},
 "129": {"name": "Temperature Sampling", "file": "1-2-mitigation-temp.html"},
 "130": {"name": "How Prompts Take Effect", "file": "1-2-prompt-power.html"},
 "131": {"name": "Hallucination and Creativity", "file": "1-2-hallucination.html"},
 "132": {"name": "Foundation of Tech Stack", "file": "1-2-base.html"},
 "133": {"name": "Hallucination Mitigation Methods", "file": "summary-1b.html"},
 "134": {"name": "Basic LLM Understanding", "file": "summary-1.html"},
 "135": {"name": "RAG Workflow Steps", "file": "1-2-mitigation-rag.html"},
 "136": {"name": "Intrinsic Nature of Hallucinations", "file": "1-2-hallucination.html"},
 "137": {"name": "RAG and Hallucination Boundary", "file": "1-2-mitigation-rag.html"}
};
