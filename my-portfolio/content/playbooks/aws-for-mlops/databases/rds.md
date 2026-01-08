---
title: 'Amazon RDS'
summary: 'Managed relational databases for traditional SQL workloads'
date: '2026-01-03'
order: 4
category: 'databases'
---

# RDS 

> (Postgres/MySQL transactional)

## Mental model (when it wins)

* You want **classic OLTP**: transactions, joins, constraints, SQL, mature tooling.
* Best for: **agent/task metadata**, **billing**, **users/tenants**, **workflows**, **audit tables**, **feature stores (small/relational)**.

## The knobs that matter

* **Multi-AZ**: resilience; typically increases cost (more infra).
* **Read replicas**: scale reads / offload analytics.
* **Storage type & IOPS**: gp3 vs provisioned IOPS; db that “feels slow” is often storage/IOPS-bound.
* **Backups & retention**, **maintenance windows**, **parameter groups**.
* **Connection management**: RDS can get crushed by too many connections → use pooling.

## Pricing mental model

RDS cost = **DB instance-hours + storage + (optional) provisioned IOPS + backups/data transfer**. ([Amazon Web Services, Inc.][3])
**Senior heuristic:** Most bills are dominated by **instance-hours** unless you do heavy provisioned IOPS.

## When to pick RDS vs Aurora

* Pick **RDS** when you want **simplicity** and “normal relational” scaling.
* Pick **Aurora** when you need **higher read scale**, faster failover patterns, or serverless options (and you accept the Aurora pricing model).

## Terraform template (RDS Postgres with subnet group + SG)

```hcl
resource "aws_db_subnet_group" "db" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "db" {
  name   = "${var.name}-db-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.app_sg_id] # allow from app
  }

  egress { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_db_instance" "pg" {
  identifier              = "${var.name}-pg"
  engine                  = "postgres"
  engine_version          = var.pg_version
  instance_class          = var.instance_class
  allocated_storage       = var.storage_gb
  storage_type            = "gp3"
  db_subnet_group_name    = aws_db_subnet_group.db.name
  vpc_security_group_ids  = [aws_security_group.db.id]

  username                = var.username
  password                = var.password

  multi_az                = true
  backup_retention_period = 7
  deletion_protection     = true
  skip_final_snapshot     = false
  final_snapshot_identifier = "${var.name}-final"

  performance_insights_enabled = true

  tags = var.tags
}

variable "name"              { type = string }
variable "vpc_id"            { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "app_sg_id"         { type = string }
variable "pg_version"        { type = string default = "16.3" }
variable "instance_class"    { type = string default = "db.t4g.medium" }
variable "storage_gb"        { type = number default = 100 }
variable "username"          { type = string }
variable "password"          { type = string sensitive = true }
variable "tags"              { type = map(string) default = {} }
```

---