---
title: 'Chapter 5: A/B Testing for ML Models'
summary: 'Practical playbook for running experiments on production ML systems: design, randomization, analysis, and common pitfalls'
date: '2024-12-29'
order: 5
excerpt: 'Master the complete workflow for A/B testing ML models from experiment design to statistical analysis and decision-making'
---

# A/B testing playbook for ML models

##


An online ML A/B test is **causal inference with operational constraints**:

* Randomization creates comparable groups (causality)
* Sizing controls false alarms + misses (statistics)
* Instrumentation + invariants prevent “invalid wins” (systems)

**Golden rule:** randomize at the **unit of interference** (usually user), analyze at that same unit.

---

### 1) Design & sizing

#### 1.1 Define the decision first

Write down:

* **Primary metric** (one)
* **Guardrails** (a few)
* **Ship rule** (example): “Ship if +MDE on primary with 95% CI excluding 0, and no guardrail regression beyond tolerance.”

This prevents p-hacking and metric shopping.

---

#### 1.2 MDE, α, power → sample size

###### Definitions

* **MDE**: minimum detectable effect you care about (practical).
* **α**: false positive tolerance (often 0.05).
* **Power (1−β)**: probability to detect MDE (often 0.8 or 0.9).

###### Sizing intuition

Sample size grows fast when:

* baseline rate is low (rare conversions)
* variance is high (AOV, latency)
* MDE is tiny (trying to detect 0.1% lift)

**Heuristic:** decide MDE from business value and guardrail risk; don’t size for “whatever is detectable.”

###### Approx sizing formulas (useful in conversation)

**Two-proportion (CTR/conversion)**
Let baseline (p), target lift (Δ). Roughly:

n ∝ p(1 - p) / Δ²

(per arm, constant depends on z-scores for α and power)

**Mean metrics (AOV, latency)**

n ∝ σ² / Δ²

where (σ) is std dev of the per-unit metric.

**Key production point:** compute σ on the *right unit* (user-level aggregates), not raw events.

---

#### 1.3 Duration

Duration isn’t just “n / traffic”. You must cover:

* day-of-week cycles
* seasonality/campaigns
* delayed outcomes (conversion lag)

**Heuristic:** minimum 1–2 full weekly cycles for consumer products; more if strong seasonality or delayed conversion.

---

#### 1.4 Variance estimation & CUPED

###### CUPED (variance reduction)

Use a pre-experiment covariate correlated with the metric (e.g., user’s past 7-day spend) to reduce variance:

* Adjust metric by removing predictable part from baseline behavior.
* Same mean effect, lower variance → smaller sample required.

**Heuristic:** CUPED is high ROI if metric is noisy and you have good pre-period covariates.

---

#### 1.5 Randomization unit: user vs session vs request

* **User-level**: default for most ML changes (avoids contamination).
* **Session-level**: only if sessions are independent and you can tolerate cross-session contamination.
* **Request-level**: generally risky for ranking/recs (user sees both variants → interference).

**Rule:** choose the unit where treatment does **not spill over**.

---

#### 1.6 Stratification / blocking / cluster-randomization

###### Stratify when

You have known high-variance segments (geo/device/new vs returning). Ensures balance and improves power.

###### Cluster randomization

If interference exists within clusters (household, company account, marketplace network), randomize at cluster.

**Heuristic:** if users can influence each other’s experience, user-level randomization may still be invalid.

---

#### 1.7 SRM (Sample Ratio Mismatch)

SRM = your traffic split is not what you intended (50/50 becomes 52/48). Often indicates:

* bucketing bug
* filtering differences
* instrumentation issues
* bots/routing differences

**Practical**

* Always run an SRM check early (chi-square test on counts).
* Treat SRM as “invalidate experiment until explained.”

---

### 2) Metric choice & estimation

#### 2.1 Guardrails vs success metrics

* **Success metric:** what you want to improve (CTR, retention, revenue, relevance).
* **Guardrails:** must not regress (latency p95, error rate, diversity, safety complaints, cost).

**Heuristic:** 1 primary, 3–7 guardrails. Too many = paralysis and multiple-testing hell.

---

#### 2.2 Ratio metrics (CTR, AOV per user) — the classic pitfall

CTR can be defined as:

* **Global ratio:** total clicks / total impressions
* **Mean of user CTRs:** average(clicks/impressions per user)

They are not equivalent. Pick based on what you want to optimize.

**Heuristic:** analyze at the randomization unit (user). Compute per-user numerator/denominator, then aggregate.

###### Delta method vs bootstrap

* **Delta method:** analytic approximation for ratio variance; fast, common.
* **Bootstrap:** robust and flexible; slower but safer for complex metrics.

**Rule:** if metric is non-linear/ugly or heavy-tailed → bootstrap.

---

#### 2.3 Heavy-tailed metrics (AOV, time spent, latency)

Typical strategies:

* **Log transform** (model multiplicative effects)
* **Trimmed mean** (drop extreme tails)
* **Winsorization** (cap extremes)
* Report **quantiles** (p50/p95/p99) rather than only means

