# Customer Lifetime Value

## How I Built a Customer Lifetime Value Model for an E-commerce Business

---

### **TLDR: Building a Production-Grade CLV Prediction System**

This project details the end-to-end design and implementation of an automated MLOps system to predict Customer Lifetime Value (CLV) for a mid-sized e-commerce business.

#### **Challenge**

Our e-commerce business struggled to move beyond reactive marketing. We lacked a forward-looking way to identify high-value customers, leading to inefficient ad spend, generic campaigns, and missed retention opportunities. The core challenge was to build a system that could accurately predict future customer value, enabling a fundamental shift to data-driven, proactive personalization and budget allocation.

#### **My Role & Solution**

As the **ML Engineer and Data Scientist** on a lean, three-person team (alongside a Product Manager and Data Engineer), I owned the design and implementation of the complete end-to-end MLOps system on AWS.

My solution involved architecting a series of automated, event-driven pipelines:
*   **Data & Feature Engineering:** I built robust data ingestion and validation pipelines using **AWS Glue** and **Great Expectations**, and a scalable feature engineering pipeline with **Spark on EMR** to generate rich, time-aware customer features for the model.
*   **Model Development & Training:** I developed and iterated on the core **XGBoost** prediction model, established experiment tracking with **MLflow**, and designed the automated training and evaluation pipeline using **SageMaker Pipelines**. This included conditional model registration based on performance, fairness, and robustness checks.
*   **Deployment & Operations:** I then built the weekly **batch inference pipeline** using SageMaker Batch Transform and established a full-circle monitoring and observability stack with **CloudWatch** and **SHAP** for explainability to track data drift and model performance.
*   **Continual Learning & Testing:** Finally, I designed the continual learning framework with automated retraining triggers and a phased production testing strategy (**Shadow Deployment** and **Canary Releases**) to ensure the model evolves safely and effectively over time.

**Tech Stack:** AWS (SageMaker, S3, Glue, EMR, Kinesis, MWAA), Airflow, MLflow, DVC, Great Expectations, Spark, XGBoost, Terraform.

#### **Impact**

The system provided a significant, measurable lift by enabling proactive, data-informed marketing strategies. It moved our ML operations from a quarterly manual effort to a fully automated weekly cycle.

*   **+18% Marketing ROI** by focusing ad spend and promotions on predicted high-value customer segments.
*   **-12% Churn Rate** in top-tier customer cohorts due to targeted, proactive retention campaigns.
*   **+7% Conversion Rate** on marketing campaigns that used the CLV-based segments.
*   **95% Reduction in Manual Effort** by fully automating the model lifecycle from data ingestion to retraining and deployment.

#### **System Architecture**

The diagram below illustrates the complete MLOps system. The components within the highlighted area represent the core systems I personally designed and built.

<img src="../_static/past_experiences/ecom_cltv/contributions.svg" style="background-color: #FCF1EF;"/>




### The Business Challenge: Moving from Hindsight to Foresight

The core challenge was to move beyond simple historical metrics and accurately predict the future **Customer Lifetime Value (CLV)**. We needed to transition from merely looking at past revenue to forecasting future profitability, enabling us to make smarter, data-driven decisions.

This initiative was driven by the need to answer critical business questions:

*   **Optimized Customer Acquisition:** How much should we strategically invest to acquire a new customer? Where can we find more prospects who resemble our current high-value customers?
*   **Personalized Retention:** Which of our high-value customers are at risk of churning? How can we proactively and efficiently tailor retention efforts to keep them engaged?
*   **Smarter Budget Allocation:** How should we allocate marketing spend, discounts, and promotions across different customer segments to maximize long-term return on investment (ROI)?

The financial stakes were clear and compelling. Industry benchmarks show that:
*   A **5% increase** in customer retention can boost profitability by **25-95%**.
*   It costs **5 times more** to acquire a new customer than to retain an existing one.
*   The probability of selling to an existing customer is **60-70%**, compared to just **5-20%** for a new prospect.

The objective was to build a system that could reliably identify our most valuable customers—both existing and future—and empower the business to focus resources where they would generate the greatest impact.

***

### Problem Framing: Translating Business Needs into a Technical Blueprint

With a clear business objective, the next critical step is to translate that goal into a precise, solvable machine learning problem. This framing process dictates our data requirements, model choice, and ultimately, how the final output can be actioned by the business.

#### Is Machine Learning the Right Approach?

Before committing to a complex ML system, we first validated if it was necessary. While a simple heuristic like `(Average Order Value) x (Average Customer Lifespan)` provides a basic CLV estimate, it suffers from critical flaws:
*   It treats all customers as a single, homogenous group, failing to capture individual behavior.
*   It cannot identify high-value customers at risk or differentiate between promising new users and those likely to make only a single purchase.

ML is the ideal approach here because:
*   **Complex Patterns:** Customer purchasing and churn behavior is driven by intricate, non-linear patterns that are difficult to define with simple rules.
*   **Predictive Nature:** The core task is forecasting future behavior, which is a strength of ML.
*   **Scale and Adaptation:** ML can process data for millions of customers and can be retrained to adapt to evolving market trends and customer habits.

#### Defining the Core ML Task: From Business Goals to a Predictive Model

We framed this challenge primarily as a **regression problem**. This was a strategic choice to provide the most direct and actionable output for our business stakeholders.

*   **Model Input:** A rich set of features for each customer, calculated up to a specific "cutoff date" (e.g., today). This includes:
    *   **RFM Features:** Recency, Frequency, and Monetary value.
    *   **Purchase Pattern Features:** Average time between orders, product diversity, return rates.
    *   **Temporal Features:** Spend and activity aggregated over rolling time windows (e.g., last 30, 90, 365 days).
    *   **Engagement Features:** Non-transactional data like website visits, session duration, and email click-through rates.

*   **Model Output:** A continuous numerical value representing the **predicted total revenue a customer will generate in the next 12 months.**

While regression was our primary task, we recognized its sensitivity to outliers (a few "whale" customers). Therefore, we also designed the system to support a secondary **classification** output, bucketing customers into 'Low', 'Medium', and 'High' value tiers. This provides an intuitive and robust output for marketing segmentation, complementing the precise financial forecast from the regression model.

#### Assessing Feasibility & Risks (Can We Execute This Vision?)

Before committing to development, we conducted a rigorous feasibility assessment to identify potential risks and ensure the project was grounded in reality.

*   **Data Feasibility:**
    *   **Availability:** While core transactional data was abundant, integrating it with often sparse or inconsistent CRM and web behavioral data posed a significant data engineering challenge.
    *   **Quality & Privacy:** We identified a need for robust data cleaning and validation pipelines. Handling Personally Identifiable Information (PII) under regulations like GDPR was a top priority, requiring careful data anonymization and governance.

*   **Modeling & Technical Feasibility:**
    *   **Problem Complexity:** The core challenge was not the algorithm itself, but modeling the dynamic, non-stationary nature of customer behavior (i.e., concept drift). Customer tastes and spending habits change over time.
    *   **Latency Requirements:** Our primary use case (batch scoring for marketing campaigns) had relaxed latency needs. However, we acknowledged that a future real-time personalization use case would require building a more complex low-latency serving infrastructure and an online feature store.
    *   **Interpretability:** Gaining business trust was paramount. "Black box" predictions were unacceptable, making model explainability (e.g., using SHAP) a mandatory requirement to understand *why* a customer was flagged as high-value.

*   **Business & Operational Risks:**
    *   **Cost of Errors:** The model's predictions have a direct financial impact. Over-predicting CLV leads to wasted marketing spend, while under-predicting results in missed revenue opportunities from high-potential customers.
    *   **Ethical Considerations:** We identified a risk of creating negative feedback loops. If the model were biased against a certain customer segment, we might under-invest in them, reinforcing the initial bias. This required a commitment to continuous fairness monitoring.
    *   **ROI Justification:** The project required a significant upfront investment in data engineering and MLOps. However, the potential ROI—driven by more efficient marketing, improved retention, and higher long-term profitability—was substantial and clearly justified the investment.


#### Defining Success: From Technical Metrics to Business Impact

A model can be technically "correct" but fail to deliver business value. Therefore, we defined two distinct sets of success criteria:

1.  **Model Evaluation Metrics (Offline):** These are technical metrics used to assess the model's performance on a held-out test dataset.
    *   **Primary Metrics:** For our regression task, we used standard metrics like **Root Mean Squared Error (RMSE)** and **Mean Absolute Error (MAE)**.
    *   **Business-Oriented Metric:** Critically, we also used the **Gini Coefficient** and plotted the **Lorenz Curve**. This measures the model's ability to accurately *rank* customers from least to most valuable, which is essential for targeting the top percentile of customers.
    *   **Fairness Check:** We evaluated performance across key customer segments (e.g., by acquisition channel, geography) to ensure the model wasn't unfairly penalizing or misjudging a specific group.

2.  **Business Success Metrics (Online):** These are the real-world KPIs we aimed to influence after deploying the model.
    *   Increase ROI on marketing spend by targeting high-CLV prospects.
    *   Reduce churn rate among customers predicted to be high-value.
    *   Increase average order value and purchase frequency through personalized upselling campaigns aimed at specific CLV tiers.

This dual-metric approach ensures our technical work remains directly tethered to tangible business outcomes.

***

### MLOps End-to-End Project Planning and Operational Strategy

A successful machine learning project is built on a foundation of solid engineering and operational planning. It's not enough to build an accurate model; we must build a *reliable system* that can consistently deliver value. This section outlines the technical architecture, core workflows, and project management strategy for bringing the CLV prediction model to production.

#### Tech Stack

The technology stack was chosen to balance the power of best-in-class open-source tools with the scalability and manageability of a leading cloud provider (AWS). The primary goal was to create a robust, automated, and repeatable system.

| Component | Chosen Tool/Framework | Rationale & Key Trade-offs |
| :--- | :--- | :--- |
| **Cloud Platform** | Amazon Web Services (AWS) | A mature and comprehensive ecosystem of managed services for data and ML, allowing the team to focus on business logic rather than undifferentiated infrastructure management. |
| **Data Lake & Storage** | Amazon S3 & Parquet | S3 provides virtually limitless, cost-effective, and durable object storage. Storing data in the open-source Parquet format ensures high performance and interoperability. |
| **Data Versioning** | DVC (Data Version Control) | While Git is excellent for code, it's not designed for large data files. DVC integrates with Git to provide versioning for datasets, making our data pipelines fully reproducible. |
| **Workflow Orchestration** | Apache Airflow (on AWS MWAA) | The industry standard for orchestrating complex, dependency-aware workflows. While it has a learning curve, its power and flexibility are unmatched for managing our multi-step data and ML pipelines. AWS MWAA provides a managed service offering. |
| **Data Processing** | Apache Spark (on AWS EMR) | The de facto standard for large-scale, distributed data transformation. Essential for efficiently computing customer-level RFM features and other aggregations across the entire dataset. |
| **Feature Store** | Amazon SageMaker Feature Store | Chosen to solve the critical challenge of training-serving skew. It provides a central, governed repository for features, ensuring consistency between our training and inference pipelines and promoting feature reusability across future projects. |
| **Experiment Tracking** | MLflow Tracking | A powerful open-source tool for logging and comparing all aspects of ML experiments (parameters, metrics, artifacts). It fosters a rigorous, scientific approach to model development. |
| **Model Registry** | MLflow Model Registry | Provides a central, version-controlled repository for our trained model artifacts. It's the critical hand-off point between model training and deployment, enabling robust governance and auditability. |
| **CI/CD Automation** | GitHub Actions | A modern, flexible CI/CD tool that integrates seamlessly with our source code repository on GitHub, allowing us to automate testing and deployment workflows. |
| **Infrastructure as Code** | Terraform | The cloud-agnostic standard for defining and managing infrastructure programmatically. This ensures our environments are reproducible, version-controlled, and can be easily provisioned or torn down. |
| **Model Deployment** | Amazon SageMaker Batch Transform | For our primary use case (weekly scoring of the customer base), batch inference is the most cost-effective and operationally simple deployment pattern. SageMaker provides a fully managed solution. |
| **Monitoring** | Amazon SageMaker Model Monitor & CloudWatch | SageMaker Model Monitor provides built-in capabilities to detect data and model quality drift. CloudWatch is used for monitoring the health and performance of all underlying AWS infrastructure. |

#### List of Core Pipelines/Workflows

The entire MLOps system is composed of several distinct, automated pipelines, orchestrated by Airflow.

1.  **Data Ingestion & Validation Pipeline**
    *   **Trigger:** Daily scheduled run.
    *   **Inputs:** Connection details for source transactional databases and CRM systems.
    *   **Key Steps:**
        1.  Extract raw transactional and customer data from source systems.
        2.  Validate incoming data against a predefined schema and quality rules (using libraries like Great Expectations).
        3.  Land the validated, raw data in the S3 Data Lake.
        4.  Update the data catalog and trigger the Feature Engineering Pipeline.
    *   **Outputs:** Versioned, validated raw data in S3.

2.  **Feature Engineering Pipeline**
    *   **Trigger:** Successful completion of the Data Ingestion Pipeline.
    *   **Inputs:** Raw customer and transaction data from the S3 Data Lake.
    *   **Key Steps:**
        1.  Launch a Spark job (on EMR) to perform customer-level aggregations.
        2.  Calculate RFM features, rolling time-window features, and other behavioral signals.
        3.  Populate (or update) the SageMaker Feature Store with the newly computed features.
    *   **Outputs:** Updated and versioned features in the offline and online feature stores.

3.  **Model Training, Evaluation & Registration Pipeline**
    *   **Trigger:** Weekly scheduled run or on-demand by an ML engineer.
    *   **Inputs:** Features from the SageMaker Feature Store, model training configuration.
    *   **Key Steps:**
        1.  Create a temporally correct training/test data split.
        2.  Train the CLV model (XGBoost) using the training data.
        3.  Evaluate the model on the test set using both technical (RMSE, MAE) and business-aligned (Gini Coefficient) metrics.
        4.  Compare the new model's performance to the currently deployed production model.
        5.  If performance exceeds the threshold, register the new model version in the MLflow Model Registry with its associated metrics and artifacts.
    *   **Outputs:** A newly registered model in MLflow, ready for deployment.

4.  **Batch Inference Pipeline**
    *   **Trigger:** Weekly scheduled run, following the successful completion of the training pipeline.
    *   **Inputs:** The latest "approved for production" model from the MLflow Registry and a list of all active customers.
    *   **Key Steps:**
        1.  Initiate a SageMaker Batch Transform job.
        2.  For each customer, retrieve the latest features from the SageMaker Feature Store.
        3.  Generate a 12-month CLV prediction.
        4.  Load the predictions into the downstream data warehouse and CRM system for use by business teams.
    *   **Outputs:** Updated CLV scores for every customer in the business intelligence and marketing platforms.

#### Project Management and Stages

We adopted an iterative, phased approach to manage the project, ensuring we built a solid foundation before adding complexity.

1.  **Ideation & Planning (Weeks 1-2)**
    *   Align with business stakeholders on the primary goals and define success metrics.
    *   Conduct the Problem Framing and Feasibility assessment.
    *   Define the MLOps tech stack and high-level architecture.
    *   Establish the cross-functional team and define roles.

2.  **Model Experimentation & Baseline (Weeks 3-6)**
    *   Perform deep Exploratory Data Analysis (EDA) on the integrated dataset.
    *   Engineer an initial set of robust RFM features.
    *   Develop a simple baseline model (e.g., Linear Regression) to establish a performance floor.
    *   Experiment with more advanced models (XGBoost) and track all runs in MLflow.
    *   Conduct rigorous offline evaluation to select the champion model architecture. 

3.  **End-to-End Pipeline Development (Weeks 7-12)**
    *   Develop the four core automated pipelines (Ingestion, Feature Engineering, Training, Batch Inference) as code.
    *   Write Infrastructure as Code (Terraform) to provision the required AWS resources.
    *   Implement robust unit and integration tests for all pipeline components.
    *   Set up CI/CD workflows in GitHub Actions.

4.  **Deployment & Serving (Week 13)**
    *   Deploy the production environment using Terraform.
    *   Execute the first full run of the Batch Inference Pipeline in a staging environment.
    *   Validate the output and, upon approval, promote to production.
    *   Integrate the output CLV scores with downstream CRM and BI dashboards.

5.  **Monitoring & Iteration (Ongoing)**
    *   Establish monitoring dashboards for infrastructure health and data/model drift.
    *   Set up automated alerts for any detected anomalies.
    *   Establish a formal A/B testing framework to evaluate the business impact of future model versions.
    *   Schedule periodic reviews of model performance and plan for retraining and future iterations.

#### Cross-Functional Team & Roles

*   **ML Engineer:** Led the overall technical design, developed the core ML pipelines, and implemented the CI/CD and monitoring systems.
*   **Data Engineer:** Focused on building the robust data ingestion and validation pipelines from source systems and owned the data model in the lake.
*   **Business Analyst/Product Manager:** Acted as the crucial link to business stakeholders, defining requirements, interpreting model outputs, and designing how the CLV scores would be used in marketing campaigns.

#### Versioning and Governance Strategy

*   **Code:** All code (pipeline definitions, feature logic, model training scripts, IaC) is versioned in **Git**.
*   **Data:** Large datasets and feature sets are versioned using **DVC**, with pointers checked into Git.
*   **Models:** Every trained model is versioned and governed through the **MLflow Model Registry**, creating an auditable lineage from a prediction back to the exact code and data that produced it.

___

### Data Sourcing and Discovery

The most sophisticated model is only as good as the data it's trained on. For our CLV project, the initial and most critical phase was to source, understand, and validate the diverse datasets that capture the complete customer journey. This foundational work is the "mise en place" of our entire MLOps system—everything must be meticulously prepared before we begin modeling.

Following a structured framework, here is how we approached the data lifecycle for this project:

| Framework Step | Application to the CLV Project | Key Rationale & Chosen Tools |
| :--- | :--- | :--- |
| **1. Identifying Data Requirements** | To predict future value, we needed a holistic customer view. **Transactional Data:** Order history, product details, prices, discounts. <br> • **Customer/CRM Data:** Demographics, acquisition channel, loyalty status. <br> • **Behavioral Data:** Web/app session logs, clicks, page views, and cart activity. | Transactional data is essential for baseline RFM features. CRM and behavioral data provide the rich, nuanced signals needed for a high-performance machine learning model to outperform simple heuristics. |
| **2. Exploring Data Sources** | • **Production OLTP Database (PostgreSQL/MySQL):** Source for real-time transactional data. <br> • **CRM System (e.g., Salesforce):** Source for customer demographic and marketing data. <br> • **Event Streaming Platform :** Source for high-volume behavioral data. | We tapped directly into the systems of record, ensuring data authenticity. The challenge was not finding data but integrating these disparate, siloed sources into a unified view. |
| **3. Data Collection & Ingestion** | We established a **daily batch ingestion** strategy. <br> • An **Airflow DAG** extracts data from the production DB replica and CRM. <br> • Data is landed in its raw format in our **AWS S3 Data Lake**. <br> • Raw datasets are versioned using **DVC** to ensure every pipeline run is reproducible. | For CLV, daily batch processing provides sufficient data freshness while being more cost-effective and operationally simpler than a real-time streaming architecture. |
| **4. Exploratory Data Analysis (EDA)** | Before any feature engineering, we performed a thorough EDA in Jupyter notebooks. We focused on: <br> • Profiling RFM distributions to understand purchasing rhythms. <br> • Visualizing sales trends to identify seasonality. <br> • Quantifying data quality issues like missing `CustomerID`s or negative `UnitPrice` values (returns). | This crucial step prevented a "garbage in, garbage out" scenario. It allowed us to identify data quality rules for our validation pipeline and informed our feature engineering strategy by uncovering key patterns and outliers. |
| **5. Data Documentation & Discovery** | • Used the **AWS Glue Data Catalog** to make our S3 data lake's schema discoverable and queryable via Athena. <br> • Created documentation ("Data Cards") for key datasets, defining their schema, ownership, and update frequency. | A central catalog is critical for governance, trust, and enabling other teams to discover and reuse these valuable, curated data assets. |
| **6. Early Governance & Security** | Given the sensitivity of customer data, governance was a day-one priority. <br> • We defined strict **AWS IAM policies** to enforce least-privilege access to S3 buckets. <br> • We created a PII (Personally Identifiable Information) transformation step in our data pipeline to hash or mask sensitive fields. <br> • We established clear data retention policies. | Security and privacy are non-negotiable. Building these governance controls directly into our data pipelines ensures compliance and builds trust with both our customers and internal stakeholders. |

___ 

<!--
#### Data Characteristics

**Assumptions for this profile:**

*   **Company Size:** A multi-category retailer with an established online presence.
*   **Customer Base:** Approximately 1 million active customers.
*   **Daily Orders (Average):** ~4,000-6,000 orders per day. This can spike 3-5x during peak seasons (e.g., Black Friday, Christmas).
*   **Conversion Rate:** Assumed to be around 2%. This implies roughly 250,000 web sessions per day on average.

Here are the estimated data profiles in table format:

| Data Type | Daily Volume (Average) | Data Velocity | Data Profile & Governance Notes |
| :--- | :--- | :--- | :--- |
| **Transactional Data** | **50 - 200 MB per day.** <br>This includes new orders, returns, payments, and shipping status updates. | **Near Real-Time Events, Batch Processed.** <br>Individual transactions occur in real-time, but for analytics, this data is typically ingested in hourly or daily batches. | **Highly Structured.** <br>Consists of tables with well-defined schemas (`order_id`, `customer_id`, `sku`, `price`, `timestamp`). <br>**Governance:** Subject to financial auditing standards. Must handle multiple European currencies (€, £, CHF, etc.). GDPR compliance is critical for any customer-linked data. |
| **Customer / CRM Data** | **< 100 MB per day.** <br>Primarily updates to existing customer profiles and a smaller number of new customer sign-ups. | **Low / On-Change.** <br>Data changes are infrequent. Typically synchronized via daily batch jobs from the CRM system to the data lake. | **Highly Structured & Sensitive.** <br>Contains Personally Identifiable Information (PII) like names, emails, and physical addresses. <br>**Governance:** Strict GDPR rules apply. Must support data access, modification, and the "right to be forgotten." PII must be masked or hashed in analytical environments. |
| **Behavioral (Clickstream) Data** | **4 - 8 GB per day.** <br>This is the highest volume data, generated by user interactions on the website and mobile app. (Based on ~250k sessions/day with ~10 events/session). | **High-Velocity Event Streams.** <br>Data is generated continuously as users browse. Captured by event tracking platforms and ingested in near real-time. | **Semi-Structured (JSON).** <br>Events include `page_view`, `add_to_cart`, `search_query`, `product_view`. Contains anonymous `session_id` and `customer_id` (if logged in). <br>**Governance:** Requires explicit user consent for cookie-based tracking under GDPR. Data must be sessionized to reconstruct user journeys. |

-->


### Data Engineering and Pipelines: Building the Foundation for Accurate Predictions

