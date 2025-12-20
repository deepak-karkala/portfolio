## 1. Full Case Study Page

Feel free to tweak names, numbers, and model details to match your exact setup.

---

### **Title**

**Building a Kannada Physics Tutor LLM with Feynman-Style Explanations**

---

### **Overview**

In this project, I built a domain-specialized Large Language Model that answers physics questions in **Kannada** in the style of **Dr. Richard Feynman**—simple, intuitive, and concept-first. The goal was to simulate a friendly physics tutor that explains *why* something is true, not just *what* the formula is.

I designed a multi-stage fine-tuning pipeline on top of an open-source base model, created a custom reasoning-focused dataset, and evaluated multiple model variants using **LLM-as-a-judge**. The final system combines **fine-tuning + RAG (Retrieval-Augmented Generation)** and demonstrates clear, measurable gains over the base model in both correctness and explanation quality.

---

### **Problem**

Most general-purpose LLMs:

* Struggle with **conceptual explanations in physics**, especially in non-English languages.
* Answer in a **formal, textbook-like tone** rather than an intuitive, conversational style.
* Lack grounding in **chapter-specific context**, leading to hallucinated or shallow answers.

I wanted to build a model that:

1. **Thinks in Kannada** (not just translating from English).
2. Explains physics like **Feynman**: with analogies, step-by-step reasoning, and focus on intuition.
3. Uses **relevant context** from a physics knowledge base when answering questions.

---

### **Approach**

I used a **four-model progression**:

1. **Base Model**

   * Open-source LLM (e.g., Gemma 3 1B) with no domain specialization.
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

---

### **Data & Fine-Tuning Setup (Model and Infra Card/Spec-Sheet)**

