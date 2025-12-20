---
title: 'Building a Kannada Physics Tutor LLM'
summary: 'Multi-stage fine-tuning pipeline creating a Feynman-style physics tutor in Kannada, combining SFT and RAG for intuitive, grounded explanations'
date: '2024-11-27'
category: 'AI/ML Product'
status: 'Complete'
techStack: ['CoT Reasoning for Feynman explanations', 'RAG', 'LLM-as-Judge']
image: '/products/ai-feynman-kannada-tutor/cover.jpeg'
---

# Building a Kannada Physics Tutor LLM with Feynman-Style Explanations

## Overview

In this project, I built a domain-specialized Large Language Model that answers physics questions in **Kannada** in the style of **Dr. Richard Feynman**—simple, intuitive, and concept-first. The goal was to simulate a friendly physics tutor that explains *why* something is true, not just *what* the formula is.

I designed a multi-stage fine-tuning pipeline on top of an open-source base model, created a custom reasoning-focused dataset, and evaluated multiple model variants using **LLM-as-a-judge**. The final system combines **fine-tuning + RAG (Retrieval-Augmented Generation)** and demonstrates clear, measurable gains over the base model in both correctness and explanation quality.

## Problem

Most general-purpose LLMs:

* Struggle with **conceptual explanations in physics**, especially in non-English languages.
* Answer in a **formal, textbook-like tone** rather than an intuitive, conversational style.
* Lack grounding in **chapter-specific context**, leading to hallucinated or shallow answers.

I wanted to build a model that:

1. **Thinks in Kannada** (not just translating from English).
2. Explains physics like **Feynman**: with analogies, step-by-step reasoning, and focus on intuition.
3. Uses **relevant context** from a physics knowledge base when answering questions.

## Approach

I used a **four-model progression**:

1. **Base Model**
   * Open-source LLM (Gemma 3 1B) with no domain specialization.
   * Provides a baseline for Kannada fluency and physics understanding.

2. **SFT – General Kannada**
   * Supervised Fine-Tuning (SFT) on a curated **general Kannada text corpus**.
   * Goal: improve fluency, style, and comfort in Kannada across topics.

3. **SFT – Physics in Kannada**
   * Second-stage SFT on a **custom physics dataset**: question + chain-of-thought + Feynman-style explanation, all in Kannada.
   * Goal: strengthen conceptual reasoning, derivations, and intuitive storytelling in physics.

4. **Physics + RAG**
   * Same fine-tuned model, but augmented with **Retrieval-Augmented Generation**.
   * For each user query, I retrieve relevant physics content (in Kannada) and pass it as context, guiding the model away from hallucinations and towards grounded, chapter-specific answers.

The training pipeline was implemented using the Hugging Face ecosystem, running on GPU, with careful control over learning rate, batch size, and sequence lengths to avoid overfitting while still specializing the model.

## Evaluation: LLM-as-a-Judge

To evaluate the model quality quantitatively, I used an **LLM-as-a-judge** setup with a structured grading prompt in Kannada and English. For each question in my evaluation set, I collected:

* The outputs from each of the four models
* A **reference explanation** (ground truth).
* A **grader LLM** that scored each answer on a 0–5 scale, considering:
  * Physics correctness & conceptual accuracy
  * Quality and clarity of reasoning
  * Kannada fluency and naturalness
  * Relevance and avoidance of hallucination

All scores were stored in a CSV and visualized using histograms and boxplots.

## Results

The quantitative evaluation shows clear progressive improvement:

1. **Base Model**: Very low scores (0–0.5), poor physics understanding and Kannada fluency
2. **Kannada SFT**: Improved language quality, but still weak on physics (scores ~0.5–1)
3. **Physics SFT**: Dramatic improvement in reasoning (scores ~2–2.5)
4. **Physics + RAG**: Highest scores (3.5–4), with factual grounding preventing hallucinations

The score distributions and boxplots demonstrate that each stage adds measurable value, and the final RAG-enhanced model achieves reliable, high-quality explanations across diverse physics questions.

## What I Learned

* How to design and fine-tune an LLM for a **low-resource language** + **specialized domain**.
* How multi-stage SFT, carefully designed datasets, and RAG can **compound** improvements.
* How to build a **complete evaluation story**: from loss curves to distributions, win rates, and human-interpretable summaries.
* How to present these results in a way that is accessible both to **engineers** and **non-technical stakeholders**.
