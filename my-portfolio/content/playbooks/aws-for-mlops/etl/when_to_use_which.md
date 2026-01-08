# One-page “choose the tool” summary

* **Athena**: fastest way to query S3; cost is “data scanned”; win via Parquet + partitions.
* **Glue**: managed ETL + catalog; great default for batch transforms and curated lake tables.
* **EMR Serverless**: Spark jobs without cluster ops; best for bursty big jobs.
* **EMR on EC2**: max control and best cost at huge scale (especially with Spot + tuning).
