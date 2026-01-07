# skillpkg init 功能提案

> 為 skillpkg 新增互動式初始化功能，讓用戶可以一鍵配置 Claude Code 開發環境

## 使用方式

```bash
# 互動式初始化（推薦）
skillpkg init

# 使用預設配置
skillpkg init --preset=standard

# 指定模板
skillpkg init --template=miles990/claude-starter-kit

# 添加領域配置
skillpkg init --preset=standard --domain=frontend
```

## 功能設計

### 1. 預設配置（Presets）

| Preset | 包含內容 | 適用場景 |
|--------|---------|---------|
| `minimal` | CLAUDE.md + 基本規則 | 快速開始 |
| `standard` | + Memory + Self-evolving | 大多數專案 |
| `full` | + 47 個 Software Skills | 完整功能 |
| `custom` | 互動選擇 | 進階用戶 |

### 2. 可選模組（Components）

```
☑ CLAUDE.md           - 專案入口
☑ Basic Rules         - 程式碼品質 + 測試
☑ MCP Configuration   - skillpkg + context7
☑ Memory System       - .claude/memory/
☐ Self-Evolving Agent - 自動進化技能
☐ Software Skills     - 47 個領域技能
```

### 3. 領域包（Domain Packs）

```
○ None        - 通用
○ Frontend    - React, Vue, CSS
○ Backend     - Node.js, Python, APIs
○ Full-Stack  - 前後端
○ DevOps      - CI/CD, Docker
○ AI/ML       - 機器學習
```

### 4. 非侵入式安裝

核心原則：**只添加，不修改**

```
安裝前                      安裝後
my-project/                 my-project/
├── src/          →         ├── src/           ← 不動
├── package.json  →         ├── package.json   ← 不動
└── README.md     →         ├── README.md      ← 不動
                            ├── CLAUDE.md      ← 新增
                            ├── skillpkg.json  ← 新增
                            ├── .mcp.json      ← 新增
                            ├── .claude/       ← 新增
                            │   ├── rules/
                            │   └── skills/
                            └── .claude/memory/ ← 新增
```

如果檔案已存在：
- 跳過，不覆蓋
- 顯示 "○ file.md (already exists, skipped)"

### 5. 模板系統

支援從 GitHub 載入模板：

```bash
# 官方模板
skillpkg init --template=starter-kit

# 社群模板
skillpkg init --template=user/custom-template

# 本地模板
skillpkg init --template=./my-template
```

模板結構：
```
template/
├── presets.json      # 預設配置定義
├── components/       # 可選模組
│   ├── claude-md/
│   ├── basic-rules/
│   ├── memory-system/
│   └── ...
└── domains/          # 領域包
    ├── frontend/
    ├── backend/
    └── ...
```

## 實作建議

### 新增 CLI 命令

```typescript
// packages/skillpkg-cli/src/commands/init.ts

import { Command } from 'commander';
import inquirer from 'inquirer';

export const initCommand = new Command('init')
  .description('Initialize Claude Code configuration in current project')
  .option('-p, --preset <preset>', 'Use preset configuration (minimal, standard, full)')
  .option('-t, --template <template>', 'Use custom template')
  .option('-d, --domain <domain>', 'Add domain-specific configuration')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .action(async (options) => {
    // 1. 檢測現有配置
    const existing = await detectExistingConfig();

    // 2. 互動式選擇（如果沒有 --yes）
    const config = options.yes
      ? getDefaultConfig(options.preset)
      : await promptConfig(options);

    // 3. 載入模板
    const template = await loadTemplate(options.template || 'starter-kit');

    // 4. 安裝配置（非侵入式）
    await installConfig(config, template, { skipExisting: true });

    // 5. 安裝 skills
    if (config.skills.length > 0) {
      await installSkills(config.skills);
    }

    // 6. 同步到平台
    await syncSkills();

    console.log('✓ Setup complete!');
  });
```

### 新增 MCP 工具

```typescript
// packages/skillpkg-mcp-server/src/tools/init.ts

export const initProjectTool = {
  name: 'init_project',
  description: 'Initialize Claude Code configuration in a project',
  parameters: {
    preset: {
      type: 'string',
      enum: ['minimal', 'standard', 'full'],
      description: 'Configuration preset'
    },
    domain: {
      type: 'string',
      enum: ['frontend', 'backend', 'fullstack', 'devops'],
      description: 'Domain-specific configuration'
    },
    path: {
      type: 'string',
      description: 'Project path (default: current directory)'
    }
  }
};
```

## 與 Self-Evolving Agent 整合

Agent 在 Phase -1（環境準備）可以自動使用此功能：

```yaml
Phase -1: 環境檢查
  步驟 7: Claude Code 配置檢查
    - 檢查是否有 CLAUDE.md
    - 檢查是否有 .claude/rules/
    - 如果缺少 → 使用 init_project 工具自動配置
```

## 用戶體驗

```
$ skillpkg init

╭───────────────────────────────────────────────╮
│  Claude Code Configuration Wizard             │
│  Non-invasive: Only adds new files            │
╰───────────────────────────────────────────────╯

? Choose a preset:
  ○ Minimal     - Just CLAUDE.md + basic rules
  ● Standard    - Memory system + self-evolving agent (Recommended)
  ○ Full        - Everything including 47 software skills
  ○ Custom      - Choose exactly what you need

? Add domain-specific rules?
  ● None        - General purpose
  ○ Frontend    - React, Vue, CSS rules
  ○ Backend     - Node.js, API rules
  ○ Full-Stack  - Frontend + Backend
  ○ DevOps      - CI/CD, Docker rules

[1/4] Creating CLAUDE.md...
  ✓ CLAUDE.md
[2/4] Installing rules...
  ✓ .claude/rules/code-quality.md
  ✓ .claude/rules/testing.md
  ○ .claude/rules/custom.md (already exists, skipped)
[3/4] Setting up memory system...
  ✓ .claude/memory/ structure
[4/4] Installing skills...
  ✓ self-evolving-agent installed

╭───────────────────────────────────────────────╮
│  Setup Complete!                              │
╰───────────────────────────────────────────────╯

Next steps:
  1. Start Claude Code:  claude
  2. Try evolving:       /evolve [your goal]
  3. Edit memory:        /memory
```

## 好處

1. **一鍵配置** - 新用戶可以快速開始
2. **非侵入式** - 不破壞現有專案結構
3. **靈活選擇** - 從最小到完整都支援
4. **領域特化** - 針對不同開發領域優化
5. **模板系統** - 社群可以貢獻模板
6. **與 MCP 整合** - AI 可以自動配置環境
