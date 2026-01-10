# 故障排除指南

> 解決 Claude Code 生態系統常見問題

---

## 目錄

1. [快速診斷](#快速診斷)
2. [Skill 相關問題](#skill-相關問題)
3. [Memory 系統問題](#memory-系統問題)
4. [MCP 連接問題](#mcp-連接問題)
5. [版本兼容問題](#版本兼容問題)
6. [效能問題](#效能問題)

---

## 快速診斷

### 一鍵檢查腳本

```bash
# 執行完整健康檢查
echo "=== 1. Git Status ===" && git status --short
echo ""
echo "=== 2. CLAUDE.md ===" && (ls CLAUDE.md 2>/dev/null && echo "✅ 存在") || echo "❌ 缺失"
echo ""
echo "=== 3. Memory System ===" && (ls .claude/memory/index.md 2>/dev/null && echo "✅ 已初始化") || echo "❌ 未初始化"
echo ""
echo "=== 4. Skills ===" && ls .claude/skills/ 2>/dev/null | wc -l | xargs -I {} echo "已安裝 {} 個 skills"
echo ""
echo "=== 5. MCP Config ===" && (ls .mcp.json 2>/dev/null && echo "✅ 存在") || echo "⚠️ 缺失 (可選)"
```

### 常見錯誤快速索引

| 錯誤訊息 | 可能原因 | 快速解決 |
|----------|----------|----------|
| `Skill not found` | skill 未安裝 | `skillpkg install <skill-name>` |
| `Invalid SKILL.md` | 格式錯誤 | 檢查 frontmatter 格式 |
| `Memory not initialized` | 缺少 .claude/memory/ | 執行初始化 |
| `MCP connection failed` | MCP 服務未啟動 | 重啟 Claude Code |
| `Version mismatch` | 版本不兼容 | 查看 ecosystem.json |

---

## Skill 相關問題

### ❌ Skill 找不到

**症狀：** `recommend_skill` 或 `load_skill` 找不到 skill

**診斷步驟：**

```bash
# 1. 檢查是否已安裝
skillpkg list

# 2. 檢查 .claude/skills/ 目錄
ls -la .claude/skills/

# 3. 搜尋可用 skill
skillpkg search "關鍵字"
```

**解決方案：**

```bash
# 方案 A: 安裝缺失的 skill
skillpkg install github:miles990/claude-software-skills

# 方案 B: 同步到 Claude Code
skillpkg sync

# 方案 C: 重新安裝
skillpkg uninstall skill-name
skillpkg install skill-name
```

---

### ❌ SKILL.md 格式錯誤

**症狀：** `Invalid SKILL.md format` 或解析失敗

**常見原因：**

1. **Frontmatter 格式錯誤**

```yaml
# ❌ 錯誤：缺少分隔符
name: my-skill
description: A skill

# ✅ 正確：有完整分隔符
---
name: my-skill
description: A skill
---

# Instructions here...
```

2. **必填欄位缺失**

```yaml
# ❌ 錯誤：缺少 description
---
name: my-skill
---

# ✅ 正確：包含必填欄位
---
name: my-skill
description: Use when you need to...
---
```

3. **縮排問題**

```yaml
# ❌ 錯誤：混用 tab 和空格
---
name: my-skill
	description: Wrong indent  # tab

# ✅ 正確：統一使用空格
---
name: my-skill
description: Correct indent  # spaces
```

**驗證格式：**

```bash
# 使用 skillpkg 驗證
skillpkg info my-skill
```

---

### ❌ Skill 載入後不生效

**症狀：** `load_skill` 成功但行為沒變化

**診斷步驟：**

1. **確認 skill 已載入**
   - 檢查 Claude Code 輸出是否顯示 skill instructions

2. **檢查 triggers 匹配**
   - skill 的 triggers 是否匹配當前任務

3. **檢查 skill 優先級**
   - 多個 skill 可能衝突

**解決方案：**

```bash
# 明確指定要載入的 skill
load_skill({ id: "specific-skill-name" })

# 查看 skill 詳情確認 triggers
skillpkg info skill-name
```

---

## Memory 系統問題

### ❌ Memory 未初始化

**症狀：** `.claude/memory/` 目錄不存在

**解決方案：**

```bash
# 建立完整目錄結構
mkdir -p .claude/memory/{learnings,failures,decisions,patterns,strategies,discoveries}

# 建立 index.md
cat > .claude/memory/index.md << 'EOF'
# Project Memory Index

> Auto-maintained index. Search with: `Grep pattern="keyword" path=".claude/memory/"`

## Metadata

| Field | Value |
|-------|-------|
| Last curated | $(date +%Y-%m-%d) |
| Total entries | 0 |
| Next review | $(date -d "+1 month" +%Y-%m-%d) |

---

## Recent Learnings
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## Important Decisions
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## Failure Records
<!-- FAILURES_START -->
<!-- FAILURES_END -->

## Reasoning Patterns
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->

## Discoveries
<!-- DISCOVERIES_START -->
<!-- DISCOVERIES_END -->
EOF
```

---

### ❌ Memory 搜尋無結果

**症狀：** `Grep` 搜尋 memory 沒有結果

**診斷步驟：**

```bash
# 1. 確認 memory 目錄有內容
find .claude/memory/ -name "*.md" | wc -l

# 2. 檢查搜尋語法
Grep pattern="關鍵字" path=".claude/memory/"

# 3. 檢查 index.md 是否更新
cat .claude/memory/index.md
```

**常見原因：**
- memory 檔案未加入 index.md
- 搜尋關鍵字太具體
- 檔案格式不是 .md

---

### ❌ index.md 與實際檔案不同步

**症狀：** index.md 缺少條目或有過時連結

**解決方案：**

```bash
# 列出所有 memory 檔案
find .claude/memory/ -name "*.md" -not -name "index.md"

# 手動更新 index.md
# 或使用 /evolve 的 Checkpoint 3.5 自動同步
```

---

## MCP 連接問題

### ❌ MCP Server 無法連接

**症狀：** skillpkg MCP 工具不可用

**診斷步驟：**

1. **檢查 .mcp.json 配置**

```json
{
  "mcpServers": {
    "skillpkg": {
      "command": "npx",
      "args": ["-y", "skillpkg-mcp-server"]
    }
  }
}
```

2. **測試 MCP Server**

```bash
# 手動啟動測試
npx skillpkg-mcp-server
```

3. **重啟 Claude Code**
   - 關閉並重新開啟終端
   - 或執行 `/mcp` 重新連接

**解決方案：**

```bash
# 方案 A: 確認 npm 可以存取
npm ls -g skillpkg-mcp-server

# 方案 B: 清除 npm cache
npm cache clean --force

# 方案 C: 直接安裝
npm install -g skillpkg-mcp-server
```

---

### ❌ MCP 工具呼叫失敗

**症狀：** MCP 工具回傳錯誤

**常見錯誤與解決：**

| 錯誤 | 解決方案 |
|------|----------|
| `Tool not found` | 檢查工具名稱拼寫 |
| `Invalid parameters` | 檢查參數格式 |
| `Timeout` | 增加 timeout 或減少搜尋範圍 |
| `Rate limit` | 等待後重試 |

---

## 版本兼容問題

### ❌ 版本不兼容

**症狀：** 不同專案版本無法協作

**診斷：**

```bash
# 檢查當前版本
cat ecosystem.json | grep -A 5 "versions"
```

**兼容性矩陣（ecosystem.json）：**

```json
{
  "compatibility": {
    "skillpkg": ">=0.5.3",
    "self-evolving-agent": ">=3.6.0",
    "claude-software-skills": ">=1.0.0",
    "claude-domain-skills": ">=1.0.0"
  }
}
```

**升級指南：**

```bash
# 1. 更新所有 skill
skillpkg update

# 2. 重新同步
skillpkg sync

# 3. 驗證兼容性
cat ecosystem.json
```

---

### ❌ Breaking Changes 升級失敗

**症狀：** 升級後功能異常

**常見 Breaking Changes：**

| 版本 | 變更 | 遷移方式 |
|------|------|----------|
| skillpkg 0.5.5 | 格式兼容性提升 | 無需遷移 (向後兼容) |
| self-evolving-agent 3.7.0 | Checkpoint 3.5 新增 | 更新 memory 同步習慣 |
| software-skills 1.1.0 | Sharp Edges 格式 | 更新 skill 格式 |

---

## 效能問題

### ❌ Skill 搜尋太慢

**症狀：** `search_skills` 或 `recommend_skill` 回應緩慢

**優化方案：**

```bash
# 方案 A: 縮小搜尋範圍
search_skills({ query: "關鍵字", source: "local" })

# 方案 B: 增加快取
# skillpkg 會自動快取搜尋結果

# 方案 C: 減少已安裝 skill 數量
skillpkg list
skillpkg uninstall unused-skill
```

---

### ❌ Memory 檔案太多影響效能

**症狀：** memory 搜尋變慢

**優化方案：**

1. **定期整理 Memory**
   - 合併相似條目
   - 刪除過時條目
   - 標註 `[SUPERSEDED]`

2. **使用 index.md**
   - 優先查詢 index.md
   - 避免全目錄搜尋

3. **分類管理**
   - 按類型放入對應子目錄
   - learnings/ failures/ decisions/

---

## 緊急恢復

### 🚨 完全重置

如果以上方法都無效，可以完全重置：

```bash
# ⚠️ 警告：這會刪除所有本地配置

# 1. 備份重要檔案
cp -r .claude/memory ./memory-backup

# 2. 刪除 .claude 目錄
rm -rf .claude

# 3. 重新初始化
# 使用 starter-kit 範本重新設定

# 4. 恢復 memory
cp -r ./memory-backup .claude/memory
```

---

## 取得協助

如果問題仍未解決：

1. **查看 GitHub Issues**
   - [skillpkg issues](https://github.com/miles990/skillpkg/issues)
   - [self-evolving-agent issues](https://github.com/miles990/self-evolving-agent/issues)

2. **提交 Bug Report**
   - 包含錯誤訊息
   - 包含重現步驟
   - 包含環境資訊 (OS, Node version, Claude Code version)

3. **社群支援**
   - GitHub Discussions
   - Discord (如有)

---

## 相關文件

- [ECOSYSTEM_TUTORIAL.md](./ECOSYSTEM_TUTORIAL.md) - 完整教學
- [QUICKSTART.md](./QUICKSTART.md) - 快速上手
- [CHEATSHEET.md](./CHEATSHEET.md) - 指令速查
