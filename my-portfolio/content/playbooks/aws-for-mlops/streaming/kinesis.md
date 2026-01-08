---
title: 'Amazon Kinesis'
summary: 'Real-time data streaming and analytics'
date: '2026-01-03'
order: 1
category: 'streaming'
---

# Kinesis Data Streams (KDS)

### Mental model

* **Durable ordered log with partitioning (shards)** for **custom real-time consumers**.
* Use it when you need **multiple consumers**, **sub-second-ish pipelines**, or you want to build your own stream processing (Flink, custom apps, Lambda consumers).

### Capacity knobs (the ones that bite)

* **Shard count = capacity**.

  * Per shard: up to **~1 MB/s writes** and **~2 MB/s reads** (shared across consumers unless using enhanced fan-out). ([AWS Documentation][1])
* **Partition key strategy**: bad keys ⇒ hot shards.
* **Retention**: default 24h; extended retention adds cost. ([Amazon Web Services, Inc.][2])
* **Enhanced fan-out (EFO)**: dedicated **2 MB/s per shard per consumer**; costs extra per consumer-shard-hour (+ per GB retrieved). ([AWS Documentation][3])
* **Consumers**: shared throughput vs EFO (choose based on number of readers + SLA).

### Pricing mental model

* **Provisioned mode** bills primarily:

  * **Shard-hours** (always-on capacity)
  * **PUT payload units** (producers; 25KB units)
  * Optional: **extended retention**, **EFO consumer-shard-hours + data retrieved** ([Amazon Web Services, Inc.][2])
* Back-of-envelope: **KDS cost ≈ “(shards × 24×30) + producer PUT volume + (EFO × consumers)”**.

### Agentic/GenAI usage patterns

* Streaming **agent telemetry** (tool calls, traces), clickstream, prompt/response events for near-real-time analytics, online feature/event pipelines.

### Terraform (Kinesis stream)

```hcl
resource "aws_kinesis_stream" "events" {
  name             = var.name
  shard_count      = var.shards
  retention_period = 24 # hours (increase if you need replay)

  stream_mode_details {
    stream_mode = "PROVISIONED"
    # or "ON_DEMAND" if you prefer (provider support varies by version)
  }

  encryption_type = "KMS"
  kms_key_id      = var.kms_key_arn

  tags = var.tags
}

variable "name"        { type = string }
variable "shards"      { type = number default = 2 }
variable "kms_key_arn" { type = string }
variable "tags"        { type = map(string) default = {} }
```

---