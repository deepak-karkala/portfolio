---
title: 'Chapter 6: Monitoring and Drift Detection'
summary: 'Statistical approaches to monitoring data quality, detecting drift, and maintaining model health in production systems'
date: '2024-12-29'
order: 6
excerpt: 'Build robust monitoring systems using statistical methods to catch data drift, quality issues, and model degradation'
---

# Monitoring, drift, data quality stats

##

### Mental model

Monitoring is **not one detector**. It’s a layered system:

1. **Invariants** (is data even valid?)
2. **Data drift** (did inputs change?)
3. **Concept drift / performance drift** (did mapping (P(Y|X)) change?)
4. **Ops health** (latency/error/cost)
5. **Label/feedback pipeline health** (delay, censoring)

**Rule:** drift tests tell you “something changed,” not “model is worse.” Always pair drift with **impact proxies**.

---

### 1) Data drift vs concept drift

#### Data drift (shift in (P(X)))

Examples:

* new device mix, new locales, new traffic sources
* feature distribution shift (age, price, text length)
* embedding distribution shift

**Detect with:** distances + two-sample tests (JS/PSI/Wasserstein + KS/Chi²/MMD).

#### Concept drift (shift in (P(Y|X)))

Meaning: for the same inputs, labels/outcomes differ.
Examples:

* fraudsters adapt, policy changes, product UI changes behavior
* search intent changes seasonally

**Detect with:** performance monitoring (with delayed labels), calibration drift, residual/error drift, outcome base-rate shift (P(Y)).

###### Why drift tests aren’t sufficient

You can have:

* **Big (P(X)) drift, no performance change** (model generalizes)
* **No (P(X)) drift, big performance drop** (concept drift, label pipeline issues, adversarial adaptation)
* Drift in irrelevant features triggers alarms.

**Heuristic:** alert on drift only when (a) it’s big **and** (b) it correlates with *risk* (importance-weighted drift, or drift in top features, or drift + proxy metric movement).

---

### 2) How to pick tests + effect sizes (practical playbook)

#### Step A: classify the thing you’re monitoring

###### 1D continuous (latency, scores, numeric features)

* **Effect size:** Wasserstein + quantile deltas (p50/p95/p99)
* **Test:** KS (generic) or Anderson–Darling (tail-sensitive)

###### Categorical (country, device, error codes, class labels)

* **Effect size:** JS / TV / PSI
* **Test:** Chi-square (with expected-count checks)

###### High-dimensional (embeddings, many features)

* **Effect size:** (i) PCA projection Wasserstein on top components, (ii) centroid cosine, (iii) Mahalanobis in reduced space
* **Test:** MMD / energy distance, or classifier-based drift (train “train vs prod” discriminator; AUC > threshold means drift)

**Heuristic:** Don’t run fancy multivariate tests on everything. Start with:

* top-K important features + summary projections for the rest.

---

#### Step B: choose a baseline window

Typical:

* **Training baseline** (stable, but may be outdated)
* **Recent stable baseline** (rolling “last good week”)

**Heuristic:** use a **rolling baseline** for near-term anomaly detection and a **training baseline** for “distribution compatibility” alerts.

---

#### Step C: set alert thresholds (don’t use a single magic number)

###### Preferred approach: empirical thresholds

1. Compute metric on historical “healthy” periods.
2. Learn its natural variability.
3. Set thresholds to target an alert rate (e.g., 1/week per model).

Examples:

* Alert if metric > p99 of healthy distribution
* Or mean + 3σ (if roughly stable), or robust: median + k*MAD

**Heuristic:** pick thresholds based on *desired alert frequency*, not “industry PSI=0.25”.

###### For p-values (drift tests)

With big n, p-values go to ~0 for tiny shifts.

* Use p-values only as a **gate** (e.g., p < 1e-6) and drive severity from effect size.

**Heuristic:** “significant” is not “important.”

---

### 3) Change-point detection (CUSUM, Page-Hinkley)

#### What change-point detectors do

