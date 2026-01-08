---
title: 'ALB / NLB'
summary: 'Load balancing for HTTP/HTTPS and TCP/UDP traffic'
date: '2026-01-03'
order: 1
category: 'edge_routing'
---

# ALB vs NLB

> (Elastic Load Balancing)

##
### ALB (Application Load Balancer) — L7 ingress

**Best for**: HTTP/HTTPS APIs on ECS/EKS/EC2; routing by **host/path/headers**, **gRPC/HTTP2**, blue/green, canary via rules. ([Amazon Web Services, Inc.][7])

**Key knobs**

* **Listeners**: HTTPS + ACM certs, redirects (80→443)
* **Target groups**: instance/ip/lambda; health checks (path, matcher)
* **Routing rules**: host/path-based, weighted forward
* **Access logs** to S3
* **Idle timeout** (long-running requests / streaming)
* **Cross-zone** and stickiness (sparingly)

**Cost mental model**

* Pay **per ALB-hour + per LCU-hour** (LCU driven by max of: new conns, active conns, bytes, rule evals). ([Amazon Web Services, Inc.][8])
* Back-of-envelope (us-east-1 style): **~$16/month base** + **~$6/month per steady 1 LCU** ⇒ *“ALB is ~$20–30/month for light steady traffic; then scales with throughput.”* ([Amazon Web Services, Inc.][8])

### NLB (Network Load Balancer) — L4 ingress

**Best for**: TCP/UDP/TLS, very high throughput, **static IPs**, **source IP preservation**, lower overhead. (Also supports TLS termination.) ([Amazon Web Services, Inc.][9])

**Key knobs**

* **Listener protocol**: TCP/UDP/TLS
* **Target groups**: instance/ip/alb
* **Cross-zone LB** (on/off)
* **Proxy protocol / source IP needs** (application-level implications)

**Cost mental model**

* Pay **per NLB-hour + per NLCU-hour** (max of: new conns/flows, active, bytes; protocol affects NLCU math). ([Amazon Web Services, Inc.][8])
* Similar base hourly feel as ALB; scales on network load via NLCU.

### ALB vs NLB: decision heuristics (fast)

* Need **HTTP routing**, WAF at L7, gRPC, path/host rules → **ALB**
* Need **TCP/UDP**, **static IP**, extreme throughput, preserve client IP → **NLB**
* For most app APIs on ECS/EKS: **ALB default**; use NLB when you have a clear L4 requirement.

### Terraform template (ALB + TG + HTTPS listener + access logs)

```hcl
# alb.tf
resource "aws_security_group" "alb" {
  name        = "${var.name}-alb-sg"
  description = "ALB ingress"
  vpc_id      = var.vpc_id

  ingress { from_port = 443, to_port = 443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 80,  to_port = 80,  protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0,   to_port = 0,   protocol = "-1",  cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_lb" "alb" {
  name               = "${var.name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  access_logs {
    bucket  = var.alb_logs_bucket
    prefix  = "alb"
    enabled = true
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${var.name}-tg"
  port        = var.target_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # common for ECS/Fargate

  health_check {
    path                = "/health"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.acm_cert_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

variable "name"              { type = string }
variable "vpc_id"            { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "target_port"       { type = number }
variable "acm_cert_arn"      { type = string }
variable "alb_logs_bucket"   { type = string }
```

### Terraform template (NLB + TG + TLS listener)

```hcl
# nlb.tf
resource "aws_lb" "nlb" {
  name               = "${var.name}-nlb"
  load_balancer_type = "network"
  subnets            = var.public_subnet_ids
  # For static IPs, allocate EIPs per subnet and use subnet_mapping blocks.
}

resource "aws_lb_target_group" "tcp" {
  name        = "${var.name}-nlb-tg"
  port        = var.target_port
  protocol    = "TCP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    protocol = "TCP"
  }
}

resource "aws_lb_listener" "tls" {
  load_balancer_arn = aws_lb.nlb.arn
  port              = 443
  protocol          = "TLS"
  certificate_arn   = var.acm_cert_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tcp.arn
  }
}

variable "name"              { type = string }
variable "vpc_id"            { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "target_port"       { type = number }
variable "acm_cert_arn"      { type = string }
```

---