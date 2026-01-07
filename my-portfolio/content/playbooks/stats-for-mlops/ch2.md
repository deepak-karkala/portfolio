---
title: 'Chapter 2: Core Distributions for MLOps'
summary: 'Essential probability distributions in production ML: Normal, Student-t, Bernoulli/Binomial, Poisson, Exponential, and when to use each'
date: '2024-12-29'
order: 2
excerpt: 'Learn the key distributions that model real-world ML system behavior and how to recognize them in production'
---

# Distributions

## Normal (Gaussian, "z")

**What it models**

* Measurement noise, aggregated effects, residual errors.
* The “default” approximation for averages due to CLT.

**Where it appears in ML systems**

* Regression residual assumptions (even if imperfect).
* Error distributions for monitoring (e.g., prediction error aggregated over time).
* Many statistical tests/intervals assume approximate normality of an estimator.

**How to recognize**

* Symmetric, bell-shaped; tails not too wild.
* Hist of residuals roughly symmetric; Q-Q plot close to line.

**Practical notes**

* Normality of *raw data* is often false; normality of *mean / estimator* can still hold.
* If you see heavy tails → switch to robust stats or transform.

---

## Student-t

**What it models**

* Uncertainty in the mean when variance is unknown and sample size is small.
* Like Normal but heavier tails (more conservative).

**Where it appears**

* A/B tests on means (AOV, time-on-site) when N is not huge.
* Confidence intervals for mean with unknown σ.

**Recognize**

* Same shape as Normal but with heavier tails; converges to Normal as df↑.

**Rule**

* If you’re doing “mean difference” with unknown variance, you’re in **t-world** (or Welch’s t if variances differ).

---

## Bernoulli / Binomial

**Bernoulli**

* Single trial 0/1 event: click, convert, success/failure label.

**Binomial**

* Sum of Bernoullis over (n): #conversions out of n visits.

**Where it appears**

* CTR, conversion rate, precision@k (binary outcomes), label prevalence.
* Online monitoring of success rates.

**Recognize**

* Data is 0/1 or counts of successes.
* Variance tied to mean: (p(1-p)).

**What you do**

* CIs for proportions (Wilson often beats naive Wald).
* Hypothesis tests: z-test / chi-square / Fisher exact.
* Bayesian: Beta posterior over (p) (next section).

---

## Poisson (counts per interval)

**What it models**

* Counts of events in fixed time/space when events happen independently at a constant rate.

**Where it appears**

* Request counts per second/minute, errors per minute, clicks per hour.
* Incident rates.

**Recognize**

* Nonnegative integers; often variance ≈ mean (key property).
* Inter-arrival times ~ Exponential (dual relationship).

**What breaks it**

* **Over-dispersion** (variance >> mean) from burstiness, heterogeneity, seasonality.

**What you do**

* If variance >> mean → Negative Binomial (or mixture models).
* For monitoring: often use Poisson process intuition + change-point detection.

---

## Exponential / Gamma

### Exponential

**What it models**

* Waiting time between Poisson events (“time to next request/click”).

**Where it appears**

* Inter-arrival times, simplified failure times.

**Recognize**

* Positive continuous; memoryless property.

### Gamma

**What it models**

* Sum of exponentials (waiting time to the k-th event).
* Positive skewed continuous values.

**Where it appears**

* Latency/service time modeling (sometimes), durations, time-to-complete tasks.
* Bayesian conjugate prior for Poisson rate (Gamma–Poisson).

**Recognize**

* Positive, right-skewed; can be flexible (shape controls skew).

**Heuristic**

* If it’s a positive skewed duration and lognormal isn’t perfect, Gamma is often a good candidate.

---

## Beta

**What it models**

* A distribution over a probability (p\in[0,1]).

**Where it appears**

* Bayesian modeling of CTR/conversion.
* Uncertainty over rates, especially with small sample sizes.

**Why it’s loved**

* Conjugate with Bernoulli/Binomial → posterior update is simple:

  * prior Beta(α,β) + data (successes, failures) → Beta(α+succ, β+fail)

**Recognize**

* Values in [0,1], can be uniform, U-shaped, skewed, peaked depending on α,β.

