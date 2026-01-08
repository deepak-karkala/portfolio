---
title: 'SageMaker Endpoints'
summary: 'Real-time inference hosting with auto-scaling'
date: '2026-01-03'
order: 1
category: 'sagemaker'
---

# SageMaker Real-time Endpoints

### Mental model

* Always-on **model serving** behind a managed endpoint. Think “managed autoscaled inference cluster”.
* Best for latency-sensitive inference; you pay for **instance-hours**.

### Where it fits (ML/GenAI)

* Real-time classic ML inference, small/medium LLMs (often via optimized containers), embedding models.

### Knobs that matter

* **Instance type/count** + autoscaling (target invocations/per instance or CPU)
* **Multi-model endpoints** (MME): pack many small models, trade latency for density
* **Provisioned concurrency equivalent**: keep enough instances to meet p95/p99
* **Data capture**: powerful but can be expensive; sample selectively
* **Deployment**: blue/green/canary via endpoint config swaps

### Pricing mental model

* Cost ≈ **(instances × 24×30)**. Biggest lever is right-sizing + autoscaling + turning off non-prod.

### Terraform template (endpoint + config)

```hcl
resource "aws_sagemaker_model" "model" {
  name               = "${var.name}-model"
  execution_role_arn = var.sm_role_arn

  primary_container {
    image          = var.image_uri
    model_data_url = var.model_data_s3
    environment    = var.env
  }
}

resource "aws_sagemaker_endpoint_configuration" "cfg" {
  name = "${var.name}-cfg"

  production_variants {
    variant_name           = "AllTraffic"
    model_name             = aws_sagemaker_model.model.name
    initial_instance_count = var.instance_count
    instance_type          = var.instance_type
  }
}

resource "aws_sagemaker_endpoint" "ep" {
  name                 = "${var.name}-endpoint"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.cfg.name
}

variable "name" { type = string }
variable "sm_role_arn" { type = string }
variable "image_uri" { type = string }
variable "model_data_s3" { type = string }
variable "instance_type" { type = string default = "ml.m5.xlarge" }
variable "instance_count" { type = number default = 2 }
variable "env" { type = map(string) default = {} }
```

---