---
title: 'Observability Stack'
summary: 'Complete monitoring architecture for production ML systems'
date: '2026-01-03'
order: 5
category: 'observability'
---

## Observability stack mental model (GenAI / agentic production)

* **Logs** answer: *“what happened?”* (inputs/outputs, tool calls, errors)
* **Metrics** answer: *“is it healthy?”* (SLIs/SLOs, rate/latency/error, cost signals)
* **Traces** answer: *“where is time spent?”* (end-to-end request + tool spans)
* In agentic systems, observability is also **auditability**: “why did the agent do that?”, “what did it call?”, “can I replay?”

```mermaid
flowchart LR
  U[User Request] --> GW[Inference Gateway]
  GW -->|logs| CWL[CloudWatch Logs]
  GW -->|metrics| CWM[CloudWatch Metrics/Alarms]
  GW -->|traces| XR[X-Ray Traces]
  GW --> TOOLS[Tool Executors: Lambda/ECS/Bedrock/DB]
  TOOLS -->|logs/metrics/traces| CWL
  TOOLS --> XR
  EKS[EKS/ECS/EC2 Infra] -->|Prometheus scrape/OTel| AMP[Managed Prometheus]
  AMP --> AMG[Managed Grafana Dashboards/Alerts]
  CWM --> AMG
  XR --> AMG
```

---

## Production “minimum viable observability” checklist (GenAI/agents)

* **Correlation ID everywhere**: request_id propagated to logs + traces + tool calls.
* **Redaction policy**: never log secrets/PII; sample payloads only with explicit gate.
* **Three dashboards**:

  1. Golden signals (RPS/latency/errors)
  2. Dependency health (vector DB, LLM provider, tools)
  3. Cost signals (token usage, cache hit rate, retries)
* **Paging alarms**: error-rate + p95 latency + queue age + DLQ > 0.
* **Tracing**: sample baseline + 100% on errors/timeouts.

---
