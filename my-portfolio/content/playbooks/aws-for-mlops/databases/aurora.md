---
title: 'Amazon Aurora'
summary: 'MySQL/PostgreSQL-compatible relational database with high performance'
date: '2026-01-03'
order: 3
category: 'databases'
---

# Aurora 

> (higher-scale relational + serverless options)


## Mental model (when it wins)

* “RDS, but engineered for higher throughput + read scaling + storage decoupling.”
* Great for: **high read fanout**, **multi-AZ fast recovery patterns**, **Global Database**, and sometimes **bursty** relational workloads.

## The knobs that matter

* **Aurora Standard vs Aurora I/O-Optimized**

  * **Standard**: pay **storage + I/O requests**.
  * **I/O-Optimized**: higher instance/storage rates, **$0 I/O** (wins when I/O heavy). ([Amazon Web Services, Inc.][4])
* **Serverless v2**

  * Capacity in **ACUs**; **1 ACU ≈ ~2 GiB RAM** (rule of thumb). ([AWS Documentation][5])
  * Set **min/max ACU** to control spend and spikes.
* **Readers**: add reader instances to scale reads.
* **Data API**: convenient, but is its own priced surface; use intentionally. ([Amazon Web Services, Inc.][4])

## Pricing mental model (back-of-envelope)

Aurora cost = **instance-hours + storage GB-month + (I/O requests if Standard) + replication/data transfer for global patterns**. ([Amazon Web Services, Inc.][4])
From AWS examples:

* Storage often modeled around **$0.10/GB-month** (Standard example), and I/O around **$0.20 per 1M I/Os** for Standard. ([Amazon Web Services, Inc.][4])
  Serverless v2 uses **ACU-hours** (example shows $/ACU-hour). ([Amazon Web Services, Inc.][6])

**Senior heuristic:** If your workload is I/O heavy (lots of small reads/writes), model **I/O-Optimized**—it can be cheaper overall. ([Amazon Web Services, Inc.][4])

## Terraform template (Aurora PostgreSQL Serverless v2)

```hcl
resource "aws_rds_cluster" "aurora" {
  cluster_identifier = "${var.name}-aurora"
  engine             = "aurora-postgresql"
  engine_version     = var.engine_version

  database_name   = var.db_name
  master_username = var.username
  master_password = var.password

  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = [var.db_sg_id]

  backup_retention_period = 7
  deletion_protection     = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 8
  }

  tags = var.tags
}

resource "aws_rds_cluster_instance" "writer" {
  identifier         = "${var.name}-aurora-writer"
  cluster_identifier = aws_rds_cluster.aurora.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora.engine
  engine_version     = aws_rds_cluster.aurora.engine_version
}

variable "name"                { type = string }
variable "engine_version"      { type = string default = "16.1" }
variable "db_name"             { type = string default = "app" }
variable "username"            { type = string }
variable "password"            { type = string sensitive = true }
variable "db_subnet_group_name"{ type = string }
variable "db_sg_id"            { type = string }
variable "tags"                { type = map(string) default = {} }
```

---