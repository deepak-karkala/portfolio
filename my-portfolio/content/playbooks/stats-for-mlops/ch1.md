---
title: 'Chapter 1: Statistical Foundations'
summary: 'Core concepts in statistics for MLOps: random variables, distributions, moments, quantiles, sampling, and confidence intervals'
date: '2024-12-29'
order: 1
excerpt: 'Master the statistical foundations essential for monitoring, testing, and decision-making in production ML systems'
---

# Foundations

##


### 1) Random variables and distributions

A **random variable (RV)** is a function that maps an uncertain outcome to a number. A **distribution** tells you how likely different values are.

**In MLOps terms:** almost everything you monitor is an RV:

* request latency, token count, feature values, CTR/conversion, model score, error rate, “time to label,” etc.

#### Discrete vs continuous

* **Discrete RV:** countable outcomes (0/1, integers).
  Examples: conversion (Bernoulli), clicks/day (count), retries, number of items returned.
* **Continuous RV:** real-valued.
  Examples: latency, price, duration, embedding similarity, loss.

**Heuristic:** if the data comes from counting events → discrete; measurement/aggregation → continuous.

---

### 2) PMF / PDF / CDF (and why CDF is the most useful)

* **PMF** (P(X=x)): discrete probabilities at points.
* **PDF** (f(x)): continuous “density.” Probability of an interval:
  [
  P(a \le X \le b)=\int_a^b f(x),dx
  ]
* **CDF** (F(x)=P(X\le x)): works for both discrete and continuous.

**Why CDF matters in production**

* Quantiles are defined via the CDF (p50/p95/p99 latency).
* Many drift tests are CDF-based (KS test compares CDFs).
* Thresholding decisions often use tail probabilities.

**Heuristic:** when people argue about “averages,” switch the conversation to **CDF/quantiles**.

---

### 3) Moments and quantiles

#### Moments

* **Mean**: (\mathbb{E}[X]) — average outcome.
* **Variance**: (\mathbb{E}[(X-\mu)^2]) — spread.
* **Skewness**: asymmetry (right-skew common: latency, spend).
* **Kurtosis**: tail heaviness (fat tails = outliers dominate).

**MLOps punchline:** Many system metrics are **heavy-tailed**, so mean/variance can be unstable; use quantiles/robust stats.

#### Quantiles

* p50, p90, p95, p99 are quantiles.
* Quantiles describe user experience directly (“99% requests under 200ms”).

**Heuristic:** use **means** for additive things with light tails; use **quantiles** for latency/size/spend.

---

### 4) Conditional distributions and Bayes rule

A conditional distribution (P(Y\mid X)) is “what the world looks like given context.”

* In supervised ML, you’re learning (P(Y\mid X)) (or a decision rule that behaves like it).
* In monitoring, you often care about **segment-conditioned** behavior:
  latency | region, CTR | device, error rate | model version.

#### Bayes rule

[
P(Y\mid X)=\frac{P(X\mid Y)P(Y)}{P(X)}
]
**Why it matters for MLOps**

* **Base rate changes** (prior (P(Y))) can break thresholds and calibration even if the model hasn’t “changed.”
* Many operational mistakes are “we forgot the prior moved.”

**Heuristic:** when performance changes, ask: “did (P(Y)) shift, did (P(X)) shift, or did the mapping (P(Y\mid X)) shift?”

---

### 5) IID vs non-IID, stationarity, exchangeability

#### IID assumption

Many statistical tools assume samples are:

* **Independent**: one sample doesn’t influence another
* **Identically distributed**: same underlying distribution

#### Why logs/streams violate IID

* **Temporal dependence:** today depends on yesterday (seasonality, campaigns).
* **User-level correlation:** multiple events from same user aren’t independent.
* **Feedback loops:** your model changes what data you observe (recs/search/ranking).
* **Non-stationarity:** distributions drift over time.

#### Stationarity

Distribution does not change over time (often false in production).

#### Exchangeability (a useful “weaker than IID” concept)

Samples are exchangeable if order doesn’t matter *given some latent variable*.
In practice, you often approximate by grouping:

* “events are exchangeable **within a day**”
* or “sessions are exchangeable **within a user cohort**”

**Heuristic:** if you can’t justify IID, use:

* cluster-aware stats (user-level aggregation),
* blocked/stratified sampling,
* time-aware evaluation (backtesting),
* sequential testing / change-point methods.

---

## 6) Sampling and estimators

An **estimator** is a rule that turns data into an estimate (mean, CTR, AUC, etc).

### Bias–variance trade-off

* **Bias:** systematic error (consistently off).
* **Variance:** sensitivity to sample fluctuations.

**MLOps mapping**

* A metric computed on a tiny sample is high variance → noisy alerts.
* A heavily smoothed metric is biased → slow detection.

**Heuristic:** monitoring is always a bias–variance trade-off: fast detection vs false alarms.

### Consistency and efficiency

* **Consistent:** converges to truth as (n\to\infty).
* **Efficient:** has low variance among unbiased estimators.

**Heuristic:** prefer consistent + robust estimators when data is messy (most production).

---

### 7) MLE / MAP and sufficient statistics

#### MLE (Maximum Likelihood)

