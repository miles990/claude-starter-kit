---
number: 1
title: Memory Architecture Decision
date: 2025-01-07
status: accepted
tags: [architecture, memory, decision]
---

# ADR 001: Dual-Layer Memory Architecture

## Status

Accepted

## Context

Claude Code provides a native memory system via `.claude/` directory. However, the self-evolving-agent skill uses `.claude/memory/` for structured experience storage. We need to decide how to combine these.

## Decision

Adopt a **dual-layer architecture**:

| Layer | Location | Purpose | Auto-loaded |
|-------|----------|---------|-------------|
| Native Config | `.claude/` | Rules, skills, preferences | Yes |
| Experience Memory | `.claude/memory/` | Learnings, failures, decisions | No (manual search) |

## Rationale

1. **Separation of Concerns**
   - `.claude/` = How Claude should behave (prescriptive)
   - `.claude/memory/` = What Claude has learned (descriptive)

2. **Auto-loading vs. On-demand**
   - Rules should always apply (auto-load)
   - Experiences should be searched when relevant (on-demand)

3. **Git Integration**
   - Both are version controlled
   - Experience memory changes can be reviewed in PRs

4. **Cross-tool Compatibility**
   - `.claude/` is Claude Code specific
   - `.claude/memory/` works with any tool (Copilot, Cursor)

## Consequences

### Positive
- Clear mental model for users
- Rules always enforced
- Experiences don't bloat context

### Negative
- Must remember to search memory before tasks
- Two locations to maintain

### Mitigations
- Add checkpoint rules requiring memory search
- Include search examples in index.md
