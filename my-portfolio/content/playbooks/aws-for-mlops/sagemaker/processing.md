---
title: 'SageMaker Processing'
summary: 'Data preprocessing and feature engineering jobs'
date: '2026-01-03'
order: 4
category: 'sagemaker'
---

# SageMaker Processing

### Mental model

* Managed **data processing jobs** (preprocess, feature engineering, evaluation, dataset prep) on ephemeral compute.
* Similar to training jobs but meant for general processing containers.

### Where it fits

* Data prep for training/evals, batch feature generation, bias checks, model eval pipelines.

### Knobs that matter

* **Instance type/count**, **volume size**
* **Network/VPC**: only when needed; watch NAT costs
* **Caching**: use pipeline caching or reuse outputs in S3
* **Container image**: keep it small; dependency bloat hurts startup time

### Pricing mental model

* Cost ≈ **(#instances × hours)** (like training), so right-size aggressively.

### Terraform template (processing job skeleton)

```hcl
resource "aws_sagemaker_processing_job" "proc" {
  processing_job_name = "${var.name}-proc"
  role_arn            = var.sm_role_arn

  app_specification {
    image_uri = var.image_uri
  }

  processing_resources {
    cluster_config {
      instance_type  = var.instance_type
      instance_count = var.instance_count
      volume_size_in_gb = 50
    }
  }

  processing_inputs {
    input_name = "input"
    s3_input {
      s3_uri       = var.input_s3_uri
      local_path   = "/opt/ml/processing/input"
      s3_data_type = "S3Prefix"
    }
  }

  processing_outputs {
    output_name = "output"
    s3_output {
      s3_uri      = var.output_s3_uri
      local_path  = "/opt/ml/processing/output"
    }
  }
}

variable "name" { type = string }
variable "sm_role_arn" { type = string }
variable "image_uri" { type = string }
variable "instance_type" { type = string default = "ml.m5.xlarge" }
variable "instance_count" { type = number default = 1 }
variable "input_s3_uri" { type = string }
variable "output_s3_uri" { type = string }
```

---