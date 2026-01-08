# Validations 格式規範

> 可執行的代碼品質檢查規則，讓最佳實踐自動化

## 概念

**Validations** 是可以自動執行的代碼檢查規則。與 Sharp Edges 的教學性質不同，Validations 專注於自動化檢測，可以整合到 IDE、CI/CD 或 Claude Code hooks。

靈感來源：[vibeship-spawner-skills](https://github.com/vibeforge1111/vibeship-spawner-skills)

---

## 格式

在 SKILL.md 中添加 `## Validations` 區塊：

```markdown
## Validations

### V-1: [規則名稱]
- **類型**: regex | ast | custom
- **嚴重度**: critical | high | medium | low
- **模式**: `[檢測模式]`
- **訊息**: [違規時顯示的訊息]
- **修復建議**: [如何修復]
- **適用**: `*.ts`, `*.js` [適用的檔案類型]
```

---

## 欄位說明

| 欄位 | 必要 | 說明 |
|------|------|------|
| **ID** | ✅ | 唯一識別符（格式：V-{number}）|
| **類型** | ✅ | regex（正則）、ast（語法樹）、custom（自訂）|
| **嚴重度** | ✅ | critical、high、medium、low |
| **模式** | ✅ | 檢測模式（正則表達式或 AST 查詢）|
| **訊息** | ✅ | 違規時顯示給開發者的訊息 |
| **修復建議** | ⭕ | 建議的修復方式 |
| **適用** | ⭕ | glob 模式，指定適用的檔案類型 |

---

## 類型說明

### regex（正則表達式）

最簡單的類型，用正則匹配代碼文字：

```markdown
### V-1: 禁止 console.log
- **類型**: regex
- **模式**: `console\.log\(`
- **訊息**: Avoid console.log in production code
- **修復建議**: Use a proper logger instead
- **適用**: `*.ts`, `*.js`
```

### ast（抽象語法樹）

更精確的檢測，基於代碼結構：

```markdown
### V-2: 禁止 any 類型
- **類型**: ast
- **模式**: `TSAnyKeyword`
- **訊息**: Avoid using 'any' type
- **修復建議**: Use a specific type or 'unknown'
- **適用**: `*.ts`
```

### custom（自訂檢查）

複雜邏輯，需要自訂函數：

```markdown
### V-3: 函數過長
- **類型**: custom
- **模式**: `function.lineCount > 50`
- **訊息**: Function is too long (max 50 lines)
- **修復建議**: Split into smaller functions
```

---

## 完整範例

```markdown
## Validations

### V-1: 禁止空的 catch block
- **類型**: regex
- **嚴重度**: critical
- **模式**: `catch\s*\([^)]*\)\s*\{\s*\}`
- **訊息**: Empty catch block swallows errors silently
- **修復建議**: Add error logging or handling
- **適用**: `*.ts`, `*.js`

### V-2: 禁止 == 使用 ===
- **類型**: regex
- **嚴重度**: medium
- **模式**: `[^!=]==[^=]`
- **訊息**: Use === instead of == for strict equality
- **修復建議**: Replace == with ===
- **適用**: `*.ts`, `*.js`

### V-3: 禁止 any 類型
- **類型**: ast
- **嚴重度**: high
- **模式**: `TSAnyKeyword`
- **訊息**: Avoid 'any' type - it defeats TypeScript's purpose
- **修復建議**: Use specific type, 'unknown', or generic
- **適用**: `*.ts`

### V-4: 必須有錯誤處理
- **類型**: regex
- **嚴重度**: high
- **模式**: `await\s+[^;]+(?!.*\.catch|try)`
- **訊息**: Async operation without error handling
- **修復建議**: Wrap in try/catch or add .catch()
- **適用**: `*.ts`, `*.js`

### V-5: 禁止魔術數字
- **類型**: regex
- **嚴重度**: low
- **模式**: `(?<![.\d])\b\d{2,}\b(?![.\d])`
- **訊息**: Magic number detected - use named constant
- **修復建議**: Extract to a named constant
- **適用**: `*.ts`, `*.js`
```

---

## 整合方式

### 1. Claude Code Hooks（推薦）

在 `.claude/settings.json` 中配置：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "skillpkg validate --skill=typescript --file=$FILE"
      }
    ]
  }
}
```

### 2. validate_skill MCP Tool

```
validate_skill({
  skill_id: "typescript",
  target_path: "./src",
  severity_filter: "high"
})
```

返回：
```json
{
  "passed": 10,
  "failed": 2,
  "issues": [
    {
      "validation": "V-1",
      "file": "src/api.ts",
      "line": 42,
      "message": "Empty catch block swallows errors",
      "fix": "Add error logging"
    }
  ]
}
```

### 3. ESLint 規則生成（未來）

Validations 可以自動轉換為 ESLint 規則：

```javascript
// 從 V-1 生成
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Empty catch block swallows errors' },
  },
  create(context) {
    return {
      CatchClause(node) {
        if (node.body.body.length === 0) {
          context.report({ node, message: 'Empty catch block' });
        }
      },
    };
  },
};
```

---

## 正則表達式技巧

### 常用模式

| 目的 | 模式 |
|------|------|
| 空的 catch | `catch\s*\([^)]*\)\s*\{\s*\}` |
| console.log | `console\.(log\|warn\|error)\(` |
| TODO 註解 | `//\s*TODO` |
| 未使用的變數 | `const\s+(\w+)\s*=(?!.*\1)` |
| forEach + async | `\.forEach\s*\(\s*async` |
| == 而非 === | `[^!=]==[^=]` |
| 硬編碼 URL | `https?://[^"'\s]+` |

### 注意事項

- 使用 `\s` 匹配空白（包含換行）
- 使用 `[^...]` 排除特定字元
- 複雜邏輯考慮用 AST 類型
- 測試你的正則以避免誤報

---

## 與 Sharp Edges 的關係

| Validations | Sharp Edges |
|-------------|-------------|
| 自動執行 | 人工閱讀 |
| 只有規則和訊息 | 包含原因和詳細解決方案 |
| 整合到 CI/CD | 用於學習和提醒 |
| 技術層面 | 可以是非技術（如設計陷阱）|

**最佳搭配**：
- Sharp Edge 解釋「為什麼」這是問題
- Validation 自動檢測這個問題
- 兩者都指向同一個解決方案

---

## 最佳實踐

### DO

- 從低誤報率的規則開始
- 提供清晰的修復建議
- 按嚴重度篩選（CI 只跑 critical/high）
- 定期檢視和調整規則

### DON'T

- 不要寫過於複雜的正則（維護困難）
- 不要一次加入太多規則（團隊需要適應）
- 不要忽略誤報（會導致規則被忽視）
- 不要只檢測不提供修復建議
