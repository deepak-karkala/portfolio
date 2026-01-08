# One-page “choose the orchestrator” rule

* **Step Functions**: default for **service workflows + agent workflows**; best retries/timeouts + integrations.
* **MWAA**: choose when you need **Airflow UI/operations** (DAG authoring culture, backfills, SLAs).
* **Batch**: choose when the core need is **massive parallel compute** (Spot-heavy, array jobs).
* **SageMaker Pipelines**: choose when you want **ML-native lineage/governance** tightly coupled to SageMaker jobs.
