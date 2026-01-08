---
title: 'AWS IAM'
summary: 'Identity and access management for secure resource control'
date: '2026-01-03'
order: 5
category: 'edge_routing'
---

# IAM 

> Permissions as architecture


##

### What seniors use it for (ML/GenAI)

* **App roles** for inference services (ECS/Lambda/SageMaker) to read S3, write logs, call Bedrock, query OpenSearch, etc.
* **Cross-account access** (shared data lake, central logging)
* **CI/CD roles** (Terraform deployer, build role)
* Guardrails: **permission boundaries**, **SCPs**, separation of duties

### Knobs that matter

* **Roles > users** for workloads. Humans via SSO/Identity Center; apps via roles.
* **AssumeRole conditions**: External ID, source account, `aws:PrincipalArn`, IP/VPC conditions (where applicable).
* **Session duration**: short sessions for humans; workload sessions per service limits.
* **Least privilege**: resource-level scoping + **conditions** (prefix-based S3 access, tag-based access).
* **Permission boundaries** (very useful in large orgs): “max possible permissions”.
* **Policy size / sprawl**: prefer reusable managed policies for platform patterns, inline for one-off.

### Pricing mental model

* IAM itself is essentially “free”; costs show up indirectly:

  * **KMS usage**, **CloudTrail data events**, **Access logs**, etc.

### Heuristics

* Start with “**deny by default**” thinking: grant only the 3–5 actions/resources needed.
* Prefer **role-per-workload** (not shared) for blast-radius control.
* Use **S3 prefix scoping** for multi-tenant buckets: `arn:aws:s3:::bucket/prefix/*`.

### Terraform template (app role + policy for S3 + CloudWatch Logs)

```hcl
# iam.tf
data "aws_caller_identity" "current" {}

resource "aws_iam_role" "app" {
  name               = "${var.name}-role"
  assume_role_policy = data.aws_iam_policy_document.app_assume.json
  tags               = var.tags
}

# Example: ECS task role (swap principal for lambda/sagemaker/etc)
data "aws_iam_policy_document" "app_assume" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "app_policy" {
  statement {
    sid    = "S3ReadWriteScoped"
    effect = "Allow"
    actions = [
      "s3:ListBucket"
    ]
    resources = [var.bucket_arn]
    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["${var.bucket_prefix}/*"]
    }
  }

  statement {
    sid    = "S3ObjectAccess"
    effect = "Allow"
    actions = [
      "s3:GetObject", "s3:PutObject", "s3:DeleteObject"
    ]
    resources = ["${var.bucket_arn}/${var.bucket_prefix}/*"]
  }

  statement {
    sid    = "CloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "app" {
  name   = "${var.name}-policy"
  policy = data.aws_iam_policy_document.app_policy.json
  tags   = var.tags
}

resource "aws_iam_role_policy_attachment" "app" {
  role       = aws_iam_role.app.name
  policy_arn = aws_iam_policy.app.arn
}

variable "name"          { type = string }
variable "bucket_arn"     { type = string } # arn:aws:s3:::my-bucket
variable "bucket_prefix"  { type = string } # e.g. "datasets" or "tenantA"
variable "tags"           { type = map(string) default = {} }
```