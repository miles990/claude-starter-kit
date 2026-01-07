# skillpkg 使用指南

> skillpkg 是專業的 AI 代理技能管理工具，支援 CLI 和 MCP Server 雙模式

## 概念

### SKILL.md 標準

技能以 Markdown + YAML frontmatter 格式定義：

```markdown
---
name: my-skill
version: 1.0.0
description: What this skill does
dependencies:
  skills:
    - other-skill
  mcp:
    - some-mcp-server
---

# Skill Instructions

Your skill content here...
```

### 技能範圍

| 範圍 | 位置 | 用途 |
|------|------|------|
| local | `.skillpkg/` | 專案特定技能 |
| global | `~/.skillpkg/` | 跨專案共享 |

## CLI 命令

### 搜尋技能

```bash
# 搜尋 GitHub 和 awesome-lists
skillpkg search "code review"

# 只搜尋本地已安裝
skillpkg search "test" --source=local
```

### 安裝技能

```bash
# 從 GitHub
skillpkg install miles990/self-evolving-agent

# 從 GitHub 子目錄
skillpkg install github:miles990/claude-software-skills#skills/backend

# 從 Gist
skillpkg install gist:abc123def

# 從 URL
skillpkg install https://example.com/skill/SKILL.md

# 安裝到全域
skillpkg install miles990/repo --scope=global
```

### 管理技能

```bash
# 列出已安裝
skillpkg list

# 查看技能詳情
skillpkg info self-evolving-agent

# 載入技能（查看 instructions）
skillpkg load self-evolving-agent

# 移除技能
skillpkg uninstall some-skill
```

### 同步到平台

```bash
# 同步到所有支援的平台
skillpkg sync

# 只同步到 Claude Code
skillpkg sync --target=claude-code

# 預覽（不實際執行）
skillpkg sync --dry-run
```

## MCP Server 工具

當 skillpkg MCP Server 啟用時，AI 代理可以自主使用這些工具：

### 可用工具

| 工具 | 用途 |
|------|------|
| `list_skills` | 列出已安裝技能 |
| `load_skill` | 載入技能 instructions |
| `install_skill` | 安裝新技能 |
| `search_skills` | 搜尋可用技能 |
| `recommend_skill` | 根據任務推薦技能 |
| `uninstall_skill` | 移除技能 |
| `sync_skills` | 同步到平台 |

### 自主學習流程

```
Agent 遇到未知任務
        │
        ▼
┌───────────────────────┐
│ recommend_skill       │
│ "我需要做 X，推薦什麼？"│
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ install_skill         │
│ 安裝推薦的技能        │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ load_skill            │
│ 載入並學習 instructions│
└───────────────────────┘
        │
        ▼
應用新技能完成任務
```

## 與 Self-Evolving Agent 整合

Self-evolving agent 在 Phase 1.5（能力評估）時會自動使用 skillpkg：

```markdown
能力評估：
- 需要：後端 API 開發知識
- 搜尋：recommend_skill({ query: "backend API development" })
- 安裝：install_skill({ source: "miles990/claude-software-skills#backend" })
- 載入：load_skill({ id: "backend" })
- 應用：使用新學到的知識完成任務
```

## 配置檔案

### skillpkg.json

專案根目錄的技能配置：

```json
{
  "name": "my-project",
  "skills": {
    "self-evolving-agent": {
      "source": "github:miles990/self-evolving-agent",
      "version": "^3.3.0"
    }
  },
  "sync": {
    "targets": ["claude-code", "cursor"],
    "autoSync": true
  }
}
```

### 版本語法

- `"latest"` - 最新版本
- `"^1.0.0"` - 相容的最新版本（1.x.x）
- `"~1.0.0"` - 小版本更新（1.0.x）
- `"1.0.0"` - 精確版本

## 最佳實踐

### DO

- 使用 skillpkg 管理所有技能（而非手動複製）
- 在 skillpkg.json 中聲明依賴
- 定期 `skillpkg sync` 同步到平台
- 版本鎖定重要的技能

### DON'T

- 直接修改 .claude/skills/ 中的檔案
- 忘記同步（技能會不一致）
- 使用過於寬鬆的版本約束
