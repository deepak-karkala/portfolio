---
title: 'Amazon CloudWatch'
summary: 'Monitoring, logging, and alerting for AWS resources'
date: '2026-01-03'
order: 1
category: 'observability'
---

# CloudWatch 

> (Logs / Metrics / Alarms)

##

### Mental model

* **Default telemetry bus for AWS**.
* Logs are for deep forensics, Metrics/Alarms are for paging, Dashboards are for shared visibility.

### Where it’s must-have in GenAI/agents

* **Request logs** (redacted), **tool-call logs**, model latency breakdown, token usage stats, retries/timeouts.
* “Golden signals”: RPS, p50/p95/p99 latency, 4xx/5xx, throttle rate, queue age, DLQ count, cache hit rate.

### Senior knobs (the ones that move outcomes)

**Logs**

* **Retention**: set per log group (cost + compliance).
* **Structured JSON** logs (queryable; avoid unstructured blobs).
* **Sampling + redaction**: log *summaries* always, full payloads rarely.
* **Subscription filters**: stream logs to S3/OpenSearch/Firehose for long retention and analytics.

**Metrics**

* Prefer **service metrics** first; add custom only for SLIs/SLOs.
* **Cardinality control**: never make high-cardinality labels (user_id, request_id) into metrics.
* **EMF (embedded metrics)** can be a pragmatic middle ground (metrics from logs).

**Alarms**

* Alarm on **symptoms** (SLO burn / error rate / queue backlog), not every internal metric.
* Use **composite alarms** to reduce alert storms.

### Pricing mental model (back-of-envelope)

* **Logs ingestion**: think **~$0.50 per GB ingested** ⇒ **$50 per 100 GB**.
* **Logs storage**: think **~$0.03 per GB-month** ⇒ **$3 per 100 GB-month**.
* **Logs Insights**: think **charged per GB scanned** ⇒ optimize with short time windows + indexed fields.
* **Custom metrics**: think **~$0.30 per metric-month** for small scale ⇒ **$30 per 100 metrics-month** (cardinality is the silent killer).
* **Alarms**: think **~$0.10 per alarm-metric-month** ⇒ alarms scale with “how many time series you alarm on”.

### Terraform template (logs + metric filter + alarm + dashboard)

```hcl
resource "aws_cloudwatch_log_group" "app" {
  name              = "/app/${var.name}"
  retention_in_days = 14
}

# Example: create a metric from structured logs (e.g., count errors)
resource "aws_cloudwatch_log_metric_filter" "errors" {
  name           = "${var.name}-error-count"
  log_group_name = aws_cloudwatch_log_group.app.name
  pattern        = "{ $.level = \"ERROR\" }"

  metric_transformation {
    name      = "AppErrorCount"
    namespace = "App/${var.name}"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "error_alarm" {
  alarm_name          = "${var.name}-errors-high"
  namespace           = "App/${var.name}"
  metric_name         = "AppErrorCount"
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  threshold           = 10
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = var.alarm_topic_arns
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.name}-dashboard"
  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric",
        width = 12, height = 6, x = 0, y = 0,
        properties = {
          metrics = [[ "App/${var.name}", "AppErrorCount" ]],
          period = 60,
          stat = "Sum",
          title = "Errors/min"
        }
      }
    ]
  })
}

variable "name" { type = string }
variable "alarm_topic_arns" { type = list(string) default = [] }
```

---