**Heuristic:** for spend/time, use robust methods + bootstrap CIs.

---

#### 2.4 Sensitivity analysis

Before shipping:

* check lift consistency across key slices (new/returning, geo, device)
* check metric definition variants (global ratio vs per-user ratio)
* check effect across time (novelty fade)

**Heuristic:** if lift only exists in one slice, treat it as hypothesis → rerun with targeted stratification.

---

### 3) Analysis: which test for which metric

#### 3.1 Default: estimate effect + CI

Avoid “p-value only.” Provide:

* point estimate (absolute + relative)
* 95% CI
* decision against MDE

---

#### 3.2 Test selection map (practical)

###### Binary outcomes (conversion)

* Two-proportion z-test / chi-square
* If counts are small → Fisher exact
* Better practice at scale: compute per-user conversion and use robust/bootstrap too (keeps unit consistent)

###### Means (AOV, revenue per user, latency after transform)

* Welch’s t-test (default)
* If heavy-tailed → bootstrap CI or permutation test

###### Quantiles (p95/p99 latency)

* Bootstrap CI for quantile difference (quantile regression is also possible but heavier)

###### Ranking metrics (NDCG, MRR) in online setting

* Often computed per-user/per-session; use bootstrap or permutation at that unit.

**Heuristic:** permutation/bootstrap is the “universal solvent” when assumptions are unclear.

---

#### 3.3 Multiple metrics correction

If you look at many metrics and pick winners, you inflate false positives.

* Use a **primary metric** decision.
* For many secondary metrics: control FDR (BH) or treat as exploratory.

---

### 4) Real-world gotchas (the stuff that breaks experiments)

#### 4.1 Interference & network effects

* Recs/search can change marketplace dynamics, inventory, seller behavior.
* One user’s treatment can affect another user’s outcomes.

Mitigations:

* cluster randomization
* geo experiments
* switchback designs (time-based) for platform-wide changes

---

#### 4.2 Novelty effects

Users react to change initially, then revert.

Mitigation:

* run long enough to see stabilization
* analyze time-sliced effects (day 1 vs day 7)

---

#### 4.3 Caching, non-independence, repeated exposure

* CDN/app caches can cause one variant’s results to leak to another.
* Users can see both variants if bucketing isn’t sticky.

Mitigation:

* sticky assignment, cache keys include variant, analyze at user level.

---

#### 4.4 Logging changes mid-experiment

Any instrumentation change can create fake lift.

Mitigation:

* freeze logging; use invariants (event counts, schema checks).

---

#### 4.5 Drift during experiment (seasonality, campaigns)

If baseline shifts while running, naive analysis misleads.

Mitigation:

* run full cycles; stratify by time; CUPED; switchback if needed.

---

#### 4.6 Delayed feedback + missingness

Conversions happen days later; labels are censored.

* naive “conversion so far” biases against variants that delay/accelerate conversions.

Mitigation:

* choose a fixed attribution window
* survival analysis / delay modeling for serious cases
* report both “early” and “matured” metrics

---

### 5) ML-specific concerns

#### 5.1 Feedback loops

In ranking/recs, new model changes what users see → changes logged data.
This can amplify or hide effects.

Mitigation:

* guardrails on diversity/coverage
* monitor distribution shifts in served items
* consider interleaving (for ranking) when appropriate

---

#### 5.2 Model + policy coupling

If you change threshold, you change base rates and downstream workloads.
Example: fraud threshold changes alert volume.

Mitigation:

* evaluate policy impact: precision/recall at operating points, capacity constraints
* cost-based evaluation, not just AUC

---

#### 5.3 Offline-online mismatch

Offline metrics may not predict online outcomes.
Common in recsys/search, and with human feedback loops.

Mitigation:

* treat offline as filter; online as truth
* maintain an offline–online correlation tracker over time

---

### A concrete “step-by-step runbook”

1. **Define** primary metric, guardrails, MDE, α, power, duration
2. **Pick unit** of randomization (usually user) + ensure sticky assignment
3. **Instrument** invariants (SRM, event counts, latency, errors)
4. **Estimate variance** on historical data (per-unit)
5. **Size** sample + duration (+ plan for lag)
6. **Launch** with ramp-up (1% → 10% → 50%) while watching guardrails/SRM
7. **Analyze** using effect + CI; use robust/bootstrap for heavy-tailed/complex metrics
8. **Decide** against MDE + guardrails; correct for multiple comparisons if exploring many
9. **Post-mortem**: did assumptions hold? update playbook + variance estimates

---

#### Tiny “code pointer” (no long code)

In Python, you’ll commonly use:

* `statsmodels.stats.proportion.proportions_ztest` (rates)
* `scipy.stats.ttest_ind(..., equal_var=False)` (Welch)
* `scipy.stats.mannwhitneyu` (rank-based)
* bootstrap via `numpy.random.choice` or `scipy.stats.bootstrap`
