---
title: 'Claude Code Starter Kit'
summary: 'Quick setup reference and getting started guide'
date: '2024-01-15'
category: 'Getting Started'
---

# Claude Code starter kit

* **3 subagents**: `explore`, `reviewer`, `test-runner`
* **3 skills**: `code-standards`, `pr-review-rubric`, `incident-debugging`
* **5 slash commands**: `review`, `optimize`, `fix-issue`, `write-tests`, `summarize`
* **Project hooks** in `.claude/settings.json`:

  * format-on-write
  * protect-sensitive-files
  * stop-checklist
* **Project-scoped MCP baseline** `.mcp.json`

---

## 1) Repo layout

```text
.
├── .claude/
│   ├── agents/
│   │   ├── explore.md
│   │   ├── reviewer.md
│   │   └── test-runner.md
│   ├── commands/
│   │   ├── review.md
│   │   ├── optimize.md
│   │   ├── fix-issue.md
│   │   ├── write-tests.md
│   │   └── summarize.md
│   ├── hooks/
│   │   ├── format_on_write.sh
│   │   └── protect_sensitive.py
│   ├── skills/
│   │   ├── code-standards/
│   │   │   ├── SKILL.md
│   │   │   └── reference.md
│   │   ├── pr-review-rubric/
│   │   │   ├── SKILL.md
│   │   │   └── rubric.md
│   │   └── incident-debugging/
│   │       ├── SKILL.md
│   │       └── runbook.md
│   └── settings.json
└── .mcp.json
```

---

## 2) Subagents (`.claude/agents/*.md`)

### `.claude/agents/explore.md`

```markdown
---
name: explore
description: Codebase explorer. Use to map architecture, locate call-sites, summarize modules, and gather evidence before changes. Prefer read-only work.
tools: Read, Grep, Glob
model: sonnet
permissionMode: default
skills: code-standards, pr-review-rubric
---

You are the Explore agent.

Goals:
- Build a mental model of the repo quickly and accurately.
- Prefer evidence over guesses: cite files/paths and show snippets when helpful.
- Produce an “exploration brief” with:
  1) repo map (key dirs/modules)
  2) entry points
  3) relevant call-sites
  4) risks/unknowns
  5) recommended next steps

Constraints:
- Do NOT propose edits unless explicitly asked.
- If context is unclear, list 3–5 concrete questions that would unblock implementation.
```

### `.claude/agents/reviewer.md`

```markdown
---
name: reviewer
description: Senior code reviewer. Use proactively after code changes, before PR submission, or when asked to assess correctness/security/perf.
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
skills: pr-review-rubric, code-standards
---

You are the Reviewer agent.

Review checklist (high signal, no bikeshedding):
- Correctness: edge cases, error handling, idempotency, retries.
- Security: secrets, authZ/authN, injection, unsafe deserialization, SSRF/file access.
- Performance: hot paths, N+1, blocking IO, unnecessary allocations.
- Maintainability: naming, cohesion, config, testability, docs.
- Operational readiness: logging, metrics, timeouts, failure modes.

Output format:
- Summary (2–5 bullets)
- Must-fix (blocking)
- Should-fix (high ROI)
- Nice-to-have
- Suggested tests
```

### `.claude/agents/test-runner.md`

```markdown
---
name: test-runner
description: Test executor and failure triager. Use to run targeted tests, reproduce bugs, interpret failures, and suggest minimal fixes.
tools: Read, Grep, Glob, Bash
model: sonnet
permissionMode: default
skills: code-standards
---

You are the Test Runner agent.

Principles:
- Run the smallest test set that proves/disproves the hypothesis.
- Prefer deterministic runs; capture logs, commands, and reproduction steps.
- When failures occur: isolate, minimize, and propose the smallest safe fix.

When you run commands:
- Explain what you are running and why.
- Record outputs and the next action.
```

---

## 3) Skills (`.claude/skills/*/SKILL.md`)

