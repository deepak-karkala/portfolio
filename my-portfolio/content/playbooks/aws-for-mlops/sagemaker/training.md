---
title: 'SageMaker Training'
summary: 'Managed distributed training for ML models'
date: '2026-01-03'
order: 3
category: 'sagemaker'
---

# SageMaker Training

### Mental model

* Managed **training jobs** on ephemeral infra (CPU/GPU) that writes artifacts to S3.
* You’re mostly paying for **instance-hours** + attached storage + data transfer.

### Where it fits (ML/GenAI)

* Fine-tuning, classic ML training, distributed training, hyperparameter tuning.
* Use with spot + checkpoints for cost control.

### Knobs that matter

* **Instance type/count** (primary lever)
* **Distribution**: data parallel/model parallel as needed
* **Spot training**: enable + set `max_wait` and checkpoint to S3
* **Input mode**: File vs Pipe (streaming)
* **Volume size**, **checkpoint config**, **enable network isolation** (regulated)
* **Warm pools** (reduce startup times for iterative jobs)

### Pricing mental model

* Cost ≈ **(#instances × hours)**. If you can tolerate interruptions, **Spot** is the biggest lever.

### Terraform template (training job skeleton)

```hcl
resource "aws_sagemaker_training_job" "train" {
  name       = "${var.name}-train"
  role_arn   = var.sm_role_arn

  algorithm_specification {
    training_image = var.image_uri
    training_input_mode = "File"
  }

  resource_config {
    instance_type  = var.instance_type
    instance_count = var.instance_count
    volume_size_in_gb = 100
  }

  stopping_condition { max_runtime_in_seconds = 7200 }

  input_data_config {
    channel_name = "train"
    data_source {
      s3_data_source {
        s3_data_type = "S3Prefix"
        s3_uri       = var.train_s3_uri
        s3_data_distribution_type = "FullyReplicated"
      }
    }
  }

  output_data_config { s3_output_path = var.output_s3_uri }

  enable_managed_spot_training = var.use_spot
  checkpoint_config {
    s3_uri = var.checkpoint_s3_uri
  }
}

variable "name" { type = string }
variable "sm_role_arn" { type = string }
variable "image_uri" { type = string }
variable "instance_type" { type = string default = "ml.g5.2xlarge" }
variable "instance_count" { type = number default = 1 }
variable "train_s3_uri" { type = string }
variable "output_s3_uri" { type = string }
variable "checkpoint_s3_uri" { type = string }
variable "use_spot" { type = bool default = true }
```

---