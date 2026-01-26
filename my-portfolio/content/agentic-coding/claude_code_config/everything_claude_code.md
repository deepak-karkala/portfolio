---
title: 'Everything Claude Code'
summary: 'Complete configuration reference and setup guide for Claude Code'
date: '2024-01-15'
category: 'Configuration'
---

# Everything Claude Code: Complete Framework Guide

## Table of Contents
1. [Overview](#overview)
2. [Framework Architecture](#framework-architecture)
3. [Installation & Setup](#installation--setup)
4. [Core Components](#core-components)
5. [Advanced Patterns](#advanced-patterns)
6. [Best Practices](#best-practices)
7. [Tips & Tricks](#tips--tricks)
8. [Resources](#resources)

---

## Overview

**everything-claude-code** is a production-ready, comprehensive configuration collection for Claude Code, developed by Affaan Mustafa ([@affaanmustafa](https://twitter.com/affaanmustafa)), winner of the Anthropic x Forum Ventures hackathon. This framework represents 10+ months of daily intensive use building real products, refined through practical experience to maximize Claude Code's effectiveness.

### What Problem Does It Solve?

Claude Code is powerful out of the box, but achieving consistent, production-quality results requires:
- Preventing context rot during long coding sessions
- Maintaining memory across sessions
- Automating repetitive workflows
- Managing token costs effectively
- Enforcing consistent code quality and security standards
- Coordinating parallel work streams

This framework provides battle-tested solutions for all these challenges through a modular system of agents, skills, hooks, commands, rules, and MCP configurations.

### Key Benefits

- **Context Window Optimization**: Techniques to maintain productive sessions for hours instead of minutes
- **Memory Persistence**: Automatic state saving and loading across sessions
- **Continuous Learning**: Extract patterns from sessions and convert them into reusable skills
- **Token Efficiency**: Reduce costs by 40-60% through smart subagent architecture and tool optimization
- **Quality Assurance**: Automated verification loops and evaluation harnesses
- **Parallel Workflows**: Coordinate multiple Claude instances safely

---

## Framework Architecture

### Directory Structure

```
everything-claude-code/
├── .claude-plugin/          # Plugin metadata and marketplace manifests
│   ├── plugin.json          # Plugin metadata and component paths
│   └── marketplace.json     # Marketplace catalog for /plugin marketplace add
│
├── agents/                  # Specialized subagents for delegation
│   ├── planner.md           # Feature implementation planning
│   ├── architect.md         # System design decisions
│   ├── tdd-guide.md         # Test-driven development
│   ├── code-reviewer.md     # Quality and security review
│   ├── security-reviewer.md # Vulnerability analysis
│   ├── build-error-resolver.md
│   ├── e2e-runner.md        # Playwright E2E testing
│   ├── refactor-cleaner.md  # Dead code cleanup
│   └── doc-updater.md       # Documentation sync
│
├── skills/                  # Workflow definitions and domain knowledge
│   ├── coding-standards/    # Language best practices
│   ├── backend-patterns/    # API, database, caching patterns
│   ├── frontend-patterns/   # React, Next.js patterns
│   ├── continuous-learning/ # Auto-extract patterns from sessions
│   ├── strategic-compact/   # Manual compaction suggestions
│   ├── tdd-workflow/        # TDD methodology
│   ├── security-review/     # Security checklist
│   ├── eval-harness/        # Verification loop evaluation
│   ├── verification-loop/   # Continuous verification
│   ├── clickhouse-io/       # ClickHouse integration patterns
│   └── project-guidelines-example/
│
├── commands/                # Slash commands for quick execution
│   ├── tdd.md               # /tdd - Test-driven development
│   ├── plan.md              # /plan - Implementation planning
│   ├── e2e.md               # /e2e - E2E test generation
│   ├── code-review.md       # /code-review - Quality review
│   ├── build-fix.md         # /build-fix - Fix build errors
│   ├── refactor-clean.md    # /refactor-clean - Dead code removal
│   ├── learn.md             # /learn - Extract patterns mid-session
│   ├── checkpoint.md        # /checkpoint - Save verification state
│   ├── verify.md            # /verify - Run verification loop
│   ├── setup-pm.md          # /setup-pm - Configure package manager
│   ├── orchestrate.md       # /orchestrate - Workflow coordination
│   ├── test-coverage.md     # /test-coverage - Coverage analysis
│   ├── update-codemaps.md   # /update-codemaps - Update code maps
│   ├── update-docs.md       # /update-docs - Documentation sync
│   └── eval.md              # /eval - Evaluation tasks
│
├── rules/                   # Always-follow guidelines (copy to ~/.claude/rules/)
│   ├── security.md          # Mandatory security checks
│   ├── coding-style.md      # Immutability, file organization
│   ├── testing.md           # TDD, 80% coverage requirement
│   ├── git-workflow.md      # Commit format, PR process
│   ├── agents.md            # When to delegate to subagents
│   ├── performance.md       # Model selection, context management
│   ├── patterns.md          # Architectural and design patterns
│   └── hooks.md             # Hook documentation
│
├── hooks/                   # Trigger-based automations
│   ├── hooks.json           # All hooks config (PreToolUse, PostToolUse, Stop, etc.)
│   ├── memory-persistence/  # Session lifecycle hooks
│   └── strategic-compact/   # Compaction suggestions
│
├── scripts/                 # Cross-platform Node.js scripts
│   ├── lib/                 # Shared utilities
│   │   ├── utils.js         # Cross-platform file/path/system utilities
│   │   └── package-manager.js # Package manager detection and selection
│   ├── hooks/               # Hook implementations
│   │   ├── session-start.js # Load context on session start
│   │   ├── session-end.js   # Save state on session end
│   │   ├── pre-compact.js   # Pre-compaction state saving
│   │   ├── suggest-compact.js # Strategic compaction suggestions
│   │   └── evaluate-session.js # Extract patterns from sessions
│   └── setup-package-manager.js # Interactive PM setup
│
├── tests/                   # Test suite
│   ├── lib/                 # Library tests
│   ├── hooks/               # Hook tests
│   └── run-all.js           # Run all tests
│
├── contexts/                # Dynamic system prompt injection contexts
│   ├── dev.md               # Development mode context
│   ├── review.md            # Code review mode context
│   └── research.md          # Research/exploration mode context
│
├── examples/                # Example configurations and sessions
│   ├── CLAUDE.md            # Example project-level config
│   ├── user-CLAUDE.md       # Example user-level config
│   └── sessions/            # Example session logs
│
├── mcp-configs/             # MCP server configurations
│   └── mcp-servers.json     # GitHub, Supabase, Vercel, Railway, etc.
│
└── marketplace.json         # Self-hosted marketplace config
```

### Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         USER REQUEST                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   MAIN ORCHESTRATOR   │◄───── rules/ (always loaded)
         │   (Claude Instance)   │◄───── contexts/ (dynamic injection)
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐          ┌──────────────┐
    │Commands │          │   Subagents  │
    │ /tdd    │          │  - planner   │
    │ /plan   │          │  - architect │
    │ /review │          │  - tdd-guide │
    └────┬────┘          └──────┬───────┘
         │                      │
         │                      │
         ▼                      ▼
    ┌────────────────────────────────┐
    │         SKILLS LIBRARY         │
    │  - coding-standards            │
    │  - backend-patterns            │
    │  - frontend-patterns           │
    │  - tdd-workflow                │
    │  - security-review             │
    └────────────┬───────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │   MCPs        │
         │  - github     │
         │  - supabase   │
         │  - vercel     │
         └───────┬───────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐            ┌──────────┐
│  HOOKS  │            │ SCRIPTS  │
│PreTool  │            │ session  │
│PostTool │            │ managers │
│Stop     │            │          │
└─────────┘            └──────────┘
```

---

## Installation & Setup

### Option 1: Plugin Installation (Recommended)

The easiest way to get started is installing as a plugin:

```bash
# Add the marketplace
claude plugin marketplace add https://github.com/affaan-m/everything-claude-code

# Open Claude Code, run /plugins, find the marketplace, and install
```

This provides instant access to all components without manual configuration.

### Option 2: Manual Installation

For more control or selective installation:

```bash
# Clone the repository
git clone https://github.com/affaan-m/everything-claude-code.git ~/.claude/everything-claude-code

# Create symlinks to specific components you want to use
ln -s ~/.claude/everything-claude-code/agents ~/.claude/agents
ln -s ~/.claude/everything-claude-code/skills ~/.claude/skills
ln -s ~/.claude/everything-claude-code/commands ~/.claude/commands
ln -s ~/.claude/everything-claude-code/rules ~/.claude/rules
ln -s ~/.claude/everything-claude-code/hooks ~/.claude/hooks
```

### Option 3: Selective Component Installation

Copy only what you need:

```bash
# Install just the agents
cp -r ~/.claude/everything-claude-code/agents/* ~/.claude/agents/

# Install specific skills
cp -r ~/.claude/everything-claude-code/skills/tdd-workflow ~/.claude/skills/

# Install specific commands
cp ~/.claude/everything-claude-code/commands/tdd.md ~/.claude/commands/
```

### Initial Configuration

1. **Configure your CLAUDE.md file** (project or user level):
```bash
# Project level (applies to specific project)
touch .claude/CLAUDE.md

# User level (applies to all projects)
touch ~/.claude/CLAUDE.md
```

2. **Set up essential rules**:
```bash
mkdir -p ~/.claude/rules
cp ~/.claude/everything-claude-code/rules/*.md ~/.claude/rules/
```

3. **Configure MCPs** (if needed):
```bash
# Copy MCP configuration
cp ~/.claude/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers.json

# Edit to add your API keys and credentials
```

4. **Set up hooks** (optional but recommended):
```bash
cp ~/.claude/everything-claude-code/hooks/hooks.json ~/.claude/hooks.json
```

### Package Manager Setup

The framework intelligently detects your package manager (npm, pnpm, yarn, bun). To configure:

```bash
/setup-pm
```

This command will:
- Detect existing package managers
- Let you choose your preferred manager
- Create a `.claude/package-manager` configuration file
- Ensure consistent package manager usage across sessions

---

## Core Components

### 1. Agents (Subagents for Delegation)

Agents are specialized Claude instances that handle specific types of tasks. They help prevent context rot by delegating focused work to isolated processes.

#### Available Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **planner.md** | Feature implementation planning | Beginning of new features, breaking down complex tasks |
| **architect.md** | System design decisions | Architectural choices, technology selection, system design |
| **tdd-guide.md** | Test-driven development | Writing tests first, implementing test-driven workflows |
| **code-reviewer.md** | Quality and security review | Before commits, PR reviews, quality checks |
| **security-reviewer.md** | Vulnerability analysis | Security audits, penetration testing prep, vulnerability scans |
| **build-error-resolver.md** | Fix build/compilation errors | Build failures, dependency issues, configuration problems |
| **e2e-runner.md** | Playwright E2E testing | End-to-end test creation, UI automation testing |
| **refactor-cleaner.md** | Dead code cleanup | Code refactoring, technical debt reduction, cleanup |
| **doc-updater.md** | Documentation sync | Keeping docs up to date, generating documentation |

#### How Agents Work

```bash
# Main orchestrator delegates to an agent
Task tool with subagent_type="planner"

# Agent receives:
# - Limited context (only what it needs)
# - Specific tools (scoped permissions)
# - Clear objective
# - Can use specific skills

# Agent returns:
# - Summary of findings
# - Key decisions
# - Recommended actions
```

#### Agent Configuration Example

Each agent markdown file contains:
```yaml
---
name: tdd-guide
description: Test-driven development specialist
tools: [Read, Write, Edit, Bash]
skills: [tdd-workflow, testing]
model: sonnet  # or haiku, opus
---

[Detailed instructions for the agent's behavior]
```

#### Best Practices for Agents

1. **Pass objective context, not just queries**: When dispatching, include both the specific query AND the broader objective
2. **Iterative retrieval**: Evaluate agent returns and ask follow-ups before accepting
3. **Limit to 3 cycles**: Prevent infinite loops by capping follow-up iterations
4. **Sequential phases**: Use agents in a pipeline pattern (research → plan → implement → review → verify)
5. **Clean context between agents**: Use `/clear` to keep each agent's context fresh

#### Agent Orchestration Pattern

```
┌─────────────────┐
│  ORCHESTRATOR   │
│  (has context)  │
└────────┬────────┘
         │ dispatch with query + objective
         ▼
┌─────────────────┐
│   SUB-AGENT     │
│ (lacks context) │
└────────┬────────┘
         │ returns summary
         ▼
┌─────────────────┐      ┌─────────────┐
│   EVALUATE      │─no──►│  FOLLOW-UP  │
│   Sufficient?   │      │  QUESTIONS  │
└────────┬────────┘      └──────┬──────┘
         │ yes                  │
         ▼                      │ sub-agent
    [ACCEPT]              fetches answers
                                │
         ◄──────────────────────┘
              (max 3 cycles)
```

### 2. Skills (Workflow Definitions)

Skills are reusable workflow definitions and domain knowledge that Claude can reference during tasks. Think of them as playbooks or SOPs.

#### Available Skills

| Skill | Purpose |
|-------|---------|
| **coding-standards/** | Language-specific best practices (Python, TypeScript, Go, etc.) |
| **backend-patterns/** | API design, database patterns, caching strategies, authentication |
| **frontend-patterns/** | React patterns, Next.js conventions, state management, component design |
| **tdd-workflow/** | Test-driven development methodology, test-first approach |
| **security-review/** | Security checklist, OWASP Top 10, vulnerability prevention |
| **continuous-learning/** | Auto-extract patterns from sessions, learning from mistakes |
| **strategic-compact/** | Context compaction strategies, memory optimization |
| **verification-loop/** | Continuous verification patterns, automated validation |
| **eval-harness/** | Evaluation framework, benchmarking workflows |
| **clickhouse-io/** | ClickHouse integration patterns |
| **project-guidelines-example/** | Template for project-specific conventions |

#### Skill Structure

Skills can be either:
- **Single file**: `~/.claude/skills/security-review.md`
- **Multi-file directory**: `~/.claude/skills/tdd-workflow/` (with README.md as entry point)

Example skill structure:
```
~/.claude/skills/
  coding-standards.md           # Single-file skill
  tdd-workflow/                 # Multi-file skill
    ├── README.md               # Main entry point
    ├── test-patterns.md        # Sub-document
    └── examples/               # Reference implementations
        ├── unit-test.ts
        └── integration-test.ts
```

#### Creating Custom Skills

```bash
# Create a new skill
mkdir -p ~/.claude/skills/my-custom-skill
cat > ~/.claude/skills/my-custom-skill/README.md << 'EOF'
# My Custom Skill

## Purpose
[Describe what this skill helps with]

## When to Use
[Criteria for using this skill]

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Examples
[Code examples, patterns, or templates]

## Anti-patterns
[What NOT to do]
EOF
```

#### Skills vs Commands

- **Skills**: Broader workflow definitions, loaded as context, can be referenced by agents
- **Commands**: Quick executable prompts, initiated with `/command-name`, often invoke skills

### 3. Commands (Slash Commands)

Commands are slash-command shortcuts that provide quick access to common workflows.

#### Available Commands

| Command | Purpose | Example Usage |
|---------|---------|---------------|
| `/tdd` | Start test-driven development workflow | `/tdd implement user authentication` |
| `/plan` | Create implementation plan | `/plan add dark mode feature` |
| `/e2e` | Generate end-to-end tests | `/e2e test checkout flow` |
| `/code-review` | Conduct quality review | `/code-review src/auth/` |
| `/build-fix` | Fix build errors | `/build-fix` |
| `/refactor-clean` | Clean dead code | `/refactor-clean remove unused imports` |
| `/learn` | Extract patterns mid-session | `/learn save debugging technique` |
| `/checkpoint` | Save verification state | `/checkpoint milestone-1` |
| `/verify` | Run verification loop | `/verify all tests pass` |
| `/setup-pm` | Configure package manager | `/setup-pm` |
| `/orchestrate` | Coordinate multi-agent workflow | `/orchestrate feature implementation` |
| `/test-coverage` | Analyze test coverage | `/test-coverage report` |
| `/update-codemaps` | Update code navigation maps | `/update-codemaps` |
| `/update-docs` | Sync documentation | `/update-docs README.md` |
| `/eval` | Run evaluation tasks | `/eval benchmark performance` |

#### Command Chaining

Commands can be chained together in a single prompt:

```bash
# Chain multiple commands
/tdd implement user login && /code-review && /test-coverage

# Use with descriptive context
/plan implement dark mode, /tdd, /e2e test theme switching
```

#### Creating Custom Commands

```bash
# Create custom command
cat > ~/.claude/commands/my-command.md << 'EOF'
# My Custom Command

You are now executing the /my-command workflow.

## Objective
[What this command accomplishes]

## Steps
1. [First step]
2. [Second step]
3. [Third step]

## Success Criteria
[How to verify completion]
EOF
```

### 4. Rules (Always-Follow Guidelines)

Rules are always-loaded guidelines that Claude must follow throughout every session. They establish baseline behavior and constraints.

#### Available Rules

| Rule | Enforces |
|------|----------|
| **security.md** | No hardcoded secrets, input validation, SQL injection prevention, XSS protection |
| **coding-style.md** | Immutability preferences, file size limits, naming conventions, organization |
| **testing.md** | TDD workflow, 80% coverage requirement, test patterns |
| **git-workflow.md** | Conventional commits, PR process, branch naming |
| **agents.md** | When to delegate to subagents, agent selection criteria |
| **performance.md** | Model selection (Haiku vs Sonnet vs Opus), context management |
| **patterns.md** | Architectural patterns, API response formats, error handling |
| **hooks.md** | Hook documentation, when to use which hooks |

#### Rules Hierarchy

Rules can be configured at multiple levels:

1. **User-level** (`~/.claude/rules/`): Apply to ALL projects
2. **Project-level** (`.claude/rules/`): Apply to specific project only
3. **CLAUDE.md**: Can be either user or project level, contains inline rules

#### Example Rule Structure

```markdown
# Security Rules

## Never Do
- ❌ Hardcode API keys, passwords, or secrets
- ❌ Use raw SQL without parameterization
- ❌ Trust user input without validation
- ❌ Store passwords in plain text

## Always Do
- ✅ Use environment variables for secrets
- ✅ Parameterize all SQL queries
- ✅ Validate and sanitize all inputs
- ✅ Hash passwords with bcrypt/argon2

## Validation Checklist
Before completing any task involving:
- [ ] Authentication: Check for secure password handling
- [ ] API calls: Verify credentials not hardcoded
- [ ] Database queries: Confirm parameterization
- [ ] User input: Validate and sanitize
```

### 5. Hooks (Trigger-Based Automations)

Hooks are automated responses to specific events or tool calls. They enable workflow automation without manual intervention.

#### Hook Types

| Hook Type | Fires When | Use Cases |
|-----------|------------|-----------|
| **PreToolUse** | Before a tool executes | Validation, reminders, warnings |
| **PostToolUse** | After a tool finishes | Formatting, linting, feedback loops |
| **UserPromptSubmit** | When you send a message | Context injection, pre-processing |
| **Stop** | When Claude finishes responding | Cleanup, logging, session summary |
| **PreCompact** | Before context compaction | Save important state, checkpoint |
| **SessionStart** | On new session | Load previous context, restore state |
| **SessionComplete** | On session end | Persist learnings, save progress |
| **Notification** | On permission requests | Custom approval flows |

#### Hook Configuration

Hooks are configured in `~/.claude/hooks.json`:

```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm|pnpm|yarn)\"",
      "hooks": [
        {
          "type": "command",
          "command": "if [ -z \"$TMUX\" ]; then echo '[Hook] Consider tmux for session persistence' >&2; fi"
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "prettier --write \"${tool_input.file_path}\" 2>&1"
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "~/.claude/hooks/memory-persistence/session-end.sh"
        }
      ]
    }
  ]
}
```

#### Practical Hook Examples

**Example 1: Prevent Unnecessary .md Files**
```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\.md$\" && !(file_path matches \"(README|CLAUDE)\\.md$\")",
      "hooks": [
        {
          "type": "command",
          "command": "echo '[Hook] Blocked: Only README.md and CLAUDE.md allowed' >&2; exit 1"
        }
      ]
    }
  ]
}
```

**Example 2: Auto-format on Edit**
```json
{
  "PostToolUse": [
    {
      "matcher": "tool == \"Edit\" && file_path matches \"\\.(ts|tsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "prettier --write \"${tool_input.file_path}\" && tsc --noEmit"
        }
      ]
    }
  ]
}
```

**Example 3: Console.log Warning**
```json
{
  "PostToolUse": [
    {
      "matcher": "tool == \"Edit\"",
      "hooks": [
        {
          "type": "command",
          "command": "if grep -q 'console.log' \"${tool_input.file_path}\"; then echo '[Hook] Warning: console.log detected' >&2; fi"
        }
      ]
    }
  ]
}
```

#### Using the hookify Plugin

Instead of writing JSON manually, use the `hookify` plugin:

```bash
# Install hookify
claude plugin marketplace add @claude-plugins-official

# Use conversationally
/hookify create a hook that runs prettier after editing TypeScript files
```

### 6. Scripts (Cross-Platform Utilities)

The framework includes Node.js scripts for cross-platform compatibility (Windows, macOS, Linux).

#### Available Scripts

| Script | Purpose |
|--------|---------|
| `lib/utils.js` | Cross-platform file/path/system utilities |
| `lib/package-manager.js` | Package manager detection and selection |
| `hooks/session-start.js` | Load context on session start |
| `hooks/session-end.js` | Save state on session end |
| `hooks/pre-compact.js` | Pre-compaction state saving |
| `hooks/suggest-compact.js` | Strategic compaction suggestions |
| `hooks/evaluate-session.js` | Extract patterns from sessions |
| `setup-package-manager.js` | Interactive PM setup |

#### Package Manager Detection

The framework automatically detects package managers through:
1. Environment variables (`npm_config_user_agent`)
2. Project configuration files (`.npmrc`, `.yarnrc.yml`)
3. `package.json` `packageManager` field
4. Lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`)
5. Global configurations

### 7. MCP Configurations

Model Context Protocol (MCP) servers connect Claude to external services. The framework includes pre-configured MCP setups.

#### Included MCP Configurations

```json
{
  "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
  "firecrawl": { "command": "npx", "args": ["-y", "firecrawl-mcp"] },
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_REF"]
  },
  "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  },
  "vercel": { "type": "http", "url": "https://mcp.vercel.com" },
  "railway": { "command": "npx", "args": ["-y", "@railway/mcp-server"] },
  "cloudflare-docs": { "type": "http", "url": "https://docs.mcp.cloudflare.com/mcp" },
  "clickhouse": { "type": "http", "url": "https://mcp.clickhouse.cloud/mcp" }
}
```

#### MCP Best Practices

**CRITICAL: Context Window Management**

MCPs consume context window space. Each MCP adds tools to Claude's available toolset, eating into your 200k token budget.

**Rules of Thumb:**
- Configure 20-30 MCPs in your config
- Keep **under 10 MCPs enabled** per project
- Maintain **under 80 total tools** active
- Disable unused MCPs per project

**Managing MCPs:**

```bash
# View active MCPs
/plugins

# Navigate to MCP section to enable/disable

# Or use config file
# In ~/.claude.json under projects.[path].disabledMcpServers
{
  "projects": {
    "/path/to/project": {
      "disabledMcpServers": [
        "playwright",
        "cloudflare-docs",
        "clickhouse"
      ]
    }
  }
}
```

**MCP vs CLI + Skills:**

With lazy loading improvements, MCPs are less taxing on context. However, for heavy operations or token optimization:

- Use CLI equivalents wrapped in skills (e.g., `gh` CLI instead of GitHub MCP)
- Run operations outside Claude's context when possible
- Reserve MCPs for interactive, exploratory workflows

---

## Advanced Patterns

### 1. Context & Memory Management

Context rot is the primary enemy of long coding sessions. The framework provides multiple strategies for managing context.

#### Session Persistence Pattern

Create session log files to maintain memory across sessions:

```bash
# Directory structure
~/.claude/sessions/
  2026-01-20-auth-implementation.tmp
  2026-01-21-api-refactor.tmp
  2026-01-22-frontend-redesign.tmp
```

Each session file contains:
- Current state summary
- Completed items
- Blockers encountered
- Key decisions made
- Context for next session
- What approaches worked (with evidence)
- What approaches failed
- What approaches haven't been tried

**Example session file:**
```markdown
# Session: Auth Implementation - 2026-01-20

## Status: In Progress

## Completed
- [x] Set up JWT token generation
- [x] Implemented login endpoint
- [x] Created user registration flow

## In Progress
- [ ] Add refresh token mechanism
- [ ] Implement password reset flow

## Blockers
- JWT secret rotation strategy unclear
- Need to decide on token expiration times

## Key Decisions
- Using bcrypt for password hashing (10 rounds)
- JWT stored in httpOnly cookies (not localStorage)
- Refresh tokens stored in Redis with 7-day TTL

## Approaches That Worked
✅ Using middleware pattern for auth verification
✅ Separating auth logic from route handlers
✅ Using Zod for request validation

## Approaches That Failed
❌ Storing refresh tokens in DB was too slow
❌ Using session-based auth complicated mobile integration

## Next Session
- Implement refresh token rotation
- Add rate limiting to auth endpoints
- Write E2E tests for full auth flow
```

#### Starting New Session from Previous Context

```bash
# In Claude Code
@~/.claude/sessions/2026-01-20-auth-implementation.tmp continue from this session
```

Claude will read the session file and continue with full context.

#### Strategic Compaction

**Problem:** Auto-compaction happens at arbitrary points, often mid-task, losing important context.

**Solution:** Disable auto-compact and manually compact at logical intervals.

```bash
# Disable auto-compact in ~/.claude/config.json
{
  "autoCompact": false
}

# Manually compact at logical points
/compact

# Or use strategic-compact skill which suggests when to compact
```

**When to Compact:**
- After exploration phase, before implementation
- After completing a milestone, before starting next
- After debugging, before new feature work
- When context usage exceeds 70%

**Strategic Compact Hook:**

The framework includes a hook that suggests compaction after N tool calls:

```bash
#!/bin/bash
# Strategic Compact Suggester
COUNTER_FILE="/tmp/claude-tool-count-$$"
THRESHOLD=${COMPACT_THRESHOLD:-50}

if [ -f "$COUNTER_FILE" ]; then
  count=$(cat "$COUNTER_FILE")
  count=$((count + 1))
  echo "$count" > "$COUNTER_FILE"
else
  echo "1" > "$COUNTER_FILE"
  count=1
fi

if [ "$count" -eq "$THRESHOLD" ]; then
  echo "[StrategicCompact] $THRESHOLD tool calls reached - consider /compact if transitioning phases" >&2
fi
```

#### Dynamic System Prompt Injection

**Advanced technique** for surgical context loading:

```bash
# Instead of loading everything in .claude/rules/
# Use CLI flags to inject context dynamically
claude --system-prompt "$(cat memory.md)"
```

**Why this matters:**
- System prompt content has higher authority than tool results
- No tool call overhead (faster, cheaper)
- Surgical control over what loads when
- Useful for strict behavioral rules or critical constraints

**Practical Setup:**

```bash
# Create mode-specific contexts
mkdir -p ~/.claude/contexts

# Development mode
cat > ~/.claude/contexts/dev.md << 'EOF'
# Development Mode
- Focus on implementation speed
- Run tests frequently
- Document as you go
- Prefer existing patterns
EOF

# Review mode
cat > ~/.claude/contexts/review.md << 'EOF'
# Review Mode
- Scrutinize for security issues
- Check for code quality
- Verify test coverage
- Look for edge cases
EOF

# Research mode
cat > ~/.claude/contexts/research.md << 'EOF'
# Research Mode
- Explore before acting
- Read extensively
- Document findings
- Ask questions before implementing
EOF

# Create aliases
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

#### Memory Persistence Hooks

**Lifecycle hooks for automatic memory management:**

```
SESSION 1                              SESSION 2
─────────                              ─────────

[Start]                                [Start]
   │                                      │
   ▼                                      ▼
┌──────────────┐                    ┌──────────────┐
│ SessionStart │ ◄─── reads ─────── │ SessionStart │◄── loads previous
│    Hook      │     nothing yet    │    Hook      │    context
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       ▼                                   ▼
   [Working]                           [Working]
       │                               (informed)
       ▼                                   │
┌──────────────┐                           ▼
│  PreCompact  │──► saves state       [Continue...]
│    Hook      │    before summary
└──────┬───────┘
       │
       ▼
   [Compacted]
       │
       ▼
┌──────────────┐
│  Stop Hook   │──► persists to ──────────►
│ (session-end)│    ~/.claude/sessions/
└──────────────┘
```

**Hook Configuration:**

```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/pre-compact.sh"
      }]
    }],
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/session-start.sh"
      }]
    }],
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/session-end.sh"
      }]
    }]
  }
}
```

**What these hooks do:**
- **pre-compact.sh**: Logs compaction events, updates session file with timestamp
- **session-start.sh**: Checks for recent sessions (last 7 days), notifies of available context
- **session-end.sh**: Creates/updates daily session file with template, tracks times

### 2. Continuous Learning Pattern

**The Problem:** You repeatedly correct the same mistakes across sessions. Claude forgets patterns you've taught it.

**The Solution:** Automatically extract valuable patterns and save them as skills.

#### How It Works

```
[Session Work] ─────► [Session End] ─────► [Evaluation]
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  Was there   │
                                          │  valuable    │
                                          │  learning?   │
                                          └──────┬───────┘
                                                 │
                                            yes  │  no
                                                 ▼
                                          ┌──────────────┐
                                          │ Extract to   │
                                          │   Skill      │
                                          └──────┬───────┘
                                                 │
                                                 ▼
                                          ~/.claude/skills/learned/
                                          pattern-name.md
```

#### Installation

```bash
# Install continuous-learning skill
mkdir -p ~/.claude/skills/continuous-learning
curl -sL https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/continuous-learning/evaluate-session.sh > ~/.claude/skills/continuous-learning/evaluate-session.sh
chmod +x ~/.claude/skills/continuous-learning/evaluate-session.sh
```

#### Hook Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
          }
        ]
      }
    ]
  }
}
```

#### Manual Extraction with /learn

Don't wait for session end:

```bash
# Mid-session, after solving something non-trivial
/learn save this debugging technique
```

The `/learn` command:
1. Prompts you to describe the pattern
2. Drafts a skill file
3. Asks for confirmation before saving
4. Saves to `~/.claude/skills/learned/`

#### What Gets Extracted

Patterns worth extracting:
- Debugging techniques that worked
- Workarounds for specific issues
- Project-specific patterns discovered
- Error resolutions
- Performance optimizations
- Integration patterns

### 3. Token Optimization Strategies

For cost-conscious users or those hitting rate limits frequently.

#### Model Selection Strategy

**Cost Comparison (per million tokens):**
- Haiku: Input $1, Output $5
- Sonnet 4.5: Input $3, Output $15
- Opus 4.5: Input $5, Output $25

**Savings:**
- Haiku vs Opus: **5x cheaper** (83% cost reduction)
- Sonnet vs Opus: **1.67x cheaper** (40% cost reduction)
- Haiku vs Sonnet: **3x cheaper** (67% cost reduction)

**Model Selection Guide:**

| Task Type | Recommended Model | Rationale |
|-----------|-------------------|-----------|
| Simple file search | Haiku | Fast, cheap, sufficient |
| Quick refactoring | Haiku | Clear instructions, limited scope |
| Standard feature implementation | Sonnet | Balanced quality and cost |
| Complex architectural decisions | Opus | Highest reasoning capability |
| Security review | Opus | Critical task, worth the cost |
| Multi-file refactoring (5+ files) | Opus | Complex context management |
| Build error debugging (first attempt) | Sonnet | Usually sufficient |
| Build error debugging (second attempt) | Opus | First attempt failed, need stronger model |

**Subagent Model Configuration:**

```yaml
---
name: quick-search
description: Fast file and keyword search
tools: [Glob, Grep]
model: haiku  # Cheap and fast for simple tasks
---

---
name: architect
description: System design and architectural decisions
tools: [Read, Glob, Grep]
model: opus  # Worth the cost for critical decisions
---

---
name: tdd-guide
description: Test-driven development
tools: [Read, Write, Edit, Bash]
model: sonnet  # Balanced for most coding tasks
---
```

#### Tool-Specific Optimizations

**Replace grep with mgrep:**

mgrep is ~50% more token-efficient than ripgrep on average.

```bash
# Install mgrep plugin
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# Use in searches
mgrep "function handleSubmit"  # Local search
mgrep --web "Next.js 15 app router changes"  # Web search
```

#### Background Process Pattern

Run long-running tasks outside Claude to avoid streaming token costs:

```bash
# Instead of having Claude stream output
# Run in tmux, then selectively share results

tmux new -s build
npm run build

# Detach from tmux
Ctrl+B, D

# Later, check results
tmux attach -t build

# Share only the relevant portion with Claude
# Copy the error message or summary
# Paste into Claude

# Result: Save thousands of input tokens
```

#### Modular Codebase Benefits

**Problem:** Large files require multiple reads, burning tokens each time:
```
File is 2000+ lines
└─► Claude reads first 2000 lines (4000 input tokens)
    └─► Claude continues reading (another 4000 input tokens)
        └─► Total: 8000+ tokens just to read once
            └─► If Claude re-reads: Another 8000+ tokens
```

**Solution:** Keep files under 500 lines through modular architecture:

```
root/
├── src/
│   ├── apps/              # Entry points (thin)
│   │   └── api-gateway/   # < 200 lines
│   │
│   ├── modules/           # Self-contained modules
│   │   ├── ordering/
│   │   │   ├── api/       # Public interface < 100 lines
│   │   │   ├── domain/    # Business logic < 300 lines
│   │   │   ├── infrastructure/ # DB/external < 200 lines
│   │   │   └── use-cases/ # Orchestration < 200 lines
│   │   │
│   │   ├── catalog/
│   │   └── identity/
│   │
│   └── shared/            # Reusable utilities
│       ├── kernel/        # Base classes < 100 lines
│       └── utils/         # Helpers < 50 lines each
```

**Benefits:**
- Files < 500 lines read in one pass (saves tokens)
- Claude less likely to lose context mid-file
- Easier to target specific modules (less context needed)
- Refactoring is scoped and safer

#### Lean Codebase Maintenance

Use skills to continuously clean:

```bash
# Regular cleanup
/refactor-clean remove dead code

# Identify repetitive patterns
# Manually review, then:
/refactor-clean extract common utilities

# Result: Smaller codebase = cheaper tokens
```

#### System Prompt Slimming (Advanced)

For extreme cost optimization:

Claude Code's system prompt: ~18k tokens (~9% of 200k context)
- With patches: ~10k tokens
- **Savings: 7,300 tokens (41% reduction in static overhead)**

See [YK's system-prompt-patches](https://github.com/yk-is-here/system-prompt-patches) if interested.

**Author's note:** "Personally I don't do this" - the optimization is marginal for most users.

### 4. Verification Loops & Evaluation Harnesses

Ensure quality through automated verification.

#### Verification Pattern Types

```
CHECKPOINT-BASED                         CONTINUOUS
─────────────────                        ──────────

  [Task 1]                                 [Work]
     │                                        │
     ▼                                        ▼
  ┌─────────┐                            ┌─────────┐
  │Checkpoint│◄── verify                 │ Timer/  │
  │   #1    │    criteria                │ Change  │
  └────┬────┘                            └────┬────┘
       │ pass?                                │
   ┌───┴───┐                                  ▼
   │       │                            ┌──────────┐
  yes     no ──► fix ──┐                │Run Tests │
   │              │    │                │  + Lint  │
   ▼              └────┘                └────┬─────┘
  [Task 2]                                   │
     │                                  ┌────┴────┐
     ▼                                  │         │
  ┌─────────┐                          pass     fail
  │Checkpoint│                          │         │
  │   #2    │                           ▼         ▼
  └────┬────┘                        [Continue] [Stop & Fix]
       │                                          │
      ...                                    └────┘

Best for: Linear workflows              Best for: Long sessions
with clear milestones                   exploratory refactoring
```

#### Checkpoint-Based Verification

**Use when:** Feature implementation with clear stages

**Pattern:**
```bash
# Define checkpoints in plan
/plan implement user authentication

# Plan output:
## Checkpoint 1: Database Schema
- Create users table
- Add indexes
- Verify: Run migrations, check schema

## Checkpoint 2: Authentication Logic
- Implement password hashing
- Create JWT generation
- Verify: Unit tests pass, no hardcoded secrets

## Checkpoint 3: API Endpoints
- Create login endpoint
- Create registration endpoint
- Verify: Integration tests pass, rate limiting works

## Checkpoint 4: Frontend Integration
- Add login form
- Add session management
- Verify: E2E tests pass, works in production build
```

**Verification at each checkpoint:**
```bash
/verify checkpoint-1 passed
# Claude runs verification criteria
# If fails: stops and fixes before proceeding
```

#### Continuous Verification

**Use when:** Long-running sessions, exploratory refactoring, maintenance

**Pattern:**
```bash
# Set up continuous verification
/verify --continuous --interval 15

# Every 15 minutes (or after major changes):
# 1. Run test suite
# 2. Run linting
# 3. Check build status
# 4. Report regressions immediately
# 5. Stop and fix before continuing
```

**Hook-based continuous verification:**

```json
{
  "PostToolUse": [
    {
      "matcher": "tool == \"Edit\" && modified_files > 3",
      "hooks": [
        {
          "type": "command",
          "command": "npm test -- --changed && npm run lint"
        }
      ]
    }
  ]
}
```

#### Grader Types

From [Anthropic's Guide](https://docs.anthropic.com/en/docs/build-with-claude/develop-tests):

**1. Code-Based Graders**
- String matching
- Binary pass/fail tests
- Static analysis
- Outcome verification

**Pros:** Fast, cheap, objective
**Cons:** Brittle to valid variations

**2. Model-Based Graders**
- Rubric scoring
- Natural language assertions
- Pairwise comparison

**Pros:** Flexible, handles nuance
**Cons:** Non-deterministic, more expensive

**3. Human Graders**
- Subject matter expert review
- Crowdsourced judgment
- Spot-check sampling

**Pros:** Gold standard quality
**Cons:** Expensive and slow

#### Key Metrics

**pass@k**: At least ONE of k attempts succeeds
```
k=1: 70% success
k=3: 91% success
k=5: 97% success

Higher k = higher odds of success
Use when: You just need it to work once
```

**pass^k**: ALL k attempts must succeed
```
k=1: 70% consistency
k=3: 34% consistency
k=5: 17% consistency

Higher k = harder (tests consistency)
Use when: You need deterministic output
```

#### Building an Eval Harness

**Steps:**
1. **Start early**: Create 20-50 simple tasks from real failures
2. **Convert failures into tests**: User-reported bugs become test cases
3. **Write unambiguous tasks**: Two experts should reach same verdict
4. **Build balanced sets**: Test when behavior should AND shouldn't occur
5. **Robust harness**: Each trial starts from clean environment
6. **Grade outputs, not paths**: Don't care how Claude got there, only that it works
7. **Read transcripts**: Learn from many trials
8. **Monitor saturation**: 100% pass rate means add more tests

**Example eval harness structure:**

```bash
~/.claude/evals/
  ├── auth/
  │   ├── test-login-success.md
  │   ├── test-login-fail-wrong-password.md
  │   ├── test-registration-duplicate-email.md
  │   └── grader.sh
  ├── api/
  │   ├── test-rate-limiting.md
  │   ├── test-error-handling.md
  │   └── grader.sh
  └── run-all.sh
```

### 5. Parallelization Strategies

Coordinate multiple Claude instances safely and effectively.

#### When to Parallelize

**Good candidates for parallel work:**
- Orthogonal features (no file overlap)
- Research vs implementation
- Multiple independent bugs
- Documentation while coding
- Different deployment environments

**Bad candidates:**
- Overlapping file changes
- Sequential dependencies
- Single linear workflow
- Unclear scope

#### Parallel Workflow Patterns

**Pattern 1: Research + Implementation**
```
Terminal 1: Main implementation
└─► Editing source code
    Writing tests
    Running builds

Terminal 2: Research fork
└─► Reading documentation
    Searching GitHub
    Pulling external resources
    Answering "how does X work?"
```

**Pattern 2: Feature + Documentation**
```
Terminal 1: Feature development
└─► Implementing new API endpoint
    Writing tests
    Testing locally

Terminal 2: Documentation
└─► Updating API docs
    Creating examples
    Writing migration guide
```

**Pattern 3: Git Worktrees for Overlapping Work**
```
main branch: production code

worktree 1: feature-a (Terminal 1)
└─► Git worktree: ../project-feature-a
    Independent Claude instance
    No conflicts

worktree 2: feature-b (Terminal 2)
└─► Git worktree: ../project-feature-b
    Independent Claude instance
    No conflicts

worktree 3: refactor (Terminal 3)
└─► Git worktree: ../project-refactor
    Benchmarking alternative approach
```

#### Setting Up Git Worktrees

```bash
# Create worktrees for parallel work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-refactor refactor-branch

# Navigate and start Claude in each
cd ../project-feature-a && claude
# In another terminal
cd ../project-feature-b && claude
# In another terminal
cd ../project-refactor && claude

# Benefits:
# - No git conflicts between instances
# - Each has clean working directory
# - Easy to compare outputs
# - Can benchmark same task across approaches

# Clean up when done
git worktree remove ../project-feature-a
```

#### Fork Command Usage

```bash
# Within Claude session, fork for non-overlapping task
/fork research best practices for rate limiting

# Fork opens in new tab/session
# Original session continues with main work
# Fork investigates specific question
# No file conflicts because fork doesn't write code
```

#### Terminal Organization: Cascade Method

When running multiple instances:

1. **Open new tasks in tabs to the right** (chronological order)
2. **Sweep left to right**, oldest to newest
3. **Maintain consistent direction flow**
4. **Check on specific tasks** as needed
5. **Focus on 3-4 tasks max** at a time

**Mental overhead increases faster than productivity beyond 4 parallel tasks.**

#### Naming Sessions

```bash
# Name your sessions for easy identification
/rename auth-implementation
/rename frontend-redesign
/rename api-refactor

# Result: Clear session names when resuming
# Especially important with multiple worktrees
```

#### When NOT to Parallelize

**From @bcherny** (Claude Code creator): "Running 5 Claudes in parallel"

**Author's counterpoint**: "Don't set arbitrary terminal counts. Add instances out of true necessity."

**Better approach:**
- Start with 1 instance
- Add second only when genuinely needed
- Use tmux for background processes instead of new Claude instances
- Scripts for automation instead of dedicated Claude
- Most work can be done with 2-3 instances

**Only scale when:**
- True parallelizable work exists
- Each instance has well-defined plan
- Using git worktrees for overlap
- Mental overhead is justified

#### tmux for Background Processes

Instead of spawning Claude for monitoring:

```bash
# Start backend server in tmux
tmux new -s backend
npm run dev:backend

# Detach
Ctrl+B, D

# Start frontend server in another tmux
tmux new -s frontend
npm run dev:frontend

# Detach
Ctrl+B, D

# List sessions
tmux ls

# Attach to check logs
tmux attach -t backend
tmux attach -t frontend

# Result: 1 Claude instance, multiple monitored processes
```

---

## Best Practices

### 1. Starting a New Project

The framework recommends a two-instance kickoff pattern:

#### Instance 1: Scaffolding Agent

```bash
# Terminal 1: Scaffolding
/plan create project structure

# Creates:
# - Directory structure
# - Config files (package.json, tsconfig.json, etc.)
# - .claude/CLAUDE.md with project rules
# - .claude/agents/ (project-specific agents)
# - .claude/skills/ (project-specific skills)
# - Git initialization
# - README.md template
```

#### Instance 2: Deep Research Agent

```bash
# Terminal 2: Research (enable MCPs)
/research create detailed PRD

# Creates:
# - Product Requirements Document
# - Architecture diagrams (Mermaid)
# - Technology selection rationale
# - API documentation templates
# - Database schema design
# - Deployment strategy

# Uses:
# - Web search for latest best practices
# - GitHub for similar projects
# - Official documentation (llms.txt when available)
# - Context7 for live docs
```

#### Workflow

```
Start
  │
  ├─► Terminal 1: Scaffolding          ├─► Terminal 2: Research
  │   │                                 │   │
  │   ├─► Create structure              │   ├─► Search best practices
  │   ├─► Set up configs                │   ├─► Find similar projects
  │   ├─► Initialize git                │   ├─► Read documentation
  │   └─► Set up .claude/               │   └─► Create PRD + diagrams
  │                                     │
  └─────────────────┬───────────────────┘
                    │
                    ▼
              [Review Both]
                    │
                    ▼
              [Begin Implementation]
```

### 2. llms.txt Pattern

Many modern documentation sites provide LLM-optimized docs:

```bash
# Check for llms.txt
https://docs.example.com/llms.txt

# Examples that have it:
https://www.helius.dev/docs/llms.txt
https://vercel.com/docs/llms.txt
https://supabase.com/docs/llms.txt
```

**Use this instead of:**
- Context7 MCP (saves context window)
- Firecrawl scraping (faster, cleaner)
- Manual documentation reading (pre-formatted for LLMs)

**How to use:**

```bash
# Download llms.txt
curl https://docs.example.com/llms.txt -o /tmp/docs.txt

# In Claude
@/tmp/docs.txt use this documentation to implement X
```

### 3. Reusable Pattern Philosophy

From @omarsar0:

> "Early on, I spent time building reusable workflows/patterns. Tedious to build, but this had a wild compounding effect as models and agent harnesses improved."

**Invest in:**
- Subagents (delegate specialized work)
- Skills (codify best practices)
- Commands (quick workflow triggers)
- Planning patterns (structured approach)
- MCP tools (external integrations)
- Context engineering patterns (memory management)

**Why it compounds:**
- Works across model upgrades
- Transferable to other AI coding tools
- Improves with every use
- Reduces cognitive load over time
- **Investment in patterns > investment in specific model tricks**

### 4. Agent Orchestration Best Practices

#### Sub-Agent Context Problem

**The Issue:**
```
┌─────────────────┐
│  ORCHESTRATOR   │  "Go research how user auth works"
│  (knows WHY)    │  [Has full project context]
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SUB-AGENT     │  "Research user auth"
│  (no context)   │  [Doesn't know: for what project? what scale?
└────────┬────────┘                what constraints? what tech stack?]
         │
         ▼
    Returns summary (likely missing key details)
```

**The Fix:**

Pass **objective + context**, not just the query:

```markdown
BAD:
"Research user authentication"

GOOD:
"Research user authentication for:
- Next.js app with 10k+ users
- Using Supabase for backend
- Need: passwordless login + social auth
- Constraint: must work offline-first
- Key question: how to sync auth state offline?"
```

#### Iterative Retrieval Pattern

Never accept first agent response blindly:

```
1. Orchestrator dispatches agent with full context
2. Agent returns summary
3. Orchestrator evaluates: Is this sufficient?
   └─► NO: Ask follow-up questions (max 3 cycles)
   └─► YES: Accept and proceed
```

**Example:**

```
Orchestrator: "Research Next.js authentication patterns for offline-first app"

Agent: "Next.js supports NextAuth.js for authentication with various providers"

Orchestrator Evaluates: Too generic, missing offline-first aspect

Orchestrator: "Follow-up: How does NextAuth.js handle offline scenarios?
               What are alternatives that work offline-first?
               How do we sync auth state when coming back online?"

Agent: [Goes back, researches specific questions, returns detailed answer]

Orchestrator: Sufficient. Proceed.
```

#### Sequential Phase Pattern

Structure complex tasks with clear phases:

```markdown
## Phase 1: RESEARCH (Explore agent)
Input: Project requirements
Task: Gather context, identify patterns
Output: research-summary.md

## Phase 2: PLAN (Planner agent)
Input: research-summary.md
Task: Create implementation plan
Output: plan.md

## Phase 3: IMPLEMENT (TDD-guide agent)
Input: plan.md
Task: Write tests first, implement code
Output: Code changes

## Phase 4: REVIEW (Code-reviewer agent)
Input: All changes
Task: Review quality, security, performance
Output: review-comments.md

## Phase 5: VERIFY (Build-error-resolver if needed)
Input: Full codebase
Task: Run tests, fix issues
Output: All tests passing or loop back to Phase 3
```

**Key rules:**
- Each agent gets ONE clear input
- Each agent produces ONE clear output
- Outputs become inputs for next phase
- Never skip phases
- Use `/clear` between agents
- Store intermediate outputs in files (not just memory)

### 5. MCP Optimization: CLI + Skills Pattern

**Problem:** MCPs are convenient but expensive (context window + tokens)

**Solution:** For heavy operations, use CLI equivalents wrapped in skills

#### Example: GitHub Operations

**Instead of:** GitHub MCP (always loaded, eating context)

**Use:** `gh` CLI + custom skills

```bash
# Create skill: ~/.claude/skills/github-ops.md
```

```markdown
# GitHub Operations Skill

## Creating PR

Instead of using GitHub MCP, use CLI:

`bash
gh pr create --title "Feature: Add dark mode" --body "$(cat <<'EOF'
## Summary
- Implemented dark mode toggle
- Updated all components for theme support
- Added theme persistence

## Test Plan
- [ ] Toggle switches between themes
- [ ] Theme persists across sessions
- [ ] All components render correctly in both modes
EOF
)"
`

## Viewing PR

`bash
gh pr view 123
gh pr view --web  # Opens in browser
`

## Checking Status

`bash
gh pr status
gh pr checks
`

## Reviewing Code

`bash
gh pr diff 123
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please update tests"
`

## Benefits Over MCP

- No context window overhead
- Faster execution (direct CLI)
- Works offline (for local operations)
- More token efficient (no tool wrapping)
- Same functionality
```

#### When to Use MCP vs CLI + Skills

**Use MCP when:**
- Interactive exploration (browsing issues, PRs)
- Claude needs to make decisions based on live data
- Multiple related operations in conversation

**Use CLI + Skills when:**
- Single defined operation (create PR, deploy)
- Heavy data operations (avoid token costs)
- Batch operations
- You've already decided what to do

### 6. Context Window Health Check

Monitor and maintain context window health:

```bash
# Check current context usage
/statusline

# Should show: user | dir | branch | context% | model | time | todos

# If context > 70%:
# 1. Check active MCPs
/plugins

# 2. Disable unused MCPs (per-project)
# Edit ~/.claude.json:
{
  "projects": {
    "/path/to/project": {
      "disabledMcpServers": ["playwright", "cloudflare-docs", "clickhouse"]
    }
  }
}

# 3. Strategic compact
/compact

# 4. Start new session with summary
# Create session summary, /clear, load summary
```

**Rule of thumb:**
- Total context window: 200k tokens
- With 10+ MCPs enabled: Effectively 70k tokens
- With 5 MCPs enabled: Effectively 150k tokens
- Target: Keep context usage under 70% at all times

---

## Tips & Tricks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+U` | Delete entire line (faster than backspace) |
| `!` | Quick bash command prefix |
| `@` | Search for files |
| `/` | Initiate slash commands |
| `Shift+Enter` | Multi-line input |
| `Tab` | Toggle thinking display |
| `Esc Esc` | Interrupt Claude / restore code |

### Useful Commands

| Command | Purpose |
|---------|---------|
| `/fork` | Fork conversation for parallel work |
| `/rewind` | Go back to previous state |
| `/statusline` | Customize status bar (branch, context %, todos) |
| `/checkpoints` | File-level undo points |
| `/compact` | Manually trigger context compaction |
| `/rename` | Name current session |
| `/plugins` | Manage plugins and MCPs |
| `/mcp` | Quick MCP management |

### tmux for Long-Running Commands

Stream and watch logs/bash processes Claude runs:

```bash
# Create new tmux session
tmux new -s dev

# Claude runs commands here
# Detach: Ctrl+B, D

# Reattach later
tmux attach -t dev

# List sessions
tmux ls

# Split panes
Ctrl+B, %   # Split vertically
Ctrl+B, "   # Split horizontally

# Switch panes
Ctrl+B, arrow key

# Kill session
tmux kill-session -t dev
```

**Why use tmux:**
- Commands persist after detaching
- Monitor multiple processes simultaneously
- Prevents losing work if terminal closes
- Can share screen with others
- Attach from different terminals

### mgrep > ripgrep

`mgrep` is significantly better than ripgrep/grep:

```bash
# Install via plugin marketplace
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# Local search
mgrep "function handleSubmit"

# Web search
mgrep --web "Next.js 15 app router changes"

# Benefits:
# - ~50% more token efficient
# - Semantic search (understands meaning, not just keywords)
# - Web search built-in
# - Better results
```

### Editor Integration

#### Zed (Author's Preference)

Why Zed works well:
- **Agent Panel Integration**: Track Claude's file changes in real-time
- **Performance**: Rust-based, instant open, handles large codebases
- **CMD+Shift+R Command Palette**: Quick access to slash commands
- **Minimal Resource Usage**: Won't compete with Claude
- **Vim Mode**: Full vim keybindings available

**Setup:**
```bash
# Install Zed
brew install --cask zed

# Split screen: Terminal with Claude | Zed editor

# Quick file open: Ctrl+G
# Opens current file Claude is working on

# Enable auto-save
# Settings → Editor → Auto Save: on_focus_change
```

#### VSCode / Cursor

VSCode/Cursor also work well:

**Terminal format:**
```bash
# Run Claude in integrated terminal
# Auto-syncs with editor using \ide (enables LSP)
```

**Extension format:**
- More integrated UI
- Matching editor experience
- See: https://code.claude.com/docs/en/vs-code

### Sandboxing

```bash
# Risky operation? Use sandbox mode
# Claude runs in restricted environment
# Doesn't affect actual system

# To do the opposite (dangerous):
claude --dangerously-skip-permissions

# Let Claude roam free (use with caution!)
```

### GitHub Actions CI/CD

Set up automated PR reviews:

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Claude Review
        uses: anthropics/claude-code-review-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Custom Status Line

Shows user, directory, git branch with dirty indicator, context %, model, time, todo count:

```bash
# Configure statusline
/statusline

# Example output:
# affaan | ~/project | main* | 45% | sonnet | 2:30 PM | 3 todos
```

### Common Anti-Patterns to Avoid

**❌ Don't:** Create unnecessary .md files
- Hook-block all .md except README.md and CLAUDE.md

**❌ Don't:** Parallelize everything
- Only parallelize when genuinely beneficial
- Mental overhead increases faster than productivity

**❌ Don't:** Enable all MCPs
- Keep under 10 MCPs active per project
- Disable unused MCPs to preserve context

**❌ Don't:** Skip planning for complex tasks
- Use `/plan` or planner agent for multi-step features

**❌ Don't:** Ignore context window health
- Monitor context usage regularly
- Strategic compact at logical intervals

**❌ Don't:** Let dead code accumulate
- Regular `/refactor-clean` sessions
- Use hooks to prevent technical debt

**❌ Don't:** Forget to name sessions
- Use `/rename` for easy identification
- Especially important with git worktrees

---

## Resources

### Official Links

- **GitHub Repository**: https://github.com/affaan-m/everything-claude-code
- **Author**: [@affaanmustafa on Twitter](https://twitter.com/affaanmustafa)
- **Claude Code Docs**: https://code.claude.com/docs

### Related Tools

- **mgrep**: https://github.com/mixedbread-ai/mgrep
- **hookify plugin**: @claude-plugins-official/hookify
- **system-prompt-patches**: https://github.com/yk-is-here/system-prompt-patches

### Documentation References

- **Anthropic Evaluation Guide**: https://docs.anthropic.com/en/docs/build-with-claude/develop-tests
- **Claude API Pricing**: https://platform.claude.com/docs/en/about-claude/pricing
- **MCP Protocol**: https://modelcontextprotocol.io

### Community & Support

- **GitHub Issues**: Report bugs or request features at https://github.com/affaan-m/everything-claude-code/issues
- **Contributing**: PRs welcome for language-specific patterns, framework configs, domain knowledge
- **License**: MIT (free use, modification, and redistribution)

### Quick Start Checklist

- [ ] Install framework (plugin or manual)
- [ ] Configure CLAUDE.md (user or project level)
- [ ] Set up essential rules in `~/.claude/rules/`
- [ ] Configure MCPs (if needed), keep under 10 enabled
- [ ] Install key agents (planner, tdd-guide, code-reviewer)
- [ ] Set up memory persistence hooks
- [ ] Configure package manager with `/setup-pm`
- [ ] Create first session log template
- [ ] Test with simple task: `/tdd create hello world function`
- [ ] Monitor context window health
- [ ] Customize statusline with `/statusline`
- [ ] Set up tmux for background processes
- [ ] Install mgrep for better search

### Recommended Learning Path

1. **Week 1**: Basic setup
   - Install framework
   - Configure rules and CLAUDE.md
   - Use basic commands (/tdd, /plan, /code-review)
   - Get comfortable with single instance

2. **Week 2**: Memory & context
   - Set up session logging
   - Implement memory persistence hooks
   - Practice strategic compaction
   - Start continuous learning pattern

3. **Week 3**: Agents & skills
   - Use planner and tdd-guide agents
   - Create first custom skill
   - Practice agent orchestration
   - Set up verification loops

4. **Week 4**: Optimization & parallelization
   - Configure model selection per agent
   - Set up git worktrees
   - Practice parallel workflows
   - Optimize token usage

5. **Ongoing**: Refinement
   - Extract learned patterns to skills
   - Build project-specific agents
   - Tune verification harnesses
   - Share improvements with community

---

## Conclusion

**everything-claude-code** represents 10+ months of refined patterns for maximizing Claude Code's effectiveness. The framework's modular design means you can adopt components incrementally:

- **Start simple**: Install, configure rules, use basic commands
- **Add memory**: Implement session persistence and continuous learning
- **Scale up**: Add agents, optimize tokens, parallelize workflows
- **Refine**: Build project-specific patterns, tune verification loops

The key insight: **Investment in reusable patterns compounds over time.** As models improve, your workflows become more effective without changing them.

Don't try to use everything at once. Start with what solves your current pain points, then expand as you grow comfortable.

**The framework's philosophy:**
- Context window is precious (optimize ruthlessly)
- Memory prevents wasted work (persist across sessions)
- Verification catches issues early (automate quality checks)
- Patterns compound (invest in reusability)
- Simplicity wins (don't overcomplicate)

Happy coding with Claude!

---

*Last updated: 2026-01-23*
*Framework version: As of everything-claude-code main branch*
*Author: Affaan Mustafa (@affaanmustafa)*
*Guide compiled from: plugin.md, features-basic.md, features-advanced.md, and GitHub repository*
