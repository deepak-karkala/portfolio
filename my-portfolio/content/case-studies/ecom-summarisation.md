---
title: 'LLM-Powered Review Summaries'
summary: 'Automated multilingual review synthesis so shoppers and category managers get concise, trustworthy product intelligence.'
date: '2024-04-12'
category: 'E-commerce'
techStack:
  - AWS Step Functions
  - Amazon OpenSearch
  - Amazon EKS
  - vLLM
  - Mistral-7B
  - LangChain
  - RAGAS
highlights:
  - '2% conversion lift and 3% fewer returns after adding grounded review summaries to PDPs.'
  - 'Cost-efficient RAG pipeline with LoRA-fine-tuned Mistral-7B and scale-to-zero inference.'
---

## Engagement Snapshot
- Scope: Summarise millions of reviews across 12 languages into trustworthy, product-level insights for both customers and internal teams.
- Role: Lead Data Scientist & MLOps/ML Engineer owning strategy through production operations.
- Collaborators: Category management, customer support, platform engineering.

## Business Context & Challenge
Customers were overwhelmed by unstructured reviews, while category managers lacked the bandwidth to keep up with feedback. Prior attempts with generic summarisation hallucinated or ignored multilingual nuance, eroding trust.

## What I Delivered
### Technical Approach
- Adopted a Retrieval-Augmented Generation (RAG) design that grounds every summary in the source reviews stored in OpenSearch.
- Fine-tuned Mistral-7B with LoRA/PEFT to meet quality targets while keeping inference costs viable.
- Leveraged vLLM on EKS with scale-to-zero to provide elastic, low-latency serving without idle spend.

### Quality & Trust
- Implemented multi-layer evaluation: RAGAS for factual alignment, LLM-as-a-judge scoring for coherence, and targeted human review loops for high-revenue SKUs.
- Added safeguards such as citation injection, toxicity filters, and multilingual consistency checks.

### Productionisation
- Orchestrated batch pipelines with Step Functions, enabling nightly refresh and event-triggered updates for new review spikes.
- Automated CI/CD with GitHub Actions, including unit tests, data quality checks, and staged rollouts.
- Provided dashboards correlating summary quality with business KPIs so stakeholders could monitor uplift.

## Impact
- **+2% conversion rate** on product detail pages featuring AI summaries.
- **-3% product returns** in electronics by setting accurate expectations with grounded insights.
- **20–30 analyst hours saved per week** by eliminating manual review triage.

## Architecture Notes
- Modular pipeline separates ingestion, retrieval indexing, generation, evaluation, and publishing for clear ownership and resilience.
- Event-driven triggers handle high-velocity product launches without manual intervention.
- Observability spans data quality, model cost, and hallucination risk—surfaced via shared Grafana dashboards.

## Future Extensions
- Extend to seller-side dashboards and voice assistants.
- Incorporate structured sentiment extraction to automate merchandising alerts and QA workflows.
