# Agentic AI Product template

### 1) Executive snapshot (1 screen)

* **ICP + Job-to-be-done**
* **Wedge workflow**
* **Why an agent (vs chatbot / RPA / dashboards)**
* **2–3 measurable KPI targets**
* **Autonomy level** (Copilot / Supervised Autopilot / Autopilot)

### 2) Product experience and UX

* Core UX flow: *Plan → Preview → Approve → Execute → Report*
* **Ambiguity handling**: what the agent asks vs assumes
* **Artifacts**: what gets created/stored/shared
* **“Trust UI”**: citations, diffs, undo, audit view

### 3) Agent design map

* **Skills**: domain roles (what “expertise” exists)
* **Subagents**: executors/specialists (what runs isolated)
* **Planner/Router**: orchestration policy (when to delegate)
* **Autonomy boundaries**: which actions are proposal-only vs executable

### 4) Tool & data plane (MCP-centric)

* Which systems connect via **MCP servers** (CRM, ERP, POS, market data, docs)
* Tool contracts: schemas, rate limits, idempotency
* Security notes: injection resistance + tool-output validation
  MCP is now a mainstream integration story (open standard, ecosystem), so highlighting it is a real differentiator.

### 5) Context engineering

* Project artifacts model (source of truth vs working context)
* Retrieval strategy (what’s pinned vs pulled JIT)
* Compaction/summarization policy
* Long-horizon consistency strategy (state object, file handles, event log)

### 6) Evals and observability

* Offline eval suite (golden tasks + adversarial + rubric)
* Online metrics: success rate, intervention rate, p95 cost/task, p95 latency, safety flags
* Trace schema: tool calls, approvals, versions, replayability

### 7) Failure modes & mitigations

Use a consistent table: **What breaks → Detect → Constrain → Prevent regression**
Tie at least one failure mode to OWASP LLM risks like prompt injection + sensitive data disclosure.

### 8) Governance posture and rollout

* Permissions (least privilege, env separation)
* Approvals (HITL gates; interrupt/resume)
* Audit trails (immutable logs, version hashes, retention)
* Rollout: feature flags → canary → A/B → rollback → kill switch
  EU AI Act deployer obligations emphasize logging and human oversight for high-risk systems; it’s a useful “gold standard” reference even outside EU.

### 9) Business case (ROI + distribution)

* ROI model (time saved, error reduction, margin lift, risk avoidance)
* Pricing model aligned to **cost per successful outcome**
* Distribution loops (your “3-layer distribution framework”): wedge → loop → moat

---


