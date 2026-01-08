# Project Personas

> 根據專案類型選擇最適合的配置

## 什麼是 Persona？

Persona 是為特定類型專案預先配置好的設定，包含：
- 適合的技能集
- 優化的規則
- 推薦的工作流程

## 可用 Personas

| Persona | 適用場景 | 特點 |
|---------|---------|------|
| [startup-mvp](startup-mvp/) | 快速原型、MVP | 快速迭代、最小配置 |
| [enterprise](enterprise/) | 企業專案 | 穩定可靠、完整審計 |
| [research](research/) | 研究探索 | 深度記錄、實驗追蹤 |
| [fullstack](fullstack/) | 全端開發 | 前後端整合、API 設計 |

## 如何使用

### 方式 1: 安裝時選擇

```bash
npx claude-starter-kit init --persona startup-mvp
```

### 方式 2: 手動複製

```bash
# 複製 persona 配置
cp -r personas/startup-mvp/rules/* .claude/rules/
cp personas/startup-mvp/skillpkg.json ./
```

### 方式 3: 切換 Persona

```bash
# 切換到不同 persona
npx claude-starter-kit switch-persona enterprise
```

## Persona 詳細說明

### startup-mvp (快速 MVP)

**目標**: 最快速度交付可用產品

**技能集**:
- frontend (React/Vue)
- backend (Node/Express)
- database (基礎)

**規則重點**:
- 優先完成功能
- 接受技術債
- 快速迭代

**適合**:
- 新創公司
- 黑客松
- 概念驗證

---

### enterprise (企業級)

**目標**: 穩定、可維護、合規

**技能集**:
- backend + frontend
- testing-strategies
- security
- documentation

**規則重點**:
- 完整測試覆蓋
- 代碼審查必須
- 變更需要審計

**適合**:
- 企業內部系統
- 需要合規的專案
- 長期維護專案

---

### research (研究探索)

**目標**: 深度探索、完整記錄

**技能集**:
- python + data-analysis
- ai-ml-integration
- documentation

**規則重點**:
- 詳細記錄過程
- 實驗追蹤
- 可重現性

**適合**:
- 學術研究
- 數據科學
- AI/ML 專案

---

### fullstack (全端開發)

**目標**: 完整的前後端整合

**技能集**:
- frontend + backend
- database + api-design
- testing-strategies
- devops-ci-cd

**規則重點**:
- API 先行設計
- 前後端一致性
- 完整測試

**適合**:
- Web 應用
- SaaS 產品
- 平台開發

## 自定義 Persona

你可以基於現有 persona 創建自己的：

```bash
# 複製並修改
cp -r personas/startup-mvp personas/my-project
# 編輯配置
vim personas/my-project/skillpkg.json
```

## 相關文檔

- [QUICKSTART.md](../docs/QUICKSTART.md) - 快速開始
- [templates/README.md](../templates/README.md) - 模板說明
