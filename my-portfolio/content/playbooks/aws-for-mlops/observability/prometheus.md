---
title: 'Amazon Managed Prometheus'
summary: 'Managed Prometheus for container and Kubernetes monitoring'
date: '2026-01-03'
order: 3
category: 'observability'
---

# Prometheus

##

### Mental model

* AMP is a **managed Prometheus backend** (remote_write target + long-term store).
* You still run **collectors** (Prometheus/ADOT) on EKS/ECS/EC2 to scrape/export metrics.

### Where it’s must-have in GenAI/agents

* Infra + platform metrics at scale: ECS/EKS/EC2, GPU/CPU/mem, queue depth, autoscaling behavior.
* Best when you want PromQL + alert rules + standard OSS exporters.

### Senior knobs

* **Scrape interval**: 60s is common; 15s increases cost fast.
* **Label/cardinality hygiene**: this is the #1 cost and performance risk.
* **Recording rules**: precompute expensive queries; reduce query load.
* **Query limits** (QSP-style): prevent a single dashboard from nuking costs.

### Pricing mental model

* Your bill is roughly:

  * **Ingestion**: priced per **samples ingested** (10M samples is the unit).
  * **Storage**: priced per **GB-month**.
  * **Queries**: priced by **samples processed** (PromQL cost).
* Rule of thumb: **high-frequency scrapes + high cardinality = surprise bill**.

### Terraform template (AMP workspace + basic IAM policy for query/write)

```hcl
resource "aws_prometheus_workspace" "amp" {
  alias = var.name
  tags  = var.tags
}

# Minimal policy (attach to IRSA role / ECS task role used by collector and/or query clients)
resource "aws_iam_policy" "amp_access" {
  name = "${var.name}-amp-access"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Effect="Allow", Action=["aps:RemoteWrite"], Resource=aws_prometheus_workspace.amp.arn },
      { Effect="Allow", Action=["aps:QueryMetrics","aps:GetSeries","aps:GetLabels","aps:GetMetricMetadata"], Resource=aws_prometheus_workspace.amp.arn }
    ]
  })
}

variable "name" { type = string }
variable "tags" { type = map(string) default = {} }
```

---