# Lambda vs EC2 vs Fargate

## 1) The 30-second decision tree

### Step A — Hard constraints (pick the *minimum viable* option)

* **GPU / custom drivers / huge shared memory / kernel tuning** → **EC2** (often behind **ECS on EC2** or **EKS**)
* **Long-running jobs** (>15 min), **daemon processes**, **streaming sockets**, **sidecars** → **Containers (ECS/EKS/EC2)**
* **Must be serverless + event-driven + short tasks** → **Lambda**
* **Kubernetes ecosystem required** (operators/service mesh/custom scheduling/multi-tenant platform) → **EKS**
* Else default → **ECS** (simpler than EKS for most app teams)

### Step B — Ops surface area (who will own it at 2am?)

* Want **zero node ops** → **Lambda** or **ECS Fargate**
* Comfortable with infra + want best $/compute → **ECS on EC2** (or EKS nodes on EC2)
* “K8s is already our company OS” → **EKS**

### Step C — Traffic shape (this is the biggest lever)

* **Spiky / unpredictable / low duty cycle** → **Lambda**
* **Steady baseline** (always-on) → **Fargate → ECS on EC2** progression

### Step D — Latency SLO

* **Strict p99** and cold starts hurt → usually **containers** (or **Provisioned Concurrency**, but that reduces Lambda’s cost advantage)
* **Ok with occasional cold start** → Lambda is fine

---

## 2) Cost mental model: “Are you paying for *idle*?”

### Lambda cost model (mental math)

You pay: **requests + GB-seconds**. ([Amazon Web Services, Inc.][1])
A very usable approximation (ignoring free tier):

> **Lambda $/1M ≈ $0.20 + (avg_duration_seconds × memory_GB × 16.67)**

Why: $0.0000166667 per GB-second ⇒ **$16.67 per 1M GB-seconds** + $0.20 per 1M requests. ([Amazon Web Services, Inc.][1])

Examples (per **1M requests**):

* **512MB, 200ms** → ≈ **$1.87 / 1M**
* **1GB, 200ms** → ≈ **$3.53 / 1M**
* **1GB, 1s** → ≈ **$16.87 / 1M**

(These are straight from the formula above.)

### Fargate cost model (mental math)

You pay: **vCPU-seconds + GB-seconds (+ optional ephemeral storage)**. ([Amazon Web Services, Inc.][2])
From AWS’s example rates (Linux/x86, us-east-1 style):

* vCPU: **$0.000011244 per vCPU-second**
* memory: **$0.000001235 per GB-second** ([Amazon Web Services, Inc.][2])

Useful always-on monthly baselines (730h/month):

* **0.25 vCPU + 0.5GB** ≈ **$9 / month**
* **1 vCPU + 2GB** ≈ **$36 / month**
* **2 vCPU + 4GB** ≈ **$72 / month**

> For HA, assume **2 tasks minimum** ⇒ **double** those numbers.

### ECS on EC2 / EC2 direct

* Control plane isn’t the main cost; you’re mostly paying **instances + EBS + networking** (and you can buy down cost with **Savings Plans (up to ~72%)** or **Spot (up to ~90%)** in the right workloads). ([Amazon Web Services, Inc.][3])

### EKS extra fixed cost

* **$0.10/cluster-hour** in standard support (≈ **$73/month/cluster**) and **$0.60/hr** in extended support (≈ **$438/month/cluster**) if you don’t upgrade. ([Amazon Web Services, Inc.][4])

---

## 3) “When should I switch from Lambda to Fargate?” (practical thresholds)

Think in two triggers: **(1) you’re paying for warmth**, or **(2) you have enough steady work to keep containers busy.**

### Trigger 1 — You start needing “warmth guarantees”

Switch away from pure Lambda when:

* You need **Provisioned Concurrency** to hit p99 consistently (you’re effectively paying for an always-on slice).
* VPC cold starts + heavy deps are hurting user experience and you’re compensating with overprovisioning.

### Trigger 2 — Your workload is steady enough that “always-on wins”

For an **always-on API** (so you must keep capacity running), compare:

> **Lambda monthly ≈ (reqs/1M × Lambda $/1M)**
> **Fargate monthly ≈ always-on task cost × number_of_tasks**

A few *very actionable* break-evens (single always-on task; double req thresholds if you need 2 tasks):

**If your Lambda handler is “light” (512MB, 200ms):**

* Break-even vs **0.25vCPU/0.5GB** always-on task is ~**4.8M req/month** (~1.8 RPS average).
* Meaning: Lambda stays cost-effective for a long time when handlers are truly tiny.

**If your handler is “medium” (1GB, 1s):**

* Break-even vs **0.25vCPU/0.5GB** always-on is ~**0.53M req/month** (~0.2 RPS average).
* Meaning: as duration grows, Lambda becomes expensive surprisingly early.

**The senior heuristic:**

> If **(avg RPS × avg duration)** is keeping you at **sustained concurrency** (e.g., concurrency ~10–50+) for most of the day, start modeling containers seriously.

Because concurrency is literally “how much compute is continuously busy.”

---

## 4) Lambda vs Fargate vs ECS/EC2 vs EKS vs EC2: “default picks” by situation

### Default picks

* **Lambda**: spiky, low duty cycle, short tasks, async workers, tool glue.
* **Fargate**: you want containers **now**, minimal ops, moderate steady load, easy scaling.
* **ECS on EC2**: steady traffic + cost matters + you can run a platform fleet (best $/compute).
* **EKS**: Kubernetes-native org, multi-team platform, advanced scheduling/ecosystem.
* **EC2 direct**: extreme perf/GPU tuning, custom networking/AMIs, bespoke inference stacks.