### Skill 1: `.claude/skills/code-standards/SKILL.md`

```yaml
---
name: code-standards
description: Enforces repository coding conventions: style, structure, error handling, logging, and safe changes. Use for any code edits or refactors.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(npm test*), Bash(pytest*), Bash(go test*)
---
# Code Standards Skill

## Rules of engagement
1) Prefer small, reviewable changes.
2) Preserve behavior unless explicitly changing requirements.
3) Add/adjust tests for non-trivial logic.
4) No secrets in code or logs.

## Implementation conventions
- Errors: return/raise with context, don’t swallow.
- Logging: structured where possible; include correlation ids if available.
- Timeouts: all network calls must have timeouts.
- Config: prefer env/config files over constants for deploy-specific values.

## Before you finish
- Run relevant formatter/linter and the smallest meaningful test set.
- Update docs/comments if behavior changed.

## References
See [reference.md](reference.md) for language-specific notes.
```

### `.claude/skills/code-standards/reference.md`

```markdown
# Code Standards Reference

## Python
- Prefer ruff/black formatting; avoid broad excepts; type hints for public APIs.
- Use pytest; keep tests deterministic (freeze time, mock external IO).

## TypeScript/Node
- Prefer eslint + prettier; avoid any; validate inputs at boundaries.
- Avoid blocking operations on the event loop.

## Go
- gofmt always; avoid panics in library code; context propagation.

## General
- Never log secrets (.env, tokens, private keys).
- Add timeouts, retries with backoff where appropriate.
```

---

### Skill 2: `.claude/skills/pr-review-rubric/SKILL.md`

```yaml
---
name: pr-review-rubric
description: Applies a consistent PR review rubric (correctness, security, perf, tests, ops). Use when reviewing diffs or preparing PRs.
---
# PR Review Rubric Skill

Use this rubric whenever reviewing changes or preparing a PR.

## Required sections in your review output
- Summary
- Risk assessment
- Must-fix (blocking)
- Should-fix (high ROI)
- Test coverage assessment
- Operational considerations (logs/metrics/timeouts)

## Evidence
Always reference concrete files and functions. If you claim a risk, point to the exact area.

## Rubric details
See [rubric.md](rubric.md).
```

### `.claude/skills/pr-review-rubric/rubric.md`

```markdown
# PR Review Rubric (Detailed)

## Correctness
- Boundary conditions, null/empty, retries, idempotency, concurrency.

## Security
- Secrets, auth, injection, path traversal, SSRF, unsafe shell.

## Performance
- Hot paths, query patterns, cache, batching, async.

## Tests
- Happy path + 1–2 edge cases; regression test for bugs.

## Ops
- Logs are actionable, error messages helpful, timeouts set, failure modes understood.
```

---

### Skill 3: `.claude/skills/incident-debugging/SKILL.md`

```yaml
---
name: incident-debugging
description: Guides incident triage: reproduce, isolate, identify blast radius, mitigate, and document follow-ups. Use for prod issues, flaky tests, regressions.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(docker*), Bash(kubectl*), Bash(aws*), Bash(pytest*), Bash(npm test*), Bash(go test*)
---
# Incident Debugging Skill

## Triage loop
1) Confirm symptom + impact (who/what/when).
2) Identify recent changes and suspect components.
3) Reproduce locally or in staging.
4) Isolate minimal failing case.
5) Mitigate (feature flag, rollback, hotfix).
6) Root cause + prevention (tests, monitors, runbook update).

## Output format
- Timeline
- Hypotheses (ranked)
- Experiments run + outcomes
- Mitigation taken
- Root cause
- Follow-ups

See [runbook.md](runbook.md) for a detailed template.
```

### `.claude/skills/incident-debugging/runbook.md`

