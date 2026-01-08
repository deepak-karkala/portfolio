---
title: 'Amazon API Gateway'
summary: 'Managed API gateway for REST and WebSocket APIs'
date: '2026-01-03'
order: 2
category: 'edge_routing'
---

# API Gateway

> (HTTP / REST / WebSocket)

##

### Where it fits (ML/GenAI)

* Managed API front door for **Lambda-first** backends, “tool APIs” for agents, auth/throttling, usage plans (REST), WebSockets for realtime.

### Key decision: HTTP API vs REST API

* **HTTP API**: minimal features, lower cost; good default for most APIs.
* **REST API**: choose when you need **API keys, per-client throttling, request validation, WAF integration, private endpoints**, etc. ([AWS Documentation][4])

### Key knobs that matter

* **Auth**

  * JWT authorizer (Cognito / OIDC) for HTTP APIs. ([AWS Documentation][5])
  * Lambda authorizers when you need custom logic.
* **Throttling**

  * Stage / route settings (rate + burst).
* **Payload size & streaming**

  * Large responses can alter billing shape (esp. streaming). ([Amazon Web Services, Inc.][6])
* **Observability**

  * Access logs, structured JSON logs, correlation IDs.

### Pricing mental model

* Dominant meter: **requests** + **data transfer**.
* Mental model: *“HTTP APIs are ~‘$1 per million-ish’ class; REST APIs are ~‘$3–4 per million-ish’ class, plus data transfer.”* (Exact varies by region/features.) ([Amazon Web Services, Inc.][6])

### Use API Gateway when

* You want **managed auth/throttling**, **Lambda integration**, easy multi-stage deploys, and don’t want to run ingress yourself.

### Avoid / reconsider when

* You’re already on ECS/EKS with an ingress stack and want cheapest high-throughput L7 → use **ALB**.
* You need ultra-low latency / L4 / static IPs → use **NLB**.

### Terraform template (HTTP API + JWT auth + Lambda proxy + throttling)

```hcl
# apigw_http_api.tf
resource "aws_apigatewayv2_api" "http" {
  name          = "${var.name}-http-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.handler.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_authorizer" "jwt" {
  api_id           = aws_apigatewayv2_api.http.id
  authorizer_type  = "JWT"
  name             = "${var.name}-jwt"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [var.jwt_audience]          # e.g., Cognito app client id
    issuer   = var.jwt_issuer              # e.g., https://cognito-idp.<region>.amazonaws.com/<pool_id>
  }
}

resource "aws_apigatewayv2_route" "route" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt.id
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = 50  # req/sec
    throttling_burst_limit = 100
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigw.arn
    format          = jsonencode({ requestId = "$context.requestId", routeKey="$context.routeKey", status="$context.status", latency="$context.responseLatency" })
  }
}

resource "aws_cloudwatch_log_group" "apigw" {
  name              = "/aws/apigw/${var.name}"
  retention_in_days = 14
}

# Allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

# Placeholder Lambda
resource "aws_lambda_function" "handler" {
  function_name = "${var.name}-handler"
  role          = var.lambda_role_arn
  handler       = "app.handler"
  runtime       = "python3.12"
  filename      = var.lambda_zip_path
}

variable "name"          { type = string }
variable "jwt_issuer"    { type = string }
variable "jwt_audience"  { type = string }
variable "lambda_role_arn" { type = string }
variable "lambda_zip_path" { type = string }
```

---