* **Base model:** [Gemma3 1B: google/gemma-3-1b-it](https://huggingface.co/google/gemma-3-1b-it)
* **Training data:**

  * **General Kannada SFT:** diverse non-technical corpus (news, essays, conversations).
  * **Physics SFT:** custom-built dataset of physics problems, reasoning traces, and explanations in Kannada, styled after Feynman.
* **Hardware:** Single/multi-GPU setup (e.g., A40), optimized for low VRAM footprint using parameter-efficient fine-tuning where needed.
* **Training monitoring:** I logged **training + eval loss** via Hugging Face `trainer_state.json` and visualized the curves to track convergence and overfitting.

The **training & evaluation loss curves** clearly show:

* Stable optimization across epochs.
* Additional improvement in evaluation loss after moving from general Kannada to physics-specific SFT.
* A healthy gap between training and eval loss, indicating good generalization without severe overfitting.

These curves are plotted in an interactive dashboard section (“Training Dynamics”), where you can toggle which fine-tuning stage to display.


Dedicate a visual card to **fine-tuning details**:

* Base model: e.g., [Gemma3 1B: google/gemma-3-1b-it](https://huggingface.co/google/gemma-3-1b-it)
* Training set:

  * #episodes / scenes / tokens.
  * How you built the reasoning CoT traces.
  * Reasoning Trace Structure
    1. **Identify Core Idea**: State the simplest underlying principle of the concept.
    2. **First Principles Reasoning**: Break down the idea into its most basic elements, avoiding jargon at first.
    3. **Analogies & Everyday Examples**: Relate the concept to familiar, tangible experiences (blocks, balls, cars, children’s games, water, etc.).
    4. **Curiosity Hooks**: Ask a playful or intriguing question that sparks further interest (\"Why should nature behave this way?\", \"Isn’t it strange that…?\").
    5. **Progressive Depth**: Gradually increase rigor — from intuition → simple mathematics → more abstract reasoning — always showing why each step matters.
    6. **Cross-Connections**: Show how this idea connects to other areas of physics or science.
    7. **Humility & Limits**: Acknowledge approximations, open questions, or where the laws might break down.
    8. **Engagement & Clarity**: Keep the tone conversational, clear, and inspiring — as if talking to bright but curious students.




* GPUs: 1 x A40 (48 GB VRAM)
* Training params:

  * LR, batch size, #epochs, warmup, PPO/RFT hyperparams (KL coef, steps, etc.).
* High-level pipeline (diagram) showing:

  * Dataset → SFT → RFT → Evaluation (LLM-as-judge).

Even if that’s not code, these plots + a neat spec sheet scream “I know what I’m doing with open-source LLM fine-tuning”.




---

### **Evaluation: LLM-as-a-Judge**

To evaluate the model quality quantitatively, I used an **LLM-as-a-judge** setup with a structured grading prompt in Kannada and English. For each question in my evaluation set, I collected:

* The outputs from each of the four models:

  * Base
  * General Kannada SFT
  * Physics Kannada SFT
  * Physics + RAG
* A **reference explanation** (ground truth).
* A **grader LLM** that scored each answer on a 0–5 scale, considering:

  * Physics correctness & conceptual accuracy
  * Quality and clarity of reasoning
  * Kannada fluency and naturalness
  * Relevance and avoidance of hallucination
  * Adherence to an output format separating `<reasoning>` and `<explanation>`

All scores were stored in a CSV (`phy_kan_scores.csv`) with one row per question and one column per model.

---

### **Results**

#### **1. Training & Eval Loss Curves**

Using the data in `trainer_state.json`, I plotted **training and evaluation loss over epochs** for both SFT stages. The curves show that:

* The **General Kannada SFT** reduces loss and stabilizes quickly, giving the model a strong linguistic foundation.
* The **Physics SFT** stage continues the downward trend in eval loss, indicating that physics-specific fine-tuning improves generalization on the physics benchmark rather than overfitting.

On the dashboard, you can interactively:

* Toggle between models.
* View training and eval loss side-by-side.
* Inspect how each stage contributes to convergence.

This highlights my capability in **monitoring, debugging, and interpreting fine-tuning runs**.

---

#### **2. Score Distributions: Overlaid Histograms**

I visualized the distribution of LLM-as-judge scores for all models using **overlaid histograms** on a common 0–5 axis.

The pattern is clear:

* The **Base Model** has a wide spread with a big mass around mid-range scores.
* The **General Kannada SFT** shifts the distribution right, with more answers in the “good” range, reflecting better fluency and coherence.
* The **Physics SFT** pushes the distribution further into the high-score region, reflecting stronger reasoning and physics correctness.
* The **RAG-enhanced model** exhibits the most right-shifted distribution, indicating that grounding answers in retrieved physics context significantly improves quality and consistency.

This visualization makes the impact of each engineering decision immediately visible.

---

#### **3. Model Comparison: Boxplots**

To show separation and overlap across models, I used **boxplots** of scores per model:

* Each boxplot summarizes median, quartiles, and outliers for the LLM-as-judge scores.
* The **median score** steadily increases from Base → General SFT → Physics SFT → RAG.
* The **interquartile range** narrows for the Physics SFT and RAG models, indicating more consistent performance.
* Low-score outliers become rarer in the fine-tuned + RAG models.

This is a concise way to demonstrate that the improved models are not only *occasionally* better but **reliably** better across a wide range of questions.

---

### **4. Qualitative “hero” examples**

For the website, alongside the quantitative plots, show:

* 1–3 **side-by-side** comparisons:

  * Prompt
  * Base model screenplay snippet
  * SFT screenplay
  * RFT screenplay
  * Judge scores for each
* Highlight things like:

  * Better character voice consistency.
  * More on-brand humor.
  * Better multi-step reasoning / setup–payoff in scenes.

Even one or two of these, with the numbers from the CSV, will make the improvement very tangible.


This combination of **quantitative evaluation + qualitative examples** gives a complete picture of the system as a product, not just a research experiment.


## 1. Good qualitative examples to showcase

From your `model_outputs_comparison.csv` + `phy_kan_scores.csv`, I looked for cases where:

* Scores improve roughly monotonically: `MODEL_A ≤ MODEL_B ≤ MODEL_C ≤ MODEL_D`
* Final model (RAG) has a strong score (≥ ~2.5)
* Big jump from Base → RAG (`MODEL_D – MODEL_A` large)

Three especially nice ones:

1. **ID 88**
   **Question:**
   `ಅತಿ ಸೂಕ್ಷ್ಮ ಚದರದ ಸುತ್ತಾಟ ಮತ್ತು ವೆಕ್ಟರ್ ಕ್ಷೇತ್ರದ curl ನಡುವೆ ಇರುವ ಸಂಬಂಧವೇನು?`
   **Scores:**

   * Base (A): 0.05
   * Kannada SFT (B): 0.06
   * Physics SFT (C): 2.21
   * Physics + RAG (D): 3.90

2. **ID 10**
   **Question:**
   `ಹರಿವಿನ ದಿಕ್ಕಿಗೆ ಕೋನ ಹೊಂದಿದ್ದ ಮೇಲ್ಮಟ್ಟದ ಮೂಲಕ ತಾಪ ಹರಿವು ಹೇಗೆ ಗಣಿಸಬಹುದು?`
   **Scores:**

   * Base (A): 0.31
   * Kannada SFT (B): 0.82
   * Physics SFT (C): 2.34
   * Physics + RAG (D): 3.88

3. **ID 6**
   **Question:**
   `ಒಂದು ಸಮಾನ ಟೆನ್ಶನ್ ಮೆಂಬ್ರೇನ್‌ಕ್ಕೆ ಲಾಪ್ಲಾಸಿನ ಸಮವಾಕ್ಯವನ್ನು ಹೇಗೆ ತರುತ್ತದೆ?`
   **Scores:**

   * Base (A): 0.06
   * Kannada SFT (B): 0.06
   * Physics SFT (C): 2.44
   * Physics + RAG (D): 3.47

These are great “hero” examples where:

* Base/SFT outputs are noisy / partly off-language / partially wrong.
* Physics SFT + RAG are clearly more structured, in proper Kannada, and closer to the reference.



---

# ✅ **Hero Example 1 (ID 88)**

**Question:** *“What is the relationship between rotation of an infinitesimal area element and the curl of a vector field?”*
**Scores:** Base 0.05 → Kannada SFT 0.06 → Physics SFT 2.21 → RAG 3.90

### **Narrative Caption**

This example clearly illustrates how the model becomes progressively more “physics-aware” through each fine-tuning stage.

The **base model** largely fails to understand the question and produces text that is vague and only partly in Kannada.

After **general Kannada SFT**, the model becomes much more fluent, but it still lacks the domain knowledge needed to explain curl or area-element rotation. That’s expected—general SFT teaches *language*, not *physics*.

The breakthrough comes with **Physics SFT**, where the model is fine-tuned on a curated dataset of physics reasoning and Feynman-style explanations. Here, the model finally explains curl as a measure of rotational tendency—a core conceptual idea. The answer becomes structured, relevant, and intuitively meaningful.

The **RAG-enhanced model** then adds authoritative factual grounding by retrieving the correct physics context before answering. The result is a clean, mathematically correct, intuitive explanation fully in Kannada—exactly what a human physics tutor would say.

This example demonstrates how **SFT improves fluency and reasoning patterns**, while **RAG ensures factual precision**, and the combination yields near-expert explanations.

---

# ✅ **Hero Example 2 (ID 10)**

**Question:** *“How do we compute heat flow through a surface that makes an angle with the direction of heat flow?”*
**Scores:** Base 0.31 → Kannada SFT 0.82 → Physics SFT 2.34 → RAG 3.88

### **Narrative Caption**

This question requires understanding of heat flux, surface orientation, and the projection of area onto the flow direction.

The **base model** gives a partially relevant but structurally weak answer—it lacks domain concepts such as the cosine factor or flux definition.

With **general Kannada SFT**, the language becomes cleaner, but domain accuracy remains inconsistent. SFT trains the model on broad Kannada text, so it learns how to express ideas well, but not necessarily the right ideas.

The turning point is the **Physics SFT stage**. Because the model has been trained with step-by-step reasoning and worked examples in Kannada physics text, it begins invoking correct principles: area projection, directional flow, and energy transport.

Finally, the **RAG version** retrieves precise definitions and formulas related to heat flux and angled surfaces. This yields an accurate explanation referencing the dot product between heat flux and area vector—something only seen when the model has access to true contextual grounding.

This example shows how combining **linguistic SFT + domain SFT + retrieval grounding** results in explanations that are both correct and elegantly expressed.

---

# ✅ **Hero Example 3 (ID 6)**

**Question:** *“How do we derive Laplace’s equation for a membrane under uniform tension?”*
**Scores:** Base 0.06 → Kannada SFT 0.06 → Physics SFT 2.44 → RAG 3.47

### **Narrative Caption**

This is a challenging derivation involving force balance, curvature, and the relationship between tension and displacement—a perfect test of deep conceptual reasoning.

The **base model** and **general Kannada SFT** version both struggle because this question cannot be answered through language fluency alone—it requires mathematical intuition.

Once the model undergoes **Physics SFT**, it starts behaving like a real physics student:

* It sets up the differential force balance,
* Recognizes how tension produces restoring forces,
* Shows how equilibrium leads to ∇²u = 0.

These patterns emerge because SFT trains the model on *chains of thought* and *step-by-step reasoning traces*, teaching it how physicists derive equations.

The **RAG-enhanced model** goes even further by pulling in canonical descriptions of membrane tension and harmonic surfaces. This helps it provide a clean Kannada explanation of *why* Laplace’s equation arises—not just stating the formula.

This example highlights how **reasoning-focused SFT teaches structure**, and **RAG ensures correctness**, producing a model that can articulate advanced mathematical physics in a natural, intuitive way.

---













---


### **Tech Stack**

* **Model & Training:** Hugging Face Transformers, PyTorch
* **Fine-Tuning:** Multi-stage SFT on custom Kannada physics data
* **Evaluation:** LLM-as-judge scoring pipeline, CSV-based analytics
* **Visualization:** Matplotlib / Seaborn / Plotly, Streamlit dashboard
* **RAG:** Vector store + context retrieval integrated into generation

---

### **What I Learned**

* How to design and fine-tune an LLM for a **low-resource language** + **specialized domain**.
* How multi-stage SFT, carefully designed datasets, and RAG can **compound** improvements.
* How to build a **complete evaluation story**: from loss curves to distributions, win rates, and human-interpretable summaries.
* How to present these results in a way that is accessible both to **engineers** and **non-technical stakeholders**.

---
