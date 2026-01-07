---
title: 'Chapter 7: Uncertainty and Decision-Making'
summary: 'Calibration, confidence intervals, and statistical decision frameworks for production ML systems'
date: '2024-12-29'
order: 7
excerpt: 'Learn to quantify uncertainty, calibrate model outputs, and make statistically-informed decisions under uncertainty'
---

# Uncertainty, calibration, decision-making


##

### Mental model

A model output is useful only when you know **(a) how uncertain it is** and **(b) how to act on it given costs**.

Think of 3 layers:

1. **Score quality** (ranking / discrimination: AUC, NDCG)
2. **Probability quality** (calibration: reliability, Brier, log loss)
3. **Decision quality** (utility under costs/constraints: thresholding, policies)

---

### 1) Predictive uncertainty: aleatoric vs epistemic

#### Aleatoric uncertainty = irreducible noise

Uncertainty from the world/data itself:

* blurry image, ambiguous text, inherently stochastic outcomes
* even a perfect model can’t remove it

**How it shows up**

* consistent ambiguity across models
* persists with more training data

**How to handle**

* improve measurement/features, collect better labels
* model it explicitly (e.g., heteroscedastic regression predicting variance)

---

#### Epistemic uncertainty = model ignorance

Uncertainty from lack of knowledge:

* out-of-distribution inputs
* not enough data in certain regions of feature space

**How it shows up**

* reduces with more data
* spikes on new regions, new cohorts, drift

**How to estimate (practical options)**

* **Deep ensembles**: train multiple models; disagreement = epistemic signal (strong baseline)
* **MC dropout**: approximate Bayesian; multiple stochastic forward passes
* **Bayesian linear / GP**: more principled but less common at scale
* **Distance-to-training** signals: Mahalanobis in representation space, kNN density

**Heuristic:** if you need uncertainty in production tomorrow, start with **ensembles** + OOD heuristics.

---

### 2) Calibration: turning scores into trustworthy probabilities

#### What calibration means

If the model predicts 0.8, then among such cases, ~80% should be positive.

###### Reliability diagram

* Bin predictions into buckets (e.g., 0–0.1, …, 0.9–1.0)
* For each bin, plot:

  * x = mean predicted probability
  * y = empirical positive rate

Perfect calibration: points lie on diagonal.

**Gotcha:** choose bins carefully and ensure enough samples per bin; otherwise it’s noisy.

---

#### ECE (Expected Calibration Error)

A weighted average of bin gaps:
ECE = sum_b (n_b / n) * |acc(b) - conf(b)|

* acc(b): empirical positive rate in bin b
* conf(b): mean predicted probability in bin b

**Pros:** single number.
**Cons:** depends heavily on binning; can hide where miscalibration occurs.

**Heuristic:** use ECE as a monitoring scalar, but keep the reliability curve for diagnosis.

---

#### Brier score

Brier = (1 / n) * sum_i (p_i - y_i)^2
Measures probability accuracy (lower is better). It combines calibration + sharpness.

**Heuristic:** Brier is a good default for “probabilities matter.”

---

#### Calibration methods

###### Temperature scaling (multiclass, deep nets)

Scale logits by T:
p = softmax(z / T)

* T>1 softens; T<1 sharpens
* Preserves ranking (AUC unchanged)
* Usually very effective, low risk

###### Platt scaling (binary)

Fit a logistic regression on the model score/logit to map to calibrated probability.

###### Isotonic regression

Non-parametric monotonic mapping.

* Very flexible (can fix weird calibration curves)
* Risk of overfitting with small calibration sets

**Heuristic**

* Large validation set → isotonic can be great
* Smaller set → temperature/Platt is safer

---

### 3) Decision thresholds: from probability to action

#### Bayes-optimal threshold (cost-sensitive)

If predicting positive has cost (C_FP) when wrong and missing a positive has cost (C_FN):
predict positive if p(y = 1 | x) >= C_FP / (C_FP + C_FN)
(assuming equal benefit scaling)

**Key point:** thresholds should come from **costs + constraints**, not “0.5”.

---

#### Constraints change everything

Real systems often have:

* review capacity (only N cases/day)
* latency budgets
* risk limits

So you choose thresholds like:

* “Top-K by score”
* “Maximize recall subject to precision ≥ P”
* “Keep FPR below X”

**Heuristic:** treat thresholding as an optimization problem, not a magic constant.

---

### 4) Bayesian vs frequentist framing for risk decisions

#### Frequentist view

* CIs, p-values, error rates over repeated trials
* Great for A/B testing and reporting

#### Bayesian view

* Posterior distribution over uncertainty
* Natural for decision-making: choose action maximizing expected utility:
  a* = argmax_a E[U(a, θ) | D]

**Practical heuristic**

* Use frequentist tools for controlled experiments/reporting.
* Use Bayesian reasoning when you must make decisions under uncertainty with asymmetric costs (risk systems, medical triage, fraud review).

---

### 5) Expected utility / decision curves

Instead of optimizing AUC, optimize business outcome:
EU(t) = E[Benefit - Cost | threshold t]

**Decision curve analysis** (common framing):

* Compare net benefit across thresholds, relative to “treat all” and “treat none.”
* Helps communicate to stakeholders: where the model is actually beneficial.

**Heuristic:** if you can’t map metric lift to dollars/harms, you’ll argue forever about thresholds.

---

### 6) Conformal prediction (coverage guarantees)

#### What it gives you

A principled way to produce:

* **Prediction sets** for classification (set of labels)
* **Prediction intervals** for regression

With a guarantee:

> Under exchangeability, coverage is (1-\alpha).
> E.g., 90% of future points will have true label inside the predicted set.

#### How it works (high level)

1. Split data: train model + calibration set
2. Compute **nonconformity scores** on calibration points (how “strange” each example is)
3. Choose a quantile threshold from these scores
4. For a new point, output set/interval of outcomes whose score is below threshold

###### Variants you’ll hear

* **Split conformal**: simplest, most used
* **Mondrian conformal**: conditional coverage by groups (e.g., per class/segment)
* **Conformalized quantile regression**: strong for regression intervals

#### Where it shines in MLOps

* **Abstention / human-in-the-loop**: if prediction set is large/uncertain → route to review.
* **Safety**: “only auto-act when confidence set is single label / narrow interval.”
* Works even when model is miscalibrated, because it calibrates *coverage*.

#### Gotchas

* Requires approximate **exchangeability**; drift breaks guarantees.
* Gives marginal coverage, not necessarily per-slice (use Mondrian or monitor).
* Coverage can be achieved with very large sets if the model is weak.

**Heuristic:** conformal is a great “safety wrapper” around any model—monitor set size as a health signal.

---

#### Practical summary

* Uncertainty splits into **aleatoric (irreducible)** and **epistemic (lack of knowledge / OOD)**; ensembles are a strong production baseline for epistemic.
* Calibration is about **probability correctness** (reliability curves, ECE, Brier). Use temperature/Platt/isotonic depending on data size and risk.
* Decisions should be driven by **expected utility** under costs/constraints; optimal thresholds come from costs, not 0.5.
* Conformal prediction provides **coverage guarantees** and is very practical for **abstention and safety**.
