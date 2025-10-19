# Energy Demand Forecasting in Time Series IoT Data

##

---

### TL;DR: ML-Powered Energy Demand Forecasting for Smart Buildings

*   **Challenge:** The company needed to forecast building-level energy demand 24-72 hours in advance to provide valuable data to energy suppliers for grid balancing and to enable a new resident-facing feature for optimizing solar energy self-consumption. The system had to be accurate, reliable, and capable of handling complex factors like weather and holidays.

*   **My Role & Solution:** I led the development and operationalization of the forecasting system, serving as the Data Scientist and MLOps Engineer. My key contributions were:
    *   **Strategic Approach:** I designed a model development strategy that began with strong baselines (like SARIMAX and Prophet) and iteratively progressed to a high-performance XGBoost model. I established that forecasting at the building-level was the most effective initial approach, balancing accuracy with computational feasibility.
    *   **Feature Engineering:** I engineered a rich feature set crucial for forecast accuracy. This involved creating time-series features (lags, rolling windows), incorporating calendar events (holidays), and building a robust pipeline to process and align *future* weather forecast data with historical consumption patterns.
    *   **MLOps Infrastructure:** Using Terraform, I built a fully automated, serverless MLOps pipeline on AWS. The architecture included a distinct training workflow orchestrated by Step Functions for monthly model retraining, and a separate daily inference workflow that generates and stores forecasts.
    *   **Production Lifecycle Management:** I implemented the end-to-end system, including a containerized (Docker/ECR) forecasting model, versioning and governance via SageMaker Model Registry, and a CI/CD pipeline in Bitbucket for automated testing and deployment. The solution included a scalable serving layer using Amazon Timestream, API Gateway, and Lambda to deliver forecasts to both B2B and B2C consumers.

*   **Impact:** The forecasting system became a key data product for the company, unlocking new value for both business partners and residents.
    *   Achieved a **<10% Mean Absolute Percentage Error (MAPE)** on 24-hour ahead building-level forecasts, providing reliable data to energy suppliers.
    *   Enabled the launch of the "Smart Energy Advisor" feature in the resident app, leading to a **15% increase in user engagement** with energy management tools. This, in turn, drove a measured ~10% increase in the building's solar self-consumption rate by empowering residents to align appliance usage with peak solar generation periods.

*   **System Architecture:** I designed and implemented the complete AWS solution, from data ingestion to API serving, ensuring scalability and automation.

![](../_static/past_experiences/iot_forecasting/contributions.png)




### Introduction

#### Purpose

This document provides detailed technical information about the Machine Learning (ML) based Energy Demand Forecasting (EDF) system developed. It serves as a guide for developers, MLOps engineers, operations teams.

#### Business Goal

The primary goals of the EDF system are to:

*   Provide accurate short-term (e.g., 24-72 hours) aggregated energy demand forecasts at the building level to external energy suppliers and Distribution System Operators (DSOs) for improved grid balancing, energy procurement, and network management.
*   Empower residents by providing insights into predicted building energy consumption versus predicted solar generation, enabling them to optimize appliance usage for increased solar self-consumption and potential cost savings.


#### Scope

This documentation details the end-to-end pipelines for data processing, model training, model evaluation, model registration, batch inference (forecasting), forecast storage, and the conceptual API serving layer. It assumes the existence of a separate data ingestion pipeline providing the necessary raw data feeds. 

#### Key Technologies

*   **Cloud Platform:** AWS (Amazon Web Services)
*   **Data Lake:** Amazon S3
*   **Data Processing/ETL:** AWS Glue (PySpark), AWS Lambda (Python), SageMaker Processing Jobs (PySpark/Python)
*   **Feature Management:** Shared Code Libraries (Primary), Amazon SageMaker Feature Store (Optional for historical features)
*   **Model Training:** Amazon SageMaker Training Jobs (using custom Docker containers with Prophet, XGBoost, etc.)
*   **Model Forecasting:** Amazon SageMaker Processing Jobs (running forecast generation scripts)
*   **Model Registry:** Amazon SageMaker Model Registry
*   **Orchestration:** AWS Step Functions
*   **Scheduling:** Amazon EventBridge Scheduler
*   **Forecast Storage:** Amazon Timestream (Primary Example), Amazon RDS, Amazon DynamoDB
*   **API Layer:** Amazon API Gateway, AWS Lambda
*   **Infrastructure as Code:** Terraform
*   **CI/CD:** Bitbucket Pipelines
*   **Containerization:** Docker
*   **Core Libraries:** PySpark, Pandas, Scikit-learn, Boto3, PyYAML, Prophet, XGBoost, AWS Data Wrangler.



