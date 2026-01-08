# Claude Starter Kit

> 一行指令，開始自我進化開發

[![npm version](https://badge.fury.io/js/claude-starter-kit.svg)](https://www.npmjs.com/package/claude-starter-kit)

**快速連結**: [QUICKSTART](docs/QUICKSTART.md) | [生態系統教學](docs/ECOSYSTEM_TUTORIAL.md) | [CHEATSHEET](docs/CHEATSHEET.md) | [Personas](personas/README.md)

---

## 30 秒快速開始

```bash
# 在你的專案目錄執行
npx claude-starter-kit

# 打開 Claude Code
claude

# 開始自我進化開發
/evolve 你想做的事情
```

就這樣！Claude 會自動學習需要的技能並完成任務。

---

## 這是什麼？

```
┌─────────────────────────────────────────────────────────────────┐
│                    Claude Code 生態系統                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │  claude-starter-kit │  ← 你在這裡！入口專案                   │
│  │  (配置 + 記憶)      │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │      skillpkg       │  ← 技能管理器 (MCP + CLI)              │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│     ┌───────┴───────┐                                           │
│     ▼               ▼                                           │
│  ┌──────────┐  ┌──────────┐                                     │
│  │ software │  │  domain  │  ← 技能庫                           │
│  │  skills  │  │  skills  │                                     │
│  │ (50 個)  │  │ (16 個)  │                                     │
│  └──────────┘  └──────────┘                                     │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ self-evolving-agent │  ← 自我進化引擎                        │
│  └─────────────────────┘                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Claude Starter Kit 自動幫你設置：

| 功能 | 說明 |
|------|------|
| **記憶系統** | Claude 會記住學到的東西，避免重複踩坑 |
| **自我進化** | 自動分析 → 學習 → 執行 → 改進的 PDCA 循環 |
| **技能管理** | 66 個專業技能，按需安裝 |
| **智能診斷** | `doctor` 指令檢查與修復生態系統配置 |

---

## CLI 指令

### 初始化專案

```bash
# 互動式設定
npx claude-starter-kit

# 使用 Persona 快速設定
npx claude-starter-kit --persona startup-mvp
npx claude-starter-kit --persona enterprise
npx claude-starter-kit --persona fullstack
npx claude-starter-kit --persona research

# 快速模式（使用預設值）
npx claude-starter-kit -y
```

### 智能診斷 (Doctor)

```bash
# 健康檢查（診斷 8 項配置）
npx claude-starter-kit doctor

# 自動修復模式
npx claude-starter-kit doctor --fix

# 專案分析（偵測技術棧並推薦技能）
npx claude-starter-kit doctor --discover
```

#### --discover 偵測的技術棧

| 類別 | 支援 |
|------|------|
| **Frontend** | React, Vue, Svelte, Next.js, Nuxt |
| **Backend** | Express, Fastify, NestJS, Hono |
| **Database** | Prisma, MongoDB, PostgreSQL, MySQL, Redis |
| **Testing** | Jest, Vitest, Playwright, Cypress |
| **Languages** | TypeScript, Python, Go, Rust, Java, Ruby, PHP |

---

## 選擇你的 Persona

根據專案類型選擇預配置：

| Persona | 適用場景 | 哲學 |
|---------|---------|------|
| [startup-mvp](personas/startup-mvp/) | 快速原型、MVP | Ship fast, iterate faster |
| [enterprise](personas/enterprise/) | 企業專案、合規需求 | Stability and security first |
| [fullstack](personas/fullstack/) | 全端 Web 開發 | API-first, end-to-end integration |
| [research](personas/research/) | 研究探索、數據分析 | Deep exploration, thorough documentation |

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

# 涌現模式（跨領域連結）
/evolve 改進專案架構 --emergence
```

Claude 會自動：
1. 分析目標並拆解任務
2. 搜尋過去經驗（Memory）
3. 學習需要的技能（Skills）
4. PDCA 迭代執行直到完成
5. 記錄學到的經驗

---

## 產生的檔案結構

```
your-project/
├── CLAUDE.md              # 專案說明（Claude 會讀）
├── skillpkg.json          # 技能配置
├── .mcp.json              # MCP Server 配置
└── .claude/
    ├── memory/            # 經驗記憶（Git 版本控制）
    │   ├── index.md       # 快速索引
    │   ├── learnings/     # 成功經驗
    │   ├── failures/      # 失敗教訓
    │   ├── decisions/     # 架構決策 (ADR)
    │   └── patterns/      # 推理模式
    ├── rules/             # 自動載入規則
    └── skills/            # 已安裝技能
```

---

## 技能管理

**在 Claude Code 中（推薦）：**
```
幫我安裝 backend 技能
搜尋 frontend 相關的技能
列出已安裝的技能
```

**或使用 CLI：**
```bash
npx skillpkg-cli search "你要的功能"
npx skillpkg-cli install github:user/repo
npx skillpkg-cli list
npx skillpkg-cli sync
```

**或使用 doctor 自動推薦：**
```bash
npx claude-starter-kit doctor --discover
```

---

## 文檔

| 文檔 | 說明 |
|------|------|
| [QUICKSTART.md](docs/QUICKSTART.md) | 5 分鐘快速開始 |
| [ECOSYSTEM_TUTORIAL.md](docs/ECOSYSTEM_TUTORIAL.md) | 生態系統完整教學 ⭐ |
| [CHEATSHEET.md](docs/CHEATSHEET.md) | 常用指令速查 |
| [Personas](personas/README.md) | 專案類型預配置 |
| [文檔導覽](docs/README.md) | 所有文檔索引 |

---

## 生態系統

| 專案 | 說明 |
|------|------|
| [skillpkg](https://github.com/miles990/skillpkg) | AI 技能包管理器 |
| [self-evolving-agent](https://github.com/miles990/self-evolving-agent) | 自我進化 Agent Skill |
| [claude-software-skills](https://github.com/miles990/claude-software-skills) | 50+ 軟體開發技能 |
| [claude-domain-skills](https://github.com/miles990/claude-domain-skills) | 16 領域專業技能 |

---

## Contributing

歡迎貢獻！請參閱各專案的 Contributing Guide。

## License

MIT
