# Claude Skills

> 已安裝的技能（透過 skillpkg 同步）

## 概念

此目錄存放透過 `skillpkg sync` 同步的技能。技能提供 Claude 特定領域的專業知識。

## 安裝方式

```bash
# 搜尋技能
skillpkg search "你需要的功能"

# 安裝技能
skillpkg install user/repo

# 同步到此目錄
skillpkg sync --target=claude-code
```

## 目錄結構

安裝後的結構：

```
.claude/skills/
├── README.md                    # 本文件
├── .gitkeep
├── self-evolving-agent/         # 自我進化代理
│   └── SKILL.md
└── software-skills/             # 軟體技能集
    ├── backend/SKILL.md
    ├── frontend/SKILL.md
    └── ...
```

## 為什麼 gitignore？

`.gitignore` 排除了安裝的技能：

```gitignore
.claude/skills/self-evolving-agent/
.claude/skills/software-skills/
```

原因：
1. **避免重複** - 技能已在各自的 repo 版本控制
2. **節省空間** - 技能可以按需安裝
3. **保持更新** - 每次 sync 獲取最新版本

## 手動安裝

如果需要手動安裝：

```bash
# 複製技能到此目錄
cp -r /path/to/skill .claude/skills/

# 或使用 skillpkg
skillpkg install github:user/repo
skillpkg sync
```

## 相關文檔

- [skillpkg 使用指南](../rules/skillpkg-usage.md)
- [Self-Evolving Agent](https://github.com/miles990/self-evolving-agent)
- [Software Skills](https://github.com/miles990/claude-software-skills)
