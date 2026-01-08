# .claude Directory

> Claude Code 專案配置目錄

## 目錄結構

```
.claude/
├── README.md              # 本文件
├── CLAUDE.local.md        # 本地配置（gitignored）
├── ralph-loop.local.md    # Ralph Loop 狀態（gitignored）
│
├── memory/                # Git-based 記憶系統
│   ├── index.md          # Memory 索引
│   ├── learnings/        # 學習記錄
│   ├── decisions/        # 決策記錄 (ADR)
│   ├── failures/         # 失敗經驗
│   ├── patterns/         # 推理模式
│   ├── strategies/       # 策略記錄
│   ├── discoveries/      # 發現記錄
│   ├── guards/           # 防護機制
│   └── skill-metrics/    # 技能使用指標
│
├── rules/                 # 專案規則（自動載入）
│   ├── README.md
│   ├── code-quality.md
│   ├── testing.md
│   ├── memory-management.md
│   ├── evolve-workflow.md
│   ├── skillpkg-usage.md
│   └── mcp-usage.md
│
└── skills/                # 已安裝技能（gitignored）
    ├── README.md
    └── .gitkeep
```

## 關鍵文件說明

### Memory System (`memory/`)

Git-based 記憶系統，所有經驗都版本控制：
- 可追溯歷史
- 跨工具共享
- 團隊協作

詳見：[memory/index.md](memory/index.md)

### Rules (`rules/`)

自動載入的專案規則，Claude Code 在每次對話時讀取：
- 代碼品質標準
- 測試要求
- 工作流程指南

詳見：[rules/README.md](rules/README.md)

### Skills (`skills/`)

透過 skillpkg 安裝的技能：
- 自我進化代理
- 軟體開發技能集
- 領域專業技能

詳見：[skills/README.md](skills/README.md)

## 本地文件

以下文件被 gitignore，不會提交：

| 文件 | 用途 |
|------|------|
| `CLAUDE.local.md` | 本地專案配置覆蓋 |
| `ralph-loop.local.md` | Ralph Loop 迭代狀態 |
| `skills/*/` | 安裝的技能（避免重複） |

## 相關文檔

- [CLAUDE.md](../CLAUDE.md) - 專案入口
- [docs/README.md](../docs/README.md) - 文檔導覽
