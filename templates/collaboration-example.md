# Collaboration 範例模板

> 複製此模板到你的 SKILL.md frontmatter，替換為實際的協作關係

---

## Frontmatter 模板

```yaml
---
name: your-skill-name
version: 1.0.0
collaboration:
  prerequisites:
    - skill: prerequisite-skill-id
      reason: Why this skill is needed first

  delegation_triggers:
    - trigger: When this situation occurs
      delegate_to: other-skill-id
      context: What context to pass

  receives_context_from:
    - skill: provider-skill-id
      receives:
        - Context item 1
        - Context item 2

  provides_context_to:
    - skill: consumer-skill-id
      provides:
        - Context item 1
        - Context item 2
---
```

---

## 完整範例

### Software Skill: Error Handling

```yaml
---
name: error-handling
version: 1.0.0
description: Robust error handling patterns and practices
collaboration:
  prerequisites:
    - skill: typescript
      reason: Type-safe error handling requires TypeScript knowledge

  delegation_triggers:
    - trigger: API error response design
      delegate_to: api-design
      context: Need standardized error response format
    - trigger: Error logging and monitoring
      delegate_to: observability
      context: Need structured logging setup

  receives_context_from:
    - skill: api-design
      receives:
        - HTTP status code conventions
        - Error response schema
        - Rate limiting error format
    - skill: backend
      receives:
        - Database error types
        - Service layer exceptions

  provides_context_to:
    - skill: observability
      provides:
        - Error categorization taxonomy
        - What to log on errors
        - Alert severity mapping
    - skill: testing-strategies
      provides:
        - Error scenarios to test
        - Mock error generators
---
```

### Domain Skill: Investment Analysis

```yaml
---
name: investment-analysis
version: 1.0.0
description: Fundamental and technical analysis for investment decisions
collaboration:
  prerequisites:
    - skill: data-analysis
      reason: Statistical analysis foundation
    - skill: python
      reason: Data processing and visualization

  delegation_triggers:
    - trigger: Building automated trading system
      delegate_to: quant-trading
      context: Need backtesting and execution framework
    - trigger: Creating analysis dashboard
      delegate_to: frontend
      context: Data visualization requirements
    - trigger: Storing historical data
      delegate_to: database
      context: Time series data modeling

  receives_context_from:
    - skill: data-analysis
      receives:
        - Statistical significance tests
        - Correlation analysis methods
        - Outlier detection techniques
    - skill: quant-trading
      receives:
        - Backtest results
        - Risk metrics (Sharpe, Sortino, Max Drawdown)

  provides_context_to:
    - skill: quant-trading
      provides:
        - Stock screening criteria
        - Valuation model outputs
        - Fundamental signals
    - skill: risk-management
      provides:
        - Position sizing recommendations
        - Portfolio correlation data
---
```

### Full-Stack Collaboration Network

```yaml
# frontend/SKILL.md
---
name: frontend
collaboration:
  prerequisites:
    - skill: typescript
      reason: Type-safe frontend development
    - skill: testing-strategies
      reason: Component and E2E testing

  delegation_triggers:
    - trigger: API integration needed
      delegate_to: api-design
      context: Need endpoint specifications
    - trigger: Real-time features
      delegate_to: backend
      context: WebSocket or SSE implementation

  receives_context_from:
    - skill: api-design
      receives:
        - API endpoint list
        - Request/response types
        - Authentication flow
    - skill: backend
      receives:
        - WebSocket event types
        - Server-sent events format

  provides_context_to:
    - skill: testing-strategies
      provides:
        - Component testing scenarios
        - User interaction flows
---

# backend/SKILL.md
---
name: backend
collaboration:
  prerequisites:
    - skill: typescript
      reason: Type-safe backend development
    - skill: error-handling
      reason: Robust error management
    - skill: api-design
      reason: RESTful API conventions

  delegation_triggers:
    - trigger: Database schema design
      delegate_to: database
      context: Data modeling requirements
    - trigger: Authentication implementation
      delegate_to: authentication
      context: Security requirements

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
        - Transaction patterns

  provides_context_to:
    - skill: frontend
      provides:
        - API endpoints list
        - Authentication flow
        - WebSocket events
    - skill: devops
      provides:
        - Deployment requirements
        - Environment variables
        - Health check endpoints
---

# database/SKILL.md
---
name: database
collaboration:
  prerequisites:
    - skill: backend
      reason: Database is used by backend services

  delegation_triggers:
    - trigger: Caching layer needed
      delegate_to: performance
      context: Query caching strategy
    - trigger: Data backup and recovery
      delegate_to: devops
      context: Disaster recovery requirements

  receives_context_from:
    - skill: backend
      receives:
        - Data access patterns
        - Query frequency
        - Transaction requirements

  provides_context_to:
    - skill: backend
      provides:
        - Connection pool settings
        - Query optimization hints
        - Index recommendations
    - skill: performance
      provides:
        - Slow query logs
        - Table statistics
---
```

---

## 協作模式範例

### 模式 1: 技術棧組合

```yaml
# 當建立 REST API 時，這三個 skills 應該一起使用
tech_stack_combo:
  primary: backend
  collaborators:
    - api-design  # 定義 endpoints
    - database    # 設計 schema
  flow:
    1. api-design: Define endpoints and contracts
    2. database: Design data schema
    3. backend: Implement business logic
```

### 模式 2: 領域 + 技術

```yaml
# 領域技能驅動，技術技能支援
domain_tech_combo:
  domain: quant-trading
  tech_support:
    - python      # 主要語言
    - database    # 時間序列存儲
    - backend     # API 服務
  flow:
    1. quant-trading: Define strategy requirements
    2. python: Implement algorithms
    3. database: Store market data
    4. backend: Expose as API
```

### 模式 3: 串聯協作

```yaml
# 全端功能的串聯流程
chain_collaboration:
  flow:
    - frontend → backend → database
  handoffs:
    frontend_to_backend:
      - API contract
      - Expected response format
    backend_to_database:
      - Data model
      - Query patterns
```

---

## 檢查清單

添加 Collaboration 前，確認：

- [ ] 前置條件是真正必要的（不是「nice to have」）
- [ ] 委派觸發條件具體明確
- [ ] 上下文傳遞有實際價值
- [ ] 沒有循環依賴
- [ ] 前置條件數量控制在 3-5 個以內
- [ ] 每個關係都有明確的原因或用途

---

## 在 Self-Evolving Agent 中的整合

當 Agent 載入帶有 collaboration 的 skill 時：

```
┌─────────────────────────────────────────────────────────────────┐
│  載入 skill: backend                                            │
│                                                                 │
│  📋 Collaboration 檢查                                          │
│                                                                 │
│  Prerequisites:                                                 │
│    ✅ typescript - 已載入                                       │
│    ✅ error-handling - 已載入                                   │
│    ⚠️ api-design - 建議載入                                     │
│                                                                 │
│  Delegation Triggers 已註冊:                                    │
│    • "Database schema design" → database                        │
│    • "Authentication implementation" → authentication           │
│                                                                 │
│  Context Available:                                             │
│    • 來自 api-design: Endpoint naming conventions              │
│    • 來自 database: Connection pool settings                   │
│                                                                 │
│  是否載入缺少的 prerequisites？[Y/n]                            │
└─────────────────────────────────────────────────────────────────┘
```