The reliability of our entire CLV prediction system rests on the quality of its data foundation. This "mise en place" stage involves transforming raw, disparate data into clean, validated, and feature-rich inputs ready for model training. This is not a one-off task but a system of automated, repeatable, and robust pipelines.

Here’s how we applied core data engineering principles to build the data backbone for our CLV project:

| Framework Step | Application to the CLV Project | Key Rationale & Chosen Tools |
| :--- | :--- | :--- |
| **1. Designing Data Processing Workflows** | The primary workflow is an **ELT (Extract, Load, Transform)** process. Raw data is extracted daily and loaded into the S3 data lake. Transformations and feature calculations are then performed as a separate, downstream step using Spark. The workflow is designed to be **modular** (Ingestion -> Validation -> Feature Engineering) and **idempotent**, ensuring that rerunning a pipeline on the same raw data produces the identical feature set. | An ELT approach leverages the power of the cloud data lake and a distributed engine like Spark, offering more flexibility than a rigid ETL process. Modularity and idempotency are core principles for building resilient, testable, and maintainable data pipelines that can recover from transient failures. |
| **2. Data Cleaning & Wrangling** | Our automated pipeline systematically addresses data quality issues identified during EDA: <br>• **Handling Nulls:** Rows with a missing `CustomerID` are discarded as they are unusable for CLV. <br>• **Handling Returns:** Transactions with negative `Quantity` or `UnitPrice` are processed to correctly adjust customer spending totals, preventing data contamination. <br>• **Outlier Treatment:** Extreme monetary values (e.g., transactions > €50,000), which can skew model training, are automatically capped at a predefined threshold based on the 99.9th percentile of the training data. | This automated cleaning is the first line of defense for data quality. Explicitly handling outliers is crucial for regression models, which are highly sensitive to extreme values. These steps ensure that the data entering our feature engineering process is clean and consistent. |
| **3. Data Transformation & Standardization** | To prepare data for the model, our pipeline performs two key transformations using a saved `scikit-learn` Pipeline object: <br>• **Standardization:** Numerical features like `Monetary Value` and `Frequency` are scaled using `StandardScaler`. <br>• **Encoding:** Categorical features like `Acquisition Channel` are converted into numerical format using `OneHotEncoder`. <br>Crucially, the scaler and encoder are **fit only on the training dataset** and then saved as versioned artifacts. | Most machine learning algorithms perform better when numerical input features are on a standard scale. The "fit on train, transform on all" approach is a fundamental best practice to **prevent data leakage** from the test set into the training process, which would lead to overly optimistic and unrealistic performance metrics. |
| **4. Programmatic Data Labeling** | For our regression task, the target "label" is not manually created but **programmatically generated**. The pipeline calculates the ground truth for each customer by summing their total revenue in the 12 months *following* the specified cutoff date. This ensures a consistent and objective definition of the value we aim to predict. | There is no ambiguity in our target variable, removing the need for costly and slow human-in-the-loop labeling. This programmatic approach makes the entire label generation process fast, scalable, and perfectly reproducible. |
| **5. Data Splitting & Sampling** | The pipeline enforces a strict **temporal data split**. To evaluate model performance, we train the model on one period (e.g., Months 1-9) and test it on a subsequent, unseen period (e.g., predictions for Months 10-12). We do not perform any over- or under-sampling on the test set to ensure it reflects the true distribution of customers in the real world. | This is the only correct way to validate a time-dependent forecasting model. Using a random split would leak information from the future into the training process, yielding a model that performs deceptively well in tests but fails in production. |
| **6. Data Validation as a Pipeline Stage** | We integrated **Great Expectations** as a dedicated validation task within our Airflow DAG. This task runs after data ingestion and before feature engineering. Key checks include: `expect_column_values_to_not_be_null` for `CustomerID` and `expect_column_mean_to_be_between` for `Monetary Value` to detect significant data drift. A failure in this stage **halts the entire pipeline** and triggers an alert. | This automated quality gate is critical for building trust and reliability. It prevents "bad data" from silently propagating downstream, which is a common and costly source of production ML failures. It acts as a data contract, ensuring the data adheres to our expectations before we invest compute resources in processing it. |
| **7. Data Versioning & Lineage** | Every dataset is versioned. <br>• **DVC** tracks the versions of our S3-based datasets. <br>• The Git commit hash versions the code. <br>• **MLflow** logs the specific DVC hash of the data used for each training run. This creates an immutable link between a model artifact, the code that generated it, and the precise version of the data it was trained on. | This practice provides complete, end-to-end lineage. If a model behaves unexpectedly in production, we can trace its exact origins, making debugging and auditing straightforward and reliable. It turns reproducibility from a manual best practice into a guaranteed property of the system. |
| **8. Orchestration & Execution** | The entire multi-step data workflow is defined as a **Directed Acyclic Graph (DAG)** in **Apache Airflow**. Airflow manages the scheduling, dependencies (e.g., validation must complete before feature engineering begins), error handling, and retries for the entire data engineering process. Each complex step is containerized to ensure a consistent execution environment. | Using a dedicated orchestrator like Airflow transforms a collection of separate scripts into a single, robust, and observable system. It provides the operational control and visibility necessary to manage a production-grade data pipeline, which is far superior to relying on simple cron jobs. |


#### Planning the Data Ingestion Pipeline

*   **Python Scripts (`src/`):** For the core business logic.
*   **Unit Tests (`tests/`):** To ensure the correctness of the Python scripts.
*   **Pipeline Code (`pipelines/`):** The Airflow DAGs that define the workflow.
*   **Infrastructure as Code (`terraform/`):** To provision the necessary AWS resources.
*   **Integration Tests (`tests/`):** To verify that the different components and services work together as expected.
*   **Architecture Diagram:** Essential for documentation and team alignment. 


#### Tool & Compute Choice: Spark/EMR vs. Other Frameworks

