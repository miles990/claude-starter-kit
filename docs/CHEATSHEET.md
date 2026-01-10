# Command Cheatsheet

> 常用指令速查表

## Claude Code 內建指令

| 指令 | 說明 |
|------|------|
| `/help` | 顯示幫助 |
| `/clear` | 清空對話 |
| `/compact` | 壓縮上下文 |
| `/config` | 開啟設定 |
| `/permissions` | 管理權限 |

## Claude Code 2.1.0+ 新功能

### Skill Hot-Reload
`.claude/skills/` 內的變更會即時生效，不需重啟。

### Hooks in Skill Frontmatter
```yaml
---
name: my-skill
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      command: "npx prettier --write $FILE"
      once: true  # 只執行一次
---
```

### Context Fork（隔離執行）
```yaml
---
context: fork  # 子代理獨立上下文，不影響主對話
agent: general-purpose
---
```

### YAML-style Allowed Tools
```yaml
---
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(npm *)      # 萬用字元
  - Bash(git *)
  - Grep
---
```

### 新 Hook 類型
| Hook | 觸發時機 |
|------|----------|
| `SubagentStart` | 子代理啟動時 |
| `PostToolUse` | 工具執行後 |
| `PreToolUse` | 工具執行前 |
| `Stop` | Agent 停止時 |

## Self-Evolving Agent

| 指令 | 說明 | 範例 |
|------|------|------|
| `/evolve [目標]` | 自我進化完成目標 | `/evolve 建立 REST API` |
| `/evolve [目標] --explore` | 探索模式 | `/evolve 優化效能 --explore` |
| `/evolve [目標] --emergence` | 涌現模式（跨領域連結） | `/evolve 重構架構 --emergence` |

## Skill 管理（MCP Tools）

在 Claude Code 對話中使用：

```
# 搜尋技能
幫我搜尋 frontend 相關的技能

# 推薦技能
根據「建立 REST API」推薦技能

# 安裝技能
安裝 backend 技能

# 列出已安裝
列出所有已安裝的技能

# 載入技能
載入 python 技能的說明
```

## Skill CLI（終端機）

```bash
# 搜尋
npx skillpkg-cli search "keyword"

# 安裝
npx skillpkg-cli install github:user/repo
npx skillpkg-cli install github:user/repo#subpath

# 列出
npx skillpkg-cli list
npx skillpkg-cli list --scope=global

# 同步到 Claude Code
npx skillpkg-cli sync

# 查看詳情
npx skillpkg-cli info skill-name
```

## Memory 操作

### 搜尋記憶

在 Claude Code 中：
```
搜尋 memory 中關於 "API" 的經驗
```

或使用工具：
```bash
# Grep 搜尋
grep -r "關鍵字" .claude/memory/
```

### 查看索引

```bash
cat .claude/memory/index.md
```

## Git 常用

```bash
# 狀態
git status

# 提交
git add . && git commit -m "message"

# 推送
git push origin main

# 拉取
git pull origin main
```

## 專案結構

```
.
├── CLAUDE.md              # 專案入口（必讀）
├── .claude/
│   ├── memory/            # 記憶系統
│   │   ├── index.md       # 索引
│   │   ├── learnings/     # 學習記錄
│   │   ├── failures/      # 失敗經驗
│   │   ├── decisions/     # 架構決策
│   │   └── patterns/      # 推理模式
│   ├── rules/             # 自動載入規則
│   └── skills/            # 已安裝技能
├── personas/              # 專案 Persona 預設
└── docs/                  # 文檔
```

## Persona 切換

```bash
# 複製 persona 配置
cp -r personas/startup-mvp/skillpkg.json ./

# 或手動選擇
# startup-mvp: 快速 MVP
# enterprise: 企業級（完整測試、安全）
# fullstack: 全端開發
# research: 研究探索
```

## 常見任務快捷方式

| 任務 | 說法 |
|------|------|
| 開始新功能 | `/evolve 實作 [功能名稱]` |
| 修復 bug | `幫我找到並修復 [問題描述]` |
| 重構程式碼 | `/evolve 重構 [目標] --explore` |
| 寫測試 | `幫這個檔案寫單元測試: [path]` |
| 產生文檔 | `幫這個模組產生文檔` |
| Code Review | `幫我 review 這次的變更` |

## Starter Kit CLI

```bash
# 初始化專案
npx claude-starter-kit

# 使用 Persona 快速設定
npx claude-starter-kit --persona startup-mvp
npx claude-starter-kit --persona enterprise
npx claude-starter-kit --persona fullstack
npx claude-starter-kit --persona research

# 快速模式（使用預設值）
npx claude-starter-kit -y
```

