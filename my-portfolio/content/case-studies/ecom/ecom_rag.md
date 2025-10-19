# RAG-Based Product Discovery
##

___


### **TLDR: From Clunky Search to Conversational Commerce**

- **Challenge**
    - For a mid-sized European e-commerce marketplace, the traditional keyword-based search was a significant source of user frustration and lost revenue. It failed to understand user intent, could not handle synonyms or multimodal queries (images), and led to high rates of "no results found," causing customers to abandon their purchasing journey.

- **My Role & Solution**
    - As the lead **ML/GenAI Engineer**, I designed and implemented an end-to-end **Multimodal Retrieval-Augmented Generation (RAG)** system to transform the search bar into an intelligent, conversational shopping assistant. My contributions spanned the entire MLOps lifecycle: <br><br> **1. Strategy & Architecture:** I architected a scalable, cost-effective solution on AWS, leveraging a modular, microservices-based design. <br> **2. Data Ingestion & Indexing:** I built the automated pipelines using **AWS Glue, Lambda, and Step Functions** to process and index the multimodal product catalog (text, images, PDFs) into **Amazon OpenSearch**. <br> **3. RAG Development & Iteration:** I drove the experimentation process, systematically progressing from a baseline RAG to implementing advanced strategies like **Hybrid Search, Contextual Re-ranking, and Multimodal Retrieval** using **Amazon Bedrock (Claude 3, Titan Embeddings)** and **LangChain**. <br> **4. Continual Learning:** I designed and built the **"Data Flywheel" pipeline** using **Amazon SageMaker** to periodically fine-tune the embedding model on real user interaction data, ensuring the system continuously improves. <br> **5. Productionization & Monitoring:** I engineered the low-latency **Inference Pipeline** on **AWS Fargate**, established a comprehensive observability stack using **LangSmith and CloudWatch**, and implemented a rigorous **A/B testing framework** to validate business impact in production.

- **Impact**
    - The project successfully transitioned the search experience from a liability to a strategic asset. By deploying this system, we achieved measurable improvements in key business metrics over six months of A/B testing: <br> - **+12% Increase in Search-to-Purchase Conversion Rate:** Users found relevant products more quickly and confidently. <br> - **+7% Increase in Average Order Value (AOV):** The conversational assistant effectively cross-sold and recommended relevant complementary products. <br> - **-85% Reduction in "No Results Found" Rate:** The system's semantic and multimodal understanding dramatically improved query success. <br> - **Maintained <500ms p99 Latency:** Ensured a fast and responsive user experience even at peak traffic.

**System Architecture**

The final architecture is a robust, event-driven system on AWS that balances real-time performance with offline continuous improvement. My core contributions are highlighted in green.

<img src="../_static/past_experiences/ecom_rag/contributions.png" width="100%" style="background-color: #FCF1EF;"/>



___



### **1. Business Challenge: Beyond the Limitations of Keyword Search**

For any e-commerce marketplace, the search bar is not merely a utility; it is the single most critical touchpoint for high-intent customers. Users who engage with search are responsible for a disproportionate share of revenue, yet the underlying technology of traditional keyword-based search is fundamentally broken. It operates on a brittle system of lexical matching, failing to comprehend the semantic nuance, context, and visual nature of user intent. This technological deficit is a primary driver of customer frustration, site abandonment, and direct revenue loss.

#### **The Limitations of Traditional Keyword Search**

Traditional search systems are plagued by several well-documented failure modes that create significant friction in the product discovery journey:

*   **Lack of Semantic Understanding:** The system cannot grasp synonyms or conceptual relationships. A search for "denim pants" will fail if products are tagged exclusively as "jeans," and a query for "a dress for a summer wedding" is treated as a simple keyword match, returning a mix of unrelated items.
*   **Poor Error and Variation Tolerance:** Simple misspellings or regional variations in terminology frequently lead to a "no results found" page, immediately halting the customer journey.
*   **Inability to Handle Complex Queries:** Users often search with multiple attributes in mind (e.g., "waterproof trail running shoes for wide feet under $150"). Keyword systems struggle to handle this complexity, often returning zero results if no single product matches every specific term.
*   **Blindness to Visual Intent:** E-commerce is an inherently visual experience. A customer may want to find a product that *looks like* one they've seen elsewhere. Traditional search is completely blind to this powerful, image-based intent.

#### **The Tangible Business Impact**

These technical failings translate directly into significant negative business outcomes:

*   **Direct Revenue Loss:** Industry data reveals that a staggering 85% of e-commerce site searches fail to return the intended product. This leads to high bounce rates and abandoned carts, as frustrated users quickly leave for a competitor's site.
*   **Degraded Customer Experience:** A poor search experience erodes user trust and damages brand perception. When a search returns irrelevant results or a blank page, the customer loses confidence in the platform's ability to meet their needs.
*   **High Operational Overhead:** Maintaining a keyword-based search system is a constant, manual effort. Engineering and product teams are burdened with the endless task of managing synonym lists, redirect rules, and product tags—a slow, expensive, and ultimately scalable process that cannot keep pace with evolving product catalogs and consumer language.

#### **Project Goals: From Transactional Search to Conversational Discovery**

The objective of this project was to address these challenges by fundamentally re-architecting the product discovery experience. The goal was to transition from a simple, transactional search box to an intelligent, conversational shopping assistant powered by Retrieval-Augmented Generation (RAG).

The primary goals were to:

*   **Enable Semantic and Multimodal Understanding:** Build a system that comprehends the user's intent from natural language text and visual queries (images), retrieving products based on conceptual meaning rather than just keyword matches.
*   **Ensure Factual Grounding and Accuracy:** Leverage a RAG architecture to ensure all generated responses and product recommendations are grounded in the factual, up-to-date information from the product catalog, eliminating hallucinations about product details.
*   **Reduce User Friction and Guide the Journey:** Create an interactive, conversational interface that can answer specific product questions, offer personalized recommendations, and guide the user from a broad query to a confident purchase decision.
*   **Establish a Scalable and Automated MLOps Foundation:** Build the necessary data ingestion, evaluation, and monitoring pipelines to ensure the system is reliable, cost-effective, and capable of continuous improvement.

#### **Measuring Success: Tying Technology to Business Value**

To validate the project's impact, a clear set of Key Performance Indicators (KPIs) was established. These metrics were designed to measure success not just in technical terms, but in direct relation to core business objectives.

##### **Primary Business KPIs**

These metrics are the ultimate measure of the project's financial and strategic success.

| KPI | Why It Matters |
| :--- | :--- |
| **Search-to-Purchase Conversion Rate** | The single most important metric. It directly measures the percentage of search sessions that result in a completed purchase, proving the system's effectiveness in driving revenue. |
| **Average Order Value (AOV)** | A rising AOV indicates the conversational system is successfully cross-selling and up-selling by recommending relevant complementary products or higher-value alternatives. |
| **Revenue Per Search User** | This KPI normalizes revenue by the number of users who engage with search, providing a clear measure of the feature's direct financial contribution. |
| **Reduction in "No Results" Rate** | A direct measure of the system's improved ability to handle a wider range of user queries, indicating a significant reduction in a major point of user frustration. |

##### **Secondary Engagement KPIs**

These leading indicators measure user interaction and satisfaction, providing an early signal of the system's health and its impact on the customer experience.

| KPI | Why It Matters |
| :--- | :--- |
| **Search Engagement Rate** | The percentage of site visitors who choose to interact with the new RAG-based search. An increase indicates that the feature is discoverable, intuitive, and perceived as valuable. |
| **Reduced Query Reformulation Rate** | Measures how often users need to rephrase or alter their search query. A lower rate is a strong signal that the system is understanding user intent correctly on the first attempt. |
| **Explicit User Feedback Score** | The ratio of "thumbs up" to "thumbs down" on generated responses. This provides a direct, real-time pulse on user-perceived answer quality and satisfaction. |
| **Click-Through Rate (CTR) on Cited Sources** | The percentage of responses where a user clicks on a linked product. This acts as a proxy for retrieval relevance and user trust in the provided information. |


___




### **2. Problem Framing: From Business Need to a Measurable ML Vision**

Building a successful Generative AI application does not begin with algorithms or infrastructure; it begins with a rigorous process of **Problem Framing**. This foundational stage translates a high-level business objective into a well-defined, feasible, and measurable machine learning task. A flawed framing can lead a project to deliver a technically impressive system that provides no real business value. This section outlines the structured process used to define the vision for the RAG-based search system.

#### **A. Setting the Business Objectives**

The project originated from a core business need: to transform the underperforming, keyword-based search bar into a revenue-driving, customer-centric product discovery engine. After aligning with key stakeholders—including Product Management, Sales, and Engineering—the primary business objectives were defined:

*   **Increase Revenue:** Directly tie the improved search experience to top-line growth by increasing conversion rates and average order value.
*   **Enhance Customer Satisfaction:** Reduce the friction and frustration inherent in traditional search, leading to higher user engagement, longer session durations, and improved brand loyalty.
*   **Reduce Operational Overhead:** Automate the process of understanding product relationships and user intent, eliminating the costly and scalable manual effort required to maintain keyword lists and synonym dictionaries.

#### **B. Is RAG the Right Approach? (GenAI Use Case Evaluation)**

Before committing to a complex RAG architecture, a critical evaluation was performed to determine if Generative AI was the appropriate solution.

**When to Use RAG for E-commerce Search:**

*   **Complex Patterns:** User queries are expressed in natural language, full of nuance, context, and ambiguity that simple rule-based systems cannot handle. RAG is designed to interpret these complex linguistic patterns.
*   **Existing Knowledge Base:** A rich, diverse knowledge base already exists in the form of product catalogs, detailed descriptions, customer reviews, and images. RAG excels at activating this latent knowledge.
*   **Need for Grounded Generation:** The system must provide factually accurate information about products. RAG's ability to ground LLM responses in retrieved, authoritative data is critical for preventing hallucinations and building user trust.
*   **Scalability and Evolving Data:** The product catalog is constantly changing. A RAG system, supported by automated ingestion pipelines, can adapt to this evolving knowledge base far more effectively than a manually curated system.

**When a Simpler Solution Might Suffice:**

*   If the product catalog were small, static, and had a very simple query space, a simpler solution involving keyword search with a well-maintained synonym list might be adequate. However, given the scale, diversity, and dynamic nature of a modern e-commerce marketplace, this approach was deemed insufficient and unsustainable.

**The Value Proposition of RAG-Powered Search**

The analysis concluded that RAG was the optimal approach. It enables a paradigm shift from a simple search box to a conversational shopping assistant that understands intent, answers specific questions, and guides users through their discovery journey. This creates a powerful **data flywheel**: as more users engage with the improved system, they generate richer interaction data (clicks, conversions, feedback), which can then be used to continuously fine-tune the retrieval and ranking models, creating a virtuous cycle of improvement.

#### **C. Defining the ML Problem**

The broad business objective was translated into a specific, technical machine learning problem.

*   **Ideal Outcome:** A user finds the product that best meets their functional needs and stylistic preferences, resulting in a confident purchase.
*   **System's Goal:** Given a multimodal user query (text and/or image), the system must:
    1.  **Retrieve** a ranked list of the most relevant product information (descriptions, specifications, images, reviews) from the knowledge base.
    2.  **Generate** a helpful, concise, and factually accurate natural language response that answers the user's question and presents the most relevant products, citing its sources.
*   **ML Task Formulation:** This is a composite system that relies on several ML tasks:
    *   **Information Retrieval:** At its core, this is a retrieval problem. The primary task is to rank documents based on their semantic relevance to a query.
    *   **Text Generation:** The final step involves conditional text generation by an LLM
*   **The "Relevance" Proxy:** The ideal outcome ("user satisfaction") is not directly measurable as a label. Therefore, **relevance** is used as a proxy. This relevance is further approximated by measurable user behaviors, which serve as the implicit labels for training and evaluation:
    *   **Good Proxies:** `Purchase`, `Add-to-Cart`. These are strong signals of relevance but are relatively sparse.
    *   **Weaker Proxies:** `Click`, `Dwell Time`. These are more abundant but can be noisy (e.g., a user might click on an irrelevant but eye-catching product).

#### **D. Assessing Feasibility & Risks**

A thorough feasibility assessment was conducted to identify potential risks and ensure the project was achievable within the given constraints.

| Category | Assessment | Notes & Mitigation Strategy |
| :--- | :--- | :--- |
| **Data** | **Medium Risk** | **Risk:** Inconsistent quality and structure across product descriptions and reviews. **Mitigation:** Invest heavily in a robust data cleaning and pre-processing pipeline. Start with a single, clean product category for the PoC. |
| **Problem Difficulty** | **High Risk** | **Risk:** Multimodal and multilingual RAG are technically complex. Achieving low latency at scale is a significant engineering challenge. **Mitigation:** Adopt a phased approach. Begin with text-only RAG, then incrementally add multimodal and multilingual capabilities after the core system is validated. |
| **Prediction Quality** | **High Risk** | **Risk:** The cost of errors is high. An irrelevant result is a lost sale. A hallucinated product feature erodes trust and can lead to returns. **Mitigation:** Prioritize groundedness and factual accuracy in model evaluation. Implement rigorous prompt engineering and output guardrails. |
| **Technical Requirements** | **High Risk** | **Risk:** Sub-second p99 latency is required for a good user experience. LLM API and vector database costs can scale unpredictably. **Mitigation:** Architect for performance from day one with aggressive caching. Implement strict cost monitoring and alerting. Use smaller, faster models where possible. |
| **Ethics & Fairness** | **Medium Risk** | **Risk:** Potential for the model to amplify biases present in historical data (e.g., in product reviews or sales trends). **Mitigation:** Implement bias detection tools during evaluation. Ensure fairness is a key metric in re-ranker training. Provide transparency to users. |

#### **E. Defining Success Metrics**

A multi-layered set of metrics was defined to provide a holistic view of the system's performance, from its operational health to its direct impact on business goals.

| Metric Type | Metric Name | How It's Measured | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Business (Primary)** | **Search-to-Purchase Conversion Rate** | A/B testing: (Purchases from Search) / (Total Search Sessions). | The ultimate measure of the system's ability to drive revenue. |
| **Business (Primary)** | **Average Order Value (AOV)** | A/B testing: (Total Revenue from Search) / (Number of Orders from Search). | Measures the effectiveness of cross-selling and up-selling within the conversational experience. |
| **Model Evaluation (Retrieval)** | **Mean Reciprocal Rank (MRR)** | Offline evaluation against a golden dataset of (query, relevant\_product) pairs. | Measures the quality of the ranking, ensuring the *best* result appears near the top. |
| **Model Evaluation (Generation)** | **Groundedness / Faithfulness** | Offline evaluation using an LLM-as-a-judge to score if the generated answer is factually consistent with the retrieved context. | The most critical AI quality metric. Directly measures the system's resistance to hallucination and builds user trust. |
| **Operational (Online)** | **p99 End-to-End Latency** | Real-time monitoring of the API endpoint. | Ensures a fast and responsive user experience, which is critical for maintaining engagement and conversions. |
| **Operational (Online)** | **Cost-per-Query** | Aggregating costs from all services (Vector DB, LLM API, Compute) involved in a single request. | Provides financial visibility and ensures the system remains economically viable at scale. |
| **User Engagement (Secondary)** | **User Feedback Ratio** | Tracking the ratio of "thumbs up" to "thumbs down" clicks on generated responses. | A direct, real-time signal of user-perceived quality and satisfaction. |

___



### **3. The End-to-End Project and Operational Blueprint**

#### A. The LLMOps Tech Stack: An Architectural Blueprint

Building a production-grade RAG system requires a deliberate and holistic approach to technology selection. The MLOps Stack Canvas provides a structured framework for architecting the end-to-end system, ensuring that every component—from data ingestion to production monitoring—is chosen to meet the specific demands of a Generative AI application.

The following stack was selected to prioritize managed services for scalability and reduced operational overhead, while leveraging specialized frameworks like LangChain for rapid development and LangSmith for essential LLM-specific observability.



| Canvas Block | Chosen Stack & Rationale | Key GenAI/RAG Considerations |
| :--- | :--- | :--- |
| **1\. Value Proposition** | **Project Charter & Design Docs** | **Goal Alignment:** This block is the strategic "why." It ensures all technical decisions directly align with the business objective: creating a conversational, multimodal product discovery engine to drive revenue and customer satisfaction. |
| **2\. Knowledge Base & Data Versioning** | **Vector DB:** Amazon OpenSearch (k-NN) <br> **Data Lake:** AWS S3 <br> **Versioning:** DVC | **The Heart of RAG:** The Vector DB is the indexed, searchable knowledge base. OpenSearch is chosen for its scalability and hybrid search capabilities. S3 serves as the raw data lake for documents and images before they are processed and indexed. DVC versions the curated datasets used for model fine-tuning. |
| **3\. Experiment Management** | **Amazon SageMaker Studio** (Notebooks) & **LangSmith** (Tracing/Evaluation) | **Shift from Model to Pipeline:** For RAG, the core "experiment" is less about model architecture and more about prompt engineering and pipeline configuration (e.g., chunking, retrieval). LangSmith is purpose-built for tracing and evaluating these complex LLM chains, making it superior to traditional tools for this use case. |
| **4\. Feature Store for Re-ranking** | **Amazon SageMaker Feature Store** & **AWS Step Functions** (Orchestration) | **Enrichment for Precision:** The Feature Store serves structured, real-time features (e.g., `popularity`, `inventory_level`) for the **re-ranking model**. This is a classic ML feature serving pattern used to inject business logic into the final ranking, distinct from the unstructured retrieval of the Vector DB. |
| **5\. Foundations (DevOps & Code)** | **Git (GitHub)**, **Terraform (IaC)**, & **GitHub Actions (CI/CD)** | **Prompts as Code:** A standard, best-practice DevOps foundation. A key adaptation for GenAI is treating **prompt templates** as critical, version-controlled code artifacts. Terraform ensures the entire cloud infrastructure is reproducible and auditable. |
| **6\. Continuous Training & Indexing** | **GitHub Actions** triggering **AWS Step Functions** | **Focus on Re-Indexing & Fine-Tuning:** The "training" pipeline here is twofold: 1) The frequent re-indexing of the Vector DB as the product catalog changes, and 2) The periodic fine-tuning of the embedding or re-ranking models. These are orchestrated, automated workflows. |
| **7\. Model Registry & Versioning** | **Amazon SageMaker Model Registry** | **Managing Custom Models:** The registry is used to version and store the custom-trained models that we own—specifically, the fine-tuned embedding model and the contextual re-ranker. The foundational LLM is a managed API endpoint and is not stored here. |
| **8\. Deployment & Serving** | **Amazon Bedrock** (LLM), **SageMaker Endpoints** (Custom Models), **API Gateway** + **AWS Lambda** (Inference Service) | **A Distributed System:** The RAG serving layer is a distributed application. The Lambda function acts as the orchestrator, making real-time calls to SageMaker (re-ranking), **OpenSearch (retrieval)**, and Amazon Bedrock (generation). This modularity allows independent scaling. |
| **9\. System & Model Monitoring** | **LangSmith** & **Amazon CloudWatch** | **LLM-Specific Observability:** This is a critical adaptation from traditional MLOps. While CloudWatch monitors infrastructure health (latency, errors), **LangSmith** provides essential, LLM-specific observability by tracing queries, monitoring for hallucinations, tracking token usage, and collecting user feedback. |
| **10\. Metadata & Artifacts** | **LangSmith**, **OpenSearch Metadata**, **DynamoDB** | **Rich Metadata is Key:** Metadata is mission-critical. It links vector chunks back to their source product pages for citation. It enables filtering in OpenSearch. It stores traces and feedback in LangSmith. A dedicated table in DynamoDB can track the lineage of datasets and model versions. |
| **11\. Build vs. Buy** | **Hybrid: Buy Core, Build Differentiators** | **Buy:** Leverage managed services for foundational components to accelerate development (Amazon Bedrock for LLMs, Amazon OpenSearch for vector search). **Build:** Focus engineering effort on the components that create a competitive advantage—the custom re-ranking model and the domain-specific ingestion logic. |
| **12\. Platform & Skills** | **Integrated AWS Platform** | **Unified Ecosystem:** Choosing an integrated platform like AWS simplifies security, networking, and billing. It requires a cross-functional team with skills in data engineering, ML engineering, and data science, augmented by prompt engineering expertise. |



---

#### B. The Four Core Pipelines: An Operational Blueprint

The end-to-end RAG system is powered by four distinct but interconnected pipelines. Two are offline processes focused on building and improving the system's intelligence, while two are online, real-time processes that deliver the user experience and monitor its health.

