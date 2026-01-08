---
title: 'SageMaker Feature Store'
summary: 'Feature storage and serving for ML pipelines'
date: '2026-01-03'
order: 6
category: 'sagemaker'
---

# SageMaker Feature Store (classic ML at scale)

##
### Mental model

* **Central feature management**: offline store + online store, lineage, reuse.
* Use when multiple models/teams need consistent feature definitions.

### Where it fits

* Fraud/ranking/recommendation/forecasting systems with many features and multiple consumers.
* Less common for pure GenAI apps; more for “classic ML + GenAI combined” products.

### Knobs that matter

* **Online store**: low-latency retrieval (capacity/throughput considerations)
* **Offline store**: S3 + Glue catalog integration for training datasets
* **Feature definitions**: schema management and backfills
* **Freshness**: streaming vs batch feature updates

### Pricing mental model

* Think of it as paying for:

  * Online store (hot serving path)
  * Offline storage/compute (building and querying datasets)
* Biggest lever is avoiding unnecessary online features and controlling backfills.

### Terraform template (feature group skeleton)

```hcl
resource "aws_sagemaker_feature_group" "fg" {
  feature_group_name = var.name
  record_identifier_feature_name = "record_id"
  event_time_feature_name        = "event_time"
  role_arn                       = var.sm_role_arn

  feature_definition { feature_name = "record_id"; feature_type = "String" }
  feature_definition { feature_name = "event_time"; feature_type = "String" }
  feature_definition { feature_name = "f1"; feature_type = "Fractional" }

  offline_store_config {
    s3_storage_config { s3_uri = var.offline_s3_uri }
    disable_glue_table_creation = false
  }

  online_store_config {
    enable_online_store = true
  }
}

variable "name" { type = string }
variable "sm_role_arn" { type = string }
variable "offline_s3_uri" { type = string }
```

---