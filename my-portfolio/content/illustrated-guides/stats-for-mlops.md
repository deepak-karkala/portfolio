---
title: "DriftCity: Statistics for MLOps"
summary: "Interactive, narrative-driven platform teaching production ML statistical concepts through hands-on visualizations and real-world case studies."
image: "/illustrated-guides/stats-mlops-cover.png"
category: "Interactive Educational Platform"
techStack: ["Next.js 14", "Plotly.js", "MDX", "D3-DSV", "TypeScript"]
date: "2024-12-15"
externalUrl: "https://stats-for-mlops.vercel.app/chapters/chapter-1"
githubUrl: "https://github.com/deepak-karkala/stats-for-mlops"
highlights:
  - "6 comprehensive chapters with narrative cohesion"
  - "16 interactive Plotly visualizations"
  - "Industry case studies from Uber, Airbnb, Netflix, DoorDash"
  - "PSI, KS test, CUPED, A/B testing implementations"
---

# DriftCity: Statistics for MLOps

An interactive educational platform that transforms how teams learn MLOps statistics by combining narrative storytelling, live visualizations, and production patterns.

## Overview

DriftCity teaches production ML statistical concepts through three powerful forces:

- **Narrative Cohesion**: A fictional "DriftCity" story where algorithms power urban transportation, making abstract concepts tangible through metaphor
- **Interactive Exploration**: Live Plotly visualizations with sliders, comparisons, and real-time calculations that let learners experiment and discover
- **Production Reality**: Code patterns and case studies from Uber, Airbnb, Netflix, and DoorDash showing exactly how these concepts work in practice

## The Problem

Machine Learning teams face a critical knowledge gap when it comes to production model operations. Understanding concepts like data drift, A/B testing, and variance reduction is essential for maintaining reliable ML systems, yet these topics are typically scattered across dense textbooks, taught through static equations, and disconnected from real-world implementation.

## Statistical Concepts Covered

### Chapter 1: The City That Learned Too Fast
**Baseline Distributions & Drift Detection**
- Population Stability Index (PSI) for quantifying distribution shift
- Kolmogorov-Smirnov Test for comparing empirical CDFs
- Establishing baseline P(X) for feature monitoring

### Chapter 2: The Weather Event
**Covariate Drift (P(X) Changes)**
- Covariate shift where input distributions change while P(Y|X) remains stable
- Distribution overlay analysis for visual comparison
- Trend monitoring to detect sustained shifts over time

### Chapter 3: The Vanishing Commuter
**Concept Drift (P(Y|X) Changes)**
- Understanding when the relationship between inputs and outputs breaks down
- RMSE/MAE trend analysis as drift signals
- Residual analysis for identifying spatial/temporal patterns in model failures

### Chapter 4: The Great Experiment
**A/B Testing & Controlled Experiments**
- Sample Ratio Mismatch (SRM) with chi-square test
- Statistical power analysis for determining sample sizes
- Understanding Type I and Type II errors

### Chapter 5: The CUPED Control Tower
**Variance Reduction & Sequential Testing**
- CUPED (Controlled-experiment Using Pre-Experiment Data)
- Variance reduction approaching rho-squared correlation
- Sequential testing with O'Brien-Fleming boundaries

### Chapter 6: The City Restored
**Continuous Monitoring & Guardrails**
- Closed feedback loop: Detect, Diagnose, Retrain, Revalidate, Redeploy
- Dual-metric correlation tracking PSI against RMSE
- Automated guardrails with threshold-based triggers

## Industry Case Studies

Learn from real implementations at leading tech companies:

- **Uber Michelangelo**: Nightly feature monitoring, residual analysis, auto-drain on drift
- **Airbnb Experimentation**: CUPED achieving ~40% sample reduction, guardrail blocking
- **Netflix XP**: Thousands of concurrent A/B tests daily, auto-checks for SRM and power
- **DoorDash Feature Store**: Streaming feature store with 7-day moving PSI average

## What Makes This Project Distinctive

- **Narrative Cohesion**: Unlike fragmented tutorials, DriftCity weaves statistical concepts into a consistent story
- **Hands-On Interactivity**: Sliders, comparisons, and live simulations let learners explore concepts
- **Production-Grade Examples**: Code snippets from real-world ML platforms at scale
- **Accessibility**: WCAG AA compliance and visual metaphors make MLOps accessible to non-statisticians

Visit the full platform to start learning MLOps statistics through the DriftCity story.
