---
title: 'Amazon OpenSearch'
summary: 'Search and analytics engine for logs, metrics, and vector search'
date: '2026-01-03'
order: 6
category: 'databases'
---

# OpenSearch 

> BM25 + vector + hybrid retrieval

##

### Mental model

* **Search engine + vector DB + analytics-ish store** in one system.
* Think of it as **“ranked retrieval service”**: lexical (BM25), semantic (kNN/ANN), filters/facets, aggregations, near-real-time indexing.

### Where it’s used in GenAI / Agentic systems

* **RAG retrieval**: hybrid search over chunked documents + metadata filters.
* **Tooling search**: search across knowledge, tickets, runbooks, policies.
* **Agent observability**: searchable traces/events (tool calls, failures, latency), “why did the agent do that?” investigations.

---

## Core index patterns (what to store)

### Pattern A: Chunk index (most common for RAG)

* One document per **chunk**.
* Fields:

  * `text` (analyzed) for BM25
  * `embedding` (knn_vector) for semantic
  * `doc_id`, `source`, `tenant_id`, `dt`, `lang`, `tags`, `acl_*` for filtering
  * Optional: `title`, `section`, `url`, `hash`, `version`

**Heuristic:** keep chunk size stable (e.g., 300–800 tokens) and store the “retrieval unit” you’ll actually feed to the LLM.

### Pattern B: Dual-index (docs + chunks)

* `docs` index: one doc per source doc (metadata, title, summary).
* `chunks` index: retrieval units.
* Useful when you want **doc-level ranking + chunk-level retrieval**, or dedupe by doc.

---

## Hybrid retrieval mental model

### Best-practice default

* Run **BM25 query** + **vector query**.
* Fuse results with **rank-based fusion** (RRF is the common default) so you don’t fight score normalization.
* Apply metadata filters consistently (tenant, language, ACL, recency).

### Practical scoring heuristics

* **RRF** as the default hybrid fuse (stable, low tuning).
* Add **recency boosting** if your corpus changes frequently.
* Add **authority boosting** (trusted sources) when hallucination risk is high.
* Use **two-stage rerank** if needed: retrieve top N → rerank with a cross-encoder (outside OpenSearch) → pack context.

---

## Vector search knobs (the ones that matter)

* **Embedding dimension**: fixed per index; choose once.
* **ANN method**: typically HNSW-based; tuning matters.

  * `m`: graph connectivity (quality ↑, memory ↑, indexing slower)
  * `ef_construction`: indexing quality/time trade-off
  * Query-time: `k` and sometimes `ef_search` depending on engine
* **Engine choice**: Lucene vs FAISS-style options (trade-offs vary by version/feature set).
* **Filtering strategy**:

  * Prefer **metadata filtering** that can be applied during ANN (when supported) to avoid “retrieve then filter” inefficiency.
* **Quantization/compression** (if available/used): reduces memory, may reduce quality.

**Senior heuristic:** vector search is usually **RAM-bound**. If you’re paging vectors from disk, latency gets ugly fast.

---

## Cluster & index knobs (senior knobs)

### Cluster sizing knobs

* **Data nodes**: hold shards + do query/indexing work.
* **Dedicated manager/master nodes**: stabilize clusters (recommended beyond tiny dev clusters).
* **AZ count**: 2–3 AZs for HA; increases cross-AZ traffic and replica overhead.
* **EBS volume + IOPS**: too-low IOPS causes indexing/query stalls.
* **UltraWarm / cold tiers** (log-style use cases): cheaper for older read-only data.

### Index settings knobs

* `number_of_shards`: scale-out + parallelism; too many shards hurts.
* `number_of_replicas`: HA + query throughput; doubles/triples storage.
* `refresh_interval`: lower = fresher search but higher indexing cost.
* Mappings/analyzers: text analyzers are relevance; bad analyzers = bad BM25.

**Senior heuristic:** shard count is a *lifecycle decision*. Over-sharding early is a very common failure mode.

---

## Pricing mental model (back-of-envelope)

### Managed OpenSearch Service (provisioned domain)

You pay for:

* **Always-on instance-hours** (data + dedicated manager + warm nodes if used)
* **Storage GB-month** (EBS for hot; warm storage pricing differs)
* **Snapshots** (S3-backed) + **data transfer** + optional features

**Mental model:** “OpenSearch (managed) is a *fixed monthly platform cost* + storage. The bill is dominated by *how many nodes you keep running*.”

### OpenSearch Serverless

You pay for:

* **Compute units** for indexing and search (metered with usage)
* **Storage GB-month**

**Mental model:** “Serverless shifts cost from fixed nodes → workload-driven compute. Great for spiky search or when you don’t want to size clusters.”

---

## When to choose OpenSearch (vs common alternatives)

* Choose **OpenSearch** when you need:

  * **BM25 + vector + hybrid + filters + aggregations**
  * multi-tenant search with faceting
  * search/analytics on logs/telemetry
* Choose **Postgres+pgvector / Aurora** when:

  * data is strongly relational/transactional and vector is “nice-to-have”
  * simpler ops, smaller scale retrieval
* Choose a dedicated vector DB when:

  * you want a pure vector-first feature set and don’t need full-text/aggregations (often simpler tuning for ANN)

---

# Terraform templates

