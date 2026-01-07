---
title: 'Chapter 3: Hypothesis Testing'
summary: 'Framework for statistical testing in ML systems: p-values, test selection, multiple testing, and common pitfalls'
date: '2024-12-29'
order: 3
excerpt: 'Build a rigorous foundation for testing hypotheses about model performance, data quality, and system behavior'
---

# Hypothesis testing

## 1) Core concepts

### p-value (what it *actually* is)

A **p-value** is:

> Assuming the **null hypothesis** is true, what is the probability of seeing results **at least as extreme** as what we observed?

It is **not**:

* probability the null is true
* probability results are “due to chance”
* probability your model is “good”

**Heuristic:** p-value measures “surprise under H0,” not truth.

---

### Alpha (α), Type I/II errors

* **α (significance level)**: max tolerated false positive rate.
* **Type I error**: reject H0 when it’s true (false alarm).
* **Type II error (β)**: fail to reject H0 when it’s false (miss).

**Power = 1 − β**: probability you detect an effect if it exists.

**MLOps translation**

* α controls how often you’ll ship “fake improvements”
* power controls how often you’ll miss real wins

**Heuristic:** If a test has low power, “no significance” means nothing.

---

### Effect size vs statistical significance

* **Statistical significance**: “unlikely under H0”
* **Practical significance**: “matters for product/cost/SLO”

In large systems, you can get tiny effects with tiny p-values.

**Heuristic:** Always pair p-values with **(effect size + CI)**.

---

### One-tailed vs two-tailed

* **Two-tailed**: any difference (up or down)
* **One-tailed**: only improvement matters

**Rule of thumb**

* Default to **two-tailed** unless harm in one direction is literally impossible.
* If you choose one-tailed, decide *before* seeing data.

---

### Assumptions & robustness (the stuff that breaks in production)

Most classical tests quietly assume:

1. **Independence** (often false: many events per user)
2. **Identical distribution** (drift/seasonality breaks it)
3. **Normality** (raw metrics like latency/spend rarely normal)
4. **Equal variances** (often false between cohorts/variants)

**Heuristic:** In product logs, the “independent unit” is usually **user**, not event.

---

## 2) Common tests used around ML systems

### A) Tests on means

#### t-test (Student)

Use when comparing means of two groups, assuming roughly normal *mean estimator*.

#### Welch’s t-test (default)

Handles unequal variances; slightly more conservative.

**Use in ML systems**

* AOV, latency (after transform/robustification), time-to-complete
* Offline metric means across queries (careful: query/user dependence)

**Heuristic:** If you must do a mean test, use **Welch** unless you have strong reason not to.

---

### B) Proportions (conversion/CTR)

* **Two-proportion z-test**: large samples, proportion difference
* **Chi-square test**: same underlying 2×2 contingency test framing
* **Fisher’s exact**: small counts / rare conversions

**Heuristic**

* If expected cell counts are small (<~5), Fisher beats chi-square asymptotics.

---

### C) Nonparametric tests

#### Mann–Whitney U (aka Wilcoxon rank-sum)

Tests whether one distribution tends to produce larger values than the other (a rank-based shift).

**AUC connection**
For binary classification, ROC-AUC equals a normalized Mann–Whitney statistic:
AUC = probability a random positive scores higher than a random negative.

**Use when**

* Heavy tails, non-normal
* You care about stochastic dominance more than mean

**Caveat:** It’s not “median test” strictly; it’s about ranking/order.

#### Permutation tests (highly practical)

Shuffle labels, recompute metric difference, build empirical null distribution.

**Use when**

* You don’t trust assumptions
* Your metric is complex (AUC, NDCG, custom business metric)

**Heuristic:** If the metric is weird, use permutation/bootstrap instead of forcing a t-test.

---

### D) Multi-group tests

* **ANOVA**: multiple groups mean comparison (assumptions like t-test)
* **Kruskal–Wallis**: nonparametric multi-group rank test

**Heuristic:** If you have >2 variants, start with omnibus test (ANOVA/KW), then do corrected pairwise comparisons.

---

