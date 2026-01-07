---
title: 'Chapter 7.3: Training Deep Learning Models'
summary: 'Train production-grade deep learning models with instrumentation and debugging'
date: '2024-12-27'
order: 7.3
excerpt: 'Paranoia + instrumentation + iteration'
---

## How to Train Deep Learning Models (Production-Grade, Debuggable, Scalable)

### The core mental model

Deep learning training is a **leaky abstraction**: it often “runs fine” while being wrong. Winning teams train with **paranoia + instrumentation + incremental scientific iteration**.

---

# 1) Training like a scientist (not a gambler)

### The scientific loop (default workflow)

1. **Pick one scoped goal** (e.g., fix overfitting, stabilize training, speed up throughput)
2. **Run controlled experiments** (change 1 thing)
3. **Learn** (curves, slices, failures, boundaries)
4. **Decide** (keep/reject, next hypothesis)

**Heuristic:** if you change 5 things and it got better, you learned nothing.

### “Silent failure” checklist (things that train but sabotage results)

* wrong labels due to augmentation bug
* leakage (target accidentally used as input)
* loss/grad clipping applied incorrectly
* wrong LR schedule copied from another dataset
* preprocessing statistics computed on full data (train+val)

**Rule:** “No exceptions” ≠ “correct.”

---

# 2) Start every project with a trustworthy skeleton

Your goal is to build a pipeline you trust before chasing SOTA.

### Skeleton must-have steps

* fix random seeds (numpy/torch/etc.)
* disable non-essential complexity (especially augmentation)
* visualize tensors **right before** the model (`y_hat = model(x)`)
* verify initial loss sanity:

  * for softmax with `N` classes, init loss ≈ `-log(1/N)`
* establish baselines:

  * human baseline (if meaningful)
  * input-independent baseline (train on zeroed inputs)
* **overfit one batch** (or even 2 examples) to near-zero loss

**Heuristic:** if you can’t overfit a tiny batch, stop everything—your loop is broken.

---

# 3) The two-phase improvement strategy

This is the simplest high-success pattern:

## Phase 1 — Overfit (prove capacity + optimization works)

Goal: drive training loss down.

* start with a known architecture (don’t invent)
* use a safe optimizer default (Adam is forgiving)
* use constant LR initially; tune schedules later

## Phase 2 — Regularize (improve validation)

Order of reliability:

1. **more data** (best)
2. augmentation (domain-aware, verified visually)
3. pretraining (often helps even with lots of data)
4. weight decay, dropout, early stopping
5. smaller model (if severe overfit)
6. smaller batch size (adds gradient noise)

**Heuristic:** if you’re spending weeks tuning regularizers on tiny data, you’re probably solving the wrong problem—collect/label more data.

---

# 4) Hyperparameter tuning without fooling yourself

### Categorize hyperparameters per experiment

* **Scientific HPs:** what you’re testing (e.g., activation type)
* **Nuisance HPs:** must be re-tuned for fair comparisons (learning rate is the classic)
* **Fixed HPs:** held constant (and your conclusions depend on them)

### Random search > grid search

Random search finds good configs faster when only a few HPs matter a lot.

### Boundary check (fast insight)

If best trials sit at the edge of the search range → expand the range.

---

# 5) Single-GPU performance: the fast iteration playbook

### A) Mixed precision (AMP)

* use `autocast()` + `GradScaler()`
* aim to leverage Tensor Cores (shape multiples of 8 often help)

### B) Memory tactics

* gradient accumulation (simulate larger batch)
* activation/gradient checkpointing (trade compute for memory)

### C) Throughput tactics

* dataloader parallelism (`num_workers>0`)
* `pin_memory=True` for faster H2D transfers
* fuse small ops (`torch.compile`)
* use optimized attention kernels (`scaled_dot_product_attention`)

**Heuristic:** look for GPU “gaps” (idle time). That’s usually input pipeline or CPU dispatch overhead.

---

# 6) Scaling to multi-GPU: choose the simplest thing that fits

| Strategy              | What it does                                   | Use when                                     | Main cost                      |
| --------------------- | ---------------------------------------------- | -------------------------------------------- | ------------------------------ |
| **DDP**               | replicate model, split batch, all-reduce grads | model fits on 1 GPU                          | bandwidth sync, but simplest   |
| **FSDP / ZeRO**       | shard params/grads/optimizer state             | model doesn’t fit                            | comm overhead + complexity     |
| **Pipeline parallel** | split layers across GPUs                       | deep models, big layers                      | bubbles, scheduling complexity |
| **Tensor parallel**   | shard ops inside layers                        | giant transformers                           | needs fast interconnect        |
| **MoE**               | route tokens to experts                        | scaling params without scaling compute/token | routing + load balancing       |

**Default path:** DDP → FSDP (only when memory forces it) → add TP/PP only for very large transformer-scale workloads.

---

# 7) Troubleshooting map (what to do when it breaks)

### Training is unstable (loss NaNs/explodes)

* lower LR; add LR warmup
* enable gradient clipping (clip gradients, not loss)
* check normalization placement / architecture issues
* try a more stable optimizer (Adam often helps)

### Training is slow

* profile; find GPU idle gaps
* increase dataloader workers; pin memory
* reduce syncs (`tensor.item()`, frequent prints)
* use `torch.compile` / fused ops
* consider AMP

### Validation stuck while training improves

* you’re overfitting → add data/augmentation/regularization
* dataset mismatch → inspect splits, leakage, label noise
* features/labels wrong → run overfit-one-batch again + visualize

---

# 8) Profiling as a first-class habit

Use a profiler (e.g., PyTorch Profiler) to answer:

* are we compute-bound, memory-bound, or overhead-bound?
* is GPU waiting on CPU?
* which ops dominate runtime (attention, norms, data transfer)?

**Heuristic:** optimize the *biggest bar*; otherwise you’re polishing pebbles.

---

# 9) Experiment tracking: minimum viable discipline

Every run should be reproducible via:

* code commit + config file
* dataset snapshot/version
* seeds
* environment/container digest
* metrics + curves + notes

**Rule:** untracked experiments might as well not exist.

---

## “If you only remember 10 things”

1. Training is a leaky abstraction; expect silent failures.
2. Build a trustworthy skeleton before tuning.
3. Overfit one batch—always.
4. Visualize inputs right before the model.
5. Validate initial loss sanity.
6. Start from a known architecture; don’t be a hero.
7. Improve in phases: overfit → regularize.
8. Random search beats grid; LR is usually the nuisance HP.
9. Use AMP + profiling for speed; look for GPU idle gaps.
10. Scale with the simplest parallelism that fits (DDP → FSDP → TP/PP).
