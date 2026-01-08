# Tasks: Ecosystem Intelligence

> 生態系統智能化實施任務

## Milestone 1: Skill Matching Engine

### Task 1.1: Keyword Index Schema
- [ ] 擴展 SKILL.md schema 支援 triggers/keywords

**Files**: `skillpkg/packages/core/src/parser/schema.ts`
**Requirements**: US-1

**_Prompt**:
```
Role: Schema Designer
Task: 擴展 SKILL.md frontmatter schema，新增 triggers 欄位支援關鍵詞匹配
_Leverage: 現有 schema.ts 的 zod validation
_Requirements: US-1 動態 Skill 推薦
Success: schema 可解析 triggers.keywords.primary/secondary, context_boost, context_penalty, priority
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

### Task 1.2: Matching Engine Core
- [ ] 實現 MatchingEngine 類別

**Files**: `skillpkg/packages/core/src/matching/engine.ts`
**Requirements**: US-1

**_Prompt**:
```
Role: Algorithm Developer
Task: 實現 MatchingEngine，包含 extractKeywords, matchSkills, calculateConfidence 方法
_Leverage: 設計文檔中的 interface 定義
_Requirements: US-1 動態 Skill 推薦
Success: engine.analyze(goal) 返回正確的 SkillRecommendation
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

### Task 1.3: recommend_skills MCP Tool
- [ ] 新增 recommend_skills MCP tool

**Files**: `skillpkg/packages/mcp-server/src/tools/recommend-skills.ts`
**Requirements**: US-1, US-3

**_Prompt**:
```
Role: MCP Developer
Task: 實現 recommend_skills tool，整合 MatchingEngine，返回推薦結果
_Leverage: 現有 MCP tool 結構，MatchingEngine
_Requirements: US-1, US-3 (research_mode 判斷)
Success: MCP tool 可被 Claude 調用，返回 SkillRecommendation
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

---

## Milestone 2: Cross-Domain Dependencies

### Task 2.1: Schema Extension for software-skills
- [ ] 擴展依賴 schema 支援 software-skills

**Files**: `skillpkg/packages/core/src/parser/schema.ts`
**Requirements**: US-2

**_Prompt**:
```
Role: Schema Designer
Task: 在 dependencies 下新增 software-skills 欄位，支援跨類型依賴聲明
_Leverage: 現有 dependencies.skills 結構
_Requirements: US-2 跨域依賴自動解析
Success: schema 可解析 dependencies.software-skills 陣列
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

### Task 2.2: DependencyResolver Update
- [ ] 更新 DependencyResolver 處理跨類型依賴

**Files**: `skillpkg/packages/core/src/resolver/dependency-resolver.ts`
**Requirements**: US-2

**_Prompt**:
```
Role: Core Developer
Task: 擴展 DependencyResolver，新增 resolveSoftwareDeps 方法，處理 domain → software 依賴
_Leverage: 現有 resolver 邏輯
_Requirements: US-2 跨域依賴自動解析
Success: install quant-trading 時自動解析並返回 python, database 依賴
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

### Task 2.3: Add Dependencies to Domain Skills
- [ ] 為 domain skills 添加 software-skills 依賴聲明

**Files**:
- `claude-domain-skills/finance/quant-trading/SKILL.md`
- `claude-domain-skills/finance/investment-analysis/SKILL.md`
- `claude-domain-skills/creative/game-design/SKILL.md`
- (其他 17 個 domain skills)

**Requirements**: US-2

**_Prompt**:
```
Role: Skill Maintainer
Task: 為所有 20 個 domain skills 添加適當的 software-skills 依賴
_Leverage: interfaces/ 映射文件
_Requirements: US-2 跨域依賴自動解析
Success: 每個 domain skill 都有合理的 software 依賴聲明
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

---

## Milestone 3: Interface Layer ✅

### Task 3.1: Finance → Tech Interface
- [x] 建立 Finance 領域接口文件

**Files**: `templates/interfaces/finance-to-tech.md`
**Requirements**: US-4

### Task 3.2: Business → Tech Interface
- [x] 建立 Business 領域接口文件

**Files**: `templates/interfaces/business-to-tech.md`
**Requirements**: US-4

### Task 3.3: Creative → Tech Interface
- [x] 建立 Creative 領域接口文件

**Files**: `templates/interfaces/creative-to-tech.md`
**Requirements**: US-4

---

## Milestone 4: Self-Evolving Agent Integration

### Task 4.1: Phase 1 Integration
- [ ] 在 evolving-agent Phase 1 整合 recommend_skills

**Files**: `self-evolving-agent/SKILL.md`
**Requirements**: US-1

**_Prompt**:
```
Role: Agent Developer
Task: 更新 Phase 1 目標分析，加入 recommend_skills 調用和用戶確認流程
_Leverage: 現有 Phase 1 結構
_Requirements: US-1 動態 Skill 推薦
Success: /evolve 時自動推薦 skills 並等待用戶確認
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

### Task 4.2: Research Mode
- [ ] 實現研究模式觸發和流程

**Files**: `self-evolving-agent/SKILL.md`
**Requirements**: US-3

**_Prompt**:
```
Role: Agent Developer
Task: 當 recommend_skills 返回 research_mode: true 時，提供研究模式選項
_Leverage: Phase 3 Reflexion 結構
_Requirements: US-3 研究模式
Success: 信心分數 < 0.5 時提示研究模式選項
Instructions: 完成後用 log-implementation 記錄，然後標記 [x]
```

---

## Milestone 5: Keyword Index Population

### Task 5.0: Triggers Format & Templates ✅
- [x] 建立 triggers 格式文檔與範例

**Files**:
- `templates/skill-triggers/README.md` - 格式規範
- `templates/skill-triggers/examples/quant-trading-triggers.yaml`
- `templates/skill-triggers/examples/frontend-triggers.yaml`
- `templates/skill-triggers/examples/python-triggers.yaml`

**Requirements**: US-1

### Task 5.1: Add Triggers to Domain Skills
- [ ] 為 20 個 domain skills 添加 triggers/keywords

**Files**: `claude-domain-skills/**/SKILL.md` (20 個檔案)
**Requirements**: US-1

### Task 5.2: Add Triggers to Software Skills
- [ ] 為 49 個 software skills 添加 triggers/keywords

**Files**: `claude-software-skills/**/SKILL.md` (49 個檔案)
**Requirements**: US-1

---

## Progress Summary

| Milestone | Tasks | Status |
|-----------|-------|--------|
| 1. Matching Engine | 3 | Pending |
| 2. Cross-Domain Deps | 3 | Pending |
| 3. Interface Layer | 3 | ✅ Complete |
| 4. Agent Integration | 2 | Pending |
| 5. Keyword Index | 3 | 1/3 (Templates ✅) |
| **Total** | **14** | **4/14** |
