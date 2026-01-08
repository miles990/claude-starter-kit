# Claude Starter Kit

> 一行指令，開始自我進化開發

**快速連結**: [QUICKSTART](docs/QUICKSTART.md) | [CHEATSHEET](docs/CHEATSHEET.md) | [Personas](personas/README.md) | [文檔](docs/README.md)

---

## 30 秒快速開始

```bash
# 1. 安裝
curl -fsSL https://raw.githubusercontent.com/miles990/claude-starter-kit/main/setup.sh | bash

# 2. 打開 Claude Code
claude

# 3. 開始自我進化開發
/evolve 你想做的事情
```

就這樣！Claude 會自動學習需要的技能並完成任務。

---

## 這是什麼？

Claude Starter Kit 自動幫你設置：

| 功能 | 說明 |
|------|------|
| **記憶系統** | Claude 會記住學到的東西 |
| **自我進化** | 自動分析 → 學習 → 執行 → 改進 |
| **技能管理** | 按需安裝專業技能 |
| **Skill Metrics** | 追蹤 skill 組合使用情況，發現成功模式 |

---

## 選擇你的 Persona

根據專案類型選擇預配置：

| Persona | 適用場景 | 一鍵安裝 |
|---------|---------|---------|
| [startup-mvp](personas/startup-mvp/) | 快速原型、MVP | `cp personas/startup-mvp/skillpkg.json ./` |
| [enterprise](personas/enterprise/) | 企業專案、合規需求 | `cp personas/enterprise/skillpkg.json ./` |
| [fullstack](personas/fullstack/) | 全端 Web 開發 | `cp personas/fullstack/skillpkg.json ./` |
| [research](personas/research/) | 研究探索、數據分析 | `cp personas/research/skillpkg.json ./` |

詳見 [Personas 完整說明](personas/README.md)

---

## 使用範例

```bash
# 建立 API
/evolve 建立一個 Express + TypeScript 的 RESTful API

# 優化效能
/evolve 分析這個專案的效能瓶頸並優化

# 探索模式（允許發現意外改進）
/evolve 重構這個模組 --explore
```

Claude 會自動：
1. 分析目標並拆解任務
2. 搜尋過去經驗
3. 學習需要的技能
4. 迭代執行直到完成
5. 記錄學到的經驗

---

## 產生的檔案

```
your-project/
├── CLAUDE.md              # 專案說明（Claude 會讀）
├── skillpkg.json          # 技能配置
└── .claude/
    ├── memory/            # 經驗記憶
    │   ├── index.md       # 快速索引
    │   ├── learnings/     # 成功經驗
    │   └── failures/      # 失敗教訓
    ├── rules/             # 自動載入規則
    └── skills/            # 已安裝技能
```

---

## 技能管理

**在 Claude Code 中（推薦）：**
```
幫我安裝 backend 技能
搜尋 frontend 相關的技能
```

**或使用 CLI：**
```bash
npx skillpkg-cli search "你要的功能"
npx skillpkg-cli install user/repo
npx skillpkg-cli list
```

---

## 快速連結

| 文檔 | 說明 |
|------|------|
| [QUICKSTART.md](docs/QUICKSTART.md) | 5 分鐘快速開始 |
| [CHEATSHEET.md](docs/CHEATSHEET.md) | 常用指令速查 |
| [Personas](personas/README.md) | 專案類型預配置 |
| [文檔導覽](docs/README.md) | 所有文檔索引 |
| [生態系統指南](docs/INTELLIGENT_ECOSYSTEM_GUIDE.md) | 完整功能說明 |

---

## 生態系統

| 專案 | 說明 |
|------|------|
| [skillpkg](https://github.com/miles990/skillpkg) | AI 技能包管理器 |
| [self-evolving-agent](https://github.com/miles990/self-evolving-agent) | 自我進化 Agent Skill |
| [claude-software-skills](https://github.com/miles990/claude-software-skills) | 50+ 軟體開發技能 |
| [claude-domain-skills](https://github.com/miles990/claude-domain-skills) | 16 領域專業技能 |

---

## License

MIT
