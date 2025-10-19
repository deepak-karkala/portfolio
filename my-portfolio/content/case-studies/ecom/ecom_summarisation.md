# Reviews Summarisation

## 

***

### **TLDR: End-to-End LLM-Powered Review Summarization**

*   **Challenge:** A mid-sized European e-commerce marketplace faced a dual problem: customers were overwhelmed by thousands of unstructured, multilingual reviews, leading to decision fatigue, while the business lacked an automated way to extract actionable insights from this valuable customer feedback.

*   **My Role & Solution:** As the lead **Data Scientist and MLOps/ML Engineer**, I designed, built, and deployed the end-to-end system to solve this challenge. My contributions spanned the entire ML lifecycle, including **Feature Engineering, Model Development, Training & Inference Pipelines, Deployment, Monitoring, and Continual Learning**.

    My solution was a cost-effective, production-grade system architected around a **batch-processing, Retrieval-Augmented Generation (RAG)** strategy to ensure summaries were factually grounded and trustworthy. Key strategic decisions included:
    *   **Model:** Fine-tuning a `Mistral-7B` model using PEFT/LoRA on a multilingual dataset to achieve near GPT-4 quality at a fraction of the cost.
    *   **Quality Assurance:** Implementing a robust, multi-layered evaluation strategy using **Ragas** for factual consistency and **LLM-as-a-judge** for coherence.
    *   **Cost-Effective Architecture:** Building the system on a **fully Managed** solutions (**AWS Step Functions, OpenSearch**) and using **EKS with scale-to-zero** for the inference endpoint to minimize idle costs, making the solution financially viable.
    *   **Tech Stack:** AWS (Step Functions, EKS, SageMaker, Bedrock, OpenSearch), vLLM, Ragas, MLflow, DVC, LangChain, Terraform, and GitHub Actions.

*   **Impact:** The system successfully transformed raw feedback into a valuable asset for both customers and the business. The primary impacts measured via A/B testing were:
    *   Achieved up to a **2% increase in conversion rate** for products with AI-generated summaries.
    *   Led to a **3% reduction in product returns** in the pilot category (Electronics) by setting more accurate customer expectations pre-purchase.
    *   **Automated 100%** of the manual review analysis process, saving an estimated **20-30 hours per week** of analyst time.

*   **System Architecture:** The diagram below illustrates the serverless, event-driven architecture, with the components I owned and delivered highlighted.

<img src="../_static/past_experiences/ecom_summarisation/contributions.png" width="100%" style="background-color: #FCF1EF;"/>


***

A Note on This Series

In my seven years as a Machine Learning Engineer, I've noticed a significant gap between academic tutorials and the realities of production MLOps. Many guides stop at deploying a model in a FastAPI container, leaving aspiring engineers without the strategic frameworks and practical insights needed for building robust, end-to-end systems.

This series is a sincere attempt to provide a practitioner's blueprint for production machine learning, moving beyond the code to explore the critical decision-making, trade-offs, and challenges involved. My goal is to eventually expand this work into a comprehensive, project-based MLOps course.

Important Disclaimers:

- **On Authenticity**: The methodologies and frameworks shared here are drawn directly from my professional experience. However, to ensure client confidentiality, all specific project details and data have been anonymized and are for illustrative purposes only.
- **On Collaboration**: These posts were created with the assistance of AI for code and prose generation. The strategic framing, project context, and real-world insights that guide the content are entirely my own.
- **On the Code**: The code provided is a conceptual blueprint, not a production-ready application. It is designed to illustrate the structure and logic of a real-world system. Please use it as a learning tool and a starting point for your own projects, but do not expect it to run out-of-the-box without further development and testing.

***



### 1. The Business Imperative: From Information Overload to Actionable Intelligence

In the modern e-commerce landscape, the sheer volume of customer-generated reviews presents a dual-sided challenge. While intended to empower shoppers, the deluge of unstructured, often repetitive feedback leads to information overload and decision fatigue. This phenomenon hinders the purchasing journey, contributing directly to higher rates of cart abandonment and a diminished user experience.

For the business, this vast repository of customer sentiment is a potential goldmine of insights. However, manually processing thousands of reviews to identify recurring themes, product shortcomings, and emerging trends is a significant operational bottleneck. The process is labor-intensive, slow, and prone to human error, causing critical customer pain points to go unnoticed and opportunities for product improvement to be missed.

The fundamental business challenge is to effectively distill this massive volume of unstructured text into a format that is both concise for the customer and insightful for the business. The goal is to transform raw feedback from a liability of noise into a strategic asset that enhances customer confidence and drives internal innovation.

#### **Project Objectives and Goals**

The primary objective is to develop and deploy an automated, scalable system that summarizes customer reviews to enhance the user shopping experience and provide actionable intelligence to internal teams.

This objective is broken down into two core goals:

1.  **Enhance the Customer Decision-Making Process:** By providing clear, balanced, and digestible summaries of peer reviews, the system aims to reduce customer friction and build trust. This allows shoppers to make faster, better-informed purchasing decisions, moving from a state of uncertainty to one of confidence.
2.  **Unlock Actionable Business Intelligence:** By automating the analysis of review data, the system will identify and surface key product strengths, weaknesses, and recurring customer issues. This data-driven feedback loop empowers product, marketing, and support teams to improve product quality, refine marketing messages, and enhance brand value.

#### **Measuring Success: Key Performance Indicators (KPIs)**

The success of this initiative will be measured through a rigorous A/B testing framework, focusing on both direct business impact and user engagement.

**Primary Business KPIs:**

*   **Increase in Conversion Rate:** A measurable lift in the percentage of users who purchase a product after interacting with the summary feature.
*   **Reduction in Average Time-to-Purchase:** A decrease in the time it takes for a user to make a purchase, indicating accelerated decision-making.
*   **Decrease in Product Return Rates:** A measurable reduction in returns for products where summaries are displayed, suggesting that the feature sets more accurate customer expectations.

**Secondary Engagement KPIs:**

*   **User Interaction with Summaries:** Tracking metrics such as time spent on the page and expansion of summary sections to gauge feature utility.
*   **"Helpful" Feedback Rate:** An increase in users clicking the "This summary was helpful" button, serving as a direct signal of user satisfaction.


***

### 2. ML Problem Framing: From Business Need to Technical Blueprint

Translating a business objective into a well-defined machine learning task is the most critical step in the MLOps lifecycle. A precise problem frame acts as the foundational blueprint, guiding data strategy, model selection, and success measurement. A flaw at this stage will inevitably propagate through the entire system, regardless of subsequent engineering excellence.

#### 2.1 Setting the Business Objectives

The project originates from a clear business need to improve customer experience and operational efficiency. Before any technical solution is considered, the objectives must be aligned with all relevant stakeholders—including Product Management, Marketing, Engineering, and Business Leadership—to ensure a shared vision of success.

The primary business objectives are:
*   **Increase purchase conversion and customer trust** by providing concise, unbiased summaries of user reviews.
*   **Improve product quality** by creating an automated feedback loop that delivers actionable insights from customer sentiment to product teams.
*   **Enhance operational efficiency** by reducing the manual effort required to analyze and understand large volumes of customer feedback.

#### 2.2 Is Machine Learning the Right Approach?

While a simple rule-based system (e.g., extracting sentences with "love" or "hate") could be a baseline, it would fail to capture the nuance, slang, and context inherent in user-generated reviews. Machine Learning is the appropriate approach for this problem due to several key factors:

*   **Complex Patterns:** Summarizing requires understanding semantic meaning, identifying key themes, and paraphrasing, tasks too complex for static rules.
*   **Need for Scale:** The solution must operate across thousands of products, each with hundreds or thousands of reviews, making manual summarization impossible.
*   **Dynamic Environment:** Customer language, product features, and feedback trends evolve. An ML model can be retrained to adapt, whereas a rule-based system would become brittle.
*   **Tolerance for Error:** While factual accuracy is paramount, minor stylistic imperfections in the generated summary are acceptable if the core meaning is preserved and the feature provides value.

This project also presents a classic opportunity to create a **Data Flywheel**, a virtuous cycle where the product improves as more data is generated.

#### 2.3 Defining the ML Problem

The business goal must be translated into a precise technical task for the model.

*   **Ideal Outcome:** A customer effortlessly understands the collective opinion on a product, leading to a confident purchase decision.
*   **Model's Goal:** Ingest all unstructured review texts for a single product and generate a single, concise, factually grounded, and stylistically neutral summary paragraph.

This formally classifies the task as **many-to-one, multi-document abstractive summarization**.
*   **Many-to-one:** It synthesizes multiple source documents (reviews) into a single output.
*   **Multi-document:** It must handle and reconcile information from numerous distinct text sources.
*   **Abstractive:** The goal is to generate novel, fluent sentences that capture the essence of the input, rather than simply extracting and concatenating existing sentences.

The choice of an abstractive paradigm over an extractive one is deliberate. While an extractive summary (copying key sentences) offers high factual grounding, the informal grammar, slang, and typos common in reviews would result in a disjointed and poor user experience. A purely abstractive approach, however, introduces an unacceptable risk of "hallucination"—generating statements not supported by the source reviews.

Therefore, the optimal solution is a **hybrid approach**, specifically one implemented via a **Retrieval-Augmented Generation (RAG)** architecture. This strategy grounds the abstractive model in retrieved facts, instructing it to generate a summary *based only on* a curated selection of the most relevant review snippets. This balances the need for readability with the non-negotiable requirement for user trust.

#### 2.4 Assessing Feasibility & Risks

A candid assessment of feasibility and potential risks is necessary before committing significant resources.

| Category | Checkpoint | Assessment | Notes & Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Data** | Sufficient quantity & quality? | **Green** | Abundant review data exists. Quality is variable, requiring robust preprocessing to handle spam, short reviews, and noise. |
| | Labeling for fine-tuning feasible? | **Yellow** | Creating high-quality, human-written "golden" summaries for fine-tuning and evaluation is expensive and time-consuming. This will be a primary cost driver. |
| **Problem Difficulty** | High reliability required? | **Red** | **Factual consistency is paramount.** A single prominent hallucination could destroy user trust. The RAG architecture is the primary mitigation strategy. |
| **Adversarial attacks**| Adversarial attacks likely? | **Yellow** | Potential for review bombing or spam. Data ingestion pipelines must include anomaly and spam detection. |
| **Technical Reqs** | Latency target achievable? | **Yellow** | Low latency is critical for user experience. This necessitates using optimized inference engines (e.g., vLLM, TGI) and may constrain the size of the production model. |
| **RoI** | Compute cost manageable? | **Yellow** | GPU resources for fine-tuning and serving are costly. The project requires a clear budget and cost-optimization strategies like quantization and efficient model selection. |
| **Ethics** | Potential for bias? | **Red** | **High risk of bias.** The model could learn a "positivity bias" from imbalanced data or fail to represent minority opinions. Mitigation requires data-centric re-tuning on balanced datasets and specific prompt constraints. |

#### 2.5 Defining Success Metrics

To measure progress and validate the final impact, metrics are defined across three distinct domains: Business, Model Quality, and Operations.

| Metric Type | Success Metric | How to Measure & Target |
| :--- | :--- | :--- |
| **Business** | **Conversion Rate** | A/B Testing. Target: Statistically significant lift in purchases for users shown the summary vs. a control group. |
| | **Product Return Rate** | A/B Testing. Target: Statistically significant decrease in returns for products with summaries. |
| | **Average Time-to-Purchase** | A/B Testing. Target: Measurable reduction in the session duration leading to a purchase. |
| **Model Quality**| **Faithfulness / Factual Consistency** | **(Primary)** LLM-as-a-judge or automated metrics (e.g., SummaC) on a golden dataset. Target: Aim for >95% factual consistency. |
| | **Relevance** | ROUGE-L score against reference summaries and human evaluation. Target: Optimize for capturing key pros and cons. |
| | **Coherence & Fluency** | Human evaluation or LLM-as-a-judge (Likert scale 1-5). Target: Average score > 4.0. |
| **Operational**| **P95 Inference Latency** | Monitoring dashboards (e.g., Prometheus, Grafana). Target: < 500ms for a real-time user experience. |
| | **Cost Per 1,000 Summaries** | Cloud billing analysis. Target: Continuously optimize and reduce cost based on model and hardware choices. |
| | **System Throughput** | Load testing and monitoring. Target: System must handle peak traffic loads without violating latency SLAs. |


___

### 3. GenAI Application: End to end planning

#### 3.1 LLMOps Tech Stack


| Category | Canvas Block | Tool / Service Chosen | Rationale, LLM-Specific Considerations & Trade-offs |
| :--- | :--- | :--- | :--- |
| **Data & Code** | Data Sources & Versioning | **Amazon S3** (Data Lake)<br>**DVC** (Data Version Control) | **Rationale:** S3 is the scalable foundation. DVC versions datasets and human-curated evaluation sets, linking them to Git commits for full reproducibility. |
| **Experimentation** | Experiment Management | **Amazon SageMaker Studio** (Notebooks)<br>**LangChain** (App Framework)<br>**LangSmith** (Debugging/Tracing) | **Rationale:** We use **LangChain** to rapidly prototype the RAG logic. **LangSmith** is indispensable for debugging these chains by visualizing the retrieved context and prompts. This combination accelerates development. |
| **Feature Engineering** | Feature Store & Workflows | **Amazon OpenSearch with k-NN** (Vector DB)<br>**Amazon MWAA (Airflow)** (Orchestration)| **Rationale:** The **Vector Database is the new Feature Store** for LLMs. OpenSearch provides the managed retrieval backend. Airflow orchestrates the batch workflow that populates the vector DB. |
| **ML Lifecycle** | Model & Experiment Tracking | **MLflow Tracking Server** | **Rationale:** MLflow remains the central server of record. It logs experiment results, including the final evaluation scores generated by Ragas. It provides the high-level audit trail of what was tried and what worked. |
| | **LLM Quality & Evaluation** | **Ragas** (RAG Evaluation)<br>**Giskard** (Behavioral Testing) | **Rationale:** This is the critical, missing piece. **Ragas** is used to score our summaries on RAG-specific metrics (faithfulness, context precision). **Giskard** is used to create a suite of "unit tests" for the LLM's behavior (e.g., robustness to typos, bias checks). |
| | Continuous Training (CT) | **Amazon SageMaker Training Jobs** | **Rationale:** SageMaker provides the managed, scalable GPU infrastructure needed for LoRA fine-tuning without the overhead of managing a cluster manually. |
| **Production** | Model Registry & Versioning | **MLflow Model Registry** | **Rationale:** **This is the core governance component.** A "model version" in MLflow includes the LoRA weights, the specific LangChain prompt template, and the base model ID. Promoting a model from Staging to Production in this registry is the official, auditable act that triggers deployment. |
| | Model Deployment & Serving| **vLLM/TGI on Amazon EKS**<br>**Amazon API Gateway** | **Rationale:** Specialized LLM serving engines are non-negotiable for performance. EKS provides the necessary control. The inference service itself will use the **LangChain** library to execute the RAG logic at runtime. |
| | Monitoring & Observability | **Amazon CloudWatch, Prometheus** (System)<br>**Custom Evaluation Pipeline** (Model Quality) | **Rationale:** Standard tools for system health. For model quality, a custom pipeline is triggered periodically. It samples production requests/responses, runs them through the **Ragas/Giskard** evaluation suite, and logs the quality scores. Alerts are triggered on significant quality degradation (e.g., a drop in faithfulness). |
| **Foundation** | DevOps & Foundations | **Git (GitHub)**<br>**Docker**<br>**AWS CDK / Terraform** (IaC)<br>**GitHub Actions** (CI/CD) | **Rationale:** Foundational tools for software and infrastructure best practices. GitHub Actions automates testing and the deployment process, which is kicked off by a model promotion event in the MLflow Registry. |



#### 3.2 Key Pipelines and Workflows

The system's automation is realized through a set of interconnected pipelines. Each pipeline is a directed acyclic graph (DAG) of tasks responsible for a specific stage of the data and model lifecycle.

| Pipeline / Workflow | Trigger | Inputs | Key Steps | Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **1. Data Ingestion & Validation** | Real-time events from user devices and backend services. | - Raw review JSON objects.<br>- Clickstream events (e.g., "helpful" clicks). | 1. **Receive:** Data streams into a message queue (e.g., Kinesis/Kafka).<br>2. **Validate Structure:** Check for schema conformance (correct fields and types).<br>3. **Validate Semantics:** Pass text through a lightweight model to check for intelligibility and filter out obvious spam/garbled content.<br>4. **Persist:** Load validated raw data into the S3 Data Lake. | - Clean, validated review data in the S3 Data Lake.<br>- Dead-letter queue for failed records. |
| **2. Embedding Generation (Feature Engineering)**| A new validated review is added to the S3 Data Lake. | - A single, validated customer review text.<br>- `product_id`, `review_id`. | 1. **Chunk:** Split the review text into semantically meaningful segments (e.g., sentences or small paragraphs).<br>2. **Embed:** Call a pre-trained embedding model (e.g., `amazon.titan-embed-text-v1`) for each chunk.<br>3. **Index:** Store the resulting embedding vectors and associated metadata (`product_id`, `review_id`, original text chunk) in the Vector Database (Amazon OpenSearch). | - Indexed, searchable review embeddings in the Vector Database. |
| **3. Continuous Training (CT)** | - **Scheduled:** e.g., monthly.<br>- **On-demand:** Triggered by a significant model quality degradation alert. | - A high-quality, curated dataset of reviews and human-annotated summaries from the S3 Data Lake.<br>- Base model ID (e.g., `mistral.mistral-7b-instruct-v0:2`). | 1. **Provision:** Spin up a GPU cluster using a SageMaker Training Job.<br>2. **Fine-tune:** Execute a Parameter-Efficient Fine-Tuning (PEFT) script using the LoRA technique.<br>3. **Artifact Creation:** Package the resulting LoRA adapter weights and the associated prompt template. | - A new candidate model artifact (LoRA adapter + config) stored in S3. |
| **4. Model Evaluation & Registration** | Successful completion of a Continuous Training job. | - Candidate model artifact.<br>- "Golden" evaluation dataset (versioned with DVC). | 1. **Load:** Load the candidate model for inference.<br>2. **Generate:** Create summaries for the entire evaluation dataset.<br>3. **Score:** Evaluate the generated summaries using a specialized framework (e.g., Ragas) for faithfulness, relevance, etc.<br>4. **Compare:** Compare the new model's scores against the currently deployed production model.<br>5. **Register:** If the new model shows a statistically significant improvement, version and register it in the MLflow Model Registry. | - A go/no-go decision for deployment.<br>- (If successful) A new, versioned model in the MLflow Model Registry, promoted to "Staging". |
| **5. CI/CD for Deployment** | A model is promoted to the "Production" stage in the MLflow Model Registry. | - The approved model artifact from the MLflow Registry. | 1. **Package:** GitHub Actions builds a new Docker container including the inference server (vLLM/TGI) and the model artifacts.<br>2. **Test:** Run integration and smoke tests.<br>3. **Deploy:** Orchestrate a safe, phased rollout (e.g., Canary) to the Amazon EKS serving environment. | - A new version of the inference service running in production, serving a small percentage of live traffic. |
| **6. Batch Inference** | **Scheduled:** Runs every hour. | - List of `product_ids` that have received new reviews in the last hour. | 1. **Retrieve:** For each product, query the Vector Database to get the most relevant review snippets.<br>2. **Invoke:** Call the production LLM serving endpoint to generate a summary.<br>3. **Cache:** Store the generated summary in the low-latency database (DynamoDB) with a TTL. | - Freshly computed summaries available in the low-latency cache for fast retrieval. |
<!--
| **7. Real-Time Inference** | An API call from the application for a product whose summary is **not** in the low-latency cache. | - A single `product_id`. | 1. **Retrieve:** Query the Vector Database to get the most relevant review snippets.<br>2. **Invoke:** Call the production LLM serving endpoint to generate a summary.<br>3. **Respond & Cache:** Return the summary to the user and simultaneously write it to the low-latency cache. | - A JSON summary response returned to the user (SLO: P95 < 500ms).<br>- A new entry in the low-latency cache. |
-->



#### 3.3 Why RAG for Reviews Summarization ?

Let me clarify why, even without a direct user query and in a purely batch context, the RAG pattern (using embeddings and a Vector DB) is still the superior production architecture for this specific application. The reason is not about enabling real-time, but about **quality, control, and cost-efficiency at scale.**

Let's compare the two approaches:

##### Approach 1: Recursive Summarization

1.  For a product with 500 reviews, group them into chunks that fit the LLM context window.
2.  Send each chunk to the LLM to get an intermediate summary.
3.  Take all the intermediate summaries, and if there are still too many, repeat the process.
4.  Finally, send the last set of summaries to the LLM for a final summary.

This seems straightforward, but it suffers from several critical production-level flaws:

*   **1. The "Lost in the Middle" Problem:** LLMs have a known weakness with very long contexts. Information presented at the beginning and end of a prompt is recalled much more effectively than information buried in the middle. In a recursive process, critical details from an early review (e.g., a specific safety concern or a major product flaw) are highly likely to be averaged out and lost in the initial summarization pass. The final summary will then be based on "washed out" intermediate texts, making it generic and potentially misleading.

*   **2. Lack of Control and Bias Amplification:** This approach is a black box. You cannot control *what* the LLM focuses on. If a product has 450 generic positive reviews ("Great product!") and 50 highly detailed, recent negative reviews ("The battery dies in 2 hours"), the recursive approach will almost certainly produce a generic, positive summary. The negative signal will be drowned out. This leads directly to the "helpful hallucination" crisis we aim to avoid, where the summary does not reflect the most critical user feedback.

*   **3. Inability to Prioritize High-Signal Reviews:** Not all reviews are created equal. A "Verified Purchase" review marked as "helpful" by 100 users is far more valuable than a one-word, anonymous review. The recursive approach treats all text as equal, giving the same weight to low-quality and high-quality feedback.

*   **4. High Computational Cost:** This approach can be deceptively expensive. For a product with reviews requiring 10 chunks, this strategy involves **11 separate LLM calls**. At scale, across thousands of products, this becomes computationally inefficient and costly.


##### Approach 2: RAG for Batch Summarization (The Recommended Architecture)

Here, we reframe the purpose of RAG. The "query" is not from an end-user; it's an **automated, internal query that represents a business logic or a summarization strategy.**

