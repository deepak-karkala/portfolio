---
title: 'Conversational Product Discovery'
summary: 'Transformed keyword search into a multimodal RAG assistant that understands intent and guides shoppers to the right products.'
date: '2024-02-05'
category: 'E-commerce'
techStack:
  - Amazon Bedrock
  - Amazon OpenSearch
  - AWS Glue
  - AWS Lambda
  - AWS Fargate
  - LangChain
  - SageMaker
highlights:
  - '12% uplift in search-to-purchase conversion with conversational, RAG-powered assistance.'
  - '85% reduction in “no results” queries by combining semantic, vector, and multimodal retrieval.'
---

## Engagement Snapshot
- Scope: Reimagine marketplace search as an assistant that accepts text, structured, and visual inputs while remaining production-grade.
- Role: Lead ML/GenAI Engineer accountable for end-to-end architecture, experimentation, and operations.
- Stakeholders: CPO, search product squad, and customer support.

## Business Context & Challenge
Legacy keyword search could not interpret nuanced or multimodal queries, driving abandonment and lost revenue. The mandate was to modernise discovery without sacrificing latency, governance, or cost control.

## What I Delivered
### Architecture & Platform
- Designed a modular AWS architecture with Glue/Lambda ingestion, Step Functions orchestration, and OpenSearch as the hybrid retrieval layer.
- Implemented a multimodal index (text, images, PDFs) to ground responses in the actual product catalogue.
- Built Fargate-hosted inference services using LangChain + Bedrock (Claude 3, Titan embeddings) with autoscaling policies for peak demand.

### Intelligence Layer
- Progressed from baseline RAG to advanced retrieval strategies: vector + keyword hybrid search, contextual reranking, and query rewriting.
- Introduced multimodal retrieval so users could upload inspiration images and receive stylistically similar products.
- Automated a continual learning loop that fine-tunes embeddings on real interaction data via SageMaker processing jobs.

### Observability & Safety
- Added LangSmith tracing, prompt evaluation, and guardrails to ensure grounded, brand-safe responses.
- Established an A/B experimentation framework with clear KPI instrumentation to prove incremental revenue impact.

## Impact
- **+12% search-to-purchase conversion** compared with control users during a six-month experiment.
- **+7% lift in Average Order Value** through improved cross-sell recommendations.
- **-85% “no results found”** by understanding synonyms, intent, and visual cues.
- Maintained **<500 ms p99 latency** even during seasonal traffic spikes.

## Architecture Notes
- Pipelines align with platform standards: Terraform-managed infrastructure, Step Functions for orchestration, decoupled microservices.
- Observability stack aggregates LLM metrics, search KPIs, and cost telemetry so product and infra teams share a single source of truth.
- Query/session analytics feed into roadmap prioritisation for new verticals (e.g., B2B catalogues, rental inventory).

## Looking Ahead
The same platform can now power guided selling for marketplace partners, integrate voice assistants, or personalise discovery by combining RAG outputs with user embeddings—without re-architecting the core system.
