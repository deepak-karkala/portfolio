---
title: 'Master of Science in Communication Systems'
institution: 'EPFL (École polytechnique fédérale de Lausanne)'
location: 'Lausanne, Switzerland'
degree: 'Master of Science'
field: 'Communication Systems'
duration: 'Aug 2015 – May 2018'
grade: '5.25 / 6.0'
date: '2018-03-01'
category: 'Education'
order: 1
websiteUrl: 'https://www.epfl.ch/en/'
logo: '/logos/epfl.png'
highlights:
  - 'Master Thesis: Data Analysis & Anomaly Detection in Buildings using Sensor Data'
  - 'Built unsupervised anomaly detection system for predictive maintenance in smart buildings'
  - 'Grade: 5.25 / 6.0'
techStack:
  - 'Machine Learning'
  - 'Applied Data Analysis'
  - 'Computer Vision'
  - 'Natural Language Processing'
  - 'Algorithms'
---

##

### Institution

**[EPFL (École polytechnique fédérale de Lausanne)](https://www.epfl.ch/en/)**, Lausanne, Switzerland

**Grade:** 5.25 / 6.0

**Thesis:** [Data Analysis & Anomaly Detection in Buildings using Sensor Data](/education/masters_thesis.pdf)

![EPFL Master's Degree](/education/masters_degree.png)

![EPFL Transcript](/education/masters_transcript.png)

---

### [Master's Thesis: Data Analysis & Anomaly Detection in Buildings using Sensor Data](/education/masters_thesis.pdf)

**Supervisors:** Prof. Martin Rajman (EPFL), Fabrizio Lo Conte (eSMART Technologies Ltd)
**Completion Date:** March 2018

### Project Overview

Built an **unsupervised anomaly detection system** for **predictive maintenance** in smart buildings, using real sensor data (heating + hot water). The system enables early fault detection to transition from reactive to predictive maintenance, reducing costs and improving service quality.

---

### The Problem

The eSMART building system collects sensor data (e.g., **heating energy**, **room temperature**, **target temperature**, **hot water consumption**) from apartments and stores it centrally. The business pain: maintenance is typically reactive (resident calls → dispatch team), which is costly and slow.

**Goal:** Detect faults early and raise alerts to enable **predictive maintenance**.

---

### Detection Scenarios

The system addresses three key scenarios:

1. **Building-level abnormal heating energy** vs **external temperature** (using Heating Degree Days)
2. **Apartment heating regulation faults** where room temperature doesn't track set-point (e.g., heating continues above target, or room stays cold despite high set-point)
3. **Abnormal hot-water consumption** over consecutive days (resident notification / investigation)

---

### Dataset and Scale

<!--* **Deployment-scale dataset:** 44 buildings, 506 apartments-->
* **Historical coverage:** earliest buildings have data starting early 2013 (up to ~5 years for earliest sites)
* **Signals used:** heating energy, room temp, set-point temp, hot water volume
* **After preprocessing:** 389,647 valid apartment-days of heating energy data for modeling

---

### Technical Contributions

#### A) Industrial-grade Data Validation & Preprocessing

Documented real failure modes (faulty sensors, lost transmissions, recording errors) and built validation rules to prevent corrupt data from poisoning detection. This preprocessing work helped identify issues in the data collection/recording pipeline and was a **major industrial contribution**.

#### B) Unsupervised + Contextual Anomaly Detection

Because anomalies are **context-dependent** (e.g., low heating may be normal in summer but abnormal in winter) and labels were unavailable, I used unsupervised methods and framed the problem as **contextual anomalies**.

#### C) Ensemble of Complementary Detectors

Single methods produced more false positives, so I combined **Linear Regression** (global trend fit) with **Local Outlier Factor** (local density) for more reliable detection.

#### D) Two Notable Algorithmic Improvements

* **Bayesian prior for new buildings:** solved "cold start" (insufficient initial data), by using an average model across buildings as prior information so detection works in early months
* **Weighted Local Outlier Factor (WLOF):** addressed LOF failures when outliers form a **cluster** by weighting neighbor contributions using their anomaly scores

#### E) Scenario 3 (Hot Water) Methods

Used **exponential smoothing with control limits** and **robust z-score** for univariate hot-water anomaly detection, producing anomaly scores that can be thresholded by the user.

---

### Deployment & Dashboard

#### End-to-end System Flow

Daily building/apartment data → preprocessing checks → scenario-specific detection → anomaly scores stored in DB → accessed via dashboard.

#### Dashboard Features

* View historical alerts **sorted by abnormality** (triage)
* Visualize outliers in the feature space + show recent contextual signals (energy, temperatures, HDD)
* Tune **detection thresholds** to control system sensitivity and reduce false positives
* Set alert states (seen/ignore/false-positive) and filter by state
* Filter by building/apartment and date range

---

### Key Learnings

* **Industrial data quality matters:** significant effort went into data validation and preprocessing, which was crucial for deployment readiness
* **Context-aware detection:** anomaly detection must account for seasonal patterns and building-specific characteristics
* **Ensemble methods:** combining complementary approaches reduces false positives and increases reliability
* **Deployment-focused design:** the interactive dashboard was essential for operationalizing the system and enabling maintenance teams to act on insights

---

**Keywords:** Predictive maintenance, IoT sensor analytics, anomaly detection, unsupervised learning, time-series + contextual anomalies, data quality/validation, ensemble methods, Bayesian modeling, Local Outlier Factor, dashboarding for ops workflows.