1.  **One-time (cheap) cost:** As new reviews come in, they are chunked, embedded, and stored in the Vector DB. This is a fast, inexpensive background process.
2.  **Batch Inference (with RAG):** When the nightly batch job runs for a product, it does not fetch all reviews. Instead, it executes an *automated query* against the Vector DB. This query is our point of control. For example:
    *   *"For product 123, retrieve: a) the 5 most helpful positive review snippets, b) the 5 most helpful negative review snippets, and c) the 5 most recent review snippets."*
3.  **Controlled Context:** The retrieved snippets—a small, curated, and highly relevant set of texts—are then assembled into a compact context.
4.  **Single, High-Quality LLM Call:** This balanced and signal-rich context is passed to the LLM in a **single call** with a prompt like, "Based *only* on these reviews, summarize the pros, cons, and most recent feedback."

**Why this is Superior for a Production System:**

*   **1. Full Control over Content:** This architecture allows us to *programmatically enforce a balanced summary*. We can guarantee that the most critical negative feedback is included, preventing bias and building user trust.
*   **2. Prioritization of High-Signal Data:** We can use the metadata in our Vector DB (helpfulness scores, verified purchase status) to ensure the LLM sees the *most important* reviews, not just a random assortment.
*   **3. Mitigates the "Lost in the Middle" Problem:** By feeding the LLM a much smaller, more salient context, we ensure it can effectively process all the provided information.
*   **4. Cost-Effective and Scalable:** This approach involves **only one LLM call per product** during the batch job, making it significantly cheaper and faster at scale than the 11 calls required by the recursive method. The upfront cost of embedding is minimal in comparison.
*   **5. Future-Proofing:** This architecture—a Vector DB of all review content—becomes a strategic asset. It can later be used for other features like semantic search ("find me laptops with a great keyboard") with no extra work.

The RAG pattern (Embeddings + Vector DB) should be retained as the core of the **batch inference workflow**. Its primary benefit here is not real-time speed, but **unmatched control over summary quality, bias, and cost-efficiency**. It transforms the summarization task from a black-box text-stuffing exercise into a deliberate, controllable, and production-ready engineering process.

___


#### 3.3 Project Management and Stages

This project will follow an iterative, stage-based approach. Each stage has a distinct focus and set of outcomes, allowing for structured progress and regular checkpoints to validate assumptions and de-risk the project.

| Stage | Key Activities | Primary Outcome |
| :--- | :--- | :--- |
| **1. Ideation & Planning** | - Finalize business objectives and KPIs.<br>- Conduct feasibility study and risk assessment.<br>- Define the ML problem (Batch Abstractive Summarization via RAG).<br>- Select and document the core tech stack (as detailed in 3.1 & 3.2).<br>- Develop an initial project plan and timeline. | A clear, documented project charter that aligns all stakeholders on the goals, scope, and technical approach. |
| **2. Model Experimentation**| - Establish baseline performance using a simple, non-LLM heuristic.<br>- **Prompt Engineering:** Meticulously craft and test various prompt templates.<br>- **RAG Strategy Evaluation:** Experiment with different retrieval strategies (e.g., balancing positive/negative/recent reviews).<br>- **Model Selection:** Compare performance of different open-source base models (e.g., Llama 3, Mistral, Gemma).<br>- **Fine-Tuning (PEFT):** Conduct LoRA fine-tuning on a curated dataset to improve domain-specific quality.<br>- **Evaluation:** Use LangSmith for debugging and Ragas for quantitative scoring of all experiments. | The selection of the optimal combination of base model, LoRA adapter, prompt template, and RAG strategy that meets the predefined quality metrics, ready for productionizing. |
| **3. Pipeline Development** | - **Data Pipelines:** Build the Airflow DAGs for data ingestion, validation, and batch embedding generation.<br>- **Continuous Training (CT) Pipeline:** Automate the fine-tuning and evaluation process.<br>- **Batch Inference Pipeline:** Build the core workflow that orchestrates the RAG-based summary generation and caching. | A suite of automated, version-controlled pipelines that manage the entire data and model lifecycle from ingestion to inference. |
| **4. Deployment & Serving** | - **Infrastructure as Code (IaC):** Define the serving infrastructure (EKS cluster, node groups) using Terraform.<br>- **CI/CD Pipeline:** Create the GitHub Actions workflow to containerize and deploy the inference service.<br>- **Serving Endpoint:** Deploy the optimized inference engine (vLLM/TGI) with the selected model. | A scalable, production-ready inference endpoint that can serve summaries based on the batch pipeline's logic. |
| **5. Monitoring & In-Production Testing**| - **Set up Dashboards:** Configure Grafana/CloudWatch for system and operational metrics.<br>- **Implement Quality Monitoring:** Deploy the custom pipeline to sample and evaluate production summaries against quality metrics (e.g., faithfulness).<br>- **Set up Alerting:** Configure alerts for system failures, latency spikes, and model quality degradation.<br>- **A/B Testing:** Once stable, design and run an A/B test to measure the impact on the primary business KPIs. | A fully observable system with automated monitoring and alerting, providing the data needed to ensure reliability and validate business impact. |

___


#### 3.4 Cross-Functional Team & Roles

For this project, we operated as a small, agile, cross-functional team. Clear role definition was crucial for efficiency and accountability.

| Role | Primary Responsibilities | Key Artifacts & Deliverables |
| :--- | :--- | :--- |
| **Product Manager** | - Defines the business vision, requirements, and success KPIs.<br>- Manages the project roadmap and prioritizes work.<br>- Acts as the voice of the customer and internal business stakeholders. | - Product Requirements Document (PRD).<br>- A/B Test plan and success criteria.<br>- Go-to-market and stakeholder communication plan. |
| **Data Engineer** | - Owns the data sourcing, ingestion, and validation pipelines.<br>- Manages the Data Lake (S3) and the Vector Database (OpenSearch).<br>- Builds and maintains the Airflow DAGs for populating the Vector DB. | - Deployed and monitored data ingestion pipelines.<br>- A populated, up-to-date Vector Database.<br>- Data quality dashboards and alerts. |
| **ML/MLOps Engineer<br>(My Role)** | - Leads all model experimentation and evaluation.<br>- Owns the Continuous Training (CT) and Batch Inference pipelines.<br>- Develops the inference service application (using LangChain).<br>- Manages the CI/CD process for model deployment.<br>- Owns the model monitoring and alerting strategy. | - MLflow experiments and model artifacts in the Registry.<br>- Deployed CT and Batch Inference pipelines.<br>- Production inference service on EKS.<br>- Model quality monitoring dashboards. |

___


#### 3.5 Versioning and Governance Strategy

To ensure reproducibility, auditability, and stability, a "version everything" philosophy is adopted. This creates a complete lineage from the raw data to the final summary served to a user.

| Artifact | Tool for Versioning | Rationale & LLM-Specific Notes |
| :--- | :--- | :--- |
| **Code** | **Git (GitHub)** | The single source of truth for all application code, pipeline definitions (DAGs), and infrastructure-as-code scripts. |
| **Data** | **DVC** | Used specifically for versioning the critical, human-curated "golden" datasets used for evaluation. This ensures that when we compare model v1.1 to v1.2, we know they were tested against the exact same data. |
| **Prompts** | **Git (in a config file)** | **Prompts are treated as code.** A change to the prompt template is a critical change to the model's behavior. Prompts are versioned in Git and loaded by the application at runtime. A new prompt version can trigger a new model registration. |
| **Model** | **MLflow Model Registry** | The central governance hub. A "model" version in the registry is a composite artifact that bundles: <br>1. The LoRA adapter weights.<br>2. A pointer to the base model (e.g., `mistral-7b-v0.2`).<br>3. The version of the prompt template to be used.<br>4. The inference configuration. |
| **Infrastructure**| **Terraform / AWS CDK** | The entire cloud infrastructure (EKS clusters, S3 buckets, IAM roles) is defined as code and versioned in Git, enabling disaster recovery and preventing manual configuration drift. |

___

#### 3.6 Comprehensive Evaluation Strategy

Testing an LLM-powered application requires a multi-layered approach that moves far beyond traditional software QA. The strategy must validate not only the code and infrastructure but also the quality of the data, the nuances of the model's learned behavior, and the integrity of the end-to-end generation process. This "crucible" ensures that what we build is reliable, fair, and trustworthy.

The following table outlines the four core pillars of our testing strategy, detailing *what* we test, *why* it's critical for an LLM system, *how* we'll implement it, and *when* in the lifecycle it occurs.

