# Templates

> 可重用的模板和範例檔案

## 目錄結構

```
templates/
├── README.md              # 本文件
├── presets.json           # skillpkg 預設配置
├── init-script.sh         # 初始化腳本
│
├── interfaces/            # Domain → Software 接口映射
│   ├── README.md
│   ├── finance-to-tech.md
│   ├── business-to-tech.md
│   └── creative-to-tech.md
│
├── skill-triggers/        # Triggers 格式範例
│   ├── README.md
│   └── examples/
│       ├── quant-trading-triggers.yaml
│       ├── frontend-triggers.yaml
│       └── python-triggers.yaml
│
└── Skill Enhancement      # 三層品質保證範例
    ├── sharp-edges-example.md
    ├── validations-example.md
    └── collaboration-example.md
```

## 模板用途

### 1. Interfaces (接口映射)

定義 domain skills 如何映射到 software skills：

```markdown
finance → [python, database, api-design]
business → [backend, frontend, testing-strategies]
creative → [frontend, game-development, ai-ml-integration]
```

### 2. Skill Triggers (觸發詞)

定義 skill 的智能匹配關鍵詞：

```yaml
triggers:
  keywords:
    primary: [主要關鍵詞]
    secondary: [次要關鍵詞]
  context_boost: [提升信心的上下文]
  context_penalty: [降低信心的上下文]
  priority: high|medium|low
```

### 3. Skill Enhancement (三層品質)

| 層級 | 模板 | 用途 |
|------|------|------|
| Sharp Edges | `sharp-edges-example.md` | 常見陷阱警告 |
| Validations | `validations-example.md` | 代碼品質驗證 |
| Collaboration | `collaboration-example.md` | 技能協作網絡 |

## 如何使用

### 為新 Skill 添加 Triggers

1. 複製 `skill-triggers/examples/` 中的範例
2. 修改 keywords 和 context
3. 貼入 SKILL.md 的 frontmatter

### 為新 Skill 添加 Sharp Edges

1. 參考 `sharp-edges-example.md` 格式
2. 識別領域特有的陷阱
3. 添加到 SKILL.md 的 `## Sharp Edges` 區塊

## 相關文檔

- [docs/SHARP_EDGES_FORMAT.md](../docs/SHARP_EDGES_FORMAT.md)
- [docs/VALIDATIONS_FORMAT.md](../docs/VALIDATIONS_FORMAT.md)
- [docs/COLLABORATION_FORMAT.md](../docs/COLLABORATION_FORMAT.md)
