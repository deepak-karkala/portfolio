---
title: 'Chapter 8: Context Engineering'
summary: 'Master the art of filling the context window with optimal information to maximize agent effectiveness and minimize failures.'
order: 8
---

# Context Engineering

## 1. Introduction: The Paradigm Shift to Context Engineering

In the rapidly evolving landscape of AI, the focus for building effective applications has shifted. While "prompt engineering" concentrated on crafting optimal textual instructions, "context engineering" represents a more profound and systemic approach. As Andrej Karpathy aptly puts it, LLMs function as a new operating system, with their context window serving as the RAM—the model's working memory. Context engineering is the "delicate art and science of filling the context window with just the right information for the next step".

This shift is critical because, as agents become more sophisticated and engage in long-running, multi-step tasks, the quality and relevance of the information presented to the LLM directly determine its success or failure. Most agent failures are not model failures, but rather **context failures**.

### 1.1 Prompt Engineering vs. Context Engineering

The distinction is more than semantic:

*   **Prompt Engineering:**
    *   Focuses on clever wording and specific phrasing within a single text string.
    *   Limited to how a task is phrased.
    *   Analogous to giving someone a sticky note with brief instructions.
*   **Context Engineering:**
    *   A complete, dynamic system for providing comprehensive, curated context.
    *   Includes documentation, examples, rules, patterns, validation, and real-time data.
    *   Analogous to providing a full screenplay with all character backstories, scene settings, and props.
    *   It's a discipline of designing and building dynamic systems that provide the right information and tools, in the right format, at the right time, to give an LLM everything it needs to accomplish a task.

### 1.2 Why Context Engineering Matters for AI Agents

For CTOs and Tech Leads, understanding the significance of context engineering is paramount:

*   **Reduces AI Failures:** By mitigating "context failures," it directly enhances the reliability and predictability of agent behavior.
*   **Ensures Consistency:** Agents adhere to project patterns, conventions, and desired operational standards.
*   **Enables Complex Features:** Proper context allows agents to handle intricate, multi-step implementations that would otherwise be intractable.
*   **Boosts Performance & Reduces Cost:** Efficient context management prevents exceeding context window limits, reduces token usage (and thus cost), and minimizes latency.
*   **Facilitates Self-Correction:** Incorporating validation loops and feedback mechanisms allows agents to identify and rectify their own mistakes.
*   **Transforms "Cheap Demos" into "Magical Products":** The difference between a rudimentary AI assistant and a truly effective one often lies in the quality and richness of the context provided. A "magical agent" is powered by a robust context engineering system that gathers all necessary information before an LLM call, enabling nuanced and highly relevant responses.

## 2. The Components of Context

To engineer context effectively, one must first understand its constituent elements. Context is not a monolithic entity but a composite of various data types that the LLM processes.

Key components of context include:

*   **Instructions / System Prompt:** Defines the agent's persona, its goals, constraints, and operational rules. It sets the scene and includes examples or meta-instructions.
*   **User Input / Prompt:** The immediate task, question, or request from the user.
*   **Short-Term Memory / Chat History:** The ongoing conversation thread, including previous user queries and the agent's responses. This provides conversational continuity.
*   **Long-Term Memory:** Persistent knowledge base accumulated across multiple sessions or over time. This can include user preferences, summaries of past projects, facts the agent was told to remember (semantic, episodic, procedural memories).
*   **Retrieved Information (RAG):** External, up-to-date knowledge fetched from databases, documents, APIs, or other knowledge bases. This augments the LLM's internal knowledge.
*   **Available Tools & Their Definitions:** Descriptions of the functions or external capabilities the agent can invoke (e.g., `check_inventory`, `send_email`, `browser_search`).
*   **Responses from Tools:** The feedback or results obtained from executing tool calls, which become new context for the agent's next decision.
*   **Structured Outputs:** Definitions on the desired format of the model's response (e.g., a JSON schema), or condensed, structured information provided *to* the LLM as context for specific tasks.
*   **Global State / Workflow Context:** A "scratchpad" or shared state object that stores and retrieves global information across agent steps, enabling the agent to maintain and pass relevant data without explicit LLM serialization.

## 3. Core Pillars of Context Engineering

Effective context engineering can be systematically broken down into four core pillars: **Write, Select, Compress, and Isolate**. These strategies address the challenges of managing finite context windows, reducing costs, and improving agent performance.

