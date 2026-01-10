---
date: 2026-01-10
tags: [documentation, readme, best-practice, anti-pattern]
task: 文檔結構管理
status: resolved
---

# README 放置原則：目錄說明 vs 內容重複

## 情境

在 CLI v2.1 開發時，新增 GitHub Actions CI，同時創建了 `.github/README.md`。
但這個檔案之前已經被刪除過（commit `1c6f867`），原因是「減少文檔碎片化」。

## 問題

1. 沒有先查 Memory 就創建檔案，導致重複犯錯
2. `.github/README.md` 內容和 CHEATSHEET 重複

## 教訓

### README 放置原則

| 類型 | 說明 | 例子 |
|------|------|------|
| ✅ 目錄說明 | 解釋「這個資料夾是什麼、怎麼用」 | `.claude/README.md` 解釋目錄結構 |
| ❌ 內容重複 | 複製主文檔已有的內容 | `.github/README.md` 重複 CI 說明 |

### 合理的 README 分布

```
./README.md           # 專案主入口
./docs/README.md      # 文檔目錄索引
./personas/README.md  # Persona 說明（該目錄特有內容）
./.claude/README.md   # .claude 目錄結構說明
```

### 不合理的 README

```
./.github/README.md   # ❌ 內容已在 CHEATSHEET 中
./src/README.md       # ❌ 如果只是重複主 README 的技術說明
```

## 防止重複的檢查

創建任何文檔前，執行：

```bash
# 1. 檢查是否曾經存在又被刪除
git log --all --oneline -- "path/to/file"

# 2. 搜尋 Memory 中的相關決策
grep -r "README\|文檔" .claude/memory/
```

## 根本原因

違反了 evolve skill 的 **Checkpoint 1: 任務開始前必須查 Memory**

## 相關 Commits

- `1c6f867` - 首次移除 .github/README.md
- `4fbf314` - 錯誤地重建（未查 Memory）
- `405cb36` - 再次移除
