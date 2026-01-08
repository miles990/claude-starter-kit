---
date: 2025-01-07
tags: [improvements, insights, emergence, non-obvious, innovation]
task: 提出非顯而易見的改進方向
status: active
---

# 非顯而易見的改進方向：10 個洞察

> 超越功能需求，探索系統性創新機會

## 洞察 1: Skill 是「封裝好的判斷力」而非知識

### 現狀思維
- Skill = 知識集合 (what to know)

### 轉換思維
- Skill = 判斷力封裝 (when + how + what)

### 改進方向
每個 SKILL.md 應該強調**決策框架**而非純知識：
```yaml
# 不只是
knowledge:
  - React hooks 用法
  - useState vs useReducer

# 而是
decision_framework:
  - 當狀態簡單時 → useState
  - 當狀態邏輯複雜時 → useReducer
  - 當需要跨組件共享時 → Context + useReducer
  - 當狀態有副作用時 → useEffect + cleanup
```

**影響**: 這改變了我們寫 skill 的方式，從「教 AI 什麼」變成「教 AI 如何判斷」

---

## 洞察 2: Memory 系統應該有「遺忘曲線」

### 現狀
- 記憶只增不減
- 所有記憶權重相同

### 問題
- 舊記憶可能過時但仍被引用
- 無法區分「經常有用」vs「偶爾有用」

### 改進方向
引入記憶衰減機制：
```yaml
# 在記憶文件中追蹤
metadata:
  created: 2025-01-01
  last_accessed: 2025-01-07
  access_count: 15
  relevance_score: 0.85  # 動態計算

# 衰減規則
- 30 天未訪問 → relevance -= 0.1
- 每次訪問 → relevance += 0.05
- relevance < 0.3 → 標記為 deprecated
```

**涌現效果**: 系統會自然「忘記」不再有用的知識，保持精煉

---

## 洞察 3: 失敗不只是「學習」而是「免疫」

### 現狀
- 失敗記錄到 failures/
- 下次搜尋時可能找到

### 轉換思維
失敗應該產生「抗體」而非「記錄」：
```yaml
# 不只是記錄
failures/2025-01-07-api-timeout.md
content: "API 超時問題及解決方案..."

# 而是生成 guard
guards/api-timeout-prevention.md
trigger: "使用外部 API"
check: "是否設定 timeout？是否有 retry 邏輯？"
action: "自動檢查並提醒"
```

### 改進方向
self-evolving-agent 新增 Phase 3.5: Guard Generation
- 每次失敗後，評估是否應該生成 guard
- Guard 在 Phase 1 自動檢查，防止重複失敗

---

## 洞察 4: Skill 應該支援「漸進式揭示」

### 現狀
- 載入 skill 時全部內容進入上下文
- 500+ 行的 skill 會佔用大量 token

### 問題
- 許多細節在特定情況才需要
- Token 浪費影響效能

### 改進方向
Skill 分層結構：
```yaml
# SKILL.md 新增層級標記
---
name: investment-analysis
layers:
  core: lines 1-50         # 核心概念，永遠載入
  intermediate: lines 51-200  # 常用內容，按需載入
  advanced: lines 201-500   # 深度內容，特定情況載入
---

# 載入邏輯
task_complexity: low → 只載入 core
task_complexity: medium → 載入 core + intermediate
task_complexity: high → 載入全部
```

**影響**: skillpkg 需要支援分層載入，self-evolving-agent 需要評估任務複雜度

---

## 洞察 5: 生態系統需要「語義版本」而非數字版本

### 現狀
- skillpkg: 0.5.5
- self-evolving-agent: 3.6.0

### 問題
- 版本號不能表達「這個版本改了什麼」
- 用戶不知道升級會影響什麼

### 改進方向
語義化版本標籤：
```yaml
version: 3.6.0
semantic_tags:
  - auto-domain-detection  # v3.5 新增
  - emergence-tracking     # v3.6 新增
  - pdca-loop             # v3.0 核心

breaking_changes:
  from_3.5_to_3.6:
    - memory/discoveries/ 新增為必要目錄
    - skill-metrics/ 追蹤格式變更
```

**影響**: 用戶可以按功能而非版本號決定升級

---

## 洞察 6: MCP 工具應該有「使用情境」而非「功能描述」

### 現狀
```yaml
tool: install_skill
description: "Install a skill from GitHub or registry"
```

### 問題
- AI 不知道「何時」使用這個工具
- 只知道「可以」做什麼

### 改進方向
情境驅動的工具描述：
```yaml
tool: install_skill
description: "Install a skill from GitHub or registry"
use_when:
  - "用戶說'我不會 X'"
  - "Phase 1.5 檢測到能力缺口"
  - "任務需要特定領域知識"
avoid_when:
  - "技能已經安裝"
  - "用戶明確說不需要新技能"
```

