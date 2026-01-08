---
title: 'Amazon SQS'
summary: 'Message queuing for asynchronous processing and decoupling'
date: '2026-01-03'
order: 3
category: 'async_event_driven'
---

# SQS 

> (Queues)

## What it’s for (mental model)

* **Point-to-point buffering** between producers and workers.
* Default pattern for: **async jobs**, **LLM tool-execution work queues**, **ingestion workers**, **retry with backoff**, **load leveling**.

## Delivery semantics (choose the queue type)

* **Standard**: *at-least-once*, *best-effort ordering* → assume **duplicates + reordering**. ([AWS Documentation][1])
* **FIFO**: *ordered*, **exactly-once processing** (via dedup window) + message groups. ([AWS Documentation][2])

## Key knobs (the ones that matter)

* **visibility_timeout_seconds**: “lease” on a message. Set to **p95 processing time + retry buffer** (and ensure it’s > your worker’s worst-case).
* **message_retention_seconds**: how far back you can recover/replay (4 days default; can go up).
* **receive_wait_time_seconds** (long polling): reduces empty receives (saves cost).
* **redrive_policy**: DLQ + `maxReceiveCount` (poison message escape hatch).
* **FIFO specifics**: `content_based_deduplication`, `message_group_id` strategy (throughput vs ordering).

## Cost mental model (back-of-envelope)

* **Standard**: **~$0.40 / 1M requests** (after 1M free). ([Amazon Web Services, Inc.][3])
* **FIFO**: **~$0.50 / 1M requests** (after 1M free). ([Amazon Web Services, Inc.][3])
* **Tiering at huge scale** can drop as low as **$0.24 / 1M** standard and **$0.35 / 1M** FIFO. ([Amazon Web Services, Inc.][4])
* **Requests ≠ messages**: one message is commonly **Send + Receive + Delete = ~3 requests** (more if visibility changes / retries / partial batches).
* **Payload billing**: each **64KB chunk** counts as an additional request (1MB payload → 16 requests). ([Amazon Web Services, Inc.][5])
* **SSE-KMS** can add KMS call costs; **SQS-managed SSE** avoids KMS metering.

## Design heuristics (senior-level)

* Prefer **Standard + idempotency** unless strict ordering is *actually* required.
* DLQ is not optional in production: **DLQ + alarms** is your “poison pill circuit breaker.”
* For GenAI workers: make processing **idempotent** using a **dedupe key** (request_id / trace_id) stored in DynamoDB/Redis.
* Use FIFO only when you need **ordering per entity** (e.g., per `user_id`, per `order_id`) → set that as `message_group_id`.

## Terraform: SQS queue + DLQ (recommended default)

```hcl
resource "aws_sqs_queue" "dlq" {
  name                      = "jobs-dlq"
  message_retention_seconds = 1209600 # 14 days
  sqs_managed_sse_enabled   = true
}

resource "aws_sqs_queue" "main" {
  name                       = "jobs"
  visibility_timeout_seconds = 120   # set to ~p95 job time + buffer
  receive_wait_time_seconds  = 20    # long polling
  message_retention_seconds  = 345600 # 4 days
  sqs_managed_sse_enabled    = true

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 5
  })
}

# Optional: strict ordering + dedupe
# resource "aws_sqs_queue" "fifo" {
#   name                        = "jobs.fifo"
#   fifo_queue                  = true
#   content_based_deduplication = true
#   sqs_managed_sse_enabled     = true
# }
```

---