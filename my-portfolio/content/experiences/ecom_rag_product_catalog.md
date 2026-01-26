---
title: 'RAG-Powered Search & Discovery'
summary: 'Built a production-grade RAG system that improved search-to-purchase conversion by 4% and delivered sub-500ms p99 latency at 3M queries/month'
date: '2023-09-10'
category: 'Senior ML Engineer (Contract) at Mid-sized European E-commerce Marketplace (Client - NDA)'
categoryDuration: 'Aug 2022 - Nov 2025'
role: 'Senior ML Engineer (Contract)'
duration: ''
location: 'Remote | Europe'
techStack:
  - 'Python'
  - 'LLMs'
  - 'Vector Search'
  - 'RAG Architecture'
  - 'AWS'
  - 'Embeddings'
highlights:
  - 'Led design of BM25 + dense vectors with re-ranking to define latency/error SLOs and cost targets upfront'
  - 'Built evaluation framework (offline metrics, CI/CD regression tests, load envelopes) including scalable LLM-driven approach to create golden dataset for ranking evaluation'
  - 'Architected for scale (3M queries/month) and delivered p99 latency under 500 ms at EUR 0.001 per query, improving search-to-purchase by 4%'
featured: true
order: 3
---

##

> **Role:** Senior ML Engineer (Contract)
>
> **Context:** Mid-sized European E-commerce marketplace (75K SKUs, 50K DAU, 2.5K orders/day)


### The Problem

The marketplace’s existing search stack was built around **keyword matching and rule-based ranking**. While functional at small scale, it struggled as the catalog and user base grew:

* Natural-language and multi-constraint queries failed frequently
* Long-tail products were under-discovered
* Synonyms, attributes, and multilingual queries were poorly handled
* A significant fraction of searches returned **“no results”**, even when relevant products existed

From a business perspective, search was a **high-intent surface**, but relevance failures directly translated into lost conversions and user frustration.

The challenge was not just to “add an LLM,” but to design a **production-grade, low-latency, cost-efficient system** that could improve relevance without destabilizing the platform.

---

### Business Definition of Success

We defined success in **operationally measurable terms**, aligned with product and finance stakeholders:

* **Primary metric:**

  * *Search-to-purchase conversion* (relative improvement vs control)
* **Secondary metrics:**

  * Reduction in “no results found” queries
  * Latency SLOs (p95 / p99)
  * Error rate under peak load
* **Explicit non-goals:**

  * We did **not** require AOV uplift for success
  * We did **not** optimize for long conversational responses

The system had to be:

* Fast enough for real-time use
* Cheap enough to run continuously
* Observable and governable in production

---

### Feasibility and Risk Assessment 

* Owned feasibility and risk assessment for a high-impact RAG search project, evaluating data quality, modeling complexity, latency and cost constraints, and ethical considerations. Worked with Product and Engineering to define a phased rollout (text-first → multimodal), establish evaluation and guardrails for relevance and groundedness, and design performance- and cost-aware architecture from day one.

---

### Comprehensive Evaluation strategy

* Led the design of a multi-layered evaluation framework to ensure the RAG system met production standards for relevance, trust, performance, and business impact. Working closely with Product, Engineering, and Data stakeholders, we defined a “quality gauntlet” that gated every change—from data and retrieval logic to model upgrades—through rigorous offline validation (data quality checks, retrieval ranking metrics, groundedness testing, integration and load tests) and online evaluation (A/B testing, user engagement signals, and shadow deployments). This approach embedded evaluation across the entire lifecycle, enabling safe rollouts, preventing regressions, and providing a shared, data-driven basis for promotion decisions and continuous improvement.

---

### Data & Indexing Foundations

**Data sources**

* Product catalog (titles, descriptions, attributes, specs)
* Category and brand metadata
* Historical search queries and clickstream events
* Product images
* User interaction signals (views, clicks, add-to-cart)

**Indexing strategy**

* Semantic chunking of product text and metadata
* Separate indexes for:

  * Textual content
  * Attribute-heavy fields
* Vector + keyword hybrid indexing to balance recall and precision
* Strict versioning of embeddings and index schemas to avoid silent drift

This foundation ensured retrieval quality was **traceable, reproducible, and debuggable**.

---

### Building a “Golden Dataset” for Scalable RAG Evaluation

