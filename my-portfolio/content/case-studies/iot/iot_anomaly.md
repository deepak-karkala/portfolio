# Anomaly Detection in Time Series IoT Data

<!-- ## Anomaly Detection in Heating Energy Consumption using IoT Data for Predictive Maintenance -->

##
---

### TL;DR: Predictive Maintenance for Smart Heating Systems

*   **Challenge:** A home automation company faced high operational costs and resident dissatisfaction due to reactive maintenance of apartment heating systems. Failures were only addressed after residents reported discomfort, leading to expensive emergency call-outs and a poor customer experience. The goal was to shift from this reactive model to a proactive, predictive maintenance strategy.

*   **My Role & Solution:** As the sole Data Scientist and MLOps Engineer, I designed and built the end-to-end Machine Learning system to proactively detect heating anomalies. My contributions spanned the entire ML lifecycle:
    *   **Strategic Approach:** I developed a phased ML strategy, starting with unsupervised models (like Isolation Forest) to provide immediate value in the absence of labeled data, and establishing a human-in-the-loop feedback system with maintenance technicians. This data flywheel was crucial for collecting labels, which enabled the transition to a high-performing supervised XGBoost model.
    *   **Feature Engineering:** I designed and implemented robust data pipelines in AWS Glue to process raw IoT sensor data (heating energy, room/setpoint temperatures) and external weather data, creating crucial temporal features like lags and rolling averages that captured the system's dynamic behavior.
    *   **MLOps Infrastructure:** Using Terraform and Bitbucket Pipelines, I built and automated the entire MLOps workflow on AWS. This included containerized model training (Docker/ECR), orchestrated by AWS Step Functions, and a serverless inference pipeline using SageMaker Batch Transform.
    *   **Production Lifecycle Management:** I implemented a complete model lifecycle using SageMaker Model Registry for versioning and governance, with automated integration tests to validate deployments. I also established a monitoring and retraining framework to address model drift and ensure long-term performance.

*   **Impact:** The deployed system successfully transitioned the company to a data-driven maintenance approach. Within the first six months of operation, the solution achieved:
    *   **A 20% reduction in emergency maintenance call-outs** for heating systems, by identifying developing issues before they became critical failures.
    *   **A 75% precision rate (Precision@50)** on the highest-priority alerts, ensuring that technician time was focused on investigating real, actionable issues.
    *   **An estimated 15-20% improvement in operational efficiency** for the maintenance team through better planning and prioritization of tasks.

*   **System Architecture:** I architected and implemented the entire AWS-based solution, focusing on serverless, scalable, and automated components.

![](../_static/past_experiences/iot_anomaly/contributions.png)





### Introduction

#### Purpose

This document provides detailed technical information about the Machine Learning (ML) based Anomaly Detection system. It serves as a guide for developers, MLOps engineers, and operations teams involved in maintaining, operating, and further developing the system.

#### Business Goal

The primary goal is to transition from reactive to predictive maintenance for apartment heating systems. By detecting anomalies indicative of potential malfunctions *before* they cause resident discomfort or system failure, the system aims to:

*   Reduce operational costs associated with emergency maintenance.
*   Optimize maintenance scheduling and resource allocation.
*   Improve heating system reliability and uptime.
*   Enhance overall resident satisfaction.

#### Key Technologies

*   **Cloud Platform:** AWS (Amazon Web Services)
*   **Data Lake:** Amazon S3
*   **Data Processing/ETL:** AWS Glue (PySpark), AWS Lambda (Python), SageMaker Processing Jobs (PySpark/Scikit-learn)
*   **Feature Management:** Amazon SageMaker Feature Store (Offline Store)
*   **Model Training:** Amazon SageMaker Training Jobs (using custom Docker containers)
*   **Model Inference:** Amazon SageMaker Batch Transform
*   **Model Registry:** Amazon SageMaker Model Registry
*   **Orchestration:** AWS Step Functions
*   **Scheduling:** Amazon EventBridge Scheduler
*   **Alert Storage:** Amazon DynamoDB
*   **Infrastructure as Code:** Terraform
*   **CI/CD:** Bitbucket Pipelines
*   **Containerization:** Docker
*   **Core Libraries:** PySpark, Pandas, Scikit-learn, Boto3, Joblib, PyYAML


### Table of Contents

