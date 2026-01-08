# Spec Workflow

> spec-workflow MCP Server 生成的規格文檔

## 目的

此目錄存放使用 [spec-workflow](https://github.com/StuMason/mcp-spec-workflow) MCP Server 生成的規格文檔，用於：

1. **任務追蹤** - 記錄規格中的任務完成狀態
2. **設計決策** - 保存設計文檔 (design.md)
3. **需求追溯** - 維護需求與實作的連結

## 目錄結構

```
.spec-workflow/
├── README.md                    # 本文件
└── specs/
    ├── ecosystem-intelligence/  # 生態系統智能化規格
    │   ├── requirements.md      # 需求定義
    │   ├── design.md           # 設計文檔
    │   └── tasks.md            # 任務追蹤 (4/14 完成)
    └── spawner-integration/     # Spawner 整合規格
        ├── requirements.md
        ├── design.md
        └── tasks.md            # ✅ 12/12 完成
```

## 是否應該提交？

**建議：保留並提交**

理由：
- 提供歷史脈絡和設計決策記錄
- 幫助新貢獻者了解專案演進
- 追蹤未完成的功能任務

## 使用方式

```bash
# 查看規格狀態
cat .spec-workflow/specs/*/tasks.md | grep -E "^\- \[.\]"

# 統計完成進度
grep -r "\[x\]" .spec-workflow/ | wc -l  # 已完成
grep -r "\[ \]" .spec-workflow/ | wc -l  # 待完成
```

## 相關文檔

- [spec-workflow-guide](https://github.com/StuMason/mcp-spec-workflow)
- [INTELLIGENT_ECOSYSTEM_GUIDE.md](../docs/INTELLIGENT_ECOSYSTEM_GUIDE.md)