1.  **For Transactional Data (Pipeline 1):** The daily volume (50-200 MB) is relatively small. Spinning up an EMR cluster (which can take several minutes and incurs costs for the duration it's running) just to process this amount of data is inefficient and not cost-effective.
    *   **Better Choice: AWS Glue.** Glue is a serverless ETL service on AWS. You only pay for the resources consumed during the job run, with no cluster management overhead. It is perfectly suited for this scale of data. Alternatively, a simple Python script using the Pandas library, running directly on the Airflow worker, would also be sufficient.

2.  **For Behavioral Data (Pipeline 2):** This data arrives as a continuous stream. The most efficient AWS-native pattern here is to use **Amazon Kinesis Data Firehose**.
    *   **How it Works:** Your website/app sends events to a Kinesis Data Stream. A Kinesis Firehose delivery stream subscribes to this data stream. Firehose automatically buffers the incoming events (e.g., for 5 minutes or until 128 MB of data is collected), batches them into files, and writes them directly to your S3 data lake.
    *   **Benefit:** This process is serverless, fully managed, and requires no processing engine like Spark. It's the most cost-effective and operationally simple way to get high-volume streaming data into S3. Airflow's role here would be to monitor this process or to trigger downstream pipelines *after* the data has landed in S3.

**When to use Spark on EMR?**

We will use Spark and EMR in the **next major pipeline: Feature Engineering**. After all the raw data (both transactional and behavioral) has been landed in S3, we will need a powerful, distributed engine to process the *entire historical dataset* at once to compute complex customer-level features (e.g., aggregations, rolling window calculations). That is where Spark's capabilities are essential and cost-effective.


| Pipeline | Source | Processing/Tools | Destination | Orchestration |
| :--- | :--- | :--- | :--- | :--- |
| **Data Ingestion 1 (Batch)** | Production DB (e.g., PostgreSQL) | **AWS Glue** or **Python/Pandas** for extraction and transformation. **Great Expectations** for validation. | S3 Data Lake (Raw Zone) | **Apache Airflow (MWAA)** |
| **Data Ingestion 2 (Stream)** | **Kinesis Data Streams** | **Kinesis Data Firehose** for automated buffering and delivery. | S3 Data Lake (Raw Zone) | **Kinesis Firehose** (Managed) |


#### Data Ingestion Pipeline: Implementation

**Architecture Diagram**

<img src="../_static/past_experiences/ecom_cltv/data_ingestion_validation.svg" style="background-color: #FCF1EF;"/>


**Infrastructure as Code (Terraform)**

This defines the AWS Glue resources needed for the batch ingestion pipeline.

```hcl
# terraform/aws_glue.tf

# IAM Role for the Glue job to access S3 and the DB connection
resource "aws_iam_role" "glue_job_role" {
  name = "clv-glue-job-role-${var.environment}"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "glue.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "glue_s3_access" {
  role       = aws_iam_role.glue_job_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess" # Scope down in production
}

resource "aws_iam_role_policy_attachment" "glue_basic_execution" {
  role       = aws_iam_role.glue_job_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}

# The Glue job definition
resource "aws_glue_job" "ingest_transactional_job" {
  name     = "clv-ingest-transactional-job-${var.environment}"
  role_arn = aws_iam_role.glue_job_role.arn
  command {
    script_location = "s3://${var.artifacts_bucket_name}/scripts/ingest_transactional_data.py"
    python_version  = "3"
  }
  glue_version = "3.0"
  number_of_workers = 2
  worker_type       = "G.1X"
}

# The Glue connection to store DB credentials securely
resource "aws_glue_connection" "source_db_connection" {
  name = "clv-source-db-connection-${var.environment}"
  connection_type = "JDBC"

  connection_properties = {
    JDBC_CONNECTION_URL = "jdbc:postgresql://your-db-endpoint.rds.amazonaws.com:5432/ecommerce"
    USERNAME            = var.db_username
    PASSWORD            = var.db_password
  }
}
```

This defines the Kinesis Stream and Firehose for handling behavioral events.

```hcl
# terraform/aws_kinesis.tf

resource "aws_kinesis_stream" "behavioral_events_stream" {
  name        = "clv-behavioral-events-stream-${var.environment}"
  shard_count = 1
}

resource "aws_kinesis_firehose_delivery_stream" "behavioral_stream_to_s3" {
  name        = "clv-behavioral-stream-to-s3-${var.environment}"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.raw_data_bucket.arn # Assuming raw_data_bucket is defined elsewhere
    
    # Buffer hints: deliver every 5 minutes or when 64MB is reached
    buffering_interval_in_seconds = 300
    buffering_size_in_mb          = 64

    # Convert incoming JSON to Parquet for efficiency
    data_format_conversion_configuration {
      enabled = true
      input_format_configuration {
        deserializer {
          hive_json_ser_de {}
        }
      }
      output_format_configuration {
        serializer {
          parquet_ser_de {}
        }
      }
    }
  }

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.behavioral_events_stream.arn
    role_arn           = aws_iam_role.firehose_role.arn
  }
}

# Role for Firehose to read from Kinesis and write to S3
resource "aws_iam_role" "firehose_role" {
  name = "clv-firehose-role-${var.environment}"
  # Assume role policy allows firehose.amazonaws.com
}

# ... Attach necessary policies to firehose_role ...
```

**Great Expectations Suite**

This JSON file defines our data quality rules. It would be generated by the GE CLI and stored in your Git repo.

```json
{
  "expectation_suite_name": "transactional_data.warning",
  "ge_cloud_id": null,
  "meta": { "great_expectations_version": "0.15.0" },
  "expectations": [
    {
      "expectation_type": "expect_table_columns_to_match_ordered_list",
      "kwargs": { "column_list": ["CustomerID", "InvoiceNo", "StockCode", "Description", "Quantity", "InvoiceDate", "UnitPrice", "Country"] }
    },
    {
      "expectation_type": "expect_column_values_to_not_be_null",
      "kwargs": { "column": "CustomerID" }
    },
    {
      "expectation_type": "expect_column_values_to_be_of_type",
      "kwargs": { "column": "Quantity", "type_": "int" }
    },
    {
      "expectation_type": "expect_column_values_to_be_between",
      "kwargs": { "column": "UnitPrice", "min_value": 0 }
    }
  ]
}
```

**Python Scripts**

```python
# src/ingest_transactional_data.py
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from datetime import datetime

# Get job arguments
args = getResolvedOptions(sys.argv, ["JOB_NAME", "output_path"])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Read from the Glue Data Catalog using the specified connection
source_dyf = glueContext.create_dynamic_frame.from_catalog(
    database="ecommerce_db",
    table_name="transactions",
    connection_name="clv-source-db-connection-staging" # Use connection name
)

# Convert to Spark DataFrame for processing
source_df = source_dyf.toDF()

# Add a processing timestamp
source_df = source_df.withColumn("processing_timestamp", lit(datetime.now()))

# Write data to S3 in Parquet format
glueContext.write_dynamic_frame.from_options(
    frame=DynamicFrame.fromDF(source_df, glueContext, "source_df"),
    connection_type="s3",
    connection_options={"path": args["output_path"]},
    format="parquet"
)

job.commit()
```

A simple script to simulate sending events to the Kinesis stream (for testing)

```python
# src/produce_behavioral_events.py
import boto3
import json
import random
import time
from datetime import datetime

STREAM_NAME = "clv-behavioral-events-stream-staging"
client = boto3.client("kinesis", region_name="eu-west-1")

def send_event(event_data):
    try:
        response = client.put_record(
            StreamName=STREAM_NAME,
            Data=json.dumps(event_data),
            PartitionKey=str(event_data['CustomerID'])
        )
        print(f"Sent event for Customer {event_data['CustomerID']}. SequenceNumber: {response['SequenceNumber']}")
    except Exception as e:
        print(f"Error sending event: {e}")

if __name__ == "__main__":
    for _ in range(10):
        event_type = random.choice(['page_view', 'add_to_cart', 'search'])
        customer_id = random.randint(1000, 2000)
        
        event = {
            "event_type": event_type,
            "CustomerID": customer_id,
            "timestamp": datetime.now().isoformat(),
            "session_id": f"sess_{customer_id}_{int(time.time())}"
        }
        send_event(event)
        time.sleep(0.1)
```

**Airflow DAG**

This DAG orchestrates the transactional ingestion and validation.

```python
# pipelines/dag_ingest_transactional.py
from airflow.decorators import dag
from airflow.providers.amazon.aws.operators.glue import GlueJobOperator
from great_expectations_provider.operators.great_expectations import GreatExpectationsOperator
from datetime import datetime

GE_PROJECT_ROOT_DIR = "/path/to/your/great_expectations"
OUTPUT_S3_PATH = "s3://clv-raw-data-bucket-staging/transactional/"

@dag(
    dag_id="clv_ingest_transactional_data_with_validation",
    start_date=datetime(2025, 1, 1),
    schedule_interval="@daily",
    catchup=False,
)
def ingest_dag():
    
    ingest_job = GlueJobOperator(
        task_id="run_glue_ingestion_job",
        job_name="clv-ingest-transactional-job-staging",
        script_args={"--output_path": OUTPUT_S3_PATH},
        aws_conn_id="aws_default",
    )
    
    validation_task = GreatExpectationsOperator(
        task_id="validate_raw_transactional_data",
        data_context_root_dir=GE_PROJECT_ROOT_DIR,
        checkpoint_name="s3_raw_data_checkpoint", # Assumes a checkpoint is configured
        fail_task_on_validation_failure=True,
    )

    ingest_job >> validation_task

ingest_dag()
```

**Unit Test**

```python
# tests/unit/test_event_producer.py
import pytest
from unittest.mock import patch, MagicMock
from src.produce_behavioral_events import send_event

@patch('boto3.client')
def test_send_event_success(mock_boto_client):
    """Tests the happy path of sending a Kinesis event."""
    mock_kinesis = MagicMock()
    mock_boto_client.return_value = mock_kinesis
    
    event_data = {"CustomerID": 123, "event_type": "page_view"}
    
    with patch('src.produce_behavioral_events.client', mock_kinesis):
        send_event(event_data)

    mock_kinesis.put_record.assert_called_once()
    # You can add more specific assertions on the call arguments
```

**Integration Test**

```python
# tests/integration/test_ingestion_pipelines.py
import pytest
import boto3
import time
from airflow.api.client.local_client import Client
from src.produce_behavioral_events import send_event

@pytest.mark.integration
def test_transactional_ingestion_dag():
    """Triggers the transactional data DAG and checks for completion."""
    c = Client(None, None)
    run_id = f"test_transactional_ingestion_{int(time.time())}"
    
    # Trigger and wait for the DAG to complete
    # ... (polling logic similar to previous examples) ...
    
    # Assert that the final state is 'success'
    dag_run = c.get_dag_run(dag_id="clv_ingest_transactional_data_with_validation", run_id=run_id)
    assert dag_run.state == 'success'

@pytest.mark.integration
def test_behavioral_ingestion_pipeline():
    """Sends a test event and checks if it lands in S3 via Firehose."""
    s3 = boto3.client("s3")
    bucket = "clv-raw-data-bucket-staging"
    prefix_before = f"behavioral/{datetime.now().strftime('%Y/%m/%d')}"

    # Send a test event
    test_event = {"CustomerID": 9999, "event_type": "integration_test"}
    send_event(test_event)

    # Wait for Firehose buffer to flush (e.g., 60 seconds)
    print("Waiting 65 seconds for Firehose to deliver...")
    time.sleep(65)
    
    # Check S3 for a new object
    response = s3.list_objects_v2(Bucket=bucket, Prefix=prefix_before)
    assert 'Contents' in response and len(response['Contents']) > 0, "No file was delivered to S3"
```

**CI/CD Workflow**

This workflow validates and deploys both ingestion pipelines.

```yaml
# .github/workflows/cicd_data_ingestion.yml
name: "CI/CD for Data Ingestion Pipelines"

on:
  push:
    branches: [ main ]
    paths:
      - 'src/ingest_transactional_data.py'
      - 'src/produce_behavioral_events.py'
      - 'pipelines/dag_ingest_transactional.py'
      - 'terraform/aws_glue.tf'
      - 'terraform/aws_kinesis.tf'
      - 'great_expectations/**'
      - 'tests/**'

jobs:
  ci-checks:
    name: "Static Checks and Unit Tests"
    # ... (linting, unit tests, terraform validate) ...
  
  cd-staging-and-test:
    name: "Deploy to Staging & Run Integration Tests"
    needs: ci-checks
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Checkout Repository
        # ...
      - name: Configure Staging AWS Credentials
        # ...
      - name: Deploy Infrastructure (Terraform Apply)
        run: |
          cd terraform
          terraform apply -auto-approve -var-file=staging.tfvars
      
      - name: Deploy DAG to Staging Airflow
        # ...
        
      - name: Run Integration Tests
        run: pytest tests/integration/test_ingestion_pipelines.py
```
___

### Feature Engineering Pipeline

#### Planning

1.  **Objective:** Create a single, automated pipeline that takes the raw transactional and behavioral data from our S3 data lake and produces a comprehensive feature set for each customer. This feature set will be stored in the **Amazon SageMaker Feature Store** to ensure consistency between training and serving.

2.  **Core Tooling:** We will use **Apache Spark on AWS EMR** for this task. Given that we need to process the *entire historical dataset* and perform complex aggregations (like rolling time windows), Spark's distributed processing capability is the right choice here. It's both scalable and cost-effective for this type of heavy-lifting workload.

3.  **Pipeline Implementation:**
    *   **Orchestration:** The pipeline will be defined as an **Airflow DAG**. This DAG will be triggered upon the successful completion of the batch transactional data ingestion pipeline.
    *   **Compute:** The Airflow DAG will have a task that programmatically launches a temporary **EMR cluster**, submits the Spark job, waits for its completion, and then terminates the cluster to save costs.
    *   **Logic:** The core feature engineering logic will be encapsulated in a single, well-structured **PySpark script**.

4.  **Types of Features to Engineer:** We will create a rich set of features that go beyond simple RFM to capture nuanced customer behavior:
    *   **Static RFM Features:**
        *   `recency`: Days since last purchase.
        *   `frequency`: Total number of distinct purchase days.
        *   `monetary`: Average spend per purchase day.
        *   `T`: Tenure of the customer (days since first purchase).
    *   **Time-Windowed Features:** To capture trends, we'll calculate key metrics over multiple rolling windows (e.g., last 30, 90, 365 days):
        *   `purchase_count_30d`, `purchase_count_90d`, `purchase_count_365d`
        *   `total_spend_30d`, `total_spend_90d`, `total_spend_365d`
    *   **Behavioral Features:** Aggregations from the clickstream data:
        *   `total_sessions_90d`: Number of website/app sessions.
        *   `avg_session_duration_90d`: Average time spent per session.
        *   `add_to_cart_count_90d`: Number of times items were added to the cart.

5.  **Artifacts to Generate:**
    *   **Python/PySpark Script (`src/`):** The main feature engineering script.
    *   **Unit Tests (`tests/`):** Pytest unit tests for the Spark transformation functions using a local Spark session.
    *   **Pipeline Code (`pipelines/`):** The Airflow DAG that orchestrates the EMR cluster and Spark job.
    *   **Infrastructure as Code (`terraform/`):** Additions to our Terraform code to define IAM roles and permissions for EMR.
    *   **Architecture Diagram (Mermaid Code):**


#### Implementation
<img src="../_static/past_experiences/ecom_cltv/feature_engineering.svg" style="background-color: #FCF1EF;"/>


**Airflow DAG Script to Orchestrate Feature Generation**

```python
from airflow import DAG
from airflow.providers.amazon.aws.operators.emr import (
    EmrCreateJobFlowOperator,
    EmrAddStepsOperator,
    EmrTerminateJobFlowOperator,
)
from airflow.models.baseoperator import chain
from datetime import datetime

# --- Constants ---
S3_BUCKET = "airflow-bucket-name" # Bucket for Airflow logs and scripts
EMR_EC2_ROLE = "emr-ec2-instance-role"
EMR_SERVICE_ROLE = "emr-service-role"
FEATURE_GROUP_NAME = "clv-feature-group-v1"
AWS_REGION = "eu-west-1"

# EMR cluster configuration
JOB_FLOW_OVERRIDES = {
    "Name": "clv-feature-engineering-cluster",
    "ReleaseLabel": "emr-6.9.0",
    "Applications": [{"Name": "Spark"}],
    "Instances": {
        "InstanceGroups": [
            {
                "Name": "Master node",
                "Market": "ON_DEMAND",
                "InstanceRole": "MASTER",
                "InstanceType": "m5.xlarge",
                "InstanceCount": 1,
            },
            {
                "Name": "Core nodes",
                "Market": "ON_DEMAND",
                "InstanceRole": "CORE",
                "InstanceType": "m5.xlarge",
                "InstanceCount": 2,
            },
        ],
        "KeepJobFlowAliveWhenNoSteps": False,
        "TerminationProtected": False,
    },
    "JobFlowRole": EMR_EC2_ROLE,
    "ServiceRole": EMR_SERVICE_ROLE,
    "VisibleToAllUsers": True,
}

# Spark job steps
SPARK_STEPS = [
    {
        "Name": "Generate CLV Features",
        "ActionOnFailure": "TERMINATE_JOB_FLOW",
        "HadoopJarStep": {
            "Jar": "command-runner.jar",
            "Args": [
                "spark-submit",
                "--deploy-mode", "cluster",
                f"s3://{S3_BUCKET}/scripts/generate_features.py",
                f"s3://clv-raw-data-bucket/transactional/",
                f"s3://clv-raw-data-bucket/behavioral/",
                FEATURE_GROUP_NAME,
                AWS_REGION,
            ],
        },
    }
]

with DAG(
    dag_id="clv_feature_generation_pipeline",
    start_date=datetime(2025, 1, 1),
    schedule_interval="@daily",
    catchup=False,
    tags=["clv", "feature-engineering"],
) as dag:
    # Task to create a transient EMR cluster
    create_emr_cluster = EmrCreateJobFlowOperator(
        task_id="create_emr_cluster",
        job_flow_overrides=JOB_FLOW_OVERRIDES,
        aws_conn_id="aws_default",
        emr_conn_id="emr_default",
    )

    # Task to add the Spark job step
    add_spark_step = EmrAddStepsOperator(
        task_id="add_spark_step",
        job_flow_id="{{ task_instance.xcom_pull(task_ids='create_emr_cluster', key='return_value') }}",
        steps=SPARK_STEPS,
        aws_conn_id="aws_default",
    )

    # Task to terminate the EMR cluster
    terminate_emr_cluster = EmrTerminateJobFlowOperator(
        task_id="terminate_emr_cluster",
        job_flow_id="{{ task_instance.xcom_pull(task_ids='create_emr_cluster', key='return_value') }}",
        aws_conn_id="aws_default",
        trigger_rule="all_done",  # Ensures cluster is terminated even if the Spark job fails
    )

    # Define task dependencies
    chain(create_emr_cluster, add_spark_step, terminate_emr_cluster)
```

**Python Script for Feature Generation**

```python
# src/generate_features.py

import sys
from datetime import datetime
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit, max, min, countDistinct, sum, avg, datediff, expr, window
from pyspark.sql.types import TimestampType
import boto3

def get_sagemaker_feature_store_client(region):
    """Initializes the SageMaker Feature Store runtime client."""
    return boto3.client('sagemaker-featurestore-runtime', region_name=region)

def generate_features(spark, transactional_data_path, behavioral_data_path):
    """
    Reads raw data and generates a customer feature set.
    """
    # Load raw data
    trans_df = spark.read.parquet(transactional_data_path)
    behav_df = spark.read.parquet(behavioral_data_path)

    # --- Data Preparation ---
    trans_df = trans_df.withColumn("InvoiceDate", col("InvoiceDate").cast(TimestampType()))
    
    # --- Feature Engineering ---
    current_timestamp = datetime.utcnow()

    # 1. RFM-T Features
    customer_summary = trans_df.groupBy("CustomerID").agg(
        max("InvoiceDate").alias("last_purchase_date"),
        min("InvoiceDate").alias("first_purchase_date"),
        countDistinct("InvoiceNo").alias("frequency"),
        sum("SalePrice").alias("total_spend")
    )

    rfm_t_features = customer_summary.withColumn("recency", datediff(col("last_purchase_date"), col("first_purchase_date"))) \
        .withColumn("T", datediff(lit(current_timestamp), col("first_purchase_date"))) \
        .withColumn("monetary", col("total_spend") / col("frequency")) \
        .select("CustomerID", "recency", "frequency", "monetary", "T")

    # 2. Time-Windowed Features (Transactional)
    window_spec_30d = window(col("InvoiceDate"), "30 days")
    window_spec_90d = window(col("InvoiceDate"), "90 days")

    time_window_features = trans_df.groupBy("CustomerID").agg(
        countDistinct("InvoiceNo", window_spec_30d).alias("purchase_count_30d"),
        sum(col("SalePrice"), window_spec_30d).alias("total_spend_30d"),
        countDistinct("InvoiceNo", window_spec_90d).alias("purchase_count_90d"),
        sum(col("SalePrice"), window_spec_90d).alias("total_spend_90d"),
    )
    
    # 3. Behavioral Features (Aggregating last 90 days of behavioral data)
    ninety_days_ago = current_timestamp - expr("INTERVAL 90 DAYS")
    behavioral_summary = behav_df.filter(col("event_timestamp") >= ninety_days_ago) \
        .groupBy("CustomerID").agg(
            countDistinct("session_id").alias("total_sessions_90d"),
            avg("session_duration_seconds").alias("avg_session_duration_90d"),
            sum(expr("case when event_type = 'add_to_cart' then 1 else 0 end")).alias("add_to_cart_count_90d")
        )

    # --- Join all features ---
    final_features = rfm_t_features \
        .join(time_window_features, "CustomerID", "left") \
        .join(behavioral_summary, "CustomerID", "left") \
        .na.fill(0) # Fill nulls from joins with 0
    
    # Add EventTime feature required by Feature Store
    final_features = final_features.withColumn("EventTime", lit(current_timestamp).cast(TimestampType()))

    return final_features

def write_to_feature_store(df, feature_group_name, region):
    """
    Ingests a Spark DataFrame into a SageMaker Feature Store.
    This function would typically use the SageMaker Feature Store SDK.
    For a Spark job, a common pattern is to convert to Pandas and use boto3.
    """
    # NOTE: In a high-scale scenario, you might use a more direct Spark-to-FeatureStore connector.
    # For simplicity, this demonstrates the boto3 approach within a Spark context.
    featurestore_client = get_sagemaker_feature_store_client(region)
    
    def put_records(partition):
        for row in partition:
            record = [
                {'FeatureName': name, 'ValueAsString': str(value)}
                for name, value in row.asDict().items()
            ]
            featurestore_client.put_record(
                FeatureGroupName=feature_group_name,
                Record=record
            )

    df.foreachPartition(put_records)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: spark-submit generate_features.py <transactional_data_path> <behavioral_data_path> <feature_group_name> <aws_region>")
        sys.exit(-1)

    spark = SparkSession.builder.appName("CLVFeatureGeneration").getOrCreate()

    transactional_data_path = sys.argv[1]
    behavioral_data_path = sys.argv[2]
    feature_group_name = sys.argv[3]
    aws_region = sys.argv[4]

    print(f"Starting feature generation...")
    features_df = generate_features(spark, transactional_data_path, behavioral_data_path)
    
    print(f"Writing {features_df.count()} records to Feature Group: {feature_group_name}")
    write_to_feature_store(features_df, feature_group_name, aws_region)
    
    print("Feature generation and ingestion complete.")
    spark.stop()
```

**Unit Tests for Feature Generation script**

```python
import pytest
from pyspark.sql import SparkSession
from src.generate_features import generate_features
import pandas as pd
from datetime import datetime, timedelta

@pytest.fixture(scope="session")
def spark_session():
    """Creates a Spark session for testing."""
    return SparkSession.builder \
        .master("local[2]") \
        .appName("CLVFeatureTests") \
        .getOrCreate()

def test_feature_generation_logic(spark_session):
    """Tests the end-to-end feature generation function."""
    # Create mock transactional data
    trans_pd = pd.DataFrame({
        'CustomerID': [1, 1, 2, 1],
        'InvoiceNo': ['A1', 'A2', 'B1', 'A3'],
        'InvoiceDate': [
            datetime.now() - timedelta(days=100),
            datetime.now() - timedelta(days=50),
            datetime.now() - timedelta(days=20),
            datetime.now() - timedelta(days=10)
        ],
        'SalePrice': [10.0, 20.0, 50.0, 30.0]
    })
    # Create mock behavioral data
    behav_pd = pd.DataFrame({
        'CustomerID': [1, 2],
        'session_id': ['s1', 's2'],
        'event_timestamp': [datetime.now() - timedelta(days=5), datetime.now() - timedelta(days=15)],
        'session_duration_seconds': [120, 300],
        'event_type': ['add_to_cart', 'page_view']
    })

    trans_df = spark_session.createDataFrame(trans_pd)
    behav_df = spark_session.createDataFrame(behav_pd)
    
    # Create temporary paths for the test data
    trans_path = "file:///tmp/test_trans_data"
    behav_path = "file:///tmp/test_behav_data"
    trans_df.write.mode("overwrite").parquet(trans_path)
    behav_df.write.mode("overwrite").parquet(behav_path)

    # Run the feature generation function
    features_df = generate_features(spark_session, trans_path, behav_path)
    
    # Collect results for validation
    result = features_df.filter(col("CustomerID") == 1).first()

    assert result is not None
    assert result['CustomerID'] == 1
    assert result['recency'] == 90  # 100 days ago to 10 days ago
    assert result['T'] >= 100
    assert result['frequency'] == 3
    assert abs(result['monetary'] - 20.0) < 0.01 # (10+20+30)/3
    assert result['purchase_count_30d'] == 1
    assert result['add_to_cart_count_90d'] == 1
```

**Integration Test for Feature Generation pipeline**

```python
import pytest
import boto3
import sagemaker
from sagemaker.feature_store.feature_group import FeatureGroup
import pandas as pd
from pyspark.sql import SparkSession
from datetime import datetime, timedelta
import time
import random

# Import the functions from our source script
from src.generate_features import generate_features, write_to_feature_store

# --- Fixtures for AWS Resource Management ---

@pytest.fixture(scope="session")
def spark_session():
    """Provides a Spark session for the test."""
    return SparkSession.builder.master("local[*]").appName("IntegrationTest").getOrCreate()

@pytest.fixture(scope="module")
def aws_region():
    return "eu-west-1"

@pytest.fixture(scope="module")
def sagemaker_session(aws_region):
    """Provides a SageMaker session."""
    boto_session = boto3.Session(region_name=aws_region)
    return sagemaker.Session(boto_session=boto_session)

@pytest.fixture(scope="module")
def test_s3_bucket(sagemaker_session):
    """Creates a temporary S3 bucket for the test run and cleans it up afterward."""
    bucket_name = f"clv-test-bucket-integration-{int(time.time())}-{random.randint(1000, 9999)}"
    s3 = sagemaker_session.boto_session.resource("s3")
    try:
        s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={'LocationConstraint': sagemaker_session.boto_region_name})
        print(f"Created test bucket: {bucket_name}")
        yield bucket_name
    finally:
        print(f"Cleaning up bucket: {bucket_name}")
        bucket = s3.Bucket(bucket_name)
        bucket.objects.all().delete()
        bucket.delete()

@pytest.fixture(scope="module")
def feature_group_name():
    """Generates a unique feature group name for the test run."""
    return f"clv-test-fg-{int(time.time())}"

@pytest.fixture(scope="module")
def sagemaker_feature_group(sagemaker_session, feature_group_name, aws_region):
    """Creates a SageMaker Feature Group for the test and cleans it up afterward."""
    feature_group = FeatureGroup(name=feature_group_name, sagemaker_session=sagemaker_session)
    
    # Define the schema based on the output of our Spark job
    feature_definitions = [
        {"FeatureName": "CustomerID", "FeatureType": "String"},
        {"FeatureName": "recency", "FeatureType": "Integral"},
        {"FeatureName": "frequency", "FeatureType": "Integral"},
        {"FeatureName": "monetary", "FeatureType": "Fractional"},
        {"FeatureName": "T", "FeatureType": "Integral"},
        {"FeatureName": "purchase_count_30d", "FeatureType": "Integral"},
        {"FeatureName": "total_spend_30d", "FeatureType": "Fractional"},
        {"FeatureName": "purchase_count_90d", "FeatureType": "Integral"},
        {"FeatureName": "total_spend_90d", "FeatureType": "Fractional"},
        {"FeatureName": "total_sessions_90d", "FeatureType": "Integral"},
        {"FeatureName": "avg_session_duration_90d", "FeatureType": "Fractional"},
        {"FeatureName": "add_to_cart_count_90d", "FeatureType": "Integral"},
        {"FeatureName": "EventTime", "FeatureType": "String"}
    ]
    
    feature_group.feature_definitions = feature_definitions
    feature_group.record_identifier_name = "CustomerID"
    feature_group.event_time_feature_name = "EventTime"
    
    try:
        print(f"Creating Feature Group: {feature_group_name}")
        feature_group.create(
            s3_uri=f"s3://{sagemaker_session.default_bucket()}/{feature_group_name}",
            enable_online_store=True,
            role_arn="arn:aws:iam::${YOUR_ACCOUNT_ID}:role/service-role/AmazonSageMaker-ExecutionRole-..." # Replace with your actual SageMaker role ARN
        )
        # Wait for the feature group to be created
        while feature_group.describe().get("FeatureGroupStatus") == "Creating":
            print("Waiting for feature group creation...")
            time.sleep(10)
        yield feature_group_name
    finally:
        print(f"Deleting Feature Group: {feature_group_name}")
        try:
            feature_group.delete()
        except Exception as e:
            print(f"Error deleting feature group: {e}")


@pytest.fixture(scope="module")
def test_data_on_s3(spark_session, test_s3_bucket):
    """Creates mock raw data and uploads it to the test S3 bucket."""
    # Create mock transactional data
    trans_pd = pd.DataFrame({
        'CustomerID': ['101', '101', '102'],
        'InvoiceNo': ['A1', 'A2', 'B1'],
        'InvoiceDate': [datetime.now() - timedelta(days=60), datetime.now() - timedelta(days=10), datetime.now() - timedelta(days=30)],
        'SalePrice': [15.50, 25.00, 100.00]
    })
    
    # Create mock behavioral data
    behav_pd = pd.DataFrame({
        'CustomerID': ['101'],
        'session_id': ['s1'],
        'event_timestamp': [datetime.now() - timedelta(days=5)],
        'session_duration_seconds': [180],
        'event_type': ['add_to_cart']
    })
    
    trans_df = spark_session.createDataFrame(trans_pd)
    behav_df = spark_session.createDataFrame(behav_pd)

    trans_path = f"s3a://{test_s3_bucket}/transactional/"
    behav_path = f"s3a://{test_s3_bucket}/behavioral/"
    
    trans_df.write.mode("overwrite").parquet(trans_path)
    behav_df.write.mode("overwrite").parquet(behav_path)

    return trans_path, behav_path

# --- The Integration Test ---

def test_spark_job_s3_to_feature_store(spark_session, test_data_on_s3, sagemaker_feature_group, aws_region):
    """
    This test orchestrates the full feature engineering pipeline:
    1. Reads test data from a temporary S3 bucket.
    2. Runs the Spark feature generation logic.
    3. Writes the results to a temporary SageMaker Feature Group.
    4. Validates the data in the Feature Group.
    """
    # ARRANGE: Fixtures have already set up S3 data and the Feature Group.
    transactional_path, behavioral_path = test_data_on_s3
    feature_group_name = sagemaker_feature_group

    # ACT: Run the feature generation and ingestion logic.
    features_df = generate_features(spark_session, transactional_path, behavioral_path)
    write_to_feature_store(features_df, feature_group_name, aws_region)
    
    # Give a few seconds for the records to be available in the online store
    time.sleep(15)

    # ASSERT: Query the Feature Store to verify the results.
    featurestore_client = boto3.client('sagemaker-featurestore-runtime', region_name=aws_region)
    
    response = featurestore_client.get_record(
        FeatureGroupName=feature_group_name,
        RecordIdentifierValueAsString='101'
    )

    assert 'Record' in response, "Record for CustomerID 101 not found in Feature Store"
    
    # Convert the returned record to a more usable dictionary
    result_dict = {item['FeatureName']: item['ValueAsString'] for item in response['Record']}
    
    assert result_dict['CustomerID'] == '101'
    assert int(result_dict['recency']) == 50  # 60 days ago to 10 days ago
    assert int(result_dict['frequency']) == 2
    assert abs(float(result_dict['monetary']) - 20.25) < 0.01  # (15.50 + 25.00) / 2
    assert int(result_dict['purchase_count_30d']) == 1 # one purchase 10 days ago
    assert int(result_dict['add_to_cart_count_90d']) == 1
```

___

### Model Development & Iteration

This is where raw data potential is transformed into a predictive model. The core philosophy is **iterative and evidence-based**: start simple, measure rigorously, and justify every increase in complexity with a tangible improvement against clear, predefined metrics.

This framework is organized into four pillars:

1.  **Foundations for Success:** The strategic setup required before experimentation begins.
2.  **The Core Iterative Loop:** The primary cycle of building, debugging, and improving the model.
3.  **Advanced Optimization:** Techniques to apply when initial iterations plateau.
4.  **Validation and Governance:** Ensuring the model is not just accurate, but also robust, fair, and ready for production.


#### **I. Foundations for Success**

*   **Define Success Metrics:**
    *   **Optimizing Metric:** The single technical metric the model will be tuned to improve (e.g., RMSE, F1-Score).
    *   **Satisficing Metrics:** A set of operational or business constraints the model *must* meet to be considered viable (e.g., inference latency <100ms, fairness across key segments).
    *   **Business KPI:** The high-level business metric the model is intended to influence (e.g., customer retention rate, marketing ROI).
*   **Establish Data Strategy:**
    *   **Data Splitting:** For time-series problems like CLV, a strict **temporal split** (e.g., train on months 1-9, validate on months 10-12) is non-negotiable to prevent data leakage.
    *   **Data Quality:** Ensure the dev/test sets reflect the expected production data distribution. Use a schema to detect anomalies.
*   **Establish Baselines:**
    *   **Non-ML Baseline:** A simple heuristic (e.g., `Avg. Spend x Avg. Lifespan`) to quantify the value of using ML.
    *   **Simple ML Baseline:** A simple, interpretable model (e.g., Linear Regression) to validate the end-to-end pipeline and set an initial performance floor.
    *   **Human-Level Performance (HLP):** If applicable, estimate the performance of a human expert to understand the "avoidable bias."

#### **II. The Core Iterative Loop**

*   **Experiment & Model Selection:**
    *   Start with the simplest model that can do the job (e.g., Gradient Boosting for tabular data).
    *   Compare model families (Probabilistic vs. Ensemble vs. Deep Learning), weighing trade-offs between accuracy, interpretability, and operational cost.
    *   Formulate clear, testable hypotheses for each experiment (e.g., "Adding behavioral features will reduce RMSE by 5%").
*   **Track Everything:**
    *   Use an experiment tracking tool (like **MLflow**) to log every run's:
        *   Code Version (Git Hash)
        *   Data Version (DVC Hash)
        *   Hyperparameters
        *   Evaluation Metrics
        *   Model Artifacts
*   **Debug & Diagnose Systematically:**
    *   **Bias vs. Variance:** Use learning curves to determine if the model is underfitting (high bias) or overfitting (high variance). This guides the next steps (e.g., "get more data" vs. "use a bigger model").
    *   **Error Analysis:** Manually inspect the examples where the model fails most significantly. This often reveals data quality issues or opportunities for new features.
    *   **Feature Importance:** Use techniques like SHAP to understand which features are driving predictions. This aids debugging and builds business trust.

#### **III. Advanced Optimization**

*   **Iterative Feature Engineering:**
    *   Continuously add, remove, or transform features based on error analysis and feature importance results. Use a Feature Store to manage this process scalably.
*   **Automated Hyperparameter Optimization (HPO):**
    *   Use model-based methods like Bayesian Optimization (available in SageMaker, Vertex AI, or via libraries like Optuna) to efficiently search for the best hyperparameters.
*   **Ensemble Methods:**
    *   If performance plateaus, consider simple ensembles (e.g., averaging predictions from an XGBoost and a linear model) to improve robustness and accuracy.

#### **IV. Validation and Governance**

*   **Slice-Based Evaluation:** Do not trust a single, global performance metric. Evaluate model performance across critical business segments (e.g., by country, acquisition channel) to uncover hidden biases or performance gaps.
*   **Model Calibration:** Check if the model's predicted outputs align with real-world averages. A model that predicts an average CLV of $500 for a segment should be checked against the actual average CLV of that segment.
*   **Model Registry & Versioning:**
    *   Promote the final, validated model artifact to a **Model Registry** (like MLflow's).
    *   Tag the model with its version, performance metrics, and a link back to the training experiment, creating an auditable and governable asset ready for deployment.

#### **Applying the Framework to the CLV Project**

Here is how we applied this framework to our e-commerce Customer Lifetime Value prediction project:

| Factor to Consider | Decision / Choice Made | Rationale & Trade-offs |
| :--- | :--- | :--- |
| **1. Success Metrics** | **Optimizing:** Root Mean Squared Error (RMSE). <br> **Satisficing:** Gini Coefficient > 0.3, Batch Inference Time < 2 hours. <br> **Business KPI:** Increase in 12-month revenue from targeted retention campaigns. | RMSE was chosen to penalize large prediction errors heavily. The Gini coefficient ensures the model can effectively rank customers, which is vital for targeting campaigns. The time constraint ensures the pipeline fits within our nightly batch window. |
| **2. Data Splitting** | Strict temporal split. We trained the model on data up to a fixed cutoff date and evaluated it on the subsequent 3-month period. | This is the only correct way to validate a time-series forecasting model. A random split would leak future information into the training set, leading to misleadingly optimistic performance metrics. |
| **3. Baseline Models** | 1. **Heuristic:** Simple average spend per customer. <br> 2. **ML Baseline:** A Linear Regression model using only RFM features. | The heuristic model established the absolute minimum performance bar. The linear model validated our end-to-end pipeline and proved that even basic ML could outperform simple averages. |
| **4. Primary Model Choice** | **XGBoost (Gradient Boosting Machine)** | We chose XGBoost over simpler models for its high performance and over deep learning for its lower data requirements and better training efficiency on tabular data. It represents the industry standard for this type of problem. |
| **5. Experiment Tracking** | **MLflow** | Aligned with our tech stack, MLflow provides a robust open-source solution for tracking experiments, versioning data/code, and managing the model lifecycle through its Model Registry. |
| **6. Debugging & Diagnostics** | Used **SHAP (SHapley Additive exPlanations)** for feature importance and to explain individual predictions. Analyzed learning curves to balance bias and variance. | SHAP was critical for gaining business trust by explaining *why* a customer was predicted to be high-value. Learning curves guided our decision to invest more in feature engineering rather than just a bigger model. |
| **7. Hyperparameter Optimization** | **Amazon SageMaker's Automatic Model Tuning** (using Bayesian Optimization). | We leveraged a managed cloud service to automate this computationally intensive task. This freed up engineering time and ran parallel trials more efficiently than a manual or grid search approach. |
| **8. Validation & Governance** | Evaluated model RMSE on slices based on **Acquisition Channel** and **Country**. Promoted the final model to the **MLflow Model Registry** with a "production-ready" tag. | Slice-based evaluation ensured our model was not just accurate overall, but also fair and effective for key business segments. The Model Registry provides the formal, auditable hand-off from development to production deployment. |

#### **A Step-by-Step Experimental Journey**

Our approach to model development was methodical and iterative. We started with the simplest possible baselines to establish a performance floor and justify every increase in complexity with measurable improvements in our key metrics: **Root Mean Squared Error (RMSE)** for predictive accuracy and the **Gini Coefficient** for ranking ability.

Here is a summary of the experiments conducted:

| **Experiment No.** | **Model/Technique Applied** | **Features Used** | **Result & Key Learning** |
| :--- | :--- | :--- | :--- |
| **1. Heuristic Baseline** | Calculated CLV as `(Avg. Monthly Spend per Customer) x (Avg. Customer Lifespan in Months)`. | Basic historical transaction data. | **Result:** Provided a single, company-wide CLV number. <br> **Learning:** This approach was too generic. It couldn't differentiate between new and old customers or identify high-value segments, making it unusable for personalized marketing. It served as our "minimum-bar" baseline to beat. |
| **2. Simple ML Baseline** | **Linear Regression** | Foundational RFM features (Recency, Frequency, Monetary). | **Result:** **35% reduction in RMSE** compared to the error of the heuristic baseline's single prediction. <br> **Learning:** This validated that even the simplest ML model, by accounting for individual customer behavior, provided a significant accuracy boost. It also proved our end-to-end data pipeline was working correctly. |
| **3. Probabilistic Model** | **BG/NBD + Gamma-Gamma Model** | Foundational RFM features. | **Result:** Performed similarly to Linear Regression on RMSE but provided a high degree of interpretability. <br> **Learning:** This model was excellent for understanding churn probability and purchase frequency drivers. We decided to keep it as a secondary, explainable model for the business, but its inability to use other features limited its predictive power. |
| **4. Gradient Boosting Model** | **XGBoost** | Foundational RFM features. | **Result:** **20% further reduction in RMSE** over the Linear Regression baseline. <br> **Learning:** XGBoost's ability to capture non-linear relationships in the RFM features provided a substantial performance lift. This became our new champion model. |
| **5. Adding Temporal Features** | XGBoost | RFM + **Time-Windowed Features** (e.g., spend and frequency over the last 30, 90, 365 days). | **Result:** **15% reduction in RMSE** and a significant **10% increase in the Gini Coefficient**. <br> **Learning:** Capturing *trends* in customer behavior was highly predictive. A customer whose spending is recent and increasing is far more valuable than one with the same total spend spread out over years. |
| **6. Adding Behavioral Features** | XGBoost | All previous features + **Behavioral Data** (e.g., session counts, add-to-cart events). | **Result:** **10% reduction in RMSE**. The improvement was most pronounced for newer customers with limited transaction history. <br> **Learning:** Clickstream data provides powerful early signals of customer intent and engagement, helping the model make better predictions before a purchase history is established. |
| **7. Hyperparameter Optimization** | **XGBoost with Amazon SageMaker Automatic Model Tuning** (Bayesian Optimization). | All available features. | **Result:** **5% final reduction in RMSE** and a **5% increase in the Gini Coefficient**. <br> **Learning:** Automated HPO squeezed out the final percentage points of performance by fine-tuning the model's complexity and regularization, leading to a more robust and generalized final model. |

**Final Outcome:** Through this structured, iterative process, we developed a final XGBoost model that was over **60% more accurate (in terms of RMSE)** than our initial simple baseline and demonstrated a strong ability to accurately rank our most valuable customers. Each step provided valuable insights and justified the subsequent increase in complexity.




### **ML Training pipelines**

#### **Plan**

With SageMaker Pipelines as the core execution engine, orchestrated by Airflow.

| Component | Plan & Implementation Details |
| :--- | :--- |
| **Python Scripts (`src/`)** | We will create modular Python scripts for each step of the SageMaker Pipeline:<br> - `preprocess.py`: Loads data from the Feature Store, performs final transformations (e.g., scaling), and splits data. Saves the fitted scaler object.<br> - `train.py`: Takes preprocessed data, trains the XGBoost model, and saves the model artifact.<br> - `evaluate.py`: Takes the trained model and test data, calculates metrics (RMSE, Gini), and generates an evaluation report. |
| **Unit Tests (`tests/`)** | We will write `pytest` unit tests for the business logic within `preprocess.py`, `train.py`, and `evaluate.py` to ensure their correctness in isolation. |
| **Pipeline Code** | 1. **SageMaker Pipeline (`pipelines/build_pipeline.py`):** A Python script using the SageMaker SDK to define the DAG of ML steps (Preprocess -> Tune -> Train -> Evaluate -> Register).<br> 2. **Airflow DAG (`pipelines/dag_trigger_training.py`):** A simple DAG that triggers the execution of the SageMaker Pipeline on a weekly schedule. |
| **Infrastructure as Code (`terraform/`)** | We will add Terraform code to provision the necessary IAM roles for SageMaker Pipelines to execute and access other AWS services (S3, Feature Store, etc.). |
| **Integration Test (`tests/`)** | A `pytest` integration test that will:<br> 1. Programmatically trigger the Airflow DAG.<br> 2. Poll for the completion status of the SageMaker Pipeline execution.<br> 3. Check the MLflow Model Registry to assert that a new model version was (or was not) created based on the test outcome. |
| **Architecture Diagram (Mermaid)** | A single, clear diagram illustrating how Airflow triggers the SageMaker Pipeline and how the pipeline steps interact with the Feature Store, S3, and Model Registry. |


**Why Amazon SageMaker Pipelines for the core ML steps.**

Instead of having Airflow directly manage each individual ML step (processing, training, evaluation), a more modern and robust pattern is to use **Amazon SageMaker Pipelines**.

*   **How it works:** We will define the ML workflow (preprocess, train, evaluate, register) as a single, powerful SageMaker Pipeline. The Airflow DAG's role then becomes much simpler: its only job is to **trigger** this SageMaker Pipeline on a schedule.

**Why is this a better approach?**

1.  **Tightly Integrated:** SageMaker Pipelines are deeply integrated with the entire SageMaker ecosystem (Feature Store, Training Jobs, Model Registry). This reduces boilerplate code and simplifies passing data between steps.
2.  **ML-Specific Features:** It provides features that Airflow doesn't have out-of-the-box, such as experiment tracking integration, caching of pipeline steps (to avoid re-running steps with unchanged inputs), and more granular ML-focused monitoring.
3.  **Decoupling:** It decouples your general-purpose orchestrator (Airflow) from your ML-specific logic. Your Airflow DAGs remain clean and simple, while the complexity of the ML workflow is encapsulated within SageMaker. This makes the system easier to maintain.

This leverages the best of both worlds: Airflow for enterprise-wide scheduling and dependency management, and SageMaker Pipelines for its powerful, purpose-built features for orchestrating ML workflows.

#### Implementation
<img src="../_static/past_experiences/ecom_cltv/ml_training_pipeline.svg" style="background-color: #FCF1EF;"/>


**Python Component Scripts**

```python
#src/preprocess.py
def clean_and_split_data(df: pd.DataFrame, target_col: str):
    """
    Cleans the input dataframe and splits it into training and testing sets.
    
    Args:
        df (pd.DataFrame): The input data.
        target_col (str): The name of the target variable column.
        
    Returns:
        tuple: A tuple containing X_train, X_test, y_train, y_test.
    """
    df_cleaned = df.dropna(subset=[target_col])
    
    features = [col for col in df_cleaned.columns if col not in ['CustomerID', target_col, 'EventTime']]
    X = df_cleaned[features]
    y = df_cleaned[target_col]

    return train_test_split(X, y, test_size=0.2, random_state=42)

def scale_features(X_train: pd.DataFrame, X_test: pd.DataFrame):
    """
    Fits a StandardScaler on the training data and transforms both training and testing data.
    
    Args:
        X_train (pd.DataFrame): Training feature set.
        X_test (pd.DataFrame): Testing feature set.
        
    Returns:
        tuple: A tuple containing the scaled training data, scaled testing data, and the fitted scaler object.
    """
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)
    
    return X_train_scaled, X_test_scaled, scaler
```

```python
# src/train.py
def train_model(x_train: pd.DataFrame, y_train: pd.DataFrame, hyperparameters: dict):
    """
    Trains an XGBoost regressor model.

    Args:
        x_train (pd.DataFrame): Training feature data.
        y_train (pd.DataFrame): Training target data.
        hyperparameters (dict): Dictionary of hyperparameters for the model.

    Returns:
        xgb.XGBRegressor: The trained model object.
    """
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        **hyperparameters
    )
    model.fit(x_train, y_train)
    return model
```

```python
# src/evaluate.py
def gini_coefficient(y_true, y_pred):
    """Calculates the Gini coefficient to measure model ranking ability."""
    if len(y_true) == 0: return 0.0
    df = pd.DataFrame({'true': y_true, 'pred': y_pred}).sort_values('pred', ascending=False)
    df['cumulative_true'] = df['true'].cumsum()
    total_true = df['true'].sum()
    if total_true == 0: return 0.0
    df['cumulative_true_percent'] = df['cumulative_true'] / total_true
    
    area_under_curve = df['cumulative_true_percent'].sum() / len(df)
    return (area_under_curve - 0.5) / 0.5

def evaluate_model(model, x_test: pd.DataFrame, y_test: pd.DataFrame):
    """
    Evaluates the model and returns a dictionary of metrics.

    Args:
        model: The trained model object.
        x_test (pd.DataFrame): Testing feature data.
        y_test (pd.DataFrame): Testing target data.

    Returns:
        dict: A dictionary containing evaluation metrics.
    """
    predictions = model.predict(x_test)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    gini = gini_coefficient(y_test.values.flatten(), predictions)
    
    metrics = {
        "regression_metrics": {
            "rmse": {"value": rmse},
            "gini": {"value": gini}
        }
    }
    return metrics
```

**Infrastructure as Code**
```hcl
# terraform/aws_sagemaker_roles.tf

resource "aws_iam_role" "sagemaker_pipeline_execution_role" {
  name = "sagemaker-pipeline-execution-role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          Service = "sagemaker.amazonaws.com"
        },
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

# Granting broad SageMaker permissions for simplicity in this example.
# In a real production environment, you would scope this down significantly.
resource "aws_iam_role_policy_attachment" "sagemaker_full_access" {
  role       = aws_iam_role.sagemaker_pipeline_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
}

# Policy allowing access to the S3 bucket for artifacts and the Feature Store
resource "aws_iam_policy" "sagemaker_pipeline_custom_policy" {
  name        = "sagemaker-pipeline-s3-featurestore-policy"
  description = "Allows SageMaker pipelines to access project resources"

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        Resource = [
          "arn:aws:s3:::clv-artifacts-bucket",
          "arn:aws:s3:::clv-artifacts-bucket/*"
        ]
      },
      {
        Effect   = "Allow",
        Action   = [
          "sagemaker:DescribeFeatureGroup",
          # Permissions for Athena query to get data from offline store
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults",
          "glue:GetTable"
        ],
        Resource = "*" # Scope down in production
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sagemaker_pipeline_custom_policy_attach" {
  role       = aws_iam_role.sagemaker_pipeline_execution_role.name
  policy_arn = aws_iam_policy.sagemaker_pipeline_custom_policy.arn
}
```

**SageMaker Pipeline Definition**

```python
# pipelines/build_pipeline.py
import sagemaker
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep
from sagemaker.processing import ScriptProcessor, ProcessingInput, ProcessingOutput
from sagemaker.sklearn.estimator import SKLearn
from sagemaker.xgboost.estimator import XGBoost
from sagemaker.workflow.conditions import ConditionLessThanOrEqualTo
from sagemaker.workflow.condition_step import ConditionStep
from sagemaker.workflow.functions import JsonGet
from sagemaker.model_metrics import ModelMetrics, MetricsSource
from sagemaker.workflow.model_step import ModelStep
import boto3

def get_sagemaker_pipeline(role, s3_bucket):
    # Define Processors
    sklearn_processor = ScriptProcessor(
        image_uri='your-account-id.dkr.ecr.eu-west-1.amazonaws.com/sagemaker-scikit-learn:1.0-1', # Replace with your ECR image URI for sklearn
        command=['python3'],
        instance_type='ml.m5.large',
        instance_count=1,
        base_job_name='clv-preprocess',
        role=role
    )

    # 1. Preprocessing Step
    step_preprocess = ProcessingStep(
        name="PreprocessData",
        processor=sklearn_processor,
        inputs=[ProcessingInput(source=f"s3://{s3_bucket}/feature-data/features.csv", destination="/opt/ml/processing/input")],
        outputs=[
            ProcessingOutput(output_name="train", source="/opt/ml/processing/output/train"),
            ProcessingOutput(output_name="test", source="/opt/ml/processing/output/test"),
            ProcessingOutput(output_name="scaler", source="/opt/ml/processing/output/scaler")
        ],
        code="src/preprocess.py"
    )

    # 2. Training Step
    xgb_estimator = XGBoost(
        entry_point="src/train.py",
        role=role,
        instance_count=1,
        instance_type='ml.m5.xlarge',
        framework_version='1.5-1',
        hyperparameters={'max_depth': 5, 'n_estimators': 150}
    )
    
    step_train = TrainingStep(
        name="TrainModel",
        estimator=xgb_estimator,
        inputs={
            "train": sagemaker.inputs.TrainingInput(
                s3_data=step_preprocess.properties.ProcessingOutputConfig.Outputs["train"].S3Output.S3Uri
            )
        }
    )

    # 3. Evaluation Step
    step_evaluate = ProcessingStep(
        name="EvaluateModel",
        processor=sklearn_processor,
        inputs=[
            ProcessingInput(source=step_train.properties.ModelArtifacts.S3ModelArtifacts, destination="/opt/ml/processing/model"),
            ProcessingInput(source=step_preprocess.properties.ProcessingOutputConfig.Outputs["test"].S3Output.S3Uri, destination="/opt/ml/processing/test")
        ],
        outputs=[ProcessingOutput(output_name="evaluation", source="/opt/ml/processing/evaluation")],
        code="src/evaluate.py"
    )

    # 4. Conditional Model Registration Step
    model_metrics = ModelMetrics(
        model_statistics=MetricsSource(
            s3_uri=f"{step_evaluate.properties.ProcessingOutputConfig.Outputs['evaluation'].S3Output.S3Uri}/evaluation.json",
            content_type="application/json"
        )
    )

    # Define a condition to check if RMSE is below a threshold
    cond_lte = ConditionLessThanOrEqualTo(
        left=JsonGet(
            step_name=step_evaluate.name,
            property_file="evaluation.json",
            json_path="regression_metrics.rmse.value"
        ),
        right=250.0  # Your RMSE threshold
    )
    
    # Define the registration step
    # First, create a model package
    model = sagemaker.Model(
        image_uri=xgb_estimator.image_uri,
        model_data=step_train.properties.ModelArtifacts.S3ModelArtifacts,
        sagemaker_session=sagemaker.Session(),
        role=role
    )
    
    step_create_model = ModelStep(
        name="CreateModelPackage",
        model=model,
        model_package_group_name="CLVModelPackageGroup" # Must be created beforehand
    )

    step_conditional_register = ConditionStep(
        name="CheckEvaluationAndRegister",
        conditions=[cond_lte],
        if_steps=[step_create_model],
        else_steps=[],
    )

    # Create and return the pipeline
    pipeline = Pipeline(
        name="CLV-Training-Pipeline",
        parameters=[],
        steps=[step_preprocess, step_train, step_evaluate, step_conditional_register],
        sagemaker_session=sagemaker.Session()
    )
    return pipeline

if __name__ == "__main__":
    # This part is for creating/updating the pipeline definition in SageMaker
    sagemaker_role_arn = "arn:aws:iam::ACCOUNT_ID:role/sagemaker-pipeline-execution-role" # Replace
    s3_artifact_bucket = "clv-artifacts-bucket" # Replace
    
    pipeline = get_sagemaker_pipeline(role=sagemaker_role_arn, s3_bucket=s3_artifact_bucket)
    pipeline.upsert(role_arn=sagemaker_role_arn)
```

**Airflow DAG**

```python
# pipelines/dag_trigger_training.py
from airflow import DAG
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerPipelineOperator
from datetime import datetime

with DAG(
    dag_id="clv_trigger_sagemaker_training",
    start_date=datetime(2025, 1, 1),
    schedule_interval="@weekly",
    catchup=False,
    tags=['clv', 'training', 'sagemaker'],
) as dag:
    trigger_sagemaker_pipeline = SageMakerPipelineOperator(
        task_id="trigger_training_pipeline",
        pipeline_name="CLV-Training-Pipeline",
        aws_conn_id="aws_default",
    )
```

**Integration Test**

```python
# tests/integration/test_training_pipeline_integration.py
import pytest
import boto3
from airflow.models.dagbag import DagBag
from airflow.models.dagrun import DagRun
from airflow.utils.state import State
import time

@pytest.mark.integration
def test_training_pipeline_dag_runs_successfully():
    """
    Tests the end-to-end execution by triggering the Airflow DAG
    and monitoring the SageMaker Pipeline.
    """
    # Load the Airflow DAG
    dagbag = DagBag(dag_folder='pipelines/', include_examples=False)
    dag = dagbag.get_dag('clv_trigger_sagemaker_training')
    assert dag is not None, "DAG not found"

    # Manually trigger the DAG
    dag.clear()
    dag_run = dag.create_dagrun(
        state=State.RUNNING,
        run_id=f"test_run_{int(time.time())}",
        conf={},
    )
    
    print(f"Triggered DAG run: {dag_run.run_id}")

    # Monitor the DAG run and the underlying SageMaker Pipeline
    # This is a simplified check. A real-world test would need more robust polling.
    sagemaker_client = boto3.client("sagemaker")
    
    time.sleep(60) # Give Airflow time to start the SageMaker Pipeline

    # Find the latest pipeline execution
    executions = sagemaker_client.list_pipeline_executions(
        PipelineName="CLV-Training-Pipeline",
        SortBy="CreationTime",
        SortOrder="Descending"
    )['PipelineExecutionSummaries']
    
    assert len(executions) > 0, "No SageMaker pipeline execution found"
    
    latest_execution_arn = executions[0]['PipelineExecutionArn']
    print(f"Monitoring SageMaker Pipeline execution: {latest_execution_arn}")

    # Poll until the pipeline execution is complete
    timeout = time.time() + 60*30 # 30 minutes timeout
    while time.time() < timeout:
        response = sagemaker_client.describe_pipeline_execution(
            PipelineExecutionArn=latest_execution_arn
        )
        status = response['PipelineExecutionStatus']
        if status in ['Succeeded', 'Failed', 'Stopped']:
            break
        print(f"Pipeline status: {status}. Waiting...")
        time.sleep(30)

    assert status == 'Succeeded', f"SageMaker pipeline did not succeed. Final status: {status}"

    # ASSERTION: Check if a new model was registered in the MLflow Model Registry
    # (This would require MLflow client setup and querying logic)
    # mlflow_client = mlflow.tracking.MlflowClient()
    # versions = mlflow_client.get_latest_versions("clv-model")
    # assert len(versions) > 0, "No model was registered in MLflow"
```



#### **ML Training Pipeline CI Workflow**

Here is the plan and the corresponding GitHub Actions workflow file.

1.  **Trigger:** The workflow will be automatically triggered on every `pull_request` to the `main` branch. This ensures that no code can be merged without passing all quality checks.
2.  **Environment Setup:** It will check out the code and set up a clean Python environment with all necessary dependencies. It will also securely configure AWS credentials to allow for interaction with AWS services during testing.
3.  **Static Analysis:** It will run fast, static checks first, including code linting (`flake8`) and formatting checks (`black`), to catch basic errors without needing to execute any code.
4.  **Unit Testing:** It will execute the `pytest` suite located in the `tests/unit/` directory. This validates that the core logic within our Python scripts (`preprocess.py`, `train.py`, `evaluate.py`) works as expected in isolation.
5.  **Pipeline Integrity & Integration Testing:** This is the most crucial part. It validates that all the pieces of our training pipeline work together.
    *   **Terraform Validation:** It will run `terraform validate` and `tflint` on our infrastructure code to catch syntax errors or non-best-practice configurations.
    *   **SageMaker Pipeline Definition Test:** It will execute our `pipelines/build_pipeline.py` script. The script will be designed to build the SageMaker Pipeline object in memory without actually deploying it. This acts as a powerful integration test, confirming that all the SDK calls and parameter integrations are correct and that the pipeline definition can be successfully compiled.

If all these steps pass, the pull request will show a green checkmark, giving the repository maintainer confidence that the proposed changes are safe to merge.


```yaml
# .github/workflows/ci_training_pipeline.yml

name: "CI for ML Training Pipeline"

on:
  pull_request:
    branches:
      - main
    paths:
      - 'src/**'
      - 'pipelines/**'
      - 'tests/**'
      - 'terraform/**'
      - '.github/workflows/ci_training_pipeline.yml'

jobs:
  validate-training-pipeline:
    runs-on: ubuntu-latest
    
    permissions:
      id-token: write  # Required for OIDC AWS authentication
      contents: read
      
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python 3.9
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Install Python Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt # Assuming a requirements.txt in the root
          pip install -r tests/requirements.txt # For test-specific libraries like pytest, moto

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions-ci-role # Replace with your IAM role for GitHub Actions
          aws-region: eu-west-1

      - name: Run Linting and Formatting Checks
        run: |
          pip install flake8 black
          flake8 src/ pipelines/ tests/
          black --check src/ pipelines/ tests/

      - name: Run Unit Tests
        run: |
          pytest tests/unit/

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Validate Infrastructure as Code (Terraform)
        run: |
          cd terraform
          terraform init -backend=false
          terraform validate
          tflint --recursive
        
      - name: Validate SageMaker Pipeline Definition
        run: |
          # This step runs the pipeline build script.
          # The script should be designed to build the pipeline object
          # and perform validations without deploying.
          # We can add a --dry-run flag to our script for this purpose.
          python pipelines/build_pipeline.py --role-arn ${{ secrets.SAGEMAKER_EXECUTION_ROLE_ARN }} --bucket-name ${{ secrets.ARTIFACT_BUCKET }} --dry-run
```

#### **ML Training Pipeline CD Workflow Plan**

1.  **Trigger:** The workflow is triggered on every `push` to the `main` branch.
2.  **Deploy Pipeline to Staging:** It runs the `pipelines/build_pipeline.py` script without the `--dry-run` flag, pointing to the staging AWS environment. This `upsert` action creates or updates the SageMaker Pipeline definition.
3.  **Run Pipeline in Staging:** It then makes an AWS API call to start an execution of this newly deployed SageMaker Pipeline.
4.  **Monitor Run:** The final step is to wait for the pipeline execution to complete and check its status. If the pipeline run fails in Staging, the entire CD workflow fails.

```yaml
# .github/workflows/cd_training_pipeline.yml

name: "CD for ML Training Pipeline"

on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'pipelines/**'
      - 'terraform/**'
      
jobs:
  deploy-and-run-in-staging:
    runs-on: ubuntu-latest
    environment: staging # This links to GitHub Environments for managing secrets
    
    permissions:
      id-token: write
      contents: read
      
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python 3.9
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Install Python Dependencies
        run: |
          pip install -r requirements.txt
          pip install boto3

      - name: Configure Staging AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.STAGING_AWS_ROLE_ARN }} # Secret stored in GitHub Environment
          aws-region: eu-west-1

      - name: Deploy SageMaker Pipeline to Staging
        id: deploy_pipeline
        run: |
          echo "Deploying SageMaker Pipeline definition to Staging..."
          python pipelines/build_pipeline.py \
            --role-arn ${{ secrets.STAGING_SAGEMAKER_ROLE_ARN }} \
            --bucket-name ${{ secrets.STAGING_ARTIFACT_BUCKET }}
      
      - name: Start SageMaker Pipeline Execution in Staging
        id: start_execution
        run: |
          echo "Starting pipeline execution..."
          EXECUTION_ARN=$(aws sagemaker start-pipeline-execution \
            --pipeline-name CLV-Training-Pipeline \
            --query 'PipelineExecutionArn' \
            --output text)
          echo "Pipeline execution started: $EXECUTION_ARN"
          echo "execution_arn=$EXECUTION_ARN" >> $GITHUB_OUTPUT

      - name: Wait for Pipeline Execution to Complete
        run: |
          echo "Waiting for pipeline execution to complete..."
          aws sagemaker wait pipeline-execution-complete --pipeline-execution-arn ${{ steps.start_execution.outputs.execution_arn }}
          
          echo "Checking final status..."
          STATUS=$(aws sagemaker describe-pipeline-execution --pipeline-execution-arn ${{ steps.start_execution.outputs.execution_arn }} --query 'PipelineExecutionStatus' --output text)
          
          if [ "$STATUS" != "Succeeded" ]; then
            echo "Pipeline execution failed with status: $STATUS"
            exit 1
          fi
          echo "Pipeline execution succeeded!"
```


### **Inference Pipeline**

#### **1. High-Level Strategy: Choosing the Deployment Pattern**

*   **Business Need:** The primary goal is to provide updated CLV scores for the marketing and CRM teams to design weekly or monthly campaigns.
*   **Latency Requirement:** Predictions are not needed in real-time. A delay of several hours is perfectly acceptable.
*   **Data Freshness:** Features are updated daily, so predictions based on daily-refreshed data are sufficient.

**Decision:** Based on these requirements, we will implement a **Batch Prediction (Asynchronous Inference)** strategy. This pattern is ideal for our use case because it is "simpler to implement, cost-effective for large volumes, and allows for high throughput."

#### **2. Architectural Plan: Components and Tooling**

| Component / Consideration | Decision / Implementation Choice | Rationale (Applying the Guide) |
| :--- | :--- | :--- |
| **Workflow Orchestrator** | **Apache Airflow (on AWS MWAA)** | Aligns with our existing tech stack for the training pipeline. Airflow is the industry standard for scheduling and managing complex, multi-step batch jobs, as highlighted in the guide. |
| **Batch Prediction Job/Processor**| **Amazon SageMaker Batch Transform** | This is a fully managed AWS service purpose-built for this task. It eliminates the need to manage our own compute cluster for inference, which is more cost-effective and operationally simpler than using a persistent EMR cluster for this job. It directly aligns with the "Cloud Services" tooling mentioned in the guide. |
| **Model Source** | **MLflow Model Registry** | The pipeline will be configured to automatically fetch the model version currently tagged as **"Production"** from our MLflow Model Registry. This ensures a governed, auditable link between a production run and a specific, approved model artifact |
| **Feature Source** | **Amazon SageMaker Feature Store** | To prevent training-serving skew, the Batch Transform job will not re-calculate features. Instead, it will retrieve the latest pre-calculated features for each customer directly from the SageMaker Feature Store. This guarantees consistency between the features used for training and inference. |
| **Input Data Source** | **S3 Bucket** | A simple text file containing the list of all active `CustomerID`s to be scored will be the input for the Batch Transform job. |
| **Prediction Store** | **1. S3 Bucket (Primary Output)** <br> **2. Data Warehouse (e.g., Redshift)** | The Batch Transform job will write its output (a CSV/Parquet file of `CustomerID`, `CLV_Prediction`, `ModelVersion`, `PredictionTimestamp`) to a designated S3 bucket. A final step in the Airflow DAG will then load this data into the main data warehouse, making it accessible to BI tools and marketing platforms. |

#### **3. Core Pipeline Artifacts to Be Implemented**

1.  **Inference Script (`src/batch_inference.py`):** A Python script containing the core transformation logic. This script will define how SageMaker Batch Transform should handle incoming data, load the model, fetch features, and generate a prediction.
2.  **Airflow DAG (`pipelines/dag_batch_inference.py`):** The orchestration logic that defines the end-to-end pipeline:
    *   **Trigger:** Runs on a weekly schedule.
    *   **Steps:**
        1.  Fetch the S3 URI of the "Production" model from the MLflow Model Registry.
        2.  Initiate the SageMaker Batch Transform job, passing the model URI and the location of the active customer list.
        3.  Monitor the job until completion.
        4.  Upon success, trigger a subsequent task to load the predictions from the output S3 bucket into the data warehouse.
3.  **Infrastructure as Code (`terraform/aws_sagemaker_inference.tf`):** Terraform code to provision the necessary IAM roles and permissions for the SageMaker Batch Transform job to access S3, the Feature Store, and the Model Registry.
4.  **Architecture Diagram (Mermaid Code):** A clear diagram illustrating the entire batch inference flow.

#### **4. Testing the Inference Pipeline in a Staging Environment**

Following the principles in the guide, we must test the inference pipeline's code and infrastructure, not just the model.

*   **Objective:** To validate that the entire pipeline mechanism works correctly before deploying it to production. This includes testing the Airflow DAG logic, the inference script, and all IAM permissions.
*   **Process:**
    1.  A **staging version of the Airflow DAG** will be deployed to our staging Airflow instance.
    2.  This DAG will be configured to use a **"Staging" tagged model** from the MLflow registry.
    3.  The pipeline will be run against a **small, representative sample** of staging customer data.
*   **Success Criteria:**
    *   The DAG completes successfully without any operational errors.
    *   The SageMaker Batch Transform job runs without permission or code errors.
    *   The output predictions are written to the staging S3 bucket in the correct format and schema.

#### **5. CI/CD for the Inference Pipeline**

As discussed, this pipeline requires its own CI/CD workflow, separate from the training pipeline.

*   **Continuous Integration (CI):** Triggered on a pull request with changes to the inference pipeline code.
    *   Runs static analysis and unit tests on `src/batch_inference.py`.
    *   Validates the Airflow DAG syntax.
    *   Validates the Terraform configuration for inference resources.
*   **Continuous Delivery (CD):** Triggered on a merge to the `main` branch.
    *   Deploys the updated Airflow DAG to the **Staging Airflow environment**.
    *   Automatically runs the **Staging Test** described in the section above to verify the full pipeline execution.
    *   Requires manual approval to deploy the DAG to the **Production Airflow environment**.

This plan provides a robust, secure, and cost-effective solution for our batch inference needs, directly applying the best practices for Model Serving

#### Implementation

**Batch Inference Pipeline Architecture Diagram**
<img src="../_static/past_experiences/ecom_cltv/inference_pipeline.svg" style="background-color: #FCF1EF;"/>

**Infrastructure as Code**

This Terraform code provisions the IAM Role that the SageMaker jobs (both the Transform job and the model object itself) will use.

```hcl
# terraform/aws_sagemaker_inference.tf

resource "aws_iam_role" "sagemaker_inference_role" {
  name = "sagemaker-inference-execution-role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          Service = "sagemaker.amazonaws.com"
        },
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

# This policy grants the necessary permissions for the batch transform job
resource "aws_iam_policy" "sagemaker_inference_policy" {
  name        = "sagemaker-inference-policy"
  description = "Allows SageMaker to run batch inference jobs for the CLV project"

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
            "s3:GetObject",
            "s3:PutObject",
            "s3:ListBucket"
        ],
        Resource = [
            "arn:aws:s3:::clv-artifacts-bucket/*", # Access to model artifacts
            "arn:aws:s3:::clv-inference-data-bucket/*" # Access to input/output data
        ]
      },
      {
        Effect = "Allow",
        Action = [
            "sagemaker:GetRecord"
        ],
        Resource = [
            "arn:aws:sagemaker:eu-west-1:${data.aws_caller_identity.current.account_id}:feature-group/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:CreateLogGroup",
            "logs:DescribeLogStreams"
        ],
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sagemaker_inference_policy_attach" {
  role       = aws_iam_role.sagemaker_inference_role.name
  policy_arn = aws_iam_policy.sagemaker_inference_policy.arn
}
```

**Inference Script**

This is the core logic that runs inside the SageMaker Batch Transform job. It handles loading the model, fetching features from the Feature Store, and making predictions.

```python
# src/batch_inference.py
import os
import joblib
import boto3
import json
import pandas as pd

def model_fn(model_dir):
    """
    Loads the model and the scaler from the model directory.
    SageMaker will place the contents of the model.tar.gz here.
    """
    print("Loading model and scaler...")
    model = joblib.load(os.path.join(model_dir, "model.joblib"))
    scaler = joblib.load(os.path.join(model_dir, "scaler.joblib")) # Assumes scaler is packaged with the model
    
    # Initialize boto3 client in the global scope for reuse
    # The region should be dynamically available in the SageMaker environment
    region = os.environ.get("AWS_REGION")
    sagemaker_fs_client = boto3.client('sagemaker-featurestore-runtime', region_name=region)
    
    # Define feature group name from environment variable or hardcode
    feature_group_name = os.environ.get("FEATURE_GROUP_NAME", "clv-feature-group-v1")

    return {
        "model": model,
        "scaler": scaler,
        "fs_client": sagemaker_fs_client,
        "feature_group_name": feature_group_name
    }

def input_fn(request_body, request_content_type):
    """
    Parses the input data. The input is expected to be a file where each line is a JSON object
    containing a 'CustomerID'.
    """
    if request_content_type == 'application/json':
        customer_ids = [json.loads(line)['CustomerID'] for line in request_body.strip().split('\n')]
        return customer_ids
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(customer_ids, model_artifacts):
    """
    For each customer, fetches features from the Feature Store, scales them,
    and then makes a prediction.
    """
    model = model_artifacts["model"]
    scaler = model_artifacts["scaler"]
    fs_client = model_artifacts["fs_client"]
    feature_group_name = model_artifacts["feature_group_name"]
    
    # Get the feature names from the scaler object
    feature_names = scaler.feature_names_in_

    all_features = []
    processed_customer_ids = []

    for customer_id in customer_ids:
        try:
            response = fs_client.get_record(
                FeatureGroupName=feature_group_name,
                RecordIdentifierValueAsString=str(customer_id)
            )
            if 'Record' not in response:
                print(f"No record found for customer {customer_id}. Skipping.")
                continue

            # Convert feature store record to a dictionary
            record = {item['FeatureName']: item['ValueAsString'] for item in response['Record']}
            
            # Ensure all required features are present
            features_for_model = [float(record.get(name, 0)) for name in feature_names]
            all_features.append(features_for_model)
            processed_customer_ids.append(customer_id)

        except Exception as e:
            print(f"Error fetching features for customer {customer_id}: {e}. Skipping.")

    if not all_features:
        return {"predictions": []}

    # Create a DataFrame and scale the features
    features_df = pd.DataFrame(all_features, columns=feature_names)
    scaled_features = scaler.transform(features_df)
    
    # Make predictions
    predictions = model.predict(scaled_features)
    
    # Combine customer IDs with their predictions
    output = [
        {"CustomerID": cid, "CLV_Prediction": float(pred)}
        for cid, pred in zip(processed_customer_ids, predictions)
    ]
    
    return {"predictions": output}


def output_fn(prediction_output, accept):
    """
    Formats the predictions into a JSON Lines format.
    """
    if accept == "application/json":
        return '\n'.join(json.dumps(rec) for rec in prediction_output['predictions']), accept
    
    raise ValueError(f"Unsupported accept type: {accept}")
```

**Unit Tests**
This test validates the batch_inference.py script using mocks.

```python
# tests/unit/test_batch_inference.py
import pytest
from unittest.mock import MagicMock, patch
from src.batch_inference import predict_fn, input_fn

@pytest.fixture
def mock_model_artifacts():
    """Mocks the model artifacts dictionary."""
    # Mock scaler
    mock_scaler = MagicMock()
    mock_scaler.feature_names_in_ = ['feature1', 'feature2']
    mock_scaler.transform.return_value = [[0.5, 0.5], [-0.5, -0.5]] # Dummy scaled data
    
    # Mock model
    mock_model = MagicMock()
    mock_model.predict.return_value = [500.50, 150.25]
    
    # Mock feature store client
    mock_fs_client = MagicMock()
    # Simulate response for two customers
    mock_fs_client.get_record.side_effect = [
        {'Record': [{'FeatureName': 'feature1', 'ValueAsString': '10'}, {'FeatureName': 'feature2', 'ValueAsString': '20'}]},
        {'Record': [{'FeatureName': 'feature1', 'ValueAsString': '1'}, {'FeatureName': 'feature2', 'ValueAsString': '2'}]}
    ]

    return {
        "model": mock_model,
        "scaler": mock_scaler,
        "fs_client": mock_fs_client,
        "feature_group_name": "test-fg"
    }

def test_input_fn():
    """Tests if the input parsing works correctly."""
    request_body = '{"CustomerID": 101}\n{"CustomerID": 102}'
    customer_ids = input_fn(request_body, 'application/json')
    assert customer_ids == [101, 102]

def test_predict_fn(mock_model_artifacts):
    """Tests the core prediction logic."""
    customer_ids = [101, 102]
    predictions_output = predict_fn(customer_ids, mock_model_artifacts)
    
    # Assert feature store was called twice
    assert mock_model_artifacts["fs_client"].get_record.call_count == 2
    
    # Assert model predict was called once with the scaled data
    mock_model_artifacts["model"].predict.assert_called_once()
    
    # Assert the output is correctly formatted
    expected_output = {
        "predictions": [
            {"CustomerID": 101, "CLV_Prediction": 500.50},
            {"CustomerID": 102, "CLV_Prediction": 150.25}
        ]
    }
    assert predictions_output == expected_output
```

> unittest MagicMock return value vs side effect
>
> Use return_value when your mock needs to provide a single, consistent return value.
>
> Use side_effect for more complex and dynamic behaviors, including:
> - Providing a sequence of return values.
> - Raising exceptions to test error handling.
> - Executing custom logic to determine the return value or perform other actions.
>
> Choosing between return_value and side_effect depends on the specific scenario you are trying to test and how much control you need over the mocked object's behavior.

**Airflow DAG**

This DAG orchestrates the entire weekly batch prediction job.

```python
# pipelines/dag_batch_inference.py
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTransformOperator
from airflow.models.param import Param
from datetime import datetime
import mlflow

# --- Constants ---
MLFLOW_TRACKING_URI = "http://your-mlflow-server:5000" # Should be an Airflow Variable/Connection
MODEL_NAME = "clv-prediction-model"
SAGEMAKER_ROLE = "arn:aws:iam::ACCOUNT_ID:role/sagemaker-inference-execution-role"
INPUT_S3_URI = "s3://clv-inference-data-bucket/input/active_customers.jsonl"
OUTPUT_S3_URI = "s3://clv-inference-data-bucket/output/"

@dag(
    dag_id="clv_batch_inference_pipeline",
    start_date=datetime(2025, 1, 1),
    schedule_interval="@weekly",
    catchup=False,
    doc_md="DAG to run weekly batch inference for CLV prediction.",
    tags=["clv", "inference"],
)
def batch_inference_dag():

    @task
    def get_production_model_uri() -> str:
        """Fetches the S3 URI of the latest model in the 'Production' stage."""
        client = mlflow.tracking.MlflowClient(tracking_uri=MLFLOW_TRACKING_URI)
        latest_versions = client.get_latest_versions(MODEL_NAME, stages=["Production"])
        if not latest_versions:
            raise ValueError(f"No model in Production stage found for '{MODEL_NAME}'")
        
        prod_model = latest_versions[0]
        print(f"Found production model: Version {prod_model.version}, URI: {prod_model.source}")
        return prod_model.source

    model_uri = get_production_model_uri()
    
    # In a real pipeline, the model object in SageMaker should be created separately.
    # For this operator, we assume a SageMaker model object exists.
    # The operator just creates the transform job.
    run_batch_transform = SageMakerTransformOperator(
        task_id="run_sagemaker_batch_transform",
        config={
            "TransformJobName": f"clv-batch-inference-{{{{ ds_nodash }}}}",
            "ModelName": "clv-sagemaker-model-name", # Name of the model in SageMaker
            "TransformInput": {
                "DataSource": {"S3DataSource": {"S3DataType": "S3Prefix", "S3Uri": INPUT_S3_URI}},
                "ContentType": "application/json",
                "SplitType": "Line",
            },
            "TransformOutput": {
                "S3OutputPath": OUTPUT_S3_URI,
                "Accept": "application/json",
                "AssembleWith": "Line",
            },
            "TransformResources": {"InstanceType": "ml.m5.large", "InstanceCount": 1},
        },
        aws_conn_id="aws_default",
    )
    
    # This task would load the S3 output into the data warehouse
    @task
    def load_predictions_to_dwh(s3_output_path: str):
        print(f"Simulating load of data from {s3_output_path} into Data Warehouse.")
        # Add pandas/boto3 logic here to read from S3 and write to Redshift/Snowflake
        return "Load complete."

    model_uri >> run_batch_transform >> load_predictions_to_dwh(OUTPUT_S3_URI)

batch_inference_dag()
```

**Integration Test**

This test triggers the DAG and validates the output in a live staging environment.

```python
# tests/integration/test_inference_pipeline_integration.py
import pytest
import boto3
from airflow.api.client.local_client import Client
import time

DAG_ID = "clv_batch_inference_pipeline"
OUTPUT_BUCKET = "clv-inference-data-bucket-staging" # Use a staging bucket
OUTPUT_PREFIX = "output/"

@pytest.mark.integration
def test_inference_dag_end_to_end():
    # Setup: Ensure the output location is clean
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(OUTPUT_BUCKET)
    bucket.objects.filter(Prefix=OUTPUT_PREFIX).delete()
    
    # Act: Trigger the DAG
    c = Client(None, None)
    run_id = f"integration_test_{int(time.time())}"
    c.trigger_dag(dag_id=DAG_ID, run_id=run_id)

    # Poll for completion
    timeout = time.time() + 60 * 15 # 15 minute timeout
    final_state = None
    while time.time() < timeout:
        dag_run = c.get_dag_run(dag_id=DAG_ID, run_id=run_id)
        if dag_run.state in ['success', 'failed']:
            final_state = dag_run.state
            break
        print(f"DAG state is {dag_run.state}. Waiting...")
        time.sleep(30)
        
    # Assert DAG success
    assert final_state == 'success', f"DAG run failed with state: {final_state}"

    # Assert: Check if the output file was created in S3
    objects = list(bucket.objects.filter(Prefix=OUTPUT_PREFIX))
    assert len(objects) > 0, "No output file was found in the S3 bucket."
    
    print(f"Integration test passed. Output file found: {objects[0].key}")
```

**GitHub Actions CI/CD Workflow**
This workflow validates and deploys the inference pipeline code.

```python
# .github/workflows/cicd_inference_pipeline.yml

name: "CI/CD for Batch Inference Pipeline"

on:
  push:
    branches:
      - main
    paths:
      - 'src/batch_inference.py'
      - 'pipelines/dag_batch_inference.py'
      - 'terraform/**' # Now triggers on infrastructure changes as well
      - 'tests/**'
      - '.github/workflows/cicd_inference_pipeline.yml'
  pull_request:
    branches:
      - main

jobs:
  ci-checks:
    name: "Continuous Integration"
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Install Dependencies
        run: |
          pip install -r requirements.txt
          pip install -r tests/requirements.txt
      
      - name: Run Linting and Formatting Checks
        run: |
          pip install flake8 black
          flake8 src/ pipelines/ tests/
          black --check src/ pipelines/ tests/

      - name: Run Unit Tests
        run: pytest tests/unit/
  
  cd-staging:
    name: "Continuous Delivery to Staging"
    needs: ci-checks
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging # Links to GitHub secrets for the staging environment

    permissions:
      id-token: write
      contents: read
      
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        
      - name: Configure Staging AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.STAGING_AWS_ROLE_ARN }}
          aws-region: eu-west-1

      - name: Terraform Init (Staging)
        id: init
        run: |
          cd terraform
          # The -backend-config flag points to a file specifying the S3 bucket/key for staging's state
          terraform init -backend-config=staging.backend.hcl

      - name: Terraform Apply (Staging)
        id: apply
        run: |
          cd terraform
          # The -var-file flag points to variables specific to the staging env (e.g., bucket names)
          terraform apply -auto-approve -var-file=staging.tfvars

      - name: Install Python Test Dependencies
        run: |
          pip install -r requirements.txt
          pip install -r tests/integration/requirements.txt
          
      - name: Deploy DAG to Staging Airflow
        run: |
          # This script would sync your DAGs folder with Airflow's DAGs folder in S3
          echo "Syncing pipelines/dag_batch_inference.py to Staging Airflow..."
          # Example: aws s3 sync pipelines/ s3://your-staging-airflow-dags-bucket/ --exclude "*" --include "dag_batch_inference.py"
          
      - name: Run Integration Test in Staging
        run: pytest tests/integration/test_inference_pipeline_integration.py
```


### **Monitoring & Observability**

#### **1. Guiding Philosophy and Approach**

Our approach will be twofold:

1.  **Monitoring (Answering "What"):** We will implement automated systems to track a predefined set of metrics covering data quality, system health, and model performance proxies. This is our early warning system, designed to be the first to know when a known problem occurs.
2.  **Observability (Answering "Why"):** We will collect the necessary data (logs, feature values, SHAP values) to enable deep-dive analysis when an alert is triggered. This allows us to move beyond knowing *that* something is wrong to understanding *why* it's wrong, which is crucial for effective debugging and resolution.

Our goal is to create a system that minimizes **Time to Detection (TTD)** and **Time to Resolution (TTR)** for any issues that arise in our production ML system.

#### **2. Tech Stack for Monitoring & Observability**

| Component | Chosen Tool/Framework | Rationale (Based on the Guide & Our Stack) |
| :--- | :--- | :--- |
| **Data Quality Validation** | **Great Expectations** | Integrated directly into our Airflow data pipelines. Allows us to define "unit tests for data" and stop bad data from ever reaching the feature store |
| **Drift & Performance Monitoring**| **Amazon SageMaker Model Monitor** | The most tightly integrated solution for our SageMaker-based pipelines. It can automatically compare production data against a baseline (our training data) to detect both data and prediction drift. |
| **Infrastructure & System Health**| **Amazon CloudWatch** | The native AWS solution for tracking operational metrics like job duration (latency), error rates, and resource utilization for our SageMaker jobs and Airflow DAGs. |
| **Dashboards & Visualization** | 1. **Amazon CloudWatch Dashboards** <br> 2. **BI Tool (Tableau, QuickSight)** | CloudWatch will be used for real-time operational health dashboards (for the MLOps team). A BI tool will be used for higher-level model performance and business KPI dashboards (for data scientists and product managers). |
| **Alerting & Notifications**| **Amazon CloudWatch Alarms** | Integrated with CloudWatch metrics, these will trigger notifications based on predefined thresholds. |
| **Notification Channels**| **Slack & PagerDuty** | Slack for medium-priority notifications (e.g., moderate drift) and PagerDuty for high-priority, critical alerts that require immediate attention (e.g., pipeline failure). |
| **Explainability & Debugging** | **SHAP & S3/Data Warehouse** | We will generate SHAP values during model evaluation and log them alongside predictions. This allows us to query and analyze the drivers of specific predictions, enabling deep observability. |

#### **3. Detailed Monitoring Plan**

##### **a) Data Quality Monitoring (The Foundation)**

*   **Where:** Integrated into our Airflow **Data Ingestion** and **Feature Engineering** DAGs.
*   **Tool:** Great Expectations.
*   **Checks to Implement:**
    *   **Schema Validation:** The number of columns, column names, and column types must match the expected schema.
    *   **Null Rates:** The percentage of missing values for critical features (e.g., `total_spend`, `recency`) must not exceed a threshold (e.g., 5%).
    *   **Range Checks:** Numerical features must fall within valid ranges (e.g., `SalePrice` must be > 0).
    *   **Type Matching:** Ensure features expected to be numerical are not strings.
    *   **Cardinality Checks:** Alert if the number of unique categories for features like `country` or `acquisition_channel` changes unexpectedly.

##### **b) Data & Prediction Drift Monitoring (Proxy for Performance)**

*   **Challenge:** Our ground truth (actual 12-month spend) is severely delayed. Therefore, monitoring input and output distributions is our most critical leading indicator of performance degradation.
*   **Tool:** Amazon SageMaker Model Monitor.
*   **Baseline:** The training dataset used to build the current production model.

| Drift Type | What We'll Track | Metric | Why It's Important |
| :--- | :--- | :--- | :--- |
| **Input Drift (Covariate Shift)**| Distribution of key input features (`recency`, `frequency`, `monetary`, `total_spend_90d`). | **Population Stability Index (PSI)** | Alerts us if the fundamental characteristics of our customer base are changing. This is a direct application of the techniques in Section V-C of the guide. |
| **Prediction Drift**| Distribution of the model's output CLV scores (`P(model_output)`). | **Population Stability Index (PSI)** | A powerful signal that the model's behavior is changing, which could be due to input drift or concept drift. If the model starts predicting much higher or lower on average, we need to investigate. |

##### **c) Model Performance Monitoring**

*   **Challenge:** True performance (RMSE against 12-month spend) is a lagging indicator. We must use proxy metrics.
*   **Metrics to Track:**
    *   **Primary Proxy Metric:** Correlation between **predicted 12-month CLV** and **actual 30-day customer spend**. We'll calculate this monthly. While not perfect, a drop in this correlation is a strong signal that the model's predictive power is weakening.
    *   **Business KPI Slices:** Track key business metrics for cohorts defined by the model's predictions. For example:
        *   Average Order Value (AOV) for customers in the "Top 10% Predicted CLV" vs. "Bottom 50%".
        *   30-day churn rate for the "Top 10% Predicted CLV" cohort.
    *   **Long-Term Ground Truth:** On a quarterly basis, calculate the true RMSE and Gini Coefficient for the cohort of customers whose 12-month window has just completed. This validates our model's long-term accuracy.

##### **d) System Health Monitoring (Operational)**

*   **Tool:** Amazon CloudWatch.
*   **Metrics to Track:**
    *   **Airflow DAGs:** Success/failure status of all pipeline runs.
    *   **SageMaker Jobs (Training & Inference):** Job duration (latency), error rates, CPU/Memory utilization.

#### **4. Observability & Debugging Plan**

| Scenario | Observability Workflow |
| :--- | :--- |
| **A "High Prediction Drift" alert is triggered.**| 1. **Check Input Drift Dashboards:** Is the prediction drift caused by a significant shift in one or more input features? (e.g., a marketing campaign brought in a new demographic, causing `recency` to drop). <br> 2. **Analyze Slice Performance:** Did the drift disproportionately affect a specific segment (e.g., customers from a new country)? |
| **The business team asks "Why was this specific customer predicted to have a high CLV?"** | 1. **Query Prediction Logs:** Retrieve the saved prediction and associated SHAP values for that `CustomerID`. <br> 2. **Provide Local Explanation:** Use the SHAP values to explain which features (e.g., high frequency, large recent purchases) contributed most to that individual's score. This builds trust and provides actionable insights. |
| **The "Top 10% Predicted CLV" cohort has a high churn rate.**| 1. **Root Cause with SHAP:** Analyze the aggregated SHAP values for this cohort. Is the model over-reliant on a feature that isn't a true indicator of loyalty for this segment? <br> 2. **Identify Data Quality Issues:** Check if this cohort has data quality problems that are misleading the model. |

#### **5. Alerting Strategy**

| Priority | Channel | Alert Condition |
| :--- | :--- | :--- |
| **High** | PagerDuty | - Any ML pipeline (training or inference) fails completely. <br> - Critical data quality validation fails (e.g., schema mismatch). |
| **Medium** | Slack | - PSI for Prediction Drift > 0.25. <br> - PSI for a key input feature > 0.25. <br> - 30-day proxy metric (correlation) drops by > 20%. |
| **Low** | Email / Dashboard | - PSI for any drift metric is between 0.1 and 0.25. <br> - A non-critical data quality check fails (e.g., slight increase in nulls). |

#### **6. Dashboard Design**

1.  **MLOps Team Dashboard (on CloudWatch):**
    *   **Focus:** Real-time system and data health.
    *   **Widgets:**
        *   Pipeline Status (Green/Red indicators for Airflow DAGs).
        *   SageMaker Job Durations (Line graphs).
        *   Input Feature Drift Scores (PSI over time).
        *   Prediction Drift Score (PSI over time).
        *   Data Quality Alerts (List of recent validation failures).

2.  **Data Science & Product Dashboard (on Tableau/QuickSight):**
    *   **Focus:** Model performance and business impact.
    *   **Widgets:**
        *   Distribution of CLV predictions over time (histogram/density plot).
        *   Proxy Metric: Correlation of Predicted CLV vs. Actual 30-Day Spend (Line graph).
        *   Business KPIs by Prediction Cohort (Bar charts for AOV, Churn Rate).
        *   Deep Dive: Slicing performance by country, acquisition channel, etc.
        *   Global Feature Importance (Aggregated SHAP values).

**Drift Monitoring (Custom Batch Solution)**

This script will be run by a SageMaker Processing Job. It calculates drift metrics and produces a JSON report.

```python
# src/run_drift_check.py
import argparse
import pandas as pd
import numpy as np
import json
import os
from scipy.stats import ks_2samp

def calculate_psi(baseline: pd.Series, current: pd.Series, bins=10) -> float:
    """Calculates the Population Stability Index (PSI) for a numerical series."""
    # Define bins based on the baseline distribution
    baseline_bins = pd.cut(baseline, bins=bins, retbins=True)[1]
    
    baseline_dist = pd.cut(baseline, bins=baseline_bins).value_counts(normalize=True)
    current_dist = pd.cut(current, bins=baseline_bins).value_counts(normalize=True)

    # Align distributions and fill missing bins with a small value to avoid division by zero
    psi_df = pd.DataFrame({'baseline': baseline_dist, 'current': current_dist}).fillna(1e-6)
    
    psi_df['psi'] = (psi_df['current'] - psi_df['baseline']) * np.log(psi_df['current'] / psi_df['baseline'])
    
    return psi_df['psi'].sum()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline-path", type=str, required=True)
    parser.add_argument("--current-path", type=str, required=True)
    parser.add_argument("--output-path", type=str, required=True)
    args = parser.parse_args()

    # Load data
    baseline_df = pd.read_csv(os.path.join(args.baseline_path, "training_data.csv"))
    current_df = pd.read_csv(os.path.join(args.current_path, "inference_input.csv")) # Assuming inference inputs are logged

    drift_report = {
        "input_drift": {},
        "prediction_drift": {}
    }
    
    features_to_check = ['recency', 'frequency', 'monetary', 'total_spend_90d']
    
    print("--- Calculating Input Drift ---")
    for feature in features_to_check:
        psi = calculate_psi(baseline_df[feature], current_df[feature])
        ks_stat, ks_pvalue = ks_2samp(baseline_df[feature], current_df[feature])
        drift_report["input_drift"][feature] = {
            "psi": psi,
            "ks_statistic": ks_stat,
            "ks_pvalue": ks_pvalue
        }
        print(f"Feature '{feature}': PSI = {psi:.4f}, KS p-value = {ks_pvalue:.4f}")

    print("\n--- Calculating Prediction Drift ---")
    # Assuming predictions are part of the 'current_df' and a baseline prediction set exists
    if 'prediction' in current_df.columns and 'prediction' in baseline_df.columns:
        psi = calculate_psi(baseline_df['prediction'], current_df['prediction'])
        ks_stat, ks_pvalue = ks_2samp(baseline_df['prediction'], current_df['prediction'])
        drift_report["prediction_drift"] = {
            "psi": psi,
            "ks_statistic": ks_stat,
            "ks_pvalue": ks_pvalue
        }
        print(f"Prediction Drift: PSI = {psi:.4f}, KS p-value = {ks_pvalue:.4f}")

    # Save the report
    os.makedirs(args.output_path, exist_ok=True)
    with open(os.path.join(args.output_path, "drift_report.json"), "w") as f:
        json.dump(drift_report, f, indent=4)
        
    print("\nDrift check complete.")
```

**Infrastructure for Alerting**

This Terraform code sets up the notification and alerting infrastructure.

```hcl
# terraform/monitoring.tf

# --- SNS Topics for Notifications ---
resource "aws_sns_topic" "critical_alerts_topic" {
  name = "clv-critical-alerts"
  tags = { Environment = var.environment }
}

resource "aws_sns_topic" "medium_alerts_topic" {
  name = "clv-medium-alerts"
  tags = { Environment = var.environment }
}

# Assume subscriptions (e.g., to a PagerDuty endpoint or email) are configured separately

# --- CloudWatch Alarms for System Health ---
resource "aws_cloudwatch_metric_alarm" "training_pipeline_failures" {
  alarm_name          = "clv-${var.environment}-training-pipeline-failures"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "FailedJobs"
  namespace           = "AWS/SageMaker"
  period              = "3600" # Check hourly
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Alerts when a SageMaker training job fails."
  alarm_actions       = [aws_sns_topic.critical_alerts_topic.arn]

  dimensions = {
    TrainingJobName = "clv-training-pipeline-*"
  }
}
```

**Dashboard Definition**
This JSON represents the structure for a CloudWatch dashboard that our MLOps team would use.


```json
// dashboards/mlops_health_dashboard.json
{
    "widgets": [
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    ["AWS/SageMaker", "CPUUtilization", "Host", "algo-1", { "stat": "Average" }]
                ],
                "title": "Training Job CPU Utilization (Avg)"
            }
        },
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    ["CLV/Drift", "PredictionDriftPSI", { "stat": "Average" }]
                ],
                "title": "Production Prediction Drift (PSI)"
            }
        },
        {
            "type": "log",
            "properties": {
                "query": "SOURCE '/aws/sagemaker/ProcessingJobs' | fields @timestamp, @message | sort @timestamp desc | limit 20",
                "title": "Latest Processing Job Logs"
            }
        },
        {
            "type": "alarm",
            "properties": {
                "title": "Pipeline Alarms",
                "alarms": [
                    "arn:aws:cloudwatch:eu-west-1:ACCOUNT_ID:alarm:clv-production-training-pipeline-failures"
                ]
            }
        }
    ]
}
```

### **Continual Learning & Production Testing Plan**

#### **1. Guiding Philosophy: From Static Predictions to a Dynamic, Learning System**

Our core philosophy, is that deploying our CLV model is the beginning, not the end. To maintain its value, the model must evolve. The e-commerce landscape is not static; customer preferences change, marketing strategies shift, and new products are introduced. This guarantees that our model will suffer from **data and concept drift** over time, degrading its accuracy and business utility.

Therefore, we will implement a robust **Continual Learning** strategy. Our goal is to create an automated, closed-loop system where production performance insights directly fuel model improvements, which are then safely validated and redeployed. This transforms our CLV model from a static artifact into an adaptive, self-improving system, ensuring it consistently drives business value.

#### **2. Continual Learning & Model Retraining Strategy**

This section defines *how* and *when* we will update our CLV model.

| Strategy Component | Decision / Implementation Choice | Rationale (Based on the Provided Guides) |
| :--- | :--- | :--- |
| **Retraining Approach** | **Stateless Retraining (from scratch) for now.** | For our XGBoost model, stateless retraining is simpler to implement robustly and avoids the risk of catastrophic forgetting. This is a common and practical starting point (Stage 2 of adoption). We can plan to evolve to Stateful (fine-tuning) in the future to reduce compute costs, but we must first establish a solid, reliable baseline. |
| **Data Curation for Retraining** | **Sliding Window Approach: Train on the last 3 months of data.** | This strategy balances freshness with stability. It ensures the model is trained on recent customer behavior while retaining enough data to be robust. The data selection logic will be a parameterized step in our training pipeline. |
| **Triggers for Retraining** | We will implement a multi-trigger system, moving towards an **event-driven** approach. | A simple schedule is a good start, but a mature system reacts to performance signals. |
| **- Trigger 1 (Schedule)** | **Weekly automated retraining job.** | A weekly cadence aligns perfectly with the marketing team's weekly campaign planning cycle. This is our primary, proactive trigger. |
| **- Trigger 2 (Performance)** | **Automated trigger if the 30-day proxy metric degrades.** | The ground truth (12-month spend) is severely delayed. Therefore, we will monitor the correlation between `predicted CLV` and `actual 30-day spend` as a proxy. If this correlation drops by >20% month-over-month, an automated retraining run will be triggered. This is a practical application of using proxy metrics when ground truth is latent. |
| **- Trigger 3 (Drift)** | **Automated trigger if Prediction Drift PSI > 0.25.** | This is our most sensitive leading indicator. A significant change in the distribution of model outputs, as detected by our monitoring system, is a strong signal that the model's behavior is changing, warranting a proactive retraining run. |

#### **3. Production Testing & Rollout Strategy: A Phased Approach**

We will adopt a multi-stage, progressive delivery strategy to de-risk the deployment of any new challenger model produced by our retraining pipeline.

**Stage 1: Shadow Deployment**
*   **Purpose:** To validate the new model's operational health and prediction sanity in a live environment with zero user impact.
*   **Execution:** The existing "Production" batch inference pipeline will run as usual. A parallel, "Shadow" version of the inference pipeline will be triggered, using the new challenger model. It will run on the same input list of active customers.
*   **Success Criteria / Metrics:**
    *   **Operational Health:** The shadow pipeline must complete successfully with latency and resource consumption within 10% of the champion pipeline.
    *   **Prediction Sanity:** The distribution of the challenger's predictions will be compared to the champion's. We will check that the mean prediction has not shifted by an unexpected amount (e.g., > 15%) and there are no catastrophic errors (e.g., all predictions are zero).
*   **Outcome:** If the shadow deployment passes, the model is automatically promoted to the Canary stage. If it fails, an alert is sent to the MLOps team for investigation.

**Stage 2: Canary Release (Segment-based)**
*   **Purpose:** To measure the real-world business impact of the new model's scores on a small, controlled segment of our marketing efforts before a full rollout.
*   **Execution:**
    1.  Both the champion and challenger models will score the *entire* active customer base.
    2.  For our next marketing campaign (e.g., a promotional email), the target audience will be split.
    3.  **95% of the audience (Control)** will be selected based on the scores from the **champion model**.
    4.  **5% of the audience (Canary)** will be selected based on the scores from the **challenger model**.
    5.  The campaign will be executed, and the results from the two segments will be tracked independently.
*   **Success Criteria / Metrics:**
    *   **Primary Metric:** The conversion rate of the Canary segment must be statistically equal to or greater than the Control segment.
    *   **Guardrail Metric:** The unsubscribe rate for the Canary segment must not be statistically higher than the Control.
*   **Outcome:** If the canary test is successful after a one-week run, the model can be approved for full production promotion.

**Stage 3: Full Production Rollout**
*   **Execution:** After passing the Canary stage and receiving manual sign-off, the challenger model is promoted to the "Production" tag in the MLflow Model Registry. The next scheduled batch inference pipeline will automatically pick up and use this new model for all customers.

#### **4. A/B Testing Framework for Major Model Changes**

For more significant changes (e.g., introducing a new model architecture or fundamentally new features), a simple canary release may be insufficient. We will use a formal A/B testing framework.

*   **Hypothesis:** A new CLV model (Challenger) that incorporates behavioral clickstream features will identify high-intent, high-value customers more accurately than the current RFM-based model (Champion), leading to a higher return on investment (ROI) for targeted marketing campaigns.
*   **Randomization Unit:** `CustomerID`.
*   **Traffic Split:** 50% Control (Champion Model), 50% Treatment (Challenger Model).
*   **Metrics:**
    *   **Primary Metric:** **Incremental Revenue Per User** from the targeted campaign. We will compare the average revenue generated from users in the Treatment group vs. the Control group.
    *   **Secondary Metrics:** Campaign Conversion Rate, Average Order Value (AOV).
    *   **Guardrail Metrics:** Marketing email unsubscribe rate, inference pipeline compute cost (the new model should not be prohibitively expensive).
*   **Duration:** The test will run for 4 weeks to capture multiple campaign cycles and mitigate short-term novelty effects.
*   **Decision:** The Challenger will be adopted if it shows a statistically significant lift in the primary metric with a p-value < 0.05, without any significant negative impact on guardrail metrics.

#### **5. Automating the Continual Learning & Testing Cycle**

We will use Airflow to orchestrate this entire end-to-end workflow.

1.  **Monitoring Service (e.g., a custom Python script, SageMaker Model Monitor output analysis)** runs daily/weekly.
2.  If a **retraining trigger** (performance drop or drift alert) is detected, it makes an API call to Airflow to trigger the `clv_retraining_dag`.
3.  The `clv_retraining_dag` runs, producing a new challenger model and registering it in MLflow with a "staging" tag.
4.  Upon successful completion, the retraining DAG triggers the `clv_shadow_test_dag`.
5.  The `clv_shadow_test_dag` runs. If it succeeds, it promotes the model to "ready-for-canary" in MLflow and sends a Slack notification for awareness.
6.  The `clv_canary_test_dag` is triggered manually by the marketing team for the next relevant campaign. It fetches the "ready-for-canary" model and runs the test.
7.  After the canary test period, a final report is generated. A **manual approval gate** (e.g., using an Airflow `EmailOperator` or a custom UI) requires a Product Manager or MLOps Lead to sign off.
8.  Upon approval, the model is promoted to the **"Production"** stage in MLflow, completing the cycle. The next run of the main `clv_batch_inference_pipeline` will automatically use this new champion.


<img src="../_static/past_experiences/ecom_cltv/continual_learning_retraining.svg" style="background-color: #FCF1EF;"/>



**Automated Retraining Pipeline**

This Airflow DAG is triggered when our monitoring system detects a problem. It runs the training pipeline and, on success, promotes the new model to "Staging" and triggers the shadow test.

```python
# pipelines/dag_automated_retraining.py
from airflow.decorators import dag, task
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerPipelineOperator
from datetime import datetime
import mlflow

MLFLOW_TRACKING_URI = "http://your-mlflow-server:5000"
MODEL_NAME = "clv-prediction-model"

@dag(
    dag_id="clv_automated_retraining",
    start_date=datetime(2025, 1, 1),
    schedule=None,  # This DAG is externally triggered
    catchup=False,
    doc_md="""
    Triggered by monitoring alerts (drift, performance degradation).
    Runs the SageMaker training pipeline and registers a new challenger model.
    On success, triggers the shadow deployment validation pipeline.
    """,
    tags=['clv', 'retraining', 'lifecycle'],
)
def automated_retraining_dag():

    # This operator starts the SageMaker Pipeline we defined in the previous section.
    trigger_sagemaker_training = SageMakerPipelineOperator(
        task_id="trigger_sagemaker_training_pipeline",
        pipeline_name="CLV-Training-Pipeline",
        aws_conn_id="aws_default",
        wait_for_completion=True, # Ensure we wait until it's done
    )
    
    @task
    def get_latest_model_version_and_promote_to_staging() -> str:
        """
        After training, the SageMaker pipeline registers a model. This task finds
        the latest version, assumes it's the one we just trained, and promotes
        it to the 'Staging' stage in MLflow.
        """
        client = mlflow.tracking.MlflowClient(tracking_uri=MLFLOW_TRACKING_URI)
        # Find the most recently registered version of our model
        latest_version = client.get_latest_versions(MODEL_NAME, stages=["None"])[0]
        
        print(f"Found new model version: {latest_version.version}. Transitioning to 'Staging'.")
        
        client.transition_model_version_stage(
            name=MODEL_NAME,
            version=latest_version.version,
            stage="Staging",
            archive_existing_versions=True # Demotes any existing model in 'Staging'
        )
        return latest_version.version

    # Trigger the shadow test pipeline, passing the new model version for validation.
    trigger_shadow_test = TriggerDagRunOperator(
        task_id="trigger_shadow_deployment",
        trigger_dag_id="clv_shadow_deployment",
        conf={"model_version": "{{ task_instance.xcom_pull(task_ids='get_latest_model_version_and_promote_to_staging') }}"}
    )

    new_model_version = get_latest_model_version_and_promote_to_staging()
    
    trigger_sagemaker_training >> new_model_version >> trigger_shadow_test

automated_retraining_dag()
```

**Shadow Deployment Pipeline**

This DAG compares the new "Staging" model against the "Production" champion on live data without affecting users.

```python
# pipelines/dag_shadow_deployment.py
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTransformOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.models.param import Param
from datetime import datetime
import mlflow
import json
import pandas as pd

MLFLOW_TRACKING_URI = "http://your-mlflow-server:5000"
MODEL_NAME = "clv-prediction-model"
SAGEMAKER_ROLE = "arn:aws:iam::ACCOUNT_ID:role/sagemaker-inference-execution-role"
INPUT_S3_URI = "s3://clv-inference-data-bucket/input/active_customers.jsonl"

@dag(
    dag_id="clv_shadow_deployment",
    start_date=datetime(2025, 1, 1),
    schedule=None, # Triggered by the retraining DAG
    catchup=False,
    params={"model_version": Param(None, type=["null", "string"])},
    doc_md="Compares a 'Staging' challenger model against the 'Production' champion.",
    tags=['clv', 'testing', 'lifecycle'],
)
def shadow_deployment_dag():

    @task
    def get_model_uris(**kwargs) -> dict:
        """Fetches S3 URIs for both the Production and new Staging models."""
        client = mlflow.tracking.MlflowClient(tracking_uri=MLFLOW_TRACKING_URI)
        
        # Get Production model
        prod_model = client.get_latest_versions(MODEL_NAME, stages=["Production"])[0]
        
        # Get Challenger (Staging) model version from the trigger payload
        challenger_version = kwargs["params"]["model_version"]
        if not challenger_version:
            raise ValueError("No model_version passed in the trigger config.")
            
        challenger_model = client.get_model_version(MODEL_NAME, challenger_version)

        print(f"Champion Model: v{prod_model.version}")
        print(f"Challenger Model: v{challenger_model.version}")
        
        return {
            "champion_uri": prod_model.source,
            "challenger_uri": challenger_model.source,
            "challenger_version": challenger_model.version
        }
    
    model_uris = get_model_uris()

    # Assume SageMaker model objects are created/updated based on these URIs
    # These tasks run the inference jobs
    run_champion_inference = SageMakerTransformOperator(
        task_id="run_champion_inference",
        # Config would point to the champion model object
    )
    
    run_challenger_inference = SageMakerTransformOperator(
        task_id="run_challenger_inference",
        # Config would point to the challenger model object
    )

    @task
    def compare_shadow_results(champion_output: str, challenger_output: str, challenger_version: str):
        """Compares prediction distributions from both models."""
        s3_hook = S3Hook(aws_conn_id="aws_default")
        
        # This is simplified. In reality, you'd download the files from S3.
        champion_preds = pd.read_json(champion_output, lines=True)
        challenger_preds = pd.read_json(challenger_output, lines=True)

        champion_mean = champion_preds['CLV_Prediction'].mean()
        challenger_mean = challenger_preds['CLV_Prediction'].mean()
        
        percent_diff = abs(challenger_mean - champion_mean) / champion_mean
        
        print(f"Champion Mean Prediction: {champion_mean:.2f}")
        print(f"Challenger Mean Prediction: {challenger_mean:.2f}")
        print(f"Mean Percentage Difference: {percent_diff:.2%}")
        
        # Validation Gate: Pass if the mean prediction is within 15%
        if percent_diff < 0.15:
            print("Shadow test PASSED. Promoting model to 'Ready-for-Canary'.")
            client = mlflow.tracking.MlflowClient(tracking_uri=MLFLOW_TRACKING_URI)
            client.transition_model_version_stage(
                name=MODEL_NAME, version=challenger_version, stage="Ready-for-Canary"
            )
        else:
            print("Shadow test FAILED. Mean prediction shifted too much.")
            # Trigger failure alert here (e.g., via SnsPublishOperator)
            raise ValueError("Shadow test failed.")

    # Define dependencies
    [run_champion_inference, run_challenger_inference] >> compare_shadow_results(
        champion_output=run_champion_inference.output_path,
        challenger_output=run_challenger_inference.output_path,
        challenger_version=model_uris["challenger_version"],
    )

shadow_deployment_dag()
```

**Canary Release Pipeline**

This DAG prepares data segments for the marketing team to run a live canary test.

```python
# pipelines/dag_canary_release.py
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTransformOperator
from datetime import datetime
import mlflow
import pandas as pd

@dag(
    dag_id="clv_canary_release_prep",
    start_date=datetime(2025, 1, 1),
    schedule=None, # Manually triggered for a campaign
    catchup=False,
    doc_md="Prepares customer segments for a live canary test.",
    tags=['clv', 'testing', 'lifecycle'],
)
def canary_release_prep_dag():

    @task
    def get_canary_and_champion_models() -> dict:
        # Fetches URIs for 'Production' and 'Ready-for-Canary' models from MLflow
        # (Similar logic to the shadow DAG)
        pass

    model_uris = get_canary_and_champion_models()
    
    # Run two batch transform jobs to score all customers with both models
    score_with_champion = SageMakerTransformOperator(...)
    score_with_challenger = SageMakerTransformOperator(...)
    
    @task
    def generate_campaign_segments(champion_scores_path: str, challenger_scores_path: str):
        """Splits customers into control and canary groups for the campaign."""
        # This task would:
        # 1. Load both sets of scores from S3.
        # 2. Sort customers by predicted CLV for each model.
        # 3. Select the top N customers based on champion scores for the control group.
        # 4. Select the top N*0.05 customers based on challenger scores for the canary group.
        # 5. Save two separate CSV files (control_group.csv, canary_group.csv) to an S3 bucket
        #    for the marketing team to use.
        print("Generated control and canary group files.")
        return "Campaign segments are ready in S3."

    @task
    def notify_marketing_team(status: str):
        # This task would send an email or Slack message.
        print(f"Notifying marketing team: {status}")

    # Define dependencies
    [score_with_champion, score_with_challenger] >> generate_campaign_segments(
        #... pass paths ...
    ) >> notify_marketing_team()

canary_release_prep_dag()
```

**Manual Model Promotion Pipeline**

This is the final, human-driven step to make a new model the official champion.

```python
# pipelines/dag_promote_to_production.py
from airflow.decorators import dag, task
from airflow.models.param import Param
from datetime import datetime
import mlflow

@dag(
    dag_id="clv_promote_model_to_production",
    start_date=datetime(2025, 1, 1),
    schedule=None, # Manually triggered only
    catchup=False,
    params={"model_version_to_promote": Param(description="The model version to promote to Production", type="string")},
    doc_md="Manual gate to promote a validated model version to 'Production'.",
    tags=['clv', 'promotion', 'lifecycle'],
)
def promote_to_production_dag():

    @task
    def promote_model(**kwargs):
        version = kwargs["params"]["model_version_to_promote"]
        print(f"Promoting model version {version} to 'Production'...")
        client = mlflow.tracking.MlflowClient(tracking_uri="http://your-mlflow-server:5000")
        client.transition_model_version_stage(
            name="clv-prediction-model",
            version=version,
            stage="Production",
            archive_existing_versions=True
        )
        print("Promotion successful.")

    promote_model()

promote_to_production_dag()
```

**CI/CD Workflow for All Pipelines**

This workflow validates all the new lifecycle DAGs.

```yaml
# .github/workflows/cicd_lifecycle_pipelines.yml

name: "CI/CD for Model Lifecycle DAGs"

on:
  push:
    branches:
      - main
    paths:
      # Add paths to all the new DAGs and any new src files
      - 'pipelines/dag_automated_retraining.py'
      - 'pipelines/dag_shadow_deployment.py'
      - 'pipelines/dag_canary_release.py'
      - 'pipelines/dag_promote_to_production.py'
      - '.github/workflows/cicd_lifecycle_pipelines.yml'
  pull_request:
    branches:
      - main

jobs:
  validate-dags:
    name: "Validate Lifecycle DAGs"
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Install Dependencies
        run: |
          pip install -r requirements.txt
          pip install -r tests/requirements.txt
      
      - name: Run Linting Checks
        run: |
          pip install flake8
          # Run flake8 on the new DAG files
          flake8 pipelines/dag_automated_retraining.py pipelines/dag_shadow_deployment.py ...

      - name: Validate Airflow DAG Integrity
        run: |
          # Use the airflow standalone command to check for syntax errors
          airflow dags list --subset pipelines/dag_automated_retraining.py
          airflow dags list --subset pipelines/dag_shadow_deployment.py
          # ... and so on for the other new DAGs
```

### A/B Testing

**Architecture Diagram**

This diagram shows the two main phases: the Setup Phase (orchestrated by Airflow) and the Analysis Phase (performed by a data scientist after the experiment period).

<img src="../_static/past_experiences/ecom_cltv/ab_testing.svg" style="background-color: #FCF1EF;"/>


**Infrastructure as Code**

We need a dedicated SNS topic to notify stakeholders when the A/B test segments are ready.

```hcl
# terraform/ab_testing.tf

resource "aws_sns_topic" "ab_test_notifications_topic" {
  name = "clv-ab-test-notifications"
  display_name = "Notifications for CLV A/B Test Readiness"
  
  tags = {
    Environment = var.environment
    Purpose     = "AB-Testing"
  }
}

# We will reuse the sagemaker_inference_role created previously.
# No new roles are needed if permissions are broad enough.
```

**A/B Test Setup Airflow DAG**

This DAG prepares all the necessary data for the marketing and analytics teams to run the A/B test.

```python
# pipelines/dag_ab_test_setup.py
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTransformOperator
from airflow.providers.sns.operators.sns import SnsPublishOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.models.param import Param
from datetime import datetime
import mlflow
import pandas as pd
import numpy as np

# --- Constants ---
MLFLOW_TRACKING_URI = "http://your-mlflow-server:5000"
MODEL_NAME = "clv-prediction-model"
BASE_S3_PATH = "s3://clv-inference-data-bucket/ab-tests"
CUSTOMER_LIST_PATH = "s3://clv-inference-data-bucket/input/active_customers.jsonl"
SNS_TOPIC_ARN = "arn:aws:sns:eu-west-1:ACCOUNT_ID:clv-ab-test-notifications"

@dag(
    dag_id="clv_ab_test_setup",
    start_date=datetime(2025, 1, 1),
    schedule=None,  # Manually triggered for major tests
    catchup=False,
    params={"challenger_version": Param(type="string", description="The challenger model version from MLflow to test.")},
    doc_md="Sets up a formal A/B test by scoring all users with Champion and Challenger models and assigning them to groups.",
    tags=['clv', 'testing', 'ab-test'],
)
def ab_test_setup_dag():

    @task
    def get_model_uris(**kwargs) -> dict:
        """Fetches S3 URIs for the Production (Champion) and specified Challenger models."""
        # Logic to fetch champion and challenger URIs from MLflow
        # ... (similar to shadow DAG) ...
        pass

    @task
    def assign_users_to_groups(run_id: str) -> str:
        """Randomly assigns all active customers to a 'control' or 'treatment' group."""
        print("Assigning users to A/B test groups...")
        s3_hook = S3Hook()
        customer_file = s3_hook.download_file(key=CUSTOMER_LIST_PATH)
        customers_df = pd.read_json(customer_file, lines=True)

        # Assign each user to a group
        np.random.seed(42) # for reproducibility
        customers_df['group'] = np.random.choice(['control', 'treatment'], size=len(customers_df), p=[0.5, 0.5])
        
        output_path = f"ab-tests/{run_id}/assignments/user_assignments.csv"
        s3_hook.load_string(
            string_data=customers_df[['CustomerID', 'group']].to_csv(index=False),
            key=output_path,
            bucket_name="clv-inference-data-bucket",
            replace=True
        )
        print(f"User assignments saved to {output_path}")
        return output_path

    model_uris = get_model_uris()
    user_assignments_path = assign_users_to_groups(run_id="{{ run_id }}")
    
    # Run two parallel batch transform jobs
    run_champion_job = SageMakerTransformOperator(...)
    run_challenger_job = SageMakerTransformOperator(...)
    
    @task
    def notify_stakeholders(run_id: str):
        """Sends a notification that the A/B test setup is complete."""
        message = f"""
        A/B Test Setup Complete for run_id: {run_id}

        The following artifacts are ready for the Marketing and Analytics teams:
        - User Group Assignments: s3://clv-inference-data-bucket/ab-tests/{run_id}/assignments/
        - Champion Model Scores: {run_champion_job.output_path}
        - Challenger Model Scores: {run_challenger_job.output_path}
        
        The experiment can now begin.
        """
        return message

    notification = notify_stakeholders(run_id="{{ run_id }}")

    publish_notification = SnsPublishOperator(
        task_id="publish_setup_complete_notification",
        target_arn=SNS_TOPIC_ARN,
        message=notification,
    )
    
    # Dependencies
    [run_champion_job, run_challenger_job]
    user_assignments_path >> [run_champion_job, run_challenger_job]
    model_uris >> [run_champion_job, run_challenger_job]
    [run_champion_job, run_challenger_job] >> notification >> publish_notification

ab_test_setup_dag()
```

**Analysis Notebook**
After the experiment period (e.g., 4 weeks), a data scientist would use this notebook to analyze the results.

```python
# analysis/analyze_ab_test_results.ipynb

# --- 1. Setup and Load Data ---
import pandas as pd
import numpy as np
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt

# In a real scenario, you would load the results from your data warehouse.
# Here, we simulate the final dataset.
print("Simulating experimental results...")
np.random.seed(42)
num_users = 100000

# Load the user assignments from the DAG run
# user_assignments = pd.read_csv("s3://clv-inference-data-bucket/ab-tests/RUN_ID/assignments/user_assignments.csv")
user_assignments = pd.DataFrame({
    'CustomerID': range(num_users),
    'group': np.random.choice(['control', 'treatment'], size=num_users, p=[0.5, 0.5])
})

# Simulate revenue generated during the 4-week test period
# Let's assume the treatment group had a small positive effect
control_revenue = np.random.gamma(1.5, 50, size=len(user_assignments[user_assignments['group'] == 'control']))
treatment_revenue = np.random.gamma(1.6, 50, size=len(user_assignments[user_assignments['group'] == 'treatment']))

user_assignments.loc[user_assignments['group'] == 'control', 'revenue'] = control_revenue
user_assignments.loc[user_assignments['group'] == 'treatment', 'revenue'] = treatment_revenue

results_df = user_assignments
print(results_df.head())
print("\n--- Data Loaded ---")

# --- 2. Analyze Primary Metric: Incremental Revenue Per User ---
control_group = results_df[results_df['group'] == 'control']['revenue']
treatment_group = results_df[results_df['group'] == 'treatment']['revenue']

avg_control_revenue = control_group.mean()
avg_treatment_revenue = treatment_group.mean()
lift = (avg_treatment_revenue - avg_control_revenue) / avg_control_revenue

print(f"\n--- A/B Test Results ---")
print(f"Control Group Mean Revenue: ${avg_control_revenue:.2f}")
print(f"Treatment Group Mean Revenue: ${avg_treatment_revenue:.2f}")
print(f"Observed Lift: {lift:.2%}")

# --- 3. Statistical Significance Testing (t-test) ---
# Perform an independent t-test to check if the difference is statistically significant
t_stat, p_value = stats.ttest_ind(treatment_group, control_group, equal_var=False) # Welch's t-test

print(f"\nT-statistic: {t_stat:.4f}")
print(f"P-value: {p_value:.4f}")

alpha = 0.05
if p_value < alpha:
    print(f"\nResult is STATISTICALLY SIGNIFICANT at alpha={alpha}. We reject the null hypothesis.")
else:
    print(f"\nResult is NOT statistically significant at alpha={alpha}. We fail to reject the null hypothesis.")

# --- 4. Visualize the Results ---
plt.figure(figsize=(10, 6))
sns.histplot(control_group, color="blue", label="Control Group", kde=True, stat="density", element="step")
sns.histplot(treatment_group, color="red", label="Treatment Group", kde=True, stat="density", element="step")
plt.title("Distribution of Revenue per User")
plt.xlabel("Revenue")
plt.legend()
plt.show()

# --- 5. Conclusion ---
print("\n--- Conclusion ---")
if p_value < alpha:
    print("The challenger model led to a statistically significant increase in revenue per user.")
    print("Recommendation: Promote the challenger model to production.")
else:
    print("The challenger model did not show a statistically significant improvement over the champion.")
    print("Recommendation: Do not ship. Re-evaluate the model or iterate further.")
```

**CI Workflow for A/B Test DAG**

This ensures the setup DAG is always valid before being merged.

```yaml
# .github/workflows/ci_ab_test_dag.yml

name: "CI for A/B Test Setup DAG"

on:
  pull_request:
    branches:
      - main
    paths:
      - 'pipelines/dag_ab_test_setup.py'
      - '.github/workflows/ci_ab_test_dag.yml'

jobs:
  validate-ab-test-dag:
    name: "Validate A/B Test DAG"
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.9

      - name: Install Dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Validate Airflow DAG Integrity
        run: |
          # Use the airflow standalone command to check for syntax errors
          airflow dags list --subset pipelines/dag_ab_test_setup.py
```

### **Governance, Ethics & The Human Element**

#### **1. Guiding Philosophy: Building a Trustworthy and Compliant System**

Our core philosophy is that effective **Model Governance** and **Responsible AI (RAI)** practices are not optional add-ons but are integral to the long-term success and viability of the CLV prediction system. Given that this system directly influences marketing decisions, customer segmentation, and potentially financial outcomes (promotions, offers), it falls into a category requiring a high degree of diligence. We will integrate governance and ethical checks throughout the MLOps lifecycle.

#### **2. Comprehensive Model Governance Plan**

We will implement a governance framework tailored to our MLOps lifecycle, focusing on reproducibility, validation, and control.

| ML Lifecycle Stage | Governance Component | Actions & Artifacts for the CLV Project |
| :--- | :--- | :--- |
| **Development** | **Reproducibility & Validation** | **1. Model Registry (MLflow):** Every production and challenger model will have its metadata logged, including: Git commit hash of the training code, DVC hash of the training data, key hyperparameters, and final offline evaluation metrics (RMSE, Gini, Fairness metrics). <br> **2. Model Card:** We will generate and attach a `ModelCard.md` to every registered "Production" model version. This will document its intended use, limitations, training data overview, evaluation results on key slices, and fairness assessments. <br> **3. Data Sheets:** The schema and source of our core datasets (transactional, behavioral) will be documented using Great Expectations, serving as our "Data Sheets". |
| **Deployment & Operations** | **Observation, Control & Auditability** | **1. Versioned Deployments:** All deployments of inference pipelines (our weekly batch job) will be tied to a specific version-controlled Airflow DAG and a versioned model from the registry. <br> **2. Access Control (IAM):** We will use specific, least-privilege IAM roles for each component (Airflow, SageMaker Training, SageMaker Inference) to control access to data and resources. <br> **3. Logging & Audit Trail:** All pipeline runs (Airflow), model training jobs (SageMaker), and inference jobs (SageMaker Batch Transform) will generate detailed logs stored in CloudWatch. Prediction outputs will be logged to S3 with metadata linking them to the exact model version used. This creates a complete, auditable trail from prediction back to the source model, code, and data. |
| **Cross-Cutting** | **Model Service Catalog** | The MLflow Model Registry will serve as our internal catalog, allowing stakeholders to discover available CLV models, view their performance, and understand their current deployment stage (Staging, Production, Archived). |

#### **3. Responsible AI (RAI) Practices**

We will proactively address the key pillars of Responsible AI to ensure our CLV model is fair, transparent, and secure.

| RAI Pillar | Plan for the CLV Project |
| :--- | :--- |
| **Fairness** | **1. Identify Potential Biases:** We recognize that our historical sales data may contain biases. For example, marketing efforts might have historically targeted specific demographics, leading to *representation bias*. <br> **2. Fairness as a Guardrail Metric:** During the offline evaluation step of our training pipeline, we will calculate the **Disparate Impact Ratio**. We will measure the average predicted CLV for different customer segments (e.g., based on `country` or `acquisition_channel`) and calculate the ratio between the lowest-scoring and highest-scoring groups. <br> **3. Mitigation Strategy:** If this ratio falls below a threshold (e.g., 0.8), the model will be flagged, and it will not be automatically promoted. This will trigger a manual review by the data science team, who may need to apply pre-processing techniques like re-weighting the training data for the under-predicted segment. |
| **Explainability (XAI)** | **1. Global Explainability:** For each production model, we will generate and store a global feature importance plot using aggregated SHAP values. This will be included in the Model Card to help business stakeholders understand the primary drivers of CLV across the entire customer base. <br> **2. Local Explainability:** Our batch inference pipeline will be configured to optionally generate and log SHAP values for each individual prediction. While not enabled by default to save costs, this capability can be turned on for debugging specific customer predictions or for providing explanations to customer service teams. |
| **Transparency** | **1. Model Cards:** The Model Card is our primary tool for transparency. It will be our "nutrition label" for the model. <br> **2. Internal Communication:** We will establish a clear process for communicating model updates and their expected impact (from A/B test results) to the marketing and business intelligence teams. |
| **Privacy** | **1. PII Handling:** Our data ingestion pipelines will include a explicit step to hash or anonymize any direct Personally Identifiable Information (PII) like names or full addresses before storing it in our analytical data lake. The `CustomerID` will be a pseudonymized key. <br> **2. Data Minimization:** We will only use the data necessary for the CLV task and will not ingest unrelated sensitive customer data. |
| **Security** | **1. Endpoint Security:** N/A as we are using a batch pipeline, not a real-time API. <br> **2. Access Control:** All access to data (S3), code (Git), and infrastructure (AWS) is managed via strict IAM roles and policies. <br> **3. Secret Management:** Database credentials and other secrets are stored securely in AWS Secrets Manager, not in code. |

#### **4. Holistic System Testing & Production Readiness**

We will use the **ML Test Score** framework as a guiding checklist to assess our production readiness.

*   **Data Tests:** We have already implemented several of these with Great Expectations (schema checks, feature expectations). We will add a manual review step to ensure no features inadvertently contain PII.
*   **Model Development Tests:**
    *   Our model specs are versioned in Git and peer-reviewed.
    *   We have a plan to correlate offline metrics with online A/B test results.
    *   Our training pipeline includes hyperparameter tuning.
    *   We have a baseline model (Linear Regression) to compare against.
    *   We have slice-based performance checks for fairness (`evaluate_on_slices`).
*   **ML Infrastructure Tests:**
    *   Our training is reproducible via versioned code, data, and config.
    *   Our pipeline is integration tested via the CD workflow (`cd_training_pipeline.yml`).
    *   Model quality is validated before promotion (automated checks and manual gates).
    *   We have a rollback mechanism (promoting the previous "Production" model from the MLflow archive).
*   **Monitoring Tests:**
    *   We have monitoring for data invariants (Great Expectations), feature compute skew (by using a Feature Store), and prediction quality drift (PSI monitoring).

Our self-assessed ML Test Score for this plan would be high, indicating a strong degree of production readiness.

#### **5. Human Element: Team Structure & User-Centric Design**

*   **Team Structure:** We will operate on a **Platform-Enabled Model**.
    *   The **ML Platform Team** (MLOps Engineers) is responsible for building and maintaining the automated MLOps infrastructure (the Airflow DAGs, CI/CD workflows, Terraform modules, monitoring stack).
    *   The **Data Science Team** (ML Engineers/Data Scientists) is responsible for the "Task" of building the CLV model. They own the model development code (`src/`), the evaluation logic, and are the primary consumers of the platform. They are responsible for analyzing model performance and proposing improvements.
*   **User-Centric Design:** The "users" of our CLV model are the marketing and business intelligence teams.
    *   **Managing Expectations:** We will communicate clearly that the CLV score is a *prediction*, not a guarantee. The Model Card will document the model's RMSE to provide a clear indication of its average error range.
    *   **Building Trust:** By providing explanations for model behavior (via feature importance) and being transparent about its performance (via dashboards), we will build the marketing team's trust in the scores, encouraging them to use the output effectively in their campaigns.

---

### System Architecture, Cost, Performance Optimisations

#### Overall System Architecture Diagram
<img src="../_static/past_experiences/ecom_cltv/overall_system_architecture_diagram.svg" style="background-color: #FCF1EF;"/>

#### Sequence Diagram: Batch Inference
<img src="../_static/past_experiences/ecom_cltv/sequence_diagram_inference.svg" style="background-color: #FCF1EF;"/>

#### Latency, Potential Bottlenecks, and Optimizations

*   **Total Pipeline Latency:** The end-to-end latency is dominated by the SageMaker Batch Transform job runtime. A realistic estimate for scoring 1 million customers on moderately complex instances would be **1 to 3 hours**.

*   **Potential Bottlenecks & Optimizations:**
    1.  **Bottleneck:** **Feature Retrieval.** If our inference script naively calls `GetRecord` from the Online Feature Store for every single customer, this will be the biggest bottleneck. A single `GetRecord` call might take ~10-20ms. For 1 million customers, this would be `1,000,000 * 0.015s ≈ 4.2 hours` of just waiting for feature data, overwhelming any other part of the process.
        *   **✅ Performance Optimization:** This is the most critical optimization. We must leverage the **SageMaker Feature Store's Offline Store**. The inference script should be designed to execute a single, efficient Athena SQL query that joins the input customer list with the feature data in the offline store. This transforms the feature retrieval from millions of slow, individual lookups into a single, fast, parallelized data join operation, likely reducing feature retrieval time to just a few minutes.

    2.  **Bottleneck:** **Compute Instance Sizing.** The runtime of the Batch Transform job is directly proportional to the compute power allocated.
        *   **✅ Performance Optimization:** We can horizontally scale by increasing the `InstanceCount` in the Batch Transform job configuration. SageMaker will automatically partition the input data across the instances, running them in parallel. We can also vertically scale by choosing a more powerful `InstanceType` (e.g., from `ml.m5.large` to `ml.m5.4xlarge`).

    3.  **Bottleneck:** **Model Complexity.** A very large XGBoost model (many trees, deep trees) will take longer to load and will have higher per-prediction latency.
        *   **✅ Performance Optimization:** Use model quantization or compile the model using SageMaker Neo. This can reduce the model's on-disk size and improve inference speed, though it requires an extra step in the training pipeline.

#### Estimated Monthly Cost

**Assumptions:**
*   Region: `eu-west-1` (Ireland)
*   Active Customers: 1 million
*   Daily Transactions: ~150,000 records (~1GB/month)
*   Daily Behavioral Events: ~250k sessions, generating ~5GB/day (~150GB/month)
*   Feature Engineering: Runs daily on 1 month of data (~150GB).
*   Model Training: Runs weekly.
*   Batch Inference: Runs weekly on 1 million customers.

| Component | Assumptions / Usage | Instance / Pricing Unit | Estimated Monthly Cost ($) |
| :--- | :--- | :--- | :--- |
| **S3 Storage** | Raw Data (~150GB) + Features (~50GB) + Models/Artifacts (~10GB) = ~210 GB | $0.023 per GB-month | ~$5 |
| **AWS Glue** | Daily job, ~15 mins on 2 DPUs. (0.25h * 2 DPUs * 30 days * $0.44/DPU-hr) | DPU-Hours | ~$7 |
| **Kinesis Data Streams**| 1 shard, continuously running. (1 shard * 24h * 30d * $0.015/hr) | Shard-Hours | ~$11 |
| **Kinesis Data Firehose**| Ingests 150 GB/month. ($0.029/GB) | GB Ingested | ~$5 |
| **EMR (Feature Engineering)** | Daily transient cluster. 1 master + 4 core `m5.xlarge` instances for 1 hour. (5 instances * 1h * 30d * $0.192/hr) | Instance-Hours | ~$29 |
| **SageMaker Feature Store**| *Offline:* 50GB storage. <br> *Online:* Low write/read units for batch. (50 * $0.023) + (2 RCU * 730h * $0.057) + (2 WCU * 730h * $0.285) | Storage + RCU/WCU-Hours | ~$500 |
| **SageMaker Training** | Weekly job on one `ml.m5.4xlarge` for 2 hours. (1 instance * 2h * 4 weeks * $0.922/hr) | Instance-Hours | ~$8 |
| **SageMaker Batch Inference**| Weekly job on two `ml.m5.4xlarge` for 2 hours. (2 instances * 2h * 4 weeks * $0.922/hr) | Instance-Hours | ~$15 |
| **MWAA (Airflow)** | Smallest environment (`mw1.small`), continuously running. ($0.49/hr * 24h * 30d) | Environment-Hours | ~$353 |
| **CloudWatch** | Logs (~10 GB/month) + Custom Metrics + Alarms | GB Ingested & Metrics | ~$10 |
| **Total Estimated Monthly Cost** | | | **~$943** |

**Conclusion on Cost:** The primary cost drivers are the continuously running managed services: **SageMaker Feature Store (Online Store)** and **Airflow (MWAA)**. The batch compute jobs (EMR, SageMaker) are significant but less than the persistent services. This cost structure is very reasonable for providing a production-grade ML capability for a mid-sized business.

#### Throughput Estimates & Performance Optimizations

#### **a) Throughput Estimates**

*   **Feature Engineering (EMR):** With a 5-node `m5.xlarge` cluster, processing the full monthly dataset of ~150GB to generate features for ~1M customers would likely take **~1-2 hours**. This equates to a throughput of **~500,000 to 1,000,000 customers per hour**.
*   **Batch Inference (SageMaker):** With two `ml.m5.4xlarge` instances, scoring 1M customers (with the optimized feature retrieval) would likely take **~1 hour**. This equates to a throughput of **~1,000,000 customers per hour**, or ~280 predictions per second.

#### Further Performance Optimizations

While we've discussed key optimizations, here's a consolidated list:

1.  **Optimize Feature Engineering:**
    *   **Right-size the EMR Cluster:** Profile the Spark jobs to find the optimal number and type of instances. Too small a cluster is slow; too large a cluster wastes money.
    *   **Optimize Spark Code:** Use techniques like data partitioning, caching intermediate DataFrames, and avoiding expensive operations like `collect()`.

2.  **Optimize Batch Inference:**
    *   **Use the Offline Feature Store:** As detailed above, this is the most critical optimization.
    *   **Increase Parallelism:** Increase the `MaxConcurrentTransforms` and `InstanceCount` in the Batch Transform job configuration to process the data faster.
    *   **Batching Strategy:** For the inference script, ensure that it processes records in mini-batches to take advantage of vectorized prediction in libraries like XGBoost, rather than predicting one record at a time.

3.  **General Optimizations:**
    *   **Use AWS Savings Plans or Reserved Instances:** For the continuously running components like MWAA and the Feature Store, committing to a 1 or 3-year term can reduce costs by up to 40-60%.
    *   **Automate Shutdowns:** Ensure all development and staging environments (e.g., test Airflow instances) are automatically shut down when not in use.

#### Rationale behind Design Choices

**Why is the Airflow (MWAA) running continuously?**

*   **Its Function is Continuous Orchestration:** Think of Airflow as the "control tower" or the "central nervous system" for all of our data and ML pipelines. It's a server, not a job. Its primary responsibilities are continuous and time-sensitive:
    1.  **Scheduling:** It needs to be "awake" 24/7 to check its schedules. When a DAG is defined with `schedule_interval="@daily"` or `"@weekly"`, Airflow's internal scheduler component is constantly checking the clock to see if it's time to trigger a new run.
    2.  **State Management:** It maintains the status of all past and current pipeline runs. If a job fails, Airflow holds that state and knows not to run downstream tasks. This historical state is crucial for debugging and operational reliability.
    3.  **API and UI:** It serves a user interface and an API, allowing developers to inspect logs, trigger manual runs, and see the status of all pipelines at any time.
    4.  **Listening for Triggers:** As we designed in the Continual Learning section, our retraining pipeline can be triggered by an external API call from our monitoring system. Airflow must be running continuously to listen for and respond to these event-driven triggers.

*   **Conclusion:** Because its core function is to schedule, monitor, and respond in real-time, MWAA is a persistent service by design. It cannot be spun up on-demand just to run a single pipeline, as that would defeat its purpose as an orchestrator.


**Why is the Feature Store (Online) running continuously?**

*   **Its Function is Low-Latency Access:** The *Online* Feature Store is specifically designed and optimized for real-time, low-millisecond data retrieval. It's essentially a managed, high-performance key-value database. This low-latency guarantee is only possible because the service is persistent, with data indexed and ready in memory. If you had to "spin it up" each time you needed it, the lookup time would be minutes, not milliseconds, and it would just be a slow, expensive version of the Offline Store.

*   **Architectural Refinement for Our Use Case:**
    *   **Initial Design:** The Online Store was included as a best practice for **future-proofing**. A common next step for a CLV project is to expose the scores via a real-time API for an application to use (e.g., showing a special offer to a high-value customer *while they are browsing*). That real-time API would absolutely require the Online Feature Store. By building it into the initial architecture, the system is ready for that evolution.
    *   **A More Cost-Effective, Batch-Only Approach:** If we are 100% certain that we will *not* have a real-time requirement in the near future, we could optimize for cost. We can configure the SageMaker Feature Group to have **only the Offline Store enabled**. This means data is still cataloged and organized, but it is written only to S3.
    *   **Impact on the Pipeline:** In this optimized scenario, our Batch Inference script would be modified to query the **Offline Store** (using an Athena query via the SDK) instead of the Online Store. The cost would drop dramatically (from ~$500/month to just a few dollars for S3 storage and Athena query costs), as we would no longer be paying for the continuously running read/write capacity units of the Online Store.

*   **Conclusion:** The initial estimate included the Online Store for strategic, forward-looking reasons. However, for the specific batch-only pipeline we've built, disabling it is a valid and significant cost optimization. The final decision is a classic MLOps trade-off: **current cost savings vs. future agility.**


**Why is feature engineering run daily instead of just before weekly training?**

**a) The Need for Fresh Features**

The predictive power of our CLV model relies heavily on features that change daily. If we only update them weekly, we lose a significant amount of signal.

*   **Recency is Critical:** The `recency` feature (days since last purchase) is one of the strongest predictors of churn and repeat purchases. This value changes *every single day* for every customer who doesn't make a purchase. If we only calculate this weekly, a customer who bought yesterday and a customer who bought 6 days ago look identical to the model, but their short-term behavior is vastly different.
*   **Rolling Windows Capture Trends:** Features like `total_spend_30d` or `purchase_count_90d` are designed to capture recent momentum. A daily update ensures this window accurately reflects the last 30/90 days. A weekly update means that for most of the week, the window is stale and includes data that should have already "aged out."

By calculating features daily, we ensure that when the weekly training job runs, it uses the most accurate, up-to-date representation of each customer's behavior.

**b) Architectural Decoupling: The Feature Store as a Central Asset**