Pick parameters (\theta) that make observed data most likely:
[
\hat{\theta}*{MLE}=\arg\max*\theta P(D\mid \theta)
]

#### MAP (Maximum A Posteriori)

Same, but includes a prior:
[
\hat{\theta}*{MAP}=\arg\max*\theta P(D\mid\theta)P(\theta)
]
MAP is “MLE + regularization” in many models.

**MLOps mapping**

* Logistic regression training is MLE; L2-regularized logistic regression is MAP with Gaussian prior.
* This helps you explain why priors/regularization stabilize models under small data.

#### Sufficient statistics

A statistic that captures all information in data about (\theta).
Example: for Gaussian with known variance, sample mean is sufficient for mean.

**Why it’s useful:** it tells you what you need to retain/aggregate without losing information (rarely perfect in messy real-world ML, but powerful intuition).

---

### 8) CLT and when it fails

#### CLT (intuition)

For IID samples with finite variance, the sample mean becomes approximately normal as (n) grows:
[
\bar{X} \approx \mathcal{N}(\mu, \sigma^2/n)
]

**Why it’s everywhere**

* Justifies z/t intervals/tests for means and proportions (under conditions).

#### When it fails in production

* **Heavy tails** (latency/spend): variance can be huge or effectively infinite-ish → mean converges painfully slowly.
* **Dependence** (sessions/users/time): effective sample size is smaller than raw count.
* **Non-stationarity**: you’re averaging different distributions.

**Heuristics to handle failure**

* Use **robust statistics**: median, trimmed mean, winsorized mean.
* Use **bootstrap** CIs instead of CLT-based ones.
* Aggregate at independent unit (user-level) to restore approximate independence.
* Use time-series methods / blocking.

---

### 9) Concentration bounds (Hoeffding/Chernoff): “safety rails”

These give **distribution-free** bounds on how far an empirical estimate can deviate from true value.

#### Hoeffding (bounded variables)

If (X\in[a,b]), then:
[
P(|\bar{X}-\mathbb{E}[X]|\ge \epsilon) \le 2\exp\left(\frac{-2n\epsilon^2}{(b-a)^2}\right)
]

**MLOps uses**

* Quick back-of-envelope: “how many samples to estimate a rate within ±ε with high confidence?”
* Guardrails for online metrics when you don’t trust normal approximations.

#### Chernoff (good for Bernoulli / counts)

Tighter for sums of Bernoulli (conversion/clicks), especially for tail probabilities.

**Heuristic:** when you need guarantees with minimal assumptions, reach for concentration bounds.

---

## 10) Confidence intervals (CIs)

### CI vs credible interval

* **Confidence interval (frequentist):** method that covers the true parameter in, say, 95% of repeated experiments.
* **Credible interval (Bayesian):** given data and a prior, there’s 95% posterior probability the parameter lies in the interval.

**When each matters**

* Frequentist CI: common for reporting and classical A/B.
* Bayesian credible: natural for decision-making under uncertainty (especially sequential settings), but depends on priors.

**Heuristic:** CI is about “procedure reliability,” credible is about “belief given assumptions.”

---

### CIs for means

* If variance known or large n: z-interval
* If variance unknown: t-interval
* In real ML ops: if heavy tails or dependence → use bootstrap or robust estimators.

### CIs for proportions (rates like CTR)

You’ll see several; some are better behaved than the naive “Wald”:

* Wilson score interval (often recommended)
* Agresti–Coull
* Exact (Clopper–Pearson) conservative

**Heuristic:** avoid plain Wald for small n or extreme probabilities.

---

### CIs for quantiles (p95/p99 latency)

Quantiles don’t follow simple normal CI formulas. Options:

* **Order-statistic based** intervals (from CDF theory)
* **Bootstrap** (most practical)

**Heuristic:** for p99 latency, use **bootstrap + enough sample**; otherwise the estimate is mostly noise.

---

## 11) Bootstrap confidence intervals (percentile / BCa)

Bootstrap = resample your observed data with replacement many times, compute metric each time, use resulting distribution.

**Why it’s huge in ML**

* Works for ugly metrics (AUC, F1, NDCG, custom business metrics)
* Doesn’t require normality
* Lets you build CIs for almost anything

### Percentile bootstrap

Take the 2.5th and 97.5th percentiles of bootstrap metric values.

### BCa (Bias-Corrected and Accelerated)

Adjusts for bias and skewness; better coverage especially for skewed distributions.

**Gotchas**

* Bootstrap assumes your sample approximates the population; if you have dependence (multiple events per user), you must **cluster bootstrap** (resample users, not events).
* Computational cost; but usually manageable for metric estimation.

**Heuristic:** if metric is complex or distribution is ugly, bootstrap is the default—just bootstrap the right unit (user/session).

---

## A compact “use in practice” summary

* Prefer **CDF/quantiles** for heavy-tailed ops metrics.
* Always question **IID**; aggregate or block by user/time.
* Use **CLT-based** intervals/tests when assumptions roughly hold and sample is large.
* Use **bootstrap/robust stats** when tails/dependence make CLT shaky.
* Use **concentration bounds** for fast, assumption-light safety checks.

---
