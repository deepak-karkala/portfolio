---
title: 'SageMaker Pipelines'
summary: 'ML-specific pipeline orchestration within SageMaker'
date: '2026-01-03'
order: 4
category: 'orchestration'
---

# SageMaker Pipelines 

> ML-native CI/CD

### Mental model

* **Orchestrator specialized for ML steps** (processing, training, evaluation, model registration).
* Best when you want tight integration with: **Model Registry**, **Experiments**, ML lineage, approvals.

### Where it shows up in ML/GenAI

* Training pipeline: preprocess → train → evaluate → register → (manual approve) → deploy
* Offline eval pipelines (regression suites, dataset versioning gates)
* Feature processing + validation pipelines

### Key knobs (senior knobs)

* **Pipeline definition**: keep steps small and cacheable
* **Caching**: enable step caching to avoid recompute on unchanged inputs
* **Network isolation / VPC**: for regulated workloads
* **Model registry + approvals**: enforce governance gates
* **Artifact locations**: S3 prefixes per env; enforce lifecycle policies

### Pricing mental model

* Pipelines itself is “thin”: you mainly pay for the **underlying jobs** you run (training/processing/transform, etc.).
* Senior heuristic: biggest savings come from **caching + shutting down idle endpoints** and using Spot for training.

### Terraform template (SageMaker Pipeline resource)

```hcl
data "aws_iam_policy_document" "sm_assume" {
  statement {
    effect = "Allow"
    principals { type="Service", identifiers=["sagemaker.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "sm_role" {
  name               = "${var.name}-sm-pipeline-role"
  assume_role_policy = data.aws_iam_policy_document.sm_assume.json
}

resource "aws_iam_role_policy" "sm_policy" {
  role = aws_iam_role.sm_role.id
  policy = jsonencode({
    Version="2012-10-17",
    Statement=[
      { Effect="Allow", Action=["s3:*"], Resource=[var.artifacts_bucket_arn, "${var.artifacts_bucket_arn}/*"] },
      { Effect="Allow", Action=["sagemaker:*"], Resource="*" }
    ]
  })
}

resource "aws_sagemaker_pipeline" "pipeline" {
  pipeline_name = var.name
  role_arn      = aws_iam_role.sm_role.arn

  pipeline_definition = jsonencode({
    Version = "2020-12-01",
    Parameters = [],
    Steps = [
      {
        Name = "Preprocess",
        Type = "Processing",
        Arguments = {
          ProcessingResources = {
            ClusterConfig = { InstanceType = "ml.m5.xlarge", InstanceCount = 1, VolumeSizeInGB = 30 }
          },
          AppSpecification = { ImageUri = var.processing_image },
          RoleArn = aws_iam_role.sm_role.arn
        }
      }
    ]
  })
}

variable "name" { type = string }
variable "artifacts_bucket_arn" { type = string }
variable "processing_image" { type = string }
```

---