This is the key MLOps principle at play. Tightly coupling the feature engineering pipeline to the training pipeline (i.e., only running it when you need to train) creates a brittle, monolithic system. By decoupling them, we create a more robust and scalable architecture.

*   **The Feature Store as a "Source of Truth":** The purpose of the daily feature engineering pipeline is to produce a clean, validated, and up-to-date table of customer features in the Feature Store. This table becomes a central data asset for the entire organization, not just for one model.
*   **Enabling Other Use Cases:** Once this daily-refreshed feature set exists, it can be consumed by numerous other services without needing to re-run the complex engineering logic:
    *   **Other ML Models:** A different team might want to build a real-time churn prediction model. They don't need to build their own feature pipeline; they can simply consume the fresh features we are already producing.
    *   **Business Intelligence (BI):** The marketing team might want a daily dashboard showing the number of customers in different RFM segments. They can query the Feature Store directly instead of asking data engineering for a custom pipeline.
    *   **Ad-Hoc Analysis:** A data scientist wanting to explore customer behavior can immediately query the Feature Store for clean, ready-to-use data.

By running feature engineering daily, we are not just preparing data for *our* model; we are creating a reliable, daily-refreshed data product that serves the entire business. This is a core tenet of building a scalable and efficient data culture.


<!--
### **Challenges Faced, Lessons Learned & The Path Forward**