```markdown
# Incident Runbook Template

## Incident summary
- Impact:
- Start time:
- Detection source:
- Current status:

## Investigation
- Signals (logs/metrics/traces):
- Suspected change/commit:
- Repro steps:

## Mitigation
- Action taken:
- Risk of mitigation:
- Validation:

## Root cause
- What broke:
- Why now:
- Why not caught:

## Follow-ups
- Tests to add:
- Observability:
- Process:
```

---

## 4) Slash commands (`.claude/commands/*.md`)

### `.claude/commands/review.md`

```markdown
---
description: Review current branch changes (quality/security/perf/tests) and propose fixes.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git show:*), Read, Grep, Glob
argument-hint: [focus-area]
context: fork
---

You are reviewing the current branch changes.

1) Gather context:
   - Run `git status --porcelain`
   - Review `git diff --stat` and `git diff`
   - If needed, check recent commits: `git log -n 10 --oneline`

2) Delegate to the reviewer subagent for a deep review:
   - “Use the reviewer subagent to review the diff. Focus on $ARGUMENTS if provided.”

3) Return:
   - Summary
   - Must-fix / Should-fix / Nice-to-have
   - Suggested tests
```

### `.claude/commands/optimize.md`

```markdown
---
description: Identify performance bottlenecks and propose optimizations with measured impact.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [path-or-component]
context: fork
---

Optimize $ARGUMENTS (or the most relevant hot path if omitted).

Steps:
1) Find where time/allocations likely concentrate (call sites, loops, IO).
2) Propose 2–4 optimizations, each with:
   - expected impact
   - trade-offs
   - how to benchmark/verify
3) If repo has benchmarks/tests, suggest the exact commands to measure.
```

### `.claude/commands/fix-issue.md`

```markdown
---
description: Fix a bug from an issue description with minimal safe changes and a regression test.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [issue-id-or-description]
context: fork
---

Fix issue: $ARGUMENTS

Process:
1) Restate the issue in one sentence + acceptance criteria.
2) Locate likely code paths and reproduce (if possible).
3) Implement the smallest safe fix.
4) Add a regression test.
5) Provide a brief PR-ready summary + risks.
```

### `.claude/commands/write-tests.md`

```markdown
---
description: Write targeted unit/integration tests for the specified code path.
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [file-or-function]
---

Write tests for: $ARGUMENTS

Requirements:
- Cover happy path + at least one edge case.
- Prefer deterministic tests (no external network).
- Name tests clearly; keep them small.
- Suggest how to run the minimal test subset.
```

### `.claude/commands/summarize.md`

```markdown
---
description: Summarize what changed and why (PR summary, release notes, or handoff notes).
allowed-tools: Bash(git diff:*), Bash(git log:*), Read
argument-hint: [audience:pr|release|handoff]
---

Summarize the current changes for audience: $ARGUMENTS (default: pr).

Include:
- What changed (bullets)
- Why (intent / problem)
- Risk level + rollout notes
- Testing performed / recommended
```

---

## 5) Project hooks (`.claude/settings.json`) + scripts

### `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/format_on_write.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect_sensitive.py"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Stop-checklist: Confirm (1) changes are consistent with requirements, (2) formatting/linting is clean or explained, (3) relevant tests were run or a command is provided, (4) no secrets/sensitive files were modified or logged. If all are satisfied, respond with 'complete'. Otherwise respond with 'continue' and list exactly what remains."
          }
        ]
      }
    ]
  }
}
```

### `.claude/hooks/format_on_write.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

# Reads hook JSON from stdin, extracts file_path, runs best-effort formatter(s).
# Safe-by-default: only formats known extensions, only if formatter exists.

INPUT="$(cat)"
FILE_PATH="$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')"

# Nothing to format
if [[ -z "${FILE_PATH}" ]]; then
  exit 0
fi

# Only format real files
if [[ ! -f "${FILE_PATH}" ]]; then
  exit 0
fi

ext="${FILE_PATH##*.}"

run_if_exists () {
  local cmd="$1"
  shift
  if command -v "${cmd}" >/dev/null 2>&1; then
    "${cmd}" "$@"
    return 0
  fi
  return 1
}