| Pipeline & Cadence | Trigger | Inputs | Key Steps | Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **1\. Data Ingestion & Indexing Pipeline** <br> *(Batch/Streaming)* | - **Scheduled:** Nightly full-catalog refresh (via Amazon EventBridge). <br> - **Event-Driven:** Real-time updates for single product changes (e.g., price, inventory) triggered by database events. | - Raw product data (from PIM/DB). <br> - Unstructured text (descriptions, reviews). <br> - Product images. | 1.  **Extract:** Pull data from all source systems. <br> 2.  **Transform & Clean:** Sanitize text, handle missing values, and structure data into a unified JSON format per product. <br> 3.  **Chunk:** Break down long text documents into semantically coherent chunks. <br> 4.  **Generate Embeddings:** Create text embeddings (e.g., with Amazon Titan) for text chunks and image embeddings for product images. <br> 5.  **Index Data:** Load the embeddings and rich metadata (product\_id, category, brand) into the Amazon OpenSearch vector index. | - A fully populated and up-to-date vector index in Amazon OpenSearch. <br> - Execution logs and data quality reports. |
| **2\. Inference Pipeline** <br> *(Real-time)* | - User query via the application's API Gateway. | - User query (text and/or image). <br> - User context (e.g., user ID for personalization signals). | 1.  **Query Transformation:** Apply techniques like HyDE to enhance the query for better retrieval. <br> 2.  **Hybrid Retrieval:** Perform parallel semantic (vector) and keyword search to get top-K candidate documents. <br> 3.  **Contextual Re-ranking:** Re-rank the candidates using a model that incorporates business logic (e.g., popularity, stock levels) and personalization. <br> 4.  **Prompt Construction:** Build a final, optimized prompt with the top-ranked context and system instructions. <br> 5.  **LLM Generation:** Call Amazon Bedrock to generate a response, streaming the result token-by-token. <br> 6.  **Post-processing & Guardrails:** Apply safety filters and format the response with source citations. | - A streamed, factually grounded, and safe response delivered to the user. <br> - A detailed trace of the entire request (latency, token counts, retrieved docs) sent to the observability platform (LangSmith/CloudWatch). |
| **3\. Monitoring & Observability Pipeline** <br> *(Continuous)* | - Continuous ingestion of data streams from all production services. | - System logs, metrics (latency, error rates), and traces from all services. <br> - LLM interaction data from LangSmith (prompts, responses, token usage, feedback). <br> - User feedback events ('thumbs up/down'). | 1.  **Collect & Aggregate:** Gather data from CloudWatch, LangSmith, and application logs. <br> 2.  **Process & Analyze:** Calculate key metrics (p99 latency, cost-per-query, groundedness scores). <br> 3.  **Drift & Anomaly Detection:** Monitor for data drift in inputs and concept drift in model outputs. <br> 4.  **Alerting:** Trigger alerts (e.g., via PagerDuty/Slack) when KPIs or operational metrics breach pre-defined thresholds. | - Real-time dashboards (in CloudWatch/Grafana) showing system health, cost, and AI quality. <br> - Actionable alerts for the on-call engineering team. <br> - A curated dataset of logs and feedback to fuel the Continual Learning Pipeline. |
| **4\. Continual Learning / Data Flywheel Pipeline** <br> *(Periodic)* | - **Scheduled:** Weekly or bi-weekly execution. <br> - **Manual:** Triggered by an ML engineer after a significant product catalog update or observed performance degradation. | - Aggregated user interaction logs (queries, clicks, conversions) from the observability system. <br> - User-flagged poor responses and explicit feedback data. | 1.  **Dataset Creation:** Process interaction logs to create new, high-quality training datasets of (query, relevant\_product) pairs. <br> 2.  **Model Retraining/Fine-tuning:** Use the new dataset to fine-tune the embedding model or retrain the contextual re-ranking model. <br> 3.  **Offline Evaluation:** Rigorously evaluate the new candidate model against the current production model on offline metrics (MRR, NDCG). <br> 4.  **Staging & A/B Test Setup:** If the candidate model is superior, register it and prepare a new A/B testing configuration for production deployment. | - A new, versioned, and evaluated candidate model in the Amazon SageMaker Model Registry. <br> - Evaluation reports comparing the candidate model to the production "champion." <br> - A deployment configuration ready for a live A/B test. |


___

#### **C. Project Management and Operational Strategy**

A successful GenAI project requires more than just a strong technical architecture; it demands a well-defined plan, a clear team structure, and a robust governance strategy. This blueprint outlines the phased approach to development, the roles and responsibilities of the cross-functional team, and the versioning strategy that ensures reproducibility and quality from experimentation to production.

##### **1. Project Stages: An Iterative Path to Production**

We adopted an agile, iterative methodology designed to deliver value quickly, manage risk, and incorporate learnings at each stage. The project is broken down into five distinct, overlapping phases.

| Stage | Timeline | Key Activities & Objectives |
| :--- | :--- | :--- |
| **1\. Ideation & Planning** | Weeks 1-4 | - **Finalize Business Objectives:** Solidify the KPIs and secure stakeholder alignment on the project's goals. <br> - **Define MVP Scope:** Narrow the initial focus to a text-only, single-language RAG for one product category to ensure rapid validation. <br> - **Architectural Blueprint:** Finalize the core tech stack choices and create a high-level design for the MVP. |
| **2\. Experiment Management** | Weeks 5-12 | - **Establish Baseline:** Build and rigorously evaluate a "naive" text-only RAG pipeline to establish performance benchmarks. <br> - **Test Advanced RAG:** Systematically experiment with and quantify the impact of Hybrid Search, Contextual Re-ranking, and Query Transformations (HyDE). <br> - **Explore Multimodality:** Develop a PoC for image-based retrieval using multimodal embeddings, updating ingestion and inference pipelines to handle visual queries. <br> - **Validate Multilingual Support:** Test multilingual embedding models and language-specific text processing to assess the feasibility and complexity of international expansion. |
| **3\. Pipelines Development** | Weeks 9-16 | - **Build Data Ingestion Pipeline:** Engineer the robust, automated ETL pipeline in AWS, orchestrating it with AWS Step Functions. <br> - **Engineer Inference Pipeline:** Develop the production-grade, low-latency inference service using API Gateway and AWS Lambda. <br> - **Implement MLOps Pipelines:** Build the CI/CD workflows in GitHub Actions for automated testing and deployment, and script the periodic Continual Learning pipeline. |
| **4\. Deployment & Serving** | Weeks 17-20 | - **Provision Production Infrastructure:** Use Terraform to deploy the full, scalable production environment. <br> - **Conduct Pre-flight Checks:** Perform end-to-end integration tests and rigorous load testing against the production environment. <br> - **MVP Rollout (A/B Test):** Deploy the MVP to a small segment of live traffic (e.g., 5%) using an A/B testing framework to measure its real-world impact on primary business KPIs. |
| **5\. Monitoring & Continual Learning** | Ongoing | - **Activate Observability:** Continuously monitor system health, cost, and AI quality dashboards (CloudWatch & LangSmith). <br> - **Establish On-Call Rotation:** Respond to automated alerts for latency spikes, error rate increases, or significant model drift. <br> - **Turn the Data Flywheel:** Execute the Continual Learning pipeline on a regular schedule (e.g., bi-weekly) to retrain models with new user interaction data. <br> - **Iterate and Enhance:** Analyze user feedback and monitoring data to inform the roadmap for the next set of features and improvements. |

##### **2. Cross-Functional Team & Roles**

This project's success hinges on the tight collaboration of a dedicated, cross-functional team.

| Role | Key Responsibilities |
| :--- | :--- |
| **Product Manager** | Owns the product vision, defines the roadmap, prioritizes features, and is ultimately responsible for the business KPIs. |
| **Data Engineer** | Designs, builds, and maintains the scalable Data Ingestion and Indexing pipeline. Ensures data quality, freshness, and reliability. |
| **ML/GenAI Engineer (My Role)** | **Leads the end-to-end technical implementation.** Designs and builds the core RAG inference pipeline, implements advanced retrieval and re-ranking strategies, and engineers the MLOps workflows for CI/CD, monitoring, and continual learning. |
| **Data Scientist (My Role)** | Drives the experimentation and evaluation process. Selects, fine-tunes, and analyzes the performance of embedding and re-ranking models. Designs and interprets A/B tests. |
| **Backend Engineer** | Develops the public-facing API endpoints, handles user authentication, and integrates the RAG service with the broader e-commerce platform. |
| **Frontend Engineer** | Builds, tests, and iterates on the conversational user interface, focusing on creating an intuitive and responsive experience. |

##### **3. Versioning and Governance Strategy**

A strict versioning and governance strategy is essential for ensuring reproducibility, quality, and maintainability.

| Artifact | Versioning Tool | Governance Policy |
| :--- | :--- | :--- |
| **Code** (Application, Pipelines, Tests) | **Git (GitHub)** | All code changes must be submitted via a pull request (PR) and require at least one peer review and passing all CI checks before being merged. We follow a GitFlow branching model to manage features, releases, and hotfixes. |
| **Infrastructure** | **Terraform & Git** | The state of all cloud infrastructure is defined declaratively in Terraform. All infrastructure changes must be reviewed and applied through the CI/CD pipeline. No manual changes to the production environment are permitted. |
| **Data** (for Model Training) | **DVC (Data Version Control)** | The specific datasets used to fine-tune the embedding model or retrain the re-ranker are versioned with DVC. The DVC hash is logged with the model version, ensuring perfect reproducibility. |
| **Prompts** | **Git** | All system prompt templates are treated as mission-critical code. They are stored in a dedicated repository, versioned in Git, and deployed through the CI/CD pipeline. |
| **Models** (Custom-trained) | **Amazon SageMaker Model Registry** | Every custom-trained model (embedding, re-ranker) is versioned and registered. The registry entry links the model artifact to its source code, training data version, and its offline evaluation metrics, providing a complete audit trail. A model cannot be deployed unless its evaluation metrics meet a pre-defined quality bar. |

___


#### **D. Comprehensive Evaluation Strategy: The Quality Gauntlet**

A production-grade RAG system requires a multi-layered evaluation strategy that goes far beyond simple accuracy. Our approach is to treat testing not as a single stage, but as a continuous process embedded throughout the entire lifecycle. We will evaluate individual components (retrieval, generation), the integrated pipelines, and the live system's impact on business KPIs.

##### 1. Offline Evaluation: Component-Wise and Pipeline Testing

This is the "dress rehearsal" stage, conducted in development and staging environments before any code or model is exposed to users. Its purpose is to ensure each component works correctly and the integrated system is robust.

| Test Category | What We're Testing | Tools & Methods | Key Metrics & Success Criteria |
| :--- | :--- | :--- | :--- |
| **1\. Data & Knowledge Base Validation** | **Quality of "Ingredients":** Ensuring the product data fed into the system is clean, complete, and correctly structured. | - **Great Expectations:** To define and validate schemas and data quality rules for product catalogs. <br> - **Custom `pytest` checks:** For validating the output of the PDF/URL parsers and text chunking logic. | - **Schema Adherence:** 100% compliance with the expected product data schema. <br> - **Data Integrity:** <1% null values in critical fields like `product_title` and `description`. |
| **2\. Retrieval Evaluation** | **Finding the Right Information:** Does the system retrieve the most relevant product chunks for a given query? | - **"Golden Dataset":** A manually curated set of 100-200 (query, relevant\_product\_id) pairs representing common and difficult search scenarios. <br> - **Offline Metric Calculation:** Using the golden dataset to test different retrieval strategies (Vector vs. Hybrid vs. HyDE). | - **Hit Rate @ K=5 > 95%:** At least one correct product is found in the top 5 results. <br> - **MRR > 0.90:** The first correct result is, on average, very close to the top position. <br> - **NDCG@10 > 0.85:** The overall ranking of the top 10 results is highly relevant. |
| **3\. Generation Evaluation** | **Generating a Trustworthy Answer:** Is the LLM's final response factually correct, relevant, and helpful? | - **LLM-as-a-Judge:** Using a powerful model (e.g., GPT-4o, Claude 3 Opus) to score the generated answers from our application's LLM (e.g., Claude 3 Sonnet). | - **Groundedness/Faithfulness > 99%:** The answer must be factually consistent with the retrieved context. This is non-negotiable. <br> - **Answer Relevance > 95%:** The answer directly addresses the user's query. |
| **4\. End-to-End Pipeline Tests** | **Integration & Robustness:** Does the entire pipeline—from query ingestion to response generation—function correctly on a staging environment? | - **`pytest` Integration Tests:** Simulate API calls to a staging endpoint and assert the correctness of the response structure. <br> - **Locust Load Tests:** Simulate realistic traffic patterns against the staging environment. | - **100% Pass Rate** on integration test suite. <br> - **p99 Latency < 1500ms** under simulated peak load. <br> - **Error Rate < 0.1%** during load test. |
| **5\. Guardrail & Safety Tests** | **System Resilience & Responsibility:** Does the system handle inappropriate inputs and avoid generating harmful outputs? | - **Adversarial Test Suite:** A curated set of prompts designed to test for prompt injections, topical refusals, and toxic content generation. | - **Refusal Rate > 99%** for out-of-scope topics (e.g., medical advice). <br> - **0 Harmful Outputs:** System must not generate toxic, biased, or unsafe content. |

##### 2. Online Evaluation: Testing in Production

The ultimate test of the system's value is its performance with real users and its impact on the business. This is measured through carefully controlled online experiments.

| Test Category | What We're Testing | Tools & Methods | Key Metrics & Success Criteria |
| :--- | :--- | :--- | :--- |
| **1\. Business Impact (A/B Testing)** | **Driving Real Value:** Does the new RAG system outperform the legacy keyword search on core business metrics? | - **A/B Testing Framework:** Randomly assigning users to either the legacy search (Control) or the new RAG search (Variant) and comparing their behavior over time. | - **Primary KPI:** Statistically significant **increase in Search-to-Purchase Conversion Rate** for the Variant group. <br> - **Secondary KPIs:** Statistically significant increases in AOV and Revenue Per Search User. |
| **2\. User Satisfaction & Engagement** | **Is the Experience Better?** Are users engaging more with the new system and do they perceive it as higher quality? | - **A/B Testing Framework** <br> - **Implicit Signals:** Tracking user actions like query reformulation, clicks on product links, and session duration. <br> - **Explicit Feedback:** Analyzing the "thumbs up/down" ratio for generated responses. | - **Reduced Query Reformulation Rate:** Users find what they need on the first try. <br> - **Higher Click-Through Rate (CTR)** on recommended products. <br> - **Positive Feedback Ratio > 85%**. |
| **3\. Model Performance Monitoring (Shadow Testing)** | **Safe Model Rollouts:** How does a new candidate model (e.g., a fine-tuned embedding model) perform on live traffic without impacting users? | - **Shadow Deployment:** Route a copy of live production traffic to the new candidate model in the background. The user sees the response from the current production model, but the candidate model's response is logged for analysis. | - **Offline Metric Comparison:** Compare the candidate's retrieval metrics (Hit Rate, MRR) against the production model on the same set of live queries. <br> - **Latency Check:** Ensure the candidate model meets latency SLOs before considering a promotion to an A/B test. |

This comprehensive, two-pronged evaluation strategy ensures that we are not only building a system that is technically correct and robust (Offline Evaluation) but also one that is demonstrably effective and valuable in the real world (Online Evaluation). It provides a clear, data-driven framework for making decisions about which models to promote, which features to prioritize, and how to continuously improve the system over time.


---

<!--
### **4. Data Sourcing, Discovery, and Analysis**

The foundation of any high-performing RAG system is a deep understanding of its data ecosystem. This involves not only identifying the available data sources but also characterizing their volume, velocity, and inherent complexities. This analysis directly informs the architectural decisions for the ingestion pipelines, the choice of models, and the strategies required for governance and compliance.

#### **A. Data Characteristics**

For a mid-sized European e-commerce marketplace with approximately 75,000 active SKUs and 250,000 daily active users, the data landscape is diverse and dynamic. The following table characterizes the key data sources that fuel the RAG system and the broader MLOps lifecycle.

| Data Source | Description | Volume, Velocity & Profile | Role in RAG & Governance Notes |
| :--- | :--- | :--- | :--- |
| **Product Catalog** | Structured data from the Product Information Management (PIM) system, including SKU, category, brand, price, and stock levels. | **Volume:** ~75,000 active SKUs. <br> **Velocity:** Low. ~500-1,000 new products added per month. <br> **Profile:** Highly structured, single source of truth. | **Role:** Provides the essential **metadata for filtering** in retrieval and for linking all other data back to a specific product. <br> **Governance:** Data consistency is paramount. |
| **Product Descriptions & Documents** | Unstructured and semi-structured text, including detailed marketing copy, specifications, and usage guides, often sourced from PDFs or vendor portals. | **Volume:** ~75,000+ documents. ~1-5 GB of raw text. <br> **Velocity:** Low. Updated when products are added or descriptions are revised. <br> **Profile:** Multilingual (primarily English, German, French). Varies from structured specs to evocative prose. | **Role:** The **primary textual knowledge base** for the RAG system. This content is chunked, embedded, and indexed for semantic retrieval. <br> **Governance:** Requires a robust parsing and cleaning pipeline. |
| **Product Images** | High-resolution product photos from various angles and in lifestyle contexts. | **Volume:** ~300,000+ images (avg. 4 per SKU). ~100-200 GB of image data. <br> **Velocity:** Low. Added with new products. <br> **Profile:** High-quality JPEGs/PNGs. | **Role:** The **core visual knowledge base** for multimodal search. Enables image-based queries and visual similarity search. <br> **Governance:** Must be correctly mapped to the corresponding SKU. |
| **Customer Reviews** | User-generated unstructured text providing real-world feedback, questions, and usage context. | **Volume:** ~4 million total reviews. <br> **Velocity:** Medium. ~1,000-2,000 new reviews per day. <br> **Profile:** Multilingual, grammatically diverse. Highly skewed sentiment distribution (~60% 5-star). | **Role:** A **secondary textual knowledge base**. Enriches the RAG system with authentic user language and long-tail information not found in official descriptions. <br> **Governance:** Requires moderation for toxic content and PII. |
| **Behavioral (Clickstream) Data** | High-velocity event streams tracking all user interactions on the platform. | **Volume:** High. ~5-10 million events/day. ~4-8 GB/day. <br> **Velocity:** High-velocity event streams ingested in near real-time via **AWS Kinesis**. <br> **Profile:** Semi-structured JSON events (`page_view`, `search`, `add_to_cart`). | **Role:** **The fuel for the Data Flywheel.** This data is *not* directly searched by RAG but is used to train the **contextual re-ranking model** to optimize for business outcomes. <br> **Governance:** Requires explicit user consent under GDPR. |
| **Transactional & CRM Data** | Order history, payment status, and customer profile information (e.g., purchase history, country). | **Volume:** Medium. ~4k-6k orders/day. <br> **Velocity:** Near real-time events, ingested in daily batches via **Airflow**. <br> **Profile:** Highly structured and sensitive, containing PII. | **Role:** Provides critical features for the **re-ranking model** (e.g., `is_verified_purchaser`, `lifetime_value`). <br> **Governance:** Strict GDPR rules apply. PII must be masked. Must support the "right to be forgotten." |

-->


### **4. Data Ingestion and Indexing Pipeline: Building the Knowledge Base**

The intelligence of our RAG system is entirely dependent on the quality, freshness, and structure of its knowledge base. The Data Ingestion and Indexing pipeline is the factory that constructs this knowledge base. It is an automated, multi-stage workflow designed to transform raw, heterogeneous product data into a highly searchable, semantically rich index.

The following table details each stage of this foundational pipeline, outlining the specific operations, the chosen tools, and the rationale behind each decision, with a special focus on the requirements of a Generative AI system.

| Stage | Operation Details | Tools | Rationale & LLM-Specific Focus |
| :--- | :--- | :--- | :--- |
| **1\. Source Extraction** | **Extract Heterogeneous Data:** Pull data from all source systems. This includes batch extraction for nightly full-catalog refreshes and event-driven extraction for real-time updates (e.g., price changes, new reviews). | - **AWS Glue** (for batch) <br> - **AWS Lambda** + **Amazon SQS** (for real-time events) | **Rationale:** Glue is optimized for large-scale, scheduled ETL jobs. The Lambda/SQS pattern provides a robust, serverless architecture for low-latency, incremental updates, ensuring the knowledge base remains fresh. |
| **2\. Multimodal Pre-processing** | **Clean & Standardize:** <br> - **Text:** Sanitize by removing HTML tags and special characters. Normalize text (lowercase, handle unicode). <br> - **Tables (from PDFs):** Extract structured data from tables within product manuals and spec sheets. <br> - **Images:** Standardize format (JPEG), resize for consistency, and perform initial quality checks. | - **Unstructured.io / PyMuPDF** <br> - **BeautifulSoup** <br> - Python libraries (`re`, Pillow) | **LLM-Specific Focus:** The quality of the final generated answer is directly capped by the quality of the input text. This "Garbage In, Garbage Out" principle is paramount. Clean, well-parsed text leads to more meaningful and accurate embeddings. |
| **3\. Content Structuring & Chunking** | **Prepare Data for Embedding:** <br> - **Unify:** Consolidate all data for a single product into a unified JSON structure. <br> - **Chunk Text:** Split long descriptions and reviews into smaller, semantically coherent chunks with overlap. <br> - **Serialize Tables:** Convert extracted tables into a Markdown format that is both human-readable and easily understood by an LLM. <br> - **Generate Image Captions:** Use a VLM to create descriptive text captions for each product image to enable text-based retrieval of visual information. | - **LangChain** (`RecursiveCharacterTextSplitter`) <br> - **Amazon Bedrock** (Claude 3 for Image Captioning) | **LLM-Specific Focus:** Chunking is a critical step to fit content within the LLM's context window and improve retrieval precision. Image captioning is a core strategy for enabling multimodal search by "flattening" visual information into a text-based index. |
| **4\. Embedding Generation** | **Convert Content to Vectors:** <br> - **Text Embeddings:** Generate dense vector representations for all text chunks and serialized table descriptions. <br> - **Image Embeddings:** Generate dense vector representations for all product images to enable visual similarity search. | - **Amazon Bedrock** (Titan Text & Titan Multimodal Embedding Models) | **Rationale:** This is the core step that enables semantic search. Using managed models like Amazon Titan simplifies operations and provides state-of-the-art performance. The use of both text and multimodal models is key to our hybrid, multimodal strategy. |
| **5\. Validation & Indexing** | **Quality Gate & Loading:** <br> - **Validate Data:** Before indexing, run automated quality checks on the structured, chunked, and embedded data to ensure integrity. <br> - **Index Embeddings & Metadata:** Load the vector embeddings and their rich metadata (product\_id, category, brand, image\_url) into the vector database. | - **Great Expectations** <br> - **Amazon OpenSearch Service** (with k-NN index) | **Rationale:** The validation step acts as a critical quality gate, preventing corrupt data from polluting our production knowledge base. OpenSearch is chosen for its scalability, managed nature, and robust support for hybrid (vector + keyword) search. |
| **6\. Orchestration & Governance** | **Manage the End-to-End Flow:** <br> - **Orchestrate:** Manage dependencies, retries, and error handling for the entire multi-step pipeline. <br> - **Version Artifacts:** Version the source data (via DVC) and the pipeline definition code (via Git) to ensure reproducibility and enable rollbacks. | - **AWS Step Functions** <br> - **Git & DVC** | **LLM-Specific Focus:** A complex, multi-step pipeline like this requires a robust orchestrator to be reliable. Step Functions provides excellent visibility and error handling. Versioning is critical for debugging issues like performance degradation that may arise from subtle changes in the data or processing logic. |

