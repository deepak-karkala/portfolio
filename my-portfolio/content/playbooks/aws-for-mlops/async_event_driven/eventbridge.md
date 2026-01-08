---
title: 'Amazon EventBridge'
summary: 'Event bus for event-driven architectures and agentic AI systems'
date: '2026-01-03'
order: 1
category: 'async_event_driven'
---

# EventBridge 

> Event Router / Event Bus

## What it’s for (mental model)

* A **central event router** with **content-based routing** to many targets.
* Strong fit for: **domain events**, **microservice choreography**, **agent workflow events**, **auditability + replay**.

## Key capabilities

* **Rules**: match on event patterns (JSON) → route to targets.
* **Event buses**: default + custom; supports cross-account patterns (with IAM role requirements). ([AWS Documentation][11])
* **Archive + replay**: production debugging + reprocessing. ([AWS Documentation][12])
* **Pipes**: “managed glue” from source to target with optional filter/transform/enrich. ([AWS Documentation][13])
* **Scheduler**: at-scale cron/one-time schedules (serverless). ([Amazon Web Services, Inc.][14])

## Cost mental model (these are the big ones)

* **Custom events**: **$1 / 1M events ingested** (64KB chunks). ([Amazon Web Services, Inc.][14])
* **Cross-account delivery** can add cost (e.g., $1 / 1M for some cross-account delivery scenarios shown). ([Amazon Web Services, Inc.][14])
* **Pipes**: **$0.40 / 1M requests after filtering** (and batching helps). ([Amazon Web Services, Inc.][14])
* **Scheduler**: **14M invocations/month free**, then **$1 / 1M**. ([Amazon Web Services, Inc.][14])
* **Payload chunking**: 256KB event counts as **4 events**. ([Amazon Web Services, Inc.][14])

## Design heuristics (when to choose it vs SNS/SQS)

* Choose **EventBridge** when you need:

  * **many event types**, **many consumers**, **routing by content**, **cross-account**, **replay**
* Choose **SNS** when you need:

  * simple **fanout** + per-subscriber filtering, minimal event governance
* Choose **SQS** when you need:

  * **durable buffering** and worker pull model, not broadcast routing

## Terraform: Custom bus → rule → SQS target (classic routing)

```hcl
resource "aws_cloudwatch_event_bus" "bus" {
  name = "app-bus"
}

resource "aws_sqs_queue" "target_q" {
  name                    = "eb-target"
  sqs_managed_sse_enabled = true
}

resource "aws_cloudwatch_event_rule" "rule" {
  name           = "route-job-events"
  event_bus_name = aws_cloudwatch_event_bus.bus.name

  event_pattern = jsonencode({
    source      = ["app.jobs"]
    "detail-type" = ["JobStateChanged"]
    detail = {
      status = ["FAILED", "SUCCEEDED"]
    }
  })
}

resource "aws_cloudwatch_event_target" "to_sqs" {
  rule           = aws_cloudwatch_event_rule.rule.name
  event_bus_name = aws_cloudwatch_event_bus.bus.name
  arn            = aws_sqs_queue.target_q.arn
}

# Allow EventBridge to send to SQS
data "aws_iam_policy_document" "sqs_allow_eventbridge" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.target_q.arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudwatch_event_rule.rule.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "target_q_policy" {
  queue_url = aws_sqs_queue.target_q.id
  policy    = data.aws_iam_policy_document.sqs_allow_eventbridge.json
}
```

---
