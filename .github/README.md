# GitHub Actions (推薦但非必須)

> 這些 workflows 是**可選的**。它們可以增強生態系統的自動化，但不是使用 claude-starter-kit 的必要條件。

## 可用的 Workflows

| Workflow | 說明 | 頻率 |
|----------|------|------|
| `ecosystem-health.yml` | 生態系統健康檢查 | 每日 / 手動 |
| `skill-lint.yml` | Skill 品質檢查 | 每週 / PR 觸發 |

## 如何啟用

### 選項 1: 保留（推薦）

保留 `.github/workflows/` 目錄，GitHub 會自動執行這些檢查。

### 選項 2: 移除

如果不需要自動化，可以安全地刪除整個 `.github/` 目錄：

```bash
rm -rf .github/
```

這**不會**影響 claude-starter-kit 的核心功能。

## Workflows 說明

### ecosystem-health.yml

定期檢查：
- `ecosystem.json` 版本配置
- `.claude/memory/` 結構完整性
- 已安裝的 skills 狀態

### skill-lint.yml

檢查 skill 品質：
- Skill Quality Tiers (Tier 1-4)
- Sharp Edges 覆蓋率
- Validations 和 Collaboration 配置

## 自訂

可以根據需要調整 cron 排程或檢查項目。詳見各 workflow 文件中的註釋。
