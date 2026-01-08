---
title: 'AWS Batch'
summary: 'Managed batch computing for large-scale parallel jobs'
date: '2026-01-03'
order: 3
category: 'orchestration'
---

# AWS Batch 

> large-scale batch compute, spot-heavy

##
### Mental model

* **Queue + scheduler for batch jobs** over EC2/Fargate.
* Best for **embeddings backfills**, document processing, offline evaluation, massive ETL steps, GPU batch inference.

### Where it shows up in ML/GenAI

* Batch ingestion (PDF parsing, chunking, embedding)
* Large offline eval runs (LLM-as-judge, regression suites)
* GPU-heavy batch inference with Spot

### Key knobs (senior knobs)

* **Compute environment**

  * Managed EC2 (best for Spot-heavy, GPU)
  * Fargate (no nodes; simpler; less flexible for GPUs)
* **Allocation strategy**: Spot “best fit” vs capacity-optimized (availability vs price)
* **Instance families**: pin to known-good (esp GPU drivers/AMIs)
* **Job definition**: vCPU/mem, retries, timeout, ephemeral storage, env vars
* **Job queue priorities**: separate prod vs backfill queues
* **Array jobs**: massive parallelism with one submission (great for sharded workloads)

### Pricing mental model

* Batch has **no extra service fee**; bill is whatever compute you run (EC2/EBS/Fargate) + logs + data transfer.
* Senior heuristic: Batch is a cost weapon because it makes **Spot + binpacking** easy.

### Terraform template (Spot-heavy managed EC2 Batch)

```hcl
# Service roles (keep minimal; in prod use AWS-managed policies + least privilege)
data "aws_iam_policy_document" "batch_assume" {
  statement {
    effect = "Allow"
    principals { type="Service", identifiers=["batch.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "batch_service" {
  name               = "${var.name}-batch-service-role"
  assume_role_policy = data.aws_iam_policy_document.batch_assume.json
}

resource "aws_iam_role_policy_attachment" "batch_service_attach" {
  role       = aws_iam_role.batch_service.name
  policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole"
}

resource "aws_batch_compute_environment" "ce" {
  compute_environment_name = "${var.name}-ce"
  service_role             = aws_iam_role.batch_service.arn
  type                     = "MANAGED"

  compute_resources {
    type              = "SPOT"
    allocation_strategy = "SPOT_CAPACITY_OPTIMIZED"
    min_vcpus         = 0
    desired_vcpus     = 0
    max_vcpus         = 256

    instance_types    = var.instance_types
    subnets           = var.private_subnet_ids
    security_group_ids = [var.sg_id]

    # optional: spot_iam_fleet_role
  }
}

resource "aws_batch_job_queue" "q" {
  name                 = "${var.name}-queue"
  state                = "ENABLED"
  priority             = 10
  compute_environments  = [aws_batch_compute_environment.ce.arn]
}

resource "aws_batch_job_definition" "job" {
  name = "${var.name}-job"
  type = "container"

  container_properties = jsonencode({
    image  = var.image
    vcpus  = 2
    memory = 4096
    command = ["python","worker.py"]
    environment = [
      { name="ENV", value=var.env }
    ]
  })

  retry_strategy { attempts = 3 }
  timeout { attempt_duration_seconds = 3600 }
}

variable "name" { type = string }
variable "image" { type = string }
variable "env" { type = string default = "prod" }
variable "instance_types" { type = list(string) default = ["c6i.large","c6i.xlarge"] }
variable "private_subnet_ids" { type = list(string) }
variable "sg_id" { type = string }
```

---
