---
title: 'Amazon ECS on Fargate'
summary: 'Serverless containers without node ops for fast iteration and spiky services'
date: '2026-01-03'
order: 3
category: 'compute'
---

# ECS on Fargate

##
### When to use

* You want containers without node ops: fast iteration, spiky services, simpler security posture.

### Knobs that matter

* **Task sizing** (vCPU/mem combos), **ephemeral storage**, platform version.
* **Networking**: `awsvpc` ENI per task (IP management), SGs.
* **Fargate Spot** for interrupt-tolerant tasks (batch/async). ([Amazon Web Services, Inc.][3])

### Pricing mental model

* Pay for **requested vCPU + memory** for the task runtime (billed per-second; min 1 minute; ECS notes round-up rules). ([Amazon Web Services, Inc.][2])
* Mental model: “Fargate is convenience tax; for steady workloads ECS/EC2 is cheaper.”

### Heuristics

* Default to **Fargate** for new services until you have steady-state utilization data.
* Migrate to ECS/EC2 when utilization is stable and cost matters.

### Terraform (Fargate service)

```hcl
resource "aws_ecs_cluster" "this" { name = var.name }

resource "aws_cloudwatch_log_group" "lg" {
  name              = "/ecs/${var.name}"
  retention_in_days = 14
}

resource "aws_ecs_task_definition" "task" {
  family                   = var.name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([{
    name  = "app"
    image = var.image
    portMappings = [{ containerPort = var.container_port, protocol = "tcp" }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.lg.name
        awslogs-region        = var.region
        awslogs-stream-prefix = "app"
      }
    }
  }])
}

resource "aws_ecs_service" "svc" {
  name            = var.name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.sg_id]
    assign_public_ip = false
  }
}

variable "name" { type = string }
variable "region" { type = string }
variable "image" { type = string }
variable "container_port" { type = number }
variable "private_subnet_ids" { type = list(string) }
variable "sg_id" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
```

---
