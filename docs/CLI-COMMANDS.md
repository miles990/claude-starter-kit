# CLI 指令詳解

> plan、scaffold、workflow 三大指令的用途、使用時機與操作方式

---

## 總覽

| 指令 | 用途 | 使用時機 |
|------|------|----------|
| **plan** | 智能規劃路由 | 開始任何任務前，決定用正式規劃還是快速迭代 |
| **scaffold** | 專案腳手架 | 創建新專案時，一鍵生成完整配置 |
| **workflow** | 工作流程指南 | 學習/查詢開發最佳實踐 |

---

## plan - 統一規劃入口

### 用途

智能判斷你的任務應該用：
- **spec-workflow**：正式規劃（需求文檔 → 設計文檔 → 任務拆解 → 審批）
- **evolve PDCA**：快速迭代（分析 → 執行 → 檢查 → 改進）

### 使用時機

| 情況 | 建議 |
|------|------|
| 大型功能（用戶系統、支付模組） | → spec-workflow |
| 快速修復（bug fix、小改動） | → evolve |
| 不確定 | → 讓 plan 自動判斷 |

### 路由邏輯

```
關鍵詞分析：
├── 大型任務：feature, system, architecture, 功能, 系統, 架構
│   → 路由到 spec-workflow
│
└── 小型任務：fix, improve, add, 修復, 改進, 新增
    → 路由到 evolve PDCA
```

### 使用方式

```bash
# 1. 自動判斷（推薦）
npx claude-starter-kit plan "implement user authentication"
# → 分析後建議使用 spec-workflow（包含 feature 關鍵詞）

npx claude-starter-kit plan "fix login bug"
# → 分析後建議使用 evolve（包含 fix 關鍵詞）

# 2. 強制模式
npx claude-starter-kit plan "任務描述" --formal   # 強制正式規劃
npx claude-starter-kit plan "任務描述" --quick    # 強制快速迭代

# 3. 從已有 spec 繼續
npx claude-starter-kit plan --from-spec auth-system

# 4. 查看狀態
npx claude-starter-kit plan --status  # 顯示所有 spec 進度和 Memory 統計
npx claude-starter-kit plan --list    # 列出所有可用的 spec

# 5. 互動模式
npx claude-starter-kit plan -i
```

### 輸出範例

```
🎯 Goal Analysis

  "implement user authentication"

🔀 Route: spec-workflow
   Reason: 包含大型任務關鍵詞 (implement)
   Confidence: high

🚀 Recommended Action

  In Claude Code, run:

  呼叫 mcp__spec-workflow__spec-workflow-guide
  然後建立 spec: implement user authentication
```

### 選項說明

| 選項 | 說明 |
|------|------|
| `--formal` | 強制使用 spec-workflow（正式文檔流程） |
| `--quick` | 強制使用 evolve PDCA（快速迭代） |
| `--from-spec <name>` | 從已有的 spec 繼續執行任務 |
| `--status` | 顯示規劃狀態（spec 進度 + Memory 統計） |
| `--list` | 列出所有可用的 spec |
| `-i, --interactive` | 互動式規劃模式 |

---

## scaffold - 專案腳手架

### 用途

一鍵創建專業專案，自帶：
- 完整的 Claude Code 配置（CLAUDE.md、Memory、Rules）
- MCP Server 配置
- 技能推薦清單
- Git 初始化
- 依賴安裝

### 使用時機

| 情況 | 選擇模板 |
|------|----------|
| 建立 REST API | `express-api` |
| 建立全端 Web 應用 | `nextjs` |
| 建立命令列工具 | `cli` |
| 建立多專案工作區 | `monorepo` |

### 內建模板

| 模板 | 技術棧 | 特點 |
|------|--------|------|
| **express-api** | Express + TypeScript + Jest + Zod | 生產就緒的 API 架構 |
| **nextjs** | Next.js 14 + React + Tailwind | App Router + SSR |
| **cli** | Commander + Chalk + Inquirer | npm 發布就緒 |
| **monorepo** | Turborepo + pnpm workspaces | 多專案協作 |

### 使用方式

