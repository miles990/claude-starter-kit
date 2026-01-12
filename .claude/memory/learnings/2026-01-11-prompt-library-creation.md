---
date: 2026-01-11
tags: [evolve, pain-point, prompt-management, express, typescript]
task: 使用 /evolve 建立解決 AI 協作痛點的新專案
status: resolved
---

# 從痛點到解決方案：Prompt Library 專案建立

## 情境

使用 `/evolve` 指令執行完整流程：
1. 蒐集 AI 協作痛點
2. 找出未解決的主題
3. 建立新專案實作解決方案

## 痛點分析過程

從 `.claude/memory/` 搜尋到 15 個相關檔案，分析出 9 個痛點類別：

| 類別 | 痛點 | 現有解決方案 | 狀態 |
|------|------|-------------|------|
| 記憶 | 跨對話遺忘 | memory system | ✅ |
| 品質 | 幻覺問題 | validation service | ✅ |
| 工程 | 複雜任務管理 | task tool + subagents | ✅ |
| 知識 | 知識過時 | context7 + RAG | ✅ |
| UX | 上手門檻高 | personas + CLI | ✅ |
| 自動化 | 手動設定多 | scaffold command | ✅ |
| 工作流程 | 重複性高 | skills + workflows | ✅ |
| Prompt 管理 | 散落各處 | **無** | ❌ |
| 協作 | 難以分享 | **無** | ❌ |

## 選定主題

**Prompt 版本管理與協作** - 解決：
- Prompt 分散在不同地方（筆記、檔案、對話記錄）
- 沒有版本控制，不知道改了什麼
- 難以評估哪個 Prompt 效果好
- 無法方便分享給團隊

## 解決方案設計

建立 `prompt-library` 專案，核心功能：

1. **版本控制** - 每次更新自動建立新版本，可回滾
2. **模板渲染** - `{{variable}}` 和 `{{#if}}` 語法
3. **分類搜尋** - 9 種類別 + 標籤系統
4. **評分追蹤** - 1-5 星評分 + 使用統計
5. **集合管理** - 批量組織 Prompt
6. **匯出/匯入** - JSON 格式，團隊協作

## 技術實作

```
prompt-library/
├── src/
│   ├── index.ts           # Express 伺服器
│   ├── routes/index.ts    # 20+ API 端點
│   ├── services/
│   │   ├── prompt.service.ts      # 核心服務
│   │   └── collection.service.ts  # 集合管理
│   └── types/index.ts     # 型別定義
├── .claude/memory/        # 記憶系統
└── CLAUDE.md              # 專案說明
```

## 驗證結果

所有核心功能測試通過：
- ✅ CRUD 操作
- ✅ 搜尋功能
- ✅ 模板渲染
- ✅ 版本控制
- ✅ 評分功能
- ✅ 集合管理
- ✅ 匯出功能

## 學到的經驗

1. **痛點分析方法** - 從 memory 搜尋 → 分類 → 找出未解決的
2. **MVP 優先** - 先用 In-memory 驗證概念，再考慮持久化
3. **完整流程** - 從分析到實作到文檔一次完成
4. **自動初始化** - 預設資料幫助快速體驗功能

## 相關檔案

- `/Users/user/Workspace/prompt-library/` - 完整專案
- `.claude/memory/decisions/001-project-architecture.md` - 架構決策
