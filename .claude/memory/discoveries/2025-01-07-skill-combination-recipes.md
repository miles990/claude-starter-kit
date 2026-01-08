---
date: 2025-01-07
tags: [skill-combinations, recipes, patterns, cross-domain]
task: 發現 skill 之間可以組合的機會
status: active
---

# Skill 組合食譜：15 個黃金組合

> 基於 69 個 skills (20 domain + 49 software) 的組合分析

## 一、跨領域黃金組合

### 🏆 Recipe 1: 量化交易系統
```yaml
domain_skills:
  - quant-trading        # 策略設計、回測邏輯
  - investment-analysis  # 財報分析、估值模型

software_skills:
  - python              # 主要語言
  - database            # 時序資料、歷史行情
  - api-design          # 交易所 API 整合
  - testing-strategies  # 策略回測驗證
  - performance-optimization  # 低延遲執行

phases:
  1. 策略研究: investment-analysis → quant-trading
  2. 資料管道: database → api-design
  3. 策略實現: python → testing-strategies
  4. 優化部署: performance-optimization
```

### 🏆 Recipe 2: SaaS 電商平台
```yaml
domain_skills:
  - product-management  # PRD、用戶故事
  - marketing          # 成長策略、SEO
  - sales              # 轉換優化

software_skills:
  - saas-platforms     # 多租戶、計費
  - e-commerce         # 購物車、支付
  - frontend           # React/Vue
  - backend            # Node.js/Python
  - database           # PostgreSQL
  - devops-cicd        # 部署自動化

phases:
  1. 產品規劃: product-management
  2. 架構設計: saas-platforms → e-commerce
  3. 開發實現: frontend + backend + database
  4. 成長執行: marketing + sales
  5. 運維優化: devops-cicd
```

### 🏆 Recipe 3: 遊戲開發全流程
```yaml
domain_skills:
  - game-design        # 遊戲機制、關卡設計
  - storytelling       # 劇情、角色
  - ui-ux-design       # 介面體驗

software_skills:
  - game-development   # 遊戲引擎、物理
  - frontend           # UI 框架
  - realtime-systems   # 多人同步
  - performance-optimization  # 幀率優化

phases:
  1. 概念設計: game-design + storytelling
  2. 視覺設計: ui-ux-design
  3. 核心開發: game-development
  4. 網路功能: realtime-systems
  5. 效能調校: performance-optimization
```

---

## 二、商業應用組合

### 📊 Recipe 4: 數據驅動行銷
```yaml
domain_skills:
  - marketing          # 策略、內容、SEO
  - research-analysis  # 市場分析

software_skills:
  - database           # 用戶數據
  - ai-ml-integration  # 推薦系統
  - frontend           # Landing pages
```

### 📊 Recipe 5: 敏捷產品開發
```yaml
domain_skills:
  - product-management  # PRD、OKR
  - project-management  # Scrum、Sprint

software_skills:
  - git-workflows      # 分支策略
  - testing-strategies # TDD/BDD
  - devops-cicd        # 持續交付
```

### 📊 Recipe 6: 企業知識系統
```yaml
domain_skills:
  - knowledge-management  # PARA、Zettelkasten
  - research-analysis     # 知識提煉

software_skills:
  - content-platforms    # CMS、搜尋
  - database             # 知識圖譜
  - ai-ml-integration    # 語義搜尋
```

---

## 三、技術深度組合

### 🔧 Recipe 7: 高效能後端
```yaml
software_skills:
  - backend            # Node.js/Go/Rust
  - database           # 查詢優化
  - api-design         # REST/GraphQL
  - performance-optimization  # 分析、快取
  - reliability-engineering   # SRE 實踐
```

### 🔧 Recipe 8: 現代前端架構
```yaml
software_skills:
  - frontend           # React/Vue/Svelte
  - javascript-typescript  # 語言精通
  - testing-strategies     # 組件測試
  - performance-optimization  # 渲染優化
  - devops-cicd            # 前端部署
```

### 🔧 Recipe 9: 雲原生應用
```yaml
software_skills:
  - cloud-platforms    # AWS/GCP/Azure
  - devops-cicd        # GitOps、IaC
  - reliability-engineering  # 可觀測性
  - security-practices      # 雲安全
  - monitoring-logging      # 監控告警
```

