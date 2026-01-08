---
title: 'AWS X-Ray'
summary: 'Distributed tracing for microservices and ML pipelines'
date: '2026-01-03'
order: 2
category: 'observability'
---

# X-Ray 

> distributed tracing

##

### Mental model

* A **request graph**: one user request → multiple spans across services.
* Tracing is how you debug “LLM latency + tool chain” issues without guessing.

### Where it’s must-have in GenAI/agents

* End-to-end trace for: gateway → retriever → reranker → LLM → tools → DB/cache
* Trace annotations you actually use:

  * `model`, `provider`, `prompt_tokens`, `completion_tokens`
  * `tool_name`, `tool_latency_ms`, `retry_count`, `timeout`
  * `tenant`, `route`, `experiment_id` (careful with cardinality)

### Senior knobs

* **Sampling**: 100% in dev, lower in prod; bias toward errors/timeouts.
* **Span boundaries**: create explicit spans for each tool call and retriever step.
* **Context propagation**: ensure trace headers flow across ALB/API GW/Lambda/ECS.
* **Retention**: trace data is not forever; treat it as “recent debugging window”.

### Pricing mental model

* Cost driver is **traces recorded**:

  * Think **$5 per 1M traces recorded** ⇒ **$5 per million sampled requests**.
  * Retrieval/scans are cheaper; keep sampling sane and queries targeted.
  * If you enable insights-like processing, think **small extra per trace processed**.

### Terraform template (sampling rule + app role policy attachment)

```hcl
resource "aws_xray_sampling_rule" "default" {
  rule_name      = "${var.name}-sampling"
  priority       = 1000
  reservoir_size = 1              # keep at least some traces
  fixed_rate     = var.fixed_rate # e.g. 0.05 = 5%

  host      = "*"
  http_method = "*"
  url_path  = "*"
  service_name = "*"
  service_type = "*"
  resource_arn = "*"
  version   = 1
}

# Attach X-Ray write permissions to the execution role used by your app (Lambda/ECS/EKS node/IRSA role)
resource "aws_iam_role_policy_attachment" "xray_write" {
  role       = var.app_role_name
  policy_arn  = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

variable "name" { type = string }
variable "fixed_rate" { type = number default = 0.05 }
variable "app_role_name" { type = string }
```

---