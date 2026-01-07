/**
 * Built-in templates (core functionality)
 *
 * These templates are built into the CLI for offline support.
 */

export const TEMPLATES = {
  claudeMd: (projectName: string) => `# ${projectName}

> Project configured with Claude Starter Kit

## Quick Reference

- \`/evolve [goal]\` - Trigger self-evolving agent
- \`/memory\` - Edit memory files
- \`skillpkg list\` - Show installed skills

## Project Structure

See @.claude/rules/ for coding standards.
See @.claude/memory/index.md for project knowledge.
`,

  codeQuality: `---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Code Quality Standards

- Write clean, readable code with meaningful names
- Follow DRY principle
- Keep functions small and focused
- Handle errors explicitly
`,

  testing: `---
paths: **/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}
---

# Testing Standards

- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Minimum 80% coverage for new code
`,

  memoryManagement: `# 記憶管理

> 完整指南請使用 \`/evolve\` skill

## 何時建立記憶

| 類型 | 時機 |
|------|------|
| **learnings/** | 解決非平凡問題 |
| **failures/** | Bug 花 >30min 才解決 |
| **decisions/** | 架構決策 (ADR) |
| **patterns/** | 可複用的推理模式 |
| **strategies/** | 任務策略與成功率 |

## 記憶工作流程

1. 任務開始前搜尋：\`Grep pattern="關鍵字" path=".claude/memory/"\`
2. 學習後建立記憶檔案
3. 更新 index.md 索引
`,

  evolveWorkflow: `# Self-Evolving Workflow

> 完整指南請使用 \`/evolve\` skill，此為快速參考

## 強制檢查點（Quick Reference）

| 時機 | 動作 |
|------|------|
| 任務前 | \`Grep pattern="關鍵字" path=".claude/memory/"\` |
| 變更後 | 執行 build + test |
| Milestone 後 | 確認目標方向 |

## 失敗處理

1. 診斷類型：知識缺口 / 執行錯誤 / 環境問題 / 策略錯誤 / 資源限制
2. 記錄到 \`.claude/memory/failures/\`
3. 嘗試備選策略
4. 3 次失敗後詢問用戶

詳細說明：\`/evolve help\` 或 \`skillpkg load evolve\`
`,

  mcpJson: JSON.stringify(
    {
      mcpServers: {
        skillpkg: {
          command: 'npx',
          args: ['-y', 'skillpkg-mcp-server'],
        },
        context7: {
          command: 'npx',
          args: ['-y', '@anthropic-ai/claude-code-mcp-context7'],
        },
      },
    },
    null,
    2
  ),

  settingsJson: JSON.stringify(
    {
      permissions: {
        allow: ['Bash(npm:*)', 'Bash(git:*)', 'Read', 'Write', 'Edit', 'Glob', 'Grep'],
      },
    },
    null,
    2
  ),

  memoryIndex: `# 專案記憶索引

> 搜尋：\`Grep pattern="關鍵字" path=".claude/memory/"\`

## 最近學習
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## 重要決策
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## 失敗經驗
<!-- FAILURES_START -->
<!-- FAILURES_END -->

## 推理模式
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->

## 策略記錄
<!-- STRATEGIES_START -->
<!-- STRATEGIES_END -->

## 標籤索引
<!-- TAGS_START -->
<!-- TAGS_END -->
`,

  // Hooks configuration (Boris Tips #9, #12)
  hooksConfig: JSON.stringify(
    {
      hooks: {
        PostToolUse: [
          {
            matcher: 'Write|Edit',
            hooks: [
              {
                type: 'command',
                command: 'npx prettier --write "$CLAUDE_FILE_PATH" 2>/dev/null || true',
              },
            ],
          },
        ],
        Stop: [
          {
            matcher: '',
            hooks: [
              {
                type: 'command',
                command: 'echo "Task completed at $(date)"',
              },
            ],
          },
        ],
      },
    },
    null,
    2
  ),
};
