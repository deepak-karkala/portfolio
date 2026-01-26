---
title: 'Claude Agent SDK'
summary: 'Comprehensive guide to building production-ready agentic AI systems using the Claude Agent SDK'
date: '2024-01-15'
category: 'Technical Reference'
---

# Claude Agent SDK

## 1. Executive Summary: SDK vs. Client API
The **Claude Agent SDK** is a runtime wrapper around Claude Code. Unlike the standard Client SDK (stateless request/response), the Agent SDK provides an **autonomous runtime environment**.

| Feature | Standard Client SDK | **Agent SDK** |
| :--- | :--- | :--- |
| **State** | Stateless (You manage history) | **Stateful** (Manages context, files, history) |
| **Tooling** | You write the execution loop | **Built-in Loop** (Bash, File Edit, Grep, MCP) |
| **Scope** | Single Turn / Chat | **Multi-Turn Workflows** (Tasks, Subagents) |
| **Best For** | Chatbots, RAG apps | **Coding Agents, Auto-DevOps, Analysis** |

---

## 2. Core Architecture & Tools
The SDK operates on a `query` loop. It automatically manages the context window, tool execution, and error handling.

### Built-in Toolchain
The agent comes pre-equipped. You do not need to implement these:
*   **Filesystem:** `Read`, `Write`, `Edit`, `Glob`, `Grep`, `LS`.
*   **Execution:** `Bash` (Terminal commands).
*   **Navigation:** `WebSearch` (Google), `WebFetch` (Headless browser).
*   **Logic:** `AskUserQuestion` (Clarification), `Task` (Subagent delegation).

### Extension Points (MCP & Custom Tools)
Extend capabilities using the **Model Context Protocol (MCP)**.
*   **In-Process MCP:** Define tools directly in Python/TypeScript code using SDK helpers.
*   **External MCP:** Connect to stdio/HTTP servers (e.g., Postgres, Github, Brave Search).
*   **Pattern:** Use `mcpServers` config in the `query` options. Tools are namespaced as `mcp__{server}__{tool}`.

**Insight:** For type safety, use **Zod** (TS) or **Pydantic/Type Hints** (Python) when defining custom tools. The SDK validates inputs against these schemas before execution.

---

## 3. Control Plane: Governance & Safety
This is the most critical section for production deployments. You control *how* the agent acts using three layers of defense.

### Layer 1: Permission Modes
Set the global "aggression" level of the agent via `permissionMode`.
*   `default`: Asks for permission on potentially dangerous actions.
*   `acceptEdits`: Auto-approves file modifications (`Write`, `Edit`, `mkdir`, `rm`).
*   `bypassPermissions`: Auto-approves **everything** (Use only in sandboxes).
*   `dontAsk`: Auto-denies everything unless explicitly allowed via rules.

### Layer 2: The `canUseTool` Callback
The "Human-in-the-loop" checkpoint.
*   **Trigger:** Fires when the agent attempts a tool use that isn't auto-approved.
*   **Capabilities:**
    *   **Allow/Deny:** Boolean decision.
    *   **Modify:** You can alter the command/input before allowing (e.g., sanitizing a `rm -rf` path).
    *   **Feedback:** Return a denial message to Claude so it can self-correct.
*   **Clarification:** Handles the `AskUserQuestion` tool. You must render the question and return the user's selection.

### Layer 3: Hooks (The Interceptors)
Execute custom code at specific lifecycle events.
*   **`PreToolUse`**: The Firewall. Block tools, sanitize inputs, or enforce policy (e.g., "Never edit .env files").
*   **`PostToolUse`**: The Auditor. Log actions, diff files, or trigger webhooks after execution.
*   **`UserPromptSubmit`**: The Context Injector. Add dynamic context to prompts before Claude sees them.
*   **`Stop` / `SessionEnd`**: Cleanup.

**Best Practice:** Chain hooks. Use a `PreToolUse` hook to enforce read-only paths and a `PostToolUse` hook to stream updates to a dashboard.

---

## 4. Agent Orchestration: Subagents
Don't build one massive prompt. Use **Subagents** to isolate context and specialize behavior.

### The Subagent Pattern
1.  **Definition:** Define subagents programmatically in the `agents` map.
2.  **Delegation:** Include `"Task"` in `allowedTools`. Claude uses this tool to spawn the subagent.
3.  **Context Isolation:** Subagents have their own message history. They report the *result* back to the parent, keeping the parent's context window clean.

