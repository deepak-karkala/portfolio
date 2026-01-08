---
title: 'Amazon SNS'
summary: 'Pub/sub messaging for fanout and notifications'
date: '2026-01-03'
order: 2
category: 'async_event_driven'
---

# SNS 

> Pub/Sub Fanout

## What it’s for (mental model)

* **Fanout**: one publish → many subscribers (SQS/Lambda/HTTP/S/email/SMS).
* Great for “event notification” and “broadcast to multiple downstream systems.”

## Delivery semantics

* SNS itself is **push-based**; durability depends on subscriber type.
* Best-practice for reliable processing: **SNS → SQS (per consumer)** (gives you buffering + retries + DLQs).

## Key knobs

* **Subscriptions**: protocol (SQS/Lambda/HTTP/S), retry policy (varies by protocol).
* **Message filtering**: filter per-subscription to reduce noise. ([AWS Documentation][6])
* **RawMessageDelivery**: for SQS/HTTP endpoints, avoid SNS JSON envelope. ([AWS Documentation][7])
* **FIFO topics** exist for ordering + dedup across fanout (rare but useful when you truly need it). ([AWS Documentation][8])

## Cost mental model

* **API requests**: first **1M free**, then **~$0.50 / 1M requests** (payload chunked per 64KB). ([Amazon Web Services, Inc.][9])
* **Fanout multiplier is the trap**: total “deliveries” roughly = **publishes × subscriptions** (and payload chunking applies). ([Amazon Web Services, Inc.][10])
* **Deliveries to SQS/Lambda**: no *per-message delivery* fee, but **data transfer out** can still be charged. ([Amazon Web Services, Inc.][10])
* Filtering: attribute-based filtering is free; payload-based filtering scans outbound data. ([Amazon Web Services, Inc.][10])

## Design heuristics

* Use SNS when you have **multiple independent consumers** and you *want* loose coupling.
* If each consumer needs its own retry/DLQ semantics → **SNS → separate SQS per consumer**.
* If you need rich routing by event structure at scale → prefer **EventBridge** over SNS.

## Terraform: SNS topic → SQS subscription (fanout pattern)

```hcl
resource "aws_sns_topic" "topic" {
  name = "events"
  # fifo_topic = true
  # name       = "events.fifo" # FIFO requires .fifo suffix
}

resource "aws_sqs_queue" "consumer_q" {
  name                     = "events-consumer"
  sqs_managed_sse_enabled  = true
  receive_wait_time_seconds = 20
}

# Allow SNS to send to the queue
data "aws_iam_policy_document" "sqs_allow_sns" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.consumer_q.arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_sns_topic.topic.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "consumer_q_policy" {
  queue_url = aws_sqs_queue.consumer_q.id
  policy    = data.aws_iam_policy_document.sqs_allow_sns.json
}

resource "aws_sns_topic_subscription" "sub" {
  topic_arn = aws_sns_topic.topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.consumer_q.arn

  raw_message_delivery = true

  # Optional filtering (message attributes)
  filter_policy = jsonencode({
    event_type = ["job.created", "job.failed"]
  })
}
```

---