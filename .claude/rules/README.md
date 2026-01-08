# Claude Rules

> 路徑特定規則，自動載入到 Claude Code context

## 概念

Claude Code 會自動讀取 `.claude/rules/` 目錄下的所有 `.md` 文件，作為專案特定指令。

## 現有規則

| 文件 | 用途 |
|------|------|
| `code-quality.md` | 代碼品質標準 |
| `testing.md` | 測試要求 |
| `memory-management.md` | Memory 系統使用方式 |
| `evolve-workflow.md` | /evolve 工作流程 |
| `skillpkg-usage.md` | skillpkg 使用指南 |
| `mcp-usage.md` | MCP Server 使用指南 |

## 規則載入

規則在以下情況自動載入：
- 開啟專案目錄時
- Claude Code 開始新對話時

## 自定義規則

創建新的 `.md` 文件到此目錄即可：

```bash
# 例如添加 API 設計規則
touch .claude/rules/api-guidelines.md
```

## 規則格式

```markdown
# 規則標題

## 何時應用
描述這個規則在什麼情況下適用

## 必須做
- 要求 1
- 要求 2

## 禁止做
- 禁止項 1
- 禁止項 2
```

## 相關文檔

- [CLAUDE.md](../../CLAUDE.md) - 專案入口
- [Memory 管理](memory-management.md) - Memory 系統規則
