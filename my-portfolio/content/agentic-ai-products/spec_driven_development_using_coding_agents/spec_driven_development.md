---
title: "Spec-Driven Development with Coding Agents"
summary: "A structured methodology where specifications serve as the source of truth for both humans and AI coding agents"
date: "2025-12-21"
category: "Development Methodology"
---

Spec-Driven Development (SDD) is an emerging methodology where a structured specification (typically in Markdown) is created before writing code. The spec serves as a shared "source of truth" for both humans and AI coding agents, bringing rigor and context to AI-assisted coding while avoiding ad-hoc "prompt-by-prompt" development.

## Why Spec-Driven Development?

| Benefit | Impact |
|---------|--------|
| **Structured Workflow** | Enforces discipline on AI code generation through clear phases |
| **Productivity Gains** | Studies show structured AI workflows cut task completion time by 50%+ |
| **Human Oversight** | Multiple frameworks include human-gated review stages |
| **Better Context** | Specifications provide AI agents with clear requirements and acceptance criteria |

---

## Framework Comparison

| Framework | Architecture | Spec Format | Integration | Best For |
|-----------|--------------|-------------|-------------|----------|
| **BMAD Method** | Multi-agent orchestration (Analyst, Architect, Dev, QA) | Multiple MD docs (PRD, architecture, stories) | CLI/NPM package | Greenfield projects, complex features |
| **GitHub Spec-Kit** | Single-agent guided workflow with human-gated stages | 4-stage pipeline + constitution.md | CLI + VS Code extension | Enterprise workflows, well-defined features |
| **AWS Kiro** | Integrated IDE with embedded multi-agent AI | Auto-generates Requirements.md, Design.md, Tasks.md | Full IDE (VS Code fork) | All-in-one AI development environment |
| **Tessl** | CLI + MCP server for spec-as-source autonomy | Custom MD with tags (@generate, @test) | CLI + MCP server | Module refactoring, spec-anchored iteration |
| **OpenSpec** | Lightweight CLI, single-agent assisted | Plain Markdown focusing on incremental change | Node.js CLI | Legacy codebase maintenance, brownfield work |
| **PromptX/AgentOS** | Flexible agent orchestration platform | Conversational commands + memory | MCP server (JS/TS) | Context-rich AI collaboration, custom personas |
| **Claude Autonomous** | Two-agent pattern (Initializer + Coder) | Simple feature list or backlog | Python + Claude Agent SDK | Experimental, small-scale prototyping |

---

## Agent Autonomy Spectrum

<div style="margin: 2rem 0;">

| Level | Framework | Description |
|-------|-----------|-------------|
| **Fully Autonomous** | Claude Autonomous Agent | Minimal human input; agents drive end-to-end |
| **Highly Automated** | AWS Kiro | Agents autonomously generate/maintain specs in background |
| **Spec-as-Source** | Tessl | Specs are the primary artifact; code is compiled from specs |
| **Human-Guided** | BMAD, Spec-Kit, OpenSpec | Each phase includes developer review |
| **Conversational** | PromptX | Free-form dialogue with specialized AI personas |

</div>

---

## Key Methodologies

### BMAD Method (Phase-Based Approach)

**Phase 1: Agentic Planning**
- AI generates PRD, architecture docs, user stories
- Multi-role simulation (Analyst, PM, Architect, Scrum Master)

**Phase 2: Context-Engineered Development**
- AI breaks stories into tasks
- Implements code with full context

### Spec-Kit (4-Stage Pipeline)

| Stage | Action | Output |
|-------|--------|--------|
| 1. Specify | Write high-level requirements | Requirements doc |
| 2. Plan | AI produces design/tech plan | Technical design |
| 3. Tasks | AI breaks down into implementation tasks | Task list |
| 4. Implement | AI writes code task-by-task | Working code |

### OpenSpec (Lightweight Approach)

1. Draft Change Proposal
2. Review & Align
3. Implement Tasks
4. Archive

*Optimized for incremental changes to existing codebases.*

---

## When to Use Each Framework

| Scenario | Recommended Framework |
|----------|----------------------|
| New project from scratch | BMAD Method |
| Enterprise feature development | GitHub Spec-Kit |
| Full AI-native development environment | AWS Kiro |
| Refactoring existing modules | Tessl |
| Maintaining legacy codebase | OpenSpec |
| Exploratory prototyping | Claude Autonomous |
| Custom agent workflows | PromptX/AgentOS |

---

## Challenges & Considerations

| Challenge | Mitigation |
|-----------|------------|
| **Documentation Overhead** | Start with minimal viable specs; add detail iteratively |
| **Context Misses** | Use structured templates; validate AI understanding before coding |
| **Waterfall-like Formality** | Adopt lightweight variants (OpenSpec) for fast-moving projects |
| **Tool Lock-in** | Choose agent-agnostic formats (plain Markdown) |

---

## Key Takeaways

1. **Specs as Contracts**: Treat specifications as contracts between human intent and AI execution
2. **Phase Gates Matter**: Human review at each phase prevents compounding errors
3. **Match to Project Type**: Greenfield vs brownfield projects need different frameworks
4. **Start Simple**: Begin with lightweight specs, add structure as complexity grows
5. **Iterate on Methodology**: The best SDD process is one you'll actually follow

---

## Industry Outlook

- GitHub and AWS investment signals strong industry confidence in SDD approaches
- Hybrid approaches are emerging, blending human creativity with AI speed
- Future IDEs may have built-in AI project managers
- Clear specifications are becoming the foundation of development processes