**影響**: skillpkg MCP server 的工具描述需要重構

---

## 洞察 7: Domain Skills 和 Software Skills 應該有「接口層」

### 現狀
- Domain skills 專注領域知識
- Software skills 專注技術實現
- 沒有連接層

### 問題
- 用戶需要自己翻譯「領域需求 → 技術選擇」
- 相同領域可能有多種技術實現

### 改進方向
建立 Interface Skills：
```
domain-skills/
├── investment-analysis/SKILL.md
└── interfaces/
    └── investment-to-tech.md  # 接口層
        content:
          - "財務資料分析" → python + pandas
          - "即時行情" → database + realtime-systems
          - "報告生成" → frontend + data-design
```

**涌現效果**: 系統可以自動完成「領域需求 → 技術選擇」的映射

---

## 洞察 8: 進化應該有「方向」而非只有「改進」

### 現狀
- /evolve 聚焦於「完成目標」
- 成功後停止

### 轉換思維
進化應該有長期方向：
```yaml
evolution_direction:
  short_term: 完成當前任務
  medium_term: 建立可複用模式
  long_term: 形成新的 skill/capability

# 在每次成功後評估
post_success_check:
  - 這個解決方案可以泛化嗎？
  - 類似問題還會再遇到嗎？
  - 應該蒸餾成 skill 嗎？
```

**影響**: self-evolving-agent 不只「完成任務」而是「積累能力」

---

## 洞察 9: Starter Kit 應該支援「專案人格」

### 現狀
- 所有專案使用相同的規則和記憶結構
- 沒有專案特性概念

### 問題
- 量化交易專案和內容平台專案有不同需求
- 一套配置無法最佳化所有場景

### 改進方向
專案人格系統：
```yaml
# claude-starter-kit 新增 personas/
personas/
├── startup-mvp/
│   ├── rules/        # 偏向快速迭代
│   ├── memory/       # 簡化結構
│   └── skills/       # 最小集合
├── enterprise/
│   ├── rules/        # 偏向穩定可靠
│   ├── memory/       # 完整審計追蹤
│   └── skills/       # 安全+合規
└── research/
    ├── rules/        # 偏向探索實驗
    ├── memory/       # 深度記錄
    └── skills/       # 分析+視覺化
```

**影響**: starter-kit CLI 新增 persona 選擇，一鍵配置符合專案類型的環境

---

## 洞察 10: 生態系統應該有「健康指標」

### 現狀
- 各專案獨立維護
- 沒有整體健康度量

### 問題
- 不知道哪些 skills 最有用
- 不知道哪些組合最常見
- 不知道哪些功能被低估使用

### 改進方向
生態系統儀表板：
```yaml
ecosystem_health:
  skill_usage:
    most_loaded: [python, frontend, api-design]
    least_loaded: [edge-iot, desktop-apps]

  combination_patterns:
    top_3:
      - [python, database, api-design]
      - [frontend, backend, database]
      - [product-management, git-workflows]

  memory_insights:
    total_learnings: 1,234
    avg_learnings_per_project: 15
    most_common_failure_type: "C (環境問題)"

  evolution_stats:
    avg_iterations_to_success: 3.2
    most_used_strategy: "S1 (直接實現)"
```

**涌現效果**: 可以根據使用數據優化生態系統，增加熱門 skills，改進低使用 skills

---

## 實施優先級

| 洞察 | 類型 | 影響範圍 | 實施複雜度 |
|------|------|---------|-----------|
| #1 判斷力封裝 | 思維轉換 | 所有 skills | 低（指南）|
| #7 接口層 | 架構 | domain + software | 中 |
| #4 漸進式揭示 | 功能 | skillpkg | 高 |
| #6 情境描述 | 改進 | skillpkg MCP | 低 |
| #9 專案人格 | 功能 | starter-kit | 中 |
| #8 方向性進化 | 改進 | evolving-agent | 中 |
| #3 失敗免疫 | 功能 | evolving-agent | 高 |
| #2 遺忘曲線 | 功能 | memory system | 高 |
| #5 語義版本 | 標準 | 所有專案 | 低 |
| #10 健康指標 | 功能 | 新專案 | 高 |

---

## 總結

這些洞察的共同主題是：

1. **從「被動」到「主動」** - 系統應該主動優化，而非等待用戶操作
2. **從「記錄」到「學習」** - 記錄應該轉化為行為改變
3. **從「功能」到「判斷」** - 教 AI 如何決策，而非給 AI 知識
4. **從「個體」到「系統」** - 優化整體生態系統，而非單一組件

實施這些改進將使生態系統真正「自我進化」，而非只是「被人推動」。
