# Collaboration 格式規範

> 定義技能之間的協作關係，讓 AI 知道何時該切換或組合技能

## 概念

**Collaboration**（協作網絡）定義了技能之間的顯式關係：
- 何時需要先具備某個技能（前置條件）
- 何時應該委派給另一個技能（委派觸發）
- 技能之間傳遞什麼上下文資訊

靈感來源：[vibeship-spawner-skills](https://github.com/vibeforge1111/vibeship-spawner-skills)

---

## 格式

在 SKILL.md 的 frontmatter 中添加 `collaboration` 區塊：

```yaml
---
name: error-handling
version: 1.0.0
collaboration:
  prerequisites:
    - skill: typescript-strict
      reason: Need type-safe error handling
  delegation_triggers:
    - trigger: API error responses
      delegate_to: api-design
      context: Error response format
  receives_context_from:
    - skill: api-design
      receives:
        - Expected error format
        - Status code conventions
  provides_context_to:
    - skill: observability
      provides:
        - What to log on errors
        - Error categorization
---
```

---

## 區塊說明

### Prerequisites（前置條件）

定義使用此技能前需要先具備的技能：

```yaml
prerequisites:
  - skill: typescript-strict
    reason: Type-safe error handling requires strict types
  - skill: testing-strategies
    reason: Error handling should be tested
```

**欄位**：
| 欄位 | 必要 | 說明 |
|------|------|------|
| skill | ✅ | 前置技能的 ID |
| reason | ✅ | 為什麼需要這個技能 |

### Delegation Triggers（委派觸發）

定義何時應該切換到另一個技能：

```yaml
delegation_triggers:
  - trigger: API error responses
    delegate_to: api-design
    context: Need to design error response format
  - trigger: Performance issues
    delegate_to: performance
    context: Need to optimize error handling path
```

**欄位**：
| 欄位 | 必要 | 說明 |
|------|------|------|
| trigger | ✅ | 觸發委派的情境描述 |
| delegate_to | ✅ | 要委派給的技能 ID |
| context | ⭕ | 傳遞給目標技能的上下文 |

### Receives Context From（接收上下文）

定義從其他技能接收什麼資訊：

```yaml
receives_context_from:
  - skill: api-design
    receives:
      - Expected error format
      - Status code conventions
      - Rate limiting errors
```

**欄位**：
| 欄位 | 必要 | 說明 |
|------|------|------|
| skill | ✅ | 提供上下文的技能 ID |
| receives | ✅ | 接收的資訊列表 |

### Provides Context To（提供上下文）

定義向其他技能提供什麼資訊：

```yaml
provides_context_to:
  - skill: observability
    provides:
      - What to log on errors
      - Error categorization
      - Alert thresholds
```

**欄位**：
| 欄位 | 必要 | 說明 |
|------|------|------|
| skill | ✅ | 接收上下文的技能 ID |
| provides | ✅ | 提供的資訊列表 |

---

## 完整範例

### Backend Skill

```yaml
---
name: backend
version: 1.0.0
collaboration:
  prerequisites:
    - skill: typescript
      reason: Type-safe backend development
    - skill: error-handling
      reason: Robust error management

  delegation_triggers:
    - trigger: API endpoint design
      delegate_to: api-design
      context: RESTful conventions needed
    - trigger: Database schema design
      delegate_to: database
      context: Data modeling required
    - trigger: Authentication flow
      delegate_to: authentication
      context: Security implementation

  receives_context_from:
    - skill: api-design
      receives:
        - Endpoint naming conventions
        - Request/response formats
        - Versioning strategy
    - skill: database
      receives:
        - Connection pool settings
        - Query optimization hints

  provides_context_to:
    - skill: frontend
      provides:
        - API endpoints list
        - Authentication flow
        - WebSocket events
    - skill: testing-strategies
      provides:
        - Integration test scenarios
        - Mock data structures
---
```

### Quant Trading Skill（領域技能）

```yaml
---
name: quant-trading
version: 1.0.0
collaboration:
  prerequisites:
    - skill: python
      reason: Primary language for quant
    - skill: database
      reason: Time series data storage
    - skill: data-analysis
      reason: Statistical analysis

  delegation_triggers:
    - trigger: Web-based dashboard
      delegate_to: frontend
      context: Trading dashboard UI
    - trigger: Real-time data streaming
      delegate_to: backend
      context: WebSocket implementation
    - trigger: Cloud deployment
      delegate_to: devops
      context: Trading system infrastructure

  receives_context_from:
    - skill: data-analysis
      receives:
        - Statistical tests to use
        - Data cleaning methods
    - skill: database
      receives:
        - Time series optimization
        - Partitioning strategies

  provides_context_to:
    - skill: investment-analysis
      provides:
        - Backtest results
        - Risk metrics
        - Position sizing
---
```

---

## 協作圖視覺化

```
                    ┌─────────────┐
                    │ typescript  │
                    └──────┬──────┘
                           │ prerequisite
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  api-design │────▶│   backend   │────▶│  frontend   │
└─────────────┘     └──────┬──────┘     └─────────────┘
      provides              │ delegates
      context               ▼
                    ┌─────────────┐
                    │  database   │
                    └─────────────┘
```

---

## 在 Self-Evolving Agent 中的使用

### Plan 階段檢查

```
┌─────────────────────────────────────────────────────────┐
│  📋 Collaboration 檢查                                  │
│                                                         │
│  當前技能：backend                                      │
│  任務：實作用戶認證 API                                │
│                                                         │
│  ✅ Prerequisites 滿足：                                │
│     - typescript ✓                                     │
│     - error-handling ✓                                 │
│                                                         │
│  ⚠️ Delegation 建議：                                  │
│     - 觸發：Authentication flow                        │
│     - 建議載入：authentication skill                   │
│                                                         │
│  📥 可用上下文：                                        │
│     - 來自 api-design：Endpoint naming conventions     │
│                                                         │
│  是否載入 authentication skill？[Y/n]                  │
└─────────────────────────────────────────────────────────┘
```

### recommend_skills 整合

```javascript
// recommend_skills 會考慮 collaboration 關係
const result = await recommend_skills({
  goal: "建立量化交易系統"
});

// 返回包含依賴關係的推薦
{
  domain_skills: [
    { name: "quant-trading", confidence: 0.95 }
  ],
  software_skills: [
    { name: "python", confidence: 0.90, reason: "prerequisite" },
    { name: "database", confidence: 0.85, reason: "prerequisite" },
    { name: "data-analysis", confidence: 0.80, reason: "prerequisite" }
  ],
  from_dependencies: ["python", "database", "data-analysis"]
}
```

---

## 協作模式

### 模式 1：技術棧組合

```yaml
# backend + api-design + database
collaboration_patterns:
  tech_stack_combo:
    when: Building REST API
    flow:
      - api-design: Define endpoints
      - database: Design schema
      - backend: Implement logic
```

### 模式 2：領域 + 技術

```yaml
# quant-trading + python + database
collaboration_patterns:
  domain_tech:
    when: Domain-specific application
    flow:
      - domain_skill: Provide requirements
      - software_skills: Handle implementation
```

### 模式 3：串聯協作

```yaml
# frontend → backend → database
collaboration_patterns:
  chain:
    when: Full-stack feature
    flow:
      - frontend: UI design
      - backend: API implementation
      - database: Data persistence
```

---

## 最佳實踐

### DO

- 只定義真正需要的前置條件
- 委派觸發要具體（不是「有問題時」）
- 上下文傳遞要有實際價值
- 保持協作關係可維護

### DON'T

- 不要創建循環依賴
- 不要定義太多前置條件（3-5 個為佳）
- 不要讓每個技能都相互關聯
- 不要傳遞過於籠統的上下文

---

## 與其他區塊的關係

| Collaboration | Sharp Edges | Validations |
|---------------|-------------|-------------|
| 定義技能關係 | 記錄陷阱 | 自動檢查 |
| 影響 recommend_skills | 影響 Plan 階段警告 | 影響 Check 階段 |
| 結構化在 frontmatter | Markdown 區塊 | Markdown 區塊 |