```bash
# 1. 列出所有模板
npx claude-starter-kit scaffold --list

# 2. 創建專案（互動式）
npx claude-starter-kit scaffold
# → 選擇模板 → 輸入名稱 → 自動創建

# 3. 創建專案（指定模板和名稱）
npx claude-starter-kit scaffold express-api my-api
npx claude-starter-kit scaffold nextjs my-app
npx claude-starter-kit scaffold cli my-tool
npx claude-starter-kit scaffold monorepo my-workspace

# 4. 跳過依賴安裝
npx claude-starter-kit scaffold express-api my-api --no-install

# 5. 跳過 Git 初始化
npx claude-starter-kit scaffold express-api my-api --no-git

# 6. 快速模式（使用預設值）
npx claude-starter-kit scaffold express-api my-api -y
```

### 生成的結構

以 `express-api` 為例：

```
my-api/
├── CLAUDE.md              # Claude Code 專案說明
├── .mcp.json              # MCP Server 配置
├── skillpkg.json          # 技能配置
├── package.json           # 依賴配置
├── tsconfig.json          # TypeScript 配置
├── .env.example           # 環境變數範例
├── .gitignore             # Git 忽略配置
├── src/
│   ├── index.ts           # 入口檔案
│   ├── routes/
│   │   └── index.ts       # 路由定義
│   └── middleware/
│       └── error.ts       # 錯誤處理
└── .claude/
    ├── rules/             # 代碼規範
    │   ├── code-quality.md
    │   └── testing.md
    ├── memory/            # Memory 系統
    │   ├── index.md
    │   ├── learnings/
    │   ├── failures/
    │   ├── decisions/
    │   └── patterns/
    └── skills/
```

### 選項說明

| 選項 | 說明 |
|------|------|
| `-y, --yes` | 使用預設值，不詢問 |
| `--no-install` | 跳過依賴安裝 |
| `--no-git` | 跳過 Git 初始化 |
| `-l, --list` | 列出所有可用模板 |

### 創建後的下一步

```bash
cd my-api
claude              # 啟動 Claude Code
/evolve             # 開始自我進化開發
```

---

## workflow - 工作流程指南

### 用途

快速查詢和學習 8 個開發最佳實踐工作流程，來自 superpowers skills。

### 使用時機

| 情況 | 使用的 Workflow |
|------|-----------------|
| 寫新功能前 | `tdd` (Test-Driven Development) |
| 遇到 bug | `debug` (Systematic Debugging) |
| 需要創意 | `brainstorm` |
| 規劃多步驟任務 | `plan` |
| 執行計畫 | `execute` |
| 審查代碼 | `review` |
| 準備提交 | `verify` |
| 複雜問題分析 | `think` |

### 內建工作流程

| Workflow | 說明 | 步驟 |
|----------|------|------|
| **tdd** | Test-Driven Development | RED → GREEN → REFACTOR |
| **debug** | Systematic Debugging | REPRODUCE → ISOLATE → HYPOTHESIZE → VERIFY → FIX |
| **brainstorm** | 創意發想 | DIVERGE → CLUSTER → CONVERGE → REFINE |
| **plan** | 撰寫計畫 | GOAL → SCOPE → BREAKDOWN → DEPENDENCIES → RISKS |
| **execute** | 執行計畫 | REVIEW → CHECKPOINT → EXECUTE → VALIDATE → DOCUMENT |
| **review** | Code Review | UNDERSTAND → VERIFY → QUALITY → SECURITY → FEEDBACK |
| **verify** | 完成前驗證 | BUILD → TEST → LINT → TYPES → MANUAL → COMMIT |
| **think** | 職業思維框架 | SELECT → ANALYZE → SYNTHESIZE → DECIDE |

### 使用方式

```bash
# 1. 列出所有工作流程
npx claude-starter-kit workflow

# 2. 查看特定工作流程詳情
npx claude-starter-kit workflow tdd
npx claude-starter-kit workflow debug
npx claude-starter-kit workflow brainstorm
npx claude-starter-kit workflow plan
npx claude-starter-kit workflow execute
npx claude-starter-kit workflow review
npx claude-starter-kit workflow verify
npx claude-starter-kit workflow think

# 3. 互動式選擇
npx claude-starter-kit workflow -i
```

