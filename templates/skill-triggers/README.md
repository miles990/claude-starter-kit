# Skill Triggers (Keyword Index)

> 為動態 Skill 推薦提供的關鍵詞索引格式

## 概述

每個 SKILL.md 都應該包含 `triggers` 欄位，讓 recommend_skills 匹配引擎能夠根據用戶目標推薦適合的 skills。

## 格式規範

```yaml
---
name: skill-name
version: 1.0.0
description: Skill 描述

# 新增：觸發器/關鍵詞索引
triggers:
  keywords:
    # 主要關鍵詞 (權重: 1.0)
    # 匹配時直接推薦此 skill
    primary:
      - 量化
      - quant
      - trading
      - 交易

    # 次要關鍵詞 (權重: 0.6)
    # 匹配時列入候選
    secondary:
      - 股票
      - 期貨
      - algo
      - 策略

  # 上下文加分 (共現時 +0.2)
  # 當這些詞與其他關鍵詞共現時，增加此 skill 的匹配分數
  context_boost:
    - Python
    - 金融
    - finance
    - 資料分析

  # 上下文減分 (共現時 -0.3)
  # 當這些詞出現時，降低此 skill 的匹配分數
  context_penalty:
    - 行銷
    - marketing
    - 設計
    - design

  # 優先級 (同分時的排序)
  priority: high  # high | medium | low
---
```

## 匹配演算法

```
score = 0

for each keyword in user_goal:
  if keyword in primary_keywords:
    score += 1.0
  elif keyword in secondary_keywords:
    score += 0.6

for each context_word in user_goal:
  if context_word in context_boost:
    score += 0.2
  elif context_word in context_penalty:
    score -= 0.3

confidence = min(score / 2.0, 1.0)  # 正規化到 0-1
```

## 範例檔案

- [quant-trading-triggers.yaml](./examples/quant-trading-triggers.yaml)
- [frontend-triggers.yaml](./examples/frontend-triggers.yaml)
- [python-triggers.yaml](./examples/python-triggers.yaml)

## 維護指南

### 新增 Skill 時

1. 分析 skill 的核心功能
2. 列出最能代表此 skill 的關鍵詞（primary）
3. 列出相關但不那麼精確的關鍵詞（secondary）
4. 確定哪些上下文應該加分/減分
5. 設定適當的優先級

### 關鍵詞選擇原則

| 類型 | 選擇原則 | 範例 |
|------|---------|------|
| Primary | 明確指向此 skill 的詞 | quant-trading: "量化", "回測" |
| Secondary | 相關但可能指向多個 skills | quant-trading: "股票", "策略" |
| Context Boost | 強化確認的上下文 | quant-trading: "Python", "金融" |
| Context Penalty | 表示其他意圖的上下文 | quant-trading: "行銷", "設計" |

### 避免的問題

- ❌ 過於通用的 primary keywords（如 "開發", "程式"）
- ❌ 太多 keywords（建議 primary 5-10 個, secondary 5-15 個）
- ❌ 重複的 keywords 在多個 skills 中都是 primary