#### **Architecture Diagram: Data Ingestion and Indexing Pipeline**

The following diagram illustrates the AWS architecture for the orchestrated batch ingestion pipeline.

<img src="../_static/past_experiences/ecom_rag/pipeline_ingestion.png" width="100%" style="background-color: #FCF1EF;"/>


___





### **5. Experiment Management & Iteration: The Path to Precision**

Building a production-grade RAG system is an iterative science. The journey from a basic keyword search to a sophisticated, multimodal, and multilingual conversational engine was guided by a systematic series of experiments. Each stage was designed to test a specific hypothesis, measure its impact against a consistent set of evaluation metrics, and build upon the learnings of the previous stage.

#### **A. The Evaluation Framework: Our North Star**

Before the first experiment, we established a rigorous, multi-faceted evaluation framework to ensure we were measuring what truly matters.

*   **Retrieval Quality (Automated):** Measured on our internal "golden dataset" of query-product pairs.
    *   **Tools:** The open-source `Ragas` framework, integrated into our evaluation pipeline.
    *   **Primary Metrics:** `Context Precision` (is retrieved information relevant?) and `Context Recall` (is *all* relevant information retrieved?). **Mean Reciprocal Rank (MRR)** was our single primary metric for ranking quality.
*   **Generation Quality (Automated + Human):**
    *   **Tools:** `Ragas` and an **LLM-as-a-Judge** pattern using Claude 3 Opus for its superior reasoning.
    *   **Primary Metrics:** `Faithfulness` (is the answer grounded in the context?) was a non-negotiable, automated check. Qualitative metrics like `Conciseness` and `Helpfulness` were scored by the LLM judge.
*   **Business Impact (Live):**
    *   **Tool:** The company's internal A/B testing framework.
    *   **Primary Metric:** **Search-to-Purchase Conversion Rate**. No change was promoted to production unless it demonstrated a neutral or statistically significant positive impact on this metric.


#### B. Building the "Golden Dataset": Synthetic Data Generation for RAG Evaluation

To rigorously benchmark our RAG experiments and ensure our improvements were statistically meaningful, we needed a large, high-quality evaluation dataset. Manually creating tens of thousands of (query, relevant product) pairs was infeasible due to the time and cost involved. Instead, we engineered a scalable pipeline to generate a **synthetic "golden dataset"** using a powerful LLM, a strategy that has become a cornerstone of modern RAG evaluation.

This approach allowed us to create a comprehensive testbed that accurately reflected real-world user behavior while covering the breadth of our product catalog.

##### **The Challenge: The Evaluation Bottleneck**

A small, manually curated set of 100-200 queries is sufficient for initial spot-checking, but it's not large enough to reliably detect small-to-medium performance regressions or validate the impact of advanced RAG strategies across a diverse product catalog. We needed a dataset with tens of thousands of examples to have high statistical confidence in our results.

##### **Our Four-Step Synthetic Generation Pipeline**

We designed and implemented an automated pipeline to generate this dataset, grounding the synthetic data in the reality of our actual users and products.

**Step 1: Curation of the Seed Query Set**

The quality of synthetic data is highly dependent on the quality of the initial examples. To ensure our generated queries were realistic, we did not start from scratch.

*   **Action:** We mined our production logs for a month's worth of anonymized user search queries.
*   **Process:** From this raw log, we curated a "seed set" of ~2,000 unique, high-quality queries. This curation involved cleaning, deduplicating, and, most importantly, **categorizing** the queries into distinct user intents:
    *   **Attribute-based:** "waterproof hiking boots with ankle support"
    *   **Comparative:** "compare sony wh-1000xm5 vs bose qc ultra"
    *   **Conceptual/Use-Case:** "best camera for travel vlogging"
    *   **Question-based:** "is the iphone 15 compatible with a qi charger?"
*   **Purpose:** This categorized seed set served as a powerful "style guide" for the LLM, ensuring it generated a diverse and realistic mix of query types.

**Step 2: Document Chunking for Focused Context**

To prompt the LLM effectively, we needed to provide it with focused, contextually rich pieces of product information.

*   **Action:** We processed each product description document from our catalog through the same `SemanticChunker` used in our production ingestion pipeline.
*   **Purpose:** This ensured that the LLM was generating questions based on the exact same chunks of text that our retriever would be searching over. This alignment between the generation context and the retrieval target is critical for creating a fair and accurate evaluation set.

**Step 3: The LLM-Powered Generation Engine**

This is the core of the pipeline where the synthetic queries are created. We used a powerful reasoning model (Claude 3 Opus) and a carefully engineered prompt.

*   **Action:** For each text chunk from every product, we invoked the LLM with a prompt designed to generate 5-10 realistic queries that could be answered by that specific chunk.
*   **The Prompt:**

```
You are an expert e-commerce data scientist tasked with creating a high-quality evaluation dataset for a new semantic search engine. Your goal is to generate realistic user search queries that can be answered by the provided text snippet from a product description.

**CONTEXT (Product Information Snippet):**
---
{chunk_of_product_text}
---

**INSTRUCTIONS:**
1.  Read the context carefully.
2.  Generate a JSON list of 5 to 10 diverse, realistic user queries that a real shopper might type.
3.  The answer to each query you generate MUST be present in the provided context. Do NOT generate questions that require outside knowledge.
4.  Mimic the style and intent of the following examples. Include a mix of different query types (e.g., questions, comparisons, feature requests).

**EXAMPLES of QUERY STYLES:**
- "compare product A vs product B"
- "does this laptop have a backlit keyboard?"
- "trail running shoes for rocky terrain"
- "lightweight tent for backpacking in summer"

**OUTPUT (JSON format only):**
```

**Step 4: Automated Validation and Final Assembly**

We did not blindly trust the LLM's output. A final, lightweight validation step was crucial to ensure the quality and utility of the dataset.

*   **Action:**
    1.  We programmatically checked that the output was valid JSON.
    2.  We implemented a simple heuristic check to ensure the generated query had a reasonable term overlap with the source chunk, filtering out any queries that seemed to have drifted off-topic.
    3.  Each validated query was stored, creating a final tuple: `(generated_query, source_product_id, source_chunk_id)`.
*   **Outcome:** This pipeline ran over our entire catalog and produced an evaluation dataset of **over 50,000 high-quality (query, relevant\_document\_id) pairs**.

##### **Impact on the Project**

This investment in a high-quality synthetic dataset was a strategic force multiplier. It provided us with a scalable and reliable benchmark that underpinned all subsequent experimentation. It allowed us to:

*   **Quantify Progress:** We could confidently measure the impact of each RAG strategy on our primary retrieval metric (MRR).
*   **Automate Regression Testing:** This dataset became a core part of our CI/CD pipeline, allowing us to automatically detect any performance regressions in our retrieval system before they reached production.
*   **Accelerate Iteration:** It enabled rapid, data-driven decisions about which strategies to pursue and which to discard, dramatically speeding up our development cycle.


#### **How the Golden Dataset is Used to Calculate MRR**

**MRR requires a ranking of products for each query.** Here is the step-by-step process of how we generate that ranking and calculate the metric, which should clarify the entire workflow:

**The Evaluation Process:**

1.  **Take One Query from the Golden Dataset:**
    *   Let's take a query `q1` from our Golden Dataset.
    *   From the dataset, we know the ground truth "correct" answer is `product_id = 'prod_123'`.

2.  **Run the Query Through the System Under Test:**
    *   We take the text of `q1` and feed it into our **entire retrieval system** (e.g., the "Hybrid Search + Re-ranker" system we are evaluating).
    *   The system does its job: it generates an embedding for the query, searches the OpenSearch index, gets a list of candidates, re-ranks them, and returns a **final, ranked list of product IDs**.

3.  **Get the Model-Generated Ranking:**
    *   The output from our system might look like this ranked list of the top 10 results:
        1.  `prod_789`
        2.  `prod_456`
        3.  **`prod_123`**  <-- Our correct answer is here!
        4.  `prod_999`
        5.  `prod_555`
        ... and so on.

4.  **Calculate the Reciprocal Rank for This Query:**
    *   We look for our ground truth answer (`prod_123`) in the model-generated ranking.
    *   We find it at **rank = 3**.
    *   The Reciprocal Rank (RR) for query `q1` is therefore **1 / 3 = 0.33**.
    *   (If the correct answer had been at rank 1, the RR would be 1/1 = 1. If it was not found in the top 10, the RR would be 0 for this query).

5.  **Repeat for All Queries:**
    *   We repeat steps 1-4 for **every single query** in our 50,000+ entry Golden Dataset. Each query will get its own RR score.

6.  **Calculate the Mean Reciprocal Rank (MRR):**
    *   The final MRR score is simply the **average of all the individual RR scores** calculated in step 5.

This process gives us a single, powerful number that represents how well our system performs at placing the *most* relevant document near the top of the search results across thousands of realistic queries. This is how the Golden Dataset, which only contains the "correct" answers, is used to evaluate a system that produces a full ranking.






<!--
#### **C. The Iteration Log: From Baseline to State-of-the-Art**

The following table details the chronological sequence of experiments, the rationale for each, and the cumulative impact on retrieval performance.

| Stage | Experiment & Rationale | Key Models & Tools | Results & Key Learnings | Cumulative MRR |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Baseline: Keyword Search** <br> **Rationale:** Establish a non-AI baseline to quantify the value of semantic search. Must outperform this to justify the project. | - **Amazon OpenSearch** (BM25 algorithm) | **Results:** The system performed well on exact product names and SKUs but failed on conceptual, synonymous, and misspelled queries. <br> **Learning:** Confirmed the severe limitations of keyword search, setting a clear lower bound for performance. | **0.65** |
| **2** | **"Naive" RAG (Text-Only)** <br> **Rationale:** Implement the simplest possible RAG to validate the core hypothesis that semantic search provides a significant lift. | - **Embedding:** Amazon Titan Text G1 <br> - **Generator:** Claude 3 Sonnet <br> - **Chunking:** Fixed-size (512 tokens) | **Results:** A massive improvement over the baseline, especially for conceptual queries ("dress for a summer party"). However, retrieval often missed context split across chunk boundaries. <br> **Learning:** Semantic search is a game-changer, but the ingestion process (chunking) is a critical weak point. | **0.82** |
| **3** | **Advanced Retrieval: Hybrid Search + Re-ranker** <br> **Rationale:** Combine the strengths of keyword and semantic search. Use a re-ranker to improve the precision of the top results presented to the LLM. | - **Search:** OpenSearch Hybrid Search (BM25 + Vector) with RRF <br> - **Re-ranker:** Cohere Rerank model | **Results:** Hybrid search significantly improved performance on queries with specific brand names or technical terms. The re-ranker was highly effective at pushing the most relevant documents to the top. <br> **Learning:** Retrieval is not a single step. A multi-stage retrieve-then-rerank process is superior. | **0.88** |
| **4** | **Advanced Indexing & Querying** <br> **Rationale:** Tackle the "lost in the middle" problem with better chunking and improve understanding of vague user queries. | - **Chunking:** LangChain `SemanticChunker` <br> - **Query Transformation:** HyDE using Claude 3 Haiku for low latency. | **Results:** Semantic chunking led to more coherent context, reducing LLM errors. HyDE provided a noticeable lift for short, ambiguous queries. <br> **Learning:** Optimizing what happens *before* and *during* retrieval is as important as the retrieval algorithm itself. | **0.91** |
| **5** | **Multimodal RAG: Image Search** <br> **Rationale:** Address the critical business need for visual product discovery. Test the two primary architectural patterns. | **A)** VLM captions (Claude 3) + Text Embeddings <br> **B)** Unified Embeddings (Amazon Titan Multimodal) | **Results:** **(A)** excelled at attribute-specific queries ("find shoes with this *style* of buckle"). **(B)** was superior for overall visual similarity ("find more dresses that *look like this*"). <br> **Learning:** Neither strategy was a silver bullet. The optimal solution is a **hybrid multi-vector approach**: index both image embeddings and VLM-generated captions, and use a router to decide which to query based on user intent. | **N/A** (Qualitative Improvement) |
| **6** | **Multilingual RAG** <br> **Rationale:** Expand the search to our European user base, testing the trade-offs between translation and native multilingual models. | **A)** Amazon Translate + Titan Text G1 <br> **B)** `multilingual-e5-large` (Native Multilingual Model) | **Results:** **(A)** was simpler to implement but brittle; translation errors on colloquial or technical terms degraded performance significantly. **(B)** was far more robust, achieving near-English performance in German and French. <br> **Learning:** For a high-quality global product, a native multilingual embedding strategy is non-negotiable. | **0.90** (on DE/FR datasets) |
| **7** | **Final Polish: Embedding Model Fine-Tuning** <br> **Rationale:** As a final step, fine-tune the embedding model to learn the specific nuances of our product catalog and user query patterns. | - **Amazon SageMaker** <br> - Dataset of (query, purchased\_product) pairs from the data flywheel. | **Results:** Provided a small but significant final lift, particularly on niche, domain-specific terminology. <br> **Learning:** Fine-tuning is a powerful but high-effort technique. It should only be applied *after* all pipeline and prompt-level optimizations have been exhausted. It is a tool for incremental gains, not for fixing fundamental problems. | **0.94** |

-->



---

### **6. Continual Learning: The Embedding Model Fine-tuning Pipeline**

To ensure our RAG system continuously adapts and improves, we will build a dedicated MLOps pipeline for fine-tuning our embedding model. This pipeline operationalizes the "Data Flywheel" concept by systematically learning from real user behavior to enhance retrieval relevance over time.

This is an **offline, periodic pipeline**, designed to be run on a schedule (e.g., monthly) or triggered manually when a drop in retrieval quality is detected. Its goal is not to train a model from scratch but to take a high-performing base model and adapt it to the specific nuances of our product catalog and customer query patterns.

#### **A. Artifacts to Be Implemented**

The following is a blueprint for the key components that will constitute the fine-tuning pipeline.

