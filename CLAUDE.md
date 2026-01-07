# Claude Starter Kit

> A well-configured starter project showcasing Claude Code Memory best practices and skill integration.

## Project Overview

This is a scaffold project demonstrating how to set up:
- **Claude Code Memory System** - Multi-layered memory architecture
- **Modular Rules** - Path-specific rules in `.claude/rules/`
- **Skill Integration** - Self-evolving agent + Software skills via [skillpkg](https://github.com/miles990/skillpkg)
- **Git-based Experience Memory** - Structured learning in `.github/memory/`

## Quick Reference

### Skill Management (skillpkg)

```bash
skillpkg search "query"      # Search skills
skillpkg install user/repo   # Install skill
skillpkg list                # Show installed
skillpkg sync                # Sync to Claude Code
```

### Available Skills
- `@.claude/skills/self-evolving-agent/SKILL.md` - Autonomous goal achievement
- `@.claude/skills/software-skills/` - 47 software development skills

### Memory System
- `@.github/memory/index.md` - Quick index of all memories
- Use `/evolve [goal]` to trigger self-evolving loop
- Use `/memory` to edit memory files

### Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests

# Skills
skillpkg install     # Install from skillpkg.json
skillpkg sync        # Sync to platforms

# Git
git status           # Check changes
git add . && git commit -m "message"  # Commit changes
```

## Rules Structure

```
.claude/rules/
├── code-quality.md      # Code quality standards
├── testing.md           # Testing requirements
├── memory-management.md # How to manage memories
└── evolve-workflow.md   # Self-evolving workflow rules
```

## Getting Started

1. Fork this repository
2. Run `/init` if you want to customize CLAUDE.md
3. Use `/evolve [your goal]` to start autonomous development
4. Check `.github/memory/` for accumulated learnings

## Project Structure

```
.
├── CLAUDE.md              # This file - project entry point
├── .claude/
│   ├── rules/             # Modular rules (auto-loaded)
│   └── skills/            # Installed skills
├── .github/
│   └── memory/            # Git-based experience memory
│       ├── index.md       # Quick index
│       ├── learnings/     # Successful solutions
│       ├── decisions/     # Architecture decisions (ADR)
│       ├── failures/      # Lessons learned
│       ├── patterns/      # Reusable reasoning patterns
│       └── strategies/    # Task-specific strategies
└── src/                   # Your application code
```
