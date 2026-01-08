---
title: 'Amazon EMR'
summary: 'Managed Spark, Hadoop, and big data processing'
date: '2026-01-03'
order: 3
category: 'etl'
---

# EMR / EMR Serverless (Spark/Hadoop scale-out)

##
### Mental model

* **EMR** = you run big data engines (Spark/Flink/Presto/Hadoop) on managed clusters (EC2).
* **EMR Serverless** = “run Spark jobs without managing clusters” (still Spark semantics).

### What it’s used for in ML/GenAI

* Large-scale batch: embeddings backfills, dedupe, joins, feature generation.
* Transforming massive telemetry/clickstreams into curated datasets.
* Heavy compute workloads that outgrow Glue’s ergonomics or need custom environments.

### Knobs that matter (EMR on EC2)

* **Instance fleets / groups**: mix on-demand + spot for cost.
* **Autoscaling**: core/task node scaling policies.
* **EBS + shuffle**: storage and IO tuning can dominate performance.
* **Bootstrap actions**: install native libs, python deps; prefer reproducible AMIs when stable.
* **Managed scaling**: reduces manual tuning; still validate for bursty loads.

### Knobs that matter (EMR Serverless)

* **Initial/min/max capacity**: controls cost guardrails.
* **Job concurrency**: avoid stampedes.
* **Runtime environment**: keep dependencies pinned and reproducible.

### Pricing mental model

* EMR on EC2: **(EC2 + EBS + network)** + an **EMR surcharge**; biggest lever is **Spot + right-sizing**.
* EMR Serverless: cost tracks **resources used × time** (good for spiky batch), but set min/max to prevent runaway.

### Heuristics: Glue vs EMR vs EMR Serverless

* **Glue**: easiest managed Spark for common ETL; great default for lake transforms.
* **EMR Serverless**: Spark with fewer ops when workloads are bursty and you want quicker “submit job and go.”
* **EMR on EC2**: when you need maximum control, custom tuning, huge steady pipelines, or best cost at scale via Spot + optimized clusters.

### Terraform template (EMR cluster skeleton)

```hcl
resource "aws_emr_cluster" "spark" {
  name          = "${var.name}-emr"
  release_label = var.release_label
  applications  = ["Spark"]

  service_role = var.emr_service_role_arn
  ec2_attributes {
    instance_profile = var.emr_instance_profile_arn
    subnet_id        = var.subnet_id
  }

  master_instance_group {
    instance_type = var.master_type
    instance_count = 1
  }

  core_instance_group {
    instance_type  = var.core_type
    instance_count = var.core_count
  }

  # Optional: scale-out task nodes, autoscaling policies, configurations JSON, bootstrap actions, log_uri

  tags = var.tags
}

variable "name"                    { type = string }
variable "release_label"           { type = string default = "emr-7.0.0" }
variable "emr_service_role_arn"    { type = string }
variable "emr_instance_profile_arn"{ type = string }
variable "subnet_id"               { type = string }
variable "master_type"             { type = string default = "m6i.xlarge" }
variable "core_type"               { type = string default = "m6i.2xlarge" }
variable "core_count"              { type = number default = 2 }
variable "tags"                    { type = map(string) default = {} }
```

### Terraform template (EMR Serverless application skeleton)

```hcl
resource "aws_emrserverless_application" "app" {
  name          = "${var.name}-emr-sls"
  release_label = var.release_label
  type          = "SPARK"

  initial_capacity {
    initial_capacity_type = "Driver"
    initial_capacity_config {
      worker_count = 1
      worker_configuration {
        cpu    = "2 vCPU"
        memory = "4 GB"
      }
    }
  }

  initial_capacity {
    initial_capacity_type = "Executor"
    initial_capacity_config {
      worker_count = 2
      worker_configuration {
        cpu    = "4 vCPU"
        memory = "8 GB"
      }
    }
  }

  maximum_capacity {
    cpu    = "64 vCPU"
    memory = "128 GB"
  }

  tags = var.tags
}

# Note: Job runs are typically submitted via CI/CD or Step Functions, not as a persistent Terraform resource.

variable "name"          { type = string }
variable "release_label" { type = string default = "emr-7.0.0" }
variable "tags"          { type = map(string) default = {} }
```

---