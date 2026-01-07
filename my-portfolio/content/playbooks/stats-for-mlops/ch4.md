---
title: 'Chapter 4: Statistical Distance Measures'
summary: 'Methods for quantifying differences between distributions: KL divergence, KS test, Wasserstein, PSI, and when to use each'
date: '2024-12-29'
order: 4
excerpt: 'Learn how to measure and detect changes in data distributions for drift detection and model monitoring'
---

# Statistical distance measures

## 0) Two axes to choose a distance

### A) What kind of data?

* **Categorical / discrete histogram** → KL/JS/TV/PSI
* **Continuous 1D** → Wasserstein (often best), KS distance (as a simple max-CDF gap)
* **High-D vectors/embeddings** → cosine / Mahalanobis / MMD/energy (distance between distributions), or summary stats + slices

### B) What failure mode matters?

* Tail changes (p99 latency drift) vs center shift vs mixture shift.
* Interpretability vs sensitivity vs stability.

---

## 1) KL divergence

[
D_{KL}(P|Q)=\sum_x P(x)\log\frac{P(x)}{Q(x)}
]

**What it measures**
“How inefficient it is to code samples from P using a model optimized for Q.”
Not symmetric, not bounded.

**Use when**

* You have **probability distributions** (often histograms) and care about *direction*: “production looks unlike training.”
* You want something sensitive to **support mismatches** (Q puts near-zero where P has mass).

**Gotchas**

* If (Q(x)=0) where (P(x)>0) → KL = ∞. In practice, this happens constantly with finite samples.
* Overly sensitive to tiny probabilities and binning.

**Heuristic**
Use KL only with **smoothing** (add ε) and careful binning; otherwise prefer JS.

---

## 2) Jensen–Shannon (JS) divergence

[
JS(P,Q)=\tfrac{1}{2}KL(P|M)+\tfrac{1}{2}KL(Q|M), \quad M=\tfrac{P+Q}{2}
]

**Why people like it**

* **Symmetric**
* **Bounded** (0 to log2; often sqrt(JS) used as a metric)
* More stable than KL when supports don’t match perfectly.

**Use when**

* You need a robust distance for **histogram drift** in monitoring.
* You want symmetry: “distance between train and prod” regardless of direction.

**Gotcha**
Still binning-sensitive; for continuous features you’re really measuring “binned distribution difference.”

**Heuristic**
If you’re picking one histogram-based divergence for drift dashboards, **JS is a great default**.

---

## 3) PSI (Population Stability Index)

Industry standard in credit risk.

For bins (i):
[
PSI=\sum_i (p_i - q_i)\log\frac{p_i}{q_i}
]
where (p_i) is baseline proportion and (q_i) is current proportion.

**Interpretation**
A weighted, symmetric-ish measure of shift in binned distributions (it resembles a divergence).

**Use when**

* You need an **easy-to-explain** drift score for regulators/ops.
* You have numeric features and can define bins (often based on training quantiles).

**Typical rule-of-thumb thresholds** (common in practice; treat as heuristics):

* <0.1: small shift
* 0.1–0.25: moderate
* > 0.25: large

**Gotchas**

* Extremely sensitive to **binning** and how you handle zeros.
* PSI can be inflated by tiny baseline bin probabilities.

**Heuristic**
Use **training-quantile bins** (equal-frequency) + **epsilon smoothing** for empty bins. Always pair PSI with a plot (CDF/hist).

---

## 4) Wasserstein / EMD (Earth Mover’s Distance)

For 1D continuous distributions:

* Intuition: minimum “work” to move probability mass from P to Q.

**Why it’s great**

* Highly **interpretable**: measured in the same units as the variable (e.g., milliseconds).
* Works naturally for continuous variables and is meaningful even when supports differ.
* Sensitive to **shifts** without being as brittle as KL.

**Use when**

* Continuous 1D drift: latency, scores, numeric features.
* You want a scalar that stakeholders understand (“the distribution moved by ~X units”).

**Gotchas**

* In higher dimensions, Wasserstein is expensive and can be sample-hungry; 1D is the sweet spot.
* Can miss certain changes (e.g., same mean shift? depends) — always inspect shape.

**Heuristic**
For continuous features: start with **Wasserstein + quantile deltas (p50/p95/p99)**.

---

## 5) Total Variation (TV) distance

For discrete:
[
TV(P,Q)=\tfrac{1}{2}\sum_x |P(x)-Q(x)|
]

