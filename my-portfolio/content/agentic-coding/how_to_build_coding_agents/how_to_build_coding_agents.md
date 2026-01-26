---
title: 'How to Build Coding Agents'
summary: 'Complete playbook covering architecture, training, evals, and observability'
date: '2024-01-15'
category: 'Educational'
---

# Building Modern Coding Agents like Claude Code & Cursor — Ultimate Playbook (2025–2026)

> Audience: Tech Leads, Senior Engineers, CTO-minded builders  
> Goal: A **production-grade** blueprint for building coding agents (CLI-native like Claude Code, IDE-native like Cursor) with **architecture, training, evals, observability, and failure models**.

---

## 0) What changed (the real reasons agents got good)

Modern coding agents improved because builders shifted to:

- **Master-loop agents** (simple loop + tools) instead of brittle orchestration DAGs.
- **Verification-first** workflows (tests/linters/runtime checks as ground truth).
- **Context as the bottleneck**: systems are designed around *preventing context pollution* and *retrieving the right code slices fast*.

---

## 1) Reference architecture (what to build)

### 1.1 High-level system architecture

![High-level system architecture](/agentic-coding/how_to_build_coding_agents/img/diagram-1.png)

### 1.2 The “Master Loop” runtime (the core engine)

This is the minimal control flow that wins in practice:

1. Model decides next action
2. Tool executes
3. Tool output becomes observation
4. Verify & iterate until done

#### Canonical master-loop pseudocode

```python
def agent_run(task, tools, verifier, budget):
    state = {
        "todo": [],
        "summary": "",
        "attempts": 0,
        "artifacts": [],
    }

    trace = start_trace(task_type=task.type)

    while state["attempts"] < budget.max_steps:
        state["attempts"] += 1

        # 1) Build context with anti-pollution safeguards
        ctx = build_context(task, state, max_tokens=budget.ctx_tokens)

        # 2) Decide next action
        with trace.span("llm_decide"):
            action = llm_decide(ctx)  # -> {tool,args} OR {final} OR {ask_user}

        if action.type == "final":
            end_trace(trace, status="success")
            return action.output

        if action.type == "ask_user":
            end_trace(trace, status="needs_human")
            return action.question

        # 3) Tool execution (with schema validation)
        tool = tools[action.tool]
        with trace.span("tool_call", tool=action.tool):
            obs = tool.exec(action.args)

        # 4) Update state (and compress noisy outputs)
        state = update_state(state, obs)
        state["summary"] = compress_if_needed(state["summary"], obs, budget)

        # 5) Verification-triggered loop (key for coding agents)
        if should_verify(obs, state):
            with trace.span("verify"):
                v = verifier.run()

            state = update_state(state, v)
            if v.passed and is_task_done(task, state):
                end_trace(trace, status="success")
                return make_final_report(task, state)

    end_trace(trace, status="budget_exhausted")
    return make_partial_report(task, state)
```

---

## 2) UX modalities: CLI-native vs IDE-native

### 2.1 CLI-native (Claude Code-style)

Best for repo-wide refactors, migrations, debugging, “outer loop” automation.

**Core UX primitives**

* slash commands (`/review`, `/fix`, `/test`)
* clear permission prompts (especially for writes + `run`)
* artifact diffs + change summaries

### 2.2 IDE-native (Cursor-style)

Best for low-latency editing, autocomplete, inline diffs, IDE-aware navigation.

**Core UX primitives**

* inline completions
* editor-native context extraction
* always-on index freshness

---

## 3) Tools: build “human-like” tools first

### 3.1 Minimum viable toolset

* `read_range(path, start, end)`
* `grep(query, include_globs, exclude_globs)`
* `edit_patch(diff)` (atomic apply, clear failure modes)
* `run(cmd)` (sandboxed)
* `subagent(task)` (context isolation)
* optional: `web_fetch(url)` (usually isolated / gated)

### 3.2 Tool interface contract (typed + safe)

```python
from dataclasses import dataclass
from typing import Any, Dict, Literal

ToolName = Literal["read_range", "grep", "edit_patch", "run", "subagent"]

@dataclass
class ToolResult:
    ok: bool
    exit_code: int
    stdout: str
    stderr: str
    meta: Dict[str, Any]  # latency_ms, file_paths, bytes_read, etc.

class Tool:
    name: ToolName
    def validate(self, args: Dict[str, Any]) -> None: ...
    def exec(self, args: Dict[str, Any]) -> ToolResult: ...

class EditPatch(Tool):
    name: ToolName = "edit_patch"

    def validate(self, args):
        assert "diff" in args and isinstance(args["diff"], str)

    def exec(self, args):
        # apply diff atomically; return ok/exit_code
        ...
```

---

## 4) The agent loop in action (end-to-end sequence)

![Agent loop sequence](/agentic-coding/how_to_build_coding_agents/img/diagram-2.png)

---

## 5) Context management (the actual hard part)

### 5.1 Context builder with anti-pollution patterns

![Context builder with anti-pollution patterns](/agentic-coding/how_to_build_coding_agents/img/diagram-3.png)

