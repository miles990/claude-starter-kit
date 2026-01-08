# Claude Code 生態系統完整教學

> 從零開始，掌握整個生態系統

---

## 目錄

1. [生態系統概覽](#生態系統概覽)
2. [安裝與設定](#安裝與設定)
3. [核心概念](#核心概念)
4. [使用流程](#使用流程)
5. [進階技巧](#進階技巧)
6. [常見場景](#常見場景)
7. [故障排除](#故障排除)

---

## 生態系統概覽

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
│  │  (安裝/搜尋/同步)   │                                        │
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
│  │ (PDCA + 記憶 + 涌現) │                                        │
│  └─────────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 五個專案的角色

| 專案 | 角色 | 功能 |
|------|------|------|
| **claude-starter-kit** | 入口 | 配置模板、記憶系統、規則 |
| **skillpkg** | 管理器 | 安裝、搜尋、同步技能 |
| **claude-software-skills** | 技術庫 | 50 個軟體開發技能 |
| **claude-domain-skills** | 領域庫 | 16 個非技術領域技能 |
| **self-evolving-agent** | 引擎 | 自我進化、PDCA、記憶 |

---

## 安裝與設定

### 方式 A: 一鍵安裝（推薦）

```bash
# 1. 在你的專案目錄執行
npx claude-starter-kit

# 2. 選擇 Persona（或使用預設）
# 3. 完成！
```

### 方式 B: 手動安裝

```bash
# 1. 複製 starter-kit 結構
git clone https://github.com/miles990/claude-starter-kit my-project
cd my-project

# 2. 安裝技能
npx skillpkg-cli install github:miles990/self-evolving-agent
npx skillpkg-cli install github:miles990/claude-software-skills
npx skillpkg-cli install github:miles990/claude-domain-skills

# 3. 同步到 Claude Code
npx skillpkg-cli sync
```

### 方式 C: 使用 Persona 快速設定

```bash
# Startup MVP - 快速原型
npx claude-starter-kit --persona startup-mvp

# Enterprise - 企業級完整配置
npx claude-starter-kit --persona enterprise

# Fullstack - 全端開發
npx claude-starter-kit --persona fullstack

# Research - 研究探索
npx claude-starter-kit --persona research
```

### 驗證安裝

```bash
# 檢查 Claude Code
claude --version

# 檢查技能
npx skillpkg-cli list

# 檢查記憶系統
ls .claude/memory/
```

---

## 核心概念

### 1. 技能 (Skills)

技能是 Claude 的「知識包」，分為兩類：

| 類型 | 說明 | 範例 |
|------|------|------|
| **Software Skills** | 技術知識 | python, react, database, api-design |
| **Domain Skills** | 領域知識 | marketing, game-design, quant-trading |

**技能如何運作？**
1. 你描述任務
2. Self-Evolving Agent 分析任務關鍵詞
3. 自動載入相關技能
4. Claude 帶著專業知識執行任務

### 2. 記憶系統 (Memory)

```
.claude/memory/
├── index.md          # 索引（自動維護）
├── learnings/        # 成功經驗
├── failures/         # 失敗教訓
├── decisions/        # 架構決策 (ADR)
├── patterns/         # 推理模式
├── strategies/       # 策略池
└── discoveries/      # 涌現發現
```

**記憶的價值：**
- 避免重複踩坑
- 累積專案知識
- 跨 Session 持久化
- Git 版本控制

### 3. 自我進化 (Self-Evolving)

```
/evolve [目標] → 分析 → 技能習得 → PDCA 循環 → 記憶更新 → 目標達成
```

**進化特點：**
- 失敗時自動診斷並重試
- 學習後記錄經驗
- 多策略嘗試
- 涌現模式探索

### 4. Persona（專案人格）

Persona 是預配置的專案模板：

| Persona | 哲學 | 測試要求 | 文檔要求 |
|---------|------|----------|----------|
| startup-mvp | Ship fast | Optional | Minimal |
| enterprise | Quality first | Required | Required |
| fullstack | API-first | Integration | API docs |
| research | Reproducibility | Coverage | Detailed |

---

## 使用流程

### 基本流程

```
1. 啟動 Claude Code
   $ claude

2. 描述你的目標
   > /evolve 建立一個 REST API

3. Claude 自動：
   - 搜尋相關記憶
   - 載入所需技能
   - 規劃執行步驟
   - 執行並驗證
   - 記錄學習經驗

4. 完成！
```

### 常用指令

| 指令 | 說明 |
|------|------|
| `/evolve [目標]` | 自我進化達成目標 |
| `/evolve [目標] --explore` | 探索模式 |
| `/evolve [目標] --emergence` | 涌現模式 |
| `/commit` | 提交變更 |
| `/help` | 顯示幫助 |

### 技能管理

```bash
# 在 Claude Code 中
搜尋 frontend 相關的技能
安裝 backend 技能
列出已安裝的技能

# 在終端機
npx skillpkg-cli search "keyword"
npx skillpkg-cli install github:user/repo
npx skillpkg-cli list
```

---

## 進階技巧

### 1. 涌現模式 (Emergence)

當你希望 Claude 主動發現改進機會：

```
/evolve 改進這個專案 --explore --emergence --max-iterations 10
```

涌現等級：
| Level | 模式 | 行為 |
|-------|------|------|
| 0 | 基礎 | 執行指定任務 |
| 1 | 探索 | 完成後探索改進 |
| 2 | 涌現 | 尋找跨領域連結 |
| 3 | 自主 | 自主發現創新 |

### 2. 技能組合

黃金組合範例：

```yaml
# Web 全端開發
skills: [frontend, backend, database, api-design]

# 量化交易系統
skills: [quant-trading, python, database, data-analysis]

# 遊戲開發
skills: [game-design, frontend, storytelling]

# 創業 MVP
skills: [product-management, frontend, backend, marketing]
```

### 3. 記憶搜尋

```bash
# 搜尋特定主題
Grep pattern="API" path=".claude/memory/"

# 搜尋失敗經驗
Grep pattern="failed" path=".claude/memory/failures/"

# 查看索引
cat .claude/memory/index.md
```

### 4. 自訂規則

在 `.claude/rules/` 中添加規則：

```markdown
<!-- .claude/rules/my-rules.md -->
# 專案特定規則

## 命名規範
- 檔案名使用 kebab-case
- 變數名使用 camelCase

## 測試要求
- 每個功能都要有測試
- 覆蓋率 > 80%
```

---

## 常見場景

### 場景 1: 開始新專案

```bash
# 1. 建立專案
mkdir my-app && cd my-app
git init

# 2. 初始化 Claude 配置
npx claude-starter-kit --persona startup-mvp

# 3. 開始開發
claude
> /evolve 建立一個 TODO 應用
```

### 場景 2: 學習新技術

```
> /evolve 學習 Rust 並建立一個 CLI 工具 --explore

Claude 會：
1. 載入 rust 技能
2. 逐步引導你學習
3. 邊學邊做
4. 記錄學習經驗
```

### 場景 3: 重構現有專案

```
> /evolve 重構這個專案的架構 --explore --emergence

Claude 會：
1. 分析現有架構
2. 識別改進機會
3. 提出重構方案
4. 逐步執行並驗證
```

### 場景 4: 跨領域任務

```
> /evolve 設計一個遊戲化行銷活動

Claude 會自動載入：
- game-design (遊戲設計)
- marketing (行銷策略)
- frontend (前端實作)
```

---

## 故障排除

### 問題: skillpkg 命令找不到

```bash
# 使用 npx（推薦）
npx skillpkg-cli list

# 或全域安裝
npm install -g skillpkg-cli
```

### 問題: 技能沒有載入

```bash
# 同步技能到 Claude Code
npx skillpkg-cli sync

# 重啟 Claude Code
```

### 問題: 記憶系統沒有初始化

```bash
# 檢查目錄
ls .claude/memory/

# 手動初始化
npx claude-starter-kit
```

### 問題: /evolve 沒有回應

確認 self-evolving-agent 已安裝：

```bash
npx skillpkg-cli list | grep evolve
```

如果沒有，安裝它：

```bash
npx skillpkg-cli install github:miles990/self-evolving-agent
npx skillpkg-cli sync
```

---

## 快速參考

### 目錄結構

```
.
├── CLAUDE.md              # 專案入口（必讀）
├── .claude/
│   ├── memory/            # 記憶系統
│   ├── rules/             # 自動載入規則
│   └── skills/            # 已安裝技能
├── .mcp.json              # MCP 配置
└── skillpkg.json          # 技能清單
```

### 相關連結

| 資源 | 連結 |
|------|------|
| claude-starter-kit | https://github.com/miles990/claude-starter-kit |
| skillpkg | https://github.com/miles990/skillpkg |
| claude-software-skills | https://github.com/miles990/claude-software-skills |
| claude-domain-skills | https://github.com/miles990/claude-domain-skills |
| self-evolving-agent | https://github.com/miles990/self-evolving-agent |

---

## 下一步

1. **新手** → 先讀 [QUICKSTART.md](QUICKSTART.md)
2. **日常使用** → 查閱 [CHEATSHEET.md](CHEATSHEET.md)
3. **深入了解** → 閱讀 [USAGE_TUTORIAL.md](USAGE_TUTORIAL.md)
4. **進階涌現** → 參考 self-evolving-agent 的 [EMERGENCE.md](https://github.com/miles990/self-evolving-agent/blob/main/docs/EMERGENCE.md)

---

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  你已經了解整個生態系統！                                       │
│                                                                 │
│  開始你的第一個任務：                                           │
│                                                                 │
│  $ claude                                                       │
│  > /evolve [你想達成的目標]                                     │
│                                                                 │
│  讓 Claude 帶著 66 個技能幫你完成任務！                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
