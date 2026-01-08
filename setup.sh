#!/bin/bash
# Claude Starter Kit - One Command Setup
# Usage: curl -fsSL https://raw.githubusercontent.com/miles990/claude-starter-kit/main/setup.sh | bash

set -e

echo "🚀 Setting up Claude Starter Kit..."

# Check if in a git repo, if not initialize
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialized"
fi

# Create directory structure
mkdir -p .claude/memory/{learnings,decisions,failures,patterns,strategies,discoveries,skill-metrics}
mkdir -p .claude/rules
mkdir -p .claude/skills
mkdir -p docs

echo "✅ Directory structure created"

# Create CLAUDE.md if not exists
if [ ! -f "CLAUDE.md" ]; then
cat > CLAUDE.md << 'CLAUDEMD'
# My Project

> Powered by Claude Starter Kit

## Quick Start

```
/evolve [your goal]    # Start autonomous development
```

## Memory System

All learnings stored in `.claude/memory/` - searchable with:
```
Grep pattern="keyword" path=".claude/memory/"
```

## Available Skills

Run `skillpkg list` to see installed skills.
CLAUDEMD
echo "✅ CLAUDE.md created"
fi

# Create memory index
cat > .claude/memory/index.md << 'INDEXMD'
# Project Memory Index

> Auto-maintained. Search: `Grep pattern="keyword" path=".claude/memory/"`

## Metadata
| Field | Value |
|-------|-------|
| Created | $(date +%Y-%m-%d) |
| Entries | 0 |

## Learnings
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## Decisions
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## Failures
<!-- FAILURES_START -->
<!-- FAILURES_END -->
INDEXMD
echo "✅ Memory index created"

# Create .gitignore additions
if [ -f ".gitignore" ]; then
    if ! grep -q ".claude/skills/" .gitignore 2>/dev/null; then
        echo -e "\n# Claude Code\n.claude/skills/\n.skillpkg/" >> .gitignore
    fi
else
    echo -e "# Claude Code\n.claude/skills/\n.skillpkg/" > .gitignore
fi
echo "✅ .gitignore updated"

# Create skillpkg.json
cat > skillpkg.json << 'SKILLPKG'
{
  "name": "my-project",
  "skills": {
    "self-evolving-agent": "github:miles990/self-evolving-agent"
  }
}
SKILLPKG
echo "✅ skillpkg.json created"

# Install skillpkg and skills if npm available
if command -v npm &> /dev/null; then
    if ! command -v skillpkg &> /dev/null; then
        echo "📦 Installing skillpkg..."
        npm install -g skillpkg 2>/dev/null || echo "⚠️ Run 'npm install -g skillpkg' manually"
    fi

    # Install evolve skill directly from GitHub
    echo "📦 Installing evolve skill..."
    mkdir -p .claude/skills/evolve
    curl -fsSL "https://raw.githubusercontent.com/miles990/self-evolving-agent/main/SKILL.md" \
        -o .claude/skills/evolve/SKILL.md 2>/dev/null || true

    if [ -f ".claude/skills/evolve/SKILL.md" ]; then
        echo "✅ Evolve skill installed"
    else
        echo "⚠️ Could not download skill. Run: skillpkg install miles990/self-evolving-agent"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Open this folder in Claude Code"
echo "  2. Type: /evolve [your goal]"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
