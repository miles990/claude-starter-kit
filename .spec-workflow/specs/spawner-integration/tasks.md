# Tasks: Spawner Integration

> 基於 Spawner Skills 研究的生態系統優化任務

---

## Milestone 1: Sharp Edges 整合

### Task 1.1: Sharp Edges 格式定義
- [x] 在 claude-starter-kit 建立 Sharp Edges 格式範例

**Files**:
- `claude-starter-kit/docs/SHARP_EDGES_FORMAT.md`
- `claude-starter-kit/templates/sharp-edges-example.md`

**Requirements**: US-1

**_Prompt**:
```
Role: Documentation Writer
Task: 建立 Sharp Edges 格式規範和範例，包含所有必要欄位（id, summary, severity, situation, symptoms, detection_pattern, solution）
_Leverage: .claude/memory/discoveries/2025-01-08-spawner-skills-analysis.md
_Requirements: US-1 Sharp Edges 整合
Success: 文檔清楚說明格式，範例可直接複製使用
Instructions: 完成後設為 [-]，用 log-implementation 記錄，然後標記 [x]
Start: "Implement task for spec spawner-integration, first run spec-workflow-guide"
```

### Task 1.2: 為 5 個 Domain Skills 添加 Sharp Edges
- [ ] 為高價值 domain skills 添加 sharp edges 區塊

**Files**:
- `claude-domain-skills/finance/quant-trading/SKILL.md`
- `claude-domain-skills/finance/investment-analysis/SKILL.md`
- `claude-domain-skills/creative/game-design/SKILL.md`
- `claude-domain-skills/marketing/growth-hacking/SKILL.md`
- `claude-domain-skills/education/curriculum-design/SKILL.md`

**Requirements**: US-1

**_Prompt**:
```
Role: Domain Expert
Task: 為每個 domain skill 添加 3-5 個領域特有的 sharp edges（常見陷阱）
_Leverage: 領域知識、Sharp Edges 格式規範
_Requirements: US-1 Sharp Edges 整合
Success: 每個 skill 有 3-5 個具體、可行動的 sharp edges
Instructions: 每完成一個 skill 就 commit，完成後標記 [x]
```

### Task 1.3: 為 5 個 Software Skills 添加 Sharp Edges
- [ ] 為高價值 software skills 添加 sharp edges 區塊

**Files**:
- `claude-software-skills/backend/SKILL.md`
- `claude-software-skills/frontend/SKILL.md`
- `claude-software-skills/api-design/SKILL.md`
- `claude-software-skills/error-handling/SKILL.md`
- `claude-software-skills/testing-strategies/SKILL.md`

**Requirements**: US-1

**_Prompt**:
```
Role: Software Engineer
Task: 為每個 software skill 添加 3-5 個技術陷阱，包含 detection_pattern（正則）
_Leverage: Sharp Edges 格式規範、程式設計最佳實踐
_Requirements: US-1 Sharp Edges 整合
Success: 每個 skill 有可檢測的 sharp edges
Instructions: 每完成一個 skill 就 commit，完成後標記 [x]
```

---

## Milestone 2: Validations 整合

### Task 2.1: Validations 格式定義
- [x] 建立 Validations 格式規範和範例

**Files**:
- `claude-starter-kit/docs/VALIDATIONS_FORMAT.md`
- `claude-starter-kit/templates/validations-example.md`

**Requirements**: US-2

**_Prompt**:
```
Role: Documentation Writer
Task: 建立 Validations 格式規範，包含 regex 和 ast 兩種類型的範例
_Leverage: Spawner Skills 分析
_Requirements: US-2 Validations 整合
Success: 格式規範清晰，範例可執行
Instructions: 完成後標記 [x]
```

### Task 2.2: 為 5 個 Software Skills 添加 Validations
- [ ] 為技術 skills 添加可執行的 validations

**Files**:
- `claude-software-skills/backend/SKILL.md`
- `claude-software-skills/frontend/SKILL.md`
- `claude-software-skills/api-design/SKILL.md`
- `claude-software-skills/error-handling/SKILL.md`
- `claude-software-skills/typescript/SKILL.md`

**Requirements**: US-2

**_Prompt**:
```
Role: Code Quality Engineer
Task: 為每個 software skill 添加 2-3 個可執行的 validation rules
_Leverage: Validations 格式規範、ESLint 規則參考
_Requirements: US-2 Validations 整合
Success: 每個 validation 有完整的 pattern、message、fix_action
Instructions: 每完成一個 skill 就 commit，完成後標記 [x]
```

---

## Milestone 3: Collaboration 網絡

### Task 3.1: Collaboration 格式定義
- [x] 建立 Collaboration 格式規範

**Files**:
- `claude-starter-kit/docs/COLLABORATION_FORMAT.md`
- `claude-starter-kit/templates/collaboration-example.md`

**Requirements**: US-3

**_Prompt**:
```
Role: System Architect
Task: 建立 Collaboration 格式規範，涵蓋 prerequisites, delegation_triggers, context_passing
_Leverage: Spawner Skills 分析
_Requirements: US-3 Collaboration 網絡
Success: 格式能表達複雜的技能間協作關係
Instructions: 完成後標記 [x]
```