### The “maturity ladder” (common in real orgs)

1. Start **Lambda** (fastest)
2. Move to **Fargate** when latency/SLO or packaging gets real
3. Move to **ECS on EC2** when steady-state utilization makes cost hurt
4. Adopt **EKS** when platform scale + k8s ecosystem outweighs overhead (and cluster fixed costs)

---




## Example Scenario

Given:

* **5M req/month**
* **1GB Lambda memory**
* **p50=200ms, p95=1s**
* **token streaming** (important: gateway often stays “open” until the stream finishes)

### First, translate traffic into “steady load”

* Average RPS ≈ ( 5,000,000 / 2,592,000 ) ≈ **1.93 RPS**
* Average concurrency ≈ **RPS × avg_duration**

  * if avg duration **0.4s** ⇒ **~0.77 concurrent**
  * if avg duration **1.0s** ⇒ **~1.93 concurrent**
  * if avg duration **2.0s** ⇒ **~3.86 concurrent**

So this is a *low steady-state* gateway load; you’re not forced into fleets for throughput reasons.

---

## Lambda monthly cost (compute only) for this workload

Lambda compute price is **$0.0000166667 per GB-second** + **$0.20 per 1M requests**. ([Amazon Web Services, Inc.][1])

For **5M requests** and **1GB** memory:

| Assumed avg duration (per request) | Lambda compute + request cost / month |
| ---------------------------------: | ------------------------------------: |
|                               0.2s |                            **$17.67** |
|                               0.4s |                            **$34.33** |
|                               1.0s |                            **$84.33** |
|                               2.0s |                           **$167.67** |
|                               5.0s |                           **$417.67** |

**Why streaming matters:** in a typical streaming gateway, the function often remains active while it proxies tokens—so “duration” can drift toward “time to finish streaming,” not “time to start streaming.”

Also, API Gateway **REST Response Streaming** bills normal request + data transfer, but has a **10MB request increment** rule that only bites when payloads are huge (typical token streams are well below 10MB). ([Amazon Web Services, Inc.][2])

---

## Fargate monthly cost (always-on) for a small gateway

Fargate (Linux/x86 us-east style) example rates:

* **$0.000011244 per vCPU-second**
* **$0.000001235 per GB-second** ([Amazon Web Services, Inc.][3])
  (equivalently $0.04048 per vCPU-hour and $0.004445 per GB-hour) ([Amazon Web Services, Inc.][4])

If you run **2 tasks for HA** (typical), always-on (730h/mo):

### Option A: 0.5 vCPU + 1 GB per task (reasonable async gateway size)

* Per task ≈ **$18.02/mo**
* Two tasks ≈ **$36.04/mo**

### Option B: 1 vCPU + 2 GB per task (more headroom)

* Two tasks ≈ **$72.08/mo**

---

## The break-even (Lambda → Fargate) for *your* numbers

Compare Lambda vs **2× Fargate tasks** (0.5 vCPU/1GB each ≈ $36/mo):

* At **5M req/mo, 1GB**, Lambda matches ~$36/mo when **avg duration ≈ 0.42s**.
* If your gateway’s **avg duration is > ~0.4–0.5s**, Fargate starts to look cost-competitive **even before** you factor in latency/SLO and cold start mitigation.

If you need **bigger tasks** (2× 1 vCPU/2GB ≈ $72/mo), Lambda matches that when **avg duration ≈ 0.85s**.

---

## Don’t forget the ingress costs (often decides the architecture)

### If you keep Lambda:

* Likely fronted by **API Gateway**
* HTTP API example pricing shows **$1.00 per million** (at that tier), so **5M ≈ $5/mo** class. ([Amazon Web Services, Inc.][2])
* REST API example shows **$3.50 per million**, so **5M ≈ $17.50/mo**. ([Amazon Web Services, Inc.][2])

### If you run Fargate:

* Often fronted by **ALB** for streaming-friendly behavior
* ALB has a fixed-ish monthly base in the **tens of dollars** range (example shows ~$32.76/mo for one ALB with light usage). ([Amazon Web Services, Inc.][5])

**Net effect:** ALB’s fixed monthly cost can make “tiny” container services look more expensive than Lambda at low durations; but once Lambda duration creeps up (streaming or downstream waits), containers catch up quickly.

---

## Senior heuristics for this specific workload

### If you can keep gateway duration ~0.2–0.4s on average

**Stick with Lambda** (especially if spiky traffic)

* Cost is excellent (~$18–$34/mo compute for 5M req)
* Add **reserved concurrency** only if p99 demands; avoid provisioned concurrency unless necessary (it erodes Lambda’s advantage). ([Amazon Web Services, Inc.][1])

### If average duration is realistically ~0.8–2s (common when proxying full streams)

**Move to ECS on Fargate**

* You’ll likely be in the **$36–$72/mo** compute band for an always-on gateway
* Better control over **connection reuse, streaming semantics, and p99** (no cold starts)
* Operationally still simple (no nodes)

### Only go ECS on EC2 / EC2 direct / EKS if…

* You’re also hosting **GPU model servers** or need **custom drivers/AMIs**
* You want to buy down cost with **Savings Plans / Spot** at scale
* Or your org is Kubernetes-native and you want platform standardization (EKS adds a fixed cluster cost). ([Amazon Web Services, Inc.][6])

---

## Recommendation

For a “chat inference gateway” with token streaming:

* **Default recommendation:** **ECS on Fargate + ALB** *if* your gateway holds the request open to proxy tokens (avg duration likely ≥ ~0.8–1s).
* **Lambda is still great** if your design lets Lambda finish quickly (e.g., it hands off stream handling elsewhere) and you can tolerate occasional cold starts.