### Configuration Strategy
*   **Description is Key:** Claude routes tasks based on the `description` field. Be verbose here.
*   **Tool Scoping:** Give the "Researcher" agent only `Read/WebSearch` tools. Give the "Engineer" agent `Bash/Edit` tools.
*   **Model Swapping:** Use lighter models (Haiku) for simple subagents and Opus/Sonnet for the main orchestrator to save costs.

---

## 5. State Management & Reliability
The SDK is designed for long-running, interruptible workflows.

### Session Persistence
*   **Session IDs:** Every query returns a `session_id`. Save this.
*   **Resuming:** Pass `resume: session_id` to `query()` to rehydrate state.
*   **Forking:** Use `forkSession: true` to branch a conversation (e.g., trying two different bug fixes from the same state).

### File Checkpointing (Time Machine)
*   **Enable:** Set `enableFileCheckpointing: true`.
*   **Track:** Capture `message.uuid` from User messages.
*   **Rewind:** Call `rewindFiles(uuid)` to revert the filesystem to the exact state of that checkpoint.
*   **Limitation:** Only tracks `Edit/Write` tools. Does *not* track changes made via `Bash` (e.g., `echo "foo" > bar.txt`).

### Structured Outputs
Do not parse raw text. Use **Structured Outputs** for integration.
*   Define a **JSON Schema** (via Zod/Pydantic).
*   Pass it to `outputFormat`.
*   Claude validates the final response against the schema before returning `message.structured_output`.

---

## 6. Production Deployment & Security
Running an agent that can execute code requires strict isolation.

### The Isolation Hierarchy
1.  **Process (Weak):** Running locally. Dangerous.
2.  **Sandbox Runtime (Better):** Uses OS-level primitives (Bubblewrap/Seatbelt) to restrict file/network access.
3.  **Containers (Standard):** Docker with no networking (`--network none`) and read-only mounts.
4.  **MicroVMs (Best):** Firecracker/gVisor. Mandatory for multi-tenant SaaS.

### Network Security
*   **The Proxy Pattern:** The agent should **never** hold API keys.
*   **Implementation:** Route agent traffic through a local proxy (Envoy/Squid). The proxy holds the keys and injects them into outgoing requests.
*   **Env Vars:** Use `HTTP_PROXY` and `ANTHROPIC_BASE_URL` to force traffic through your gateway.

### Cost Tracking
*   **Token Attribution:** Usage is reported on `assistant` messages.
*   **Deduplication:** Multiple tool uses in one turn share the same `message.id`. **Only charge once per ID.**
*   **Total Cost:** The final `Result` message contains the authoritative `total_cost_usd` for the session.

---

## 7. Common Recipes

### A. The "ReadOnly Analyst"
*   **Goal:** Safe code analysis without risk of modification.
*   **Config:** `allowedTools: ["Read", "Grep", "Glob", "LS"]`.
*   **Permissions:** `permissionMode: "bypassPermissions"` (Safe because tools are read-only).

### B. The "CI/CD Fixer"
*   **Goal:** Fix a specific linting error in a pipeline.
*   **Config:** Single-turn mode.
*   **Input:** Stream the lint error log + `repository path`.
*   **Subagents:** Spawn a "Linter" subagent restricted to that specific file.
*   **Output:** Structured JSON containing the `git patch`.

### C. The "Interactive Dev Bot"
*   **Goal:** A CLI assistant that asks for help when stuck.
*   **Config:** `streaming` mode enabled.
*   **Tools:** Include `AskUserQuestion`.
*   **Callback:** Implement `canUseTool` to render questions to the user's terminal and await input (`y/n` or text).

### D. The "Audited Operator"
*   **Goal:** production ops with audit trails.
*   **Hooks:**
    *   `PreToolUse`: Check if command contains `sudo` or accesses `/etc`. Deny if true.
    *   `PostToolUse`: JSON serialize input/output and push to Splunk/Datadog.


---

## 8. Memory & Instructions (The Brain)
You cannot rely on the default system prompt for domain-specific agents. You must inject context. The SDK offers three distinct mechanisms for this, with specific hierarchy rules.

