---
title: 'LLM Generated Review Summaries'
summary: 'Implemented automated review summarisation using LLMs to surface key insights and sentiment for shoppers'
date: '2023-01-15'
category: 'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)'
categoryDuration: 'Aug 2022 - Nov 2025'
role: 'Senior ML Engineer (Contract)'
duration: ''
location: 'Remote | Europe'
techStack:
  - 'Python'
  - 'LLMs'
  - 'AWS Lambda'
  - 'NLP'
highlights:
  - 'Fine-tuned Mistral-7B on 100K+ reviews; cut LLM cost 60% vs GPT-4 baseline while maintaining quality'
  - 'Partnered with product and legal to define governance standards (model cards, versioning, bias-aware retrieval, PII redaction)'
  - 'Productionized batch RAG with automated quality checks (hallucination/toxicity/relevance)'
order: 4
---


##

> **Role:** Senior ML Engineer (Contract)
>
> **Context:** Mid-sized European E-commerce marketplace (75K SKUs, 50K DAU, 2.5K orders/day)

---

### The Problem

Many products had hundreds or thousands of customer reviews — but most users don’t read them. Others had only sparse or mixed reviews. This created:

* Cognitive overload for high-traffic SKUs
* Lack of reliable insight for niche products
* Inconsistent messaging between product categories
* Heavy manual work for merchandising teams

The hypothesis was simple:

> *If we could condense review sentiment into a single, trustworthy summary, users could make decisions faster.*

---

### Solution Overview

We designed a **batch Retrieval-Augmented Generation (RAG)** system instead of real-time inference.

Pipeline steps:

1. Generate embeddings for ~4M historical reviews
2. Store embeddings in **Pinecone serverless** (pay-per-use, scalable)
3. Retrieve key review snippets (recent + helpful + sentiment-balanced)
4. Summarize with a fine-tuned **Mistral-7B** model using structured prompts
5. Run evaluation (hallucination, relevance, toxicity)
6. Store final outputs in the product catalog

---

### **Why RAG for Review Summarization**

* **Architected a Retrieval-Augmented Generation (RAG) summarization pipeline** to give product, UX, and business stakeholders **explicit control over summary quality, balance, and bias** at scale. Instead of naively summarizing all reviews, designed a **metadata-aware retrieval layer** (helpfulness, sentiment, recency, verified purchase) that selects a **curated, high-signal context** per product and feeds it into a **single, deterministic LLM call**, improving trustworthiness while reducing inference cost and complexity.

* **Partnered with product and UX teams** to define retrieval rules (e.g., balanced pros/cons, mandatory inclusion of critical negative feedback), ensuring summaries reflected **real customer sentiment**, avoided “lost-in-the-middle” failures, and remained **cost-efficient and future-proof** (reusable for semantic search and discovery use cases).

---

### Multi-adapter (LoRA)

* Designed a modular continual-learning strategy to prevent catastrophic forgetting in production LLMs by introducing a domain-specific multi-adapter (LoRA) architecture, enabling isolated retraining per product category (e.g., Electronics, Fashion) while preserving quality across the rest of the catalog. Partnered with product and content stakeholders to define domain boundaries and rollout criteria, ensuring safe, incremental model improvements without cross-category regressions.

---


### Evaluation & Experiment Results

We A/B-tested the feature on a subset of product pages.

What we observed:

* Users interacted more with the review section
* Scroll depth and dwell time increased
* The conversion curve showed an **uplift of ~2%**, but it was **not statistically significant**

We treated this as directional validation and focused on:

* Quality improvements
* Operational time savings
* Future UX iteration opportunities

---

### Cost & Optimization

Initial prototypes using GPT-4 API cost ~$40–50/month <!--for weekly batch inference-->.

By switching to:

* **fine-tuned Mistral-7B**
* quantization
* inference batching via **vLLM**

we reduced inference cost to **~$10–20/month**, with no quality degradation.

---

### Model Governance and Responsible AI (RAI)

* Led end-to-end model governance and Responsible AI practices for a production LLM system, integrating reproducibility, auditability, access control, and bias mitigation across the full MLOps lifecycle. Partnered with product, legal, and platform teams to define governance standards (model cards, versioning, access policies) and implemented bias-aware RAG retrieval, explainability hooks, and proactive PII redaction to ensure trustworthy, compliant AI outputs at scale.

---

### Monitoring and Observability

Led the design of a comprehensive monitoring and observability framework for an LLM-based summarization platform, spanning system reliability (batch DAGs, GPU utilization, API errors), data integrity (semantic drift, PII leakage), and model quality (hallucinations, toxicity, RAG relevance). Collaborated with data engineering, product, and legal teams to define thresholds, alerting policies, and on-call workflows—ensuring continuous quality, fast incident response, and long-term trust in production GenAI outputs.


---

### Lessons Learned

* Summaries are only as good as retrieval signal quality
* Model evaluation needs automation, not subjective review
* Cost modeling is critical for production viability
* Experimentation must include both UX and ML metrics


---