---
title: 'Chapter 3: Agent Memory'
summary: 'Understand how to implement short-term and long-term memory systems that enable agents to learn, recall, and improve over time.'
order: 3
---

# Agent Memory (Short-Term and Long-Term)

##
###

Memory is a fundamental component that separates a truly capable AI agent from a simple stateless
chatbot. Real-world tasks often require remembering what happened earlier in the conversation (short-
term memory) and retaining important information or learning over time across sessions (long-term
memory). Managing this **agentic memory** effectively is key to building an AI agent that is coherent,
personalized, and continually improving.

___

#### **Why Memory Matters:**

Traditional LLMs are stateless – they don’t “remember” anything beyond the
context window of the current prompt. Without additional memory, an agent would quickly lose track of
prior interactions or facts it learned, leading to repetitive questions or inconsistent behavior. Memory
allows the agent to **learn from past interactions, maintain context, and personalize responses**. For
instance, if a user’s travel-planner agent remembers that the user hates early-morning flights, it can
avoid suggesting those in the future. Thus, memory enhances both user experience and task
effectiveness.
___

#### **Short-Term vs Long-Term Memory:**

AI agents, like humans, rely on both short-term and long-term
memory.

**Short-term memory** (sometimes called working memory) holds the recent context of the
ongoing task or conversation – essentially what’s within the LLM’s context window or the last few turns
of dialogue. It’s analogous to a conversation’s running transcript or a scratchpad of the agent’s recent
thoughts. This is naturally limited (by token length constraints and by design, to avoid irrelevant
buildup). Agent frameworks often maintain this short-term state as the immediate history that is fed
into each LLM prompt. For example, the agent might keep the last user query and its own last answer
as context for the next response, or a summary of the dialogue so far if it’s gotten long.

**Long-term memory** , on the other hand, is an enduring store of information that persists across
sessions and tasks. It allows the agent to recall _facts or experiences_ from much earlier. Long-term
memory can include various types of knowledge: - **Episodic memory:** Specific past events or
interactions the agent had (e.g., “Last week I helped the user fix a printer issue”). This is like the
agent’s personal diary of its encounters. - **Procedural memory:** Learned skills or action sequences (e.g.,
a procedure for booking a flight or troubleshooting a router). This is “how-to” knowledge the agent
has acquired. - **Semantic memory:** General world knowledge or facts the agent has gained (e.g., key
facts about products, or that “visa is required for X country”). This functions as the agent’s
knowledge base about the domain.

In an enterprise setting, long-term memory might include customer profile data, accumulated
conversation summaries, or an evolving knowledge graph of facts the agent has confirmed. Managing
long-term memory is complex: the agent must decide what information is worth storing for future, how
to represent it, and how to retrieve it when relevant.

___


#### **Memory Storage Strategies:**

There are several strategies (often used in combination) to implement
memory for agents:

- **Summarization:** Periodically summarize the conversation or recent events and
store the summary. This condenses long dialogues into shorter paraphrases that can be kept in context.
As new interactions happen, the agent updates the summary. This is simple and human-readable – for
example, after a long support chat, the agent might save “Summary: user had issue X, agent walked
through steps Y, issue resolved with solution Z.” The next time the user comes, the agent can quickly
recall what was discussed without reading the entire transcript.

- **Vector Embeddings (Vectorization):**
Store pieces of information as vectors (numerical embeddings) in a vector database, to enable semantic
search. For instance, each important statement or fact can be embedded and saved. When the agent
needs to recall something, it transforms the query or context into a vector and finds similar vectors
(using cosine similarity or similar). This allows **contextual retrieval** of relevant memories even if exact
words differ. It’s a core technique in modern long-term memory and retrieval-augmented generation.
Best practice is to chunk information into semantically meaningful pieces and embed them (sometimes
called _semantic chunking_ of knowledge).

- **Knowledge Extraction:** Instead of storing raw conversation
text, the agent can extract structured facts or key snippets and store those in a database. For example,
from a meeting discussion an agent might extract “Decision: launch campaign on Oct 10” and store it as
a record. Tools like a document store or JSON database can keep these facts with metadata. This way,
later queries can directly look up the fact “campaign launch date” rather than parsing a whole
transcript. An example from the LangChain team showed an agent extracting and writing important facts to memory as it went.

