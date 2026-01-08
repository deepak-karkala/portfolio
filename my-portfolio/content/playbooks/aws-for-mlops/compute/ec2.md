---
title: 'Amazon EC2'
summary: 'Maximum control for GPU inference, custom kernels, and high-performance workloads'
date: '2026-01-03'
order: 2
category: 'compute'
---

# EC2

> (incl. GPU + custom AMIs)

##

### When to use

* **Max control / max performance**: GPU inference (vLLM/TGI/TensorRT-LLM), custom kernels/drivers, tight latency tuning.
* Stateful services, special networking, sidecars, or when you need exotic instance families.

### Knobs that matter

* **Instance family choice** (CPU: c/m/r; GPU: g/p; inference accelerators etc).
* **EBS** (gp3 baseline tuning), **ENA**, placement groups, NUMA pinning (advanced).
* **AMI strategy**: golden AMIs; bake deps for fast scale.
* **Spot / Savings Plans / Reserved**: primary cost lever.
* **Capacity reservations** (for GPU availability).

### Pricing mental model

* “**$/hour per instance**” plus EBS + data transfer.
* Spot can be **up to ~90% off** on-demand. ([Amazon Web Services, Inc.][6])
* Savings Plans/RIs are your steady-state lever (commitment-based).

### Terraform (launch template + single instance skeleton)

```hcl
resource "aws_launch_template" "lt" {
  name_prefix   = "${var.name}-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  vpc_security_group_ids = [var.sg_id]

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs { volume_size = 200, volume_type = "gp3" }
  }

  user_data = base64encode(var.user_data)
}

resource "aws_instance" "one" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  vpc_security_group_ids = [var.sg_id]
}

variable "name" { type = string }
variable "ami_id" { type = string }
variable "instance_type" { type = string }
variable "subnet_id" { type = string }
variable "sg_id" { type = string }
variable "user_data" { type = string default = "" }
```

---