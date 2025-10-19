---
title: 'Customer Lifetime Value Platform'
summary: 'Built a production-grade CLV prediction engine that shifted marketing from historical reporting to proactive investment decisions.'
date: '2022-11-30'
category: 'E-commerce'
techStack:
  - AWS SageMaker
  - AWS Glue
  - Amazon EMR
  - MLflow
  - XGBoost
  - Terraform
  - Great Expectations
highlights:
  - '18% lift in marketing ROI by activating CLV-driven campaign targeting and budget allocation.'
  - '95% reduction in manual ops through fully automated weekly retraining and batch scoring pipelines.'
---

## Engagement Snapshot
- Scope: Predict 12-month customer lifetime value (CLV) for millions of shoppers and operationalize insights across marketing systems.
- Role: ML Engineer & Data Scientist responsible for architecture, delivery, and enablement.
- Team: Partnered with a Product Manager (strategy) and a Data Engineer (source system integrations).

## Business Context & Challenge
Marketing spend was allocated using backward-looking metrics, making it difficult to identify high-value prospects, prioritize retention, or justify CAC. Leadership needed a forward-looking signal that was accurate, explainable, and operationally robust.

## What I Delivered
### Data & Feature Foundations
- Engineered automated ingestion pipelines with AWS Glue and Great Expectations to enforce data quality SLAs.
- Built Spark-on-EMR feature jobs to compute recency-frequency-monetary (RFM) profiles, cohort attributes, marketing engagement, and derived lifetime value signals.

### Modelling & Evaluation
- Iterated from simple heuristics to a calibrated XGBoost regressor with rigorous cross-validation, residual analysis, and fairness checks across customer cohorts.
- Established MLflow-driven experiment tracking and model lineage to ensure reproducibility.

### MLOps & Deployment
- Designed SageMaker Pipelines for training, evaluation, conditional registration, and weekly batch inference to keep scores fresh.
- Automated CICD via Terraform + Bitbucket Pipelines, including smoke tests, data drift checks, and shadow deployments before promotion.
- Pushed scored segments into downstream systems (Redshift, Braze) via serverless data movers for immediate activation.

## Impact
- **+18% marketing ROI** by reallocating budget toward high-value cohorts and suppressing low-value acquisition channels.
- **-12% churn** in premium customer segments through proactive, CLV-informed retention campaigns.
- **+7% conversion rate** uplift during targeted campaign windows.
- **95% reduction in manual effort** thanks to automation of the entire training-to-deployment lifecycle.

## Architecture Notes
- Event-triggered SageMaker Processing jobs generate weekly inference runs, writing results to S3, Redshift, and Braze audiences.
- Great Expectations gatekeepers block low-quality data early, protecting downstream model performance.
- SHAP-based explainability surfaces key drivers for marketers, embedded into Looker dashboards for transparency.

## Lessons Applied
- Paired quantitative metrics (MAPE, precision@k) with business guardrails so leadership could evaluate quality without ML jargon.
- Created a retraining playbook and runbooks to ensure marketing ops could troubleshoot without engineering escalation.
