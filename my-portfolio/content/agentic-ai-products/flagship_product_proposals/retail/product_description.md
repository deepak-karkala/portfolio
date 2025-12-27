# FMCG / Retail — “Margin & Inventory Operating System”

## 1) Executive snapshot
ICP: retail ops, category managers, planners  
Wedge: weekly trading meeting pack + exception actions  
Autonomy: supervised autopilot for writes; copilot for analysis

KPIs: stockouts↓, overstocks↓, margin↑, forecast error↓

## 2) Product experience & UX
Operating room: ingest → detect exceptions → propose actions → approve → execute.  
Outputs: dashboard + weekly pack + action queue.

## 3) Agent design map
Skills: demand planner, pricing analyst, inventory optimizer, supply chain coordinator, finance partner  
Subagents: data QA, forecast, promo impact, supplier outreach, meeting pack generator

## 4) Tool & data plane (MCP-centric)
POS/ERP, pricing/promo systems, supplier/3PL portals, BI warehouse, ticketing/email.

## 5) Context engineering plan
Pinned: business rules + KPI defs; JIT: SKU windows + ETAs; compaction via artifacts; isolate data-heavy tasks.

## 6) Evals & observability
Backtests; policy checks; “what would you do” historical eval set.  
Online: action acceptance + post-action outcomes + tool write error rate.

## 7) Failure modes & mitigations
| What breaks | Detect | Constrain | Prevent regression |
|---|---|---|---|
| Bad data → wrong actions | QA + freshness flags | block actions; manual review | data replay tests |
| KPI tunnel vision | multi-objective checks | require tradeoff rationale | constrained evals |
| ERP write mistakes | dry-run diffs | approvals + idempotency | contract tests |
| Prompt injection via docs | OWASP detectors | sanitize tool outputs | adversarial packs |

## 8) Governance posture & rollout
Read-only first → gated writes → rollout by category/region → rollback per tool.

## 9) Business case + distribution loops
ROI: stockout reduction + markdown reduction + reduced expedite costs  
Pricing: per site/category manager + execution add-on  
Loops: embedded trading meeting workflow; supplier collaboration


## 10) Where RFT helps

* **Tool sequencing & analysis planning**: pick the right query, right slice, right baseline first.
* **Operational robustness**: fewer broken analyses due to missing joins, wrong time windows, metric leakage.
* **Automation with guardrails**: safe autonomy under governance (approvals for price changes, vendor actions).

**What you train on (signals):**

* Trajectories: question → data pull → feature checks → model/forecast → recommendation → approval → outcome.
* Graders:

  * SQL/data correctness (execution + invariants)
  * Forecast evaluation proxies (backtest score, calibration)
  * Policy compliance (pricing floors/ceilings, promo constraints)
  * Business impact proxy (expected margin / stockout reduction)

**Business metrics it can lift:**

* Lower *stockouts* and *overstock* via better decision quality
* Faster *time-to-insight* for category managers
* Higher *margin* through fewer pricing mistakes and better promo targeting

