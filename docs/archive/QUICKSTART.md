# Quick Start Checklist

> 5 分鐘內開始使用 Claude Starter Kit

## Step 1: 安裝 (1 分鐘)

選擇一種方式：

```bash
# 方式 A: 一鍵安裝 (推薦)
curl -fsSL https://raw.githubusercontent.com/miles990/claude-starter-kit/main/setup.sh | bash

# 方式 B: npx
npx claude-starter-kit init

# 方式 C: 手動
git clone https://github.com/miles990/claude-starter-kit .claude-kit
cp -r .claude-kit/.claude ./
cp .claude-kit/CLAUDE.md ./
```

## Step 2: 驗證安裝 (30 秒)

確認這些檔案存在：

```
[ ] CLAUDE.md              ← 專案入口
[ ] .claude/memory/        ← 記憶系統
[ ] .claude/rules/         ← 自動載入規則
```

快速檢查：
```bash
ls CLAUDE.md .claude/memory/index.md
```

## Step 3: 打開 Claude Code (30 秒)

```bash
# 在專案目錄開啟 Claude Code
claude
```

## Step 4: 第一次對話 (2 分鐘)

試試這些指令：

### 基本對話
```
你好，幫我看看這個專案的結構
```

### 使用 /evolve 自我進化
```
/evolve 建立一個簡單的 TODO API
```

### 安裝技能
```
幫我安裝 python 相關的技能
```

## Step 5: 確認一切正常 (1 分鐘)

### 檢查清單

- [ ] Claude 能讀取 CLAUDE.md
- [ ] 可以使用 /evolve 指令
- [ ] 記憶系統正常運作

### 測試記憶系統
```
搜尋 memory 中有什麼經驗
```

---

## 常見問題

### Q: Claude 沒有讀取 CLAUDE.md？

確認：
1. 檔案在專案根目錄
2. 重新啟動 Claude Code

### Q: /evolve 沒有反應？

確認：
1. self-evolving-agent skill 已安裝
2. 執行 `skillpkg list` 檢查

### Q: 找不到 skillpkg 命令？

skillpkg 有兩種使用方式：

**方式 A: MCP Server（推薦，Claude Code 內直接使用）**

不需要安裝 CLI！skillpkg MCP Server 已配置在專案中。
Claude Code 會自動使用 `recommend_skill`、`install_skill` 等工具。

只需在 Claude Code 中說：
```
幫我安裝 frontend 技能
```

**方式 B: 獨立 CLI（用於終端機操作）**

```bash
# 方式 1: npx 臨時使用（不需安裝）
npx skillpkg-cli list
npx skillpkg-cli search "frontend"

# 方式 2: 全域安裝
npm install -g skillpkg-cli

# 驗證安裝
skillpkg --version
```

### Q: MCP Server 沒有回應？

確認 `.mcp.json` 存在且格式正確：
```bash
cat .mcp.json | jq .
```

重新啟動 Claude Code session。

---

## 下一步

| 目標 | 推薦閱讀 |
|------|---------|
| 了解完整功能 | [USAGE_TUTORIAL.md](USAGE_TUTORIAL.md) |
| 學習 /evolve | [../templates/README.md](../templates/README.md) |
| 探索技能 | `skillpkg search "你需要的功能"` |
| 安裝領域技能 | `skillpkg install miles990/claude-domain-skills` |

---

## 快速指令參考

```bash
# 常用 Claude Code 指令
/evolve [目標]        # 自我進化執行任務
/memory              # 查看記憶系統
/context             # 查看當前上下文

# skillpkg 指令
skillpkg search      # 搜尋技能
skillpkg install     # 安裝技能
skillpkg list        # 列出已安裝
skillpkg sync        # 同步技能
```

---

## 成功！

如果你完成了上述步驟，你已經準備好使用 Claude Starter Kit 了！

```
       ✅ 安裝完成
       ✅ Claude Code 正常運作
       ✅ 可以開始自我進化開發！

🎉 開始你的第一個 /evolve 任務吧！
```