case "${ext}" in
  py)
    # Prefer ruff format if available, else black
    if ! run_if_exists ruff format "${FILE_PATH}"; then
      run_if_exists black "${FILE_PATH}" || true
    fi
    ;;
  js|jsx|ts|tsx|json|md|yaml|yml)
    # Prefer prettier if available
    run_if_exists npx --yes prettier --write "${FILE_PATH}" || true
    ;;
  go)
    run_if_exists gofmt -w "${FILE_PATH}" || true
    ;;
  *)
    # No-op for unknown extensions
    ;;
esac

exit 0
```

### `.claude/hooks/protect_sensitive.py`

```python
#!/usr/bin/env python3
import json
import os
import re
import sys

SENSITIVE_PATH_PATTERNS = [
    r"(^|/)\.env(\.|$)",
    r"(^|/)secrets?(\.|/|$)",
    r"(^|/)\.aws(/|$)",
    r"(^|/)id_rsa(\.|$)",
    r"(^|/)pem(\.|$)",
]

DANGEROUS_BASH_PATTERNS = [
    r"\brm\s+-rf\b",
    r"\bchmod\s+777\b",
    r"\bcurl\b.*\|\s*(sh|bash)\b",
]

def is_sensitive_path(path: str) -> bool:
    p = path.replace("\\", "/")
    return any(re.search(rx, p) for rx in SENSITIVE_PATH_PATTERNS)

def main():
    raw = sys.stdin.read()
    if not raw.strip():
        return 0

    evt = json.loads(raw)
    tool = evt.get("tool_name", "")
    tool_input = evt.get("tool_input", {}) or {}

    # Block edits/writes to sensitive files
    if tool in ("Edit", "Write"):
        fp = tool_input.get("file_path") or ""
        if fp and is_sensitive_path(fp):
            # Exit code 2 blocks the operation; stderr is shown.
            sys.stderr.write(
                f"Blocked: attempted to {tool} sensitive file '{fp}'. "
                f"Use a secure secret-management workflow instead.\n"
            )
            return 2

    # Block obviously dangerous bash patterns (customize!)
    if tool == "Bash":
        cmd = tool_input.get("command") or ""
        if any(re.search(rx, cmd) for rx in DANGEROUS_BASH_PATTERNS):
            sys.stderr.write(
                f"Blocked: dangerous command pattern detected: {cmd}\n"
                f"If you truly intend this, run it manually outside Claude Code.\n"
            )
            return 2

        # Also block bash that references sensitive paths
        if any(is_sensitive_path(m.group(0)) for m in re.finditer(r"(/[^\s]+)", cmd)):
            sys.stderr.write(
                f"Blocked: command references a potentially sensitive path: {cmd}\n"
            )
            return 2

    return 0

if __name__ == "__main__":
    sys.exit(main())
```

> Tip: if your team prefers “soft blocks” (warn but allow), switch to structured JSON output instead of exit code `2`. This kit uses hard blocks to be safe by default.

---

## 6) MCP baseline (`.mcp.json` in repo root)

This is **project-scoped**, meant to be checked in. It includes a **stdio server** and an **http server** placeholder with env var expansion.

```json
{
  "mcpServers": {
    "local-utils": {
      "command": "node",
      "args": ["./tools/mcp/local-utils-server.js"],
      "env": {
        "LOG_LEVEL": "${MCP_LOG_LEVEL:-info}"
      }
    },
    "github": {
      "type": "http",
      "url": "${GITHUB_MCP_URL:-https://api.example.com/mcp/github}",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Optional (but high ROI)

If you want this kit to *activate consistently* for a team, also add a small `CLAUDE.md` at repo root reminding Claude to use these tools (Skills auto-trigger, commands are explicit):

```markdown
# Claude Code Project Guide

- Use /review before opening PRs.
- Prefer the reviewer subagent after non-trivial changes.
- Follow the code-standards Skill for all edits.
```

---
