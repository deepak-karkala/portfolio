---
title: 'SageMaker Batch Transform'
summary: 'Batch inference for large-scale offline predictions'
date: '2026-01-03'
order: 2
category: 'sagemaker'
---

# SageMaker Async Inference / Batch Transform

### Mental model

* **Async Inference**: “endpoint, but request/response is async with S3 output”. Great for bursty, long-running inference.
* **Batch Transform**: run inference over a dataset in S3; classic offline scoring.

### Where it fits (ML/GenAI)

* Async: document processing, long generation, heavy pre/post-processing.
* Batch: re-score catalogs, offline embeddings, nightly scoring, eval sweeps.

### Knobs that matter

* **S3 input/output prefixes** (organize by dt/run_id)
* **Concurrency**: max concurrent invocations / batch strategy
* **Payload sizes**: keep records sized appropriately; avoid huge single records
* **Retry behavior** + DLQs (wrap with Step Functions for stronger semantics)

### Pricing mental model

* You’re paying for **inference instance-hours** while the job runs (batch) or while capacity is provisioned (async endpoint).
* If it’s periodic, batch often wins on cost vs keeping endpoints up.

### Terraform template (Batch Transform job skeleton)

```hcl
resource "aws_sagemaker_transform_job" "bt" {
  name       = "${var.name}-batch-transform"
  model_name = var.model_name

  transform_input {
    data_source {
      s3_data_source {
        s3_data_type = "S3Prefix"
        s3_uri       = var.input_s3_uri
      }
    }
    content_type = "application/jsonl"
  }

  transform_output {
    s3_output_path = var.output_s3_uri
    accept         = "application/jsonl"
  }

  transform_resources {
    instance_type  = var.instance_type
    instance_count = var.instance_count
  }
}

variable "name" { type = string }
variable "model_name" { type = string }
variable "input_s3_uri" { type = string }
variable "output_s3_uri" { type = string }
variable "instance_type" { type = string default = "ml.m5.xlarge" }
variable "instance_count" { type = number default = 2 }
```

---