They detect a **shift in mean/level** (or sometimes variance) of a time series online.

###### CUSUM

Tracks cumulative deviations from a target mean:

* Raises alarm when cumulative evidence exceeds a threshold.
  Best for:
* quick detection of small persistent shifts (e.g., error rate creeping)

###### Page-Hinkley

Designed for detecting changes in the average of a signal with some robustness; commonly used in streaming drift detection.

**Where used in MLOps**

* latency p95/p99 time series
* error rate, timeout rate
* quality proxies (CTR, acceptance rate)
* feature missingness rate

**Key knobs**

* sensitivity (drift magnitude)
* threshold (false alarm rate)
* forgetting factor/windowing (adaptation)

**Heuristic:** use change-point detection on **aggregated metrics per time bucket**, not on raw events.

---

### 4) Control charts, SLO monitoring, alert thresholds

#### Control chart mental model

You have a metric (m_t) over time. You want to detect when it leaves “normal operating range.”

###### Common chart choices

* **Shewhart (3-sigma)**: good for large sudden shifts
* **EWMA**: smooths noise, catches small sustained shifts
* **CUSUM**: best for subtle persistent drift

#### SLO-focused monitoring

Define an SLO like: “p99 latency < 300ms” or “error rate < 0.1%”
Then monitor:

* **burn rate**: how fast you’re consuming error budget (common SRE approach)
* **multi-window multi-burn alerts** (fast+slow windows to reduce noise)

**Heuristic:** use **burn-rate alerts** for SLOs, and **change-point alerts** for debugging and early warning.

---

### 5) Outliers and missingness mechanisms

#### Outliers

Outliers can be:

* real but rare (heavy tails)
* pipeline bugs (unit change, parsing errors)
* attacks/bots

**Stats tactics**

* monitor robust stats (median, MAD, trimmed means)
* separate “outlier rate” as its own metric (e.g., % latency > 2s)
* for features: track % outside training min/max or outside percentile bands

**Heuristic:** treat outliers as a *separate signal*; don’t let them dominate averages.

---

#### Missingness (MCAR / MAR / MNAR)

* **MCAR**: missing completely at random (rare)
* **MAR**: missing depends on observed data (common)
* **MNAR**: missing depends on unobserved value itself (dangerous)

**Why it matters**
Missingness can become a **proxy for drift** or for failure:

* a feature stops populating for a region → model silently degrades

**What to monitor**

* missing rate per feature (overall + by slice)
* “new null patterns” (combinations)
* imputation fallback rate
* schema changes, type changes

**Heuristic:** missingness drift is often a higher-signal alert than subtle distribution drift.

---

### 6) Label delay and censored outcomes

#### What happens in production

* labels arrive late (fraud confirmed days later)
* outcomes can be censored (user hasn’t had time to convert yet)
* selection bias: you only observe labels for investigated cases

#### Monitoring under label delay

Use 3 layers:

1. **Leading indicators** (proxy metrics): score distributions, abstain rate, policy triggers, human overrides
2. **Matured windows**: evaluate quality only on cohorts old enough to have complete labels (e.g., “users from 14 days ago”)
3. **Time-to-label monitoring**: distribution of label latency itself (if it changes, your evaluation breaks)

**Heuristic:** never compare “today’s” conversion to “yesterday’s” without aligning the attribution window.

---

### A minimal, high-signal monitoring spec (what to actually implement)

###### Data quality (hard stops)

* schema/type checks, range checks
* missingness rate + new null patterns
* SRM-like traffic split checks for experiment buckets
* pipeline lag, dropped events

###### Drift (soft alerts)

* top important features: Wasserstein + quantile deltas (numeric), JS/TV (categorical)
* embedding space: centroid cosine + PCA Wasserstein on top components
* gate with significance only if needed; severity via effect size

###### Performance (when labels available)

* lag-aware evaluation (matured cohorts)
* calibration drift (ECE/Brier) for probability-based decisions
* slice metrics

###### Ops

* latency/error SLO burn-rate alerts
* change-point on p95/p99 + error rate

---
