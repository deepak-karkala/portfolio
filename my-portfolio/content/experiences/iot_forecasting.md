---
title: 'Building-Level Energy Forecasting & Smart Energy Advisor'
summary: 'Developed time-series forecasting models for building energy optimization and smart heating schedules'
date: '2022-08-10'
category: 'ML Engineer at eSMART Technologies'
categoryDuration: 'Jun 2018 - Dec 2020'
role: 'ML Engineer'
company: 'eSMART Technologies | Renens, Switzerland'
websiteUrl: 'https://myesmart.com/en/'
duration: ''
location: 'Remote | Renens, Switzerland'
techStack:
  - 'Python'
  - 'Time Series Models'
  - 'IoT Data Processing'
  - 'Forecasting'
highlights:
  - 'Delivered 24-hour ahead energy demand forecasting (XGBoost + weather, lag, rolling windows, holiday features) powering resident-facing recommendations; achieved under 10% MAPE and 10 percentage points increase in solar self-consumption.'
  - 'Partnered with domain experts to design tiered cold-start strategy for newly commissioned buildings (physics-informed heuristics -> archetype models -> individualized forecasts).'
  - 'Implemented walk-forward validation, baselines (ARIMA/Prophet), and drift monitoring.'
order: 6
---

##
---

### The Problem

Residents living in smart, energy-connected apartments had access to consumption dashboards — but **not predictive insights**.

Without forecasting:

* Solar-powered buildings lacked guidance for load shifting
* Residents couldn’t optimize appliance timing or consumption patterns
* Building-level planning for heating control was reactive rather than proactive

The key question:

> *“If we can predict tomorrow’s energy demand, can we help residents lower costs and increase renewable usage?”*

---

### The Solution

I developed a **24-hour ahead forecasting system** that predicts daily heating + electrical demand using historical smart-meter data, weather forecasts, and seasonal behavioral signals.

It powered a resident-facing feature called **Smart Energy Advisor**, which generates personalized recommendations based on predicted demand trends and solar availability.

| Component           | Details                                                                               |
| ------------------- | ------------------------------------------------------------------------------------- |
| **Forecast Model**  | XGBoost-based regression with time-series feature engineering                         |
| **Feature Inputs**  | Weather forecast, rolling windows, HDD, occupancy proxies, calendar effects           |
| **Validation**      | Walk-forward evaluation and drift analysis                                            |
| **Deployment**      | MLOps pipeline with automated retraining, weather-feed fallback, and error monitoring |
| **User Experience** | Forecast-driven nudges and appliance-timing suggestions in the mobile app             |

---

### Business & Technical Results

The system demonstrated meaningful impact:

* **<10% MAPE** across seasonal variations
* **~15% increase in user engagement** with energy tools
* **~10-percentage-point increase in solar self-consumption** among participating households
* Improved transparency, sustainability awareness, and behavioral adoption

---

### Technical Highlights

* Python, scikit-learn, XGBoost
* Time series pipeline: lag features, seasonality encoding, rolling statistics
* Robustness logic for missing intervals, sensor irregularity, and weather outage fallback
* Walk-forward CV, baseline benchmarking (ARIMA, Prophet, seasonal naive)
* MLOps evaluation dashboards and alerting for drift and unusual deviations

---

### Challenge: Cold-Start in Newly Commissioned Buildings

One of the most subtle but high-impact challenges in this project was handling **newly commissioned buildings**, where predictive monitoring is most valuable but historical data is essentially nonexistent. Both anomaly detection and forecasting models depend on learning a building’s unique thermal behavior, yet early-life operation is dominated by unstable occupancy, system calibration, and commissioning effects. A naïve application of data-driven models during this phase led to noisy alerts and unreliable forecasts, risking both missed faults and loss of user trust.

In my role, I worked closely with domain experts, maintenance teams, and product stakeholders to design a **tiered cold-start strategy** that evolves as data maturity increases. Instead of forcing a single model to work across all phases, we explicitly separated **commissioning logic from mature ML logic**. Early operation relied on **physics-informed heuristics and engineering rules** to catch obvious installation and control failures. As limited data became available, we transitioned to **archetype-based and Bayesian models** that combined prior knowledge from similar buildings with emerging local signals. Only once sufficient history was accumulated did buildings graduate to fully individualized models.

**Key takeaway:** Cold-start is not just a modeling problem—it is a lifecycle design problem. Treating commissioning, early operation, and maturity as distinct phases, and aligning expectations with stakeholders at each stage, was essential to building a production-ready ML system that operators could rely on from the very first weeks of a building’s life.

---

### What I Learned

This project emphasized that **forecasting alone doesn’t create value — behavior change does.**

Delivering the model as an **interactive, understandable energy insight tool** made the difference. The success came from:

* Transparent communication of predictions
* Integration into daily user context
* Iterative feedback from both product & engineering stakeholders

It showed how machine learning in the built environment can directly contribute to **sustainability, cost reduction, and user empowerment.**

___