## Doctor 指令（智能診斷）

```bash
# 健康檢查（診斷設定問題）
npx claude-starter-kit doctor

# 自動修復模式（修復可修復的問題）
npx claude-starter-kit doctor --fix

# 專案分析模式（分析技術棧並推薦技能）
npx claude-starter-kit doctor --discover
```

## Smart 指令（智能助手）v2.0

```bash
# 互動式智能助手
npx claude-starter-kit smart

# 快速模式（只顯示推薦）
npx claude-starter-kit smart --quick

# 直接執行特定行動
npx claude-starter-kit smart --action=install-evolve
npx claude-starter-kit smart --action=run-doctor
npx claude-starter-kit smart --action=discover-skills
```

## Insights 指令（跨專案洞察）v2.0

```bash
# 分析當前目錄及相鄰專案
npx claude-starter-kit insights

# 全域掃描（掃描 ~/Projects, ~/Workspace 等）
npx claude-starter-kit insights --global

# 匯出報告
npx claude-starter-kit insights --export
npx claude-starter-kit insights --export --format=json
```

## Dashboard 指令（Web 監控）v2.0

```bash
# 啟動 Dashboard（預設 port 3456）
npx claude-starter-kit dashboard

# 指定 port
npx claude-starter-kit dashboard --port 8080

# 自動開啟瀏覽器
npx claude-starter-kit dashboard --open
```

## Scaffold 指令（專案模板）v2.1 ⭐

```bash
# 列出所有可用模板
npx claude-starter-kit scaffold --list

# 創建 Express API 專案
npx claude-starter-kit scaffold express-api my-api

# 創建 Next.js 專案
npx claude-starter-kit scaffold nextjs my-app

# 創建 CLI 工具
npx claude-starter-kit scaffold cli my-tool

# 創建 Monorepo
npx claude-starter-kit scaffold monorepo my-workspace

# 跳過 npm install
npx claude-starter-kit scaffold express-api my-api --no-install
```

### 內建模板

| 模板 | 說明 |
|------|------|
| `express-api` | Express + TypeScript + Jest + Zod |
| `nextjs` | Next.js 14 + React + Tailwind |
| `cli` | Commander + Chalk + Inquirer |
| `monorepo` | Turborepo + pnpm workspaces |

## Workflow 指令（工作流程指南）v2.1 ⭐

```bash
# 列出所有工作流程
npx claude-starter-kit workflow

# 查看特定工作流程詳情
npx claude-starter-kit workflow tdd
npx claude-starter-kit workflow debug
npx claude-starter-kit workflow brainstorm
npx claude-starter-kit workflow plan

# 互動式選擇
npx claude-starter-kit workflow -i
```

### 內建工作流程

| 工作流程 | 說明 |
|----------|------|
| `tdd` | RED → GREEN → REFACTOR |
| `debug` | Hypothesis → Isolate → Verify |
| `brainstorm` | Diverge → Converge → Actionable |
| `plan` | Goal → Scope → Breakdown → Risks |
| `execute` | Review → Checkpoint → Execute → Validate |
| `review` | Understand → Verify → Quality → Feedback |
| `verify` | Build → Test → Lint → Types → Manual |
| `think` | 25 種職業思維框架 |

### Doctor 功能說明

| 模式 | 說明 |
|------|------|
| `doctor` | 檢查 8 項生態系統配置，顯示 pass/warn/fail |
| `doctor --fix` | 自動修復可修復的問題（Git、Memory、Skills 等） |
| `doctor --discover` | 分析 package.json 和檔案類型，推薦對應技能 |

### --discover 偵測的技術棧

- **Frontend**: React, Vue, Svelte, Next.js, Nuxt
- **Backend**: Express, Fastify, NestJS, Hono
- **Database**: Prisma, MongoDB, PostgreSQL, MySQL, Redis
- **Testing**: Jest, Vitest, Playwright, Cypress
- **Languages**: TypeScript, Python, Go, Rust, Java, Ruby, PHP

## 快速診斷

```bash
# 一鍵健康檢查 + 自動修復
npx claude-starter-kit doctor --fix

# 分析專案並推薦技能
npx claude-starter-kit doctor --discover

# Claude Code 版本
claude --version

# 檢查 MCP 配置
cat .mcp.json

# 檢查 skills
ls -la .claude/skills/

# 檢查 memory
ls -la .claude/memory/
```

---

> 完整文檔：[USAGE_TUTORIAL.md](USAGE_TUTORIAL.md) | [QUICKSTART.md](QUICKSTART.md)
