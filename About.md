# Skinnova

## Inspiration

Skinnova was inspired by a simple but serious problem: **people increasingly rely on AI for skincare advice**, yet skincare guidance directly affects real human bodies. Unlike casual chatbots, incorrect or hallucinated skincare recommendations can lead to irritation, long-term skin damage, or loss of trust.

While building AI-driven skincare experiences, we realized that **traditional LLM observability treats hallucinations as a binary correctness issue**, often evaluating every prompt uniformly. This approach is expensive, noisy, and fails to answer a more important question:

> *If a hallucination occurs, how many users does it actually affect, and who are they?*

This insight led us to design Skinnova not just as an AI skincare assistant, but as a **production-grade system where AI reliability, risk, and impact are observable**.

---

## What We Built

Skinnova is an AI-powered skincare assistant that:
- Provides **personalized skincare routines**
- Explains **ingredients and formulations**
- Answers **skin concern–specific questions**
- Tailors responses using **user attributes** such as age group, skin type, and skin concern

On top of this user-facing functionality, we built a **novel LLM observability layer** focused on **selective hallucination evaluation and blast radius measurement**.

---

## How We Built It

### System Architecture

- **Google Cloud**  
  Used for LLM inference and backend infrastructure to ensure scalability and reliability.
- **Python + FastAPI**  
  Handles request orchestration, persona enrichment, and metric emission.
- **Datadog**  
  Used as the central observability platform for metrics, dashboards, alerts, and runbooks.

---

### Selective Hallucination Evaluation

Instead of evaluating hallucinations for every prompt, Skinnova introduces a **risk-based prefilter** that classifies prompts into low, medium, or high risk.

Only high-risk prompts are evaluated for hallucination. Importantly, **the decision to evaluate is itself observable**.

This allows us to track:
- How often evaluation is triggered
- Why it was triggered
- How selective evaluation reduces cost and noise

---

### Hallucination Blast Radius

Detecting a hallucination alone is not enough. We wanted to understand **real-world impact**.

We introduced the **Hallucination Blast Radius Index (HBRS)**, derived inside Datadog using observable signals:

\[
\text{HBRS}(t) =
\text{HallucinationScore}(t)
\times
\text{ChatVolume}(t)
\times
\text{PersonaRiskWeight}
\]

Where:
- Hallucination Score measures semantic deviation
- Chat Volume represents real user exposure
- Persona Risk Weight reflects sensitivity based on age group and skin concern

By emitting **atomic metrics** and deriving impact dynamically, we keep the system transparent, tunable, and production-realistic.

---

### Persona-Aware Impact Visualization

User attributes such as:
- `user.age_bucket`
- `user.skin_type`
- `user.skin_concern`

are emitted as **low-cardinality Datadog tags**.

This enables heatmaps and breakdowns that show:
- Which user personas are affected
- How hallucinations propagate across cohorts
- Why the same hallucination can be low-risk or high-risk depending on audience

---

### Closing the Loop

Skinnova integrates:
- **SLOs** on blast radius rather than raw hallucination score
- **Alerts** when impact thresholds are breached
- **Runbooks** that notify on-call engineers with contextual information

This transforms hallucination monitoring into an **actionable operational workflow**, not just a diagnostic signal.

---

## What We Learned

- **Not all hallucinations matter equally** — exposure and user context define risk
- Observability should measure **impact**, not just model behavior
- Making *evaluation decisions observable* is as important as evaluating outcomes
- Domain-aware personas dramatically improve interpretability of AI incidents
- Separating raw signals from derived metrics increases flexibility and trust

---

## Challenges We Faced

### 1. Avoiding Metric Noise  
Evaluating hallucinations everywhere creates alert fatigue. Designing a selective pipeline required careful prefiltering without missing critical cases.

### 2. Balancing Simplicity and Novelty  
We had to ensure the system was explainable to judges while still demonstrating deep SRE and AI reliability thinking.

### 3. Designing Judge-Safe Observability  
We avoided black-box scores and sensitive logic by emitting only atomic, auditable metrics and deriving insights transparently in Datadog.

### 4. Mapping AI Safety to Business Impact  
Translating hallucination scores into something operationally meaningful required rethinking traditional LLM monitoring approaches.

---

## Closing Thoughts

Skinnova demonstrates that **AI trust is not a model feature — it is an operational property**.

By combining personalized skincare assistance with selective hallucination observability and persona-weighted blast radius monitoring, Skinnova shows how AI systems can move from correctness checking to **real-world risk management**.

This approach is model-agnostic, domain-aware, and applicable to any production LLM system where reliability truly matters.
