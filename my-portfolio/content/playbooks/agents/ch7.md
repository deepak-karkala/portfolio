---
title: 'Chapter 7: Agentic Patterns'
summary: 'Discover composable design patterns for building AI agents, from structured workflows to dynamic autonomous systems.'
order: 7
---

# Agentic Patterns

##

Understanding agentic design patterns provides a mental toolkit for structuring AI applications. These patterns are not rigid prescriptions but composable blueprints that can be combined to solve complex problems. The key is to start with the simplest pattern that meets the need and only introduce more complexity when demonstrably required.

This section is divided into two parts:
*   **Part A: Structured Workflows** - These patterns follow more predictable, predefined paths. They are easier to build, debug, and are often the right starting point.
*   **Part B: Dynamic Agentic Patterns** - These patterns grant the LLM more autonomy, allowing it to adapt its behavior dynamically to achieve a goal.

---

#### **Structured Workflows (Predictable & Composable)**

These patterns orchestrate LLMs and tools through developer-defined code paths, offering predictability and consistency for well-defined tasks.

##### **Pattern: Prompt Chaining**

The output of one LLM call serves as the direct input for the next, creating a sequential pipeline.

<img src="/playbooks/agents/img/ch7/1.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

*   **Core Idea:** Decompose a complex task into a series of smaller, simpler, and fixed subtasks. This improves quality by allowing each LLM call to focus on a single, well-defined objective.
*   **When to Use:** Ideal for multi-step processes where the sequence of operations is fixed and known in advance.
*   **Use Cases:**
    *   **Structured Document Generation:** LLM 1 generates an outline -> LLM 2 validates the outline against criteria -> LLM 3 writes the full text based on the validated outline.
    *   **Data Processing Pipeline:** Extract entities from text -> Classify entities -> Generate a summary based on classified entities.
*   **Lead Engineer's Takeaway:** This is often the first step in moving beyond a single LLM call. It trades a slight increase in latency for a significant gain in quality and reliability.

##### **Pattern: Routing (or Handoff)**

An initial LLM acts as a classifier, analyzing the user's input and directing it to the most appropriate downstream task, model, or tool.

<img src="/playbooks/agents/img/ch7/2.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

*   **Core Idea:** Implements a separation of concerns. Instead of one monolithic prompt trying to handle everything, a router sends the request to a specialized path.
*   **When to Use:** For complex tasks with distinct categories of requests that are better handled by specialized logic or different models.
*   **Use Cases:**
    *   **Customer Support Triage:** Routing queries to "Billing," "Technical Support," or "General Inquiry" workflows.
    *   **Cost/Performance Optimization:** Routing simple queries (e.g., "What is 2+2?") to a small, fast model (like Gemini Flash) and complex, open-ended questions to a more capable model (like GPT-4o).
*   **Lead Engineer's Takeaway:** Routing is crucial for building efficient and cost-effective systems. It prevents the need to optimize a single prompt for conflicting inputs.

##### **Pattern: Parallelization (Sectioning & Voting)**

A task is broken down into independent subtasks that are processed simultaneously by multiple LLM calls, with their outputs then aggregated.

<img src="/playbooks/agents/img/ch7/3.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

*   **Core Idea:** Leverage concurrency for speed or diversity. This pattern manifests in two main variations:
    *   **Sectioning:** Break a large task into independent parts and process them in parallel (e.g., summarize each chapter of a book simultaneously).
    *   **Voting:** Run the same task multiple times with slightly different prompts or personas to generate a diverse set of outputs, then aggregate them (e.g., have three different "security expert" LLMs review code for vulnerabilities).
*   **When to Use:** When subtasks can be run independently to reduce latency, or when multiple perspectives are needed to improve confidence and quality.
*   **Use Cases:**
    *   **Automated Evals:** One LLM call evaluates correctness, another evaluates style, and a third evaluates for harmfulness—all in parallel.
    *   **Guardrail Implementation:** One model processes the user query while another simultaneously screens it for inappropriate content.
*   **Lead Engineer's Takeaway:** This is an advanced technique for reducing latency in I/O-bound tasks or for improving robustness through consensus, but it increases computational cost.

---

#### **Dynamic Agentic Patterns (Autonomous & Adaptive)**

These patterns empower the LLM to direct its own process and tool usage, maintaining control over how it accomplishes tasks.

##### **Pattern: The Tool-Augmented Agent**

This is the foundational pattern of a true agent, often implemented with a ReAct (Reason+Act) loop. The LLM repeatedly reasons about what to do next, selects a tool, executes it, observes the result, and repeats.

<img src="/playbooks/agents/img/ch7/8.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)


