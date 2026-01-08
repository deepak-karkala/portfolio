---
title: 'Amazon Managed Grafana'
summary: 'Managed Grafana for metrics visualization and dashboards'
date: '2026-01-03'
order: 4
category: 'observability'
---

# Grafana

##

### Mental model

* Managed dashboards + alerting UI for CloudWatch/AMP/OpenSearch/etc.
* Pricing is **headcount-based**, not “data scanned” (predictable).

### Where it’s must-have in GenAI/agents

* “Single pane” dashboards combining:

  * CloudWatch service metrics (Lambda/API GW/ALB/SQS)
  * AMP infra metrics (EKS/ECS/EC2/GPU exporters)
  * X-Ray traces / service map views (when wired)
* On-call ready: latency SLO, error budget burn, queue age, tool failures, model latency.

### Senior knobs

* **Permission mode**

  * Service-managed: fastest (AWS creates roles/policies)
  * Customer-managed: strict control (best for regulated orgs)
* **Data sources**: standardize naming per env (dev/stage/prod).
* **User roles**: keep editors small; most are viewers.
* **Alerting**: route to SNS/ChatOps; enforce noise budgets.

### Pricing mental model

* Think **$9 / active editor-month** and **$5 / active viewer-month**.
* “Active” is what matters; avoid giving everyone editor unless needed.

### Terraform template (AMG workspace, service-managed permissions)

```hcl
resource "aws_grafana_workspace" "amg" {
  name                     = var.name
  authentication_providers  = ["AWS_SSO"]           # or SAML
  permission_type          = "SERVICE_MANAGED"
  account_access_type      = "CURRENT_ACCOUNT"

  data_sources = [
    "CLOUDWATCH",
    "PROMETHEUS",
    "XRAY"
  ]

  role_arn = null # service-managed creates/uses the service role
  tags     = var.tags
}

variable "name" { type = string }
variable "tags" { type = map(string) default = {} }
```

---