Building and operationalizing our end-to-end Customer Lifetime Value (CLV) prediction system was a journey of immense learning. While we successfully delivered a system that drives significant business value, the path was punctuated by complex challenges that went far beyond simple model training. Here are three specific, high-impact challenges we faced and the invaluable lessons they taught us.


#### **Challenge 1: The Silent Data Pipeline Bug and the "Gift Card" Anomaly**

This was a classic, insidious data issue that morphed into a modeling challenge, highlighting the fragility of even well-designed pipelines and the critical need for deep, cross-functional observability.

*   **The Initial Symptom & Stakeholder Pressure:** About two months after a successful launch, the Marketing team raised a "red flag." They noticed that our model's CLV scores for a historically stable, high-value customer segment were inexplicably dropping week over week. With their crucial quarterly campaign planning approaching, their confidence in the model was eroding, putting significant pressure on the ML team to diagnose and fix the issue immediately.

*   **Chronological Investigation:**
    1.  **MLOps Initial Triage (Day 1-2):** Our first step was to check the monitoring dashboards. There were no smoking guns. Airflow DAGs were all green. The SageMaker Batch Transform jobs were completing successfully. Our prediction drift monitor showed a slightly elevated Population Stability Index (PSI) of 0.12, but it was below our medium-alert threshold of 0.15. The system, on the surface, looked healthy.
    2.  **Data Science Deep Dive (Day 3-5):** The data science team took over, performing a slice analysis on the affected customer segment. They confirmed Marketing's observation: the `monetary` and `frequency` features for these customers were indeed trending downwards. They pulled the raw transaction logs for a few specific `CustomerID`s and saw recent purchase activity. The data existed at the source, but it was vanishing somewhere before model training.
    3.  **The Cross-Functional Hunt (Week 2):** This triggered a deep-dive involving Data Engineering, MLOps, and Data Science. The data engineers began meticulously tracing data lineage from the source PostgreSQL database through the AWS Glue ETL job, to the raw S3 data lake, and finally to the Feature Engineering pipeline running on EMR.
    4.  **The "Aha!" Moment:** The root cause was discovered in the logs of the Glue job. A month prior, the e-commerce backend team had launched a new "Gift Card" product line. Crucially, the `product_id` for these gift card transactions was an alphanumeric string (e.g., `GC-WINTER-50`), whereas all previous `product_id`s were integers. Our feature engineering pipeline had a validation step that expected an integer type. Instead of failing loudly, the Spark job was silently casting the incompatible alphanumeric IDs to `NULL`. Subsequent steps in the pipeline were configured to drop records with null keys, effectively making these gift card purchases invisible to the CLV model.
    5.  **The Fix and the Second-Order Problem (Week 3):** The data engineering team quickly patched the feature engineering script to correctly handle alphanumeric `product_id`s and reprocessed the last month of data. The data quality issue was fixed. We retrained the model on this corrected, complete dataset. The overall offline RMSE improved, and we celebrated. However, the first batch inference run with the new model produced a new, even more alarming issue: customers who had *only* purchased a single, high-value gift card were now being assigned massive CLV scores, placing them in the top percentile. The model had incorrectly learned that a one-off, high-value purchase was a signal of an extremely valuable customer, failing to understand the non-recurring nature of many gift card purchases.
    6.  **The Final, Correct Solution (Week 4):** We realized this was now a modeling problem, not just a data problem. We went back to the feature engineering pipeline and created a new binary feature: `is_gift_card_purchase`. This allowed the XGBoost model to explicitly learn the difference between regular product purchases and gift card transactions. After retraining with this new feature, the model's predictions became far more robust, and the scores for the affected segment returned to sensible levels.