### Task 3.2: 定義核心 Skill 協作關係
- [ ] 為 5 個核心 skills 定義協作關係

**Files**:
- `claude-software-skills/backend/SKILL.md` (collaboration section)
- `claude-software-skills/api-design/SKILL.md`
- `claude-software-skills/database/SKILL.md`
- `claude-software-skills/error-handling/SKILL.md`
- `claude-software-skills/testing-strategies/SKILL.md`

**Requirements**: US-3

**_Prompt**:
```
Role: System Architect
Task: 為核心技術 skills 定義相互協作關係，包含何時委派和傳遞什麼上下文
_Leverage: Collaboration 格式規範、技能使用經驗
_Requirements: US-3 Collaboration 網絡
Success: Skills 之間有清晰的協作路徑
Instructions: 每完成一個 skill 就 commit，完成後標記 [x]
```

---

## Milestone 4: Self-Evolving Agent 整合

### Task 4.1: 更新 PDCA Plan 階段
- [ ] 在 Plan 階段整合 sharp_edges 檢查

**Files**: `self-evolving-agent/SKILL.md`
**Requirements**: US-1, US-3

**_Prompt**:
```
Role: Agent Developer
Task: 更新 PDCA Plan 階段，加入 sharp_edges 警告檢查和 delegation_triggers 判斷
_Leverage: 現有 PDCA 結構
_Requirements: US-1, US-3
Success: Plan 階段會主動警告相關陷阱和建議委派
Instructions: 完成後標記 [x]
```

### Task 4.2: 更新 PDCA Check 階段
- [ ] 在 Check 階段整合 validations 驗證

**Files**: `self-evolving-agent/SKILL.md`
**Requirements**: US-2

**_Prompt**:
```
Role: Agent Developer
Task: 更新 PDCA Check 階段，加入建議執行 validate_skill 的提示
_Leverage: 現有 Check 結構
_Requirements: US-2
Success: Check 階段會建議執行代碼驗證
Instructions: 完成後標記 [x]
```

---

## Milestone 5: 文件更新

### Task 5.1: 更新智能生態系統指南
- [ ] 更新 INTELLIGENT_ECOSYSTEM_GUIDE.md 包含新功能

**Files**: `claude-starter-kit/docs/INTELLIGENT_ECOSYSTEM_GUIDE.md`
**Requirements**: US-5

**_Prompt**:
```
Role: Technical Writer
Task: 更新指南，添加 Sharp Edges、Validations、Collaboration 三個新章節
_Leverage: 新建立的格式文檔
_Requirements: US-5 教學文件
Success: 指南完整涵蓋所有新功能，有範例
Instructions: 完成後標記 [x]
```

### Task 5.2: 更新 README
- [ ] 更新各專案 README 提及新功能

**Files**:
- `claude-starter-kit/README.md`
- `claude-software-skills/README.md`
- `claude-domain-skills/README.md`

**Requirements**: US-5

**_Prompt**:
```
Role: Technical Writer
Task: 在 README 中簡要提及新功能（Sharp Edges、Validations、Collaboration）
_Leverage: 新文檔
_Requirements: US-5
Success: 用戶能快速了解新功能存在
Instructions: 完成後標記 [x]
```

---

## Milestone 6: 涌現記錄

### Task 6.1: 記錄實作過程中的發現
- [ ] 持續記錄意外發現到 discoveries/

**Files**: `claude-starter-kit/.claude/memory/discoveries/`
**Requirements**: N/A (涌現追蹤)

**_Prompt**:
```
Role: Knowledge Curator
Task: 在實作過程中記錄任何非預期的發現、連結或洞察
_Leverage: 現有 memory 系統
Success: 至少記錄 3 個有價值的發現
Instructions: 發現即記錄，每個發現單獨 commit
```

---

## Progress Summary

| Milestone | Tasks | Status |
|-----------|-------|--------|
| 1. Sharp Edges | 3 | 1/3 |
| 2. Validations | 2 | 1/2 |
| 3. Collaboration | 2 | 1/2 |
| 4. Agent Integration | 2 | Pending |
| 5. Documentation | 2 | Pending |
| 6. Emergence | 1 | Ongoing |
| **Total** | **12** | **3/12** |

---

## Execution Order

建議執行順序（考慮依賴關係）：

1. **Task 1.1** → Sharp Edges 格式（其他任務依賴此格式）
2. **Task 2.1** → Validations 格式
3. **Task 3.1** → Collaboration 格式
4. **Task 1.2, 1.3** → 添加 Sharp Edges（可平行）
5. **Task 2.2** → 添加 Validations
6. **Task 3.2** → 定義協作關係
7. **Task 4.1, 4.2** → Agent 整合
8. **Task 5.1, 5.2** → 文件更新
9. **Task 6.1** → 持續進行

---

## Notes

- 每完成一個檔案就 commit
- 發現任何有趣的連結或模式，立即記錄到 discoveries/
- 使用 `--emergence` flag 保持探索心態
