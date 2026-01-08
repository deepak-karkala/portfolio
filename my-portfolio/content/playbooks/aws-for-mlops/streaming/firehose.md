---
title: 'Amazon Kinesis Firehose'
summary: 'Stream data delivery to S3, Redshift, and analytics services'
date: '2026-01-03'
order: 3
category: 'streaming'
---

# Kinesis Firehose

##

### Mental model

* **Managed “pipe to destination”**: ingest → optionally transform → deliver to **S3 / Redshift / OpenSearch / Splunk** with buffering.
* Use it when you want **near-real-time delivery without managing consumers/shards**.

### Knobs that matter

* **Destination** (S3 is the usual landing zone).
* **Buffering hints (size/time)**: controls freshness vs cost (#objects). With dynamic partitioning, end-to-end delay can be ~**1.5× buffer time**. ([AWS Documentation][4])
* **Compression + format conversion** (Parquet/ORC) (cost + downstream query savings).
* **Lambda transform** (powerful, but can become a bottleneck/cost center).
* **Dynamic partitioning** (write to S3 prefixes based on record fields) (adds extra pricing components). ([Amazon Web Services, Inc.][5])
* **Backup S3 prefix for failed records** (non-negotiable in prod).

### Pricing mental model

* Base: **$ per GB ingested**, metered in **5KB record increments** (small records inflate billed GB). ([Amazon Web Services, Inc.][6])
* Optional add-ons (common):

  * **Dynamic partitioning**: per **GB processed** + per **S3 objects delivered** (+ optional JQ hours). ([Amazon Web Services, Inc.][5])
  * **VPC delivery**: per **GB delivered** + per **AZ-hour**. ([Amazon Web Services, Inc.][5])
* Back-of-envelope: **Firehose bill ≈ (billed_GB_in) + (optional transforms / dynamic partitioning / VPC delivery)**.

### Agentic/GenAI usage patterns

* “Telemetry sink” for **LLM traces**, tool events, prompt/response logs → S3 (then Athena/Glue), optionally OpenSearch for searchability.

### Terraform (Firehose → S3, direct PUT)

```hcl
resource "aws_s3_bucket" "sink" {
  bucket = var.s3_bucket
}

data "aws_iam_policy_document" "firehose_assume" {
  statement {
    effect = "Allow"
    principals { type = "Service", identifiers = ["firehose.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "firehose" {
  name               = "${var.name}-firehose-role"
  assume_role_policy = data.aws_iam_policy_document.firehose_assume.json
}

data "aws_iam_policy_document" "firehose_s3" {
  statement {
    effect = "Allow"
    actions = [
      "s3:AbortMultipartUpload","s3:GetBucketLocation","s3:GetObject","s3:ListBucket",
      "s3:ListBucketMultipartUploads","s3:PutObject"
    ]
    resources = [aws_s3_bucket.sink.arn, "${aws_s3_bucket.sink.arn}/*"]
  }
}

resource "aws_iam_role_policy" "firehose_s3" {
  role   = aws_iam_role.firehose.id
  policy = data.aws_iam_policy_document.firehose_s3.json
}

resource "aws_kinesis_firehose_delivery_stream" "to_s3" {
  name        = var.name
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose.arn
    bucket_arn = aws_s3_bucket.sink.arn

    prefix              = "events/!{timestamp:yyyy/MM/dd}/"
    error_output_prefix = "errors/!{timestamp:yyyy/MM/dd}/"

    buffering_size     = 64  # MB
    buffering_interval = 60  # seconds
    compression_format = "GZIP"
  }
}

variable "name"      { type = string }
variable "s3_bucket" { type = string }
```

---