*   **Core Idea:** An LLM in a loop, equipped with tools and a goal. The LLM's output is not the final answer but a "thought" and a "tool call."
*   **Best Practices for Tool Design (The Agent-Computer Interface - ACI):** The quality of your tool definitions is as important as your prompts.
    *   **Clear Names & Descriptions:** Use descriptive names (`get_user_order_history` vs. `getData`) and detailed docstrings explaining what the tool does, its parameters, and when to use it.
    *   **Poka-yoke ("Mistake-Proof") Your Tools:** Design tool arguments to be less error-prone. For example, require absolute file paths instead of relative ones to avoid ambiguity as the agent changes directories.
    *   **Provide Examples:** Include example usage in the tool's description to guide the LLM.
*   **Lead Engineer's Takeaway:** This is the entry point to true agency. Success hinges on meticulously designed tools and robust loop control (e.g., max iterations, stop conditions).

##### **Pattern: Reflection (Evaluator-Optimizer)**

An agent iteratively refines its own work using a self-correction loop. One LLM call generates an output, and another (or the same LLM with a critique prompt) evaluates it and provides feedback for the next iteration.

<img src="/playbooks/agents/img/ch7/5.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

*   **Core Idea:** Formalizes the process of "thinking about your own work." It mirrors the human process of drafting, reviewing, and revising.
*   **When to Use:** When tasks have clear evaluation criteria and benefit from iterative improvement.
*   **Use Cases:**
    *   **Code Generation:** An agent writes code, an execution tool runs it, and the error traceback is fed back to the agent as a "critique" to fix the bug.
    *   **Complex Writing:** A "writer" agent generates a draft, and a "critic" agent reviews it for clarity, tone, and factual accuracy, providing feedback for the writer's next revision.
*   **Lead Engineer's Takeaway:** This pattern significantly improves the quality of complex outputs but introduces latency due to its iterative nature. It's most powerful when the evaluation criteria can be programmatically verified (like passing a unit test).

##### **Pattern: Planning (Orchestrator-Workers)**

A central "planner" or "manager" LLM dynamically breaks down a complex, high-level goal into a multi-step plan. It then delegates the execution of these steps to "worker" agents, which are often specialized tool-using agents.

<img src="/playbooks/agents/img/ch7/4.png" width="100%" style="background-color: #FCF1EF;"/>

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)


*   **Core Idea:** Separates the high-level task of "planning" from the low-level task of "execution." The plan is not predefined; it is generated dynamically based on the input.
*   **When to Use:** For complex, open-ended problems where the required steps cannot be predicted in advance.
*   **Use Cases:**
    *   **"Build a feature":** The planner breaks this down into: 1. Research similar features (worker: web search). 2. Write the code (worker: file editor). 3. Write unit tests (worker: file editor). 4. Run tests (worker: code executor). 5. Refine based on test results.
    *   **Research and Report Generation:** The planner creates steps like "Formulate search queries," "Execute web searches," "Synthesize findings," "Draft report," and "Create visualizations."
*   **Lead Engineer's Takeaway:** This is a powerful pattern for tackling ambiguity. The key difference from a simple workflow is the dynamic, model-generated nature of the plan. It's a precursor to the more formal multi-agent systems discussed in the next section.

___


### Multi-Agent Systems: Scaling Complexity and Collaboration

While a single, well-equipped agent can handle a surprising range of tasks, certain problems benefit from a "divide and conquer" strategy. Multi-agent systems introduce teams of specialized agents that collaborate to achieve a goal that would be too complex or inefficient for any single agent to handle alone. This approach provides an intuitive separation of concerns but introduces new challenges in coordination and communication.

#### **When to Go from Single to Multi-Agent**

Transitioning from a single agent to a multi-agent architecture is a significant step. It should not be done for the sake of complexity, but to solve specific, identifiable problems with a single-agent approach. As OpenAI's guide recommends, maximize a single agent's capabilities first. Make the switch only when you encounter these critical triggers:

1.  **Complex Logic & Unwieldy Prompts:** The agent's instructions have become a labyrinth of conditional statements (`if-then-else` branches). The prompt template is difficult to read, maintain, and scale. This is a sign that different logical segments should be broken out into separate, specialized agents.
    *   **Example:** A single customer service prompt trying to handle logic for refunds, technical support, and shipping inquiries becomes unmanageable. It's better to have a `RefundAgent`, `SupportAgent`, and `ShippingAgent`.

2.  **Tool Overload & Ambiguity:** The agent has access to a large number of tools, and many of them are similar or overlap. The model consistently struggles to select the correct tool, even with well-designed descriptions.
    *   **Example:** An agent has access to `create_gcal_event`, `update_gcal_event`, `create_outlook_event`, and `update_outlook_event`. It might be more effective to have a `GoogleCalendarAgent` and an `OutlookAgent`, each with its own focused set of tools.