## A) Managed OpenSearch domain (VPC, encryption, fine-grained security, logs)

```hcl
resource "aws_cloudwatch_log_group" "os_app" {
  name              = "/aws/opensearch/${var.domain_name}/application"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "os_slow" {
  name              = "/aws/opensearch/${var.domain_name}/slow"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_resource_policy" "os_logs" {
  policy_name = "${var.domain_name}-opensearch-logs"
  policy_document = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "es.amazonaws.com" },
      Action = [
        "logs:PutLogEvents",
        "logs:CreateLogStream"
      ],
      Resource = [
        aws_cloudwatch_log_group.os_app.arn,
        aws_cloudwatch_log_group.os_slow.arn
      ]
    }]
  })
}

data "aws_iam_policy_document" "os_access" {
  statement {
    effect = "Allow"
    principals { type = "AWS", identifiers = var.allowed_principals }
    actions = ["es:ESHttp*"]
    resources = ["arn:aws:es:${var.region}:${var.account_id}:domain/${var.domain_name}/*"]
  }
}

resource "aws_opensearch_domain" "this" {
  domain_name    = var.domain_name
  engine_version = var.engine_version

  cluster_config {
    instance_type            = var.data_instance_type
    instance_count           = var.data_instance_count

    dedicated_master_enabled = true
    dedicated_master_type    = var.master_instance_type
    dedicated_master_count   = var.master_instance_count

    zone_awareness_enabled = true
    zone_awareness_config {
      availability_zone_count = 2
    }
  }

  ebs_options {
    ebs_enabled = true
    volume_type = "gp3"
    volume_size = var.ebs_gb
    iops        = var.ebs_iops
    throughput  = var.ebs_throughput
  }

  vpc_options {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.sg_id]
  }

  encrypt_at_rest { enabled = true }
  node_to_node_encryption { enabled = true }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = true
    master_user_options {
      master_user_name     = var.master_user
      master_user_password = var.master_password
    }
  }

  access_policies = data.aws_iam_policy_document.os_access.json

  log_publishing_options {
    log_type                 = "ES_APPLICATION_LOGS"
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.os_app.arn
  }

  log_publishing_options {
    log_type                 = "SEARCH_SLOW_LOGS"
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.os_slow.arn
  }

  tags = var.tags
}

variable "domain_name"         { type = string }
variable "engine_version"      { type = string default = "OpenSearch_2.13" }
variable "data_instance_type"  { type = string default = "m6g.large.search" }
variable "data_instance_count" { type = number default = 3 }
variable "master_instance_type" { type = string default = "m6g.large.search" }
variable "master_instance_count" { type = number default = 3 }

variable "ebs_gb"         { type = number default = 200 }
variable "ebs_iops"       { type = number default = 3000 }
variable "ebs_throughput" { type = number default = 125 }

variable "private_subnet_ids" { type = list(string) }
variable "sg_id"              { type = string }

variable "master_user"     { type = string }
variable "master_password" { type = string sensitive = true }

variable "allowed_principals" { type = list(string) default = [] }
variable "region"             { type = string }
variable "account_id"         { type = string }
variable "tags"               { type = map(string) default = {} }
```

## B) OpenSearch Serverless (collection + minimal security skeleton)

```hcl
resource "aws_opensearchserverless_collection" "col" {
  name = var.collection_name
  type = "SEARCH"
  tags = var.tags
}

# Encryption policy
resource "aws_opensearchserverless_security_policy" "enc" {
  name = "${var.collection_name}-enc"
  type = "encryption"
  policy = jsonencode({
    Rules = [{
      ResourceType = "collection",
      Resource     = ["collection/${aws_opensearchserverless_collection.col.name}"]
    }],
    AWSOwnedKey = true
  })
}

# Network policy (public here for brevity; prefer VPC/private where possible)
resource "aws_opensearchserverless_security_policy" "net" {
  name = "${var.collection_name}-net"
  type = "network"
  policy = jsonencode([{
    Rules = [{
      ResourceType = "collection",
      Resource     = ["collection/${aws_opensearchserverless_collection.col.name}"]
    }],
    AllowFromPublic = true
  }])
}

# Data access policy
resource "aws_opensearchserverless_access_policy" "access" {
  name = "${var.collection_name}-access"
  type = "data"
  policy = jsonencode([{
    Rules = [
      {
        ResourceType = "index",
        Resource     = ["index/${aws_opensearchserverless_collection.col.name}/*"],
        Permission   = ["aoss:ReadDocument","aoss:WriteDocument","aoss:CreateIndex","aoss:DescribeIndex"]
      }
    ],
    Principal = var.allowed_principals
  }])
}

variable "collection_name" { type = string }
variable "allowed_principals" { type = list(string) default = [] }
variable "tags" { type = map(string) default = {} }
```

---

## “Minimal-regret” defaults for RAG on OpenSearch

* Start with **hybrid retrieval** (BM25 + vector) + **RRF fusion**.
* Keep **metadata filtering** first-class (tenant, ACL, dt, lang).
* Use **aliases** for index versioning (`chunks_v1`, `chunks_v2` → alias `chunks_current`).
* Design shards for the **next 6–12 months**, not day 1.
* Treat vectors as **RAM planning**: vector workloads usually force a memory-first sizing strategy.
