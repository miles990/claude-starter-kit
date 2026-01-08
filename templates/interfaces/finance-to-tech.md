# Finance → Tech Interface

> 金融領域需求到技術實現的映射

## Domain Skills

| Skill | 描述 | 深度需求 |
|-------|------|---------|
| quant-trading | 量化交易策略開發 | 策略設計、回測、執行 |
| investment-analysis | 投資分析與估值 | 財報分析、估值模型 |

## 需求 → 技術映射

| 領域需求 | 技術實現 | Software Skills | 優先級 |
|---------|---------|-----------------|--------|
| 財務資料分析 | Python + Pandas | `python`, `database` | 必要 |
| 即時行情處理 | WebSocket + 時序DB | `realtime-systems`, `database` | 高 |
| 報告生成 | React + Chart.js | `frontend`, `data-design` | 中 |
| 策略回測 | Backtrader/Zipline | `python`, `testing-strategies` | 必要 |
| 風險計算 | NumPy/SciPy | `python`, `performance-optimization` | 高 |
| API 整合 | REST/WebSocket | `api-design`, `backend` | 高 |
| 自動化部署 | CI/CD Pipeline | `devops-cicd` | 中 |

## 推薦組合模式

### 模式 1: 研究型量化
**場景**: 策略研究、學術分析、個人投資

```yaml
domain:
  - investment-analysis (深度)
  - quant-trading (基礎)
software:
  - python
  - database
  - data-design
```

### 模式 2: 生產型量化
**場景**: 實盤交易、自動化執行、團隊協作

```yaml
domain:
  - quant-trading (深度)
  - investment-analysis (基礎)
software:
  - python
  - database
  - api-design
  - devops-cicd
  - testing-strategies
```

### 模式 3: 全棧量化平台
**場景**: 完整交易平台、多用戶系統

```yaml
domain:
  - quant-trading (深度)
  - investment-analysis (深度)
software:
  - python
  - database
  - api-design
  - frontend
  - backend
  - devops-cicd
  - security-best-practices
```

## 依賴聲明範例

```yaml
# quant-trading/SKILL.md
dependencies:
  skills:
    - investment-analysis
  software-skills:
    - python
    - database
    - api-design
    - testing-strategies
```

## 常見技術選型

| 需求類型 | 推薦技術 | 替代方案 |
|---------|---------|---------|
| 資料儲存 | PostgreSQL + TimescaleDB | InfluxDB, QuestDB |
| 回測框架 | Backtrader | Zipline, VectorBT |
| 視覺化 | Plotly, ECharts | Matplotlib, D3.js |
| API 框架 | FastAPI | Flask, Express |
| 即時通訊 | WebSocket | SSE, gRPC |