### 3.1 Write Context: Saving Information Outside the Context Window

Writing context involves persisting information for future use by the agent, ensuring it's available when needed without constantly consuming precious context window space.

*   **Scratchpads:**
    *   **Concept:** Like human note-taking, scratchpads allow agents to save intermediate thoughts, plans, or critical observations during a task.
    *   **Implementation:** Can be implemented as tool calls that write to a file system (e.g., `write_to_file` tool), or as fields within a runtime state object that persists across steps in a session.
    *   **Example:** Anthropic's LeadResearcher saves its plan to "Memory" to retain context, especially if the context window limit is approached, preventing truncation. Manus.im's agents often create and update a `todo.md` file, using the file system as an externalized scratchpad.
*   **Memories:**
    *   **Concept:** Extends scratchpads to persist information across *many* sessions, enabling long-term learning and personalized interactions.
    *   **Types:**
        *   **Episodic Memories:** Few-shot examples of desired behavior.
        *   **Procedural Memories:** Instructions or rules to steer behavior.
        *   **Semantic Memories:** Facts or general knowledge relevant to tasks.
    *   **Examples:**
        *   **Reflexion:** Introduces self-generated reflections (memories) following each agent turn.
        *   **Generative Agents:** Synthesize memories periodically from past agent feedback.
        *   **Products:** ChatGPT, Cursor, and Windsurf auto-generate long-term memories based on user-agent interactions.
    *   **LLM Role:** An LLM can be used to summarize, update, or create new memories from interaction history.

### 3.2 Select Context: Pulling Relevant Information into the Context Window

Selecting context is the art of retrieving and injecting *only* the most pertinent information into the LLM's context window for the current step.

*   **Scratchpad Selection:**
    *   **Mechanism:** If implemented as a tool, the agent explicitly calls to read it. If part of runtime state, the developer controls which state fields are exposed to the LLM at each step, offering fine-grained control.
