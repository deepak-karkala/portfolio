# Build My Home Copilot

**An Agentic Home-Building Operating System for Transparency, Planning, and Trust**

> **Positioning**
> *“A supervised agentic platform that helps homeowners plan, budget, design, and execute home construction projects with full transparency — coordinating architects, engineers, contractors, and vendors while keeping humans in control.”*

---

## 1) Executive snapshot

**ICP**

* Aspiring home builders
* Homeowners undertaking self-builds or major renovations
* Premium architects / design–build firms (as a client-facing platform)

**Primary Job-to-be-Done**

> “Plan and build my home **on time and within budget**, without getting blindsided by hidden costs, delays, or opaque decisions.”

**Wedge workflow**
End-to-end **Home Build Planning Pack**:

* scope definition
* budget & timeline estimation
* design coordination
* vendor comparison
* execution plan with checkpoints

**Why an agentic system (vs spreadsheets, WhatsApp, or portals)**

* Home building is **long-horizon, constraint-heavy, and sequential**
* Decisions compound (early design mistakes → costly rework later)
* Requires **planning, critique, simulation, coordination, and approvals**

**Autonomy level**
**Supervised Autopilot**

* Agents propose plans, estimates, schedules, and vendor options
* Humans approve designs, budgets, contracts, and payments

**North-star KPIs**

* budget deviation (% overrun)
* timeline deviation (weeks delayed)
* rework incidents
* homeowner trust score (approval without edits)

---

## 2) Product experience & UX

**Core UX paradigm**

> *“A transparent control tower for your home build.”*

**Primary surfaces**

* **Project Dashboard** (scope, budget, timeline health)
* **Collaborative Group Chat** (Homeowner + Architect + Engineer + Contractor + Copilot)
* **Artifacts Panel** (plans, BoQs, estimates, contracts, permits)
* **Decision Review Drawer** (approve/reject with rationale)
* **Change Impact Viewer** (“If you change X, cost/time changes by Y”)

**UX principles**

* Radical transparency (no black-box estimates)
* Change impact before commitment
* Every decision is explainable and reversible (where possible)
* Human approval for all irreversible actions

---

## 3) Agent design map

### Skills (domain expertise)

* Architect (layout, design tradeoffs)
* Structural Engineer (safety, feasibility)
* MEP Engineer (electrical, plumbing, HVAC)
* Cost Estimator / Quantity Surveyor
* Project Planner (schedule, dependencies)
* Procurement Specialist (vendors, materials)
* Legal/Compliance Reviewer (permits, contracts)

### Subagents (executors)

* **Requirements Interpreter** (family size, lifestyle, constraints)
* **Design Validator** (checks design vs regulations)
* **Cost Estimation Agent** (BoQ, regional price benchmarks)
* **Timeline Planner** (critical path, dependencies)
* **Vendor Comparison Agent** (quotes, reviews, risks)
* **Change Impact Analyzer** (delta cost/time/risk)
* **Document Generator** (contracts, milestone plans)

### Planner / Orchestrator

* milestone-based state machine:

  1. scope → 2. design → 3. estimate → 4. vendor selection → 5. execution → 6. handover
* interruptible with HITL at every milestone
* checkpointed for replay and audit

---

## 4) Tool & data plane (MCP-centric)

**MCP integrations**

* Local building codes & zoning rules
* Material price databases (region-specific)
* Vendor / contractor directories
* CAD / plan viewers (read-only)
* Document & contract repositories
* Scheduling & payment milestone tools

**Tool design philosophy**

* read-only by default
* dry-run previews for estimates and schedules
* explicit approvals for contract generation and payments

---

## 5) Context engineering plan

**Pinned context**

* homeowner requirements & constraints
* approved designs and drawings
* regional regulations
* agreed budget ceiling and timeline

**Just-in-time retrieval**

* material prices
* vendor quotes
* permit requirements per phase

**Compaction**

* long discussions summarized into “Decision Logs”
* superseded plans archived but referenced by version

**Isolation**

* cost agent sees prices, not personal family data
* legal agent sees contracts, not private notes

---

## 6) Evals & observability

**Offline evals**

* cost estimation accuracy vs historical builds
* schedule realism (critical path sanity)
* regulation compliance checks
* vendor recommendation quality

**Online metrics**

* approval-without-edit rate
* number of late-stage changes
* cost delta after approvals
* agent recommendation acceptance rate

**Tracing**

* every estimate → sources → assumptions → versions
* every change → impact analysis → approval record

---

## 7) Failure modes & mitigations

| What breaks                  | Detect                     | Constrain                 | Prevent regression          |
| ---------------------------- | -------------------------- | ------------------------- | --------------------------- |
| Unrealistic cost estimates   | benchmark deviation alerts | approval gates            | replay past overruns        |
| Hidden dependencies          | schedule conflict checks   | block execution           | dependency regression tests |
| Vendor bias or hallucination | source citation + reviews  | limit to verified vendors | adversarial evals           |
| Scope creep                  | change frequency metrics   | change impact preview     | enforce milestone locks     |
| Trust erosion                | edit/reject signals        | slow down autonomy        | retrain planning policy     |

---

## 8) Governance posture & rollout

* **Permissions**: agents cannot sign contracts or trigger payments
* **Approvals**: homeowner + professional sign-off for milestones
* **Audit trail**: immutable logs of estimates, changes, approvals
* **Rollout**:

  * design-only mode → estimation mode → execution planning
* **Kill switches**:

  * stop vendor recommendations
  * stop schedule recalculation

This mirrors **real construction governance**, not consumer “AI magic”.

---

## 9) Business case & distribution

**ROI**

* fewer cost overruns
* reduced rework
* faster project completion
* higher homeowner confidence and satisfaction

**Pricing**

* per project (home build)
* premium tier for vendor coordination + execution planning
* enterprise tier for architecture/design–build firms

**Distribution loops**

* homeowners invite architects/contractors (collaboration loop)
* completed project templates reused (data loop)
* referrals from satisfied homeowners (trust loop)

---

## Why Agentic RL is a strong fit here

Home construction is:

* **long-horizon** (months to years)
* **multi-stage**
* **outcome-verifiable** (final cost, delay, satisfaction)
* **expert-reviewed** (approvals at each milestone)

This makes it ideal for **Agentic RL / RFT**, as described in the agentic RL survey and OpenAI RFT guidance.

---

## What Agentic RL optimizes

Instead of just “better explanations,” RL optimizes **project-planning behavior**:

* better sequencing of decisions
* earlier detection of downstream risks
* more conservative estimates where historically needed
* fewer late-stage design changes
* smarter escalation to human experts

---

## Agentic RL training loop (home domain)

**Trajectories**

* requirements → design → estimate → vendor selection → execution plan → outcome

**Graders**

* cost accuracy vs final outcome
* schedule accuracy
* number of reworks
* homeowner approval signals
* safety/compliance adherence

**Anti-gaming**

* multi-grader reward stack
* holdout projects
* delayed rewards (final build outcome)

---

## Expected business lift from Agentic RL

| Metric             | Baseline      | With RL      |
| ------------------ | ------------- | ------------ |
| Cost overrun       | High variance | ↓ 20–40%     |
| Late-stage changes | Frequent      | ↓ 30–50%     |
| Timeline slippage  | Common        | ↓ materially |
| Homeowner trust    | Moderate      | High         |
| Repeat/referrals   | Low           | High         |

**Key insight**

> Agentic RL turns the copilot into a *learning construction manager* that improves with every completed project.

---
