# Domain → Software Interfaces

> 領域需求到技術實現的映射層

## 概述

這些接口文件定義了 **domain skills** 和 **software skills** 之間的映射關係，用於：

1. **動態推薦**: recommend_skills 根據映射推薦 software skills
2. **依賴聲明**: domain skills 的 software-skills 依賴來源
3. **決策支援**: 幫助用戶理解為什麼推薦特定技術

## 接口文件

| 文件 | 覆蓋領域 | Domain Skills |
|------|---------|---------------|
| [finance-to-tech.md](./finance-to-tech.md) | 金融 | quant-trading, investment-analysis |
| [business-to-tech.md](./business-to-tech.md) | 商業 | product-management, sales, marketing, ... |
| [creative-to-tech.md](./creative-to-tech.md) | 創意 | game-design, content-creation, digital-art, ... |

## 使用方式

### 在 recommend_skills 中

```typescript
// 匹配引擎參考接口文件決定推薦
const interfaces = loadInterfaces();
const mapping = interfaces['finance'].getMapping('財務資料分析');
// → { software: ['python', 'database'], priority: '必要' }
```

### 在 SKILL.md 依賴聲明中

```yaml
# 根據接口文件定義依賴
dependencies:
  software-skills:
    - python      # 從 finance-to-tech.md 映射
    - database
```

## 結構說明

每個接口文件包含：

1. **Domain Skills 列表** - 該領域包含的 skills
2. **需求 → 技術映射表** - 領域需求對應的技術選擇
3. **推薦組合模式** - 常見場景的 skill 組合
4. **依賴聲明範例** - SKILL.md 中如何聲明
5. **常見技術選型** - 具體工具/框架建議

## 維護指南

當新增 domain skill 時：
1. 確定屬於哪個領域接口
2. 添加到對應的映射表
3. 更新推薦組合模式
4. 在 domain skill 中添加 software-skills 依賴
