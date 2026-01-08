# Claude Starter Kit CLI

> One-command Claude Code project setup with multi-domain support

## Installation

```bash
# Run directly with npx
npx claude-starter-kit

# Or install globally
npm install -g claude-starter-kit
```

## Usage

```bash
# Interactive mode (recommended)
npx claude-starter-kit

# Quick setup with defaults
npx claude-starter-kit init -y

# Use a preset
npx claude-starter-kit init --preset standard
```

## Commands

### `init` (default)

Initialize Claude Code configuration in your project.

**Options:**

| Option | Description |
|--------|-------------|
| `-y, --yes` | Use recommended defaults without prompts |
| `-p, --preset <preset>` | Use preset: `minimal`, `standard`, `full` |
| `-g, --global` | Install to `~/.claude/` (global) |
| `-l, --local` | Install to `./.claude/` (project, default) |
| `--no-install` | Skip skill installation |

## Presets

| Preset | Description |
|--------|-------------|
| `minimal` | Basic CLAUDE.md + memory structure |
| `standard` | + Self-evolving agent + Rules |
| `full` | + Software skills + Domain skills |

## What Gets Created

```
your-project/
├── CLAUDE.md              # Project entry point
├── .claude/
│   ├── rules/             # Auto-loaded rules
│   │   ├── code-quality.md
│   │   ├── testing.md
│   │   └── ...
│   ├── memory/            # Git-based experience memory
│   │   ├── index.md
│   │   ├── learnings/
│   │   ├── decisions/
│   │   └── ...
│   └── skills/            # Installed skills (via skillpkg)
└── skillpkg.json          # Skill dependencies
```

## Development

```bash
# Install dependencies
cd cli && npm install

# Build
npm run build

# Watch mode
npm run dev

# Test locally
npm run start
```

## Directory Structure

```
cli/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── commands/
│   │   └── init.ts        # Init command implementation
│   ├── domains/
│   │   └── index.ts       # Domain configurations
│   └── templates/         # File templates
├── dist/                  # Compiled output
├── package.json
└── tsconfig.json
```

## Related

- [claude-starter-kit](../) - Main project
- [skillpkg](https://github.com/miles990/skillpkg) - Skill package manager
- [self-evolving-agent](https://github.com/miles990/self-evolving-agent) - Autonomous agent skill
