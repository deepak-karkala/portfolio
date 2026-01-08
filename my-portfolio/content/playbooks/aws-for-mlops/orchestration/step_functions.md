---
title: 'AWS Step Functions'
summary: 'Serverless workflow orchestration for ML pipelines'
date: '2026-01-03'
order: 1
category: 'orchestration'
---

# Step Functions

> state machines; retries/timeouts


##

### Mental model

* **Control plane for workflows**: you pay for **orchestration**, not compute.
* Use it to make pipelines **observable + resumable + retryable**.

### Where it shows up in ML/GenAI

* RAG ingestion pipeline: fetch → parse → chunk → embed → upsert → validate
* Agent workflows: plan → tool calls (parallel) → aggregate → human approval → publish
* “Glue” between services (Lambda/ECS/Batch/SageMaker/EMR/Glue)

### Key knobs (senior knobs)

* **Workflow type**

  * **Standard**: durable, long-running, full history (default for pipelines)
  * **Express**: high-throughput, short-lived, cheaper per run (great for event fanout)
* **Retries/timeouts**: set per-state retry policy + overall state timeouts
* **Error handling**: Catch → route to compensation / DLQ / manual review
* **Parallel/Map**: control fanout; cap concurrency
* **Service integrations**: prefer native integrations to reduce glue Lambda
* **Execution history/logging**: enable CloudWatch logs + X-Ray when debugging

### Pricing mental model

* **Standard**: cost ≈ **state transitions**
* **Express**: cost ≈ **invocations + duration**
* Senior heuristic: optimize by **reducing “tiny states”** and unnecessary transitions; push heavy loops to Batch/ECS.

### Terraform template (Standard state machine + logs)

```hcl
resource "aws_cloudwatch_log_group" "sfn" {
  name              = "/aws/vendedlogs/states/${var.name}"
  retention_in_days = 14
}

data "aws_iam_policy_document" "sfn_assume" {
  statement {
    effect = "Allow"
    principals { type = "Service", identifiers = ["states.amazonaws.com"] }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "sfn_role" {
  name               = "${var.name}-sfn-role"
  assume_role_policy = data.aws_iam_policy_document.sfn_assume.json
}

# Add least-privilege permissions for the tasks you call (Lambda/ECS/Batch/etc)
resource "aws_iam_role_policy" "sfn_policy" {
  role = aws_iam_role.sfn_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Effect="Allow", Action=["lambda:InvokeFunction"], Resource=var.lambda_arns },
      { Effect="Allow", Action=["logs:CreateLogDelivery","logs:GetLogDelivery","logs:UpdateLogDelivery","logs:DeleteLogDelivery","logs:ListLogDeliveries","logs:PutResourcePolicy","logs:DescribeResourcePolicies","logs:DescribeLogGroups"], Resource="*" }
    ]
  })
}

resource "aws_sfn_state_machine" "sm" {
  name     = var.name
  role_arn = aws_iam_role.sfn_role.arn

  definition = jsonencode({
    Comment = "Example: agent/tool workflow"
    StartAt = "ToolCall"
    States = {
      ToolCall = {
        Type = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = var.tool_lambda_arn
          Payload = { "input.$" = "$" }
        }
        Retry = [{
          ErrorEquals = ["Lambda.ServiceException","Lambda.TooManyRequestsException","States.TaskFailed"]
          IntervalSeconds = 2
          MaxAttempts = 4
          BackoffRate = 2.0
        }]
        Catch = [{
          ErrorEquals = ["States.ALL"]
          Next = "FailToDLQ"
        }]
        Next = "Success"
      }
      FailToDLQ = { Type="Fail", Error="ToolFailed" }
      Success   = { Type="Succeed" }
    }
  })

  logging_configuration {
    level                  = "ALL"
    include_execution_data  = true
    log_destination         = "${aws_cloudwatch_log_group.sfn.arn}:*"
  }
}

variable "name"           { type = string }
variable "tool_lambda_arn"{ type = string }
variable "lambda_arns"    { type = list(string) default = [] }
```

---
