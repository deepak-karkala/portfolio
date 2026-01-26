---
title: 'Customer Lifetime Value (CLV) Prediction'
summary: 'Built a production CLV prediction system that improved marketing ROI by 12% through value-based customer targeting and segmentation'
date: '2023-06-15'
category: 'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)'
categoryDuration: 'Aug 2022 - Nov 2025'
role: 'Senior ML Engineer (Contract)'
duration: ''
location: 'Remote | Europe'
logo: '/logos/ecommerce.png'
techStack:
  - 'Python'
  - 'XGBoost'
  - 'AWS SageMaker'
  - 'AWS Glue'
  - 'AWS Step Functions'
  - 'Terraform'
  - 'CloudWatch'
highlights:
  - 'Built segmented CLV models (early-stage vs established). Improved RMSE by 15-20%, Gini 0.47 to 0.62 for budget-constrained CRM, enabling 12% higher marketing ROI'
  - 'Diagnosed feedback loop where top-decile targeting reinforced bias; led cross-functional exploration budget experiment (10% random allocation), retrained on less-biased data for better high-potential discovery'
  - 'Shipped weekly batch pipeline scoring 300K+ profiles with segment monitoring, costing €75/month'
featured: true
order: 1
---

##

> **Role:** Senior ML Engineer (Contract)
>
> **Context:** Mid-sized European E-commerce marketplace (75K SKUs, 50K DAU, 2.5K orders/day)

---

### The Problem

The marketplace had a growing customer base across Europe, but marketing decisions were still based on **simple RFM rules and loyalty tiers**:

* “2+ orders in the last 6 months”
* “Total spend > €X”
* Ad-hoc “Gold/Silver/Bronze” segments

This approach had several issues:

* High-value customers were **mixed together** with medium-value ones in broad buckets.
* Low-value or one-off customers sometimes received **too much budget**, increasing CAC/payback time.
* There was no clean way to answer:
  > “If I invest €1 in this customer, what is the expected return over the next year?”

The company needed a **forward-looking, individual-level CLV estimate** to:

1. Prioritize limited CRM and retention budget.
2. Tailor offers (e.g., voucher depth) based on expected value.
3. Evaluate whether campaigns were actually improving the **future value** of the customer base.

---

### Business Definition of CLV

We defined CLV in a way that matched how finance and marketing already measured performance:

* **Horizon:** next **12 months** from a reference time.
* **Unit:** EUR, with all multi-currency orders converted using the **FX rate at transaction date**.
* **Net revenue:**  
  * Order value **after discounts/vouchers**,  
  * **Excluding VAT/sales taxes**,  
  * Adjusted for **returns and refunds** within the horizon.

Formally:

> For each customer, CLV = sum of **12-month net revenue**, net of refunds, in EUR.

We **did not** apply a time-discount factor because:

* The horizon was relatively short (12 months).
* CLV was primarily used for **ranking and segmentation**, not strict NPV calculations.
* Simple, interpretable numbers helped adoption.

---

### Data & Label Construction

**Data sources**

* Transactional:
  * Orders, order lines, invoices
  * Returns & refunds
  * Discount and voucher usage
  * Payment methods
  * Product/category metadata
* Behavioral:
  * Web & app events (views, add-to-cart, search, etc.)
  * Email engagement (opens, clicks)
  * App installs and logins
  * All streamed via **Kinesis → Firehose → S3**, then landed in the data warehouse

**Label generation**

We used a cohort-based approach:

1. Choose a **calibration period** where we had at least 12 months of future data.
2. For each customer:
   * Take the end of the calibration window as **t₀**.
   * Sum **net revenue in the next 12 months** → CLV label.
3. Net revenue was computed from invoices, minus any associated returns/refunds within the horizon.
4. Convert all amounts to EUR using the historical FX rate.

We filtered out customers for whom we couldn’t reliably observe the full 12-month horizon (e.g., very new markets with insufficient history).

---

### Handling Cold-Start & Low-History Customers

Not all customers look the same:

* **Segment A — No orders:** pure leads/visitors.  
  → We **did not** assign numeric CLV here; handled separately via propensity models and traditional performance marketing.

* **Segment B — Very early customers (1 order, short tenure):**  
  → We trained a **dedicated early-stage CLV model**, using:
  * Acquisition channel & campaign metadata
  * Country/region & device
  * First-order basket composition (categories, value, discount depth)
  * Payment method
  * Early engagement (sessions, email/app activity in first 30 days)

  Predictions were calibrated by shrinking them towards **segment-level historical averages (country × first-order value band)** to avoid overconfidence.

* **Segment C — Established customers (2+ orders / longer tenure):**  
  → Main **XGBoost** model with richer RFM and behavioral features:
  * Recency, frequency, and monetary aggregates
  * Category & brand affinities
  * Discount sensitivity patterns
  * Device usage patterns
  * Email/app engagement trends
  * Acquisition channel and lifecycle stage

This design acknowledged that **one size does not fit all**—we explicitly separated early-stage and established customers.

---

### Modeling Approach

We considered classical **BG/NBD + Gamma-Gamma** approaches as baselines, but leaned on a **feature-rich gradient boosting model** for production.

**Why XGBoost?**

* Strong performance on **tabular, mixed-type data**.
* Handles non-linear interactions without heavy feature engineering.
* Built-in regularization and early stopping.
* SHAP value support for **model explainability**.

**Baselines**

* Last-12-month revenue as a naive CLV proxy.
* RFM-based CLV band mapping.
* BG/NBD-style frequency-only modeling for comparison.

