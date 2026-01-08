---
title: 'Events in Agentic AI Systems'
summary: 'Architectural patterns for event-driven agent coordination'
date: '2026-01-03'
order: 4
category: 'async_event_driven'
---

# SQS vs SNS vs EventBridge for Agentic AI Systems

## 

### The “job-to-be-done” mental model

* **SQS = Work queue** (buffer + backpressure + DLQ + pull-based workers)
* **SNS = Broadcast** (fanout notifications, “tell everyone something happened”)
* **EventBridge = Event router + auditability** (content-based routing, cross-account, archive/replay, schema discipline)

---

## Quick decision map (ask these in order)

### 1) Is there *work* that must be executed reliably (tools, jobs, agents)?

✅ **Yes → SQS (usually Standard)**

* You want: buffering, retry control, DLQ, worker autoscaling, “don’t drop tasks.”

### 2) Is it “notify many consumers” (alerts, downstream systems, UI updates)?

✅ **Yes → SNS**

* You want: fanout, simple filtering, push delivery (often **SNS → SQS per consumer** for reliability).

### 3) Do you need “evented architecture” features (routing by event content, governance, replay, cross-account)?

✅ **Yes → EventBridge**

* You want: event bus, rules, archive/replay, consistent event envelope, easier multi-consumer routing.

**Most agentic systems use all three together**:
**EventBridge as the backbone**, **SQS for execution**, **SNS for notifications**.

---

## What each service does in an Agentic AI architecture

### SQS in agents: “Tool execution engine”

**Used for**

* Tool calls: `ToolInvocationRequested` → tool worker
* Long-running steps: scraping, RAG ingestion, batch embedding, report generation
* Rate-limited external APIs (queue smooths bursts)

**Why**

* Deterministic retries + DLQ = robust tool execution
* Workers can autoscale off queue depth
* Handles spikes without overprovisioning inference/gateway

**Senior heuristics**

* Standard + **idempotency** is default (accept duplicates)
* FIFO only for strict per-entity ordering (e.g., same `user_id` state updates)
* Visibility timeout ≈ **p95 tool runtime + buffer**, DLQ `maxReceiveCount` 3–10

---

### SNS in agents: “Notifications + fanout”

**Used for**

* Human notifications: “Approval needed”, “Tool failed”, “Job complete”
* Multi-team consumers: monitoring, billing, analytics, email/slack, webhook consumers

**Why**

* Cheap/simple broadcast; subscribers can opt in/out
* With **SNS → SQS per consumer**, each consumer gets independent buffering + DLQ

**Senior heuristics**

* Use SNS for “tell N parties,” not as the durable work queue
* Keep payload small; include IDs and fetch details from a store if needed

---

### EventBridge in agents: “Event bus + traceability + replay”

**Used for**

* Domain events: `AgentRunStarted`, `ToolInvocationCompleted`, `HITLApproved`, `PolicyViolationDetected`
* Routing: send events to the right executors/observers based on `detail-type`, `tool_name`, `tenant_id`, etc.
* Audit: archive/replay (and/or route all events to S3)

**Why**

* Gives you **event-sourced audit trail** patterns
* Encourages a stable **event envelope** and schema versioning
* Best for multi-consumer, cross-account, multi-environment routing

**Senior heuristics**

* Treat EventBridge as the *control plane for events*; SQS as *data plane for execution*
* Archive/replay + immutable sink (S3) = strong incident recovery story

---

## The canonical “agentic plumbing” pattern

### Recommended architecture

* **Orchestrator** emits events to **EventBridge**
* **Rules route execution events to SQS queues** (by tool type / tenant / priority)
* **Tool workers poll SQS**, execute, emit completion events back to EventBridge
* **Observers** (metrics, analytics, audit) subscribe off EventBridge
* **SNS** handles “notify humans/external systems,” often via SNS→SQS

```mermaid
flowchart LR
  O[Agent Orchestrator / Planner] -->|Publish events| EB[(EventBridge Bus)]

  EB -->|Rule: tool=search| Q1[[SQS: tool.search]]
  EB -->|Rule: tool=db|     Q2[[SQS: tool.db]]
  EB -->|Rule: tool=email|  Q3[[SQS: tool.email]]

  Q1 --> W1[Tool Worker: Search]
  Q2 --> W2[Tool Worker: DB/CRM]
  Q3 --> W3[Tool Worker: Email/API]

  W1 -->|ToolInvocationCompleted/Failed| EB
  W2 -->|ToolInvocationCompleted/Failed| EB
  W3 -->|ToolInvocationCompleted/Failed| EB

  EB -->|All events| AUD[(Audit sink: S3 / OpenSearch)]
  EB -->|Rule: HITL required| SNS[(SNS Topic)]
  SNS --> N1[Human/Slack/Email]
  SNS --> QH[[SQS: approvals]] --> HITL[Approval Service] --> EB
```

---

## Traceability + event-sourced audit: what to standardize

### Event envelope (put this on **every** event)

* `trace_id` (end-to-end), `conversation_id`, `agent_run_id`
* `step_id` (per plan step), `tool_call_id`
* `idempotency_key` (for dedupe), `causation_id` / `parent_event_id`
* `tenant_id`, `schema_version`, `timestamp`, `producer`, `env`

### Audit strategy (choose one, often both)

* **EventBridge Archive + Replay** for operational reprocessing
* **Immutable sink to S3** (partitioned by dt, tenant, event_type) for compliance + analytics

---

## Retries & failure handling: who should own it?

### Tool execution (SQS-owned)

* Retries: worker-level + visibility timeout + DLQ
* Poison pills: DLQ + alarm; store failure reason + payload hash

### Routing delivery (EventBridge-owned)

* EventBridge retries target delivery, but **don’t rely on it** for long-running execution semantics

### Notifications (SNS-owned)

* SNS retries delivery, but for reliability prefer **SNS → SQS** for consumers that must not miss notifications

---

## The “choose this if…” summary (agentic-specific)

* **SQS**: “I must execute tool calls reliably, at scale, with backpressure + DLQ.”
* **SNS**: “I must notify multiple systems/humans; each consumer can process independently.”
* **EventBridge**: “I want a governable event backbone: routing, replay, cross-account, consistent audit trail.”
