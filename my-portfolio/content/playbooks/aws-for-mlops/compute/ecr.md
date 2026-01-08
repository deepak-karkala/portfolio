---
title: 'Amazon ECR'
summary: 'Container registry for storing and deploying Docker images'
date: '2026-01-03'
order: 6
category: 'compute'
---

# ECR

> (container registry)

##
### When to use

* Store OCI images for ECS/EKS/Lambda container images, private model servers, build artifacts.

### Knobs that matter

* **Immutable tags** (avoid “latest” footguns)
* **Scan on push** (baseline vuln scanning)
* **Lifecycle policies** (delete untagged/old images = direct cost control)
* **Cross-region replication** if you deploy multi-region.

### Pricing mental model

* Costs are mostly **GB-month stored + data transfer out for pulls**. ([Amazon Web Services, Inc.][8])
* Mental model: “Registry storage is cheap; stale images accumulate forever unless lifecycle is set.”

### Terraform (repo + scan + lifecycle)

```hcl
resource "aws_ecr_repository" "repo" {
  name                 = var.name
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration { scan_on_push = true }
}

resource "aws_ecr_lifecycle_policy" "lc" {
  repository = aws_ecr_repository.repo.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images older than 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep last 50 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = [""]
          countType     = "imageCountMoreThan"
          countNumber   = 50
        }
        action = { type = "expire" }
      }
    ]
  })
}

variable "name" { type = string }
```

---