1.  [Introduction](#introduction)
    *   [Purpose](#purpose)
    *   [Business Goal](#business-goal)
    *   [Scope](#scope)
    *   [Key Technologies](#key-technologies)
2.  [Discovery and Scoping](#discovery-and-scoping)
    *   [Use Case Evaluation](#use-case-evaluation)
    *   [Product Strategies](#product-strategies)
    *   [Features](#features)
    *   [Product Requirements Document](#product-requirements-document)
    *   [Milestones and Timelines](#milestones-and-timelines)
3.  [System Architecture](#system-architecture)
    *   [Overall Data Flow](#overall-data-flow)
    *   [Training Workflow Diagram](#training-workflow-diagram)
    *   [Inference Workflow Diagram](#inference-workflow-diagram)
4.  [Challenges and learnings](#challenges-and-learnings)
5.  [Configuration Management](#configuration-management)
6.  [Infrastructure as Code (Terraform)](#infrastructure-as-code-terraform)
    *   [Stacks Overview](#stacks-overview)
    *   [Key Resources](#key-resources)
7.  [Cost Analysis](#cost-analysis)
8.  [CI/CD Pipeline (Bitbucket)](#cicd-pipeline-bitbucket)
    *   [CI Workflow](#ci-workflow)
    *   [Training CD Workflow](#training-cd-workflow)
    *   [Inference CD Workflow](#inference-cd-workflow)
9.  [Deployment & Execution](#deployment--execution)
    *   [Prerequisites](#prerequisites)
    *   [Initial Deployment](#initial-deployment)
    *   [Running Training](#running-training)
    *   [Running Inference](#running-inference)
    *   [Model Approval](#model-approval)
10.  [Monitoring & Alerting](#monitoring--alerting)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Security Considerations](#security-considerations)
13. [Roadmap & Future Enhancements](#roadmap--future-enhancements)
14. [Appendices](#appendices)
    *   [Configuration File Example](#configuration-file-example)




### Discovery and Scoping

#### Use Case Evaluation 

![](../_static/past_experiences/iot_anomaly/use_case.png)


#### Product Strategies

![](../_static/past_experiences/iot_anomaly/strategy.png)

#### Features

![](../_static/past_experiences/iot_anomaly/features.png)

#### Product Requirements Document

![](../_static/past_experiences/iot_anomaly/prd.png)

#### Development Stages

<!--![](../_static/past_experiences/iot_anomaly/stages.png)-->
<p align="center">
    <img src="../_static/past_experiences/iot_anomaly/stages.png" width="75%"> 
</p>


### System Architecture

#### Overview

The system follows a modular, event-driven, and batch-oriented architecture on AWS. It consists of distinct pipelines for data ingestion, model training, and daily inference. Orchestration relies heavily on AWS Step Functions, with SageMaker providing core ML capabilities.

<!--![](../_static/past_experiences/iot_anomaly/pipelines.png)-->
<p align="center">
	<img src="../_static/past_experiences/iot_anomaly/arch.png" width="100%"> 
</p>

<!--
#### Data Characteristics

*   **Buildings:** 10 dozen = **120 buildings**.
*   **Apartments:** **3,000 apartments**.
*   **Sensors/Readings per Apartment:** ~8 (1 Energy, 1 Hot Water, 3 rooms * [1 Temp + 1 Setpoint]). Total sensors/readings ~24,000.
*   **Base Frequency:** Potential reading every 15 minutes.
*   **Storage Optimization:** Data is only recorded on change. We'll assume a **change rate of 10-20%** on average for sensor readings per interval, as temperatures, setpoints, and consumption are not constantly fluctuating dramatically. This is a crucial factor for volume estimation.
*   **Weather Data:** Fetched per building or per small geographical cluster of buildings.


| Data Type | Daily Volume (Average) | Data Velocity | Data Profile & Governance Notes |
| :--- | :--- | :--- | :--- |
| **IoT Sensor Data (Time Series)** | **150 - 300 MB per day.** <br>This is the highest volume data. Calculated from ~3,000 apartments with ~8 readings each, potentially every 15 mins. Volume is significantly reduced by only storing changed values (assuming 10-20% avg change rate per interval). Spikes in volume can occur during coordinated events (e.g., building-wide heating adjustments, morning rush hour). | **Near Real-Time Events, Processed in Batch.** <br>Individual sensor readings are generated continuously, collected by in-apartment tablets, and sent periodically to the central database. Data is ingested into the analytical platform via **daily or hourly batch jobs** (e.g., using AWS Glue). | **Semi-Structured (JSON/DB Rows).** <br>Each record contains `apartment_id`, `building_id`, `timestamp`, `sensor_type` (e.g., `heating_energy_kwh`, `room_temp_c`, `setpoint_temp_c`, `hot_water_litres`), and `value`. <br>**Governance:** Data is linked to a specific apartment/building, making it sensitive. While not direct PII, it reveals resident behavior patterns. Governed by **FADP/GDPR**. Anonymization or pseudonymization is required for non-operational analysis. Data quality monitoring for sensor drift/failure is critical. |
| **Aggregated Consumption Data** | **< 10 MB per day.** <br>This data is derived from the raw IoT sensor data. Volume is low as it contains one aggregated record per building per hour. | **Batch-Generated.** <br>Created by a **daily AWS Glue ETL job** that processes the previous day's IoT sensor data. Not a direct stream from a source. | **Highly Structured (Parquet).** <br>Consists of a table with a well-defined schema: `building_id`, `timestamp_hour`, `total_consumption_kwh`, `total_solar_kwh`, etc. <br>**Governance:** Aggregation provides a layer of privacy compared to raw sensor data. Serves as the primary source of truth for building-level forecasting. Data lineage from raw sensor data must be maintained. |
| **External Weather Data** | **< 5 MB per day.** <br>Data is fetched for ~120 building locations (or geographical clusters). Volume depends on API response format and fetch frequency (hourly for history, more frequently for forecasts). | **Scheduled API Polling (Batch).** <br>Historical data is fetched via a **daily AWS Lambda job**. Future forecast data is fetched via a **Lambda job running several times a day** to ensure freshness. | **Semi-Structured (JSON from API).** <br>Contains `location` (lat/lon or city), `timestamp`, and various weather metrics (`temperature_c`, `humidity`, `cloud_cover`, `solar_irradiance_ghi_forecast`, etc.). <br>**Governance:** Dependent on a third-party provider (e.g., MeteoSwiss). Requires monitoring for API availability, changes, and rate limits. Caching strategies may be needed to manage costs and dependencies. |
| **Building & Apartment Topology** | **< 1 MB per day (on average).** <br>This is very low volume, consisting primarily of updates when new buildings/apartments are commissioned or structural changes are made. | **Low / On-Change.** <br>Synchronized via **daily or triggered batch jobs** from the main operational database or commissioning system. | **Highly Structured.** <br>Contains `building_id`, `apartment_id`, and potentially metadata like `building_size_sqm`, `num_rooms`, `building_age`, `insulation_type`. <br>**Governance:** The source of truth for the physical hierarchy. Data consistency is critical for correct aggregation and for potentially creating building "archetypes" for transfer learning (cold starts). |
| **System & User Feedback** | **< 1 MB per day.** <br>Generated when maintenance technicians label an anomaly alert (True/False Positive) or when residents report issues. | **Low / Event-Driven.** <br>Captured via the internal maintenance dashboard or resident support application. Ingested via API calls or **event-driven Lambda functions**. | **Highly Structured & High Value.** <br>Contains `alert_id`, `technician_id`, `feedback_label` (`True Positive`, `False Positive`, `Root Cause`), `timestamp`. <br>**Governance:** The primary source of labeled data for model evaluation and future supervised retraining. The quality and consistency of this feedback are critical for the ML lifecycle. |

-->

#### Data Flow

1.  **Ingestion:** Meter, Weather, and Topology data land in a raw S3 bucket via appropriate methods (batch, API fetch). A specific Lambda handles late-arriving meter data.
2.  **Processing:** A daily AWS Glue ETL job reads raw data, cleans it, performs transformations (e.g., daily aggregations, temp vs. setpoint diff), joins datasets, and engineers features required by the AD models. Processed features are stored in Parquet format in the Processed S3 zone. The Glue Data Catalog is updated.
3.  **Model Training:** A scheduled Step Functions workflow orchestrates training. It uses Glue to prepare a training dataset from the processed features, then triggers a SageMaker Training Job using the selected algorithms. The trained model is registered in the SageMaker Model Registry.
4.  **Batch Inference:** A daily Step Functions workflow prepares the latest features (Glue), then runs a SageMaker Batch Transform job using the latest registered model to score each apartment/room.
5.  **Results Storage:** Raw scores/flags are stored in S3. A subsequent Lambda/Glue job loads actionable *alerts* (where scores exceed thresholds) into a DynamoDB table or RDS instance for efficient dashboard querying.
6.  **Serving:** The internal dashboard queries the Alert Database via API Gateway/Lambda. Data Analysts can use Athena to query both processed features and raw data directly via the Glue Data Catalog.





#### Ingestion Workflow

The Ingestion pipeline processes raw data into a structured, partitioned format (Parquet) in the S3 Processed Zone and updates the Glue Data Catalog.

*	**Responsibility:** Separate pipeline/process
*   **Output:** Partitioned Parquet data with corresponding Glue Data Catalog tables.

<!--![](../_static/past_experiences/iot_anomaly/why_glue.png)-->
<p align="center">
	<img src="../_static/past_experiences/iot_anomaly/why_glue.png" width="80%"> 
</p>


#### Training Workflow

**Summary:** Triggered manually or by CI/CD/schedule -> Validates Schema -> Engineers Features (to Feature Store) -> Trains Model (using custom container) -> Evaluates Model -> Conditionally Registers Model (Pending Approval).

1.  **State:** `ValidateSchema`
    *   **Service:** SageMaker Processing Job (Spark)
    *   **Action:** Reads sample/metadata from `processed_meter_data` for the input date range. Compares schema against predefined definition. Fails workflow on critical mismatch.
2.  **State:** `FeatureEngineering`
    *   **Service:** SageMaker Processing Job (Spark) / AWS Glue ETL Job
    *   **Action:** Reads `processed_meter_data` and `processed_weather_data` for input date range. Calculates features (aggregations, lags, rolling windows, joins). Ingests features into SageMaker Feature Store (`ad-apartment-features` group).
3.  **State:** `ModelTraining`
    *   **Service:** SageMaker Training Job
    *   **Action:** Reads features for the training period from Feature Store Offline S3 location. Instantiates selected model strategy (e.g., `LR_LOF_Model`). Fits model components (Scaler, LR, LOF). Saves fitted artifacts as `model.joblib` within `model.tar.gz` to S3 output path.
4.  **State:** `ModelEvaluation`
    *   **Service:** SageMaker Processing Job (Python/Scikit-learn)
    *   **Action:** Loads `model.tar.gz` artifact. Reads evaluation features (hold-out set) from Feature Store Offline S3 location. Calculates performance metrics (e.g., backtesting precision/recall if labels available, score distributions). Estimates training throughput. Writes `evaluation_report.json` to S3.
5.  **State:** `CheckEvaluation` (Choice)
    *   **Service:** Step Functions Choice State
    *   **Action:** Compares key metrics from `evaluation_report.json` (requires parsing, possibly via an intermediate Lambda) against configured thresholds. Transitions to `RegisterModelLambda` or `EvaluationFailed`.
6.  **State:** `RegisterModelLambda`
    *   **Service:** AWS Lambda
    *   **Action:** Reads evaluation report URI and model artifact URI from state. Gathers metadata (git hash, params, metrics, data lineage). Creates a new Model Package version in the target SageMaker Model Package Group with status `PendingManualApproval`.
7.  **Terminal States:** `WorkflowSucceeded`, `EvaluationFailed`, `WorkflowFailed`.



#### Inference Workflow 

1.  **State:** `GetApprovedModelPackage`
    *   **Service:** AWS Lambda
    *   **Action:** Queries SageMaker Model Registry for the latest Model Package with `Approved` status in the configured group. Returns its ARN. Fails if none found.
2.  **State:** `CreateModelResource`
    *   **Service:** AWS Lambda
    *   **Action:** Creates a SageMaker `Model` resource using the approved Model Package ARN from the previous step and a unique name. This `Model` resource links the artifacts and container for Batch Transform. Returns the created `ModelName`.
3.  **State:** `FeatureEngineeringInference`
    *   **Service:** SageMaker Processing Job (Spark) / AWS Glue ETL Job
    *   **Action:** Reads processed data for the inference date + lookback period. Calculates features using the *exact same logic* as training feature engineering. Outputs features (e.g., CSV format without headers) required by the model to a unique S3 path for this execution.
4.  **State:** `BatchTransform`
    *   **Service:** SageMaker Batch Transform Job
    *   **Action:** Uses the `ModelName` created earlier. SageMaker launches the container, mounts the model artifact to `/opt/ml/model`, and provides input features from S3. The script loads the model, generates anomaly scores, and outputs scores (e.g., CSV format with identifiers and scores) to the specified S3 output path.
5.  **State:** `ProcessResults`
    *   **Service:** AWS Lambda
    *   **Action:** Triggered after Batch Transform. Reads raw score files from the S3 output path. Applies the configured alert threshold. Formats alert data (ApartmentID, Date, Score, Status='Unseen', etc.). Writes alerts to the DynamoDB Alert Table using `BatchWriteItem`.
6.  **Terminal States:** `WorkflowSucceeded`, `WorkflowFailed`.


### Model Development & Iteration

**Models for Anomaly Detection**

![](../_static/past_experiences/iot_anomaly/models1.png)
![](../_static/past_experiences/iot_anomaly/models2.png)


![](../_static/past_experiences/iot_anomaly/model_development.png)

<!--

**Context:** The goal is to detect anomalous heating energy consumption at the apartment level. The initial phase is entirely unsupervised due to a lack of labels. As a feedback loop is established with maintenance technicians, we begin to collect "ground truth" labels, allowing for more quantitative evaluation and the use of supervised models.

**Evaluation Metric:**
*   **Phase 1 (Unsupervised):** Qualitative assessment and **Anomaly Yield @ Top K**. This measures the percentage of the top `k` most anomalous flagged apartments per week that, upon manual inspection, are deemed "interesting" or "suspicious" enough for a follow-up. Let's assume `k=50`.
*   **Phase 2 (Supervised):** **Precision & Recall @ Top K**. Once we have labels, we can measure what percentage of the top `k` flagged anomalies are true positives (Precision) and what percentage of all known true positives we successfully identified in our top `k` flags (Recall). This is crucial because the maintenance team can only investigate a limited number (`k`) of alerts per day/week.


Here is a list of the experiments performed:

| Experiment / Iteration | Model/Technique | Features Used | Evaluation Metric & Hypothetical Result | Key Learnings & Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Unsupervised Baselines & Initial Models** |
| **1. Heuristic Baseline** | Simple Rule-Based | - `heating_kwh`<br>- `room_temp_c`<br>- `setpoint_temp_c` | **Qualitative:** High False Positive Rate. | **Rationale:** Establish a basic performance floor. The rule (`heating_kwh > X` while `room_temp_c < setpoint_temp_c - 2°C`) caught obvious issues (e.g., non-stop heating) but was extremely noisy, flagging normal start-up cycles and poorly insulated rooms. Confirmed the need for more context-aware models. |
| **2. Statistical Baseline** | STL Decomposition | - `heating_kwh` (univariate) | **Anomaly Yield @ Top 50:** ~15% | **Rationale:** Decompose the energy signal to see if anomalies reside in the residual. It successfully identified unusual spikes and drops by removing seasonality but failed to account for weather or user behavior, leading to many false alarms when the weather was unexpectedly cold or warm. Showed that a univariate approach is insufficient. |
| **3. Simple Multivariate ML** | Linear Regression (Residuals) | - `heating_kwh` (target)<br>- `temp_diff` (setpoint - room)<br>- `outdoor_temp`<br>- `hour_of_day` | **Anomaly Yield @ Top 50:** 25% <br>*(Improvement: +67%)* | **Rationale:** Replicate and validate the success of the prior thesis. This model was significantly better as it contextualized energy usage against key drivers. Anomalies were now "unexplained energy use" rather than just "high energy use". Still struggled with non-linear relationships. |
| **4. Unsupervised Density-Based** | Local Outlier Factor (LOF) | - `heating_kwh`<br>- `temp_diff`<br>- `outdoor_temp`<br>- `hour_of_day` | **Anomaly Yield @ Top 50:** 30% <br>*(Improvement: +20%)* | **Rationale:** Test a non-parametric, density-based approach. LOF proved effective at finding apartments that behaved unusually compared to their *own* past behavior, catching subtle, persistent issues that regression residuals missed. It became a strong candidate model. |
| **5. Unsupervised Ensemble** | Isolation Forest | - `heating_kwh`<br>- `temp_diff`<br>- `outdoor_temp`<br>- `hour_of_day`<br>- `day_of_week` | **Anomaly Yield @ Top 50:** 32% <br>*(Improvement: +7%)* | **Rationale:** Test a modern, scalable unsupervised method. Isolation Forest performed slightly better than LOF, was faster to train, and handled additional features like `day_of_week` well. It showed strong potential for identifying globally rare anomalies across all apartments. |
| **6. Forecasting-Based Anomaly Detection** | Prophet | - `heating_kwh` (target)<br>- `outdoor_temp` (regressor)<br>- Holidays/Weekends | **Anomaly Yield @ Top 50:** 28% | **Rationale:** Use a state-of-the-art forecasting model to see if "what the model couldn't predict" is a good anomaly signal. Prophet was excellent at modeling seasonality and holidays but its uncertainty intervals (`yhat_upper`) were often too wide, missing more subtle anomalies that LOF or Isolation Forest could find. |
| **Phase 2: Introduction of Labeled Data & Supervised Models** |
| **7. First Supervised Model** | XGBoost | All features from Exp #5 +<br>- `is_weekend` | **(Labels Collected: ~500 True Positives)**<br>**Precision@50:** 55%<br>**Recall@50:** 45% | **Rationale:** With a small but valuable set of labels from the feedback loop, we can train a supervised classifier. XGBoost immediately outperformed the unsupervised methods by learning the specific patterns of labeled failures. The model was good but limited by the small label set. |
| **8. Advanced Feature Engineering** | XGBoost | All previous features +<br>- **Lag features** (e.g., energy 24h ago)<br>- **Rolling averages** (e.g., 3h avg temp_diff)<br>- **Interaction terms** (e.g., outdoor_temp * hour_of_day) | **Precision@50:** 70% <br>*(Improvement: +27%)*<br>**Recall@50:** 58% <br>*(Improvement: +29%)* | **Rationale:** Provide the model with richer temporal context. Lag and rolling window features gave the model a sense of recent history, dramatically improving its ability to distinguish between normal fluctuations and developing faults. This was the single biggest performance jump. |
| **9. Hyperparameter Optimization** | XGBoost (Tuned) | Same as Exp #8 | **Precision@50:** 75% <br>*(Improvement: +7%)*<br>**Recall@50:** 62% <br>*(Improvement: +7%)* | **Rationale:** Fine-tune the champion model (XGBoost with advanced features). Using SageMaker's Automatic Model Tuning (Bayesian optimization) provided a solid incremental gain by optimizing parameters like `max_depth`, `learning_rate`, and `n_estimators`. |
| **Phase 3: Exploration of Advanced Models** |
| **10. Deep Learning Exploration** | LSTM Autoencoder | Sequence of features from Exp #8 | **(Compared on reconstruction error)**<br>**Precision@50:** 72%<br>**Recall@50:** 65% | **Rationale:** Investigate if DL can capture complex temporal sequences that XGBoost might miss. The LSTM Autoencoder showed slightly better recall (found a few unique anomalies) but lower precision and was significantly more complex to train and tune. It did not justify replacing XGBoost as the champion model *at this stage* but remains a candidate for future improvements as more data and complex faults are recorded. |


**Summary of Model Development Path**

The experiments followed a logical progression from simple, interpretable baselines to more complex, data-driven models. The key takeaways from the development process were:

1.  **Context is King:** Simple univariate methods were insufficient. Incorporating external factors like outdoor temperature and user setpoints (multivariate approach) was the first major breakthrough.
2.  **Unsupervised Methods are Effective Starters:** In the absence of labels, unsupervised models like **Isolation Forest** and **LOF** provided significant value and a strong foundation for the initial alert system.
3.  **The Feedback Loop is Transformative:** The introduction of even a small amount of labeled data from maintenance technicians allowed the use of supervised models (**XGBoost**), which immediately surpassed unsupervised performance.
4.  **Feature Engineering Drives Performance:** The most significant leap in supervised model performance came from **advanced feature engineering** (lags and rolling windows), which provided the model with critical temporal context.
5.  **Start Simple, Optimize Later:** A well-featured XGBoost model, properly tuned, provided an excellent balance of performance, training speed, and scalability, outperforming a more complex LSTM Autoencoder for this specific problem at this stage.

---
-->


### Challenges and learnings

![](../_static/past_experiences/iot_anomaly/challenges1.png)

![](../_static/past_experiences/iot_anomaly/challenges2.png)

![](../_static/past_experiences/iot_anomaly/challenges3.png)


<!--

---

### Challenge 1: The Silent Drift - Training-Serving Skew from a Data Pipeline Bug

**Chronological Events:**

1.  **Initial Success (Weeks 1-4):** The supervised XGBoost model (Exp #8) is deployed. The daily inference pipeline runs, and the initial feedback from the maintenance team is positive. They confirm several alerts as true positives related to faulty valves and sensor misconfigurations. Precision metrics, calculated from their feedback, are close to the offline evaluation estimates (~70%).

2.  **The Slow Decline (Weeks 5-8):** Over the next month, the MLOps team notices a gradual decline in the feedback quality. The proportion of alerts marked as "False Positive" by technicians slowly increases. The marketing team, which has started promoting the "Proactive Maintenance" feature, reports a slight uptick in customer complaints about heating issues that were *not* flagged by the system, indicating a drop in recall.

3.  **Initial Investigation (Week 9):** The ML team suspects **concept drift**. The hypothesis is that as winter deepens, "normal" heating patterns are changing, and the model, trained on early winter data, is becoming stale. The team triggers a manual retraining of the model on the most recent data. After deploying the new model, performance metrics show a minor improvement for a few days before declining again. This makes simple model staleness less likely to be the root cause.

4.  **Lack of Observability (Week 10):** The team decides to dig deeper. They check the CloudWatch logs for the inference Step Function, but the logs only show that all jobs (Feature Eng, Batch Transform, Process Results) completed successfully. They look at the raw anomaly scores being produced, but without a clear baseline, it's hard to tell if the *distribution* of scores is wrong. **It becomes painfully evident that the existing observability setup is insufficient.** They can see pipeline *execution* status but have no insight into the *quality of the data* flowing through it.

5.  **Implementing Data Monitoring (Week 11):** As a direct response, the MLOps team implements a data monitoring step using **Deequ on a SageMaker Processing Job**. They create a monitoring job that runs daily on the output of the *inference* feature engineering step and the *training* feature engineering step (using a stored historical profile). The job calculates and compares statistical properties (mean, std dev, completeness, distribution distance like KL Divergence) for key features like `outdoor_temp`, `temp_diff`, and `heating_kwh`.

6.  **The "Aha!" Moment (Week 11, Day 3):** The first run of the new monitoring system raises a high-severity drift alert. The feature `outdoor_temp` in the inference data has a mean of `null` and 100% missing values. **This is the smoking gun.** The team traces the issue upstream.
    *   The Lambda function that ingests historical weather data from the external API works fine.
    *   However, the *Ingestion Glue Job* that processes raw IoT data and joins it with the raw weather data has a subtle bug. A recent change to gracefully handle missing weather data for a single building (by nullifying the column for that row) was implemented with a bug that caused it to nullify the `outdoor_temp` column for the *entire batch* if even one building's weather was missing for that day.

7.  **The Silent Failure Cascade:** The downstream `feature_engineering_inference.py` script saw the `null` `outdoor_temp` column and, as per its `fillna(0)` logic, replaced all nulls with `0.0`. The XGBoost model, trained on data where `outdoor_temp` was a valid and highly important feature, received an input where this feature was always zero. It continued to produce predictions, but they were effectively based on other, less predictive features, leading to a silent, gradual degradation of performance. **This was a classic, hard-to-debug training-serving skew caused by a data pipeline bug.**

8.  **Resolution & Aftermath (Week 12):** The Glue ETL bug is fixed and patched. The data monitoring job is made a permanent, blocking step in the CI/CD deployment validation. The incident triggered significant stress as the marketing campaign was already live. The team had to present a post-mortem to stakeholders, explaining the technical root cause and emphasizing that this was a failure in data observability, not a failure of the ML model's concept. They used this to justify allocating more resources to building out a comprehensive MLOps monitoring suite, including feature-level drift detection.

**Lessons & Retrospective:**

*   **"What would you change?":** "I would implement data quality and drift monitoring as a **Day 1 requirement**, not an afterthought. We should have had statistical checks on critical features in both the training and inference pipelines from the very beginning. A bug in an upstream data pipeline should never have been allowed to silently degrade the model's performance for weeks."
*   **"Production bugs you regret?":** "The `fillna(0)` in the feature engineering script was a dangerous shortcut. While it prevented the pipeline from crashing, it masked the upstream data integrity problem. A better approach would have been to have a stricter contract: the feature engineering job should have failed loudly if a critical input feature like `outdoor_temp` had an unexpectedly high null rate (e.g., >5%). This 'fail fast' philosophy would have alerted us to the problem immediately."

---

### Challenge 2: The "Normal Anomaly" - Unsupervised Model Evaluation and Alert Fatigue

**Chronological Events:**

1.  **Initial Launch (Unsupervised):** The system first goes live with the unsupervised **Isolation Forest** model (Exp #5). The model's `contamination` parameter is set to the default of "auto" or a heuristic guess (e.g., 1%). The daily inference pipeline starts flagging the top 1% of apartments with the highest anomaly scores.

2.  **Alert Overload (Weeks 1-3):** The maintenance team is immediately flooded with alerts. Their dashboard lights up with dozens of new potential issues every day. They investigate the top few and find that most are not equipment failures. Instead, the alerts correspond to:
    *   **Vacation Behavior:** An apartment that was consistently using energy suddenly uses none for a week. The model flags this significant deviation as an anomaly. When the residents return and turn the heating on, that's flagged too.
    *   **Unusual Schedules:** A resident who starts working night shifts and changes their heating schedule is flagged.
    *   **New Construction Oddities:** A newly commissioned building with very few residents shows erratic, low-consumption patterns that the model, trained on established buildings, flags as anomalous.

3.  **Loss of Trust & Alert Fatigue (Weeks 4-6):** The maintenance team quickly becomes disillusioned. They declare the system "too noisy" and start ignoring the alerts, reverting to their old reactive process. The project is at risk of being shelved due to a lack of operational adoption. The core problem is that the model is correctly identifying *statistical* anomalies, but these are not correlating with *operationally significant* anomalies (i.e., equipment faults).

4.  **Stakeholder Pressure (Week 7):** Management, having invested in the project, wants to know why it isn't working. The ML team has to explain that the unsupervised model is functioning as designed but lacks the business context to differentiate between "a resident on vacation" and "a broken heating valve".

5.  **Reframing the Problem: The Human-in-the-Loop (Week 8):** The team realizes they cannot solve this with a purely unsupervised model. They need human intelligence. They propose a **Phase 2** focused on creating a **data flywheel**.
    *   **UI/UX Overhaul:** They work with the maintenance team to redesign the alert dashboard. Instead of a raw list, alerts are now presented with more context (plots of energy vs. temperature, recent history).
    *   **Feedback First:** Crucially, they add simple feedback buttons: "True Positive (Investigate)", "False Positive (Known Cause)", with a dropdown for common causes like "Resident Away", "Guest Stay", "Manual Override".
    *   **Active Learning:** They change the model's role from "detector" to "screener". The model's output is now used to *prioritize* which apartments a technician should review, rather than being a definitive alert.

6.  **Iterative Threshold Tuning (Weeks 9-16):** With the feedback mechanism in place, the team starts collecting labels. They now have the data to tune the anomaly score threshold. Using the initial labeled data, they perform an analysis to find a threshold that maximizes precision (minimizes false positives for the techs) while maintaining a reasonable recall. They discover the optimal threshold is much higher than the default top 1%. They also implement a rule to suppress alerts for apartments with zero consumption for more than 48 hours (a heuristic for "vacation mode").

7.  **Transition to Supervised Model (Months 5-6):** Once several hundred positive and negative labels are collected, the team transitions to the **XGBoost supervised model** (Exp #7). This model is explicitly trained to find the patterns associated with *confirmed equipment faults*, not just any statistical deviation. This is the turning point. The new model's alerts are far more relevant, and the maintenance team's trust in the system is slowly rebuilt.

**Lessons & Retrospective:**

*   **"What were the challenges?":** "Our biggest initial challenge was the disconnect between a statistical anomaly and a business-relevant anomaly. Our unsupervised model was technically correct but operationally useless. This led to severe alert fatigue and almost caused the project to fail due to a lack of user adoption. The root cause was underestimating the importance of the human-in-the-loop and designing the initial system as a fully automated detector instead of a decision-support tool."
*   **"How would you approach it differently?":** "I would introduce the human-in-the-loop and the feedback mechanism from Day 1, even with the first unsupervised model. I would frame the project to stakeholders not as an 'AI that finds failures' but as a 'smart assistant that helps our best technicians find failures faster'. Managing expectations and co-designing the workflow with the end-users (the maintenance team) from the start is non-negotiable."

---

### Challenge 3: The Multi-Building Dilemma - Model Generalization vs. Specificity

**Chronological Events:**

1.  **Initial Model Strategy:** The team starts by training a **single, global XGBoost model** on data from all apartments across all buildings. The `building_id` is included as a categorical feature (one-hot encoded). This seems efficient and allows the model to learn from the largest possible dataset.

2.  **Performance Discrepancy (First Month in Production):** After deployment, the team monitors performance metrics (Precision/Recall from feedback) broken down by building. They discover a significant disparity:
    *   The model performs well (e.g., 75% precision) for the largest, most common type of building in the dataset (e.g., "Standard 10-story, 2010s construction").
    *   Performance is poor (e.g., <40% precision) for a few specific buildings: one is a new, highly energy-efficient "Passive House" building, and another is an older, poorly insulated building from the 1980s.
    *   The global model is biased towards the majority class (the standard buildings) and fails to capture the unique thermal dynamics of the outlier buildings. Its feature importances show that `building_id` is highly ranked, but it's not enough to correct for the different physical behaviors.

3.  **Debugging the Bias (Second Month):** The team uses **SHAP (SHapley Additive exPlanations)** to analyze the model's predictions for the poorly performing buildings.
    *   For the "Passive House", they find the model consistently overestimates the "normal" energy consumption, causing it to miss subtle but critical anomalies where the heat recovery ventilation (HRV) system was underperforming. The model, trained on less efficient buildings, couldn't comprehend such low energy usage being normal.
    *   For the older building, the model's concept of a "normal" relationship between outdoor temperature and energy use was completely wrong. It constantly flagged apartments as anomalous during cold snaps because their (normal for that building) high energy consumption looked extreme compared to the average.

4.  **Exploring Solutions (Third Month):** The team realizes a single global model is not a viable solution. They debate several strategies:
    *   **Option A: One Model Per Building:** Train a separate XGBoost model for each of the 120 buildings. This would be perfectly tailored but creates a massive MLOps headache – managing, deploying, and monitoring 120 individual models. It also exacerbates the cold-start problem for new buildings.
    *   **Option B: One Model Per Building "Archetype":** Manually classify buildings into archetypes based on metadata (age, insulation type, size, heating system). Train one model per archetype. This is a good compromise but relies on having accurate metadata and someone to define the archetypes.
    *   **Option C: Feature Engineering Hack:** Keep the global model but add more features that describe the building's characteristics (e.g., `building_age`, `insulation_R_value`, `num_apartments`). Hope the model learns the interactions. This is complex and might not be enough.
    *   **Option D: A More Sophisticated Model:** Re-evaluate models that can handle this structure more gracefully. DeepAR, for example, can learn a global model but uses static features (like `building_archetype`) to condition its predictions for specific time series.

5.  **The Chosen Solution: A Hybrid Approach (Fourth Month):**
    *   The team decides on a hybrid strategy as the most pragmatic solution:
        1.  **Segment Buildings:** They use a simple clustering on building metadata (age, size) to create 3 distinct archetypes: "Modern High-Density", "Older Low-Density", and "High-Efficiency".
        2.  **Train Models per Archetype:** They train **three separate XGBoost models**, one for each archetype. This provides specificity without creating an unmanageable number of models.
        3.  **Update MLOps:** The training pipeline is parameterized to accept an `archetype` and train a model using only data from buildings in that group. The inference pipeline is updated to first look up a building's archetype, then select and load the corresponding model from the Model Registry to score its apartments. The Model Registry is organized to track models per archetype.

6.  **Results:** After deploying the three archetype-specific models, performance becomes much more uniform across all buildings. Precision for the previously problematic "Passive House" and "Older" buildings jumps to over 70%. This approach provides a scalable and effective balance between a single global model and one model per building.

**Lessons & Retrospective:**

*   **"What were some of the challenges?":** "A major challenge was dealing with heterogeneity in our building stock. Our initial 'one size fits all' global model was a classic example of a model that worked well on average but failed significantly for important minority segments. It taught us that fairness and bias in ML aren't just about people; they can apply to physical assets too. Debugging this required going beyond aggregate metrics and using tools like SHAP to understand *why* the model was failing for specific buildings."
*   **"What lessons will you take forward?":** "I learned to be extremely skeptical of global models unless the underlying entities are truly homogeneous or the model is explicitly designed to handle heterogeneity (like DeepAR with static features). Always segment your evaluation metrics across meaningful business categories—in our case, building types. And finally, architect your MLOps pipelines (training and inference) to be flexible enough to support multiple models from the start. Our inference pipeline needed a significant refactor to dynamically select a model based on the building being processed, something we should have anticipated."



-->




### Configuration Management

*   **Primary Method:** Version-controlled configuration files (e.g., `config/ad_config.yaml`) stored in Git. These define non-sensitive parameters like hyperparameters, feature lists, thresholds, instance types.
*   **Distribution:** Config files are uploaded to a designated S3 location (e.g., `s3://[scripts-bucket]/config/`) by the CI/CD pipeline.
*   **Loading:** Scripts (Glue, SM Processing, Lambda) receive the S3 URI of the relevant config file via an environment variable (`CONFIG_S3_URI`) or argument. They use `boto3` to download and parse the file at runtime. Libraries like `PyYAML` are needed.
*   **Runtime Overrides:** Step Function inputs or job arguments can override specific parameters from the config file for execution-specific needs (e.g., `inference_date`, experimental hyperparameters).
*   **Secrets:** Sensitive information MUST be stored in AWS Secrets Manager or SSM Parameter Store (SecureString) and fetched by the application code using its IAM role. Do NOT store secrets in Git config files.
*   **Environment Variables:** Used primarily for passing S3 URIs (config file, data paths), resource names (table names, feature group), and potentially secrets fetched from secure stores.



### Infrastructure as Code (Terraform)

*   **Tool:** Terraform manages all AWS infrastructure.
*   **State Management:** Configure a remote backend (e.g., S3 with DynamoDB locking) for Terraform state files.
*   **Stacks:** Infrastructure is divided into logical stacks:
    *   `ingestion`: S3 buckets (Raw, Processed), Glue DB/Tables, Ingestion Glue Job, associated IAM roles.
    *   `training`: S3 buckets (Scripts, Artifacts, Reports - potentially reused/shared), ECR Repo, Feature Group, Model Package Group, specific IAM roles, Lambdas (Register Model), Step Function (`ADTrainingWorkflow`).
    *   `inference`: DynamoDB Table (Alerts), specific IAM roles, Lambdas (Get Model, Create Model, Process Results), Step Function (`ADInferenceWorkflow`), EventBridge Scheduler.
*   **Variables & Outputs:** Stacks use input variables (defined in `variables.tf`) for configuration and expose key resource identifiers via outputs (defined in `outputs.tf`). Outputs from one stack (e.g., `processed_bucket_name` from ingestion) are passed as inputs to dependent stacks.


### CI/CD Pipeline (Bitbucket)

*   **Tool:** Bitbucket Pipelines (`bitbucket-pipelines.yml`).
*   **CI Workflow (Branches/PRs):**
    1.  Lint Python code (`flake8`).
    2.  Run Unit Tests (`pytest tests/unit/`).
    3.  Build Training/Inference Docker container.
    4.  Push container to AWS ECR (tagged with commit hash).
    5.  Validate Terraform code (`terraform validate`, `fmt -check`) for all stacks.
*   **Training CD Workflow (`custom:deploy-and-test-ad-training`):**
    1.  (Manual Trigger Recommended)
    2.  Run CI steps (Lint, Unit Test, Build/Push).
    3.  Apply `training_ad` Terraform stack (using commit-specific image URI).
    4.  Prepare integration test data (trigger ingestion or verify pre-staged).
    5.  Run Training Integration Tests (`pytest tests/integration/test_training_workflow.py`).
*   **Inference CD Workflow (`custom:deploy-and-test-ad-inference`):**
    1.  (Manual Trigger Recommended)
    2.  (Optional) Run CI checks.
    3.  Apply `inference_ad` Terraform stack.
    4.  Prepare integration test data (verify processed data, ensure approved model exists).
    5.  Run Inference Integration Tests (`pytest tests/integration/test_inference_workflow.py`).
*   **Variables:** Uses Bitbucket Repository Variables (CI) and Deployment Variables (CD) for AWS credentials and environment-specific parameters.


### Cost Analysis

<!--
![](../_static/past_experiences/iot_anomaly/cost.png)
-->

This is a high-level estimate based on the architecture we designed and the data volume assumptions made previously. Actual costs will vary.

**Assumptions:**
*   **Environment:** AWS `eu-central-1` (Frankfurt) region.
*   **Apartments:** 3,000.
*   **Daily Processed Data:** ~300 MB ingested into the Processed S3 Zone.
*   **Total Monthly Processed Data:** 300 MB/day * 30 days = **~9 GB**.
*   **Model Training Frequency:** 4 times per month (weekly).
*   **Batch Inference Frequency:** 30 times per month (daily).

| Pipeline Component | AWS Service(s) | Detailed Cost Calculation & Rationale | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Data Ingestion & Processing** | **AWS Glue**<br>**S3** | **AWS Glue ETL:** Priced per DPU-hour. This covers the initial job to process raw IoT data into the `processed_meter_data` S3 zone. Assuming a daily run of a small-to-medium job.<br>- 1 job/day * 30 days * 0.25 hours/job * 5 DPUs * ~$0.44/DPU-hr = **~$16.50**<br><br>**S3 (PUT Requests):** Cost for ingestion jobs writing to the Processed bucket. Assuming ~100k PUT requests per day for all apartments.<br>- 100k req/day * 30 days * ~$0.005/1k req = **~$15.00**<br>The cost is primarily driven by the daily processing compute and the volume of S3 writes. | **$30 - $50** |
| **Feature Engineering** | **SageMaker Processing**<br>**SageMaker Feature Store** | **SageMaker Processing Jobs:** Priced per instance-second. This covers the feature engineering steps in *both* the weekly training pipeline and the daily inference pipeline.<br>- Training: 4 runs/month * 1.5 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$0.66**<br>- Inference: 30 runs/month * 0.5 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$1.65**<br><br>**SageMaker Feature Store:** Priced per GB-month (Offline), plus Write/Read units.<br>- Offline Store (S3): Covered under Storage cost. Assume ~50 GB of feature data.<br>- Write/Read Units: For batch-only workflows, this cost is typically low. Assuming minimal average usage. = **~$1.00** (buffer) | **$3 - $8** |
| **Model Training** | **SageMaker Training**<br>**Step Functions** | **SageMaker Training Jobs:** Priced per instance-second. Assuming weekly retraining on a standard instance.<br>- 4 runs/month * 2.0 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$0.88**<br><br>**Step Functions:** Priced per state transition. The training workflow is complex but runs infrequently.<br>- ~10 transitions/run * 4 runs/month = 40 transitions. This is well within the free tier. = **~$0.00** | **$1 - $3** |
| **Model Inference** | **SageMaker Batch Transform**<br>**Step Functions** | **SageMaker Batch Transform:** Priced per instance-second. This is the daily job that scores all apartments.<br>- 30 runs/month * 1.0 hour/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$3.30**<br><br>**Step Functions:** The inference workflow runs daily.<br>- ~8 transitions/run * 30 runs/month = 240 transitions. Also well within the free tier. = **~$0.00** | **$3 - $5** |
| **Alerting & Orchestration** | **AWS Lambda**<br>**DynamoDB** | **Lambda:** Priced per request and GB-second. Covers several functions in the workflows (Register Model, Get Approved Model, Process Results, etc.).<br>- ~40 total invocations/month * avg 10 sec duration * 256MB memory. All usage is well within the Lambda free tier. = **~$0.00**<br><br>**DynamoDB:** Priced per GB-month storage and per million RCU/WCU. Assuming Pay-Per-Request (On-Demand) mode.<br>- Storage: Assume ~1 GB of alert data stored. = **~$0.25**<br>- Write/Read Units: Assume ~5k alerts generated/month (writes) and ~10k dashboard queries/month (reads). On-Demand cost is negligible at this scale. = **~$0.10** | **$1 - $2** |
| **Storage & Logging** | **S3**<br>**ECR**<br>**CloudWatch** | **S3:** Priced per GB-month. This is the largest continuous cost. Assumes total storage for Raw, Processed, Features, Artifacts, and Logs.<br>- Raw: 200 GB, Processed: 150 GB, Features: 50 GB, Artifacts/Other: 5 GB = ~405 GB<br>- 405 GB * ~$0.023/GB-month = **~$9.32**<br>- Add ~$5 for GET/LIST requests from various jobs.<br><br>**ECR:** Priced per GB-month. For storing the custom training/inference container images.<br>- 10 GB * ~$0.10/GB-month = **~$1.00**<br><br>**CloudWatch:** Logs from all jobs and Lambdas. Assuming usage stays within or slightly above the free tier.<br>- Assume ~10 GB log ingestion * ~$0.50/GB = **~$5.00** | **$20 - $30** |
| **Total Estimated Monthly Cost** | **-** | **-** | **$60 - $100** |

This detailed breakdown reveals that the operational cost is dominated by **Data Ingestion/Processing (Glue & S3 PUTs)** and **persistent Storage (S3 & ECR)**. The actual ML compute costs for training and inference are relatively small due to their batch, on-demand nature. This highlights the efficiency of a serverless, batch-oriented architecture for this use case, as there are no 24/7 clusters or endpoints to maintain. Optimizing S3 storage with lifecycle policies will be the most effective long-term cost management strategy.


**Cost Optimisations**

- S3 Storage Dominates: The largest cost component by far is S3 storage. Implementing S3 Lifecycle policies to move older raw/processed data or feature versions to cheaper tiers (like Intelligent-Tiering or Glacier) is crucial for long-term cost management.
- Compute is Relatively Low: The actual compute cost for running the training jobs weekly is quite low with these assumptions.
- Assumptions Matter: If your training jobs run much longer, use more instances, or run more frequently, the SageMaker costs will increase proportionally. If your data volume is significantly larger, S3 costs increase.
- Spot Instances: For SageMaker Processing and Training Jobs, using Spot Instances can potentially save up to 90% on compute costs, but requires designing the jobs to handle potential interruptions (checkpointing for Training, stateless design for Processing). This could significantly reduce the ~$1.45 compute estimate.
- Instance Selection: Choosing the right instance type (e.g., ml.t3.medium for less demanding tasks can optimize compute cost.


### Deployment & Execution

**Initial Deployment:**

1.  Configure AWS credentials locally/in CI runner.
2.  Configure Bitbucket variables (Repository & Deployment).
3.  Create `terraform.tfvars` files for each stack (`ingestion`, `training`, `inference`) providing required inputs (unique suffixes, potentially outputs from previous stacks).
4.  Deploy Terraform stacks **in order**: `ingestion` -> `training` -> `inference`. Run `init`, `plan`, `apply` for each.
5.  Build and push the initial Docker training/inference container to the ECR repository created by `training`. Ensure the `training_image_uri` variable used by Terraform deployments points to this image.
6.  Place initial configuration files (`config.yaml`) in the designated S3 config location.
7.  Prepare initial raw data and run the Ingestion Glue job once to populate the processed data zone.

**Running Training:**

*   Trigger the `ADTrainingWorkflow` Step Function manually or via its schedule.
*   Provide input JSON specifying date range, parameters, code version (via image URI/git hash).

**Running Inference:**

*   The `ADInferenceWorkflow` Step Function runs automatically based on the EventBridge schedule.
*   Ensure an *Approved* model package exists in the Model Registry for the workflow to succeed.

**Model Approval:**

*   After a successful *Training* run, navigate to SageMaker -> Model Registry -> Model Package Groups -> [Your AD Group].
*   Select the latest version (`PendingManualApproval`).
*   Review Description, Metadata, Evaluation Metrics.
*   If satisfactory, update status to `Approved`.


### Monitoring & Alerting

*   **CloudWatch Logs:** Central location for logs from Lambda, Glue, SageMaker Jobs. Implement structured logging within Python scripts for easier parsing.
*   **CloudWatch Metrics:** Monitor key metrics:
    *   Step Functions: `ExecutionsFailed`, `ExecutionsTimedOut`.
    *   Lambda: `Errors`, `Throttles`, `Duration`.
    *   SageMaker Jobs: `CPUUtilization`, `MemoryUtilization` (if needed), Job Status (via Logs/Events).
    *   DynamoDB: `ThrottledWriteRequests`, `ThrottledReadRequests`.
*   **CloudWatch Alarms:** **REQUIRED:** Set alarms on critical failure metrics (SFN `ExecutionsFailed`, Lambda `Errors`). Configure SNS topics for notifications.
*   **SageMaker Model Monitor (Future):** Implement data quality and model quality monitoring to detect drift over time.
*   **Application-Level Monitoring:** Track the number of alerts generated daily, processing times, etc.


### Troubleshooting Guide

1.  **Workflow Failure (Step Functions):** Check the Step Functions execution history in the AWS Console. Identify the failed state and examine its input, output, and error message.
2.  **Job Failures (Glue/SageMaker):** Go to the corresponding CloudWatch Log Group for the failed job (links often available in Step Function state details). Look for Python exceptions or service errors. Check job metrics for resource exhaustion.
3.  **Lambda Failures:** Check the Lambda function's CloudWatch Log Group. Look for errors, timeouts, or permission issues. Verify environment variables and input payload.
4.  **IAM Permissions:** If errors indicate access denied, carefully review the IAM roles and policies associated with the failing service (SFN, Lambda, SageMaker Job roles) ensuring necessary permissions to other services (S3, SageMaker API, DynamoDB, ECR, etc.).
5.  **Data Issues:**
    *   **Schema Mismatch:** Check `ValidateSchema` logs. Verify Glue Catalog definition matches actual data.
    *   **Missing Features:** Ensure feature engineering script runs correctly and produces all columns needed by the model. Check Feature Store ingestion if used.
    *   **Empty Data:** Check upstream processes; ensure ingestion ran and data exists for the target dates.
6.  **Configuration Errors:** Verify config files in S3 are correct and accessible. Check environment variables passed to jobs/lambdas.
7.  **Model Artifact Issues:** Ensure the `model.tar.gz` exists, is not corrupted, and contains all necessary files (`model.joblib`, etc.). Verify the `inference.py` script loads it correctly.
8.  **Batch Transform Failures:** Check Batch Transform job logs in CloudWatch. Common issues include container errors (script failures, dependency issues), data format errors, or IAM permission problems for the model's execution role.



### Security Considerations

*   **IAM Least Privilege:** Regularly review and tighten IAM roles assigned to Step Functions, Lambdas, Glue, and SageMaker jobs. Grant only necessary permissions.
*   **Data Encryption:**
    *   **At Rest:** Enable server-side encryption (SSE-S3, SSE-KMS) on all S3 buckets. Enable encryption for DynamoDB tables. Ensure EBS volumes attached to SageMaker jobs are encrypted.
    *   **In Transit:** AWS services use TLS for communication by default. Ensure any custom external connections also use TLS.
*   **Secret Management:** Use AWS Secrets Manager or SSM Parameter Store (SecureString) for any sensitive credentials or API keys.
*   **Network Security:** For enhanced security, consider deploying resources within a VPC using VPC Endpoints for AWS service access, minimizing exposure to the public internet. Configure Security Groups appropriately.
*   **Container Security:** Regularly scan the custom Docker container image for vulnerabilities using ECR Image Scanning or third-party tools. Keep base images and libraries updated.
*   **Input Validation:** Sanitize and validate inputs to Lambda functions and Step Function executions, especially if triggered externally.
*   **Access Control:** Restrict access to the SageMaker Model Registry and approval workflows to authorized personnel.




### Roadmap & Future Enhancements

*   Implement SageMaker Model Monitor for data quality and model drift detection.
*   Set up automated retraining triggers based on schedule or drift detection.
*   Explore more sophisticated anomaly detection algorithms (e.g., Autoencoders, Isolation Forests) via the Strategy Pattern.
*   Implement A/B testing for different model versions using SageMaker Inference Pipelines.
*   Enhance the Internal Dashboard for better alert visualization and diagnostics.
*   Integrate alerts directly with maintenance ticketing systems.


### Appendices

#### Data Schemas

This appendix provides the formal schema definitions for the primary data entities used across the Anomaly Detection and Energy Demand Forecasting workflows.

#### 1. Raw Meter Data

This represents the logical structure of data as it arrives from the central database into the S3 Raw Zone for processing. It's often in a semi-structured format like JSON Lines.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `timestamp_str` | String | ISO 8601 formatted timestamp (e.g., "2024-10-27T10:30:05Z") of when the readings were recorded by the tablet. |
| `building_id` | String | Unique identifier for the building (e.g., "bldg_A123"). |
| `apartment_id` | String | Unique identifier for the apartment (e.g., "apt_404"). |
| `readings` | Array[Object] | An array of sensor reading objects from the apartment. |
| `readings.sensor_type` | String | The type of measurement (e.g., `heating_energy_kwh`, `room_temp_c`). |
| `readings.value` | Double/Int | The numerical value of the sensor reading. |
| `readings.room_name` | String | (Optional) The specific room for the reading, if applicable (e.g., "living_room"). |

**Example (JSON Lines):**
```json
{"timestamp_str": "2024-10-27T10:30:00Z", "building_id": "bldg_A123", "apartment_id": "apt_404", "readings": [{"sensor_type": "heating_energy_kwh", "value": 15432.7}, {"sensor_type": "hot_water_litres", "value": 89541.2}, {"sensor_type": "room_temp_c", "room_name": "living_room", "value": 21.5}, {"sensor_type": "setpoint_temp_c", "room_name": "living_room", "value": 22.0}]}
```

---

#### 2. Processed Meter Data (for Anomaly Detection)

This is the output of the initial Ingestion Glue ETL job, stored in the S3 Processed Zone. It's a flattened, structured table optimized for analytical queries and as the source for feature engineering.

**Format:** Apache Parquet
**Partitioned by:** `year`, `month`, `day`

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `apartment_id` | String | Unique identifier for the apartment. |
| `building_id` | String | Unique identifier for the building. |
| `event_ts` | Timestamp | The timestamp of the reading, cast to a proper timestamp type. |
| `heating_energy_kwh` | Double | The cumulative heating energy consumption in kilowatt-hours. |
| `hot_water_litres` | Double | The cumulative hot water consumption in litres. |
| `room_temp_c` | Double | The measured temperature in Celsius for a specific room (or average). |
| `setpoint_temp_c` | Double | The user-defined target temperature in Celsius for a specific room. |
| `outdoor_temp_c` | Double | The outdoor temperature at the time of the reading, joined from weather data. |
| **year** | Integer | **Partition Key:** Year derived from `event_ts`. |
| **month** | Integer | **Partition Key:** Month derived from `event_ts`. |
| **day** | Integer | **Partition Key:** Day derived from `event_ts`. |

---

#### 3. Weather Data

**3.1 Raw Weather Forecast Data (from API)**

This is the raw JSON structure ingested from the external weather forecast API into the S3 Raw Zone.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `latitude` | Double | Latitude of the forecast location. |
| `longitude` | Double | Longitude of the forecast location. |
| `generationtime_ms`| Double | Time taken by the API to generate the forecast. |
| `utc_offset_seconds`| Integer | UTC offset for the location. |
| `hourly` | Object | An object containing arrays of hourly forecast values. |
| `hourly.time` | Array[String] | Array of ISO 8601 timestamps for the forecast horizon. |
| `hourly.temperature_2m`| Array[Double] | Array of corresponding forecasted temperatures (°C). |
| `hourly.cloudcover` | Array[Integer] | Array of corresponding forecasted cloud cover (%). |
| `hourly.shortwave_radiation` | Array[Double]| Array of corresponding forecasted solar irradiance (W/m²). |

**3.2 Processed Weather Data (Joined in `processed_edf_data`)**

This represents the clean, hourly weather data after being processed and joined to the consumption data.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `building_id` | String | Unique identifier for the building the weather corresponds to. |
| `timestamp_hour` | Timestamp | The specific hour for which the weather data is valid, truncated. |
| `temperature_c` | Double | The average temperature in Celsius for that hour. |
| `humidity` | Double | The average relative humidity (%) for that hour. |
| `solar_irradiance_ghi`| Double | The average Global Horizontal Irradiance (W/m²) for that hour. |
| `is_holiday_flag` | Integer | A binary flag (1 or 0) indicating if the date is a public holiday. |

---

#### 4. Feature Store Features (Anomaly Detection)

This defines the schema of the `ad-apartment-features` Feature Group in SageMaker Feature Store. These are the inputs to the AD model.

| Feature Name | Data Type | Description |
| :--- | :--- | :--- |
| **apartment_record_id** | String | **Record Identifier:** Unique ID for the record (e.g., `[apartment_id]_[date]`). |
| **event_time** | Fractional | **Event Time:** Timestamp when the features were computed/ingested. |
| `event_date` | String | The specific date (YYYY-MM-DD) these daily features correspond to. |
| `building_id` | String | Identifier for the building. |
| `avg_temp_diff` | Fractional | The average difference between the setpoint and actual room temperature for the day. |
| `daily_energy_kwh` | Fractional | The total heating energy consumed on that day. |
| `hdd` | Fractional | Heating Degree Days, a measure of how cold the day was. |
| `energy_lag_1d` | Fractional | The value of `daily_energy_kwh` from the previous day. |
| `energy_roll_avg_7d` | Fractional | The 7-day rolling average of `daily_energy_kwh`. |
| `temp_diff_roll_std_3d` | Fractional | The 3-day rolling standard deviation of `avg_temp_diff`. |

---

#### 5. Alert Table Schema (DynamoDB)

This defines the structure of the `ad-alerts` table in Amazon DynamoDB, where the inference pipeline stores actionable alerts.

**Table Name:** `hometech-ml-ad-alerts-[env]`

| Attribute Name | Data Type | Key Type / Index | Description |
| :--- | :--- | :--- | :--- |
| **AlertID** | String (S) | **Partition Key (PK)** | Unique identifier for the alert. **Format:** `[ApartmentID]#[EventDate]`. |
| `ApartmentID` | String (S) | GSI-1 Partition Key | The unique identifier of the apartment that triggered the alert. |
| `BuildingID` | String (S) | GSI-2 Partition Key | The unique identifier of the building. |
| `EventDate` | String (S) | - | The date (YYYY-MM-DD) for which the anomaly was detected. |
| `AlertTimestamp` | String (S) | GSI-2 Sort Key | ISO 8601 timestamp of when the alert was created by the pipeline. |
| `AnomalyScore` | Number (N) | - | The raw numerical score from the ML model. Higher means more anomalous. |
| `Threshold` | Number (N) | - | The score threshold that was breached to create this alert. |
| **Status** | String (S) | GSI-1 Sort Key | The current state of the alert. **Values:** `Unseen`, `Investigating`, `Resolved-True Positive`, `Resolved-False Positive`. |
| `ModelVersion` | String (S) | - | Version of the model package that generated the score (for lineage). |
| `FeedbackNotes` | String (S) | - | (Optional) Notes entered by the maintenance technician during review. |

**Global Secondary Indexes (GSIs):**

*   **GSI-1 (`ApartmentStatusIndex`):** Allows efficiently querying for alerts of a specific `Status` within a given `ApartmentID`.
    *   **Partition Key:** `ApartmentID`
    *   **Sort Key:** `Status`
*   **GSI-2 (`BuildingAlertsIndex`):** Allows efficiently querying for all alerts in a `BuildingID`, sorted by time.
    *   **Partition Key:** `BuildingID`
    *   **Sort Key:** `AlertTimestamp`


#### Configuration File Example

```yaml
feature_engineering:
  lookback_days: 7
  weather_feature_cols: ["hdd", "avg_temp_c"]

training:
  model_strategy: "LR_LOF"
  hyperparameters:
    lof_neighbors: 20
    lof_contamination: "auto"
  feature_columns: # List of features model actually uses
    - daily_energy_kwh
    - avg_temp_diff
    # ... etc
  instance_type: "ml.m5.large"

evaluation:
  metrics_thresholds:
    min_f1_score: 0.6 # Example if using labels
    max_throughput_deviation: 0.2 # Example
  holdout_data_path: "s3://..." # Path to specific eval data

inference:
  alert_threshold: 5.0
  batch_transform_instance_type: "ml.m5.large"
```