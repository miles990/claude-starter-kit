# Skill Template (Claude Code 2.1.0+)

> 支援 Claude Code 2.1.0 新功能的 Skill 模板

## 基本模板

```markdown
---
schema: "1.0"
name: my-skill
version: 1.0.0
description: Skill description
triggers:
  - keyword1
  - keyword2
  - 中文觸發詞

# === 2.1.0 新功能 ===

# 執行上下文 (NEW)
context: fork              # fork = 隔離執行，不污染主 context

# 指定 Agent (NEW)
agent: general-purpose     # 可選：general-purpose, Bash, Explore, Plan

# YAML-style 權限列表 (NEW - 更清晰的語法)
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(npm *)           # 萬用字元權限 (NEW)
  - Bash(git *)
  - Task(Explore)

# Hooks 聲明 (NEW - 直接在 skill 中定義)
hooks:
  PreToolUse:
    - matcher: "Edit|Write"
      command: "echo 'File will be modified'"
  PostToolUse:
    - matcher: "Bash"
      command: "echo 'Command completed'"
      once: true          # 只執行一次 (NEW)
---

# My Skill

## Instructions

[Your skill instructions here...]

## Sharp Edges

### SE-001: [Warning Title]
- **Trigger**: When [condition]
- **Issue**: [What can go wrong]
- **Prevention**: [How to avoid]

## Validations

### V-001: [Check Name]
```bash
# Validation command
npm run lint
```

## Collaboration

### Delegates To
- `other-skill` - For [specific task]

### Accepts From
- `parent-skill` - Receives [context type]
```

## 新功能說明

### 1. `context: fork` (隔離執行)

```yaml
context: fork
```

- 在獨立的 sub-agent context 中執行
- 不會污染主對話的 context
- 適合需要大量探索的技能

### 2. `agent` 欄位 (指定執行者)

```yaml
agent: Explore  # 使用 Explore agent 執行
```

可選值：
- `general-purpose` - 通用代理
- `Bash` - 專注 shell 操作
- `Explore` - 代碼探索
- `Plan` - 規劃模式

### 3. YAML-style `allowed-tools`

**舊語法 (仍支援)：**
```yaml
allowed-tools: Read, Write, Edit, Bash(npm run *)
```

**新語法 (2.1.0+)：**
```yaml
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(npm run *)
  - Task(Explore)
```

### 4. 萬用字元權限

```yaml
allowed-tools:
  - Bash(npm *)        # 所有 npm 命令
  - Bash(git *)        # 所有 git 命令
  - Bash(docker *)     # 所有 docker 命令
```

### 5. Hooks 在 Skill 中

```yaml
hooks:
  PreToolUse:
    - matcher: "Edit|Write"
      command: "npx prettier --check $FILE"
  PostToolUse:
    - matcher: "Edit|Write"
      command: "npx prettier --write $FILE"
      once: true  # 只執行一次
  SubagentStart:    # 新 hook 類型
    - command: "echo 'Subagent starting...'"
```

### 6. 禁用特定 Agent

在 `settings.json` 中：
```json
{
  "permissions": {
    "deny": ["Task(SomeAgent)"]
  }
}
```

## Hot-Reload 說明

**2.1.0 重要更新：**

在 `~/.claude/skills` 或 `.claude/skills` 中修改的技能會**立即生效**，無需重啟 Claude Code！

這意味著：
- 技能開發迭代更快
- 修正問題後立即測試
- 新增技能無需重啟

## 完整範例

```markdown
---
schema: "1.0"
name: backend-api-generator
version: 2.0.0
description: 生成 RESTful API 的完整後端
triggers:
  - api
  - backend
  - rest
  - 後端
  - restful

context: fork
agent: general-purpose

allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(npm *)
  - Bash(npx *)
  - Task(Explore)

hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      command: "npx prettier --write $FILE 2>/dev/null || true"
---

# Backend API Generator

## Overview
Generates production-ready RESTful APIs with proper architecture.

## Instructions

1. Analyze requirements
2. Generate API structure
3. Implement endpoints
4. Add validation
5. Generate tests

## Sharp Edges

### SE-001: Missing Authentication
- **Trigger**: API endpoints without auth middleware
- **Issue**: Security vulnerability
- **Prevention**: Always add auth middleware to protected routes

## Validations

### V-001: TypeScript Compilation
```bash
npx tsc --noEmit
```

### V-002: Linting
```bash
npm run lint
```

## Collaboration

### Delegates To
- `database` - For schema design
- `testing-strategies` - For test generation

### Accepts From
- `product-management` - PRD context
```

## 相關文檔

- [Claude Code 2.1.0 Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Skill Enhancement Features](../docs/SHARP_EDGES_FORMAT.md)
- [skillpkg Usage](../.claude/rules/skillpkg-usage.md)