---

## 四、AI 應用組合

### 🤖 Recipe 10: LLM 應用開發
```yaml
software_skills:
  - ai-ml-integration  # LLM API、嵌入
  - python             # 主要語言
  - api-design         # 服務設計
  - database           # 向量資料庫
  - frontend           # 聊天介面
```

### 🤖 Recipe 11: 智能助理系統
```yaml
domain_skills:
  - knowledge-management  # 知識組織

software_skills:
  - ai-ml-integration    # RAG、Agent
  - realtime-systems     # 串流回應
  - security-practices   # 提示注入防護
```

---

## 五、創意領域組合

### 🎨 Recipe 12: 內容平台
```yaml
domain_skills:
  - storytelling       # 內容創作
  - visual-media       # 圖片、影片

software_skills:
  - content-platforms  # CMS
  - frontend           # 展示層
  - database           # 媒體儲存
```

### 🎨 Recipe 13: 品牌數位化
```yaml
domain_skills:
  - ui-ux-design       # 品牌視覺
  - marketing          # 品牌策略

software_skills:
  - frontend           # 品牌網站
  - design-patterns    # 設計系統
```

---

## 六、生活應用組合

### 🌱 Recipe 14: 個人成長系統
```yaml
domain_skills:
  - personal-growth       # 時間管理、職涯
  - knowledge-management  # 第二大腦
  - side-income          # 副業發展

software_skills:
  - developer-tools      # 個人工具開發
```

### 🌱 Recipe 15: 投資理財輔助
```yaml
domain_skills:
  - investment-analysis  # 分析框架
  - personal-growth      # 財務規劃

software_skills:
  - database            # 投資組合追蹤
  - frontend            # 可視化儀表板
```

---

## 組合效能預測

基於 skill 特性分析，預測組合效果：

| Recipe | 複雜度 | 學習曲線 | 商業價值 | 建議用戶 |
|--------|--------|---------|---------|---------|
| 量化交易 | 🔴 高 | 陡峭 | 🔴 高 | 金融背景 |
| SaaS 電商 | 🔴 高 | 中等 | 🔴 高 | 創業者 |
| 遊戲開發 | 🔴 高 | 陡峭 | 🟡 中 | 遊戲愛好者 |
| 數據行銷 | 🟡 中 | 平緩 | 🟡 中 | 行銷人員 |
| 敏捷開發 | 🟡 中 | 平緩 | 🟡 中 | 團隊領導 |
| 知識系統 | 🟢 低 | 平緩 | 🟢 低 | 知識工作者 |
| 高效後端 | 🟡 中 | 中等 | 🟡 中 | 後端工程師 |
| 現代前端 | 🟡 中 | 中等 | 🟡 中 | 前端工程師 |
| 雲原生 | 🔴 高 | 陡峭 | 🔴 高 | DevOps |
| LLM 應用 | 🟡 中 | 中等 | 🔴 高 | AI 開發者 |

---

## 實施建議

### 1. 在 skillpkg 新增 recipe 支援

```bash
# 新命令
skillpkg recipe list           # 列出所有食譜
skillpkg recipe install quant  # 安裝量化交易組合
skillpkg recipe info saas      # 查看 SaaS 食譜詳情
```

### 2. 在 starter-kit CLI 整合

```bash
npx claude-starter-kit init
# 新選項: 選擇應用類型
# → 自動安裝對應 recipe 的所有 skills
```

### 3. 在 self-evolving-agent 自動推薦

當 Phase 1.5 檢測到任務類型時，自動建議相關 recipe：
```
任務: 建立一個 SaaS 電商平台

🎯 偵測到應用類型: SaaS + E-commerce
📦 推薦 Recipe: SaaS 電商平台
   需要 10 個 skills (6 software + 4 domain)

要自動安裝嗎？[Y/n]
```

---

## 涌現洞察

1. **Domain + Software 是最強組合** - 純技術或純領域都不完整
2. **3-5 個 skills 是甜蜜點** - 太少不夠用，太多認知負擔
3. **有明確階段順序** - Recipe 應該定義執行順序
4. **可以嵌套** - Recipe 可以依賴其他 Recipe
