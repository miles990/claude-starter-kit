---
date: 2026-01-08
type: pattern
confidence: high
related_skills: [self-evolving-agent, claude-software-skills, claude-domain-skills]
---

# Skill 三層強化架構實作洞察

## 發現

在實作 Spawner Skills 的三個核心功能時，發現它們形成一個完整的「技能品質保證」架構：

```
┌─────────────────────────────────────────────────────────────────┐
│  Skill 品質保證三層架構                                         │
│                                                                 │
│  Plan 階段                Do 階段               Check 階段      │
│  ┌──────────┐           ┌──────────┐          ┌──────────┐     │
│  │ Sharp    │    →      │ 執行任務 │    →     │Validations│    │
│  │ Edges    │           │ (帶著    │          │ (執行後  │     │
│  │ (預防)   │           │  警告)   │          │  驗證)   │     │
│  └──────────┘           └──────────┘          └──────────┘     │
│       ↓                                             ↑           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Collaboration                          │  │
│  │  當任務需要其他領域知識時，自動委派和傳遞上下文           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 關鍵洞察

### 1. 功能是互補而非獨立的

| 功能 | 觸發時機 | 作用 |
|------|----------|------|
| Sharp Edges | Plan 階段 | 預防錯誤（事前警告） |
| Collaboration | 任務邊界 | 能力擴展（跨域委派） |
| Validations | Check 階段 | 品質保證（事後驗證） |

### 2. YAML Frontmatter 是最佳載體

將 Collaboration 放在 YAML frontmatter 中而非 markdown 正文的優點：
- 結構化，易於程式解析
- 與 skillpkg 格式相容
- 可以被工具自動處理（如生成依賴圖）

### 3. Delegation Triggers 需要精確設計

太廣泛的 trigger 會造成不必要的委派：
```yaml
# ❌ 太廣泛
delegation_triggers:
  - trigger: "需要資料"
    delegate_to: database

# ✅ 精確
delegation_triggers:
  - trigger: "Database schema design or query optimization"
    delegate_to: database
    context: Data modeling, indexing strategy
```

### 4. Context Passing 建立「知識流」

```
frontend ←── API endpoints list, Auth flow ←── backend
    │                                            │
    │                                            ↓
    └── Integration test patterns ──────→ testing-strategies
```

技能之間的 `provides_context_to` 和 `receives_context_from` 形成一個知識流網絡，讓相關技能能夠：
- 避免重複定義相同概念
- 確保術語一致性
- 建立專業知識的依賴關係

## 觸發情境

實作 Spawner Integration spec 時，需要在 5 個專案中添加三種功能。

## 潛在應用

1. **Skill Linter**: 工具可以檢查 skill 是否缺少 sharp_edges 或 validations
2. **Dependency Graph**: 從 collaboration 區塊生成技能依賴圖
3. **Smart Loading**: self-evolving-agent 可以根據 delegation_triggers 預載相關 skills
4. **Coverage Report**: 追蹤哪些 skills 有完整的三層保護

## 後續行動

- [x] 完成 5 個 domain skills 的 Sharp Edges
- [x] 完成 5 個 software skills 的 Sharp Edges + Validations
- [x] 完成 5 個 core skills 的 Collaboration
- [x] 更新 self-evolving-agent PDCA
- [x] 更新所有 README
- [ ] 未來：建立自動化 Skill Linter
- [ ] 未來：視覺化 Collaboration 網絡