**Metrics**

* Regression:
  * RMSE, MAE on 12-month CLV.
* Ranking:
  * **Gini coefficient**
  * **Lorenz curves** and decile-level analysis:
    * “What share of future revenue does the top X% predicted customers capture?”

---

### Offline Performance

Compared to the last-12-month revenue baseline:

* RMSE reduced by **~15–20%**
* MAE reduced by **~18–22%**
* Gini improved from **~0.47 → ~0.62**
* Top 10% predicted customers captured **~46–48%** of realized 12-month revenue vs **~39–40%** with the baseline

These gains reflected **better ranking**, which is what matters for constrained-budget marketing.

We also evaluated performance separately for:

* Early-stage vs established customers
* Country/market segments
* Acquisition channels

---

### Production Architecture (Batch Inference on AWS)

We implemented a **weekly batch CLV pipeline**, optimized for cost and simplicity.

**Data & Features**

* Raw events via **Kinesis → Firehose → S3**
* Transactional ETL via **AWS Glue** into S3 + Data Warehouse
* Daily feature engineering:
  * Transient **Glue jobs** aggregating 12-month histories
  * Partitioned Parquet “feature tables” on S3 acting as an **offline feature store**

**Training & Registry**

* On-demand **SageMaker Training** jobs for CLV models (main + early-stage).
* **Sagemaker Model Registry** for experiment tracking and model registry.

**Batch Inference**

* Weekly **SageMaker Batch Transform** to score a few hundred thousand active customers.
* Scores + key features written back to **S3 and DWH**.

**Orchestration & MLOps**

* **AWS Step Functions + EventBridge** orchestrated:
  * ETL/feature jobs
  * Training pipelines
  * Batch inference jobs
* Logs and alerts via **CloudWatch**.
* All infra defined in **Terraform**.

**Cost Optimization**

* No constantly running SageMaker Feature Store or MWAA/Airflow.
* All heavy compute is **transient and pay-per-use**.
* Total incremental CLV stack cost: **~€75/month**.

---

### Governance, Monitoring & Fairness

Because CLV influences allocation of marketing spend, we treated it as a **governed model**.

**Segment-wise monitoring**

For each training run, we sliced performance by:

* Country / market
* Acquisition channel (Paid Search, Paid Social, Organic, Email, Affiliates, etc.)
* Device (desktop, mobile web, app)
* Lifecycle stage (early vs established)
* CLV band (deciles / low–medium–high)

Metrics per segment:

* Calibration: mean predicted vs mean actual CLV; calibration ratio.
* Error: RMSE / MAPE.
* Ranking quality: (where sample size allowed) Gini and revenue share captured by top X%.

**Guardrails**

* Calibration ratio outside **[0.8, 1.2]** for a material segment → flagged.
* MAPE > **1.5× global** → flagged as high risk.
* In A/B tests, if CLV-based targeting underperformed control in a segment by **>5–10%** on ROI or conversion → flagged for adjustment.

---


### A/B testing design

We ran a customer-level A/B test over ~8 weeks. Both groups saw the same campaign calendar and creatives; the only difference was how we selected and prioritized customers – RFM-based in control vs CLV-based in treatment.

On that basis, we saw roughly an 12% lift in marketing ROI, a 10% relative reduction in churn among high-value customers over 90 days. We validated significance and saw similar lifts across key markets, which gave us confidence that the gain came from the CLV model’s better ranking, not from creative differences.

---

### Business & Financial Impact

We validated the CLV system via a **customer-level A/B test**:

* Population: customers with ≥1 past order and marketing consent.
* Randomization: 50/50 split into Control (RFM rules) vs Treatment (CLV-based targeting), stratified by country, value band, and acquisition channel.
* Duration: ~8 weeks; churn measured over **90 days**.

**Results**

* **~12% higher marketing ROI** on CLV-driven campaigns
* **~10% relative reduction in churn** among high-value cohorts (90-day horizon)

---

### Challenges, lessons learned


**Degenerate Feedback Loop**

* Broke a hidden **feedback loop** in the CLV system where “improving” offline metrics masked flat customer retention and slowing high-value segment growth, caused by marketing exclusively targeting the top model-decile and reinforcing its own bias.
* Led a difficult cross-functional discussion with Marketing and Analytics to design an **“exploration budget”** experiment (allocating ~10% of retention spend to randomly sampled customers across the CLV spectrum), aligning stakeholders on short-term KPI trade-offs vs long-term learning.
* Used the new, less-biased data to retrain the CLV model, trading a small drop in offline accuracy for **better discovery of at-risk, high-potential customers** and measurable uplift in downstream A/B tests—framing the pattern as a general MLOps lesson on **governing feedback loops, not just models**.

---

### What I Learned

This project reinforced several key lessons:

* **Definition matters**: getting CLV consistent with finance (net revenue, returns, FX) was crucial for trust.
* **Ranking > point accuracy**: metrics like Gini and Lorenz curves mapped much more directly to business questions than RMSE alone.
* **Cold-start and segmentation need explicit design**: early-stage vs established customers behave differently and deserve different modeling.
* **Governance & calibration are not optional**: without segment-wise checks, we would have quietly under-invested in newer markets.
* **Impact must be proven**: A/B tests, segment-wise analysis, and cost modeling turned CLV from a “nice model” into a **business lever**.

Overall, this CLV system moved the company from heuristic segmentation to **evidence-backed, value-based customer management**, with a minimal and sustainable MLOps footprint.


---