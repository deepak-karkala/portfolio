# Rubric: Trajectory Quality (0–4)

Score **the path** taken, not just the outcome.

- **4**: Efficient, logical steps; correct tools; minimal retries; no loops.
- **3**: Mostly good; minor inefficiencies or extra steps.
- **2**: Some correct steps but includes detours, redundant tool calls, avoidable retries.
- **1**: Poor planning; frequent wrong tools; repeated mistakes; near-looping.
- **0**: Loops, deadlocks, or unsafe/unbounded behavior.

## Signals to check
- Unnecessary tool calls
- Router-bouncing
- Retry-without-learning
- Ignoring constraints/budgets
