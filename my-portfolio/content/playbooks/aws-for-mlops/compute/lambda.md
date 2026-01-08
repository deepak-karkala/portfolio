---
title: 'AWS Lambda'
summary: 'Serverless compute for burst workloads, lightweight inference wrappers, and async workers'
date: '2026-01-03'
order: 1
category: 'compute'
---

# Lambda

### When to use (ML/GenAI)

* **Burst + spiky** inference wrappers, lightweight tool APIs, async workers (SQS), glue code.
* Great for *orchestration*, *pre/post-processing*, *fanout*, not heavy GPU inference.

### Knobs that matter

* **Memory** (also scales CPU), **timeout**, **ephemeral storage**, **architecture (x86/ARM)**.
* **Concurrency**: reserved concurrency per function, account concurrency.
* **Cold start**: VPC attachment increases risk; use VPC endpoints; consider Provisioned Concurrency if p99 matters.
* **Event source mappings**: batch size, max batching window, DLQ, partial batch response (SQS).
* **Streaming responses** (HTTP response streaming) when you need token streaming semantics. ([Amazon Web Services, Inc.][1])

### Pricing mental model

* Meter is **requests + GB-seconds duration** (compute time × memory). ([Amazon Web Services, Inc.][1])
* Mental model: “If I double memory, I roughly double $/sec but may halve runtime — optimize on *cost per request* not memory.”

### Heuristics

* If runtime is **> 30–60s**, or needs heavy deps/GPU, move to **ECS/EKS/EC2**.
* If you’re paying big NAT bills for Lambda-in-VPC → add endpoints (S3/Dynamo/etc).

### Terraform (basic Lambda + IAM + logs + reserved concurrency)

```hcl
resource "aws_cloudwatch_log_group" "lg" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 14
}

data "aws_iam_policy_document" "assume" {
  statement {
    effect = "Allow"
    principals { type = "Service", identifiers = ["lambda.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "role" {
  name               = "${var.name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.role.name
  policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "fn" {
  function_name = var.name
  role          = aws_iam_role.role.arn
  runtime       = "python3.12"
  handler       = "app.handler"
  filename      = var.zip_path

  memory_size = 1024
  timeout     = 30

  environment { variables = var.env }

  # Uncomment if needed:
  # vpc_config { subnet_ids = var.private_subnet_ids, security_group_ids = [var.sg_id] }
}

resource "aws_lambda_function_concurrency" "reserved" {
  function_name                 = aws_lambda_function.fn.function_name
  reserved_concurrent_executions = 50
}

variable "name"    { type = string }
variable "zip_path"{ type = string }
variable "env"     { type = map(string) default = {} }
```

---