### E) Correlation tests

* **Pearson**: linear relationship, sensitive to outliers
* **Spearman**: rank correlation, monotonic relationship, more robust

**Partial correlation caveat**

* Often misused in observational logs: controlling for the “wrong” variable can introduce bias (colliders).
* Use DAG reasoning when doing partial correlations for causal-ish claims.

**Heuristic:** correlation is a descriptive tool; avoid causal interpretations in logs.

---

## 3) Two-sample / drift tests (production monitoring)

### First decision: what data type and dimensionality?

* 1D continuous feature drift → KS / Anderson–Darling
* Categorical drift → Chi-square / G-test
* Multivariate drift → MMD / Energy distance (or classifier-based tests)

---

### KS test (Kolmogorov–Smirnov)

**What it tests:** maximum gap between two empirical CDFs.

**Good for**

* 1D continuous features
* General shift detection

**Weakness**

* Less sensitive in tails (important for p99 latency, rare events)

---

### Anderson–Darling / Cramér–von Mises

Also compare CDFs but weight differences differently.

* **Anderson–Darling**: emphasizes **tails** more
* **Cramér–von Mises**: integrated squared difference across range

**Heuristic:** If tail behavior is what you care about (SLOs, extreme scores), prefer **AD** over KS.

---

### Chi-square test (categorical)

**What it tests:** difference in frequency tables.

**Gotchas**

* Needs sufficient expected counts.
* For high-cardinality categories: you often need grouping (“other”) or smoothing.

---

### MMD (Maximum Mean Discrepancy)

**What it tests:** difference between multivariate distributions using kernels.

* Works well for continuous multivariate features.
* Needs kernel choice and can be sample-hungry in high dimensions.

**Heuristic:** MMD is “kernelized distribution difference.” Great when you have enough samples and a reasonable kernel.

---

### Energy distance (multivariate)

A distance between distributions based on pairwise distances; often strong and less “kernel-guessy” than MMD.

**Heuristic:** If you want a multivariate, distance-based test and don’t want to tune kernels, energy distance is a good alternative.

---

### Practical drift-test advice

1. Drift tests become “always significant” with huge n.
   → treat p-values as *alarms*, not as impact.
2. Monitor **effect size** too: PSI/JS/Wasserstein or simple quantile deltas.
3. Segment drift: drift might happen only in one slice (region/device).

**Heuristic:** drift significance ≠ drift importance.

---
<!--
## 4) Multiple comparisons & peeking

### Multiple comparisons (why it matters)

If you run 20 tests at α=0.05, the chance of at least one false positive can be large.

#### FWER control (avoid any false positive)

* **Bonferroni**: α/m (simple, conservative)
* **Holm**: step-down Bonferroni, less conservative

Use when false positives are very costly (shipping bad model, safety).

#### FDR control (allow some false positives, control expected proportion)

* **Benjamini–Hochberg (BH)**

Use when you test many metrics/features and can tolerate some false discoveries (exploration, monitoring).

**Heuristic:** product launches → FWER-ish; exploratory dashboards → FDR.

---

### Peeking (optional stopping) and alpha spending

“Check results daily and stop when significant” inflates Type I error.

Ways to do it properly:

* **Fixed-horizon**: decide sample size upfront
* **Sequential testing**: alpha-spending boundaries (e.g., O’Brien–Fleming)
  very conservative early, relaxes later

**Heuristic:** if stakeholders demand frequent reads, use a sequential plan or Bayesian monitoring—don’t pretend α=0.05 still holds.

---
-->

## Quick “which test when” map (high signal)

* **Mean comparison, unknown variance** → Welch’s t
* **Rates (CTR/conversion)** → two-proportion z / chi-square; rare counts → Fisher
* **Heavy-tailed metric or weird metric** → permutation / bootstrap
* **1D continuous drift** → KS; tail-critical → Anderson–Darling
* **Categorical drift** → chi-square (with expected count checks)
* **Multivariate drift** → MMD / energy distance; or classifier-based drift
* **Many tests** → BH (FDR) or Holm/Bonferroni (FWER)

---