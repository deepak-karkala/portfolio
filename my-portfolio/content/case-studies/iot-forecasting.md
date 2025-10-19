---
title: 'Energy Demand Forecasting for Smart Buildings'
summary: 'Delivered accurate 72-hour energy forecasts that unlocked new revenue streams and product features for a smart energy platform.'
date: '2023-04-20'
category: 'IoT & Energy'
techStack:
  - AWS SageMaker
  - AWS Glue
  - AWS Step Functions
  - Amazon Timestream
  - XGBoost
  - Prophet
  - Terraform
highlights:
  - '<10% MAPE on 24-hour ahead building forecasts powered supplier contracts and resident-facing insights.'
  - 'Automated monthly retraining and daily inference pipelines with Terraform-defined serverless infrastructure.'
---

## Engagement Snapshot
- Scope: Forecast aggregated building-level energy demand 24–72 hours ahead for 120 buildings.
- Role: Lead Data Scientist & MLOps Engineer responsible for strategy, delivery, and operations.
- Stakeholders: Energy supply partners, product leadership for consumer app, and platform engineering.

## Business Context & Challenge
Energy suppliers needed reliable demand insight for grid balancing, while residents wanted guidance on aligning appliance usage with solar production. Historical attempts were manual, error-prone, and lacked the fidelity to act on.

## What I Delivered
### Modelling Strategy
- Benchmarked classical techniques (SARIMAX, Prophet) before converging on a high-performing XGBoost model for production.
- Selected the optimal aggregation grain (building-level) to balance forecast accuracy, computational cost, and data availability.

### Feature & Data Engineering
- Designed Glue pipelines to cleanse and enrich telemetry with lagged/rolling statistics, holiday calendars, and aligned future weather forecasts.
- Created reusable configuration-driven jobs so new buildings could be onboarded with zero code changes.

### Automated ML Operations
- Built Terraform-provisioned Step Functions for monthly retraining and daily inference, each with isolated CI/CD in Bitbucket.
- Stored forecasts in Amazon Timestream and exposed them through API Gateway/Lambda to power both B2B feeds and the “Smart Energy Advisor” in the resident app.

### Monitoring & Lifecycle Management
- Instrumented data drift, forecast error tracking, and model explainability (SHAP) dashboards in CloudWatch to maintain trust.
- Embedded automated approval gates before model promotions using SageMaker Model Registry and integration tests.

## Impact
- **<10% Mean Absolute Percentage Error (MAPE)** on 24-hour forecasts, surpassing contract thresholds for external energy partners.
- **15% increase in resident engagement** with the energy management experience, driving a **~10% lift in solar self-consumption**.
- Eliminated manual forecast generation, enabling a completely autonomous pipeline with clear on-call runbooks.

## Architecture Notes
- Serverless-first design leveraging Glue, Step Functions, and SageMaker Processing for cost-efficient scale.
- Modular configuration files allow the same pipeline to support new geographies and weather providers with minimal changes.
- Data quality guardrails powered by Great Expectations and automated Slack alerts keep operational noise low.

## What’s Next
The platform now has the foundations to extend into DER optimization—optimizing battery storage dispatch and coordinating demand-response programs—without re-architecting the core ML infrastructure.