**Table of Contents**

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
4.  [Configuration Management](#configuration-management)
5.  [Infrastructure as Code (Terraform)](#infrastructure-as-code-terraform)
    *   [Stacks Overview](#stacks-overview)
    *   [Key Resources](#key-resources)
6.  [CI/CD Pipeline (Bitbucket)](#cicd-pipeline-bitbucket)
    *   [CI Workflow](#ci-workflow)
    *   [Training CD Workflow](#training-cd-workflow)
    *   [Inference CD Workflow](#inference-cd-workflow)
7.  [Deployment & Execution](#deployment--execution)
    *   [Prerequisites](#prerequisites)
    *   [Initial Deployment](#initial-deployment)
    *   [Running Training](#running-training)
    *   [Running Inference](#running-inference)
    *   [Model Approval](#model-approval)
8.  [Monitoring & Alerting](#monitoring--alerting)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Security Considerations](#security-considerations)
11. [Roadmap & Future Enhancements](#roadmap--future-enhancements)
12. [Appendices](#appendices)
    *   [Configuration File Example](#configuration-file-example)



### Discovery and Scoping

#### Use Case Evaluation 

![](../_static/past_experiences/iot_forecasting/use_case.png)

#### Product Strategies

![](../_static/past_experiences/iot_forecasting/strategy.png)

#### Features

![](../_static/past_experiences/iot_forecasting/features.png)

#### Product Requirements Document

![](../_static/past_experiences/iot_forecasting/prd.png)

#### Development Stages

<!--![](../_static/past_experiences/iot_forecasting/stages.png)-->
<p align="center">
    <img src="../_static/past_experiences/iot_forecasting/stages.png" width="75%"> 
</p>


### System Architecture
![](../_static/past_experiences/iot_forecasting/arch.png)

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

#### Overall Data Flow

The EDF system utilizes distinct, automated pipelines for training forecasting models and generating daily forecasts. It relies on processed historical data and external weather forecasts. Forecasts are stored in a time-series database and made available via APIs.


1.  **Raw Data:** Aggregated Consumption, Solar Generation, Historical Weather, *Future Weather Forecasts*, Calendar/Topology data land in S3 Raw Zone.
2.  **Processed Data:** Ingestion pipeline processes *historical* data into `processed_edf_data` in S3 Processed Zone / Glue Catalog.
3.  **Features (Training):** Training Feature Engineering step reads `processed_edf_data`, calculates historical time-series features (lags, windows, time components), splits train/eval sets, and writes them to S3.
4.  **Features (Inference):** Inference Feature Engineering step reads recent `processed_edf_data` and *future raw weather forecasts*, calculates features for the forecast horizon using shared logic, and writes them to S3.
5.  **Model Artifacts:** Training jobs save serialized forecast models (Prophet JSON, XGBoost UBJ) to S3.
6.  **Evaluation Reports:** Evaluation jobs save forecast metrics (MAPE, RMSE) to S3.
7.  **Model Packages:** Approved forecast models are registered in the EDF Model Package Group.
8.  **Raw Forecasts:** Inference forecast generation step writes raw forecast outputs (timestamp, building, yhat, yhat_lower, yhat_upper) to S3.
9.  **Stored Forecasts:** Load Forecasts step reads raw forecasts from S3 and writes them into the target database (e.g., Timestream).
10. **Served Forecasts:** API Gateway and Lambda query the forecast database to serve B2B and B2C clients.





**Forecasting Pipeline Description:**

1.  **Ingestion:** Aggregated Consumption, Solar Generation, Topology/Calendar, and crucially, *Forecasted* Weather data are ingested into the Raw S3 Zone.
2.  **Processing:** A daily Glue ETL job aggregates data to the building level (if needed), joins it with weather forecasts and calendar info, and engineers features (lags, time features, weather interactions). Processed features are stored in S3 (and potentially SageMaker Feature Store for easier reuse/serving). The Glue Data Catalog is updated.
3.  **Model Training:** A Step Functions workflow orchestrates training, similar to AD, using appropriate forecasting models (ARIMA, Prophet, Gradient Boosting, etc.). Models are registered.
4.  **Batch Inference:** A daily Step Functions workflow prepares features for the forecast horizon (using actual latest data *and future weather forecasts*), runs SageMaker Batch Transform, and stores the resulting forecasts (e.g., hourly demand for next 72h) in S3.
5.  **Results Storage:** Raw forecasts are stored in S3. A subsequent job loads the forecasts into a database optimized for time-series queries or fast lookups (DynamoDB, RDS, or potentially Amazon Timestream).
6.  **Serving:**
    *   **B2B:** A dedicated API Gateway endpoint uses Lambda to query the Forecast Database, perform necessary aggregation/anonymization, and return forecasts to authorized suppliers/DSOs.
    *   **B2C:** The existing App/Tablet backend queries the Forecast Database (likely via another API Gateway endpoint) to get simplified data for resident visualization (comparing building demand vs. solar).
    *   **Analysts:** Use Athena for ad-hoc analysis.





#### Training Workflow

**Summary:** Triggered by Schedule/Manual -> Validates Schema -> Engineers Historical Features (Train/Eval Sets) -> Trains Model (Prophet/XGBoost) -> Evaluates Model (MAPE, RMSE) -> Conditionally Registers Model (Pending Approval).


**Step Function State Machine**

1.  **State:** `ValidateSchema` (Optional)
    *   **Service:** SM Processing / Glue Shell
    *   **Action:** Validates schema of `processed_edf_data`.
2.  **State:** `FeatureEngineeringTrainingEDF`
    *   **Service:** SM Processing Job (Spark) / Glue ETL
    *   **Action:** Reads `processed_edf_data` for training range. Creates time features, lags (consumption, weather), rolling windows. Splits into train/eval feature sets (Parquet) written to S3.
3.  **State:** `ModelTrainingEDF`
    *   **Service:** SM Training Job
    *   **Action:** Reads training features from S3. Instantiates/fits chosen model (Prophet/XGBoost) based on input strategy and hyperparameters. Saves model artifact (`prophet_model.json` / `xgboost_model.ubj` + `model_metadata.json`) within `model.tar.gz` to S3.
4.  **State:** `ModelEvaluationEDF`
    *   **Service:** SM Processing Job (Python + libs)
    *   **Action:** Loads model artifact. Reads evaluation features from S3. Generates forecasts for eval period. Calculates MAPE, RMSE, MAE against actuals (from eval features). Writes `evaluation_report_edf.json` to S3.
5.  **State:** `CheckEvaluationEDF` (Choice)
    *   **Action:** Compares metrics (e.g., MAPE, RMSE) against thresholds from config.
6.  **State:** `RegisterModelEDF`
    *   **Service:** Lambda
    *   **Action:** Creates Model Package in EDF group (`PendingManualApproval`), embedding metadata and evaluation results.
7.  **Terminal States:** `WorkflowSucceeded`, `EvaluationFailedEDF`, `WorkflowFailed`.



#### Inference Workflow


**Summary:** Triggered Daily by Scheduler -> Gets Latest Approved Model -> Creates SM Model Resource -> Engineers Inference Features -> Generates Forecasts (SM Processing) -> Loads Forecasts into DB (Timestream/RDS).

1.  **State:** `GetInferenceDate` (Optional Lambda / Step Functions Context)
    *   **Action:** Determines target forecast start date (e.g., "today" or "tomorrow" relative to execution time) and forecast end date based on horizon.
2.  **State:** `GetApprovedEDFModelPackage`
    *   **Service:** Lambda
    *   **Action:** Gets latest `Approved` Model Package ARN from EDF group.
3.  **State:** `CreateEDFSageMakerModel`
    *   **Service:** Lambda
    *   **Action:** Creates SM `Model` resource from the approved package ARN.
4.  **State:** `FeatureEngineeringInferenceEDF`
    *   **Service:** SM Processing Job (Spark) / Glue ETL
    *   **Action:** Reads recent historical `processed_edf_data` (for lags) AND future raw `weather-forecast` data. Creates feature set covering the forecast horizon (including future dates and weather). Writes inference features (Parquet) to S3.
5.  **State:** `GenerateForecastsEDF`
    *   **Service:** SM Processing Job (Python + libs)
    *   **Action:** Loads model artifact (mounted via SM Model resource). Reads inference features from S3. Calls model's `predict` method to generate forecasts (`yhat`, `yhat_lower`, `yhat_upper`). Writes forecast results (Parquet/CSV) to S3.
6.  **State:** `LoadForecastsToDB`
    *   **Service:** Lambda / Glue Python Shell
    *   **Action:** Reads forecast results from S3. Formats data for target DB (Timestream example). Writes records to the database using batch operations.
7.  **Terminal States:** `WorkflowSucceeded`, `WorkflowFailed`.


#### Forecast Serving

*   **B2B API:** API Gateway endpoint proxying to a Lambda function. Lambda queries the Forecast DB (e.g., Timestream) based on requested `building_id` and `time_range`. Requires authentication/authorization (e.g., API Keys, Cognito Authorizer).
*   **B2C API:** Separate API Gateway endpoint/Lambda. Queries Forecast DB, potentially performs simple comparison with Solar forecast (if available), returns simplified data structure for UI visualization. Requires app user authentication.


### Model Development & Iteration

**Models for Time Series Forecasting**
![](../_static/past_experiences/iot_forecasting/models1.png)
![](../_static/past_experiences/iot_forecasting/models2.png)

![](../_static/past_experiences/iot_forecasting/model_development.png)

<!--

**Context:** The goal is to produce accurate, building-level, short-term (24-72h) energy demand forecasts. The model must leverage time-series patterns, holiday effects, and crucially, future weather forecasts. Success is measured by the accuracy of point forecasts.

**Evaluation Metric:**
*   **Primary Metric:** **Mean Absolute Percentage Error (MAPE)**. It's a standard, intuitive metric for forecasting that expresses error as a percentage of the actual value. A MAPE of 10% means the forecast is, on average, 10% off the actual value.
*   **Secondary Metric:** **Root Mean Squared Error (RMSE)**. This metric is in the same units as the target (kWh) and penalizes large errors more heavily than MAPE, which is important for avoiding significant misses during peak consumption periods.

**Evaluation Method:**
All experiments are evaluated using a consistent backtesting methodology. The model is trained on a rolling window of historical data (e.g., 1 year) and then used to forecast the next period (e.g., 1 week). This process is repeated over multiple splits of the test set to get a robust estimate of out-of-sample performance.

---

Here is a list of the experiments performed:

| Experiment / Iteration | Model/Technique | Features Used | Evaluation Metric & Hypothetical Result | Key Learnings & Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Baselines & Classical Time Series Models** |
| **1. Baseline Model** | Seasonal Naive | - `consumption_kwh` (target) | **MAPE:** 28%<br>**RMSE:** 12.5 kWh | **Rationale:** Establish the absolute minimum performance benchmark. The model predicts the consumption from the same hour on the same day of the previous week. Its poor performance highlights the strong influence of factors other than simple weekly seasonality, especially weather. |
| **2. Classical Univariate Model** | SARIMA | - `consumption_kwh` (target) | **MAPE:** 21%<br>**RMSE:** 9.8 kWh<br>*(Improvement: ~25% vs. Baseline)* | **Rationale:** Test a standard statistical time-series model. `auto_arima` was used to find optimal `(p,d,q)(P,D,Q)` parameters. SARIMA successfully captured trend and autocorrelation, significantly outperforming the naive baseline. However, its errors clearly correlated with unexpected weather changes, proving the need for exogenous variables. |
| **3. Multivariate Statistical Model** | SARIMAX | - Target: `consumption_kwh`<br>- **Exogenous:** `temperature_c`, `is_holiday_flag` | **MAPE:** 16%<br>**RMSE:** 7.2 kWh<br>*(Improvement: ~24% vs. SARIMA)* | **Rationale:** Introduce external factors that are known in advance. Adding historical weather and holiday flags as exogenous variables provided a major boost in accuracy. This confirmed that weather is a primary driver of energy consumption. Parameter tuning remained complex. |
| **Phase 2: Modern & Machine Learning Models** |
| **4. Decomposable Model** | Prophet | - Target: `consumption_kwh`<br>- **Regressors:** `temperature_c`, `solar_irradiance_ghi`, `is_holiday_flag` | **MAPE:** 14%<br>**RMSE:** 6.5 kWh<br>*(Improvement: ~12.5% vs. SARIMAX)* | **Rationale:** Test a more modern, flexible time-series model. Prophet's ability to handle multiple seasonalities (daily, weekly) and its robust holiday modeling, combined with weather regressors, gave it an edge over SARIMAX. It was also significantly faster to train and easier to configure. |
| **5. ML Regression Model (Basic Features)** | XGBoost | - Target: `consumption_kwh`<br>- **Basic Time Features:** `hour_of_day`, `day_of_week`<br>- **Exogenous:** `temperature_c`, `solar_irradiance_ghi`, `is_holiday_flag` | **MAPE:** 13.5%<br>**RMSE:** 6.3 kWh<br>*(Improvement: ~3.5% vs. Prophet)* | **Rationale:** Treat forecasting as a standard regression problem. Even with basic time features, XGBoost's ability to capture non-linear relationships (e.g., the effect of temperature is not linear) allowed it to slightly outperform Prophet. This demonstrated the potential of tree-based models. |
| **6. ML Regression Model (Advanced Features)** | XGBoost | All previous features +<br>- **Lag features** (e.g., consumption 24h & 168h ago)<br>- **Rolling window features** (e.g., 24h avg consumption/temp)<br>- **Interaction features** (e.g., temp * hour) | **MAPE:** 9.5%<br>**RMSE:** 4.1 kWh<br>*(Improvement: ~30% vs. XGBoost Basic)* | **Rationale:** Provide the model with deep temporal context. This was the most significant leap in performance. Lag and rolling window features allowed the model to understand recent consumption patterns and trends, which are highly predictive. **This established XGBoost with rich features as the champion model.** |
| **7. Hyperparameter Optimization** | XGBoost (Tuned) | Same as Exp #6 | **MAPE:** 8.2%<br>**RMSE:** 3.6 kWh<br>*(Improvement: ~14% vs. XGBoost Advanced)* | **Rationale:** Fine-tune the champion model. Using SageMaker's Automatic Model Tuning to optimize XGBoost's key hyperparameters (`n_estimators`, `max_depth`, `learning_rate`, etc.) squeezed out a significant, final improvement in accuracy, bringing the model to production-ready performance. |
| **Phase 3: Deep Learning & Global Models** |
| **8. Global Model Exploration** | DeepAR | - **Target:** `consumption_kwh`<br>- **Covariates:** Weather forecasts, time features<br>- **Static Features:** `building_id` | **MAPE:** 8.5%<br>**RMSE:** 3.8 kWh | **Rationale:** Test if a global model trained across all buildings could outperform the building-specific XGBoost models. DeepAR performed very well, nearly matching the tuned XGBoost, and its key advantage was providing a probabilistic forecast (prediction intervals). However, its complexity and slightly lower point-forecast accuracy meant it did not replace XGBoost as the champion for this specific goal. It is retained as a strong candidate for future probabilistic forecasting features. |


### Model development Iteration: Takeaways

The model development for Energy Demand Forecasting followed a path of progressively adding complexity and context, leading to significant accuracy gains at each major step:

1.  **Exogenous Variables are Critical:** The first major improvement came from moving beyond purely univariate models (like SARIMA) to models that incorporate external drivers like weather and holidays (SARIMAX, Prophet, ML models).
2.  **ML Models Outperform Classical for Non-Linearity:** Machine learning models, particularly **XGBoost**, demonstrated an advantage over classical statistical models like SARIMAX by being able to capture complex, non-linear relationships between features (especially temperature) and energy consumption.
3.  **Advanced Feature Engineering is the Key Driver:** The most substantial performance gain was achieved by creating rich temporal features (lags and rolling windows). This highlights that for regression-based forecasting, feature engineering is often more important than the initial choice of algorithm.
4.  **A Tuned ML Model is the Champion:** A well-featured and hyperparameter-tuned **XGBoost** model provided the best point-forecast accuracy, balancing performance with reasonable training times and a well-understood implementation.
5.  **Deep Learning Shows Promise:** **DeepAR** proved to be a powerful alternative, especially for its ability to learn across buildings and provide probabilistic forecasts, marking it as a valuable tool for future enhancements rather than an immediate replacement for the champion model.

-->



### Configuration Management

*   Uses `config/edf_config.yaml` version-controlled in Git.
*   File uploaded to S3 by CI/CD.
*   Scripts load config from S3 URI passed via environment variable/argument.
*   Includes sections for `feature_engineering`, `training` (with nested model hyperparameters), `evaluation` (thresholds), `inference` (schedule, instance types, DB config).
*   Secrets managed via AWS Secrets Manager / SSM Parameter Store.



### Infrastructure as Code (Terraform)

*   Manages all AWS resources for EDF pipelines.
*   **Stacks:**
    *   `training_edf`: ECR Repo (`edf-training-container`), Model Package Group (`EDFBuildingDemandForecaster`), Lambda (`RegisterEDFModelFunction`), Step Function (`EDFTrainingWorkflow`), associated IAM roles. Optionally Feature Group (`edf-building-features`). Requires outputs from `ingestion`.
    *   `inference_edf`: Timestream DB/Table (or RDS/DDB), Lambdas (GetModel, CreateModel - potentially reused; LoadForecasts), Step Function (`EDFInferenceWorkflow`), EventBridge Scheduler, API Gateway Endpoints/Lambdas (for serving), associated IAM roles. Requires outputs from `ingestion` and `training_edf`.
*   **State:** Remote backend (S3/DynamoDB) configured.


### CI/CD Pipeline (Bitbucket)

*   Defined in `bitbucket-pipelines.yml`.
*   **CI (Branches/PRs):** Lints, runs ALL unit tests, builds EDF container, pushes to ECR (`edf-training-container` repo), validates ALL Terraform stacks.
*   **EDF Training CD (`custom:deploy-and-test-edf-training`):** Manual trigger. Deploys `training_edf` stack. Runs EDF training integration tests.
*   **EDF Inference CD (`custom:deploy-and-test-edf-inference`):** Manual trigger. Deploys `inference_edf` stack. Runs EDF inference integration tests (requires approved model).



### Deployment & Execution

**8.1 Prerequisites:** Base AWS setup, Terraform, Docker, Python, Git, Bitbucket config, deployed `ingestion` stack.

**8.2 Initial Deployment:** Deploy Terraform stacks (`training_edf`, `inference_edf`) after `ingestion`. Build/push EDF container. Upload initial `edf_config.yaml`. Ensure processed EDF data exists.

**8.3 Running Training:** Trigger `EDFTrainingWorkflow` Step Function (schedule/manual) with appropriate input JSON (date range, model strategy, hyperparameters, image URI).

**8.4 Running Inference:** `EDFInferenceWorkflow` runs automatically via EventBridge Scheduler. Ensure prerequisite data (processed history, weather forecasts) is available daily.

**8.5 Model Approval:** Manually review `PendingManualApproval` packages in the `EDFBuildingDemandForecaster` group and promote to `Approved` based on evaluation metrics.



### Monitoring & Alerting

*   **CloudWatch Logs:** Monitor logs for EDF Step Functions, Lambdas, SageMaker Processing Jobs.
*   **CloudWatch Metrics:** Monitor SFN `ExecutionsFailed`, Lambda `Errors`/`Duration`, Processing Job `CPU/Memory`, Timestream/RDS metrics (if applicable), API Gateway `Latency`/`4XX/5XX Errors`.
*   **Forecast Accuracy Tracking:** **CRITICAL:** Implement a separate process (e.g., scheduled Lambda/Glue job) to periodically compare stored forecasts against actual consumption data (loaded later) and calculate ongoing MAPE/RMSE. Log these metrics to CloudWatch or a dedicated monitoring dashboard.
*   **Data Pipeline Monitoring:** Monitor success/failure of ingestion jobs providing raw data and the `process_edf_data` Glue job.
*   **Weather Forecast API:** Monitor availability and error rates of the external weather forecast API.
*   **CloudWatch Alarms:** Set alarms on: SFN Failures, Lambda Errors, Forecast Accuracy Degradation (MAPE/RMSE exceeding threshold), Weather API Fetch Failures, Target DB Write Errors.


### Estimated Monthly Costs

**Assumptions:**

*   **Environment:** AWS `eu-central-1` (Frankfurt) region.
*   **Buildings:** 120.
*   **Data Volume:** Building-level aggregation results in smaller processed data sizes compared to the raw sensor data for AD.
    *   Daily Processed EDF Data: ~10 MB.
    *   Total Monthly Processed EDF Data: 10 MB/day * 30 days = **~300 MB**.
*   **Model Training Frequency:** 1 time per month.
*   **Batch Inference Frequency:** 30 times per month (daily).
*   **API Serving Layer:**
    *   B2B API (Suppliers): Low volume, high value. Assume **10,000 requests/month**.
    *   B2C API (Residents): Higher volume. Assume 3,000 apartments * 1 request/day * 30 days = **90,000 requests/month**.
    *   Total API Requests: **~100,000 per month**.

| Pipeline Component | AWS Service(s) | Detailed Cost Calculation & Rationale | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Data Ingestion & Processing** | **AWS Glue**<br>**AWS Lambda**<br>**S3** | **AWS Glue ETL (Processing EDF Data):** Daily job to aggregate raw data and join with weather/calendar. Less data than AD raw processing.<br>- 1 job/day * 30 days * 0.15 hours/job * 4 DPUs * ~$0.44/DPU-hr = **~$7.92**<br><br>**AWS Lambda (Ingesting Raw Data):** Lambdas for fetching weather forecasts, historical weather, etc.<br>- Assume 5 functions, ~100k total invocations/month, avg 10 sec duration, 256MB. All usage is well within the Lambda free tier. = **~$0.00**<br><br>**S3 (PUT Requests):** Lower volume than AD due to aggregation.<br>- ~1000 PUT req/day * 30 days * ~$0.005/1k req = **~$0.15** | **$8 - $15** |
| **Feature Engineering** | **SageMaker Processing** | **SageMaker Processing Jobs:** Priced per instance-second. Covers feature engineering for both the monthly training and daily inference pipelines.<br>- Training (monthly): 1 run/month * 1.0 hour/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$0.11**<br>- Inference (daily): 30 runs/month * 0.25 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$0.83** | **$1 - $3** |
| **Model Training** | **SageMaker Training**<br>**Step Functions** | **SageMaker Training Jobs:** Priced per instance-second. Assuming monthly retraining on a standard instance.<br>- 1 run/month * 1.5 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$0.17**<br><br>**Step Functions:** The training workflow runs infrequently.<br>- ~10 transitions/run * 1 run/month = 10 transitions. Well within free tier. = **~$0.00** | **$1 - $2** |
| **Model Inference** | **SageMaker Processing**<br>**Step Functions** | **SageMaker Processing Job (Forecast Generation):** We use a Processing Job for flexibility. This is the daily forecasting job.<br>- 30 runs/month * 0.5 hours/run * 1 `ml.m5.large` instance * ~$0.11/hr = **~$1.65**<br><br>**Step Functions:** The inference workflow runs daily.<br>- ~8 transitions/run * 30 runs/month = 240 transitions. Well within free tier. = **~$0.00** | **$2 - $4** |
| **Forecast Storage & Serving** | **API Gateway**<br>**AWS Lambda**<br>**Amazon Timestream** | **API Gateway:** Priced per million requests.<br>- 100,000 requests/month is well within the 1M free tier requests (for REST APIs). = **~$0.00**<br><br>**AWS Lambda (Serving):** Lambdas for serving B2B/B2C requests.<br>- 100k invocations/month * avg 150ms duration * 256MB memory. All usage well within free tier. = **~$0.00**<br><br>**Amazon Timestream:** Priced per GB of ingestion, storage, and queries.<br>- Ingestion: 30 days * 120 bldgs * 72 hr fcst * ~1KB/record = ~260 MB ingest/month. Free tier is 1GB. = **~$0.00**<br>- Memory Store: Small, rolling window of recent data. ~1 GB * ~$0.036/GB-hr * 720 hrs = **~$25.92** (This can be high). **Let's assume we reduce memory retention to 1 day = ~$3.60**<br>- Magnetic Store: ~3 GB/year. ~0.3 GB * ~$0.03/GB-month = **~$0.01**<br>- Queries: 100k requests * ~10MB scanned/query (estimate) = ~1TB queries. $0.01/GB * 1024 GB = **~$10.24** | **$15 - $25** |
| **Storage & Logging** | **S3**<br>**ECR**<br>**CloudWatch** | **S3:** Priced per GB-month. Lower processed/feature data volume than AD, but still need to store raw data.<br>- Assume total storage for Raw, Processed, Features, Artifacts = ~380 GB<br>- 380 GB * ~$0.023/GB-month = **~$8.74**<br>- Add ~$2 for GET/LIST requests.<br><br>**ECR:** Priced per GB-month. For the EDF container image.<br>- Assume a separate 10 GB storage for EDF images. = **~$1.00**<br><br>**CloudWatch:** Logs from all jobs and Lambdas.<br>- Assume ~10 GB log ingestion * ~$0.50/GB = **~$5.00** | **$15 - $25** |
| **Total Estimated Monthly Cost** | **-** | **-** | **$42 - $74** |

This detailed breakdown reveals that the highest operational cost for the forecasting system is the **Forecast Storage & Serving** layer, specifically the **Timestream** memory store and query costs. The batch ML compute costs for feature engineering, training, and inference remain very low. This highlights the importance of optimizing the database configuration (e.g., memory vs. magnetic retention) and query patterns for the serving APIs to manage costs effectively.

<!--

### Challenges and learnings


---

### Challenge 1: The "Sunny Winter Day" Problem - Model Inability to Generalize to Unseen Conditions

**Chronological Events:**

1.  **Initial Model Success (First 6 Months):** The team develops a champion XGBoost model (Exp #7) for forecasting building-level energy demand. It's trained on one full year of historical data and performs well in backtesting, achieving a respectable ~8% MAPE. The model's feature importance, analyzed with SHAP, shows that `temperature_c`, `hour_of_day`, and `consumption_lag_24h` are the dominant drivers, as expected. The model is deployed, and the daily inference pipeline begins providing forecasts to a pilot group of energy suppliers.

2.  **The First Catastrophic Failure (First Winter in Production):** In late November, a weather pattern emerges that was rare in the single year of training data: a week of unusually sunny but extremely cold days. The daily forecast accuracy plummets. The model consistently and significantly *under-predicts* energy demand for the entire week, with the MAPE spiking to over 30%.

3.  **High-Stakes Business Impact:** The pilot energy supplier is furious. Relying on the forecast, they procured insufficient energy on the spot market and had to buy expensive peak-load power to cover the shortfall, incurring significant financial losses. They threaten to pull out of the pilot. The internal product and marketing teams are under immense pressure to explain the failure.

4.  **Initial Debugging - No Obvious Errors:** The MLOps team investigates. The inference pipeline ran successfully with no errors. The input weather forecast data from the API was accurate—it correctly predicted sunny and cold conditions. The model health checks passed. Tracing the Step Function execution shows everything worked as designed. The problem wasn't a technical failure; it was a **model failure**.

5.  **Deep Dive with SHAP and Feature Analysis (Week 2 of Failure):** The ML team pulls the inference feature data and the model's predictions for the failure period. They run SHAP analysis on the specific predictions and discover the root cause:
    *   **Feature Interaction Problem:** In the training data, the feature `solar_irradiance_ghi` was highly correlated with `temperature_c` (sunny days were generally warm). The model learned a strong, simple interaction: `if solar_irradiance is HIGH -> then energy_demand is LOW` (because less heating is needed and residents might be out).
    *   **Failure to Generalize:** When faced with a new, unseen combination of `HIGH solar_irradiance` and `LOW temperature_c` (a sunny winter day), the model incorrectly gave too much weight to the `solar_irradiance` feature. It predicted low energy demand because it was sunny, failing to account for the overriding effect of the extreme cold. It had learned a correlation, not the true causal relationship.

6.  **Exploring Solutions (Week 3):** The team brainstorms how to fix this fundamental generalization issue:
    *   **Option A (More Data):** Wait several years to collect more examples of "sunny winter days". This is unacceptable from a business perspective.
    *   **Option B (Better Features):** Engineer features that are more robust to these interactions. The team experiments with creating interaction terms explicitly (e.g., `temperature * solar_irradiance`) and non-linear transformations of temperature (e.g., polynomial features) to help the model learn that the effect of temperature is not linear and dominates at cold extremes.
    *   **Option C (Different Model):** Re-evaluate models that might handle these relationships differently. Could a simpler model like Prophet (with seasonality and weather regressors) be less prone to this specific error? Could an LSTM capture the temporal context better?

7.  **Resolution: Hybrid Approach (Week 4-5):**
    *   **Feature Engineering (Primary Fix):** The team implements **Heating Degree Days (HDD)** as a new feature. HDD is a non-linear transformation of temperature specifically designed to measure heating requirements (`max(0, 18°C - outdoor_temp)`). This single feature is much more causally linked to heating demand than raw temperature.
    *   **Model Retraining:** They retrain the XGBoost model with the new HDD feature and other interaction terms. In offline testing on the problematic week, the new model's MAPE drops from 30% to ~12%, a massive improvement.
    *   **Monitoring Enhancement:** They add a new monitoring check to the inference pipeline: an "out-of-distribution" (OOD) alert. This check compares the joint distribution of key input features for the upcoming forecast (e.g., `temperature_c` vs. `solar_irradiance_ghi`) against the distributions seen in the training data. If a highly unusual combination is detected, it flags the forecast with a "low confidence" warning, even if the model produces a prediction. This manages stakeholder expectations.

**Lessons & Retrospective:**

*   **"What were the challenges?":** "Our biggest challenge was a catastrophic model failure in production due to the model's inability to generalize to weather conditions that were rare in our training data. The model learned a spurious correlation between sunshine and warmth, which led to significant under-prediction during a 'sunny but cold' week, causing direct financial impact for our partner. The incident was hard to debug because it wasn't a code error but a fundamental data science problem."
*   **"What would you change?":** "I would place a much stronger emphasis on **stress-testing the model against plausible but unseen feature combinations** during the evaluation phase, before ever deploying to production. Instead of just relying on a historical backtest split, we should have synthesized adversarial data points (like high sun/low temp, low sun/high temp) to check for logical consistency in the model's predictions. Furthermore, I would implement input data monitoring for out-of-distribution detection from day one."

---

### Challenge 2: The Holiday Effect Mismatch - Aligning Model Features with Business Reality

**Chronological Events:**

1.  **Initial Implementation:** The team uses a standard Python library to generate a list of Swiss national and cantonal holidays. This is added as a binary `is_holiday_flag` feature to the Prophet and XGBoost models.
2.  **Observed Errors:** During the first year of operation, the team notices recurring large forecast errors around specific holidays.
    *   **Christmas Week:** The model accurately predicts the dip on Christmas Day (Dec 25th) and the 26th, but it massively *over-predicts* demand for the 24th and the 27th-30th.
    *   **"Bridge" Days:** On days falling between a weekend and a public holiday (e.g., a Monday before a Tuesday holiday), the model predicts normal weekday consumption, but actual consumption is much lower.
    *   **School Holidays:** The model completely misses the sustained, slightly-higher-than-normal consumption patterns during regional school holiday weeks, which are not official public holidays.
3.  **Business Impact:** While not as catastrophic as the winter failure, these errors reduce trust with suppliers, who need to plan for multi-day events, not just single holidays. Internally, the "smart energy advice" feature gives poor recommendations to residents during these periods.
4.  **Problem Diagnosis:** The ML team realizes that a simple `is_holiday` flag is a naive representation of human behavior. The "holiday effect" is not a single-day event.
    *   For Christmas, the effect is a *period* of lower commercial/industrial demand but potentially different residential patterns, starting before the day itself and lasting until the New Year.
    *   "Bridge" days act like semi-holidays.
    *   School holidays change the daytime occupancy patterns of families.
5.  **Reframing the Feature:** The problem is reframed from "Is this day a holiday?" to "What *type* of day is this from a socio-economic behavior perspective?".
6.  **Solution: Advanced Calendar Features & Custom Holiday Modeling (Iteration):**
    *   **Data Enrichment:** The team works with the product manager to identify and source data for all major Swiss school holiday periods by canton.
    *   **Feature Engineering:** They replace the single `is_holiday_flag` with a richer set of features:
        *   `days_until_next_holiday`: A continuous feature counting down to the next major holiday.
        *   `days_since_last_holiday`: A continuous feature counting up from the last major holiday.
        *   `is_bridge_day`: A binary flag for "bridge" days.
        *   `is_school_holiday`: A binary flag.
        *   `holiday_name`: A categorical feature (e.g., 'Christmas', 'Easter', 'NationalDay').
    *   **Model-Specific Implementation:**
        *   **For Prophet:** They create a custom `holidays` dataframe that includes not just the holiday itself but also the surrounding days with different names (e.g., `Christmas_Eve`, `Christmas_Day`, `Boxing_Day`, `Christmas_Week`). Prophet can learn a separate effect for each of these "holidays".
        *   **For XGBoost:** They add the new engineered features (`days_until...`, `is_bridge_day`, etc.) directly to the feature set.
7.  **Results & Validation:** After retraining the models with these new, richer calendar features, the forecast accuracy around holiday periods improves dramatically. The MAPE for the Christmas week drops from over 25% to around 10%. The models now correctly anticipate the pre-holiday slowdown and the "bridge day" effect.

**Lessons & Retrospective:**

*   **"What were some of the challenges?":** "A key challenge was accurately modeling human behavior around holidays. Our initial approach of using a simple binary holiday flag was too simplistic and failed to capture the complex, multi-day nature of events like Christmas or the subtle effects of school holidays. This led to significant and predictable forecast errors, damaging stakeholder trust."
*   **"If you were to start over...":** "I would collaborate with a product manager or domain expert from the very beginning to build a 'behavioral calendar' instead of just using a standard holiday library. We should have brainstormed all the event types that affect energy consumption—public holidays, school holidays, bridge days, major local events—and designed features to capture them explicitly. It's a lesson in not just using off-the-shelf features but thinking deeply about how to translate real-world context into a format the model can understand."

---

### Challenge 3: The API Latency Crisis - Mismatch Between Batch Model & Real-Time Needs

**Chronological Events:**

1.  **Initial Design:** The inference pipeline is designed as a daily batch process. It runs overnight, generating a 72-hour forecast for all buildings, which is then loaded into an Amazon Timestream database. An API Gateway + Lambda is built to serve these stored forecasts to the B2C mobile app.
2.  **New Feature Request:** The Product team, excited by the forecasts, designs a new "real-time cost optimization" feature for the mobile app. The idea is that a user can see the building's current demand and the next few hours' forecast to decide whether to run their washing machine *now* or in an hour. This requires the API to be fast and reflect the latest data.
3.  **The Latency Problem:** When the feature is prototyped, the UX is poor. The API call to the Lambda function, which then queries Timestream, sometimes takes 2-3 seconds. The main issue is the query itself: to construct a user-friendly chart, the Lambda needs to pull 24-48 hourly data points for a specific building, which can be a moderately heavy query for Timestream when invoked frequently by thousands of users simultaneously.
4.  **Initial Solution - Caching:** The team's first reaction is to add a caching layer. They implement an ElastiCache (Redis) cluster in front of the Timestream database. The Lambda now first checks Redis for the forecast; if it's a miss, it queries Timestream and then populates the cache. This improves latency for repeated requests for the same building but introduces cache invalidation complexity and adds significant infrastructure cost (24/7 Redis cluster).
5.  **The "Stale Forecast" Problem:** A bigger issue arises. The batch forecast is generated only once per day (at 5 AM). If a major, un-forecasted weather event occurs at 2 PM (e.g., a sudden thunderstorm darkens the sky), the solar generation plummets and building consumption spikes. The forecast shown in the app is now completely wrong and won't be updated until the next day. Users complain that the "smart" feature is not very smart.
6.  **Re-evaluating the Architecture:** The team realizes they have an architectural mismatch. They have a **batch inference system** trying to serve a **near real-time use case**. The 24-hour cycle is too slow.
7.  **The Final Solution - A Hybrid "Serve & Refresh" Pattern:**
    *   **Keep the Batch System:** The daily, full 72-hour forecast generated by the complex XGBoost/Prophet model is still valuable for the B2B use case (suppliers) and for setting the daily baseline. It continues to load into Timestream.
    *   **Create a Lightweight "Refresher" Model:** The ML team develops a much simpler, faster model (e.g., a simple Linear Regression or a very lightweight Prophet model). Its only job is to provide a *short-term correction* to the main forecast based on the *most recent* (e.g., last 1-2 hours) consumption data and updated near-term weather forecasts.
    *   **New "Refresh" Pipeline:** They create a lightweight, serverless pipeline (e.g., an EventBridge rule triggering a Lambda function every 15-30 minutes). This Lambda:
        1.  Fetches the last hour of actual consumption.
        2.  Calculates the recent forecast error (Actual - Baseline Forecast).
        3.  Uses the simple "refresher" model to predict the next 1-3 hours' correction.
        4.  Writes this *updated* short-term forecast (Baseline + Correction) to a **different, low-latency storage: DynamoDB**, which is optimized for fast key-value lookups.
    *   **Update the API:** The B2C API Lambda is changed. It now queries DynamoDB first to get the latest, frequently refreshed forecast for the next few hours. For the longer-term forecast (e.g., hours 4-24), it falls back to querying Timestream (or the Redis cache).

8.  **Result:** The user-facing feature becomes much more responsive and accurate. API latency for the critical next-few-hours forecast drops to <100ms. The system can now react to intra-day deviations from the baseline forecast. This hybrid architecture successfully serves both the long-term B2B planning needs and the short-term B2C real-time needs without a complete, costly overhaul to a fully real-time inference system.

**Lessons & Retrospective:**

*   **"Production bugs that made you regret decisions?":** "My regret was not clarifying the specific latency and freshness requirements for *all* potential use cases at the beginning. We designed a perfect batch system, but the business wanted a real-time feature. This led to a series of costly patches (like adding ElastiCache) before we finally addressed the core architectural mismatch. We tried to solve a data freshness problem with a caching solution, which was the wrong approach."
*   **"What would you change?":** "I would have a dedicated discussion about the 'Time-to-Live' and 'Time-to-Action' for our forecasts. For the B2B use case, a 24-hour TTL is fine. For the B2C feature, the TTL was less than an hour. Recognizing this difference upfront would have led us to design the hybrid 'Serve & Refresh' architecture from the start, saving us the time and expense of the intermediate caching solution and avoiding stakeholder frustration."



### Deep Dive: The "New Commissioning" Cold Start Challenge

**The Core Problem:**

The most effective models developed (both for Anomaly Detection and Forecasting) are data-hungry. They rely on a sufficient history of consumption data for a specific building or apartment to learn its unique "normal" patterns, including its thermal response to weather, seasonal cycles, and typical resident behavior. A newly commissioned building has no such history. This creates a high-stakes paradox: the period when predictive monitoring is *most valuable* (identifying early-life failures, incorrect installations, or commissioning errors) is precisely when the primary data-driven models are at their *weakest*.

**Related Challenges Stemming from the Cold Start Problem:**

1.  **Inability to Establish a Baseline:**
    *   **Anomaly Detection:** Models like LOF, Isolation Forest, and forecasting-based methods (Prophet, XGBoost) have no concept of a "normal" baseline for the new building. Any initial behavior could be misinterpreted. A low-consumption building might be flagged as anomalous when compared to the global average, even if its behavior is perfectly normal for its high-efficiency design.
    *   **Forecasting:** Models cannot learn the building's specific thermal inertia, response to solar gain, or the typical daily/weekly rhythm of its residents. Forecasts will be highly inaccurate.

2.  **High Rate of "False Alarms":**
    *   **Initial Occupancy Flux:** In the first few weeks or months, apartments are gradually occupied. The building's aggregate consumption pattern is unstable and constantly changing as more residents move in. A model trying to find a stable pattern will constantly be "surprised," leading to a storm of false positive anomalies.
    *   **System "Burn-in":** The heating and ventilation systems themselves might be undergoing initial calibration or "burn-in," exhibiting patterns that will not be present later in its operational life. An ML model will flag these transient but normal behaviors as anomalous.

3.  **Risk of Masking True Anomalies:**
    *   The high noise and instability of the initial data can mask a true, critical anomaly. If everything looks anomalous, then nothing stands out. A genuinely faulty valve causing a leak might be lost in the noise of alerts generated by residents moving in and adjusting their thermostats for the first time.

4.  **Ineffective Transfer of Global Knowledge:**
    *   As we saw in the "Multi-Building Dilemma" challenge, a single global model performs poorly on buildings that deviate from the average. Simply applying a global model to a new building is a recipe for failure, especially if the new building is of a different archetype (e.g., a new high-efficiency design).

---

### Potential Solutions: A Tiered, Multi-faceted Approach

A robust solution to the cold start problem is not a single model but a **graceful, evolving strategy** that provides the best possible insight at each stage of data availability.

**Tier 1: The Zero-Data & Commissioning Phase (First ~4 Weeks)**

At this stage, we have no historical consumption data. The focus is on physics-based and rule-based checks.

*   **Solution: Physics-Informed Heuristics & Commissioning Rules:**
    *   **How it Works:** Instead of relying on learned patterns, we use simple, engineering-driven rules based on the physical constraints of the system. This is a form of expert system.
    *   **Implementation:** A separate, simpler rules engine (which could be a Lambda function or a specific configuration for our existing models) would check for violations of "common sense" heating logic.
    *   **Example Rules for Anomaly Detection:**
        *   **"Stuck Valve" Rule:** If `heating_kwh > 0` for an apartment for `X` consecutive hours while `room_temp_c > setpoint_temp_c + 2°C`, flag a high-priority alert. This suggests the valve is stuck open.
        *   **"No Response" Rule:** If `setpoint_temp_c > room_temp_c + 2°C` and `heating_kwh > 0` for `Y` consecutive hours, but `room_temp_c` does not increase, flag an alert. This suggests a blockage or failure to deliver heat.
        *   **"Sensor Mismatch" Rule:** If `room_temp_c` for one apartment is drastically different (>5°C) from all its neighbors in the same building for a prolonged period, flag a potential sensor failure.
    *   **Forecasting:** No complex forecasting is possible. The "forecast" could simply be a static profile based on the building's design specifications, adjusted by the real-time weather forecast. This is more of a "plan" than a learned forecast.

**Tier 2: The Scant-Data Phase (Weeks 4 to ~6 Months) - Bayesian & Archetype Models**

We now have some data, but not enough for robust, individualized models. The goal is to combine this limited local data with knowledge from existing, similar buildings.

*   **Solution: Bayesian Priors & Transfer Learning from Archetypes:**
    *   **How it Works (Bayesian Intuition):** A Bayesian approach starts with a "prior belief" about how a system should behave and updates this belief as it sees new data. Our "prior belief" can be derived from data from older, similar buildings.
        *   **Anomaly Detection:** Instead of a simple regression (`Energy = B * HDD`), we use a Bayesian Linear Regression. The *prior* for the coefficient `B` (the building's sensitivity to weather) is not a single value but a *distribution* (e.g., a normal distribution) whose mean and variance are calculated from all existing "Modern High-Density" buildings. As we collect the first few weeks of data for the new building, the model updates this distribution to find a "posterior" `B` that is a sensible compromise between the archetype average and the new building's own (limited) data. An anomaly is a point that is unlikely given this posterior model.
        *   **Forecasting:** Similarly, a Bayesian forecasting model (like Prophet, which has a Bayesian backend) can be initialized with stronger priors for seasonality and trend parameters, where these priors are derived from the average parameters of the building's archetype.
    *   **How it Works (Simple Transfer Learning):**
        *   **Anomaly Detection/Forecasting:** Train a model (e.g., XGBoost) on all data from a specific building archetype (e.g., "High-Efficiency"). Use this pre-trained model to generate initial predictions for the new building. As more data comes in from the new building, this model can be fine-tuned using the new data, or we can slowly blend its predictions with a new model trained only on the new building's data.
    *   **Implementation:**
        *   Requires a robust system for **classifying buildings into archetypes** based on metadata (age, size, insulation, heating system type). This becomes a critical data governance task.
        *   The MLOps pipeline needs to be able to select these "archetype models" or "Bayesian priors" for any building that is less than `N` months old.

**Tier 3: The Mature Data Phase (6+ Months)**

The building now has sufficient historical data to stand on its own.

*   **Solution: Transition to Fully Individualized Models:**
    *   **How it Works:** The system automatically transitions from using the archetype/Bayesian model to a model trained specifically on that building's (or its apartments') own data.
    *   **Implementation:**
        *   The model training pipeline (e.g., `ADTrainingWorkflow`) is triggered for this specific building once it crosses the data threshold (e.g., 6 months of data).
        *   The inference pipeline's model selection logic (`GetApprovedModelPackage` and the subsequent steps) is updated to now look for a dedicated model for this building. If one exists and is approved, it uses it; otherwise, it falls back to the Tier 2 archetype model.
        *   This creates a seamless handoff from the cold-start solution to the mature-phase solution.

**Summary of the Evolving Strategy:**

| Data Availability | Primary Approach | Models / Techniques | Key Requirement |
| :--- | :--- | :--- | :--- |
| **0-4 Weeks** | Physics-Informed Rules | Heuristics, simple thresholds, sensor cross-validation. | Well-defined engineering rules. |
| **1-6 Months** | Transfer Learning / Bayesian Priors | Archetype-based models (XGBoost, Prophet), Bayesian Regression with priors from archetypes. | Accurate building metadata and a robust archetype classification system. |
| **6+ Months** | Individualized Modeling | Fully trained models (XGBoost, Prophet, etc.) using only the building's/apartment's own historical data. | Automated trigger to graduate a building from the cold-start strategy to the mature strategy. |

This tiered approach directly addresses the high-stakes nature of new buildings by providing the best possible analysis at each stage, gracefully improving as more data becomes available, and managing stakeholder expectations by acknowledging the initial limitations of a purely data-driven approach.

___

**The Source of Confusion:**

*   In the "Multi-Building Dilemma" challenge, we concluded that a single global model was bad and the best solution was **Models per Building Archetype**.
*   In the "Cold Start Challenge," we concluded that after 6+ months, the best solution was **Individualized Models** (i.e., one model per building/apartment).

This seems like a contradiction. Here’s how they fit together in a single, coherent lifecycle.


### Clarified Hybrid Model Strategy (for both AD and EDF)

The system does not use just one strategy; it uses a **three-stage lifecycle for modeling**, where each building/apartment automatically "graduates" to the next stage as it accumulates enough data.

**Stage 1: Heuristics-Only (e.g., Age < 1 Month)**

*   **Model Used:** **No ML model.** Only the physics-informed rules engine is active.
*   **Applies to:** Brand new buildings with virtually no stable data.
*   **Rationale:** At this stage, any learned pattern is meaningless. We rely on deterministic, engineering-based rules to catch gross failures (e.g., "valve stuck open," "sensor reading is physically impossible"). This provides a basic safety net.

**Stage 2: Archetype Model (e.g., Age 1-6 Months)**

*   **Model Used:** **One model per Building Archetype.**
*   **Applies to:** Buildings with some data, but not enough to capture their unique seasonal patterns or long-term behavior reliably. This is the **primary cold-start solution**.
*   **Rationale:** The building's limited data is not used for *training*, but for *inference*. We use a robust model pre-trained on a large dataset from similar, older buildings (the "archetype"). This provides a reasonably accurate "prior belief" or "best guess" for how this new building *should* behave based on its type. It's vastly superior to a global model and the only viable ML approach when historical data is scant.

**Stage 3: Individualized Model (e.g., Age > 6 Months)**

*   **Model Used:** **One model per Building/Apartment.**
*   **Applies to:** Buildings with sufficient historical data (e.g., 6+ months, ideally including a full heating season).
*   **Rationale:** Once a building has enough of its own history, a model trained *specifically on its own data* will almost always be more accurate than a general archetype model. It can learn the unique thermal properties, specific solar gain profile, and the distinct rhythm of its residents. This is the mature, steady-state, and most accurate phase.

---

**How This Resolves the Contradiction:**

*   The conclusion of the **"Multi-Building Dilemma"** (use archetype models) is our primary strategy for **Stage 2 (the cold-start phase)**.
*   The conclusion of the **"Cold Start Challenge"** (use individualized models) is our strategy for **Stage 3 (the mature phase)**.

The overall strategy is **NOT** to choose just one of these forever, but to have an **automated system that graduates a building from Stage 1 to Stage 2 to Stage 3 over time.**

**Is this the same for both Anomaly Detection and Energy Demand Forecasting?**

**Yes, absolutely.** This three-stage lifecycle applies equally well to both use cases because both suffer from the exact same cold-start problem.

*   **AD Inference:** To detect an anomaly in a 3-month-old building, the inference pipeline would fetch the **"Archetype Model"** for that building's type from the Model Registry.
*   **EDF Inference:** To forecast demand for a 3-month-old building, the inference pipeline would fetch the **"Archetype Forecast Model"** for that building's type.
*   **AD/EDF Training:** The training pipelines are triggered differently. An **"Archetype Model"** is retrained periodically (e.g., monthly) using data from *all mature buildings within that archetype*. An **"Individualized Model"** is trained for a specific building only after it has accumulated enough data (e.g., the first training run is triggered at month 6).

**Implementation in the MLOps Pipeline:**

This strategy requires a key piece of logic in the **Inference Pipeline**, specifically in the model selection phase:

1.  **Input:** The inference workflow starts, knowing the `building_id`.
2.  **Metadata Lookup:** The first step is to query a metadata source (e.g., the Topology database) to get the `commissioning_date` and `archetype` for the given `building_id`.
3.  **Calculate Age:** `age = today - commissioning_date`.
4.  **Conditional Logic (Model Selection):**
    *   `if age < 1 month`: Route to a simple rules engine (or do nothing).
    *   `else if age >= 1 month AND age < 6 months`: The `GetApprovedModelPackage` Lambda is called with parameters to find the latest approved model for that specific **archetype**.
    *   `else (age >= 6 months)`: The `GetApprovedModelPackage` Lambda is called with parameters to find the latest approved model for that specific **`building_id`**. If no dedicated model exists yet (because its first training run hasn't completed), it falls back to the archetype model.

This provides a clear, consistent, and robust strategy that handles the entire lifecycle of a building from commissioning to maturity for both ML use cases. I hope this resolves the confusion

-->



### Troubleshooting Guide

1.  **SFN Failures:** Check execution history for failed state, input/output, error message.
2.  **Job Failures (Processing/Training):** Check CloudWatch Logs for the specific job run. Look for Python errors, resource exhaustion, S3 access issues.
3.  **Lambda Failures:** Check CloudWatch Logs. Verify IAM permissions, input payload structure, environment variables, timeouts, memory limits. Check DLQ if configured.
4.  **Forecast Accuracy Issues:**
    *   Verify quality/availability of input weather forecasts.
    *   Check feature engineering logic for errors or skew vs. training.
    *   Analyze residuals from the model evaluation step.
    *   Check if model drift has occurred (compare recent performance to registry metrics). Trigger retraining if needed.
    *   Ensure correct model version was loaded by inference pipeline.
5.  **Data Loading Issues (Timestream/RDS):** Check `LoadForecastsToDB` Lambda logs for database connection errors, write throttling, data type mismatches, constraint violations. Check DB metrics.
6.  **API Serving Issues:** Check API Gateway logs and metrics. Check serving Lambda logs. Verify DB connectivity and query performance.

### Security Considerations

*   Apply IAM least privilege to all roles.
*   Encrypt data at rest (S3, Timestream/RDS, EBS) and in transit (TLS).
*   Use Secrets Manager for any API keys (e.g., weather provider).
*   Secure API Gateway endpoints (Authentication - Cognito/IAM/API Keys, Authorization, Throttling).
*   Perform regular vulnerability scans on the EDF container image.
*   Consider VPC deployment and endpoints for enhanced network security.

### Roadmap & Future Enhancements

*   Implement probabilistic forecasting (prediction intervals).
*   Incorporate more granular data (e.g., appliance recognition, improved occupancy detection) if available.
*   Explore more advanced forecasting models (LSTM, TFT) and benchmark rigorously.
*   Implement automated retraining triggers based on monitored forecast accuracy drift.
*   Develop more sophisticated XAI for forecasting (feature importance).
*   Add A/B testing framework for forecast models.
*   Integrate forecasts with building control systems (e.g., HVAC pre-cooling based on forecast).


### Appendices

#### Configuration File Example

```yaml
# config/.yaml

# --- General Settings ---
project_name: "ml"
aws_region: "eu-central-1"
# env_suffix will likely be passed dynamically or set per deployment environment

# --- Data Paths (Templates - Execution specific paths often constructed) ---
# Base paths defined here, execution IDs/dates appended by scripts/workflows
s3_processed_edf_path: "s3://{processed_bucket}/processed_edf_data/"
s3_raw_weather_fcst_path: "s3://{raw_bucket}/edf-inputs/weather-forecast/"
s3_raw_calendar_path: "s3://{raw_bucket}/edf-inputs/calendar-topology/"
s3_feature_output_base: "s3://{processed_bucket}/features/edf/{workflow_type}/{sfn_name}/{exec_id}/" # workflow_type=training/inference
s3_model_artifact_base: "s3://{processed_bucket}/model-artifacts/{sfn_name}/{exec_id}/"
s3_eval_report_base: "s3://{processed_bucket}/evaluation-output/{sfn_name}/{exec_id}/"
s3_forecast_output_base: "s3://{processed_bucket}/forecast-output/{sfn_name}/{exec_id}/"

# --- AWS Resource Names (Base names - suffix added in Terraform locals) ---
scripts_bucket_base: "ml-glue-scripts" # Base name for script bucket
processed_bucket_base: "ml-processed-data" # Base name for processed bucket
raw_bucket_base: "ml-raw-data" # Base name for raw bucket
edf_feature_group_name_base: "edf-building-features"
ecr_repo_name_edf_base: "edf-training-container"
edf_model_package_group_name_base: "EDFBuildingDemandForecaster"
lambda_register_edf_func_base: "RegisterEDFModelFunction"
lambda_load_forecasts_func_base: "LoadEDFResultsLambda"
lambda_get_model_func_base: "GetApprovedModelLambda" # Shared Lambda
lambda_create_sm_model_func_base: "CreateSageMakerModelLambda" # Shared Lambda
edf_training_sfn_base: "EDFTrainingWorkflow"
edf_inference_sfn_base: "EDFInferenceWorkflow"
edf_scheduler_base: "DailyEDFInferenceTrigger"
forecast_db_base: "EDFDatabase" # Timestream DB base name
forecast_table_name: "BuildingDemandForecasts" # Timestream table name

# --- Feature Engineering (Common & EDF Specific) ---
common_feature_eng:
  lookback_days_default: 14 # Default days history needed

edf_feature_eng:
  target_column: "consumption_kwh"
  timestamp_column: "timestamp_hour"
  building_id_column: "building_id"
  time_features: # Features derived from timestamp
    - "hour_of_day"
    - "day_of_week"
    - "day_of_month"
    - "month_of_year"
    - "is_weekend" # Example custom flag
  lag_features: # Lag values in hours
    consumption_kwh: [24, 48, 168] # 1d, 2d, 1wk
    temperature_c: [24, 48, 168]
    solar_irradiance_ghi: [24]
  rolling_window_features: # Window size in hours, aggregations
    consumption_kwh:
      windows: [3, 24, 168]
      aggs: ["avg", "stddev", "min", "max"]
    temperature_c:
      windows: [24]
      aggs: ["avg"]
  imputation_value: 0.0 # Value used for fillna after lags/windows

# --- Training Workflow ---
edf_training:
  default_strategy: "Prophet" # Model strategy to use if not specified
  instance_type: "ml.m5.xlarge" # Larger instance for potentially heavier training
  instance_count: 1
  max_runtime_seconds: 7200 # 2 hours
  # Base hyperparameters (can be overridden by execution input)
  hyperparameters:
    Prophet:
      prophet_changepoint_prior_scale: 0.05
      prophet_seasonality_prior_scale: 10.0
      prophet_holidays_prior_scale: 10.0
      prophet_daily_seasonality: True
      prophet_weekly_seasonality: True
      prophet_yearly_seasonality: 'auto'
      # prophet_regressors: ["temperature_c", "is_holiday_flag"] # Example if using regressors
    XGBoost:
      xgb_eta: 0.1
      xgb_max_depth: 5
      xgb_num_boost_round: 150
      xgb_subsample: 0.7
      xgb_colsample_bytree: 0.7
      # feature_columns must align with feature_engineering output for XGBoost
      feature_columns_string: "temperature_c,solar_irradiance_ghi,humidity,is_holiday_flag,hour_of_day,day_of_week,day_of_month,month_of_year,consumption_lag_24h,consumption_lag_168h,consumption_roll_avg_24h"

# --- Evaluation Workflow ---
edf_evaluation:
  instance_type: "ml.m5.large"
  instance_count: 1
  # Metrics thresholds for the 'CheckEvaluation' choice state
  metrics_thresholds:
    max_mape: 20.0 # Example: Fail if MAPE > 20%
    max_rmse: 5.0  # Example: Fail if RMSE > 5 kWh (adjust based on typical consumption)
  # Optional: Path to historical labelled data for backtesting
  # historical_labels_path: "s3://..."

# --- Inference Workflow ---
edf_inference:
  scheduler_expression: "cron(0 5 * * ? *)" # 5 AM UTC Daily
  scheduler_timezone: "UTC"
  forecast_horizon_hours: 72
  # Processing job instance types (can override training defaults if needed)
  feature_eng_instance_type: "ml.m5.large"
  feature_eng_instance_count: 1
  forecast_gen_instance_type: "ml.m5.large" # Needs forecasting libs installed
  forecast_gen_instance_count: 1
  # Target DB Config
  forecast_db_type: "TIMESTREAM" # TIMESTREAM | RDS | DYNAMODB
  # Lambda Config
  load_forecasts_lambda_memory: 512 # MB
  load_forecasts_lambda_timeout: 300 # seconds

# --- Common Lambda Config ---
# Assuming shared Lambdas from AD are used
lambda_shared:
   get_model_memory: 128
   get_model_timeout: 30
   create_sm_model_memory: 128
   create_sm_model_timeout: 60
```

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