| Test Category | Specific Test | Purpose & LLM-Specific Focus | Tools / Method | Stage / Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **1. Data & Prompt Quality Testing** (The Foundation) | **Input Schema & Value Validation** | **Purpose:** Ensure the structural integrity of incoming review data. <br> **LLM Focus:** Prevent "Garbage In, Garbage Out." A malformed review text can lead to nonsensical embeddings and poor summaries. | Great Expectations | During the data ingestion pipeline (CI/CD) |
| | **PII & Toxicity Screening (Inputs)** | **Purpose:** Identify and redact Personally Identifiable Information (PII) and filter out toxic content *before* it ever reaches the LLM. <br> **LLM Focus:** A critical data privacy and safety guardrail. | Custom regex, open-source libraries (e.g., `presidio`), or a lightweight classification model. | During the data ingestion pipeline (CI/CD) |
| | **Prompt Template Unit Tests** | **Purpose:** Validate that the prompt formatting logic is correct. <br> **LLM Focus:** Treating the prompt as code. A bug in the prompt templating can break the entire system. | `pytest` with mocked review snippets. | On code commit (CI) |
| **2. Offline Model & Application Logic Evaluation** (The Quality Gate) | **Behavioral "Unit" Tests** | **Purpose:** Test for basic, expected model behaviors on simple inputs. <br> **LLM Focus:** Invariance (paraphrasing a review shouldn't drastically change the summary); Directionality (adding a strong negative fact should make the summary sentiment more negative). | `Giskard` or custom `pytest` scripts. | On code commit, and within the model evaluation pipeline (CI/CD). |
| | **RAG-Specific Evaluation** | **Purpose:** Quantitatively measure the quality of the Retrieval-Augmented Generation process. <br> **LLM Focus:** This is the core of our quality assessment. We measure: <br> • **Faithfulness:** Does the summary contain "hallucinations" or is it factually grounded in the retrieved reviews? <br> • **Context Precision:** Are the retrieved review snippets relevant to the final summary? | `Ragas` framework. | Within the automated model evaluation pipeline after every training run (CD). |
| | **Holistic Quality Evaluation** | **Purpose:** Assess the overall readability and usefulness of the summary. <br> **LLM Focus:** Measure human-like qualities: **Coherence** (is it logical?), **Conciseness** (is it to the point?), and **Fluency** (is it well-written?). | **LLM-as-a-judge:** Using a powerful model (e.g., GPT-4o) with a detailed rubric to score the summaries on a Likert scale. | Within the model evaluation pipeline (CD). |
| | **Safety & Bias Evaluation** | **Purpose:** Ensure the generated summaries are not toxic, biased, or unfair. <br> **LLM Focus:** We run slice-based evaluation, specifically testing performance on products with highly polarized reviews to ensure both positive and negative viewpoints are represented fairly. | Custom evaluation scripts and toxicity classifiers (e.g., Detoxify). | Within the model evaluation pipeline (CD). |
| **3. Pipeline & Infrastructure Testing** | **Component Integration Tests** | **Purpose:** Verify that the different components of the application logic work together. <br> **LLM Focus:** Test the full RAG flow: mock the Vector DB -> test the retrieval logic -> verify correct prompt construction -> mock the LLM call. | `pytest` with mocked services (`unittest.mock`). | On code commit (CI). |
| | **Batch Inference Pipeline E2E Test** | **Purpose:** Run the entire batch inference pipeline on a small, representative sample of data in a staging environment. <br> **LLM Focus:** Ensures the orchestration, RAG process, and caching mechanism work end-to-end. | Airflow DAG testing triggered via GitHub Actions. | Before deploying changes to production (CD). |
| | **Serving Endpoint Load Test** | **Purpose:** Ensure the deployed model serving endpoint can handle the expected load for the batch pipeline. <br> **LLM Focus:** Measure key performance metrics like **tokens/second throughput** and latency under load to validate cost-effectiveness and scaling. | `Locust`. | Before deploying new model versions to production (CD). |
| **4. In-Production Evaluation** (The Final Verdict) | **Shadow Deployment Comparison** | **Purpose:** Safely compare a new "challenger" model against the current "champion" model using live data without impacting users. <br> **LLM Focus:** The nightly batch job runs for *both* models. The generated summaries are stored separately and compared offline using our Ragas/LLM-as-a-judge pipeline to provide the highest-fidelity signal of real-world performance. | Custom comparison script within the batch inference pipeline. | Ongoing for any new model candidate. |
| | **Automated Quality Monitoring** | **Purpose:** Continuously monitor the quality of summaries being produced by the live model. <br> **LLM Focus:** A scheduled pipeline periodically samples the latest generated summaries and runs them through the Ragas/LLM-as-a-judge evaluation suite. Alerts are triggered if key metrics like **Faithfulness** drop below a predefined threshold. | Custom Airflow DAG. | Scheduled (e.g., daily). |
| | **A/B Testing** | **Purpose:** To definitively measure the business impact of a new model or major system change. <br> **LLM Focus:** Even with a batch system, we can run A/B tests by showing a subset of users summaries generated by the challenger model. We then measure the impact on our primary business KPIs (Conversion Rate, Return Rate). | A/B Testing Platform (e.g., Optimizely, or in-house). | After a new model has passed all other tests and is deemed stable and safe for production traffic. |

___

<!--
### 4. Data Sourcing, Discovery, and Exploratory Data Analysis

A successful ML system is built upon a deep understanding of its foundational data. Before any models are trained or pipelines are built, we must first discover and characterize the data sources, their scale, and their inherent qualities. This exploratory phase informs everything from data cleaning strategies to architectural choices.

#### 4.1 Data Characteristics

The following table provides an estimated profile of the primary data sources for this project, tailored to a mid-sized European marketplace.

| Data Source / Type | Description | Estimated Volume, Velocity & Profile |
| :--- | :--- | :--- |
| **Product Catalog Data** | Static or slowly changing data about the products sold on the marketplace, including SKUs, categories, descriptions, and vendor information. | **Volume:** ~75,000 active SKUs across ~15-20 main categories (e.g., Electronics, Fashion, Home & Kitchen).<br>**Velocity:** Low. ~500 - 1,000 new products added per month. |
| **Historical Customer Reviews** | The existing corpus of all customer reviews collected to date. This forms the primary dataset for our summarization task. | **Volume:** ~4 million total reviews. The distribution is highly skewed; a few popular products may have 5,000+ reviews, while most have <50.<br>**Storage Footprint:** ~1-2 GB of raw text data. |
| **New Customer Reviews (Velocity)** | The stream of new reviews being submitted by customers daily. This data must be ingested to keep summaries fresh. | **Velocity:** ~1,000 - 2,000 new reviews per day.<br>**Profile:** Follows a J-curve distribution: ~60% 5-star, ~15% 4-star, with a long tail of 1-3 star reviews. |
| **Review Content Profile** | The qualitative nature of the review text itself. | **Length:** Average of ~45 words per review, but with significant variance. ~5% are very short (<5 words), and ~5% are very long (>200 words).<br>**Language:** Multilingual. Primarily English, German, and French, with smaller volumes in Spanish, Italian, and Dutch. Many non-native English speakers contribute, leading to grammatical variations. |
| **User Interaction Data (Clickstream)** | High-velocity event data tracking user behavior, such as page views, clicks on review sections, and interactions with the "helpful" button. | **Velocity:** High. For a site with ~250,000 Daily Active Users (DAU), this stream can generate **~5 - 10 million events per day**. |
| **User/Customer Data** | Information about registered users, including purchase history and basic demographic data (country, language preference). | **Volume:** Tied to the customer base. Data is used to enrich interaction data (e.g., linking a "helpful" click to a "verified purchaser"). |

#### **Key Takeaways & Implications for the Project:**

*   **Multilingual Requirement:** The presence of multiple languages is a core challenge. The chosen LLM and embedding models **must** have strong multilingual capabilities.
*   **Need for Robust Preprocessing:** The wide variance in review length and the presence of very short "noise" reviews necessitates a robust filtering and cleaning step in our data ingestion pipeline.
*   **Imbalanced Star Ratings:** The high percentage of 5-star reviews confirms the risk of generating overly positive summaries. Our RAG retrieval strategy *must* be explicitly designed to counteract this by intentionally sampling from negative reviews.
*   **High-Velocity Clickstream:** The volume of interaction data validates the decision to use a dedicated, scalable streaming pipeline (e.g., Kinesis/Kafka) to capture this information without overwhelming the main application servers. This data is critical for determining which reviews are "helpful" and should be prioritized in summaries.
-->

***

### 5. Data Engineering & Pipelines: The Foundation for Summarization

The quality of our automated summaries is directly proportional to the quality of the data we feed our model. The following pipelines are designed to be automated, reliable, and auditable, forming the data backbone of the entire system.

We need to transform raw, multilingual reviews into a clean, indexed, and searchable knowledge base (the Vector DB) that our RAG-based summarization model can query efficiently during the batch inference job.To achieve this in a modular and robust way, we will design **two distinct but interconnected data pipelines**, orchestrated by Airflow. This separation of concerns is a critical design choice for maintainability and scalability.

1.  **Pipeline 1: Data Ingestion & Cleaning:** Its sole responsibility is to process raw reviews and produce a clean, validated, and versioned dataset in our S3 Data Lake.
2.  **Pipeline 2: Embedding Generation:** This downstream pipeline listens for new, clean data from Pipeline 1 and is responsible for creating and indexing the vector embeddings required for RAG.

Here is the detailed plan for each pipeline.


#### **Pipeline 1: Daily Data Ingestion & Cleaning**
*   **Objective:** To ingest all new reviews from the past 24 hours, clean them, validate their quality, and store them as a versioned dataset in the S3 Data Lake.
*   **Orchestrator:** Amazon MWAA (Airflow)
*   **Schedule:** Runs once every 24 hours.

| Stage | Operation Details | Tools | Rationale & LLM-Specific Focus |
| :--- | :--- | :--- | :--- |
| **1. Ingestion** | **Extract New Reviews:** Fetch new customer reviews from the source database (e.g., based on a `created_at` timestamp). | `psycopg2`, custom Python scripts. | Initial step to gather the daily delta of reviews to be processed. |
| **2. Preprocessing & Cleaning** | **HTML & Special Character Removal:** Strip out any HTML tags, URLs, and non-standard characters from the review text. <br> **Text Normalization:** Lowercase text, normalize whitespace. | `BeautifulSoup`, `regex`, `pandas`. | This creates a uniform text format, which is crucial for the consistency of both embedding models and the summarization LLM. |
| **3. Safety & Privacy** | **PII Redaction:** Scan review text for Personally Identifiable Information (email addresses, phone numbers) and redact it. <br> **Toxicity Filtering:** Score reviews for toxicity. Flag or filter out highly toxic content to prevent it from being used in summaries. | `presidio` (for PII), `detoxify` or similar library (for toxicity). | **Crucial LLM Guardrail:** We must ensure that sensitive customer data or toxic language is never passed to the LLM or inadvertently included in a generated summary. |
| **4. Filtering & Sampling** | **Filter "Noise" Reviews:** Remove reviews that are too short to be useful (e.g., < 5 words) or identified as spam. | `pandas`. | Improves the signal-to-noise ratio of our dataset. There is no value in summarizing or embedding reviews like "ok" or "good." |
| **5. Schema & Metadata Extraction** | **Structure Data:** Format the cleaned data into a defined schema (`review_id`, `product_id`, `star_rating`, `cleaned_text`, `language`, `toxicity_score`).<br> **Language Detection:** Identify the language of each review. | `langdetect`, `pandas`. | The detected language is critical metadata. It allows for potential language-specific RAG strategies and helps in debugging model performance on different languages. |
| **6. Data Validation** | **Validate Cleaned Data:** Run a Great Expectations suite on the processed data frame to check: <br> • `review_id` is unique and not null. <br> • `star_rating` is between 1 and 5. <br> • `cleaned_text` is a string. <br> • `language` is in the set of expected languages. | Great Expectations | This is an automated quality gate. If the daily batch of cleaned data fails validation, the pipeline stops, and an alert is sent, preventing corrupted data from entering the S3 Lake and the Vector DB. |
| **7. Versioning & Storage** | **Store & Version Data:** Save the final, validated dataset as a Parquet file in the S3 Data Lake. Use DVC to version this dataset and commit the `.dvc` file to Git. | `pyarrow`, `DVC`, `Git`. | This creates an immutable, auditable history of our training data. We can always trace a model's behavior back to the exact version of the data it was trained or evaluated on. |

##### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_ingestion.png" width="100%" style="background-color: #FCF1EF;"/>


#### **Pipeline 2: Embedding Generation**
*   **Objective:** To take newly cleaned reviews, generate vector embeddings for them, and index them in the Vector Database for retrieval during the batch summarization job.
*   **Orchestrator:** Amazon MWAA (Airflow)
*   **Trigger:** Runs upon the successful completion of "Pipeline 1: Data Ingestion & Cleaning."

| Stage | Operation Details | Tools | Rationale & LLM-Specific Focus |
| :--- | :--- | :--- | :--- |
| **1. Data Retrieval** | **Load Cleaned Data:** Retrieve the latest versioned dataset of cleaned reviews from the S3 Data Lake. | `DVC API`, `pandas`. | Ensures this pipeline always works on the most recent, validated data. |
| **2. Text Chunking** | **Split Reviews into Segments:** For each review, split the `cleaned_text` into smaller, semantically coherent chunks (e.g., sentences or groups of sentences, max 256 tokens). | LangChain (`RecursiveCharacterTextSplitter`). | **Core RAG Requirement:** We embed chunks, not entire reviews. This provides more granular retrieval, allowing the RAG system to find the *exact sentences* that are most relevant, rather than an entire, potentially long review. |
| **3. Embedding** | **Generate Vector Embeddings:** For each text chunk, call a pre-trained, multilingual embedding model to generate a high-dimensional vector representation. | Amazon Bedrock (`amazon.titan-embed-text-v2`), `boto3`. | This is the heart of the "feature engineering" for our LLM. The embeddings capture the semantic meaning of the text, enabling the similarity search that powers our RAG strategy. |
| **4. Indexing** | **Store in Vector DB:** Ingest the embeddings into the Vector Database, along with their associated metadata (the original text chunk, `review_id`, `product_id`, `star_rating`, `language`). | `opensearch-py`. | This makes the review data searchable based on semantic meaning. The rich metadata allows our batch inference job to execute sophisticated retrieval logic (e.g., "find helpful negative reviews for product X"). |

##### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_embeddings.png" width="100%" style="background-color: #FCF1EF;"/>

___


### 6. Feature Engineering: From Hand-Crafted Features to Semantic Vectors

In traditional machine learning, feature engineering is often a laborious process of manually creating signals from raw data (e.g., TF-IDF scores, n-gram counts, sentiment analysis). In the modern LLM era, this paradigm has fundamentally shifted. The primary and most powerful feature is the **semantic meaning of the text itself**, captured through high-dimensional vector embeddings.

For this project, our feature engineering strategy is not about creating dozens of columns in a table. Instead, it's about creating a rich, searchable knowledge base.

#### 6.1 The "Features" for our RAG System

Our system relies on two types of features, which are generated by our data pipelines and stored together in our Vector Database.

| Feature Type | Description | Generation Process | Role in the System |
| :--- | :--- | :--- | :--- |
| **Primary Feature: <br> Semantic Embeddings** | High-dimensional vectors (e.g., 1024 dimensions) that represent the semantic meaning of a chunk of review text. Words and sentences with similar meanings will have vectors that are close to each other in the vector space. | Generated by passing text chunks through a pre-trained, multilingual embedding model (e.g., Amazon Titan) during the **Embedding Generation Pipeline**. | **The Engine of Retrieval.** These embeddings allow us to perform a similarity search to find the most relevant review snippets for the summarization task. |
| **Secondary Features: <br> Retrieval Metadata** | Standard data attributes that are stored alongside each embedding vector. This includes `star_rating`, `language`, `review_date`, a calculated `helpfulness_score` (from clickstream data), and a `is_verified_purchase` flag. | Extracted or calculated during the **Data Ingestion & Cleaning Pipeline**. | **The Brain of Retrieval.** This metadata is not passed to the LLM directly but is used by our *retrieval logic* to filter and rank the results of the semantic search. It allows us to ask sophisticated internal questions like, *"Find me the most helpful, 5-star, verified purchase reviews written in German in the last 90 days."* |

#### 6.2 The Vector Database: The New Feature Store

In this LLM-powered, RAG-based architecture, the **Vector Database (Amazon OpenSearch) serves as our de facto Feature Store**.

*   **Traditional Feature Store:** Stores versioned, tabular features (e.g., `user_7_day_purchase_count`) for training and low-latency serving.
*   **Our "Feature Store":** Stores versioned vector embeddings (the primary feature) and their associated metadata (the secondary features). It is optimized for the core operation we need: efficient, low-latency similarity search and metadata filtering.

By completing the Data Ingestion and Embedding Generation pipelines, we have effectively built our feature engineering process and populated our feature store.

---

<!--

### 7. Model Development & Iteration: The Path to a Production-Ready Summarizer

The goal of this phase is not to simply pick a model, but to systematically identify the most effective and efficient solution that balances performance, cost, and operational control. This requires a structured series of experiments, starting with simple baselines and progressively incorporating more sophisticated techniques.

#### 7.1 Phase 0: Aligning on Evaluation Metrics

Before the first experiment, we established a non-negotiable evaluation framework to objectively measure the quality of every generated summary. This framework combines automated metrics with LLM-as-a-judge for qualitative assessment.

| Metric | Tool/Method | What It Measures |
| :--- | :--- | :--- |
| **Faithfulness** | **Ragas** | **Factual Grounding.** Does the summary contain fabricated information ("hallucinations"), or is every statement directly supported by the provided reviews? (Scale 0-1, higher is better) |
| **Context Precision** | **Ragas** | **Relevance of Retrieval.** In our RAG system, are the retrieved review snippets actually relevant and used in the final summary? (Scale 0-1, higher is better) |
| **Coherence** | **LLM-as-judge (GPT-4)**| **Logical Flow.** Is the summary well-structured and easy to understand? Does it present a logical argument? (Scale 1-5, higher is better) |
| **Conciseness** | **LLM-as-judge (GPT-4)**| **Brevity & Information Density.** Does the summary get straight to the point without unnecessary filler words? (Scale 1-5, higher is better) |

#### 7.2 The Experimentation Log

The following table documents our iterative journey, capturing the hypothesis, method, results, and decision at each step.

| Exp. # | Hypothesis | Model & Method | Key Results | Decision & Next Steps |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Establish a non-ML baseline to quantify the value of an LLM approach. | **Heuristic Baseline:** Extract the top 3 longest sentences from 5-star reviews and the top 3 longest from 1-star reviews. Concatenate them. | **Faithfulness:** N/A <br> **Coherence:** 1.5/5 | **Result:** The output is disjointed, often ungrammatical, and lacks narrative flow. **Decision:** Confirms that a simple heuristic is inadequate and a sophisticated summarization model is necessary. |
| **2** | A general-purpose open-source LLM can produce a decent summary with a basic prompt. | **Model:** `Llama-2-7B-Chat` <br> **Method:** Zero-shot with a simple prompt: "Summarize these reviews." | **Faithfulness:** 0.75 <br> **Coherence:** 3.0/5 | **Result:** Output is readable but often misses key negative points and fails to follow a consistent "Pros/Cons" format. **Decision:** A good starting point, but prompt and model need significant improvement. |
| **3** | Advanced prompt engineering will improve structural consistency and control model output. | **Model:** `Llama-2-7B-Chat` <br> **Method:** Multi-shot prompting with examples. Chain-of-Thought ("think step-by-step"). Strict instructions for JSON output with "pros" and "cons" keys. | **Faithfulness:** 0.80 <br> **Coherence:** 3.8/5 | **Result:** Structure and formatting are dramatically improved. The model is more steerable. **Decision:** Prompt engineering is a high-leverage activity. This becomes our new baseline prompt structure. |
| **4** | A state-of-the-art commercial model will define the "upper bound" for quality, regardless of cost. | **Model:** `GPT-4 API` <br> **Method:** Using the best-performing prompt from Exp #3. | **Faithfulness:** 0.92 <br> **Coherence:** 4.7/5 | **Result:** Exceptionally high-quality, fluent, and nuanced summaries. It sets the gold standard for what is possible. **Decision:** This becomes our "North Star" metric to aim for with a more cost-effective, self-hosted solution. |
| **5** | A newer, more efficient open-source model can approach the quality of larger models. | **Model:** `Mistral-7B-Instruct-v0.1` <br> **Method:** Zero-shot with our best prompt. | **Faithfulness:** 0.88 <br> **Coherence:** 4.2/5 | **Result:** Remarkably strong performance, significantly outperforming Llama 2 7B and getting closer to the GPT-4 benchmark. **Decision:** Mistral 7B becomes our primary candidate model for further optimization. |
| **6** | The base Mistral model will struggle with our non-English reviews. | **Model:** `Mistral-7B-Instruct-v0.1` <br> **Method:** Evaluate specifically on a slice of German and French reviews. | **English Faithfulness:** 0.88 <br> **DE/FR Faithfulness:** 0.65 | **Result:** **Critical finding.** The model's performance degrades significantly on non-English text, producing more generic or factually inconsistent summaries. The base model's multilingual capability is insufficient. |
| **7** | Fine-tuning on a multilingual dataset will improve performance on non-English languages and overall domain-specific quality. | **Model:** `Mistral-7B-Instruct-v0.1` <br> **Method:** Parameter-Efficient Fine-Tuning (PEFT) using LoRA. <br> **Dataset:** A curated sample from the public `amazon_reviews_multi` dataset. | **Overall Faithfulness:** 0.95 <br> **DE/FR Faithfulness:** 0.91 <br> **Coherence:** 4.5/5 | **Result:** **Major breakthrough.** Fine-tuning dramatically improves performance, closing the gap with GPT-4, especially on the critical multilingual weakness. **Decision:** The fine-tuned model is now our lead production candidate. |
| **8** | Refining the RAG retrieval strategy will further boost factual consistency by providing the LLM with higher-signal context. | **Model:** Fine-tuned Mistral 7B <br> **Method:** Evolve RAG from "top-k semantic similarity" to a rule-based retrieval: "Fetch top 3 most helpful positive snippets, top 3 most helpful negative, and 2 most recent." | **Faithfulness:** 0.97 <br> **Context Precision:** 0.96 | **Result:** This change leads to the highest faithfulness score yet by ensuring the LLM is always presented with a balanced and highly relevant context, mitigating model bias. **Decision:** This advanced RAG strategy is adopted for the production system. |

#### 7.3 Final Decision: Selecting the Production Candidate

The experimentation process led to a clear winner. While the GPT-4 API provided the highest out-of-the-box quality, the **fine-tuned Mistral-7B model combined with the advanced RAG strategy** emerged as the optimal choice for our production system.

| Factor | GPT-4 API | Fine-Tuned Mistral 7B (Self-Hosted) | Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Performance** | **Excellent (Coherence: 4.7)** | **Excellent (Coherence: 4.5)** | Performance is comparable and meets the quality bar for a production experience. |
| **Factual Consistency** | Good (Faithfulness: 0.92) | **Superior (Faithfulness: 0.97)** | The combination of domain-specific fine-tuning and a targeted RAG strategy makes our self-hosted model *more* factually grounded. |
| **Cost** | High ($ per 1k summaries) | **Low** (Fixed hourly cost for GPU instance) | At our scale, the self-hosted model is an order of magnitude cheaper, making it economically viable. |
| **Latency** | Moderate-High (API network dependent) | **Low & Predictable** (Within our own VPC) | Self-hosting provides full control over the serving infrastructure, allowing us to meet our strict latency SLOs. |
| **Data Privacy & Control** | Data sent to third-party | **Full Control** | All data remains within our own cloud environment, eliminating third-party data privacy concerns—a critical factor for European user data. |

This data-driven, iterative process allowed us to develop a model that not only meets the quality bar set by the best commercial offerings but exceeds them on the most critical metric (faithfulness) while providing significant advantages in cost, latency, and data governance.

-->

***

### 8. ML Training Pipeline: Planning the Continuous Fine-Tuning Workflow

To ensure our summarization model adapts to new product types, evolving customer language, and emerging review patterns, a "train-once" approach is insufficient. We need an automated **Continuous Training (CT) pipeline** that can periodically fine-tune our model on fresh data, evaluate its performance, and register it for production deployment if it proves superior.

This section outlines the comprehensive plan for the artifacts required to build this critical pipeline.

#### **8.1 Python Scripts (Pipeline Components)**

The pipeline's logic will be encapsulated in a series of modular Python scripts, each designed to be executed as a containerized task orchestrated by Airflow.

| Component Script | Description | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **`1_data_selection.py`** | Selects the data for the fine-tuning job. It combines a fresh, curated sample of the public multilingual dataset with a sample of high-quality, recently collected internal reviews (from the S3 Data Lake). | `pandas`, `DVC API`, `pyarrow`. |
| **`2_data_validation.py`** | Validates the selected training dataset against a predefined set of rules (e.g., schema checks, text length validation, no nulls) to prevent training on corrupted data. | Great Expectations. |
| **`3_model_training.py`** | The core fine-tuning component. It loads the base model (`Mistral-7B`), applies the PEFT/LoRA configuration, and runs the training job on the validated dataset using a managed GPU cluster. | Hugging Face `transformers`, `peft`, `accelerate`. |
| **`4_model_evaluation.py`** | Evaluates the newly fine-tuned model artifact against the "golden" evaluation dataset. It generates summaries and scores them using a multi-faceted approach. | `Ragas` (for RAG metrics), `Giskard` (for behavioral tests), `openai` (for LLM-as-a-judge). |
| **`5_model_registration.py`**| The final governance gate. It compares the new model's evaluation scores against the currently deployed production model. If the new model meets the promotion criteria, it is versioned and registered in the MLflow Model Registry. | `mlflow`. |

#### **8.2 Unit Tests (`pytest`)**

To ensure the reliability of each component, we will implement a suite of unit tests.

*   **Test Data Selection:** Verify that `1_data_selection.py` correctly loads data from mock S3 paths and handles empty or missing data gracefully.
*   **Test Training Script Logic:** Test the setup functions within `3_model_training.py` to ensure it correctly parses configurations and loads the base model and tokenizer, without running a full training loop.
*   **Test Evaluation Logic:** For `4_model_evaluation.py`, provide a small, fixed set of pre-generated summaries and verify that the metric calculation functions (e.g., parsing Ragas output) work as expected.
*   **Test Registration Logic:** For `5_model_registration.py`, test the decision-making function by passing it various mock metric scores (e.g., "new model better," "new model worse," "new model marginally better but below threshold") and asserting the correct outcome (register or skip).

#### **8.3 Pipeline Code (Airflow DAG)**

The components will be orchestrated into a single, cohesive pipeline using an Airflow DAG.

*   **File:** `llm_finetuning_dag.py`
*   **Trigger:** Scheduled to run monthly and can be triggered manually for on-demand retraining.
*   **Tasks:**
    1.  `data_selection_task`: Executes the data selection script.
    2.  `data_validation_task`: Executes the validation script. Fails the pipeline if data quality checks do not pass.
    3.  `model_training_task`: Executes the fine-tuning script as an **Amazon SageMaker Training Job**. This offloads the heavy GPU computation to a managed, ephemeral cluster.
    4.  `model_evaluation_task`: Executes the evaluation script on a CPU instance once training is complete.
    5.  `model_registration_task`: Executes the registration script, making the final go/no-go decision.

#### **8.4 Infrastructure as Code (Terraform)**

The necessary AWS infrastructure for this pipeline will be defined declaratively.

*   **IAM Role for SageMaker:** A dedicated IAM role for SageMaker Training Jobs, granting it least-privilege access to read data from S3, pull the base model from Hugging Face, and write artifacts back to S3.
*   **IAM Role for Airflow:** An execution role for the MWAA environment, allowing it to trigger SageMaker jobs and log to CloudWatch.
*   **ECR Repository:** A repository to store the Docker images for our custom pipeline components.

#### **8.5 Integration Test**

A CI/CD workflow will run an automated integration test on the entire pipeline.

*   **Process:** The test will trigger the Airflow DAG in a staging environment. It will use a tiny, dedicated test dataset. The `model_training_task` will be configured to run for only a few steps to produce a dummy model artifact quickly.
*   **Goal:** The test passes if the DAG runs to completion without errors and a new (dummy) model version is successfully registered in a staging MLflow instance. This validates that all components, permissions, and configurations work together correctly.

#### **8.6 Architecture Diagram**
<img src="../_static/past_experiences/ecom_summarisation/pipeline_training.png" width="100%" style="background-color: #FCF1EF;"/>


#### **8.7 CI/CD Workflow (GitHub Actions)**

The deployment and testing of the pipeline code itself will be automated.

*   **File:** `.github/workflows/deploy_finetuning_pipeline.yml`
*   **Trigger:** On push to the `main` branch.
*   **Jobs:**
    1.  **`lint-and-unit-test`:** Runs static code analysis (`flake8`) and `pytest` for all unit tests.
    2.  **`build-and-push-images`:** Builds Docker images for the pipeline components and pushes them to our Amazon ECR repository.
    3.  **`run-integration-test`:** (If previous job succeeds) Triggers the integration test on the staging Airflow environment.
    4.  **`deploy-to-production`:** (If integration test succeeds) Syncs the updated Airflow DAG file to the production S3 bucket, allowing MWAA to deploy the new pipeline version automatically.



***

### 9. Batch Inference Pipeline: Planning the Production Summarization Workflow

This pipeline is the workhorse of the system. It runs frequently to ensure summaries are kept up-to-date with the latest customer feedback, using the RAG-based strategy we've established for quality and control. This pipeline's objective is to efficiently generate and cache high-quality summaries for all products that have received new reviews, ensuring that the information presented to users is fresh and relevant.

#### **9.1 Python Scripts (Pipeline Components)**

The batch inference process is broken down into a sequence of focused, testable Python scripts.

| Component Script | Description | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **`1_get_products_to_update.py`**| Queries the application's production database to get a list of `product_id`s that have received new reviews since the last successful pipeline run. | `psycopg2` (or other DB driver), `pandas`. |
| **`2_retrieve_rag_context.py`** | For each product ID, executes the defined RAG strategy: queries the Vector DB (OpenSearch) to retrieve the most relevant review snippets (e.g., top positive, top negative, most recent). | `opensearch-py`, LangChain (for prompt templating). |
| **`3_generate_summaries.py`** | Takes the retrieved contexts, formats them into prompts, and sends them in batches to the production LLM serving endpoint. Handles API responses and error conditions. | `requests`, `httpx`. |
| **`4_validate_and_cache.py`**| Receives the raw JSON summaries from the LLM. Performs a basic validation (e.g., checks for required keys). Writes the valid summaries to the low-latency cache (DynamoDB) with a defined TTL. | `boto3`. |

#### **9.2 Unit Tests (`pytest`)**

Each script will be accompanied by unit tests to guarantee its logic and error handling.

*   **Test Product Retrieval:** For `1_get_products_to_update.py`, mock the database connection and test that the correct product IDs are returned based on mock timestamps.
*   **Test RAG Logic:** For `2_retrieve_rag_context.py`, mock the OpenSearch client. Verify that the script constructs the correct, complex query based on our RAG strategy and correctly assembles the final prompt.
*   **Test API Invocation:** For `3_generate_summaries.py`, mock the inference service endpoint. Test its ability to handle successful (200) responses, rate limiting (429), and server errors (500).
*   **Test Caching Logic:** For `4_validate_and_cache.py`, mock the DynamoDB client. Test that valid JSON summaries are written correctly and that malformed summaries are logged as errors.

#### **9.3 Pipeline Code (Airflow DAG)**

An Airflow DAG will orchestrate the execution of these components in a reliable, scheduled manner.

*   **File:** `batch_inference_dag.py`
*   **Trigger:** Scheduled to run hourly.
*   **Tasks:**
    1.  `get_products_to_update_task`: Executes the product retrieval script.
    2.  `check_if_products_exist_task`: A `BranchPythonOperator` that checks if the previous task returned any products. If not, the DAG skips to a final "success" state to avoid running expensive tasks unnecessarily.
    3.  `retrieve_rag_context_task`: Executes the RAG context retrieval script.
    4.  `generate_summaries_task`: Executes the summary generation script.
    5.  `validate_and_cache_task`: Executes the final caching script.

#### **9.4 Infrastructure as Code (Terraform)**

The AWS resources supporting this pipeline will be defined as code.

*   **Amazon DynamoDB Table:** Definition of the low-latency cache table, including its partition key (`product_id`), attributes (`summary_json`, `last_updated`), and TTL configuration.
*   **IAM Role for Airflow:** An execution role for MWAA granting permissions to:
    *   Read from the production application database.
    *   Query the Amazon OpenSearch cluster.
    *   Invoke the production EKS inference endpoint (requires VPC networking and security group configuration).
    *   Write items to the DynamoDB cache table.

#### **9.5 Integration Test**

A CI/CD workflow will validate the entire pipeline end-to-end in a staging environment.

*   **Process:** The test will pre-populate a staging database and staging Vector DB with a few sample reviews for a test product. It will then trigger the `batch_inference_dag` in the staging Airflow environment.
*   **Goal:** The test passes if, after the DAG completes, the script can successfully query the staging DynamoDB table and find a newly generated summary for the test product. This verifies that all permissions, connections, and logic work in concert.

#### **9.6 Architecture Diagram**
<img src="../_static/past_experiences/ecom_summarisation/pipeline_inference.png" width="100%" style="background-color: #FCF1EF;"/>


#### **9.7 CI/CD Workflow (GitHub Actions)**

This workflow automates the testing and deployment of the *pipeline code itself*.

*   **File:** `.github/workflows/deploy_batch_inference_pipeline.yml`
*   **Trigger:** On push to the `main` branch.
*   **Jobs:**
    1.  **`lint-and-unit-test`:** Runs static code analysis and `pytest` for all batch pipeline scripts.
    2.  **`deploy-dag-to-staging`:** Deploys the updated Airflow DAG to the staging environment.
    3.  **`run-integration-test`:** Triggers the end-to-end integration test on the staging Airflow environment.
    4.  **`trigger-load-test`:**
        *   **Condition:** This job **only runs if** specific files that affect the load pattern have changed (e.g., `generate_summaries.py`, `retrieve_rag_context.py`). We can use path filters in GitHub Actions for this.
        *   **Action:** Calls the `reusable_load_test.yml` workflow, targeting the **main production serving endpoint**. This validates that our *new client code* works correctly with the *current production server*.
    5.  **`deploy-dag-to-production`:** (If all previous jobs succeed) Syncs the updated Airflow DAG to the production MWAA environment.

***



### Model (LLM Serving Endpoint) Deployment Pipeline

#### Why a shared, reusable Load Test ?
There are two distinct deployment processes,

1.  **Deploying the Batch Inference Pipeline Logic (Airflow DAG):** This happens when we change the *orchestration code*. Its CI/CD checks that the DAG runs correctly.
2.  **Deploying the Model Endpoint (EKS Service):** This happens when a *new model is promoted*. This is where we must validate the performance and stability of the model server itself before it handles production requests from our batch pipeline. This is the critical workflow that is triggered whenever a new model is approved and needs to be rolled out to production. It ensures that the new model not only works correctly but also performs efficiently under load.

The key insight is that the **Batch Inference Pipeline *is the primary client*** for our LLM Serving Endpoint. The performance of the endpoint is not just a property of the model itself; it's a function of the interaction between the server and the client that calls it.

Therefore:

1.  **Changing the Server (Model Endpoint):** Deploying a new model (e.g., a larger one, or one with a different quantization level) will obviously change performance characteristics. This **must** be load tested.
2.  **Changing the Client (Batch Pipeline):** A seemingly innocuous change in the batch pipeline's code can dramatically alter the load pattern. For example:
    *   Changing the RAG retrieval logic in `retrieve_rag_context.py` could create much larger prompt contexts, increasing the processing time per request.
    *   Changing the parallelism or batching logic in `generate_summaries.py` could alter the number of concurrent requests sent to the endpoint.

A change in either component can break the system's performance. Therefore, any significant change to either the client (the pipeline) or the server (the endpoint) must trigger a load test to validate their interaction. The optimal solution is not to have two separate load tests, but to have a single, **reusable load testing workflow** that can be called by *both* CI/CD pipelines.


#### CI/CD for the LLM Serving Endpoint (with the shared Load Test)

*   **File:** `.github/workflows/deploy_llm_serving_endpoint.yml`
*   **Trigger:** A model is manually promoted from "Staging" to "Production" in the MLflow Model Registry.
*   **Jobs:**

| Job | Description | Key Artifacts / Outputs |
| :--- | :--- | :--- |
| **1. Build Container** | - Fetches the newly promoted model artifacts (LoRA weights, config) from MLflow.<br>- Builds a new Docker container with the inference server (vLLM/TGI) and the model artifacts baked in.<br>- Pushes the versioned container image to Amazon ECR. | - A new, immutable Docker image in ECR tagged with the model version. |
| **2. Deploy to Staging** | - Uses Terraform/CDK to deploy the new container to a *separate staging endpoint* in the EKS cluster. This endpoint is identical to production but does not receive live traffic. | - A live, but isolated, staging/canary model endpoint. |
| **3. Smoke & Integration Test** | - Runs a small suite of tests against the staging endpoint:<br>  • **Health Check:** Is the endpoint responsive?<br>  • **API Contract Test:** Does the request/response schema match?<br>  • **Consistency Check:** Does the endpoint give the exact same prediction for a sample input as it did during offline evaluation? | - A go/no-go signal for further testing. |
| **4. Load Test** | - If smoke tests pass, a `Locust` load test is automatically triggered against the **staging endpoint**.<br>- The test simulates the expected load from our hourly batch inference job (e.g., thousands of requests in a short burst).<br>- It measures and asserts that P95 latency and tokens/second throughput are within our defined SLOs. | - Performance metrics (latency, throughput, error rate).<br>- A go/no-go signal based on whether the endpoint meets its performance targets. |
| **5. Phased Rollout to Production** | - If the load test passes, the workflow begins a safe, automated rollout to the main production endpoint.<br>- **Canary Strategy:** It updates the EKS service to direct a small percentage of traffic (e.g., 10%) from the live batch pipeline to the new model version.<br>- The workflow pauses and monitors key metrics (latency, error rates from CloudWatch) for a predefined period. | - A new model version serving a small fraction of production traffic. |
| **6. Promote to 100%** | - If the canary phase shows no issues, the workflow automatically proceeds to shift 100% of the production traffic to the new model version.<br>- The old model version is kept running for a short period to allow for a fast rollback if needed. | - The new model is now the fully live "champion" model in production. |

***

### 10. Monitoring and Observability: Ensuring Production Health and Quality

Once deployed, our system enters its most critical phase. Monitoring is not a passive activity but a proactive, multi-layered strategy designed to provide a holistic view of the system's health, from the underlying infrastructure to the data flowing through it, and—most importantly—the quality of the LLM's generated summaries.

Our strategy is built on three distinct pillars:

1.  **System & Operational Health:** Is the infrastructure running correctly?
2.  **Data Quality & Drift:** Are the inputs to our model trustworthy?
3.  **Model Quality & Performance:** Are the outputs of our model accurate, safe, and helpful?

#### **Monitoring and Alerting Plan**

| Category | Specific Metric | Tool / Method | Alerting Threshold & Recipient (Example) |
| :--- | :--- | :--- | :--- |
| **1. System & Operational Health**| **Batch Inference DAG Success Rate**| **Amazon CloudWatch** (from MWAA logs) | **Alert:** On any DAG run failure.<br>**Recipient:** On-call Data Engineer, On-call MLOps Engineer. |
| | **EKS Pod Health (Serving Endpoint)**| **Prometheus / Grafana** | **Alert:** When the number of ready pods is less than the desired replica count for > 5 mins.<br>**Recipient:** On-call MLOps Engineer. |
| | **GPU Utilization (Serving Endpoint)** | **Prometheus** (via DCGM exporter) | **Alert:** If average GPU utilization during a batch run is < 30% (indicates inefficiency) or > 95% for an extended period (indicates system is overloaded).<br>**Recipient:** On-call MLOps Engineer. |
| | **API Error Rate (Serving Endpoint)** | **Prometheus / Grafana** | **Alert:** If the rate of HTTP 5xx errors exceeds 2% over a 10-minute window.<br>**Recipient:** On-call MLOps Engineer. |
| | **Cache Performance (DynamoDB)** | **Amazon CloudWatch**| **Alert:** On sustained increases in read/write latency or throttled requests.<br>**Recipient:** On-call Data Engineer. |
| **2. Data Quality & Drift** | **Input Data Drift (Semantic)** | **Custom Airflow DAG** using Python (`scipy`, `evidently.ai`). | **Alert:** If Population Stability Index (PSI) between daily review embeddings and the training set baseline exceeds 0.25.<br>**Recipient:** Data Engineering & MLOps teams (as a non-urgent ticket). |
| | **Input Data Properties Drift** | **Custom Airflow DAG** | **Alert:** If the distribution of `star_rating` or `language` changes by > 20% week-over-week.<br>**Recipient:** Data Engineering team. |
| | **PII Leakage Rate (Input)** | **Great Expectations** step in the ingestion pipeline. | **Alert:** On *any* detection of PII. This is a critical failure.<br>**Recipient:** High-priority alert to Legal, Security, and Data Engineering teams. |
| **3. Model Quality & Performance** | **Summary Faithfulness (Hallucinations)** | **Automated Quality Monitoring DAG** using `Ragas`. | **CRITICAL ALERT:** If the average Faithfulness score of the daily sample drops below 0.95. This is the most important quality metric.<br>**Recipient:** Immediate page to On-call MLOps Engineer. May trigger an automated pause of the batch pipeline. |
| | **Summary Coherence & Fluency** | **Automated Quality Monitoring DAG** using LLM-as-a-judge (GPT-4o). | **Warning:** If the average coherence score drops below 4.0/5. <br>**Recipient:** A ticket is automatically created for the MLOps team to investigate in the next sprint. |
| | **Toxicity & Safety (Output)**| **Automated Quality Monitoring DAG** using a toxicity classifier. | **CRITICAL ALERT:** If the rate of generated summaries flagged as toxic exceeds 0.1%.<br>**Recipient:** Immediate page to MLOps and Product teams. |
| | **Format Adherence** | **Automated Quality Monitoring DAG** (simple JSON schema validation). | **Alert:** If > 1% of sampled summaries fail to parse or do not contain the required "pros" and "cons" keys.<br>**Recipient:** MLOps team. |
| | **RAG Context Relevance**| **Automated Quality Monitoring DAG** using `Ragas` (Context Precision). | **Warning:** If the context precision score drops, indicating the retrieval logic may be degrading. <br>**Recipient:** MLOps team ticket. |

This comprehensive monitoring plan transforms our system from a "fire-and-forget" deployment into a closely observed, self-diagnosing service. By setting clear SLOs and automated alerts for system health, data integrity, and model quality, we create the necessary feedback loops to maintain a high-quality user experience and build long-term trust in our GenAI application.

***



### 11. Closing the Loop: Continual Learning & Production Testing

A deployed model is the beginning of the journey, not the end. In the dynamic environment of e-commerce, customer language evolves, new products introduce new vocabularies, and the meaning of a "good" review can shift. Our system must adapt to these changes to remain effective. This phase focuses on the strategies for model evolution and the rigorous methods for validating its real-world business impact.

#### 11.1 Continual Learning & Retraining Strategy

The goal is to keep our summarization model accurate and relevant without incurring the prohibitive cost of retraining from scratch.

*   **Triggers for Retraining:** Our Continuous Training (CT) pipeline is not run arbitrarily. It is triggered by two specific conditions:
    1.  **Reactive (Alert-Driven):** An alert from our automated quality monitoring system signals a significant degradation in production model performance (e.g., the Faithfulness score drops below our 0.95 SLO). This is an emergency trigger to remediate a live issue.
    2.  **Proactive (Scheduled):** A scheduled trigger (e.g., quarterly) ensures the model is periodically refreshed with the latest data, capturing gradual concept drift and new language patterns before they become a major issue.

*   **The Retraining Process:**
    When triggered, the planned `llm_finetuning_dag` executes the PEFT/LoRA fine-tuning process on a newly curated dataset. This dataset includes a fresh sample of high-quality reviews collected since the last run, combined with a representative sample of older data to mitigate catastrophic forgetting.

#### 11.2 Mitigating Catastrophic Forgetting: A Core LLM Challenge

**The Problem:** The primary risk of continual learning is **catastrophic forgetting**. If we fine-tune our model solely on a new wave of "Home & Kitchen" reviews, it might become an expert in that domain but forget the specific nuances and vocabulary required to effectively summarize "Fashion" or "Electronics" reviews. This would silently degrade the user experience for a large portion of our product catalog.

**Our Mitigation Strategy: A Modular, Multi-Adapter Architecture**

Instead of fine-tuning a single, monolithic model, we will adopt a more robust, **federated adapter strategy**.

1.  **Domain-Specific Adapters:** We will train separate, lightweight LoRA adapters for distinct, high-level product categories (e.g., `electronics_adapter`, `fashion_adapter`, `home_adapter`).
2.  **Isolated Training:** When the "Electronics" domain requires an update, we *only* retrain the `electronics_adapter` on new electronics reviews. The weights of the base model and all other adapters remain untouched.
3.  **Dynamic Serving:** Our inference service on EKS will be architected to support **Multi-LoRA serving (e.g., using LoRAX)**. When a request comes for a product, the service identifies its category and dynamically loads the appropriate LoRA adapter on top of the shared base model to generate the summary.

This architecture is the ultimate defense against catastrophic forgetting. It contains the impact of retraining to a specific domain, ensuring that improvements in one area do not cause regressions in another.

#### 11.3 Phased Production Testing: From Safety to Business Impact

Before a newly trained model (or adapter) can become the new production "champion," it must pass a rigorous, phased testing process in the live environment.

| Stage | Test Method | Purpose & LLM-Specific Focus |
| :--- | :--- | :--- |
| **1. Shadow Deployment** | The new "challenger" model/adapter runs in parallel with the current "champion." | **Purpose:** Safely validate the challenger's performance on live, messy production data with **zero user impact**. <br> **Process:** Our batch inference pipeline calls both models. The challenger's summaries are logged but not served. We then compare them offline to the champion's outputs using our Ragas/LLM-as-a-judge pipeline. This is our final quality gate before exposing the model to users. |
| **2. A/B Testing** | A subset of users are shown summaries generated by the challenger model, while the control group sees summaries from the champion model. | **Purpose:** To definitively and quantitatively measure the **business impact** of the new model. This moves beyond offline metrics to answer the ultimate question: "Does this new model help our users and our business?" <br> **Primary KPIs Measured:** Conversion Rate, Product Return Rate, User Engagement ("Helpful" clicks). |

#### 11.4 A/B Testing Framework for a Batch System

Executing an A/B test in our batch-oriented system requires a specific workflow:
<img src="../_static/past_experiences/ecom_summarisation/ab_testing.png" width="100%" style="background-color: #FCF1EF;"/>


This framework allows us to rigorously test the real-world impact of our model updates. A new model is only fully rolled out and becomes the new "champion" if it demonstrates a statistically significant improvement in our primary business KPIs, completing the virtuous cycle of our MLOps process.


***



### 12. Governance, Ethics & The Human Element

A production AI system's success is ultimately measured not just by its accuracy but by its reliability, fairness, and the trust it earns from users and stakeholders. This section outlines the governance framework and ethical guardrails that ensure our summarization feature is developed and operated responsibly.

#### 12.1 Comprehensive Model Governance

Governance is integrated throughout our MLOps lifecycle to ensure compliance, reproducibility, and control.

| Lifecycle Stage | Governance Component | Key Tasks & Artifacts for this Project |
| :--- | :--- | :--- |
| **Development**| **Reproducibility** | **Versioning Everything:** All components are versioned to enable full reproducibility. <br> • **Code:** Git commits.<br> • **Data:** DVC for evaluation datasets.<br> • **Prompts:** Versioned as config files in Git.<br> • **Models:** Registered and versioned in the MLflow Model Registry. |
| | **Validation**| **Model Cards:** For each production-promoted model, a Model Card is created, documenting its intended use, evaluation metrics (including on key data slices), limitations, and any known biases. |
| **Deployment & Operations**| **Control & Security**| **Access Control:** IAM roles enforce least-privilege access. EKS service accounts and SageMaker execution roles ensure services can only access the resources they need.<br> **Secret Management:** The production endpoint API key for LLM-as-a-judge is stored securely in AWS Secrets Manager. |
| | **Monitoring & Alerting**| **Automated Alerts:** The monitoring system (as defined in Section 10) automatically sends alerts for performance degradation, data drift, or quality issues, creating an immediate feedback loop. |
| | **Auditability**| **MLflow as Audit Trail:** The MLflow Tracking Server provides a complete, traceable log linking a specific model version back to the data it was trained on, the code that trained it, and its evaluation results. |

#### 12.2 Responsible AI (RAI) Principles in Practice

We proactively address ethical considerations, focusing on fairness, explainability, and privacy.

| RAI Principle | Risk in this Project | Mitigation Strategy |
| :--- | :--- | :--- |
| **Fairness & Bias** | **Positivity Bias:** The model, trained on a majority of positive reviews, might learn to over-emphasize positive statements and downplay or ignore valid negative feedback, creating misleadingly positive summaries. | **Data-Centric Mitigation:** Our RAG retrieval strategy is explicitly designed to be **bias-aware**. It programmatically retrieves a *balanced* set of review snippets (e.g., top 3 helpful positive, top 3 helpful negative) to ensure the LLM is always presented with a fair and representative context. |
| **Explainability (XAI)** | **"Black Box" Summaries:** Users may not understand *why* the summary makes a particular claim (e.g., "battery life is poor"), which can reduce trust. | **RAG-based Explainability ("Grounding"):** This is a key feature of our system. The user interface can be designed to allow users to click on a sentence in the summary, which would then highlight the original review snippets from which that statement was derived. This directly connects the generated output to its source evidence. |
| **Transparency** | **Undisclosed AI Generation:** Users may not be aware that the summary is AI-generated, leading to misplaced expectations. | **Clear Labeling:** The user interface will clearly label the summary section with a disclaimer such as "AI-generated summary based on customer reviews" to manage user expectations appropriately. The Model Card serves as internal transparency. |
| **Privacy** | **PII Leakage:** Customer reviews might contain Personally Identifiable Information (e.g., "the seller John Doe at john.doe@email.com was very helpful") which could be repeated in the summary. | **Proactive PII Redaction:** The **Data Ingestion & Cleaning Pipeline** includes a dedicated, automated step using libraries like `presidio` to detect and redact PII from all review texts *before* they are stored, embedded, or ever seen by the LLM. |

#### 12.3 Holistic Testing & Production Readiness (ML Test Score)

We use the principles from Google's "ML Test Score" rubric to self-assess the production readiness of our system.

| Test Category | Key Checks for Our Project |
| :--- | :--- |
| **Features & Data** | ✓ Feature expectations are captured (Great Expectations). <br> ✓ Data pipeline has PII controls. <br> ✓ All input feature code (`embedding_generation_pipeline`) is unit tested. |
| **Model Development**| ✓ Model specs (LoRA config, prompt) are versioned in Git.<br> ✓ Offline metrics (Faithfulness, Coherence) correlate with desired business outcomes.<br> ✓ A simpler model (heuristic baseline) was proven to be worse.<br> ✓ Model quality is checked on key slices (multilingual data, polarized reviews). |
| **ML Infrastructure**| ✓ Training pipeline is integration tested.<br> ✓ Model quality is validated before being registered.<br> ✓ Models are tested via a canary/shadow process before full production rollout.<br> ✓ A safe rollback mechanism to a previous model version is in place. |
| **Monitoring** | ✓ Data invariants (schema, distributions) are monitored.<br> ✓ Training-serving skew is addressed by design (same embedding model used everywhere).<br> ✓ Model quality (Faithfulness, etc.) is continuously monitored.<br> ✓ System performance (latency, throughput) is monitored. |

#### 12.4 The Human Element: Team & User Experience

*   **Team Collaboration:** As a small, cross-functional team (Product, Data Engineering, MLOps), clear communication and shared ownership were paramount. Blameless post-mortems for any production issues are standard practice to encourage a culture of continuous improvement.
*   **User Feedback Loops:** The user interface will include "Was this summary helpful?" (👍/👎) buttons. This direct, explicit feedback is a crucial source of data. A sudden increase in "👎" clicks for a specific product category is a powerful signal that can trigger an investigation and potentially a targeted retraining of the relevant LoRA adapter.




***

### 13. Overall System Architecture

The end-to-end system for customer review summarization is a sophisticated interplay of data engineering pipelines, MLOps automation, and a high-performance model serving infrastructure. The following diagram provides a unified view of how these components interact to deliver the final product feature.

#### 13.1 AWS System Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/system_architecture.png" width="100%" style="background-color: #FCF1EF;"/>




The system is logically divided into four distinct planes:

1.  **CI/CD & Governance Plane (Purple):** This is the developer-facing control loop where all changes originate.
    *   **GitHub** is the single source of truth for all artifacts: application code, pipeline definitions (DAGs), Infrastructure as Code (Terraform), and data pointers (DVC).
    *   **GitHub Actions** automates the entire CI/CD process. It runs tests, builds Docker containers, and deploys the updated pipeline and serving code to the appropriate AWS services.
    *   The **MLflow Model Registry** acts as the central governance gate for models. A manual promotion of a model in the registry is the explicit, auditable action that triggers the workflow to deploy a new model version to production.

2.  **Control Plane - MLOps Automation (Orange):** This is the automated "brain" of the MLOps system.
    *   **Amazon MWAA (Managed Workflows for Apache Airflow)** orchestrates all our data and ML pipelines as DAGs. It is responsible for scheduling the batch inference jobs, running the data ingestion pipelines, and triggering the continuous training workflows.

3.  **Data Plane (Blue):** This plane represents the flow and storage of all data.
    *   It begins with the **Application DB**, the source of new reviews.
    *   The **S3 Data Lake** serves as the central, cost-effective storage for raw and cleaned review data.
    *   **Amazon Bedrock** provides the Titan embedding model used to convert text into semantic vectors.
    *   **Amazon OpenSearch** acts as our Vector Database, indexing the embeddings to enable efficient similarity search for our RAG strategy.

4.  **Serving & Caching Plane (Light Orange):** This is where the model is hosted and the final summaries are made available to the application.
    *   The **LLM Serving Endpoint**, running on **Amazon EKS** with an optimized engine like vLLM, is a high-performance microservice responsible for generating summaries. It is deployed as a container from **Amazon ECR**.
    *   The **Amazon DynamoDB** table is the low-latency Summary Cache. Our batch inference pipeline writes its results here.
    *   The main **E-commerce Application** reads from this DynamoDB cache to display summaries to users, completely decoupling it from the complexity and latency of the live model inference.



#### 13.2 Sequence Diagram: Batch Inference Workflow

This sequence diagram illustrates a highly efficient and parallelized workflow.

<img src="../_static/past_experiences/ecom_summarisation/sequence_diagram.png" width="100%" style="background-color: #FCF1EF;"/>

*   **Total Estimated Pipeline Runtime:** For a typical hourly run involving **500 products**, the entire end-to-end process is expected to complete in well under a minute (**~30-50 seconds**).
*   **Dominant Latency Step:** The most time-consuming part of the process is the actual LLM inference step (`generate_summaries_task`). This highlights the critical importance of using an optimized serving engine like vLLM to maximize throughput and keep the batch processing time low.
*   **Scalability:** The architecture is designed to scale.
    *   **OpenSearch and DynamoDB** can handle massive throughput with consistent low latency.
    *   The **LLM Serving Endpoint on EKS** can be scaled horizontally by adding more pods/nodes if the number of products to be updated per hour grows significantly, although this would increase cost.
    *   The primary bottleneck for a much larger workload would likely become the cost and time associated with the EKS inference step.




#### 13.3 Potential Bottlenecks and Performance Optimizations

While the architecture is designed for efficiency, several potential bottlenecks could arise as the system scales. Proactively identifying and planning for these is key to maintaining a performant and cost-effective service.

| Bottleneck | Description | Performance Optimization Strategies |
| :--- | :--- | :--- |
| **1. LLM Inference Throughput** | This is the **primary and most critical bottleneck**. The number of summaries we can generate per second is limited by the GPU's computational power. If the number of products needing updates per hour exceeds the endpoint's capacity, the batch job's runtime will extend, potentially violating our "hourly" freshness guarantee and increasing compute costs. | **Primary Optimizations (Already Planned):**<br> • **Optimized Serving Engine:** Using **vLLM** is non-negotiable. Its implementation of continuous batching and PagedAttention can increase throughput by **5-10x** compared to a naive Hugging Face implementation.<br> • **Quantization:** Serving a quantized version of the model (e.g., INT8 or AWQ) can significantly increase token generation speed and reduce the GPU memory footprint, allowing for larger batch sizes. This requires careful evaluation to ensure no unacceptable drop in summary quality.<br><br>**Secondary Optimizations (If Needed):**<br> • **Horizontal Scaling:** Add more pods to the EKS deployment. This provides a linear increase in throughput but also a linear increase in cost.<br> • **Vertical Scaling:** Upgrade to a more powerful GPU instance (e.g., from an NVIDIA A10G to an H100). This is more expensive but can provide a step-change in performance.<br> • **Speculative Decoding:** An advanced technique where a smaller, faster "draft" model generates candidate tokens that the main model validates in chunks, speeding up generation. |
| **2. RAG Context Retrieval Latency** | Before we can even call the LLM, we must query the Vector DB (OpenSearch) to retrieve the review snippets. If these queries are slow or inefficient, they add directly to the overall pipeline runtime, especially when processing thousands of products. | **Primary Optimizations (Already Planned):**<br> • **Batching & Asynchronous Queries:** Instead of querying one product at a time, our `retrieve_rag_context.py` script will use **asynchronous I/O (`asyncio`, `aiohttp`)** to send many queries to OpenSearch concurrently, maximizing throughput.<br> • **Optimized OpenSearch Index:** Ensure the OpenSearch index is correctly sharded and has the appropriate instance type to handle the query load.<br><br>**Secondary Optimizations (If Needed):**<br> • **Add a Read Replica:** If the OpenSearch cluster is under heavy load from other applications, add a dedicated read replica for the summarization pipeline to query. |
| **3. Airflow Worker Capacity** | The Airflow workers orchestrating the pipeline have finite resources. If we try to parallelize the processing of too many products simultaneously, we could overwhelm the worker's CPU and memory, causing tasks to fail or the entire DAG to slow down. | **Primary Optimizations (Already Planned):**<br> • **Resource Management:** Configure the Airflow DAG with a sensible `max_active_runs` and set appropriate concurrency limits for each task.<br> • **Offload Heavy Lifting:** The current design correctly offloads the most intensive work (LLM inference) to a dedicated EKS cluster, keeping the Airflow workers lightweight.<br><br>**Secondary Optimizations (If Needed):**<br> • **Scale MWAA Environment:** Increase the size or number of workers in the Amazon MWAA environment. |
| **4. Cold Starts (Scaling from Zero)**| Our cost-optimization strategy involves scaling the EKS deployment to zero pods when idle. The first batch job after a period of inactivity will experience a "cold start" latency as the Kubernetes scheduler needs to provision a new pod on a GPU node and download the model container. This could add several minutes to the first run. | **Primary Optimizations (Already Planned):**<br> • **Overprovisioning with Paused Pods (if supported):** Some advanced schedulers allow for "paused" pods that keep the container image resident on the node, dramatically reducing startup time. <br> • **Acceptance:** For our hourly batch job, a one-time startup latency of a few minutes is generally an acceptable trade-off for the significant cost savings of scaling to zero. <br><br>**Secondary Optimizations (If Needed):**<br> • **Keep a Single Warm Pod:** As a compromise, configure the deployment to always keep a minimum of one pod running. This eliminates cold starts but incurs a higher baseline cost. |
| **5. Database Write Throughput**| After generating summaries, the pipeline needs to write them to the DynamoDB cache. While DynamoDB is highly scalable, a massive burst of writes could potentially exceed the table's provisioned write capacity units (WCUs), leading to throttled requests and task retries. | **Primary Optimizations (Already Planned):**<br> • **Use BatchWriteItem:** The `validate_and_cache.py` script will use DynamoDB's `BatchWriteItem` API, which is far more efficient than writing items one by one.<br> • **On-Demand Capacity:** Configure the DynamoDB table to use "On-Demand" capacity mode instead of provisioned. This automatically scales to handle the workload's peak write throughput and is more cost-effective for spiky, infrequent traffic patterns like our batch job. |

<!--
#### 13.4 Monthly Cost Estimation (Weekly Batch Inference)


##### The Problem with "Stop/Start" for MWAA and OpenSearch

*   **Amazon MWAA (Airflow):** This service is designed as a persistent orchestration *environment*, not an ephemeral job runner. Spinning up a new MWAA environment from scratch can take **30-60 minutes**. Tearing it down also takes time. Creating and destroying it for a weekly job is operationally impractical and would make the pipeline incredibly slow and brittle.
*   **Amazon OpenSearch:** While you *can* stop and start OpenSearch domains, the process is not instantaneous and adds significant operational complexity. It can take several minutes to start the cluster, and you would need to build extra automation to manage this process, adding another potential point of failure.

The *right* solution is to choose different, **serverless-native services** that are designed from the ground up for pay-per-use and scale-to-zero workloads.

##### The Revised, Cost-Optimized Architecture

Let's swap our expensive, persistent services for their serverless counterparts.

1.  **Orchestrator: Replace Amazon MWAA with AWS Step Functions.**
    *   **Why:** Step Functions is a fully serverless orchestrator. It has zero cost when idle and you pay per state transition. For a simple, linear pipeline that runs once a week, the cost is practically zero. It's the perfect tool for infrequent, event-driven workflows. We can use it to chain together Lambda functions and AWS Batch jobs.

2.  **Vector DB: Replace Amazon OpenSearch with Amazon Aurora Serverless v2 with pgvector.**
    *   **Why:** Aurora Serverless v2 is designed to scale down to a very low minimum capacity when not in use. Instead of paying for two large instances 24/7, we pay for a tiny baseline capacity (e.g., 0.5 ACUs) and it will automatically scale up only when our weekly batch job is querying it. This dramatically reduces the 24/7 database cost.

#####  Monthly Cost Estimation (Weekly Batch Inference)

This new architecture leads to a vastly different and more business-friendly cost profile.

| Pipeline Component | AWS Service(s) | Detailed Cost Calculation & Rationale | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- |
| **Data Ingestion & Embedding**| **AWS Step Functions**<br>**AWS Batch**<br>**Amazon Aurora Serverless v2**<br>**Amazon Bedrock** | **Step Functions & Batch:** For orchestration and running the containerized ingestion scripts once a day. The costs for a few thousand state transitions and a few hours of CPU time are negligible.<br>- We'll budget generously = **~$15**.<br><br>**Aurora Serverless v2 (Vector DB):** This is the key saving. The database will idle at a minimal capacity for most of the month and only scale up during the weekly inference and daily ingestion jobs.<br>- Baseline (idle): ~710 hours * 0.5 ACUs * ~$0.12/ACU-hour = **~$43**<br>- Active (jobs): ~10 hours * 4 ACUs * ~$0.12/ACU-hour = **~$5**<br>- Storage (200 GB): 200 GB * ~$0.10/GB-month = **$20**. <br>Total Aurora cost: **~$68**.<br><br>**Bedrock (Embeddings):** Still negligible. = **~$1**. | **$80 - $120** |
| **Continuous Training** | **Amazon SageMaker Training** | **No change.** This remains a very low, infrequent cost.<br>- 1 run/month * 4 hours/run * ~$1.196/hour = **~$4.78**. | **$10 - $20** |
| **Batch Inference** | **Amazon EKS** | **No change.** Our strategy of using EKS with **scale-to-zero** remains the most cost-effective way to get the high performance of vLLM for the short duration of the batch job.<br>- 4 runs/month * 2 hours/run * ~$1.196/hour = **~$9.57**. | **$30 - $50** |
| **Summary Caching & Logging**| **Amazon DynamoDB**<br>**Amazon CloudWatch** | **No change.** These services are already serverless and cost-effective.<br>- DynamoDB: **~$10**.<br>- CloudWatch: **~$40**. | **$50 - $100** |
| **Total Estimated Monthly Cost**| **-** | **-** | **$170 - $290** |


By switching from persistent managed services (MWAA, OpenSearch) to a **serverless-first architecture (Step Functions, Aurora Serverless v2)**, we have reduced the estimated monthly cost by over **70%**, from ~$850 down to **~$230**. This new cost profile is far more aligned with the expected ROI for a feature like this at a mid-sized company. It makes the project not just technically impressive, but also financially sound and sustainable.
-->

___

<!--

### Challenges and learnings

## 12.1 Challenge 1: The Silent Data Corruption Bug

### Chronology of Events:
1. **Discovery (Week 1-2)**: The project's automated model quality monitoring system began to register a slow, gradual decline in the "summary relevance" score, specifically for the "Home & Kitchen" product category. The decline was subtle, remaining within the "warning" threshold and thus not triggering a high-priority alert. The first concrete signal of a problem came from a stakeholder: a senior product manager filed a bug report stating that summaries for newly launched kitchen appliances felt "generic and unhelpful," lacking specific details mentioned in the reviews.
2. **Initial Investigation (Week 2)**: The on-call ML engineering team was assigned the ticket. Their initial hypothesis was model drift. They reran the standard evaluation pipeline on the deployed model artifact against the version-controlled "golden" evaluation dataset. The model passed with flying colors, showing no degradation. This deepened the mystery. Suspecting concept drift in the live data, they triggered an emergency retraining job using the most recent two weeks of data. The newly fine-tuned model, however, exhibited the same poor performance on recent traffic, and offline metrics showed no improvement. The team was now confident the model architecture and training code were not the problem.
3. **Cross-Team Interaction (Week 3)**: The ML team escalated the issue to the Data Engineering (DE) team, providing specific examples of poor summaries and the corresponding raw reviews. The DE team investigated their data pipelines, checking monitoring dashboards for data volume, processing latency, and schema validation errors. All metrics appeared normal. From their perspective, the data was flowing correctly and conformed to the established schema. They initially closed the ticket, reporting "no issues found in the data pipeline."
4. **Deep Dive and Discovery (Week 4)**: The ML team, convinced the problem lay in the data, pushed for a joint investigation. A "war room" was established with members from the ML, DE, and mobile client teams. The team began to manually inspect the raw, byte-level JSON data being ingested into the Kafka topic for the affected products. The breakthrough came when an engineer noticed that reviews submitted from the latest version of the Android application had an unusual character encoding pattern. They discovered that a recent update to a third-party UI library used in the app's review submission form had a bug: if a user included an emoji in their review text, the entire string was silently encoded in a non-standard UTF-8 variant. The JSON structure itself remained valid, so it passed all schema validation checks. However, the text content was effectively garbled in a way that was not immediately obvious in many UI tools but was catastrophic for the downstream NLP models. The embedding model, unable to parse the garbled text, was generating near-zero or meaningless vectors, which were then treated as noise by the summarization model.
5. **Root Cause and Resolution (Week 5)**: The root cause was identified as a lack of semantic data validation at the point of ingestion. The system was checking the structure of the data, but not its content. The resolution was multi-pronged:
    - **Immediate Fix**: The mobile team developed and deployed a hotfix for the Android app to correct the encoding issue.
    - **Pipeline Enhancement**: The DE team added a new "semantic validation" microservice to the stream processing pipeline. This service used a lightweight model to check for text intelligibility and language consistency, automatically quarantining any records that failed this check into a dead-letter queue for manual inspection.
    - **Data Correction**: A large-scale backfill job was designed and executed to re-process two months' worth of corrupted review data from the data lake, regenerate the correct embeddings, and re-index them in the vector database.

### Retrospective and Lessons Learned:
- **Initial Approach vs. Better Approach**: The initial approach relied solely on schema validation, assuming that structurally correct data was semantically correct. A better approach, now implemented, is a defense-in-depth strategy for data quality that includes both structural and semantic validation checks as early as possible in the pipeline.
- **Production Bugs and Regrets**: The biggest regret was the siloed initial investigation. The assumption that the problem must be "in the model" or "in the data pipeline" led to wasted time. The issue was at the intersection of the client, the data, and the model, and could only be solved by cross-functional collaboration.
- **Key Takeaways**: This incident underscored that for NLP systems, data quality is not just about schema, it's about semantics. It also highlighted the critical need for blameless, cross-functional post-mortem cultures. Without the joint task force, the teams might have continued to blame each other's components indefinitely.

---

## 12.2 Challenge 2: The "Helpful" Hallucination Crisis

### Chronology of Events:
1. **Launch (Day 1)**: A new, fine-tuned Llama-3-8B model, which showed a 15% improvement on offline metrics, was deployed to production using a canary strategy, starting with 5% of user traffic. Initial monitoring of system and business metrics was positive: latency remained within SLA, and early data suggested a slight uplift in user engagement.
2. **Incident Declaration (Day 3)**: A sev-1 (highest severity) incident was declared. The customer service department reported a sudden, sharp increase in complaints related to "misleading" and "factually incorrect" review summaries. The issue gained public visibility when a tech influencer posted on social media a screenshot of a summary for a new flagship laptop. The summary prominently featured the line, "Users praise the exceptional 10-hour battery life," while the top three most helpful user reviews on the same page clearly stated the battery life was a major weakness, lasting only 2-3 hours. The platform was accused of intentionally manipulating summaries to hide negative feedback.
3. **Investigation (Day 3-7)**: The team immediately rolled back the canary release to the previous model version, stopping the user impact. The subsequent investigation proved difficult and stressful due to the public scrutiny. The model passed all of its offline faithfulness tests, including LLM-as-a-judge evaluations. The team could not reproduce the issue on their standard test cases. After days of analysis, they discovered the failure mode was highly specific: it only occurred on products with a large volume of reviews (over 500) and highly polarized or conflicting opinions. The RAG system was correctly retrieving a mix of positive and negative review snippets. However, the new fine-tuned model had developed a subtle but dangerous bias. The fine-tuning dataset, while large, had been sourced primarily from products with generally positive or neutral reviews. This had inadvertently taught the model a "positivity bias": when presented with conflicting information, it learned to over-emphasize positive statements, especially those containing strong, superlative keywords like "exceptional," "perfect," or "amazing," even if those statements came from older, less helpful reviews.
4. **Solution Exploration (Week 2-3)**: A multi-pronged effort was launched to address the root cause.
    - **Prompt Engineering**: The team experimented with adding stronger negative constraints and balancing instructions to the prompt, such as, "You must give equal weight to both positive and negative opinions. Explicitly mention any significant points of disagreement among reviewers." This provided a partial improvement but did not fully eliminate the bias.
    - **RAG Strategy Modification**: The retrieval logic was fundamentally changed. Instead of retrieving a generic set of "relevant" snippets, the new strategy was explicitly designed to retrieve a balanced set: the top 3 most "helpful" positive review snippets and the top 3 most "helpful" negative review snippets.
    - **Data-Centric Re-tuning**: The most intensive effort involved curating a new fine-tuning dataset. The team specifically identified 1,000 products with highly polarized reviews and had human annotators create high-quality, balanced summaries for them. They also used the production model to synthesize additional negative examples to augment the dataset and explicitly teach the model how to handle conflicting information.
5. **Resolution (Week 4)**: The final solution was a combination of the improved, balanced RAG strategy and a new model fine-tuned on the specially curated "conflicting opinions" dataset. Before redeployment, this new system was subjected to a new, rigorous evaluation process that included an "adversarial test set" of 100 of the most contentious products on the platform, with every summary being manually reviewed by the product and legal teams.

### Retrospective and Lessons Learned:
- **Initial Approach vs. Better Approach**: The initial fine-tuning approach focused on data volume but neglected data diversity and distribution. The team assumed that a large, random sample of data would be representative. The better approach is a data-centric one that actively identifies and oversamples for known edge cases and difficult scenarios, such as products with polarized feedback.
- **Production Bugs and Regrets**: The team regretted not having a more robust "red teaming" process before the initial launch. A dedicated effort to manually try and "break" the model with difficult products could have revealed this bias before it impacted customers.
- **Key Takeaways**: This incident demonstrated that fine-tuning is not a neutral process; it can introduce subtle and harmful biases that are not captured by standard offline metrics. It also showed that in a RAG system, the retrieval strategy is as important as the retrieval technology. The logic of what context to provide to the LLM is a critical, tunable part of the system that directly impacts the final output's quality and fairness.

---

## 12.3 Challenge 3: The Latency Death Spiral at Peak Traffic

### Chronology of Events:
1. **Pre-Production Testing (Month 1)**: The system underwent extensive load testing using a standard industry tool that generated a uniform, high-volume load of requests. The system performed well, comfortably meeting the P99 latency Service Level Objective (SLO) of 800ms. The deployment architecture used a standard Kubernetes Horizontal Pod Autoscaler (HPA) configured to scale the number of GPU-powered inference pods based on average CPU utilization.
2. **Production Incident (Black Friday Peak)**: During the Black Friday sales event, as site traffic surged to its annual peak, the summary service entered a catastrophic failure mode. The monitoring dashboards showed P99 latency skyrocketing to over 5,000ms. This caused timeouts in the upstream microservices that called the summary service, leading to sections of the product detail page failing to load for users. The HPA responded to the increased load by rapidly scaling up the number of inference pods. However, counter-intuitively, this action made the latency even worse. The Kubernetes cluster eventually ran out of available GPU capacity, and newly scheduled pods became stuck in a "pending" state, unable to acquire resources.
3. **War Room Debugging (Hours 1-4)**: A high-priority war room was convened, involving the on-call SRE, ML Platform, and application development teams. The initial hypotheses included a potential DDoS attack, a memory leak in the inference service, or a "poison pill" request causing the model to enter an infinite loop. After hours of frantic debugging, the team identified the root cause: a toxic interaction between the LLM serving engine's batching mechanism and the naive CPU-based autoscaling configuration. The vLLM serving engine was configured to use continuous batching to maximize GPU throughput. As traffic increased, the average batch size grew, which is generally good for efficiency. However, for very large batches, the per-request latency also increases slightly. The HPA, which was configured to scale up when pod CPU utilization crossed a threshold, correctly identified that the pods were working harder and tried to add more replicas. But as new pods were added, the incoming request stream was split among more workers. This caused the average batch size per pod to decrease. Smaller batches are less efficient on GPUs, leading to lower overall throughput and higher per-request latency. This created a vicious, positive feedback loop: increased traffic led to HPA scaling up, which led to smaller batches, which led to lower efficiency and higher latency, which was interpreted by the HPA as even higher load, causing it to scale up further, leading to a complete system meltdown.
4. **Mitigation and Resolution (Hours 5-6)**:
    - **Immediate Mitigation**: The team manually overrode the HPA, setting the number of replicas to a high, fixed number that they knew could handle the peak load. This stabilized the service, as it allowed the serving engine to form large, efficient batches again.
    - **Long-Term Resolution**: The post-mortem identified several critical architectural flaws. The long-term fix was multi-layered:
        1. The HPA configuration was changed to scale based on a more appropriate custom metric: average GPU utilization, which is a direct measure of load for a GPU-bound workload.
        2. A request queuing and load-leveling service was implemented in front of the inference service. This smoothed out the "spiky" nature of user traffic, allowing the vLLM engine to pull requests at a steady rate and form optimally sized batches.
        3. A graceful degradation mechanism was introduced. The team fine-tuned a much smaller, faster model variant (Gemma-2B). A new feature flag was added to the inference service: if the end-to-end latency exceeds the SLO, the service can be switched to use the smaller fallback model, which provides slightly lower-quality summaries but guarantees a fast response, preventing cascading failures.

### Retrospective and Lessons Learned:
- **Initial Approach vs. Better Approach**: The initial approach treated LLM serving like a standard, stateless web service, applying generic CPU-based autoscaling rules. The better approach acknowledges that LLM inference is a unique type of workload. Its performance is non-linear and heavily dependent on batching strategy and GPU utilization. The autoscaling logic must be custom-tailored to these characteristics.
- **Production Bugs and Regrets**: The team regretted the inadequacy of their pre-production load testing. The tests simulated high volume but not realistic traffic patterns with sudden spikes and lulls. A more realistic load profile would have likely triggered this failure mode in a controlled environment.
- **Key Takeaways**: This incident was a stark lesson that LLM serving is a specialized infrastructure discipline. Standard DevOps and SRE practices for microservices do not always apply directly and can even be harmful. Productionizing LLMs requires deep, collaborative expertise that spans machine learning, software engineering, and infrastructure/SRE. The ML team understands the model's performance curves, while the SRE team understands the infrastructure's failure modes. These complex, systemic issues can only be prevented and resolved when these teams work together from the initial design phase.

-->



___

### Implementation: Data Ingestion Pipeline

#### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_ingestion.png" width="100%" style="background-color: #FCF1EF;"/>

#### Python Scripts

```python
import logging
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)

def get_new_reviews(db_connection_string: str, execution_date: str) -> pd.DataFrame:
    """
    Extracts new reviews from the source database created in the last 24 hours.
    
    Args:
        db_connection_string: The database connection string.
        execution_date: The date of the DAG run (for reproducibility).

    Returns:
        A pandas DataFrame with new reviews.
    """
    try:
        logging.info("Connecting to the source database...")
        engine = create_engine(db_connection_string)
        
        # Calculate the time window for the query
        end_date = datetime.fromisoformat(execution_date)
        start_date = end_date - timedelta(days=1)
        
        query = f"""
        SELECT review_id, product_id, user_id, star_rating, review_text, created_at
        FROM public.reviews
        WHERE created_at >= '{start_date.strftime('%Y-%m-%d %H:%M:%S')}'
        AND created_at < '{end_date.strftime('%Y-%m-%d %H:%M:%S')}'
        """
        
        logging.info(f"Executing query for reviews between {start_date} and {end_date}.")
        with engine.connect() as connection:
            df = pd.read_sql(query, connection)
        
        logging.info(f"Successfully extracted {len(df)} new reviews.")
        return df
    except Exception as e:
        logging.error(f"Failed to extract reviews: {e}")
        raise
```

```python
import logging
import pandas as pd
import re
from bs4 import BeautifulSoup
from langdetect import detect
# Assume presidio and detoxify are installed
# from presidio_analyzer import AnalyzerEngine
# from detoxify import Detoxify

logging.basicConfig(level=logging.INFO)

# For demonstration, we'll mock the PII/Toxicity models to avoid heavy dependencies
# In a real scenario, these would be initialized properly.
# analyzer = AnalyzerEngine()
# toxicity_classifier = Detoxify('original')

def _clean_html(text: str) -> str:
    """Removes HTML tags from text."""
    return BeautifulSoup(text, "html.parser").get_text()

def _normalize_text(text: str) -> str:
    """Lowercases, removes special chars, and normalizes whitespace."""
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    return " ".join(text.split())

def _redact_pii(text: str) -> str:
    """Mocks PII redaction."""
    # In production, this would use Presidio:
    # results = analyzer.analyze(text=text, language='en')
    # for result in results:
    #     text = text.replace(text[result.start:result.end], f'[{result.entity_type}]')
    mock_redacted_text = re.sub(r'\S+@\S+', '[EMAIL]', text)
    return mock_redacted_text
    
def _get_toxicity_score(text: str) -> float:
    """Mocks toxicity scoring."""
    # In production, this would use Detoxify:
    # score = toxicity_classifier.predict(text)['toxicity']
    if "hate" in text or "stupid" in text:
        return 0.9
    return 0.1

def transform_reviews(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies a series of transformations to the raw reviews DataFrame.
    """
    logging.info(f"Starting transformation of {len(df)} reviews.")
    
    # Clean and normalize text
    df['cleaned_text'] = df['review_text'].apply(_clean_html).apply(_normalize_text)
    
    # Filter out "noise" reviews
    df = df[df['cleaned_text'].str.split().str.len() >= 5].copy()
    logging.info(f"{len(df)} reviews remaining after noise filtering.")

    # Safety and Privacy
    df['cleaned_text'] = df['cleaned_text'].apply(_redact_pii)
    df['toxicity_score'] = df['cleaned_text'].apply(_get_toxicity_score)
    df = df[df['toxicity_score'] < 0.8].copy()
    logging.info(f"{len(df)} reviews remaining after toxicity filtering.")

    # Language Detection
    df['language'] = df['cleaned_text'].apply(lambda x: detect(x) if x.strip() else 'unknown')
    
    final_df = df[['review_id', 'product_id', 'user_id', 'star_rating', 'cleaned_text', 'language', 'toxicity_score', 'created_at']]
    logging.info("Transformation complete.")
    return final_df
```

```python
import logging
import pandas as pd
import great_expectations as ge

logging.basicConfig(level=logging.INFO)

def validate_cleaned_data(df: pd.DataFrame) -> bool:
    """
    Validates the cleaned data using a Great Expectations suite.
    """
    logging.info("Validating cleaned data...")
    ge_df = ge.from_pandas(df)
    
    # Define expectations
    ge_df.expect_column_to_exist("review_id")
    ge_df.expect_column_values_to_not_be_null("review_id")
    ge_df.expect_column_values_to_be_unique("review_id")
    ge_df.expect_column_values_to_be_in_set("star_rating", [1, 2, 3, 4, 5])
    ge_df.expect_column_values_to_not_be_null("cleaned_text")
    ge_df.expect_column_values_to_be_in_set("language", ["en", "de", "fr", "es", "it", "nl"]) # Example languages
    
    validation_result = ge_df.validate()
    if not validation_result["success"]:
        logging.error("Data validation failed!")
        logging.error(validation_result)
        return False
        
    logging.info("Data validation successful.")
    return True
```

```python
import logging
import pandas as pd
import subprocess

logging.basicConfig(level=logging.INFO)

def save_and_version_data(df: pd.DataFrame, local_path: str, s3_bucket: str, execution_date: str) -> None:
    """
    Saves the DataFrame to a local Parquet file and uses DVC to version and push to S3.
    """
    try:
        # Save to local filesystem (accessible by Airflow worker)
        file_path = f"{local_path}/cleaned_reviews_{execution_date}.parquet"
        logging.info(f"Saving cleaned data to {file_path}")
        df.to_parquet(file_path, index=False)
        
        # DVC commands to version and push the data
        # Assumes DVC is initialized and remote is configured
        logging.info("Versioning data with DVC...")
        subprocess.run(["dvc", "add", file_path], check=True)
        
        logging.info("Pushing data to S3 remote with DVC...")
        subprocess.run(["dvc", "push", f"{file_path}.dvc"], check=True)

        logging.info("Data successfully saved and versioned.")
    except Exception as e:
        logging.error(f"Failed to save and version data: {e}")
        raise
```

#### Unit Tests

```python
import pandas as pd
from src.pipelines.ingestion.transform import transform_reviews

def test_transform_reviews():
    # Arrange
    raw_data = {
        'review_id': [1, 2, 3, 4, 5],
        'product_id': ['A', 'A', 'B', 'B', 'C'],
        'user_id': [101, 102, 103, 104, 105],
        'star_rating': [5, 1, 3, 4, 5],
        'review_text': [
            '<p>This is GREAT!</p>',
            'I hate this product. It is stupid.', # Should be filtered by toxicity
            'Too short.', # Should be filtered by length
            'My email is test@example.com', # Should be redacted
            'Un produit fantastique en français.'
        ],
        'created_at': pd.to_datetime(['2024-01-01', '2024-01-01', '2024-01-01', '2024-01-01', '2024-01-01'])
    }
    raw_df = pd.DataFrame(raw_data)

    # Act
    transformed_df = transform_reviews(raw_df)

    # Assert
    assert len(transformed_df) == 3 # Should filter 2 rows
    assert transformed_df.iloc[1]['cleaned_text'] == 'my email is [EMAIL]'
    assert transformed_df.iloc[0]['language'] == 'en'
    assert transformed_df.iloc[2]['language'] == 'fr'
    assert 'toxicity_score' in transformed_df.columns
```

#### Pipeline (Airflow DAG)

```python
from __future__ import annotations

import pendulum
from airflow.models.dag import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
# Assuming custom Python modules are in a package installed in the Airflow environment
from src.pipelines.ingestion import extract, transform, validate, load

S3_BUCKET = "my-ecommerce-mlops-bucket"
LOCAL_DATA_PATH = "/tmp/data" # Path on the Airflow worker

def extract_task(ti):
    hook = PostgresHook(postgres_conn_id="source_db_conn")
    conn_string = hook.get_uri()
    reviews_df = extract.get_new_reviews(conn_string, ti.execution_date.to_iso8601_string())
    # Push to XComs for the next task
    ti.xcom_push(key="raw_reviews_df", value=reviews_df.to_json())

def transform_task(ti):
    raw_reviews_json = ti.xcom_pull(task_ids="extract_new_reviews", key="raw_reviews_df")
    raw_df = pd.read_json(raw_reviews_json)
    transformed_df = transform.transform_reviews(raw_df)
    ti.xcom_push(key="transformed_reviews_df", value=transformed_df.to_json())

def validate_task(ti):
    transformed_reviews_json = ti.xcom_pull(task_ids="transform_raw_reviews", key="transformed_reviews_df")
    transformed_df = pd.read_json(transformed_reviews_json)
    if not validate.validate_cleaned_data(transformed_df):
        raise ValueError("Data validation failed, stopping pipeline.")
    # If validation succeeds, the original df is passed through
    ti.xcom_push(key="validated_reviews_df", value=transformed_df.to_json())


def load_task(ti):
    validated_reviews_json = ti.xcom_pull(task_ids="validate_transformed_reviews", key="validated_reviews_df")
    validated_df = pd.read_json(validated_reviews_json)
    load.save_and_version_data(
        df=validated_df, 
        local_path=LOCAL_DATA_PATH, 
        s3_bucket=S3_BUCKET,
        execution_date=ti.execution_date.to_iso8601_string()
    )


with DAG(
    dag_id="data_ingestion_and_cleaning",
    start_date=pendulum.datetime(2024, 1, 1, tz="UTC"),
    schedule="0 1 * * *",  # Run daily at 1 AM UTC
    catchup=False,
    tags=["data-eng", "ingestion"],
) as dag:
    extract_new_reviews = PythonOperator(
        task_id="extract_new_reviews",
        python_callable=extract_task,
    )
    transform_raw_reviews = PythonOperator(
        task_id="transform_raw_reviews",
        python_callable=transform_task,
    )
    validate_transformed_reviews = PythonOperator(
        task_id="validate_transformed_reviews",
        python_callable=validate_task,
    )
    load_and_version_data = PythonOperator(
        task_id="load_and_version_data",
        python_callable=load_task,
    )

    extract_new_reviews >> transform_raw_reviews >> validate_transformed_reviews >> load_and_version_data
```

#### Integration Test

```python
import pytest
from airflow.models.dagbag import DagBag

# This test checks the structural integrity of the DAG
def test_dag_loaded():
    dagbag = DagBag(dag_folder='dags/', include_examples=False)
    assert dagbag.get_dag(dag_id='data_ingestion_and_cleaning') is not None
    assert 'data_ingestion_and_cleaning' in dagbag.dags

# A more complex integration test would use the Airflow API
# to trigger a run in a staging environment and check the output in S3.
# This requires a running Airflow and is often done in a separate CI/CD stage.
#
# Example using pytest-airflow:
# from pytest_airflow import clirunner
#
# def test_dag_run_successfully(clirunner):
#     result = clirunner("dags", "test", "data_ingestion_and_cleaning", "2024-01-01")
#     assert result.return_code == 0, "DAG run failed"
#
#     # Add assertions here to check for output artifacts in a mock S3 bucket
```

#### CI/CD Workflow (Github Actions)

```yaml
name: Deploy Data Ingestion Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/ingestion/**'
      - 'dags/data_ingestion_dag.py'
      - 'tests/pipelines/ingestion/**'

jobs:
  lint-and-unit-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run linter
        run: flake8 src/pipelines/ingestion/ dags/data_ingestion_dag.py

      - name: Run unit tests
        run: pytest tests/pipelines/ingestion/

  deploy-to-production:
    needs: lint-and-unit-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Sync DAG to Production MWAA Bucket
        run: |
          aws s3 sync ./dags s3://${{ secrets.MWAA_PROD_DAGS_BUCKET }}/dags --delete
          # In a real project, you would also sync your custom Python package
          # aws s3 sync ./src s3://${{ secrets.MWAA_PROD_PLUGINS_BUCKET }}/src
```
___

### Implementation: Embeddings Generation Pipeline

#### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_embeddings.png" width="100%" style="background-color: #FCF1EF;"/>


#### Python Scripts

```python
import logging
import pandas as pd
import subprocess

logging.basicConfig(level=logging.INFO)

def get_latest_cleaned_data(local_path: str, execution_date: str) -> pd.DataFrame:
    """
    Uses DVC to pull the latest version of the cleaned data corresponding to the execution date.
    """
    file_path = f"{local_path}/cleaned_reviews_{execution_date}.parquet"
    dvc_file_path = f"{file_path}.dvc"
    try:
        logging.info(f"Using DVC to pull data for {dvc_file_path}...")
        # Ensure the .dvc file itself is present before pulling
        # In a real Airflow setup, the repo would be synced.
        subprocess.run(["dvc", "pull", dvc_file_path], check=True, capture_output=True)
        
        logging.info(f"Loading data from {file_path} into pandas DataFrame.")
        df = pd.read_parquet(file_path)
        logging.info(f"Successfully loaded {len(df)} records.")
        return df
    except FileNotFoundError:
        logging.error(f"DVC file not found: {dvc_file_path}. Did the ingestion pipeline run successfully?")
        raise
    except Exception as e:
        logging.error(f"Failed to retrieve data with DVC: {e}")
        logging.error(f"DVC output: {e.stdout.decode() if hasattr(e, 'stdout') else ''}")
        raise
```

```python
import logging
import pandas as pd
import boto3
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter

logging.basicConfig(level=logging.INFO)

def generate_embeddings(reviews_df: pd.DataFrame, bedrock_client) -> list:
    """
    Chunks review text and generates embeddings using Amazon Bedrock.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=256,
        chunk_overlap=32,
        length_function=len,
    )
    
    all_embeddings_data = []
    
    logging.info(f"Starting embedding generation for {len(reviews_df)} reviews.")
    for index, row in reviews_df.iterrows():
        chunks = text_splitter.split_text(row['cleaned_text'])
        
        for chunk in chunks:
            body = json.dumps({"inputText": chunk})
            response = bedrock_client.invoke_model(
                body=body,
                modelId="amazon.titan-embed-text-v2:0",
                accept="application/json",
                contentType="application/json",
            )
            response_body = json.loads(response.get("body").read())
            embedding = response_body.get("embedding")
            
            all_embeddings_data.append({
                "review_id": row['review_id'],
                "product_id": row['product_id'],
                "star_rating": row['star_rating'],
                "language": row['language'],
                "chunk_text": chunk,
                "embedding": embedding,
            })
    
    logging.info(f"Successfully generated {len(all_embeddings_data)} embeddings.")
    return all_embeddings_data
```

```python
import logging
import psycopg2
import psycopg2.extras
from pgvector.psycopg2 import register_vector

logging.basicConfig(level=logging.INFO)

def index_embeddings_in_db(embedding_data: list, db_params: dict) -> None:
    """
    Indexes the generated embeddings and metadata into the Aurora PostgreSQL DB with pgvector.
    """
    try:
        logging.info(f"Connecting to the vector database...")
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cur:
                register_vector(cur)
                
                insert_query = """
                INSERT INTO review_embeddings (review_id, product_id, star_rating, language, chunk_text, embedding)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (review_id, chunk_text) DO NOTHING; 
                """ # Using a simple ON CONFLICT to ensure idempotency

                # Prepare data for batch insert
                data_to_insert = [
                    (
                        item["review_id"],
                        item["product_id"],
                        item["star_rating"],
                        item["language"],
                        item["chunk_text"],
                        item["embedding"],
                    )
                    for item in embedding_data
                ]
                
                logging.info(f"Indexing {len(data_to_insert)} embeddings in batches...")
                psycopg2.extras.execute_batch(cur, insert_query, data_to_insert)
                conn.commit()
                logging.info("Indexing complete.")
    except Exception as e:
        logging.error(f"Failed to index embeddings: {e}")
        raise
```


#### Unit Test

```python
import pandas as pd
from unittest.mock import MagicMock
from src.pipelines.embedding.embed import generate_embeddings

def test_generate_embeddings_batching(mocker):
    # Arrange
    mock_bedrock_client = MagicMock()
    # Mock the return value of invoke_model
    mock_response_body = json.dumps({"embedding": [0.1] * 1024})
    mock_stream = MagicMock()
    mock_stream.read.return_value = mock_response_body.encode('utf-8')
    mock_bedrock_client.invoke_model.return_value = {"body": mock_stream}
    
    mocker.patch('boto3.client', return_value=mock_bedrock_client)

    test_data = {
        'review_id': [1],
        'product_id': ['A'],
        'star_rating': [5],
        'language': ['en'],
        'cleaned_text': ['This is the first sentence. This is the second sentence.']
    }
    test_df = pd.DataFrame(test_data)

    # Act
    embedding_data = generate_embeddings(test_df, mock_bedrock_client)

    # Assert
    assert len(embedding_data) == 2 # The text should be split into two chunks
    assert mock_bedrock_client.invoke_model.call_count == 2
    assert embedding_data[0]['review_id'] == 1
    assert "embedding" in embedding_data[0]
    assert len(embedding_data[0]['embedding']) == 1024
```

#### Pipeline Code (Airflow DAG)

```python
from __future__ import annotations
import pendulum
from airflow.models.dag import DAG
from airflow.operators.python import PythonOperator
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.providers.amazon.aws.hooks.bedrock import BedrockHook
from airflow.providers.amazon.aws.hooks.secrets_manager import SecretsManagerHook
# Assuming custom Python modules are installed
from src.pipelines.embedding import retrieve, embed, load

LOCAL_DATA_PATH = "/tmp/data"

def retrieve_data_task(ti):
    # This task gets the output from the ingestion DAG
    # For simplicity, we assume the execution date matches.
    execution_date = ti.execution_date.to_iso8601_string()
    reviews_df = retrieve.get_latest_cleaned_data(LOCAL_DATA_PATH, execution_date)
    ti.xcom_push(key="reviews_df_json", value=reviews_df.to_json())

def embed_task(ti):
    reviews_json = ti.xcom_pull(task_ids="retrieve_cleaned_data", key="reviews_df_json")
    reviews_df = pd.read_json(reviews_json)
    
    bedrock_hook = BedrockHook(aws_conn_id='aws_default')
    bedrock_client = bedrock_hook.get_conn()
    
    embedding_data = embed.generate_embeddings(reviews_df, bedrock_client)
    ti.xcom_push(key="embedding_data", value=embedding_data)

def load_task(ti):
    embedding_data = ti.xcom_pull(task_ids="generate_review_embeddings", key="embedding_data")
    
    secrets_hook = SecretsManagerHook(aws_conn_id='aws_default')
    db_secret = secrets_hook.get_secret_value("aurora/vector_db/credentials")
    db_params = json.loads(db_secret)
    
    load.index_embeddings_in_db(embedding_data, db_params)

with DAG(
    dag_id="embedding_generation",
    start_date=pendulum.datetime(2024, 1, 1, tz="UTC"),
    schedule=None,  # Triggered by the ingestion DAG
    catchup=False,
    tags=["data-eng", "embedding", "rag"],
) as dag:
    wait_for_ingestion = ExternalTaskSensor(
        task_id="wait_for_ingestion_dag",
        external_dag_id="data_ingestion_and_cleaning",
        external_task_id="load_and_version_data",
        allowed_states=["success"],
        execution_delta=pendulum.duration(hours=0),
    )
    
    retrieve_cleaned_data = PythonOperator(task_id="retrieve_cleaned_data", python_callable=retrieve_data_task)
    generate_review_embeddings = PythonOperator(task_id="generate_review_embeddings", python_callable=embed_task)
    index_embeddings = PythonOperator(task_id="index_embeddings", python_callable=load_task)

    wait_for_ingestion >> retrieve_cleaned_data >> generate_review_embeddings >> index_embeddings
``` 


#### Integration Test

This is a critical test that validates the entire workflow, ensuring that all components (Airflow, Python scripts, IAM permissions, and AWS services) work together correctly in a production-like environment.

The artifacts are structured into three parts:
1.  **Setup Scripts:** To prepare the staging environment for a clean, repeatable test run.
2.  **Verification Script:** The `pytest` script that runs after the pipeline execution to assert the correctness of the results.
3.  **CI/CD Workflow:** The GitHub Actions workflow that orchestrates the entire process: setup, execution, and verification.

##### **1. Setup Scripts & Data**

This script is responsible for creating the necessary preconditions for the test.

**`tests/integration/setup_embedding_test.py`**
```python
import logging
import pandas as pd
import boto3
import subprocess
import os
import psycopg2

# --- Test Configuration ---
TEST_EXECUTION_DATE = "2025-01-01T00:00:00+00:00"
TEST_REVIEW_ID = "test_review_001"
STAGING_BUCKET = os.environ["STAGING_S3_BUCKET"]
LOCAL_DATA_PATH = "/tmp/staging_data"

# Database connection params from environment variables
DB_PARAMS = {
    "host": os.environ["STAGING_DB_HOST"],
    "port": os.environ["STAGING_DB_PORT"],
    "dbname": os.environ["STAGING_DB_NAME"],
    "user": os.environ["STAGING_DB_USER"],
    "password": os.environ["STAGING_DB_PASSWORD"],
}

logging.basicConfig(level=logging.INFO)

def create_test_data():
    """Creates a sample DataFrame for the test."""
    # This text is designed to be split into two chunks by our splitter configuration
    long_text = (
        "This is the first sentence of a moderately long review. "
        "It provides some initial positive feedback on the product's build quality. "
        "The reviewer seems generally happy with their purchase so far. "
        "Now we move on to the second part of the review which discusses the battery life. "
        "Unfortunately, the battery does not last as long as advertised, which is a significant drawback."
    )
    data = {
        'review_id': [TEST_REVIEW_ID],
        'product_id': ['product_abc'],
        'user_id': [999],
        'star_rating': [3],
        'cleaned_text': [long_text],
        'language': ['en'],
        'toxicity_score': [0.1],
        'created_at': [pd.to_datetime(TEST_EXECUTION_DATE)]
    }
    return pd.DataFrame(data)

def upload_and_version_data(df: pd.DataFrame):
    """Saves data locally, uploads to S3, and creates DVC file."""
    os.makedirs(LOCAL_DATA_PATH, exist_ok=True)
    
    # Path names must match what the Airflow DAG expects
    execution_date_str = pd.to_datetime(TEST_EXECUTION_DATE).strftime('%Y-%m-%dT%H:%M:%S%z')
    file_name = f"cleaned_reviews_{execution_date_str}.parquet"
    local_file_path = os.path.join(LOCAL_DATA_PATH, file_name)
    
    logging.info(f"Saving test data to {local_file_path}")
    df.to_parquet(local_file_path, index=False)
    
    # Upload to S3 (simulating DVC remote)
    s3_client = boto3.client("s3")
    s3_key = f"data/{file_name}" # DVC would use a hash, but this is simpler for a test
    s3_client.upload_file(local_file_path, STAGING_BUCKET, s3_key)
    logging.info(f"Uploaded test data to s3://{STAGING_BUCKET}/{s3_key}")
    
    # For a real DVC setup, we would run `dvc add` and `dvc push` here.
    # For this test, placing the file is sufficient.

def clean_staging_db():
    """Ensures the staging DB is clean before the test run."""
    logging.info("Cleaning staging database for a fresh test run.")
    with psycopg2.connect(**DB_PARAMS) as conn:
        with conn.cursor() as cur:
            # Truncate the table to remove any data from previous runs
            cur.execute(f"DELETE FROM review_embeddings WHERE review_id = '{TEST_REVIEW_ID}';")
            conn.commit()
    logging.info("Staging database cleaned.")

if __name__ == "__main__":
    clean_staging_db()
    test_df = create_test_data()
    upload_and_version_data(test_df)
    logging.info("Setup for embedding pipeline integration test is complete.")

```


##### **2. Verification Script (`pytest`)**

This script runs *after* the Airflow DAG has been triggered and has completed successfully.

**`tests/integration/test_embedding_pipeline.py`**
```python
import pytest
import os
import psycopg2
from pgvector.psycopg2 import register_vector

# --- Test Configuration ---
TEST_REVIEW_ID = "test_review_001"
EXPECTED_CHUNKS = 2
EXPECTED_EMBEDDING_DIM = 1024

# Database connection params from environment variables
DB_PARAMS = {
    "host": os.environ["STAGING_DB_HOST"],
    "port": os.environ["STAGING_DB_PORT"],
    "dbname": os.environ["STAGING_DB_NAME"],
    "user": os.environ["STAGING_DB_USER"],
    "password": os.environ["STAGING_DB_PASSWORD"],
}

@pytest.fixture(scope="module")
def db_connection():
    """Provides a reusable database connection for the test module."""
    conn = psycopg2.connect(**DB_PARAMS)
    register_vector(conn)
    yield conn
    conn.close()

def test_embedding_generation_end_to_end(db_connection):
    """
    Verifies that the embedding generation pipeline correctly processed
    and indexed the test data into the staging database.
    """
    # Arrange
    query = f"SELECT chunk_text, embedding FROM review_embeddings WHERE review_id = '{TEST_REVIEW_ID}';"
    
    # Act
    with db_connection.cursor() as cur:
        cur.execute(query)
        results = cur.fetchall()

    # Assert
    assert results is not None, "No results found for the test review ID."
    
    # 1. Verify the number of chunks
    assert len(results) == EXPECTED_CHUNKS, \
        f"Expected {EXPECTED_CHUNKS} chunks, but found {len(results)}."

    # 2. Verify the embedding vectors
    for i, (chunk_text, embedding) in enumerate(results):
        assert isinstance(embedding, list) or hasattr(embedding, 'shape'), \
            f"Embedding for chunk {i} is not a list or array."
        assert len(embedding) == EXPECTED_EMBEDDING_DIM, \
            f"Embedding for chunk {i} has dimension {len(embedding)}, expected {EXPECTED_EMBEDDING_DIM}."

    print(f"\nIntegration test passed: Found {len(results)} chunks with correct embedding dimensions.")

```

#### CI/CD Workflow (GitHub Actions)

This workflow automates the entire test: setup, DAG execution, and verification.

**`.github/workflows/run_embedding_integration_test.yml`**
```yaml
name: Embedding Pipeline Integration Test

on:
  workflow_dispatch: # Allows manual trigger
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/embedding/**'
      - 'dags/embedding_generation_dag.py'

jobs:
  setup:
    name: 1. Setup Staging Environment
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - name: Run setup script
        env:
          STAGING_S3_BUCKET: ${{ secrets.STAGING_S3_BUCKET }}
          STAGING_DB_HOST: ${{ secrets.STAGING_DB_HOST }}
          # ... other DB secrets
        run: python tests/integration/setup_embedding_test.py

  trigger-and-monitor-dag:
    name: 2. Trigger and Monitor Airflow DAG
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install requests
        run: pip install requests
      - name: Trigger and wait for DAG run
        env:
          AIRFLOW_HOST: ${{ secrets.STAGING_AIRFLOW_HOST }}
          AIRFLOW_USERNAME: ${{ secrets.STAGING_AIRFLOW_USERNAME }}
          AIRFLOW_PASSWORD: ${{ secrets.STAGING_AIRFLOW_PASSWORD }}
        # Assume a helper script to trigger and poll the Airflow API
        run: python scripts/trigger_airflow_dag.py --dag-id embedding_generation --execution-date "2025-01-01T00:00:00+00:00"

  verify:
    name: 3. Verify Results in Database
    needs: trigger-and-monitor-dag
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements-dev.txt
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - name: Run verification script
        env:
          STAGING_DB_HOST: ${{ secrets.STAGING_DB_HOST }}
          # ... other DB secrets
        run: pytest tests/integration/test_embedding_pipeline.py
```

<!--

**In the CI/CD file above, I do not see Terraform init and apply, shouldn't we be launching cloud resources using Terraform in staging environment in order to run Integration test ?**

You are absolutely correct. This is an excellent and crucial point that highlights the difference between a simple plan and a robust, production-grade DevOps strategy. My previous CI/CD workflow made a simplifying assumption that a staging environment already exists.

Your intuition is correct: for a truly automated and reliable integration test, the infrastructure the test depends on should be managed as part of the CI/CD process.

Let's refine this with a more sophisticated, real-world approach. There are two primary strategies for handling infrastructure in CI/CD, and the choice depends on a trade-off between speed and isolation.

### Strategy 1: Persistent Staging Environment (Faster CI/CD for App Code)

In this model, you have a long-lived staging environment that mirrors production. The infrastructure is created and updated *only when the Terraform code changes*. The application/pipeline CI/CD pipeline runs *against* this stable environment.

*   **Pros:** Much faster feedback loop for application code changes. The CI/CD run for a Python script change doesn't have to wait 15-30 minutes for an RDS instance to spin up.
*   **Cons:** Less isolation. A broken change from one PR could temporarily affect the staging environment for another.

### Strategy 2: Ephemeral (On-Demand) Environment (Perfect Isolation)

In this model, a completely new, isolated set of infrastructure is created from scratch for each integration test run (or for each pull request).

*   **Pros:** Perfect test isolation. There's no chance of tests interfering with each other. It's the gold standard for preventing flakes.
*   **Cons:** Extremely slow. Spinning up a new Aurora Serverless cluster and other resources for every single test run is impractical and would make the CI/CD pipeline take an hour or more.

### The Recommended Hybrid Approach (Best of Both Worlds)

For this project, the most practical and professional approach is a **hybrid one**. We will have a **Persistent Staging Environment**, but its configuration will be strictly managed by its own dedicated CI/CD workflow.

This means we will now have **two distinct CI/CD workflows**:

1.  **`terraform_ci_cd.yml`:** Manages the infrastructure. It runs *only when `.tf` files change*.
2.  **`run_embedding_integration_test.yml`:** Manages the application code. It *assumes the staging infra exists* and runs its tests against it.

This is the best balance: infrastructure is automated and version-controlled, but application tests get the fast feedback they need.

Here is the updated and complete set of artifacts, reflecting this superior strategy.

---

#### **1. Infrastructure CI/CD Workflow (Manages the Environment)**

This new workflow is responsible for creating and updating our persistent staging environment.

**`.github/workflows/terraform_ci_cd.yml`**
```yaml
name: Deploy Staging Infrastructure

on:
  push:
    branches:
      - main
    paths:
      - 'infra/**' # This workflow ONLY runs when Terraform code changes
  workflow_dispatch:

jobs:
  terraform:
    name: Terraform Plan and Apply
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_wrapper: false

      - name: Terraform Init
        run: terraform -chdir=infra init

      - name: Terraform Validate
        run: terraform -chdir=infra validate

      - name: Terraform Plan
        run: terraform -chdir=infra plan -out=tfplan

      - name: Terraform Apply
        # In a real-world scenario, you would add a manual approval step here
        # for production environments. For staging, auto-apply is often acceptable.
        run: terraform -chdir=infra apply -auto-approve tfplan
```
---
#### **2. Corrected Integration Test CI/CD Workflow (Uses the Environment)**

This is the revised workflow for our application code. It now explicitly states its assumption about the environment.

**`.github/workflows/run_embedding_integration_test.yml`**
```yaml
name: Embedding Pipeline Integration Test

# This workflow assumes a persistent staging environment has been provisioned
# by the terraform_ci_cd.yml workflow. It runs tests AGAINST this environment.

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/embedding/**'
      - 'dags/embedding_generation_dag.py'

jobs:
  setup-test-data:
    name: 1. Setup Staging Test Data
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - name: Run setup script to clean DB and upload test data
        env:
          STAGING_S3_BUCKET: ${{ secrets.STAGING_S3_BUCKET }}
          STAGING_DB_HOST: ${{ secrets.STAGING_DB_HOST }}
          STAGING_DB_PORT: ${{ secrets.STAGING_DB_PORT }}
          STAGING_DB_NAME: ${{ secrets.STAGING_DB_NAME }}
          STAGING_DB_USER: ${{ secrets.STAGING_DB_USER }}
          STAGING_DB_PASSWORD: ${{ secrets.STAGING_DB_PASSWORD }}
        run: python tests/integration/setup_embedding_test.py

  trigger-and-monitor-dag:
    name: 2. Trigger and Monitor Airflow DAG
    needs: setup-test-data
    runs-on: ubuntu-latest
    steps:
      # This part remains the same: it calls the Airflow API in the persistent staging environment
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install requests
        run: pip install requests
      - name: Trigger and wait for DAG run
        env:
          AIRFLOW_HOST: ${{ secrets.STAGING_AIRFLOW_HOST }}
          AIRFLOW_USERNAME: ${{ secrets.STAGING_AIRFLOW_USERNAME }}
          AIRFLOW_PASSWORD: ${{ secrets.STAGING_AIRFLOW_PASSWORD }}
        run: python scripts/trigger_airflow_dag.py --dag-id embedding_generation --execution-date "2025-01-01T00:00:00+00:00"

  verify-results:
    name: 3. Verify Results in Database
    needs: trigger-and-monitor-dag
    runs-on: ubuntu-latest
    steps:
      # This part also remains the same: it connects to the persistent staging DB to check the results
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements-dev.txt
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - name: Run verification script
        env:
          STAGING_DB_HOST: ${{ secrets.STAGING_DB_HOST }}
          STAGING_DB_PORT: ${{ secrets.STAGING_DB_PORT }}
          STAGING_DB_NAME: ${{ secrets.STAGING_DB_NAME }}
          STAGING_DB_USER: ${{ secrets.STAGING_DB_USER }}
          STAGING_DB_PASSWORD: ${{ secrets.STAGING_DB_PASSWORD }}
        run: pytest tests/integration/test_embedding_pipeline.py
```

Thank you for the excellent question. This separation of concerns is a much more professional and scalable way to structure CI/CD for a real-world MLOps project.

-->

___


### Implementation: LLM Fine-tuning Pipeline

#### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_training.png" width="100%" style="background-color: #FCF1EF;"/>


#### Python Scripts

**src/pipelines/training/data_selection.py**
```python
import logging
import pandas as pd
# Assume a helper module for S3 interactions
# from common.s3_utils import list_recent_files

logging.basicConfig(level=logging.INFO)

def select_finetuning_data(s3_bucket: str, s3_prefix: str, sample_size: int = 5000) -> pd.DataFrame:
    """
    Selects a sample of the most recent, high-quality reviews for fine-tuning.
    In a real scenario, this would also blend in a curated multilingual dataset.
    """
    logging.info(f"Selecting data from s3://{s3_bucket}/{s3_prefix}")
    # This is a simplified version. A real implementation would be more robust.
    # recent_files = list_recent_files(s3_bucket, s3_prefix, days=30)
    # dfs = [pd.read_parquet(f"s3://{s3_bucket}/{f}") for f in recent_files]
    # combined_df = pd.concat(dfs)
    # For now, we create a dummy dataframe.
    
    # Let's assume we load a dataset that needs formatting for the trainer.
    # The format should be a text column like:
    # "###Instruction: Summarize these reviews. ###Input: [all review texts] ###Response: [human-written summary]"
    
    dummy_data = {
        "text": [
            f"###Instruction: Summarize these reviews. ###Input: review text {i}. ###Response: ideal summary {i}."
            for i in range(sample_size)
        ]
    }
    sample_df = pd.DataFrame(dummy_data)
    
    logging.info(f"Selected a sample of {len(sample_df)} records for fine-tuning.")
    return sample_df
```

**src/pipelines/training/train.py**
(This script is executed on SageMaker)

```python
import argparse
import logging
import os
import pandas as pd
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig
from trl import SFTTrainer

logging.basicConfig(level=logging.INFO)

def main():
    parser = argparse.ArgumentParser()
    # SageMaker environments
    parser.add_argument("--model_dir", type=str, default=os.environ.get("SM_MODEL_DIR"))
    parser.add_argument("--train_data_dir", type=str, default=os.environ.get("SM_CHANNEL_TRAINING"))
    # Hyperparameters
    parser.add_argument("--base_model_id", type=str, default="mistralai/Mistral-7B-Instruct-v0.1")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--per_device_train_batch_size", type=int, default=4)

    args, _ = parser.parse_known_args()

    # 1. Load data
    train_file = os.path.join(args.train_data_dir, "train.parquet")
    train_dataset = pd.read_parquet(train_file)
    logging.info(f"Loaded {len(train_dataset)} training records.")

    # 2. Load model and tokenizer
    tokenizer = AutoTokenizer.from_pretrained(args.base_model_id)
    tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(args.base_model_id, device_map="auto")

    # 3. Configure PEFT/LoRA
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )

    # 4. Configure Training Arguments
    training_args = TrainingArguments(
        output_dir=os.path.join(args.model_dir, "checkpoints"),
        per_device_train_batch_size=args.per_device_train_batch_size,
        num_train_epochs=args.epochs,
        logging_steps=10,
        save_strategy="epoch",
        report_to="none",
    )

    # 5. Initialize Trainer
    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        peft_config=peft_config,
        dataset_text_field="text",
        max_seq_length=1024,
        tokenizer=tokenizer,
    )

    # 6. Start Training
    logging.info("Starting model fine-tuning...")
    trainer.train()
    logging.info("Training complete.")

    # 7. Save the LoRA adapter
    final_adapter_path = os.path.join(args.model_dir, "adapter")
    trainer.save_model(final_adapter_path)
    logging.info(f"LoRA adapter saved to {final_adapter_path}")

if __name__ == "__main__":
    main()
```


**`src/pipelines/training/evaluate_and_register.py`**

```python
import logging
import pandas as pd
import mlflow
# Assume other necessary imports for evaluation (Ragas, OpenAI)

logging.basicConfig(level=logging.INFO)
MLFLOW_TRACKING_URI = os.environ["MLFLOW_TRACKING_URI"]
PROD_MODEL_NAME = "review-summarizer"
EVALUATION_THRESHOLD = 1.05 # New model must be 5% better

def evaluate_model(adapter_path: str, eval_df: pd.DataFrame) -> dict:
    """Mocks the evaluation process."""
    logging.info(f"Evaluating model adapter from {adapter_path}...")
    # In a real scenario, this would:
    # 1. Load the base model + LoRA adapter.
    # 2. Generate summaries for the evaluation dataframe.
    # 3. Run Ragas and LLM-as-a-judge.
    # We'll return mock scores for this implementation.
    mock_scores = {"faithfulness": 0.98, "coherence": 4.6}
    logging.info(f"Evaluation complete. Scores: {mock_scores}")
    return mock_scores

def register_model(model_artifact_path: str, metrics: dict):
    """Compares metrics and registers the model in MLflow if it's better."""
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    client = mlflow.tracking.MlflowClient()

    try:
        # Get the latest production model's metrics
        latest_prod_version = client.get_latest_versions(PROD_MODEL_NAME, stages=["Production"])[0]
        prod_run = client.get_run(latest_prod_version.run_id)
        prod_faithfulness = prod_run.data.metrics.get("faithfulness", 0)
    except IndexError:
        # No production model exists yet
        prod_faithfulness = 0

    candidate_faithfulness = metrics.get("faithfulness", 0)
    logging.info(f"Candidate faithfulness: {candidate_faithfulness}, Production faithfulness: {prod_faithfulness}")

    if candidate_faithfulness > prod_faithfulness * EVALUATION_THRESHOLD:
        logging.info("Candidate model is better. Registering new version.")
        mlflow.register_model(
            model_uri=f"s3://{model_artifact_path}", # Assuming path is an S3 URI
            name=PROD_MODEL_NAME,
            # Link to the run, log metrics, etc.
        )
        logging.info("Model registration successful.")
    else:
        logging.info("Candidate model is not better than production. Skipping registration.")

# ... main execution block to run these functions
```


#### Unit Tests

**tests/pipelines/training/test_registration.py**

```python
from unittest.mock import MagicMock
import pytest
from src.pipelines.training.evaluate_and_register import register_model

@pytest.fixture
def mock_mlflow_client(mocker):
    """Mocks the MLflow client and its methods."""
    mock_client = MagicMock()
    # Simulate an existing production model
    mock_version = MagicMock()
    mock_version.run_id = "prod_run_id"
    mock_client.get_latest_versions.return_value = [mock_version]
    
    mock_run = MagicMock()
    mock_run.data.metrics = {"faithfulness": 0.95}
    mock_client.get_run.return_value = mock_run
    
    mocker.patch("mlflow.tracking.MlflowClient", return_value=mock_client)
    mocker.patch("mlflow.set_tracking_uri")
    mocker.patch("mlflow.register_model")
    return mock_client

def test_register_model_if_better(mock_mlflow_client):
    # Arrange
    better_metrics = {"faithfulness": 0.99}
    
    # Act
    register_model("s3://path/to/new/model", better_metrics)

    # Assert
    mock_mlflow_client.register_model.assert_called_once()

def test_do_not_register_if_worse(mock_mlflow_client):
    # Arrange
    worse_metrics = {"faithfulness": 0.90}
    
    # Act
    register_model("s3://path/to/new/model", worse_metrics)

    # Assert
    mock_mlflow_client.register_model.assert_not_called()
```

#### Pipeline (Airflow DAG)

**dags/llm_finetuning_dag.py**

```python
from __future__ import annotations
import pendulum
from airflow.models.dag import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.operators.sagemaker import SageMakerTrainingOperator
# ... other imports

# Simplified SageMaker Training Config
sagemaker_training_config = {
    "AlgorithmSpecification": {
        "TrainingImage": "123456789012.dkr.ecr.eu-west-1.amazonaws.com/llm-finetuning-image:latest",
        "TrainingInputMode": "File",
    },
    "RoleArn": "arn:aws:iam::123456789012:role/SageMakerExecutionRole",
    "InputDataConfig": [
        {
            "ChannelName": "training",
            "DataSource": {
                "S3DataSource": {
                    "S3DataType": "S3Prefix",
                    "S3Uri": "s3://my-ecommerce-mlops-bucket/data/training/{{ ds }}/",
                }
            },
        }
    ],
    "OutputDataConfig": {"S3OutputPath": "s3://my-ecommerce-mlops-bucket/models/training-output/"},
    "ResourceConfig": {"InstanceCount": 1, "InstanceType": "ml.g5.2xlarge", "VolumeSizeInGB": 50},
    "StoppingCondition": {"MaxRuntimeInSeconds": 14400},
    "HyperParameters": {"base_model_id": "mistralai/Mistral-7B-Instruct-v0.1", "epochs": "1"},
}

with DAG(
    dag_id="llm_continuous_training",
    start_date=pendulum.datetime(2024, 1, 1, tz="UTC"),
    schedule="0 0 1 * *",  # Run on the 1st of every month
    catchup=False,
    tags=["ml-training", "llm"],
) as dag:
    # PythonOperator for data selection and validation
    select_data_task = PythonOperator(...) 
    
    trigger_sagemaker_training = SageMakerTrainingOperator(
        task_id="trigger_sagemaker_training",
        config=sagemaker_training_config,
        wait_for_completion=True,
    )

    # PythonOperator to run evaluate_and_register.py
    # It will get the model artifact path from the SageMaker job's output (via XComs)
    evaluate_and_register_task = PythonOperator(...)

    select_data_task >> trigger_sagemaker_training >> evaluate_and_register_task
```

#### Infrastructure as Code (Terraform)

```hcl
resource "aws_iam_role" "sagemaker_execution_role" {
  name = "SageMakerExecutionRole"
  # Assume role policy for SageMaker service
}

resource "aws_iam_policy" "sagemaker_policy" {
  name = "SageMakerPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
        Resource = ["arn:aws:s3:::my-ecommerce-mlops-bucket/*"]
      },
      {
        Effect   = "Allow",
        Action   = ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability"],
        Resource = aws_ecr_repository.training_repo.arn
      }
      # Plus CloudWatch logs permissions, etc.
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sagemaker_attach" {
  role       = aws_iam_role.sagemaker_execution_role.name
  policy_arn = aws_iam_policy.sagemaker_policy.arn
}

resource "aws_ecr_repository" "training_repo" {
  name = "llm-finetuning-image"
}
```

#### Integration Test

The artifacts are structured into three parts:
1.  **Setup Scripts & Data:** To prepare the staging environment with the necessary test data.
2.  **Verification Script:** The `pytest` script that runs after the pipeline execution to assert the outcome.
3.  **CI/CD Workflow:** The GitHub Actions workflow that orchestrates the entire process.

**tests/integration/setup_training_test.py**
```python
import logging
import pandas as pd
import boto3
import os

# --- Test Configuration ---
STAGING_BUCKET = os.environ["STAGING_S3_BUCKET"]
EXECUTION_DATE = "2025-01-01" # Matches the test execution date
SAMPLE_SIZE = 50 # Small sample for a quick test run

logging.basicConfig(level=logging.INFO)

def create_finetuning_test_data():
    """Creates a sample DataFrame for the fine-tuning test."""
    # This format matches what the SFTTrainer expects in our train.py script
    data = {
        "text": [
            f"###Instruction: Summarize these reviews. ###Input: Test review text {i}. ###Response: Ideal test summary {i}."
            for i in range(SAMPLE_SIZE)
        ]
    }
    return pd.DataFrame(data)

def upload_data_to_s3(df: pd.DataFrame):
    """Saves data locally and uploads it to the correct S3 path for the DAG."""
    s3_key = f"data/training/{EXECUTION_DATE}/train.parquet"
    local_path = "/tmp/train.parquet"
    
    df.to_parquet(local_path, index=False)
    
    logging.info(f"Uploading test training data to s3://{STAGING_BUCKET}/{s3_key}")
    s3_client = boto3.client("s3")
    s3_client.upload_file(local_path, STAGING_BUCKET, s3_key)
    logging.info("Upload complete.")

def create_mock_evaluation_data():
    """
    Creates a mock evaluation dataset. Our evaluation script needs this
    to run, even though the results are mocked for the integration test.
    """
    eval_data = { "review_text": ["This is a test review for evaluation."] }
    df = pd.DataFrame(eval_data)
    s3_key = "data/evaluation/golden_dataset.parquet"
    local_path = "/tmp/golden_dataset.parquet"
    df.to_parquet(local_path, index=False)
    
    logging.info(f"Uploading mock evaluation data to s3://{STAGING_BUCKET}/{s3_key}")
    s3_client = boto3.client("s3")
    s3_client.upload_file(local_path, STAGING_BUCKET, s3_key)
    logging.info("Upload complete.")


if __name__ == "__main__":
    training_df = create_finetuning_test_data()
    upload_data_to_s3(training_df)
    create_mock_evaluation_data()
    logging.info("Setup for training pipeline integration test is complete.")
```

**Verification Script (pytest)**
**tests/integration/test_training_pipeline.py**

This script runs after the llm_continuous_training DAG has completed successfully. It connects to the staging MLflow server to verify that a new model was registered.

```python
import pytest
import os
import mlflow
from mlflow.tracking import MlflowClient

# --- Test Configuration ---
STAGING_MLFLOW_TRACKING_URI = os.environ["STAGING_MLFLOW_TRACKING_URI"]
MODEL_NAME = "review-summarizer"
TEST_RUN_TAG = "integration_test"
EXECUTION_DATE = "2025-01-01"

@pytest.fixture(scope="module")
def mlflow_client():
    """Provides a reusable MLflow client for the test module."""
    mlflow.set_tracking_uri(STAGING_MLFLOW_TRACKING_URI)
    return MlflowClient()

def test_finetuning_pipeline_registers_new_model_version(mlflow_client):
    """
    Verifies that a new version of the summarizer model was registered by the
    pipeline run, tagged appropriately for this integration test.
    """
    # Arrange: Find the experiment and the specific run for our test
    # In the real DAG, we would add a tag to the MLflow run to identify it.
    experiment = mlflow_client.get_experiment_by_name("llm-finetuning")
    assert experiment is not None, "MLflow experiment 'llm-finetuning' not found."
    
    # Filter runs by tag to find our specific integration test run
    runs = mlflow_client.search_runs(
        experiment_ids=[experiment.experiment_id],
        filter_string=f"tags.airflow_run_id LIKE 'scheduled__{EXECUTION_DATE}%' AND tags.dag_id = 'llm_continuous_training'"
    )
    
    assert len(runs) > 0, f"No MLflow run found for DAG 'llm_continuous_training' on {EXECUTION_DATE}"
    
    test_run = runs[0]
    test_run_id = test_run.info.run_id

    # Act: Get all registered versions for our model
    registered_versions = mlflow_client.get_latest_versions(MODEL_NAME, stages=["None", "Staging"])
    
    # Assert: Check if any of the registered versions came from our test run
    found_match = any(version.run_id == test_run_id for version in registered_versions)
    
    assert found_match, \
        f"Integration test failed: No model version was registered in MLflow for the test run ID {test_run_id}."

    print(f"\nIntegration test passed: Found a newly registered model version from run ID {test_run_id}.")
```

**CI/CD Workflow (GitHub Actions)**
This workflow automates the entire test process.
**.github/workflows/run_training_integration_test.yml**

```yaml
name: Training Pipeline Integration Test

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/training/**'
      - 'dags/llm_finetuning_dag.py'

jobs:
  setup:
    name: 1. Setup Staging Test Data
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.STAGING_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.STAGING_AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      - name: Run setup script to upload test data
        env:
          STAGING_S3_BUCKET: ${{ secrets.STAGING_S3_BUCKET }}
        run: python tests/integration/setup_training_test.py

  trigger-and-monitor-dag:
    name: 2. Trigger and Monitor Airflow DAG
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install requests
        run: pip install requests
      - name: Trigger and wait for DAG run
        env:
          AIRFLOW_HOST: ${{ secrets.STAGING_AIRFLOW_HOST }}
          AIRFLOW_USERNAME: ${{ secrets.STAGING_AIRFLOW_USERNAME }}
          AIRFLOW_PASSWORD: ${{ secrets.STAGING_AIRFLOW_PASSWORD }}
        # This script needs to be robust, polling the Airflow API until the DAG run completes (succeeds or fails)
        # We also pass a special config to the DAG to set max_steps for the training job.
        run: >
          python scripts/trigger_airflow_dag.py 
          --dag-id llm_continuous_training 
          --execution-date "2025-01-01"
          --conf '{"max_steps": 2}'

  verify:
    name: 3. Verify Model Registration in MLflow
    needs: trigger-and-monitor-dag
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements-dev.txt
      - name: Run verification script
        env:
          STAGING_MLFLOW_TRACKING_URI: ${{ secrets.STAGING_MLFLOW_TRACKING_URI }}
        run: pytest tests/integration/test_training_pipeline.py

```

#### CI/CD Workflow (Github Actions)

**.github/workflows/deploy_training_pipeline.yml**

```yaml
name: Deploy LLM Fine-tuning Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/training/**'
      - 'dags/llm_finetuning_dag.py'

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
      - name: Install dependencies & Run unit tests
        run: |
          pip install -r requirements-dev.txt
          pytest tests/pipelines/training/
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push training container to ECR
        run: |
          docker build -t ${{ secrets.ECR_REGISTRY }}/llm-finetuning-image:latest -f src/pipelines/training/Dockerfile .
          docker push ${{ secrets.ECR_REGISTRY }}/llm-finetuning-image:latest

  deploy:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Configure AWS Credentials
        # ... credentials setup
      - name: Run Integration Test (placeholder)
        run: echo "Triggering and monitoring integration test..." # This would call the test script
      - name: Sync DAG to Production MWAA Bucket
        if: success()
        run: aws s3 sync ./dags s3://${{ secrets.MWAA_PROD_DAGS_BUCKET }}/dags --delete
```

___



### Implementation: Batch Inference Pipeline

#### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_inference.png" width="100%" style="background-color: #FCF1EF;"/>


#### Python Scripts

**src/pipelines/inference/get_products.py**

```python
import logging
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)

def get_products_to_update(db_connection_string: str, interval_hours: int = 1) -> list[str]:
    """
    Gets a list of product_ids that have received new reviews in the last interval.
    """
    try:
        logging.info("Connecting to the application database to find products with new reviews...")
        engine = create_engine(db_connection_string)
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(hours=interval_hours)
        
        query = f"""
        SELECT DISTINCT product_id
        FROM public.reviews
        WHERE created_at >= '{start_date.strftime('%Y-%m-%d %H:%M:%S')}'
        """
        
        with engine.connect() as connection:
            df = pd.read_sql(query, connection)
        
        product_ids = df['product_id'].tolist()
        logging.info(f"Found {len(product_ids)} products to update.")
        return product_ids
    except Exception as e:
        logging.error(f"Failed to get products to update: {e}")
        raise
```

**src/pipelines/inference/retrieve_context.py**

```python
import logging
import psycopg2
from pgvector.psycopg2 import register_vector
from langchain.prompts import PromptTemplate

logging.basicConfig(level=logging.INFO)

PROMPT_TEMPLATE = """
###Instruction: Based ONLY on the following customer reviews, provide a balanced summary of the product's pros and cons. Do not invent information.

###Reviews:
{reviews_context}

###Response:
"""

def retrieve_rag_context(product_ids: list[str], db_params: dict) -> list[dict]:
    """
    For each product, retrieves the RAG context from the Vector DB and constructs a prompt.
    """
    prompts = []
    try:
        with psycopg2.connect(**db_params) as conn:
            register_vector(conn)
            with conn.cursor() as cur:
                for product_id in product_ids:
                    # This query implements our advanced RAG strategy
                    # Note: This is a simplified example. A production query might be more complex.
                    query = """
                    (SELECT chunk_text FROM review_embeddings WHERE product_id = %s AND star_rating >= 4 ORDER BY review_id DESC LIMIT 5)
                    UNION ALL
                    (SELECT chunk_text FROM review_embeddings WHERE product_id = %s AND star_rating <= 2 ORDER BY review_id DESC LIMIT 5)
                    """
                    cur.execute(query, (product_id, product_id))
                    results = cur.fetchall()
                    
                    if not results:
                        continue
                        
                    context_str = "\n".join([f"- {res[0]}" for res in results])
                    prompt_formatter = PromptTemplate.from_template(PROMPT_TEMPLATE)
                    formatted_prompt = prompt_formatter.format(reviews_context=context_str)
                    
                    prompts.append({"product_id": product_id, "prompt": formatted_prompt})
        
        logging.info(f"Successfully constructed {len(prompts)} prompts.")
        return prompts
    except Exception as e:
        logging.error(f"Failed to retrieve RAG context: {e}")
        raise
```

**src/pipelines/inference/generate_summaries.py**

```python
import logging
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

logging.basicConfig(level=logging.INFO)

def invoke_llm_endpoint(prompts_data: list[dict], endpoint_url: str, api_key: str) -> list[dict]:
    """
    Invokes the LLM serving endpoint in parallel to generate summaries.
    """
    summaries = []
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    def post_request(prompt_data):
        try:
            payload = {"prompt": prompt_data["prompt"]} # Varies based on serving API
            response = requests.post(endpoint_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            return {"product_id": prompt_data["product_id"], "summary": response.json()["summary"]}
        except requests.exceptions.RequestException as e:
            logging.error(f"Failed to get summary for product {prompt_data['product_id']}: {e}")
            return None

    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_prompt = {executor.submit(post_request, p): p for p in prompts_data}
        for future in as_completed(future_to_prompt):
            result = future.result()
            if result:
                summaries.append(result)

    logging.info(f"Successfully generated {len(summaries)} summaries.")
    return summaries
```

**src/pipelines/inference/cache_results.py**

```python
import logging
import boto3
from datetime import datetime
from decimal import Decimal

logging.basicConfig(level=logging.INFO)

def cache_summaries_in_dynamodb(summaries: list[dict], table_name: str, ttl_days: int = 30):
    """
    Writes the generated summaries to the DynamoDB cache table in a batch.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    ttl_timestamp = int((datetime.utcnow() + timedelta(days=ttl_days)).timestamp())

    try:
        with table.batch_writer() as batch:
            for item in summaries:
                batch.put_item(
                    Item={
                        'product_id': item['product_id'],
                        'summary_json': json.dumps(item['summary']), # Store as JSON string
                        'last_updated': datetime.utcnow().isoformat(),
                        'ttl': ttl_timestamp
                    }
                )
        logging.info(f"Successfully cached {len(summaries)} summaries in DynamoDB.")
    except Exception as e:
        logging.error(f"Failed to cache summaries: {e}")
        raise
```

#### Unit Tests

**tests/pipelines/inference/test_generate_summaries.py**

```python
from unittest.mock import patch
from src.pipelines.inference.generate_summaries import invoke_llm_endpoint

@patch('requests.post')
def test_invoke_llm_endpoint_success(mock_post):
    # Arrange
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"summary": {"pros": "Good", "cons": "Bad"}}
    
    test_prompts = [{"product_id": "A", "prompt": "Test prompt"}]
    
    # Act
    summaries = invoke_llm_endpoint(test_prompts, "http://fake-url", "fake-key")

    # Assert
    assert len(summaries) == 1
    assert summaries[0]["product_id"] == "A"
    assert summaries[0]["summary"]["pros"] == "Good"

@patch('requests.post')
def test_invoke_llm_endpoint_handles_error(mock_post):
    # Arrange
    mock_post.side_effect = requests.exceptions.RequestException("API Error")
    
    test_prompts = [{"product_id": "A", "prompt": "Test prompt"}]
    
    # Act
    summaries = invoke_llm_endpoint(test_prompts, "http://fake-url", "fake-key")

    # Assert
    assert len(summaries) == 0 # The failed request should be skipped
```

#### Pipeline (Airflow DAG)

```python
# dags/batch_inference_dag.py (Conceptual - showing the structure)
# This assumes PythonOperators calling the above functions

with DAG(dag_id="batch_inference", schedule="0 * * * *", ...) as dag:
    
    get_products_task = PythonOperator(
        task_id="get_products_to_update",
        python_callable=get_products.get_products_to_update,
    )

    check_if_products_exist = BranchPythonOperator(
        task_id="check_if_products_exist",
        python_callable=lambda ti: "retrieve_rag_context_task" if ti.xcom_pull(...) else "end_pipeline",
    )

    retrieve_context_task = PythonOperator(...)
    generate_summaries_task = PythonOperator(...)
    cache_results_task = PythonOperator(...)
    end_pipeline = EmptyOperator(task_id="end_pipeline")

    get_products_task >> check_if_products_exist
    check_if_products_exist >> [retrieve_context_task, end_pipeline]
    retrieve_context_task >> generate_summaries_task >> cache_results_task
```

#### Infrastructure as Code (Terraform)

**infra/dynamodb.tf**

```hcl
resource "aws_dynamodb_table" "summary_cache" {
  name           = "ProductSummaryCache"
  billing_mode   = "PAY_PER_REQUEST" # Best for spiky, infrequent workloads
  hash_key       = "product_id"

  attribute {
    name = "product_id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Project = "ReviewSummarization"
  }
}
```

#### Integration Test

**tests/integration/test_inference_pipeline.py**

```python
import pytest
import os
import boto3
import time

# --- Test Configuration ---
STAGING_DYNAMODB_TABLE = "StagingProductSummaryCache"
TEST_PRODUCT_ID = "product_integration_test_001"

@pytest.fixture(scope="module")
def dynamodb_client():
    return boto3.client("dynamodb")

def test_inference_pipeline_caches_summary(dynamodb_client):
    """
    Verifies that after the batch inference DAG runs, a summary for the
    test product exists in the staging DynamoDB cache.
    """
    # Arrange (Setup would have populated source DBs and run the DAG)
    time.sleep(10) # Give a moment for potential eventual consistency

    # Act
    try:
        response = dynamodb_client.get_item(
            TableName=STAGING_DYNAMODB_TABLE,
            Key={'product_id': {'S': TEST_PRODUCT_ID}}
        )
    except ClientError as e:
        pytest.fail(f"Failed to query DynamoDB: {e}")

    # Assert
    assert "Item" in response, f"No summary found in cache for product {TEST_PRODUCT_ID}"
    
    item = response["Item"]
    assert "summary_json" in item, "Cached item is missing the 'summary_json' attribute."
    
    # Check if the summary is valid JSON
    summary = json.loads(item["summary_json"]["S"])
    assert "pros" in summary
    assert "cons" in summary
    
    print(f"\nIntegration test passed: Found a valid cached summary for product {TEST_PRODUCT_ID}.")
```

#### CI/CD Workflow (Github Actions)

```yaml
name: Deploy Batch Inference Pipeline

on:
  push:
    branches:
      - main
    paths:
      - 'src/pipelines/inference/**'
      - 'dags/batch_inference_dag.py'

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - name: Install dependencies
        run: pip install -r requirements-dev.txt

      - name: Run unit tests
        run: pytest tests/pipelines/inference/
      
      # Integration Test Steps
      - name: Configure AWS Staging Credentials
        # ...
      - name: Run Integration Test Setup
        # ... (calls setup_inference_test.py)
      - name: Trigger Staging DAG Run
        # ... (calls scripts/trigger_airflow_dag.py)
      - name: Run Integration Test Verification
        # ... (calls pytest tests/integration/test_inference_pipeline.py)
      
      # Deploy to Production
      - name: Configure AWS Production Credentials
        if: success()
        # ...
      - name: Sync DAG to Production MWAA Bucket
        if: success()
        run: aws s3 sync ./dags s3://${{ secrets.MWAA_PROD_DAGS_BUCKET }}/dags --delete
```

___


### Implementation: Monitoring and Alerting

#### Architecture Diagram
<img src="../_static/past_experiences/ecom_summarisation/pipeline_monitoring.png" width="100%" style="background-color: #FCF1EF;"/>

#### Monitoring Quality

**src/monitoring/quality_monitor.py**

```python
import logging
import pandas as pd
import boto3
import json
import os
from datetime import datetime, timedelta

# Assume Ragas and OpenAI are installed and configured
# from ragas import evaluate
# from ragas.metrics import faithfulness, context_precision
# from openai import OpenAI

logging.basicConfig(level=logging.INFO)

# --- Configuration ---
DYNAMODB_TABLE = os.environ["SUMMARY_CACHE_TABLE"]
CLOUDWATCH_NAMESPACE = "LLMReviewSummarizer"

def get_recent_summaries(table_name: str, hours: int = 24) -> pd.DataFrame:
    """Fetches recently generated summaries from the DynamoDB cache."""
    logging.info(f"Fetching summaries from the last {hours} hours from table {table_name}.")
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    # In a real system, you'd scan with a filter. For simplicity, we'll assume a GSI.
    # For now, we return a mock DataFrame.
    mock_data = {
        "product_id": ["prod_123", "prod_456"],
        "summary_json": [
            '{"pros": "Very fast.", "cons": "Gets hot."}',
            '{"pros": "Great design.", "cons": "Battery is weak."}'
        ],
        # In a real system, we'd also fetch the review context used for generation.
        "review_context": [
            "The laptop is incredibly fast for all my tasks.",
            "The battery life is a major issue, lasts only 2 hours."
        ]
    }
    logging.info("Returning mock summaries for demonstration.")
    return pd.DataFrame(mock_data)

def evaluate_summaries(df: pd.DataFrame) -> pd.DataFrame:
    """
    Evaluates summaries using Ragas and LLM-as-a-judge (mocked).
    """
    logging.info(f"Evaluating {len(df)} summaries.")
    # In a real implementation:
    # 1. Format data for Ragas (question, answer, contexts, ground_truth)
    # 2. Call `evaluate(dataset, metrics=[faithfulness, ...])`
    # 3. Call OpenAI API for LLM-as-a-judge coherence score
    
    # Mocked results
    df['faithfulness_score'] = [0.98, 0.93]
    df['coherence_score'] = [4.5, 4.1]
    df['toxicity_score'] = [0.05, 0.02]
    logging.info("Evaluation complete.")
    return df

def publish_metrics_to_cloudwatch(df: pd.DataFrame):
    """Calculates aggregate scores and publishes them as CloudWatch Custom Metrics."""
    cloudwatch = boto3.client('cloudwatch')
    
    avg_faithfulness = df['faithfulness_score'].mean()
    avg_coherence = df['coherence_score'].mean()
    
    logging.info(f"Publishing metrics to CloudWatch: Faithfulness={avg_faithfulness}, Coherence={avg_coherence}")
    
    metric_data = [
        {
            'MetricName': 'AverageFaithfulness',
            'Value': avg_faithfulness,
            'Unit': 'None'
        },
        {
            'MetricName': 'AverageCoherence',
            'Value': avg_coherence,
            'Unit': 'None'
        }
    ]
    
    cloudwatch.put_metric_data(
        Namespace=CLOUDWATCH_NAMESPACE,
        MetricData=metric_data
    )
    logging.info("Metrics successfully published.")

def main():
    """Main function to run the monitoring pipeline."""
    summaries_df = get_recent_summaries(DYNAMODB_TABLE)
    if not summaries_df.empty:
        evaluated_df = evaluate_summaries(summaries_df)
        publish_metrics_to_cloudwatch(evaluated_df)
    else:
        logging.info("No new summaries found to monitor.")

if __name__ == "__main__":
    main()
```

#### Unit Test

**tests/monitoring/test_quality_monitor.py**

```python
from unittest.mock import patch, MagicMock
import pandas as pd
from src.monitoring import quality_monitor

@patch('boto3.client')
def test_publish_metrics_to_cloudwatch(mock_boto_client):
    # Arrange
    mock_cloudwatch = MagicMock()
    mock_boto_client.return_value = mock_cloudwatch
    
    test_data = {
        'faithfulness_score': [1.0, 0.9], # Avg = 0.95
        'coherence_score': [5.0, 4.0]     # Avg = 4.5
    }
    test_df = pd.DataFrame(test_data)
    
    # Act
    quality_monitor.publish_metrics_to_cloudwatch(test_df)
    
    # Assert
    mock_cloudwatch.put_metric_data.assert_called_once()
    
    # Get the arguments passed to the mock
    call_args = mock_cloudwatch.put_metric_data.call_args[1]
    
    assert call_args['Namespace'] == "LLMReviewSummarizer"
    
    metric_data = call_args['MetricData']
    faithfulness_metric = next(m for m in metric_data if m['MetricName'] == 'AverageFaithfulness')
    coherence_metric = next(m for m in metric_data if m['MetricName'] == 'AverageCoherence')

    assert faithfulness_metric['Value'] == 0.95
    assert coherence_metric['Value'] == 4.5
```


#### Pipeline Code (Airflow DAG)

**dags/model_quality_monitoring_dag.py**

```python
from __future__ import annotations
import pendulum
from airflow.models.dag import DAG
from airflow.operators.docker_operator import DockerOperator

# Assumes the monitoring script is containerized in an image in ECR
ECR_IMAGE = "123456789012.dkr.ecr.eu-west-1.amazonaws.com/quality-monitor:latest"

with DAG(
    dag_id="model_quality_monitoring",
    start_date=pendulum.datetime(2024, 1, 1, tz="UTC"),
    schedule="0 3 * * *",  # Run daily at 3 AM UTC
    catchup=False,
    tags=["monitoring", "quality", "llm"],
) as dag:
    run_quality_monitor = DockerOperator(
        task_id="run_quality_monitor",
        image=ECR_IMAGE,
        api_version="auto",
        auto_remove=True,
        # Pass environment variables needed by the script
        environment={
            "SUMMARY_CACHE_TABLE": "ProductionProductSummaryCache",
            "AWS_ACCESS_KEY_ID": "{{ conn.aws_default.login }}",
            "AWS_SECRET_ACCESS_KEY": "{{ conn.aws_default.password }}",
            "AWS_SESSION_TOKEN": "{{ conn.aws_default.extra_dejson.aws_session_token }}",
            "AWS_REGION": "eu-west-1",
        },
        command="/usr/bin/python3 quality_monitor.py",
        docker_url="unix://var/run/docker.sock",
        network_mode="bridge",
    )
```

#### Infrastructure as Code (Terraform)

**infra/monitoring.tf**

```hcl
variable "faithfulness_threshold" {
  description = "The minimum acceptable faithfulness score before triggering an alert."
  type        = number
  default     = 0.95
}

resource "aws_sns_topic" "alerts_topic" {
  name = "LLM-Summarizer-Alerts-Topic"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.alerts_topic.arn
  protocol  = "email"
  endpoint  = "oncall-ml-team@example.com"
}

resource "aws_cloudwatch_metric_alarm" "faithfulness_alarm" {
  alarm_name          = "High-Hallucination-Rate-Alarm"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "AverageFaithfulness"
  namespace           = "LLMReviewSummarizer"
  period              = "86400" # 24 hours, matching the DAG schedule
  statistic           = "Average"
  threshold           = var.faithfulness_threshold
  alarm_description   = "This alarm triggers if the average summary faithfulness score drops below the acceptable threshold."
  
  alarm_actions = [aws_sns_topic.alerts_topic.arn]
  ok_actions    = [aws_sns_topic.alerts_topic.arn]
}

resource "aws_cloudwatch_dashboard" "summarizer_dashboard" {
  dashboard_name = "LLM-Review-Summarizer-Dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric",
        x      = 0,
        y      = 0,
        width  = 12,
        height = 6,
        properties = {
          metrics = [
            ["LLMReviewSummarizer", "AverageFaithfulness"]
          ],
          period = 300,
          stat   = "Average",
          region = "eu-west-1",
          title  = "Summary Faithfulness (Daily Average)"
          # Add horizontal annotation for the alarm threshold
        }
      },
      # ... other widgets for coherence, EKS GPU utilization, etc.
    ]
  })
}
```

#### CI/CD Github Actions Workflow

**.github/workflows/deploy_monitoring.yml**

```yaml
name: Deploy Monitoring System

on:
  push:
    branches:
      - main
    paths:
      - 'src/monitoring/**'
      - 'dags/model_quality_monitoring_dag.py'
      - 'infra/monitoring.tf'

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - name: Install dependencies and run unit tests
        run: |
          pip install -r requirements-dev.txt
          pytest tests/monitoring/
      # ... steps to build and push the quality-monitor docker image to ECR

  deploy-infra:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
      - name: Configure AWS Credentials
        # ...
      - name: Terraform Apply for Monitoring
        run: |
          terraform -chdir=infra init
          terraform -chdir=infra apply -auto-approve -target=aws_sns_topic.alerts_topic -target=aws_cloudwatch_metric_alarm.faithfulness_alarm -target=aws_cloudwatch_dashboard.summarizer_dashboard

  deploy-dag:
    needs: deploy-infra
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS Credentials
        # ...
      - name: Sync Monitoring DAG to Production
        run: aws s3 sync ./dags s3://${{ secrets.MWAA_PROD_DAGS_BUCKET }}/dags --delete
```
___


