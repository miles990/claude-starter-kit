# Requirements: Ecosystem Intelligence

> 生態系統智能化需求規格

## Overview

為 5 個 AI Skill 專案生態系統添加智能化能力，使其能夠：
1. 動態推薦 skills（根據用戶目標）
2. 自動解析跨域依賴
3. 在 skill 不足時進入研究模式

## User Stories

### US-1: 動態 Skill 推薦
**As a** 開發者
**I want to** 輸入我的目標，獲得智能推薦的 skills 組合
**So that** 我不需要手動搜尋和挑選 skills

**Acceptance Criteria:**
- [ ] 輸入任意目標文字，系統分析關鍵詞
- [ ] 返回推薦的 domain skills 和 software skills
- [ ] 每個推薦包含信心分數和推薦原因
- [ ] 可選擇「確認/自訂/跳過」

### US-2: 跨域依賴自動解析
**As a** 開發者
**I want to** 安裝 domain skill 時自動安裝依賴的 software skills
**So that** 我不需要手動處理依賴關係

**Acceptance Criteria:**
- [ ] Domain skill 可聲明 software-skills 依賴
- [ ] `skillpkg install quant-trading` 自動安裝 python, database 等
- [ ] 依賴衝突時給予警告

### US-3: 研究模式
**As a** 開發者
**I want to** 當現有 skills 不足時，系統進入研究模式
**So that** 我可以獲得額外的學習支援

**Acceptance Criteria:**
- [ ] 匹配信心分數 < 0.5 時觸發
- [ ] 提供選項：搜尋外部 skills / 使用現有 + 研究 / 跳過
- [ ] 研究結果記錄到 memory/learnings/

### US-4: Domain-Software 接口映射
**As a** 開發者
**I want to** 看到領域需求如何對應到技術選擇
**So that** 我理解為什麼推薦這些 skills

**Acceptance Criteria:**
- [ ] 每個領域有接口文件說明映射關係
- [ ] 推薦時可顯示映射原因

## Scope

### In Scope
- skillpkg: 新增匹配引擎和 recommend_skills MCP tool
- self-evolving-agent: 整合動態推薦到 Phase 1
- claude-domain-skills: 添加 software-skills 依賴聲明
- 接口層文件

### Out of Scope
- 預設 Recipe 文件（改用動態生成）
- 專案人格系統
- Web 儀表板 UI（Phase 4 可選）

## Dependencies

| 專案 | 版本 | 角色 |
|------|------|------|
| skillpkg | 0.5.5+ | 核心匹配引擎 |
| self-evolving-agent | 3.6.0+ | 整合推薦流程 |
| claude-domain-skills | 1.0.0+ | 添加依賴聲明 |
| claude-software-skills | 1.0.0+ | 被依賴的 skills |

## Success Metrics

- 目標輸入 → 推薦準確率 > 80%
- 跨域依賴解析成功率 > 95%
- 研究模式觸發時用戶滿意度
