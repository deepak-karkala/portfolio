# Fast “which SageMaker serving mode?” (senior heuristics)

* **Real-time endpoint**: strict latency SLO, stable traffic, always-on.
* **Async inference**: long-running requests, bursty traffic, tolerate async response.
* **Batch transform**: offline scoring/embeddings/evals; cheapest for periodic bulk.
