# Claude Starter Kit Best Practices

> 使用 claude-starter-kit 的最佳實踐指南

---

## 1. 新專案啟動

```bash
# Best: 使用 scaffold 創建完整專案結構
npx claude-starter-kit scaffold express-api my-project
cd my-project
claude  # 啟動 Claude Code

# Good: 為現有專案添加 Claude 配置
cd existing-project
npx claude-starter-kit -y

# Avoid: 手動建立 .claude/ 目錄（容易遺漏配置）
```

### 可用模板

| 模板 | 技術棧 | 適用場景 |
|------|--------|----------|
| `express-api` | Express + TypeScript + Jest | REST API 後端 |
| `nextjs` | Next.js 14 + React + Tailwind | 全端 Web 應用 |
| `cli` | Commander + Chalk + Inquirer | 命令列工具 |
| `monorepo` | Turborepo + pnpm workspaces | 多專案協作 |

---

## 2. 任務規劃策略

```bash
# 先用 plan 指令決定策略
npx claude-starter-kit plan "你的任務描述"
```

| 任務類型 | 建議路由 | 使用方式 |
|----------|----------|----------|
| 新功能/系統 | spec-workflow | `plan "implement X" --formal` |
| Bug 修復 | evolve PDCA | `plan "fix X" --quick` |
| 重構/優化 | evolve + explore | `/evolve X --explore` |
| 不確定 | 讓 plan 自動判斷 | `plan "X"` |

### 路由邏輯

```
關鍵詞分析：
├── 大型任務：feature, system, architecture, 功能, 系統, 架構
│   → 路由到 spec-workflow
│
└── 小型任務：fix, improve, add, 修復, 改進, 新增
    → 路由到 evolve PDCA
```

---

## 3. 工作流程選擇

```bash
# 查看所有工作流程
npx claude-starter-kit workflow

# 常用流程速查
npx claude-starter-kit workflow tdd      # 寫新功能前
npx claude-starter-kit workflow debug    # 遇到 bug
npx claude-starter-kit workflow verify   # 提交前驗證
```

### 內建工作流程

| 工作流程 | 步驟 | 使用時機 |
|----------|------|----------|
| `tdd` | RED → GREEN → REFACTOR | 開發新功能 |
| `debug` | Hypothesis → Isolate → Verify | 遇到 bug |
| `brainstorm` | Diverge → Converge → Actionable | 需要創意 |
| `plan` | Goal → Scope → Breakdown → Risks | 規劃任務 |
| `execute` | Review → Checkpoint → Execute | 執行計畫 |
| `review` | Understand → Verify → Quality | 審查程式碼 |
| `verify` | Build → Test → Lint → Types | 提交前驗證 |
| `think` | 25 種職業思維框架 | 複雜決策 |

### 最佳實踐流程

```
開發新功能:
  1. /brainstorm [功能]     → 創意發想
  2. /write-plan [功能]     → 撰寫計畫
  3. /execute-plan          → TDD 執行
  4. /code-review           → 審查程式碼
  5. /verify                → 完成驗證
```

---

## 4. /evolve 使用指南

### 目標描述

```bash
# Best: 清楚的目標描述
/evolve 建立具有 JWT 認證的 REST API，支援用戶 CRUD 操作

# Good: 帶約束條件
/evolve 優化首頁載入速度，目標 < 2 秒

# Avoid: 模糊的描述
/evolve 讓它變好
```

### Flags 使用時機

| Flag | 何時使用 | 範例 |
|------|----------|------|
| `--explore` | 想要探索更多可能性 | `/evolve 優化效能 --explore` |
| `--emergence` | 鼓勵跨領域連結與創新 | `/evolve 重構架構 --emergence` |
| `--max-iterations N` | 限制迭代次數 | `/evolve X --max-iterations 5` |

### 組合使用

```bash
# 探索性改進
/evolve 改進專案架構 --explore --emergence --max-iterations 10
```

---

## 5. Memory 系統活用

### 執行任務前搜尋經驗

```bash
# 在 Claude Code 中說：
「搜尋 memory 中關於 authentication 的經驗」

# 或直接使用 Grep
Grep pattern="authentication" path=".claude/memory/"
```

### Memory 類型

| 目錄 | 存放內容 | 何時記錄 |
|------|----------|----------|
| `learnings/` | 成功解決方案 | 解決非平凡問題後 |
| `failures/` | 失敗教訓 | 踩坑超過 30 分鐘 |
| `decisions/` | 架構決策 (ADR) | 重要技術選型 |
| `patterns/` | 推理模式 | 發現可重用思路 |

### Memory 生命週期

