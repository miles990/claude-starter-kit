# GitHub Automation

> 自動化工作流程，維護生態系統健康

## Workflows

| Workflow | 觸發時機 | 功能 |
|----------|----------|------|
| **ecosystem-health** | 每日 00:00 UTC | 檢查 ecosystem.json 和組件版本 |
| **skill-lint** | 每週一 + PR | 檢查 skill 品質 (Sharp Edges, Validations) |
| **ci** | Push/PR to main | 建置和測試 CLI |

## 手動觸發

```bash
# 在 GitHub Actions 頁面點擊 "Run workflow"
# 或使用 gh CLI：
gh workflow run ecosystem-health.yml
gh workflow run skill-lint.yml --field strict=true
```

## 本地測試

```bash
# 執行健康檢查邏輯
npx claude-starter-kit doctor

# 測試 scaffold 命令
npx claude-starter-kit scaffold --list
npx claude-starter-kit scaffold express-api test-project --no-install
```

## 通知設定

若要接收失敗通知，可在 workflow 中加入：

```yaml
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'Ecosystem Health Check Failed',
        body: 'Please check the workflow run for details.',
        labels: ['automation', 'health-check']
      })
```

## 相關文檔

- [ecosystem.json](../ecosystem.json) - 生態系統版本配置
- [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - 故障排除指南
