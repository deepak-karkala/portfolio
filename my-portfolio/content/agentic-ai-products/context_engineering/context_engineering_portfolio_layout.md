---
title: "Context Engineering"
subtitle: "A portfolio-ready playbook for building reliable long-running agents."
series: "Building Effective AI Agents"
version: "v1.0"
last_updated: "2025-12-20"
layout_hint: "hero + 3 card grids + collapsibles + sidebar toc"
---

<!-- ===================== -->
<!-- SIDEBAR TOC (sticky)  -->
<!-- ===================== -->

<nav class="sidebar-toc">

- [Why context engineering](#why-context-engineering)
- [The 3 big mental models](#the-3-big-mental-models)
- [3 card grids](#3-card-grids)
  - [Architecture](#card-grid-1-architecture)
  - [Techniques](#card-grid-2-techniques)
  - [Operations & governance](#card-grid-3-operations--governance)
- [Deep dives](#deep-dives)
  - [Failure modes & mitigations](#failure-modes--mitigations)
  - [Governance posture](#governance-posture)
  - [Templates](#templates)
- [Further reading](#further-reading)

</nav>

<!-- ===================== -->
<!-- HERO                 -->
<!-- ===================== -->

# Context Engineering
**Build agents that stay fast, focused, and safe as tasks stretch across long horizons.**

<div class="hero-metrics">

- ⚡ **Cost/latency control** via token discipline + cache-friendly context
- 🎯 **Higher reliability** by selecting the minimum context needed *per step*
- 🧾 **Auditability** with structured events, approvals, and rollbacks

</div>

---

## Why context engineering

Most agent failures aren’t “model intelligence” issues — they’re **context problems**:
- too much irrelevant context → slow + wrong decisions
- too little context → hallucinations
- unstable context (tool defs change, prefixes move) → cache misses + drift

**Definition:** context engineering is curating the *optimal set of tokens and tools* for the next step, while keeping everything else durable and retrievable.

---

## The 3 big mental models

<div class="callout">

### 🧠 Model 1 — Context is a *compiled view*
Sources of truth (session, artifacts, memory) → processors → working context (per call)

### 🎛️ Model 2 — 4 knobs
**Write → Select → Compress → Isolate** (you will use all four)

### 🧰 Model 3 — Handles, not dumps
Store big things (files, tool outputs) externally; keep only **handles + summaries** in the model window.

</div>

```mermaid
flowchart TB
  subgraph Sources["Sources"]
    S[Session events]
    A[Artifacts / Files]
    M[Memory]
  end
  subgraph Compile["Context compiler"]
    Sel[Select] --> Tr[Transform] --> Com[Compress] --> Fmt[Format]
  end
  Sources --> Compile --> WC[Working context (this call)]
```

---

# 3 card grids

## Card Grid 1: Architecture

<table>
<tr>
<td width="33%">

### 🧱 Tiered context stack
- Session log (events)
- Artifacts/filesystem (infinite context)
- Memory (long-term recall)
- Working context (compiled view)

</td>
<td width="33%">

### 🏗️ Context compiler pipeline
- explicit processors
- deterministic formatting
- section budgets (prefix/history/retrieval)

</td>
<td width="33%">

### 🔌 Tool harness
- executes tools
- enforces permissions
- captures audit trail
- returns compact results

</td>
</tr>
</table>

## Card Grid 2: Techniques

<table>
<tr>
<td width="33%">

### 💾 Write (offload)
- filesystem scratchpad
- artifact handles + summaries
- structured runtime state

</td>
<td width="33%">

### 🎯 Select (JIT retrieval)
- grep/glob + line-range reads
- memory retrieval with triggers
- tool subset retrieval (optional)

</td>
<td width="33%">

### 🧽 Compress + isolate
- compaction (reversible) first
- summarization (lossy) last
- scoped subagents / agent-as-tool

</td>
</tr>
</table>

## Card Grid 3: Operations & governance

<table>
<tr>
<td width="33%">

### 📈 Observability
- token usage by section
- tool error rate + retries
- schema violation rate
- cache hit rate proxy

</td>
<td width="33%">

### 🧪 Regression prevention
- golden tasks
- long-horizon drift tests
- tool misuse tests
- context stress tests

</td>
<td width="33%">

### 🔐 Safety & governance
- RBAC + allowlists
- approval gates
- immutable audit logs
- canary + rollback triggers

</td>
</tr>
</table>

---

# Deep dives

<details>
<summary><strong>Failure modes & mitigations</strong> (what breaks, detection, constraints, regression)</summary>

### The big 6
- Context poisoning
- Context distraction
- Context confusion
- Context clash
- Context rot
- Telephone effect (multi-agent drift)

### Detect
- token growth by section
- tool error + schema violation spikes
- contradiction linting (system vs memory vs user)
- “user correction” rate as an outcome signal

### Constrain
- structured outputs for tool args
- allowlists + permissions per environment
- human approval for high-impact actions
- step/time/token budgets

### Prevent regression
- every incident becomes: test + guardrail + rollout gate

</details>

<details>
<summary><strong>Governance posture</strong> (permissions, approvals, audit trails, rollout strategy)</summary>

### Permissions
- RBAC → capability policy → tool allowlist
- short-lived credentials, least privilege
- safe mode + kill switch

### Approvals
**Plan → Preview → Approve → Execute → Report**
- external side effects
- security-sensitive actions
- compliance-sensitive domains

### Audit trail
Log everything as events:
- inputs/outputs, tool args/results, file writes, policy decisions
- prompt + model version, tool versions, retrieval IDs

### Rollout
- internal → canary → wider
- feature flags by *tool capability*
- shadow mode for new retrieval/compaction logic

</details>

<details>
<summary><strong>Templates</strong> (copy/paste)</summary>

- Working context contract
- Artifact manifest
- Handoff contract (lead → subagent)
- Compaction policy
- Token budget sheet

</details>

---

## Further reading
(Add links in your site)
- Karpathy on “context engineering”
- Breunig on context failure modes
- LangChain on filesystem tools for agents
- Manus on KV-cache + tool masking + filesystem memory
- Google ADK on tiered context + processors (“context as compiled view”)
- Claude docs on context windows and long context behavior
- Anthropic on multi-agent research systems + long-running harnesses
- NIST AI RMF and EU AI Act human oversight (for governance framing)