```
新增 → 累積 → 審視 → 去蕪存菁 → 精煉知識

❌ 錯誤：一直新增，從不整理 → 垃圾堆
✅ 正確：定期整理，保留精華 → 知識庫
```

---

## 6. 健康檢查習慣

```bash
# 每週執行一次健康檢查
npx claude-starter-kit doctor

# 發現問題時自動修復
npx claude-starter-kit doctor --fix

# 新專案：分析技術棧並推薦 skills
npx claude-starter-kit doctor --discover
```

### Doctor 檢查項目

| 項目 | 說明 |
|------|------|
| Git Repository | 版本控制是否初始化 |
| CLAUDE.md | 專案入口檔案是否存在 |
| Memory System | 記憶系統目錄結構 |
| Skills Directory | 已安裝的 skills |
| MCP Configuration | MCP Server 配置 |
| skillpkg.json | skill 依賴配置 |
| Claude Code CLI | CLI 是否安裝 |
| Rules Directory | 自動載入規則 |

---

## 7. 日常開發模式

### Morning Routine

```bash
npx claude-starter-kit doctor          # 健康檢查
npx claude-starter-kit plan --status   # 查看規劃狀態
claude                                 # 開始工作
```

### 開發中

```
• 用 /evolve 處理複雜任務
• 用 /brainstorm 發想新功能
• 讓 Claude 自動選擇適合的 skill
• 遇到問題先說「搜尋 memory」
```

### 提交前

```
• /verify 驗證所有改動
• 確保 build 和 test 通過
• Memory 會自動記錄重要經驗
```

---

## 8. 指令速查

### 專案建立

```bash
npx claude-starter-kit scaffold --list          # 查看模板
npx claude-starter-kit scaffold nextjs my-app   # 創建專案
```

### 智能規劃

```bash
npx claude-starter-kit plan "任務"              # 智能路由
npx claude-starter-kit plan --status            # 查看狀態
npx claude-starter-kit plan --list              # 列出 specs
```

### 工作流程

```bash
npx claude-starter-kit workflow                 # 列出流程
npx claude-starter-kit workflow tdd             # 查看 TDD
npx claude-starter-kit workflow -i              # 互動選擇
```

### 診斷監控

```bash
npx claude-starter-kit doctor                   # 健康檢查
npx claude-starter-kit doctor --fix             # 自動修復
npx claude-starter-kit doctor --discover        # 技術棧分析
npx claude-starter-kit smart --quick            # 智能推薦
npx claude-starter-kit insights                 # 跨專案洞察
npx claude-starter-kit dashboard                # Web 儀表板
```

---

## 9. 常見錯誤避免

| 避免 | 改用 |
|------|------|
| 手動複製 skills | `skillpkg install` |
| 跳過健康檢查 | 定期 `doctor` |
| 忽略 Memory | 執行前搜尋經驗 |
| 模糊的 /evolve 目標 | 清楚描述 + 約束條件 |
| 一次做太多事 | 分解成子目標 |
| 不看 workflow 就開始 | 先查詢適合的 workflow |

---

## 10. 進階技巧

### 使用 Persona 快速配置

```bash
npx claude-starter-kit --persona startup-mvp   # 快速 MVP
npx claude-starter-kit --persona enterprise    # 企業級
npx claude-starter-kit --persona fullstack     # 全端開發
npx claude-starter-kit --persona research      # 研究探索
```

### 跨專案學習

```bash
npx claude-starter-kit insights --global       # 掃描所有專案
npx claude-starter-kit insights --export       # 匯出報告
```

### 持續監控

```bash
npx claude-starter-kit dashboard --open        # 啟動監控面板
npx claude-starter-kit dashboard --port 8080   # 指定端口
```

### Skill 管理

```bash
# 在 Claude Code 中
「幫我搜尋 frontend 相關的技能」
「安裝 backend 技能」
「列出所有已安裝的技能」

# 或使用 CLI
npx skillpkg-cli search "keyword"
npx skillpkg-cli install github:user/repo
npx skillpkg-cli list
```

---

## 相關文檔

| 文檔 | 說明 |
|------|------|
| [5-MINUTE-GUIDE.md](5-MINUTE-GUIDE.md) | 5 分鐘上手指南 |
| [CLI-COMMANDS.md](CLI-COMMANDS.md) | CLI 指令詳解 |
| [CHEATSHEET.md](CHEATSHEET.md) | 常用指令速查表 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 故障排除指南 |
| [ECOSYSTEM_TUTORIAL.md](ECOSYSTEM_TUTORIAL.md) | 生態系統完整教學 |