| Artifact Type | Description & Plan |
| :--- | :--- |
| **Python Scripts (Components)** | **1. `data_preparation.py`:** <br> - **Loads** raw user interaction data (from the Monitoring Pipeline's S3 bucket). <br> - **Filters** for successful user journeys (e.g., queries that led to an `add_to_cart` or `purchase`). <br> - **Constructs Training Triplets `(anchor, positive, negative)`:** <br> &nbsp;&nbsp;&nbsp;&nbsp;- `anchor`: The user's search query. <br> &nbsp;&nbsp;&nbsp;&nbsp;- `positive`: The text chunk from the product the user purchased. <br> &nbsp;&nbsp;&nbsp;&nbsp;- **`negative` (Hard Negative Mining):** For the same query, retrieve the top 5 results from the *current production embedding model*. From these results, select a chunk that the user did *not* click on or purchase. This "hard negative" is crucial because it teaches the new model to better distinguish between semantically similar but ultimately incorrect items. <br> - **Validates & Splits** the data into training and validation sets. <br> - **Outputs** versioned, final training files to a dedicated S3 bucket. <br><br> **2. `model_training.py`:** <br> - **Loads** the prepared triplet dataset. <br> - **Pulls** the latest version of our chosen base embedding model (e.g., `multilingual-e5-large`) from Hugging Face. <br> - **Fine-tunes** the model using the `sentence-transformers` library and a `TripletLoss` objective function. This process is executed as a self-contained **Amazon SageMaker Training Job** for scalability and reproducibility. <br> - **Saves** the fine-tuned model artifact back to S3. <br><br> **3. `model_evaluation.py`:** <br> - **Loads** the new candidate model and the current production model. <br> - **Runs both models** against our "Golden Dataset" (the held-out test set). <br> - **Compares** key retrieval metrics (MRR, NDCG@10, Hit Rate@5). <br> - **Outputs** a JSON file with a comparison report and a `pass` or `fail` status based on a pre-defined threshold (e.g., "candidate MRR must be > 1.02 * production MRR"). <br><br> **4. `model_registration.py`:** <br> - **Reads** the evaluation result. <br> - **If "pass":** Registers the new model artifact in the **Amazon SageMaker Model Registry**, tagging it with its evaluation metrics and the training data version. This officially promotes it to a "candidate" status, ready for A/B testing. |
| **Unit Tests (`pytest`)** | - `test_data_preparation.py`: Tests the hard negative mining logic on a sample DataFrame to ensure it correctly identifies and selects hard negatives. <br> - `test_model_evaluation.py`: Mocks the models and tests the metric calculation logic to ensure MRR and NDCG are computed correctly. |
| **Pipeline Orchestration (Airflow DAG)** | - **`embedding_finetuning_dag.py`:** <br> **1. Trigger:** Can be scheduled (e.g., `0 0 1 * *` for monthly) or manually triggered. <br> **2. `prepare_data_task`:** Executes the `data_preparation.py` script (e.g., using `PythonOperator` or `KubernetesPodOperator`). <br> **3. `train_model_task`:** Submits a SageMaker Training Job using the `SageMakerTrainingOperator`. <br> **4. `evaluate_model_task`:** Submits a SageMaker Processing Job to run the `model_evaluation.py` script. <br> **5. `check_evaluation_task` (BranchPythonOperator):** A conditional gate that checks the evaluation output. Routes to `register_model_task` on `pass` or `notify_failure_task` on `fail`. <br> **6. `register_model_task`:** Executes the `model_registration.py` script. <br> **7. `notify_failure_task`:** Sends a Slack/email notification if the model did not meet the quality bar. |
| **Infrastructure as Code (Terraform)** | - `s3.tf`: Defines new S3 buckets for storing the training datasets and the fine-tuned model artifacts. <br> - `iam.tf`: Defines a new, specific IAM Role for the SageMaker Training Jobs, granting least-privilege access to the required S3 buckets. <br> - `sagemaker.tf`: Defines a SageMaker Model Group to logically group all versions of our fine-tuned embedding model. <br> - `airflow.tf`: Manages the deployment of the `embedding_finetuning_dag.py` file to our Airflow environment. |
| **Integration Test** | - An end-to-end test script (`test_finetuning_pipeline_integration.py`). <br> - This test **triggers the entire Airflow DAG** using a small, self-contained dataset. <br> - It does not check the model's accuracy but **asserts that the DAG runs to completion** and that a new model version successfully appears in the staging SageMaker Model Registry. This validates that all components, permissions, and integrations are working correctly. |
| **CI/CD Workflow (GitHub Actions)** | - **`deploy_finetuning_pipeline.yml`:** This workflow does **not** run the fine-tuning process. It deploys and manages the pipeline's definition. <br> - **Trigger:** On push to `main` affecting the `/pipelines/finetuning/` directory. <br> - **Jobs:** <br> &nbsp;&nbsp;&nbsp;&nbsp;1. **Lint & Test:** Runs static analysis and unit tests on the pipeline's Python scripts. <br> &nbsp;&nbsp;&nbsp;&nbsp;2. **Deploy:** Executes `terraform apply` to deploy changes to the Airflow DAG and related AWS infrastructure. |

#### **B. Architecture Diagram: Embedding Model Fine-tuning Pipeline**

This diagram illustrates the orchestrated workflow, from data collection to model registration.

<img src="../_static/past_experiences/ecom_rag/pipeline_finetuning.png" width="80%" style="background-color: #FCF1EF;"/>


***


#### Note: **Training Triplets Dataset** vs **Golden Evaluation Dataset**

The **Training Triplets Dataset** and the **Golden Evaluation Dataset** are two **distinct and separate datasets**, each engineered for a specific, different purpose. They are never the same. Here is a detailed breakdown:

##### **Dataset 1: The Training Triplets Dataset**

*   **Purpose:** To **TEACH** (fine-tune) the embedding model.
*   **Structure:** `(anchor, positive, negative)`
*   **What it does:** This dataset is the "textbook" for the model. It uses a technique called contrastive learning. For every `anchor` (a user's query), it explicitly tells the model:
    *   "This `positive` example (the product they bought) is what you should consider very similar. Pull its vector representation *closer* to the anchor's vector."
    *   "This `negative` example (a product they saw but didn't buy) is what you should consider dissimilar. Push its vector representation *further away* from the anchor's vector."
*   **Why it needs negatives:** The model cannot learn to distinguish between good and bad results without being shown both. **Hard negatives** are especially powerful because they teach the model to differentiate between very similar but ultimately incorrect items, which is a much harder and more valuable task than differentiating between a shoe and a television.
*   **Source of Data:** Real, messy, high-volume user interaction data (clicks, purchases). It reflects what users *actually do*, not what we *think* they should do.

##### **Dataset 2: The "Golden" Evaluation Dataset**

*   **Purpose:** To **GRADE** (evaluate or benchmark) the performance of the *entire retrieval system*.
*   **Structure:** `(query, relevant_product_id, relevant_chunk_id)`
*   **What it does:** This dataset is the "final exam." It represents the ground truth. It does **not** teach the model anything. Instead, it acts as an answer key against which we measure the performance of any model or retrieval strategy we build.
*   **Why it does NOT have negatives:** The "negatives" for an evaluation are simply all the other millions of documents in our knowledge base that are *not* the correct answer for that specific query. The dataset's only job is to tell us, "For this query, this is the correct document."
*   **Source of Data:** Synthetically generated using a powerful LLM and curated for high quality, realism, and broad coverage. It represents the "ideal" testbed.

**Crucial Point:** Using your evaluation data for training is a cardinal sin in machine learning, known as **data leakage**. If we trained the model on our Golden Dataset, it would simply memorize the "exam answers," and our evaluation scores would be artificially inflated and completely useless for predicting real-world performance.

---




### **7. The Real-Time Engine: The Inference Pipeline**

The Inference Pipeline is the synchronous, low-latency workflow that executes every time a user interacts with the search assistant. It is a distributed system of microservices, orchestrated to perform the complex RAG process—from query understanding to final generation—in under a few seconds. Its design prioritizes performance, scalability, and observability.

#### A. Artifacts to Be Implemented

The following is a blueprint for the key components that will constitute the Inference Pipeline.

| Artifact Type | Description & Plan |
| :--- | :--- |
| **Python Scripts (Core Logic)** | **The entire pipeline will be implemented as a single, modular Python application using FastAPI, deployed as a containerized service.** This approach is chosen over an orchestrator like Airflow, which is designed for asynchronous, long-running batch jobs, not real-time inference. <br><br> **`main.py` (FastAPI Application):** <br> - Defines the main API endpoint (e.g., `/search`). <br> - Handles request validation (using Pydantic), authentication, and orchestrates the RAG workflow. <br><br> **`orchestrator.py` (The Core Workflow):** <br> - Implements the full RAG sequence as an `async` function to maximize I/O concurrency. <br> - **1. Query Pre-processing:** Applies input guardrails and calls the Query Transformation module. <br> - **2. Parallel Retrieval:** Uses `asyncio.gather` to concurrently call the Hybrid Search and Re-ranking modules. <br> - **3. Prompt Construction:** Builds the final prompt for the LLM. <br> - **4. Generation & Streaming:** Makes a streaming call to the LLM Generation module. <br> - **5. Post-processing:** Applies output guardrails as the response is streamed. <br> - **6. Tracing:** Integrates **LangSmith** tracing decorators (`@traceable`) on all key functions to automatically capture latency, inputs, and outputs for each step. <br><br> **Modules for Each RAG Stage:** <br> - **`query_transformer.py`:** A module to perform HyDE. Caches results in **Redis (Amazon ElastiCache)** for common queries. <br> - **`retriever.py`:** Contains logic to perform hybrid search against **Amazon OpenSearch**. <br> - **`reranker.py`:** Calls the **SageMaker Endpoint** for the custom re-ranking model and the **SageMaker Feature Store** for real-time business signals. <br> - **`generator.py`:** A client for **Amazon Bedrock** that handles streaming responses. <br> - **`guardrails.py`:** Modules for input (e.g., PII redaction) and output (e.g., toxicity filtering) safety checks. |
| **Unit Tests (`pytest`)** | - `test_orchestrator.py`: Uses `pytest-asyncio` and `mocker` to test the orchestration logic. Mocks out all external calls (OpenSearch, SageMaker, Bedrock) to test the flow, error handling, and `asyncio.gather` integration. <br> - `test_retriever.py`: Tests the construction of the complex OpenSearch hybrid search query JSON. <br> - `test_reranker.py`: Tests the logic for combining semantic scores with business features before sending them to the re-ranking model. <br> - `test_guardrails.py`: Tests the input and output safety filters with example malicious/harmful text. |
| **Pipeline Orchestration** | **Not Applicable (FastAPI Application instead of Airflow/Step Functions).** The orchestration is handled in-process by the `asyncio` event loop within the FastAPI application, which is the standard and correct pattern for real-time, low-latency services. |
| **Infrastructure as Code (Terraform)** | - **`api_gateway.tf`:** Defines the Amazon API Gateway endpoint, sets up throttling, and configures routing to the inference service. <br> - **`ecs.tf` / `lambda.tf`:** Defines the compute layer. **AWS Fargate (on ECS)** is the primary choice for its balance of performance (no cold starts) and manageability. A Lambda-based deployment is a secondary option for lower-traffic environments. <br> - **`sagemaker.tf`:** Defines the real-time SageMaker Endpoints for the re-ranking model. <br> - **`elasticache.tf`:** Defines the Redis cluster for caching. <br> - **`iam.tf`:** Defines fine-grained IAM roles for the inference service, granting it least-privilege access to OpenSearch, SageMaker, Bedrock, and ElastiCache. |
| **Integration & Load Tests** | - **`test_inference_integration.py`:** A `pytest` script that makes live HTTP requests to a deployed staging endpoint. It validates the end-to-end flow and asserts the API contract (response schema). <br> - **`locustfile.py`:** A **Locust** script to perform load testing. It simulates realistic user query patterns and measures key performance metrics (RPS, p99 latency, error rate) under load. This is critical for tuning auto-scaling policies. |
| **CI/CD Workflow (GitHub Actions)** | - **`deploy_inference_service.yml`:** <br> - **Trigger:** On push to `main` affecting the `/inference_service/` directory. <br> - **Jobs:** <br> &nbsp;&nbsp;&nbsp;&nbsp;1. **Lint & Unit Test:** Runs static analysis and `pytest` unit tests. <br> &nbsp;&nbsp;&nbsp;&nbsp;2. **Build & Push Docker Image:** Builds the FastAPI application container and pushes it to **Amazon ECR**. <br> &nbsp;&nbsp;&nbsp;&nbsp;3. **Deploy to Staging:** Runs `terraform apply` to deploy the new container version to the staging environment. <br> &nbsp;&nbsp;&nbsp;&nbsp;4. **Integration & Load Test:** Automatically runs the `pytest` integration tests and the Locust load test against the newly deployed staging endpoint. <br> &nbsp;&nbsp;&nbsp;&nbsp;5. **Manual Approval Gate:** Requires a manual approval click in the GitHub Actions UI before proceeding to production. <br> &nbsp;&nbsp;&nbsp;&nbsp;6. **Deploy to Production (A/B Test):** Runs `terraform apply` to deploy the new version to a small fraction of production traffic using a canary or blue/green deployment strategy managed by the API Gateway. |

#### B. Architecture Diagram: Real-Time Inference Pipeline

This diagram illustrates the flow of a user request through the distributed, microservices-based inference pipeline on AWS.

<img src="../_static/past_experiences/ecom_rag/pipeline_inference.png" width="80%" style="background-color: #FCF1EF;"/>

> #### Note: ECS vs Lambda
>
> 1.  **Execution Model:** In a standard Lambda deployment, each incoming request from the API Gateway triggers a separate, independent Lambda invocation. That single invocation would be responsible for running the entire orchestration logic (query transformation, retrieval, re-ranking, generation, etc.) for that one request.
>
> 2.  **The Cold Start Problem:** This is the critical drawback of using standard Lambda for low-latency applications. A "cold start" occurs when a request comes in and there is no "warm" execution environment ready to handle it. The Lambda service has to:
>     *   Provision a new micro-container.
>     *   Download your code/container image.
>     *   Start the runtime (e.g., the Python interpreter).
>     *   Initialize your application code (e.g., import libraries, establish initial database connections). 
>
> This entire process can add anywhere from **hundreds of milliseconds to several seconds** of latency *before your actual inference code even begins to run*. For a conversational search assistant, this is often an unacceptable hit to the user experience.
>
> ##### **The Solution for Lambda: Provisioned Concurrency**> 
>
> So why is it an option at all? Because AWS provides a feature specifically to solve this: **Provisioned Concurrency**. 
>
> *   **What it is:** You tell AWS, "I want you to pre-initialize and keep *N* execution environments warm for this function at all times."
> *   **How it Works:** When a request arrives, it is immediately routed to one of these pre-warmed environments, **completely bypassing the cold start latency**. The experience becomes as fast as a continuously running server.
> *   **The Trade-off:** Cost. You pay an hourly fee for keeping that concurrency provisioned, whether it's handling requests or sitting idle.
>
> This is why a Lambda-based deployment is a viable secondary option for **lower-traffic environments**. If your traffic is very low and sporadic, the cost of keeping a few Lambda environments warm 24/7 might be less than the cost of running even the smallest Fargate task 24/7. However, as traffic becomes high and sustained, the cost model of Fargate becomes more economical.

___


> #### Note: The Fargate (ECS) + FastAPI Model: Batch processing vs concurrent processing
> 
>
> 1.  **No Batching of User Requests:** In a real-time, user-facing API, you cannot "batch" requests from different users. User A sends a request and expects a response immediately. They cannot be made to wait for User B's request to arrive so you can process them together. Batching is a strategy for *offline* data processing (like our Ingestion Pipeline), not for online inference.
>
> 2.  **Throughput via Concurrency:** High throughput in this context is achieved by handling many requests *at the same time*. This happens at two levels:
>     *   **Application Level (FastAPI & `asyncio`):** This is where the magic of `async` comes in. A single FastAPI process running in one Fargate container can handle hundreds of concurrent connections. When it processes Request A and makes a network call to Amazon Bedrock (which is an I/O-bound operation), it doesn't just sit and wait for the response. The `asyncio` event loop immediately switches context and starts working on Request B, Request C, and so on. When the response for Request A comes back, the event loop picks it up and continues processing. This is how a single container can efficiently juggle many requests at once.
>     *   **Infrastructure Level (Fargate & Load Balancer):** When the number of concurrent requests exceeds what a single container can handle, you simply run more containers (Fargate tasks). An **Application Load Balancer (ALB)** sits in front of your Fargate service and distributes the incoming requests across all the available containers. If you need more throughput, you just tell ECS to run more tasks (horizontal scaling).
>
> **In summary:** We don't increase throughput by batching requests. We increase it by handling many requests concurrently within each container (thanks to FastAPI's async nature) and by running multiple containers to handle the total traffic load. Each user's request remains an independent, asynchronous task that is processed as quickly as possible.

___



### **8. The Monitoring and Observability Pipeline**

Operating a production RAG system effectively requires moving beyond simple uptime checks to a sophisticated, multi-layered observability strategy. This pipeline is an always-on, distributed system responsible for collecting, processing, and visualizing data from every component of our application. Its purpose is to provide actionable insights for engineers, product managers, and the continual learning process.

#### A. Artifacts to Be Implemented

| Artifact Type | Description & Plan |
| :--- | :--- |
| **Python Scripts (Instrumentation & Processing)** | **1. `instrumentation_lib.py`:** <br> - A shared Python library integrated into our **Inference Pipeline (FastAPI)** and our **Data Ingestion Pipeline (Glue/Lambda)**. <br> - **Structured Logging:** Configures the standard Python `logging` module to emit all logs in a structured **JSON format**. Each log entry will automatically include a unique `trace_id` to correlate events across services. <br> - **Custom Metrics Emitter:** Provides simple functions (e.g., `emit_metric()`) that use the `boto3` library to send custom metrics directly to **Amazon CloudWatch** (e.g., `retrieval_latency`, `tokens_generated`, `user_feedback_received`). <br> - **LangSmith Integration:** Centralizes the initialization of the LangSmith SDK, ensuring all services are correctly configured to send traces. <br><br> **2. `log_processing_lambda.py`:** <br> - A Lambda function triggered by **Amazon Kinesis Data Firehose**. <br> - **Parses** the structured JSON logs as they arrive. <br> - **Aggregates** logs to calculate advanced metrics that are difficult to compute in real-time (e.g., estimating a "groundedness score" by sending a sample of responses to an LLM-as-a-judge). <br> - **Enriches** logs with additional context (e.g., user metadata from a DynamoDB lookup). <br> - **Sinks** the processed, enriched logs into a dedicated S3 bucket for long-term storage and analysis (the fuel for the Data Flywheel). |
| **Unit Tests (`pytest`)** | - `test_instrumentation_lib.py`: Tests that the logging formatter correctly structures messages and that the CloudWatch metric emitter constructs the correct API payload. <br> - `test_log_processing_lambda.py`: Tests the Lambda handler function with sample JSON log events to ensure it correctly parses, enriches, and transforms the data. |
| **Pipeline Orchestration (Event-Driven)** | **Not a DAG-based pipeline.** This is a **continuous, event-driven streaming architecture**. The "pipeline" is the real-time flow of data through a series of interconnected AWS services, not a sequence of batch jobs. |
| **Infrastructure as Code (Terraform)** | - **`cloudwatch.tf`:** <br> &nbsp;&nbsp;&nbsp;&nbsp;- Defines **CloudWatch Log Groups** for all services. <br> &nbsp;&nbsp;&nbsp;&nbsp;- Defines **Custom Metrics** and **Metric Filters** to extract data from logs (e.g., parse latency from a JSON log). <br> &nbsp;&nbsp;&nbsp;&nbsp;- Creates **CloudWatch Dashboards** to visualize key operational and business metrics. <br> &nbsp;&nbsp;&nbsp;&nbsp;- Sets up **CloudWatch Alarms** that trigger on critical thresholds (e.g., p99 latency > 2s, Error Rate > 1%, a sudden drop in Groundedness Score). <br> - **`sns.tf`:** Defines an **Amazon SNS Topic** that alarms will publish to. <br> - **`lambda.tf`:** Deploys the `log_processing_lambda.py` function and its IAM role. <br> - **`kinesis.tf`:** Defines the **Kinesis Data Firehose** stream that collects logs from CloudWatch and delivers them to the processing Lambda and finally to S3. <br> - **`s3.tf`:** Defines the S3 bucket for long-term, queryable storage of processed logs. |
| **Integration Test** | - `test_monitoring_integration.py`: <br> - An integration test that simulates the end-to-end flow. <br> - **1. Action:** The test makes a call to the staging inference API endpoint. <br> - **2. Wait & Poll:** The test then waits for a few seconds and polls the target **S3 log bucket**. <br> - **3. Assert:** It asserts that a corresponding log file has been created and contains the correct `trace_id` and data from the initial API call. This validates that the entire logging stream (CloudWatch -> Kinesis -> Lambda -> S3) is functioning correctly. |
| **CI/CD Workflow (GitHub Actions)** | - **`deploy_monitoring_infra.yml`:** <br> - **Trigger:** On push to `main` affecting the `/monitoring/` directory. <br> - **Jobs:** <br> &nbsp;&nbsp;&nbsp;&nbsp;1. **Lint & Unit Test:** Runs static analysis and `pytest` unit tests on the `log_processing_lambda.py` script. <br> &nbsp;&nbsp;&nbsp;&nbsp;2. **Deploy Infrastructure:** Runs `terraform apply` to deploy changes to the CloudWatch dashboards, alarms, Kinesis stream, and the processing Lambda. <br> &nbsp;&nbsp;&nbsp;&nbsp;3. **Run Integration Test:** Executes the `test_monitoring_integration.py` script to validate the end-to-end logging flow in the staging environment. |

#### B. Architecture Diagram: Monitoring and Observability Pipeline

This diagram illustrates the continuous, real-time flow of observability data from production services to our analysis and storage layers.

<img src="../_static/past_experiences/ecom_rag/pipeline_monitoring.png" width="100%" style="background-color: #FCF1EF;"/>

___




### **9. Testing in Production: Validating Business Impact**

Once a new model or feature has passed all offline and staging evaluations, it is ready for the ultimate test: exposure to live user traffic. Testing in production is not about finding bugs; it is about measuring **business impact**. The goal is to answer the question: "Does this change actually improve the key performance indicators we care about?" We will employ a combination of A/B testing and Shadow Testing to make data-driven decisions about rollouts.

#### A. Artifacts to Be Implemented

| Artifact Type | Description & Plan |
| :--- | :--- |
| **Python Scripts (Analysis)** | **`ab_test_analysis.py`:** <br> - A Python script (or a Jupyter Notebook) that automates the statistical analysis of A/B test results. <br> - **Loads** experiment data from the data warehouse (e.g., Amazon Redshift). This data will contain user events tagged with the experiment `variant_id` (`control` or `challenger`). <br> - **Calculates** primary and secondary KPIs for each variant (e.g., Conversion Rate, AOV, CTR). <br> - **Performs Statistical Significance Testing** (e.g., using a Chi-squared test for conversion rates or a T-test for AOV) to determine if the observed difference between variants is statistically significant or due to random chance. <br> - **Generates a Report** summarizing the results, including p-values and confidence intervals, and provides a clear recommendation: `Promote Challenger`, `Rollback Challenger`, or `Continue Experiment`. |
| **Unit Tests (`pytest`)** | - `test_ab_test_analysis.py`: Tests the statistical calculation logic within the analysis script. It uses a sample DataFrame with known statistical properties to assert that the script correctly calculates metrics like conversion rate and p-values. This ensures the analysis itself is bug-free. |
| **Pipeline Orchestration** | **Not an automated pipeline.** The A/B testing process is a **business workflow** orchestrated by the Product Manager and the ML team, not an automated DAG. The key "pipeline" is the flow of experiment data from the production application into the data warehouse, which is part of the existing data engineering infrastructure. |
| **Infrastructure as Code (Terraform)** | - **`api_gateway.tf` (Update):** <br> &nbsp;&nbsp;&nbsp;&nbsp;- **Canary Deployments:** Modify the API Gateway configuration to support weighted routing. This allows us to direct a small percentage of traffic (e.g., 5%) to a new "challenger" version of our inference service while the majority continues to go to the "control" (current production) version. The traffic split will be managed via Terraform variables. <br> - **`ecs.tf` / `lambda.tf` (Update):** <br> &nbsp;&nbsp;&nbsp;&nbsp;- **Separate Deployments:** The Terraform configuration will be structured to allow for the deployment of two distinct versions of the inference service (Control and Challenger) side-by-side. Each will be a separate ECS Service or Lambda Alias. <br> - **`feature_flags.tf` (Optional but Recommended):** <br> &nbsp;&nbsp;&nbsp;&nbsp;- Defines configurations for a feature flagging service (e.g., AWS AppConfig, LaunchDarkly). This provides a more dynamic and safer way to manage traffic allocation and user segmentation for experiments without requiring a full infrastructure redeployment for every change. |
| **Integration Test** | - **`test_ab_routing.py`:** <br> - An integration test that validates the traffic splitting mechanism itself. <br> - **1. Action:** The script makes 1,000 requests to the production API endpoint. <br> - **2. Collect:** It inspects a custom header in the response that identifies which variant (`control` or `challenger`) served the request. <br> - **3. Assert:** It asserts that the distribution of responses is within an expected tolerance of the configured traffic split (e.g., if traffic is split 90/10, the test asserts that the challenger served between 8% and 12% of the requests). This confirms the deployment and routing infrastructure is working as intended. |
| **CI/CD Workflow (GitHub Actions)** | - **`deploy_inference_service.yml` (Update to the "Deploy to Production" job):** <br> - The final step of the CD pipeline is modified. Instead of a "big bang" rollout, it now performs a **Canary Release**. <br> - **1. Deploy Challenger:** The new container version is deployed as a "challenger" service. <br> - **2. Shift Traffic:** The pipeline automatically runs a Terraform plan/apply to update the API Gateway's weighted routing, shifting a small percentage of traffic (e.g., 5%) to the new challenger. <br> - **3. Monitor:** The pipeline enters a monitoring phase. It queries CloudWatch for the challenger's key operational metrics (error rate, latency). <br> - **4. Automated Rollback:** If the challenger's error rate or latency exceeds a critical threshold during this initial phase, the pipeline **automatically rolls back** by shifting 100% of traffic back to the control and triggers an alert. <br> - **5. Manual Promotion:** If the canary deployment is stable, the A/B test begins. The full promotion of the challenger to 100% traffic is a **manual step**, performed by the team after the A/B test has concluded and the results have been analyzed. |

#### B. The A/B Testing Workflow: From Candidate to Champion

This workflow describes the end-to-end process for safely deploying and validating a new model.

1.  **Candidate Promotion:** A new model (e.g., a fine-tuned embedding model) passes all offline evaluations and is registered in the SageMaker Model Registry. This makes it a "candidate" for production.

2.  **Canary Release (Automated via CI/CD):**
    *   The CD pipeline deploys the candidate model to production infrastructure, creating a "challenger" version of the inference service.
    *   It shifts a small amount of live traffic (e.g., 5%) to this challenger.
    *   It performs an immediate health check. If the challenger is unhealthy (high errors/latency), it automatically rolls back.

3.  **Experiment Execution (Manual Start/Stop):**
    *   If the canary is stable, the A/B test officially begins.
    *   The team monitors the experiment's health via CloudWatch and LangSmith dashboards.
    *   The experiment runs for a pre-determined duration (e.g., one to two weeks) to collect enough data for statistical significance.

4.  **Analysis & Decision:**
    *   At the end of the experiment, the `ab_test_analysis.py` script is run.
    *   The team reviews the results and makes a data-driven decision:
        *   **Promote:** If the challenger shows a statistically significant win on the primary business KPI, it is promoted. The CD pipeline is run again to shift 100% of traffic to the new version, which now becomes the new "control."
        *   **Rollback:** If the challenger is neutral or performs worse, it is rolled back, and 100% of traffic is returned to the original control. The learnings from the failed experiment are documented and used to inform the next iteration.

#### C. Architecture Diagram: A/B Testing in Production

This diagram illustrates how traffic is split to enable live experimentation.

<img src="../_static/past_experiences/ecom_rag/pipeline_abtesting.png" width="100%" style="background-color: #FCF1EF;"/>





---

### **10. The Foundation of Trust - Governance, Ethics, and Human-Centric Design**

A technically proficient RAG system is only half the battle. To build a truly production-grade, trustworthy application, we must embed principles of governance, ethics, and human-centric design into every stage of the MLOps lifecycle. This is not a final checklist but a continuous commitment to ensuring our system is transparent, fair, secure, and aligned with user expectations.

#### A. Comprehensive Model Governance

Model governance provides the framework for control, auditability, and compliance, ensuring our RAG system operates responsibly within both internal policies and external regulations like GDPR.

| Governance Component | Implementation Strategy for RAG Search |
| :--- | :--- |
| **Reproducibility & Auditability** | - **Infrastructure:** All AWS infrastructure is defined declaratively in **Terraform** and versioned in **Git**, providing a complete, auditable history of the environment. <br> - **Data:** Training datasets for the re-ranker and embedding models are versioned with **DVC**, ensuring any model can be precisely reproduced. <br> - **Models:** Every custom model is versioned and logged in the **Amazon SageMaker Model Registry**. <br> - **Tracing:** **LangSmith** provides an immutable, end-to-end trace for every single query, linking the user input, retrieved context, and final LLM output for full auditability. |
| **Documentation & Transparency** | - **Model Cards:** For our custom re-ranking model, we maintain a Model Card detailing its intended use, training data, evaluation metrics (including fairness checks), and known limitations. <br> - **Prompt Versioning:** All system prompts are treated as code, versioned in **Git**, and deployed through CI/CD, providing a clear history of how the LLM's behavior has been guided over time. |
| **Security & Access Control** | - **Secrets Management:** All API keys (e.g., for LLM providers) are stored securely in **AWS Secrets Manager**. <br> - **Least Privilege:** Each service (Lambda, Fargate, SageMaker) runs with a fine-grained **IAM Role** granting only the permissions necessary for its specific task (e.g., the inference Lambda can read from OpenSearch but cannot write to it). <br> - **Endpoint Security:** The public-facing **API Gateway** is configured with authentication, rate limiting, and throttling to prevent abuse. |

#### B. Responsible AI (RAI) Principles in Practice

RAI is about proactively identifying and mitigating potential harms, ensuring our system is fair, explainable, and respects user privacy.

| RAI Principle | Implementation Strategy for RAG Search |
| :--- | :--- |
| **Fairness & Bias Mitigation** | - **Data Analysis:** We continuously analyze user interaction data to ensure our re-ranking model is not developing biases (e.g., unfairly penalizing products from smaller vendors). We monitor performance across different product categories to identify and address performance gaps. <br> - **Bias in Generation:** We use **output guardrails** to scan for and block responses that contain biased or stereotypical language. |
| **Explainability & Interpretability (XAI)** | - **Attribution is Key:** This is the most critical form of XAI for RAG. **Every generated statement is linked directly back to the source product page or review**, allowing users to verify the information. This is implemented via citations in the UI. <br> - **Re-ranker Explainability:** For our custom re-ranking model, we use **SHAP (SHapley Additive exPlanations)** during offline evaluation to understand which features (e.g., semantic score, popularity, stock level) are driving its ranking decisions. |
| **Privacy Preservation** | - **PII Redaction:** We implement an **input guardrail** using services like Amazon Comprehend to automatically detect and redact any Personally Identifiable Information from user queries before they are logged or processed. <br> - **Right to be Forgotten:** Our data architecture is designed to support GDPR requirements, with clear processes for deleting user data from all associated systems upon request. |
| **Security (Adversarial Robustness)** | - **Prompt Injection Defense:** Our primary defense is a strong system prompt that clearly instructs the LLM on its role and constraints. We also maintain a suite of adversarial prompts in our evaluation dataset to continuously test for vulnerabilities. <br> - **Data Poisoning Defense:** The **Great Expectations** validation step in our ingestion pipeline acts as a defense against data poisoning by flagging anomalous or malformed product data before it can be indexed. |

#### C. The Human Element: Team Structure & User-Centric Design

Technology alone does not create a successful product. The human elements—how the team is structured and how the user experience is designed—are equally critical.

| Human-Centric Aspect | Implementation Strategy |
| :--- | :--- |
| **Team Structure & Collaboration** | We operate as a **cross-functional product pod**, bringing together the Product Manager, ML/GenAI Engineer, Data Scientist, and Backend/Frontend Engineers. This structure eliminates silos and ensures tight alignment between business goals, AI development, and user experience. The ML/GenAI Engineer (my role) acts as the technical anchor, translating product requirements into a robust, end-to-end MLOps system. |
| **User Experience (Defensive UX)** | - **Transparency:** The UI clearly labels the conversational search as an "AI Assistant" to set user expectations. <br> - **Graceful Failure:** When the system has low confidence or cannot find a relevant answer, it is designed to respond transparently (e.g., "I couldn't find a specific answer for that, but here are some products you might be interested in...") rather than hallucinating. <br> - **User Control & "Escape Hatches":** The user is always in control. A clear link to the traditional keyword search is always visible, and users can easily bypass the conversational experience if they choose. |
| **User Feedback Loops** | - **Explicit Feedback:** Simple **"thumbs up/thumbs down"** icons are present on every generated response, providing a direct, low-friction signal of quality. <br> - **Implicit Feedback:** Our monitoring pipeline tracks user actions post-response (e.g., clicks, add-to-carts, query reformulations) as powerful implicit signals of relevance and helpfulness. This feedback is the primary fuel for our **Data Flywheel**. |





---

### **11. System Architecture, Performance, and Economics**

The RAG-based search system is architected as a modern, cloud-native application on AWS. The design philosophy is centered around four interconnected loops, each representing a core operational pipeline:

1.  **The Real-Time Inference Pipeline:** The user-facing, low-latency engine that serves live queries.
2.  **The Offline Data Ingestion Pipeline:** The batch/streaming factory that builds and maintains the system's knowledge base.
3.  **The Continual Learning (Data Flywheel) Pipeline:** The periodic, offline process that improves the system's intelligence by learning from user behavior.
4.  **The Continuous Monitoring & Observability Pipeline:** The always-on "nervous system" that provides visibility into the health, cost, and quality of the entire application.

This modular, microservices-based architecture ensures scalability, resilience, and maintainability.

#### A. AWS System Architecture Diagram

The following diagram illustrates the complete, end-to-end system, showing the flow of data and the interaction between all major AWS components and services.

<img src="../_static/past_experiences/ecom_rag/system_architecture.png" width="100%" style="background-color: #FCF1EF;"/>


---

#### **B. Sequence Diagram: The Anatomy of a Real-Time RAG Query**

The following diagram details the synchronous, end-to-end flow of the inference pipeline, from the moment a user submits a query to when they start receiving a streamed response. The latency estimates represent a target for a well-optimized system, operating under normal load.

<img src="../_static/past_experiences/ecom_rag/sequence_inference.png" width="100%" style="background-color: #FCF1EF;"/>


##### Latency Budget Breakdown

The total latency experienced by the user is the sum of the latencies of each step in the sequence. For a conversational application, the most critical metric is **Time to First Byte (TTFB)**—the time it takes for the user to start seeing the first words of the response.

| Step | Operation | Estimated Latency (p99) | Notes |
| :--- | :--- | :--- | :--- |
| 1-2 | **API Gateway & Network** | 10 - 50 ms | Initial network overhead and API Gateway processing. |
| 3-4 | **Retrieval (OpenSearch)** | 50 - 150 ms | A complex hybrid (vector + keyword) query on a distributed database. Highly dependent on cluster size and index optimization. |
| 5-6 | **Feature Fetch (Feature Store)** | 10 - 30 ms | A low-latency, key-value lookup for business features. |
| 7-8 | **Re-ranking (SageMaker)** | 50 - 100 ms | Network hop plus inference time for the re-ranking model. Faster than the generator LLM but still a significant step. |
| 9-10 | **Generation (Amazon Bedrock)** | **150 - 400 ms (TTFB)** | The "thinking time" for the LLM before it generates the first token. This is often the largest single component of perceived latency. |
| 11-12 | **Response Streaming & Network** | 10 - 50 ms | Network latency for the response stream to travel back to the user. |
| **TOTAL (Time to First Byte)** | | **~280 - 780 ms** | The total perceived latency before the user starts reading the answer. **Our primary optimization target is to keep this under 500ms.** |
| **TOTAL (Full Response)** | | 1.5 - 3.0 seconds | This depends on the length of the answer. A 200-token response would add approximately 1-2 seconds of total streaming time after the first token. |


___

#### **C. Inference Pipeline: Bottlenecks & Performance Optimizations**

Achieving a sub-500ms Time to First Byte (TTFB) in a distributed RAG system requires a relentless focus on performance. The entire inference pipeline is a series of network I/O and computation steps, and every millisecond counts. Based on the sequence diagram, we can identify four primary potential bottlenecks and a corresponding set of optimization strategies.

| Bottleneck | Description & Impact on Performance | Optimization Strategies |
| :--- | :--- | :--- |
| **1. The Retrieval Bottleneck** | **Description:** The hybrid search query against Amazon OpenSearch is the most complex database operation in the pipeline. It involves both a k-NN vector search and a keyword (BM25) search, followed by the fusion of results. As the index size and query volume grow, this step can easily become the largest contributor to latency. <br><br> **Impact:** High retrieval latency directly delays the entire downstream process, pushing TTFB higher and degrading the user experience. | **1. Index Tuning (HNSW Parameters):** For the vector index, meticulously tune the HNSW algorithm parameters (`M` and `ef_construction` during indexing; `ef_search` at query time). This is a direct trade-off: higher values increase accuracy (recall) but also increase latency and memory usage. Find the optimal balance through offline evaluation. <br><br> **2. Sharding & Replication:** Horizontally scale the OpenSearch cluster by adding more nodes and distributing the index across them (sharding). This parallelizes the search, reducing latency. Add replica shards to increase query throughput. <br><br> **3. Pre-filtering with Metadata:** For queries that contain specific filters (e.g., "in the 'Electronics' category"), use OpenSearch's powerful metadata filtering *before* the vector search. This dramatically reduces the search space, leading to a significant speedup. |
| **2. The "Cold Start" & Concurrency Bottleneck** | **Description:** This applies if we use AWS Lambda without proper configuration. A cold start can add seconds of latency. Even with a warm container (Lambda with Provisioned Concurrency or Fargate), if the application is not designed for concurrency, it can only handle one request at a time, leading to long wait queues under load. <br><br> **Impact:** Unpredictable, spiky latency (due to cold starts) and a low ceiling on throughput (queries per second) for the entire service. | **1. Choose Fargate for Sustained Traffic:** For any significant, consistent traffic, AWS Fargate is the superior choice as it eliminates cold starts entirely. <br><br> **2. Use Provisioned Concurrency for Lambda:** If using Lambda, *always* enable Provisioned Concurrency for the production environment to keep a pool of warm instances ready. <br><br> **3. Implement Asynchronous I/O (`asyncio`):** This is the **single most important application-level optimization**. The FastAPI application *must* be written using `async`/`await` for all network calls (to OpenSearch, SageMaker, Bedrock). This allows a single Fargate container to handle hundreds of concurrent requests by efficiently switching between them while waiting for I/O, dramatically increasing throughput. |
| **3. The LLM Generation Bottleneck** | **Description:** The LLM's "thinking time" before it produces the first token (TTFB) is a significant and often irreducible part of the latency budget. Larger, more complex models have higher TTFB. <br><br> **Impact:** Directly adds to the perceived latency for the user. A slow TTFB makes the application feel sluggish, even if the retrieval was fast. | **1. Model Selection:** Choose the smallest, fastest model that meets your quality bar. For many queries, a model like Claude 3 Haiku may be sufficient and significantly faster than Opus. Consider a "router" pattern where simple queries go to a fast model and complex ones go to a slower, more powerful model. <br><br> **2. Prompt Optimization:** Keep the context provided to the LLM as concise as possible without losing critical information. Shorter prompts lead to faster processing. Techniques like Contextual Compression can help here. <br><br> **3. Response Streaming:** **Always stream the response.** This is a UX optimization that has a massive impact on perceived performance. The user starts reading the beginning of the answer while the rest is still being generated, masking the total generation time. |
| **4. The "Death by a Thousand Hops" Bottleneck** | **Description:** The total latency is the sum of multiple network calls: API Gateway -> Fargate -> OpenSearch -> Feature Store -> SageMaker -> Bedrock. While each individual hop might be fast, they add up. Network latency between services can become a significant factor. <br><br> **Impact:** A slow, creeping increase in overall latency that is hard to attribute to any single component. | **1. Co-location & VPC Endpoints:** Ensure all AWS services are deployed in the **same AWS Region and Availability Zone**. Use **VPC Endpoints** for all AWS service calls (S3, SageMaker, Bedrock). This keeps traffic on the private AWS backbone network, reducing latency and improving security compared to going over the public internet. <br><br> **2. Aggressive Caching (Amazon ElastiCache):** Implement caching for repeatable, high-cost operations. <br> &nbsp;&nbsp;&nbsp;&nbsp; - **Retrieval Cache:** Cache the results of common search queries for a short TTL (e.g., 5 minutes). <br> &nbsp;&nbsp;&nbsp;&nbsp; - **HyDE Cache:** The output of the Hypothetical Document Embeddings (HyDE) step is a great candidate for caching, as the same query will always produce the same hypothetical document. <br><br> **3. Connection Pooling:** For services like databases, maintain a warm pool of connections within the Fargate service to avoid the overhead of establishing a new connection for every request. |


---

#### **D. Estimated Monthly Costs for the RAG System**

To ensure the economic viability of the project, a detailed cost estimation was performed. The following model breaks down the monthly operational costs across the three core pipelines: Ingestion, Fine-tuning, and the real-time Inference service.


<!--
**Core Assumptions (Growth Stage Scenario):**

*   **Product Catalog:** 10 Million Products (requiring ~150 GB of vector index storage).
*   **User Traffic:** 5 Million search queries per month.
*   **Data Ingestion:** One full-catalog refresh per month.
*   **Model Fine-tuning:** One fine-tuning run per month.
*   **Infrastructure:** AWS-based, using the services outlined in the architecture. Prices are based on public `us-east-1` pricing in 2024.

| Pipeline Component | AWS Service(s) | Detailed Cost Calculation & Rationale | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Data Ingestion Pipeline (Batch)** | **AWS Step Functions** <br> **AWS Glue** <br> **Amazon Bedrock** | **Step Functions:** Priced per state transition. A full catalog refresh involves millions of transitions. <br> - 10M products * 5 steps/product * $25/M transitions = **~$1,250** <br><br> **Glue:** Priced per DPU-hour. A large-scale ETL and chunking job for the entire catalog. <br> - ~200 DPU-hours = **~$8,800** <br><br> **Bedrock (Embeddings):** Priced per 1M input tokens. Assume each product yields ~2k tokens for embedding. <br> - 10M products * 2k tokens/product * ($0.0001 / 1k tokens) = **~$2,000** | **$12,000 - $15,000** <br> *(Per full run)* |
| **Continual Learning Pipeline (Fine-tuning)** | **Amazon MWAA (Airflow)** <br> **Amazon SageMaker Training** | **Airflow Infrastructure (MWAA):** The cost of the 24/7 environment to orchestrate the pipeline. <br> - Small MWAA environment = **~$130/month** <br><br> **SageMaker Training:** Priced per instance-hour. A fine-tuning job on a GPU instance. <br> - 1 run/month * 4 hours/run * `ml.g5.2xlarge` (~$2.20/hr) = **~$9**. Training is cheap; the data prep is the main effort. | **$150 - $250** <br> *(Per month)* |
| **Real-Time Inference Pipeline** | **Amazon OpenSearch** <br> **Amazon SageMaker Endpoint** <br> **Amazon Bedrock** <br> **API Gateway + Fargate** | **OpenSearch Service:** This is often the **largest single cost**. Priced per instance-hour. A cluster to handle the query load and hold the 150GB index. <br> - ~6 x `r6g.xlarge.search` instances = **~$3,500** <br><br> **SageMaker Endpoint (Re-ranker):** Priced per instance-hour. Requires a constantly running endpoint. <br> - 2 x `ml.c5.large` instances for HA = **~$250** <br><br> **Bedrock (Generation):** Priced per token. 5M queries with ~2k input and ~200 output tokens. <br> - Input: 5M * 2k * ($0.25/1M tokens) = **~$2,500** <br> - Output: 5M * 0.2k * ($0.75/1M tokens) = **~$750** <br><br> **API Gateway + Fargate:** Compute for the orchestrator and API layer. <br> - API Gateway: 5M requests * $1.00/M = **$5** <br> - Fargate: ~3 tasks of 1 vCPU = **~$90** | **$7,000 - $9,000** <br> *(Per month)* |
| **Shared Costs** | **S3 Storage** <br> **CloudWatch** | **S3:** Storage for raw data, processed logs, model artifacts. Assuming ~2 TB total. <br> - 2048 GB * $0.023/GB-month = **~$50** <br><br> **CloudWatch:** Logs and metrics from all services. This can be significant. <br> - ~500 GB log ingestion + metrics/alarms = **~$300** | **$350 - $500** <br> *(Per month)* |
| **Total Estimated Monthly Cost** | **-** | This cost is dominated by the full batch ingestion run and the 24/7 inference infrastructure. | **~$19,500 - $24,750** |

**Key Financial Learnings:**

*   **Inference Compute is King:** The 24/7 cost of the OpenSearch cluster for serving real-time queries is the most significant and consistent monthly expense. Optimizing the cluster size and using Graviton instances is critical for managing this cost.
*   **Batch Ingestion is Spiky but Substantial:** While not a continuous cost, a full re-indexing of the catalog is a computationally expensive event. This cost needs to be budgeted for and the frequency of full refreshes should be carefully considered (e.g., monthly vs. quarterly).
*   **LLM Tokens Add Up:** At scale, the per-token cost of the generator LLM becomes a major variable expense. Monitoring token usage and using the smallest effective model are key cost-control levers.
*   **Training is Relatively Inexpensive:** The actual cost of the fine-tuning compute is almost negligible compared to the infrastructure required to serve and monitor the system. The real investment in continual learning is in the engineering effort to build and maintain the data flywheel pipeline.
-->


**Core Assumptions:**

*   **Product Catalog:** 100,000 Products (requiring **~1.5 GB** of vector index storage).
*   **User Traffic:** 5 Million search queries per month (remains high, indicating an active user base).
*   **Data Ingestion:** One-time batch ingestion, with small weekly incremental updates (~1,000 products/week).
*   **Model Fine-tuning:** Two times per year.

| Pipeline Component | AWS Service(s) | Detailed Cost Calculation & Rationale | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Data Ingestion Pipeline (Periodic)** | **AWS Lambda** <br> **Amazon Bedrock** | **This is now a small, recurring cost for weekly updates.** We'll assume ~4,000 products are updated per month. <br> - **Lambda Compute:** Low-volume ETL jobs can run on Lambda instead of Glue. ~4,000 products/month * ~10s/product * ($0.0000167/ms) = **~$25** <br> - **Bedrock (Embeddings):** Token cost for embedding updated products. <br> - 4k products * 2k tokens/product * ($0.0001 / 1k tokens) = **~$1**. <br> The cost is now minimal. | **$30 - $50** <br> *(Per month)* |
| **Continual Learning Pipeline (Periodic)** | **Amazon MWAA (Airflow)** | The cost of the Airflow infrastructure to be ready for the bi-annual fine-tuning runs and potentially other orchestration tasks. The expensive SageMaker training job cost is no longer a recurring monthly expense. <br> - Small MWAA environment = **~$130/month** | **$130 - $180** <br> *(Per month)* |
| **Real-Time Inference Pipeline** | **Amazon OpenSearch** <br> **Amazon SageMaker Endpoint** <br> **Amazon Bedrock** <br> **API Gateway + Fargate** | **OpenSearch Service:** **Significant cost reduction.** A 1.5 GB index can be served with high availability and throughput by a much smaller cluster. <br> - 2 x `r6g.large.search` instances for HA = **~$475** <br><br> **SageMaker Endpoint (Re-ranker):** No change. Still need a 2-node HA endpoint for the re-ranking model. <br> - 2 x `ml.c5.large` instances = **~$250** <br><br> **Bedrock (Generation):** **This is now the dominant cost.** Driven by query volume, which remains high. <br> - 5M queries * 2.2k avg tokens/query * ($0.34/1M avg tokens) = **~$3,740** <br><br> **API Gateway + Fargate:** No change. Driven by 5M requests. <br> - API Gateway + Fargate Compute = **~$95** | **$4,500 - $5,500** <br> *(Per month)* |
| **Shared Costs** | **S3 Storage** <br> **CloudWatch** | **S3:** Storage cost is drastically reduced due to smaller catalog size. <br> - ~20 GB total storage * $0.023/GB-month = **~$1** (rounded to **~$20** for logs) <br><br> **CloudWatch:** Log volume is driven by high query traffic, so this cost remains similar. <br> - ~500 GB log ingestion + metrics/alarms = **~$300** | **$320 - $400** <br> *(Per month)* |
| **Total Estimated Monthly Cost** | **-** | The recurring monthly cost is now driven primarily by the LLM API usage and the 24/7 inference compute. | **~$5,000 - $6,130** |

#### **Non-Recurring Costs**

It is critical to budget for the following periodic and one-time costs separately from the monthly operational expenses:

*   **One-Time Full Ingestion:** The initial, one-time cost to ingest the entire 100,000 product catalog would be approximately **$120 - $150**.
*   **Bi-Annual Re-indexing & Fine-tuning:** Twice a year, the full ingestion pipeline will need to be re-run after the embedding model is fine-tuned. This should be treated as a project-based cost of **~$12,000 - $15,000**, incurred twice per year.

#### **Key Financial Learnings**

This revised, more realistic model provides critical insights for a mid-sized business:

1.  **The Cost Center Shifts to the LLM:** With a smaller knowledge base, the dominant operational cost is no longer the vector database compute. It is now the **per-query token cost of the generator LLM (Amazon Bedrock)**. This places a high premium on prompt optimization and using the most cost-effective model (e.g., Claude 3 Haiku) that meets the quality bar.
2.  **Smart Ingestion is Key:** An event-driven, incremental update strategy for the knowledge base is dramatically cheaper than frequent full refreshes.
3.  **A/B Testing is Financially Justified:** With a monthly cost of ~$5,000, even a small 1-2% improvement in conversion rate resulting from an A/B test can provide a clear and immediate positive ROI. This justifies the engineering effort required for experimentation.
4.  **The Total Cost is Now Viable:** A total recurring cost in the range of **$5,000 - $6,000 per month** is a much more justifiable expense for a mid-sized business, especially given the potential for significant conversion and AOV lift.

___


### Implementation: Data Ingestion and Indexing Pipeline

#### Python Scripts (Core Logic)

The core logic is broken down into modular scripts, each responsible for a specific stage of the pipeline. These scripts would be packaged and deployed as AWS Lambda functions or run within an AWS Glue job.

**ingestion_pipeline/src/data_loader.py**

```python
import boto3
import json
import logging

logger = logging.getLogger(__name__)

def load_product_data(bucket: str, key: str) -> dict:
    """Loads a single product's JSON data from S3."""
    try:
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')
        return json.loads(content)
    except Exception as e:
        logger.error(f"Error loading data from s3://{bucket}/{key}: {e}")
        raise

# In a real scenario, this would list all new/updated product files.
# For the Step Function, the input `key` will be provided in the event payload.
```

**ingestion_pipeline/src/text_processor.py**

```python
import logging
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.chat_models import BedrockChat
from langchain_core.messages import HumanMessage

# Assume Bedrock client is initialized globally or passed in
bedrock_client = boto3.client('bedrock-runtime')
logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Basic text cleaning (e.g., remove HTML tags)."""
    # In a real implementation, use BeautifulSoup or a similar library.
    # For brevity, we'll use a simple placeholder.
    import re
    return re.sub(r'<[^>]+>', '', text)

def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Splits text into semantically coherent chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    return text_splitter.split_text(text)

def get_image_caption(image_bytes: bytes, bedrock_model_id: str = "anthropic.claude-3-sonnet-20240229-v1:0") -> str:
    """Generates a descriptive caption for an image using a VLM."""
    # This would be a more complex implementation involving base64 encoding and
    # constructing the correct payload for the multimodal Bedrock model.
    # For brevity, this is a conceptual placeholder.
    # llm = BedrockChat(model_id=bedrock_model_id, client=bedrock_client)
    # message = HumanMessage(content=[...]) # construct multimodal message
    # response = llm.invoke([message])
    # return response.content
    logger.info(f"Generating caption for image of size {len(image_bytes)} bytes.")
    return "A high-quality photo of a product, showing its key features." # Placeholder
```

**ingestion_pipeline/src/embedding_generator.py**
```python
import logging
from typing import List
from langchain_community.embeddings import BedrockEmbeddings

logger = logging.getLogger(__name__)

def generate_text_embeddings(chunks: List[str]) -> List[List[float]]:
    """Generates embeddings for a list of text chunks."""
    embeddings = BedrockEmbeddings(
        model_id="amazon.titan-embed-text-v2:0",
    )
    logger.info(f"Generating text embeddings for {len(chunks)} chunks.")
    return embeddings.embed_documents(chunks)

def generate_image_embedding(image_bytes: bytes) -> List[float]:
    """Generates an embedding for a single image."""
    embeddings = BedrockEmbeddings(
        model_id="amazon.titan-embed-image-v1",
    )
    logger.info(f"Generating image embedding for image of size {len(image_bytes)} bytes.")
    # The actual implementation would involve base64 encoding the image
    return embeddings.embed_query("placeholder for image bytes") # Placeholder
```

**ingestion_pipeline/src/opensearch_indexer.py**
```python
import logging
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
from opensearchpy.helpers import bulk

logger = logging.getLogger(__name__)

def get_opensearch_client(host: str, region: str):
    """Initializes and returns an OpenSearch client."""
    credentials = boto3.Session().get_credentials()
    auth = AWSV4SignerAuth(credentials, region, 'aoss')
    client = OpenSearch(
        hosts=[{'host': host, 'port': 443}],
        http_auth=auth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection,
        pool_maxsize=20
    )
    return client

def index_documents(client: OpenSearch, index_name: str, documents: List[dict]):
    """Bulk indexes documents into OpenSearch."""
    logger.info(f"Indexing {len(documents)} documents into index '{index_name}'.")
    success, failed = bulk(client, documents, index=index_name)
    if failed:
        logger.error(f"Failed to index {len(failed)} documents.")
    return success, failed
```

#### Unit Tests

**ingestion_pipeline/tests/unit/test_text_processor.py**
```python
import pytest
from src import text_processor

def test_chunk_text_splits_correctly():
    """Ensures text is split into multiple chunks."""
    long_text = "This is a sentence. " * 200
    chunks = text_processor.chunk_text(long_text, chunk_size=100, chunk_overlap=20)
    assert len(chunks) > 1
    # Check if overlap is working
    assert chunks[1].startswith(chunks[0][-50:])

def test_get_image_caption_mocked(mocker):
    """Tests the image captioning function with a mocked Bedrock client."""
    # We mock the Bedrock client to avoid making a real API call
    mock_bedrock = mocker.patch('boto3.client')
    # conceptually, you would mock the invoke method's return value
    
    caption = text_processor.get_image_caption(b"fake_image_bytes")
    assert isinstance(caption, str)
    assert len(caption) > 0
```

#### Pipeline Orchestration (AWS Step Functions)

**ingestion_pipeline/statemachine/ingestion_statemachine.asl.json**

```json
{
  "Comment": "RAG Data Ingestion Pipeline for a single product.",
  "StartAt": "LoadProductData",
  "States": {
    "LoadProductData": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "${LoadDataLambdaArn}",
        "Payload.$": "$"
      },
      "Next": "ProcessAndChunkText",
      "Catch": [{
        "ErrorEquals": ["States.ALL"],
        "Next": "NotifyFailure"
      }]
    },
    "ProcessAndChunkText": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "InputPath": "$.Payload",
      "ResultPath": "$.ProcessedText",
      "Next": "GenerateEmbeddings"
    },
    "GenerateEmbeddings": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "InputPath": "$.ProcessedText",
      "ResultPath": "$.Embeddings",
      "Next": "IndexInOpenSearch"
    },
    "IndexInOpenSearch": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "InputPath": "$.Embeddings",
      "End": true
    },
    "NotifyFailure": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "${SnsTopicArn}",
        "Message": {
          "Input.$": "$",
          "Message": "RAG Ingestion Pipeline Failed!"
        }
      },
      "End": true
    }
  }
}
```

#### Infrastructure as Code (Terraform)

**ingestion_pipeline/infra/main.tf**

```hcl
# main.tf - Defines the core infrastructure for the ingestion pipeline

# Variable for environment (e.g., "staging", "prod")
variable "env" {
  type    = string
  default = "staging"
}

# --- S3 Buckets ---
resource "aws_s3_bucket" "raw_data" {
  bucket = "rag-product-data-raw-${var.env}"
}

resource "aws_s3_bucket" "processed_data" {
  bucket = "rag-product-data-processed-${var.env}"
}

# --- IAM Roles ---
# A comprehensive IAM role for the Lambda functions and Step Function
# In a real setup, you would create separate, least-privilege roles for each component.
resource "aws_iam_role" "ingestion_pipeline_role" {
  name = "IngestionPipelineRole-${var.env}"
  # Assume role policy allows lambda and states services
  assume_role_policy = "..." # Placeholder for IAM trust policy JSON
}
# ... Attach policies for S3, Bedrock, OpenSearch, CloudWatch ...

# --- Lambda Functions ---
# Placeholder for one of the Lambda functions
resource "aws_lambda_function" "load_data_lambda" {
  function_name = "LoadDataLambda-${var.env}"
  role          = aws_iam_role.ingestion_pipeline_role.arn
  handler       = "data_loader.handler"
  runtime       = "python3.11"
  # ... code packaging configuration ...
}

# ... Define other Lambda functions for each step ...

# --- Step Functions State Machine ---
resource "aws_sfn_state_machine" "ingestion_sfn" {
  name     = "RAG-Ingestion-Pipeline-${var.env}"
  role_arn = aws_iam_role.ingestion_pipeline_role.arn

  definition = templatefile("${path.module}/../statemachine/ingestion_statemachine.asl.json", {
    LoadDataLambdaArn = aws_lambda_function.load_data_lambda.arn,
    # ... pass other Lambda ARNs and SNS Topic ARN ...
  })
}

# --- OpenSearch Serverless ---
resource "aws_opensearchserverless_collection" "vector_db" {
  name = "rag-vector-db-${var.env}"
  type = "VECTORSEARCH"
}

# --- EventBridge Scheduler for Batch ---
resource "aws_cloudwatch_event_rule" "nightly_trigger" {
  name                = "NightlyIngestionTrigger-${var.env}"
  schedule_expression = "cron(0 2 * * ? *)" # 2 AM UTC every night
}

resource "aws_cloudwatch_event_target" "step_function_target" {
  rule      = aws_cloudwatch_event_rule.nightly_trigger.name
  arn       = aws_sfn_state_machine.ingestion_sfn.arn
  role_arn  = aws_iam_role.ingestion_pipeline_role.arn # A specific role for EventBridge is better
}
```

#### Integration Test

**ingestion_pipeline/tests/integration/test_ingestion_pipeline.py**

```python
import boto3
import time
import pytest
import os

# Assume env variables are set for staging resources (e.g., STATE_MACHINE_ARN)
STATE_MACHINE_ARN = os.environ["STATE_MACHINE_ARN"]
RAW_BUCKET = os.environ["RAW_BUCKET"]
OS_HOST = os.environ["OS_HOST"]

@pytest.mark.integration
def test_full_pipeline_run():
    s3_client = boto3.client("s3")
    sfn_client = boto3.client("stepfunctions")
    
    # 1. ARRANGE: Upload a sample product file to the raw S3 bucket
    product_id = "test-product-123"
    s3_key = f"products/{product_id}.json"
    sample_data = {"product_id": product_id, "description": "This is a test."}
    s3_client.put_object(Bucket=RAW_BUCKET, Key=s3_key, Body=json.dumps(sample_data))

    # 2. ACT: Trigger the Step Function and wait for completion
    response = sfn_client.start_execution(
        stateMachineArn=STATE_MACHINE_ARN,
        input=json.dumps({"bucket": RAW_BUCKET, "key": s3_key})
    )
    execution_arn = response['executionArn']
    
    while True:
        status_response = sfn_client.describe_execution(executionArn=execution_arn)
        status = status_response['status']
        if status in ['SUCCEEDED', 'FAILED', 'TIMED_OUT', 'ABORTED']:
            break
        time.sleep(5)
    
    # 3. ASSERT
    assert status == 'SUCCEEDED'
    
    # Assert that the data was indexed correctly in OpenSearch
    # In a real test, you'd use the opensearch_indexer client to query the index
    # os_client = opensearch_indexer.get_opensearch_client(...)
    # indexed_doc = os_client.get(index=..., id=...)
    # assert indexed_doc['found'] == True
    
    # 4. CLEANUP (Optional but recommended)
    s3_client.delete_object(Bucket=RAW_BUCKET, Key=s3_key)
    # os_client.delete(index=..., id=...)
```

####  CI/CD GitHub Actions Workflow

**.github/workflows/deploy_ingestion_pipeline.yml**

```yaml
name: Deploy Data Ingestion Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'ingestion_pipeline/**'

jobs:
  lint-and-test:
    name: Lint & Unit Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r ingestion_pipeline/requirements.txt
      - name: Run unit tests
        run: pytest ingestion_pipeline/tests/unit/

  deploy-to-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: lint-and-test
    environment: staging
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.STAGING_AWS_ROLE_ARN }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      - name: Terraform Apply
        run: |
          cd ingestion_pipeline/infra
          terraform init
          terraform apply -auto-approve -var="env=staging"

  run-integration-test:
    name: Run Integration Tests on Staging
    runs-on: ubuntu-latest
    needs: deploy-to-staging
    environment: staging
    steps:
      # ... (similar setup to deploy job) ...
      - name: Run integration tests
        env:
          STATE_MACHINE_ARN: ${{ secrets.STAGING_SFN_ARN }}
          RAW_BUCKET: ${{ secrets.STAGING_RAW_BUCKET }}
          OS_HOST: ${{ secrets.STAGING_OS_HOST }}
        run: pytest ingestion_pipeline/tests/integration/
```

___





### Implementation: Inference Pipeline

Here are the complete artifacts required to build, test, deploy, and automate our low-latency, real-time RAG inference service.

#### Python Scripts (Core Logic)

The application is structured into modular components orchestrated by main.py.

**inference_service/src/main.py**

```python
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List

from . import orchestrator
from .config import settings
from .instrumentation import configure_logging

# Configure logging and LangSmith tracing on startup
configure_logging()
# NOTE: LangSmith tracing is configured via environment variables like
# LANGCHAIN_TRACING_V2, LANGCHAIN_API_KEY, etc.

logger = logging.getLogger(__name__)
app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    # Add other potential fields like image_url for multimodal search

@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup."""
    # This is a good place to initialize clients that can be reused,
    # like the OpenSearch and Bedrock clients, to leverage connection pooling.
    app.state.orchestrator = await orchestrator.RAGOrchestrator.create(settings)
    logger.info("Application startup complete. RAG Orchestrator initialized.")

@app.post("/search")
async def search(request: SearchRequest, http_request: Request):
    """
    Main endpoint for RAG-based search.
    Streams a response back to the client.
    """
    try:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
        rag_orchestrator = http_request.app.state.orchestrator
        
        async def stream_generator():
            async for chunk in rag_orchestrator.stream_rag_response(request.query, request.user_id):
                yield chunk
        
        return StreamingResponse(stream_generator(), media_type="text/plain")

    except Exception as e:
        logger.exception(f"An error occurred during search for query: '{request.query}'")
        raise HTTPException(status_code=500, detail="An internal error occurred.")

@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}
```

**inference_service/src/orchestrator.py**

```python
import asyncio
import logging
from typing import AsyncGenerator
from langsmith import traceable

from . import retriever, reranker, generator, guardrails, query_transformer
from .config import Settings

logger = logging.getLogger(__name__)

class RAGOrchestrator:
    """Orchestrates the end-to-end RAG pipeline asynchronously."""

    def __init__(self, settings: Settings, retriever_client, reranker_client, generator_client, transformer_client):
        self.settings = settings
        self.retriever = retriever_client
        self.reranker = reranker_client
        self.generator = generator_client
        self.transformer = transformer_client

    @classmethod
    async def create(cls, settings: Settings):
        """Asynchronously create an instance of the orchestrator."""
        # Initialize clients for dependencies
        retriever_client = retriever.HybridRetriever(settings.opensearch_host)
        reranker_client = reranker.SageMakerReranker(settings.reranker_endpoint_name)
        generator_client = generator.BedrockGenerator(settings.generator_model_id)
        transformer_client = query_transformer.QueryTransformer(settings.hyde_model_id, settings.redis_host)
        return cls(settings, retriever_client, reranker_client, generator_client, transformer_client)

    @traceable(name="stream_rag_response")
    async def stream_rag_response(self, query: str, user_id: str) -> AsyncGenerator[str, None]:
        """Full asynchronous RAG pipeline with streaming."""
        
        # 1. Input Guardrails & Transformation (can be run concurrently)
        guarded_query_task = guardrails.apply_input_guardrails(query)
        transformed_query_task = self.transformer.transform_query(query)
        
        guarded_query, transformed_query = await asyncio.gather(
            guarded_query_task, transformed_query_task
        )
        
        # 2. Hybrid Retrieval
        retrieved_docs = await self.retriever.retrieve(transformed_query, top_k=50)
        
        # 3. Contextual Re-ranking
        reranked_docs = await self.reranker.rerank(guarded_query, retrieved_docs, user_id, top_k=5)
        
        # 4. Prompt Construction and Generation
        final_prompt = self.generator.construct_prompt(guarded_query, reranked_docs)
        
        # 5. Streaming Generation and Output Guardrails
        token_stream = self.generator.stream_response(final_prompt)
        async for token in guardrails.apply_output_guardrails(token_stream):
            yield token
```

#### Unit Tests

**inference_service/tests/unit/test_orchestrator.py**
```python
import pytest
from unittest.mock import AsyncMock

from src.orchestrator import RAGOrchestrator

@pytest.mark.asyncio
async def test_orchestrator_full_flow(mocker):
    """Tests the full orchestration flow with mocked dependencies."""
    # ARRANGE: Mock all external clients and their async methods
    mock_retriever = AsyncMock()
    mock_reranker = AsyncMock()
    mock_generator = AsyncMock()
    mock_transformer = AsyncMock()

    mock_retriever.retrieve.return_value = [{"page_content": "doc1"}]
    mock_reranker.rerank.return_value = [{"page_content": "reranked_doc1"}]
    mock_generator.stream_response.return_value = (token for token in ["This", " is", " a", " test."]) # Async generator mock
    mock_transformer.transform_query.return_value = "transformed query"
    
    mocker.patch('src.guardrails.apply_input_guardrails', return_value="safe query")
    mocker.patch('src.guardrails.apply_output_guardrails', side_effect=lambda x: x) # Pass-through mock

    orchestrator_instance = RAGOrchestrator(
        settings=mocker.Mock(),
        retriever_client=mock_retriever,
        reranker_client=mock_reranker,
        generator_client=mock_generator,
        transformer_client=mock_transformer
    )

    # ACT: Run the orchestrator
    query = "test query"
    result_stream = orchestrator_instance.stream_rag_response(query, "user123")
    result = "".join([token async for token in result_stream])

    # ASSERT: Verify that all components were called correctly
    mock_transformer.transform_query.assert_awaited_once_with(query)
    mock_retriever.retrieve.assert_awaited_once_with("transformed query", top_k=50)
    mock_reranker.rerank.assert_awaited_once()
    mock_generator.construct_prompt.assert_called_once()
    mock_generator.stream_response.assert_called_once()
    assert result == "This is a test."
```


#### Infrastructure as Code (Terraform)

**inference_service/infra/ecs.tf**

```hcl
# Defines the AWS Fargate service for our FastAPI application

resource "aws_ecs_cluster" "main" {
  name = "rag-inference-cluster-${var.env}"
}

resource "aws_ecs_task_definition" "api" {
  family                   = "rag-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024 # 1 vCPU
  memory                   = 2048 # 2 GB

  # ... (container definition pointing to the ECR image, port mappings, etc.) ...
  
  # IAM role for the task to access Bedrock, SageMaker, OpenSearch
  task_role_arn            = aws_iam_role.inference_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
}

resource "aws_ecs_service" "main" {
  name            = "rag-inference-service-${var.env}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2 # Start with 2 tasks for high availability
  launch_type     = "FARGATE"
  
  # ... (network configuration, load balancer attachment) ...
}

# ... (Autoscaling configuration based on CPU or request count) ...
```

#### Integration Test

**inference_service/tests/integration/test_api.py**

```python
import pytest
import requests
import os

# API_ENDPOINT is the URL of the deployed staging service
API_ENDPOINT = os.environ["STAGING_API_ENDPOINT"]

@pytest.mark.integration
def test_search_endpoint_returns_success():
    """Tests that the deployed API returns a successful response."""
    response = requests.post(
        f"{API_ENDPOINT}/search",
        json={"query": "what are the best hiking boots?"},
        stream=True
    )
    assert response.status_code == 200
    
    # Assert that we get some streamed content back
    content = ""
    for chunk in response.iter_content(chunk_size=None):
        content += chunk.decode('utf-8')
    
    assert len(content) > 0
```

**inference_service/tests/load/locustfile.py**

```python
from locust import HttpUser, task, between

class RAGUser(HttpUser):
    wait_time = between(1, 5)  # Simulate user think time

    @task
    def search_query(self):
        headers = {"Content-Type": "application/json"}
        payload = {
            "query": "waterproof trail running shoes for wide feet",
            "user_id": f"locust_user_{self.environment.runner.user_count}"
        }
        self.client.post("/search", json=payload, headers=headers, name="/search")
```

####  CI/CD GitHub Actions Workflow

**.github/workflows/deploy_inference_service.yml**

```yaml
name: Deploy RAG Inference Service

on:
  push:
    branches:
      - main
    paths:
      - 'inference_service/**'

jobs:
  # ... (lint-and-test job as before) ...
  
  build-and-push-image:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: lint-and-test
    steps:
      # ... (checkout code) ...
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        # ...
      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2
      - name: Build, tag, and push image to Amazon ECR
        run: |
          docker build -t ${{ secrets.ECR_REPOSITORY_URI }}:${{ github.sha }} ./inference_service
          docker push ${{ secrets.ECR_REPOSITORY_URI }}:${{ github.sha }}

  deploy-to-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build-and-push-image
    environment: staging
    steps:
      # ... (checkout code, configure AWS creds, setup Terraform) ...
      - name: Terraform Apply Staging
        run: |
          cd inference_service/infra
          terraform init
          # Pass the new image tag to the deployment
          terraform apply -auto-approve -var="env=staging" -var="image_tag=${{ github.sha }}"

  run-staging-tests:
    name: Run Integration & Load Tests
    runs-on: ubuntu-latest
    needs: deploy-to-staging
    environment: staging
    steps:
      # ... (setup, install dependencies) ...
      - name: Run integration tests
        env:
          STAGING_API_ENDPOINT: ${{ secrets.STAGING_API_ENDPOINT }}
        run: pytest inference_service/tests/integration/
      - name: Run load tests
        run: locust -f inference_service/tests/load/locustfile.py --host ${{ secrets.STAGING_API_ENDPOINT }} --headless -u 10 -r 2 --run-time 1m

  # ... (Manual approval gate and deploy-to-production jobs as planned) ...
```



___



### Implementation: The Monitoring and Observability Pipeline

This is not a traditional batch pipeline but a continuous, event-driven streaming architecture. The artifacts below define the instrumentation, infrastructure, and automation required to collect, process, and act on observability data in real-time.

#### Python Scripts (Core Logic)

The core logic is broken down into modular scripts, each responsible for a specific stage of the pipeline. These scripts would be packaged and deployed as AWS Lambda functions or run within an AWS Glue job.

**monitoring/src/instrumentation_lib.py**

(This library would be packaged and included as a dependency in the Inference Service)

```python
import logging
import json
import os
import boto3
from uuid import uuid4

# Use a custom JSON formatter for structured logging
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "trace_id": getattr(record, "trace_id", "N/A"),
            "service": "RAGInferenceService"
        }
        # Add exception info if it exists
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def configure_logging():
    """Configures root logger for structured JSON logging."""
    # Remove any existing handlers
    for handler in logging.root.handlers[:]:
        logging.root.removeHandler(handler)
        
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler])

def get_trace_id() -> str:
    """Generates a unique trace ID."""
    return str(uuid4())

def emit_cloudwatch_metric(metric_name: str, value: float, unit: str = 'Milliseconds'):
    """Emits a custom metric to CloudWatch."""
    try:
        cloudwatch = boto3.client('cloudwatch')
        cloudwatch.put_metric_data(
            Namespace='RAGApplication',
            MetricData=[
                {
                    'MetricName': metric_name,
                    'Value': value,
                    'Unit': unit,
                    'Dimensions': [
                        {
                            'Name': 'Service',
                            'Value': 'RAGInferenceService'
                        }
                    ]
                },
            ]
        )
    except Exception as e:
        # Log error but don't fail the main application path
        logging.error(f"Failed to emit CloudWatch metric '{metric_name}': {e}")
```

**monitoring/src/log_processing_lambda.py**

```python
import json
import base64
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Processes logs from Kinesis Firehose, enriches them,
    and returns them for storage in S3.
    """
    output_records = []

    for record in event['records']:
        try:
            # Decode the payload from Firehose
            payload_decoded = base64.b64decode(record['data']).decode('utf-8')
            log_data = json.loads(payload_decoded)

            # 1. PARSE: The data is already structured JSON.
            # 2. ENRICH: Add additional metadata.
            #    (e.g., lookup user details from a DB using log_data['user_id'])
            log_data['processed_by'] = context.function_name
            
            # 3. AGGREGATE/ANALYZE (Example):
            # In a more complex scenario, you could send a sample of responses
            # to another service (e.g., an LLM-as-a-judge) here to calculate a
            # groundedness score before archiving.
            
            processed_payload = json.dumps(log_data).encode('utf-8')
            
            output_records.append({
                'recordId': record['recordId'],
                'result': 'Ok',
                'data': base64.b64encode(processed_payload).decode('utf-8')
            })

        except Exception as e:
            logger.error(f"Failed to process record {record['recordId']}: {e}")
            output_records.append({
                'recordId': record['recordId'],
                'result': 'ProcessingFailed',
                'data': record['data'] # Return original data on failure
            })

    return {'records': output_records}
```


#### Unit Tests

**monitoring/tests/unit/test_log_processing_lambda.py**

```python
import base64
import json
from src import log_processing_lambda

def test_lambda_handler_processes_records():
    """Tests that the Lambda handler correctly processes a Kinesis Firehose event."""
    # ARRANGE: Create a sample Kinesis Firehose event
    log_event = {
        "timestamp": "2025-08-08T10:00:00Z",
        "level": "INFO",
        "message": "Search successful",
        "trace_id": "123-abc"
    }
    event_data = base64.b64encode(json.dumps(log_event).encode('utf-8')).decode('utf-8')
    
    kinesis_event = {
        'records': [{
            'recordId': '4964251234',
            'data': event_data
        }]
    }

    # ACT: Call the handler
    result = log_processing_lambda.handler(kinesis_event, {})

    # ASSERT: Check the result structure and content
    assert len(result['records']) == 1
    record = result['records'][0]
    assert record['result'] == 'Ok'
    
    # Decode the processed data to verify enrichment
    processed_data_decoded = base64.b64decode(record['data']).decode('utf-8')
    processed_data_json = json.loads(processed_data_decoded)
    
    assert processed_data_json['trace_id'] == "123-abc"
    assert 'processed_by' in processed_data_json
```


#### Infrastructure as Code (Terraform)

**monitoring/infra/main.tf**

```hcl
# main.tf - Defines the infrastructure for the observability pipeline

# --- CloudWatch Resources ---
resource "aws_cloudwatch_log_group" "inference_service_logs" {
  name              = "/aws/ecs/rag-inference-service-${var.env}"
  retention_in_days = 30
}

resource "aws_cloudwatch_dashboard" "rag_dashboard" {
  dashboard_name = "RAG-Observability-Dashboard-${var.env}"
  dashboard_body = jsonencode({
    # ... (Dashboard widget definitions for Latency, Cost, RAG Quality metrics) ...
  })
}

resource "aws_cloudwatch_metric_alarm" "p99_latency_alarm" {
  alarm_name          = "High-P99-Latency-Alarm-${var.env}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "p99_latency" # Custom metric emitted by the app
  namespace           = "RAGApplication"
  period              = "60"
  statistic           = "Average"
  threshold           = "1500" # 1.5 seconds
  alarm_description   = "P99 latency for the RAG inference service is too high."
  alarm_actions       = [aws_sns_topic.alarms.arn]
}

# --- Kinesis Firehose for Log Streaming ---
resource "aws_kinesis_firehose_delivery_stream" "log_stream" {
  name        = "rag-log-stream-${var.env}"
  destination = "extended_s3"

  extended_s3_configuration {
    bucket_arn        = aws_s3_bucket.log_archive.arn
    role_arn          = aws_iam_role.firehose_role.arn
    
    # Route logs through our Lambda for processing
    processing_configuration {
      enabled = "true"
      processors {
        type = "Lambda"
        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = aws_lambda_function.log_processor.arn
        }
      }
    }
  }
}

# Subscription to send logs from CloudWatch to Kinesis
resource "aws_cloudwatch_log_subscription_filter" "log_subscription" {
  name            = "KinesisSubscriptionFilter-${var.env}"
  log_group_name  = aws_cloudwatch_log_group.inference_service_logs.name
  filter_pattern  = "" # Send all logs
  destination_arn = aws_kinesis_firehose_delivery_stream.log_stream.arn
  role_arn        = aws_iam_role.cloudwatch_to_firehose_role.arn
}

# --- Supporting Resources (S3, Lambda, IAM, SNS) ---
resource "aws_s3_bucket" "log_archive" {
  bucket = "rag-log-archive-${var.env}"
}

resource "aws_lambda_function" "log_processor" {
  function_name = "LogProcessorLambda-${var.env}"
  # ... (configuration for the log processing lambda) ...
}

resource "aws_sns_topic" "alarms" {
  name = "RAG-Alarms-Topic-${var.env}"
}
```

#### Integration Test

**monitoring/tests/integration/test_monitoring_pipeline.py**

```python
import boto3
import requests
import time
import pytest
import os
import gzip

API_ENDPOINT = os.environ["STAGING_API_ENDPOINT"]
LOG_ARCHIVE_BUCKET = os.environ["STAGING_LOG_BUCKET"]

@pytest.mark.integration
def test_end_to_end_logging_flow():
    s3_client = boto3.client("s3")
    
    # 1. ARRANGE: Generate a unique ID to find in the logs
    unique_id = f"integration-test-{int(time.time())}"
    
    # 2. ACT: Make a request to the service that will generate a log
    requests.post(f"{API_ENDPOINT}/search", json={"query": unique_id})
    
    # 3. ASSERT: Poll the S3 bucket until the log file appears
    found_log = False
    for _ in range(12): # Poll for up to 1 minute
        time.sleep(5)
        # Construct prefix based on Firehose date partitioning
        prefix = f"{time.strftime('%Y/%m/%d/%H')}/"
        response = s3_client.list_objects_v2(Bucket=LOG_ARCHIVE_BUCKET, Prefix=prefix)
        
        if 'Contents' in response:
            for obj in response['Contents']:
                log_obj = s3_client.get_object(Bucket=LOG_ARCHIVE_BUCKET, Key=obj['Key'])
                log_content = gzip.decompress(log_obj['Body'].read()).decode('utf-8')
                
                if unique_id in log_content:
                    found_log = True
                    # Check if the log was enriched by our Lambda
                    assert 'processed_by' in log_content
                    break
        if found_log:
            break
            
    assert found_log, "Log file with unique ID was not found in S3 within 60 seconds."
```

####  CI/CD GitHub Actions Workflow

**.github/workflows/deploy_monitoring_infra.yml**

```yaml
name: Deploy Monitoring Infrastructure

on:
  push:
    branches:
      - main
    paths:
      - 'monitoring/**'

jobs:
  # ... (lint-and-test job for monitoring/src/*.py as before) ...

  deploy-to-staging:
    name: Deploy Monitoring Infra to Staging
    runs-on: ubuntu-latest
    needs: lint-and-test
    environment: staging
    permissions:
      id-token: write
      contents: read
    steps:
      # ... (checkout, configure AWS creds, setup Terraform) ...
      - name: Terraform Apply Monitoring
        run: |
          cd monitoring/infra
          terraform init
          terraform apply -auto-approve -var="env=staging"
  
  run-integration-test:
    name: Run Monitoring Integration Test
    runs-on: ubuntu-latest
    needs: deploy-to-staging
    environment: staging
    steps:
      # ... (setup, configure AWS creds, install dependencies) ...
      - name: Run E2E Monitoring Test
        env:
          STAGING_API_ENDPOINT: ${{ secrets.STAGING_API_ENDPOINT }}
          STAGING_LOG_BUCKET: "rag-log-archive-staging" # This could also be a secret or TF output
        run: pytest monitoring/tests/integration/
```



___




### Implementation: Testing in Production

#### Python Scripts (Analysis)


**production_testing/analysis/ab_test_analysis.py**

```python
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency, ttest_ind
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def analyze_conversion_rate(df: pd.DataFrame, control_name='control', challenger_name='challenger'):
    """Performs a Chi-squared test for conversion rates."""
    contingency_table = pd.crosstab(df['variant_id'], df['converted'])
    
    if control_name not in contingency_table.index or challenger_name not in contingency_table.index:
        logging.warning("Control or challenger variant not found in the data.")
        return None, None, None

    chi2, p_value, _, _ = chi2_contingency(contingency_table)
    
    control_conv_rate = contingency_table.loc[control_name, True] / contingency_table.loc[control_name].sum()
    challenger_conv_rate = contingency_table.loc[challenger_name, True] / contingency_table.loc[challenger_name].sum()
    
    logging.info(f"Control Conversion Rate: {control_conv_rate:.4f}")
    logging.info(f"Challenger Conversion Rate: {challenger_conv_rate:.4f}")
    logging.info(f"Chi-squared p-value: {p_value:.4f}")
    
    return control_conv_rate, challenger_conv_rate, p_value

def analyze_aov(df: pd.DataFrame, control_name='control', challenger_name='challenger'):
    """Performs an independent T-test for Average Order Value."""
    control_aov = df[df['variant_id'] == control_name]['order_value'].dropna()
    challenger_aov = df[df['variant_id'] == challenger_name]['order_value'].dropna()

    if control_aov.empty or challenger_aov.empty:
        logging.warning("No order data for one or both variants.")
        return None, None, None

    _, p_value = ttest_ind(control_aov, challenger_aov, equal_var=False) # Welch's T-test
    
    logging.info(f"Control AOV: ${control_aov.mean():.2f}")
    logging.info(f"Challenger AOV: ${challenger_aov.mean():.2f}")
    logging.info(f"T-test p-value: {p_value:.4f}")
    
    return control_aov.mean(), challenger_aov.mean(), p_value

def generate_report(data_path: str, alpha: float = 0.05):
    """Loads data and generates a full A/B test report."""
    logging.info(f"Loading experiment data from {data_path}...")
    # In a real scenario, this would connect to a data warehouse like Redshift or BigQuery.
    # For this example, we'll use a CSV.
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        logging.error(f"Data file not found at {data_path}")
        return

    logging.info("\n--- Conversion Rate Analysis ---")
    _, _, conv_p_value = analyze_conversion_rate(df)
    
    if conv_p_value is not None:
        if conv_p_value < alpha:
            logging.info("Result: Statistically significant difference in conversion rates found.")
        else:
            logging.info("Result: No statistically significant difference in conversion rates.")

    logging.info("\n--- Average Order Value (AOV) Analysis ---")
    _, _, aov_p_value = analyze_aov(df)
    if aov_p_value is not None:
        if aov_p_value < alpha:
            logging.info("Result: Statistically significant difference in AOV found.")
        else:
            logging.info("Result: No statistically significant difference in AOV.")

    # --- Final Recommendation Logic ---
    # (This would be more sophisticated in a real business context)
    logging.info("\n--- Recommendation ---")
    if conv_p_value is not None and conv_p_value < alpha:
        logging.info("Promote Challenger: Strong evidence of impact on conversion.")
    else:
        logging.info("Decision: Continue experiment or conclude with no significant finding.")

if __name__ == "__main__":
    # Example usage:
    # python ab_test_analysis.py data/experiment_results.csv
    import sys
    if len(sys.argv) > 1:
        generate_report(sys.argv[1])
    else:
        logging.error("Please provide the path to the experiment data CSV.")
```


#### Unit Tests

**production_testing/tests/unit/test_ab_test_analysis.py**

```python
import pandas as pd
from analysis import ab_test_analysis

def create_sample_data(control_users, control_conversions, challenger_users, challenger_conversions):
    """Helper function to create a sample DataFrame for testing."""
    data = {
        'variant_id': ['control'] * control_users + ['challenger'] * challenger_users,
        'converted': [True] * control_conversions + [False] * (control_users - control_conversions) + \
                     [True] * challenger_conversions + [False] * (challenger_users - challenger_conversions)
    }
    return pd.DataFrame(data)

def test_conversion_rate_significant_difference():
    """Test case where there is a clear, statistically significant difference."""
    df = create_sample_data(10000, 500, 10000, 600) # 5% vs 6% conversion
    _, _, p_value = ab_test_analysis.analyze_conversion_rate(df)
    assert p_value is not None
    assert p_value < 0.05

def test_conversion_rate_no_difference():
    """Test case where there is no significant difference."""
    df = create_sample_data(10000, 500, 10000, 505) # 5.0% vs 5.05%
    _, _, p_value = ab_test_analysis.analyze_conversion_rate(df)
    assert p_value is not None
    assert p_value > 0.05
```



#### Integration Test

**production_testing/tests/integration/test_ab_routing.py**

```python
import requests
import os
import pytest
from collections import Counter

# PRODUCTION_API_ENDPOINT is the URL of the live, production service
API_ENDPOINT = os.environ["PRODUCTION_API_ENDPOINT"]

@pytest.mark.integration
@pytest.mark.production
def test_traffic_splitting_distribution():
    """Validates that the production traffic split is working as configured."""
    responses = []
    num_requests = 1000
    
    # 1. ACTION: Make 1000 requests to the production endpoint
    for _ in range(num_requests):
        try:
            # The inference service should be configured to return a header
            # indicating which version served the request.
            response = requests.post(f"{API_ENDPOINT}/search", json={"query": "test"}, timeout=5)
            if response.status_code == 200 and 'X-Variant-Version' in response.headers:
                responses.append(response.headers['X-Variant-Version'])
        except requests.RequestException:
            # Ignore timeouts or errors for this specific test
            pass

    # 2. COLLECT: Count the responses from each variant
    counts = Counter(responses)
    control_count = counts.get('control', 0)
    challenger_count = counts.get('challenger', 0)
    
    total_responses = control_count + challenger_count
    assert total_responses > 0, "Did not receive any valid responses from the API."

    challenger_percentage = (challenger_count / total_responses) * 100
    
    # 3. ASSERT: Check if the distribution is within tolerance (e.g., 5% +/- 2%)
    expected_challenger_weight = 5.0
    tolerance = 2.0
    
    print(f"Observed challenger traffic: {challenger_percentage:.2f}%")
    assert abs(challenger_percentage - expected_challenger_weight) < tolerance
```

####  CI/CD GitHub Actions Workflow

**.github/workflows/deploy_inference_service.yml (Deploy to Production)**

```yaml
  deploy-to-production:
    name: Canary Deploy to Production
    runs-on: ubuntu-latest
    needs: run-staging-tests
    environment: production
    # ... (permissions, secrets, etc.) ...
    steps:
      # ... (checkout, configure AWS creds, setup Terraform) ...
      - name: 1. Deploy Challenger Service
        run: |
          cd inference_service/infra
          terraform init
          # Deploy the new container as the "challenger" service
          terraform apply -auto-approve -var="env=production" -var="image_tag=${{ github.sha }}" -target=aws_ecs_service.challenger

      - name: 2. Shift 5% Traffic to Challenger
        run: |
          cd inference_service/infra
          # Update the ALB / API Gateway to send 5% of traffic
          terraform apply -auto-approve -var="env=production" -var="challenger_weight=5"
      
      - name: 3. Monitor Canary Health
        run: |
          # This script would query CloudWatch for challenger's error rate and latency
          # If metrics exceed thresholds, it exits with a non-zero code.
          ./scripts/monitor_canary.sh challenger-service-name
      
      - name: 4. Manual Approval for Full Rollout
        if: success()
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.TOKEN }}
          approvers: 'engineering-lead,product-manager'
          minimum-approvals: 1
          issue-title: "Promote RAG Challenger to 100% Traffic?"
      
      - name: 5. Promote Challenger (if approved)
        if: success()
        run: |
          cd inference_service/infra
          # Shift 100% traffic to challenger and scale down control
          terraform apply -auto-approve -var="env=production" -var="challenger_weight=100"

      - name: 6. Automated Rollback (if canary monitor fails)
        if: failure()
        run: |
          echo "Canary deployment failed! Rolling back..."
          cd inference_service/infra
          terraform apply -auto-approve -var="env=production" -var="challenger_weight=0"
          # This step would also trigger a PagerDuty/Slack alert
```

### Implementation: Embedding Model Fine-tuning Pipeline

#### Python Scripts (Pipeline Components)

**finetuning_pipeline/src/data_preparation.py**

```python
import pandas as pd
import logging
from sentence_transformers import SentenceTransformer
from opensearchpy import OpenSearch # and other clients
from sklearn.model_selection import train_test_split
from typing import List, Tuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# This would be initialized with proper credentials
opensearch_client = OpenSearch(...) 
production_embedding_model = SentenceTransformer('intfloat/multilingual-e5-large')

def load_interaction_data(log_bucket: str, date_prefix: str) -> pd.DataFrame:
    """Loads and merges user interaction logs from S3."""
    # In a real scenario, this would read multiple Parquet/JSON files from S3,
    # potentially using AWS Data Wrangler (awswrangler).
    logger.info(f"Loading interaction data from s3://{log_bucket}/{date_prefix}")
    # Placeholder for data loading logic
    sample_data = {
        'session_id': ['s1', 's1', 's2', 's2', 's2'],
        'query': ['queryA', 'queryA', 'queryB', 'queryB', 'queryB'],
        'retrieved_product_id': ['prod1', 'prod2', 'prod3', 'prod4', 'prod5'],
        'clicked': [False, True, False, False, True],
        'purchased': [False, True, False, False, False]
    }
    return pd.DataFrame(sample_data)

def get_product_text(product_id: str) -> str:
    """Fetches the text content for a given product ID."""
    # This would query a database or another S3 location
    return f"Full text description for {product_id}." # Placeholder

def perform_hard_negative_mining(query: str, positive_id: str) -> str:
    """Finds a hard negative for a given query and positive example."""
    query_embedding = production_embedding_model.encode(query)
    
    # Retrieve top 5 results from the current production index
    # This simulates what the user would have seen
    response = opensearch_client.search(...) # Search with query_embedding
    
    retrieved_ids = [hit['_source']['product_id'] for hit in response['hits']['hits']]
    
    # Find the first retrieved ID that is NOT the one the user purchased
    for an_id in retrieved_ids:
        if an_id != positive_id:
            logger.info(f"Found hard negative '{an_id}' for query '{query}'")
            return get_product_text(an_id)
            
    return None # Could happen if user buys the top result

def create_triplets(df: pd.DataFrame) -> List[Tuple[str, str, str]]:
    """Constructs (anchor, positive, negative) triplets from interaction data."""
    triplets = []
    successful_interactions = df[df['purchased'] == True]
    
    for _, row in successful_interactions.iterrows():
        anchor = row['query']
        positive_text = get_product_text(row['retrieved_product_id'])
        negative_text = perform_hard_negative_mining(anchor, row['retrieved_product_id'])
        
        if anchor and positive_text and negative_text:
            triplets.append((anchor, positive_text, negative_text))
            
    logger.info(f"Successfully created {len(triplets)} training triplets.")
    return triplets

def main():
    # This script would be run by the Airflow task
    interaction_df = load_interaction_data("rag-log-archive-prod", "2025/08/")
    triplets = create_triplets(interaction_df)
    
    # Convert to a DataFrame and save to S3
    triplets_df = pd.DataFrame(triplets, columns=['anchor', 'positive', 'negative'])
    train_df, val_df = train_test_split(triplets_df, test_size=0.1)
    
    # Save to S3 in a versioned folder (e.g., using the run date)
    # train_df.to_csv("s3://rag-finetuning-data/train_YYYY-MM-DD.csv")
    # val_df.to_csv("s3://rag-finetuning-data/val_YYYY-MM-DD.csv")
```

#### Unit Tests (pytest)

**finetuning_pipeline/tests/unit/test_data_preparation.py**

```python
import pandas as pd
from unittest.mock import patch
from src import data_preparation

@patch('src.data_preparation.production_embedding_model')
@patch('src.data_preparation.opensearch_client')
def test_hard_negative_mining_logic(mock_os_client, mock_model):
    """Tests that the hard negative mining correctly selects a non-positive document."""
    # ARRANGE
    test_query = "test query"
    positive_product_id = "prod-positive"
    
    # Mock the OpenSearch response
    mock_os_client.search.return_value = {
        'hits': {'hits': [
            {'_source': {'product_id': 'prod-hard-negative'}},
            {'_source': {'product_id': 'prod-positive'}},
            {'_source': {'product_id': 'prod-other'}}
        ]}
    }
    
    # ACT
    hard_negative = data_preparation.perform_hard_negative_mining(test_query, positive_product_id)
    
    # ASSERT
    # It should have picked the first result that was not the positive one.
    assert "prod-hard-negative" in hard_negative
```


#### Pipeline Orchestration (Airflow DAG)

**dags/embedding_finetuning_dag.py**

```python
from __future__ import annotations
import pendulum
from airflow.models.dag import DAG
from airflow.operators.python import BranchPythonOperator
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTrainingOperator # and ProcessingOperator
from airflow.operators.dummy import DummyOperator
from airflow.operators.email import EmailOperator

# Define IAM roles, S3 paths, etc. as variables

def check_evaluation_result(**kwargs):
    ti = kwargs['ti']
    # This would pull the evaluation result from XComs, which was pushed by the evaluate_model_task
    eval_result = ti.xcom_pull(task_ids='evaluate_model_task', key='evaluation_summary')
    if eval_result['status'] == 'pass':
        return 'register_model_task'
    else:
        return 'notify_failure_task'

with DAG(
    dag_id="embedding_model_finetuning",
    start_date=pendulum.datetime(2025, 1, 1, tz="UTC"),
    schedule="0 0 1 * *", # At 00:00 on day-of-month 1.
    catchup=False,
    tags=["rag", "finetuning"],
) as dag:
    
    prepare_data_task = # ... PythonOperator to run data_preparation.py ...
    
    train_model_task = SageMakerTrainingOperator(
        task_id="train_model_task",
        # ... (config pointing to training script, instance types, IAM role) ...
    )

    evaluate_model_task = # ... SageMakerProcessingOperator to run model_evaluation.py ...
    
    check_evaluation_gate = BranchPythonOperator(
        task_id="check_evaluation_gate",
        python_callable=check_evaluation_result,
    )
    
    register_model_task = # ... PythonOperator to run model_registration.py ...
    
    notify_failure_task = EmailOperator(
        task_id="notify_failure_task",
        to="ml-team@example.com",
        subject="Embedding Model Fine-tuning Failed Quality Gate",
        html_content="The candidate model did not outperform the production model. Check the logs.",
    )

    success_task = DummyOperator(task_id="success")

    prepare_data_task >> train_model_task >> evaluate_model_task >> check_evaluation_gate
    check_evaluation_gate >> [register_model_task, notify_failure_task]
    register_model_task >> success_task
```

#### Infrastructure as Code (Terraform)

**finetuning_pipeline/infra/sagemaker.tf**

```hcl
# Defines the SageMaker Model Group for versioning our fine-tuned models

resource "aws_sagemaker_model_package_group" "embedding_models" {
  model_package_group_name        = "rag-embedding-models-${var.env}"
  model_package_group_description = "All versions of the fine-tuned RAG embedding model."
}

# IAM role for the SageMaker training jobs
resource "aws_iam_role" "sagemaker_training_role" {
  name = "SageMakerTrainingRole-${var.env}"
  assume_role_policy = # ... (trust policy for sagemaker.amazonaws.com) ...
}

# Attach policies granting access to S3 data buckets and ECR
resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.sagemaker_training_role.name
  policy_arn = # ... (ARN of a policy allowing read from data bucket, write to artifact bucket) ...
}
```

#### Integration Test

**finetuning_pipeline/tests/integration/test_finetuning_dag.py**

```python
import pytest
from airflow.models.dagbag import DagBag

@pytest.mark.integration
def test_dag_loads_with_no_errors():
    """Checks if the DAG file is syntactically correct and can be parsed by Airflow."""
    dagbag = DagBag(dag_folder='dags/', include_examples=False)
    assert not dagbag.import_errors
    assert 'embedding_model_finetuning' in dagbag.dags

# A more advanced integration test would use the Airflow API to trigger the DAG
# in a test environment and check its final state.
# from airflow.api.client.local_client import Client
#
# def test_dag_run_completes():
#     client = Client(None, None)
#     result = client.trigger_dag(dag_id='embedding_model_finetuning')
#     # ... poll for completion status ...
#     assert result['state'] == 'success'
```

#### CI/CD GitHub Actions Workflow

**.github/workflows/deploy_finetuning_pipeline.yml**


```yaml
name: Deploy Fine-tuning Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'finetuning_pipeline/**'
      - 'dags/embedding_finetuning_dag.py'

jobs:
  lint-and-test:
    name: Lint & Unit Test
    runs-on: ubuntu-latest
    steps:
      # ... (checkout, setup python, install dependencies) ...
      - name: Run unit tests
        run: pytest finetuning_pipeline/tests/unit/

  deploy-to-staging:
    name: Deploy to Staging Airflow
    runs-on: ubuntu-latest
    needs: lint-and-test
    environment: staging
    steps:
      # ... (checkout, configure AWS creds, setup Terraform) ...
      - name: Terraform Apply
        run: |
          cd finetuning_pipeline/infra
          terraform init
          terraform apply -auto-approve -var="env=staging"
      - name: Sync DAG to Staging Airflow
        # This step would use aws s3 sync or a custom script to upload the
        # dags/embedding_finetuning_dag.py file to the Airflow S3 bucket.
        run: aws s3 sync ./dags s3://${{ secrets.STAGING_AIRFLOW_DAGS_BUCKET }}/dags
```

---

### Guide to Fine-tuning Re-ranker Model

#### **The "Why": The Two-Stage Retrieval Process**

Think of RAG system's retrieval in two stages, like a fishing operation:

1.  **The Retriever (Embedding Model / Bi-Encoder): The Wide Net.** Its job is to be **fast** and achieve **high recall**. It quickly scans the entire ocean of documents and pulls in a large net of 50-100 potentially relevant candidates. It's good at finding things that are semantically *in the ballpark*, but it might also pull in a lot of irrelevant "bycatch." This is a **bi-encoder** architecture, where the query and documents are embedded independently.

2.  **The Re-ranker (Cross-Encoder): The Expert Judge.** Its job is to be **accurate** and achieve **high precision**. It takes the smaller catch from the retriever's net (the 50-100 candidates) and individually inspects each one against the query. It's much slower but far more discerning. This is a **cross-encoder** architecture, which processes the query and a document *together*, allowing for much deeper contextual understanding.

The goal of fine-tuning the re-ranker is to make this "expert judge" exceptionally good at understanding the specific nuances of relevance for *your* products and *your* customers' queries.

#### **The Dataset: The Crucial Difference**

The dataset used for fine-tuning a re-ranker is fundamentally different from the triplet dataset used for the embedding model. They are structured differently to serve different training objectives.

Here is a clear comparison:

| Aspect | Embedding Model Fine-tuning Dataset | Re-ranker Fine-tuning Dataset |
| :--- | :--- | :--- |
| **Purpose** | To learn a **global semantic representation**. Teaches the model to place similar items close together in the vector space so the "wide net" retrieval works better. | To learn **relative relevance**. Teaches the model to look at a query and a specific document and say "Yes, this is a highly relevant answer" (label=1) or "No, this is not a good answer" (label=0). |
| **Structure** | Triplets: `(anchor, positive, negative)` | Scored Pairs: `(query, passage, label)` where the label is typically `1` (relevant) or `0` (irrelevant). |
| **Example** | (`"running shoes"`, `"Text about Nike Pegasus..."`, `"Text about dress shoes..."`) | 1. (`"running shoes"`, `"Text about Nike Pegasus..."`, `1`) <br> 2. (`"running shoes"`, `"Text about dress shoes..."`, `0`) |
| **Training Objective** | **Distance-based Loss** (e.g., TripletLoss). The goal is to minimize the distance between `anchor` and `positive` while maximizing the distance between `anchor` and `negative`. | **Classification or Ranking Loss** (e.g., Binary Cross-Entropy). The model predicts a single score (a logit) representing relevance, and the loss is calculated against the binary `0/1` label. |

#### **Data Sourcing and Creation for the Re-ranker**

The process for creating the re-ranker dataset is similar to the embedding model but results in a different final structure.

1.  **Load User Interaction Data:** Start with the same raw logs from the Monitoring Pipeline (queries, clicks, purchases).

2.  **Create `(query, positive_passage)` Pairs:** For every user journey that resulted in a purchase, create a pair: `(user_query, text_of_purchased_product)`. These will be our **positive examples with a label of `1`**.

3.  **Mine Hard Negatives:** This is the most critical step for a high-performing re-ranker. For each `(query, positive_passage)` pair:
    *   Use the **current production retriever (the bi-encoder)** to fetch the top 10-20 results for that `query`.
    *   From this list, select the documents that the user **did not click on or purchase**. These are your **hard negatives**. They are powerful training examples because they are semantically close enough to the query to be retrieved, but were ultimately deemed irrelevant by the user. This is exactly the ambiguity the re-ranker needs to learn to resolve.
    *   For each hard negative, create a pair: `(user_query, text_of_hard_negative_product)`. These will be our **negative examples with a label of `0`**.

4.  **Assemble and Balance the Dataset:**
    *   Combine all positive and negative pairs into a single dataset.
    *   Ensure the dataset is balanced (roughly equal numbers of positive and negative examples) to prevent the model from becoming biased. You might need to oversample positives or undersample negatives.
    *   The final dataset is a list of examples, each with a `query`, a `passage`, and a `label` (0 or 1).

#### **The Model and Training Process**

1.  **Model Architecture (Cross-Encoder):**
    *   We use a transformer model architecture (like BERT or RoBERTa) configured as a cross-encoder.
    *   Instead of embedding the query and passage separately, we feed them into the model together in a single sequence, separated by a special `[SEP]` token: `[CLS] query [SEP] passage [SEP]`.
    *   The model's output for the `[CLS]` token is then passed through a linear layer to produce a single logit (a raw score). This score represents the relevance of the `passage` to the `query`.

2.  **Training Objective:**
    *   The problem is framed as a simple binary classification. The model's single logit output is passed through a sigmoid function to get a probability between 0 and 1.
    *   We use **Binary Cross-Entropy Loss** to train the model, comparing its predicted probability against the true `0/1` label from our dataset.

3.  **The Training Loop (using Hugging Face `transformers`):**
    *   Load a pre-trained cross-encoder model (e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`) as a starting point.
    *   Use the Hugging Face `Trainer` API, providing it with our prepared dataset of `(query, passage, label)` pairs.
    *   The `Trainer` handles the fine-tuning loop: batching the data, feeding it to the model, calculating the loss, and updating the model's weights.
    *   This is executed as a **SageMaker Training Job**.

#### **The MLOps Pipeline for Re-ranker Fine-tuning**

The pipeline is nearly identical to the embedding model pipeline, demonstrating the power of reusable MLOps patterns.

1.  **Airflow DAG (`reranker_finetuning_dag.py`):**
    *   **`prepare_reranker_data_task`:** Executes a script to perform the data loading and hard negative mining described above, creating the final `(query, passage, label)` dataset.
    *   **`train_reranker_task`:** Submits a **SageMaker Training Job** that runs the Hugging Face training script on a GPU instance.
    *   **`evaluate_reranker_task`:** This is different. It evaluates the new re-ranker by first running the *production retriever* on the Golden Dataset to get top-50 candidates, then using the *new re-ranker* to sort them. It then calculates MRR/NDCG on this **re-ranked list**.
    *   **`check_evaluation_gate` & `register_model_task`:** Same logic as before.

#### **Architecture Diagram**

<img src="../_static/past_experiences/ecom_rag/finetuning_reranker.png" width="100%" style="background-color: #FCF1EF;"/>

___



### Synthetic Dataset Generation to Evaluate Retrieval and Ranking

This script operationalizes the plan to create a large-scale, high-quality evaluation dataset. It uses a powerful LLM (Claude 3 Opus) to generate realistic user queries grounded in specific chunks of our product descriptions, using a curated seed list to guide the generation style.

#### **A. Python Script**

**`golden_dataset_pipeline/src/generate_golden_dataset.py`**

```python
import asyncio
import json
import logging
import os
import random
from typing import List, Dict, Any

import pandas as pd
from aiohttp import ClientError
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.chat_models import BedrockChat

# --- Configuration ---
# In a real project, this would come from a config file or environment variables.
CONFIG = {
    "PRODUCT_CATALOG_PATH": "data/raw/product_catalog.csv",
    "SEED_QUERIES_PATH": "data/raw/seed_queries.txt",
    "OUTPUT_PATH": "data/processed/golden_evaluation_dataset.jsonl",
    "LLM_MODEL_ID": "anthropic.claude-3-opus-20240229-v1:0",
    "MAX_QUERIES_PER_CHUNK": 7,
    "NUM_SEED_EXAMPLES": 5,
    "MAX_CONCURRENT_REQUESTS": 10,  # Important to avoid rate limiting
}

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Core Functions ---

def load_seed_queries(filepath: str) -> List[str]:
    """Loads the seed query list from a text file."""
    try:
        with open(filepath, 'r') as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        logger.error(f"Seed queries file not found at: {filepath}")
        return []

def load_product_documents(filepath: str) -> pd.DataFrame:
    """Loads product catalog data from a CSV."""
    try:
        df = pd.read_csv(filepath)
        # Ensure required columns exist
        if 'product_id' not in df.columns or 'description' not in df.columns:
            raise ValueError("CSV must contain 'product_id' and 'description' columns.")
        return df.dropna(subset=['product_id', 'description'])
    except FileNotFoundError:
        logger.error(f"Product catalog file not found at: {filepath}")
        return pd.DataFrame()

def chunk_document(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Splits a document's text into smaller chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    return splitter.split_text(text)

async def generate_queries_for_chunk(
    llm: BedrockChat,
    chunk_text: str,
    seed_queries: List[str]
) -> List[str]:
    """Uses an LLM to generate a list of queries for a given text chunk."""
    
    # Randomly sample seed queries to provide varied examples in the prompt
    examples = "\n".join(f"- \"{q}\"" for q in random.sample(seed_queries, CONFIG["NUM_SEED_EXAMPLES"]))
    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", 
         "You are a data scientist creating a high-quality evaluation dataset for an e-commerce semantic search engine. "
         "Your task is to generate realistic user search queries that can be answered by the provided text snippet from a product description. "
         "The queries must be diverse, reflecting different user intents (e.g., questions, feature requests, comparisons, use-cases). "
         "The answer to each query you generate MUST be present in the provided context. Do NOT generate questions requiring outside knowledge. "
         "Output a JSON object with a single key 'queries' containing a list of strings."),
        ("human", 
         "**CONTEXT (Product Information Snippet):**\n---\n{context}\n---\n\n"
         "**EXAMPLES of QUERY STYLES:**\n{examples}\n\n"
         f"Please generate {CONFIG['MAX_QUERIES_PER_CHUNK']} realistic and diverse user queries based on the context above.")
    ])
    
    parser = JsonOutputParser()
    chain = prompt_template | llm | parser

    try:
        response = await chain.ainvoke({"context": chunk_text, "examples": examples})
        if "queries" in response and isinstance(response["queries"], list):
            return response["queries"]
        else:
            logger.warning(f"LLM returned malformed JSON, missing 'queries' list. Response: {response}")
            return []
    except (ClientError, json.JSONDecodeError, Exception) as e:
        logger.error(f"Error generating queries for chunk: {e}")
        return []

