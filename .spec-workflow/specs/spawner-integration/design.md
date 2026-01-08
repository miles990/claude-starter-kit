# Design: Spawner Integration

> 技術設計：整合 Spawner Skills 創新到生態系統

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Spawner Integration                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   SKILL.md 擴展                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │   │
│  │  │ Sharp    │  │Validations│ │   Collaboration      │   │   │
│  │  │ Edges    │  │          │  │                      │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   skillpkg MCP                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ validate_    │  │ suggest_     │  │ load_skill   │   │   │
│  │  │ skill        │  │ improvement  │  │ (enhanced)   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 self-evolving-agent                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ PDCA Plan   │  │ Checkpoint   │  │ Delegation   │   │   │
│  │  │ (guard check)│  │ (validation) │  │ (collab)     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Design

### 1. SKILL.md Schema Extension

**Location**: `skillpkg/packages/core/src/parser/schema.ts`

```typescript
// 新增 Sharp Edges Schema
const SharpEdgeSchema = z.object({
  id: z.string(),
  summary: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  situation: z.string(),
  why: z.string().optional(),
  symptoms: z.array(z.string()),
  detection_pattern: z.string().optional(),
  solution: z.string(),
});

// 新增 Validation Schema
const ValidationSchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  type: z.enum(['regex', 'ast', 'custom']),
  pattern: z.string(),
  message: z.string(),
  fix_action: z.string().optional(),
  applies_to: z.array(z.string()),
});

// 新增 Collaboration Schema
const CollaborationSchema = z.object({
  prerequisites: z.array(z.object({
    skill: z.string(),
    reason: z.string(),
  })).optional(),
  delegation_triggers: z.array(z.object({
    trigger: z.string(),
    delegate_to: z.string(),
    context: z.string().optional(),
  })).optional(),
  receives_context_from: z.array(z.object({
    skill: z.string(),
    receives: z.array(z.string()),
  })).optional(),
  provides_context_to: z.array(z.object({
    skill: z.string(),
    provides: z.array(z.string()),
  })).optional(),
});

// 擴展主 Schema
const SkillSchema = z.object({
  // ... 現有欄位 ...
  sharp_edges: z.array(SharpEdgeSchema).optional(),
  validations: z.array(ValidationSchema).optional(),
  collaboration: CollaborationSchema.optional(),
});
```

---

### 2. SKILL.md Markdown 格式

**策略**: 同時支援 Markdown 區塊和 YAML frontmatter

```markdown
---
name: error-handling
version: 1.0.0
# 結構化資料放 frontmatter
collaboration:
  prerequisites:
    - skill: typescript-strict
      reason: Type-safe error handling
  delegation_triggers:
    - trigger: API error responses
      delegate_to: api-design
---

# Error Handling Skill

## Instructions
[正常的 skill instructions]

## Sharp Edges
<!-- Markdown 區塊，易於閱讀 -->

### SE-1: 空的 catch block
- **嚴重度**: critical
- **情境**: 支付流程靜默失敗
- **症狀**:
  - 用戶幾天後才報告問題
  - Logs 沒有錯誤記錄
- **檢測**: `catch.*\{\s*\}`
- **解決**:
  ```typescript
  // WRONG
  try { await pay(); } catch (e) { /* Silent */ }

  // RIGHT
  catch (error) {
    logger.error({ error }, "Payment failed");
    throw error;
  }
  ```

## Validations
<!-- 可執行的規則 -->

### V-1: no-empty-catch
- **類型**: regex
- **模式**: `catch\s*\([^)]*\)\s*\{\s*\}`
- **訊息**: Empty catch block swallows errors
- **修復**: Add proper error logging
- **適用**: `*.ts`, `*.js`
```

---

### 3. Parser Enhancement

**Location**: `skillpkg/packages/core/src/parser/markdown-parser.ts`

```typescript
export function parseSkillMarkdown(content: string): SkillDocument {
  const { frontmatter, body } = parseFrontmatter(content);

  // 解析 Markdown 區塊
  const sharpEdges = parseSharpEdgesSection(body);
  const validations = parseValidationsSection(body);

  // 合併 frontmatter 和 markdown 區塊
  return {
    ...frontmatter,
    sharp_edges: frontmatter.sharp_edges || sharpEdges,
    validations: frontmatter.validations || validations,
    collaboration: frontmatter.collaboration,
    instructions: extractInstructions(body),
  };
}

function parseSharpEdgesSection(body: string): SharpEdge[] {
  const section = extractSection(body, '## Sharp Edges');
  if (!section) return [];

  // 解析每個 ### 子標題為一個 sharp edge
  return parseMarkdownSubsections(section).map(parseSharpEdge);
}
```

---

### 4. MCP Tools

#### 4.1 validate_skill

**Location**: `skillpkg/packages/mcp-server/src/tools/validate-skill.ts`

```typescript
export const validateSkillTool = {
  name: 'validate_skill',
  description: 'Execute validations from current skill against code',
  inputSchema: {
    type: 'object',
    properties: {
      skill_id: { type: 'string', description: 'Skill to use for validation' },
      target_path: { type: 'string', description: 'File or directory to validate' },
      severity_filter: {
        type: 'string',
        enum: ['all', 'critical', 'high'],
        default: 'all'
      },
    },
    required: ['skill_id', 'target_path'],
  },
  async execute({ skill_id, target_path, severity_filter }) {
    const skill = await loadSkill(skill_id);
    const validations = skill.validations || [];

    const results = await Promise.all(
      validations
        .filter(v => shouldInclude(v.severity, severity_filter))
        .map(v => runValidation(v, target_path))
    );

    return {
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      issues: results.filter(r => !r.passed).map(r => ({
        validation: r.validation.name,
        file: r.file,
        line: r.line,
        message: r.validation.message,
        fix: r.validation.fix_action,
      })),
    };
  },
};
```

