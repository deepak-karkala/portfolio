---
title: "Teaching an Open-Source LLM to Write The Office"
summary: "Fine-tuning a reasoning-first LLM to generate sitcom screenplays with on-brand humor, character voice, and multi-step setups."
image: "/products/ai-scriptwriter/cover.jpeg"
category: "AI/ML Product"
techStack: ["RFT: GRPO", "CoT Reasoning for screenplay", "LLM-as-Judge"]
date: "2024-12-01"
---

# Teaching an Open-Source LLM to Write *The Office*

**Fine-tuning a reasoning-first LLM to generate sitcom screenplays with on-brand humor, character voice, and multi-step setups.**

---

## TL;DR

I fine-tuned an open-source LLM to write new scenes of *The Office* using a **custom reasoning-chain dataset** and a **two-stage training pipeline**:

1. **Supervised Fine-Tuning (SFT)** on my own “reasoning + screenplay” pairs.
2. **Reinforcement Fine-Tuning (RFT)** using an LLM-as-judge reward model optimized for *The Office* style.

On an evaluation set of unseen prompts:

* Score distributions shift **strongly to the right** after SFT and stay higher than the base model after RFT.
* RFT training steadily improves rewards over time, showing that the policy learns to optimize the judge’s preferences.
* Qualitative “hero” examples show clearer character voices, more on-brand humor, and better multi-step comedic payoffs compared to the base model. 

---

## Why This Project?

Most LLM demos focus on generic chat or coding. I wanted to show something different:

* **A very specific domain**: a single sitcom (*The Office*) with strong, recognizable character voices.
* **A reasoning-heavy format**: each sample includes both a **planning / reasoning trace** and the **final screenplay**.
* **A production-style pipeline**: data curation, SFT, RFT, automated evaluation, and visualization.

This case study doubles as:

* A **product demo**: “What if you could auto-generate new *The Office* episodes?”
* A **skills demo**: end-to-end fine-tuning of open-source LLMs for a narrow, stylistic generation task.

---

## System Overview

**Goal:** Given a high-level sitcom situation (e.g., *"Michael uses Pam's post-its to avoid work calls"*), generate:

1. A **reasoning trace** that plans beats, character goals, and comedic engines.
2. A full **screenplay scene** consistent with *The Office* tone.

### Reasoning Trace Structure

The training dataset uses a structured reasoning-first approach where each sample includes a comprehensive creative blueprint before the screenplay. The reasoning trace contains:

