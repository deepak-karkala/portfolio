---
title: 'Amazon Athena'
summary: 'Serverless SQL queries on S3 data lakes'
date: '2026-01-03'
order: 2
category: 'etl'
---

# Athena (SQL on S3)

##
### Mental model

* “**Serverless Presto/Trino-style SQL** on files in S3.”
* You pay primarily for **data scanned**, so **format + partitioning** is everything.

### What it’s used for in ML/GenAI

* Ad-hoc analytics on **agent telemetry**, prompt/response logs, eval results.
* Build datasets for offline analysis and labeling queues.
* Quick slicing: latency by model, tool failure rates, safety outcomes, cohort analysis.

### Knobs that matter

* **File format**: Parquet/ORC beats JSON/CSV by a mile.
* **Partitioning**: `dt=YYYY-MM-DD/` (and sometimes `tenant_id=`) to prune scans.
* **Workgroups**: enforce limits, isolate teams, separate prod vs dev.
* **Result location**: dedicated S3 prefix; enable encryption.
* **CTAS / INSERT INTO**: create optimized tables from raw data.

### Pricing mental model

* Cost ≈ **TB scanned**.
* Senior heuristic: if you’re scanning “the whole bucket,” you’ve already lost—fix partitioning or format.
* Common lever: convert raw JSON to Parquet daily; queries become cheap and fast.

### Heuristics

* Use Athena for **interactive querying** and lightweight ETL (CTAS).
* If transforms are heavy (joins, complex logic, big backfills), use Glue/EMR then query with Athena.

### Terraform template (Athena workgroup + database)

```hcl
resource "aws_s3_bucket" "athena_results" {
  bucket = var.athena_results_bucket
}

resource "aws_athena_workgroup" "wg" {
  name = var.workgroup_name

  configuration {
    enforce_workgroup_configuration = true

    result_configuration {
      output_location = "s3://${aws_s3_bucket.athena_results.bucket}/results/"
      encryption_configuration {
        encryption_option = "SSE_S3"
      }
    }
  }
}

resource "aws_athena_database" "db" {
  name   = var.athena_db_name
  bucket = var.data_lake_bucket # Athena stores metadata; tables point to S3 paths
}

variable "athena_results_bucket" { type = string }
variable "workgroup_name"        { type = string }
variable "athena_db_name"        { type = string }
variable "data_lake_bucket"      { type = string }
```

---