### 輸出範例

```
🔄 Test-Driven Development

RED → GREEN → REFACTOR cycle for quality code

📍 When to use:
  Use when implementing any feature or bugfix, before writing implementation code

📋 Steps:
  1. RED: Write a failing test that defines the expected behavior
  2. GREEN: Write minimal code to make the test pass
  3. REFACTOR: Improve the code while keeping tests green
  4. Repeat for each feature/behavior

💡 Tips:
  • Start with the simplest case
  • One behavior per test
  • Refactor only when tests pass
  • Test behavior, not implementation

🔗 Related workflows:
  verification-before-completion, code-review
```

### 工作流程詳解

#### tdd - Test-Driven Development

```
📋 步驟：
1. RED: 寫一個會失敗的測試，定義預期行為
2. GREEN: 寫最少的程式碼讓測試通過
3. REFACTOR: 在測試通過的前提下改進程式碼
4. 重複以上步驟

💡 技巧：
• 從最簡單的案例開始
• 一個測試只測一個行為
• 只在測試通過時重構
• 測試行為，不是實作
```

#### debug - Systematic Debugging

```
📋 步驟：
1. REPRODUCE: 穩定重現問題
2. ISOLATE: 縮小範圍（二分法）
3. HYPOTHESIZE: 形成原因假設
4. VERIFY: 用證據驗證假設
5. FIX: 應用最小修復
6. VALIDATE: 確保修復有效且無回歸

💡 技巧：
• 永遠不要假設 - 驗證一切
• 一次只改一個地方
• 記錄嘗試過的方法
• 先檢查最近的變更
```

#### brainstorm - 創意發想

```
📋 步驟：
1. DIVERGE: 產生大量想法（10+ 個），不評判
2. CLUSTER: 將相關想法分組
3. CONVERGE: 評估並選擇最佳選項
4. REFINE: 將選中的想法發展成可行方案

💡 技巧：
• 發散階段重量不重質
• 想法產生時不批評
• 在他人想法上延伸
• 定義清楚的評估標準
```

---

## 三者的協作關係

```
                    ┌─────────────────────────────────┐
                    │         workflow                │
                    │    (學習工作流程最佳實踐)       │
                    └──────────────┬──────────────────┘
                                   │ 參考
                                   ▼
┌─────────────────┐         ┌─────────────────┐
│    scaffold     │ ──────▶ │      plan       │
│  (創建新專案)   │  下一步  │   (規劃任務)    │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                                 ▼
            spec-workflow                        evolve PDCA
            (正式規劃)                           (快速迭代)
```

### 典型流程

1. **scaffold** 創建新專案
2. **workflow** 學習開發最佳實踐
3. **plan** 規劃要做的任務
4. 根據 plan 的建議，在 Claude Code 中執行

### 範例場景

#### 場景 1：開始新專案

```bash
# 1. 創建 API 專案
npx claude-starter-kit scaffold express-api my-api

# 2. 進入專案
cd my-api

# 3. 規劃第一個功能
npx claude-starter-kit plan "implement user authentication"
# → 建議使用 spec-workflow

# 4. 在 Claude Code 中執行
claude
# 然後按照 plan 的建議執行
```

#### 場景 2：修復 Bug

```bash
# 1. 查詢除錯工作流程
npx claude-starter-kit workflow debug

# 2. 規劃修復任務
npx claude-starter-kit plan "fix login session timeout issue"
# → 建議使用 evolve PDCA

# 3. 在 Claude Code 中執行
/evolve fix login session timeout issue
```

#### 場景 3：學習最佳實踐

```bash
# 列出所有工作流程
npx claude-starter-kit workflow

# 深入學習 TDD
npx claude-starter-kit workflow tdd

# 互動式探索
npx claude-starter-kit workflow -i
```

---

## 相關文檔

- [CHEATSHEET.md](CHEATSHEET.md) - 常用指令速查表
- [5-MINUTE-GUIDE.md](5-MINUTE-GUIDE.md) - 5 分鐘上手指南
- [ECOSYSTEM_TUTORIAL.md](ECOSYSTEM_TUTORIAL.md) - 生態系統完整教學
