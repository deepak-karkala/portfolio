---
title: 'Real-Time Purchase Propensity Scoring'
summary: 'Activated personalised offers by predicting purchase intent in-session with a hybrid streaming and batch ML platform.'
date: '2022-07-18'
category: 'E-commerce'
techStack:
  - AWS SageMaker
  - Apache Spark
  - Apache Kafka
  - Feast
  - LightGBM
  - GitHub Actions
  - Terraform
highlights:
  - '5.2% conversion lift and 3.5% higher AOV through real-time propensity-driven interventions.'
  - 'Production-grade hybrid feature store combining streaming and batch pipelines with automated retraining.'
---

## Engagement Snapshot
- Scope: Predict a shopper’s likelihood to convert within their active session to trigger timely promotions, content, or service interventions.
- Role: Lead ML Engineer/Data Scientist overseeing solution design, implementation, and operations.
- Team: Worked alongside a product trio (PM, designer) and a single backend engineer for integration.

## Business Context & Challenge
The marketplace needed to move beyond static, rule-based merchandising. Without an understanding of real-time intent, users abandoned carts and generic offers eroded margins. Previous experiments stalled due to feature drift and manual deployments.

## What I Delivered
### Feature Platform
- Built daily Spark batch jobs for durable behavioural aggregates and Spark Streaming pipelines for low-latency signals.
- Unified features in Feast to guarantee training-serving consistency and provide versioned, discoverable feature sets.

### Modelling & Deployment
- Progressed from baseline logistic regression to a calibrated LightGBM model optimised for both ROC-AUC and calibration.
- Staged ML pipeline on SageMaker with automated canary rollouts; GitHub Actions orchestrated build, test, and deploy workflows.
- Quantised the model and introduced a Redis feature cache to hit sub-50ms inference latency at p95.

### Monitoring & Continual Learning
- Implemented data drift, feature freshness, and business KPI monitors, triggering retraining jobs when thresholds degraded.
- Captured post-intervention outcomes to retrain models on actual uplift, closing the feedback loop.

## Impact
- **+5.2% user conversion rate** lift in production A/B tests by delivering the right incentive at the right moment.
- **+3.5% increase in Average Order Value** for users exposed to personalised treatments.
- **40% reduction in p99 latency**, ensuring responsiveness during peak trading events.
- Reduced model deployment cycle from a week to **under two hours** with automated CI/CD.

## Architecture Notes
- Hybrid streaming architecture: Kafka ➝ Spark Structured Streaming ➝ Feast online store (Redis) for real-time serving.
- Batch pipelines refresh offline store nightly, enabling richer context without sacrificing latency.
- Observability stack couples ML metrics with business dashboards so merchandising can respond quickly to changes.

## Takeaways
- Calibrated probability outputs unlocked value for downstream teams (e.g., marketing could map thresholds to offer cost).
- Investing early in feature infrastructure avoided the “training-serving skew” pitfalls that derail most real-time ML projects.