1. **Storyline Goal**: Defines the narrative purpose, core conflict, and comedic goal of the scene.
2. **Character Objectives**: For each primary character, states their immediate want or need within the specific situation.
3. **Character Dynamics**: Describes key interpersonal conflicts and alliances (who clashes, who teams up).
4. **Meta Reasoning (Writer's Room Approach)**: Explains the comedic strategy—why this situation is funny in *The Office*.
5. **Primary Comedy Engine**: Explicitly names the main comedic drivers (Cringe, Dramatic Irony, Character-Based Absurdity, Understatement, Escalation).
6. **Beat Sheet (Scene Progression)**: Maps out the scene beat by beat:
   * Inciting Incident
   * Rising Action (2-3 key moments)
   * Midpoint
   * Climax
   * Resolution
7. **Talking Head Strategies**: How specific characters use talking heads for comedic value (reveal hypocrisy, state true feelings, deadpan disbelief).
8. **Comedy Tropes Applied**: Lists specific comedic devices used in dialogue or action.

This structured approach teaches the model to think like an Emmy-winning TV writer before generating the final screenplay, ensuring character consistency, proper comedic setup-payoff structure, and authentic *The Office* voice.

**Models compared**

* **Base Model: Gemma-3 1B**: original open-source LLM (no domain fine-tuning).
* **SFT: CoT Reasoning**: supervised fine-tune on my reasoning-trace + screenplay dataset.
* **RFT: Model Grader**: reinforcement fine-tune on top of SFT using LLM-as-judge rewards.

---

## Training & Reward Dynamics

### Reinforcement Fine-Tuning Rewards

> *How quickly does the policy learn to please the sitcom-style judge?*

**Plot:** `training_curves_rft_reward.png`
*(step-wise rewards in light red, 20-step rolling average in bold red)*

* Early steps show **high variance and lower average rewards**.
* The **rolling average climbs steadily** as the policy learns, then plateaus as it reaches a stable style that the judge prefers.
* Occasional dips reflect **exploration and noisy judge scores**, but the overall trajectory trends upward.

You can think of this as the model gradually learning:

* “Don’t just be coherent—be *character-consistent, witty, and structurally Office-like*.”

---

## Quantitative Evaluation

I evaluated all three models on a held-out set of sitcom prompts, scoring each output with a domain-tuned **LLM-as-judge** (0–1 scale, normalized).

### LLM-as-Judge Evaluation Criteria

The judge evaluates each generated screenplay using **eight weighted metrics** that capture both technical quality and stylistic authenticity:

| Metric | Weight | Focus |
|--------|--------|-------|
| **Character Consistency** | 25% | Does dialogue perfectly align with each character's established persona and objectives? (1.0 = pitch-perfect voice, 0.0 = no character voice) |
| **Humor Quality & Specificity** | 25% | Is the humor effective and consistent with *The Office*'s comedic DNA? (1.0 = perfect cringe/irony/character humor, 0.0 = actively unfunny) |
| **Narrative Coherence & Pacing** | 15% | Does the screenplay follow a logical comedic progression based on the reasoning trace? |
| **Style Fidelity (Mockumentary Format)** | 15% | Authentic use of mockumentary techniques (talking heads, camera glances, awkward pauses)? |
| **Dialogue Plausibility & Flow** | 5% | Does dialogue sound natural and conversational while being witty? |
| **Creative Plausibility** | 5% | Fresh ideas that still fit within the show's reality? |
| **Formatting Accuracy** | 5% | Strict adherence to `<reasoning>...</reasoning><screenplay>...</screenplay>` structure? |
| **Relevance to Storyline** | 5% | Does the screenplay meaningfully reflect the provided scenario? |

The final score is a weighted average of these eight metrics, with the highest weights on **Character Consistency** and **Humor Quality**—the two elements that define *The Office*'s unique voice. The judge is also equipped with *The Office* Story-World Bible, ensuring evaluations are grounded in the show's established characters, dynamics, and comedic DNA.

### Score Distribution by Model

**Plot:** `scores_hist.png`

* The **Base Model** is concentrated at lower scores, with most samples clustered toward the left.
* **SFT Model** shifts the distribution right: more samples in the mid-to-high range.
* **RFT Model** also lives in the higher band, trading a bit of spread for more consistently good outputs.

Visually, you can see the **“cloud” of scores moving to the right** as training progresses from Base → SFT → RFT.

### Boxplot Comparison

**Plot:** `scores_boxplot.png`

* **Median score** jumps significantly from Base → SFT.
* **RFT** retains a higher median than the base model, and its interquartile range sits above most of the Base distribution.
* Outliers reveal that:

  * Base occasionally gets lucky with a good scene.
  * SFT and RFT more **reliably** hit decent quality, with fewer catastrophic failures.

Together, these plots show that **fine-tuning doesn’t just help a few cherry-picked cases—it shifts the overall quality level up.**

---

## Qualitative “Hero” Examples

Numbers are great, but sitcoms live or die on **voice, timing, and setup–payoff**.
Below are three “hero” examples where you can see clear, progressive improvement from Base → SFT → RFT. (On the site, I present these as interactive side-by-side viewers.)

### 1. Michael Fakes Productivity with Pam’s Post-its

**Scenario**

> Michael uses Pam’s Post-It notes to avoid work calls and appear busy in his office.
> Characters: Michael, Pam, Oscar, Kevin, Ryan, Jan. 

**Judge scores**

* Base: **0.188**
* SFT: **0.465**
* RFT: **0.665**

**Base model**

* Spends a lot of time in **meta reasoning mode** (“here is the goal, here are the beats”) rather than just *being* the show.
* Dialogue feels generic; characters speak like a writer explaining them, not like themselves.

**SFT model**

* Shifts into a real scene: Michael building a “Post-It Productivity 2.0” system to dodge calls.
* Pam’s deadpan, Oscar’s dry comments, and Kevin’s confusion all start to sound recognizably in-character.
* The comedic engine is clear: Michael’s **avoidance** vs. everyone else’s **exasperation**.

**RFT model**

* Doubles down on **visual gags** (a chaotic wall of contradictory notes like “Call Jan?” vs. “Don’t call Jan”).
* Sharper, more Office-like beats:

  * Pam calls it a “paper-based anxiety maze.”
  * Oscar describes Michael as “being gently attacked by his own responsibilities.”
  * The scene ends with Pam forcing Michael to actually answer the phone, plus a perfect talking-head button.
* Overall, RFT captures **Michael’s delusional productivity, Pam’s weary competence, and Oscar’s grounded realism** in a way the judge (and a human) can recognize.

---

### 2. Dwight’s Rescue Crash and Hospital Chaos

**Scenario**

> Dwight rushes to “rescue” Michael, crashes into a pole, and ends up more injured than Michael, leading to hospital chaos. 

**Judge scores**

* Base: **0.205**
* SFT: **0.498**
* RFT: **0.760**

**Base model**

* Mixes long prose “reasoning trace” with dialogue; pacing is slower.
* The comedic idea is there, but execution feels like **writer notes** rather than a tight scene.

**SFT model**

* Clean structure: parking-lot “Code Red” → Dwight’s crash → hospital → CT scan.
* Adds nice character beats:

  * Pam: “I think the curb is okay.”
  * Jim: “Michael called for help and created *two* injuries.”
* The Doctor and Lab Tech play straight-man roles, but the jokes are still fairly safe.

**RFT model**

* Tightens **escalation and callback structure**:

  * Michael describing the curb as “nature’s speed bump.”
  * Jim’s confessional about Michael calling Dwight before 911.
  * Dwight treating the pole impact as a heroic act that must be documented in his “permanent record.”
* Great small lines in character:

  * Jim: “He thinks bones are like Legos.”
  * Pam worrying more about “the guy who used his face as an airbag.”
  * Pam’s final “Maybe we can get him a helmet.” / “For Michael or Dwight?” / “Yes.”
* This scene shows how RFT improves **multi-step reasoning**: the model learns to set up running gags and resolve them with satisfying punchlines.

---

### 3. Office vs Warehouse Lunchtime Basketball Game

**Scenario**

> Michael organizes a lunchtime basketball game against the warehouse crew to prove the office’s superiority. The game escalates, and Michael twists the outcome to declare victory. 

**Judge scores**

* Base: **0.243**
* SFT: **0.498**
* RFT: **0.688**

**Base model**

* Again, leans heavily on explanation and planning.
* The core idea (Michael using the game as a metaphor for business domination) is clear, but the scene reads like a pitch deck.

**SFT model**

* Delivers a solid game:

  * Angela as a clueless ref.
  * Darryl’s calm dominance.
  * A chaotic final shot that accidentally wins the game for the office (in Michael’s mind).
* Michael reframes defeat as “story victory,” which already feels pretty in-character.

**RFT model**

* Sharper, more character-specific details:

  * Stanley: “No.” as his entire response to being included.
  * Pam: “Michael says it’s ‘team-building.’ Historically, that’s meant property damage.”
  * Kevin jogging once, then parking under the hoop “in case.”
* The final sequence nails *The Office* tone:

  * Warehouse is up by ~20, but Michael declares “next shot wins” because “that’s how stories work.”
  * The accidental miracle shot bounces off multiple people before dropping in.
  * Darryl’s confessional labels it a “narrative win,” while the scoreboard quietly contradicts Michael.
* This example highlights improvements in **dialogue naturalness, payoff quality, and ensemble comedy**.

---

## Model & Training Spec Sheet (Placeholders)

You can turn this into a visually rich “model card” or info panel on the page. Here’s a text version you can later fill in with your exact details.

### Model & Data

* **Base model:** [Gemma3 1B: google/gemma-3-1b-it](https://huggingface.co/google/gemma-3-1b-it)
* **Task:** sitcom reasoning + screenplay generation for *The Office*
* **Training dataset:**
  * [deepakkarkala/sitcom_storylines_reasoning](https://huggingface.co/datasets/deepakkarkala/sitcom_storylines_reasoning/tree/main/data)
  * `# of scenes: 500`
  * Custom **reasoning-chain format**: `{reasoning_trace, screenplay}`.
    1. **Storyline Goal**: Defines the narrative purpose, core conflict, and comedic goal of the scene.
    2. **Character Objectives**: For each primary character, states their immediate want or need within the specific situation.
    3. **Character Dynamics**: Describes key interpersonal conflicts and alliances (who clashes, who teams up).
    4. **Meta Reasoning (Writer's Room Approach)**: Explains the comedic strategy—why this situation is funny in *The Office*.
    5. **Primary Comedy Engine**: Explicitly names the main comedic drivers (Cringe, Dramatic Irony, Character-Based Absurdity, Understatement, Escalation).
    6. **Beat Sheet (Scene Progression)**: Maps out the scene beat by beat:
      * Inciting Incident
      * Rising Action (2-3 key moments)
      * Midpoint
      * Climax
      * Resolution
    7. **Talking Head Strategies**: How specific characters use talking heads for comedic value (reveal hypocrisy, state true feelings, deadpan disbelief).
    8. **Comedy Tropes Applied**: Lists specific comedic devices used in dialogue or action.

* **Evaluation set:** `# of held-out prompts: 100`, manually curated situations.

### Training Setup

* **SFT (Supervised Fine-Tuning):**

  * **Training epochs:** 3
  * **Total steps:** 48
  * **Batch size:** 8
  * **Learning rate:** 5e-05 (max), with linear decay to 1.16e-06
  * **Optimizer:** AdamW (default HuggingFace Trainer)
  * **Evaluation strategy:** Every 5 steps
  * **Best checkpoint:** Step 45 (eval loss: 2.311)
  * **Fine-tuning method:** LoRA (Low-Rank Adaptation) (r=128, alpha=128)
  * **Training loss progression:** 2.558 → 2.161 (final)
  * **Eval loss progression:** 2.478 → 2.311 (best)
  * SFT Trained Model: [deepakkarkala/gemma3-1b-sft-sitcom-office-reasoning](https://huggingface.co/deepakkarkala/gemma3-1b-sft-sitcom-office-reasoning)

* **RFT (Reinforcement Fine-Tuning with PPO):**

  * **Reward model:** LLM-as-judge (OpenAI GPT-5) specialized for *The Office* style with 8 weighted evaluation metrics
  * **Training steps:** 130 (of 249 max)
  * **Batch size:** 4
  * **Learning rate:** Peak at 3.8e-06, decaying to 2.78e-06
  * **KL divergence:** Maintained between 0.15-0.46 (controls policy drift from SFT model)
  * **Reward progression:** 0.419 (initial) → 0.523 (step 130)
  * **Mean completion length:** 182-878 tokens per generation
  * **Gradient clipping:** Applied (max grad norm ~88.8 early, stabilizing to ~0.3)
  * **Total tokens processed:** ~2.88M tokens
  * RFT Trained Model: [deepakkarkala/gemma3-1b-rft-sitcom-office-reasoning](https://huggingface.co/deepakkarkala/gemma3-1b-rft-sitcom-office-reasoning)

### Infrastructure

* **Hardware:**
  - 1 x A40 [48 GB VRAM]
* **Frameworks:**
  - [TRL - Transformer Reinforcement Learning](https://huggingface.co/docs/trl/en/index)
  - [Unsloth](https://docs.unsloth.ai/)
<!--* **Orchestration:** `TODO (Weights & Biases, custom scripts, …)`
* **Serving / demo stack:** `TODO (FastAPI, Streamlit, Next.js, etc.)`-->

You can render this as a responsive card grid or a “tech spec sidebar” similar to the OpenAI blog product cards.

---

## Learnings

This project touches most parts of the modern LLM lifecycle:

1. **Problem framing**

   * Turn a fuzzy idea (*“Office-style scenes”*) into a concrete objective with measurable rewards.

2. **Custom data design**

   * Design a **reasoning + screenplay** schema.
   * Build prompts and reference scripts to teach the model structure and style.

3. **Supervised & reinforcement fine-tuning**

   * Run SFT to anchor the model in domain behavior.
   * Layer RFT on top to align with a style-aware judge.

4. **Evaluation & visualization**

   * Implement **LLM-as-judge scoring**.
   * Visualize distributions (boxplots, histograms) and **training reward curves**.
   * Curate **hero examples** that connect metrics to human-perceived quality.

5. **Storytelling & product thinking**

   * Package the work as a **case study** that looks like a product launch:

     * Clear problem definition.
     * Before/after comparisons.
     * Visuals that non-experts can understand.

---

## Next Steps & Extensions

Things I’d like to explore next:

* **Character-controlled generation**
  Conditioning on specific characters or A/B/C plot labels to generate multi-threaded episodes.

* **Agentic script-writer tools**
  A small web app where writers can:

  * Provide a situation.
  * Edit the reasoning trace.
  * Regenerate the screenplay with stronger constraints.

* **Human-in-the-loop feedback**
  Collect ratings from fans of *The Office* and combine them with the LLM judge to refine the reward model.

---

<!--
If you’d like to see this in action, the portfolio version of this page includes:

* Interactive comparisons for each hero example.
* Hoverable plots for score distributions and rewards.
* A playground to generate new *The Office* scenes with the fine-tuned model.
-->