### A. Project Context (`CLAUDE.md`)
*   **Purpose:** Long-term memory for a specific repository. Stores coding standards, build commands, and architectural patterns.
*   **Location:** `.claude/CLAUDE.md` in the project root.
*   **The Gotcha:** The SDK does **not** load this by default. You must explicitly configure `settingSources` in the options.
    ```typescript
    // TypeScript
    options: {
      settingSources: ["project"], // Mandatory to read CLAUDE.md
      // ...
    }
    ```

### B. Output Styles (Personas)
*   **Purpose:** Reusable personas across different projects (e.g., "Senior React Dev", "Security Auditor").
*   **Mechanism:** Markdown files stored in `~/.claude/output-styles/`.
*   **Usage:** Useful for standardizing agent behavior across a team via shared config files.

### C. Runtime System Prompt
*   **Purpose:** Session-specific instructions.
*   **Pattern:** Do not overwrite the default prompt entirely, or you lose tool definitions. Use the **Append** pattern.
    ```python
    # Python
    system_prompt={
        "type": "preset",
        "preset": "claude_code", # Keeps built-in tool instructions
        "append": "Focus strictly on OWASP Top 10 vulnerabilities."
    }
    ```

---

## 9. Advanced Input Patterns
The SDK supports two input modes. Choosing the wrong one is a common architectural mistake.

### Mode A: Streaming Input (Recommended)
This is a persistent, interactive session.
*   **Capabilities:** Supports **Image Uploads**, **Interruption**, **Message Queueing**, and **Hooks**.
*   **Requirement:** You must use this mode if you want to implement the `canUseTool` callback or handle user interaction loop.
*   **Implementation:** Pass an AsyncGenerator to the `prompt` argument.

### Mode B: Single Message Input
A "One-Shot" query.
*   **Use Case:** Stateless Lambda functions, simple cron jobs.
*   **Limitation:** Cannot handle image attachments or complex multi-turn user interruptions effectively.

---

## 10. Plugins & Extensibility
Plugins are packages of commands, agents, and MCP servers.

*   **Loading:** Plugins are loaded from local paths via the `plugins` option array.
*   **Namespacing:** Plugin commands are automatically namespaced to prevent collisions (e.g., `/my-plugin:deploy` vs `/deploy`).
*   **Verification:** Check `message.slash_commands` in the `init` event to confirm successful loading.

---

## 11. Troubleshooting & Anti-Patterns

### The "Silent Failure" Anti-Pattern
**Issue:** The agent performs an action, but the SDK returns nothing or hangs.
**Diagnosis:** The agent is waiting for a `canUseTool` decision, but no callback was provided, or the callback timed out (60s limit).
**Fix:** Always implement a `canUseTool` callback or set `permissionMode` to `dontAsk` (to fail fast) or `acceptEdits` (to proceed).

### The "Infinite Loop" Anti-Pattern
**Issue:** The agent gets stuck trying the same failing command repeatedly.
**Diagnosis:** The agent isn't receiving the error signal effectively, or the `maxTurns` is set too high.
**Fix:**
1.  Set a reasonable `maxTurns` (default is high; set to 10-20 for focused tasks).
2.  Use a `PostToolUse` hook to detect consecutive failures of the same tool and force a `Stop` signal.

### The "Context Overflow" Anti-Pattern
**Issue:** Long-running sessions degrade in performance and increase cost.
**Fix:**
1.  Use the `/compact` slash command periodically.
2.  Use **Subagents** to fork execution; when a subagent finishes, only the summary returns to the parent, garbage collecting the subagent's verbose history.

---

## 12. The Tech Lead’s Launch Checklist

Before promoting your agent to production, verify these points:

1.  **[ ] Isolation:** Is the agent running in a container with `--network none` (or strict firewall rules) and a proxy for API access?
2.  **[ ] Secrets:** Have you ensured **no** API keys or `.env` files are mounted into the container's volume?
3.  **[ ] Limits:** Is `maxTurns` configured to prevent runaway billing loops?
4.  **[ ] Permissions:** Is `permissionMode` explicitly set? (Never rely on `default` in headless environments).
5.  **[ ] Checkpointing:** Is `enableFileCheckpointing` on? (Crucial for undoing bad code edits).
6.  **[ ] Cost:** Are you logging the `modelUsage` from the final result message for billing attribution?
7.  **[ ] Timeout:** Does your `canUseTool` callback handle timeouts gracefully (default 60s)?
8.  **[ ] Context:** Are you loading `settingSources: ['project']` so the agent respects the repository's `CLAUDE.md`?

---

