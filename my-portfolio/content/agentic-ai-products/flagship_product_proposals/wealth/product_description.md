# Wealth Management — “Supervised Wealth Planner Copilot”

> Positioning: **planning + scenario analysis + execution assistance**, not “autonomous trading.”

## 1) Executive snapshot
**ICP:** independent wealth planners, RIAs, family offices, HNW individuals (with advisor oversight)  
**Wedge workflow:** “Monthly review pack + rebalancing proposal + documentation.”  
**Autonomy:** **Supervised autopilot** (agent drafts proposals; explicit approval for execution and client-facing outputs).

**KPIs**
- time-to-review pack
- compliance completeness
- error rate in calculations / allocations

## 2) Product experience & UX
Advisor cockpit: intake → scenarios → proposal → approval → publish.  
Trust UI: assumptions panel + citations + compliance checklist.

## 3) Agent design map
Skills: planner, risk manager, tax-aware reviewer (non-tax advice), compliance reviewer  
Subagents: market data retriever, scenario engine, report generator, drift detector

## 4) Tool & data plane (MCP-centric)
Market data, holdings (read-only), CRM notes/KYC, disclosures/policies repo.

## 5) Context engineering plan
Pinned: IPS/risk constraints/prohibited assets/disclosures  
JIT: latest holdings + market indicators  
Immutable decision log: inputs + assumptions + versions per recommendation

## 6) Evals & observability
Offline: math correctness + constraint adherence + policy tests  
Online: advisor edit distance, blocked approvals, p95 cost/pack, safety flags

## 7) Failure modes & mitigations
| What breaks | Detect | Constrain | Prevent regression |
|---|---|---|---|
| Ungrounded recommendations | citation/assumption checks | proposal-only mode until approval | golden set + stress scenarios |
| Unauthorized execution | tool audits | execution tools off by default; approvals | CI policy tests |
| Prompt injection via docs | OWASP detectors | sanitize + isolate; least privilege | adversarial injection eval pack |
| Compliance gaps | checklist validator | block publish unless complete | compliance regression tests |

## 8) Governance posture & rollout
High-risk posture: strong HITL, logging, and oversight by design.  
Rollout: shadow mode → advisor-only beta → limited client publish → broader rollout.  
Kill switch per capability (execute trades, send client email).

## 9) Business case + distribution loops
ROI: advisor hours saved + reduced errors + faster turnaround  
Pricing: per advisor seat + per client case  
Loops: client invites, review-pack templates, CRM embedded loop


## 10) Where RFT helps

* **Rule-following under complex constraints** (tax, risk tolerance, liquidity, drawdown limits).
* **Decision discipline**: consistent behavior under volatility, fewer inconsistent recommendations across turns.
* **Verification-first behavior**: prefer “check + cite + simulate” over guessing.

**What you train on (signals):**

* Trajectories: goals → profile → constraints → portfolio proposal → scenario checks → rebalance plan.
* Graders:

  * Constraint satisfaction (hard checks)
  * Policy compliance (no forbidden advice flows, proper disclaimers)
  * Portfolio sanity checks (risk/return proxies, diversification heuristics)
  * Cost/latency penalties for over-tooling

**Business metrics it can lift:**

* Higher *plan completion rate* (users reaching an actionable plan)
* Lower *support escalations* / compliance incidents
* Improved *conversion* to premium planning / advisory workflows (trust + reliability)
