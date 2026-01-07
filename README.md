# Claude Starter Kit

[![npm](https://img.shields.io/npm/v/claude-starter-kit)](https://www.npmjs.com/package/claude-starter-kit)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Domain Skills](https://img.shields.io/badge/domains-18-orange)](https://github.com/miles990/claude-domain-skills)

> A well-configured scaffold project demonstrating Claude Code Memory best practices, skill integration, and autonomous development workflows.

## Why This Project?

Setting up Claude Code for optimal productivity requires understanding multiple systems:
- **Memory layers** (CLAUDE.md, rules, local settings)
- **Skill integration** (installing and using skills)
- **MCP servers** (extending capabilities)
- **Experience memory** (learning from past work)

This starter kit provides a **ready-to-use template** with all these configured.

## Features

| Feature | Description |
|---------|-------------|
| **Dual-Layer Memory** | Native `.claude/` + Custom `.github/memory/` |
| **Modular Rules** | Path-specific rules in `.claude/rules/` |
| **Skill Integration** | Self-evolving agent + Software skills |
| **MCP Pre-configured** | skillpkg + context7 ready |
| **Sample Memories** | Examples of learnings, decisions, patterns |

## Quick Start

### Option A: Initialize Any Project (Recommended)

Use `skillpkg init` to add Claude Code configuration to **any existing project**:

```bash
# Navigate to your project
cd your-project

# One-liner setup with auto-install
npx skillpkg-cli init --preset=standard --install

# Or interactive mode (prompts for options)
npx skillpkg-cli init
```

**Presets:**
| Preset | Includes |
|--------|----------|
| `minimal` | CLAUDE.md + basic rules |
| `standard` | + Memory system + self-evolving agent |
| `full` | + Software skills (47 modules) |

**Options:**
```bash
-p, --preset <preset>    # minimal, standard, full, custom
-d, --domain <domain>    # frontend, backend, fullstack, devops, quant-trading, finance...
-i, --install            # Auto-install skills after init
-y, --yes                # Skip prompts, use defaults
```

**Domain Skills (18 available):**

When selecting domains, the CLI automatically includes matching domain skills:

| Category | Available Domains |
|----------|-------------------|
| 💼 Business | marketing, sales, product, project-management, strategy |
| 💰 Finance | quant-trading, finance |
| 🎨 Creative | game-design, ui-ux, content, brand, brainstorming, storytelling, visual-media |
| 🔬 Professional | research, knowledge-management |
| 🌱 Lifestyle | personal-growth, side-income |

These skills have `triggers` for auto-detection with `/evolve`.

### Option B: Fork This Template

```bash
# Fork this repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/claude-starter-kit.git
cd claude-starter-kit

# Install skills
npx skillpkg-cli install
```

### Start Using

Open the project in Claude Code:
```bash
claude
```

Try these commands:
```bash
# Trigger self-evolving agent
/evolve Build a REST API with user authentication

# Edit memory files
/memory

# Search past experiences
Grep pattern="authentication" path=".github/memory/"
```

## Project Structure

```
claude-starter-kit/
├── CLAUDE.md                    # Project entry point (auto-loaded)
├── .mcp.json                    # MCP server configuration
│
├── .claude/
│   ├── settings.json            # Permissions and environment
│   ├── rules/                   # Modular rules (auto-loaded)
│   │   ├── code-quality.md      # Code standards
│   │   ├── testing.md           # Test requirements
│   │   ├── memory-management.md # Memory usage rules
│   │   ├── evolve-workflow.md   # Self-evolving rules
│   │   └── mcp-usage.md         # MCP guide
│   └── skills/                  # Installed skills
│       ├── self-evolving-agent/ # (after install)
│       └── software-skills/     # (after install)
│
├── .github/
│   └── memory/                  # Git-based experience memory
│       ├── index.md             # Quick index (search here first)
│       ├── learnings/           # Successful solutions
│       ├── decisions/           # Architecture Decision Records
│       ├── failures/            # Lessons learned
│       ├── patterns/            # Reusable reasoning
│       └── strategies/          # Task-specific approaches
│
├── scripts/
│   └── install-skills.sh        # Skill installation script
│
└── src/                         # Your application code
```

## Memory System Explained

### Layer 1: Claude Code Native (`.claude/`)

**Auto-loaded** every session:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project overview, quick reference |
| `.claude/rules/*.md` | Path-specific rules |
| `.claude/settings.json` | Permissions, environment |

### Layer 2: Experience Memory (`.github/memory/`)

**On-demand** - search when needed:

| Directory | When to Use |
|-----------|-------------|
| `learnings/` | Found a solution? Document it |
| `decisions/` | Made architectural choice? ADR it |
| `failures/` | Hit a wall? Record for future |
| `patterns/` | Found reusable approach? Template it |
| `strategies/` | Built strategy pool? Share it |

### Memory Workflow

```
Before Starting Task
        │
        ▼
┌───────────────────┐
│ Search Memory     │
│ Grep "keyword"    │
│ .github/memory/   │
└───────────────────┘
        │
        ▼
  Found relevant? ──Yes──► Apply knowledge
        │
        No
        │
        ▼
   Do the task
        │
        ▼
┌───────────────────┐
│ After Completion  │
│ Create memory if  │
│ learned something │
└───────────────────┘
```

## Using the Self-Evolving Agent

The `/evolve` command triggers autonomous goal achievement:

```bash
/evolve [your goal description]
```

### Example

```bash
/evolve Create a CLI tool that converts markdown to PDF with syntax highlighting
```

The agent will:
1. **Analyze** - Break goal into sub-tasks
2. **Assess** - Check what skills are needed
3. **Acquire** - Learn missing skills (via WebSearch, skillpkg)
4. **Execute** - PDCA loop (Plan-Do-Check-Act)
5. **Remember** - Store experiences in `.github/memory/`

### Stop Conditions

| Condition | Action |
|-----------|--------|
| Goal achieved | Success |
| Max 10 iterations | Pause, report |
| 3 same errors | Ask user |
| User stops | Save and exit |

## MCP Servers

Pre-configured in `.mcp.json`:

### skillpkg ([github.com/miles990/skillpkg](https://github.com/miles990/skillpkg))

AI-native skill management - enables autonomous learning:

```javascript
// Recommend skills for a task
recommend_skill({ query: "code review" })

// Install skill
install_skill({ source: "github:user/repo" })

// Load skill instructions
load_skill({ id: "skill-name" })

// Search available skills
search_skills({ query: "testing", source: "github" })

// Sync to platforms
sync_skills({ target: "claude-code" })
```

### context7
```javascript
// Look up library docs
resolve-library-id({ libraryName: "react" })
query-docs({ libraryId: "/facebook/react", query: "useEffect" })
```

## Skill Management with skillpkg

This project uses [skillpkg](https://github.com/miles990/skillpkg) for professional skill management.

### CLI Commands

```bash
# Search for skills
skillpkg search "backend api"

# Install from various sources
skillpkg install miles990/self-evolving-agent
skillpkg install github:user/repo#skills/my-skill
skillpkg install gist:abc123

# Manage skills
skillpkg list                    # Show installed
skillpkg info <skill>            # Show details
skillpkg load <skill>            # View instructions

# Sync to platforms
skillpkg sync                    # All platforms
skillpkg sync --target=claude-code
```

### skillpkg.json

Declare skill dependencies in `skillpkg.json`:

```json
{
  "skills": {
    "self-evolving-agent": {
      "source": "github:miles990/self-evolving-agent",
      "version": "^3.3.0"
    }
  }
}
```

## Customization

### Adding Your Own Rules

Create `.claude/rules/your-rule.md`:

```markdown
---
paths: src/api/**/*.ts
---

# API Development Rules

- All endpoints need input validation
- Return consistent error format
- Add OpenAPI documentation
```

### Adding Memory Entries

After solving a problem:

```bash
# Create learning file
echo "---
date: $(date +%Y-%m-%d)
tags: [tag1, tag2]
task: What you were doing
status: resolved
---

# Title

## Context
...

## Solution
...
" > .github/memory/learnings/$(date +%Y-%m-%d)-slug.md

# Update index.md
```

### Adding MCP Servers

Edit `.mcp.json`:

```json
{
  "mcpServers": {
    "your-server": {
      "command": "npx",
      "args": ["-y", "your-mcp-package"]
    }
  }
}
```

## Best Practices

### DO

- Search memory before starting related tasks
- Create memories immediately after learning
- Use specific tags for easy searching
- Review and curate memories monthly
- Keep rules focused and path-specific

### DON'T

- Ignore existing memories
- Create vague, untagged entries
- Let memories become stale
- Put everything in one big rule file
- Skip memory search "to save time"

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make changes
4. Update relevant documentation
5. Submit a pull request

## Related Projects

| Project | Description |
|---------|-------------|
| [self-evolving-agent](https://github.com/miles990/self-evolving-agent) | Autonomous goal achievement skill with PDCA loop |
| [claude-domain-skills](https://github.com/miles990/claude-domain-skills) | 16 non-technical domain skills |
| [claude-software-skills](https://github.com/miles990/claude-software-skills) | 47 software development skills |
| [skillpkg](https://github.com/miles990/skillpkg) | Skill package manager for Claude Code |

## License

MIT
