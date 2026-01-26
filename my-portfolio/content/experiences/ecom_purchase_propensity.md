---
title: 'Real-Time Purchase Intent Scoring'
summary: 'Deployed a session-level purchase propensity model achieving 5% conversion uplift with 40% reduction in p99 latency through Redis optimization'
date: '2023-03-20'
category: 'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)'
categoryDuration: 'Aug 2022 - Nov 2025'
role: 'Senior ML Engineer (Contract)'
duration: ''
location: 'Remote | Europe'
techStack:
  - 'Python'
  - 'LightGBM'
  - 'Spark Structured Streaming'
  - 'Feast Feature Store'
  - 'Redis/ElastiCache'
  - 'AWS Kinesis'
  - 'AWS EMR'
  - 'AWS Step Functions'
highlights:
  - 'Deployed sub-second scoring for 60K+ daily predictions (Feast + ElastiCache) with Spark Structured Streaming features (50K+ events/hour) and class-weighted LightGBM (20:1 imbalance)'
  - 'Optimized feature fetch to achieve 40% p99 latency reduction'
  - 'Resolved production calibration breakdown eroding marketing trust; added segment-wise reliability analysis + post-hoc calibration, restoring confidence.'
  - 'Designed end-to-end A/B testing strategy delivering +5% conversion uplift.'
featured: true
order: 2
---

##

> **Role:** Senior ML Engineer (Contract)
>
> **Context:** Mid-sized European E-commerce marketplace (75K SKUs, 50K DAU, 2.5K orders/day)

---

### The Problem

The marketplace wanted to be more intelligent about **when and how** it nudged shoppers during their visit.

Before this project, personalization was driven mainly by:

* Hard-coded rules (“show discount banner when cart value > X”)
* Basic segments (new vs returning, simple RFM)
* Static recommendation widgets

This led to a few issues:

* **Wasted incentives:** discounts given to users who would probably buy anyway.
* **Missed rescue opportunities:** no smart way to identify “on-the-fence” sessions that could be saved with the right nudge.
* **Inconsistent user experience:** different parts of the funnel had competing triggers and no unified notion of “how likely is this session to convert?”.

The hypothesis:

> If we could estimate, in real time, the **probability that the current session will result in a purchase**, we could drive more principled decisions: which sessions to incentivize, which to upsell, and which to leave alone.

---

### The Objective

Design and deploy a **session-level purchase propensity model** that:

1. Ingests **live clickstream** and historical data,
2. Outputs a **calibrated probability of purchase** per eligible session,
3. Integrates with the on-site decision engine (offers, banners, upsell slots),
4. Operates at **low latency** under production traffic,
5. Delivers **measurable uplift** validated through clean A/B tests,
6. Runs on a **cost-conscious, maintainable MLOps stack**.

---

### Data & Target Definition

**Prediction target**

* Unit: **session** (web or app).
* Label: 1 if the session resulted in at least one purchase (or within a short grace window), 0 otherwise.
* We filtered out obvious noise (bots, single-heartbeat sessions) and focused on sessions with at least some product interaction.

**Data sources**

* **Clickstream events** (Kinesis → S3): page views, product views, add-to-cart/remove-from-cart, search queries, device info, referrers.
* **Transactional data**: orders, line items, discounts, returns.
* **User & product attributes**: segments, geography, product category/brand, price bands, basic margin proxies.

This gave us the raw ingredients for:

* Historical user behaviour (recency, frequency, AOV, category preferences),
* Product popularity and conversion patterns,
* Within-session behavioural signals (depth, speed, friction points).

---

### Feature Engineering & Feature Store

We split features into **batch** vs **streaming** to balance richness and freshness.

#### Daily batch features (Spark on EMR)

* **User-level features**
  * Lifetime and 90-day purchase counts, recency, AOV
  * Category/brand affinities
  * Discount sensitivity (fraction of orders with coupons, depth of discounts)
* **Product-level features**
  * View-to-purchase rates over 7/30 days
  * Recent demand and price bands
  * Basic margin proxies

These were computed in a daily EMR Spark job and written as partitioned Parquet tables on S3, then surfaced via **Feast’s offline store**.

#### Real-time streaming features (Spark Structured Streaming)

* **Session-level features**
  * Session duration, number of page views
  * Add-to-cart count, cart composition stats
  * Distinct products viewed, last event type, scroll/depth signals where available
* **Session–product interaction features**
  * How often the current product/category was viewed in this session
  * Sequence of key events (view → add-to-cart → checkout, etc.)

We used **Spark Structured Streaming** reading from Kinesis, with:

* Keyed streams by `session_id`
* `flatMapGroupsWithState` to maintain **per-session state** across micro-batches
* **Event-time watermarks** and timeouts so inactive sessions were evicted and the state store remained bounded
* Checkpointing on S3 for recovery

The streaming job wrote session features into **Feast’s online store backed by Redis/ElastiCache**. User and product features were also exported to Redis to avoid extra round-trips during inference.