**What it measures**
Max difference in probabilities; very interpretable (“how much mass differs”).

**Use when**

* You want a **simple, bounded** difference score for categorical distributions.
* Useful for monitoring label mix drift.

**Gotcha**
Ignores geometry (category similarity doesn’t exist); purely frequency mismatch.

**Heuristic**
TV is the “L1 distance between histograms.” Great baseline.

---

## 6) Hellinger distance

[
H(P,Q)=\frac{1}{\sqrt{2}}\sqrt{\sum_x (\sqrt{P(x)}-\sqrt{Q(x)})^2}
]

**Why it’s useful**

* Symmetric, bounded [0,1]
* Less sensitive to tiny probabilities than KL
* Nice mathematical properties

**Use when**

* You want a stable histogram divergence that’s not as spiky as KL.
* Often good for probability distributions with many small bins.

**Heuristic**
If JS feels too sensitive, Hellinger is a strong alternative.

---

## 7) Cosine distance (for embeddings / high-D vectors)

[
\text{cosine_sim}(u,v)=\frac{u\cdot v}{|u||v|}
]
Cosine distance = 1 − cosine similarity.

**Use when**

* You compare **individual embeddings** (semantic similarity).
* Many embedding spaces are trained so angle matters more than magnitude → cosine is natural.

**For drift**
You don’t usually cosine-compare distributions directly. Common approaches:

* Compare **centroids** (mean embedding) by cosine
* Track **mean pairwise cosine** to a reference set
* Monitor changes in **nearest-neighbor structure**

**Heuristic**
Normalize embeddings (L2) and treat cosine as default similarity unless you know magnitudes carry meaning.

---

## 8) Mahalanobis distance (for “how far from baseline”)

For a vector (x) with baseline mean (\mu) and covariance (\Sigma):
[
d_M(x)=\sqrt{(x-\mu)^T\Sigma^{-1}(x-\mu)}
]

**What it’s good at**

* Detecting **outliers** / “distance from normal” while accounting for feature correlations.
* Useful for feature drift as “how abnormal is this point vs training distribution?”

**Use when**

* Features are roughly elliptical/normal-ish in a representation space (often after standardization/PCA).
* You want a single anomaly score per sample or per batch.

**Gotchas**

* Covariance estimation is brittle in high dimensions (needs lots of data or shrinkage).
* If distribution is non-Gaussian / multimodal, Mahalanobis can be misleading.

**Heuristic**
Use Mahalanobis after:

* standardization
* dimensionality reduction (PCA)
* covariance shrinkage (Ledoit–Wolf) if high-d.

---

## Practical section: binning, smoothing, and “when distances lie”

### 1) Binning choices (critical)

* **Equal-width bins**: intuitive but bad if data is skewed (most bins empty).
* **Quantile bins (equal-frequency)**: great for stability and PSI/JS; preserves resolution where data exists.
* **Domain bins**: best when semantics matter (latency buckets, price ranges).

**Heuristic**
For monitoring numeric features: use **training quantile bins** + fixed edges.

### 2) Smoothing / zero handling

For KL/JS/PSI, empty bins cause blow-ups.

* Add small ε (Laplace/Dirichlet smoothing)
* Or merge rare bins into “other”

**Heuristic**
Always do smoothing for divergences, and log the fraction of mass in “other/unknown.”

### 3) Sample-size sensitivity

* With huge samples, tiny distribution changes look “large enough” in some metrics.
* With small samples, metrics are noisy.

**Heuristic**
Track uncertainty: bootstrap CI of the distance (yes, bootstrap your drift metric).

### 4) High-dimensional drift: distances can lie

In high-D, distances concentrate (everything looks equally far). Practical alternatives:

* Compare 1D projections (PCA components) with Wasserstein/KS
* Classifier-based drift (train a model to distinguish “train vs prod”; AUC close to 0.5 means no drift)
* MMD/Energy as distribution tests rather than naive vector distances

---

## Quick “which to use when” cheat map

* **Categorical mix drift** → TV / JS / Chi-square (test)
* **Numeric 1D drift** → Wasserstein + quantile deltas; KS/AD as tests
* **Need explainability / business-friendly** → PSI (with quantile bins)
* **Histogram divergence default** → JS (stable + symmetric)
* **Embeddings drift** → centroid cosine + PCA-projection Wasserstein; optionally Mahalanobis in reduced space

---

