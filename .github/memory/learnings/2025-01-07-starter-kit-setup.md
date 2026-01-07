---
date: 2025-01-07
tags: [setup, memory, claude-code, starter-kit]
task: Set up Claude starter kit with memory system
status: resolved
---

# Claude Starter Kit Initial Setup

## Context

Setting up a scaffold project demonstrating Claude Code best practices with integrated memory system.

## Key Learnings

### 1. Memory Architecture (Dual-Layer)

```
.claude/           <- Claude Code native (auto-loaded)
├── rules/         <- Path-specific rules
└── skills/        <- Installed skills

.github/memory/    <- Custom experience memory
├── learnings/     <- What worked
├── failures/      <- What didn't work
├── decisions/     <- Why we chose this
├── patterns/      <- How to think
└── strategies/    <- What to try
```

### 2. Rule File Format

Use frontmatter `paths:` to target specific files:

```markdown
---
paths: src/**/*.ts
---
# Rules that only apply to TypeScript files
```

### 3. Import Syntax

Reference other files with `@path`:
```markdown
See @README.md for details
Import rules from @.claude/rules/testing.md
```

## Verification

- [x] CLAUDE.md created and readable
- [x] Rules load correctly
- [x] Memory structure initialized
- [x] Skills integrated

## Related Files

- `/CLAUDE.md`
- `/.claude/rules/*.md`
- `/.github/memory/index.md`
