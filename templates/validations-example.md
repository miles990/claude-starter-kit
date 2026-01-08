# Validations 範例模板

> 複製此模板到你的 SKILL.md，替換為領域特定的檢查規則

---

## Validations

### V-1: [規則名稱]
- **類型**: regex
- **嚴重度**: critical
- **模式**: `[正則表達式]`
- **訊息**: [違規訊息]
- **修復建議**: [如何修復]
- **適用**: `*.ts`, `*.js`

### V-2: [規則名稱]
- **類型**: ast
- **嚴重度**: high
- **模式**: `[AST 節點類型]`
- **訊息**: [違規訊息]
- **修復建議**: [如何修復]
- **適用**: `*.ts`

---

## 常用 Validations 集合

### TypeScript/JavaScript 通用

```markdown
### V-1: 禁止空的 catch block
- **類型**: regex
- **嚴重度**: critical
- **模式**: `catch\s*\([^)]*\)\s*\{\s*\}`
- **訊息**: Empty catch block swallows errors silently
- **修復建議**: Add error logging or rethrow
- **適用**: `*.ts`, `*.js`

### V-2: 禁止 console.log
- **類型**: regex
- **嚴重度**: medium
- **模式**: `console\.log\(`
- **訊息**: Remove console.log before commit
- **修復建議**: Use a proper logger or remove
- **適用**: `*.ts`, `*.js`

### V-3: 必須使用 ===
- **類型**: regex
- **嚴重度**: medium
- **模式**: `[^!=]==[^=]`
- **訊息**: Use === for strict equality
- **修復建議**: Replace == with ===
- **適用**: `*.ts`, `*.js`

### V-4: forEach 中禁止 async
- **類型**: regex
- **嚴重度**: high
- **模式**: `\.forEach\s*\(\s*async`
- **訊息**: forEach does not await async callbacks
- **修復建議**: Use for...of or Promise.all with map
- **適用**: `*.ts`, `*.js`
```

### React 專用

```markdown
### V-1: useEffect 依賴陣列中的物件
- **類型**: regex
- **嚴重度**: high
- **模式**: `useEffect\([^,]+,\s*\[\s*\{`
- **訊息**: Object in dependency array causes infinite loop
- **修復建議**: Use useMemo or extract to component level
- **適用**: `*.tsx`, `*.jsx`

### V-2: 禁止內聯函數作為 prop
- **類型**: regex
- **嚴重度**: medium
- **模式**: `<\w+[^>]+onClick=\{\s*\([^)]*\)\s*=>`
- **訊息**: Inline arrow function causes unnecessary re-renders
- **修復建議**: Use useCallback or define outside render
- **適用**: `*.tsx`, `*.jsx`

### V-3: 必須有 key prop
- **類型**: regex
- **嚴重度**: high
- **模式**: `\.map\([^}]+<(?!.*key=)`
- **訊息**: Missing key prop in list rendering
- **修復建議**: Add unique key prop
- **適用**: `*.tsx`, `*.jsx`
```

### API 設計

```markdown
### V-1: REST 路徑命名
- **類型**: regex
- **嚴重度**: medium
- **模式**: `/api/[A-Z]`
- **訊息**: API paths should be lowercase
- **修復建議**: Use lowercase with hyphens
- **適用**: `*.ts`

### V-2: 錯誤回應格式
- **類型**: regex
- **嚴重度**: high
- **模式**: `res\.status\(\d+\)\.send\(`
- **訊息**: Use structured error response
- **修復建議**: Use res.json({ error: ... })
- **適用**: `*.ts`
```

### 資料庫操作

```markdown
### V-1: 禁止 SELECT *
- **類型**: regex
- **嚴重度**: medium
- **模式**: `SELECT\s+\*\s+FROM`
- **訊息**: Avoid SELECT * - specify columns
- **修復建議**: List specific columns needed
- **適用**: `*.ts`, `*.sql`

### V-2: 必須有 WHERE 條件
- **類型**: regex
- **嚴重度**: high
- **模式**: `DELETE\s+FROM\s+\w+\s*(?!WHERE)`
- **訊息**: DELETE without WHERE is dangerous
- **修復建議**: Add WHERE clause or use truncate
- **適用**: `*.ts`, `*.sql`
```

---

## 嚴重度使用指南

| 嚴重度 | CI 行為 | 範例 |
|--------|---------|------|
| critical | 阻擋合併 | 空 catch、未處理 Promise |
| high | 警告 + 阻擋 | any 類型、無 key prop |
| medium | 警告 | console.log、== |
| low | 提示 | TODO 註解、魔術數字 |

---

## 檢查清單

添加 Validation 前，確認：

- [ ] 測試過正則表達式（使用 regex101.com）
- [ ] 確認誤報率可接受
- [ ] 嚴重度設定合理
- [ ] 訊息清楚說明問題
- [ ] 修復建議具體可行
- [ ] 適用範圍正確
