# 5 分鐘上手指南

> 從零到專業級 Claude Code 工作流程

---

## 第 1 分鐘：了解你獲得了什麼

當你使用 `claude-starter-kit`，你立即獲得：

```
┌─────────────────────────────────────────────────────────────┐
│  📦 開箱即用的功能                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🛠️  14 個工作流程 Skills (來自 superpowers)                │
│      ├── brainstorming        創意發想                     │
│      ├── test-driven-development  TDD 流程                 │
│      ├── systematic-debugging     系統化除錯               │
│      ├── writing-plans           撰寫計畫                  │
│      ├── executing-plans         執行計畫                  │
│      ├── code-review (requesting/receiving)                │
│      ├── verification-before-completion                    │
│      └── ... 更多                                          │
│                                                             │
│  🧠  25 個職業思維框架                                      │
│      ├── 投資者思維 (Munger)                               │
│      ├── 第一原理 (Musk)                                   │
│      ├── 設計思維 (IDEO)                                   │
│      └── ... 更多                                          │
│                                                             │
│  📋  3 個新指令                                             │
│      ├── /brainstorm   快速創意發想                        │
│      ├── /write-plan   撰寫實作計畫                        │
│      └── /execute-plan 執行計畫                            │
│                                                             │
│  📁  完整記憶系統                                           │
│      ├── learnings/    學習記錄                            │
│      ├── failures/     失敗經驗                            │
│      ├── decisions/    決策記錄 (ADR)                      │
│      └── patterns/     推理模式                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 第 2 分鐘：選擇你的第一個工作流程

### 場景 A：我要開發新功能

```
你：實作一個用戶登入功能

Claude：讓我使用 test-driven-development skill...

        1. 先寫測試 (RED)
        2. 實作功能 (GREEN)
        3. 重構優化 (REFACTOR)
```

### 場景 B：我遇到了 Bug

```
你：這個 API 有時候會 timeout

Claude：讓我使用 systematic-debugging skill...

        1. 重現問題
        2. 隔離變數
        3. 形成假設
        4. 驗證假設
        5. 修復並驗證
```

### 場景 C：我需要做決策

```
你：應該用 REST 還是 GraphQL?

Claude：讓我使用 professional-thinking-frameworks...

        投資者視角：長期維護成本？
        工程師視角：安全邊際在哪？
        設計師視角：使用者體驗如何？
```

---

## 第 3 分鐘：使用新指令

### /brainstorm - 創意發想

```
你：/brainstorm 如何改善用戶留存率

Claude：開始創意發想流程...

        🎯 問題定義
        💡 發散思考 (10+ 想法)
        🔍 收斂評估
        ✅ 可行方案
```

### /write-plan - 撰寫計畫

```
你：/write-plan 重構認證模組

Claude：撰寫實作計畫...

        ## 目標
        ## 範圍
        ## 步驟
        ## 風險
        ## 驗收標準
```

### /execute-plan - 執行計畫

```
你：/execute-plan

Claude：開始執行計畫...

        [x] 步驟 1: 備份現有程式碼
        [x] 步驟 2: 建立新架構
        [ ] 步驟 3: 遷移功能 (進行中)
        [ ] 步驟 4: 測試驗證
```

---

## 第 4 分鐘：啟用自我進化

### 使用 /evolve 達成複雜目標

```
你：/evolve 建立一個完整的電商後端系統

Claude：🧬 Self-Evolving Agent 啟動

        Phase 1: 目標分析
        ├── 解析需求
        ├── 分解子目標
        └── 評估能力缺口

        Phase 1.5: 能力評估
        ├── 搜尋相關 skill
        └── 載入領域知識

        Phase 2: PDCA 執行
        ├── Plan (規劃)
        ├── Do (執行)
        ├── Check (驗證)
        └── Act (改進)

        🔄 重複直到目標達成
```

---

## 第 5 分鐘：查看與累積經驗

### 查看已累積的知識

```bash
# 查看 memory 索引
cat .claude/memory/index.md

# 搜尋特定主題
Grep pattern="authentication" path=".claude/memory/"
```

### 知識會自動累積

當你使用 `/evolve` 時：

```
執行任務 → 遇到問題 → 解決問題 → 自動記錄
                                    ↓
                            .claude/memory/
                            ├── learnings/    ← 成功經驗
                            ├── failures/     ← 失敗教訓
                            └── patterns/     ← 推理模式
```

下次遇到類似問題，AI 會自動搜尋並應用過去經驗！

---

## 快速參考

### 常用 Skills

| Skill | 用途 | 觸發時機 |
|-------|------|----------|
| `test-driven-development` | TDD 流程 | 開發新功能 |
| `systematic-debugging` | 系統化除錯 | 遇到 bug |
| `brainstorming` | 創意發想 | 需要新想法 |
| `writing-plans` | 撰寫計畫 | 複雜任務前 |
| `code-review` | 程式碼審查 | 完成功能後 |
| `verification-before-completion` | 完成前驗證 | 提交前 |

### 常用指令

| 指令 | 功能 |
|------|------|
| `/evolve [目標]` | 自我進化完成目標 |
| `/brainstorm [主題]` | 創意發想 |
| `/write-plan [任務]` | 撰寫計畫 |
| `/execute-plan` | 執行計畫 |

### 快速診斷

```bash
# 檢查環境
ls CLAUDE.md .claude/memory/index.md .claude/skills/

# 列出可用 skills
ls .claude/skills/

# 搜尋 memory
Grep pattern="關鍵字" path=".claude/memory/"
```

---

## 下一步

1. **深入學習**: 閱讀 [ECOSYSTEM_TUTORIAL.md](./ECOSYSTEM_TUTORIAL.md)
2. **遇到問題**: 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **快速查詢**: 使用 [CHEATSHEET.md](./CHEATSHEET.md)
4. **探索更多 Skills**: 執行 `skillpkg search "關鍵字"`

---

## 恭喜！

你現在已經掌握了 Claude Code 生態系統的核心功能。

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🎉 你已經從「使用 Claude」升級到「與 Claude 協作」        │
│                                                             │
│  傳統：人類 → 指令 → Claude → 結果                          │
│  現在：人類 → 目標 → Claude (自我進化) → 高品質結果         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
