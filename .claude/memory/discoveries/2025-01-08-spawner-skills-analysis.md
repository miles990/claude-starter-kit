---
date: 2025-01-08
tags: [spawner-skills, skill-format, collaboration, validation, sharp-edges]
source: https://github.com/vibeforge1111/vibeship-spawner-skills
type: external-analysis
status: actionable
---

# Spawner Skills 分析：4 文件系統的創新

> 來源：vibeforge1111/vibeship-spawner-skills (462 個技能)

## 核心發現：4 文件 vs 單一 SKILL.md

### 對比表

| 方面 | SKILL.md (我們) | 4 文件系統 (Spawner) |
|------|-----------------|---------------------|
| 技能定義 | frontmatter + markdown | skill.yaml |
| 錯誤防護 | 無 | **sharp-edges.yaml** |
| 自動檢查 | 無 | **validations.yaml** |
| 跨技能協作 | interfaces/ (部分) | **collaboration.yaml** |
| 文件大小 | 可能很長 | 模組化、分離關注點 |
| IDE 整合 | 難 | 可直接整合 ESLint |

---

## 創新 1: sharp-edges.yaml（踩坑陷阱庫）

**概念**：系統化記錄每個領域的常見錯誤

```yaml
sharp_edges:
  - id: swallowing-errors
    summary: Catching errors and doing nothing
    severity: critical
    situation: |
      Payment fails silently. User thinks payment went through.
    why: |
      Empty catch blocks hide failures.
    symptoms:
      - "Silent failures"
      - "Users report issues days later"
    detection_pattern: "catch.*\\{\\s*\\}"
    solution: |
      // WRONG
      try { await processPayment(); }
      catch (e) { /* Silent */ }

      // RIGHT
      catch (error) {
        logger.error({ error }, "Payment failed");
        throw error;
      }
```

**價值**：
- 將「踩坑經驗」結構化
- 每個陷阱有：情境、原因、症狀、檢測、解決方案
- 比 failures/ 更系統化

**建議整合**：
- 在 .claude/memory/ 新增 `sharp-edges/` 目錄
- 或在 SKILL.md 新增 `## Sharp Edges` 區塊

---

## 創新 2: validations.yaml（自動檢查規則）

**概念**：可執行的代碼品質規則

```yaml
validations:
  - id: empty-catch
    name: Empty catch block
    severity: critical
    type: regex
    pattern: "catch.*\\{\\s*\\}"
    message: "Empty catch block swallows errors"
    fix_action: "Add proper error logging"
    applies_to: ["*.ts", "*.js"]
```

**價值**：
- 將最佳實踐轉為自動化規則
- 可整合到 IDE、CI/CD
- 不再是「讀了才知道」，而是「自動提醒」

**建議整合**：
- 為關鍵 skills 添加 validations
- 整合到 Claude Code hooks（PostToolUse 檢查）
- 或生成 ESLint 規則

---

## 創新 3: collaboration.yaml（協作網絡）🌟

**這是最重要的創新**

```yaml
prerequisites:
  required:
    - skill: typescript-strict
      reason: "Type-safe error handling"

delegation_triggers:
  - trigger: "API error responses"
    delegate_to: api-design
    context: "Error response format"

receives_context_from:
  - skill: api-design
    receives: ["Expected error format", "Status code conventions"]

provides_context_to:
  - skill: observability
    provides: ["What to log on errors", "Error categorization"]

collaboration_patterns:
  with_nextjs:
    when: "Next.js App Router"
    approach: |
      // 具體的協作代碼...
```

**價值**：
- **顯式依賴**：不再靠 AI 猜測技能間關係
- **委派觸發**：明確何時切換到另一個技能
- **上下文傳遞**：技能間傳遞什麼資訊
- **協作模式**：具體的整合代碼

**對比我們的 interfaces/**：
- 我們的 interfaces 是「領域→技術」的映射
- Spawner 的 collaboration 是「技能→技能」的雙向網絡
- 我們缺少：delegation_triggers、context 傳遞

---

## 創新 4: MCP 工具整合

Spawner 提供 6 個 MCP 工具：

| 工具 | 功能 | 對應我們的 |
|------|------|-----------|
| `spawner_orchestrate` | 自動路由到正確技能 | recommend_skills |
| `spawner_validate` | 執行驗證規則 | **缺失** |
| `spawner_remember` | 保存決策 | memory 系統 |
| `spawner_suggest` | 推薦改進 | **缺失** |
| `spawner_unstick` | 解除卡住 | 失敗診斷 |
| `spawner_skills` | 搜尋載入技能 | load_skill |

**建議新增**：
- `validate_skill` - 對當前代碼執行技能相關的驗證
- `suggest_improvement` - 基於 sharp-edges 推薦改進

---

## 行動建議

### 短期（可立即採用）

1. **SKILL.md 擴展**
   ```markdown
   ## Sharp Edges

   ### 陷阱 1: [名稱]
   - **情境**：...
   - **症狀**：...
   - **解決**：...
   ```

2. **在 patterns/ 新增協作模式**
   ```yaml
   # patterns/skill-collaboration.md
   collaboration:
     backend + api-design:
       when: "建立 REST API"
       flow: [api-design 定義規範, backend 實作]
   ```

### 中期（需要開發）

1. **4 文件格式支援**
   - skillpkg 支援讀取 4 文件格式
   - 或自動合併為 SKILL.md

2. **validations 整合**
   - 為現有 skills 添加 validations
   - 整合到 hooks 自動執行

### 長期（系統升級）

1. **collaboration.yaml 支援**
   - 定義技能協作圖
   - recommend_skills 根據協作圖推薦

2. **MCP 工具擴展**
   - spawner_validate 類似功能
   - spawner_suggest 類似功能

---

## 涌現洞察

1. **從「知識文檔」到「可執行網絡」**
   - Spawner 證明了技能系統可以更結構化
   - validations 讓最佳實踐自動化
   - collaboration 讓技能協作顯式化

2. **462 個技能的規模**
   - 證明大規模技能庫是可行的
   - 關鍵是好的組織結構（35 個類別）

3. **sharp-edges 是知識蒸餾的另一種形式**
   - 我們的 failures/ 是個人經驗
   - sharp-edges 是「領域通用的陷阱」
   - 兩者互補

---

## 參考連結

- GitHub: https://github.com/vibeforge1111/vibeship-spawner-skills
- 推文: https://x.com/meta_alchemist/status/2008837751756705869
