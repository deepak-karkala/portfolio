---
title: 'Amazon EKS'
summary: 'Kubernetes on AWS for K8s-native teams and complex multi-tenant platforms'
date: '2026-01-03'
order: 5
category: 'compute'
---

# EKS

> Kubernetes on AWS

##
### When to use

* You’re Kubernetes-native, need k8s ecosystem (operators, service mesh, complex scheduling).
* Multi-team platform with standardized tooling.

### Knobs that matter

* **Control plane version lifecycle** (standard vs extended support cost & risk). ([Amazon Web Services, Inc.][4])
* **Node strategy**: managed node groups vs self-managed (no extra cost for managed node groups). ([AWS Documentation][5])
* **IRSA** (IAM roles for service accounts): non-negotiable for least privilege.
* **CNI / pod density**, cluster autoscaling (often Karpenter).
* **Add-ons**: VPC CNI, CoreDNS, kube-proxy.

### Pricing mental model

* You pay **per cluster-hour** (and extra if you stay on old versions in extended support). ([Amazon Web Services, Inc.][4])
* Then you still pay for **worker compute** (EC2/Fargate), EBS, LBs, etc. ([AWS Documentation][5])

### Heuristics

* If you don’t need Kubernetes-specific features: **ECS** is simpler + cheaper control-plane-wise.
* Consolidate multiple workloads into fewer clusters to amortize the fixed cluster fee.

### Terraform (minimal EKS + managed node group)

```hcl
resource "aws_eks_cluster" "this" {
  name     = var.name
  role_arn = var.cluster_role_arn

  vpc_config {
    subnet_ids = var.private_subnet_ids
  }
}

resource "aws_eks_node_group" "ng" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.name}-ng"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.private_subnet_ids

  scaling_config { desired_size = 2, min_size = 1, max_size = 10 }

  instance_types = [var.instance_type]
}

variable "name" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "cluster_role_arn" { type = string }
variable "node_role_arn" { type = string }
variable "instance_type" { type = string }
```

> In real life, most teams use the community `terraform-aws-modules/eks/aws` module for VPC/IAM/IRSA add-ons, but the above shows the core resources.

---