*   **Lessons Learned:**
    *   **Silent Failures are the Most Dangerous:** Loud pipeline failures are easy; silent data corruption is what erodes trust. Our initial data validation was too trusting and lacked strict type enforcement that would have failed the pipeline immediately.
    *   **Observability is More Than Dashboards:** True observability is the ability to trace data lineage from end to end. Without the collaborative effort to track data flow across services, we would have been flying blind.
    *   **A Data Bug is Often a Hidden Model Bug:** The data issue revealed a flaw in our model's conceptual understanding of the world. It didn't know how to handle a new type of transaction. The ultimate fix required improving the model's feature set, not just cleaning the data.


#### **Challenge 2: The Proxy Metric Paradox: Optimizing for the Wrong Thing**

This challenge was a humbling experience that went to the heart of our project's validity. It taught us that a statistically "good" model can be a functionally "bad" model if it's optimizing for a flawed proxy of business value.

*   **The Initial Setup and a Confusing A/B Test:** Our CLV model's ground truth—actual 12-month spend—is severely latent. To iterate quickly, we made a pragmatic decision: our primary offline evaluation metric and automated retraining trigger would be based on the model's ability to predict a shorter-term proxy: **90-day revenue**. For several months, this worked well. Our training pipeline dutifully retrained the model weekly, and the 90-day RMSE remained low and stable. We then launched a formal A/B test for a new challenger model (v1.3) that showed a 5% better 90-day RMSE offline. We were confident it would be a winner. The result was a shock: the challenger model produced a **statistically significant *decrease*** in actual revenue per user during the 30-day experiment. The business stakeholders were, justifiably, confused and concerned about the project's ROI.

