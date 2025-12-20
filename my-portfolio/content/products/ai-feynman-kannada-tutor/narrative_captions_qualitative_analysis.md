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