async def process_document(
    semaphore: asyncio.Semaphore,
    llm: BedrockChat,
    product: pd.Series,
    seed_queries: List[str],
    output_file
):
    """Chunks a document, generates queries for each chunk, and writes to the output file."""
    async with semaphore:
        try:
            product_id = product['product_id']
            description = product['description']
            
            chunks = chunk_document(description)
            logger.info(f"Processing product {product_id}: split into {len(chunks)} chunks.")
            
            tasks = []
            for i, chunk in enumerate(chunks):
                tasks.append(generate_queries_for_chunk(llm, chunk, seed_queries))
            
            generated_queries_per_chunk = await asyncio.gather(*tasks)

            for i, queries in enumerate(generated_queries_per_chunk):
                for query in queries:
                    record = {
                        "query": query,
                        "relevant_product_id": str(product_id),
                        "source_chunk_id": i
                    }
                    output_file.write(json.dumps(record) + "\n")
        
        except Exception as e:
            logger.error(f"Failed to process product {product.get('product_id', 'N/A')}: {e}")

async def main():
    """Main orchestration function."""
    logger.info("Starting synthetic golden dataset generation.")
    
    seed_queries = load_seed_queries(CONFIG["SEED_QUERIES_PATH"])
    product_df = load_product_documents(CONFIG["PRODUCT_CATALOG_PATH"])

    if not seed_queries or product_df.empty:
        logger.error("Cannot proceed without seed queries and product data. Exiting.")
        return

    # Initialize the LLM
    llm = BedrockChat(
        model_id=CONFIG["LLM_MODEL_ID"],
        model_kwargs={"temperature": 0.7, "max_tokens": 2048}
    )

    # Use a semaphore to limit concurrent API calls
    semaphore = asyncio.Semaphore(CONFIG["MAX_CONCURRENT_REQUESTS"])
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(CONFIG["OUTPUT_PATH"]), exist_ok=True)

    with open(CONFIG["OUTPUT_PATH"], 'w') as output_file:
        tasks = []
        for _, product in product_df.iterrows():
            tasks.append(process_document(semaphore, llm, product, seed_queries, output_file))
        
        # Process all documents concurrently
        await asyncio.gather(*tasks)

    logger.info(f"Dataset generation complete. Output saved to {CONFIG['OUTPUT_PATH']}")

