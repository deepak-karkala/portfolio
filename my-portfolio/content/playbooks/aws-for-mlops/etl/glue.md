---
title: 'AWS Glue'
summary: 'Serverless ETL for data transformation and catalog management'
date: '2026-01-03'
order: 1
category: 'etl'
---

# Glue (ETL + Data Catalog)

### Mental model

* **Glue Data Catalog** = your lake’s “metastore” (databases/tables/partitions/schemas).
* **Glue ETL** = managed Spark for **batch transformations** (S3 → S3) + joins + dedupe + backfills.
* Glue is the “data plane for the lake” when you don’t want to run Spark yourself.

### What it’s used for in ML/GenAI

* Build **curated datasets** (bronze→silver→gold) for training/evals.
* Create “analytics-ready” Parquet/Iceberg datasets from raw logs (e.g., agent traces).
* Maintain **partitioned** tables for Athena queries.

### Knobs that matter (senior knobs)

* **Job type**: Spark ETL vs Python shell (keep Python shell for lightweight tasks).
* **Workers/DPUs**: cost + speed; tune for shuffle-heavy workloads.
* **Bookmarks**: incremental processing; helps avoid reprocessing (but validate correctness).
* **Timeout + retries**: default to sane limits, DLQ style patterns via Step Functions.
* **Connections / VPC**: only if you must reach private data sources; add endpoints to avoid NAT bleed.
* **Output format**: Parquet + partitioning = biggest downstream cost lever.

### Pricing mental model

* Glue ETL cost is basically: **(allocated compute units) × (runtime hours)**.
* Biggest cost drivers: **backfills**, **wide joins**, **shuffle**, and **small file output** (which explodes downstream query costs).
* Rule of thumb: optimize by (1) reducing shuffle, (2) increasing file sizes, (3) partition smartly.

### Heuristics

* If the job is *simple and small*, do it in **Lambda/ECS**.
* If it’s *Spark-worthy* (joins/large transforms/backfills), use **Glue or EMR**.
* If you need fine control, custom libs, or long-running Spark apps → EMR.

### Terraform template (Catalog DB + Crawler + Glue Job)

```hcl
resource "aws_glue_catalog_database" "db" {
  name = var.db_name
}

resource "aws_iam_role" "glue" {
  name               = "${var.name}-glue-role"
  assume_role_policy = data.aws_iam_policy_document.glue_assume.json
}

data "aws_iam_policy_document" "glue_assume" {
  statement {
    effect = "Allow"
    principals { type = "Service", identifiers = ["glue.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy" "glue_policy" {
  role = aws_iam_role.glue.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Effect="Allow", Action=["s3:GetObject","s3:PutObject","s3:ListBucket"], Resource=[var.s3_bucket_arn, "${var.s3_bucket_arn}/*"] },
      { Effect="Allow", Action=["logs:*"], Resource="*" }
    ]
  })
}

resource "aws_glue_crawler" "crawler" {
  name          = "${var.name}-crawler"
  role          = aws_iam_role.glue.arn
  database_name = aws_glue_catalog_database.db.name

  s3_target { path = "s3://${var.s3_bucket_name}/${var.raw_prefix}/" }

  # Optional: schedule, schema change policy, table prefix, etc.
}

resource "aws_glue_job" "etl" {
  name     = "${var.name}-etl"
  role_arn = aws_iam_role.glue.arn

  command {
    name            = "glueetl"
    script_location = "s3://${var.s3_bucket_name}/${var.scripts_prefix}/job.py"
    python_version  = "3"
  }

  glue_version      = "4.0"
  number_of_workers = 5
  worker_type       = "G.1X"
  timeout           = 60

  default_arguments = {
    "--job-language" = "python"
    "--enable-continuous-cloudwatch-log" = "true"
    "--enable-metrics" = "true"
  }
}

variable "name"           { type = string }
variable "db_name"        { type = string }
variable "s3_bucket_name" { type = string }
variable "s3_bucket_arn"  { type = string }
variable "raw_prefix"     { type = string default = "raw" }
variable "scripts_prefix" { type = string default = "glue-scripts" }
```

---