* To enable rigorous, statistically meaningful evaluation of the RAG system, I led the design of a synthetic “golden dataset” generation pipeline that replaced manual labeling with a scalable, LLM-driven approach. Working closely with Product, Search, and Data stakeholders, we defined what “ground truth” should mean for e-commerce search and translated that into an automated evaluation asset grounded in real user behavior. The pipeline combined curated production search logs, catalog-aligned document chunking, and LLM-based query generation with automated validation, producing tens of thousands of high-quality (query, relevant product) pairs. This dataset became a foundational artifact: it enabled reliable measurement of retrieval quality (MRR), powered automated regression testing in CI/CD, and significantly accelerated experimentation by allowing teams to quantify the impact of new retrieval and ranking strategies with high confidence before production rollout.

---

### Retrieval & Generation Architecture

Rather than a “chatbot-first” design, we treated the LLM as **one component in a retrieval pipeline**:

1. **Query understanding**

   * Light query normalization and expansion
   * Intent classification (navigational vs exploratory)

2. **Hybrid retrieval**

   * Vector search for semantic recall
   * Keyword/BM25 search for precision and exact matches
   * Adaptive top-K selection based on query complexity

3. **Reranking**

   * Contextual reranker incorporating relevance and business constraints
   * Guardrails to prevent over-fetching and latency blowups

4. **Generation (minimal by design)**

   * Short, structured responses
   * No verbose descriptions unless explicitly required

This architecture was deliberately chosen to **minimize token usage**, control cost, and keep latency predictable.

---

### Fine-Tuning a Domain-Specific Re-Ranker for High-Precision Retrieval

* Led the design and fine-tuning of a domain-specific re-ranking model to improve precision in a two-stage RAG retrieval pipeline. Working closely with Product, Search, and Data teams, we aligned on relevance definitions rooted in real user behavior and translated them into a scalable training strategy. Using production interaction logs, we constructed high-quality training data with purchased items as positives and retrieval-time hard negatives, ensuring the model learned to resolve the most ambiguous, business-critical ranking decisions. The re-ranker was implemented as a cross-encoder, trained via managed cloud training jobs, and integrated behind a high-recall retriever to balance latency and accuracy. This approach materially improved ranking quality (MRR) while keeping inference costs predictable, and became a core mechanism for safely iterating on retrieval strategies without compromising user trust or system performance.

---

### Production Architecture & MLOps

**Real-time inference**

* Async API running on containerized compute with autoscaling
* Sub-500ms p99 latency under peak load
* Circuit breakers and graceful degradation paths

**Evaluation & monitoring**

* Offline metrics: recall@k, MRR
* Online metrics: conversion, “no results” rate
* LLM-as-judge for sampled quality checks
* Drift monitoring on:

  * Query distributions
  * Retrieval outputs
  * Embedding versions

**CI/CD & governance**

* Model and index versioning
* Canary deployments and rollback
* Load-tested capacity envelopes
* Explicit cost budgets per query

---

### Business & Operational Impact

After staged rollout and controlled experiments:

* **~4% relative improvement in search-to-purchase conversion**
* **Stable sub-500ms p99 latency**, including during traffic spikes
* **Inference cost reduced to ~0.1 cents/query** <!--, yielding **~5× ROI on inference spend**-->

Importantly, these gains were achieved **without introducing heavy operational complexity or runaway costs**.

---


### Cost & Scalability

The system was designed to operate efficiently at **mid-market production scale**, serving **~3M search queries per month (~100K/day)** across a catalog of **10s of thousands of products** with **1–2 GB of vector index data**. By deliberately optimizing for *search-centric RAG* (short prompts, minimal generation, aggressive caching, adaptive retrieval, and model tiering), steady-state inference cost was kept to **~0.1 cents per query**, resulting in a **low four-figure monthly operating cost** dominated by LLM usage rather than idle infrastructure. The real-time stack scales horizontally via autoscaling compute (typically **2–4 inference tasks**) and a small highly available search cluster, maintaining **sub-500ms p99 latency** even during traffic spikes. Importantly, cost scales **linearly with query volume**, not catalog size, and all heavy compute (ingestion, re-indexing, retraining) runs on-demand rather than continuously—making the system predictable, cost-bounded, and sustainable to operate long-term while still delivering measurable business impact.

---


### What I Learned

This project reinforced several production-grade lessons:

* **Search relevance improvements compound slowly but reliably** — even single-digit conversion gains matter at scale.
* **Most e-commerce search does not need “chatty” LLMs**; retrieval quality matters more than generation verbosity.
* **Cost is a first-class ML metric** in real-time systems.
* **Observability beats intuition** — silent failures in retrieval pipelines are more dangerous than obvious model crashes.
* **Conservative metrics build trust** with product, finance, and leadership teams.

Overall, this project demonstrated how LLMs can be integrated into core commerce systems **responsibly**, with measurable impact, strong ROI, and production-grade reliability.

---


