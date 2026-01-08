---
title: 'SageMaker Model Registry'
summary: 'Model versioning and lifecycle management'
date: '2026-01-03'
order: 5
category: 'sagemaker'
---

# SageMaker Model Registry

##
### Mental model

* Governance layer: **versioned models + metadata + approval gates**.
* Bridges training pipelines and deployment workflows.

### Where it fits

* ML CI/CD: evaluation → register → approve → deploy (canary/blue-green).
* Audit: “what model is in prod and why?”

### Knobs that matter

* **Model package groups** (one per model family)
* **Approval status** (manual gates)
* **Metadata**: metrics, datasets, git commit, image digest, eval reports
* **Cross-account promotion**: dev → staging → prod (common)

### Pricing mental model

* Registry is usually not the cost driver; the underlying artifacts (S3) and jobs are.

### Terraform template (model package group)

```hcl
resource "aws_sagemaker_model_package_group" "group" {
  model_package_group_name = var.group_name
  model_package_group_description = "Registry for ${var.group_name}"
}

variable "group_name" { type = string }
```

---