---
title: 'Auto Scaling Groups (ASG)'
summary: 'Automatic EC2 fleet scaling for dynamic workload management'
date: '2026-01-03'
order: 7
category: 'compute'
---

# Auto Scaling Groups (ASG)

##
### When to use

* Scale **EC2 fleets** for ECS/EC2, EKS nodes (self-managed), custom services.

### Knobs that matter

* **Launch template**, mixed instances policy, Spot percentage.
* **Health checks** (EC2 vs ELB), termination policies.
* **Warm pools** (reduce cold starts) for heavy AMIs.
* Scaling policies: target tracking (CPU), step scaling, scheduled scaling.

### Pricing mental model

* ASG itself has **no additional fee**; you pay for EC2 + CloudWatch + LBs. ([Amazon Web Services, Inc.][7])

### Terraform (ASG + target tracking scaling)

```hcl
resource "aws_autoscaling_group" "asg" {
  name                = "${var.name}-asg"
  vpc_zone_identifier = var.subnet_ids
  min_size            = 1
  max_size            = 20
  desired_capacity    = 2

  launch_template { id = var.launch_template_id, version = "$Latest" }
}

resource "aws_autoscaling_policy" "cpu50" {
  name                   = "${var.name}-cpu50"
  autoscaling_group_name = aws_autoscaling_group.asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 50.0
  }
}

variable "name" { type = string }
variable "subnet_ids" { type = list(string) }
variable "launch_template_id" { type = string }
```

---