- **Graph or Knowledge Base (“Graphication”):** For some applications,
representing memory as a graph of entities and relationships is useful. E.g., the agent could maintain a
graph linking a user to their projects to the deadlines. Graph-structured memory allows more logical
queries (like a mini knowledge graph the agent updates). It can capture relationships better than free
text.

Each method has pros and cons – summarization is easy but may omit details; vector search is powerful
but needs tuning to avoid irrelevant hits; structured extraction is precise but requires defining what to
extract. In practice, a combination is often used. For example, an agent might maintain a running
summary _and_ store full conversation chunks in a vector store for safety.

___


#### **Retrieval of Memories:**

Storing memories is only half the battle – the agent must know _when and how
to retrieve_ relevant memories at the right time. Typically, before each agent action or each new user
query, there is a step to fetch any pertinent long-term memory to include in the prompt. A simple
approach is keyword search or semantic search on stored memories using the current query as the key.
More advanced approaches let the LLM itself decide when to pull in memory. For instance, the **MemGPT**
research proposes an architecture where the LLM can issue a “retrieve” command (function call) to
query its own long-term store when needed. In practice, many implementations use a heuristic: always
retrieve the top _k_ most relevant memory items (via vector similarity) for context, and maybe the most
recent few interactions as well. The agent’s **prompt assembly** will then include those memory snippets
(e.g. “Recalling: You previously told the user X...”). As a starting point, developers often begin with
straightforward vector search for relevant memory and evolve to more sophisticated triggers or learned
retrieval strategies as needed.

___


#### **Memory Management Considerations:**

One big issue is **memory growth** – as an agent interacts
endlessly, it could accumulate an ever-growing log of everything. This is unsustainable in terms of
storage and search efficiency. Therefore, **memory decay** or pruning strategies are important. The
agent should forget or archive information that is no longer useful. For example, we can impose
retention policies: e.g. keep only last 3 months of detailed conversation, or automatically expire
memories that haven’t been accessed in a long time. Techniques include time-based expiration, limiting
memory store size, or scoring memories by importance and dropping the lowest importance ones over
time. Some vector databases or memory systems provide built-in expiry or eviction policies (Redis, for
instance, allows setting TTL on memory records or using LRU eviction for older items). By tuning these,
we prevent memory bloat and ensure the agent remains efficient and focused on relevant knowledge.

Another consideration: **sharing memory across agents or sessions.** In some cases, you may have
multiple agent instances (like one per user or one per task type) – do they share a global memory or
have separate memories? A global knowledge base (facts learned that apply to all users) can be shared,
whereas user-specific conversational memory should be scoped per user for privacy and relevance.
Designing the memory architecture thus involves deciding on namespaces or partitions of memory
data.

___

#### **Technical Implementation:**

In practice, implementing memory might leverage existing tools:

- **Vector databases** (like Pinecone, Weaviate, Milvus, or even Redis with vector search module) to store
embeddings for semantic recall.

- Traditional databases or key-value stores for structured memory or
direct lookups.

- Caching layers for very short-term memory (some frameworks treat the last turn or two
as cache).

- In-memory data structures vs persistent storage: short-term can be just kept in process,
long-term should be persisted (and likely needs backup, scaling, etc., like any datastore).

As a lead engineer, you should choose the types of memory your agent needs based on the use case. For a troubleshooting agent, procedural memory (learned troubleshooting flows) might be key; for a personal assistant,
episodic memory of previous interactions with the user is crucial.

___


#### **Observability of Memory Usage:**

When running in production, it’s important to monitor memory-
related metrics: e.g., how often is the agent retrieving from long-term memory? Are there cache hits/
misses? How large is the memory store growing? Which memories are most accessed? These can
inform tuning. If you find the agent rarely uses older memories, maybe you can prune more
aggressively. If certain queries always trigger the same large set of memories, perhaps those should be
consolidated into a summary.

___

In summary, **memory management** in AI agents involves enabling _recall_ (short-term context, long-
term knowledge), _learning_ (storing new useful info), and _forgetting_ (discarding or compressing old info)
in a controlled way. Done well, it results in an agent that feels _smart and context-aware_ , remembering
important details and improving over time – a key ingredient for user trust and effectiveness.
Neglecting memory, on the other hand, leaves an agent either forgetful (if no memory) or muddled (if
too much irrelevant memory). The best practice is to start with a simple memory mechanism and
iterate: gather data on what the agent really needs to remember, and evolve the memory architecture
(perhaps moving from just summaries to vector DB to more advanced schemes as the product
matures).