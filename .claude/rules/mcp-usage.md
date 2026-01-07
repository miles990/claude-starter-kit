# MCP Server Usage Guide

## Available MCP Servers

This project comes with pre-configured MCP servers:

### 1. skillpkg - Skill Package Manager

Manages Claude skills installation and loading.

**Tools available:**
- `list_skills` - List installed skills
- `install_skill` - Install from GitHub/registry
- `load_skill` - Load skill instructions
- `recommend_skill` - Find relevant skills

**Usage example:**
```
# Search for a skill
recommend_skill({ query: "code review" })

# Install from GitHub
install_skill({ source: "github:user/repo" })

# Load and use
load_skill({ id: "skill-name" })
```

### 2. context7 - Documentation Lookup

Fetch up-to-date documentation for any library.

**Tools available:**
- `resolve-library-id` - Find library in Context7
- `query-docs` - Query documentation

**Usage example:**
```
# Find React documentation
resolve-library-id({ libraryName: "react", query: "hooks" })

# Query specific topic
query-docs({ libraryId: "/facebook/react", query: "useEffect cleanup" })
```

## When to Use MCP

| Situation | MCP to Use |
|-----------|------------|
| Need to learn new skill | skillpkg → recommend → install |
| Unsure about API usage | context7 → query-docs |
| Setting up new tool | context7 for latest docs |

## Adding Custom MCP Servers

Edit `.mcp.json` to add more servers:

```json
{
  "mcpServers": {
    "your-server": {
      "command": "npx",
      "args": ["-y", "your-mcp-package"],
      "description": "What this server does"
    }
  }
}
```

## Troubleshooting

If MCP tools not available:
1. Check `.mcp.json` syntax
2. Restart Claude Code session
3. Verify package is accessible via npx
