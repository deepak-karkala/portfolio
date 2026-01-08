---
title: 'Amazon ElastiCache for Redis'
summary: 'In-memory caching and session storage'
date: '2026-01-03'
order: 5
category: 'databases'
---

# ElastiCache 

> (Redis) — caching + rate limiting + sessions

## Mental model (when it wins)

* **In-memory** for:

  * **hot cache** (prompt templates, user profiles, retrieval results)
  * **rate limiting** (token bucket), **distributed locks**, **session state**
  * **fast ephemeral agent memory** (short-lived)
* Use it to take load off DBs and to implement low-latency coordination.

## The knobs that matter

* **Node-based vs Serverless**

  * **Serverless**: pay by **GB-hours stored + ECPUs**; ECPU roughly tracks **KB transferred** (reads/writes ~1 ECPU per KB). ([Amazon Web Services, Inc.][7])
  * **Node-based**: pay **per node-hour**; predictable for steady workloads. ([Amazon Web Services, Inc.][7])
* **Replication group + Multi-AZ + automatic failover**: production default for Redis.
* **Cluster mode** (sharding): required for high memory / throughput scaling.
* **Eviction policy**: `allkeys-lru` vs others (cache correctness depends on this).
* **Persistence**: snapshot/AOF (only if you accept perf hit; many caches disable persistence).
* **Engine choice**: Valkey vs Redis OSS; pricing and lifecycle support differ. ([Amazon Web Services, Inc.][7])
* **Cross-AZ transfer**: can add cost if app and cache are in different AZs. ([Amazon Web Services, Inc.][7])

## Pricing mental model

* Serverless: “**pay for bytes stored + bytes moved/processed**” (GB-hours + ECPU). ([Amazon Web Services, Inc.][7])
* Node-based: “**$ per node-hour**; scale cost linearly with replicas/shards.” ([Amazon Web Services, Inc.][7])
* Backups: billed per GiB-month if you store them. ([Amazon Web Services, Inc.][7])

**Senior heuristic:**

* **Spiky cache load** → serverless
* **Steady cache load** → node-based + reserved nodes / savings plans

## Terraform template (Redis replication group, Multi-AZ, TLS)

```hcl
resource "aws_elasticache_subnet_group" "subnets" {
  name       = "${var.name}-cache-subnets"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "cache" {
  name   = "${var.name}-cache-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.app_sg_id]
  }
  egress { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.name}-redis"
  description                = "Redis for caching/session/rate-limit"
  engine                     = "redis"
  engine_version             = var.engine_version

  node_type                  = var.node_type
  num_cache_clusters         = var.replicas # primary + replicas (cluster mode disabled)
  automatic_failover_enabled = true
  multi_az_enabled           = true

  subnet_group_name          = aws_elasticache_subnet_group.subnets.name
  security_group_ids         = [aws_security_group.cache.id]

  transit_encryption_enabled = true
  at_rest_encryption_enabled = true

  tags = var.tags
}

variable "name"              { type = string }
variable "vpc_id"            { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "app_sg_id"         { type = string }
variable "engine_version"    { type = string default = "7.1" }
variable "node_type"         { type = string default = "cache.t4g.small" }
variable "replicas"          { type = number default = 2 }
variable "tags"              { type = map(string) default = {} }
```

---

## Fast selection heuristics for GenAI/agents

* **Session state / idempotency / tool ledger**: DynamoDB (TTL + PITR)
* **System-of-record (transactions, joins)**: RDS (simple) or Aurora (scale)
* **Hot cache + rate limiting**: ElastiCache (Redis/Valkey)
* **“Memory” layering**: Redis (seconds–hours) → DynamoDB (days) → S3 (archive)
