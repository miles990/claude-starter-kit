# Business → Tech Interface

> 商業領域需求到技術實現的映射

## Domain Skills

| Skill | 描述 | 深度需求 |
|-------|------|---------|
| product-management | 產品策略與路線圖 | 需求分析、優先級 |
| sales | 銷售流程與策略 | CRM、轉換優化 |
| marketing | 行銷策略與執行 | 內容、廣告、分析 |
| customer-success | 客戶成功管理 | 留存、支援 |
| operations | 營運管理 | 流程優化 |
| entrepreneurship | 創業與商業模式 | MVP、融資 |

## 需求 → 技術映射

| 領域需求 | 技術實現 | Software Skills | 優先級 |
|---------|---------|-----------------|--------|
| 產品原型 | Figma + React | `frontend`, `ui-ux-design` | 必要 |
| 用戶管理 | Auth + Database | `backend`, `database`, `security` | 必要 |
| 支付整合 | Stripe/PayPal API | `api-design`, `e-commerce` | 高 |
| 數據分析 | Analytics Dashboard | `database`, `data-design` | 高 |
| 自動化行銷 | Email/SMS API | `api-design`, `backend` | 中 |
| CRM 系統 | Custom/Salesforce | `database`, `backend` | 中 |
| 內容管理 | Headless CMS | `cms-development`, `api-design` | 中 |

## 推薦組合模式

### 模式 1: SaaS MVP
**場景**: 快速驗證商業模式

```yaml
domain:
  - product-management (深度)
  - entrepreneurship (基礎)
software:
  - frontend
  - backend
  - database
  - api-design
```

### 模式 2: 電商平台
**場景**: 線上銷售、訂閱服務

```yaml
domain:
  - sales (深度)
  - marketing (基礎)
software:
  - e-commerce
  - frontend
  - backend
  - database
  - api-design
  - security-best-practices
```

### 模式 3: 內容行銷平台
**場景**: 部落格、媒體、社群

```yaml
domain:
  - marketing (深度)
  - product-management (基礎)
software:
  - cms-development
  - frontend
  - seo-technical
  - api-design
```

### 模式 4: 企業級 SaaS
**場景**: B2B 軟體、多租戶系統

```yaml
domain:
  - product-management (深度)
  - sales (深度)
  - customer-success (基礎)
software:
  - frontend
  - backend
  - database
  - api-design
  - devops-cicd
  - security-best-practices
  - testing-strategies
```

## 依賴聲明範例

```yaml
# product-management/SKILL.md
dependencies:
  skills:
    - entrepreneurship
  software-skills:
    - frontend
    - api-design
    - database

# sales/SKILL.md
dependencies:
  software-skills:
    - database
    - api-design
    - e-commerce
```

## 常見技術選型

| 需求類型 | 推薦技術 | 替代方案 |
|---------|---------|---------|
| 前端框架 | Next.js, React | Vue, Svelte |
| 後端框架 | Node.js, Python | Go, Ruby |
| 資料庫 | PostgreSQL | MySQL, MongoDB |
| 支付 | Stripe | PayPal, Square |
| 認證 | Auth0, Clerk | Firebase Auth |
| CMS | Strapi, Sanity | Contentful |
| 分析 | Mixpanel, Amplitude | GA4, Posthog |