**Heuristic**

* When you want “probability with uncertainty” for rates, Beta is the natural language.

---

## Dirichlet

**What it models**

* Distribution over a probability vector (multiclass proportions), generalization of Beta.

**Where it appears**

* Class distribution drift monitoring (multinomial outcomes).
* Bayesian smoothing for categorical frequencies (tokens/categories).

**Practical use**

* Helps avoid zero-probabilities (smoothing) when computing divergences like KL/JS.
* Conjugate prior for Multinomial.

**Heuristic**

* If you have K categories and want a principled “prior + counts → posterior proportions,” Dirichlet.

---

## Lognormal

**What it models**

* Positive quantities where the log is approximately normal.
* Multiplicative processes (many small multiplicative factors).

**Where it appears**

* Latency, response sizes, spend/AOV, time-on-task.

**Recognize**

* Positive, strong right tail; log(x) looks more normal.
* Mean >> median (common sign).

**What you do**

* Analyze on **log scale** (t-tests on log values often behave better).
* Report medians/quantiles; use trimmed means for heavy tails.

**Heuristic**

* For latency/spend: try log transform early.

---

## Pareto / heavy-tailed families

**What it models**

* “A few huge values dominate” (power-law behavior).

**Where it appears**

* Spend/user, session durations, content popularity, tail latencies, long-tail item interactions.

**Why it matters in MLOps**

* Means become unstable; variance may be enormous.
* A/B tests and monitoring get noisy unless you use robust methods.

**Recognize**

* Extreme outliers; log-log plots show heavy tail-ish; top 1% contributes a huge fraction.

**What you do**

* Use robust stats: median, trimmed mean, winsorization.
* Consider quantile-based metrics; bootstrap.
* Sometimes model the tail separately (extreme value theory) if it’s core.

**Heuristic**

* If one user can swing your metric, you’re in heavy-tail land.

---

## Negative Binomial (over-dispersed counts)

**What it models**

* Counts when variance > mean (Poisson is too “tight”).
* Often: a Poisson rate that varies across users/time (Gamma–Poisson mixture).

**Where it appears**

* Click counts per user, errors per service with burstiness, events per session.

**Recognize**

* Over-dispersion: sample variance >> sample mean.
* Many zeros + occasional big counts.

**What you do**

* Use NB for modeling; for tests, use robust/permutation methods if assumptions shaky.

**Heuristic**

* If Poisson underestimates spikes, switch to Negative Binomial.

---

## Mixture models (multi-modal behavior)

**What it models**

* Data generated by multiple latent subpopulations.

**Where it appears**

* New vs returning users, bots vs humans, enterprise vs consumer traffic.
* Latency: cache hit vs miss
* CTR: different intent cohorts

**Recognize**

* Histogram shows multiple peaks; metrics differ wildly across segments.

**What you do**

* Segment explicitly (preferred in production).
* Or fit mixture (Gaussian mixture, etc.) for analysis.
* Monitor per-segment; global metrics can hide failures.

**Heuristic**

* If “overall average” doesn’t describe any real user group, suspect a mixture.

---

## Categorical / Multinomial

**Categorical**

* Single draw from K categories.

**Multinomial**

* Counts over K categories across N draws.

**Where it appears**

* Label distribution, token frequencies, error codes, country/device distributions.
* Drift detection: “did category mix change?”

**Recognize**

* Finite set of labels/categories; you track proportions.

**What you do**

* Chi-square tests / G-tests; JS divergence; Dirichlet smoothing.
* Watch for rare categories (small expected counts → Fisher/Monte Carlo).

**Heuristic**

* For categorical drift, start with simple proportion monitoring + chi-square/JS; don’t overcomplicate.

---

## A few cross-cutting heuristics (high leverage)

1. **Check support first**: is it {0,1}, nonnegative integers, positive reals, [0,1], simplex? That narrows choices fast.
2. **Mean vs variance relationship**:

   * Poisson: var ≈ mean
   * NB: var > mean
3. **Tail behavior decides your stats**:

   * Heavy tails → quantiles/robust/bootstrap
4. **Heterogeneity beats “fancy fitting”**:

   * If mixture suspected, segment first.

---
