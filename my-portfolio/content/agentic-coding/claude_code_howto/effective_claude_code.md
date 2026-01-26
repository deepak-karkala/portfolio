---
title: 'Effective Claude Code'
summary: 'Senior engineer mental models for composable primitives and team workflows'
date: '2024-01-15'
category: 'Best Practices'
---

# Claude Code: How to

---

## The senior mental model: Claude Code = a programmable teammate runtime

Stop thinking “chat in a terminal.” Think **composable primitives** you can standardize and ship across a team: **Slash Commands, Skills, Subagents, Hooks, MCP, Plugins, Headless/CI**.

### Quick decision matrix (what to use when)

* **Slash command** → repeatable prompt macro you invoke manually (fast, explicit).
* **Skill** → “always do it our way” standards/playbooks that auto-apply when relevant; supports progressive disclosure + scripts. (Better than stuffing giant prompts.)
* **Subagent** → delegate/parallelize with context isolation (reviewer/test-runner/explorer).
* **Hook** → deterministic guardrails + automation (format/lint/test gates; protect sensitive files).
* **MCP** → connect real systems (GitHub/Jira/DB/Sentry/browser automation).
* **Plugins** → package and distribute org workflows (versioned, namespaced).
* **Headless (`claude -p`)** → CI/scripts + structured output formats; tool allowlists. 

---

## Setup that pays compounding dividends

### 1) Treat `CLAUDE.md` like “repo onboarding + working agreement”

Use it to encode: build/test commands, style rules, key files, repo etiquette, known footguns. Keep it concise, iterate it like a prompt, and check it into git for team reuse.

**High leverage habit:** as you work, add “what Claude should remember” to `CLAUDE.md` and commit it so the whole team benefits.

### 2) Curate tool permissions like you would IAM

Claude Code is conservative by default; you can manage allowed tools via “Always allow”, `/permissions`, settings files, or `--allowedTools` flags.

**Senior rule:** pre-approve *safe, reversible* actions (formatters, tests, read-only commands), and keep “blast-radius” actions gated.

### 3) Use Plan Mode when the task is multi-step or ambiguous

Plan Mode is explicitly for multi-file refactors, exploration-first work, and interactive direction-setting; you can toggle modes with Shift+Tab or start with `--permission-mode plan`.

---

## “Default workflow” that works across most SDLC tasks

### The baseline loop: Explore → Plan → Code → Commit

This is the most reliable pattern (and explicitly recommended): read first, plan second, then implement, then commit/PR. Use subagents early for complex exploration to preserve context and reduce mistakes.

**Planning turbo for seniors:** explicitly prompt deeper thinking levels (`think` < `think hard` < `think harder` < `ultrathink`) when tradeoffs matter.

### The correctness loop: Write tests → commit → code → iterate → commit

TDD becomes *much* stronger when Claude can iteratively run tests and converge; be explicit that tests come first and the implementation must not “cheat” or modify tests. It often takes a few iterations—embrace the loop.

### The UI loop: Implement → screenshot → iterate

If you give Claude a way to screenshot results (e.g., via a browser automation MCP server), you get faster convergence to pixel-level targets.

---

## Prompting that senior engineers use (and why it works)

### 1) Be specific on attempt #1

Specific instructions reduce backtracking: mention target files, desired patterns, constraints, and verification steps. This is repeatedly emphasized as a major performance lever.

### 2) Always give Claude a “verifiable target”

Tests, mocks, screenshots, expected output samples, failing logs—Claude performs better when it can iteratively check itself against a target.

### 3) Course-correct aggressively (don’t let it drift)

Use: “plan before code,” Esc to interrupt, double-Esc to rewind/edit history, and “undo changes.” Also use `/clear` to reset context between tasks and keep the model focused.

---

## Composition recipes: how strong teams “put it all together”

### Recipe A: Review → Fix → Validate → Summarize (local dev)

* `/review` slash command (consistent review ask)
* Subagent `reviewer` (isolated deep review)
* Hook: PostToolUse → format/lint
* Hook: Stop → block “done” until tests pass
* Output: consistent reviews + deterministic quality gates.

### Recipe B: Guardrails-first engineering (safety + speed)

* PreToolUse hook blocks edits to sensitive paths / risky commands
* PermissionRequest hook auto-approves safe repetitive actions
* Skill encodes org standards + checklists (so you don’t rely on memory)

### Recipe C: Issue → PR automation (real tooling)

* MCP servers for GitHub + Jira/Linear + Sentry (or equivalents)
* Skill “how we implement tickets here”
* Package as a plugin for reuse across repos

### Recipe D: CI gating with structured output

* Use headless mode for deterministic artifacts (`claude -p ... --output-format json/stream-json`) and parse results in CI.

---

## Headless + “Unix philosophy” integrations (where Claude becomes infrastructure)

### Use Claude like a linter/reviewer in build scripts

You can add a script like `lint:claude` that compares changes vs main and reports issues with filenames/line numbers for CI usage.

### Pipe in / pipe out for logs + debugging

Example pattern: `cat build-error.txt | claude -p 'explain root cause' > output.txt` (great for incident debugging).

### Output formats matter for automation

* `--output-format text` default
* `--output-format json` (structured messages + metadata)
* `--output-format stream-json` (streaming objects)

---

## Multi-Claude workflows: parallelism without chaos

### 1) “One Claude writes, another verifies”

Split contexts to avoid blind spots: code writer vs reviewer/tester, using `/clear` or separate sessions. This is explicitly recommended as a reliability boost.

### 2) Use git worktrees for hard isolation

Worktrees are *perfect* for parallel Claude sessions—isolated file states, shared git history, minimal interference. (Includes commands to add/list/remove worktrees.)

---

## GitHub-native automation: Claude Code Action playbook

For PR review automation, Claude Code Action supports:

* triggering on PR events (`opened`, `synchronize`)
* posting top-level + inline comments
* strict `--allowedTools` scoping
* optional progress tracking via `track_progress: true`

This is the “team scale” move: consistent review policy, faster cycles, and fewer human bottlenecks—without turning reviews into a free-for-all. 

---

## Safety: go fast without burning the repo down

### Safe YOLO mode is real power—and real risk

There’s an explicit mode to skip permission checks (`--dangerously-skip-permissions`) for uninterrupted runs, but it carries data loss/exfiltration risk; the recommended mitigation is **run it in a container without internet access** for risky tasks.

### Hooks are “production code”

Hooks can enforce policy and automate routine steps, but they run with your environment credentials—treat them like prod code and keep them auditable.

---

## CTO / Tech Lead rollout checklist (minimum viable “Claude Code operating system”)

1. **Define invariants**: formatting, linting, tests, “sensitive paths,” PR checklist.
2. Encode invariants in **Hooks** (deterministic enforcement).
3. Encode team playbooks in **Skills** (auto-applied standards, progressive disclosure).
4. Create **Subagents** for *explore / reviewer / test-runner* separation. 
5. Add **MCP** servers only for trusted systems; prefer project-scoped `.mcp.json` for shared tooling. 
6. Package as a **Plugin** once it’s stable (versioned distribution).
7. Add **headless `claude -p`** steps in CI for auditable, structured artifacts. 

---

## The “senior engineer” mantra (the throughline across sources)

* **Specs before code** (plan first, then execute).
* **Verification loops** (tests, screenshots, logs, checklists).
* **Deterministic automation** (hooks + headless + CI).
* **Context isolation beats monolith prompting** (subagents + worktrees).
* **You’re still the owner** (AI amplifies your expertise; it doesn’t replace engineering discipline).

---

