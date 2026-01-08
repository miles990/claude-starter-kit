# Requirements: Spawner Integration

> 基於 vibeship-spawner-skills 研究，整合 4 文件系統創新到生態系統

## Background

分析了 [vibeship-spawner-skills](https://github.com/vibeforge1111/vibeship-spawner-skills) 專案後，發現以下創新值得整合：

| 創新 | 價值 |
|------|------|
| **sharp-edges.yaml** | 系統化踩坑陷阱庫 |
| **validations.yaml** | 可執行的自動檢查規則 |
| **collaboration.yaml** | 技能間協作網絡 |
| **MCP 工具** | spawner_validate, spawner_suggest |

詳見：`.claude/memory/discoveries/2025-01-08-spawner-skills-analysis.md`

---

## User Stories

### US-1: Sharp Edges 整合

**作為** AI 開發者
**我想要** 在 SKILL.md 中看到該領域的常見陷阱
**以便** 我能主動避免踩坑，而不是事後學習

**驗收標準**：
- [ ] SKILL.md 支援 `## Sharp Edges` 區塊
- [ ] 每個陷阱有：情境、症狀、檢測模式、解決方案
- [ ] 至少 5 個 domain skills 和 5 個 software skills 有 sharp edges

**範例**：
```markdown
## Sharp Edges

### SE-1: 空的 catch block
- **嚴重度**: critical
- **情境**: 支付流程靜默失敗，用戶以為成功
- **症狀**: 用戶幾天後才報告問題
- **檢測**: `catch.*\{\s*\}`
- **解決**: 加入 logger.error 和 rethrow
```

---

### US-2: Validations 整合

**作為** 代碼品質維護者
**我想要** Skill 中的最佳實踐能自動檢查
**以便** 問題在開發時就被發現，而非 code review

**驗收標準**：
- [ ] SKILL.md 支援 `## Validations` 區塊
- [ ] 每個 validation 有：名稱、類型、模式、訊息
- [ ] skillpkg 新增 `validate_skill` MCP tool
- [ ] 可整合到 Claude Code hooks（PostToolUse）

**範例**：
```markdown
## Validations

### V-1: 禁止空 catch
- **類型**: regex
- **模式**: `catch.*\{\s*\}`
- **訊息**: "Empty catch block swallows errors"
- **適用**: `*.ts`, `*.js`
- **修復建議**: "Add proper error logging"
```

---

### US-3: Collaboration 網絡

**作為** 使用多個 skills 的開發者
**我想要** skills 之間有明確的協作關係
**以便** 知道何時該切換到另一個 skill

**驗收標準**：
- [ ] SKILL.md 支援 `## Collaboration` 區塊
- [ ] 包含：prerequisites, delegation_triggers, context_passing
- [ ] recommend_skills 能根據 collaboration 建議組合

**範例**：
```markdown
## Collaboration

### Prerequisites
- `typescript-strict` - 需要嚴格類型檢查

### Delegation Triggers
- 當遇到「API 錯誤回應」→ 委派給 `api-design`
- 當遇到「效能問題」→ 委派給 `performance`

### Receives Context From
- `api-design`: 預期的錯誤格式、狀態碼慣例

### Provides Context To
- `observability`: 何時記錄錯誤、錯誤分類
```

---

### US-4: MCP 工具擴展

**作為** Claude Code 使用者
**我想要** 能主動驗證代碼和獲得改進建議
**以便** 在開發過程中持續改善品質

**驗收標準**：
- [ ] `validate_skill` - 執行當前 skill 的 validations
- [ ] `suggest_improvement` - 基於 sharp-edges 推薦改進
- [ ] 工具結果可 actionable

---

### US-5: 教學文件

**作為** 新用戶
**我想要** 清楚的使用指南
**以便** 快速上手並理解生態系統

**驗收標準**：
- [ ] `docs/INTELLIGENT_ECOSYSTEM_GUIDE.md` 更新包含新功能
- [ ] 每個新功能有範例
- [ ] Quick Start 部分簡潔明瞭

---

## Scope

### In Scope

| 項目 | 說明 |
|------|------|
| skillpkg | 擴展 schema 和 MCP tools |
| self-evolving-agent | 整合 collaboration 和 validation |
| claude-domain-skills | 為 5+ skills 添加新區塊 |
| claude-software-skills | 為 5+ skills 添加新區塊 |
| claude-starter-kit | 更新文件和範例 |

### Out of Scope

| 項目 | 原因 |
|------|------|
| 完整 4 文件分離 | 保持 SKILL.md 單一文件簡潔性 |
| IDE 外掛 | 超出當前範圍 |
| 所有 skills 添加 | 先做 10 個驗證概念 |

---

## Success Metrics

| 指標 | 目標 |
|------|------|
| Sharp Edges 覆蓋率 | 10+ skills 有 sharp edges |
| Validation 覆蓋率 | 10+ skills 有 validations |
| Collaboration 定義 | 5+ skills 有協作關係 |
| 文件完整度 | 100% 新功能有文件 |
| 用戶可用性 | 一個命令開始使用 |

---

## Dependencies

- 現有 ecosystem-intelligence spec（Milestone 1-2 完成後更佳）
- skillpkg MCP server 運作中
- `.claude/memory/discoveries/2025-01-08-spawner-skills-analysis.md`

---

## Timeline Priority

1. **Phase 1**: Sharp Edges + Validations（結構化知識）
2. **Phase 2**: Collaboration 網絡（技能協作）
3. **Phase 3**: MCP 工具（自動化）
4. **Phase 4**: 文件（用戶體驗）
