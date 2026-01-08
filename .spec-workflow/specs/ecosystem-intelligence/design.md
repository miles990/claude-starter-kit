# Design: Ecosystem Intelligence

> 生態系統智能化技術設計

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Ecosystem Intelligence                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    skillpkg (核心)                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │  Matching   │  │  Resolver   │  │   MCP Server    │   │  │
│  │  │   Engine    │  │  (跨域依賴) │  │ recommend_skills│   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │  │
│  │         │                │                  │            │  │
│  │         └────────────────┴──────────────────┘            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              self-evolving-agent (整合)                   │  │
│  │  Phase 1 目標分析 → recommend_skills → 用戶確認          │  │
│  │                              │                            │  │
│  │                  (信心 < 0.5) ▼                           │  │
│  │                      研究模式                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐     │
│  │domain-skills │  │software-skills│  │    interfaces/    │     │
│  │ + 依賴聲明   │  │  (被依賴)     │  │  領域→技術映射    │     │
│  └──────────────┘  └──────────────┘  └───────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Skill Matching Engine

**Location**: `skillpkg/packages/core/src/matching/`

```typescript
// engine.ts
interface MatchingEngine {
  // 主入口：分析目標，返回推薦
  analyze(goal: string): SkillRecommendation;

  // 內部方法
  extractKeywords(text: string): Keyword[];
  matchSkills(keywords: Keyword[], index: SkillIndex): Match[];
  calculateConfidence(matches: Match[]): number;
}

interface SkillRecommendation {
  domain_skills: SkillMatch[];
  software_skills: SkillMatch[];
  from_dependencies: string[];  // 從依賴自動加入
  overall_confidence: number;   // 整體信心分數
  research_mode: boolean;       // 是否建議研究模式
}

interface SkillMatch {
  name: string;
  confidence: number;
  reason: string;
  keywords_matched: string[];
}
```

**Keyword Index Format** (每個 SKILL.md):
```yaml
triggers:
  keywords:
    primary: [量化, quant, trading]    # 高權重
    secondary: [股票, 期貨, algo]       # 中權重
  context_boost: [Python, 金融]        # 共現加分
  context_penalty: [行銷, design]      # 共現減分
  priority: high | medium | low
```

### 2. Cross-Domain Dependency Resolver

**Location**: `skillpkg/packages/core/src/resolver/`

```typescript
// dependency-resolver.ts
interface DependencyResolver {
  // 解析 domain skill 的 software 依賴
  resolveSoftwareDeps(domainSkill: string): string[];

  // 合併所有依賴
  resolveAll(skills: string[]): ResolvedDependencies;
}

interface ResolvedDependencies {
  direct: string[];        // 直接指定的 skills
  transitive: string[];    // 依賴解析出的 skills
  conflicts: Conflict[];   // 衝突（如有）
}
```

**SKILL.md Schema Extension**:
```yaml
dependencies:
  skills:            # 同類型依賴
    - investment-analysis
  software-skills:   # 跨類型依賴 (新增)
    - python
    - database
    - api-design
```

### 3. recommend_skills MCP Tool

**Location**: `skillpkg/packages/mcp-server/src/tools/`

```typescript
// recommend-skills.ts
const recommendSkillsTool = {
  name: "recommend_skills",
  description: "根據用戶目標動態推薦 skill 組合",

  use_when: [
    "用戶描述想要建立的專案或達成的目標",
    "evolving-agent Phase 1 目標分析時",
    "starter-kit init 選擇「智能推薦」時"
  ],

  inputSchema: {
    type: "object",
    properties: {
      goal: { type: "string", description: "用戶的目標描述" },
      include_optional: { type: "boolean", default: true }
    },
    required: ["goal"]
  },

  async handler({ goal, include_optional }) {
    const engine = new MatchingEngine();
    const recommendation = engine.analyze(goal);

    if (recommendation.overall_confidence < 0.5) {
      recommendation.research_mode = true;
    }

    return recommendation;
  }
};
```

### 4. Research Mode Integration

**Location**: `self-evolving-agent/SKILL.md` Phase 1

```markdown
## Phase 1.5: 能力邊界評估（更新）

當 recommend_skills 返回 research_mode: true 時：

┌─────────────────────────────────────────────────────────┐
│  🔬 研究模式                                            │
│                                                         │
│  現有 skills 匹配度較低 (confidence: 0.35)              │
│                                                         │
│  選項：                                                 │
│  [1] 搜尋外部 skills (search_skills)                   │
│  [2] 使用現有 skills + WebSearch 研究                  │
│  [3] 繼續執行（手動處理知識缺口）                      │
└─────────────────────────────────────────────────────────┘

選擇 [2] 時：
- 安裝最相關的現有 skills
- 在 Phase 3 (Reflexion) 進行額外 WebSearch
- 學習結果記錄到 .claude/memory/learnings/
```

### 5. Interface Layer

**Location**: `claude-domain-skills/interfaces/`

```markdown
# finance-to-tech.md

## 領域需求 → 技術實現映射

| 領域需求 | 技術選擇 | Software Skills |
|---------|---------|-----------------|
| 財務資料分析 | Python + Pandas | python, database |
| 即時行情 | WebSocket | realtime-systems |
| 報告生成 | React Charts | frontend |
| 策略回測 | Backtrader | python, testing |

## 推薦組合模式

### 研究型量化
- domain: investment-analysis (深度)
- software: python, database

### 生產型量化
- domain: quant-trading (深度)
- software: python, database, api-design, devops
```

## Data Flow

```
用戶輸入目標
      │
      ▼
┌─────────────────┐
│ extractKeywords │ → [量化, 交易, 回測, 系統]
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  matchSkills    │ → domain: quant-trading (0.9)
│  (against index)│   software: python (0.7), database (0.6)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ resolveDeps     │ → 加入 quant-trading 的依賴：
│                 │   investment-analysis, api-design
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ calculateConf   │ → overall_confidence: 0.78
│                 │   research_mode: false
└────────┬────────┘
         │
         ▼
返回 SkillRecommendation
```

## File Changes Summary

| 專案 | 檔案 | 變更類型 |
|------|------|---------|
| skillpkg | `packages/core/src/matching/engine.ts` | 新增 |
| skillpkg | `packages/core/src/matching/index.ts` | 新增 |
| skillpkg | `packages/core/src/resolver/dependency-resolver.ts` | 修改 |
| skillpkg | `packages/core/src/parser/schema.ts` | 修改 |
| skillpkg | `packages/mcp-server/src/tools/recommend-skills.ts` | 新增 |
| evolving-agent | `SKILL.md` | 修改 |
| domain-skills | `finance/quant-trading/SKILL.md` | 修改 |
| domain-skills | `interfaces/finance-to-tech.md` | 新增 |
| domain-skills | `interfaces/business-to-tech.md` | 新增 |
| domain-skills | `interfaces/creative-to-tech.md` | 新增 |

## Testing Strategy

1. **Unit Tests**: MatchingEngine 各方法
2. **Integration Tests**: recommend_skills MCP tool
3. **E2E Tests**: 目標輸入 → 推薦 → 安裝流程
