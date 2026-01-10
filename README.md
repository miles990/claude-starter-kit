# Claude Starter Kit

> 一行指令，開始智能化自我進化開發

[![npm version](https://badge.fury.io/js/claude-starter-kit.svg)](https://www.npmjs.com/package/claude-starter-kit)

**快速連結**: [5分鐘上手](docs/5-MINUTE-GUIDE.md) | [生態系統教學](docs/ECOSYSTEM_TUTORIAL.md) | [CHEATSHEET](docs/CHEATSHEET.md) | [故障排除](docs/TROUBLESHOOTING.md)

**v2.1 新功能**: 🏗️ `scaffold` 專案模板 | 🔄 `workflow` 工作流程指南 | 🚀 14 個 superpowers 工作流程 | 🧠 25 個職業思維框架

---

## 30 秒快速開始

```bash
# 在你的專案目錄執行
npx claude-starter-kit

# 打開 Claude Code
claude

# 開始自我進化開發
/evolve 你想做的事情
```

就這樣！Claude 會自動學習需要的技能並完成任務。

---

## 這是什麼？

```
┌─────────────────────────────────────────────────────────────────┐
│                    Claude Code 生態系統                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │  claude-starter-kit │  ← 你在這裡！入口專案                   │
│  │  (配置 + 記憶)      │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │      skillpkg       │  ← 技能管理器 (MCP + CLI)              │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│     ┌───────┴───────┐                                           │
│     ▼               ▼                                           │
│  ┌──────────┐  ┌──────────┐                                     │
│  │ software │  │  domain  │  ← 技能庫                           │
│  │  skills  │  │  skills  │                                     │
│  │ (50 個)  │  │ (16 個)  │                                     │
│  └──────────┘  └──────────┘                                     │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ self-evolving-agent │  ← 自我進化引擎                        │
│  └─────────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Claude Starter Kit 自動幫你設置：

| 功能 | 說明 |
|------|------|
| **記憶系統** | Claude 會記住學到的東西，避免重複踩坑 |
| **自我進化** | 自動分析 → 學習 → 執行 → 改進的 PDCA 循環 |
| **工作流程 Skills** | 14 個 superpowers 專業工作流程（TDD、除錯、Code Review...） |
| **思維框架** | 25 個職業思維框架（投資者、工程師、設計師視角） |
| **技能管理** | 80+ 專業技能，按需安裝 |
| **智能助手** | `smart` 指令提供上下文感知的推薦行動 |
| **跨專案洞察** | `insights` 指令分析模式、發現共同優化機會 |
| **Web Dashboard** | `dashboard` 指令啟動視覺化監控面板 |

### v2.1 開箱即用的工作流程

| 工作流程 | 用途 |
|----------|------|
| `test-driven-development` | TDD 流程：RED → GREEN → REFACTOR |
| `systematic-debugging` | 系統化除錯：假設 → 隔離 → 驗證 |
| `brainstorming` | 創意發想：發散 → 收斂 → 可行方案 |
| `writing-plans` | 撰寫實作計畫 |
| `executing-plans` | 執行並追蹤計畫 |
| `code-review` | 程式碼審查（請求與接收） |
| `verification-before-completion` | 完成前驗證清單 |
| `professional-thinking-frameworks` | 25 種職業思維框架 |

---

## CLI 指令

### 初始化專案

```bash
# 互動式設定
npx claude-starter-kit

# 使用 Persona 快速設定
npx claude-starter-kit --persona startup-mvp
npx claude-starter-kit --persona enterprise
npx claude-starter-kit --persona fullstack
npx claude-starter-kit --persona research

# 快速模式（使用預設值）
npx claude-starter-kit -y
```

### 智能診斷 (Doctor)

```bash
# 健康檢查（診斷 8 項配置）
npx claude-starter-kit doctor

# 自動修復模式
npx claude-starter-kit doctor --fix

# 專案分析（偵測技術棧並推薦技能）
npx claude-starter-kit doctor --discover
```

#### --discover 偵測的技術棧

| 類別 | 支援 |
|------|------|
| **Frontend** | React, Vue, Svelte, Next.js, Nuxt |
| **Backend** | Express, Fastify, NestJS, Hono |
| **Database** | Prisma, MongoDB, PostgreSQL, MySQL, Redis |
| **Testing** | Jest, Vitest, Playwright, Cypress |
| **Languages** | TypeScript, Python, Go, Rust, Java, Ruby, PHP |

### 智能助手 (Smart)

```bash
# 互動式智能助手（分析專案、推薦行動）
npx claude-starter-kit smart

# 快速模式（只顯示推薦）
npx claude-starter-kit smart --quick

# 直接執行特定行動
npx claude-starter-kit smart --action=install-evolve
```

#### smart 提供的能力

| 功能 | 說明 |
|------|------|
| **專案分析** | 自動偵測專案類型、計算健康分數 |
| **行動推薦** | 根據專案狀態推薦下一步行動 |
| **問題預警** | 識別潛在問題和改進機會 |
| **使用追蹤** | 記錄使用模式，提供個人化建議 |

### 跨專案洞察 (Insights)

```bash
# 分析當前目錄及相鄰專案
npx claude-starter-kit insights

# 掃描所有 Claude 專案（全域）
npx claude-starter-kit insights --global

# 匯出報告
npx claude-starter-kit insights --export --format=markdown
```

#### insights 提供的能力

| 功能 | 說明 |
|------|------|
| **專案總覽** | 所有專案的健康狀態、技能使用 |
| **模式識別** | 發現跨專案的共同模式（API 開發、錯誤處理等） |
| **技能熱度** | 最常用的技能排行 |
| **優化建議** | 跨專案知識轉移機會 |

### Web Dashboard

```bash
# 啟動監控面板（預設 port 3456）
npx claude-starter-kit dashboard

# 指定 port 並自動開啟瀏覽器
npx claude-starter-kit dashboard --port 8080 --open
```

#### Dashboard 功能

| 功能 | 說明 |
|------|------|
| **專案健康** | 視覺化健康分數、設定狀態 |
| **Memory 瀏覽** | 瀏覽和搜尋所有記憶文件 |
| **技能管理** | 查看已安裝技能 |
| **活動追蹤** | 最近的 commit 和 memory 活動 |

### 專案腳手架 (Scaffold) ⭐ 新

```bash
# 列出可用模板
npx claude-starter-kit scaffold --list

# 創建 Express API 專案
npx claude-starter-kit scaffold express-api my-api

# 創建 Next.js 專案
npx claude-starter-kit scaffold nextjs my-app

# 創建 CLI 工具
npx claude-starter-kit scaffold cli my-tool

# 創建 Monorepo
npx claude-starter-kit scaffold monorepo my-workspace
```

#### 內建模板

| 模板 | 說明 | 技術棧 |
|------|------|--------|
| **express-api** | 生產就緒的 REST API | Express, TypeScript, Jest, Zod |
| **nextjs** | 全端 Next.js 應用 | Next.js 14, React, Tailwind |
| **cli** | Node.js CLI 工具 | Commander, Chalk, Inquirer |
| **monorepo** | pnpm workspace | Turborepo, pnpm workspaces |

每個模板都自帶：
- 完整的 Claude Code 配置 (CLAUDE.md, .claude/)
- Memory 系統初始化
- MCP Server 配置
- 建議的 skills 清單

### 工作流程指南 (Workflow) ⭐ 新

```bash
# 列出所有工作流程
npx claude-starter-kit workflow

# 查看特定工作流程
npx claude-starter-kit workflow tdd
npx claude-starter-kit workflow debug
npx claude-starter-kit workflow brainstorm

# 互動式選擇
npx claude-starter-kit workflow -i
```

#### 內建工作流程

| 工作流程 | 說明 |
|----------|------|
| **tdd** | Test-Driven Development: RED → GREEN → REFACTOR |
| **debug** | 系統化除錯: Hypothesis → Isolate → Verify |
| **brainstorm** | 創意發想: Diverge → Converge → Actionable |
| **plan** | 撰寫計畫: Goal → Scope → Breakdown → Risks |
| **execute** | 執行計畫: Review → Checkpoint → Execute → Validate |
| **review** | Code Review: Understand → Verify → Quality → Feedback |
| **verify** | 完成前驗證: Build → Test → Lint → Types → Manual |
| **think** | 職業思維框架: 25 種專業視角 |

---

## 選擇你的 Persona

根據專案類型選擇預配置：

| Persona | 適用場景 | 哲學 |
|---------|---------|------|
| [startup-mvp](personas/startup-mvp/) | 快速原型、MVP | Ship fast, iterate faster |
| [enterprise](personas/enterprise/) | 企業專案、合規需求 | Stability and security first |
| [fullstack](personas/fullstack/) | 全端 Web 開發 | API-first, end-to-end integration |
| [research](personas/research/) | 研究探索、數據分析 | Deep exploration, thorough documentation |

詳見 [Personas 完整說明](personas/README.md)

---

## 使用範例

```bash
# 建立 API
/evolve 建立一個 Express + TypeScript 的 RESTful API

# 優化效能
/evolve 分析這個專案的效能瓶頸並優化

# 探索模式（允許發現意外改進）
/evolve 重構這個模組 --explore

# 涌現模式（跨領域連結）
/evolve 改進專案架構 --emergence
```

Claude 會自動：
1. 分析目標並拆解任務
2. 搜尋過去經驗（Memory）
3. 學習需要的技能（Skills）
4. PDCA 迭代執行直到完成
5. 記錄學到的經驗

---

## 產生的檔案結構

```
your-project/
├── CLAUDE.md              # 專案說明（Claude 會讀）
├── skillpkg.json          # 技能配置
├── .mcp.json              # MCP Server 配置
└── .claude/
    ├── memory/            # 經驗記憶（Git 版本控制）
    │   ├── index.md       # 快速索引
    │   ├── learnings/     # 成功經驗
    │   ├── failures/      # 失敗教訓
    │   ├── decisions/     # 架構決策 (ADR)
    │   └── patterns/      # 推理模式
    ├── rules/             # 自動載入規則
    └── skills/            # 已安裝技能
```

---

## 技能管理

**在 Claude Code 中（推薦）：**
```
幫我安裝 backend 技能
搜尋 frontend 相關的技能
列出已安裝的技能
```

**或使用 CLI：**
```bash
npx skillpkg-cli search "你要的功能"
npx skillpkg-cli install github:user/repo
npx skillpkg-cli list
npx skillpkg-cli sync
```

**或使用 doctor 自動推薦：**
```bash
npx claude-starter-kit doctor --discover
```

---

## 文檔

| 文檔 | 說明 |
|------|------|
| [5-MINUTE-GUIDE.md](docs/5-MINUTE-GUIDE.md) | 5 分鐘上手指南 ⭐ (新) |
| [ECOSYSTEM_TUTORIAL.md](docs/ECOSYSTEM_TUTORIAL.md) | 生態系統完整教學 |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | 故障排除指南 (新) |
| [CHEATSHEET.md](docs/CHEATSHEET.md) | 常用指令速查 |
| [Personas](personas/README.md) | 專案類型預配置 |
| [文檔導覽](docs/README.md) | 所有文檔索引 |

---

## 生態系統

| 專案 | 說明 |
|------|------|
| [skillpkg](https://github.com/miles990/skillpkg) | AI 技能包管理器 |
| [self-evolving-agent](https://github.com/miles990/self-evolving-agent) | 自我進化 Agent Skill |
| [claude-software-skills](https://github.com/miles990/claude-software-skills) | 50+ 軟體開發技能 |
| [claude-domain-skills](https://github.com/miles990/claude-domain-skills) | 16 領域專業技能 |

---

## Contributing

歡迎貢獻！請參閱各專案的 Contributing Guide。

## License

MIT
