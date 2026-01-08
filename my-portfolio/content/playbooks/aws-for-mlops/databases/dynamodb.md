---
title: 'Amazon DynamoDB'
summary: 'NoSQL database for high-performance key-value and document storage'
date: '2026-01-03'
order: 2
category: 'databases'
---

# DynamoDB 

> (serverless KV + session state + agent memory)

## Mental model (when it wins)

* **Single-digit ms KV** at any scale, **serverless scaling**.
* Best for: **session state**, **agent run state**, **tool execution ledger**, **idempotency keys**, **rate-limit counters**, **feature flags**, **metadata**.

## The knobs that matter

* **Key design** (most important): partition key + sort key shape your scalability.

  * Enemy: **hot partitions** (one key gets most traffic).
* **Capacity mode**

  * **On-demand**: default for unpredictable traffic.
  * **Provisioned + autoscaling**: cheaper for steady load.
* **GSIs**: powerful, but each GSI is effectively “another table” in cost + write amplification.
* **TTL**: auto-expire session/memory items; **TTL deletes don’t consume WCUs**. ([AWS Documentation][2])
* **Streams**: for CDC into pipelines (lambda/eventbridge/kinesis).
* **PITR**: point-in-time recovery (prod default for critical tables).
* **Table class**: **Standard vs Standard-IA** when storage dominates (IA cheaper storage, slightly higher request pricing). ([Amazon Web Services, Inc.][1])

## Pricing mental model (back-of-envelope)

From AWS example (US East):

* **Writes**: ~**$0.6 per 1M writes**
* **Reads**: ~**$0.1 per 1M reads**
* **Storage**: ~**$0.25 per GB-month** ⇒ **~$25 per 100GB-month** (or **~$250 per TB-month**) ([Amazon Web Services, Inc.][1])
  And **Standard-IA** flips that: storage much cheaper, requests slightly more expensive. ([Amazon Web Services, Inc.][1])

**Senior heuristic:** DynamoDB bills are usually either:

1. **Storage-dominated** (big tables) → consider Standard-IA + TTL, or
2. **Write-amplification dominated** (many GSIs / item updates) → reduce indexes or shrink item size.

## Common “agent memory” pattern

* Table: `PK = user_id`, `SK = conversation_id#timestamp` (or `run_id#step`)
* TTL on each item (e.g., 7–30 days)
* Optional GSI for `run_id` lookups

## Terraform template (on-demand table + TTL + PITR + optional stream)

```hcl
resource "aws_dynamodb_table" "mem" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST" # on-demand
  hash_key     = "pk"
  range_key    = "sk"

  attribute { name = "pk"; type = "S" }
  attribute { name = "sk"; type = "S" }

  point_in_time_recovery { enabled = true }

  ttl {
    attribute_name = "expires_at"  # epoch seconds
    enabled        = true
  }

  server_side_encryption { enabled = true }

  # Optional: change data capture
  # stream_enabled   = true
  # stream_view_type = "NEW_AND_OLD_IMAGES"

  tags = var.tags
}

variable "table_name" { type = string }
variable "tags"       { type = map(string) default = {} }
```

---