*   **Memory Selection:**
    *   **Challenge:** Ensuring that *relevant* memories are selected, especially from large collections.
    *   **Approaches:**
        *   **Static Files:** Many code agents use specific files (e.g., `CLAUDE.md`, Cursor/Windsurf rules files) that are *always* pulled into context for instructions or examples.
        *   **Embeddings & Knowledge Graphs:** For larger collections of semantic memories (e.g., ChatGPT's user-specific memories), vector embeddings and knowledge graphs are commonly used for indexing and retrieval.
        *   **Challenges:** Memory selection can go wrong (e.g., ChatGPT injecting location into an image request), leading to user dissatisfaction or unexpected behavior.
*   **Tool Selection:**
    *   **Challenge:** Providing too many tools can overload the agent, leading to confusion due to overlapping descriptions or inefficient paths.
    *   **Approach:** Apply Retrieval Augmented Generation (RAG) to tool descriptions to fetch only the most relevant tools for a given task based on semantic similarity. Recent research shows this can significantly improve tool selection accuracy.
    *   **Manus.im's "Mask, Don't Remove":** Instead of dynamically adding/removing tools (which invalidates KV-cache and confuses the model), Manus uses a context-aware state machine to *mask* token logits during decoding. This prevents selection of certain actions (or enforces others) without modifying tool definitions, preserving cache and avoiding schema violations. Consistent tool name prefixes (e.g., `browser_`, `shell_`) facilitate this.
*   **Knowledge (RAG):**
    *   **Concept:** A central context engineering challenge, particularly in code agents.
    *   **Advanced RAG:** Beyond simple embedding search, techniques like AST parsing for code chunking, grep/file search, knowledge graph retrieval, and re-ranking steps are crucial for effective knowledge retrieval in complex codebases.

### 3.3 Compressing Context: Retaining Only Essential Tokens

Compressing context involves reducing the volume of information within the context window while preserving its essential meaning, directly impacting cost, latency, and performance.

*   **Context Summarization:**
    *   **Concept:** Uses an LLM to distill the most relevant pieces of context from long agent trajectories or token-heavy tool outputs.
    *   **Strategies:** Recursive or hierarchical summarization can be applied across hundreds of agent turns.
    *   **Examples:** Claude Code uses "auto-compact" to summarize full user-agent interactions when approaching context window limits. Summarization can also be applied to post-process specific tool calls (e.g., search results) or at agent-agent boundaries in multi-agent systems (Cognition uses fine-tuned models for this).
    *   **Challenge:** Ensuring that specific critical events or decisions are captured, as overly aggressive compression can lead to information loss.
*   **Context Trimming:**
    *   **Concept:** Filters or "prunes" context based on hard-coded heuristics or trained models.
    *   **Strategies:** Removing older messages from a list (e.g., in short-term chat history).
    *   **Examples:** Provence: a trained context pruner for Question-Answering.

### 3.4 Isolating Context: Splitting Up Context for Focused Processing

Isolating context involves partitioning information strategically, allowing different parts of the agent system or different agents to focus on specific, manageable subsets of context.

*   **Multi-Agent Architectures:**
    *   **Concept:** Splits a complex task into sub-tasks, with each sub-agent handling a specific concern, equipped with its own tools, instructions, and isolated context window.
    *   **Motivation:** Separation of concerns, enabling each sub-agent to operate with a narrower, optimized context, often outperforming single, monolithic agents.
    *   **Examples:** OpenAI's Swarm library, Anthropic's multi-agent researcher system (reporting sub-agents operating in parallel with their own context windows).
    *   **Challenges:** Increased token use (Anthropic reported up to 15x more tokens), requires careful prompt engineering for planning and coordination between sub-agents.
*   **Context Isolation with Environments (Sandboxing):**
    *   **Concept:** Executes tool calls in a sandboxed environment, isolating token-heavy objects or complex operations from the main LLM context. Only selected return values or summarized observations are passed back.
    *   **Examples:** HuggingFace's CodeAgent outputs code that runs in a sandbox (e.g., E2B), returning only relevant results. This is particularly useful for managing large outputs like images, audio, or large datasets.
*   **State Objects / Schemas:**
    *   **Concept:** An agent's runtime state object, defined with a schema (e.g., Pydantic model), can isolate context. One field (e.g., `messages`) might be exposed to the LLM, while other fields store information for more selective use by specific nodes or logic.
    *   **Function:** Serves a similar purpose to sandboxing, keeping data separate from the LLM until explicitly required.
    *   **Example:** LangGraph's state object with a schema allows developers to store context from tool calls in specific fields, exposing it only when relevant to the LLM.

## 4. Addressing Context Failures and Robustness

[Drew Breunig highlighted specific ways longer contexts can lead to performance problems](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html), which context engineering aims to mitigate:

*   **Context Poisoning:** When a hallucination or incorrect piece of information makes its way into the context, leading the agent astray.
    *   **Mitigation:** Rigorous validation of tool outputs, prompt engineering to encourage self-correction, and maintaining "clean AI context" through careful context management.
*   **Context Distraction:** When excessive or irrelevant context overwhelms the LLM, causing it to lose focus or perform sub-optimally.
    *   **Mitigation:** Aggressive selection and compression strategies, multi-agent decomposition to narrow focus, and active attention manipulation (recitation).
*   **Context Confusion:** When superfluous context influences the response in unintended ways.
    *   **Mitigation:** Precise context selection, trimming, and isolation.
*   **Context Clash:** When different parts of the context disagree, leading to ambiguous instructions or conflicting information.
    *   **Mitigation:** Clear hierarchy for context sources, conflict resolution mechanisms (e.g., explicit rules in `CLAUDE.md`), and validation steps.

### 4.1 Lessons from Building Manus: Operationalizing Context Engineering

Manus.im's experience provides deep insights into the practical challenges and solutions in context engineering:

*   **Design Around the KV-Cache:**
    *   **Priority:** KV-cache hit rate is the single most important metric for latency and cost in production agents (e.g., 10x cost difference on Claude Sonnet for cached vs. uncached tokens).
    *   **Practices:**
        *   **Stable Prompt Prefix:** Even a single token difference invalidates the cache from that point. Avoid dynamic elements like precise timestamps at the beginning of system prompts.
        *   **Append-Only Context:** Avoid modifying previous actions/observations. Ensure deterministic serialization (e.g., JSON key ordering) to maintain prefix consistency.
        *   **Explicit Cache Breakpoints:** Mark these manually in contexts for frameworks that don't auto-support incremental prefix caching, especially at the end of the system prompt.
        *   **Infrastructure:** Ensure prefix caching is enabled in self-hosted models (e.g., `vLLM`) and use session IDs for consistent routing.
*   **Mask, Don't Remove (Tool Selection):**
    *   **Problem:** Dynamically adding/removing tools invalidates KV-cache and confuses the model (schema violations, hallucinated actions).
    *   **Solution:** Use context-aware state machines to *mask* token logits during decoding, preventing/enforcing tool selection based on the current state. Most providers support "response prefill" for function calling (`Auto`, `Required`, `Specified` modes). Consistent action name prefixes (e.g., `browser_`, `shell_`) facilitate this without stateful logits processors.
*   **Use the File System as Context:**
    *   **Problem:** LLM context windows, even large ones (128K+), are often insufficient for real-world agentic scenarios (huge observations, performance degradation, high cost). Irreversible compression risks information loss.
    *   **Solution:** Treat the file system as the ultimate context—unlimited, persistent, and directly operable by the agent. The agent learns to read/write files on demand, using it as externalized memory.
    *   **Restorable Compression:** Content can be dropped from context if a pointer (e.g., URL for webpage, file path for document) is preserved, allowing later retrieval.
    *   **Future Vision:** This approach is seen as crucial for enabling State Space Models (SSMs) in agentic settings by externalizing long-term state.
*   **Manipulate Attention Through Recitation:**
    *   **Problem:** Agents can drift off-topic or forget goals in long loops/contexts ("lost-in-the-middle").
    *   **Solution:** Constantly rewrite and update a global plan or `todo` list at the end of the context. This "recites" objectives into the model's recent attention span, biasing its focus toward the task.
*   **Keep the Wrong Stuff In:**
    *   **Problem:** Hiding errors (cleaning traces, retrying, resetting state) prevents the model from learning and adapting.
    *   **Solution:** Leave failed actions, resulting observations, and stack traces in the context. The model implicitly updates its internal beliefs, shifting its prior away from repeating the same mistake. Error recovery is a key indicator of true agentic behavior.
*   **Don't Get Few-Shotted (Increase Diversity):**
    *   **Problem:** LLMs mimic patterns in context. Repetitive action-observation pairs can lead to brittle agents, overgeneralization, drift, or hallucination, especially in tasks with many similar decisions.
    *   **Solution:** Introduce small amounts of structured variation in actions and observations (different serialization templates, alternate phrasing, minor noise in order/formatting). This breaks the pattern and "tweaks the model's attention," preventing it from falling into a rut.

## 5. Implementation Frameworks & Best Practices

Building context-engineered agents requires robust frameworks and adherence to best practices.

### 5.1 General Frameworks & Tools

*   **LangChain / LangGraph:** LangGraph provides a low-level orchestration framework ideal for defining agent graphs, managing state, and integrating memory.
    *   **Write Context:** Thread-scoped (short-term) memory via checkpointing of agent state, and flexible long-term memory for files or collections. LangMem offers further abstractions.
    *   **Select Context:** Fine-grained control over state exposure within each node. Long-term memory supports file fetching and embedding-based retrieval. LangGraph Bigtool applies semantic search for tool selection.
    *   **Compress Context:** Message list state can be summarized or trimmed periodically. Logic can be added to post-process tool calls or work phases for summarization.
    *   **Isolate Context:** State object schemas for selective information exposure. Supports sandboxing (E2B, Pyodide) and multi-agent architectures (supervisor, swarm libraries).
*   **LlamaIndex / LlamaCloud:** Offers tools and frameworks for building agentic systems with a strong emphasis on data integration and retrieval.
    *   **Knowledge Base / Tool Selection:** Beyond single-knowledge base RAG, LlamaIndex supports multi-knowledge base agents with tool selection based on descriptions.
    *   **Context Ordering / Compression:** Techniques like summarization of retrieval results before context insertion. Ranking steps to order information (e.g., by date relevance).
    *   **Long-Term Memory:** Provides various memory blocks (`VectorMemoryBlock`, `FactExtractionMemoryBlock`, `StaticMemoryBlock`) and a base `MemoryBlock` for custom implementations.
    *   **Structured Information:** LlamaExtract (LlamaCloud tool) uses LLM structured output functionality to extract relevant data from complex files, providing condensed context.
    *   **Workflow Engineering (LlamaIndex Workflows):** An event-driven framework for defining explicit step sequences, strategically controlling context, ensuring reliability (validation, error handling), and optimizing for specific outcomes. Workflows prevent context overload by breaking tasks into focused steps with optimized context windows.
*   **LangSmith:** Essential for observability and evaluation.
    *   **Tracing / Observability:** Track token usage, agent trajectories, and interactions to identify context engineering opportunities.
    *   **Evaluation:** Test the impact of context engineering efforts on agent performance through agent evaluation.

### 5.2 Practical Implementation

A structured approach to context engineering for coding agents:

1.  **Set Up Global Rules (`CLAUDE.md`):**
    *   **Purpose:** Contains project-wide rules, conventions, and constraints the AI assistant must follow in every conversation.
    *   **Content:** Project awareness (planning docs, tasks), code structure (file size, module org), testing (unit test patterns, coverage), style (language, formatting), documentation (docstring, commenting).
    *   **Benefit:** Ensures consistency, reduces AI failures, and enforces best practices.
2.  **Create Initial Feature Request (`INITIAL.md`):**
    *   **Purpose:** A specific and comprehensive description of the feature to be built.
    *   **Sections:**
        *   `FEATURE`: Detailed functionality and requirements.
        *   `EXAMPLES`: References to code patterns in `examples/` folder.
        *   `DOCUMENTATION`: Links to relevant APIs, libraries, or MCP server resources.
        *   `OTHER CONSIDERATIONS`: Gotchas, specific requirements, common pitfalls.
3.  **Generate the Product Requirements Prompt (PRP):**
    *   **Concept:** A comprehensive implementation blueprint generated by an orchestrating agent. Similar to a PRD, but tailored for AI coding assistants.
    *   **Process (e.g., `/generate-prp INITIAL.md` in Claude Code):**
        1.  **Research:** Analyzes codebase for patterns, similar implementations, conventions.
        2.  **Documentation Gathering:** Fetches relevant API docs, library guides, adds gotchas.
        3.  **Blueprint Creation:** Creates step-by-step implementation plan with validation gates and test requirements.
        4.  **Quality Check:** Scores confidence, ensures all context included.
    *   **Benefit:** Ensures the AI receives complete, structured context and a clear plan.
4.  **Execute the PRP:**
    *   **Process (e.g., `/execute-prp PRPs/your-feature-name.md`):**
        1.  **Load Context:** Reads the entire PRP.
        2.  **Plan:** Creates a detailed task list (e.g., using `TodoWrite`).
        3.  **Execute:** Implements each component.
        4.  **Validate:** Runs tests and linting.
        5.  **Iterate:** Fixes issues found.
        6.  **Complete:** Ensures all requirements met.
    *   **Benefit:** Automates complex feature implementation with built-in quality assurance.
5.  **Using Examples Effectively (`examples/` folder):**
    *   **Criticality:** AI coding assistants perform significantly better with clear patterns to follow.
    *   **Content:** Code structure, testing patterns, integration patterns (API clients, DB connections), CLI patterns, agent architecture patterns.
    *   **Structure:** Organize examples logically (e.g., `cli.py`, `agent/`, `tests/`).

### 5.3 Best Practices for Robust Context Engineering

*   **Be Explicit:** Never assume the AI knows preferences. Include specific requirements, constraints, and reference examples liberally.
*   **Provide Comprehensive Examples:** More examples lead to better implementations. Show both desired patterns and anti-patterns, including error handling.
*   **Implement Validation Gates:** Integrate test commands into PRPs and agent workflows. The AI should iterate until all validations pass, ensuring working code from the outset.
*   **Leverage Documentation:** Include official API documentation, MCP server resources, and specific documentation sections.
*   **Customize Global Rules:** Tailor `CLAUDE.md` (or equivalent) with project-specific conventions, rules, and coding standards.
*   **Monitor and Iterate:** Use observability tools (like LangSmith) to track token usage, identify context issues, and continuously refine context engineering strategies.
*   **Orthogonality:** Design agent architecture to be largely independent of the underlying LLM, allowing for easier model upgrades and changes.

## 6. Conclusion: The Craft of Agentic Intelligence

Context engineering is no longer an optional add-on but the foundational craft for building truly effective AI agents. It transcends mere prompt crafting, embracing a systematic approach to managing the flow, content, and structure of information presented to LLMs. By diligently applying strategies of writing, selecting, compressing, and isolating context, and by learning from real-world lessons like those from Manus.im, CTOs and Tech Leads can transform their agentic systems from fragile prototypes into robust, intelligent, and cost-efficient solutions. The agentic future will be built one meticulously engineered context at a time.