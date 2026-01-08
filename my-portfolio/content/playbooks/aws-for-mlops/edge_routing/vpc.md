---
title: 'Amazon VPC'
summary: 'Virtual private cloud networking for isolated infrastructure'
date: '2026-01-03'
order: 4
category: 'edge_routing'
---

# VPC 

> networking that decides your latency + cost + security

##
### What seniors use it for (ML/GenAI)

* Place inference workers in **private subnets**
* Control egress + avoid accidental internet exposure
* Add **VPC endpoints** for S3/DynamoDB/CloudWatch to reduce NAT cost + improve security posture
* Enable **flow logs** for debugging/security

### Knobs that matter

* **Subnets**

  * Public subnets: only load balancers / NAT gateways / bastions
  * Private subnets: ECS/EKS/EC2/SageMaker (as needed)
* **NAT Gateway**: convenient but can become a cost sink.
* **VPC endpoints**

  * **Gateway endpoints** (S3/DynamoDB): usually **must-have** (free-ish, no hourly).
  * **Interface endpoints** (PrivateLink): hourly per AZ + data processing; use when you need private access to AWS APIs.
* **Security Groups vs NACLs**: SGs do 95% of the job.
* **Cross-AZ data transfer**: can be a hidden cost (and latency) if you’re careless.

### Pricing mental models

* **NAT Gateway**: “**hourly + per GB**” → expensive under high egress.
  Heuristic: if NAT data processing is noticeable on the bill, add endpoints and reduce internet-bound traffic.
* **Interface endpoints**: “**hourly per AZ + per GB**” → don’t create 20 endpoints blindly.

### Heuristics

* Default pattern for production apps:

  * **2–3 AZs**
  * private subnets for compute
  * **S3/Dynamo gateway endpoints**
  * NAT only if you truly need outbound internet (pip installs, external APIs)
* Use endpoints first, NAT second.

### Terraform template (minimal VPC: public+private, NAT, endpoints, flow logs)

```hcl
# vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = merge(var.tags, { Name = var.name })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = var.tags
}

# Public subnets (one per AZ)
resource "aws_subnet" "public" {
  for_each                = var.public_subnets
  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value.cidr
  availability_zone       = each.value.az
  map_public_ip_on_launch = true
  tags                    = merge(var.tags, { Name = "${var.name}-public-${each.key}" })
}

# Private subnets (one per AZ)
resource "aws_subnet" "private" {
  for_each          = var.private_subnets
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value.cidr
  availability_zone = each.value.az
  tags              = merge(var.tags, { Name = "${var.name}-private-${each.key}" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags   = var.tags
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

# NAT (1 per AZ is best practice; 1 total is cheaper but less resilient)
resource "aws_eip" "nat" {
  vpc  = true
  tags = var.tags
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = values(aws_subnet.public)[0].id
  tags          = var.tags
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  tags   = var.tags
}

resource "aws_route" "private_nat" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

resource "aws_route_table_association" "private" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}

# Gateway endpoints: S3 + DynamoDB (big cost saver vs NAT for AWS traffic)
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id]
  tags              = var.tags
}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id]
  tags              = var.tags
}

# Optional: VPC Flow Logs (debug/security). Sends to CloudWatch logs.
resource "aws_cloudwatch_log_group" "vpc_flow" {
  name              = "/aws/vpc/${var.name}/flowlogs"
  retention_in_days = 14
  tags              = var.tags
}

resource "aws_iam_role" "flowlogs" {
  name               = "${var.name}-vpc-flowlogs-role"
  assume_role_policy = data.aws_iam_policy_document.flowlogs_assume.json
}

data "aws_iam_policy_document" "flowlogs_assume" {
  statement {
    effect = "Allow"
    principals { type = "Service", identifiers = ["vpc-flow-logs.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy" "flowlogs" {
  name   = "${var.name}-vpc-flowlogs-policy"
  role   = aws_iam_role.flowlogs.id
  policy = data.aws_iam_policy_document.flowlogs_policy.json
}

data "aws_iam_policy_document" "flowlogs_policy" {
  statement {
    effect  = "Allow"
    actions = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:DescribeLogGroups", "logs:DescribeLogStreams"]
    resources = ["*"]
  }
}

resource "aws_flow_log" "vpc" {
  vpc_id               = aws_vpc.main.id
  traffic_type         = "ALL"
  log_destination_type = "cloud-watch-logs"
  log_group_name       = aws_cloudwatch_log_group.vpc_flow.name
  iam_role_arn         = aws_iam_role.flowlogs.arn
  tags                 = var.tags
}

variable "name"     { type = string }
variable "region"   { type = string }
variable "vpc_cidr" { type = string }
variable "tags"     { type = map(string) default = {} }

# Example maps:
# public_subnets = { a = { cidr="10.0.0.0/24", az="us-east-1a" }, b = { cidr="10.0.1.0/24", az="us-east-1b" } }
variable "public_subnets" {
  type = map(object({ cidr = string, az = string }))
}
variable "private_subnets" {
  type = map(object({ cidr = string, az = string }))
}
```

---