*   **Chronological Investigation:**
    1.  **Validate the Experiment (Week 1):** The first assumption was that the A/B test itself was flawed. We rigorously checked the setup: Was there Sample Ratio Mismatch (SRM)? Was the user assignment truly random? Was the logging correct? The platform team confirmed the test was executed flawlessly. The negative result was real.
    2.  **Model Autopsy (Week 2):** We performed a deep dive into the challenger model's behavior. Using SHAP, we analyzed the feature contributions for customers where the challenger's prediction differed most from the champion's. A clear pattern emerged: the challenger model had learned to assign extremely high CLV scores to customers who made a single, large, "binge" purchase of discounted, end-of-season items. These customers looked fantastic in a 90-day revenue window but had virtually zero repeat purchases, making their true lifetime value very low.
    3.  **The "Aha!" Moment - The Proxy Was Drifting:** We realized the problem wasn't the model; it was our objective function. In our quest for short-term predictive accuracy, we had built a model that perfectly optimized for a flawed proxy. The relationship between "high 90-day spend" and "high 12-month value" had decayed. The model was doing exactly what we asked it to do, but we were asking the wrong question.
    4.  **Reframing the ML Problem (Week 3-4):** This led to a critical, cross-functional meeting with product, marketing, and data science. We decided to move beyond a simple regression problem. The business didn't just care about *how much* a customer would spend, but also *how likely they were to return*.
    5.  **The Solution - A Multi-Headed Model:** We re-architected our model into a "two-headed" system. The input features and core XGBoost body remained, but it now had two separate output layers (heads):
        *   **Head 1 (Regression):** Predicts the expected 12-month revenue.
        *   **Head 2 (Classification):** Predicts the probability of churn (no purchases in the next 6 months).
    6.  The final "CLV Score" was no longer just the revenue prediction but a combined score, heavily penalizing customers with a high churn probability. This required a significant refactoring of our training and evaluation pipelines.

