# Command Cheatsheet

> 常用指令速查表

## Claude Code 內建指令

| 指令 | 說明 |
|------|------|
| `/help` | 顯示幫助 |
| `/clear` | 清空對話 |
| `/compact` | 壓縮上下文 |

## Self-Evolving Agent

| 指令 | 說明 | 範例 |
|------|------|------|
| `/evolve [目標]` | 自我進化完成目標 | `/evolve 建立 REST API` |
| `/evolve [目標] --explore` | 探索模式 | `/evolve 優化效能 --explore` |
| `/evolve [目標] --emergence` | 涌現模式（跨領域連結） | `/evolve 重構架構 --emergence` |

## Skill 管理（MCP Tools）

在 Claude Code 對話中使用：

```
# 搜尋技能
幫我搜尋 frontend 相關的技能

# 推薦技能
根據「建立 REST API」推薦技能

# 安裝技能
安裝 backend 技能

# 列出已安裝
列出所有已安裝的技能

# 載入技能
載入 python 技能的說明
```

## Skill CLI（終端機）

```bash
# 搜尋
npx skillpkg-cli search "keyword"

# 安裝
npx skillpkg-cli install github:user/repo
npx skillpkg-cli install github:user/repo#subpath

# 列出
npx skillpkg-cli list
npx skillpkg-cli list --scope=global

# 同步到 Claude Code
npx skillpkg-cli sync

# 查看詳情
npx skillpkg-cli info skill-name
```

## Memory 操作

### 搜尋記憶

在 Claude Code 中：
```
搜尋 memory 中關於 "API" 的經驗
```

或使用工具：
```bash
# Grep 搜尋
grep -r "關鍵字" .claude/memory/
```

### 查看索引

```bash
cat .claude/memory/index.md
```

## Git 常用

```bash
# 狀態
git status

# 提交
git add . && git commit -m "message"

# 推送
git push origin main

# 拉取
git pull origin main
```

## 專案結構

```
.
├── CLAUDE.md              # 專案入口（必讀）
├── .claude/
│   ├── memory/            # 記憶系統
│   │   ├── index.md       # 索引
│   │   ├── learnings/     # 學習記錄
│   │   ├── failures/      # 失敗經驗
│   │   ├── decisions/     # 架構決策
│   │   └── patterns/      # 推理模式
│   ├── rules/             # 自動載入規則
│   └── skills/            # 已安裝技能
├── personas/              # 專案 Persona 預設
└── docs/                  # 文檔
```

## Persona 切換

```bash
# 複製 persona 配置
cp -r personas/startup-mvp/skillpkg.json ./

# 或手動選擇
# startup-mvp: 快速 MVP
# enterprise: 企業級（完整測試、安全）
# fullstack: 全端開發
# research: 研究探索
```

## 常見任務快捷方式

| 任務 | 說法 |
|------|------|
| 開始新功能 | `/evolve 實作 [功能名稱]` |
| 修復 bug | `幫我找到並修復 [問題描述]` |
| 重構程式碼 | `/evolve 重構 [目標] --explore` |
| 寫測試 | `幫這個檔案寫單元測試: [path]` |
| 產生文檔 | `幫這個模組產生文檔` |
| Code Review | `幫我 review 這次的變更` |

## 快速診斷

```bash
# Claude Code 版本
claude --version

# 檢查 MCP 配置
cat .mcp.json

# 檢查 skills
ls -la .claude/skills/

# 檢查 memory
ls -la .claude/memory/
```

---

> 完整文檔：[USAGE_TUTORIAL.md](USAGE_TUTORIAL.md) | [QUICKSTART.md](QUICKSTART.md)