### 5.2 Practical context rules (ship these defaults)

* Cap per-file context (prevents single file domination)
* Prefer *many small slices* over *one giant paste*
* Summarize tool outputs aggressively (especially stderr)
* Use subagents for exploration; return distilled findings

---

## 6) Cursor-style indexing & sync (freshness is everything)

### 6.1 Merkle-based incremental sync

![Merkle-based incremental sync](/agentic-coding/how_to_build_coding_agents/img/diagram-4.png)

**Why it matters:** stale indexes = wrong retrieval = confident wrong edits.

---

## 7) Verification ladder (how agents become reliable)

### 7.1 The ladder

1. format/lint
2. unit tests
3. integration/build
4. runtime/e2e (when relevant)
5. human checkpoints (merge gates)

**Key behavior:** failures are observations → agent loops until green.

---

## 8) Training: how to “make” a coding agent

### 8.1 Training stack (layered)

1. base pretraining (code + text)
2. instruction tuning (tool-use formatting, patch edits, repo tasks)
3. outcome supervision / RL:

   * reward: tests pass, task completes, fewer steps, correct tool use
   * penalty: thrashing, unsafe commands, excessive tokens/tool calls

### 8.2 Production-parity RL infra (trainer + inference + env fleet)

![Production-parity RL infra](/agentic-coding/how_to_build_coding_agents/img/diagram-5.png)

**Build lesson:** infrastructure is part of the ML problem (async rollouts, sandbox fleets, tool reliability).

---

## 9) Evals: don’t fool yourself

### 9.1 What to measure (minimum set)

**Task success**

* completed rate
* accepted-without-human-edits rate

**Correctness**

* tests pass rate
* lint/typecheck pass rate

**Efficiency**

* time-to-first-useful-change
* tool-call count
* tokens consumed (cost proxy)

**Retrieval quality**

* did it open the right files?
* chunk precision / rerank effectiveness

**Recovery behavior**

* does it converge or thrash after failures?

### 9.2 Eval pipeline diagram

![Eval pipeline diagram](/agentic-coding/how_to_build_coding_agents/img/diagram-6.png)

---

## 10) Observability: treat agents like distributed systems

### 10.1 Trace model + tools + verifiers as one transaction

![Trace model sequence](/agentic-coding/how_to_build_coding_agents/img/diagram-7.png)

### 10.2 Trace schema (practical, debuggable)

```json
{
  "run_id": "uuid",
  "task_type": "bugfix|refactor|feature|debug",
  "repo": {"language_mix": ["py", "ts"], "size_loc": 120000},
  "model": {"name": "X", "temperature": 0.2},
  "status": "success|fail|needs_human|budget_exhausted",
  "metrics": {
    "wall_time_ms": 182000,
    "tokens_in": 54000,
    "tokens_out": 12000,
    "tool_calls": 37,
    "patch_applies_failed": 1
  },
  "spans": [
    {
      "name": "llm_decide",
      "meta": {"tokens_in": 4500, "tokens_out": 420, "latency_ms": 820}
    },
    {
      "name": "tool_call",
      "meta": {"tool": "run", "cmd": "pytest -k auth", "exit_code": 1, "latency_ms": 24000}
    },
    {
      "name": "verify",
      "meta": {"passed": false, "failures": ["test_auth_refresh_token"], "latency_ms": 3100}
    }
  ]
}
```

### 10.3 Two dashboards you should ship early

* **Reliability**: tool failure rate, verifier failure rate, success rate by repo size/lang
* **Efficiency**: cost per success (tokens + tool calls), p95 latency, steps to converge

---

## 11) Failure models (how these systems break) + defenses

![Failure models and defenses](/agentic-coding/how_to_build_coding_agents/img/diagram-8.png)

---

## 12) Build roadmap (phased delivery)

![Coding agent build roadmap](/agentic-coding/how_to_build_coding_agents/img/diagram-9.png)

---

## 13) Quick mapping: what to copy from Claude Code vs Cursor

### Copy from Claude Code-like systems

* Minimalist master loop
* Bash as universal tool + human-like tools
* Aggressive context anti-pollution (compression + subagents)
* Project instruction files + slash commands to steer behavior

### Copy from Cursor-like systems

* Index freshness as a product feature (sync + incremental updates)
* IDE-native affordances (inline diffs, low-latency UX)
* Server-side orchestration with careful “least code necessary” transfer
* Parallel reads + faster inner loop

---

## Appendix: Practical defaults (recommended)

**Model settings**

* temperature: low (0.0–0.3) for edits + debugging
* deterministic tool output parsing (schemas)

**Safety**

* auto-allow reads/grep; gate writes/run; approve risky commands
* sandbox `run` with locked-down filesystem/network

**Context**

* cap per-file tokens; prefer many small slices
* summarize stderr; keep only actionable lines
* isolate exploration via subagents

**Verification**

* “no green, no done” policy (tests/lint)
* rerun flaky tests with backoff and annotate uncertainty

---