#### Why a feature store?

Using **Feast** ensured that:

* Training and serving used **the same feature definitions**, reducing training–serving skew.
* Features were **discoverable and reusable** by other models.
* We had a clean abstraction over offline (S3) and online (Redis) storage.


#### Feature Engineering Data Scale

* The daily batch feature pipeline ran on an ephemeral EMR/Spark cluster and scans roughly 30–90 days of historical data per run – on the order of 30–180 GB of clickstream logs (tens of millions of events) plus a few GB of transactional and CRM data. Each run produces ~300k user feature rows and ~75k product feature rows, which were written as Parquet to S3 and registered in Feast as the offline store for training and backfills

* The real-time streaming feature pipeline processed on the order of 1M clickstream events per day (≈1–2 GB of JSON logs), which translated to an average of 10–15 events/second and peak loads of 50–100 events/second during traffic spikes. It maintained state for roughly 50k–100k active sessions at peak and wrote ~100k session feature records per day into Feast (both the Redis online store and the S3-backed offline store).

---

### Modeling & Class Imbalance

We framed the problem as **binary classification**:

* Input: user, session, and product features.
* Output: probability that the session ends in a purchase.

The positive class (“purchase sessions”) made up only a small fraction of all sessions. To handle this:

* We used **class-weighted LightGBM**, setting `scale_pos_weight` approximately to `negatives/positives` in the training window, then tuning it via HPO.
* We applied **mild negative downsampling** on very low-information negatives (e.g., bounces) while keeping all positives, and used sample weights so that the overall loss still reflected true base rates.
* We prioritized **PR-AUC** and **recall/precision at operational thresholds** (e.g., top X% of sessions by score) over ROC-AUC alone.

We also spent time on **calibration**:

* Reliability curves: binning predicted scores and comparing predicted vs actual conversion rates.
* Brier score and segment-level calibration by device/country/traffic source.
* When needed, we applied simple **post-hoc calibration** (Platt scaling/isotonic regression) on top of LightGBM scores.

The goal was not just to rank sessions, but to produce **probabilities that business stakeholders could reason about**.


#### Training Data Scale

Each weekly retraining job pulled roughly 2–3 million session-level examples (about 80–100k purchases) from the last 4 weeks of traffic, with on the order of 50 engineered features per row. In storage terms that’s tens of millions of raw events (~30–40 GB) feeding into about 1–3 GB of feature data used per training run.

---

### Hyperparameter Optimization (HPO)

We used **SageMaker Automatic Model Tuning** with Bayesian optimization:

* Tuned LightGBM hyperparameters around:
  * Tree complexity: `num_leaves`, `max_depth`, `min_data_in_leaf`
  * Learning dynamics: `learning_rate`, `num_iterations` (with early stopping)
  * Regularization & sampling: `feature_fraction`, `bagging_fraction`, `lambda_l1`, `lambda_l2`
  * Imbalance: `scale_pos_weight`
* Objective: maximize **validation PR-AUC** on a time-based train/validation split.

HPO was integrated into a **training pipeline** orchestrated by **Step Functions**:

1. Build training/validation datasets via EMR from the offline feature store.
2. Launch a SageMaker tuning job with a fixed budget of candidate trials.
3. Retrieve the best configuration and run evaluation + calibration checks.
4. If the model passed automated gates, register it and roll it out via a controlled deployment.

We carefully limited the number and size of HPO trials to keep this step **cost-bounded** while still improving performance and robustness.

---

### Real-Time Inference Architecture

The production path for scoring a live session:

1. The frontend/app sends events to **Kinesis** in real time.
2. Streaming jobs update session features in **Redis** via Feast.
3. When an action needs a score (e.g., cart view, key funnel step), the application calls a **backend scoring API**.
4. The scoring service:
   * Resolves `user_id`, `session_id`, and relevant `product_id`.
   * Uses a Redis client with **persistent connection pooling and pipelining** to fetch:
     * `user:{user_id}` hash
     * `session:{session_id}` hash
     * `product:{product_id}` hash (where needed)
   * Assembles the full feature vector and calls the **LightGBM model on a SageMaker endpoint**.
   * Returns the propensity score and optional explanation signals.

Through Redis optimization (compact hashes, pipelined HMGETs, VPC co-location, right-sized ElastiCache instances), we brought **feature lookup latency down to single-digit milliseconds**, contributing to an overall **~40% reduction in p99 inference latency** compared to the initial naive implementation.

---

### Experimentation & Business Impact

To validate impact, we ran a **two-week A/B test**:

* **Randomization unit:** user (logged-in user_id or stable anonymous ID).
* **Split:** 50/50 between Control and Treatment.
* **Control:** existing rule-based targeting.
* **Treatment:** model-driven propensity scores feeding into a simple decision policy (high, medium, low bands).

Metrics were computed from event and order logs per variant:

* **Overall conversion rate**
* **Average order value (AOV)**
* Offer interaction metrics (impressions, clicks, acceptances)
* Operational indicators (latency, error rates)

The test showed:

* **~5% relative uplift in overall conversion** in Treatment vs Control.
* **~3.5% uplift in AOV** among users who interacted with model-driven offers.
* Stable infra and latency metrics throughout the test window.

These results, combined with a deliberately **lean infrastructure footprint**, made the case for full rollout.

---

### Comprehensive ML Testing Strategy

* Designed and drove a multi-layer ML testing strategy for the purchase-intent platform – led cross-functional work with data engineering, infra, and marketing to introduce schema & drift checks (Great Expectations), unit/integration tests for Spark pipelines, behavioral & slice-based model tests, and load/contract tests on the serving stack (Locust, Pytest). This significantly reduced production regressions, caught data/feature issues before deployment, and increased stakeholder confidence in running frequent model and pipeline updates.


---


### Architecture & Cost Optimization

From an MLOps perspective, a key part of the project was making sure the system provided **strong uplift without becoming an expensive MLOPs project**.

Some of the decisions:

* Use **Step Functions** for training + HPO to avoid running an orchestration cluster 24/7.
* Right-size EMR streaming clusters and Redis/SageMaker instances to actual traffic (well under “overkill” levels), with autoscaling where appropriate.
* Design idempotent sinks and compact feature representations so we could rely on **checkpointing and recovery** without risking data duplication or bloat.

The end result was a system where the **relative business gains outweighed the infrastructure footprint**, which is often the deciding factor for long-term adoption.

---

### Production Challenges

* Resolved a calibration & trust breakdown with marketing around the purchase-intent model: led a cross-functional investigation when “0.8 propensity ≠ 80% conversion” in production, performed segment-wise reliability analysis (device/country), added a post-hoc calibration stage (isotonic regression + segment adjustments) to the training pipeline, and co-designed new thresholds with marketing based on lift/ROI. This restored stakeholder trust in model scores and improved both conversion and AOV uplift in the follow-up A/B test.

---

### A/B Testing & Experiment Design

I developed the end-to-end A/B testing strategy to prove that **intent-based personalization** beat the existing rule-based setup.

**What we tested**

- **Control:** legacy rule-based targeting (cart- and category-based rules, no real-time ML).
- **Treatment:** new **session-level purchase intent model**, using score buckets (high / medium / low intent) to decide when and how to show personalized offers and upsell placements.
- Everything else (UX, pricing, inventory) was identical; only the **decision logic** changed.

**Design & implementation**

- **Unit & allocation:** randomized at the **user level** (user_id or stable device ID), 50/50, via a hash-based bucketing function so each user saw a consistent experience across sessions.
- **Duration:** **14 days** to cover weekday/weekend patterns and avoid novelty bias.
- **Wiring:** server-side assignment propagated into the personalization service, frontend events, and order logs so analytics could reliably attribute every conversion to its variant.

**Metrics & impact**

- Primary metric: **conversion rate**; secondary: **AOV**, revenue per session, offer engagement.
- We computed impact with standard two-sample tests and confidence intervals. The final readout showed **~5% relative uplift in conversion** and **~3.5% AOV uplift** among users who interacted with model-driven offers, with strong statistical significance.

**Challenges & how we handled them**

- Fixed early **contamination and logging issues** (users switching arms, missing experiment flags) by moving to stable user-level assignment, repairing logging, and adding sanity checks (bucket balance, event coverage).
- Worked with analytics and marketing to reconcile conflicting dashboards, standardize experiment SQL, and present a single “source of truth” for experiment results.


---

### Technical Highlights

* **Data & Features:** Kinesis → Spark (batch + streaming) → S3 + Feast (offline/online)
* **Modeling:** LightGBM with class weights, calibrated probabilities, HPO via SageMaker
* **Serving:** Redis + SageMaker endpoint with pipelined lookups and low-latency inference
* **Streaming:** Spark Structured Streaming with `flatMapGroupsWithState`, watermarks, timeouts, checkpointing
* **MLOps:** Step Functions (training), Terraform, CloudWatch, data-quality checks, A/B experimentation

---

### What I Learned

A few takeaways from this project:

* **Real-time ML is mostly systems work.** Getting Kinesis, Spark Streaming, Redis, and SageMaker to work together reliably was as important as picking the right model.
* **Calibration and experimentation are non-negotiable.** A model with a nice ROC-AUC isn’t enough; you need calibrated scores and solid A/B tests to drive real decisions.
* **Cost and simplicity matter.** Lean architecture and clear ROI make it easier for a business to say “yes” and keep saying “yes” to ML systems.
* **Collaboration with product/marketing is key.** Co-designing the score-to-action policy and explaining what scores mean in business terms made adoption much smoother.

This project was a good example of taking a classic “propensity model” idea and turning it into a **real-time, production-grade, high-ROI ML system** that both engineers and business stakeholders could get behind.

