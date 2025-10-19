---
title: 'Predictive Maintenance for Smart Heating'
summary: 'Shifted a nationwide smart-building operator from reactive break/fix to predictive maintenance with measurable service gains.'
date: '2023-08-15'
category: 'IoT & Energy'
techStack:
  - AWS SageMaker
  - AWS Glue
  - AWS Step Functions
  - Terraform
  - Docker
  - XGBoost
highlights:
  - '20% reduction in emergency heating call-outs by surfacing high-precision anomaly alerts.'
  - 'Fully automated ML lifecycle: IaC-provisioned pipelines, model registry governance, and proactive retraining.'
---

## Engagement Snapshot
- Scope: End-to-end predictive maintenance system for 3,000 apartments across 120 buildings.
- Role: Sole Data Scientist & MLOps Engineer.
- Team: Partnered with maintenance leadership and a platform engineer for integrations.

## Business Context & Challenge
The company relied on residents reporting heating failures before dispatching technicians, leading to expensive emergency call-outs and poor customer experience. The executive mandate was to move to a predictive maintenance model without historical labels or mature ML infrastructure.

## What I Delivered
### Strategic Roadmap
- Designed a phased approach that started with unsupervised anomaly detection (Isolation Forest) and evolved into a supervised XGBoost classifier once technician feedback generated labels.
- Established the “feedback flywheel” by embedding an annotation loop in the maintenance app so every technician decision enriched the dataset.

### Production-Grade Pipelines
- Built Glue-based feature engineering that fused IoT telemetry, weather signals, and temporal features (lags, rolling stats).
- Containerised training and inference workloads for SageMaker, orchestrated with Step Functions and EventBridge.
- Created a serverless batch inference layer that scored all assets nightly and persisted prioritized alerts in DynamoDB for the field teams.

### Governance & Observability
- Implemented SageMaker Model Registry with automated integration and regression checks in Bitbucket Pipelines before promotion.
- Added cloud-native monitoring, alerting, and drift detection to keep the model responsive to seasonal changes.

## Impact
- **20% fewer emergency call-outs** within six months versus the previous reactive baseline.
- **75% precision@50** on top-tier alerts, keeping technician attention on actionable issues.
- **15–20% gain in maintenance team efficiency** by enabling proactive scheduling instead of crisis response.

## Architecture Notes
- Event-driven AWS stack (Glue ➝ Step Functions ➝ SageMaker ➝ DynamoDB) defined end-to-end in Terraform.
- Batch inference via SageMaker Batch Transform with parallelized job orchestration to keep nightly SLA under one hour.
- Built automated canary tests for each pipeline stage, ensuring regressions were caught before reaching production.

## Why It Matters
By delivering repeatable automation and human-in-the-loop learning, the organization now has a scalable blueprint for condition-based maintenance that can be applied to additional building systems (e.g., ventilation, solar storage) without rebuilding the core platform.
