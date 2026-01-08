---
title: 'Amazon MSK (Kafka)'
summary: 'Managed Apache Kafka for event streaming'
date: '2026-01-03'
order: 2
category: 'streaming'
---

# MSK (Managed Kafka)

### Mental model

* Kafka compatibility + ecosystem (Connect, Streams, Schema Registry patterns, exactly-once/transactions, tooling).
* Use when you need **Kafka APIs**, multi-team data platform standards, existing Kafka integrations, or high-throughput pub/sub with Kafka semantics.

### Key knobs that matter (Provisioned MSK)

* **Broker instance type/count**: capacity and cost.
* **Storage per broker** (EBS) + throughput characteristics.
* **Partitions**: throughput parallelism and consumer scaling; too many partitions increases ops overhead.
* **Auth/encryption**: TLS in transit, IAM/SCRAM, ACL strategy.
* **Cross-AZ**: strong HA, but model cross-AZ traffic.

### Serverless MSK (when it fits)

* Pricing drivers: **cluster-hours + partition-hours + GB in/out + storage**. ([Amazon Web Services, Inc.][7])
* Great when you don’t want broker ops and the workload isn’t huge/steady.

### Pricing mental model

* **Provisioned**: **broker-hours + storage GB-month + data transfer**. ([Amazon Web Services, Inc.][8])
* **Serverless**: you’re explicitly paying for **partitions** and **data in/out**, so “partition sprawl” can become a cost driver. ([Amazon Web Services, Inc.][7])

### Agentic/GenAI usage patterns

* Enterprise “event backbone” where Kafka is mandated; ingestion for telemetry, model events, and cross-service workflows with Kafka tooling.

### Terraform (Provisioned MSK cluster skeleton)

```hcl
resource "aws_security_group" "msk" {
  name   = "${var.name}-msk-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 9092
    to_port         = 9094
    protocol        = "tcp"
    security_groups = [var.app_sg_id]
  }
  egress { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_msk_cluster" "this" {
  cluster_name           = var.name
  kafka_version          = var.kafka_version
  number_of_broker_nodes = var.brokers

  broker_node_group_info {
    instance_type   = var.broker_instance_type
    client_subnets  = var.private_subnet_ids
    security_groups = [aws_security_group.msk.id]

    storage_info {
      ebs_storage_info { volume_size = var.ebs_gb }
    }
  }

  encryption_info {
    encryption_in_transit { client_broker = "TLS", in_cluster = true }
  }

  tags = var.tags
}

variable "name"                { type = string }
variable "vpc_id"              { type = string }
variable "app_sg_id"           { type = string }
variable "private_subnet_ids"  { type = list(string) }
variable "kafka_version"       { type = string default = "3.6.0" }
variable "brokers"             { type = number default = 3 }
variable "broker_instance_type"{ type = string default = "kafka.m5.large" }
variable "ebs_gb"              { type = number default = 1000 }
variable "tags"                { type = map(string) default = {} }
```

---

---