---
title: 'Amazon ECS on EC2'
summary: 'Container orchestration with EC2 for better cost efficiency and GPU support'
date: '2026-01-03'
order: 4
category: 'compute'
---

# ECS on EC2

### When to use

* Long-running services, CPU-heavy inference, custom networking, custom AMIs, and **best $/compute** at scale.
* Great middle ground: managed orchestration without full Kubernetes overhead.

### Knobs that matter

* **Capacity Providers** (ASG-backed) + managed scaling.
* **Instance types** + **EBS** sizing, **binpack** placement, **daemon tasks** (agents).
* **Task CPU/memory**, **ulimits**, **log drivers**, **health checks**, **deployment circuit breaker**.
* **Spot** mix via ASG for cost.

### Pricing mental model

* ECS control plane has **no extra charge**; you pay for **EC2/EBS/ALB/NAT/etc**. ([Amazon Web Services, Inc.][2])

### Heuristics

* Choose ECS/EC2 when:

  * steady load, want **reserved/Savings Plan** efficiency
  * need custom AMIs / GPU drivers / performance tuning
* If you don’t want to manage nodes at all → Fargate.

### Terraform (minimal ECS cluster + ASG capacity + service)

```hcl
resource "aws_ecs_cluster" "this" { name = var.name }

resource "aws_iam_role" "ecs_instance_role" {
  name               = "${var.name}-ecs-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}
data "aws_iam_policy_document" "ec2_assume" {
  statement {
    effect = "Allow"
    principals { type="Service", identifiers=["ec2.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}
resource "aws_iam_role_policy_attachment" "ecs_instance_attach" {
  role      = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}
resource "aws_iam_instance_profile" "ecs" {
  name = "${var.name}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_launch_template" "lt" {
  name_prefix   = "${var.name}-"
  image_id      = var.ecs_ami_id
  instance_type = var.instance_type

  iam_instance_profile { name = aws_iam_instance_profile.ecs.name }

  user_data = base64encode(<<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.this.name} >> /etc/ecs/ecs.config
EOF
  )
}

resource "aws_autoscaling_group" "asg" {
  name                = "${var.name}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  desired_capacity    = 2
  min_size            = 1
  max_size            = 10

  launch_template {
    id      = aws_launch_template.lt.id
    version = "$Latest"
  }
}

resource "aws_ecs_capacity_provider" "cp" {
  name = "${var.name}-cp"
  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.asg.arn
    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 80
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 5
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "attach" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = [aws_ecs_capacity_provider.cp.name]
}

# Add task definition + service similarly (kept short here)
variable "name"              { type = string }
variable "ecs_ami_id"        { type = string } # ECS-optimized AMI
variable "instance_type"     { type = string }
variable "private_subnet_ids"{ type = list(string) }
```

---