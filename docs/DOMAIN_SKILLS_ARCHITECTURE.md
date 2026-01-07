# 領域技能包架構設計

> 非技術領域的專業知識如何結構化為 AI Skill

## 領域分類

### claude-business-skills (商業領域)

```
claude-business-skills/
├── SKILL.md                  # 入口 + 技能索引
├── skills/
│   ├── quantitative-trading/ # 量化交易
│   │   ├── SKILL.md
│   │   ├── strategies/       # 交易策略模板
│   │   └── indicators/       # 技術指標知識
│   │
│   ├── financial-analysis/   # 金融分析
│   │   ├── SKILL.md
│   │   ├── models/           # 財務模型
│   │   └── metrics/          # 關鍵指標
│   │
│   ├── marketing/            # 行銷
│   │   ├── SKILL.md
│   │   ├── frameworks/       # 行銷框架 (4P, AIDA, etc.)
│   │   └── channels/         # 渠道策略
│   │
│   ├── product-management/   # 產品管理
│   │   ├── SKILL.md
│   │   ├── frameworks/       # PRD, User Story, OKR
│   │   └── metrics/          # 產品指標
│   │
│   ├── business-planning/    # 商業企劃
│   │   ├── SKILL.md
│   │   ├── templates/        # BP 模板
│   │   └── analysis/         # SWOT, Porter's Five Forces
│   │
│   └── data-analysis/        # 數據分析
│       ├── SKILL.md
│       ├── methods/          # 分析方法
│       └── visualization/    # 視覺化最佳實踐
```

### claude-creative-skills (創意領域)

```
claude-creative-skills/
├── SKILL.md                  # 入口 + 技能索引
├── skills/
│   ├── game-design/          # 遊戲設計
│   │   ├── SKILL.md
│   │   ├── mechanics/        # 遊戲機制
│   │   ├── narrative/        # 敘事設計
│   │   └── balance/          # 數值平衡
│   │
│   ├── ui-ux-design/         # UI/UX 設計
│   │   ├── SKILL.md
│   │   ├── principles/       # 設計原則
│   │   ├── patterns/         # 設計模式
│   │   └── accessibility/    # 無障礙設計
│   │
│   ├── content-creation/     # 內容創作
│   │   ├── SKILL.md
│   │   ├── writing/          # 文案技巧
│   │   ├── storytelling/     # 故事結構
│   │   └── seo/              # SEO 優化
│   │
│   ├── brand-design/         # 品牌設計
│   │   ├── SKILL.md
│   │   ├── identity/         # 品牌識別
│   │   ├── guidelines/       # 品牌規範
│   │   └── strategy/         # 品牌策略
│   │
│   └── multimedia/           # 多媒體製作
│       ├── SKILL.md
│       ├── video/            # 影片製作
│       ├── audio/            # 音效音樂
│       └── animation/        # 動畫製作
```

## Skill 設計原則

### 1. 領域知識結構

```markdown
---
name: quantitative-trading
version: 1.0.0
description: 量化交易策略設計與回測
triggers: [量化, 交易, 策略, 回測, 技術分析]
---

# 量化交易技能

## 核心概念
- 技術分析 vs 基本面分析
- 風險管理原則
- 回測方法論

## 策略模板

### 動量策略
[具體策略描述與參數]

### 均值回歸
[具體策略描述與參數]

## 工作流程

1. 數據收集
2. 策略開發
3. 回測驗證
4. 風險評估
5. 實盤部署

## 常見錯誤

- 過度擬合
- 忽略交易成本
- 生存者偏差
```

### 2. 與 self-evolving-agent 整合

領域技能應該：
- 提供**判斷力**，而非只是知識
- 定義**工作流程**和**檢查點**
- 包含**常見錯誤**和**最佳實踐**
- 可被 evolve 調用進行自我學習

### 3. 知識的結構化

| 層級 | 內容 | 例子 |
|------|------|------|
| 概念層 | 核心概念和術語 | "什麼是 MACD?" |
| 方法層 | 具體方法和流程 | "如何設計動量策略?" |
| 實踐層 | 模板和範例 | "Python 回測程式碼" |
| 經驗層 | 常見錯誤和技巧 | "過度擬合的警告信號" |

## 使用方式

### 安裝

```bash
# 安裝商業技能包
skillpkg install miles990/claude-business-skills

# 或安裝特定技能
skillpkg install miles990/claude-business-skills#quantitative-trading

# 安裝創意技能包
skillpkg install miles990/claude-creative-skills
```

### 在 skillpkg init 中選擇

```bash
# 互動式選擇領域
skillpkg init --preset=standard

? Add domain-specific skills?
  ○ None
  ○ Software Development (claude-software-skills)
  ○ Business & Finance (claude-business-skills)
  ○ Creative & Design (claude-creative-skills)
  ○ Custom selection
```

## 社群貢獻

### 貢獻新技能

1. Fork 對應的 repo
2. 在 `skills/` 下建立新目錄
3. 遵循 SKILL.md 格式
4. 提交 PR

### 技能審核標準

- [ ] 有清晰的觸發詞
- [ ] 包含工作流程
- [ ] 有實用的模板/範例
- [ ] 記錄常見錯誤
- [ ] 經過實際使用測試

## 路線圖

### Phase 1: 基礎架構
- [ ] 建立 claude-business-skills repo
- [ ] 建立 claude-creative-skills repo
- [ ] 設計技能模板
- [ ] 整合到 skillpkg init

### Phase 2: 核心技能
- [ ] 量化交易技能
- [ ] 遊戲設計技能
- [ ] 產品管理技能
- [ ] UI/UX 設計技能

### Phase 3: 社群擴展
- [ ] 貢獻指南
- [ ] 技能品質標準
- [ ] 精選技能列表
