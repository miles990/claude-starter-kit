# Sharp Edges 格式規範

> 系統化記錄領域常見陷阱，讓 AI 主動避免踩坑

## 概念

**Sharp Edges**（鋒利邊緣）是指每個領域中常見但難以預見的陷阱。透過結構化記錄這些陷阱，AI 可以在執行任務前主動警告，而非事後學習。

靈感來源：[vibeship-spawner-skills](https://github.com/vibeforge1111/vibeship-spawner-skills)

---

## 格式

在 SKILL.md 中添加 `## Sharp Edges` 區塊：

```markdown
## Sharp Edges

### SE-1: [陷阱名稱]
- **嚴重度**: critical | high | medium | low
- **情境**: [何時會遇到這個問題]
- **原因**: [為什麼會發生]
- **症狀**:
  - [症狀 1]
  - [症狀 2]
- **檢測**: `[正則表達式或檢測方法]`（可選）
- **解決**:
  ```[語言]
  // 錯誤做法
  [錯誤代碼]

  // 正確做法
  [正確代碼]
  ```
```

---

## 欄位說明

| 欄位 | 必要 | 說明 |
|------|------|------|
| **ID** | ✅ | 唯一識別符（格式：SE-{number}）|
| **嚴重度** | ✅ | critical（系統故障）、high（功能錯誤）、medium（品質問題）、low（次優解）|
| **情境** | ✅ | 描述何時會遇到這個問題 |
| **原因** | ⭕ | 解釋為什麼會發生（教學用）|
| **症狀** | ✅ | 列出可觀察的症狀（至少 1 個）|
| **檢測** | ⭕ | 正則表達式或其他自動檢測方法 |
| **解決** | ✅ | 具體的解決方案，最好有代碼範例 |

---

## 嚴重度定義

| 等級 | 定義 | 範例 |
|------|------|------|
| **critical** | 導致系統故障、資料遺失、安全漏洞 | 空的 catch block 導致支付靜默失敗 |
| **high** | 導致功能錯誤、用戶體驗嚴重受損 | 競態條件導致偶發錯誤 |
| **medium** | 導致代碼品質問題、維護困難 | 過度巢狀的 callback |
| **low** | 次優解、有更好的做法 | 未使用 TypeScript strict mode |

---

## 完整範例

```markdown
## Sharp Edges

### SE-1: 空的 catch block
- **嚴重度**: critical
- **情境**: 處理支付、API 請求等關鍵操作時
- **原因**: 開發者為了快速完成功能，先寫空的 catch 後來忘記填入
- **症狀**:
  - 操作靜默失敗，用戶以為成功
  - 幾天後才收到用戶回報
  - Logs 沒有任何錯誤記錄
- **檢測**: `catch\s*\([^)]*\)\s*\{\s*\}`
- **解決**:
  ```typescript
  // ❌ 錯誤做法
  try {
    await processPayment();
  } catch (e) {
    // 什麼都不做
  }

  // ✅ 正確做法
  try {
    await processPayment();
  } catch (error) {
    logger.error({ error, context: 'payment' }, 'Payment failed');
    // 決定是否 rethrow
    throw error;
  }
  ```

### SE-2: 非同步操作未等待
- **嚴重度**: high
- **情境**: 在 forEach 或 map 中執行非同步操作
- **原因**: forEach 不等待 Promise，導致操作未完成就繼續
- **症狀**:
  - 操作看起來完成，但資料不一致
  - 難以重現的偶發錯誤
  - 測試通過但生產環境失敗
- **檢測**: `\.forEach\s*\(\s*async`
- **解決**:
  ```typescript
  // ❌ 錯誤做法
  items.forEach(async (item) => {
    await saveToDatabase(item);
  });
  console.log('Done!'); // 其實還沒完成

  // ✅ 正確做法
  await Promise.all(items.map(async (item) => {
    await saveToDatabase(item);
  }));
  console.log('Done!'); // 真的完成了
  ```

### SE-3: 未處理的 Promise rejection
- **嚴重度**: high
- **情境**: 建立 Promise 但沒有 .catch() 或 try/catch
- **原因**: 忘記錯誤可能發生，或以為會被某處捕獲
- **症狀**:
  - Node.js UnhandledPromiseRejectionWarning
  - 應用程式意外終止
  - 錯誤被吞掉，沒有任何提示
- **檢測**: 需要靜態分析工具
- **解決**:
  ```typescript
  // ❌ 錯誤做法
  fetchData(); // Promise 沒有被處理

  // ✅ 正確做法 - 方法 1
  fetchData().catch(handleError);

  // ✅ 正確做法 - 方法 2
  try {
    await fetchData();
  } catch (error) {
    handleError(error);
  }
  ```
```

---

## 在 self-evolving-agent 中的使用

當 AI 載入包含 Sharp Edges 的 skill 時：

1. **Plan 階段**: 檢查即將執行的任務是否匹配任何 sharp edge 的情境
2. **警告**: 如果匹配，主動提醒用戶相關陷阱
3. **建議**: 提供解決方案作為參考

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Sharp Edge 警告                                     │
│                                                         │
│  檢測到潛在陷阱：SE-1 空的 catch block                 │
│  嚴重度：critical                                       │
│                                                         │
│  建議：確保所有 catch block 都有適當的錯誤處理         │
│  詳見：error-handling skill 的 Sharp Edges 章節        │
└─────────────────────────────────────────────────────────┘
```

---

## 最佳實踐

### DO

- 每個 sharp edge 都基於真實經驗
- 提供具體的代碼範例（錯誤 vs 正確）
- 包含可自動檢測的模式（如果可能）
- 按嚴重度排序（critical 在前）

### DON'T

- 不要列出太多（5-10 個為佳）
- 不要太籠統（「要小心錯誤」沒有幫助）
- 不要重複常識（「記得測試」）
- 不要只列問題不給解決方案

---

## 與 Validations 的關係

| Sharp Edges | Validations |
|-------------|-------------|
| 描述性的警告 | 可執行的規則 |
| 包含原因和解決方案 | 只包含檢測和訊息 |
| 用於教學和提醒 | 用於自動化檢查 |

兩者互補：Sharp Edges 教你為什麼，Validations 幫你自動檢查。
