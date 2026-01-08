# Skill Metrics - 涌現追蹤系統

> 追蹤 skill 組合使用情況，發現成功模式，優化推薦

## 目錄結構

```
skill-metrics/
├── README.md           # 本文件
├── combinations/       # 組合使用記錄
│   └── {year}-{month}.yaml
├── statistics/         # 統計摘要
│   └── summary.yaml
└── patterns/           # 發現的成功模式
    └── {pattern-name}.yaml
```

## 資料結構

### combinations/{year}-{month}.yaml

每月的 skill 組合使用記錄：

```yaml
# combinations/2025-01.yaml
metadata:
  year_month: "2025-01"
  total_tasks: 24
  success_rate: 0.87

combinations:
  - id: "combo-001"
    date: "2025-01-07"
    task: "建立量化回測系統"
    goal_keywords: [量化, 回測, 交易]
    skills_used:
      domain: [quant-trading, investment-analysis]
      software: [python, database, testing-strategies]
    result:
      success: true
      iterations: 3
      duration_minutes: 45
      confidence_score: 0.85
    notes: "RemBG 節點幫助生成透明背景"
```

### statistics/summary.yaml

自動計算的統計摘要：

```yaml
# statistics/summary.yaml
last_updated: "2025-01-08"
total_combinations: 47
overall_success_rate: 0.83

# 依 skill 統計
by_skill:
  domain:
    quant-trading:
      usage_count: 12
      success_rate: 0.75
      avg_iterations: 3.2
    product-management:
      usage_count: 8
      success_rate: 0.88
      avg_iterations: 2.1

  software:
    python:
      usage_count: 34
      success_rate: 0.91
      avg_iterations: 2.4
    frontend:
      usage_count: 28
      success_rate: 0.89

# 熱門組合（成功率 > 80%，使用 > 3 次）
hot_combinations:
  - skills: [python, database, api-design]
    usage_count: 12
    success_rate: 0.92
    common_tasks: [後端 API, 資料處理, 系統整合]

  - skills: [frontend, backend, testing-strategies]
    usage_count: 8
    success_rate: 0.88
    common_tasks: [全端應用, Web 開發]

# 需要注意的組合（成功率 < 70%）
attention_needed:
  - skills: [quant-trading, realtime-systems]
    usage_count: 4
    success_rate: 0.50
    failure_reasons: [記憶體不足, 延遲過高]
    suggested_additions: [performance-optimization]
```

### patterns/{pattern-name}.yaml

發現的成功模式：

```yaml
# patterns/data-intensive-backend.yaml
name: data-intensive-backend
description: 資料密集型後端系統的最佳組合
discovered_date: "2025-01-07"
evidence_count: 8  # 基於多少次成功記錄

pattern:
  core_skills:
    - python
    - database
    - api-design
  optional_skills:
    - performance-optimization
    - testing-strategies
  domain_affinity:
    - quant-trading
    - data-analysis

statistics:
  success_rate: 0.92
  avg_iterations: 2.3
  common_failure_modes:
    - 未設定資料庫連線池
    - API 缺少分頁

recommended_for:
  keywords: [資料, 後端, API, 系統, 處理]
  task_types: [資料處理, 後端開發, 系統整合]
```

## 使用方式

### 記錄使用（在 PDCA Check 階段）

當 self-evolving-agent 完成一個任務時：

```python
# 在 Check 階段自動記錄
skill_metrics.record_combination(
    task="建立量化回測系統",
    skills_used={
        "domain": ["quant-trading", "investment-analysis"],
        "software": ["python", "database"]
    },
    success=True,
    iterations=3
)
```

### 查詢推薦

在 Phase 1.5 能力評估時：

```python
# 根據任務查詢成功模式
patterns = skill_metrics.find_patterns(
    keywords=["量化", "回測"],
    min_success_rate=0.8
)
# 返回 data-intensive-backend pattern
```

### 統計更新

每次任務完成後自動更新：

1. 新增組合記錄到 `combinations/{year}-{month}.yaml`
2. 重新計算 `statistics/summary.yaml`
3. 若發現新模式，新增到 `patterns/`

## 與 recommend_skills 整合

當 `recommend_skills` MCP tool 被呼叫時：

1. 先從 triggers 匹配 skills
2. 查詢 skill-metrics 的成功模式
3. 若有高成功率的組合模式，優先推薦
4. 在推薦結果中標示「經過驗證的組合」

```yaml
recommendation:
  domain_skills:
    - name: quant-trading
      confidence: 0.85
      reason: "關鍵詞匹配: 量化, 回測"
  software_skills:
    - name: python
      confidence: 0.90
      reason: "依賴解析 + 成功模式"
      verified_pattern: "data-intensive-backend (92% 成功率)"
```

## 隱私考量

- 所有資料儲存在本地 `.claude/memory/`
- 不會上傳到任何外部服務
- 可選擇不追蹤（在 `.claude/settings.json` 設定）