if __name__ == "__main__":
    # Ensure AWS credentials and LangSmith env variables are set before running
    # e.g., export LANGCHAIN_TRACING_V2=true; export LANGCHAIN_API_KEY=...
    asyncio.run(main())
```

#### **B. Prerequisites & How to Run**

1.  **File Structure:**
    ```
    golden_dataset_pipeline/
    ├── src/
    │   └── generate_golden_dataset.py
    └── data/
        ├── raw/
        │   ├── product_catalog.csv
        │   └── seed_queries.txt
        └── processed/
            └── (output will be generated here)
    ```

2.  **`product_catalog.csv`:** A CSV file with at least two columns: `product_id` and `description`.

3.  **`seed_queries.txt`:** A plain text file where each line is a real, high-quality user query.
    ```
    waterproof hiking boots with ankle support
    compare sony wh-1000xm5 vs bose qc ultra
    best camera for travel vlogging
    is the iphone 15 compatible with a qi charger?
    ...
    ```

4.  **Dependencies:**
    ```
    pip install pandas langchain langchain-community-aws boto3
    ```

5.  **Execution:**
    *   Set up your AWS credentials (`~/.aws/credentials`).
    *   (Optional but recommended) Set up LangSmith environment variables for tracing.
    *   Run the script from the root of the `golden_dataset_pipeline` directory:
        ```bash
        python src/generate_golden_dataset.py
        ```

#### **C. Output (`golden_evaluation_dataset.jsonl`)**

The script will produce a JSON Lines file, where each line is a single, self-contained evaluation record. This format is efficient and easy to parse.

```json
{"query": "what kind of warranty comes with the anker powerbank?", "relevant_product_id": "B07Y2P1L6F", "source_chunk_id": 2}
{"query": "is this powerbank airline approved for carry on?", "relevant_product_id": "B07Y2P1L6F", "source_chunk_id": 2}
{"query": "compare Anker 313 vs PowerCore Slim 10000", "relevant_product_id": "B07Y2P1L6F", "source_chunk_id": 0}
```