*   **Lessons Learned:**
    *   **Proxy Metrics are a Necessary Evil, but a Dangerous One:** They must be continuously validated against the true north-star business KPI. Their correlation is not static.
    *   **Offline Metrics are Not Ground Truth:** The ultimate arbiter of a model's value is its impact in a live, online experiment. Never blindly trust offline results, no matter how good they look.
    *   **Be Prepared to Redefine Success:** The most valuable lesson was being humble enough to admit our entire problem framing was wrong and being agile enough to pivot. MLOps isn't just about iterating on models; it's about iterating on the *problem definition itself* based on production feedback.


#### **Challenge 3: The Self-Fulfilling Prophecy: When an "Improving" Model Hides a Stagnating Business**

This was the most subtle and complex challenge we faced. It was a classic case of a degenerate feedback loop, where the model's success was creating an echo chamber that masked a critical business problem.

*   **The "Success" Story:** For over six months, our CLV system was seen as a resounding success. The model was retrained weekly, and with each retraining, its offline accuracy (RMSE) and ranking ability (Gini coefficient) on newly held-out data were consistently improving. The prediction drift was low. From a technical standpoint, the model was performing beautifully.
*   **The Alarming Disconnect:** The business analytics team presented a report that sent a chill through the project team. While our model was reporting ever-improving performance, the company's overall 6-month customer retention rate had been completely flat. Even more concerning, the growth in revenue from our "high-value" segments was slowing down. Our model's "success" was completely disconnected from the business's reality.

*   **Chronological Investigation:**
    1.  **Initial Confusion (Week 1):** The data science team was stumped. Their offline metrics, calculated correctly on temporally held-out data, showed clear improvement. They re-ran evaluations and confirmed the numbers. The model *was* getting better at predicting the outcomes in the data it was seeing.
    2.  **The Feedback Loop Hypothesis (Week 2):** During a tense brainstorming session, the MLOps lead proposed the feedback loop theory. The marketing team had confirmed they were *exclusively* using our model's scores to target the top 20% of predicted high-CLV customers with their retention campaigns (e.g., special offers, early access).
    3.  **The Realization:** We had created a perfectly sealed loop. The model identified "good" customers. Marketing showered them with attention and offers. These customers, unsurprisingly, continued to purchase, generating the very data that, in the next training cycle, confirmed to the model that they were indeed "good" customers. The model never received new data about the 80% of customers it ignored. It was simply learning its own biases, and its "improving accuracy" was an illusion created by a data-generating process it was directly controlling.
    4.  **The Difficult Conversation and the "Exploration" Experiment (Week 3):** We had to convince the Marketing team to let us run an experiment that felt, to them, counter-intuitive and inefficient. We proposed a formal A/B test not on a new model, but on a new *targeting strategy*.
        *   **Control Group (90% of campaign budget):** Continue targeting the top 20% of customers as predicted by the current model.
        *   **Treatment / "Exploration" Group (10% of budget):** Target a *completely random sample* of customers from across the *entire* CLV spectrum, including those the model predicted were low-value.
    5.  **Running the Test (Month 2):** This required significant stakeholder management. The marketing team was concerned about "wasting" their budget on "bad" customers, which could hurt their quarterly KPIs. We had to make the case that this short-term "cost" was a crucial investment in the long-term health and learning capability of our entire personalization engine.
    6.  **The Breakthrough (Month 3):** The experiment concluded. As expected, the immediate ROI from the Exploration group was lower. But the data we collected was invaluable. We used the labeled data from this unbiased 10% sample to retrain the CLV model. The newly trained model was, on paper, slightly less accurate on the old, biased data. But it had "rediscovered" patterns of value in the segments it had previously ignored. The very next A/B test comparing this new model to the old one showed a significant lift in identifying and converting "at-risk, high-potential" customers.

*   **Lessons Learned:**
    *   **Actively Fight Feedback Loops:** If your model's outputs influence user treatment, you *must* assume a feedback loop exists. The only way to break it is with intentional, randomized exploration.
    *   **Business Process is Part of the ML System:** The solution wasn't a new algorithm; it was changing the business process (marketing targeting). A holistic MLOps view must encompass how the model is consumed by downstream teams.
    *   **Invest in "Strategic Inefficiency":** A budget for random exploration might seem inefficient, but it's the cost of buying unbiased data to prevent your entire system from becoming stale and biased. This "inefficiency" is one of the most strategic investments you can make.
-->

