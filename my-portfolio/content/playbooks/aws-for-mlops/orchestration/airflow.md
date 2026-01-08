---
title: 'Amazon MWAA (Airflow)'
summary: 'Managed Apache Airflow for complex DAG-based workflows'
date: '2026-01-03'
order: 2
category: 'orchestration'
---

# MWAA (Managed Airflow)

##

### Mental model

* **Airflow-as-a-service**: great when you need DAG UI/ops + backfills + dependencies.
* Trade-off: you pay for an **environment running continuously** (not purely per-run).

### Where it shows up in ML/GenAI

* Data pipelines with many dependencies + backfills (bronze→silver→gold)
* Periodic model retraining/evaluation DAGs
* Multi-team scheduling where Airflow UI + SLAs matter

### Key knobs (senior knobs)

* **Environment size** (scheduler/webserver/worker capacity): biggest lever
* **Workers autoscaling**: set min/max; avoid runaway
* **Executor type**: Celery/Kubernetes (depends on MWAA version/support)
* **DAG parsing & scheduler load**: too many DAGs / heavy imports can melt schedulers
* **Plugins/requirements**: pin versions; keep environment reproducible
* **Networking**: private subnets + endpoints; avoid NAT surprises
* **Logging**: task logs to CloudWatch; tune retention

### Pricing mental model

* Cost is dominated by **“always-on environment-hours”** + additional worker scaling.
* Senior heuristic: MWAA is justified when the **Airflow operational value > always-on tax**.

### Terraform template (MWAA environment skeleton)

```hcl
resource "aws_s3_bucket" "mwaa" {
  bucket = var.mwaa_bucket
}

resource "aws_iam_role" "mwaa" {
  name               = "${var.name}-mwaa-role"
  assume_role_policy = data.aws_iam_policy_document.mwaa_assume.json
}

data "aws_iam_policy_document" "mwaa_assume" {
  statement {
    effect = "Allow"
    principals { type="Service", identifiers=["airflow.amazonaws.com","airflow-env.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy" "mwaa_policy" {
  role = aws_iam_role.mwaa.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Effect="Allow", Action=["s3:GetObject","s3:ListBucket"], Resource=[aws_s3_bucket.mwaa.arn, "${aws_s3_bucket.mwaa.arn}/*"] },
      { Effect="Allow", Action=["logs:*","cloudwatch:*"], Resource="*" }
    ]
  })
}

resource "aws_mwaa_environment" "env" {
  name               = var.name
  airflow_version    = var.airflow_version
  environment_class  = var.env_class
  execution_role_arn = aws_iam_role.mwaa.arn

  source_bucket_arn = aws_s3_bucket.mwaa.arn
  dag_s3_path       = "dags"
  plugins_s3_path   = "plugins"
  requirements_s3_path = "requirements/requirements.txt"

  network_configuration {
    security_group_ids = [var.sg_id]
    subnet_ids         = var.private_subnet_ids
  }

  logging_configuration {
    dag_processing_logs { enabled = true, log_level = "INFO" }
    scheduler_logs      { enabled = true, log_level = "INFO" }
    task_logs           { enabled = true, log_level = "INFO" }
    webserver_logs      { enabled = true, log_level = "INFO" }
    worker_logs         { enabled = true, log_level = "INFO" }
  }
}

variable "name"            { type = string }
variable "mwaa_bucket"     { type = string }
variable "airflow_version" { type = string default = "2.8.1" }
variable "env_class"       { type = string default = "mw1.small" }
variable "sg_id"           { type = string }
variable "private_subnet_ids" { type = list(string) }
```

---