#### 4.2 suggest_improvement

**Location**: `skillpkg/packages/mcp-server/src/tools/suggest-improvement.ts`

```typescript
export const suggestImprovementTool = {
  name: 'suggest_improvement',
  description: 'Suggest improvements based on sharp edges',
  inputSchema: {
    type: 'object',
    properties: {
      skill_id: { type: 'string' },
      code_context: { type: 'string', description: 'Code or error to analyze' },
    },
    required: ['skill_id', 'code_context'],
  },
  async execute({ skill_id, code_context }) {
    const skill = await loadSkill(skill_id);
    const sharpEdges = skill.sharp_edges || [];

    const matches = sharpEdges.filter(edge =>
      edge.symptoms.some(symptom =>
        code_context.toLowerCase().includes(symptom.toLowerCase())
      ) ||
      (edge.detection_pattern &&
       new RegExp(edge.detection_pattern).test(code_context))
    );

    return {
      matched_edges: matches.map(edge => ({
        id: edge.id,
        summary: edge.summary,
        severity: edge.severity,
        solution: edge.solution,
      })),
      suggestions: matches.map(edge => edge.solution),
    };
  },
};
```

---

### 5. Self-Evolving Agent Integration

**Location**: `self-evolving-agent/SKILL.md`

#### 5.1 PDCA Plan 階段整合

```markdown
┌─ Plan（規劃）─────────────────────────────────────────┐
│  - 制定具體執行計劃                                   │
│  - 預測可能的問題                                     │
│  - 準備備選方案                                       │
│  - 🛡️ 檢查 sharp_edges 是否有相關警告（新增）        │
│    → suggest_improvement({ skill_id, context })       │
│  - 🤝 檢查 collaboration.delegation_triggers（新增）  │
│    → 是否需要委派給其他 skill？                       │
└───────────────────────────────────────────────────────┘
```

#### 5.2 PDCA Check 階段整合

```markdown
┌─ Check（評估）────────────────────────────────────────┐
│  - 結果是否符合預期？                                 │
│  - 如果失敗，分析原因                                 │
│  - 🔍 執行 validate_skill 檢查代碼品質（新增）       │
│    → validate_skill({ skill_id, target_path })        │
│  - 根據 validation 結果決定是否需要修復              │
└───────────────────────────────────────────────────────┘
```

---

### 6. Collaboration Graph

**新概念**: 建立技能協作圖

```typescript
// skillpkg/packages/core/src/graph/collaboration-graph.ts

export class CollaborationGraph {
  private adjacencyList: Map<string, CollaborationEdge[]> = new Map();

  addSkill(skill: SkillDocument) {
    const edges: CollaborationEdge[] = [];

    // Prerequisites = incoming edges
    skill.collaboration?.prerequisites?.forEach(p => {
      edges.push({ from: p.skill, to: skill.name, type: 'prerequisite' });
    });

    // Delegation triggers = conditional edges
    skill.collaboration?.delegation_triggers?.forEach(d => {
      edges.push({
        from: skill.name,
        to: d.delegate_to,
        type: 'delegation',
        condition: d.trigger,
      });
    });

    this.adjacencyList.set(skill.name, edges);
  }

  // 找出所有相關 skills
  getRelatedSkills(skillName: string, depth: number = 2): string[] {
    // BFS 遍歷
  }

  // 根據條件找委派目標
  findDelegationTarget(skillName: string, context: string): string | null {
    const edges = this.adjacencyList.get(skillName) || [];
    return edges
      .filter(e => e.type === 'delegation')
      .find(e => context.includes(e.condition))
      ?.to || null;
  }
}
```

---

## Data Flow

```
User Goal → recommend_skills → load_skill
                                   │
                                   ▼
                         ┌─────────────────┐
                         │   SKILL.md      │
                         │ • instructions  │
                         │ • sharp_edges   │
                         │ • validations   │
                         │ • collaboration │
                         └─────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │ suggest_        │ │ validate_       │ │ findDelegation  │
    │ improvement     │ │ skill           │ │ Target          │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  PDCA Cycle     │
                         │  (enhanced)     │
                         └─────────────────┘
```

---

## Migration Strategy

### Phase 1: Schema 擴展（向後相容）
- 所有新欄位都是 optional
- 現有 SKILL.md 無需修改即可繼續使用

### Phase 2: 漸進式添加內容
- 先為高價值 skills 添加 sharp_edges
- 基於實際經驗添加 validations
- 根據使用模式建立 collaboration

### Phase 3: 工具整合
- MCP tools 漸進式發布
- self-evolving-agent 可選使用新功能

---

## Testing Strategy

| 層級 | 測試重點 |
|------|----------|
| Unit | Schema 解析、Validation 執行 |
| Integration | MCP tools 端到端 |
| E2E | /evolve 流程整合 |

---

## Risks & Mitigations

| 風險 | 緩解策略 |
|------|----------|
| Schema 過於複雜 | 保持 Markdown 區塊格式，易讀易寫 |
| Validation 誤報 | 提供 severity filter，允許跳過 |
| Collaboration 循環依賴 | 圖遍歷時限制深度 |
