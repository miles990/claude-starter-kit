---
date: 2026-01-08
tags: [cli, smart, insights, dashboard, v2.0, intelligent-features]
task: 智能化 CLI 改進
status: resolved
---

# CLI v2.0 智能化功能實作

## 情境

用戶希望將 claude-starter-kit 從基本的工作管理工具升級為智能協作應用程式，需要：
- AI 協作增強
- 專案監控儀表板
- CLI 體驗升級
- 自動化推薦、預測性功能、學習與適應、跨專案洞察

## 實作的功能

### 1. Smart 指令 (`cli/src/commands/smart.ts`)

智能助手，提供上下文感知的推薦：

```bash
npx claude-starter-kit smart        # 互動模式
npx claude-starter-kit smart -q     # 快速模式
npx claude-starter-kit smart -a=xxx # 直接執行行動
```

**核心功能：**
- 專案上下文分析（類型、健康分數）
- 最近活動追蹤（git commits, memory 更新）
- 智能行動推薦（按優先級排序）
- 使用模式追蹤（存於 `.claude/smart-stats.json`）

**技術重點：**
- `analyzeProjectContext()` - 綜合分析專案狀態
- `generateSmartActions()` - 根據狀態生成推薦行動
- `calculateHealthScore()` - 計算健康分數（0-100）
- `trackUsage()` - 追蹤使用模式供未來個人化

### 2. Insights 指令 (`cli/src/commands/insights.ts`)

跨專案洞察和模式分析：

```bash
npx claude-starter-kit insights      # 本地專案
npx claude-starter-kit insights -g   # 全域掃描
npx claude-starter-kit insights -e   # 匯出報告
```

**核心功能：**
- 自動發現 Claude 專案（掃描 ~/Projects, ~/Workspace 等）
- 聚合所有專案的 learnings/decisions/patterns
- 識別跨專案共同模式
- 技能使用熱度分析
- 跨專案優化建議

**技術重點：**
- `discoverProjects()` - 掃描並識別 Claude 專案
- `extractPatterns()` - 從 memory 文件提取模式
- `findCrossProjectOpportunities()` - 發現知識轉移機會
- 全域索引存於 `~/.claude/insights/index.json`

### 3. Dashboard 指令 (`cli/src/commands/dashboard.ts`)

Web UI 監控面板：

```bash
npx claude-starter-kit dashboard        # 啟動 port 3456
npx claude-starter-kit dashboard -o     # 自動開啟瀏覽器
```

**核心功能：**
- 即時專案健康狀態
- Memory 瀏覽器（learnings, decisions, failures, patterns）
- 已安裝技能列表
- 最近 git 活動
- 自動更新（每 30 秒）

**技術重點：**
- 純 Node.js HTTP server（無框架依賴）
- RESTful API：`/api/project`, `/api/memory`, `/api/skills`
- 單一 HTML 檔案嵌入（SPA 架構）
- 深色主題 UI

## 架構決策

### 為什麼使用純 HTTP server 而非 Express？

減少依賴，保持輕量。Dashboard 功能簡單，原生 `http` 模組足夠。

### 為什麼 insights 存全域索引？

跨專案分析結果應該持久化，方便追蹤趨勢。存於 `~/.claude/insights/` 是合理的全域位置。

### 為什麼 smart 追蹤使用模式？

為未來個人化推薦鋪路。知道用戶常用什麼功能，可以優先推薦相關行動。

## 版本升級

- CLI 版本從 1.0.0 升級到 2.0.0
- 新增 3 個主要指令
- 更新 README.md 和 CHEATSHEET.md

## 相關檔案

- `cli/src/commands/smart.ts`
- `cli/src/commands/insights.ts`
- `cli/src/commands/dashboard.ts`
- `cli/src/index.ts`
- `README.md`
- `docs/CHEATSHEET.md`
