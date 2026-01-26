---
title: 'Oh My Claude Code'
summary: 'Advanced configuration patterns and customization options'
date: '2024-01-15'
category: 'Configuration'
---

# Oh my Claudecode: Complete Framework Guide

> **Multi-agent orchestration system for Claude Code**
> Version 3.3.8 | [GitHub](https://github.com/Yeachan-Heo/oh-my-claudecode) | [npm](https://www.npmjs.com/package/oh-my-claudecode)

---

## Table of Contents

1. [What is Oh my Claudecode?](#what-is-oh-my-claudecode)
2. [Core Concepts](#core-concepts)
3. [Installation & Setup](#installation--setup)
4. [Architecture Overview](#architecture-overview)
5. [The 28 Specialized Agents](#the-28-specialized-agents)
6. [Skills System](#skills-system)
7. [Hooks & Lifecycle](#hooks--lifecycle)
8. [Key Features](#key-features)
9. [Usage Patterns](#usage-patterns)
10. [Advanced Features](#advanced-features)
11. [Configuration](#configuration)
12. [Troubleshooting](#troubleshooting)

---

## What is Oh my Claudecode?

Oh my Claudecode (OMC) is an intelligent multi-agent orchestration framework that transforms Claude Code from a single AI assistant into a **coordinated team of specialized agents**. Instead of one Claude doing everything, OMC enables:

- **Delegation-first philosophy**: The main Claude instance acts as a conductor, delegating work to specialized agents
- **Smart model routing**: Automatically selects the optimal model (Opus/Sonnet/Haiku) based on task complexity
- **Parallel execution**: Independent tasks run concurrently for maximum efficiency
- **Persistent memory**: Three-tier notepad system survives conversation compaction
- **Automatic skill activation**: Detects task patterns and activates appropriate behaviors
- **Completion guarantee**: Tasks continue until verified complete by specialized reviewers

### The Flagship Experience: Autopilot Mode

**Autopilot** is the recommended starting point that provides fully autonomous execution from high-level ideas to working, tested code:

```bash
# Just describe what you want to build
> "I want a REST API for managing tasks with authentication"
> "Build me a React dashboard with real-time charts"
> "Create a CLI tool that processes CSV files"
```

Autopilot automatically:
1. **Expands** your idea into detailed requirements (Analyst + Architect)
2. **Plans** the implementation strategy (Architect + Critic review)
3. **Executes** with parallel agents (Ralph + Ultrawork)
4. **Tests** until all checks pass (UltraQA cycles)
5. **Validates** with security, functional, and quality reviews

No commands needed. No manual orchestration. Just describe your goal.

---

## Core Concepts

### 1. Delegation-First Philosophy

The main Claude instance is an **orchestrator, not a performer**:

| What Orchestrator Does | What Gets Delegated |
|------------------------|---------------------|
| Read files for context | Code changes (any complexity) |
| Create/update todos | Complex debugging |
| Communicate with user | UI/frontend work |
| Quick status checks | Documentation writing |
| Answer simple questions | Deep analysis |
| - | Codebase exploration |

**Iron Rule**: Never do substantive work directly. Always delegate to specialized agents.

### 2. Smart Model Routing

OMC automatically selects the optimal model tier to save tokens and maximize quality:

| Model Tier | Use Cases | Agents |
|------------|-----------|---------|
| **Haiku** (LOW) | Quick lookups, simple operations, basic file searches | `explore`, `executor-low`, `writer` |
| **Sonnet** (MEDIUM) | Standard implementation, UI work, documentation research | `executor`, `designer`, `researcher` |
| **Opus** (HIGH) | Complex debugging, architecture decisions, strategic planning | `architect`, `planner`, `critic` |

### 3. Skill Composition

Skills are **behavior injections** that modify how Claude operates. They compose in layers:

```
[Execution Layer]     +  [Enhancement Layer]    +  [Guarantee Layer]
     planner                ultrawork                  ralph
   orchestrate              git-master                   -
     default              frontend-ui-ux                 -
```

**Example Combinations**:
- `default + frontend-ui-ux + git-master` → UI implementation with proper commits
- `ultrawork + orchestrate + ralph` → Maximum speed + completion guarantee
- `planner → orchestrate + ultrawork` → Strategic planning then parallel execution

### 4. Agent Architecture: Fixed Master with Skill Activation

Unlike some systems with swappable master agents, Claude Code has a **fixed master** that gains capabilities through skills:

```
┌─────────────────────────────────────────┐
│         CLAUDE CODE MASTER              │
│         (Fixed, Cannot Swap)            │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  SKILL LAYER                  │     │
│  │  (Injected Behaviors)         │     │
│  │  - autopilot                  │     │
│  │  - ralph (persistence)        │     │
│  │  - ultrawork (parallelism)    │     │
│  │  - planner (strategic)        │     │
│  └───────────────────────────────┘     │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │architect│ │ executor│ │ designer│
  │ (Opus)  │ │(Sonnet) │ │(Sonnet) │
  └─────────┘ └─────────┘ └─────────┘
```

**Advantages**:
- Context preserved across mode changes
- Skills can stack (multiple active simultaneously)
- Natural language activation (no explicit mode switching)
- Seamless transitions between behaviors

---

## Installation & Setup

### Step 1: Choose Installation Method

**Option A: Claude Code Plugin (Recommended)**

```bash
# From terminal
claude plugin install oh-my-claude-sisyphus

# Or from within Claude Code
/oh-my-claudecode:plugin oh-my-claude-sisyphus
```

**Option B: npm (Windows & Cross-Platform)**

```bash
npm install -g oh-my-claudecode
```

**Option C: curl One-Liner (macOS/Linux)**

```bash
curl -fsSL https://raw.githubusercontent.com/Yeachan-Heo/oh-my-claudecode/main/scripts/install.sh | bash
```

### Step 2: Configure OMC

**For Current Project** (Recommended):
```bash
/oh-my-claudecode:omc-default
```
Creates `./.claude/CLAUDE.md` in your project directory.

**For All Projects** (Global):
```bash
/oh-my-claudecode:omc-default-global
```
Creates `~/.claude/CLAUDE.md` globally.

### What This Does

✅ Downloads latest CLAUDE.md with full orchestration prompt
✅ Configures 28 agents with intelligent model routing
✅ Enables magic keyword detection (ultrawork, search, analyze)
✅ Activates continuation enforcement
✅ Sets up skill composition

### Platform Support

| Platform | Install Method | Hook Type |
|----------|---------------|-----------|
| **Windows** | npm install | Node.js (.mjs) |
| **macOS** | curl or npm | Bash (.sh) or Node.js |
| **Linux** | curl or npm | Bash (.sh) or Node.js |

### Requirements

- **Claude Code** installed
- **Claude Max/Pro subscription** OR **Anthropic API key** (`ANTHROPIC_API_KEY`)
- **Windows**: Node.js 20+
- **macOS/Linux**: Bash shell (default) or Node.js 20+

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     OH-MY-CLAUDECODE SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    PLANNING     │  │   EXECUTION     │  │    SUPPORT      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ planner (Opus)  │  │ architect(Opus) │  │ researcher(Son) │
│ critic (Opus)   │  │ designer (Son)  │  │ explore (Haiku) │
│ analyst (Opus)  │  │ executor (Son)  │  │ writer (Haiku)  │
│                 │  │ qa-tester (Son) │  │ vision (Son)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### How It Works

1. **Orchestrator**: Main Claude instance coordinates all work
2. **Specialized Subagents**: Each agent has focused expertise and tools
3. **Parallel Execution**: Independent tasks run concurrently
4. **Continuation Enforcement**: Agents persist until ALL tasks complete
5. **Context Injection**: Project-specific instructions from CLAUDE.md files

### Plugin Structure

```
oh-my-claudecode/
├── .claude-plugin/
│   └── plugin.json            # Plugin manifest
├── agents/                    # 28 specialized subagents
├── commands/                  # Slash commands
├── skills/                    # Composable skills
├── hooks/
│   └── hooks.json             # Hook configuration
└── scripts/                   # Hook implementation
```

---

## The 28 Specialized Agents

OMC provides 28 specialized agents organized by complexity tier (LOW/MEDIUM/HIGH):

### Analysis & Architecture

| Agent | Model | Best For |
|-------|-------|----------|
| `architect` | Opus | Complex debugging, architecture decisions, root cause analysis |
| `architect-medium` | Sonnet | Standard debugging, code review |
| `architect-low` | Haiku | Quick issue diagnosis, simple debugging |

### Code Execution

| Agent | Model | Best For |
|-------|-------|----------|
| `executor-high` | Opus | Complex refactoring, multi-file changes |
| `executor` | Sonnet | Feature implementation, standard coding tasks |
| `executor-low` | Haiku | Simple code changes, single-file edits |

### Search & Exploration

| Agent | Model | Best For |
|-------|-------|----------|
| `explore-medium` | Sonnet | Thorough file/pattern searches |
| `explore` | Haiku | Quick file searches, basic reconnaissance |

### Research & Documentation

| Agent | Model | Best For |
|-------|-------|----------|
| `researcher` | Sonnet | Finding documentation, understanding code organization |
| `researcher-low` | Haiku | Quick doc lookups |
| `writer` | Haiku | README files, API docs, code comments |

### Frontend & Design

| Agent | Model | Best For |
|-------|-------|----------|
| `designer-high` | Opus | Complex UI systems, design architecture |
| `designer` | Sonnet | UI components, styling, accessibility |
| `designer-low` | Haiku | Simple styling tweaks |

### Planning & Review

| Agent | Model | Best For |
|-------|-------|----------|
| `planner` | Opus | Strategic planning, comprehensive work plans |
| `critic` | Opus | Critical plan review, feasibility assessment |
| `analyst` | Opus | Pre-planning analysis, requirement detection |

### Quality Assurance

| Agent | Model | Best For |
|-------|-------|----------|
| `qa-tester-high` | Opus | Complex testing scenarios |
| `qa-tester` | Sonnet | Interactive CLI/service testing with tmux |

### Security

| Agent | Model | Best For |
|-------|-------|----------|
| `security-reviewer` | Opus | Security audits, vulnerability assessment |
| `security-reviewer-low` | Haiku | Quick security scans |

### Build & Test

| Agent | Model | Best For |
|-------|-------|----------|
| `build-fixer` | Sonnet | Fixing build errors, dependency issues |
| `build-fixer-low` | Haiku | Simple build fixes |
| `tdd-guide` | Sonnet | TDD workflow guidance |
| `tdd-guide-low` | Haiku | Quick test suggestions |

### Code Review

| Agent | Model | Best For |
|-------|-------|----------|
| `code-reviewer` | Opus | Comprehensive code review |
| `code-reviewer-low` | Haiku | Quick code quality checks |

### Data Science

| Agent | Model | Best For |
|-------|-------|----------|
| `scientist-high` | Opus | Complex ML, hypothesis testing |
| `scientist` | Sonnet | Data analysis, statistics |
| `scientist-low` | Haiku | Quick data inspection |

### Visual Analysis

| Agent | Model | Best For |
|-------|-------|----------|
| `vision` | Sonnet | Analyzing screenshots, diagrams, mockups |

### Agent Invocation

Always use the `oh-my-claudecode:` prefix when calling via Task tool:

```javascript
Task({
  subagent_type: "oh-my-claudecode:architect",
  model: "opus",
  prompt: "Debug the memory leak in worker process"
})
```

---

## Skills System

### All 26+ Skills

| Skill | Purpose | Auto-Trigger | Manual Command |
|-------|---------|--------------|----------------|
| `autopilot` | Full autonomous execution | "autopilot", "build me" | `/oh-my-claudecode:autopilot` |
| `orchestrate` | Core multi-agent orchestration | Always active | - |
| `ralph` | Persistence until verified complete | "don't stop", "must complete" | `/oh-my-claudecode:ralph` |
| `ultrawork` | Maximum parallel execution | "fast", "parallel", "ulw" | `/oh-my-claudecode:ultrawork` |
| `planner` | Strategic planning with interview | "plan this" | `/oh-my-claudecode:planner` |
| `plan` | Start planning session | "plan" keyword | `/oh-my-claudecode:plan` |
| `ralplan` | Iterative planning consensus | "ralplan" keyword | `/oh-my-claudecode:ralplan` |
| `review` | Review plan with Critic | "review plan" | `/oh-my-claudecode:review` |
| `analyze` | Deep analysis/investigation | "analyze", "debug" | `/oh-my-claudecode:analyze` |
| `deepsearch` | Thorough codebase search | "search", "find" | `/oh-my-claudecode:deepsearch` |
| `deepinit` | Generate AGENTS.md hierarchy | "index codebase" | `/oh-my-claudecode:deepinit` |
| `frontend-ui-ux` | Design sensibility for UI | UI/component context | (silent activation) |
| `git-master` | Git expertise, atomic commits | git/commit context | (silent activation) |
| `ultraqa` | QA cycling: test/fix/repeat | "test", "QA", "verify" | `/oh-my-claudecode:ultraqa` |
| `research` | Parallel scientist orchestration | "research", "analyze data" | `/oh-my-claudecode:research` |
| `learner` | Extract reusable skill | "extract skill" | `/oh-my-claudecode:learner` |
| `note` | Save to notepad | "remember", "note" | `/oh-my-claudecode:note` |
| `hud` | Configure HUD statusline | - | `/oh-my-claudecode:hud` |
| `doctor` | Diagnose issues | - | `/oh-my-claudecode:doctor` |
| `help` | Show usage guide | - | `/oh-my-claudecode:help` |
| `omc-setup` | One-time setup wizard | - | `/oh-my-claudecode:omc-setup` |

### Skill Composition Examples

**UI Implementation with Proper Commits**:
```
Skills: default + frontend-ui-ux + git-master
Result: Design sensibility + atomic commits per feature
```

**Maximum Speed Refactoring**:
```
Skills: ultrawork + orchestrate + ralph
Result: Parallel execution + completion guarantee
```

**Strategic Planning Then Execution**:
```
Phase 1: planner (strategic planning)
Phase 2: orchestrate + ultrawork (parallel implementation)
```

### Magic Keywords

Users don't need to learn commands. Just say:

| Say This... | Auto-Activates... |
|-------------|-------------------|
| "autopilot: build a todo app" | Full autonomous execution |
| "don't stop until done" | Ralph persistence mode |
| "fast" or "parallel" or "ulw" | Ultrawork maximum parallelism |
| "plan this feature" | Planning interview |
| "analyze why tests fail" | Deep analysis mode |
| "search for all API endpoints" | Deep search mode |

**Combine keywords**: "ralph ulw: migrate database" = persistence + parallelism

---

## Hooks & Lifecycle

OMC includes 19 lifecycle hooks that enhance Claude Code's behavior:

### Core Hooks

| Hook | Purpose |
|------|---------|
| `rules-injector` | Dynamic rules injection with YAML frontmatter parsing |
| `omc-orchestrator` | Enforces orchestrator behavior and delegation |
| `auto-slash-command` | Automatic slash command detection and execution |
| `keyword-detector` | Magic keyword detection (ultrawork, search, analyze) |
| `ralph-loop` | Self-referential development loop management |
| `todo-continuation` | Ensures todo list completion |
| `notepad` | Compaction-resilient memory system with three-tier storage |

### Context & Recovery

| Hook | Purpose |
|------|---------|
| `context-window-limit-recovery` | Token limit error handling and recovery |
| `preemptive-compaction` | Context usage monitoring to prevent limits |
| `session-recovery` | Session state recovery on crashes |
| `directory-readme-injector` | README context injection |

### Quality & Validation

| Hook | Purpose |
|------|---------|
| `comment-checker` | BDD detection and directive filtering |
| `thinking-block-validator` | Extended thinking validation |
| `empty-message-sanitizer` | Empty message handling |
| `edit-error-recovery` | Automatic recovery from edit errors |
| `post-tool-use` | Remember tag auto-capture to notepad system |

### Environment & Notifications

| Hook | Purpose |
|------|---------|
| `non-interactive-env` | CI/non-interactive environment handling |
| `agent-usage-reminder` | Reminder to use specialized agents |
| `background-notification` | Background task completion notifications |

---

## Key Features

### 1. Three-Tier Memory System

**The Problem**: Long sessions lose context through compaction. Critical discoveries vanish.

**The Solution**: Persistent notepad system that survives compaction:

| Tier | Purpose | Retention |
|------|---------|-----------|
| **Priority Context** | Critical discoveries (API URLs, key files) | Always loaded on session start |
| **Working Memory** | Session notes with timestamps | Auto-pruned after 7 days |
| **MANUAL** | User permanent notes | Never pruned |

**Usage**:
```bash
# Agents persist discoveries automatically
<remember>Project uses pnpm not npm</remember>
<remember priority>API client at src/api/client.ts</remember>

# Or save notes manually
/oh-my-claudecode:note Database schema uses PostgreSQL with Prisma ORM
```

### 2. Ralph Loop PRD Support

Structured task tracking inspired by [Ralph](https://github.com/snarktank/ralph):

- **Product Requirements Document (PRD)** format with user stories
- **Progress tracking** with learnings and patterns
- **Completion guarantee** - loop continues until ALL stories pass

**Three Powerful Modes**:

```bash
# Self-referential loop until completion
/oh-my-claudecode:ralph implement user authentication

# Maximum intensity + completion guarantee
/oh-my-claudecode:ultrawork + /oh-my-claudecode:ralph refactor API

# Autonomous test-verify-fix cycles
/oh-my-claudecode:ultraqa all tests must pass with 90%+ coverage
```

### 3. Notepad Wisdom System (v3.1)

Plan-scoped wisdom capture for persistent learnings, decisions, issues, and problems.

**Storage**: `.omc/notepads/{plan-name}/`

| File | Purpose |
|------|---------|
| `learnings.md` | Patterns, conventions, successful approaches |
| `decisions.md` | Architectural choices and rationales |
| `issues.md` | Problems and blockers needing attention |
| `problems.md` | Technical debt, gotchas, challenges |

**API Functions**:
- `initPlanNotepad(planName)` - Initialize notepad
- `addLearning(planName, content)` - Record learning
- `addDecision(planName, content)` - Record decision
- `addIssue(planName, content)` - Record issue
- `addProblem(planName, content)` - Record problem
- `getWisdomSummary(planName)` - Get formatted summary

**Benefits**:
- Separates learnings by plan for better organization
- Automatic timestamp tracking
- Structured wisdom capture
- Persistent storage survives session resets

### 4. Delegation Categories (v3.1)

Semantic task categorization that auto-maps to model tier, temperature, and thinking budget:

| Category | Tier | Temperature | Thinking | Use For |
|----------|------|-------------|----------|---------|
| `visual-engineering` | HIGH | 0.7 | high | UI/visual reasoning, frontend, design systems |
| `ultrabrain` | HIGH | 0.3 | max | Deep reasoning, architecture, complex debugging |
| `artistry` | MEDIUM | 0.9 | medium | Creative writing, novel approaches, innovation |
| `quick` | LOW | 0.1 | low | Simple lookups, straightforward operations |
| `writing` | MEDIUM | 0.5 | medium | Documentation, technical content |

**Auto-Detection**: Categories automatically detect from prompt keywords.

**API Functions**:
- `detectCategoryFromPrompt(taskPrompt)` - Auto-detect category
- `getCategoryForTask(context)` - Get category with full config
- `enhancePromptWithCategory(prompt, category)` - Add category guidance

### 5. Directory Diagnostics (v3.1)

Project-level type checking with dual strategy:

1. **Primary (tsc)**: Fast TypeScript compilation check via `tsc --noEmit`
2. **Fallback (LSP)**: File-by-file Language Server Protocol diagnostics

**Usage**:
```typescript
import { runDirectoryDiagnostics } from '@/tools/diagnostics';

const result = await runDirectoryDiagnostics(process.cwd());
console.log(result.success);        // true if no errors
console.log(result.errorCount);     // Number of errors
console.log(result.diagnostics);    // Formatted output
```

### 6. Session Resume (v3.1)

Background agents can be resumed with full context preservation:

```typescript
import { resumeSession } from '@/tools/resume-session';

const result = resumeSession({ sessionId: 'ses_abc123' });
if (result.success && result.context) {
  console.log(result.context.previousPrompt);
  console.log(result.context.toolCallCount);

  // Use continuation prompt in next Task delegation
  Task({
    subagent_type: "oh-my-claudecode:executor",
    prompt: result.context.continuationPrompt
  });
}
```

### 7. Auto-Update System

Silent auto-update checks for updates in the background:

- **Rate-limited**: Checks at most once every 24 hours
- **Concurrent-safe**: Lock file prevents simultaneous updates
- **Cross-platform**: Works on macOS and Linux

To manually update, re-run plugin install or use Claude Code's update mechanism.

---

## Usage Patterns

### Autopilot Workflow (Recommended)

**Zero Learning Curve**: Just describe what you want to build.

```bash
# In Claude Code, just say:
> "I want a REST API for task management with authentication"
> "Build me a React dashboard with real-time charts"
> "Create a CLI tool that processes CSV files"
```

**What Happens**:

1. **Expansion Phase** (Analyst + Architect)
   - Extract detailed requirements
   - Create technical specification
   - Save to `.omc/autopilot/spec.md`

2. **Planning Phase** (Architect + Critic)
   - Create comprehensive execution plan
   - Critic reviews for completeness
   - Save to `.omc/plans/autopilot-impl.md`

3. **Execution Phase** (Ralph + Ultrawork)
   - Parallel task execution
   - Track progress in TODO list
   - Record learnings in notepad

4. **QA Phase** (UltraQA)
   - Run build → lint → test
   - Fix failures automatically
   - Repeat until all pass

5. **Validation Phase** (3 Architects in parallel)
   - **Functional**: Verify requirements implemented
   - **Security**: Check for vulnerabilities
   - **Quality**: Review code quality and tests
   - Retry until all approved

**Control**:
```bash
# Cancel at any time
> "stop" or "cancel autopilot"

# Check status
> "autopilot status"

# Resume after interruption
> Automatically resumes from last phase
```

### Basic Orchestration

**Multi-Step Implementation**:

```bash
# Manual approach
/oh-my-claudecode:orchestrate refactor the authentication module

# Natural language (auto-activates)
> "Refactor the authentication module"
```

Claude will:
1. Analyze requirements
2. Create TODO list
3. Delegate to appropriate agents
4. Execute in parallel where possible
5. Verify completion before reporting

### Planning Workflows

**Strategic Planning**:

```bash
# Start planning session
/oh-my-claudecode:planner design new API layer

# Or just say
> "Plan the new API layer"
```

**Planner conducts an interview**:
- Asks about requirements
- Explores constraints
- Identifies risks
- Creates comprehensive plan

**Iterative Planning (Ralplan)**:

```bash
/oh-my-claudecode:ralplan implement user authentication
```

Combines Planner + Architect + Critic in an iterative loop until consensus.

### Persistence Mode (Ralph)

**When to Use**: Tasks that must complete fully, no matter what.

```bash
# Explicit command
/oh-my-claudecode:ralph migrate database schema to PostgreSQL

# Natural language trigger
> "Migrate database schema to PostgreSQL and don't stop until it's done"
```

**How It Works**:
- Creates structured PRD with user stories
- Tracks progress with learnings
- Self-referential loop continues until verified complete
- Cannot stop until ALL stories pass

**Combined with Ultrawork**:
```bash
> "ralph ulw: refactor entire API layer"
```
= Persistence + Maximum parallelism

### Maximum Performance (Ultrawork)

**When to Use**: Tasks with 3+ independent subtasks.

```bash
# Explicit command
/oh-my-claudecode:ultrawork implement user dashboard with charts

# Magic keyword
> "ulw fix all type errors across the codebase"
```

**What It Does**:
- Identifies parallelizable subtasks
- Spawns multiple executor agents
- Runs tasks concurrently (max 5)
- Aggregates results

### QA & Testing (UltraQA)

**When to Use**: Ensure all tests pass, fix issues automatically.

```bash
/oh-my-claudecode:ultraqa all tests must pass with 90%+ coverage
```

**Workflow**:
1. Run build → lint → test
2. For each failure: diagnose → fix → re-run
3. Repeat until all pass or max cycles (5)
4. Record learnings in notepad

### Research & Analysis

**Deep Analysis**:

```bash
/oh-my-claudecode:analyze why are tests failing in the checkout flow
```

Delegates to architect for root cause analysis.

**Codebase Search**:

```bash
/oh-my-claudecode:deepsearch all API endpoints that handle user data
```

Uses explore agents with multiple search strategies.

**Data Analysis**:

```bash
/oh-my-claudecode:research analyze user engagement patterns from CSV data
```

Spawns scientist agents in parallel for comprehensive analysis.

### UI/Frontend Work

**Automatic Design Sensibility**:

```bash
> "Add dark mode toggle to settings page"
```

Auto-activates `frontend-ui-ux` skill for design guidance + delegates to `designer` agent.

### Git Workflows

**Atomic Commits**:

```bash
> "Implement user authentication with proper commit history"
```

Auto-activates `git-master` skill for atomic commits per logical change.

**Creating Pull Requests**:

Uses `gh` CLI via Bash tool for all GitHub operations.

---

## Advanced Features

### 1. Dynamic Prompt Generation

Agent prompts are generated dynamically from definitions:

```typescript
import { getAgentDefinitions } from '@/agents/definitions';
import { generateOrchestratorPrompt, convertDefinitionsToConfigs } from '@/agents/prompt-generator';

const definitions = getAgentDefinitions();
const agents = convertDefinitionsToConfigs(definitions);
const prompt = generateOrchestratorPrompt(agents);
```

**Benefits**:
- Adding new agent automatically updates orchestrator
- Consistent prompt structure
- Easy customization via definitions

### 2. Agent Templates

Standardized prompt structures for common task types:

**Exploration Template** (`src/agents/templates/exploration-template.md`):
- TASK: What needs to be explored
- EXPECTED OUTCOME: What orchestrator expects
- CONTEXT: Background information
- MUST DO / MUST NOT DO: Constraints
- REQUIRED SKILLS / TOOLS: Capabilities needed

**Implementation Template** (`src/agents/templates/implementation-template.md`):
- TASK: Implementation goal
- EXPECTED OUTCOME: Deliverable
- CONTEXT: Project background
- VERIFICATION CHECKLIST: Pre-completion checks

### 3. Verification-Before-Completion Protocol

**Iron Law**: No completion claims without fresh verification evidence.

Before ANY agent says "done" or "fixed":

| Step | Action |
|------|--------|
| 1 | IDENTIFY: What command proves this claim? |
| 2 | RUN: Execute verification command |
| 3 | READ: Check output - did it pass? |
| 4 | CLAIM: Make claim WITH evidence |

**Red Flags** (must stop and verify):
- Using "should", "probably", "seems to"
- Expressing satisfaction before verification
- Claiming completion without fresh test/build run

**Evidence Types**:
| Claim | Required Evidence |
|-------|-------------------|
| "Fixed" | Test showing it passes now |
| "Implemented" | `lsp_diagnostics` clean + build pass |
| "Refactored" | All tests still pass |
| "Debugged" | Root cause identified with file:line |

### 4. Background Execution Rules

**Run in Background** (`run_in_background: true`):
- Package installs: npm install, pip install, cargo build
- Builds: npm run build, make, tsc
- Tests: npm test, pytest, cargo test

**Run Blocking** (foreground):
- git status, ls, pwd
- File reads/edits
- Quick commands (<10 seconds)

Maximum 5 concurrent background tasks.

### 5. Context Persistence with Remember Tags

Survive conversation compaction:

| Tag | Lifetime | Use For |
|-----|----------|---------|
| `<remember>info</remember>` | 7 days | Session-specific context |
| `<remember priority>info</remember>` | Permanent | Critical patterns/facts |

**DO capture**:
- Architecture decisions
- Error resolutions
- User preferences
- Key file locations

**DON'T capture**:
- Progress (use todos)
- Temporary state
- Info already in AGENTS.md

### 6. Continuation Enforcement

Claude is **bound to the task list**. Cannot stop until EVERY task is COMPLETE.

**Pre-Conclusion Checklist**:
- [ ] TODO LIST: Zero pending/in_progress tasks
- [ ] FUNCTIONALITY: All requested features work
- [ ] TESTS: All tests pass (if applicable)
- [ ] ERRORS: Zero unaddressed errors
- [ ] ARCHITECT: Verification passed

**If ANY unchecked → CONTINUE WORKING.**

---

## Configuration

### Project-Level Config

Create `.claude/CLAUDE.md` in your project:

```markdown
# Project Context

This is a TypeScript monorepo using:
- Bun runtime
- React for frontend
- PostgreSQL database

## Conventions
- Use functional components
- All API routes in /src/api
- Tests alongside source files
```

### Agent Customization

Edit agent files in `~/.claude/agents/`:

```yaml
---
name: architect
description: Your custom description
tools: Read, Grep, Glob, Bash, Edit
model: opus  # or sonnet, haiku
---

Your custom system prompt here...
```

### Configuration Precedence

If both exist, **project-scoped takes precedence** over global:

```
./.claude/CLAUDE.md  (project)  →  Overrides  →  ~/.claude/CLAUDE.md  (global)
```

### MCP Server Configs

OMC includes server definitions for:
- **Exa**: Semantic search
- **Context7**: Code context understanding
- **grep.app**: GitHub code search

### LSP Tools Integration

Real LSP server integration with 11 tools:

| Tool | Purpose |
|------|---------|
| `lsp_hover` | Type info and documentation at position |
| `lsp_goto_definition` | Jump to symbol definition |
| `lsp_find_references` | Find all usages of symbol |
| `lsp_document_symbols` | Get file outline |
| `lsp_workspace_symbols` | Search symbols across workspace |
| `lsp_diagnostics` | Get errors, warnings, hints |
| `lsp_rename` | Rename symbol across project |
| `lsp_code_actions` | Get available refactorings |
| `lsp_diagnostics_directory` | Project-level type checking |

**Requirements**: Language servers must be installed (typescript-language-server, pylsp, rust-analyzer, gopls, etc.)

### AST Tools Integration

Pattern-based code search and transformation:

| Tool | Purpose |
|------|---------|
| `ast_grep_search` | Pattern-based code search using AST matching |
| `ast_grep_replace` | Pattern-based code transformation |

Uses [@ast-grep/napi](https://ast-grep.github.io/) with meta-variables like `$VAR` and `$$$`.

---

## Troubleshooting

### Diagnosis Tool

```bash
/oh-my-claudecode:doctor
```

Automatically checks:
- Plugin installation
- Hook configuration
- Agent availability
- Skill registration
- CLAUDE.md presence

### Common Issues

**Issue**: "Agent not found"
- **Solution**: Ensure plugin is installed and agents are in `~/.claude/agents/`

**Issue**: "Skills not activating"
- **Solution**: Run `/oh-my-claudecode:omc-default` to update CLAUDE.md

**Issue**: "Hooks not working"
- **Solution**: Check `~/.claude/hooks.json` exists and contains OMC hooks

**Issue**: "HUD not showing"
- **Solution**: Run `/oh-my-claudecode:hud setup` to install/repair statusline

### Manual Uninstall

```bash
# Remove agents
rm ~/.claude/agents/{architect,researcher,explore,designer,writer,vision,critic,analyst,executor,planner,qa-tester}*.md

# Remove commands
rm ~/.claude/commands/{orchestrate,omc-default,ultrawork,deepsearch,analyze,plan,review,planner,ralph-loop,cancel-ralph}*.md

# Remove skills
rm -rf ~/.claude/skills/{ultrawork,deepinit,git-master,frontend-ui-ux}

# Or use uninstall script
curl -fsSL https://raw.githubusercontent.com/Yeachan-Heo/oh-my-claudecode/main/scripts/uninstall.sh | bash
```

### Getting Help

- **Documentation**: [Full README](https://github.com/Yeachan-Heo/oh-my-claudecode)
- **Issues**: [GitHub Issues](https://github.com/Yeachan-Heo/oh-my-claudecode/issues)
- **Website**: [Project Website](https://yeachan-heo.github.io/oh-my-claudecode-website)

---

## Migration from 2.x

All old commands still work:

| 2.x Command | 3.x Equivalent | Natural Language |
|-------------|----------------|------------------|
| `/oh-my-claudecode:ralph "task"` | Same | "don't stop until done" |
| `/oh-my-claudecode:ultrawork "task"` | Same | "fast" or "ulw" |
| `/oh-my-claudecode:planner "task"` | Same | "plan this" |

**What's New in 3.x**:
- **Autopilot mode**: Full autonomous execution (flagship feature)
- **Auto-activation**: No need for explicit commands
- **Enhanced memory**: Three-tier notepad system
- **Better planning**: Ralplan iterative consensus
- **Advanced features**: Delegation categories, directory diagnostics, session resume

---

## Quick Reference

### Essential Commands

```bash
# Setup (one-time)
/oh-my-claudecode:omc-setup

# Autopilot (recommended)
> "autopilot: build a REST API for tasks"

# Manual modes
/oh-my-claudecode:orchestrate <task>
/oh-my-claudecode:ralph <task>
/oh-my-claudecode:ultrawork <task>
/oh-my-claudecode:planner <task>

# Utilities
/oh-my-claudecode:note <content>
/oh-my-claudecode:deepsearch <query>
/oh-my-claudecode:doctor
```

### Magic Keywords

Just include in natural language:

- `autopilot` → Full autonomous execution
- `ralph` or "don't stop" → Persistence mode
- `ulw` or "fast" → Maximum parallelism
- `plan` → Planning session
- `analyze` → Deep analysis
- `search` → Deep search

### Cancellation

```bash
# Generic stop
> "stop" or "cancel"

# Specific cancellation
/oh-my-claudecode:cancel-autopilot
/oh-my-claudecode:cancel-ralph
/oh-my-claudecode:cancel-ultrawork
/oh-my-claudecode:cancel-ultraqa
```

---

## Architecture Comparison: vs. oh-my-opencode

Oh my Claudecode is inspired by [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode), reimagined for Claude Code.

### Key Differences

| Aspect | oh-my-opencode | oh-my-claudecode |
|--------|----------------|------------------|
| **Platform** | OpenCode plugin (Bun) | Claude Code native |
| **Models** | Multi-provider (GPT/Gemini/Grok) | Claude-only (Opus/Sonnet/Haiku) |
| **Master Agent** | Swappable | Fixed with skill injection |
| **Installation** | Plugin system | Plugin or curl or npm |
| **Configuration** | Programmatic | Markdown files |
| **Context** | Lost on agent swap | Preserved across skills |

### What You Gain

- **Simpler Setup**: One command vs. multi-step plugin installation
- **Native Integration**: Works directly with Claude Code
- **Consistent Behavior**: All agents use Claude models
- **Easier Customization**: Edit markdown files to customize agents
- **Context Preservation**: Same conversation, different behaviors

### What You Lose

- **Model Diversity**: Can't use GPT-5.2 or Gemini models
- **Advanced Terminal**: No Tmux integration (standard Bash sufficient)

### Migration Tips

| oh-my-opencode Pattern | oh-my-claudecode Equivalent |
|------------------------|----------------------------|
| `switchMaster('planner')` | Invoke `planner` skill |
| `switchMaster('default')` | Invoke `default` skill |
| `switchMaster('architect')` | Use `architect` sub-agent via Task |
| Multiple masters | Skill composition |
| Master + sub-agents | Execution skill + sub-agents |

---

## Credits & License

- **Inspired by**: [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) by code-yeongyu
- **License**: MIT
- **Author**: Yeachan Heo
- **Version**: 3.3.8

---

## Summary

Oh my Claudecode transforms Claude Code into an intelligent multi-agent orchestration system:

✅ **28 specialized agents** with smart model routing
✅ **Autopilot mode** for zero-effort autonomous execution
✅ **26+ composable skills** that auto-activate based on context
✅ **19 lifecycle hooks** for enhanced behavior
✅ **Three-tier memory** that survives context compaction
✅ **Persistence mode (Ralph)** for completion guarantee
✅ **Parallel execution (Ultrawork)** for maximum speed
✅ **Strategic planning** with interactive interviews
✅ **Quality assurance** with automated fix cycles
✅ **No learning curve** - just describe what you want

**Get Started**: Install the plugin, run setup, then just say what you want to build. Autopilot handles the rest.

```bash
# Install
claude plugin install oh-my-claude-sisyphus

# Setup
/oh-my-claudecode:omc-setup

# Build something
> "autopilot: build a REST API for task management"
```

That's it. Welcome to the future of AI-assisted development.