3.  **Need for Specialized Personas or Expertise:** The task requires simulating a team of experts with different roles and perspectives.
    *   **Example:** To create a new marketing campaign, you might want a `ProductManagerAgent` to define requirements, a `CopywriterAgent` to generate text, and a `LegalReviewAgent` to check for compliance.

#### **Key Multi-Agent Architectures**

Multi-agent systems can be modeled as graphs where agents are nodes and their interactions are edges. OpenAI and Anthropic highlight two primary, broadly applicable architectural patterns:

##### **Pattern: Hierarchical (Manager-Worker)**

A central "manager" agent coordinates and delegates tasks to a network of specialized "worker" agents. The manager is the only agent that typically interacts with the user, maintaining overall context and control.

<img src="/playbooks/agents/img/ch7/9.png" width="100%" style="background-color: #FCF1EF;"/>

- [OpenAI: A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)


*   **Core Idea:** The manager agent treats other agents as tools. It uses its reasoning capabilities to decompose a high-level user request into subtasks and then calls the appropriate worker agent to execute each one. It synthesizes the results from the workers into a cohesive final response.
*   **Interaction Model:** Manager -> Worker (as a tool call).
*   **When to Use:** Ideal for workflows where you need a single point of control, a unified user experience, and clear orchestration. It mirrors a traditional team structure with a manager and direct reports.
*   **Use Cases:**
    *   **Automated Software Development:** A `DevLeadAgent` (manager) receives a feature request. It calls the `CoderAgent` to write the code, then calls the `TesterAgent` to run tests, and finally the `DeployAgent` to push to staging.
    *   **Complex Travel Planning:** A `TripPlannerAgent` (manager) orchestrates a `FlightAgent`, `HotelAgent`, and `ActivitiesAgent` to fulfill a complex user request like "Plan a 5-day trip to Tokyo."

##### **Pattern: Decentralized (Peer-to-Peer / Collaborative Handoff)**

Multiple agents operate as peers on equal footing, handing off control of the workflow to one another based on their specialization. There is no single central controller.

<img src="/playbooks/agents/img/ch7/10.png" width="100%" style="background-color: #FCF1EF;"/>

- [OpenAI: A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

*   **Core Idea:** Control flows from agent to agent. An initial `TriageAgent` might receive a request, determine its nature, and then "handoff" execution to a more specialized agent. The handoff itself is often implemented as a special type of tool call that transfers the entire conversation state and control.
*   **Interaction Model:** Agent A -> Agent B (via handoff).
*   **When to Use:** Optimal for scenarios like conversation triage or when tasks require a full transfer of responsibility without the original agent needing to remain involved.
*   **Use Cases:**
    *   **Customer Service Routing:** A `TriageAgent` receives a customer message. If it detects a technical issue, it hands off the conversation entirely to the `TechnicalSupportAgent`. If it's a sales inquiry, it hands off to the `SalesAssistantAgent`.
    *   **The Automotive Case Study (Google):** This exemplifies a complex, real-world decentralized system. In a modern car, a `ConversationalAgent` might hand off a navigation request to a dedicated `NavigationAgent`, a music request to a `MediaAgent`, and a climate control command to a `VehicleSystemsAgent`. These agents must coordinate seamlessly, balancing on-device and cloud processing to ensure safety and responsiveness.

##### **Pattern: Swarm Architectures**

This is an emerging, more dynamic form of decentralized collaboration. Instead of a linear handoff, a group of agents might work on a problem concurrently, sharing their findings in a common workspace (like a "scratchpad") and building upon each other's work collectively. Frameworks like LangGraph are particularly well-suited for building these systems.

*   **Lead Engineer's Takeaway:** Choose hierarchical for controlled orchestration and decentralized for dynamic task routing. The key decision is whether you need a single "brain" (manager) or a team of independent specialists (peers).

---

#### **Challenges in Multi-Agent Systems**

Introducing multiple agents creates unique engineering challenges:

*   **Communication & Shared State:** How do agents share information? Common methods include passing a shared "state" object, using a centralized message bus, or writing to a common database or scratchpad. Managing this state effectively is critical.
*   **Credit Assignment & Debugging:** When a multi-agent system fails, it's difficult to pinpoint which agent or interaction was the root cause. This requires sophisticated tracing and logging that can visualize the entire collaborative graph.
*   **Coordination Complexity:** Preventing issues like deadlocks (Agent A is waiting for Agent B, who is waiting for Agent A) or resource contention.
*   **Cost and Latency:** Multiple agents mean multiple (often sequential) LLM calls, which can significantly increase both cost and the time to get a final answer. The benefits of specialization must outweigh these overheads.

___

