# Fast “which one should I use?” (streaming + ingestion)

### Pick **Firehose** if…

* Goal is **delivery to S3/OpenSearch/Redshift** with minimal ops.
* You’re ok with **buffered near-real-time** and want cost to track GB ingested.

### Pick **Kinesis Data Streams** if…

* You need **multiple independent consumers** and **low-latency custom processing**.
* You can manage shards/partitioning (or accept EFO costs as consumers grow).

### Pick **MSK** if…

* Kafka ecosystem is required (Connect/Streams tooling, standards) or you need Kafka semantics.
* Expect more ops/cost complexity (brokers/partitions), but better portability/integration.
