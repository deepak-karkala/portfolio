---
title: 'Amazon CloudFront'
summary: 'CDN for global content delivery and edge caching'
date: '2026-01-03'
order: 3
category: 'edge_routing'
---

# CloudFront

> (CDN + edge security + signed URLs)

## 

### Where it fits (ML/GenAI)

* Public front door for **chat UIs**, **static assets**, **RAG document downloads**, **streaming responses** (often still through origin), **global latency**.
* Protects origin from spikes; reduces origin load via caching + connection reuse. ([Amazon Web Services, Inc.][1])

### Key knobs that matter

* **Origins**: S3 / ALB / API Gateway / any public URL.
* **OAC for S3**: Use **Origin Access Control** (recommended over OAI) so S3 is private. ([AWS Documentation][2])
* **Cache policy**: TTLs, query string/header/cookie cache keys (biggest perf+cost lever).
* **Origin request policy**: forward only what origin needs (avoid cache fragmentation).
* **Response headers policy**: security headers, CORS.
* **Compression**: enable gzip/brotli.
* **Price class**: cheaper vs worldwide latency.
* **WAF**: attach for L7 protection (esp. APIs).
* **Logs**: access logs (cost/volume trade-off).
* **Signed URLs/cookies**: private content gating via **trusted key groups**. ([AWS Documentation][3])

### Pricing mental model

* **Main meters**: **GB delivered to internet + request count** (cache hit rate is your multiplier).
* **Origin “savings”**: data transfer **between CloudFront and AWS origins is waived** (helps when origin is in AWS). ([Amazon Web Services, Inc.][1])
* **New option**: **flat-rate plans** (bundle CDN + WAF/DDoS/DNS/logging/edge compute) can simplify budgeting. ([Amazon Web Services, Inc.][1])
* Interview mental model: *“CloudFront bill ≈ (egress GB after caching) + (requests); optimize via cache keys + TTL + compression.”*

### Use CloudFront when

* Global users, static-heavy UI, bursty traffic, DDoS/WAF needs, or you want **signed URL** distribution for private files.

### Avoid / reconsider when

* Purely private APIs (intranet), or ultra-low-latency single-region workloads where caching doesn’t help.

### Terraform template (CloudFront + S3 private origin via OAC)

```hcl
# cloudfront.tf
resource "aws_s3_bucket" "origin" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "origin" {
  bucket                  = aws_s3_bucket.origin.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.name}-oac"
  description                       = "OAC for private S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # cheaper; change if you need worldwide

  origin {
    domain_name              = aws_s3_bucket.origin.bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    # Simple defaults. For real apps, use managed cache/origin request policies.
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # For custom domain:
    # acm_certificate_arn      = var.acm_cert_arn
    # ssl_support_method       = "sni-only"
    # minimum_protocol_version = "TLSv1.2_2021"
  }
}

# Allow ONLY this distribution to read the bucket (OAC)
data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid     = "AllowCloudFrontRead"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.origin.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "origin" {
  bucket = aws_s3_bucket.origin.id
  policy = data.aws_iam_policy_document.bucket_policy.json
}

variable "name"        { type = string }
variable "bucket_name" { type = string }
```

> For **signed URLs**, add a `aws_cloudfront_public_key` + `aws_cloudfront_key_group`, then set `trusted_key_groups` in the cache behavior. CloudFront verifies signatures using trusted key groups. ([AWS Documentation][3])

---