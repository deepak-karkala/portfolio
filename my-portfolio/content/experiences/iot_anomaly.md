---
title: 'IoT Predictive Maintenance & Heating System Anomaly Detection'
summary: 'Built an anomaly detection system that reduced emergency maintenance callouts by 20% through early fault detection'
date: '2022-11-20'
category: 'ML Engineer at eSMART Technologies'
categoryDuration: 'Jun 2018 - Dec 2020'
role: 'ML Engineer'
company: 'eSMART Technologies | Renens, Switzerland'
websiteUrl: 'https://myesmart.com/en/'
duration: ''
location: 'Remote | Renens, Switzerland'
logo: '/logos/esmart.png'
techStack:
  - 'Python'
  - 'scikit-learn'
  - 'Time Series Analytics'
  - 'MLOps Pipelines'
  - 'Anomaly Detection'
highlights:
  - 'Deployed anomaly detection + alert triage for heating systems; reduced emergency maintenance callouts by 20%.'
  - 'Diagnosed production alert-fatigue issue causing low adoption; partnered with maintenance teams and leadership to redesign system as a prioritization tool vs. fully automated detector.'
  - 'Evolved approach from unsupervised (residuals + LOF) to supervised as labels grew via technician human-in-the-loop validation; achieved 75% Precision@50 for high-priority alerts and restored stakeholder trust.'
featured: true
order: 5
---

##
---

### The Problem

Residential buildings equipped with smart meters generate high-resolution data from temperature sensors, flow meters, and control systems — yet maintenance teams were still working **reactively**. In many cases, faults such as **stuck radiator valves, failing circulation pumps, boiler inefficiencies, or misconfigured thermostats** weren’t noticed until residents complained.

This led to:

* High number of emergency maintenance callouts
* Unpredictable technician workload
* Higher operating cost due to inefficient heating
* Poor resident comfort and avoidable system degradation

The challenge was to **detect faults early** using IoT data — even when **no labeled historical faults existed.**

---

### The Solution

I built a **production anomaly detection system** capable of analyzing energy and indoor-climate time series to identify patterns that indicate system malfunction.

The solution included:

| Component                 | Details                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Detection Engine**      | Unsupervised anomaly scoring with regression residuals + Local Outlier Factor        |
| **Feedback Loop**         | Human-in-the-loop validation workflow with field technicians                         |
| **Refinement**            | Transition from unsupervised → semi-supervised → supervised modelling as labels grew |
| **Contextual Ranking**    | Alerts prioritized by severity, persistence, and building context                    |
| **Sensor Health Scoring** | Detection of missing data, drift, stuck values, and metadata inconsistencies         |

This evolution enabled the model to move from “noticing abnormal signals” to **identifying meaningful failure patterns** aligned with real-world operations.

---

### Business & Technical Results

The deployed system delivered measurable improvements:

* **~20% reduction in emergency maintenance callouts**
* **Estimated ~15–20% improvement in maintenance efficiency**
* **75% precision@50** for high-priority alerts reviewed by technicians
* Faster identification of faults such as **short-cycling boilers** and **stuck valves**

These gains translated directly into fewer urgent interventions, improved comfort, and reduced operational uncertainty.

---

### Technical Highlights

* Python, scikit-learn, time-series analytics
* Unsupervised → supervised modelling strategy
* Automated feature engineering (lags, gradients, weather data)
* Production MLOps pipeline with monitoring, evaluation, and scheduled retraining
* Integration into building-management dashboards with technician-validated labeling workflows

---

### Challenges and learnings

#### When “Statistical Anomalies” Became Operational Noise

One of the most critical challenges in this project was bridging the gap between **statistical anomaly detection** and **operationally meaningful alerts**. The initial unsupervised model correctly identified deviations in energy behavior, but in production this translated into excessive alerts driven by normal human behavior—vacations, schedule changes, and low-occupancy buildings. This created severe **alert fatigue** for the maintenance team and quickly eroded trust in the system, putting the project’s adoption at risk.

As the senior ML engineer on the project, I worked closely with maintenance teams, product managers, and leadership to **reframe the problem**: the system was not failing technically—it was failing as a decision-support tool. We shifted from a “fully automated detector” mindset to a **human-in-the-loop design**, redesigning the alerting UX, adding contextual visualizations, and introducing lightweight technician feedback mechanisms. This transformed the model’s role from a noisy detector into a **prioritization and triage assistant**.

The collected feedback enabled iterative threshold tuning, suppression of known benign patterns (e.g., prolonged zero consumption), and ultimately a transition to a **supervised model trained explicitly on confirmed equipment faults**. This phase marked a turning point: alert precision improved significantly, technician trust was restored, and the system began delivering measurable operational value.

**Key takeaway:** In real-world ML systems, *correct models can still fail products*. Designing for adoption—through stakeholder collaboration, expectation management, and human-in-the-loop workflows—is as important as model accuracy.


#### Balancing Model Generalization vs. Building-Specific Behavior

As the system scaled across a heterogeneous building portfolio, a key challenge emerged: a single global model performed well on “average” buildings but failed on important outliers such as **high-efficiency passive houses** and **older, poorly insulated buildings**. While aggregate metrics looked healthy, building-level analysis revealed large performance disparities, exposing bias toward majority building types.

I led the investigation into these discrepancies by breaking down performance per building and using **model explainability (SHAP)** to understand failure modes. This analysis showed that the global model had implicitly learned assumptions about “normal” energy behavior that did not hold across different physical building dynamics. The issue wasn’t data scarcity or overfitting—it was **structural heterogeneity** in the underlying systems.

Working closely with domain experts, product stakeholders, and the platform team, I guided the decision toward a **hybrid modeling strategy**. We segmented buildings into a small number of **archetypes** based on physical characteristics and trained **separate models per archetype**, striking a balance between accuracy, scalability, and operational complexity. This required re-architecting both training and inference pipelines to dynamically select models at runtime and manage them cleanly via the model registry.

The result was a substantial and consistent improvement in precision across previously underperforming buildings, while keeping the system operationally manageable.

**Key takeaway:** In real-world ML systems, “fairness” and robustness extend beyond user data to physical assets. Designing for heterogeneity—and building flexible MLOps pipelines to support it—is a core responsibility at senior level.


---


### What I Learned

This project reinforced that anomaly detection in the real world is not a one-shot model problem — it’s an **iterative system** combining:

* Data quality validation
* Human feedback
* Hybrid modelling techniques
* Operational resonance with domain experts

The biggest lesson: **accuracy isn’t enough — the model must produce alerts that technicians trust and can act on.**
